import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Bell, 
  History, 
  RefreshCw 
} from 'lucide-react';

import { authService } from '../services/authService';
import { alertsAuditService } from '../services/alertsAuditService';
import type { UserAccount } from '../types/auth';
import type { 
  SystemAlert, 
  CentralAuditLog, 
  InAppNotification, 
  AlertStatus 
} from '../types/alertsAudit';

import { PortalSidebar, type PortalSection } from '../components/portal/PortalSidebar';
import { PortalHeader } from '../components/portal/PortalHeader';
import { RoleUnauthorizedState } from '../components/portal/RoleUnauthorizedState';

import { AlertsDashboardCards } from '../components/alertsAudit/AlertsDashboardCards';
import { AlertsMasterTable } from '../components/alertsAudit/AlertsMasterTable';
import { AlertDetailsModal } from '../components/alertsAudit/AlertDetailsModal';
import { CentralAuditTrailTable } from '../components/alertsAudit/CentralAuditTrailTable';
import { NotificationCenterModal } from '../components/alertsAudit/NotificationCenterModal';

export const AlertsAuditPage: React.FC = () => {
  const navigate = useNavigate();
  const { alertId } = useParams<{ alertId?: string }>();

  // Current User
  const [currentUser] = useState<UserAccount | null>(() => authService.getCurrentUser());

  // Layout State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mainView, setMainView] = useState<'ALERTS' | 'AUDIT_TRAIL'>('ALERTS');
  const [activeKpiFilter, setActiveKpiFilter] = useState<string>('ACTIVE');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data State
  const [alerts, setAlerts] = useState<SystemAlert[]>(() => alertsAuditService.getAlerts());
  const [auditLogs, setAuditLogs] = useState<CentralAuditLog[]>(() => alertsAuditService.getAuditLogs());
  const [notifications, setNotifications] = useState<InAppNotification[]>(() => alertsAuditService.getNotifications());
  const [counts, setCounts] = useState(() => alertsAuditService.getDashboardCounts());

  // Active Modals
  const [selectedAlert, setSelectedAlert] = useState<SystemAlert | null>(() =>
    alertId ? alertsAuditService.getAlertById(alertId) || null : null
  );
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Synchronize with URL alertId param
  useEffect(() => {
    if (alertId && selectedAlert?.id !== alertId) {
      const match = alertsAuditService.getAlertById(alertId);
      if (match) {
        const timer = setTimeout(() => setSelectedAlert(match), 0);
        return () => clearTimeout(timer);
      }
    }
  }, [alertId, selectedAlert?.id]);

  // Refresh Live Data
  const refreshData = () => {
    const updatedAlerts = alertsAuditService.getAlerts();
    const updatedLogs = alertsAuditService.getAuditLogs();
    const updatedNotifs = alertsAuditService.getNotifications();
    const updatedCounts = alertsAuditService.getDashboardCounts();
    setAlerts(updatedAlerts);
    setAuditLogs(updatedLogs);
    setNotifications(updatedNotifs);
    setCounts(updatedCounts);

    if (selectedAlert) {
      const refreshedSelected = updatedAlerts.find((a) => a.id === selectedAlert.id);
      if (refreshedSelected) setSelectedAlert(refreshedSelected);
    }
  };

  // Role Access Check
  const isAuthorized =
    currentUser?.authorizedRole === 'COMPLIANCE_OFFICER' ||
    currentUser?.authorizedRole === 'DOCUMENT_VERIFICATION_OFFICER' ||
    currentUser?.authorizedRole === 'REGULATORY_ADMIN' ||
    currentUser?.authorizedRole === 'INSTITUTION_ADMIN' ||
    !currentUser;

  if (!isAuthorized) {
    return (
      <RoleUnauthorizedState
        user={currentUser}
        onLogout={() => {
          authService.logout();
          navigate('/login');
        }}
      />
    );
  }

  // Sidebar navigation handler
  const handleSelectSidebarSection = (section: PortalSection) => {
    const isOfficer = currentUser?.authorizedRole !== 'INSTITUTION_ADMIN';
    if (section === 'overview') {
      if (isOfficer) navigate('/officer-dashboard');
      else navigate('/institution-portal');
    }
    else if (section === 'documents') navigate('/documents');
    else if (section === 'validation') navigate('/ai-validation');
    else if (section === 'anomalies') navigate('/document-authentication');
    else if (section === 'issuing-authority') navigate('/issuing-authority');
    else if (section === 'compliance') navigate('/regulatory-compliance');
    else if (section === 'officer-dashboard') navigate('/officer-dashboard');
    else if (section === 'human-review') navigate('/human-review');
    else if (section === 'alerts-audit') navigate('/alerts-audit');
    else if (section === 'reports-analytics') {
      if (isOfficer) navigate('/reports-analytics');
      else navigate('/institution-portal?tab=reports-analytics');
    }
    else if (section === 'rules-configuration') navigate('/rules-configuration');
    else if (section === 'security-access') navigate('/security-access');
    else if (section === 'final-review') navigate('/final-review');
    else if (section === 'notifications') {
      if (isOfficer) navigate('/alerts-audit');
      else navigate('/institution-portal?tab=notifications');
    }
    else if (section === 'help') {
      if (isOfficer) navigate('/rules-configuration');
      else navigate('/institution-portal?tab=help');
    }
    else if (section === 'settings') {
      if (isOfficer) navigate('/security-access');
      else navigate('/institution-portal?tab=settings');
    }
    else navigate(isOfficer ? '/officer-dashboard' : '/institution-portal');
  };

  // Alert Actions
  const handleUpdateStatus = (id: string, newStatus: AlertStatus, reason?: string) => {
    const actorName = currentUser?.name || 'Authorized Officer';
    const role = currentUser?.authorizedRole || 'COMPLIANCE_OFFICER';
    alertsAuditService.updateAlertStatus(id, newStatus, actorName, role, reason);
    refreshData();
    showToast(`Alert [${id}] status changed to ${newStatus}.`);
  };

  const handleAssignOfficer = (id: string, officerName: string) => {
    const assignerName = currentUser?.name || 'Authorized Officer';
    alertsAuditService.assignAlert(id, officerName, assignerName);
    refreshData();
    showToast(`Alert [${id}] assigned to ${officerName}.`);
  };

  const handleAddComment = (id: string, comment: string) => {
    const actorName = currentUser?.name || 'Authorized Officer';
    const role = currentUser?.authorizedRole || 'COMPLIANCE_OFFICER';
    alertsAuditService.addAlertComment(id, comment, actorName, role);
    refreshData();
    showToast('Investigation comment appended to alert audit history.');
  };

  // Deep Link Navigation Handler
  const handleNavigateToModule = (section: string, param?: string) => {
    if (section === 'authentication') navigate(`/document-authentication${param ? `?docId=${param}` : ''}`);
    else if (section === 'issuing-authority') navigate('/issuing-authority');
    else if (section === 'compliance') navigate(param ? `/regulatory-compliance/${param}` : '/regulatory-compliance');
    else if (section === 'human-review') navigate(param ? `/human-review/${param}` : '/human-review');
    else if (section === 'officer-dashboard') navigate('/officer-dashboard');
    else if (section === 'documents') navigate('/documents');
    else navigate('/institution-portal');
  };

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#102B4E] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-white/20 animate-fade-in flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Global Sidebar */}
      <PortalSidebar
        activeSection="alerts-audit"
        onSelectSection={handleSelectSidebarSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <PortalHeader
          user={currentUser}
          onLogout={() => {
            authService.logout();
            navigate('/login');
          }}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeSectionTitle="Alerts & Audit Trail"
        />

        {/* Scrollable Page Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          {/* Header Title Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100/70 border border-rose-200 px-2.5 py-0.5 rounded-full">
                  Regulatory Oversight Directorate
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  Real-Time Incident Feeds & Cryptographic Audit Trails
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#102B4E] tracking-tight">
                Alerts & Regulatory Audit Trail
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Centralized monitoring of document tampering anomalies, issuing authority mismatches, regulatory cadre deficits, and immutable append-only compliance logs.
              </p>
            </div>

            {/* Quick Actions / Tab Switcher */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              {/* Notification Bell Badge Button */}
              <button
                type="button"
                onClick={() => setShowNotificationsModal(true)}
                className="relative p-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:text-[#2563EB] hover:border-[#2563EB] shadow-sm transition-colors"
                title="Open In-App Notification Center"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setMainView('ALERTS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    mainView === 'ALERTS'
                      ? 'bg-white text-[#102B4E] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" /> Active Alerts ({alerts.filter((a) => a.status !== 'RESOLVED' && a.status !== 'CLOSED').length})
                </button>
                <button
                  type="button"
                  onClick={() => setMainView('AUDIT_TRAIL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    mainView === 'AUDIT_TRAIL'
                      ? 'bg-white text-[#102B4E] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <History className="w-3.5 h-3.5" /> Central Audit Trail ({auditLogs.length})
                </button>
              </div>

              <button
                type="button"
                onClick={refreshData}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-[#2563EB] hover:border-[#2563EB] shadow-sm transition-colors"
                title="Refresh Live Feeds"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 8 KPI Dashboard Metrics Cards */}
          <AlertsDashboardCards
            counts={counts}
            activeFilter={activeKpiFilter}
            onFilterClick={(filter) => {
              setActiveKpiFilter(filter);
              setMainView('ALERTS');
            }}
          />

          {/* Main View: Alerts Master Table vs Central Audit Trail */}
          {mainView === 'ALERTS' ? (
            <AlertsMasterTable
              alerts={alerts}
              activeFilter={activeKpiFilter}
              onFilterChange={(f) => setActiveKpiFilter(f)}
              onSelectAlert={(a) => setSelectedAlert(a)}
              onUpdateStatus={handleUpdateStatus}
              onAcknowledge={(id) => handleUpdateStatus(id, 'UNDER_REVIEW', 'Acknowledged and marked under review by officer.')}
              onEscalate={(id) => handleUpdateStatus(id, 'ESCALATED', 'Escalated for senior scrutiny committee review.')}
              onResolve={(id) => handleUpdateStatus(id, 'RESOLVED', 'Resolved during quick officer assessment.')}
            />
          ) : (
            <CentralAuditTrailTable logs={auditLogs} />
          )}
        </div>
      </div>

      {/* Alert Details Modal */}
      {selectedAlert && (
        <AlertDetailsModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onNavigateToModule={handleNavigateToModule}
          onAddComment={handleAddComment}
          onUpdateStatus={handleUpdateStatus}
          onAssignOfficer={handleAssignOfficer}
        />
      )}

      {/* Notification Center Modal */}
      {showNotificationsModal && (
        <NotificationCenterModal
          notifications={notifications}
          onClose={() => setShowNotificationsModal(false)}
          onMarkRead={(id) => {
            alertsAuditService.markNotificationAsRead(id);
            refreshData();
          }}
          onMarkAllRead={() => {
            alertsAuditService.markAllNotificationsAsRead();
            refreshData();
          }}
          onNavigateToTarget={(targetUrl) => {
            setShowNotificationsModal(false);
            navigate(targetUrl);
          }}
        />
      )}
    </div>
  );
};
