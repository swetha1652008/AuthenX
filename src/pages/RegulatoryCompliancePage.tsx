import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { institutionService } from '../services/institutionService';
import { complianceService } from '../services/complianceService';
import type { UserAccount } from '../types/auth';
import type { InstitutionApplication } from '../types/institution';
import type { 
  ComplianceAssessment, 
  ComplianceChecklistItem, 
  InfrastructureEvidence, 
  ComplianceFinding, 
  ComplianceRule,
  OfficerAssessmentResult,
  EvidenceRequest,
  InspectionRecommendation
} from '../types/compliance';

import { PortalSidebar, type PortalSection } from '../components/portal/PortalSidebar';
import { PortalHeader } from '../components/portal/PortalHeader';
import { RoleUnauthorizedState } from '../components/portal/RoleUnauthorizedState';

import { ComplianceHeader } from '../components/compliance/ComplianceHeader';
import { ComplianceOverviewCards, type ComplianceFilterType } from '../components/compliance/ComplianceOverviewCards';
import { RuleEngineChecklistSection } from '../components/compliance/RuleEngineChecklistSection';
import { InfrastructureEvidenceRepository } from '../components/compliance/InfrastructureEvidenceRepository';
import { ComplianceGapAnalysisSection } from '../components/compliance/ComplianceGapAnalysisSection';

import { PhotoReviewWorkspace } from '../components/compliance/PhotoReviewWorkspace';
import { VideoReviewWorkspace } from '../components/compliance/VideoReviewWorkspace';
import { FloorPlanReviewWorkspace } from '../components/compliance/FloorPlanReviewWorkspace';
import { EvidenceComparisonWorkspace } from '../components/compliance/EvidenceComparisonWorkspace';
import { EvidenceRequestModal } from '../components/compliance/EvidenceRequestModal';
import { InspectionRecommendationModal } from '../components/compliance/InspectionRecommendationModal';
import { OfficerAssessmentModal } from '../components/compliance/OfficerAssessmentModal';
import { RuleManagementModal } from '../components/compliance/RuleManagementModal';
import { ComplianceAuditTrailModal } from '../components/compliance/ComplianceAuditTrailModal';

export const RegulatoryCompliancePage: React.FC = () => {
  const navigate = useNavigate();
  const { appId: routeAppId } = useParams();
  const [searchParams] = useSearchParams();

  // Authentication State
  const [currentUser] = useState<UserAccount | null>(() =>
    authService.getCurrentUser()
  );

  // Layout State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Applications Data
  const applications = institutionService.getApplications();
  const currentTargetId = routeAppId || searchParams.get('appId') || applications[0]?.id || 'APP-2026-AICTE-8491';
  const initialApp = institutionService.getApplicationById(currentTargetId) || applications[0];

  const [activeApp, setActiveApp] = useState<InstitutionApplication>(() => initialApp);

  // Compliance State
  const [assessment, setAssessment] = useState<ComplianceAssessment>(() => {
    const appId = initialApp?.id || 'APP-2026-AICTE-8491';
    return complianceService.getAssessmentByAppId(appId) || complianceService.initializeAssessmentForApplication(appId);
  });

  const [rules, setRules] = useState<ComplianceRule[]>(() =>
    complianceService.getRules()
  );

  const [counts, setCounts] = useState(() =>
    complianceService.getDashboardCounts(initialApp?.institutionId || '1-938210941')
  );

  useEffect(() => {
    const desiredId = routeAppId || searchParams.get('appId');
    if (desiredId && desiredId !== activeApp?.id) {
      const found = institutionService.getApplicationById(desiredId);
      if (found) {
        setActiveApp(found);
        const newAsm = complianceService.getAssessmentByAppId(found.id) || complianceService.initializeAssessmentForApplication(found.id);
        setAssessment(newAsm);
        setCounts(complianceService.getDashboardCounts(found.institutionId));
      }
    }
  }, [routeAppId, searchParams, activeApp?.id]);

  const [selectedDashboardFilter, setSelectedDashboardFilter] = useState<ComplianceFilterType>('ALL');
  const [globalSearch, setGlobalSearch] = useState('');

  // Modals state
  const [photoInspectEvidence, setPhotoInspectEvidence] = useState<InfrastructureEvidence | null>(null);
  const [videoInspectEvidence, setVideoInspectEvidence] = useState<InfrastructureEvidence | null>(null);
  const [floorPlanInspectEvidence, setFloorPlanInspectEvidence] = useState<InfrastructureEvidence | null>(null);
  const [comparisonItem, setComparisonItem] = useState<ComplianceChecklistItem | null>(null);
  const [assessItem, setAssessItem] = useState<ComplianceChecklistItem | null>(null);
  const [evidenceRequestTarget, setEvidenceRequestTarget] = useState<{
    item?: ComplianceChecklistItem;
    finding?: ComplianceFinding;
  } | null>(null);
  const [inspectionTarget, setInspectionTarget] = useState<{
    item?: ComplianceChecklistItem;
    finding?: ComplianceFinding;
  } | null>(null);
  const [showRuleConfigModal, setShowRuleConfigModal] = useState(false);
  const [showAuditTrailModal, setShowAuditTrailModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSelectApplication = (app: InstitutionApplication) => {
    setActiveApp(app);
    navigate(`/regulatory-compliance/${app.id}`, { replace: true });
    const newAsm = complianceService.getAssessmentByAppId(app.id) || complianceService.initializeAssessmentForApplication(app.id);
    setAssessment(newAsm);
    setCounts(complianceService.getDashboardCounts(app.institutionId));
  };

  // Applicable rules for this application's category
  const applicableRules = complianceService.getApplicableRules(
    assessment.applicationCategory,
    assessment.academicYear
  );

  // Evidence Actions
  const handleUploadEvidence = (
    data: Omit<InfrastructureEvidence, 'id' | 'assessmentId' | 'submittedAt' | 'versionNumber'>
  ) => {
    complianceService.uploadEvidence(activeApp.id, data, currentUser?.name);
    const updated = complianceService.getAssessmentByAppId(activeApp.id)!;
    setAssessment(updated);
    setCounts(complianceService.getDashboardCounts(activeApp.institutionId));
    showToast(`Evidence "${data.title}" uploaded and queued for scrutiny analysis.`);
  };

  const handleReplaceEvidence = (
    evidenceId: string,
    newFile: {
      title: string;
      storagePath: string;
      fileType: string;
      fileSizeBytes: number;
      fileSize: string;
      fileHash: string;
    }
  ) => {
    complianceService.replaceEvidence(activeApp.id, evidenceId, newFile, currentUser?.name);
    const updated = complianceService.getAssessmentByAppId(activeApp.id)!;
    setAssessment(updated);
    setCounts(complianceService.getDashboardCounts(activeApp.institutionId));
    showToast(`Evidence replaced with version ${newFile.title}. Prior version archived.`);
  };

  const handlePreviewEvidence = (ev: InfrastructureEvidence) => {
    if (ev.evidenceCategory.includes('VIDEO')) {
      setVideoInspectEvidence(ev);
    } else if (ev.evidenceCategory.includes('PLAN')) {
      setFloorPlanInspectEvidence(ev);
    } else {
      setPhotoInspectEvidence(ev);
    }
  };

  // Officer Determination
  const handleSaveAssessment = (itemId: string, outcome: OfficerAssessmentResult, notes: string) => {
    complianceService.recordOfficerAssessment(activeApp.id, itemId, outcome, notes, currentUser?.name);
    const updated = complianceService.getAssessmentByAppId(activeApp.id)!;
    setAssessment(updated);
    setCounts(complianceService.getDashboardCounts(activeApp.institutionId));
    showToast(`Recorded official determination: ${outcome}.`);
  };

  const handleSendEvidenceRequest = (
    reqData: Omit<EvidenceRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ) => {
    complianceService.sendEvidenceRequest(activeApp.id, reqData, currentUser?.name);
    const updated = complianceService.getAssessmentByAppId(activeApp.id)!;
    setAssessment(updated);
    setCounts(complianceService.getDashboardCounts(activeApp.institutionId));
    showToast('Additional Evidence Request transmitted to technical institution.');
  };

  const handleRecommendInspection = (
    recData: Omit<InspectionRecommendation, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    complianceService.recommendInspection(activeApp.id, recData, currentUser?.name);
    const updated = complianceService.getAssessmentByAppId(activeApp.id)!;
    setAssessment(updated);
    setCounts(complianceService.getDashboardCounts(activeApp.institutionId));
    showToast('Physical on-site inspection recommended to Scrutiny Committee.');
  };

  const handleResolveFinding = (findingId: string) => {
    complianceService.resolveFinding(activeApp.id, findingId, 'Verified and closed by officer review.', currentUser?.name);
    const updated = complianceService.getAssessmentByAppId(activeApp.id)!;
    setAssessment(updated);
    setCounts(complianceService.getDashboardCounts(activeApp.institutionId));
    showToast('Compliance gap marked resolved.');
  };

  // Rule Config
  const handleSaveRule = (rule: ComplianceRule) => {
    complianceService.saveRule(rule, currentUser?.name);
    setRules(complianceService.getRules());
    showToast(`Rule ${rule.requirementCode} saved and version updated.`);
  };

  const handleDuplicateRule = (ruleId: string) => {
    const duplicated = complianceService.duplicateRule(ruleId, currentUser?.name);
    if (duplicated) {
      setRules(complianceService.getRules());
      showToast(`Rule duplicated as ${duplicated.requirementCode}.`);
    }
  };

  const handleToggleRuleActive = (ruleId: string, active: boolean) => {
    complianceService.toggleRuleActive(ruleId, active, currentUser?.name);
    setRules(complianceService.getRules());
    showToast(active ? 'Rule activated in production checklist.' : 'Rule deactivated.');
  };

  // CSV Export
  const handleExportCSV = () => {
    const csv = complianceService.exportComplianceToCSV(activeApp.id);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AuthenX_Compliance_Assessment_${activeApp.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Compliance checklist exported as CSV.');
  };

  // Navigation handlers
  const handleSelectSidebarSection = (section: PortalSection) => {
    const appId = activeApp?.id || 'APP-2026-AICTE-8491';
    const isOfficer = currentUser?.authorizedRole !== 'INSTITUTION_ADMIN';
    if (section === 'overview') {
      if (isOfficer) navigate('/officer-dashboard');
      else navigate('/institution-portal');
    }
    else if (section === 'documents') navigate(`/documents/${appId}`);
    else if (section === 'validation') navigate(`/ai-validation/${appId}`);
    else if (section === 'anomalies') navigate(`/document-authentication/${appId}`);
    else if (section === 'issuing-authority') navigate(`/issuing-authority/${appId}`);
    else if (section === 'compliance') navigate(`/regulatory-compliance/${appId}`);
    else if (section === 'officer-dashboard') navigate('/officer-dashboard');
    else if (section === 'human-review') navigate(`/human-review/${appId}`);
    else if (section === 'alerts-audit') navigate('/alerts-audit');
    else if (section === 'reports-analytics') {
      if (isOfficer) navigate('/reports-analytics');
      else navigate('/institution-portal?tab=reports-analytics');
    }
    else if (section === 'rules-configuration') navigate('/rules-configuration');
    else if (section === 'security-access') navigate('/security-access');
    else if (section === 'final-review') navigate(`/final-review/${appId}`);
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

  // If user is not authenticated
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

  // Cross-tenant protection: Institution Admin can only access applications of their own institution
  if (currentUser.authorizedRole === 'INSTITUTION_ADMIN' && routeAppId && !applications.some(a => a.id === routeAppId)) {
    return (
      <RoleUnauthorizedState
        user={currentUser}
        onLogout={() => {
          authService.logout();
          navigate('/login');
        }}
        title="Institution Data Isolation Barrier"
        customMessage={`Access Denied: You are authenticated under '${currentUser.organization}'. You do not have permission to view or manipulate records for application '${routeAppId}'.`}
      />
    );
  }

  // If user role is not authorized
  const isAuthorized =
    currentUser.authorizedRole === 'COMPLIANCE_OFFICER' ||
    currentUser.authorizedRole === 'REGULATORY_ADMIN' ||
    currentUser.authorizedRole === 'INSTITUTION_ADMIN' ||
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
        activeSection="compliance"
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
          activeSectionTitle="Regulatory & Infrastructure Compliance"
        />

        {/* Scrollable Page Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Header Strip */}
          <ComplianceHeader
            applications={applications}
            activeApplication={activeApp}
            onSelectApplication={handleSelectApplication}
            assessment={assessment}
            searchQuery={globalSearch}
            onSearchChange={setGlobalSearch}
            onOpenUploadModal={() => {
              const el = document.getElementById('evidence-repository');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenRuleConfigModal={() => setShowRuleConfigModal(true)}
            onExportReport={handleExportCSV}
            isDemoMode={true}
          />

          <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
            {/* 6 Dynamic Overview KPI Cards */}
            <ComplianceOverviewCards
              counts={counts}
              selectedFilter={selectedDashboardFilter}
              onSelectFilter={setSelectedDashboardFilter}
            />

            {/* Checklist Section with Rules Engine Flow */}
            {(selectedDashboardFilter === 'ALL' || selectedDashboardFilter === 'REQUIREMENTS') && (
              <RuleEngineChecklistSection
                assessment={assessment}
                applicableRules={applicableRules}
                onOpenAssessModal={(item) => setAssessItem(item)}
                onOpenEvidenceRequestModal={(item) => setEvidenceRequestTarget({ item })}
                onOpenEvidencePreview={(evId) => {
                  const ev = assessment.evidence.find((e) => e.id === evId);
                  if (ev) handlePreviewEvidence(ev);
                }}
                onOpenComparison={(item) => setComparisonItem(item)}
              />
            )}

            {/* Infrastructure Evidence Repository */}
            {(selectedDashboardFilter === 'ALL' || selectedDashboardFilter === 'EVIDENCE') && (
              <div id="evidence-repository">
                <InfrastructureEvidenceRepository
                  evidenceList={assessment.evidence}
                  rules={applicableRules}
                  onUploadEvidence={handleUploadEvidence}
                  onReplaceEvidence={handleReplaceEvidence}
                  onPreviewEvidence={handlePreviewEvidence}
                />
              </div>
            )}

            {/* Compliance Gap Analysis Dashboard */}
            {(selectedDashboardFilter === 'ALL' || selectedDashboardFilter === 'GAPS') && (
              <ComplianceGapAnalysisSection
                assessment={assessment}
                onOpenChecklistItem={(itemId) => {
                  const itm = assessment.items.find((i) => i.id === itemId);
                  if (itm) setAssessItem(itm);
                }}
                onRequestEvidenceForFinding={(fnd) => setEvidenceRequestTarget({ finding: fnd })}
                onRecommendInspection={(fnd) => setInspectionTarget({ finding: fnd })}
                onResolveFinding={handleResolveFinding}
              />
            )}

            {/* Audit Trail Quick Trigger */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="font-bold text-[#102B4E] block">Immutable Compliance Assessment Audit History</span>
                <span className="text-slate-500">Track all rule adjustments, evidence version replacements, and officer findings.</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAuditTrailModal(true)}
                className="px-3.5 py-2 font-semibold text-[#2563EB] bg-[#EAF2FF] hover:bg-[#D8E8FF] rounded-lg transition"
              >
                View Complete Audit Trail ({assessment.auditLogs.length} events)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {photoInspectEvidence && (
        <PhotoReviewWorkspace
          evidence={photoInspectEvidence}
          rule={rules.find((r) => r.id === photoInspectEvidence.linkedRequirementId)}
          onClose={() => setPhotoInspectEvidence(null)}
          onConfirmOutcome={(evId, outcome, _notes) => {
            const ev = assessment.evidence.find((e) => e.id === evId);
            if (ev) {
              ev.reviewStatus = outcome;
              complianceService.saveAssessment(assessment);
              setAssessment({ ...assessment });
              setCounts(complianceService.getDashboardCounts(activeApp.institutionId));
              showToast(`Photo review marked: ${outcome}.`);
            }
            setPhotoInspectEvidence(null);
          }}
        />
      )}

      {videoInspectEvidence && (
        <VideoReviewWorkspace
          evidence={videoInspectEvidence}
          rule={rules.find((r) => r.id === videoInspectEvidence.linkedRequirementId)}
          onClose={() => setVideoInspectEvidence(null)}
          onConfirmOutcome={(evId, outcome, _notes) => {
            const ev = assessment.evidence.find((e) => e.id === evId);
            if (ev) {
              ev.reviewStatus = outcome;
              complianceService.saveAssessment(assessment);
              setAssessment({ ...assessment });
              setCounts(complianceService.getDashboardCounts(activeApp.institutionId));
              showToast(`Video review marked: ${outcome}.`);
            }
            setVideoInspectEvidence(null);
          }}
        />
      )}

      {floorPlanInspectEvidence && (
        <FloorPlanReviewWorkspace
          evidence={floorPlanInspectEvidence}
          rule={rules.find((r) => r.id === floorPlanInspectEvidence.linkedRequirementId)}
          onClose={() => setFloorPlanInspectEvidence(null)}
          onConfirmOutcome={(evId, outcome, _notes) => {
            const ev = assessment.evidence.find((e) => e.id === evId);
            if (ev) {
              ev.reviewStatus = outcome;
              complianceService.saveAssessment(assessment);
              setAssessment({ ...assessment });
              setCounts(complianceService.getDashboardCounts(activeApp.institutionId));
              showToast(`Floor-plan review marked: ${outcome}.`);
            }
            setFloorPlanInspectEvidence(null);
          }}
        />
      )}

      {comparisonItem && (
        <EvidenceComparisonWorkspace
          checklistItem={comparisonItem}
          assessment={assessment}
          onClose={() => setComparisonItem(null)}
          onRecordDecision={(outcome, notes) => {
            handleSaveAssessment(comparisonItem.id, outcome, notes);
            setComparisonItem(null);
          }}
        />
      )}

      {assessItem && (
        <OfficerAssessmentModal
          item={assessItem}
          assessment={assessment}
          onClose={() => setAssessItem(null)}
          onSaveAssessment={handleSaveAssessment}
        />
      )}

      {evidenceRequestTarget && (
        <EvidenceRequestModal
          checklistItem={evidenceRequestTarget.item}
          finding={evidenceRequestTarget.finding}
          applicationReference={activeApp.id}
          onClose={() => setEvidenceRequestTarget(null)}
          onSendRequest={handleSendEvidenceRequest}
        />
      )}

      {inspectionTarget && (
        <InspectionRecommendationModal
          checklistItem={inspectionTarget.item}
          finding={inspectionTarget.finding}
          applicationReference={activeApp.id}
          institutionName={activeApp.institution.name}
          onClose={() => setInspectionTarget(null)}
          onRecommendInspection={handleRecommendInspection}
        />
      )}

      {showRuleConfigModal && (
        <RuleManagementModal
          rules={rules}
          onClose={() => setShowRuleConfigModal(false)}
          onSaveRule={handleSaveRule}
          onDuplicateRule={handleDuplicateRule}
          onToggleRuleActive={handleToggleRuleActive}
        />
      )}

      {showAuditTrailModal && (
        <ComplianceAuditTrailModal
          logs={assessment.auditLogs}
          applicationReference={activeApp.id}
          onClose={() => setShowAuditTrailModal(false)}
        />
      )}
    </div>
  );
};
