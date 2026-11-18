import React, { useState } from 'react';
import { Lang } from '../../learning/types';
import { SupportedGrade } from '../../learning/curriculum/ncertRegistry';
import {
  formatCompactNcertCitation,
  resolveCurriculumForEntity,
} from '../../learning/curriculum/curriculumMapper';
import {
  calculateDiscountedPrice,
  calculateMarketBill,
  calculateProfitLoss,
} from '../../learning/civicEngines';
import { NcertModalTarget } from '../curriculum/NcertConceptModal';

interface VillageMarketModalProps {
  lang: Lang;
  studentGrade: SupportedGrade;
  onClose: () => void;
  onAwardXp: (amount: number, reason: string) => void;
  onExploreNcert?: (target: NcertModalTarget) => void;
}

interface MarketShop {
  id: string;
  icon: string;
  name: Record<Lang, string>;
  keeper: string;
  items: Array<{ name: string; unit: string; costPrice: number; defaultSellPrice: number }>;
}

const VILLAGE_SHOPS: MarketShop[] = [
  {
    id: 'grocery',
    icon: '🌾',
    name: { en: 'Grocery Shop', hi: 'किराना दुकान', kn: 'ಕಿರಾಣಿ ಅಂಗಡಿ' },
    keeper: 'Mohan Bhai',
    items: [
      { name: 'Rice', unit: 'kg', costPrice: 40, defaultSellPrice: 50 },
      { name: 'Sugar', unit: 'kg', costPrice: 38, defaultSellPrice: 45 },
      { name: 'Notebooks', unit: 'pc', costPrice: 10, defaultSellPrice: 15 },
    ],
  },
  {
    id: 'vegetable',
    icon: '🥬',
    name: { en: 'Vegetable Shop', hi: 'सब्ज़ी दुकान', kn: 'ತರಕಾರಿ ಅಂಗಡಿ' },
    keeper: 'Lakshmi Akka',
    items: [
      { name: 'Tomatoes', unit: 'kg', costPrice: 20, defaultSellPrice: 30 },
      { name: 'Potatoes', unit: 'kg', costPrice: 25, defaultSellPrice: 32 },
      { name: 'Spinach', unit: 'bunch', costPrice: 12, defaultSellPrice: 18 },
    ],
  },
  {
    id: 'fruit',
    icon: '🥭',
    name: { en: 'Fruit Shop', hi: 'फल दुकान', kn: 'ಹಣ್ಣಿನ ಅಂಗಡಿ' },
    keeper: 'Salma Didi',
    items: [
      { name: 'Mangoes', unit: 'kg', costPrice: 60, defaultSellPrice: 80 },
      { name: 'Bananas', unit: 'dozen', costPrice: 40, defaultSellPrice: 52 },
      { name: 'Guavas', unit: 'kg', costPrice: 35, defaultSellPrice: 45 },
    ],
  },
  {
    id: 'clothing',
    icon: '👕',
    name: { en: 'Clothing Shop', hi: 'कपड़ा दुकान', kn: 'ಬಟ್ಟೆ ಅಂಗಡಿ' },
    keeper: 'Ramesh Weaver',
    items: [
      { name: 'Cotton Kurta', unit: 'pc', costPrice: 250, defaultSellPrice: 320 },
      { name: 'School Shirt', unit: 'pc', costPrice: 180, defaultSellPrice: 240 },
    ],
  },
  {
    id: 'hardware',
    icon: '🔧',
    name: { en: 'Hardware Shop', hi: 'हार्डवेयर दुकान', kn: 'ಹಾರ್ಡ್‌ವೇರ್ ಅಂಗಡಿ' },
    keeper: 'Deepak Tools',
    items: [
      { name: 'LED Bulb (15W)', unit: 'pc', costPrice: 80, defaultSellPrice: 110 },
      { name: 'Garden Spade', unit: 'pc', costPrice: 150, defaultSellPrice: 200 },
    ],
  },
];

export const VillageMarketModal: React.FC<VillageMarketModalProps> = ({
  lang,
  studentGrade,
  onClose,
  onAwardXp,
  onExploreNcert,
}) => {
  const [selectedShop, setSelectedShop] = useState<MarketShop>(VILLAGE_SHOPS[0]);
  const [tab, setTab] = useState<'profit_loss' | 'discounts' | 'billing'>('profit_loss');

  // Profit & Loss Simulator
  const [unitCP, setUnitCP] = useState<number>(10);
  const [unitSP, setUnitSP] = useState<number>(15);
  const [qty, setQty] = useState<number>(10);
  const [profitQuizInput, setProfitQuizInput] = useState<string>('');
  const [profitQuizSolved, setProfitQuizSolved] = useState<boolean>(false);

  // Discounts Lab
  const [markedPrice, setMarkedPrice] = useState<number>(400);
  const [discountPct, setDiscountPct] = useState<number>(15);

  // Customer Billing & Change Simulator (2 kg Rice @ ₹50, 1 kg Sugar @ ₹45, 3 kg Veg @ ₹30 = ₹235; Paid ₹500 -> Change ₹265)
  const [billInput, setBillInput] = useState<string>('');
  const [changeInput, setChangeInput] = useState<string>('');
  const [billFeedback, setBillFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [shopBalance, setShopBalance] = useState<number>(1000);

  const pl = calculateProfitLoss(unitCP, unitSP, qty);
  const disc = calculateDiscountedPrice(markedPrice, discountPct);
  const sampleBill = calculateMarketBill(
    [
      { unitPrice: 50, qty: 2 },
      { unitPrice: 45, qty: 1 },
      { unitPrice: 30, qty: 3 },
    ],
    500
  );
  const ncertEntry = resolveCurriculumForEntity('village_marketplace', studentGrade);

  const handleSelectShop = (shop: MarketShop) => {
    setSelectedShop(shop);
    const first = shop.items[0];
    setUnitCP(first.costPrice);
    setUnitSP(first.defaultSellPrice);
    setQty(10);
  };

  const verifyProfitQuiz = () => {
    // 10 notebooks @ CP ₹100 (₹10 each), sold at ₹15 each -> Profit ₹50 -> 50%
    if (Number(profitQuizInput.trim()) === 50) {
      if (!profitQuizSolved) {
        setShopBalance((b) => b + 50);
        onAwardXp(25, 'Village Market Profit & Loss Challenge');
      }
      setProfitQuizSolved(true);
    }
  };

  const verifyCustomerBill = () => {
    if (
      Number(billInput.trim()) === sampleBill.totalBill &&
      Number(changeInput.trim()) === sampleBill.change
    ) {
      if (billFeedback !== 'correct') {
        setShopBalance((b) => b + 45);
        onAwardXp(25, 'Village Market Billing & Change Counter');
      }
      setBillFeedback('correct');
    } else {
      setBillFeedback('wrong');
    }
  };

  const title =
    lang === 'hi'
      ? 'गाँव बाज़ार (5 दुकानें) — लाभ-हानि और छूट प्रयोगशाला'
      : lang === 'kn'
      ? 'ಗ್ರಾಮ ಮಾರುಕಟ್ಟೆ (5 ಅಂಗಡಿಗಳು) — ಲಾಭ-ನಷ್ಟ ಮತ್ತು ರಿಯಾಯಿತಿ ಲ್ಯಾಬ್'
      : 'Village Marketplace (5 Shops) — Profit, Loss & Percentages Lab';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-orange-500/45 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-gradient-to-r from-orange-950/75 to-slate-900">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-orange-500/20 border border-orange-400/40">
              🛍️
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-orange-300">{title}</h2>
              {ncertEntry && (
                <div className="flex items-center gap-2 text-[11px] text-emerald-300">
                  <span>📖 NCERT: {formatCompactNcertCitation(ncertEntry)}</span>
                  {onExploreNcert && (
                    <button
                      type="button"
                      onClick={() =>
                        onExploreNcert({
                          entityKey: 'village_marketplace',
                          objectName: 'Village Marketplace',
                          objectIcon: '🛍️',
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
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              Shop Cash: ₹{shopBalance}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close marketplace"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 5 Village Shops Strip */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 flex flex-wrap gap-1.5">
          {VILLAGE_SHOPS.map((shop) => (
            <button
              key={shop.id}
              type="button"
              onClick={() => handleSelectShop(shop)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
                selectedShop.id === shop.id
                  ? 'bg-orange-500 text-slate-950 border-orange-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-orange-400/50'
              }`}
            >
              {shop.icon} {shop.name[lang]}
            </button>
          ))}
        </div>

        {/* Activity Tabs */}
        <div className="flex flex-wrap gap-1.5 px-4 pt-2 border-b border-slate-800 bg-slate-900/70">
          {[
            { id: 'profit_loss' as const, icon: '📈', label: { en: 'Profit & Loss', hi: 'लाभ और हानि', kn: 'ಲಾಭ ಮತ್ತು ನಷ್ಟ' } },
            { id: 'discounts' as const, icon: '🏷️', label: { en: 'Discounts & %', hi: 'छूट और प्रतिशत', kn: 'ರಿಯಾಯಿತಿ ಮತ್ತು %' } },
            { id: 'billing' as const, icon: '🧾', label: { en: 'Billing & Change Counter', hi: 'बिल और शेष राशि', kn: 'ಬಿಲ್ ಮತ್ತು ಚಿಲ್ಲರೆ' } },
          ].map((tItem) => (
            <button
              key={tItem.id}
              type="button"
              onClick={() => setTab(tItem.id)}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 cursor-pointer ${
                tab === tItem.id
                  ? 'border-orange-400 text-orange-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tItem.icon}</span>
              <span>{tItem.label[lang]}</span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {tab === 'profit_loss' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/75 border border-slate-700 rounded-2xl p-4 space-y-3 text-xs">
                <p className="font-bold text-orange-300">
                  {selectedShop.icon} {selectedShop.name[lang]} — Shopkeeper: {selectedShop.keeper}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedShop.items.map((it) => (
                    <button
                      key={it.name}
                      type="button"
                      onClick={() => {
                        setUnitCP(it.costPrice);
                        setUnitSP(it.defaultSellPrice);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-orange-400 text-slate-200 cursor-pointer"
                    >
                      {it.name} (CP ₹{it.costPrice}/{it.unit})
                    </button>
                  ))}
                </div>
                <label className="block">
                  Cost Price (CP per unit): <strong className="text-slate-100">₹{unitCP}</strong>
                  <input type="range" min={5} max={300} step={5} value={unitCP} onChange={(e) => setUnitCP(Number(e.target.value))} className="w-full mt-1" />
                </label>
                <label className="block">
                  Selling Price (SP per unit): <strong className="text-amber-300">₹{unitSP}</strong>
                  <input type="range" min={5} max={400} step={5} value={unitSP} onChange={(e) => setUnitSP(Number(e.target.value))} className="w-full mt-1 accent-amber-400" />
                </label>
                <label className="block">
                  Quantity Sold: <strong>{qty} units</strong>
                  <input type="range" min={1} max={30} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-full mt-1" />
                </label>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-base font-black text-slate-200">₹{pl.totalCP}</span>
                    <span className="block text-[10px] text-slate-400">Total CP</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-base font-black text-amber-300">₹{pl.totalSP}</span>
                    <span className="block text-[10px] text-slate-400">Total SP</span>
                  </div>
                  <div
                    className={`p-2.5 rounded-xl border ${
                      pl.status === 'profit'
                        ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                        : pl.status === 'loss'
                        ? 'bg-rose-950/70 border-rose-500/40 text-rose-300'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-base font-black">
                      {pl.status === 'loss' ? '−' : '+'}₹{pl.amount}
                    </span>
                    <span className="block text-[10px] font-bold uppercase">
                      {pl.status} ({pl.percentage}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Notebook Profit % Challenge */}
              <div className="bg-slate-800/75 border border-emerald-500/35 rounded-2xl p-4 space-y-3 text-xs">
                <h3 className="font-bold text-emerald-300 uppercase tracking-wider">
                  🎯 Shopkeeper Challenge (+25 XP)
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  Mohan Bhai purchases <strong>10 notebooks for ₹100</strong> total and sells them for{' '}
                  <strong>₹15 each</strong>. What is his <strong>Profit Percentage (%)</strong>?
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={profitQuizInput}
                    onChange={(e) => setProfitQuizInput(e.target.value)}
                    placeholder="Profit %"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={verifyProfitQuiz}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold cursor-pointer"
                  >
                    Check
                  </button>
                </div>
                {profitQuizSolved && (
                  <p className="text-emerald-300 font-semibold">
                    ✓ Spot on! Total SP = 10 × ₹15 = ₹150. Profit = ₹50. Profit % = (50 / 100) × 100 = 50%! +25 XP!
                  </p>
                )}
              </div>
            </div>
          )}

          {tab === 'discounts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-800/75 border border-slate-700 rounded-2xl p-4 space-y-3">
                <h3 className="font-bold text-amber-300">🏷️ Festival Discount Calculator</h3>
                <label className="block">
                  Marked Price (Original): <strong>₹{markedPrice}</strong>
                  <input type="range" min={100} max={2000} step={50} value={markedPrice} onChange={(e) => setMarkedPrice(Number(e.target.value))} className="w-full mt-1" />
                </label>
                <label className="block">
                  Discount Percentage: <strong className="text-emerald-300">{discountPct}% OFF</strong>
                  <input type="range" min={0} max={50} step={5} value={discountPct} onChange={(e) => setDiscountPct(Number(e.target.value))} className="w-full mt-1 accent-emerald-400" />
                </label>
              </div>
              <div className="bg-slate-950/80 border border-orange-500/40 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Marked Price</span>
                  <span>₹{markedPrice}</span>
                </div>
                <div className="flex justify-between text-emerald-300">
                  <span>Discount ({discountPct}% of ₹{markedPrice})</span>
                  <span>− ₹{disc.discountAmount}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-amber-300 border-t border-slate-800 pt-2">
                  <span>Final Price</span>
                  <span>₹{disc.finalPrice}</span>
                </div>
              </div>
            </div>
          )}

          {tab === 'billing' && (
            <div className="bg-slate-800/75 border border-slate-700 rounded-2xl p-4 space-y-3 text-xs">
              <h3 className="font-bold text-amber-300">🧾 Serve the Customer & Return Exact Change (+25 XP)</h3>
              <p className="text-slate-200 leading-relaxed">
                A village family buys: <strong>2 kg Rice (₹50/kg)</strong> + <strong>1 kg Sugar (₹45/kg)</strong> +{' '}
                <strong>3 kg Vegetables (₹30/kg)</strong>. They hand you a <strong>₹500</strong> note!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="space-y-1">
                  <span className="text-slate-300 block">Total Bill (₹):</span>
                  <input
                    type="number"
                    value={billInput}
                    onChange={(e) => setBillInput(e.target.value)}
                    placeholder="e.g. 235"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-slate-300 block">Change to Return from ₹500 (₹):</span>
                  <input
                    type="number"
                    value={changeInput}
                    onChange={(e) => setChangeInput(e.target.value)}
                    placeholder="e.g. 265"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={verifyCustomerBill}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold cursor-pointer"
              >
                Complete Sale
              </button>
              {billFeedback === 'correct' && (
                <p className="text-emerald-300 font-semibold">
                  ✓ Perfect billing! Total = ₹100 + ₹45 + ₹90 = ₹235; Change = ₹500 − ₹235 = ₹265. +25 XP earned!
                </p>
              )}
              {billFeedback === 'wrong' && (
                <p className="text-rose-300">
                  Recheck: (2 × 50) + (1 × 45) + (3 × 30) = Total Bill, then subtract from ₹500.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/95 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs cursor-pointer"
          >
            {lang === 'hi' ? 'गाँव में वापस जाएँ' : lang === 'kn' ? 'ಗ್ರಾಮಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Back to Village'}
          </button>
        </div>
      </div>
    </div>
  );
};
