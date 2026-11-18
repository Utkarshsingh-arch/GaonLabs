import React, { useEffect, useRef, useState } from 'react';
import { eventBus } from '../../game/eventBus';
import { HoverEntityPayload } from '../../game/systems/InteractionSystem';
import { SupportedGrade } from '../../learning/curriculum/ncertRegistry';
import {
  resolveCurriculumForEntity,
  resolveEntityKeyFromRuntimeId,
} from '../../learning/curriculum/curriculumMapper';
import { NcertModalTarget } from '../curriculum/NcertConceptModal';

interface HoverCardProps {
  studentGrade: SupportedGrade;
  onExploreNcert?: (target: NcertModalTarget) => void;
}

const CATEGORY_STYLES: Record<HoverEntityPayload['category'], { badge: string; border: string; label: string }> = {
  core_lab: {
    badge: 'bg-[#FFEEDD] text-[#D47220] border-[#FFD9B8]',
    border: 'border-[#FFD9B8]',
    label: 'Living Lab',
  },
  learning_house: {
    badge: 'bg-[#FAF5EF] text-[#D47220] border-[#EFECE6]',
    border: 'border-[#EFECE6]',
    label: 'Learning House',
  },
  civic_center: {
    badge: 'bg-[#E8F7EE] text-[#389461] border-[#CEECDA]',
    border: 'border-[#CEECDA]',
    label: 'Village Centre',
  },
  npc: {
    badge: 'bg-[#FFEEDD] text-[#D47220] border-[#FFD9B8]',
    border: 'border-[#FFD9B8]',
    label: 'Villager NPC',
  },
  residential: {
    badge: 'bg-[#FAF5EF] text-[#636160] border-[#EFECE6]',
    border: 'border-[#EFECE6]',
    label: 'Village Home',
  },
  tree: {
    badge: 'bg-[#E8F7EE] text-[#389461] border-[#CEECDA]',
    border: 'border-[#CEECDA]',
    label: 'Nature & Ecology',
  },
  vehicle: {
    badge: 'bg-[#FFF9F4] text-[#D47220] border-[#FFD9B8]',
    border: 'border-[#FFD9B8]',
    label: 'Mechanics & Energy',
  },
};

export const HoverCard: React.FC<HoverCardProps> = ({ studentGrade, onExploreNcert }) => {
  const [entity, setEntity] = useState<HoverEntityPayload | null>(null);
  const isPointerOnCardRef = useRef(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearHideTimer = () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };

    const onHover = (payload: HoverEntityPayload) => {
      clearHideTimer();
      setEntity(payload);
    };

    const onHoverEnd = (data?: { id?: string }) => {
      clearHideTimer();
      // Short grace period so the student can click "Explore NCERT Concept" on the card
      hideTimerRef.current = setTimeout(() => {
        if (isPointerOnCardRef.current) return;
        setEntity((curr) => {
          if (!curr) return null;
          if (data?.id && curr.id !== data.id) return curr;
          return null;
        });
      }, 380);
    };

    const onLabOpen = () => {
      clearHideTimer();
      isPointerOnCardRef.current = false;
      setEntity(null);
    };

    eventBus.on('entity:hover', onHover);
    eventBus.on('entity:hoverEnd', onHoverEnd);
    eventBus.on('lab:open', onLabOpen);

    return () => {
      clearHideTimer();
      eventBus.off('entity:hover', onHover);
      eventBus.off('entity:hoverEnd', onHoverEnd);
      eventBus.off('lab:open', onLabOpen);
    };
  }, []);

  if (!entity) return null;

  const style = CATEGORY_STYLES[entity.category];
  const entityKey = resolveEntityKeyFromRuntimeId(entity.id, entity.category);
  const ncertEntry = resolveCurriculumForEntity(entityKey, studentGrade);

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={() => {
        isPointerOnCardRef.current = true;
        if (hideTimerRef.current) {
          clearTimeout(hideTimerRef.current);
          hideTimerRef.current = null;
        }
      }}
      onMouseLeave={() => {
        isPointerOnCardRef.current = false;
        setEntity(null);
      }}
      className="fixed bottom-5 right-4 z-20 max-w-xs w-[315px] pointer-events-auto transition-all duration-150"
    >
      <div
        className={`bg-[#FFFFFF]/95 backdrop-blur-md border ${style.border} rounded-2xl p-3.5 shadow-soft-lg text-left text-[#352F2A]`}
      >
        <div className="flex items-start gap-2.5">
          <span className="text-2xl leading-none p-1.5 rounded-xl bg-[#FAF5EF] border border-[#EFECE6] shrink-0">
            {entity.icon}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-extrabold text-[#352F2A] truncate">{entity.name}</h3>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${style.badge}`}
              >
                {style.label}
              </span>
            </div>
            <p className="text-[10px] text-[#9E9B97] font-semibold mt-0.5 truncate">
              {entity.subject}
            </p>
          </div>
        </div>

        <p className="text-xs text-[#636160] leading-relaxed mt-2">
          {entity.description}
        </p>

        {/* Compact Verified NCERT Curriculum Connection */}
        {ncertEntry && (
          <div className="mt-2.5 pt-2 border-t border-[#EFECE6] space-y-1">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#389461]">
                NCERT Connection
              </span>
              <span className="text-[9px] font-bold text-[#636160]">
                Class {ncertEntry.grade} – {ncertEntry.subject === 'Social Science (Geography)' ? 'Geography' : ncertEntry.subject}
              </span>
            </div>
            <p className="text-[11px] text-[#352F2A] font-bold leading-snug">
              Ch. {ncertEntry.chapterNumber}: {ncertEntry.chapterTitle}
            </p>
            <p className="text-[10px] text-[#9E9B97] leading-snug truncate" title={ncertEntry.textbook}>
              {ncertEntry.textbook}
            </p>
            {onExploreNcert && (
              <button
                type="button"
                onClick={() =>
                  onExploreNcert({
                    entityKey,
                    objectName: entity.name,
                    objectIcon: entity.icon,
                  })
                }
                className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E8F7EE] hover:bg-[#CEECDA] border border-[#CEECDA] text-[#389461] text-[10px] font-bold transition-colors cursor-pointer"
              >
                <span>📖</span>
                <span>Explore NCERT Concept</span>
              </button>
            )}
          </div>
        )}

        {entity.hint && (
          <div className="mt-2 pt-1.5 border-t border-[#EFECE6] flex items-center gap-1.5 text-[10px] font-bold text-[#D47220]">
            <span>{entity.category === 'tree' ? '🌱' : '✨'}</span>
            <span className="leading-snug">{entity.hint}</span>
          </div>
        )}
      </div>
    </div>
  );
};
