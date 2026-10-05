import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import {
  Cloud,
  HardDrive,
  FileSpreadsheet,
  Calendar,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  ExternalLink,
  X,
  RefreshCw,
  ShieldCheck,
  LogIn,
} from 'lucide-react';
import { uploadBackupToGoogleDrive } from '../services/googleDrive';
import { exportMultiSectionToGoogleSheets, getMasterSpreadsheetUrl } from '../services/googleSheets';
import { createGoogleCalendarEvent } from '../services/googleCalendar';
import {
  googleSignIn,
  savePermanentUserEmail,
  logout,
  USER_EMAIL_KEY,
} from '../services/firebase';
import type { CalendarEvent, ExpenseRecord } from '../types';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserChange: (user: User | null) => void;
  getAllData: () => any;
  onRestoreData: (data: any) => void;
  onFetchFromSheet?: () => Promise<boolean>;
  events: CalendarEvent[];
  expenses: ExpenseRecord[];
  onUpdateEvent: (event: CalendarEvent) => void;
  isDark?: boolean;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserChange,
  getAllData,
  onRestoreData,
  onFetchFromSheet,
  events,
  expenses,
  onUpdateEvent,
  isDark = true,
}) => {
  const [isDriveBackingUp, setIsDriveBackingUp] = useState(false);
  const [driveResult, setDriveResult] = useState<{ id: string; name: string; link?: string } | null>(
    null
  );

  const [isSheetsExporting, setIsSheetsExporting] = useState(false);
  const [isSheetsFetching, setIsSheetsFetching] = useState(false);
  const [sheetsResult, setSheetsResult] = useState<{ id: string; url: string } | null>(() => {
    const existingUrl = getMasterSpreadsheetUrl();
    return existingUrl ? { id: 'master', url: existingUrl } : null;
  });

  const [isCalendarSyncing, setIsCalendarSyncing] = useState(false);
  const [calendarSyncCount, setCalendarSyncCount] = useState<number | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState<string>(() => {
    try {
      return user?.email || localStorage.getItem(USER_EMAIL_KEY) || 'rk867000@gmail.com';
    } catch {
      return 'rk867000@gmail.com';
    }
  });

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await googleSignIn(emailInput);
      if (res?.user) {
        onUserChange(res.user);
        let sheetFetched = false;
        if (onFetchFromSheet) {
          sheetFetched = await onFetchFromSheet();
        }
        if (!sheetFetched) {
          try {
            const created = await exportMultiSectionToGoogleSheets(
              getAllData(),
              'Dr. Ravi Shankar - LifeOS Master Ledger'
            );
            setSheetsResult({ id: created.spreadsheetId, url: created.spreadsheetUrl });
          } catch {
            // ignore background init error
          }
        } else {
          const url = getMasterSpreadsheetUrl();
          if (url) setSheetsResult({ id: 'master', url });
        }
        setSuccessMessage(
          sheetFetched
            ? `Logged in as ${res.user.email} & fetched your latest Master Google Sheet data into the app! Two-way auto-save is active.`
            : `Logged in as ${res.user.email}. Your email is saved permanently and two-way Google Sheet auto-save is active!`
        );
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Google Sign-in failed');
    }
  };

  const handleSavePermanentEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const clean = emailInput.trim();
    if (!clean || !clean.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    const permUser = savePermanentUserEmail(clean);
    onUserChange(permUser);
    setSuccessMessage(
      `Email (${clean}) saved permanently! You will remain logged in automatically whenever the website or APK launches.`
    );
  };

  const handleSignOut = async () => {
    await logout();
    onUserChange(null);
    setSuccessMessage('Signed out and cleared saved email login.');
  };

  const handleDriveBackup = async () => {
    if (!user) {
      setErrorMessage('Please sign in with Google first.');
      return;
    }

    setIsDriveBackingUp(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const fullData = getAllData();
      const todayStr = new Date().toISOString().split('T')[0];
      const fileName = `Dr_Ravi_Shankar_LifeOS_Backup_${todayStr}.json`;

      const res = await uploadBackupToGoogleDrive(fileName, fullData);
      setDriveResult(res);
      setSuccessMessage('Full Life OS backup saved to your Google Drive successfully!');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to save to Google Drive');
    } finally {
      setIsDriveBackingUp(false);
    }
  };

  const handleSheetsFetch = async () => {
    if (!user) {
      setErrorMessage('Please sign in with Google first.');
      return;
    }
    if (!onFetchFromSheet) return;

    setIsSheetsFetching(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const fetched = await onFetchFromSheet();
      const url = getMasterSpreadsheetUrl();
      if (url) setSheetsResult({ id: 'master', url });
      if (fetched) {
        setSuccessMessage(
          'Fetched latest updated Master Google Sheet from Google Drive and updated all app sections!'
        );
      } else {
        setErrorMessage('No existing Master Google Sheet found in Drive yet. Click "Save to Sheet" first.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to fetch from Google Sheets');
    } finally {
      setIsSheetsFetching(false);
    }
  };

  const handleSheetsExport = async () => {
    if (!user) {
      setErrorMessage('Please sign in with Google first.');
      return;
    }

    setIsSheetsExporting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const fullData = getAllData();
      const res = await exportMultiSectionToGoogleSheets(
        fullData,
        'Dr. Ravi Shankar - LifeOS Master Ledger'
      );
      setSheetsResult({ id: res.spreadsheetId, url: res.spreadsheetUrl });
      setSuccessMessage('Master Google Sheet updated with dedicated pages for all sections & deleted rows erased!');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to export to Google Sheets');
    } finally {
      setIsSheetsExporting(false);
    }
  };

  const handleCalendarSyncAll = async () => {
    if (!user) {
      setErrorMessage('Please sign in with Google first.');
      return;
    }

    setIsCalendarSyncing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      let count = 0;
      for (const evt of events) {
        if (!evt.syncedToGoogle) {
          try {
            const gEvt = await createGoogleCalendarEvent(evt);
            onUpdateEvent({
              ...evt,
              googleCalendarEventId: gEvt.id,
              syncedToGoogle: true,
            });
            count++;
          } catch (e) {
            console.warn(`Failed to sync event ${evt.title}:`, e);
          }
        }
      }
      setCalendarSyncCount(count);
      setSuccessMessage(
        count > 0
          ? `Successfully synced ${count} new events to Google Calendar!`
          : 'All active events are already synced to your Google Calendar.'
      );
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to sync to Google Calendar');
    } finally {
      setIsCalendarSyncing(false);
    }
  };

  const handleExportLocalJson = () => {
    const data = getAllData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dr_Ravi_Shankar_LifeOS_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportLocalJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onRestoreData(parsed);
        setSuccessMessage('Data successfully restored from backup JSON file!');
      } catch (err) {
        setErrorMessage('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className={`border rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6 ${
        isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Google Cloud Sync &amp; Backup Central
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Synchronize Dr. Ravi Shankar's Life OS to Google Drive, Google Sheets &amp; Google Calendar.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice feedback */}
        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google Account & Permanent Email Login Status */}
        <div
          className={`p-4 rounded-2xl border space-y-3 ${
            isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {user ? (user.displayName || user.email || 'R')[0].toUpperCase() : 'G'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {user ? user.displayName || user.email : 'Account Not Connected'}
                  </p>
                  {user?.email && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Saved Permanently ({user.email})</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {user
                    ? 'Permanently logged in across Website, Vercel & Android APK launches'
                    : 'Login once with your email or Google account to stay permanently signed in'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSignIn}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{user ? 'Reconnect Google OAuth' : 'Sign in with Google'}</span>
              </button>
              {user && (
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold text-xs cursor-pointer"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>

          {/* Direct Permanent Email Login Bar (Ideal for Vercel & Converted APK) */}
          <form
            onSubmit={handleSavePermanentEmail}
            className="pt-2.5 border-t border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
          >
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter email to save permanently (e.g. rk867000@gmail.com)"
              className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs cursor-pointer shrink-0"
            >
              Save Email Permanently
            </button>
          </form>
        </div>

        {/* Sync Actions Grid */}
        <div className="space-y-3.5">
          {/* Item 1: Google Drive */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 mt-0.5">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Save Full Backup to Google Drive</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Archives all notes, roadmaps, patient appointments, and financial records into a secure JSON file in your Google Drive.
                </p>
                {driveResult && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 font-bold">
                    ✓ Saved: {driveResult.name}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleDriveBackup}
              disabled={isDriveBackingUp}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-blue-950/20 cursor-pointer"
            >
              <Cloud className={`w-3.5 h-3.5 ${isDriveBackingUp ? 'animate-spin' : ''}`} />
              <span>{isDriveBackingUp ? 'Backing Up...' : 'Backup to Drive'}</span>
            </button>
          </div>

          {/* Item 2: Google Sheets (2-Way Auto-Sync) */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mt-0.5">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    2-Way Master Google Sheet Sync
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Live Auto-Save Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Automatically saves every change made in the app to your same Master Google Sheet, and fetches updated sheet data into the app when you log in or click Fetch.
                </p>
                {sheetsResult && (
                  <a
                    href={sheetsResult.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline mt-1"
                  >
                    <span>Open Master Sheet in Google Sheets</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onFetchFromSheet && (
                <button
                  onClick={handleSheetsFetch}
                  disabled={isSheetsFetching}
                  className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-950/20 cursor-pointer"
                  title="Fetch latest data from your Google Sheet into the app"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSheetsFetching ? 'animate-spin' : ''}`} />
                  <span>{isSheetsFetching ? 'Fetching...' : 'Fetch Sheet'}</span>
                </button>
              )}
              <button
                onClick={handleSheetsExport}
                disabled={isSheetsExporting}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/20 cursor-pointer"
                title="Save all current app data into the same Master Google Sheet"
              >
                <FileSpreadsheet className={`w-3.5 h-3.5 ${isSheetsExporting ? 'animate-spin' : ''}`} />
                <span>{isSheetsExporting ? 'Saving...' : 'Save to Sheet'}</span>
              </button>
            </div>
          </div>

          {/* Item 3: Google Calendar */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 mt-0.5">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sync Upcoming Events to Google Calendar</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Pushes all unsynced OPD consultations, study sessions and reminders to your primary Google Calendar.
                </p>
              </div>
            </div>

            <button
              onClick={handleCalendarSyncAll}
              disabled={isCalendarSyncing}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-amber-950/20 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCalendarSyncing ? 'animate-spin' : ''}`} />
              <span>{isCalendarSyncing ? 'Syncing...' : 'Sync All to Calendar'}</span>
            </button>
          </div>
        </div>

        {/* Offline Local Backup / Restore */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
            Offline Local Backup &amp; Portability (JSON)
          </h4>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleExportLocalJson}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Download Local JSON Backup</span>
            </button>

            <label className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Restore from JSON File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportLocalJson}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
