import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  BarChart3, 
  Layers, 
  ShieldCheck, 
  FileCheck2, 
  Hourglass, 
  RefreshCw 
} from 'lucide-react';

import { authService } from '../services/authService';
import { reportsAnalyticsService } from '../services/reportsAnalyticsService';
import type { UserAccount } from '../types/auth';
import type { 
  ReportsDashboardMetrics, 
  ReportFilterOptions, 
  StatutoryReportType 
} from '../types/reportsAnalytics';

import { PortalSidebar, type PortalSection } from '../components/portal/PortalSidebar';
import { PortalHeader } from '../components/portal/PortalHeader';
import { RoleUnauthorizedState } from '../components/portal/RoleUnauthorizedState';

import { ReportsDashboardOverview } from '../components/reports/ReportsDashboardOverview';
import { SharedReportFilters } from '../components/reports/SharedReportFilters';
import { Report1ApplicationValidation } from '../components/reports/Report1ApplicationValidation';
import { Report2RegulatoryCompliance } from '../components/reports/Report2RegulatoryCompliance';
import { Report3DocumentVerification } from '../components/reports/Report3DocumentVerification';
import { Report4PendingActions } from '../components/reports/Report4PendingActions';
import { ReportPrintPreviewModal } from '../components/reports/ReportPrintPreviewModal';

export const ReportsAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { reportType } = useParams<{ reportType?: string }>();

  // Current User
  const [currentUser] = useState<UserAccount | null>(() => authService.getCurrentUser());

  // Layout State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<StatutoryReportType>(() => {
    if (reportType === 'application-validation') return 'APPLICATION_VALIDATION';
    if (reportType === 'compliance-summary') return 'REGULATORY_COMPLIANCE';
    if (reportType === 'document-verification') return 'DOCUMENT_VERIFICATION';
    if (reportType === 'pending-actions') return 'PENDING_ACTIONS';
    return 'OVERVIEW';
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters State
  const [filters, setFilters] = useState<ReportFilterOptions>({
    academicYear: '2026-27',
    applicationType: 'ALL',
    region: 'ALL',
    complianceStatus: 'ALL',
    searchQuery: ''
  });

  // Modal State for Printable View
  const [printModalConfig, setPrintModalConfig] = useState<{
    title: string;
    rows: Array<Record<string, string | number>>;
  } | null>(null);

  // Data State
  const [metrics, setMetrics] = useState<ReportsDashboardMetrics>(() =>
    reportsAnalyticsService.getDashboardMetrics()
  );

  const report1Data = useMemo(() => {
    return reportsAnalyticsService.getApplicationValidationReport(filters);
  }, [filters]);

  const report2Data = useMemo(() => {
    return reportsAnalyticsService.getRegulatoryComplianceReport(filters);
  }, [filters]);

  const report3Data = useMemo(() => {
    return reportsAnalyticsService.getDocumentVerificationReport(filters);
  }, [filters]);

  const report4Data = useMemo(() => {
    return reportsAnalyticsService.getPendingActionsReport(filters);
  }, [filters]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRefresh = () => {
    setMetrics(reportsAnalyticsService.getDashboardMetrics());
    showToast('Analytics and report metrics synchronized with live records.');
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

  // CSV Export Handler
  const handleExportCsv = (repType: StatutoryReportType) => {
    const csv = reportsAnalyticsService.exportReportToCsv(repType, filters);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AICTE_Report_${repType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded CSV for ${repType.replace(/_/g, ' ')} with anti-injection protection.`);
  };

  // Printable PDF Modal Triggers
  const handleOpenPrintPreview1 = () => {
    const rows = report1Data.map((d) => ({
      ApplicationID: d.applicationId,
      InstitutionName: d.institutionName,
      Region: d.region,
      Type: d.applicationType,
      VerifiedDocs: `${d.verifiedDocs}/${d.totalDocs}`,
      ComplianceScore: `${d.complianceScore}%`,
      Verdict: d.finalVerdict
    }));
    setPrintModalConfig({
      title: 'Report 1: Application-wise Scrutiny & Validation Status',
      rows
    });
  };

  const handleOpenPrintPreview2 = () => {
    const rows = report2Data.map((d) => ({
      Institution: d.institutionName,
      ApplicationID: d.applicationId,
      Category: d.category,
      Norm: d.requiredNorm,
      Deficit: d.deficitGap,
      ComplianceState: d.complianceState
    }));
    setPrintModalConfig({
      title: 'Report 2: Regulatory Compliance & Deficit Gap Summary',
      rows
    });
  };

  const handleOpenPrintPreview3 = () => {
    const rows = report3Data.map((d) => ({
      DocumentID: d.documentId,
      ApplicationID: d.applicationId,
      Type: d.documentType,
      QRResult: d.qrVerificationResult,
      DigitalSignature: d.digitalSignatureResult,
      Verdict: d.authenticityVerdict
    }));
    setPrintModalConfig({
      title: 'Report 3: Multi-Source Document Verification Outcomes',
      rows
    });
  };

  const handleOpenPrintPreview4 = () => {
    const rows = report4Data.map((d) => ({
      ApplicationID: d.applicationId,
      Institution: d.institutionName,
      PendingAction: d.pendingActionType,
      DaysOutstanding: d.daysOutstanding,
      DueDate: d.dueDate,
      Overdue: d.isOverdue ? 'YES' : 'NO',
      ResponsibleParty: d.responsibleParty
    }));
    setPrintModalConfig({
      title: 'Report 4: Pending-Action & Overdue Tracking Report',
      rows
    });
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
        activeSection="reports-analytics"
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
          activeSectionTitle="Statutory Reports & Analytics"
        />

        {/* Scrollable Page Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          {/* Header Title Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                  Statutory Intelligence Suite
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  AICTE Approval Process Handbook (APH) Reports & Exports
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#102B4E] tracking-tight">
                Reports & Regulatory Analytics
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Generate official statutory compliance summaries, analyze validation throughput, inspect multi-source document verifications, and download PDF or CSV audit reports.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-[#2563EB] hover:border-[#2563EB] shadow-sm transition-colors"
                title="Refresh Analytics Metrics"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Report Tab Navigation Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 text-xs font-bold border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('OVERVIEW')}
              className={`py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'OVERVIEW'
                  ? 'bg-[#102B4E] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Executive KPI Overview
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('APPLICATION_VALIDATION')}
              className={`py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'APPLICATION_VALIDATION'
                  ? 'bg-[#102B4E] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Report 1: Application Validation
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('REGULATORY_COMPLIANCE')}
              className={`py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'REGULATORY_COMPLIANCE'
                  ? 'bg-[#102B4E] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Report 2: Regulatory Compliance
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('DOCUMENT_VERIFICATION')}
              className={`py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'DOCUMENT_VERIFICATION'
                  ? 'bg-[#102B4E] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" /> Report 3: Document Verification
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('PENDING_ACTIONS')}
              className={`py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'PENDING_ACTIONS'
                  ? 'bg-[#102B4E] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Hourglass className="w-3.5 h-3.5" /> Report 4: Pending Actions
            </button>
          </div>

          {/* Universal Report Filters */}
          <SharedReportFilters
            filters={filters}
            onChange={(updated) => setFilters(updated)}
            onReset={() =>
              setFilters({
                academicYear: '2026-27',
                applicationType: 'ALL',
                region: 'ALL',
                complianceStatus: 'ALL',
                searchQuery: ''
              })
            }
          />

          {/* Active Tab View */}
          {activeTab === 'OVERVIEW' && (
            <ReportsDashboardOverview
              metrics={metrics}
              onNavigateToReport={(rep) => setActiveTab(rep as StatutoryReportType)}
            />
          )}

          {activeTab === 'APPLICATION_VALIDATION' && (
            <Report1ApplicationValidation
              items={report1Data}
              onExportCsv={() => handleExportCsv('APPLICATION_VALIDATION')}
              onOpenPrintPreview={handleOpenPrintPreview1}
            />
          )}

          {activeTab === 'REGULATORY_COMPLIANCE' && (
            <Report2RegulatoryCompliance
              items={report2Data}
              onExportCsv={() => handleExportCsv('REGULATORY_COMPLIANCE')}
              onOpenPrintPreview={handleOpenPrintPreview2}
            />
          )}

          {activeTab === 'DOCUMENT_VERIFICATION' && (
            <Report3DocumentVerification
              items={report3Data}
              onExportCsv={() => handleExportCsv('DOCUMENT_VERIFICATION')}
              onOpenPrintPreview={handleOpenPrintPreview3}
            />
          )}

          {activeTab === 'PENDING_ACTIONS' && (
            <Report4PendingActions
              items={report4Data}
              onExportCsv={() => handleExportCsv('PENDING_ACTIONS')}
              onOpenPrintPreview={handleOpenPrintPreview4}
            />
          )}
        </div>
      </div>

      {/* Print / PDF Modal */}
      {printModalConfig && (
        <ReportPrintPreviewModal
          reportType={activeTab}
          filters={filters}
          reportTitle={printModalConfig.title}
          reportDataRows={printModalConfig.rows}
          onClose={() => setPrintModalConfig(null)}
        />
      )}
    </div>
  );
};
