import { createServer } from 'vite';

async function runFakeDocTests() {
  const server = await createServer({
    server: { middlewareMode: true }
  });

  const { runDocumentVerification } = await server.ssrLoadModule('/src/services/documentVerificationEngine.ts');
  const { validateExtractedDocument } = await server.ssrLoadModule('/src/services/realOcrService.ts');
  const { institutionService } = await server.ssrLoadModule('/src/services/institutionService.ts');

  const app = institutionService.getApplicationById('APP-2026-AICTE-8491'); // Apex Institute, PID: 1-938210941

  console.log('--- Testing Fake Document 1: Random Unrelated PDF (Essay/Resume) ---');
  const fakeDoc1 = {
    id: 'doc_fake_01',
    applicationId: 'APP-2026-AICTE-8491',
    institutionId: '1-938210941',
    originalFilename: 'random_resume_or_bill.pdf',
    documentCategory: 'No Objection Certificate (NOC)',
    fileSize: '1.2 MB',
    fileSizeBytes: 1258291,
    mimeType: 'application/pdf',
    uploadDate: '2026-10-29',
    uploadStatus: 'Uploaded',
    ocrStatus: 'Completed',
    verificationStatus: 'Checks Passed',
    sha256Hash: 'ffff00001111222233334444555566667777888899990000aaaabbbbccccdddd',
    extractedText: 'John Doe - Software Engineer Resume. Experience with React, Node.js, Python. Contact: 9876543210. Education: B.Tech Computer Science.',
    candidateValues: {
      documentNumber: '[Not Found in Document Text]',
      institutionName: '[Not Found in Document Text]',
      issuingAuthority: '[Not Detected]',
      signatoryDesignation: '[Not Detected]',
      issueDate: 'Not specified',
      expiryDate: 'Perpetual / Undefined'
    },
    anomalies: [],
    isMandatory: true
  };

  const val1 = validateExtractedDocument(fakeDoc1.id, fakeDoc1.originalFilename, fakeDoc1.documentCategory, fakeDoc1.extractedText, app);
  fakeDoc1.anomalies = val1.anomalies;
  const verified1 = runDocumentVerification(fakeDoc1, [fakeDoc1], app);

  console.log('Result 1 Status:', verified1.verificationStatus);
  console.log('Result 1 Anomalies Count:', verified1.anomalies.length);
  verified1.anomalies.forEach((a, i) => console.log(`  Anomaly ${i+1}: [${a.severity}] ${a.explanation}`));

  if (verified1.verificationStatus === 'Needs Manual Review' && verified1.anomalies.length >= 2) {
    console.log('[PASS] Fake Document 1 correctly flagged as Needs Manual Review!');
  } else {
    console.error('[FAIL] Fake Document 1 was not caught properly!');
    process.exit(1);
  }

  console.log('\n--- Testing Fake Document 2: Mismatched College Document ---');
  const fakeDoc2 = {
    id: 'doc_fake_02',
    applicationId: 'APP-2026-AICTE-8491',
    institutionId: '1-938210941',
    originalFilename: 'Fake_Approval_Other_College.pdf',
    documentCategory: 'Affidavit / Undertaking',
    fileSize: '1.5 MB',
    fileSizeBytes: 1572864,
    mimeType: 'application/pdf',
    uploadDate: '2026-10-29',
    uploadStatus: 'Uploaded',
    ocrStatus: 'Completed',
    verificationStatus: 'Checks Passed',
    sha256Hash: 'eeee00001111222233334444555566667777888899990000aaaabbbbccccdddd',
    extractedText: 'AFFIDAVIT. We, Sunrise Institute of Technology (PID: 1-555444333), solemnly declare adherence to AICTE norms. Valid through: 31-12-2027.',
    candidateValues: {
      documentNumber: 'AFF-2025-01',
      institutionName: 'Sunrise Institute of Technology',
      issuingAuthority: 'Notary Public',
      signatoryDesignation: 'Principal',
      issueDate: '2025-10-01',
      expiryDate: '2027-12-31'
    },
    anomalies: [],
    isMandatory: true
  };

  const val2 = validateExtractedDocument(fakeDoc2.id, fakeDoc2.originalFilename, fakeDoc2.documentCategory, fakeDoc2.extractedText, app);
  fakeDoc2.anomalies = val2.anomalies;
  const verified2 = runDocumentVerification(fakeDoc2, [fakeDoc2], app);

  console.log('Result 2 Status:', verified2.verificationStatus);
  console.log('Result 2 Anomalies Count:', verified2.anomalies.length);
  verified2.anomalies.forEach((a, i) => console.log(`  Anomaly ${i+1}: [${a.severity}] ${a.explanation}`));

  if (verified2.verificationStatus === 'Needs Manual Review' && verified2.anomalies.some(a => a.explanation.includes('Permanent ID'))) {
    console.log('[PASS] Fake Document 2 correctly caught PID mismatch and flagged as Needs Manual Review!');
  } else {
    console.error('[FAIL] Fake Document 2 PID mismatch was not caught properly!');
    process.exit(1);
  }

  console.log('\nALL FAKE DOCUMENT DETECTION TESTS PASSED!');
  await server.close();
  process.exit(0);
}

runFakeDocTests().catch(err => {
  console.error(err);
  process.exit(1);
});
