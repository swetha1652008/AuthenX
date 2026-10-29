import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { InstitutionPortalPage } from './pages/InstitutionPortalPage';
import { DocumentManagementPage } from './pages/DocumentManagementPage';
import { AIDocumentValidationPage } from './pages/AIDocumentValidationPage';
import { DocumentAuthenticationPage } from './pages/DocumentAuthenticationPage';
import { IssuingAuthorityPage } from './pages/IssuingAuthorityPage';
import { RegulatoryCompliancePage } from './pages/RegulatoryCompliancePage';
import { OfficerDashboardPage } from './pages/OfficerDashboardPage';
import { HumanReviewPage } from './pages/HumanReviewPage';
import { AlertsAuditPage } from './pages/AlertsAuditPage';
import { ReportsAnalyticsPage } from './pages/ReportsAnalyticsPage';

import { RegulatoryRulesPage } from './pages/RegulatoryRulesPage';
import { SecurityAccessPage } from './pages/SecurityAccessPage';
import { FinalReviewPage } from './pages/FinalReviewPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/institution-portal" element={<InstitutionPortalPage />} />
        <Route path="/documents" element={<DocumentManagementPage />} />
        <Route path="/documents/:appId" element={<DocumentManagementPage />} />
        <Route path="/ai-validation" element={<AIDocumentValidationPage />} />
        <Route path="/ai-validation/:appId" element={<AIDocumentValidationPage />} />
        <Route path="/validation" element={<AIDocumentValidationPage />} />
        <Route path="/anomaly-detection" element={<DocumentAuthenticationPage />} />
        <Route path="/anomaly-detection/:appId" element={<DocumentAuthenticationPage />} />
        <Route path="/document-authentication" element={<DocumentAuthenticationPage />} />
        <Route path="/document-authentication/:appId" element={<DocumentAuthenticationPage />} />
        <Route path="/issuing-authority" element={<IssuingAuthorityPage />} />
        <Route path="/issuing-authority/:appId" element={<IssuingAuthorityPage />} />
        <Route path="/regulatory-compliance" element={<RegulatoryCompliancePage />} />
        <Route path="/regulatory-compliance/:appId" element={<RegulatoryCompliancePage />} />
        <Route path="/compliance" element={<RegulatoryCompliancePage />} />
        <Route path="/compliance/:appId" element={<RegulatoryCompliancePage />} />
        <Route path="/officer-dashboard" element={<OfficerDashboardPage />} />
        <Route path="/regulatory-overview" element={<OfficerDashboardPage />} />
        <Route path="/human-review" element={<HumanReviewPage />} />
        <Route path="/human-review/:appId" element={<HumanReviewPage />} />
        <Route path="/alerts-audit" element={<AlertsAuditPage />} />
        <Route path="/alerts-audit/:alertId" element={<AlertsAuditPage />} />
        <Route path="/alerts" element={<AlertsAuditPage />} />
        <Route path="/reports-analytics" element={<ReportsAnalyticsPage />} />
        <Route path="/reports-analytics/:reportType" element={<ReportsAnalyticsPage />} />
        <Route path="/reports" element={<ReportsAnalyticsPage />} />
        <Route path="/rules-configuration" element={<RegulatoryRulesPage />} />
        <Route path="/regulatory-rules" element={<RegulatoryRulesPage />} />
        <Route path="/security-access" element={<SecurityAccessPage />} />
        <Route path="/security-management" element={<SecurityAccessPage />} />
        <Route path="/final-review" element={<FinalReviewPage />} />
        <Route path="/final-review/:appId" element={<FinalReviewPage />} />
        <Route path="/decision-support" element={<FinalReviewPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>
  );
}

export default App;
