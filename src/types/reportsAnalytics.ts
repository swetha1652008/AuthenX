export interface ReportsDashboardMetrics {
  totalApplicationsProcessed: number;
  validationPassRate: number; // e.g. 84.6%
  pendingValidationCount: number;
  documentVerificationSuccessRate: number; // e.g. 91.2%
  flaggedAnomaliesCount: number;
  regulatoryComplianceRate: number; // e.g. 82.5%
  inspectionRecommendedCount: number;
  activeRectificationRequests: number;
  rectificationResolutionRate: number; // e.g. 75.0%
  avgProcessingTurnaroundDays: number; // e.g. 4.8 days
  overdueActionItemsCount: number;
}

export interface ReportFilterOptions {
  academicYear: string;
  applicationType: 'ALL' | 'EOA' | 'NEW' | 'CHANGE';
  region: string;
  complianceStatus: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}

export interface ApplicationValidationReportItem {
  applicationId: string;
  institutionName: string;
  institutionId: string;
  region: string;
  submissionDate: string;
  applicationType: 'EOA' | 'NEW' | 'CHANGE';
  validationStatus: string;
  totalDocs: number;
  verifiedDocs: number;
  flaggedAnomalies: number;
  complianceScore: number;
  officerStatus: string;
  finalVerdict: 'RECOMMENDED' | 'RECTIFICATION_PENDING' | 'INSPECTION_REQUIRED' | 'REJECTED';
}

export interface RegulatoryComplianceReportItem {
  id: string;
  institutionId: string;
  institutionName: string;
  applicationId: string;
  category: 'LAND_AND_BUILDING' | 'FACULTY_CADRE' | 'LABORATORY_INFRA' | 'SAFETY_STANDARDS' | 'FINANCIAL_ACCOUNTS';
  requiredNorm: string;
  claimedCapacity: string;
  verifiedCapacity: string;
  deficitGap: string;
  aiFinding: string;
  complianceState: 'FULL_COMPLIANCE' | 'MINOR_DEFICIT' | 'MAJOR_DEFICIT' | 'UNDER_VERIFICATION';
  recommendation: string;
}

export interface DocumentVerificationReportItem {
  documentId: string;
  applicationId: string;
  institutionName: string;
  documentType: string;
  fileHash: string;
  qrVerificationResult: 'VERIFIED_VALID' | 'FAILED' | 'NOT_APPLICABLE';
  digitalSignatureResult: 'VALID_DSC' | 'INVALID_OR_MISSING' | 'UNTRUSTED_CHAIN';
  authorityCrossCheckResult: 'MATCH_CONFIRMED' | 'UNREGISTERED_RECORD' | 'GATEWAY_TIMEOUT';
  anomalyClassification: 'AUTHENTIC' | 'SUSPECTED_SPLICING' | 'METADATA_MISMATCH' | 'EXPIRED';
  verifiedAt: string;
  authenticityVerdict: 'VERIFIED' | 'FLAGGED' | 'INCONCLUSIVE';
}

export interface PendingActionReportItem {
  id: string;
  applicationId: string;
  institutionName: string;
  institutionId: string;
  pendingActionType: string;
  daysOutstanding: number;
  dueDate: string;
  isOverdue: boolean;
  responsibleParty: string;
  escalationLevel: 'STANDARD' | 'WARNING' | 'CRITICAL_SHOW_CAUSE';
  recommendedRemedy: string;
}

export type StatutoryReportType =
  | 'OVERVIEW'
  | 'APPLICATION_VALIDATION'
  | 'REGULATORY_COMPLIANCE'
  | 'DOCUMENT_VERIFICATION'
  | 'PENDING_ACTIONS';
