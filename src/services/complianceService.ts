import type {
  ComplianceRule,
  ComplianceAssessment,
  ComplianceChecklistItem,
  InfrastructureEvidence,
  EvidenceAnalysisResult,
  ComplianceFinding,
  EvidenceRequest,
  InspectionRecommendation,
  ComplianceDashboardCounts,
  OfficerAssessmentResult,
  InspectionRecommendationStatus,
  EvidenceRequestResponse,
} from '../types/compliance';

const RULES_STORAGE_KEY = 'authenx_compliance_rules_v1';
const ASSESSMENTS_STORAGE_KEY = 'authenx_compliance_assessments_v1';

// Seed Initial Regulatory Rules from AICTE Approval Process Handbook (APH 2026-27)
export const INITIAL_COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: 'rule_aph_land_01',
    requirementCode: 'REG-2026-LAND-01',
    title: 'Minimum Campus Land Area & Unencumbered Title Norms',
    description: 'Institution must possess contiguous, unencumbered land of minimum 5.0 acres in Urban/Metro area or 7.5 acres in Rural area with clear government revenue ownership title.',
    regulatorySource: 'AICTE Approval Process Handbook (APH 2026-27)',
    sourceReference: 'Chapter II, Section 2.1.3 & Appendix 4 Table 4.1',
    applicableCategories: ['ALL', 'EOA'],
    academicYear: '2026-2027',
    ruleVersion: 'v2026.1',
    requiredEvidenceTypes: ['Land Title Deed', 'Bhoomi RTC Extract', 'Encumbrance Certificate (Non-encumbrance)'],
    validationConfig: {
      minAreaSqm: 20234, // 5.0 acres in sqm
      maxAgeYears: 99,
      requiredKeywords: ['sale deed', 'schedule property', 'unencumbered', 'survey number'],
    },
    mandatory: true,
    effectiveFrom: '2026-04-01',
    effectiveTo: '2027-03-31',
    active: true,
    reviewerInstructions: 'Inspect revenue survey number against municipal conversion order and Bhoomi RTC record.',
    createdBy: 'AICTE Regulatory Council HQ',
    updatedBy: 'AICTE Regulatory Council HQ',
    createdAt: '2026-04-01',
    updatedAt: '2026-04-01',
    history: [
      {
        version: 'v2026.1',
        changedBy: 'AICTE Regulatory Council HQ',
        changedAt: '2026-04-01 10:00 IST',
        changeSummary: 'Codified APH 2026-27 Appendix 4 contiguous land norms.',
      },
    ],
  },
  {
    id: 'rule_aph_bldg_02',
    requirementCode: 'REG-2026-BLDG-02',
    title: 'Instructional & Administrative Built-up Area Verification',
    description: 'The institution must have approved instructional area of minimum 420 sqm per intake unit and administrative/amenities area per APH Chapter II norms.',
    regulatorySource: 'AICTE Approval Process Handbook (APH 2026-27)',
    sourceReference: 'Chapter II, Table 2.2 & Appendix 4.2',
    applicableCategories: ['ALL', 'EOA', 'CHANGE'],
    academicYear: '2026-2027',
    ruleVersion: 'v2026.1',
    requiredEvidenceTypes: ['Town Planning Approved Master Plan', 'Building Occupancy Certificate', 'Architectural Floor Blueprint'],
    validationConfig: {
      minAreaSqm: 12500,
      minimumClassrooms: 24,
      requiredKeywords: ['instructional area', 'carpet area', 'sanctioned blueprint', 'occupancy certificate'],
    },
    mandatory: true,
    effectiveFrom: '2026-04-01',
    effectiveTo: '2027-03-31',
    active: true,
    reviewerInstructions: 'Cross-reference municipal sanctioned plan dimensions with uploaded floor plans and room schedule.',
    createdBy: 'AICTE Regulatory Council HQ',
    updatedBy: 'AICTE Regulatory Council HQ',
    createdAt: '2026-04-01',
    updatedAt: '2026-04-01',
    history: [
      {
        version: 'v2026.1',
        changedBy: 'AICTE Regulatory Council HQ',
        changedAt: '2026-04-01 10:00 IST',
        changeSummary: 'Initial publication for AY 2026-2027.',
      },
    ],
  },
  {
    id: 'rule_aph_lab_03',
    requirementCode: 'REG-2026-LAB-03',
    title: 'Departmental Laboratories & Equipment Provisioning',
    description: 'Every engineering department must maintain dedicated laboratories with working equipment, licensed software, and continuous power backup as per AICTE curriculum norms.',
    regulatorySource: 'AICTE Approval Process Handbook (APH 2026-27)',
    sourceReference: 'Chapter II, Section 2.3 & Appendix 5',
    applicableCategories: ['ALL', 'CHANGE'],
    academicYear: '2026-2027',
    ruleVersion: 'v2026.1',
    requiredEvidenceTypes: ['Laboratory Geo-tagged Photographs', 'Stock Register Extracts', 'Equipment Invoice & AMC Deeds'],
    validationConfig: {
      minimumLaboratories: 6,
      requiredKeywords: ['stock register', 'specimen apparatus', 'geo-tagged photograph', 'ups backup'],
    },
    mandatory: true,
    effectiveFrom: '2026-04-01',
    effectiveTo: '2027-03-31',
    active: true,
    reviewerInstructions: 'Verify that equipment in photographs matches inventory entries and department subject curricula.',
    createdBy: 'AICTE Technical Scrutiny Bureau',
    updatedBy: 'AICTE Technical Scrutiny Bureau',
    createdAt: '2026-04-01',
    updatedAt: '2026-04-01',
    history: [
      {
        version: 'v2026.1',
        changedBy: 'AICTE Technical Scrutiny Bureau',
        changedAt: '2026-04-01 10:00 IST',
        changeSummary: 'Mandated geo-tagging and machine readability for laboratory photos.',
      },
    ],
  },
  {
    id: 'rule_aph_fire_04',
    requirementCode: 'REG-2026-FIRE-04',
    title: 'State Fire Safety NOC & Emergency Evacuation Compliance',
    description: 'Current, unexpired Fire Safety No Objection Certificate from the State Fire & Emergency Services with approved disaster evacuation plan.',
    regulatorySource: 'National Building Code (NBC) 2016 & AICTE Norms',
    sourceReference: 'APH 2026-27 Chapter I, Section 1.8.4',
    applicableCategories: ['ALL', 'EOA'],
    academicYear: '2026-2027',
    ruleVersion: 'v2026.1',
    requiredEvidenceTypes: ['State Fire Safety NOC Certificate', 'Evacuation Drill Log', 'Structural Stability Certificate'],
    validationConfig: {
      maxAgeYears: 3,
      requiredKeywords: ['fire safety clearance', 'noc', 'extinguisher inspection', 'staircase width'],
    },
    mandatory: true,
    effectiveFrom: '2026-04-01',
    effectiveTo: '2027-03-31',
    active: true,
    reviewerInstructions: 'Verify certificate validity date has not expired and covers all campus blocks.',
    createdBy: 'AICTE Regulatory Council HQ',
    updatedBy: 'AICTE Regulatory Council HQ',
    createdAt: '2026-04-01',
    updatedAt: '2026-04-01',
    history: [
      {
        version: 'v2026.1',
        changedBy: 'AICTE Regulatory Council HQ',
        changedAt: '2026-04-01 10:00 IST',
        changeSummary: 'Enforced strict expiry date verification.',
      },
    ],
  },
  {
    id: 'rule_aph_access_05',
    requirementCode: 'REG-2026-ACCESS-05',
    title: 'Barrier-Free Campus & Divyangjan Accessibility Facilities',
    description: 'Mandatory provision of wheelchair ramps with gradient <= 1:12, accessible lifts with braille auditory cues, and dedicated Divyangjan restrooms in all academic buildings.',
    regulatorySource: 'Rights of Persons with Disabilities (RPwD) Act 2016 & AICTE Norms',
    sourceReference: 'APH 2026-27 Appendix 4, Section 4.5',
    applicableCategories: ['ALL', 'EOA', 'CHANGE'],
    academicYear: '2026-2027',
    ruleVersion: 'v2026.1',
    requiredEvidenceTypes: ['Ramp & Lift Photographs', 'Accessibility Architectural Layout', 'PWD Barrier-Free Certificate'],
    validationConfig: {
      requiredKeywords: ['barrier free', 'ramp gradient', 'tactile paving', 'disabled friendly toilet'],
    },
    mandatory: true,
    effectiveFrom: '2026-04-01',
    effectiveTo: '2027-03-31',
    active: true,
    reviewerInstructions: 'Inspect photographs to confirm ramp presence at main entrances and dedicated ground-floor accessible restrooms.',
    createdBy: 'AICTE Regulatory Council HQ',
    updatedBy: 'AICTE Regulatory Council HQ',
    createdAt: '2026-04-01',
    updatedAt: '2026-04-01',
    history: [
      {
        version: 'v2026.1',
        changedBy: 'AICTE Regulatory Council HQ',
        changedAt: '2026-04-01 10:00 IST',
        changeSummary: 'Aligned with RPwD Act 2016 statutory directives.',
      },
    ],
  },
  {
    id: 'rule_aph_fac_06',
    requirementCode: 'REG-2026-FAC-06',
    title: 'Faculty-Student Cadre Cadence & Qualifications Compliance',
    description: 'Minimum Faculty-Student Ratio (FSR) of 1:15 for UG and 1:12 for PG engineering programs with cadre ratio 1 Professor : 2 Associate Professors : 6 Assistant Professors.',
    regulatorySource: 'AICTE Approval Process Handbook (APH 2026-27)',
    sourceReference: 'Chapter II, Table 2.1 & 7th Central Pay Commission Guidelines',
    applicableCategories: ['ALL', 'EOA', 'CHANGE'],
    academicYear: '2026-2027',
    ruleVersion: 'v2026.1',
    requiredEvidenceTypes: ['Faculty Cadre Endorsement Sheet', 'University Affiliation Roster', 'Salary Bank Disbursal Ledger'],
    validationConfig: {
      minRatio: '1:15',
      requiredKeywords: ['cadre ratio', 'phd qualification', 'aicte scale', 'bank statement'],
    },
    mandatory: true,
    effectiveFrom: '2026-04-01',
    effectiveTo: '2027-03-31',
    active: true,
    reviewerInstructions: 'Validate that cadre ratio adheres to statutory minimum without substitute ad-hoc faculty.',
    createdBy: 'AICTE Regulatory Council HQ',
    updatedBy: 'AICTE Regulatory Council HQ',
    createdAt: '2026-04-01',
    updatedAt: '2026-04-01',
    history: [
      {
        version: 'v2026.1',
        changedBy: 'AICTE Regulatory Council HQ',
        changedAt: '2026-04-01 10:00 IST',
        changeSummary: 'Updated 2026-2027 pay scale verification clause.',
      },
    ],
  },
];

// Seed Initial Assessment for APP-2026-AICTE-8491 (EoA Renewal)
const SEED_ASSESSMENT_8491: ComplianceAssessment = {
  id: 'asm_2026_8491',
  institutionId: '1-938210941',
  applicationReference: 'APP-2026-AICTE-8491',
  applicationCategory: 'EOA',
  academicYear: '2026-2027',
  ruleVersion: 'v2026.1',
  status: 'IN_PROGRESS',
  assignedOfficer: 'Smt. Priya Sharma (Compliance Officer)',
  submittedBy: 'Dr. Arunachalam M. (Principal)',
  createdAt: '2026-10-16 11:30 IST',
  updatedAt: '2026-10-27 15:45 IST',
  items: [
    {
      id: 'chk_8491_01',
      assessmentId: 'asm_2026_8491',
      ruleId: 'rule_aph_land_01',
      requirementCode: 'REG-2026-LAND-01',
      ruleTitle: 'Minimum Campus Land Area & Unencumbered Title Norms',
      regulatorySource: 'AICTE Approval Process Handbook (APH 2026-27)',
      mandatory: true,
      evidenceStatus: 'SUBMITTED',
      preliminaryResult: 'COMPLIANT',
      officerResult: 'APPROVED',
      reviewStatus: 'CONFIRMED',
      reviewerNotes: 'Bhoomi RTC confirmed 5.2 acres unencumbered title under Survey No 42/1.',
      linkedEvidenceIds: ['ev_8491_01'],
      assessedAt: '2026-10-26 14:10 IST',
      updatedAt: '2026-10-26 14:10 IST',
    },
    {
      id: 'chk_8491_02',
      assessmentId: 'asm_2026_8491',
      ruleId: 'rule_aph_bldg_02',
      requirementCode: 'REG-2026-BLDG-02',
      ruleTitle: 'Instructional & Administrative Built-up Area Verification',
      regulatorySource: 'AICTE Approval Process Handbook (APH 2026-27)',
      mandatory: true,
      evidenceStatus: 'SUBMITTED',
      preliminaryResult: 'COMPLIANT',
      officerResult: 'APPROVED',
      reviewStatus: 'CONFIRMED',
      reviewerNotes: 'Total instructional built-up area of 14,800 sqm exceeds minimum norm of 12,500 sqm.',
      linkedEvidenceIds: ['ev_8491_02'],
      assessedAt: '2026-10-26 14:15 IST',
      updatedAt: '2026-10-26 14:15 IST',
    },
    {
      id: 'chk_8491_03',
      assessmentId: 'asm_2026_8491',
      ruleId: 'rule_aph_lab_03',
      requirementCode: 'REG-2026-LAB-03',
      ruleTitle: 'Departmental Laboratories & Equipment Provisioning',
      regulatorySource: 'AICTE Approval Process Handbook (APH 2026-27)',
      mandatory: true,
      evidenceStatus: 'SUBMITTED',
      preliminaryResult: 'COMPLIANT',
      officerResult: 'UNASSESSED',
      reviewStatus: 'UNDER_REVIEW',
      reviewerNotes: 'AI photo review confirmed computer lab terminal count (65 terminals detected). Physical review ongoing.',
      linkedEvidenceIds: ['ev_8491_03'],
      updatedAt: '2026-10-27 10:20 IST',
    },
    {
      id: 'chk_8491_04',
      assessmentId: 'asm_2026_8491',
      ruleId: 'rule_aph_fire_04',
      requirementCode: 'REG-2026-FIRE-04',
      ruleTitle: 'State Fire Safety NOC & Emergency Evacuation Compliance',
      regulatorySource: 'National Building Code (NBC) 2016 & AICTE Norms',
      mandatory: true,
      evidenceStatus: 'SUBMITTED',
      preliminaryResult: 'COMPLIANT',
      officerResult: 'APPROVED',
      reviewStatus: 'CONFIRMED',
      reviewerNotes: 'Karnataka Fire NOC #KFS-2024-NOC-8891 valid through Dec 2027.',
      linkedEvidenceIds: ['ev_8491_04'],
      assessedAt: '2026-10-26 14:20 IST',
      updatedAt: '2026-10-26 14:20 IST',
    },
    {
      id: 'chk_8491_05',
      assessmentId: 'asm_2026_8491',
      ruleId: 'rule_aph_access_05',
      requirementCode: 'REG-2026-ACCESS-05',
      ruleTitle: 'Barrier-Free Campus & Divyangjan Accessibility Facilities',
      regulatorySource: 'Rights of Persons with Disabilities (RPwD) Act 2016 & AICTE Norms',
      mandatory: true,
      evidenceStatus: 'SUBMITTED',
      preliminaryResult: 'COMPLIANT',
      officerResult: 'UNASSESSED',
      reviewStatus: 'PENDING',
      reviewerNotes: 'Wheelchair ramp photos and elevator certificates submitted.',
      linkedEvidenceIds: ['ev_8491_05'],
      updatedAt: '2026-10-25 12:00 IST',
    },
    {
      id: 'chk_8491_06',
      assessmentId: 'asm_2026_8491',
      ruleId: 'rule_aph_fac_06',
      requirementCode: 'REG-2026-FAC-06',
      ruleTitle: 'Faculty-Student Cadre Cadence & Qualifications Compliance',
      regulatorySource: 'AICTE Approval Process Handbook (APH 2026-27)',
      mandatory: true,
      evidenceStatus: 'SUBMITTED',
      preliminaryResult: 'POTENTIAL_GAP',
      officerResult: 'RECTIFICATION_REQUIRED',
      reviewStatus: 'UNDER_REVIEW',
      reviewerNotes: 'Cadre ratio meets 1:15 overall but Mechanical department has tight assistant professor count.',
      linkedEvidenceIds: ['ev_8491_06'],
      assessedAt: '2026-10-27 15:30 IST',
      updatedAt: '2026-10-27 15:30 IST',
    },
  ],
  evidence: [
    {
      id: 'ev_8491_01',
      assessmentId: 'asm_2026_8491',
      institutionId: '1-938210941',
      applicationReference: 'APP-2026-AICTE-8491',
      linkedRequirementId: 'rule_aph_land_01',
      evidenceCategory: 'OCCUPANCY_DOC',
      title: 'Bhoomi State Revenue Land Ownership Title Deed.pdf',
      description: 'Registered sale deed and Bhoomi RTC record confirming 5.2 acres campus boundaries.',
      storagePath: '/data_storage/evidence/APP-2026-AICTE-8491/land_deed_v1.pdf',
      fileType: 'application/pdf',
      fileSizeBytes: 3450000,
      fileSize: '3.4 MB',
      fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      captureDate: '2026-10-10',
      issueDate: '2024-03-15',
      versionNumber: 1,
      submittedBy: 'Dr. Arunachalam M.',
      submittedAt: '2026-10-16 11:45 IST',
      reviewStatus: 'CONFIRMED_GENUINE',
      analysisResult: {
        id: 'an_8491_01',
        evidenceId: 'ev_8491_01',
        analysisType: 'DOCUMENT_TEXT_OCR',
        provider: 'AuthenX On-Device OCR Engine',
        analysisStatus: 'COMPLETED',
        readabilityScore: 98,
        detectedLabels: ['Survey No 42/1', '5.2 Acres', 'Unencumbered', 'Electronic City'],
        findings: ['Document text is sharp and legible.', 'Keywords match statutory registry extract.'],
        confidence: 96,
        createdAt: '2026-10-16 11:46 IST',
      },
    },
    {
      id: 'ev_8491_02',
      assessmentId: 'asm_2026_8491',
      institutionId: '1-938210941',
      applicationReference: 'APP-2026-AICTE-8491',
      linkedRequirementId: 'rule_aph_bldg_02',
      evidenceCategory: 'BUILDING_PLAN',
      title: 'BBMP Approved Master Campus Architectural Floor Blueprint.pdf',
      description: 'Full municipal sanctioned blueprint showing academic blocks A, B, and C with room schedules.',
      storagePath: '/data_storage/evidence/APP-2026-AICTE-8491/floorplan_master_v1.pdf',
      fileType: 'application/pdf',
      fileSizeBytes: 6200000,
      fileSize: '6.2 MB',
      fileHash: 'f4b1c34298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852ba12',
      captureDate: '2026-10-12',
      issueDate: '2025-08-20',
      versionNumber: 1,
      submittedBy: 'Dr. Arunachalam M.',
      submittedAt: '2026-10-16 12:00 IST',
      reviewStatus: 'CONFIRMED_GENUINE',
      analysisResult: {
        id: 'an_8491_02',
        evidenceId: 'ev_8491_02',
        analysisType: 'FLOOR_PLAN_OCR',
        provider: 'AuthenX Blueprint OCR & Vector Geometry Engine',
        analysisStatus: 'PRELIMINARY',
        readabilityScore: 94,
        detectedLabels: ['Classroom Block A', 'Seminar Hall', 'Library Ground Floor', 'Computer Center'],
        extractedDimensions: [
          { label: 'Classroom 101-112 (12 units)', widthMeters: 8.5, lengthMeters: 8.0, areaSqm: 68.0, confidence: 95 },
          { label: 'Central Library Stack Area', widthMeters: 22.0, lengthMeters: 18.0, areaSqm: 396.0, confidence: 92 },
          { label: 'Seminar Hall Block B', widthMeters: 15.0, lengthMeters: 12.0, areaSqm: 180.0, confidence: 94 },
        ],
        findings: ['Preliminary vector geometry indicates 14,800 sqm total instructional floor space.'],
        confidence: 91,
        createdAt: '2026-10-16 12:05 IST',
      },
    },
    {
      id: 'ev_8491_03',
      assessmentId: 'asm_2026_8491',
      institutionId: '1-938210941',
      applicationReference: 'APP-2026-AICTE-8491',
      linkedRequirementId: 'rule_aph_lab_03',
      evidenceCategory: 'LABORATORY_PHOTO',
      title: 'Advanced AI & Data Science Laboratory Facility.jpg',
      description: 'Wide-angle photograph of Departmental Lab 204 showing desktop workstations and network rack.',
      storagePath: '/data_storage/evidence/APP-2026-AICTE-8491/lab_photo_v1.jpg',
      fileType: 'image/jpeg',
      fileSizeBytes: 2800000,
      fileSize: '2.8 MB',
      fileHash: 'a123c34298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b789',
      captureDate: '2026-10-14',
      versionNumber: 1,
      submittedBy: 'Dr. Arunachalam M.',
      submittedAt: '2026-10-16 12:15 IST',
      reviewStatus: 'CONFIRMED_GENUINE',
      analysisResult: {
        id: 'an_8491_03',
        evidenceId: 'ev_8491_03',
        analysisType: 'PHOTO_CV',
        provider: 'AuthenX Edge Computer Vision Classifier',
        analysisStatus: 'COMPLETED',
        readabilityScore: 92,
        detectedLabels: ['Computer Workstations (65 units)', 'Central Server Rack', 'Smart Interactive Board', 'Fire Extinguisher on Wall'],
        findings: [
          'High image quality; no blurring or occlusion detected.',
          'Detected 65 desktop terminals matching course intake capacity requirement.',
        ],
        confidence: 94,
        createdAt: '2026-10-16 12:20 IST',
      },
    },
    {
      id: 'ev_8491_04',
      assessmentId: 'asm_2026_8491',
      institutionId: '1-938210941',
      applicationReference: 'APP-2026-AICTE-8491',
      linkedRequirementId: 'rule_aph_fire_04',
      evidenceCategory: 'SAFETY_CERT',
      title: 'Karnataka State Fire Safety Clearance NOC.pdf',
      description: 'Official clearance from Karnataka Fire and Emergency Services Department.',
      storagePath: '/data_storage/evidence/APP-2026-AICTE-8491/fire_noc_v1.pdf',
      fileType: 'application/pdf',
      fileSizeBytes: 1800000,
      fileSize: '1.8 MB',
      fileHash: 'c998c34298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b456',
      captureDate: '2026-10-10',
      issueDate: '2024-12-01',
      expiryDate: '2027-12-01',
      versionNumber: 1,
      submittedBy: 'Dr. Arunachalam M.',
      submittedAt: '2026-10-16 12:25 IST',
      reviewStatus: 'CONFIRMED_GENUINE',
      analysisResult: {
        id: 'an_8491_04',
        evidenceId: 'ev_8491_04',
        analysisType: 'DOCUMENT_TEXT_OCR',
        provider: 'AuthenX OCR Engine',
        analysisStatus: 'COMPLETED',
        readabilityScore: 97,
        detectedLabels: ['NOC Clearance #KFS-2024-NOC-8891', 'Valid till 2027-12-01', 'Multi-storey Educational Occupancy'],
        findings: ['Certificate is currently active with 400+ days remaining until expiry.'],
        confidence: 98,
        createdAt: '2026-10-16 12:26 IST',
      },
    },
    {
      id: 'ev_8491_05',
      assessmentId: 'asm_2026_8491',
      institutionId: '1-938210941',
      applicationReference: 'APP-2026-AICTE-8491',
      linkedRequirementId: 'rule_aph_access_05',
      evidenceCategory: 'ACCESSIBILITY',
      title: 'Academic Block Entrance Wheelchair Ramp & Lift Cues.jpg',
      description: 'Photograph of main entry ramp with continuous handrail and Divyangjan signage.',
      storagePath: '/data_storage/evidence/APP-2026-AICTE-8491/ramp_photo_v1.jpg',
      fileType: 'image/jpeg',
      fileSizeBytes: 2100000,
      fileSize: '2.1 MB',
      fileHash: 'd555c34298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b111',
      captureDate: '2026-10-15',
      versionNumber: 1,
      submittedBy: 'Dr. Arunachalam M.',
      submittedAt: '2026-10-16 12:30 IST',
      reviewStatus: 'UNDER_ANALYSIS',
      analysisResult: {
        id: 'an_8491_05',
        evidenceId: 'ev_8491_05',
        analysisType: 'PHOTO_CV',
        provider: 'AuthenX Edge Computer Vision Classifier',
        analysisStatus: 'COMPLETED',
        readabilityScore: 89,
        detectedLabels: ['Wheelchair Ramp with Dual Handrails', 'Tactile Paving Strips', 'Divyangjan Signage Symbol'],
        findings: ['Visible ramp conforms to barrier-free gradient appearance.'],
        confidence: 91,
        createdAt: '2026-10-16 12:31 IST',
      },
    },
    {
      id: 'ev_8491_06',
      assessmentId: 'asm_2026_8491',
      institutionId: '1-938210941',
      applicationReference: 'APP-2026-AICTE-8491',
      linkedRequirementId: 'rule_aph_fac_06',
      evidenceCategory: 'OTHER_INFRASTRUCTURE',
      title: 'Staff Cadre & Salary Bank Disbursal Ledger 2026.pdf',
      description: 'Certified faculty list with designated cadre distribution and PF/bank account verification.',
      storagePath: '/data_storage/evidence/APP-2026-AICTE-8491/faculty_cadre_v1.pdf',
      fileType: 'application/pdf',
      fileSizeBytes: 3900000,
      fileSize: '3.9 MB',
      fileHash: 'e777c34298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b222',
      captureDate: '2026-10-14',
      versionNumber: 1,
      submittedBy: 'Dr. Arunachalam M.',
      submittedAt: '2026-10-16 12:40 IST',
      reviewStatus: 'UNDER_ANALYSIS',
      analysisResult: {
        id: 'an_8491_06',
        evidenceId: 'ev_8491_06',
        analysisType: 'DOCUMENT_TEXT_OCR',
        provider: 'AuthenX OCR Engine',
        analysisStatus: 'COMPLETED',
        readabilityScore: 93,
        detectedLabels: ['35 Total Teaching Faculty', 'Cadre 1:2:6 Compliance', 'Mechanical Engg 4 Faculty'],
        findings: [
          'Overall student-to-faculty ratio is 1:15.',
          'Mechanical Engineering Assistant Professor count is at minimum limit.',
        ],
        confidence: 92,
        createdAt: '2026-10-16 12:42 IST',
      },
    },
  ],
  findings: [
    {
      id: 'fnd_cmp_8491_01',
      assessmentId: 'asm_2026_8491',
      checklistItemId: 'chk_8491_06',
      evidenceId: 'ev_8491_06',
      findingCategory: 'POTENTIAL_REQUIREMENT_GAP',
      severity: 'NOTICE',
      sourceType: 'DETERMINISTIC_RULE',
      explanation: 'Mechanical Department has 4 faculty for 60 intake, which precisely meets 1:15 without any buffer for faculty attrition.',
      evidenceReference: 'Staff Cadre & Salary Ledger Page 8',
      ruleVersion: 'v2026.1',
      status: 'OPEN',
      assignedOfficer: 'Smt. Priya Sharma',
      recommendedNextStep: 'Recommend institution maintain standby faculty panel to ensure continuous FSR compliance.',
      createdAt: '2026-10-16 14:00 IST',
      updatedAt: '2026-10-16 14:00 IST',
    },
  ],
  evidenceRequests: [],
  inspectionRecommendations: [
    {
      id: 'rec_8491_01',
      assessmentId: 'asm_2026_8491',
      applicationReference: 'APP-2026-AICTE-8491',
      institutionId: '1-938210941',
      institutionName: 'Apex Institute of Technology & Science',
      relatedRequirementId: 'rule_aph_lab_03',
      recommendationReason: 'Sample optical photo shows 65 terminals; random verification of licensed CAD/CAM software keys recommended during standard annual visit.',
      supportingEvidence: 'ev_8491_03 (Laboratory Photo)',
      status: 'ASSESSMENT_PENDING',
      recommendedBy: 'AuthenX Rules Scrutiny Subsystem',
      recommendedAt: '2026-10-18 10:15 IST',
      assignedOfficer: 'Smt. Priya Sharma',
      createdAt: '2026-10-18 10:15 IST',
      updatedAt: '2026-10-18 10:15 IST',
    },
  ],
  auditLogs: [
    {
      id: 'log_8491_01',
      assessmentId: 'asm_2026_8491',
      actorId: 'usr_inst_001',
      actorName: 'Dr. Arunachalam M.',
      eventType: 'ASSESSMENT_INITIALIZED',
      entityType: 'ComplianceAssessment',
      entityId: 'asm_2026_8491',
      reason: 'Initiated EoA compliance assessment for AY 2026-2027.',
      createdAt: '2026-10-16 11:30 IST',
    },
    {
      id: 'log_8491_02',
      assessmentId: 'asm_2026_8491',
      actorId: 'usr_comp_002',
      actorName: 'Smt. Priya Sharma',
      eventType: 'OFFICER_REVIEW_SAVED',
      entityType: 'ComplianceChecklistItem',
      entityId: 'chk_8491_01',
      reason: 'Confirmed Bhoomi land title deeds and municipal built-up space compliance.',
      createdAt: '2026-10-26 14:10 IST',
    },
  ],
};

// Seed Assessment for APP-2026-AICTE-9104 (Approval Changes: Intake Expansion)
const SEED_ASSESSMENT_9104: ComplianceAssessment = {
  id: 'asm_2026_9104',
  institutionId: '1-938210941',
  applicationReference: 'APP-2026-AICTE-9104',
  applicationCategory: 'CHANGE',
  academicYear: '2026-2027',
  ruleVersion: 'v2026.1',
  status: 'DEFICIENCIES_NOTED',
  assignedOfficer: 'Smt. Priya Sharma (Compliance Officer)',
  submittedBy: 'Dr. Arunachalam M. (Principal)',
  createdAt: '2026-10-19 14:20 IST',
  updatedAt: '2026-10-27 16:30 IST',
  items: [
    {
      id: 'chk_9104_01',
      assessmentId: 'asm_2026_9104',
      ruleId: 'rule_aph_bldg_02',
      requirementCode: 'REG-2026-BLDG-02',
      ruleTitle: 'Instructional & Administrative Built-up Area Verification',
      regulatorySource: 'AICTE Approval Process Handbook (APH 2026-27)',
      mandatory: true,
      evidenceStatus: 'PARTIALLY_SUBMITTED',
      preliminaryResult: 'POTENTIAL_GAP',
      officerResult: 'RECTIFICATION_REQUIRED',
      reviewStatus: 'ESCALATED',
      reviewerNotes: 'Uploaded blueprint does not demarcate dedicated Cyber Security Lab of minimum 66 sqm.',
      linkedEvidenceIds: ['ev_9104_01'],
      assessedAt: '2026-10-27 11:25 IST',
      updatedAt: '2026-10-27 11:25 IST',
    },
    {
      id: 'chk_9104_02',
      assessmentId: 'asm_2026_9104',
      ruleId: 'rule_aph_lab_03',
      requirementCode: 'REG-2026-LAB-03',
      ruleTitle: 'Departmental Laboratories & Equipment Provisioning',
      regulatorySource: 'AICTE Approval Process Handbook (APH 2026-27)',
      mandatory: true,
      evidenceStatus: 'NOT_SUBMITTED',
      preliminaryResult: 'DEFICIENT',
      officerResult: 'RECTIFICATION_REQUIRED',
      reviewStatus: 'UNDER_REVIEW',
      reviewerNotes: 'Photographs of newly procured cryptography and malware analysis workstations missing.',
      linkedEvidenceIds: [],
      assessedAt: '2026-10-27 11:30 IST',
      updatedAt: '2026-10-27 11:30 IST',
    },
    {
      id: 'chk_9104_03',
      assessmentId: 'asm_2026_9104',
      ruleId: 'rule_aph_fac_06',
      requirementCode: 'REG-2026-FAC-06',
      ruleTitle: 'Faculty-Student Cadre Cadence & Qualifications Compliance',
      regulatorySource: 'AICTE Approval Process Handbook (APH 2026-27)',
      mandatory: true,
      evidenceStatus: 'SUBMITTED',
      preliminaryResult: 'DEFICIENT',
      officerResult: 'FLAGGED_DEFICIENCY',
      reviewStatus: 'ESCALATED',
      reviewerNotes: 'Intake expansion from 60 to 120 requires 8 faculty. Only 5 profiles uploaded (3 deficit).',
      linkedEvidenceIds: ['ev_9104_02'],
      assessedAt: '2026-10-27 11:35 IST',
      updatedAt: '2026-10-27 11:35 IST',
    },
  ],
  evidence: [
    {
      id: 'ev_9104_01',
      assessmentId: 'asm_2026_9104',
      institutionId: '1-938210941',
      applicationReference: 'APP-2026-AICTE-9104',
      linkedRequirementId: 'rule_aph_bldg_02',
      evidenceCategory: 'BUILDING_PLAN',
      title: 'Proposed Cyber Department Floor Plan Draft.pdf',
      description: 'Architectural draft submitted for intake expansion scrutiny.',
      storagePath: '/data_storage/evidence/APP-2026-AICTE-9104/cyber_floorplan_draft.pdf',
      fileType: 'application/pdf',
      fileSizeBytes: 4100000,
      fileSize: '4.1 MB',
      fileHash: 'b333c34298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b999',
      captureDate: '2026-10-18',
      versionNumber: 1,
      submittedBy: 'Dr. Arunachalam M.',
      submittedAt: '2026-10-19 14:30 IST',
      reviewStatus: 'DISCREPANCY_FLAGGED',
      analysisResult: {
        id: 'an_9104_01',
        evidenceId: 'ev_9104_01',
        analysisType: 'FLOOR_PLAN_OCR',
        provider: 'AuthenX Blueprint OCR Engine',
        analysisStatus: 'COMPLETED',
        readabilityScore: 82,
        detectedLabels: ['Tutorial Room 301', 'Staff Room 302', 'General Lab 303'],
        findings: ['No demarcated Room 304 for dedicated Cyber Security lab was found in blueprint index.'],
        confidence: 88,
        discrepancyNote: 'Floor plan lacks dedicated Cyber Lab of minimum 66 sqm.',
        createdAt: '2026-10-19 14:35 IST',
      },
    },
    {
      id: 'ev_9104_02',
      assessmentId: 'asm_2026_9104',
      institutionId: '1-938210941',
      applicationReference: 'APP-2026-AICTE-9104',
      linkedRequirementId: 'rule_aph_fac_06',
      evidenceCategory: 'OTHER_INFRASTRUCTURE',
      title: 'Cyber Security Faculty Roster.pdf',
      description: 'Faculty list for B.Tech Cyber Security intake expansion.',
      storagePath: '/data_storage/evidence/APP-2026-AICTE-9104/cyber_faculty_roster.pdf',
      fileType: 'application/pdf',
      fileSizeBytes: 2400000,
      fileSize: '2.4 MB',
      fileHash: 'c444c34298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b888',
      captureDate: '2026-10-18',
      versionNumber: 1,
      submittedBy: 'Dr. Arunachalam M.',
      submittedAt: '2026-10-19 14:45 IST',
      reviewStatus: 'DISCREPANCY_FLAGGED',
      analysisResult: {
        id: 'an_9104_02',
        evidenceId: 'ev_9104_02',
        analysisType: 'DOCUMENT_TEXT_OCR',
        provider: 'AuthenX OCR Engine',
        analysisStatus: 'COMPLETED',
        readabilityScore: 95,
        detectedLabels: ['5 Teaching Faculty Attached', 'Target Intake 120'],
        findings: ['Faculty count of 5 violates minimum ratio of 8 for 120 intake.'],
        confidence: 96,
        discrepancyNote: 'Shortage of 3 approved faculty members.',
        createdAt: '2026-10-19 14:48 IST',
      },
    },
  ],
  findings: [
    {
      id: 'fnd_cmp_9104_01',
      assessmentId: 'asm_2026_9104',
      checklistItemId: 'chk_9104_03',
      evidenceId: 'ev_9104_02',
      findingCategory: 'INFRASTRUCTURE_DISCREPANCY',
      severity: 'CRITICAL',
      sourceType: 'DETERMINISTIC_RULE',
      explanation: 'Proposed intake increase to 120 in Cyber Security requires minimum 8 approved faculty. Currently only 5 profiles uploaded.',
      evidenceReference: 'Cyber Security Faculty Roster Page 2',
      ruleVersion: 'v2026.1',
      status: 'OPEN',
      assignedOfficer: 'Smt. Priya Sharma',
      recommendedNextStep: 'Issue formal Additional Evidence Request for appointment orders of 3 faculty.',
      createdAt: '2026-10-27 11:35 IST',
      updatedAt: '2026-10-27 11:35 IST',
    },
    {
      id: 'fnd_cmp_9104_02',
      assessmentId: 'asm_2026_9104',
      checklistItemId: 'chk_9104_01',
      evidenceId: 'ev_9104_01',
      findingCategory: 'MISSING_EVIDENCE',
      severity: 'WARNING',
      sourceType: 'AI_OBSERVATION',
      explanation: 'Floor plan blueprint does not show dedicated Advanced Cryptography lab of minimum 66 sqm.',
      evidenceReference: 'Proposed Cyber Department Floor Plan Draft',
      ruleVersion: 'v2026.1',
      status: 'OPEN',
      assignedOfficer: 'Smt. Priya Sharma',
      recommendedNextStep: 'Request revised architectural blueprint demarcating Room 304.',
      createdAt: '2026-10-27 11:25 IST',
      updatedAt: '2026-10-27 11:25 IST',
    },
  ],
  evidenceRequests: [
    {
      id: 'req_9104_01',
      assessmentId: 'asm_2026_9104',
      checklistItemId: 'chk_9104_01',
      institutionId: '1-938210941',
      applicationReference: 'APP-2026-AICTE-9104',
      requestedBy: 'Smt. Priya Sharma (Compliance Officer)',
      reason: 'Missing dedicated Cyber Security Laboratory in architectural floor plan',
      requestedEvidence: 'Revised Architectural Floor Blueprint with Room Schedule',
      explanation: 'Please upload a revised sanctioned blueprint demarcating Room 304 of at least 66 sqm for the proposed intake.',
      dueDate: '2026-11-10',
      status: 'SENT',
      officerNotes: 'Formal notice issued under APH Chapter II guidelines.',
      createdAt: '2026-10-27 12:00 IST',
      updatedAt: '2026-10-27 12:00 IST',
    },
  ],
  inspectionRecommendations: [
    {
      id: 'rec_9104_01',
      assessmentId: 'asm_2026_9104',
      applicationReference: 'APP-2026-AICTE-9104',
      institutionId: '1-938210941',
      institutionName: 'Apex Institute of Technology & Science',
      relatedRequirementId: 'rule_aph_lab_03',
      relatedFindingId: 'fnd_cmp_9104_02',
      recommendationReason: 'Contested laboratory space and unconfirmed faculty equipment readiness for 60-seat intake expansion.',
      supportingEvidence: 'ev_9104_01 (Floor plan draft lacking Room 304)',
      status: 'INSPECTION_RECOMMENDED',
      recommendedBy: 'Smt. Priya Sharma (Compliance Officer)',
      recommendedAt: '2026-10-27 16:15 IST',
      assignedOfficer: 'Smt. Priya Sharma',
      decisionNotes: 'Recommend physical Expert Visit Committee (EVC) before final approval.',
      createdAt: '2026-10-27 16:15 IST',
      updatedAt: '2026-10-27 16:15 IST',
    },
  ],
  auditLogs: [
    {
      id: 'log_9104_01',
      assessmentId: 'asm_2026_9104',
      actorId: 'usr_comp_002',
      actorName: 'Smt. Priya Sharma',
      eventType: 'EVIDENCE_REQUEST_SENT',
      entityType: 'EvidenceRequest',
      entityId: 'req_9104_01',
      reason: 'Requested revised floor plan for Cyber Security laboratory.',
      createdAt: '2026-10-27 12:00 IST',
    },
    {
      id: 'log_9104_02',
      assessmentId: 'asm_2026_9104',
      actorId: 'usr_comp_002',
      actorName: 'Smt. Priya Sharma',
      eventType: 'INSPECTION_RECOMMENDED',
      entityType: 'InspectionRecommendation',
      entityId: 'rec_9104_01',
      reason: 'Recommended physical inspection for intake expansion.',
      createdAt: '2026-10-27 16:15 IST',
    },
  ],
};

export const complianceService = {
  // Rules Management
  getRules(): ComplianceRule[] {
    try {
      const stored = localStorage.getItem(RULES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(INITIAL_COMPLIANCE_RULES));
    return INITIAL_COMPLIANCE_RULES;
  },

  saveRule(rule: ComplianceRule, actorName = 'System Admin'): ComplianceRule {
    const rules = this.getRules();
    const existingIndex = rules.findIndex((r) => r.id === rule.id);
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    let updatedRule: ComplianceRule;
    if (existingIndex >= 0) {
      const old = rules[existingIndex];
      const newVersion = `v2026.${(old.history?.length || 1) + 1}`;
      updatedRule = {
        ...rule,
        ruleVersion: newVersion,
        updatedBy: actorName,
        updatedAt: now,
        history: [
          {
            version: newVersion,
            changedBy: actorName,
            changedAt: now,
            changeSummary: `Updated rule configuration: ${rule.title}`,
          },
          ...(old.history || []),
        ],
      };
      rules[existingIndex] = updatedRule;
    } else {
      updatedRule = {
        ...rule,
        createdBy: actorName,
        updatedBy: actorName,
        createdAt: now,
        updatedAt: now,
        history: [
          {
            version: rule.ruleVersion || 'v2026.1',
            changedBy: actorName,
            changedAt: now,
            changeSummary: 'Initial rule authoring.',
          },
        ],
      };
      rules.unshift(updatedRule);
    }

    localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(rules));
    return updatedRule;
  },

  duplicateRule(ruleId: string, actorName = 'System Admin'): ComplianceRule | undefined {
    const rules = this.getRules();
    const source = rules.find((r) => r.id === ruleId);
    if (!source) return undefined;

    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const newId = `rule_aph_${Date.now()}`;
    const duplicated: ComplianceRule = {
      ...source,
      id: newId,
      requirementCode: `${source.requirementCode}-COPY`,
      title: `${source.title} (Copy)`,
      createdBy: actorName,
      updatedBy: actorName,
      createdAt: now,
      updatedAt: now,
      history: [
        {
          version: 'v2026.1',
          changedBy: actorName,
          changedAt: now,
          changeSummary: `Cloned from ${source.requirementCode}.`,
        },
      ],
    };

    rules.unshift(duplicated);
    localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(rules));
    return duplicated;
  },

  toggleRuleActive(ruleId: string, active: boolean, actorName = 'System Admin'): ComplianceRule | undefined {
    const rules = this.getRules();
    const idx = rules.findIndex((r) => r.id === ruleId);
    if (idx === -1) return undefined;

    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    rules[idx] = {
      ...rules[idx],
      active,
      updatedBy: actorName,
      updatedAt: now,
      history: [
        {
          version: rules[idx].ruleVersion,
          changedBy: actorName,
          changedAt: now,
          changeSummary: active ? 'Activated rule in production checklist.' : 'Deactivated rule.',
        },
        ...(rules[idx].history || []),
      ],
    };

    localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(rules));
    return rules[idx];
  },

  // Category Rules Engine: Returns applicable active rules for an application category & academic year
  getApplicableRules(category: 'EOA' | 'CHANGE', academicYear = '2026-2027'): ComplianceRule[] {
    const rules = this.getRules();
    return rules.filter(
      (r) =>
        r.active &&
        r.academicYear === academicYear &&
        (r.applicableCategories.includes('ALL') || r.applicableCategories.includes(category))
    );
  },

  // Assessments Management
  getAssessments(institutionId?: string): ComplianceAssessment[] {
    try {
      const stored = localStorage.getItem(ASSESSMENTS_STORAGE_KEY);
      if (stored) {
        const list: ComplianceAssessment[] = JSON.parse(stored);
        if (institutionId) {
          return list.filter((a) => a.institutionId === institutionId);
        }
        return list;
      }
    } catch {
      // fallback
    }

    const initial = [SEED_ASSESSMENT_8491, SEED_ASSESSMENT_9104];
    localStorage.setItem(ASSESSMENTS_STORAGE_KEY, JSON.stringify(initial));
    if (institutionId) {
      return initial.filter((a) => a.institutionId === institutionId);
    }
    return initial;
  },

  getAssessmentByAppId(appId: string): ComplianceAssessment | undefined {
    const list = this.getAssessments();
    const found = list.find((a) => a.applicationReference === appId);
    if (found) return found;

    // If assessment does not exist yet for this valid application, auto-initialize from applicable rules
    return this.initializeAssessmentForApplication(appId);
  },

  initializeAssessmentForApplication(appId: string): ComplianceAssessment {
    const isChange = appId.includes('CHANGE') || appId.includes('9104') || appId.includes('9820');
    const category: 'EOA' | 'CHANGE' = isChange ? 'CHANGE' : 'EOA';
    const applicableRules = this.getApplicableRules(category, '2026-2027');
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const newAssessment: ComplianceAssessment = {
      id: `asm_${Date.now()}`,
      institutionId: '1-938210941',
      applicationReference: appId,
      applicationCategory: category,
      academicYear: '2026-2027',
      ruleVersion: 'v2026.1',
      status: 'IN_PROGRESS',
      assignedOfficer: 'Smt. Priya Sharma (Compliance Officer)',
      submittedBy: 'Dr. Arunachalam M.',
      createdAt: now,
      updatedAt: now,
      items: applicableRules.map((rule, idx) => ({
        id: `chk_${Date.now()}_${idx}`,
        assessmentId: `asm_${Date.now()}`,
        ruleId: rule.id,
        requirementCode: rule.requirementCode,
        ruleTitle: rule.title,
        regulatorySource: rule.regulatorySource,
        mandatory: rule.mandatory,
        evidenceStatus: 'NOT_SUBMITTED',
        preliminaryResult: 'PENDING_ANALYSIS',
        officerResult: 'UNASSESSED',
        reviewStatus: 'PENDING',
        reviewerNotes: '',
        linkedEvidenceIds: [],
        updatedAt: now,
      })),
      evidence: [],
      findings: [],
      evidenceRequests: [],
      inspectionRecommendations: [],
      auditLogs: [
        {
          id: `log_${Date.now()}`,
          assessmentId: `asm_${Date.now()}`,
          actorId: 'usr_inst_001',
          actorName: 'Dr. Arunachalam M.',
          eventType: 'ASSESSMENT_INITIALIZED',
          entityType: 'ComplianceAssessment',
          entityId: `asm_${Date.now()}`,
          reason: `Generated checklist from ${applicableRules.length} applicable rules for category ${category}.`,
          createdAt: now,
        },
      ],
    };

    const assessments = this.getAssessments();
    assessments.unshift(newAssessment);
    localStorage.setItem(ASSESSMENTS_STORAGE_KEY, JSON.stringify(assessments));
    return newAssessment;
  },

  saveAssessment(assessment: ComplianceAssessment): ComplianceAssessment {
    const list = this.getAssessments();
    const idx = list.findIndex((a) => a.id === assessment.id);
    const updated = {
      ...assessment,
      updatedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };

    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }

    localStorage.setItem(ASSESSMENTS_STORAGE_KEY, JSON.stringify(list));
    return updated;
  },

  // Evidence Operations
  uploadEvidence(
    appId: string,
    evidenceData: Omit<InfrastructureEvidence, 'id' | 'assessmentId' | 'submittedAt' | 'versionNumber'>,
    actorName = 'Dr. Arunachalam M.'
  ): InfrastructureEvidence {
    const assessment = this.getAssessmentByAppId(appId) || this.initializeAssessmentForApplication(appId);
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const evId = `ev_${Date.now()}`;

    // Perform preliminary automated analysis
    const analysis: EvidenceAnalysisResult = {
      id: `an_${Date.now()}`,
      evidenceId: evId,
      analysisType:
        evidenceData.evidenceCategory === 'BUILDING_PLAN'
          ? 'FLOOR_PLAN_OCR'
          : evidenceData.evidenceCategory === 'CAMPUS_VIDEO'
          ? 'VIDEO_FRAME_CV'
          : evidenceData.evidenceCategory.includes('PHOTO')
          ? 'PHOTO_CV'
          : 'DOCUMENT_TEXT_OCR',
      provider: 'AuthenX On-Device Computer Vision & OCR Engine',
      analysisStatus: 'COMPLETED',
      readabilityScore: 91,
      detectedLabels: [evidenceData.title.replace(/\.[^/.]+$/, ''), 'High Contrast Matrix', 'Valid Header Stamp'],
      findings: ['Evidence parsed successfully. Awaiting compliance officer confirmation.'],
      confidence: 90,
      createdAt: now,
    };

    const newEvidence: InfrastructureEvidence = {
      ...evidenceData,
      id: evId,
      assessmentId: assessment.id,
      versionNumber: 1,
      submittedAt: now,
      analysisResult: analysis,
    };

    assessment.evidence.unshift(newEvidence);

    // Update linked checklist item
    const itemIdx = assessment.items.findIndex((i) => i.ruleId === evidenceData.linkedRequirementId);
    if (itemIdx >= 0) {
      assessment.items[itemIdx].evidenceStatus = 'SUBMITTED';
      assessment.items[itemIdx].linkedEvidenceIds.push(evId);
      assessment.items[itemIdx].updatedAt = now;
    }

    // Add audit log
    assessment.auditLogs.unshift({
      id: `log_${Date.now()}`,
      assessmentId: assessment.id,
      actorId: 'usr_inst_001',
      actorName,
      eventType: 'EVIDENCE_UPLOADED',
      entityType: 'InfrastructureEvidence',
      entityId: evId,
      reason: `Uploaded evidence: ${evidenceData.title}`,
      createdAt: now,
    });

    this.saveAssessment(assessment);
    return newEvidence;
  },

  replaceEvidence(
    appId: string,
    evidenceId: string,
    newFile: { title: string; storagePath: string; fileType: string; fileSizeBytes: number; fileSize: string; fileHash: string },
    actorName = 'Dr. Arunachalam M.'
  ): InfrastructureEvidence | undefined {
    const assessment = this.getAssessmentByAppId(appId);
    if (!assessment) return undefined;

    const oldIndex = assessment.evidence.findIndex((e) => e.id === evidenceId);
    if (oldIndex === -1) return undefined;

    const old = assessment.evidence[oldIndex];
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const newVersionNumber = old.versionNumber + 1;
    const newId = `ev_${Date.now()}`;

    // Mark old as superseded
    assessment.evidence[oldIndex].reviewStatus = 'SUPERSEDED';

    const newEvidence: InfrastructureEvidence = {
      ...old,
      ...newFile,
      id: newId,
      versionNumber: newVersionNumber,
      previousVersionId: old.id,
      submittedAt: now,
      reviewStatus: 'SUBMITTED',
      analysisResult: {
        id: `an_${Date.now()}`,
        evidenceId: newId,
        analysisType: old.analysisResult?.analysisType || 'DOCUMENT_TEXT_OCR',
        provider: 'AuthenX On-Device Computer Vision & OCR Engine',
        analysisStatus: 'COMPLETED',
        readabilityScore: 95,
        detectedLabels: ['Replaced Evidence Version', newFile.title],
        findings: [`Supersedes version ${old.versionNumber}. Awaiting scrutiny verification.`],
        confidence: 93,
        createdAt: now,
      },
    };

    assessment.evidence.unshift(newEvidence);

    // Update checklist item links
    const item = assessment.items.find((i) => i.ruleId === old.linkedRequirementId);
    if (item) {
      item.evidenceStatus = 'REPLACED';
      item.linkedEvidenceIds = [newId, ...item.linkedEvidenceIds.filter((id) => id !== old.id)];
      item.updatedAt = now;
    }

    assessment.auditLogs.unshift({
      id: `log_${Date.now()}`,
      assessmentId: assessment.id,
      actorId: 'usr_inst_001',
      actorName,
      eventType: 'EVIDENCE_REPLACED',
      entityType: 'InfrastructureEvidence',
      entityId: newId,
      reason: `Replaced evidence ${old.title} (v${old.versionNumber}) with v${newVersionNumber}.`,
      createdAt: now,
    });

    this.saveAssessment(assessment);
    return newEvidence;
  },

  // Officer Actions
  recordOfficerAssessment(
    appId: string,
    itemId: string,
    officerResult: OfficerAssessmentResult,
    notes: string,
    officerName = 'Smt. Priya Sharma'
  ): ComplianceChecklistItem | undefined {
    const assessment = this.getAssessmentByAppId(appId);
    if (!assessment) return undefined;

    const item = assessment.items.find((i) => i.id === itemId);
    if (!item) return undefined;

    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    item.officerResult = officerResult;
    item.reviewerNotes = notes;
    item.reviewStatus = officerResult === 'APPROVED' ? 'CONFIRMED' : 'ESCALATED';
    item.assessedAt = now;
    item.updatedAt = now;

    // Recalculate assessment status
    const hasDeficiencies = assessment.items.some(
      (i) => i.officerResult === 'FLAGGED_DEFICIENCY' || i.officerResult === 'RECTIFICATION_REQUIRED'
    );
    const allApproved = assessment.items.every((i) => i.officerResult === 'APPROVED');
    assessment.status = hasDeficiencies ? 'DEFICIENCIES_NOTED' : allApproved ? 'COMPLIANT' : 'IN_PROGRESS';

    assessment.auditLogs.unshift({
      id: `log_${Date.now()}`,
      assessmentId: assessment.id,
      actorId: 'usr_comp_002',
      actorName: officerName,
      eventType: 'OFFICER_ASSESSMENT_RECORDED',
      entityType: 'ComplianceChecklistItem',
      entityId: item.id,
      reason: `Recorded result ${officerResult} on ${item.requirementCode}: ${notes}`,
      createdAt: now,
    });

    this.saveAssessment(assessment);
    return item;
  },

  sendEvidenceRequest(
    appId: string,
    reqData: Omit<EvidenceRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
    officerName = 'Smt. Priya Sharma'
  ): EvidenceRequest {
    const assessment = this.getAssessmentByAppId(appId) || this.initializeAssessmentForApplication(appId);
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const reqId = `req_${Date.now()}`;

    const newReq: EvidenceRequest = {
      ...reqData,
      id: reqId,
      status: 'SENT',
      createdAt: now,
      updatedAt: now,
    };

    assessment.evidenceRequests.unshift(newReq);
    assessment.status = 'EVIDENCE_REQUESTED';

    assessment.auditLogs.unshift({
      id: `log_${Date.now()}`,
      assessmentId: assessment.id,
      actorId: 'usr_comp_002',
      actorName: officerName,
      eventType: 'EVIDENCE_REQUEST_SENT',
      entityType: 'EvidenceRequest',
      entityId: reqId,
      reason: `Issued evidence request: ${reqData.reason}`,
      createdAt: now,
    });

    this.saveAssessment(assessment);
    return newReq;
  },

  submitEvidenceRequestResponse(
    appId: string,
    requestId: string,
    response: EvidenceRequestResponse
  ): EvidenceRequest | undefined {
    const assessment = this.getAssessmentByAppId(appId);
    if (!assessment) return undefined;

    const req = assessment.evidenceRequests.find((r) => r.id === requestId);
    if (!req) return undefined;

    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    req.status = 'RESPONSE_SUBMITTED';
    req.institutionResponse = response;
    req.updatedAt = now;

    assessment.auditLogs.unshift({
      id: `log_${Date.now()}`,
      assessmentId: assessment.id,
      actorId: 'usr_inst_001',
      actorName: response.submittedBy,
      eventType: 'EVIDENCE_REQUEST_RESPONSE',
      entityType: 'EvidenceRequest',
      entityId: requestId,
      reason: `Institution submitted response to ${req.reason}.`,
      createdAt: now,
    });

    this.saveAssessment(assessment);
    return req;
  },

  recommendInspection(
    appId: string,
    recData: Omit<InspectionRecommendation, 'id' | 'createdAt' | 'updatedAt'>,
    officerName = 'Smt. Priya Sharma'
  ): InspectionRecommendation {
    const assessment = this.getAssessmentByAppId(appId) || this.initializeAssessmentForApplication(appId);
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const recId = `rec_${Date.now()}`;

    const newRec: InspectionRecommendation = {
      ...recData,
      id: recId,
      createdAt: now,
      updatedAt: now,
    };

    assessment.inspectionRecommendations.unshift(newRec);
    assessment.status = 'INSPECTION_RECOMMENDED';

    assessment.auditLogs.unshift({
      id: `log_${Date.now()}`,
      assessmentId: assessment.id,
      actorId: 'usr_comp_002',
      actorName: officerName,
      eventType: 'INSPECTION_RECOMMENDED',
      entityType: 'InspectionRecommendation',
      entityId: recId,
      reason: recData.recommendationReason,
      createdAt: now,
    });

    this.saveAssessment(assessment);
    return newRec;
  },

  recordInspectionDecision(
    appId: string,
    recommendationId: string,
    status: InspectionRecommendationStatus,
    notes: string,
    officerName = 'Smt. Priya Sharma'
  ): InspectionRecommendation | undefined {
    const assessment = this.getAssessmentByAppId(appId);
    if (!assessment) return undefined;

    const rec = assessment.inspectionRecommendations.find((r) => r.id === recommendationId);
    if (!rec) return undefined;

    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    rec.status = status;
    rec.decisionNotes = notes;
    rec.decidedBy = officerName;
    rec.decidedAt = now;
    rec.updatedAt = now;

    assessment.auditLogs.unshift({
      id: `log_${Date.now()}`,
      assessmentId: assessment.id,
      actorId: 'usr_comp_002',
      actorName: officerName,
      eventType: 'INSPECTION_DECISION_RECORDED',
      entityType: 'InspectionRecommendation',
      entityId: recommendationId,
      reason: `Recorded inspection status: ${status}. Notes: ${notes}`,
      createdAt: now,
    });

    this.saveAssessment(assessment);
    return rec;
  },

  resolveFinding(appId: string, findingId: string, notes: string, officerName = 'Smt. Priya Sharma'): ComplianceFinding | undefined {
    const assessment = this.getAssessmentByAppId(appId);
    if (!assessment) return undefined;

    const finding = assessment.findings.find((f) => f.id === findingId);
    if (!finding) return undefined;

    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    finding.status = 'RESOLVED';
    finding.recommendedNextStep = `Resolved by ${officerName}: ${notes}`;
    finding.updatedAt = now;

    assessment.auditLogs.unshift({
      id: `log_${Date.now()}`,
      assessmentId: assessment.id,
      actorId: 'usr_comp_002',
      actorName: officerName,
      eventType: 'FINDING_RESOLVED',
      entityType: 'ComplianceFinding',
      entityId: findingId,
      reason: `Finding marked resolved: ${notes}`,
      createdAt: now,
    });

    this.saveAssessment(assessment);
    return finding;
  },

  // 6 Dynamic KPI Dashboard Metrics for Page 8
  getDashboardCounts(institutionId?: string): ComplianceDashboardCounts {
    const assessments = this.getAssessments(institutionId);

    const applicationsAssessed = assessments.length;
    let checklistRequirements = 0;
    let evidenceSubmitted = 0;
    let potentialGaps = 0;
    let additionalEvidenceRequests = 0;
    let inspectionRecommendationsPending = 0;

    assessments.forEach((a) => {
      checklistRequirements += a.items.length;
      evidenceSubmitted += a.evidence.filter((e) => e.reviewStatus !== 'SUPERSEDED').length;
      potentialGaps += a.findings.filter((f) => f.status === 'OPEN' || f.status === 'INVESTIGATING').length;
      additionalEvidenceRequests += a.evidenceRequests.filter((r) => r.status !== 'RESOLVED' && r.status !== 'CLOSED').length;
      inspectionRecommendationsPending += a.inspectionRecommendations.filter(
        (r) => r.status === 'RECOMMENDED_FOR_OFFICER_REVIEW' || r.status === 'INSPECTION_RECOMMENDED' || r.status === 'ASSESSMENT_PENDING'
      ).length;
    });

    return {
      applicationsAssessed,
      checklistRequirements,
      evidenceSubmitted,
      potentialGaps,
      additionalEvidenceRequests,
      inspectionRecommendationsPending,
    };
  },

  // CSV Report Generator
  exportComplianceToCSV(appId: string): string {
    const assessment = this.getAssessmentByAppId(appId);
    if (!assessment) return '';

    const headers = [
      'Requirement Code',
      'Title',
      'Regulatory Source',
      'Mandatory',
      'Evidence Status',
      'Preliminary Result',
      'Officer Result',
      'Review Status',
      'Reviewer Notes',
    ];

    const rows = assessment.items.map((i) => [
      `"${i.requirementCode}"`,
      `"${i.ruleTitle.replace(/"/g, '""')}"`,
      `"${i.regulatorySource}"`,
      i.mandatory ? 'YES' : 'NO',
      `"${i.evidenceStatus}"`,
      `"${i.preliminaryResult}"`,
      `"${i.officerResult}"`,
      `"${i.reviewStatus}"`,
      `"${(i.reviewerNotes || '').replace(/"/g, '""')}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },
};
