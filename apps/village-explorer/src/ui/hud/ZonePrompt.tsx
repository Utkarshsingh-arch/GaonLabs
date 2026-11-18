import React, { useEffect, useState } from 'react';
import { eventBus } from '../../game/eventBus';
import { Lang } from '../../learning/types';

interface ZonePromptProps {
  lang?: Lang;
}

interface ActivePromptTarget {
  id: string;
  name: string;
  kind: 'core_lab' | 'learning_house' | 'civic_center';
  icon?: string;
}

export const ZonePrompt: React.FC<ZonePromptProps> = ({ lang = 'en' }) => {
  const [target, setTarget] = useState<ActivePromptTarget | null>(null);

  useEffect(() => {
    const onZoneHover = (zone: { id: string; name: string }) => {
      setTarget({ id: zone.id, name: zone.name, kind: 'core_lab', icon: '🔬' });
    };

    const onZoneLeave = () => {
      setTarget((curr) => (curr?.kind === 'core_lab' ? null : curr));
    };

    const onHouseHover = (house: { id: string; name: string; icon?: string; isCivic?: boolean }) => {
      setTarget({
        id: house.id,
        name: house.name,
        kind: house.isCivic ? 'civic_center' : 'learning_house',
        icon: house.icon || '🏡',
      });
    };

    const onHouseLeave = () => {
      setTarget((curr) =>
        curr?.kind === 'learning_house' || curr?.kind === 'civic_center' ? null : curr
      );
    };

    const onClear = () => {
      setTarget(null);
    };

    eventBus.on('zone:hover', onZoneHover);
    eventBus.on('zone:leave', onZoneLeave);
    eventBus.on('zone:enter', onClear);
    eventBus.on('house:hover', onHouseHover);
    eventBus.on('house:leave', onHouseLeave);
    eventBus.on('house:enter', onClear);
    eventBus.on('civic:enter', onClear);

    return () => {
      eventBus.off('zone:hover', onZoneHover);
      eventBus.off('zone:leave', onZoneLeave);
      eventBus.off('zone:enter', onClear);
      eventBus.off('house:hover', onHouseHover);
      eventBus.off('house:leave', onHouseLeave);
      eventBus.off('house:enter', onClear);
      eventBus.off('civic:enter', onClear);
    };
  }, []);

  if (!target) return null;

  const promptText =
    lang === 'hi'
      ? `${target.name} में प्रवेश करें`
      : lang === 'kn'
      ? `${target.name} ಪ್ರವೇಶಿಸಿ`
      : `Enter ${target.name}`;

  const isHouse = target.kind === 'learning_house' || target.kind === 'civic_center';

  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce">
      <button
        type="button"
        aria-label={promptText}
        onClick={() => {
          if (target.kind === 'civic_center') {
            eventBus.emit('civic:enter', { id: target.id, name: target.name });
          } else if (target.kind === 'learning_house') {
            eventBus.emit('house:enter', { id: target.id, name: target.name });
          } else {
            eventBus.emit('zone:enter', { id: target.id, name: target.name });
          }
        }}
        className={`flex items-center gap-3 font-extrabold px-5 py-3 rounded-2xl shadow-soft-lg border-2 transition-transform active:scale-95 cursor-pointer focus-visible:ring-4 focus-visible:outline-none ${
          isHouse
            ? 'bg-[#48AF76] hover:bg-[#389461] text-white border-[#CEECDA] focus-visible:ring-[#48AF76]/40'
            : 'bg-[#FA9C4D] hover:bg-[#EB8833] text-white border-[#FFD9B8] shadow-orange-glow focus-visible:ring-[#FA9C4D]/40'
        }`}
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#FFFFFF] text-[#352F2A] font-mono font-extrabold text-xs shadow-soft-sm">
          E
        </span>
        <span className="text-sm font-extrabold tracking-wide">{promptText}</span>
        <span className="text-base">{target.icon || '🔬'}</span>
      </button>
    </div>
  );
};
