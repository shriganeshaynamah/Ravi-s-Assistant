import React from 'react';
import { X, Search, ShieldCheck, HelpCircle, CheckCircle2, AlertCircle, BookOpen, Layers } from 'lucide-react';
import type { MedicalAnalysisResult } from '../services/geminiMedical';

interface DifferentialDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: MedicalAnalysisResult | null;
  activeDiseaseName: string;
  prashnaAnswers?: Record<number, string>;
  onUpdatePrashnaAnswer?: (idx: number, val: string) => void;
  onSubmitPrashnaAnswers?: () => void;
  isRefreshingPrashna?: boolean;
  isDark?: boolean;
}

export const DifferentialDiagnosisModal: React.FC<DifferentialDiagnosisModalProps> = ({
  isOpen,
  onClose,
  result,
  activeDiseaseName,
  prashnaAnswers = {},
  onUpdatePrashnaAnswer,
  onSubmitPrashnaAnswers,
  isRefreshingPrashna = false,
  isDark = false,
}) => {
  if (!isOpen) return null;

  const confirmation = result?.differentialDiagnosis?.confirmationProtocol;
  const competing = result?.differentialDiagnosis?.competingConditions || [];
  const questions = result?.differentialDiagnosis?.suggestedClinicalQuestions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-3xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold flex items-center gap-1.5 text-slate-900 dark:text-white">
                Ayurvedic &amp; Modern Differential Diagnosis (Vyavacchedaka Nidana)
              </h3>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                Disease Confirmation Protocol, Symptom Correlation &amp; Elimination of Competing Conditions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs no-scrollbar">
          {/* Active Disease Focus Banner */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[9.5px] font-extrabold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest block">
                Target Disease Being Confirmed &amp; Differentiated:
              </span>
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">
                {confirmation?.targetDisease || activeDiseaseName || result?.ayurvedicAnalysis.vyadhiVinischaya || 'Clinical Case'}
              </h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
              Vyavacchedaka Nidana Protocol
            </span>
          </div>

          {/* SECTION 0: DEFINITIVE DISEASE CONFIRMATION & WHY NOT OTHER DISEASES */}
          {confirmation && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/25 border-2 border-emerald-300 dark:border-emerald-800/70 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
                    1. How We Confirm {confirmation.targetDisease} (Ayurveda &amp; Modern Standard)
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[9.5px] font-bold">
                  Confirmatory Criteria
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                {/* Ayurvedic Confirmation */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-400 block">
                    ✓ Classical Ayurvedic Confirmation
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold">
                    <strong>Pratyatma Lakshana:</strong> {confirmation.ayurvedicConfirmation.pratyatmaLakshana}
                  </p>
                  {confirmation.ayurvedicConfirmation.confirmatorySigns?.length > 0 && (
                    <ul className="list-disc pl-4 space-y-0.5 text-[10.5px] text-slate-600 dark:text-slate-300">
                      {confirmation.ayurvedicConfirmation.confirmatorySigns.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  )}
                  <p className="text-[10.5px] text-emerald-800 dark:text-emerald-300 pt-1 border-t border-emerald-100 dark:border-emerald-900">
                    <strong>Therapeutic Confirmation (Upashaya):</strong>{' '}
                    {confirmation.ayurvedicConfirmation.therapeuticTrialConfirmation}
                  </p>
                </div>

                {/* Modern Confirmation */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/60 space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase text-blue-700 dark:text-blue-400 block">
                    ✓ Modern Medicine Gold-Standard Confirmation
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold">
                    <strong>Diagnostic Standard:</strong> {confirmation.modernConfirmation.goldStandardCriteria}
                  </p>
                  {confirmation.modernConfirmation.confirmatoryBiomarkers?.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block">Confirmatory Lab / Imaging Findings:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[10.5px] text-slate-600 dark:text-slate-300 mt-0.5">
                        {confirmation.modernConfirmation.confirmatoryBiomarkers.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Elimination of Other Diseases */}
              {confirmation.eliminationOfOtherConditions?.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-emerald-200 dark:border-emerald-800/60">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 dark:text-rose-300 block">
                    ✕ Why It Is NOT Other Competing Diseases (Symptom Correlation &amp; Exclusion):
                  </span>
                  <div className="space-y-1.5">
                    {confirmation.eliminationOfOtherConditions.map((elim, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-rose-200 dark:border-rose-800/60 space-y-1 text-[10.5px]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-rose-800 dark:text-rose-300 text-xs">
                            Rival Condition Excluded: {elim.competingDisease}
                          </strong>
                          <span className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[9px] font-bold">
                            Ruled Out
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                          <strong>Overlapping / Correlated Symptoms:</strong> {elim.correlatedSymptoms}
                        </p>
                        <p className="text-rose-700 dark:text-rose-300 font-semibold">
                          <strong>Why Ruled Out (Why Not This Disease):</strong> {elim.whyRuledOut}
                        </p>
                        <p className="text-indigo-700 dark:text-indigo-300">
                          <strong>Definitive Differentiating Sign / Test:</strong> {elim.distinguishingSignOrTest}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 1: HOW WE DIFFERENTIALLY DIAGNOSE IN AYURVEDA */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                The 5 Classical Pillars of Differential Diagnosis (Nidana Panchaka)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>Hetu (Etiological Origin)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[10.5px]">
                  Identifying specific Ahara (diet), Vihara (habits), and Kala (seasonal triggers) that provoked the dominant Dosha. Differentiates exogenous vs endogenous disorders.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Purvarupa (Premonitory Warnings)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[10.5px]">
                  Subtle signs appearing during Sthana-Samshraya before full clinical manifestation, pointing directly to the target vulnerable organ/srotas.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span>Rupa &amp; Pratyatma Lakshana</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[10.5px]">
                  <strong>The Hallmark Differentiating Signs:</strong> E.g., Amavata has prolonged morning stiffness &gt;1h; Sandhivata has mechanical crepitus on exertion without systemic Ama.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-[10px]">
                    4
                  </span>
                  <span>Upashaya-Anupashaya (Therapeutic Trial)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[10.5px]">
                  Diagnostic response to therapies: E.g., in Amavata, dry sand fomentation (Valuka Sweda) brings instant relief while oily Abhyanga aggravates; in Sandhivata, warm oil Snehana relieves pain.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 sm:col-span-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-[10px]">
                    5
                  </span>
                  <span>Samprapti (Pathogenesis &amp; Srotas Dynamics)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[10.5px]">
                  Evaluating the step-by-step disease development (Sanchaya, Prakopa, Prasara, Sthana-Samshraya, Vyakti, Bheda) and the target channel involvement (Srotodushti: Sanga, Atipravritti, Siragranthi, Vimargagamana) to confirm the exact root pathology.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: COMPETING CONDITIONS FOR CURRENT CASE */}
          {competing.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 pb-1">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Rival Differential Conditions for this Case
                </h4>
              </div>

              <div className="space-y-2">
                {competing.map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-extrabold text-xs text-indigo-950 dark:text-indigo-200">
                        {comp.condition}
                      </h5>
                      <span className="text-[9px] uppercase px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                        {comp.category}
                      </span>
                    </div>

                    {comp.correlatedSymptoms && (
                      <p className="text-[11px] text-amber-800 dark:text-amber-300">
                        <strong>Correlated / Overlapping Symptoms:</strong> {comp.correlatedSymptoms}
                      </p>
                    )}

                    {comp.whyNotThisCondition && (
                      <p className="text-[11px] text-rose-700 dark:text-rose-300 font-medium">
                        <strong>Why Not This Condition:</strong> {comp.whyNotThisCondition}
                      </p>
                    )}

                    <p className="text-[11px] text-slate-700 dark:text-slate-300">
                      <strong>Pratyatma Lakshana (Differentiating Sign):</strong> {comp.pratyatmaLakshana}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[10.5px]">
                      <div className="p-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300">
                        <strong>Rule In Criteria:</strong> {comp.ruleInPoints}
                      </div>
                      <div className="p-2 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50 text-rose-800 dark:text-rose-300">
                        <strong>Rule Out Criteria:</strong> {comp.ruleOutPoints}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: KEY QUESTIONS TO ASK FOR ACCURATE SELECTION */}
          {questions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 pb-1">
                <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Suggested Questions to Ask the Patient (Prashna Pariksha for DDx)
                </h4>
              </div>

              <div className="p-3 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/50 space-y-2.5">
                <p className="text-[10.5px] text-teal-900 dark:text-teal-200 italic">
                  Record the patient’s answers below and click Submit to refresh Diagnosis &amp; Treatments:
                </p>
                {questions.map((q, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-teal-200/70 dark:border-teal-800/60 space-y-1.5">
                    <div className="flex items-start gap-2 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                      <span className="text-teal-600 font-bold shrink-0">{idx + 1}.</span>
                      <span>{q}</span>
                    </div>
                    {onUpdatePrashnaAnswer && (
                      <div className="space-y-1 pl-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          {['Yes', 'No', 'Mild / Occasional', 'Severe'].map((chip) => (
                            <button
                              key={chip}
                              type="button"
                              onClick={() =>
                                onUpdatePrashnaAnswer(
                                  idx,
                                  prashnaAnswers[idx]
                                    ? `${prashnaAnswers[idx]}; ${chip}`
                                    : chip
                                )
                              }
                              className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 hover:bg-teal-200 text-teal-800 dark:text-teal-300 text-[9.5px] font-bold cursor-pointer"
                            >
                              + {chip}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={prashnaAnswers[idx] || ''}
                          onChange={(e) => onUpdatePrashnaAnswer(idx, e.target.value)}
                          placeholder="Type patient's answer here..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                ))}

                {onSubmitPrashnaAnswers && (
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      disabled={isRefreshingPrashna}
                      onClick={() => {
                        onSubmitPrashnaAnswers();
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {isRefreshingPrashna
                        ? 'Refreshing Diagnosis & Treatments...'
                        : 'Submit Answers & Refresh Diagnosis & Treatments'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-slate-800/50">
          <span className="text-[10px] text-slate-400">
            Reference: Madhava Nidana, Charaka Nidanasthana &amp; Harrison’s 21st Ed
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-2xs transition-all"
          >
            Got it, Return to Case
          </button>
        </div>
      </div>
    </div>
  );
};
