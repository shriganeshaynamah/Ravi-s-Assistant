import React, { useState, useMemo, useEffect } from 'react';
import type { ExpenseRecord, LoanItem, InvestmentItem, LoanPaymentRecord, InvestmentTransactionRecord } from '../types';
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  FileSpreadsheet,
  Calculator,
  ExternalLink,
  PieChart,
  BarChart2,
  Calendar,
  CheckCircle2,
  X,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Coins,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Receipt,
  Info,
  Sparkles,
} from 'lucide-react';
import {
  exportMultiSectionToGoogleSheets,
  exportExpensesToGoogleSheets,
  MASTER_SHEET_KEY,
  getMasterSpreadsheetUrl,
  getMonthly5thAutoSyncStatus,
  checkAndRunMonthly5thSheetAutoSync,
} from '../services/googleSheets';
import {
  getAllArchivedAndCurrentExpenses,
  syncExpensesToMonthlyArchive,
  removeExpenseFromMonthlyArchive,
  clearAllMonthlyArchivedExpenses,
} from '../services/storage';
import { ConfirmationModal } from './ConfirmationModal';
import type { User } from 'firebase/auth';

interface ExpenseManagerViewProps {
  expenses: ExpenseRecord[];
  loans: LoanItem[];
  investments: InvestmentItem[];
  onAddExpense: (rec: ExpenseRecord) => void;
  onDeleteExpense: (id: string) => void;
  onAddLoan: (loan: LoanItem) => void;
  onUpdateLoan: (loan: LoanItem) => void;
  onDeleteLoan: (id: string) => void;
  onAddInvestment: (inv: InvestmentItem) => void;
  onUpdateInvestment: (inv: InvestmentItem) => void;
  onDeleteInvestment: (id: string) => void;
  user: User | null;
  onRequireAuth: () => void;
  isDark: boolean;
  initialTab?: 'expenses' | 'loans' | 'investments';
}

export const ExpenseManagerView: React.FC<ExpenseManagerViewProps> = ({
  expenses,
  loans,
  investments,
  onAddExpense,
  onDeleteExpense,
  onAddLoan,
  onUpdateLoan,
  onDeleteLoan,
  onAddInvestment,
  onUpdateInvestment,
  onDeleteInvestment,
  user,
  onRequireAuth,
  isDark,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<'expenses' | 'loans' | 'investments'>(
    initialTab || 'expenses'
  );

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Dates & Current Month Info
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const currentYearMonth = todayStr.slice(0, 7); // e.g. "2026-10"
  const currentMonthName = today.toLocaleString('en-US', { month: 'long' }); // e.g. "October"
  const currentMonthStartStr = `${currentYearMonth}-01`;
  const currentMonthLastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const currentMonthEndStr = `${currentYearMonth}-${String(currentMonthLastDay).padStart(2, '0')}`;

  // Analysis State: Month or Date range from calendar (defaults to Current Month)
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [selectedAnalysisMonth, setSelectedAnalysisMonth] = useState<string>(currentYearMonth);
  const [analysisStartDate, setAnalysisStartDate] = useState<string>(currentMonthStartStr);
  const [analysisEndDate, setAnalysisEndDate] = useState<string>(currentMonthEndStr);
  const [dailyViewFilter, setDailyViewFilter] = useState<'month' | 'today'>('month');

  // Loan 4:5 Slider & Repayment State
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(loans[0]?.id || null);
  const [loanActiveIndex, setLoanActiveIndex] = useState(0);
  const [isLoanAutoSlide, setIsLoanAutoSlide] = useState(true);

  // Sync selected loan
  useEffect(() => {
    if (loans.length > 0) {
      if (!selectedLoanId || !loans.some((l) => l.id === selectedLoanId)) {
        setSelectedLoanId(loans[0].id);
        setLoanActiveIndex(0);
      }
    } else {
      setSelectedLoanId(null);
    }
  }, [loans, selectedLoanId]);

  // Loan Auto-slide effect (every 5 seconds)
  useEffect(() => {
    if (!isLoanAutoSlide || loans.length <= 1) return;
    const timer = setInterval(() => {
      setLoanActiveIndex((prev) => (prev + 1) % loans.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isLoanAutoSlide, loans.length]);

  // Quick Pay State (inside the selected loan breakdown)
  const [quickPayAmount, setQuickPayAmount] = useState<string>('');
  const [quickPayDate, setQuickPayDate] = useState<string>(todayStr);
  const [quickPayNote, setQuickPayNote] = useState<string>('Repayment payment');

  // Repayment editing & deletion state
  const [editingRepayment, setEditingRepayment] = useState<{
    loanId: string;
    repayment: LoanPaymentRecord;
  } | null>(null);
  const [editRepaymentAmount, setEditRepaymentAmount] = useState<string>('');
  const [editRepaymentDate, setEditRepaymentDate] = useState<string>('');
  const [editRepaymentNote, setEditRepaymentNote] = useState<string>('');
  const [repaymentToDelete, setRepaymentToDelete] = useState<{
    loanId: string;
    paymentId: string;
    amount: number;
    date: string;
  } | null>(null);

  // Investment 4:5 Slider & SIP State
  const [selectedInvId, setSelectedInvId] = useState<string | null>(investments[0]?.id || null);
  const [invActiveIndex, setInvActiveIndex] = useState(0);
  const [isInvAutoSlide, setIsInvAutoSlide] = useState(true);

  // Sync selected investment
  useEffect(() => {
    if (investments.length > 0) {
      if (!selectedInvId || !investments.some((i) => i.id === selectedInvId)) {
        setSelectedInvId(investments[0].id);
        setInvActiveIndex(0);
      }
    } else {
      setSelectedInvId(null);
    }
  }, [investments, selectedInvId]);

  // Investment Auto-slide effect (every 5 seconds)
  useEffect(() => {
    if (!isInvAutoSlide || investments.length <= 1) return;
    const timer = setInterval(() => {
      setInvActiveIndex((prev) => (prev + 1) % investments.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isInvAutoSlide, investments.length]);

  // Quick SIP Add state
  const [quickSipAmount, setQuickSipAmount] = useState<string>('');
  const [quickSipDate, setQuickSipDate] = useState<string>(todayStr);
  const [quickSipNote, setQuickSipNote] = useState<string>('Monthly SIP installment');

  // SIP/Transaction editing & deletion state
  const [editingTransaction, setEditingTransaction] = useState<{
    invId: string;
    tx: InvestmentTransactionRecord;
  } | null>(null);
  const [editTxAmount, setEditTxAmount] = useState<string>('');
  const [editTxDate, setEditTxDate] = useState<string>('');
  const [editTxNote, setEditTxNote] = useState<string>('');
  const [txToDelete, setTxToDelete] = useState<{
    invId: string;
    txId: string;
    amount: number;
    date: string;
  } | null>(null);

  // Modals
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddLoanOpen, setIsAddLoanOpen] = useState(false);
  const [isAddInvestmentOpen, setIsAddInvestmentOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<LoanItem | null>(null);
  const [editingInvestment, setEditingInvestment] = useState<InvestmentItem | null>(null);

  // Deletion modals
  const [expenseToDelete, setExpenseToDelete] = useState<ExpenseRecord | null>(null);
  const [loanToDelete, setLoanToDelete] = useState<LoanItem | null>(null);
  const [investmentToDelete, setInvestmentToDelete] = useState<InvestmentItem | null>(null);

  // Calculators toggles (without "Open" prefix)
  const [showEmiCalculator, setShowEmiCalculator] = useState(false);
  const [showSipCalculator, setShowSipCalculator] = useState(false);

  // EMI Calculator State
  const [calcPrincipal, setCalcPrincipal] = useState<number>(300000);
  const [calcRate, setCalcRate] = useState<number>(8.5);
  const [calcTenure, setCalcTenure] = useState<number>(36);

  // SIP Calculator State
  const [calcSipAmount, setCalcSipAmount] = useState<number>(5000);
  const [calcSipRate, setCalcSipRate] = useState<number>(13.5);
  const [calcSipYears, setCalcSipYears] = useState<number>(5);

  // Google Sheets Export
  const [isExporting, setIsExporting] = useState(false);
  const [exportedSheetUrl, setExportedSheetUrl] = useState<string | null>(() => getMasterSpreadsheetUrl());
  const [monthly5thStatus, setMonthly5thStatus] = useState(() => getMonthly5thAutoSyncStatus());

  // Permanently sync current expenses into the multi-month archive and load all historical + current expenses
  const allHistoricalAndCurrentExpenses = useMemo(() => {
    syncExpensesToMonthlyArchive(expenses);
    return getAllArchivedAndCurrentExpenses(expenses);
  }, [expenses]);

  // Auto-update to Google Sheet every 5th of the month
  useEffect(() => {
    checkAndRunMonthly5thSheetAutoSync({
      expenses: allHistoricalAndCurrentExpenses,
      investments,
      loans,
    }).then((res) => {
      if (res.synced && res.spreadsheetUrl) {
        setExportedSheetUrl(res.spreadsheetUrl);
        setMonthly5thStatus(getMonthly5thAutoSyncStatus());
      }
    });
  }, [allHistoricalAndCurrentExpenses, investments, loans]);

  // Helper to select a specific month (YYYY-MM) for Expense Analysis
  const handleSelectAnalysisMonth = (ym: string) => {
    setSelectedAnalysisMonth(ym);
    if (!ym || ym === 'all') {
      setAnalysisStartDate('');
      setAnalysisEndDate('');
      return;
    }
    const [yStr, mStr] = ym.split('-');
    const y = parseInt(yStr, 10);
    const m = parseInt(mStr, 10);
    if (!isNaN(y) && !isNaN(m)) {
      const lastDay = new Date(y, m, 0).getDate();
      setAnalysisStartDate(`${ym}-01`);
      setAnalysisEndDate(`${ym}-${String(lastDay).padStart(2, '0')}`);
    }
  };

  // Available months from stored + archived expenses (plus current & previous month options)
  const availableAnalysisMonths = useMemo(() => {
    const monthSet = new Set<string>();
    monthSet.add(currentYearMonth);
    const prevDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const prevYm = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
    monthSet.add(prevYm);
    allHistoricalAndCurrentExpenses.forEach((e) => {
      const ym = (e.date || '').slice(0, 7);
      if (/^\d{4}-\d{2}$/.test(ym)) monthSet.add(ym);
    });
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return Array.from(monthSet)
      .sort((a, b) => b.localeCompare(a))
      .map((ym) => {
        const [y, m] = ym.split('-');
        const label = `${monthNames[parseInt(m, 10) - 1] || m} ${y}`;
        return { ym, label };
      });
  }, [allHistoricalAndCurrentExpenses, currentYearMonth]);

  // Current Month Expenses & Metrics (Displayed on Daily Expense Page)
  const currentMonthExpenses = useMemo(() => {
    return allHistoricalAndCurrentExpenses.filter((e) => (e.date || '').startsWith(currentYearMonth));
  }, [allHistoricalAndCurrentExpenses, currentYearMonth]);

  const currentMonthInflow = useMemo(() => {
    return currentMonthExpenses
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [currentMonthExpenses]);

  const currentMonthOutflow = useMemo(() => {
    return currentMonthExpenses
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [currentMonthExpenses]);

  const currentMonthBalance = currentMonthInflow - currentMonthOutflow;

  // Today's Expenses
  const dailyExpenses = useMemo(() => {
    return allHistoricalAndCurrentExpenses.filter((e) => e.date === todayStr);
  }, [allHistoricalAndCurrentExpenses, todayStr]);

  const displayedDailyTabExpenses = useMemo(() => {
    return dailyViewFilter === 'month' ? currentMonthExpenses : dailyExpenses;
  }, [dailyViewFilter, currentMonthExpenses, dailyExpenses]);

  // Analysis Filtered Expenses based on selected Month or custom Calendar Date Range (searches across all stored & previous months' expenses)
  const analysisExpenses = useMemo(() => {
    return allHistoricalAndCurrentExpenses.filter((e) => {
      if (!analysisStartDate && !analysisEndDate) return true;
      if (analysisStartDate && analysisEndDate) {
        return e.date >= analysisStartDate && e.date <= analysisEndDate;
      }
      if (analysisStartDate) return e.date >= analysisStartDate;
      if (analysisEndDate) return e.date <= analysisEndDate;
      return true;
    });
  }, [allHistoricalAndCurrentExpenses, analysisStartDate, analysisEndDate]);

  const analysisInflow = useMemo(() => {
    return analysisExpenses.filter((e) => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  }, [analysisExpenses]);

  const analysisOutflow = useMemo(() => {
    return analysisExpenses.filter((e) => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  }, [analysisExpenses]);

  const analysisNet = analysisInflow - analysisOutflow;

  // 1. Category-wise Analysis
  const categoryBreakdown = useMemo(() => {
    const totals: Record<string, number> = {};
    analysisExpenses
      .filter((e) => e.type === 'expense')
      .forEach((e) => {
        totals[e.category] = (totals[e.category] || 0) + e.amount;
      });

    const entries = Object.entries(totals).map(([category, amount]) => {
      const percentage = analysisOutflow > 0 ? Math.round((amount / analysisOutflow) * 100) : 0;
      return { category, amount, percentage };
    });

    entries.sort((a, b) => b.amount - a.amount);
    return entries;
  }, [analysisExpenses, analysisOutflow]);

  // Color mapping for category circle chart
  const categoryColors: Record<string, string> = {
    food_dining: '#10b981', // emerald
    study_books: '#6366f1', // indigo
    travel_commute: '#06b6d4', // cyan
    living_personal: '#f59e0b', // amber
    clinic_consultation: '#ec4899', // pink
    loan_emi: '#f43f5e', // rose
    investment: '#8b5cf6', // purple
    other: '#94a3b8', // slate
  };

  // 2. Day of Week Analysis (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday)
  const dayOfWeekAnalysis = useMemo(() => {
    const days = [
      { key: 1, name: 'Monday', short: 'Mon', total: 0 },
      { key: 2, name: 'Tuesday', short: 'Tue', total: 0 },
      { key: 3, name: 'Wednesday', short: 'Wed', total: 0 },
      { key: 4, name: 'Thursday', short: 'Thu', total: 0 },
      { key: 5, name: 'Friday', short: 'Fri', total: 0 },
      { key: 6, name: 'Saturday', short: 'Sat', total: 0 },
      { key: 0, name: 'Sunday', short: 'Sun', total: 0 },
    ];

    analysisExpenses
      .filter((e) => e.type === 'expense')
      .forEach((e) => {
        const d = new Date(e.date);
        const dayIdx = d.getDay();
        const found = days.find((item) => item.key === dayIdx);
        if (found) found.total += e.amount;
      });

    const maxDayTotal = Math.max(1, ...days.map((d) => d.total));
    const highestDay = [...days].sort((a, b) => b.total - a.total)[0];

    return { days, maxDayTotal, highestDay };
  }, [analysisExpenses]);

  // 3. Monthly / Timeline Breakdown (Compares all stored months + selected range)
  const monthlyAnalysis = useMemo(() => {
    const monthTotals: Record<string, { expense: number; income: number }> = {};

    allHistoricalAndCurrentExpenses.forEach((e) => {
      const monthKey = (e.date || '').substring(0, 7); // YYYY-MM
      if (!/^\d{4}-\d{2}$/.test(monthKey)) return;
      if (!monthTotals[monthKey]) {
        monthTotals[monthKey] = { expense: 0, income: 0 };
      }
      if (e.type === 'expense') {
        monthTotals[monthKey].expense += e.amount;
      } else {
        monthTotals[monthKey].income += e.amount;
      }
    });

    const sortedMonths = Object.entries(monthTotals)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([monthKey, vals]) => {
        const [y, m] = monthKey.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const label = `${monthNames[parseInt(m, 10) - 1]} ${y}`;
        return {
          monthKey,
          label,
          total: vals.expense,
          income: vals.income,
          balance: vals.income - vals.expense,
        };
      });

    const maxMonthTotal = Math.max(1, ...sortedMonths.map((m) => m.total));
    const highestMonth = [...sortedMonths].sort((a, b) => b.total - a.total)[0];

    return { sortedMonths, maxMonthTotal, highestMonth };
  }, [allHistoricalAndCurrentExpenses]);

  // Calculate EMI
  const calculateEmi = (p: number, r: number, n: number) => {
    if (!p || !r || !n) return { emi: 0, totalInterest: 0, totalPay: 0 };
    const monthlyRate = r / 12 / 100;
    const emi = (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const totalPay = emi * n;
    const totalInterest = totalPay - p;
    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPay: Math.round(totalPay),
    };
  };

  // Calculate SIP
  const calculateSip = (monthly: number, annualRate: number, years: number) => {
    const months = years * 12;
    const monthlyRate = annualRate / 12 / 100;
    const invested = monthly * months;
    const futureValue =
      monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const wealthGain = futureValue - invested;
    return {
      invested: Math.round(invested),
      wealthGain: Math.round(wealthGain),
      futureValue: Math.round(futureValue),
    };
  };

  const emiResult = calculateEmi(calcPrincipal, calcRate, calcTenure);
  const sipResult = calculateSip(calcSipAmount, calcSipRate, calcSipYears);

  // Form states for Expense / Income
  const [formType, setFormType] = useState<'income' | 'expense'>('expense');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState<ExpenseRecord['category']>('food_dining');
  const [formDesc, setFormDesc] = useState('');
  const [formDate, setFormDate] = useState(todayStr);
  const [formPaymentMode, setFormPaymentMode] = useState<ExpenseRecord['paymentMode']>('upi');

  // Form states for Loan (includes Date of Borrow and Date when user pays)
  const [loanTitle, setLoanTitle] = useState('');
  const [loanLender, setLoanLender] = useState('');
  const [loanPrincipal, setLoanPrincipal] = useState('');
  const [loanRate, setLoanRate] = useState('');
  const [loanTenure, setLoanTenure] = useState('');
  const [loanEmi, setLoanEmi] = useState('');
  const [loanTotalPaid, setLoanTotalPaid] = useState('');
  const [loanStatus, setLoanStatus] = useState<LoanItem['status']>('active');
  const [loanBorrowDate, setLoanBorrowDate] = useState(todayStr);
  const [loanLastPaidDate, setLoanLastPaidDate] = useState(todayStr);

  // Form states for Investment
  const [invTitle, setInvTitle] = useState('');
  const [invPlatform, setInvPlatform] = useState('Groww');
  const [invCategory, setInvCategory] = useState<InvestmentItem['category']>('mutual_fund');
  const [invInvested, setInvInvested] = useState('');
  const [invCurrent, setInvCurrent] = useState('');
  const [invReturnRate, setInvReturnRate] = useState('13.5');
  const [invSip, setInvSip] = useState('');
  const [invInvestDate, setInvInvestDate] = useState(todayStr);
  const [invLastAddDate, setInvLastAddDate] = useState(todayStr);
  const [invLastWithdrawDate, setInvLastWithdrawDate] = useState('');
  const [invActionType, setInvActionType] = useState<'add' | 'withdraw'>('add');
  const [invActionAmount, setInvActionAmount] = useState('');
  const [invActionDate, setInvActionDate] = useState(todayStr);

  const [isClearAllExpensesOpen, setIsClearAllExpensesOpen] = useState(false);
  const [isClearAllInvestmentsOpen, setIsClearAllInvestmentsOpen] = useState(false);

  const handleExportSheets = async () => {
    if (!user) {
      onRequireAuth();
      return;
    }
    setIsExporting(true);
    try {
      const res = await exportMultiSectionToGoogleSheets({
        expenses: allHistoricalAndCurrentExpenses,
        investments,
        loans,
      });
      setExportedSheetUrl(res.spreadsheetUrl);
      setMonthly5thStatus(getMonthly5thAutoSyncStatus());
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleConfirmClearAllExpenses = () => {
    clearAllMonthlyArchivedExpenses();
    expenses.forEach((e) => onDeleteExpense(e.id));
    if (user && localStorage.getItem(MASTER_SHEET_KEY)) {
      exportMultiSectionToGoogleSheets({
        expenses: [],
        investments,
        loans,
      }).catch(() => {});
    }
    setIsClearAllExpensesOpen(false);
  };

  const handleConfirmClearAllInvestments = () => {
    investments.forEach((inv) => onDeleteInvestment(inv.id));
    if (user && localStorage.getItem(MASTER_SHEET_KEY)) {
      exportMultiSectionToGoogleSheets({
        expenses,
        investments: [],
        loans,
      }).catch(() => {});
    }
    setIsClearAllInvestmentsOpen(false);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(formAmount);
    if (!amountNum) return;

    // For income: category is automatically defaulted since it plays no role
    const finalCategory = formType === 'income' ? 'other' : formCategory;
    const finalDesc = formDesc.trim() || (formType === 'income' ? 'Income credit' : `${formCategory.replace('_', ' ')} record`);

    onAddExpense({
      id: `exp-${Date.now()}`,
      date: formDate,
      type: formType,
      amount: amountNum,
      category: finalCategory,
      description: finalDesc,
      paymentMode: formPaymentMode,
    });

    setIsAddExpenseOpen(false);
    setFormAmount('');
    setFormDesc('');
  };

  const openLoanModal = (loan?: LoanItem) => {
    if (loan) {
      setEditingLoan(loan);
      setLoanTitle(loan.title);
      setLoanLender(loan.lender);
      setLoanPrincipal(loan.principalAmount.toString());
      setLoanRate(loan.interestRate.toString());
      setLoanTenure(loan.tenureMonths.toString());
      setLoanEmi(loan.monthlyEmi ? loan.monthlyEmi.toString() : '');
      setLoanTotalPaid(loan.totalPaid.toString());
      setLoanStatus(loan.status);
      setLoanBorrowDate(loan.borrowDate || loan.startDate || todayStr);
      setLoanLastPaidDate(loan.lastPaidDate || todayStr);
    } else {
      setEditingLoan(null);
      setLoanTitle('');
      setLoanLender('');
      setLoanPrincipal('');
      setLoanRate('8.5');
      setLoanTenure('36');
      setLoanEmi('');
      setLoanTotalPaid('0');
      setLoanStatus('active');
      setLoanBorrowDate(todayStr);
      setLoanLastPaidDate(todayStr);
    }
    setIsAddLoanOpen(true);
  };

  const handleSaveLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(loanPrincipal);
    const r = parseFloat(loanRate) || 8.5;
    const t = parseInt(loanTenure, 10) || 36;
    const autoCalcEmi = calculateEmi(p, r, t).emi;
    const totalPaidNum = parseFloat(loanTotalPaid) || 0;

    const autoStatus = totalPaidNum >= p && p > 0 ? 'full_paid' : totalPaidNum > 0 ? 'partially_paid' : 'active';

    const loanObj: LoanItem = {
      id: editingLoan ? editingLoan.id : `loan-${Date.now()}`,
      title: loanTitle.trim() || 'Education / Medical Equipment Loan',
      lender: loanLender.trim() || 'Bank',
      principalAmount: p,
      interestRate: r,
      tenureMonths: t,
      monthlyEmi: loanEmi ? parseFloat(loanEmi) : autoCalcEmi,
      totalPaid: totalPaidNum,
      status: autoStatus,
      startDate: loanBorrowDate,
      borrowDate: loanBorrowDate,
      lastPaidDate: loanLastPaidDate,
      dueDateDay: 10,
      paymentHistory: editingLoan?.paymentHistory || [],
    };

    if (editingLoan) {
      onUpdateLoan(loanObj);
    } else {
      onAddLoan(loanObj);
    }
    setIsAddLoanOpen(false);
    setEditingLoan(null);
  };

  // Helper for loan auto-status
  const getLoanAutoStatus = (loan: LoanItem) => {
    if (loan.totalPaid >= loan.principalAmount && loan.principalAmount > 0) {
      return {
        key: 'full_paid' as const,
        label: 'Fully Paid',
        badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
      };
    }
    if (loan.totalPaid > 0) {
      return {
        key: 'partially_paid' as const,
        label: 'Partially Paid',
        badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
      };
    }
    return {
      key: 'active' as const,
      label: 'Active',
      badgeClass: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
    };
  };

  // Quick inline add payment inside the expanded loan details
  const handleQuickAddPayment = (loan: LoanItem) => {
    const amt = parseFloat(quickPayAmount);
    if (!amt || amt <= 0) return;

    const newRecord: LoanPaymentRecord = {
      id: `pay-${Date.now()}`,
      amount: amt,
      date: quickPayDate,
      notes: quickPayNote.trim() || 'Payment recorded',
    };

    const updatedHistory = [newRecord, ...(loan.paymentHistory || [])];
    const newTotalPaid = updatedHistory.reduce((sum, p) => sum + p.amount, 0);
    const newStatus =
      newTotalPaid >= loan.principalAmount ? 'full_paid' : newTotalPaid > 0 ? 'partially_paid' : 'active';

    const updatedLoan: LoanItem = {
      ...loan,
      totalPaid: newTotalPaid,
      lastPaidDate: quickPayDate,
      status: newStatus,
      paymentHistory: updatedHistory,
    };

    onUpdateLoan(updatedLoan);
    setQuickPayAmount('');
    setQuickPayNote('Repayment payment');
  };

  // Open Edit Repayment Modal
  const openEditRepaymentModal = (loanId: string, repayment: LoanPaymentRecord) => {
    setEditingRepayment({ loanId, repayment });
    setEditRepaymentAmount(repayment.amount.toString());
    setEditRepaymentDate(repayment.date);
    setEditRepaymentNote(repayment.notes || '');
  };

  // Save Edited Repayment
  const handleSaveEditedRepayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRepayment) return;
    const { loanId, repayment } = editingRepayment;
    const targetLoan = loans.find((l) => l.id === loanId);
    if (!targetLoan) return;

    const newAmt = parseFloat(editRepaymentAmount) || repayment.amount;
    const newDate = editRepaymentDate || repayment.date;
    const newNote = editRepaymentNote.trim() || 'Payment recorded';

    const updatedPayments = (targetLoan.paymentHistory || []).map((p) =>
      p.id === repayment.id
        ? { ...p, amount: newAmt, date: newDate, notes: newNote }
        : p
    );

    const newTotalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
    const newStatus =
      newTotalPaid >= targetLoan.principalAmount ? 'full_paid' : newTotalPaid > 0 ? 'partially_paid' : 'active';

    const updatedLoan: LoanItem = {
      ...targetLoan,
      totalPaid: newTotalPaid,
      status: newStatus,
      paymentHistory: updatedPayments,
      lastPaidDate: newDate,
    };

    onUpdateLoan(updatedLoan);
    setEditingRepayment(null);
  };

  // Delete Repayment
  const handleDeleteRepayment = () => {
    if (!repaymentToDelete) return;
    const { loanId, paymentId } = repaymentToDelete;
    const targetLoan = loans.find((l) => l.id === loanId);
    if (!targetLoan) return;

    const updatedPayments = (targetLoan.paymentHistory || []).filter((p) => p.id !== paymentId);
    const newTotalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
    const newStatus =
      newTotalPaid >= targetLoan.principalAmount ? 'full_paid' : newTotalPaid > 0 ? 'partially_paid' : 'active';

    const updatedLoan: LoanItem = {
      ...targetLoan,
      totalPaid: newTotalPaid,
      status: newStatus,
      paymentHistory: updatedPayments,
    };

    onUpdateLoan(updatedLoan);
    setRepaymentToDelete(null);
  };

  // Quick Add SIP / Deposit Installment
  const handleQuickAddSip = (inv: InvestmentItem) => {
    const amt = parseFloat(quickSipAmount);
    if (!amt || amt <= 0) return;

    const newRecord: InvestmentTransactionRecord = {
      id: `tx-${Date.now()}`,
      type: 'add',
      amount: amt,
      date: quickSipDate,
      notes: quickSipNote.trim() || 'Monthly SIP installment',
    };

    const updatedHistory = [newRecord, ...(inv.transactionHistory || [])];
    const newInvested = inv.investedAmount + amt;
    const newCurrent = inv.currentValue + amt;

    const updatedInv: InvestmentItem = {
      ...inv,
      investedAmount: newInvested,
      currentValue: newCurrent,
      lastAddDate: quickSipDate,
      transactionHistory: updatedHistory,
    };

    onUpdateInvestment(updatedInv);
    setQuickSipAmount('');
    setQuickSipNote('Monthly SIP installment');
  };

  // Open Edit Transaction Modal
  const openEditTxModal = (invId: string, tx: InvestmentTransactionRecord) => {
    setEditingTransaction({ invId, tx });
    setEditTxAmount(tx.amount.toString());
    setEditTxDate(tx.date);
    setEditTxNote(tx.notes || '');
  };

  // Save Edited Transaction
  const handleSaveEditedTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction) return;
    const { invId, tx } = editingTransaction;
    const targetInv = investments.find((i) => i.id === invId);
    if (!targetInv) return;

    const newAmt = parseFloat(editTxAmount) || tx.amount;
    const newDate = editTxDate || tx.date;
    const newNote = editTxNote.trim() || 'Transaction recorded';
    const diff = newAmt - tx.amount;

    const updatedHistory = (targetInv.transactionHistory || []).map((t) =>
      t.id === tx.id ? { ...t, amount: newAmt, date: newDate, notes: newNote } : t
    );

    const updatedInv: InvestmentItem = {
      ...targetInv,
      investedAmount: Math.max(0, targetInv.investedAmount + diff),
      currentValue: Math.max(0, targetInv.currentValue + diff),
      lastAddDate: newDate,
      transactionHistory: updatedHistory,
    };

    onUpdateInvestment(updatedInv);
    setEditingTransaction(null);
  };

  // Delete Transaction
  const handleDeleteTx = () => {
    if (!txToDelete) return;
    const { invId, txId, amount } = txToDelete;
    const targetInv = investments.find((i) => i.id === invId);
    if (!targetInv) return;

    const updatedHistory = (targetInv.transactionHistory || []).filter((t) => t.id !== txId);
    const updatedInv: InvestmentItem = {
      ...targetInv,
      investedAmount: Math.max(0, targetInv.investedAmount - amount),
      currentValue: Math.max(0, targetInv.currentValue - amount),
      transactionHistory: updatedHistory,
    };

    onUpdateInvestment(updatedInv);
    setTxToDelete(null);
  };

  const openInvestmentModal = (inv?: InvestmentItem) => {
    if (inv) {
      setEditingInvestment(inv);
      setInvTitle(inv.title);
      setInvPlatform(inv.platform);
      setInvCategory(inv.category);
      setInvInvested(inv.investedAmount.toString());
      setInvCurrent(inv.currentValue.toString());
      setInvReturnRate(inv.expectedReturnRate.toString());
      setInvSip(inv.sipMonthly ? inv.sipMonthly.toString() : '');
      setInvInvestDate(inv.investDate || inv.startDate || todayStr);
      setInvLastAddDate(inv.lastAddDate || todayStr);
      setInvLastWithdrawDate(inv.lastWithdrawDate || '');
    } else {
      setEditingInvestment(null);
      setInvTitle('');
      setInvPlatform('Groww');
      setInvCategory('mutual_fund');
      setInvInvested('');
      setInvCurrent('');
      setInvReturnRate('13.5');
      setInvSip('5000');
      setInvInvestDate(todayStr);
      setInvLastAddDate(todayStr);
      setInvLastWithdrawDate('');
    }
    setInvActionAmount('');
    setIsAddInvestmentOpen(true);
  };

  const handleSaveInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    let investedNum = parseFloat(invInvested) || 0;
    let currentNum = parseFloat(invCurrent) || investedNum;
    let lastAdd = invLastAddDate;
    let lastWithdraw = invLastWithdrawDate;

    if (invActionAmount && parseFloat(invActionAmount) > 0) {
      const amt = parseFloat(invActionAmount);
      if (invActionType === 'add') {
        investedNum += amt;
        currentNum += amt;
        lastAdd = invActionDate;
      } else {
        currentNum = Math.max(0, currentNum - amt);
        lastWithdraw = invActionDate;
      }
    }

    const invObj: InvestmentItem = {
      id: editingInvestment ? editingInvestment.id : `inv-${Date.now()}`,
      title: invTitle.trim() || 'Investment Asset',
      platform: invPlatform.trim() || 'Groww',
      category: invCategory,
      investedAmount: investedNum,
      currentValue: currentNum,
      expectedReturnRate: parseFloat(invReturnRate) || 12,
      sipMonthly: parseFloat(invSip) || 0,
      startDate: invInvestDate,
      investDate: invInvestDate,
      lastAddDate: lastAdd,
      lastWithdrawDate: lastWithdraw,
    };

    if (editingInvestment) {
      onUpdateInvestment(invObj);
    } else {
      onAddInvestment(invObj);
    }
    setIsAddInvestmentOpen(false);
    setEditingInvestment(null);
  };

  // Helper for quick range preset clicks
  const setRangePreset = (days: number) => {
    const end = new Date();
    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
    setAnalysisStartDate(start.toISOString().split('T')[0]);
    setAnalysisEndDate(end.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            Finance &amp; Expenses
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Daily transactions, loan EMI schedules &amp; wealth growth
          </p>
        </div>

        <button
          onClick={handleExportSheets}
          disabled={isExporting}
          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          title="Export to Google Sheets"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Google Sheets</span>
        </button>
      </div>

      {exportedSheetUrl && (
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between gap-2">
          <span>Synced! Section pages updated &amp; deleted items erased from sheet.</span>
          <a
            href={exportedSheetUrl}
            target="_blank"
            rel="noreferrer"
            className="font-bold underline flex items-center gap-1"
          >
            <span>Open Sheet</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* 3 Main Sub-Tabs: Daily Expenses | Loans | Investment & Sip */}
      <div className="flex rounded-xl p-0.5 bg-slate-200 dark:bg-slate-800 text-[11px] font-semibold">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'expenses'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Daily Expenses
        </button>
        <button
          onClick={() => setActiveTab('loans')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'loans'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Loans ({loans.length})
        </button>
        <button
          onClick={() => setActiveTab('investments')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'investments'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Investments ({investments.length})
        </button>
      </div>

      {/* ================= SECTION 1: DAILY EXPENSES & ANALYSIS ================= */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          {/* Action Row: Analysis Button + Clear All + Add Entry Button */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setIsAnalysisOpen(!isAnalysisOpen)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                isAnalysisOpen
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 hover:bg-purple-500/20'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>{isAnalysisOpen ? 'Close Analysis' : 'Analysis'}</span>
            </button>

            <div className="flex items-center gap-1.5">
              {expenses.length > 0 && (
                <button
                  onClick={() => setIsClearAllExpensesOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg border border-rose-300 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Clear all daily expenses"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              )}

              <button
                onClick={() => {
                  setFormType('expense');
                  setFormAmount('');
                  setFormDesc('');
                  setFormDate(todayStr);
                  setIsAddExpenseOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Entry</span>
              </button>
            </div>
          </div>

          {/* Analysis View (Calendar Range Selection + Category Circle Chart + Day-of-Week Chart + Monthly Chart) */}
          {isAnalysisOpen && (
            <div
              className={`p-4 rounded-3xl border space-y-4 animate-in fade-in zoom-in-95 ${
                isDark
                  ? 'bg-slate-900/95 border-purple-500/30 text-slate-100 shadow-xl'
                  : 'bg-gradient-to-br from-purple-50/70 via-white to-slate-50 border-purple-200 text-slate-800 shadow-md'
              }`}
            >
              {/* Analysis Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                    Expense Analysis &amp; Visual Charts
                  </h3>
                </div>
                <button
                  onClick={() => setIsAnalysisOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                  title="Close Analysis"
                  aria-label="Close Analysis"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* MONTH & CALENDAR RANGE PICKER: Analyze any selected month or custom date range */}
              <div className="p-3 rounded-2xl bg-purple-500/10 dark:bg-purple-950/30 border border-purple-500/20 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Select Month or Date Range for Analysis</span>
                  </span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 font-mono font-bold">
                    {analysisExpenses.length} records in selected period
                  </span>
                </div>

                {/* Month Selector Row (Stored Previous Months + Month Picker) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-600 dark:text-slate-300 font-bold block mb-0.5">
                      Select Stored Month
                    </label>
                    <select
                      value={selectedAnalysisMonth}
                      onChange={(e) => handleSelectAnalysisMonth(e.target.value)}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-500/40 text-slate-900 dark:text-white text-xs font-bold shadow-2xs"
                    >
                      {availableAnalysisMonths.map((m) => (
                        <option key={m.ym} value={m.ym}>
                          {m.label} {m.ym === currentYearMonth ? '(Current Month)' : ''}
                        </option>
                      ))}
                      <option value="all">All Stored Months Combined</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 dark:text-slate-300 font-bold block mb-0.5">
                      Or Jump to Any Month (Calendar)
                    </label>
                    <input
                      type="month"
                      value={selectedAnalysisMonth === 'all' ? currentYearMonth : selectedAnalysisMonth}
                      onChange={(e) => {
                        if (e.target.value) handleSelectAnalysisMonth(e.target.value);
                      }}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-500/40 text-slate-900 dark:text-white text-xs font-mono font-bold shadow-2xs"
                    />
                  </div>
                </div>

                {/* Custom Calendar Date Pickers */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-600 dark:text-slate-300 font-bold block mb-0.5">
                      From (Start Date)
                    </label>
                    <input
                      type="date"
                      value={analysisStartDate}
                      onChange={(e) => {
                        setSelectedAnalysisMonth('custom');
                        setAnalysisStartDate(e.target.value);
                      }}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-500/40 text-slate-900 dark:text-white text-xs font-mono font-bold shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 dark:text-slate-300 font-bold block mb-0.5">
                      To (End Date)
                    </label>
                    <input
                      type="date"
                      value={analysisEndDate}
                      onChange={(e) => {
                        setSelectedAnalysisMonth('custom');
                        setAnalysisEndDate(e.target.value);
                      }}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-500/40 text-slate-900 dark:text-white text-xs font-mono font-bold shadow-2xs"
                    />
                  </div>
                </div>

                {/* Quick Presets: Current Month, Previous Month, 1 Day (Today), 7 Days, 30 Days, All Time */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    onClick={() => handleSelectAnalysisMonth(currentYearMonth)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-2xs ${
                      selectedAnalysisMonth === currentYearMonth
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-purple-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {currentMonthName} (This Month)
                  </button>
                  <button
                    onClick={() => {
                      const prevDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                      const prevYm = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
                      handleSelectAnalysisMonth(prevYm);
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-purple-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-slate-700 cursor-pointer shadow-2xs"
                  >
                    Previous Month
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAnalysisMonth('custom');
                      setAnalysisStartDate(todayStr);
                      setAnalysisEndDate(todayStr);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-2xs ${
                      analysisStartDate === todayStr && analysisEndDate === todayStr
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-purple-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    1 Day (Today)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAnalysisMonth('custom');
                      setRangePreset(7);
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-purple-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-slate-700 cursor-pointer shadow-2xs"
                  >
                    Last 7 Days
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAnalysisMonth('custom');
                      setRangePreset(30);
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-purple-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-slate-700 cursor-pointer shadow-2xs"
                  >
                    Last 30 Days
                  </button>
                  <button
                    onClick={() => handleSelectAnalysisMonth('all')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-2xs ${
                      selectedAnalysisMonth === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-purple-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    All Months Archive
                  </button>
                </div>

                {/* Auto-Update Every 5th of Month Info Banner */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-purple-200/60 dark:border-purple-800/40 text-[10px]">
                  <span className="text-purple-800 dark:text-purple-300 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      All previous months’ expenses are permanently stored &amp; auto-updated to the same Master Google Sheet every 5th of the month.
                    </span>
                  </span>
                  <span className="font-mono font-bold text-slate-600 dark:text-slate-400">
                    {monthly5thStatus.isCurrentMonthSynced
                      ? `Synced for ${monthly5thStatus.lastSyncedMonth}`
                      : `Next Auto-Sync: ${monthly5thStatus.nextSyncLabel}`}
                  </span>
                </div>
              </div>

              {/* Analysis Summary Metrics */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-2xl bg-emerald-500/15 dark:bg-emerald-950/40 border border-emerald-500/25 text-center">
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 uppercase font-bold">Inflow</span>
                  <p className="text-sm font-black text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
                    ₹{analysisInflow.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-2.5 rounded-2xl bg-rose-500/15 dark:bg-rose-950/40 border border-rose-500/25 text-center">
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 uppercase font-bold">Outflow</span>
                  <p className="text-sm font-black text-rose-700 dark:text-rose-400 font-mono mt-0.5">
                    ₹{analysisOutflow.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-2.5 rounded-2xl bg-purple-500/15 dark:bg-purple-950/40 border border-purple-500/25 text-center">
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 uppercase font-bold">Net Balance</span>
                  <p
                    className={`text-sm font-black font-mono mt-0.5 ${
                      analysisNet >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    ₹{analysisNet.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* CHART 1: CATEGORY-WISE CIRCLE CHART (DONUT SVG) & BREAKDOWN */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300 tracking-wider">
                    1. Category Wise Analysis (Circle Chart)
                  </span>
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 font-mono">
                    Total: ₹{analysisOutflow.toLocaleString('en-IN')}
                  </span>
                </div>

                {categoryBreakdown.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center py-3">
                    No expense records found in this selected calendar range.
                  </p>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* SVG Donut Circle Chart */}
                    <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {/* Background track circle */}
                        <circle cx="50" cy="50" r="38" fill="transparent" stroke="#94a3b8" strokeWidth="14" opacity="0.3" />
                        {/* Dynamic category arcs */}
                        {(() => {
                          let accumulatedPercent = 0;
                          return categoryBreakdown.map((item) => {
                            const circumference = 2 * Math.PI * 38; // ~238.76
                            const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                            accumulatedPercent += item.percentage;
                            const color = categoryColors[item.category] || '#94a3b8';

                            return (
                              <circle
                                key={item.category}
                                cx="50"
                                cy="50"
                                r="38"
                                fill="transparent"
                                stroke={color}
                                strokeWidth="14"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-500"
                              />
                            );
                          });
                        })()}
                      </svg>
                      {/* Center total with high contrast text */}
                      <div className="absolute text-center">
                        <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 block leading-tight">Total</span>
                        <span className="text-xs font-black font-mono text-slate-900 dark:text-white">
                          ₹{analysisOutflow >= 1000 ? `${Math.round(analysisOutflow / 1000)}k` : analysisOutflow}
                        </span>
                      </div>
                    </div>

                    {/* Category List with Colors & Percentages */}
                    <div className="flex-1 w-full space-y-1.5">
                      {categoryBreakdown.map((item) => {
                        const color = categoryColors[item.category] || '#94a3b8';
                        return (
                          <div key={item.category} className="space-y-0.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                                <span className="font-semibold capitalize text-slate-800 dark:text-slate-200 truncate">
                                  {item.category.replace('_', ' ')}
                                </span>
                              </div>
                              <span className="font-mono font-bold text-slate-900 dark:text-white shrink-0 ml-2">
                                ₹{item.amount.toLocaleString('en-IN')} ({item.percentage}%)
                              </span>
                            </div>
                            <div className="w-full h-1 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: color }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* CHART 2: DAY-OF-WEEK BAR CHART (Monday, Tuesday, etc.) */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300 tracking-wider">
                    2. Day of Week Expense (Monday - Sunday)
                  </span>
                  {dayOfWeekAnalysis.highestDay.total > 0 && (
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                      Peak: {dayOfWeekAnalysis.highestDay.name} (₹{dayOfWeekAnalysis.highestDay.total.toLocaleString('en-IN')})
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-7 gap-1.5 items-end pt-3 pb-1 h-28 bg-slate-100 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                  {dayOfWeekAnalysis.days.map((d) => {
                    const heightPct = dayOfWeekAnalysis.maxDayTotal > 0 ? Math.round((d.total / dayOfWeekAnalysis.maxDayTotal) * 100) : 0;
                    const isPeak = d.total > 0 && d.total === dayOfWeekAnalysis.highestDay.total;

                    return (
                      <div key={d.name} className="flex flex-col items-center h-full justify-end gap-1">
                        <span className="text-[9px] font-mono text-slate-600 dark:text-slate-300 font-bold truncate">
                          {d.total > 0 ? `₹${d.total >= 1000 ? Math.round(d.total / 1000) + 'k' : d.total}` : '0'}
                        </span>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-md overflow-hidden flex flex-col justify-end h-16">
                          <div
                            className={`w-full rounded-md transition-all ${
                              isPeak ? 'bg-rose-500' : d.total > 0 ? 'bg-purple-600 dark:bg-purple-500' : 'bg-transparent'
                            }`}
                            style={{ height: `${Math.max(4, heightPct)}%` }}
                            title={`${d.name}: ₹${d.total.toLocaleString('en-IN')}`}
                          />
                        </div>
                        <span className={`text-[10px] font-bold ${isPeak ? 'text-rose-600 dark:text-rose-400 font-extrabold' : 'text-slate-600 dark:text-slate-400'}`}>
                          {d.short}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CHART 3: MONTHLY COMPARISON BAR CHART (Which month expense is more) */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300 tracking-wider">
                    3. Monthly Expense Comparison
                  </span>
                  {monthlyAnalysis.highestMonth && monthlyAnalysis.highestMonth.total > 0 && (
                    <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400">
                      Highest Month: {monthlyAnalysis.highestMonth.label} (₹{monthlyAnalysis.highestMonth.total.toLocaleString('en-IN')})
                    </span>
                  )}
                </div>

                {monthlyAnalysis.sortedMonths.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center py-2">
                    No monthly data available in this range.
                  </p>
                ) : (
                  <div className="space-y-2 bg-slate-100 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                    {monthlyAnalysis.sortedMonths.map((m) => {
                      const pct = Math.round((m.total / monthlyAnalysis.maxMonthTotal) * 100);
                      const isHighest = m.total === monthlyAnalysis.highestMonth?.total;

                      return (
                        <div
                          key={m.monthKey}
                          onClick={() => handleSelectAnalysisMonth(m.monthKey)}
                          className="space-y-1 cursor-pointer p-1.5 rounded-xl hover:bg-white/60 dark:hover:bg-slate-700/40 transition-colors"
                          title={`Click to analyze ${m.label}`}
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className={`font-bold ${isHighest ? 'text-indigo-700 dark:text-indigo-300 font-extrabold' : 'text-slate-800 dark:text-slate-200'}`}>
                              {m.label} {isHighest && '★ Peak Month'}
                            </span>
                            <div className="flex items-center gap-2 font-mono text-[10px]">
                              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                                +₹{m.income.toLocaleString('en-IN')}
                              </span>
                              <span className="font-bold text-rose-700 dark:text-rose-400">
                                -₹{m.total.toLocaleString('en-IN')}
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white">
                                Bal: ₹{m.balance.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isHighest ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-teal-600 dark:bg-teal-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. TRANSACTIONS MADE DURING SELECTED RANGE / MONTH */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300 tracking-wider">
                    4. Transactions in Selected Range / Month ({analysisExpenses.length})
                  </span>
                  <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 font-bold">
                    {analysisStartDate || 'Start'} → {analysisEndDate || 'Now'}
                  </span>
                </div>

                {analysisExpenses.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center py-2">
                    No transactions recorded during this selected month/range.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                    {analysisExpenses.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">{item.description}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                            {item.date} • {item.category.replace(/_/g, ' ')} • {item.paymentMode.toUpperCase()}
                          </p>
                        </div>
                        <span
                          className={`font-mono font-black shrink-0 ${
                            item.type === 'income'
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Current Month Summary Cards & Transactions (Hidden when in Analysis section) */}
          {!isAnalysisOpen && (
            <>
              {/* Current (Name) Month Inflow, Outflow & Total Balance Cards */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-center">
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 uppercase font-bold block truncate">
                    {currentMonthName} Inflow
                  </span>
                  <p className="text-sm font-black text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
                    ₹{currentMonthInflow.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 text-center">
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 uppercase font-bold block truncate">
                    {currentMonthName} Outflow
                  </span>
                  <p className="text-sm font-black text-rose-700 dark:text-rose-400 font-mono mt-0.5">
                    ₹{currentMonthOutflow.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 uppercase font-bold block truncate">
                    Total Balance
                  </span>
                  <p
                    className={`text-sm font-black font-mono mt-0.5 ${
                      currentMonthBalance >= 0
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    ₹{currentMonthBalance.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Current Month / Today Transactions List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 px-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setDailyViewFilter('month')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                        dailyViewFilter === 'month'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {currentMonthName} ({currentMonthExpenses.length})
                    </button>
                    <button
                      onClick={() => setDailyViewFilter('today')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                        dailyViewFilter === 'today'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Today ({dailyExpenses.length})
                    </button>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                    {dailyViewFilter === 'month' ? currentYearMonth : todayStr}
                  </span>
                </div>

                {displayedDailyTabExpenses.map((e) => (
                  <div
                    key={e.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 shadow-xs text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          e.type === 'income'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}
                      >
                        {e.type === 'income' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-900 dark:text-white truncate">{e.description}</p>
                          {e.date === todayStr && (
                            <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 shrink-0">
                              Today
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 capitalize font-mono">
                          {e.date} • {e.type === 'expense' ? e.category.replace('_', ' ') + ' • ' : ''}{e.paymentMode.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`font-mono font-black ${
                          e.type === 'income' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {e.type === 'income' ? '+' : '-'}₹{e.amount.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => setExpenseToDelete(e)}
                        className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer transition-colors"
                        title="Delete record"
                        aria-label="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {displayedDailyTabExpenses.length === 0 && (
                  <div className="text-center py-7 text-slate-500 dark:text-slate-400 text-xs rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                    No transactions recorded yet for {dailyViewFilter === 'month' ? currentMonthName : 'today'}. Click "+ Add Entry" to record spending or inflow.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ================= SECTION 2: LOANS (Renamed to Loans) ================= */}
      {activeTab === 'loans' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {/* EMI Calculator button (Without "Open") */}
            <button
              onClick={() => setShowEmiCalculator(!showEmiCalculator)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all ${
                showEmiCalculator
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{showEmiCalculator ? 'Hide EMI Calculator' : 'EMI Calculator'}</span>
            </button>

            {/* "+ Add Loan" button */}
            <button
              onClick={() => openLoanModal()}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Loan</span>
            </button>
          </div>

          {/* Interactive EMI Calculator Box - Color Differs from Main Page */}
          {showEmiCalculator && (
            <div
              className={`p-4 rounded-3xl border-2 space-y-3.5 shadow-xl transition-all ${
                isDark
                  ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-indigo-500/50 text-slate-100'
                  : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-300 text-slate-900 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" />
                  <span>Loan EMI &amp; Interest Calculator</span>
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-500/30">
                  Interactive
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">Principal (₹)</label>
                  <input
                    type="number"
                    value={calcPrincipal}
                    onChange={(e) => setCalcPrincipal(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-500/40 text-slate-900 dark:text-white font-mono text-xs font-bold shadow-2xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">Rate (% p.a.)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={calcRate}
                    onChange={(e) => setCalcRate(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-500/40 text-slate-900 dark:text-white font-mono text-xs font-bold shadow-2xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">Tenure (Mos)</label>
                  <input
                    type="number"
                    value={calcTenure}
                    onChange={(e) => setCalcTenure(parseInt(e.target.value, 10) || 0)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-500/40 text-slate-900 dark:text-white font-mono text-xs font-bold shadow-2xs"
                  />
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-indigo-200 dark:border-indigo-900/60 text-center text-xs">
                <div className="p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-indigo-100 dark:border-slate-700/60 shadow-xs">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Monthly EMI</span>
                  <p className="font-black text-indigo-700 dark:text-indigo-400 font-mono text-sm">
                    ₹{emiResult.emi.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-indigo-100 dark:border-slate-700/60 shadow-xs">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Total Interest</span>
                  <p className="font-black text-rose-600 dark:text-rose-400 font-mono text-sm">
                    ₹{emiResult.totalInterest.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-indigo-100 dark:border-slate-700/60 shadow-xs">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Total Payment</span>
                  <p className="font-black text-emerald-700 dark:text-emerald-400 font-mono text-sm">
                    ₹{emiResult.totalPay.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4:5 ASPECT RATIO LOAN CARDS SLIDER */}
          {loans.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-extrabold text-sm text-slate-800 dark:text-white">All Loan &amp; EMI Data Cleared</p>
                <p className="text-slate-500 max-w-xs mx-auto text-xs">
                  Your loan register is clean. Enter your actual loan, EMI, and repayment records manually.
                </p>
              </div>
              <button
                onClick={() => openLoanModal()}
                className="py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer transition-all"
              >
                + Enter Loan Manually
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Slider Controls Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Loan {loanActiveIndex + 1} of {loans.length}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    (4:5 Card Slider)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsLoanAutoSlide(!isLoanAutoSlide)}
                    className={`p-1.5 rounded-xl border text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                      isLoanAutoSlide
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                    title={isLoanAutoSlide ? 'Pause auto-slide' : 'Resume auto-slide'}
                  >
                    {isLoanAutoSlide ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span className="hidden sm:inline">{isLoanAutoSlide ? 'Auto' : 'Paused'}</span>
                  </button>
                  <button
                    onClick={() => {
                      const nextIdx = (loanActiveIndex - 1 + loans.length) % loans.length;
                      setLoanActiveIndex(nextIdx);
                      setSelectedLoanId(loans[nextIdx].id);
                    }}
                    className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer shadow-xs transition-colors"
                    aria-label="Previous loan"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const nextIdx = (loanActiveIndex + 1) % loans.length;
                      setLoanActiveIndex(nextIdx);
                      setSelectedLoanId(loans[nextIdx].id);
                    }}
                    className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer shadow-xs transition-colors"
                    aria-label="Next loan"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ACTIVE 4:5 CARD CONTAINER */}
              {(() => {
                const currentLoan = loans[loanActiveIndex] || loans[0];
                const autoStatus = getLoanAutoStatus(currentLoan);
                const remaining = Math.max(0, currentLoan.principalAmount - currentLoan.totalPaid);
                const hasEmi = Boolean(currentLoan.monthlyEmi && currentLoan.monthlyEmi > 0);
                const paidPct = Math.min(
                  100,
                  Math.round((currentLoan.totalPaid / (currentLoan.principalAmount || 1)) * 100)
                );
                const payments = currentLoan.paymentHistory || [];
                const isSelected = selectedLoanId === currentLoan.id;

                return (
                  <div
                    onClick={() => setSelectedLoanId(currentLoan.id)}
                    className={`aspect-[4/5] w-full max-w-[320px] mx-auto rounded-3xl p-5 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden select-none ${
                      isSelected
                        ? isDark
                          ? 'bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-500 shadow-2xl shadow-indigo-950/70 ring-2 ring-indigo-500/50'
                          : 'bg-gradient-to-b from-white via-indigo-50/40 to-slate-50 border-indigo-500 shadow-xl shadow-indigo-100/80 ring-2 ring-indigo-400/50'
                        : isDark
                        ? 'bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-slate-800 hover:border-slate-700 shadow-lg'
                        : 'bg-gradient-to-b from-white via-slate-50/50 to-slate-100/50 border-slate-200 hover:border-slate-300 shadow-md'
                    }`}
                  >
                    {/* Top Section: Lender Tag, Auto Status Badge, Quick Actions */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
                            <CreditCard className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 truncate">
                            {currentLoan.lender}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${autoStatus.badgeClass}`}
                          >
                            {autoStatus.label}
                          </span>
                          <button
                            onClick={() => openLoanModal(currentLoan)}
                            className="p-1 rounded-lg text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                            title="Edit Loan Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setLoanToDelete(currentLoan)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-700 dark:hover:text-rose-400 transition-colors"
                            title="Delete Loan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Loan Title */}
                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white line-clamp-2 leading-snug">
                          {currentLoan.title}
                        </h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Borrowed: {currentLoan.borrowDate || currentLoan.startDate || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Middle Section: COMPLETE DIGITS DISPLAY (No truncation or ellipsis!) */}
                    <div className="space-y-3 my-auto py-2">
                      {/* Principal Big Banner */}
                      <div className="p-3 rounded-2xl bg-indigo-500/10 dark:bg-indigo-950/40 border border-indigo-500/20 text-center">
                        <span className="text-[9px] uppercase font-bold text-slate-600 dark:text-slate-400 tracking-wider block">
                          Total Loan Amount
                        </span>
                        {/* Complete number visible in all digits */}
                        <p className="text-2xl font-black font-mono text-slate-900 dark:text-white tracking-tight mt-0.5 whitespace-nowrap">
                          ₹{currentLoan.principalAmount.toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* 2-Column Metrics: Total Paid & Remaining (All Digits) */}
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
                          <span className="text-[9px] uppercase font-bold text-slate-600 dark:text-slate-400 block">
                            Total Paid
                          </span>
                          <p className="text-xs font-black font-mono text-emerald-700 dark:text-emerald-400 mt-0.5 whitespace-nowrap">
                            ₹{currentLoan.totalPaid.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
                          <span className="text-[9px] uppercase font-bold text-slate-600 dark:text-slate-400 block">
                            Remaining
                          </span>
                          <p className="text-xs font-black font-mono text-amber-700 dark:text-amber-400 mt-0.5 whitespace-nowrap">
                            ₹{remaining.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {/* Monthly EMI & Interest Rate (if configured) */}
                      {hasEmi && (
                        <div className="flex items-center justify-between text-[10px] px-1">
                          <span className="text-slate-600 dark:text-slate-400 font-semibold">Monthly EMI:</span>
                          <span className="font-mono font-black text-rose-600 dark:text-rose-400">
                            ₹{currentLoan.monthlyEmi.toLocaleString('en-IN')}/mo
                          </span>
                        </div>
                      )}

                      {/* Progress Bar & Percentage */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-700 dark:text-slate-300">
                          <span>{paidPct}% Paid</span>
                          <span>{payments.length} installments</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-300"
                            style={{ width: `${paidPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Section: Tap to view details below */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-center">
                      <span
                        className={`text-[10px] font-bold flex items-center justify-center gap-1 ${
                          isSelected
                            ? 'text-indigo-700 dark:text-indigo-400'
                            : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600'
                        }`}
                      >
                        {isSelected ? '✓ Viewing Repayment Breakdown Below' : 'Tap Card to View Repayments Below ▼'}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Slider Dots Indicator */}
              <div className="flex items-center justify-center gap-1.5 py-1">
                {loans.map((l, idx) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setLoanActiveIndex(idx);
                      setSelectedLoanId(l.id);
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      loanActiveIndex === idx
                        ? 'w-6 bg-indigo-600 dark:bg-indigo-400'
                        : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                    }`}
                    title={l.title}
                  />
                ))}
              </div>

              {/* REPAYMENT BREAKDOWN SECTION (SHOWN ONLY WHEN USER CLICKS ON CARD) */}
              {(() => {
                const selectedLoan =
                  loans.find((l) => l.id === selectedLoanId) || loans[loanActiveIndex] || loans[0];
                if (!selectedLoan) return null;

                const autoStatus = getLoanAutoStatus(selectedLoan);
                const remaining = Math.max(0, selectedLoan.principalAmount - selectedLoan.totalPaid);
                const payments = selectedLoan.paymentHistory || [];

                return (
                  <div
                    className={`p-4 rounded-3xl border space-y-3.5 animate-in fade-in zoom-in-95 ${
                      isDark
                        ? 'bg-slate-900 border-indigo-500/40 text-slate-100 shadow-xl'
                        : 'bg-indigo-50/60 border-indigo-200 text-slate-900 shadow-md'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-indigo-200 dark:border-indigo-900/60 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                          <Receipt className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white">
                            Repayment Breakdown &amp; History
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            {selectedLoan.title} • {selectedLoan.lender}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${autoStatus.badgeClass}`}
                      >
                        {autoStatus.label}
                      </span>
                    </div>

                    {/* Summary Row: Total Borrowed, Total Paid, Remaining */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700/60 shadow-2xs">
                        <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                          Total Borrowed
                        </span>
                        <p className="font-mono font-black text-slate-900 dark:text-white mt-0.5">
                          ₹{selectedLoan.principalAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700/60 shadow-2xs">
                        <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                          Total Paid
                        </span>
                        <p className="font-mono font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
                          ₹{selectedLoan.totalPaid.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700/60 shadow-2xs">
                        <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                          Remaining
                        </span>
                        <p className="font-mono font-black text-amber-700 dark:text-amber-400 mt-0.5">
                          ₹{remaining.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Dates Overview */}
                    <div className="flex items-center justify-between bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-2xl text-[11px] border border-indigo-100 dark:border-slate-700/60">
                      <div>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">
                          Borrow Date
                        </span>
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          {selectedLoan.borrowDate || selectedLoan.startDate || 'N/A'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">
                          Last Payment Date
                        </span>
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {selectedLoan.lastPaidDate || 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* RECORD NEW PAYMENT FORM */}
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-indigo-200 dark:border-indigo-900/60 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-black text-indigo-700 dark:text-indigo-300 tracking-wider">
                          + Add Repayment Installment
                        </span>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400">
                          Auto-updates total paid &amp; status
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-600 dark:text-slate-300 font-bold block mb-0.5">
                            Amount (₹)
                          </label>
                          <input
                            type="number"
                            placeholder="e.g. 9245"
                            value={quickPayAmount}
                            onChange={(e) => setQuickPayAmount(e.target.value)}
                            className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-600 dark:text-slate-300 font-bold block mb-0.5">
                            Payment Date
                          </label>
                          <input
                            type="date"
                            value={quickPayDate}
                            onChange={(e) => setQuickPayDate(e.target.value)}
                            className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Note / Mode (e.g. October EMI auto-debit)"
                          value={quickPayNote}
                          onChange={(e) => setQuickPayNote(e.target.value)}
                          className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400"
                        />
                        <button
                          onClick={() => handleQuickAddPayment(selectedLoan)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs shrink-0"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    {/* REPAYMENTS LIST WITH EDIT & DELETE BUTTONS ON EACH REPAYMENT */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 px-1">
                        <span>Payment History Breakdown ({payments.length})</span>
                        <span className="text-[10px] text-slate-500">Edit or Delete below</span>
                      </div>

                      {payments.length === 0 ? (
                        <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400">
                          No individual installments logged yet. Total recorded paid till now: ₹{selectedLoan.totalPaid.toLocaleString('en-IN')}.
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                          {payments.map((p) => (
                            <div
                              key={p.id}
                              className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 flex items-center justify-between text-xs shadow-2xs gap-2"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                                    {p.date}
                                  </span>
                                </div>
                                {p.notes && (
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                    {p.notes}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {/* All digits shown without cutoff */}
                                <span className="font-mono font-black text-emerald-700 dark:text-emerald-400 text-sm whitespace-nowrap">
                                  ₹{p.amount.toLocaleString('en-IN')}
                                </span>
                                {/* Edit Repayment Button */}
                                <button
                                  onClick={() => openEditRepaymentModal(selectedLoan.id, p)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                                  title="Edit repayment payment"
                                  aria-label="Edit repayment"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                {/* Delete Repayment Button */}
                                <button
                                  onClick={() =>
                                    setRepaymentToDelete({
                                      loanId: selectedLoan.id,
                                      paymentId: p.id,
                                      amount: p.amount,
                                      date: p.date,
                                    })
                                  }
                                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                                  title="Delete repayment payment"
                                  aria-label="Delete repayment"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Direct Edit Button to easily edit loan terms */}
                    <div className="flex items-center justify-between pt-2 border-t border-indigo-200 dark:border-indigo-900/60">
                      <span className="text-[10px] text-slate-600 dark:text-slate-400">
                        Need to edit loan terms or principal?
                      </span>
                      <button
                        onClick={() => openLoanModal(selectedLoan)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Loan Details</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ================= SECTION 3: INVESTMENTS & SIP ================= */}
      {activeTab === 'investments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {/* SIP Calculator button (Without "Open") */}
            <button
              onClick={() => setShowSipCalculator(!showSipCalculator)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all ${
                showSipCalculator
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30 hover:bg-teal-500/20'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{showSipCalculator ? 'Hide SIP Calculator' : 'SIP Calculator'}</span>
            </button>

            <div className="flex items-center gap-1.5">
              {investments.length > 0 && (
                <button
                  onClick={() => setIsClearAllInvestmentsOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg border border-rose-300 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Clear all investments"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              )}

              <button
                onClick={() => openInvestmentModal()}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Investment</span>
              </button>
            </div>
          </div>

          {/* Interactive SIP Calculator Box - Color Differs from Main Page */}
          {showSipCalculator && (
            <div
              className={`p-4 rounded-3xl border-2 space-y-3.5 shadow-xl transition-all ${
                isDark
                  ? 'bg-gradient-to-br from-teal-950 via-slate-900 to-emerald-950 border-teal-500/50 text-slate-100'
                  : 'bg-gradient-to-br from-teal-50 via-white to-emerald-50 border-teal-300 text-slate-900 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>SIP &amp; Wealth Growth Calculator</span>
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold border border-teal-500/30">
                  Compounding
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">Monthly SIP (₹)</label>
                  <input
                    type="number"
                    value={calcSipAmount}
                    onChange={(e) => setCalcSipAmount(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-500/40 text-slate-900 dark:text-white font-mono text-xs font-bold shadow-2xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">Expected Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={calcSipRate}
                    onChange={(e) => setCalcSipRate(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-500/40 text-slate-900 dark:text-white font-mono text-xs font-bold shadow-2xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">Years</label>
                  <input
                    type="number"
                    value={calcSipYears}
                    onChange={(e) => setCalcSipYears(parseInt(e.target.value, 10) || 0)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-500/40 text-slate-900 dark:text-white font-mono text-xs font-bold shadow-2xs"
                  />
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-teal-200 dark:border-teal-900/60 text-center text-xs">
                <div className="p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-teal-100 dark:border-slate-700/60 shadow-xs">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Invested</span>
                  <p className="font-black text-slate-900 dark:text-slate-200 font-mono text-sm">
                    ₹{sipResult.invested.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-teal-100 dark:border-slate-700/60 shadow-xs">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Gain</span>
                  <p className="font-black text-emerald-700 dark:text-emerald-400 font-mono text-sm">
                    ₹{sipResult.wealthGain.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-teal-100 dark:border-slate-700/60 shadow-xs">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Total Value</span>
                  <p className="font-black text-teal-700 dark:text-teal-400 font-mono text-sm">
                    ₹{sipResult.futureValue.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4:5 ASPECT RATIO INVESTMENT CARDS SLIDER */}
          {investments.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 p-6 space-y-2">
              <TrendingUp className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-bold text-slate-700 dark:text-slate-300">No investment assets recorded yet.</p>
              <p className="text-slate-500">Click "+ Add Investment" above to start tracking SIPs and portfolio growth.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Slider Controls Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Asset {invActiveIndex + 1} of {investments.length}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    (4:5 Card Slider)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsInvAutoSlide(!isInvAutoSlide)}
                    className={`p-1.5 rounded-xl border text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                      isInvAutoSlide
                        ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                    title={isInvAutoSlide ? 'Pause auto-slide' : 'Resume auto-slide'}
                  >
                    {isInvAutoSlide ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span className="hidden sm:inline">{isInvAutoSlide ? 'Auto' : 'Paused'}</span>
                  </button>
                  <button
                    onClick={() => {
                      const nextIdx = (invActiveIndex - 1 + investments.length) % investments.length;
                      setInvActiveIndex(nextIdx);
                      setSelectedInvId(investments[nextIdx].id);
                    }}
                    className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer shadow-xs transition-colors"
                    aria-label="Previous investment"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const nextIdx = (invActiveIndex + 1) % investments.length;
                      setInvActiveIndex(nextIdx);
                      setSelectedInvId(investments[nextIdx].id);
                    }}
                    className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer shadow-xs transition-colors"
                    aria-label="Next investment"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ACTIVE 4:5 INVESTMENT CARD */}
              {(() => {
                const currentInv = investments[invActiveIndex] || investments[0];
                const gain = currentInv.currentValue - currentInv.investedAmount;
                const gainPct =
                  currentInv.investedAmount > 0
                    ? Math.round((gain / currentInv.investedAmount) * 100)
                    : 0;
                const isSelected = selectedInvId === currentInv.id;
                const txHistory = currentInv.transactionHistory || [];

                return (
                  <div
                    onClick={() => setSelectedInvId(currentInv.id)}
                    className={`aspect-[4/5] w-full max-w-[320px] mx-auto rounded-3xl p-5 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden select-none ${
                      isSelected
                        ? isDark
                          ? 'bg-gradient-to-b from-slate-900 via-teal-950/40 to-slate-900 border-teal-500 shadow-2xl shadow-teal-950/70 ring-2 ring-teal-500/50'
                          : 'bg-gradient-to-b from-white via-teal-50/40 to-slate-50 border-teal-500 shadow-xl shadow-teal-100/80 ring-2 ring-teal-400/50'
                        : isDark
                        ? 'bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-slate-800 hover:border-slate-700 shadow-lg'
                        : 'bg-gradient-to-b from-white via-slate-50/50 to-slate-100/50 border-slate-200 hover:border-slate-300 shadow-md'
                    }`}
                  >
                    {/* Top Section: Platform Chip, Category Tag, Quick Actions */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-teal-500/15 flex items-center justify-center shrink-0">
                            <Coins className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                          </div>
                          <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 truncate">
                            {currentInv.platform}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-400 border border-teal-500/30">
                            {currentInv.category.replace('_', ' ')}
                          </span>
                          <button
                            onClick={() => openInvestmentModal(currentInv)}
                            className="p-1 rounded-lg text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                            title="Edit Investment Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setInvestmentToDelete(currentInv)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-700 dark:hover:text-rose-400 transition-colors"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Asset Title & Subtitle */}
                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white line-clamp-2 leading-snug">
                          {currentInv.title}
                        </h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Started: {currentInv.investDate || currentInv.startDate || 'N/A'} • Return: {currentInv.expectedReturnRate}% p.a.
                        </p>
                      </div>
                    </div>

                    {/* Middle Section: COMPLETE DIGITS DISPLAY (All digits shown) */}
                    <div className="space-y-3 my-auto py-2">
                      {/* Current Value Big Banner */}
                      <div className="p-3 rounded-2xl bg-teal-500/10 dark:bg-teal-950/40 border border-teal-500/20 text-center">
                        <span className="text-[9px] uppercase font-bold text-slate-600 dark:text-slate-400 tracking-wider block">
                          Current Valuation
                        </span>
                        <p className="text-2xl font-black font-mono text-teal-700 dark:text-teal-300 tracking-tight mt-0.5 whitespace-nowrap">
                          ₹{currentInv.currentValue.toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* 2-Column Metrics: Invested & Net Gain (All Digits) */}
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
                          <span className="text-[9px] uppercase font-bold text-slate-600 dark:text-slate-400 block">
                            Invested
                          </span>
                          <p className="text-xs font-black font-mono text-slate-900 dark:text-white mt-0.5 whitespace-nowrap">
                            ₹{currentInv.investedAmount.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
                          <span className="text-[9px] uppercase font-bold text-slate-600 dark:text-slate-400 block">
                            Total Gain / Loss
                          </span>
                          <p
                            className={`text-xs font-black font-mono mt-0.5 whitespace-nowrap ${
                              gain >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                            }`}
                          >
                            {gain >= 0 ? '+' : ''}₹{gain.toLocaleString('en-IN')} ({gainPct}%)
                          </p>
                        </div>
                      </div>

                      {/* Monthly SIP Info */}
                      {Boolean(currentInv.sipMonthly && currentInv.sipMonthly > 0) && (
                        <div className="flex items-center justify-between text-[10px] px-1 bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                          <span className="text-slate-600 dark:text-slate-400 font-semibold">Monthly SIP:</span>
                          <span className="font-mono font-black text-teal-700 dark:text-teal-400">
                            ₹{currentInv.sipMonthly?.toLocaleString('en-IN')}/mo
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 px-1 font-medium">
                        <span>Last Added: {currentInv.lastAddDate || 'N/A'}</span>
                        <span>{txHistory.length} installments</span>
                      </div>
                    </div>

                    {/* Bottom Section: Tap to view details below */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-center">
                      <span
                        className={`text-[10px] font-bold flex items-center justify-center gap-1 ${
                          isSelected
                            ? 'text-teal-700 dark:text-teal-400'
                            : 'text-slate-500 dark:text-slate-400 hover:text-teal-600'
                        }`}
                      >
                        {isSelected ? '✓ Viewing SIP & History Below' : 'Tap Card to View SIP Breakdown Below ▼'}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Slider Dots Indicator */}
              <div className="flex items-center justify-center gap-1.5 py-1">
                {investments.map((inv, idx) => (
                  <button
                    key={inv.id}
                    onClick={() => {
                      setInvActiveIndex(idx);
                      setSelectedInvId(inv.id);
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      invActiveIndex === idx
                        ? 'w-6 bg-teal-600 dark:bg-teal-400'
                        : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                    }`}
                    title={inv.title}
                  />
                ))}
              </div>

              {/* SIP & TRANSACTION BREAKDOWN SECTION (SHOWN WHEN USER CLICKS ON CARD) */}
              {(() => {
                const selectedInv =
                  investments.find((i) => i.id === selectedInvId) ||
                  investments[invActiveIndex] ||
                  investments[0];
                if (!selectedInv) return null;

                const gain = selectedInv.currentValue - selectedInv.investedAmount;
                const gainPct =
                  selectedInv.investedAmount > 0
                    ? Math.round((gain / selectedInv.investedAmount) * 100)
                    : 0;
                const txHistory = selectedInv.transactionHistory || [];

                return (
                  <div
                    className={`p-4 rounded-3xl border space-y-3.5 animate-in fade-in zoom-in-95 ${
                      isDark
                        ? 'bg-slate-900 border-teal-500/40 text-slate-100 shadow-xl'
                        : 'bg-teal-50/60 border-teal-200 text-slate-900 shadow-md'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-teal-200 dark:border-teal-900/60 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-500/15 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white">
                            SIP &amp; Installments History
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            {selectedInv.title} • {selectedInv.platform}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => openInvestmentModal(selectedInv)}
                        className="px-2.5 py-1 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit Details</span>
                      </button>
                    </div>

                    {/* Summary Row */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700/60 shadow-2xs">
                        <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                          Total Invested
                        </span>
                        <p className="font-mono font-black text-slate-900 dark:text-white mt-0.5">
                          ₹{selectedInv.investedAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700/60 shadow-2xs">
                        <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                          Current Value
                        </span>
                        <p className="font-mono font-black text-teal-700 dark:text-teal-400 mt-0.5">
                          ₹{selectedInv.currentValue.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700/60 shadow-2xs">
                        <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                          Net Gain
                        </span>
                        <p
                          className={`font-mono font-black mt-0.5 ${
                            gain >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {gain >= 0 ? '+' : ''}₹{gain.toLocaleString('en-IN')} ({gainPct}%)
                        </p>
                      </div>
                    </div>

                    {/* RECORD NEW SIP / DEPOSIT FORM */}
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-teal-200 dark:border-teal-900/60 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-black text-teal-700 dark:text-teal-300 tracking-wider">
                          + Add SIP / Deposit Installment
                        </span>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400">
                          Auto-updates invested &amp; valuation
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-600 dark:text-slate-300 font-bold block mb-0.5">
                            Amount (₹)
                          </label>
                          <input
                            type="number"
                            placeholder="e.g. 5000"
                            value={quickSipAmount}
                            onChange={(e) => setQuickSipAmount(e.target.value)}
                            className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-600 dark:text-slate-300 font-bold block mb-0.5">
                            Installment Date
                          </label>
                          <input
                            type="date"
                            value={quickSipDate}
                            onChange={(e) => setQuickSipDate(e.target.value)}
                            className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Note / Description (e.g. Monthly SIP Auto-Debit)"
                          value={quickSipNote}
                          onChange={(e) => setQuickSipNote(e.target.value)}
                          className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400"
                        />
                        <button
                          onClick={() => handleQuickAddSip(selectedInv)}
                          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs shrink-0"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    {/* SIP INSTALLMENTS LIST WITH EDIT & DELETE BUTTONS ON EACH ENTRY */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 px-1">
                        <span>All SIP &amp; Deposits Till Now ({txHistory.length})</span>
                        <span className="text-[10px] text-slate-500">Edit or Delete below</span>
                      </div>

                      {txHistory.length === 0 ? (
                        <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400">
                          No individual installments logged yet. Total invested recorded: ₹{selectedInv.investedAmount.toLocaleString('en-IN')}.
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                          {txHistory.map((tx) => (
                            <div
                              key={tx.id}
                              className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700 flex items-center justify-between text-xs shadow-2xs gap-2"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                                    {tx.date}
                                  </span>
                                  <span
                                    className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${
                                      tx.type === 'withdraw'
                                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                        : 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
                                    }`}
                                  >
                                    {tx.type === 'withdraw' ? 'Withdrawal' : 'SIP Add'}
                                  </span>
                                </div>
                                {tx.notes && (
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                    {tx.notes}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {/* All digits shown without cutoff */}
                                <span
                                  className={`font-mono font-black text-sm whitespace-nowrap ${
                                    tx.type === 'withdraw'
                                      ? 'text-rose-600 dark:text-rose-400'
                                      : 'text-teal-700 dark:text-teal-400'
                                  }`}
                                >
                                  {tx.type === 'withdraw' ? '-' : '+'}₹{tx.amount.toLocaleString('en-IN')}
                                </span>
                                {/* Edit Transaction Button */}
                                <button
                                  onClick={() => openEditTxModal(selectedInv.id, tx)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                                  title="Edit SIP installment"
                                  aria-label="Edit SIP installment"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                {/* Delete Transaction Button */}
                                <button
                                  onClick={() =>
                                    setTxToDelete({
                                      invId: selectedInv.id,
                                      txId: tx.id,
                                      amount: tx.amount,
                                      date: tx.date,
                                    })
                                  }
                                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                                  title="Delete SIP installment"
                                  aria-label="Delete SIP installment"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: ADD TRANSACTION (Income has NO category field) ================= */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl border space-y-4 animate-in zoom-in-95 ${
              isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Add Transaction</h3>
              <button
                onClick={() => setIsAddExpenseOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-3.5 text-xs">
              {/* Type Switcher: Expense vs Income */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setFormType('expense')}
                  className={`flex-1 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
                    formType === 'expense'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('income')}
                  className={`flex-1 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
                    formType === 'income'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 500"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-sm"
                />
              </div>

              {/* Category is ONLY shown for Expense. For Income, it is completely removed! */}
              {formType === 'expense' ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                      Expense Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="food_dining">Food &amp; Dining</option>
                      <option value="study_books">Books &amp; Study</option>
                      <option value="travel_commute">Travel &amp; Fuel</option>
                      <option value="living_personal">Living &amp; Personal</option>
                      <option value="clinic_consultation">OPD Clinic Supplies</option>
                      <option value="loan_emi">Loan EMI</option>
                      <option value="investment">Investment SIP</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={formPaymentMode}
                      onChange={(e) => setFormPaymentMode(e.target.value as any)}
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white uppercase font-medium"
                    >
                      <option value="upi">UPI</option>
                      <option value="cash">Cash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="card">Card</option>
                    </select>
                  </div>
                </div>
              ) : (
                /* For Income: Only Payment Mode is shown, Category is removed */
                <div>
                  <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={formPaymentMode}
                    onChange={(e) => setFormPaymentMode(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white uppercase font-medium"
                  >
                    <option value="upi">UPI</option>
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="card">Card</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                  Description / Note
                </label>
                <input
                  type="text"
                  placeholder={
                    formType === 'income' ? 'e.g. OPD Consultation Fee / Honorarium' : 'e.g. Hostel lunch / Medical book'
                  }
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                  Transaction Date
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer shadow-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT LOAN & PAID AMOUNT ================= */}
      {isAddLoanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl border space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 ${
              isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {editingLoan ? 'Edit Loan Details' : 'Add Loan'}
                </h3>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">
                  Update loan terms, EMI &amp; total amount paid
                </p>
              </div>
              <button
                onClick={() => setIsAddLoanOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLoan} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                  Loan Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BAMS Medical Education Loan"
                  value={loanTitle}
                  onChange={(e) => setLoanTitle(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                    Lender / Bank
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SBI / HDFC"
                    value={loanLender}
                    onChange={(e) => setLoanLender(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                    Status
                  </label>
                  <select
                    value={loanStatus}
                    onChange={(e) => setLoanStatus(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white capitalize"
                  >
                    <option value="active">Active</option>
                    <option value="partially_paid">Partially Paid</option>
                    <option value="full_paid">Full Paid</option>
                  </select>
                </div>
              </div>

              {/* DATES */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                <div>
                  <label className="text-[10px] text-indigo-800 dark:text-indigo-300 font-bold block mb-1">
                    Date of Borrow *
                  </label>
                  <input
                    type="date"
                    required
                    value={loanBorrowDate}
                    onChange={(e) => setLoanBorrowDate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-500/40 text-slate-900 dark:text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-indigo-800 dark:text-indigo-300 font-bold block mb-1">
                    Date User Paid (Last)
                  </label>
                  <input
                    type="date"
                    value={loanLastPaidDate}
                    onChange={(e) => setLoanLastPaidDate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-500/40 text-slate-900 dark:text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* FINANCIAL SPECS: Principal, Rate, Tenure */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                    Total Loan (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={loanPrincipal}
                    onChange={(e) => setLoanPrincipal(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                    Interest %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={loanRate}
                    onChange={(e) => setLoanRate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                    Tenure (Mos)
                  </label>
                  <input
                    type="number"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* EDIT TOTAL PAID AMOUNT EASILY (NOT MANDATORY - AUTO-CALCULATES FROM PAYMENT BREAKDOWN) */}
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-emerald-800 dark:text-emerald-300 font-extrabold block">
                    Total Amount Paid Till Now (₹)
                  </label>
                  <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded">
                    Optional (Auto-calculated)
                  </span>
                </div>
                <input
                  type="number"
                  placeholder="Auto-calculated with repayments breakdown"
                  value={loanTotalPaid}
                  onChange={(e) => setLoanTotalPaid(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-400 dark:border-emerald-500/50 font-mono font-bold text-sm text-emerald-700 dark:text-emerald-300"
                />
                <p className="text-[9px] text-slate-600 dark:text-slate-400 font-medium">
                  Auto-syncs with payment history installments. Remaining balance: ₹{Math.max(0, (parseFloat(loanPrincipal) || 0) - (parseFloat(loanTotalPaid) || 0)).toLocaleString('en-IN')}
                </p>

                {/* Auto Status Indicator */}
                {(() => {
                  const p = parseFloat(loanPrincipal) || 0;
                  const paid = parseFloat(loanTotalPaid) || 0;
                  const autoKey = paid >= p && p > 0 ? 'full_paid' : paid > 0 ? 'partially_paid' : 'active';
                  const badgeMap = {
                    full_paid: { label: 'Full Paid', cls: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40' },
                    partially_paid: { label: 'Partially Paid', cls: 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40' },
                    active: { label: 'Active', cls: 'bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-500/40' },
                  };
                  const currentBadge = badgeMap[autoKey];

                  return (
                    <div className="flex items-center justify-between pt-1 border-t border-emerald-200 dark:border-emerald-800/60 text-[10px]">
                      <span className="text-slate-600 dark:text-slate-300 font-bold">Auto Repayment Status:</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${currentBadge.cls}`}>
                        {currentBadge.label}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Monthly EMI (Only if applicable) */}
              <div>
                <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                  Monthly EMI (₹) (Optional - leave blank if no EMI)
                </label>
                <input
                  type="number"
                  placeholder="Auto-calculated if blank or leave 0"
                  value={loanEmi}
                  onChange={(e) => setLoanEmi(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddLoanOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer shadow-xs"
                >
                  Save Loan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT INVESTMENT ================= */}
      {isAddInvestmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl border space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 ${
              isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {editingInvestment ? 'Edit Investment' : 'Add Investment Asset'}
              </h3>
              <button
                onClick={() => setIsAddInvestmentOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveInvestment} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                  Asset Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UTI Nifty 50 Index Fund Direct Growth"
                  value={invTitle}
                  onChange={(e) => setInvTitle(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                    Platform
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Groww / Zerodha"
                    value={invPlatform}
                    onChange={(e) => setInvPlatform(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                    Asset Type
                  </label>
                  <select
                    value={invCategory}
                    onChange={(e) => setInvCategory(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white capitalize"
                  >
                    <option value="mutual_fund">Mutual Fund (SIP)</option>
                    <option value="stock">Equity Stocks</option>
                    <option value="gold_sgb">Sovereign Gold (SGB)</option>
                    <option value="fixed_deposit">Fixed Deposit</option>
                    <option value="other">Other Asset</option>
                  </select>
                </div>
              </div>

              {/* DATES */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                <div>
                  <label className="text-[10px] text-teal-800 dark:text-teal-300 font-bold block mb-1">
                    Date of Invest *
                  </label>
                  <input
                    type="date"
                    required
                    value={invInvestDate}
                    onChange={(e) => setInvInvestDate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-500/40 text-slate-900 dark:text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-teal-800 dark:text-teal-300 font-bold block mb-1">
                    Date Last Added
                  </label>
                  <input
                    type="date"
                    value={invLastAddDate}
                    onChange={(e) => setInvLastAddDate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-500/40 text-slate-900 dark:text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* INVESTED & CURRENT VALUATION */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                    Invested (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={invInvested}
                    onChange={(e) => setInvInvested(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                    Current Value (₹)
                  </label>
                  <input
                    type="number"
                    value={invCurrent}
                    onChange={(e) => setInvCurrent(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                    Expected Return (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={invReturnRate}
                    onChange={(e) => setInvReturnRate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                    Monthly SIP (₹)
                  </label>
                  <input
                    type="number"
                    value={invSip}
                    onChange={(e) => setInvSip(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddInvestmentOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer shadow-xs"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT REPAYMENT INSTALLMENT ================= */}
      {editingRepayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl border space-y-4 animate-in zoom-in-95 ${
              isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Edit Repayment Installment
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Total paid and loan status will auto-update upon saving.
                </p>
              </div>
              <button
                onClick={() => setEditingRepayment(null)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedRepayment} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                  Amount Paid (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={editRepaymentAmount}
                  onChange={(e) => setEditRepaymentAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                  Payment Date *
                </label>
                <input
                  type="date"
                  required
                  value={editRepaymentDate}
                  onChange={(e) => setEditRepaymentDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                  Payment Mode / Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. EMI installment via NetBanking"
                  value={editRepaymentNote}
                  onChange={(e) => setEditRepaymentNote(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRepayment(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer shadow-xs"
                >
                  Update Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT SIP / TRANSACTION ================= */}
      {editingTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl border space-y-4 animate-in zoom-in-95 ${
              isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Edit SIP / Deposit Installment
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Portfolio invested amount will auto-recalculate upon saving.
                </p>
              </div>
              <button
                onClick={() => setEditingTransaction(null)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedTx} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={editTxAmount}
                  onChange={(e) => setEditTxAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                  Installment Date *
                </label>
                <input
                  type="date"
                  required
                  value={editTxDate}
                  onChange={(e) => setEditTxDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                  Description / Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Monthly SIP installment"
                  value={editTxNote}
                  onChange={(e) => setEditTxNote(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTransaction(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer shadow-xs"
                >
                  Update SIP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={!!expenseToDelete}
        title="Delete Transaction?"
        message={`Delete "${expenseToDelete?.description}" of ₹${expenseToDelete?.amount}? This will also erase it from your synced Google Sheet.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (expenseToDelete) {
            removeExpenseFromMonthlyArchive(expenseToDelete.id);
            const nextExpenses = allHistoricalAndCurrentExpenses.filter((e) => e.id !== expenseToDelete.id);
            onDeleteExpense(expenseToDelete.id);
            if (user && localStorage.getItem(MASTER_SHEET_KEY)) {
              exportMultiSectionToGoogleSheets({
                expenses: nextExpenses,
                investments,
                loans,
              }).catch(() => {});
            }
          }
          setExpenseToDelete(null);
        }}
        onCancel={() => setExpenseToDelete(null)}
      />

      <ConfirmationModal
        isOpen={!!loanToDelete}
        title="Delete Loan?"
        message={`Are you sure you want to delete "${loanToDelete?.title}" from loans? This will also erase it from your synced Google Sheet.`}
        confirmLabel="Delete Loan"
        onConfirm={() => {
          if (loanToDelete) {
            const nextLoans = loans.filter((l) => l.id !== loanToDelete.id);
            onDeleteLoan(loanToDelete.id);
            if (user && localStorage.getItem(MASTER_SHEET_KEY)) {
              exportMultiSectionToGoogleSheets({
                expenses,
                investments,
                loans: nextLoans,
              }).catch(() => {});
            }
          }
          setLoanToDelete(null);
        }}
        onCancel={() => setLoanToDelete(null)}
      />

      <ConfirmationModal
        isOpen={!!investmentToDelete}
        title="Delete Investment?"
        message={`Are you sure you want to delete "${investmentToDelete?.title}" from investments? This will also erase it from your synced Google Sheet.`}
        confirmLabel="Delete Asset"
        onConfirm={() => {
          if (investmentToDelete) {
            const nextInvestments = investments.filter((i) => i.id !== investmentToDelete.id);
            onDeleteInvestment(investmentToDelete.id);
            if (user && localStorage.getItem(MASTER_SHEET_KEY)) {
              exportMultiSectionToGoogleSheets({
                expenses,
                investments: nextInvestments,
                loans,
              }).catch(() => {});
            }
          }
          setInvestmentToDelete(null);
        }}
        onCancel={() => setInvestmentToDelete(null)}
      />

      {/* Confirmation Modal: Clear All Daily Expenses */}
      <ConfirmationModal
        isOpen={isClearAllExpensesOpen}
        title="Clear All Daily Expenses?"
        message="Are you sure you want to clear all daily expense records? This will delete all expense items from the website and erase all rows on your Google Sheet."
        confirmLabel="Yes, Clear All Expenses"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmClearAllExpenses}
        onCancel={() => setIsClearAllExpensesOpen(false)}
      />

      {/* Confirmation Modal: Clear All Investments */}
      <ConfirmationModal
        isOpen={isClearAllInvestmentsOpen}
        title="Clear All Investments?"
        message="Are you sure you want to clear all investment records? This will delete all investment items from the website and erase all rows on your Google Sheet."
        confirmLabel="Yes, Clear All Investments"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmClearAllInvestments}
        onCancel={() => setIsClearAllInvestmentsOpen(false)}
      />

      {/* Confirmation Modal: Delete Repayment */}
      <ConfirmationModal
        isOpen={!!repaymentToDelete}
        title="Delete Repayment Installment?"
        message={`Are you sure you want to delete repayment of ₹${repaymentToDelete?.amount.toLocaleString('en-IN')} recorded on ${repaymentToDelete?.date}? Total paid and loan status will auto-update immediately.`}
        confirmLabel="Delete Repayment"
        onConfirm={handleDeleteRepayment}
        onCancel={() => setRepaymentToDelete(null)}
      />

      {/* Confirmation Modal: Delete SIP / Transaction */}
      <ConfirmationModal
        isOpen={!!txToDelete}
        title="Delete SIP Installment?"
        message={`Are you sure you want to delete installment of ₹${txToDelete?.amount.toLocaleString('en-IN')} on ${txToDelete?.date}? Invested amount will auto-update immediately.`}
        confirmLabel="Delete Installment"
        onConfirm={handleDeleteTx}
        onCancel={() => setTxToDelete(null)}
      />
    </div>
  );
};
