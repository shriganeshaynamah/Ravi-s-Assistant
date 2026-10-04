import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Flame, Droplets, Wind, HelpCircle } from 'lucide-react';

export interface PrakritiAssessmentResult {
  prakriti: string;
  dominantDoshas: string[];
  agni: string;
  kostha: string;
  scores: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  summary: string;
}

interface PrakritiAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (result: PrakritiAssessmentResult) => void;
  isDark?: boolean;
}

export const PrakritiAssessmentModal: React.FC<PrakritiAssessmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isDark = false,
}) => {
  // Question states (defaulting to clean initial selections)
  const [qBodyFrame, setQBodyFrame] = useState<'vata' | 'pitta' | 'kapha'>('vata');
  const [qSkinHair, setQSkinHair] = useState<'vata' | 'pitta' | 'kapha'>('pitta');
  const [qWeather, setQWeather] = useState<'vata' | 'pitta' | 'kapha'>('vata');
  const [qSleepMind, setQSleepMind] = useState<'vata' | 'pitta' | 'kapha'>('pitta');
  const [qJointsMove, setQJointsMove] = useState<'vata' | 'pitta' | 'kapha'>('vata');
  
  // Agni and Kostha states
  const [selectedAgni, setSelectedAgni] = useState<'Vishamagni' | 'Tikshnagni' | 'Mandagni' | 'Samagni'>('Vishamagni');
  const [selectedKostha, setSelectedKostha] = useState<'Krura Kostha' | 'Mridu Kostha' | 'Madhyama Kostha'>('Krura Kostha');

  if (!isOpen) return null;

  const calculatePrakriti = (): PrakritiAssessmentResult => {
    const scores = { vata: 0, pitta: 0, kapha: 0 };
    [qBodyFrame, qSkinHair, qWeather, qSleepMind, qJointsMove].forEach((val) => {
      scores[val]++;
    });

    const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const first = entries[0];
    const second = entries[1];

    let computedPrakriti = '';
    const dominant: string[] = [];

    if (first[1] >= 4) {
      // Single dosha dominant
      computedPrakriti = first[0] === 'vata' ? 'Vata Pradhana' : first[0] === 'pitta' ? 'Pitta Pradhana' : 'Kapha Pradhana';
      dominant.push(first[0]);
    } else if (first[1] === second[1] || first[1] - second[1] === 1) {
      // Dual dosha
      const d1 = first[0].charAt(0).toUpperCase() + first[0].slice(1);
      const d2 = second[0].charAt(0).toUpperCase() + second[0].slice(1);
      computedPrakriti = `${d1}-${d2}`;
      dominant.push(first[0], second[0]);
    } else {
      const d1 = first[0].charAt(0).toUpperCase() + first[0].slice(1);
      const d2 = second[0].charAt(0).toUpperCase() + second[0].slice(1);
      computedPrakriti = `${d1}-${d2}`;
      dominant.push(first[0], second[0]);
    }

    if (scores.vata === scores.pitta && scores.pitta === scores.kapha) {
      computedPrakriti = 'Sama-Prakriti (Tridoshic)';
      dominant.push('vata', 'pitta', 'kapha');
    }

    const agniMap: Record<string, string> = {
      Vishamagni: 'Vishamagni (Irregular / Vata)',
      Tikshnagni: 'Tikshnagni (Sharp / Pitta)',
      Mandagni: 'Mandagni (Sluggish / Kapha)',
      Samagni: 'Samagni (Balanced / Homeostatic)',
    };

    const kosthaMap: Record<string, string> = {
      'Krura Kostha': 'Krura Kostha (Hard / Dry Tendency)',
      'Mridu Kostha': 'Mridu Kostha (Soft / Rapid Transit)',
      'Madhyama Kostha': 'Madhyama Kostha (Balanced Bowel)',
    };

    const summary = `Analyzed Prakriti: ${computedPrakriti} | Agni: ${agniMap[selectedAgni]} | Kostha: ${kosthaMap[selectedKostha]}`;

    return {
      prakriti: computedPrakriti,
      dominantDoshas: dominant,
      agni: selectedAgni,
      kostha: selectedKostha,
      scores,
      summary,
    };
  };

  const handleSaveAndApply = () => {
    const result = calculatePrakriti();
    onSave(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold flex items-center gap-1.5">
                Ayurvedic Prakriti, Agni &amp; Kostha Pariksha
              </h3>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                Sharirika Dosha, Jatharagni &amp; Bowel Motility Clinical Questionnaire
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

        {/* Modal Body - Scrollable Questions */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs no-scrollbar">
          {/* Quick Explanatory Banner */}
          <div className="p-3 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50 text-teal-900 dark:text-teal-200 text-[11px] leading-relaxed">
            <strong>Clinical Guidance:</strong> Answer the following phenotypic questions with the dropdown options. The system calculates your dominant Doshas, evaluates your Agni (digestive fire), and sets your Kostha (bowel tendency), automatically updating Dr. Ravi Shankar's clinical case sheet.
          </div>

          {/* SECTION 1: SHARIRIKA PRAKRITI QUESTIONS */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
              <Wind className="w-3.5 h-3.5 text-teal-600" />
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                1. Sharirika Dosha Traits (Body &amp; Temperament)
              </h4>
            </div>

            {/* Q1: Body Frame */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                1. Sharira Rachana (Body Frame &amp; Physical Stature):
              </label>
              <select
                value={qBodyFrame}
                onChange={(e) => setQBodyFrame(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="vata">Vata: Slender, lean frame, prominent veins/bones, difficult to gain weight</option>
                <option value="pitta">Pitta: Medium build, well-proportioned musculature, moderate stable weight</option>
                <option value="kapha">Kapha: Broad, heavy, sturdy frame, gains weight easily, broad shoulders</option>
              </select>
            </div>

            {/* Q2: Skin & Hair */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                2. Twak &amp; Kesha (Skin Texture &amp; Hair Quality):
              </label>
              <select
                value={qSkinHair}
                onChange={(e) => setQSkinHair(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="vata">Vata: Dry, rough, cracked, cool skin; dry, brittle, thin hair</option>
                <option value="pitta">Pitta: Warm, pinkish, sensitive, prone to moles/redness; early graying or thinning</option>
                <option value="kapha">Kapha: Thick, oily, cool, smooth skin; dense, lustrous, dark wavy hair</option>
              </select>
            </div>

            {/* Q3: Weather Sensitivity */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                3. Ritu Satmya (Weather &amp; Thermal Tolerance):
              </label>
              <select
                value={qWeather}
                onChange={(e) => setQWeather(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="vata">Vata: Dislikes cold dry winds; loves hot sunshine, warm beverages &amp; saunas</option>
                <option value="pitta">Pitta: Highly intolerant to summer heat &amp; sun; craves cold drinks &amp; cool air</option>
                <option value="kapha">Kapha: Dislikes cold damp rainy weather; tolerates sunny weather well</option>
              </select>
            </div>

            {/* Q4: Sleep & Mind */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                4. Nidra &amp; Manas (Sleep Pattern &amp; Mental Agility):
              </label>
              <select
                value={qSleepMind}
                onChange={(e) => setQSleepMind(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="vata">Vata: Light, disturbed, restless sleep; fast-thinking, anxious, creative mind</option>
                <option value="pitta">Pitta: Moderate sound sleep (6-7h); sharp, articulate, ambitious, irritable under stress</option>
                <option value="kapha">Kapha: Deep, heavy, prolonged sleep (&gt;8h); calm, peaceful, patient, slow to anger</option>
              </select>
            </div>

            {/* Q5: Joints & Movement */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                5. Sandhi &amp; Cheshta (Joint Mobility &amp; Movement Pace):
              </label>
              <select
                value={qJointsMove}
                onChange={(e) => setQJointsMove(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="vata">Vata: Crepitus/clicking joints, prominent tendons; hasty, swift walking speed</option>
                <option value="pitta">Pitta: Flexible, warm, moderate joints; purposeful, steady, brisk pace</option>
                <option value="kapha">Kapha: Well-cushioned, strong, stable joints; graceful, deliberate, calm movement</option>
              </select>
            </div>
          </div>

          {/* SECTION 2: AGNI PARIKSHA */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 pb-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                2. Agni Pariksha (Digestive Fire Assessment)
              </h4>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                Appetite Rhythm &amp; Digestive Strength (Jatharagni):
              </label>
              <select
                value={selectedAgni}
                onChange={(e) => setSelectedAgni(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="Vishamagni">Vishamagni (Erratic/Variable - Vata): Sometimes hungry, sometimes no appetite, prone to gas &amp; distension</option>
                <option value="Tikshnagni">Tikshnagni (Sharp/Hyperactive - Pitta): Ravenous hunger, cannot tolerate delayed meals, prone to acidity &amp; burning</option>
                <option value="Mandagni">Mandagni (Sluggish/Slow - Kapha): Low appetite, prolonged fullness after small meal, easy weight gain</option>
                <option value="Samagni">Samagni (Balanced - Tridosha Homeostasis): Regular, proper appetite, timely digestion without discomfort</option>
              </select>
            </div>
          </div>

          {/* SECTION 3: KOSTHA PARIKSHA */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 pb-1">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                3. Kostha Pariksha (Bowel Motility &amp; Transit Tendency)
              </h4>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                Defecation Nature &amp; Sensitivity to Purgatives (Kostha):
              </label>
              <select
                value={selectedKostha}
                onChange={(e) => setSelectedKostha(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="Krura Kostha">Krura Kostha (Hard / Vata): Tendency to dry hard stools, constipation; requires strong purgative like Castor oil</option>
                <option value="Mridu Kostha">Mridu Kostha (Soft / Pitta): Loose soft frequent stools (1-3/day); even warm milk or grapes quickly induces evacuation</option>
                <option value="Madhyama Kostha">Madhyama Kostha (Medium / Kapha-Sama): Regular once-daily formed smooth evacuation without strain or laxatives</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-800/40">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAndApply}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-600/20 cursor-pointer transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Save &amp; Auto-Set Prakriti, Agni &amp; Kostha</span>
          </button>
        </div>
      </div>
    </div>
  );
};
