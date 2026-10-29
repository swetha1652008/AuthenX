import React, { useState } from 'react';
import { Shield, Check, X, Info } from 'lucide-react';
import type { 
  RolePermissionMapping, 
  SecurityModuleKey, 
  SecurityActionKey 
} from '../../types/securityAccess';
import type { UserRoleId } from '../../types/auth';

interface Props {
  permissionMatrix: RolePermissionMapping;
  onUpdatePermission: (
    role: UserRoleId,
    module: SecurityModuleKey,
    actions: SecurityActionKey[]
  ) => void;
}

export const RolePermissionMatrixView: React.FC<Props> = ({
  permissionMatrix,
  onUpdatePermission,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRoleId>('COMPLIANCE_OFFICER');

  const modules: { id: SecurityModuleKey; label: string; desc: string }[] = [
    {
      id: 'APPLICATION_MANAGEMENT',
      label: 'Application Lifecycle Management',
      desc: 'Creation, tracking, submission, and state modification of institutional applications.',
    },
    {
      id: 'DOCUMENT_VAULT',
      label: 'Document Upload & Vault',
      desc: 'Digital evidence repository, replacements, and certificate storage.',
    },
    {
      id: 'AI_VALIDATION',
      label: 'AI Pre-Validation & Extraction',
      desc: 'Execution of OCR engines, computer vision analysis, and heuristic gap scans.',
    },
    {
      id: 'HUMAN_REVIEW',
      label: 'Human Review & Rectification',
      desc: 'Scrutiny committee remarks, evidence requests, and rectification workflow tasks.',
    },
    {
      id: 'REGULATORY_RULES',
      label: 'Regulatory Rules Configuration',
      desc: 'Codification, versioning, review, and publication of statutory handbook rules.',
    },
    {
      id: 'SECURITY_ADMIN',
      label: 'Security & Access Administration',
      desc: 'Identity management, role assignment, policy controls, and audit explorer.',
    },
  ];

  const actions: { id: SecurityActionKey; label: string }[] = [
    { id: 'VIEW', label: 'View / Read' },
    { id: 'CREATE', label: 'Create Records' },
    { id: 'EDIT', label: 'Edit Drafts' },
    { id: 'REVIEW', label: 'Scrutiny Review' },
    { id: 'APPROVE', label: 'Formal Approval' },
    { id: 'EXPORT', label: 'Export Reports' },
    { id: 'ADMINISTER', label: 'Administer' },
  ];

  const currentRolePerms = permissionMatrix[selectedRole] || {};

  const handleToggleAction = (module: SecurityModuleKey, action: SecurityActionKey) => {
    const existing = currentRolePerms[module] || [];
    let updated: SecurityActionKey[];
    if (existing.includes(action)) {
      updated = existing.filter((a) => a !== action);
    } else {
      updated = [...existing, action];
    }
    onUpdatePermission(selectedRole, module, updated);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
      {/* Header and Role Picker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-base font-bold text-[#102B4E] flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#0F766E]" />
            Fine-Grained Role & Permission Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Principle of Least Privilege: Configure granular module action rights for each authorized role.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          {(['REGULATORY_ADMIN', 'COMPLIANCE_OFFICER', 'DOCUMENT_VERIFICATION_OFFICER', 'INSTITUTION_ADMIN'] as UserRoleId[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRole(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedRole === r
                  ? 'bg-white text-[#102B4E] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Info notice */}
      <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center gap-2 text-teal-800 text-xs">
        <Info className="w-4 h-4 text-teal-600 shrink-0" />
        <span>
          Editing permissions for <strong>{selectedRole.replace(/_/g, ' ')}</strong>.
          Changes update server-side role mappings in real-time.
        </span>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 w-1/3">Target Functional Module</th>
              {actions.map((act) => (
                <th key={act.id} className="py-3 px-2 text-center">
                  {act.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {modules.map((mod) => {
              const activeActions = currentRolePerms[mod.id] || [];
              return (
                <tr key={mod.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#102B4E] text-[12px]">{mod.label}</div>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{mod.desc}</p>
                  </td>
                  {actions.map((act) => {
                    const isGranted = activeActions.includes(act.id);
                    return (
                      <td key={act.id} className="py-3.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAction(mod.id, act.id)}
                          title={`${isGranted ? 'Revoke' : 'Grant'} ${act.label} on ${mod.label}`}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                            isGranted
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                              : 'bg-slate-50 text-slate-300 border border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {isGranted ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <X className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
