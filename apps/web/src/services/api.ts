import {
  EducationBoard,
  GradeLevel,
  SubjectItem,
  CatalogueEntry,
  ChapterItem,
  FeatureModuleItem
} from '../types';

const API_BASE = '/api/v1/curriculum';

export interface ApiResult<T> {
  data: T;
  isFallback: boolean;
  error?: string;
}

export async function fetchBoards(): Promise<ApiResult<EducationBoard[]>> {
  try {
    const res = await fetch(`${API_BASE}/boards`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data || [], isFallback: false };
  } catch (err: any) {
    console.warn('API Error, using fallback boards:', err.message);
    return {
      isFallback: true,
      error: err.message,
      data: [
        { id: 'CBSE', code: 'CBSE', name: 'Central Board of Secondary Education', jurisdiction: 'CENTRAL' },
        { id: 'KARNATAKA_STATE_BOARD', code: 'KARNATAKA_STATE_BOARD', name: 'Karnataka School Examination and Assessment Board', jurisdiction: 'STATE' },
      ],
    };
  }
}

export async function fetchGradesForBoard(boardId: string): Promise<ApiResult<GradeLevel[]>> {
  try {
    const res = await fetch(`${API_BASE}/boards/${boardId}/grades`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data || [], isFallback: false };
  } catch (err: any) {
    console.warn('API Error, using fallback grades:', err.message);
    return {
      isFallback: true,
      error: err.message,
      data: [
        { id: 'GRADE_6', numericGrade: 6, stage: 'MIDDLE', name: 'Class 6' },
        { id: 'GRADE_7', numericGrade: 7, stage: 'MIDDLE', name: 'Class 7' },
        { id: 'GRADE_8', numericGrade: 8, stage: 'MIDDLE', name: 'Class 8' },
      ],
    };
  }
}

export async function fetchSubjectsForGrade(gradeId: string, boardId?: string): Promise<ApiResult<SubjectItem[]>> {
  try {
    const url = boardId ? `${API_BASE}/grades/${gradeId}/subjects?boardId=${boardId}` : `${API_BASE}/grades/${gradeId}/subjects`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data || [], isFallback: false };
  } catch (err: any) {
    console.warn('API Error, using fallback subjects:', err.message);
    return {
      isFallback: true,
      error: err.message,
      data: [
        { id: 'MATH', code: 'MATH', name: 'Mathematics', stemPillar: 'MATHEMATICS' },
        { id: 'SCI', code: 'SCI', name: 'Science', stemPillar: 'SCIENCE' },
      ],
    };
  }
}

export async function fetchCatalogue(params: {
  boardId?: string;
  grade?: number;
  medium?: string;
}): Promise<ApiResult<CatalogueEntry[]>> {
  const query = new URLSearchParams();
  if (params.boardId) query.set('boardId', params.boardId);
  if (params.grade) query.set('grade', params.grade.toString());
  if (params.medium) query.set('medium', params.medium);

  try {
    const res = await fetch(`${API_BASE}/catalogue?${query.toString()}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data || [], isFallback: false };
  } catch (err: any) {
    console.warn('API Error, using fallback catalogue:', err.message);
    return {
      isFallback: true,
      error: err.message,
      data: getDemoCatalogueFallback(params.boardId, params.grade, params.medium),
    };
  }
}

export async function fetchEditionChapters(editionId: string): Promise<ApiResult<ChapterItem[]>> {
  try {
    const res = await fetch(`${API_BASE}/editions/${editionId}/chapters`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data || [], isFallback: false };
  } catch (err: any) {
    console.warn('API Error fetching chapters:', err.message);
    return {
      isFallback: true,
      error: err.message,
      data: [],
    };
  }
}

export async function fetchFeatureCatalogue(): Promise<ApiResult<FeatureModuleItem[]>> {
  try {
    const res = await fetch('/api/v1/features/catalogue');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data?.features || [], isFallback: false };
  } catch (err: any) {
    console.warn('API Error, using fallback features catalogue:', err.message);
    return {
      isFallback: true,
      error: err.message,
      data: [
        {
          featureId: 'STEM_LENS',
          name: 'STEM Lens',
          description:
            'Discover the science behind everyday objects. Explore the mathematics, physics, biology and engineering hidden in the world around you.',
          frontendRoute: '/app/stem-lens',
          status: 'INTEGRATION_PENDING',
          owner: 'Robin',
          supportedLearnerSegments: ['MIDDLE', 'SECONDARY'],
          requiredPermissions: ['CAMERA_CAPTURE_OPTIONAL', 'OFFLINE_CACHE_STORAGE'],
          featureFlagKey: 'STEM_LENS_ENABLED',
          integrationReadiness: {
            contractsDefined: true,
            routerMounted: true,
            uiPlaceholderReady: true,
            businessLogicImplemented: false,
          },
        },
        {
          featureId: 'VILLAGE_BUILDER',
          name: 'STEM Village Builder',
          description:
            'Build, develop and transform a village using science, technology and engineering. Solve real-world challenges and improve your virtual community.',
          frontendRoute: '/app/village-builder',
          status: 'INTEGRATION_PENDING',
          owner: 'Prashanth',
          supportedLearnerSegments: ['MIDDLE', 'SECONDARY'],
          requiredPermissions: ['LOCAL_STORAGE_STATE', 'OFFLINE_CACHE_STORAGE'],
          featureFlagKey: 'VILLAGE_BUILDER_ENABLED',
          integrationReadiness: {
            contractsDefined: true,
            routerMounted: true,
            uiPlaceholderReady: true,
            businessLogicImplemented: false,
          },
        },
      ],
    };
  }
}

export async function fetchStemLensStatus(): Promise<ApiResult<any>> {
  try {
    const res = await fetch('/api/v1/stem-lens/status');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data, isFallback: false };
  } catch (err: any) {
    return { isFallback: true, error: err.message, data: null };
  }
}

export async function fetchVillageBuilderStatus(): Promise<ApiResult<any>> {
  try {
    const res = await fetch('/api/v1/village-builder/status');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data, isFallback: false };
  } catch (err: any) {
    return { isFallback: true, error: err.message, data: null };
  }
}

// Fallback fixture only used when backend is offline
function getDemoCatalogueFallback(boardId?: string, grade?: number, medium?: string): CatalogueEntry[] {
  if (boardId === 'CBSE' && grade === 8) {
    return [
      {
        id: 'cbse-g8-math',
        boardId: 'CBSE',
        medium: 'en',
        academicYear: '2026-2027',
        level: { id: 'GRADE_8', numericGrade: 8, stage: 'MIDDLE', name: 'Class 8' },
        subject: { id: 'MATH', code: 'MATH', name: 'Mathematics', stemPillar: 'MATHEMATICS' },
        curriculumTextbooks: [
          {
            id: 'ct-cbse-g8-math',
            isPrescribed: true,
            textbookEdition: {
              id: 'cbse-g8-math-ed',
              editionNumber: 1,
              publicationYear: 2024,
              medium: 'en',
              titleInLanguage: 'Mathematics - Textbook for Class VIII',
              sourceUrl: 'https://ncert.nic.in/textbook.php?hemh1=0-13',
              status: 'VERIFIED',
              totalChapters: 13,
              textbook: {
                id: 'tb-cbse-g8-math',
                canonicalTitle: 'Mathematics - Grade 8',
                publisher: { id: 'NCERT_PUB', code: 'NCERT_PUB', name: 'NCERT Publication Division' },
              },
              chapters: [
                { id: 'c1', chapterNumber: 1, title: 'Rational Numbers', status: 'VERIFIED' },
                { id: 'c2', chapterNumber: 2, title: 'Linear Equations in One Variable', status: 'VERIFIED' },
                { id: 'c3', chapterNumber: 3, title: 'Understanding Quadrilaterals', status: 'VERIFIED' },
                { id: 'c4', chapterNumber: 4, title: 'Data Handling', status: 'VERIFIED' },
                { id: 'c5', chapterNumber: 5, title: 'Square and Square Roots', status: 'VERIFIED' },
                { id: 'c6', chapterNumber: 6, title: 'Cube and Cube Roots', status: 'VERIFIED' },
                { id: 'c7', chapterNumber: 7, title: 'Comparing Quantities', status: 'VERIFIED' },
                { id: 'c8', chapterNumber: 8, title: 'Algebraic Expressions and Identities', status: 'VERIFIED' },
                { id: 'c9', chapterNumber: 9, title: 'Mensuration', status: 'VERIFIED' },
                { id: 'c10', chapterNumber: 10, title: 'Exponents and Powers', status: 'VERIFIED' },
                { id: 'c11', chapterNumber: 11, title: 'Direct and Inverse Proportions', status: 'VERIFIED' },
                { id: 'c12', chapterNumber: 12, title: 'Factorisation', status: 'VERIFIED' },
                { id: 'c13', chapterNumber: 13, title: 'Introduction to Graphs', status: 'VERIFIED' },
              ],
            },
          },
        ],
      },
      {
        id: 'cbse-g8-sci',
        boardId: 'CBSE',
        medium: 'en',
        academicYear: '2026-2027',
        level: { id: 'GRADE_8', numericGrade: 8, stage: 'MIDDLE', name: 'Class 8' },
        subject: { id: 'SCI', code: 'SCI', name: 'Science', stemPillar: 'SCIENCE' },
        curriculumTextbooks: [
          {
            id: 'ct-cbse-g8-sci',
            isPrescribed: true,
            textbookEdition: {
              id: 'cbse-g8-sci-ed',
              editionNumber: 1,
              publicationYear: 2024,
              medium: 'en',
              titleInLanguage: 'Curiosity - Textbook of Science for Grade 8',
              sourceUrl: 'https://ncert.nic.in/textbook.php?hesc1=0-13',
              status: 'VERIFIED',
              totalChapters: 13,
              textbook: {
                id: 'tb-cbse-g8-sci',
                canonicalTitle: 'Curiosity - Science Grade 8',
                publisher: { id: 'NCERT_PUB', code: 'NCERT_PUB', name: 'NCERT Publication Division' },
              },
              chapters: [
                { id: 's1', chapterNumber: 1, title: 'Crop Production and Management', status: 'VERIFIED' },
                { id: 's2', chapterNumber: 2, title: 'Microorganisms: Friend and Foe', status: 'VERIFIED' },
                { id: 's3', chapterNumber: 3, title: 'Coal and Petroleum', status: 'VERIFIED' },
                { id: 's4', chapterNumber: 4, title: 'Combustion and Flame', status: 'VERIFIED' },
                { id: 's5', chapterNumber: 5, title: 'Conservation of Plants and Animals', status: 'VERIFIED' },
                { id: 's6', chapterNumber: 6, title: 'Reproduction in Animals', status: 'VERIFIED' },
                { id: 's7', chapterNumber: 7, title: 'Reaching the Age of Adolescence', status: 'VERIFIED' },
                { id: 's8', chapterNumber: 8, title: 'Force and Pressure', status: 'VERIFIED' },
                { id: 's9', chapterNumber: 9, title: 'Friction', status: 'VERIFIED' },
                { id: 's10', chapterNumber: 10, title: 'Sound', status: 'VERIFIED' },
                { id: 's11', chapterNumber: 11, title: 'Chemical Effects of Electric Current', status: 'VERIFIED' },
                { id: 's12', chapterNumber: 12, title: 'Some Natural Phenomena', status: 'VERIFIED' },
                { id: 's13', chapterNumber: 13, title: 'Light', status: 'VERIFIED' },
              ],
            },
          },
        ],
      },
    ];
  }

  if (boardId === 'KARNATAKA_STATE_BOARD' && grade === 7 && medium === 'kn') {
    return [
      {
        id: 'ktbs-g7-math-kn',
        boardId: 'KARNATAKA_STATE_BOARD',
        medium: 'kn',
        academicYear: '2026-2027',
        level: { id: 'GRADE_7', numericGrade: 7, stage: 'MIDDLE', name: 'Class 7' },
        subject: { id: 'MATH', code: 'MATH', name: 'Mathematics', stemPillar: 'MATHEMATICS' },
        curriculumTextbooks: [
          {
            id: 'ct-ktbs-g7-math',
            isPrescribed: true,
            textbookEdition: {
              id: 'ktbs-g7-math-kn-ed',
              editionNumber: 1,
              publicationYear: 2024,
              medium: 'kn',
              titleInLanguage: 'ಗಣಿತ - 7ನೇ ತರಗತಿ ಪಠ್ಯಪುಸ್ತಕ (Kannada)',
              sourceUrl: 'https://ktbs.kar.nic.in/New/textbook.html',
              status: 'VERIFIED',
              totalChapters: 15,
              textbook: {
                id: 'tb-ktbs-g7-math',
                canonicalTitle: 'KTBS Mathematics - Grade 7',
                publisher: { id: 'KTBS', code: 'KTBS', name: 'Karnataka Textbook Society' },
              },
              chapters: [
                { id: 'km1', chapterNumber: 1, title: 'ಪೂರ್ಣಾಂಕಗಳು (Integers)', status: 'VERIFIED' },
                { id: 'km2', chapterNumber: 2, title: 'ಭಿನ್ನರಾಶಿಗಳು ಮತ್ತು ದಶಮಾಂಶಗಳು', status: 'VERIFIED' },
                { id: 'km3', chapterNumber: 3, title: 'ದತ್ತಾಂಶಗಳ ನಿರ್ವಹಣೆ', status: 'VERIFIED' },
                { id: 'km4', chapterNumber: 4, title: 'ಸರಳ ಸಮೀಕರಣಗಳು', status: 'VERIFIED' },
                { id: 'km5', chapterNumber: 5, title: 'ರೇಖೆಗಳು ಮತ್ತು ಕೋನಗಳು', status: 'VERIFIED' },
              ],
            },
          },
        ],
      },
      {
        id: 'ktbs-g7-sci-kn',
        boardId: 'KARNATAKA_STATE_BOARD',
        medium: 'kn',
        academicYear: '2026-2027',
        level: { id: 'GRADE_7', numericGrade: 7, stage: 'MIDDLE', name: 'Class 7' },
        subject: { id: 'SCI', code: 'SCI', name: 'Science', stemPillar: 'SCIENCE' },
        curriculumTextbooks: [
          {
            id: 'ct-ktbs-g7-sci',
            isPrescribed: true,
            textbookEdition: {
              id: 'ktbs-g7-sci-kn-ed',
              editionNumber: 1,
              publicationYear: 2024,
              medium: 'kn',
              titleInLanguage: 'ವಿಜ್ಞಾನ - 7ನೇ ತರಗತಿ ಪಠ್ಯಪುಸ್ತಕ (Kannada)',
              sourceUrl: 'https://ktbs.kar.nic.in/New/textbook.html',
              status: 'VERIFIED',
              totalChapters: 18,
              textbook: {
                id: 'tb-ktbs-g7-sci',
                canonicalTitle: 'KTBS Science - Grade 7',
                publisher: { id: 'KTBS', code: 'KTBS', name: 'Karnataka Textbook Society' },
              },
              chapters: [
                { id: 'ks1', chapterNumber: 1, title: 'ಸಸ್ಯಗಳಲ್ಲಿ ಪೋಷಣೆ (Nutrition in Plants)', status: 'VERIFIED' },
                { id: 'ks2', chapterNumber: 2, title: 'ಪ್ರಾಣಿಗಳಲ್ಲಿ ಪೋಷಣೆ (Nutrition in Animals)', status: 'VERIFIED' },
                { id: 'ks3', chapterNumber: 3, title: 'ಎಳೆಯಿಂದ ಬಟ್ಟೆ (Fiber to Fabric)', status: 'VERIFIED' },
                { id: 'ks4', chapterNumber: 4, title: 'ಶಾಖ (Heat)', status: 'VERIFIED' },
                { id: 'ks5', chapterNumber: 5, title: 'ಆಮ್ಲಗಳು, ಪ್ರತ್ಯಾಮ್ಲಗಳು ಮತ್ತು ಲವಣಗಳು', status: 'VERIFIED' },
              ],
            },
          },
        ],
      },
    ];
  }

  return [];
}
