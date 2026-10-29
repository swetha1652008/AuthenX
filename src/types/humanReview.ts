export type HumanReviewStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'RECTIFICATION_REQUESTED'
  | 'REVALIDATION_PENDING'
  | 'RESOLVED'
  | 'COMPLETED';

export type ReviewPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type RectificationStatus =
  | 'DRAFT'
  | 'SENT'
  | 'AWAITING_RESPONSE'
  | 'RESPONSE_SUBMITTED'
  | 'UNDER_OFFICER_REVIEW'
  | 'FURTHER_CORRECTION_REQUIRED'
  | 'ACCEPTED'
  | 'REVALIDATION_PENDING'
  | 'CLOSED';

export type RectificationCategory =
  | 'FACULTY_DEFICIENCY'
  | 'INFRASTRUCTURE_MISMATCH'
  | 'LAND_DOCUMENT_DISCREPANCY'
  | 'CADRE_RATIO_VIOLATION'
  | 'FINANCIAL_EXPIRED'
  | 'AFFILIATION_PENDING'
  | 'SAFETY_CERTIFICATE'
  | 'OTHER';

export interface InstitutionResponseData {
  submittedAt: string;
  notes: string;
  replacementDocumentName?: string;
  replacementDocumentHash?: string;
  replacementEvidenceUrl?: string;
  submittedBy: string;
}

export interface RectificationRequest {
  id: string;
  applicationId: string;
  institutionId: string;
  institutionName: string;
  findingId?: string;
  category: RectificationCategory;
  title: string;
  specificReason: string;
  regulatoryClauseRef: string;
  requiredCorrection: string;
  institutionInstructions: string;
  dueDate: string; // YYYY-MM-DD
  status: RectificationStatus;
  sentAt: string;
  sentBy: string;
  institutionResponse?: InstitutionResponseData;
  officerRemarks?: string;
  updatedAt: string;
}

export interface ReviewFindingItem {
  id: string;
  title: string;
  category: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  aiObservation: string;
  officerDetermination?: string;
  status: 'FLAGGED' | 'IN_REVIEW' | 'RECTIFICATION_REQUESTED' | 'RESOLVED';
  confidenceScore: number;
  ruleRef?: string;
  evidenceRef?: string;
}

export interface ReviewRemarkItem {
  id: string;
  timestamp: string;
  officerName: string;
  officerRole: string;
  remark: string;
  actionTaken: string;
}

export interface HumanReviewCase {
  id: string;
  applicationId: string;
  institutionId: string;
  institutionName: string;
  applicationType: 'EOA' | 'CHANGE' | 'NEW';
  programCourse: string;
  region: string;
  priority: ReviewPriority;
  status: HumanReviewStatus;
  assignedOfficer: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  findingSummary: string;
  findingsCount: number;
  findings: ReviewFindingItem[];
  remarksHistory: ReviewRemarkItem[];
}

export interface RevalidationRun {
  id: string;
  applicationId: string;
  rectificationId?: string;
  executedAt: string;
  executedBy: string;
  checksRun: string[];
  previousScore: number;
  newScore: number;
  findingsCleared: number;
  findingsRemaining: number;
  status: 'PASSED' | 'PARTIAL' | 'FAILED';
  summary: string;
}

export interface HumanReviewDashboardStats {
  pendingReviews: number;
  highPriorityCases: number;
  rectificationRequestsSent: number;
  awaitingInstitutionResponse: number;
  rectificationsSubmitted: number;
  revalidationPending: number;
  reviewsCompleted: number;
}

export interface HumanReviewFilterOptions {
  searchQuery: string;
  status?: 'ALL' | HumanReviewStatus;
  priority?: 'ALL' | ReviewPriority;
  assignedOfficer?: string;
  dateRange?: string;
}
