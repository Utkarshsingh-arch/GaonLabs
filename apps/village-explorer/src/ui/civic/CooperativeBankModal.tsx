import React, { useState } from 'react';
import { Lang } from '../../learning/types';
import { SupportedGrade } from '../../learning/curriculum/ncertRegistry';
import {
  formatCompactNcertCitation,
  resolveCurriculumForEntity,
} from '../../learning/curriculum/curriculumMapper';
import {
  calculateCompoundInterest,
  calculateSimpleInterest,
  evaluateHouseholdBudget,
} from '../../learning/civicEngines';
import { NcertModalTarget } from '../curriculum/NcertConceptModal';

interface CooperativeBankModalProps {
  lang: Lang;
  studentGrade: SupportedGrade;
  onClose: () => void;
  onAwardXp: (amount: number, reason: string) => void;
  onExploreNcert?: (target: NcertModalTarget) => void;
}

export const CooperativeBankModal: React.FC<CooperativeBankModalProps> = ({
  lang,
  studentGrade,
  onClose,
  onAwardXp,
  onExploreNcert,
}) => {
  const [tab, setTab] = useState<'savings' | 'interest' | 'budget' | 'missions'>('savings');

  // Fictional Educational Wallet & Virtual Bank Account (100% simulated!)
  const [walletCash, setWalletCash] = useState<number>(2500);
  const [bankBalance, setBankBalance] = useState<number>(1500);
  const [savingsGoal, setSavingsGoal] = useState<number>(3500);
  const [txnAmount, setTxnAmount] = useState<number>(500);

  // Simple & Compound Interest Calculator
  const [principal, setPrincipal] = useState<number>(5000);
  const [rate, setRate] = useState<number>(8);
  const [years, setYears] = useState<number>(2);

  // Family Monthly Budget Planner (₹12,000)
  const [budget, setBudget] = useState({
    food: 4000,
    education: 2000,
    transport: 1200,
    healthcare: 1000,
    savings: 2500,
    other: 1000,
  });

  // Banking Missions XP tracker
  const [missionSolved, setMissionSolved] = useState<Record<string, boolean>>({});
  const [interestQuiz, setInterestQuiz] = useState<string>('');

  const si = calculateSimpleInterest(principal, rate, years);
  const ci = calculateCompoundInterest(principal, rate, years);
  const budgetEval = evaluateHouseholdBudget(12000, budget);
  const goalPct = Math.min(100, Math.round((bankBalance / Math.max(1, savingsGoal)) * 100));
  const ncertEntry = resolveCurriculumForEntity('cooperative_bank', studentGrade);

  const handleDeposit = () => {
    if (txnAmount > 0 && walletCash >= txnAmount) {
      setWalletCash((w) => w - txnAmount);
      setBankBalance((b) => b + txnAmount);
    }
  };

  const handleWithdraw = () => {
    if (txnAmount > 0 && bankBalance >= txnAmount) {
      setBankBalance((b) => b - txnAmount);
      setWalletCash((w) => w + txnAmount);
    }
  };

  const completeMission = (key: string, xp: number) => {
    if (!missionSolved[key]) {
      setMissionSolved((prev) => ({ ...prev, [key]: true }));
      onAwardXp(xp, `Cooperative Bank Mission (${key})`);
    }
  };

  const title =
    lang === 'hi'
      ? 'गाँव सहकारी बैंक — वित्तीय साक्षरता एवं बचत लैब'
      : lang === 'kn'
      ? 'ಗ್ರಾಮ ಸಹಕಾರಿ ಬ್ಯಾಂಕ್ — ಹಣಕಾಸು ಸಾಕ್ಷರತೆ ಮತ್ತು ಉಳಿತಾಯ ಲ್ಯಾಬ್'
      : 'Village Cooperative Bank — Financial Literacy Lab';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-sky-500/45 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-gradient-to-r from-sky-950/80 to-slate-900">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-sky-500/20 border border-sky-400/40">
              🏦
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-sky-300">{title}</h2>
              {ncertEntry && (
                <div className="flex items-center gap-2 text-[11px] text-emerald-300">
                  <span>📖 NCERT: {formatCompactNcertCitation(ncertEntry)}</span>
                  {onExploreNcert && (
                    <button
                      type="button"
                      onClick={() =>
                        onExploreNcert({
                          entityKey: 'cooperative_bank',
                          objectName: 'Village Cooperative Bank',
                          objectIcon: '🏦',
                        })
                      }
                      className="underline text-amber-300 font-bold cursor-pointer"
                    >
                      Explore
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cooperative bank"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Simulated Disclaimer Strip */}
        <div className="px-5 py-1.5 bg-sky-950/50 border-b border-slate-800 text-[11px] text-sky-200 flex items-center justify-between">
          <span>🎓 100% Educational Virtual Simulation — No real bank accounts or payments are ever connected.</span>
          <span className="font-bold text-amber-300">Balance: ₹{bankBalance}</span>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5 px-4 pt-2 border-b border-slate-800 bg-slate-900/70">
          {[
            { id: 'savings' as const, icon: '💰', label: { en: 'Savings & Deposits', hi: 'बचत और जमा', kn: 'ಉಳಿತಾಯ ಮತ್ತು ಠೇವಣಿ' } },
            { id: 'interest' as const, icon: '📊', label: { en: 'Interest Lab (SI/CI)', hi: 'ब्याज गणना (SI/CI)', kn: 'ಬಡ್ಡಿ ಲೆಕ್ಕಾಚಾರ (SI/CI)' } },
            { id: 'budget' as const, icon: '📋', label: { en: '₹12,000 Family Budget', hi: '₹12,000 पारिवारिक बजट', kn: '₹12,000 ಕುಟುಂಬ ಬಜೆಟ್' } },
            { id: 'missions' as const, icon: '🤝', label: { en: 'Cooperatives & Missions', hi: 'सहकारिता व मिशन', kn: 'ಸಹಕಾರಿ ಮತ್ತು ಮಿಷನ್' } },
          ].map((tItem) => (
            <button
              key={tItem.id}
              type="button"
              onClick={() => setTab(tItem.id)}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 cursor-pointer ${
                tab === tItem.id
                  ? 'border-sky-400 text-sky-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tItem.icon}</span>
              <span>{tItem.label[lang]}</span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* TAB 1: SAVINGS & VIRTUAL WALLET */}
          {tab === 'savings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/75 border border-slate-700 rounded-2xl p-4 space-y-3">
                <h3 className="font-bold text-amber-300">💰 Educational Wallet & Counter</h3>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xl font-black text-amber-300">₹{walletCash}</span>
                    <span className="block text-[10px] text-slate-400">Cash in Wallet</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40">
                    <span className="text-xl font-black text-emerald-300">₹{bankBalance}</span>
                    <span className="block text-[10px] text-slate-400">Bank Account Balance</span>
                  </div>
                </div>
                <label className="block">
                  Transaction Amount: <strong>₹{txnAmount}</strong>
                  <input type="range" min={100} max={2000} step={100} value={txnAmount} onChange={(e) => setTxnAmount(Number(e.target.value))} className="w-full mt-1" />
                </label>
                <div className="flex gap-2">
                  <button type="button" onClick={handleDeposit} className="flex-1 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold cursor-pointer">
                    + Deposit ₹{txnAmount}
                  </button>
                  <button type="button" onClick={handleWithdraw} className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold cursor-pointer">
                    − Withdraw ₹{txnAmount}
                  </button>
                </div>
              </div>

              <div className="bg-slate-800/75 border border-sky-500/35 rounded-2xl p-4 space-y-3">
                <h3 className="font-bold text-sky-300">🎯 Savings Goal Tracker</h3>
                <label className="block">
                  Target Goal (e.g. Bicycle / School Books): <strong>₹{savingsGoal}</strong>
                  <input type="range" min={2000} max={6000} step={500} value={savingsGoal} onChange={(e) => setSavingsGoal(Number(e.target.value))} className="w-full mt-1 accent-sky-400" />
                </label>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Progress toward ₹{savingsGoal}</span>
                    <strong className="text-emerald-300">{goalPct}%</strong>
                  </div>
                  <div className="h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-700">
                    <div className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all" style={{ width: `${goalPct}%` }} />
                  </div>
                </div>
                <p className="text-[11px] text-slate-300">
                  Keeping savings in a cooperative bank keeps money safe from loss while earning steady interest!
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SIMPLE & COMPOUND INTEREST */}
          {tab === 'interest' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/75 border border-slate-700 rounded-2xl p-4 space-y-3">
                <h3 className="font-bold text-amber-300">SI = (P × R × T) ÷ 100</h3>
                <label className="block">
                  Principal (P): <strong>₹{principal}</strong>
                  <input type="range" min={1000} max={25000} step={500} value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full mt-1" />
                </label>
                <label className="block">
                  Annual Interest Rate (R): <strong className="text-emerald-300">{rate}%</strong>
                  <input type="range" min={3} max={15} step={1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full mt-1 accent-emerald-400" />
                </label>
                <label className="block">
                  Time Period (T): <strong className="text-sky-300">{years} years</strong>
                  <input type="range" min={1} max={10} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full mt-1 accent-sky-400" />
                </label>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-950/80 border border-emerald-500/40 rounded-2xl p-4 space-y-1.5">
                  <h4 className="font-bold text-emerald-300">Simple Interest Result</h4>
                  <p className="text-slate-300">Interest Earned: <strong className="text-amber-300 text-base">₹{si.interest}</strong></p>
                  <p className="text-slate-300">Total Maturity Amount: <strong className="text-white text-base">₹{si.totalAmount}</strong></p>
                </div>

                {studentGrade >= 8 && (
                  <div className="bg-slate-950/80 border border-sky-500/40 rounded-2xl p-4 space-y-1.5">
                    <h4 className="font-bold text-sky-300">Compound Interest (Class {studentGrade} Comparison)</h4>
                    <p className="text-slate-300">Interest Earned: <strong className="text-sky-300 text-base">₹{ci.interest}</strong></p>
                    <p className="text-slate-300">Total Amount: <strong className="text-white text-base">₹{ci.totalAmount}</strong></p>
                    <p className="text-[11px] text-slate-400">
                      Compound interest earns ₹{(ci.interest - si.interest).toFixed(2)} more because each year’s interest also earns interest!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ₹12,000 FAMILY MONTHLY BUDGET */}
          {tab === 'budget' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/75 border border-slate-700 rounded-2xl p-4 space-y-2.5">
                <h3 className="font-bold text-amber-300">📋 Allocate ₹12,000 Monthly Family Income</h3>
                {(
                  [
                    { key: 'food', label: '🍚 Food & Groceries' },
                    { key: 'education', label: '📚 Education & Books' },
                    { key: 'transport', label: '🚌 Transport' },
                    { key: 'healthcare', label: '🏥 Healthcare' },
                    { key: 'savings', label: '💰 Cooperative Savings' },
                    { key: 'other', label: '🏠 Utilities & Other' },
                  ] as const
                ).map((row) => (
                  <label key={row.key} className="block">
                    <div className="flex justify-between">
                      <span>{row.label}</span>
                      <strong>₹{budget[row.key]}</strong>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={6000}
                      step={200}
                      value={budget[row.key]}
                      onChange={(e) => setBudget((b) => ({ ...b, [row.key]: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </label>
                ))}
              </div>

              <div className="bg-slate-950/80 border border-slate-700 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-sky-300 text-sm">Budget Balance Summary</h4>
                <div className="flex justify-between"><span>Monthly Income</span><strong>₹12,000</strong></div>
                <div className="flex justify-between"><span>Total Allocated</span><strong>₹{budgetEval.totalAllocated}</strong></div>
                <div className={`flex justify-between text-base font-black border-t border-slate-800 pt-2 ${budgetEval.isWithinBudget ? 'text-emerald-300' : 'text-rose-400'}`}>
                  <span>Remaining Balance</span>
                  <span>₹{budgetEval.remaining}</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Savings Rate: <strong className="text-amber-300">{budgetEval.savingsPercent}%</strong> of income.
                </p>
                {budgetEval.isWithinBudget && budget.savings >= 2000 && (
                  <button
                    type="button"
                    onClick={() => completeMission('budget_balance', 30)}
                    className="w-full py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold cursor-pointer"
                  >
                    {missionSolved.budget_balance ? '✓ Budget Mission Completed (+30 XP)' : 'Claim Balanced Budget Mission (+30 XP)'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: COOPERATIVE CONCEPTS & MISSIONS */}
          {tab === 'missions' && (
            <div className="space-y-4">
              <div className="bg-slate-800/75 border border-sky-500/35 rounded-2xl p-4 space-y-2">
                <h3 className="font-bold text-sky-300">🤝 What is a Village Cooperative Bank?</h3>
                <p className="text-slate-200 leading-relaxed">
                  A cooperative bank is owned and run democratically by its community members—farmers, artisans, and families. Members pool their savings and offer fair, low-interest loans for seeds, solar pumps, or small shops, promoting financial inclusion and protecting families from unfair informal moneylenders.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-800/75 border border-amber-500/35 rounded-2xl p-4 space-y-2.5">
                  <p className="font-bold text-amber-300">🎯 Mission 1: Deposit Interest (+25 XP)</p>
                  <p className="text-slate-200">
                    Calculate Simple Interest on a deposit of <strong>₹4,000</strong> at <strong>5% per year</strong> for <strong>2 years</strong>.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={interestQuiz}
                      onChange={(e) => setInterestQuiz(e.target.value)}
                      placeholder="₹ Interest"
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (Number(interestQuiz.trim()) === 400) {
                          completeMission('si_quiz', 25);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold cursor-pointer"
                    >
                      Check
                    </button>
                  </div>
                  {missionSolved.si_quiz && (
                    <p className="text-emerald-300 font-semibold">✓ SI = (4000 × 5 × 2) ÷ 100 = ₹400! +25 XP!</p>
                  )}
                </div>

                <div className="bg-slate-800/75 border border-emerald-500/35 rounded-2xl p-4 space-y-2.5">
                  <p className="font-bold text-emerald-300">🎯 Mission 2: Save ₹2,000 in 3 Months (+25 XP)</p>
                  <p className="text-slate-200">
                    Deposit enough virtual money in Tab 1 so your Bank Account Balance reaches at least <strong>₹2,000</strong>!
                  </p>
                  <p className="text-slate-300">Current Virtual Balance: <strong className="text-amber-300">₹{bankBalance}</strong></p>
                  <button
                    type="button"
                    disabled={bankBalance < 2000}
                    onClick={() => completeMission('savings_2000', 25)}
                    className="w-full py-2 rounded-xl bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-bold cursor-pointer"
                  >
                    {missionSolved.savings_2000
                      ? '✓ Savings Goal Achieved (+25 XP)'
                      : bankBalance >= 2000
                      ? 'Claim Savings Mission (+25 XP)'
                      : 'Deposit ₹500+ in Savings Tab First'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/95 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer"
          >
            {lang === 'hi' ? 'गाँव में वापस जाएँ' : lang === 'kn' ? 'ಗ್ರಾಮಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Back to Village'}
          </button>
        </div>
      </div>
    </div>
  );
};
