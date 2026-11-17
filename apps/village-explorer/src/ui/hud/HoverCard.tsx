import React, { useEffect, useState } from 'react';
import { eventBus } from '../../game/eventBus';
import { HoverEntityPayload } from '../../game/systems/InteractionSystem';

const CATEGORY_STYLES: Record<HoverEntityPayload['category'], { badge: string; border: string; label: string }> = {
  core_lab: {
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    border: 'border-amber-500/50',
    label: 'Living Lab',
  },
  learning_house: {
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    border: 'border-sky-500/50',
    label: 'Learning House',
  },
  residential: {
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    border: 'border-orange-500/40',
    label: 'Village Home',
  },
  tree: {
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    border: 'border-emerald-500/50',
    label: 'Nature & Ecology',
  },
  vehicle: {
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    border: 'border-indigo-500/50',
    label: 'Mechanics & Energy',
  },
};

export const HoverCard: React.FC = () => {
  const [entity, setEntity] = useState<HoverEntityPayload | null>(null);

  useEffect(() => {
    const onHover = (payload: HoverEntityPayload) => {
      setEntity(payload);
    };

    const onHoverEnd = (data?: { id?: string }) => {
      setEntity((curr) => {
        if (!curr) return null;
        if (data?.id && curr.id !== data.id) return curr;
        return null;
      });
    };

    const onLabOpen = () => {
      setEntity(null);
    };

    eventBus.on('entity:hover', onHover);
    eventBus.on('entity:hoverEnd', onHoverEnd);
    eventBus.on('lab:open', onLabOpen);

    return () => {
      eventBus.off('entity:hover', onHover);
      eventBus.off('entity:hoverEnd', onHoverEnd);
      eventBus.off('lab:open', onLabOpen);
    };
  }, []);

  if (!entity) return null;

  const style = CATEGORY_STYLES[entity.category];

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-4 z-20 max-w-xs w-[300px] pointer-events-none transition-all duration-150"
    >
      <div
        className={`bg-slate-900/92 backdrop-blur-md border ${style.border} rounded-2xl p-3.5 shadow-2xl text-left`}
      >
        <div className="flex items-start gap-2.5">
          <span className="text-2xl leading-none p-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 shrink-0">
            {entity.icon}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-white truncate">{entity.name}</h3>
              <span
                className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${style.badge}`}
              >
                {style.label}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">
              {entity.subject}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed mt-2.5">
          {entity.description}
        </p>

        {entity.hint && (
          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-1.5 text-[11px] font-semibold text-amber-300">
            <span>{entity.category === 'tree' ? '🌱' : '✨'}</span>
            <span className="leading-snug">{entity.hint}</span>
          </div>
        )}
      </div>
    </div>
  );
};
