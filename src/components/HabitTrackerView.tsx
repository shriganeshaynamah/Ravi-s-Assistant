import React, { useState, useMemo } from 'react';
import type { HabitItem, DinacharyaLog } from '../types';
import {
  Activity,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Calendar,
  Sparkles,
  Sun,
  Moon,
  Droplets,
  Heart,
  ShieldCheck,
  BookOpen,
  Trash2,
  Edit2,
  ChevronRight,
  ChevronLeft,
  Info,
  Clock,
  Wind,
  Compass,
  FileSpreadsheet,
  Download,
  ExternalLink,
  BarChart2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DINCHARYA_ROUTINE } from '../data/dincharyaData';
import { RITUCHARYA_SEASONS, getCurrentRitucharya } from '../data/ritucharyaData';
import { exportHabitsToCSV, exportHabitsToGoogleSheets } from '../services/googleSheets';
import { HabitAnalysisView } from './HabitAnalysisView';

interface HabitTrackerViewProps {
  habits: HabitItem[];
  onAddHabit: (habit: HabitItem) => void;
  onUpdateHabit: (habit: HabitItem) => void;
  onDeleteHabit: (id: string) => void;
  dinacharyaLogs: DinacharyaLog[];
  onSaveDinacharyaLog: (log: DinacharyaLog) => void;
  isDark?: boolean;
}

type HabitTab = 'habits' | 'dincharya' | 'ritucharya' | 'analysis';

export const HabitTrackerView: React.FC<HabitTrackerViewProps> = ({
  habits,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit,
  dinacharyaLogs,
  onSaveDinacharyaLog,
  isDark = true,
}) => {
  const [activeTab, setActiveTab] = useState<HabitTab>('habits');
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Active season for Ritucharya
  const currentSeason = useMemo(() => getCurrentRitucharya(), []);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(currentSeason.id);

  // Modals
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitItem | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<HabitItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<HabitItem['category']>('ayurveda_study');
  const [formTargetDays, setFormTargetDays] = useState(7);

  // Dinacharya completion state for selected date
  const currentDincharyaLog = useMemo(() => {
    return dinacharyaLogs.find((l) => l.date === selectedDate);
  }, [dinacharyaLogs, selectedDate]);

  // We can track custom dincharya checks for all routine items in localStorage
  const [dincharyaChecks, setDincharyaChecks] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(`ayurlife_dincharya_${selectedDate}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
    return {
      brahma_muhurta: true,
      ushapan: true,
      danta_dhavan: true,
      jihwa_nirlekhana: true,
      gandusha_kavala: false,
      nasya_kriya: false,
      abhyanga: true,
      vyayama: true,
      snana: true,
      pranayama_dhyana: true,
      sattvic_ahara: true,
      ratricharya_nidra: false,
    };
  });

  // Seasonal daily checklist state
  const [seasonChecks, setSeasonChecks] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(`ayurlife_season_${selectedDate}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
    return {
      season_ahara_1: true,
      season_ahara_2: true,
      season_vihara_1: true,
      season_vihara_2: true,
      season_varjya_1: true,
    };
  });

  // Monthly Sheet & Habit Analysis State
  const [showMonthlyAnalysis, setShowMonthlyAnalysis] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7)); // e.g. "2026-10"
  const [isExportingSheet, setIsExportingSheet] = useState(false);
  const [sheetExportUrl, setSheetExportUrl] = useState<string | null>(null);
  const [sheetExportError, setSheetExportError] = useState<string | null>(null);

  const handleExportCSV = () => {
    exportHabitsToCSV(habits, selectedMonth);
  };

  const handleExportGoogleSheet = async () => {
    try {
      setIsExportingSheet(true);
      setSheetExportError(null);
      const res = await exportHabitsToGoogleSheets(habits, selectedMonth);
      setSheetExportUrl(res.spreadsheetUrl);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } catch (e: any) {
      setSheetExportError(e.message || 'Could not export to Google Sheet. Please sign in with Google.');
    } finally {
      setIsExportingSheet(false);
    }
  };

  // Monthly stats calculations for selectedMonth
  const [yearNum, monthNum] = selectedMonth.split('-').map(Number);
  const daysInSelectedMonth = new Date(yearNum, monthNum, 0).getDate();
  const totalChecksInMonth = habits.reduce((sum, h) => {
    return sum + (h.completedDates || []).filter((d) => d.startsWith(selectedMonth)).length;
  }, 0);
  const maxPossibleInMonth = habits.length * daysInSelectedMonth;
  const monthConsistencyRate = maxPossibleInMonth > 0 ? Math.round((totalChecksInMonth / maxPossibleInMonth) * 100) : 0;

  // 7-day dates for habit calendar strip
  const last7Days = useMemo(() => {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  }, []);

  // Format short day (e.g. "M", "T", "W")
  const getDayShort = (dateStr: string) => {
    const d = new Date(dateStr);
    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()];
  };

  // Toggle habit for date
  const handleToggleHabit = (habit: HabitItem, dateStr: string) => {
    const alreadyCompleted = habit.completedDates.includes(dateStr);
    let newDates: string[];
    let newStreak = habit.streak;

    if (alreadyCompleted) {
      newDates = habit.completedDates.filter((d) => d !== dateStr);
      if (dateStr === todayStr && newStreak > 0) {
        newStreak = Math.max(0, newStreak - 1);
      }
    } else {
      newDates = [...habit.completedDates, dateStr];
      if (dateStr === todayStr) {
        newStreak += 1;
        confetti({
          particleCount: 28,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#10b981', '#06b6d4', '#f59e0b'],
        });
      }
    }

    onUpdateHabit({
      ...habit,
      completedDates: newDates,
      streak: newStreak,
    });
  };

  // Quick preset helper
  const applyPreset = (preset: { name: string; desc: string; category: HabitItem['category'] }) => {
    setFormName(preset.name);
    setFormDesc(preset.desc);
    setFormCategory(preset.category);
  };

  // Submit Habit
  const handleSaveHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingHabit) {
      onUpdateHabit({
        ...editingHabit,
        name: formName.trim(),
        description: formDesc.trim(),
        category: formCategory,
        targetDaysPerWeek: formTargetDays,
      });
    } else {
      const newHabit: HabitItem = {
        id: `habit-${Date.now()}`,
        name: formName.trim(),
        description: formDesc.trim(),
        category: formCategory,
        targetDaysPerWeek: formTargetDays,
        completedDates: [todayStr],
        streak: 1,
        createdAt: new Date().toISOString(),
      };
      onAddHabit(newHabit);
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.7 },
      });
    }

    setIsAddHabitOpen(false);
    setEditingHabit(null);
    setFormName('');
    setFormDesc('');
    setFormCategory('ayurveda_study');
    setFormTargetDays(7);
  };

  // Open Edit Modal
  const handleOpenEdit = (h: HabitItem) => {
    setEditingHabit(h);
    setFormName(h.name);
    setFormDesc(h.description || '');
    setFormCategory(h.category);
    setFormTargetDays(h.targetDaysPerWeek || 7);
    setIsAddHabitOpen(true);
  };

  // Toggle Dincharya item
  const handleToggleDincharyaItem = (itemId: string) => {
    const nextVal = !dincharyaChecks[itemId];
    const updated = { ...dincharyaChecks, [itemId]: nextVal };
    setDincharyaChecks(updated);
    try {
      localStorage.setItem(`ayurlife_dincharya_${selectedDate}`, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    // Also update main dinacharyaLogs if relevant
    if (itemId === 'brahma_muhurta' || itemId === 'ushapan' || itemId === 'vyayama') {
      const existing = dinacharyaLogs.find((l) => l.date === selectedDate) || {
        date: selectedDate,
        brahmaMuhurtaWakeup: false,
        ushapanWarmWater: false,
        dantadhavanaJivhaNirlekhana: true,
        nasyaKavalaGandusha: false,
        abhyangaOilMassage: false,
        vyayamaYogaPranayama: false,
        snanaBathing: true,
        sattvicAharaDiet: true,
        nidraSleepQuality: 4,
        notes: '',
      };
      if (itemId === 'brahma_muhurta') existing.brahmaMuhurtaWakeup = nextVal;
      if (itemId === 'ushapan') existing.ushapanWarmWater = nextVal;
      if (itemId === 'vyayama') existing.vyayamaYogaPranayama = nextVal;
      onSaveDinacharyaLog(existing);
    }
  };

  // Toggle Season Check
  const handleToggleSeasonCheck = (checkKey: string) => {
    const nextVal = !seasonChecks[checkKey];
    const updated = { ...seasonChecks, [checkKey]: nextVal };
    setSeasonChecks(updated);
    try {
      localStorage.setItem(`ayurlife_season_${selectedDate}`, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  // Calculations
  const completedHabitsToday = habits.filter((h) => h.completedDates.includes(todayStr)).length;
  const habitCompletionRate = habits.length > 0 ? Math.round((completedHabitsToday / habits.length) * 100) : 0;

  const dincharyaCompletedCount = Object.values(dincharyaChecks).filter(Boolean).length;
  const dincharyaTotalCount = DINCHARYA_ROUTINE.length;
  const dincharyaPercent = Math.round((dincharyaCompletedCount / dincharyaTotalCount) * 100);

  const selectedSeason = useMemo(() => {
    return RITUCHARYA_SEASONS.find((s) => s.id === selectedSeasonId) || currentSeason;
  }, [selectedSeasonId, currentSeason]);

  return (
    <div className="space-y-4 pb-32 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Habits &amp; Ayurveda Tracker</span>
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Daily disciplines, Dinacharya &amp; Ritucharya regimens
          </p>
        </div>

        <button
          onClick={() => setShowMonthlyAnalysis(!showMonthlyAnalysis)}
          className={`py-1.5 px-2.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
            showMonthlyAnalysis
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/20'
              : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
          }`}
          title="Save to Sheet & Monthly Habit Analysis"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Save to Sheet 📊</span>
        </button>
      </div>

      {/* 4 Main Sections Navigation Tabs */}
      <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl border border-slate-300/50 dark:border-slate-700/50">
        <button
          onClick={() => setActiveTab('habits')}
          className={`py-1.5 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'habits'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span className="truncate">Habits</span>
        </button>

        <button
          onClick={() => setActiveTab('dincharya')}
          className={`py-1.5 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'dincharya'
              ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span className="truncate">DinCharya</span>
        </button>

        <button
          onClick={() => setActiveTab('ritucharya')}
          className={`py-1.5 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'ritucharya'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="truncate">Ritucharya</span>
        </button>

        <button
          onClick={() => setActiveTab('analysis')}
          className={`py-1.5 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'analysis'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span className="truncate">Analysis 📊</span>
        </button>
      </div>

      {/* ================= SECTION 1: USER CUSTOM DAILY HABITS ================= */}
      {activeTab === 'habits' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* ================= MONTHLY HABIT ANALYSIS & SHEET EXPORT ================= */}
          {showMonthlyAnalysis && (
            <div className="p-4 rounded-3xl bg-linear-to-br from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border-2 border-emerald-400/50 dark:border-emerald-600/50 shadow-md space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-xs">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Monthly Habit Sheet Analysis
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      Analyze monthly consistency & export to spreadsheet
                    </p>
                  </div>
                </div>

                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-2 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Monthly Stats KPI */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Total Habits</span>
                  <span className="text-base font-black text-slate-900 dark:text-white">{habits.length}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Checks in Month</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{totalChecksInMonth}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Monthly Rate</span>
                  <span className="text-base font-black text-teal-600 dark:text-teal-400">{monthConsistencyRate}%</span>
                </div>
              </div>

              {/* Export Buttons: Download CSV & Save to Google Sheets */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleExportCSV}
                  className="flex-1 py-2 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV Sheet</span>
                </button>

                <button
                  onClick={handleExportGoogleSheet}
                  disabled={isExportingSheet}
                  className="flex-1 py-2 px-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>{isExportingSheet ? 'Saving to Cloud...' : 'Save to Google Sheet'}</span>
                </button>
              </div>

              {/* Sheet Result Link or Error */}
              {sheetExportUrl && (
                <div className="p-3 rounded-2xl bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-2">
                  <span className="font-semibold text-[11px]">✓ Saved to your Google Drive!</span>
                  <a
                    href={sheetExportUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 flex items-center gap-1"
                  >
                    <span>Open Sheet</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {sheetExportError && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <p className="text-[11px] font-medium">{sheetExportError}</p>
                  <p className="text-[10px] text-slate-500">Tip: Use "Download CSV Sheet" above for instant offline Excel / Google Sheet import anytime.</p>
                </div>
              )}

              {/* Habit Breakdown Table */}
              <div className="space-y-2 pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Habit Consistency in {selectedMonth}:
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {habits.map((habit) => {
                    const daysDoneInMonth = (habit.completedDates || []).filter((d) => d.startsWith(selectedMonth)).length;
                    const habitRate = daysInSelectedMonth > 0 ? Math.round((daysDoneInMonth / daysInSelectedMonth) * 100) : 0;

                    return (
                      <div
                        key={habit.id}
                        className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                            {habit.name}
                          </span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {daysDoneInMonth} / {daysInSelectedMonth} days ({habitRate}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all"
                            style={{ width: `${habitRate}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {/* Daily Streak & Progress Overview Box */}
          <div className="p-4 rounded-3xl bg-linear-to-br from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Today's Habit Discipline
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {completedHabitsToday} / {habits.length}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {habitCompletionRate}% Completed
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Consistent habits fortify Sukra Dhatu and mental Ojas
              </p>
            </div>

            <button
              onClick={() => {
                setEditingHabit(null);
                setFormName('');
                setFormDesc('');
                setFormCategory('ayurveda_study');
                setIsAddHabitOpen(true);
              }}
              className="py-2 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Habit</span>
            </button>
          </div>

          {/* Quick presets pill bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            <span className="text-slate-400 text-[10px] font-bold uppercase shrink-0">Quick Add:</span>
            <button
              onClick={() => {
                applyPreset({
                  name: 'Study 2hr daily (Charaka & Modern)',
                  desc: 'Clinical diagnosis, Rogi-Pariksha & Samhita sutras',
                  category: 'ayurveda_study',
                });
                setIsAddHabitOpen(true);
              }}
              className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-medium whitespace-nowrap hover:bg-emerald-100 cursor-pointer"
            >
              + Study 2hr daily
            </button>
            <button
              onClick={() => {
                applyPreset({
                  name: 'No Fap (Ojas & Brahmacharya)',
                  desc: 'Preserve vitality, sharp focus and clinical acumen',
                  category: 'discipline',
                });
                setIsAddHabitOpen(true);
              }}
              className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-medium whitespace-nowrap hover:bg-purple-100 cursor-pointer"
            >
              + No Fap
            </button>
            <button
              onClick={() => {
                applyPreset({
                  name: '15m Pranayama & Nadi Shodhana',
                  desc: 'Alternate nostril breathing to balance Prana Vayu',
                  category: 'fitness',
                });
                setIsAddHabitOpen(true);
              }}
              className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-medium whitespace-nowrap hover:bg-blue-100 cursor-pointer"
            >
              + 15m Pranayama
            </button>
            <button
              onClick={() => {
                applyPreset({
                  name: 'Daily 10k Steps / Vyayama',
                  desc: 'Stoke Agni and prevent metabolic Kapha accumulation',
                  category: 'fitness',
                });
                setIsAddHabitOpen(true);
              }}
              className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-medium whitespace-nowrap hover:bg-amber-100 cursor-pointer"
            >
              + 10k Steps
            </button>
          </div>

          {/* List of Habits */}
          {habits.length === 0 ? (
            <div className="text-center py-12 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 p-6 space-y-3">
              <Flame className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No Custom Habits Added Yet</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Add your personal daily routines like "Study 2hr daily", "No Fap", or exercise routines to track consistency.
              </p>
              <button
                onClick={() => setIsAddHabitOpen(true)}
                className="py-2 px-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs"
              >
                + Add First Habit
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {habits.map((habit) => {
                const isCompletedToday = habit.completedDates.includes(todayStr);

                return (
                  <div
                    key={habit.id}
                    className={`p-4 rounded-3xl border transition-all ${
                      isCompletedToday
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Checkbox & Details */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <button
                          onClick={() => handleToggleHabit(habit, todayStr)}
                          className={`mt-0.5 p-1 rounded-xl transition-transform active:scale-90 cursor-pointer ${
                            isCompletedToday
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-300 dark:text-slate-600 hover:text-slate-400'
                          }`}
                        >
                          {isCompletedToday ? (
                            <CheckCircle2 className="w-6 h-6 fill-emerald-500 text-white dark:text-slate-950 stroke-[2.5]" />
                          ) : (
                            <Circle className="w-6 h-6 stroke-[2]" />
                          )}
                        </button>

                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4
                              className={`text-sm font-bold truncate ${
                                isCompletedToday
                                  ? 'line-through text-slate-500 dark:text-slate-400'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {habit.name}
                            </h4>

                            {habit.streak > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                                <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                                {habit.streak}d streak
                              </span>
                            )}
                          </div>

                          {habit.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                              {habit.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action buttons (Edit & Delete) */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEdit(habit)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit Habit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setHabitToDelete(habit)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete Habit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Past 7-Day History Mini Dots */}
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Past 7 Days
                      </span>
                      <div className="flex items-center gap-2">
                        {last7Days.map((dStr) => {
                          const done = habit.completedDates.includes(dStr);
                          const isTodayDate = dStr === todayStr;

                          return (
                            <button
                              key={dStr}
                              onClick={() => handleToggleHabit(habit, dStr)}
                              className={`flex flex-col items-center gap-1 cursor-pointer group`}
                              title={`${dStr}: ${done ? 'Completed' : 'Not completed'}`}
                            >
                              <span className="text-[9px] font-semibold text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200">
                                {getDayShort(dStr)}
                              </span>
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                  done
                                    ? 'bg-emerald-500 text-white shadow-xs'
                                    : isTodayDate
                                    ? 'border-2 border-dashed border-emerald-400 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                }`}
                              >
                                {done ? '✓' : ''}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= SECTION 2: DINCHARYA TRACKER ================= */}
      {activeTab === 'dincharya' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header Overview Card */}
          <div className="p-4 rounded-3xl bg-linear-to-br from-teal-500/10 via-emerald-500/10 to-transparent border border-teal-500/20 dark:border-teal-500/30">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Ayurvedic DinCharya Compliance
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {dincharyaCompletedCount} / {dincharyaTotalCount}
                  </span>
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                    {dincharyaPercent}% Ojas Harmony
                  </span>
                </div>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-700 flex items-center justify-center">
                <Sun className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
              Classical diurnal protocol from Charaka and Vagbhata Samhita for Tridosha equilibrium.
            </p>
          </div>

          {/* Dincharya Routine Items */}
          <div className="space-y-2.5">
            {DINCHARYA_ROUTINE.map((item) => {
              const isChecked = !!dincharyaChecks[item.id];

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isChecked
                      ? 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-300 dark:border-teal-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleDincharyaItem(item.id)}
                      className={`mt-0.5 p-1 rounded-xl transition-transform active:scale-90 cursor-pointer ${
                        isChecked
                          ? 'text-teal-600 dark:text-teal-400'
                          : 'text-slate-300 dark:text-slate-600 hover:text-slate-400'
                      }`}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 fill-teal-500 text-white dark:text-slate-950 stroke-[2.5]" />
                      ) : (
                        <Circle className="w-5 h-5 stroke-[2]" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span
                          className={`text-xs font-bold ${
                            isChecked
                              ? 'line-through text-slate-500 dark:text-slate-400'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {item.englishTitle}
                        </span>

                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-100/70 dark:bg-teal-950/70 px-2 py-0.5 rounded-md">
                          <Clock className="w-2.5 h-2.5" />
                          {item.timeWindow}
                        </span>
                      </div>

                      <p className="text-[11px] font-serif italic text-teal-800 dark:text-teal-300/90">
                        {item.sanskritName}
                      </p>

                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {item.description}
                      </p>

                      <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                        <span>Benefit: {item.doshaBenefit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= SECTION 3: RITUCHARYA (SEASONAL REGIMENS) ================= */}
      {activeTab === 'ritucharya' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Active Season Banner */}
          <div className="p-4 rounded-3xl bg-linear-to-br from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20 dark:border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Current Season (Ritu) Detected
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                Live Now
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {currentSeason.nameEnglish} ({currentSeason.nameSanskrit})
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Months: <strong className="text-slate-800 dark:text-slate-200">{currentSeason.englishMonths}</strong> • {currentSeason.indianMonths}
            </p>
          </div>

          {/* Season Selector Tabs (All 6 Ritus) */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Select Ritu to View Regimen:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {RITUCHARYA_SEASONS.map((season) => {
                const isSelected = season.id === selectedSeasonId;
                const isCurrent = season.id === currentSeason.id;

                return (
                  <button
                    key={season.id}
                    onClick={() => setSelectedSeasonId(season.id)}
                    className={`p-2 rounded-xl text-left transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                        {season.nameEnglish}
                      </span>
                      {isCurrent && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active Season" />}
                    </div>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 truncate block">
                      {season.englishMonths.split('to')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Season Regimen Card */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedSeason.nameSanskrit}
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {selectedSeason.bodilyStrength}
                </span>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                {selectedSeason.englishMonths} ({selectedSeason.indianMonths})
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {selectedSeason.kala}
              </p>
            </div>

            {/* Dosha Status Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-blue-500 uppercase block">Vata</span>
                <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">
                  {selectedSeason.doshaState.vata}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-rose-500 uppercase block">Pitta</span>
                <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">
                  {selectedSeason.doshaState.pitta}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-emerald-500 uppercase block">Kapha</span>
                <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">
                  {selectedSeason.doshaState.kapha}
                </span>
              </div>
            </div>

            {/* Prescribed Diet (Ahara) */}
            <div className="space-y-1.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Prescribed Ahara (Diet Regimen)</span>
              </h5>
              <ul className="space-y-1 pl-1">
                {selectedSeason.aharaRegimen.map((diet, idx) => (
                  <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{diet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prescribed Lifestyle (Vihara) */}
            <div className="space-y-1.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" />
                <span>Prescribed Vihara (Lifestyle & Habits)</span>
              </h5>
              <ul className="space-y-1 pl-1">
                {selectedSeason.viharaRegimen.map((vih, idx) => (
                  <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="text-teal-500 font-bold">•</span>
                    <span>{vih}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strictly Prohibited (Varjya) */}
            <div className="space-y-1.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Strictly Prohibited (Varjya Regimen)</span>
              </h5>
              <ul className="space-y-1 pl-1">
                {selectedSeason.varjyaRegimen.map((vrj, idx) => (
                  <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{vrj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Classical Sutra Insight */}
            <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-300 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Clinical Samhita Insight:
              </span>
              <p className="italic text-[11px] leading-relaxed">
                {selectedSeason.clinicalNotes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 4: 30-DAY HABIT & DINACHARYA RECHARTS ANALYSIS ================= */}
      {activeTab === 'analysis' && (
        <HabitAnalysisView
          dinacharyaLogs={dinacharyaLogs}
          habits={habits}
          isDark={isDark}
        />
      )}

      {/* ================= MODAL: ADD / EDIT CUSTOM HABIT ================= */}
      {isAddHabitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {editingHabit ? 'Edit Habit' : 'Add New Daily Habit'}
              </h3>
              <button
                onClick={() => {
                  setIsAddHabitOpen(false);
                  setEditingHabit(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveHabit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Habit Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Study 2hr daily, No Fap, 10k Steps"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Description / Motivation
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Revise Charaka Chikitsa or preserve mental Ojas"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as HabitItem['category'])}
                    className="w-full px-2 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="ayurveda_study">Study & Clinical</option>
                    <option value="discipline">Discipline (No Fap)</option>
                    <option value="dinacharya">Dinacharya</option>
                    <option value="fitness">Fitness & Yoga</option>
                    <option value="mindset">Mindset & Ojas</option>
                    <option value="personal">Personal Life</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Days / Week
                  </label>
                  <select
                    value={formTargetDays}
                    onChange={(e) => setFormTargetDays(Number(e.target.value))}
                    className="w-full px-2 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value={7}>7 Days (Daily)</option>
                    <option value={6}>6 Days / Week</option>
                    <option value={5}>5 Days / Week</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddHabitOpen(false);
                    setEditingHabit(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  {editingHabit ? 'Save Changes' : 'Create Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE HABIT CONFIRMATION ================= */}
      {habitToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl space-y-3 animate-in zoom-in-95">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Delete Habit?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to remove <strong className="text-slate-700 dark:text-slate-200">"{habitToDelete.name}"</strong>? This will remove its recorded streak.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setHabitToDelete(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteHabit(habitToDelete.id);
                  setHabitToDelete(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
