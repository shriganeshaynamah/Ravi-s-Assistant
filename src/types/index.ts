export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO string or YYYY-MM-DDTHH:mm
  endDate?: string;
  category: 'clinical' | 'study' | 'personal' | 'financial' | 'reminder';
  googleCalendarEventId?: string;
  syncedToGoogle?: boolean;
  priority: Priority;
  location?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: 'clinical_case' | 'dravyaguna_formulation' | 'personal_diary' | 'investment_idea' | 'general';
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  color?: string; // pastel color card e.g. '#fef3c7', '#e0e7ff', etc.
  checklist?: { id: string; text: string; done: boolean }[];
}

export interface ChecklistTask {
  id: string;
  text: string;
  isCompleted: boolean;
  category: 'clinic_prep' | 'patient_care' | 'daily_chores' | 'exam_study' | 'financial' | 'general';
  dueDate?: string;
  priority: Priority;
  createdAt: string;
  isPinned?: boolean;
  isDaily?: boolean;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  category:
    | 'food_dining'
    | 'study_books'
    | 'travel_commute'
    | 'clinic_rent'
    | 'medicine_stock'
    | 'staff_salary'
    | 'living_personal'
    | 'clinic_consultation'
    | 'panchakarma_fees'
    | 'medicine_dispense'
    | 'passive_income'
    | 'loan_emi'
    | 'investment'
    | 'other';
  description: string;
  paymentMode: 'upi' | 'cash' | 'bank_transfer' | 'card';
}

export interface LoanPaymentRecord {
  id: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface LoanItem {
  id: string;
  title: string;
  lender: string; // e.g. "State Bank of India" / "Family"
  principalAmount: number;
  interestRate: number; // % annual
  tenureMonths: number;
  monthlyEmi: number;
  totalPaid: number;
  status: 'active' | 'partially_paid' | 'full_paid';
  startDate: string; // date of borrow
  borrowDate?: string; // date when loan was borrowed
  lastPaidDate?: string; // date when user last paid loan
  nextDueDate?: string; // next payment due date
  dueDateDay: number; // e.g. 5 for 5th of every month
  paymentHistory?: LoanPaymentRecord[];
  notes?: string;
}

export interface InvestmentTransactionRecord {
  id: string;
  type: 'add' | 'withdraw';
  amount: number;
  date: string;
  notes?: string;
}

export interface InvestmentItem {
  id: string;
  title: string; // e.g. "Nifty 50 Index Fund Direct Growth"
  platform: string; // e.g. "Groww", "Zerodha Coin", "SBI Securities"
  category: 'stock' | 'mutual_fund' | 'gold_sgb' | 'fixed_deposit' | 'real_estate' | 'other';
  investedAmount: number;
  currentValue: number;
  expectedReturnRate: number; // % annual
  sipMonthly?: number;
  startDate: string; // date of initial invest
  investDate?: string; // date when investment started
  lastAddDate?: string; // date when user last added funds
  lastWithdrawDate?: string; // date when user last withdrew funds
  transactionHistory?: InvestmentTransactionRecord[];
  notes?: string;
}

export interface RoadmapMilestone {
  id: string;
  key: 'final_proff' | 'internship' | 'pg_mo_exam' | 'clinic_setup' | 'custom';
  title: string;
  subtitle: string;
  badge: string;
  period: string; // e.g. "2026 - 2027"
  status: 'current' | 'upcoming' | 'completed';
  description: string;
  academicDates: { id: string; title: string; date: string; type: 'exam' | 'submission' | 'event' }[];
  internshipPostings?: {
    id: string;
    track: 'ayurveda' | 'modern';
    title: string;
    duration: string; // e.g. "6 Months"
    hospital: string;
    departments: string[];
    done: boolean;
  }[];
  activities: { id: string; text: string; done: boolean; date?: string }[];
  notes: string;
}

export interface HabitItem {
  id: string;
  name: string;
  description: string;
  category: 'dinacharya' | 'ayurveda_study' | 'fitness' | 'mindset' | 'clinic_growth' | 'discipline' | 'personal';
  targetDaysPerWeek: number;
  completedDates: string[]; // YYYY-MM-DD
  streak: number;
  icon?: string;
  color?: string;
  createdAt?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
  time?: string;
  mood: 'peaceful' | 'inspired' | 'victorious' | 'grateful' | 'energetic' | 'thoughtful' | 'joyful' | 'focused';
  category: 'clinical' | 'growth' | 'gratitude' | 'reflection' | 'wealth' | 'personal' | 'study';
  gratitude?: string;
  reflection?: string;
  tags?: string[];
  isPinned?: boolean;
}

export interface RitucharyaSeason {
  id: string;
  nameSanskrit: string;
  nameEnglish: string;
  indianMonths: string;
  englishMonths: string;
  kala: string;
  doshaState: {
    vata: string;
    pitta: string;
    kapha: string;
  };
  dominantRasas: string[];
  bodilyStrength: string;
  aharaRegimen: string[];
  viharaRegimen: string[];
  varjyaRegimen: string[];
  clinicalNotes: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'event' | 'loan' | 'exam' | 'sip';
  date: string;
  isRead: boolean;
  badge?: string;
}

export interface DinacharyaLog {
  date: string; // YYYY-MM-DD
  brahmaMuhurtaWakeup: boolean;
  ushapanWarmWater: boolean;
  dantadhavanaJivhaNirlekhana: boolean;
  nasyaKavalaGandusha: boolean;
  abhyangaOilMassage: boolean;
  vyayamaYogaPranayama: boolean;
  snanaBathing: boolean;
  sattvicAharaDiet: boolean;
  nidraSleepQuality: 1 | 2 | 3 | 4 | 5;
  notes: string;
}

export interface LifeCornerGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progressPercent: number;
  status: 'active' | 'completed' | 'planned';
  metric?: string;
}

export interface LifeCornersData {
  lifeGoals: {
    visionQuote: string;
    goals: LifeCornerGoal[];
  };
  wealthGeneration: {
    currentNetWorthEstimate: number;
    targetNetWorth: number;
    targetYear: number;
    emergencyFundMonths: number;
    strategies: string[];
    goals: LifeCornerGoal[];
  };
  relationships: {
    coreValues: string[];
    importantPeople: { name: string; relation: string; notes: string; birthday?: string }[];
    goals: LifeCornerGoal[];
  };
  academics: {
    bamsSpecializationInterests: string[];
    booksReading: string[];
    certificationsPlanned: string[];
    goals: LifeCornerGoal[];
  };
  investments: {
    currentPortfolioAllocation: { assetClass: string; percentage: number; target: number }[];
    activeSips: { fundName: string; amount: number; date: number }[];
    goals: LifeCornerGoal[];
  };
  passiveIncome: {
    monthlyPassiveTarget: number;
    currentPassiveMonthly: number;
    streams: { name: string; type: string; monthlyEstimate: number; status: 'active' | 'building' | 'idea' }[];
    goals: LifeCornerGoal[];
  };
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  targetDate?: string;
  budgetEstimated?: number;
  checklist: { id: string; text: string; done: boolean }[];
  notes?: string;
}

export interface RoadmapPhase {
  id: string;
  phaseName: string;
  order: number;
  steps: RoadmapStep[];
}

export interface Roadmap {
  id: string;
  title: string;
  category: 'clinical_setup' | 'exam_prep' | 'multiple_income' | 'custom';
  description: string;
  targetCompletionDate?: string;
  phases: RoadmapPhase[];
  overallProgress: number; // 0 - 100
}

export interface MonthPlan {
  monthYear: string; // YYYY-MM
  monthlyTheme: string;
  keyObjectives: string[];
  financialGoal: number;
  patientTarget: number;
  reflections?: {
    wins: string;
    challenges: string;
    learnings: string;
  };
}

export interface YearPlan {
  year: number;
  visionStatement: string;
  primaryPillars: {
    title: string;
    goal: string;
    status: 'in_progress' | 'achieved' | 'deferred';
  }[];
}
