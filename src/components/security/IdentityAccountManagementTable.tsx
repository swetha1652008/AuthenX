import React, { useState, useMemo } from 'react';
import { 
  Search, 
  KeyRound, 
  LogOut, 
  UserX, 
  UserCheck, 
  UserCog, 
  ChevronLeft, 
  ChevronRight,
  Smartphone
} from 'lucide-react';
import type { SecurityUserAccount, AccountStatus } from '../../types/securityAccess';
import type { UserRoleId } from '../../types/auth';

interface Props {
  users: SecurityUserAccount[];
  onUpdateStatus: (id: string, status: AccountStatus, reason: string) => void;
  onUpdateRole: (id: string, role: UserRoleId, reason: string) => void;
  onResetPassword: (id: string) => void;
  onRevokeSessions: (id: string) => void;
}

export const IdentityAccountManagementTable: React.FC<Props> = ({
  users,
  onUpdateStatus,
  onUpdateRole,
  onResetPassword,
  onRevokeSessions,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [roleChangeTarget, setRoleChangeTarget] = useState<SecurityUserAccount | null>(null);
  const [newSelectedRole, setNewSelectedRole] = useState<UserRoleId>('COMPLIANCE_OFFICER');

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRole = roleFilter === 'ALL' || u.assignedRole === roleFilter;
      const matchStatus = statusFilter === 'ALL' || u.accountStatus === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getRoleBadge = (role: UserRoleId) => {
    switch (role) {
      case 'REGULATORY_ADMIN':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'COMPLIANCE_OFFICER':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DOCUMENT_VERIFICATION_OFFICER':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'INSTITUTION_ADMIN':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: AccountStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SUSPENDED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'LOCKED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Search and Filters Bar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search identity by name, email, department, or institutional ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by Assigned Role"
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
          >
            <option value="ALL">All Assigned Roles</option>
            <option value="REGULATORY_ADMIN">Regulatory Administrator</option>
            <option value="COMPLIANCE_OFFICER">Compliance Officer</option>
            <option value="DOCUMENT_VERIFICATION_OFFICER">Doc Verification Officer</option>
            <option value="INSTITUTION_ADMIN">Institution Administrator</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by Account Status"
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
          >
            <option value="ALL">All Account Statuses</option>
            <option value="ACTIVE">Active Accounts</option>
            <option value="SUSPENDED">Suspended Accounts</option>
            <option value="LOCKED">Locked Accounts</option>
          </select>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">User Identity & Email</th>
              <th className="py-3 px-3">Organization & Unit</th>
              <th className="py-3 px-3">Assigned Role</th>
              <th className="py-3 px-3">Security & MFA</th>
              <th className="py-3 px-3">Active Sessions</th>
              <th className="py-3 px-3">Account Status</th>
              <th className="py-3 px-4 text-right">Privileged Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-[#102B4E]">{user.name}</div>
                  <div className="font-mono text-[11px] text-slate-500">{user.email}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">ID: {user.id}</div>
                </td>

                <td className="py-3 px-3 max-w-xs">
                  <div className="font-semibold text-slate-800 line-clamp-1">{user.organization}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-1">{user.department}</div>
                </td>

                <td className="py-3 px-3">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRoleBadge(user.assignedRole)}`}>
                    {user.assignedRole.replace(/_/g, ' ')}
                  </span>
                </td>

                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                    <span>MFA:</span>
                    <span className={`font-bold ${user.mfaStatus === 'ENABLED' ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {user.mfaStatus}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Last: {user.lastLogin}
                  </div>
                </td>

                <td className="py-3 px-3 font-mono text-[11px]">
                  <span className="font-bold text-slate-700">{user.activeSessionCount}</span> active
                  {user.failedLoginCount > 0 && (
                    <div className="text-[10px] text-rose-600 font-semibold">
                      {user.failedLoginCount} failed attempt{user.failedLoginCount === 1 ? '' : 's'}
                    </div>
                  )}
                </td>

                <td className="py-3 px-3">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(user.accountStatus)}`}>
                    {user.accountStatus}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Password Reset */}
                    <button
                      type="button"
                      onClick={() => onResetPassword(user.id)}
                      title="Dispatch Secure Password Reset Token"
                      className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>

                    {/* Revoke Sessions */}
                    <button
                      type="button"
                      onClick={() => onRevokeSessions(user.id)}
                      title="Revoke Active JWT Sessions"
                      className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg border border-slate-200 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>

                    {/* Change Role */}
                    <button
                      type="button"
                      onClick={() => {
                        setRoleChangeTarget(user);
                        setNewSelectedRole(user.assignedRole);
                      }}
                      title="Reassign Role & Permissions"
                      className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg border border-slate-200 transition-colors"
                    >
                      <UserCog className="w-3.5 h-3.5" />
                    </button>

                    {/* Suspend / Reactivate */}
                    {user.accountStatus === 'ACTIVE' ? (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(user.id, 'SUSPENDED', 'Administrative lock applied from security console.')}
                        title="Suspend Account"
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(user.id, 'ACTIVE', 'Reactivated by authorized security administrator.')}
                        title="Reactivate Account"
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-700">{(currentPage - 1) * pageSize + 1}</span> to{' '}
          <span className="font-semibold text-slate-700">
            {Math.min(currentPage * pageSize, filteredUsers.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-700">{filteredUsers.length}</span> user accounts
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-medium text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal for Role Reassignment */}
      {roleChangeTarget && (
        <div className="fixed inset-0 z-50 bg-[#0A192F]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-[#102B4E]">
              Reassign Role: {roleChangeTarget.name}
            </h3>
            <p className="text-xs text-slate-500">
              Select statutory permission profile for {roleChangeTarget.email}. Actions are audited.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Target Role</label>
              <select
                value={newSelectedRole}
                onChange={(e) => setNewSelectedRole(e.target.value as UserRoleId)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="REGULATORY_ADMIN">Regulatory Administrator (Full Council Admin)</option>
                <option value="COMPLIANCE_OFFICER">Compliance Officer (Scrutiny Committee)</option>
                <option value="DOCUMENT_VERIFICATION_OFFICER">Document Verification Officer (NIC/BBMP Node)</option>
                <option value="INSTITUTION_ADMIN">Institution Administrator (Applicant Campus)</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRoleChangeTarget(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateRole(roleChangeTarget.id, newSelectedRole, 'Role reassigned via Security Admin Console.');
                  setRoleChangeTarget(null);
                }}
                className="px-5 py-2 bg-[#0F766E] hover:bg-[#115e59] text-white rounded-xl text-xs font-bold"
              >
                Confirm Reassignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
