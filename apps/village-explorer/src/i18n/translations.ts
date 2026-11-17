import { Lang } from '../learning/types';

export const TRANSLATIONS = {
  en: {
    // App & HUD
    appName: 'GaonLab Village Explorer',
    walkPrompt: 'WASD / Touch to Walk',
    labsCount: 'Labs Completed',
    xp: 'XP',
    badges: 'Badges',
    mitra: 'Mitra',
    soundOn: 'Sound: On',
    soundOff: 'Sound: Mute',
    profileSettings: 'Profile Settings',

    // Zone Prompts
    pressToEnter: 'Press E to Enter',
    tapToEnter: 'Tap to Enter Lab',

    // Lab Panel
    close: 'Close',
    experimentTab: 'Interactive Experiment',
    questionsTab: 'STEM Questions',
    questionOf: 'Question {current} of {total}',
    submitAnswer: 'Check Answer',
    nextQuestion: 'Next Question',
    finishLab: 'Finish Lab',
    correctFeedback: 'Great job!',
    incorrectFeedback: 'Not quite right. Try again or check the hints!',
    scientificPrinciple: 'Scientific Principle:',
    gradeLab: 'Grade {grade} STEM Curriculum Lab',
    labCompleted: 'Lab Completed Successfully!',
    completedDesc: 'Congratulations! You mastered all scientific principles in this village structure.',
    xpAwarded: '+100 STEM XP Awarded',
    returnToVillage: 'Return to Village',
    answerToProceed: 'Answer correctly to proceed',
    hintsTitle: 'Need a hint?',
    revealHint: 'Show Hint {level}',

    // Mitra Guide
    mitraTitle: 'Mitra — Village STEM Guide',
    mitraSubtitle: 'Grade {grade} Living Laboratory Assistant',
    mitraWelcome: 'Namaste! I am Mitra, your science guide. Our village is a living laboratory where every structure teaches physics, chemistry, biology, and mathematics.',
    villageLabs: 'Village Living Labs',
    selectStructure: 'Select any structure to learn the science behind it:',
    backToVillage: 'Back to Village',
    gradeTip: 'Grade {grade} Focus Tip',

    // Start Screen
    welcomeTitle: 'Welcome to GaonLab',
    welcomeSubtitle: 'The Village as a Living STEM Laboratory',
    chooseAvatar: 'Choose Your Avatar',
    nicknameLabel: 'Your Nickname',
    nicknamePlaceholder: 'Enter your village name or nickname',
    selectGrade: 'Select Your Grade',
    selectLang: 'Choose Learning Language',
    startExploring: 'Enter Village Living Lab',
    farmerAvatar: 'Village Cultivator',
    scientistAvatar: 'Curious Chemist',
    engineerAvatar: 'Rural Engineer',

    // Progress Screen
    learningDashboard: 'STEM Learning Mastery & Badges',
    dashboardSubtitle: 'Your scientific journey across the living laboratory',
    totalXp: 'Total STEM XP',
    completedCount: 'Labs Completed',
    earnedBadges: 'Earned STEM Badges',
    conceptMastery: 'Concept Mastery Radar',
    noConceptsYet: 'Solve questions in village structures to build concept mastery!',
    accuracy: 'Accuracy',
    attempts: 'Attempts',
  },
  hi: {
    // App & HUD
    appName: 'गाँव लैब विलेज एक्सप्लोरर',
    walkPrompt: 'चलने के लिए WASD या टच का उपयोग करें',
    labsCount: 'प्रयोगशालाएं पूर्ण',
    xp: 'अनुभव अंक (XP)',
    badges: 'बैज',
    mitra: 'मित्रा',
    soundOn: 'ध्वनि: चालू',
    soundOff: 'ध्वनि: मूक',
    profileSettings: 'प्रोफ़ाइल सेटिंग्स',

    // Zone Prompts
    pressToEnter: 'प्रवेश के लिए E दबाएँ',
    tapToEnter: 'प्रयोगशाला में प्रवेश के लिए टैप करें',

    // Lab Panel
    close: 'बंद करें',
    experimentTab: 'प्रयोगशाला सिमुलेटर',
    questionsTab: 'वैज्ञानिक प्रश्न',
    questionOf: 'प्रश्न {current} / {total}',
    submitAnswer: 'उत्तर जांचें',
    nextQuestion: 'अगला प्रश्न',
    finishLab: 'प्रयोगशाला पूर्ण करें',
    correctFeedback: 'शानदार उत्तर!',
    incorrectFeedback: 'उत्तर सही नहीं है। पुनः प्रयास करें या संकेत देखें!',
    scientificPrinciple: 'वैज्ञानिक सिद्धांत:',
    gradeLab: 'कक्षा {grade} विज्ञान पाठ्यक्रम प्रयोगशाला',
    labCompleted: 'प्रयोगशाला सफलतापूर्वक पूर्ण!',
    completedDesc: 'बधाई! आपने इस संरचना के सभी वैज्ञानिक सिद्धांतों में दक्षता प्राप्त कर ली है।',
    xpAwarded: '+100 अनुभव अंक (XP) प्राप्त',
    returnToVillage: 'गाँव में वापस जाएँ',
    answerToProceed: 'आगे बढ़ने के लिए सही उत्तर दें',
    hintsTitle: 'क्या संकेत चाहिए?',
    revealHint: 'संकेत {level} देखें',

    // Mitra Guide
    mitraTitle: 'मित्रा — गाँव विज्ञान मार्गदर्शक',
    mitraSubtitle: 'कक्षा {grade} सजीव प्रयोगशाला सहायक',
    mitraWelcome: 'नमस्ते! मैं मित्रा हूँ, आपकी विज्ञान मार्गदर्शिका। गाँव लैब में हमारा गाँव सिर्फ रहने की जगह नहीं, बल्कि एक जीवंत विज्ञान प्रयोगशाला है!',
    villageLabs: 'गाँव की प्रयोगशालाएं',
    selectStructure: 'विज्ञान समझने के लिए किसी भी स्थान पर क्लिक करें:',
    backToVillage: 'गाँव में वापस जाएँ',
    gradeTip: 'कक्षा {grade} महत्वपूर्ण सुझाव',

    // Start Screen
    welcomeTitle: 'गाँव लैब में आपका स्वागत है',
    welcomeSubtitle: 'गाँव — एक जीवंत विज्ञान प्रयोगशाला',
    chooseAvatar: 'अपना अवतार चुनें',
    nicknameLabel: 'आपका उपनाम',
    nicknamePlaceholder: 'अपना नाम या गाँव का नाम लिखें',
    selectGrade: 'अपनी कक्षा चुनें',
    selectLang: 'सीखने की भाषा चुनें',
    startExploring: 'गाँव प्रयोगशाला में प्रवेश करें',
    farmerAvatar: 'गाँव का कृषक',
    scientistAvatar: 'जिज्ञासु वैज्ञानिक',
    engineerAvatar: 'ग्रामीण इंजीनियर',

    // Progress Screen
    learningDashboard: 'विज्ञान दक्षता एवं बैज गैलरी',
    dashboardSubtitle: 'जीवंत प्रयोगशाला में आपकी वैज्ञानिक यात्रा',
    totalXp: 'कुल अनुभव अंक (XP)',
    completedCount: 'पूर्ण प्रयोगशालाएं',
    earnedBadges: 'अर्जित विज्ञान बैज',
    conceptMastery: 'अवधारणा दक्षता',
    noConceptsYet: 'दक्षता विकसित करने के लिए गाँव की प्रयोगशालाओं में प्रश्न हल करें!',
    accuracy: 'सटीकता',
    attempts: 'प्रयास',
  },
  kn: {
    // App & HUD
    appName: 'ಗಾಂವ್‌ಲ್ಯಾಬ್ ವಿಲೇಜ್ ಎಕ್ಸ್‌ಪ್ಲೋರರ್',
    walkPrompt: 'ಚಲಿಸಲು WASD ಅಥವಾ ಸ್ಪರ್ಶ ಬಳಸಿ',
    labsCount: 'ಲ್ಯಾಬ್‌ಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ',
    xp: 'ಅನುಭವ ಅಂಕಗಳು (XP)',
    badges: 'ಪದಕಗಳು',
    mitra: 'ಮಿತ್ರ',
    soundOn: 'ಧ್ವನಿ: ಆನ್',
    soundOff: 'ಧ್ವನಿ: ಮ್ಯೂಟ್',
    profileSettings: 'ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',

    // Zone Prompts
    pressToEnter: 'ಪ್ರವೇಶಿಸಲು E ಒತ್ತಿ',
    tapToEnter: 'ಲ್ಯಾಬ್ ಪ್ರವೇಶಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ',

    // Lab Panel
    close: 'ಮುಚ್ಚಿ',
    experimentTab: 'ಪ್ರಯೋಗ ಸಿಮ್ಯುಲೇಟರ್',
    questionsTab: 'ವೈಜ್ಞಾನಿಕ ಪ್ರಶ್ನೆಗಳು',
    questionOf: 'ಪ್ರಶ್ನೆ {current} / {total}',
    submitAnswer: 'ಉತ್ತರ ಪರಿಶೀಲಿಸಿ',
    nextQuestion: 'ಮುಂದಿನ ಪ್ರಶ್ನೆ',
    finishLab: 'ಲ್ಯಾಬ್ ಪೂರ್ಣಗೊಳಿಸಿ',
    correctFeedback: 'ಉತ್ತಮ ಉತ್ತರ!',
    incorrectFeedback: 'ಸರಿಯಾಗಿಲ್ಲ. ಪುನಃ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಸುಳಿವುಗಳನ್ನು ನೋಡಿ!',
    scientificPrinciple: 'ವೈಜ್ಞಾನಿಕ ತತ್ವ:',
    gradeLab: 'ತರಗತಿ {grade} ವಿಜ್ಞಾನ ಪಠ್ಯಕ್ರಮ ಲ್ಯಾಬ್',
    labCompleted: 'ಲ್ಯಾಬ್ ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ!',
    completedDesc: 'ಅಭಿನಂದನೆಗಳು! ನೀವು ಈ ರಚನೆಯ ಎಲ್ಲಾ ವೈಜ್ಞಾನಿಕ ತತ್ವಗಳನ್ನು ಕಲಿತಿದ್ದೀರಿ.',
    xpAwarded: '+100 STEM XP ಲಭಿಸಿದೆ',
    returnToVillage: 'ಗ್ರಾಮಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    answerToProceed: 'ಮುಂದುವರಿಯಲು ಸರಿಯಾಗಿ ಉತ್ತರಿಸಿ',
    hintsTitle: 'ಸುಳಿವು ಬೇಕೇ?',
    revealHint: 'ಸುಳಿವು {level} ನೋಡಿ',

    // Mitra Guide
    mitraTitle: 'ಮಿತ್ರ — ಗ್ರಾಮ ವಿಜ್ಞಾನ ಮಾರ್ಗದರ್ಶಿ',
    mitraSubtitle: 'ತರಗತಿ {grade} ಜೀವಂತ ಪ್ರಯೋಗಾಲಯ ಸಹಾಯಕ',
    mitraWelcome: 'ನಮಸ್ಕಾರ! ನಾನು ಮಿತ್ರ, ನಿಮ್ಮ ವಿಜ್ಞಾನ ಮಾರ್ಗದರ್ಶಿ. ಗಾಂವ್‌ಲ್ಯಾಬ್‌ನಲ್ಲಿ ನಮ್ಮ ಹಳ್ಳಿ ಒಂದು ಜೀವಂತ ವಿಜ್ಞಾನ ಪ್ರಯೋಗಾಲಯ!',
    villageLabs: 'ಗ್ರಾಮದ ಜೀವಂತ ಲ್ಯಾಬ್‌ಗಳು',
    selectStructure: 'ವಿಜ್ಞಾನವನ್ನು ತಿಳಿಯಲು ಯಾವುದೇ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
    backToVillage: 'ಹಳ್ಳಿಗೆ ಹಿಂತಿರುಗಿ',
    gradeTip: 'ತರಗತಿ {grade} ಸಲಹೆ',

    // Start Screen
    welcomeTitle: 'ಗಾಂವ್‌ಲ್ಯಾಬ್‌ಗೆ ಸುಸ್ವಾಗತ',
    welcomeSubtitle: 'ಗ್ರಾಮ — ಒಂದು ಜೀವಂತ ವಿಜ್ಞಾನ ಪ್ರಯೋಗಾಲಯ',
    chooseAvatar: 'ನಿಮ್ಮ ಅವತಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    nicknameLabel: 'ನಿಮ್ಮ ಹೆಸರು',
    nicknamePlaceholder: 'ನಿಮ್ಮ ಹೆಸರು ಅಥವಾ ಹಳ್ಳಿಯ ಹೆಸರನ್ನು ಬರೆಯಿರಿ',
    selectGrade: 'ನಿಮ್ಮ ತರಗತಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    selectLang: 'ಕಲಿಯುವ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    startExploring: 'ಗ್ರಾಮ ಲ್ಯಾಬ್ ಪ್ರವೇಶಿಸಿ',
    farmerAvatar: 'ಗ್ರಾಮ ಕೃಷಿಕ',
    scientistAvatar: 'ವಿಜ್ಞಾನಿ',
    engineerAvatar: 'ಗ್ರಾಮೀಣ ಇಂಜಿನಿಯರ್',

    // Progress Screen
    learningDashboard: 'ವಿಜ್ಞಾನ ಕಲಿಕೆ ಮತ್ತು ಪದಕಗಳು',
    dashboardSubtitle: 'ಜೀವಂತ ಪ್ರಯೋಗಾಲಯದಲ್ಲಿ ನಿಮ್ಮ ವೈಜ್ಞಾನಿಕ ಪಯಣ',
    totalXp: 'ಒಟ್ಟು STEM XP',
    completedCount: 'ಪೂರ್ಣಗೊಂಡ ಲ್ಯಾಬ್‌ಗಳು',
    earnedBadges: 'ಗಳಿಸಿದ ವಿಜ್ಞಾನ ಪದಕಗಳು',
    conceptMastery: 'ಪರಿಕಲ್ಪನೆಗಳ ಪ್ರಾವೀಣ್ಯತೆ',
    noConceptsYet: 'ಪ್ರಾವೀಣ್ಯತೆಯನ್ನು ಪಡೆಯಲು ಗ್ರಾಮದ ಲ್ಯಾಬ್‌ಗಳಲ್ಲಿ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ!',
    accuracy: 'ನಿಖರತೆ',
    attempts: 'ಪ್ರಯತ್ನಗಳು',
  },
} as const;

export type TranslationKey = keyof (typeof TRANSLATIONS)['en'];

export function t(lang: Lang, key: TranslationKey, params?: Record<string, string | number>): string {
  const dictionary = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  let text: string = dictionary[key] || TRANSLATIONS['en'][key] || key;

  if (params) {
    Object.entries(params).forEach(([paramKey, val]) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
    });
  }

  return text;
}
