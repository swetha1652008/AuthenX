import type { UserRoleId } from './auth';

export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'LOCKED' | 'PENDING_ACTIVATION';
export type MfaStatus = 'ENABLED' | 'DISABLED' | 'NOT_CONFIGURED';

export interface SecurityUserAccount {
  id: string;
  name: string;
  email: string;
  department: string;
  organization: string;
  assignedRole: UserRoleId;
  accountStatus: AccountStatus;
  mfaStatus: MfaStatus;
  lastLogin: string;
  createdAt: string;
  failedLoginCount: number;
  activeSessionCount: number;
}

export type SecurityModuleKey = 
  | 'APPLICATION_MANAGEMENT'
  | 'DOCUMENT_VAULT'
  | 'AI_VALIDATION'
  | 'HUMAN_REVIEW'
  | 'REGULATORY_RULES'
  | 'SECURITY_ADMIN';

export type SecurityActionKey = 
  | 'VIEW'
  | 'CREATE'
  | 'EDIT'
  | 'REVIEW'
  | 'APPROVE'
  | 'EXPORT'
  | 'ADMINISTER';

export type RolePermissionMapping = Record<UserRoleId, Record<SecurityModuleKey, SecurityActionKey[]>>;

export interface SecurityAccessPolicy {
  id: string;
  name: string;
  category: 'PASSWORD' | 'SESSION' | 'LOCKOUT' | 'MFA' | 'IP';
  description: string;
  currentValue: string | number | boolean;
  defaultValue: string | number | boolean;
  unit?: string;
  securityImpact: 'HIGH' | 'MEDIUM' | 'LOW';
  lastModifiedBy: string;
  lastModifiedAt: string;
  status: 'ENFORCED' | 'AUDIT_ONLY' | 'DISABLED';
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRoleId | 'SYSTEM_PROCESS';
  action: string;
  targetResource: string;
  module: SecurityModuleKey | 'AUTH_GATEWAY';
  outcome: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  sourceIp: string;
  reason?: string;
  correlationId: string;
}

export interface DataRetentionPolicy {
  id: string;
  dataCategory: 
    | 'UPLOADED_DOCUMENTS'
    | 'OCR_TEMP_FILES'
    | 'APPLICATION_DATA'
    | 'AI_VALIDATION_CACHE'
    | 'AUDIT_LOGS'
    | 'REPORTS';
  purpose: string;
  retentionDurationDays: number;
  startingEvent: string;
  legalReference: string;
  policyOwner: string;
  approvalStatus: 'ACTIVE' | 'DRAFT' | 'REVIEW_REQUIRED';
  legalHoldActive: boolean;
  eligibleRecordCount: number;
  disposalMethod: 'SECURE_OVERWRITE' | 'CRYPTOGRAPHIC_SHRED' | 'ARCHIVE_COLD_STORAGE';
  lastReviewedAt: string;
  nextReviewAt: string;
}

export interface AccessReviewQueueItem {
  id: string;
  accountId: string;
  accountName: string;
  currentRole: UserRoleId;
  reviewer: string;
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'CHANGES_REQUIRED' | 'APPROVED' | 'REJECTED';
  findings: string;
  remarks?: string;
  completedAt?: string;
}

export interface SecurityOverviewKPIs {
  totalRegisteredUsers: number;
  activeAccounts: number;
  suspendedAccounts: number;
  configuredRolesCount: number;
  failedLoginAttempts: number;
  auditEventsCount: number;
  pendingAccessReviews: number;
  retentionPoliciesOnHold: number;
}
