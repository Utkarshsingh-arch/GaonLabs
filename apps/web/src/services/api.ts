import {
  EducationBoard,
  GradeLevel,
  SubjectItem,
  CatalogueEntry,
  ChapterItem,
  FeatureModuleItem,
  ReaderBookDetail,
  ReaderChapterDetail,
  ReaderDocument,
  ContextualExplanation,
  TopicSummary,
  TopicDetail,
  TopicLesson,
  TopicVideoMeta,
  TopicOfficialResource,
  TopicMatchResult,
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

export async function fetchBookDetails(editionId: string): Promise<ApiResult<ReaderBookDetail | null>> {
  try {
    const res = await fetch(`/api/v1/reader/books/${editionId}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data, isFallback: false };
  } catch (err: any) {
    console.warn('API Error, using fallback book details:', err.message);
    return {
      isFallback: true,
      error: err.message,
      data: {
        editionId,
        textbookId: 'sample-book',
        title: editionId.includes('ktbs') ? 'ವಿಜ್ಞಾನ — Class 7 Science' : 'Curiosity — Science (Class 8)',
        grade: editionId.includes('ktbs') ? 7 : 8,
        subject: 'Science',
        publisher: editionId.includes('ktbs') ? 'Karnataka Textbook Society' : 'NCERT',
        language: editionId.includes('ktbs') ? 'kn' : 'en',
        academicYear: '2026-2027',
        officialSourceUrl: editionId.includes('ktbs') ? 'https://ktbs.kar.nic.in/' : 'https://ncert.nic.in/textbook.php',
        copyrightNotice: 'Official education board notice prohibits unapproved third-party reproduction. GaonLab provides authorized companion guides and links to official portals.',
        defaultAccessMode: 'OFFICIAL_EXTERNAL_ONLY',
        chapters: [
          {
            chapterId: 'ch-friction',
            chapterNumber: 9,
            title: 'Forces, Friction and Motion',
            accessMode: 'IN_APP_AUTHORIZED',
            documentId: 'doc-forces-and-friction-cl8',
            officialSourceUrl: 'https://ncert.nic.in/textbook.php',
            hasExplanations: true,
            pageCount: 3,
          },
          {
            chapterId: 'ch-sound',
            chapterNumber: 10,
            title: 'Sound & Vibration',
            accessMode: 'OFFICIAL_EXTERNAL_ONLY',
            officialSourceUrl: 'https://ncert.nic.in/textbook.php',
            hasExplanations: false,
          },
        ],
        totalChapters: 2,
      },
    };
  }
}

export async function fetchChapterDetails(chapterId: string): Promise<ApiResult<ReaderChapterDetail | null>> {
  try {
    const res = await fetch(`/api/v1/reader/chapters/${chapterId}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data, isFallback: false };
  } catch (err: any) {
    return {
      isFallback: true,
      error: err.message,
      data: {
        chapterId,
        chapterNumber: 9,
        title: 'Forces and Friction',
        accessMode: 'IN_APP_AUTHORIZED',
        documentId: 'doc-forces-and-friction-cl8',
        hasExplanations: true,
        pageCount: 3,
      },
    };
  }
}

export async function fetchReaderDocument(documentId: string): Promise<ApiResult<ReaderDocument | null>> {
  try {
    const res = await fetch(`/api/v1/reader/documents/${documentId}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data, isFallback: false };
  } catch (err: any) {
    return {
      isFallback: true,
      error: err.message,
      data: {
        documentId,
        title: 'Forces and Friction — A Visual Learning Guide',
        topic: 'Forces, Motion and Surface Interactions',
        grade: 8,
        subject: 'Science',
        language: 'en',
        accessMode: 'IN_APP_AUTHORIZED',
        url: '/documents/forces-and-friction-guide.pdf',
        totalEstimatedPages: 3,
        license: 'Creative Commons Attribution-NonCommercial 4.0 International',
        author: 'GaonLab Curriculum & Pedagogy Laboratory',
        copyrightNotice: 'Original educational material authored by GaonLab.',
        isCompanionGuide: true,
      },
    };
  }
}

export async function fetchChapterExplanations(chapterId: string): Promise<ApiResult<ContextualExplanation[]>> {
  try {
    const res = await fetch(`/api/v1/reader/chapters/${chapterId}/explanations`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data || [], isFallback: false };
  } catch (err: any) {
    return { isFallback: true, error: err.message, data: [] };
  }
}

export async function explainSelectedText(payload: {
  selectedText: string;
  chapterId?: string;
  documentId?: string;
  grade?: number;
}): Promise<ApiResult<ContextualExplanation | null>> {
  try {
    const res = await fetch('/api/v1/reader/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data, isFallback: false };
  } catch (err: any) {
    // Client-side fallback keyword matching
    const txt = payload.selectedText.toLowerCase();
    let animType: any = 'MICROSCOPIC_INTERLOCKING';
    let title = 'Friction: The Opposing Contact Force';
    let explanation =
      'Friction is a contact force that always opposes relative motion between two touching surfaces. Whenever an object slides or rolls, friction acts in the exact opposite direction to the movement.';
    let example =
      'Rubbing your palms together warms them up because mechanical work against friction is transformed into heat energy.';

    if (txt.includes('stop') || txt.includes('slow') || txt.includes('ball')) {
      animType = 'BLOCK_PULL';
      title = "Newton's First Law & Deceleration by Friction";
      explanation =
        'According to Newton\'s First Law of Motion, a moving object continues moving at constant speed unless acted upon by an external net force. The rough grass exerts an opposing contact force that decelerates the ball until it stops.';
      example =
        'A bicycle coasting on a dirt path stops when you stop pedaling due to road friction and air resistance.';
    } else if (txt.includes('smooth') || txt.includes('lubric') || txt.includes('oil') || txt.includes('grease')) {
      animType = 'FRICTION_SURFACES';
      title = 'Surface Smoothness & Fluid Lubrication';
      explanation =
        'Smooth surfaces have significantly smaller microscopic irregularities. When lubricants like oil or grease are applied, they form a thin fluid cushion that separates the surfaces.';
      example =
        'Adding fine talcum powder to a carrom board fills the microscopic grooves so striker coins glide with effortless speed.';
    } else if (txt.includes('rolling') || txt.includes('wheel') || txt.includes('bearing') || txt.includes('cart')) {
      animType = 'BALL_BEARING';
      title = 'Rolling Friction & Wheel Mechanics';
      explanation =
        'Rolling friction is vastly smaller than sliding friction because the contact area is microscopic and constantly shifting without scraping.';
      example =
        'Bullock carts and village water well pulleys use round wheels and lubricated ball bearings so heavy loads can be moved with minimal force.';
    }

    return {
      isFallback: true,
      data: {
        explanationId: 'client-fallback-exp',
        topic: 'Forces & Friction',
        grade: 8,
        medium: 'en',
        matchKeywords: ['friction', 'force', 'surface'],
        title,
        shortExplanation: explanation,
        visualType: 'ANIMATED_CANVAS',
        visualData: { animationType: animType, caption: 'Interactive physics visualization model' },
        realWorldExample: example,
        companionTip: 'Observe objects in your village to see friction at work!',
      },
    };
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

// -------------------------------------------------------------
// Explore STEM & Topics API
// -------------------------------------------------------------

export interface TopicFilterParams {
  boardId?: string;
  grade?: number;
  subjectId?: string;
  medium?: string;
  academicYear?: string;
}

export async function fetchExploreTopics(filters: TopicFilterParams = {}): Promise<ApiResult<TopicSummary[]>> {
  const query = new URLSearchParams();
  if (filters.boardId) query.set('boardId', filters.boardId);
  if (filters.grade) query.set('grade', filters.grade.toString());
  if (filters.subjectId) query.set('subjectId', filters.subjectId);
  if (filters.medium) query.set('medium', filters.medium);
  if (filters.academicYear) query.set('academicYear', filters.academicYear);

  try {
    const res = await fetch(`/api/v1/topics?${query.toString()}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data || [], isFallback: false };
  } catch (err: any) {
    console.warn('API Error fetching topics, using fallback:', err.message);
    return {
      isFallback: true,
      error: err.message,
      data: getFallbackTopics(filters),
    };
  }
}

export async function fetchTopicDetail(topicId: string): Promise<ApiResult<TopicDetail | null>> {
  try {
    const res = await fetch(`/api/v1/topics/${topicId}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data, isFallback: false };
  } catch (err: any) {
    console.warn(`API Error fetching topic ${topicId}:`, err.message);
    const fallback = getFallbackTopics().find((t) => t.topicId === topicId);
    return {
      isFallback: true,
      error: err.message,
      data: fallback ? (fallback as any) : null,
    };
  }
}

export async function fetchTopicLesson(topicId: string, lang?: string): Promise<ApiResult<TopicLesson | null>> {
  try {
    const q = lang ? `?lang=${encodeURIComponent(lang)}` : '';
    const res = await fetch(`/api/v1/topics/${topicId}/lesson${q}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data, isFallback: false };
  } catch (err: any) {
    console.warn(`API Error fetching topic lesson ${topicId}:`, err.message);
    return { isFallback: true, error: err.message, data: null };
  }
}

export async function fetchTopicVideo(topicId: string, lang?: string): Promise<ApiResult<TopicVideoMeta | null>> {
  try {
    const q = lang ? `?lang=${encodeURIComponent(lang)}` : '';
    const res = await fetch(`/api/v1/topics/${topicId}/video${q}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data, isFallback: false };
  } catch (err: any) {
    console.warn(`API Error fetching topic video ${topicId}:`, err.message);
    return { isFallback: true, error: err.message, data: null };
  }
}

export async function fetchTopicResources(topicId: string): Promise<ApiResult<TopicOfficialResource[]>> {
  try {
    const res = await fetch(`/api/v1/topics/${topicId}/resources`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data || [], isFallback: false };
  } catch (err: any) {
    console.warn(`API Error fetching topic resources ${topicId}:`, err.message);
    return { isFallback: true, error: err.message, data: [] };
  }
}

export async function matchTopicExplanation(payload: {
  selectedText: string;
  chapterId?: string;
  documentId?: string;
  grade?: number;
  medium?: string;
}): Promise<ApiResult<TopicMatchResult | null>> {
  try {
    const res = await fetch('/api/v1/topics/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data, isFallback: false };
  } catch (err: any) {
    console.warn('API Error matching topic explanation:', err.message);
    return { isFallback: true, error: err.message, data: null };
  }
}

function getFallbackTopics(filters: TopicFilterParams = {}): TopicSummary[] {
  const all: TopicSummary[] = [
    {
      topicId: 'topic-shapes-class3',
      title: 'Fun with Shapes',
      shortDescription: 'Explore 2D and 3D shapes, circles, triangles, and real-world village structures.',
      boardId: 'CBSE',
      frameworkId: 'NCF_SE_2023',
      grade: 3,
      subjectId: 'MATHEMATICS',
      subjectName: 'Mathematics',
      stemPillar: 'MATHEMATICS',
      medium: 'en',
      academicYear: '2026-2027',
      accessMode: 'GAONLAB_FULL',
      contentStatus: 'PUBLISHED',
      hasLesson: true,
      hasVideo: true,
      hasOfficialResources: true,
    },
    {
      topicId: 'topic-forces-friction-cl8',
      title: 'Exploring Forces and Friction',
      shortDescription: 'Understand friction as an opposing contact force caused by microscopic surface irregularities.',
      boardId: 'CBSE',
      frameworkId: 'NCF_SE_2023',
      grade: 8,
      subjectId: 'SCI',
      subjectName: 'Science',
      stemPillar: 'SCIENCE',
      medium: 'en',
      academicYear: '2026-2027',
      accessMode: 'GAONLAB_FULL',
      contentStatus: 'PUBLISHED',
      hasLesson: true,
      hasVideo: true,
      hasOfficialResources: true,
    },
    {
      topicId: 'topic-rotational-motion-cl11',
      title: 'Rotational Motion and Moment of Inertia',
      shortDescription: 'Rigid body dynamics, torque as cross product, moment of inertia, and angular momentum.',
      boardId: 'CBSE',
      frameworkId: 'NCF_SE_2023',
      grade: 11,
      subjectId: 'PHYSICS',
      subjectName: 'Physics',
      stemPillar: 'PHYSICS',
      medium: 'en',
      academicYear: '2026-2027',
      accessMode: 'GAONLAB_FULL',
      contentStatus: 'PUBLISHED',
      hasLesson: true,
      hasVideo: true,
      hasOfficialResources: true,
    },
    {
      topicId: 'topic-ktbs-heat-cl7-kn',
      title: 'ಉಷ್ಣ ಮತ್ತು ತಾಪಮಾನ ವರ್ಗಾವಣೆ (Heat Transfer)',
      shortDescription: 'ಘನ, ದ್ರವ ಮತ್ತು ಅನಿಲಗಳಲ್ಲಿ ಉಷ್ಣ ವರ್ಗಾವಣೆಯ 3 ವಿಧಾನಗಳು: ವಹನ, ಸಂವಹನ ಮತ್ತು ವಿಕಿರಣ.',
      boardId: 'KARNATAKA_STATE_BOARD',
      frameworkId: 'KTBS_KSEAB_2024',
      grade: 7,
      subjectId: 'SCI',
      subjectName: 'ವಿಜ್ಞಾನ (Science)',
      stemPillar: 'SCIENCE',
      medium: 'kn',
      academicYear: '2026-2027',
      accessMode: 'GAONLAB_FULL',
      contentStatus: 'PUBLISHED',
      hasLesson: true,
      hasVideo: true,
      hasOfficialResources: true,
    },
    {
      topicId: 'topic-ktbs-integers-cl7-kn',
      title: 'ಪೂರ್ಣಾಂಕಗಳು ಮತ್ತು ಅವುಗಳ ಸಂಕಲನ (Integers and Operations)',
      shortDescription: 'ಸಂಖ್ಯಾ ರೇಖೆ, ಧನ ಮತ್ತು ಋಣ ಪೂರ್ಣಾಂಕಗಳ ಸಂಕಲನ, ವ್ಯವಕಲನ ಮತ್ತು ದೈನಂದಿನ ಲೆಕ್ಕಾಚಾರ.',
      boardId: 'KARNATAKA_STATE_BOARD',
      frameworkId: 'KTBS_KSEAB_2024',
      grade: 7,
      subjectId: 'MATH',
      subjectName: 'ಗಣಿತ (Mathematics)',
      stemPillar: 'MATHEMATICS',
      medium: 'kn',
      academicYear: '2026-2027',
      accessMode: 'HYBRID',
      contentStatus: 'PUBLISHED',
      hasLesson: true,
      hasVideo: false,
      hasOfficialResources: true,
    },
    {
      topicId: 'topic-ktbs-motion-time-cl7-kn',
      title: 'ಚಲನೆ ಮತ್ತು ಕಾಲ (Motion and Time)',
      shortDescription: 'ಸರಳ ರೇಖಾಗತ ಚಲನೆ, ಆವರ್ತಕ ಚಲನೆ, ಸರಳ ಲೋಲಕ ಮತ್ತು ವೇಗದ ಮಾಪನ.',
      boardId: 'KARNATAKA_STATE_BOARD',
      frameworkId: 'KTBS_KSEAB_2024',
      grade: 7,
      subjectId: 'SCI',
      subjectName: 'ವಿಜ್ಞಾನ (Science)',
      stemPillar: 'SCIENCE',
      medium: 'kn',
      academicYear: '2026-2027',
      accessMode: 'HYBRID',
      contentStatus: 'PUBLISHED',
      hasLesson: true,
      hasVideo: false,
      hasOfficialResources: true,
    },
    {
      topicId: 'topic-ktbs-lines-angles-cl7-kn',
      title: 'ರೇಖೆಗಳು ಮತ್ತು ಕೋನಗಳು (Lines and Angles)',
      shortDescription: 'ಪೂರಕ ಕೋನಗಳು, ಪರಿಪೂರಕ ಕೋನಗಳು, ಶೃಂಗಾಭಿಮುಖ ಕೋನಗಳು ಮತ್ತು ತ್ರಿಭುಜಗಳ ಗುಣಲಕ್ಷಣಗಳು.',
      boardId: 'KARNATAKA_STATE_BOARD',
      frameworkId: 'KTBS_KSEAB_2024',
      grade: 7,
      subjectId: 'MATH',
      subjectName: 'ಗಣಿತ (Mathematics)',
      stemPillar: 'MATHEMATICS',
      medium: 'kn',
      academicYear: '2026-2027',
      accessMode: 'HYBRID',
      contentStatus: 'PUBLISHED',
      hasLesson: true,
      hasVideo: false,
      hasOfficialResources: true,
    },
  ];

  return all.filter((t) => {
    if (filters.grade && t.grade !== filters.grade) return false;
    if (filters.subjectId && t.subjectId !== filters.subjectId) return false;
    if (filters.boardId && t.boardId !== filters.boardId) return false;
    if (filters.medium && t.medium !== filters.medium) return false;
    return true;
  });
}

// -------------------------------------------------------------
// STEM Lens Service & Chat History API
// -------------------------------------------------------------

export interface StemLensChatMessage {
  id: string;
  sessionId?: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string | null;
  generatedImageUrl?: string | null;
  timestamp: string;
  model?: string | null;
}

export interface StemLensSessionData {
  id: string;
  userId: string | null;
  title: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  messages: StemLensChatMessage[];
}

export interface StemLensSendParams {
  sessionId?: string;
  userId?: string;
  message: string;
  imageBase64?: string;
  imageMimeType?: string;
  mode?: 'chat' | 'image';
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface StemLensChatResponseData {
  sessionId: string;
  sessionTitle?: string;
  userMessageId?: string;
  assistantMessageId?: string;
  reply: string;
  generatedImageUrl?: string;
  model: string;
  timestamp: string;
  tokensUsed?: number;
}

export async function fetchStemLensSessions(
  userId = 'student-robin'
): Promise<ApiResult<StemLensSessionData[]>> {
  try {
    const res = await fetch(`/api/v1/stem-lens/sessions?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return { data: json.data || [], isFallback: false };
  } catch (err: any) {
    console.warn('fetchStemLensSessions error:', err.message);
    return { data: [], isFallback: true, error: err.message };
  }
}

export async function fetchStemLensSessionById(
  sessionId: string
): Promise<ApiResult<StemLensSessionData | null>> {
  try {
    const res = await fetch(`/api/v1/stem-lens/sessions/${encodeURIComponent(sessionId)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return { data: json.data, isFallback: false };
  } catch (err: any) {
    console.warn('fetchStemLensSessionById error:', err.message);
    return { data: null, isFallback: true, error: err.message };
  }
}

export async function createStemLensSession(
  title = 'New STEM Investigation',
  userId = 'student-robin'
): Promise<ApiResult<StemLensSessionData>> {
  try {
    const res = await fetch('/api/v1/stem-lens/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, userId }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return { data: json.data, isFallback: false };
  } catch (err: any) {
    console.warn('createStemLensSession error:', err.message);
    return {
      data: {
        id: `local-${Date.now()}`,
        userId,
        title,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      },
      isFallback: true,
      error: err.message,
    };
  }
}

export async function updateStemLensSessionTitle(
  sessionId: string,
  title: string
): Promise<ApiResult<StemLensSessionData | null>> {
  try {
    const res = await fetch(`/api/v1/stem-lens/sessions/${encodeURIComponent(sessionId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return { data: json.data, isFallback: false };
  } catch (err: any) {
    console.warn('updateStemLensSessionTitle error:', err.message);
    return { data: null, isFallback: true, error: err.message };
  }
}

export async function deleteStemLensSession(
  sessionId: string
): Promise<ApiResult<{ success: boolean; id: string }>> {
  try {
    const res = await fetch(`/api/v1/stem-lens/sessions/${encodeURIComponent(sessionId)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return { data: json.data, isFallback: false };
  } catch (err: any) {
    console.warn('deleteStemLensSession error:', err.message);
    return { data: { success: false, id: sessionId }, isFallback: true, error: err.message };
  }
}

export async function sendStemLensChat(
  params: StemLensSendParams
): Promise<ApiResult<StemLensChatResponseData>> {
  try {
    const res = await fetch('/api/v1/stem-lens/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Chat API error (${res.status}): ${errText}`);
    }
    const json = await res.json();
    return { data: json.data, isFallback: false };
  } catch (err: any) {
    console.error('StemLensChat Error:', err);
    return {
      data: {
        sessionId: params.sessionId || `session-${Date.now()}`,
        reply: `Error contacting STEM Lens xAI service: ${err.message}`,
        model: 'error',
        timestamp: new Date().toISOString(),
      },
      isFallback: true,
      error: err.message,
    };
  }
}

export async function fetchStemLensPrompt(): Promise<
  ApiResult<{ systemPrompt: string; filePath: string }>
> {
  try {
    const res = await fetch('/api/v1/stem-lens/prompt');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return { data: json.data, isFallback: false };
  } catch (err: any) {
    return {
      data: {
        systemPrompt: 'Default system prompt',
        filePath: 'apps/api/src/modules/stem-lens/stemLensPrompt.ts',
      },
      isFallback: true,
      error: err.message,
    };
  }
}
