import React, { useState } from 'react';
import { Lang } from '../../../learning/types';

interface WellDemoProps {
  lang: Lang;
}

type PulleyType = 'fixed' | 'movable' | 'blockTackle';

export const WellDemo: React.FC<WellDemoProps> = ({ lang }) => {
  const [loadWeightKg, setLoadWeightKg] = useState<number>(15); // kg (water + bucket)
  const [pulleyType, setPulleyType] = useState<PulleyType>('fixed');

  const g = 9.8; // m/s²
  const loadForceN = Math.round(loadWeightKg * g); // Newtons

  const mechanicalAdvantage: Record<PulleyType, number> = {
    fixed: 1,
    movable: 2,
    blockTackle: 3,
  };

  const ma = mechanicalAdvantage[pulleyType];
  const effortRequiredN = Math.round(loadForceN / ma);
  const ropeDistanceRatio = ma; // To lift 1 meter, learner pulls 'ma' meters of rope

  const t = {
    en: {
      title: 'Pulley & Mechanical Advantage Simulator',
      subtitle: 'Discover how simple machines reduce effort: MA = Load / Effort',
      loadTitle: 'Water Bucket Weight (Load)',
      pulleySystem: 'Pulley Configuration',
      fixed: 'Single Fixed Pulley (MA = 1)',
      movable: 'Movable Pulley (MA = 2)',
      compound: 'Block & Tackle (MA = 3)',
      effortTitle: 'Human Effort Required',
      ropeLengthTitle: 'Rope Distance Pulled',
      ropeDistance: `Pulls ${ropeDistanceRatio}m rope for 1m lift`,
      scienceNote:
        ma === 1
          ? '💡 A single fixed pulley changes direction only (downward pull uses body weight), but requires equal force (MA = 1).'
          : `💡 With MA = ${ma}, the force is reduced by ${ma}×! Tradeoff: You must pull ${ma}× more rope distance (Work = Force × Distance).`,
    },
    hi: {
      title: 'घिरनी और यांत्रिक लाभ सिम्युलेटर',
      subtitle: 'समझें कि सरल मशीनें बल को कैसे कम करती हैं: यांत्रिक लाभ = भार / प्रयास बल',
      loadTitle: 'पानी की बाल्टी का भार (Load)',
      pulleySystem: 'घिरनी प्रणाली',
      fixed: 'एकल स्थिर घिरनी (MA = 1)',
      movable: 'चल घिरनी (MA = 2)',
      compound: 'ब्लॉक और टैकल (MA = 3)',
      effortTitle: 'आवश्यक मानव प्रयास (Effort)',
      ropeLengthTitle: 'खींची गई रस्सी की लंबाई',
      ropeDistance: `1 मीटर उठाने के लिए ${ropeDistanceRatio} मीटर खींचना होगा`,
      scienceNote:
        ma === 1
          ? '💡 स्थिर घिरनी केवल बल की दिशा बदलती है (नीचे खींचने पर शरीर का वजन सहायक होता है), भार कम नहीं होता।'
          : `💡 यांत्रिक लाभ ${ma} होने पर आवश्यक बल ${ma} गुना कम हो जाता है! पर रस्सी ${ma} गुना अधिक खींचनी पड़ती है (कार्य = बल × दूरी)।`,
    },
    kn: {
      title: 'ಕಪ್ಪಿ ಮತ್ತು ಯಾಂತ್ರಿಕ ಪ್ರಯೋಜನ ಸಿಮ್ಯುಲೇಟರ್',
      subtitle: 'ಸರಳ ಯಂತ್ರಗಳು ಶ್ರಮವನ್ನು ಹೇಗೆ ಕಡಿಮೆ ಮಾಡುತ್ತವೆ ಎಂಬುದನ್ನು ತಿಳಿಯಿರಿ: MA = ಲೋಡ್ / ಶ್ರಮ',
      loadTitle: 'ನೀರಿನ ಬಕೆಟ್ ತೂಕ (Load)',
      pulleySystem: 'ಕಪ್ಪಿ ವ್ಯವಸ್ಥೆ',
      fixed: 'ಸ್ಥಿರ ಕಪ್ಪಿ (MA = 1)',
      movable: 'ಚಲಿಸುವ ಕಪ್ಪಿ (MA = 2)',
      compound: 'ಬ್ಲಾಕ್ ಮತ್ತು ಟ್ಯಾಕಲ್ (MA = 3)',
      effortTitle: 'ಅಗತ್ಯ ಶ್ರಮ (Effort)',
      ropeLengthTitle: 'ಎಳೆದ ಹಗ್ಗದ ಉದ್ದ',
      ropeDistance: `1 ಮೀಟರ್ ಎತ್ತಲು ${ropeDistanceRatio} ಮೀಟರ್ ಹಗ್ಗ ಎಳೆಯಬೇಕು`,
      scienceNote:
        ma === 1
          ? '💡 ಸ್ಥಿರ ಕಪ್ಪಿಯು ದಿಕ್ಕನ್ನು ಮಾತ್ರ ಬದಲಾಯಿಸುತ್ತದೆ (ಕೆಳಕ್ಕೆ ಎಳೆಯುವುದು ಸುಲಭ), ಆದರೆ ಬಲ ಸಮಾನವಾಗಿರುತ್ತದೆ (MA = 1).'
          : `💡 MA = ${ma} ಇದ್ದಾಗ, ಅಗತ್ಯವಿರುವ ಬಲವು ${ma} ಪಟ್ಟು ಕಡಿಮೆಯಾಗುತ್ತದೆ! ಆದರೆ ${ma} ಪಟ್ಟು ಹೆಚ್ಚು ಹಗ್ಗವನ್ನು ಎಳೆಯಬೇಕು.`,
    },
  }[lang];

  return (
    <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 sm:p-5 space-y-4">
      <div className="border-b border-slate-800 pb-2">
        <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
          <span>⚙️</span> {t.title}
        </h3>
        <p className="text-xs text-slate-400">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Controls */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>{t.loadTitle}</span>
              <span className="text-amber-400 font-bold">
                {loadWeightKg} kg ({loadForceN} N)
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={loadWeightKg}
              onChange={(e) => setLoadWeightKg(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>5 kg (Light)</span>
              <span>30 kg (Heavy)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 font-medium mb-1">{t.pulleySystem}</label>
            <div className="space-y-1.5 text-xs">
              {(['fixed', 'movable', 'blockTackle'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPulleyType(type)}
                  className={`w-full py-2 px-3 rounded border text-left transition-all flex items-center justify-between ${
                    pulleyType === type
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>
                    {type === 'fixed' ? t.fixed : type === 'movable' ? t.movable : t.compound}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                    MA = {mechanicalAdvantage[type]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visualizer & Physics Metrics */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          {/* Animated SVG Diagram of Pulley Rig */}
          <div className="relative h-28 w-full flex items-center justify-center">
            <svg viewBox="0 0 200 110" className="w-full h-full max-w-[200px]">
              {/* Overhead beam */}
              <rect x="20" y="5" width="160" height="10" fill="#64748b" rx="2" />
              {/* Pulley 1 mount */}
              <line x1="80" y1="15" x2="80" y2="30" stroke="#94a3b8" strokeWidth="2" />
              {/* Top Pulley wheel */}
              <circle cx="80" cy="35" r="14" fill="#334155" stroke="#f59e0b" strokeWidth="3" />
              <circle cx="80" cy="35" r="3" fill="#f8fafc" />

              {pulleyType === 'fixed' && (
                <>
                  {/* Rope */}
                  <line x1="66" y1="35" x2="66" y2="75" stroke="#fde047" strokeWidth="2" />
                  <line x1="94" y1="35" x2="130" y2="85" stroke="#fde047" strokeWidth="2" />
                  {/* Bucket */}
                  <rect x="56" y="75" width="20" height="22" rx="2" fill="#0284c7" />
                  <text x="66" y="90" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                    {loadWeightKg}kg
                  </text>
                  {/* Effort Pull Arrow */}
                  <line x1="130" y1="85" x2="140" y2="100" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#arrow)" />
                </>
              )}

              {pulleyType === 'movable' && (
                <>
                  {/* Anchor to beam */}
                  <line x1="66" y1="15" x2="66" y2="65" stroke="#fde047" strokeWidth="2" />
                  {/* Movable pulley */}
                  <circle cx="75" cy="65" r="12" fill="#334155" stroke="#38bdf8" strokeWidth="3" />
                  <circle cx="75" cy="65" r="2.5" fill="#f8fafc" />
                  {/* Bucket hanging from movable pulley */}
                  <line x1="75" y1="77" x2="75" y2="84" stroke="#94a3b8" strokeWidth="2" />
                  <rect x="65" y="84" width="20" height="20" rx="2" fill="#0284c7" />
                  <text x="75" y="97" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                    {loadWeightKg}kg
                  </text>
                  {/* Rope looping to top pulley */}
                  <line x1="84" y1="65" x2="94" y2="35" stroke="#fde047" strokeWidth="2" />
                  <line x1="94" y1="35" x2="135" y2="80" stroke="#fde047" strokeWidth="2" />
                </>
              )}

              {pulleyType === 'blockTackle' && (
                <>
                  {/* Extra pulley wheel */}
                  <circle cx="100" cy="35" r="12" fill="#334155" stroke="#10b981" strokeWidth="3" />
                  <circle cx="85" cy="65" r="12" fill="#334155" stroke="#38bdf8" strokeWidth="3" />
                  {/* Ropes looping */}
                  <line x1="75" y1="35" x2="75" y2="65" stroke="#fde047" strokeWidth="1.5" />
                  <line x1="95" y1="65" x2="100" y2="35" stroke="#fde047" strokeWidth="1.5" />
                  <line x1="112" y1="35" x2="145" y2="80" stroke="#fde047" strokeWidth="2" />
                  {/* Bucket */}
                  <rect x="75" y="84" width="20" height="20" rx="2" fill="#0284c7" />
                  <text x="85" y="97" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                    {loadWeightKg}kg
                  </text>
                </>
              )}
            </svg>
          </div>

          {/* Effort Metric Cards */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{t.effortTitle}:</span>
              <span className="text-base font-extrabold text-amber-400">
                {effortRequiredN} N (~{Math.round(effortRequiredN / 9.8)} kg force)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{t.ropeLengthTitle}:</span>
              <span className="font-bold text-cyan-400">{t.ropeDistance}</span>
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
