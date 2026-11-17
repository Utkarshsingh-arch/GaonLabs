import {
  TopicDetail,
  TopicLesson,
  TopicVideoMeta,
  TopicOfficialResource,
} from './topic.types';

export const TOPIC_SUMMARIES: TopicDetail[] = [
  // 1. Class 3 Mathematics - Fun with Shapes
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
    coverImage: '/covers/shapes-class3.svg',
    difficulty: 'FOUNDATIONAL',
    lessonOverview: 'A foundational introduction to two-dimensional geometry, flat vs curved edges, vertices, and physical geometric storytelling.',
    officialResources: {
      topicId: 'topic-shapes-class3',
      boardName: 'Central Board of Secondary Education (CBSE) / NCERT',
      textbookTitle: 'Maths Mela - Textbook of Mathematics for Class 3',
      chapterNumber: 5,
      chapterTitle: 'Fun with Shapes',
      officialSourceUrl: 'https://ncert.nic.in/textbook.php?cemm1=5-14',
      publisher: 'National Council of Educational Research and Training (NCERT)',
      licenceNotice: 'NCERT Copyright © National Council of Educational Research and Training. Metadata and official links indexed for educational study.',
      disclaimer: 'GaonLab does not mirror copyrighted textbook contents. Students can access official textbooks via NCERT portals.',
    },
    videoMeta: {
      videoId: 'video-shapes-class3-en',
      topicId: 'topic-shapes-class3',
      title: 'Fun with Shapes — Animated Journey',
      language: 'en',
      streamUrl: '/api/v1/videos/stream/video-shapes-class3-en',
      durationSeconds: 48,
      resolution: '1280x720',
      hasAudio: true,
      captionsUrl: '/api/v1/videos/captions/video-shapes-class3-en.vtt',
      transcriptUrl: '/api/v1/videos/transcripts/video-shapes-class3-en.txt',
      generationStatus: 'GENERATED',
      contentReviewStatus: 'VERIFIED',
    },
  },

  // 2. Class 8 Science - Exploring Forces and Friction
  {
    topicId: 'topic-forces-friction-cl8',
    title: 'Exploring Forces and Friction',
    shortDescription: 'Discover the science of contact forces, surface interlocking, and friction in everyday motion.',
    boardId: 'CBSE',
    frameworkId: 'NCF_SE_2023',
    grade: 8,
    subjectId: 'SCIENCE',
    subjectName: 'Science',
    stemPillar: 'SCIENCE',
    medium: 'en',
    academicYear: '2026-2027',
    accessMode: 'GAONLAB_FULL',
    contentStatus: 'PUBLISHED',
    hasLesson: true,
    hasVideo: true,
    hasOfficialResources: true,
    relatedEditionId: '233b66aa-fbce-475b-810d-5e9025db6be3',
    relatedChapterId: '84290c8e-cdf9-4eae-8337-621b4b6e6a82',
    coverImage: '/covers/friction-class8.svg',
    difficulty: 'INTERMEDIATE',
    lessonOverview: 'Investigation into contact and non-contact forces, friction vectors, microscopic surface interlocking, and village engineering applications.',
    officialResources: {
      topicId: 'topic-forces-friction-cl8',
      boardName: 'Central Board of Secondary Education (CBSE) / NCERT',
      textbookTitle: 'Curiosity - Science Grade 8',
      editionId: '233b66aa-fbce-475b-810d-5e9025db6be3',
      chapterNumber: 5,
      chapterTitle: 'Exploring Forces',
      chapterId: '84290c8e-cdf9-4eae-8337-621b4b6e6a82',
      officialSourceUrl: 'https://ncert.nic.in/textbook.php?hesc1=5-13',
      publisher: 'National Council of Educational Research and Training (NCERT)',
      licenceNotice: 'NCERT Copyright © National Council of Educational Research and Training.',
      disclaimer: 'Full digital textbooks are available through the official NCERT portal.',
    },
    videoMeta: {
      videoId: 'video-forces-friction-cl8-en',
      topicId: 'topic-forces-friction-cl8',
      title: 'Exploring Forces and Friction — Microscopic Science',
      language: 'en',
      streamUrl: '/api/v1/videos/stream/video-forces-friction-cl8-en',
      durationSeconds: 62,
      resolution: '1280x720',
      hasAudio: true,
      captionsUrl: '/api/v1/videos/captions/video-forces-friction-cl8-en.vtt',
      transcriptUrl: '/api/v1/videos/transcripts/video-forces-friction-cl8-en.txt',
      generationStatus: 'GENERATED',
      contentReviewStatus: 'VERIFIED',
    },
  },

  // 3. Class 11 Physics - Rotational Motion
  {
    topicId: 'topic-rotational-motion-cl11',
    title: 'Rotational Motion and Moment of Inertia',
    shortDescription: 'Understand angular velocity, torque, moment of inertia, and rotational dynamics of rigid bodies.',
    boardId: 'CBSE',
    frameworkId: 'NCF_SE_2023',
    grade: 11,
    subjectId: 'PHYSICS',
    subjectName: 'Physics',
    stemPillar: 'SCIENCE',
    medium: 'en',
    academicYear: '2026-2027',
    accessMode: 'GAONLAB_FULL',
    contentStatus: 'PUBLISHED',
    hasLesson: true,
    hasVideo: true,
    hasOfficialResources: true,
    coverImage: '/covers/rotational-motion-cl11.svg',
    difficulty: 'ADVANCED',
    lessonOverview: 'Advanced classical mechanics covering fixed-axis rotation, torque cross products, mass distribution moments, and angular momentum conservation.',
    officialResources: {
      topicId: 'topic-rotational-motion-cl11',
      boardName: 'Central Board of Secondary Education (CBSE) / NCERT',
      textbookTitle: 'Physics Part I - Textbook for Class XI',
      chapterNumber: 6,
      chapterTitle: 'Systems of Particles and Rotational Motion',
      officialSourceUrl: 'https://ncert.nic.in/textbook.php?keph1=6-7',
      publisher: 'National Council of Educational Research and Training (NCERT)',
      licenceNotice: 'NCERT Copyright © National Council of Educational Research and Training.',
      disclaimer: 'GaonLab indexes chapter metadata and provides original educational explainers.',
    },
    videoMeta: {
      videoId: 'video-rotational-motion-cl11-en',
      topicId: 'topic-rotational-motion-cl11',
      title: 'Rotational Motion & Torque — Vectors in Action',
      language: 'en',
      streamUrl: '/api/v1/videos/stream/video-rotational-motion-cl11-en',
      durationSeconds: 78,
      resolution: '1280x720',
      hasAudio: true,
      captionsUrl: '/api/v1/videos/captions/video-rotational-motion-cl11-en.vtt',
      transcriptUrl: '/api/v1/videos/transcripts/video-rotational-motion-cl11-en.txt',
      generationStatus: 'GENERATED',
      contentReviewStatus: 'VERIFIED',
    },
  },

  // 4. Class 9 Science - Atoms and Molecules (Chemistry)
  {
    topicId: 'topic-atoms-molecules-cl9',
    title: 'Atoms and Molecules',
    shortDescription: 'Laws of chemical combination, Dalton atomic theory, and atomic mass calculations.',
    boardId: 'CBSE',
    frameworkId: 'NCF_SE_2023',
    grade: 9,
    subjectId: 'CHEMISTRY',
    subjectName: 'Chemistry',
    stemPillar: 'SCIENCE',
    medium: 'en',
    academicYear: '2026-2027',
    accessMode: 'HYBRID',
    contentStatus: 'PUBLISHED',
    hasLesson: true,
    hasVideo: false,
    hasOfficialResources: true,
    relatedEditionId: '1c1a605d-8e56-4fc5-93e9-e693646fb78c',
    relatedChapterId: 'dd63455f-c65e-43d1-a340-a8065c034196',
    coverImage: '/covers/atoms-molecules-cl9.svg',
    difficulty: 'INTERMEDIATE',
    lessonOverview: 'Investigation into the particulate building blocks of matter and chemical bonding foundations.',
    officialResources: {
      topicId: 'topic-atoms-molecules-cl9',
      boardName: 'CBSE / NCERT',
      textbookTitle: 'Science - Grade 9',
      editionId: '1c1a605d-8e56-4fc5-93e9-e693646fb78c',
      chapterNumber: 3,
      chapterTitle: 'Atoms and Molecules',
      chapterId: 'dd63455f-c65e-43d1-a340-a8065c034196',
      officialSourceUrl: 'https://ncert.nic.in/textbook.php?iesc1=3-12',
      publisher: 'NCERT',
      licenceNotice: 'NCERT Copyright © National Council of Educational Research and Training.',
      disclaimer: 'Official curriculum links provided.',
    },
  },

  // 5. Class 9 Science - Fundamental Unit of Life (Biology)
  {
    topicId: 'topic-cell-unit-of-life-cl9',
    title: 'The Fundamental Unit of Life: Cell Structure',
    shortDescription: 'Cell biology, plasma membrane diffusion, osmosis, and organelle functions.',
    boardId: 'CBSE',
    frameworkId: 'NCF_SE_2023',
    grade: 9,
    subjectId: 'BIOLOGY',
    subjectName: 'Biology',
    stemPillar: 'SCIENCE',
    medium: 'en',
    academicYear: '2026-2027',
    accessMode: 'HYBRID',
    contentStatus: 'PUBLISHED',
    hasLesson: true,
    hasVideo: false,
    hasOfficialResources: true,
    relatedEditionId: '1c1a605d-8e56-4fc5-93e9-e693646fb78c',
    relatedChapterId: '814216cc-af71-4f43-b3f7-2fa611faf30e',
    coverImage: '/covers/cell-unit-of-life-cl9.svg',
    difficulty: 'INTERMEDIATE',
    lessonOverview: 'Exploration of cell structure, plant vs animal cells, and cellular transport mechanisms.',
    officialResources: {
      topicId: 'topic-cell-unit-of-life-cl9',
      boardName: 'CBSE / NCERT',
      textbookTitle: 'Science - Grade 9',
      editionId: '1c1a605d-8e56-4fc5-93e9-e693646fb78c',
      chapterNumber: 5,
      chapterTitle: 'The Fundamental Unit of Life',
      chapterId: '814216cc-af71-4f43-b3f7-2fa611faf30e',
      officialSourceUrl: 'https://ncert.nic.in/textbook.php?iesc1=5-12',
      publisher: 'NCERT',
      licenceNotice: 'NCERT Copyright © National Council of Educational Research and Training.',
      disclaimer: 'Official curriculum links provided.',
    },
  },

  // 6. Class 11 Computer Science - Python Fundamentals
  {
    topicId: 'topic-cs-python-cl11',
    title: 'Computer Systems and Python Fundamentals',
    shortDescription: 'Basic computer architecture, data representation, Python data types and control flow.',
    boardId: 'CBSE',
    frameworkId: 'NCF_SE_2023',
    grade: 11,
    subjectId: 'COMPUTER_SCIENCE',
    subjectName: 'Computer Science',
    stemPillar: 'COMPUTING',
    medium: 'en',
    academicYear: '2026-2027',
    accessMode: 'OFFICIAL_EXTERNAL',
    contentStatus: 'PUBLISHED',
    hasLesson: false,
    hasVideo: false,
    hasOfficialResources: true,
    coverImage: '/covers/cs-python-cl11.svg',
    difficulty: 'INTERMEDIATE',
    officialResources: {
      topicId: 'topic-cs-python-cl11',
      boardName: 'CBSE / NCERT',
      textbookTitle: 'Computer Science with Python - Class XI',
      chapterNumber: 1,
      chapterTitle: 'Computer System Overview and Python Programming',
      officialSourceUrl: 'https://ncert.nic.in/textbook.php?kecs1=1-11',
      publisher: 'NCERT',
      licenceNotice: 'NCERT Copyright © National Council of Educational Research and Training.',
      disclaimer: 'Official resource link to NCERT computer science curriculum.',
    },
  },

  // 7. Class 11 Informatics Practices - Database Concepts
  {
    topicId: 'topic-ip-database-cl11',
    title: 'Relational Database Concepts and SQL',
    shortDescription: 'Relational database schema, keys, tables, and structured queries.',
    boardId: 'CBSE',
    frameworkId: 'NCF_SE_2023',
    grade: 11,
    subjectId: 'INFORMATICS_PRACTICES',
    subjectName: 'Informatics Practices',
    stemPillar: 'COMPUTING',
    medium: 'en',
    academicYear: '2026-2027',
    accessMode: 'OFFICIAL_EXTERNAL',
    contentStatus: 'PUBLISHED',
    hasLesson: false,
    hasVideo: false,
    hasOfficialResources: true,
    coverImage: '/covers/ip-database-cl11.svg',
    difficulty: 'INTERMEDIATE',
    officialResources: {
      topicId: 'topic-ip-database-cl11',
      boardName: 'CBSE / NCERT',
      textbookTitle: 'Informatics Practices - Textbook for Class XI',
      chapterNumber: 7,
      chapterTitle: 'Database Concepts and SQL',
      officialSourceUrl: 'https://ncert.nic.in/textbook.php?keip1=7-8',
      publisher: 'NCERT',
      licenceNotice: 'NCERT Copyright © National Council of Educational Research and Training.',
      disclaimer: 'Official resource link to NCERT informatics practices curriculum.',
    },
  },

  // 8. Class 11 Applied Mathematics - Mathematical Reasoning
  {
    topicId: 'topic-applied-math-cl11',
    title: 'Applied Mathematics: Financial & Numerical Reasoning',
    shortDescription: 'Modular arithmetic, log scales, banking computations, and taxation models.',
    boardId: 'CBSE',
    frameworkId: 'NCF_SE_2023',
    grade: 11,
    subjectId: 'APPLIED_MATHEMATICS',
    subjectName: 'Applied Mathematics',
    stemPillar: 'MATHEMATICS',
    medium: 'en',
    academicYear: '2026-2027',
    accessMode: 'OFFICIAL_EXTERNAL',
    contentStatus: 'PUBLISHED',
    hasLesson: false,
    hasVideo: false,
    hasOfficialResources: true,
    coverImage: '/covers/applied-math-cl11.svg',
    difficulty: 'ADVANCED',
    officialResources: {
      topicId: 'topic-applied-math-cl11',
      boardName: 'CBSE / NCERT',
      textbookTitle: 'Applied Mathematics - Class XI',
      chapterNumber: 1,
      chapterTitle: 'Numbers, Quantification and Numerical Applications',
      officialSourceUrl: 'https://ncert.nic.in/textbook.php',
      publisher: 'CBSE / NCERT',
      licenceNotice: 'NCERT Copyright © National Council of Educational Research and Training.',
      disclaimer: 'Official curriculum links provided.',
    },
  },

  // =========================================================================
  // KARNATAKA STATE BOARD (KTBS) — CLASS 7 KANNADA MEDIUM STEM TOPICS
  // =========================================================================

  // 9. Class 7 Science (KTBS) - ಉಷ್ಣ ಮತ್ತು ತಾಪಮಾನ ವರ್ಗಾವಣೆ (Heat Transfer)
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
    coverImage: '/covers/heat-class7-kn.svg',
    difficulty: 'INTERMEDIATE',
    lessonOverview: '7ನೇ ತರಗತಿ ಕರ್ನಾಟಕ ಪಠ್ಯಪುಸ್ತಕದ ಅಧ್ಯಾಯ 4 (ಉಷ್ಣ) ಆಧಾರಿತ ಮೂಲ ವೈಜ್ಞಾನಿಕ ವಿವರಣೆ: ವಹನ, ಸಂವಹನ, ವಿಕಿರಣ ಮತ್ತು ಗ್ರಾಮೀಣ ದೈನಂದಿನ ಅನ್ವಯಗಳು.',
    relatedEditionId: '8e4c6ecd-c661-4ed9-a5ec-a80ad8dc3fe6',
    relatedChapterId: 'ad794275-7405-4039-8276-7db15c6ee237',
    officialResources: {
      topicId: 'topic-ktbs-heat-cl7-kn',
      boardName: 'ಕರ್ನಾಟಕ ಶಾಲಾ ಪರೀಕ್ಷೆ ಮತ್ತು ಮೌಲ್ಯನಿರ್ಣಯ ಮಂಡಳಿ (KSEAB / KTBS)',
      textbookTitle: 'ವಿಜ್ಞಾನ - 7ನೇ ತರಗತಿ ಪಠ್ಯಪುಸ್ತಕ (Kannada)',
      chapterNumber: 4,
      chapterTitle: 'ಉಷ್ಣ',
      officialSourceUrl: 'https://ktbs.kar.nic.in/New/textbook.html',
      publisher: 'ಕರ್ನಾಟಕ ಪಠ್ಯಪುಸ್ತಕ ಸಂಘ (KTBS)',
      licenceNotice: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಪಠ್ಯಪುಸ್ತಕ ಪ್ರಕಾಶನ ಹಕ್ಕುಸ್ವಾಮ್ಯ © ಕರ್ನಾಟಕ ಪಠ್ಯಪುಸ್ತಕ ಸಂಘ (KTBS). ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕ ಮಾಹಿತಿಗಾಗಿ KTBS ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ.',
      disclaimer: 'ಗಾಂವ್‌ಲ್ಯಾಬ್ ಸ್ವತಂತ್ರ ಶೈಕ್ಷಣಿಕ ಅನ್ವಯಗಳನ್ನು ಮಾತ್ರ ಒದಗಿಸುತ್ತದೆ. ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕಗಳನ್ನು KTBS ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ವೀಕ್ಷಿಸಬಹುದು.',
    },
    videoMeta: {
      videoId: 'video-heat-class7-kn',
      topicId: 'topic-ktbs-heat-cl7-kn',
      title: 'ಉಷ್ಣ ಮತ್ತು ತಾಪಮಾನ ವರ್ಗಾವಣೆ — ಸಚಿತ್ರ ಅನಿಮೇಷನ್',
      language: 'kn',
      streamUrl: '/api/v1/videos/stream/video-heat-class7-kn',
      durationSeconds: 104,
      resolution: '1280x720',
      hasAudio: true,
      captionsUrl: '/api/v1/videos/captions/video-heat-class7-kn.vtt',
      transcriptUrl: '/api/v1/videos/transcripts/video-heat-class7-kn.txt',
      generationStatus: 'GENERATED',
      contentReviewStatus: 'VERIFIED',
    },
  },

  // 10. Class 7 Mathematics (KTBS) - ಪೂರ್ಣಾಂಕಗಳು (Integers)
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
    coverImage: '/covers/integers-class7-kn.svg',
    difficulty: 'FOUNDATIONAL',
    lessonOverview: '7ನೇ ತರಗತಿ ಗಣಿತದ ಅಧ್ಯಾಯ 1 (ಪೂರ್ಣಾಂಕಗಳು): ಧನ ಮತ್ತು ಋಣ ಸಂಖ್ಯೆಗಳ ನಿಯಮಗಳು, ಸಂಖ್ಯಾ ರೇಖೆ ಮತ್ತು ಗ್ರಾಮೀಣ ವ್ಯಾಪಾರ ಲೆಕ್ಕಾಚಾರಗಳು.',
    relatedEditionId: '08e264b3-eb28-4183-8e49-2f2fe4df2bf2',
    relatedChapterId: '02875d00-7eac-421b-9741-c7c94f11215f',
    officialResources: {
      topicId: 'topic-ktbs-integers-cl7-kn',
      boardName: 'ಕರ್ನಾಟಕ ಶಾಲಾ ಪರೀಕ್ಷೆ ಮತ್ತು ಮೌಲ್ಯನಿರ್ಣಯ ಮಂಡಳಿ (KTBS)',
      textbookTitle: 'ಗಣಿತ - 7ನೇ ತರಗತಿ ಪಠ್ಯಪುಸ್ತಕ (Kannada)',
      chapterNumber: 1,
      chapterTitle: 'ಪೂರ್ಣಾಂಕಗಳು',
      officialSourceUrl: 'https://ktbs.kar.nic.in/New/textbook.html',
      publisher: 'ಕರ್ನಾಟಕ ಪಠ್ಯಪುಸ್ತಕ ಸಂಘ (KTBS)',
      licenceNotice: 'ಕರ್ನಾಟಕ ಪಠ್ಯಪುಸ್ತಕ ಸಂಘ (KTBS) ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕ ಉಲ್ಲೇಖ.',
      disclaimer: 'ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕ ವಿಷಯಗಳನ್ನು KTBS ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ.',
    },
  },

  // 11. Class 7 Science (KTBS) - ಚಲನೆ ಮತ್ತು ಕಾಲ (Motion and Time)
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
    coverImage: '/covers/motion-time-class7-kn.svg',
    difficulty: 'INTERMEDIATE',
    lessonOverview: '7ನೇ ತರಗತಿ ವಿಜ್ಞಾನದ ಅಧ್ಯಾಯ 13 (ಚಲನೆ ಮತ್ತು ಕಾಲ): ಸರಳ ಲೋಲಕದ ಆವರ್ತನ ಕಾಲ ಮತ್ತು ಎತ್ತಿನ ಗಾಡಿ/ವಾಹನಗಳ ವೇಗದ ಸೂತ್ರ.',
    relatedEditionId: '8e4c6ecd-c661-4ed9-a5ec-a80ad8dc3fe6',
    relatedChapterId: 'a1b2b711-5e11-4e80-910d-0f0472fde44c',
    officialResources: {
      topicId: 'topic-ktbs-motion-time-cl7-kn',
      boardName: 'ಕರ್ನಾಟಕ ಶಾಲಾ ಪರೀಕ್ಷೆ ಮತ್ತು ಮೌಲ್ಯನಿರ್ಣಯ ಮಂಡಳಿ (KTBS)',
      textbookTitle: 'ವಿಜ್ಞಾನ - 7ನೇ ತರಗತಿ ಪಠ್ಯಪುಸ್ತಕ (Kannada)',
      chapterNumber: 13,
      chapterTitle: 'ಚಲನೆ ಮತ್ತು ಕಾಲ',
      officialSourceUrl: 'https://ktbs.kar.nic.in/New/textbook.html',
      publisher: 'ಕರ್ನಾಟಕ ಪಠ್ಯಪುಸ್ತಕ ಸಂಘ (KTBS)',
      licenceNotice: 'ಕರ್ನಾಟಕ ಪಠ್ಯಪುಸ್ತಕ ಸಂಘ (KTBS) ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕ ಉಲ್ಲೇಖ.',
      disclaimer: 'ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕ ವಿಷಯಗಳನ್ನು KTBS ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ.',
    },
  },

  // 12. Class 7 Mathematics (KTBS) - ರೇಖೆಗಳು ಮತ್ತು ಕೋನಗಳು (Lines and Angles)
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
    coverImage: '/covers/lines-angles-class7-kn.svg',
    difficulty: 'INTERMEDIATE',
    lessonOverview: '7ನೇ ತರಗತಿ ಗಣಿತದ ಅಧ್ಯಾಯ 5 (ರೇಖೆಗಳು ಮತ್ತು ಕೋನಗಳು): ಸಮಾಂತರ ರೇಖೆಗಳು, ಛೇದಕ ರೇಖೆಗಳು ಮತ್ತು ಕೋನಗಳ ಸಂಬಂಧ.',
    relatedEditionId: '08e264b3-eb28-4183-8e49-2f2fe4df2bf2',
    relatedChapterId: '0fcfa5be-9f8e-4203-a84c-6feee3bc2334',
    officialResources: {
      topicId: 'topic-ktbs-lines-angles-cl7-kn',
      boardName: 'ಕರ್ನಾಟಕ ಶಾಲಾ ಪರೀಕ್ಷೆ ಮತ್ತು ಮೌಲ್ಯನಿರ್ಣಯ ಮಂಡಳಿ (KTBS)',
      textbookTitle: 'ಗಣಿತ - 7ನೇ ತರಗತಿ ಪಠ್ಯಪುಸ್ತಕ (Kannada)',
      chapterNumber: 5,
      chapterTitle: 'ರೇಖೆಗಳು ಮತ್ತು ಕೋನಗಳು',
      officialSourceUrl: 'https://ktbs.kar.nic.in/New/textbook.html',
      publisher: 'ಕರ್ನಾಟಕ ಪಠ್ಯಪುಸ್ತಕ ಸಂಘ (KTBS)',
      licenceNotice: 'ಕರ್ನಾಟಕ ಪಠ್ಯಪುಸ್ತಕ ಸಂಘ (KTBS) ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕ ಉಲ್ಲೇಖ.',
      disclaimer: 'ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕ ವಿಷಯಗಳನ್ನು KTBS ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ.',
    },
  },
];

export const TOPIC_LESSONS: Record<string, TopicLesson> = {
  // 1. Fun with Shapes (Class 3 Mathematics)
  'topic-shapes-class3': {
    topicId: 'topic-shapes-class3',
    title: 'Fun with Shapes',
    grade: 3,
    subject: 'Mathematics',
    language: 'en',
    topicIntroduction:
      'Welcome to the wondrous world of shapes! Look all around your classroom, home, and village. The round chapati on your plate, the tall doorway of your house, the triangular roof of a temple, and the circular wheels of a bullock cart are all shapes.',
    simpleExplanation:
      'A shape is the boundary or outer outline of an object. Shapes that lie flat on paper are called 2D shapes (like circles, squares, rectangles, and triangles). Solid shapes that you can pick up, roll, or hold in your hand are called 3D shapes (like balls, boxes, and ice cream cones).',
    scientificPrinciples: [
      {
        title: 'Circles & Curved Edges',
        statement: 'A circle is perfectly round with 1 curved edge and zero corners.',
        formula: 'Curved Perimeter = 2πr',
        explanation:
          'Because a circle has no corners, it can roll smoothly without bumping. This makes the circle the foundation of wheels, gears, and pottery.',
      },
      {
        title: 'Triangles & Rigid Strength',
        statement: 'A triangle is a 2D shape with 3 straight sides and 3 sharp corners (vertices).',
        formula: 'Sum of Angles = 180°',
        explanation:
          'Triangles are the strongest shape in architecture because when weight is placed on a triangle, the forces distribute evenly to all three vertices.',
      },
      {
        title: 'Squares & Rectangles',
        statement: 'Squares and rectangles have 4 straight sides and 4 square corners (right angles).',
        formula: 'Area = length × width',
        explanation:
          'In a square, all 4 sides are equal. In a rectangle, opposite sides are equal. Their flat faces allow boxes and bricks to stack stably without rolling away.',
      },
      {
        title: '3D Solid Shapes',
        statement: 'Solid shapes have faces, edges, and corners. Some shapes roll, some slide, and some can do both.',
        explanation:
          'Spheres roll in all directions. Cubes slide because their faces are flat. Cylinders can roll on their curved side or stand flat on their circular faces.',
      },
    ],
    examples: [
      {
        title: 'Circular Village Objects',
        description: 'Bullock cart wheels, well openings, chapatis, and silver coins.',
        context: 'Round geometry enables continuous rotation and even distribution.',
      },
      {
        title: 'Triangular Village Structures',
        description: 'Hut roof gables, temple spires, and bamboo farm trellises.',
        context: 'Sloped triangular sides let rainwater drain quickly while supporting roof weight.',
      },
      {
        title: 'Rectangular Daily Tools',
        description: 'Sun-dried mud bricks, blackboard frames, and wooden farm gates.',
        context: 'Right angles fit together seamlessly for brick masonry.',
      },
    ],
    diagrams: [
      {
        id: 'diag-shapes-1',
        title: 'Primary 2D Shapes & Their Properties',
        caption: 'Circles (0 corners), Triangles (3 vertices), Squares (4 equal sides), Rectangles (opposite sides equal).',
        type: 'SVG_ILLUSTRATION',
      },
      {
        id: 'diag-shapes-2',
        title: '3D Shapes in Daily Village Architecture',
        caption: 'Cubes, Cuboids, Cylinders, and Cones used in village buildings and tools.',
        type: 'CANVAS_ANIMATION',
      },
    ],
    realWorldApplications: [
      {
        title: 'The Village Potter (Kumbhar)',
        description: 'The potter spins a circular wheel to shape damp river clay into cylindrical pots and hemispherical bowls.',
        villageContext: 'Radial balance ensures the pot stays centered while rotating.',
      },
      {
        title: 'Mud Brick Making',
        description: 'Clay is pressed into rectangular wooden frames so all bricks have identical dimensions for strong walls.',
        villageContext: 'Flat surfaces allow wall mortar to bond tightly without gaps.',
      },
    ],
    importantTakeaways: [
      '2D shapes are flat drawings with length and width; 3D shapes have depth and take up space.',
      'Circles have curved edges and roll; polygons have straight sides and corners.',
      'Triangles provide rigidity in village roofs, while rectangular bricks provide stable walls.',
      'Recognizing shapes helps us measure sizes, build strong houses, and solve daily puzzles.',
    ],
    glossary: [
      { term: 'Circle', definition: 'A round 2D shape whose edge is everywhere equidistant from its center.' },
      { term: 'Vertex', definition: 'A corner point where two or more edges meet.' },
      { term: 'Edge', definition: 'A line segment where two faces of a 3D shape meet, or a side of a 2D shape.' },
      { term: 'Face', definition: 'An individual flat or curved surface of a three-dimensional solid.' },
      { term: 'Polygon', definition: 'A closed flat shape made with straight lines.' },
    ],
  },

  // 2. Exploring Forces and Friction (Class 8 Science)
  'topic-forces-friction-cl8': {
    topicId: 'topic-forces-friction-cl8',
    title: 'Exploring Forces and Friction',
    grade: 8,
    subject: 'Science',
    language: 'en',
    topicIntroduction:
      'Whenever you kick a football across a village playground, it travels across the grass, gradually slows down, and comes to rest. What causes moving objects to stop? In this lesson, we explore contact forces and the essential phenomenon of friction.',
    simpleExplanation:
      'A force is a push or a pull that can change an object’s speed, direction, or shape. Friction is a resistive contact force that opposes the relative motion between two surfaces touching each other. It always acts in the direction opposite to the motion.',
    scientificPrinciples: [
      {
        title: 'Opposing Direction of Friction',
        statement: 'Friction always acts parallel to the surfaces in contact and opposite to the direction of relative movement.',
        formula: 'f_k = \\mu_k N',
        explanation:
          'If you push a wooden crate towards the right, friction acts towards the left. If you pull it to the left, friction acts to the right.',
      },
      {
        title: 'Microscopic Cause: Surface Interlocking',
        statement: 'Even visibly smooth surfaces contain microscopic ridges and valleys that interlock under pressure.',
        explanation:
          'When two surfaces touch, their irregularities interlock like gear teeth. To initiate movement, an applied force must shear or lift these microscopic interlocks.',
      },
      {
        title: 'Three Types of Friction',
        statement: 'Static Friction > Sliding (Kinetic) Friction > Rolling Friction.',
        explanation:
          'Static friction opposes the start of motion. Once sliding begins, interlocking is reduced. Rolling friction is much smaller than sliding friction, which is why wheels revolutionize transport.',
      },
      {
        title: 'Lubrication and Wear',
        statement: 'Lubricants create a thin fluid layer between surfaces, preventing direct contact of solid irregularities.',
        explanation:
          'Grease, oil, and fine powder reduce friction, prevent machinery overheating, and prolong the lifespan of bearings and axles.',
      },
    ],
    examples: [
      {
        title: 'Bicycle Brakes',
        description: 'Rubber brake pads press against the spinning metal wheel rim, creating intentional friction that brings the cycle to a halt.',
        context: 'High friction is engineered for passenger safety.',
      },
      {
        title: 'Walking and Footwear Grooves',
        description: 'Shoe soles have grooves (treads) to maintain frictional grip against wet soil or paved roads.',
        context: 'Without friction, walking would be impossible — feet would slip backward.',
      },
      {
        title: 'Striking a Matchstick',
        description: 'Rubbing the match head against the rough side of a matchbox generates concentrated frictional heat that ignites the phosphorus.',
        context: 'Friction converts mechanical kinetic energy directly into thermal energy.',
      },
    ],
    diagrams: [
      {
        id: 'diag-friction-1',
        title: 'Opposing Force Vector Model',
        caption: 'Applied pushing force vector (F_push) opposed by frictional resistance vector (f_friction).',
        type: 'CANVAS_ANIMATION',
      },
      {
        id: 'diag-friction-2',
        title: 'Microscopic Surface Interlocking Model',
        caption: 'Magnified view of ridges and valleys interlocking between sliding body and rough ground.',
        type: 'INTERACTIVE_MODEL',
      },
    ],
    realWorldApplications: [
      {
        title: 'Bullock Cart Axle Lubrication',
        description: 'Farmers apply castor oil or grease to wooden axles so the heavy cart rolls freely without burning the timber.',
        villageContext: 'Reduces the physical draft force required from working farm cattle.',
      },
      {
        title: 'Carrom Board Powder',
        description: 'Sprinkling fine boric powder fills microscopic board pores, turning rough sliding friction into smooth gliding.',
        villageContext: 'A common demonstration of dry solid lubrication.',
      },
    ],
    importantTakeaways: [
      'Friction is a contact force that always opposes relative motion between contacting surfaces.',
      'Friction arises from the interlocking of microscopic irregularities on touching surfaces.',
      'Static friction is greater than sliding friction, which is greater than rolling friction.',
      'Friction is a necessary evil: without it we cannot walk, write, or drive, but excessive friction wastes energy and causes machine wear.',
    ],
    glossary: [
      { term: 'Contact Force', definition: 'A force that can only be exerted when two objects are physically touching.' },
      { term: 'Friction', definition: 'The resistive contact force opposing the relative motion of two contacting bodies.' },
      { term: 'Interlocking', definition: 'The mechanical trapping of microscopic surface asperities with each other.' },
      { term: 'Lubricant', definition: 'A substance introduced between moving surfaces to reduce friction and wear.' },
      { term: 'Rolling Friction', definition: 'The frictional resistance experienced when a body rolls over a surface.' },
    ],
  },

  // 3. Rotational Motion and Moment of Inertia (Class 11 Physics)
  'topic-rotational-motion-cl11': {
    topicId: 'topic-rotational-motion-cl11',
    title: 'Rotational Motion and Moment of Inertia',
    grade: 11,
    subject: 'Physics',
    language: 'en',
    topicIntroduction:
      'In translational mechanics, an external net force produces linear acceleration. When extended rigid bodies rotate about a fixed axis — like a village potter’s wheel, a grinding millstone, or a well pulley — we must examine rotational dynamics, torque, and mass distribution.',
    simpleExplanation:
      'Rotational motion is the movement of a rigid body where all constituent particles travel in concentric circular paths centered along a common rotational axis. Just as mass resists linear changes, moment of inertia resists rotational changes.',
    scientificPrinciples: [
      {
        title: 'Torque: The Rotational Analogue of Force',
        statement: 'Torque is the vector product of position vector and applied force.',
        formula: '\\tau = \\mathbf{r} \\times \\mathbf{F} = r F \\sin\\theta',
        explanation:
          'Torque depends not only on force magnitude, but also on the perpendicular lever arm distance from the axis of rotation.',
      },
      {
        title: 'Moment of Inertia',
        statement: 'The measure of rotational inertia depending on mass and its spatial distribution relative to the axis.',
        formula: 'I = \\sum m_i r_i^2 = \\int r^2 dm',
        explanation:
          'Mass concentrated farther from the axis creates a significantly higher moment of inertia, making it harder to start or stop rotating.',
      },
      {
        title: 'Rotational Newton’s Second Law',
        statement: 'The rate of change of angular momentum equals the net external torque.',
        formula: '\\tau_{\\text{ext}} = I \\alpha = \\frac{d\\mathbf{L}}{dt}',
        explanation:
          'Net torque produces angular acceleration alpha inversely proportional to the moment of inertia I.',
      },
      {
        title: 'Conservation of Angular Momentum',
        statement: 'When net external torque is zero, total angular momentum L remains constant.',
        formula: '\\mathbf{L} = I \\boldsymbol{\\omega} = \\text{constant}',
        explanation:
          'If a rotating system decreases its moment of inertia (e.g. ice skater pulling in arms), its angular velocity must increase proportionally.',
      },
    ],
    examples: [
      {
        title: 'Village Hand Pump Handle',
        description: 'The handle is elongated so a person can apply force far from the pivot, maximizing torque with little effort.',
        context: 'Demonstration of torque as a function of lever arm radius r.',
      },
      {
        title: 'Stone Flour Grinding Mill (Chakki)',
        description: 'The wooden turning peg is intentionally fixed near the outer rim rather than near the center hole.',
        context: 'Maximizes radial distance r to minimize the muscle force F needed to turn the heavy granite stone.',
      },
      {
        title: 'Flywheel in Agricultural Diesel Engines',
        description: 'A heavy metal rim stores substantial rotational kinetic energy (1/2 I omega^2) to smooth out engine strokes.',
        context: 'High moment of inertia prevents sudden speed fluctuations.',
      },
    ],
    diagrams: [
      {
        id: 'diag-rotation-1',
        title: 'Torque Vector Cross Product Model',
        caption: 'Force applied at angle theta on radius r producing perpendicular torque vector tau.',
        type: 'CANVAS_ANIMATION',
      },
      {
        id: 'diag-rotation-2',
        title: 'Flywheel Mass Distribution & Angular Velocity',
        caption: 'Comparison of mass concentrated at center vs rim for identical total mass.',
        type: 'INTERACTIVE_MODEL',
      },
    ],
    realWorldApplications: [
      {
        title: 'Well Water Pulley (Ghari)',
        description: 'Using a rotating grooved wheel turns sliding rope friction into smooth rotation, reducing rope wear and pulling effort.',
        villageContext: 'A classical rural application of rotational mechanics.',
      },
      {
        title: 'Potter’s Wheel Flywheel Inertia',
        description: 'The potter kicks the heavy outer rim to high angular velocity, then shapes several clay pots purely using stored rotational momentum.',
        villageContext: 'Demonstrates angular momentum and rotational kinetic energy storage.',
      },
    ],
    importantTakeaways: [
      'Torque is the rotational counterpart of force; it equals force multiplied by the perpendicular lever arm.',
      'Moment of inertia depends not just on total mass, but heavily on how far that mass is distributed from the axis.',
      'Torque equals moment of inertia multiplied by angular acceleration (tau = I * alpha).',
      'Angular momentum is conserved when external torque is zero, governing celestial bodies, flywheels, and simple tools.',
    ],
    glossary: [
      { term: 'Torque', definition: 'The turning effect of a force about an axis of rotation.' },
      { term: 'Moment of Inertia', definition: 'The quantitative resistance of a body to angular acceleration about an axis.' },
      { term: 'Angular Velocity', definition: 'The rate of change of angular displacement with respect to time (radians/second).' },
      { term: 'Angular Momentum', definition: 'The rotational analogue of linear momentum, given by L = I * omega.' },
      { term: 'Rigid Body', definition: 'A body in which distance between any two constituent particles remains constant under motion.' },
    ],
  },

  // =========================================================================
  // KARNATAKA STATE BOARD (KTBS) — CLASS 7 KANNADA MEDIUM LESSONS
  // =========================================================================

  // 4. Class 7 Science: ಉಷ್ಣ ಮತ್ತು ತಾಪಮಾನ ವರ್ಗಾವಣೆ (Heat Transfer)
  'topic-ktbs-heat-cl7-kn': {
    topicId: 'topic-ktbs-heat-cl7-kn',
    title: 'ಉಷ್ಣ ಮತ್ತು ತಾಪಮಾನ ವರ್ಗಾವಣೆ (Heat Transfer)',
    grade: 7,
    subject: 'ವಿಜ್ಞಾನ (Science)',
    language: 'kn',
    topicIntroduction:
      'ನಮಸ್ಕಾರ ವಿದ್ಯಾರ್ಥಿಗಳೇ! ನಮ್ಮ ದೈನಂದಿನ ಜೀವನದಲ್ಲಿ ಉಷ್ಣವು ಅತ್ಯಂತ ಪ್ರಮುಖ ಶಕ್ತಿಯಾಗಿದೆ. ಚಳಿಗಾಲದಲ್ಲಿ ಬೆಂಕಿ ಕಾಯಿಸಿಕೊಳ್ಳುವುದು, ಬಿಸಿಲಿನಲ್ಲಿ ಒಣಗುವ ಬಟ್ಟೆಗಳು, ಅಡುಗೆ ಮನೆಯಲ್ಲಿ ಬೇಯುವ ಅನ್ನ — ಇವೆಲ್ಲವೂ ಉಷ್ಣ ಶಕ್ತಿಯ ನಿದರ್ಶನಗಳು.',
    simpleExplanation:
      'ಉಷ್ಣ (Heat) ಎಂಬುದು ಶಕ್ತಿಯ ಒಂದು ರೂಪ. ಇದು ಯಾವಾಗಲೂ ಹೆಚ್ಚು ತಾಪಮಾನವಿರುವ (ಬಿಸಿಯಾದ) ವಸ್ತುವಿನಿಂದ ಕಡಿಮೆ ತಾಪಮಾನವಿರುವ (ತಂಪಾದ) ವಸ್ತುವಿನ ಕಡೆಗೆ ತಾನಾಗಿಯೇ ಹರಿಯುತ್ತದೆ. ತಾಪಮಾನ (Temperature) ಎಂಬುದು ಒಂದು ವಸ್ತು ಎಷ್ಟು ಬಿಸಿಯಾಗಿದೆ ಅಥವಾ ಎಷ್ಟು ತಂಪಾಗಿದೆ ಎಂಬುದರ ನಿಖರ ಅಳತೆಯಾಗಿದೆ.',
    scientificPrinciples: [
      {
        title: 'ವಹನ ಕ್ರಿಯೆ (Conduction in Solids)',
        statement: 'ಘನವಸ್ತುಗಳಲ್ಲಿ ಕಣಗಳು ತಮ್ಮ ಮೂಲ ಸ್ಥಾನವನ್ನು ಬಿಟ್ಟು ಚಲಿಸದೆ, ಪಕ್ಕದ ಕಣಗಳಿಗೆ ಉಷ್ಣ ಶಕ್ತಿಯನ್ನು ಹಸ್ತಾಂತರಿಸುವ ವಿಧಾನ.',
        formula: 'Q/t = k · A · (T1 - T2) / d',
        explanation:
          'ಅಡುಗೆ ಪಾತ್ರೆಯಲ್ಲಿಟ್ಟ ಲೋಹದ ಸೌಟಿನ ತುದಿ ಬಿಸಿಯಾಗುವುದು ವಹನಕ್ಕೆ ನಿದರ್ಶನ. ಲೋಹಗಳು ಉತ್ತಮ ಉಷ್ಣ ವಾಹಕಗಳು (Good Conductors).',
      },
      {
        title: 'ಸಂವಹನ ಕ್ರಿಯೆ (Convection in Fluids)',
        statement: 'ದ್ರವ ಮತ್ತು ಅನಿಲಗಳಲ್ಲಿ ಕಣಗಳ ನೈಜ ಚಲನೆಯಿಂದ ಉಷ್ಣ ಶಕ್ತಿಯು ಕೆಳಗಿನಿಂದ ಮೇಲಕ್ಕೆ ಹರಿಯುವ ಪ್ರಕ್ರಿಯೆ.',
        formula: 'ಬಿಸಿ ದ್ರವ (ಕಡಿಮೆ ಸಾಂದ್ರತೆ) ↑ , ತಂಪು ದ್ರವ (ಹೆಚ್ಚು ಸಾಂದ್ರತೆ) ↓',
        explanation:
          'ನೀರನ್ನು ಕಾಯಿಸುವಾಗ ಕೆಳಗಿನ ಬಿಸಿಯಾದ ನೀರು ಹಗುರವಾಗಿ ಮೇಲೇರುತ್ತದೆ ಮತ್ತು ಮೇಲಿನ ತಂಪಾದ ನೀರು ಕೆಳಗೆ ಬರುತ್ತದೆ. ಹೀಗೆ ಸಂವಹನ ಪ್ರವಾಹಗಳು (Convection Currents) ಉಂಟಾಗುತ್ತವೆ.',
      },
      {
        title: 'ವಿಕಿರಣ ಕ್ರಿಯೆ (Radiation)',
        statement: 'ಯಾವುದೇ ಭೌತಿಕ ಮಾಧ್ಯಮವಿಲ್ಲದೆ ವಿದ್ಯುತ್ಕಾಂತೀಯ ಅಲೆಗಳ ಮೂಲಕ ಉಷ್ಣ ವರ್ಗಾವಣೆಯಾಗುವ ವಿಧಾನ.',
        formula: 'E ∝ T⁴ (ಸ್ಟೀಫನ್ ನಿಯಮ)',
        explanation:
          'ಸೂರ್ಯನಿಂದ ಭೂಮಿಗೆ ಬರುವ ಶಾಖವು ಶೂನ್ಯ ಪ್ರದೇಶದ (Vacuum) ಮೂಲಕ ತಲುಪುತ್ತದೆ. ಇದಕ್ಕೆ ಘನ, ದ್ರವ ಅಥವಾ ಅನಿಲ ಮಾಧ್ಯಮದ ಅಗತ್ಯವಿರುವುದಿಲ್ಲ.',
      },
      {
        title: 'ಉಷ್ಣ ವಾಹಕಗಳು ಮತ್ತು ಅವಾಹಕಗಳು (Conductors & Insulators)',
        statement: 'ಉಷ್ಣವನ್ನು ತಮ್ಮ ಮೂಲಕ ಸುಲಭವಾಗಿ ಹರಿಯಲು ಬಿಡುವ ವಸ್ತುಗಳು ವಾಹಕಗಳು; ಬಿಡದ ವಸ್ತುಗಳು ಅವಾಹಕಗಳು.',
        explanation:
          'ತಾಮ್ರ, ಕಬ್ಬಿಣ, ಅಲ್ಯೂಮಿನಿಯಂ ವಾಹಕಗಳು. ಮರ, ಪ್ಲಾಸ್ಟಿಕ್, ಮಣ್ಣು, ಗಾಳಿ ಅವಾಹಕಗಳು (ಉಷ್ಣ ನಿರೋಧಕಗಳು).',
      },
    ],
    examples: [
      {
        title: 'ಅಡುಗೆ ಸೌಟು ಬಿಸಿಯಾಗುವುದು (Conduction)',
        description: 'ಕುದಿಯುವ ಸಾಂಬಾರಿನಲ್ಲಿಟ್ಟ ಉಕ್ಕಿನ ಸೌಟಿನ ಇನ್ನೊಂದು ತುದಿ ಕೆಲವೇ ನಿಮಿಷಗಳಲ್ಲಿ ಬಿಸಿಯಾಗುತ್ತದೆ.',
        context: 'ಮನೆಯ ಅಡುಗೆ ಕೋಣೆ',
      },
      {
        title: 'ಪಾತ್ರೆಯಲ್ಲಿ ನೀರು ಕುದಿಯುವುದು (Convection)',
        description: 'ಪಾತ್ರೆಯ ಕೆಳಭಾಗದಿಂದ ಬಿಸಿನೀರಿನ ಗುಳ್ಳೆಗಳು ಮೇಲಕ್ಕೆ ಬರುವುದು ಮತ್ತು ಮೇಲಿನ ನೀರು ಕೆಳಮುಖವಾಗಿ ಚಲಿಸುವುದು.',
        context: 'ಪ್ರಯೋಗಾಲಯ ಮತ್ತು ಮನೆ',
      },
      {
        title: 'ಬಿಸಿಲಿನಲ್ಲಿ ಮೈ ಕಾಯಿಸುವುದು (Radiation)',
        description: 'ಚಳಿಗಾಲದ ಮುಂಜಾನೆ ಸೂರ್ಯನ ಕಿರಣಗಳು ನೇರವಾಗಿ ನಮ್ಮ ದೇಹವನ್ನು ಬೆಚ್ಚಗಾಗಿಸುವುದು.',
        context: 'ಬಯಲು ವಾತಾವರಣ',
      },
    ],
    diagrams: [
      {
        id: 'diag-heat-kn-1',
        title: 'ಉಷ್ಣ ವರ್ಗಾವಣೆಯ ಮೂರು ವಿಧಾನಗಳ ಸಚಿತ್ರ ನೋಟ',
        caption: 'ಲೋಹದ ಸಲಾಕೆಯಲ್ಲಿ ವಹನ, ನೀರಿನಲ್ಲಿ ಸಂವಹನ ಮತ್ತು ಸೂರ್ಯನಿಂದ ವಿಕಿರಣ.',
        type: 'CANVAS_ANIMATION',
        spec: {
          asciiDiagram:
            '+---------------------------------------------------------------+\n' +
            '|                    ಉಷ್ಣ ಪ್ರಸರಣದ 3 ವಿಧಾನಗಳು                    |\n' +
            '|                                                               |\n' +
            '|   1. ವಹನ (Conduction)       [ಕಬ್ಬಿಣದ ರಾಡ್]                   |\n' +
            '|      ಜ್ವಾಲೆ ---> (100°C) =====ಕಣಗಳ ಕಂಪನ=====> (25°C)          |\n' +
            '|                                                               |\n' +
            '|   2. ಸಂವಹನ (Convection)     [ಕುದಿಯುವ ಪಾತ್ರೆ]                 |\n' +
            '|      ಬಿಸಿ ನೀರು (↑ ಮೇಲಕ್ಕೆ) <=======> ತಂಪು ನೀರು (↓ ಕೆಳಕ್ಕೆ)    |\n' +
            '|                                                               |\n' +
            '|   3. ವಿಕಿರಣ (Radiation)     [ಸೂರ್ಯನ ಶಾಖ]                     |\n' +
            '|      ಸೂರ್ಯ ~~~~~ (ತರಂಗಗಳು / ಶೂನ್ಯ ಪ್ರದೇಶ) ~~~~~> ಭೂಮಿ         |\n' +
            '+---------------------------------------------------------------+',
        },
      },
    ],
    realWorldApplications: [
      {
        title: 'ಮಣ್ಣಿನ ಮಡಕೆಯ ತಂಪು ನೀರು (Earthen Pot Cooling)',
        description:
          'ಬೇಸಿಗೆಯಲ್ಲಿ ಹಳ್ಳಿಯ ಮಣ್ಣಿನ ಮಡಕೆಯಲ್ಲಿ ನೀರು ಸದಾ ತಂಪಾಗಿರುತ್ತದೆ. ಮಡಕೆಯ ಸಣ್ಣ ಸೂಕ್ಷ್ಮ ರಂಧ್ರಗಳಿಂದ ಹೊರಬರುವ ನೀರು ಆವಿಯಾಗುವಾಗ ಮಡಕೆಯೊಳಗಿನ ನೀರಿನ ಉಷ್ಣವನ್ನು ಹೀರಿಕೊಳ್ಳುತ್ತದೆ. ಇದು ನೈಸರ್ಗಿಕ ಆವೀಕರಣ ಶೀತಲೀಕರಣವಾಗಿದೆ.',
        villageContext: 'ಗ್ರಾಮೀಣ ಕರ್ನಾಟಕದ ಸಾಂಪ್ರದಾಯಿಕ ನೀರಿನ ಸಂಗ್ರಹಣೆ.',
      },
      {
        title: 'ಹಳ್ಳಿಯ ಹಂಚಿನ ಮನೆಗಳಲ್ಲಿ ನೈಸರ್ಗಿಕ ತಂಪು ಗಾಳಿ',
        description:
          'ಮಂಗಳೂರು ಹಂಚಿನ ಮನೆಗಳಲ್ಲಿ ಒಳಭಾಗದ ಬಿಸಿಯಾದ ಹಗುರ ಗಾಳಿಯು ಮೇಲ್ಛಾವಣಿಯ ಸಂದುಗಳ ಮೂಲಕ ಸುಲಭವಾಗಿ ಹೊರಹೋಗುತ್ತದೆ. ಕಿಟಕಿಗಳ ಮೂಲಕ ತಂಪಾದ ಶುದ್ಧ ಗಾಳಿ ಒಳಬರುತ್ತದೆ.',
        villageContext: 'ಗ್ರಾಮೀಣ ವಾಸ್ತುಶಿಲ್ಪದಲ್ಲಿ ಸಂವಹನ ಪ್ರವಾಹಗಳ ಬಳಕೆ.',
      },
    ],
    importantTakeaways: [
      'ಉಷ್ಣವು ಶಕ್ತಿಯ ರೂಪವಾಗಿದ್ದು, ಹೆಚ್ಚು ತಾಪದ ವಸ್ತುವಿನಿಂದ ಕಡಿಮೆ ತಾಪದ ವಸ್ತುವಿಗೆ ಹರಿಯುತ್ತದೆ.',
      'ಘನವಸ್ತುಗಳಲ್ಲಿ ಉಷ್ಣವು ವಹನ (Conduction) ವಿಧಾನದಿಂದ ಹರಿಯುತ್ತದೆ.',
      'ದ್ರವ ಮತ್ತು ಅನಿಲಗಳಲ್ಲಿ ಕಣಗಳ ನೈಜ ಚಲನೆಯಿಂದ ಸಂವಹನ (Convection) ಉಂಟಾಗುತ್ತದೆ.',
      'ವಿಕಿರಣ (Radiation) ಕ್ರಿಯೆಗೆ ಯಾವುದೇ ಮಾಧ್ಯಮದ ಅವಶ್ಯಕತೆಯಿರುವುದಿಲ್ಲ.',
      'ಮಣ್ಣಿನ ಮಡಕೆ ಆವೀಕರಣದ ಮೂಲಕ ನೀರನ್ನು ತಂಪಾಗಿಸುತ್ತದೆ.',
    ],
    glossary: [
      { term: 'ಉಷ್ಣ (Heat)', definition: 'ಹೆಚ್ಚು ತಾಪದಿಂದ ಕಡಿಮೆ ತಾಪಕ್ಕೆ ಹರಿಯುವ ಶಕ್ತಿಯ ರೂಪ.' },
      { term: 'ತಾಪಮಾನ (Temperature)', definition: 'ಒಂದು ವಸ್ತುವಿನ ಬಿಸಿಯ ಮಟ್ಟದ ಅಳತೆ (ಡಿಗ್ರಿ ಸೆಲ್ಸಿಯಸ್ °C ಅಥವಾ ಕೆಲ್ವಿನ್ K).' },
      { term: 'ವಹನ (Conduction)', definition: 'ಕಣಗಳ ಸ್ಥಾನಪಲ್ಲಟವಿಲ್ಲದೆ ಘನವಸ್ತುಗಳಲ್ಲಿ ಉಷ್ಣ ಪ್ರಸರಣ.' },
      { term: 'ಸಂವಹನ (Convection)', definition: 'ಕಣಗಳ ನೈಜ ಚಲನೆಯಿಂದ ದ್ರವ ಮತ್ತು ಅನಿಲಗಳಲ್ಲಿ ಉಷ್ಣ ಪ್ರಸರಣ.' },
      { term: 'ವಿಕಿರಣ (Radiation)', definition: 'ಯಾವುದೇ ಮಾಧ್ಯಮವಿಲ್ಲದೆ ವಿದ್ಯುತ್ಕಾಂತೀಯ ತರಂಗಗಳ ಮೂಲಕ ಉಷ್ಣ ವರ್ಗಾವಣೆ.' },
      { term: 'ಉಷ್ಣ ವಾಹಕ (Conductor)', definition: 'ಉಷ್ಣವನ್ನು ಸುಲಭವಾಗಿ ಹರಿಯಲು ಬಿಡುವ ವಸ್ತು (ಉದಾ: ತಾಮ್ರ, ಅಲ್ಯೂಮಿನಿಯಂ).' },
      { term: 'ಉಷ್ಣ ಅವಾಹಕ (Insulator)', definition: 'ಉಷ್ಣವನ್ನು ಸುಲಭವಾಗಿ ಹರಿಯಲು ಬಿಡದ ವಸ್ತು (ಉದಾ: ಮರ, ಗಾಜು, ಪ್ಲಾಸ್ಟಿಕ್).' },
    ],
  },

  // 5. Class 7 Mathematics: ಪೂರ್ಣಾಂಕಗಳು (Integers)
  'topic-ktbs-integers-cl7-kn': {
    topicId: 'topic-ktbs-integers-cl7-kn',
    title: 'ಪೂರ್ಣಾಂಕಗಳು ಮತ್ತು ಅವುಗಳ ಸಂಕಲನ (Integers and Operations)',
    grade: 7,
    subject: 'ಗಣಿತ (Mathematics)',
    language: 'kn',
    topicIntroduction:
      'ದೈನಂದಿನ ಜೀವನದಲ್ಲಿ ನಾವು ಕೇವಲ ಧನ ಸಂಖ್ಯೆಗಳನ್ನು ಮಾತ್ರವಲ್ಲದೆ, ಸಾಲ, ಉಷ್ಣಾಂಶ ಶೂನ್ಯಕ್ಕಿಂತ ಕೆಳಗೆ ಇಳಿಯುವುದು, ಸಮುದ್ರ ಮಟ್ಟಕ್ಕಿಂತ ಆಳ ಮುಂತಾದ ಸಂದರ್ಭಗಳಲ್ಲಿ ಋಣ ಸಂಖ್ಯೆಗಳನ್ನು ಬಳಸುತ್ತೇವೆ. ಇವುಗಳ ಒಕ್ಕೂಟವೇ ಪೂರ್ಣಾಂಕಗಳು.',
    simpleExplanation:
      'ಪೂರ್ಣಾಂಕಗಳು (Integers) ಎಂಬುದು ಸೊನ್ನೆ (0), ಧನ ಸಂಖ್ಯೆಗಳು (+1, +2, +3...) ಮತ್ತು ಋಣ ಸಂಖ್ಯೆಗಳನ್ನು (-1, -2, -3...) ಒಳಗೊಂಡಿರುವ ಸಂಖ್ಯಾಗಣವಾಗಿದೆ. ಸಂಖ್ಯಾ ರೇಖೆಯಲ್ಲಿ ಸೊನ್ನೆಯ ಬಲಕ್ಕೆ ಧನ ಪೂರ್ಣಾಂಕಗಳು ಮತ್ತು ಎಡಕ್ಕೆ ಋಣ ಪೂರ್ಣಾಂಕಗಳಿರುತ್ತವೆ.',
    scientificPrinciples: [
      {
        title: 'ಸಂಖ್ಯಾ ರೇಖೆ ಮತ್ತು ಸ್ಥಾನ (Number Line)',
        statement: 'ಸಂಖ್ಯಾ ರೇಖೆಯಲ್ಲಿ ಬಲಕ್ಕೆ ಹೋದಂತೆ ಸಂಖ್ಯೆಯ ಬೆಲೆ ಹೆಚ್ಚಾಗುತ್ತದೆ; ಎಡಕ್ಕೆ ಹೋದಂತೆ ಕಡಿಮೆಯಾಗುತ್ತದೆ.',
        formula: '... -3 < -2 < -1 < 0 < +1 < +2 < +3 ...',
        explanation: 'ಉದಾಹರಣೆಗೆ, -1 ಸಂಖ್ಯೆಯು -5 ಕ್ಕಿಂತ ದೊಡ್ಡದಾಗಿದೆ ಏಕೆಂದರೆ -1 ಸಂಖ್ಯಾ ರೇಖೆಯಲ್ಲಿ ಹೆಚ್ಚು ಬಲಗಡೆಗಿದೆ.',
      },
      {
        title: 'ಪೂರ್ಣಾಂಕಗಳ ಸಂಕಲನ ನಿಯಮಗಳು (Addition Rules)',
        statement: 'ಒಂದೇ ಚಿಹ್ನೆಯುಳ್ಳ ಸಂಖ್ಯೆಗಳನ್ನು ಕೂಡಿಸಿ ಅದೇ ಚಿಹ್ನೆ ಇಡಬೇಕು; ವಿರುದ್ಧ ಚಿಹ್ನೆಯುಳ್ಳ ಸಂಖ್ಯೆಗಳ ವ್ಯತ್ಯಾಸ ಕಂಡುಹಿಡಿದು ದೊಡ್ಡ ಸಂಖ್ಯೆಯ ಚಿಹ್ನೆ ಇಡಬೇಕು.',
        formula: '(+a) + (+b) = +(a+b) ; (-a) + (-b) = -(a+b) ; (+a) + (-b) = ವ್ಯತ್ಯಾಸದೊಂದಿಗೆ ದೊಡ್ಡದರ ಚಿಹ್ನೆ',
        explanation: '(-5) + (+8) = +3, ಆದರೆ (-8) + (+5) = -3.',
      },
      {
        title: 'ಗುಣಾಕಾರ ನಿಯಮಗಳು (Multiplication Rules)',
        statement: 'ಸಮಾನ ಚಿಹ್ನೆಗಳ ಗುಣಲಬ್ಧ ಧನ (+) ಮತ್ತು ವಿರುದ್ಧ ಚಿಹ್ನೆಗಳ ಗುಣಲಬ್ಧ ಋಣ (-) ಆಗಿರುತ್ತದೆ.',
        formula: '(+) × (+) = (+) ; (-) × (-) = (+) ; (+) × (-) = (-)',
        explanation: '(-4) × (-3) = +12, ಮತ್ತು (-4) × (+3) = -12.',
      },
    ],
    examples: [
      {
        title: 'ಹಳ್ಳಿಯ ಸಂತೆ ವ್ಯಾಪಾರದಲ್ಲಿ ಲಾಭ ಮತ್ತು ನಷ್ಟ',
        description: 'ಒಬ್ಬ ರೈತ ಸಂತೆಯಲ್ಲಿ ತರಕಾರಿ ಮಾರಿ ₹500 ಲಾಭ ಗಳಿಸಿದರೆ (+500), ರಸಗೊಬ್ಬರ ಖರೀದಿಸಲು ₹300 ಖರ್ಚು ಮಾಡಿದರೆ (-300). ನಿವ್ವಳ ಹಣ = (+500) + (-300) = +₹200.',
        context: 'ಗ್ರಾಮೀಣ ಆರ್ಥಿಕ ವ್ಯವಹಾರ',
      },
    ],
    diagrams: [
      {
        id: 'diag-integers-1',
        title: 'ಸಂಖ್ಯಾ ರೇಖೆಯ ಮೇಲೆ ಪೂರ್ಣಾಂಕಗಳು',
        caption: 'ಸೊನ್ನೆಯು ಕೇಂದ್ರ ಬಿಂದು, ಬಲಕ್ಕೆ ಧನಾತ್ಮಕ, ಎಡಕ್ಕೆ ಋಣಾತ್ಮಕ.',
        type: 'SVG_ILLUSTRATION',
        spec: {
          asciiDiagram:
            '   ಋಣ ಪೂರ್ಣಾಂಕಗಳು (Negative)       ಶೂನ್ಯ       ಧನ ಪೂರ್ಣಾಂಕಗಳು (Positive)\n' +
            '<-----------------------------------|----------------------------------->\n' +
            '  -5    -4    -3    -2    -1        0      +1    +2    +3    +4    +5   \n' +
            '      (ಎಡಕ್ಕೆ ಬೆಲೆ ಕಡಿಮೆ)                  (ಬಲಕ್ಕೆ ಬೆಲೆ ಹೆಚ್ಚು)         ',
        },
      },
    ],
    realWorldApplications: [
      {
        title: 'ಬೋರ್‌ವೆಲ್ ಆಳ ಮತ್ತು ನೀರಿನ ಮಟ್ಟ',
        description:
          'ಭೂಮಿಯ ಮಟ್ಟವನ್ನು 0 ಎಂದು ಪರಿಗಣಿಸಿದರೆ, ನೀರಿನ ತೊಟ್ಟಿಯ ಎತ್ತರ +10 ಮೀಟರ್ ಮತ್ತು ಬೋರ್‌ವೆಲ್ ಪಂಪ್ ಇರುವ ಆಳ -80 ಮೀಟರ್ ಆಗಿರುತ್ತದೆ.',
        villageContext: 'ಗ್ರಾಮೀಣ ಕೃಷಿ ನೀರಾವರಿ.',
      },
    ],
    importantTakeaways: [
      'ಪೂರ್ಣಾಂಕಗಳಲ್ಲಿ ಧನ ಸಂಖ್ಯೆಗಳು, ಋಣ ಸಂಖ್ಯೆಗಳು ಮತ್ತು ಸೊನ್ನೆ ಒಳಗೊಂಡಿರುತ್ತವೆ.',
      'ಸೊನ್ನೆಯು ಧನವೂ ಅಲ್ಲ, ಋಣವೂ ಅಲ್ಲ.',
      'ಎರಡು ಋಣ ಸಂಖ್ಯೆಗಳನ್ನು ಗುಣಿಸಿದಾಗ ಯಾವಾಗಲೂ ಧನ ಸಂಖ್ಯೆ ಬರುತ್ತದೆ.',
    ],
    glossary: [
      { term: 'ಪೂರ್ಣಾಂಕ (Integer)', definition: 'ಸೊನ್ನೆ, ಧನಾತ್ಮಕ ಮತ್ತು ಋಣಾತ್ಮಕ ಪೂರ್ಣ ಸಂಖ್ಯೆಗಳ ಗಣ (Z).' },
      { term: 'ಧನ ಪೂರ್ಣಾಂಕ (Positive Integer)', definition: 'ಸೊನ್ನೆಗಿಂತ ದೊಡ್ಡದಾದ ಸಂಖ್ಯೆಗಳು (+1, +2, +3...).' },
      { term: 'ಋಣ ಪೂರ್ಣಾಂಕ (Negative Integer)', definition: 'ಸೊನ್ನೆಗಿಂತ ಚಿಕ್ಕದಾದ ಸಂಖ್ಯೆಗಳು (-1, -2, -3...).' },
      { term: 'ಸಂಖ್ಯಾ ರೇಖೆ (Number Line)', definition: 'ಸಂಖ್ಯೆಗಳನ್ನು ಸಮಾನ ಅಂತರದಲ್ಲಿ ಗುರುತಿಸುವ ರೇಖೆ.' },
    ],
  },

  // 6. Class 7 Science: ಚಲನೆ ಮತ್ತು ಕಾಲ (Motion and Time)
  'topic-ktbs-motion-time-cl7-kn': {
    topicId: 'topic-ktbs-motion-time-cl7-kn',
    title: 'ಚಲನೆ ಮತ್ತು ಕಾಲ (Motion and Time)',
    grade: 7,
    subject: 'ವಿಜ್ಞಾನ (Science)',
    language: 'kn',
    topicIntroduction:
      'ನಮ್ಮ ಸುತ್ತಲಿನ ಪ್ರಪಂಚದಲ್ಲಿ ವಸ್ತುಗಳು ನಿರಂತರವಾಗಿ ಚಲಿಸುತ್ತಿರುತ್ತವೆ. ಆಕಾಶದಲ್ಲಿ ಹಾರುವ ಹಕ್ಕಿ, ರಸ್ತೆಯಲ್ಲಿ ಓಡುವ ಎತ್ತಿನ ಗಾಡಿ, ಗೋಡೆ ಗಡಿಯಾರದ ಲೋಲಕ — ಪ್ರತಿಯೊಂದೂ ಬೇರೆ ಬೇರೆ ರೀತಿಯ ಚಲನೆಯನ್ನು ಪ್ರದರ್ಶಿಸುತ್ತವೆ.',
    simpleExplanation:
      'ಕಾಲ ಕಳೆದಂತೆ ಒಂದು ವಸ್ತುವಿನ ಸ್ಥಾನ ಬದಲಾಗುವುದನ್ನು ಚಲನೆ (Motion) ಎನ್ನುತ್ತೇವೆ. ಒಂದು ವಸ್ತು ಎಷ್ಟು ವೇಗವಾಗಿ ಅಥವಾ ನಿಧಾನವಾಗಿ ಚಲಿಸುತ್ತದೆ ಎಂಬುದನ್ನು ಅದರ ವೇಗ (Speed) ಸೂಚಿಸುತ್ತದೆ.',
    scientificPrinciples: [
      {
        title: 'ವೇಗದ ಸೂತ್ರ (Formula for Speed)',
        statement: 'ಒಂದು ವಸ್ತುವು ಏಕಮಾನ ಕಾಲದಲ್ಲಿ ಕ್ರಮಿಸಿದ ದೂರವೇ ಅದರ ವೇಗ.',
        formula: 'ವೇಗ (Speed) = ಕ್ರಮಿಸಿದ ಒಟ್ಟು ದೂರ / ತೆಗೆದುಕೊಂಡ ಒಟ್ಟು ಕಾಲ (Speed = Distance / Time)',
        explanation: 'ವೇಗದ ಅಂತರರಾಷ್ಟ್ರೀಯ ಮಾನ (SI unit) ಮೀಟರ್/ಸೆಕೆಂಡ್ (m/s) ಅಥವಾ ಕಿಲೋಮೀಟರ್/ಗಂಟೆ (km/h).',
      },
      {
        title: 'ಆವರ್ತಕ ಚಲನೆ ಮತ್ತು ಸರಳ ಲೋಲಕ (Periodic Motion & Simple Pendulum)',
        statement: 'ನಿರ್ದಿಷ್ಟ ಕಾಲಾವಧಿಯಲ್ಲಿ ಪುನರಾವರ್ತನೆಯಾಗುವ ಚಲನೆಯೇ ಆವರ್ತಕ ಚಲನೆ.',
        formula: 'ಆವರ್ತನ ಕಾಲ T = ಒಟ್ಟು ಕಾಲ / ಆಂದೋಲನಗಳ ಸಂಖ್ಯೆ',
        explanation: 'ಸರಳ ಲೋಲಕದ ತೂಗುಗುಂಡು ಒಂದು ತುದಿಯಿಂದ ಇನ್ನೊಂದು ತುದಿಗೆ ಹೋಗಿ ಮರಳಿ ಬರಲು ತೆಗೆದುಕೊಳ್ಳುವ ಕಾಲ ಸ್ಥಿರವಾಗಿರುತ್ತದೆ.',
      },
    ],
    examples: [
      {
        title: 'ಸರಳ ರೇಖಾಗತ ಚಲನೆ (Straight-line motion)',
        description: 'ನೇರವಾದ ರಸ್ತೆಯಲ್ಲಿ ಸಾಗುವ ಟ್ರ್ಯಾಕ್ಟರ್ ಚಲನೆ.',
        context: 'ಗ್ರಾಮೀಣ ರಸ್ತೆ',
      },
    ],
    diagrams: [
      {
        id: 'diag-motion-kn-1',
        title: 'ಸರಳ ಲೋಲಕದ ಚಲನೆ (Simple Pendulum)',
        caption: 'ಸ್ಥಿರ ಬಿಂದುವಿನಿಂದ ತೂಗಾಡುವ ಲೋಲಕದ ಆಂದೋಲನ.',
        type: 'SVG_ILLUSTRATION',
      },
    ],
    realWorldApplications: [
      {
        title: 'ಗಡಿಯಾರಗಳಲ್ಲಿ ಕಾಲ ಮಾಪನ',
        description: 'ಸರಳ ಲೋಲಕದ ಆವರ್ತನ ತತ್ವದ ಆಧಾರದ ಮೇಲೆ ಹಳೆಯ ಗೋಡೆ ಗಡಿಯಾರಗಳು ನಿಖರ ಸಮಯವನ್ನು ತೋರಿಸುತ್ತವೆ.',
        villageContext: 'ಗಡಿಯಾರದ ಕಾಲ ಮಾಪನ.',
      },
    ],
    importantTakeaways: [
      'ವೇಗ = ದೂರ / ಕಾಲ.',
      'ಸರಳ ಲೋಲಕದ ಆವರ್ತನ ಕಾಲವು ಅದರ ಉದ್ದವನ್ನು ಅವಲಂಬಿಸಿರುತ್ತದೆ.',
    ],
    glossary: [
      { term: 'ವೇಗ (Speed)', definition: 'ಏಕಮಾನ ಕಾಲದಲ್ಲಿ ಕ್ರಮಿಸಿದ ದೂರ.' },
      { term: 'ಆವರ್ತನ ಕಾಲ (Time Period)', definition: 'ಒಂದು ಪೂರ್ಣ ಆಂದೋಲನಕ್ಕೆ ಬೇಕಾಗುವ ಸಮಯ.' },
    ],
  },

  // 7. Class 7 Mathematics: ರೇಖೆಗಳು ಮತ್ತು ಕೋನಗಳು (Lines and Angles)
  'topic-ktbs-lines-angles-cl7-kn': {
    topicId: 'topic-ktbs-lines-angles-cl7-kn',
    title: 'ರೇಖೆಗಳು ಮತ್ತು ಕೋನಗಳು (Lines and Angles)',
    grade: 7,
    subject: 'ಗಣಿತ (Mathematics)',
    language: 'kn',
    topicIntroduction:
      'ಕಟ್ಟಡಗಳ ನಿರ್ಮಾಣ, ಬಾಗಿಲು-ಕಿಟಕಿಗಳ ಚೌಕಟ್ಟು, ಕೃಷಿ ಭೂಮಿಯ ಗಡಿಗಳು — ಎಲ್ಲೆಲ್ಲೂ ರೇಖೆಗಳು ಮತ್ತು ಕೋನಗಳ ಜ್ಯಾಮಿತಿ ಅಡಗಿದೆ.',
    simpleExplanation:
      'ಎರಡು ರೇಖೆಗಳು ಅಥವಾ ಕಿರಣಗಳು ಒಂದೇ ಬಿಂದುವಿನಲ್ಲಿ ಸಂಧಿಸಿದಾಗ ಕೋನ ಉಂಟಾಗುತ್ತದೆ. ಕೋನಗಳ ಪರಸ್ಪರ ಸಂಬಂಧವನ್ನು ತಿಳಿಯುವುದು ಜ್ಯಾಮಿತಿಯ ಮೂಲಾಧಾರ.',
    scientificPrinciples: [
      {
        title: 'ಪೂರಕ ಕೋನಗಳು (Complementary Angles)',
        statement: 'ಎರಡು ಕೋನಗಳ ಅಳತೆಗಳ ಮೊತ್ತವು 90° ಆಗಿದ್ದರೆ ಅವುಗಳು ಪರಸ್ಪರ ಪೂರಕ ಕೋನಗಳು.',
        formula: '∠A + ∠B = 90°',
        explanation: 'ಉದಾಹರಣೆಗೆ 30° ಕೋನದ ಪೂರಕ ಕೋನ 60° (30° + 60° = 90°).',
      },
      {
        title: 'ಪರಿಪೂರಕ ಕೋನಗಳು (Supplementary Angles)',
        statement: 'ಎರಡು ಕೋನಗಳ ಅಳತೆಗಳ ಮೊತ್ತವು 180° ಆಗಿದ್ದರೆ ಅವುಗಳು ಪರಸ್ಪರ ಪರಿಪೂರಕ ಕೋನಗಳು.',
        formula: '∠A + ∠B = 180°',
        explanation: 'ಉದಾಹರಣೆಗೆ 110° ಕೋನದ ಪರಿಪೂರಕ ಕೋನ 70° (110° + 70° = 180°).',
      },
    ],
    examples: [
      {
        title: 'ಕತ್ತರಿಯ ಕೋನಗಳು',
        description: 'ಕತ್ತರಿಯ ಎರಡು ಅಲಗುಗಳು ಪರಸ್ಪರ ಛೇದಿಸಿದಾಗ ಉಂಟಾಗುವ ಶೃಂಗಾಭಿಮುಖ ಕೋನಗಳು ಪರಸ್ಪರ ಸಮವಾಗಿರುತ್ತವೆ.',
        context: 'ದೈನಂದಿನ ಉಪಕರಣಗಳು',
      },
    ],
    diagrams: [],
    realWorldApplications: [
      {
        title: 'ಮನೆಯ ಮೇಲ್ಛಾವಣಿಯ ಕೋನಗಳು',
        description: 'ಮಳೆಯ ನೀರು ಸುಲಭವಾಗಿ ಹರಿದು ಹೋಗಲು ಹಂಚಿನ ಮಾಡಿನ ಕೋನಗಳನ್ನು 30° ರಿಂದ 45° ಇಳಿಜಾರಿನಲ್ಲಿ ನಿರ್ಮಿಸುತ್ತಾರೆ.',
        villageContext: 'ಗ್ರಾಮೀಣ ಮನೆ ನಿರ್ಮಾಣ.',
      },
    ],
    importantTakeaways: [
      'ಪೂರಕ ಕೋನಗಳ ಮೊತ್ತ = 90°.',
      'ಪರಿಪೂರಕ ಕೋನಗಳ ಮೊತ್ತ = 180°.',
      'ಎರಡು ರೇಖೆಗಳು ಛೇದಿಸಿದಾಗ ಉಂಟಾಗುವ ಶೃಂಗಾಭಿಮುಖ ಕೋನಗಳು ಸಮ.',
    ],
    glossary: [
      { term: 'ಪೂರಕ ಕೋನ (Complementary Angle)', definition: 'ಮೊತ್ತ 90° ಇರುವ ಎರಡು ಕೋನಗಳು.' },
      { term: 'ಪರಿಪೂರಕ ಕೋನ (Supplementary Angle)', definition: 'ಮೊತ್ತ 180° ಇರುವ ಎರಡು ಕೋನಗಳು.' },
    ],
  },
};
