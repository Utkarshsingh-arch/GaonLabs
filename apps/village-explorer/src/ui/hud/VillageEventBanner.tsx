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
    <div className="fixed top-20 right-3.5 z-20 flex flex-col items-end pointer-events-auto">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#FFFFFF]/95 hover:bg-[#FAF5EF] backdrop-blur-md border border-[#FFD9B8] shadow-soft-md text-xs font-extrabold text-[#352F2A] transition-transform active:scale-95 cursor-pointer"
      >
        <span>{current.icon}</span>
        <span className="max-w-[190px] truncate">{current.title[lang]}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E8F7EE] text-[#389461] border border-[#CEECDA] font-bold">
          +{current.bonusXp} XP
        </span>
      </button>

      {expanded && (
        <div className="mt-2 w-72 bg-[#FFFFFF]/95 backdrop-blur-md border border-[#EFECE6] rounded-2xl p-3.5 shadow-soft-lg space-y-2.5 text-left text-[#352F2A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#352F2A]">
              {current.icon} {current.title[lang]}
            </span>
            <button
              type="button"
              onClick={() => setEventIdx((i) => (i + 1) % VILLAGE_EVENTS.length)}
              className="text-[10px] font-bold text-[#D47220] hover:text-[#FA9C4D] underline cursor-pointer"
            >
              Next Event →
            </button>
          </div>
          <p className="text-[11px] text-[#636160] font-medium leading-relaxed">{current.subtitle[lang]}</p>
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-[10px] font-bold text-[#9E9B97] hover:text-[#352F2A] cursor-pointer"
            >
              Hide
            </button>
            <button
              type="button"
              onClick={() => {
                setExpanded(false);
                onJoinEvent(current);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#FA9C4D] hover:bg-[#EB8833] text-white font-extrabold text-[11px] shadow-soft-sm cursor-pointer"
            >
              Join Event →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
