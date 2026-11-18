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
  defaultName?: string;
  defaultGrade?: SupportedGrade;
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

export const StartScreen: React.FC<StartScreenProps> = ({
  onStart,
  initialProfile,
  defaultName,
  defaultGrade,
}) => {
  const [nickname, setNickname] = useState<string>(initialProfile?.nickname || defaultName || 'Ravi');
  const [lang, setLang] = useState<Lang>(initialProfile?.lang || 'en');
  const [grade, setGrade] = useState<SupportedGrade>(initialProfile?.grade || defaultGrade || 7);
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
      data-onboarding="true"
      aria-label="GaonLab Adventure Character Creation"
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden"
    >
      {/* Illustrated 2.5D Pixel-Art Village Landscape Background */}
      <VillageBackdrop />

      {/* Main Scrollable Foreground Layout */}
      <div className="relative z-10 min-h-full w-full flex flex-col items-center justify-center px-3 py-5 sm:px-6 sm:py-7">
        <div className="w-full max-w-5xl space-y-5 animate-panel-enter">
          {/* =============================================================== */}
          {/* TOP BAR: GAONLAB LANGUAGE SELECTOR + WELCOME BANNER             */}
          {/* =============================================================== */}
          <div className="flex flex-col items-center text-center space-y-3">
            {/* Language Selector Pills */}
            <div
              role="group"
              aria-label={copy.languageLabel}
              className="inline-flex items-center gap-1.5 bg-[#FFFFFF]/95 backdrop-blur-md border border-[#EFECE6] p-1.5 rounded-2xl shadow-soft-md"
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
                        ? 'bg-[#FA9C4D] text-white shadow-orange-glow scale-[1.03]'
                        : 'text-[#636160] hover:bg-[#FAF5EF] hover:text-[#352F2A]'
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF]/95 border border-[#CEECDA] text-[#389461] text-[11px] font-extrabold tracking-wider uppercase shadow-soft-sm">
                <span>✨</span>
                <span>{copy.tagline}</span>
                <span>✨</span>
              </div>
              <h1
                className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_3px_0_rgba(53,47,42,0.55)]"
                style={{ letterSpacing: '-0.01em' }}
              >
                {copy.welcomeTitle}
              </h1>
              <p className="text-xs sm:text-base font-semibold text-white drop-shadow-[0_2px_4px_rgba(53,47,42,0.55)]">
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
              <div className="relative rounded-3xl bg-[#FFFFFF]/95 backdrop-blur-md border border-[#EFECE6] shadow-soft-lg p-5 overflow-hidden text-[#352F2A]">
                {/* Warm Saffron Sunlight Ambient Glow */}
                <div
                  aria-hidden="true"
                  className="animate-pedestal-glow absolute -top-12 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(250,156,77,0.22) 0%, rgba(255,207,79,0.12) 48%, rgba(255,255,255,0) 72%)',
                  }}
                />

                <div className="relative flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-[#FFEEDD] border border-[#FFD9B8] text-[#D47220] text-[10px] font-extrabold uppercase tracking-wider">
                    ⭐ {copy.heroBadge}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewDirection((d) => (d + 2) % 8)}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF5EF] hover:bg-[#FFEEDD] border border-[#EFECE6] text-[#636160] hover:text-[#D47220] text-[10px] font-bold transition-colors cursor-pointer"
                    title="Rotate character view"
                  >
                    ↻ {copy.rotateHint}
                  </button>
                </div>

                {/* Live Floating Nickname & Class Banner */}
                <div className="relative flex flex-col items-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-[#FAF5EF] border border-[#EFECE6] shadow-soft-sm mb-2">
                    <span className="text-sm sm:text-base font-extrabold text-[#352F2A] max-w-[160px] truncate">
                      {displayName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#E8F7EE] border border-[#CEECDA] text-[#389461] text-[10px] font-bold">
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
                      className="relative z-10 drop-shadow-[0_10px_14px_rgba(53,47,42,0.22)] transition-transform duration-200"
                    />
                    {/* Lush Pixel Meadow Pedestal Base */}
                    <div
                      aria-hidden="true"
                      className="-mt-6 w-44 h-10 rounded-[100%] bg-gradient-to-b from-[#48AF76] to-[#389461] border-2 border-[#CEECDA] shadow-soft-sm"
                    />
                  </div>

                  <p className="mt-2 text-[11px] font-bold text-[#636160]">
                    {appearance.presentation === 'girl' ? copy.girlLabel : copy.boyLabel} •{' '}
                    <span className="text-[#D47220]">
                      {OUTFIT_STYLES.find((o) => o.id === appearance.outfitStyle)?.label}
                    </span>
                  </p>
                </div>
              </div>

              {/* YOUR ADVENTURE AWAITS Preview Strip */}
              <div className="rounded-3xl bg-[#FFFFFF]/95 backdrop-blur-md border border-[#EFECE6] shadow-soft-md p-4 space-y-2.5 text-[#352F2A]">
                <h2 className="text-xs font-extrabold tracking-wider uppercase text-[#D47220] flex items-center gap-2">
                  <span>🧭</span>
                  <span>{copy.adventureTitle}</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                  {copy.adventures.map((adv, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-xl bg-[#FAF5EF] border border-[#EFECE6] text-left ${
                        idx === copy.adventures.length - 1 ? 'col-span-2 sm:col-span-1 lg:col-span-2' : ''
                      }`}
                    >
                      <span className="text-lg leading-none shrink-0">{adv.icon}</span>
                      <span className="text-[11px] font-bold text-[#352F2A] leading-tight">
                        {adv.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (7 cols): CHARACTER CREATION, NAME, CLASS, PRIVACY & CTA */}
            <div className="lg:col-span-7 rounded-3xl bg-[#FFFFFF]/95 backdrop-blur-md border border-[#EFECE6] shadow-soft-lg p-4 sm:p-6 space-y-5 text-[#352F2A]">
              {/* 1. CHOOSE YOUR CHARACTER (BOY / GIRL + SIMPLE CUSTOMISATION) */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-[#352F2A]">
                    {copy.chooseCharTitle}
                  </h2>
                  <p className="text-xs text-[#636160] font-medium">{copy.chooseCharSubtitle}</p>
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
                      },
                      {
                        id: 'girl' as CharacterPresentation,
                        title: copy.girlLabel,
                        tag: copy.girlTag,
                        preview: girlCardPreview,
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
                            ? 'bg-[#FFEEDD] border-[#FA9C4D] shadow-orange-glow scale-[1.02]'
                            : 'bg-[#FBFAF9] border-[#EFECE6] hover:border-[#FFD9B8] hover:bg-[#FAF5EF]'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#FA9C4D] text-white text-[11px] font-black flex items-center justify-center shadow-soft-sm">
                            ✓
                          </span>
                        )}
                        <AvatarPreviewCanvas
                          appearance={option.preview}
                          size={isSelected ? 88 : 76}
                          animate={isSelected}
                        />
                        <span className="mt-1 text-xs sm:text-sm font-extrabold text-[#352F2A] tracking-wide">
                          {option.title}
                        </span>
                        <span className="text-[10px] font-bold text-[#D47220]">
                          {option.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Simple, Fun Character Customisation Bar */}
                <div className="rounded-2xl bg-[#FAF5EF] border border-[#EFECE6] p-3 space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Skin Tone */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9B97] block">
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
                                  ? 'border-[#FA9C4D] scale-110 ring-2 ring-[#FA9C4D]/40'
                                  : 'border-[#D9D6D0] hover:scale-105'
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
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9B97] block">
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
                                  ? 'border-[#FA9C4D] scale-110 ring-2 ring-[#FA9C4D]/40'
                                  : 'border-[#D9D6D0] hover:scale-105'
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#EFECE6]">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9B97] block">
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
                                  ? 'bg-[#FA9C4D] text-white border-[#FA9C4D]'
                                  : 'bg-[#FFFFFF] border-[#EFECE6] text-[#636160] hover:border-[#FFD9B8] hover:text-[#352F2A]'
                              }`}
                            >
                              {hs.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9B97] block">
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
                                  ? 'bg-[#48AF76] text-white border-[#48AF76]'
                                  : 'bg-[#FFFFFF] border-[#EFECE6] text-[#636160] hover:border-[#CEECDA] hover:text-[#352F2A]'
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
                  <span className="text-sm font-extrabold text-[#352F2A] block">{copy.nameTitle}</span>
                  <span className="text-[11px] text-[#636160] font-medium block">{copy.nameSubtitle}</span>
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
                    className="w-full bg-[#FBFAF9] border-2 border-[#EFECE6] focus:border-[#FA9C4D] focus:bg-[#FFFFFF] rounded-2xl pl-11 pr-4 py-2.5 text-sm font-bold text-[#352F2A] placeholder:text-[#9E9B97] outline-none transition-colors"
                  />
                </div>
                {validationError && (
                  <p role="alert" className="text-xs font-bold text-rose-600">
                    {validationError}
                  </p>
                )}
              </div>

              {/* 3. CLASS SELECTION (CLASSES 6–12 CONSISTENT GAME CARDS) */}
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-extrabold text-[#352F2A] block">{copy.classTitle}</span>
                  <span className="text-[11px] text-[#636160] font-medium block">{copy.classSubtitle}</span>
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
                            ? 'bg-[#48AF76] text-white border-[#389461] shadow-soft-md scale-[1.04]'
                            : 'bg-[#FBFAF9] border-[#EFECE6] text-[#352F2A] hover:border-[#48AF76]/60 hover:bg-[#E8F7EE]/50'
                        }`}
                      >
                        <span className={`text-[9px] font-bold uppercase ${isSelected ? 'text-white/90' : 'text-[#9E9B97]'}`}>
                          {copy.classPrefix}
                        </span>
                        <span className="text-base font-extrabold leading-none mt-0.5">{g}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. YOUR PRIVACY MATTERS & AI TUTOR TOGGLE */}
              <div className="rounded-2xl bg-[#E8F7EE]/70 border border-[#CEECDA] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#389461] tracking-wide">
                    <span>🛡️</span>
                    <span>{copy.privacyTitle}</span>
                  </div>
                  <p className="text-[11px] text-[#636160] font-medium leading-relaxed">{copy.privacyBody}</p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={aiFeaturesEnabled}
                  onClick={() => setAiFeaturesEnabled((v) => !v)}
                  className={`shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                    aiFeaturesEnabled
                      ? 'bg-[#FFFFFF] border-[#48AF76] text-[#389461] shadow-soft-sm'
                      : 'bg-[#FAF5EF] border-[#EFECE6] text-[#9E9B97]'
                  }`}
                >
                  <span className="text-[11px] font-bold whitespace-nowrap">
                    🤖 {copy.aiTutorLabel}
                  </span>
                  <span
                    className={`relative inline-flex items-center w-10 h-5 rounded-full transition-colors ${
                      aiFeaturesEnabled ? 'bg-[#48AF76]' : 'bg-[#D9D6D0]'
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                        aiFeaturesEnabled ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </span>
                  <span className="text-[10px] font-extrabold w-7 text-center">
                    {aiFeaturesEnabled ? copy.aiEnabled : copy.aiDisabled}
                  </span>
                </button>
              </div>

              {/* 5. PROMINENT ENTER MY VILLAGE BUTTON — Official GaonLab Saffron CTA */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-[#FA9C4D] hover:bg-[#EB8833] text-white font-extrabold text-base sm:text-lg tracking-wide shadow-[0_5px_0_#D47220,0_12px_28px_rgba(250,156,77,0.38)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_2px_0_#D47220] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
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
