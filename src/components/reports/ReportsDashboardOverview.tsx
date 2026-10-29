import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  FileCheck2, 
  AlertTriangle, 
  ShieldAlert, 
  Compass, 
  Send, 
  Hourglass, 
  Award, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';
import type { ReportsDashboardMetrics } from '../../types/reportsAnalytics';

interface ReportsDashboardOverviewProps {
  metrics: ReportsDashboardMetrics;
  onNavigateToReport: (reportId: string) => void;
}

export const ReportsDashboardOverview: React.FC<ReportsDashboardOverviewProps> = ({
  metrics,
  onNavigateToReport,
}) => {
  const kpiCards = [
    {
      label: 'Applications Processed',
      value: metrics.totalApplicationsProcessed,
      suffix: '',
      icon: Layers,
      color: 'blue',
      textColor: 'text-blue-700',
      bg: 'bg-blue-50/70',
      border: 'border-blue-200'
    },
    {
      label: 'Validation Pass Rate',
      value: metrics.validationPassRate,
      suffix: '%',
      icon: CheckCircle2,
      color: 'emerald',
      textColor: 'text-emerald-700',
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-200'
    },
    {
      label: 'Pending Validation',
      value: metrics.pendingValidationCount,
      suffix: '',
      icon: Clock,
      color: 'sky',
      textColor: 'text-sky-700',
      bg: 'bg-sky-50/70',
      border: 'border-sky-200'
    },
    {
      label: 'Doc Verification Success',
      value: metrics.documentVerificationSuccessRate,
      suffix: '%',
      icon: FileCheck2,
      color: 'teal',
      textColor: 'text-teal-700',
      bg: 'bg-teal-50/70',
      border: 'border-teal-200'
    },
    {
      label: 'Flagged Anomalies',
      value: metrics.flaggedAnomaliesCount,
      suffix: '',
      icon: AlertTriangle,
      color: 'rose',
      textColor: 'text-rose-700',
      bg: 'bg-rose-50/70',
      border: 'border-rose-200'
    },
    {
      label: 'Regulatory Compliance',
      value: metrics.regulatoryComplianceRate,
      suffix: '%',
      icon: ShieldCheck,
      color: 'indigo',
      textColor: 'text-indigo-700',
      bg: 'bg-indigo-50/70',
      border: 'border-indigo-200'
    },
    {
      label: 'Inspection Recommended',
      value: metrics.inspectionRecommendedCount,
      suffix: '',
      icon: Compass,
      color: 'purple',
      textColor: 'text-purple-700',
      bg: 'bg-purple-50/70',
      border: 'border-purple-200'
    },
    {
      label: 'Active Rectifications',
      value: metrics.activeRectificationRequests,
      suffix: '',
      icon: Send,
      color: 'amber',
      textColor: 'text-amber-700',
      bg: 'bg-amber-50/70',
      border: 'border-amber-200'
    },
    {
      label: 'Rectification Resolution',
      value: metrics.rectificationResolutionRate,
      suffix: '%',
      icon: Award,
      color: 'emerald',
      textColor: 'text-emerald-700',
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-200'
    },
    {
      label: 'Avg Turnaround Time',
      value: metrics.avgProcessingTurnaroundDays,
      suffix: ' Days',
      icon: Hourglass,
      color: 'slate',
      textColor: 'text-slate-800',
      bg: 'bg-slate-100',
      border: 'border-slate-200'
    },
    {
      label: 'Overdue Action Items',
      value: metrics.overdueActionItemsCount,
      suffix: '',
      icon: ShieldAlert,
      color: 'red',
      textColor: 'text-red-700',
      bg: 'bg-red-50/70',
      border: 'border-red-200'
    }
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* 11 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-2.5">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`p-3 rounded-2xl border ${kpi.border} bg-white shadow-sm flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-slate-500 truncate" title={kpi.label}>
                  {kpi.label}
                </span>
                <div className={`p-1 rounded-lg ${kpi.bg}`}>
                  <Icon className="w-3 h-3 text-slate-600" />
                </div>
              </div>
              <div className={`text-lg font-black ${kpi.textColor}`}>
                {kpi.value}
                <span className="text-xs font-bold text-slate-500">{kpi.suffix}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4 Visual Chart & Breakdown Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Application Validation Status Distribution */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Validation Status Distribution</h3>
              <p className="text-[11px] text-slate-500">Current AICTE approval workflow breakdown</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToReport('APPLICATION_VALIDATION')}
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              View Report 1 →
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                <span>Recommended for Approval (Full Pass)</span>
                <span className="font-bold text-emerald-700">40% (2 apps)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[40%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                <span>Rectification Notice Dispatched (Pending Response)</span>
                <span className="font-bold text-amber-700">20% (1 app)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[20%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                <span>Re-validation Ready (Replacement Uploaded)</span>
                <span className="font-bold text-indigo-700">20% (1 app)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[20%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                <span>Physical Inspection Recommended</span>
                <span className="font-bold text-rose-700">20% (1 app)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-[20%]" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Document Outcomes Breakdown */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Document Verification Outcomes</h3>
              <p className="text-[11px] text-slate-500">Cross-verified across QR, DSC, OCR & Authority Gateways</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToReport('DOCUMENT_VERIFICATION')}
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              View Report 3 →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <span className="text-[10px] text-emerald-800 font-bold uppercase block">Verified Authentic</span>
              <span className="text-2xl font-black text-emerald-700">38</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Valid QR & Digital Signature</span>
            </div>

            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl">
              <span className="text-[10px] text-rose-800 font-bold uppercase block">Anomalies Detected</span>
              <span className="text-2xl font-black text-rose-700">3</span>
              <span className="text-[10px] text-rose-600 block mt-0.5">Splicing / Domain Mismatch</span>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
              <span className="text-[10px] text-amber-800 font-bold uppercase block">Inconclusive / Expired</span>
              <span className="text-2xl font-black text-amber-700">2</span>
              <span className="text-[10px] text-amber-600 block mt-0.5">Lease Concluded / Low Res</span>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
              <span className="text-[10px] text-blue-800 font-bold uppercase block">Class 3 DSC Signatures</span>
              <span className="text-2xl font-black text-blue-700">41</span>
              <span className="text-[10px] text-blue-600 block mt-0.5">Non-Repudiation Verified</span>
            </div>
          </div>
        </div>

        {/* 3. Statutory Regulatory Compliance Breakdown */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Statutory Regulatory Compliance</h3>
              <p className="text-[11px] text-slate-500">Evaluation against AICTE APH 2026-27 Clauses</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToReport('REGULATORY_COMPLIANCE')}
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              View Report 2 →
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-800">Full Compliance</span>
              </div>
              <span className="font-bold text-emerald-700">60% of Clauses (Norms Met)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-semibold text-slate-800">Minor Deficit (&lt;10% Area/Equipment)</span>
              </div>
              <span className="font-bold text-amber-700">20% of Clauses</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="font-semibold text-slate-800">Major Deficit (Cadre / Land Title)</span>
              </div>
              <span className="font-bold text-rose-700">20% of Clauses</span>
            </div>
          </div>
        </div>

        {/* 4. Processing Velocity & Approval Trend */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Processing Velocity & Clearance</h3>
              <p className="text-[11px] text-slate-500">Average scrutiny velocity across 2026-27 cycle</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToReport('PENDING_ACTIONS')}
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              Pending Actions →
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Average AI Scrutiny Turnaround:</span>
              <span className="font-bold text-slate-900">1.2 Hours per Application</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Officer Verification Turnaround:</span>
              <span className="font-bold text-slate-900">4.8 Days</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Rectification Response Window:</span>
              <span className="font-bold text-slate-900">15 Calendar Days</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Re-validation Processing:</span>
              <span className="font-bold text-emerald-700">Instant Automated Clearance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
