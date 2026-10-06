import React, { useState } from 'react';
import type { ExpenseRecord } from '../types';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  PiggyBank,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';
import type { User } from 'firebase/auth';

interface ExpenseViewProps {
  expenses: ExpenseRecord[];
  user: User | null;
  onAddExpense: (record: ExpenseRecord) => void;
  onDeleteExpense: (id: string) => void;
  onRequireAuth: () => void;
}

export const ExpenseView: React.FC<ExpenseViewProps> = ({
  expenses,
  user,
  onAddExpense,
  onDeleteExpense,
  onRequireAuth,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Deletion state
  const [recordToDelete, setRecordToDelete] = useState<ExpenseRecord | null>(null);

  // Form State
  const [newType, setNewType] = useState<'income' | 'expense'>('income');
  const [newAmount, setNewAmount] = useState<string>('');
  const [newCategory, setNewCategory] = useState<ExpenseRecord['category']>('clinic_consultation');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPaymentMode, setNewPaymentMode] = useState<ExpenseRecord['paymentMode']>('upi');

  // Calculations
  const totalIncome = expenses
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = expenses
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const netSurplus = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netSurplus / totalIncome) * 100) : 0;

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newAmount);
    if (!amountNum || amountNum <= 0) return;

    const newRecord: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      date: newDate,
      type: newType,
      amount: amountNum,
      category: newCategory,
      description: newDescription.trim() || `${newCategory.replace('_', ' ')} entry`,
      paymentMode: newPaymentMode,
    };

    onAddExpense(newRecord);
    setIsAddModalOpen(false);
    setNewAmount('');
    setNewDescription('');
  };

  const filteredExpenses = expenses.filter((e) => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>Expense &amp; Financial Ledger</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track clinical consultation receipts, Panchakarma packages, pharmacy stock, clinic rent, and monthly investments.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Entry</span>
          </button>
        </div>
      </div>

      {/* Financial Pulse Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Total Inflow</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">₹{totalIncome.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-[11px] text-slate-400">OPD fees, Panchakarma, medicine &amp; royalties</p>
        </div>

        {/* Total Outflow */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Total Outflow</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">₹{totalExpense.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-[11px] text-slate-400">Rent, staff salaries, herb stock &amp; investments</p>
        </div>

        {/* Net Surplus */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">Net Surplus</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-bold ${netSurplus >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ₹{netSurplus.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Clean cash retained after all operations</p>
        </div>

        {/* Savings Rate */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Retained Margin</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{savingsRate}%</p>
          <p className="mt-1 text-[11px] text-slate-400">Target: &gt;40% for rapid wealth compounding</p>
        </div>
      </div>

      {/* Filter Tabs & Count */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
              filterType === 'all'
                ? 'bg-slate-800 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Transactions ({expenses.length})
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
              filterType === 'income'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Incomes ({expenses.filter((e) => e.type === 'income').length})
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
              filterType === 'expense'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Expenses ({expenses.filter((e) => e.type === 'expense').length})
          </button>
        </div>

        <span className="text-xs text-slate-500">Sorted by most recent</span>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 uppercase text-[10px] font-semibold tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Type &amp; Category</th>
                <th className="px-5 py-3.5">Description</th>
                <th className="px-5 py-3.5">Payment Mode</th>
                <th className="px-5 py-3.5 text-right">Amount</th>
                <th className="px-5 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredExpenses.map((record) => {
                const isIncome = record.type === 'income';
                return (
                  <tr key={record.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="px-5 py-3.5 font-mono text-slate-400 whitespace-nowrap">
                      {record.date}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isIncome ? 'bg-emerald-400' : 'bg-rose-400'
                          }`}
                        ></span>
                        <span className="font-semibold text-white capitalize">
                          {record.category.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">{record.description}</td>
                    <td className="px-5 py-3.5 uppercase font-mono text-[10px] text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                        {record.paymentMode}
                      </span>
                    </td>
                    <td
                      className={`px-5 py-3.5 text-right font-bold text-sm whitespace-nowrap ${
                        isIncome ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '-'}₹{record.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => setRecordToDelete(record)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-100">
            <h3 className="text-lg font-bold text-white mb-4">Log Financial Transaction</h3>
            <form onSubmit={handleCreateRecord} className="space-y-4 text-xs">
              <div className="flex rounded-xl bg-slate-800 p-1 border border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setNewType('income');
                    setNewCategory('clinic_consultation');
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    newType === 'income'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  + Income (Receipt)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewType('expense');
                    setNewCategory('medicine_stock');
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    newType === 'expense'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  - Expense (Payment)
                </button>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5000"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-base font-bold placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    {newType === 'income' ? (
                      <>
                        <option value="clinic_consultation">OPD Consultation Fees</option>
                        <option value="panchakarma_fees">Panchakarma Package</option>
                        <option value="medicine_dispense">Herbal Medicine Dispensed</option>
                        <option value="passive_income">Passive / Royalty Income</option>
                        <option value="other_income">Other Inflow</option>
                      </>
                    ) : (
                      <>
                        <option value="clinic_rent">Clinic Lease / Rent</option>
                        <option value="medicine_stock">Medicine Inventory Restock</option>
                        <option value="staff_salary">Therapist &amp; Staff Compensation</option>
                        <option value="clinic_equipment">Clinic &amp; Panchakarma Equipment</option>
                        <option value="study_materials">Books / Medical Journals</option>
                        <option value="investment_sip">Index Fund / Gold SIP</option>
                        <option value="personal_living">Personal / Living Expense</option>
                        <option value="other_expense">Other Outflow</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Payment Mode</label>
                  <select
                    value={newPaymentMode}
                    onChange={(e) => setNewPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="upi">UPI (GPay / PhonePe)</option>
                    <option value="cash">Cash in Hand</option>
                    <option value="bank_transfer">NEFT / Bank Transfer</option>
                    <option value="card">Card / POS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description / Patient / Note</label>
                <input
                  type="text"
                  placeholder="e.g. 10 patient OPD fees / Taila purchase batch #8"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-white font-medium cursor-pointer shadow-md ${
                    newType === 'income'
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40'
                      : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/40'
                  }`}
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!recordToDelete}
        title="Delete Transaction Entry?"
        message={`Are you sure you want to delete the ${recordToDelete?.type} of ₹${recordToDelete?.amount.toLocaleString(
          'en-IN'
        )} (${recordToDelete?.description})? This cannot be undone.`}
        confirmLabel="Yes, Delete"
        cancelLabel="Keep"
        isDestructive={true}
        onConfirm={() => {
          if (recordToDelete) {
            onDeleteExpense(recordToDelete.id);
            setRecordToDelete(null);
          }
        }}
        onCancel={() => setRecordToDelete(null)}
      />
    </div>
  );
};
