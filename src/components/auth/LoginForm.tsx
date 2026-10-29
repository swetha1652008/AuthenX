import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  ShieldAlert,
  KeyRound
} from 'lucide-react';
import type { UserRoleId, UserAccount } from '../../types/auth';
import { authService } from '../../services/authService';

interface LoginFormProps {
  selectedRole: UserRoleId | null;
  onRoleSelected: (role: UserRoleId) => void;
  onLoginSuccess: (user: UserAccount, role: UserRoleId) => void;
  roleError: string | null;
  setRoleError: (error: string | null) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  selectedRole,
  onRoleSelected,
  onLoginSuccess,
  roleError: _roleError,
  setRoleError,
}) => {
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Validation & Error State
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modals & Helpers
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(true);

  // Email format validation helper
  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const validateForm = (): boolean => {
    let valid = true;

    // 1. Role must be selected
    if (!selectedRole) {
      setRoleError('Please select a portal role context above before signing in.');
      valid = false;
    } else {
      setRoleError(null);
    }

    // 2. Email validation
    if (!email.trim()) {
      setEmailError('Official email address is required.');
      valid = false;
    } else if (!isValidEmail(email.trim())) {
      setEmailError('Please enter a valid official email address (e.g. officer@aicte.gov.in).');
      valid = false;
    } else {
      setEmailError(null);
    }

    // 3. Password validation
    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      valid = false;
    } else {
      setPasswordError(null);
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validateForm()) return;
    if (!selectedRole) return;

    setIsLoading(true);

    try {
      const result = await authService.login(email, password, selectedRole);

      if (result.success && result.user) {
        onLoginSuccess(result.user, selectedRole);
      } else {
        setAuthError(result.error || 'Authentication failed. Please check your credentials.');
      }
    } catch {
      setAuthError('A network error occurred while connecting to the authentication service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill helper for hackathon demo evaluators
  const handleQuickFill = (roleId: UserRoleId, demoEmail: string, demoPass: string) => {
    onRoleSelected(roleId);
    setEmail(demoEmail);
    setPassword(demoPass);
    setEmailError(null);
    setPasswordError(null);
    setAuthError(null);
    setRoleError(null);
  };

  // Instant 1-click login for demo evaluators
  const handleQuickLogin = async (e: React.MouseEvent, roleId: UserRoleId, demoEmail: string, demoPass: string) => {
    e.stopPropagation();
    handleQuickFill(roleId, demoEmail, demoPass);
    setIsLoading(true);
    setAuthError(null);
    try {
      const result = await authService.login(demoEmail, demoPass, roleId);
      if (result.success && result.user) {
        onLoginSuccess(result.user, roleId);
      } else {
        setAuthError(result.error || 'Authentication failed.');
      }
    } catch {
      setAuthError('Authentication service connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = authService.getAvailableDemoCredentials();

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5 pt-3" noValidate>
        {/* Authentication Error Banner */}
        {authError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3 animate-fadeIn">
            <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-rose-900">Authentication Error</p>
              <p className="leading-relaxed">{authError}</p>
            </div>
          </div>
        )}

        {/* 1. Official Email Address Input */}
        <div>
          <label
            htmlFor="official-email"
            className="block text-xs font-bold text-[#0B1B3A] uppercase tracking-wider mb-1.5"
          >
            Official Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="official-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(null);
              }}
              placeholder="e.g. officer@aicte.gov.in or admin@institution.edu"
              disabled={isLoading}
              className={`w-full pl-10 pr-4 py-3 bg-white border text-sm text-[#0B1B3A] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1763CC] focus:border-transparent transition-all placeholder-slate-400 ${
                emailError
                  ? 'border-rose-300 bg-rose-50/30'
                  : 'border-[#CFE2FE] hover:border-[#1763CC]/50'
              }`}
            />
          </div>
          {emailError && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{emailError}</span>
            </p>
          )}
        </div>

        {/* 2. Password Input & Show/Hide Toggle */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="auth-password"
              className="block text-xs font-bold text-[#0B1B3A] uppercase tracking-wider"
            >
              Password <span className="text-rose-500">*</span>
            </label>
            {/* 5. Forgot Password Link */}
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-xs font-semibold text-[#1763CC] hover:text-[#0B1B3A] hover:underline focus:outline-none cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="auth-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(null);
              }}
              placeholder="Enter your security credential"
              disabled={isLoading}
              className={`w-full pl-10 pr-11 py-3 bg-white border text-sm text-[#0B1B3A] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1763CC] focus:border-transparent transition-all placeholder-slate-400 ${
                passwordError
                  ? 'border-rose-300 bg-rose-50/30'
                  : 'border-[#CFE2FE] hover:border-[#1763CC]/50'
              }`}
            />
            {/* 3. Password show/hide icon */}
            <button
              type="button"
              tabIndex={0}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#1763CC] focus:outline-none cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {passwordError && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{passwordError}</span>
            </p>
          )}
        </div>

        {/* 4. Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 rounded text-[#1763CC] border-[#CFE2FE] focus:ring-[#1763CC] cursor-pointer"
            />
            <span className="text-xs text-[#475569] font-medium">
              Remember me on this trusted terminal
            </span>
          </label>
        </div>

        {/* 6. Full-Width "Sign In Securely →" Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-[#1763CC] hover:bg-[#1251A8] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1763CC] focus:ring-offset-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying Authorization & Role...</span>
              </>
            ) : (
              <>
                <span>Sign In Securely</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Security & Regulatory Disclaimer Callout */}
        <div className="pt-2 flex items-center justify-center gap-2 text-center text-[11px] text-[#64748B]">
          <KeyRound className="w-3.5 h-3.5 text-[#1763CC]" />
          <span>All portal access attempts are logged for AICTE regulatory audit compliance.</span>
        </div>
      </form>

      {/* Demo Credentials Helper Pill Bar (For Evaluators & Hackathon Reviewers) */}
      <div className="mt-8 pt-5 border-t border-[#E2E8F0]">
        <div className="flex items-center justify-between mb-2.5">
          <button
            type="button"
            onClick={() => setShowDemoCredentials(!showDemoCredentials)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1763CC] hover:text-[#0B1B3A] cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Demo Test Credentials (1-Click Auto-Fill)</span>
          </button>
          <span className="text-[10px] text-slate-400">Click to load role</span>
        </div>

        {showDemoCredentials && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {demoAccounts.map((demo) => {
              const isCurrentSelected = selectedRole === demo.roleId && email === demo.email;
              return (
                <div
                  key={demo.email}
                  onClick={() => handleQuickFill(demo.roleId, demo.email, demo.password)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isCurrentSelected
                      ? 'bg-[#EAF2FF] border-[#1763CC] text-[#0B1B3A]'
                      : 'bg-white hover:bg-[#F4F8FF] border-[#E2E8F0] text-[#475569]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] text-[#1763CC]">{demo.roleTitle}</span>
                      {isCurrentSelected && <CheckCircle2 className="w-3 h-3 text-[#1763CC]" />}
                    </div>
                    <div className="text-[10px] text-slate-700 font-medium truncate mt-0.5" title={demo.org}>
                      {demo.name}
                    </div>
                    <div className="font-mono text-[10px] text-slate-500 mt-0.5 truncate">{demo.email}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Password: {demo.password}</div>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[9px] text-slate-400">Click to fill</span>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={(e) => handleQuickLogin(e, demo.roleId, demo.email, demo.password)}
                      className="text-[10px] font-bold text-white bg-[#1763CC] hover:bg-[#1251A8] px-2 py-0.5 rounded shadow-sm transition-colors cursor-pointer"
                    >
                      Instant Login →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Forgot Password Modal (No fake success message, user-friendly explanation) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-[#EAF2FF] flex items-center justify-center text-[#1763CC]">
                <KeyRound className="w-5 h-5 text-[#1763CC]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B1B3A]">Password Reset Unavailable</h3>
                <p className="text-xs text-slate-500">Self-service reset is disabled in sandbox</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
              AuthenX operates within a protected institutional governance framework. In this demo
              environment, automated self-service password reset is disabled.
              <br /><br />
              Please use the pre-configured test credentials provided in the <strong>Demo Test Credentials</strong> panel below the form, or contact your Regional AICTE Scrutiny Administrator for credential re-provisioning.
            </p>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#1763CC] hover:bg-[#1251A8] transition-colors cursor-pointer"
              >
                Understood, Return to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
