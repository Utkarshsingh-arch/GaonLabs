import React, { useState } from 'react';
import { Lang } from '../../learning/types';

interface HintLadderProps {
  hints: Record<Lang, string[]>;
  lang: Lang;
}

export const HintLadder: React.FC<HintLadderProps> = ({ hints, lang }) => {
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const localizedHints = hints[lang] || hints.en || [];

  if (localizedHints.length === 0) return null;

  return (
    <div className="mt-3 bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-amber-300 flex items-center gap-1.5">
          <span>💡</span>
          <span>{lang === 'hi' ? 'संकेत (Hints)' : lang === 'kn' ? 'ಸುಳಿವು (Hints)' : 'Need a Hint?'}</span>
        </span>
        {revealedCount < localizedHints.length && (
          <button
            type="button"
            onClick={() => setRevealedCount((prev) => prev + 1)}
            className="text-amber-400 underline hover:text-amber-300 font-medium"
          >
            {revealedCount === 0
              ? (lang === 'hi' ? 'पहला संकेत देखें' : lang === 'kn' ? 'ಮೊದಲ ಸುಳಿವು ನೋಡಿ' : 'Show Hint 1')
              : (lang === 'hi' ? `अगला संकेत देखें (${revealedCount}/${localizedHints.length})` : lang === 'kn' ? `ಮುಂದಿನ ಸುಳಿವು (${revealedCount}/${localizedHints.length})` : `Next Hint (${revealedCount}/${localizedHints.length})`)}
          </button>
        )}
      </div>

      {revealedCount > 0 && (
        <ul className="mt-2 space-y-1.5 list-disc list-inside text-amber-200/90 pl-1">
          {localizedHints.slice(0, revealedCount).map((hint, idx) => (
            <li key={idx} className="leading-relaxed">
              {hint}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
