import React, { useState } from 'react';
import { Lang, ZoneId } from '../../learning/types';
import { ZONE_DEFINITIONS } from '../../learning/questionBank';
import {
  formatCompactNcertCitation,
  resolveCurriculumForEntity,
} from '../../learning/curriculum/curriculumMapper';

interface MitraHelperProps {
  lang: Lang;
  grade: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToZone?: (zoneId: ZoneId) => void;
}

export const MitraHelper: React.FC<MitraHelperProps> = ({
  lang,
  grade,
  isOpen,
  onClose,
}) => {
  const [selectedZone, setSelectedZone] = useState<ZoneId | null>(null);

  if (!isOpen) return null;

  const t = {
    en: {
      title: 'Mitra — Your Village STEM Guide',
      subtitle: `Grade ${grade} Living Laboratory Assistant`,
      intro:
        'Namaste! I am Mitra, your learning companion. In GaonLab, our village is not just a place to live—it is a living science laboratory! Walk to any structure to explore hands-on interactive simulations and solve real-world STEM challenges.',
      zonesTitle: 'Village Living Labs',
      viewExplanation: 'Select a structure to learn the science behind it:',
      close: 'Back to Village',
      tipTitle: `Grade ${grade} Focus Tip`,
      tips: {
        6: '💡 Look closely at simple machines like pulleys and levers at the well, and how water flows naturally from elevated tanks.',
        7: '💡 Pay attention to heat transfer (convection & radiation) at the village house and chemical acids/bases at the soil lab.',
        8: '💡 Notice force, pressure formulas (P = ρgh), electrical power (P = VI), and crop geometry calculations across the village.',
      }[grade as 6 | 7 | 8] || '💡 Connect everyday village activities with scientific principles!',
    },
    hi: {
      title: 'मित्रा — आपका गाँव विज्ञान मार्गदर्शक',
      subtitle: `कक्षा ${grade} सजीव प्रयोगशाला सहायक`,
      intro:
        'नमस्ते! मैं मित्रा हूँ, आपकी विज्ञान मार्गदर्शिका। गाँव लैब में हमारा गाँव सिर्फ रहने की जगह नहीं, बल्कि एक जीवंत विज्ञान प्रयोगशाला है! किसी भी संरचना के पास जाएँ और सिमुलेटर व व्यावहारिक चुनौतियों से विज्ञान सीखें।',
      zonesTitle: 'गाँव की प्रयोगशालाएं',
      viewExplanation: 'उसके पीछे का विज्ञान जानने के लिए किसी भी स्थान पर क्लिक करें:',
      close: 'गाँव में वापस जाएँ',
      tipTitle: `कक्षा ${grade} महत्वपूर्ण सुझाव`,
      tips: {
        6: '💡 कुएं पर घिरनी (पुली) जैसी सरल मशीनों और पानी की टंकी से नीचे बहते जल के गुरुत्वाकर्षण को ध्यान से देखें।',
        7: '💡 घर में ऊष्मा स्थानांतरण (संवहन व विकिरण) और मिट्टी प्रयोगशाला में अम्ल-क्षार (pH) के रासायनिक प्रयोगों को समझें।',
        8: '💡 द्रव दाब सूत्र (P = ρgh), सौर विद्युत शक्ति (P = VI), और खेत में पौधों की दूरी की ज्यामिति पर ध्यान दें।',
      }[grade as 6 | 7 | 8] || '💡 दैनिक जीवन की गतिविधियों को विज्ञान के सिद्धांतों से जोड़ें!',
    },
    kn: {
      title: 'ಮಿತ್ರ — ನಿಮ್ಮ ಹಳ್ಳಿಯ ವಿಜ್ಞಾನ ಮಾರ್ಗದರ್ಶಿ',
      subtitle: `ತರಗತಿ ${grade} ಜೀವಂತ ಪ್ರಯೋಗಾಲಯ ಸಹಾಯಕ`,
      intro:
        'ನಮಸ್ಕಾರ! ನಾನು ಮಿತ್ರ, ನಿಮ್ಮ ವಿಜ್ಞಾನ ಮಾರ್ಗದರ್ಶಿ. ಗಾಂವ್‌ಲ್ಯಾಬ್‌ನಲ್ಲಿ ನಮ್ಮ ಹಳ್ಳಿ ಒಂದು ಜೀವಂತ ವಿಜ್ಞಾನ ಪ್ರಯೋಗಾಲಯ! ಯಾವುದೇ ಸ್ಥಳಕ್ಕೆ ನಡೆದುಹೋಗಿ ಸಂವಾದಾತ್ಮಕ ಸಿಮ್ಯುಲೇಶನ್‌ಗಳನ್ನು ಅನ್ವೇಷಿಸಿ ಮತ್ತು STEM ಸವಾಲುಗಳನ್ನು ಪರಿಹರಿಸಿ.',
      zonesTitle: 'ಹಳ್ಳಿಯ ಜೀವಂತ ಲ್ಯಾಬ್‌ಗಳು',
      viewExplanation: 'ಅದರ ಹಿಂದಿನ ವಿಜ್ಞಾನವನ್ನು ತಿಳಿಯಲು ಯಾವುದೇ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
      close: 'ಹಳ್ಳಿಗೆ ಹಿಂತಿರುಗಿ',
      tipTitle: `ತರಗತಿ ${grade} ಸಲಹೆ`,
      tips: {
        6: '💡 ಬಾವಿಯ ಬಳಿ ಕಪ್ಪಿ (ಪುಲ್ಲಿ) ಯಂತಹ ಸರಳ ಯಂತ್ರಗಳು ಮತ್ತು ನೀರಿನ ಹರಿವನ್ನು ಗಮನಿಸಿ.',
        7: '💡 ಮನೆಯಲ್ಲಿ ಉಷ್ಣ ವರ್ಗಾವಣೆ ಮತ್ತು ಮಣ್ಣಿನ ಲ್ಯಾಬ್‌ನಲ್ಲಿ ಆಮ್ಲ-ಪ್ರತ್ಯಾಮ್ಲಗಳ (pH) ರಸಾಯನಶಾಸ್ತ್ರವನ್ನು ಗಮನಿಸಿ.',
        8: '💡 ನೀರಿನ ಒತ್ತಡದ ಸೂತ್ರ (P = ρgh), ಸೌರ ವಿದ್ಯುತ್ ಶಕ್ತಿ (P = VI) ಮತ್ತು ಬೆಳೆಗಳ ಅಂತರದ ರೇಖಾಗಣಿತವನ್ನು ಅನ್ವೇಷಿಸಿ.',
      }[grade as 6 | 7 | 8] || '💡 ದಿನನಿತ್ಯದ ಹಳ್ಳಿಯ ಚಟುವಟಿಕೆಗಳನ್ನು ವಿಜ್ಞಾನಕ್ಕೆ ಜೋಡಿಸಿ!',
    },
  }[lang];

  const zoneDetails: Record<ZoneId, { en: string; hi: string; kn: string }> = {
    house: {
      en: 'Teaches Passive Solar Architecture, convective air vents, high-albedo whitewash, and rainwater harvesting calculations.',
      hi: 'प्राकृतिक संवातन, संवहन धाराएं, चूने की पुताई से ऊष्मा परावर्तन, और वर्षा जल संचयन सिखाता है।',
      kn: 'ನೈಸರ್ಗಿಕ ಗಾಳಿ-ಬೆಳಕು, ಸಂವಹನ ಪ್ರವಾಹಗಳು, ಬಿಳಿ ಸುಣ್ಣದ ಉಷ್ಣ ಪ್ರತಿಫಲನ ಮತ್ತು ಮಳೆನೀರು ಕೊಯ್ಲು ಕಲಿಸುತ್ತದೆ.',
    },
    well: {
      en: 'Teaches Simple Machines, pulleys, mechanical advantage (MA = Load / Effort), work-energy conservation, and groundwater science.',
      hi: 'सरल मशीनें, घिरनी प्रणाली, यांत्रिक लाभ (MA = भार / प्रयास), और भूजल स्तर का विज्ञान सिखाता है।',
      kn: 'ಸರಳ ಯಂತ್ರಗಳು, ಕಪ್ಪಿ ವ್ಯವಸ್ಥೆ, ಯಾಂತ್ರಿಕ ಪ್ರಯೋಜನ (MA = Load / Effort) ಮತ್ತು ಅಂತರ್ಜಲ ವಿಜ್ಞಾನವನ್ನು ಕಲಿಸುತ್ತದೆ.',
    },
    tank: {
      en: 'Teaches Fluid Mechanics, hydrostatic pressure (P = ρgh), Torricelli’s outflow velocity, and gravity-fed piping networks.',
      hi: 'द्रवस्थैतिक दाब (P = ρgh), टॉरिसेली का बहिःस्राव नियम, और गुरुत्वाकर्षण आधारित पाइपलाइन नेटवर्क सिखाता है।',
      kn: 'ದ್ರವ ಯಂತ್ರಶಾಸ್ತ್ರ, ಹೈಡ್ರೋಸ್ಟಾಟಿಕ್ ಒತ್ತಡ (P = ρgh) ಮತ್ತು ಗುರುತ್ವಾಕರ್ಷಣೆಯ ಪೈಪ್‌ಲೈನ್ ಜಾಲವನ್ನು ಕಲಿಸುತ್ತದೆ.',
    },
    solar: {
      en: 'Teaches Photovoltaic effect, solar irradiance, sun elevation angles, dust attenuation, and Ohm’s electrical power laws (P = VI).',
      hi: 'प्रकाश-विद्युत प्रभाव, सूर्य किरण कोण, धूल का प्रभाव, और विद्युत शक्ति के नियम (P = VI) सिखाता है।',
      kn: 'ದ್ಯುತಿವಿದ್ಯುತ್ ಪರಿಣಾಮ, ಸೂರ್ಯನ ಕೋನ, ಧೂಳಿನ ಪ್ರಭಾವ ಮತ್ತು ವಿದ್ಯುತ್ ಶಕ್ತಿ ನಿಯಮಗಳನ್ನು (P = VI) ಕಲಿಸುತ್ತದೆ.',
    },
    soil: {
      en: 'Teaches Soil Chemistry, pH testing with indicators, neutralization with lime (CaCO₃) and gypsum, and crop nutrient uptake.',
      hi: 'मृदा रसायन, सूचकों से pH परीक्षण, चूने व जिप्सम से उदासीनीकरण, और फसल पोषक तत्वों का विज्ञान सिखाता है।',
      kn: 'ಮಣ್ಣಿನ ರಸಾಯನಶಾಸ್ತ್ರ, pH ಪರೀಕ್ಷೆ, ಸುಣ್ಣ ಮತ್ತು ಜಿಪ್ಸಮ್‌ನೊಂದಿಗೆ ತಟಸ್ಥೀಕರಣ ಮತ್ತು ಬೆಳೆ ಪೋಷಕಾಂಶಗಳನ್ನು ಕಲಿಸುತ್ತದೆ.',
    },
    farm: {
      en: 'Teaches Agricultural Geometry, row-to-row plant population ratios, evapotranspiration, and water conservation with drip irrigation.',
      hi: 'कृषि ज्यामिति, पौधों की दूरी व घनत्व अनुपात, वाष्पोत्सर्जन, और ड्रिप सिंचाई से जल संरक्षण सिखाता है।',
      kn: 'ಕೃಷಿ ರೇಖಾಗಣಿತ, ಸಸ್ಯಗಳ ಸಾಂದ್ರತೆಯ ಅನುಪಾತ ಮತ್ತು ಹನಿ ನೀರಾವರಿಯಿಂದ ನೀರಿನ ಉಳಿತಾಯವನ್ನು ಕಲಿಸುತ್ತದೆ.',
    },
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mitra Village STEM Guide"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-xl bg-slate-900 border border-emerald-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-950/80 to-slate-900 border-b border-emerald-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xl shadow-lg">
              🤖
            </div>
            <div>
              <h2 className="text-base font-bold text-emerald-300">{t.title}</h2>
              <p className="text-xs text-emerald-400/80">{t.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Welcome dialogue speech bubble */}
          <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/60 rounded-xl relative text-xs text-emerald-100 leading-relaxed">
            <span className="font-semibold text-emerald-300 block mb-1">Mitra:</span>
            {t.intro}
          </div>

          {/* Grade Tip */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200">
            <span className="font-bold text-amber-300 block mb-0.5">{t.tipTitle}:</span>
            {t.tips}
          </div>

          {/* Interactive Zone Directory */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.zonesTitle}</h3>
            <p className="text-[11px] text-slate-400">{t.viewExplanation}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(ZONE_DEFINITIONS) as ZoneId[]).map((zid) => {
                const z = ZONE_DEFINITIONS[zid];
                const isSelected = selectedZone === zid;
                return (
                  <button
                    key={zid}
                    type="button"
                    onClick={() => setSelectedZone(isSelected ? null : zid)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-2xl">{z.icon}</span>
                    <span className="text-xs font-bold text-center">{z.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Zone Detail Panel */}
            {selectedZone && (
              <div className="mt-3 p-3.5 bg-slate-800/90 border border-emerald-500/40 rounded-xl animate-fadeIn space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{ZONE_DEFINITIONS[selectedZone].icon}</span>
                  <h4 className="text-xs font-bold text-emerald-400">
                    {ZONE_DEFINITIONS[selectedZone].name}
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {zoneDetails[selectedZone][lang]}
                </p>
                {(() => {
                  const mapped = resolveCurriculumForEntity(selectedZone, grade);
                  if (!mapped) return null;
                  return (
                    <div className="pt-2 border-t border-slate-700/80 text-[11px] text-emerald-300">
                      <span className="font-bold">📖 NCERT ({mapped.textbook}): </span>
                      <span>{formatCompactNcertCitation(mapped)}</span>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
