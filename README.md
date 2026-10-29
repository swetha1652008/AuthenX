# AuthenX — AI-Powered Application Validation & Document Authentication Platform

> **AICTE Problem Statement:** AI-Powered Application Validation, Document Authentication and Regulatory Compliance Verification.

AuthenX is a high-assurance, multi-tenant statutory compliance and document authentication platform built for technical education regulatory workflows (AICTE Approval Process Handbook). It pairs real browser-based document text extraction and optical matrix scanning with server-side AI reasoning (Google Gemini) and cryptographic verification to detect discrepancies, tampering markers, and fraudulent submissions.

---

## 🌟 Key Architecture & Capabilities

### 1. Real Document Processing & Optical Matrix Scanning
- **Vector PDF Text Extraction**: Uses `pdfjs-dist` to extract structured digital text streams directly from PDF pages without third-party data leakage.
- **Scanned Document OCR**: Seamless fallback to `tesseract.js` for scanned or low-resolution paper certificates.
- **Optical 2D QR Decoding**: Client-side rasterization and `jsQR` matrix scanning of embedded QR barcodes, cross-matched against an authoritative statutory domain whitelist (`*.gov.in`, `*.nic.in`, `facilities.aicte-india.org`). Non-statutory files (e.g. general lecture notes or slides) are flagged as inconclusive rather than falsely trusted.

### 2. Multi-Tier Forensic Verification
- **Digital Tampering Detection**: Metadata inspection of PDF `/Producer` and `/Creator` headers to flag unauthorized raster editors (*Adobe Photoshop*, *GIMP*, *Canva*) vs official government spoolers.
- **Cryptographic Duplicate Detection**: Real-time SHA-256 byte hashing to detect duplicate uploads across institutions and prevent application cloning.
- **PKI & Digital Signature Validation**: Verification of embedded PKCS#7 detached digital signatures and DSC issuer certificate chains.

### 3. Institutional Multi-Tenant Isolation
- Strict partition between registered applicant institutions:
  - **Apex Institute of Technology & Science** (PID: `1-938210941`)
  - **NIEAR Mysuru** (PID: `1-482019382`)
- Access control enforced on both frontend routes and backend Express API endpoints (`x-institution-id` boundary).

### 4. 15 Comprehensive Pages & Role-Based Navigation
- **Institution Administrator**: Statutory Documents Vault, Application Wizard, AI Validation Findings, Rectification Queue, Guidelines & Self-Audit.
- **Compliance Officer**: Priority Review Workload Queue, Field Comparison Ledger, Human Review Workspace, Issuing Authority Verification Gateway, Audit Trail.
- **System Administrator**: Regulatory Rule Engine Editor, Identity & Access Matrix, Security Audit Explorer.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/swetha1652008/AuthenX.git
cd AuthenX
npm install
```

### 2. Local Development Server
Start the development server with live backend API middleware:
```bash
npm run dev
```
Open your browser and navigate to:
```
http://127.0.0.1:5173/
```
*(On Windows, you can also launch the platform by double-clicking `start.bat`).*

### 3. Build for Production
To create an optimized production build:
```bash
npm run build
```

---

## 🧪 Automated Verification & Test Suite

AuthenX includes an end-to-end automated testing suite verifying OCR accuracy, tenant isolation, tampering detection, and authority lookups:

```bash
# Run the complete 30-case verification audit
node scratch/run_tests.mjs

# Run the QR matrix and reference registry tests
node scratch/test_qr_and_reference_verification.mjs

# Run the contentless / unidentifiable document test
node scratch/test_empty_or_contentless_pdf.mjs
```

---

## 🔐 Truthful Regulatory Status Standard

AuthenX adheres strictly to the rule that **absence of an error is not proof of authenticity**:

| Status | Regulatory Condition |
| :--- | :--- |
| **Processing Failed** | Unreadable, corrupt, or password-protected document. |
| **Needs Manual Review** | Critical anomaly detected (PID mismatch, unidentifiable certificate, entity mismatch, or Photoshop markers). |
| **Warning** | Minor discrepancy (e.g. approaching expiry within 30 days). |
| **Checks Passed** | Internal consistency, format, date, and category checks succeeded. |
| **Authority Verification Pending** | Local checks passed, awaiting confirmation from external government portal or state registry. |
| **Officially Verified** | Confirmed through an authorized issuing authority integration or approved by an authorized compliance officer with an immutable audit log. |

---

## 👥 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Institution Administrator** | `admin@apex.edu.in` | Any 6+ characters |
| **Compliance Officer** | `officer@aicte.gov.in` | Any 6+ characters |
| **System Administrator** | `sysadmin@aicte.gov.in` | Any 6+ characters |

---

## 📄 License
This project is developed for the AICTE National Initiative on AI-Powered Application Validation and Document Authentication. All rights reserved.
