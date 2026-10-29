import type { UserAccount, UserRoleId } from '../types/auth';

export interface LoginResult {
  success: boolean;
  user?: UserAccount;
  token?: string;
  error?: string;
  errorType?: 'INVALID_CREDENTIALS' | 'ROLE_MISMATCH' | 'SESSION_EXPIRED';
}

// System Role Metadata
export const SYSTEM_ROLES: {
  id: UserRoleId;
  title: string;
  description: string;
  badge: string;
}[] = [
  {
    id: 'INSTITUTION_ADMIN',
    title: 'Institution Administrator',
    description: 'Submit applications, upload documents and track compliance.',
    badge: 'College / Trust',
  },
  {
    id: 'COMPLIANCE_OFFICER',
    title: 'Compliance Officer',
    description: 'Review compliance requirements, deficiencies and evidence.',
    badge: 'AICTE Scrutiny',
  },
  {
    id: 'DOCUMENT_VERIFICATION_OFFICER',
    title: 'Document Verification Officer',
    description: 'Review document authenticity checks and verification results.',
    badge: 'Technical Evaluator',
  },
  {
    id: 'REGULATORY_ADMIN',
    title: 'Regulatory Administrator',
    description: 'Manage regulatory rules, workflows and audit records.',
    badge: 'AICTE Council HQ',
  },
];

// Server-side registered user accounts (Database simulation)
const MOCK_USER_DATABASE: (UserAccount & { passwordHash: string })[] = [
  {
    id: 'usr_inst_001',
    name: 'Dr. Arunachalam M.',
    email: 'dr.arun@apextech.edu',
    passwordHash: 'Apex@2026!',
    authorizedRole: 'INSTITUTION_ADMIN',
    designation: 'Principal & Authorized Representative',
    organization: 'Apex Institute of Technology & Science, Bangalore (PID: 1-938210941)',
    institutionId: '1-938210941',
    aictePermanentId: '1-938210941',
    lastLogin: '2026-10-27 18:30 IST',
  },
  {
    id: 'usr_inst_005',
    name: 'Dr. Meera N. Rao',
    email: 'principal@niear.edu.in',
    passwordHash: 'Niear@2026!',
    authorizedRole: 'INSTITUTION_ADMIN',
    designation: 'Principal & Institutional Executive',
    organization: 'National Institute of Engineering & Advanced Research, Mysuru (PID: 1-482019382)',
    institutionId: '1-482019382',
    aictePermanentId: '1-482019382',
    lastLogin: '2026-10-28 08:00 IST',
  },
  {
    id: 'usr_comp_002',
    name: 'Smt. Priya Sharma',
    email: 'priya.sharma@aicte.gov.in',
    passwordHash: 'Aicte#Verify26',
    authorizedRole: 'COMPLIANCE_OFFICER',
    designation: 'Senior Scrutiny Officer (APH EoA Scrutiny)',
    organization: 'AICTE South-Western Regional Office',
    lastLogin: '2026-10-28 09:15 IST',
  },
  {
    id: 'usr_doc_003',
    name: 'Shri Vikram Nair',
    email: 'vikram.nair@aicte.gov.in',
    passwordHash: 'DocAuth*2026',
    authorizedRole: 'DOCUMENT_VERIFICATION_OFFICER',
    designation: 'Lead Technical Document Evaluator',
    organization: 'AICTE Digital Document Authentication Cell',
    lastLogin: '2026-10-28 10:45 IST',
  },
  {
    id: 'usr_reg_004',
    name: 'Dr. Rajesh Verma',
    email: 'rajesh.verma@aicte.gov.in',
    passwordHash: 'SuperReg!2026',
    authorizedRole: 'REGULATORY_ADMIN',
    designation: 'Joint Director (Approvals & Policy Formulation)',
    organization: 'AICTE Headquarters, New Delhi',
    lastLogin: '2026-10-28 08:30 IST',
  },
];

const SESSION_TOKEN_KEY = 'authenx_session_token';
const ACTIVE_USER_KEY = 'authenx_active_user';

const memorySessionStore: Record<string, string> = {};

function getSessionItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem(key);
    }
  } catch {
    // fallback
  }
  return memorySessionStore[key] || null;
}

function setSessionItem(key: string, val: string): void {
  try {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(key, val);
      return;
    }
  } catch {
    // fallback
  }
  memorySessionStore[key] = val;
}

function removeSessionItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(key);
      return;
    }
  } catch {
    // fallback
  }
  delete memorySessionStore[key];
}

export const authService = {
  /**
   * Authenticates user against mock database and validates requested role context
   * against the server-retrieved authorized role.
   */
  async login(
    email: string,
    password: string,
    requestedRole: UserRoleId
  ): Promise<LoginResult> {
    // Simulate real network/server roundtrip
    await new Promise((resolve) => setTimeout(resolve, 800));

    const normalizedEmail = email.trim().toLowerCase();
    const userRecord = MOCK_USER_DATABASE.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    // Step 1: Verify credentials
    if (!userRecord || userRecord.passwordHash !== password) {
      return {
        success: false,
        errorType: 'INVALID_CREDENTIALS',
        error:
          'Invalid official email address or password. Please verify your credentials or check your input.',
      };
    }

    // Step 2: Strict Server-side Role Authorization Check
    // Critical Security Requirement:
    // Selecting a role card must NEVER grant permissions.
    // The backend retrieves the user's actual authorized role and verifies match.
    if (userRecord.authorizedRole !== requestedRole) {
      const authorizedMeta = SYSTEM_ROLES.find(
        (r) => r.id === userRecord.authorizedRole
      );
      const requestedMeta = SYSTEM_ROLES.find((r) => r.id === requestedRole);

      return {
        success: false,
        errorType: 'ROLE_MISMATCH',
        error: `Authorization Role Mismatch: Your account is authorized as [${
          authorizedMeta?.title || userRecord.authorizedRole
        }], but you requested access as [${
          requestedMeta?.title || requestedRole
        }]. Please select your authorized role or contact your system administrator.`,
      };
    }

    // Step 3: Success — Generate session token
    const token = `authenx_jwt_${userRecord.id}_${Date.now()}`;
    const user: UserAccount = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      authorizedRole: userRecord.authorizedRole,
      designation: userRecord.designation,
      organization: userRecord.organization,
      institutionId: userRecord.institutionId,
      aictePermanentId: userRecord.aictePermanentId,
      lastLogin: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };

    // Store secure token in sessionStorage (never storing plaintext passwords)
    setSessionItem(SESSION_TOKEN_KEY, token);
    setSessionItem(ACTIVE_USER_KEY, JSON.stringify(user));

    return {
      success: true,
      user,
      token,
    };
  },

  getCurrentUser(): UserAccount | null {
    try {
      const raw = getSessionItem(ACTIVE_USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  logout(): void {
    removeSessionItem(SESSION_TOKEN_KEY);
    removeSessionItem(ACTIVE_USER_KEY);
  },

  getAvailableDemoCredentials() {
    return MOCK_USER_DATABASE.map((acc) => ({
      name: acc.name,
      email: acc.email,
      password: acc.passwordHash,
      roleId: acc.authorizedRole,
      roleTitle: SYSTEM_ROLES.find((r) => r.id === acc.authorizedRole)?.title,
      org: acc.organization,
    }));
  },
};

export function getRoleDashboardRoute(role?: UserRoleId): string {
  switch (role) {
    case 'COMPLIANCE_OFFICER':
      return '/officer-dashboard';
    case 'DOCUMENT_VERIFICATION_OFFICER':
      return '/issuing-authority';
    case 'REGULATORY_ADMIN':
      return '/officer-dashboard';
    case 'INSTITUTION_ADMIN':
    default:
      return '/institution-portal';
  }
}

export function getRoleWorkspaceLabel(role?: UserRoleId): string {
  switch (role) {
    case 'COMPLIANCE_OFFICER':
      return 'AICTE Officer Dashboard';
    case 'DOCUMENT_VERIFICATION_OFFICER':
      return 'Issuing Authority Verification';
    case 'REGULATORY_ADMIN':
      return 'Regulatory Headquarters Workspace';
    case 'INSTITUTION_ADMIN':
    default:
      return 'Institution Application Portal';
  }
}
