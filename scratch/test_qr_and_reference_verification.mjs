import { createServer } from 'vite';
import assert from 'assert';
import fs from 'fs';
import path from 'path';

// Polyfill localStorage & document/window for Node testing
if (typeof global.localStorage === 'undefined') {
  const store = {};
  global.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };
}

async function runQrAndReferenceTests() {
  console.log('='.repeat(70));
  console.log('AUTHENX QR & REFERENCE VERIFICATION INTEGRITY TESTS');
  console.log('='.repeat(70));

  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const { issuingAuthorityService, isTrustedIssuingDomain } = await vite.ssrLoadModule('/src/services/issuingAuthorityService.ts');

    // TEST 1: Domain Trust Evaluator
    console.log('\n--- 1. Domain Trust Whitelist Tests ---');
    const officialAicte = isTrustedIssuingDomain('https://facilities.aicte-india.org/eoa/verify?ref=123');
    assert.strictEqual(officialAicte.trusted, true, 'facilities.aicte-india.org must be trusted');
    assert.ok(officialAicte.matchedDomain?.includes('aicte-india.org'), 'matched domain must be AICTE');
    console.log('[PASS] Official AICTE portal domain is recognized as trusted');

    const karnatakaGov = isTrustedIssuingDomain('https://bhoomi.karnataka.gov.in/verify?cert=KA-123');
    assert.strictEqual(karnatakaGov.trusted, true, 'bhoomi.karnataka.gov.in must be trusted');
    console.log('[PASS] Official Karnataka State Bhoomi domain is recognized as trusted');

    const fakeSite = isTrustedIssuingDomain('https://fake-aicte-portal.com/verify?ref=123');
    assert.strictEqual(fakeSite.trusted, false, 'fake-aicte-portal.com must NOT be trusted');
    console.log('[PASS] Fake / phishing domain correctly rejected as UNVERIFIED DOMAIN');

    const arbitraryUrl = isTrustedIssuingDomain('https://random-docs-bucket.s3.amazonaws.com/doc.pdf');
    assert.strictEqual(arbitraryUrl.trusted, false, 'Untrusted S3 bucket must NOT be trusted');
    console.log('[PASS] Untrusted external host correctly rejected');

    // TEST 2: PDF QR Decoding on Document without QR (e.g. Graph Traversal or Sample B)
    console.log('\n--- 2. PDF Optical Matrix Scanner Tests ---');
    const sampleBPdf = fs.readFileSync(path.resolve('public/demo-samples/Sample_B_Consistent_Document.pdf'));
    const dummyFile = {
      name: 'graph traversal -10.pdf',
      type: 'application/pdf',
      size: sampleBPdf.length,
      arrayBuffer: async () => sampleBPdf.buffer.slice(sampleBPdf.byteOffset, sampleBPdf.byteOffset + sampleBPdf.byteLength)
    };

    const qrResult = await issuingAuthorityService.decodeQRCodeFromImageFile(dummyFile);
    console.log('QR Decode Result for non-QR PDF:', {
      decoded: qrResult.decoded,
      hasQrCode: qrResult.hasQrCode,
      isDomainTrusted: qrResult.isDomainTrusted,
      queryStatus: qrResult.queryStatus,
      rawPayload: qrResult.rawPayload,
      details: qrResult.details,
    });

    assert.strictEqual(qrResult.decoded, false, 'Document without QR matrix must NOT be marked as decoded');
    assert.strictEqual(qrResult.hasQrCode, false, 'hasQrCode must be false');
    assert.strictEqual(qrResult.isDomainTrusted, false, 'isDomainTrusted must be false');
    assert.strictEqual(qrResult.queryStatus, 'FAILED', 'queryStatus must be FAILED');
    assert.strictEqual(qrResult.rawPayload, undefined, 'rawPayload must NOT be fabricated');
    assert.ok(qrResult.details.includes('No QR code barcode pattern or statutory verification URL detected'), 'Details must clearly state failure');
    assert.ok(!qrResult.details.includes('aicte-india.org'), 'Must NOT claim aicte-india.org domain match when none exists');
    console.log('[PASS] Arbitrary PDF "graph traversal -10.pdf" returns decoded=false, isDomainTrusted=false, and truthful error message!');

    // TEST 3: Reference Number Registry Lookups
    console.log('\n--- 3. Reference Number Verification Registry Tests ---');

    // 3A: Registered genuine reference
    const bhoomiLookup = await issuingAuthorityService.verifyReferenceNumber(
      'BHOOMI-77492-2018',
      'Department of Stamps and Registration, Government of Karnataka',
      'Apex Institute of Technology & Science'
    );
    assert.strictEqual(bhoomiLookup.recordFound, true, 'Known Bhoomi reference must be found');
    assert.strictEqual(bhoomiLookup.status, 'VERIFIED', 'Known Bhoomi reference must be VERIFIED');
    assert.strictEqual(bhoomiLookup.matchedRecord?.certificateNumber, 'KA-BLR-REG/2018/LND-49201');
    console.log('[PASS] Genuine registered reference "BHOOMI-77492-2018" resolves to verified registry record');

    // 3B: Unknown / arbitrary reference number
    const fakeLookup = await issuingAuthorityService.verifyReferenceNumber(
      'graph traversal -10',
      'All India Council for Technical Education, New Delhi',
      'Apex Institute of Technology & Science'
    );
    assert.strictEqual(fakeLookup.recordFound, false, 'Arbitrary reference must NOT be found');
    assert.strictEqual(fakeLookup.status, 'SOURCE_NOT_CONFIGURED', 'Arbitrary reference must NOT be VERIFIED');
    assert.ok(fakeLookup.details.includes('was not found in the official registry directory'), 'Details must explain not found');
    console.log('[PASS] Arbitrary reference "graph traversal -10" returns recordFound=false and unverified status');

    const randomLookup = await issuingAuthorityService.verifyReferenceNumber(
      'RANDOM-FAKE-12345',
      'Karnataka State Fire and Emergency Services Department',
      'Apex Institute of Technology & Science'
    );
    assert.strictEqual(randomLookup.recordFound, false, 'Random reference must NOT be found');
    assert.strictEqual(randomLookup.status, 'SOURCE_NOT_CONFIGURED');
    console.log('[PASS] Random reference number rejected truthfully');

    console.log('\n' + '='.repeat(70));
    console.log('ALL QR & REFERENCE INTEGRITY TESTS PASSED SUCCESSFULLY (6/6)');
    console.log('='.repeat(70));

  } finally {
    await vite.close();
  }
}

runQrAndReferenceTests().catch(err => {
  console.error('\n[TEST FAILURE]:', err);
  process.exit(1);
});
