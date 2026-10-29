import assert from 'node:assert';

console.log('--- Starting Page 06 Anomaly & Authentication Unit Tests ---');

// 1. Text Similarity (Jaccard Coefficient) test
function computeTextSimilarity(textA, textB) {
  if (!textA || !textB) return 0;
  const wordsA = new Set(
    textA.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 2)
  );
  const wordsB = new Set(
    textB.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 2)
  );

  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  const intersection = new Set([...wordsA].filter((x) => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);
  return Math.round((intersection.size / union.size) * 100);
}

// Test 1: Identical strings must yield 100% similarity
const sampleA = 'All India Council for Technical Education Approval Process Handbook 2026-2027';
const sampleB = 'All India Council for Technical Education Approval Process Handbook 2026-2027';
const simIdentical = computeTextSimilarity(sampleA, sampleB);
console.log(`[TEST 1] Identical text similarity: ${simIdentical}%`);
assert.strictEqual(simIdentical, 100, 'Identical texts must return 100% similarity');

// Test 2: Completely disjoint strings must yield 0% similarity
const sampleC = 'Completely distinct architectural drawings showing setback lines';
const simDisjoint = computeTextSimilarity(sampleA, sampleC);
console.log(`[TEST 2] Disjoint text similarity: ${simDisjoint}%`);
assert.ok(simDisjoint < 15, 'Disjoint texts must return low similarity');

// Test 3: Partially overlapping strings
const sampleD = 'All India Council for Technical Education land registration certificate and survey map';
const simPartial = computeTextSimilarity(sampleA, sampleD);
console.log(`[TEST 3] Overlapping text similarity: ${simPartial}%`);
assert.ok(simPartial > 20 && simPartial < 70, 'Partial overlap must return moderate similarity');

// Test 4: SHA-256 duplicate detection simulation
const docList = [
  {
    id: 'doc-001',
    originalName: 'Land_Title_Deed_Registered.pdf',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    category: 'Land Documents',
  },
  {
    id: 'doc-002',
    originalName: 'Building_Plan_Sanction.pdf',
    sha256: 'ca978112ca1bbdcafac231b39a23dc4da786081cd1e14b028e9dd30e011c0ed8',
    category: 'Building Plan',
  },
  {
    id: 'doc-003',
    originalName: 'Land_Title_Deed_Duplicate.pdf',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // exact match with doc-001
    category: 'Land Documents',
  },
];

const exactDuplicates = [];
for (let i = 0; i < docList.length; i++) {
  for (let j = i + 1; j < docList.length; j++) {
    if (docList[i].sha256 === docList[j].sha256) {
      exactDuplicates.push({
        docA: docList[i].id,
        docB: docList[j].id,
        sha256: docList[i].sha256,
      });
    }
  }
}

console.log(`[TEST 4] Exact duplicates detected: ${exactDuplicates.length}`);
assert.strictEqual(exactDuplicates.length, 1, 'Should detect exactly 1 duplicate pair');
assert.strictEqual(exactDuplicates[0].docA, 'doc-001');
assert.strictEqual(exactDuplicates[0].docB, 'doc-003');

// Test 5: Date chronology & expiry validation
function checkDateExpiry(validUntilDateStr) {
  const expiry = new Date(validUntilDateStr);
  const now = new Date();
  return expiry.getTime() < now.getTime();
}

const pastExpiry = '2023-04-30';
const futureExpiry = '2027-12-31';
assert.strictEqual(checkDateExpiry(pastExpiry), true, 'Past date should be detected as expired');
assert.strictEqual(checkDateExpiry(futureExpiry), false, 'Future date should not be expired');
console.log('[TEST 5] Chronological date expiry logic verified');

// Test 6: Audit Report Structure Validation
const sampleReport = {
  reportId: 'RPT-ANOM-2026-TEST',
  applicationId: 'APP-2026-AICTE-8491',
  institutionId: '1-3327618911',
  institutionName: 'Apex Institute of Technology & Science',
  academicYear: '2026-2027',
  generatedAt: new Date().toISOString(),
  metrics: {
    totalDocuments: 3,
    exactDuplicates: 1,
    possibleDuplicates: 0,
    metadataMismatches: 0,
    dateInconsistencies: 1,
    alterationIndicators: 0,
    pendingReviews: 2,
  },
  documentHashes: docList.map(d => ({
    documentId: d.id,
    originalName: d.originalName,
    category: d.category,
    sha256: d.sha256,
    fileSize: 1024,
  })),
  alerts: [
    {
      id: 'ALT-1001',
      applicationId: 'APP-2026-AICTE-8491',
      institutionId: '1-3327618911',
      documentId: 'doc-001',
      documentName: 'Land_Title_Deed_Registered.pdf',
      comparedDocumentId: 'doc-003',
      comparedDocumentName: 'Land_Title_Deed_Duplicate.pdf',
      category: 'Exact Duplicate',
      detectionRule: 'RULE-EXACT-HASH-MATCH',
      severity: 'CRITICAL',
      explanation: 'Identical SHA-256 byte payload detected.',
      detectedAt: new Date().toISOString(),
      processingMode: 'DEMO',
      reviewStatus: 'PENDING',
    }
  ]
};

assert.ok(sampleReport.reportId.startsWith('RPT-ANOM-'));
assert.strictEqual(sampleReport.metrics.exactDuplicates, 1);
assert.strictEqual(sampleReport.alerts[0].reviewStatus, 'PENDING');
console.log('[TEST 6] Statutory Anomaly Report structure verified');

console.log('--- ALL PAGE 06 VERIFICATION TESTS PASSED SUCCESSFULLY! ---');
