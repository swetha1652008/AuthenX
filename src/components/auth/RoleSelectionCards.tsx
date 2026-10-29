import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  FileSearch, 
  Landmark, 
  Check, 
  Info 
} from 'lucide-react';
import type { UserRoleId } from '../../types/auth';
import { SYSTEM_ROLES } from '../../services/authService';

interface RoleSelectionCardsProps {
  selectedRole: UserRoleId | null;
  onSelectRole: (role: UserRoleId) => void;
  error?: string | null;
}

export const RoleSelectionCards: React.FC<RoleSelectionCardsProps> = ({
  selectedRole,
  onSelectRole,
  error,
}) => {
  const getRoleIcon = (roleId: UserRoleId) => {
    switch (roleId) {
      case 'INSTITUTION_ADMIN':
        return Building2;
      case 'COMPLIANCE_OFFICER':
        return ShieldCheck;
      case 'DOCUMENT_VERIFICATION_OFFICER':
        return FileSearch;
      case 'REGULATORY_ADMIN':
        return Landmark;
      default:
        return ShieldCheck;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#0B1B3A] uppercase tracking-wider">
          Select Your Portal Role Context <span className="text-rose-500">*</span>
        </label>
        <span className="text-[11px] text-[#64748B]">Choose 1 role context</span>
      </div>

      {/* 2 x 2 Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5" role="radiogroup" aria-label="Portal Role Selection">
        {SYSTEM_ROLES.map((role) => {
          const isSelected = selectedRole === role.id;
          const RoleIcon = getRoleIcon(role.id);

          return (
            <div
              key={role.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onSelectRole(role.id)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onSelectRole(role.id);
                }
              }}
              className={`relative rounded-xl p-4 cursor-pointer transition-all duration-200 select-none flex flex-col justify-between text-left focus:outline-none focus:ring-2 focus:ring-[#1763CC] focus:ring-offset-2 ${
                isSelected
                  ? 'bg-[#EAF2FF] border-2 border-[#1763CC] shadow-sm transform scale-[1.01]'
                  : 'bg-white hover:bg-[#F4F8FF] border border-[#E2E8F0] hover:border-[#1763CC]/50 shadow-subtle'
              }`}
            >
              {/* Selected Checkmark Indicator */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-[#1763CC] text-white shadow-sm'
                      : 'bg-[#F4F8FF] text-[#1763CC] border border-[#CFE2FE]'
                  }`}
                >
                  <RoleIcon className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-[#64748B] bg-white/80 px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                    {role.badge}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#1763CC] text-white ring-2 ring-[#EAF2FF]'
                        : 'border border-[#CBD5E1] bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h4
                  className={`text-sm font-bold transition-colors ${
                    isSelected ? 'text-[#0B1B3A]' : 'text-[#1E293B]'
                  }`}
                >
                  {role.title}
                </h4>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  {role.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Selection Error Notice */}
      {error && (
        <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 pt-1 animate-fadeIn">
          <Info className="w-3.5 h-3.5" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
