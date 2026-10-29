import fs from 'fs';
import path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

async function parsePdf(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc = await pdfjsLib.getDocument({ data, isEvalSupported: false }).promise;
  let text = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const str = content.items.map(it => it.str).join(' ');
    text += str + '\n';
  }
  return text;
}

const sampleAPath = path.resolve('public', 'demo-samples', 'Sample_A_Suspicious_Document.pdf');
const sampleBPath = path.resolve('public', 'demo-samples', 'Sample_B_Consistent_Document.pdf');

console.log('--- TESTING SAMPLE A ---');
const textA = await parsePdf(sampleAPath);
console.log('Sample A Text (Length:', textA.length, '):');
console.log(textA);

console.log('\n--- TESTING SAMPLE B ---');
const textB = await parsePdf(sampleBPath);
console.log('Sample B Text (Length:', textB.length, '):');
console.log(textB);
