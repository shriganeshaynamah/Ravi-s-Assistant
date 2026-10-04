import React from 'react';
import { X, Bell, Check, Calendar, CreditCard, Sparkles, AlertCircle } from 'lucide-react';
import type { AppNotification } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  isDark: boolean;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll,
  isDark,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 border ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold tracking-tight">Upcoming Alerts</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
              {notifications.filter((n) => !n.isRead).length} new
            </span>
          </div>

          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded cursor-pointer"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Short, clear alerts in small compact boxes */}
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {notifications.map((n) => {
            const badgeBg =
              n.type === 'exam'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : n.type === 'loan'
                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                : n.type === 'sip'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';

            return (
              <div
                key={n.id}
                onClick={() => onMarkAsRead(n.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                  n.isRead
                    ? isDark
                      ? 'bg-slate-900/60 border-slate-800/80 opacity-60'
                      : 'bg-slate-50 border-slate-200/80 opacity-70'
                    : isDark
                    ? 'bg-slate-800/90 border-slate-700 shadow-xs'
                    : 'bg-slate-50 border-slate-200 shadow-xs'
                }`}
              >
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${badgeBg}`}>
                      {n.badge || n.type}
                    </span>
                    <h4 className="text-xs font-bold truncate text-slate-900 dark:text-white">
                      {n.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                    {n.message}
                  </p>
                  <span className="text-[9px] text-slate-400 font-mono block pt-0.5">
                    {n.date}
                  </span>
                </div>

                {!n.isRead && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0 animate-pulse" />
                )}
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs">
              No new notifications or alerts.
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className={`w-full py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
};
