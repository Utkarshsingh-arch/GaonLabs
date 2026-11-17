import React, { useEffect, useState } from 'react';
import { Lang, ZoneId } from '../../learning/types';
import { progressStore, BADGE_DEFINITIONS } from '../../storage/progressStore';
import { UserProfileRecord, CompletedLabRecord, BadgeRecord, ConceptMasteryRecord } from '../../storage/db';

interface ProgressScreenProps {
  profile: UserProfileRecord;
  lang: Lang;
  onClose: () => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ profile, lang, onClose }) => {
  const [completedLabs, setCompletedLabs] = useState<CompletedLabRecord[]>([]);
  const [badges, setBadges] = useState<BadgeRecord[]>([]);
  const [concepts, setConcepts] = useState<ConceptMasteryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [labsData, badgesData, conceptsData] = await Promise.all([
        progressStore.getCompletedLabs(),
        progressStore.getBadges(),
        progressStore.getConceptMastery(),
      ]);
      setCompletedLabs(labsData);
      setBadges(badgesData);
      setConcepts(conceptsData);
      setLoading(false);
    }
    loadData();
  }, []);

  const earnedBadgeIds = new Set(badges.map((b) => b.zoneId));
  const allZones: ZoneId[] = ['house', 'well', 'farm', 'tank', 'solar', 'soil'];

  const masteredConcepts = concepts.filter((c) => c.masteryScore >= 0.75);
  const reviewConcepts = concepts.filter((c) => c.masteryScore < 0.75);

  const level = Math.floor(profile.xp / 100) + 1;
  const currentLevelXp = profile.xp % 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="STEM Learning Mastery and Badges"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/30">
              🏅
            </span>
            <div>
              <h2 className="text-lg font-bold text-amber-400">
                {lang === 'hi' ? 'प्रगति और उपलब्धियाँ' : lang === 'kn' ? 'ಪ್ರಗತಿ ಮತ್ತು ಸಾಧನೆಗಳು' : 'Learning Progress & Badges'}
              </h2>
              <p className="text-xs text-slate-400">
                {profile.nickname} • Grade {profile.grade} STEM Scholar • {completedLabs.length} Labs Done
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading records...</div>
        ) : (
          <>
            {/* Level & XP Bar */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-amber-300">Level {level} Explorer</span>
            <span className="text-slate-300">{profile.xp} Total XP</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-700/50">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
              style={{ width: `${currentLevelXp}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 text-right">
            {100 - currentLevelXp} XP to Level {level + 1}
          </p>
        </div>

        {/* STEM Badges Collection */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between">
            <span>{lang === 'hi' ? 'अर्जित बैज (Badges)' : lang === 'kn' ? 'ಗಳಿಸಿದ ಬ್ಯಾಡ್ಜ್‌ಗಳು' : 'STEM Lab Badges'}</span>
            <span className="text-xs text-amber-400 font-mono">
              {earnedBadgeIds.size}/6 Earned
            </span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allZones.map((zoneId) => {
              const badgeDef = BADGE_DEFINITIONS[zoneId];
              const isEarned = earnedBadgeIds.has(zoneId);

              return (
                <div
                  key={zoneId}
                  className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all ${
                    isEarned
                      ? 'bg-amber-500/10 border-amber-400/60 shadow-lg'
                      : 'bg-slate-950/40 border-slate-800 opacity-50 grayscale'
                  }`}
                >
                  <span className="text-3xl">{badgeDef.icon}</span>
                  <span className="text-xs font-bold text-slate-100">
                    {badgeDef.title[lang] || badgeDef.title.en}
                  </span>
                  <span className="text-[9px] text-slate-400 line-clamp-2">
                    {badgeDef.description[lang] || badgeDef.description.en}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full mt-1 ${
                      isEarned
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isEarned ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Concept Mastery Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Mastered Concepts */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <span>✓</span>
              <span>
                {lang === 'hi' ? 'महारत हासिल अवधारणाएं' : lang === 'kn' ? 'ಕರಗತವಾದ ಪರಿಕಲ್ಪನೆಗಳು' : 'Mastered Concepts'} ({masteredConcepts.length})
              </span>
            </h4>
            {masteredConcepts.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic">Complete questions to master concepts.</p>
            ) : (
              <ul className="text-xs space-y-1.5 text-slate-300">
                {masteredConcepts.map((c) => (
                  <li key={c.concept} className="flex justify-between items-center text-[11px]">
                    <span className="font-mono text-slate-300 truncate max-w-[150px]">{c.concept}</span>
                    <span className="text-emerald-400 font-bold">{Math.round(c.masteryScore * 100)}%</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Concepts to Review */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span>🔄</span>
              <span>
                {lang === 'hi' ? 'पुनरावृत्ति हेतु अवधारणाएं' : lang === 'kn' ? 'ಮರುಪರಿಶೀಲಿಸಬೇಕಾದ ಪರಿಕಲ್ಪನೆಗಳು' : 'Concepts to Revisit'} ({reviewConcepts.length})
              </span>
            </h4>
            {reviewConcepts.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic">No weak concepts detected! Great job.</p>
            ) : (
              <ul className="text-xs space-y-1.5 text-slate-300">
                {reviewConcepts.map((c) => (
                  <li key={c.concept} className="flex justify-between items-center text-[11px]">
                    <span className="font-mono text-slate-300 truncate max-w-[150px]">{c.concept}</span>
                    <span className="text-amber-400 font-bold">{Math.round(c.masteryScore * 100)}%</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        </>
        )}

        {/* Back Button */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-2xl transition-colors cursor-pointer text-sm"
          >
            {lang === 'hi' ? 'गाँव में वापस जाएँ' : lang === 'kn' ? 'ಗ್ರಾಮಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Back to Village Map'}
          </button>
        </div>
      </div>
    </div>
  );
};
