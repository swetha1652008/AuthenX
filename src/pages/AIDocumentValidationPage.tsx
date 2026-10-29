import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { institutionService } from '../services/institutionService';
import { documentService } from '../services/documentService';
import { validationService } from '../services/validationService';
import type { UserAccount } from '../types/auth';
import type { InstitutionApplication } from '../types/institution';
import type { ManagedDocument, ExtractedFieldItem, ValidationReport } from '../types/document';

import { PortalSidebar } from '../components/portal/PortalSidebar';
import { PortalHeader } from '../components/portal/PortalHeader';
import { RoleUnauthorizedState } from '../components/portal/RoleUnauthorizedState';

import { ValidationSummaryHeader } from '../components/validation/ValidationSummaryHeader';
import { ValidationDocumentQueue } from '../components/validation/ValidationDocumentQueue';
import { ValidationDocumentInspector } from '../components/validation/ValidationDocumentInspector';
import { ValidationIntelligencePanel } from '../components/validation/ValidationIntelligencePanel';
import { ValidationReportModal } from '../components/validation/ValidationReportModal';
import { FieldCorrectionModal } from '../components/validation/FieldCorrectionModal';

import { FileWarning, Upload } from 'lucide-react';

export const AIDocumentValidationPage: React.FC = () => {
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

  // Application Resolution
  const applications = institutionService.getApplications();
  const targetAppId =
    routeAppId || searchParams.get('appId') || applications[0]?.id || 'APP-2026-AICTE-8491';

  const [activeApp, setActiveApp] = useState<InstitutionApplication>(() => {
    return institutionService.getApplicationById(targetAppId) || applications[0];
  });

  // Document State
  const [documents, setDocuments] = useState<ManagedDocument[]>(() =>
    documentService.getDocuments(activeApp.id)
  );
  const [selectedDocId, setSelectedDocId] = useState<string>(() => documents[0]?.id || '');
  const [highlightedFieldKey, setHighlightedFieldKey] = useState<string | undefined>();

  // Modals
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [correctingField, setCorrectingField] = useState<ExtractedFieldItem | null>(null);

  // Sync state if targetAppId changes
  const [prevAppId, setPrevAppId] = useState(targetAppId);
  if (targetAppId !== prevAppId) {
    setPrevAppId(targetAppId);
    const found = institutionService.getApplicationById(targetAppId) || applications[0];
    if (found) {
      setActiveApp(found);
      const docs = documentService.getDocuments(found.id);
      setDocuments(docs);
      setSelectedDocId(docs[0]?.id || '');
    }
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  const selectedDocument: ManagedDocument | null =
    documents.find((d) => d.id === selectedDocId) || documents[0] || null;

  const activeReport: ValidationReport | null = selectedDocument
    ? validationService.getValidationReport(selectedDocument)
    : null;

  // Handlers
  const handleRetryProcessing = (docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;
    // Re-run validation report generation
    validationService.getValidationReport(doc);
    showToast(`Re-scanned and validated '${doc.originalFilename}'.`);
  };

  const handleFieldCorrectionSubmit = (fieldKey: string, newValue: string) => {
    if (!selectedDocument || !currentUser) return;
    const updatedReport = validationService.submitFieldCorrection(
      activeApp.id,
      selectedDocument.id,
      fieldKey,
      newValue,
      currentUser
    );
    if (updatedReport) {
      const refreshedDocs = documentService.getDocuments(activeApp.id);
      setDocuments(refreshedDocs);
      showToast(`Attribute '${fieldKey}' updated and logged to audit trail.`);
    }
  };

  const handleReviewDecisionSubmit = (
    decision: 'Approved' | 'Rejected' | 'Rectification Requested',
    notes: string
  ) => {
    if (!selectedDocument || !currentUser) return;
    const updated = validationService.recordReviewDecision(
      activeApp.id,
      selectedDocument.id,
      decision,
      notes,
      currentUser
    );
    if (updated) {
      const refreshedDocs = documentService.getDocuments(activeApp.id);
      setDocuments(refreshedDocs);
      showToast(`Decision '${decision}' recorded in statutory validation ledger.`);
    }
  };

  const handleDownloadReport = () => {
    if (activeReport) {
      validationService.downloadJsonReport(activeReport);
      showToast('Validation audit report downloaded as JSON.');
    }
  };

  const handleNavigateToPage4 = () => {
    navigate(`/documents/${activeApp.id}`);
  };

  const handleNavigateToPortal = () => {
    navigate('/institution-portal');
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

  return (
    <div className="flex h-screen bg-[#F4F8FF] font-sans antialiased overflow-hidden text-slate-800">
      {/* 1. Left Sidebar Navigation */}
      <PortalSidebar
        activeSection="validation"
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
          searchQuery=""
          onSearchChange={() => {}}
          activeSectionTitle="AI Document Validation"
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

          {/* 1. Page Summary Header Banner */}
          <ValidationSummaryHeader
            application={activeApp}
            documents={documents}
            onBackToPage4={handleNavigateToPage4}
            onBackToPortal={handleNavigateToPortal}
            onContinueToAnomalyDetection={() => navigate(`/anomaly-detection/${activeApp.id}`)}
          />

          {/* If No Documents are available */}
          {documents.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-[#CFE2FE] shadow-card text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <FileWarning className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  No documents are available for validation
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload the required statutory certificates in the Statutory Vault to begin AI validation.
                </p>
              </div>
              <button
                type="button"
                onClick={handleNavigateToPage4}
                className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Open Statutory Documents Vault</span>
              </button>
            </div>
          ) : (
            /* 2. Three-Panel Responsive Architecture */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Panel 1 (Left): Document Queue (3 cols on lg, 4 cols on xl) */}
              <div className="lg:col-span-4 xl:col-span-3 h-[720px]">
                <ValidationDocumentQueue
                  documents={documents}
                  selectedDocId={selectedDocId}
                  onSelectDoc={(id) => {
                    setSelectedDocId(id);
                    setHighlightedFieldKey(undefined);
                  }}
                  onNavigateToPage4={handleNavigateToPage4}
                  onRetryProcessing={handleRetryProcessing}
                />
              </div>

              {/* Panel 2 (Centre): Document Inspector (5 cols on lg, 5 cols on xl) */}
              <div className="lg:col-span-4 xl:col-span-5 h-[720px]">
                <ValidationDocumentInspector
                  document={selectedDocument}
                  activeFieldKey={highlightedFieldKey}
                />
              </div>

              {/* Panel 3 (Right): Validation Intelligence (4 cols on lg, 4 cols on xl) */}
              <div className="lg:col-span-4 xl:col-span-4 h-[720px]">
                <ValidationIntelligencePanel
                  document={selectedDocument}
                  report={activeReport}
                  currentUser={currentUser}
                  onOpenReportModal={() => setReportModalOpen(true)}
                  onDownloadReport={handleDownloadReport}
                  onOpenCorrectionModal={(fld) => setCorrectingField(fld)}
                  onSelectFieldHighlight={(key) => setHighlightedFieldKey(key)}
                  onSubmitReviewDecision={handleReviewDecisionSubmit}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Report Modal */}
      {reportModalOpen && activeReport && (
        <ValidationReportModal
          report={activeReport}
          onClose={() => setReportModalOpen(false)}
          onDownload={handleDownloadReport}
        />
      )}

      {/* Field Correction Modal */}
      {correctingField && (
        <FieldCorrectionModal
          field={correctingField}
          onClose={() => setCorrectingField(null)}
          onSubmitCorrection={handleFieldCorrectionSubmit}
        />
      )}
    </div>
  );
};
