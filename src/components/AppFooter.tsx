import React from 'react';
import { Home, DollarSign, Compass, Wrench, FileText } from 'lucide-react';
import type { FeatureTab } from './HamburgerDrawer';

interface AppFooterProps {
  activeTab: FeatureTab;
  onSelectTab: (tab: FeatureTab) => void;
  isDark: boolean;
}

export const AppFooter: React.FC<AppFooterProps> = ({
  activeTab,
  onSelectTab,
  isDark,
}) => {
  const footerItems = [
    { id: 'home' as FeatureTab, label: 'Home', icon: Home },
    { id: 'expense' as FeatureTab, label: 'Expense', icon: DollarSign },
    { id: 'roadmap' as FeatureTab, label: 'Roadmap', icon: Compass },
    { id: 'tools' as FeatureTab, label: 'Tools', icon: Wrench },
    { id: 'notes' as FeatureTab, label: 'Notes', icon: FileText },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 border-t py-1 px-3 transition-colors ${
        isDark
          ? 'bg-slate-900/95 border-slate-800 text-slate-400 backdrop-blur-md'
          : 'bg-white/95 border-slate-200 text-slate-500 backdrop-blur-md shadow-md'
      }`}
    >
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {footerItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'expense' && (activeTab === 'loans' || activeTab === 'investments')) ||
            (item.id === 'notes' && activeTab === 'keeptodo');

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? isDark
                    ? 'text-emerald-400 font-bold bg-emerald-500/10'
                    : 'text-emerald-700 font-bold bg-emerald-50'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <div className="p-0.5 rounded-lg">
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.2] text-emerald-500' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[9.5px] tracking-tight ${isActive ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
