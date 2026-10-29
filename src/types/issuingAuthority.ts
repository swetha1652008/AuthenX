import type { UserRoleId } from './auth';

export type VerificationMethodType = 
  | 'QR_CODE'
  | 'REFERENCE_NUMBER'
  | 'OFFICIAL_API'
  | 'MANUAL_OFFICER'
  | 'AI_ANALYSIS';

export type IssuingAuthorityVerificationStatus = 
  | 'Verification Pending'
  | 'Verified'
  | 'Mismatch Detected'
  | 'Expired'
  | 'Source Unavailable'
  | 'Manual Review Required'
  | 'Under Manual Review'
  | 'Additional Documents Required'
  | 'Further Investigation Required'
  | 'Confirmed Against Official Evidence'
  | 'Unable to Confirm'
  | 'Rejected by Authorized Officer';

export type VerificationReasonForManualReview = 
  | 'Official API unavailable'
  | 'QR code unreadable'
  | 'Reference number not found'
  | 'Source mismatch'
  | 'OCR extraction uncertain'
  | 'Potential document anomaly'
  | 'Additional confirmation required'
  | 'Conflicting source records';

export type ManualReviewOutcome = 
  | 'Confirmed Against Official Evidence'
  | 'Mismatch Confirmed'
  | 'Unable to Confirm'
  | 'Additional Documents Required'
  | 'Further Investigation Required';

export type OfficialSourceAdapterStatus = 
  | 'CONNECTED'
  | 'NOT_CONFIGURED'
  | 'RATE_LIMITED'
  | 'TIMEOUT'
  | 'ERROR';

export type FieldComparisonStatus = 
  | 'MATCH'
  | 'MISMATCH'
  | 'MISSING'
  | 'NOT_AVAILABLE'
  | 'NOT_CHECKED';

export interface FieldComparisonItem {
  fieldKey: string;
  fieldLabel: string;
  submittedValue: string;
  officialSourceValue?: string;
  status: FieldComparisonStatus;
  notes?: string;
}

export interface OfficialSourceProvider {
  id: string;
  name: string;
  authority: string;
  category: string;
  type: 'OFFICIAL_API' | 'DIGITAL_REPOSITORY' | 'PORTAL_WORKFLOW' | 'PKI_SIGNATURE';
  connectionStatus: OfficialSourceAdapterStatus;
  lastSuccessfulConnection?: string;
  isConfigured: boolean;
  documentationRef: string;
  endpointDescription: string;
}

export interface QRCodeVerificationDetails {
  hasQrCode: boolean;
  decoded: boolean;
  rawPayload?: string;
  certificateNumber?: string;
  verificationUrl?: string;
  isDomainTrusted: boolean;
  matchedDomain?: string;
  queryStatus: 'SOURCE_NOT_CONFIGURED' | 'VERIFIED' | 'MISMATCH' | 'FAILED';
  sourceName: string;
  timestamp: string;
  details: string;
  matchesSubmittedRecord?: boolean;
}

export interface ReferenceLookupDetails {
  searchedNumber: string;
  issuingAuthority: string;
  isProviderConfigured: boolean;
  recordFound: boolean;
  matchedRecord?: {
    certificateNumber: string;
    institutionName: string;
    issueDate: string;
    expiryDate: string;
    issuingOfficer: string;
    status: string;
  };
  status: 'VERIFIED' | 'MISMATCH' | 'SOURCE_NOT_CONFIGURED' | 'NOT_FOUND';
  details: string;
  timestamp: string;
}

export interface OfficialSourceDetails {
  providerId: string;
  providerName: string;
  authority: string;
  connectionStatus: OfficialSourceAdapterStatus;
  isConfigured: boolean;
  message: string;
  timestamp: string;
  lastSuccessfulCheck?: string;
  rawPayloadSummary?: string;
}

export interface DigitalSignatureDetails {
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

export interface ManualReviewRecord {
  id: string;
  assignedOfficer?: {
    id: string;
    name: string;
    role: UserRoleId | string;
  };
  reviewStatus: 'Pending' | 'In Progress' | 'Completed' | 'Escalated';
  outcome?: ManualReviewOutcome;
  officerNotes?: string;
  evidenceReviewed?: string;
  sourceContactDetails?: string;
  reviewMethod?: string;
  reviewedAt?: string;
  additionalDocsRequested?: string[];
}

export interface AIAnomalyFinding {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  affectedField: string;
  explanation: string;
  supportingEvidence: string;
  confidenceScore?: number;
  recommendedNextStep: string;
}

export interface VerificationAuditEntry {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  timestamp: string;
  details: string;
  previousStatus?: IssuingAuthorityVerificationStatus;
  newStatus?: IssuingAuthorityVerificationStatus;
}

export interface VerificationRequest {
  id: string; // e.g., VR-2026-AICTE-1042
  institutionId: string;
  institutionName: string;
  applicationReference: string;
  applicationCategory: string;
  certificateId?: string;
  certificateType: string;
  certificateNumber: string;
  referenceNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  storagePath: string;
  fileName: string;
  fileSize: string;
  fileHash: string; // SHA-256
  mimeType: string;
  verificationMethods: VerificationMethodType[];
  status: IssuingAuthorityVerificationStatus;
  assignedReviewer?: {
    id: string;
    name: string;
    role: string;
  } | null;
  submittedBy: {
    id: string;
    name: string;
    role: string;
  };
  submittedAt: string;
  updatedAt: string;
  reasonForManualReview?: string;
  extractedOcrFields?: {
    certificateNumber?: string;
    institutionName?: string;
    issuingAuthority?: string;
    issueDate?: string;
    expiryDate?: string;
    confidence?: number;
    isManualCorrection?: boolean;
    correctionHistory?: Array<{
      field: string;
      oldVal: string;
      newVal: string;
      by: string;
      at: string;
    }>;
  };
  qrResult?: QRCodeVerificationDetails;
  referenceResult?: ReferenceLookupDetails;
  officialApiResult?: OfficialSourceDetails;
  digitalSignature?: DigitalSignatureDetails;
  manualReview?: ManualReviewRecord;
  aiFindings?: AIAnomalyFinding[];
  fieldComparisons?: FieldComparisonItem[];
  auditTrail: VerificationAuditEntry[];
  isDemoRecord: boolean;
  notes?: string;
}

export interface VerificationDashboardCounts {
  totalRequests: number;
  verifiedDocuments: number;
  mismatchDetected: number;
  pendingVerification: number;
  manualReviewRequired: number;
}
