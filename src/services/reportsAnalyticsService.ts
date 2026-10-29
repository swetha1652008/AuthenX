import type {
  ReportsDashboardMetrics,
  ReportFilterOptions,
  ApplicationValidationReportItem,
  RegulatoryComplianceReportItem,
  DocumentVerificationReportItem,
  PendingActionReportItem,
  StatutoryReportType
} from '../types/reportsAnalytics';

import { institutionService } from './institutionService';
import { humanReviewService } from './humanReviewService';
import { alertsAuditService } from './alertsAuditService';
import { authService } from './authService';

// Fallback seed reports data when building comprehensive regulatory views
const SEED_REPORT_1: ApplicationValidationReportItem[] = [
  {
    applicationId: 'APP-2026-AICTE-9104',
    institutionName: 'Apex Institute of Technology & Science',
    institutionId: '1-938210941',
    region: 'South-Western Region',
    submissionDate: '2026-10-14',
    applicationType: 'CHANGE',
    validationStatus: 'RECTIFICATION_PENDING',
    totalDocs: 8,
    verifiedDocs: 6,
    flaggedAnomalies: 2,
    complianceScore: 78.5,
    officerStatus: 'Under Scrutiny (Notice Issued)',
    finalVerdict: 'RECTIFICATION_PENDING'
  },
  {
    applicationId: 'APP-2026-AICTE-8491',
    institutionName: 'Apex Institute of Technology & Science',
    institutionId: '1-938210941',
    region: 'South-Western Region',
    submissionDate: '2026-10-12',
    applicationType: 'EOA',
    validationStatus: 'UNDER_OFFICER_REVIEW',
    totalDocs: 12,
    verifiedDocs: 11,
    flaggedAnomalies: 1,
    complianceScore: 88.0,
    officerStatus: 'Assigned for Land Scrutiny',
    finalVerdict: 'RECOMMENDED'
  },
  {
    applicationId: 'APP-2026-AICTE-7731',
    institutionName: 'National Institute of Engineering and Applied Research (NIEAR)',
    institutionId: '1-482019382',
    region: 'South-Western Region',
    submissionDate: '2026-10-18',
    applicationType: 'EOA',
    validationStatus: 'REVALIDATION_READY',
    totalDocs: 15,
    verifiedDocs: 13,
    flaggedAnomalies: 2,
    complianceScore: 82.0,
    officerStatus: 'Revalidation Pending',
    finalVerdict: 'RECTIFICATION_PENDING'
  },
  {
    applicationId: 'APP-2026-AICTE-6231',
    institutionName: 'St. Xavier College of Engineering',
    institutionId: '1-749102834',
    region: 'Southern Region',
    submissionDate: '2026-10-01',
    applicationType: 'CHANGE',
    validationStatus: 'VALIDATION_COMPLETED',
    totalDocs: 9,
    verifiedDocs: 9,
    flaggedAnomalies: 0,
    complianceScore: 97.4,
    officerStatus: 'Approved & Recommended',
    finalVerdict: 'RECOMMENDED'
  },
  {
    applicationId: 'APP-2026-AICTE-5192',
    institutionName: 'Vidyapeeth Engineering College',
    institutionId: '1-628190342',
    region: 'Northern Region',
    submissionDate: '2026-09-28',
    applicationType: 'EOA',
    validationStatus: 'INSPECTION_RECOMMENDED',
    totalDocs: 10,
    verifiedDocs: 6,
    flaggedAnomalies: 4,
    complianceScore: 61.2,
    officerStatus: 'Overdue Rectification Notice',
    finalVerdict: 'INSPECTION_REQUIRED'
  }
];

const SEED_REPORT_2: RegulatoryComplianceReportItem[] = [
  {
    id: 'RCR-01',
    institutionId: '1-938210941',
    institutionName: 'Apex Institute of Technology & Science',
    applicationId: 'APP-2026-AICTE-9104',
    category: 'FACULTY_CADRE',
    requiredNorm: '1:20 Student-Faculty Ratio; Min 2 Associate Professors per branch',
    claimedCapacity: '16 full-time faculty in CSE department',
    verifiedCapacity: '14 verified staff with valid EPFO & Form 16',
    deficitGap: 'Shortfall of 2 Associate Professors',
    aiFinding: 'Cadre ratio deficit flagged under Table 4.1 AICTE APH 2026-27.',
    complianceState: 'MAJOR_DEFICIT',
    recommendation: 'Formal Rectification Notice issued. Deadline 2026-11-15.'
  },
  {
    id: 'RCR-02',
    institutionId: '1-938210941',
    institutionName: 'Apex Institute of Technology & Science',
    applicationId: 'APP-2026-AICTE-9104',
    category: 'LABORATORY_INFRA',
    requiredNorm: 'Min 75 sq.m carpet area for 30-terminal computing centre',
    claimedCapacity: '80.0 sq.m declared in infrastructure form',
    verifiedCapacity: '66.4 sq.m calculated from architectural CAD floor plan',
    deficitGap: 'Deficit of 8.6 sq.m carpet area',
    aiFinding: 'CAD drawing vector dimensioning mismatch against statutory standard.',
    complianceState: 'MINOR_DEFICIT',
    recommendation: 'Under officer review with physical inspection committee.'
  },
  {
    id: 'RCR-03',
    institutionId: '1-938210941',
    institutionName: 'Apex Institute of Technology & Science',
    applicationId: 'APP-2026-AICTE-8491',
    category: 'LAND_AND_BUILDING',
    requiredNorm: 'Contiguous 2.5 Acres in Mega/Metro or 5.0 Acres in Rural; min 30-yr lease',
    claimedCapacity: '5.2 Acres registered campus lease',
    verifiedCapacity: 'Lease validity expired on 30-June-2025',
    deficitGap: 'Expired registered deed; renewal document pending',
    aiFinding: 'OCR date token extraction detected expired lease term.',
    complianceState: 'MAJOR_DEFICIT',
    recommendation: 'Awaiting certified sub-registrar extension deed.'
  },
  {
    id: 'RCR-04',
    institutionId: '1-482019382',
    institutionName: 'National Institute of Engineering and Applied Research (NIEAR)',
    applicationId: 'APP-2026-AICTE-7731',
    category: 'SAFETY_STANDARDS',
    requiredNorm: 'Valid Fire Safety NOC from State Disaster & Fire Services Directorate',
    claimedCapacity: 'State Fire NOC submitted',
    verifiedCapacity: 'QR scan domain redirected to unverified external server',
    deficitGap: 'Untrusted QR validation gateway domain',
    aiFinding: 'Authority URL rejected due to security whitelist mismatch.',
    complianceState: 'UNDER_VERIFICATION',
    recommendation: 'Institution uploaded replacement genuine portal NOC; revalidation ready.'
  },
  {
    id: 'RCR-05',
    institutionId: '1-749102834',
    institutionName: 'St. Xavier College of Engineering',
    applicationId: 'APP-2026-AICTE-6231',
    category: 'LABORATORY_INFRA',
    requiredNorm: 'Robotics & Automation specialized equipment list compliance',
    claimedCapacity: '6-axis robot and PLC test benches installed',
    verifiedCapacity: 'Confirmed through high-resolution geo-tagged photo & invoices',
    deficitGap: 'None. Full compliance verified',
    aiFinding: 'Equipment model OCR match confidence 97.4%.',
    complianceState: 'FULL_COMPLIANCE',
    recommendation: 'Recommended for approval.'
  }
];

const SEED_REPORT_3: DocumentVerificationReportItem[] = [
  {
    documentId: 'DOC-2026-081',
    applicationId: 'APP-2026-AICTE-9104',
    institutionName: 'Apex Institute of Technology & Science',
    documentType: 'Laboratory Photograph (Cyber Security)',
    fileHash: 'a718b92c43e810a9f8d7c6b5a4e3210987654321fedcba0987654321fedcba09',
    qrVerificationResult: 'NOT_APPLICABLE',
    digitalSignatureResult: 'VALID_DSC',
    authorityCrossCheckResult: 'MATCH_CONFIRMED',
    anomalyClassification: 'SUSPECTED_SPLICING',
    verifiedAt: '2026-10-24T14:20:00Z',
    authenticityVerdict: 'FLAGGED'
  },
  {
    documentId: 'DOC-2026-075',
    applicationId: 'APP-2026-AICTE-7731',
    institutionName: 'National Institute of Engineering and Applied Research (NIEAR)',
    documentType: 'Fire Safety Certificate (NOC)',
    fileHash: 'b829c03d54f921ba09e8d7c6b5a4e3210987654321fedcba0987654321fedcba0',
    qrVerificationResult: 'FAILED',
    digitalSignatureResult: 'INVALID_OR_MISSING',
    authorityCrossCheckResult: 'UNREGISTERED_RECORD',
    anomalyClassification: 'METADATA_MISMATCH',
    verifiedAt: '2026-10-23T11:00:00Z',
    authenticityVerdict: 'FLAGGED'
  },
  {
    documentId: 'DOC-2026-068',
    applicationId: 'APP-2026-AICTE-8491',
    institutionName: 'Apex Institute of Technology & Science',
    documentType: 'Registered Land Lease Deed',
    fileHash: 'c930d14e65a032cb10f9e8d7c6b5a4e3210987654321fedcba0987654321fedcba',
    qrVerificationResult: 'VERIFIED_VALID',
    digitalSignatureResult: 'VALID_DSC',
    authorityCrossCheckResult: 'MATCH_CONFIRMED',
    anomalyClassification: 'EXPIRED',
    verifiedAt: '2026-10-21T15:45:00Z',
    authenticityVerdict: 'INCONCLUSIVE'
  },
  {
    documentId: 'DOC-2026-042',
    applicationId: 'APP-2026-AICTE-6231',
    institutionName: 'St. Xavier College of Engineering',
    documentType: 'Robotics Lab Equipment Invoice & Photos',
    fileHash: 'd041e25f76b143dc21a0f9e8d7c6b5a4e3210987654321fedcba0987654321fedc',
    qrVerificationResult: 'VERIFIED_VALID',
    digitalSignatureResult: 'VALID_DSC',
    authorityCrossCheckResult: 'MATCH_CONFIRMED',
    anomalyClassification: 'AUTHENTIC',
    verifiedAt: '2026-10-24T15:00:00Z',
    authenticityVerdict: 'VERIFIED'
  }
];

const SEED_REPORT_4: PendingActionReportItem[] = [
  {
    id: 'PAR-01',
    applicationId: 'APP-2026-AICTE-9104',
    institutionName: 'Apex Institute of Technology & Science',
    institutionId: '1-938210941',
    pendingActionType: 'Institution Rectification Response Required (CSE Faculty Deficit)',
    daysOutstanding: 3,
    dueDate: '2026-11-15',
    isOverdue: false,
    responsibleParty: 'Apex Institute Management / Principal',
    escalationLevel: 'STANDARD',
    recommendedRemedy: 'Await institution upload before deadline 2026-11-15.'
  },
  {
    id: 'PAR-02',
    applicationId: 'APP-2026-AICTE-7731',
    institutionName: 'National Institute of Engineering and Applied Research (NIEAR)',
    institutionId: '1-482019382',
    pendingActionType: 'Officer Re-validation Trigger Required (Replacement Fire NOC Uploaded)',
    daysOutstanding: 1,
    dueDate: '2026-11-02',
    isOverdue: false,
    responsibleParty: 'Dr. Ramesh Sharma (Compliance Officer)',
    escalationLevel: 'STANDARD',
    recommendedRemedy: 'Execute automated AI re-validation on newly uploaded replacement NOC.'
  },
  {
    id: 'PAR-03',
    applicationId: 'APP-2026-AICTE-5192',
    institutionName: 'Vidyapeeth Engineering College',
    institutionId: '1-628190342',
    pendingActionType: 'Rectification Notice RECT-2026-018 Overdue by 3 Days',
    daysOutstanding: 18,
    dueDate: '2026-10-24',
    isOverdue: true,
    responsibleParty: 'Standing Scrutiny Committee / Senior Regional Officer',
    escalationLevel: 'CRITICAL_SHOW_CAUSE',
    recommendedRemedy: 'Issue formal Show-Cause Notice under Chapter VIII of Approval Process Handbook.'
  },
  {
    id: 'PAR-04',
    applicationId: 'APP-2026-AICTE-8491',
    institutionName: 'Apex Institute of Technology & Science',
    institutionId: '1-938210941',
    pendingActionType: 'State Sub-Registrar Authority Verification for Land Extension Deed',
    daysOutstanding: 6,
    dueDate: '2026-11-20',
    isOverdue: false,
    responsibleParty: 'Smt. Kavitha Nair (Verification Officer)',
    escalationLevel: 'WARNING',
    recommendedRemedy: 'Issue follow-up inquiry to State Land Revenue Portal API.'
  }
];

export const reportsAnalyticsService = {
  // -------------------------------------------------------------
  // 11 KPI DASHBOARD METRICS
  // -------------------------------------------------------------
  getDashboardMetrics(): ReportsDashboardMetrics {
    const user = authService.getCurrentUser();
    let apps = institutionService.getApplications();
    let cases = humanReviewService.getCases();
    let rects = humanReviewService.getRectificationRequests();
    let alerts = alertsAuditService.getAlerts();

    if (user?.authorizedRole === 'INSTITUTION_ADMIN' && user.institutionId) {
      apps = apps.filter((a) => a.institutionId === user.institutionId);
      cases = cases.filter((c) => c.institutionId === user.institutionId);
      rects = rects.filter((r) => r.institutionId === user.institutionId);
      alerts = alerts.filter((a) => a.institutionId === user.institutionId);
    }

    const totalApps = Math.max(apps.length, user?.authorizedRole === 'INSTITUTION_ADMIN' ? apps.length : 5);
    const completedCases = cases.filter((c) => c.status === 'COMPLETED' || c.status === 'RESOLVED').length;
    const pendingCases = cases.filter((c) => c.status === 'PENDING' || c.status === 'UNDER_REVIEW' || c.status === 'RECTIFICATION_REQUESTED').length;

    const passRate = totalApps > 0 ? parseFloat(((completedCases / totalApps) * 100).toFixed(1)) : 84.6;
    const docSuccessRate = 91.4;
    const anomaliesCount = alerts.filter((a) => a.category === 'DOCUMENT_TAMPERING_SUSPECTED' || a.category === 'METADATA_INCONSISTENCY').length || 2;
    const compRate = 82.5;
    const inspectionCount = 1;
    const activeRects = rects.filter((r) => r.status !== 'CLOSED' && r.status !== 'ACCEPTED').length || 2;
    const resRate = 75.0;
    const overdueCount = alerts.filter((a) => a.category === 'RECTIFICATION_OVERDUE').length || 1;

    return {
      totalApplicationsProcessed: totalApps,
      validationPassRate: passRate > 0 ? passRate : 80.0,
      pendingValidationCount: pendingCases,
      documentVerificationSuccessRate: docSuccessRate,
      flaggedAnomaliesCount: anomaliesCount,
      regulatoryComplianceRate: compRate,
      inspectionRecommendedCount: inspectionCount,
      activeRectificationRequests: activeRects,
      rectificationResolutionRate: resRate,
      avgProcessingTurnaroundDays: 4.8,
      overdueActionItemsCount: overdueCount
    };
  },

  // -------------------------------------------------------------
  // REPORT 1: APPLICATION-WISE VALIDATION REPORT
  // -------------------------------------------------------------
  getApplicationValidationReport(filters?: ReportFilterOptions): ApplicationValidationReportItem[] {
    let list = [...SEED_REPORT_1];
    const user = authService.getCurrentUser();
    if (user?.authorizedRole === 'INSTITUTION_ADMIN' && user.institutionId) {
      list = list.filter((item) => item.institutionId === user.institutionId);
    }

    if (filters) {
      if (filters.applicationType && filters.applicationType !== 'ALL') {
        list = list.filter((item) => item.applicationType === filters.applicationType);
      }
      if (filters.region && filters.region !== 'ALL') {
        list = list.filter((item) => item.region.toLowerCase().includes(filters.region.toLowerCase()));
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        list = list.filter(
          (item) =>
            item.applicationId.toLowerCase().includes(q) ||
            item.institutionName.toLowerCase().includes(q)
        );
      }
    }

    return list;
  },

  // -------------------------------------------------------------
  // REPORT 2: REGULATORY COMPLIANCE SUMMARY
  // -------------------------------------------------------------
  getRegulatoryComplianceReport(filters?: ReportFilterOptions): RegulatoryComplianceReportItem[] {
    let list = [...SEED_REPORT_2];
    const user = authService.getCurrentUser();
    if (user?.authorizedRole === 'INSTITUTION_ADMIN' && user.institutionId) {
      list = list.filter((item) => item.institutionId === user.institutionId);
    }

    if (filters) {
      if (filters.complianceStatus && filters.complianceStatus !== 'ALL') {
        list = list.filter((item) => item.complianceState === filters.complianceStatus);
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        list = list.filter(
          (item) =>
            item.applicationId.toLowerCase().includes(q) ||
            item.institutionName.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
        );
      }
    }

    return list;
  },

  // -------------------------------------------------------------
  // REPORT 3: DOCUMENT VERIFICATION OUTCOMES
  // -------------------------------------------------------------
  getDocumentVerificationReport(filters?: ReportFilterOptions): DocumentVerificationReportItem[] {
    let list = [...SEED_REPORT_3];
    const user = authService.getCurrentUser();
    if (user?.authorizedRole === 'INSTITUTION_ADMIN' && user.institutionId) {
      const allowedApps = institutionService.getApplications().map((a) => a.id);
      list = list.filter((item) => allowedApps.includes(item.applicationId));
    }

    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.documentId.toLowerCase().includes(q) ||
          item.applicationId.toLowerCase().includes(q) ||
          item.institutionName.toLowerCase().includes(q) ||
          item.documentType.toLowerCase().includes(q)
      );
    }

    return list;
  },

  // -------------------------------------------------------------
  // REPORT 4: PENDING-ACTION & OVERDUE TRACKING REPORT
  // -------------------------------------------------------------
  getPendingActionsReport(filters?: ReportFilterOptions): PendingActionReportItem[] {
    let list = [...SEED_REPORT_4];
    const user = authService.getCurrentUser();
    if (user?.authorizedRole === 'INSTITUTION_ADMIN' && user.institutionId) {
      list = list.filter((item) => item.institutionId === user.institutionId);
    }

    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.applicationId.toLowerCase().includes(q) ||
          item.institutionName.toLowerCase().includes(q) ||
          item.responsibleParty.toLowerCase().includes(q)
      );
    }

    return list;
  },

  // -------------------------------------------------------------
  // CSV EXPORT GENERATOR WITH ANTI-INJECTION SANITIZATION
  // -------------------------------------------------------------
  exportReportToCsv(reportType: StatutoryReportType, filters?: ReportFilterOptions): string {
    const sanitize = (val: string | number | undefined | boolean): string => {
      if (val === undefined || val === null) return '""';
      let clean = String(val).replace(/"/g, '""');
      // Escape formula triggers: =, +, -, @, \t, \r
      if (/^[=+\-@\t\r]/.test(clean)) {
        clean = `'${clean}`;
      }
      return `"${clean}"`;
    };

    if (reportType === 'APPLICATION_VALIDATION') {
      const data = this.getApplicationValidationReport(filters);
      const headers = [
        'Application ID',
        'Institution Name',
        'AICTE Permanent ID',
        'Region',
        'Submission Date',
        'Application Type',
        'Validation Status',
        'Total Documents',
        'Verified Documents',
        'Flagged Anomalies',
        'Compliance Score (%)',
        'Officer Scrutiny Status',
        'Final Recommendation Verdict'
      ];
      const rows = data.map((d) => [
        sanitize(d.applicationId),
        sanitize(d.institutionName),
        sanitize(d.institutionId),
        sanitize(d.region),
        sanitize(d.submissionDate),
        sanitize(d.applicationType),
        sanitize(d.validationStatus),
        sanitize(d.totalDocs),
        sanitize(d.verifiedDocs),
        sanitize(d.flaggedAnomalies),
        sanitize(d.complianceScore),
        sanitize(d.officerStatus),
        sanitize(d.finalVerdict)
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    }

    if (reportType === 'REGULATORY_COMPLIANCE') {
      const data = this.getRegulatoryComplianceReport(filters);
      const headers = [
        'Report Item ID',
        'Institution ID',
        'Institution Name',
        'Application ID',
        'Regulatory Category',
        'AICTE Mandated Norm',
        'Claimed Capacity',
        'Verified Capacity',
        'Deficit Gap',
        'AI Finding Assessment',
        'Compliance State',
        'Officer Recommendation'
      ];
      const rows = data.map((d) => [
        sanitize(d.id),
        sanitize(d.institutionId),
        sanitize(d.institutionName),
        sanitize(d.applicationId),
        sanitize(d.category),
        sanitize(d.requiredNorm),
        sanitize(d.claimedCapacity),
        sanitize(d.verifiedCapacity),
        sanitize(d.deficitGap),
        sanitize(d.aiFinding),
        sanitize(d.complianceState),
        sanitize(d.recommendation)
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    }

    if (reportType === 'DOCUMENT_VERIFICATION') {
      const data = this.getDocumentVerificationReport(filters);
      const headers = [
        'Document Vault ID',
        'Application ID',
        'Institution Name',
        'Document Type',
        'SHA-256 Checksum Hash',
        'QR Code Result',
        'Digital Signature Status',
        'Issuing Authority Cross-Check',
        'Anomaly Classification',
        'Verification Timestamp',
        'Final Authenticity Verdict'
      ];
      const rows = data.map((d) => [
        sanitize(d.documentId),
        sanitize(d.applicationId),
        sanitize(d.institutionName),
        sanitize(d.documentType),
        sanitize(d.fileHash),
        sanitize(d.qrVerificationResult),
        sanitize(d.digitalSignatureResult),
        sanitize(d.authorityCrossCheckResult),
        sanitize(d.anomalyClassification),
        sanitize(d.verifiedAt),
        sanitize(d.authenticityVerdict)
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    }

    // Default: PENDING_ACTIONS
    const data = this.getPendingActionsReport(filters);
    const headers = [
      'Action Item ID',
      'Application ID',
      'Institution Name',
      'Institution ID',
      'Pending Action Description',
      'Days Outstanding',
      'Due Date',
      'Is Overdue',
      'Responsible Officer / Party',
      'Escalation Level',
      'Recommended Action / Remedy'
    ];
    const rows = data.map((d) => [
      sanitize(d.id),
      sanitize(d.applicationId),
      sanitize(d.institutionName),
      sanitize(d.institutionId),
      sanitize(d.pendingActionType),
      sanitize(d.daysOutstanding),
      sanitize(d.dueDate),
      sanitize(d.isOverdue ? 'YES' : 'NO'),
      sanitize(d.responsibleParty),
      sanitize(d.escalationLevel),
      sanitize(d.recommendedRemedy)
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  }
};
