import { prisma } from '../../shared/database/prisma';
import {
  ContextualExplanation,
  IReaderService,
  ReaderBookDetail,
  ReaderChapterDetail,
  ReaderDocument,
  TextExplanationQuery,
} from './reader.contracts';

// Original GaonLab companion document for Class 8 Science demonstration
const FORCES_AND_FRICTION_DOC: ReaderDocument = {
  documentId: 'doc-forces-and-friction-cl8',
  title: 'Forces and Friction — A Visual Learning Guide',
  topic: 'Forces, Motion and Surface Interactions',
  grade: 8,
  subject: 'Science',
  language: 'en',
  accessMode: 'IN_APP_AUTHORIZED',
  url: '/documents/forces-and-friction-guide.pdf',
  totalEstimatedPages: 3,
  license: 'Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)',
  author: 'GaonLab Curriculum & Pedagogy Laboratory',
  copyrightNotice:
    'Original educational material authored by GaonLab. Does not reproduce NCERT paragraphs, illustrations or textbook pages.',
  isCompanionGuide: true,
};

const CLASS7_HEAT_EXPLANATION_KN: ContextualExplanation = {
  explanationId: 'exp-ktbs-heat-kn',
  topic: 'ಉಷ್ಣ ಮತ್ತು ತಾಪಮಾನ ವರ್ಗಾವಣೆ',
  conceptId: 'CONCEPT_HEAT_TRANSFER_KTBS',
  grade: 7,
  medium: 'kn',
  matchKeywords: ['ಉಷ್ಣ', 'ತಾಪಮಾನ', 'ವಹನ', 'ಸಂವಹನ', 'ವಿಕಿರಣ', 'ಶಾಖ', 'ಬಿಸಿ', 'ತಂಪು', 'heat', 'conduction', 'convection', 'radiation'],
  title: 'ಉಷ್ಣ: ಹೆಚ್ಚು ತಾಪದಿಂದ ಕಡಿಮೆ ತಾಪಕ್ಕೆ ಹರಿಯುವ ಶಕ್ತಿ',
  shortExplanation:
    'ಉಷ್ಣವು ಶಕ್ತಿಯ ಒಂದು ರೂಪವಾಗಿದ್ದು ಯಾವಾಗಲೂ ಹೆಚ್ಚು ತಾಪಮಾನದ (ಬಿಸಿಯಾದ) ವಸ್ತುವಿನಿಂದ ಕಡಿಮೆ ತಾಪಮಾನದ (ತಂಪಾದ) ವಸ್ತುವಿಗೆ ಹರಿಯುತ್ತದೆ. ಘನವಸ್ತುಗಳಲ್ಲಿ ವಹನ (Conduction), ದ್ರವ ಮತ್ತು ಅನಿಲಗಳಲ್ಲಿ ಸಂವಹನ (Convection), ಹಾಗೂ ಶೂನ್ಯ ಪ್ರದೇಶದಲ್ಲಿ ವಿಕಿರಣ (Radiation) ಮೂಲಕ ಉಷ್ಣ ವರ್ಗಾವಣೆಯಾಗುತ್ತದೆ.',
  visualType: 'ANIMATED_CANVAS',
  visualData: {
    animationType: 'MICROSCOPIC_INTERLOCKING',
    caption: 'ಉಷ್ಣ ವರ್ಗಾವಣೆಯ 3 ವಿಧಾನಗಳು: ವಹನ, ಸಂವಹನ ಮತ್ತು ವಿಕಿರಣ',
    labels: [
      { label: 'ಬಿಸಿ (High Temp) ->', x: 20, y: 30 },
      { label: '<- ತಂಪು (Low Temp)', x: 70, y: 70 },
    ],
  },
  realWorldExample:
    'ಮಡಕೆಯ ನೀರು ಬೇಸಿಗೆಯಲ್ಲಿ ತಂಪಾಗಿರುವುದು ನೈಸರ್ಗಿಕ ಆವೀಕರಣದ ಉದಾಹರಣೆ. ಬಿಸಿ ಸಾರಿನ ಪಾತ್ರೆಯಲ್ಲಿಟ್ಟ ಲೋಹದ ಚಮಚದ ತುದಿಯೂ ಬಿಸಿಯಾಗುವುದು ವಹನ ಕ್ರಿಯೆಗೆ ಉದಾಹರಣೆ.',
  companionTip: 'ನೆನಪಿಡಿ: ವಿಕಿರಣ ಕ್ರಿಯೆಗೆ ಯಾವುದೇ ಮಾಧ್ಯಮದ ಅವಶ್ಯಕತೆಯಿರುವುದಿಲ್ಲ (ಸೂರ್ಯನ ಶಾಖ ಭೂಮಿಗೆ ತಲುಪುವಂತೆ).',
};

// Original age-appropriate contextual explanations with animated visual models
const CLASS8_FRICTION_EXPLANATIONS: ContextualExplanation[] = [
  {
    explanationId: 'exp-friction-concept',
    topic: 'What is Friction?',
    conceptId: 'CONCEPT_FRICTION_DEFINITION',
    grade: 8,
    medium: 'en',
    matchKeywords: ['friction', 'oppose', 'opposes', 'resisting force', 'relative motion', 'contact force'],
    title: 'Friction: The Opposing Contact Force',
    shortExplanation:
      'Friction is a contact force that always opposes relative motion between two touching surfaces. Whenever an object slides or rolls over another, friction acts in the exact opposite direction to the movement.',
    visualType: 'ANIMATED_CANVAS',
    visualData: {
      animationType: 'MICROSCOPIC_INTERLOCKING',
      caption: 'Microscopic interlocking of surface hills and valleys opposing applied motion',
      labels: [
        { label: 'Applied Push ->', x: 20, y: 30 },
        { label: '<- Opposing Friction', x: 70, y: 70 },
      ],
    },
    realWorldExample:
      'Rubbing your palms together briskly warms them up because mechanical work against friction is transformed into heat energy. Striking a matchstick against the rough side of a matchbox ignites it through frictional heat.',
    companionTip: 'Remember: Friction acts parallel to the surfaces in contact, opposite to the direction of motion.',
  },
  {
    explanationId: 'exp-moving-object-stops',
    topic: 'Why Does a Moving Object Eventually Stop?',
    conceptId: 'CONCEPT_NEWTON_FIRST_LAW_FRICTION',
    grade: 8,
    medium: 'en',
    matchKeywords: ['eventually stop', 'stops', 'slow down', 'slows down', 'ball', 'inertia', 'rest'],
    title: 'Newton\'s First Law & Deceleration by Friction',
    shortExplanation:
      'According to Newton\'s First Law of Motion, a moving object continues moving at constant speed unless acted upon by an external net force. When a kicked football travels across a field, the rough grass and soil exert an opposing frictional force that continually decelerates it until its speed becomes zero.',
    visualType: 'ANIMATED_CANVAS',
    visualData: {
      animationType: 'BLOCK_PULL',
      caption: 'Continuous frictional resistance decelerating a moving body to rest',
    },
    realWorldExample:
      'A bicycle gradually comes to a complete stop when you stop pedaling because road friction on the tyres and air resistance gradually absorb its kinetic energy.',
    companionTip: 'In deep space where there is no air or surface contact, a kicked ball would travel forever!',
  },
  {
    explanationId: 'exp-smooth-surfaces-lubrication',
    topic: 'Why is it Easier to Move Objects on Smooth Surfaces?',
    conceptId: 'CONCEPT_LUBRICATION_SURFACE_ROUGHNESS',
    grade: 8,
    medium: 'en',
    matchKeywords: ['smooth', 'rough', 'easier', 'lubricant', 'lubrication', 'oil', 'grease', 'talcum'],
    title: 'Surface Smoothness & Fluid Lubrication',
    shortExplanation:
      'Smooth surfaces have significantly smaller microscopic irregularities. With fewer ridges interlocking, frictional resistance is drastically lower. When lubricants like machine oil or grease are applied, they form a thin fluid cushion that separates the two surfaces so ridges no longer rub directly against each other.',
    visualType: 'ANIMATED_CANVAS',
    visualData: {
      animationType: 'FRICTION_SURFACES',
      caption: 'Lubricant layer preventing direct solid-to-solid microscopic interlocking',
    },
    realWorldExample:
      'Sprinkling fine talcum powder on a carrom board fills the microscopic wooden grooves, allowing carrom men and strikers to glide effortlessly with minimal push.',
    companionTip: 'Water on a polished tile floor acts as an unintended lubricant, drastically reducing shoe grip and causing slips.',
  },
  {
    explanationId: 'exp-rolling-friction-bearings',
    topic: 'Static, Sliding and Rolling Friction',
    conceptId: 'CONCEPT_ROLLING_VS_SLIDING_FRICTION',
    grade: 8,
    medium: 'en',
    matchKeywords: ['rolling', 'sliding', 'static', 'wheel', 'bearing', 'pulley', 'axle', 'bullock'],
    title: 'Rolling Friction & The Wheel Revolution',
    shortExplanation:
      'Rolling friction is always vastly smaller than sliding friction because the contact area is microscopic and continuously changing without scraping. This fundamental principle makes the wheel one of humanity\'s greatest mechanical inventions.',
    visualType: 'ANIMATED_CANVAS',
    visualData: {
      animationType: 'BALL_BEARING',
      caption: 'Ball bearings substituting heavy sliding friction with effortless rolling motion',
    },
    realWorldExample:
      'Village bullock carts and well water pulleys utilize round wheels and lubricated ball bearings so massive loads can be moved and drawn with only a fraction of the muscular force required to drag them.',
    companionTip: 'Luggage bags equipped with wheels allow children to effortlessly move 30 kg suitcases that would be impossible to drag.',
  },
];

export class ReaderService implements IReaderService {
  async getBookDetails(editionId: string): Promise<ReaderBookDetail | null> {
    try {
      // 1. Query Prisma database for edition
      const edition = await prisma.textbookEdition.findFirst({
        where: {
          OR: [
            { id: editionId },
            { textbookId: editionId },
          ],
        },
        include: {
          textbook: {
            include: {
              publisher: true,
              subject: true,
              level: true,
            },
          },
          chapters: {
            orderBy: { chapterNumber: 'asc' },
          },
        },
      });

      if (!edition) {
        // Fallback for demo mock IDs or unseeded states
        return this.getMockBookDetails(editionId);
      }

      const publisherName = edition.textbook.publisher.name;
      const isNcert = publisherName.toLowerCase().includes('ncert');
      const isKtbs = publisherName.toLowerCase().includes('karnataka') || publisherName.toLowerCase().includes('ktbs');

      const officialSourceUrl =
        edition.sourceUrl ||
        (isNcert ? 'https://ncert.nic.in/textbook.php' : isKtbs ? 'https://ktbs.kar.nic.in/' : 'https://www.education.gov.in/');

      const defaultAccessMode = 'OFFICIAL_EXTERNAL_ONLY';

      const chapters: ReaderChapterDetail[] = edition.chapters.map((ch) => {
        const titleLower = ch.title.toLowerCase();
        const isFrictionOrForce =
          titleLower.includes('friction') ||
          titleLower.includes('force') ||
          ch.chapterNumber === 9 ||
          ch.chapterNumber === 11 ||
          ch.chapterNumber === 12;

        const isGrade8Science = edition.textbook.level.numericGrade === 8 && edition.textbook.subjectId === 'SCIENCE';

        if (isGrade8Science && isFrictionOrForce) {
          return {
            chapterId: ch.id,
            chapterNumber: ch.chapterNumber,
            title: ch.title,
            accessMode: 'IN_APP_AUTHORIZED',
            documentId: FORCES_AND_FRICTION_DOC.documentId,
            officialSourceUrl: ch.sourceUrl || officialSourceUrl,
            hasExplanations: true,
            pageCount: 3,
          };
        }

        return {
          chapterId: ch.id,
          chapterNumber: ch.chapterNumber,
          title: ch.title,
          accessMode: 'OFFICIAL_EXTERNAL_ONLY',
          officialSourceUrl: ch.sourceUrl || officialSourceUrl,
          hasExplanations: false,
          pageCount: ch.pageEnd && ch.pageStart ? ch.pageEnd - ch.pageStart + 1 : undefined,
        };
      });

      return {
        editionId: edition.id,
        textbookId: edition.textbookId,
        title: edition.titleInLanguage || edition.textbook.canonicalTitle,
        grade: edition.textbook.level.numericGrade,
        subject: edition.textbook.subject.name,
        publisher: publisherName,
        language: edition.medium,
        academicYear: String(edition.publicationYear),
        officialSourceUrl,
        copyrightNotice:
          'Official education board/publisher notice prohibits unapproved third-party reproduction. GaonLab provides authorized companion guides and links to official portals.',
        defaultAccessMode,
        chapters,
        totalChapters: chapters.length,
      };
    } catch (err) {
      console.error('Error fetching book details from DB, using fallback:', err);
      return this.getMockBookDetails(editionId);
    }
  }

  async getChapterDetails(chapterId: string): Promise<ReaderChapterDetail | null> {
    try {
      const chapter = await prisma.chapter.findUnique({
        where: { id: chapterId },
        include: {
          textbookEdition: {
            include: {
              textbook: {
                include: { level: true, subject: true },
              },
            },
          },
        },
      });

      if (!chapter) {
        // Fallback for friction demo chapter
        if (chapterId.includes('friction') || chapterId.includes('ch-sci-8')) {
          return {
            chapterId,
            chapterNumber: 9,
            title: 'Friction & Force Interactions',
            accessMode: 'IN_APP_AUTHORIZED',
            documentId: FORCES_AND_FRICTION_DOC.documentId,
            officialSourceUrl: 'https://ncert.nic.in/textbook.php',
            hasExplanations: true,
            pageCount: 3,
          };
        }
        return null;
      }

      const titleLower = chapter.title.toLowerCase();
      const isFrictionOrForce = titleLower.includes('friction') || titleLower.includes('force');
      const isGrade8Science =
        chapter.textbookEdition.textbook.level.numericGrade === 8 &&
        chapter.textbookEdition.textbook.subjectId === 'SCIENCE';

      if (isGrade8Science && isFrictionOrForce) {
        return {
          chapterId: chapter.id,
          chapterNumber: chapter.chapterNumber,
          title: chapter.title,
          accessMode: 'IN_APP_AUTHORIZED',
          documentId: FORCES_AND_FRICTION_DOC.documentId,
          officialSourceUrl: chapter.sourceUrl || 'https://ncert.nic.in/textbook.php',
          hasExplanations: true,
          pageCount: 3,
        };
      }

      return {
        chapterId: chapter.id,
        chapterNumber: chapter.chapterNumber,
        title: chapter.title,
        accessMode: 'OFFICIAL_EXTERNAL_ONLY',
        officialSourceUrl: chapter.sourceUrl || 'https://ncert.nic.in/textbook.php',
        hasExplanations: false,
        pageCount: chapter.pageEnd && chapter.pageStart ? chapter.pageEnd - chapter.pageStart + 1 : undefined,
      };
    } catch {
      return null;
    }
  }

  async getDocument(documentId: string): Promise<ReaderDocument | null> {
    if (documentId === FORCES_AND_FRICTION_DOC.documentId) {
      return FORCES_AND_FRICTION_DOC;
    }
    return null;
  }

  async getChapterExplanations(_chapterId: string): Promise<ContextualExplanation[]> {
    return CLASS8_FRICTION_EXPLANATIONS;
  }

  async resolveContextualExplanation(query: TextExplanationQuery): Promise<ContextualExplanation | null> {
    const raw = (query.selectedText || '').toLowerCase().trim();
    if (!raw) return null;

    // Check Kannada curriculum first if medium is kn or text contains Kannada characters
    const isKannada =
      query.medium === 'kn' ||
      /[\u0C80-\u0CFF]/.test(raw) ||
      query.chapterId === 'ad794275-7405-4039-8276-7db15c6ee237';

    if (isKannada) {
      for (const kw of CLASS7_HEAT_EXPLANATION_KN.matchKeywords) {
        if (raw.includes(kw.toLowerCase())) {
          return CLASS7_HEAT_EXPLANATION_KN;
        }
      }
      return CLASS7_HEAT_EXPLANATION_KN;
    }

    let bestMatch: ContextualExplanation | null = null;
    let maxScore = 0;

    for (const exp of CLASS8_FRICTION_EXPLANATIONS) {
      let score = 0;
      for (const kw of exp.matchKeywords) {
        if (raw.includes(kw.toLowerCase())) {
          score += 3;
        }
      }
      if (raw.includes(exp.topic.toLowerCase())) {
        score += 5;
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = exp;
      }
    }

    // Default to primary friction concept if selection has any physics keywords or if no high-score match
    if (!bestMatch && (raw.includes('force') || raw.includes('surface') || raw.includes('move') || raw.includes('motion'))) {
      return CLASS8_FRICTION_EXPLANATIONS[0];
    }

    return bestMatch || CLASS8_FRICTION_EXPLANATIONS[0];
  }

  private getMockBookDetails(editionId: string): ReaderBookDetail {
    const isKannada = editionId.toLowerCase().includes('ktbs') || editionId.toLowerCase().includes('kavya');
    if (isKannada) {
      return {
        editionId,
        textbookId: 'ktbs-g7-science',
        title: 'ವಿಜ್ಞಾನ — ಭಾಗ ೧ ಮತ್ತು ೨ (Class 7 Science)',
        grade: 7,
        subject: 'Science',
        publisher: 'Karnataka Textbook Society (KTBS)',
        language: 'kn',
        academicYear: '2026-2027',
        officialSourceUrl: 'https://ktbs.kar.nic.in/',
        copyrightNotice:
          'Karnataka State Board textbooks are hosted on the KTBS government portal. GaonLab respects official portal distribution rights.',
        defaultAccessMode: 'OFFICIAL_EXTERNAL_ONLY',
        chapters: [
          { chapterId: 'ch-ktbs-1', chapterNumber: 1, title: 'ಸಸ್ಯಗಳಲ್ಲಿ ಪೋಷಣೆ (Nutrition in Plants)', accessMode: 'OFFICIAL_EXTERNAL_ONLY', hasExplanations: false },
          { chapterId: 'ch-ktbs-2', chapterNumber: 2, title: 'ಪ್ರಾಣಿಗಳಲ್ಲಿ ಪೋಷಣೆ (Nutrition in Animals)', accessMode: 'OFFICIAL_EXTERNAL_ONLY', hasExplanations: false },
          { chapterId: 'ch-ktbs-3', chapterNumber: 3, title: 'ಶಾಖ (Heat)', accessMode: 'OFFICIAL_EXTERNAL_ONLY', hasExplanations: false },
          { chapterId: 'ch-ktbs-4', chapterNumber: 4, title: 'ಆಮ್ಲಗಳು, ಪ್ರತ್ಯಾಮ್ಲಗಳು ಮತ್ತು ಲವಣಗಳು (Acids, Bases and Salts)', accessMode: 'OFFICIAL_EXTERNAL_ONLY', hasExplanations: false },
          { chapterId: 'ch-ktbs-5', chapterNumber: 5, title: 'ಭೌತಿಕ ಮತ್ತು ರಾಸಾಯನಿಕ ಬದಲಾವಣೆಗಳು (Physical and Chemical Changes)', accessMode: 'OFFICIAL_EXTERNAL_ONLY', hasExplanations: false },
        ],
        totalChapters: 5,
      };
    }

    return {
      editionId,
      textbookId: 'ncert-g8-science',
      title: 'Curiosity — Science (Class 8)',
      grade: 8,
      subject: 'Science',
      publisher: 'NCERT',
      language: 'en',
      academicYear: '2026-2027',
      officialSourceUrl: 'https://ncert.nic.in/textbook.php',
      copyrightNotice:
        'Official NCERT textbook notice prohibits embedding without written permission. GaonLab provides authorized companion guides and links to official portals.',
      defaultAccessMode: 'OFFICIAL_EXTERNAL_ONLY',
      chapters: [
        { chapterId: 'ch-cur-1', chapterNumber: 1, title: 'Crop Production and Management', accessMode: 'OFFICIAL_EXTERNAL_ONLY', hasExplanations: false },
        { chapterId: 'ch-cur-2', chapterNumber: 2, title: 'Microorganisms: Friend and Foe', accessMode: 'OFFICIAL_EXTERNAL_ONLY', hasExplanations: false },
        { chapterId: 'ch-cur-3', chapterNumber: 3, title: 'Coal and Petroleum', accessMode: 'OFFICIAL_EXTERNAL_ONLY', hasExplanations: false },
        { chapterId: 'ch-cur-4', chapterNumber: 4, title: 'Combustion and Flame', accessMode: 'OFFICIAL_EXTERNAL_ONLY', hasExplanations: false },
        {
          chapterId: 'ch-cur-9',
          chapterNumber: 9,
          title: 'Friction & Force Interactions',
          accessMode: 'IN_APP_AUTHORIZED',
          documentId: FORCES_AND_FRICTION_DOC.documentId,
          officialSourceUrl: 'https://ncert.nic.in/textbook.php',
          hasExplanations: true,
          pageCount: 3,
        },
      ],
      totalChapters: 5,
    };
  }
}

export const readerService = new ReaderService();
