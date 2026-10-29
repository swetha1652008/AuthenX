import { createServer } from 'vite';
import assert from 'assert';

if (typeof global.localStorage === 'undefined') {
  const store = {};
  global.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };
}

async function testContentlessPdf() {
  console.log('='.repeat(70));
  console.log('TESTING CONTENTLESS / NON-STATUTORY PDF BEHAVIOR');
  console.log('='.repeat(70));

  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const { validateExtractedDocument } = await vite.ssrLoadModule('/src/services/realOcrService.ts');
    const { runDocumentVerification } = await vite.ssrLoadModule('/src/services/documentVerificationEngine.ts');

    const mockApp = {
      id: 'APP-2026-AICTE-8491',
      institutionId: '1-938210941',
      institution: {
        id: 'inst_apex',
        name: 'Apex Institute of Technology & Science',
        aictePermanentId: '1-938210941'
      }
    };

    // Case 1: Empty or near-empty text (e.g. blank page or unreadable scan)
    console.log('\n--- Case 1: Empty or Near-Empty PDF (under 50 chars) ---');
    const resultEmpty = validateExtractedDocument(
      'doc_empty_01',
      'blank_document.pdf',
      'No Objection Certificate (NOC)',
      'Page 1 of 1',
      mockApp
    );
    console.log('Empty doc anomalies:', resultEmpty.anomalies.map(a => a.explanation));
    assert.strictEqual(resultEmpty.anomalies.some(a => a.severity === 'CRITICAL'), true, 'Must flag critical anomaly for insufficient text');
    assert.strictEqual(resultEmpty.verificationStatus, 'Needs Manual Review', 'Must be Needs Manual Review');
    console.log('[PASS] Empty PDF flagged with Critical Anomaly and routed to Needs Manual Review');

    // Case 2: Document with non-statutory text, no QR code, no institution name, no cert number
    console.log('\n--- Case 2: Unrelated text without any statutory credentials ---');
    const unrelatedText = `
      Chapter 4: Graph Traversal Algorithms
      Depth First Search (DFS) uses a stack or recursion to explore nodes.
      Breadth First Search (BFS) uses a queue to visit vertices layer by layer.
      Time Complexity is O(V + E).
      Written by Student Roll No 42 for Data Structures Lab.
    `;
    const resultUnrelated = validateExtractedDocument(
      'doc_unrelated_02',
      'graph_traversal.pdf',
      'Infrastructure-Related Documents',
      unrelatedText,
      mockApp
    );
    console.log('Unrelated doc anomalies:', resultUnrelated.anomalies.map(a => a.explanation));
    assert.strictEqual(resultUnrelated.anomalies.some(a => a.severity === 'CRITICAL'), true, 'Must flag unidentifiable certificate or missing entity');
    assert.strictEqual(resultUnrelated.verificationStatus, 'Needs Manual Review');
    console.log('[PASS] Unrelated text without statutory markers correctly routed to Needs Manual Review');

    // Case 3: Complete verification engine check
    console.log('\n--- Case 3: Verification Engine Evaluation ---');
    const mockManagedDoc = {
      id: 'doc_test_engine',
      applicationId: mockApp.id,
      institutionId: mockApp.institutionId,
      originalFilename: 'empty_or_unrelated.pdf',
      documentCategory: 'No Objection Certificate (NOC)',
      uploadDate: '2026-10-29',
      uploadStatus: 'Uploaded',
      ocrStatus: 'Completed',
      verificationStatus: resultUnrelated.verificationStatus,
      candidateValues: resultUnrelated.candidateValues,
      anomalies: resultUnrelated.anomalies,
      extractedText: unrelatedText,
    };
    const finalDoc = runDocumentVerification(mockManagedDoc, [mockManagedDoc], mockApp);
    console.log('Final document status:', finalDoc.verificationStatus);
    assert.strictEqual(finalDoc.verificationStatus, 'Needs Manual Review', 'Final status must strictly be Needs Manual Review');
    assert.notStrictEqual(finalDoc.verificationStatus, 'Checks Passed', 'Must NEVER be Checks Passed');
    assert.notStrictEqual(finalDoc.verificationStatus, 'Officially Verified', 'Must NEVER be Officially Verified');
    console.log('[PASS] Verification engine guarantees unidentifiable PDF is marked Needs Manual Review!');

    console.log('\n' + '='.repeat(70));
    console.log('ALL CONTENTLESS PDF INTEGRITY TESTS PASSED SUCCESSFULLY (3/3)');
    console.log('='.repeat(70));
  } finally {
    await vite.close();
  }
}

testContentlessPdf().catch(err => {
  console.error('[TEST FAILURE]:', err);
  process.exit(1);
});
