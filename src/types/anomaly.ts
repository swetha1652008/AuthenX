export type AnomalyAlertCategory =
  | 'Exact Duplicate'
  | 'Possible Duplicate'
  | 'Identifier Mismatch'
  | 'Date Inconsistency'
  | 'Metadata Anomaly'
  | 'Possible Alteration'
  | 'Insufficient Evidence'
  | 'Processing Failed';

export type AnomalySeverityLevel = 'CRITICAL' | 'WARNING' | 'INFO';

export type AnomalyReviewStatus =
  | 'PENDING'
  | 'UNDER REVIEW'
  | 'CONFIRMED ISSUE'
  | 'FALSE POSITIVE';

export type FieldComparisonStatus =
  | 'MATCH'
  | 'MISMATCH'
  | 'MISSING'
  | 'UNCERTAIN'
  | 'NOT EXTRACTED';

export interface AnomalyAlert {
  id: string;
  applicationId: string;
  institutionId: string;
  documentId: string;
  documentName: string;
  comparedDocumentId?: string;
  comparedDocumentName?: string;
  category: AnomalyAlertCategory;
  detectionRule: string;
  severity: AnomalySeverityLevel;
  explanation: string;
  supportingEvidence?: string;
  fieldOrAttribute?: string;
  detectedAt: string;
  processingMode: 'REAL' | 'DEMO';
  reviewStatus: AnomalyReviewStatus;
  assignedReviewer?: string;
  reviewerNotes?: string;
  reviewedAt?: string;
}

export interface MetadataFieldComparison {
  fieldKey: string;
  fieldName: string;
  docAValue: string;
  docBValue: string;
  status: FieldComparisonStatus;
  details?: string;
}

export interface SideBySideComparisonResult {
  docAId: string;
  docAName: string;
  docACategory: string;
  docASha256: string;
  docBId: string;
  docBName: string;
  docBCategory: string;
  docBSha256: string;
  isExactByteDuplicate: boolean;
  textSimilarityScore: number; // 0 - 100 percentage
  textSimilarityLabel: 'Exact Byte Match' | 'High Content Similarity' | 'Moderate Similarity' | 'Distinct Content' | 'Insufficient Text';
  fieldComparisons: MetadataFieldComparison[];
  relatedAlerts: AnomalyAlert[];
  comparisonSummary: string;
  timestamp: string;
}

export interface AnomalyDashboardMetrics {
  documentsAnalyzed: number;
  exactDuplicateMatches: number;
  possibleDuplicateCandidates: number;
  metadataMismatches: number;
  dateInconsistencies: number;
  alterationIndicators: number;
  pendingHumanReviews: number;
}

export interface AnomalyAuditReport {
  reportId: string;
  applicationId: string;
  institutionId: string;
  institutionName: string;
  academicYear: string;
  generatedAt: string;
  analyzedDocumentsCount: number;
  analyzedDocumentList: { id: string; name: string; category: string; sha256: string }[];
  metrics: AnomalyDashboardMetrics;
  alerts: AnomalyAlert[];
  rulesetVersion: string; // e.g. "AICTE APH 2026-27 Anomaly Norms v2.1"
  processingMode: 'DEMO';
  officialDisclaimer: string;
}
