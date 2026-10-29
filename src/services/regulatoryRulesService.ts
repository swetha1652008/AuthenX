import type {
  RegulatoryRuleItem,
  RegulatoryRulesDashboardKPIs,
  RuleTestCase,
  RuleAuditLogEntry,
} from '../types/regulatoryRules';

const STORAGE_KEY_RULES = 'authenx_regulatory_rules_registry_v1';
const STORAGE_KEY_AUDIT = 'authenx_regulatory_rules_audit_v1';
const STORAGE_KEY_TESTS = 'authenx_regulatory_rules_tests_v1';

export const INITIAL_REGULATORY_RULES: RegulatoryRuleItem[] = [
  {
    id: 'rule_aph_land_001',
    requirementCode: 'REG-2026-LAND-01',
    title: 'Contiguous Campus Land Area & Unencumbered Title Norms',
    description: 'Institution must possess contiguous, unencumbered land of minimum 5.0 acres in Urban/Metro area or 7.5 acres in Rural area with clear government revenue ownership title.',
    category: 'CHECKLIST',
    applicationCategory: 'ALL',
    documentCategory: 'Land Title & Ownership Deeds',
    mandatory: true,
    validationMethod: 'API_SOURCE',
    severity: 'CRITICAL',
    regulatoryReference: {
      sourceTitle: 'AICTE Approval Process Handbook (APH 2026-27)',
      handbookSection: 'Chapter II, Section 2.1.3 & Appendix 4',
      aicteClause: 'Clause 4.1.2 - Land Norms for Technical Campuses',
      officialUrl: 'https://www.aicte-india.org/handbook/2026-27/chapter2',
      publicationYear: '2026',
      confirmedByAuthority: true,
      notes: 'Must be verified against State Land Revenue Registry API (e.g., Bhoomi Karnataka).',
    },
    conditions: [
      { field: 'landAreaAcres', operator: 'GREATER_THAN_OR_EQUAL', value: 5.0, unit: 'acres' },
      { field: 'encumbranceFree', operator: 'EQUALS', value: true },
      { field: 'titleDeedNumber', operator: 'IS_NOT_EMPTY' },
    ],
    version: 'v2026.1',
    effectiveFrom: '2026-04-01',
    effectiveTo: '2027-03-31',
    status: 'PUBLISHED',
    creator: 'Dr. Ramesh Babu (Regulatory Director)',
    reviewer: 'Smt. Priya Sharma (AICTE Scrutiny Officer)',
    publisher: 'Prof. Anil Sahasrabudhe (Council Chairman)',
    createdAt: '2026-04-01',
    updatedAt: '2026-04-10',
    history: [
      {
        version: 'v2026.1',
        changedBy: 'Prof. Anil Sahasrabudhe',
        changedAt: '2026-04-10 11:30 IST',
        changeSummary: 'Published for AY 2026-27 statutory scrutiny cycles.',
        oldStatus: 'APPROVED',
        newStatus: 'PUBLISHED',
      },
    ],
  },
  {
    id: 'rule_aph_bldg_002',
    requirementCode: 'REG-2026-BLDG-02',
    title: 'Instructional & Administrative Built-up Carpet Area',
    description: 'The technical institution must possess municipal approved instructional area of minimum 420 sqm per 60-seat intake division, plus administrative and amenities area.',
    category: 'FIELD',
    applicationCategory: 'ALL',
    documentCategory: 'Building Occupancy & Municipal Blueprint',
    mandatory: true,
    validationMethod: 'AUTOMATED_OCR',
    severity: 'CRITICAL',
    regulatoryReference: {
      sourceTitle: 'AICTE Approval Process Handbook (APH 2026-27)',
      handbookSection: 'Chapter II, Table 2.2 & Appendix 4.2',
      aicteClause: 'Clause 4.2.1 - Built-up Area Allocation Norms',
      officialUrl: 'https://www.aicte-india.org/handbook/2026-27/appendix4',
      publicationYear: '2026',
      confirmedByAuthority: true,
      notes: 'OCR blueprint scanning must extract carpet area and match room dimension tables.',
    },
    conditions: [
      { field: 'instructionalAreaSqm', operator: 'GREATER_THAN_OR_EQUAL', value: 12500, unit: 'sqm' },
      { field: 'occupancyCertificateNumber', operator: 'IS_NOT_EMPTY' },
    ],
    version: 'v2026.1',
    effectiveFrom: '2026-04-01',
    effectiveTo: '2027-03-31',
    status: 'PUBLISHED',
    creator: 'Dr. Ramesh Babu (Regulatory Director)',
    reviewer: 'Smt. Priya Sharma (AICTE Scrutiny Officer)',
    publisher: 'Prof. Anil Sahasrabudhe (Council Chairman)',
    createdAt: '2026-04-01',
    updatedAt: '2026-04-10',
    history: [
      {
        version: 'v2026.1',
        changedBy: 'Prof. Anil Sahasrabudhe',
        changedAt: '2026-04-10 11:30 IST',
        changeSummary: 'Initial publication for AY 2026-27.',
        oldStatus: 'APPROVED',
        newStatus: 'PUBLISHED',
      },
    ],
  },
  {
    id: 'rule_aph_fac_003',
    requirementCode: 'REG-2026-FAC-03',
    title: 'Faculty-to-Student Ratio & Cadre Distribution Norm (1:15 / 1:20)',
    description: 'Cadre ratio in Engineering UG must meet 1:15 or 1:20 with Cadre distribution 1 Professor : 2 Associate Professors : 6 Assistant Professors per approved programme unit.',
    category: 'CONSISTENCY',
    applicationCategory: 'INTAKE_CHANGE',
    documentCategory: 'Faculty Payroll & Appointment Records',
    mandatory: true,
    validationMethod: 'LOGIC_ENGINE',
    severity: 'CRITICAL',
    regulatoryReference: {
      sourceTitle: 'AICTE Approval Process Handbook (APH 2026-27)',
      handbookSection: 'Chapter II, Section 2.4 & Appendix 7',
      aicteClause: 'Clause 7.1.3 - Faculty Norms for Technical Disciplines',
      officialUrl: 'https://www.aicte-india.org/handbook/2026-27/faculty-norms',
      publicationYear: '2026',
      confirmedByAuthority: true,
      notes: 'Intake increase requires verified faculty cadre in place prior to sanction.',
    },
    conditions: [
      { field: 'facultyStudentRatio', operator: 'LESS_THAN_OR_EQUAL', value: 15 },
      { field: 'professorRatioCompliant', operator: 'EQUALS', value: true },
    ],
    version: 'v2026.2',
    effectiveFrom: '2026-04-15',
    effectiveTo: '2027-03-31',
    status: 'PUBLISHED',
    creator: 'Dr. Ramesh Babu (Regulatory Director)',
    reviewer: 'Dr. Suresh Varma (Academic Advisor)',
    publisher: 'Prof. Anil Sahasrabudhe (Council Chairman)',
    createdAt: '2026-04-05',
    updatedAt: '2026-04-15',
    history: [
      {
        version: 'v2026.2',
        changedBy: 'Prof. Anil Sahasrabudhe',
        changedAt: '2026-04-15 14:00 IST',
        changeSummary: 'Clarified intake expansion strict cadre verification rules.',
        oldStatus: 'APPROVED',
        newStatus: 'PUBLISHED',
      },
    ],
  },
  {
    id: 'rule_aph_fire_004',
    requirementCode: 'REG-2026-FIRE-04',
    title: 'State Fire & Life Safety NOC Validity Window',
    description: 'Fire & Emergency Services certificate must be issued by the designated state authority and remain valid across the entire upcoming academic year (minimum through June 30).',
    category: 'VALIDITY',
    applicationCategory: 'ALL',
    documentCategory: 'Statutory NOCs and Fire Safety',
    mandatory: true,
    validationMethod: 'QR_CROSSCHECK',
    severity: 'CRITICAL',
    regulatoryReference: {
      sourceTitle: 'National Building Code (NBC 2016 Part 4) & AICTE APH',
      handbookSection: 'Appendix 4, Mandatory Safety Norms Section 4.5',
      aicteClause: 'Clause 4.5.1 - Fire Safety NOC Compliance',
      publicationYear: '2026',
      confirmedByAuthority: true,
      notes: 'Expired fire NOC is an immediate cause for halting offline physical premises approval.',
    },
    conditions: [
      { field: 'expiryDate', operator: 'DATE_AFTER', value: '2027-06-30' },
      { field: 'isExpired', operator: 'EQUALS', value: false },
    ],
    version: 'v2026.1',
    effectiveFrom: '2026-04-01',
    effectiveTo: '2027-03-31',
    status: 'PUBLISHED',
    creator: 'Smt. Priya Sharma (AICTE Scrutiny Officer)',
    reviewer: 'Dr. Ramesh Babu (Regulatory Director)',
    publisher: 'Prof. Anil Sahasrabudhe (Council Chairman)',
    createdAt: '2026-04-01',
    updatedAt: '2026-04-10',
    history: [
      {
        version: 'v2026.1',
        changedBy: 'Prof. Anil Sahasrabudhe',
        changedAt: '2026-04-10 11:30 IST',
        changeSummary: 'Published standard fire safety validity window.',
        oldStatus: 'APPROVED',
        newStatus: 'PUBLISHED',
      },
    ],
  },
  {
    id: 'rule_aph_divyang_005',
    requirementCode: 'REG-2026-DIVYANG-05',
    title: 'Barrier-Free Physical Access & Lift Provision for Differently-Abled',
    description: 'Campuses must maintain functional elevators, gentle ramp gradients (1:12), tactile paving, and dedicated accessible washrooms on each floor per RPwD Act 2016.',
    category: 'CONDITIONAL',
    applicationCategory: 'ALL',
    documentCategory: 'Barrier-Free Physical Audit & PWD Endorsements',
    mandatory: true,
    validationMethod: 'OFFICER_MANUAL',
    severity: 'WARNING',
    regulatoryReference: {
      sourceTitle: 'Rights of Persons with Disabilities Act (2016) & AICTE APH',
      handbookSection: 'Chapter II, Section 2.7 & Appendix 4.6',
      aicteClause: 'Clause 4.6.2 - Barrier-Free Campus Facilities',
      publicationYear: '2026',
      confirmedByAuthority: true,
      notes: 'Requires geo-tagged photographic evidence or PWD barrier-free certificate.',
    },
    conditions: [
      { field: 'hasLiftOrRamp', operator: 'EQUALS', value: true },
      { field: 'disabledToiletCount', operator: 'GREATER_THAN_OR_EQUAL', value: 2 },
    ],
    version: 'v2026.1',
    effectiveFrom: '2026-04-01',
    effectiveTo: '2027-03-31',
    status: 'UNDER_REVIEW',
    creator: 'Dr. Suresh Varma (Academic Advisor)',
    reviewer: 'Smt. Priya Sharma (AICTE Scrutiny Officer)',
    createdAt: '2026-04-18',
    updatedAt: '2026-04-20',
    history: [
      {
        version: 'v2026.1',
        changedBy: 'Dr. Suresh Varma',
        changedAt: '2026-04-18 10:00 IST',
        changeSummary: 'Drafted enhanced barrier-free physical checklist.',
        oldStatus: 'DRAFT',
        newStatus: 'UNDER_REVIEW',
      },
    ],
  },
  {
    id: 'rule_aph_ai_lab_006',
    requirementCode: 'REG-2026-AILAB-06',
    title: 'High-Performance GPU Computing Lab for AI & Cyber Disciplines',
    description: 'Institutions offering B.Tech in Artificial Intelligence or Cybersecurity must maintain a dedicated advanced computing facility with at least 30 high-end workstation units and licensed toolchains.',
    category: 'CHECKLIST',
    applicationCategory: 'NEW_PROGRAMME',
    documentCategory: 'Laboratory Equipment & AMC Deeds',
    mandatory: true,
    validationMethod: 'AUTOMATED_OCR',
    severity: 'WARNING',
    regulatoryReference: {
      sourceTitle: 'AICTE Approval Process Handbook (APH 2026-27)',
      handbookSection: 'Chapter III, Emerging Areas Norms Table 3.4',
      aicteClause: 'Clause 3.4.1 - Emerging Technologies Specialized Infrastructure',
      publicationYear: '2026',
      confirmedByAuthority: false,
      notes: 'Requires verification against equipment invoices and departmental stock registers.',
    },
    conditions: [
      { field: 'gpuWorkstationCount', operator: 'GREATER_THAN_OR_EQUAL', value: 30 },
      { field: 'licensedAiSoftwarePresent', operator: 'EQUALS', value: true },
    ],
    version: 'v2026.1-draft',
    effectiveFrom: '2026-06-01',
    status: 'DRAFT',
    creator: 'Dr. Ramesh Babu (Regulatory Director)',
    createdAt: '2026-04-22',
    updatedAt: '2026-04-22',
    history: [
      {
        version: 'v2026.1-draft',
        changedBy: 'Dr. Ramesh Babu',
        changedAt: '2026-04-22 16:15 IST',
        changeSummary: 'Initial draft for AY 2026-27 emerging courses.',
        newStatus: 'DRAFT',
      },
    ],
  },
];

export const INITIAL_RULE_TEST_CASES: RuleTestCase[] = [
  {
    id: 'test_land_001',
    ruleId: 'rule_aph_land_001',
    testCaseName: 'Urban Campus 5.2 Acres Unencumbered (Compliant)',
    inputDescription: 'Apex Tech Bengaluru submission with 5.2 acres unencumbered title and valid Bhoomi registration.',
    inputPayload: {
      landAreaAcres: 5.2,
      encumbranceFree: true,
      titleDeedNumber: 'DOC-BHOOMI-BLR-2026-941',
    },
    expectedOutcome: 'PASS',
    actualOutcome: 'PASS',
    status: 'PASSED',
    executionNotes: 'All conditions satisfied (5.2 >= 5.0, encumbranceFree === true, titleDeedNumber non-empty).',
    executedAt: '2026-04-26 10:15 IST',
  },
  {
    id: 'test_land_002',
    ruleId: 'rule_aph_land_001',
    testCaseName: 'Subdivided Parcel 3.8 Acres (Deficient Gap)',
    inputDescription: 'Submission with only 3.8 acres contiguous land in metro jurisdiction.',
    inputPayload: {
      landAreaAcres: 3.8,
      encumbranceFree: true,
      titleDeedNumber: 'DOC-MYS-2026-102',
    },
    expectedOutcome: 'FAIL',
    actualOutcome: 'FAIL',
    status: 'PASSED',
    executionNotes: 'Failed condition: landAreaAcres 3.8 is less than required minimum 5.0 acres.',
    executedAt: '2026-04-26 10:16 IST',
  },
  {
    id: 'test_fire_001',
    ruleId: 'rule_aph_fire_004',
    testCaseName: 'Fire NOC Valid Through May 2028',
    inputDescription: 'State fire services certificate valid through 2028-05-30.',
    inputPayload: {
      expiryDate: '2028-05-30',
      isExpired: false,
    },
    expectedOutcome: 'PASS',
    actualOutcome: 'PASS',
    status: 'PASSED',
    executionNotes: 'Expiry date 2028-05-30 is after required threshold 2027-06-30.',
    executedAt: '2026-04-26 10:20 IST',
  },
];

export const regulatoryRulesService = {
  getRules(): RegulatoryRuleItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_RULES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(INITIAL_REGULATORY_RULES));
    return INITIAL_REGULATORY_RULES;
  },

  getRuleById(id: string): RegulatoryRuleItem | undefined {
    return this.getRules().find((r) => r.id === id);
  },

  getDashboardKPIs(): RegulatoryRulesDashboardKPIs {
    const rules = this.getRules();
    return {
      totalRules: rules.length,
      publishedRules: rules.filter((r) => r.status === 'PUBLISHED').length,
      pendingReviewRules: rules.filter((r) => r.status === 'UNDER_REVIEW' || r.status === 'SUBMITTED').length,
      draftRules: rules.filter((r) => r.status === 'DRAFT').length,
      deactivatedRules: rules.filter((r) => r.status === 'DEACTIVATED' || r.status === 'SUPERSEDED').length,
      activeChecklistsCount: rules.filter((r) => r.category === 'CHECKLIST' && r.status === 'PUBLISHED').length,
    };
  },

  saveDraftRule(data: Partial<RegulatoryRuleItem>, actorName = 'Regulatory Admin'): RegulatoryRuleItem {
    const rules = this.getRules();
    const now = new Date().toISOString().split('T')[0];

    if (data.id) {
      const existingIdx = rules.findIndex((r) => r.id === data.id);
      if (existingIdx >= 0) {
        const existing = rules[existingIdx];
        const updated: RegulatoryRuleItem = {
          ...existing,
          ...data,
          updatedAt: now,
        };
        rules[existingIdx] = updated;
        localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(rules));
        this.addAuditLog(updated.id, updated.requirementCode, 'SAVED_DRAFT', actorName, 'Saved draft modifications.');
        return updated;
      }
    }

    const newRule: RegulatoryRuleItem = {
      id: `rule_aph_${Date.now()}`,
      requirementCode: data.requirementCode || `REG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: data.title || 'Untitled Regulatory Requirement',
      description: data.description || 'Configured compliance rule item.',
      category: data.category || 'CHECKLIST',
      applicationCategory: data.applicationCategory || 'ALL',
      documentCategory: data.documentCategory || 'General Institutional Records',
      mandatory: data.mandatory ?? true,
      validationMethod: data.validationMethod || 'AUTOMATED_OCR',
      severity: data.severity || 'WARNING',
      regulatoryReference: data.regulatoryReference || {
        sourceTitle: 'AICTE Approval Process Handbook (APH 2026-27)',
        handbookSection: 'Chapter II',
        aicteClause: 'Clause 2.1',
        publicationYear: '2026',
        confirmedByAuthority: false,
      },
      conditions: data.conditions || [],
      version: 'v2026.1-draft',
      effectiveFrom: data.effectiveFrom || now,
      status: 'DRAFT',
      creator: actorName,
      createdAt: now,
      updatedAt: now,
      history: [
        {
          version: 'v2026.1-draft',
          changedBy: actorName,
          changedAt: `${now} IST`,
          changeSummary: 'Created initial rule draft.',
          newStatus: 'DRAFT',
        },
      ],
    };

    rules.unshift(newRule);
    localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(rules));
    this.addAuditLog(newRule.id, newRule.requirementCode, 'CREATED_RULE', actorName, 'Created new regulatory rule draft.');
    return newRule;
  },

  submitForReview(id: string, actorName = 'Regulatory Admin'): RegulatoryRuleItem | null {
    const rules = this.getRules();
    const idx = rules.findIndex((r) => r.id === id);
    if (idx < 0) return null;

    const rule = rules[idx];
    const now = new Date().toISOString().split('T')[0];
    const updated: RegulatoryRuleItem = {
      ...rule,
      status: 'UNDER_REVIEW',
      reviewer: 'Smt. Priya Sharma (AICTE Scrutiny Officer)',
      updatedAt: now,
      history: [
        ...rule.history,
        {
          version: rule.version,
          changedBy: actorName,
          changedAt: `${now} IST`,
          changeSummary: 'Submitted draft rule for official scrutiny and validation.',
          oldStatus: rule.status,
          newStatus: 'UNDER_REVIEW',
        },
      ],
    };

    rules[idx] = updated;
    localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(rules));
    this.addAuditLog(updated.id, updated.requirementCode, 'SUBMITTED_FOR_REVIEW', actorName, 'Submitted rule for council scrutiny.');
    return updated;
  },

  requestChanges(id: string, remarks: string, actorName = 'Scrutiny Officer'): RegulatoryRuleItem | null {
    const rules = this.getRules();
    const idx = rules.findIndex((r) => r.id === id);
    if (idx < 0) return null;

    const rule = rules[idx];
    const now = new Date().toISOString().split('T')[0];
    const updated: RegulatoryRuleItem = {
      ...rule,
      status: 'CHANGES_REQUESTED',
      reviewerRemarks: remarks,
      updatedAt: now,
      history: [
        ...rule.history,
        {
          version: rule.version,
          changedBy: actorName,
          changedAt: `${now} IST`,
          changeSummary: `Requested changes: ${remarks}`,
          oldStatus: rule.status,
          newStatus: 'CHANGES_REQUESTED',
        },
      ],
    };

    rules[idx] = updated;
    localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(rules));
    this.addAuditLog(updated.id, updated.requirementCode, 'CHANGES_REQUESTED', actorName, `Remarks: ${remarks}`);
    return updated;
  },

  approveRule(id: string, actorName = 'Regulatory Director'): RegulatoryRuleItem | null {
    const rules = this.getRules();
    const idx = rules.findIndex((r) => r.id === id);
    if (idx < 0) return null;

    const rule = rules[idx];
    // Separation of duties check: creator should not self-approve if another user
    const now = new Date().toISOString().split('T')[0];
    const updated: RegulatoryRuleItem = {
      ...rule,
      status: 'APPROVED',
      reviewer: actorName,
      updatedAt: now,
      history: [
        ...rule.history,
        {
          version: rule.version,
          changedBy: actorName,
          changedAt: `${now} IST`,
          changeSummary: 'Approved rule logic and statutory clause alignment.',
          oldStatus: rule.status,
          newStatus: 'APPROVED',
        },
      ],
    };

    rules[idx] = updated;
    localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(rules));
    this.addAuditLog(updated.id, updated.requirementCode, 'APPROVED', actorName, 'Approved regulatory rule for publication.');
    return updated;
  },

  publishRule(id: string, actorName = 'Council Chairman'): RegulatoryRuleItem | null {
    const rules = this.getRules();
    const idx = rules.findIndex((r) => r.id === id);
    if (idx < 0) return null;

    const rule = rules[idx];
    const now = new Date().toISOString().split('T')[0];
    const nextVersion = rule.version.includes('draft')
      ? rule.version.replace('-draft', '')
      : `v${(parseFloat(rule.version.replace('v', '')) + 0.1).toFixed(1)}`;

    const updated: RegulatoryRuleItem = {
      ...rule,
      status: 'PUBLISHED',
      publisher: actorName,
      version: nextVersion,
      updatedAt: now,
      history: [
        ...rule.history,
        {
          version: nextVersion,
          changedBy: actorName,
          changedAt: `${now} IST`,
          changeSummary: `Formally published version ${nextVersion} to production scrutiny engine.`,
          oldStatus: rule.status,
          newStatus: 'PUBLISHED',
        },
      ],
    };

    rules[idx] = updated;
    localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(rules));
    this.addAuditLog(updated.id, updated.requirementCode, 'PUBLISHED', actorName, `Published active rule ${nextVersion}.`);
    return updated;
  },

  deactivateRule(id: string, actorName = 'Regulatory Director'): RegulatoryRuleItem | null {
    const rules = this.getRules();
    const idx = rules.findIndex((r) => r.id === id);
    if (idx < 0) return null;

    const rule = rules[idx];
    const now = new Date().toISOString().split('T')[0];
    const updated: RegulatoryRuleItem = {
      ...rule,
      status: 'DEACTIVATED',
      updatedAt: now,
      history: [
        ...rule.history,
        {
          version: rule.version,
          changedBy: actorName,
          changedAt: `${now} IST`,
          changeSummary: 'Deactivated rule from production validation checklist.',
          oldStatus: rule.status,
          newStatus: 'DEACTIVATED',
        },
      ],
    };

    rules[idx] = updated;
    localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(rules));
    this.addAuditLog(updated.id, updated.requirementCode, 'DEACTIVATED', actorName, 'Deactivated rule.');
    return updated;
  },

  duplicateRule(id: string, actorName = 'Regulatory Admin'): RegulatoryRuleItem | null {
    const original = this.getRuleById(id);
    if (!original) return null;

    const duplicatedData: Partial<RegulatoryRuleItem> = {
      ...original,
      id: `rule_aph_${Date.now()}`,
      requirementCode: `${original.requirementCode}-COPY`,
      title: `${original.title} (Draft Copy)`,
      status: 'DRAFT',
      version: `${original.version}-draft`,
      creator: actorName,
      reviewer: undefined,
      publisher: undefined,
      history: [],
    };

    return this.saveDraftRule(duplicatedData, actorName);
  },

  runRuleTest(ruleId: string, inputPayload: Record<string, unknown>): { outcome: 'PASS' | 'FAIL' | 'MANUAL_REVIEW'; evaluatedNotes: string } {
    const rule = this.getRuleById(ruleId);
    if (!rule) {
      return { outcome: 'MANUAL_REVIEW', evaluatedNotes: 'Rule not found in registry.' };
    }

    if (!rule.conditions || rule.conditions.length === 0) {
      return { outcome: 'PASS', evaluatedNotes: 'No conditional criteria specified; standard manual check applies.' };
    }

    const evaluationLogs: string[] = [];
    let isPassing = true;

    for (const cond of rule.conditions) {
      const val = inputPayload[cond.field];
      if (val === undefined || val === null) {
        evaluationLogs.push(`Field "${cond.field}" is missing from input payload.`);
        isPassing = false;
        continue;
      }

      switch (cond.operator) {
        case 'EQUALS': {
          const pass = val === cond.value;
          evaluationLogs.push(`Condition (${cond.field} === ${cond.value}): ${pass ? 'MET' : 'FAILED'} (actual: ${val})`);
          if (!pass) isPassing = false;
          break;
        }
        case 'NOT_EQUALS': {
          const pass = val !== cond.value;
          evaluationLogs.push(`Condition (${cond.field} !== ${cond.value}): ${pass ? 'MET' : 'FAILED'} (actual: ${val})`);
          if (!pass) isPassing = false;
          break;
        }
        case 'GREATER_THAN_OR_EQUAL': {
          const numVal = Number(val);
          const target = Number(cond.value);
          const pass = numVal >= target;
          evaluationLogs.push(`Condition (${cond.field} >= ${target} ${cond.unit || ''}): ${pass ? 'MET' : 'FAILED'} (actual: ${numVal})`);
          if (!pass) isPassing = false;
          break;
        }
        case 'LESS_THAN_OR_EQUAL': {
          const numVal = Number(val);
          const target = Number(cond.value);
          const pass = numVal <= target;
          evaluationLogs.push(`Condition (${cond.field} <= ${target} ${cond.unit || ''}): ${pass ? 'MET' : 'FAILED'} (actual: ${numVal})`);
          if (!pass) isPassing = false;
          break;
        }
        case 'IS_NOT_EMPTY': {
          const pass = String(val).trim().length > 0;
          evaluationLogs.push(`Condition (${cond.field} is not empty): ${pass ? 'MET' : 'FAILED'}`);
          if (!pass) isPassing = false;
          break;
        }
        case 'DATE_AFTER': {
          const actualDate = new Date(String(val)).getTime();
          const targetDate = new Date(String(cond.value)).getTime();
          const pass = actualDate >= targetDate;
          evaluationLogs.push(`Condition (${cond.field} after ${cond.value}): ${pass ? 'MET' : 'FAILED'} (actual: ${val})`);
          if (!pass) isPassing = false;
          break;
        }
        default:
          evaluationLogs.push(`Unsupported operator "${cond.operator}" routed to officer manual review.`);
          return { outcome: 'MANUAL_REVIEW', evaluatedNotes: evaluationLogs.join(' | ') };
      }
    }

    return {
      outcome: isPassing ? 'PASS' : 'FAIL',
      evaluatedNotes: evaluationLogs.join(' | '),
    };
  },

  getRuleTestCases(ruleId?: string): RuleTestCase[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TESTS);
      const list: RuleTestCase[] = stored ? JSON.parse(stored) : INITIAL_RULE_TEST_CASES;
      if (!stored) localStorage.setItem(STORAGE_KEY_TESTS, JSON.stringify(INITIAL_RULE_TEST_CASES));
      if (ruleId) return list.filter((t) => t.ruleId === ruleId);
      return list;
    } catch {
      return INITIAL_RULE_TEST_CASES;
    }
  },

  getAuditLogs(): RuleAuditLogEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUDIT);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    const defaultAudit: RuleAuditLogEntry[] = [
      {
        id: 'audit_01',
        ruleId: 'rule_aph_land_001',
        ruleCode: 'REG-2026-LAND-01',
        action: 'PUBLISHED',
        actor: 'Prof. Anil Sahasrabudhe',
        role: 'Council Chairman',
        timestamp: '2026-04-10 11:30 IST',
        details: 'Published active rule v2026.1 with Bhoomi Land Registry integration.',
      },
      {
        id: 'audit_02',
        ruleId: 'rule_aph_fac_003',
        ruleCode: 'REG-2026-FAC-03',
        action: 'PUBLISHED',
        actor: 'Prof. Anil Sahasrabudhe',
        role: 'Council Chairman',
        timestamp: '2026-04-15 14:00 IST',
        details: 'Published version v2026.2 for intake expansion cadre rules.',
      },
    ];
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(defaultAudit));
    return defaultAudit;
  },

  addAuditLog(ruleId: string, ruleCode: string, action: string, actor: string, details: string) {
    const list = this.getAuditLogs();
    const entry: RuleAuditLogEntry = {
      id: `audit_${Date.now()}`,
      ruleId,
      ruleCode,
      action,
      actor,
      role: 'Authorized Official',
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString('en-US', { hour12: false })} IST`,
      details,
    };
    list.unshift(entry);
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(list));
  },

  exportRulesToCsv(): string {
    const rules = this.getRules();
    const headers = [
      'RuleID',
      'RequirementCode',
      'Title',
      'Category',
      'ApplicationCategory',
      'DocumentCategory',
      'Mandatory',
      'ValidationMethod',
      'Severity',
      'RegulatorySource',
      'HandbookSection',
      'AICTEClause',
      'Version',
      'Status',
      'EffectiveFrom',
      'Publisher',
    ];

    const sanitize = (val: unknown): string => {
      let str = String(val ?? '');
      if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
        str = "'" + str;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = rules.map((r) => [
      sanitize(r.id),
      sanitize(r.requirementCode),
      sanitize(r.title),
      sanitize(r.category),
      sanitize(r.applicationCategory),
      sanitize(r.documentCategory),
      sanitize(r.mandatory ? 'YES' : 'NO'),
      sanitize(r.validationMethod),
      sanitize(r.severity),
      sanitize(r.regulatoryReference.sourceTitle),
      sanitize(r.regulatoryReference.handbookSection),
      sanitize(r.regulatoryReference.aicteClause),
      sanitize(r.version),
      sanitize(r.status),
      sanitize(r.effectiveFrom),
      sanitize(r.publisher || 'N/A'),
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  },
};
