import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut, Shield, ArrowRight } from 'lucide-react';
import type { UserAccount } from '../../types/auth';
import { SYSTEM_ROLES, getRoleDashboardRoute, getRoleWorkspaceLabel } from '../../services/authService';

interface RoleUnauthorizedStateProps {
  user: UserAccount | null;
  onLogout: () => void;
  title?: string;
  requiredRoleLabel?: string;
  customMessage?: string;
}

export const RoleUnauthorizedState: React.FC<RoleUnauthorizedStateProps> = ({
  user,
  onLogout,
  title,
  requiredRoleLabel = 'authorized personnel',
  customMessage,
}) => {
  const navigate = useNavigate();

  const roleTitle =
    SYSTEM_ROLES.find((r) => r.id === user?.authorizedRole)?.title ||
    user?.authorizedRole ||
    'Authorized Officer';

  const roleRoute = getRoleDashboardRoute(user?.authorizedRole);
  const roleWorkspaceLabel = getRoleWorkspaceLabel(user?.authorizedRole);

  return (
    <div className="min-h-screen bg-[#F4F8FF] flex items-center justify-center p-4 sm:p-6 text-slate-800">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-card border border-[#CFE2FE] text-center space-y-6 animate-fadeIn">
        {/* Shield Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            {user ? 'Role Workspace Partition' : 'Authentication Required'}
          </span>
          <h2 className="text-2xl font-extrabold text-[#102B4E]">
            {title || (user ? 'Workspace Access Restricted' : 'Authentication Required')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            {customMessage || (user ? (
              <>
                You are authenticated as <strong className="text-[#102B4E]">{roleTitle}</strong> ({user.name}).
                This module is designated exclusively for <strong>{requiredRoleLabel}</strong>.
              </>
            ) : (
              `Please log in with authorized credentials to access this regulatory workspace (requires ${requiredRoleLabel}).`
            ))}
          </p>
        </div>

        {/* Role Explanation Card */}
        {user && (
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#CFE2FE] text-xs text-left space-y-2">
            <div className="flex items-center gap-2 text-[#2563EB] font-bold">
              <Shield className="w-4 h-4" />
              <span>Assigned Statutory Role Scope:</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Your authorized credentials belong to <strong>{user?.organization || 'AICTE Regulatory Office'}</strong>.
              Your designated workspace is <strong>{roleWorkspaceLabel}</strong>.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {user ? (
            <>
              <button
                type="button"
                onClick={() => navigate(roleRoute)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#1763CC] hover:bg-[#1251A8] transition-colors shadow-md cursor-pointer"
              >
                <span>Proceed to {roleWorkspaceLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-slate-400" />
                <span>Switch Role / Login</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#1763CC] hover:bg-[#1251A8] transition-colors shadow-md cursor-pointer"
              >
                <span>Log In with Authorized Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-slate-400" />
                <span>Return to Homepage</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
