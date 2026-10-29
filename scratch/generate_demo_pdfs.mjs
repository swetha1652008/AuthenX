import fs from 'fs';
import path from 'path';

function createSimplePdf(lines) {
  const contentStream = [
    'BT',
    '/F1 11 Tf',
    '40 750 Td',
    '15 TL'
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/[\\()]/g, '\\$&');
    contentStream.push(`(${line}) '`);
  }
  contentStream.push('ET');

  const streamData = contentStream.join('\n');
  const streamLength = Buffer.byteLength(streamData);

  const objects = [];
  
  // 1: Catalog
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  // 2: Pages
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  // 3: Page
  objects.push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n');
  // 4: Contents
  objects.push(`4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamData}\nendstream\nendobj\n`);
  // 5: Font
  objects.push('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');

  let body = '%PDF-1.4\n';
  const xref = ['xref\n0 6\n0000000000 65535 f \n'];

  for (let i = 0; i < objects.length; i++) {
    const offset = Buffer.byteLength(body);
    xref.push(String(offset).padStart(10, '0') + ' 00000 n \n');
    body += objects[i];
  }

  const xrefOffset = Buffer.byteLength(body);
  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(body + xref.join('') + trailer, 'utf-8');
}

const dir = path.resolve('public', 'demo-samples');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Sample A: Suspicious
const sampleALines = [
  'GOVERNMENT OF KARNATAKA - DEPARTMENT OF TECHNICAL EDUCATION',
  'PALACE ROAD, BENGALURU - 560001',
  'ORDER NO: DTE/COLL/NOC/2026/SUSP-9921',
  'SUBJECT: Grant of No Objection Certificate for Extension of Approval (AY 2026-27)',
  '',
  'Reference: Application by Metropolitan Polytechnic & Technological Institute',
  'AICTE Permanent Institute ID: 1-778899001',
  'Location: Survey No 18/B, Peenya Industrial Area, Bengaluru 560058',
  '',
  'The Department of Technical Education hereby issues No Objection Certificate.',
  'Date of Issue: 25-11-2026 | Expiry Date: 15-06-2025',
  'Issuing Authority: Directorate of Technical Education, Karnataka',
  'Signatory: Assistant Technical Officer',
  'Notice: Digital Composition modified via Adobe Photoshop CC Raster Suite'
];

// Sample B: Consistent
const sampleBLines = [
  'AFFIDAVIT IN PRESCRIBED AICTE FORMAT (APH 2026-27)',
  'BEFORE THE COMPETENT NOTARY PUBLIC, BENGALURU, KARNATAKA',
  'AFFIDAVIT REFERENCE NO: AFF-KA-BLR-2026-8491',
  '',
  'I, Dr. Arunachalam M., Principal and Authorized Signatory of Apex Institute of Technology & Science,',
  'AICTE Permanent Institute ID: 1-938210941, solemnly declare and affirm that:',
  '1. Our autonomous institution strictly complies with all AICTE norms specified in APH 2026-27.',
  '2. All instructional areas, laboratories, and computing centres meet mandated square meter norms.',
  '3. Student-to-faculty cadre ratios in all engineering programmes are maintained at 1:15.',
  '',
  'Executed on Date: 12-10-2025 | Valid through Expiry Date: 31-03-2027',
  'Institution Name: Apex Institute of Technology & Science',
  'Issuing Authority: Competent Notary Public, Government of Karnataka',
  'Signatory Designation: Principal & Authorized Signatory',
  'Campus Address: Survey No. 42/1, Electronic City Phase 1, Hosur Road, Bengaluru 560100',
  'Cryptographic Hash: Validated Under AICTE Statutory Archive Schema'
];

const sampleAPdf = createSimplePdf(sampleALines);
fs.writeFileSync(path.join(dir, 'Sample_A_Suspicious_Document.pdf'), sampleAPdf);
console.log('Created Sample_A_Suspicious_Document.pdf:', sampleAPdf.length, 'bytes');

const sampleBPdf = createSimplePdf(sampleBLines);
fs.writeFileSync(path.join(dir, 'Sample_B_Consistent_Document.pdf'), sampleBPdf);
console.log('Created Sample_B_Consistent_Document.pdf:', sampleBPdf.length, 'bytes');
