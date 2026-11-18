import React, { useState } from 'react';
import { Lang } from '../../../learning/types';

interface HouseDemoProps {
  lang: Lang;
}

export const HouseDemo: React.FC<HouseDemoProps> = ({ lang }) => {
  const [roofArea, setRoofArea] = useState<number>(60); // m²
  const [rainfall, setRainfall] = useState<number>(50); // mm
  const [roofType, setRoofType] = useState<'metal' | 'tile' | 'thatch'>('metal');

  const runoffCoefficients: Record<'metal' | 'tile' | 'thatch', number> = {
    metal: 0.9,
    tile: 0.8,
    thatch: 0.5,
  };

  const coefficient = runoffCoefficients[roofType];
  // V = Area (m²) * Rainfall (mm) * Coefficient (1 mm on 1 m² = 1 Litre)
  const harvestedLitres = Math.round(roofArea * rainfall * coefficient);
  const daysOfWater = Math.round(harvestedLitres / 20); // 20L per family per day for drinking/cooking
  const tankFillPercent = Math.min(100, Math.round((harvestedLitres / 5000) * 100));

  const t = {
    en: {
      title: 'Rainwater Harvesting Simulator',
      subtitle: 'Calculate how much clean rainwater your roof can collect: V = Area × Rainfall × Runoff',
      roofArea: 'Roof Surface Area',
      rainfall: 'Rainfall Event',
      roofMaterial: 'Roof Material',
      metal: 'Corrugated Metal (0.90)',
      tile: 'Clay Tiles (0.80)',
      thatch: 'Thatch / Grass (0.50)',
      resultTitle: 'Water Harvested',
      drinkingDays: 'Family drinking water for',
      days: 'days',
      storageTank: '5,000L Underground Sump',
      scienceNote: '💡 Metal and tile roofs have higher runoff efficiency because they absorb less water compared to thatch.',
    },
    hi: {
      title: 'वर्षा जल संचयन सिम्युलेटर',
      subtitle: 'गणना करें कि आपकी छत से कितना वर्षा जल एकत्र हो सकता है: आयतन = क्षेत्रफल × वर्षा × अपवाह गुणांक',
      roofArea: 'छत का क्षेत्रफल',
      rainfall: 'वर्षा की मात्रा',
      roofMaterial: 'छत की सामग्री',
      metal: 'टीन/लोहे की चादर (0.90)',
      tile: 'खपरैल / मिट्टी के टाइल (0.80)',
      thatch: 'घास-फूस / छप्पर (0.50)',
      resultTitle: 'एकत्रित जल',
      drinkingDays: 'परिवार के पीने का पानी',
      days: 'दिनों के लिए',
      storageTank: '5,000 लीटर भूमिगत टैंक',
      scienceNote: '💡 पक्की और टीन की छतें पानी नहीं सोखतीं, इसलिए इनमें जल संचयन की दक्षता सबसे अधिक होती है।',
    },
    kn: {
      title: 'ಮಳೆನೀರು ಕೊಯ್ಲು ಸಿಮ್ಯುಲೇಟರ್',
      subtitle: 'ನಿಮ್ಮ ಛಾವಣಿಯಿಂದ ಎಷ್ಟು ಮಳೆನೀರು ಸಂಗ್ರಹಿಸಬಹುದು ಎಂದು ಲೆಕ್ಕ ಹಾಕಿ: ಪರಿಮಾಣ = ವಿಸ್ತೀರ್ಣ × ಮಳೆ × ಗುಣಾಂಕ',
      roofArea: 'ಛಾವಣಿಯ ವಿಸ್ತೀರ್ಣ',
      rainfall: 'ಮಳೆಯ ಪ್ರಮಾಣ',
      roofMaterial: 'ಛಾವಣಿಯ ವಸ್ತು',
      metal: 'ಲೋಹದ ಶೀಟ್ (0.90)',
      tile: 'ಹೆಂಚುಗಳು (0.80)',
      thatch: 'ಹುಲ್ಲಿನ ಮಾಡು (0.50)',
      resultTitle: 'ಸಂಗ್ರಹಿಸಿದ ನೀರು',
      drinkingDays: 'ಕುಟುಂಬದ ಕುಡಿಯುವ ನೀರು',
      days: 'ದಿನಗಳಿಗೆ',
      storageTank: '5,000 ಲೀಟರ್ ಭೂಗತ ತೊಟ್ಟಿ',
      scienceNote: '💡 ಲೋಹ ಮತ್ತು ಹೆಂಚಿನ ಛಾವಣಿಗಳು ನೀರನ್ನು ಹೀರಿಕೊಳ್ಳುವುದಿಲ್ಲ, ಆದ್ದರಿಂದ ಹೆಚ್ಚು ನೀರು ಸಂಗ್ರಹವಾಗುತ್ತದೆ.',
    },
  }[lang];

  return (
    <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 sm:p-5 space-y-4">
      <div className="border-b border-slate-800 pb-2">
        <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
          <span>🌧️</span> {t.title}
        </h3>
        <p className="text-xs text-slate-400">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Sliders & Controls */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>{t.roofArea}</span>
              <span className="text-amber-400 font-bold">{roofArea} m²</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={roofArea}
              onChange={(e) => setRoofArea(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>20 m²</span>
              <span>150 m²</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>{t.rainfall}</span>
              <span className="text-cyan-400 font-bold">{rainfall} mm</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={rainfall}
              onChange={(e) => setRainfall(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>10 mm (Light)</span>
              <span>200 mm (Heavy Monsoon)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 font-medium mb-1">{t.roofMaterial}</label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {(['metal', 'tile', 'thatch'] as const).map((mat) => (
                <button
                  key={mat}
                  type="button"
                  onClick={() => setRoofType(mat)}
                  className={`py-1.5 px-2 rounded border text-center transition-all ${
                    roofType === mat
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mat === 'metal' ? t.metal : mat === 'tile' ? t.tile : t.thatch}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visualizer & Results */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          {/* Animated SVG House Diagram */}
          <div className="relative h-28 w-full flex items-center justify-center">
            <svg viewBox="0 0 200 110" className="w-full h-full max-w-[200px]">
              {/* Raindrops */}
              <g stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3">
                <line x1="30" y1="5" x2="25" y2="25" className="animate-pulse" />
                <line x1="60" y1="2" x2="55" y2="22" className="animate-pulse" />
                <line x1="90" y1="6" x2="85" y2="26" className="animate-pulse" />
                <line x1="120" y1="3" x2="115" y2="23" className="animate-pulse" />
              </g>

              {/* Roof */}
              <polygon
                points="10,45 80,15 150,45"
                fill={roofType === 'metal' ? '#94a3b8' : roofType === 'tile' ? '#ea580c' : '#ca8a04'}
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* House walls */}
              <rect x="25" y="45" width="110" height="40" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
              {/* Door */}
              <rect x="65" y="55" width="20" height="30" fill="#78350f" />
              {/* Windows */}
              <rect x="35" y="55" width="16" height="16" fill="#38bdf8" />
              <rect x="105" y="55" width="16" height="16" fill="#38bdf8" />

              {/* Gutter and Downpipe */}
              <line x1="148" y1="45" x2="152" y2="47" stroke="#38bdf8" strokeWidth="3" />
              <line x1="152" y1="47" x2="152" y2="70" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="152" y1="70" x2="168" y2="70" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Underground Storage Tank */}
              <rect x="165" y="58" width="30" height="38" rx="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
              {/* Water in Tank */}
              <rect
                x="166"
                y={95 - (35 * tankFillPercent) / 100}
                width="28"
                height={(35 * tankFillPercent) / 100}
                fill="#0284c7"
                opacity="0.85"
                className="transition-all duration-300"
              />
              <text x="180" y="54" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">
                {tankFillPercent}%
              </text>
            </svg>
          </div>

          {/* Harvest Stats */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{t.resultTitle}:</span>
              <span className="text-base font-extrabold text-cyan-400">
                {harvestedLitres.toLocaleString()} L
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{t.drinkingDays}:</span>
              <span className="font-bold text-emerald-400">
                {daysOfWater} {t.days}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/60 text-[11px] text-slate-300 leading-relaxed">
        {t.scienceNote}
      </div>
    </div>
  );
};
