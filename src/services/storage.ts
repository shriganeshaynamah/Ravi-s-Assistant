import type {
  CalendarEvent,
  NoteItem,
  ChecklistTask,
  ExpenseRecord,
  LoanItem,
  InvestmentItem,
  RoadmapMilestone,
  HabitItem,
  AppNotification,
  DinacharyaLog,
  JournalEntry,
} from '../types';

export const STORAGE_KEYS = {
  THEME: 'ayurlife_theme',
  EVENTS: 'ayurlife_events',
  NOTES: 'ayurlife_notes',
  CHECKLISTS: 'ayurlife_checklists',
  EXPENSES: 'ayurlife_expenses',
  EXPENSES_HISTORY: 'ayurlife_expenses_monthly_archive_v1',
  MONTHLY_5TH_SHEET_SYNC: 'ayurlife_monthly_5th_sheet_sync',
  LOANS: 'ayurlife_loans',
  INVESTMENTS: 'ayurlife_investments',
  MILESTONES: 'ayurlife_milestones',
  HABITS: 'ayurlife_habits',
  NOTIFICATIONS: 'ayurlife_notifications',
  DINACHARYA: 'ayurlife_dinacharya',
  JOURNAL: 'ayurlife_journal',
};

// Seed Dinacharya Logs from user JSON
export const defaultDinacharyaLogs: DinacharyaLog[] = [
  {
    date: '2026-10-05',
    brahmaMuhurtaWakeup: false,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: false,
    abhyangaOilMassage: false,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 3,
    notes: 'Purna Dinacharya adherence. High mental clarity and balanced Tridosha.',
  },
  {
    date: '2026-10-04',
    brahmaMuhurtaWakeup: true,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: true,
    abhyangaOilMassage: true,
    vyayamaYogaPranayama: false,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 5,
    notes: 'Brahma Muhurta meditation & Charaka Samhita recitation.',
  },
  {
    date: '2026-10-03',
    brahmaMuhurtaWakeup: false,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: true,
    abhyangaOilMassage: true,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: false,
    nidraSleepQuality: 3,
    notes: 'Hospital clinical ward duty in morning. Agni balanced with Sunthi kwath.',
  },
  {
    date: '2026-10-02',
    brahmaMuhurtaWakeup: true,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: true,
    abhyangaOilMassage: false,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 5,
    notes: 'Evening Pranayama & Nadi Shodhana. Peaceful sleep.',
  },
  {
    date: '2026-10-01',
    brahmaMuhurtaWakeup: false,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: false,
    abhyangaOilMassage: true,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 3,
    notes: 'Deep focus on Kayachikitsa clinical case notes.',
  },
  {
    date: '2026-09-30',
    brahmaMuhurtaWakeup: true,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: false,
    abhyangaOilMassage: true,
    vyayamaYogaPranayama: false,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 4,
    notes: 'Full herbal Abhyanga with sesame oil. High vitality and Ojas.',
  },
  {
    date: '2026-09-29',
    brahmaMuhurtaWakeup: true,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: false,
    abhyangaOilMassage: true,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 4,
    notes: 'Ushnodaka routine followed strictly. Sattvic diet maintained.',
  },
  {
    date: '2026-09-28',
    brahmaMuhurtaWakeup: true,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: true,
    abhyangaOilMassage: false,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 5,
    notes: 'Purna Dinacharya adherence. High mental clarity and balanced Tridosha.',
  },
  {
    date: '2026-09-27',
    brahmaMuhurtaWakeup: true,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: true,
    abhyangaOilMassage: true,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 5,
    notes: 'Brahma Muhurta meditation & Charaka Samhita recitation.',
  },
  {
    date: '2026-09-26',
    brahmaMuhurtaWakeup: false,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: true,
    abhyangaOilMassage: true,
    vyayamaYogaPranayama: false,
    snanaBathing: true,
    sattvicAharaDiet: false,
    nidraSleepQuality: 3,
    notes: 'Hospital clinical ward duty in morning. Agni balanced with Sunthi kwath.',
  },
  {
    date: '2026-09-25',
    brahmaMuhurtaWakeup: true,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: false,
    abhyangaOilMassage: false,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 4,
    notes: 'Evening Pranayama & Nadi Shodhana. Peaceful sleep.',
  },
  {
    date: '2026-09-24',
    brahmaMuhurtaWakeup: false,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: false,
    abhyangaOilMassage: false,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 3,
    notes: 'Deep focus on Kayachikitsa clinical case notes.',
  },
  {
    date: '2026-09-23',
    brahmaMuhurtaWakeup: true,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: true,
    abhyangaOilMassage: false,
    vyayamaYogaPranayama: false,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 5,
    notes: 'Full herbal Abhyanga with sesame oil. High vitality and Ojas.',
  },
  {
    date: '2026-09-22',
    brahmaMuhurtaWakeup: false,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: true,
    abhyangaOilMassage: false,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: false,
    nidraSleepQuality: 3,
    notes: 'Ushnodaka routine followed strictly. Sattvic diet maintained.',
  },
  {
    date: '2026-09-21',
    brahmaMuhurtaWakeup: true,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: true,
    abhyangaOilMassage: false,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 5,
    notes: 'Purna Dinacharya adherence. High mental clarity and balanced Tridosha.',
  },
  {
    date: '2026-09-20',
    brahmaMuhurtaWakeup: false,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: false,
    abhyangaOilMassage: true,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 3,
    notes: 'Brahma Muhurta meditation & Charaka Samhita recitation.',
  },
  {
    date: '2026-09-19',
    brahmaMuhurtaWakeup: true,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: false,
    abhyangaOilMassage: true,
    vyayamaYogaPranayama: false,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 4,
    notes: 'Hospital clinical ward duty in morning. Agni balanced with Sunthi kwath.',
  },
  {
    date: '2026-09-18',
    brahmaMuhurtaWakeup: true,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: false,
    abhyangaOilMassage: true,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 4,
    notes: 'Evening Pranayama & Nadi Shodhana. Peaceful sleep.',
  },
  {
    date: '2026-09-17',
    brahmaMuhurtaWakeup: true,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: true,
    abhyangaOilMassage: false,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 5,
    notes: 'Deep focus on Kayachikitsa clinical case notes.',
  },
  {
    date: '2026-09-16',
    brahmaMuhurtaWakeup: true,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: true,
    abhyangaOilMassage: false,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 5,
    notes: 'Full herbal Abhyanga with sesame oil. High vitality and Ojas.',
  },
  {
    date: '2026-09-15',
    brahmaMuhurtaWakeup: false,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: true,
    abhyangaOilMassage: false,
    vyayamaYogaPranayama: false,
    snanaBathing: true,
    sattvicAharaDiet: false,
    nidraSleepQuality: 3,
    notes: 'Ushnodaka routine followed strictly. Sattvic diet maintained.',
  },
  {
    date: '2026-09-14',
    brahmaMuhurtaWakeup: true,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: false,
    abhyangaOilMassage: false,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 4,
    notes: 'Purna Dinacharya adherence. High mental clarity and balanced Tridosha.',
  },
  {
    date: '2026-09-13',
    brahmaMuhurtaWakeup: false,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: false,
    abhyangaOilMassage: true,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 3,
    notes: 'Brahma Muhurta meditation & Charaka Samhita recitation.',
  },
  {
    date: '2026-09-12',
    brahmaMuhurtaWakeup: true,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: true,
    abhyangaOilMassage: true,
    vyayamaYogaPranayama: false,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 5,
    notes: 'Hospital clinical ward duty in morning. Agni balanced with Sunthi kwath.',
  },
  {
    date: '2026-09-11',
    brahmaMuhurtaWakeup: false,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: true,
    abhyangaOilMassage: false,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: false,
    nidraSleepQuality: 3,
    notes: 'Evening Pranayama & Nadi Shodhana. Peaceful sleep.',
  },
  {
    date: '2026-09-10',
    brahmaMuhurtaWakeup: true,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: true,
    abhyangaOilMassage: false,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 5,
    notes: 'Deep focus on Kayachikitsa clinical case notes.',
  },
  {
    date: '2026-09-09',
    brahmaMuhurtaWakeup: false,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: false,
    abhyangaOilMassage: true,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 3,
    notes: 'Full herbal Abhyanga with sesame oil. High vitality and Ojas.',
  },
  {
    date: '2026-09-08',
    brahmaMuhurtaWakeup: true,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: false,
    abhyangaOilMassage: true,
    vyayamaYogaPranayama: false,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 4,
    notes: 'Ushnodaka routine followed strictly. Sattvic diet maintained.',
  },
  {
    date: '2026-09-07',
    brahmaMuhurtaWakeup: true,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: false,
    abhyangaOilMassage: true,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 4,
    notes: 'Purna Dinacharya adherence. High mental clarity and balanced Tridosha.',
  },
  {
    date: '2026-09-06',
    brahmaMuhurtaWakeup: true,
    ushapanWarmWater: true,
    dantadhavanaJivhaNirlekhana: true,
    nasyaKavalaGandusha: true,
    abhyangaOilMassage: true,
    vyayamaYogaPranayama: true,
    snanaBathing: true,
    sattvicAharaDiet: true,
    nidraSleepQuality: 5,
    notes: 'Brahma Muhurta meditation & Charaka Samhita recitation.',
  },
];

export const generateDefaultDinacharyaLogs = (): DinacharyaLog[] => defaultDinacharyaLogs;

// Seed Academic / Career Milestones
export const defaultMilestones: RoadmapMilestone[] = [
  {
    id: 'milestone-1',
    key: 'final_proff',
    title: 'Final Proff BAMS Student',
    subtitle: 'Current Academic Year (2026 - 2027)',
    badge: 'Active Milestone',
    period: '2026 - 2027',
    status: 'current',
    description: 'Master final year clinical subjects: Kayachikitsa, Shalya Tantra, Shalakya Tantra, Panchakarma & Research Methodology.',
    academicDates: [
      { id: 'd-1', title: 'Kayachikitsa Paper I & II (Internal Medicine)', date: '2026-11-15', type: 'exam' },
      { id: 'd-2', title: 'Shalya Tantra Paper I & II (General Surgery)', date: '2026-11-20', type: 'exam' },
      { id: 'd-3', title: 'Shalakya Tantra (ENT, Eye, Head)', date: '2026-11-25', type: 'exam' },
      { id: 'd-4', title: 'Panchakarma Clinical Specialization Exam', date: '2026-11-28', type: 'exam' },
      { id: 'd-5', title: 'Research Methodology & Medical Statistics', date: '2026-12-02', type: 'exam' },
      { id: 'd-6', title: 'Bedside Clinical Viva & Practical Examination', date: '2026-12-10', type: 'exam' },
      { id: 'd-7', title: 'Submission of 50 Clinical Case Log Diaries', date: '2026-10-25', type: 'submission' },
    ],
    activities: [
      { id: 'a-1', text: 'Complete bedside Nadi Pariksha and clinical exam records', done: true, date: '2026-10-10' },
      { id: 'a-2', text: 'Revise Charaka Samhita Chikitsasthana cardinal sutras', done: true, date: '2026-10-18' },
      { id: 'a-3', text: 'Submit clinical OPD/IPD ward attendance register', done: false, date: '2026-10-28' },
      { id: 'a-4', text: 'Solve past 5 years university final proff question papers', done: false, date: '2026-11-05' },
    ],
    notes: 'Aim for university top 5 distinction rank to earn preferential internship and PG sponsorship.',
  },
  {
    id: 'milestone-2',
    key: 'internship',
    title: 'Rotatory Internship (1 Year)',
    subtitle: '6 Months Ayurveda + 6 Months Modern Hospital',
    badge: 'Upcoming (2027)',
    period: 'Jan 2027 - Jan 2028',
    status: 'upcoming',
    description: 'Mandatory 1-year rotatory clinical internship divided into 6 Months Ayurveda hospital and 6 Months Modern Allopathic hospital.',
    academicDates: [
      { id: 'id-1', title: 'Internship Orientation & Oath Ceremony', date: '2027-01-05', type: 'event' },
      { id: 'id-2', title: 'Ayurveda Rotatory Completion Assessment', date: '2027-07-05', type: 'exam' },
      { id: 'id-3', title: 'Modern Hospital Posting Commencement', date: '2027-07-06', type: 'event' },
      { id: 'id-4', title: 'Final Provisional Medical Registration (PMR)', date: '2028-01-15', type: 'submission' },
    ],
    internshipPostings: [
      {
        id: 'post-ayur',
        track: 'ayurveda',
        title: '6 Months Ayurvedic Teaching Hospital',
        duration: '6 Months (Jan - Jul 2027)',
        hospital: 'Ayurvedic Medical College Hospital',
        departments: [
          'Kayachikitsa OPD & In-Patient Ward (2 Months)',
          'Panchakarma Center (Shirodhara, Basti, Vamana, Virechana) (1.5 Months)',
          'Shalya Tantra (Ksharasutra & Agnikarma unit) (1 Month)',
          'Shalakya Tantra (Netra Kriya Kalpa & Nasya) (0.5 Month)',
          'Prasuti Tantra & Stree Roga (0.5 Month)',
          'Dispensary, Herbarium & Hospital Pharmacy (0.5 Month)',
        ],
        done: false,
      },
      {
        id: 'post-modern',
        track: 'modern',
        title: '6 Months Modern Allopathic Hospital',
        duration: '6 Months (Jul 2027 - Jan 2028)',
        hospital: 'District Civil General Hospital / Medical College',
        departments: [
          'Casualty / Emergency Medicine (1 Month)',
          'General Medicine & ICU Ward (1.5 Months)',
          'General Surgery & OT Training (1 Month)',
          'Obstetrics & Gynecology (Labor Room) (1 Month)',
          'Pediatrics & Neonatal Care (0.5 Month)',
          'Primary Health Centre (PHC) Rural Posting (1 Month)',
        ],
        done: false,
      },
    ],
    activities: [
      { id: 'ia-1', text: 'Obtain stethoscope, clinical lab coat and medical kit', done: false },
      { id: 'ia-2', text: 'Maintain daily internship procedure logbook (Abhyanga, Basti, Suturing, IV cannulation)', done: false },
      { id: 'ia-3', text: 'Network with senior resident doctors and medical superintendents', done: false },
    ],
    notes: 'Focus on emergency drug protocols during modern posting and classical Panchakarma during Ayurvedic posting.',
  },
  {
    id: 'milestone-3',
    key: 'pg_mo_exam',
    title: 'Ayurvedic PG (AIAPGET) & MO Exam',
    subtitle: 'Competitive Entrance & State Medical Officer',
    badge: 'Preparation Phase',
    period: '2027 - 2028',
    status: 'upcoming',
    description: 'Master competitive MCQs for All India AYUSH PG Entrance (MD/MS Ayurveda) and State PSC Medical Officer exams.',
    academicDates: [
      { id: 'p-1', title: 'AIAPGET Notification Release', date: '2027-04-15', type: 'event' },
      { id: 'p-2', title: 'AIAPGET Entrance Examination', date: '2027-07-20', type: 'exam' },
      { id: 'p-3', title: 'State Medical Officer (Ayush MO) Screening', date: '2027-09-10', type: 'exam' },
    ],
    activities: [
      { id: 'pa-1', text: 'Complete full revision of Brihat Trayi (Charaka, Sushruta, Vagbhata)', done: false },
      { id: 'pa-2', text: 'Solve 10,000+ chapter-wise MCQs on national test portal', done: false },
      { id: 'pa-3', text: 'Attend weekly mock test series with negative marking analysis', done: false },
    ],
    notes: 'High score opens government stipend MD seat in Kayachikitsa / Panchakarma.',
  },
  {
    id: 'milestone-4',
    key: 'clinic_setup',
    title: 'Ayurvedic Clinical Setup & Practice',
    subtitle: 'Independent OPD & Panchakarma Haven',
    badge: 'Vision 2028+',
    period: '2028 Onwards',
    status: 'upcoming',
    description: 'Independent clinical practice setup with Panchakarma therapy rooms, classical dispensary, and herbal pharmacy.',
    academicDates: [
      { id: 'c-1', title: 'Permanent State Board Doctor Registration Certificate', date: '2028-02-01', type: 'submission' },
      { id: 'c-2', title: 'Commercial Clinic Space Lease Finalization', date: '2028-03-15', type: 'event' },
      { id: 'c-3', title: 'Grand Clinic Inauguration & Health Camp', date: '2028-05-01', type: 'event' },
    ],
    activities: [
      { id: 'ca-1', text: 'Order seasoned teakwood Panchakarma Droni and Shirodhara copper vessel', done: false },
      { id: 'ca-2', text: 'Partner with GMP certified classical herbal pharmacy suppliers', done: false },
      { id: 'ca-3', text: 'Set up digital clinic appointment QR codes and patient EMR software', done: false },
    ],
    notes: 'Aim to establish 20+ satisfied patients daily within the first 6 months.',
  },
];

// Seed Loans from user JSON
export const defaultLoans: LoanItem[] = [
  {
    id: 'loan-1791191233415',
    title: 'KreditBee Loan',
    lender: 'KreditBee',
    principalAmount: 22746,
    interestRate: 8.5,
    tenureMonths: 36,
    monthlyEmi: 3791,
    totalPaid: 0,
    status: 'active',
    startDate: '2026-10-05',
    borrowDate: '2026-10-05',
    lastPaidDate: '2026-10-05',
    dueDateDay: 10,
    paymentHistory: [],
  },
  {
    id: 'loan-1791191068291',
    title: 'Munchun Da',
    lender: 'Relative (Gpay+ may more)',
    principalAmount: 7500,
    interestRate: 8.5,
    tenureMonths: 36,
    monthlyEmi: 237,
    totalPaid: 0,
    status: 'active',
    startDate: '2026-10-05',
    borrowDate: '2026-10-05',
    lastPaidDate: '2026-10-05',
    dueDateDay: 10,
    paymentHistory: [],
  },
  {
    id: 'loan-1791190968831',
    title: 'Parvesh Da',
    lender: 'Relative',
    principalAmount: 50000,
    interestRate: 8.5,
    tenureMonths: 36,
    monthlyEmi: 1578,
    totalPaid: 0,
    status: 'active',
    startDate: '2022-11-05',
    borrowDate: '2022-11-05',
    lastPaidDate: '2026-10-05',
    dueDateDay: 10,
    paymentHistory: [],
  },
  {
    id: 'loan-1791190882502',
    title: 'BAMS ED. LOAN',
    lender: 'IDBI',
    principalAmount: 400000,
    interestRate: 12,
    tenureMonths: 36,
    monthlyEmi: 13286,
    totalPaid: 0,
    status: 'active',
    startDate: '2026-10-05',
    borrowDate: '2026-10-05',
    lastPaidDate: '2026-10-05',
    dueDateDay: 10,
    paymentHistory: [],
  },
];

// Seed Investments from user JSON
export const defaultInvestments: InvestmentItem[] = [];

// Seed Notifications from user JSON
export const defaultNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Final Proff Exam Forms',
    message: 'University exam form submission closes in 5 days.',
    type: 'exam',
    date: 'Today',
    isRead: false,
    badge: 'Exam',
  },
  {
    id: 'notif-2',
    title: 'Education Loan EMI Due',
    message: '₹9,245 auto-debit on the 10th of this month.',
    type: 'loan',
    date: 'Yesterday',
    isRead: false,
    badge: 'Finance',
  },
  {
    id: 'notif-3',
    title: 'Monthly SIP Executed',
    message: '₹5,000 invested in Nifty 50 Index Fund.',
    type: 'sip',
    date: '3 days ago',
    isRead: true,
    badge: 'Wealth',
  },
  {
    id: 'notif-4',
    title: 'Charaka Shloka Test',
    message: 'Weekly group Samhita recitation at 7:00 PM tomorrow.',
    type: 'event',
    date: '4 days ago',
    isRead: true,
    badge: 'Study',
  },
];

// Seed User Custom Habits from user JSON
export const defaultHabits: HabitItem[] = [
  {
    id: 'habit-1',
    name: 'Study 2hr daily (BAMS Final Proff & Charaka)',
    description: 'Deep focus clinical study: Charaka Chikitsa Sthana & Modern Pharmacology',
    category: 'ayurveda_study',
    targetDaysPerWeek: 7,
    completedDates: ['2026-10-05', '2026-10-04', '2026-10-03', '2026-10-02'],
    streak: 4,
    icon: 'BookOpen',
  },
  {
    id: 'habit-2',
    name: 'No Fap (Brahmacharya & Ojas Preservation)',
    description: 'Preserving Sukra Dhatu and mental focus for clinical acumen and stamina',
    category: 'discipline',
    targetDaysPerWeek: 7,
    completedDates: ['2026-10-05', '2026-10-04', '2026-10-03', '2026-10-02', '2026-10-01'],
    streak: 12,
    icon: 'ShieldCheck',
  },
  {
    id: 'habit-3',
    name: 'Daily 15min Pranayama & Meditation',
    description: 'Anuloma Viloma and Nadi Shodhana to balance Prana & Udana Vayu',
    category: 'fitness',
    targetDaysPerWeek: 7,
    completedDates: ['2026-10-05', '2026-10-04'],
    streak: 2,
    icon: 'Activity',
  },
  {
    id: 'habit-4',
    name: 'Daily 3L Ushnapana & Hydration',
    description: 'Warm copper vessel water to promote Agni and flush metabolic Ama',
    category: 'dinacharya',
    targetDaysPerWeek: 7,
    completedDates: ['2026-10-05'],
    streak: 1,
    icon: 'Droplets',
  },
  {
    id: 'habit-5',
    name: 'Evening OPD Case Record Review',
    description: 'Documenting 3 patient pulse (Nadi) and tongue (Jihwa) examination patterns',
    category: 'clinic_growth',
    targetDaysPerWeek: 6,
    completedDates: ['2026-10-04'],
    streak: 3,
    icon: 'ClipboardList',
  },
];

// Seed Personal Vault & Daily Journal Entries from user JSON
export const defaultJournalEntries: JournalEntry[] = [];

// Seed Keep Notes from user JSON
export const defaultKeepNotes: NoteItem[] = [];

// Seed Tasks & Events from user JSON
export const defaultTasksList: ChecklistTask[] = [];
export const defaultEventsList: CalendarEvent[] = [];

// Seed Expenses from user JSON
export const defaultExpensesList: ExpenseRecord[] = [
  {
    id: 'exp-1791191325300',
    date: '2026-10-05',
    type: 'expense',
    amount: 3000,
    category: 'living_personal',
    description: 'Rent',
    paymentMode: 'upi',
  },
  {
    id: 'exp-1791191283091',
    date: '2026-10-01',
    type: 'income',
    amount: 5000,
    category: 'other',
    description: 'Bhaiya (Birthday k liy)',
    paymentMode: 'upi',
  },
];

// Keep seed version key for backwards compatibility without overwriting existing saved user edits
const USER_JSON_SEED_VERSION_KEY = 'ayurlife_user_json_seed_v2026_10_05_r2';
const didApplyFreshUserJsonSeed = false;

// Request permanent storage permission from browser / Android WebView so data is never evicted
try {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().catch(() => {});
  }
} catch {}

const IDB_NAME = 'ayurlife_persistent_idb';
const IDB_STORE = 'kv_store';

// Capture what was in localStorage at initial script boot BEFORE React initial render effects run
const BOOT_LS_SNAPSHOT_RAW = (() => {
  try {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem('ayurlife_cloud_full_snapshot')
      : null;
  } catch {
    return null;
  }
})();

let isIDBHydrationFinished = false;

const openPersistentIDB = (): Promise<IDBDatabase | null> => {
  return new Promise((resolve) => {
    try {
      if (typeof indexedDB === 'undefined') {
        resolve(null);
        return;
      }
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
};

export const writeToIDB = async (key: string, value: string): Promise<void> => {
  try {
    const db = await openPersistentIDB();
    if (!db) return;
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(value, key);
  } catch {}
};

export const readFromIDB = async (key: string): Promise<string | null> => {
  try {
    const db = await openPersistentIDB();
    if (!db) return null;
    return await new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => resolve(typeof req.result === 'string' ? req.result : null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
};

// Map STORAGE_KEYS to snapshot field names for automatic fallback recovery
const KEY_TO_SNAPSHOT_FIELD: Record<string, string> = {
  [STORAGE_KEYS.MILESTONES]: 'milestones',
  [STORAGE_KEYS.LOANS]: 'loans',
  [STORAGE_KEYS.INVESTMENTS]: 'investments',
  [STORAGE_KEYS.EXPENSES]: 'expenses',
  [STORAGE_KEYS.NOTES]: 'notes',
  [STORAGE_KEYS.CHECKLISTS]: 'tasks',
  [STORAGE_KEYS.EVENTS]: 'events',
  [STORAGE_KEYS.NOTIFICATIONS]: 'notifications',
  [STORAGE_KEYS.DINACHARYA]: 'dinacharyaLogs',
  [STORAGE_KEYS.HABITS]: 'habits',
  [STORAGE_KEYS.JOURNAL]: 'journalEntries',
};

export const getStoredData = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null && raw !== undefined && raw !== '') {
      return JSON.parse(raw);
    }
    // Check master snapshot in localStorage if individual key was cleared
    const snapRaw = localStorage.getItem('ayurlife_cloud_full_snapshot');
    const snapField = KEY_TO_SNAPSHOT_FIELD[key];
    if (snapRaw && snapField) {
      const snap = JSON.parse(snapRaw);
      if (snap && snap[snapField] !== undefined) {
        return snap[snapField] as T;
      }
    }
    return fallback;
  } catch (e) {
    return fallback;
  }
};

export const setStoredData = <T>(key: string, data: T): void => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    if (isIDBHydrationFinished || BOOT_LS_SNAPSHOT_RAW) {
      writeToIDB(key, serialized);
    }
    // Also record local/cloud sync status
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    localStorage.setItem('ayurlife_cloud_last_synced', timeStr);
    window.dispatchEvent(new CustomEvent('ayurlife_cloud_synced', { detail: { time: timeStr, key } }));
  } catch (e) {}
};

export const getLastCloudSyncTime = (): string => {
  try {
    return localStorage.getItem('ayurlife_cloud_last_synced') || 'Just now';
  } catch (e) {
    return 'Just now';
  }
};

export const autoSaveToCloud = (allData: Record<string, any>): void => {
  try {
    const payload = {
      ...allData,
      _seedVersion: USER_JSON_SEED_VERSION_KEY,
      _savedAtTimestamp: Date.now(),
    };
    const serialized = JSON.stringify(payload);
    localStorage.setItem('ayurlife_cloud_full_snapshot', serialized);
    if (isIDBHydrationFinished || BOOT_LS_SNAPSHOT_RAW) {
      writeToIDB('ayurlife_cloud_full_snapshot', serialized);
    }
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    localStorage.setItem('ayurlife_cloud_last_synced', timeStr);
    window.dispatchEvent(new CustomEvent('ayurlife_cloud_synced', { detail: { time: timeStr } }));
  } catch (e) {}
};

/**
 * Permanently archives and merges expenses across all months so previous months' expenses are never lost
 */
export const syncExpensesToMonthlyArchive = (currentExpenses: ExpenseRecord[]): ExpenseRecord[] => {
  try {
    const sorted = [...(currentExpenses || [])].sort((a, b) =>
      (b.date || '').localeCompare(a.date || '')
    );
    const serialized = JSON.stringify(sorted);
    localStorage.setItem(STORAGE_KEYS.EXPENSES_HISTORY, serialized);
    writeToIDB(STORAGE_KEYS.EXPENSES_HISTORY, serialized);
    return sorted;
  } catch {
    return currentExpenses;
  }
};

export const removeExpenseFromMonthlyArchive = (expenseId: string): void => {
  try {
    const rawArchive = localStorage.getItem(STORAGE_KEYS.EXPENSES_HISTORY);
    if (!rawArchive) return;
    const archivedList: ExpenseRecord[] = JSON.parse(rawArchive);
    const filtered = archivedList.filter((e) => e.id !== expenseId);
    const serialized = JSON.stringify(filtered);
    localStorage.setItem(STORAGE_KEYS.EXPENSES_HISTORY, serialized);
    writeToIDB(STORAGE_KEYS.EXPENSES_HISTORY, serialized);
  } catch {}
};

export const clearAllMonthlyArchivedExpenses = (): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.EXPENSES_HISTORY, '[]');
    writeToIDB(STORAGE_KEYS.EXPENSES_HISTORY, '[]');
  } catch {}
};

export const getAllArchivedAndCurrentExpenses = (currentExpenses?: ExpenseRecord[]): ExpenseRecord[] => {
  try {
    const active = currentExpenses ?? getStoredData<ExpenseRecord[]>(STORAGE_KEYS.EXPENSES, defaultExpensesList);
    return [...(active || [])].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  } catch {
    return currentExpenses || [];
  }
};

/**
 * Hydrates state from IndexedDB if localStorage was cleared by an Android APK WebView restart
 */
export const hydrateFromPersistentDB = async (
  onHydrated: (snapshot: Record<string, any>) => void
): Promise<void> => {
  try {
    if (didApplyFreshUserJsonSeed) {
      isIDBHydrationFinished = true;
      const currentLs = localStorage.getItem('ayurlife_cloud_full_snapshot');
      if (currentLs) {
        await writeToIDB('ayurlife_cloud_full_snapshot', currentLs);
      }
      return;
    }

    const idbSnapRaw = await readFromIDB('ayurlife_cloud_full_snapshot');
    if (!idbSnapRaw) {
      isIDBHydrationFinished = true;
      const currentLs = localStorage.getItem('ayurlife_cloud_full_snapshot');
      if (currentLs) {
        writeToIDB('ayurlife_cloud_full_snapshot', currentLs);
      }
      return;
    }
    const idbSnap = JSON.parse(idbSnapRaw);
    if (!idbSnap || typeof idbSnap !== 'object') {
      isIDBHydrationFinished = true;
      return;
    }

    let shouldRestoreFromIDB = !BOOT_LS_SNAPSHOT_RAW;

    if (BOOT_LS_SNAPSHOT_RAW) {
      try {
        const lsSnap = JSON.parse(BOOT_LS_SNAPSHOT_RAW);
        const idbTime = Number(idbSnap._savedAtTimestamp || 0);
        const lsTime = Number(lsSnap?._savedAtTimestamp || 0);
        if (idbTime > lsTime) {
          shouldRestoreFromIDB = true;
        }
      } catch {
        shouldRestoreFromIDB = true;
      }
    }

    isIDBHydrationFinished = true;

    if (shouldRestoreFromIDB) {
      localStorage.setItem('ayurlife_cloud_full_snapshot', idbSnapRaw);
      Object.entries(KEY_TO_SNAPSHOT_FIELD).forEach(([storageKey, field]) => {
        if (idbSnap[field] !== undefined) {
          localStorage.setItem(storageKey, JSON.stringify(idbSnap[field]));
        }
      });
      onHydrated(idbSnap);
    }
  } catch {
    isIDBHydrationFinished = true;
  }
};

