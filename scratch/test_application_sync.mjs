import { createServer } from 'vite';

// Global mock localStorage for Node testing environment
const store = new Map();
global.localStorage = {
  getItem: (key) => store.get(key) || null,
  setItem: (key, val) => store.set(key, String(val)),
  removeItem: (key) => store.delete(key),
  clear: () => store.clear()
};

async function testApplicationSync() {
  const server = await createServer({
    server: { middlewareMode: true }
  });

  const { institutionService } = await server.ssrLoadModule('/src/services/institutionService.ts');
  const { documentService } = await server.ssrLoadModule('/src/services/documentService.ts');

  console.log('--- Test 1: Creating a fresh new application (similar to APP-2026-AICTE-9696) ---');
  const newApp = institutionService.createNewApplication(
    'EOA',
    '2026-2027',
    undefined,
    'Extension of Approval (EoA) Application for AY 2026-2027'
  );

  console.log('Created App ID:', newApp.id);
  console.log('Initial Status:', newApp.status);
  console.log('Initial Validation Status:', newApp.validationStatus);

  if (newApp.validationStatus === 'Verification Pending' && newApp.status === 'Draft') {
    console.log('[PASS] Test 1: New application starts with "Verification Pending" instead of fake "Passed"!');
  } else {
    console.error('[FAIL] Test 1: New application had wrong initial status:', newApp.validationStatus);
    process.exit(1);
  }

  console.log('\n--- Test 2: Ingesting a wrong certificate into the application ---');
  const wrongDoc = {
    id: `doc_wrong_${Date.now()}`,
    applicationId: newApp.id,
    institutionId: newApp.institutionId,
    originalFilename: 'Wrong_Unknown_Certificate.pdf',
    documentCategory: 'No Objection Certificate (NOC)',
    fileSize: '1.1 MB',
    fileSizeBytes: 1153433,
    mimeType: 'application/pdf',
    uploadDate: '2026-10-29',
    uploadStatus: 'Uploaded',
    ocrStatus: 'Completed',
    verificationStatus: 'Needs Manual Review',
    sha256Hash: '0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff',
    extractedText: 'Generic Certificate of Participation. Awarded to Student A. No AICTE details.',
    candidateValues: {
      documentNumber: '[Not Found in Document Text]',
      institutionName: '[Not Found in Document Text]',
      issuingAuthority: '[Not Detected]',
      signatoryDesignation: '[Not Detected]',
      issueDate: 'Not specified',
      expiryDate: 'Perpetual / Undefined'
    },
    anomalies: [
      {
        id: 'anom_wrong_01',
        type: 'Data Mismatch',
        severity: 'CRITICAL',
        explanation: 'Missing AICTE Permanent ID: Document text contains no AICTE PID.',
        relatedDocumentId: 'doc_wrong_01',
        relatedDocumentName: 'Wrong_Unknown_Certificate.pdf',
        supportingFieldOrText: 'PID: None',
        detectedAt: '2026-10-29 19:30 IST',
        reviewStatus: 'Pending Review'
      }
    ],
    isMandatory: true
  };

  documentService.saveDocuments(newApp.id, [wrongDoc]);

  // Now run preliminary validation on newApp
  const findings = institutionService.runPreliminaryValidation(newApp);
  console.log('Findings count:', findings.length);
  const criticalFindings = findings.filter(f => f.severity === 'CRITICAL');
  console.log('Critical findings count:', criticalFindings.length);
  criticalFindings.forEach((f, i) => console.log(`  Critical ${i+1}: ${f.title} - ${f.explanation}`));

  // Try submitting application with wrong certificate
  const submitResult = institutionService.submitApplication(newApp.id);
  console.log('Submit Result Success:', submitResult.success);
  console.log('Submit Error (Expected):', submitResult.error);

  if (!submitResult.success && submitResult.error && submitResult.error.includes('critical deficiency')) {
    console.log('[PASS] Test 2: Application submission blocked because wrong certificate was detected!');
  } else {
    console.error('[FAIL] Test 2: Application was allowed to submit with a wrong certificate!');
    process.exit(1);
  }

  // Check retrieved application
  const retrieved = institutionService.getApplicationById(newApp.id);
  console.log('Retrieved Application Validation Status:', retrieved.validationStatus);
  if (retrieved.validationStatus === 'Mismatch Detected') {
    console.log('[PASS] Test 3: Application validation outcome correctly reflects "Mismatch Detected"!');
  } else {
    console.error('[FAIL] Test 3: Application validation outcome did not reflect "Mismatch Detected"!');
    process.exit(1);
  }

  console.log('\nALL APPLICATION SYNC TESTS PASSED SUCCESSFULLY!');
  await server.close();
  process.exit(0);
}

testApplicationSync().catch(err => {
  console.error(err);
  process.exit(1);
});
