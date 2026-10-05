import React, { useState, useEffect, useMemo } from 'react';
import { getStoredData, setStoredData } from '../services/storage';
import {
  Wrench,
  Calculator,
  TrendingUp,
  Activity,
  Heart,
  Scale,
  Sparkles,
  Percent,
} from 'lucide-react';

interface ToolsViewProps {
  isDark: boolean;
}

export const ToolsView: React.FC<ToolsViewProps> = ({ isDark }) => {
  const savedTools = useMemo(
    () =>
      getStoredData<Record<string, any>>('ayurlife_tools_state', {
        activeTab: 'emi',
        p: 500000,
        r: 8.5,
        n: 36,
        sipMonthly: 5000,
        sipReturn: 13.5,
        sipYears: 5,
        patientAge: 10,
        adultDose: 1000,
        weightKg: 65,
        heightCm: 170,
      }),
    []
  );

  const [activeTab, setActiveTab] = useState<'emi' | 'sip' | 'dosage' | 'bmi'>(
    savedTools.activeTab || 'emi'
  );

  // EMI State
  const [p, setP] = useState<number>(savedTools.p ?? 500000);
  const [r, setR] = useState<number>(savedTools.r ?? 8.5);
  const [n, setN] = useState<number>(savedTools.n ?? 36);

  // SIP State
  const [sipMonthly, setSipMonthly] = useState<number>(savedTools.sipMonthly ?? 5000);
  const [sipReturn, setSipReturn] = useState<number>(savedTools.sipReturn ?? 13.5);
  const [sipYears, setSipYears] = useState<number>(savedTools.sipYears ?? 5);

  // Dosage State (Sharngadhara Rule)
  const [patientAge, setPatientAge] = useState<number>(savedTools.patientAge ?? 10);
  const [adultDose, setAdultDose] = useState<number>(savedTools.adultDose ?? 1000); // mg or ml

  // BMI State
  const [weightKg, setWeightKg] = useState<number>(savedTools.weightKg ?? 65);
  const [heightCm, setHeightCm] = useState<number>(savedTools.heightCm ?? 170);

  useEffect(() => {
    setStoredData('ayurlife_tools_state', {
      activeTab,
      p,
      r,
      n,
      sipMonthly,
      sipReturn,
      sipYears,
      patientAge,
      adultDose,
      weightKg,
      heightCm,
    });
  }, [activeTab, p, r, n, sipMonthly, sipReturn, sipYears, patientAge, adultDose, weightKg, heightCm]);

  // Calculate EMI
  const monthlyRate = r / 12 / 100;
  const emi = (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const totalPay = emi * n;
  const totalInterest = totalPay - p;

  // Calculate SIP
  const months = sipYears * 12;
  const mRate = sipReturn / 12 / 100;
  const totalInvested = sipMonthly * months;
  const futureVal =
    sipMonthly * ((Math.pow(1 + mRate, months) - 1) / mRate) * (1 + mRate);
  const wealthGain = futureVal - totalInvested;

  // Ayurvedic Child Dosage (Sharngadhara Samhita / Young's rule)
  // For age < 16: Dose = (Adult Dose * Age) / (Age + 12)
  const childDose = patientAge < 16 ? Math.round((adultDose * patientAge) / (patientAge + 12)) : adultDose;

  // BMI Calculation
  const heightM = heightCm / 100;
  const bmiVal = heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : '0';
  const bmiNum = parseFloat(bmiVal);
  const bmiStatus =
    bmiNum < 18.5 ? 'Underweight (Vata)' : bmiNum < 24.9 ? 'Normal (Sama)' : 'Overweight (Kapha)';

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Header */}
      <div className="pb-1 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
          Tools
        </h2>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          Financial calculators &amp; classical Ayurvedic clinical utilities
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1 p-0.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-[10.5px] font-semibold text-center">
        <button
          onClick={() => setActiveTab('emi')}
          className={`py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'emi'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          EMI
        </button>
        <button
          onClick={() => setActiveTab('sip')}
          className={`py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'sip'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          SIP
        </button>
        <button
          onClick={() => setActiveTab('dosage')}
          className={`py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'dosage'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Ayur Dosage
        </button>
        <button
          onClick={() => setActiveTab('bmi')}
          className={`py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'bmi'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          BMI &amp; Dosha
        </button>
      </div>

      {/* TOOL 1: EMI CALCULATOR */}
      {activeTab === 'emi' && (
        <div
          className={`p-5 rounded-3xl border space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-purple-600 dark:text-purple-400">
            <Calculator className="w-4 h-4" />
            <span>Loan EMI &amp; Interest Calculator</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Loan Principal Amount:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  ₹{p.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="2000000"
                step="10000"
                value={p}
                onChange={(e) => setP(parseInt(e.target.value, 10))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Annual Interest Rate:</span>
                <span className="font-mono text-purple-600 dark:text-purple-400">{r}% p.a.</span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                step="0.1"
                value={r}
                onChange={(e) => setR(parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Tenure Duration:</span>
                <span className="font-mono text-slate-900 dark:text-white">{n} Months</span>
              </div>
              <input
                type="range"
                min="6"
                max="120"
                step="6"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value, 10))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/20 text-center space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
              Estimated Monthly EMI
            </span>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
              ₹{Math.round(emi).toLocaleString('en-IN')}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-200 dark:border-purple-800 text-[11px]">
              <div>
                <span className="text-slate-400 block">Total Interest</span>
                <span className="font-bold text-rose-500 font-mono">
                  ₹{Math.round(totalInterest).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Payoff</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                  ₹{Math.round(totalPay).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 2: SIP CALCULATOR */}
      {activeTab === 'sip' && (
        <div
          className={`p-5 rounded-3xl border space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-4 h-4" />
            <span>SIP &amp; Wealth Compounding</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Monthly Investment:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  ₹{sipMonthly.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={sipMonthly}
                onChange={(e) => setSipMonthly(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Expected Annual Return:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{sipReturn}% p.a.</span>
              </div>
              <input
                type="range"
                min="6"
                max="25"
                step="0.5"
                value={sipReturn}
                onChange={(e) => setSipReturn(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Investment Horizon:</span>
                <span className="font-mono text-slate-900 dark:text-white">{sipYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={sipYears}
                onChange={(e) => setSipYears(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/20 text-center space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">
              Future Expected Wealth
            </span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              ₹{Math.round(futureVal).toLocaleString('en-IN')}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200 dark:border-emerald-800 text-[11px]">
              <div>
                <span className="text-slate-600 dark:text-slate-400 font-medium block">Amount Invested</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                  ₹{Math.round(totalInvested).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400 font-medium block">Estimated Gain</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  +₹{Math.round(wealthGain).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: AYURVEDIC DOSAGE CALCULATOR */}
      {activeTab === 'dosage' && (
        <div
          className={`p-5 rounded-3xl border space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-teal-600 dark:text-teal-400">
            <Scale className="w-4 h-4" />
            <span>Sharngadhara Pediatric Dosage Calculator</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Patient Age:</span>
                <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">{patientAge} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={patientAge}
                onChange={(e) => setPatientAge(parseInt(e.target.value, 10))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">
                Standard Adult Dose (mg or ml):
              </label>
              <input
                type="number"
                value={adultDose}
                onChange={(e) => setAdultDose(parseInt(e.target.value, 10) || 0)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-500/20 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">
              Recommended Clinical Child Dose
            </span>
            <p className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono">
              {childDose} mg / ml
            </p>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 italic mt-1 font-medium">
              Derived from classical Young's pediatric formula: (Age / [Age + 12]) × Adult Dose
            </p>
          </div>
        </div>
      )}

      {/* TOOL 4: BMI & DOSHA */}
      {activeTab === 'bmi' && (
        <div
          className={`p-5 rounded-3xl border space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-rose-600 dark:text-rose-400">
            <Heart className="w-4 h-4" />
            <span>BMI &amp; Ayurvedic Dosha Tendency</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">Weight (Kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-700 dark:text-slate-300 font-bold block mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/20 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
              Calculated BMI
            </span>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
              {bmiVal} kg/m²
            </p>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-rose-300 text-rose-700 dark:text-rose-300 mt-1">
              {bmiStatus}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
