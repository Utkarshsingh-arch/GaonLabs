import React, { useState } from 'react';
import { Lang } from '../../learning/types';
import { SupportedGrade } from '../../learning/curriculum/ncertRegistry';
import {
  formatCompactNcertCitation,
  getCurriculumById,
} from '../../learning/curriculum/curriculumMapper';
import {
  HealthEducationTier,
  isHealthTopicAccessible,
} from '../../learning/civicEngines';
import { NcertModalTarget } from '../curriculum/NcertConceptModal';

interface HospitalModalProps {
  lang: Lang;
  studentGrade: SupportedGrade;
  onClose: () => void;
  onAwardXp: (amount: number, reason: string) => void;
  onExploreNcert?: (target: NcertModalTarget) => void;
}

interface AnatomyItem {
  id: string;
  icon: string;
  name: Record<Lang, string>;
  location: Record<Lang, string>;
  fn: Record<Lang, string>;
  fact: Record<Lang, string>;
  curriculumId: string;
  svgX: number;
  svgY: number;
}

const ANATOMY_ITEMS: AnatomyItem[] = [
  {
    id: 'brain',
    icon: '🧠',
    name: { en: 'Brain', hi: 'मस्तिष्क', kn: 'ಮೆದುಳು' },
    location: { en: 'Inside the protective skull', hi: 'खोपड़ी के अंदर सुरक्षित', kn: 'ತಲೆಬುರುಡೆಯ ಒಳಗೆ' },
    fn: {
      en: 'Controls thoughts, memory, movement, senses, and automatic actions like breathing.',
      hi: 'विचार, स्मृति, गति, इंद्रियों और श्वसन जैसी क्रियाओं को नियंत्रित करता है।',
      kn: 'ಆಲೋಚನೆ, ಸ್ಮರಣೆ, ಚಲನೆ, ಇಂದ್ರಿಯಗಳು ಮತ್ತು ಉಸಿರಾಟವನ್ನು ನಿಯಂತ್ರಿಸುತ್ತದೆ.',
    },
    fact: {
      en: 'Contains ~86 billion neurons communicating via tiny electrical and chemical signals.',
      hi: 'इसमें लगभग 86 अरब तंत्रिका कोशिकाएँ (न्यूरॉन) होती हैं।',
      kn: 'ಇದರಲ್ಲಿ ಸುಮಾರು 86 ಶತಕೋಟಿ ನರಕೋಶಗಳಿವೆ.',
    },
    curriculumId: 'NCERT_SCI10_CH06_NERVOUS',
    svgX: 100,
    svgY: 32,
  },
  {
    id: 'heart',
    icon: '❤️',
    name: { en: 'Heart', hi: 'हृदय', kn: 'ಹೃದಯ' },
    location: { en: 'Centre-left of the chest behind the ribcage', hi: 'पसलियों के पीछे छाती के बाईं ओर', kn: 'ಎದೆಯ ಮಧ್ಯ-ಎಡಭಾಗದಲ್ಲಿ ಪಕ್ಕೆಲುಬುಗಳ ಹಿಂದೆ' },
    fn: {
      en: 'Four-chambered muscular pump circulating oxygen-rich blood to every body cell.',
      hi: 'चार कक्षों वाला मांसल पंप जो पूरे शरीर में ऑक्सीजन युक्त रक्त पहुँचाता है।',
      kn: 'ನಾಲ್ಕು ಕೋಣೆಗಳ ಸ್ನಾಯು ಪಂಪ್, ಆಮ್ಲಜನಕಯುಕ್ತ ರಕ್ತವನ್ನು ದೇಹದ ಎಲ್ಲಾ ಭಾಗಗಳಿಗೆ ಪೂರೈಸುತ್ತದೆ.',
    },
    fact: {
      en: 'Beats around 70–80 times per minute at rest—over 100,000 beats every single day!',
      hi: 'विश्राम के समय प्रति मिनट लगभग 70–80 बार—प्रतिदिन 1 लाख से अधिक बार धड़कता है!',
      kn: 'ವಿಶ್ರಾಂತಿಯಲ್ಲಿ ನಿಮಿಷಕ್ಕೆ ಸುಮಾರು 70–80 ಬಾರಿ ಬಡಿದುಕೊಳ್ಳುತ್ತದೆ!',
    },
    curriculumId: 'NCERT_SCI7_CH09_ANIMALS',
    svgX: 108,
    svgY: 102,
  },
  {
    id: 'lungs',
    icon: '🫁',
    name: { en: 'Lungs', hi: 'फेफड़े', kn: 'ಶ್ವಾಸಕೋಶಗಳು' },
    location: { en: 'Left and right sides of the chest cavity', hi: 'छाती के बाएँ और दाएँ हिस्से में', kn: 'ಎದೆಯ ಎಡ ಮತ್ತು ಬಲ ಭಾಗಗಳಲ್ಲಿ' },
    fn: {
      en: 'Take in fresh oxygen from inhaled air and expel carbon dioxide waste.',
      hi: 'साँस द्वारा ताज़ी ऑक्सीजन लेते हैं और कार्बन डाइऑक्साइड बाहर निकालते हैं।',
      kn: 'ಉಸಿರಾಟದ ಮೂಲಕ ಆಮ್ಲಜನಕವನ್ನು ಹೀರಿಕೊಂಡು ಕಾರ್ಬನ್ ಡೈಆಕ್ಸೈಡ್ ಹೊರಹಾಕುತ್ತವೆ.',
    },
    fact: {
      en: 'Millions of tiny air sacs called alveoli give your lungs the surface area of a tennis court.',
      hi: 'लाखों सूक्ष्म वायुकोष (एल्वियोली) ऑक्सीजन को रक्त में तेजी से पहुँचाते हैं।',
      kn: 'ಲಕ್ಷಾಂತರ ಸೂಕ್ಷ್ಮ ಗಾಳಿಚೀಲಗಳು (ಆಲ್ವಿಯೋಲಿ) ರಕ್ತಕ್ಕೆ ಆಮ್ಲಜನಕ ನೀಡುತ್ತವೆ.',
    },
    curriculumId: 'NCERT_SCI7_CH09_ANIMALS',
    svgX: 82,
    svgY: 96,
  },
  {
    id: 'stomach',
    icon: '🍽️',
    name: { en: 'Stomach', hi: 'आमाशय (पेट)', kn: 'ಜಠರ' },
    location: { en: 'Upper-left abdomen below the ribs', hi: 'पसलियों के नीचे ऊपरी बाएँ पेट में', kn: 'ಪಕ್ಕೆಲುಬುಗಳ ಕೆಳಗೆ ಮೇಲ್ಭಾಗದ ಎಡ ಹೊಟ್ಟೆಯಲ್ಲಿ' },
    fn: {
      en: 'Churns food and mixes it with digestive enzymes and mild hydrochloric acid to break down proteins.',
      hi: 'भोजन को मथता है और पाचक रसों व अम्ल के साथ मिलाकर पचाता है।',
      kn: 'ಆಹಾರವನ್ನು ಕಲಸಿ ಜೀರ್ಣಕಾರಿ ಕಿಣ್ವಗಳು ಮತ್ತು ಆಮ್ಲದೊಂದಿಗೆ ಜೀರ್ಣಿಸುತ್ತದೆ.',
    },
    fact: {
      en: 'A protective mucus layer coats the stomach wall so digestive acid does not harm it.',
      hi: 'श्लेष्मा (म्यूकस) की परत आमाशय की दीवार को अम्ल से सुरक्षित रखती है।',
      kn: 'ಲೋಳೆಯ ಪದರವು ಜಠರದ ಗೋಡೆಯನ್ನು ಆಮ್ಲದಿಂದ ರಕ್ಷಿಸುತ್ತದೆ.',
    },
    curriculumId: 'NCERT_SCI7_CH09_ANIMALS',
    svgX: 112,
    svgY: 138,
  },
  {
    id: 'liver',
    icon: '🟤',
    name: { en: 'Liver', hi: 'यकृत (लिवर)', kn: 'ಯಕೃತ್ತು (ಲಿವರ್)' },
    location: { en: 'Upper-right abdomen beneath the diaphragm', hi: 'डायफ्राम के नीचे दाएँ ऊपरी पेट में', kn: 'ಹೊಟ್ಟೆಯ ಮೇಲ್ಭಾಗದ ಬಲಬದಿಯಲ್ಲಿ' },
    fn: {
      en: 'Produces bile to digest fats, filters nutrients from blood, and stores energy as glycogen.',
      hi: 'वसा पचाने के लिए पित्त रस बनाता है और रक्त से पोषक तत्व छानता है।',
      kn: 'ಕೊಬ್ಬನ್ನು ಜೀರ್ಣಿಸಲು ಪಿತ್ತರಸ ಉತ್ಪಾದಿಸುತ್ತದೆ ಮತ್ತು ರಕ್ತವನ್ನು ಶುದ್ಧೀಕರಿಸುತ್ತದೆ.',
    },
    fact: {
      en: 'The liver is the largest internal gland in the human body.',
      hi: 'यकृत मानव शरीर की सबसे बड़ी आंतरिक ग्रंथि है।',
      kn: 'ಯಕೃತ್ತು ಮಾನವ ದೇಹದ ಅತಿದೊಡ್ಡ ಆಂತರಿಕ ಗ್ರಂಥಿಯಾಗಿದೆ.',
    },
    curriculumId: 'NCERT_SCI10_CH05_LIFE_PROCESSES',
    svgX: 84,
    svgY: 132,
  },
  {
    id: 'kidneys',
    icon: '🫘',
    name: { en: 'Kidneys', hi: 'वृक्क (किडनी)', kn: 'ಮೂತ್ರಪಿಂಡಗಳು' },
    location: { en: 'Two bean-shaped organs in the lower back', hi: 'पीठ के निचले हिस्से में दोनों ओर', kn: 'ಬೆನ್ನಿನ ಕೆಳಭಾಗದ ಎರಡೂ ಬದಿಗಳಲ್ಲಿ' },
    fn: {
      en: 'Filter urea and excess salts from blood to form urine while maintaining water balance.',
      hi: 'रक्त से यूरिया व अपशिष्ट छानकर मूत्र बनाते हैं और जल संतुलन रखते हैं।',
      kn: 'ರಕ್ತದಿಂದ ತ್ಯಾಜ್ಯಗಳನ್ನು ಶೋಧಿಸಿ ನೀರಿನ ಸಮತೋಲನ ಕಾಪಾಡುತ್ತವೆ.',
    },
    fact: {
      en: 'Drinking plenty of clean water helps your ~2 million kidney nephrons stay healthy.',
      hi: 'पर्याप्त स्वच्छ पानी पीना लगभग 20 लाख नेफ्रॉन को स्वस्थ रखता है।',
      kn: 'ಶುದ್ಧ ನೀರು ಕುಡಿಯುವುದು ಮೂತ್ರಪಿಂಡದ ನೆಫ್ರಾನ್‌ಗಳನ್ನು ಆರೋಗ್ಯವಾಗಿರಿಸುತ್ತದೆ.',
    },
    curriculumId: 'NCERT_SCI10_CH05_LIFE_PROCESSES',
    svgX: 98,
    svgY: 162,
  },
  {
    id: 'bones',
    icon: '🦴',
    name: { en: 'Bones & Skeleton', hi: 'हड्डियाँ एवं कंकाल', kn: 'ಮೂಳೆಗಳು ಮತ್ತು ಅಸ್ಥಿಪಂಜರ' },
    location: { en: 'Internal framework supporting the entire body', hi: 'पूरे शरीर का आंतरिक ढाँचा', kn: 'ಇಡೀ ದೇಹದ ಆಂತರಿಕ ಆಧಾರ ಚೌಕಟ್ಟು' },
    fn: {
      en: 'Give shape, protect vital organs (skull, ribs), and act as levers with joints for movement.',
      hi: 'शरीर को आकार देती हैं, प्रमुख अंगों की रक्षा करती हैं और जोड़ों से गति संभव बनाती हैं।',
      kn: 'ದೇಹಕ್ಕೆ ಆಕಾರ ನೀಡುತ್ತವೆ, ಪ್ರಮುಖ ಅಂಗಗಳನ್ನು ರಕ್ಷಿಸುತ್ತವೆ ಮತ್ತು ಚಲನೆಗೆ ನೆರವಾಗುತ್ತವೆ.',
    },
    fact: {
      en: 'Calcium-rich foods like ragi, milk, and leafy greens build strong growing bones!',
      hi: 'रागी, दूध और हरी सब्ज़ियों का कैल्शियम बढ़ती हड्डियों को मजबूत बनाता है!',
      kn: 'ರಾಗಿ, ಹಾಲು ಮತ್ತು ಹಸಿರು ಸೊಪ್ಪಿನ ಕ್ಯಾಲ್ಸಿಯಂ ಮೂಳೆಗಳನ್ನು ಬಲಪಡಿಸುತ್ತದೆ!',
    },
    curriculumId: 'NCERT_SCI6_CH10_LIVING',
    svgX: 60,
    svgY: 184,
  },
  {
    id: 'muscles',
    icon: '💪',
    name: { en: 'Muscles', hi: 'मांसपेशियाँ', kn: 'ಸ್ನಾಯುಗಳು' },
    location: { en: 'Attached to bones across arms, legs, and torso', hi: 'हाथों, पैरों और धड़ की हड्डियों से जुड़ी', kn: 'ಕೈ, ಕಾಲು ಮತ್ತು ದೇಹದ ಮೂಳೆಗಳಿಗೆ ಜೋಡಣೆಗೊಂಡಿವೆ' },
    fn: {
      en: 'Contract and relax in pairs to pull bones and power walking, lifting, and posture.',
      hi: 'जोड़ों में सिकुड़कर और फैलकर हड्डियों को खींचती हैं तथा गति कराती हैं।',
      kn: 'ಜೋಡಿಯಾಗಿ ಸಂಕುಚಿಸಿ ಮತ್ತು ಸಡಿಲಗೊಂಡು ಮೂಳೆಗಳನ್ನು ಚಲಿಸುತ್ತವೆ.',
    },
    fact: {
      en: 'Muscles can only pull—never push—which is why biceps and triceps work as opposite pairs!',
      hi: 'मांसपेशियाँ केवल खींच सकती हैं, इसलिए वे विपरीत जोड़ों में काम करती हैं!',
      kn: 'ಸ್ನಾಯುಗಳು ಕೇವಲ ಎಳೆಯಬಲ್ಲವು—ಆದ್ದರಿಂದ ಅವು ಜೋಡಿಯಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತವೆ!',
    },
    curriculumId: 'NCERT_SCI6_CH10_LIVING',
    svgX: 142,
    svgY: 118,
  },
  {
    id: 'digestive',
    icon: '🥣',
    name: { en: 'Digestive System', hi: 'पाचन तंत्र', kn: 'ಜೀರ್ಣಾಂಗ ವ್ಯವಸ್ಥೆ' },
    location: { en: 'Mouth, food pipe, stomach, and intestines', hi: 'मुख, ग्रसिका, आमाशय और आँतें', kn: 'ಬಾಯಿ, ಅನ್ನನಾಳ, ಜಠರ ಮತ್ತು ಕರುಳುಗಳು' },
    fn: {
      en: 'Breaks complex carbohydrates, proteins, and fats into absorbable nutrients via small-intestine villi.',
      hi: 'जटिल भोजन को सरल पोषक तत्वों में तोड़कर छोटी आँत के रसांकुरों द्वारा अवशोषित करता है।',
      kn: 'ಆಹಾರವನ್ನು ಸರಳ ಪೋಷಕಾಂಶಗಳಾಗಿ ಒಡೆದು ಸಣ್ಣ ಕರುಳಿನ ಮೂಲಕ ರಕ್ತಕ್ಕೆ ಹೀರಿಕೊಳ್ಳುತ್ತದೆ.',
    },
    fact: {
      en: 'Digestion starts right in the mouth when saliva begins breaking down starch!',
      hi: 'पाचन मुख से ही शुरू हो जाता है जब लार स्टार्च को तोड़ती है!',
      kn: 'ಬಾಯಿಯ ಲಾಲಾರಸದಿಂದಲೇ ಪಿಷ್ಟದ ಜೀರ್ಣಕ್ರಿಯೆ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ!',
    },
    curriculumId: 'NCERT_SCI7_CH09_ANIMALS',
    svgX: 100,
    svgY: 178,
  },
  {
    id: 'respiratory',
    icon: '💨',
    name: { en: 'Respiratory System', hi: 'श्वसन तंत्र', kn: 'ಉಸಿರಾಟದ ವ್ಯವಸ್ಥೆ' },
    location: { en: 'Nose, windpipe (trachea), lungs, and diaphragm', hi: 'नाक, श्वासनली, फेफड़े और डायफ्राम', kn: 'ಮೂಗು, ಶ್ವಾಸನಾಳ, ಶ್ವಾಸಕೋಶ ಮತ್ತು ವಪೆ' },
    fn: {
      en: 'Delivers oxygen to cells to release energy from glucose during cellular respiration.',
      hi: 'कोशिकाओं को ऑक्सीजन पहुँचाता है ताकि ग्लूकोज़ से ऊर्जा मुक्त हो सके।',
      kn: 'ಕೋಶಗಳಿಗೆ ಆಮ್ಲಜನಕ ನೀಡಿ ಗ್ಲೂಕೋಸ್‌ನಿಂದ ಶಕ್ತಿ ಬಿಡುಗಡೆ ಮಾಡುತ್ತದೆ.',
    },
    fact: {
      en: 'The dome-shaped diaphragm flattens downward every time you inhale fresh air.',
      hi: 'जब आप साँस अंदर लेते हैं तो डायफ्राम नीचे की ओर चपटा हो जाता है।',
      kn: 'ನೀವು ಉಸಿರು ಎಳೆದುಕೊಂಡಾಗ ವಪೆ (ಡಯಾಫ್ರಾಮ್) ಕೆಳಗೆ ಚಪ್ಪಟೆಯಾಗುತ್ತದೆ.',
    },
    curriculumId: 'NCERT_SCI7_CH09_ANIMALS',
    svgX: 118,
    svgY: 90,
  },
  {
    id: 'circulatory',
    icon: '🩸',
    name: { en: 'Circulatory System', hi: 'परिसंचरण तंत्र', kn: 'ರಕ್ತಪರಿಚಲನಾ ವ್ಯವಸ್ಥೆ' },
    location: { en: 'Heart, arteries, veins, and capillaries', hi: 'हृदय, धमनियाँ, शिराएँ और केशिकाएँ', kn: 'ಹೃದಯ, ಅಪಧಮನಿಗಳು, ಅಭಿಧಮನಿಗಳು ಮತ್ತು ಲೋಮನಾಳಗಳು' },
    fn: {
      en: 'Transports oxygen, digested nutrients, hormones, and immune cells throughout the entire body.',
      hi: 'पूरे शरीर में ऑक्सीजन, पोषक तत्व, हार्मोन और प्रतिरक्षा कोशिकाओं का परिवहन करता है।',
      kn: 'ದೇಹದಾದ್ಯಂತ ಆಮ್ಲಜನಕ, ಪೋಷಕಾಂಶಗಳು ಮತ್ತು ಹಾರ್ಮೋನುಗಳನ್ನು ಸಾಗಿಸುತ್ತದೆ.',
    },
    fact: {
      en: 'Arteries carry blood away from the heart while veins return blood back to the heart.',
      hi: 'धमनियाँ रक्त को हृदय से दूर ले जाती हैं और शिराएँ वापस हृदय में लाती हैं।',
      kn: 'ಅಪಧಮನಿಗಳು ರಕ್ತವನ್ನು ಹೃದಯದಿಂದ ಹೊರಕ್ಕೆ ಮತ್ತು ಅಭಿಧಮನಿಗಳು ಹೃದಯಕ್ಕೆ ಮರಳಿ ತರುತ್ತವೆ.',
    },
    curriculumId: 'NCERT_SCI10_CH05_LIFE_PROCESSES',
    svgX: 74,
    svgY: 114,
  },
  {
    id: 'nervous',
    icon: '⚡',
    name: { en: 'Nervous System', hi: 'तंत्रिका तंत्र', kn: 'ನರವ್ಯೂಹ' },
    location: { en: 'Brain, spinal cord, and branching nerves', hi: 'मस्तिष्क, मेरुरज्जु और तंत्रिकाएँ', kn: 'ಮೆದುಳು, ಬೆನ್ನುಹುರಿ ಮತ್ತು ನರಗಳು' },
    fn: {
      en: 'Senses heat, sound, light, and touch, triggering fast protective reflex actions.',
      hi: 'ऊष्मा, ध्वनि, प्रकाश और स्पर्श को महसूस कर त्वरित प्रतिवर्ती क्रियाएँ करता है।',
      kn: 'ಉಷ್ಣ, ಧ್ವನಿ, ಬೆಳಕು ಮತ್ತು ಸ್ಪರ್ಶವನ್ನು ಗ್ರಹಿಸಿ ವೇಗದ ಪ್ರತಿಕ್ರಿಯೆ ನೀಡುತ್ತದೆ.',
    },
    fact: {
      en: 'Pulling your hand back from a hot vessel happens in milliseconds via the spinal reflex arc!',
      hi: 'गर्म बर्तन से हाथ तुरंत हटाना मेरुरज्जु के प्रतिवर्ती चाप के कारण मिलीसेकंड में होता है!',
      kn: 'ಬಿಸಿ ಪಾತ್ರೆಯಿಂದ ಕೈ ಹಿಂದೆ ಎಳೆಯುವುದು ಬೆನ್ನುಹುರಿಯ ರಿಫ್ಲೆಕ್ಸ್ ಕ್ರಿಯೆಯಿಂದ ಕ್ಷಣಾರ್ಧದಲ್ಲಿ ನಡೆಯುತ್ತದೆ!',
    },
    curriculumId: 'NCERT_SCI10_CH06_NERVOUS',
    svgX: 100,
    svgY: 56,
  },
];

interface GrowingUpTopic {
  id: string;
  minTier: HealthEducationTier;
  icon: string;
  title: Record<Lang, string>;
  summary: Record<Lang, string>;
  keyPoints: Record<Lang, string[]>;
  curriculumId: string;
  showMenstrualTimeline?: boolean;
  showReproductiveDiagram?: boolean;
}

const GROWING_UP_TOPICS: GrowingUpTopic[] = [
  {
    id: 'personal_hygiene',
    minTier: 'foundational',
    icon: '🧼',
    title: {
      en: 'Personal Hygiene & Healthy Habits',
      hi: 'व्यक्तिगत स्वच्छता और स्वस्थ आदतें',
      kn: 'ವೈಯಕ್ತಿಕ ಸ್ವಚ್ಛತೆ ಮತ್ತು ಆರೋಗ್ಯಕರ ಅಭ್ಯಾಸಗಳು',
    },
    summary: {
      en: 'As your body grows, sweat and oil glands become more active. Daily bathing with clean water and soap, washing hands, wearing clean cotton clothes, and eating balanced iron-rich meals keep you healthy and confident.',
      hi: 'शरीर के बढ़ने के साथ पसीने और तेल की ग्रंथियाँ अधिक सक्रिय हो जाती हैं। रोज़ स्नान, साफ कपड़े और संतुलित पौष्टिक भोजन आपको स्वस्थ व आत्मविश्वासी रखते हैं।',
      kn: 'ದೇಹ ಬೆಳೆದಂತೆ ಬೆವರು ಮತ್ತು ತೈಲ ಗ್ರಂಥಿಗಳು ಹೆಚ್ಚು ಸಕ್ರಿಯವಾಗುತ್ತವೆ. ಪ್ರತಿದಿನ ಸ್ನಾನ, ಶುದ್ಧ ಬಟ್ಟೆ ಮತ್ತು ಸಮತೋಲಿತ ಆಹಾರ ನಿಮ್ಮನ್ನು ಆರೋಗ್ಯವಾಗಿರಿಸುತ್ತದೆ.',
    },
    keyPoints: {
      en: [
        'Wash hands with soap before meals and after using the toilet.',
        'Bathe regularly and keep undergarments clean and dry.',
        'Eat iron- and protein-rich foods like leafy greens, pulses, jaggery, and ragi.',
      ],
      hi: [
        'भोजन से पहले और शौच के बाद साबुन से हाथ धोएँ।',
        'नियमित स्नान करें और साफ-सूखे कपड़े पहनें।',
        'हरी सब्ज़ियाँ, दालें, गुड़ और रागी जैसे पौष्टिक भोजन खाएँ।',
      ],
      kn: [
        'ಊಟಕ್ಕೆ ಮುನ್ನ ಮತ್ತು ಶೌಚಾಲಯದ ನಂತರ ಸಾಬೂನಿನಿಂದ ಕೈ ತೊಳೆಯಿರಿ.',
        'ನಿಯಮಿತವಾಗಿ ಸ್ನಾನ ಮಾಡಿ ಮತ್ತು ಶುದ್ಧ ಒಣ ಬಟ್ಟೆ ಧರಿಸಿ.',
        'ಸೊಪ್ಪು, ಬೇಳೆ, ಬೆಲ್ಲ ಮತ್ತು ರಾಗಿಯಂತಹ ಪೌಷ್ಟಿಕ ಆಹಾರ ಸೇವಿಸಿ.',
      ],
    },
    curriculumId: 'NCERT_SCI8_CH03_HEALTH',
  },
  {
    id: 'boundaries_consent',
    minTier: 'foundational',
    icon: '🤝',
    title: {
      en: 'Personal Boundaries, Consent & Respect',
      hi: 'व्यक्तिगत सीमाएँ, सहमति और सम्मान',
      kn: 'ವೈಯಕ್ತಿಕ ಗಡಿಗಳು, ಒಪ್ಪಿಗೆ ಮತ್ತು ಗೌರವ',
    },
    summary: {
      en: 'Your body belongs to you. Everyone deserves privacy, dignity, and respect. Consent means clear, willing agreement—never pressure. If anyone makes you feel unsafe or uncomfortable, you have the right to say "No" and tell a trusted parent, teacher, or doctor.',
      hi: 'आपका शरीर आपका है। हर व्यक्ति को निजता और सम्मान का अधिकार है। सहमति का अर्थ बिना किसी दबाव के स्पष्ट स्वीकृति है। असहज महसूस होने पर "नहीं" कहना और विश्वसनीय बड़ों या डॉक्टर को बताना हमेशा सही है।',
      kn: 'ನಿಮ್ಮ ದೇಹ ನಿಮಗೆ ಸೇರಿದ್ದು. ಪ್ರತಿಯೊಬ್ಬರಿಗೂ ಗೌರವ ಮತ್ತು ಖಾಸಗಿತನದ ಹಕ್ಕಿದೆ. ಒಪ್ಪಿಗೆ ಎಂದರೆ ಯಾವುದೇ ಒತ್ತಡವಿಲ್ಲದ ಸಮ್ಮತಿ. ಅಸುರಕ್ಷಿತ ಎನಿಸಿದರೆ "ಇಲ್ಲ" ಎಂದು ಹೇಳಿ ನಂಬಿಕಸ್ತ ಪೋಷಕರು, ಶಿಕ್ಷಕರು ಅಥವಾ ವೈದ್ಯರಿಗೆ ತಿಳಿಸಿ.',
    },
    keyPoints: {
      en: [
        'Respect your own boundaries and always respect the boundaries of others.',
        'No one should ever touch you in a way that feels unsafe, secret, or uncomfortable.',
        'Trusted adults—parents, school teachers, and village healthcare workers—are safe people to ask for help.',
      ],
      hi: [
        'अपनी और दूसरों की व्यक्तिगत सीमाओं का सम्मान करें।',
        'असुरक्षित या असहज स्पर्श के लिए स्पष्ट "नहीं" कहें।',
        'माता-पिता, शिक्षक या स्वास्थ्य कर्मी से खुलकर सहायता लें।',
      ],
      kn: [
        'ನಿಮ್ಮ ಮತ್ತು ಇತರರ ವೈಯಕ್ತಿಕ ಗಡಿಗಳನ್ನು ಗೌರವಿಸಿ.',
        'ಅಸುರಕ್ಷಿತ ಅಥವಾ ಅಸಹಜ ಸ್ಪರ್ಶಕ್ಕೆ ಧೈರ್ಯವಾಗಿ "ಇಲ್ಲ" ಎನ್ನಿ.',
        'ಪೋಷಕರು, ಶಿಕ್ಷಕರು ಅಥವಾ ವೈದ್ಯರ ಬಳಿ ಮುಕ್ತವಾಗಿ ಸಹಾಯ ಕೇಳಿ.',
      ],
    },
    curriculumId: 'EXT_BOUNDARIES_CONSENT',
  },
  {
    id: 'puberty_changes',
    minTier: 'middle_puberty',
    icon: '🌱',
    title: {
      en: 'Understanding Puberty: Physical & Emotional Changes',
      hi: 'किशोरावस्था (प्यूबर्टी): शारीरिक और भावनात्मक बदलाव',
      kn: 'ಪ್ರೌಢಾವಸ್ಥೆ (ಪ್ಯೂಬರ್ಟಿ): ದೈಹಿಕ ಮತ್ತು ಭಾವನಾತ್ಮಕ ಬದಲಾವಣೆಗಳು',
    },
    summary: {
      en: 'Puberty (typically starting between ages 10 and 15) is the natural stage when chemical messengers called hormones guide your body from childhood toward adulthood. Everyone begins and progresses at their own unique pace.',
      hi: 'किशोरावस्था (आमतौर पर 10 से 15 वर्ष के बीच) वह प्राकृतिक चरण है जब हार्मोन शरीर को बचपन से वयस्कता की ओर विकसित करते हैं। हर व्यक्ति में ये बदलाव अलग-अलग समय पर होते हैं।',
      kn: 'ಪ್ರೌಢಾವಸ್ಥೆ (ಸಾಮಾನ್ಯವಾಗಿ 10–15 ವಯಸ್ಸಿನಲ್ಲಿ) ಹಾರ್ಮೋನುಗಳ ಮೂಲಕ ದೇಹವು ಬಾಲ್ಯದಿಂದ ವಯಸ್ಕ ಹಂತಕ್ಕೆ ಬೆಳೆಯುವ ಸಹಜ ಪ್ರಕ್ರಿಯೆಯಾಗಿದೆ. ಪ್ರತಿಯೊಬ್ಬರಲ್ಲೂ ಇದು ತಮ್ಮದೇ ವೇಗದಲ್ಲಿ ನಡೆಯುತ್ತದೆ.',
    },
    keyPoints: {
      en: [
        'Growth spurt in height, voice deepening (especially in boys), body hair, and skin changes are completely normal.',
        'Mood swings, new questions, and stronger feelings happen because brain and hormones are maturing.',
        'Comparing your pace to friends is unnecessary—every healthy body has its own biological clock.',
      ],
      hi: [
        'लंबाई बढ़ना, आवाज़ में बदलाव, शरीर पर बाल और त्वचा के बदलाव पूरी तरह सामान्य हैं।',
        'हार्मोन बदलाव के कारण भावनाओं में उतार-चढ़ाव आना स्वाभाविक है।',
        'प्रत्येक व्यक्ति के शरीर की अपनी प्राकृतिक गति होती है।',
      ],
      kn: [
        'ಎತ್ತರ ಹೆಚ್ಚಾಗುವುದು, ಧ್ವನಿ ಬದಲಾವಣೆ ಮತ್ತು ದೇಹದ ಬೆಳವಣಿಗೆ ಸಂಪೂರ್ಣ ಸಹಜ.',
        'ಹಾರ್ಮೋನುಗಳ ಬದಲಾವಣೆಯಿಂದ ಭಾವನೆಗಳಲ್ಲಿ ಏರಿಳಿತವಾಗುವುದು ಸಹಜ.',
        'ಪ್ರತಿಯೊಬ್ಬರ ದೇಹಕ್ಕೂ ತನ್ನದೇ ಆದ ನೈಸರ್ಗಿಕ ವೇಗವಿರುತ್ತದೆ.',
      ],
    },
    curriculumId: 'NCERT_SCI7_CH06_ADOLESCENCE',
  },
  {
    id: 'menstruation_hygiene',
    minTier: 'middle_puberty',
    icon: '🗓️',
    title: {
      en: 'Menstrual Cycle & Menstrual Hygiene',
      hi: 'मासिक धर्म चक्र और मासिक धर्म स्वच्छता',
      kn: 'ಋತುಚಕ್ರ ಮತ್ತು ಋತುಚಕ್ರದ ಸ್ವಚ್ಛತೆ',
    },
    summary: {
      en: 'Menstruation (periods) is a healthy, natural monthly biological cycle (usually 28–30 days) in adolescent girls and women where the uterus sheds its temporary nutrient-rich lining. It is a sign of normal healthy body function—never impure or shameful.',
      hi: 'मासिक धर्म किशोरियों और महिलाओं में लगभग हर 28–30 दिन होने वाली एक सामान्य, स्वस्थ जैविक प्रक्रिया है। यह शरीर के स्वस्थ कामकाज का संकेत है—इसमें कोई शर्म या अशुद्धता नहीं है।',
      kn: 'ಋತುಚಕ್ರ (ಪಿರಿಯಡ್ಸ್) ಹದಿಹರೆಯದ ಹುಡುಗಿಯರು ಮತ್ತು ಮಹಿಳೆಯರಲ್ಲಿ ಪ್ರತಿ 28–30 ದಿನಗಳಿಗೊಮ್ಮೆ ನಡೆಯುವ ಸಹಜ, ಆರೋಗ್ಯಕರ ಜೈವಿಕ ಪ್ರಕ್ರಿಯೆ. ಇದು ಎಂದಿಗೂ ಅಶುದ್ಧ ಅಥವಾ ನಾಚಿಕೆಯ ವಿಷಯವಲ್ಲ.',
    },
    keyPoints: {
      en: [
        'Use clean sanitary pads or clean, sun-dried cotton cloths and change every 4–6 hours.',
        'Wrap used disposable pads in paper and dispose of them in a covered dustbin—never flush them.',
        'Stay hydrated, eat iron-rich foods, and consult a doctor if pain or bleeding is unusually severe.',
      ],
      hi: [
        'स्वच्छ सैनिटरी पैड या धूप में सुखाए साफ सूती कपड़े का उपयोग करें और हर 4–6 घंटे में बदलें।',
        'उपयोग किए गए पैड को कागज़ में लपेटकर ढके कूड़ेदान में डालें।',
        'अधिक दर्द या समस्या होने पर माता-पिता या डॉक्टर से परामर्श लें।',
      ],
      kn: [
        'ಶುದ್ಧ ಸ್ಯಾನಿಟರಿ ಪ್ಯಾಡ್ ಅಥವಾ ಬಿಸಿಲಿನಲ್ಲಿ ಒಣಗಿಸಿದ ಶುದ್ಧ ಹತ್ತಿ ಬಟ್ಟೆಯನ್ನು ಪ್ರತಿ 4–6 ಗಂಟೆಗೊಮ್ಮೆ ಬದಲಿಸಿ.',
        'ಬಳಸಿದ ಪ್ಯಾಡ್‌ಗಳನ್ನು ಕಾಗದದಲ್ಲಿ ಸುತ್ತಿ ಮುಚ್ಚಿದ ಕಸದ ಬುಟ್ಟಿಯಲ್ಲಿ ಹಾಕಿ.',
        'ತೀವ್ರ ನೋವು ಇದ್ದರೆ ಪೋಷಕರು ಅಥವಾ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
      ],
    },
    curriculumId: 'NCERT_SCI7_CH06_ADOLESCENCE',
    showMenstrualTimeline: true,
  },
  {
    id: 'reproductive_systems',
    minTier: 'secondary_repro',
    icon: '🔬',
    title: {
      en: 'Male & Female Reproductive Systems, Fertilisation & Prenatal Development',
      hi: 'नर एवं मादा प्रजनन तंत्र, निषेचन और भ्रूण विकास',
      kn: 'ಪುರುಷ ಮತ್ತು ಸ್ತ್ರೀ ಸಂತಾನೋತ್ಪತ್ತಿ ವ್ಯವಸ್ಥೆ, ಫಲೀಕರಣ ಮತ್ತು ಭ್ರೂಣ ಬೆಳವಣಿಗೆ',
    },
    summary: {
      en: 'As taught in NCERT Class 10 Science Chapter 7, the male system (testes, vas deferens) produces sperm and testosterone, while the female system (ovaries, fallopian tubes, uterus) produces eggs (ova) and nurtures a developing baby. Fertilisation occurs when one sperm fuses with an egg in the fallopian tube, forming a zygote that grows in the uterus nourished by the placenta.',
      hi: 'NCERT कक्षा 10 विज्ञान अध्याय 7 के अनुसार, नर प्रजनन तंत्र (वृषण) शुक्राणु और मादा तंत्र (अंडाशय, अंडवाहिनी, गर्भाशय) अंडाणु उत्पन्न करते हैं। अंडवाहिनी में शुक्राणु और अंडाणु के संलयन (निषेचन) से युग्मनज बनता है, जो गर्भाशय में प्लेसेंटा से पोषण पाकर विकसित होता है।',
      kn: 'NCERT ತರಗತಿ 10 ವಿಜ್ಞಾನ ಅಧ್ಯಾಯ 7ರ ಪ್ರಕಾರ, ಪುರುಷ ವ್ಯವಸ್ಥೆಯು ವೀರ್ಯಾಣುಗಳನ್ನು ಮತ್ತು ಸ್ತ್ರೀ ವ್ಯವಸ್ಥೆಯು ಅಂಡಾಣುಗಳನ್ನು ಉತ್ಪಾದಿಸುತ್ತದೆ. ಫಾಲೋಪಿಯನ್ ನಾಳದಲ್ಲಿ ಫಲೀಕರಣ ನಡೆದು ಗರ್ಭಾಶಯದಲ್ಲಿ ಪ್ಲಾಸೆಂಟಾ ಮೂಲಕ ಭ್ರೂಣವು ಪೋಷಣೆ ಪಡೆದು ಬೆಳೆಯುತ್ತದೆ.',
    },
    keyPoints: {
      en: [
        'Ovaries release one mature egg roughly once a month (ovulation); testes produce sperm cells.',
        'Fertilisation forms a single-celled zygote that divides into an embryo and attaches to the uterine wall.',
        'During pregnancy (~9 months), the placenta supplies oxygen and nutrients from mother to developing baby.',
      ],
      hi: [
        'अंडाशय हर माह एक परिपक्व अंडाणु मुक्त करते हैं; वृषण शुक्राणु बनाते हैं।',
        'निषेचन से बना युग्मनज विभाजित होकर भ्रूण के रूप में गर्भाशय में विकसित होता है।',
        'गर्भावस्था (~9 माह) में प्लेसेंटा माँ से शिशु को ऑक्सीजन और पोषक तत्व पहुँचाता है।',
      ],
      kn: [
        'ಅಂಡಾಶಯವು ಪ್ರತಿ ತಿಂಗಳು ಒಂದು ಅಂಡಾಣು ಬಿಡುಗಡೆ ಮಾಡುತ್ತದೆ; ವೃಷಣಗಳು ವೀರ್ಯಾಣು ಉತ್ಪಾದಿಸುತ್ತವೆ.',
        'ಫಲೀಕರಣದಿಂದ ಉಂಟಾದ ಯುಗ್ಮಜವು ಭ್ರೂಣವಾಗಿ ಗರ್ಭಾಶಯದಲ್ಲಿ ಬೆಳೆಯುತ್ತದೆ.',
        'ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ (~9 ತಿಂಗಳು) ಪ್ಲಾಸೆಂಟಾ ಮಗುವಿಗೆ ಆಮ್ಲಜನಕ ಮತ್ತು ಪೋಷಕಾಂಶ ನೀಡುತ್ತದೆ.',
      ],
    },
    curriculumId: 'NCERT_SCI10_CH07_REPRODUCTION',
    showReproductiveDiagram: true,
  },
  {
    id: 'reproductive_health_senior',
    minTier: 'senior_biology',
    icon: '🩺',
    title: {
      en: 'Reproductive Health Awareness & Clinical Biology (Classes 11–12)',
      hi: 'प्रजनन स्वास्थ्य जागरूकता एवं उच्च जीवविज्ञान (कक्षा 11–12)',
      kn: 'ಸಂತಾನೋತ್ಪತ್ತಿ ಆರೋಗ್ಯ ಜಾಗೃತಿ ಮತ್ತು ಉನ್ನತ ಜೀವಶಾಸ್ತ್ರ (ತರಗತಿ 11–12)',
    },
    summary: {
      en: 'Aligned with NCERT Class 12 Biology Chapters 2 & 3: Reproductive health covers physical, emotional, and social well-being, understanding hormonal regulation (FSH, LH, oestrogen, progesterone), preventing reproductive tract infections through hygiene and medical awareness, maternal nutrition, and consulting qualified healthcare professionals.',
      hi: 'NCERT कक्षा 12 जीवविज्ञान अध्याय 2 व 3 के अनुसार: प्रजनन स्वास्थ्य में हार्मोनल नियंत्रण (FSH, LH, एस्ट्रोजन, प्रोजेस्टेरोन), संक्रमणों से बचाव, मातृ पोषण और योग्य चिकित्सक से परामर्श शामिल हैं।',
      kn: 'NCERT ತರಗತಿ 12 ಜೀವಶಾಸ್ತ್ರ ಅಧ್ಯಾಯ 2 ಮತ್ತು 3ರ ಪ್ರಕಾರ: ಹಾರ್ಮೋನುಗಳ ನಿಯಂತ್ರಣ (FSH, LH, ಈಸ್ಟ್ರೊಜೆನ್, ಪ್ರೊಜೆಸ್ಟೆರಾನ್), ಸೋಂಕುಗಳ ತಡೆಗಟ್ಟುವಿಕೆ ಮತ್ತು ಅರ್ಹ ವೈದ್ಯಕೀಯ ಮಾರ್ಗದರ್ಶನ ಅತ್ಯಗತ್ಯ.',
    },
    keyPoints: {
      en: [
        'Pituitary hormones (FSH, LH) and ovarian hormones coordinate ovulation and the 28-day menstrual cycle.',
        'Preventive awareness and early medical consultation protect against reproductive tract infections.',
        'Always rely on qualified doctors or government Primary Health Centres (PHCs)—never unverified rumours.',
      ],
      hi: [
        'पीयूष ग्रंथि (FSH, LH) व अंडाशय के हार्मोन मासिक धर्म चक्र को नियंत्रित करते हैं।',
        'स्वच्छता, वैज्ञानिक जानकारी और समय पर डॉक्टरी जाँच संक्रमणों से बचाती है।',
        'सदैव प्रमाणित डॉक्टर या प्राथमिक स्वास्थ्य केंद्र (PHC) की सलाह लें।',
      ],
      kn: [
        'ಪಿಟ್ಯುಟರಿ (FSH, LH) ಮತ್ತು ಅಂಡಾಶಯದ ಹಾರ್ಮೋನುಗಳು ಋತುಚಕ್ರವನ್ನು ನಿಯಂತ್ರಿಸುತ್ತವೆ.',
        'ಸ್ವಚ್ಛತೆ ಮತ್ತು ಸಮಯಕ್ಕೆ ಸರಿಯಾದ ವೈದ್ಯಕೀಯ ಸಲಹೆ ಸೋಂಕುಗಳನ್ನು ತಡೆಯುತ್ತದೆ.',
        'ಯಾವಾಗಲೂ ಅರ್ಹ ವೈದ್ಯರು ಅಥವಾ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ.',
      ],
    },
    curriculumId: 'NCERT_BIO12_CH03_REPRO_HEALTH',
  },
];

interface MythItem {
  id: string;
  statement: Record<Lang, string>;
  isScienceFact: boolean;
  explanation: Record<Lang, string>;
  curriculumId: string;
}

const HEALTH_MYTHS: MythItem[] = [
  {
    id: 'myth_menstruation',
    statement: {
      en: 'Menstruation is a normal, healthy biological process and can be discussed openly with respect.',
      hi: 'मासिक धर्म एक सामान्य, स्वस्थ जैविक प्रक्रिया है और इस पर सम्मानपूर्वक बात की जा सकती है।',
      kn: 'ಋತುಚಕ್ರವು ಸಹಜ ಮತ್ತು ಆರೋಗ್ಯಕರ ಜೈವಿಕ ಪ್ರಕ್ರಿಯೆಯಾಗಿದ್ದು, ಗೌರವಯುತವಾಗಿ ಚರ್ಚಿಸಬಹುದು.',
    },
    isScienceFact: true,
    explanation: {
      en: 'SCIENTIFIC FACT! Menstruation is a natural reproductive-system cycle—not impure or shameful. Open, accurate education supports health and dignity.',
      hi: 'वैज्ञानिक सत्य! मासिक धर्म एक प्राकृतिक जैविक चक्र है—इसमें कोई अशुद्धता नहीं है।',
      kn: 'ವೈಜ್ಞಾನಿಕ ಸತ್ಯ! ಋತುಚಕ್ರವು ಸಹಜ ಜೈವಿಕ ಪ್ರಕ್ರಿಯೆ—ಇದು ಅಶುದ್ಧವಲ್ಲ.',
    },
    curriculumId: 'NCERT_SCI7_CH06_ADOLESCENCE',
  },
  {
    id: 'myth_puberty_age',
    statement: {
      en: 'Every human teenager starts puberty at the exact same age of 13.',
      hi: 'हर किशोर में किशोरावस्था ठीक 13 वर्ष की आयु में ही शुरू होती है।',
      kn: 'ಎಲ್ಲಾ ಹದಿಹರೆಯದವರಲ್ಲೂ ಪ್ರೌಢಾವಸ್ಥೆ ನಿಖರವಾಗಿ 13ನೇ ವಯಸ್ಸಿನಲ್ಲೇ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ.',
    },
    isScienceFact: false,
    explanation: {
      en: 'MYTH! Healthy puberty begins anywhere between roughly ages 9–15 depending on genetics, nutrition, and individual biology.',
      hi: 'मिथक! स्वस्थ किशोरावस्था लगभग 9 से 15 वर्ष के बीच अलग-अलग समय पर शुरू हो सकती है।',
      kn: 'ಮಿಥ್ಯ! ಆರೋಗ್ಯಕರ ಪ್ರೌಢಾವಸ್ಥೆಯು ವ್ಯಕ್ತಿಯಿಂದ ವ್ಯಕ್ತಿಗೆ ಸುಮಾರು 9–15 ವಯಸ್ಸಿನ ನಡುವೆ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ.',
    },
    curriculumId: 'NCERT_SCI7_CH06_ADOLESCENCE',
  },
  {
    id: 'myth_microbes',
    statement: {
      en: 'All microorganisms (bacteria and fungi) are harmful and cause disease.',
      hi: 'सभी सूक्ष्मजीव (जीवाणु और कवक) हानिकारक होते हैं और रोग फैलाते हैं।',
      kn: 'ಎಲ್ಲಾ ಸೂಕ್ಷ್ಮಜೀವಿಗಳು ಹಾನಿಕಾರಕ ಮತ್ತು ರೋಗಗಳನ್ನು ಉಂಟುಮಾಡುತ್ತವೆ.',
    },
    isScienceFact: false,
    explanation: {
      en: 'MYTH! Many microbes are deeply helpful—Lactobacillus makes curd, Rhizobium fixes nitrogen for village crops, and gut bacteria aid digestion!',
      hi: 'मिथक! कई सूक्ष्मजीव लाभदायक हैं—लैक्टोबैसिलस दही बनाता है और राइजोबियम फसलों के लिए नाइट्रोजन स्थिर करता है!',
      kn: 'ಮಿಥ್ಯ! ಅನೇಕ ಸೂಕ್ಷ್ಮಜೀವಿಗಳು ಉಪಯುಕ್ತ—ಲ್ಯಾಕ್ಟೋಬ್ಯಾಸಿಲಸ್ ಮೊಸರು ತಯಾರಿಸುತ್ತದೆ ಮತ್ತು ರೈಜೋಬಿಯಂ ಮಣ್ಣಿಗೆ ಸಾರಜನಕ ನೀಡುತ್ತದೆ!',
    },
    curriculumId: 'NCERT_SCI8_CH03_HEALTH',
  },
  {
    id: 'myth_hygiene',
    statement: {
      en: 'Regular personal hygiene, clean water, and balanced iron-rich nutrition are essential during adolescence.',
      hi: 'किशोरावस्था में नियमित स्वच्छता, साफ पानी और आयरन युक्त संतुलित आहार अत्यंत आवश्यक है।',
      kn: 'ಹದಿಹರೆಯದಲ್ಲಿ ನಿಯಮಿತ ಸ್ವಚ್ಛತೆ, ಶುದ್ಧ ನೀರು ಮತ್ತು ಕಬ್ಬಿಣಾಂಶಯುಕ್ತ ಆಹಾರ ಅತ್ಯಗತ್ಯ.',
    },
    isScienceFact: true,
    explanation: {
      en: 'SCIENTIFIC FACT! Rapid adolescent growth raises energy and iron needs, while good hygiene prevents skin and urinary infections.',
      hi: 'वैज्ञानिक सत्य! तीव्र विकास के दौरान शरीर को अधिक पोषण, आयरन और स्वच्छता की आवश्यकता होती है।',
      kn: 'ವೈಜ್ಞಾನಿಕ ಸತ್ಯ! ವೇಗದ ಬೆಳವಣಿಗೆಯ ಸಮಯದಲ್ಲಿ ಪೋಷಕಾಂಶ, ಕಬ್ಬಿಣಾಂಶ ಮತ್ತು ಸ್ವಚ್ಛತೆ ಬಹಳ ಮುಖ್ಯ.',
    },
    curriculumId: 'NCERT_SCI8_CH03_HEALTH',
  },
];

export const HospitalModal: React.FC<HospitalModalProps> = ({
  lang,
  studentGrade,
  onClose,
  onAwardXp,
  onExploreNcert,
}) => {
  const [tab, setTab] = useState<'anatomy' | 'growing_up' | 'experiments' | 'myths'>('anatomy');
  const [selectedOrgan, setSelectedOrgan] = useState<AnatomyItem>(ANATOMY_ITEMS[1]); // Heart default
  const [activityLevel, setActivityLevel] = useState<'rest' | 'walk' | 'run'>('rest');
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [muscleFlex, setMuscleFlex] = useState<boolean>(false);
  const [mythAnswers, setMythAnswers] = useState<Record<string, boolean>>({});
  const [xpAwardedKeys, setXpAwardedKeys] = useState<Set<string>>(new Set());

  const bpm = activityLevel === 'rest' ? 72 : activityLevel === 'walk' ? 102 : 148;
  const litresPerMin = ((bpm * 0.07)).toFixed(1);

  const visibleGrowingUpTopics = GROWING_UP_TOPICS.filter((t) =>
    isHealthTopicAccessible(t.minTier, studentGrade)
  );
  const gatedCount = GROWING_UP_TOPICS.length - visibleGrowingUpTopics.length;
  const [activeGrowingTopicId, setActiveGrowingTopicId] = useState<string>(
    visibleGrowingUpTopics[0]?.id || 'personal_hygiene'
  );
  const activeGrowingTopic =
    visibleGrowingUpTopics.find((t) => t.id === activeGrowingTopicId) || visibleGrowingUpTopics[0];

  const handleMythChoice = (myth: MythItem, guessedScienceFact: boolean) => {
    setMythAnswers((prev) => ({ ...prev, [myth.id]: guessedScienceFact }));
    if (guessedScienceFact === myth.isScienceFact && !xpAwardedKeys.has(myth.id)) {
      setXpAwardedKeys((prev) => new Set(prev).add(myth.id));
      onAwardXp(15, 'Hospital Health Myth Buster');
    }
  };

  const organNcert = getCurriculumById(selectedOrgan.curriculumId);

  const headerTitle =
    lang === 'hi'
      ? 'गाँव अस्पताल — जीवविज्ञान एवं स्वास्थ्य केंद्र'
      : lang === 'kn'
      ? 'ಗ್ರಾಮ ಆಸ್ಪತ್ರೆ — ಜೀವಶಾಸ್ತ್ರ ಮತ್ತು ಆರೋಗ್ಯ ಕೇಂದ್ರ'
      : 'Village Hospital — Biology & Health Science Centre';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={headerTitle}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-teal-500/45 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Hospital Reception Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-gradient-to-r from-teal-950/80 to-slate-900">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-teal-500/15 border border-teal-400/40">
              🏥
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-teal-300">{headerTitle}</h2>
              <p className="text-[11px] text-slate-400">
                {lang === 'hi'
                  ? `स्वागत कक्ष • परामर्श कक्ष • शरीर रचना लैब • कक्षा ${studentGrade} NCERT`
                  : lang === 'kn'
                  ? `ಸ್ವಾಗತ ಕೊಠಡಿ • ವೈದ್ಯರ ಕೊಠಡಿ • ಅಂಗರಚನೆ ಲ್ಯಾಬ್ • ತರಗತಿ ${studentGrade} NCERT`
                  : `Reception • Consultation Room • Anatomy Lab • Class ${studentGrade} NCERT`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close hospital"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 px-4 pt-2.5 border-b border-slate-800 bg-slate-900/70">
          {[
            { id: 'anatomy' as const, icon: '🫀', label: { en: 'Human Anatomy Lab', hi: 'मानव शरीर रचना लैब', kn: 'ಮಾನವ ಅಂಗರಚನೆ ಲ್ಯಾಬ್' } },
            { id: 'growing_up' as const, icon: '🌱', label: { en: 'Growing Up & Your Body', hi: 'बड़े होना और आपका शरीर', kn: 'ಬೆಳೆಯುವ ವಯಸ್ಸು ಮತ್ತು ದೇಹ' } },
            { id: 'experiments' as const, icon: '🔬', label: { en: 'Health Experiments', hi: 'स्वास्थ्य प्रयोग', kn: 'ಆರೋಗ್ಯ ಪ್ರಯೋಗಗಳು' } },
            { id: 'myths' as const, icon: '💡', label: { en: 'Science or Myth?', hi: 'विज्ञान या मिथक?', kn: 'ವಿಜ್ಞಾನ ಅಥವಾ ಮಿಥ್ಯ?' } },
          ].map((tItem) => (
            <button
              key={tItem.id}
              type="button"
              onClick={() => setTab(tItem.id)}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                tab === tItem.id
                  ? 'border-teal-400 text-teal-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tItem.icon}</span>
              <span>{tItem.label[lang]}</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* =============================================================== */}
          {/* TAB 1: INTERACTIVE HUMAN ANATOMY LAB (12 Organs & Systems)      */}
          {/* =============================================================== */}
          {tab === 'anatomy' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* Interactive Body SVG Silhouette */}
              <div className="md:col-span-5 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col items-center">
                <p className="text-[11px] font-bold text-teal-300 mb-2">
                  {lang === 'hi'
                    ? 'किसी अंग पर क्लिक करें'
                    : lang === 'kn'
                    ? 'ಅಂಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ'
                    : 'Tap any organ marker to inspect'}
                </p>
                <svg viewBox="0 0 200 250" className="w-48 h-60">
                  {/* Friendly Educational Human Silhouette */}
                  <circle cx="100" cy="36" r="22" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                  <rect x="90" y="56" width="20" height="14" fill="#1e293b" />
                  <rect x="62" y="70" width="76" height="106" rx="18" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                  <rect x="42" y="76" width="18" height="86" rx="9" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                  <rect x="140" y="76" width="18" height="86" rx="9" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                  <rect x="68" y="176" width="26" height="68" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                  <rect x="106" y="176" width="26" height="68" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="2" />

                  {/* Organ Hotspots */}
                  {ANATOMY_ITEMS.map((item) => {
                    const active = item.id === selectedOrgan.id;
                    return (
                      <g
                        key={item.id}
                        onClick={() => setSelectedOrgan(item)}
                        className="cursor-pointer"
                      >
                        <circle
                          cx={item.svgX}
                          cy={item.svgY}
                          r={active ? 11 : 7}
                          fill={active ? '#14b8a6' : '#0f766e'}
                          stroke={active ? '#fef08a' : '#5eead4'}
                          strokeWidth={active ? 2.5 : 1.2}
                        />
                        <text
                          x={item.svgX}
                          y={item.svgY + 3.5}
                          textAnchor="middle"
                          fontSize={active ? '11' : '8'}
                        >
                          {item.icon}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* All 12 Organ/System Quick Selector Pills */}
                <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                  {ANATOMY_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedOrgan(item)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${
                        selectedOrgan.id === item.id
                          ? 'bg-teal-500 text-slate-950 border-teal-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-teal-500/50'
                      }`}
                    >
                      {item.icon} {item.name[lang]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Organ Detail Card */}
              <div className="md:col-span-7 space-y-3">
                <div className="bg-slate-800/75 border border-teal-500/40 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-xl bg-slate-900 border border-slate-700">
                      {selectedOrgan.icon}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-amber-300">
                        {selectedOrgan.name[lang]}
                      </h3>
                      <p className="text-xs text-teal-300">{selectedOrgan.location[lang]}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-200 leading-relaxed">
                    <p>
                      <strong className="text-sky-300">
                        {lang === 'hi' ? 'मुख्य कार्य: ' : lang === 'kn' ? 'ಮುಖ್ಯ ಕಾರ್ಯ: ' : 'Primary Function: '}
                      </strong>
                      {selectedOrgan.fn[lang]}
                    </p>
                    <p className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 text-emerald-200">
                      <strong>💡 </strong>
                      {selectedOrgan.fact[lang]}
                    </p>
                  </div>

                  {organNcert && (
                    <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-emerald-300 font-semibold">
                        📖 NCERT: {formatCompactNcertCitation(organNcert)}
                      </span>
                      {onExploreNcert && (
                        <button
                          type="button"
                          onClick={() =>
                            onExploreNcert({
                              entityKey: 'village_hospital',
                              objectName: selectedOrgan.name.en,
                              objectIcon: selectedOrgan.icon,
                              fixedEntry: organNcert,
                            })
                          }
                          className="text-[10px] font-bold text-amber-300 underline cursor-pointer shrink-0"
                        >
                          Explore NCERT
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 2: GROWING UP & UNDERSTANDING YOUR BODY (PRIVATE, GATED)    */}
          {/* =============================================================== */}
          {tab === 'growing_up' && activeGrowingTopic && (
            <div className="space-y-4">
              {/* Safe, Respectful, Discreet Private Space Banner */}
              <div className="bg-emerald-950/45 border border-emerald-500/40 rounded-2xl p-3.5 text-xs text-emerald-100 space-y-1">
                <p className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <span>🔒</span>
                  <span>
                    {lang === 'hi'
                      ? 'निजी एवं सुरक्षित शिक्षण कक्ष — कोई व्यक्तिगत स्वास्थ्य डेटा सहेजा नहीं जाता'
                      : lang === 'kn'
                      ? 'ಖಾಸಗಿ ಮತ್ತು ಸುರಕ್ಷಿತ ಕಲಿಕಾ ಕೊಠಡಿ — ಯಾವುದೇ ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಮಾಹಿತಿ ಸಂಗ್ರಹಿಸಲಾಗುವುದಿಲ್ಲ'
                      : 'Private & Respectful Learning Space — No Personal Health Data Tracked or Shown Publicly'}
                  </span>
                </p>
                <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                  {lang === 'hi'
                    ? `कक्षा ${studentGrade} के लिए आयु-उपयुक्त वैज्ञानिक जानकारी। किसी भी व्यक्तिगत स्वास्थ्य प्रश्न के लिए कृपया माता-पिता, शिक्षक या योग्य डॉक्टर से बात करें।`
                    : lang === 'kn'
                    ? `ತರಗತಿ ${studentGrade} ಗೆ ಸೂಕ್ತವಾದ ವೈಜ್ಞಾನಿಕ ಮಾಹಿತಿ. ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಪ್ರಶ್ನೆಗಳಿಗಾಗಿ ಪೋಷಕರು, ಶಿಕ್ಷಕರು ಅಥವಾ ಅರ್ಹ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.`
                    : `Age-appropriate scientific education tailored for Class ${studentGrade}. For any personal health questions or concerns, please speak with a trusted parent, teacher, or qualified doctor.`}
                </p>
              </div>

              {/* Topic Selector Pills (Grade-Gated) */}
              <div className="flex flex-wrap gap-1.5">
                {visibleGrowingUpTopics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setActiveGrowingTopicId(topic.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
                      activeGrowingTopic.id === topic.id
                        ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-200 hover:border-emerald-400/50'
                    }`}
                  >
                    {topic.icon} {topic.title[lang]}
                  </button>
                ))}
              </div>

              {gatedCount > 0 && (
                <p className="text-[11px] text-slate-400 italic">
                  ℹ️ {gatedCount} advanced higher-grade NCERT reproductive biology topic(s) unlock automatically for Classes 7–12 according to NCERT grade progression.
                </p>
              )}

              {/* Active Topic Scientific Card */}
              <div className="bg-slate-800/75 border border-slate-700 rounded-2xl p-4 space-y-3">
                <h3 className="text-sm sm:text-base font-bold text-amber-300 flex items-center gap-2">
                  <span>{activeGrowingTopic.icon}</span>
                  <span>{activeGrowingTopic.title[lang]}</span>
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {activeGrowingTopic.summary[lang]}
                </p>

                <ul className="space-y-1.5 bg-slate-900/70 border border-slate-800 rounded-xl p-3">
                  {activeGrowingTopic.keyPoints[lang].map((kp, i) => (
                    <li key={i} className="text-xs text-slate-200 flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{kp}</span>
                    </li>
                  ))}
                </ul>

                {/* Age-Appropriate 28-Day Menstrual Cycle Educational Timeline SVG */}
                {activeGrowingTopic.showMenstrualTimeline && (
                  <div className="bg-slate-950/80 border border-teal-500/30 rounded-xl p-3 space-y-2">
                    <p className="text-[11px] font-bold text-teal-300">
                      🗓️ Educational 28-Day Menstrual Cycle Timeline (Approximate Averages)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-500/40">
                        <strong className="text-rose-300 block">Days 1–5: Menstruation</strong>
                        <span className="text-slate-300">Uterine lining naturally sheds; rest, hydration & clean hygiene.</span>
                      </div>
                      <div className="p-2 rounded-lg bg-sky-950/60 border border-sky-500/40">
                        <strong className="text-sky-300 block">Days 6–13: Renewal Phase</strong>
                        <span className="text-slate-300">Uterus rebuilds its lining; an egg matures in the ovary.</span>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-500/40">
                        <strong className="text-amber-300 block">~Day 14: Ovulation</strong>
                        <span className="text-slate-300">Mature egg is released from the ovary into the fallopian tube.</span>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40">
                        <strong className="text-emerald-300 block">Days 15–28: Preparation</strong>
                        <span className="text-slate-300">Lining thickens; if unfertilised, the healthy cycle repeats.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Clean Textbook-Style Reproductive Biology Schematic (Classes 9-12 only) */}
                {activeGrowingTopic.showReproductiveDiagram && (
                  <div className="bg-slate-950/80 border border-sky-500/30 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <strong className="text-sky-300 block">Female Reproductive System (NCERT Ch. 7)</strong>
                      <p className="text-slate-300">
                        • <strong>Ovaries (2):</strong> Produce eggs (ova) & hormones (oestrogen/progesterone).<br />
                        • <strong>Fallopian Tubes:</strong> Site where egg travels & fertilisation occurs.<br />
                        • <strong>Uterus:</strong> Muscular organ where a fertilised embryo grows safely.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <strong className="text-amber-300 block">Male Reproductive System (NCERT Ch. 7)</strong>
                      <p className="text-slate-300">
                        • <strong>Testes (2):</strong> Produce sperm cells & hormone testosterone.<br />
                        • <strong>Vas Deferens:</strong> Duct transporting sperm safely.<br />
                        • <strong>Accessory Glands:</strong> Provide fluid nourishment and transport.
                      </p>
                    </div>
                  </div>
                )}

                {(() => {
                  const ref = getCurriculumById(activeGrowingTopic.curriculumId);
                  if (!ref) return null;
                  return (
                    <p className="text-[11px] text-emerald-300 font-semibold pt-1 border-t border-slate-700/70">
                      📖 NCERT: {formatCompactNcertCitation(ref)} ({ref.textbook})
                    </p>
                  );
                })()}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 3: INTERACTIVE HEALTH EXPERIMENTS                           */}
          {/* =============================================================== */}
          {tab === 'experiments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Heart Pump Simulator */}
              <div className="bg-slate-800/75 border border-rose-500/35 rounded-2xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-rose-300">
                  ❤️ {lang === 'hi' ? 'हृदय पंप सिमुलेटर' : lang === 'kn' ? 'ಹೃದಯ ಪಂಪ್ ಸಿಮ್ಯುಲೇಟರ್' : 'Heart Pump & Blood Flow Simulator'}
                </h3>
                <div className="flex gap-2">
                  {(['rest', 'walk', 'run'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setActivityLevel(lvl)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border cursor-pointer capitalize ${
                        activityLevel === lvl
                          ? 'bg-rose-500 text-white border-rose-300'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-2xl font-black text-rose-400">{bpm} BPM</span>
                    <span className="block text-[10px] text-slate-400">Heart Rate</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-2xl font-black text-amber-300">{litresPerMin} L/min</span>
                    <span className="block text-[10px] text-slate-400">Blood Pumped</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300">
                  During exercise, muscles need more oxygen—so the heart beats faster to pump more blood per minute!
                </p>
              </div>

              {/* Respiratory Lung & Skeletal Muscle Simulators */}
              <div className="bg-slate-800/75 border border-sky-500/35 rounded-2xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-sky-300">
                  🫁 {lang === 'hi' ? 'श्वसन एवं मांसपेशी प्रयोग' : lang === 'kn' ? 'ಉಸಿರಾಟ ಮತ್ತು ಸ್ನಾಯು ಪ್ರಯೋಗ' : 'Breathing & Skeletal Lever Lab'}
                </h3>
                <div className="flex items-center justify-between bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <div className="text-xs">
                    <strong className="text-sky-300 block">
                      {breathPhase === 'inhale' ? 'Inhale (O₂ In)' : 'Exhale (CO₂ Out)'}
                    </strong>
                    <span className="text-[11px] text-slate-400">
                      {breathPhase === 'inhale'
                        ? 'Diaphragm moves DOWN → chest expands → air enters lungs.'
                        : 'Diaphragm relaxes UP → chest contracts → CO₂ leaves lungs.'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBreathPhase((p) => (p === 'inhale' ? 'exhale' : 'inhale'))}
                    className="px-3 py-1.5 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs cursor-pointer shrink-0"
                  >
                    {breathPhase === 'inhale' ? 'Exhale' : 'Inhale'}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <div className="text-xs">
                    <strong className="text-amber-300 block">
                      🦴 {muscleFlex ? 'Arm Bent (Biceps Contracted)' : 'Arm Straight (Triceps Contracted)'}
                    </strong>
                    <span className="text-[11px] text-slate-400">
                      Bones act as levers around the elbow joint pulled by opposing muscle pairs.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMuscleFlex((v) => !v)}
                    className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shrink-0"
                  >
                    {muscleFlex ? 'Extend' : 'Flex'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 4: SCIENCE OR MYTH? (HEALTH MYTH BUSTER)                    */}
          {/* =============================================================== */}
          {tab === 'myths' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                {lang === 'hi'
                  ? 'प्रत्येक कथन की वैज्ञानिक जाँच करें और +15 XP जीतें!'
                  : lang === 'kn'
                  ? 'ಪ್ರತಿ ಹೇಳಿಕೆಯು ವೈಜ್ಞಾನಿಕ ಸತ್ಯವೋ ಅಥವಾ ಮಿಥ್ಯವೋ ಪರೀಕ್ಷಿಸಿ (+15 XP)!'
                  : 'Investigate each statement—decide if it is a Scientific Fact or a Myth (+15 XP each)!'}
              </p>
              {HEALTH_MYTHS.map((myth) => {
                const picked = mythAnswers[myth.id];
                const isAnswered = picked !== undefined;
                const isRight = picked === myth.isScienceFact;

                return (
                  <div
                    key={myth.id}
                    className="bg-slate-800/75 border border-slate-700 rounded-2xl p-3.5 space-y-2.5"
                  >
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      “{myth.statement[lang]}”
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleMythChoice(myth, true)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                          picked === true
                            ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                            : 'bg-slate-900 border-slate-700 text-emerald-300 hover:border-emerald-400'
                        }`}
                      >
                        ✓ {lang === 'hi' ? 'वैज्ञानिक सत्य' : lang === 'kn' ? 'ವೈಜ್ಞಾನಿಕ ಸತ್ಯ' : 'Scientific Fact'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMythChoice(myth, false)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                          picked === false
                            ? 'bg-amber-500 text-slate-950 border-amber-300'
                            : 'bg-slate-900 border-slate-700 text-amber-300 hover:border-amber-400'
                        }`}
                      >
                        ✗ {lang === 'hi' ? 'मिथक (गलत धारणा)' : lang === 'kn' ? 'ಮಿಥ್ಯ (ತಪ್ಪು ಕಲ್ಪನೆ)' : 'Myth'}
                      </button>
                    </div>
                    {isAnswered && (
                      <div
                        className={`p-2.5 rounded-xl text-xs border ${
                          isRight
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                            : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                        }`}
                      >
                        <strong>{isRight ? '✓ Correct! ' : 'Try learning why: '}</strong>
                        {myth.explanation[lang]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/95 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs cursor-pointer"
          >
            {lang === 'hi' ? 'गाँव में वापस जाएँ' : lang === 'kn' ? 'ಗ್ರಾಮಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Back to Village'}
          </button>
        </div>
      </div>
    </div>
  );
};
