import { ClipboardCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import type { AccessReviewQueueItem } from '../../types/securityAccess';

interface Props {
  reviews: AccessReviewQueueItem[];
  onUpdateReview: (
    id: string,
    status: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUIRED',
    remarks: string
  ) => void;
}

export const AccessReviewQueueSection: React.FC<Props> = ({
  reviews,
  onUpdateReview,
}) => {
  const getStatusBadge = (status: AccessReviewQueueItem['status']) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'CHANGES_REQUIRED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PENDING':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-bold text-[#102B4E] flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-[#0F766E]" />
          Periodic Privileged Access Review Queue
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Quarterly re-certification of administrative and scrutiny committee roles to prevent privilege creep.
        </p>
      </div>

      <div className="space-y-3">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#102B4E] text-xs">
                  {rev.accountName}
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                  {rev.currentRole.replace(/_/g, ' ')}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(rev.status)}`}>
                  {rev.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-600">{rev.findings}</p>
              <div className="text-[10px] text-slate-400 font-medium">
                Reviewer: <span className="text-slate-600">{rev.reviewer}</span> • Due Date: {rev.dueDate}
                {rev.remarks && (
                  <span className="text-purple-700 ml-2 font-semibold">Remarks: {rev.remarks}</span>
                )}
              </div>
            </div>

            {rev.status === 'PENDING' && (
              <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
                <button
                  type="button"
                  onClick={() => onUpdateReview(rev.id, 'APPROVED', 'Privileges verified against statutory appointment roster.')}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve Role
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateReview(rev.id, 'CHANGES_REQUIRED', 'Demotion or adjustment requested due to changed assignment.')}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <AlertCircle className="w-3.5 h-3.5" /> Request Changes
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
