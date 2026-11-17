import React, { useEffect, useState } from 'react';
import { eventBus } from '../../game/eventBus';
import { ExplorationFact } from '../../game/data/villageEntities';

const CATEGORY_COLORS: Record<ExplorationFact['category'], string> = {
  Physics: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  Biology: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  Chemistry: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  Mathematics: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  Environment: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
};

export const FactBubble: React.FC = () => {
  const [fact, setFact] = useState<ExplorationFact | null>(null);

  useEffect(() => {
    let hideTimeout: ReturnType<typeof setTimeout> | null = null;

    const onShowFact = (incoming: ExplorationFact) => {
      setFact(incoming);
      if (hideTimeout) clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        setFact(null);
      }, 7500);
    };

    const onLabOpen = () => {
      setFact(null);
      if (hideTimeout) clearTimeout(hideTimeout);
    };

    eventBus.on('fact:show', onShowFact);
    eventBus.on('lab:open', onLabOpen);

    return () => {
      eventBus.off('fact:show', onShowFact);
      eventBus.off('lab:open', onLabOpen);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, []);

  if (!fact) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 left-4 z-20 max-w-xs sm:max-w-sm pointer-events-auto"
    >
      <div className="bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 rounded-2xl px-3.5 py-2.5 shadow-xl flex items-start gap-2.5">
        <span className="text-lg leading-none mt-0.5 shrink-0">{fact.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
              💡 Village Discovery
            </span>
            <span
              className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${CATEGORY_COLORS[fact.category]}`}
            >
              {fact.category}
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-snug">{fact.text}</p>
        </div>
        <button
          type="button"
          onClick={() => setFact(null)}
          aria-label="Dismiss fact"
          className="text-slate-400 hover:text-white text-xs px-1 py-0.5 rounded-md cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
