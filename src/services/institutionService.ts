import type { 
  InstitutionApplication, 
  ApplicationType, 
  ChangeCategory, 
  ValidationFinding,
  InstitutionDetails,
  DocumentItem
} from '../types/institution';
import { 
  ALL_SEEDED_APPLICATIONS, 
  INITIAL_INSTITUTION_DETAILS, 
  INITIAL_COURSES, 
  NIEAR_COURSES,
  INSTITUTIONS_DIRECTORY,
  NIEAR_APPLICATIONS
} from '../data/mockInstitutionData';
import { authService } from './authService';

const STORAGE_KEY = 'authenx_institution_applications';

export const institutionService = {
  /**
   * Internal helper to load all stored applications across all institutions
   */
  _getAllStoredApplications(): InstitutionApplication[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Dynamic document synchronization: check if any application has real documents with critical anomalies
          parsed.forEach((app: InstitutionApplication) => {
            try {
              const storageKey = `authenx_managed_docs_${app.id}`;
              const rawStored = typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null;
              if (rawStored) {
                const managedDocs = JSON.parse(rawStored);
                if (Array.isArray(managedDocs) && managedDocs.length > 0) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const hasCrit = managedDocs.some((d: any) => 
                    d.verificationStatus === 'Needs Manual Review' || 
                    d.verificationStatus === 'Processing Failed' ||
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (Array.isArray(d.anomalies) && d.anomalies.some((a: any) => a.severity === 'CRITICAL'))
                  );
                  if (hasCrit) {
                    app.validationStatus = 'Mismatch Detected';
                    if (app.status === 'Submitted') {
                      app.status = 'Rectification Required';
                    }
                  }
                }
              }
            } catch {
              // safe ignore
            }
          });

          // Ensure NIEAR applications exist in storage if old cache is present
          const hasNiear = parsed.some((a: InstitutionApplication) => a.institutionId === '1-482019382');
          if (!hasNiear) {
            const merged = [...parsed, ...NIEAR_APPLICATIONS];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            return merged;
          }
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    // Initialize default mock data with both institutions
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ALL_SEEDED_APPLICATIONS));
    } catch {
      // safe fallback if storage unavailable
    }
    return ALL_SEEDED_APPLICATIONS;
  },

  /**
   * Returns applications. If the authenticated session is an INSTITUTION_ADMIN,
   * it STRICTLY returns only applications belonging to that institution's session ID.
   */
  getApplications(forceInstitutionId?: string): InstitutionApplication[] {
    const all = this._getAllStoredApplications();
    const currentUser = authService.getCurrentUser();

    // Security Rule: If authenticated as Institution Admin, enforce session institution isolation
    if (currentUser?.authorizedRole === 'INSTITUTION_ADMIN') {
      const sessionInstId = currentUser.institutionId || currentUser.aictePermanentId;
      if (sessionInstId) {
        return all.filter(
          (a) => a.institutionId === sessionInstId || a.institution?.aictePermanentId === sessionInstId
        );
      }
    }

    // If an explicit institution filter is passed (e.g. by an authorized officer)
    if (forceInstitutionId && forceInstitutionId !== 'ALL') {
      return all.filter(
        (a) => a.institutionId === forceInstitutionId || a.institution?.aictePermanentId === forceInstitutionId
      );
    }

    return all;
  },

  /**
   * Gets application by ID with strict institution-level access control.
   */
  getApplicationById(id: string): InstitutionApplication | undefined {
    const all = this._getAllStoredApplications();
    const app = all.find((a) => a.id === id);
    if (!app) return undefined;

    const currentUser = authService.getCurrentUser();
    // Security Rule: Institution Admin can NEVER view another institution's application
    if (currentUser?.authorizedRole === 'INSTITUTION_ADMIN') {
      const sessionInstId = currentUser.institutionId || currentUser.aictePermanentId;
      if (sessionInstId && app.institutionId !== sessionInstId && app.institution?.aictePermanentId !== sessionInstId) {
        return undefined; // Access Denied
      }
    }

    return app;
  },

  /**
   * Resolves institution details dynamically for the authenticated user or given ID.
   */
  getInstitutionDetails(institutionId?: string): InstitutionDetails {
    const currentUser = authService.getCurrentUser();
    const targetId = institutionId || currentUser?.institutionId || currentUser?.aictePermanentId || '1-938210941';
    if (INSTITUTIONS_DIRECTORY[targetId]) {
      return { ...INSTITUTIONS_DIRECTORY[targetId] };
    }
    return { ...INITIAL_INSTITUTION_DETAILS };
  },

  saveApplication(app: InstitutionApplication): InstitutionApplication {
    const currentUser = authService.getCurrentUser();
    // Security Rule: Prevent institution admin from modifying another institution's record
    if (currentUser?.authorizedRole === 'INSTITUTION_ADMIN') {
      const sessionInstId = currentUser.institutionId || currentUser.aictePermanentId;
      if (sessionInstId && app.institutionId !== sessionInstId && app.institution?.aictePermanentId !== sessionInstId) {
        throw new Error('Unauthorized: Cannot modify records of another institution.');
      }
    }

    const all = this._getAllStoredApplications();
    const existingIndex = all.findIndex((a) => a.id === app.id);
    let updatedList: InstitutionApplication[];

    const updatedApp = {
      ...app,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (existingIndex >= 0) {
      updatedList = [...all];
      updatedList[existingIndex] = updatedApp;
    } else {
      updatedList = [updatedApp, ...all];
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch {
      // safe fallback
    }
    return updatedApp;
  },

  createNewApplication(
    type: ApplicationType,
    academicYear: string,
    changeCategory?: ChangeCategory,
    purposeRemarks: string = ''
  ): InstitutionApplication {
    const currentUser = authService.getCurrentUser();
    const instDetails = this.getInstitutionDetails(currentUser?.institutionId);
    const isNiear = instDetails.aictePermanentId === '1-482019382';

    const yearCode = academicYear.split('-')[0];
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const refNum = `APP-${yearCode}-AICTE-${randSuffix}`;

    const initialCourses = isNiear ? [...NIEAR_COURSES] : [...INITIAL_COURSES];
    const initialDocs: DocumentItem[] = [
      {
        id: `doc_req_${Date.now()}_1`,
        name: 'AICTE Mandatory Trust & Land Affidavit',
        category: 'Affidavits and Undertakings',
        fileSize: 'Pending',
        uploadDate: 'Pending',
        status: 'Missing',
        isMandatory: true,
      },
      {
        id: `doc_req_${Date.now()}_2`,
        name: 'State Government / DTE No Objection Certificate (NOC)',
        category: 'NOCs and Permissions',
        fileSize: 'Pending',
        uploadDate: 'Pending',
        status: 'Missing',
        isMandatory: true,
      },
      {
        id: `doc_req_${Date.now()}_3`,
        name: 'Land Ownership Deed & Measurement Record',
        category: 'Infrastructure Evidence',
        fileSize: 'Pending',
        uploadDate: 'Pending',
        status: 'Missing',
        isMandatory: true,
      },
      {
        id: `doc_req_${Date.now()}_4`,
        name: 'Fire & Emergency Safety Clearance Certificate',
        category: 'NOCs and Permissions',
        fileSize: 'Pending',
        uploadDate: 'Pending',
        status: 'Missing',
        isMandatory: true,
      },
    ];

    const newApp: InstitutionApplication = {
      id: refNum,
      institutionId: instDetails.aictePermanentId,
      type,
      changeCategory,
      academicYear,
      referenceNumber: refNum,
      purposeRemarks:
        purposeRemarks ||
        (type === 'EOA'
          ? `Extension of Approval (EoA) Application for AY ${academicYear}`
          : `Request for ${changeCategory || 'Approval-related Changes'} for AY ${academicYear}`),
      status: 'Draft',
      validationStatus: 'Verification Pending',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      institution: { ...instDetails },
      courses: initialCourses,
      documents: initialDocs,
      findings: [
        {
          id: `fnd_${Date.now()}_1`,
          severity: 'NOTICE',
          title: 'Draft Application Initialized',
          explanation: 'Draft created. Mandatory statutory documents must be uploaded and pass verification before submission.',
          relatedFieldOrDoc: 'Application Metadata',
          recommendedAction: 'Upload certified documents matching institution PID.',
          verificationStatus: 'Verification Pending',
          lastChecked: new Date().toLocaleTimeString('en-IN') + ' IST',
        },
      ],
      timeline: [
        {
          id: `evt_${Date.now()}_1`,
          eventType: 'Draft Initialized',
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          actor: `${currentUser?.name || instDetails.authorizedRepresentative} (${currentUser?.designation || 'Institution Administrator'})`,
          notes: `Created draft for ${type === 'EOA' ? 'Extension of Approval' : changeCategory || 'Approval Change'}.`,
        },
      ],
    };

    return this.saveApplication(newApp);
  },

  submitApplication(id: string): { success: boolean; application?: InstitutionApplication; error?: string } {
    const app = this.getApplicationById(id);
    if (!app) return { success: false, error: 'Application not found' };

    // Run preliminary validation check before submission
    const validation = this.runPreliminaryValidation(app);
    const hasCritical = validation.some((f) => f.severity === 'CRITICAL');

    if (hasCritical) {
      const critMsgs = validation.filter(f => f.severity === 'CRITICAL').map(f => f.title).join('; ');
      return {
        success: false,
        error: `Cannot submit application with critical deficiency findings: ${critMsgs}. Please rectify the flagged issues before submitting.`,
      };
    }

    const updated: InstitutionApplication = {
      ...app,
      status: 'Submitted',
      validationStatus: 'Preliminary Check Passed',
      updatedAt: new Date().toISOString().split('T')[0],
      timeline: [
        ...app.timeline,
        {
          id: `evt_${Date.now()}_sub`,
          eventType: 'Application Formally Submitted',
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          actor: `${authService.getCurrentUser()?.name || app.institution.authorizedRepresentative} (${authService.getCurrentUser()?.designation || 'Institution Administrator'})`,
          notes: 'Application submitted through institutional portal. Transmission logged for preliminary scrutiny.',
        },
      ],
    };

    const saved = this.saveApplication(updated);
    return { success: true, application: saved };
  },

  runPreliminaryValidation(app: InstitutionApplication): ValidationFinding[] {
    const findings: ValidationFinding[] = [];
    const now = new Date().toLocaleTimeString('en-IN') + ' IST';

    // 1. Institution Details Checks
    if (!app.institution.aictePermanentId || !app.institution.name) {
      findings.push({
        id: `fnd_val_${Date.now()}_1`,
        severity: 'CRITICAL',
        title: 'Missing Core Institution Identifiers',
        explanation: 'AICTE Permanent ID or Registered Institution Name is missing in institutional profile.',
        relatedFieldOrDoc: 'Institution Details',
        recommendedAction: 'Complete all mandatory institution fields in Step 2.',
        verificationStatus: 'Mismatch Detected',
        lastChecked: now,
      });
    } else {
      findings.push({
        id: `fnd_val_${Date.now()}_2`,
        severity: 'VERIFIED',
        title: 'Institution Registry Authenticated',
        explanation: `Institution PID ${app.institution.aictePermanentId} matches autonomous technical institute registry.`,
        relatedFieldOrDoc: 'AICTE Permanent ID',
        evidenceReference: 'AICTE Central Registry DB (Simulated)',
        recommendedAction: 'No action required.',
        verificationStatus: 'Verified by Authorized Source',
        lastChecked: now,
      });
    }

    // 2. Courses & Faculty Checks
    if (app.courses.length === 0) {
      findings.push({
        id: `fnd_val_${Date.now()}_3`,
        severity: 'CRITICAL',
        title: 'No Active Courses Listed',
        explanation: 'At least one approved technical programme or course must be declared.',
        relatedFieldOrDoc: 'Courses & Faculty Table',
        recommendedAction: 'Add academic course programmes in Step 3.',
        verificationStatus: 'Mismatch Detected',
        lastChecked: now,
      });
    } else {
      // Check faculty cadre ratios
      app.courses.forEach((crs) => {
        const requiredFaculty = Math.ceil(crs.proposedIntake / 15);
        if (crs.facultyCount < requiredFaculty) {
          findings.push({
            id: `fnd_val_crs_${crs.id}`,
            severity: 'CRITICAL',
            title: `Faculty Deficit in ${crs.programmeName}`,
            explanation: `Declared faculty (${crs.facultyCount}) is below the required 1:15 cadre ratio (${requiredFaculty} required for ${crs.proposedIntake} intake).`,
            relatedFieldOrDoc: `${crs.programmeName} [${crs.programmeIdentifier}]`,
            recommendedAction: `Update faculty appointments or adjust intake to meet 1:15 ratio.`,
            verificationStatus: 'Mismatch Detected',
            lastChecked: now,
          });
        }
      });
    }

    // 3. Document Completeness & Expiry Checks
    const mandatoryDocCategories = [
      'Affidavits and Undertakings',
      'NOCs and Permissions',
      'Infrastructure Evidence',
    ];

    mandatoryDocCategories.forEach((cat) => {
      const hasDoc = app.documents.some((d) => d.category === cat && d.status !== 'Missing');
      if (!hasDoc) {
        findings.push({
          id: `fnd_val_doc_${cat}`,
          severity: 'CRITICAL',
          title: `Missing Mandatory Document: ${cat}`,
          explanation: `A valid certificate under '${cat}' is required per AICTE Approval Process Handbook.`,
          relatedFieldOrDoc: cat,
          recommendedAction: `Upload the certified file under ${cat} in Step 4.`,
          verificationStatus: 'Mismatch Detected',
          lastChecked: now,
        });
      }
    });

    // Check verified and deficient status for existing documents
    app.documents.forEach((doc) => {
      if (doc.status === 'Verified') {
        findings.push({
          id: `fnd_val_ok_${doc.id}`,
          severity: 'VERIFIED',
          title: `Document Authenticated: ${doc.name.substring(0, 36)}...`,
          explanation: `Cryptographic digital signature verified via ${doc.verificationSource || 'Authorized Source'}.`,
          relatedFieldOrDoc: doc.name,
          evidenceReference: doc.verificationHash || 'SHA-256 Validated',
          recommendedAction: 'No action required.',
          verificationStatus: 'Verified by Authorized Source',
          lastChecked: now,
        });
      } else if (doc.status === 'Mismatch') {
        findings.push({
          id: `fnd_val_def_${doc.id}`,
          severity: 'CRITICAL',
          title: `Deficient Certificate: ${doc.name}`,
          explanation: `Document failed verification checks (PID mismatch, missing institution name, or unverified format).`,
          relatedFieldOrDoc: doc.name,
          recommendedAction: 'Replace with an authentic certified document matching institutional records.',
          verificationStatus: 'Mismatch Detected',
          lastChecked: now,
        });
      }
    });

    // 4. Real Managed Documents Vault Audit Check
    try {
      const storageKey = `authenx_managed_docs_${app.id}`;
      const rawStored = typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null;
      if (rawStored) {
        const managedDocs = JSON.parse(rawStored);
        if (Array.isArray(managedDocs)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          managedDocs.forEach((mDoc: any) => {
            const isCritical = mDoc.verificationStatus === 'Needs Manual Review' || 
              mDoc.verificationStatus === 'Processing Failed' ||
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (Array.isArray(mDoc.anomalies) && mDoc.anomalies.some((a: any) => a.severity === 'CRITICAL'));
            
            if (isCritical) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const primaryAnom = mDoc.anomalies?.find((a: any) => a.severity === 'CRITICAL');
              findings.push({
                id: `fnd_val_crit_${mDoc.id}`,
                severity: 'CRITICAL',
                title: `Critical Deficiency in ${mDoc.originalFilename}`,
                explanation: primaryAnom?.explanation || `Verification checks flagged '${mDoc.originalFilename}' with critical anomalies. Status: Needs Manual Review.`,
                relatedFieldOrDoc: mDoc.originalFilename,
                recommendedAction: 'Replace with a valid certificate matching institutional records.',
                verificationStatus: 'Mismatch Detected',
                lastChecked: now,
              });
            }
          });
        }
      }
    } catch {
      // safe ignore
    }

    return findings;
  },

  getSummaryCounts() {
    const list = this.getApplications();
    return {
      total: list.length,
      drafts: list.filter((a) => a.status === 'Draft').length,
      underReview: list.filter((a) => a.status === 'Under Official Review' || a.status === 'Submitted' || a.status === 'Verification Pending').length,
      actionRequired: list.filter((a) => a.status === 'Rectification Required' || a.validationStatus === 'Mismatch Detected').length,
    };
  },
};
