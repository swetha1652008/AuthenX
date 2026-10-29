import type { 
  ManagedDocument, 
  ValidationReport, 
  ExtractedFieldItem, 
  DateCheckFinding, 
  DocumentCategory
} from '../types/document';
import type { UserAccount } from '../types/auth';
import { documentService } from './documentService';

const REPORT_STORAGE_PREFIX = 'authenx_val_report_';

// Schemas of required fields per AICTE document category
const CATEGORY_REQUIRED_FIELDS: Record<
  DocumentCategory,
  { key: string; name: string; mandatory: boolean }[]
> = {
  'Affidavit / Undertaking': [
    { key: 'docTitle', name: 'Document Title', mandatory: true },
    { key: 'institutionName', name: 'Institution Name', mandatory: true },
    { key: 'aicteId', name: 'AICTE Permanent ID (PID)', mandatory: true },
    { key: 'issuingAuthority', name: 'Notary / Competent Authority', mandatory: true },
    { key: 'docNumber', name: 'Notary Serial / Affidavit No.', mandatory: true },
    { key: 'issueDate', name: 'Date of Execution', mandatory: true },
    { key: 'expiryDate', name: 'Validity Period', mandatory: false },
    { key: 'signatory', name: 'Deponent / Authorized Signatory', mandatory: true },
  ],
  'No Objection Certificate (NOC)': [
    { key: 'docTitle', name: 'Document Title', mandatory: true },
    { key: 'institutionName', name: 'Institution Name', mandatory: true },
    { key: 'issuingAuthority', name: 'State DTE / Affiliating University', mandatory: true },
    { key: 'docNumber', name: 'Official Order / Despatch Number', mandatory: true },
    { key: 'issueDate', name: 'Issue Date', mandatory: true },
    { key: 'expiryDate', name: 'Expiry Date', mandatory: true },
    { key: 'signatory', name: 'Director / Registrar Signature', mandatory: true },
  ],
  'Accreditation / Certification': [
    { key: 'docTitle', name: 'Accreditation Body Title', mandatory: true },
    { key: 'institutionName', name: 'Institution Name', mandatory: true },
    { key: 'issuingAuthority', name: 'NBA / NAAC Council', mandatory: true },
    { key: 'docNumber', name: 'Accreditation Reference ID', mandatory: true },
    { key: 'issueDate', name: 'Valid From Date', mandatory: true },
    { key: 'expiryDate', name: 'Valid Till Date', mandatory: true },
  ],
  'Statutory Permission / Approval': [
    { key: 'docTitle', name: 'Sanction Order Title', mandatory: true },
    { key: 'institutionName', name: 'Institution Name', mandatory: true },
    { key: 'issuingAuthority', name: 'Municipal / Town Planning Authority', mandatory: true },
    { key: 'docNumber', name: 'Sanction Plan Reference No.', mandatory: true },
    { key: 'issueDate', name: 'Approval Date', mandatory: true },
  ],
  'Faculty-Related Documents': [
    { key: 'docTitle', name: 'Roster / Cadre Register Title', mandatory: true },
    { key: 'institutionName', name: 'Institution Name', mandatory: true },
    { key: 'aicteId', name: 'AICTE Permanent ID', mandatory: true },
    { key: 'issuingAuthority', name: 'Governing Council / University Cell', mandatory: true },
    { key: 'issueDate', name: 'Endorsement Date', mandatory: true },
    { key: 'signatory', name: 'Principal & Registrar', mandatory: true },
  ],
  'Infrastructure-Related Documents': [
    { key: 'docTitle', name: 'Deed / Measurement Record Title', mandatory: true },
    { key: 'institutionName', name: 'Registered Trust / College Name', mandatory: true },
    { key: 'issuingAuthority', name: 'Sub-Registrar Office', mandatory: true },
    { key: 'docNumber', name: 'Registration / Deed Volume Number', mandatory: true },
    { key: 'issueDate', name: 'Registration Date', mandatory: true },
  ],
  'Previous Approval / Extension of Approval (EoA)': [
    { key: 'docTitle', name: 'AICTE EoA Approval Letter', mandatory: true },
    { key: 'institutionName', name: 'Institution Name', mandatory: true },
    { key: 'aicteId', name: 'AICTE Permanent ID', mandatory: true },
    { key: 'issuingAuthority', name: 'AICTE Regional Office / Council HQ', mandatory: true },
    { key: 'docNumber', name: 'AICTE Order File Number', mandatory: true },
    { key: 'issueDate', name: 'Order Release Date', mandatory: true },
    { key: 'expiryDate', name: 'Academic Session Validity', mandatory: true },
  ],
  'Compliance / Deficiency Documents': [
    { key: 'docTitle', name: 'Financial Audit Report', mandatory: true },
    { key: 'institutionName', name: 'Institution Name', mandatory: true },
    { key: 'issuingAuthority', name: 'Chartered Accountant (ICAI)', mandatory: true },
    { key: 'docNumber', name: 'Unique Document Identification (UDIN)', mandatory: true },
    { key: 'issueDate', name: 'Audit Endorsement Date', mandatory: true },
    { key: 'signatory', name: 'Practicing Chartered Accountant', mandatory: true },
  ],
  'Institutional Records': [
    { key: 'docTitle', name: 'Resolution / Minutes Title', mandatory: true },
    { key: 'institutionName', name: 'Trust / Institution Name', mandatory: true },
    { key: 'issueDate', name: 'Meeting Date', mandatory: true },
    { key: 'signatory', name: 'Chairman / Secretary', mandatory: true },
  ],
  'Other Supporting Documents': [
    { key: 'docTitle', name: 'Safety Clearance Title', mandatory: true },
    { key: 'institutionName', name: 'Institution Name', mandatory: true },
    { key: 'issuingAuthority', name: 'State Fire Department', mandatory: true },
    { key: 'docNumber', name: 'NOC Clearance Number', mandatory: true },
    { key: 'issueDate', name: 'Inspection / Issue Date', mandatory: true },
    { key: 'expiryDate', name: 'Certificate Expiry Date', mandatory: true },
  ],
};

export const validationService = {
  /**
   * Evaluates date validity against evaluation date (2026-10-28)
   */
  evaluateDate(fieldKey: 'issueDate' | 'expiryDate', rawDateStr?: string): DateCheckFinding {
    if (!rawDateStr || rawDateStr.trim() === '') {
      return {
        fieldKey,
        label: fieldKey === 'issueDate' ? 'Issue Date' : 'Expiry Date',
        rawDateStr: 'Not Specified',
        status: fieldKey === 'expiryDate' ? 'No Expiry Date Found' : 'Date Uncertain',
        details: fieldKey === 'expiryDate' ? 'No explicit expiration date in document.' : 'Issue date missing.',
      };
    }

    const evalDate = new Date('2026-10-28');
    const parsed = new Date(rawDateStr);

    if (isNaN(parsed.getTime())) {
      return {
        fieldKey,
        label: fieldKey === 'issueDate' ? 'Issue Date' : 'Expiry Date',
        rawDateStr,
        status: 'Date Uncertain',
        details: `Unable to deterministically parse date format '${rawDateStr}'.`,
      };
    }

    const isoStr = parsed.toISOString().split('T')[0];
    const diffTime = parsed.getTime() - evalDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (fieldKey === 'expiryDate') {
      if (diffDays < 0) {
        return {
          fieldKey,
          label: 'Expiry Date',
          rawDateStr,
          parsedIsoDate: isoStr,
          status: 'Expired',
          daysRemaining: diffDays,
          details: `Document expired on ${isoStr} (${Math.abs(diffDays)} days ago). Current valid renewal required.`,
        };
      } else if (diffDays <= 60) {
        return {
          fieldKey,
          label: 'Expiry Date',
          rawDateStr,
          parsedIsoDate: isoStr,
          status: 'Expiring Soon',
          daysRemaining: diffDays,
          details: `Document expires in ${diffDays} days (${isoStr}). Renewal recommended before EoA finalization.`,
        };
      } else {
        return {
          fieldKey,
          label: 'Expiry Date',
          rawDateStr,
          parsedIsoDate: isoStr,
          status: 'Valid Date Range',
          daysRemaining: diffDays,
          details: `Document is active and valid until ${isoStr} (${diffDays} days remaining).`,
        };
      }
    } else {
      // Issue date check
      if (diffDays > 0) {
        return {
          fieldKey,
          label: 'Issue Date',
          rawDateStr,
          parsedIsoDate: isoStr,
          status: 'Manual Review Required',
          details: `Issue date ${isoStr} is in the future relative to evaluation date.`,
        };
      }
      return {
        fieldKey,
        label: 'Issue Date',
        rawDateStr,
        parsedIsoDate: isoStr,
        status: 'Valid Date Range',
        details: `Issued on ${isoStr}. Format and chronology verified.`,
      };
    }
  },

  /**
   * Generates or retrieves a full AI Validation Report for a given document
   */
  getValidationReport(document: ManagedDocument): ValidationReport {
    const storageKey = `${REPORT_STORAGE_PREFIX}${document.applicationId}_${document.id}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }

    // Generate fresh report based on document metadata and candidate values
    const requiredSchema = CATEGORY_REQUIRED_FIELDS[document.documentCategory] || [
      { key: 'docTitle', name: 'Document Title', mandatory: true },
      { key: 'institutionName', name: 'Institution Name', mandatory: true },
      { key: 'issueDate', name: 'Issue Date', mandatory: true },
    ];

    const vals = document.candidateValues || {};
    const extractedFields: ExtractedFieldItem[] = [];
    const missingFields: string[] = [];
    const dateFindings: DateCheckFinding[] = [];

    // Map extracted fields
    requiredSchema.forEach((schema, idx) => {
      let extractedVal = '';
      let confidence = 0.95;
      let snippet = '';

      switch (schema.key) {
        case 'docTitle':
          extractedVal = document.originalFilename.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
          snippet = `Heading on Page 1: "${extractedVal.toUpperCase()}"`;
          confidence = 0.96;
          break;
        case 'institutionName':
          extractedVal = vals.institutionName || 'Apex Institute of Technology & Science';
          snippet = `Recognized body: "${extractedVal}" in header paragraph.`;
          confidence = 0.98;
          break;
        case 'aicteId':
          extractedVal = vals.institutionName?.includes('Trust') ? '1-938210941 (Trust Linked)' : '1-938210941';
          snippet = `AICTE PID: 1-938210941 identified via OCR block.`;
          confidence = 0.99;
          break;
        case 'issuingAuthority':
          extractedVal = vals.issuingAuthority || 'Competent Statutory Department';
          snippet = `Issuing Authority Seal: "${extractedVal}".`;
          confidence = 0.92;
          break;
        case 'docNumber':
          extractedVal = vals.documentNumber || `REF-${document.id.slice(-6)}`;
          snippet = `Reference identifier: "${extractedVal}".`;
          confidence = 0.94;
          break;
        case 'issueDate':
          extractedVal = vals.issueDate || document.uploadDate;
          snippet = `Date of issuance: "${extractedVal}".`;
          confidence = 0.97;
          break;
        case 'expiryDate':
          extractedVal = vals.expiryDate || document.expiryDate || '';
          snippet = extractedVal ? `Validity term ends: "${extractedVal}".` : 'No explicit expiry declared.';
          confidence = extractedVal ? 0.93 : 0.60;
          break;
        case 'signatory':
          extractedVal = vals.signatoryDesignation || 'Authorized Signatory';
          snippet = `Designation under signature seal: "${extractedVal}".`;
          confidence = 0.91;
          break;
        default:
          extractedVal = 'Present & Verified';
          confidence = 0.88;
      }

      const hasVal = Boolean(extractedVal && extractedVal.trim().length > 0);
      if (!hasVal && schema.mandatory) {
        missingFields.push(schema.name);
      }

      extractedFields.push({
        id: `fld_${document.id}_${schema.key}`,
        fieldKey: schema.key,
        fieldName: schema.name,
        extractedValue: extractedVal || 'Not Extracted',
        pageNumber: 1,
        boundingBox: {
          x: 10 + (idx % 3) * 28,
          y: 18 + Math.floor(idx / 3) * 22,
          width: 25,
          height: 8,
          page: 1,
        },
        confidence: hasVal ? confidence : 0.25,
        status: hasVal ? (confidence > 0.85 ? 'Present' : 'Needs Review') : schema.mandatory ? 'Missing' : 'Uncertain',
        evidenceSnippet: snippet,
        isMandatory: schema.mandatory,
      });
    });

    // Date checks
    const issueDateFinding = this.evaluateDate('issueDate', vals.issueDate || document.uploadDate);
    dateFindings.push(issueDateFinding);

    if (vals.expiryDate || document.expiryDate) {
      const expiryFinding = this.evaluateDate('expiryDate', vals.expiryDate || document.expiryDate);
      dateFindings.push(expiryFinding);
    }

    // Collect anomalies from document + missing fields
    const alerts = [...(document.anomalies || [])];
    if (document.isExpired) {
      if (!alerts.some((a) => a.type === 'Expiry Issue')) {
        alerts.push({
          id: `anom_gen_exp_${Date.now()}`,
          type: 'Expiry Issue',
          severity: 'CRITICAL',
          explanation: `Certificate validity expired on ${document.expiryDate}. Required valid certification per AICTE APH norms.`,
          relatedDocumentId: document.id,
          relatedDocumentName: document.originalFilename,
          supportingFieldOrText: `Expiry Date: ${document.expiryDate}`,
          detectedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          reviewStatus: 'Rectification Requested',
        });
      }
    }

    const report: ValidationReport = {
      id: `rep_${document.id}`,
      applicationId: document.applicationId,
      documentId: document.id,
      documentName: document.originalFilename,
      documentCategory: document.documentCategory,
      processingStatus: alerts.some((a) => a.severity === 'CRITICAL')
        ? 'Requires Review'
        : 'Completed',
      classificationResult: {
        category: document.documentCategory,
        confidence: 0.97,
        method: 'Neural Classifier v2.4 (Simulated)',
      },
      ocrStatus: document.ocrStatus,
      ocrEngine: 'Local OCR Engine v5.3 / Native PDF Text Parser (Simulated)',
      extractedFields,
      missingRequiredFields: missingFields,
      dateFindings,
      alerts,
      rulesetVersion: 'AICTE Approval Process Handbook (APH) 2026-27 v1.4',
      processingTimestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      manualReviewDecision: alerts.length > 0 ? 'Pending' : 'Approved',
      isDemoReport: true,
    };

    this.saveValidationReport(report);
    return report;
  },

  saveValidationReport(report: ValidationReport): void {
    try {
      const storageKey = `${REPORT_STORAGE_PREFIX}${report.applicationId}_${report.documentId}`;
      localStorage.setItem(storageKey, JSON.stringify(report));
    } catch (err) {
      console.error('Failed to save validation report:', err);
    }
  },

  /**
   * Submit manual reviewer decision (Approve, Reject, Request Rectification)
   */
  recordReviewDecision(
    applicationId: string,
    documentId: string,
    decision: 'Approved' | 'Rejected' | 'Rectification Requested',
    notes: string,
    reviewer: UserAccount
  ): ValidationReport | undefined {
    const doc = documentService.getDocumentById(applicationId, documentId);
    if (!doc) return undefined;

    const report = this.getValidationReport(doc);
    report.manualReviewDecision = decision;
    report.reviewerNotes = notes;
    report.reviewedBy = `${reviewer.name} (${reviewer.designation || reviewer.authorizedRole})`;
    report.reviewedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Update document verification status
    if (decision === 'Approved') {
      doc.verificationStatus = 'Verified by Authorized Source';
    } else if (decision === 'Rectification Requested') {
      doc.verificationStatus = 'Mismatch Detected';
    }
    const currentDocs = documentService.getDocuments(applicationId);
    const docIdx = currentDocs.findIndex((d) => d.id === documentId);
    if (docIdx >= 0) {
      currentDocs[docIdx] = { ...doc };
      documentService.saveDocuments(applicationId, currentDocs);
    }

    this.saveValidationReport(report);

    // Record in audit trail
    documentService.recordAuditAction(applicationId, {
      id: `audit_rev_${Date.now()}`,
      userId: reviewer.id,
      userName: reviewer.name,
      action: 'VERIFICATION_UPDATE',
      documentId,
      applicationId,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      details: `Recorded review decision '${decision}' for document '${doc.originalFilename}'. Notes: "${notes}"`,
    });

    return report;
  },

  /**
   * Allows authorized reviewer or institution admin to correct an extracted field value
   */
  submitFieldCorrection(
    applicationId: string,
    documentId: string,
    fieldKey: string,
    correctedValue: string,
    user: UserAccount
  ): ValidationReport | undefined {
    const doc = documentService.getDocumentById(applicationId, documentId);
    if (!doc) return undefined;

    const report = this.getValidationReport(doc);
    const targetField = report.extractedFields.find((f) => f.fieldKey === fieldKey);
    if (!targetField) return undefined;

    const oldValue = targetField.extractedValue;
    targetField.extractedValue = correctedValue;
    targetField.isUserCorrected = true;
    targetField.status = 'Present';

    // Also update document candidate values if matching key
    if (doc.candidateValues) {
      if (fieldKey === 'docNumber') doc.candidateValues.documentNumber = correctedValue;
      if (fieldKey === 'institutionName') doc.candidateValues.institutionName = correctedValue;
      if (fieldKey === 'issueDate') doc.candidateValues.issueDate = correctedValue;
      if (fieldKey === 'expiryDate') doc.candidateValues.expiryDate = correctedValue;
    }

    this.saveValidationReport(report);

    documentService.recordAuditAction(applicationId, {
      id: `audit_corr_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      action: 'OBSERVATION_ADDED',
      documentId,
      applicationId,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      details: `Corrected field '${targetField.fieldName}' from '${oldValue}' to '${correctedValue}'.`,
    });

    return report;
  },

  /**
   * Generates a downloadable JSON file for the validation audit report
   */
  downloadJsonReport(report: ValidationReport): void {
    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AuthenX_Validation_Report_${report.applicationId}_${report.documentId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
