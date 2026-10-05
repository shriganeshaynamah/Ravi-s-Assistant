import React, { useEffect, useState } from 'react';
import { Bell, Calendar, CheckSquare, CreditCard } from 'lucide-react';

export const PWASplashScreen: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(() => {
    try {
      const shown = sessionStorage.getItem('ravi_assistant_splash_shown');
      return !shown;
    } catch {
      return false;
    }
  });
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (!visible) return;
    try {
      sessionStorage.setItem('ravi_assistant_splash_shown', 'true');
    } catch {
      // ignore
    }
    const fadeTimer = setTimeout(() => setFadingOut(true), 1000);
    const hideTimer = setTimeout(() => setVisible(false), 1350);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between bg-gradient-to-b from-[#2E4A62] via-[#1B3B48] to-[#0F172A] text-white p-8 select-none transition-opacity duration-300 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="pt-4 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-widest">
          <Bell className="w-3 h-3" />
          <span>LifeOS &amp; Medical HQ</span>
        </span>
      </div>

      {/* Center Logo & App Name */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-white/15">
          <img
            src="/logo.png"
            alt="Ravi’s Assistant Logo"
            className="w-full h-full object-cover rounded-[20px]"
            onError={(e) => {
              const target = e.target as HTMLElement;
              target.style.display = 'none';
              if (target.parentElement) target.parentElement.innerHTML = '👨‍⚕️';
            }}
          />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Ravi’s Assistant
          </h1>
          <p className="text-xs text-emerald-200/90 font-medium">
            Dr. Ravi Shankar • BAMS Personal Assistant
          </p>
        </div>

        {/* Active Push Notification Modules Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-[10px] font-semibold text-slate-200">
            <CreditCard className="w-3 h-3 text-rose-300" />
            <span>EMI Due Alerts</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-[10px] font-semibold text-slate-200">
            <CheckSquare className="w-3 h-3 text-purple-300" />
            <span>Keep To-Do</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-[10px] font-semibold text-slate-200">
            <Calendar className="w-3 h-3 text-emerald-300" />
            <span>Calendar Push</span>
          </span>
        </div>
      </div>

      {/* Bottom Loading Bar */}
      <div className="w-full max-w-xs space-y-2 pb-4 text-center">
        <div className="w-full h-1.5 rounded-full bg-white/15 overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full animate-pulse" />
        </div>
        <p className="text-[10px] text-slate-400 font-mono">
          Syncing Ledgers &amp; Push Reminders...
        </p>
      </div>
    </div>
  );
};
