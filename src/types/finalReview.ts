import type { ApplicationType } from './institution';
import type { UserRoleId } from './auth';

export type ScrutinyWorkflowStage = 
  | 'STAGE_1_SUBMITTED'
  | 'STAGE_2_PRE_VALIDATION'
  | 'STAGE_3_DOC_AUTHENTICATION'
  | 'STAGE_4_ISSUING_AUTHORITY'
  | 'STAGE_5_REGULATORY_CHECKLIST'
  | 'STAGE_6_INFRA_EVIDENCE'
  | 'STAGE_7_OFFICER_SCRUTINY'
  | 'STAGE_8_EVIDENCE_INSPECTION'
  | 'STAGE_9_DECISION_RECORDED';

export type AuthorizedDecisionOutcome = 
  | 'FURTHER_SCRUTINY_REQUIRED'
  | 'CLARIFICATION_REQUIRED'
  | 'ADDITIONAL_VERIFICATION_REQUIRED'
  | 'REFERRED_FOR_INSPECTION'
  | 'READY_FOR_COMPETENT_AUTHORITY_REVIEW'
  | 'DECISION_RECORDED';

export interface ScrutinyApplicationSummary {
  id: string;
  applicationRef: string;
  institutionName: string;
  institutionId: string;
  applicationCategory: ApplicationType;
  academicYear: string;
  submissionDate: string;
  completenessScore: number; // Formula: (verifiedDocs / totalDocs) * 100
  documentVerificationStatus: 'Verified by Authorized Source' | 'Mismatch Detected' | 'Verification Pending' | 'Manual Review Required';
  regulatoryComplianceStatus: 'Fully Compliant' | 'Deficit Gap Detected' | 'Review In Progress';
  infrastructureReviewStatus: 'Satisfactory' | 'Deficient' | 'Inspection Recommended' | 'Pending Review';
  pendingActionType: 'None' | 'Clarification Requested' | 'Inspection Review' | 'Officer Determination' | 'Document Missing';
  assignedOfficer: string;
  overallStage: ScrutinyWorkflowStage;
  lastUpdated: string;
}

export interface CrossModuleDiscrepancy {
  id: string;
  applicationId: string;
  fieldName: string;
  source1: string;
  source1Value: string;
  source2: string;
  source2Value: string;
  severity: 'CRITICAL' | 'WARNING' | 'NOTICE';
  explanation: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  resolutionNotes?: string;
}

export interface OfficerObservationItem {
  id: string;
  applicationId: string;
  category: 'INFRASTRUCTURE' | 'LAND' | 'FACULTY' | 'SAFETY' | 'DOCUMENTATION';
  requirementOrField: string;
  severity: 'CRITICAL' | 'ADVERSE' | 'OBSERVATION' | 'SATISFACTORY';
  officerNotes: string;
  reviewerName: string;
  reviewerRole: UserRoleId;
  timestamp: string;
  status: 'DRAFT' | 'SUBMITTED' | 'CLOSED';
}

export interface ClarificationEvidenceRequest {
  id: string;
  applicationId: string;
  targetFindingOrItem: string;
  requestedInfo: string;
  justification: string;
  dueDate: string;
  status: 'DRAFT' | 'SENT' | 'AWAITING_INSTITUTION' | 'RESPONSE_SUBMITTED' | 'RESOLVED';
  institutionResponse?: string;
  responseTimestamp?: string;
  officerNotes?: string;
}

export interface AuthorizedDecisionRecord {
  id: string;
  applicationId: string;
  workflowStage: ScrutinyWorkflowStage;
  outcome: AuthorizedDecisionOutcome;
  remarks: string;
  decisionMaker: string;
  decisionMakerRole: UserRoleId;
  decisionTimestamp: string;
  ruleEngineVersion: string;
  regulatoryReferences: string[];
  amendmentHistory: {
    timestamp: string;
    amendedBy: string;
    previousOutcome: AuthorizedDecisionOutcome;
    amendmentReason: string;
  }[];
}

export interface FinalReviewDashboardKPIs {
  totalUnderReview: number;
  readyForOfficerReview: number;
  pendingVerification: number;
  unresolvedDiscrepancies: number;
  evidenceRequestsPending: number;
  awaitingAuthorizedDecision: number;
}
