import React, { useState } from 'react';
import { Lang } from '../../../learning/types';

interface SolarDemoProps {
  lang: Lang;
}

export const SolarDemo: React.FC<SolarDemoProps> = ({ lang }) => {
  const [timeHour, setTimeHour] = useState<number>(12); // 6 AM (6) to 6 PM (18)
  const [cleanlinessPercent, setCleanlinessPercent] = useState<number>(90); // 30% to 100%

  const ratedPowerW = 500; // 500W solar panel array

  // Calculate sun angle from horizon (0 deg at 6:00 and 18:00, 90 deg at 12:00)
  const normalizedTime = (timeHour - 6) / 12; // 0 to 1
  const sunAngleRad = normalizedTime * Math.PI; // 0 to PI
  const sinAngle = Math.max(0, Math.sin(sunAngleRad));

  const actualPowerW = Math.round(ratedPowerW * sinAngle * (cleanlinessPercent / 100));
  const ledBulbsPowered = Math.floor(actualPowerW / 15); // 15W village LED bulb
  const canRunPump = actualPowerW >= 300; // 300W DC irrigation pump

  const t = {
    en: {
      title: 'Solar Photovoltaic & Sun Angle Simulator',
      subtitle: 'Observe how sun elevation and dust affect electrical power: P = P_max × sin(θ) × η',
      timeOfDay: 'Time of Day (Sun Angle)',
      cleanliness: 'Panel Cleanliness (Dust Layer)',
      powerOutput: 'Generated Electrical Power',
      bulbsLit: 'Village 15W LED Bulbs Powered',
      pumpStatus: '300W DC Solar Well Pump',
      running: '✅ RUNNING',
      insufficient: '⚠️ Insufficient Power',
      scienceNote:
        '💡 Solar panels generate maximum power at solar noon when sun rays hit perpendicular (90°). Accumulated agricultural dust and bird droppings can decrease output by over 40%, making periodic washing essential!',
    },
    hi: {
      title: 'सौर ऊर्जा एवं सूर्य कोण सिम्युलेटर',
      subtitle: 'देखें कि सूर्य का कोण और धूल विद्युत उत्पादन को कैसे प्रभावित करते हैं: P = P_max × sin(θ) × η',
      timeOfDay: 'दिन का समय (सूर्य का कोण)',
      cleanliness: 'पैनल की स्वच्छता (धूल की परत)',
      powerOutput: 'उत्पन्न विद्युत शक्ति',
      bulbsLit: 'गाँव के 15W LED बल्ब जल सकते हैं',
      pumpStatus: '300W सोलर कुआं पंप',
      running: '✅ चालू है',
      insufficient: '⚠️ अपर्याप्त बिजली',
      scienceNote:
        '💡 दोपहर 12 बजे जब सूर्य की किरणें लंबवत (90°) पड़ती हैं, तब अधिकतम बिजली बनती है। धूल जमने से उत्पादन 40% तक घट सकता है, इसलिए पैनलों को नियमित धोना आवश्यक है!',
    },
    kn: {
      title: 'ಸೌರ ಶಕ್ತಿ ಮತ್ತು ಸೂರ್ಯನ ಕೋನ ಸಿಮ್ಯುಲೇಟರ್',
      subtitle: 'ಸೂರ್ಯನ ಕೋನ ಮತ್ತು ಧೂಳು ವಿದ್ಯುತ್ ಉತ್ಪಾದನೆಯ ಮೇಲೆ ಹೇಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತವೆ ಎಂಬುದನ್ನು ನೋಡಿ',
      timeOfDay: 'ದಿನದ ಸಮಯ (ಸೂರ್ಯನ ಕೋನ)',
      cleanliness: 'ಪ್ಯಾನಲ್ ಸ್ವಚ್ಛತೆ (ಧೂಳಿನ ಪದರ)',
      powerOutput: 'ಉತ್ಪತ್ತಿಯಾದ ವಿದ್ಯುತ್ ಶಕ್ತಿ',
      bulbsLit: 'ಬೆಳಗಬಹುದಾದ 15W LED ಬಲ್ಬ್‌ಗಳು',
      pumpStatus: '300W ಸೋಲಾರ್ ಬಾವಿ ಪಂಪ್',
      running: '✅ ಚಾಲನೆಯಲ್ಲಿದೆ',
      insufficient: '⚠️ ಸಾಕಷ್ಟಿಲ್ಲದ ವಿದ್ಯುತ್',
      scienceNote:
        '💡 ಮಧ್ಯಾಹ್ನ ಸೂರ್ಯನ ಕಿರಣಗಳು ನೇರವಾಗಿ ಬಿದ್ದಾಗ ಗರಿಷ್ಠ ವಿದ್ಯುತ್ ಉತ್ಪತ್ತಿಯಾಗುತ್ತದೆ. ಧೂಳು ಕುಳಿತರೆ ಉತ್ಪಾದನೆ 40% ರಷ್ಟು ಕಡಿಮೆಯಾಗಬಹುದು, ಆದ್ದರಿಂದ ಪ್ಯಾನಲ್‌ಗಳನ್ನು ನಿಯಮಿತವಾಗಿ ತೊಳೆಯಬೇಕು!',
    },
  }[lang];

  // SVG Sun position along arc
  const sunX = 20 + normalizedTime * 160;
  const sunY = 90 - sinAngle * 75;

  return (
    <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 sm:p-5 space-y-4">
      <div className="border-b border-slate-800 pb-2">
        <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
          <span>☀️</span> {t.title}
        </h3>
        <p className="text-xs text-slate-400">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Controls */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>{t.timeOfDay}</span>
              <span className="text-amber-400 font-bold">
                {timeHour}:00 ({timeHour < 12 ? `${timeHour} AM` : timeHour === 12 ? '12 PM' : `${timeHour - 12} PM`})
              </span>
            </div>
            <input
              type="range"
              min="6"
              max="18"
              step="1"
              value={timeHour}
              onChange={(e) => setTimeHour(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>6 AM (Dawn)</span>
              <span>12 PM (Zenith)</span>
              <span>6 PM (Dusk)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>{t.cleanliness}</span>
              <span className="text-cyan-400 font-bold">{cleanlinessPercent}% Clean</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              step="5"
              value={cleanlinessPercent}
              onChange={(e) => setCleanlinessPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>30% (Heavy Dust)</span>
              <span>100% (Clean Glass)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">{t.pumpStatus}:</span>
            <span className={`font-bold ${canRunPump ? 'text-emerald-400' : 'text-amber-500'}`}>
              {canRunPump ? t.running : t.insufficient}
            </span>
          </div>
        </div>

        {/* Visualizer & Metrics */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="relative h-28 w-full flex items-center justify-center">
            <svg viewBox="0 0 200 110" className="w-full h-full max-w-[200px]">
              {/* Sky Arc */}
              <path d="M 20 90 A 80 75 0 0 1 180 90" fill="none" stroke="#334155" strokeDasharray="3 3" />

              {/* Sun */}
              <circle cx={sunX} cy={sunY} r="10" fill="#facc15" className="animate-pulse" />
              <line x1={sunX} y1={sunY} x2="100" y2="90" stroke="#fef08a" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />

              {/* Ground & Solar Panel Mount */}
              <line x1="10" y1="95" x2="190" y2="95" stroke="#475569" strokeWidth="1.5" />
              <line x1="100" y1="95" x2="100" y2="85" stroke="#94a3b8" strokeWidth="2" />

              {/* Solar Panel (angled at 20 deg tilt) */}
              <line
                x1="80"
                y1="82"
                x2="120"
                y2="90"
                stroke={cleanlinessPercent > 70 ? '#38bdf8' : '#78716c'}
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Power Indicator Glow */}
              <circle cx="150" cy="85" r={Math.min(14, actualPowerW / 35)} fill="#f59e0b" opacity="0.4" />
              <text x="150" y="88" textAnchor="middle" fill="#ffffff" fontSize="9">
                💡
              </text>
            </svg>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{t.powerOutput}:</span>
              <span className="text-base font-extrabold text-amber-400">{actualPowerW} Watts</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{t.bulbsLit}:</span>
              <span className="font-bold text-emerald-400">{ledBulbsPowered} bulbs</span>
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
