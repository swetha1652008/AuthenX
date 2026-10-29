import { institutionService } from '../src/services/institutionService.ts';
import { humanReviewService } from '../src/services/humanReviewService.ts';
import { reportsAnalyticsService } from '../src/services/reportsAnalyticsService.ts';
import { authService } from '../src/services/authService.ts';
import { extractCandidateFieldsFromText, validateExtractedDocument } from '../src/services/realOcrService.ts';

console.log('====================================================');
console.log(' AUTHENX FULL VERIFICATION SUITE');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
    failed++;
  }
}

// 1. Account Authentication & Multi-Tenant Verification
console.log('--- TEST 1: APEX INSTITUTE AUTH & ISOLATION ---');
authService.logout();
const apexLogin = await authService.login('dr.arun@apextech.edu', 'Apex@2026!', 'INSTITUTION_ADMIN');
assert(apexLogin.success === true, 'Apex Admin authentication succeeds');
assert(apexLogin.user?.institutionId === '1-938210941', 'Apex Admin has PID 1-938210941');

const apexApps = institutionService.getApplications();
assert(apexApps.length === 4, `Apex sees exactly its 4 applications (Found: ${apexApps.length})`);
assert(apexApps.every(a => a.institutionId === '1-938210941'), 'All Apex applications have PID 1-938210941');

const apexReports = reportsAnalyticsService.getApplicationValidationReport();
assert(apexReports.every(r => r.institutionId === '1-938210941'), 'Reports service isolates reports to Apex PID');

console.log('\n--- TEST 2: NIEAR MYSURU AUTH & ISOLATION ---');
authService.logout();
const niearLogin = await authService.login('principal@niear.edu.in', 'Niear@2026!', 'INSTITUTION_ADMIN');
assert(niearLogin.success === true, 'NIEAR Admin authentication succeeds');
assert(niearLogin.user?.institutionId === '1-482019382', 'NIEAR Admin has PID 1-482019382');

const niearApps = institutionService.getApplications();
assert(niearApps.length === 2, `NIEAR sees exactly its 2 applications (Found: ${niearApps.length})`);
assert(niearApps.every(a => a.institutionId === '1-482019382'), 'All NIEAR applications have PID 1-482019382');

// Direct URL bypass test: NIEAR attempting to read Apex application
const directCrossTenantApp = institutionService.getApplicationById('APP-2026-AICTE-8491');
assert(directCrossTenantApp === undefined, 'Cross-tenant access to Apex application APP-2026-AICTE-8491 is blocked for NIEAR');

const niearCases = humanReviewService.getCases('1-482019382');
assert(niearCases.length > 0, `NIEAR has its Case Review records (Found: ${niearCases.length})`);
assert(niearCases.every(c => c.institutionId === '1-482019382'), 'NIEAR cases belong strictly to PID 1-482019382');

const niearReports = reportsAnalyticsService.getApplicationValidationReport();
assert(niearReports.length > 0 && niearReports.every(r => r.institutionId === '1-482019382'), 'Reports service isolates reports to NIEAR PID');

console.log('\n--- TEST 3: COMPLIANCE OFFICER COUNCIL OVERSIGHT ---');
authService.logout();
const officerLogin = await authService.login('priya.sharma@aicte.gov.in', 'Aicte#Verify26', 'COMPLIANCE_OFFICER');
assert(officerLogin.success === true, 'Compliance Officer authentication succeeds');
const allCouncilApps = institutionService.getApplications();
assert(allCouncilApps.length === 6, `Officer sees council-wide oversight of all 6 applications (Found: ${allCouncilApps.length})`);

console.log('\n--- TEST 4: REAL OCR & DOCUMENT ENTITY EXTRACTION ---');
const sampleOcrText = `
GOVERNMENT OF KARNATAKA - DEPARTMENT OF TECHNICAL EDUCATION
BENGALURU - 560001
ORDER NO: DTE/COLL/NOC/2026/7731
SUBJECT: Grant of No Objection Certificate for Extension of Approval
Reference: Application by National Institute of Engineering and Applied Research
Permanent Institute ID: 1-482019382
Date of Issue: 18-09-2025 | Valid through: 30-06-2027
Authorized Signatory: Director of Technical Education
`;

const extractedFields = extractCandidateFieldsFromText(sampleOcrText, 'No Objection Certificate (NOC)', niearApps[0]);
assert(extractedFields.extractedPid === '1-482019382', `Extracted PID matches: ${extractedFields.extractedPid}`);
assert(extractedFields.extractedDocNumber?.includes('DTE/COLL/NOC/2026/7731'), `Extracted Order Number: ${extractedFields.extractedDocNumber}`);
assert(extractedFields.extractedIssueDate === '2025-09-18', `Extracted Issue Date: ${extractedFields.extractedIssueDate}`);
assert(extractedFields.extractedExpiryDate === '2027-06-30', `Extracted Expiry Date: ${extractedFields.extractedExpiryDate}`);

// Test Mismatched PID anomaly detection
const validationResult = validateExtractedDocument('doc_test_01', 'sample_test.pdf', 'No Objection Certificate (NOC)', sampleOcrText, apexApps[0]);
assert(validationResult.anomalies.some(a => a.type === 'Data Mismatch' && a.explanation.includes('PID')), 'Cross-tenant PID mismatch correctly flagged when NIEAR doc uploaded to Apex app');

console.log('\n====================================================');
console.log(`RESULTS: ${passed} passed, ${failed} failed`);
console.log('====================================================');

if (failed > 0) process.exit(1);
