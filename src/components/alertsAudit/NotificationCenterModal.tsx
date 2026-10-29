import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  ExternalLink 
} from 'lucide-react';
import type { InAppNotification } from '../../types/alertsAudit';

interface NotificationCenterModalProps {
  notifications: InAppNotification[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigateToTarget: (targetUrl: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  notifications,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onNavigateToTarget,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] text-xs">
        {/* Header */}
        <div className="p-4 bg-[#102B4E] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 rounded-xl text-blue-300">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Regulatory Notification Center</h3>
              <p className="text-[11px] text-blue-200">
                {unreadCount} unread alert notice{unreadCount === 1 ? '' : 's'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-semibold">
            Recent System Dispatches
          </span>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark All as Read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100 space-y-2">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <span>No notifications in your queue.</span>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-xl transition-all ${
                  notif.isRead
                    ? 'bg-white hover:bg-slate-50 text-slate-700'
                    : 'bg-blue-50/60 border border-blue-200 text-slate-900 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-bold text-xs">{notif.title}</div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {notif.createdAt.split('T')[0]}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    notif.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {notif.severity}
                  </span>

                  <div className="flex items-center gap-2">
                    {!notif.isRead && (
                      <button
                        type="button"
                        onClick={() => onMarkRead(notif.id)}
                        className="text-[10px] text-slate-500 hover:text-slate-800"
                      >
                        Mark read
                      </button>
                    )}

                    {notif.linkTarget && (
                      <button
                        type="button"
                        onClick={() => {
                          onMarkRead(notif.id);
                          onNavigateToTarget(notif.linkTarget!);
                          onClose();
                        }}
                        className="px-2 py-1 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-[10px] flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> View
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
