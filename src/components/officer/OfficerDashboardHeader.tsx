import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  AlertCircle, 
  SlidersHorizontal,
  Download
} from 'lucide-react';
import type { UserAccount } from '../../types/auth';

interface OfficerDashboardHeaderProps {
  user: UserAccount | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAllApplications: () => void;
  onOpenReports: () => void;
  isDemoMode?: boolean;
}

export const OfficerDashboardHeader: React.FC<OfficerDashboardHeaderProps> = ({
  user,
  searchQuery,
  onSearchChange,
  onOpenAllApplications,
  onOpenReports,
  isDemoMode = true,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 'n1',
      title: 'Deficiency Flagged on APP-2026-AICTE-9104',
      time: '10m ago',
      desc: 'Cyber Security intake expansion requires 3 additional faculty members.',
      unread: true,
    },
    {
      id: 'n2',
      title: 'New Evidence Response Submitted',
      time: '45m ago',
      desc: 'Apex Institute uploaded revised structural floor plan blueprint.',
      unread: true,
    },
    {
      id: 'n3',
      title: 'Expert Visit Committee Recommended',
      time: '2h ago',
      desc: 'Physical inspection recommended for contested laboratory carpet area.',
      unread: false,
    },
  ];

  return (
    <div className="bg-white border-b border-[#CFE2FE] p-4 lg:p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>AuthenX Regulatory Portal</span>
            <span>/</span>
            <span className="text-[#2563EB] font-semibold">AICTE Council Scrutiny</span>
            <span>/</span>
            <span className="text-slate-700">Executive Monitor</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#102B4E]">
              Regulatory Overview
            </h1>
            {isDemoMode && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Demo Mode Active
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Institutional application monitoring, regulatory compliance review, and scrutiny queue management.
          </p>
        </div>

        {/* Action Controls & Profile */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Quick Buttons */}
          <button
            type="button"
            onClick={onOpenAllApplications}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            All Applications (Master Ledger)
          </button>

          <button
            type="button"
            onClick={onOpenReports}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#102B4E] bg-[#EAF2FF] border border-[#CFE2FE] hover:bg-[#D8E8FF] rounded-lg transition"
          >
            <Download className="w-4 h-4 text-[#2563EB]" />
            Reports & Summary
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:text-[#2563EB] hover:bg-slate-100 rounded-lg relative transition"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-[#102B4E]">
                  <span>Scrutiny Notifications</span>
                  <span className="text-[10px] text-blue-600">Mark all read</span>
                </div>
                <div className="divide-y divide-slate-100 mt-2 space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="pt-2 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Officer Profile Badge */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-[#102B4E] text-white flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name[0] : 'P'}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-slate-800 block leading-tight">
                {user?.name || 'Smt. Priya Sharma'}
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                {user?.authorizedRole || 'COMPLIANCE_OFFICER'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search applications across institution name, AICTE Permanent ID, reference code, or assigned committee..."
          className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
};
