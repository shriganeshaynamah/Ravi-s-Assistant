import type { LoanItem, ChecklistTask, CalendarEvent, AppNotification } from '../types';

export interface PushNotificationSettings {
  enabled: boolean;
  emiDueAlerts: boolean;
  keepToDoAlerts: boolean;
  calendarAlerts: boolean;
  emiAdvanceDays: number;
}

const PUSH_SETTINGS_KEY = 'ayurlife_push_settings_v1';
const PUSH_SENT_LOG_KEY = 'ayurlife_push_sent_log_v1';

export const defaultPushSettings: PushNotificationSettings = {
  enabled: true,
  emiDueAlerts: true,
  keepToDoAlerts: true,
  calendarAlerts: true,
  emiAdvanceDays: 5,
};

export function getPushSettings(): PushNotificationSettings {
  try {
    const raw = localStorage.getItem(PUSH_SETTINGS_KEY);
    if (!raw) return defaultPushSettings;
    return { ...defaultPushSettings, ...JSON.parse(raw) };
  } catch {
    return defaultPushSettings;
  }
}

export function savePushSettings(settings: PushNotificationSettings): void {
  try {
    localStorage.setItem(PUSH_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save push settings:', e);
  }
}

export function getNotificationPermissionState(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function ensurePushServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  try {
    const existing = await navigator.serviceWorker.getRegistration();
    if (existing) return existing;
    return await navigator.serviceWorker.register('/sw-push.js', { scope: '/' });
  } catch (err) {
    console.warn('Service worker registration note:', err);
    return null;
  }
}

export async function requestPushNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await ensurePushServiceWorker();
    }
    return permission;
  } catch (err) {
    console.warn('Notification permission request failed:', err);
    return Notification.permission;
  }
}

function hasSentPushToday(tag: string): boolean {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const raw = localStorage.getItem(PUSH_SENT_LOG_KEY);
    if (!raw) return false;
    const log: Record<string, string> = JSON.parse(raw);
    return log[tag] === todayStr;
  } catch {
    return false;
  }
}

function markPushSentToday(tag: string): void {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const raw = localStorage.getItem(PUSH_SENT_LOG_KEY);
    const log: Record<string, string> = raw ? JSON.parse(raw) : {};
    // Keep only today's entries to prevent unbounded growth
    const cleaned: Record<string, string> = {};
    for (const [k, v] of Object.entries(log)) {
      if (v === todayStr) cleaned[k] = v;
    }
    cleaned[tag] = todayStr;
    localStorage.setItem(PUSH_SENT_LOG_KEY, JSON.stringify(cleaned));
  } catch {
    // ignore
  }
}

export async function sendDevicePushNotification(
  title: string,
  options: {
    body: string;
    tag?: string;
    tab?: 'loans' | 'keeptodo' | 'calendar' | 'expense' | 'roadmap' | 'home';
    requireInteraction?: boolean;
    force?: boolean;
  }
): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  const settings = getPushSettings();
  if (!settings.enabled && !options.force) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  const tag = options.tag || `ravi-assistant-${Date.now()}`;
  if (!options.force && hasSentPushToday(tag)) {
    return false;
  }

  const notifOptions: NotificationOptions & { vibrate?: number[]; actions?: any[] } = {
    body: options.body,
    icon: '/logo.png',
    badge: '/pwa-192x192.png',
    tag,
    vibrate: [200, 100, 200],
    requireInteraction: Boolean(options.requireInteraction),
    data: {
      tab: options.tab || 'home',
      url: options.tab ? `/?tab=${options.tab}` : '/',
    },
  };

  try {
    const reg = await ensurePushServiceWorker();
    if (reg && 'showNotification' in reg) {
      await reg.showNotification(title, notifOptions);
      markPushSentToday(tag);
      return true;
    }
  } catch {
    // Fallback to standard Notification constructor
  }

  try {
    const n = new Notification(title, notifOptions);
    n.onclick = () => {
      window.focus();
      if (options.tab) {
        window.dispatchEvent(new CustomEvent('ravi_navigate_tab', { detail: options.tab }));
      }
      n.close();
    };
    markPushSentToday(tag);
    return true;
  } catch (err) {
    console.warn('Notification error:', err);
    return false;
  }
}

/**
 * Evaluates active Loans (EMI due), Keep To-Do tasks, and Calendar Events.
 * Returns generated in-app notifications and dispatches OS/browser push notifications.
 */
export async function evaluateAndDispatchSmartNotifications(params: {
  loans: LoanItem[];
  tasks: ChecklistTask[];
  events: CalendarEvent[];
  existingNotifications: AppNotification[];
  forcePush?: boolean;
}): Promise<AppNotification[]> {
  const { loans, tasks, events, existingNotifications, forcePush = false } = params;
  const settings = getPushSettings();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed
  const currentDay = now.getDate();
  const currentMonthPrefix = todayStr.slice(0, 7); // YYYY-MM

  const generatedAlerts: AppNotification[] = [];

  // 1. LOAN EMI DUE NOTIFICATIONS
  if (settings.emiDueAlerts) {
    for (const loan of loans) {
      const remaining = Math.max(0, loan.principalAmount - loan.totalPaid);
      if (loan.status === 'full_paid' || remaining <= 0) continue;

      // Check if already paid in the current month
      const paidThisMonth = (loan.paymentHistory || []).some((p) =>
        p.date && p.date.startsWith(currentMonthPrefix)
      );
      if (paidThisMonth && !forcePush) continue;

      const dueDay = loan.dueDateDay || 5;
      const daysUntilDue = dueDay - currentDay;

      // Notify if due within advance window (e.g. 5 days before) or due today or overdue by up to 5 days
      if (daysUntilDue <= settings.emiAdvanceDays && daysUntilDue >= -5) {
        const emiDisplay =
          loan.monthlyEmi > 0
            ? `₹${loan.monthlyEmi.toLocaleString('en-IN')}`
            : `₹${remaining.toLocaleString('en-IN')} balance`;

        const statusLabel =
          daysUntilDue === 0
            ? 'DUE TODAY'
            : daysUntilDue > 0
            ? `Due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'} (${dueDay}th)`
            : `Overdue (${dueDay}th of month)`;

        const notifId = `emi-due-${loan.id}-${currentMonthPrefix}`;
        const title = `💳 EMI Due: ${loan.title}`;
        const message = `${emiDisplay} for ${loan.lender} is ${statusLabel}. Remaining balance: ₹${remaining.toLocaleString('en-IN')}.`;

        generatedAlerts.push({
          id: notifId,
          title,
          message,
          type: 'loan',
          badge: daysUntilDue <= 0 ? 'EMI Due Now' : 'Upcoming EMI',
          date: todayStr,
          isRead: false,
          targetTab: 'loans',
        });

        await sendDevicePushNotification(title, {
          body: message,
          tag: notifId,
          tab: 'loans',
          requireInteraction: daysUntilDue <= 0,
          force: forcePush,
        });
      }
    }
  }

  // 2. KEEP TO-DO & DAILY WORK NOTIFICATIONS
  if (settings.keepToDoAlerts) {
    const pendingTasks = tasks.filter((t) => !t.isCompleted);
    const dueOrUrgentTasks = pendingTasks.filter((t) => {
      if (t.dueDate && t.dueDate <= todayStr) return true;
      if (t.isDaily) return true;
      if (t.isPinned && (t.priority === 'urgent' || t.priority === 'high')) return true;
      return false;
    });

    for (const task of dueOrUrgentTasks.slice(0, 5)) {
      const isOverdue = Boolean(task.dueDate && task.dueDate < todayStr);
      const notifId = `todo-due-${task.id}-${todayStr}`;
      const title = `✅ Keep To-Do: ${task.text}`;
      const message = `${
        isOverdue ? `Overdue (${task.dueDate})` : 'Due Today'
      } • Priority: ${task.priority.toUpperCase()}${task.isPinned ? ' 📌' : ''}`;

      generatedAlerts.push({
        id: notifId,
        title,
        message,
        type: 'todo',
        badge: isOverdue ? 'Overdue Task' : 'Keep To-Do',
        date: task.dueDate || todayStr,
        isRead: false,
        targetTab: 'keeptodo',
      });

      await sendDevicePushNotification(title, {
        body: message,
        tag: notifId,
        tab: 'keeptodo',
        force: forcePush,
      });
    }
  }

  // 3. CALENDAR & CLINICAL EVENT NOTIFICATIONS
  if (settings.calendarAlerts) {
    for (const evt of events) {
      const evtDateStr = evt.startDate.slice(0, 10);
      const evtTimeMs = new Date(evt.startDate).getTime();
      const diffHours = (evtTimeMs - now.getTime()) / (1000 * 60 * 60);

      // Alert if event is today or within the next 24 hours
      if (evtDateStr === todayStr || (diffHours >= -2 && diffHours <= 24)) {
        const notifId = `cal-evt-${evt.id}-${todayStr}`;
        const timePart = evt.startDate.includes('T') ? evt.startDate.slice(11, 16) : 'All Day';
        const title = `📅 Calendar: ${evt.title}`;
        const message = `${evtDateStr === todayStr ? 'Today' : evtDateStr} at ${timePart}${
          evt.location ? ` • ${evt.location}` : ''
        }`;

        generatedAlerts.push({
          id: notifId,
          title,
          message,
          type: 'event',
          badge: 'Calendar Alert',
          date: evtDateStr,
          isRead: false,
          targetTab: 'calendar',
        });

        await sendDevicePushNotification(title, {
          body: message,
          tag: notifId,
          tab: 'calendar',
          force: forcePush,
        });
      }
    }
  }

  // Merge generated alerts with existing notifications while preserving read state
  const existingMap = new Map<string, AppNotification>();
  for (const n of existingNotifications) {
    existingMap.set(n.id, n);
  }

  const merged: AppNotification[] = [...existingNotifications];
  for (const alert of generatedAlerts) {
    if (!existingMap.has(alert.id)) {
      merged.unshift(alert);
      existingMap.set(alert.id, alert);
    }
  }

  return merged.slice(0, 40);
}

/**
 * Triggers an immediate summary push notification across EMI Due, Keep To-Do, and Calendar
 * when the user clicks "Test / Send Push Alert Now"
 */
export async function triggerInstantSummaryPush(params: {
  loans: LoanItem[];
  tasks: ChecklistTask[];
  events: CalendarEvent[];
}): Promise<{ sentCount: number; permission: NotificationPermission | 'unsupported' }> {
  const permission = await requestPushNotificationPermission();
  if (permission !== 'granted') {
    return { sentCount: 0, permission };
  }

  const { loans, tasks, events } = params;
  const todayStr = new Date().toISOString().split('T')[0];
  let sentCount = 0;

  // 1. Active Loan EMI summary
  const activeLoans = loans.filter(
    (l) => l.status !== 'full_paid' && l.principalAmount - l.totalPaid > 0
  );
  if (activeLoans.length > 0) {
    const firstLoan = activeLoans[0];
    const rem = Math.max(0, firstLoan.principalAmount - firstLoan.totalPaid);
    const emiStr =
      firstLoan.monthlyEmi > 0
        ? `₹${firstLoan.monthlyEmi.toLocaleString('en-IN')}/mo`
        : `₹${rem.toLocaleString('en-IN')} remaining`;
    const ok = await sendDevicePushNotification(
      `💳 Loan EMI Alert: ${firstLoan.title}`,
      {
        body: `${emiStr} (${firstLoan.lender}) • Due day: ${firstLoan.dueDateDay || 5}th of month. (${activeLoans.length} active loan${activeLoans.length > 1 ? 's' : ''})`,
        tag: `instant-emi-${Date.now()}`,
        tab: 'loans',
        force: true,
      }
    );
    if (ok) sentCount++;
  }

  // 2. Pending Keep To-Do summary
  const pendingTasks = tasks.filter((t) => !t.isCompleted);
  if (pendingTasks.length > 0) {
    const topTask = pendingTasks.find((t) => t.isPinned) || pendingTasks[0];
    const ok = await sendDevicePushNotification(
      `✅ Keep To-Do (${pendingTasks.length} Pending)`,
      {
        body: `Next task: "${topTask.text}" • Due: ${topTask.dueDate || todayStr}`,
        tag: `instant-todo-${Date.now()}`,
        tab: 'keeptodo',
        force: true,
      }
    );
    if (ok) sentCount++;
  }

  // 3. Upcoming Calendar Event summary
  const upcomingEvents = events.filter((e) => e.startDate.slice(0, 10) >= todayStr);
  if (upcomingEvents.length > 0) {
    const nextEvt = upcomingEvents[0];
    const ok = await sendDevicePushNotification(
      `📅 Calendar Reminder: ${nextEvt.title}`,
      {
        body: `Scheduled for ${nextEvt.startDate.replace('T', ' ')}${
          nextEvt.location ? ` at ${nextEvt.location}` : ''
        }`,
        tag: `instant-cal-${Date.now()}`,
        tab: 'calendar',
        force: true,
      }
    );
    if (ok) sentCount++;
  }

  // Fallback confirmation push if all 3 lists are empty
  if (sentCount === 0) {
    const ok = await sendDevicePushNotification(
      '🔔 Ravi’s Assistant Push Active',
      {
        body: 'Push notifications are enabled for Loan EMI Due, Keep To-Do tasks, and Calendar events!',
        tag: `instant-test-${Date.now()}`,
        tab: 'home',
        force: true,
      }
    );
    if (ok) sentCount++;
  }

  return { sentCount, permission };
}
