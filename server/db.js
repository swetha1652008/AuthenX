import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory outside public web root
const DATA_DIR = path.join(__dirname, '..', 'data_storage');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'authenx_documents.sqlite');
export const db = new Database(DB_PATH);

// Enable WAL mode for concurrent performance and foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      application_id TEXT NOT NULL,
      institution_id TEXT NOT NULL,
      original_filename TEXT NOT NULL,
      storage_reference TEXT NOT NULL,
      document_category TEXT NOT NULL,
      file_size TEXT NOT NULL,
      file_size_bytes INTEGER NOT NULL,
      mime_type TEXT NOT NULL,
      upload_date TEXT NOT NULL,
      upload_time TEXT NOT NULL,
      uploading_user_id TEXT NOT NULL,
      uploading_user_name TEXT NOT NULL,
      expiry_date TEXT,
      is_expired INTEGER DEFAULT 0,
      upload_status TEXT NOT NULL,
      ocr_status TEXT NOT NULL,
      verification_status TEXT NOT NULL,
      sha256_hash TEXT NOT NULL,
      extracted_text TEXT,
      candidate_values TEXT, -- JSON string
      is_mandatory INTEGER DEFAULT 1,
      notes TEXT,
      reviewer_observations TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS document_anomalies (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL,
      application_id TEXT NOT NULL,
      anomaly_type TEXT NOT NULL,
      severity TEXT NOT NULL,
      explanation TEXT NOT NULL,
      supporting_field_or_text TEXT,
      detected_at TEXT NOT NULL,
      review_status TEXT DEFAULT 'Pending Review',
      FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS document_audit_trail (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      action TEXT NOT NULL,
      document_id TEXT,
      application_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      details TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS checklist_rules (
      id TEXT PRIMARY KEY,
      application_type TEXT NOT NULL,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      is_mandatory INTEGER DEFAULT 1,
      minimum_count INTEGER DEFAULT 1
    );
  `);

  // Seed default checklist rules if empty
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM checklist_rules');
  const result = countStmt.get();
  const count = result ? result.count : 0;

  if (count === 0) {
    const insertRule = db.prepare(`
      INSERT INTO checklist_rules (id, application_type, category, title, description, is_mandatory, minimum_count)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const defaultRules = [
      ['rule_1', 'ALL', 'Affidavit / Undertaking', 'AICTE Format Undertaking & Trust Resolution', 'Affidavit in prescribed AICTE Format regarding anti-ragging, land title, and compliance with norms.', 1, 1],
      ['rule_2', 'ALL', 'No Objection Certificate (NOC)', 'State Government / Affiliating University NOC', 'Statutory NOC from the state Department of Technical Education and affiliating university.', 1, 1],
      ['rule_3', 'ALL', 'Accreditation / Certification', 'NBA / NAAC Accreditation Certificates', 'Accreditation status record for existing technical programmes.', 0, 1],
      ['rule_4', 'ALL', 'Statutory Permission / Approval', 'Town Planning / Municipal Building Approval', 'Approved master campus layout plan and municipal building occupancy permit.', 1, 1],
      ['rule_5', 'ALL', 'Faculty-Related Documents', 'Faculty Cadre & Appointment Register', 'Endorsed faculty roster verifying cadre ratio (1:15/1:20) and pay scale compliance.', 1, 1],
      ['rule_6', 'ALL', 'Infrastructure-Related Documents', 'Land Title Deeds & Infrastructure Measurement Certificate', 'Registered land ownership deeds and barrier-free barrier compliance certificate.', 1, 1],
      ['rule_7', 'ALL', 'Previous Approval / Extension of Approval (EoA)', 'Previous Year AICTE EoA Order', 'Extension of Approval copy for previous academic session.', 1, 1],
      ['rule_8', 'ALL', 'Compliance / Deficiency Documents', 'Audited Balance Sheet & Financial Statements', 'Audited accounts of the educational trust/society for the preceding financial year.', 1, 1],
      ['rule_9', 'ALL', 'Institutional Records', 'Board of Governors Minutes & Trust Deed', 'Approved constitution of Governing Body and registered Trust deed.', 0, 1],
      ['rule_10', 'ALL', 'Other Supporting Documents', 'Fire Safety & Structural Stability Certificate', 'Current Fire Safety NOC from State Fire Department and Structural Stability Certificate from PWD/certified engineer.', 1, 1],
    ];

    const insertMany = db.transaction((rules) => {
      for (const rule of rules) {
        insertRule.run(...rule);
      }
    });

    insertMany(defaultRules);
  }
}
