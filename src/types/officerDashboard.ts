export interface OfficerWorkloadStats {
  totalApplications: number;
  validationCompleted: number;
  validationPending: number;
}

export interface ComplianceAttentionStats {
  missingDocumentsCount: number;
  unresolvedDiscrepanciesCount: number;
  applicationsRequiringReviewCount: number;
  expiredDocumentsCount: number;
}

export type QueuePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface PriorityQueueItem {
  id: string;
  applicationId: string;
  institutionName: string;
  institutionId: string;
  applicationType: 'EOA' | 'CHANGE';
  issue: string;
  priority: QueuePriority;
  currentStatus: string;
  unresolvedCount: number;
  assignedOfficer: string;
  lastUpdated: string;
}

export interface RecentActivityItem {
  id: string;
  applicationId: string;
  institutionName: string;
  applicationType: string;
  submissionDate: string;
  validationStatus: string;
  latestAction: string;
  timestamp: string;
  actor: string;
}

export interface ApplicationListItem {
  id: string;
  institutionName: string;
  institutionId: string;
  applicationType: 'EOA' | 'CHANGE';
  academicYear: string;
  submissionDate: string;
  documentStatus: 'All Uploaded' | 'Missing Required' | 'Expired Detected' | 'Under Audit';
  validationStatus: string;
  missingDocumentCount: number;
  unresolvedDiscrepancyCount: number;
  assignedOfficer: string;
  lastUpdated: string;
  status: string;
}

export interface ApplicationFilterOptions {
  searchQuery: string;
  applicationType?: 'ALL' | 'EOA' | 'CHANGE';
  academicYear?: string;
  validationStatus?: string;
  documentStatus?: string;
  reviewStatus?: string;
  assignedOfficer?: string;
}
