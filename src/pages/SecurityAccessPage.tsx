import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Lock, 
  Sliders, 
  Activity, 
  Archive, 
  ClipboardCheck, 
  Download 
} from 'lucide-react';
import { authService } from '../services/authService';
import { securityAccessService } from '../services/securityAccessService';
import type { UserAccount, UserRoleId } from '../types/auth';
import type { 
  AccountStatus, 
  SecurityModuleKey, 
  SecurityActionKey 
} from '../types/securityAccess';

import { PortalSidebar, type PortalSection } from '../components/portal/PortalSidebar';
import { PortalHeader } from '../components/portal/PortalHeader';
import { RoleUnauthorizedState } from '../components/portal/RoleUnauthorizedState';

import { SecurityOverviewCards } from '../components/security/SecurityOverviewCards';
import { IdentityAccountManagementTable } from '../components/security/IdentityAccountManagementTable';
import { RolePermissionMatrixView } from '../components/security/RolePermissionMatrixView';
import { AccessPolicyConfigPanel } from '../components/security/AccessPolicyConfigPanel';
import { SecurityAuditLogExplorer } from '../components/security/SecurityAuditLogExplorer';
import { DataRetentionDisposalWorkspace } from '../components/security/DataRetentionDisposalWorkspace';
import { AccessReviewQueueSection } from '../components/security/AccessReviewQueueSection';

export const SecurityAccessPage: React.FC = () => {
  const navigate = useNavigate();

  // Authentication State
  const [currentUser] = useState<UserAccount | null>(() => authService.getCurrentUser());

  // Layout State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    'IDENTITIES' | 'PERMISSIONS' | 'POLICIES' | 'AUDIT' | 'RETENTION' | 'REVIEWS'
  >('IDENTITIES');
  const [kpiFilter, setKpiFilter] = useState('ALL');

  // Security Data State
  const [users, setUsers] = useState(() => securityAccessService.getUsers());
  const [kpis, setKpis] = useState(() => securityAccessService.getSecurityKPIs());
  const [permissionMatrix, setPermissionMatrix] = useState(() => securityAccessService.getRolePermissions());
  const [policies, setPolicies] = useState(() => securityAccessService.getAccessPolicies());
  const [auditLogs, setAuditLogs] = useState(() => securityAccessService.getAuditLogs());
  const [retentionPolicies, setRetentionPolicies] = useState(() => securityAccessService.getRetentionPolicies());
  const [accessReviews, setAccessReviews] = useState(() => securityAccessService.getAccessReviews());

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const refreshAll = () => {
    setUsers(securityAccessService.getUsers());
    setKpis(securityAccessService.getSecurityKPIs());
    setPermissionMatrix(securityAccessService.getRolePermissions());
    setPolicies(securityAccessService.getAccessPolicies());
    setAuditLogs(securityAccessService.getAuditLogs());
    setRetentionPolicies(securityAccessService.getRetentionPolicies());
    setAccessReviews(securityAccessService.getAccessReviews());
  };

  // Role Access Check: Exclusively for Regulatory Administrators
  const isAuthorized = currentUser?.authorizedRole === 'REGULATORY_ADMIN';

  if (!currentUser || !isAuthorized) {
    return (
      <RoleUnauthorizedState
        user={currentUser}
        onLogout={() => {
          authService.logout();
          navigate('/login');
        }}
      />
    );
  }

  // Sidebar navigation handler
  const handleSelectSidebarSection = (section: PortalSection) => {
    if (section === 'overview' || section === 'officer-dashboard') navigate('/officer-dashboard');
    else if (section === 'documents') navigate('/documents');
    else if (section === 'validation') navigate('/ai-validation');
    else if (section === 'anomalies') navigate('/document-authentication');
    else if (section === 'issuing-authority') navigate('/issuing-authority');
    else if (section === 'compliance') navigate('/regulatory-compliance');
    else if (section === 'human-review') navigate('/human-review');
    else if (section === 'alerts-audit') navigate('/alerts-audit');
    else if (section === 'reports-analytics') navigate('/reports-analytics');
    else if (section === 'rules-configuration') navigate('/rules-configuration');
    else if (section === 'security-access' || section === 'settings') navigate('/security-access');
    else if (section === 'final-review') navigate('/final-review');
    else if (section === 'notifications') navigate('/alerts-audit');
    else if (section === 'help') navigate('/rules-configuration');
    else navigate('/officer-dashboard');
  };

  // Action Handlers
  const handleUpdateUserStatus = (id: string, status: AccountStatus, reason: string) => {
    const success = securityAccessService.updateUserStatus(id, status, reason, currentUser?.name);
    if (success) {
      refreshAll();
      showToast(`Account status updated to ${status}.`);
    }
  };

  const handleUpdateUserRole = (id: string, role: UserRoleId, reason: string) => {
    const success = securityAccessService.updateUserRole(id, role, reason, currentUser?.name);
    if (success) {
      refreshAll();
      showToast(`User role reassigned to ${role}.`);
    }
  };

  const handleResetPassword = (id: string) => {
    const token = securityAccessService.resetUserPassword(id, currentUser?.name);
    refreshAll();
    showToast(`Password reset token ${token} generated.`);
  };

  const handleRevokeSessions = (id: string) => {
    const success = securityAccessService.revokeUserSessions(id, currentUser?.name);
    if (success) {
      refreshAll();
      showToast('Active sessions invalidated server-side.');
    }
  };

  const handleUpdatePermission = (
    role: UserRoleId,
    module: SecurityModuleKey,
    actions: SecurityActionKey[]
  ) => {
    securityAccessService.updateRolePermissions(role, module, actions, currentUser?.name);
    refreshAll();
    showToast(`Updated permissions for ${role} on ${module}.`);
  };

  const handleUpdatePolicy = (id: string, val: string | number | boolean) => {
    securityAccessService.updateAccessPolicy(id, val, currentUser?.name);
    refreshAll();
    showToast('Security access policy saved.');
  };

  const handleToggleLegalHold = (policyId: string, active: boolean) => {
    securityAccessService.toggleLegalHold(policyId, active, currentUser?.name);
    refreshAll();
    showToast(active ? 'Legal hold activated on category.' : 'Legal hold released.');
  };

  const handleSimulateDisposal = (policyId: string) => {
    const res = securityAccessService.simulateDisposal(policyId, currentUser?.name);
    refreshAll();
    showToast(res.message);
  };

  const handleUpdateReview = (
    id: string,
    status: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUIRED',
    remarks: string
  ) => {
    securityAccessService.updateAccessReview(id, status, remarks, currentUser?.name);
    refreshAll();
    showToast(`Access review recorded as ${status}.`);
  };

  const handleExportUsers = () => {
    const csv = securityAccessService.exportSecurityReport('USERS');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AuthenX_Security_Users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded user inventory report.');
  };

  const handleExportAudit = () => {
    const csv = securityAccessService.exportSecurityReport('AUDIT');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AuthenX_Security_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded CERT-In audit logs export.');
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#102B4E] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-white/20 animate-fade-in flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Global Sidebar */}
      <PortalSidebar
        activeSection="security-access"
        onSelectSection={handleSelectSidebarSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <PortalHeader
          user={currentUser}
          onLogout={() => {
            authService.logout();
            navigate('/login');
          }}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeSectionTitle="Security & Access Management"
        />

        {/* Scrollable Page Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          {/* Header Title Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F766E] bg-teal-100/70 border border-teal-200 px-2.5 py-0.5 rounded-full">
                  Security & Access Governance
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  AuthenX / Administration / Security & Access
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#102B4E] tracking-tight">
                Security & Access Management
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Control identities, enforce permissions, monitor administrative activity and manage institutional data securely.
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportUsers}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" /> Export User Inventory
              </button>
            </div>
          </div>

          <div className="space-y-6 max-w-7xl">
            {/* KPI Cards */}
            <SecurityOverviewCards
              kpis={kpis}
              activeFilter={kpiFilter}
              onSelectFilter={(f) => {
                setKpiFilter(f);
                if (f === 'AUDIT' || f === 'FAILED_LOGINS') setActiveTab('AUDIT');
                else if (f === 'ROLES') setActiveTab('PERMISSIONS');
                else if (f === 'REVIEWS') setActiveTab('REVIEWS');
                else if (f === 'HOLDS') setActiveTab('RETENTION');
                else setActiveTab('IDENTITIES');
              }}
            />

            {/* Sub-Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-white rounded-xl px-4 text-xs font-bold gap-6 shadow-xs overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('IDENTITIES')}
                className={`py-3.5 flex items-center gap-1.5 border-b-2 transition-colors shrink-0 ${
                  activeTab === 'IDENTITIES'
                    ? 'border-[#0F766E] text-[#0F766E]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-4 h-4" /> Identities & Accounts ({users.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('PERMISSIONS')}
                className={`py-3.5 flex items-center gap-1.5 border-b-2 transition-colors shrink-0 ${
                  activeTab === 'PERMISSIONS'
                    ? 'border-[#0F766E] text-[#0F766E]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Lock className="w-4 h-4" /> Role & Permission Matrix
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('POLICIES')}
                className={`py-3.5 flex items-center gap-1.5 border-b-2 transition-colors shrink-0 ${
                  activeTab === 'POLICIES'
                    ? 'border-[#0F766E] text-[#0F766E]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sliders className="w-4 h-4" /> Access & Session Policies
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('AUDIT')}
                className={`py-3.5 flex items-center gap-1.5 border-b-2 transition-colors shrink-0 ${
                  activeTab === 'AUDIT'
                    ? 'border-[#0F766E] text-[#0F766E]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Activity className="w-4 h-4" /> Audit Log Explorer ({auditLogs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('RETENTION')}
                className={`py-3.5 flex items-center gap-1.5 border-b-2 transition-colors shrink-0 ${
                  activeTab === 'RETENTION'
                    ? 'border-[#0F766E] text-[#0F766E]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Archive className="w-4 h-4" /> Data Retention & Disposal
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('REVIEWS')}
                className={`py-3.5 flex items-center gap-1.5 border-b-2 transition-colors shrink-0 ${
                  activeTab === 'REVIEWS'
                    ? 'border-[#0F766E] text-[#0F766E]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ClipboardCheck className="w-4 h-4" /> Privileged Access Reviews ({accessReviews.length})
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'IDENTITIES' && (
              <IdentityAccountManagementTable
                users={users}
                onUpdateStatus={handleUpdateUserStatus}
                onUpdateRole={handleUpdateUserRole}
                onResetPassword={handleResetPassword}
                onRevokeSessions={handleRevokeSessions}
              />
            )}

            {activeTab === 'PERMISSIONS' && (
              <RolePermissionMatrixView
                permissionMatrix={permissionMatrix}
                onUpdatePermission={handleUpdatePermission}
              />
            )}

            {activeTab === 'POLICIES' && (
              <AccessPolicyConfigPanel
                policies={policies}
                onUpdatePolicy={handleUpdatePolicy}
              />
            )}

            {activeTab === 'AUDIT' && (
              <SecurityAuditLogExplorer
                logs={auditLogs}
                onExportCsv={handleExportAudit}
              />
            )}

            {activeTab === 'RETENTION' && (
              <DataRetentionDisposalWorkspace
                policies={retentionPolicies}
                onToggleLegalHold={handleToggleLegalHold}
                onSimulateDisposal={handleSimulateDisposal}
              />
            )}

            {activeTab === 'REVIEWS' && (
              <AccessReviewQueueSection
                reviews={accessReviews}
                onUpdateReview={handleUpdateReview}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
