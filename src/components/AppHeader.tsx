import React, { useState, useEffect } from 'react';
import { Menu, Bell, Cloud, Palette, Check } from 'lucide-react';
import type { User } from 'firebase/auth';
import { PWAInstallButton } from './PWAInstallButton';

interface AppHeaderProps {
  onOpenDrawer: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  user: User | null;
  isDark: boolean;
}

export interface WebsiteTheme {
  id: string;
  name: string;
  headerBg: string;
  headerBorder: string;
  accent: string;
  preview: string;
}

export const WEBSITE_THEMES: WebsiteTheme[] = [
  {
    id: 'oceanic',
    name: 'Oceanic Executive',
    headerBg: 'bg-[#2E4A62]',
    headerBorder: 'border-[#22394d]',
    accent: '#2E4A62',
    preview: '#2E4A62',
  },
  {
    id: 'emerald',
    name: 'Ayurvedic Emerald',
    headerBg: 'bg-[#1B4D3E]',
    headerBorder: 'border-[#13372c]',
    accent: '#1B4D3E',
    preview: '#1B4D3E',
  },
  {
    id: 'obsidian',
    name: 'Royal Obsidian',
    headerBg: 'bg-[#0F172A]',
    headerBorder: 'border-[#1e293b]',
    accent: '#0F172A',
    preview: '#0F172A',
  },
  {
    id: 'amber',
    name: 'Charaka Saffron',
    headerBg: 'bg-[#78350F]',
    headerBorder: 'border-[#5c280b]',
    accent: '#78350F',
    preview: '#78350F',
  },
  {
    id: 'indigo',
    name: 'Deep Indigo',
    headerBg: 'bg-[#312E81]',
    headerBorder: 'border-[#252264]',
    accent: '#312E81',
    preview: '#312E81',
  },
];

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenDrawer,
  onOpenNotifications,
  unreadNotificationsCount,
  user,
  isDark,
}) => {
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving'>('synced');
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<string>(() => {
    return localStorage.getItem('ayurlife_theme_color_id') || 'oceanic';
  });

  const activeTheme =
    WEBSITE_THEMES.find((t) => t.id === selectedThemeId) || WEBSITE_THEMES[0];

  useEffect(() => {
    const handleSync = () => {
      setSyncStatus('saving');
      const timer = setTimeout(() => {
        setSyncStatus('synced');
      }, 700);
      return () => clearTimeout(timer);
    };

    window.addEventListener('ayurlife_cloud_synced', handleSync);
    return () => window.removeEventListener('ayurlife_cloud_synced', handleSync);
  }, []);

  const handleSelectTheme = (theme: WebsiteTheme) => {
    setSelectedThemeId(theme.id);
    localStorage.setItem('ayurlife_theme_color_id', theme.id);
    setIsThemePickerOpen(false);
    window.dispatchEvent(new CustomEvent('ayurlife_theme_changed', { detail: theme }));
  };

  return (
    <header
      className={`sticky top-0 z-40 px-3.5 sm:px-6 py-2 transition-colors border-b ${
        isDark
          ? 'bg-slate-900/95 border-slate-800 text-white'
          : `${activeTheme.headerBg} ${activeTheme.headerBorder} text-white shadow-xs`
      }`}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Rounded Hamburger Menu Button */}
        <button
          onClick={onOpenDrawer}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            isDark
              ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
          }`}
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Center: Brand Badge, Logo Image, App Title & Cloud Auto-Save Badge */}
        <div className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xs flex items-center justify-center overflow-hidden shrink-0">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-full object-cover rounded-[9px]"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = 'none';
                if (target.parentElement) target.parentElement.innerHTML = '🌿';
              }}
            />
          </div>
          <div className="text-left">
            <h1 className="text-sm font-extrabold tracking-tight flex items-center gap-1.5 leading-none text-white">
              <span>Dr.Ravi Shankar’s</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-[10px] text-slate-300 font-medium leading-tight">
                Personal Assistant
              </p>
              <span className="inline-flex items-center gap-0.5 text-[8.5px] font-semibold text-emerald-300 bg-emerald-950/60 px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                <Cloud className="w-2.5 h-2.5 text-emerald-400" />
                <span>{syncStatus === 'saving' ? 'Saving...' : 'Cloud Synced'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: PWA Install Button, Theme Color Picker & Notification Bell */}
        <div className="flex items-center gap-1.5 relative">
          <PWAInstallButton compact />
          {/* Website Color Picker Button */}
          <div className="relative">
            <button
              onClick={() => setIsThemePickerOpen(!isThemePickerOpen)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
              }`}
              title="Choose Website Color Theme"
              aria-label="Choose Website Color"
            >
              <Palette className="w-4 h-4" />
            </button>

            {/* Theme Dropdown Modal */}
            {isThemePickerOpen && (
              <div
                className={`absolute right-0 top-11 z-50 w-52 p-3 rounded-2xl border shadow-xl animate-in zoom-in-95 space-y-2 ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-100'
                    : 'bg-white border-slate-200 text-slate-800 shadow-2xl'
                }`}
              >
                <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Website Theme Color
                  </span>
                  <button
                    onClick={() => setIsThemePickerOpen(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-1">
                  {WEBSITE_THEMES.map((theme) => {
                    const isSelected = theme.id === selectedThemeId;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => handleSelectTheme(theme)}
                        className={`w-full p-2 rounded-xl text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-100 dark:bg-slate-800 font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-white/40 shadow-2xs"
                            style={{ backgroundColor: theme.preview }}
                          />
                          <span className="text-[11px]">{theme.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Notification Bell with Badge */}
          <button
            onClick={onOpenNotifications}
            className={`w-9 h-9 rounded-xl flex items-center justify-center relative transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center shadow-md animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
