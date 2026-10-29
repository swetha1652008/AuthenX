import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PortalSidebar, type PortalSection } from '../components/portal/PortalSidebar';
import { PortalHeader } from '../components/portal/PortalHeader';
import { RoleUnauthorizedState } from '../components/portal/RoleUnauthorizedState';
import { AnomalyHeader } from '../components/anomaly/AnomalyHeader';
import { AnomalyDashboardCards } from '../components/anomaly/AnomalyDashboardCards';
import { AnomalyAlertCenter } from '../components/anomaly/AnomalyAlertCenter';
import { SideBySideComparisonWorkspace } from '../components/anomaly/SideBySideComparisonWorkspace';
import { AnomalyReviewModal } from '../components/anomaly/AnomalyReviewModal';
import { AnomalyReportModal } from '../components/anomaly/AnomalyReportModal';
import { authService } from '../services/authService';
import { documentService } from '../services/documentService';
import { institutionService } from '../services/institutionService';
import { anomalyService } from '../services/anomalyService';
import type { UserAccount } from '../types/auth';
import type { ManagedDocument } from '../types/document';
import type { 
  AnomalyAlert, 
  AnomalyDashboardMetrics, 
  AnomalyReviewStatus,
  AnomalyAuditReport 
} from '../types/anomaly';

export const DocumentAuthenticationPage: React.FC = () => {
  const { appId } = useParams<{ appId?: string }>();
  const navigate = useNavigate();

  // 1. Auth & App Context
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => authService.getCurrentUser());
  const applications = institutionService.getApplications();
  const activeApp = (appId ? institutionService.getApplicationById(appId) : null) || applications[0];

  // 2. Navigation State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 3. Document & Anomaly State
  const [documents, setDocuments] = useState<ManagedDocument[]>([]);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([]);
  const [metrics, setMetrics] = useState<AnomalyDashboardMetrics>({
    documentsAnalyzed: 0,
    exactDuplicateMatches: 0,
    possibleDuplicateCandidates: 0,
    metadataMismatches: 0,
    dateInconsistencies: 0,
    alterationIndicators: 0,
    pendingHumanReviews: 0,
  });

  // 4. Interaction State
  const [selectedCardFilter, setSelectedCardFilter] = useState<string | null>(null);
  const [reviewingAlert, setReviewingAlert] = useState<AnomalyAlert | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [activeReport, setActiveReport] = useState<AnomalyAuditReport | null>(null);

  // 5. Workspace targeted document IDs
  const [workspaceDocAId, setWorkspaceDocAId] = useState<string | undefined>(undefined);
  const [workspaceDocBId, setWorkspaceDocBId] = useState<string | undefined>(undefined);

  // 6. Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load documents and run anomaly detection pipeline on mount or appId change
  const [prevAppId, setPrevAppId] = useState<string | null>(null);
  if (activeApp && activeApp.id !== prevAppId) {
    setPrevAppId(activeApp.id);
    const docs = documentService.getDocuments(activeApp.id);
    setDocuments(docs);

    const appAlerts = anomalyService.getAlerts(activeApp.id);
    setAlerts(appAlerts);

    const calcMetrics = anomalyService.getMetrics(activeApp.id);
    setMetrics(calcMetrics);

    const rpt = anomalyService.generateReport(activeApp.id);
    setActiveReport(rpt);

    if (docs.length >= 2) {
      setWorkspaceDocAId(docs[0].id);
      setWorkspaceDocBId(docs[1].id);
    } else if (docs.length === 1) {
      setWorkspaceDocAId(docs[0].id);
    }
  }

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  const handleSectionSelect = (section: PortalSection) => {
    const isOfficer = currentUser?.authorizedRole !== 'INSTITUTION_ADMIN';
    switch (section) {
      case 'overview':
        if (isOfficer) {
          navigate('/officer-dashboard');
        } else {
          navigate('/institution-portal');
        }
        break;
      case 'details':
      case 'eoa':
      case 'changes':
      case 'courses':
      case 'history':
        navigate('/institution-portal');
        break;
      case 'documents':
        navigate(activeApp ? `/documents/${activeApp.id}` : '/documents');
        break;
      case 'validation':
        navigate(activeApp ? `/ai-validation/${activeApp.id}` : '/ai-validation');
        break;
      case 'anomalies':
        // already on anomaly detection
        break;
      case 'issuing-authority':
        navigate(activeApp ? `/issuing-authority/${activeApp.id}` : '/issuing-authority');
        break;
      case 'compliance':
        navigate(activeApp ? `/regulatory-compliance/${activeApp.id}` : '/regulatory-compliance');
        break;
      case 'officer-dashboard':
        navigate('/officer-dashboard');
        break;
      case 'human-review':
        navigate(activeApp ? `/human-review/${activeApp.id}` : '/human-review');
        break;
      case 'alerts-audit':
        navigate('/alerts-audit');
        break;
      case 'reports-analytics':
        if (isOfficer) navigate('/reports-analytics');
        else navigate('/institution-portal?tab=reports-analytics');
        break;
      case 'rules-configuration':
        navigate('/rules-configuration');
        break;
      case 'security-access':
        navigate('/security-access');
        break;
      case 'final-review':
        navigate(activeApp ? `/final-review/${activeApp.id}` : '/final-review');
        break;
      case 'notifications':
        if (isOfficer) navigate('/alerts-audit');
        else navigate('/institution-portal?tab=notifications');
        break;
      case 'help':
        if (isOfficer) navigate('/rules-configuration');
        else navigate('/institution-portal?tab=help');
        break;
      case 'settings':
        if (isOfficer) navigate('/security-access');
        else navigate('/institution-portal?tab=settings');
        break;
      default:
        navigate('/institution-portal');
        break;
    }
  };

  const handleSaveAlertStatus = (alertId: string, status: AnomalyReviewStatus, notes: string) => {
    if (!activeApp || !currentUser) return;
    const updated = anomalyService.updateAlertStatus(activeApp.id, alertId, status, notes, currentUser);
    
    if (updated) {
      const refreshedAlerts = anomalyService.getAlerts(activeApp.id);
      setAlerts(refreshedAlerts);

      const refreshedMetrics = anomalyService.getMetrics(activeApp.id);
      setMetrics(refreshedMetrics);

      const refreshedRpt = anomalyService.generateReport(activeApp.id);
      setActiveReport(refreshedRpt);

      setReviewingAlert(null);
      showToast(`Alert status updated to '${status}'. Audit trail updated.`);
    }
  };

  const handleCompareFromAlert = (docAId: string, docBId?: string) => {
    setWorkspaceDocAId(docAId);
    if (docBId) {
      setWorkspaceDocBId(docBId);
    }
    showToast('Loaded documents into Side-by-Side Comparison Workspace.');
    
    // Smooth scroll down to workspace
    const elem = document.getElementById('comparison-workspace-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExportJson = () => {
    if (activeReport) {
      anomalyService.downloadJsonReport(activeReport);
      showToast('Anomaly audit report exported as JSON.');
    }
  };

  // Protected route check
  if (!currentUser) {
    return (
      <RoleUnauthorizedState
        user={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  // Cross-tenant protection: Institution Admin can only access applications of their own institution
  if (currentUser.authorizedRole === 'INSTITUTION_ADMIN' && appId && !applications.some(a => a.id === appId)) {
    return (
      <RoleUnauthorizedState
        user={currentUser}
        onLogout={handleLogout}
        title="Institution Data Isolation Barrier"
        customMessage={`Access Denied: You are authenticated under '${currentUser.organization}'. You do not have permission to view or manipulate records for application '${appId}'.`}
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#F4F8FF] font-sans antialiased overflow-hidden text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#102B4E] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-blue-500/30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Portal Sidebar */}
      <PortalSidebar
        activeSection="anomalies"
        onSelectSection={handleSectionSelect}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <PortalHeader
          user={currentUser}
          onLogout={handleLogout}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeSectionTitle="Anomaly Detection"
        />

        {/* Page Subheader */}
        <AnomalyHeader
          applicationId={activeApp.id}
          institutionName={activeApp.institution.name}
          academicYear={activeApp.academicYear}
          userRole={currentUser.authorizedRole}
          onNavigateToValidation={() => navigate(`/ai-validation/${activeApp.id}`)}
          onNavigateToDocuments={() => navigate(`/documents/${activeApp.id}`)}
          onOpenReportModal={() => setReportModalOpen(true)}
          onExportJson={handleExportJson}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* 1. Dashboard Metrics (7 KPI Cards) */}
          <AnomalyDashboardCards
            metrics={metrics}
            selectedFilter={selectedCardFilter}
            onSelectFilter={(f) => setSelectedCardFilter(f)}
          />

          {/* 2. Anomaly & Risk Alert Center */}
          <AnomalyAlertCenter
            alerts={alerts}
            selectedFilter={selectedCardFilter}
            onClearFilter={() => setSelectedCardFilter(null)}
            onReviewAlert={(al) => setReviewingAlert(al)}
            onCompareDocuments={handleCompareFromAlert}
          />

          {/* 3. Interactive Side-by-Side Comparison Workspace */}
          <div id="comparison-workspace-section">
            <SideBySideComparisonWorkspace
              documents={documents}
              initialDocAId={workspaceDocAId}
              initialDocBId={workspaceDocBId}
            />
          </div>
        </main>
      </div>

      {/* Review Modal */}
      {reviewingAlert && (
        <AnomalyReviewModal
          alert={reviewingAlert}
          currentUser={currentUser}
          onClose={() => setReviewingAlert(null)}
          onSaveStatus={handleSaveAlertStatus}
        />
      )}

      {/* Audit Report Modal */}
      {reportModalOpen && activeReport && (
        <AnomalyReportModal
          report={activeReport}
          onClose={() => setReportModalOpen(false)}
          onDownload={handleExportJson}
        />
      )}
    </div>
  );
};
