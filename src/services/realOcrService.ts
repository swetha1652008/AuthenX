import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import type { 
  DocumentCategory, 
  DocumentAnomalyFinding,
  ExtractedCandidateValues
} from '../types/document';
import type { InstitutionApplication } from '../types/institution';

// Configure pdfjs worker
if (typeof window !== 'undefined') {
  try {
    // Standard Vite dynamic worker URL fallback to unpkg
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  } catch {
    // Fallback if needed
  }
}

export interface OcrExtractionResult {
  success: boolean;
  extractedText: string;
  pageCount: number;
  method: 'PDF_TEXT' | 'TESSERACT_OCR' | 'HYBRID';
  confidence: number;
  error?: string;
  candidateValues: ExtractedCandidateValues;
  anomalies: DocumentAnomalyFinding[];
  isExpired: boolean;
  expiryDate?: string;
  authorityVerificationStatus: string;
}

/**
 * Normalizes date strings (DD-MM-YYYY, DD/MM/YYYY, YYYY-MM-DD, or Month DD, YYYY) to ISO YYYY-MM-DD
 */
export function normalizeDateToIso(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  const clean = dateStr.trim();

  // Try standard Date parse
  const d = new Date(clean);
  if (!isNaN(d.getTime()) && clean.length >= 8) {
    const year = d.getFullYear();
    if (year >= 1990 && year <= 2040) {
      return d.toISOString().split('T')[0];
    }
  }

  // Regex DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = clean.match(/^([0-3]?[0-9])[\/\-\.]([0-1]?[0-9])[\/\-\.]([1-2][0-9]{3})/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // Regex YYYY/MM/DD or YYYY-MM-DD
  const ymdMatch = clean.match(/^([1-2][0-9]{3})[\/\-\.]([0-1]?[0-9])[\/\-\.]([0-3]?[0-9])/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const month = ymdMatch[2].padStart(2, '0');
    const day = ymdMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return undefined;
}

/**
 * Extracts raw textual content from uploaded PDF or Image file
 */
export async function extractRealTextFromFile(
  file: File,
  onProgress?: (stage: string) => void
): Promise<{ text: string; pageCount: number; method: 'PDF_TEXT' | 'TESSERACT_OCR' | 'HYBRID'; confidence: number }> {
  // Empty or tiny file check
  if (!file || file.size === 0) {
    throw new Error('The uploaded file is empty (0 bytes). Please upload a valid document.');
  }

  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|bmp)$/i.test(file.name);

  if (!isPdf && !isImage) {
    throw new Error(`Unsupported file format '${file.type || 'unknown'}'. Please upload a PDF, PNG, or JPEG file.`);
  }

  // 1. Process PDF Document
  if (isPdf) {
    onProgress?.('Reading PDF binary stream...');
    const arrayBuffer = await file.arrayBuffer();

    let pdfDoc;
    try {
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        isEvalSupported: false,
        useSystemFonts: true,
      });
      pdfDoc = await loadingTask.promise;
    } catch (pdfErr) {
      throw new Error(`Failed to read PDF structure. The file may be password protected or corrupted: ${(pdfErr as Error).message}`);
    }

    const numPages = pdfDoc.numPages;
    let fullText = '';
    onProgress?.(`Parsing ${numPages} PDF page(s)...`);

    for (let pageNum = 1; pageNum <= Math.min(numPages, 10); pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items
        .map((item) => ('str' in item ? (item as { str: string }).str : ''))
        .filter((s) => s.trim().length > 0);

      const pageText = pageStrings.join(' ');
      if (pageText.trim()) {
        fullText += (fullText ? '\n\n' : '') + pageText.trim();
      }
    }

    // If PDF contains real digital text, return it
    if (fullText.trim().length >= 40) {
      return {
        text: fullText.trim(),
        pageCount: numPages,
        method: 'PDF_TEXT',
        confidence: 0.96,
      };
    }

    // Scanned PDF: No embedded text found, attempt OCR on first page via canvas (browser environment)
    if (typeof document !== 'undefined') {
      try {
        onProgress?.('Scanned PDF detected. Initializing Tesseract OCR on rendered page...');
        const page1 = await pdfDoc.getPage(1);
        const viewport = page1.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Render page to canvas
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (page1.render({ canvasContext: ctx, viewport } as any) as any).promise;
          
          onProgress?.('Extracting OCR text tokens with Tesseract engine...');
          const worker = await createWorker('eng');
          const ret = await worker.recognize(canvas);
          await worker.terminate();

          const ocrText = ret.data.text.trim();
          if (ocrText.length > 15) {
            return {
              text: ocrText,
              pageCount: numPages,
              method: 'HYBRID',
              confidence: Math.min(0.92, (ret.data.confidence || 85) / 100),
            };
          }
        }
      } catch (ocrErr) {
        console.warn('Scanned PDF OCR fallback failed:', ocrErr);
      }
    }

    if (fullText.trim().length === 0) {
      throw new Error('PDF contains no readable text or scanned characters. The document appears blank or unsupported.');
    }

    return {
      text: fullText.trim(),
      pageCount: numPages,
      method: 'PDF_TEXT',
      confidence: 0.80,
    };
  }

  // 2. Process Image Document via Tesseract.js
  onProgress?.('Initializing Tesseract OCR worker...');
  try {
    const worker = await createWorker('eng');
    onProgress?.('Recognizing optical text in uploaded image...');
    const result = await worker.recognize(file);
    await worker.terminate();

    const ocrText = result.data.text.trim();
    if (!ocrText || ocrText.length < 5) {
      throw new Error('OCR recognition completed, but no legible text was found in the image. Please upload a clear document image.');
    }

    const confidence = Math.min(0.95, Math.max(0.60, (result.data.confidence || 80) / 100));

    return {
      text: ocrText,
      pageCount: 1,
      method: 'TESSERACT_OCR',
      confidence,
    };
  } catch (err) {
    if ((err as Error).message.includes('no legible text')) {
      throw err;
    }
    throw new Error(`OCR Processing Error: ${(err as Error).message || 'Failed to extract text from image.'}`);
  }
}

/**
 * Extracts structured candidate fields from actual document text using regular expressions and domain heuristics
 */
export function extractCandidateFieldsFromText(
  text: string,
  _category: DocumentCategory,
  _currentApp?: InstitutionApplication
): {
  candidateValues: ExtractedCandidateValues;
  extractedPid?: string;
  extractedInstitutionName?: string;
  extractedDocNumber?: string;
  extractedIssueDate?: string;
  extractedExpiryDate?: string;
  extractedAuthority?: string;
  extractedSignatory?: string;
  extractedLocation?: string;
} {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  // 1. Permanent Institute ID (PID)
  // Format: 1-938210941, 1-482019382, PID: 1-..., etc.
  const pidMatch = text.match(/(?:Permanent\s*(?:Institute\s*)?ID|PID|AICTE\s*ID)[:\s\-#]*([1-9]-\d{8,11})/i) ||
                   text.match(/\b([1-9]-\d{8,11})\b/);
  const extractedPid = pidMatch ? pidMatch[1] : undefined;

  // 2. Document Reference / Order / Certificate Number
  const docNumMatch = 
    text.match(/(?:Order\s*(?:No|Number)|Ref(?:erence)?\s*(?:No)?|NOC\s*No|Certificate\s*(?:No|Ref)|Affidavit\s*No|Serial\s*No|UDIN|File\s*No)[:\s\-#]*([A-Z0-9\/\-_]{5,35})/i) ||
    text.match(/\b(DTE\/[A-Z0-9\/\-_]+|CFO\/[A-Z0-9\/\-_]+|AFF-[A-Z0-9\/\-_]+|MUDA\/[A-Z0-9\/\-_]+|VTU\/[A-Z0-9\/\-_]+|DOC-\d{8}-\d{4})\b/i);
  const extractedDocNumber = docNumMatch ? docNumMatch[1].replace(/[:#]/g, '').trim() : undefined;

  // 3. Issue Date / Date of Execution
  const issueDateMatch = 
    text.match(/(?:Date\s*of\s*(?:Issue|Execution)|Issue\s*Date|Dated|Date|Execution\s*Date|Issued\s*on)[:\s\-]*([0-3]?[0-9][\/\-\.][0-1]?[0-9][\/\-\.][1-2][0-9]{3}|[0-3]?[0-9]\s+[A-Za-z]{3,9}\s+[1-2][0-9]{3})/i);
  const rawIssueDate = issueDateMatch ? issueDateMatch[1] : undefined;
  const extractedIssueDate = normalizeDateToIso(rawIssueDate);

  // 4. Expiry Date / Validity
  const expiryDateMatch = 
    text.match(/(?:Valid\s*(?:through|till|until|up\s*to)|Expiry\s*Date|Expires\s*on|Validity\s*Period)[:\s\-]*([0-3]?[0-9][\/\-\.][0-1]?[0-9][\/\-\.][1-2][0-9]{3}|[0-3]?[0-9]\s+[A-Za-z]{3,9}\s+[1-2][0-9]{3})/i);
  const rawExpiryDate = expiryDateMatch ? expiryDateMatch[1] : undefined;
  const extractedExpiryDate = normalizeDateToIso(rawExpiryDate);

  // 5. Institution Name
  let extractedInstitutionName: string | undefined;
  if (/Apex\s+Institute\s+of\s+Technology/i.test(text)) {
    extractedInstitutionName = 'Apex Institute of Technology & Science';
  } else if (/National\s+Institute\s+of\s+Engineering/i.test(text) || /NIEAR/i.test(text)) {
    extractedInstitutionName = 'National Institute of Engineering and Applied Research (NIEAR)';
  } else if (/Metropolitan\s+Polytechnic/i.test(text)) {
    extractedInstitutionName = 'Metropolitan Polytechnic & Technological Institute';
  } else if (/St\.\s*Xavier/i.test(text)) {
    extractedInstitutionName = 'St. Xavier College of Engineering';
  } else if (/Vidyapeeth/i.test(text)) {
    extractedInstitutionName = 'Vidyapeeth Engineering College';
  } else {
    const instRegexMatch = text.match(/(?:Application\s+by|Name\s+of\s+(?:the\s+)?Institute|Institution(?:\s*Name)?|Polytechnic)[:\s]+([A-Za-z0-9&.\s]{6,70}?)(?:\n|AICTE|PID|Location|Survey|Date|\b\d{6}\b)/i);
    if (instRegexMatch && instRegexMatch[1].trim().length > 5) {
      extractedInstitutionName = instRegexMatch[1].trim();
    } else {
      // Look for lines containing Institute, College, University, Academy
      const nameLine = lines.find((l) => /(?:Institute|College|University|Polytechnic|Academy)/i.test(l));
      if (nameLine && nameLine.length < 90) {
        extractedInstitutionName = nameLine;
      }
    }
  }

  // 6. Issuing Authority
  let extractedAuthority: string | undefined;
  if (/Department\s+of\s+Technical\s+Education|DTE/i.test(text)) {
    extractedAuthority = 'Department of Technical Education, Government of Karnataka';
  } else if (/Fire\s+(?:and|&)\s+Emergency\s+Services|Chief\s+Fire\s+Officer/i.test(text)) {
    extractedAuthority = 'Karnataka State Fire and Emergency Services';
  } else if (/Notary\s+Public/i.test(text)) {
    extractedAuthority = 'Competent Notary Public';
  } else if (/Visvesvaraya\s+Technological\s+University|VTU/i.test(text)) {
    extractedAuthority = 'Visvesvaraya Technological University (VTU) Belagavi';
  } else if (/MUDA|Mysuru\s+Urban\s+Development/i.test(text)) {
    extractedAuthority = 'Mysuru Urban Development Authority (MUDA)';
  } else if (/BBMP|Bruhat\s+Bengaluru/i.test(text)) {
    extractedAuthority = 'Bruhat Bengaluru Mahanagara Palike (BBMP)';
  } else if (/Chartered\s+Accountant|ICAI/i.test(text)) {
    extractedAuthority = 'Institute of Chartered Accountants of India (ICAI)';
  } else if (/National\s+Board\s+of\s+Accreditation|NBA/i.test(text)) {
    extractedAuthority = 'National Board of Accreditation (NBA)';
  } else if (/National\s+Assessment\s+and\s+Accreditation\s+Council|NAAC/i.test(text)) {
    extractedAuthority = 'NAAC Council Bangalore';
  } else {
    const authMatch = text.match(/(?:Issuing\s*Authority|Issued\s*by|Office\s*of\s*the)[:\s\-]*([A-Za-z\s,.-]{5,60})/i);
    if (authMatch) extractedAuthority = authMatch[1].trim();
  }

  // 7. Signatory Designation
  let extractedSignatory: string | undefined;
  if (/Principal\s*(?:&|and)?\s*Authorized\s*Signatory/i.test(text)) {
    extractedSignatory = 'Principal & Authorized Signatory';
  } else if (/Director\s+of\s+Technical\s+Education/i.test(text)) {
    extractedSignatory = 'Director of Technical Education';
  } else if (/Chief\s+Fire\s+Officer/i.test(text)) {
    extractedSignatory = 'Chief Fire Officer';
  } else if (/Registrar/i.test(text)) {
    extractedSignatory = 'Registrar';
  } else if (/Town\s+Planning\s+Member/i.test(text)) {
    extractedSignatory = 'Town Planning Member';
  } else if (/Chartered\s+Accountant/i.test(text)) {
    extractedSignatory = 'Practicing Chartered Accountant (FCA)';
  }

  // 8. Location / Pin Code
  const pinMatch = text.match(/\b([1-9][0-9]{5})\b/);
  const extractedLocation = pinMatch ? `PIN Code: ${pinMatch[1]}` : undefined;

  const candidateValues: ExtractedCandidateValues = {
    documentNumber: extractedDocNumber || '[Not Found in Document Text]',
    issueDate: extractedIssueDate || 'Not specified',
    expiryDate: extractedExpiryDate || 'Perpetual / Undefined',
    institutionName: extractedInstitutionName || '[Not Found in Document Text]',
    issuingAuthority: extractedAuthority || '[Not Detected]',
    signatoryDesignation: extractedSignatory || '[Not Detected]',
    pinCodeOrLocation: extractedLocation || '[Not Detected]',
  };

  return {
    candidateValues,
    extractedPid,
    extractedInstitutionName,
    extractedDocNumber,
    extractedIssueDate,
    extractedExpiryDate,
    extractedAuthority,
    extractedSignatory,
    extractedLocation,
  };
}

/**
 * Validates extracted document contents against the active application & institution records
 * Generates transparent anomalies and determines external authority verification status.
 */
export function validateExtractedDocument(
  docId: string,
  docFilename: string,
  category: DocumentCategory,
  text: string,
  currentApp?: InstitutionApplication
): {
  candidateValues: ExtractedCandidateValues;
  anomalies: DocumentAnomalyFinding[];
  isExpired: boolean;
  expiryDate?: string;
  verificationStatus: string;
} {
  const fields = extractCandidateFieldsFromText(text, category, currentApp);
  const anomalies: DocumentAnomalyFinding[] = [];
  const evalDate = new Date('2026-10-28');
  const cleanText = text.trim();

  // 0. Insufficient Text Check (Blank / Unreadable Documents)
  if (cleanText.length < 50) {
    anomalies.push({
      id: `anom_insufficient_text_${Date.now()}`,
      type: 'Data Mismatch',
      severity: 'CRITICAL',
      explanation: `Insufficient Readable Content: Document contains only ${cleanText.length} characters of extractable text. Official statutory certificates must contain readable textual declarations, certificate references, and issuing authority endorsements.`,
      relatedDocumentId: docId,
      relatedDocumentName: docFilename,
      supportingFieldOrText: `Extracted character count: ${cleanText.length} (minimum 50 required)`,
      detectedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      reviewStatus: 'Pending Review',
    });
  } else if (!fields.extractedInstitutionName && !fields.extractedDocNumber && !fields.extractedAuthority) {
    // Document has text but completely lacks all statutory identity markers
    anomalies.push({
      id: `anom_unidentifiable_${Date.now()}`,
      type: 'Data Mismatch',
      severity: 'CRITICAL',
      explanation: `Unidentifiable Certificate: Document lacks essential statutory credentials (no institution name, certificate reference number, or issuing authority identified in text). File may be blank, corrupted, or an unrelated non-statutory document.`,
      relatedDocumentId: docId,
      relatedDocumentName: docFilename,
      supportingFieldOrText: 'All primary statutory identifier fields are missing or unreadable',
      detectedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      reviewStatus: 'Pending Review',
    });
  }

  // 1. Cross-Tenant / Institution PID Validation
  const appPid = currentApp?.institution?.aictePermanentId || currentApp?.institutionId;
  if (fields.extractedPid && appPid && fields.extractedPid !== appPid) {
    anomalies.push({
      id: `anom_pid_${Date.now()}_1`,
      type: 'Data Mismatch',
      severity: 'CRITICAL',
      explanation: `Cross-Tenant / Mismatched AICTE Permanent ID: Document OCR declares PID '${fields.extractedPid}', but the authenticated application belongs to '${appPid}' (${currentApp?.institution?.name}). Please verify if the file was misfiled.`,
      relatedDocumentId: docId,
      relatedDocumentName: docFilename,
      supportingFieldOrText: `Extracted PID: ${fields.extractedPid} vs Registered PID: ${appPid}`,
      detectedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      reviewStatus: 'Pending Review',
    });
  } else if (!fields.extractedPid && appPid && text.length > 50) {
    // If the document has text but does not contain the mandatory PID
    if (category === 'Affidavit / Undertaking' || category === 'No Objection Certificate (NOC)' || category === 'Previous Approval / Extension of Approval (EoA)') {
      anomalies.push({
        id: `anom_pid_miss_${Date.now()}_1`,
        type: 'Data Mismatch',
        severity: 'CRITICAL',
        explanation: `Missing AICTE Permanent ID: Document text contains no AICTE Permanent Institute ID matching registered institution (${appPid}). Official AICTE filings require explicit PID declaration.`,
        relatedDocumentId: docId,
        relatedDocumentName: docFilename,
        supportingFieldOrText: `Registered PID: ${appPid} | Extracted: None`,
        detectedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        reviewStatus: 'Pending Review',
      });
    }
  }

  // 2. Institution Name Consistency
  if (fields.extractedInstitutionName && currentApp?.institution?.name) {
    const normExtracted = fields.extractedInstitutionName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normExpected = currentApp.institution.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const isApexMismatch = normExtracted.includes('apex') && !normExpected.includes('apex');
    const isNiearMismatch = (normExtracted.includes('niear') || normExtracted.includes('engineering')) && normExpected.includes('apex');

    if (isApexMismatch || isNiearMismatch || (!normExpected.includes(normExtracted.slice(0, 10)) && !normExtracted.includes(normExpected.slice(0, 10)))) {
      anomalies.push({
        id: `anom_name_${Date.now()}_2`,
        type: 'Data Mismatch',
        severity: 'CRITICAL',
        explanation: `Institution Name Mismatch: Document references '${fields.extractedInstitutionName}', which does not match active registered institution '${currentApp.institution.name}'.`,
        relatedDocumentId: docId,
        relatedDocumentName: docFilename,
        supportingFieldOrText: `Extracted: "${fields.extractedInstitutionName}"`,
        detectedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        reviewStatus: 'Pending Review',
      });
    }
  } else if (!fields.extractedInstitutionName && currentApp?.institution?.name && text.length > 50) {
    anomalies.push({
      id: `anom_name_miss_${Date.now()}_2`,
      type: 'Data Mismatch',
      severity: 'CRITICAL',
      explanation: `Missing Institution Name: The extracted document text does not contain the name of the registered institution ('${currentApp.institution.name}'). The file may be invalid, unrelated, or fraudulent.`,
      relatedDocumentId: docId,
      relatedDocumentName: docFilename,
      supportingFieldOrText: `Expected: "${currentApp.institution.name}"`,
      detectedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      reviewStatus: 'Pending Review',
    });
  }

  // 3. Expiry Date Check
  let isExpired = false;
  let finalExpiryDate: string | undefined = fields.extractedExpiryDate;

  if (fields.extractedExpiryDate) {
    const expDateObj = new Date(fields.extractedExpiryDate);
    if (!isNaN(expDateObj.getTime())) {
      if (expDateObj.getTime() < evalDate.getTime()) {
        isExpired = true;
        anomalies.push({
          id: `anom_exp_${Date.now()}_3`,
          type: 'Expiry Issue',
          severity: 'CRITICAL',
          explanation: `Document Expired: Statutory validity ended on ${fields.extractedExpiryDate} (before academic evaluation baseline 2026-10-28). A valid renewed certificate is required under AICTE APH 2026-27 norms.`,
          relatedDocumentId: docId,
          relatedDocumentName: docFilename,
          supportingFieldOrText: `Expiry Date: ${fields.extractedExpiryDate}`,
          detectedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          reviewStatus: 'Rectification Requested',
        });
      }
    }
  } else {
    // If no expiry found in text, default to next year for newly ingested docs unless it's a safety clearance that requires explicit dates
    if (category === 'Other Supporting Documents' || category === 'No Objection Certificate (NOC)') {
      anomalies.push({
        id: `anom_noexp_${Date.now()}_4`,
        type: 'Data Mismatch',
        severity: 'WARNING',
        explanation: `Mandatory Expiry Date not detected in certificate text for category '${category}'. Verification officer review recommended.`,
        relatedDocumentId: docId,
        relatedDocumentName: docFilename,
        supportingFieldOrText: 'Expiry Date: Not Extracted',
        detectedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        reviewStatus: 'Pending Review',
      });
    }
  }

  // 4. Inverted Date Range Check
  if (fields.extractedIssueDate && fields.extractedExpiryDate) {
    const issueObj = new Date(fields.extractedIssueDate);
    const expiryObj = new Date(fields.extractedExpiryDate);
    if (!isNaN(issueObj.getTime()) && !isNaN(expiryObj.getTime())) {
      if (issueObj.getTime() > expiryObj.getTime()) {
        anomalies.push({
          id: `anom_date_order_${Date.now()}_5`,
          type: 'Data Mismatch',
          severity: 'WARNING',
          explanation: `Inconsistent Date Sequence: Issue date (${fields.extractedIssueDate}) is chronologically later than expiry date (${fields.extractedExpiryDate}).`,
          relatedDocumentId: docId,
          relatedDocumentName: docFilename,
          supportingFieldOrText: `Issue: ${fields.extractedIssueDate} > Expiry: ${fields.extractedExpiryDate}`,
          detectedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          reviewStatus: 'Pending Review',
        });
      }
    }
  }

  // 5. Authority Verification Status
  // Transparently distinguish AI text extraction confidence from official issuing authority live registry verification
  let verificationStatus = 'Checks Passed';
  if (isExpired || anomalies.some((a) => a.severity === 'CRITICAL')) {
    verificationStatus = 'Needs Manual Review';
  } else if (anomalies.some((a) => a.severity === 'WARNING')) {
    verificationStatus = 'Warning';
  } else if (fields.extractedAuthority) {
    verificationStatus = 'Authority Verification Pending';
  }

  return {
    candidateValues: fields.candidateValues,
    anomalies,
    isExpired,
    expiryDate: finalExpiryDate,
    verificationStatus,
  };
}
