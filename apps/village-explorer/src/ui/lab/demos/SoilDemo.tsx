import React, { useState } from 'react';
import { Lang } from '../../../learning/types';

interface SoilDemoProps {
  lang: Lang;
}

type SoilBase = 'acidic' | 'neutral' | 'alkaline';

export const SoilDemo: React.FC<SoilDemoProps> = ({ lang }) => {
  const [soilType, setSoilType] = useState<SoilBase>('acidic');
  const [limeAddedKg, setLimeAddedKg] = useState<number>(0); // 0 to 5 kg (raises pH)
  const [gypsumAddedKg, setGypsumAddedKg] = useState<number>(0); // 0 to 5 kg (lowers pH)

  const initialPhMap: Record<SoilBase, number> = {
    acidic: 5.2,
    neutral: 6.8,
    alkaline: 8.6,
  };

  const currentPh = Math.round((initialPhMap[soilType] + limeAddedKg * 0.45 - gypsumAddedKg * 0.4) * 10) / 10;
  const clampedPh = Math.min(10.0, Math.max(4.0, currentPh));

  // Determine indicator color
  const getPhColor = (ph: number): string => {
    if (ph < 5.5) return '#ef4444'; // Red
    if (ph < 6.5) return '#f59e0b'; // Orange / Yellow
    if (ph <= 7.5) return '#10b981'; // Green (Neutral)
    if (ph < 8.5) return '#06b6d4'; // Cyan
    return '#8b5cf6'; // Violet / Purple
  };

  const phColor = getPhColor(clampedPh);

  const t = {
    en: {
      title: 'Soil Chemistry & pH Amendment Simulator',
      subtitle: 'Balance soil pH with lime (raises pH) or gypsum (neutralizes alkaline soil)',
      soilTypeLabel: 'Initial Soil Sample',
      acidic: 'Acidic Red Soil (pH 5.2)',
      neutral: 'Fertile Loam (pH 6.8)',
      alkaline: 'Alkaline Soil (pH 8.6)',
      addLime: 'Add Agricultural Lime (CaCO₃)',
      addGypsum: 'Add Gypsum / Organic Compost',
      currentPhTitle: 'Resulting Soil pH',
      statusAcidic: 'Acidic (Nutrient lock)',
      statusNeutral: 'Optimal / Neutral (High Fertility)',
      statusAlkaline: 'Alkaline / Saline',
      suitableCrops: 'Suitable Crops for Current pH',
      scienceNote:
        '💡 Most Indian crops (wheat, rice, pulses) thrive best between pH 6.0 and 7.5. Agricultural lime neutralizes hydrogen ions to treat acidic soil, while gypsum replaces excess sodium in alkaline soil.',
    },
    hi: {
      title: 'मृदा रसायन एवं pH सुधारक सिम्युलेटर',
      subtitle: 'चूना (pH बढ़ाता है) या जिप्सम (क्षारीय मिट्टी सुधारता है) डालकर मिट्टी का pH संतुलित करें',
      soilTypeLabel: 'प्रारंभिक मिट्टी का नमूना',
      acidic: 'अम्लीय लाल मिट्टी (pH 5.2)',
      neutral: 'उपजाऊ दोमट मिट्टी (pH 6.8)',
      alkaline: 'क्षारीय / खारी मिट्टी (pH 8.6)',
      addLime: 'कृषि चूना (CaCO₃) मिलाएं',
      addGypsum: 'जिप्सम / जैविक खाद मिलाएं',
      currentPhTitle: 'मिट्टी का वर्तमान pH मान',
      statusAcidic: 'अम्लीय (पोषक तत्वों की कमी)',
      statusNeutral: 'सर्वोत्तम / उदासीन (अत्यधिक उपजाऊ)',
      statusAlkaline: 'क्षारीय / लवणीय',
      suitableCrops: 'इस pH पर उगने वाली फसलें',
      scienceNote:
        '💡 अधिकांश भारतीय फसलें pH 6.0 से 7.5 के बीच सबसे अच्छी होती हैं। कृषि चूना अम्लता को दूर करता है, जबकि जिप्सम क्षारीय मिट्टी के लवणों को संतुलित करता है।',
    },
    kn: {
      title: 'ಮಣ್ಣಿನ ರಸಾಯನಶಾಸ್ತ್ರ ಮತ್ತು pH ಸಿಮ್ಯುಲೇಟರ್',
      subtitle: 'ಸುಣ್ಣ ಅಥವಾ ಜಿಪ್ಸಮ್ ಬಳಸಿ ಮಣ್ಣಿನ pH ಸಮತೋಲನವನ್ನು ಸುಧಾರಿಸಿ',
      soilTypeLabel: 'ಆರಂಭಿಕ ಮಣ್ಣಿನ ಮಾದರಿ',
      acidic: 'ಆಮ್ಲೀಯ ಕೆಂಪು ಮಣ್ಣು (pH 5.2)',
      neutral: 'ಫಲವತ್ತಾದ ಗೋಡು ಮಣ್ಣು (pH 6.8)',
      alkaline: 'ಕ್ಷಾರೀಯ ಮಣ್ಣು (pH 8.6)',
      addLime: 'ಕೃಷಿ ಸುಣ್ಣ (CaCO₃) ಸೇರಿಸಿ',
      addGypsum: 'ಜಿಪ್ಸಮ್ / ಕಾಂಪೋಸ್ಟ್ ಸೇರಿಸಿ',
      currentPhTitle: 'ಪ್ರಸ್ತುತ ಮಣ್ಣಿನ pH ಮೌಲ್ಯ',
      statusAcidic: 'ಆಮ್ಲೀಯ ಮಣ್ಣು',
      statusNeutral: 'ಉತ್ತಮ / ತಟಸ್ಥ (ಫಲವತ್ತಾದ)',
      statusAlkaline: 'ಕ್ಷಾರೀಯ ಮಣ್ಣು',
      suitableCrops: 'ಸೂಕ್ತ ಬೆಳೆಗಳು',
      scienceNote:
        '💡 ಹೆಚ್ಚಿನ ಬೆಳೆಗಳಿಗೆ pH 6.0 ರಿಂದ 7.5 ರವರೆಗೆ ಅತ್ಯುತ್ತಮ. ಆಮ್ಲೀಯ ಮಣ್ಣಿಗೆ ಸುಣ್ಣ ಮತ್ತು ಕ್ಷಾರೀಯ ಮಣ್ಣಿಗೆ ಜಿಪ್ಸಮ್ ಮಣ್ಣಿನ ಫಲವತ್ತತೆಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.',
    },
  }[lang];

  return (
    <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 sm:p-5 space-y-4">
      <div className="border-b border-slate-800 pb-2">
        <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
          <span>🧪</span> {t.title}
        </h3>
        <p className="text-xs text-slate-400">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Controls */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-300 font-medium mb-1">{t.soilTypeLabel}</label>
            <div className="space-y-1 text-xs">
              {(['acidic', 'neutral', 'alkaline'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setSoilType(type);
                    setLimeAddedKg(0);
                    setGypsumAddedKg(0);
                  }}
                  className={`w-full py-1.5 px-3 rounded border text-left transition-all ${
                    soilType === type
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type === 'acidic' ? t.acidic : type === 'neutral' ? t.neutral : t.alkaline}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>{t.addLime}</span>
              <span className="text-amber-400 font-bold">{limeAddedKg} kg/are</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={limeAddedKg}
              onChange={(e) => {
                setLimeAddedKg(Number(e.target.value));
                if (Number(e.target.value) > 0) setGypsumAddedKg(0);
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>{t.addGypsum}</span>
              <span className="text-cyan-400 font-bold">{gypsumAddedKg} kg/are</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={gypsumAddedKg}
              onChange={(e) => {
                setGypsumAddedKg(Number(e.target.value));
                if (Number(e.target.value) > 0) setLimeAddedKg(0);
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>

        {/* Visualizer & Indicator Strip */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="relative h-28 w-full flex items-center justify-center">
            <svg viewBox="0 0 200 110" className="w-full h-full max-w-[200px]">
              {/* Test Tube */}
              <rect x="85" y="15" width="30" height="70" rx="15" fill="none" stroke="#94a3b8" strokeWidth="2.5" />

              {/* Chemical Liquid Inside with dynamic pH color */}
              <path
                d="M 87 40 L 113 40 L 113 70 A 13 13 0 0 1 87 70 Z"
                fill={phColor}
                opacity="0.85"
                className="transition-colors duration-500"
              />

              {/* Bubbles */}
              <circle cx="95" cy="55" r="2" fill="#ffffff" opacity="0.6" className="animate-pulse" />
              <circle cx="105" cy="48" r="1.5" fill="#ffffff" opacity="0.6" className="animate-pulse" />

              {/* Universal Indicator Color Strip Gauge */}
              <defs>
                <linearGradient id="phGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="25%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="75%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <rect x="25" y="94" width="150" height="8" rx="4" fill="url(#phGrad)" />

              {/* Needle Indicator on Strip */}
              {/* pH 4 is at x=25, pH 10 is at x=175. scale = (clampedPh - 4) / 6 */}
              <polygon
                points={`${25 + ((clampedPh - 4) / 6) * 150},90 ${25 + ((clampedPh - 4) / 6) * 150 - 4},84 ${25 + ((clampedPh - 4) / 6) * 150 + 4},84`}
                fill="#ffffff"
                stroke="#0f172a"
                strokeWidth="1"
              />
            </svg>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{t.currentPhTitle}:</span>
              <span className="text-lg font-extrabold" style={{ color: phColor }}>
                pH {clampedPh}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Classification:</span>
              <span className="font-bold text-slate-200">
                {clampedPh < 6.0 ? t.statusAcidic : clampedPh <= 7.5 ? t.statusNeutral : t.statusAlkaline}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Crop Suitability Badges */}
      <div className="pt-1">
        <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">{t.suitableCrops}:</span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { name: '🌾 Rice / Paddy', min: 5.0, max: 7.2 },
            { name: '🌾 Wheat', min: 6.0, max: 7.5 },
            { name: '🌽 Maize', min: 5.8, max: 7.5 },
            { name: '🌱 Pulses / Gram', min: 6.2, max: 7.6 },
            { name: '🥜 Groundnut', min: 6.0, max: 7.0 },
          ].map((crop) => {
            const isSuitable = clampedPh >= crop.min && clampedPh <= crop.max;
            return (
              <span
                key={crop.name}
                className={`text-[11px] px-2 py-0.5 rounded-full border ${
                  isSuitable
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-semibold'
                    : 'bg-slate-800/40 border-slate-700/50 text-slate-500 line-through'
                }`}
              >
                {crop.name} {isSuitable ? '✓' : ''}
              </span>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/60 text-[11px] text-slate-300 leading-relaxed">
        {t.scienceNote}
      </div>
    </div>
  );
};
