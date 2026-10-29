import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Save, 
  UploadCloud, 
  Trash2, 
  Plus, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Info,
  Loader2
} from 'lucide-react';
import type { 
  InstitutionApplication, 
  ApplicationType, 
  ChangeCategory, 
  CourseItem, 
  DocumentItem, 
  DegreeLevel, 
  DocumentCategory,
  ValidationFinding 
} from '../../types/institution';
import { institutionService } from '../../services/institutionService';
import { extractRealTextFromFile, validateExtractedDocument } from '../../services/realOcrService';

interface ApplicationWizardModalProps {
  initialApplication?: InstitutionApplication;
  initialType?: ApplicationType;
  initialYear?: string;
  initialCategory?: ChangeCategory;
  onClose: () => void;
  onSaved: (app: InstitutionApplication) => void;
}

export const ApplicationWizardModal: React.FC<ApplicationWizardModalProps> = ({
  initialApplication,
  initialType = 'EOA',
  initialYear = '2026-2027',
  initialCategory,
  onClose,
  onSaved,
}) => {
  // Step State (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [statutoryAgreed, setStatutoryAgreed] = useState(false);
  const [validationRun, setValidationRun] = useState(false);
  const [validationFindings, setValidationFindings] = useState<ValidationFinding[]>(
    initialApplication ? initialApplication.findings : []
  );
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);

  // Form State initialized from initialApplication or new application template
  const [appData, setAppData] = useState<InstitutionApplication>(() => {
    if (initialApplication) return { ...initialApplication };
    return institutionService.createNewApplication(
      initialType,
      initialYear,
      initialCategory,
      initialType === 'EOA'
        ? `Extension of Approval (EoA) Application for AY ${initialYear}`
        : `Approval-related Change for ${initialCategory || 'Intake Changes'}`
    );
  });

  // Step 3 Course draft modal
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [courseForm, setCourseForm] = useState<Omit<CourseItem, 'id'>>({
    programmeName: '',
    degreeLevel: 'Undergraduate',
    programmeIdentifier: '',
    approvedIntake: 60,
    proposedIntake: 60,
    facultyCount: 4,
  });

  // Step 4 Document upload simulation
  const [selectedDocCategory, setSelectedDocCategory] = useState<DocumentCategory>(
    'Affidavits and Undertakings'
  );

  const steps = [
    { num: 1, title: 'Application Details', desc: 'Type & Purpose' },
    { num: 2, title: 'Institution Info', desc: 'Profile & Contacts' },
    { num: 3, title: 'Courses & Faculty', desc: 'Academic Intakes' },
    { num: 4, title: 'Supporting Docs', desc: 'Certificates Vault' },
    { num: 5, title: 'Review & Submit', desc: 'AI Audit & Finalize' },
  ];

  // ==================== Step 3 Course Handlers ====================
  const handleOpenCourseModal = (course?: CourseItem) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({
        programmeName: course.programmeName,
        degreeLevel: course.degreeLevel,
        programmeIdentifier: course.programmeIdentifier,
        approvedIntake: course.approvedIntake,
        proposedIntake: course.proposedIntake,
        facultyCount: course.facultyCount,
      });
    } else {
      setEditingCourse(null);
      setCourseForm({
        programmeName: '',
        degreeLevel: 'Undergraduate',
        programmeIdentifier: `1-${Math.floor(100 + Math.random() * 900)}-UG`,
        approvedIntake: 60,
        proposedIntake: 60,
        facultyCount: 4,
      });
    }
    setShowCourseModal(true);
  };

  const handleSaveCourse = () => {
    if (!courseForm.programmeName.trim()) return;

    const ratioStatus =
      courseForm.facultyCount >= Math.ceil(courseForm.proposedIntake / 15)
        ? 'Compliant (1:15)'
        : `Deficit (Min ${Math.ceil(courseForm.proposedIntake / 15)} required)`;

    if (editingCourse) {
      const updatedCourses = appData.courses.map((c) =>
        c.id === editingCourse.id ? { ...c, ...courseForm, facultyRatioStatus: ratioStatus } : c
      );
      setAppData({ ...appData, courses: updatedCourses });
    } else {
      const newCourse: CourseItem = {
        id: `crs_${Date.now()}`,
        ...courseForm,
        facultyRatioStatus: ratioStatus,
      };
      setAppData({ ...appData, courses: [...appData.courses, newCourse] });
    }

    setShowCourseModal(false);
  };

  const handleDeleteCourse = (courseId: string) => {
    setAppData({
      ...appData,
      courses: appData.courses.filter((c) => c.id !== courseId),
    });
  };

  // ==================== Step 4 Document Upload Handlers ====================
  const handleSimulatedFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const newDocId = `doc_${Date.now()}`;
    setIsProcessingDoc(true);

    try {
      // Execute Real OCR & Validation on the uploaded certificate
      const ocrRes = await extractRealTextFromFile(file);
      const valRes = validateExtractedDocument(
        newDocId,
        file.name,
        'No Objection Certificate (NOC)',
        ocrRes.text,
        appData
      );
      const isDeficient = valRes.anomalies.some((a) => a.severity === 'CRITICAL');

      const newDoc: DocumentItem = {
        id: newDocId,
        name: file.name,
        category: selectedDocCategory,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        status: isDeficient ? 'Mismatch' : 'Verified',
        verificationSource: isDeficient ? 'OCR Validation Anomaly Flagged' : 'Client Document OCR',
        isMandatory: true,
      };

      const updatedDocs = [newDoc, ...appData.documents];
      setAppData({
        ...appData,
        documents: updatedDocs,
        validationStatus: isDeficient ? 'Mismatch Detected' : appData.validationStatus,
      });
    } catch {
      const newDoc: DocumentItem = {
        id: newDocId,
        name: file.name,
        category: selectedDocCategory,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Mismatch',
        verificationSource: 'Unreadable Document',
        isMandatory: true,
      };
      setAppData({
        ...appData,
        documents: [newDoc, ...appData.documents],
        validationStatus: 'Mismatch Detected',
      });
    } finally {
      setIsProcessingDoc(false);
    }
  };

  const handleDeleteDocument = (docId: string) => {
    setAppData({
      ...appData,
      documents: appData.documents.filter((d) => d.id !== docId),
    });
  };

  // ==================== Step 5 Review & Validation Handlers ====================
  const handleRunValidation = () => {
    const findings = institutionService.runPreliminaryValidation(appData);
    setValidationFindings(findings);
    setValidationRun(true);

    const hasCritical = findings.some((f) => f.severity === 'CRITICAL');
    setAppData({
      ...appData,
      findings,
      validationStatus: hasCritical ? 'Mismatch Detected' : 'Preliminary Check Passed',
    });
  };

  const handleSaveDraft = () => {
    const saved = institutionService.saveApplication(appData);
    onSaved(saved);
  };

  const handleFinalSubmit = () => {
    if (!statutoryAgreed) return;
    setIsSubmitting(true);
    setSubmitError(null);

    // Pre-flight check: Block submission if critical deficiencies are present
    const findings = institutionService.runPreliminaryValidation(appData);
    const hasCritical = findings.some((f) => f.severity === 'CRITICAL');
    if (hasCritical) {
      setIsSubmitting(false);
      const critTitles = findings.filter((f) => f.severity === 'CRITICAL').map((f) => f.title).join('; ');
      setSubmitError(`Cannot submit application: Critical validation deficiencies detected (${critTitles}). Please rectify before submitting.`);
      return;
    }

    setTimeout(() => {
      const res = institutionService.submitApplication(appData.id);
      setIsSubmitting(false);

      if (res.success && res.application) {
        onSaved(res.application);
      } else {
        setSubmitError(res.error || 'Submission failed. Please check validation findings.');
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Wizard Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-[#F8FAFC]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-[#2563EB] bg-[#EAF2FF] px-2.5 py-0.5 rounded-full border border-[#CFE2FE]">
                {appData.referenceNumber}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                AICTE Application Wizard (Sandbox Demo)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#102B4E]">
              {appData.type === 'EOA'
                ? 'Extension of Approval (EoA) Application'
                : appData.changeCategory || 'Approval-related Change Application'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3.5 py-2 rounded-xl border border-[#CFE2FE] bg-white hover:bg-[#EAF2FF] text-slate-700 hover:text-[#2563EB] text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#2563EB]" />
              <span className="hidden sm:inline">Save Draft</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Close wizard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 5-Step Progress Stepper Bar */}
        <div className="border-b border-slate-200 bg-white px-4 sm:px-8 py-3 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[620px] max-w-4xl mx-auto">
            {steps.map((st, i) => {
              const isDone = currentStep > st.num;
              const isCurrent = currentStep === st.num;
              return (
                <React.Fragment key={st.num}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(st.num)}
                    className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isDone
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : isCurrent
                          ? 'bg-[#2563EB] text-white ring-4 ring-[#EAF2FF]'
                          : 'bg-slate-100 text-slate-500 border border-slate-300'
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : st.num}
                    </div>
                    <div>
                      <span
                        className={`text-xs font-bold block ${
                          isCurrent ? 'text-[#2563EB]' : 'text-slate-700'
                        }`}
                      >
                        {st.title}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{st.desc}</span>
                    </div>
                  </button>

                  {i < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-3 ${
                        currentStep > i + 1 ? 'bg-emerald-400' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Wizard Step Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* ==============================================================
              STEP 1: APPLICATION DETAILS
              ============================================================== */}
          {currentStep === 1 && (
            <div className="space-y-5 max-w-3xl mx-auto animate-fadeIn">
              <div className="p-4 rounded-xl bg-[#EAF2FF] border border-[#CFE2FE] text-xs text-[#102B4E] flex items-center gap-2.5">
                <Info className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                <span>
                  Provide filing purpose and verify the academic year cycle per AICTE Approval Process Handbook.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Application Type
                  </label>
                  <select
                    value={appData.type}
                    onChange={(e) =>
                      setAppData({
                        ...appData,
                        type: e.target.value as ApplicationType,
                        changeCategory:
                          e.target.value === 'CHANGE'
                            ? appData.changeCategory || 'Course / Programme Changes'
                            : undefined,
                      })
                    }
                    className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  >
                    <option value="EOA">Extension of Approval (EoA) — Annual</option>
                    <option value="CHANGE">Approval-related Change Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Academic Year Cycle
                  </label>
                  <select
                    value={appData.academicYear}
                    onChange={(e) => setAppData({ ...appData, academicYear: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  >
                    <option value="2026-2027">Academic Year 2026–2027</option>
                    <option value="2027-2028">Academic Year 2027–2028</option>
                  </select>
                </div>

                {appData.type === 'CHANGE' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Permitted Change Category
                    </label>
                    <select
                      value={appData.changeCategory || 'Course / Programme Changes'}
                      onChange={(e) =>
                        setAppData({ ...appData, changeCategory: e.target.value as ChangeCategory })
                      }
                      className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    >
                      <option value="Course / Programme Changes">Course / Programme Changes</option>
                      <option value="Intake Changes">Intake Changes (Increase / Reduction)</option>
                      <option value="Faculty Information Updates">Faculty Information Updates</option>
                      <option value="Institution Information Changes">Institution Information Changes</option>
                      <option value="Other Authorized Changes">Other Authorized Changes</option>
                    </select>
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Generated Application Reference Number
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={appData.referenceNumber}
                    className="w-full bg-slate-100 font-mono text-xs sm:text-sm text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Assigned uniquely for institutional traceability in sandbox.
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Application Purpose / Institutional Remarks
                  </label>
                  <textarea
                    rows={3}
                    value={appData.purposeRemarks}
                    onChange={(e) => setAppData({ ...appData, purposeRemarks: e.target.value })}
                    placeholder="Provide specific notes regarding this approval cycle or change request..."
                    className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              STEP 2: INSTITUTION INFORMATION
              ============================================================== */}
          {currentStep === 2 && (
            <div className="space-y-4 max-w-3xl mx-auto animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Registered Institution Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={appData.institution.name}
                    onChange={(e) =>
                      setAppData({
                        ...appData,
                        institution: { ...appData.institution, name: e.target.value },
                      })
                    }
                    className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    AICTE Permanent ID (PID) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={appData.institution.aictePermanentId}
                    onChange={(e) =>
                      setAppData({
                        ...appData,
                        institution: { ...appData.institution, aictePermanentId: e.target.value },
                      })
                    }
                    className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-xl px-3 py-2 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    AISHE Code
                  </label>
                  <input
                    type="text"
                    value={appData.institution.aisheCode}
                    onChange={(e) =>
                      setAppData({
                        ...appData,
                        institution: { ...appData.institution, aisheCode: e.target.value },
                      })
                    }
                    className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-xl px-3 py-2 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    State / Union Territory
                  </label>
                  <input
                    type="text"
                    value={appData.institution.state}
                    onChange={(e) =>
                      setAppData({
                        ...appData,
                        institution: { ...appData.institution, state: e.target.value },
                      })
                    }
                    className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={appData.institution.district}
                    onChange={(e) =>
                      setAppData({
                        ...appData,
                        institution: { ...appData.institution, district: e.target.value },
                      })
                    }
                    className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Campus Address
                  </label>
                  <input
                    type="text"
                    value={appData.institution.fullAddress}
                    onChange={(e) =>
                      setAppData({
                        ...appData,
                        institution: { ...appData.institution, fullAddress: e.target.value },
                      })
                    }
                    className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    value={appData.institution.officialEmail}
                    onChange={(e) =>
                      setAppData({
                        ...appData,
                        institution: { ...appData.institution, officialEmail: e.target.value },
                      })
                    }
                    className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Official Contact Number
                  </label>
                  <input
                    type="text"
                    value={appData.institution.contactNumber}
                    onChange={(e) =>
                      setAppData({
                        ...appData,
                        institution: { ...appData.institution, contactNumber: e.target.value },
                      })
                    }
                    className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Authorized Representative Name
                  </label>
                  <input
                    type="text"
                    value={appData.institution.authorizedRepresentative}
                    onChange={(e) =>
                      setAppData({
                        ...appData,
                        institution: {
                          ...appData.institution,
                          authorizedRepresentative: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Designation of Representative
                  </label>
                  <input
                    type="text"
                    value={appData.institution.designation}
                    onChange={(e) =>
                      setAppData({
                        ...appData,
                        institution: { ...appData.institution, designation: e.target.value },
                      })
                    }
                    className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              STEP 3: COURSES & FACULTY
              ============================================================== */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <h4 className="text-sm font-bold text-[#102B4E]">
                    Approved & Proposed Course Programmes
                  </h4>
                  <p className="text-xs text-slate-500">
                    AI computes faculty-student ratio against the 1:15 norm for technical programmes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenCourseModal()}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Course Row</span>
                </button>
              </div>

              {/* Editable Courses Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-slate-200 uppercase font-bold text-slate-600 text-[10px]">
                    <tr>
                      <th className="p-3">Course / Programme Name</th>
                      <th className="p-3">Degree Level</th>
                      <th className="p-3">Approved Intake</th>
                      <th className="p-3">Proposed Intake</th>
                      <th className="p-3">Faculty Count</th>
                      <th className="p-3">Cadre Ratio Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appData.courses.length > 0 ? (
                      appData.courses.map((crs) => (
                        <tr key={crs.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-800">
                            {crs.programmeName}
                            <span className="text-[10px] text-slate-400 block font-mono">
                              {crs.programmeIdentifier}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600">{crs.degreeLevel}</td>
                          <td className="p-3 font-semibold text-slate-700">{crs.approvedIntake}</td>
                          <td className="p-3 font-bold text-[#2563EB]">{crs.proposedIntake}</td>
                          <td className="p-3 font-semibold text-slate-700">{crs.facultyCount}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                (crs.facultyRatioStatus || '').includes('Compliant')
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {crs.facultyRatioStatus || '1:15 Standard'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenCourseModal(crs)}
                                className="px-2 py-1 rounded bg-slate-100 hover:bg-[#2563EB] hover:text-white text-slate-600 text-[11px] font-semibold cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCourse(crs.id)}
                                className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                                title="Remove course row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          No courses listed. Click "Add Course Row" to add technical programmes.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==============================================================
              STEP 4: SUPPORTING DOCUMENTS
              ============================================================== */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Document Category Selector & Upload Zone */}
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border-2 border-dashed border-[#CFE2FE] text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center mx-auto">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#102B4E]">
                    Drag & Drop Supporting Files or Browse
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Permitted formats: PDF, JPG, JPEG, PNG (Max 25MB per document)
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <select
                    value={selectedDocCategory}
                    onChange={(e) => setSelectedDocCategory(e.target.value as DocumentCategory)}
                    className="bg-white border border-[#CFE2FE] text-xs rounded-xl px-3 py-2 font-semibold text-slate-700"
                  >
                    <option value="Affidavits and Undertakings">Affidavits and Undertakings</option>
                    <option value="Accreditation / Certification Records">Accreditation / Certification Records</option>
                    <option value="NOCs and Permissions">NOCs and Permissions (Fire / Municipal)</option>
                    <option value="Faculty-related Evidence">Faculty-related Evidence</option>
                    <option value="Infrastructure Evidence">Infrastructure Evidence</option>
                    <option value="Other Required Documents">Other Required Documents</option>
                  </select>

                  <label className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold cursor-pointer transition-colors shadow-sm inline-flex items-center gap-1.5">
                    {isProcessingDoc && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isProcessingDoc ? 'Extracting OCR & Auditing...' : 'Browse & Upload'}</span>
                    <input
                      type="file"
                      onChange={handleSimulatedFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={isProcessingDoc}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-1">
                  <span>Attached Institutional Documents ({appData.documents.length})</span>
                  <span className="text-slate-400 font-normal">Checklist completeness verified</span>
                </div>

                <div className="space-y-2">
                  {appData.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs hover:border-[#CFE2FE] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate text-xs">{doc.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span>{doc.category}</span>
                            <span>•</span>
                            <span>{doc.fileSize}</span>
                            <span>•</span>
                            <span>Uploaded: {doc.uploadDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            doc.status === 'Verified'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : doc.status === 'Mismatch'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {doc.status}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              STEP 5: REVIEW & SUBMIT
              ============================================================== */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Pre-validation Trigger Banner */}
              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#CFE2FE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#2563EB]" />
                    <h4 className="text-sm font-bold text-[#102B4E]">
                      AI Preliminary Validation Engine
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                    Run automated rule extraction to verify land, building, faculty-to-student ratios, and statutory document completeness against AICTE norms.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRunValidation}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-sm flex items-center gap-2 cursor-pointer flex-shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-teal-300" />
                  <span>Run Preliminary Validation</span>
                </button>
              </div>

              {/* Validation Findings Results */}
              {validationRun && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Validation & Compliance Findings ({validationFindings.length})</span>
                    <span className="text-slate-400 font-normal">Preliminary Decision Support</span>
                  </div>

                  <div className="space-y-2">
                    {validationFindings.map((fnd) => (
                      <div
                        key={fnd.id}
                        className={`p-3.5 rounded-xl border flex flex-col gap-1 text-xs ${
                          fnd.severity === 'CRITICAL'
                            ? 'bg-rose-50 border-rose-200 text-rose-900'
                            : fnd.severity === 'WARNING'
                            ? 'bg-amber-50 border-amber-200 text-amber-900'
                            : fnd.severity === 'NOTICE'
                            ? 'bg-blue-50 border-blue-200 text-slate-800'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{fnd.title}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border">
                            {fnd.severity}
                          </span>
                        </div>
                        <p className="leading-relaxed">{fnd.explanation}</p>
                        <div className="mt-1 pt-1.5 border-t border-black/5 flex items-center justify-between text-[11px] text-slate-600">
                          <span>
                            <strong>Scope:</strong> {fnd.relatedFieldOrDoc}
                          </span>
                          <span className="font-medium italic">{fnd.recommendedAction}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Summary Box */}
              <div className="p-5 rounded-2xl bg-white border border-[#CFE2FE] shadow-sm space-y-4 text-xs">
                <h4 className="text-sm font-bold text-[#102B4E]">Filing Summary & Declaration</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Type:</span>
                    <span className="font-bold">{appData.type === 'EOA' ? 'EoA Renewal' : 'Change Request'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Academic Year:</span>
                    <span className="font-bold">{appData.academicYear}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Courses Declared:</span>
                    <span className="font-bold">{appData.courses.length} Programmes</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Attached Docs:</span>
                    <span className="font-bold">{appData.documents.length} Files</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={statutoryAgreed}
                      onChange={(e) => setStatutoryAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-[#2563EB] border-[#CFE2FE] focus:ring-[#2563EB]"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed select-none">
                      I hereby declare on behalf of <strong>{appData.institution.name}</strong> that all particulars submitted herein are true, authentic, and in strict compliance with the AICTE Approval Process Handbook (APH 2026-27). Final statutory approval remains with the competent council authorities.
                    </span>
                  </label>
                </div>
              </div>

              {submitError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-bold text-white transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={!statutoryAgreed || isSubmitting}
                onClick={handleFinalSubmit}
                className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-bold text-white transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Application Formally</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 text-xs text-slate-800 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-bold text-[#102B4E]">
                {editingCourse ? 'Edit Course Programme' : 'Add New Course Programme'}
              </h4>
              <button
                type="button"
                onClick={() => setShowCourseModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Programme / Course Name
                </label>
                <input
                  type="text"
                  value={courseForm.programmeName}
                  onChange={(e) => setCourseForm({ ...courseForm, programmeName: e.target.value })}
                  placeholder="e.g. B.Tech - Robotics & Automation"
                  className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Degree Level
                  </label>
                  <select
                    value={courseForm.degreeLevel}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, degreeLevel: e.target.value as DegreeLevel })
                    }
                    className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-lg px-2.5 py-2 text-xs"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Doctoral">Doctoral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Programme ID
                  </label>
                  <input
                    type="text"
                    value={courseForm.programmeIdentifier}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, programmeIdentifier: e.target.value })
                    }
                    className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Approved
                  </label>
                  <input
                    type="number"
                    value={courseForm.approvedIntake}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, approvedIntake: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-lg px-2 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Proposed
                  </label>
                  <input
                    type="number"
                    value={courseForm.proposedIntake}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, proposedIntake: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-lg px-2 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Faculty
                  </label>
                  <input
                    type="number"
                    value={courseForm.facultyCount}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, facultyCount: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-lg px-2 py-2 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCourseModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCourse}
                className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-bold text-white cursor-pointer"
              >
                Save Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
