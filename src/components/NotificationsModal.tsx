import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  BellRing,
  Calendar,
  CreditCard,
  CheckSquare,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { AppNotification, LoanItem, ChecklistTask, CalendarEvent } from '../types';
import type { FeatureTab } from './HamburgerDrawer';
import {
  getPushSettings,
  savePushSettings,
  getNotificationPermissionState,
  requestPushNotificationPermission,
  triggerInstantSummaryPush,
  type PushNotificationSettings,
} from '../services/pushNotifications';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  loans?: LoanItem[];
  tasks?: ChecklistTask[];
  events?: CalendarEvent[];
  onNavigate?: (tab: FeatureTab) => void;
  isDark: boolean;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll,
  loans = [],
  tasks = [],
  events = [],
  onNavigate,
  isDark,
}) => {
  const [pushSettings, setPushSettings] = useState<PushNotificationSettings>(() =>
    getPushSettings()
  );
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(() =>
    getNotificationPermissionState()
  );
  const [pushFeedback, setPushFeedback] = useState<string | null>(null);
  const [isSendingPush, setIsSendingPush] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPushSettings(getPushSettings());
      setPermission(getNotificationPermissionState());
      setPushFeedback(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleSetting = (key: keyof PushNotificationSettings) => {
    const updated: PushNotificationSettings = {
      ...pushSettings,
      [key]: !pushSettings[key],
    };
    setPushSettings(updated);
    savePushSettings(updated);
  };

  const handleEnableBrowserPermission = async () => {
    const perm = await requestPushNotificationPermission();
    setPermission(perm);
    if (perm === 'granted') {
      const updated = { ...pushSettings, enabled: true };
      setPushSettings(updated);
      savePushSettings(updated);
      setPushFeedback('Push notifications enabled for Ravi’s Assistant!');
      setTimeout(() => setPushFeedback(null), 3500);
    } else if (perm === 'denied') {
      setPushFeedback('Browser blocked notifications. Enable them in browser site settings.');
    }
  };

  const handleSendPushNow = async () => {
    setIsSendingPush(true);
    setPushFeedback(null);
    try {
      const res = await triggerInstantSummaryPush({ loans, tasks, events });
      setPermission(res.permission);
      if (res.permission !== 'granted') {
        setPushFeedback('Please allow browser notification permission when prompted.');
      } else {
        setPushFeedback(
          `Dispatched ${res.sentCount} live push notification${res.sentCount === 1 ? '' : 's'} (EMI, Keep To-Do & Calendar)!`
        );
        setTimeout(() => setPushFeedback(null), 4000);
      }
    } finally {
      setIsSendingPush(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className={`w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-3.5 border ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-500">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight leading-none">
                Push Alerts &amp; Reminders
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Ravi’s Assistant • EMI Due, Keep To-Do &amp; Calendar
              </p>
            </div>
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

        {/* PWA Push Notification Configuration Box */}
        <div
          className={`p-3 rounded-2xl border space-y-2.5 ${
            isDark
              ? 'bg-slate-950/70 border-slate-800'
              : 'bg-slate-50 border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-bold">Device Push Notifications</span>
            </div>

            {permission === 'granted' ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                <span>Push Active</span>
              </span>
            ) : (
              <button
                onClick={handleEnableBrowserPermission}
                className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer shadow-2xs"
              >
                Enable Push Alerts
              </button>
            )}
          </div>

          {/* 3 Push Channels: EMI Due, Keep To-Do, Calendar */}
          <div className="grid grid-cols-3 gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={() => handleToggleSetting('emiDueAlerts')}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                pushSettings.emiDueAlerts
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-300'
                  : 'opacity-50 border-slate-300 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <CreditCard className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-[9px] font-mono font-bold uppercase">
                  {pushSettings.emiDueAlerts ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-[10px] font-bold mt-1 truncate">EMI Due</p>
            </button>

            <button
              type="button"
              onClick={() => handleToggleSetting('keepToDoAlerts')}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                pushSettings.keepToDoAlerts
                  ? 'bg-purple-500/10 border-purple-500/40 text-purple-700 dark:text-purple-300'
                  : 'opacity-50 border-slate-300 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <CheckSquare className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-[9px] font-mono font-bold uppercase">
                  {pushSettings.keepToDoAlerts ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-[10px] font-bold mt-1 truncate">Keep To-Do</p>
            </button>

            <button
              type="button"
              onClick={() => handleToggleSetting('calendarAlerts')}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                pushSettings.calendarAlerts
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                  : 'opacity-50 border-slate-300 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[9px] font-mono font-bold uppercase">
                  {pushSettings.calendarAlerts ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-[10px] font-bold mt-1 truncate">Calendar</p>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSendPushNow}
            disabled={isSendingPush}
            className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#2E4A62] to-emerald-700 hover:from-[#253c50] hover:to-emerald-600 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3 h-3" />
            <span>
              {isSendingPush
                ? 'Dispatching Push...'
                : 'Send Live Push Alert Now (EMI • To-Do • Calendar)'}
            </span>
          </button>

          {pushFeedback && (
            <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-0.5">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{pushFeedback}</span>
            </div>
          )}
        </div>

        {/* Short, clear alerts in small compact boxes */}
        <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
          {notifications.map((n) => {
            const badgeBg =
              n.type === 'exam'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : n.type === 'loan'
                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                : n.type === 'todo'
                ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30'
                : n.type === 'sip'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';

            return (
              <div
                key={n.id}
                onClick={() => {
                  onMarkAsRead(n.id);
                  if (n.targetTab && onNavigate) {
                    onNavigate(n.targetTab);
                    onClose();
                  }
                }}
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
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${badgeBg}`}
                    >
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
