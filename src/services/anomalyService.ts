import type { 
  AnomalyAlert, 
  AnomalyReviewStatus, 
  SideBySideComparisonResult, 
  MetadataFieldComparison,
  AnomalyDashboardMetrics,
  AnomalyAuditReport
} from '../types/anomaly';
import type { ManagedDocument } from '../types/document';
import type { UserAccount } from '../types/auth';
import { documentService } from './documentService';
import { institutionService } from './institutionService';

const ALERTS_STORAGE_PREFIX = 'authenx_anomaly_alerts_';

/**
 * Tokenizes text and calculates Jaccard similarity coefficient (0 to 100)
 */
function computeTextSimilarity(textA?: string, textB?: string): number {
  if (!textA || !textB) return 0;
  const wordsA = new Set(
    textA.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 2)
  );
  const wordsB = new Set(
    textB.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 2)
  );

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  const intersection = new Set([...wordsA].filter((x) => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);

  return Math.round((intersection.size / union.size) * 100);
}

export const anomalyService = {
  /**
   * Retrieves all anomaly alerts for an application. Runs automated detections if not yet cached.
   */
  getAlerts(applicationId: string): AnomalyAlert[] {
    const storageKey = `${ALERTS_STORAGE_PREFIX}${applicationId}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }

    // Run automated deterministic detections on documents
    const docs = documentService.getDocuments(applicationId);
    const alerts = this.runDetectionPipeline(applicationId, docs);
    this.saveAlerts(applicationId, alerts);
    return alerts;
  },

  saveAlerts(applicationId: string, alerts: AnomalyAlert[]): void {
    try {
      localStorage.setItem(`${ALERTS_STORAGE_PREFIX}${applicationId}`, JSON.stringify(alerts));
    } catch (err) {
      console.error('Failed to save anomaly alerts:', err);
    }
  },

  /**
   * Deterministic Anomaly Detection Pipeline across documents of an application
   */
  runDetectionPipeline(applicationId: string, docs: ManagedDocument[]): AnomalyAlert[] {
    const alerts: AnomalyAlert[] = [];
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 1. Exact Byte Duplicate Detection (SHA-256)
    const hashBuckets = new Map<string, ManagedDocument[]>();
    docs.forEach((doc) => {
      const list = hashBuckets.get(doc.sha256Hash) || [];
      list.push(doc);
      hashBuckets.set(doc.sha256Hash, list);
    });

    hashBuckets.forEach((bucket, hash) => {
      if (bucket.length > 1) {
        alerts.push({
          id: `alt_dup_${Date.now()}_${hash.slice(0, 8)}`,
          applicationId,
          institutionId: bucket[0].institutionId,
          documentId: bucket[0].id,
          documentName: bucket[0].originalFilename,
          comparedDocumentId: bucket[1].id,
          comparedDocumentName: bucket[1].originalFilename,
          category: 'Exact Duplicate',
          detectionRule: 'AICTE-APH-RULE-SEC-01 (Byte-for-byte SHA-256 Hash Matching)',
          severity: 'WARNING',
          explanation: `Identical SHA-256 hash detected between '${bucket[0].originalFilename}' and '${bucket[1].originalFilename}'. Verify this is not an unintentional duplicate filing.`,
          supportingEvidence: `SHA-256: ${hash}`,
          fieldOrAttribute: 'File Payload Hash',
          detectedAt: now,
          processingMode: 'DEMO',
          reviewStatus: 'PENDING',
        });
      }
    });

    // 2. Near-Duplicate & Content Similarity (Cross-comparison)
    for (let i = 0; i < docs.length; i++) {
      for (let j = i + 1; j < docs.length; j++) {
        const docA = docs[i];
        const docB = docs[j];

        // Skip exact hash matches already flagged
        if (docA.sha256Hash === docB.sha256Hash) continue;

        const similarity = computeTextSimilarity(docA.extractedText, docB.extractedText);
        if (similarity >= 80) {
          alerts.push({
            id: `alt_near_${Date.now()}_${i}_${j}`,
            applicationId,
            institutionId: docA.institutionId,
            documentId: docA.id,
            documentName: docA.originalFilename,
            comparedDocumentId: docB.id,
            comparedDocumentName: docB.originalFilename,
            category: 'Possible Duplicate',
            detectionRule: 'AICTE-APH-RULE-SEC-02 (Content Token Similarity >= 80%)',
            severity: 'WARNING',
            explanation: `High text overlap (${similarity}% token similarity) detected between '${docA.originalFilename}' and '${docB.originalFilename}'. Potential near-duplicate draft or recycled document.`,
            supportingEvidence: `Token Jaccard Coefficient: ${similarity}% match across OCR paragraphs`,
            fieldOrAttribute: 'Extracted OCR Content Stream',
            detectedAt: now,
            processingMode: 'DEMO',
            reviewStatus: 'PENDING',
          });
        }
      }
    }

    // 3. Date Inconsistencies & Expired Certificate Checks
    const evalDate = new Date('2026-10-28');
    docs.forEach((doc) => {
      // Check expired date
      if (doc.expiryDate) {
        const expDate = new Date(doc.expiryDate);
        if (!isNaN(expDate.getTime()) && expDate < evalDate) {
          alerts.push({
            id: `alt_date_exp_${doc.id}`,
            applicationId,
            institutionId: doc.institutionId,
            documentId: doc.id,
            documentName: doc.originalFilename,
            category: 'Date Inconsistency',
            detectionRule: 'AICTE-APH-NORM-CH2-D01 (Statutory Validity Term)',
            severity: 'CRITICAL',
            explanation: `Document validity expired on ${doc.expiryDate}. Active validity certificate is mandatory for Extension of Approval (EoA).`,
            supportingEvidence: `Expiration: ${doc.expiryDate} (Expired relative to evaluation date 28-10-2026)`,
            fieldOrAttribute: 'Certificate Expiry Date',
            detectedAt: now,
            processingMode: 'DEMO',
            reviewStatus: 'PENDING',
          });
        }
      }

      // Check chronological order: issue date cannot be after expiry date
      if (doc.candidateValues?.issueDate && doc.candidateValues?.expiryDate) {
        const issue = new Date(doc.candidateValues.issueDate);
        const exp = new Date(doc.candidateValues.expiryDate);
        if (!isNaN(issue.getTime()) && !isNaN(exp.getTime()) && issue > exp) {
          alerts.push({
            id: `alt_date_ord_${doc.id}`,
            applicationId,
            institutionId: doc.institutionId,
            documentId: doc.id,
            documentName: doc.originalFilename,
            category: 'Date Inconsistency',
            detectionRule: 'AICTE-APH-NORM-CH2-D02 (Chronological Inversion)',
            severity: 'CRITICAL',
            explanation: `Inverted dates detected: Issue date (${doc.candidateValues.issueDate}) is chronologically after expiry date (${doc.candidateValues.expiryDate}).`,
            supportingEvidence: `Issue: ${doc.candidateValues.issueDate} > Expiry: ${doc.candidateValues.expiryDate}`,
            fieldOrAttribute: 'Issue / Expiry Date Pair',
            detectedAt: now,
            processingMode: 'DEMO',
            reviewStatus: 'PENDING',
          });
        }
      }
    });

    // 4. Metadata & Identifier Mismatch Checks
    const EXPECTED_PID = '1-938210941';
    const EXPECTED_NAME = 'Apex Institute of Technology & Science';

    docs.forEach((doc) => {
      const vals = doc.candidateValues;
      if (!vals) return;

      // Check if extracted name diverges from expected institution
      if (vals.institutionName && !vals.institutionName.toLowerCase().includes('apex')) {
        alerts.push({
          id: `alt_mismatch_inst_${doc.id}`,
          applicationId,
          institutionId: doc.institutionId,
          documentId: doc.id,
          documentName: doc.originalFilename,
          category: 'Identifier Mismatch',
          detectionRule: 'AICTE-APH-NORM-ID-01 (Entity Legal Name Validation)',
          severity: 'CRITICAL',
          explanation: `Extracted legal entity name '${vals.institutionName}' diverges from registered institution name '${EXPECTED_NAME}'.`,
          supportingEvidence: `Extracted: "${vals.institutionName}" vs Registry: "${EXPECTED_NAME}"`,
          fieldOrAttribute: 'Institution Registered Name',
          detectedAt: now,
          processingMode: 'DEMO',
          reviewStatus: 'PENDING',
        });
      }

      // Special check: Land Title deed in Trust name is acceptable but warrants review observation
      if (
        doc.documentCategory === 'Infrastructure-Related Documents' &&
        vals.institutionName?.includes('Trust')
      ) {
        alerts.push({
          id: `alt_info_trust_${doc.id}`,
          applicationId,
          institutionId: doc.institutionId,
          documentId: doc.id,
          documentName: doc.originalFilename,
          category: 'Metadata Anomaly',
          detectionRule: 'AICTE-APH-LAND-SEC-4 (Sponsoring Trust Earmarking Verification)',
          severity: 'INFO',
          explanation: `Land title deeds registered in sponsoring society name 'Apex Educational and Charitable Trust'. Verified linked to institution PID ${EXPECTED_PID}.`,
          supportingEvidence: 'Title Deed No. 8419/2012 endorsed to educational trust.',
          fieldOrAttribute: 'Trust Land Title Deeds',
          detectedAt: now,
          processingMode: 'DEMO',
          reviewStatus: 'UNDER REVIEW',
        });
      }
    });

    // 5. Possible Alteration Indicator (Simulated heuristic for suspicious formatting or version gap)
    docs.forEach((doc) => {
      if (doc.notes?.includes('Replaced on')) {
        alerts.push({
          id: `alt_mod_${doc.id}`,
          applicationId,
          institutionId: doc.institutionId,
          documentId: doc.id,
          documentName: doc.originalFilename,
          category: 'Possible Alteration',
          detectionRule: 'AICTE-APH-AUDIT-CH4 (Document Replacement Versioning)',
          severity: 'WARNING',
          explanation: `Document was replaced during the current filing session. Re-verification of all extracted attributes required before final scrutiny.`,
          supportingEvidence: doc.notes,
          fieldOrAttribute: 'Version Stream',
          detectedAt: now,
          processingMode: 'DEMO',
          reviewStatus: 'UNDER REVIEW',
        });
      }
    });

    return alerts;
  },

  /**
   * Calculates dashboard summary counts
   */
  getMetrics(applicationId: string): AnomalyDashboardMetrics {
    const docs = documentService.getDocuments(applicationId);
    const alerts = this.getAlerts(applicationId);

    const exactDuplicateMatches = alerts.filter((a) => a.category === 'Exact Duplicate').length;
    const possibleDuplicateCandidates = alerts.filter((a) => a.category === 'Possible Duplicate').length;
    const metadataMismatches = alerts.filter(
      (a) => a.category === 'Identifier Mismatch' || a.category === 'Metadata Anomaly'
    ).length;
    const dateInconsistencies = alerts.filter((a) => a.category === 'Date Inconsistency').length;
    const alterationIndicators = alerts.filter((a) => a.category === 'Possible Alteration').length;
    const pendingHumanReviews = alerts.filter((a) => a.reviewStatus === 'PENDING').length;

    return {
      documentsAnalyzed: docs.length,
      exactDuplicateMatches,
      possibleDuplicateCandidates,
      metadataMismatches,
      dateInconsistencies,
      alterationIndicators,
      pendingHumanReviews,
    };
  },

  /**
   * Updates an alert's review status with notes and reviewer credentials
   */
  updateAlertStatus(
    applicationId: string,
    alertId: string,
    newStatus: AnomalyReviewStatus,
    notes: string,
    reviewer: UserAccount
  ): AnomalyAlert | undefined {
    const alerts = this.getAlerts(applicationId);
    const target = alerts.find((a) => a.id === alertId);
    if (!target) return undefined;

    target.reviewStatus = newStatus;
    target.reviewerNotes = notes;
    target.assignedReviewer = `${reviewer.name} (${reviewer.designation || reviewer.authorizedRole})`;
    target.reviewedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    this.saveAlerts(applicationId, alerts);

    // Record audit event in documentService
    documentService.recordAuditAction(applicationId, {
      id: `audit_anom_${Date.now()}`,
      userId: reviewer.id,
      userName: reviewer.name,
      action: 'OBSERVATION_ADDED',
      documentId: target.documentId,
      applicationId,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      details: `Updated anomaly alert '${target.category}' status to '${newStatus}'. Remarks: "${notes}"`,
    });

    return target;
  },

  /**
   * Compares two documents side-by-side with genuine text similarity and field matrix
   */
  compareDocuments(docA: ManagedDocument, docB: ManagedDocument): SideBySideComparisonResult {
    const isExactByteDuplicate = docA.sha256Hash === docB.sha256Hash;
    const textSimilarityScore = isExactByteDuplicate
      ? 100
      : computeTextSimilarity(docA.extractedText, docB.extractedText);

    let textSimilarityLabel: SideBySideComparisonResult['textSimilarityLabel'] = 'Distinct Content';
    if (isExactByteDuplicate) {
      textSimilarityLabel = 'Exact Byte Match';
    } else if (textSimilarityScore >= 80) {
      textSimilarityLabel = 'High Content Similarity';
    } else if (textSimilarityScore >= 50) {
      textSimilarityLabel = 'Moderate Similarity';
    } else if (!docA.extractedText || !docB.extractedText) {
      textSimilarityLabel = 'Insufficient Text';
    }

    const valsA = docA.candidateValues || {};
    const valsB = docB.candidateValues || {};

    const fieldComparisons: MetadataFieldComparison[] = [
      {
        fieldKey: 'category',
        fieldName: 'Document Category',
        docAValue: docA.documentCategory,
        docBValue: docB.documentCategory,
        status: docA.documentCategory === docB.documentCategory ? 'MATCH' : 'MISMATCH',
        details: docA.documentCategory === docB.documentCategory ? 'Same category classification' : 'Cross-category filing',
      },
      {
        fieldKey: 'institutionName',
        fieldName: 'Institution Name',
        docAValue: valsA.institutionName || 'Not Extracted',
        docBValue: valsB.institutionName || 'Not Extracted',
        status:
          !valsA.institutionName || !valsB.institutionName
            ? 'MISSING'
            : valsA.institutionName === valsB.institutionName
            ? 'MATCH'
            : 'MISMATCH',
        details: 'Compared against registered institution legal name',
      },
      {
        fieldKey: 'docNumber',
        fieldName: 'Document Reference Number',
        docAValue: valsA.documentNumber || 'Not Identified',
        docBValue: valsB.documentNumber || 'Not Identified',
        status:
          !valsA.documentNumber || !valsB.documentNumber
            ? 'MISSING'
            : valsA.documentNumber === valsB.documentNumber
            ? 'MATCH'
            : 'MISMATCH',
        details: 'Identical certificate numbers between different files is an anomaly indicator',
      },
      {
        fieldKey: 'issueDate',
        fieldName: 'Issue Date',
        docAValue: valsA.issueDate || 'Not Identified',
        docBValue: valsB.issueDate || 'Not Identified',
        status:
          !valsA.issueDate || !valsB.issueDate
            ? 'MISSING'
            : valsA.issueDate === valsB.issueDate
            ? 'MATCH'
            : 'MISMATCH',
        details: 'Chronological timeline comparison',
      },
      {
        fieldKey: 'expiryDate',
        fieldName: 'Expiry Date',
        docAValue: valsA.expiryDate || docA.expiryDate || 'N/A',
        docBValue: valsB.expiryDate || docB.expiryDate || 'N/A',
        status:
          !valsA.expiryDate && !valsB.expiryDate
            ? 'MISSING'
            : (valsA.expiryDate || docA.expiryDate) === (valsB.expiryDate || docB.expiryDate)
            ? 'MATCH'
            : 'MISMATCH',
        details: 'Statutory validity expiration comparison',
      },
      {
        fieldKey: 'issuingAuthority',
        fieldName: 'Issuing Authority',
        docAValue: valsA.issuingAuthority || 'Not Identified',
        docBValue: valsB.issuingAuthority || 'Not Identified',
        status:
          !valsA.issuingAuthority || !valsB.issuingAuthority
            ? 'MISSING'
            : valsA.issuingAuthority === valsB.issuingAuthority
            ? 'MATCH'
            : 'MISMATCH',
        details: 'Issuing body endorsement check',
      },
      {
        fieldKey: 'sha256',
        fieldName: 'Cryptographic SHA-256 Hash',
        docAValue: docA.sha256Hash.substring(0, 16) + '...',
        docBValue: docB.sha256Hash.substring(0, 16) + '...',
        status: isExactByteDuplicate ? 'MATCH' : 'MISMATCH',
        details: isExactByteDuplicate ? 'Identical binary content' : 'Different binary payloads',
      },
    ];

    // Gather related alerts
    const allAlerts = this.getAlerts(docA.applicationId);
    const relatedAlerts = allAlerts.filter(
      (a) =>
        a.documentId === docA.id ||
        a.documentId === docB.id ||
        a.comparedDocumentId === docA.id ||
        a.comparedDocumentId === docB.id
    );

    const comparisonSummary = isExactByteDuplicate
      ? 'CRITICAL ALERT: Exact byte-for-byte duplicate files detected. Identical SHA-256 payload.'
      : textSimilarityScore >= 80
      ? `WARNING: High content similarity (${textSimilarityScore}%). Verify files are not redundant submissions.`
      : 'Compliant distinct documents with independent attributes.';

    return {
      docAId: docA.id,
      docAName: docA.originalFilename,
      docACategory: docA.documentCategory,
      docASha256: docA.sha256Hash,
      docBId: docB.id,
      docBName: docB.originalFilename,
      docBCategory: docB.documentCategory,
      docBSha256: docB.sha256Hash,
      isExactByteDuplicate,
      textSimilarityScore,
      textSimilarityLabel,
      fieldComparisons,
      relatedAlerts,
      comparisonSummary,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };
  },

  /**
   * Generates comprehensive structured Anomaly Audit Report
   */
  generateReport(applicationId: string): AnomalyAuditReport {
    const app = institutionService.getApplicationById(applicationId);
    const docs = documentService.getDocuments(applicationId);
    const alerts = this.getAlerts(applicationId);
    const metrics = this.getMetrics(applicationId);

    const report: AnomalyAuditReport = {
      reportId: `REP-ANOM-${applicationId}-${Date.now().toString().slice(-6)}`,
      applicationId,
      institutionId: app?.institution.aictePermanentId || '1-938210941',
      institutionName: app?.institution.name || 'Apex Institute of Technology & Science',
      academicYear: app?.academicYear || '2026-2027',
      generatedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      analyzedDocumentsCount: docs.length,
      analyzedDocumentList: docs.map((d) => ({
        id: d.id,
        name: d.originalFilename,
        category: d.documentCategory,
        sha256: d.sha256Hash,
      })),
      metrics,
      alerts,
      rulesetVersion: 'AICTE Approval Process Handbook (APH) 2026-27 Anomaly Norms v2.1',
      processingMode: 'DEMO',
      officialDisclaimer:
        'This Anomaly Detection & Document Authentication Report is an AI decision-support mechanism to assist regulatory scrutiny. Identified indicators do not constitute legal proof of forgery or an official AICTE grant/rejection.',
    };

    return report;
  },

  downloadJsonReport(report: AnomalyAuditReport): void {
    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AuthenX_Anomaly_Report_${report.applicationId}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
