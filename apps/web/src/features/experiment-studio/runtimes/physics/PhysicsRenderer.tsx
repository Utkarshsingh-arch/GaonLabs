import React, { useState, useEffect, useRef } from 'react';
import { ApprovedMaterial, VirtualApparatus } from '@gaonlab/shared-types';
import { PhysicsEngine, PhysicsSimulationState } from './PhysicsEngine';
import { Play, RotateCcw, Sparkles, CheckCircle2, Gauge, Activity, AlertCircle, Scale } from 'lucide-react';

interface PhysicsRendererProps {
  materials: ApprovedMaterial[];
  apparatus: VirtualApparatus[];
  language?: string;
  onRecordObservation?: (observation: {
    surfaceId: string;
    surfaceName: string;
    mu_k: number;
    massKg: number;
    pushForceN: number;
    stoppingDistanceM: number;
    frictionForceN: number;
    normalForceN: number;
    outcomeSummary: string;
  }) => void;
}

interface CompletedTrial {
  id: string;
  trialNum: number;
  massKg: number;
  surfaceName: string;
  mode: 'CONSTANT_VELOCITY' | 'APPLIED_FORCE';
  v0: number;
  pushForceN: number;
  stoppingDistanceM: number;
  timeToStopS: number;
}

export const PhysicsRenderer: React.FC<PhysicsRendererProps> = ({
  materials,
  apparatus: _apparatus,
  language = 'en',
  onRecordObservation,
}) => {
  const surfaces = materials.filter((m) => m.type === 'SURFACE');

  const [selectedSurfaceId, setSelectedSurfaceId] = useState<string>(
    surfaces.find((s) => s.id === 'WOOD_SMOOTH')?.id || surfaces[0]?.id || 'WOOD_SMOOTH'
  );

  // Investigation Mode
  const [mode, setMode] = useState<'CONSTANT_VELOCITY' | 'APPLIED_FORCE'>('CONSTANT_VELOCITY');

  // Physical Controls
  const [massKg, setMassKg] = useState<number>(2.0);
  const [initialVelocityMps, setInitialVelocityMps] = useState<number>(4.0);
  const [pushForceN, setPushForceN] = useState<number>(25.0);

  // Animation & simulation state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [animProgress, setAnimProgress] = useState<number>(0);
  const [currentDistanceM, setCurrentDistanceM] = useState<number>(0);
  const [currentVelocityMps, setCurrentVelocityMps] = useState<number>(0);
  const [lastObservedNote, setLastObservedNote] = useState<string | null>(null);
  const [trialHistory, setTrialHistory] = useState<CompletedTrial[]>([]);

  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const currentSurface =
    surfaces.find((s) => s.id === selectedSurfaceId) || surfaces[0];
  const mu_k = currentSurface?.properties.mu_k ?? 0.3;
  const mu_s = currentSurface?.properties.mu_s ?? Math.round(mu_k * 1.33 * 100) / 100;

  const mechanics: PhysicsSimulationState = PhysicsEngine.calculateMechanics(
    mu_k,
    massKg,
    {
      mu_s,
      mode,
      initialVelocityMps,
      pushForceN,
    }
  );

  const handleLaunch = () => {
    if (isSimulating) return;

    if (mechanics.isStaticLock) {
      setLastObservedNote(
        `Static Lock: Applied push force (${pushForceN} N) does not exceed maximum static friction (${mechanics.staticFrictionMaxN} N). Object remains at rest.`
      );
      return;
    }

    setIsSimulating(true);
    setAnimProgress(0);
    const startTime = performance.now();
    const durationMs = Math.max(mechanics.timeToStopS * 1000, 1200);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1.0);
      setAnimProgress(progress);

      // Trajectory values
      const t = progress * mechanics.timeToStopS;
      const v = Math.max(mechanics.initialVelocityMps + mechanics.accelerationMps2 * t, 0);
      const x =
        mechanics.initialVelocityMps * t + 0.5 * mechanics.accelerationMps2 * t * t;

      setCurrentVelocityMps(v);
      setCurrentDistanceM(x);

      if (progress < 1.0) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSimulating(false);
        setCurrentVelocityMps(0);
        setCurrentDistanceM(mechanics.stoppingDistanceM);

        // Record completed trial into comparison history
        const newTrial: CompletedTrial = {
          id: `trial_${Date.now()}`,
          trialNum: trialHistory.length + 1,
          massKg,
          surfaceName: currentSurface.name,
          mode,
          v0: mechanics.initialVelocityMps,
          pushForceN: mechanics.pushForceN,
          stoppingDistanceM: mechanics.stoppingDistanceM,
          timeToStopS: mechanics.timeToStopS,
        };
        setTrialHistory((prev) => [newTrial, ...prev].slice(0, 4));
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  const handleReset = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setIsSimulating(false);
    setAnimProgress(0);
    setCurrentDistanceM(0);
    setCurrentVelocityMps(0);
    setLastObservedNote(null);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Draw real-time velocity-time graph
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(35, 10);
    ctx.lineTo(35, h - 20);
    ctx.lineTo(w - 10, h - 20);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '9px monospace';
    ctx.fillText('v (m/s)', 5, 12);
    ctx.fillText('t (s)', w - 25, h - 6);

    const v0 = mechanics.initialVelocityMps;
    const tStop = mechanics.timeToStopS;

    if (tStop > 0 && v0 > 0 && !mechanics.isStaticLock) {
      const xStart = 35;
      const yStart = (h - 20) - Math.min((v0 / 8) * (h - 35), h - 35);
      const xEnd = 35 + Math.min((tStop / 4) * (w - 50), w - 50);
      const yEnd = h - 20;

      // Theoretical velocity line
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xStart, yStart);
      ctx.lineTo(xEnd, yEnd);
      ctx.stroke();

      // Current progress marker
      const currentX = xStart + (xEnd - xStart) * animProgress;
      const currentY = yStart + (yEnd - yStart) * animProgress;

      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 4, 0, 2 * Math.PI);
      ctx.fill();
    } else if (mechanics.isStaticLock) {
      ctx.fillStyle = '#EF4444';
      ctx.font = '10px monospace';
      ctx.fillText('Static Lock: v = 0 m/s', 50, h / 2);
    }
  }, [mechanics, animProgress]);

  const handleSaveObservation = () => {
    let outcomeText = '';
    if (mode === 'CONSTANT_VELOCITY') {
      outcomeText = `${currentSurface.name} (μk=${mu_k}): Mass ${massKg} kg at constant launch speed v0=${initialVelocityMps} m/s stopped in ${mechanics.stoppingDistanceM.toFixed(
        2
      )} m (a = -μk·g = ${mechanics.accelerationMps2} m/s²). Independent of mass!`;
    } else {
      outcomeText = mechanics.isStaticLock
        ? `${currentSurface.name}: Push force ${pushForceN} N <= F_s,max (${mechanics.staticFrictionMaxN} N). Block remained stationary.`
        : `${currentSurface.name} (μk=${mu_k}, μs=${mu_s}): Mass ${massKg} kg with ${pushForceN} N push slid ${mechanics.stoppingDistanceM.toFixed(
            2
          )} m.`;
    }

    setLastObservedNote(outcomeText);

    if (onRecordObservation) {
      onRecordObservation({
        surfaceId: currentSurface.id,
        surfaceName: currentSurface.name,
        mu_k,
        massKg,
        pushForceN: mode === 'APPLIED_FORCE' ? pushForceN : 0,
        stoppingDistanceM: mechanics.stoppingDistanceM,
        frictionForceN: mechanics.frictionForceN,
        normalForceN: mechanics.normalForceN,
        outcomeSummary: outcomeText,
      });
    }
  };

  // Dynamically calibrate track scale to avoid visual clipping when d > 12m
  const trackScaleMaxM = Math.max(12.0, Math.ceil((mechanics.stoppingDistanceM + 2) / 4) * 4);
  const blockXPercent = Math.min((currentDistanceM / trackScaleMaxM) * 80 + 5, 88);

  // Dynamic vector sizes
  const normalArrowHeightPx = Math.min(Math.max((mechanics.normalForceN / 50) * 28, 10), 32);
  const frictionArrowWidthPx = Math.min(
    Math.max((mechanics.frictionForceN / 35) * 36, 10),
    48
  );
  const pushArrowWidthPx = Math.min(Math.max((pushForceN / 50) * 36, 10), 48);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl flex flex-col gap-6">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
            <h3 className="font-bold text-sm tracking-wide text-slate-100 uppercase">
              Virtual Mechanics Track — Friction & Motion
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
              d = v₀² / (2μk·g)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'kn'
              ? 'ಆರಂಭಿಕ ವೇಗ ಅಥವಾ ತಳ್ಳುವ ಬಲವನ್ನು ನಿಯಂತ್ರಿಸಿ ಘರ್ಷಣೆ, ತೂಕ ಮತ್ತು ನಿಲ್ಲುವ ದೂರವನ್ನು ಅನ್ವೇಷಿಸಿ.'
              : 'Investigate mass-independence under constant launch speed, or test static friction thresholds with applied force.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Selector Tabs */}
          <div className="bg-slate-800 p-1 rounded-xl flex items-center border border-slate-700">
            <button
              type="button"
              onClick={() => {
                setMode('CONSTANT_VELOCITY');
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === 'CONSTANT_VELOCITY'
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Constant Speed (v₀)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('APPLIED_FORCE');
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === 'APPLIED_FORCE'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Push Force (F_push)
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Controls + Interactive Track */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Surface & Physical Variables Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Surface Texture Picker */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              1. Track Surface Material
            </label>
            <div className="space-y-1.5">
              {surfaces.map((s) => {
                const isSelected = s.id === selectedSurfaceId;
                const surfMuK = s.properties.mu_k ?? 0.3;
                const surfMuS = s.properties.mu_s ?? Math.round(surfMuK * 1.33 * 100) / 100;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelectedSurfaceId(s.id);
                      handleReset();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between border ${
                      isSelected
                        ? 'bg-blue-600/30 border-blue-500 text-white font-semibold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded border border-white/20"
                        style={{ backgroundColor: s.colorHex || '#CBD5E1' }}
                      />
                      <span>{language === 'kn' && s.nameInLanguage?.kn ? s.nameInLanguage.kn : s.name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      μk={surfMuK} | μs={surfMuS}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mass & Variable Sliders */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-4">
            {/* Block Mass Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Block Mass (m)</span>
                <span className="font-mono text-amber-300 font-bold">{massKg.toFixed(1)} kg</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.5"
                value={massKg}
                disabled={isSimulating}
                onChange={(e) => {
                  setMassKg(parseFloat(e.target.value));
                  handleReset();
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.5 kg</span>
                <span>5.0 kg (Double mass: 1kg vs 2kg)</span>
              </div>
            </div>

            {/* Mode-specific Slider */}
            {mode === 'CONSTANT_VELOCITY' ? (
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Controlled Initial Velocity (v₀)</span>
                  <span className="font-mono text-emerald-300 font-bold">{initialVelocityMps.toFixed(1)} m/s</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="8.0"
                  step="0.5"
                  value={initialVelocityMps}
                  disabled={isSimulating}
                  onChange={(e) => {
                    setInitialVelocityMps(parseFloat(e.target.value));
                    handleReset();
                  }}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>1.0 m/s</span>
                  <span>4.0 m/s (Prediction default)</span>
                  <span>8.0 m/s</span>
                </div>
                <p className="text-[11px] text-emerald-400/90 mt-1.5">
                  💡 Keep v₀ at 4.0 m/s and double mass to test hypothesis: stopping distance remains unchanged!
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Applied Push Force (F_push)</span>
                  <span className="font-mono text-amber-300 font-bold">{pushForceN.toFixed(0)} N</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={pushForceN}
                  disabled={isSimulating}
                  onChange={(e) => {
                    setPushForceN(parseFloat(e.target.value));
                    handleReset();
                  }}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>5 N</span>
                  <span>F_s,max threshold = {mechanics.staticFrictionMaxN.toFixed(1)} N</span>
                  <span>50 N</span>
                </div>
              </div>
            )}
          </div>

          {/* Telemetry Numbers */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-500 block">Normal Force (N)</span>
              <span className="text-blue-300 font-bold">{mechanics.normalForceN.toFixed(1)} N</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Static Limit (Fs,max)</span>
              <span className="text-amber-400 font-bold">{mechanics.staticFrictionMaxN.toFixed(1)} N</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Kinetic Friction (Fk)</span>
              <span className="text-red-400 font-bold">{mechanics.frictionForceN.toFixed(2)} N</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Stopping Distance</span>
              <span className="text-emerald-300 font-bold">
                {mechanics.stoppingDistanceM.toFixed(2)} m
              </span>
            </div>
          </div>
        </div>

        {/* Center & Right Column: Interactive Track & Velocity Graph */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Track Visual Stage */}
          <div className="bg-gradient-to-b from-slate-950 to-slate-900 rounded-3xl p-6 border border-slate-800 min-h-[300px] relative overflow-hidden flex flex-col justify-between">
            {/* Top Action & Gauges */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleLaunch}
                disabled={isSimulating}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Launch Block</span>
              </button>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Gauge className="w-4 h-4 text-amber-400" />
                  <span>
                    v = <strong className="text-amber-300">{currentVelocityMps.toFixed(2)}</strong> m/s
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>
                    x = <strong className="text-emerald-300">{currentDistanceM.toFixed(2)}</strong> m
                  </span>
                </div>
              </div>
            </div>

            {/* Static Lock Warning Alert if applicable */}
            {mechanics.isStaticLock && mode === 'APPLIED_FORCE' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-2.5 flex items-center gap-2 text-xs text-red-300 my-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>
                  Static Lock: Applied force ({pushForceN} N) does not exceed maximum static friction ({mechanics.staticFrictionMaxN} N). Increase push force to move.
                </span>
              </div>
            )}

            {/* The Physical Track Canvas */}
            <div className="relative my-8">
              {/* Force Vector Legend overlay */}
              <div className="absolute -top-7 right-0 flex items-center gap-3 text-[10px] font-mono text-slate-400">
                {mode === 'APPLIED_FORCE' && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-0.5 bg-emerald-400" /> F_push
                  </span>
                )}
                <span className="flex items-center gap-1 text-red-400">
                  <span className="w-2 h-0.5 bg-red-400" /> F_friction
                </span>
                <span className="flex items-center gap-1 text-blue-400">
                  <span className="w-2 h-0.5 bg-blue-400" /> N
                </span>
                <span className="flex items-center gap-1 text-purple-400">
                  <span className="w-2 h-0.5 bg-purple-400" /> mg
                </span>
              </div>

              {/* Surface Bed */}
              <div
                className="w-full h-8 rounded-lg border border-slate-700 relative shadow-inner transition-colors duration-500"
                style={{ backgroundColor: currentSurface.colorHex || '#CBD5E1' }}
              >
                {/* Dynamically Calibrated Distance Metre Hash Ticks */}
                <div className="absolute inset-x-0 bottom-0 flex justify-between px-4 text-[9px] font-mono text-slate-700 select-none">
                  <span>0m</span>
                  <span>{(trackScaleMaxM * 0.25).toFixed(0)}m</span>
                  <span>{(trackScaleMaxM * 0.5).toFixed(0)}m</span>
                  <span>{(trackScaleMaxM * 0.75).toFixed(0)}m</span>
                  <span>{trackScaleMaxM.toFixed(0)}m</span>
                </div>
              </div>

              {/* Sliding Test Block */}
              <div
                className="absolute -top-12 transition-all duration-75"
                style={{
                  left: `${blockXPercent}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="relative w-16 h-12 bg-amber-700 rounded-md border-2 border-amber-500 shadow-xl flex flex-col items-center justify-center text-[10px] font-bold text-amber-100 font-mono">
                  <span>{massKg} kg</span>
                  {mechanics.isStaticLock && mode === 'APPLIED_FORCE' && (
                    <span className="text-[7px] text-red-300 font-sans leading-none">LOCKED</span>
                  )}

                  {/* Dynamically Scaled Force Vectors */}
                  {/* Normal Force N (upwards) */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
                    style={{ bottom: '100%' }}
                  >
                    <span className="text-[8px] text-blue-400 font-mono font-bold leading-none mb-0.5">N</span>
                    <div
                      className="w-0.5 bg-blue-400"
                      style={{ height: `${normalArrowHeightPx}px` }}
                    />
                  </div>

                  {/* Weight mg (downwards) */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
                    style={{ top: '100%' }}
                  >
                    <div
                      className="w-0.5 bg-purple-400"
                      style={{ height: `${normalArrowHeightPx}px` }}
                    />
                    <span className="text-[8px] text-purple-400 font-mono font-bold leading-none mt-0.5">mg</span>
                  </div>

                  {/* Friction Force F_f (leftwards) */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 flex items-center"
                    style={{ right: '100%' }}
                  >
                    <span className="text-[8px] text-red-400 font-mono font-bold mr-1">f</span>
                    <div
                      className="h-0.5 bg-red-400"
                      style={{ width: `${frictionArrowWidthPx}px` }}
                    />
                  </div>

                  {/* Push Force (forward arrow in push mode during launch) */}
                  {mode === 'APPLIED_FORCE' && isSimulating && animProgress < 0.25 && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 flex items-center"
                      style={{ left: '100%' }}
                    >
                      <div
                        className="h-0.5 bg-emerald-400"
                        style={{ width: `${pushArrowWidthPx}px` }}
                      />
                      <span className="text-[8px] text-emerald-400 font-mono font-bold ml-1">F</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Real-time Velocity Canvas Graph */}
            <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Real-Time Velocity Graph v(t)</span>
                <span>Deceleration a = {mechanics.accelerationMps2.toFixed(2)} m/s²</span>
              </div>
              <canvas
                ref={graphCanvasRef}
                width={500}
                height={90}
                className="w-full h-20 bg-slate-900/50 rounded"
              />
            </div>
          </div>

          {/* Multi-Trial Comparison Table (Fulfills Trial A vs Trial B comparison requirement) */}
          {trialHistory.length > 0 && (
            <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <Scale className="w-4 h-4 text-brand-400" />
                  <span>Trial Comparison Log</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Compare mass vs stopping distance
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] font-mono text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-1 px-2">Trial</th>
                      <th className="py-1 px-2">Surface</th>
                      <th className="py-1 px-2">Mass</th>
                      <th className="py-1 px-2">v₀ (Launch Speed)</th>
                      <th className="py-1 px-2 text-emerald-400">Stopping Distance (d)</th>
                      <th className="py-1 px-2">Time (t)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trialHistory.map((t, idx) => (
                      <tr
                        key={t.id}
                        className={`border-b border-slate-900/80 ${
                          idx === 0 ? 'bg-brand-500/10 text-white font-bold' : 'text-slate-300'
                        }`}
                      >
                        <td className="py-1.5 px-2 text-brand-400">#{t.trialNum}</td>
                        <td className="py-1.5 px-2">{t.surfaceName}</td>
                        <td className="py-1.5 px-2">{t.massKg} kg</td>
                        <td className="py-1.5 px-2">{t.v0} m/s</td>
                        <td className="py-1.5 px-2 text-emerald-400 font-black">
                          {t.stoppingDistanceM.toFixed(2)} m
                        </td>
                        <td className="py-1.5 px-2">{t.timeToStopS.toFixed(2)} s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Observation Logger Footer */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-400">
              {lastObservedNote ? (
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Observation recorded to session log</span>
                </span>
              ) : (
                <span>Launch block, observe stopping distance, then record observation</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleSaveObservation}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30 transition shrink-0"
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
