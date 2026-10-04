import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { googleSignIn, logout, getAccessToken } from '../services/firebase';
import { Cloud, Calendar, Database, ShieldCheck, LogIn, LogOut, Sparkles, RefreshCw } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onUserChange: (user: User | null) => void;
  onOpenCloudSync: () => void;
  onQuickAction: (actionType: 'event' | 'note' | 'expense' | 'task') => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onUserChange,
  onOpenCloudSync,
  onQuickAction,
}) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDateStr, setCurrentDateStr] = useState<string>('');
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setCurrentDateStr(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res?.user) {
        onUserChange(res.user);
      }
    } catch (e) {
      console.error('Sign-in failed', e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      onUserChange(null);
    } catch (e) {
      console.error('Sign-out failed', e);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 p-0.5 shadow-lg shadow-emerald-950/40 shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950/40 rounded-[14px] flex items-center justify-center text-emerald-300 font-bold text-lg">
              ⚕️
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                Dr. Ravi Shankar
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  BAMS Doctor
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span className="text-emerald-400 font-medium">Ayurvedic Practice &amp; Personal Life OS</span>
              <span className="text-slate-600">•</span>
              <span>{currentDateStr}</span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-slate-300">{currentTime}</span>
            </p>
          </div>
        </div>

        {/* Right: Quick actions & Google Workspace connection */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Quick Add Menu */}
          <div className="relative">
            <button
              onClick={() => setQuickMenuOpen(!quickMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ Quick Add</span>
            </button>

            {quickMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-50 text-xs animate-in fade-in"
                onClick={() => setQuickMenuOpen(false)}
              >
                <button
                  onClick={() => onQuickAction('event')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Calendar Event / OPD</span>
                </button>
                <button
                  onClick={() => onQuickAction('task')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Checklist To-Do</span>
                </button>
                <button
                  onClick={() => onQuickAction('expense')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                >
                  <Database className="w-3.5 h-3.5 text-amber-400" />
                  <span>Income / Expense</span>
                </button>
                <button
                  onClick={() => onQuickAction('note')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Clinical / Life Note</span>
                </button>
              </div>
            )}
          </div>

          {/* Cloud Sync Button */}
          <button
            onClick={onOpenCloudSync}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white transition-all cursor-pointer"
            title="Google Drive Backup, Sheets Export & Calendar Sync"
          >
            <Cloud className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Google Cloud Sync</span>
            <span className="sm:hidden">Sync</span>
          </button>

          {/* Google Auth Status / Button */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Doctor'}
                  className="w-7 h-7 rounded-full border border-emerald-500/50"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">
                  {(user.displayName || user.email || 'R')[0].toUpperCase()}
                </div>
              )}
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-200 leading-tight max-w-[130px] truncate">
                  {user.displayName || 'Dr. Ravi Shankar'}
                </p>
                <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Google Connected
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Disconnect Google Account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={isLoggingIn}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-700 bg-white hover:bg-slate-100 text-slate-800 font-medium text-xs shadow transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoggingIn ? 'Connecting...' : 'Connect Google'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
