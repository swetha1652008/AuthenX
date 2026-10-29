export type UserRoleId = 
  | 'INSTITUTION_ADMIN'
  | 'COMPLIANCE_OFFICER'
  | 'DOCUMENT_VERIFICATION_OFFICER'
  | 'REGULATORY_ADMIN';

export interface RoleDefinition {
  id: UserRoleId;
  title: string;
  badge: string;
  description: string;
  iconName: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  authorizedRole: UserRoleId;
  designation: string;
  organization: string;
  institutionId?: string;
  aictePermanentId?: string;
  avatarUrl?: string;
  lastLogin?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: UserAccount | null;
  activeRole: UserRoleId | null;
  token?: string;
}
