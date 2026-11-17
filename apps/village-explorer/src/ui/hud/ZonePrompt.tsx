import React, { useEffect, useState } from 'react';
import { eventBus } from '../../game/eventBus';
import { Lang } from '../../learning/types';

interface ZonePromptProps {
  lang?: Lang;
}

export const ZonePrompt: React.FC<ZonePromptProps> = ({ lang = 'en' }) => {
  const [hoveredZone, setHoveredZone] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const onHover = (zone: { id: string; name: string }) => {
      setHoveredZone(zone);
    };

    const onLeave = () => {
      setHoveredZone(null);
    };

    const onEnter = () => {
      setHoveredZone(null);
    };

    eventBus.on('zone:hover', onHover);
    eventBus.on('zone:leave', onLeave);
    eventBus.on('zone:enter', onEnter);

    return () => {
      eventBus.off('zone:hover', onHover);
      eventBus.off('zone:leave', onLeave);
      eventBus.off('zone:enter', onEnter);
    };
  }, []);

  if (!hoveredZone) return null;

  const promptText =
    lang === 'hi'
      ? `${hoveredZone.name} में प्रवेश करें`
      : lang === 'kn'
      ? `${hoveredZone.name} ಪ್ರವೇಶಿಸಿ`
      : `Enter ${hoveredZone.name}`;

  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce">
      <button
        type="button"
        aria-label={promptText}
        onClick={() => {
          eventBus.emit('zone:enter', { id: hoveredZone.id, name: hoveredZone.name });
        }}
        className="flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-3 rounded-2xl shadow-2xl border-2 border-amber-300 transition-transform active:scale-95 cursor-pointer focus-visible:ring-4 focus-visible:ring-amber-300 focus-visible:outline-none"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-amber-400 font-mono text-xs shadow-inner">
          E
        </span>
        <span className="text-sm font-semibold tracking-wide">
          {promptText}
        </span>
        <span className="text-base">🔬</span>
      </button>
    </div>
  );
};
