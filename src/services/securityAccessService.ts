import type { UserRoleId } from '../types/auth';
import type {
  SecurityUserAccount,
  RolePermissionMapping,
  SecurityAccessPolicy,
  SecurityAuditLog,
  DataRetentionPolicy,
  AccessReviewQueueItem,
  SecurityOverviewKPIs,
  SecurityModuleKey,
  SecurityActionKey,
  AccountStatus,
} from '../types/securityAccess';

const STORAGE_USERS = 'authenx_security_users_v1';
const STORAGE_PERMISSIONS = 'authenx_security_permissions_v1';
const STORAGE_POLICIES = 'authenx_security_policies_v1';
const STORAGE_AUDIT = 'authenx_security_audit_logs_v1';
const STORAGE_RETENTION = 'authenx_security_retention_v1';
const STORAGE_REVIEWS = 'authenx_security_access_reviews_v1';

export const INITIAL_SECURITY_USERS: SecurityUserAccount[] = [
  {
    id: 'usr_sec_001',
    name: 'Dr. Ramesh Babu',
    email: 'ramesh.babu@aicte-india.org',
    department: 'Regulatory Compliance & Scrutiny Directorate',
    organization: 'All India Council for Technical Education (AICTE HQ)',
    assignedRole: 'REGULATORY_ADMIN',
    accountStatus: 'ACTIVE',
    mfaStatus: 'ENABLED',
    lastLogin: '2026-10-28 15:42 IST',
    createdAt: '2025-01-15',
    failedLoginCount: 0,
    activeSessionCount: 1,
  },
  {
    id: 'usr_sec_002',
    name: 'Smt. Priya Sharma',
    email: 'priya.sharma@aicte-india.org',
    department: 'Regional Scrutiny Committee 3',
    organization: 'AICTE South-Western Regional Office',
    assignedRole: 'COMPLIANCE_OFFICER',
    accountStatus: 'ACTIVE',
    mfaStatus: 'ENABLED',
    lastLogin: '2026-10-28 17:15 IST',
    createdAt: '2025-03-20',
    failedLoginCount: 0,
    activeSessionCount: 2,
  },
  {
    id: 'usr_sec_003',
    name: 'Shri Vikram Malhotra',
    email: 'vikram.malhotra@nic.in',
    department: 'Issuing Authority Verification Cell',
    organization: 'National Informatics Centre (NIC / BBMP Node)',
    assignedRole: 'DOCUMENT_VERIFICATION_OFFICER',
    accountStatus: 'ACTIVE',
    mfaStatus: 'ENABLED',
    lastLogin: '2026-10-28 12:08 IST',
    createdAt: '2025-06-10',
    failedLoginCount: 1,
    activeSessionCount: 1,
  },
  {
    id: 'usr_sec_004',
    name: 'Dr. Arunachalam M.',
    email: 'principal@apextech.edu',
    department: 'Office of the Principal',
    organization: 'Apex Institute of Technology & Science (1-938210941)',
    assignedRole: 'INSTITUTION_ADMIN',
    accountStatus: 'ACTIVE',
    mfaStatus: 'ENABLED',
    lastLogin: '2026-10-27 18:30 IST',
    createdAt: '2025-09-01',
    failedLoginCount: 0,
    activeSessionCount: 1,
  },
  {
    id: 'usr_sec_005',
    name: 'Shri Rajesh Kannan',
    email: 'secops.kannan@aicte.gov.in',
    department: 'Cybersecurity & Infrastructure Governance',
    organization: 'AICTE Cloud Security Operations Center',
    assignedRole: 'REGULATORY_ADMIN',
    accountStatus: 'ACTIVE',
    mfaStatus: 'ENABLED',
    lastLogin: '2026-10-28 16:50 IST',
    createdAt: '2025-02-01',
    failedLoginCount: 0,
    activeSessionCount: 3,
  },
  {
    id: 'usr_sec_006',
    name: 'Prof. Hemant K. Joshi',
    email: 'h.joshi@somaiya-test.edu',
    department: 'Engineering Registrar Office',
    organization: 'Somaiya Tech Academy (Inactive Sandbox)',
    assignedRole: 'INSTITUTION_ADMIN',
    accountStatus: 'SUSPENDED',
    mfaStatus: 'DISABLED',
    lastLogin: '2026-08-14 09:12 IST',
    createdAt: '2025-11-20',
    failedLoginCount: 4,
    activeSessionCount: 0,
  },
];

export const DEFAULT_ROLE_PERMISSIONS: RolePermissionMapping = {
  REGULATORY_ADMIN: {
    APPLICATION_MANAGEMENT: ['VIEW', 'CREATE', 'EDIT', 'REVIEW', 'APPROVE', 'EXPORT', 'ADMINISTER'],
    DOCUMENT_VAULT: ['VIEW', 'CREATE', 'EDIT', 'REVIEW', 'APPROVE', 'EXPORT', 'ADMINISTER'],
    AI_VALIDATION: ['VIEW', 'CREATE', 'EDIT', 'REVIEW', 'APPROVE', 'EXPORT', 'ADMINISTER'],
    HUMAN_REVIEW: ['VIEW', 'CREATE', 'EDIT', 'REVIEW', 'APPROVE', 'EXPORT', 'ADMINISTER'],
    REGULATORY_RULES: ['VIEW', 'CREATE', 'EDIT', 'REVIEW', 'APPROVE', 'EXPORT', 'ADMINISTER'],
    SECURITY_ADMIN: ['VIEW', 'CREATE', 'EDIT', 'REVIEW', 'APPROVE', 'EXPORT', 'ADMINISTER'],
  },
  COMPLIANCE_OFFICER: {
    APPLICATION_MANAGEMENT: ['VIEW', 'REVIEW', 'EXPORT'],
    DOCUMENT_VAULT: ['VIEW', 'REVIEW', 'EXPORT'],
    AI_VALIDATION: ['VIEW', 'REVIEW', 'EXPORT'],
    HUMAN_REVIEW: ['VIEW', 'CREATE', 'EDIT', 'REVIEW', 'APPROVE', 'EXPORT'],
    REGULATORY_RULES: ['VIEW', 'REVIEW', 'EXPORT'],
    SECURITY_ADMIN: ['VIEW'],
  },
  DOCUMENT_VERIFICATION_OFFICER: {
    APPLICATION_MANAGEMENT: ['VIEW', 'REVIEW'],
    DOCUMENT_VAULT: ['VIEW', 'CREATE', 'EDIT', 'REVIEW', 'EXPORT'],
    AI_VALIDATION: ['VIEW', 'REVIEW'],
    HUMAN_REVIEW: ['VIEW', 'REVIEW'],
    REGULATORY_RULES: ['VIEW'],
    SECURITY_ADMIN: ['VIEW'],
  },
  INSTITUTION_ADMIN: {
    APPLICATION_MANAGEMENT: ['VIEW', 'CREATE', 'EDIT', 'EXPORT'],
    DOCUMENT_VAULT: ['VIEW', 'CREATE', 'EDIT', 'EXPORT'],
    AI_VALIDATION: ['VIEW'],
    HUMAN_REVIEW: ['VIEW', 'EDIT'],
    REGULATORY_RULES: ['VIEW'],
    SECURITY_ADMIN: [],
  },
};

export const INITIAL_ACCESS_POLICIES: SecurityAccessPolicy[] = [
  {
    id: 'pol_pwd_01',
    name: 'Minimum Password Complexity & Length',
    category: 'PASSWORD',
    description: 'Requires minimum 12 characters, uppercase, lowercase, numbers, and statutory symbol characters.',
    currentValue: 12,
    defaultValue: 12,
    unit: 'characters',
    securityImpact: 'HIGH',
    lastModifiedBy: 'Shri Rajesh Kannan (SecOps)',
    lastModifiedAt: '2026-04-01',
    status: 'ENFORCED',
  },
  {
    id: 'pol_lock_02',
    name: 'Account Lockout Threshold After Consecutive Failures',
    category: 'LOCKOUT',
    description: 'Locks user account after 5 consecutive failed authentication attempts within 15 minutes.',
    currentValue: 5,
    defaultValue: 5,
    unit: 'attempts',
    securityImpact: 'HIGH',
    lastModifiedBy: 'Shri Rajesh Kannan (SecOps)',
    lastModifiedAt: '2026-04-01',
    status: 'ENFORCED',
  },
  {
    id: 'pol_sess_03',
    name: 'Session Idle Inactivity Timeout',
    category: 'SESSION',
    description: 'Automatically expires portal session after 20 minutes of inactivity.',
    currentValue: 20,
    defaultValue: 30,
    unit: 'minutes',
    securityImpact: 'MEDIUM',
    lastModifiedBy: 'Dr. Ramesh Babu',
    lastModifiedAt: '2026-04-10',
    status: 'ENFORCED',
  },
  {
    id: 'pol_mfa_04',
    name: 'Enforce Mandatory Multi-Factor Authentication (MFA)',
    category: 'MFA',
    description: 'Mandates Time-based One-Time Password (TOTP) or hardware token for all scrutiny officers and administrators.',
    currentValue: true,
    defaultValue: true,
    securityImpact: 'HIGH',
    lastModifiedBy: 'Shri Rajesh Kannan (SecOps)',
    lastModifiedAt: '2026-04-01',
    status: 'ENFORCED',
  },
  {
    id: 'pol_sess_05',
    name: 'Maximum Concurrent Active Sessions Per Identity',
    category: 'SESSION',
    description: 'Limits simultaneous active browser sessions to prevent token sharing.',
    currentValue: 2,
    defaultValue: 2,
    unit: 'concurrent sessions',
    securityImpact: 'MEDIUM',
    lastModifiedBy: 'Shri Rajesh Kannan (SecOps)',
    lastModifiedAt: '2026-04-01',
    status: 'ENFORCED',
  },
];

export const INITIAL_DATA_RETENTION_POLICIES: DataRetentionPolicy[] = [
  {
    id: 'ret_doc_01',
    dataCategory: 'UPLOADED_DOCUMENTS',
    purpose: 'Statutory approval certificates, land deeds, and municipal architectural blueprints.',
    retentionDurationDays: 2555, // 7 years
    startingEvent: 'Formal Decision or EoA Expiration',
    legalReference: 'Public Records Act 1993 & AICTE Regulations 2020 Sec 14',
    policyOwner: 'AICTE Legal Directorate',
    approvalStatus: 'ACTIVE',
    legalHoldActive: true,
    eligibleRecordCount: 0,
    disposalMethod: 'CRYPTOGRAPHIC_SHRED',
    lastReviewedAt: '2026-04-01',
    nextReviewAt: '2027-03-31',
  },
  {
    id: 'ret_ocr_02',
    dataCategory: 'OCR_TEMP_FILES',
    purpose: 'Temporary rasterized PDF pages, bounding box coordinates, and raw OCR tokens.',
    retentionDurationDays: 30,
    startingEvent: 'AI Validation Pipeline Completion',
    legalReference: 'Digital Personal Data Protection Act (DPDP 2023) Storage Limitation',
    policyOwner: 'AuthenX AI Engineering Team',
    approvalStatus: 'ACTIVE',
    legalHoldActive: false,
    eligibleRecordCount: 42,
    disposalMethod: 'SECURE_OVERWRITE',
    lastReviewedAt: '2026-04-15',
    nextReviewAt: '2026-07-15',
  },
  {
    id: 'ret_audit_03',
    dataCategory: 'AUDIT_LOGS',
    purpose: 'Tamper-evident chronological logs of authentication, scrutiny determinations, and rule changes.',
    retentionDurationDays: 3650, // 10 years
    startingEvent: 'Timestamp of Audit Log Generation',
    legalReference: 'CERT-In Cyber Incident Directions 2022 & IT Act Sec 67C',
    policyOwner: 'Chief Information Security Officer (CISO)',
    approvalStatus: 'ACTIVE',
    legalHoldActive: true,
    eligibleRecordCount: 0,
    disposalMethod: 'ARCHIVE_COLD_STORAGE',
    lastReviewedAt: '2026-04-01',
    nextReviewAt: '2027-03-31',
  },
  {
    id: 'ret_reports_04',
    dataCategory: 'REPORTS',
    purpose: 'Generated CSV/PDF exports of institutional scrutiny findings.',
    retentionDurationDays: 1825, // 5 years
    startingEvent: 'Report Export Generation Date',
    legalReference: 'AICTE Administrative Records Schedule',
    policyOwner: 'Regional Scrutiny Committee',
    approvalStatus: 'ACTIVE',
    legalHoldActive: false,
    eligibleRecordCount: 18,
    disposalMethod: 'SECURE_OVERWRITE',
    lastReviewedAt: '2026-04-10',
    nextReviewAt: '2026-10-10',
  },
];

export const INITIAL_ACCESS_REVIEWS: AccessReviewQueueItem[] = [
  {
    id: 'rev_acc_001',
    accountId: 'usr_sec_002',
    accountName: 'Smt. Priya Sharma',
    currentRole: 'COMPLIANCE_OFFICER',
    reviewer: 'Dr. Ramesh Babu (Regulatory Director)',
    dueDate: '2026-11-15',
    status: 'PENDING',
    findings: 'Annual scrutiny committee privilege re-certification. No conflicting roles detected.',
  },
  {
    id: 'rev_acc_002',
    accountId: 'usr_sec_006',
    accountName: 'Prof. Hemant K. Joshi',
    currentRole: 'INSTITUTION_ADMIN',
    reviewer: 'Shri Rajesh Kannan (SecOps)',
    dueDate: '2026-10-30',
    status: 'CHANGES_REQUIRED',
    findings: 'Account suspended due to 4 failed login attempts and dormant institution status. Revocation recommended.',
  },
];

export const INITIAL_SECURITY_AUDIT_LOGS: SecurityAuditLog[] = [
  {
    id: 'sec_log_001',
    timestamp: '2026-10-28 17:15:22 IST',
    actor: 'Smt. Priya Sharma',
    actorRole: 'COMPLIANCE_OFFICER',
    action: 'USER_LOGIN_SUCCESS',
    targetResource: 'AUTH_SESSION_JWT_8941',
    module: 'AUTH_GATEWAY',
    outcome: 'SUCCESS',
    sourceIp: '14.139.155.22 (AICTE SWRO Subnet)',
    reason: 'TOTP MFA verification succeeded.',
    correlationId: 'req_auth_91041',
  },
  {
    id: 'sec_log_002',
    timestamp: '2026-10-28 16:50:11 IST',
    actor: 'Shri Rajesh Kannan',
    actorRole: 'REGULATORY_ADMIN',
    action: 'POLICY_MODIFIED',
    targetResource: 'pol_sess_03 (Idle Timeout)',
    module: 'SECURITY_ADMIN',
    outcome: 'SUCCESS',
    sourceIp: '10.24.8.100 (Internal SecOps VPN)',
    reason: 'Adjusted session idle timeout from 30m to 20m per CISO directive.',
    correlationId: 'req_pol_10928',
  },
  {
    id: 'sec_log_003',
    timestamp: '2026-10-28 12:08:45 IST',
    actor: 'Shri Vikram Malhotra',
    actorRole: 'DOCUMENT_VERIFICATION_OFFICER',
    action: 'USER_LOGIN_SUCCESS',
    targetResource: 'AUTH_SESSION_JWT_8930',
    module: 'AUTH_GATEWAY',
    outcome: 'SUCCESS',
    sourceIp: '164.100.58.4 (NIC Bengaluru Gateway)',
    reason: 'FIDO2 WebAuthn token verified.',
    correlationId: 'req_auth_88291',
  },
  {
    id: 'sec_log_004',
    timestamp: '2026-10-28 09:44:12 IST',
    actor: 'Unknown Applicant',
    actorRole: 'SYSTEM_PROCESS',
    action: 'FAILED_AUTHENTICATION_ATTEMPT',
    targetResource: 'USER_IDENTITY_h.joshi@somaiya-test.edu',
    module: 'AUTH_GATEWAY',
    outcome: 'FAILURE',
    sourceIp: '49.207.180.12 (Public WAN)',
    reason: 'Invalid credential hash provided; lockout counter incremented.',
    correlationId: 'req_auth_87201',
  },
  {
    id: 'sec_log_005',
    timestamp: '2026-10-27 18:30:05 IST',
    actor: 'Dr. Arunachalam M.',
    actorRole: 'INSTITUTION_ADMIN',
    action: 'USER_LOGIN_SUCCESS',
    targetResource: 'AUTH_SESSION_JWT_8711',
    module: 'AUTH_GATEWAY',
    outcome: 'SUCCESS',
    sourceIp: '115.112.44.88 (Apex Tech Campus LAN)',
    reason: 'Authorized institution admin login.',
    correlationId: 'req_auth_76211',
  },
];

export const securityAccessService = {
  getUsers(): SecurityUserAccount[] {
    try {
      const stored = localStorage.getItem(STORAGE_USERS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    localStorage.setItem(STORAGE_USERS, JSON.stringify(INITIAL_SECURITY_USERS));
    return INITIAL_SECURITY_USERS;
  },

  getUserById(id: string): SecurityUserAccount | undefined {
    return this.getUsers().find((u) => u.id === id);
  },

  getSecurityKPIs(): SecurityOverviewKPIs {
    const users = this.getUsers();
    const logs = this.getAuditLogs();
    const reviews = this.getAccessReviews();
    const retentions = this.getRetentionPolicies();

    return {
      totalRegisteredUsers: users.length,
      activeAccounts: users.filter((u) => u.accountStatus === 'ACTIVE').length,
      suspendedAccounts: users.filter((u) => u.accountStatus === 'SUSPENDED' || u.accountStatus === 'LOCKED').length,
      configuredRolesCount: 4,
      failedLoginAttempts: logs.filter((l) => l.action.includes('FAILED')).length,
      auditEventsCount: logs.length,
      pendingAccessReviews: reviews.filter((r) => r.status === 'PENDING' || r.status === 'CHANGES_REQUIRED').length,
      retentionPoliciesOnHold: retentions.filter((r) => r.legalHoldActive).length,
    };
  },

  updateUserStatus(id: string, status: AccountStatus, reason: string, actor = 'Security Admin'): boolean {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx < 0) return false;

    // Protection check: Never allow suspending the last active Regulatory/Security Admin
    if (status !== 'ACTIVE' && users[idx].assignedRole === 'REGULATORY_ADMIN') {
      const activeAdmins = users.filter((u) => u.assignedRole === 'REGULATORY_ADMIN' && u.accountStatus === 'ACTIVE');
      if (activeAdmins.length <= 1) {
        alert('Action Blocked: Cannot suspend the last remaining active Regulatory Administrator.');
        return false;
      }
    }

    users[idx].accountStatus = status;
    if (status === 'ACTIVE') users[idx].failedLoginCount = 0;
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));

    this.addAuditLog(
      actor,
      'REGULATORY_ADMIN',
      `ACCOUNT_STATUS_${status}`,
      `User ${users[idx].email}`,
      'SECURITY_ADMIN',
      'SUCCESS',
      reason
    );
    return true;
  },

  updateUserRole(id: string, newRole: UserRoleId, reason: string, actor = 'Security Admin'): boolean {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx < 0) return false;

    // Protection check
    if (users[idx].assignedRole === 'REGULATORY_ADMIN' && newRole !== 'REGULATORY_ADMIN') {
      const activeAdmins = users.filter((u) => u.assignedRole === 'REGULATORY_ADMIN' && u.accountStatus === 'ACTIVE');
      if (activeAdmins.length <= 1) {
        alert('Action Blocked: Cannot demote the sole remaining active Regulatory Administrator.');
        return false;
      }
    }

    const oldRole = users[idx].assignedRole;
    users[idx].assignedRole = newRole;
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));

    this.addAuditLog(
      actor,
      'REGULATORY_ADMIN',
      'USER_ROLE_REASSIGNED',
      `User ${users[idx].email} (${oldRole} -> ${newRole})`,
      'SECURITY_ADMIN',
      'SUCCESS',
      reason
    );
    return true;
  },

  resetUserPassword(id: string, actor = 'Security Admin'): string {
    const user = this.getUserById(id);
    const tempToken = `TMP-AUTHENX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    this.addAuditLog(
      actor,
      'REGULATORY_ADMIN',
      'PASSWORD_RESET_INITIATED',
      `User ${user?.email || id}`,
      'SECURITY_ADMIN',
      'SUCCESS',
      'Secure password reset token generated. Dispatched via institutional communication channel.'
    );
    return tempToken;
  },

  revokeUserSessions(id: string, actor = 'Security Admin'): boolean {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx < 0) return false;

    users[idx].activeSessionCount = 0;
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));

    this.addAuditLog(
      actor,
      'REGULATORY_ADMIN',
      'SESSIONS_REVOKED',
      `User ${users[idx].email}`,
      'SECURITY_ADMIN',
      'SUCCESS',
      'Invalidated all active JWT refresh tokens server-side.'
    );
    return true;
  },

  getRolePermissions(): RolePermissionMapping {
    try {
      const stored = localStorage.getItem(STORAGE_PERMISSIONS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    localStorage.setItem(STORAGE_PERMISSIONS, JSON.stringify(DEFAULT_ROLE_PERMISSIONS));
    return DEFAULT_ROLE_PERMISSIONS;
  },

  updateRolePermissions(
    role: UserRoleId,
    module: SecurityModuleKey,
    actions: SecurityActionKey[],
    actor = 'Security Admin'
  ): void {
    const mapping = this.getRolePermissions();
    if (!mapping[role]) mapping[role] = {} as Record<SecurityModuleKey, SecurityActionKey[]>;
    mapping[role][module] = actions;
    localStorage.setItem(STORAGE_PERMISSIONS, JSON.stringify(mapping));

    this.addAuditLog(
      actor,
      'REGULATORY_ADMIN',
      'ROLE_PERMISSIONS_UPDATED',
      `Role ${role} on ${module}`,
      'SECURITY_ADMIN',
      'SUCCESS',
      `Updated permissions: [${actions.join(', ')}]`
    );
  },

  getAccessPolicies(): SecurityAccessPolicy[] {
    try {
      const stored = localStorage.getItem(STORAGE_POLICIES);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    localStorage.setItem(STORAGE_POLICIES, JSON.stringify(INITIAL_ACCESS_POLICIES));
    return INITIAL_ACCESS_POLICIES;
  },

  updateAccessPolicy(
    id: string,
    value: string | number | boolean,
    actor = 'Security Admin'
  ): void {
    const policies = this.getAccessPolicies();
    const idx = policies.findIndex((p) => p.id === id);
    if (idx < 0) return;

    const oldVal = policies[idx].currentValue;
    policies[idx].currentValue = value;
    policies[idx].lastModifiedBy = actor;
    policies[idx].lastModifiedAt = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_POLICIES, JSON.stringify(policies));

    this.addAuditLog(
      actor,
      'REGULATORY_ADMIN',
      'POLICY_MODIFIED',
      policies[idx].name,
      'SECURITY_ADMIN',
      'SUCCESS',
      `Value changed from ${oldVal} to ${value}`
    );
  },

  getAuditLogs(): SecurityAuditLog[] {
    try {
      const stored = localStorage.getItem(STORAGE_AUDIT);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    localStorage.setItem(STORAGE_AUDIT, JSON.stringify(INITIAL_SECURITY_AUDIT_LOGS));
    return INITIAL_SECURITY_AUDIT_LOGS;
  },

  addAuditLog(
    actor: string,
    actorRole: UserRoleId,
    action: string,
    targetResource: string,
    module: SecurityModuleKey | 'AUTH_GATEWAY',
    outcome: 'SUCCESS' | 'FAILURE' | 'BLOCKED',
    reason?: string
  ) {
    const logs = this.getAuditLogs();
    const newLog: SecurityAuditLog = {
      id: `sec_log_${Date.now()}`,
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString('en-US', { hour12: false })} IST`,
      actor,
      actorRole,
      action,
      targetResource,
      module,
      outcome,
      sourceIp: '10.24.8.100 (Internal SecOps Session)',
      reason,
      correlationId: `req_sec_${Math.floor(10000 + Math.random() * 90000)}`,
    };
    logs.unshift(newLog);
    localStorage.setItem(STORAGE_AUDIT, JSON.stringify(logs));
  },

  getRetentionPolicies(): DataRetentionPolicy[] {
    try {
      const stored = localStorage.getItem(STORAGE_RETENTION);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    localStorage.setItem(STORAGE_RETENTION, JSON.stringify(INITIAL_DATA_RETENTION_POLICIES));
    return INITIAL_DATA_RETENTION_POLICIES;
  },

  toggleLegalHold(policyId: string, active: boolean, actor = 'Security Admin'): void {
    const policies = this.getRetentionPolicies();
    const idx = policies.findIndex((p) => p.id === policyId);
    if (idx < 0) return;

    policies[idx].legalHoldActive = active;
    localStorage.setItem(STORAGE_RETENTION, JSON.stringify(policies));

    this.addAuditLog(
      actor,
      'REGULATORY_ADMIN',
      active ? 'LEGAL_HOLD_APPLIED' : 'LEGAL_HOLD_RELEASED',
      policies[idx].dataCategory,
      'SECURITY_ADMIN',
      'SUCCESS',
      active ? 'Statutory freeze applied on data category.' : 'Statutory freeze released.'
    );
  },

  simulateDisposal(policyId: string, actor = 'Security Admin'): { purgedCount: number; message: string } {
    const policies = this.getRetentionPolicies();
    const p = policies.find((item) => item.id === policyId);
    if (!p) return { purgedCount: 0, message: 'Policy not found.' };

    if (p.legalHoldActive) {
      this.addAuditLog(
        actor,
        'REGULATORY_ADMIN',
        'DISPOSAL_BLOCKED',
        p.dataCategory,
        'SECURITY_ADMIN',
        'BLOCKED',
        'Disposal attempt refused due to active statutory Legal Hold.'
      );
      return {
        purgedCount: 0,
        message: 'Action Blocked: Active Statutory Legal Hold prevents disposal on this category.',
      };
    }

    const count = p.eligibleRecordCount;
    p.eligibleRecordCount = 0;
    localStorage.setItem(STORAGE_RETENTION, JSON.stringify(policies));

    this.addAuditLog(
      actor,
      'REGULATORY_ADMIN',
      'DATA_DISPOSAL_EXECUTED',
      p.dataCategory,
      'SECURITY_ADMIN',
      'SUCCESS',
      `Purged ${count} expired records via ${p.disposalMethod}.`
    );

    return {
      purgedCount: count,
      message: `Successfully executed ${p.disposalMethod} on ${count} eligible records.`,
    };
  },

  getAccessReviews(): AccessReviewQueueItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_REVIEWS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    localStorage.setItem(STORAGE_REVIEWS, JSON.stringify(INITIAL_ACCESS_REVIEWS));
    return INITIAL_ACCESS_REVIEWS;
  },

  updateAccessReview(
    id: string,
    status: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUIRED',
    remarks: string,
    actor = 'Security Director'
  ): void {
    const reviews = this.getAccessReviews();
    const idx = reviews.findIndex((r) => r.id === id);
    if (idx < 0) return;

    reviews[idx].status = status;
    reviews[idx].remarks = remarks;
    reviews[idx].completedAt = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_REVIEWS, JSON.stringify(reviews));

    this.addAuditLog(
      actor,
      'REGULATORY_ADMIN',
      `ACCESS_REVIEW_${status}`,
      `Review for ${reviews[idx].accountName}`,
      'SECURITY_ADMIN',
      'SUCCESS',
      remarks
    );
  },

  exportSecurityReport(reportType: 'USERS' | 'AUDIT' | 'RETENTION'): string {
    const sanitize = (val: unknown): string => {
      let str = String(val ?? '');
      if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
        str = "'" + str;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    if (reportType === 'USERS') {
      const users = this.getUsers();
      const headers = ['UserID', 'Name', 'Email', 'Organization', 'Role', 'Status', 'MFA', 'LastLogin'];
      const rows = users.map((u) => [
        sanitize(u.id),
        sanitize(u.name),
        sanitize(u.email),
        sanitize(u.organization),
        sanitize(u.assignedRole),
        sanitize(u.accountStatus),
        sanitize(u.mfaStatus),
        sanitize(u.lastLogin),
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    }

    if (reportType === 'AUDIT') {
      const logs = this.getAuditLogs();
      const headers = ['EventID', 'Timestamp', 'Actor', 'Role', 'Action', 'TargetResource', 'Module', 'Outcome', 'SourceIp', 'Reason'];
      const rows = logs.map((l) => [
        sanitize(l.id),
        sanitize(l.timestamp),
        sanitize(l.actor),
        sanitize(l.actorRole),
        sanitize(l.action),
        sanitize(l.targetResource),
        sanitize(l.module),
        sanitize(l.outcome),
        sanitize(l.sourceIp),
        sanitize(l.reason || 'N/A'),
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    }

    // RETENTION
    const ret = this.getRetentionPolicies();
    const headers = ['PolicyID', 'Category', 'RetentionDays', 'StartingEvent', 'LegalReference', 'Owner', 'LegalHold', 'EligibleRecords'];
    const rows = ret.map((p) => [
      sanitize(p.id),
      sanitize(p.dataCategory),
      sanitize(p.retentionDurationDays),
      sanitize(p.startingEvent),
      sanitize(p.legalReference),
      sanitize(p.policyOwner),
      sanitize(p.legalHoldActive ? 'YES' : 'NO'),
      sanitize(p.eligibleRecordCount),
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  },
};
