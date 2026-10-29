import { institutionService } from './institutionService';
import { complianceService } from './complianceService';
import type { UserRoleId } from '../types/auth';
import type {
  ScrutinyApplicationSummary,
  CrossModuleDiscrepancy,
  OfficerObservationItem,
  ClarificationEvidenceRequest,
  AuthorizedDecisionRecord,
  FinalReviewDashboardKPIs,
  AuthorizedDecisionOutcome,
} from '../types/finalReview';

const STORAGE_DISCREPANCIES = 'authenx_scrutiny_discrepancies_v1';
const STORAGE_OBSERVATIONS = 'authenx_scrutiny_observations_v1';
const STORAGE_REQUESTS = 'authenx_scrutiny_clarification_reqs_v1';
const STORAGE_DECISIONS = 'authenx_scrutiny_decisions_v1';

export const INITIAL_DISCREPANCIES: CrossModuleDiscrepancy[] = [
  {
    id: 'disc_9104_01',
    applicationId: 'APP-2026-AICTE-9104',
    fieldName: 'Cybersecurity Laboratory Area',
    source1: 'Municipal Sanctioned Blueprint #OC-2025/941',
    source1Value: 'Room 304 demarcated as General Classroom (48 sqm)',
    source2: 'APH 2026-27 Table 3.4 Norms & Proposed Intake',
    source2Value: 'Requires dedicated Cyber Lab of minimum 66 sqm with 30 high-end workstations',
    severity: 'CRITICAL',
    explanation: 'Proposed intake expansion to 120 seats in Cyber Security requires specialized laboratory space not demarcated in uploaded blueprint.',
    status: 'OPEN',
  },
  {
    id: 'disc_9104_02',
    applicationId: 'APP-2026-AICTE-9104',
    fieldName: 'Faculty Cadre Count (Cyber Security)',
    source1: 'Faculty Payroll Matrix / Appointment Orders',
    source1Value: '5 Approved faculty members verified via VTU Belgavi Ledger',
    source2: 'AICTE APH Appendix 7 Table 7.1 Cadre Norm',
    source2Value: 'Requires 8 full-time faculty (1 Prof, 2 Assoc, 5 Asst) for 120 intake',
    severity: 'CRITICAL',
    explanation: 'Deficit of 3 faculty members prior to sanction of intake expansion from 60 to 120 seats.',
    status: 'OPEN',
  },
  {
    id: 'disc_8491_01',
    applicationId: 'APP-2026-AICTE-8491',
    fieldName: 'Mechanical Dept Faculty Cadre Balance',
    source1: 'Institutional Faculty Cadre Matrix',
    source1Value: 'Assistant Professor count within 5% of minimum requirement',
    source2: 'APH 2026-27 Appendix 7',
    source2Value: 'Strict cadre distribution adherence',
    severity: 'NOTICE',
    explanation: 'Overall faculty ratio compliant at 1:15, but cadre cadence recommended to be preserved during upcoming term.',
    status: 'RESOLVED',
    resolutionNotes: 'Verified cadre sustainability plan submitted by institution principal.',
  },
];

export const INITIAL_OBSERVATIONS: OfficerObservationItem[] = [
  {
    id: 'obs_8491_01',
    applicationId: 'APP-2026-AICTE-8491',
    category: 'LAND',
    requirementOrField: 'REG-2026-LAND-01 (Campus Land Title)',
    severity: 'SATISFACTORY',
    officerNotes: 'Bhoomi Karnataka Land Revenue API confirmed unencumbered title of 5.2 acres. Revenue survey 42/1 matches registered deed.',
    reviewerName: 'Smt. Priya Sharma',
    reviewerRole: 'COMPLIANCE_OFFICER',
    timestamp: '2026-10-26 14:30 IST',
    status: 'SUBMITTED',
  },
  {
    id: 'obs_9104_01',
    applicationId: 'APP-2026-AICTE-9104',
    category: 'FACULTY',
    requirementOrField: 'REG-2026-FAC-03 (Faculty Cadre Ratio)',
    severity: 'CRITICAL',
    officerNotes: 'Deficit of 3 faculty profiles for requested intake expansion. Clarification notice dispatched to applicant.',
    reviewerName: 'Smt. Priya Sharma',
    reviewerRole: 'COMPLIANCE_OFFICER',
    timestamp: '2026-10-27 11:20 IST',
    status: 'SUBMITTED',
  },
];

export const INITIAL_CLARIFICATION_REQUESTS: ClarificationEvidenceRequest[] = [
  {
    id: 'req_clar_9104',
    applicationId: 'APP-2026-AICTE-9104',
    targetFindingOrItem: 'REG-2026-FAC-03 & Blueprint Cyber Lab Room 304',
    requestedInfo: 'Upload appointment letters and joining reports for 3 additional faculty members and architectural endorsement for Cyber Lab 304.',
    justification: 'Mandatory statutory prerequisite under APH 2026-27 Section 2.4 and Table 3.4.',
    dueDate: '2026-11-05',
    status: 'AWAITING_INSTITUTION',
    officerNotes: 'Transmitted via official portal notification queue.',
  },
];

export const finalReviewService = {
  getDiscrepancies(): CrossModuleDiscrepancy[] {
    try {
      const stored = localStorage.getItem(STORAGE_DISCREPANCIES);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    localStorage.setItem(STORAGE_DISCREPANCIES, JSON.stringify(INITIAL_DISCREPANCIES));
    return INITIAL_DISCREPANCIES;
  },

  getObservations(): OfficerObservationItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_OBSERVATIONS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    localStorage.setItem(STORAGE_OBSERVATIONS, JSON.stringify(INITIAL_OBSERVATIONS));
    return INITIAL_OBSERVATIONS;
  },

  getClarificationRequests(): ClarificationEvidenceRequest[] {
    try {
      const stored = localStorage.getItem(STORAGE_REQUESTS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    localStorage.setItem(STORAGE_REQUESTS, JSON.stringify(INITIAL_CLARIFICATION_REQUESTS));
    return INITIAL_CLARIFICATION_REQUESTS;
  },

  getDecisionRecords(): AuthorizedDecisionRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_DECISIONS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  },

  getScrutinyApplications(): ScrutinyApplicationSummary[] {
    const apps = institutionService.getApplications();
    const assessments = complianceService.getAssessments();
    const discrepancies = this.getDiscrepancies();
    const requests = this.getClarificationRequests();
    const decisions = this.getDecisionRecords();

    return apps.map((app) => {
      const asm = assessments.find((a) => a.applicationReference === app.id);
      const appDiscrepancies = discrepancies.filter((d) => d.applicationId === app.id && d.status === 'OPEN');
      const appRequests = requests.filter((r) => r.applicationId === app.id && r.status === 'AWAITING_INSTITUTION');
      const decision = decisions.find((d) => d.applicationId === app.id);

      // Completeness score formula:
      const totalDocs = app.documents.length || 1;
      const verifiedDocs = app.documents.filter((d) => d.status === 'Verified').length;
      const completenessScore = Math.round((verifiedDocs / totalDocs) * 100);

      // Workflow stage mapping:
      let overallStage: ScrutinyApplicationSummary['overallStage'] = 'STAGE_7_OFFICER_SCRUTINY';
      if (decision) overallStage = 'STAGE_9_DECISION_RECORDED';
      else if (appRequests.length > 0) overallStage = 'STAGE_8_EVIDENCE_INSPECTION';
      else if (completenessScore < 60) overallStage = 'STAGE_2_PRE_VALIDATION';

      // Pending action:
      let pendingActionType: ScrutinyApplicationSummary['pendingActionType'] = 'None';
      if (decision) pendingActionType = 'None';
      else if (appRequests.length > 0) pendingActionType = 'Clarification Requested';
      else if (appDiscrepancies.length > 0) pendingActionType = 'Officer Determination';
      else if (app.documents.some((d) => d.status === 'Missing')) pendingActionType = 'Document Missing';

      return {
        id: app.id,
        applicationRef: app.referenceNumber || app.id,
        institutionName: app.institution?.name || 'Apex Institute of Technology & Science',
        institutionId: app.institutionId,
        applicationCategory: app.type,
        academicYear: app.academicYear,
        submissionDate: app.createdAt,
        completenessScore,
        documentVerificationStatus:
          app.validationStatus === 'Verified by Authorized Source'
            ? 'Verified by Authorized Source'
            : app.validationStatus === 'Mismatch Detected'
            ? 'Mismatch Detected'
            : 'Manual Review Required',
        regulatoryComplianceStatus:
          appDiscrepancies.length > 0 ? 'Deficit Gap Detected' : 'Fully Compliant',
        infrastructureReviewStatus:
          asm?.inspectionRecommendations.some((r) => r.status === 'INSPECTION_RECOMMENDED')
            ? 'Inspection Recommended'
            : appDiscrepancies.length > 0
            ? 'Deficient'
            : 'Satisfactory',
        pendingActionType,
        assignedOfficer: asm?.assignedOfficer || 'Smt. Priya Sharma (Scrutiny Committee 3)',
        overallStage,
        lastUpdated: app.updatedAt,
      };
    });
  },

  getDashboardKPIs(): FinalReviewDashboardKPIs {
    const queue = this.getScrutinyApplications();
    const discrepancies = this.getDiscrepancies();
    const requests = this.getClarificationRequests();
    const decisions = this.getDecisionRecords();

    return {
      totalUnderReview: queue.length,
      readyForOfficerReview: queue.filter(
        (a) => a.completenessScore >= 80 && a.pendingActionType !== 'Clarification Requested'
      ).length,
      pendingVerification: queue.filter((a) => a.documentVerificationStatus !== 'Verified by Authorized Source').length,
      unresolvedDiscrepancies: discrepancies.filter((d) => d.status === 'OPEN').length,
      evidenceRequestsPending: requests.filter((r) => r.status === 'AWAITING_INSTITUTION').length,
      awaitingAuthorizedDecision: queue.filter((a) => !decisions.some((d) => d.applicationId === a.id)).length,
    };
  },

  getApplicationScrutinyDetails(appId: string) {
    const app = institutionService.getApplicationById(appId) || institutionService.getApplications()[0];
    const assessment = complianceService.getAssessmentByAppId(app.id);
    const discrepancies = this.getDiscrepancies().filter((d) => d.applicationId === app.id);
    const observations = this.getObservations().filter((o) => o.applicationId === app.id);
    const evidenceRequests = this.getClarificationRequests().filter((r) => r.applicationId === app.id);
    const decisionRecord = this.getDecisionRecords().find((d) => d.applicationId === app.id);

    return {
      app,
      assessment,
      discrepancies,
      observations,
      evidenceRequests,
      decisionRecord,
    };
  },

  saveObservation(
    data: Partial<OfficerObservationItem>,
    actorName = 'Smt. Priya Sharma',
    actorRole: UserRoleId = 'COMPLIANCE_OFFICER'
  ): OfficerObservationItem {
    const list = this.getObservations();
    const newObs: OfficerObservationItem = {
      id: `obs_${Date.now()}`,
      applicationId: data.applicationId || 'APP-2026-AICTE-8491',
      category: data.category || 'DOCUMENTATION',
      requirementOrField: data.requirementOrField || 'General Scrutiny Review',
      severity: data.severity || 'OBSERVATION',
      officerNotes: data.officerNotes || 'Recorded observation in scrutiny dossier.',
      reviewerName: actorName,
      reviewerRole: actorRole,
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString('en-US', { hour12: false })} IST`,
      status: 'SUBMITTED',
    };
    list.unshift(newObs);
    localStorage.setItem(STORAGE_OBSERVATIONS, JSON.stringify(list));
    return newObs;
  },

  resolveDiscrepancy(discrepancyId: string, notes: string, actorName = 'Scrutiny Officer'): boolean {
    const list = this.getDiscrepancies();
    const idx = list.findIndex((d) => d.id === discrepancyId);
    if (idx < 0) return false;

    list[idx].status = 'RESOLVED';
    list[idx].resolutionNotes = `${notes} (Resolved by ${actorName})`;
    localStorage.setItem(STORAGE_DISCREPANCIES, JSON.stringify(list));
    return true;
  },

  sendClarificationRequest(
    data: Partial<ClarificationEvidenceRequest>,
    actorName = 'Smt. Priya Sharma'
  ): ClarificationEvidenceRequest {
    const list = this.getClarificationRequests();
    const newReq: ClarificationEvidenceRequest = {
      id: `req_clar_${Date.now()}`,
      applicationId: data.applicationId || 'APP-2026-AICTE-9104',
      targetFindingOrItem: data.targetFindingOrItem || 'Statutory Prerequisite',
      requestedInfo: data.requestedInfo || 'Clarification and supporting certified evidence required.',
      justification: data.justification || 'Statutory requirement per Approval Process Handbook 2026-27.',
      dueDate: data.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'AWAITING_INSTITUTION',
      officerNotes: `Transmitted by ${actorName}`,
    };
    list.unshift(newReq);
    localStorage.setItem(STORAGE_REQUESTS, JSON.stringify(list));
    return newReq;
  },

  recordAuthorizedDecision(
    appId: string,
    outcome: AuthorizedDecisionOutcome,
    remarks: string,
    actorName = 'Prof. Anil Sahasrabudhe',
    actorRole: UserRoleId = 'REGULATORY_ADMIN'
  ): AuthorizedDecisionRecord {
    const decisions = this.getDecisionRecords();
    const existingIdx = decisions.findIndex((d) => d.applicationId === appId);

    const record: AuthorizedDecisionRecord = {
      id: `dec_${appId}_${Date.now()}`,
      applicationId: appId,
      workflowStage: 'STAGE_9_DECISION_RECORDED',
      outcome,
      remarks,
      decisionMaker: actorName,
      decisionMakerRole: actorRole,
      decisionTimestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString('en-US', { hour12: false })} IST`,
      ruleEngineVersion: 'AICTE APH v2026.2',
      regulatoryReferences: [
        'AICTE Act 1987 Section 10(k)',
        'Approval Process Handbook (APH 2026-27) Chapter II',
        'Regulations for Grant of Approval for Technical Institutions 2020',
      ],
      amendmentHistory: [],
    };

    if (existingIdx >= 0) {
      const prev = decisions[existingIdx];
      record.amendmentHistory = [
        ...prev.amendmentHistory,
        {
          timestamp: prev.decisionTimestamp,
          amendedBy: actorName,
          previousOutcome: prev.outcome,
          amendmentReason: remarks,
        },
      ];
      decisions[existingIdx] = record;
    } else {
      decisions.unshift(record);
    }

    localStorage.setItem(STORAGE_DECISIONS, JSON.stringify(decisions));
    return record;
  },

  exportScrutinyReportCsv(appId: string): string {
    const details = this.getApplicationScrutinyDetails(appId);
    const headers = ['Category', 'ItemOrField', 'StatusOrVerdict', 'ExplanationNotes', 'Timestamp'];

    const sanitize = (val: unknown): string => {
      let str = String(val ?? '');
      if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
        str = "'" + str;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows: string[][] = [];

    // Documents
    details.app.documents.forEach((d) => {
      rows.push([
        sanitize('DOCUMENT_VERIFICATION'),
        sanitize(d.name),
        sanitize(d.status),
        sanitize(`Source: ${d.verificationSource || 'Uploaded File'}`),
        sanitize(d.uploadDate),
      ]);
    });

    // Discrepancies
    details.discrepancies.forEach((disc) => {
      rows.push([
        sanitize('DISCREPANCY'),
        sanitize(disc.fieldName),
        sanitize(disc.severity),
        sanitize(disc.explanation),
        sanitize(disc.status),
      ]);
    });

    // Observations
    details.observations.forEach((obs) => {
      rows.push([
        sanitize('OFFICER_OBSERVATION'),
        sanitize(obs.requirementOrField),
        sanitize(obs.severity),
        sanitize(obs.officerNotes),
        sanitize(obs.timestamp),
      ]);
    });

    // Decision
    if (details.decisionRecord) {
      rows.push([
        sanitize('AUTHORIZED_DECISION'),
        sanitize(details.decisionRecord.outcome),
        sanitize('OFFICIAL_RECORD'),
        sanitize(details.decisionRecord.remarks),
        sanitize(details.decisionRecord.decisionTimestamp),
      ]);
    }

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  },
};
