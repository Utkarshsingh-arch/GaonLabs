import React, { useEffect, useState } from 'react';
import { eventBus } from '../../game/eventBus';
import { ExplorationFact } from '../../game/data/villageEntities';
import { SupportedGrade } from '../../learning/curriculum/ncertRegistry';
import {
  formatCompactNcertCitation,
  resolveCurriculumForEntity,
} from '../../learning/curriculum/curriculumMapper';
import { NcertModalTarget } from '../curriculum/NcertConceptModal';

interface FactBubbleProps {
  studentGrade: SupportedGrade;
  onExploreNcert?: (target: NcertModalTarget) => void;
}

const CATEGORY_COLORS: Record<ExplorationFact['category'], string> = {
  Physics: 'bg-[#FFEEDD] text-[#D47220] border-[#FFD9B8]',
  Biology: 'bg-[#E8F7EE] text-[#389461] border-[#CEECDA]',
  Chemistry: 'bg-[#FAF5EF] text-[#D47220] border-[#EFECE6]',
  Mathematics: 'bg-[#FFEEDD] text-[#D47220] border-[#FFD9B8]',
  Environment: 'bg-[#E8F7EE] text-[#389461] border-[#CEECDA]',
};

export const FactBubble: React.FC<FactBubbleProps> = ({ studentGrade, onExploreNcert }) => {
  const [fact, setFact] = useState<ExplorationFact | null>(null);

  useEffect(() => {
    let hideTimeout: ReturnType<typeof setTimeout> | null = null;

    const onShowFact = (incoming: ExplorationFact) => {
      setFact(incoming);
      if (hideTimeout) clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        setFact(null);
      }, 8000);
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

  const ncertEntry = resolveCurriculumForEntity(fact.id, studentGrade);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 left-4 z-20 max-w-xs sm:max-w-sm pointer-events-auto"
    >
      <div className="bg-[#FFFFFF]/95 backdrop-blur-md border border-[#EFECE6] rounded-2xl px-3.5 py-2.5 shadow-soft-lg flex items-start gap-2.5 text-[#352F2A]">
        <span className="text-lg leading-none mt-0.5 shrink-0">{fact.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D47220]">
              💡 Village Discovery
            </span>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${CATEGORY_COLORS[fact.category]}`}
            >
              {fact.category}
            </span>
          </div>
          <p className="text-xs text-[#636160] font-medium leading-snug">{fact.text}</p>
          {ncertEntry && (
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold text-[#389461] truncate">
                📖 NCERT {formatCompactNcertCitation(ncertEntry)}
              </span>
              {onExploreNcert && (
                <button
                  type="button"
                  onClick={() => {
                    onExploreNcert({
                      entityKey: fact.id,
                      objectName: ncertEntry.topic,
                      objectIcon: fact.icon,
                    });
                    setFact(null);
                  }}
                  className="text-[10px] font-extrabold text-[#D47220] hover:text-[#FA9C4D] underline shrink-0 cursor-pointer"
                >
                  Explore
                </button>
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setFact(null)}
          aria-label="Dismiss fact"
          className="text-[#9E9B97] hover:text-[#352F2A] text-xs px-1 py-0.5 rounded-md cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
