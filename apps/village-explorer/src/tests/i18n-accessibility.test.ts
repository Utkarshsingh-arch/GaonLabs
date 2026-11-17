import { describe, it, expect } from 'vitest';
import { TRANSLATIONS, TranslationKey, t } from '../i18n/translations';
import { Lang } from '../learning/types';

describe('Phase 7: Multilingual i18n & Accessibility System', () => {
  const languages: Lang[] = ['en', 'hi', 'kn'];
  const allEnglishKeys = Object.keys(TRANSLATIONS.en) as TranslationKey[];

  it('contains complete translations across English, Hindi, and Kannada without missing keys', () => {
    languages.forEach((lang) => {
      allEnglishKeys.forEach((key) => {
        const val = TRANSLATIONS[lang][key];
        expect(val, `Missing translation for key: "${key}" in language: "${lang}"`).toBeDefined();
        expect(typeof val).toBe('string');
        expect(val.length).toBeGreaterThan(0);
      });
    });
  });

  it('interpolates dynamic parameters into translation templates correctly', () => {
    const questionTextEn = t('en', 'questionOf', { current: 3, total: 6 });
    expect(questionTextEn).toBe('Question 3 of 6');

    const questionTextHi = t('hi', 'questionOf', { current: 3, total: 6 });
    expect(questionTextHi).toBe('प्रश्न 3 / 6');

    const questionTextKn = t('kn', 'questionOf', { current: 3, total: 6 });
    expect(questionTextKn).toBe('ಪ್ರಶ್ನೆ 3 / 6');
  });

  it('substitutes grade level parameters accurately', () => {
    const gradeLabEn = t('en', 'gradeLab', { grade: 8 });
    expect(gradeLabEn).toBe('Grade 8 STEM Curriculum Lab');

    const gradeLabHi = t('hi', 'gradeLab', { grade: 7 });
    expect(gradeLabHi).toBe('कक्षा 7 विज्ञान पाठ्यक्रम प्रयोगशाला');
  });

  it('handles fallback gracefully when an unknown key or missing translation is requested', () => {
    // @ts-expect-error test invalid key fallback
    const result = t('en', 'non_existent_key');
    expect(result).toBe('non_existent_key');
  });
});
