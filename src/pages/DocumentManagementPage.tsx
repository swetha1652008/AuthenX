import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { institutionService } from '../services/institutionService';
import { documentService } from '../services/documentService';
import type { UserAccount } from '../types/auth';
import type { InstitutionApplication } from '../types/institution';
import type { ManagedDocument, DocumentCategory } from '../types/document';

import { PortalSidebar } from '../components/portal/PortalSidebar';
import { PortalHeader } from '../components/portal/PortalHeader';
import { RoleUnauthorizedState } from '../components/portal/RoleUnauthorizedState';

import { DocumentHeader } from '../components/documents/DocumentHeader';
import { DocumentSummaryCards } from '../components/documents/DocumentSummaryCards';
import { DocumentUploadZone } from '../components/documents/DocumentUploadZone';
import { DocumentChecklist } from '../components/documents/DocumentChecklist';
import { DocumentTable } from '../components/documents/DocumentTable';
import { DocumentPreviewModal } from '../components/documents/DocumentPreviewModal';
import { DocumentFooterActions } from '../components/documents/DocumentFooterActions';

export const DocumentManagementPage: React.FC = () => {
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

  // Document State
  const [documents, setDocuments] = useState<ManagedDocument[]>(() =>
    documentService.getDocuments(activeApp.id)
  );
  const [counts, setCounts] = useState(() => documentService.getDashboardCounts(activeApp.id));
  const [checklist, setChecklist] = useState(() => documentService.getChecklist(activeApp.id));
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [preselectedCategory, setPreselectedCategory] = useState<DocumentCategory | undefined>();

  // Preview & Modal State
  const [previewDoc, setPreviewDoc] = useState<ManagedDocument | null>(null);
  const [previewTab, setPreviewTab] = useState<'preview' | 'ocr' | 'values' | 'anomalies' | 'verification'>('preview');

  // Hidden file input for Replace action
  const [replaceTargetDoc, setReplaceTargetDoc] = useState<ManagedDocument | null>(null);
  const replaceInputRef = React.useRef<HTMLInputElement>(null);

  // Sync state when application changes
  const [prevAppId, setPrevAppId] = useState(targetAppId);
  if (targetAppId !== prevAppId) {
    setPrevAppId(targetAppId);
    const found = institutionService.getApplicationById(targetAppId) || applications[0];
    if (found) {
      setActiveApp(found);
      const docs = documentService.getDocuments(found.id);
      setDocuments(docs);
      setCounts(documentService.getDashboardCounts(found.id));
      setChecklist(documentService.getChecklist(found.id));
    }
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSelectApplication = (newAppId: string) => {
    navigate(`/documents/${newAppId}`);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  // Upload handler
  const handleUploadFile = async (
    file: File,
    category: DocumentCategory
  ): Promise<{ success: boolean; document?: ManagedDocument; error?: string }> => {
    if (!currentUser) return { success: false, error: 'User is not authenticated' };

    const res = await documentService.uploadDocument(
      activeApp.id,
      activeApp.institutionId,
      file,
      category,
      currentUser
    );

    if (res.success && res.document) {
      const refreshedDocs = documentService.getDocuments(activeApp.id);
      setDocuments(refreshedDocs);
      setCounts(documentService.getDashboardCounts(activeApp.id));
      setChecklist(documentService.getChecklist(activeApp.id));
      const statusNote = res.document.verificationStatus === 'Needs Manual Review' 
        ? 'Flagged with anomalies — Needs Manual Review' 
        : `Status: ${res.document.verificationStatus}`;
      showToast(`Document '${file.name}' uploaded. ${statusNote}`);
      return { success: true, document: res.document };
    } else {
      return { success: false, error: res.error || 'Failed to upload document' };
    }
  };

  // Trigger replace dialog
  const handleTriggerReplace = (doc: ManagedDocument) => {
    setReplaceTargetDoc(doc);
    if (replaceInputRef.current) {
      replaceInputRef.current.value = '';
      replaceInputRef.current.click();
    }
  };

  const handleExecuteReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!replaceTargetDoc || !e.target.files || !e.target.files[0] || !currentUser) return;
    const file = e.target.files[0];

    const res = await documentService.replaceDocument(
      activeApp.id,
      replaceTargetDoc.id,
      file,
      currentUser
    );

    if (res.success && res.document) {
      const refreshedDocs = documentService.getDocuments(activeApp.id);
      setDocuments(refreshedDocs);
      setCounts(documentService.getDashboardCounts(activeApp.id));
      setChecklist(documentService.getChecklist(activeApp.id));
      showToast(`Replaced '${replaceTargetDoc.originalFilename}' with '${file.name}'.`);
    } else {
      showToast(res.error || 'Replacement failed.');
    }
    setReplaceTargetDoc(null);
  };

  // Delete handler
  const handleDeleteDocument = (docId: string) => {
    if (!currentUser) return;
    const ok = documentService.deleteDocument(activeApp.id, docId, currentUser);
    if (ok) {
      const refreshedDocs = documentService.getDocuments(activeApp.id);
      setDocuments(refreshedDocs);
      setCounts(documentService.getDashboardCounts(activeApp.id));
      setChecklist(documentService.getChecklist(activeApp.id));
      showToast('Document removed from statutory application vault.');
    }
  };

  // Download handler
  const handleDownloadDocument = (doc: ManagedDocument) => {
    const textBlob = new Blob(
      [
        `========================================================================\n` +
        `AUTHENX STATUTORY DOCUMENT ARCHIVE RECORD\n` +
        `========================================================================\n` +
        `DOCUMENT ID:       ${doc.id}\n` +
        `APPLICATION ID:    ${doc.applicationId}\n` +
        `INSTITUTION ID:    ${doc.institutionId}\n` +
        `ORIGINAL FILENAME: ${doc.originalFilename}\n` +
        `CATEGORY:          ${doc.documentCategory}\n` +
        `FILE SIZE:         ${doc.fileSize}\n` +
        `MIME TYPE:         ${doc.mimeType}\n` +
        `UPLOAD DATE:       ${doc.uploadDate} ${doc.uploadTime}\n` +
        `UPLOADING USER:    ${doc.uploadingUserName} (${doc.uploadingUserId})\n` +
        `EXPIRY DATE:       ${doc.expiryDate || 'N/A'}\n` +
        `SHA-256 HASH:      ${doc.sha256Hash}\n` +
        `OCR STATUS:        ${doc.ocrStatus}\n` +
        `VERIFICATION:      ${doc.verificationStatus}\n` +
        `========================================================================\n\n` +
        `EXTRACTED OCR CONTENT:\n` +
        `${doc.extractedText || 'No text extracted.'}\n`
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(textBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AuthenX_${doc.originalFilename.replace(/\.[^/.]+$/, '')}_Archive.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Initiated download for ${doc.originalFilename}`);
  };

  // Validate documents handler
  const handleValidateDocuments = () => {
    const refreshedDocs = documentService.getDocuments(activeApp.id);
    setDocuments(refreshedDocs);
    setCounts(documentService.getDashboardCounts(activeApp.id));
    setChecklist(documentService.getChecklist(activeApp.id));
    showToast(`Validated ${refreshedDocs.length} documents. Check findings and checklist below.`);
  };

  // Navigation handlers
  const handleContinueToValidation = () => {
    navigate(`/ai-validation/${activeApp.id}`);
  };

  const handleBackToPortal = () => {
    if (currentUser?.authorizedRole === 'COMPLIANCE_OFFICER' || currentUser?.authorizedRole === 'REGULATORY_ADMIN') {
      navigate('/officer-dashboard');
    } else if (currentUser?.authorizedRole === 'DOCUMENT_VERIFICATION_OFFICER') {
      navigate('/issuing-authority');
    } else {
      navigate('/institution-portal');
    }
  };

  // Protected route check: requires authenticated session
  if (!currentUser) {
    return (
      <RoleUnauthorizedState
        user={null}
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

  const isOfficerUser = currentUser.authorizedRole !== 'INSTITUTION_ADMIN';

  return (
    <div className="flex h-screen bg-[#F4F8FF] font-sans antialiased overflow-hidden text-slate-800">
      {/* Hidden input for replace file */}
      <input
        ref={replaceInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/png,image/jpeg"
        onChange={handleExecuteReplace}
        className="hidden"
      />

      {/* 1. Left Sidebar Navigation */}
      <PortalSidebar
        activeSection="documents"
        onSelectSection={(sec) => {
          if (sec === 'overview') {
            if (isOfficerUser) {
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
            navigate(`/anomaly-detection/${activeApp.id}`);
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
            if (isOfficerUser) navigate('/reports-analytics');
            else navigate('/institution-portal?tab=reports-analytics');
          } else if (sec === 'rules-configuration') {
            navigate('/rules-configuration');
          } else if (sec === 'security-access') {
            navigate('/security-access');
          } else if (sec === 'final-review') {
            navigate(`/final-review/${activeApp.id}`);
          } else if (sec === 'notifications') {
            if (isOfficerUser) navigate('/alerts-audit');
            else navigate('/institution-portal?tab=notifications');
          } else if (sec === 'help') {
            if (isOfficerUser) navigate('/rules-configuration');
            else navigate('/institution-portal?tab=help');
          } else if (sec === 'settings') {
            if (isOfficerUser) navigate('/security-access');
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
          activeSectionTitle="Document Upload & Management"
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

          {/* 1. Header with Application Context & Switcher */}
          <DocumentHeader
            application={activeApp}
            currentUser={currentUser}
            onBackToPortal={handleBackToPortal}
            availableApplications={applications}
            onSelectApplication={handleSelectApplication}
          />

          {/* 2. 6 Summary Metric Cards */}
          <DocumentSummaryCards
            counts={counts}
            selectedFilter={selectedFilter}
            onSelectFilter={setSelectedFilter}
          />

          {/* 3. Real Ingestion Zone (Drag & Drop + Category Selector) */}
          <DocumentUploadZone
            onUploadFile={handleUploadFile}
            preselectedCategory={preselectedCategory}
            onClearPreselectedCategory={() => setPreselectedCategory(undefined)}
          />

          {/* 4. AICTE 10-Category Completeness Checklist */}
          <DocumentChecklist
            checklist={checklist}
            onUploadCategory={(cat) => {
              setPreselectedCategory(cat);
              window.scrollTo({ top: 220, behavior: 'smooth' });
            }}
          />

          {/* 5. Document Management Data Grid */}
          <DocumentTable
            documents={documents}
            onPreview={(doc, tab) => {
              setPreviewDoc(doc);
              setPreviewTab(tab || 'preview');
            }}
            onDownload={handleDownloadDocument}
            onReplace={handleTriggerReplace}
            onDelete={handleDeleteDocument}
            externalFilter={selectedFilter}
          />

          {/* 6. Bottom Sticky Actions */}
          <DocumentFooterActions
            onBackToApplication={handleBackToPortal}
            onSaveProgress={() => showToast('All document changes and metadata persisted to local database.')}
            onValidateDocuments={handleValidateDocuments}
            onContinueToValidation={handleContinueToValidation}
          />
        </main>
      </div>

      {/* Document Inspector Modal */}
      {previewDoc && (
        <DocumentPreviewModal
          document={previewDoc}
          initialTab={previewTab}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </div>
  );
};
