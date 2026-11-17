import React, { useEffect, useState } from 'react';
import { Lang } from '../../learning/types';
import { SupportedGrade } from '../../learning/curriculum/ncertRegistry';
import {
  formatCompactNcertCitation,
  resolveCurriculumForEntity,
} from '../../learning/curriculum/curriculumMapper';
import {
  calculateJourneyMinutes,
  calculateTrainFare,
  calculateTrainSpeed,
  formatMinutesToDuration,
} from '../../learning/civicEngines';
import { NcertModalTarget } from '../curriculum/NcertConceptModal';

interface RailwayStationModalProps {
  lang: Lang;
  studentGrade: SupportedGrade;
  onClose: () => void;
  onAwardXp: (amount: number, reason: string) => void;
  onExploreNcert?: (target: NcertModalTarget) => void;
}

const TIMETABLE = [
  { id: 'gaon_exp', name: 'Gaon Express (101)', dep: '08:00', arr: '10:00', distKm: 120 },
  { id: 'kisan_pass', name: 'Kisan Passenger (204)', dep: '08:15', arr: '11:15', distKm: 120 },
  { id: 'deccan_fast', name: 'Deccan Superfast (309)', dep: '09:00', arr: '10:30', distKm: 120 },
  { id: 'gramin_shuttle', name: 'Gramin Shuttle (412)', dep: '07:30', arr: '10:30', distKm: 90 },
];

export const RailwayStationModal: React.FC<RailwayStationModalProps> = ({
  lang,
  studentGrade,
  onClose,
  onAwardXp,
  onExploreNcert,
}) => {
  const [tab, setTab] = useState<'sdt' | 'timetable' | 'tickets' | 'motion'>('sdt');

  // Speed-Distance-Time Lab state
  const [distanceKm, setDistanceKm] = useState<number>(120);
  const [timeHr, setTimeHr] = useState<number>(2);
  const [sdtAnswer, setSdtAnswer] = useState<string>('');
  const [sdtChecked, setSdtChecked] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Timetable Challenge state
  const [fastestPick, setFastestPick] = useState<string>('');
  const [earliestPick, setEarliestPick] = useState<string>('');
  const [timetableSolved, setTimetableSolved] = useState<boolean>(false);

  // Ticket Fare Calculator state
  const [fareDist, setFareDist] = useState<number>(80);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(2);
  const [discountPct, setDiscountPct] = useState<number>(10);

  // Train Motion Simulator state
  const [trainASpeed, setTrainASpeed] = useState<number>(60);
  const [trainBSpeed, setTrainBSpeed] = useState<number>(90);
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [simElapsedHr, setSimElapsedHr] = useState<number>(0);

  useEffect(() => {
    if (!simRunning) return;
    const id = window.setInterval(() => {
      setSimElapsedHr((prev) => {
        if (prev >= 2) {
          setSimRunning(false);
          return 2;
        }
        return Number((prev + 0.05).toFixed(2));
      });
    }, 120);
    return () => window.clearInterval(id);
  }, [simRunning]);

  const speed = calculateTrainSpeed(distanceKm, timeHr);
  const fare = calculateTrainFare(fareDist, adults, children, discountPct);
  const ncertEntry = resolveCurriculumForEntity('railway_station', studentGrade);

  const checkSdtChallenge = () => {
    const num = Number(sdtAnswer.trim());
    if (!Number.isNaN(num) && Math.abs(num - 60) <= 0.5) {
      if (sdtChecked !== 'correct') {
        onAwardXp(25, 'Railway Speed-Distance-Time Challenge');
      }
      setSdtChecked('correct');
    } else {
      setSdtChecked('wrong');
    }
  };

  const checkTimetable = () => {
    if (fastestPick === 'deccan_fast' && earliestPick === 'gaon_exp') {
      if (!timetableSolved) {
        onAwardXp(30, 'Railway Timetable Challenge');
      }
      setTimetableSolved(true);
    }
  };

  const title =
    lang === 'hi'
      ? 'गाँव रेलवे स्टेशन — चाल, दूरी और समय प्रयोगशाला'
      : lang === 'kn'
      ? 'ಗ್ರಾಮ ರೈಲ್ವೆ ನಿಲ್ದಾಣ — ವೇಗ, ದೂರ ಮತ್ತು ಸಮಯ ಲ್ಯಾಬ್'
      : 'Village Railway Station — Speed, Distance & Time Lab';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/45 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-gradient-to-r from-amber-950/70 to-slate-900">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-amber-500/20 border border-amber-400/40">
              🚉
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-amber-300">{title}</h2>
              {ncertEntry && (
                <div className="flex items-center gap-2 text-[11px] text-emerald-300">
                  <span>📖 NCERT: {formatCompactNcertCitation(ncertEntry)}</span>
                  {onExploreNcert && (
                    <button
                      type="button"
                      onClick={() =>
                        onExploreNcert({
                          entityKey: 'railway_station',
                          objectName: 'Village Railway Station',
                          objectIcon: '🚉',
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
          <button
            type="button"
            onClick={onClose}
            aria-label="Close railway station"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5 px-4 pt-2.5 border-b border-slate-800 bg-slate-900/70">
          {[
            { id: 'sdt' as const, icon: '📏', label: { en: 'Speed = Distance ÷ Time', hi: 'चाल = दूरी ÷ समय', kn: 'ವೇಗ = ದೂರ ÷ ಸಮಯ' } },
            { id: 'timetable' as const, icon: '🕒', label: { en: 'Timetable Challenge', hi: 'समय-सारणी चुनौती', kn: 'ವೇಳಾಪಟ್ಟಿ ಸವಾಲು' } },
            { id: 'tickets' as const, icon: '🎟️', label: { en: 'Ticket Counter & Fares', hi: 'टिकट व किराया', kn: 'ಟಿಕೆಟ್ ಮತ್ತು ದರ' } },
            { id: 'motion' as const, icon: '🚄', label: { en: 'Train Motion Sim', hi: 'ट्रेन गति सिमुलेटर', kn: 'ರೈಲು ಚಲನೆ ಸಿಮ್ಯುಲೇಟರ್' } },
          ].map((tItem) => (
            <button
              key={tItem.id}
              type="button"
              onClick={() => setTab(tItem.id)}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 cursor-pointer ${
                tab === tItem.id
                  ? 'border-amber-400 text-amber-300'
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
          {/* TAB 1: SPEED-DISTANCE-TIME */}
          {tab === 'sdt' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/75 border border-slate-700 rounded-2xl p-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Interactive Experiment Controls
                  </h3>
                  <label className="block text-xs text-slate-200">
                    Distance: <strong className="text-amber-300">{distanceKm} km</strong>
                    <input
                      type="range"
                      min={20}
                      max={600}
                      step={10}
                      value={distanceKm}
                      onChange={(e) => setDistanceKm(Number(e.target.value))}
                      className="w-full mt-1 accent-amber-400"
                    />
                  </label>
                  <label className="block text-xs text-slate-200">
                    Travel Time: <strong className="text-sky-300">{timeHr} hours</strong>
                    <input
                      type="range"
                      min={0.5}
                      max={10}
                      step={0.5}
                      value={timeHr}
                      onChange={(e) => setTimeHr(Number(e.target.value))}
                      className="w-full mt-1 accent-sky-400"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-center">
                    <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/35">
                      <span className="text-2xl font-black text-amber-300">{speed.kmh} km/h</span>
                      <span className="block text-[10px] text-slate-400">Average Speed</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-sky-500/35">
                      <span className="text-2xl font-black text-sky-300">{speed.ms} m/s</span>
                      <span className="block text-[10px] text-slate-400">SI Unit (÷ 3.6)</span>
                    </div>
                  </div>
                </div>

                {/* Challenge Card */}
                <div className="bg-slate-800/75 border border-emerald-500/35 rounded-2xl p-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    🎯 Station Master’s Challenge (+25 XP)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {lang === 'hi'
                      ? 'गाँव एक्सप्रेस 2 घंटे में 120 किमी दूरी तय करती है। इसकी औसत चाल (km/h में) क्या है?'
                      : lang === 'kn'
                      ? 'ಗಾಂವ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್ 2 ಗಂಟೆಗಳಲ್ಲಿ 120 ಕಿ.ಮೀ ದೂರ ಕ್ರಮಿಸುತ್ತದೆ. ಅದರ ಸರಾಸರಿ ವೇಗ (km/h ನಲ್ಲಿ) ಎಷ್ಟು?'
                      : 'The Gaon Express travels 120 km in 2 hours. What is its average speed in km/h?'}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={sdtAnswer}
                      onChange={(e) => setSdtAnswer(e.target.value)}
                      placeholder="km/h"
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={checkSdtChallenge}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                    >
                      Check
                    </button>
                  </div>
                  {sdtChecked === 'correct' && (
                    <p className="text-xs text-emerald-300 font-semibold">
                      ✓ Correct! Speed = 120 km ÷ 2 hr = 60 km/h (≈ 16.67 m/s). +25 XP earned!
                    </p>
                  )}
                  {sdtChecked === 'wrong' && (
                    <p className="text-xs text-rose-300">
                      Hint: Divide total distance (120 km) by total time (2 hours).
                    </p>
                  )}
                  {studentGrade >= 9 && (
                    <p className="text-[11px] text-sky-200 bg-sky-950/40 border border-sky-500/30 rounded-lg p-2">
                      <strong>Class {studentGrade} Physics Note:</strong> Steel wheels on steel rails have very low rolling friction, and uniform acceleration a = (v − u) / t applies as the train speeds up leaving the platform.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TIMETABLE CHALLENGE */}
          {tab === 'timetable' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-slate-700">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-800 text-amber-300">
                    <tr>
                      <th className="p-2.5">Train</th>
                      <th className="p-2.5">Departure</th>
                      <th className="p-2.5">Arrival</th>
                      <th className="p-2.5">Duration</th>
                      <th className="p-2.5">Distance</th>
                      <th className="p-2.5">Avg Speed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/70 text-slate-200">
                    {TIMETABLE.map((tr) => {
                      const mins = calculateJourneyMinutes(tr.dep, tr.arr);
                      const spd = calculateTrainSpeed(tr.distKm, mins / 60);
                      return (
                        <tr key={tr.id}>
                          <td className="p-2.5 font-bold text-white">{tr.name}</td>
                          <td className="p-2.5 font-mono">{tr.dep}</td>
                          <td className="p-2.5 font-mono text-emerald-300">{tr.arr}</td>
                          <td className="p-2.5">{formatMinutesToDuration(mins)}</td>
                          <td className="p-2.5">{tr.distKm} km</td>
                          <td className="p-2.5 font-bold text-amber-300">{spd.kmh} km/h</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-800/75 border border-slate-700 rounded-2xl p-4 space-y-3 text-xs">
                <p className="font-bold text-amber-300">🎯 Timetable Planning Quiz (+30 XP)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="space-y-1">
                    <span className="text-slate-300 block">1. Which train has the highest average speed?</span>
                    <select
                      value={fastestPick}
                      onChange={(e) => setFastestPick(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                    >
                      <option value="">Select train...</option>
                      {TIMETABLE.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-slate-300 block">2. Which train arrives earliest at the destination?</span>
                    <select
                      value={earliestPick}
                      onChange={(e) => setEarliestPick(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                    >
                      <option value="">Select train...</option>
                      {TIMETABLE.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={checkTimetable}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Verify Schedule
                </button>
                {timetableSolved && (
                  <p className="text-emerald-300 font-semibold">
                    ✓ Excellent! Deccan Superfast is fastest (80 km/h), while Gaon Express arrives earliest (10:00). +30 XP!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TICKET BOOKING & FARE CALCULATOR */}
          {tab === 'tickets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/75 border border-slate-700 rounded-2xl p-4 space-y-3 text-xs">
                <h3 className="font-bold text-amber-300 uppercase tracking-wider">
                  🎟️ Family Ticket Fare Estimator (₹1.50 / km)
                </h3>
                <label className="block">
                  Journey Distance: <strong>{fareDist} km</strong>
                  <input type="range" min={20} max={300} step={10} value={fareDist} onChange={(e) => setFareDist(Number(e.target.value))} className="w-full mt-1 accent-amber-400" />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    Adults (Full Fare): <strong>{adults}</strong>
                    <input type="range" min={1} max={6} value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="w-full mt-1" />
                  </label>
                  <label className="block">
                    Children (50% Fare): <strong>{children}</strong>
                    <input type="range" min={0} max={6} value={children} onChange={(e) => setChildren(Number(e.target.value))} className="w-full mt-1" />
                  </label>
                </div>
                <label className="block">
                  Student / Group Discount: <strong>{discountPct}%</strong>
                  <input type="range" min={0} max={25} step={5} value={discountPct} onChange={(e) => setDiscountPct(Number(e.target.value))} className="w-full mt-1 accent-emerald-400" />
                </label>
              </div>

              <div className="bg-slate-950/80 border border-amber-500/40 rounded-2xl p-4 space-y-2 text-xs">
                <h4 className="font-bold text-amber-300 text-sm">Simulated Village Rail Ticket</h4>
                <div className="flex justify-between text-slate-300">
                  <span>Adult Ticket ({adults} × ₹{fare.adultUnitFare})</span>
                  <span>₹{adults * fare.adultUnitFare}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Child Ticket ({children} × ₹{fare.childUnitFare})</span>
                  <span>₹{children * fare.childUnitFare}</span>
                </div>
                <div className="flex justify-between text-slate-300 border-t border-slate-800 pt-2">
                  <span>Subtotal</span>
                  <span>₹{fare.subtotal}</span>
                </div>
                <div className="flex justify-between text-emerald-300">
                  <span>Discount ({discountPct}%)</span>
                  <span>− ₹{fare.discountAmount}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-amber-300 border-t border-slate-700 pt-2">
                  <span>Final Total</span>
                  <span>₹{fare.finalTotal}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LIVE TRAIN MOTION SIMULATION */}
          {tab === 'motion' && (
            <div className="bg-slate-800/75 border border-slate-700 rounded-2xl p-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label>
                  Train A Speed (Passenger): <strong className="text-sky-300">{trainASpeed} km/h</strong>
                  <input type="range" min={30} max={120} step={10} value={trainASpeed} onChange={(e) => setTrainASpeed(Number(e.target.value))} className="w-full mt-1 accent-sky-400" />
                </label>
                <label>
                  Train B Speed (Express): <strong className="text-amber-300">{trainBSpeed} km/h</strong>
                  <input type="range" min={30} max={120} step={10} value={trainBSpeed} onChange={(e) => setTrainBSpeed(Number(e.target.value))} className="w-full mt-1 accent-amber-400" />
                </label>
              </div>

              {/* Dual Track Visual */}
              <div className="space-y-3 bg-slate-950/90 rounded-xl p-4 border border-slate-800">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Time Elapsed: <strong className="text-white">{simElapsedHr.toFixed(2)} hr</strong></span>
                  <span>Max Track: 240 km</span>
                </div>
                {[
                  { label: 'Train A', speed: trainASpeed, color: 'bg-sky-400' },
                  { label: 'Train B', speed: trainBSpeed, color: 'bg-amber-400' },
                ].map((tr) => {
                  const dist = Math.min(240, Math.round(tr.speed * simElapsedHr));
                  const pct = (dist / 240) * 100;
                  return (
                    <div key={tr.label} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-bold text-slate-200">{tr.label} ({tr.speed} km/h)</span>
                        <span className="font-mono text-emerald-300">{dist} km covered</span>
                      </div>
                      <div className="relative h-6 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                        <div className={`h-full ${tr.color} transition-all duration-100`} style={{ width: `${pct}%` }} />
                        <span
                          className="absolute top-0.5 text-sm transition-all duration-100"
                          style={{ left: `calc(${Math.min(92, pct)}% )` }}
                        >
                          🚄
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (simElapsedHr >= 2) setSimElapsedHr(0);
                    setSimRunning((r) => !r);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold cursor-pointer"
                >
                  {simRunning ? 'Pause Trains' : 'Start Motion Simulation'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSimRunning(false);
                    setSimElapsedHr(0);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-700 text-white font-bold cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/95 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
          >
            {lang === 'hi' ? 'गाँव में वापस जाएँ' : lang === 'kn' ? 'ಗ್ರಾಮಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Back to Village'}
          </button>
        </div>
      </div>
    </div>
  );
};
