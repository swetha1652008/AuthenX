import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Send, 
  Layers, 
  RefreshCw 
} from 'lucide-react';

import { authService } from '../services/authService';
import { humanReviewService } from '../services/humanReviewService';
import type { UserAccount } from '../types/auth';
import type { 
  HumanReviewCase, 
  ReviewFindingItem, 
  RectificationRequest,
  InstitutionResponseData 
} from '../types/humanReview';

import { PortalSidebar, type PortalSection } from '../components/portal/PortalSidebar';
import { PortalHeader } from '../components/portal/PortalHeader';
import { RoleUnauthorizedState } from '../components/portal/RoleUnauthorizedState';

import { HumanReviewDashboardCards } from '../components/humanReview/HumanReviewDashboardCards';
import { HumanReviewQueueTable } from '../components/humanReview/HumanReviewQueueTable';
import { ApplicationReviewWorkspaceModal } from '../components/humanReview/ApplicationReviewWorkspaceModal';
import { RectificationRequestModal } from '../components/humanReview/RectificationRequestModal';
import { RectificationTrackingTable } from '../components/humanReview/RectificationTrackingTable';
import { RevalidationModal } from '../components/humanReview/RevalidationModal';

export const HumanReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { appId } = useParams<{ appId?: string }>();

  // Current User
  const [currentUser] = useState<UserAccount | null>(() => authService.getCurrentUser());

  // Layout State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mainView, setMainView] = useState<'QUEUE' | 'RECTIFICATIONS'>('QUEUE');
  const [activeKpiFilter, setActiveKpiFilter] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const instFilter = currentUser?.authorizedRole === 'INSTITUTION_ADMIN' ? currentUser.institutionId : undefined;

  // Data State
  const [cases, setCases] = useState<HumanReviewCase[]>(() => humanReviewService.getCases(instFilter));
  const [rectifications, setRectifications] = useState<RectificationRequest[]>(() =>
    humanReviewService.getRectificationRequests(instFilter)
  );
  const [stats, setStats] = useState(() => humanReviewService.getDashboardStats());

  // Active Selected Modal States
  const [selectedCase, setSelectedCase] = useState<HumanReviewCase | null>(() =>
    appId ? humanReviewService.getCaseByApplicationId(appId) || null : null
  );
  const [rectificationModalData, setRectificationModalData] = useState<{
    caseItem: HumanReviewCase;
    finding?: ReviewFindingItem;
  } | null>(null);
  const [revalidationModalCase, setRevalidationModalCase] = useState<HumanReviewCase | null>(null);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    if (appId && selectedCase?.applicationId !== appId) {
      const match = humanReviewService.getCaseByApplicationId(appId);
      if (match) {
        const timer = setTimeout(() => setSelectedCase(match), 0);
        return () => clearTimeout(timer);
      }
    }
  }, [appId, selectedCase?.applicationId]);

  // Refresh all state from service
  const refreshData = () => {
    const updatedCases = humanReviewService.getCases(instFilter);
    const updatedRect = humanReviewService.getRectificationRequests(instFilter);
    const updatedStats = humanReviewService.getDashboardStats();
    setCases(updatedCases);
    setRectifications(updatedRect);
    setStats(updatedStats);

    if (selectedCase) {
      const refreshedSelected = updatedCases.find((c) => c.id === selectedCase.id);
      if (refreshedSelected) setSelectedCase(refreshedSelected);
    }
  };

  // Role Access Check
  const isAuthorized =
    currentUser?.authorizedRole === 'COMPLIANCE_OFFICER' ||
    currentUser?.authorizedRole === 'DOCUMENT_VERIFICATION_OFFICER' ||
    currentUser?.authorizedRole === 'REGULATORY_ADMIN' ||
    currentUser?.authorizedRole === 'INSTITUTION_ADMIN' ||
    !currentUser;

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

  // Sidebar navigation handler
  const handleSelectSidebarSection = (section: PortalSection) => {
    const isOfficer = currentUser?.authorizedRole !== 'INSTITUTION_ADMIN';
    if (section === 'overview') {
      if (isOfficer) navigate('/officer-dashboard');
      else navigate('/institution-portal');
    }
    else if (section === 'documents') navigate('/documents');
    else if (section === 'validation') navigate('/ai-validation');
    else if (section === 'anomalies') navigate('/document-authentication');
    else if (section === 'issuing-authority') navigate('/issuing-authority');
    else if (section === 'compliance') navigate('/regulatory-compliance');
    else if (section === 'officer-dashboard') navigate('/officer-dashboard');
    else if (section === 'human-review') navigate('/human-review');
    else if (section === 'alerts-audit') navigate('/alerts-audit');
    else if (section === 'reports-analytics') {
      if (isOfficer) navigate('/reports-analytics');
      else navigate('/institution-portal?tab=reports-analytics');
    }
    else if (section === 'rules-configuration') navigate('/rules-configuration');
    else if (section === 'security-access') navigate('/security-access');
    else if (section === 'final-review') navigate('/final-review');
    else if (section === 'notifications') {
      if (isOfficer) navigate('/alerts-audit');
      else navigate('/institution-portal?tab=notifications');
    }
    else if (section === 'help') {
      if (isOfficer) navigate('/rules-configuration');
      else navigate('/institution-portal?tab=help');
    }
    else if (section === 'settings') {
      if (isOfficer) navigate('/security-access');
      else navigate('/institution-portal?tab=settings');
    }
    else navigate(isOfficer ? '/officer-dashboard' : '/institution-portal');
  };

  // Case Actions
  const handleAddRemark = (remark: string, action: string) => {
    if (!selectedCase) return;
    const officerName = currentUser?.name || 'Authorized Officer';
    const officerRole = currentUser?.authorizedRole || 'COMPLIANCE_OFFICER';
    humanReviewService.addRemark(selectedCase.id, remark, officerName, officerRole, action);
    refreshData();
    showToast('Official remark saved to immutable audit trail.');
  };

  const handleResolveFinding = (findingId: string, determination: string) => {
    if (!selectedCase) return;
    const officerName = currentUser?.name || 'Authorized Officer';
    humanReviewService.resolveFinding(selectedCase.id, findingId, determination, officerName);
    refreshData();
    showToast(`Finding [${findingId}] resolved successfully.`);
  };

  const handleReassignOfficer = (newOfficer: string) => {
    if (!selectedCase) return;
    const officerName = currentUser?.name || 'Authorized Officer';
    humanReviewService.reassignCase(selectedCase.id, newOfficer, officerName);
    refreshData();
    showToast(`Case reassigned to ${newOfficer}.`);
  };

  const handleMarkCompleted = (remarks: string) => {
    if (!selectedCase) return;
    const officerName = currentUser?.name || 'Authorized Officer';
    humanReviewService.markReviewCompleted(selectedCase.id, officerName, remarks);
    refreshData();
    showToast(`Review for ${selectedCase.applicationId} marked completed.`);
  };

  // Rectification Dispatch
  const handleSendRectification = (
    reqData: Omit<RectificationRequest, 'id' | 'status' | 'sentAt' | 'updatedAt'>
  ) => {
    humanReviewService.sendRectificationRequest(reqData);
    setRectificationModalData(null);
    refreshData();
    showToast(`Rectification notice dispatched to ${reqData.institutionName}.`);
  };

  // Rectification Operations
  const handleAcceptRectification = (requestId: string, remarks: string) => {
    const officerName = currentUser?.name || 'Authorized Officer';
    humanReviewService.acceptRectification(requestId, remarks, officerName);
    refreshData();
    showToast(`Rectification notice ${requestId} accepted and findings cleared.`);
  };

  const handleRequestFurtherCorrection = (requestId: string, instructions: string) => {
    const officerName = currentUser?.name || 'Authorized Officer';
    humanReviewService.requestFurtherCorrection(requestId, instructions, officerName);
    refreshData();
    showToast(`Further correction requested for ${requestId}.`);
  };

  const handleSubmitMockResponse = (requestId: string, responseData: InstitutionResponseData) => {
    humanReviewService.submitInstitutionResponse(requestId, responseData);
    refreshData();
    showToast(`Institution response recorded for ${requestId}. Ready for re-validation.`);
  };

  // Quick Resolve
  const handleQuickResolve = (c: HumanReviewCase) => {
    c.findings.forEach((f) => {
      if (f.status !== 'RESOLVED') {
        humanReviewService.resolveFinding(
          c.id,
          f.id,
          'Verified and satisfied during quick officer review.',
          currentUser?.name || 'Authorized Officer'
        );
      }
    });
    refreshData();
    showToast(`All findings for ${c.applicationId} marked resolved.`);
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
        activeSection="human-review"
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
          activeSectionTitle="Human Review & Rectification"
        />

        {/* Scrollable Page Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          {/* Header Title Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 border border-blue-200 px-2.5 py-0.5 rounded-full">
                  AICTE Regulatory Scrutiny
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  Approval Process Handbook 2026-27
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#102B4E] tracking-tight">
                Human Review & Rectification Portal
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Scrutinize flagged applications, inspect AI validation discrepancies, dispatch statutory rectification notices, review institution corrections, and execute automated re-validation.
              </p>
            </div>

            {/* Quick Actions / Tab Switcher */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setMainView('QUEUE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    mainView === 'QUEUE'
                      ? 'bg-white text-[#102B4E] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> Review Queue
                </button>
                <button
                  type="button"
                  onClick={() => setMainView('RECTIFICATIONS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    mainView === 'RECTIFICATIONS'
                      ? 'bg-white text-[#102B4E] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" /> Rectification Notices ({rectifications.length})
                </button>
              </div>

              <button
                type="button"
                onClick={refreshData}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-[#2563EB] hover:border-[#2563EB] shadow-sm transition-colors"
                title="Refresh Live Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 7 KPI Dashboard Metrics Cards */}
          <HumanReviewDashboardCards
            stats={stats}
            activeFilter={activeKpiFilter}
            onFilterClick={(filter) => {
              setActiveKpiFilter(filter);
              setMainView('QUEUE');
            }}
          />

          {/* Main View: Review Queue vs Rectification Notices */}
          {mainView === 'QUEUE' ? (
            <HumanReviewQueueTable
              cases={cases}
              activeFilter={activeKpiFilter}
              onFilterChange={(f) => setActiveKpiFilter(f)}
              onSelectCase={(c) => setSelectedCase(c)}
              onRequestRectification={(c) =>
                setRectificationModalData({ caseItem: c })
              }
              onTriggerRevalidation={(c) => setRevalidationModalCase(c)}
              onQuickResolve={handleQuickResolve}
            />
          ) : (
            <RectificationTrackingTable
              requests={rectifications}
              onAcceptRectification={handleAcceptRectification}
              onRequestFurtherCorrection={handleRequestFurtherCorrection}
              onSubmitMockResponse={handleSubmitMockResponse}
              onSelectApplication={(targetAppId) => {
                const match = cases.find((c) => c.applicationId === targetAppId);
                if (match) setSelectedCase(match);
              }}
            />
          )}
        </div>
      </div>

      {/* Case Review Workspace Modal */}
      {selectedCase && (
        <ApplicationReviewWorkspaceModal
          caseItem={selectedCase}
          onClose={() => setSelectedCase(null)}
          onAddRemark={handleAddRemark}
          onResolveFinding={handleResolveFinding}
          onReassignOfficer={handleReassignOfficer}
          onOpenRectificationModal={(finding) =>
            setRectificationModalData({ caseItem: selectedCase, finding })
          }
          onTriggerRevalidation={() => setRevalidationModalCase(selectedCase)}
          onMarkCompleted={handleMarkCompleted}
        />
      )}

      {/* Rectification Notice Modal */}
      {rectificationModalData && (
        <RectificationRequestModal
          applicationId={rectificationModalData.caseItem.applicationId}
          institutionName={rectificationModalData.caseItem.institutionName}
          institutionId={rectificationModalData.caseItem.institutionId}
          preselectedFinding={rectificationModalData.finding}
          officerName={currentUser?.name || 'Dr. Ramesh Sharma (Compliance Officer)'}
          onClose={() => setRectificationModalData(null)}
          onSubmit={handleSendRectification}
        />
      )}

      {/* Revalidation Runner Modal */}
      {revalidationModalCase && (
        <RevalidationModal
          applicationId={revalidationModalCase.applicationId}
          institutionName={revalidationModalCase.institutionName}
          onExecute={() => {
            const result = humanReviewService.triggerRevalidation(
              revalidationModalCase.id,
              undefined,
              currentUser?.name || 'Authorized Officer'
            );
            refreshData();
            return result;
          }}
          onClose={() => setRevalidationModalCase(null)}
        />
      )}
    </div>
  );
};
