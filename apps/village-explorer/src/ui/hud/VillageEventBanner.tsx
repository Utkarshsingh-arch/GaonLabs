import React, { useEffect, useState } from 'react';
import { Lang } from '../../learning/types';
import { VILLAGE_EVENTS, VillageEventDef } from '../../game/data/civicExpansionData';

interface VillageEventBannerProps {
  lang: Lang;
  onJoinEvent: (ev: VillageEventDef) => void;
}

/**
 * Lightweight, collapsible village-wide interactive event pill (Health Camp,
 * Railway Arrival, Market Day, Cooperative Savings Week, Science Exhibition).
 * Cycles gently every 45 seconds without obstructing gameplay or HUD controls.
 */
export const VillageEventBanner: React.FC<VillageEventBannerProps> = ({ lang, onJoinEvent }) => {
  const [eventIdx, setEventIdx] = useState<number>(0);
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setEventIdx((i) => (i + 1) % VILLAGE_EVENTS.length);
    }, 45000);
    return () => window.clearInterval(id);
  }, []);

  const current = VILLAGE_EVENTS[eventIdx];

  return (
    <div className="fixed top-20 right-4 z-20 flex flex-col items-end pointer-events-auto">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/95 backdrop-blur-md border border-amber-400/45 shadow-xl text-xs font-bold text-amber-300 transition-transform active:scale-95 cursor-pointer"
      >
        <span>{current.icon}</span>
        <span className="max-w-[190px] truncate">{current.title[lang]}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          +{current.bonusXp} XP
        </span>
      </button>

      {expanded && (
        <div className="mt-2 w-72 bg-slate-900/95 backdrop-blur-md border border-amber-400/45 rounded-2xl p-3.5 shadow-2xl space-y-2.5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-300">
              {current.icon} {current.title[lang]}
            </span>
            <button
              type="button"
              onClick={() => setEventIdx((i) => (i + 1) % VILLAGE_EVENTS.length)}
              className="text-[10px] text-sky-300 hover:text-sky-200 underline cursor-pointer"
            >
              Next Event →
            </button>
          </div>
          <p className="text-[11px] text-slate-200 leading-relaxed">{current.subtitle[lang]}</p>
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
            >
              Hide
            </button>
            <button
              type="button"
              onClick={() => {
                setExpanded(false);
                onJoinEvent(current);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] cursor-pointer"
            >
              Join Event →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
