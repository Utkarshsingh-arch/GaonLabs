import React, { useState } from 'react';
import { Lang } from '../../learning/types';
import { progressStore } from '../../storage/progressStore';
import { UserProfileRecord } from '../../storage/db';

interface StartScreenProps {
  onStart: (profile: UserProfileRecord) => void;
  initialProfile?: UserProfileRecord | null;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, initialProfile }) => {
  const [nickname, setNickname] = useState<string>(initialProfile?.nickname || 'Ravi');
  const [lang, setLang] = useState<Lang>(initialProfile?.lang || 'en');
  const [grade, setGrade] = useState<6 | 7 | 8>(initialProfile?.grade || 7);
  const [avatarId, setAvatarId] = useState<string>(initialProfile?.avatarId || 'avatar_1');
  const [aiFeaturesEnabled, setAiFeaturesEnabled] = useState<boolean>(
    initialProfile?.aiFeaturesEnabled ?? true
  );

  const avatars = [
    { id: 'avatar_1', icon: '🧑‍🌾', name: { en: 'Arun (Field Scout)', hi: 'अरुण (फील्ड स्काउट)', kn: 'ಅರುಣ್ (ಫೀಲ್ಡ್ ಸ್ಕೌಟ್)' } },
    { id: 'avatar_2', icon: '👩‍🔬', name: { en: 'Kavya (Lab Scholar)', hi: 'काव्या (प्रयोगशाला विद्वान)', kn: 'ಕಾವ್ಯಾ (ವಿಜ್ಞಾನಿ)' } },
    { id: 'avatar_3', icon: '🧑‍🔧', name: { en: 'Deepak (Rural Maker)', hi: 'दीपक (ग्रामीण अन्वेषक)', kn: 'ದೀಪಕ್ (ಅನ್ವೇಷಕ)' } },
  ];

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nickname.trim() || 'Learner';
    const profile = await progressStore.saveProfile({
      nickname: cleanName,
      lang,
      grade,
      avatarId,
      aiFeaturesEnabled,
    });
    onStart(profile);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="GaonLab Profile Onboarding"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 p-4 overflow-y-auto"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 text-3xl mb-1 border border-amber-400/30">
            🏡
          </div>
          <h1 className="text-2xl font-black text-amber-400 tracking-tight">
            GaonLab — Village Explorer
          </h1>
          <p className="text-xs text-slate-400">
            {lang === 'hi'
              ? 'गाँव एक जीवंत प्रयोगशाला: विज्ञान और गणित का अन्वेषण करें'
              : lang === 'kn'
              ? 'ಹಳ್ಳಿ ಒಂದು ಜೀವಂತ ಪ್ರಯೋಗಾಲಯ: ವಿಜ್ಞಾನ ಮತ್ತು ಗಣಿತವನ್ನು ಅನ್ವೇಷಿಸಿ'
              : 'The Village as a Living Laboratory: STEM Simulation'}
          </p>
        </div>

        <form onSubmit={handleLaunch} className="space-y-5">
          {/* 1. Language Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              {lang === 'hi' ? 'भाषा चुनें (Select Language)' : lang === 'kn' ? 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ (Language)' : 'Select Language'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'en' as Lang, label: 'English' },
                { code: 'hi' as Lang, label: 'हिन्दी' },
                { code: 'kn' as Lang, label: 'ಕನ್ನಡ' },
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLang(item.code)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    lang === item.code
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-102'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Learner Nickname */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              {lang === 'hi' ? 'आपका उपनाम (Nickname)' : lang === 'kn' ? 'ನಿಮ್ಮ ಅಡ್ಡಹೆಸರು (Nickname)' : 'Student Nickname'}
            </label>
            <input
              type="text"
              value={nickname}
              maxLength={20}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Ravi, Ananya, Chetan"
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none transition-colors"
            />
          </div>

          {/* 3. School Grade */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              {lang === 'hi' ? 'कक्षा (School Grade)' : lang === 'kn' ? 'ತರಗತಿ (School Grade)' : 'Select Grade Level'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([6, 7, 8] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    grade === g
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  Grade {g}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Avatar Look */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              {lang === 'hi' ? 'अवतार चुनें (Choose Avatar)' : lang === 'kn' ? 'ಅವತಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ' : 'Choose Character Look'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {avatars.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setAvatarId(av.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer ${
                    avatarId === av.id
                      ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/30'
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  <span className="text-3xl">{av.icon}</span>
                  <span className="text-[10px] font-medium text-slate-200">
                    {av.name[lang] || av.name.en}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Privacy Notice & AI Toggle (DPDP Act 2023) */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <span>🛡️</span>
                <span>Child Privacy & Data Notice</span>
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={aiFeaturesEnabled}
                  onChange={(e) => setAiFeaturesEnabled(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-0"
                />
                <span className="text-[10px]">AI Tutor</span>
              </label>
            </div>
            <p className="leading-relaxed">
              Your nickname and badges are stored strictly on this device. No personal information or locations are ever transmitted.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 rounded-2xl shadow-xl transition-transform active:scale-98 text-sm cursor-pointer"
          >
            {lang === 'hi' ? 'गाँव में प्रवेश करें →' : lang === 'kn' ? 'ಗ್ರಾಮಕ್ಕೆ ಪ್ರವೇಶಿಸಿ →' : 'Enter Village & Explore →'}
          </button>
        </form>
      </div>
    </div>
  );
};
