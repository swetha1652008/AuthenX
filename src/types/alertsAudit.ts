export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type AlertStatus =
  | 'NEW'
  | 'OPEN'
  | 'ASSIGNED'
  | 'UNDER_REVIEW'
  | 'AWAITING_INSTITUTION'
  | 'AWAITING_EXTERNAL'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'CLOSED';

export type AlertCategory =
  | 'DOCUMENT_TAMPERING_SUSPECTED'
  | 'METADATA_INCONSISTENCY'
  | 'UNTRUSTED_ISSUING_AUTHORITY'
  | 'AUTHORITY_API_TIMEOUT'
  | 'INFRASTRUCTURE_DEFICIT'
  | 'FACULTY_CADRE_RATIO_VIOLATION'
  | 'EXPIRED_STATUTORY_DOCUMENT'
  | 'RECTIFICATION_DEADLINE_APPROACHING'
  | 'RECTIFICATION_OVERDUE'
  | 'SECURITY_ROLE_VIOLATION'
  | 'REVALIDATION_FAILURE'
  | 'MANUAL_OVERRIDE_FLAG'
  | 'GEO_LOCATION_MISMATCH'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT';

export type SourceModule =
  | 'DOCUMENT_VAULT'
  | 'AI_VALIDATION'
  | 'ANOMALY_DETECTION'
  | 'ISSUING_AUTHORITY'
  | 'COMPLIANCE'
  | 'HUMAN_REVIEW'
  | 'SECURITY';

export interface AlertTimelineItem {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  comment?: string;
}

export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  category: AlertCategory;
  severity: AlertSeverity;
  status: AlertStatus;
  applicationId?: string;
  institutionId?: string;
  institutionName?: string;
  sourceModule: SourceModule;
  assignedOfficer?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  recommendedAction: string;
  deepLinkTarget: {
    section: string;
    param?: string;
  };
  timeline: AlertTimelineItem[];
  resolutionReason?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface CentralAuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  role: string;
  action: string;
  entityType: 'APPLICATION' | 'DOCUMENT' | 'COMPLIANCE_RULE' | 'RECTIFICATION' | 'ALERT' | 'USER_SESSION';
  entityId: string;
  applicationId?: string;
  changeSummary: string;
  previousValue?: string;
  newValue?: string;
  officerJustification?: string;
  sourceModule: SourceModule;
  ipAddress?: string;
}

export interface AlertsDashboardCounts {
  totalActiveAlerts: number;
  criticalHighAlerts: number;
  documentAnomalyAlerts: number;
  issuingAuthorityAlerts: number;
  regulatoryDeficitAlerts: number;
  overdueRectificationAlerts: number;
  awaitingActionAlerts: number;
  resolvedAlerts30Days: number;
}

export interface InAppNotification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  entityId?: string;
  createdAt: string;
  isRead: boolean;
  severity: AlertSeverity;
  linkTarget?: string;
}

export interface AlertFilterOptions {
  searchQuery: string;
  category?: 'ALL' | AlertCategory;
  severity?: 'ALL' | AlertSeverity;
  status?: 'ALL' | AlertStatus;
  assignedOfficer?: string;
  dateRange?: string;
}
