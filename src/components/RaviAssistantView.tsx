import React, { useState, useMemo } from 'react';
import type {
  LoanItem,
  InvestmentItem,
  ExpenseRecord,
  HabitItem,
  DinacharyaLog,
  RoadmapMilestone,
  ChecklistTask,
} from '../types';
import type { FeatureTab } from './HamburgerDrawer';
import {
  Sparkles,
  Bot,
  Brain,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Stethoscope,
  Send,
  Zap,
  ArrowRight,
  Flame,
  Search,
  ExternalLink,
  Printer,
  Copy,
  Check,
  ChevronRight,
  RefreshCw,
  Heart,
  Droplets,
  Calendar,
  Layers,
  FileText,
  Info,
  RotateCcw,
  HelpCircle,
  ListFilter,
  CheckSquare,
  X,
} from 'lucide-react';
import {
  queryMedicalAssistant,
  analyzeLifeOSData,
  getInvestigationReferenceDetails,
  type InvestigationReferenceGuide,
  type MedicalAnalysisResult,
  type MedicalCaseQuery,
} from '../services/geminiMedical';
import { CLINICAL_DISEASE_PRESETS, type ClinicalDiseasePreset } from '../data/clinicalDiseasePresets';
import { PrakritiAssessmentModal, type PrakritiAssessmentResult } from './PrakritiAssessmentModal';
import { PrescriptionPadView } from './PrescriptionPadView';
import { DifferentialDiagnosisModal } from './DifferentialDiagnosisModal';

interface RaviAssistantViewProps {
  loans: LoanItem[];
  investments: InvestmentItem[];
  expenses: ExpenseRecord[];
  habits: HabitItem[];
  dinacharyaLogs: DinacharyaLog[];
  milestones: RoadmapMilestone[];
  tasks: ChecklistTask[];
  onNavigate: (tab: FeatureTab) => void;
  isDark?: boolean;
}

export const RaviAssistantView: React.FC<RaviAssistantViewProps> = ({
  loans,
  investments,
  expenses,
  habits,
  dinacharyaLogs,
  milestones,
  tasks,
  onNavigate,
  isDark = true,
}) => {
  const [activeTab, setActiveTab] = useState<'solver' | 'medics'>('solver');

  // LifeOS Problem Solver Analysis
  const solverAnalysis = useMemo(() => {
    return analyzeLifeOSData({
      loans,
      investments,
      expenses,
      habits,
      dinacharyaLogs,
      milestones,
      tasks,
    });
  }, [loans, investments, expenses, habits, dinacharyaLogs, milestones, tasks]);

  // Custom AI Query for LifeOS Solver
  const [customSolverQuery, setCustomSolverQuery] = useState('');
  const [isSolvingCustom, setIsSolvingCustom] = useState(false);
  const [customSolverResult, setCustomSolverResult] = useState<string | null>(null);

  // Medics Section State
  const [patientAge, setPatientAge] = useState<string | number>('38');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other' | ''>('Female');
  const [patientPrakriti, setPatientPrakriti] = useState('Vata-Pitta');
  const [patientAgni, setPatientAgni] = useState<string>('Vishamagni');
  const [patientKostha, setPatientKostha] = useState<string>('Krura Kostha');
  const [isPrakritiModalOpen, setIsPrakritiModalOpen] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('amavata');

  const [diseaseInput, setDiseaseInput] = useState('Amavata (Rheumatoid Arthritis)');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [durationInput, setDurationInput] = useState('');
  const [notesInput, setNotesInput] = useState('');

  const [isSearchingMedics, setIsSearchingMedics] = useState(false);
  const [medicsResult, setMedicsResult] = useState<MedicalAnalysisResult | null>(null);
  const [isCopiedRx, setIsCopiedRx] = useState(false);
  const [isCopiedDDx, setIsCopiedDDx] = useState(false);
  const [selectedAcharya, setSelectedAcharya] = useState<string>('charaka');
  const [confirmedMedicines, setConfirmedMedicines] = useState<Record<string, boolean>>({});
  const [confirmedShodhana, setConfirmedShodhana] = useState<Record<string, boolean>>({});
  const [confirmedInvestigations, setConfirmedInvestigations] = useState<Record<string, boolean>>({});
  const [confirmedModernMedicines, setConfirmedModernMedicines] = useState<Record<string, boolean>>({});
  const [checkedDifferentialQuestions, setCheckedDifferentialQuestions] = useState<Record<string, boolean>>({});
  const [prashnaAnswers, setPrashnaAnswers] = useState<Record<number, string>>({});
  const [additionalPrashnaNote, setAdditionalPrashnaNote] = useState<string>('');
  const [isRefreshingPrashna, setIsRefreshingPrashna] = useState<boolean>(false);
  const [prashnaRefreshedBanner, setPrashnaRefreshedBanner] = useState<string | null>(null);
  const [activeInvestigationInfo, setActiveInvestigationInfo] = useState<InvestigationReferenceGuide | null>(null);
  const [showPrescriptionPad, setShowPrescriptionPad] = useState(false);
  const [isDDxModalOpen, setIsDDxModalOpen] = useState(false);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (!presetId) return;
    const p = CLINICAL_DISEASE_PRESETS.find((d) => d.id === presetId);
    if (p) {
      setDiseaseInput(p.name);
      // As requested: clear other boxes and let doctor enter whatever details they want to provide; symptoms optional
      setSymptomsInput('');
      setDurationInput('');
      setNotesInput('');
      setPatientAge('');
    }
  };

  const handleClearAllFields = () => {
    setSelectedPresetId('');
    setDiseaseInput('');
    setSymptomsInput('');
    setDurationInput('');
    setNotesInput('');
    setPatientAge('');
  };

  const handleFillPresetDefaultSymptoms = () => {
    if (!selectedPresetId) return;
    const p = CLINICAL_DISEASE_PRESETS.find((d) => d.id === selectedPresetId);
    if (p) {
      setSymptomsInput(p.symptoms);
      setDurationInput(p.typicalDuration);
    }
  };

  const handleSavePrakritiAssessment = (result: PrakritiAssessmentResult) => {
    setPatientPrakriti(result.prakriti);
    setPatientAgni(result.agni);
    setPatientKostha(result.kostha);
  };

  const handleExecuteMedicsSearch = async () => {
    if (!diseaseInput.trim() && !symptomsInput.trim()) {
      alert('Please select a disease from presets or enter a disease name.');
      return;
    }
    setIsSearchingMedics(true);
    setMedicsResult(null);
    setCheckedDifferentialQuestions({});
    setPrashnaAnswers({});
    setAdditionalPrashnaNote('');
    setPrashnaRefreshedBanner(null);
    try {
      const res = await queryMedicalAssistant({
        patientAge: patientAge ? Number(patientAge) || patientAge : undefined,
        patientGender: patientGender || undefined,
        prakriti: `${patientPrakriti} (Agni: ${patientAgni}, Kostha: ${patientKostha})`,
        agni: patientAgni,
        kostha: patientKostha,
        diseaseName: diseaseInput.trim() || undefined,
        symptoms: symptomsInput.trim() || (diseaseInput ? `Suspected case of ${diseaseInput}. Classical Ayurvedic Shlokas, differential diagnosis inquiry and Modern Medicine therapeutics requested.` : ''),
        duration: durationInput.trim() || undefined,
        notes: notesInput.trim() || undefined,
      });
      setMedicsResult(res);

      // Pre-check all suggested medicines for prescription builder
      const initChecks: Record<string, boolean> = {};
      res.ayurvedicAnalysis.shamanaChikitsa.forEach((m) => {
        initChecks[m.medicineName] = true;
      });
      // Also pre-check Acharya variants if any
      if (res.ayurvedicAnalysis.acharyaProtocols) {
        Object.values(res.ayurvedicAnalysis.acharyaProtocols).forEach((proto) => {
          proto.shamanaChikitsa?.forEach((m) => {
            initChecks[m.medicineName] = true;
          });
        });
      }
      setConfirmedMedicines(initChecks);

      const initShodh: Record<string, boolean> = {};
      res.ayurvedicAnalysis.shodhanaChikitsa.forEach((s) => {
        initShodh[s.procedure] = true;
      });
      if (res.ayurvedicAnalysis.acharyaProtocols) {
        Object.values(res.ayurvedicAnalysis.acharyaProtocols).forEach((proto) => {
          proto.shodhanaChikitsa?.forEach((s) => {
            initShodh[s.procedure] = true;
          });
        });
      }
      setConfirmedShodhana(initShodh);

      const initInv: Record<string, boolean> = {};
      res.modernMedicineAnalysis.recommendedInvestigations.forEach((inv) => {
        const key = typeof inv === 'string' ? inv : inv.testName;
        initInv[key] = true;
      });
      setConfirmedInvestigations(initInv);

      const initModern: Record<string, boolean> = {};
      res.modernMedicineAnalysis.pharmacotherapyStandard.forEach((p) => {
        initModern[p.genericName] = true;
      });
      setConfirmedModernMedicines(initModern);
    } catch (e: any) {
      alert(`Search error: ${e.message}`);
    } finally {
      setIsSearchingMedics(false);
    }
  };

  const handleCopyPrescription = () => {
    if (!medicsResult) return;
    const ageStr = patientAge ? `${patientAge}Y` : 'Adult';
    const activeAcharyaProto = medicsResult.ayurvedicAnalysis.acharyaProtocols?.[selectedAcharya];
    const activeShloka = activeAcharyaProto?.shlokaReference || medicsResult.ayurvedicAnalysis.shlokaReference;
    const activeShamanaList =
      activeAcharyaProto?.shamanaChikitsa && activeAcharyaProto.shamanaChikitsa.length > 0
        ? activeAcharyaProto.shamanaChikitsa
        : medicsResult.ayurvedicAnalysis.shamanaChikitsa;

    const text = `DR. RAVI SHANKAR (BAMS DOCTOR) - CLINICAL PRESCRIPTION
Patient: ${ageStr} / ${patientGender || 'Unspecified'} | Prakriti: ${patientPrakriti} (Agni: ${patientAgni}, Kostha: ${patientKostha})
Clinical Diagnosis: ${medicsResult.ayurvedicAnalysis.vyadhiVinischaya}
Classical Reference: ${activeShloka.sourceBook} (${activeShloka.chapterAndVerse})${activeAcharyaProto ? ` • ${activeAcharyaProto.acharyaName}` : ''}

--- AYURVEDIC SHAMANA CHIKITSA (CONFIRMED) ---
${activeShamanaList
  .filter((m) => confirmedMedicines[m.medicineName] !== false)
  .map((m, idx) => `${idx + 1}. ${m.medicineName} (${m.category}) - Dose: ${m.dosage} | Anupana: ${m.anupana} | Timing: ${m.timing}`)
  .join('\n')}

--- PATHYA / DIET GUIDELINES ---
Beneficial (Pathya): ${medicsResult.ayurvedicAnalysis.pathyaApathya.pathyaAhara.join(', ')}
To Avoid (Apathya): ${medicsResult.ayurvedicAnalysis.pathyaApathya.apathyaAhara.join(', ')}

--- RECOMMENDED LAB TESTS ---
${medicsResult.modernMedicineAnalysis.recommendedInvestigations
  .filter((inv) => {
    const key = typeof inv === 'string' ? inv : inv.testName;
    return confirmedInvestigations[key] !== false;
  })
  .map((inv) => (typeof inv === 'string' ? inv.replace(/^★\s*/, '').trim() : inv.testName))
  .join('\n')}

Doctor Confirmation Signature: Dr. Ravi Shankar, BAMS`;

    navigator.clipboard.writeText(text);
    setIsCopiedRx(true);
    setTimeout(() => setIsCopiedRx(false), 2000);
  };

  const handleUpdatePrashnaAnswer = (idx: number, val: string) => {
    setPrashnaAnswers((prev) => ({
      ...prev,
      [idx]: val,
    }));
    setCheckedDifferentialQuestions((prev) => ({
      ...prev,
      [idx]: Boolean(val.trim()),
    }));
  };

  const handleRefreshWithPrashnaAnswers = async () => {
    if (!medicsResult) return;
    const questions = medicsResult.differentialDiagnosis?.suggestedClinicalQuestions || [];
    const answeredList: { question: string; answer: string }[] = [];

    questions.forEach((q, idx) => {
      const ans = prashnaAnswers[idx]?.trim();
      if (ans) {
        answeredList.push({ question: q, answer: ans });
      }
    });

    if (additionalPrashnaNote.trim()) {
      answeredList.push({
        question: 'Additional Patient History / Clinical Observation',
        answer: additionalPrashnaNote.trim(),
      });
    }

    if (answeredList.length === 0) {
      alert('Please enter at least one patient answer before submitting to refresh Diagnosis & Treatments.');
      return;
    }

    setIsRefreshingPrashna(true);
    setPrashnaRefreshedBanner(null);
    try {
      const combinedNotes = [
        notesInput.trim(),
        `Prashna Pariksha Answers: ${answeredList.map((a) => `${a.question} -> ${a.answer}`).join(' | ')}`,
      ]
        .filter(Boolean)
        .join('\n');

      const res = await queryMedicalAssistant({
        patientAge: patientAge ? Number(patientAge) || patientAge : undefined,
        patientGender: patientGender || undefined,
        prakriti: `${patientPrakriti} (Agni: ${patientAgni}, Kostha: ${patientKostha})`,
        agni: patientAgni,
        kostha: patientKostha,
        diseaseName: diseaseInput.trim() || undefined,
        symptoms:
          symptomsInput.trim() ||
          (diseaseInput
            ? `Suspected case of ${diseaseInput}. Refined with patient Prashna Pariksha answers.`
            : ''),
        duration: durationInput.trim() || undefined,
        notes: combinedNotes,
        prashnaAnswers: answeredList,
      });

      setMedicsResult(res);

      // Ensure any newly added Shamana or Shodhana medicines are pre-checked
      setConfirmedMedicines((prev) => {
        const next = { ...prev };
        res.ayurvedicAnalysis.shamanaChikitsa.forEach((m) => {
          if (next[m.medicineName] === undefined) next[m.medicineName] = true;
        });
        if (res.ayurvedicAnalysis.acharyaProtocols) {
          Object.values(res.ayurvedicAnalysis.acharyaProtocols).forEach((proto) => {
            proto.shamanaChikitsa?.forEach((m) => {
              if (next[m.medicineName] === undefined) next[m.medicineName] = true;
            });
          });
        }
        return next;
      });

      setPrashnaRefreshedBanner(
        `Diagnosis & Treatments refreshed using ${answeredList.length} patient Prashna Pariksha response(s). Updated clinical diagnosis: ${res.ayurvedicAnalysis.vyadhiVinischaya}`
      );
    } catch (e: any) {
      alert(`Error refreshing diagnosis: ${e.message}`);
    } finally {
      setIsRefreshingPrashna(false);
    }
  };

  const handleCopyDifferentialQuestions = () => {
    if (!medicsResult?.differentialDiagnosis?.suggestedClinicalQuestions) return;
    const qList = medicsResult.differentialDiagnosis.suggestedClinicalQuestions
      .map((q, idx) => {
        const ans = prashnaAnswers[idx]?.trim();
        return `${idx + 1}. [${ans ? '✓' : ' '}] ${q}${ans ? `\n   Patient Answer: ${ans}` : ''}`;
      })
      .join('\n');
    const ageStr = patientAge ? `${patientAge}Y` : 'Adult';
    const text = `DR. RAVI SHANKAR (BAMS) - CLINICAL DIFFERENTIAL INQUIRY (PRASHNA PARIKSHA)
Case: ${diseaseInput || medicsResult.ayurvedicAnalysis.vyadhiVinischaya}
Patient: ${ageStr} / ${patientGender || 'Unspecified'} | Prakriti: ${patientPrakriti}
Agni: ${patientAgni} | Kostha: ${patientKostha}

DIFFERENTIAL QUESTIONS TO ASK THE PATIENT:
${qList}

Doctor: Dr. Ravi Shankar, BAMS`;

    navigator.clipboard.writeText(text);
    setIsCopiedDDx(true);
    setTimeout(() => setIsCopiedDDx(false), 2000);
  };

  const handleSolveCustomQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSolverQuery.trim()) return;
    setIsSolvingCustom(true);
    setCustomSolverResult(null);

    // Contextual intelligent prompt for Dr. Ravi
    setTimeout(() => {
      const q = customSolverQuery.toLowerCase();
      let res = '';
      if (q.includes('loan') || q.includes('emi') || q.includes('debt') || q.includes('money') || q.includes('short') || q.includes('expense') || q.includes('brother') || q.includes('friend')) {
        res = `Strategic Debt & Low-Income Month Liquidity Plan for Dr. Ravi Shankar:\n1. Tier-1 Minor Shortfall Bridge (₹1,000–₹2,000): If monthly income dips and you are short by ₹1,000–₹2,000 for essentials or EMI, borrow ₹1k–₹2k interest-free from a trusted friend for 1 month and repay it first from next month's inflow.\n2. Tier-2 Occasional Larger Shortfall (Up to ₹5,000): Only in non-regular months where exams, clinical postings, or unavoidable expenses create a larger gap (up to ₹5,000), request up to ₹5,000 from your brother rather than touching high-interest credit apps.\n3. Accelerated Principal Reduction: In surplus months, allocate ₹1,000–₹2,000 extra directly to loan principal and build a ₹5,000 personal buffer pot so you gradually become 100% self-funded.`;
      } else if (q.includes('clinic') || q.includes('future') || q.includes('setup')) {
        res = `Flagship Ayurvedic Clinic 2027 Strategic Blueprint:\n1. Location & Setup: Target Tier 1 or Tier 2 high-density residential area with proximity to Ayurvedic pharmacies. Estimated initial capex: ₹3.5L (Droni, Swedana box, consultation setup, initial Kashaya/Guggulu inventory).\n2. Specialized Core Niche: Differentiate through Agnikarma, Viddhakarma, and Joint & Spine Care (Sandhi-Vata Chikitsa), which deliver immediate symptomatic relief and drive word-of-mouth patient trust.\n3. Cash Buffer: Maintain a dedicated ₹4,000/mo automated SIP fund today to accumulate ₹2.2L+ safe capital before completion of internship.`;
      } else {
        res = `LifeOS Strategic Recommendation for Dr. Ravi Shankar:\n• Financial Health: Maintain your current ₹5,000 SIP discipline while steadily preparing for loan prepayment.\n• Clinical Acumen: Dedicate 90 minutes daily to Charaka Samhita Chikitsa Sthana and case diary analysis.\n• Dinacharya: Prioritize 4:30 AM Brahma Muhurta waking with warm Ushnodaka to preserve mental Ojas throughout rigorous hospital rounds.`;
      }
      setCustomSolverResult(res);
      setIsSolvingCustom(false);
    }, 600);
  };

  if (showPrescriptionPad && medicsResult) {
    return (
      <PrescriptionPadView
        result={medicsResult}
        patientAge={patientAge}
        patientGender={patientGender}
        patientPrakriti={patientPrakriti}
        patientAgni={patientAgni}
        patientKostha={patientKostha}
        diseaseInput={diseaseInput}
        confirmedMedicines={confirmedMedicines}
        confirmedShodhana={confirmedShodhana}
        confirmedInvestigations={confirmedInvestigations}
        confirmedModernMedicines={confirmedModernMedicines}
        selectedAcharya={selectedAcharya}
        onBack={() => setShowPrescriptionPad(false)}
        isDark={isDark}
      />
    );
  }

  return (
    <div className="space-y-4 pb-28 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-4 rounded-3xl bg-linear-to-r from-emerald-600 via-teal-700 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-36 h-36 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight">Ravi’s Assistant</h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-400/30 text-emerald-200 border border-emerald-400/40">
                  AI Intelligence &amp; Cloud Active
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/90 font-medium mt-0.5">
                Executive LifeOS Problem-Solver &amp; BAMS Clinical Medics Therapeutics Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-black/20 p-1 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('solver')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'solver'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-emerald-600" />
              <span>LifeOS Solver</span>
            </button>
            <button
              onClick={() => setActiveTab('medics')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'medics'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              <span>Medicos Area 🩺</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 1: LIFE OS REVIEW & STRATEGIC PROBLEM SOLVER           */}
      {/* ============================================================== */}
      {activeTab === 'solver' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Health Score & Live Summary Strip */}
          <div
            className={`p-4 rounded-2xl border transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 text-white flex flex-col items-center justify-center font-mono shadow-xs shrink-0">
                <span className="text-base font-black leading-none">
                  {solverAnalysis.overallHealthScore}
                </span>
                <span className="text-[8px] font-bold uppercase opacity-90">/ 100</span>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  LifeOS Status &amp; Financial Health Index
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Scanning live loans, investments, cash flow, BAMS milestones &amp; 30-day habits
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs flex-wrap">
              <div className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Active EMIs</span>
                <span className="font-extrabold text-rose-500 font-mono text-xs">
                  ₹{loans.filter((l) => l.status === 'active').reduce((sum, l) => sum + (l.monthlyEmi || 0), 0).toLocaleString('en-IN')}/mo
                </span>
              </div>
              <div className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Wealth Portfolio</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono text-xs">
                  ₹{investments.reduce((sum, i) => sum + (i.currentValue || 0), 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Tracked Modules</span>
                <span className="font-extrabold text-teal-600 dark:text-teal-400 font-mono text-xs">
                  {solverAnalysis.trackedModulesCount} Live (Excl. Journals)
                </span>
              </div>
              <div className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Active Problems</span>
                <span className="font-extrabold text-amber-500 font-mono text-xs">
                  {solverAnalysis.criticalProblems.length} Detected
                </span>
              </div>
            </div>
          </div>

          {/* 6-Category Comprehensive LifeOS Tracker & Suggestions (Excludes Life Journals) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-500" />
                <span>Comprehensive LifeOS Tracker &amp; Suggestions (All 6 Modules • Excludes Life Journals)</span>
              </h3>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Includes ₹1k–₹2k Friend (1-Mo) &amp; ₹5k Brother (Occasional) Buffer Rules
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {solverAnalysis.categoryWiseSuggestions.map((cat) => (
                <div
                  key={cat.id}
                  className={`p-4 rounded-2xl border transition-all shadow-xs space-y-2.5 flex flex-col justify-between ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                          {cat.title}
                        </h4>
                        <p className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 mt-0.5">
                          {cat.trackedMetricsSummary}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          cat.statusBadge === 'Critical Action'
                            ? 'bg-rose-600 text-white'
                            : cat.statusBadge === 'Needs Attention'
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {cat.statusBadge}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                      {cat.analysisSummary}
                    </p>

                    {cat.emergencyBufferNote && (
                      <div className="p-2 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/60 text-[10px] font-bold text-amber-900 dark:text-amber-200">
                        💡 {cat.emergencyBufferNote}
                      </div>
                    )}

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                      <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                        Tailored Action Plan:
                      </span>
                      <ul className="space-y-1 text-[10.5px] text-slate-700 dark:text-slate-300 list-disc pl-3.5">
                        {cat.actionableSuggestions.map((sug, i) => (
                          <li key={i} className="leading-snug">
                            {sug}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Problems & High-Leverage Solutions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Problematic Areas &amp; Actionable Solutions</span>
              </h3>
              <span className="text-[10px] text-slate-400">
                Prioritized by financial &amp; clinical impact
              </span>
            </div>

            {solverAnalysis.criticalProblems.length === 0 ? (
              <div className="p-6 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  All Systems Optimal! No High-Risk Debt or Budget Deficits
                </p>
                <p className="text-[11px] text-slate-500">
                  Your loans are under control and routines are aligned.
                </p>
              </div>
            ) : (
              solverAnalysis.criticalProblems.map((prob) => (
                <div
                  key={prob.id}
                  className={`p-4 rounded-2xl border transition-all shadow-xs space-y-3 ${
                    prob.severity === 'critical'
                      ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
                      : isDark
                      ? 'bg-slate-900 border-slate-800'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            prob.severity === 'critical'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {prob.severity}
                        </span>
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                          {prob.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 font-medium">
                        {prob.currentProblem}
                      </p>
                    </div>

                    {prob.area === 'loans' && (
                      <button
                        onClick={() => onNavigate('loans')}
                        className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer shrink-0"
                      >
                        <span>Open Loans</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* The Suggested Solution Box */}
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Recommended Solution: {prob.suggestedSolution}</span>
                    </div>

                    <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300 pl-4 list-disc">
                      {prob.actionableSteps.map((step, idx) => (
                        <li key={idx} className="leading-tight">
                          {step}
                        </li>
                      ))}
                    </ul>

                    <div className="pt-1 border-t border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between text-[10px] text-emerald-900 dark:text-emerald-300 font-semibold">
                      <span>✓ Potential Payoff Benefit:</span>
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {prob.potentialBenefit}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Strategic Monetization & Wealth Growth Opportunities */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Money-Making &amp; Clinical Monetization Solutions</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {solverAnalysis.strategicOpportunities.map((opp, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border transition-all shadow-xs space-y-2 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {opp.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {opp.description}
                  </p>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-emerald-700 dark:text-emerald-300">
                    <strong>Action:</strong> {opp.actionPlan}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ask Custom LifeOS Question Box */}
          <div
            className={`p-4 rounded-2xl border transition-all shadow-xs space-y-3 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Ask Ravi’s Assistant for Custom Solutions
              </h4>
            </div>
            <p className="text-[11px] text-slate-500">
              Need advice on a loan, budgeting, SIP rebalancing, BAMS exam focus, or clinic launch?
            </p>

            <form onSubmit={handleSolveCustomQuery} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. If my loan EMI is ₹9,245, how can I earn extra ₹10,000/mo to close it early?"
                value={customSolverQuery}
                onChange={(e) => setCustomSolverQuery(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={isSolvingCustom}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isSolvingCustom ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Generate Plan</span>
              </button>
            </form>

            {customSolverResult && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5 animate-in fade-in">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Bot className="w-3 h-3" /> Ravi’s Assistant Solution:
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {customSolverResult}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 2: MEDICS (AYURVEDIC TEXTBOOKS & MODERN MEDICINE)      */}
      {/* ============================================================== */}
      {activeTab === 'medics' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Medics Query Input Card */}
          <div
            className={`p-4 rounded-3xl border transition-all shadow-xs space-y-3.5 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Medicos Area
                </h3>
              </div>
            </div>

            {/* Quick Clinical Disease Preset Dropdown (60+ Conditions in Alphabetical Order) */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-800/40">
              <div className="flex items-center justify-between flex-wrap gap-1.5">
                <span className="text-[10px] font-extrabold text-teal-800 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ListFilter className="w-3.5 h-3.5" />
                  Quick Clinical Disease Preset ({CLINICAL_DISEASE_PRESETS.length} Diseases A-Z):
                </span>
                <div className="flex items-center gap-2">
                  {selectedPresetId && (
                    <button
                      type="button"
                      onClick={handleFillPresetDefaultSymptoms}
                      className="text-[10px] font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                      title="Load classical textbook symptoms for this disease"
                    >
                      + Fill Sample Symptoms
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleClearAllFields}
                    className="text-[10px] font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear All Fields</span>
                  </button>
                </div>
              </div>

              <div>
                <select
                  value={selectedPresetId}
                  onChange={(e) => handleSelectPreset(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-teal-300/80 dark:border-teal-700 text-xs font-semibold text-slate-900 dark:text-white shadow-2xs cursor-pointer focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">-- Choose Disease Preset (60+ Conditions in Alphabetical Order) --</option>
                  {CLINICAL_DISEASE_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name} [{preset.category}]
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                Selecting a preset sets the disease name and clears other inputs so you can enter only what you want. Presenting symptoms is optional.
              </p>
            </div>

            {/* Form Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Age (Optional)
                </label>
                <input
                  type="text"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="e.g. 38 or blank"
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Gender
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value as any)}
                  className="w-full px-2 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="">Unspecified</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Prakriti
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsPrakritiModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[9.5px] font-extrabold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 bg-teal-100/70 dark:bg-teal-950/70 px-1.5 py-0.5 rounded-md border border-teal-300 dark:border-teal-700 cursor-pointer shadow-2xs transition-all"
                    title="Open Prakriti, Agni & Kostha Pariksha Questionnaire (i)"
                  >
                    <Info className="w-3 h-3" />
                    <span>Pariksha (i)</span>
                  </button>
                </div>
                <select
                  value={patientPrakriti}
                  onChange={(e) => setPatientPrakriti(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white cursor-pointer font-medium"
                >
                  <option value="Vata-Pitta">Vata-Pitta</option>
                  <option value="Pitta-Kapha">Pitta-Kapha</option>
                  <option value="Vata-Kapha">Vata-Kapha</option>
                  <option value="Vata Pradhana">Vata Pradhana</option>
                  <option value="Pitta Pradhana">Pitta Pradhana</option>
                  <option value="Kapha Pradhana">Kapha Pradhana</option>
                  <option value="Sama-Prakriti">Sama Prakriti</option>
                </select>
                {patientAgni && (
                  <div className="mt-1 flex items-center gap-1 text-[9px] text-teal-700 dark:text-teal-300 font-bold truncate">
                    <span>🔥 {patientAgni}</span>
                    <span>•</span>
                    <span>💧 {patientKostha}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Duration / Kala (Optional)
                </label>
                <input
                  type="text"
                  value={durationInput}
                  onChange={(e) => setDurationInput(e.target.value)}
                  placeholder="e.g. 3 weeks, 6 months"
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Disease Name & Symptoms */}
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Disease / Vyadhi Name or Suspected Diagnosis
                </label>
                <input
                  type="text"
                  value={diseaseInput}
                  onChange={(e) => setDiseaseInput(e.target.value)}
                  placeholder="e.g. Amavata / Rheumatoid Arthritis, Sandhivata, Amlapitta, Gridhrasi"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Presenting Symptoms, Chief Complaints &amp; Rogi Lakshanas <span className="text-teal-600 dark:text-teal-400 font-normal lowercase">(optional)</span>
                  </label>
                  {diseaseInput && !symptomsInput && (
                    <span className="text-[9.5px] text-slate-400">
                      Empty by default — enter only what you want
                    </span>
                  )}
                </div>
                <textarea
                  rows={2}
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  placeholder="Optional: Enter specific complaints (joint stiffness, digestion, burning, fever), or leave blank to evaluate pure disease entity..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleExecuteMedicsSearch}
              disabled={isSearchingMedics}
              className="w-full py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSearchingMedics ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Loading Diagnosis &amp; Treatments...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Diagnosis &amp; Treatments</span>
                </>
              )}
            </button>
          </div>

          {/* ================= SEARCH RESULTS DISPLAY ================= */}
          {medicsResult && (() => {
            // Resolve active Acharya protocol if chosen
            const activeAcharyaProtocol = medicsResult.ayurvedicAnalysis.acharyaProtocols?.[selectedAcharya];
            const currentShloka = activeAcharyaProtocol?.shlokaReference || medicsResult.ayurvedicAnalysis.shlokaReference;
            const currentChikitsaSutra = activeAcharyaProtocol?.chikitsaSutra || medicsResult.ayurvedicAnalysis.chikitsaSutra;
            const currentChikitsaSutraRef =
              activeAcharyaProtocol?.chikitsaSutraReference ||
              `${currentShloka.sourceBook} (${currentShloka.chapterAndVerse})`;
            const currentShamana = (activeAcharyaProtocol?.shamanaChikitsa && activeAcharyaProtocol.shamanaChikitsa.length > 0)
              ? activeAcharyaProtocol.shamanaChikitsa
              : medicsResult.ayurvedicAnalysis.shamanaChikitsa;
            const currentShodhana = (activeAcharyaProtocol?.shodhanaChikitsa && activeAcharyaProtocol.shodhanaChikitsa.length > 0)
              ? activeAcharyaProtocol.shodhanaChikitsa
              : medicsResult.ayurvedicAnalysis.shodhanaChikitsa;
            const currentParaSurgical = activeAcharyaProtocol?.paraSurgicalTherapy || medicsResult.ayurvedicAnalysis.paraSurgicalTherapy;

            return (
              <div className="space-y-4 animate-in fade-in zoom-in-95">
                {prashnaRefreshedBanner && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{prashnaRefreshedBanner}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPrashnaRefreshedBanner(null)}
                      className="text-[10px] underline cursor-pointer shrink-0"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Doctor Review Banner with Save Prescription Button */}
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>Dr. Ravi Shankar (BAMS) Clinical Suggestion:</strong> Review the therapy below, tick desired medicines &amp; investigations, choose classical Acharya reference, and save the official clinic prescription pad.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowPrescriptionPad(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Save Prescription</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyPrescription}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                      title="Copy Raw Text to Clipboard"
                    >
                      {isCopiedRx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopiedRx ? 'Copied!' : 'Copy Text'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Actions Bar Directly Above Classical Ayurvedic Box */}
                <div className="flex items-center justify-start flex-wrap gap-2 px-1">
                  <button
                    type="button"
                    onClick={() => setIsDDxModalOpen(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold cursor-pointer transition-all shadow-2xs hover:shadow-sm"
                  >
                    <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Differential Diagnosis (Vyavacchedaka Nidana)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200 font-black">
                      Popup Clinical Guide
                    </span>
                  </button>
                </div>

                {/* 1. AYURVEDIC SECTION (ALWAYS FIRST PRIORITY) */}
                <div
                  className={`p-5 rounded-3xl border transition-all shadow-md space-y-4 ${
                    isDark
                      ? 'bg-slate-900 border-emerald-500/40'
                      : 'bg-white border-emerald-400 shadow-emerald-500/5'
                  }`}
                >
                  {/* Header with Acharya Reference Dropdown */}
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
                        1. Classical Ayurvedic Diagnosis &amp; Chikitsa (Priority)
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                        {medicsResult.ayurvedicAnalysis.vyadhiVinischaya}
                      </h3>
                    </div>

                    {/* Small Acharya Dropdown Selector */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300 shrink-0" />
                        <label className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider hidden sm:inline">
                          Acharya:
                        </label>
                        <select
                          value={selectedAcharya}
                          onChange={(e) => setSelectedAcharya(e.target.value)}
                          className="text-xs font-extrabold text-emerald-900 dark:text-emerald-100 bg-transparent border-0 cursor-pointer focus:outline-none pr-1"
                        >
                          <option value="charaka" className="text-slate-900 bg-white">Charak Samhita (Acharya Charaka)</option>
                          <option value="sushruta" className="text-slate-900 bg-white">Sushruta Samhita (Acharya Sushruta)</option>
                          <option value="vagbhata" className="text-slate-900 bg-white">Ashtang Hridaya / Sangrah (Acharya Vagbhata)</option>
                          <option value="chakradatta" className="text-slate-900 bg-white">Chakradatta (Acharya Chakrapani Datta)</option>
                          <option value="sharangadhara" className="text-slate-900 bg-white">Sharangadhara Samhita (Acharya Sharangadhara)</option>
                        </select>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shrink-0">
                        Ayurveda Primary
                      </span>
                    </div>
                  </div>

                  {/* Active Acharya Philosophy & Direct Mention Status Banner */}
                  {activeAcharyaProtocol && (
                    <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[10px] uppercase font-extrabold text-teal-800 dark:text-teal-300 tracking-wider">
                          Classical Acharya Authority: {activeAcharyaProtocol.acharyaName} ({activeAcharyaProtocol.sourceTextbook})
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold ${
                            activeAcharyaProtocol.isDirectlyMentioned
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {activeAcharyaProtocol.isDirectlyMentioned
                            ? '✓ Directly Mentioned in This Samhita'
                            : 'ℹ️ Correlated via Dosha/Lakshanas (Not Named as Separate Chapter)'}
                        </span>
                      </div>
                      {activeAcharyaProtocol.mentionStatusNote && (
                        <div
                          className={`p-2 rounded-xl border text-[11px] leading-snug ${
                            activeAcharyaProtocol.isDirectlyMentioned
                              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200'
                              : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/70 text-amber-950 dark:text-amber-200'
                          }`}
                        >
                          <strong>Samhita Textual Status:</strong> {activeAcharyaProtocol.mentionStatusNote}
                        </div>
                      )}
                      <p className="text-[11px] font-medium text-slate-800 dark:text-slate-200 leading-snug">
                        <strong>Clinical Philosophy:</strong> {activeAcharyaProtocol.clinicalPhilosophy}
                      </p>
                    </div>
                  )}

                  {/* Classical Sanskrit Shloka Box */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-700/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        Classical Samhita Shloka &amp; Reference:
                      </span>
                      <span className="text-[10.5px] font-bold font-mono text-amber-800 dark:text-amber-300">
                        {currentShloka.sourceBook} ({currentShloka.chapterAndVerse})
                        {activeAcharyaProtocol ? ` • ${activeAcharyaProtocol.acharyaName}` : ''}
                      </span>
                    </div>

                    <p className="text-base font-bold text-slate-900 dark:text-amber-100 font-serif leading-relaxed text-center py-1">
                      {currentShloka.shlokaSanskrit}
                    </p>

                    <p className="text-xs italic text-slate-600 dark:text-slate-400 text-center font-mono text-[11px]">
                      "{currentShloka.shlokaTransliteration}"
                    </p>

                    <div className="pt-2 border-t border-amber-200 dark:border-amber-800/60 text-[11.5px] text-slate-800 dark:text-slate-300 leading-relaxed">
                      <strong>Samhita Meaning:</strong> {currentShloka.meaning}
                    </div>
                  </div>

                  {/* Chikitsa Sutra with Acharya Reference */}
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-xs space-y-1.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider text-[10.5px] flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        Chikitsa Sutra (Core Treatment Axiom as per {activeAcharyaProtocol ? activeAcharyaProtocol.acharyaName : 'Classical Samhita'}):
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-950 dark:text-emerald-200 font-mono font-bold text-[10px]">
                        Ref: {currentChikitsaSutraRef}
                      </span>
                    </div>
                    <p className="text-[12px] text-slate-900 dark:text-slate-100 font-serif font-semibold leading-relaxed">
                      {currentChikitsaSutra}
                    </p>
                  </div>

                  {/* Shamana Chikitsa (Aushadha Prescriptions) with Ticks & Classical Reference */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        Shamana Aushadha (Internal Formulations as per {activeAcharyaProtocol ? activeAcharyaProtocol.acharyaName : 'Classical Texts'})
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        Tick to include in Dr. Ravi’s confirmed Rx
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {currentShamana.map((med, idx) => {
                        const medRef =
                          (med as { reference?: string }).reference ||
                          (activeAcharyaProtocol
                            ? `${activeAcharyaProtocol.sourceTextbook} (${activeAcharyaProtocol.acharyaName})`
                            : `${currentShloka.sourceBook} (${currentShloka.chapterAndVerse})`);
                        return (
                          <div
                            key={idx}
                            onClick={() =>
                              setConfirmedMedicines({
                                ...confirmedMedicines,
                                [med.medicineName]:
                                  confirmedMedicines[med.medicineName] === false
                                    ? true
                                    : !confirmedMedicines[med.medicineName],
                              })
                            }
                            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                              confirmedMedicines[med.medicineName] !== false
                                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-600 shadow-2xs'
                                : 'opacity-50 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[9px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                                    {med.category}
                                  </span>
                                  <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300/70 dark:border-amber-800">
                                    📖 {medRef}
                                  </span>
                                </div>
                                <h5 className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">
                                  {med.medicineName}
                                </h5>
                              </div>
                              <span
                                className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                  confirmedMedicines[med.medicineName] !== false
                                    ? 'bg-emerald-600 text-white'
                                    : 'border border-slate-400'
                                }`}
                              >
                                ✓
                              </span>
                            </div>

                            <div className="mt-2 space-y-0.5 text-[11px] text-slate-700 dark:text-slate-300">
                              <p>
                                <strong>Dose:</strong> {med.dosage}
                              </p>
                              <p>
                                <strong>Anupana:</strong> {med.anupana}
                              </p>
                              <p>
                                <strong>Timing:</strong> {med.timing}
                              </p>
                              <p className="text-[10px] text-slate-500 italic pt-0.5">
                                {med.indications}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shodhana (Panchakarma) with Ticks & Para-Surgical (Agnikarma/Viddhakarma) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                          Shodhana Chikitsa (Panchakarma Protocols)
                        </span>
                        <span className="text-[9.5px] text-slate-400">
                          Tick to include in Rx
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {currentShodhana.map((shodh, idx) => (
                          <div
                            key={idx}
                            onClick={() =>
                              setConfirmedShodhana({
                                ...confirmedShodhana,
                                [shodh.procedure]: confirmedShodhana[shodh.procedure] === false ? true : !confirmedShodhana[shodh.procedure],
                              })
                            }
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                              confirmedShodhana[shodh.procedure] !== false
                                ? 'bg-teal-50/70 dark:bg-teal-950/30 border-teal-300 dark:border-teal-700'
                                : 'opacity-50 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <strong className="text-slate-900 dark:text-white text-xs block">
                                  {shodh.procedure}
                                </strong>
                                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
                                  {shodh.details}
                                </p>
                              </div>
                              <span
                                className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                  confirmedShodhana[shodh.procedure] !== false
                                    ? 'bg-teal-600 text-white'
                                    : 'border border-slate-400'
                                }`}
                              >
                                ✓
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {currentParaSurgical && (
                      <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700/60 space-y-2">
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                          Para-Surgical: {currentParaSurgical.therapyName}
                        </span>
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-tight">
                          {currentParaSurgical.procedureNotes}
                        </p>
                        <p className="text-[10px] font-mono text-amber-800 dark:text-amber-300">
                          <strong>Technique:</strong>{' '}
                          {currentParaSurgical.siteAndInstruments}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Pathya - Apathya Diet & Vihara */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase block mb-1">
                        ✓ Pathya Ahara (Beneficial)
                      </span>
                      <ul className="text-[11px] space-y-0.5 text-slate-700 dark:text-slate-300 list-disc pl-3">
                        {medicsResult.ayurvedicAnalysis.pathyaApathya.pathyaAhara.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60">
                      <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase block mb-1">
                        ✕ Apathya Ahara (Avoid)
                      </span>
                      <ul className="text-[11px] space-y-0.5 text-slate-700 dark:text-slate-300 list-disc pl-3">
                        {medicsResult.ayurvedicAnalysis.pathyaApathya.apathyaAhara.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase block mb-1">
                        🧘 Vihara (Lifestyle Rules)
                      </span>
                      <ul className="text-[11px] space-y-0.5 text-slate-700 dark:text-slate-300 list-disc pl-3">
                        {medicsResult.ayurvedicAnalysis.pathyaApathya.viharaRules.map((v, i) => (
                          <li key={i}>{v}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

              {/* 2. MODERN MEDICINE EVIDENCE & INVESTIGATIONS */}
              <div
                className={`p-5 rounded-3xl border transition-all shadow-xs space-y-4 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest block">
                      2. Modern Medicine Clinical Correlation &amp; Standard of Care
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      Harrison’s &amp; Robbins Pathological Differential
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    Supportive Evidence
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Recommended Lab Tests with Ticks */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                        Essential Diagnostic Investigations:
                      </span>
                      <span className="text-[9.5px] text-slate-400">
                        Tick to include in Rx
                      </span>
                    </div>

                    <div className="space-y-2">
                      {medicsResult.modernMedicineAnalysis.recommendedInvestigations.map(
                        (inv, idx) => {
                          const invKey = typeof inv === 'string' ? inv : inv.testName;
                          const invPurpose = typeof inv === 'string' ? '' : inv.diagnosticPurpose;
                          const isMandatory =
                            typeof inv === 'string' ? inv.includes('★') : Boolean(inv.isMandatory);
                          const isChecked = confirmedInvestigations[invKey] !== false;

                          return (
                            <div
                              key={idx}
                              onClick={() =>
                                setConfirmedInvestigations({
                                  ...confirmedInvestigations,
                                  [invKey]:
                                    confirmedInvestigations[invKey] === false
                                      ? true
                                      : !confirmedInvestigations[invKey],
                                })
                              }
                              className={`p-2.5 rounded-xl border cursor-pointer transition-all space-y-1 ${
                                isChecked
                                  ? isMandatory
                                    ? 'bg-amber-50/70 dark:bg-amber-950/25 border-amber-400 dark:border-amber-700 text-slate-900 dark:text-slate-100'
                                    : 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 text-blue-950 dark:text-blue-200'
                                  : 'opacity-50 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {isMandatory && (
                                      <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider shrink-0">
                                        ★ Mandatory / Must Perform
                                      </span>
                                    )}
                                    <span className="text-[11px] font-bold">{invKey}</span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveInvestigationInfo(
                                          getInvestigationReferenceDetails(invKey, invPurpose)
                                        );
                                      }}
                                      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black shadow-2xs cursor-pointer transition-transform hover:scale-110 shrink-0"
                                      title="View Normal Reference Value & What Abnormal Values Indicate (i)"
                                    >
                                      i
                                    </button>
                                  </div>
                                  {invPurpose && (
                                    <p className="text-[10.5px] text-slate-600 dark:text-slate-300 leading-snug font-normal">
                                      <strong className="text-blue-700 dark:text-blue-300">Why Done &amp; What It Detects:</strong>{' '}
                                      {invPurpose}
                                    </p>
                                  )}
                                </div>
                                <span
                                  className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                                    isChecked
                                      ? 'bg-blue-600 text-white'
                                      : 'border border-slate-400'
                                  }`}
                                >
                                  ✓
                                </span>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Red Flags & Emergency Criteria */}
                  <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50 space-y-2">
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Clinical Red Flags &amp; Referral Triggers:
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300 list-disc pl-4">
                      {medicsResult.modernMedicineAnalysis.redFlagsAndEmergency.map((flag, idx) => (
                        <li key={idx}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Modern Pharmacotherapy Standard with Ticks */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Modern Pharmacotherapy Reference (Katzung / Harrison’s):
                    </span>
                    <span className="text-[9.5px] text-slate-400">
                      Tick to include in Rx
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {medicsResult.modernMedicineAnalysis.pharmacotherapyStandard.map((pharm, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          setConfirmedModernMedicines({
                            ...confirmedModernMedicines,
                            [pharm.genericName]: confirmedModernMedicines[pharm.genericName] === false ? true : !confirmedModernMedicines[pharm.genericName],
                          })
                        }
                        className={`p-3 rounded-xl border space-y-1 cursor-pointer transition-all ${
                          confirmedModernMedicines[pharm.genericName] !== false
                            ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700'
                            : 'opacity-50 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <strong className="text-slate-900 dark:text-white text-xs">
                              {pharm.genericName}
                            </strong>
                            <span className="text-[9px] uppercase px-1.5 py-0.2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded font-bold">
                              {pharm.drugClass}
                            </span>
                          </div>
                          <span
                            className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              confirmedModernMedicines[pharm.genericName] !== false
                                ? 'bg-blue-600 text-white'
                                : 'border border-slate-400'
                            }`}
                          >
                            ✓
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          {pharm.standardRegimen}
                        </p>
                        <p className="text-[10px] text-rose-600 dark:text-rose-400">
                          <strong>Caution:</strong> {pharm.cautionOrMonitoring}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Textbook Citations */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[10px] text-slate-500 flex-wrap">
                  <span className="font-bold">Textbook Citations:</span>
                  {medicsResult.modernMedicineAnalysis.textbookReferences.map((ref, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[9.5px]"
                    >
                      {ref}
                    </span>
                  ))}
                </div>
              </div>

              {/* 3. DIFFERENTIAL DIAGNOSIS & CLINICAL INQUIRY (VYAVACCHEDAKA NIDANA & PRASHNA PARIKSHA) */}
              {medicsResult.differentialDiagnosis && (
                <div
                  className={`p-5 rounded-3xl border transition-all shadow-md space-y-4 ${
                    isDark
                      ? 'bg-slate-900 border-indigo-500/40'
                      : 'bg-white border-indigo-300 shadow-indigo-500/5'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3 flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
                        3. Differential Diagnosis &amp; Clinical Inquiry (Vyavacchedaka Nidana)
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                        Competing Conditions, Hallmark Differentiation &amp; Prashna Pariksha
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      Doctor Clinical Decision Support
                    </span>
                  </div>

                  {/* Primary Disease Confirmation & Elimination Protocol */}
                  {medicsResult.differentialDiagnosis.confirmationProtocol && (
                    <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800/60 space-y-3 text-xs">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                          ✓ Confirmed Primary Diagnosis Protocol: {medicsResult.differentialDiagnosis.confirmationProtocol.targetDisease}
                        </span>
                        <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
                          Definitive Confirmation &amp; Rule-Out
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                          <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase block">
                            Ayurvedic Confirmation (Pratyatma Lakshana &amp; Upashaya)
                          </span>
                          <p className="text-[11px] text-slate-800 dark:text-slate-200 font-semibold">
                            {medicsResult.differentialDiagnosis.confirmationProtocol.ayurvedicConfirmation.pratyatmaLakshana}
                          </p>
                          <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                            <strong>Therapeutic Trial (Upashaya):</strong>{' '}
                            {medicsResult.differentialDiagnosis.confirmationProtocol.ayurvedicConfirmation.therapeuticTrialConfirmation}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/60 space-y-1">
                          <span className="text-[10px] font-extrabold text-blue-700 dark:text-blue-400 uppercase block">
                            Modern Gold-Standard Confirmation
                          </span>
                          <p className="text-[11px] text-slate-800 dark:text-slate-200 font-semibold">
                            {medicsResult.differentialDiagnosis.confirmationProtocol.modernConfirmation.goldStandardCriteria}
                          </p>
                          <ul className="text-[10px] text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
                            {medicsResult.differentialDiagnosis.confirmationProtocol.modernConfirmation.confirmatoryBiomarkers.slice(0, 3).map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Competing Diagnoses Comparison Cards */}
                  {medicsResult.differentialDiagnosis.competingConditions?.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Differentiating Hallmark Features &amp; Why Competing Conditions Are Ruled Out:
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                        {medicsResult.differentialDiagnosis.competingConditions.map((diff, idx) => (
                          <div
                            key={idx}
                            className={`p-3.5 rounded-2xl border transition-all space-y-1.5 ${
                              isDark
                                ? 'bg-slate-800/60 border-slate-700'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <h5 className="font-extrabold text-xs text-indigo-900 dark:text-indigo-200">
                                {diff.condition}
                              </h5>
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                                {diff.category}
                              </span>
                            </div>
                            {diff.correlatedSymptoms && (
                              <p className="text-[10.5px] text-amber-700 dark:text-amber-300">
                                <strong>Overlapping / Correlated Symptoms:</strong> {diff.correlatedSymptoms}
                              </p>
                            )}
                            {diff.whyNotThisCondition && (
                              <p className="text-[10.5px] text-rose-700 dark:text-rose-300 font-medium">
                                <strong>Why Not This Condition:</strong> {diff.whyNotThisCondition}
                              </p>
                            )}
                            <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                              <strong>Distinguishing Feature:</strong> {diff.pratyatmaLakshana}
                            </p>
                            <div className="pt-1 border-t border-slate-200 dark:border-slate-700 text-[10.5px] space-y-0.5 text-slate-600 dark:text-slate-400">
                              <p className="text-emerald-600 dark:text-emerald-400">
                                <strong>Rule In:</strong> {diff.ruleInPoints}
                              </p>
                              <p className="text-rose-600 dark:text-rose-400">
                                <strong>Rule Out:</strong> {diff.ruleOutPoints}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Questions to Ask the Patient (Prashna Pariksha) */}
                  {medicsResult.differentialDiagnosis.suggestedClinicalQuestions?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border-2 border-indigo-200 dark:border-indigo-800/60 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <h5 className="text-xs font-extrabold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                            Suggested Questions to Ask the Patient (Prashna Pariksha for DDx)
                          </h5>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyDifferentialQuestions}
                          className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                        >
                          {isCopiedDDx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopiedDDx ? 'Copied Q&A!' : 'Copy Questions'}</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Ask the patient these targeted questions, enter or tap their answers below, and click <strong>Submit Patient Answers &amp; Refresh Diagnosis &amp; Treatments</strong>:
                      </p>

                      <div className="space-y-2.5 pt-1">
                        {medicsResult.differentialDiagnosis.suggestedClinicalQuestions.map((q, idx) => {
                          const currentAns = prashnaAnswers[idx] || '';
                          const isAnswered = Boolean(currentAns.trim()) || !!checkedDifferentialQuestions[idx];
                          return (
                            <div
                              key={idx}
                              className={`p-3 rounded-xl border transition-all text-xs space-y-2 ${
                                isAnswered
                                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/70'
                                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2">
                                  <span
                                    onClick={() =>
                                      setCheckedDifferentialQuestions({
                                        ...checkedDifferentialQuestions,
                                        [idx]: !checkedDifferentialQuestions[idx],
                                      })
                                    }
                                    className={`w-4 h-4 mt-0.5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 cursor-pointer transition-colors ${
                                      isAnswered
                                        ? 'bg-emerald-600 text-white'
                                        : 'border border-slate-300 dark:border-slate-600 text-transparent'
                                    }`}
                                  >
                                    ✓
                                  </span>
                                  <span className="font-bold text-slate-900 dark:text-white leading-snug">
                                    {idx + 1}. {q}
                                  </span>
                                </div>
                                <span className="text-[9.5px] font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                                  {isAnswered ? 'Answered ✓' : 'Pending'}
                                </span>
                              </div>

                              {/* Quick Answer Chips + Patient Answer Input */}
                              <div className="pl-6 space-y-1.5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[9.5px] font-bold text-slate-400 uppercase">
                                    Quick Fill:
                                  </span>
                                  {[
                                    'Yes, Present',
                                    'No / Absent',
                                    'Mild / Occasional',
                                    'Severe / Daily',
                                    'Relieved by Warmth',
                                    'Worse After Meals',
                                  ].map((chip) => (
                                    <button
                                      key={chip}
                                      type="button"
                                      onClick={() =>
                                        handleUpdatePrashnaAnswer(
                                          idx,
                                          currentAns ? `${currentAns}; ${chip}` : chip
                                        )
                                      }
                                      className="px-2 py-0.5 rounded-lg bg-indigo-100/80 dark:bg-indigo-950/80 hover:bg-indigo-200 dark:hover:bg-indigo-900 text-indigo-800 dark:text-indigo-300 text-[9.5px] font-bold cursor-pointer transition-colors"
                                    >
                                      + {chip}
                                    </button>
                                  ))}
                                  {currentAns && (
                                    <button
                                      type="button"
                                      onClick={() => handleUpdatePrashnaAnswer(idx, '')}
                                      className="text-[9.5px] text-rose-500 hover:underline font-semibold cursor-pointer ml-1"
                                    >
                                      Clear
                                    </button>
                                  )}
                                </div>

                                <input
                                  type="text"
                                  value={currentAns}
                                  onChange={(e) => handleUpdatePrashnaAnswer(idx, e.target.value)}
                                  placeholder="Enter patient's answer (e.g., Yes, morning stiffness > 90 mins, worse with cold water)..."
                                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Additional Patient Answer Notes + Submit & Refresh Diagnosis Button */}
                      <div className="pt-2 border-t border-indigo-200/80 dark:border-indigo-800/60 space-y-2.5">
                        <div>
                          <label className="text-[10px] font-extrabold text-indigo-900 dark:text-indigo-300 uppercase block mb-1">
                            Additional Patient Answers / Clinical Observations (Optional):
                          </label>
                          <input
                            type="text"
                            value={additionalPrashnaNote}
                            onChange={(e) => setAdditionalPrashnaNote(e.target.value)}
                            placeholder="Any other answer or clinical sign noted during Prashna Pariksha..."
                            className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-[10.5px] text-indigo-800 dark:text-indigo-300 font-medium">
                            Submitting patient answers re-evaluates Sama/Nirama stage, Differential Diagnosis &amp; Treatment protocol.
                          </span>
                          <button
                            type="button"
                            onClick={handleRefreshWithPrashnaAnswers}
                            disabled={isRefreshingPrashna}
                            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                          >
                            {isRefreshingPrashna ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Refreshing Diagnosis &amp; Treatments...</span>
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-4 h-4" />
                                <span>Submit Answers &amp; Refresh Diagnosis &amp; Treatments</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Prakriti, Agni & Kostha Pariksha Modal */}
      <PrakritiAssessmentModal
        isOpen={isPrakritiModalOpen}
        onClose={() => setIsPrakritiModalOpen(false)}
        onSave={handleSavePrakritiAssessment}
        isDark={isDark}
      />

      {/* Differential Diagnosis (Vyavacchedaka Nidana) Modal */}
      <DifferentialDiagnosisModal
        isOpen={isDDxModalOpen}
        onClose={() => setIsDDxModalOpen(false)}
        result={medicsResult}
        activeDiseaseName={diseaseInput || medicsResult?.ayurvedicAnalysis.vyadhiVinischaya || ''}
        prashnaAnswers={prashnaAnswers}
        onUpdatePrashnaAnswer={handleUpdatePrashnaAnswer}
        onSubmitPrashnaAnswers={handleRefreshWithPrashnaAnswers}
        isRefreshingPrashna={isRefreshingPrashna}
        isDark={isDark}
      />

      {/* Investigation Normal Value & Clinical Interpretation Modal (i) */}
      {activeInvestigationInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setActiveInvestigationInfo(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden transition-all ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-blue-50/70 dark:bg-blue-950/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                  i
                </div>
                <div>
                  <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                    Diagnostic Investigation • Normal Value &amp; Interpretation Guide
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {activeInvestigationInfo.testName}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveInvestigationInfo(null)}
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
              {/* Normal Reference Range */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border-2 border-emerald-300 dark:border-emerald-700/70 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                  ✓ Standard Normal Reference Value
                </span>
                <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono">
                  {activeInvestigationInfo.normalRange}
                </p>
              </div>

              {/* Clinical Purpose */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300 block">
                  Clinical Diagnostic Purpose
                </span>
                <p className="text-[11.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeInvestigationInfo.clinicalPurpose}
                </p>
              </div>

              {/* Value-by-Value Clinical Indications */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  What Different Values Indicate (Clinical &amp; Ayurvedic Interpretation):
                </span>
                <div className="space-y-2">
                  {activeInvestigationInfo.interpretations.map((interp, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-2xl border space-y-1 ${
                        interp.severity === 'normal'
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                          : interp.severity === 'borderline'
                          ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
                          : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10.5px] font-extrabold text-slate-900 dark:text-white font-mono">
                          • {interp.valueRange}
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            interp.severity === 'normal'
                              ? 'bg-emerald-600 text-white'
                              : interp.severity === 'borderline'
                              ? 'bg-amber-500 text-white'
                              : 'bg-rose-600 text-white'
                          }`}
                        >
                          {interp.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                        {interp.indication}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/70 dark:bg-slate-800/50">
              <button
                type="button"
                onClick={() => setActiveInvestigationInfo(null)}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
              >
                Close Reference Info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
