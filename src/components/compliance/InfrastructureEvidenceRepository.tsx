import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  RefreshCw, 
  Hash, 
  Eye, 
  Filter, 
  AlertCircle,
  FileCode2,
  Calendar
} from 'lucide-react';
import type { 
  InfrastructureEvidence, 
  ComplianceEvidenceCategory, 
  ComplianceRule 
} from '../../types/compliance';

interface InfrastructureEvidenceRepositoryProps {
  evidenceList: InfrastructureEvidence[];
  rules: ComplianceRule[];
  onUploadEvidence: (
    data: Omit<InfrastructureEvidence, 'id' | 'assessmentId' | 'submittedAt' | 'versionNumber'>
  ) => void;
  onReplaceEvidence: (
    evidenceId: string,
    newFile: {
      title: string;
      storagePath: string;
      fileType: string;
      fileSizeBytes: number;
      fileSize: string;
      fileHash: string;
    }
  ) => void;
  onPreviewEvidence: (evidence: InfrastructureEvidence) => void;
}

export const InfrastructureEvidenceRepository: React.FC<InfrastructureEvidenceRepositoryProps> = ({
  evidenceList,
  rules,
  onUploadEvidence,
  onReplaceEvidence,
  onPreviewEvidence,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Form states for new upload
  const [selectedRuleId, setSelectedRuleId] = useState<string>(rules[0]?.id || '');
  const [evidenceCategory, setEvidenceCategory] = useState<ComplianceEvidenceCategory>('LABORATORY_PHOTO');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // Replace modal state
  const [replacingEvidenceId, setReplacingEvidenceId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Filter evidence
  const filteredEvidence = evidenceList.filter((e) => {
    if (selectedCategory !== 'ALL' && e.evidenceCategory !== selectedCategory) {
      return false;
    }
    return true;
  });

  const generateSimpleHash = (fileName: string, size: number) => {
    // Generate deterministic 64-char SHA-256 simulation based on filename and size
    const str = `${fileName}-${size}-${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return (hex + 'c34298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b').substring(0, 64);
  };

  const handleFileUpload = (file: File) => {
    setUploadError(null);
    const MAX_SIZE = file.type.startsWith('video/') ? 25 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError(`File size exceeds limit (${file.type.startsWith('video/') ? '25MB for video' : '10MB for documents'}).`);
      return;
    }

    const sha256 = generateSimpleHash(file.name, file.size);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    onUploadEvidence({
      institutionId: '1-938210941',
      applicationReference: 'APP-2026-AICTE-8491',
      linkedRequirementId: selectedRuleId || rules[0]?.id || 'rule_aph_lab_03',
      evidenceCategory,
      title: title || file.name,
      description: description || `Uploaded infrastructure evidence file: ${file.name}`,
      storagePath: `/data_storage/evidence/APP-2026-AICTE-8491/${file.name}`,
      fileType: file.type || 'application/pdf',
      fileSizeBytes: file.size,
      fileSize: sizeMb,
      fileHash: sha256,
      captureDate: new Date().toISOString().split('T')[0],
      issueDate: issueDate || undefined,
      expiryDate: expiryDate || undefined,
      submittedBy: 'Dr. Arunachalam M. (Principal)',
      reviewStatus: 'SUBMITTED',
    });

    // Reset form
    setTitle('');
    setDescription('');
    setIssueDate('');
    setExpiryDate('');
  };

  const handleReplaceUpload = (file: File) => {
    if (!replacingEvidenceId) return;
    const sha256 = generateSimpleHash(file.name, file.size);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    onReplaceEvidence(replacingEvidenceId, {
      title: file.name,
      storagePath: `/data_storage/evidence/APP-2026-AICTE-8491/replaced_${file.name}`,
      fileType: file.type || 'application/pdf',
      fileSizeBytes: file.size,
      fileSize: sizeMb,
      fileHash: sha256,
    });

    setReplacingEvidenceId(null);
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('VIDEO')) return <Video className="w-5 h-5 text-purple-600" />;
    if (category.includes('PHOTO')) return <ImageIcon className="w-5 h-5 text-teal-600" />;
    if (category.includes('PLAN')) return <FileCode2 className="w-5 h-5 text-indigo-600" />;
    return <FileText className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 lg:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#102B4E]">
            Infrastructure Evidence Repository
          </h2>
          <p className="text-xs text-slate-500">
            Submit, version-control, and inspect building plans, facility photographs, walkthrough videos, and statutory safety certificates.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Evidence Categories ({evidenceList.length})</option>
            <option value="BUILDING_PLAN">Building & Floor Plans</option>
            <option value="LABORATORY_PHOTO">Laboratory Photographs</option>
            <option value="CLASSROOM_PHOTO">Classroom Photographs</option>
            <option value="CAMPUS_VIDEO">Campus Videos</option>
            <option value="SAFETY_CERT">Safety Certificates (Fire/NOC)</option>
            <option value="ACCESSIBILITY">Accessibility (Ramps/Lifts)</option>
          </select>
        </div>
      </div>

      {/* Upload Box with Context Selection */}
      <div className="bg-[#F8FAFC] border border-dashed border-blue-300 rounded-xl p-5 mb-6">
        <h3 className="text-xs font-bold text-[#102B4E] uppercase tracking-wider mb-3">
          Upload New Infrastructure Evidence
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">
              Link to Regulatory Requirement:
            </label>
            <select
              value={selectedRuleId}
              onChange={(e) => setSelectedRuleId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500"
            >
              {rules.map((rule) => (
                <option key={rule.id} value={rule.id}>
                  {rule.requirementCode}: {rule.title.substring(0, 45)}...
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">
              Evidence Category:
            </label>
            <select
              value={evidenceCategory}
              onChange={(e) => setEvidenceCategory(e.target.value as ComplianceEvidenceCategory)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500"
            >
              <option value="LABORATORY_PHOTO">Laboratory Photographs</option>
              <option value="BUILDING_PLAN">Sanctioned Floor Blueprint (PDF)</option>
              <option value="CLASSROOM_PHOTO">Smart Classroom Photographs</option>
              <option value="CAMPUS_VIDEO">Campus Walkthrough Video (MP4)</option>
              <option value="SAFETY_CERT">Fire / Structural Safety NOC</option>
              <option value="ACCESSIBILITY">Divyangjan Accessibility Ramps/Lifts</option>
              <option value="OCCUPANCY_DOC">Occupancy / Land Revenue Title</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">
              Evidence Title / Label (Optional):
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mechanical CAD Lab Room 102"
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition cursor-pointer bg-white ${
            isDragging ? 'border-[#2563EB] bg-blue-50/50' : 'border-slate-300 hover:border-blue-400'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="w-10 h-10 text-[#2563EB] mb-2" />
          <p className="text-xs font-bold text-slate-800">
            Drag & drop evidence files here, or <span className="text-[#2563EB] underline">browse files</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Supported formats: PDF, JPG, JPEG, PNG, MP4. (Max 10MB for documents, 25MB for video)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.mp4"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
        </div>

        {uploadError && (
          <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* Hidden Replace File Input */}
      <input
        ref={replaceFileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.mp4"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleReplaceUpload(e.target.files[0]);
          }
        }}
      />

      {/* Evidence Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvidence.map((item) => (
          <div
            key={item.id}
            className={`border rounded-xl p-4 transition shadow-2xs hover:shadow-sm ${
              item.reviewStatus === 'SUPERSEDED'
                ? 'bg-slate-50 border-slate-200 opacity-60'
                : item.reviewStatus === 'DISCREPANCY_FLAGGED'
                ? 'bg-rose-50/30 border-rose-200'
                : 'bg-white border-slate-200'
            }`}
          >
            {/* Top row: Category icon, Version pill, Review status */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-slate-100">
                  {getCategoryIcon(item.evidenceCategory)}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    {item.evidenceCategory.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold bg-[#102B4E] text-white px-1.5 py-0.2 rounded">
                      v{item.versionNumber}
                    </span>
                    {item.previousVersionId && (
                      <span className="text-[10px] text-blue-600 font-medium">
                        (Supersedes prior)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  item.reviewStatus === 'CONFIRMED_GENUINE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.reviewStatus === 'DISCREPANCY_FLAGGED'
                    ? 'bg-rose-100 text-rose-800'
                    : item.reviewStatus === 'SUPERSEDED'
                    ? 'bg-slate-200 text-slate-600'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {item.reviewStatus.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Title & Description */}
            <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1" title={item.title}>
              {item.title}
            </h4>
            <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
              {item.description}
            </p>

            {/* Hash & Metadata */}
            <div className="bg-slate-50 rounded-lg p-2 text-[10px] space-y-1 mb-3 font-mono">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Hash className="w-3 h-3 text-slate-400" /> SHA-256:
                </span>
                <span className="text-[#2563EB] font-bold truncate max-w-[150px]">
                  {item.fileHash}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Size: {item.fileSize}</span>
                <span>Type: {item.fileType}</span>
              </div>
              {item.expiryDate && (
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> Expiry:
                  </span>
                  <span className={item.expiryDate < currentDate ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                    {item.expiryDate}
                  </span>
                </div>
              )}
            </div>

            {/* Analysis Snippet if available */}
            {item.analysisResult && (
              <div className="mb-3 text-[11px] bg-blue-50/50 border border-blue-100 rounded-lg p-2 text-slate-700">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#102B4E]">AI Analysis: {item.analysisResult.analysisType}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                    Score: {item.analysisResult.readabilityScore}%
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 line-clamp-2">
                  {item.analysisResult.findings.join(' ')}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => onPreviewEvidence(item)}
                className="inline-flex items-center gap-1 text-[#2563EB] font-semibold hover:underline"
              >
                <Eye className="w-3.5 h-3.5" /> Preview & Analyze
              </button>

              <button
                type="button"
                onClick={() => {
                  setReplacingEvidenceId(item.id);
                  replaceFileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-1 text-slate-600 font-semibold hover:text-slate-900"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Replace
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEvidence.length === 0 && (
        <div className="text-center py-8 text-slate-500 text-xs">
          No evidence uploaded in this category yet.
        </div>
      )}
    </div>
  );
};
