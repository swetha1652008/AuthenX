import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { institutionService } from '../services/institutionService';
import { issuingAuthorityService } from '../services/issuingAuthorityService';
import { documentService } from '../services/documentService';
import type { UserAccount } from '../types/auth';
import type { InstitutionApplication } from '../types/institution';
import type { 
  VerificationRequest, 
  VerificationMethodType, 
  ManualReviewOutcome 
} from '../types/issuingAuthority';

import { PortalSidebar } from '../components/portal/PortalSidebar';
import { PortalHeader } from '../components/portal/PortalHeader';
import { RoleUnauthorizedState } from '../components/portal/RoleUnauthorizedState';

import { IssuingAuthorityHeader } from '../components/issuingAuthority/IssuingAuthorityHeader';
import { VerificationDashboardCards } from '../components/issuingAuthority/VerificationDashboardCards';
import { ChooseVerificationMethodSection } from '../components/issuingAuthority/ChooseVerificationMethodSection';
import { QRCodeVerificationWorkspace } from '../components/issuingAuthority/QRCodeVerificationWorkspace';
import { ReferenceNumberVerificationWorkspace } from '../components/issuingAuthority/ReferenceNumberVerificationWorkspace';
import { OfficialApiPortalWorkspace } from '../components/issuingAuthority/OfficialApiPortalWorkspace';
import { ManualReviewQueueSection } from '../components/issuingAuthority/ManualReviewQueueSection';
import { VerificationRequestsTable } from '../components/issuingAuthority/VerificationRequestsTable';

import { VerificationDetailsModal } from '../components/issuingAuthority/VerificationDetailsModal';
import { NewVerificationRequestModal } from '../components/issuingAuthority/NewVerificationRequestModal';
import { FieldComparisonModal } from '../components/issuingAuthority/FieldComparisonModal';
import { ExportReportModal } from '../components/issuingAuthority/ExportReportModal';

export const IssuingAuthorityPage: React.FC = () => {
  const navigate = useNavigate();
  const { appId: routeAppId } = useParams();
  const [searchParams] = useSearchParams();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() =>
    authService.getCurrentUser()
  );

  // Layout State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Determine active application
  const applications = institutionService.getApplications();
  const targetAppId = routeAppId || searchParams.get('appId') || applications[0]?.id || 'APP-2026-AICTE-8491';

  const [activeApp, setActiveApp] = useState<InstitutionApplication>(() => {
    return institutionService.getApplicationById(targetAppId) || applications[0];
  });

  // Master Data State
  const [requests, setRequests] = useState<VerificationRequest[]>(() =>
    issuingAuthorityService.getRequests(activeApp.institution.aictePermanentId)
  );
  const [counts, setCounts] = useState(() =>
    issuingAuthorityService.getDashboardCounts(activeApp.institution.aictePermanentId)
  );

  // Filter & Search State
  const [selectedDashboardFilter, setSelectedDashboardFilter] = useState('ALL');
  const [activeMethod, setActiveMethod] = useState<VerificationMethodType>('QR_CODE');
  const [globalSearch, setGlobalSearch] = useState('');

  // Modals State
  const [inspectRequest, setInspectRequest] = useState<VerificationRequest | null>(null);
  const [inspectTab, setInspectTab] = useState<string>('overview');
  const [comparisonRequest, setComparisonRequest] = useState<VerificationRequest | null>(null);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Sync state if application switches
  const [prevAppId, setPrevAppId] = useState(targetAppId);
  if (targetAppId !== prevAppId) {
    setPrevAppId(targetAppId);
    const found = institutionService.getApplicationById(targetAppId) || applications[0];
    if (found) {
      setActiveApp(found);
      const reqs = issuingAuthorityService.getRequests(found.institution.aictePermanentId);
      setRequests(reqs);
      setCounts(issuingAuthorityService.getDashboardCounts(found.institution.aictePermanentId));
    }
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSelectApplication = (newAppId: string) => {
    navigate(`/issuing-authority/${newAppId}`);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  const refreshData = () => {
    const refreshed = issuingAuthorityService.getRequests(activeApp.institution.aictePermanentId);
    setRequests(refreshed);
    setCounts(issuingAuthorityService.getDashboardCounts(activeApp.institution.aictePermanentId));
    if (inspectRequest) {
      const updatedInspect = refreshed.find((r) => r.id === inspectRequest.id);
      if (updatedInspect) setInspectRequest(updatedInspect);
    }
  };

  // Action: Create New Verification Request
  const handleCreateRequest = async (data: {
    institutionId: string;
    institutionName: string;
    applicationReference: string;
    applicationCategory: string;
    certificateType: string;
    certificateNumber: string;
    referenceNumber: string;
    issuingAuthority: string;
    issueDate: string;
    expiryDate?: string;
    verificationMethods: VerificationMethodType[];
    file: File;
    notes?: string;
  }) => {
    if (!currentUser) return;
    const newReq = await issuingAuthorityService.createRequest(data, currentUser);
    refreshData();
    showToast(`Verification Request '${newReq.id}' created and registered in statutory ledger.`);
  };

  // Action: Assign Reviewer
  const handleAssignOfficer = (
    requestId: string,
    officer: { id: string; name: string; role: string }
  ) => {
    if (!currentUser) return;
    issuingAuthorityService.assignOfficer(requestId, officer, currentUser);
    refreshData();
    showToast(`Case ${requestId} assigned to ${officer.name}.`);
  };

  const handleAssignToMe = (requestId: string) => {
    if (!currentUser) return;
    issuingAuthorityService.assignOfficer(
      requestId,
      { id: currentUser.id, name: currentUser.name, role: currentUser.authorizedRole },
      currentUser
    );
    refreshData();
    showToast(`Case ${requestId} assigned to you.`);
  };

  // Action: Add Review Note
  const handleAddReviewNote = (requestId: string, note: string) => {
    if (!currentUser) return;
    issuingAuthorityService.addReviewNote(requestId, note, currentUser);
    refreshData();
    showToast(`Note recorded on request ${requestId}.`);
  };

  // Action: Request Additional Documents
  const handleRequestAdditionalDocs = (requestId: string, docs: string[], reason: string) => {
    if (!currentUser) return;
    issuingAuthorityService.requestAdditionalDocuments(requestId, docs, reason, currentUser);
    refreshData();
    showToast(`Additional documents requested from institution.`);
  };

  // Action: Record Outcome
  const handleRecordOutcome = (
    requestId: string,
    outcome: ManualReviewOutcome,
    notes: string,
    evidence: string,
    sourceContacted: string
  ) => {
    if (!currentUser) return;
    const updatedReq = issuingAuthorityService.recordManualReviewOutcome(
      requestId,
      outcome,
      notes,
      evidence,
      sourceContacted,
      currentUser
    );

    // Synchronize verification outcome with Document Management vault
    if (updatedReq) {
      const appDocs = documentService.getDocuments(activeApp.id);
      const matchedDoc = appDocs.find(
        (d) =>
          d.id === updatedReq.certificateId ||
          d.originalFilename === updatedReq.fileName ||
          d.originalFilename.toLowerCase().includes(updatedReq.certificateType.toLowerCase().slice(0, 8))
      );
      if (matchedDoc) {
        let docStatus: 'Verified by Authorized Source' | 'Mismatch Detected' | 'Additional Documents Required' | 'Under Review' = 'Under Review';
        if (outcome === 'Confirmed Against Official Evidence') {
          docStatus = 'Verified by Authorized Source';
        } else if (outcome === 'Mismatch Confirmed') {
          docStatus = 'Mismatch Detected';
        } else if (outcome === 'Additional Documents Required') {
          docStatus = 'Additional Documents Required';
        }
        documentService.updateDocumentObservation(
          activeApp.id,
          matchedDoc.id,
          `Issuing Authority Verification (${updatedReq.id}): ${outcome}. Officer Notes: ${notes}`,
          currentUser,
          docStatus as any
        );
      }
    }

    refreshData();
    showToast(`Manual review outcome '${outcome}' persisted for case ${requestId}.`);
  };

  // Action: Mark for Investigation
  const handleMarkInvestigation = (requestId: string, reason: string) => {
    if (!currentUser) return;
    issuingAuthorityService.markForFurtherInvestigation(requestId, reason, currentUser);
    refreshData();
    showToast(`Case ${requestId} marked for further forensic investigation.`);
  };

  // Action: Correct OCR Field
  const handleCorrectOcrField = (requestId: string, fieldKey: string, newValue: string) => {
    if (!currentUser) return;
    issuingAuthorityService.correctOCRField(requestId, fieldKey, newValue, currentUser);
    refreshData();
    showToast(`OCR attribute '${fieldKey}' updated and logged in audit history.`);
  };

  // Action: Send to Manual Review from Method Workspaces
  const handleSendForManualReview = (reason: string, details?: string) => {
    if (!currentUser) return;
    showToast(`Case routed to Manual Scrutiny Queue: ${reason}${details ? ` (${details.slice(0, 40)}...)` : ''}.`);
    setActiveMethod('MANUAL_OFFICER');
  };

  // Action: Download CSV
  const handleDownloadCSV = () => {
    const csvContent = issuingAuthorityService.exportRequestsToCSV(activeApp.institution.aictePermanentId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AuthenX_${activeApp.institution.aictePermanentId}_Verification_Ledger.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Exported verification ledger to CSV.');
    setIsExportOpen(false);
  };

  // Route protection
  if (!currentUser) {
    return <RoleUnauthorizedState user={null} onLogout={handleLogout} />;
  }

  // Cross-tenant protection: Institution Admin can only access applications of their own institution
  if (currentUser.authorizedRole === 'INSTITUTION_ADMIN' && routeAppId && !applications.some(a => a.id === routeAppId)) {
    return (
      <RoleUnauthorizedState
        user={currentUser}
        onLogout={handleLogout}
        title="Institution Data Isolation Barrier"
        customMessage={`Access Denied: You are authenticated under '${currentUser.organization}'. You do not have permission to view or manipulate records for application '${routeAppId}'.`}
      />
    );
  }

  const pendingManualCount = requests.filter(
    (r) => 
      r.status === 'Manual Review Required' ||
      r.status === 'Under Manual Review' ||
      r.status === 'Additional Documents Required' ||
      r.status === 'Further Investigation Required'
  ).length;

  return (
    <div className="flex h-screen bg-[#F4F8FF] font-sans antialiased overflow-hidden text-slate-800">
      {/* 1. Left Sidebar Navigation */}
      <PortalSidebar
        activeSection={'issuing-authority' as any}
        onSelectSection={(sec) => {
          const isOfficer = currentUser?.authorizedRole !== 'INSTITUTION_ADMIN';
          if (sec === 'overview') {
            if (isOfficer) {
              navigate('/officer-dashboard');
            } else {
              navigate('/institution-portal');
            }
          } else if (sec === 'details' || sec === 'eoa' || sec === 'changes' || sec === 'courses' || sec === 'history') {
            navigate('/institution-portal');
          } else if (sec === 'documents') {
            navigate(`/documents/${activeApp.id}`);
          } else if (sec === 'validation') {
            navigate(`/ai-validation/${activeApp.id}`);
          } else if (sec === 'anomalies') {
            navigate(`/document-authentication/${activeApp.id}`);
          } else if (sec === 'issuing-authority') {
            navigate(`/issuing-authority/${activeApp.id}`);
          } else if (sec === 'compliance') {
            navigate(`/regulatory-compliance/${activeApp.id}`);
          } else if (sec === 'officer-dashboard') {
            navigate('/officer-dashboard');
          } else if (sec === 'human-review') {
            navigate(`/human-review/${activeApp.id}`);
          } else if (sec === 'alerts-audit') {
            navigate('/alerts-audit');
          } else if (sec === 'reports-analytics') {
            if (isOfficer) navigate('/reports-analytics');
            else navigate('/institution-portal?tab=reports-analytics');
          } else if (sec === 'rules-configuration') {
            navigate('/rules-configuration');
          } else if (sec === 'security-access') {
            navigate('/security-access');
          } else if (sec === 'final-review') {
            navigate(`/final-review/${activeApp.id}`);
          } else if (sec === 'notifications') {
            if (isOfficer) navigate('/alerts-audit');
            else navigate('/institution-portal?tab=notifications');
          } else if (sec === 'help') {
            if (isOfficer) navigate('/rules-configuration');
            else navigate('/institution-portal?tab=help');
          } else if (sec === 'settings') {
            if (isOfficer) navigate('/security-access');
            else navigate('/institution-portal?tab=settings');
          } else {
            navigate('/institution-portal');
          }
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Portal Scroll Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <PortalHeader
          user={currentUser}
          onLogout={handleLogout}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          activeSectionTitle="Issuing Authority Verification"
        />

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-20 right-6 z-50 bg-[#102B4E] text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-white/20 animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Section 1: Page Header with Application Context & Controls */}
          <IssuingAuthorityHeader
            application={activeApp}
            availableApplications={applications}
            onSelectApplication={handleSelectApplication}
            currentUser={currentUser}
            onNewRequest={() => setIsNewRequestOpen(true)}
            onExportReport={() => setIsExportOpen(true)}
            searchQuery={globalSearch}
            onSearchChange={setGlobalSearch}
            isDemoMode={true}
          />

          {/* Section 2: 5 Dynamic Dashboard Summary Cards */}
          <VerificationDashboardCards
            counts={counts}
            selectedFilter={selectedDashboardFilter}
            onSelectFilter={setSelectedDashboardFilter}
          />

          {/* Section 3: Choose Verification Method (4 Visible Channel Cards) */}
          <ChooseVerificationMethodSection
            activeMethod={activeMethod}
            onSelectMethod={setActiveMethod}
            pendingManualReviewCount={pendingManualCount}
          />

          {/* Section 4: Active Verification Method Workspace */}
          {activeMethod === 'QR_CODE' && (
            <QRCodeVerificationWorkspace
              currentUser={currentUser}
              onSendForManualReview={handleSendForManualReview}
              onVerificationComplete={(res) => {
                showToast(`QR Code decoded: ${res.decoded ? 'Valid matrix read' : 'Inconclusive'}.`);
              }}
            />
          )}

          {activeMethod === 'REFERENCE_NUMBER' && (
            <ReferenceNumberVerificationWorkspace
              application={activeApp}
              onSendForManualReview={handleSendForManualReview}
              onVerificationComplete={(res) => {
                showToast(`Reference lookup completed: ${res.status}.`);
              }}
            />
          )}

          {activeMethod === 'OFFICIAL_API' && (
            <OfficialApiPortalWorkspace
              application={activeApp}
              onSendForManualReview={handleSendForManualReview}
              onVerificationComplete={(res) => {
                showToast(`Official gateway query: ${res.connectionStatus}.`);
              }}
            />
          )}

          {activeMethod === 'MANUAL_OFFICER' && (
            <ManualReviewQueueSection
              requests={requests}
              currentUser={currentUser}
              onOpenDetails={(req, tab) => {
                setInspectRequest(req);
                setInspectTab(tab || 'manual-review');
              }}
              onAssignToMe={handleAssignToMe}
            />
          )}

          {/* Section 5: Verification Requests Master Data Grid */}
          <VerificationRequestsTable
            requests={requests}
            currentUser={currentUser}
            onOpenDetails={(req, tab) => {
              setInspectRequest(req);
              setInspectTab(tab || 'overview');
            }}
            onOpenComparison={(req) => setComparisonRequest(req)}
            onSendForManualReview={(req) => {
              setInspectRequest(req);
              setInspectTab('manual-review');
            }}
            externalStatusFilter={selectedDashboardFilter}
          />
        </main>
      </div>

      {/* MODAL 1: Inspector & Decision Modal */}
      {inspectRequest && (
        <VerificationDetailsModal
          request={inspectRequest}
          initialTab={inspectTab}
          currentUser={currentUser}
          onClose={() => setInspectRequest(null)}
          onAssignOfficer={handleAssignOfficer}
          onAddReviewNote={handleAddReviewNote}
          onRequestAdditionalDocs={handleRequestAdditionalDocs}
          onRecordOutcome={handleRecordOutcome}
          onMarkInvestigation={handleMarkInvestigation}
          onCorrectOcrField={handleCorrectOcrField}
        />
      )}

      {/* MODAL 2: New Request Modal */}
      {isNewRequestOpen && (
        <NewVerificationRequestModal
          application={activeApp}
          currentUser={currentUser}
          onClose={() => setIsNewRequestOpen(false)}
          onSubmit={handleCreateRequest}
        />
      )}

      {/* MODAL 3: Two-Column Field-by-Field Comparison Modal */}
      {comparisonRequest && (
        <FieldComparisonModal
          request={comparisonRequest}
          onClose={() => setComparisonRequest(null)}
        />
      )}

      {/* MODAL 4: Export Report Modal */}
      {isExportOpen && (
        <ExportReportModal
          requests={requests}
          counts={counts}
          currentUser={currentUser}
          onClose={() => setIsExportOpen(false)}
          onDownloadCSV={handleDownloadCSV}
        />
      )}
    </div>
  );
};
