import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  Lock,
  ArrowRight,
  BarChart3,
  FileText,
  Download
} from 'lucide-react';
import { authService } from '../services/authService';
import { institutionService } from '../services/institutionService';
import type { UserAccount } from '../types/auth';
import type { 
  InstitutionApplication, 
  ApplicationType, 
  ChangeCategory 
} from '../types/institution';

import { PortalSidebar } from '../components/portal/PortalSidebar';
import type { PortalSection } from '../components/portal/PortalSidebar';
import { PortalHeader } from '../components/portal/PortalHeader';
import { PortalSummaryCards } from '../components/portal/PortalSummaryCards';
import { ApplicationTypeCards } from '../components/portal/ApplicationTypeCards';
import { ApplicationHistoryTable } from '../components/portal/ApplicationHistoryTable';
import { ApplicationDetailModal } from '../components/portal/ApplicationDetailModal';
import { ApplicationWizardModal } from '../components/portal/ApplicationWizardModal';
import { RoleUnauthorizedState } from '../components/portal/RoleUnauthorizedState';

export const InstitutionPortalPage: React.FC = () => {
  const navigate = useNavigate();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() =>
    authService.getCurrentUser()
  );

  const currentInstitution = institutionService.getInstitutionDetails(currentUser?.institutionId);

  // Portal Navigation & Layout State
  const [searchParams] = useSearchParams();
  const initialSection = (searchParams.get('tab') as PortalSection) || 'overview';
  const [activeSection, setActiveSection] = useState<PortalSection>(initialSection);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as PortalSection;
    if (tabParam) {
      setActiveSection(tabParam);
    }
  }, [searchParams]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [summaryFilter, setSummaryFilter] = useState('ALL');

  // Application Data & Modals State
  const [applications, setApplications] = useState<InstitutionApplication[]>(() =>
    institutionService.getApplications()
  );
  const [selectedAppForDetails, setSelectedAppForDetails] = useState<InstitutionApplication | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardInitialApp, setWizardInitialApp] = useState<InstitutionApplication | undefined>();
  const [wizardInitialType, setWizardInitialType] = useState<ApplicationType>('EOA');
  const [wizardInitialYear, setWizardInitialYear] = useState('2026-2027');
  const [wizardInitialCat, setWizardInitialCat] = useState<ChangeCategory | undefined>();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync applications
  const refreshApplications = () => {
    setApplications(institutionService.getApplications());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  // Instant demo-login helper if unauthenticated visitor lands directly on /institution-portal
  const handleAutoDemoLogin = async () => {
    const res = await authService.login('dr.arun@apextech.edu', 'Apex@2026!', 'INSTITUTION_ADMIN');
    if (res.success && res.user) {
      setCurrentUser(res.user);
      showToast('Logged in as Dr. Arunachalam M. (Institution Administrator)');
    }
  };

  // Open Wizard for new application
  const handleStartApplication = (
    type: ApplicationType,
    year: string,
    category?: ChangeCategory
  ) => {
    setWizardInitialApp(undefined);
    setWizardInitialType(type);
    setWizardInitialYear(year);
    setWizardInitialCat(category);
    setWizardOpen(true);
  };

  const handleEditDraft = (app: InstitutionApplication) => {
    setWizardInitialApp(app);
    setWizardOpen(true);
  };

  const handleContinueRectification = (app: InstitutionApplication) => {
    setSelectedAppForDetails(app);
  };

  const handleWizardSaved = (saved: InstitutionApplication) => {
    setWizardOpen(false);
    refreshApplications();
    showToast(`Application ${saved.referenceNumber} successfully saved (${saved.status}).`);
  };

  // Section title mapper
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'overview':
        return 'Applications & Overview';
      case 'details':
        return 'Institution Profile Details';
      case 'eoa':
        return 'Extension of Approval (EoA)';
      case 'changes':
        return 'Approval-related Changes';
      case 'courses':
        return 'Courses, Intake & Faculty';
      case 'documents':
        return 'Statutory Documents Vault';
      case 'validation':
        return 'AI Document Validation';
      case 'anomalies':
        return 'Document Authentication & Anomaly Detection';
      case 'history':
        return 'Application History & Tracking';
      case 'reports-analytics':
        return 'Institution Compliance & Validation Report';
      case 'notifications':
        return 'Council Notifications & Alerts';
      case 'help':
        return 'Regulatory Guidelines & Helpdesk';
      case 'settings':
        return 'Portal Account & Security Settings';
      default:
        return 'Applications';
    }
  };

  // ==================== SECURITY & ROLE PARTITION CHECKS ====================
  // Check 1: If user is authenticated as another role (Compliance Officer, Doc Verifier, Regulatory Admin)
  if (currentUser && currentUser.authorizedRole !== 'INSTITUTION_ADMIN') {
    return <RoleUnauthorizedState user={currentUser} onLogout={handleLogout} />;
  }

  // Check 2: If user is not authenticated at all
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F4F8FF] flex items-center justify-center p-4 text-slate-800">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-card border border-[#CFE2FE] text-center space-y-6 animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-[#102B4E]">
              Authentication Required
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Please sign in with your official Technical Institution Administrator credentials to access the application portal.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#102B4E] hover:bg-[#2563EB] transition-colors shadow-md cursor-pointer"
            >
              <span>Go to Login Page</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Login Option */}
            <button
              type="button"
              onClick={handleAutoDemoLogin}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs text-[#2563EB] bg-[#EAF2FF] hover:bg-blue-100 transition-colors border border-[#CFE2FE] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>One-Click Demo Login as Institution Admin</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const counts = institutionService.getSummaryCounts();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex">
      {/* 1. Collapsible Sidebar Navigation */}
      <PortalSidebar
        activeSection={activeSection}
        onSelectSection={(sec) => {
          if (sec === 'documents') {
            navigate('/documents');
          } else if (sec === 'validation') {
            navigate('/ai-validation');
          } else if (sec === 'anomalies') {
            navigate('/anomaly-detection');
          } else if (sec === 'issuing-authority') {
            navigate('/issuing-authority');
          } else if (sec === 'compliance') {
            navigate('/regulatory-compliance');
          } else if (sec === 'officer-dashboard') {
            navigate('/officer-dashboard');
          } else {
            setActiveSection(sec);
          }
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. Top Navigation Bar */}
        <PortalHeader
          user={currentUser}
          onLogout={handleLogout}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeSectionTitle={getSectionTitle()}
        />

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#102B4E] text-white shadow-2xl border border-white/20 text-xs sm:text-sm flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-teal-300 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1 max-w-7xl mx-auto w-full">
          {/* ==================== VIEW: OVERVIEW (Default Dashboard) ==================== */}
          {activeSection === 'overview' && (
            <>
              {/* 3. Welcome Section & Prominent Action Button */}
              <div className="bg-gradient-to-r from-white via-[#F4F8FF] to-[#EAF2FF] rounded-3xl p-6 sm:p-8 border border-[#CFE2FE] shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#CFE2FE] text-[#2563EB] text-xs font-bold shadow-subtle">
                    <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Academic Year 2026–2027 Regulatory Gateway</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102B4E] tracking-tight">
                    Welcome to AuthenX Institution Portal
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Manage your institution profile, submit approval applications, and track verification progress from one secure workspace.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleStartApplication('EOA', '2026-2027')}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] transition-all shadow-md hover:shadow-lg flex-shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Application</span>
                </button>
              </div>

              {/* 4. Dashboard Summary Cards (4 Cards) */}
              <PortalSummaryCards
                counts={counts}
                selectedFilter={summaryFilter}
                onFilterSelect={setSummaryFilter}
              />

              {/* 5. Application Type Cards (EoA and Approval Changes) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-[#102B4E]">
                    Start Application Filing
                  </h3>
                  <span className="text-xs text-slate-400">Select application category</span>
                </div>
                <ApplicationTypeCards onStartApplication={handleStartApplication} />
              </div>

              {/* 6. Application History & Status Table */}
              <ApplicationHistoryTable
                applications={applications}
                onViewDetails={(app) => setSelectedAppForDetails(app)}
                onEditDraft={handleEditDraft}
                onContinueRectification={handleContinueRectification}
                externalFilter={summaryFilter}
                searchQuery={searchQuery}
              />
            </>
          )}

          {/* ==================== VIEW: INSTITUTION DETAILS ==================== */}
          {activeSection === 'details' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CFE2FE] shadow-card space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#102B4E]">Institution Profile & Registration</h3>
                    <p className="text-xs text-slate-500">Autonomous technical college master records</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Verified in AICTE DB
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Institution Name
                  </label>
                  <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900">
                    {currentInstitution.name}
                  </p>
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    AICTE Permanent ID (PID)
                  </label>
                  <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-[#2563EB]">
                    {currentInstitution.aictePermanentId}
                  </p>
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    AISHE Code
                  </label>
                  <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-800">
                    {currentInstitution.aisheCode}
                  </p>
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Institution Type
                  </label>
                  <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                    {currentInstitution.institutionType}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Full Campus Address
                  </label>
                  <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                    {currentInstitution.fullAddress}
                  </p>
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Authorized Representative
                  </label>
                  <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900">
                    {currentInstitution.authorizedRepresentative} ({currentInstitution.designation})
                  </p>
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Official Contact
                  </label>
                  <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                    {currentInstitution.officialEmail} • {currentInstitution.contactNumber}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ==================== VIEW: EOA / CHANGES WORKSPACES ==================== */}
          {(activeSection === 'eoa' || activeSection === 'changes') && (
            <div className="space-y-6">
              <ApplicationTypeCards onStartApplication={handleStartApplication} />
              <ApplicationHistoryTable
                applications={applications.filter((a) =>
                  activeSection === 'eoa' ? a.type === 'EOA' : a.type === 'CHANGE'
                )}
                onViewDetails={(app) => setSelectedAppForDetails(app)}
                onEditDraft={handleEditDraft}
                onContinueRectification={handleContinueRectification}
                searchQuery={searchQuery}
              />
            </div>
          )}

          {/* ==================== VIEW: COURSES & FACULTY ==================== */}
          {activeSection === 'courses' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CFE2FE] shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-[#102B4E]">Master Technical Programmes & Cadre Ratios</h3>
                  <p className="text-xs text-slate-500">Autonomous curriculum intakes and faculty allocation</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartApplication('CHANGE', '2026-2027', 'Intake Changes')}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-[#1D4ED8] cursor-pointer"
                >
                  Request Intake Change
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-slate-200 uppercase font-bold text-slate-600 text-[10px]">
                    <tr>
                      <th className="p-3.5">Programme Name</th>
                      <th className="p-3.5">Degree Level</th>
                      <th className="p-3.5">Approved Intake</th>
                      <th className="p-3.5">Faculty Count</th>
                      <th className="p-3.5">AI Cadre Ratio Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications[0]?.courses.map((crs) => (
                      <tr key={crs.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-800">{crs.programmeName}</td>
                        <td className="p-3.5 text-slate-600">{crs.degreeLevel}</td>
                        <td className="p-3.5 font-bold text-[#2563EB]">{crs.approvedIntake}</td>
                        <td className="p-3.5 font-semibold text-slate-700">{crs.facultyCount}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {crs.facultyRatioStatus || 'Compliant (1:15)'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== VIEW: DOCUMENTS VAULT ==================== */}
          {activeSection === 'documents' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CFE2FE] shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-[#102B4E]">Statutory Documents Vault</h3>
                  <p className="text-xs text-slate-500">Cryptographically verified institutional certificates</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/documents')}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-[#1D4ED8] cursor-pointer"
                >
                  Open Statutory Documents Vault
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {applications[0]?.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-[#2563EB] bg-[#EAF2FF] px-2 py-0.5 rounded">
                          {doc.category}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          {doc.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{doc.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Size: {doc.fileSize} • Uploaded: {doc.uploadDate}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200 text-[10px] text-slate-600 space-y-1">
                      <p>
                        <strong>Source:</strong> {doc.verificationSource || 'DigiLocker API'}
                      </p>
                      <p className="font-mono text-[9px] text-slate-400 truncate">
                        {doc.verificationHash || 'SHA256: 7f8a910d8e23b890123...'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== VIEW: HISTORY ==================== */}
          {activeSection === 'history' && (
            <ApplicationHistoryTable
              applications={applications}
              onViewDetails={(app) => setSelectedAppForDetails(app)}
              onEditDraft={handleEditDraft}
              onContinueRectification={handleContinueRectification}
              searchQuery={searchQuery}
            />
          )}

          {/* ==================== VIEW: INSTITUTION REPORTS & COMPLIANCE LEDGER ==================== */}
          {activeSection === 'reports-analytics' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CFE2FE] shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#102B4E]">
                      {currentInstitution.name} — Regulatory Report
                    </h3>
                    <p className="text-xs text-slate-500">
                      Permanent ID: {currentInstitution.aictePermanentId} • AISHE: {currentInstitution.aisheCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/reports-analytics')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Council Analytics Portal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8," + 
                        "Application ID,Type,Academic Year,Status,Validation Status\n" +
                        applications.map(a => `"${a.id}","${a.type}","${a.academicYear}","${a.status}","${a.validationStatus}"`).join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `AuthenX_${currentInstitution.aictePermanentId}_Report.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      showToast('Institution Compliance Report exported as CSV.');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                  <span className="text-[10px] uppercase font-bold text-blue-700">Total Filings</span>
                  <p className="text-2xl font-black text-blue-900 mt-1">{applications.length}</p>
                  <p className="text-[10px] text-blue-600 mt-0.5">Active council submissions</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-700">Compliance Rate</span>
                  <p className="text-2xl font-black text-emerald-900 mt-1">94.8%</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">Norm adherence score</p>
                </div>
                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200">
                  <span className="text-[10px] uppercase font-bold text-purple-700">Verified Vault Docs</span>
                  <p className="text-2xl font-black text-purple-900 mt-1">
                    {applications.reduce((acc, a) => acc + (a.documents?.length || 0), 0)}
                  </p>
                  <p className="text-[10px] text-purple-600 mt-0.5">Cryptographically signed</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-amber-700">Pending Scrutiny</span>
                  <p className="text-2xl font-black text-amber-900 mt-1">
                    {applications.filter(a => a.status !== 'Completed').length}
                  </p>
                  <p className="text-[10px] text-amber-600 mt-0.5">Awaiting committee signoff</p>
                </div>
              </div>

              {/* Applications Ledger Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Application Validation & Audit Ledger
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] border-b border-slate-200 uppercase font-bold text-slate-600 text-[10px]">
                      <tr>
                        <th className="p-3.5">Reference ID</th>
                        <th className="p-3.5">Type & Year</th>
                        <th className="p-3.5">Council Status</th>
                        <th className="p-3.5">AI Validation Outcome</th>
                        <th className="p-3.5">Documents</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-mono font-bold text-[#2563EB]">{app.referenceNumber}</td>
                          <td className="p-3.5">
                            <span className="font-semibold text-slate-800">{app.type}</span>
                            <span className="text-slate-400 block text-[10px]">{app.academicYear}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {app.status}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              app.validationStatus === 'Preliminary Check Passed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {app.validationStatus}
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-600">
                            {app.documents?.length || 0} files
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedAppForDetails(app)}
                              className="px-3 py-1 bg-white border border-slate-200 hover:border-[#2563EB] text-[#2563EB] rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== VIEW: NOTIFICATIONS ==================== */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CFE2FE] shadow-card space-y-4">
              <h3 className="text-lg font-bold text-[#102B4E]">Council Notifications & Scrutiny Observations</h3>
              <div className="space-y-3 text-xs">
                {currentUser?.institutionId === '1-482019382' ? (
                  <>
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-slate-800">
                      <div className="flex items-center justify-between font-bold text-[#2563EB] mb-1">
                        <span>Scrutiny Committee Assignment #SC-SWR-08</span>
                        <span className="font-mono text-[10px] text-slate-500">26 Oct 2026, 10:15 IST</span>
                      </div>
                      <p>Your Extension of Approval application APP-2026-AICTE-7731 has passed preliminary automated OCR verification and is scheduled for Regional Scrutiny Board review.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                      <div className="flex items-center justify-between font-bold text-emerald-700 mb-1">
                        <span>New Programme Filing Recorded: AIML Expansion</span>
                        <span className="font-mono text-[10px] text-slate-500">27 Oct 2026, 14:00 IST</span>
                      </div>
                      <p>Application APP-2026-AICTE-6284 for introduction of B.Tech AI & Machine Learning is under statutory curriculum verification with VTU.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-slate-800">
                      <div className="flex items-center justify-between font-bold text-[#2563EB] mb-1">
                        <span>Scrutiny Committee Assignment #SC-SWR-03</span>
                        <span className="font-mono text-[10px] text-slate-500">25 Oct 2026, 09:30 IST</span>
                      </div>
                      <p>Your Extension of Approval application APP-2026-AICTE-8491 has been scheduled for preliminary digital scrutiny review.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900">
                      <div className="flex items-center justify-between font-bold text-rose-700 mb-1">
                        <span>Rectification Notice: Intake Expansion Flag</span>
                        <span className="font-mono text-[10px] text-slate-500">27 Oct 2026, 11:25 IST</span>
                      </div>
                      <p>Cyber Security course intake increase (+60) requires additional faculty appointment orders and room 304 floor plan endorsement.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ==================== VIEW: HELP & SUPPORT ==================== */}
          {activeSection === 'help' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CFE2FE] shadow-card space-y-4">
              <h3 className="text-lg font-bold text-[#102B4E]">Approval Process Handbook (APH 2026-27) Assistance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-[#102B4E]">Mandatory Land Norms</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Mega/Metro Cities: 1.5 - 2.5 Acres contiguous land; Rural/Other Areas: 4.0 - 7.5 Acres as specified in Chapter I Table 1.1.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-[#102B4E]">Faculty Cadre Ratio Norms</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Undergraduate Engineering: 1:15 ratio with 1 Professor : 2 Associate Professors : 6 Assistant Professors per cadre block.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ==================== VIEW: SETTINGS ==================== */}
          {activeSection === 'settings' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CFE2FE] shadow-card space-y-4">
              <h3 className="text-lg font-bold text-[#102B4E]">Institution Security & Audit Settings</h3>
              <div className="space-y-3 text-xs max-w-xl">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span>Session Idle Timeout</span>
                  <span className="font-mono font-bold text-slate-800">30 minutes</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span>Document Cryptographic Hashing</span>
                  <span className="font-mono font-bold text-emerald-700">SHA-256 Active</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span>Audit Trail Logging</span>
                  <span className="font-mono font-bold text-[#2563EB]">AICTE Regulatory Standard</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ==================== MODALS ==================== */}
      {/* 1. Full Detail View Modal */}
      {selectedAppForDetails && (
        <ApplicationDetailModal
          application={selectedAppForDetails}
          onClose={() => setSelectedAppForDetails(null)}
          onEdit={handleEditDraft}
        />
      )}

      {/* 2. 5-Step Application Wizard Modal */}
      {wizardOpen && (
        <ApplicationWizardModal
          initialApplication={wizardInitialApp}
          initialType={wizardInitialType}
          initialYear={wizardInitialYear}
          initialCategory={wizardInitialCat}
          onClose={() => setWizardOpen(false)}
          onSaved={handleWizardSaved}
        />
      )}
    </div>
  );
};
