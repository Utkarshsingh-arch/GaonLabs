import React, { useState } from 'react';
import { Lang } from '../../../learning/types';

interface TankDemoProps {
  lang: Lang;
}

export const TankDemo: React.FC<TankDemoProps> = ({ lang }) => {
  const [standHeightM, setStandHeightM] = useState<number>(6); // meters
  const [waterDepthM, setWaterDepthM] = useState<number>(3); // meters

  const rho = 1000; // kg/m³ water density
  const g = 9.8; // m/s² gravity
  const totalHeadM = standHeightM + waterDepthM;

  // P = rho * g * H (in Pascals, convert to kPa)
  const pressureKPa = Math.round((rho * g * totalHeadM) / 1000);
  // Torricelli's Law: v = sqrt(2 * g * H)
  const exitVelocityMs = Math.round(Math.sqrt(2 * g * totalHeadM) * 10) / 10;
  // Jet horizontal reach (approx d = v * sqrt(2 * h / g) = 2 * sqrt(H * h))
  const jetDistanceM = Math.round(2 * Math.sqrt(totalHeadM * standHeightM) * 10) / 10;

  const t = {
    en: {
      title: 'Hydrostatic Pressure & Water Jet Simulator',
      subtitle: 'Experience Torricelli’s Law & Fluid Pressure: P = ρgh and v = √(2gh)',
      standHeight: 'Overhead Tower Height (h)',
      waterDepth: 'Water Tank Level (d)',
      pressureTitle: 'Pressure at Ground Tap',
      velocityTitle: 'Water Exit Velocity',
      jetRangeTitle: 'Horizontal Jet Distance',
      scienceNote:
        '💡 Notice that doubling the height increases pressure proportionally (P ∝ h), but water velocity grows by the square root (v ∝ √h). High water towers supply entire village homes by gravity without electric booster pumps!',
    },
    hi: {
      title: 'द्रवस्थैतिक दाब एवं जल प्रवाह सिम्युलेटर',
      subtitle: 'टॉरिसेली का नियम और जल दाब समझें: P = ρgh और v = √(2gh)',
      standHeight: 'टंकी की ज़मीन से ऊँचाई (h)',
      waterDepth: 'टंकी में पानी की गहराई (d)',
      pressureTitle: 'ज़मीन पर नल का जल दाब',
      velocityTitle: 'नल से निकलने वाले जल का वेग',
      jetRangeTitle: 'जल धारा की क्षैतिज दूरी',
      scienceNote:
        '💡 ऊँचाई दोगुनी करने पर दाब दोगुना हो जाता है (P ∝ h), पर वेग वर्गमूल अनुपात में बढ़ता है (v ∝ √h)। इसी कारण गाँव में ऊँची पानी की टंकियाँ बिना किसी बिजली पंप के गुरुत्वाकर्षण से घर-घर पानी पहुँचाती हैं!',
    },
    kn: {
      title: 'ಹೈಡ್ರೋಸ್ಟಾಟಿಕ್ ಒತ್ತಡ ಮತ್ತು ನೀರಿನ ಸಿಮ್ಯುಲೇಟರ್',
      subtitle: 'ದ್ರವ ಒತ್ತಡ ಮತ್ತು ಟಾರಿಸೆಲ್ಲಿ ನಿಯಮ ತಿಳಿಯಿರಿ: P = ρgh ಮತ್ತು v = √(2gh)',
      standHeight: 'ತೊಟ್ಟಿಯ ಎತ್ತರ (h)',
      waterDepth: 'ತೊಟ್ಟಿಯಲ್ಲಿ ನೀರಿನ ಮಟ್ಟ (d)',
      pressureTitle: 'ನೆಲದ ನಲ್ಲಿಯ ಬಳಿ ನೀರಿನ ಒತ್ತಡ',
      velocityTitle: 'ನೀರು ಹೊರಬರುವ ವೇಗ',
      jetRangeTitle: 'ನೀರಿನ ಚಿಮ್ಮುವ ದೂರ',
      scienceNote:
        '💡 ಎತ್ತರ ಹೆಚ್ಚಾದಂತೆ ಒತ್ತಡವೂ ಹೆಚ್ಚಾಗುತ್ತದೆ (P ∝ h). ಗುರುತ್ವಾಕರ್ಷಣೆಯ ಬಲದಿಂದಾಗಿ ವಿದ್ಯುತ್ ಪಂಪ್ ಇಲ್ಲದೆಯೇ ಹಳ್ಳಿಯ ಮನೆಗಳಿಗೆ ನೀರು ತಲುಪಲು ಎತ್ತರದ ಟ್ಯಾಂಕ್‌ಗಳು ಸಹಾಯ ಮಾಡುತ್ತವೆ!',
    },
  }[lang];

  return (
    <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 sm:p-5 space-y-4">
      <div className="border-b border-slate-800 pb-2">
        <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
          <span>💧</span> {t.title}
        </h3>
        <p className="text-xs text-slate-400">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Controls */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>{t.standHeight}</span>
              <span className="text-cyan-400 font-bold">{standHeightM} meters</span>
            </div>
            <input
              type="range"
              min="2"
              max="15"
              step="1"
              value={standHeightM}
              onChange={(e) => setStandHeightM(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>2m (Low)</span>
              <span>15m (Tall Tower)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>{t.waterDepth}</span>
              <span className="text-amber-400 font-bold">{waterDepthM} meters</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={waterDepthM}
              onChange={(e) => setWaterDepthM(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1m (Low level)</span>
              <span>5m (Full tank)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Total Effective Head ($H$):</span>
            <span className="font-bold text-white text-sm">{totalHeadM} meters</span>
          </div>
        </div>

        {/* Visualizer & Pressure Metrics */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="relative h-28 w-full flex items-center justify-center">
            <svg viewBox="0 0 200 110" className="w-full h-full max-w-[200px]">
              {/* Ground line */}
              <line x1="10" y1="95" x2="190" y2="95" stroke="#475569" strokeWidth="2" />

              {/* Tank Stilt legs */}
              <line x1="35" y1={95 - standHeightM * 4} x2="30" y2="95" stroke="#94a3b8" strokeWidth="2.5" />
              <line x1="55" y1={95 - standHeightM * 4} x2="60" y2="95" stroke="#94a3b8" strokeWidth="2.5" />
              <line x1="30" y1="95" x2="60" y2={95 - standHeightM * 2} stroke="#64748b" strokeWidth="1" />

              {/* Water Tank */}
              <rect
                x="28"
                y={95 - standHeightM * 4 - 28}
                width="34"
                height="28"
                rx="3"
                fill="#1e293b"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              {/* Water Inside Tank */}
              <rect
                x="29"
                y={95 - standHeightM * 4 - (26 * waterDepthM) / 5}
                width="32"
                height={(26 * waterDepthM) / 5}
                fill="#0284c7"
                opacity="0.8"
              />

              {/* Downpipe */}
              <line
                x1="45"
                y1={95 - standHeightM * 4}
                x2="45"
                y2="92"
                stroke="#38bdf8"
                strokeWidth="3"
              />
              <line x1="45" y1="92" x2="65" y2="92" stroke="#38bdf8" strokeWidth="3" />

              {/* Jet stream curve */}
              <path
                d={`M 65 92 Q ${65 + jetDistanceM * 2} 90, ${Math.min(185, 65 + jetDistanceM * 4)} 95`}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="4 2"
                className="animate-pulse"
              />
              <circle cx={Math.min(185, 65 + jetDistanceM * 4)} cy="95" r="3" fill="#38bdf8" />
            </svg>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{t.pressureTitle}:</span>
              <span className="text-base font-extrabold text-cyan-400">{pressureKPa} kPa</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{t.velocityTitle}:</span>
              <span className="font-bold text-amber-400">{exitVelocityMs} m/s</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{t.jetRangeTitle}:</span>
              <span className="font-bold text-emerald-400">{jetDistanceM} meters</span>
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
