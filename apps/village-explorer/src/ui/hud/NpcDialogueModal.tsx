import React from 'react';
import { Lang } from '../../learning/types';
import { SupportedGrade } from '../../learning/curriculum/ncertRegistry';
import { VillageNpcDef } from '../../game/data/civicExpansionData';
import {
  formatCompactNcertCitation,
  resolveCurriculumForEntity,
} from '../../learning/curriculum/curriculumMapper';

interface NpcDialogueModalProps {
  npc: VillageNpcDef;
  dialogueIndex: number;
  studentName: string;
  studentGrade: SupportedGrade;
  lang: Lang;
  onAccept: () => void;
  onDecline: () => void;
}

export const NpcDialogueModal: React.FC<NpcDialogueModalProps> = ({
  npc,
  dialogueIndex,
  studentName,
  studentGrade,
  lang,
  onAccept,
  onDecline,
}) => {
  const lines = npc.dialogues[lang] || npc.dialogues.en;
  const line = lines[dialogueIndex % lines.length].replace('{name}', studentName || 'Adventurer');
  const ncertEntry = resolveCurriculumForEntity(npc.curriculumEntityKey, studentGrade);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={npc.name[lang]}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/65 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-md bg-slate-900 border-2 border-amber-400/50 rounded-3xl shadow-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-3xl shrink-0">
            {npc.icon}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-black text-amber-300 truncate">{npc.name[lang]}</h3>
            <p className="text-xs text-emerald-300 font-semibold">{npc.role[lang]}</p>
          </div>
          <span className="ml-auto px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold shrink-0">
            +{npc.xpReward} XP
          </span>
        </div>

        <div className="bg-slate-950/75 border border-slate-800 rounded-2xl p-3.5 text-sm text-slate-100 leading-relaxed">
          “{line}”
        </div>

        {ncertEntry && (
          <p className="text-[11px] text-emerald-300/95 bg-emerald-950/40 border border-emerald-500/30 rounded-xl px-3 py-1.5">
            📖 NCERT: {formatCompactNcertCitation(ncertEntry)}
          </p>
        )}

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onDecline}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
          >
            {lang === 'hi' ? 'बाद में' : lang === 'kn' ? 'ನಂತರ ನೋಡುವೆ' : 'Maybe Later'}
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-xs font-black shadow-lg cursor-pointer"
          >
            {npc.offerLabel[lang]} →
          </button>
        </div>
      </div>
    </div>
  );
};
