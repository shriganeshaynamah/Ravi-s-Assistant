import React, { useState, useMemo } from 'react';
import type {
  LoanItem,
  InvestmentItem,
  ExpenseRecord,
  HabitItem,
  JournalEntry,
  DinacharyaLog,
  RoadmapMilestone,
} from '../types';
import {
  Sparkles,
  Bell,
  X,
  CreditCard,
  TrendingUp,
  Flame,
  BookOpen,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Bot,
  Zap,
  DollarSign,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import type { FeatureTab } from './HamburgerDrawer';

interface FloatingAIAssistantProps {
  loans: LoanItem[];
  investments: InvestmentItem[];
  expenses: ExpenseRecord[];
  habits: HabitItem[];
  journalEntries: JournalEntry[];
  dinacharyaLogs: DinacharyaLog[];
  milestones: RoadmapMilestone[];
  onNavigate: (tab: FeatureTab) => void;
  isDark?: boolean;
}

export interface SmartAlert {
  id: string;
  category: 'loan' | 'sip' | 'habit' | 'journal' | 'expense' | 'exam';
  title: string;
  message: string;
  severity: 'urgent' | 'warning' | 'info' | 'success';
  actionTab?: FeatureTab;
  actionLabel?: string;
}

export const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({
  loans,
  investments,
  expenses,
  habits,
  journalEntries,
  dinacharyaLogs,
  milestones,
  onNavigate,
  isDark = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'briefing'>('notifications');
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);
  const [aiBriefingText, setAiBriefingText] = useState<string | null>(null);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Compute live smart alerts tracking complete website things
  const alerts: SmartAlert[] = useMemo(() => {
    const list: SmartAlert[] = [];

    // 1. LOAN & EMI ALERTS
    loans.forEach((loan) => {
      const remaining = Math.max(0, loan.principalAmount - (loan.totalPaid || 0));
      if (remaining > 0) {
        if (loan.monthlyEmi && loan.monthlyEmi > 0) {
          list.push({
            id: `loan-emi-${loan.id}`,
            category: 'loan',
            title: `EMI Payment Due: ${loan.title}`,
            message: `Monthly EMI of ₹${loan.monthlyEmi.toLocaleString('en-IN')} is scheduled. Outstanding balance: ₹${remaining.toLocaleString('en-IN')}.`,
            severity: 'warning',
            actionTab: 'expense',
            actionLabel: 'View Loan',
          });
        }
      } else {
        list.push({
          id: `loan-paid-${loan.id}`,
          category: 'loan',
          title: `Loan Fully Paid: ${loan.title}`,
          message: `Congratulations! This debt of ₹${loan.principalAmount.toLocaleString('en-IN')} is 100% cleared.`,
          severity: 'success',
          actionTab: 'expense',
          actionLabel: 'View Breakdown',
        });
      }
    });

    // 2. INVESTMENT SIP ALERTS
    investments.forEach((inv) => {
      if (inv.sipMonthly && inv.sipMonthly > 0) {
        list.push({
          id: `sip-${inv.id}`,
          category: 'sip',
          title: `Monthly SIP Reminder: ${inv.title}`,
          message: `Active monthly installment of ₹${inv.sipMonthly.toLocaleString('en-IN')} on ${inv.platform}. Current valuation: ₹${inv.currentValue.toLocaleString('en-IN')}.`,
          severity: 'info',
          actionTab: 'expense',
          actionLabel: 'Investments',
        });
      }
    });

    // 3. HABIT TRACKER ALERTS (Track uncompleted daily habits for today)
    const pendingHabits = habits.filter((h) => !h.completedDates.includes(todayStr));
    if (pendingHabits.length > 0) {
      list.push({
        id: 'habits-pending-today',
        category: 'habit',
        title: `${pendingHabits.length} Daily Habits Pending Today`,
        message: `Incomplete: ${pendingHabits.map((h) => h.name).slice(0, 2).join(', ')}${pendingHabits.length > 2 ? '...' : ''}. Keep your daily discipline strong!`,
        severity: 'warning',
        actionTab: 'dinacharya',
        actionLabel: 'Mark Habits',
      });
    } else if (habits.length > 0) {
      list.push({
        id: 'habits-all-done',
        category: 'habit',
        title: 'All Daily Habits Completed! 🔥',
        message: `You have completed all ${habits.length} habits for today. Great dedication!`,
        severity: 'success',
        actionTab: 'dinacharya',
        actionLabel: 'View Streaks',
      });
    }

    // 4. DIARY / JOURNAL VAULT ALERT
    const wroteDiaryToday = journalEntries.some((e) => e.date === todayStr);
    if (!wroteDiaryToday) {
      list.push({
        id: 'journal-missing-today',
        category: 'journal',
        title: 'Daily Journal Entry Pending',
        message: "You haven't recorded today's diary in your personal vault yet. Pen your reflections and gratitude!",
        severity: 'info',
        actionTab: 'corners',
        actionLabel: 'Open Vault',
      });
    }

    // 5. EXPENSE & DAILY BUDGET WATCHDOG
    const todayExpenses = expenses.filter((e) => e.date === todayStr);
    const todayOutflow = todayExpenses
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);

    if (todayOutflow > 2500) {
      list.push({
        id: 'expense-high-today',
        category: 'expense',
        title: `High Daily Outflow Alert (₹${todayOutflow.toLocaleString('en-IN')})`,
        message: `Today's expenditure is elevated across ${todayExpenses.length} transactions. Check budget allocations.`,
        severity: 'warning',
        actionTab: 'expense',
        actionLabel: 'View Expenses',
      });
    }

    // 6. ACADEMIC ROADMAP ALERT
    const activeMilestone = milestones.find((m) => m.status === 'current');
    if (activeMilestone) {
      list.push({
        id: 'academic-proff',
        category: 'exam',
        title: `Academic Focus: ${activeMilestone.title}`,
        message: `${activeMilestone.description.slice(0, 80)}... Track your revision schedule.`,
        severity: 'info',
        actionTab: 'roadmap',
        actionLabel: 'View Roadmap',
      });
    }

    return list;
  }, [loans, investments, habits, journalEntries, expenses, milestones, todayStr]);

  const urgentCount = alerts.filter((a) => a.severity === 'urgent' || a.severity === 'warning').length;

  // Generate AI Daily Briefing
  const handleGenerateBriefing = () => {
    setIsGeneratingBriefing(true);
    setTimeout(() => {
      const completedHabits = habits.filter((h) => h.completedDates.includes(todayStr)).length;
      const totalDebt = loans.reduce((acc, l) => acc + l.principalAmount, 0);
      const totalDebtPaid = loans.reduce((acc, l) => acc + (l.totalPaid || 0), 0);
      const debtProgress = totalDebt > 0 ? Math.round((totalDebtPaid / totalDebt) * 100) : 0;
      const totalInvested = investments.reduce((acc, i) => acc + i.investedAmount, 0);
      const totalValuation = investments.reduce((acc, i) => acc + i.currentValue, 0);

      const briefing = `Namaste! Here is your real-time intelligence summary:

1. Financial Pulse:
• Loan Repayment: ₹${totalDebtPaid.toLocaleString('en-IN')} paid of ₹${totalDebt.toLocaleString('en-IN')} (${debtProgress}% debt-free progress).
• Investment Portfolio: ₹${totalInvested.toLocaleString('en-IN')} invested, currently valued at ₹${totalValuation.toLocaleString('en-IN')} (+₹${(totalValuation - totalInvested).toLocaleString('en-IN')}).

2. Daily Disciplines:
• Habits Completed: ${completedHabits} of ${habits.length} habits logged for today.
• Focus: Ensure Study 2hr daily and No Fap discipline are sustained to preserve Ojas and clinical sharpness.

3. Ayurvedic & Academic Regimen:
• BAMS Final Proff preparations are actively tracked in your Roadmap.
• Don't forget to pen your daily learnings in the 0002 Personal Diary Vault!`;

      setAiBriefingText(briefing);
      setIsGeneratingBriefing(false);
    }, 600);
  };

  return (
    <>
      {/* Small Floating Circular Button (Bottom Right, above fixed footer) */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!aiBriefingText) handleGenerateBriefing();
          }}
          className="relative group p-3.5 rounded-full bg-linear-to-tr from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center"
          title="AI Assistant & Smart Notifications"
        >
          {/* Subtle outer breathing glow pulse */}
          <span className="absolute -inset-1 rounded-full bg-emerald-400/30 animate-ping opacity-60 pointer-events-none" />

          <Sparkles className="w-5 h-5 text-white" />

          {/* Alert badge counter */}
          {alerts.length > 0 && (
            <span
              className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-md ${
                urgentCount > 0 ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'
              }`}
            >
              {alerts.length}
            </span>
          )}
        </button>
      </div>

      {/* Floating AI Panel / Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 space-y-4 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>AI Assistant & Notifications</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      Live
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    Tracking EMIs, SIPs, habits & daily vault
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-tabs: Notifications vs AI Briefing */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'notifications'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Alerts ({alerts.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('briefing');
                  if (!aiBriefingText) handleGenerateBriefing();
                }}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'briefing'
                    ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Briefing</span>
              </button>
            </div>

            {/* Body Area */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
              {activeTab === 'notifications' && (
                <div className="space-y-2">
                  {alerts.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                      <p className="font-bold text-slate-600 dark:text-slate-300">All clear! No pending alerts.</p>
                      <p className="text-[11px]">Everything on the website is currently on track.</p>
                    </div>
                  ) : (
                    alerts.map((alert) => {
                      const isWarn = alert.severity === 'warning' || alert.severity === 'urgent';
                      const isSuccess = alert.severity === 'success';

                      return (
                        <div
                          key={alert.id}
                          className={`p-3 rounded-2xl border text-xs space-y-1.5 transition-all ${
                            isWarn
                              ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                              : isSuccess
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5 font-bold">
                              {alert.category === 'loan' && (
                                <CreditCard className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              )}
                              {alert.category === 'sip' && (
                                <TrendingUp className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                              )}
                              {alert.category === 'habit' && (
                                <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              )}
                              {alert.category === 'journal' && (
                                <BookOpen className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                              )}
                              {alert.category === 'expense' && (
                                <DollarSign className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              )}
                              {alert.category === 'exam' && (
                                <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              )}
                              <span
                                className={`text-[11px] ${
                                  isWarn
                                    ? 'text-amber-900 dark:text-amber-300'
                                    : isSuccess
                                    ? 'text-emerald-900 dark:text-emerald-300'
                                    : 'text-slate-900 dark:text-white'
                                }`}
                              >
                                {alert.title}
                              </span>
                            </div>

                            {alert.actionTab && (
                              <button
                                onClick={() => {
                                  onNavigate(alert.actionTab!);
                                  setIsOpen(false);
                                }}
                                className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center shrink-0 cursor-pointer"
                              >
                                <span>{alert.actionLabel || 'View'}</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                            {alert.message}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === 'briefing' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Live AI Synthesis
                    </span>
                    <button
                      onClick={handleGenerateBriefing}
                      disabled={isGeneratingBriefing}
                      className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <RefreshCw className={`w-3 h-3 ${isGeneratingBriefing ? 'animate-spin' : ''}`} />
                      <span>Refresh Briefing</span>
                    </button>
                  </div>

                  {isGeneratingBriefing ? (
                    <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                      <Sparkles className="w-6 h-6 text-emerald-500 animate-spin mx-auto" />
                      <p>Synthesizing complete website health...</p>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-sans text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {aiBriefingText}
                    </div>
                  )}

                  {/* Quick Shortcut Buttons */}
                  <div className="pt-1 grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => {
                        onNavigate('expense');
                        setIsOpen(false);
                      }}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-rose-500" />
                      <span>Loans & EMI</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('dinacharya');
                        setIsOpen(false);
                      }}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>Habits</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('corners');
                        setIsOpen(false);
                      }}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                      <span>0002 Vault</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('roadmap');
                        setIsOpen(false);
                      }}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-teal-500" />
                      <span>Roadmap</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
