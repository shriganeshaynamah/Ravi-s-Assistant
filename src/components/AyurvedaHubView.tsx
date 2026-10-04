import React, { useState } from 'react';
import type { DinacharyaLog } from '../types';
import {
  Activity,
  Flame,
  Sun,
  Moon,
  Droplets,
  Heart,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Circle,
  Save,
  Calendar,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DinacharyaWeeklyChart } from './DinacharyaWeeklyChart';

interface AyurvedaHubViewProps {
  dinacharyaLogs: DinacharyaLog[];
  onSaveLog: (log: DinacharyaLog) => void;
  isDark?: boolean;
}

export const AyurvedaHubView: React.FC<AyurvedaHubViewProps> = ({
  dinacharyaLogs,
  onSaveLog,
  isDark = true,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const existingLog = dinacharyaLogs.find((l) => l.date === selectedDate);

  const [activeTab, setActiveTab] = useState<'dinacharya' | 'clinical_guide'>('dinacharya');

  const [logState, setLogState] = useState<DinacharyaLog>(
    existingLog || {
      date: selectedDate,
      brahmaMuhurtaWakeup: true,
      ushapanWarmWater: true,
      dantadhavanaJivhaNirlekhana: true,
      nasyaKavalaGandusha: false,
      abhyangaOilMassage: false,
      vyayamaYogaPranayama: true,
      snanaBathing: true,
      sattvicAharaDiet: true,
      nidraSleepQuality: 4,
      notes: '',
    }
  );

  const [isSaved, setIsSaved] = useState(false);

  // Sync logState when selectedDate changes
  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    const log = dinacharyaLogs.find((l) => l.date === dateStr);
    if (log) {
      setLogState(log);
    } else {
      setLogState({
        date: dateStr,
        brahmaMuhurtaWakeup: true,
        ushapanWarmWater: true,
        dantadhavanaJivhaNirlekhana: true,
        nasyaKavalaGandusha: false,
        abhyangaOilMassage: false,
        vyayamaYogaPranayama: true,
        snanaBathing: true,
        sattvicAharaDiet: true,
        nidraSleepQuality: 4,
        notes: '',
      });
    }
    setIsSaved(false);
  };

  const handleReturnToToday = () => {
    handleSelectDate(todayStr);
  };

  const dinacharyaItems = [
    {
      key: 'brahmaMuhurtaWakeup' as const,
      label: 'Brahma Muhurta Awakening (4:30 - 5:30 AM)',
      desc: 'Wake up during auspicious Vata time to awaken pure Sattva, clarity and energy.',
      icon: Sun,
    },
    {
      key: 'ushapanWarmWater' as const,
      label: 'Ushapan (Warm Copper / Lukewarm Water)',
      desc: 'Stimulates downward peristalsis (Apana Vayu) and flushes digestive tract toxins (Ama).',
      icon: Droplets,
    },
    {
      key: 'dantadhavanaJivhaNirlekhana' as const,
      label: 'Dantadhavana & Jivha Nirlekhana (Tongue Scraping)',
      desc: 'Herbal tooth cleansing and copper tongue scraping to remove Ama coating and awaken taste buds.',
      icon: Sparkles,
    },
    {
      key: 'nasyaKavalaGandusha' as const,
      label: 'Pratimarsa Nasya & Kavala / Gandusha (Oil Pulling)',
      desc: '2 drops of Anu Taila in each nostril; sesame oil gargle to strengthen voice, teeth and senses.',
      icon: Droplets,
    },
    {
      key: 'abhyangaOilMassage' as const,
      label: 'Abhyanga (Self Warm Oil Application)',
      desc: 'Nourishes Dhatus, pacifies Vata dosha, promotes longevity and enhances skin luster.',
      icon: Heart,
    },
    {
      key: 'vyayamaYogaPranayama' as const,
      label: 'Vyayama & Pranayama (Yoga & Breath Control)',
      desc: 'Half capacity exercise (Ardha Shakti) followed by 15 mins Nadi Shodhana and Kapalabhati.',
      icon: Activity,
    },
    {
      key: 'snanaBathing' as const,
      label: 'Snana (Purifying Warm Bath)',
      desc: 'Enhances digestive fire (Agni), cleanses sweat (Sveda Mala) and brings fresh enthusiasm.',
      icon: Droplets,
    },
    {
      key: 'sattvicAharaDiet' as const,
      label: 'Sattvic Ahara (Mindful Fresh Ayurvedic Meals)',
      desc: 'Freshly prepared warm seasonal food eaten with mindfulness and half stomach capacity.',
      icon: Flame,
    },
  ];

  const completedCount = dinacharyaItems.filter((item) => logState[item.key]).length;
  const scorePercent = Math.round((completedCount / dinacharyaItems.length) * 100);

  type DinacharyaBooleanKey = 
    | 'brahmaMuhurtaWakeup'
    | 'ushapanWarmWater'
    | 'dantadhavanaJivhaNirlekhana'
    | 'nasyaKavalaGandusha'
    | 'abhyangaOilMassage'
    | 'vyayamaYogaPranayama'
    | 'snanaBathing'
    | 'sattvicAharaDiet';

  const handleToggle = (key: DinacharyaBooleanKey) => {
    setLogState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    onSaveLog(logState);
    setIsSaved(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#10b981', '#14b8a6', '#059669'],
    });
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>Habit Tracker</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Doctor’s personal Ayurvedic daily regimen tracker and quick clinical bedside diagnostic tables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('dinacharya')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'dinacharya'
                ? 'bg-emerald-600 text-white shadow-xs'
                : isDark
                ? 'bg-slate-800 text-slate-300 hover:text-white'
                : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs'
            }`}
          >
            Daily Habits
          </button>
          <button
            onClick={() => setActiveTab('clinical_guide')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'clinical_guide'
                ? 'bg-teal-600 text-white shadow-xs'
                : isDark
                ? 'bg-slate-800 text-slate-300 hover:text-white'
                : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs'
            }`}
          >
            Clinical Quick Reference
          </button>
        </div>
      </div>

      {activeTab === 'dinacharya' ? (
        <div className="space-y-6 animate-in fade-in">
          {/* Weekly Bar Chart with D3.js */}
          <DinacharyaWeeklyChart
            dinacharyaLogs={dinacharyaLogs}
            currentLog={logState.date === todayStr ? logState : undefined}
            isDark={isDark}
            onSelectDate={handleSelectDate}
          />

          {/* Daily Routine Card */}
          <div className={`rounded-3xl border p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs ${
            isDark
              ? 'bg-gradient-to-r from-teal-950/40 via-slate-900 to-emerald-950/40 border-teal-500/20'
              : 'bg-gradient-to-r from-teal-50/80 via-emerald-50/80 to-teal-50/80 border-teal-200/80'
          }`}>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  {selectedDate === todayStr ? "Today's Habit Adherence" : `Adherence for ${selectedDate}`} • {selectedDate}
                </span>
                {selectedDate !== todayStr && (
                  <button
                    onClick={handleReturnToToday}
                    className="px-2 py-0.5 rounded-md bg-teal-500/20 hover:bg-teal-500/30 text-[10px] font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Back to Today</span>
                  </button>
                )}
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Vaidya Personal Health &amp; Ojas Index</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 max-w-xl leading-relaxed">
                As Sushruta states: "One who practices Dinacharya regularly maintains healthy Dosha balance, strong Agni, clear sense faculties, and longevity."
              </p>
            </div>

            <div className={`flex items-center gap-4 px-5 py-3 rounded-2xl border shrink-0 ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-teal-200 shadow-xs'
            }`}>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Adherence Score</p>
                <p className="text-2xl font-black text-teal-600 dark:text-teal-300 font-mono">{scorePercent}%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">{completedCount} of 8 Habits Done</p>
                <button
                  onClick={handleSave}
                  className="mt-1 px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                >
                  <Save className="w-3 h-3" />
                  <span>{isSaved ? 'Saved!' : 'Save Routine'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dinacharya Items Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {dinacharyaItems.map((item) => {
              const isChecked = !!logState[item.key];
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  onClick={() => handleToggle(item.key)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? isDark
                        ? 'bg-teal-950/20 border-teal-500/30 text-teal-100 shadow-xs'
                        : 'bg-teal-50/80 border-teal-300 text-teal-950 shadow-xs'
                      : isDark
                      ? 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="mt-0.5">
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{item.label}</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-normal">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Nidra & Notes */}
          <div className={`p-5 rounded-3xl border space-y-4 shadow-xs ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Nidra (Sleep Quality Rating: 1 to 5 Stars)</span>
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Nidra is one of the three pillars of life (Trayopasthambha).
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => {
                      setLogState((prev) => ({ ...prev, nidraSleepQuality: star as any }));
                      setIsSaved(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                      logState.nidraSleepQuality >= star
                        ? 'bg-purple-600 text-white shadow-xs'
                        : isDark
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    ★ {star}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Personal Vaidya Journal / Daily Physical State Notes:
              </label>
              <textarea
                rows={2}
                value={logState.notes}
                onChange={(e) => {
                  setLogState((prev) => ({ ...prev, notes: e.target.value }));
                  setIsSaved(false);
                }}
                placeholder="Observed dosha balance, digestion fire (Agni state: Sama / Vishama / Tikshna / Manda), mental tranquility..."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-teal-500 font-medium"
              />
            </div>

            <div className="text-right">
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 ml-auto cursor-pointer shadow-md shadow-teal-950/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaved ? 'Regimen Saved!' : 'Save Today’s Habits'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Clinical Quick Reference Guide */
        <div className="space-y-6 animate-in fade-in">
          {/* Tridosha Assessment Bedside Guide */}
          <div className={`rounded-3xl border p-5 space-y-3 shadow-xs ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Tridosha Bedside Diagnostic Summary</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className={`p-3.5 rounded-2xl border space-y-2 ${
                isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-sky-50/50 border-sky-200'
              }`}>
                <span className="font-extrabold text-sky-700 dark:text-sky-400 text-sm">Vata Dosha (Air + Ether)</span>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  <strong>Guna:</strong> Ruksha (Dry), Laghu (Light), Sheeta (Cold), Khara (Rough), Chala (Mobile).
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  <strong>Prakopa Lakshana:</strong> Body ache, constipation, insomnia, dry skin, anxiety, joint popping.
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  <strong>Prime Therapy:</strong> Basti (Medicated Enema), warm oil Abhyanga, Vatanulomana herbs.
                </p>
              </div>

              <div className={`p-3.5 rounded-2xl border space-y-2 ${
                isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-rose-50/50 border-rose-200'
              }`}>
                <span className="font-extrabold text-rose-700 dark:text-rose-400 text-sm">Pitta Dosha (Fire + Water)</span>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  <strong>Guna:</strong> Sasneha (Slight oily), Tikshna (Sharp), Ushna (Hot), Laghu (Light), Sara (Liquid).
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  <strong>Prakopa Lakshana:</strong> Burning sensations, hyperacidity, skin rashes, excessive thirst, anger.
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  <strong>Prime Therapy:</strong> Virechana (Therapeutic Purgation), Tikta Ghrita, cooling Ahara.
                </p>
              </div>

              <div className={`p-3.5 rounded-2xl border space-y-2 ${
                isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-emerald-50/50 border-emerald-200'
              }`}>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm">Kapha Dosha (Water + Earth)</span>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  <strong>Guna:</strong> Guru (Heavy), Sheeta (Cold), Mridu (Soft), Snigdha (Unctuous), Manda (Slow).
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  <strong>Prakopa Lakshana:</strong> Lethargy, productive cough, loss of appetite, heaviness, edema.
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  <strong>Prime Therapy:</strong> Vamana (Therapeutic Emesis), Langhana, Trikatu, dry Swedana.
                </p>
              </div>
            </div>
          </div>

          {/* Dravyaguna & Classical Formulation Golden Rules */}
          <div className={`rounded-3xl border p-5 space-y-3 shadow-xs ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Panchavidha Kashaya Kalpana (Formulation Ratios)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-center">
              <div className={`p-3 rounded-2xl border ${
                isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
              }`}>
                <p className="font-bold text-slate-900 dark:text-white text-xs">Swarasa (Juice)</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Fresh expressed juice</p>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">12 ml Dose</span>
              </div>
              <div className={`p-3 rounded-2xl border ${
                isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
              }`}>
                <p className="font-bold text-slate-900 dark:text-white text-xs">Kalka (Paste)</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Fine bolus paste</p>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">12 g Dose</span>
              </div>
              <div className={`p-3 rounded-2xl border ${
                isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
              }`}>
                <p className="font-bold text-slate-900 dark:text-white text-xs">Kwatha (Decoction)</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">1:16 water boiled to 1/4th</p>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">48 ml Dose</span>
              </div>
              <div className={`p-3 rounded-2xl border ${
                isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
              }`}>
                <p className="font-bold text-slate-900 dark:text-white text-xs">Hima (Cold Infusion)</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">1:6 cold water overnight</p>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">48 ml Dose</span>
              </div>
              <div className={`p-3 rounded-2xl border ${
                isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
              }`}>
                <p className="font-bold text-slate-900 dark:text-white text-xs">Phanta (Hot Infusion)</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">1:4 boiling water steeped</p>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">48 ml Dose</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
