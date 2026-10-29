import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';
import type { UserAccount } from '../../types/auth';

interface PortalHeaderProps {
  user: UserAccount | null;
  onLogout: () => void;
  onOpenMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeSectionTitle: string;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  user,
  onLogout,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
  activeSectionTitle,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  const notifications = [
    {
      id: 'notif_1',
      title: 'Scrutiny Committee Assigned',
      desc: 'Committee 3 assigned to review APP-2026-AICTE-8491.',
      time: '15m ago',
      unread: true,
    },
    {
      id: 'notif_2',
      title: 'Rectification Requested',
      desc: 'Upload Cyber Lab floor plan for APP-2026-AICTE-9104.',
      time: '2h ago',
      unread: true,
    },
    {
      id: 'notif_3',
      title: 'Land Deed Hashes Authenticated',
      desc: 'Bhoomi Karnataka registry confirmed unencumbered title.',
      time: '1d ago',
      unread: false,
    },
  ];

  const getPortalScope = () => {
    switch (user?.authorizedRole) {
      case 'COMPLIANCE_OFFICER':
        return {
          portalName: 'AICTE Compliance Portal',
          portalHeading: 'AICTE Regulatory Compliance & Scrutiny Gateway',
          roleLabel: user.designation || 'Senior Scrutiny Officer',
        };
      case 'DOCUMENT_VERIFICATION_OFFICER':
        return {
          portalName: 'Document Verification Cell',
          portalHeading: 'AICTE Digital Document Authentication Cell',
          roleLabel: user.designation || 'Lead Document Evaluator',
        };
      case 'REGULATORY_ADMIN':
        return {
          portalName: 'Regulatory Administration',
          portalHeading: 'AICTE Regulatory Council Headquarters',
          roleLabel: user.designation || 'Regulatory Administrator',
        };
      case 'INSTITUTION_ADMIN':
      default:
        return {
          portalName: 'Institution Portal',
          portalHeading: 'Institution Application Portal',
          roleLabel: user?.designation || 'Institution Administrator',
        };
    }
  };

  const portalScope = getPortalScope();

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-[#CFE2FE] shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-[#102B4E] hover:bg-slate-100"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>{portalScope.portalName}</span>
              <span>/</span>
              <span className="text-[#2563EB] font-semibold">{activeSectionTitle}</span>
            </div>
            <h1 className="text-base sm:text-lg font-extrabold text-[#102B4E] tracking-tight">
              {portalScope.portalHeading}
            </h1>
          </div>
        </div>

        {/* Center: Search Field */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search applications, ref numbers, courses, or docs..."
              className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#CFE2FE] text-xs sm:text-sm text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all placeholder-slate-400"
            />
          </div>
        </div>

        {/* Right: Demo Pill, Notifications & User Profile Menu */}
        <div className="flex items-center gap-3">
          {/* Demo Sandbox Tag */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DDF7FA] border border-[#B2EBF2] text-[#0A588C] text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse" />
            <span>AICTE Sandbox Mode</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotificationMenu(!showNotificationMenu);
                setShowProfileMenu(false);
              }}
              className="p-2 rounded-xl text-slate-600 hover:text-[#102B4E] hover:bg-slate-100 relative transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {showNotificationMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#CFE2FE] p-4 text-slate-800 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-sm font-bold text-[#102B4E]">Notifications</span>
                  </div>
                  <span className="text-[10px] font-semibold bg-[#EAF2FF] text-[#2563EB] px-2 py-0.5 rounded-full">
                    2 New Alerts
                  </span>
                </div>

                <div className="divide-y divide-slate-100 my-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 px-1 hover:bg-slate-50 rounded-lg transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900">{n.title}</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 text-center">
                  <span className="text-xs text-[#2563EB] font-semibold hover:underline cursor-pointer">
                    Mark all notifications as read
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotificationMenu(false);
              }}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {user ? user.name.charAt(0) : 'A'}
              </div>
              <div className="hidden xl:block text-left">
                <span className="text-xs font-bold text-[#102B4E] block leading-tight">
                  {user ? user.name : 'Dr. Arunachalam M.'}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {portalScope.roleLabel}
                </span>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#CFE2FE] p-4 text-slate-800 z-50 animate-fadeIn">
                <div className="pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                      Authorized Session
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#102B4E]">
                    {user ? user.name : 'Dr. Arunachalam M.'}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">
                    {user ? user.email : 'principal@apextech.edu'}
                  </p>
                  <p className="text-[11px] text-[#2563EB] font-semibold mt-0.5">
                    {portalScope.roleLabel}
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                    {user ? user.organization : 'Apex Institute of Technology & Science'}
                  </p>
                </div>

                <div className="py-2 space-y-1 text-xs">
                  {user?.authorizedRole === 'INSTITUTION_ADMIN' ? (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-500">AICTE PID:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {user.aictePermanentId || user.institutionId || '1-938210941'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-500">Official Officer ID:</span>
                      <span className="font-mono font-bold text-[#2563EB]">{user?.id || 'OFFICER-001'}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out from Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
