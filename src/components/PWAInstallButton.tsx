import React, { useState } from 'react';
import { Download, Smartphone, X, ShieldCheck, CheckCircle2, Copy } from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [packageName, setPackageName] = useState(
    () => localStorage.getItem('twa_package_name') || 'app.vercel.dr_ravi_shankar_lifeos.twa'
  );
  const [sha256Fingerprint, setSha256Fingerprint] = useState(
    () => localStorage.getItem('twa_sha256') || ''
  );
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'copied'>('idle');

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) return;
    }
    setShowSetupModal(true);
  };

  const generatedAssetLinksJson = JSON.stringify(
    [
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: packageName.trim() || 'app.vercel.dr_ravi_shankar_lifeos.twa',
          sha256_cert_fingerprints: [
            (sha256Fingerprint.trim() || 'PASTE_YOUR_SHA256_FINGERPRINT_FROM_PWABUILDER_ZIP').toUpperCase(),
          ],
        },
      },
    ],
    null,
    2
  );

  const handleSaveAssetLinks = async () => {
    localStorage.setItem('twa_package_name', packageName.trim());
    localStorage.setItem('twa_sha256', sha256Fingerprint.trim());
    setSaveStatus('saving');
    try {
      await fetch('/api/pwa/assetlinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageName: packageName.trim(),
          sha256Fingerprint: sha256Fingerprint.trim(),
        }),
      });
    } catch {
      // Ignore network error if running on static host
    }
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(generatedAssetLinksJson);
    setSaveStatus('copied');
    setTimeout(() => setSaveStatus('idle'), 2500);
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={
          compact
            ? 'h-9 px-2.5 rounded-xl bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-400/40 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0'
            : 'w-full mt-2 py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold flex items-center justify-between transition-all cursor-pointer'
        }
        title="Install Full-Screen App (No URL Bar)"
      >
        <div className="flex items-center gap-1.5">
          {isIOS ? (
            <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
          ) : (
            <Download className="w-3.5 h-3.5 text-emerald-300" />
          )}
          <span>{compact ? 'Install App' : 'Install Full-Screen App'}</span>
        </div>
        {!compact && (
          <span className="text-[9px] uppercase tracking-wider bg-emerald-500/30 px-1.5 py-0.5 rounded font-mono text-emerald-200">
            No URL Bar
          </span>
        )}
      </button>

      {showSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl text-slate-800 dark:text-slate-100 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="w-7 h-7 rounded-xl object-cover" />
                <span>Open as Full-Screen App (Hide URL Bar)</span>
              </h3>
              <button
                onClick={() => setShowSetupModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isIOS ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2 text-xs">
                <p className="font-bold text-emerald-800 dark:text-emerald-300">
                  iPhone / iPad Full-Screen Install:
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  1. Tap the <strong>Share</strong> icon in Safari toolbar.<br />
                  2. Tap <strong>Add to Home Screen</strong>.<br />
                  3. Open from Home Screen — it launches full-screen without any URL bar.
                </p>
              </div>
            ) : (
              <>
                {/* METHOD 1: Direct Chrome WebAPK (Fastest, 0 URL Bar) */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      Method 1: Direct Chrome Install (Best • No URL Bar)
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-600 text-white px-2 py-0.5 rounded-md font-bold">
                      10 Sec Fix
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                    External APK builders show the website URL bar unless verified. For <strong>instant 100% Full-Screen App mode without URL bar</strong>:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-800 dark:text-slate-200 font-medium">
                    <li>Uninstall the external APK from your phone first.</li>
                    <li>Open your website link directly in <strong>Google Chrome</strong> on Android.</li>
                    <li>
                      Tap Chrome’s top-right <strong>⋮ (3 dots)</strong> → tap <strong>“Install app”</strong> (or <strong>Add to Home screen → Install</strong>).
                    </li>
                  </ol>
                  {isInstallable && (
                    <button
                      onClick={async () => {
                        const ok = await install();
                        if (ok) setShowSetupModal(false);
                      }}
                      className="w-full mt-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Install Native Chrome WebAPK Now</span>
                    </button>
                  )}
                </div>

                {/* METHOD 2: PWABuilder APK Digital Asset Links (assetlinks.json) */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
                  <div className="flex items-center gap-1.5 font-extrabold text-indigo-600 dark:text-indigo-400">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Method 2: Using PWABuilder APK? Link SHA-256 Key</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    When you build an APK from PWABuilder, the downloaded ZIP contains an <code>assetlinks.json</code> file. Android hides the URL bar inside that APK only when your APK’s <strong>Package Name</strong> and <strong>SHA-256 Fingerprint</strong> match <code>/.well-known/assetlinks.json</code>:
                  </p>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                        APK Package Name (from PWABuilder)
                      </label>
                      <input
                        type="text"
                        value={packageName}
                        onChange={(e) => setPackageName(e.target.value)}
                        placeholder="e.g. app.vercel.your_site.twa"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                        SHA-256 Certificate Fingerprint (from PWABuilder assetlinks.json)
                      </label>
                      <input
                        type="text"
                        value={sha256Fingerprint}
                        onChange={(e) => setSha256Fingerprint(e.target.value)}
                        placeholder="e.g. 14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:..."
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleSaveAssetLinks}
                      className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] cursor-pointer transition-colors"
                    >
                      {saveStatus === 'saving'
                        ? 'Saving...'
                        : saveStatus === 'saved'
                        ? 'Saved to /.well-known/assetlinks.json ✓'
                        : 'Activate APK Fingerprint'}
                    </button>
                    <button
                      onClick={handleCopyJson}
                      className="py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      title="Copy public/.well-known/assetlinks.json"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{saveStatus === 'copied' ? 'Copied!' : 'Copy JSON'}</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={() => setShowSetupModal(false)}
              className="w-full rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 py-2.5 text-xs font-bold text-white cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
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
