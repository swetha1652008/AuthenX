import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  FileCheck2, 
  FileEdit, 
  GraduationCap, 
  Files, 
  Sparkles,
  History, 
  Bell, 
  HelpCircle, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  ShieldAlert,
  Award,
  CheckSquare,
  SlidersHorizontal,
  X,
  FileCode2,
  Gavel
} from 'lucide-react';
import { AuthenXLogo } from '../common/AuthenXLogo';

export type PortalSection = 
  | 'overview'
  | 'details'
  | 'eoa'
  | 'changes'
  | 'courses'
  | 'documents'
  | 'validation'
  | 'anomalies'
  | 'issuing-authority'
  | 'compliance'
  | 'officer-dashboard'
  | 'human-review'
  | 'alerts-audit'
  | 'reports-analytics'
  | 'rules-configuration'
  | 'security-access'
  | 'final-review'
  | 'history'
  | 'notifications'
  | 'help'
  | 'settings';

interface PortalSidebarProps {
  activeSection: PortalSection;
  onSelectSection: (section: PortalSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

import { authService } from '../../services/authService';
import { institutionService } from '../../services/institutionService';

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  activeSection,
  onSelectSection,
  collapsed,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile = () => {},
}) => {
  const currentUser = authService.getCurrentUser();
  const currentInstitution = institutionService.getInstitutionDetails(currentUser?.institutionId);

  const getRoleBadge = () => {
    switch (currentUser?.authorizedRole) {
      case 'COMPLIANCE_OFFICER':
        return 'Compliance Cell';
      case 'DOCUMENT_VERIFICATION_OFFICER':
        return 'Doc Auth Cell';
      case 'REGULATORY_ADMIN':
        return 'Regulatory HQ';
      case 'INSTITUTION_ADMIN':
      default:
        return 'Inst. Portal';
    }
  };

  const getNavItemsForRole = () => {
    switch (currentUser?.authorizedRole) {
      case 'COMPLIANCE_OFFICER':
        return [
          { id: 'overview' as PortalSection, label: 'Scrutiny Dashboard', icon: LayoutDashboard },
          { id: 'officer-dashboard' as PortalSection, label: 'Assigned Applications', icon: SlidersHorizontal },
          { id: 'compliance' as PortalSection, label: 'Regulatory Compliance', icon: CheckSquare },
          { id: 'human-review' as PortalSection, label: 'Rectification Tracking', icon: CheckSquare },
          { id: 'final-review' as PortalSection, label: 'Final Review & Decision', icon: Gavel },
          { id: 'alerts-audit' as PortalSection, label: 'Alerts & Audit Trail', icon: Bell },
          { id: 'reports-analytics' as PortalSection, label: 'Compliance Reports', icon: LayoutDashboard },
          { id: 'notifications' as PortalSection, label: 'Notifications', icon: Bell },
          { id: 'help' as PortalSection, label: 'Guidelines & Support', icon: HelpCircle },
        ];
      case 'DOCUMENT_VERIFICATION_OFFICER':
        return [
          { id: 'overview' as PortalSection, label: 'Verification Dashboard', icon: LayoutDashboard },
          { id: 'issuing-authority' as PortalSection, label: 'Issuing Authority Verification', icon: Award },
          { id: 'documents' as PortalSection, label: 'Assigned Documents Vault', icon: Files },
          { id: 'validation' as PortalSection, label: 'AI Document Validation', icon: Sparkles },
          { id: 'anomalies' as PortalSection, label: 'Authenticity & Anomalies', icon: ShieldAlert },
          { id: 'human-review' as PortalSection, label: 'Human Review & Rectification', icon: CheckSquare },
          { id: 'reports-analytics' as PortalSection, label: 'Verification Reports', icon: LayoutDashboard },
          { id: 'notifications' as PortalSection, label: 'Notifications', icon: Bell },
          { id: 'help' as PortalSection, label: 'Guidelines & Support', icon: HelpCircle },
        ];
      case 'REGULATORY_ADMIN':
        return [
          { id: 'overview' as PortalSection, label: 'Regulatory Dashboard', icon: LayoutDashboard },
          { id: 'rules-configuration' as PortalSection, label: 'Rules & Policies', icon: FileCode2 },
          { id: 'security-access' as PortalSection, label: 'Security & Access Management', icon: Shield },
          { id: 'final-review' as PortalSection, label: 'Final Decision Support', icon: Gavel },
          { id: 'compliance' as PortalSection, label: 'Regulatory Monitoring', icon: CheckSquare },
          { id: 'issuing-authority' as PortalSection, label: 'Issuing Authority Oversight', icon: Award },
          { id: 'human-review' as PortalSection, label: 'Human Scrutiny', icon: CheckSquare },
          { id: 'alerts-audit' as PortalSection, label: 'Audit Records & Alerts', icon: Bell },
          { id: 'reports-analytics' as PortalSection, label: 'Reports & Analytics', icon: LayoutDashboard },
          { id: 'notifications' as PortalSection, label: 'Notifications', icon: Bell },
          { id: 'settings' as PortalSection, label: 'System Settings', icon: Settings },
          { id: 'help' as PortalSection, label: 'Protocols & Support', icon: HelpCircle },
        ];
      case 'INSTITUTION_ADMIN':
      default:
        return [
          { id: 'overview' as PortalSection, label: 'Overview & Status', icon: LayoutDashboard },
          { id: 'details' as PortalSection, label: 'Institution Details', icon: Building2 },
          { id: 'eoa' as PortalSection, label: 'EoA Application', icon: FileCheck2 },
          { id: 'changes' as PortalSection, label: 'Approval Changes', icon: FileEdit },
          { id: 'courses' as PortalSection, label: 'Courses & Faculty', icon: GraduationCap },
          { id: 'documents' as PortalSection, label: 'Documents Vault', icon: Files },
          { id: 'validation' as PortalSection, label: 'AI Pre-Validation', icon: Sparkles },
          { id: 'anomalies' as PortalSection, label: 'Anomaly Detection', icon: ShieldAlert },
          { id: 'history' as PortalSection, label: 'Status Tracking', icon: History },
          { id: 'reports-analytics' as PortalSection, label: 'Institution Reports', icon: LayoutDashboard },
          { id: 'notifications' as PortalSection, label: 'Notifications', icon: Bell },
          { id: 'help' as PortalSection, label: 'Help & Support', icon: HelpCircle },
          { id: 'settings' as PortalSection, label: 'Settings', icon: Settings },
        ];
    }
  };

  const navItems = getNavItemsForRole();

  const handleItemClick = (id: PortalSection) => {
    onSelectSection(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#102B4E] text-white">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 h-16">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <AuthenXLogo size="sm" light showTagline={false} />
            <span className="text-[10px] uppercase tracking-wider font-bold bg-[#2563EB] text-white px-1.5 py-0.5 rounded">
              {getRoleBadge()}
            </span>
          </div>
        ) : (
          <div className="mx-auto">
            <Shield className="w-6 h-6 text-teal-400" />
          </div>
        )}

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Items List */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-300" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User / Institution Identity Badge & Collapse Toggle */}
      <div className="p-3 border-t border-white/10 text-xs text-slate-300 bg-black/15">
        {!collapsed ? (
          currentUser && currentUser.authorizedRole !== 'INSTITUTION_ADMIN' ? (
            <div className="space-y-0.5 mb-2">
              <p className="text-[10px] uppercase font-bold text-teal-300">Authorized Officer</p>
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-300 truncate">{currentUser.designation}</p>
              <p className="text-[9px] text-slate-400 truncate">{currentUser.organization}</p>
            </div>
          ) : (
            <div className="space-y-1 mb-2">
              <p className="text-[10px] uppercase font-bold text-teal-300">Active Institution</p>
              <p className="text-xs font-semibold text-white truncate">{currentInstitution.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">PID: {currentInstitution.aictePermanentId}</p>
            </div>
          )
        ) : (
          <div className="text-center py-1 font-mono text-[9px] text-teal-300">
            {currentUser?.authorizedRole === 'INSTITUTION_ADMIN' ? 'PID' : 'OFFICER'}
          </div>
        )}

        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex w-full items-center justify-center gap-2 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block h-screen sticky top-0 transition-all duration-300 flex-shrink-0 z-30 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-fadeIn">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
