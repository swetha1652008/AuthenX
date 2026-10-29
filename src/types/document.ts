export type DocumentCategory =
  | 'Affidavit / Undertaking'
  | 'No Objection Certificate (NOC)'
  | 'Accreditation / Certification'
  | 'Statutory Permission / Approval'
  | 'Faculty-Related Documents'
  | 'Infrastructure-Related Documents'
  | 'Previous Approval / Extension of Approval (EoA)'
  | 'Compliance / Deficiency Documents'
  | 'Institutional Records'
  | 'Other Supporting Documents';

export const ALL_DOCUMENT_CATEGORIES: DocumentCategory[] = [
  'Affidavit / Undertaking',
  'No Objection Certificate (NOC)',
  'Accreditation / Certification',
  'Statutory Permission / Approval',
  'Faculty-Related Documents',
  'Infrastructure-Related Documents',
  'Previous Approval / Extension of Approval (EoA)',
  'Compliance / Deficiency Documents',
  'Institutional Records',
  'Other Supporting Documents',
];

export type UploadStatus = 
  | 'Uploaded'
  | 'Processing'
  | 'Failed'
  | 'Replaced'
  | 'Missing';

export type OCRProcessingStatus =
  | 'Pending'
  | 'Processing'
  | 'Completed'
  | 'OCR Failed'
  | 'Manual Review Required';

export type IssuingAuthorityVerificationStatus =
  | 'Processing Failed'
  | 'Checks Passed'
  | 'Warning'
  | 'Needs Manual Review'
  | 'Authority Verification Pending'
  | 'Officially Verified'
  // Backward compatibility aliases:
  | 'Pending Verification'
  | 'Verified by Authorized Source'
  | 'Signature Valid — Authenticity Not Independently Confirmed'
  | 'Mismatch Detected'
  | 'Expired'
  | 'Duplicate Detected'
  | 'Manual Review Required'
  | 'Verification Failed'
  | 'External Verification Not Configured'
  | 'Verification Pending'
  | 'Source Unavailable';

export type AnomalySeverity = 'NORMAL' | 'WARNING' | 'CRITICAL';

export type AnomalyType =
  | 'No Issue Detected by Implemented Checks'
  | 'Potential Duplicate'
  | 'Data Mismatch'
  | 'Expiry Issue'
  | 'Manual Review Required';

export interface DocumentAnomalyFinding {
  id: string;
  type: AnomalyType;
  severity: AnomalySeverity;
  explanation: string;
  relatedDocumentId: string;
  relatedDocumentName: string;
  supportingFieldOrText?: string;
  detectedAt: string;
  reviewStatus: 'Pending Review' | 'Reviewed & Accepted' | 'Rectification Requested';
}

export interface ExtractedCandidateValues {
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  institutionName?: string;
  issuingAuthority?: string;
  signatoryDesignation?: string;
  pinCodeOrLocation?: string;
}

export interface QRCodeVerificationResult {
  hasQrCode: boolean;
  decodedPayload?: string;
  verificationUrl?: string;
  isDomainTrusted: boolean;
  trustedDomainMatch?: string; // e.g. "aicte-india.org", "karnataka.gov.in"
  certificateNumberExtracted?: string;
  queryStatus: 'SOURCE_NOT_CONFIGURED' | 'VERIFIED' | 'FAILED' | 'MISMATCH';
  matchedRecordFields?: { field: string; expected: string; documentValue: string; matches: boolean }[];
  details: string;
}

export interface DigitalSignatureResult {
  isSigned: boolean;
  signatureFormat?: 'PDF_PKCS7_DETACHED' | 'X509_PKI' | 'NONE';
  signerName?: string;
  signerOrganization?: string;
  certificateAuthority?: string;
  signingTime?: string;
  isDigestIntact: boolean;
  isCertTrusted: boolean;
  signatureValidityStatus: 'VALID' | 'INVALID' | 'UNSIGNED' | 'INCONCLUSIVE';
  authenticityDistinctionNote: string;
}

export interface TamperingIndicatorResult {
  hasSuspiciousMetadata: boolean;
  editingSoftwareDetected?: string;
  modDateInconsistency?: boolean;
  linearizationAnomaly?: boolean;
  structuralAlerts: string[];
  disclaimer: string;
}

export interface ExplainableVerificationCheck {
  id: string;
  checkName: string;
  result: 'PASS' | 'WARNING' | 'FAIL' | 'INCONCLUSIVE' | 'NOT_CONFIGURED';
  relatedDocumentId: string;
  evidenceOrConflictingField: string;
  timestamp: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  recommendedNextAction: string;
}

export interface DocumentAuditRecord {
  id: string;
  userId: string;
  userName: string;
  action: 
    | 'DOCUMENT_UPLOAD'
    | 'DOCUMENT_REPLACE'
    | 'DOCUMENT_DELETE'
    | 'CATEGORY_CHANGE'
    | 'OCR_PROCESSED'
    | 'VALIDATION_CHECK'
    | 'VERIFICATION_UPDATE'
    | 'OBSERVATION_ADDED'
    | 'OCR_FIELD_CORRECTED';
  documentId?: string;
  applicationId: string;
  timestamp: string;
  details: string;
}

export interface ManagedDocument {
  id: string;
  applicationId: string;
  institutionId: string;
  originalFilename: string;
  storageReference: string;
  documentCategory: DocumentCategory;
  fileSize: string; // e.g., "2.4 MB"
  fileSizeBytes: number;
  mimeType: string;
  uploadDate: string; // YYYY-MM-DD
  uploadTime: string; // HH:MM:SS IST
  uploadingUserId: string;
  uploadingUserName: string;
  expiryDate?: string; // YYYY-MM-DD
  isExpired?: boolean;
  uploadStatus: UploadStatus;
  ocrStatus: OCRProcessingStatus;
  verificationStatus: IssuingAuthorityVerificationStatus;
  sha256Hash: string;
  extractedText?: string;
  candidateValues?: ExtractedCandidateValues;
  anomalies?: DocumentAnomalyFinding[];
  isMandatory: boolean;
  notes?: string;
  reviewerObservations?: string;
  downloadUrl?: string;
  previewUrl?: string;
  qrVerification?: QRCodeVerificationResult;
  digitalSignature?: DigitalSignatureResult;
  tamperingIndicators?: TamperingIndicatorResult;
  verificationChecks?: ExplainableVerificationCheck[];
  externalVerificationEndpoint?: string;
}

export interface ChecklistRequirement {
  category: DocumentCategory;
  title: string;
  description: string;
  isMandatory: boolean;
  minimumCount: number;
  uploadedCount: number;
  validCount: number;
  isSatisfied: boolean;
  statusNotes?: string;
}

export interface DocumentDashboardCounts {
  totalRequired: number;
  uploadedDocuments: number;
  missingDocuments: number;
  expiredDocuments: number;
  pendingVerification: number;
  requiringAttention: number;
}

export type RequiredFieldStatus = 'Present' | 'Missing' | 'Uncertain' | 'Needs Review';

export type DateValidationStatus =
  | 'Valid Date Range'
  | 'Expiring Soon'
  | 'Expired'
  | 'No Expiry Date Found'
  | 'Date Uncertain'
  | 'Manual Review Required';

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number;
  height: number;
  page: number;
}

export interface ExtractedFieldItem {
  id: string;
  fieldKey: string;
  fieldName: string;
  extractedValue: string;
  canonicalValue?: string;
  pageNumber: number;
  boundingBox?: BoundingBox;
  confidence: number; // 0.0 - 1.0 (e.g. 0.94)
  status: RequiredFieldStatus;
  evidenceSnippet?: string;
  isMandatory: boolean;
  isUserCorrected?: boolean;
}

export interface DateCheckFinding {
  fieldKey: 'issueDate' | 'expiryDate';
  label: string;
  rawDateStr: string;
  parsedIsoDate?: string;
  status: DateValidationStatus;
  daysRemaining?: number;
  details: string;
}

export interface ValidationReport {
  id: string;
  applicationId: string;
  documentId: string;
  documentName: string;
  documentCategory: DocumentCategory;
  processingStatus: 'Completed' | 'Processing' | 'Failed' | 'Requires Review';
  classificationResult: {
    category: DocumentCategory;
    confidence: number;
    method: 'Neural Classifier v2.4 (Simulated)' | 'Rule-based Heuristic' | 'Manual Override';
  };
  ocrStatus: OCRProcessingStatus;
  ocrEngine: string;
  extractedFields: ExtractedFieldItem[];
  missingRequiredFields: string[];
  dateFindings: DateCheckFinding[];
  alerts: DocumentAnomalyFinding[];
  rulesetVersion: string; // e.g. "AICTE APH 2026-27 v1.2"
  processingTimestamp: string;
  manualReviewDecision?: 'Approved' | 'Rejected' | 'Rectification Requested' | 'Pending';
  reviewerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  isDemoReport: boolean;
}

