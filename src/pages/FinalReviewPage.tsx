import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { authService } from '../services/authService';
import { finalReviewService } from '../services/finalReviewService';
import type { UserAccount } from '../types/auth';
import type { 
  ScrutinyApplicationSummary, 
  OfficerObservationItem, 
  ClarificationEvidenceRequest, 
  AuthorizedDecisionOutcome 
} from '../types/finalReview';

import { PortalSidebar, type PortalSection } from '../components/portal/PortalSidebar';
import { PortalHeader } from '../components/portal/PortalHeader';
import { RoleUnauthorizedState } from '../components/portal/RoleUnauthorizedState';

import { FinalReviewDashboardKPIs } from '../components/finalReview/FinalReviewDashboardKPIs';
import { ApplicationScrutinyQueueTable } from '../components/finalReview/ApplicationScrutinyQueueTable';
import { UnifiedScrutinyWorkspaceModal } from '../components/finalReview/UnifiedScrutinyWorkspaceModal';
import { ScrutinyReportExportModal } from '../components/finalReview/ScrutinyReportExportModal';
import { MyPendingActionsDrawer } from '../components/finalReview/MyPendingActionsDrawer';

export const FinalReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { appId: routeAppId } = useParams<{ appId?: string }>();
  const [searchParams] = useSearchParams();

  // Authentication State
  const [currentUser] = useState<UserAccount | null>(() => authService.getCurrentUser());

  // Layout State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeKpiFilter, setActiveKpiFilter] = useState('ALL');

  // Drawer & Modals State
  const [selectedAppId, setSelectedAppId] = useState<string | null>(
    () => routeAppId || searchParams.get('appId') || null
  );
  const [reportAppId, setReportAppId] = useState<string | null>(null);
  const [isPendingActionsOpen, setIsPendingActionsOpen] = useState(false);

  // Data State
  const [applications, setApplications] = useState<ScrutinyApplicationSummary[]>(() =>
    finalReviewService.getScrutinyApplications()
  );
  const [kpis, setKpis] = useState(() => finalReviewService.getDashboardKPIs());

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const refreshAll = () => {
    setApplications(finalReviewService.getScrutinyApplications());
    setKpis(finalReviewService.getDashboardKPIs());
  };

  // Role Access Check: Authorized for Scrutiny Officers & Regulatory Admins
  const isAuthorized =
    currentUser?.authorizedRole === 'COMPLIANCE_OFFICER' ||
    currentUser?.authorizedRole === 'REGULATORY_ADMIN';

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

  // Workspace Actions
  const handleSaveObservation = (data: Partial<OfficerObservationItem>) => {
    finalReviewService.saveObservation(data, currentUser?.name, currentUser?.authorizedRole);
    refreshAll();
    showToast('Officer scrutiny observation recorded.');
  };

  const handleResolveDiscrepancy = (id: string, notes: string) => {
    finalReviewService.resolveDiscrepancy(id, notes, currentUser?.name);
    refreshAll();
    showToast('Discrepancy marked resolved in master dossier.');
  };

  const handleSendClarification = (data: Partial<ClarificationEvidenceRequest>) => {
    finalReviewService.sendClarificationRequest(data, currentUser?.name);
    refreshAll();
    showToast('Additional Evidence Request dispatched to technical campus.');
  };

  const handleRecordDecision = (outcome: AuthorizedDecisionOutcome, remarks: string) => {
    if (!selectedAppId) return;
    finalReviewService.recordAuthorizedDecision(
      selectedAppId,
      outcome,
      remarks,
      currentUser?.name,
      currentUser?.authorizedRole
    );
    refreshAll();
    showToast(`Officially recorded determination: ${outcome.replace(/_/g, ' ')}.`);
  };

  const activeAppDetails = selectedAppId
    ? finalReviewService.getApplicationScrutinyDetails(selectedAppId)
    : null;

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
        activeSection="final-review"
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
          activeSectionTitle="Final Application Review & Decision Support"
        />

        {/* Scrollable Page Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          {/* Header Title Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                  Decision Support Directorate
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  AuthenX / Scrutiny / Final Decision Support
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#102B4E] tracking-tight">
                Final Application Review & Decision Support
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Unified application scrutiny, multi-source evidence review, and authorized regulatory decision support.
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsPendingActionsOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Clock className="w-3.5 h-3.5 text-slate-400" /> My Pending Actions
              </button>
            </div>
          </div>

          <div className="space-y-6 max-w-7xl">
            {/* KPI Cards */}
            <FinalReviewDashboardKPIs
              kpis={kpis}
              activeFilter={activeKpiFilter}
              onSelectFilter={setActiveKpiFilter}
            />

            {/* Application Scrutiny Queue Table */}
            <ApplicationScrutinyQueueTable
              applications={applications}
              onOpenWorkspace={(appId) => setSelectedAppId(appId)}
              onOpenReportModal={(appId) => setReportAppId(appId)}
            />
          </div>
        </div>
      </div>

      {/* Unified Scrutiny Workspace Modal */}
      {selectedAppId && activeAppDetails && (
        <UnifiedScrutinyWorkspaceModal
          app={activeAppDetails.app}
          assessment={activeAppDetails.assessment}
          discrepancies={activeAppDetails.discrepancies}
          observations={activeAppDetails.observations}
          evidenceRequests={activeAppDetails.evidenceRequests}
          decisionRecord={activeAppDetails.decisionRecord}
          currentUserRole={currentUser?.authorizedRole}
          onClose={() => setSelectedAppId(null)}
          onSaveObservation={handleSaveObservation}
          onResolveDiscrepancy={handleResolveDiscrepancy}
          onSendClarification={handleSendClarification}
          onRecordDecision={handleRecordDecision}
        />
      )}

      {/* Executive Report Preview Modal */}
      {reportAppId && (
        <ScrutinyReportExportModal
          appId={reportAppId}
          onClose={() => setReportAppId(null)}
        />
      )}

      {/* My Pending Actions Drawer */}
      <MyPendingActionsDrawer
        applications={applications}
        isOpen={isPendingActionsOpen}
        onClose={() => setIsPendingActionsOpen(false)}
        onOpenWorkspace={(appId) => setSelectedAppId(appId)}
      />
    </div>
  );
};
