import type { 
  ManagedDocument, 
  DocumentCategory, 
  ChecklistRequirement, 
  DocumentDashboardCounts,
  DocumentAuditRecord,
  IssuingAuthorityVerificationStatus
} from '../types/document';
import { ALL_DOCUMENT_CATEGORIES } from '../types/document';
import type { UserAccount } from '../types/auth';
import { runDocumentVerification } from './documentVerificationEngine';
import { institutionService } from './institutionService';
import { extractRealTextFromFile, validateExtractedDocument } from './realOcrService';

const STORAGE_PREFIX = 'authenx_managed_docs_';
const AUDIT_STORAGE_PREFIX = 'authenx_audit_trail_';

// Initial realistic seed documents for APP-2026-AICTE-8491
const SEED_DOCUMENTS_8491: ManagedDocument[] = [
  {
    id: 'doc_8491_01',
    applicationId: 'APP-2026-AICTE-8491',
    institutionId: '1-938210941',
    originalFilename: 'AICTE_Trust_Undertaking_Affidavit_2026.pdf',
    storageReference: '/storage/docs/doc_8491_01.pdf',
    documentCategory: 'Affidavit / Undertaking',
    fileSize: '2.4 MB',
    fileSizeBytes: 2516582,
    mimeType: 'application/pdf',
    uploadDate: '2026-10-15',
    uploadTime: '11:20:00 IST',
    uploadingUserId: 'usr_inst_001',
    uploadingUserName: 'Dr. Arunachalam M.',
    expiryDate: '2027-03-31',
    isExpired: false,
    uploadStatus: 'Uploaded',
    ocrStatus: 'Completed',
    verificationStatus: 'Signature Valid — Authenticity Not Independently Confirmed',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    extractedText: `AFFIDAVIT IN PRESCRIBED AICTE FORMAT
BEFORE THE COMPETENT NOTARY PUBLIC, BENGALURU
I, Dr. Arunachalam M., Principal and Authorized Signatory of Apex Institute of Technology & Science,
Permanent Institute ID: 1-938210941, solemnly declare that our trust strictly adheres to all AICTE
norms specified in the Approval Process Handbook 2026-27. No ragging incidents have occurred on campus.
All land ownership deeds (Survey No. 42/1) remain unencumbered.
Notarized on: 12-10-2025 | Valid through: 31-03-2027
Digitally signed by Dr. Arunachalam M. (DSC Class-3 Organization Token)
Verification QR: https://facilities.aicte-india.org/eoa/verify?id=AFF-KA-BLR-2025-9812`,
    candidateValues: {
      documentNumber: 'AFF-KA-BLR-2025-9812',
      issueDate: '2025-10-12',
      expiryDate: '2027-03-31',
      institutionName: 'Apex Institute of Technology & Science',
      issuingAuthority: 'Notary Public Government of Karnataka',
      signatoryDesignation: 'Principal & Authorized Signatory',
      pinCodeOrLocation: 'Bengaluru, Karnataka 560100',
    },
    anomalies: [],
    isMandatory: true,
  },
  {
    id: 'doc_8491_02',
    applicationId: 'APP-2026-AICTE-8491',
    institutionId: '1-938210941',
    originalFilename: 'State_Govt_DTE_NOC_Approval_2026.pdf',
    storageReference: '/storage/docs/doc_8491_02.pdf',
    documentCategory: 'No Objection Certificate (NOC)',
    fileSize: '3.1 MB',
    fileSizeBytes: 3250585,
    mimeType: 'application/pdf',
    uploadDate: '2026-10-16',
    uploadTime: '14:35:10 IST',
    uploadingUserId: 'usr_inst_001',
    uploadingUserName: 'Dr. Arunachalam M.',
    expiryDate: '2027-06-30',
    isExpired: false,
    uploadStatus: 'Uploaded',
    ocrStatus: 'Completed',
    verificationStatus: 'Verified by Authorized Source',
    sha256Hash: 'a7c93e4d93214c78b5439a29e18b87c12563ea99120bc7126f53da890123ef45',
    extractedText: `GOVERNMENT OF KARNATAKA - DEPARTMENT OF TECHNICAL EDUCATION
PALACE ROAD, BENGALURU - 560001
ORDER NO: DTE/COLL/NOC/2025/4491
SUBJECT: Grant of No Objection Certificate for Extension of Approval (AY 2026-2027).
Reference: Application by Apex Institute of Technology & Science (PID: 1-938210941).
The Government has no objection to the continuing of existing B.Tech and M.Tech programmes.
Issued under seal of Director of Technical Education. Date of Issue: 18-09-2025.`,
    candidateValues: {
      documentNumber: 'DTE/COLL/NOC/2025/4491',
      issueDate: '2025-09-18',
      expiryDate: '2027-06-30',
      institutionName: 'Apex Institute of Technology & Science',
      issuingAuthority: 'Department of Technical Education, Karnataka',
      signatoryDesignation: 'Director of Technical Education',
      pinCodeOrLocation: 'Bengaluru - 560001',
    },
    anomalies: [],
    isMandatory: true,
  },
  {
    id: 'doc_8491_03',
    applicationId: 'APP-2026-AICTE-8491',
    institutionId: '1-938210941',
    originalFilename: 'State_Fire_Safety_NOC_Certificate.pdf',
    storageReference: '/storage/docs/doc_8491_03.pdf',
    documentCategory: 'Other Supporting Documents',
    fileSize: '1.8 MB',
    fileSizeBytes: 1887436,
    mimeType: 'application/pdf',
    uploadDate: '2026-10-17',
    uploadTime: '09:40:22 IST',
    uploadingUserId: 'usr_inst_001',
    uploadingUserName: 'Dr. Arunachalam M.',
    expiryDate: '2025-12-31', // Expired!
    isExpired: true,
    uploadStatus: 'Uploaded',
    ocrStatus: 'Completed',
    verificationStatus: 'Expired',
    sha256Hash: 'bc4591a27e89104ef518c012781bcf77239105ab89012ef34105829140ab56cd',
    extractedText: `KARNATAKA STATE FIRE AND EMERGENCY SERVICES
CHIEF FIRE OFFICER, BENGALURU EAST DIVISION
FIRE SAFETY CLEARANCE CERTIFICATE (NOC)
Ref: CFO/BFES/NOC/COLL/2023-810
Certified that premises of Apex Institute of Technology & Science at Survey No. 42/1, Electronic City,
was inspected for fire prevention measures.
Validity Period: Valid for 2 years from date of issuance.
Issue Date: 15-11-2023 | Expiry Date: 31-12-2025 (Expired)`,
    candidateValues: {
      documentNumber: 'CFO/BFES/NOC/COLL/2023-810',
      issueDate: '2023-11-15',
      expiryDate: '2025-12-31',
      institutionName: 'Apex Institute of Technology & Science',
      issuingAuthority: 'Karnataka State Fire and Emergency Services',
      signatoryDesignation: 'Chief Fire Officer',
      pinCodeOrLocation: 'Electronic City, Bengaluru',
    },
    anomalies: [
      {
        id: 'anom_01',
        type: 'Expiry Issue',
        severity: 'CRITICAL',
        explanation: 'Fire Safety Certificate has expired on 31-12-2025. Current valid NOC is mandatory for EoA.',
        relatedDocumentId: 'doc_8491_03',
        relatedDocumentName: 'State_Fire_Safety_NOC_Certificate.pdf',
        supportingFieldOrText: 'Expiry Date: 31-12-2025',
        detectedAt: '2026-10-27 10:30 IST',
        reviewStatus: 'Rectification Requested',
      },
    ],
    isMandatory: true,
  },
  {
    id: 'doc_8491_04',
    applicationId: 'APP-2026-AICTE-8491',
    institutionId: '1-938210941',
    originalFilename: 'Faculty_Cadre_Roster_Endorsement.pdf',
    storageReference: '/storage/docs/doc_8491_04.pdf',
    documentCategory: 'Faculty-Related Documents',
    fileSize: '4.2 MB',
    fileSizeBytes: 4404019,
    mimeType: 'application/pdf',
    uploadDate: '2026-10-18',
    uploadTime: '16:15:45 IST',
    uploadingUserId: 'usr_inst_001',
    uploadingUserName: 'Dr. Arunachalam M.',
    expiryDate: '2027-05-31',
    isExpired: false,
    uploadStatus: 'Uploaded',
    ocrStatus: 'Completed',
    verificationStatus: 'Verified by Authorized Source',
    sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    extractedText: `APEX INSTITUTE OF TECHNOLOGY & SCIENCE - FACULTY REGISTER AY 2026-27
AFFILIATED TO VTU / DTU | AICTE PID: 1-938210941
DEPARTMENT-WISE FACULTY LIST WITH DESIGNATION, QUALIFICATION & CADRE RATIO:
1. Dept of Computer Science & Engineering: Total Faculty = 24 (4 Professors, 6 Assoc Prof, 14 Asst Prof).
2. Dept of Information Technology: Total Faculty = 14.
All faculties possess approved AICTE Ph.D/M.Tech qualifications and 7th CPC scale endorsements.`,
    candidateValues: {
      documentNumber: 'AITS/FAC-ROSTER/2026-27/01',
      issueDate: '2025-10-05',
      expiryDate: '2027-05-31',
      institutionName: 'Apex Institute of Technology & Science',
      issuingAuthority: 'Governing Council & Affiliating University Inspection Cell',
      signatoryDesignation: 'Registrar & Principal',
      pinCodeOrLocation: 'Bengaluru 560100',
    },
    anomalies: [],
    isMandatory: true,
  },
  {
    id: 'doc_8491_05',
    applicationId: 'APP-2026-AICTE-8491',
    institutionId: '1-938210941',
    originalFilename: 'Land_Title_Deeds_Registration_Order.pdf',
    storageReference: '/storage/docs/doc_8491_05.pdf',
    documentCategory: 'Infrastructure-Related Documents',
    fileSize: '5.6 MB',
    fileSizeBytes: 5872025,
    mimeType: 'application/pdf',
    uploadDate: '2026-10-19',
    uploadTime: '12:05:00 IST',
    uploadingUserId: 'usr_inst_001',
    uploadingUserName: 'Dr. Arunachalam M.',
    expiryDate: '2035-12-31',
    isExpired: false,
    uploadStatus: 'Uploaded',
    ocrStatus: 'Completed',
    verificationStatus: 'Verified by Authorized Source',
    sha256Hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    extractedText: `OFFICE OF THE SUB-REGISTRAR, ELECTRONIC CITY, BENGALURU
REGISTERED SALE DEED NO. 8419/2012
Purchaser: Apex Educational and Charitable Trust
Total Area: 10.5 Acres (Continuous and Unbroken)
Survey Numbers: 42/1, 42/2, Electronic City, Bengaluru Urban District.
Certified earmarked exclusively for establishing Technical Educational Institutions.`,
    candidateValues: {
      documentNumber: 'REG-DEED-8419-2012',
      issueDate: '2012-08-24',
      expiryDate: '2035-12-31',
      institutionName: 'Apex Educational and Charitable Trust',
      issuingAuthority: 'Department of Stamps and Registration, Karnataka',
      signatoryDesignation: 'Senior Sub-Registrar',
      pinCodeOrLocation: 'Electronic City, Bengaluru',
    },
    anomalies: [],
    isMandatory: true,
  },
  {
    id: 'doc_8491_06',
    applicationId: 'APP-2026-AICTE-8491',
    institutionId: '1-938210941',
    originalFilename: 'AICTE_Extension_of_Approval_2025_26.pdf',
    storageReference: '/storage/docs/doc_8491_06.pdf',
    documentCategory: 'Previous Approval / Extension of Approval (EoA)',
    fileSize: '1.2 MB',
    fileSizeBytes: 1258291,
    mimeType: 'application/pdf',
    uploadDate: '2026-10-20',
    uploadTime: '15:20:12 IST',
    uploadingUserId: 'usr_inst_001',
    uploadingUserName: 'Dr. Arunachalam M.',
    expiryDate: '2026-06-30',
    isExpired: false,
    uploadStatus: 'Uploaded',
    ocrStatus: 'Completed',
    verificationStatus: 'Verified by Authorized Source',
    sha256Hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    extractedText: `ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)
NELSON MANDELA MARG, VASANT KUNJ, NEW DELHI-110070
APPROVAL ORDER: South-West/1-938210941/2025/EOA
Sub: Extension of Approval for AY 2025-26.
To: Apex Institute of Technology & Science (1-938210941).
Approved Courses: Computer Science (180), Electronics (120), Mechanical (60), MBA (120).
Member Secretary, AICTE New Delhi.`,
    candidateValues: {
      documentNumber: 'South-West/1-938210941/2025/EOA',
      issueDate: '2025-05-15',
      expiryDate: '2026-06-30',
      institutionName: 'Apex Institute of Technology & Science',
      issuingAuthority: 'All India Council for Technical Education',
      signatoryDesignation: 'Member Secretary',
      pinCodeOrLocation: 'New Delhi - 110070',
    },
    anomalies: [],
    isMandatory: true,
  },
  {
    id: 'doc_8491_07',
    applicationId: 'APP-2026-AICTE-8491',
    institutionId: '1-938210941',
    originalFilename: 'Audited_Balance_Sheet_Financial_2024_25.pdf',
    storageReference: '/storage/docs/doc_8491_07.pdf',
    documentCategory: 'Compliance / Deficiency Documents',
    fileSize: '3.8 MB',
    fileSizeBytes: 3984588,
    mimeType: 'application/pdf',
    uploadDate: '2026-10-21',
    uploadTime: '10:05:30 IST',
    uploadingUserId: 'usr_inst_001',
    uploadingUserName: 'Dr. Arunachalam M.',
    expiryDate: '2026-12-31',
    isExpired: false,
    uploadStatus: 'Uploaded',
    ocrStatus: 'Completed',
    verificationStatus: 'External Verification Not Configured',
    sha256Hash: '3f79bb7b435b05321471daefd374cd6811e891465417b9d830ee577283227437',
    extractedText: `S.K. RAMANATHAN & ASSOCIATES - CHARTERED ACCOUNTANTS
INDEPENDENT AUDITOR'S REPORT FOR FINANCIAL YEAR 2024-25
To the Board of Trustees, Apex Educational Trust.
We have audited the accompanying financial statements of Apex Institute of Technology & Science.
Operating surplus: Rs. 4,82,10,400. All educational endowments and building reserves intact.
UDIN: 25048123BGFTW1892. Dated: 28-08-2025.`,
    candidateValues: {
      documentNumber: 'UDIN-25048123BGFTW1892',
      issueDate: '2025-08-28',
      expiryDate: '2026-12-31',
      institutionName: 'Apex Institute of Technology & Science',
      issuingAuthority: 'Institute of Chartered Accountants of India (ICAI)',
      signatoryDesignation: 'Partner (FCA)',
      pinCodeOrLocation: 'Bengaluru 560002',
    },
    anomalies: [],
    isMandatory: true,
  },
];

export const documentService = {
  getDocuments(applicationId: string): ManagedDocument[] {
    const app = institutionService.getApplicationById(applicationId);
    if (!app) {
      // Access denied or application not found for this institution session
      return [];
    }

    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${applicationId}`);
      if (stored) {
        const parsed: ManagedDocument[] = JSON.parse(stored);
        if (parsed.length > 0 && (!parsed[0].verificationChecks || parsed[0].verificationChecks.length === 0)) {
          const enriched = parsed.map((d) => runDocumentVerification(d, parsed, app));
          this.saveDocuments(applicationId, enriched);
          return enriched;
        }
        return parsed;
      }
    } catch {
      // fallback
    }

    // If no storage, initialize default seed documents tailored to this application & institution
    let seeds: ManagedDocument[] = [];
    const isNiear = app.institutionId === '1-482019382';

    if (applicationId === 'APP-2026-AICTE-8491') {
      seeds = [...SEED_DOCUMENTS_8491];
    } else {
      // Generate seeds tailored to this institution
      seeds = SEED_DOCUMENTS_8491.map((d, idx) => ({
        ...d,
        id: `doc_${applicationId}_${idx + 1}`,
        applicationId,
        institutionId: app.institutionId,
        uploadingUserName: app.institution.authorizedRepresentative,
        candidateValues: {
          ...d.candidateValues,
          institutionName: app.institution.name,
          pinCodeOrLocation: isNiear ? 'Mysuru, Karnataka 570027' : 'Bengaluru, Karnataka 560100',
        },
      }));
    }

    const enrichedSeeds = seeds.map((d) => runDocumentVerification(d, seeds, app));
    this.saveDocuments(applicationId, enrichedSeeds);
    return enrichedSeeds;
  },

  getDocumentById(applicationId: string, documentId: string): ManagedDocument | undefined {
    const docs = this.getDocuments(applicationId);
    return docs.find((d) => d.id === documentId);
  },

  saveDocuments(applicationId: string, docs: ManagedDocument[]): void {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${applicationId}`, JSON.stringify(docs));
    } catch (err) {
      console.error('Failed to save documents to localStorage:', err);
    }
  },

  async uploadDocument(
    applicationId: string,
    institutionId: string,
    file: File,
    category: DocumentCategory,
    user: UserAccount
  ): Promise<{ success: boolean; document?: ManagedDocument; error?: string }> {
    // 1. Validate File Size (Max 10 MB = 10 * 1024 * 1024)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return {
        success: false,
        error: `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds configured maximum limit of 10.0 MB.`,
      };
    }

    // 2. Validate Allowed File Types
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const isAllowedExt = /\.(pdf|jpe?g|png)$/i.test(file.name);
    if (!allowedTypes.includes(file.type) && !isAllowedExt) {
      return {
        success: false,
        error: `File type '${file.type || 'unknown'}' is unsupported. Only PDF, JPG, JPEG, and PNG files are permitted.`,
      };
    }

    // 3. Compute Simulated SHA-256 Hash based on file content & name
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const computedHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    const currentDocs = this.getDocuments(applicationId);

    // 4. Duplicate Check (Hash Anomaly)
    const duplicateDoc = currentDocs.find((d) => d.sha256Hash === computedHash);
    const anomalies: ManagedDocument['anomalies'] = [];

    if (duplicateDoc) {
      anomalies.push({
        id: `anom_dup_${Date.now()}`,
        type: 'Potential Duplicate',
        severity: 'WARNING',
        explanation: `Cryptographic SHA-256 hash matches existing file '${duplicateDoc.originalFilename}'. Verify this is not an unintentional duplicate.`,
        relatedDocumentId: duplicateDoc.id,
        relatedDocumentName: duplicateDoc.originalFilename,
        supportingFieldOrText: `SHA-256: ${computedHash.substring(0, 16)}...`,
        detectedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        reviewStatus: 'Pending Review',
      });
    }

    // 5. Execute Real OCR / Document Text Extraction
    let extractedText = '';
    let extractionMethod = 'PDF_TEXT';
    let extractionConfidence = 0.95;
    try {
      const ocrResult = await extractRealTextFromFile(file);
      extractedText = ocrResult.text;
      extractionMethod = ocrResult.method;
      extractionConfidence = ocrResult.confidence;
    } catch (ocrErr) {
      return {
        success: false,
        error: (ocrErr as Error).message || 'Document text extraction failed. File appears unreadable or corrupted.',
      };
    }

    const app = institutionService.getApplicationById(applicationId);
    const newDocId = `doc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const nowIso = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';

    // Real entity analysis and cross-check against active application
    const ocrValidation = validateExtractedDocument(newDocId, file.name, category, extractedText, app);
    const combinedAnomalies = [...anomalies, ...ocrValidation.anomalies];

    // Query Backend AI Validation Service if available in browser
    if (typeof window !== 'undefined' && typeof window.fetch === 'function' && extractedText.length > 30) {
      try {
        const aiResponse = await fetch('/api/ai/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': user.authorizedRole,
            'x-institution-id': institutionId,
          },
          body: JSON.stringify({
            text: extractedText,
            filename: file.name,
            category,
            registeredApp: app
          })
        });
        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          if (aiData.configured && aiData.success && Array.isArray(aiData.findings)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            aiData.findings.forEach((f: any, idx: number) => {
              if (f.severity === 'CRITICAL' || f.severity === 'WARNING') {
                combinedAnomalies.push({
                  id: `anom_ai_${Date.now()}_${idx}`,
                  type: f.type || 'Data Mismatch',
                  severity: f.severity,
                  explanation: `AI Model (Gemini 2.5 Flash): ${f.explanation}`,
                  relatedDocumentId: newDocId,
                  relatedDocumentName: file.name,
                  supportingFieldOrText: f.evidence || 'Identified by AI reasoning',
                  detectedAt: nowTime,
                  reviewStatus: 'Pending Review',
                });
              }
            });
          }
        }
      } catch (err) {
        console.warn('Backend AI validation service call skipped:', err);
      }
    }

    const newDoc: ManagedDocument = {
      id: newDocId,
      applicationId,
      institutionId,
      originalFilename: file.name,
      storageReference: `/storage/docs/${newDocId}_${file.name}`,
      documentCategory: category,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      fileSizeBytes: file.size,
      mimeType: file.type || 'application/pdf',
      uploadDate: nowIso,
      uploadTime: nowTime,
      uploadingUserId: user.id,
      uploadingUserName: user.name,
      expiryDate: ocrValidation.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isExpired: ocrValidation.isExpired,
      uploadStatus: 'Uploaded',
      ocrStatus: 'Completed',
      verificationStatus: ocrValidation.verificationStatus as IssuingAuthorityVerificationStatus,
      sha256Hash: computedHash,
      extractedText,
      candidateValues: ocrValidation.candidateValues,
      anomalies: combinedAnomalies,
      isMandatory: true,
      notes: `Extracted via ${extractionMethod} (${Math.round(extractionConfidence * 100)}% confidence).`,
    };

    const verifiedDoc = runDocumentVerification(newDoc, [newDoc, ...currentDocs], app);

    const updated = [verifiedDoc, ...currentDocs];
    this.saveDocuments(applicationId, updated);

    // Synchronize parent application status
    try {
      const appsRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('authenx_institution_applications') : null;
      if (appsRaw) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apps = JSON.parse(appsRaw);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const appIdx = apps.findIndex((a: any) => a.id === applicationId);
        if (appIdx >= 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const hasCrit = updated.some((d: any) => 
            d.verificationStatus === 'Needs Manual Review' || 
            d.verificationStatus === 'Processing Failed' ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Array.isArray(d.anomalies) && d.anomalies.some((a: any) => a.severity === 'CRITICAL'))
          );
          if (hasCrit) {
            apps[appIdx].validationStatus = 'Mismatch Detected';
            if (apps[appIdx].status === 'Submitted') {
              apps[appIdx].status = 'Rectification Required';
            }
          }
          localStorage.setItem('authenx_institution_applications', JSON.stringify(apps));
        }
      }
    } catch {
      // safe ignore
    }

    // 6. Record Audit Event
    this.recordAuditAction(applicationId, {
      id: `audit_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      action: 'DOCUMENT_UPLOAD',
      documentId: newDocId,
      applicationId,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      details: `Uploaded new document '${file.name}' under category '${category}' (${newDoc.fileSize}). Initial verification status: ${verifiedDoc.verificationStatus}.`,
    });

    return { success: true, document: verifiedDoc };
  },

  async replaceDocument(
    applicationId: string,
    documentId: string,
    file: File,
    user: UserAccount
  ): Promise<{ success: boolean; document?: ManagedDocument; error?: string }> {
    const docs = this.getDocuments(applicationId);
    const existingIndex = docs.findIndex((d) => d.id === documentId);
    if (existingIndex < 0) {
      return { success: false, error: 'Document not found' };
    }

    const existing = docs[existingIndex];
    const uploadRes = await this.uploadDocument(
      applicationId,
      existing.institutionId,
      file,
      existing.documentCategory,
      user
    );

    if (!uploadRes.success || !uploadRes.document) {
      return uploadRes;
    }

    const app = institutionService.getApplicationById(applicationId);
    const replacedDoc: ManagedDocument = {
      ...uploadRes.document,
      id: existing.id, // keep original ID for reference stability
      notes: `Replaced on ${new Date().toISOString().split('T')[0]}. Previous file: ${existing.originalFilename}`,
    };
    const verifiedReplaced = runDocumentVerification(
      replacedDoc,
      docs.filter((d) => d.id !== existing.id),
      app
    );

    // Remove old document and preserve updated one
    const refreshed = docs.filter((d) => d.id !== documentId);
    refreshed.unshift(verifiedReplaced);

    this.saveDocuments(applicationId, refreshed);

    // Synchronize parent application status
    try {
      const appsRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('authenx_institution_applications') : null;
      if (appsRaw) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apps = JSON.parse(appsRaw);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const appIdx = apps.findIndex((a: any) => a.id === applicationId);
        if (appIdx >= 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const hasCrit = refreshed.some((d: any) => 
            d.verificationStatus === 'Needs Manual Review' || 
            d.verificationStatus === 'Processing Failed' ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Array.isArray(d.anomalies) && d.anomalies.some((a: any) => a.severity === 'CRITICAL'))
          );
          if (hasCrit) {
            apps[appIdx].validationStatus = 'Mismatch Detected';
            if (apps[appIdx].status === 'Submitted') {
              apps[appIdx].status = 'Rectification Required';
            }
          }
          localStorage.setItem('authenx_institution_applications', JSON.stringify(apps));
        }
      }
    } catch {
      // safe ignore
    }

    this.recordAuditAction(applicationId, {
      id: `audit_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      action: 'DOCUMENT_REPLACE',
      documentId: existing.id,
      applicationId,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      details: `Replaced '${existing.originalFilename}' with new file '${file.name}'. Verification status: ${verifiedReplaced.verificationStatus}.`,
    });

    return { success: true, document: verifiedReplaced };
  },

  runVerificationPipeline(applicationId: string): ManagedDocument[] {
    const docs = this.getDocuments(applicationId);
    const app = institutionService.getApplicationById(applicationId);
    const verifiedDocs = docs.map((doc) => runDocumentVerification(doc, docs, app));
    this.saveDocuments(applicationId, verifiedDocs);

    this.recordAuditAction(applicationId, {
      id: `audit_verify_${Date.now()}`,
      userId: 'usr_sys_eng',
      userName: 'AuthenX Verification Engine',
      action: 'VALIDATION_CHECK',
      applicationId,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      details: `Executed full document verification pipeline across ${verifiedDocs.length} application documents.`,
    });

    return verifiedDocs;
  },

  updateDocumentObservation(
    applicationId: string,
    documentId: string,
    observation: string,
    user: UserAccount,
    newStatus?: IssuingAuthorityVerificationStatus
  ): ManagedDocument | undefined {
    const docs = this.getDocuments(applicationId);
    const target = docs.find((d) => d.id === documentId);
    if (!target) return undefined;

    target.reviewerObservations = observation;
    if (newStatus) {
      target.verificationStatus = newStatus;
    }
    this.saveDocuments(applicationId, docs);

    this.recordAuditAction(applicationId, {
      id: `audit_obs_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      action: 'OBSERVATION_ADDED',
      documentId,
      applicationId,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      details: `Officer observation recorded: "${observation}"${newStatus ? ` | Status set to: ${newStatus}` : ''}`,
    });

    return target;
  },

  correctOCRField(
    applicationId: string,
    documentId: string,
    fieldKey: string,
    newValue: string,
    user: UserAccount
  ): ManagedDocument | undefined {
    const docs = this.getDocuments(applicationId);
    const target = docs.find((d) => d.id === documentId);
    if (!target) return undefined;

    if (!target.candidateValues) {
      target.candidateValues = {};
    }
    (target.candidateValues as Record<string, string>)[fieldKey] = newValue;

    const app = institutionService.getApplicationById(applicationId);
    const reverified = runDocumentVerification(target, docs, app);

    const index = docs.findIndex((d) => d.id === documentId);
    if (index !== -1) {
      docs[index] = reverified;
    }
    this.saveDocuments(applicationId, docs);

    this.recordAuditAction(applicationId, {
      id: `audit_ocr_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      action: 'OCR_FIELD_CORRECTED',
      documentId,
      applicationId,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      details: `Authorized OCR correction: field '${fieldKey}' updated to "${newValue}". Re-verified.`,
    });

    return reverified;
  },

  deleteDocument(applicationId: string, documentId: string, user: UserAccount): boolean {
    const docs = this.getDocuments(applicationId);
    const target = docs.find((d) => d.id === documentId);
    if (!target) return false;

    const filtered = docs.filter((d) => d.id !== documentId);
    this.saveDocuments(applicationId, filtered);

    this.recordAuditAction(applicationId, {
      id: `audit_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      action: 'DOCUMENT_DELETE',
      documentId,
      applicationId,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      details: `Deleted document '${target.originalFilename}' from category '${target.documentCategory}'.`,
    });

    return true;
  },

  updateCategory(
    applicationId: string,
    documentId: string,
    newCategory: DocumentCategory,
    user: UserAccount
  ): ManagedDocument | undefined {
    const docs = this.getDocuments(applicationId);
    const target = docs.find((d) => d.id === documentId);
    if (!target) return undefined;

    const oldCategory = target.documentCategory;
    target.documentCategory = newCategory;
    this.saveDocuments(applicationId, docs);

    this.recordAuditAction(applicationId, {
      id: `audit_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      action: 'CATEGORY_CHANGE',
      documentId,
      applicationId,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      details: `Changed document category from '${oldCategory}' to '${newCategory}'.`,
    });

    return target;
  },

  getChecklist(applicationId: string): ChecklistRequirement[] {
    const docs = this.getDocuments(applicationId);

    const rules: {
      category: DocumentCategory;
      title: string;
      description: string;
      isMandatory: boolean;
      minimumCount: number;
    }[] = [
      {
        category: 'Affidavit / Undertaking',
        title: 'Prescribed AICTE Format Undertaking',
        description: 'Notarized affidavit on anti-ragging, land possession, and academic compliance.',
        isMandatory: true,
        minimumCount: 1,
      },
      {
        category: 'No Objection Certificate (NOC)',
        title: 'State Govt & Affiliating University NOC',
        description: 'Clearance from Department of Technical Education and University affiliation order.',
        isMandatory: true,
        minimumCount: 1,
      },
      {
        category: 'Accreditation / Certification',
        title: 'NBA / NAAC Accreditation Certificates',
        description: 'Valid accreditation grade certificates for existing technical programmes.',
        isMandatory: false,
        minimumCount: 1,
      },
      {
        category: 'Statutory Permission / Approval',
        title: 'Town Planning & Municipal Building Sanction',
        description: 'Sanctioned master plan, building safety clearance, and occupancy permit.',
        isMandatory: true,
        minimumCount: 1,
      },
      {
        category: 'Faculty-Related Documents',
        title: 'Faculty Cadre & Appointment Register',
        description: 'Endorsed faculty roster verifying cadre ratio (1:15/1:20) and pay scale compliance.',
        isMandatory: true,
        minimumCount: 1,
      },
      {
        category: 'Infrastructure-Related Documents',
        title: 'Land Title Deeds & Measurement Certificate',
        description: 'Registered title deeds for contiguous campus land and barrier-free facility proof.',
        isMandatory: true,
        minimumCount: 1,
      },
      {
        category: 'Previous Approval / Extension of Approval (EoA)',
        title: 'Previous Session AICTE Approval Order',
        description: 'Extension of Approval copy for previous academic year with intake table.',
        isMandatory: true,
        minimumCount: 1,
      },
      {
        category: 'Compliance / Deficiency Documents',
        title: 'Audited Financial Statements & Balance Sheet',
        description: 'Audited financial report with UDIN from certified chartered accountant.',
        isMandatory: true,
        minimumCount: 1,
      },
      {
        category: 'Institutional Records',
        title: 'Governing Council Minutes & Trust Deed',
        description: 'Registered trust constitution and minutes of latest governing board meeting.',
        isMandatory: false,
        minimumCount: 1,
      },
      {
        category: 'Other Supporting Documents',
        title: 'Fire Safety & Structural Stability Certificate',
        description: 'Current Fire Safety NOC from State Fire Department and structural stability.',
        isMandatory: true,
        minimumCount: 1,
      },
    ];

    return rules.map((r) => {
      const matchingDocs = docs.filter(
        (d) => d.documentCategory === r.category && d.uploadStatus !== 'Failed'
      );
      const validDocs = matchingDocs.filter((d) => !d.isExpired);
      const isSatisfied = validDocs.length >= r.minimumCount;

      return {
        category: r.category,
        title: r.title,
        description: r.description,
        isMandatory: r.isMandatory,
        minimumCount: r.minimumCount,
        uploadedCount: matchingDocs.length,
        validCount: validDocs.length,
        isSatisfied,
        statusNotes: isSatisfied
          ? 'Compliant'
          : matchingDocs.length > 0 && validDocs.length === 0
          ? 'Uploaded document has expired'
          : r.isMandatory
          ? 'Mandatory document missing'
          : 'Optional certificate pending',
      };
    });
  },

  getDashboardCounts(applicationId: string): DocumentDashboardCounts {
    const docs = this.getDocuments(applicationId);
    const checklist = this.getChecklist(applicationId);

    const totalRequired = checklist.filter((c) => c.isMandatory).length;
    const uploadedDocuments = docs.length;
    const missingDocuments = checklist.filter((c) => c.isMandatory && !c.isSatisfied).length;
    const expiredDocuments = docs.filter((d) => d.isExpired).length;
    const pendingVerification = docs.filter(
      (d) =>
        d.verificationStatus === 'Pending Verification' ||
        d.verificationStatus === 'Verification Pending' ||
        d.verificationStatus === 'External Verification Not Configured' ||
        d.verificationStatus === 'Signature Valid — Authenticity Not Independently Confirmed'
    ).length;
    const requiringAttention = docs.filter(
      (d) =>
        d.isExpired ||
        d.verificationStatus === 'Mismatch Detected' ||
        d.verificationStatus === 'Duplicate Detected' ||
        d.verificationStatus === 'Manual Review Required' ||
        d.verificationStatus === 'Verification Failed' ||
        (d.anomalies && d.anomalies.some((a) => a.severity === 'CRITICAL' || a.severity === 'WARNING'))
    ).length;

    return {
      totalRequired,
      uploadedDocuments,
      missingDocuments,
      expiredDocuments,
      pendingVerification,
      requiringAttention,
    };
  },

  getAuditTrail(applicationId: string): DocumentAuditRecord[] {
    try {
      const stored = localStorage.getItem(`${AUDIT_STORAGE_PREFIX}${applicationId}`);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }

    const defaultAudit: DocumentAuditRecord[] = [
      {
        id: 'audit_init_1',
        userId: 'usr_inst_001',
        userName: 'Dr. Arunachalam M.',
        action: 'DOCUMENT_UPLOAD',
        applicationId,
        timestamp: '2026-10-15 11:20 IST',
        details: 'Initial package of 7 statutory documents uploaded to secure vault.',
      },
      {
        id: 'audit_init_2',
        userId: 'usr_doc_003',
        userName: 'Shri Vikram Nair',
        action: 'VALIDATION_CHECK',
        applicationId,
        timestamp: '2026-10-17 14:10 IST',
        details: 'Automated preliminary validation run. 1 expired certificate flagged (Fire Safety).',
      },
    ];

    this.saveAuditTrail(applicationId, defaultAudit);
    return defaultAudit;
  },

  saveAuditTrail(applicationId: string, records: DocumentAuditRecord[]): void {
    try {
      localStorage.setItem(`${AUDIT_STORAGE_PREFIX}${applicationId}`, JSON.stringify(records));
    } catch (err) {
      console.error('Failed to save audit trail:', err);
    }
  },

  recordAuditAction(applicationId: string, record: DocumentAuditRecord): void {
    const list = this.getAuditTrail(applicationId);
    const updated = [record, ...list];
    this.saveAuditTrail(applicationId, updated);
  },

  getAllCategories(): DocumentCategory[] {
    return ALL_DOCUMENT_CATEGORIES;
  },
};
