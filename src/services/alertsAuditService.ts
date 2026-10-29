import type {
  SystemAlert,
  CentralAuditLog,
  InAppNotification,
  AlertsDashboardCounts,
  AlertStatus
} from '../types/alertsAudit';

const ALERTS_STORAGE_KEY = 'authenx_system_alerts_v1';
const AUDIT_STORAGE_KEY = 'authenx_central_audit_logs_v1';
const NOTIFICATIONS_STORAGE_KEY = 'authenx_in_app_notifications_v1';

const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: 'ALT-2026-101',
    title: 'Suspected Image Splicing in Computer Laboratory Photo',
    description: 'Computer vision analysis detected localized frequency variance and non-contiguous JPEG compression blocks indicative of spliced terminal equipment.',
    category: 'DOCUMENT_TAMPERING_SUSPECTED',
    severity: 'CRITICAL',
    status: 'UNDER_REVIEW',
    applicationId: 'APP-2026-AICTE-9104',
    institutionId: '1-938210941',
    institutionName: 'Apex Institute of Technology & Science',
    sourceModule: 'ANOMALY_DETECTION',
    assignedOfficer: 'Dr. Ramesh Sharma (Compliance Officer)',
    createdAt: '2026-10-24T14:20:00Z',
    updatedAt: '2026-10-26T16:00:00Z',
    dueDate: '2026-11-02',
    recommendedAction: 'Perform Error Level Analysis (ELA), request high-resolution uncompressed photo, or order spot physical inspection by regional team.',
    deepLinkTarget: {
      section: 'authentication',
      param: 'DOC-2026-081'
    },
    timeline: [
      {
        id: 'TL-101-1',
        timestamp: '2026-10-24T14:20:00Z',
        actor: 'AuthenX AI Anomaly Engine',
        role: 'SYSTEM',
        action: 'ALERT_GENERATED',
        comment: 'Splicing confidence 91.4% flagged during automated document authentication.'
      },
      {
        id: 'TL-101-2',
        timestamp: '2026-10-25T09:30:00Z',
        actor: 'Dr. Ramesh Sharma',
        role: 'COMPLIANCE_OFFICER',
        action: 'STATUS_CHANGED',
        comment: 'Marked under investigation. Sent query to institution infrastructure head.'
      }
    ]
  },
  {
    id: 'ALT-2026-102',
    title: 'Fire Safety Certificate Verification Domain Mismatch',
    description: 'QR code scan redirected to unverified external commercial domain rather than state disaster management & fire services portal.',
    category: 'UNTRUSTED_ISSUING_AUTHORITY',
    severity: 'HIGH',
    status: 'AWAITING_INSTITUTION',
    applicationId: 'APP-2026-AICTE-7822',
    institutionId: '1-841902341',
    institutionName: 'National Institute of Engineering & Research',
    sourceModule: 'ISSUING_AUTHORITY',
    assignedOfficer: 'Dr. Ramesh Sharma (Compliance Officer)',
    createdAt: '2026-10-23T11:00:00Z',
    updatedAt: '2026-10-27T17:20:00Z',
    dueDate: '2026-11-05',
    recommendedAction: 'Awaiting verified state fire portal NOC response or dispatch verification request to Chief Fire Officer.',
    deepLinkTarget: {
      section: 'issuing-authority',
      param: 'APP-2026-AICTE-7822'
    },
    timeline: [
      {
        id: 'TL-102-1',
        timestamp: '2026-10-23T11:00:00Z',
        actor: 'Issuing Authority Verification Engine',
        role: 'SYSTEM',
        action: 'ALERT_GENERATED',
        comment: 'Authority URL rejected due to whitelist mismatch.'
      }
    ]
  },
  {
    id: 'ALT-2026-103',
    title: 'Associate Professor Shortfall in CSE Department (1:24 vs 1:20)',
    description: 'Student intake expansion from 120 to 180 requires minimum 9 faculty in department. Verified payroll shows deficit of 2 Associate Professors.',
    category: 'FACULTY_CADRE_RATIO_VIOLATION',
    severity: 'HIGH',
    status: 'OPEN',
    applicationId: 'APP-2026-AICTE-9104',
    institutionId: '1-938210941',
    institutionName: 'Apex Institute of Technology & Science',
    sourceModule: 'COMPLIANCE',
    assignedOfficer: 'Dr. Ramesh Sharma (Compliance Officer)',
    createdAt: '2026-10-22T08:30:00Z',
    updatedAt: '2026-10-25T14:15:00Z',
    dueDate: '2026-11-15',
    recommendedAction: 'Verify appointment ratifications and Form 16 TDS certificates before issuing approval committee clearance.',
    deepLinkTarget: {
      section: 'human-review',
      param: 'APP-2026-AICTE-9104'
    },
    timeline: [
      {
        id: 'TL-103-1',
        timestamp: '2026-10-22T08:30:00Z',
        actor: 'Statutory Rule Engine v2.4',
        role: 'SYSTEM',
        action: 'ALERT_GENERATED',
        comment: 'Cadre ratio deficit triggered under AICTE APH Clause 4.1.2.'
      }
    ]
  },
  {
    id: 'ALT-2026-104',
    title: 'Registered Land Lease Deed Expired on 30-June-2025',
    description: 'Land Title document OCR indicates lease term concluded without registered extension deed or registered sale conveyance deed.',
    category: 'EXPIRED_STATUTORY_DOCUMENT',
    severity: 'MEDIUM',
    status: 'ASSIGNED',
    applicationId: 'APP-2026-AICTE-8491',
    institutionId: '1-938210941',
    institutionName: 'Apex Institute of Technology & Science',
    sourceModule: 'DOCUMENT_VAULT',
    assignedOfficer: 'Smt. Kavitha Nair (Verification Officer)',
    createdAt: '2026-10-21T15:45:00Z',
    updatedAt: '2026-10-26T11:00:00Z',
    dueDate: '2026-11-20',
    recommendedAction: 'Require institution to upload registered extension lease deed certified by Sub-Registrar Office.',
    deepLinkTarget: {
      section: 'documents',
      param: 'APP-2026-AICTE-8491'
    },
    timeline: [
      {
        id: 'TL-104-1',
        timestamp: '2026-10-21T15:45:00Z',
        actor: 'Document Expiry Scanner',
        role: 'SYSTEM',
        action: 'ALERT_GENERATED',
        comment: 'Detected expired lease date from PDF OCR token stream.'
      }
    ]
  },
  {
    id: 'ALT-2026-105',
    title: 'Mandatory Faculty Cadre Rectification Overdue by 3 Days',
    description: 'Rectification notice RECT-2026-018 issued on 2026-10-05 expired without response or extension request from institution management.',
    category: 'RECTIFICATION_OVERDUE',
    severity: 'CRITICAL',
    status: 'ESCALATED',
    applicationId: 'APP-2026-AICTE-5192',
    institutionId: '1-628190342',
    institutionName: 'Vidyapeeth Engineering College',
    sourceModule: 'HUMAN_REVIEW',
    assignedOfficer: 'Shri. Rajesh Verma (Senior Regional Officer)',
    createdAt: '2026-10-25T00:01:00Z',
    updatedAt: '2026-10-27T10:00:00Z',
    dueDate: '2026-10-24',
    recommendedAction: 'Issue immediate Show-Cause Notice under Chapter VIII of Approval Process Handbook.',
    deepLinkTarget: {
      section: 'human-review',
      param: 'APP-2026-AICTE-5192'
    },
    timeline: [
      {
        id: 'TL-105-1',
        timestamp: '2026-10-25T00:01:00Z',
        actor: 'Deadline Chrono Watchdog',
        role: 'SYSTEM',
        action: 'ALERT_ESCALATED',
        comment: 'Automated deadline escalation triggered after due date elapsed.'
      }
    ]
  },
  {
    id: 'ALT-2026-106',
    title: 'Campus Walkthrough Video GPS Coordinates Mismatch',
    description: 'EXIF metadata on submitted campus infrastructure video points to coordinates 42km outside registered municipal survey boundaries.',
    category: 'GEO_LOCATION_MISMATCH',
    severity: 'MEDIUM',
    status: 'UNDER_REVIEW',
    applicationId: 'APP-2026-AICTE-7822',
    institutionId: '1-841902341',
    institutionName: 'National Institute of Engineering & Research',
    sourceModule: 'COMPLIANCE',
    assignedOfficer: 'Dr. Ramesh Sharma (Compliance Officer)',
    createdAt: '2026-10-20T16:30:00Z',
    updatedAt: '2026-10-24T12:00:00Z',
    dueDate: '2026-11-10',
    recommendedAction: 'Request re-filing of geo-tagged video recording using AuthenX mobile camera verification app.',
    deepLinkTarget: {
      section: 'compliance',
      param: 'APP-2026-AICTE-7822'
    },
    timeline: [
      {
        id: 'TL-106-1',
        timestamp: '2026-10-20T16:30:00Z',
        actor: 'Geo-Spatial Validation Engine',
        role: 'SYSTEM',
        action: 'ALERT_GENERATED',
        comment: 'Calculated haversine distance deviation of 42.6 km.'
      }
    ]
  },
  {
    id: 'ALT-2026-107',
    title: 'Repeated Invalid Certificate Reference Queries Detected',
    description: 'External IP address issued 12 rapid automated lookup attempts against unregistered certificate series.',
    category: 'UNAUTHORIZED_ACCESS_ATTEMPT',
    severity: 'LOW',
    status: 'RESOLVED',
    sourceModule: 'SECURITY',
    assignedOfficer: 'Security Administrator',
    createdAt: '2026-10-18T22:15:00Z',
    updatedAt: '2026-10-19T08:00:00Z',
    dueDate: '2026-10-19',
    recommendedAction: 'IP subnet rate-limited and flagged in Web Application Firewall (WAF).',
    deepLinkTarget: {
      section: 'issuing-authority'
    },
    timeline: [
      {
        id: 'TL-107-1',
        timestamp: '2026-10-18T22:15:00Z',
        actor: 'AuthenX Security Sentinel',
        role: 'SYSTEM',
        action: 'ALERT_GENERATED',
        comment: 'Rate threshold exceeded for authority lookup API.'
      },
      {
        id: 'TL-107-2',
        timestamp: '2026-10-19T08:00:00Z',
        actor: 'Security Administrator',
        role: 'REGULATORY_ADMIN',
        action: 'RESOLVED',
        comment: 'Enforced CIDR rate limiting rule. Incident closed.'
      }
    ],
    resolutionReason: 'Enforced CIDR block and verified normal API traffic resumed.',
    resolvedAt: '2026-10-19T08:00:00Z',
    resolvedBy: 'Security Administrator'
  }
];

const INITIAL_AUDIT_LOGS: CentralAuditLog[] = [
  {
    id: 'AUD-2026-8910',
    timestamp: '2026-10-27T17:20:00Z',
    actorId: 'OFFICER-001',
    actorName: 'Dr. Ramesh Sharma',
    role: 'COMPLIANCE_OFFICER',
    action: 'REVALIDATION_QUEUED',
    entityType: 'APPLICATION',
    entityId: 'APP-2026-AICTE-7822',
    applicationId: 'APP-2026-AICTE-7822',
    changeSummary: 'Queued automated re-validation following submission of updated fire safety NOC and ratified appointment order.',
    previousValue: 'Status: RECTIFICATION_REQUESTED',
    newValue: 'Status: REVALIDATION_PENDING',
    officerJustification: 'Institution provided authentic State Fire Directorate replacement document with verifiable QR code.',
    sourceModule: 'HUMAN_REVIEW',
    ipAddress: '10.24.18.42'
  },
  {
    id: 'AUD-2026-8909',
    timestamp: '2026-10-27T16:50:00Z',
    actorId: 'INST-ADMIN-01',
    actorName: 'Prof. S. V. Kulkarni',
    role: 'INSTITUTION_ADMIN',
    action: 'RECTIFICATION_RESPONSE_SUBMITTED',
    entityType: 'RECTIFICATION',
    entityId: 'RECT-2026-038',
    applicationId: 'APP-2026-AICTE-7822',
    changeSummary: 'Uploaded replacement fire safety NOC and ratified faculty appointment letter.',
    newValue: 'FireSafety_NOC_Updated.pdf (SHA256: e3b0c442...)',
    sourceModule: 'HUMAN_REVIEW',
    ipAddress: '49.36.12.188'
  },
  {
    id: 'AUD-2026-8908',
    timestamp: '2026-10-26T16:00:00Z',
    actorId: 'OFFICER-001',
    actorName: 'Dr. Ramesh Sharma',
    role: 'COMPLIANCE_OFFICER',
    action: 'ALERT_STATUS_UPDATED',
    entityType: 'ALERT',
    entityId: 'ALT-2026-101',
    applicationId: 'APP-2026-AICTE-9104',
    changeSummary: 'Updated alert status to UNDER_REVIEW following preliminary ELA photo analysis.',
    previousValue: 'Status: OPEN',
    newValue: 'Status: UNDER_REVIEW',
    officerJustification: 'Investigating image splicing anomaly on computer laboratory terminals.',
    sourceModule: 'ANOMALY_DETECTION',
    ipAddress: '10.24.18.42'
  },
  {
    id: 'AUD-2026-8907',
    timestamp: '2026-10-25T14:15:00Z',
    actorId: 'OFFICER-001',
    actorName: 'Dr. Ramesh Sharma',
    role: 'COMPLIANCE_OFFICER',
    action: 'RECTIFICATION_NOTICE_ISSUED',
    entityType: 'RECTIFICATION',
    entityId: 'RECT-2026-041',
    applicationId: 'APP-2026-AICTE-9104',
    changeSummary: 'Dispatched formal Rectification Notice for CSE faculty deficit and lab carpet area deficit.',
    newValue: 'Due Date: 2026-11-15; Status: AWAITING_RESPONSE',
    officerJustification: 'Statutory mandate under AICTE APH 2026-27 Table 4.1.',
    sourceModule: 'HUMAN_REVIEW',
    ipAddress: '10.24.18.42'
  },
  {
    id: 'AUD-2026-8906',
    timestamp: '2026-10-24T15:30:00Z',
    actorId: 'OFFICER-002',
    actorName: 'Smt. Kavitha Nair',
    role: 'DOCUMENT_VERIFICATION_OFFICER',
    action: 'REVIEW_COMPLETED',
    entityType: 'APPLICATION',
    entityId: 'APP-2026-AICTE-6231',
    applicationId: 'APP-2026-AICTE-6231',
    changeSummary: 'Completed full regulatory scrutiny and re-validation. Recommended for AICTE Approval Committee clearance.',
    previousValue: 'Status: UNDER_REVIEW',
    newValue: 'Status: COMPLETED',
    officerJustification: 'All laboratory photographs, faculty credentials, and digital signatures verified authentic.',
    sourceModule: 'HUMAN_REVIEW',
    ipAddress: '10.24.18.45'
  },
  {
    id: 'AUD-2026-8905',
    timestamp: '2026-10-24T14:20:00Z',
    actorId: 'AI-ENGINE-01',
    actorName: 'AuthenX AI Anomaly Engine',
    role: 'SYSTEM',
    action: 'ANOMALY_CONFIRMED',
    entityType: 'DOCUMENT',
    entityId: 'DOC-2026-081',
    applicationId: 'APP-2026-AICTE-9104',
    changeSummary: 'Flagged localized JPEG block inconsistency in CyberLab_v1.jpg.',
    newValue: 'Anomaly Severity: CRITICAL; Confidence: 91.4%',
    sourceModule: 'ANOMALY_DETECTION'
  },
  {
    id: 'AUD-2026-8904',
    timestamp: '2026-10-23T11:00:00Z',
    actorId: 'AUTH-GATEWAY',
    actorName: 'Issuing Authority Verification Engine',
    role: 'SYSTEM',
    action: 'AUTHORITY_VERIFIED_FAILED',
    entityType: 'DOCUMENT',
    entityId: 'DOC-2026-075',
    applicationId: 'APP-2026-AICTE-7822',
    changeSummary: 'QR Code verification failed: External domain does not match approved government portal whitelist.',
    newValue: 'Authority Status: UNTRUSTED_DOMAIN',
    sourceModule: 'ISSUING_AUTHORITY'
  },
  {
    id: 'AUD-2026-8903',
    timestamp: '2026-10-22T09:15:00Z',
    actorId: 'OFFICER-002',
    actorName: 'Smt. Kavitha Nair',
    role: 'DOCUMENT_VERIFICATION_OFFICER',
    action: 'CASE_ASSIGNED',
    entityType: 'APPLICATION',
    entityId: 'APP-2026-AICTE-8491',
    applicationId: 'APP-2026-AICTE-8491',
    changeSummary: 'Assigned EoA application to verification officer queue for land title scrutiny.',
    newValue: 'Assigned: Smt. Kavitha Nair',
    sourceModule: 'COMPLIANCE',
    ipAddress: '10.24.18.45'
  }
];

const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'NOTIF-01',
    recipientId: 'OFFICER-001',
    title: 'Rectification Response Received',
    message: 'National Institute of Engineering (APP-2026-AICTE-7822) submitted replacement Fire NOC and faculty appointment orders.',
    entityId: 'APP-2026-AICTE-7822',
    createdAt: '2026-10-27T16:50:00Z',
    isRead: false,
    severity: 'HIGH',
    linkTarget: '/human-review/APP-2026-AICTE-7822'
  },
  {
    id: 'NOTIF-02',
    recipientId: 'OFFICER-001',
    title: 'Critical Anomaly Detected',
    message: 'Suspected image splicing in laboratory photograph for Apex Institute (APP-2026-AICTE-9104).',
    entityId: 'ALT-2026-101',
    createdAt: '2026-10-24T14:20:00Z',
    isRead: false,
    severity: 'CRITICAL',
    linkTarget: '/alerts-audit/ALT-2026-101'
  },
  {
    id: 'NOTIF-03',
    recipientId: 'OFFICER-001',
    title: 'Rectification Deadline Approaching',
    message: 'Notice RECT-2026-041 for Apex Institute is due in 18 days (2026-11-15).',
    entityId: 'APP-2026-AICTE-9104',
    createdAt: '2026-10-25T14:15:00Z',
    isRead: true,
    severity: 'MEDIUM',
    linkTarget: '/human-review'
  }
];

export const alertsAuditService = {
  // -------------------------------------------------------------
  // ALERTS CRUD & ACTIONS
  // -------------------------------------------------------------
  getAlerts(): SystemAlert[] {
    try {
      const stored = localStorage.getItem(ALERTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(INITIAL_ALERTS));
    return INITIAL_ALERTS;
  },

  getAlertById(id: string): SystemAlert | undefined {
    const list = this.getAlerts();
    return list.find((a) => a.id === id);
  },

  updateAlert(updated: SystemAlert): SystemAlert {
    const list = this.getAlerts();
    const index = list.findIndex((a) => a.id === updated.id);
    let newList: SystemAlert[];
    if (index >= 0) {
      newList = [...list];
      newList[index] = { ...updated, updatedAt: new Date().toISOString() };
    } else {
      newList = [updated, ...list];
    }
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(newList));
    return index >= 0 ? newList[index] : updated;
  },

  updateAlertStatus(
    alertId: string,
    newStatus: AlertStatus,
    actorName: string,
    role: string,
    comment?: string
  ): SystemAlert {
    const alert = this.getAlertById(alertId);
    if (!alert) throw new Error(`Alert ${alertId} not found.`);

    const newTimelineItem = {
      id: `TL-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: actorName,
      role,
      action: `STATUS_${newStatus}`,
      comment: comment || `Alert status transitioned from ${alert.status} to ${newStatus}.`
    };

    const isResolving = newStatus === 'RESOLVED' || newStatus === 'CLOSED';

    const updatedAlert: SystemAlert = {
      ...alert,
      status: newStatus,
      timeline: [newTimelineItem, ...alert.timeline],
      resolutionReason: isResolving ? comment || alert.resolutionReason : alert.resolutionReason,
      resolvedAt: isResolving ? new Date().toISOString() : alert.resolvedAt,
      resolvedBy: isResolving ? actorName : alert.resolvedBy,
      updatedAt: new Date().toISOString()
    };

    // Also record central audit log event
    this.logAuditEvent({
      actorId: 'OFFICER-CURR',
      actorName,
      role,
      action: `ALERT_${newStatus}`,
      entityType: 'ALERT',
      entityId: alert.id,
      applicationId: alert.applicationId,
      changeSummary: `Alert [${alert.id}] marked ${newStatus}. ${comment || ''}`,
      previousValue: `Status: ${alert.status}`,
      newValue: `Status: ${newStatus}`,
      officerJustification: comment,
      sourceModule: alert.sourceModule
    });

    return this.updateAlert(updatedAlert);
  },

  assignAlert(alertId: string, officerName: string, assignerName: string): SystemAlert {
    const alert = this.getAlertById(alertId);
    if (!alert) throw new Error(`Alert ${alertId} not found.`);

    const newTimelineItem = {
      id: `TL-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: assignerName,
      role: 'OFFICER',
      action: 'ASSIGNED',
      comment: `Assigned alert to ${officerName}.`
    };

    const updatedAlert: SystemAlert = {
      ...alert,
      assignedOfficer: officerName,
      status: alert.status === 'NEW' ? 'ASSIGNED' : alert.status,
      timeline: [newTimelineItem, ...alert.timeline],
      updatedAt: new Date().toISOString()
    };

    return this.updateAlert(updatedAlert);
  },

  addAlertComment(alertId: string, comment: string, actorName: string, role: string): SystemAlert {
    const alert = this.getAlertById(alertId);
    if (!alert) throw new Error(`Alert ${alertId} not found.`);

    const newTimelineItem = {
      id: `TL-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: actorName,
      role,
      action: 'COMMENT_ADDED',
      comment
    };

    const updatedAlert: SystemAlert = {
      ...alert,
      timeline: [newTimelineItem, ...alert.timeline],
      updatedAt: new Date().toISOString()
    };

    return this.updateAlert(updatedAlert);
  },

  // -------------------------------------------------------------
  // CENTRAL AUDIT TRAIL LOGGING
  // -------------------------------------------------------------
  getAuditLogs(): CentralAuditLog[] {
    try {
      const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
    return INITIAL_AUDIT_LOGS;
  },

  logAuditEvent(eventData: Omit<CentralAuditLog, 'id' | 'timestamp'>): CentralAuditLog {
    const list = this.getAuditLogs();
    const newEntry: CentralAuditLog = {
      ...eventData,
      id: `AUD-${new Date().getFullYear()}-${String(list.length + 8911).padStart(4, '0')}`,
      timestamp: new Date().toISOString()
    };

    const newList = [newEntry, ...list];
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(newList));
    return newEntry;
  },

  exportAuditLogsToCsv(logsToExport?: CentralAuditLog[]): string {
    const logs = logsToExport || this.getAuditLogs();
    
    // Prevent CSV formula injection by sanitizing leading characters: =, +, -, @
    const sanitizeCsvField = (str: string | undefined): string => {
      if (!str) return '""';
      let clean = String(str).replace(/"/g, '""');
      if (/^[=+\-@\t\r]/.test(clean)) {
        clean = `'${clean}`;
      }
      return `"${clean}"`;
    };

    const headers = [
      'Log ID',
      'Timestamp (UTC)',
      'Actor ID',
      'Actor Name',
      'Role',
      'Action Taken',
      'Entity Type',
      'Entity ID',
      'Application ID',
      'Change Summary',
      'Previous Value',
      'New Value',
      'Officer Justification',
      'Source Module',
      'IP Address'
    ];

    const rows = logs.map((l) => [
      sanitizeCsvField(l.id),
      sanitizeCsvField(l.timestamp),
      sanitizeCsvField(l.actorId),
      sanitizeCsvField(l.actorName),
      sanitizeCsvField(l.role),
      sanitizeCsvField(l.action),
      sanitizeCsvField(l.entityType),
      sanitizeCsvField(l.entityId),
      sanitizeCsvField(l.applicationId),
      sanitizeCsvField(l.changeSummary),
      sanitizeCsvField(l.previousValue),
      sanitizeCsvField(l.newValue),
      sanitizeCsvField(l.officerJustification),
      sanitizeCsvField(l.sourceModule),
      sanitizeCsvField(l.ipAddress)
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  },

  // -------------------------------------------------------------
  // IN-APP NOTIFICATIONS
  // -------------------------------------------------------------
  getNotifications(): InAppNotification[] {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  },

  markNotificationAsRead(id: string): void {
    const list = this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  },

  markAllNotificationsAsRead(): void {
    const list = this.getNotifications();
    const updated = list.map((n) => ({ ...n, isRead: true }));
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  },

  // -------------------------------------------------------------
  // DASHBOARD KPI STATS
  // -------------------------------------------------------------
  getDashboardCounts(): AlertsDashboardCounts {
    const alerts = this.getAlerts();

    const activeAlerts = alerts.filter(
      (a) => a.status !== 'RESOLVED' && a.status !== 'CLOSED'
    );

    return {
      totalActiveAlerts: activeAlerts.length,
      criticalHighAlerts: activeAlerts.filter(
        (a) => a.severity === 'CRITICAL' || a.severity === 'HIGH'
      ).length,
      documentAnomalyAlerts: activeAlerts.filter(
        (a) =>
          a.category === 'DOCUMENT_TAMPERING_SUSPECTED' ||
          a.category === 'METADATA_INCONSISTENCY'
      ).length,
      issuingAuthorityAlerts: activeAlerts.filter(
        (a) =>
          a.category === 'UNTRUSTED_ISSUING_AUTHORITY' ||
          a.category === 'AUTHORITY_API_TIMEOUT'
      ).length,
      regulatoryDeficitAlerts: activeAlerts.filter(
        (a) =>
          a.category === 'INFRASTRUCTURE_DEFICIT' ||
          a.category === 'FACULTY_CADRE_RATIO_VIOLATION' ||
          a.category === 'EXPIRED_STATUTORY_DOCUMENT'
      ).length,
      overdueRectificationAlerts: activeAlerts.filter(
        (a) => a.category === 'RECTIFICATION_OVERDUE'
      ).length,
      awaitingActionAlerts: activeAlerts.filter(
        (a) =>
          a.status === 'NEW' ||
          a.status === 'OPEN' ||
          a.status === 'AWAITING_INSTITUTION'
      ).length,
      resolvedAlerts30Days: alerts.filter(
        (a) => a.status === 'RESOLVED' || a.status === 'CLOSED'
      ).length
    };
  }
};
