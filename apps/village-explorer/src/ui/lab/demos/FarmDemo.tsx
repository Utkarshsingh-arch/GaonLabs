import React, { useState } from 'react';
import { Lang } from '../../../learning/types';

interface FarmDemoProps {
  lang: Lang;
}

type CropKey = 'ragi' | 'maize' | 'cotton';
type IrrigationKey = 'flood' | 'drip';

export const FarmDemo: React.FC<FarmDemoProps> = ({ lang }) => {
  const [areaAcres, setAreaAcres] = useState<number>(1.0); // 0.5 to 3.0 acres
  const [crop, setCrop] = useState<CropKey>('ragi');
  const [irrigation, setIrrigation] = useState<IrrigationKey>('drip');

  const areaM2 = areaAcres * 4047; // 1 acre = 4047 m²

  const cropData: Record<CropKey, { name: string; rowM: number; plantM: number; baseWaterL: number }> = {
    ragi: { name: 'Ragi / Finger Millet', rowM: 0.3, plantM: 0.1, baseWaterL: 350 }, // 350 mm water
    maize: { name: 'Maize / Corn', rowM: 0.6, plantM: 0.2, baseWaterL: 500 }, // 500 mm water
    cotton: { name: 'Cotton', rowM: 0.9, plantM: 0.6, baseWaterL: 700 }, // 700 mm water
  };

  const selectedCrop = cropData[crop];
  const plantDensityPerM2 = 1 / (selectedCrop.rowM * selectedCrop.plantM);
  const totalPlants = Math.round(areaM2 * plantDensityPerM2);

  const waterEfficiency = irrigation === 'drip' ? 0.9 : 0.45;
  // Water needed in litres = Area * depth / efficiency
  const totalWaterLitres = Math.round((areaM2 * selectedCrop.baseWaterL) / waterEfficiency);
  const floodWaterLitres = Math.round((areaM2 * selectedCrop.baseWaterL) / 0.45);
  const waterSavedLitres = irrigation === 'drip' ? floodWaterLitres - totalWaterLitres : 0;

  const t = {
    en: {
      title: 'Agricultural Geometry & Irrigation Simulator',
      subtitle: 'Calculate plant population from row spacing and water savings from drip irrigation',
      farmArea: 'Cultivated Land Area',
      cropSelection: 'Crop Variety',
      ragi: '🌾 Ragi / Millet (30cm × 10cm)',
      maize: '🌽 Maize (60cm × 20cm)',
      cotton: '☁️ Cotton (90cm × 60cm)',
      irrigationMethod: 'Irrigation Method',
      flood: 'Traditional Flood (45% efficiency)',
      drip: 'Drip Irrigation (90% efficiency)',
      plantPopulationTitle: 'Total Plant Population',
      waterConsumptionTitle: 'Seasonal Water Required',
      waterSavedTitle: 'Water Saved by Drip',
      scienceNote:
        '💡 Proper row-to-row spacing prevents plants from competing for sunlight, root oxygen, and soil minerals. Drip irrigation delivers water directly to root zones, eliminating runoff and evaporation waste!',
    },
    hi: {
      title: 'कृषि ज्यामिति एवं सिंचाई सिम्युलेटर',
      subtitle: 'पौधों की दूरी से कुल पौध संख्या और ड्रिप सिंचाई से पानी की बचत की गणना करें',
      farmArea: 'खेत का क्षेत्रफल',
      cropSelection: 'फसल का प्रकार',
      ragi: '🌾 रागी / बाजरा (30cm × 10cm)',
      maize: '🌽 मक्का (60cm × 20cm)',
      cotton: '☁️ कपास (90cm × 60cm)',
      irrigationMethod: 'सिंचाई की विधि',
      flood: 'पारंपरिक नाली/बहाव सिंचाई (45% दक्षता)',
      drip: 'टपक/ड्रिप सिंचाई (90% दक्षता)',
      plantPopulationTitle: 'कुल पौधों की संख्या',
      waterConsumptionTitle: 'आवश्यक कुल सिंचाई जल',
      waterSavedTitle: 'ड्रिप से पानी की बचत',
      scienceNote:
        '💡 पौधों के बीच उचित दूरी धूप और मिट्टी के पोषक तत्वों की प्रतिस्पर्धा रोकती है। ड्रिप सिंचाई सीधे जड़ों तक पानी पहुँचाती है, जिससे 50% तक पानी बचता है!',
    },
    kn: {
      title: 'ಕೃಷಿ ರೇಖಾಗಣಿತ ಮತ್ತು ನೀರಾವರಿ ಸಿಮ್ಯುಲೇಟರ್',
      subtitle: 'ಸಾಲಿನ ಅಂತರದಿಂದ ಸಸ್ಯಗಳ ಸಂಖ್ಯೆ ಮತ್ತು ಹನಿ ನೀರಾವರಿಯಿಂದ ನೀರಿನ ಉಳಿತಾಯವನ್ನು ಲೆಕ್ಕ ಹಾಕಿ',
      farmArea: 'ಕೃಷಿ ಭೂಮಿಯ ವಿಸ್ತೀರ್ಣ',
      cropSelection: 'ಬೆಳೆಯ ವಿಧ',
      ragi: '🌾 ರಾಗಿ (30cm × 10cm)',
      maize: '🌽 ಜೋಳ (60cm × 20cm)',
      cotton: '☁️ ಹತ್ತಿ (90cm × 60cm)',
      irrigationMethod: 'ನೀರಾವರಿ ವಿಧಾನ',
      flood: 'ಸಾಂಪ್ರದಾಯಿಕ ಕಾಲುವೆ ನೀರಾವರಿ (45%)',
      drip: 'ಹನಿ ನೀರಾವರಿ (90%)',
      plantPopulationTitle: 'ಒಟ್ಟು ಸಸ್ಯಗಳ ಸಂಖ್ಯೆ',
      waterConsumptionTitle: 'ಅಗತ್ಯವಿರುವ ನೀರಿನ ಪ್ರಮಾಣ',
      waterSavedTitle: 'ಉಳಿತಾಯವಾದ ನೀರು',
      scienceNote:
        '💡 ಬೆಳೆಗಳ ನಡುವೆ ಸೂಕ್ತ ಅಂತರವಿದ್ದರೆ ಸೂರ್ಯನ ಬೆಳಕು ಚೆನ್ನಾಗಿ ಸಿಗುತ್ತದೆ. ಹನಿ ನೀರಾವರಿಯು ನೇರವಾಗಿ ಬೇರುಗಳಿಗೆ ನೀರನ್ನು ಒದಗಿಸಿ ನೀರಿನ ವ್ಯರ್ಥವನ್ನು ತಡೆಯುತ್ತದೆ!',
    },
  }[lang];

  return (
    <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 sm:p-5 space-y-4">
      <div className="border-b border-slate-800 pb-2">
        <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
          <span>🌾</span> {t.title}
        </h3>
        <p className="text-xs text-slate-400">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Controls */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>{t.farmArea}</span>
              <span className="text-amber-400 font-bold">
                {areaAcres} Acres ({Math.round(areaM2).toLocaleString()} m²)
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.5"
              value={areaAcres}
              onChange={(e) => setAreaAcres(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.5 Acre</span>
              <span>3.0 Acres</span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 font-medium mb-1">{t.cropSelection}</label>
            <div className="space-y-1 text-xs">
              {(['ragi', 'maize', 'cotton'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCrop(c)}
                  className={`w-full py-1.5 px-3 rounded border text-left transition-all ${
                    crop === c
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c === 'ragi' ? t.ragi : c === 'maize' ? t.maize : t.cotton}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 font-medium mb-1">{t.irrigationMethod}</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['flood', 'drip'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setIrrigation(method)}
                  className={`py-1.5 px-2 rounded border text-center transition-all ${
                    irrigation === method
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {method === 'flood' ? t.flood : t.drip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visualizer & Agricultural Metrics */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="relative h-28 w-full flex items-center justify-center">
            <svg viewBox="0 0 200 110" className="w-full h-full max-w-[200px]">
              {/* Field Soil Bed */}
              <rect x="15" y="10" width="170" height="90" rx="4" fill="#3f2e1e" stroke="#785c37" strokeWidth="2" />

              {/* Crop Rows */}
              {[25, 45, 65, 85].map((y) => (
                <g key={y}>
                  <line x1="25" y1={y} x2="175" y2={y} stroke="#543c25" strokeWidth="3" />
                  {/* Drip Irrigation Lateral Pipe */}
                  {irrigation === 'drip' && (
                    <line x1="25" y1={y} x2="175" y2={y} stroke="#0284c7" strokeWidth="1" strokeDasharray="3 3" />
                  )}

                  {/* Seedlings */}
                  {[35, 60, 85, 110, 135, 160].map((x) => (
                    <g key={x}>
                      <circle cx={x} cy={y} r="2.5" fill="#10b981" />
                      {/* Drip droplets */}
                      {irrigation === 'drip' && (
                        <circle cx={x + 3} cy={y + 3} r="1" fill="#38bdf8" className="animate-ping" />
                      )}
                    </g>
                  ))}
                </g>
              ))}
            </svg>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{t.plantPopulationTitle}:</span>
              <span className="text-base font-extrabold text-amber-400">
                {totalPlants.toLocaleString()} plants
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{t.waterConsumptionTitle}:</span>
              <span className="font-bold text-cyan-400">{Math.round(totalWaterLitres / 1000).toLocaleString()} kL</span>
            </div>
            {irrigation === 'drip' && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{t.waterSavedTitle}:</span>
                <span className="font-bold text-emerald-400">
                  +{Math.round(waterSavedLitres / 1000).toLocaleString()} kL saved (50%)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/60 text-[11px] text-slate-300 leading-relaxed">
        {t.scienceNote}
      </div>
    </div>
  );
};
