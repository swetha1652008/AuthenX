export type RuleCategory = 
  | 'CHECKLIST'
  | 'VALIDITY'
  | 'FIELD'
  | 'CONSISTENCY'
  | 'CONDITIONAL';

export type ApplicationCategoryType = 
  | 'ALL'
  | 'EOA'
  | 'NEW_INSTITUTION'
  | 'NEW_PROGRAMME'
  | 'INTAKE_CHANGE'
  | 'NAME_CHANGE';

export type RulePublicationStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'DEACTIVATED'
  | 'SUPERSEDED';

export type RuleSeverity = 'CRITICAL' | 'WARNING' | 'NOTICE';

export type ValidationMethodType = 
  | 'AUTOMATED_OCR'
  | 'API_SOURCE'
  | 'QR_CROSSCHECK'
  | 'OFFICER_MANUAL'
  | 'LOGIC_ENGINE';

export type LogicOperator = 
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'GREATER_THAN_OR_EQUAL'
  | 'LESS_THAN_OR_EQUAL'
  | 'CONTAINS_KEYWORD'
  | 'IS_NOT_EMPTY'
  | 'IS_EMPTY'
  | 'DATE_BEFORE'
  | 'DATE_AFTER'
  | 'DATE_NOT_EXPIRED';

export interface RuleLogicCondition {
  field: string;
  operator: LogicOperator;
  value?: string | number | boolean;
  secondField?: string;
  unit?: string;
}

export interface RegulatoryReferenceInfo {
  sourceTitle: string;
  handbookSection: string;
  aicteClause: string;
  officialUrl?: string;
  publicationYear: string;
  confirmedByAuthority: boolean;
  notes?: string;
}

export interface RuleVersionRecord {
  version: string;
  changedBy: string;
  changedAt: string;
  changeSummary: string;
  oldStatus?: RulePublicationStatus;
  newStatus?: RulePublicationStatus;
}

export interface RegulatoryRuleItem {
  id: string;
  requirementCode: string;
  title: string;
  description: string;
  category: RuleCategory;
  applicationCategory: ApplicationCategoryType;
  documentCategory: string;
  mandatory: boolean;
  validationMethod: ValidationMethodType;
  severity: RuleSeverity;
  regulatoryReference: RegulatoryReferenceInfo;
  conditions: RuleLogicCondition[];
  version: string;
  effectiveFrom: string;
  effectiveTo?: string;
  status: RulePublicationStatus;
  creator: string;
  reviewer?: string;
  publisher?: string;
  reviewerRemarks?: string;
  createdAt: string;
  updatedAt: string;
  history: RuleVersionRecord[];
}

export interface RuleTestCase {
  id: string;
  ruleId: string;
  testCaseName: string;
  inputDescription: string;
  inputPayload: Record<string, unknown>;
  expectedOutcome: 'PASS' | 'FAIL' | 'MANUAL_REVIEW';
  actualOutcome?: 'PASS' | 'FAIL' | 'MANUAL_REVIEW';
  status: 'PASSED' | 'FAILED' | 'PENDING';
  executionNotes?: string;
  executedAt?: string;
}

export interface RuleAuditLogEntry {
  id: string;
  ruleId: string;
  ruleCode: string;
  action: string;
  actor: string;
  role: string;
  timestamp: string;
  details: string;
}

export interface RegulatoryRulesDashboardKPIs {
  totalRules: number;
  publishedRules: number;
  pendingReviewRules: number;
  draftRules: number;
  deactivatedRules: number;
  activeChecklistsCount: number;
}
