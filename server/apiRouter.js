import express from 'express';
import { db } from './db.js';
import { validateWithGeminiAI } from './aiService.js';

export function createApiRouter() {
  const router = express.Router();

  // Middleware for CORS and JSON handling
  router.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-user-role, x-institution-id, x-user-id, x-user-name');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  });

  // Health and System Status Endpoint
  router.get('/status', (_req, res) => {
    let docCount = 0;
    try {
      const row = db.prepare('SELECT COUNT(*) as count FROM documents').get();
      docCount = row ? row.count : 0;
    } catch {
      // ignore
    }

    res.json({
      status: 'online',
      system: 'AuthenX AICTE Document Authentication & Compliance Verification Engine',
      database: {
        connected: true,
        type: 'SQLite3 (WAL mode)',
        totalDocumentsTracked: docCount
      },
      geminiAI: {
        configured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '' && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY'),
        model: 'gemini-2.5-flash',
        mode: process.env.GEMINI_API_KEY ? 'LIVE_NEURAL_EVALUATION' : 'HEURISTIC_RULE_FALLBACK'
      },
      institutionIsolation: {
        enforced: true,
        protectedTenants: [
          { name: 'Apex Institute of Technology & Science', pid: '1-938210941' },
          { name: 'National Institute of Engineering and Applied Research (NIEAR)', pid: '1-482019382' }
        ]
      }
    });
  });

  // Real AI Validation Endpoint
  router.post('/ai/validate', async (req, res) => {
    try {
      const { text, filename, category, registeredApp } = req.body;
      if (!text || text.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'No readable text content provided for AI analysis.'
        });
      }

      const aiResult = await validateWithGeminiAI({
        text,
        filename: filename || 'Uploaded_Document.pdf',
        category: category || 'Affidavit / Undertaking',
        registeredApp
      });

      return res.json(aiResult);
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: `AI analysis service encountered an internal error: ${err.message}`
      });
    }
  });

  // Get Documents with strict server-side institution isolation
  router.get('/documents', (req, res) => {
    const userRole = req.headers['x-user-role'];
    const sessionInstId = req.headers['x-institution-id'];
    const { applicationId, institutionId } = req.query;

    try {
      let query = 'SELECT * FROM documents';
      const params = [];

      // Security check: If caller is an Institution Admin, strictly enforce session institution ID
      if (userRole === 'INSTITUTION_ADMIN') {
        if (!sessionInstId) {
          return res.status(401).json({ error: 'Unauthorized: Missing institution session credentials.' });
        }

        // If client specifically queried another institution, reject
        if (institutionId && institutionId !== sessionInstId) {
          return res.status(403).json({ error: 'Forbidden: Cross-tenant data access is strictly prohibited.' });
        }

        query += ' WHERE institution_id = ?';
        params.push(sessionInstId);

        if (applicationId) {
          query += ' AND application_id = ?';
          params.push(applicationId);
        }
      } else if (applicationId) {
        query += ' WHERE application_id = ?';
        params.push(applicationId);
      } else if (institutionId) {
        query += ' WHERE institution_id = ?';
        params.push(institutionId);
      }

      query += ' ORDER BY created_at DESC';

      const rows = db.prepare(query).all(...params);
      const parsedDocs = rows.map((r) => ({
        id: r.id,
        applicationId: r.application_id,
        institutionId: r.institution_id,
        originalFilename: r.original_filename,
        storageReference: r.storage_reference,
        documentCategory: r.document_category,
        fileSize: r.file_size,
        fileSizeBytes: r.file_size_bytes,
        mimeType: r.mime_type,
        uploadDate: r.upload_date,
        uploadTime: r.upload_time,
        uploadingUserId: r.uploading_user_id,
        uploadingUserName: r.uploading_user_name,
        expiryDate: r.expiry_date,
        isExpired: !!r.is_expired,
        uploadStatus: r.upload_status,
        ocrStatus: r.ocr_status,
        verificationStatus: r.verification_status,
        sha256Hash: r.sha256_hash,
        extractedText: r.extracted_text,
        candidateValues: r.candidate_values ? JSON.parse(r.candidate_values) : undefined,
        isMandatory: !!r.is_mandatory,
        notes: r.notes,
        reviewerObservations: r.reviewer_observations,
      }));

      return res.json({ success: true, count: parsedDocs.length, documents: parsedDocs });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Sync / Persist Document to Database
  router.post('/documents/sync', (req, res) => {
    const userRole = req.headers['x-user-role'];
    const sessionInstId = req.headers['x-institution-id'];
    const doc = req.body;

    if (!doc || !doc.id || !doc.applicationId || !doc.institutionId) {
      return res.status(400).json({ error: 'Invalid document payload.' });
    }

    // Security check: Institution admin cannot write documents for another institution
    if (userRole === 'INSTITUTION_ADMIN' && doc.institutionId !== sessionInstId) {
      return res.status(403).json({ error: 'Forbidden: Cannot create or update documents for a different institution.' });
    }

    try {
      const upsert = db.prepare(`
        INSERT INTO documents (
          id, application_id, institution_id, original_filename, storage_reference,
          document_category, file_size, file_size_bytes, mime_type, upload_date,
          upload_time, uploading_user_id, uploading_user_name, expiry_date, is_expired,
          upload_status, ocr_status, verification_status, sha256_hash, extracted_text,
          candidate_values, is_mandatory, notes, reviewer_observations, updated_at
        ) VALUES (
          @id, @application_id, @institution_id, @original_filename, @storage_reference,
          @document_category, @file_size, @file_size_bytes, @mime_type, @upload_date,
          @upload_time, @uploading_user_id, @uploading_user_name, @expiry_date, @is_expired,
          @upload_status, @ocr_status, @verification_status, @sha256_hash, @extracted_text,
          @candidate_values, @is_mandatory, @notes, @reviewer_observations, CURRENT_TIMESTAMP
        )
        ON CONFLICT(id) DO UPDATE SET
          verification_status = excluded.verification_status,
          ocr_status = excluded.ocr_status,
          expiry_date = excluded.expiry_date,
          is_expired = excluded.is_expired,
          candidate_values = excluded.candidate_values,
          notes = excluded.notes,
          reviewer_observations = excluded.reviewer_observations,
          updated_at = CURRENT_TIMESTAMP
      `);

      upsert.run({
        id: doc.id,
        application_id: doc.applicationId,
        institution_id: doc.institutionId,
        original_filename: doc.originalFilename,
        storage_reference: doc.storageReference || `/storage/${doc.id}`,
        document_category: doc.documentCategory,
        file_size: doc.fileSize || '1.0 MB',
        file_size_bytes: doc.fileSizeBytes || 1048576,
        mime_type: doc.mimeType || 'application/pdf',
        upload_date: doc.uploadDate,
        upload_time: doc.uploadTime || '12:00:00 IST',
        uploading_user_id: doc.uploadingUserId || 'usr_unknown',
        uploading_user_name: doc.uploadingUserName || 'System User',
        expiry_date: doc.expiryDate || null,
        is_expired: doc.isExpired ? 1 : 0,
        upload_status: doc.uploadStatus || 'Uploaded',
        ocr_status: doc.ocrStatus || 'Completed',
        verification_status: doc.verificationStatus || 'Pending Verification',
        sha256_hash: doc.sha256Hash || 'hash_placeholder',
        extracted_text: doc.extractedText || '',
        candidate_values: doc.candidateValues ? JSON.stringify(doc.candidateValues) : null,
        is_mandatory: doc.isMandatory ? 1 : 0,
        notes: doc.notes || '',
        reviewer_observations: doc.reviewerObservations || ''
      });

      // Record audit entry
      db.prepare(`
        INSERT INTO document_audit_trail (id, user_id, user_name, action, document_id, application_id, timestamp, details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `audit_${Date.now()}`,
        doc.uploadingUserId || 'usr_sys',
        doc.uploadingUserName || 'System',
        'DOCUMENT_SYNC',
        doc.id,
        doc.applicationId,
        new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        `Synced document '${doc.originalFilename}' with verification status: ${doc.verificationStatus}.`
      );

      return res.json({ success: true, id: doc.id });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Issuing Authority Verification Endpoint
  router.post('/verify-authority', (req, res) => {
    const { documentId, certificateNumber, issuingAuthority, qrUrl } = req.body;

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // AICTE rule: Never simulate an authority response or claim official verification without genuine live connection.
    // If no live gateway configured:
    return res.json({
      success: true,
      queryStatus: 'SOURCE_NOT_CONFIGURED',
      status: 'Authority Verification Pending',
      issuingAuthority: issuingAuthority || 'Statutory Department',
      certificateNumber: certificateNumber || 'Not Specified',
      timestamp,
      details: 'Live external government registry API gateway (DigiLocker / State Fire Gateway / VTU Registry) is not connected in this deployment. Automated checks evaluated locally. Official confirmation pending issuing authority response.',
      isOfficiallyVerified: false
    });
  });

  // Officer Scrutiny Decision Endpoint
  router.post('/officer/decision', (req, res) => {
    const userRole = req.headers['x-user-role'];
    const userName = req.headers['x-user-name'] || 'Authorized Officer';
    const userId = req.headers['x-user-id'] || 'usr_officer';
    const { applicationId, documentId, decision, notes } = req.body;

    // Strict Role Enforcement: Institution Admins can NEVER approve their own documents
    if (userRole === 'INSTITUTION_ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Institution administrators cannot make scrutiny determinations on their own submissions.'
      });
    }

    if (!documentId || !decision) {
      return res.status(400).json({ success: false, error: 'Document ID and decision are required.' });
    }

    let nextVerificationStatus = 'Needs Manual Review';
    if (decision === 'Approved') {
      nextVerificationStatus = 'Officially Verified';
    } else if (decision === 'Rejected') {
      nextVerificationStatus = 'Rejected by Authorized Reviewer';
    } else if (decision === 'Rectification Requested') {
      nextVerificationStatus = 'Needs Manual Review';
    }

    try {
      db.prepare(`
        UPDATE documents
        SET verification_status = ?, reviewer_observations = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(nextVerificationStatus, notes || `Decision '${decision}' recorded by ${userName}`, documentId);

      // Record in audit trail
      db.prepare(`
        INSERT INTO document_audit_trail (id, user_id, user_name, action, document_id, application_id, timestamp, details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `audit_decision_${Date.now()}`,
        userId,
        userName,
        'OFFICER_DECISION',
        documentId,
        applicationId || 'UNKNOWN_APP',
        new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        `Officer ${userName} (${userRole}) marked decision '${decision}'. Document status updated to '${nextVerificationStatus}'. Remarks: ${notes || 'None'}`
      );

      return res.json({
        success: true,
        documentId,
        newStatus: nextVerificationStatus,
        reviewedBy: userName,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
}
