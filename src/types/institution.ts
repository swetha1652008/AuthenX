export type ApplicationType = 'EOA' | 'CHANGE';

export type ChangeCategory =
  | 'Course / Programme Changes'
  | 'Intake Changes'
  | 'Faculty Information Updates'
  | 'Institution Information Changes'
  | 'Other Authorized Changes';

export type ApplicationStatus =
  | 'Draft'
  | 'Ready for Submission'
  | 'Submitted'
  | 'Verification Pending'
  | 'Rectification Required'
  | 'Under Official Review'
  | 'Completed';

export type ValidationStatus =
  | 'Preliminary Check Passed'
  | 'Verification Pending'
  | 'Mismatch Detected'
  | 'Manual Review Required'
  | 'Verified by Authorized Source';

export type FindingSeverity = 'CRITICAL' | 'WARNING' | 'NOTICE' | 'VERIFIED';

export type DegreeLevel = 'Undergraduate' | 'Postgraduate' | 'Diploma' | 'Doctoral';

export type DocumentCategory =
  | 'Affidavits and Undertakings'
  | 'Accreditation / Certification Records'
  | 'NOCs and Permissions'
  | 'Faculty-related Evidence'
  | 'Infrastructure Evidence'
  | 'Other Required Documents';

export interface InstitutionDetails {
  name: string;
  aictePermanentId: string;
  aisheCode: string;
  institutionType: string;
  state: string;
  district: string;
  fullAddress: string;
  officialEmail: string;
  contactNumber: string;
  website: string;
  authorizedRepresentative: string;
  designation: string;
}

export interface CourseItem {
  id: string;
  programmeName: string;
  degreeLevel: DegreeLevel;
  programmeIdentifier: string;
  approvedIntake: number;
  proposedIntake: number;
  facultyCount: number;
  facultyRatioStatus?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: DocumentCategory;
  fileSize: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'Uploaded' | 'Verified' | 'Mismatch' | 'Pending' | 'Missing';
  verificationSource?: string;
  verificationHash?: string;
  isMandatory?: boolean;
  notes?: string;
}

export interface ValidationFinding {
  id: string;
  severity: FindingSeverity;
  title: string;
  explanation: string;
  relatedFieldOrDoc: string;
  evidenceReference?: string;
  recommendedAction: string;
  verificationStatus: string;
  lastChecked: string;
}

export interface ActivityEvent {
  id: string;
  eventType: string;
  timestamp: string;
  actor: string;
  notes: string;
  relatedDoc?: string;
}

export interface InstitutionApplication {
  id: string;
  institutionId: string;
  type: ApplicationType;
  changeCategory?: ChangeCategory;
  academicYear: string;
  referenceNumber: string;
  purposeRemarks: string;
  status: ApplicationStatus;
  validationStatus: ValidationStatus;
  createdAt: string;
  updatedAt: string;
  institution: InstitutionDetails;
  courses: CourseItem[];
  documents: DocumentItem[];
  findings: ValidationFinding[];
  timeline: ActivityEvent[];
  rectificationNotes?: string;
  officerObservations?: string;
}
