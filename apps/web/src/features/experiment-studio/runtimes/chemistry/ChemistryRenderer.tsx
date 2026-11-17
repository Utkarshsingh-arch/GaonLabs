import React, { useState } from 'react';
import { ApprovedMaterial, VirtualApparatus } from '@gaonlab/shared-types';
import { ChemistryEngine } from './ChemistryEngine';
import { Droplet, RotateCcw, Eye, Sparkles, CheckCircle2, Info } from 'lucide-react';

interface ChemistryRendererProps {
  materials: ApprovedMaterial[];
  apparatus: VirtualApparatus[];
  language?: string;
  onRecordObservation?: (observation: {
    solutionId: string;
    solutionName: string;
    indicatorId: string;
    indicatorName: string;
    drops: number;
    ph: number;
    colorObserved: string;
    outcomeSummary: string;
  }) => void;
}

export const ChemistryRenderer: React.FC<ChemistryRendererProps> = ({
  materials,
  apparatus: _apparatus,
  language = 'en',
  onRecordObservation,
}) => {
  const solutions = materials.filter((m) => m.type === 'SOLUTION');
  const indicators = materials.filter((m) => m.type === 'INDICATOR');

  const [selectedSolutionId, setSelectedSolutionId] = useState<string>(
    solutions[0]?.id || 'LEMON_JUICE'
  );
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>(
    indicators[0]?.id || 'TURMERIC'
  );
  const [indicatorDrops, setIndicatorDrops] = useState<number>(0);
  const [isDropping, setIsDropping] = useState<boolean>(false);
  const [paperDipped, setPaperDipped] = useState<boolean>(false);
  const [showPhMeter, setShowPhMeter] = useState<boolean>(true);
  const [lastObservedNote, setLastObservedNote] = useState<string | null>(null);

  const currentSolution = solutions.find((s) => s.id === selectedSolutionId) || solutions[0];
  const currentIndicator = indicators.find((i) => i.id === selectedIndicatorId) || indicators[0];

  const currentPh = currentSolution?.properties.ph ?? 7.0;
  const isAcid = currentPh < 7.0;
  const isBase = currentPh > 7.0;

  const isPaperIndicator = ChemistryEngine.getIndicatorForm(selectedIndicatorId) === 'PAPER_STRIP';

  const beakerLiquidColor = ChemistryEngine.getBlendedBeakerColor(
    currentSolution?.colorHex || '#E0F2FE',
    selectedIndicatorId,
    indicatorDrops,
    currentPh
  );

  const stripColor = paperDipped
    ? ChemistryEngine.getIndicatorColor(selectedIndicatorId, currentPh)
    : currentIndicator?.colorHex || '#FBBF24';

  const handleAddDrop = () => {
    if (isDropping || isPaperIndicator) return;
    setIsDropping(true);
    setTimeout(() => {
      setIndicatorDrops((prev) => Math.min(prev + 1, 8));
      setIsDropping(false);
    }, 450);
  };

  const handleDipPaper = () => {
    if (!isPaperIndicator) return;
    setPaperDipped(true);
  };

  const handleReset = () => {
    setIndicatorDrops(0);
    setPaperDipped(false);
    setLastObservedNote(null);
  };

  const handleSaveObservation = () => {
    const details = ChemistryEngine.getObservationDetails(
      selectedIndicatorId,
      currentPh,
      currentSolution.name
    );

    const outcomeText = `${currentSolution.name} tested with ${currentIndicator.name}: ${details.description} (Ref pH ${currentPh}, ${details.classification})`;

    setLastObservedNote(outcomeText);

    if (onRecordObservation) {
      onRecordObservation({
        solutionId: currentSolution.id,
        solutionName: currentSolution.name,
        indicatorId: currentIndicator.id,
        indicatorName: currentIndicator.name,
        drops: indicatorDrops,
        ph: currentPh,
        colorObserved: isPaperIndicator ? stripColor : details.colorHex,
        outcomeSummary: outcomeText,
      });
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl flex flex-col gap-6">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-bold text-sm tracking-wide text-slate-100 uppercase">
              Virtual Chemistry Bench — Sample Testing Lab
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
              Sample-Testing Model v1.1
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'kn'
              ? 'ಪ್ರಮಾಣಿತ ಉಲ್ಲೇಖ pH ಹೊಂದಿರುವ ಮಾದರಿಗಳನ್ನು ಆಯ್ದು ಸೂಚಕ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಪರೀಕ್ಷಿಸಿ.'
              : 'Test known sample solutions against calibrated indicators. Demonstrates qualitative color transitions.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPhMeter(!showPhMeter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              showPhMeter
                ? 'bg-brand-600 text-white border-brand-500'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            {showPhMeter ? 'Ref pH Probe: ON' : 'Ref pH Probe: OFF'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Lab</span>
          </button>
        </div>
      </div>

      {/* Model Scope Educational Disclaimer Banner */}
      <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700 flex items-start gap-2.5 text-xs text-slate-300">
        <Info className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-white">Scientific Scope Note: </span>
          This experiment uses a sample-testing model where each sample possesses a representative educational reference pH (standard 25°C dilute baseline). Indicator addition demonstrates characteristic chemical color responses rather than calculating the pH of arbitrary reagent mixtures.
        </div>
      </div>

      {/* Main Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Solution & Indicator Selectors */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Solution Selector */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                1. Select Known Sample
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Ref pH</span>
            </div>
            <div className="space-y-1.5">
              {solutions.map((s) => {
                const isSelected = s.id === selectedSolutionId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelectedSolutionId(s.id);
                      setIndicatorDrops(0);
                      setPaperDipped(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between border ${
                      isSelected
                        ? 'bg-brand-600/30 border-brand-500 text-white font-semibold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <span>{language === 'kn' && s.nameInLanguage?.kn ? s.nameInLanguage.kn : s.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      pH {s.properties.ph}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Indicator Selector */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              2. Select Indicator
            </label>
            <div className="space-y-1.5">
              {indicators.map((ind) => {
                const isSelected = ind.id === selectedIndicatorId;
                const form = ChemistryEngine.getIndicatorForm(ind.id);
                const isPaper = form === 'PAPER_STRIP';

                return (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => {
                      setSelectedIndicatorId(ind.id);
                      setIndicatorDrops(0);
                      setPaperDipped(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between border ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-semibold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: ind.colorHex || '#FBBF24' }}
                      />
                      <span>
                        {language === 'kn' && ind.nameInLanguage?.kn ? ind.nameInLanguage.kn : ind.name}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400">
                      {isPaper ? 'Paper Strip' : 'Liquid Reagent'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Canvas: Interactive Beaker, Dropper, Strips */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 rounded-3xl p-6 border border-slate-800 min-h-[420px] relative overflow-hidden">
          {/* Subtle Lab Table Top Reflection */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-800/40 to-transparent pointer-events-none" />

          {/* Top Apparatus Actions */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 z-10">
            <div className="flex items-center gap-2">
              {/* Liquid Dropper Button */}
              {!isPaperIndicator ? (
                <button
                  type="button"
                  onClick={handleAddDrop}
                  disabled={isDropping}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition"
                >
                  <Droplet className="w-4 h-4 fill-slate-950" />
                  <span>Add Indicator Drop ({indicatorDrops})</span>
                </button>
              ) : (
                <div className="text-[11px] text-slate-500 font-mono px-3 py-2 bg-slate-900 rounded-xl border border-slate-800">
                  Indicator Paper: Dip strip below
                </div>
              )}

              {/* Litmus Paper Strip Button */}
              {isPaperIndicator ? (
                <button
                  type="button"
                  onClick={handleDipPaper}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold rounded-xl text-xs border border-blue-500 transition shadow-lg"
                >
                  <Eye className="w-4 h-4 text-white" />
                  <span>Dip Indicator Paper Strip</span>
                </button>
              ) : (
                <div className="text-[11px] text-slate-500 font-mono px-3 py-2 bg-slate-900 rounded-xl border border-slate-800">
                  Liquid Reagent: Add drops with pipette
                </div>
              )}
            </div>

            {/* pH Meter HUD */}
            {showPhMeter && (
              <div className="bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-2xl flex flex-col items-end shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                    Sample Reference pH
                  </span>
                  <span
                    className={`text-lg font-black font-mono ${
                      isAcid ? 'text-amber-400' : isBase ? 'text-blue-400' : 'text-emerald-400'
                    }`}
                  >
                    {currentPh.toFixed(1)}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      isAcid
                        ? 'bg-amber-500/20 text-amber-300'
                        : isBase
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {isAcid ? 'ACIDIC' : isBase ? 'BASIC' : 'NEUTRAL'}
                  </span>
                </div>
                <span className="text-[8px] text-slate-500 font-mono">Standard 25°C dilute baseline</span>
              </div>
            )}
          </div>

          {/* Beaker & Simulation Visual Stage */}
          <div className="relative w-72 h-64 flex items-end justify-center mb-6">
            {/* Dropper Pipette Visual (Only for liquid reagents) */}
            {!isPaperIndicator && (
              <div
                className={`absolute top-0 flex flex-col items-center transition-transform duration-300 ${
                  isDropping ? 'translate-y-4' : 'translate-y-0'
                }`}
              >
                <div className="w-6 h-12 bg-slate-700 rounded-t-full border border-slate-500" />
                <div className="w-2.5 h-16 bg-white/30 backdrop-blur-sm border-x border-slate-400 relative">
                  <div
                    className="absolute inset-x-0 bottom-0 h-10 transition-colors"
                    style={{ backgroundColor: currentIndicator.colorHex || '#FBBF24' }}
                  />
                </div>
                <div className="w-1.5 h-3 bg-slate-400 rounded-b-full" />

                {/* Falling Droplet Animation */}
                {isDropping && (
                  <div
                    className="w-2.5 h-3.5 rounded-full animate-bounce shadow-md"
                    style={{
                      backgroundColor: currentIndicator.colorHex || '#FBBF24',
                      animationDuration: '0.4s',
                    }}
                  />
                )}
              </div>
            )}

            {/* Indicator Paper Strip (Rendered ONLY when paper indicator is selected) */}
            {isPaperIndicator && (
              <div
                className={`absolute top-4 right-10 w-6 h-40 rounded-t border border-white/20 shadow-lg flex flex-col justify-end transition-all duration-500 ${
                  paperDipped ? 'translate-y-16 scale-105' : 'translate-y-0'
                }`}
                style={{
                  backgroundColor: currentIndicator.colorHex || '#EF4444',
                }}
              >
                {/* Dipped Submerged Portion Color */}
                <div
                  className="w-full h-20 rounded-b transition-colors duration-500 border-t border-black/10"
                  style={{
                    backgroundColor: stripColor,
                  }}
                />
                <span className="text-[8px] font-mono text-center font-bold text-black/60 pb-1 rotate-90 origin-bottom">
                  PAPER STRIP
                </span>
              </div>
            )}

            {/* Borosilicate Glass Beaker containing the test sample */}
            <div className="relative w-56 h-48 border-4 border-t-0 border-slate-400/80 rounded-b-3xl bg-white/5 backdrop-blur-xs flex items-end justify-center p-2 shadow-2xl overflow-hidden">
              {/* Measurement Volume Lines */}
              <div className="absolute left-2 inset-y-6 flex flex-col justify-between text-[9px] font-mono text-slate-400 select-none">
                <span>— 50ml</span>
                <span>— 40ml</span>
                <span>— 30ml</span>
                <span>— 20ml</span>
                <span>— 10ml</span>
              </div>

              {/* Solution Liquid */}
              <div
                className="w-full h-32 rounded-b-2xl transition-colors duration-700 relative overflow-hidden flex items-center justify-center shadow-inner"
                style={{ backgroundColor: beakerLiquidColor }}
              >
                {/* Surface Meniscus Wave */}
                <div className="absolute inset-x-0 top-0 h-2 bg-white/25 rounded-full blur-[1px]" />
                <span className="text-[11px] font-bold text-slate-900/80 font-mono tracking-tight select-none">
                  {currentSolution.name}
                </span>
              </div>
            </div>
          </div>

          {/* Observation Logger Footer */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800 z-10">
            <div className="text-xs text-slate-400">
              {lastObservedNote ? (
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lastObservedNote}</span>
                </span>
              ) : (
                <span>{isPaperIndicator ? 'Click Dip Indicator Paper Strip' : 'Add drops to test sample'}, then record observation</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleSaveObservation}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg shadow-brand-600/30 transition shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Record Observation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
