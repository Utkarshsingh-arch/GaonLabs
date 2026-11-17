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
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    border: 'border-amber-500/50',
    label: 'Living Lab',
  },
  learning_house: {
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    border: 'border-sky-500/50',
    label: 'Learning House',
  },
  civic_center: {
    badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    border: 'border-teal-400/60',
    label: 'Village Centre',
  },
  npc: {
    badge: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
    border: 'border-amber-400/50',
    label: 'Villager NPC',
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

        <p className="text-xs text-slate-200 leading-relaxed mt-2">
          {entity.description}
        </p>

        {/* Compact Verified NCERT Curriculum Connection */}
        {ncertEntry && (
          <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                NCERT Connection
              </span>
              <span className="text-[9px] font-semibold text-slate-300">
                Class {ncertEntry.grade} – {ncertEntry.subject === 'Social Science (Geography)' ? 'Geography' : ncertEntry.subject}
              </span>
            </div>
            <p className="text-[11px] text-slate-200 font-medium leading-snug">
              Ch. {ncertEntry.chapterNumber}: {ncertEntry.chapterTitle}
            </p>
            <p className="text-[10px] text-slate-400 leading-snug truncate" title={ncertEntry.textbook}>
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
                className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold transition-colors cursor-pointer"
              >
                <span>📖</span>
                <span>Explore NCERT Concept</span>
              </button>
            )}
          </div>
        )}

        {entity.hint && (
          <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px] font-semibold text-amber-300">
            <span>{entity.category === 'tree' ? '🌱' : '✨'}</span>
            <span className="leading-snug">{entity.hint}</span>
          </div>
        )}
      </div>
    </div>
  );
};
