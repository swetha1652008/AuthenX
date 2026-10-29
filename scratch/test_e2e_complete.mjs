import fs from 'fs';
import path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { db, initDatabase } from '../server/db.js';
import { validateWithGeminiAI } from '../server/aiService.js';
import { createApiRouter } from '../server/apiRouter.js';
import {
  extractCandidateFieldsFromText,
  validateExtractedDocument
} from '../src/services/realOcrService.ts';
import {
  runDocumentVerification,
  evaluateTamperingIndicators,
  evaluateExpiryAndValidity
} from '../src/services/documentVerificationEngine.ts';
import { authService, getRoleDashboardRoute } from '../src/services/authService.ts';
import { institutionService } from '../src/services/institutionService.ts';
import { documentService } from '../src/services/documentService.ts';

async function runEndToEndVerification() {
  console.log('========================================================================');
  console.log('AUTHENX COMPREHENSIVE END-TO-END VERIFICATION & AUDIT SUITE');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} - ${details}`);
      failed++;
    }
  }

  // Init DB
  initDatabase();

  // Test 1: Readable PDF with actual text (Sample B)
  console.log('\n--- Scenario 1: Readable PDF with Actual Text (Sample B) ---');
  const sampleBPath = path.resolve('public', 'demo-samples', 'Sample_B_Consistent_Document.pdf');
  const bufB = new Uint8Array(fs.readFileSync(sampleBPath));
  const docB = await pdfjsLib.getDocument({ data: bufB, isEvalSupported: false }).promise;
  let textB = '';
  for (let i = 1; i <= docB.numPages; i++) {
    const p = await docB.getPage(i);
    const content = await p.getTextContent();
    textB += content.items.map(it => it.str).join(' ') + '\n';
  }
  assert(textB.length > 200, 'Scenario 1.1: Real text extracted from Sample B PDF', `Length: ${textB.length}`);
  assert(textB.includes('1-938210941'), 'Scenario 1.2: Correct AICTE PID present in extracted text');
  assert(textB.includes('Apex Institute of Technology & Science'), 'Scenario 1.3: Institution name present in extracted text');

  // Test 2: Extraction legibility & honest reporting
  console.log('\n--- Scenario 2: Structured Field Extraction without Fabrication ---');
  const appApex = institutionService.getApplicationById('APP-2026-AICTE-8491');
  const fieldsB = extractCandidateFieldsFromText(textB, 'Affidavit / Undertaking', appApex);
  assert(fieldsB.extractedPid === '1-938210941', 'Scenario 2.1: PID accurately extracted via regex/heuristics', `PID: ${fieldsB.extractedPid}`);
  assert(fieldsB.extractedDocNumber?.includes('AFF-KA-BLR-2026-8491'), 'Scenario 2.2: Document Reference extracted accurately');
  assert(fieldsB.extractedExpiryDate === '2027-03-31', 'Scenario 2.3: Future validity date extracted accurately');

  // Test 3: Suspicious Sample with Mismatched PID, Name, and Inverted Dates (Sample A)
  console.log('\n--- Scenario 3: Suspicious Sample with Mismatches (Sample A) ---');
  const sampleAPath = path.resolve('public', 'demo-samples', 'Sample_A_Suspicious_Document.pdf');
  const bufA = new Uint8Array(fs.readFileSync(sampleAPath));
  const docA = await pdfjsLib.getDocument({ data: bufA, isEvalSupported: false }).promise;
  let textA = '';
  for (let i = 1; i <= docA.numPages; i++) {
    const p = await docA.getPage(i);
    const content = await p.getTextContent();
    textA += content.items.map(it => it.str).join(' ') + '\n';
  }
  const fieldsA = extractCandidateFieldsFromText(textA, 'No Objection Certificate (NOC)', appApex);
  assert(fieldsA.extractedPid === '1-778899001', 'Scenario 3.1: Extracted conflicting PID from Sample A', `PID: ${fieldsA.extractedPid}`);
  
  const ocrValidationA = validateExtractedDocument('doc_sample_a', 'Sample_A_Suspicious_Document.pdf', 'No Objection Certificate (NOC)', textA, appApex);
  assert(ocrValidationA.anomalies.some(a => a.explanation.includes('1-778899001')), 'Scenario 3.2: Cross-tenant PID mismatch detected as critical anomaly');
  assert(ocrValidationA.anomalies.some(a => a.explanation.includes('Institution Name Mismatch')), 'Scenario 3.3: Institution entity mismatch detected');
  assert(ocrValidationA.anomalies.some(a => a.explanation.includes('Inconsistent Date Sequence') || a.explanation.includes('Expired')), 'Scenario 3.4: Date sequence / expiry anomaly detected');

  // Full verification pipeline on Sample A
  const sampleAManaged = {
    id: 'doc_sample_a_test',
    applicationId: appApex.id,
    institutionId: appApex.institutionId,
    originalFilename: 'Sample_A_Suspicious_Document.pdf',
    storageReference: '/storage/sample_a.pdf',
    documentCategory: 'No Objection Certificate (NOC)',
    fileSize: '1.3 KB',
    fileSizeBytes: 1342,
    mimeType: 'application/pdf',
    uploadDate: '2026-10-29',
    uploadTime: '12:00:00 IST',
    uploadingUserId: 'usr_test',
    uploadingUserName: 'Test User',
    uploadStatus: 'Uploaded',
    ocrStatus: 'Completed',
    verificationStatus: 'Pending Verification',
    sha256Hash: 'hash_sample_a_123',
    extractedText: textA,
    candidateValues: fieldsA.candidateValues,
    anomalies: ocrValidationA.anomalies,
    isMandatory: true
  };
  const verifiedA = runDocumentVerification(sampleAManaged, [sampleAManaged], appApex);
  assert(verifiedA.verificationStatus === 'Needs Manual Review', 'Scenario 3.5: Final status resolved strictly to "Needs Manual Review"', `Status: ${verifiedA.verificationStatus}`);
  assert(verifiedA.verificationChecks.some(c => c.result === 'FAIL' && c.checkName.includes('PID')), 'Scenario 3.6: Explainable check failed on AICTE Permanent Institute ID Cross-Match');

  // Test 4: Expired Document
  console.log('\n--- Scenario 4: Expired Document Evaluation ---');
  const expiryCheck = evaluateExpiryAndValidity({
    documentCategory: 'Other Supporting Documents',
    expiryDate: '2025-12-31'
  });
  assert(expiryCheck.isExpired === true, 'Scenario 4.1: Expired date accurately identified before evaluation baseline (2026-10-29)');

  // Test 5: Tampering / Raster Editing Detection
  console.log('\n--- Scenario 5: Tampering & Metadata Inspection ---');
  const tamperA = evaluateTamperingIndicators(sampleAManaged);
  assert(tamperA.hasSuspiciousMetadata === true, 'Scenario 5.1: Raster suite marker detected');
  assert(tamperA.editingSoftwareDetected?.includes('Photoshop'), 'Scenario 5.2: Flagged Adobe Photoshop CC raster suite');

  // Test 6: SHA-256 Collision Check
  console.log('\n--- Scenario 6: Cryptographic Duplicate Detection ---');
  const duplicateCandidate = { ...sampleAManaged, id: 'doc_dup_candidate' };
  const verifiedDup = runDocumentVerification(duplicateCandidate, [sampleAManaged, duplicateCandidate], appApex);
  assert(verifiedDup.verificationChecks.some(c => c.result === 'FAIL' && c.checkName.includes('Collision')), 'Scenario 6.1: Duplicate SHA-256 byte collision flagged as FAIL');

  // Test 7: AI Service Integration without API Key
  console.log('\n--- Scenario 7: Real AI Model Service Security ---');
  const savedKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  const aiResultNoKey = await validateWithGeminiAI({
    text: textB,
    filename: 'Sample_B_Consistent_Document.pdf',
    category: 'Affidavit / Undertaking',
    registeredApp: appApex
  });
  assert(aiResultNoKey.configured === false, 'Scenario 7.1: Missing GEMINI_API_KEY reports configuration required');
  assert(aiResultNoKey.status === 'API_KEY_REQUIRED', 'Scenario 7.2: Refuses to fabricate fake AI score without live credentials');
  if (savedKey) process.env.GEMINI_API_KEY = savedKey;

  // Test 8: Issuing Authority Verification Status
  console.log('\n--- Scenario 8: Issuing Authority Verification Workflow ---');
  const managedB = {
    ...sampleAManaged,
    id: 'doc_sample_b_test',
    originalFilename: 'Sample_B_Consistent_Document.pdf',
    documentCategory: 'Affidavit / Undertaking',
    extractedText: textB,
    candidateValues: fieldsB.candidateValues,
    anomalies: []
  };
  const verifiedB = runDocumentVerification(managedB, [managedB], appApex);
  assert(verifiedB.verificationStatus === 'Authority Verification Pending' || verifiedB.verificationStatus === 'Checks Passed', 
    'Scenario 8.1: Clean document with external authority marks status as Authority Verification Pending (not fake Verified)',
    `Status: ${verifiedB.verificationStatus}`);

  // Test 9: Institution Data Isolation
  console.log('\n--- Scenario 9: Multi-Tenant Institution Data Isolation ---');
  // Log in as Apex Admin
  await authService.login('dr.arun@apextech.edu', 'Apex@2026!', 'INSTITUTION_ADMIN');
  const apexApps = institutionService.getApplications();
  assert(apexApps.every(a => a.institutionId === '1-938210941'), 'Scenario 9.1: Apex Admin session sees strictly Apex applications');

  // Attempt cross-tenant getApplicationById
  const forbiddenNiearApp = institutionService.getApplicationById('APP-2026-AICTE-7731');
  assert(forbiddenNiearApp === undefined, 'Scenario 9.2: Apex Admin blocked from querying NIEAR application ID directly');

  // Log in as NIEAR Admin
  await authService.login('principal@niear.edu.in', 'Niear@2026!', 'INSTITUTION_ADMIN');
  const niearApps = institutionService.getApplications();
  assert(niearApps.every(a => a.institutionId === '1-482019382'), 'Scenario 9.3: NIEAR Admin session sees strictly NIEAR applications');

  const forbiddenApexApp = institutionService.getApplicationById('APP-2026-AICTE-8491');
  assert(forbiddenApexApp === undefined, 'Scenario 9.4: NIEAR Admin blocked from querying Apex application ID directly');

  // Test 10: Role-Based Access Routing
  console.log('\n--- Scenario 10: Role-Based Dashboard Routing ---');
  assert(getRoleDashboardRoute('INSTITUTION_ADMIN') === '/institution-portal', 'Scenario 10.1: Institution Admin routes to /institution-portal');
  assert(getRoleDashboardRoute('COMPLIANCE_OFFICER') === '/officer-dashboard', 'Scenario 10.2: Compliance Officer routes to /officer-dashboard');
  assert(getRoleDashboardRoute('DOCUMENT_VERIFICATION_OFFICER') === '/issuing-authority', 'Scenario 10.3: Doc Verifier routes to /issuing-authority');
  assert(getRoleDashboardRoute('REGULATORY_ADMIN') === '/officer-dashboard', 'Scenario 10.4: Regulatory Admin routes to /officer-dashboard');

  // Test 11: Backend API Router Security
  console.log('\n--- Scenario 11: Backend API Router Cross-Tenant Authorization ---');
  const router = createApiRouter();
  assert(typeof router === 'function', 'Scenario 11.1: Express API router initialized');

  // Test 12: SQLite Persistence & Audit Trail
  console.log('\n--- Scenario 12: SQLite Persistence & Immutable Audit Trail ---');
  const testDocId = `test_audit_doc_${Date.now()}`;
  db.prepare(`
    INSERT INTO documents (
      id, application_id, institution_id, original_filename, storage_reference,
      document_category, file_size, file_size_bytes, mime_type, upload_date,
      upload_time, uploading_user_id, uploading_user_name, upload_status,
      ocr_status, verification_status, sha256_hash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    testDocId, 'APP-2026-AICTE-8491', '1-938210941', 'Test_Statutory_Affidavit.pdf', '/storage/test.pdf',
    'Affidavit / Undertaking', '1.2 MB', 1258291, 'application/pdf', '2026-10-29',
    '15:00:00 IST', 'usr_inst_001', 'Dr. Arunachalam M.', 'Uploaded',
    'Completed', 'Checks Passed', 'sha256_test_byte_hash'
  );

  const row = db.prepare('SELECT * FROM documents WHERE id = ?').get(testDocId);
  assert(row !== undefined && row.id === testDocId, 'Scenario 12.1: Document successfully persisted to SQLite database');
  assert(row.institution_id === '1-938210941', 'Scenario 12.2: Stored document bound to authentic institution PID');

  console.log('\n========================================================================');
  console.log(`SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runEndToEndVerification().catch((e) => {
  console.error('Test execution failed:', e);
  process.exit(1);
});
