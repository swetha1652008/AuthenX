import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  ShieldAlert, 
  Lock, 
  Activity, 
  ClipboardCheck, 
  Archive 
} from 'lucide-react';
import type { SecurityOverviewKPIs } from '../../types/securityAccess';

interface Props {
  kpis: SecurityOverviewKPIs;
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const SecurityOverviewCards: React.FC<Props> = ({
  kpis,
  activeFilter,
  onSelectFilter,
}) => {
  const cards = [
    {
      id: 'USERS',
      title: 'Total Identities',
      value: kpis.totalRegisteredUsers,
      sub: 'Multi-Role Directory',
      icon: Users,
      color: 'blue',
      borderColor: 'border-blue-500',
    },
    {
      id: 'ACTIVE',
      title: 'Active Accounts',
      value: kpis.activeAccounts,
      sub: 'MFA Enforced Access',
      icon: UserCheck,
      color: 'emerald',
      borderColor: 'border-emerald-500',
    },
    {
      id: 'SUSPENDED',
      title: 'Suspended / Locked',
      value: kpis.suspendedAccounts,
      sub: 'Action Triggered Locks',
      icon: UserX,
      color: 'rose',
      borderColor: 'border-rose-500',
    },
    {
      id: 'ROLES',
      title: 'Configured Roles',
      value: kpis.configuredRolesCount,
      sub: 'Matrix RBAC Models',
      icon: Lock,
      color: 'indigo',
      borderColor: 'border-indigo-500',
    },
    {
      id: 'FAILED_LOGINS',
      title: 'Failed Logins',
      value: kpis.failedLoginAttempts,
      sub: 'Throttling Protected',
      icon: ShieldAlert,
      color: 'amber',
      borderColor: 'border-amber-500',
    },
    {
      id: 'AUDIT',
      title: 'Security Audit Logs',
      value: kpis.auditEventsCount,
      sub: 'CERT-In Compliant',
      icon: Activity,
      color: 'teal',
      borderColor: 'border-teal-500',
    },
    {
      id: 'REVIEWS',
      title: 'Pending Reviews',
      value: kpis.pendingAccessReviews,
      sub: 'Privileged Access Audits',
      icon: ClipboardCheck,
      color: 'purple',
      borderColor: 'border-purple-500',
    },
    {
      id: 'HOLDS',
      title: 'Legal Holds Active',
      value: kpis.retentionPoliciesOnHold,
      sub: 'Disposal Freezes',
      icon: Archive,
      color: 'slate',
      borderColor: 'border-slate-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = activeFilter === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectFilter(c.id)}
            className={`text-left p-3.5 rounded-xl border bg-white transition-all shadow-xs hover:shadow-md relative overflow-hidden ${
              isSelected ? 'ring-2 ring-[#0F766E] border-[#0F766E] bg-teal-50/20' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 line-clamp-1">
                {c.title}
              </span>
              <Icon className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-xl font-black text-[#102B4E] tracking-tight mb-0.5">
              {c.value}
            </div>
            <p className="text-[9px] text-slate-500 font-medium line-clamp-1">
              {c.sub}
            </p>
          </button>
        );
      })}
    </div>
  );
};
