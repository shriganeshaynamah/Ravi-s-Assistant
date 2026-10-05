import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={
          compact
            ? 'h-9 px-2.5 rounded-xl bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-400/40 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0'
            : 'w-full mt-2 py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold flex items-center justify-between transition-all cursor-pointer'
        }
        title="Install Ravi’s Assistant App"
      >
        <div className="flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5 text-emerald-300" />
          <span>{compact ? 'Install' : 'Install Ravi’s Assistant'}</span>
        </div>
        {!compact && (
          <span className="text-[9px] uppercase tracking-wider bg-emerald-500/30 px-1.5 py-0.5 rounded font-mono text-emerald-200">
            PWA App
          </span>
        )}
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={
            compact
              ? 'h-9 px-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0'
              : 'w-full mt-2 py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold flex items-center justify-between transition-all cursor-pointer'
          }
        >
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
            <span>{compact ? 'Install' : 'Install on iPhone / iPad'}</span>
          </div>
          {!compact && (
            <span className="text-[9px] uppercase tracking-wider bg-black/20 px-1.5 py-0.5 rounded font-mono">
              iOS PWA
            </span>
          )}
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl text-slate-800 dark:text-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <img src="/logo.png" alt="Logo" className="w-6 h-6 rounded-lg object-cover" />
                  <span>Install Ravi’s Assistant</span>
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                1. Tap the <strong>Share</strong> button in your Safari toolbar.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.<br />
                3. Launch <strong>Ravi’s Assistant</strong> from your home screen for full-screen mode and push notifications.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 text-xs font-bold text-white cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg">
      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      <span>Offline Mode — Local cached data active</span>
    </div>
  );
};
