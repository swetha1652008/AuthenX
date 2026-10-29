export type RuleCategoryScope = 'EOA' | 'CHANGE' | 'ALL';

export type ComplianceEvidenceCategory =
  | 'BUILDING_PLAN'
  | 'CLASSROOM_PHOTO'
  | 'LABORATORY_PHOTO'
  | 'WORKSHOP_PHOTO'
  | 'LIBRARY'
  | 'EQUIPMENT'
  | 'ACCESSIBILITY'
  | 'SAFETY_CERT'
  | 'OCCUPANCY_DOC'
  | 'CAMPUS_VIDEO'
  | 'OTHER_INFRASTRUCTURE';

export type ChecklistEvidenceStatus =
  | 'NOT_SUBMITTED'
  | 'PARTIALLY_SUBMITTED'
  | 'SUBMITTED'
  | 'REPLACED'
  | 'EXPIRED';

export type PreliminaryCheckResult =
  | 'PENDING_ANALYSIS'
  | 'COMPLIANT'
  | 'POTENTIAL_GAP'
  | 'DEFICIENT'
  | 'NOT_APPLICABLE';

export type OfficerAssessmentResult =
  | 'UNASSESSED'
  | 'APPROVED'
  | 'RECTIFICATION_REQUIRED'
  | 'FLAGGED_DEFICIENCY'
  | 'INSPECTION_RECOMMENDED';

export type ChecklistItemReviewStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'CONFIRMED'
  | 'ESCALATED';

export type ComplianceFindingCategory =
  | 'MISSING_EVIDENCE'
  | 'INCOMPLETE_EVIDENCE'
  | 'EXPIRED_DOCUMENT'
  | 'INFRASTRUCTURE_DISCREPANCY'
  | 'CONFLICTING_INFO'
  | 'LOW_QUALITY_EVIDENCE'
  | 'ADDITIONAL_VERIFICATION_REQUIRED'
  | 'POTENTIAL_REQUIREMENT_GAP'
  | 'RULE_CONFIGURATION_REQUIRED';

export type EvidenceRequestStatus =
  | 'DRAFT'
  | 'SENT'
  | 'AWAITING_INSTITUTION_RESPONSE'
  | 'RESPONSE_SUBMITTED'
  | 'UNDER_REVIEW'
  | 'RESOLVED'
  | 'CLOSED';

export type InspectionRecommendationStatus =
  | 'NOT_REQUIRED'
  | 'ASSESSMENT_PENDING'
  | 'RECOMMENDED_FOR_OFFICER_REVIEW'
  | 'INSPECTION_RECOMMENDED'
  | 'AWAITING_AUTHORIZED_DECISION'
  | 'INSPECTION_SCHEDULED'
  | 'INSPECTION_COMPLETED'
  | 'CLOSED_WITH_REASON';

export type FindingSourceType =
  | 'DETERMINISTIC_RULE'
  | 'AI_OBSERVATION'
  | 'OFFICER_FLAG';

export interface RuleValidationConfig {
  minAreaSqm?: number;
  minRatio?: string;
  maxAgeYears?: number;
  requiredKeywords?: string[];
  minimumClassrooms?: number;
  minimumLaboratories?: number;
  notes?: string;
}

export interface RuleHistoryEntry {
  version: string;
  changedBy: string;
  changedAt: string;
  changeSummary: string;
}

export interface ComplianceRule {
  id: string;
  requirementCode: string;
  title: string;
  description: string;
  regulatorySource: string;
  sourceReference: string;
  applicableCategories: RuleCategoryScope[];
  academicYear: string;
  ruleVersion: string;
  requiredEvidenceTypes: string[];
  validationConfig: RuleValidationConfig;
  mandatory: boolean;
  effectiveFrom: string;
  effectiveTo: string;
  active: boolean;
  reviewerInstructions: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  history: RuleHistoryEntry[];
}

export interface ExtractedDimension {
  label: string;
  widthMeters?: number;
  lengthMeters?: number;
  areaSqm?: number;
  confidence?: number;
}

export interface ProcessedVideoFrame {
  frameNumber: number;
  timestamp: string;
  frameUrl?: string;
  detectedFacilities: string[];
  observations: string;
}

export interface EvidenceAnalysisResult {
  id: string;
  evidenceId: string;
  analysisType: 'PHOTO_CV' | 'VIDEO_FRAME_CV' | 'FLOOR_PLAN_OCR' | 'DOCUMENT_TEXT_OCR';
  provider: string;
  analysisStatus: 'COMPLETED' | 'PRELIMINARY' | 'FAILED' | 'NOT_CONFIGURED';
  readabilityScore: number;
  detectedLabels: string[];
  extractedDimensions?: ExtractedDimension[];
  processedFrames?: ProcessedVideoFrame[];
  findings: string[];
  confidence: number;
  discrepancyNote?: string;
  createdAt: string;
}

export interface InfrastructureEvidence {
  id: string;
  assessmentId: string;
  institutionId: string;
  applicationReference: string;
  linkedRequirementId: string;
  evidenceCategory: ComplianceEvidenceCategory;
  title: string;
  description: string;
  storagePath: string;
  fileType: string;
  fileSizeBytes: number;
  fileSize: string;
  fileHash: string;
  captureDate?: string;
  issueDate?: string;
  expiryDate?: string;
  versionNumber: number;
  submittedBy: string;
  submittedAt: string;
  reviewStatus: 'SUBMITTED' | 'UNDER_ANALYSIS' | 'CONFIRMED_GENUINE' | 'DISCREPANCY_FLAGGED' | 'SUPERSEDED';
  previousVersionId?: string;
  analysisResult?: EvidenceAnalysisResult;
}

export interface ComplianceChecklistItem {
  id: string;
  assessmentId: string;
  ruleId: string;
  requirementCode: string;
  ruleTitle: string;
  regulatorySource: string;
  mandatory: boolean;
  evidenceStatus: ChecklistEvidenceStatus;
  preliminaryResult: PreliminaryCheckResult;
  officerResult: OfficerAssessmentResult;
  reviewStatus: ChecklistItemReviewStatus;
  reviewerNotes: string;
  linkedEvidenceIds: string[];
  assessedAt?: string;
  updatedAt: string;
}

export interface ComplianceFinding {
  id: string;
  assessmentId: string;
  checklistItemId: string;
  evidenceId?: string;
  findingCategory: ComplianceFindingCategory;
  severity: 'CRITICAL' | 'WARNING' | 'NOTICE' | 'VERIFIED';
  sourceType: FindingSourceType;
  explanation: string;
  evidenceReference: string;
  ruleVersion: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'WAIVED_BY_OFFICER';
  assignedOfficer?: string;
  recommendedNextStep: string;
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceRequestResponse {
  submittedAt: string;
  submittedBy: string;
  notes: string;
  evidenceId?: string;
  fileName?: string;
}

export interface EvidenceRequest {
  id: string;
  assessmentId: string;
  checklistItemId: string;
  institutionId: string;
  applicationReference: string;
  requestedBy: string;
  reason: string;
  requestedEvidence: string;
  explanation: string;
  dueDate: string;
  status: EvidenceRequestStatus;
  institutionResponse?: EvidenceRequestResponse;
  officerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InspectionRecommendation {
  id: string;
  assessmentId: string;
  applicationReference: string;
  institutionId: string;
  institutionName: string;
  relatedRequirementId: string;
  relatedFindingId?: string;
  recommendationReason: string;
  supportingEvidence: string;
  status: InspectionRecommendationStatus;
  recommendedBy: string;
  recommendedAt: string;
  assignedOfficer: string;
  decisionNotes?: string;
  decidedBy?: string;
  decidedAt?: string;
  scheduledDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceAuditLog {
  id: string;
  assessmentId: string;
  actorId: string;
  actorName: string;
  eventType: string;
  entityType: string;
  entityId: string;
  reason?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ComplianceAssessment {
  id: string;
  institutionId: string;
  applicationReference: string;
  applicationCategory: 'EOA' | 'CHANGE';
  academicYear: string;
  ruleVersion: string;
  status: 'IN_PROGRESS' | 'DEFICIENCIES_NOTED' | 'EVIDENCE_REQUESTED' | 'INSPECTION_RECOMMENDED' | 'COMPLIANT';
  assignedOfficer: string;
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
  items: ComplianceChecklistItem[];
  evidence: InfrastructureEvidence[];
  findings: ComplianceFinding[];
  evidenceRequests: EvidenceRequest[];
  inspectionRecommendations: InspectionRecommendation[];
  auditLogs: ComplianceAuditLog[];
}

export interface ComplianceDashboardCounts {
  applicationsAssessed: number;
  checklistRequirements: number;
  evidenceSubmitted: number;
  potentialGaps: number;
  additionalEvidenceRequests: number;
  inspectionRecommendationsPending: number;
}
