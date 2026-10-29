import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Download 
} from 'lucide-react';
import { authService } from '../services/authService';
import { regulatoryRulesService } from '../services/regulatoryRulesService';
import type { UserAccount } from '../types/auth';
import type { RegulatoryRuleItem } from '../types/regulatoryRules';

import { PortalSidebar, type PortalSection } from '../components/portal/PortalSidebar';
import { PortalHeader } from '../components/portal/PortalHeader';
import { RoleUnauthorizedState } from '../components/portal/RoleUnauthorizedState';

import { RulesDashboardKPIs } from '../components/regulatoryRules/RulesDashboardKPIs';
import { RulesMasterTable } from '../components/regulatoryRules/RulesMasterTable';
import { RuleEditorModal } from '../components/regulatoryRules/RuleEditorModal';
import { RuleTestExecutionModal } from '../components/regulatoryRules/RuleTestExecutionModal';
import { RuleVersionCompareModal } from '../components/regulatoryRules/RuleVersionCompareModal';
import { RuleAuditHistoryModal } from '../components/regulatoryRules/RuleAuditHistoryModal';

export const RegulatoryRulesPage: React.FC = () => {
  const navigate = useNavigate();

  // Authentication State
  const [currentUser] = useState<UserAccount | null>(() => authService.getCurrentUser());

  // Layout State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeKpiFilter, setActiveKpiFilter] = useState<string>('ALL');

  // Rules Data State
  const [rules, setRules] = useState<RegulatoryRuleItem[]>(() => regulatoryRulesService.getRules());
  const [kpis, setKpis] = useState(() => regulatoryRulesService.getDashboardKPIs());

  // Modals
  const [editingRule, setEditingRule] = useState<RegulatoryRuleItem | null | undefined>(undefined);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [testingRule, setTestingRule] = useState<RegulatoryRuleItem | null>(null);
  const [comparingRule, setComparingRule] = useState<RegulatoryRuleItem | null>(null);
  const [auditingRule, setAuditingRule] = useState<RegulatoryRuleItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const refreshRules = () => {
    setRules(regulatoryRulesService.getRules());
    setKpis(regulatoryRulesService.getDashboardKPIs());
  };

  // Role Access Check: Exclusively for Regulatory Administrators
  const isAuthorized = currentUser?.authorizedRole === 'REGULATORY_ADMIN';

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

  // Rule Actions
  const handleSaveRule = (data: Partial<RegulatoryRuleItem>) => {
    regulatoryRulesService.saveDraftRule(data, currentUser?.name || 'Authorized Official');
    setIsEditorOpen(false);
    setEditingRule(undefined);
    refreshRules();
    showToast(`Saved draft rule "${data.requirementCode}".`);
  };

  const handleSubmitForReview = (id: string) => {
    const updated = regulatoryRulesService.submitForReview(id, currentUser?.name || 'Regulatory Admin');
    if (updated) {
      refreshRules();
      showToast(`Rule ${updated.requirementCode} submitted for council scrutiny.`);
    }
  };

  const handleApprove = (id: string) => {
    const updated = regulatoryRulesService.approveRule(id, currentUser?.name || 'Scrutiny Officer');
    if (updated) {
      refreshRules();
      showToast(`Approved rule ${updated.requirementCode} for publication.`);
    }
  };

  const handlePublish = (id: string) => {
    const updated = regulatoryRulesService.publishRule(id, currentUser?.name || 'Council Chairman');
    if (updated) {
      refreshRules();
      showToast(`Rule ${updated.requirementCode} is now published (${updated.version})!`);
    }
  };

  const handleDeactivate = (id: string) => {
    const updated = regulatoryRulesService.deactivateRule(id, currentUser?.name || 'Regulatory Director');
    if (updated) {
      refreshRules();
      showToast(`Deactivated rule ${updated.requirementCode}.`);
    }
  };

  const handleDuplicate = (id: string) => {
    const dup = regulatoryRulesService.duplicateRule(id, currentUser?.name || 'Regulatory Admin');
    if (dup) {
      refreshRules();
      showToast(`Duplicated as new draft ${dup.requirementCode}.`);
    }
  };

  const handleExportCsv = () => {
    const csv = regulatoryRulesService.exportRulesToCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AICTE_Regulatory_Rules_Master_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded CSV of all regulatory rule specifications.');
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
        activeSection="rules-configuration"
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
          activeSectionTitle="Regulatory Rules Configuration"
        />

        {/* Scrollable Page Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          {/* Header Title Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-blue-100/70 border border-blue-200 px-2.5 py-0.5 rounded-full">
                  Rules Engine Codification
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  AICTE Approval Process Handbook (APH 2026-27)
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#102B4E] tracking-tight">
                Regulatory Rules Configuration
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Codify application checklists, validity windows, and cross-document validation with statutory version tracking.
              </p>
            </div>

            {/* Header Primary Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportCsv}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingRule(null);
                  setIsEditorOpen(true);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1d4ed8] rounded-xl transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" /> New Rule Draft
              </button>
            </div>
          </div>

          <div className="space-y-6 max-w-7xl">
            {/* KPI Overview Cards */}
            <RulesDashboardKPIs
              kpis={kpis}
              activeFilter={activeKpiFilter}
              onSelectFilter={setActiveKpiFilter}
            />

            {/* Master Rules Table */}
            <RulesMasterTable
              rules={rules}
              onOpenEditor={(rule) => {
                setEditingRule(rule);
                setIsEditorOpen(true);
              }}
              onOpenTester={(rule) => setTestingRule(rule)}
              onOpenVersionCompare={(rule) => setComparingRule(rule)}
              onOpenAuditHistory={(rule) => setAuditingRule(rule)}
              onSubmitForReview={handleSubmitForReview}
              onApprove={handleApprove}
              onPublish={handlePublish}
              onDeactivate={handleDeactivate}
              onDuplicate={handleDuplicate}
            />
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <RuleEditorModal
          rule={editingRule || undefined}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingRule(undefined);
          }}
          onSave={handleSaveRule}
        />
      )}

      {/* Tester Simulation Modal */}
      {testingRule && (
        <RuleTestExecutionModal
          rule={testingRule}
          onClose={() => setTestingRule(null)}
        />
      )}

      {/* Version Compare Modal */}
      {comparingRule && (
        <RuleVersionCompareModal
          rule={comparingRule}
          onClose={() => setComparingRule(null)}
        />
      )}

      {/* Audit History Modal */}
      {auditingRule && (
        <RuleAuditHistoryModal
          rule={auditingRule}
          onClose={() => setAuditingRule(null)}
        />
      )}
    </div>
  );
};
