import { QUESTION_BANK, ZONE_DEFINITIONS } from '../src/learning/questionBank';
import { Lang, Question } from '../src/learning/types';

const LANGUAGES: Lang[] = ['en', 'hi', 'kn'];
let errorCount = 0;

function logError(questionId: string, message: string) {
  console.error(`❌ [${questionId}] ${message}`);
  errorCount++;
}

console.log(`🔍 Validating ${QUESTION_BANK.length} STEM Questions across 6 Living Village Labs...\n`);

const seenIds = new Set<string>();

QUESTION_BANK.forEach((q: Question, idx: number) => {
  const idPrefix = q.id || `index_${idx}`;

  // 1. ID format: zone.g[678].XXX
  if (!/^[a-z_]+\.g[678]\.\d{3}$/.test(q.id)) {
    logError(idPrefix, `Invalid ID format. Expected '<zone>.g<grade>.<number>', got '${q.id}'`);
  }

  // Duplicate ID check
  if (seenIds.has(q.id)) {
    logError(idPrefix, `Duplicate question ID '${q.id}' found.`);
  }
  seenIds.add(q.id);

  // 2. Zone validity
  if (!ZONE_DEFINITIONS[q.zone]) {
    logError(idPrefix, `Unknown zone '${q.zone}'. Must be one of: ${Object.keys(ZONE_DEFINITIONS).join(', ')}`);
  }

  // 3. Grade validity
  if (![6, 7, 8].includes(q.grade)) {
    logError(idPrefix, `Invalid grade ${q.grade}. Must be 6, 7, or 8.`);
  }

  // 4. Concept tag
  if (!q.concept || typeof q.concept !== 'string' || q.concept.trim().length === 0) {
    logError(idPrefix, 'Missing or empty concept identifier.');
  }

  // 5. Question text in all 3 languages
  LANGUAGES.forEach((lang) => {
    if (!q.text[lang] || q.text[lang].trim().length === 0) {
      logError(idPrefix, `Missing question text in language '${lang}'.`);
    }
  });

  // 6. Type-specific validations
  if (q.type === 'mcq' || q.type === 'scenario') {
    if (!q.options) {
      logError(idPrefix, `Type '${q.type}' must define options.`);
    } else {
      LANGUAGES.forEach((lang) => {
        if (!q.options![lang] || q.options![lang].length !== 4) {
          logError(idPrefix, `Type '${q.type}' must have exactly 4 options in language '${lang}'.`);
        }
      });
    }

    if (q.correctIndex === undefined || q.correctIndex < 0 || q.correctIndex > 3) {
      logError(idPrefix, `correctIndex must be between 0 and 3, got '${q.correctIndex}'.`);
    }
  } else if (q.type === 'fill_blank') {
    if (!q.blanks || q.blanks.length === 0) {
      logError(idPrefix, "Type 'fill_blank' must define at least one blank answer.");
    } else {
      q.blanks.forEach((b, bIdx) => {
        if (!b.answer || b.answer.length === 0) {
          logError(idPrefix, `Blank #${bIdx} has no accepted answer strings.`);
        }
      });
    }
  } else if (q.type === 'numeric') {
    if (!q.numeric || typeof q.numeric.answer !== 'number') {
      logError(idPrefix, "Type 'numeric' must define numeric.answer.");
    }
    if (q.numeric && (typeof q.numeric.tolerance !== 'number' || q.numeric.tolerance < 0)) {
      logError(idPrefix, "Type 'numeric' must define a non-negative numeric.tolerance.");
    }
  } else if (q.type === 'open') {
    if (!q.rubric) {
      logError(idPrefix, "Type 'open' must define rubric.");
    } else {
      LANGUAGES.forEach((lang) => {
        if (!q.rubric!.keyPoints[lang] || q.rubric!.keyPoints[lang].length === 0) {
          logError(idPrefix, `Type 'open' must have rubric keyPoints in language '${lang}'.`);
        }
        if (!q.rubric!.modelAnswer[lang] || q.rubric!.modelAnswer[lang].trim().length === 0) {
          logError(idPrefix, `Type 'open' must have modelAnswer in language '${lang}'.`);
        }
      });
    }
  }

  // 7. Hints in all 3 languages (at least 2 hints)
  LANGUAGES.forEach((lang) => {
    if (!q.hints[lang] || q.hints[lang].length < 2) {
      logError(idPrefix, `Must define at least 2 progressive hints in language '${lang}'.`);
    }
  });

  // 8. Explanation in all 3 languages
  LANGUAGES.forEach((lang) => {
    if (!q.explanation[lang] || q.explanation[lang].trim().length === 0) {
      logError(idPrefix, `Missing explanation in language '${lang}'.`);
    }
  });
});

if (errorCount === 0) {
  console.log(`\n✅ ALL ${QUESTION_BANK.length} QUESTIONS VALIDATED SUCCESSFULLY! 0 ERRORS FOUND.`);
  process.exit(0);
} else {
  console.error(`\n❌ QUESTION BANK VALIDATION FAILED WITH ${errorCount} ERRORS.`);
  process.exit(1);
}
