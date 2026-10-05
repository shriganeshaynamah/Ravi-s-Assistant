import React, { useEffect } from 'react';
import {
  X,
  Home,
  DollarSign,
  CreditCard,
  TrendingUp,
  Compass,
  FileText,
  Calendar,
  Wrench,
  Activity,
  HeartHandshake,
  Lock,
  Cloud,
  Sun,
  Moon,
  LogOut,
  LogIn,
  CheckCircle2,
  CheckSquare,
  Bot,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import { PWAInstallButton } from './PWAInstallButton';

export type FeatureTab =
  | 'home'
  | 'assistant'
  | 'keeptodo'
  | 'expense'
  | 'loans'
  | 'investments'
  | 'roadmap'
  | 'notes'
  | 'calendar'
  | 'tools'
  | 'dinacharya'
  | 'corners'
  | 'cloud';

interface HamburgerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeFeature: FeatureTab;
  onSelectFeature: (tab: FeatureTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const HamburgerDrawer: React.FC<HamburgerDrawerProps> = ({
  isOpen,
  onClose,
  activeFeature,
  onSelectFeature,
  isDark,
  onToggleTheme,
  user,
  onSignIn,
  onSignOut,
}) => {
  // Lock body scroll on mobile when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const menuItems = [
    { id: 'home' as FeatureTab, label: 'Dashboard', icon: Home },
    { id: 'assistant' as FeatureTab, label: 'Ravi’s Assistant 🤖', icon: Bot, isSpecial: true },
    { id: 'keeptodo' as FeatureTab, label: 'Keep To-Do & Daily Work', icon: CheckSquare },
    { id: 'expense' as FeatureTab, label: 'Expense & Budget', icon: DollarSign },
    { id: 'loans' as FeatureTab, label: 'Loans', icon: CreditCard },
    { id: 'investments' as FeatureTab, label: 'Investment & Sip', icon: TrendingUp },
    { id: 'roadmap' as FeatureTab, label: 'Roadmap', icon: Compass },
    { id: 'notes' as FeatureTab, label: 'Notes & Tasks', icon: FileText },
    { id: 'calendar' as FeatureTab, label: 'Calendar & Events', icon: Calendar },
    { id: 'tools' as FeatureTab, label: 'Tools', icon: Wrench },
    { id: 'dinacharya' as FeatureTab, label: 'Habit Tracker (DinCharya & Ritu)', icon: Activity },
    { id: 'corners' as FeatureTab, label: 'Journal', icon: BookOpen },
  ];

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      {/* Backdrop with touch dismiss */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in cursor-pointer"
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel (Smooth for Mobile & Desktop) */}
      <div
        className={`relative w-80 max-w-[85vw] h-full flex flex-col justify-between shadow-2xl transition-all duration-300 z-10 animate-in slide-in-from-left ${
          isDark
            ? 'bg-slate-900 text-slate-100 border-r border-slate-800'
            : 'bg-white text-slate-800 border-r border-slate-200'
        }`}
      >
        {/* TOP: Dr. Ravi Shankar Box as earlier, but with Google Cloud Sync button inside it */}
        <div
          className={`p-4 border-b shrink-0 ${
            isDark
              ? 'bg-slate-950/80 border-slate-800'
              : 'bg-gradient-to-br from-[#2E4A62] to-[#1e3447] text-white border-transparent'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Dr. Ravi Shankar"
                  className="w-full h-full object-cover rounded-[14px]"
                  onError={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.display = 'none';
                    if (target.parentElement) target.parentElement.innerHTML = '👨‍⚕️';
                  }}
                />
              </div>
              <div>
                <h3 className="text-sm font-extrabold tracking-tight">
                  Dr. Ravi Shankar
                </h3>
                <p className="text-[11px] opacity-85">BAMS Final Proff Student</p>
                <span className="inline-block mt-0.5 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Personal Assistant
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl opacity-75 hover:opacity-100 hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Navigation Menu"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Embedded Google Cloud Sync Button inside Dr. Ravi Shankar Box */}
          <button
            onClick={() => {
              onSelectFeature('cloud');
              onClose();
            }}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-bold flex items-center justify-between shadow-xs transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-emerald-100" />
              <span>Google Cloud Sync</span>
            </div>
            <span className="text-[9px] uppercase tracking-wider bg-black/20 px-1.5 py-0.5 rounded font-mono">
              Drive / Sheets
            </span>
          </button>

          {/* In-App PWA Install Button for Ravi's Assistant */}
          <PWAInstallButton />

          {/* Google Auth status bar */}
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-[10px] opacity-80 truncate max-w-[150px]">
              {user ? user.email : 'Google: Offline'}
            </span>
            {user ? (
              <button
                onClick={onSignOut}
                className="text-[10px] font-bold text-rose-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={onSignIn}
                className="text-[10px] font-bold text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <LogIn className="w-3 h-3" />
                <span>Connect Google</span>
              </button>
            )}
          </div>
        </div>

        {/* MIDDLE: Feature Nav Links (Smooth touch scrolling) */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-2 space-y-1 touch-pan-y scrollbar-thin">
          <p className="px-3 pt-1 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Life Management Features
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeFeature === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectFeature(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : isDark
                    ? 'text-slate-200 hover:bg-slate-800/80 hover:text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-bold'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.id === 'assistant' && !isActive && (
                  <span className="text-[8.5px] px-1.5 py-0.2 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase shrink-0">
                    AI Active
                  </span>
                )}
                {isActive && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white/90 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* BOTTOM: Mandatory Day or Night Toggle Switch in hamburger menu last */}
        <div
          className={`p-3.5 border-t shrink-0 ${
            isDark
              ? 'bg-slate-950/80 border-slate-800 text-slate-100'
              : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isDark ? (
                <Moon className="w-4 h-4 text-purple-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {isDark ? 'Night Mode (Dark)' : 'Day Mode (Light)'}
              </span>
            </div>

            {/* Toggle switch button */}
            <button
              onClick={onToggleTheme}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors relative cursor-pointer flex items-center ${
                isDark ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
              aria-label="Toggle Day or Night Mode"
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center text-[10px]">
                {isDark ? '🌙' : '☀️'}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
