import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { officerDashboardService } from '../services/officerDashboardService';
import type { UserAccount } from '../types/auth';
import type { ApplicationFilterOptions } from '../types/officerDashboard';

import { PortalSidebar, type PortalSection } from '../components/portal/PortalSidebar';
import { PortalHeader } from '../components/portal/PortalHeader';
import { RoleUnauthorizedState } from '../components/portal/RoleUnauthorizedState';

import { OfficerDashboardHeader } from '../components/officer/OfficerDashboardHeader';
import { OfficerWorkloadSection } from '../components/officer/OfficerWorkloadSection';
import { ComplianceAttentionCards } from '../components/officer/ComplianceAttentionCards';
import { PriorityReviewQueueTable } from '../components/officer/PriorityReviewQueueTable';
import { ValidationStatusChart } from '../components/officer/ValidationStatusChart';
import { RecentActivityFeed } from '../components/officer/RecentActivityFeed';
import { OfficerQuickActionsPanel } from '../components/officer/OfficerQuickActionsPanel';
import { AllApplicationsManagementModal } from '../components/officer/AllApplicationsManagementModal';
import { OfficerReportsModal } from '../components/officer/OfficerReportsModal';

export const OfficerDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Authentication State
  const [currentUser] = useState<UserAccount | null>(() =>
    authService.getCurrentUser()
  );

  // Layout State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [toastMessage] = useState<string | null>(null);

  // Dashboard Data State
  const [workloadStats] = useState(() =>
    officerDashboardService.getWorkloadStats()
  );
  const [attentionStats] = useState(() =>
    officerDashboardService.getComplianceAttentionStats()
  );
  const [priorityQueue] = useState(() =>
    officerDashboardService.getPriorityReviewQueue()
  );
  const [recentActivities] = useState(() =>
    officerDashboardService.getRecentActivity()
  );

  // Modals & Navigation Filters State
  const [showAllApplicationsModal, setShowAllApplicationsModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [activeModalFilter, setActiveModalFilter] = useState<Partial<ApplicationFilterOptions>>({});

  const handleOpenAllApplicationsWithFilter = (filter: Partial<ApplicationFilterOptions>) => {
    setActiveModalFilter(filter);
    setShowAllApplicationsModal(true);
  };

  const handleNavigateToModulePage = (pageName: string, appId: string) => {
    setShowAllApplicationsModal(false);
    if (pageName === 'documents') navigate(`/documents/${appId}`);
    else if (pageName === 'validation') navigate(`/ai-validation/${appId}`);
    else if (pageName === 'anomalies') navigate(`/document-authentication/${appId}`);
    else if (pageName === 'issuing-authority') navigate(`/issuing-authority/${appId}`);
    else if (pageName === 'compliance') navigate(`/regulatory-compliance/${appId}`);
    else navigate(`/institution-portal`);
  };

  // Role Access Check: Must be authenticated and belong to an officer role
  if (!currentUser) {
    return (
      <RoleUnauthorizedState
        user={null}
        onLogout={() => {
          authService.logout();
          navigate('/login');
        }}
      />
    );
  }

  const isAuthorized =
    currentUser.authorizedRole === 'COMPLIANCE_OFFICER' ||
    currentUser.authorizedRole === 'REGULATORY_ADMIN' ||
    currentUser.authorizedRole === 'DOCUMENT_VERIFICATION_OFFICER';

  if (!isAuthorized) {
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

  // Sidebar navigation
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
    else if (section === 'notifications') navigate('/alerts-audit');
    else if (section === 'help') navigate('/rules-configuration');
    else if (section === 'final-review') navigate('/final-review');
    else navigate('/officer-dashboard');
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
        activeSection="officer-dashboard"
        onSelectSection={handleSelectSidebarSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Center Layout Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Global Portal Header */}
        <PortalHeader
          user={currentUser}
          onLogout={() => {
            authService.logout();
            navigate('/login');
          }}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          activeSectionTitle="AICTE Officer Dashboard — Regulatory Overview"
        />

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Executive Header */}
          <OfficerDashboardHeader
            user={currentUser}
            searchQuery={globalSearch}
            onSearchChange={setGlobalSearch}
            onOpenAllApplications={() => handleOpenAllApplicationsWithFilter({})}
            onOpenReports={() => setShowReportsModal(true)}
            isDemoMode={true}
          />

          <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
            {/* Workload Metric Cards */}
            <OfficerWorkloadSection
              stats={workloadStats}
              onFilterClick={(type) => {
                if (type === 'COMPLETED') {
                  handleOpenAllApplicationsWithFilter({ validationStatus: 'Verified by Authorized Source' });
                } else if (type === 'PENDING') {
                  handleOpenAllApplicationsWithFilter({ validationStatus: 'Preliminary Check Passed' });
                } else {
                  handleOpenAllApplicationsWithFilter({});
                }
              }}
            />

            {/* Compliance Attention Indicators */}
            <ComplianceAttentionCards
              stats={attentionStats}
              onSelectIndicator={(type) => {
                if (type === 'MISSING') {
                  handleOpenAllApplicationsWithFilter({ documentStatus: 'Missing Required' });
                } else if (type === 'DISCREPANCIES') {
                  handleOpenAllApplicationsWithFilter({ validationStatus: 'Mismatch Detected' });
                } else if (type === 'REVIEW') {
                  handleOpenAllApplicationsWithFilter({ reviewStatus: 'Under Official Review' });
                } else if (type === 'EXPIRED') {
                  handleOpenAllApplicationsWithFilter({ documentStatus: 'Expired Detected' });
                }
              }}
            />

            {/* Quick Actions Panel */}
            <OfficerQuickActionsPanel
              onOpenAllApplications={() => handleOpenAllApplicationsWithFilter({})}
              onFilterPendingCases={() => handleOpenAllApplicationsWithFilter({ reviewStatus: 'Under Official Review' })}
              onFilterMissingDocs={() => handleOpenAllApplicationsWithFilter({ documentStatus: 'Missing Required' })}
              onFilterDiscrepancies={() => handleOpenAllApplicationsWithFilter({ validationStatus: 'Mismatch Detected' })}
              onOpenReports={() => setShowReportsModal(true)}
              onNavigateToIssuingAuthority={() => navigate('/issuing-authority')}
              onNavigateToCompliance={() => navigate('/regulatory-compliance')}
            />

            {/* Priority Review Queue Table */}
            <PriorityReviewQueueTable
              queueItems={priorityQueue}
              onOpenApplication={(appId) => navigate(`/regulatory-compliance/${appId}`)}
              onReviewApplication={(appId) => navigate(`/regulatory-compliance/${appId}`)}
            />

            {/* Validation Status Progress Chart */}
            <ValidationStatusChart
              completedCount={workloadStats.validationCompleted}
              pendingCount={workloadStats.validationPending}
              requiringReviewCount={attentionStats.applicationsRequiringReviewCount}
              totalApplications={workloadStats.totalApplications}
            />

            {/* Recent Activity Feed */}
            <RecentActivityFeed
              activities={recentActivities}
              onOpenApplication={(appId) => navigate(`/regulatory-compliance/${appId}`)}
            />
          </div>
        </div>
      </div>

      {/* All Applications Management Modal */}
      {showAllApplicationsModal && (
        <AllApplicationsManagementModal
          onClose={() => setShowAllApplicationsModal(false)}
          onNavigateToPage={handleNavigateToModulePage}
          initialFilter={activeModalFilter}
        />
      )}

      {/* Reports Modal */}
      {showReportsModal && (
        <OfficerReportsModal onClose={() => setShowReportsModal(false)} />
      )}
    </div>
  );
};
