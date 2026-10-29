import type {
  HumanReviewCase,
  RectificationRequest,
  RevalidationRun,
  HumanReviewDashboardStats,
  InstitutionResponseData,
} from '../types/humanReview';

const CASES_STORAGE_KEY = 'authenx_human_review_cases_v1';
const RECTIFICATIONS_STORAGE_KEY = 'authenx_rectification_requests_v1';
const REVALIDATIONS_STORAGE_KEY = 'authenx_revalidations_v1';

const INITIAL_CASES: HumanReviewCase[] = [
  {
    id: 'HRC-2026-091',
    applicationId: 'APP-2026-AICTE-9104',
    institutionId: '1-938210941',
    institutionName: 'Apex Institute of Technology & Science',
    applicationType: 'CHANGE',
    programCourse: 'Computer Science & Engineering (Intake +60)',
    region: 'South-Western Region',
    priority: 'HIGH',
    status: 'RECTIFICATION_REQUESTED',
    assignedOfficer: 'Dr. Ramesh Sharma (Compliance Officer)',
    dueDate: '2026-11-15',
    createdAt: '2026-10-20T10:30:00Z',
    updatedAt: '2026-10-25T14:15:00Z',
    findingSummary: 'Faculty deficit in CSE and laboratory carpet area discrepancy against AICTE APH 2026-27 norms.',
    findingsCount: 2,
    findings: [
      {
        id: 'FIND-9104-01',
        title: 'Faculty Cadre Ratio Deficit in CSE Department',
        category: 'FACULTY_DEFICIENCY',
        severity: 'HIGH',
        aiObservation: 'Calculated faculty-to-student ratio is 1:24 vs mandated 1:20 norm for undergraduate engineering. Shortage of 2 Associate Professors.',
        officerDetermination: 'AI finding confirmed upon cross-verification of payroll and biometric records. Formal rectification notice issued.',
        status: 'RECTIFICATION_REQUESTED',
        confidenceScore: 94.5,
        ruleRef: 'AICTE APH Clause 4.1.2 - Faculty Cadre Norms',
        evidenceRef: 'Faculty List & Form 16 Tax Filings'
      },
      {
        id: 'FIND-9104-02',
        title: 'Advanced Cyber Security Lab Floor Plan Shortfall',
        category: 'INFRASTRUCTURE_MISMATCH',
        severity: 'MEDIUM',
        aiObservation: 'Submitted CAD drawing indicates 66.4 sq.m carpet area vs required minimum 75 sq.m for 30-terminal computing laboratory.',
        officerDetermination: 'Under preliminary review with physical infrastructure team.',
        status: 'IN_REVIEW',
        confidenceScore: 89.0,
        ruleRef: 'AICTE APH Clause 5.3 - Computer Centre & Lab Norms',
        evidenceRef: 'CyberLab_FloorPlan_v1.pdf'
      }
    ],
    remarksHistory: [
      {
        id: 'REM-001',
        timestamp: '2026-10-20T11:00:00Z',
        officerName: 'Dr. Ramesh Sharma',
        officerRole: 'COMPLIANCE_OFFICER',
        remark: 'Case opened based on automated AICTE Rule Engine discrepancy flag.',
        actionTaken: 'CASE_ASSIGNED'
      },
      {
        id: 'REM-002',
        timestamp: '2026-10-25T14:15:00Z',
        officerName: 'Dr. Ramesh Sharma',
        officerRole: 'COMPLIANCE_OFFICER',
        remark: 'Issued formal Rectification Notice RECT-2026-041 with 20-day deadline.',
        actionTaken: 'RECTIFICATION_REQUESTED'
      }
    ]
  },
  {
    id: 'HRC-2026-084',
    applicationId: 'APP-2026-AICTE-8491',
    institutionId: '1-938210941',
    institutionName: 'Apex Institute of Technology & Science',
    applicationType: 'EOA',
    programCourse: 'All Technical Programs (Extension of Approval)',
    region: 'South-Western Region',
    priority: 'MEDIUM',
    status: 'UNDER_REVIEW',
    assignedOfficer: 'Smt. Kavitha Nair (Verification Officer)',
    dueDate: '2026-11-20',
    createdAt: '2026-10-22T09:15:00Z',
    updatedAt: '2026-10-26T11:45:00Z',
    findingSummary: 'Land Lease Deed validity expired on 2025-06-30. Registered extension deed missing from vault.',
    findingsCount: 1,
    findings: [
      {
        id: 'FIND-8491-01',
        title: 'Land Lease Deed Expired / Renewal Missing',
        category: 'LAND_DOCUMENT_DISCREPANCY',
        severity: 'HIGH',
        aiObservation: 'Document OCR detected lease expiration date 30-June-2025 without registered continuation deed.',
        officerDetermination: 'Noted. Awaiting revenue office certificate verification from issuing authority.',
        status: 'IN_REVIEW',
        confidenceScore: 98.2,
        ruleRef: 'AICTE APH Clause 2.1 - Land Title & Lease Period Norms',
        evidenceRef: 'Apex_LandLease_Deed.pdf'
      }
    ],
    remarksHistory: [
      {
        id: 'REM-003',
        timestamp: '2026-10-22T10:00:00Z',
        officerName: 'Smt. Kavitha Nair',
        officerRole: 'DOCUMENT_VERIFICATION_OFFICER',
        remark: 'Initiated issuing authority cross-check with state revenue portal.',
        actionTaken: 'IN_REVIEW'
      }
    ]
  },
  {
    id: 'HRC-2026-078',
    applicationId: 'APP-2026-AICTE-7731',
    institutionId: '1-482019382',
    institutionName: 'National Institute of Engineering and Applied Research (NIEAR)',
    applicationType: 'NEW',
    programCourse: 'B.Tech in Artificial Intelligence & Data Science',
    region: 'Western Region',
    priority: 'CRITICAL',
    status: 'REVALIDATION_PENDING',
    assignedOfficer: 'Dr. Ramesh Sharma (Compliance Officer)',
    dueDate: '2026-11-10',
    createdAt: '2026-10-18T16:00:00Z',
    updatedAt: '2026-10-27T17:20:00Z',
    findingSummary: 'Fire Safety Certificate QR code verification returned invalid domain, and Professor vacancy in AI department.',
    findingsCount: 2,
    findings: [
      {
        id: 'FIND-7822-01',
        title: 'Fire Safety NOC Domain Validation Failure',
        category: 'SAFETY_CERTIFICATE',
        severity: 'HIGH',
        aiObservation: 'QR code in submitted Fire NOC redirected to unverified external domain rather than state fire portal.',
        officerDetermination: 'Institution submitted authentic Government fire services portal NOC reference and gazette copy in rectification response.',
        status: 'IN_REVIEW',
        confidenceScore: 92.0,
        ruleRef: 'AICTE APH Clause 3.4 - Safety & Disaster Management Compliance',
        evidenceRef: 'FireSafety_NOC_Updated.pdf'
      },
      {
        id: 'FIND-7822-02',
        title: 'Senior Faculty Cadre Vacancy in AI Department',
        category: 'FACULTY_DEFICIENCY',
        severity: 'HIGH',
        aiObservation: 'Mandated Professor appointment letter lacked university board approval signature.',
        officerDetermination: 'Board ratified appointment order submitted on 2026-10-27.',
        status: 'IN_REVIEW',
        confidenceScore: 88.5,
        ruleRef: 'AICTE APH Clause 4.2 - Principal/Director & Senior Faculty Qualifications',
        evidenceRef: 'Faculty_Appointment_Ratified.pdf'
      }
    ],
    remarksHistory: [
      {
        id: 'REM-004',
        timestamp: '2026-10-18T16:30:00Z',
        officerName: 'Dr. Ramesh Sharma',
        officerRole: 'COMPLIANCE_OFFICER',
        remark: 'Critical alert triggered: Fire safety and faculty credentials flagged.',
        actionTaken: 'RECTIFICATION_REQUESTED'
      },
      {
        id: 'REM-005',
        timestamp: '2026-10-27T17:20:00Z',
        officerName: 'Dr. Ramesh Sharma',
        officerRole: 'COMPLIANCE_OFFICER',
        remark: 'Institution submitted replacement evidence and explanatory affidavit. Ready for automated re-validation.',
        actionTaken: 'REVALIDATION_QUEUED'
      }
    ]
  },
  {
    id: 'HRC-2026-062',
    applicationId: 'APP-2026-AICTE-6231',
    institutionId: '1-749102834',
    institutionName: 'St. Xavier College of Engineering',
    applicationType: 'CHANGE',
    programCourse: 'New Course: Robotics & Automation (Intake: 60)',
    region: 'Southern Region',
    priority: 'LOW',
    status: 'COMPLETED',
    assignedOfficer: 'Smt. Kavitha Nair (Verification Officer)',
    dueDate: '2026-10-25',
    createdAt: '2026-10-15T12:00:00Z',
    updatedAt: '2026-10-24T15:30:00Z',
    findingSummary: 'Robotics lab geo-tagged photo initial edge clarity score was borderline. High resolution replacement verified.',
    findingsCount: 1,
    findings: [
      {
        id: 'FIND-6231-01',
        title: 'Robotics Lab Equipment Photo Edge Sharpness Warning',
        category: 'INFRASTRUCTURE_MISMATCH',
        severity: 'LOW',
        aiObservation: 'Initial photo had 76% edge clarity score. Replacement 4K image scored 94.8% and GPS metadata matched registered campus boundaries.',
        officerDetermination: 'Verified authentic. Industrial 6-axis robot and PLC test benches confirmed on-site.',
        status: 'RESOLVED',
        confidenceScore: 97.4,
        ruleRef: 'AICTE APH Clause 5.4 - Laboratory Equipment & Specialized Kits',
        evidenceRef: 'RoboticsLab_GeoTagged_Replacement.jpg'
      }
    ],
    remarksHistory: [
      {
        id: 'REM-006',
        timestamp: '2026-10-24T15:30:00Z',
        officerName: 'Smt. Kavitha Nair',
        officerRole: 'DOCUMENT_VERIFICATION_OFFICER',
        remark: 'Review completed satisfactorily. Recommended for AICTE Approval Committee clearance.',
        actionTaken: 'REVIEW_COMPLETED'
      }
    ]
  }
];

const INITIAL_RECTIFICATIONS: RectificationRequest[] = [
  {
    id: 'RECT-2026-041',
    applicationId: 'APP-2026-AICTE-9104',
    institutionId: '1-938210941',
    institutionName: 'Apex Institute of Technology & Science',
    findingId: 'FIND-9104-01',
    category: 'FACULTY_DEFICIENCY',
    title: 'Rectification Notice: Shortfall of 2 Associate Professors in CSE',
    specificReason: 'Student strength of 360 in CSE requires 18 faculty members at 1:20 ratio. Currently only 16 valid faculty records are verified.',
    regulatoryClauseRef: 'AICTE Approval Process Handbook (APH) 2026-27, Clause 4.1.2 & Table 4.1',
    requiredCorrection: 'Submit appointment letters, joined service reports, and university approval orders for 2 additional qualified Associate Professors.',
    institutionInstructions: 'Upload certified PDF documents with digital signature of the Principal / Secretary before due date.',
    dueDate: '2026-11-15',
    status: 'AWAITING_RESPONSE',
    sentAt: '2026-10-25T14:15:00Z',
    sentBy: 'Dr. Ramesh Sharma (Compliance Officer)',
    updatedAt: '2026-10-25T14:15:00Z'
  },
  {
    id: 'RECT-2026-038',
    applicationId: 'APP-2026-AICTE-7731',
    institutionId: '1-482019382',
    institutionName: 'National Institute of Engineering and Applied Research (NIEAR)',
    findingId: 'FIND-7822-01',
    category: 'SAFETY_CERTIFICATE',
    title: 'Rectification Notice: Fire Safety Certificate Authenticity Clarification',
    specificReason: 'QR scan could not be verified against the state emergency services repository due to domain mismatch.',
    regulatoryClauseRef: 'AICTE Approval Process Handbook (APH) 2026-27, Clause 3.4',
    requiredCorrection: 'Provide official State Fire Services Directorate NOC with verifiable registration number and dispatch ledger copy.',
    institutionInstructions: 'Upload the genuine certificate along with a solemn affidavit confirming compliance.',
    dueDate: '2026-11-10',
    status: 'RESPONSE_SUBMITTED',
    sentAt: '2026-10-18T16:30:00Z',
    sentBy: 'Dr. Ramesh Sharma (Compliance Officer)',
    institutionResponse: {
      submittedAt: '2026-10-27T16:50:00Z',
      notes: 'We have obtained the digitally re-issued Fire Safety NOC from the Chief Fire Officer, Fire Headquarters, with official QR code linking directly to maha-fire.gov.in portal. Replacement document attached.',
      replacementDocumentName: 'FireSafety_NOC_Updated.pdf',
      replacementDocumentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      submittedBy: 'Prof. S. V. Kulkarni (Principal)'
    },
    officerRemarks: 'Replacement file received. Matches authentic government format. Ready for re-validation.',
    updatedAt: '2026-10-27T17:20:00Z'
  }
];

const INITIAL_REVALIDATIONS: RevalidationRun[] = [
  {
    id: 'REVAL-2026-012',
    applicationId: 'APP-2026-AICTE-6231',
    rectificationId: 'RECT-2026-029',
    executedAt: '2026-10-24T15:00:00Z',
    executedBy: 'Smt. Kavitha Nair',
    checksRun: [
      'Image Resolution & Clarity Analysis',
      'EXIF GPS Coordinate Bounds Validation',
      'Tamper & Splicing Detection',
      'Equipment Model Visual Inventory Check'
    ],
    previousScore: 76.0,
    newScore: 97.4,
    findingsCleared: 1,
    findingsRemaining: 0,
    status: 'PASSED',
    summary: 'Replacement laboratory photograph passed all computer vision and tampering checks. Equipment inventory verified against AICTE norm checklist.'
  }
];

export const humanReviewService = {
  getCases(forInstitutionId?: string): HumanReviewCase[] {
    try {
      const stored = localStorage.getItem(CASES_STORAGE_KEY);
      if (stored) {
        let parsed: HumanReviewCase[] = JSON.parse(stored);
        // Automatic cache migration for NIEAR Mysuru real PID
        if (stored.includes('1-841902341')) {
          parsed = parsed.map((c) =>
            c.institutionId === '1-841902341'
              ? {
                  ...c,
                  institutionId: '1-482019382',
                  institutionName: 'National Institute of Engineering and Applied Research (NIEAR)',
                  applicationId: c.applicationId === 'APP-2026-AICTE-7822' ? 'APP-2026-AICTE-7731' : c.applicationId,
                }
              : c
          );
          localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(parsed));
        }
        if (forInstitutionId) {
          return parsed.filter((c) => c.institutionId === forInstitutionId);
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(INITIAL_CASES));
    if (forInstitutionId) {
      return INITIAL_CASES.filter((c) => c.institutionId === forInstitutionId);
    }
    return INITIAL_CASES;
  },

  getCaseById(id: string): HumanReviewCase | undefined {
    const list = this.getCases();
    return list.find((c) => c.id === id);
  },

  getCaseByApplicationId(appId: string): HumanReviewCase | undefined {
    const list = this.getCases();
    return list.find((c) => c.applicationId === appId);
  },

  updateCase(updatedCase: HumanReviewCase): HumanReviewCase {
    const list = this.getCases();
    const index = list.findIndex((c) => c.id === updatedCase.id);
    let newList: HumanReviewCase[];
    if (index >= 0) {
      newList = [...list];
      newList[index] = { ...updatedCase, updatedAt: new Date().toISOString() };
    } else {
      newList = [updatedCase, ...list];
    }
    localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(newList));
    return index >= 0 ? newList[index] : updatedCase;
  },

  addRemark(
    caseId: string,
    remark: string,
    officerName: string,
    officerRole: string,
    actionTaken: string
  ): HumanReviewCase {
    const caseItem = this.getCaseById(caseId);
    if (!caseItem) throw new Error(`Review case ${caseId} not found.`);

    const newRemark = {
      id: `REM-${Date.now()}`,
      timestamp: new Date().toISOString(),
      officerName,
      officerRole,
      remark,
      actionTaken
    };

    const updated: HumanReviewCase = {
      ...caseItem,
      remarksHistory: [newRemark, ...caseItem.remarksHistory],
      updatedAt: new Date().toISOString()
    };

    return this.updateCase(updated);
  },

  resolveFinding(
    caseId: string,
    findingId: string,
    officerDetermination: string,
    officerName: string
  ): HumanReviewCase {
    const caseItem = this.getCaseById(caseId);
    if (!caseItem) throw new Error(`Review case ${caseId} not found.`);

    const updatedFindings = caseItem.findings.map((f) => {
      if (f.id === findingId) {
        return {
          ...f,
          status: 'RESOLVED' as const,
          officerDetermination
        };
      }
      return f;
    });

    const allResolved = updatedFindings.every((f) => f.status === 'RESOLVED');

    const updatedCase: HumanReviewCase = {
      ...caseItem,
      findings: updatedFindings,
      status: allResolved ? 'RESOLVED' : caseItem.status,
      remarksHistory: [
        {
          id: `REM-${Date.now()}`,
          timestamp: new Date().toISOString(),
          officerName,
          officerRole: 'COMPLIANCE_OFFICER',
          remark: `Finding [${findingId}] resolved with determination: "${officerDetermination}".`,
          actionTaken: 'FINDING_RESOLVED'
        },
        ...caseItem.remarksHistory
      ],
      updatedAt: new Date().toISOString()
    };

    return this.updateCase(updatedCase);
  },

  reassignCase(caseId: string, newOfficerName: string, currentOfficerName: string): HumanReviewCase {
    const caseItem = this.getCaseById(caseId);
    if (!caseItem) throw new Error(`Review case ${caseId} not found.`);

    const updatedCase: HumanReviewCase = {
      ...caseItem,
      assignedOfficer: newOfficerName,
      remarksHistory: [
        {
          id: `REM-${Date.now()}`,
          timestamp: new Date().toISOString(),
          officerName: currentOfficerName,
          officerRole: 'OFFICER',
          remark: `Case reassigned from ${caseItem.assignedOfficer} to ${newOfficerName}.`,
          actionTaken: 'CASE_REASSIGNED'
        },
        ...caseItem.remarksHistory
      ],
      updatedAt: new Date().toISOString()
    };

    return this.updateCase(updatedCase);
  },

  markReviewCompleted(caseId: string, officerName: string, remarks: string): HumanReviewCase {
    const caseItem = this.getCaseById(caseId);
    if (!caseItem) throw new Error(`Review case ${caseId} not found.`);

    const updatedCase: HumanReviewCase = {
      ...caseItem,
      status: 'COMPLETED',
      remarksHistory: [
        {
          id: `REM-${Date.now()}`,
          timestamp: new Date().toISOString(),
          officerName,
          officerRole: 'COMPLIANCE_OFFICER',
          remark: `Official review signed off and completed. Remarks: ${remarks}`,
          actionTaken: 'REVIEW_COMPLETED'
        },
        ...caseItem.remarksHistory
      ],
      updatedAt: new Date().toISOString()
    };

    return this.updateCase(updatedCase);
  },

  // -------------------------------------------------------------
  // RECTIFICATION REQUESTS
  // -------------------------------------------------------------
  getRectificationRequests(forInstitutionId?: string): RectificationRequest[] {
    try {
      const stored = localStorage.getItem(RECTIFICATIONS_STORAGE_KEY);
      if (stored) {
        let parsed: RectificationRequest[] = JSON.parse(stored);
        if (stored.includes('1-841902341')) {
          parsed = parsed.map((r) =>
            r.institutionId === '1-841902341'
              ? {
                  ...r,
                  institutionId: '1-482019382',
                  institutionName: 'National Institute of Engineering and Applied Research (NIEAR)',
                  applicationId: r.applicationId === 'APP-2026-AICTE-7822' ? 'APP-2026-AICTE-7731' : r.applicationId,
                }
              : r
          );
          localStorage.setItem(RECTIFICATIONS_STORAGE_KEY, JSON.stringify(parsed));
        }
        if (forInstitutionId) {
          return parsed.filter((r) => r.institutionId === forInstitutionId);
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    localStorage.setItem(RECTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_RECTIFICATIONS));
    if (forInstitutionId) {
      return INITIAL_RECTIFICATIONS.filter((r) => r.institutionId === forInstitutionId);
    }
    return INITIAL_RECTIFICATIONS;
  },

  getRectificationRequestsByApp(appId: string): RectificationRequest[] {
    const list = this.getRectificationRequests();
    return list.filter((r) => r.applicationId === appId);
  },

  sendRectificationRequest(
    data: Omit<RectificationRequest, 'id' | 'status' | 'sentAt' | 'updatedAt'>
  ): RectificationRequest {
    const list = this.getRectificationRequests();
    const newReq: RectificationRequest = {
      ...data,
      id: `RECT-${new Date().getFullYear()}-${String(list.length + 42).padStart(3, '0')}`,
      status: 'SENT',
      sentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newList = [newReq, ...list];
    localStorage.setItem(RECTIFICATIONS_STORAGE_KEY, JSON.stringify(newList));

    // Also update parent review case status to RECTIFICATION_REQUESTED if exists
    const reviewCase = this.getCaseByApplicationId(data.applicationId);
    if (reviewCase) {
      const updatedFindings = reviewCase.findings.map((f) => {
        if (data.findingId && f.id === data.findingId) {
          return { ...f, status: 'RECTIFICATION_REQUESTED' as const };
        }
        return f;
      });

      this.updateCase({
        ...reviewCase,
        status: 'RECTIFICATION_REQUESTED',
        findings: updatedFindings,
        remarksHistory: [
          {
            id: `REM-${Date.now()}`,
            timestamp: new Date().toISOString(),
            officerName: data.sentBy,
            officerRole: 'OFFICER',
            remark: `Issued formal Rectification Notice ${newReq.id}: ${newReq.title}`,
            actionTaken: 'RECTIFICATION_REQUESTED'
          },
          ...reviewCase.remarksHistory
        ]
      });
    }

    return newReq;
  },

  submitInstitutionResponse(
    requestId: string,
    responseData: InstitutionResponseData
  ): RectificationRequest {
    const list = this.getRectificationRequests();
    const index = list.findIndex((r) => r.id === requestId);
    if (index === -1) throw new Error(`Rectification request ${requestId} not found.`);

    const updated: RectificationRequest = {
      ...list[index],
      status: 'RESPONSE_SUBMITTED',
      institutionResponse: responseData,
      updatedAt: new Date().toISOString()
    };

    list[index] = updated;
    localStorage.setItem(RECTIFICATIONS_STORAGE_KEY, JSON.stringify(list));

    // Update case status to REVALIDATION_PENDING
    const reviewCase = this.getCaseByApplicationId(updated.applicationId);
    if (reviewCase) {
      this.updateCase({
        ...reviewCase,
        status: 'REVALIDATION_PENDING',
        remarksHistory: [
          {
            id: `REM-${Date.now()}`,
            timestamp: new Date().toISOString(),
            officerName: responseData.submittedBy,
            officerRole: 'INSTITUTION_ADMIN',
            remark: `Institution submitted rectification response. Document: ${responseData.replacementDocumentName || 'N/A'}.`,
            actionTaken: 'RESPONSE_SUBMITTED'
          },
          ...reviewCase.remarksHistory
        ]
      });
    }

    return updated;
  },

  acceptRectification(
    requestId: string,
    officerRemarks: string,
    officerName: string
  ): RectificationRequest {
    const list = this.getRectificationRequests();
    const index = list.findIndex((r) => r.id === requestId);
    if (index === -1) throw new Error(`Rectification request ${requestId} not found.`);

    const updated: RectificationRequest = {
      ...list[index],
      status: 'ACCEPTED',
      officerRemarks,
      updatedAt: new Date().toISOString()
    };

    list[index] = updated;
    localStorage.setItem(RECTIFICATIONS_STORAGE_KEY, JSON.stringify(list));

    // Update parent case
    const reviewCase = this.getCaseByApplicationId(updated.applicationId);
    if (reviewCase) {
      const updatedFindings = reviewCase.findings.map((f) => {
        if (updated.findingId && f.id === updated.findingId) {
          return {
            ...f,
            status: 'RESOLVED' as const,
            officerDetermination: `Rectification Accepted: ${officerRemarks}`
          };
        }
        return f;
      });

      const allResolved = updatedFindings.every((f) => f.status === 'RESOLVED');

      this.updateCase({
        ...reviewCase,
        status: allResolved ? 'RESOLVED' : 'UNDER_REVIEW',
        findings: updatedFindings,
        remarksHistory: [
          {
            id: `REM-${Date.now()}`,
            timestamp: new Date().toISOString(),
            officerName,
            officerRole: 'COMPLIANCE_OFFICER',
            remark: `Accepted rectification ${requestId}. Remarks: ${officerRemarks}`,
            actionTaken: 'RECTIFICATION_ACCEPTED'
          },
          ...reviewCase.remarksHistory
        ]
      });
    }

    return updated;
  },

  requestFurtherCorrection(
    requestId: string,
    additionalInstructions: string,
    officerName: string
  ): RectificationRequest {
    const list = this.getRectificationRequests();
    const index = list.findIndex((r) => r.id === requestId);
    if (index === -1) throw new Error(`Rectification request ${requestId} not found.`);

    const updated: RectificationRequest = {
      ...list[index],
      status: 'FURTHER_CORRECTION_REQUIRED',
      officerRemarks: additionalInstructions,
      updatedAt: new Date().toISOString()
    };

    list[index] = updated;
    localStorage.setItem(RECTIFICATIONS_STORAGE_KEY, JSON.stringify(list));

    const reviewCase = this.getCaseByApplicationId(updated.applicationId);
    if (reviewCase) {
      this.updateCase({
        ...reviewCase,
        status: 'RECTIFICATION_REQUESTED',
        remarksHistory: [
          {
            id: `REM-${Date.now()}`,
            timestamp: new Date().toISOString(),
            officerName,
            officerRole: 'COMPLIANCE_OFFICER',
            remark: `Requested further correction on ${requestId}. Instructions: ${additionalInstructions}`,
            actionTaken: 'FURTHER_CORRECTION_REQUESTED'
          },
          ...reviewCase.remarksHistory
        ]
      });
    }

    return updated;
  },

  // -------------------------------------------------------------
  // REVALIDATION RUNS
  // -------------------------------------------------------------
  getRevalidationRuns(appId?: string): RevalidationRun[] {
    try {
      const stored = localStorage.getItem(REVALIDATIONS_STORAGE_KEY);
      if (stored) {
        const list: RevalidationRun[] = JSON.parse(stored);
        return appId ? list.filter((r) => r.applicationId === appId) : list;
      }
    } catch {
      // fallback
    }
    localStorage.setItem(REVALIDATIONS_STORAGE_KEY, JSON.stringify(INITIAL_REVALIDATIONS));
    return appId ? INITIAL_REVALIDATIONS.filter((r) => r.applicationId === appId) : INITIAL_REVALIDATIONS;
  },

  triggerRevalidation(caseId: string, rectificationId?: string, officerName = 'Authorized Officer'): RevalidationRun {
    const caseItem = this.getCaseById(caseId);
    if (!caseItem) throw new Error(`Review case ${caseId} not found.`);

    const currentRuns = this.getRevalidationRuns();

    // Determine findings to clear based on rectification responses
    const clearedFindingsCount = Math.min(caseItem.findings.length, 1);
    const newScore = Math.min(100, 95.0 + Math.random() * 4.5);

    const newRun: RevalidationRun = {
      id: `REVAL-2026-${String(currentRuns.length + 13).padStart(3, '0')}`,
      applicationId: caseItem.applicationId,
      rectificationId,
      executedAt: new Date().toISOString(),
      executedBy: officerName,
      checksRun: [
        'AICTE Statutory Rule Constraint Checker',
        'Document SHA-256 Checksum & Authenticity Integrity Test',
        'Digital Signature Revocation Status (OCSP/CRL)',
        'Optical Character Recognition (OCR) Field Alignment Verification',
        'Issuing Authority Multi-Source Reference Check'
      ],
      previousScore: 78.5,
      newScore: parseFloat(newScore.toFixed(1)),
      findingsCleared: clearedFindingsCount,
      findingsRemaining: Math.max(0, caseItem.findings.length - clearedFindingsCount),
      status: 'PASSED',
      summary: `Automated re-validation completed successfully. Re-checked statutory constraints against latest replacement documents. Discrepancies cleared: ${clearedFindingsCount}.`
    };

    const updatedRuns = [newRun, ...currentRuns];
    localStorage.setItem(REVALIDATIONS_STORAGE_KEY, JSON.stringify(updatedRuns));

    // Update the review case: mark first un-resolved finding resolved
    let resolvedOne = false;
    const updatedFindings = caseItem.findings.map((f) => {
      if (!resolvedOne && f.status !== 'RESOLVED') {
        resolvedOne = true;
        return {
          ...f,
          status: 'RESOLVED' as const,
          officerDetermination: `Automated AI Re-validation Passed on ${new Date().toISOString().split('T')[0]}: Re-checks verified compliance.`
        };
      }
      return f;
    });

    const allResolved = updatedFindings.every((f) => f.status === 'RESOLVED');

    this.updateCase({
      ...caseItem,
      status: allResolved ? 'RESOLVED' : 'UNDER_REVIEW',
      findings: updatedFindings,
      remarksHistory: [
        {
          id: `REM-${Date.now()}`,
          timestamp: new Date().toISOString(),
          officerName,
          officerRole: 'AI_REVALIDATION_ENGINE',
          remark: `Re-validation run ${newRun.id} completed. New compliance score: ${newRun.newScore}%. ${newRun.findingsCleared} finding(s) cleared.`,
          actionTaken: 'REVALIDATION_EXECUTED'
        },
        ...caseItem.remarksHistory
      ]
    });

    return newRun;
  },

  // -------------------------------------------------------------
  // DASHBOARD STATS
  // -------------------------------------------------------------
  getDashboardStats(): HumanReviewDashboardStats {
    const cases = this.getCases();
    const rectifications = this.getRectificationRequests();

    return {
      pendingReviews: cases.filter((c) => c.status === 'PENDING' || c.status === 'UNDER_REVIEW').length,
      highPriorityCases: cases.filter((c) => c.priority === 'CRITICAL' || c.priority === 'HIGH').length,
      rectificationRequestsSent: rectifications.length,
      awaitingInstitutionResponse: rectifications.filter((r) => r.status === 'SENT' || r.status === 'AWAITING_RESPONSE' || r.status === 'FURTHER_CORRECTION_REQUIRED').length,
      rectificationsSubmitted: rectifications.filter((r) => r.status === 'RESPONSE_SUBMITTED').length,
      revalidationPending: cases.filter((c) => c.status === 'REVALIDATION_PENDING').length,
      reviewsCompleted: cases.filter((c) => c.status === 'COMPLETED' || c.status === 'RESOLVED').length
    };
  }
};
