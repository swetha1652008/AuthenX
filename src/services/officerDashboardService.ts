import { institutionService } from './institutionService';
import { complianceService } from './complianceService';
import type {
  OfficerWorkloadStats,
  ComplianceAttentionStats,
  PriorityQueueItem,
  RecentActivityItem,
  ApplicationListItem,
  ApplicationFilterOptions,
} from '../types/officerDashboard';

export const officerDashboardService = {
  getWorkloadStats(): OfficerWorkloadStats {
    const apps = institutionService.getApplications();
    const totalApplications = apps.length;

    // A completed validation requires official verification or completed status
    const validationCompleted = apps.filter(
      (a) => a.status === 'Completed' || a.validationStatus === 'Verified by Authorized Source'
    ).length;

    const validationPending = totalApplications - validationCompleted;

    return {
      totalApplications,
      validationCompleted,
      validationPending,
    };
  },

  getComplianceAttentionStats(): ComplianceAttentionStats {
    const apps = institutionService.getApplications();
    const assessments = complianceService.getAssessments();

    // 1. Applications with Missing Documents
    let missingDocsApps = 0;
    apps.forEach((a) => {
      const hasMissingDoc = a.documents.some((d) => d.status === 'Missing');
      const asm = assessments.find((asm) => asm.applicationReference === a.id);
      const hasMissingChecklist = asm?.items.some((i) => i.mandatory && i.evidenceStatus === 'NOT_SUBMITTED');
      if (hasMissingDoc || hasMissingChecklist) {
        missingDocsApps++;
      }
    });

    // 2. Applications with Unresolved Discrepancies
    let unresolvedDiscrepancyApps = 0;
    apps.forEach((a) => {
      const hasCriticalFinding = a.findings.some(
        (f) => (f.severity === 'CRITICAL' || f.severity === 'WARNING') && f.verificationStatus !== 'Verified by Authorized Source'
      );
      const asm = assessments.find((asm) => asm.applicationReference === a.id);
      const hasOpenComplianceFinding = asm?.findings.some(
        (f) => (f.severity === 'CRITICAL' || f.severity === 'WARNING') && f.status === 'OPEN'
      );
      if (hasCriticalFinding || hasOpenComplianceFinding) {
        unresolvedDiscrepancyApps++;
      }
    });

    // 3. Applications Requiring Officer Review
    const appsRequiringReview = apps.filter(
      (a) =>
        a.status === 'Under Official Review' ||
        a.status === 'Rectification Required' ||
        a.validationStatus === 'Manual Review Required' ||
        a.validationStatus === 'Mismatch Detected'
    ).length;

    // 4. Expired Documents Count
    let expiredDocsCount = 0;
    const now = new Date();
    apps.forEach((a) => {
      a.documents.forEach((d) => {
        if (d.expiryDate) {
          const exp = new Date(d.expiryDate);
          if (exp < now) {
            expiredDocsCount++;
          }
        }
      });
    });

    return {
      missingDocumentsCount: missingDocsApps,
      unresolvedDiscrepanciesCount: unresolvedDiscrepancyApps,
      applicationsRequiringReviewCount: appsRequiringReview,
      expiredDocumentsCount: expiredDocsCount,
    };
  },

  getPriorityReviewQueue(): PriorityQueueItem[] {
    const apps = institutionService.getApplications();
    const assessments = complianceService.getAssessments();

    const queue: PriorityQueueItem[] = [];

    apps.forEach((app) => {
      const asm = assessments.find((a) => a.applicationReference === app.id);
      const openFindings = [
        ...app.findings.filter((f) => f.severity === 'CRITICAL' || f.severity === 'WARNING'),
        ...(asm?.findings.filter((f) => (f.severity === 'CRITICAL' || f.severity === 'WARNING') && f.status === 'OPEN') || []),
      ];

      const inspectionPending = asm?.inspectionRecommendations.some(
        (r) => r.status === 'INSPECTION_RECOMMENDED' || r.status === 'RECOMMENDED_FOR_OFFICER_REVIEW'
      );

      let priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
      let issue = 'Routine application compliance check';

      if (openFindings.some((f) => f.severity === 'CRITICAL')) {
        priority = 'CRITICAL';
        issue = openFindings.find((f) => f.severity === 'CRITICAL')?.explanation || 'Critical regulatory discrepancy detected';
      } else if (inspectionPending || app.status === 'Rectification Required') {
        priority = 'HIGH';
        issue = inspectionPending
          ? 'Physical inspection recommended for facility validation'
          : 'Rectification documentation required from institution';
      } else if (app.status === 'Under Official Review' || app.validationStatus === 'Manual Review Required') {
        priority = 'MEDIUM';
        issue = 'Preliminary checks completed; officer review pending';
      }

      // Add to queue if requires attention
      if (priority !== 'LOW' || app.status === 'Under Official Review') {
        queue.push({
          id: `queue_${app.id}`,
          applicationId: app.id,
          institutionName: app.institution?.name || 'Apex Institute of Technology & Science',
          institutionId: app.institutionId,
          applicationType: app.type,
          issue,
          priority,
          currentStatus: app.status,
          unresolvedCount: openFindings.length,
          assignedOfficer: asm?.assignedOfficer || 'Smt. Priya Sharma (Compliance Officer)',
          lastUpdated: app.updatedAt,
        });
      }
    });

    // Sort by priority severity
    const priorityWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    return queue.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
  },

  getRecentActivity(): RecentActivityItem[] {
    const apps = institutionService.getApplications();
    const activities: RecentActivityItem[] = [];

    apps.forEach((app) => {
      if (app.timeline && app.timeline.length > 0) {
        app.timeline.forEach((evt) => {
          activities.push({
            id: evt.id,
            applicationId: app.id,
            institutionName: app.institution?.name || 'Technical Institution',
            applicationType: app.type === 'EOA' ? 'Extension of Approval' : 'Approval Changes',
            submissionDate: app.createdAt,
            validationStatus: app.validationStatus,
            latestAction: evt.eventType + ' — ' + evt.notes,
            timestamp: evt.timestamp,
            actor: evt.actor,
          });
        });
      }
    });

    // Sort by timestamp descending
    return activities.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 10);
  },

  getAllApplications(
    filters: ApplicationFilterOptions,
    sortField = 'lastUpdated',
    sortOrder: 'asc' | 'desc' = 'desc',
    page = 1,
    pageSize = 10
  ): { items: ApplicationListItem[]; totalCount: number; totalPages: number } {
    const apps = institutionService.getApplications();
    const assessments = complianceService.getAssessments();

    const items: ApplicationListItem[] = apps.map((app) => {
      const asm = assessments.find((a) => a.applicationReference === app.id);

      const missingDocCount =
        app.documents.filter((d) => d.status === 'Missing').length +
        (asm?.items.filter((i) => i.mandatory && i.evidenceStatus === 'NOT_SUBMITTED').length || 0);

      const discrepancyCount =
        app.findings.filter((f) => f.severity === 'CRITICAL' || f.severity === 'WARNING').length +
        (asm?.findings.filter((f) => (f.severity === 'CRITICAL' || f.severity === 'WARNING') && f.status === 'OPEN').length || 0);

      let docStatus: 'All Uploaded' | 'Missing Required' | 'Expired Detected' | 'Under Audit' = 'All Uploaded';
      if (missingDocCount > 0) docStatus = 'Missing Required';
      else if (app.documents.some((d) => d.expiryDate && new Date(d.expiryDate) < new Date())) docStatus = 'Expired Detected';
      else if (app.status === 'Under Official Review') docStatus = 'Under Audit';

      return {
        id: app.id,
        institutionName: app.institution?.name || 'Technical Institution',
        institutionId: app.institutionId,
        applicationType: app.type,
        academicYear: app.academicYear,
        submissionDate: app.createdAt,
        documentStatus: docStatus,
        validationStatus: app.validationStatus,
        missingDocumentCount: missingDocCount,
        unresolvedDiscrepancyCount: discrepancyCount,
        assignedOfficer: asm?.assignedOfficer || 'Smt. Priya Sharma (AICTE)',
        lastUpdated: app.updatedAt,
        status: app.status,
      };
    });

    // Apply Filters
    let filtered = items;

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.institutionName.toLowerCase().includes(q) ||
          i.institutionId.toLowerCase().includes(q)
      );
    }

    if (filters.applicationType && filters.applicationType !== 'ALL') {
      filtered = filtered.filter((i) => i.applicationType === filters.applicationType);
    }

    if (filters.academicYear) {
      filtered = filtered.filter((i) => i.academicYear === filters.academicYear);
    }

    if (filters.validationStatus) {
      filtered = filtered.filter((i) => i.validationStatus === filters.validationStatus);
    }

    if (filters.documentStatus) {
      filtered = filtered.filter((i) => i.documentStatus === filters.documentStatus);
    }

    if (filters.reviewStatus) {
      filtered = filtered.filter((i) => i.status === filters.reviewStatus);
    }

    if (filters.assignedOfficer) {
      filtered = filtered.filter((i) => i.assignedOfficer.includes(filters.assignedOfficer || ''));
    }

    // Apply Sorting
    filtered.sort((a, b) => {
      let valA = a[sortField as keyof ApplicationListItem] ?? '';
      let valB = b[sortField as keyof ApplicationListItem] ?? '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      totalCount,
      totalPages,
    };
  },

  exportApplicationsToCSV(): string {
    const { items } = this.getAllApplications({ searchQuery: '' }, 'lastUpdated', 'desc', 1, 1000);

    const headers = [
      'Application ID',
      'Institution Name',
      'Institution ID',
      'Application Type',
      'Academic Year',
      'Submission Date',
      'Document Status',
      'Validation Status',
      'Missing Docs',
      'Unresolved Discrepancies',
      'Assigned Officer',
      'Application Status',
    ];

    const rows = items.map((i) => [
      `"${i.id}"`,
      `"${i.institutionName.replace(/"/g, '""')}"`,
      `"${i.institutionId}"`,
      `"${i.applicationType}"`,
      `"${i.academicYear}"`,
      `"${i.submissionDate}"`,
      `"${i.documentStatus}"`,
      `"${i.validationStatus}"`,
      i.missingDocumentCount,
      i.unresolvedDiscrepancyCount,
      `"${i.assignedOfficer}"`,
      `"${i.status}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },
};
