import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ShieldCheck, 
  LogOut, 
  ArrowRight, 
  UserCheck, 
  Calendar 
} from 'lucide-react';
import type { UserRoleId, UserAccount } from '../types/auth';
import { SYSTEM_ROLES, authService, getRoleDashboardRoute, getRoleWorkspaceLabel } from '../services/authService';
import { AuthBrandingLeft } from '../components/auth/AuthBrandingLeft';
import { RoleSelectionCards } from '../components/auth/RoleSelectionCards';
import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // Selected requested role context (Card state)
  const [selectedRole, setSelectedRole] = useState<UserRoleId | null>('INSTITUTION_ADMIN');
  const [roleError, setRoleError] = useState<string | null>(null);

  // Authenticated State (once server validates credentials & authorized role)
  const [authenticatedUser, setAuthenticatedUser] = useState<UserAccount | null>(
    () => authService.getCurrentUser()
  );

  const handleRoleSelect = (role: UserRoleId) => {
    setSelectedRole(role);
    setRoleError(null);
  };

  const handleLoginSuccess = (user: UserAccount, _role: UserRoleId) => {
    setAuthenticatedUser(user);
    const destination = getRoleDashboardRoute(user.authorizedRole);
    navigate(destination);
  };

  const handleLogout = () => {
    authService.logout();
    setAuthenticatedUser(null);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const getRoleTitle = (roleId?: UserRoleId) => {
    return SYSTEM_ROLES.find((r) => r.id === roleId)?.title || roleId;
  };

  return (
    <div className="min-h-screen bg-[#F4F8FF] text-[#0B1B3A] flex flex-col justify-between selection:bg-[#1763CC] selection:text-white">
      {/* Main Split-Screen Container */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
        {/* Left Section — AuthenX Branding (~40% on Desktop) */}
        <section className="w-full lg:w-[40%] xl:w-[38%] flex-shrink-0 flex">
          <AuthBrandingLeft onBackToHome={handleBackToHome} />
        </section>

        {/* Right Section — Login Card (~60% on Desktop) */}
        <section className="w-full lg:w-[60%] xl:w-[62%] flex items-center justify-center p-4 sm:p-8 lg:p-12 xl:p-16 bg-[#F4F8FF]">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-10 shadow-card border border-[#CFE2FE]/80">
            {!authenticatedUser ? (
              <>
                {/* Heading & Subtitle */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FF] border border-[#CFE2FE] text-[#1763CC] text-xs font-bold mb-3">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1763CC]" />
                    <span>Secure Regulatory Gateway</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight">
                    Welcome Back
                  </h1>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed">
                    Sign in to access your AuthenX workspace. Select your portal role context below.
                  </p>
                </div>

                {/* 3. Four Role Selection Cards */}
                <RoleSelectionCards
                  selectedRole={selectedRole}
                  onSelectRole={handleRoleSelect}
                  error={roleError}
                />

                {/* 4. Login Form */}
                <LoginForm
                  selectedRole={selectedRole}
                  onRoleSelected={handleRoleSelect}
                  onLoginSuccess={handleLoginSuccess}
                  roleError={roleError}
                  setRoleError={setRoleError}
                />
              </>
            ) : (
              /* Authenticated User Session Card */
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-emerald-900">
                      Authentication & Role Verified!
                    </h2>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Your identity and authorized statutory permissions were successfully validated.
                    </p>
                  </div>
                </div>

                {/* Verified Profile Card */}
                <div className="p-6 rounded-2xl bg-[#F4F8FF] border border-[#CFE2FE] space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1763CC] bg-white px-2.5 py-1 rounded-full border border-[#CFE2FE]">
                        Active Authorized Session
                      </span>
                      <h3 className="text-xl font-extrabold text-[#0B1B3A] mt-2">
                        {authenticatedUser.name}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {authenticatedUser.email}
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-full bg-[#1763CC]/10 text-[#1763CC] flex items-center justify-center font-bold text-base border border-[#1763CC]/20">
                      {authenticatedUser.name.charAt(0)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#CFE2FE] text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Verified Role:</span>
                      <span className="font-bold text-[#0B1B3A] flex items-center gap-1.5 mt-0.5">
                        <UserCheck className="w-3.5 h-3.5 text-[#1763CC]" />
                        {getRoleTitle(authenticatedUser.authorizedRole)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Designation:</span>
                      <span className="font-semibold text-slate-700 mt-0.5 block">
                        {authenticatedUser.designation}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Organization / Office:</span>
                      <span className="font-semibold text-slate-700 mt-0.5 block">
                        {authenticatedUser.organization}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Designated Workspace:</span>
                      <span className="font-semibold text-teal-700 mt-0.5 block">
                        {getRoleWorkspaceLabel(authenticatedUser.authorizedRole)}
                      </span>
                    </div>

                    <div className="sm:col-span-2 text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Session Started: {authenticatedUser.lastLogin}</span>
                    </div>
                  </div>
                </div>

                {/* Next Steps / Workspace Action */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {authenticatedUser.authorizedRole === 'COMPLIANCE_OFFICER' && (
                      <>
                        <button
                          type="button"
                          onClick={() => navigate('/officer-dashboard')}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#1763CC] hover:bg-[#1251A8] transition-colors shadow-md cursor-pointer"
                        >
                          <span>Proceed to AICTE Officer Dashboard</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate('/regulatory-compliance')}
                          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-[#1763CC] bg-[#EAF2FF] hover:bg-blue-100 border border-[#CFE2FE] transition-colors cursor-pointer"
                        >
                          <span>Regulatory Compliance Verification</span>
                        </button>
                      </>
                    )}

                    {authenticatedUser.authorizedRole === 'DOCUMENT_VERIFICATION_OFFICER' && (
                      <>
                        <button
                          type="button"
                          onClick={() => navigate('/issuing-authority')}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#1763CC] hover:bg-[#1251A8] transition-colors shadow-md cursor-pointer"
                        >
                          <span>Proceed to Issuing Authority Verification</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate('/document-authentication')}
                          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-[#1763CC] bg-[#EAF2FF] hover:bg-blue-100 border border-[#CFE2FE] transition-colors cursor-pointer"
                        >
                          <span>Anomaly Detection Workspace</span>
                        </button>
                      </>
                    )}

                    {authenticatedUser.authorizedRole === 'REGULATORY_ADMIN' && (
                      <>
                        <button
                          type="button"
                          onClick={() => navigate('/officer-dashboard')}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#1763CC] hover:bg-[#1251A8] transition-colors shadow-md cursor-pointer"
                        >
                          <span>Proceed to Regulatory Officer Dashboard</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate('/rules-configuration')}
                          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-[#1763CC] bg-[#EAF2FF] hover:bg-blue-100 border border-[#CFE2FE] transition-colors cursor-pointer"
                        >
                          <span>Regulatory Rules Configuration</span>
                        </button>
                      </>
                    )}

                    {authenticatedUser.authorizedRole === 'INSTITUTION_ADMIN' && (
                      <>
                        <button
                          type="button"
                          onClick={() => navigate('/institution-portal')}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#1763CC] hover:bg-[#1251A8] transition-colors shadow-md cursor-pointer"
                        >
                          <span>Proceed to Institution Application Portal</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate('/documents')}
                          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-[#1763CC] bg-[#EAF2FF] hover:bg-blue-100 border border-[#CFE2FE] transition-colors cursor-pointer"
                        >
                          <span>Statutory Documents Vault</span>
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-slate-500" />
                      <span>Sign Out / Switch Role</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Lightweight Bottom Copyright Footer */}
      <footer className="py-3 px-6 bg-white border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
        AuthenX AICTE Sandbox • Secure Login & Role Authorization • AICTE Trust & Regulatory Framework
      </footer>
    </div>
  );
};
