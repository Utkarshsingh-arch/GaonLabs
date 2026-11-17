import React, { useMemo, useState } from 'react';
import { Lang } from '../../learning/types';
import { SupportedGrade } from '../../learning/curriculum/ncertRegistry';
import { progressStore } from '../../storage/progressStore';
import { UserProfileRecord } from '../../storage/db';
import {
  AvatarCustomization,
  CharacterPresentation,
  DEFAULT_BOY_AVATAR,
  DEFAULT_GIRL_AVATAR,
  HAIR_STYLES,
  OUTFIT_COLORS,
  OUTFIT_STYLES,
  OutfitColorId,
  SKIN_TONES,
  SkinToneId,
  decodeAvatarId,
  encodeAvatarId,
} from '../../game/graphics/avatarAppearance';
import { VillageBackdrop } from './VillageBackdrop';
import { AvatarPreviewCanvas } from './AvatarPreviewCanvas';

interface StartScreenProps {
  onStart: (profile: UserProfileRecord) => void;
  initialProfile?: UserProfileRecord | null;
}

const ONBOARDING_COPY: Record<
  Lang,
  {
    welcomeTitle: string;
    welcomeSubtitle: string;
    tagline: string;
    languageLabel: string;
    chooseCharTitle: string;
    chooseCharSubtitle: string;
    boyLabel: string;
    boyTag: string;
    girlLabel: string;
    girlTag: string;
    customizeToggle: string;
    skinLabel: string;
    hairLabel: string;
    outfitLabel: string;
    colorLabel: string;
    nameTitle: string;
    nameSubtitle: string;
    namePlaceholder: string;
    nameError: string;
    classTitle: string;
    classSubtitle: string;
    classPrefix: string;
    privacyTitle: string;
    privacyBody: string;
    aiTutorLabel: string;
    aiEnabled: string;
    aiDisabled: string;
    enterCta: string;
    adventureTitle: string;
    adventures: Array<{ icon: string; title: string }>;
    heroBadge: string;
    rotateHint: string;
  }
> = {
  en: {
    welcomeTitle: 'WELCOME TO YOUR VILLAGE!',
    welcomeSubtitle: 'An exciting world of adventures, discoveries and experiments is waiting for you.',
    tagline: 'Explore • Discover • Experiment • Create',
    languageLabel: 'Language',
    chooseCharTitle: 'CHOOSE YOUR CHARACTER',
    chooseCharSubtitle: 'Every great adventure begins with choosing who you want to be.',
    boyLabel: 'BOY CHARACTER',
    boyTag: 'Village Explorer',
    girlLabel: 'GIRL CHARACTER',
    girlTag: 'Village Explorer',
    customizeToggle: 'Customise Look',
    skinLabel: 'Skin Tone',
    hairLabel: 'Hairstyle',
    outfitLabel: 'Outfit',
    colorLabel: 'Colour',
    nameTitle: 'What should we call you, adventurer?',
    nameSubtitle: 'Choose a name your village will remember.',
    namePlaceholder: 'e.g. Ravi, Ananya, Chetan...',
    nameError: 'Please choose an adventurer name to enter your village.',
    classTitle: 'Which class are you studying in?',
    classSubtitle: "We'll customise your adventures and learning challenges according to your class.",
    classPrefix: 'Class',
    privacyTitle: 'YOUR PRIVACY MATTERS',
    privacyBody:
      'Your nickname and badges are stored strictly on this device. No personal information or locations are ever transmitted.',
    aiTutorLabel: 'Mitra AI Tutor',
    aiEnabled: 'ON',
    aiDisabled: 'OFF',
    enterCta: 'ENTER MY VILLAGE →',
    adventureTitle: 'YOUR ADVENTURE AWAITS',
    adventures: [
      { icon: '🗺️', title: 'Explore the village' },
      { icon: '🧪', title: 'Discover science experiments' },
      { icon: '🔍', title: 'Solve village mysteries' },
      { icon: '🛠️', title: 'Build and create' },
      { icon: '🏆', title: 'Unlock achievements' },
    ],
    heroBadge: 'Your Explorer',
    rotateHint: 'Turn',
  },
  hi: {
    welcomeTitle: 'आपके गाँव में स्वागत है!',
    welcomeSubtitle: 'रोमांच, खोज और विज्ञान के प्रयोगों की एक अद्भुत दुनिया आपका इंतज़ार कर रही है।',
    tagline: 'अन्वेषण करें • खोजें • प्रयोग करें • निर्माण करें',
    languageLabel: 'भाषा',
    chooseCharTitle: 'अपना पात्र चुनें',
    chooseCharSubtitle: 'हर महान यात्रा की शुरुआत अपने नायक को चुनने से होती है।',
    boyLabel: 'लड़का पात्र',
    boyTag: 'गाँव अन्वेषक',
    girlLabel: 'लड़की पात्र',
    girlTag: 'गाँव अन्वेषक',
    customizeToggle: 'रूप सजाएँ',
    skinLabel: 'त्वचा का रंग',
    hairLabel: 'केश शैली',
    outfitLabel: 'पोशाक',
    colorLabel: 'रंग',
    nameTitle: 'साहसी यात्री, हम आपको क्या कहकर बुलाएँ?',
    nameSubtitle: 'ऐसा नाम चुनें जिसे आपका गाँव याद रखे।',
    namePlaceholder: 'जैसे रवि, अनन्या, चेतन...',
    nameError: 'गाँव में प्रवेश करने के लिए कृपया एक नाम लिखें।',
    classTitle: 'आप किस कक्षा में पढ़ते हैं?',
    classSubtitle: 'हम आपकी कक्षा के अनुसार NCERT चुनौतियाँ और प्रयोग तैयार करेंगे।',
    classPrefix: 'कक्षा',
    privacyTitle: 'आपकी गोपनीयता महत्वपूर्ण है',
    privacyBody:
      'आपका उपनाम और बैज केवल इसी डिवाइस पर सुरक्षित रहते हैं। कोई भी व्यक्तिगत जानकारी या स्थान कभी नहीं भेजा जाता।',
    aiTutorLabel: 'मित्रा AI शिक्षक',
    aiEnabled: 'चालू',
    aiDisabled: 'बंद',
    enterCta: 'मेरे गाँव में प्रवेश करें →',
    adventureTitle: 'आपका रोमांच शुरू होने वाला है',
    adventures: [
      { icon: '🗺️', title: 'गाँव की सैर करें' },
      { icon: '🧪', title: 'विज्ञान प्रयोग खोजें' },
      { icon: '🔍', title: 'गाँव के रहस्य सुलझाएँ' },
      { icon: '🛠️', title: 'निर्माण और सृजन करें' },
      { icon: '🏆', title: 'उपलब्धियाँ हासिल करें' },
    ],
    heroBadge: 'आपका अन्वेषक',
    rotateHint: 'घुमाएँ',
  },
  kn: {
    welcomeTitle: 'ನಿಮ್ಮ ಹಳ್ಳಿಗೆ ಸುಸ್ವಾಗತ!',
    welcomeSubtitle: 'ಸಾಹಸಗಳು, ಆವಿಷ್ಕಾರಗಳು ಮತ್ತು ವಿಜ್ಞಾನ ಪ್ರಯೋಗಗಳ ರೋಮಾಂಚಕಾರಿ ಜಗತ್ತು ನಿಮಗಾಗಿ ಕಾಯುತ್ತಿದೆ.',
    tagline: 'ಅನ್ವೇಷಿಸಿ • ಕಂಡುಹಿಡಿಯಿರಿ • ಪ್ರಯೋಗಿಸಿ • ರಚಿಸಿ',
    languageLabel: 'ಭಾಷೆ',
    chooseCharTitle: 'ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    chooseCharSubtitle: 'ಪ್ರತಿ ಮಹಾನ್ ಸಾಹಸವು ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡುವುದರಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ.',
    boyLabel: 'ಹುಡುಗ ಪಾತ್ರ',
    boyTag: 'ಹಳ್ಳಿ ಅನ್ವೇಷಕ',
    girlLabel: 'ಹುಡುಗಿ ಪಾತ್ರ',
    girlTag: 'ಹಳ್ಳಿ ಅನ್ವೇಷಕ',
    customizeToggle: 'ರೂಪ ಬದಲಿಸಿ',
    skinLabel: 'ಚರ್ಮದ ಬಣ್ಣ',
    hairLabel: 'ಕೂದಲಿನ ಶೈಲಿ',
    outfitLabel: 'ಉಡುಪು',
    colorLabel: 'ಬಣ್ಣ',
    nameTitle: 'ಸಾಹಸಿ, ನಿಮ್ಮನ್ನು ಏನೆಂದು ಕರೆಯೋಣ?',
    nameSubtitle: 'ನಿಮ್ಮ ಹಳ್ಳಿ ನೆನಪಿಟ್ಟುಕೊಳ್ಳುವ ಹೆಸರನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    namePlaceholder: 'ಉದಾ. ರವಿ, ಅನನ್ಯ, ಚೇತನ್...',
    nameError: 'ಹಳ್ಳಿಗೆ ಪ್ರವೇಶಿಸಲು ದಯವಿಟ್ಟು ಹೆಸರನ್ನು ನಮೂದಿಸಿ.',
    classTitle: 'ನೀವು ಯಾವ ತರಗತಿಯಲ್ಲಿ ಓದುತ್ತಿದ್ದೀರಿ?',
    classSubtitle: 'ನಿಮ್ಮ ತರಗತಿಗೆ ಅನುಗುಣವಾಗಿ NCERT ಸವಾಲುಗಳು ಮತ್ತು ಪ್ರಯೋಗಗಳನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತೇವೆ.',
    classPrefix: 'ತರಗತಿ',
    privacyTitle: 'ನಿಮ್ಮ ಗೌಪ್ಯತೆ ಮುಖ್ಯ',
    privacyBody:
      'ನಿಮ್ಮ ಅಡ್ಡಹೆಸರು ಮತ್ತು ಬ್ಯಾಡ್ಜ್‌ಗಳು ಈ ಸಾಧನದಲ್ಲಿಯೇ ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹವಾಗುತ್ತವೆ. ಯಾವುದೇ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ ಅಥವಾ ಸ್ಥಳವನ್ನು ಎಂದಿಗೂ ಕಳುಹಿಸಲಾಗುವುದಿಲ್ಲ.',
    aiTutorLabel: 'ಮಿತ್ರ AI ಮಾರ್ಗದರ್ಶಿ',
    aiEnabled: 'ಚಾಲೂ',
    aiDisabled: 'ಬಂದ್',
    enterCta: 'ನನ್ನ ಹಳ್ಳಿಗೆ ಪ್ರವೇಶಿಸಿ →',
    adventureTitle: 'ನಿಮ್ಮ ಸಾಹಸ ಕಾಯುತ್ತಿದೆ',
    adventures: [
      { icon: '🗺️', title: 'ಹಳ್ಳಿಯನ್ನು ಅನ್ವೇಷಿಸಿ' },
      { icon: '🧪', title: 'ವಿಜ್ಞಾನ ಪ್ರಯೋಗ ಕಂಡುಹಿಡಿಯಿರಿ' },
      { icon: '🔍', title: 'ಹಳ್ಳಿಯ ರಹಸ್ಯ ಬಿಡಿಸಿ' },
      { icon: '🛠️', title: 'ನಿರ್ಮಿಸಿ ಮತ್ತು ರಚಿಸಿ' },
      { icon: '🏆', title: 'ಸಾಧನೆಗಳನ್ನು ಗೆಲ್ಲಿರಿ' },
    ],
    heroBadge: 'ನಿಮ್ಮ ಅನ್ವೇಷಕ',
    rotateHint: 'ತಿರುಗಿಸಿ',
  },
};

const ALL_CLASSES: SupportedGrade[] = [6, 7, 8, 9, 10, 11, 12];

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, initialProfile }) => {
  const [nickname, setNickname] = useState<string>(initialProfile?.nickname || 'Ravi');
  const [lang, setLang] = useState<Lang>(initialProfile?.lang || 'en');
  const [grade, setGrade] = useState<SupportedGrade>(initialProfile?.grade || 7);
  const [appearance, setAppearance] = useState<AvatarCustomization>(() =>
    decodeAvatarId(initialProfile?.avatarId)
  );
  const [aiFeaturesEnabled, setAiFeaturesEnabled] = useState<boolean>(
    initialProfile?.aiFeaturesEnabled ?? true
  );
  const [previewDirection, setPreviewDirection] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const copy = ONBOARDING_COPY[lang];

  // Clean preview snapshots for the Boy & Girl selection cards
  const boyCardPreview = useMemo<AvatarCustomization>(
    () =>
      appearance.presentation === 'boy'
        ? appearance
        : { ...DEFAULT_BOY_AVATAR, skinTone: appearance.skinTone },
    [appearance]
  );

  const girlCardPreview = useMemo<AvatarCustomization>(
    () =>
      appearance.presentation === 'girl'
        ? appearance
        : { ...DEFAULT_GIRL_AVATAR, skinTone: appearance.skinTone },
    [appearance]
  );

  const handleSelectPresentation = (pres: CharacterPresentation) => {
    setAppearance((prev) => {
      if (prev.presentation === pres) return prev;
      return pres === 'girl'
        ? {
            ...DEFAULT_GIRL_AVATAR,
            skinTone: prev.skinTone,
          }
        : {
            ...DEFAULT_BOY_AVATAR,
            skinTone: prev.skinTone,
          };
    });
  };

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nickname.trim();
    if (!cleanName) {
      setValidationError(copy.nameError);
      return;
    }
    if (!ALL_CLASSES.includes(grade)) {
      return;
    }

    setValidationError(null);
    const encodedAvatarId = encodeAvatarId(appearance);
    const profile = await progressStore.saveProfile({
      nickname: cleanName,
      lang,
      grade,
      avatarId: encodedAvatarId,
      aiFeaturesEnabled,
    });
    onStart(profile);
  };

  const displayName = nickname.trim() || 'Adventurer';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="GaonLab Adventure Character Creation"
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden"
    >
      {/* Illustrated 2.5D Pixel-Art Village Landscape Background */}
      <VillageBackdrop />

      {/* Main Scrollable Foreground Layout */}
      <div className="relative z-10 min-h-full w-full flex flex-col items-center justify-center px-3 py-5 sm:px-6 sm:py-7">
        <div className="w-full max-w-5xl space-y-5 animate-panel-enter">
          {/* =============================================================== */}
          {/* TOP BAR: GAME-STYLE LANGUAGE SELECTOR + WELCOME BANNER          */}
          {/* =============================================================== */}
          <div className="flex flex-col items-center text-center space-y-3">
            {/* Language Selector Game Pills */}
            <div
              role="group"
              aria-label={copy.languageLabel}
              className="inline-flex items-center gap-1.5 bg-slate-950/75 backdrop-blur-md border border-amber-300/35 p-1.5 rounded-2xl shadow-xl"
            >
              {(
                [
                  { code: 'en' as Lang, label: 'English', flag: '🌐' },
                  { code: 'hi' as Lang, label: 'हिन्दी', flag: '🇮🇳' },
                  { code: 'kn' as Lang, label: 'ಕನ್ನಡ', flag: '🌿' },
                ] as const
              ).map((item) => {
                const active = lang === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLang(item.code)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 shadow-md scale-[1.03]'
                        : 'text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Welcome Adventure Header */}
            <div className="space-y-1.5 max-w-2xl px-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-200 text-[11px] font-bold tracking-wider uppercase shadow-lg">
                <span>✨</span>
                <span>{copy.tagline}</span>
                <span>✨</span>
              </div>
              <h1
                className="text-3xl sm:text-5xl font-black tracking-tight text-amber-300 drop-shadow-[0_4px_0_rgba(15,23,42,0.85)]"
                style={{ letterSpacing: '0.02em' }}
              >
                {copy.welcomeTitle}
              </h1>
              <p className="text-xs sm:text-base font-semibold text-white drop-shadow-[0_2px_4px_rgba(15,23,42,0.85)]">
                {copy.welcomeSubtitle}
              </p>
            </div>
          </div>

          {/* =============================================================== */}
          {/* TWO-COLUMN GAME CONSOLE: LEFT HERO STAGE | RIGHT CREATION FORM  */}
          {/* =============================================================== */}
          <form
            onSubmit={handleLaunch}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start"
          >
            {/* LEFT COLUMN (5 cols): LIVE CHARACTER PREVIEW + ADVENTURE AWAITS */}
            <div className="lg:col-span-5 space-y-4">
              {/* Dedicated Hero Character Preview Stage */}
              <div className="relative rounded-3xl bg-slate-950/80 backdrop-blur-md border-2 border-amber-400/45 shadow-2xl p-5 overflow-hidden">
                {/* Warm Sunlight Ambient Glow */}
                <div
                  aria-hidden="true"
                  className="animate-pedestal-glow absolute -top-12 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(251,191,36,0.34) 0%, rgba(16,185,129,0.12) 48%, rgba(15,23,42,0) 72%)',
                  }}
                />

                <div className="relative flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
                    ⭐ {copy.heroBadge}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewDirection((d) => (d + 2) % 8)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-600/80 text-slate-200 text-[10px] font-bold transition-colors cursor-pointer"
                    title="Rotate character view"
                  >
                    ↻ {copy.rotateHint}
                  </button>
                </div>

                {/* Live Floating Nickname & Class Banner */}
                <div className="relative flex flex-col items-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-slate-900/95 border border-amber-400/60 shadow-lg mb-2">
                    <span className="text-sm sm:text-base font-black text-amber-300 max-w-[160px] truncate">
                      {displayName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                      {copy.classPrefix} {grade}
                    </span>
                  </div>

                  {/* Animated Pixel-Art Character on Village Grass Pedestal */}
                  <div className="relative flex flex-col items-center justify-center py-2">
                    <AvatarPreviewCanvas
                      appearance={appearance}
                      size={148}
                      animate={true}
                      direction={previewDirection}
                      className="relative z-10 drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)] transition-transform duration-200"
                    />
                    {/* Lush Pixel Meadow Pedestal Base */}
                    <div
                      aria-hidden="true"
                      className="-mt-6 w-44 h-10 rounded-[100%] bg-gradient-to-b from-emerald-500/80 to-emerald-800/90 border-2 border-emerald-300/60 shadow-inner"
                    />
                  </div>

                  <p className="mt-2 text-[11px] font-semibold text-emerald-200/90">
                    {appearance.presentation === 'girl' ? copy.girlLabel : copy.boyLabel} •{' '}
                    {OUTFIT_STYLES.find((o) => o.id === appearance.outfitStyle)?.label}
                  </p>
                </div>
              </div>

              {/* YOUR ADVENTURE AWAITS Preview Strip */}
              <div className="rounded-3xl bg-slate-950/78 backdrop-blur-md border border-emerald-400/35 shadow-xl p-4 space-y-2.5">
                <h2 className="text-xs font-black tracking-wider uppercase text-amber-300 flex items-center gap-2">
                  <span>🧭</span>
                  <span>{copy.adventureTitle}</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                  {copy.adventures.map((adv, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 text-left ${
                        idx === copy.adventures.length - 1 ? 'col-span-2 sm:col-span-1 lg:col-span-2' : ''
                      }`}
                    >
                      <span className="text-lg leading-none shrink-0">{adv.icon}</span>
                      <span className="text-[11px] font-semibold text-slate-100 leading-tight">
                        {adv.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (7 cols): CHARACTER CREATION, NAME, CLASS, PRIVACY & CTA */}
            <div className="lg:col-span-7 rounded-3xl bg-slate-950/84 backdrop-blur-md border-2 border-amber-300/35 shadow-2xl p-4 sm:p-6 space-y-5">
              {/* 1. CHOOSE YOUR CHARACTER (BOY / GIRL + SIMPLE CUSTOMISATION) */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-sm sm:text-base font-black tracking-wide text-amber-300">
                    {copy.chooseCharTitle}
                  </h2>
                  <p className="text-xs text-slate-300">{copy.chooseCharSubtitle}</p>
                </div>

                {/* Option A: Boy Character | Option B: Girl Character */}
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      {
                        id: 'boy' as CharacterPresentation,
                        title: copy.boyLabel,
                        tag: copy.boyTag,
                        preview: boyCardPreview,
                        accent: 'from-sky-500/25 to-emerald-500/20',
                      },
                      {
                        id: 'girl' as CharacterPresentation,
                        title: copy.girlLabel,
                        tag: copy.girlTag,
                        preview: girlCardPreview,
                        accent: 'from-rose-500/25 to-amber-500/20',
                      },
                    ] as const
                  ).map((option) => {
                    const isSelected = appearance.presentation === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleSelectPresentation(option.id)}
                        className={`relative rounded-2xl p-3 border-2 flex flex-col items-center text-center transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? `bg-gradient-to-b ${option.accent} border-amber-400 shadow-[0_0_24px_rgba(251,191,36,0.32)] scale-[1.03]`
                            : 'bg-slate-900/75 border-slate-700/80 hover:border-slate-500 opacity-85 hover:opacity-100'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black flex items-center justify-center shadow">
                            ✓
                          </span>
                        )}
                        <AvatarPreviewCanvas
                          appearance={option.preview}
                          size={isSelected ? 88 : 76}
                          animate={isSelected}
                        />
                        <span className="mt-1 text-xs sm:text-sm font-black text-white tracking-wide">
                          {option.title}
                        </span>
                        <span className="text-[10px] font-semibold text-amber-200/80">
                          {option.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Simple, Fun Character Customisation Bar */}
                <div className="rounded-2xl bg-slate-900/75 border border-slate-700/70 p-3 space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Skin Tone */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {copy.skinLabel}
                      </span>
                      <div className="flex items-center gap-2">
                        {(Object.keys(SKIN_TONES) as SkinToneId[]).map((toneId) => {
                          const tone = SKIN_TONES[toneId];
                          const active = appearance.skinTone === toneId;
                          return (
                            <button
                              key={toneId}
                              type="button"
                              aria-label={`${copy.skinLabel}: ${tone.label}`}
                              onClick={() => setAppearance((p) => ({ ...p, skinTone: toneId }))}
                              className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                                active
                                  ? 'border-amber-300 scale-110 ring-2 ring-amber-400/50'
                                  : 'border-slate-600 hover:scale-105'
                              }`}
                              style={{ backgroundColor: tone.base }}
                              title={tone.label}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Outfit Colour */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {copy.colorLabel}
                      </span>
                      <div className="flex items-center gap-2">
                        {(Object.keys(OUTFIT_COLORS) as OutfitColorId[]).map((colId) => {
                          const col = OUTFIT_COLORS[colId];
                          const active = appearance.outfitColor === colId;
                          return (
                            <button
                              key={colId}
                              type="button"
                              aria-label={`${copy.colorLabel}: ${col.label}`}
                              onClick={() => setAppearance((p) => ({ ...p, outfitColor: colId }))}
                              className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                                active
                                  ? 'border-amber-300 scale-110 ring-2 ring-amber-400/50'
                                  : 'border-slate-600 hover:scale-105'
                              }`}
                              style={{ backgroundColor: col.primary }}
                              title={col.label}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Hairstyle & Outfit Style */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-800/80">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {copy.hairLabel}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {HAIR_STYLES.map((hs) => {
                          const active = appearance.hairStyle === hs.id;
                          return (
                            <button
                              key={hs.id}
                              type="button"
                              onClick={() => setAppearance((p) => ({ ...p, hairStyle: hs.id }))}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                                active
                                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                              }`}
                            >
                              {hs.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {copy.outfitLabel}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {OUTFIT_STYLES.map((os) => {
                          const active = appearance.outfitStyle === os.id;
                          return (
                            <button
                              key={os.id}
                              type="button"
                              onClick={() => setAppearance((p) => ({ ...p, outfitStyle: os.id }))}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                                active
                                  ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                              }`}
                            >
                              {os.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. STUDENT NAME (CHARACTER IDENTITY) */}
              <div className="space-y-1.5">
                <label htmlFor="adventurer-name" className="block">
                  <span className="text-sm font-black text-white block">{copy.nameTitle}</span>
                  <span className="text-[11px] text-slate-300 block">{copy.nameSubtitle}</span>
                </label>
                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg"
                  >
                    🪶
                  </span>
                  <input
                    id="adventurer-name"
                    type="text"
                    value={nickname}
                    maxLength={20}
                    onChange={(e) => {
                      setNickname(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    placeholder={copy.namePlaceholder}
                    className="w-full bg-slate-900/90 border-2 border-slate-700 focus:border-amber-400 rounded-2xl pl-11 pr-4 py-2.5 text-sm font-bold text-white placeholder:text-slate-500 outline-none transition-colors shadow-inner"
                  />
                </div>
                {validationError && (
                  <p role="alert" className="text-xs font-semibold text-rose-400">
                    {validationError}
                  </p>
                )}
              </div>

              {/* 3. CLASS SELECTION (CLASSES 6–12 CONSISTENT GAME CARDS) */}
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-black text-white block">{copy.classTitle}</span>
                  <span className="text-[11px] text-slate-300 block">{copy.classSubtitle}</span>
                </div>
                <div
                  role="group"
                  aria-label={copy.classTitle}
                  className="grid grid-cols-4 sm:grid-cols-7 gap-2"
                >
                  {ALL_CLASSES.map((g) => {
                    const isSelected = grade === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setGrade(g)}
                        className={`py-2.5 px-1.5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-b from-emerald-400 to-emerald-500 text-slate-950 border-emerald-200 shadow-[0_0_16px_rgba(16,185,129,0.45)] scale-[1.05]'
                            : 'bg-slate-900/85 border-slate-700 text-slate-200 hover:border-emerald-400/60 hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-[9px] font-bold uppercase opacity-80">
                          {copy.classPrefix}
                        </span>
                        <span className="text-base font-black leading-none mt-0.5">{g}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. YOUR PRIVACY MATTERS & AI TUTOR TOGGLE */}
              <div className="rounded-2xl bg-slate-900/85 border border-emerald-500/35 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-300 tracking-wide">
                    <span>🛡️</span>
                    <span>{copy.privacyTitle}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{copy.privacyBody}</p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={aiFeaturesEnabled}
                  onClick={() => setAiFeaturesEnabled((v) => !v)}
                  className={`shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                    aiFeaturesEnabled
                      ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-200'
                      : 'bg-slate-800/90 border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="text-[11px] font-bold whitespace-nowrap">
                    🤖 {copy.aiTutorLabel}
                  </span>
                  <span
                    className={`relative inline-flex items-center w-10 h-5 rounded-full transition-colors ${
                      aiFeaturesEnabled ? 'bg-emerald-500' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                        aiFeaturesEnabled ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </span>
                  <span className="text-[10px] font-black w-7 text-center">
                    {aiFeaturesEnabled ? copy.aiEnabled : copy.aiDisabled}
                  </span>
                </button>
              </div>

              {/* 5. PROMINENT ENTER MY VILLAGE BUTTON */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:via-orange-300 hover:to-amber-400 text-slate-950 font-black text-base sm:text-lg tracking-wide shadow-[0_6px_0_#b45309,0_12px_30px_rgba(245,158,11,0.45)] hover:shadow-[0_6px_0_#b45309,0_16px_36px_rgba(251,191,36,0.6)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_2px_0_#b45309] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>🧭</span>
                <span>{copy.enterCta}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
