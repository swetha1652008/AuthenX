import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Search, 
  ArrowRight, 
  LayoutDashboard, 
  Files, 
  ShieldCheck, 
  Building, 
  AlertCircle,
  FileWarning,
  Sparkles,
  Info
} from 'lucide-react';

interface DashboardPreviewProps {
  onScrollTo?: (sectionId: string) => void;
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({ onScrollTo }) => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const handleScrollToFeatures = () => {
    if (onScrollTo) {
      onScrollTo('features');
    } else {
      const el = document.getElementById('features');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const stats = [
    {
      title: 'Total Applications',
      value: '250',
      change: '+14% from last cycle',
      icon: Files,
      color: 'blue',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      iconColor: 'text-royal-600',
    },
    {
      title: 'Validation Completed',
      value: '180',
      change: '72% completed',
      icon: CheckCircle2,
      color: 'emerald',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Pending Verification',
      value: '35',
      change: '14% in progress',
      icon: Clock,
      color: 'amber',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Manual Review',
      value: '20',
      change: '8% flagged for officer',
      icon: AlertCircle,
      color: 'purple',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      iconColor: 'text-purple-600',
    },
  ];

  const recentActivities = [
    {
      institution: 'Apex Institute of Technology & Science',
      code: '1-84920194',
      action: 'Land Ownership Deed & Municipal Plan verified',
      time: '12 mins ago',
      status: 'Verified',
      statusClass: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      institution: 'National Engineering College, Pune',
      code: '1-74920112',
      action: 'Fire Safety NOC expired — deficiency ticket issued',
      time: '45 mins ago',
      status: 'Mismatch',
      statusClass: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      institution: 'Metropolitan Institute of Management',
      code: '1-93021940',
      action: 'Faculty cadre ratio (1:15) self-declaration audited',
      time: '1 hour ago',
      status: 'Verified',
      statusClass: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      institution: 'City Polytechnic Institute, Chennai',
      code: '1-62094182',
      action: 'Handwritten lease agreement routed to Scrutiny Committee',
      time: '2 hours ago',
      status: 'Manual Review',
      statusClass: 'text-purple-600 bg-purple-50 border-purple-200',
    },
  ];

  return (
    <section id="dashboard" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-royal-700 text-xs font-bold tracking-wide uppercase mb-3">
            <span>Integrated Command Center</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Preview
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            View application status, validation results, and pending review tasks in one place.
          </p>

          {/* Sample Data Disclaimer Callout */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>Fictional sample data shown below for prototype illustration only.</span>
          </div>
        </div>

        {/* Dashboard Shell Mockup */}
        <div className="bg-slate-900 rounded-3xl p-3 sm:p-5 shadow-2xl border border-slate-800">
          {/* Top Bar of Dashboard Window */}
          <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 text-xs font-mono text-slate-400 hidden sm:inline">
                authenx.aicte-portal.internal/dashboard
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-slate-800 text-teal-400 font-mono px-2 py-0.5 rounded border border-slate-700">
                AI Engine: Online
              </span>
              <span className="text-[10px] bg-royal-600 text-white px-2 py-0.5 rounded font-semibold">
                DEMO ENVIRONMENT
              </span>
            </div>
          </div>

          {/* Main Dashboard Layout Container (Sidebar + Content Area) */}
          <div className="mt-3 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col lg:flex-row">
            {/* Dashboard Sidebar Illustration */}
            <aside className="w-full lg:w-56 bg-slate-900/90 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex-shrink-0 flex flex-col justify-between">
              <div>
                {/* Micro Brand */}
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-royal-600 flex items-center justify-center text-white">
                    <ShieldCheck className="w-4 h-4 text-teal-300" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">AuthenX Portal</span>
                    <span className="text-[9px] text-slate-400">Scrutiny v2.4</span>
                  </div>
                </div>

                {/* Sidebar Navigation Items */}
                <nav className="space-y-1 text-xs">
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-royal-600 text-white font-semibold">
                    <LayoutDashboard className="w-4 h-4 text-teal-300" />
                    <span>Overview</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
                    <Files className="w-4 h-4" />
                    <span>Applications</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span>AI Scrutiny</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
                    <FileWarning className="w-4 h-4 text-amber-400" />
                    <span>Deficiencies</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
                    <Building className="w-4 h-4" />
                    <span>Institutions</span>
                  </div>
                </nav>
              </div>

              {/* Sidebar Footer Indicator */}
              <div className="pt-4 mt-4 border-t border-slate-800 text-[11px] text-slate-500">
                <span className="text-slate-400 font-medium block">Council Region:</span>
                <span>South Western Region</span>
              </div>
            </aside>

            {/* Dashboard Main Workspace */}
            <main className="flex-1 p-4 sm:p-6 bg-slate-950 text-white overflow-hidden">
              {/* Top Subheader: Search & Program Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    Application Scrutiny Overview
                  </h3>
                  <p className="text-xs text-slate-400">
                    Academic Year 2026-2027 • AICTE Extension of Approval (EoA)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      readOnly
                      placeholder="Search institute code..."
                      value=""
                      className="bg-slate-900 border border-slate-700 text-xs rounded-lg pl-8 pr-3 py-1.5 text-slate-300 w-44 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 p-1 rounded-lg text-xs">
                    {['All', 'Engg', 'Mgmt'].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setSelectedFilter(f)}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                          selectedFilter === f
                            ? 'bg-royal-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4 Sample Statistic Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
                {stats.map((st, i) => {
                  const SIcon = st.icon;
                  return (
                    <div
                      key={i}
                      className="bg-slate-900/90 rounded-xl p-3.5 sm:p-4 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {st.title}
                        </span>
                        <SIcon className={`w-4 h-4 ${st.iconColor}`} />
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white">
                        {st.value}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                        <span>{st.change}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Two-Column Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left: Application Status Chart & Recent Activities */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Status Progress Breakdown Chart */}
                  <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-200">
                        Application Status Distribution
                      </span>
                      <span className="text-[10px] text-slate-400">Total: 250 Applications</span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full h-3 bg-slate-800 rounded-full flex overflow-hidden gap-0.5 p-0.5">
                      <div className="bg-emerald-500 h-full rounded-l-full w-[72%]" title="Validated (180)" />
                      <div className="bg-amber-500 h-full w-[14%]" title="Pending (35)" />
                      <div className="bg-purple-500 h-full w-[8%]" title="Manual Review (20)" />
                      <div className="bg-rose-500 h-full rounded-r-full w-[6%]" title="Mismatch (15)" />
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-slate-300">Validated (180)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-slate-300">Pending (35)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        <span className="text-slate-300">Review (20)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-slate-300">Mismatch (15)</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activities Stream */}
                  <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-200">
                        Recent Validation Feed
                      </span>
                      <span className="text-[10px] text-teal-400 font-mono">Live Stream</span>
                    </div>

                    <div className="space-y-2.5">
                      {recentActivities.map((act, aIdx) => (
                        <div
                          key={aIdx}
                          className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-200 text-xs">
                                {act.institution}
                              </span>
                              <span className="font-mono text-[10px] text-slate-500">
                                {act.code}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {act.action}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded border inline-block ${act.statusClass}`}
                            >
                              {act.status}
                            </span>
                            <span className="text-[9px] text-slate-500 block mt-1">
                              {act.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Verification Results & Missing Document Indicators */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Verification Results Panel */}
                  <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-200">
                        Verification Results Summary
                      </span>
                      <span className="text-[10px] text-slate-400">AI Confidence</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-slate-300">Land Title Ownership</span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400 font-bold">99.8%</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-slate-300">Affiliation Document</span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400 font-bold">98.4%</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-slate-300">Faculty Qualification Hashing</span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400 font-bold">96.7%</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-slate-300">Hostel & Ramp Floor Plans</span>
                        </div>
                        <span className="text-[11px] font-mono text-amber-400 font-bold">Pending</span>
                      </div>
                    </div>
                  </div>

                  {/* Missing Document Indicators */}
                  <div className="bg-slate-900/80 rounded-xl p-4 border border-rose-900/40 bg-rose-950/10">
                    <div className="flex items-center gap-2 mb-2 text-rose-300 font-bold text-xs">
                      <FileWarning className="w-4 h-4 text-rose-400" />
                      <span>Missing Document Indicators (Deficiency Alert)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Required for statutory AICTE approval per Appendix 16 of Approval Process Handbook:
                    </p>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between p-2 rounded bg-slate-900/90 border border-rose-900/40">
                        <span className="text-slate-200">1. Fire Safety Certificate Renewal</span>
                        <span className="text-[10px] text-rose-400 font-bold uppercase">Missing</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-slate-900/90 border border-amber-900/40">
                        <span className="text-slate-200">2. Anti-Ragging Committee Notification</span>
                        <span className="text-[10px] text-amber-400 font-bold uppercase">Pending</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-slate-900/90 border border-rose-900/40">
                        <span className="text-slate-200">3. Barrier-Free Access Certificate</span>
                        <span className="text-[10px] text-rose-400 font-bold uppercase">Missing</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Explore Dashboard Button that scrolls to Key Features */}
        <div className="text-center mt-10">
          <button
            type="button"
            onClick={handleScrollToFeatures}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-royal-600 hover:bg-royal-700 active:scale-[0.98] transition-all shadow-md hover:shadow-lg group cursor-pointer"
          >
            <span>Explore Dashboard</span>
            <ArrowRight className="w-4 h-4 text-teal-300 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
