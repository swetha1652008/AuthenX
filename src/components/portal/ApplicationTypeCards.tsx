import React, { useState } from 'react';
import { 
  Building2, 
  FileEdit, 
  ArrowRight, 
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import type { ApplicationType, ChangeCategory } from '../../types/institution';

interface ApplicationTypeCardsProps {
  onStartApplication: (
    type: ApplicationType,
    academicYear: string,
    changeCategory?: ChangeCategory
  ) => void;
}

export const ApplicationTypeCards: React.FC<ApplicationTypeCardsProps> = ({
  onStartApplication,
}) => {
  // EoA Card State
  const [eoaYear, setEoaYear] = useState('2026-2027');

  // Changes Card State
  const [changeYear, setChangeYear] = useState('2026-2027');
  const [selectedCategory, setSelectedCategory] = useState<ChangeCategory>('Intake Changes');

  const changeCategories: ChangeCategory[] = [
    'Course / Programme Changes',
    'Intake Changes',
    'Faculty Information Updates',
    'Institution Information Changes',
    'Other Authorized Changes',
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* CARD 1: EXTENSION OF APPROVAL (EoA) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CFE2FE] shadow-card flex flex-col justify-between hover:border-[#2563EB]/40 transition-all">
        <div>
          {/* Top Badge & Icon */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF2FF] border border-[#CFE2FE] flex items-center justify-center text-[#2563EB] flex-shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-bold text-[#0D9488] bg-[#DDF7FA] border border-[#B2EBF2] px-3 py-1 rounded-full uppercase tracking-wider">
              Annual Mandate
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-[#102B4E]">
            Extension of Approval (EoA)
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Prepare your Extension of Approval application for the selected academic year.
            Verifies land compliance, building plans, faculty ratios, and statutory NOCs against AICTE handbook norms.
          </p>

          {/* Academic Year Selector */}
          <div className="mt-5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <label className="block text-xs font-bold text-[#102B4E] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Select Academic Year</span>
            </label>
            <select
              value={eoaYear}
              onChange={(e) => setEoaYear(e.target.value)}
              className="w-full bg-white border border-[#CFE2FE] rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="2026-2027">Academic Year 2026–2027 (Current Cycle)</option>
              <option value="2027-2028">Academic Year 2027–2028 (Advance Planning)</option>
            </select>
          </div>
        </div>

        {/* Start EoA Button */}
        <div className="pt-6 mt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onStartApplication('EOA', eoaYear)}
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <span>Start EoA Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CARD 2: APPROVAL-RELATED CHANGES */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CFE2FE] shadow-card flex flex-col justify-between hover:border-[#2563EB]/40 transition-all">
        <div>
          {/* Top Badge & Icon */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-[#DDF7FA] border border-[#B2EBF2] flex items-center justify-center text-[#0A588C] flex-shrink-0">
              <FileEdit className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-bold text-[#2563EB] bg-[#EAF2FF] border border-[#CFE2FE] px-3 py-1 rounded-full uppercase tracking-wider">
              Change Filings
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-[#102B4E]">
            Approval-related Changes
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Submit and manage requests for changes to institution or programme information.
            AI cross-references proposed modifications against existing baseline approvals and safety thresholds.
          </p>

          {/* Change Controls Grid */}
          <div className="mt-5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#102B4E] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Academic Year Cycle</span>
              </label>
              <select
                value={changeYear}
                onChange={(e) => setChangeYear(e.target.value)}
                className="w-full bg-white border border-[#CFE2FE] rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="2026-2027">Academic Year 2026–2027</option>
                <option value="2027-2028">Academic Year 2027–2028</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#102B4E] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Select Permitted Change Category</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ChangeCategory)}
                className="w-full bg-white border border-[#CFE2FE] rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                {changeCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Regulatory Rule Note */}
            <div className="flex items-start gap-2 text-[11px] text-slate-500 pt-1">
              <Info className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <span>
                Permitted per Chapter II of AICTE APH 2026-27. Additional NOCs required for intake expansion.
              </span>
            </div>
          </div>
        </div>

        {/* Start Change Button */}
        <div className="pt-6 mt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onStartApplication('CHANGE', changeYear, selectedCategory)}
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-[#102B4E] bg-[#EAF2FF] hover:bg-[#2563EB] hover:text-white border border-[#CFE2FE] active:scale-[0.99] transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <span>Start Change Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
