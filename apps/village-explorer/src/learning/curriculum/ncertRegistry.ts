export type SupportedGrade = 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type NcertSubject =
  | 'Science'
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Social Science (Geography)'
  | 'Social Science (Economics)';

export type MappingStatus = 'verified' | 'interdisciplinary_extension';

export interface NcertSourceReference {
  publisher: 'NCERT';
  edition: string;
  textbookCode: string;
  url: string;
}

export interface NcertCurriculumEntry {
  curriculumId: string;
  topic: string;
  grade: SupportedGrade;
  subject: NcertSubject;
  textbook: string;
  chapterNumber: number;
  chapterTitle: string;
  subtopic: string;
  learningObjective: string;
  explanation: string;
  activityType:
    | 'Practical experiment'
    | 'Interactive simulation'
    | 'Observation & discovery'
    | 'Problem-solving challenge';
  application: string;
  source: NcertSourceReference;
  mappingStatus: MappingStatus;
  extensionNote?: string;
}

/**
 * Centralised, verified NCERT Curriculum Registry for GaonLabs.
 *
 * - Grades 6–8 Science & Mathematics follow official NCF-SE 2023 NCERT textbooks
 *   (Curiosity & Ganita Prakash, 2024–2026 editions) synced with GaonLab's
 *   content/curriculum/cbse/2026-27/ manifests.
 * - Grades 9–10 follow official rationalised NCERT integrated Science, Mathematics,
 *   and Geography (Contemporary India I & II) editions.
 * - Grades 11–12 map separate Physics/Chemistry/Biology chapters where senior concepts
 *   (e.g. hydrostatic pressure P = ρgh, torque, solar p-n junctions) apply.
 * - Interdisciplinary rural engineering extensions not covered directly in a single
 *   NCERT chapter are explicitly marked 'interdisciplinary_extension'.
 */
export const NCERT_CURRICULUM_REGISTRY: Record<string, NcertCurriculumEntry> = {
  // ===========================================================================
  // CLASS 6 — SCIENCE (Curiosity - Science Grade 6, Ed. 1, 2024, fecu1)
  // ===========================================================================
  NCERT_SCI6_CH02_DIVERSITY: {
    curriculumId: 'NCERT_SCI6_CH02_DIVERSITY',
    topic: 'Plant Diversity, Root Systems & Habitats',
    grade: 6,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 6',
    chapterNumber: 2,
    chapterTitle: 'Diversity in the Living World',
    subtopic: 'Grouping plants (herbs, shrubs, trees), taproot vs. fibrous roots, and adaptations',
    learningObjective:
      'Classify village trees, shrubs, and crops by stem structure, leaf venation, root type, and habitat adaptations.',
    explanation:
      'Village flora ranges from flowering shrubs to towering neem, banyan, mango, and coconut trees. Deep taproots anchor large dicot trees like mango and neem, while fibrous roots help palms and grasses absorb surface moisture.',
    activityType: 'Observation & discovery',
    application: 'Identifying native trees, flowering shrubs, and habitat adaptations across the village',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2024, NCF-SE 2023)',
      textbookCode: 'fecu1',
      url: 'https://ncert.nic.in/textbook.php?fecu1=2-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI6_CH05_MOTION: {
    curriculumId: 'NCERT_SCI6_CH05_MOTION',
    topic: 'Measurement of Length & Types of Motion',
    grade: 6,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 6',
    chapterNumber: 5,
    chapterTitle: 'Measurement of Length and Motion',
    subtopic: 'SI units of length (metre, km) and rectilinear, circular & rotational motion',
    learningObjective:
      'Measure distances accurately in standard units and identify linear and rotational motion in everyday vehicles.',
    explanation:
      'When a bicycle or car travels down a village road, its frame moves in rectilinear (straight-line) motion while its wheels simultaneously undergo rotational motion around their axles.',
    activityType: 'Observation & discovery',
    application: 'Measuring road distances and observing wheel rotation on village bicycles and vehicles',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2024, NCF-SE 2023)',
      textbookCode: 'fecu1',
      url: 'https://ncert.nic.in/textbook.php?fecu1=5-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI6_CH06_MATERIALS: {
    curriculumId: 'NCERT_SCI6_CH06_MATERIALS',
    topic: 'Properties of Everyday Materials',
    grade: 6,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 6',
    chapterNumber: 6,
    chapterTitle: 'Materials Around Us',
    subtopic: 'Grouping materials by thermal, porous, transparent, and structural properties',
    learningObjective:
      'Compare materials such as mud, clay, brick, stone, metal, and cotton fibre to choose suitable rural building and daily-use materials.',
    explanation:
      'Traditional Indian villages select materials based on their physical properties: thick mud-brick walls slow heat entry, porous terracotta cools water, and breathable cotton fibres keep people comfortable in summer.',
    activityType: 'Observation & discovery',
    application: 'Vernacular house walls, roofing materials, clay pots, and woven fabrics',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2024, NCF-SE 2023)',
      textbookCode: 'fecu1',
      url: 'https://ncert.nic.in/textbook.php?fecu1=6-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI6_CH07_TEMP: {
    curriculumId: 'NCERT_SCI6_CH07_TEMP',
    topic: 'Temperature & Weather Thermometry',
    grade: 6,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 6',
    chapterNumber: 7,
    chapterTitle: 'Temperature and its Measurement',
    subtopic: 'Celsius scale, ambient air temperature, and maximum-minimum weather thermometers',
    learningObjective:
      'Measure and interpret daily air temperature variations in degrees Celsius using laboratory and weather thermometers.',
    explanation:
      'Temperature measures how hot or cold the air is. Village weather stations track daily maximum and minimum temperatures in °C inside shaded louvered shelters to guide crop sowing and irrigation.',
    activityType: 'Practical experiment',
    application: 'Recording daily village air temperature at the Weather Station',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2024, NCF-SE 2023)',
      textbookCode: 'fecu1',
      url: 'https://ncert.nic.in/textbook.php?fecu1=7-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI6_CH08_WATER_STATES: {
    curriculumId: 'NCERT_SCI6_CH08_WATER_STATES',
    topic: 'Evaporation, Condensation & Cooling',
    grade: 6,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 6',
    chapterNumber: 8,
    chapterTitle: 'A Journey through States of Water',
    subtopic: 'Evaporation cooling effect (earthen matka), condensation, clouds, and rainfall',
    learningObjective:
      'Explain how evaporation produces cooling and how evaporation and condensation drive rainfall and the water cycle.',
    explanation:
      'Liquid water absorbs heat energy when it evaporates into vapour. Tiny pores in clay pots allow slight seepage that evaporates from the surface, naturally cooling the drinking water inside.',
    activityType: 'Practical experiment',
    application: 'Clay water pot cooling, monsoon rainfall, and rooftop rainwater harvesting',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2024, NCF-SE 2023)',
      textbookCode: 'fecu1',
      url: 'https://ncert.nic.in/textbook.php?fecu1=8-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI6_CH09_SEPARATION: {
    curriculumId: 'NCERT_SCI6_CH09_SEPARATION',
    topic: 'Water Filtration & Separation of Mixtures',
    grade: 6,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 6',
    chapterNumber: 9,
    chapterTitle: 'Methods of Separation in Everyday Life',
    subtopic: 'Sedimentation, decantation, and filtration through sand and gravel layers',
    learningObjective:
      'Apply sedimentation and filtration principles to separate insoluble impurities from village water.',
    explanation:
      'As rainwater percolates through layers of soil, sand, and gravel into underground aquifers, solid impurities are naturally filtered out—the same principle used in sand-gravel water filters.',
    activityType: 'Practical experiment',
    application: 'Natural soil filtration of well groundwater and village drinking water treatment',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2024, NCF-SE 2023)',
      textbookCode: 'fecu1',
      url: 'https://ncert.nic.in/textbook.php?fecu1=9-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI6_CH10_LIVING: {
    curriculumId: 'NCERT_SCI6_CH10_LIVING',
    topic: 'Characteristics & Growth of Living Creatures',
    grade: 6,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 6',
    chapterNumber: 10,
    chapterTitle: 'Living Creatures: Exploring their Characteristics',
    subtopic: 'Seed germination, plant growth requirements, and living soil organisms',
    learningObjective:
      'Explain how water, air, sunlight, and soil organisms such as earthworms support healthy plant germination and growth.',
    explanation:
      'Seeds require moisture, air, and warmth to germinate. In farm soil, living organisms like earthworms burrow through the earth, aerating roots and enriching soil with organic castings.',
    activityType: 'Observation & discovery',
    application: 'Crop germination, earthworm soil aeration, and kitchen garden ecology',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2024, NCF-SE 2023)',
      textbookCode: 'fecu1',
      url: 'https://ncert.nic.in/textbook.php?fecu1=10-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI6_CH11_TREASURES: {
    curriculumId: 'NCERT_SCI6_CH11_TREASURES',
    topic: 'Natural Resources: Water, Soil, Forests & Solar Energy',
    grade: 6,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 6',
    chapterNumber: 11,
    chapterTitle: "Nature's Treasures",
    subtopic: 'Groundwater recharge, rainwater harvesting, soil formation, forests, and solar panels',
    learningObjective:
      'Recognise renewable natural resources—sunlight, water, soil, and forests—and design sustainable village conservation practices.',
    explanation:
      "NCERT's 'Nature's Treasures' directly highlights rainwater harvesting, groundwater wells, healthy soil, forest trees, and solar panels converting sunlight into clean electricity for communities.",
    activityType: 'Interactive simulation',
    application: 'Rainwater harvesting, well recharge, solar panels, soil protection, and village trees',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2024, NCF-SE 2023)',
      textbookCode: 'fecu1',
      url: 'https://ncert.nic.in/textbook.php?fecu1=11-12',
    },
    mappingStatus: 'verified',
  },

  // ===========================================================================
  // CLASS 6 — MATHEMATICS (Ganita Prakash - Grade 6, Ed. 1, 2024, fegp1)
  // ===========================================================================
  NCERT_MATH6_CH02_ANGLES: {
    curriculumId: 'NCERT_MATH6_CH02_ANGLES',
    topic: 'Lines, Angles & Inclination',
    grade: 6,
    subject: 'Mathematics',
    textbook: 'Ganita Prakash - Mathematics Grade 6',
    chapterNumber: 2,
    chapterTitle: 'Lines and Angles',
    subtopic: 'Acute, right, and obtuse angles in roofs, solar panel tilts, and construction',
    learningObjective:
      'Identify and measure angles in village structures such as sloped roofs and tilted solar panels.',
    explanation:
      'Sloped roofs use acute angles to shed monsoon rain rapidly without waterlogging, while solar panels are angled toward the sun to capture maximum rays.',
    activityType: 'Problem-solving challenge',
    application: 'Roof slope drainage and solar panel tilt angles',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2024, NCF-SE 2023)',
      textbookCode: 'fegp1',
      url: 'https://ncert.nic.in/textbook.php?fegp1=2-10',
    },
    mappingStatus: 'verified',
  },

  NCERT_MATH6_CH06_PERIMETER_AREA: {
    curriculumId: 'NCERT_MATH6_CH06_PERIMETER_AREA',
    topic: 'Perimeter & Area of Rectangular Plots',
    grade: 6,
    subject: 'Mathematics',
    textbook: 'Ganita Prakash - Mathematics Grade 6',
    chapterNumber: 6,
    chapterTitle: 'Perimeter and Area',
    subtopic: 'Calculating perimeter for fencing and area of rectangular/square land and roofs',
    learningObjective:
      'Compute the perimeter and area of rectangular farm plots, gardens, and rooftops to estimate fencing and crop capacity.',
    explanation:
      'Perimeter measures the outer boundary length (needed for fencing wire), whereas area measures the enclosed surface (needed to calculate seeds, roof rainwater catchment, or tiles).',
    activityType: 'Problem-solving challenge',
    application: 'Farm field area, garden fencing length, and rooftop rainwater catchment area',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2024, NCF-SE 2023)',
      textbookCode: 'fegp1',
      url: 'https://ncert.nic.in/textbook.php?fegp1=6-10',
    },
    mappingStatus: 'verified',
  },

  // ===========================================================================
  // CLASS 6 — SOCIAL SCIENCE (Exploring Society: India and Beyond, fees1)
  // ===========================================================================
  NCERT_GEO6_CH03_LANDFORMS: {
    curriculumId: 'NCERT_GEO6_CH03_LANDFORMS',
    topic: 'Landforms, Valleys, Hills & Rural Settlements',
    grade: 6,
    subject: 'Social Science (Geography)',
    textbook: 'Exploring Society: India and Beyond - Grade 6',
    chapterNumber: 3,
    chapterTitle: 'Landforms and Life',
    subtopic: 'Mountains, hills, valleys, plains, rivers, and how terrain shapes agriculture and water flow',
    learningObjective:
      'Explain how physical landforms such as hills, valleys, plains, and rivers influence rural settlements, farming, and water availability.',
    explanation:
      'Water naturally flows downhill from elevated hills and ridges into valleys and plains, forming streams and fertile alluvial farmland ideal for village settlements.',
    activityType: 'Observation & discovery',
    application: 'Village terrain elevation, gravity water flow, streams, and agricultural plains',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2024, NCF-SE 2023)',
      textbookCode: 'fees1',
      url: 'https://ncert.nic.in/textbook.php?fees1=3-14',
    },
    mappingStatus: 'verified',
  },

  // ===========================================================================
  // CLASS 7 — SCIENCE (Curiosity - Science Grade 7, Ed. 1, 2025, gecu1)
  // ===========================================================================
  NCERT_SCI7_CH02_ACIDS_BASES: {
    curriculumId: 'NCERT_SCI7_CH02_ACIDS_BASES',
    topic: 'Acids, Bases, Indicators & Soil Neutralisation',
    grade: 7,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 7',
    chapterNumber: 2,
    chapterTitle: 'Exploring Substances: Acidic, Basic, and Neutral',
    subtopic: 'Litmus and turmeric indicators, neutralisation reactions, and treating acidic/basic farm soil',
    learningObjective:
      'Test soil and household solutions with indicators and explain neutralisation of overly acidic or basic soils.',
    explanation:
      'Natural indicators like litmus and turmeric change colour in acidic or basic solutions. Farmers neutralise overly acidic soil with basic quicklime/slaked lime (calcium compounds) and treat overly alkaline soil with organic matter or gypsum.',
    activityType: 'Interactive simulation',
    application: 'Soil Chemistry Lab pH indicator testing and acidic/alkaline soil treatment',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023)',
      textbookCode: 'gecu1',
      url: 'https://ncert.nic.in/textbook.php?gecu1=2-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI7_CH03_ELECTRICITY: {
    curriculumId: 'NCERT_SCI7_CH03_ELECTRICITY',
    topic: 'Electric Circuits & Components',
    grade: 7,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 7',
    chapterNumber: 3,
    chapterTitle: 'Electricity: Circuits and their Components',
    subtopic: 'Cells, batteries, switches, LED lamps, conductors, insulators, and circuit diagrams',
    learningObjective:
      'Build and analyse closed electric circuits powering village LED lamps and DC devices from batteries or solar cells.',
    explanation:
      'Electricity flows only through a complete closed circuit of conducting wires from a power source (battery or solar cell) through a switch and load (LED lamp or motor).',
    activityType: 'Interactive simulation',
    application: 'Solar street lamps, village home LED circuits, and Physics Learning House experiments',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023)',
      textbookCode: 'gecu1',
      url: 'https://ncert.nic.in/textbook.php?gecu1=3-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI7_CH05_CHANGES: {
    curriculumId: 'NCERT_SCI7_CH05_CHANGES',
    topic: 'Physical and Chemical Changes',
    grade: 7,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 7',
    chapterNumber: 5,
    chapterTitle: 'Changes Around Us: Physical and Chemical',
    subtopic: 'Reversible physical changes vs. chemical changes forming new substances (curdling, rusting, neutralisation)',
    learningObjective:
      'Distinguish physical changes from chemical reactions observed in rural homes, soil chemistry, and workshops.',
    explanation:
      'Physical changes alter shape or state without forming a new substance (like water evaporating), whereas chemical changes create new substances (like milk turning to curd or lime neutralising soil acid).',
    activityType: 'Practical experiment',
    application: 'Chemistry Learning House reactions, composting, curdling, and rust prevention on farm tools',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023)',
      textbookCode: 'gecu1',
      url: 'https://ncert.nic.in/textbook.php?gecu1=5-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI7_CH07_HEAT: {
    curriculumId: 'NCERT_SCI7_CH07_HEAT',
    topic: 'Heat Transfer: Conduction, Convection & Radiation',
    grade: 7,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 7',
    chapterNumber: 7,
    chapterTitle: 'Heat Transfer in Nature',
    subtopic: 'Thermal radiation & light-coloured surfaces, warm air convection, insulators, and water-land breezes',
    learningObjective:
      'Explain how whitewashed roofs reflect thermal radiation, high vents exhaust warm air via convection, and nearby water moderates temperature.',
    explanation:
      'Heat travels by conduction through solids, convection in rising warm air currents, and radiation from the Sun. Whitewashed lime roofs reflect solar radiation, keeping village houses noticeably cooler.',
    activityType: 'Interactive simulation',
    application: 'Passive cooling in Village House Lab and breezy lakeside cottages',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023)',
      textbookCode: 'gecu1',
      url: 'https://ncert.nic.in/textbook.php?gecu1=7-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI7_CH08_TIME_MOTION: {
    curriculumId: 'NCERT_SCI7_CH08_TIME_MOTION',
    topic: 'Speed, Distance & Time in Transport',
    grade: 7,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 7',
    chapterNumber: 8,
    chapterTitle: 'Measurement of Time and Motion',
    subtopic: 'Uniform and non-uniform motion, speed = distance / time, and speedometers',
    learningObjective:
      'Calculate average speed and compare the motion of bicycles, auto-rickshaws, motorcycles, and cars.',
    explanation:
      'Speed is the distance covered per unit time (Speed = Distance / Time). Comparing travel times between a bicycle and a motorized vehicle shows how higher speed reduces journey time over the same village road.',
    activityType: 'Observation & discovery',
    application: 'Comparing speeds and travel times of village bicycles, motorcycles, autos, and cars',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023)',
      textbookCode: 'gecu1',
      url: 'https://ncert.nic.in/textbook.php?gecu1=8-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI7_CH09_ANIMALS: {
    curriculumId: 'NCERT_SCI7_CH09_ANIMALS',
    topic: 'Life Processes in Animals & Human Systems',
    grade: 7,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 7',
    chapterNumber: 9,
    chapterTitle: 'Life Processes in Animals',
    subtopic: 'Nutrition, respiration, and transport systems in humans and animals',
    learningObjective:
      'Describe how digestive, respiratory, and circulatory processes sustain energy and health in humans and village animals.',
    explanation:
      'Living animals digest food into nutrients, take in oxygen during respiration, and circulate both throughout the body to release energy for movement and growth.',
    activityType: 'Observation & discovery',
    application: 'Biology Learning House human anatomy and rural nutrition awareness',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023)',
      textbookCode: 'gecu1',
      url: 'https://ncert.nic.in/textbook.php?gecu1=9-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI7_CH10_PLANTS: {
    curriculumId: 'NCERT_SCI7_CH10_PLANTS',
    topic: 'Photosynthesis, Stomata & Water Transport in Plants',
    grade: 7,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 7',
    chapterNumber: 10,
    chapterTitle: 'Life Processes in Plants',
    subtopic: 'Photosynthesis in leaves, carbon dioxide intake via stomata, root water absorption, and xylem vessels',
    learningObjective:
      'Explain how plant roots absorb water and minerals and how leaves use sunlight, water, and CO₂ to synthesize food.',
    explanation:
      'Plants pull water and dissolved minerals from the soil through root hairs into xylem vessels, while green leaves absorb sunlight and take in carbon dioxide through microscopic stomata to perform photosynthesis.',
    activityType: 'Interactive simulation',
    application: 'Agricultural Farm Lab crop growth, drip irrigation, and village trees',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023)',
      textbookCode: 'gecu1',
      url: 'https://ncert.nic.in/textbook.php?gecu1=10-12',
    },
    mappingStatus: 'verified',
  },

  // ===========================================================================
  // CLASS 7 — MATHEMATICS (Ganita Prakash - Grade 7, Ed. 1, 2025, gegp1/gegp2)
  // ===========================================================================
  NCERT_MATH7_CH07_TRIANGLES: {
    curriculumId: 'NCERT_MATH7_CH07_TRIANGLES',
    topic: 'Triangles & Structural Stability',
    grade: 7,
    subject: 'Mathematics',
    textbook: 'Ganita Prakash - Mathematics Grade 7',
    chapterNumber: 7,
    chapterTitle: 'A Tale of Three Intersecting Lines',
    subtopic: 'Triangle side-angle properties and rigidity of triangular frames',
    learningObjective:
      'Use triangle geometric properties to explain why triangular trusses strengthen village roofs and bridges.',
    explanation:
      'Once the lengths of the three sides of a triangle are fixed, its shape is uniquely determined and cannot deform—making triangles the cornerstone of roof frames and bridges.',
    activityType: 'Problem-solving challenge',
    application: 'Engineering Workshop bridge trusses and house roof geometry',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023)',
      textbookCode: 'gegp1',
      url: 'https://ncert.nic.in/textbook.php?gegp1=7-8',
    },
    mappingStatus: 'verified',
  },

  NCERT_MATH7_CH10_QUANTITIES: {
    curriculumId: 'NCERT_MATH7_CH10_QUANTITIES',
    topic: 'Ratios, Percentages, Profit & Loss',
    grade: 7,
    subject: 'Mathematics',
    textbook: 'Ganita Prakash - Mathematics Grade 7',
    chapterNumber: 10,
    chapterTitle: 'Comparing Quantities',
    subtopic: 'Unit rates, percentages, discounts, cost price, selling price, and profit/loss calculation',
    learningObjective:
      'Solve real-world market and agricultural trade problems involving percentages, discounts, and profit or loss.',
    explanation:
      'Comparing quantities with unit rates (₹ per kg) and percentages helps farmers calculate harvest profits and helps families make smart purchases at the village bazaar.',
    activityType: 'Problem-solving challenge',
    application: 'Mathematics Market discounts/profit calculations and Agricultural Farm economics',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023)',
      textbookCode: 'gegp2',
      url: 'https://ncert.nic.in/textbook.php?gegp2=2-7',
    },
    mappingStatus: 'verified',
  },

  NCERT_MATH7_CH12_PERIMETER_AREA: {
    curriculumId: 'NCERT_MATH7_CH12_PERIMETER_AREA',
    topic: 'Area & Perimeter Applications',
    grade: 7,
    subject: 'Mathematics',
    textbook: 'Ganita Prakash - Mathematics Grade 7',
    chapterNumber: 12,
    chapterTitle: 'Perimeter and Area',
    subtopic: 'Areas of rectangles, parallelograms, triangles, and circles in land measurement',
    learningObjective:
      'Calculate areas and perimeters of compound village plots, roofs, and circular wells.',
    explanation:
      'Measuring length and breadth accurately enables farmers to compute field area in square metres or acres, plan seed spacing, and calculate exact fencing wire requirements.',
    activityType: 'Problem-solving challenge',
    application: 'Mathematics Learning House, Farm Lab geometry, and House fencing challenges',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023)',
      textbookCode: 'gegp2',
      url: 'https://ncert.nic.in/textbook.php?gegp2=4-7',
    },
    mappingStatus: 'verified',
  },

  // ===========================================================================
  // CLASS 8 — SCIENCE (Curiosity - Science Grade 8, Ed. 1, 2025, hecu1)
  // ===========================================================================
  NCERT_SCI8_CH02_MICROBES: {
    curriculumId: 'NCERT_SCI8_CH02_MICROBES',
    topic: 'Beneficial Microorganisms & Nitrogen Fixation',
    grade: 8,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 8',
    chapterNumber: 2,
    chapterTitle: 'The Invisible Living World: Beyond Our Naked Eye',
    subtopic: 'Nitrogen-fixing Rhizobium bacteria in legume roots, Lactobacillus curdling, and soil decomposers',
    learningObjective:
      'Explain the vital role of soil microbes in biological nitrogen fixation, decomposition, and everyday fermentation.',
    explanation:
      'Rhizobium bacteria living in root nodules of pulses and legumes convert atmospheric nitrogen into usable soil nitrates, naturally restoring farm fertility during crop rotation.',
    activityType: 'Practical experiment',
    application: 'Crop rotation nitrogen fixation in Farm Lab and fermentation in Chemistry House',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023)',
      textbookCode: 'hecu1',
      url: 'https://ncert.nic.in/textbook.php?hecu1=2-13',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI8_CH04_ELECTRIC_EFFECTS: {
    curriculumId: 'NCERT_SCI8_CH04_ELECTRIC_EFFECTS',
    topic: 'Heating & Magnetic Effects of Electric Current',
    grade: 8,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 8',
    chapterNumber: 4,
    chapterTitle: 'Electricity: Magnetic and Heating Effects',
    subtopic: 'Electromagnets, electric motors, heating coils, and safe electrical appliances',
    learningObjective:
      'Describe how electric current generates magnetic fields to drive electric motors and solar water pumps.',
    explanation:
      'An electric current flowing through a coil produces a magnetic field. Electric motors in solar pumps and electric two-wheelers use this magnetic force to spin shafts cleanly.',
    activityType: 'Interactive simulation',
    application: 'Solar DC water pumps, electric vehicles, and Physics Learning House circuits',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023)',
      textbookCode: 'hecu1',
      url: 'https://ncert.nic.in/textbook.php?hecu1=4-13',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI8_CH05_FORCES: {
    curriculumId: 'NCERT_SCI8_CH05_FORCES',
    topic: 'Forces, Friction & Gravity',
    grade: 8,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 8',
    chapterNumber: 5,
    chapterTitle: 'Exploring Forces',
    subtopic: 'Muscular force, friction, lubrication, gravitational pull, and balanced vs. unbalanced forces',
    learningObjective:
      'Analyse how forces, gravity, and friction act on moving vehicles, well pulleys, and inclined ramps.',
    explanation:
      'Forces change an object’s speed or direction. Friction between tyres and dirt roads provides grip, while lubricating bicycle chains reduces unwanted friction and wear.',
    activityType: 'Observation & discovery',
    application: 'Bicycles, motorcycles, well lifting forces, and Physics/Engineering houses',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023)',
      textbookCode: 'hecu1',
      url: 'https://ncert.nic.in/textbook.php?hecu1=5-13',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI8_CH06_PRESSURE_WINDS: {
    curriculumId: 'NCERT_SCI8_CH06_PRESSURE_WINDS',
    topic: 'Liquid Pressure, Atmospheric Pressure & Winds',
    grade: 8,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 8',
    chapterNumber: 6,
    chapterTitle: 'Pressure, Winds, Storms, and Cyclones',
    subtopic: 'Pressure = Force/Area, liquid pressure increasing with height/depth, wind speed, and storms',
    learningObjective:
      'Explain why overhead water tanks are built high for strong tap pressure and how air pressure differences generate winds.',
    explanation:
      'The pressure exerted by a liquid column increases with its vertical height (depth). Elevating a village water tank creates strong gravity-fed water pressure across every house tap without booster pumps.',
    activityType: 'Interactive simulation',
    application: 'Overhead Water Tank Lab, Community Well depth pressure, and Weather Station winds',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023)',
      textbookCode: 'hecu1',
      url: 'https://ncert.nic.in/textbook.php?hecu1=6-13',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI8_CH08_ELEMENTS_MIXTURES: {
    curriculumId: 'NCERT_SCI8_CH08_ELEMENTS_MIXTURES',
    topic: 'Elements, Compounds & Mixtures',
    grade: 8,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 8',
    chapterNumber: 8,
    chapterTitle: 'Nature of Matter: Elements, Compounds, and Mixtures',
    subtopic: 'Distinguishing pure elements, chemical compounds (CaCO₃, CaSO₄, H₂O), and heterogeneous mixtures like soil',
    learningObjective:
      'Classify village substances such as soil, air, water, lime, and gypsum into elements, compounds, and mixtures.',
    explanation:
      'Healthy village soil is a rich mixture of mineral particles, organic matter, air, and water, while agricultural lime (calcium carbonate) and gypsum (calcium sulphate) are pure chemical compounds.',
    activityType: 'Practical experiment',
    application: 'Chemistry Learning House & Soil Chemistry Lab composition analysis',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023)',
      textbookCode: 'hecu1',
      url: 'https://ncert.nic.in/textbook.php?hecu1=8-13',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI8_CH12_ECOSYSTEMS: {
    curriculumId: 'NCERT_SCI8_CH12_ECOSYSTEMS',
    topic: 'Ecosystems, Pollinators & Ecological Harmony',
    grade: 8,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 8',
    chapterNumber: 12,
    chapterTitle: 'How Nature Works in Harmony',
    subtopic: 'Biotic and abiotic interactions, food webs, pollination, keystone shade trees, and biodiversity conservation',
    learningObjective:
      'Analyse the interdependence of village trees, flowering shrubs, pollinators, soil organisms, and ponds.',
    explanation:
      'Banyan, mango, neem, and flowering shrubs sustain birds, bees, and butterflies that pollinate crops and control pests—keeping the entire village ecosystem balanced.',
    activityType: 'Observation & discovery',
    application: 'Village biodiversity: Banyan, Neem, Mango, Guava, flowering shrubs, and pond ecology',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023)',
      textbookCode: 'hecu1',
      url: 'https://ncert.nic.in/textbook.php?hecu1=12-13',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI8_CH13_SUSTAINABLE_EARTH: {
    curriculumId: 'NCERT_SCI8_CH13_SUSTAINABLE_EARTH',
    topic: 'Sustainable Resources & Climate Stewardship',
    grade: 8,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 8',
    chapterNumber: 13,
    chapterTitle: 'Our Home: Earth, a Unique Life-Sustaining Planet',
    subtopic: 'Clean solar energy, water conservation, climate resilience, and protecting Earth’s biosphere',
    learningObjective:
      'Evaluate how clean solar energy, drip irrigation, and rainwater harvesting help rural communities live sustainably.',
    explanation:
      'Earth supports life through balanced solar energy, liquid water, and atmosphere. Adopting solar power and water-saving irrigation protects local resources for future generations.',
    activityType: 'Interactive simulation',
    application: 'Solar Energy Lab, Water Tank overflow prevention, and Weather Station climate study',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023)',
      textbookCode: 'hecu1',
      url: 'https://ncert.nic.in/textbook.php?hecu1=13-13',
    },
    mappingStatus: 'verified',
  },

  // ===========================================================================
  // CLASS 8 — MATHEMATICS & GEOGRAPHY (hemh1, hess4 — Rationalised 2024)
  // ===========================================================================
  NCERT_MATH8_CH09_MENSURATION: {
    curriculumId: 'NCERT_MATH8_CH09_MENSURATION',
    topic: 'Surface Area & Volume of Cylinders and Cuboids',
    grade: 8,
    subject: 'Mathematics',
    textbook: 'Mathematics - Grade 8',
    chapterNumber: 9,
    chapterTitle: 'Mensuration',
    subtopic: 'Volume of cylinders (πr²h), cuboidal rainwater catchment (A × R), and 1 m³ = 1,000 litres',
    learningObjective:
      'Compute volumes and liquid capacities in litres for cylindrical wells, overhead water tanks, and rainwater harvesting systems.',
    explanation:
      'Using V = πr²h for cylindrical wells/tanks and converting 1 m³ = 1,000 litres lets villagers accurately estimate stored drinking water reserves.',
    activityType: 'Problem-solving challenge',
    application: 'Well volume, Overhead Tank capacity in litres, and rooftop rainwater volume',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'hemh1',
      url: 'https://ncert.nic.in/textbook.php?hemh1=9-13',
    },
    mappingStatus: 'verified',
  },

  NCERT_MATH8_CH11_PROPORTIONS: {
    curriculumId: 'NCERT_MATH8_CH11_PROPORTIONS',
    topic: 'Direct & Inverse Proportions',
    grade: 8,
    subject: 'Mathematics',
    textbook: 'Mathematics - Grade 8',
    chapterNumber: 11,
    chapterTitle: 'Direct and Inverse Proportions',
    subtopic: 'Proportional scaling in gear ratios, rainfall yield, soil moisture %, and crop spacing',
    learningObjective:
      'Apply direct and inverse proportions to gear speeds, agricultural yields, and resource consumption.',
    explanation:
      'Harvested rainwater scales in direct proportion with roof area and rainfall depth, while in bicycle gears, wheel rotation speed and pedalling torque follow inverse gear-tooth ratios.',
    activityType: 'Problem-solving challenge',
    application: 'Bicycle gear ratios, solar daily energy yield, and soil moisture percentage',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'hemh1',
      url: 'https://ncert.nic.in/textbook.php?hemh1=11-13',
    },
    mappingStatus: 'verified',
  },

  NCERT_GEO8_CH02_SOIL_WATER_VEG: {
    curriculumId: 'NCERT_GEO8_CH02_SOIL_WATER_VEG',
    topic: 'Land, Soil, Water & Natural Vegetation Conservation',
    grade: 8,
    subject: 'Social Science (Geography)',
    textbook: 'Resources and Development - Geography Class VIII',
    chapterNumber: 2,
    chapterTitle: 'Land, Soil, Water, Natural Vegetation and Wildlife Resources',
    subtopic: 'Soil profile, soil erosion prevention by tree shelterbelts, drip irrigation, and rainwater harvesting',
    learningObjective:
      'Explain how vegetation prevents soil erosion and how drip irrigation and rainwater harvesting conserve scarce freshwater.',
    explanation:
      'Tree roots anchor topsoil against monsoon runoff, while drip irrigation minimises evaporation losses in dry regions—key strategies taught in Class 8 Geography.',
    activityType: 'Observation & discovery',
    application: 'Tree erosion protection, soil conservation, village pond recharge, and drip irrigation',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'hess4',
      url: 'https://ncert.nic.in/textbook.php?hess4=2-5',
    },
    mappingStatus: 'verified',
  },

  NCERT_GEO8_CH03_AGRICULTURE: {
    curriculumId: 'NCERT_GEO8_CH03_AGRICULTURE',
    topic: 'Farming Systems & Major Crops',
    grade: 8,
    subject: 'Social Science (Geography)',
    textbook: 'Resources and Development - Geography Class VIII',
    chapterNumber: 3,
    chapterTitle: 'Agriculture',
    subtopic: 'Food crops (millets/ragi, rice, maize, wheat), fibre crops (cotton), and sustainable farm inputs',
    learningObjective:
      'Compare water and soil needs of major Indian crops such as millets (ragi), maize, rice, and cotton.',
    explanation:
      'Millets like ragi thrive in semi-arid sandy soils with far less water than paddy rice, helping villages match crops to local rainfall and soil types.',
    activityType: 'Interactive simulation',
    application: 'Agricultural Farm Lab crop selection and rural livelihood economics',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'hess4',
      url: 'https://ncert.nic.in/textbook.php?hess4=3-5',
    },
    mappingStatus: 'verified',
  },

  // ===========================================================================
  // CLASS 9 — SCIENCE & GEOGRAPHY (iesc1, iess1 — Rationalised 2024)
  // ===========================================================================
  NCERT_SCI9_CH01_EVAPORATION: {
    curriculumId: 'NCERT_SCI9_CH01_EVAPORATION',
    topic: 'Latent Heat & Evaporative Cooling',
    grade: 9,
    subject: 'Science',
    textbook: 'Science - Textbook for Class IX',
    chapterNumber: 1,
    chapterTitle: 'Matter in Our Surroundings',
    subtopic: 'Factors affecting evaporation and cooling of water in earthen pots (matkas) and cotton clothes',
    learningObjective:
      'Explain at the particle level why evaporation absorbs latent heat from surroundings, cooling earthen pots and cotton wearers.',
    explanation:
      'Fast-moving surface water particles escape into vapour by absorbing heat energy from the remaining water in a porous clay pot, lowering its temperature naturally.',
    activityType: 'Observation & discovery',
    application: 'Pottery cottage earthen matkas and summer cotton clothing comfort',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'iesc1',
      url: 'https://ncert.nic.in/textbook.php?iesc1=1-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI9_CH08_FORCE_LAWS: {
    curriculumId: 'NCERT_SCI9_CH08_FORCE_LAWS',
    topic: 'Force, Inertia & Laws of Motion',
    grade: 9,
    subject: 'Science',
    textbook: 'Science - Textbook for Class IX',
    chapterNumber: 8,
    chapterTitle: 'Force and Laws of Motion',
    subtopic: 'Newton’s laws of motion, inertia, momentum, and braking forces in vehicles',
    learningObjective:
      'Apply Newton’s laws of motion to explain acceleration, braking, and load transport in village vehicles.',
    explanation:
      'Heavier vehicles carry greater inertia and momentum, requiring larger braking force to stop safely—connecting Newton’s Second Law directly to village road transport.',
    activityType: 'Observation & discovery',
    application: 'Cars, auto-rickshaws, motorcycles, bicycles, and Physics Learning House',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'iesc1',
      url: 'https://ncert.nic.in/textbook.php?iesc1=8-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI9_CH09_GRAVITATION: {
    curriculumId: 'NCERT_SCI9_CH09_GRAVITATION',
    topic: 'Gravitation, Thrust & Fluid Pressure',
    grade: 9,
    subject: 'Science',
    textbook: 'Science - Textbook for Class IX',
    chapterNumber: 9,
    chapterTitle: 'Gravitation',
    subtopic: 'Weight (mg), thrust, pressure in fluids, and gravity-driven water flow',
    learningObjective:
      'Relate gravitational weight of water columns to fluid pressure and gravity-fed village water distribution.',
    explanation:
      'Gravity pulls water downward with weight W = mg. Raising water into an overhead tank creates downward thrust and fluid pressure that delivers water through village pipes.',
    activityType: 'Interactive simulation',
    application: 'Overhead Water Tank Lab, Well bucket weight (mg), and water flow downhill',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'iesc1',
      url: 'https://ncert.nic.in/textbook.php?iesc1=9-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI9_CH10_WORK_ENERGY: {
    curriculumId: 'NCERT_SCI9_CH10_WORK_ENERGY',
    topic: 'Work, Gravitational Potential Energy & Energy Conversion',
    grade: 9,
    subject: 'Science',
    textbook: 'Science - Textbook for Class IX',
    chapterNumber: 10,
    chapterTitle: 'Work and Energy',
    subtopic: 'Work (W = F·s), gravitational potential energy (E_p = mgh), kinetic energy, and conservation of energy',
    learningObjective:
      'Calculate work and gravitational potential energy in lifting water and trace energy transformations in engines and solar panels.',
    explanation:
      'Pumping water up to height h stores gravitational potential energy (E_p = mgh). Similarly, car engines convert chemical fuel energy into kinetic energy of motion.',
    activityType: 'Interactive simulation',
    application: 'Overhead tank potential energy, well bucket lifting work, and vehicle engines',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'iesc1',
      url: 'https://ncert.nic.in/textbook.php?iesc1=10-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI9_CH12_FOOD_RESOURCES: {
    curriculumId: 'NCERT_SCI9_CH12_FOOD_RESOURCES',
    topic: 'Crop Improvement, Irrigation & Bio-Pest Protection',
    grade: 9,
    subject: 'Science',
    textbook: 'Science - Textbook for Class IX',
    chapterNumber: 12,
    chapterTitle: 'Improvement in Food Resources',
    subtopic: 'Cropping patterns, crop rotation, irrigation systems (wells/canals/drip), organic manure, and neem grain protection',
    learningObjective:
      'Design sustainable crop management practices combining irrigation, nutrient management, crop rotation, and natural neem pest control.',
    explanation:
      'NCERT Class 9 explicitly discusses using dried neem leaves as natural bio-pesticides for stored grains alongside crop rotation, vermicompost, and efficient irrigation.',
    activityType: 'Interactive simulation',
    application: 'Agricultural Farm Lab, Neem Tree pest control, and Soil vermicomposting',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'iesc1',
      url: 'https://ncert.nic.in/textbook.php?iesc1=12-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_GEO9_CH03_DRAINAGE: {
    curriculumId: 'NCERT_GEO9_CH03_DRAINAGE',
    topic: 'Rivers, Streams & Drainage Basins',
    grade: 9,
    subject: 'Social Science (Geography)',
    textbook: 'Contemporary India - I (Geography Class IX)',
    chapterNumber: 3,
    chapterTitle: 'Drainage',
    subtopic: 'Watersheds, streams, ponds, lakes, and the role of water bodies in moderating local climate',
    learningObjective:
      'Describe how streams, rivers, and village ponds drain rainfall, recharge groundwater, and moderate local microclimates.',
    explanation:
      'Natural drainage channels guide rainwater from higher ground into streams and village ponds, storing surface water and replenishing underground aquifers.',
    activityType: 'Observation & discovery',
    application: 'Village pond, eastern stream, bridge watershed, and lakeside microclimate',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'iess1',
      url: 'https://ncert.nic.in/textbook.php?iess1=3-6',
    },
    mappingStatus: 'verified',
  },

  NCERT_GEO9_CH04_CLIMATE: {
    curriculumId: 'NCERT_GEO9_CH04_CLIMATE',
    topic: 'Indian Monsoon, Winds & Weather Elements',
    grade: 9,
    subject: 'Social Science (Geography)',
    textbook: 'Contemporary India - I (Geography Class IX)',
    chapterNumber: 4,
    chapterTitle: 'Climate',
    subtopic: 'Elements of weather (temperature, pressure, wind, humidity, precipitation) and monsoon cycles',
    learningObjective:
      'Interpret rainfall, wind direction, and temperature observations to understand seasonal monsoon patterns.',
    explanation:
      'Weather describes day-to-day atmospheric conditions—temperature, wind, humidity, and rainfall—whereas climate reflects long-term patterns such as India’s southwest monsoon.',
    activityType: 'Observation & discovery',
    application: 'Weather Station measurements and monsoon crop planning',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'iess1',
      url: 'https://ncert.nic.in/textbook.php?iess1=4-6',
    },
    mappingStatus: 'verified',
  },

  NCERT_GEO9_CH05_VEGETATION: {
    curriculumId: 'NCERT_GEO9_CH05_VEGETATION',
    topic: 'Natural Vegetation & Native Indian Trees',
    grade: 9,
    subject: 'Social Science (Geography)',
    textbook: 'Contemporary India - I (Geography Class IX)',
    chapterNumber: 5,
    chapterTitle: 'Natural Vegetation and Wildlife',
    subtopic: 'Tropical deciduous and coastal palm flora (neem, banyan, mango, coconut) and medicinal/ecological value',
    learningObjective:
      'Relate native Indian tree species to local climate zones and explain their medicinal and ecological importance.',
    explanation:
      'India’s diverse rainfall zones support tropical deciduous trees like neem, banyan, and mango alongside coastal and humid-tropical coconut palms, each sustaining rich wildlife.',
    activityType: 'Observation & discovery',
    application: 'Village tree species: Neem, Banyan, Mango, Coconut, and Guava groves',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'iess1',
      url: 'https://ncert.nic.in/textbook.php?iess1=5-6',
    },
    mappingStatus: 'verified',
  },

  // ===========================================================================
  // CLASS 10 — SCIENCE, MATHEMATICS & GEOGRAPHY (jesc1, jemh1, jess1)
  // ===========================================================================
  NCERT_SCI10_CH01_REACTIONS: {
    curriculumId: 'NCERT_SCI10_CH01_REACTIONS',
    topic: 'Chemical Reactions & Balanced Equations',
    grade: 10,
    subject: 'Science',
    textbook: 'Science - Textbook for Class X',
    chapterNumber: 1,
    chapterTitle: 'Chemical Reactions and Equations',
    subtopic: 'Combination, displacement, and double displacement reactions in everyday chemistry',
    learningObjective:
      'Represent real-world chemical transformations such as slaking lime and neutralisation using balanced chemical equations.',
    explanation:
      'Chemical reactions rearrange atoms to form new substances—for example, quicklime (CaO) reacts with water to form slaked lime Ca(OH)₂ used in whitewashing and soil treatment.',
    activityType: 'Practical experiment',
    application: 'Chemistry Learning House and Soil Chemistry liming reactions',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'jesc1',
      url: 'https://ncert.nic.in/textbook.php?jesc1=1-13',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI10_CH02_PH_SALTS: {
    curriculumId: 'NCERT_SCI10_CH02_PH_SALTS',
    topic: 'pH Scale & Importance of pH in Soil',
    grade: 10,
    subject: 'Science',
    textbook: 'Science - Textbook for Class X',
    chapterNumber: 2,
    chapterTitle: 'Acids, Bases and Salts',
    subtopic: 'Universal indicator pH scale (0–14), optimal crop soil pH (~6.5–7.5), and CaCO₃ / gypsum treatment',
    learningObjective:
      'Use the pH scale (0–14) to diagnose soil acidity or alkalinity and recommend appropriate chemical neutralisation.',
    explanation:
      'Class 10 Science specifically examines the pH of soil in backyards and farms: most crops need near-neutral soil (pH 6.5–7.5) for healthy root nutrient uptake.',
    activityType: 'Interactive simulation',
    application: 'Soil Chemistry Lab universal pH testing and lime/gypsum neutralisation',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'jesc1',
      url: 'https://ncert.nic.in/textbook.php?jesc1=2-13',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI10_CH05_LIFE_PROCESSES: {
    curriculumId: 'NCERT_SCI10_CH05_LIFE_PROCESSES',
    topic: 'Autotrophic Nutrition, Transpiration & Transport',
    grade: 10,
    subject: 'Science',
    textbook: 'Science - Textbook for Class X',
    chapterNumber: 5,
    chapterTitle: 'Life Processes',
    subtopic: 'Photosynthesis mechanism, stomatal regulation, xylem transpiration pull, and human organ systems',
    learningObjective:
      'Explain photosynthesis, transpirational water transport in xylem, and human physiological systems.',
    explanation:
      'Through stomata, plants exchange CO₂ and water vapour; transpirational pull draws water upward from roots to the tallest banyan and coconut crowns.',
    activityType: 'Observation & discovery',
    application: 'Biology Learning House, Agricultural Farm Lab, and village trees',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'jesc1',
      url: 'https://ncert.nic.in/textbook.php?jesc1=5-13',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI10_CH11_ELECTRICITY: {
    curriculumId: 'NCERT_SCI10_CH11_ELECTRICITY',
    topic: 'Ohm’s Law, Electrical Power (P = V × I) & Energy',
    grade: 10,
    subject: 'Science',
    textbook: 'Science - Textbook for Class X',
    chapterNumber: 11,
    chapterTitle: 'Electricity',
    subtopic: 'Potential difference, current, Ohm’s law, electric power P = VI, and commercial unit kWh',
    learningObjective:
      'Calculate electrical power (P = V × I) and daily electrical energy consumption (kWh) for solar panels, LED bulbs, and pumps.',
    explanation:
      'Electric power is the product of voltage and current (P = V × I, measured in watts). Multiplying power in kilowatts by operating hours yields daily energy in kWh (units).',
    activityType: 'Interactive simulation',
    application: 'Solar Energy Lab power & daily energy yield calculations and Physics House',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'jesc1',
      url: 'https://ncert.nic.in/textbook.php?jesc1=11-13',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI10_CH12_MAGNETIC_ACDC: {
    curriculumId: 'NCERT_SCI10_CH12_MAGNETIC_ACDC',
    topic: 'Magnetic Effects of Current & Domestic AC Circuits',
    grade: 10,
    subject: 'Science',
    textbook: 'Science - Textbook for Class X',
    chapterNumber: 12,
    chapterTitle: 'Magnetic Effects of Electric Current',
    subtopic: 'Force on current-carrying conductors, domestic alternating current (AC) supply, and safety',
    learningObjective:
      'Differentiate direct current (DC) produced by solar panels/batteries from alternating current (AC) used in village household circuits.',
    explanation:
      'Solar panels generate Direct Current (DC) flowing in one direction, whereas village grid appliances run on Alternating Current (AC)—explaining why solar installations include an inverter.',
    activityType: 'Interactive simulation',
    application: 'Solar Energy Lab DC-to-AC inverter & electric motor principles',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'jesc1',
      url: 'https://ncert.nic.in/textbook.php?jesc1=12-13',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI10_CH13_ENVIRONMENT: {
    curriculumId: 'NCERT_SCI10_CH13_ENVIRONMENT',
    topic: 'Ecosystems, Food Webs & Environmental Balance',
    grade: 10,
    subject: 'Science',
    textbook: 'Science - Textbook for Class X',
    chapterNumber: 13,
    chapterTitle: 'Our Environment',
    subtopic: 'Producers, consumers, decomposers, trophic energy flow, and biodegradable waste',
    learningObjective:
      'Analyse energy flow across producers, pollinators, and decomposers in a sustainable rural ecosystem.',
    explanation:
      'Green plants and village trees act as primary producers capturing sunlight, while decomposers recycle leaf litter and organic waste back into fertile farmland humus.',
    activityType: 'Observation & discovery',
    application: 'Biology Learning House, trees, flowering shrubs, and composting',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'jesc1',
      url: 'https://ncert.nic.in/textbook.php?jesc1=13-13',
    },
    mappingStatus: 'verified',
  },

  NCERT_MATH10_CH09_TRIG: {
    curriculumId: 'NCERT_MATH10_CH09_TRIG',
    topic: 'Angles of Elevation & Solar Geometry',
    grade: 10,
    subject: 'Mathematics',
    textbook: 'Mathematics - Textbook for Class X',
    chapterNumber: 9,
    chapterTitle: 'Some Applications of Trigonometry',
    subtopic: 'Angle of elevation of the Sun, shadow lengths, and sine/cosine projection factors',
    learningObjective:
      'Use trigonometric ratios and angles of elevation to understand how sunlight intensity varies from sunrise to solar noon.',
    explanation:
      'As the Sun’s angle of elevation θ climbs toward noon, sunlight strikes horizontal surfaces more directly (proportional to sin θ), maximising solar panel output.',
    activityType: 'Interactive simulation',
    application: 'Solar Energy Lab zenith angle & orientation calculations',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'jemh1',
      url: 'https://ncert.nic.in/textbook.php?jemh1=9-14',
    },
    mappingStatus: 'verified',
  },

  NCERT_MATH10_CH12_VOLUMES: {
    curriculumId: 'NCERT_MATH10_CH12_VOLUMES',
    topic: 'Surface Areas & Volumes of Composite Solids',
    grade: 10,
    subject: 'Mathematics',
    textbook: 'Mathematics - Textbook for Class X',
    chapterNumber: 12,
    chapterTitle: 'Surface Areas and Volumes',
    subtopic: 'Volumes of cylinders, hemispheres, and composite water storage reservoirs',
    learningObjective:
      'Model village cylindrical wells and domed overhead water tanks as composite 3D solids to compute storage capacities.',
    explanation:
      'Combining cylinder and dome formulas allows engineers to determine exact water tank capacity and structural material needs.',
    activityType: 'Problem-solving challenge',
    application: 'Overhead Water Tank Lab, Community Well cylinder, and Mathematics House',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'jemh1',
      url: 'https://ncert.nic.in/textbook.php?jemh1=12-14',
    },
    mappingStatus: 'verified',
  },

  NCERT_GEO10_CH03_WATER: {
    curriculumId: 'NCERT_GEO10_CH03_WATER',
    topic: 'Water Scarcity & Rainwater Harvesting',
    grade: 10,
    subject: 'Social Science (Geography)',
    textbook: 'Contemporary India - II (Geography Class X)',
    chapterNumber: 3,
    chapterTitle: 'Water Resources',
    subtopic: 'Traditional Indian rooftop rainwater harvesting, groundwater recharge, and community water management',
    learningObjective:
      'Evaluate rooftop rainwater harvesting and community groundwater recharge as sustainable water management systems.',
    explanation:
      'India has rich traditional rainwater harvesting systems (tankas, Johads, rooftop percolation pits) that capture monsoon runoff to recharge village wells for dry summers.',
    activityType: 'Interactive simulation',
    application: 'Village House rainwater harvesting, Community Well recharge, and Water Tank conservation',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'jess1',
      url: 'https://ncert.nic.in/textbook.php?jess1=3-7',
    },
    mappingStatus: 'verified',
  },

  NCERT_GEO10_CH04_AGRICULTURE: {
    curriculumId: 'NCERT_GEO10_CH04_AGRICULTURE',
    topic: 'Cropping Seasons & Sustainable Indian Agriculture',
    grade: 10,
    subject: 'Social Science (Geography)',
    textbook: 'Contemporary India - II (Geography Class X)',
    chapterNumber: 4,
    chapterTitle: 'Agriculture',
    subtopic: 'Kharif/Rabi seasons, water-intensive vs. millet crops, and technological water-saving reforms',
    learningObjective:
      'Match Indian cropping seasons and crop choices (rice, ragi, maize, cotton) to regional rainfall and irrigation capacity.',
    explanation:
      'Choosing drought-hardy millets alongside drip irrigation helps Indian villages conserve groundwater while maintaining strong crop yields.',
    activityType: 'Interactive simulation',
    application: 'Agricultural Farm Lab crop planning and monsoon alignment',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'jess1',
      url: 'https://ncert.nic.in/textbook.php?jess1=4-7',
    },
    mappingStatus: 'verified',
  },

  NCERT_GEO10_CH05_ENERGY: {
    curriculumId: 'NCERT_GEO10_CH05_ENERGY',
    topic: 'Non-Conventional & Solar Energy Resources',
    grade: 10,
    subject: 'Social Science (Geography)',
    textbook: 'Contemporary India - II (Geography Class X)',
    chapterNumber: 5,
    chapterTitle: 'Minerals and Energy Resources',
    subtopic: 'Photovoltaic solar energy potential in tropical India and rural clean energy transition',
    learningObjective:
      'Explain why India’s tropical geography makes solar photovoltaic technology a transformative renewable energy source for villages.',
    explanation:
      'Located in the tropical belt, India receives abundant year-round sunlight. Photovoltaic solar arrays bring clean electricity directly to rural homes, street lamps, and irrigation pumps.',
    activityType: 'Interactive simulation',
    application: 'Solar Energy Lab and village solar street lighting',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'jess1',
      url: 'https://ncert.nic.in/textbook.php?jess1=5-7',
    },
    mappingStatus: 'verified',
  },

  // ===========================================================================
  // CLASS 11–12 — PHYSICS (Senior Secondary Verified Extensions: keph1, keph2, leph2)
  // ===========================================================================
  NCERT_PHY11_CH06_ROTATIONAL: {
    curriculumId: 'NCERT_PHY11_CH06_ROTATIONAL',
    topic: 'Torque & Rotational Motion',
    grade: 11,
    subject: 'Physics',
    textbook: 'Physics Part I - Textbook for Class XI',
    chapterNumber: 6,
    chapterTitle: 'System of Particles and Rotational Motion',
    subtopic: 'Torque (τ = r × F), angular velocity, and rotational power transmission in wheels and sprockets',
    learningObjective:
      'Relate torque, wheel radius, and rotational speed in bicycles, motorcycles, and geared drives.',
    explanation:
      'An engine or cyclist’s pedal applies a turning force called torque (τ = r × F) that rotates the sprocket and rear wheel, propelling the vehicle forward via road friction.',
    activityType: 'Observation & discovery',
    application: 'Bicycle gears, motorcycle chain drive, and Engineering Workshop mechanics',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'keph1',
      url: 'https://ncert.nic.in/textbook.php?keph1=6-7',
    },
    mappingStatus: 'verified',
  },

  NCERT_PHY11_CH09_FLUIDS: {
    curriculumId: 'NCERT_PHY11_CH09_FLUIDS',
    topic: 'Hydrostatic Pressure (P = ρgh) & Efflux Velocity',
    grade: 11,
    subject: 'Physics',
    textbook: 'Physics Part II - Textbook for Class XI',
    chapterNumber: 9,
    chapterTitle: 'Mechanical Properties of Fluids',
    subtopic: 'Hydrostatic pressure P = ρgh, Pascal’s law, communicating vessels, and Torricelli’s speed of efflux √(2gh)',
    learningObjective:
      'Quantify hydrostatic tap pressure (P = ρgh) and outflow speed (v = √(2gh)) from an elevated village water tank.',
    explanation:
      'Hydrostatic pressure depends purely on liquid density ρ, gravity g, and vertical head height h (P = ρgh)—not on tank width—and governs outflow speed via Torricelli’s law.',
    activityType: 'Interactive simulation',
    application: 'Overhead Water Tank Lab quantitative simulator and hydraulic head analysis',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'keph2',
      url: 'https://ncert.nic.in/textbook.php?keph2=2-7',
    },
    mappingStatus: 'verified',
  },

  NCERT_PHY12_CH14_SOLAR_CELL: {
    curriculumId: 'NCERT_PHY12_CH14_SOLAR_CELL',
    topic: 'Semiconductor p–n Junction & Photovoltaic Effect',
    grade: 12,
    subject: 'Physics',
    textbook: 'Physics Part II - Textbook for Class XII',
    chapterNumber: 14,
    chapterTitle: 'Semiconductor Electronics: Materials, Devices and Simple Circuits',
    subtopic: 'Photovoltaic solar cell operation using silicon semiconductor junctions',
    learningObjective:
      'Explain how incident photons liberate charge carriers in silicon semiconductor solar cells to generate DC voltage.',
    explanation:
      'When sunlight strikes a silicon solar panel, photon energy excites electrons across the semiconductor junction, creating an electric current without moving parts or fuel.',
    activityType: 'Interactive simulation',
    application: 'Solar Energy Lab photovoltaic panel simulation',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'leph2',
      url: 'https://ncert.nic.in/textbook.php?leph2=6-6',
    },
    mappingStatus: 'verified',
  },

  // ===========================================================================
  // HONEST INTERDISCIPLINARY EXTENSIONS (Anchored to verified NCERT Foundations)
  // ===========================================================================
  EXT_SIMPLE_MACHINES_PULLEY: {
    curriculumId: 'EXT_SIMPLE_MACHINES_PULLEY',
    topic: 'Simple Machines: Pulleys, Gears & Mechanical Advantage',
    grade: 8,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 8 (Interdisciplinary STEM Extension)',
    chapterNumber: 5,
    chapterTitle: 'Exploring Forces',
    subtopic: 'Applied mechanical advantage (MA = Load / Effort) in well pulleys, inclined planes, and bicycle gears',
    learningObjective:
      'Apply NCERT force and work concepts to calculate how pulleys, ramps, and gears trade distance for reduced effort force.',
    explanation:
      'While current NCF-SE NCERT middle-school chapters cover forces (Class 8 Ch 5) and work-energy (Class 9 Ch 10) rather than a dedicated simple-machines chapter, mechanical advantage (MA = Load / Effort) is a core rural engineering extension built directly on those NCERT laws.',
    activityType: 'Interactive simulation',
    application: 'Community Well pulley simulator, Physics House ramp, Engineering Workshop & Bicycles',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023) — Extension of Ch. 5',
      textbookCode: 'hecu1',
      url: 'https://ncert.nic.in/textbook.php?hecu1=5-13',
    },
    mappingStatus: 'interdisciplinary_extension',
    extensionNote:
      'Quantitative pulley & gear mechanical advantage (MA = Load/Effort) is an applied STEM enrichment extension grounded in NCERT Class 8 Science Ch. 5 (Exploring Forces) and Class 9 Science Ch. 10 (Work and Energy).',
  },

  // ===========================================================================
  // CIVIC EXPANSION VERIFIED NCERT ENTRIES (Hospital, Railway, Market, Bank)
  // ===========================================================================
  NCERT_SCI7_CH06_ADOLESCENCE: {
    curriculumId: 'NCERT_SCI7_CH06_ADOLESCENCE',
    topic: 'Adolescence, Puberty, Menstrual Hygiene & Myths vs. Facts',
    grade: 7,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 7',
    chapterNumber: 6,
    chapterTitle: 'Adolescence: A Stage of Growth and Change',
    subtopic: 'Physical and emotional changes of puberty, menstruation as a normal biological process, hygiene, and busting myths',
    learningObjective:
      'Understand puberty as a healthy natural stage of human growth, practise personal and menstrual hygiene, and distinguish scientific facts from social myths.',
    explanation:
      'Adolescence is the natural stage of growth between childhood and adulthood. Bodies grow and mature at different ages, and menstruation is a normal, healthy biological cycle—never a source of shame.',
    activityType: 'Observation & discovery',
    application: 'Village Hospital — Growing Up & Understanding Your Body and Health Myth Buster',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023)',
      textbookCode: 'gecu1',
      url: 'https://ncert.nic.in/textbook.php?gecu1=6-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI8_CH03_HEALTH: {
    curriculumId: 'NCERT_SCI8_CH03_HEALTH',
    topic: 'Personal Health, Nutrition, Immunity & Disease Prevention',
    grade: 8,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 8',
    chapterNumber: 3,
    chapterTitle: 'Health: The Ultimate Treasure',
    subtopic: 'Balanced nutrition, hygiene, vaccines, immunity, and distinguishing helpful vs. harmful microbes',
    learningObjective:
      'Explain how clean water, balanced food, personal hygiene, and vaccination protect village communities from preventable diseases.',
    explanation:
      'Good health depends on nutritious food, safe drinking water, regular handwashing, sleep, and vaccinations—while remembering that most microorganisms are actually beneficial rather than harmful.',
    activityType: 'Practical experiment',
    application: 'Village Hospital Reception, Health Camp, and Science-or-Myth Investigation',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023)',
      textbookCode: 'hecu1',
      url: 'https://ncert.nic.in/textbook.php?hecu1=3-13',
    },
    mappingStatus: 'verified',
  },

  NCERT_MATH8_CH07_COMPARING: {
    curriculumId: 'NCERT_MATH8_CH07_COMPARING',
    topic: 'Profit & Loss, Discounts, Sales Bills & Interest',
    grade: 8,
    subject: 'Mathematics',
    textbook: 'Mathematics - Grade 8',
    chapterNumber: 7,
    chapterTitle: 'Comparing Quantities',
    subtopic: 'Cost price, selling price, profit/loss %, marked price discounts, simple interest, and compound interest',
    learningObjective:
      'Calculate profit/loss percentages, market discounts, and simple or compound interest on village shop sales and cooperative bank savings.',
    explanation:
      'Shopkeepers compare Cost Price and Selling Price to find Profit or Loss %, while savers at a cooperative bank earn Simple Interest SI = (P × R × T) / 100 or Compound Interest on deposits.',
    activityType: 'Problem-solving challenge',
    application: 'Village Marketplace 5-shop business lab and Cooperative Bank interest calculator',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'hemh1',
      url: 'https://ncert.nic.in/textbook.php?hemh1=7-13',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI9_CH07_MOTION: {
    curriculumId: 'NCERT_SCI9_CH07_MOTION',
    topic: 'Average Speed, Velocity, Acceleration & Distance-Time Motion',
    grade: 9,
    subject: 'Science',
    textbook: 'Science - Textbook for Class IX',
    chapterNumber: 7,
    chapterTitle: 'Motion',
    subtopic: 'Average speed = Total Distance / Total Time, km/h to m/s conversion, uniform vs. accelerated train motion',
    learningObjective:
      'Compute average train speeds, travel durations, unit conversions, and compare motion curves across village rail schedules.',
    explanation:
      'A train covering 120 km in 2 hours travels at an average speed of 60 km/h (≈ 16.67 m/s). Accelerating out of a station changes velocity over time.',
    activityType: 'Interactive simulation',
    application: 'Village Railway Station Speed-Distance-Time Lab, Timetables & Motion Simulator',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'iesc1',
      url: 'https://ncert.nic.in/textbook.php?iesc1=7-12',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI10_CH06_NERVOUS: {
    curriculumId: 'NCERT_SCI10_CH06_NERVOUS',
    topic: 'Human Brain, Nervous System & Endocrine Hormones',
    grade: 10,
    subject: 'Science',
    textbook: 'Science - Textbook for Class X',
    chapterNumber: 6,
    chapterTitle: 'Control and Coordination',
    subtopic: 'Brain regions, neurons, reflex actions, and endocrine glands coordinating adolescent growth',
    learningObjective:
      'Describe how the brain, nerves, and endocrine hormones coordinate body movement, reflexes, and adolescent development.',
    explanation:
      'The brain acts as the body’s command centre via electrical nerve impulses, while endocrine hormones act as chemical messengers guiding growth and puberty.',
    activityType: 'Interactive simulation',
    application: 'Village Hospital Human Anatomy Lab (Brain & Nervous System)',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'jesc1',
      url: 'https://ncert.nic.in/textbook.php?jesc1=6-13',
    },
    mappingStatus: 'verified',
  },

  NCERT_SCI10_CH07_REPRODUCTION: {
    curriculumId: 'NCERT_SCI10_CH07_REPRODUCTION',
    topic: 'Human Reproductive Systems, Fertilisation & Reproductive Health',
    grade: 10,
    subject: 'Science',
    textbook: 'Science - Textbook for Class X',
    chapterNumber: 7,
    chapterTitle: 'How do Organisms Reproduce?',
    subtopic: 'Male and female reproductive organs, menstruation, fertilisation, prenatal nutrition via placenta, and reproductive health',
    learningObjective:
      'Explain the structure and functions of human reproductive systems, fertilisation, menstruation, and safe reproductive health practices.',
    explanation:
      'NCERT Class 10 explains human reproductive anatomy, how the egg and sperm fuse during fertilisation, how the uterine lining prepares each month (and sheds as menstruation if unfertilised), and how the placenta nourishes a developing baby.',
    activityType: 'Observation & discovery',
    application: 'Village Hospital — Growing Up & Understanding Your Body (Classes 9–10 module)',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'jesc1',
      url: 'https://ncert.nic.in/textbook.php?jesc1=7-13',
    },
    mappingStatus: 'verified',
  },

  NCERT_ECON10_CH03_MONEY_CREDIT: {
    curriculumId: 'NCERT_ECON10_CH03_MONEY_CREDIT',
    topic: 'Banking, Deposits, Cooperatives & Financial Inclusion',
    grade: 10,
    subject: 'Social Science (Economics)',
    textbook: 'Understanding Economic Development - Class X',
    chapterNumber: 3,
    chapterTitle: 'Money and Credit',
    subtopic: 'Demand deposits, bank interest, formal cooperative societies, Self-Help Groups, and responsible credit',
    learningObjective:
      'Explain how cooperative banks safeguard rural savings, pay interest on deposits, and offer fair credit to farmers and families.',
    explanation:
      'Cooperative banks and Self-Help Groups pool community savings safely, pay interest on deposits, and provide fair, transparent loans that protect villagers from exploitative informal debt.',
    activityType: 'Interactive simulation',
    application: 'Village Cooperative Bank Savings Account, Loans & Financial Inclusion Missions',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'jess2',
      url: 'https://ncert.nic.in/textbook.php?jess2=3-5',
    },
    mappingStatus: 'verified',
  },

  NCERT_BIO12_CH02_HUMAN_REPRO: {
    curriculumId: 'NCERT_BIO12_CH02_HUMAN_REPRO',
    topic: 'Detailed Human Reproduction, Menstrual Cycle & Embryonic Development',
    grade: 12,
    subject: 'Biology',
    textbook: 'Biology - Textbook for Class XII',
    chapterNumber: 2,
    chapterTitle: 'Human Reproduction',
    subtopic: 'Gametogenesis, hormonal phases of the menstrual cycle, fertilisation, implantation, and prenatal development',
    learningObjective:
      'Analyse the hormonal regulation of the menstrual cycle, gametogenesis, fertilisation, and stages of prenatal development.',
    explanation:
      'Class 12 Biology details the follicular, ovulatory, and luteal phases of the menstrual cycle alongside fertilisation, implantation, and placental nourishment during pregnancy.',
    activityType: 'Observation & discovery',
    application: 'Village Hospital — Senior Secondary Reproductive Biology Module (Classes 11–12)',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'lebo1',
      url: 'https://ncert.nic.in/textbook.php?lebo1=2-13',
    },
    mappingStatus: 'verified',
  },

  NCERT_BIO12_CH03_REPRO_HEALTH: {
    curriculumId: 'NCERT_BIO12_CH03_REPRO_HEALTH',
    topic: 'Reproductive Health Awareness & Responsible Healthcare',
    grade: 12,
    subject: 'Biology',
    textbook: 'Biology - Textbook for Class XII',
    chapterNumber: 3,
    chapterTitle: 'Reproductive Health',
    subtopic: 'Adolescent reproductive health awareness, prevention of infections, maternal care, and consulting qualified doctors',
    learningObjective:
      'Evaluate scientific strategies for reproductive health awareness, infection prevention, and safe medical guidance.',
    explanation:
      'Reproductive health encompasses complete physical, emotional, and social well-being, built on accurate scientific education, hygiene, respect, and access to qualified healthcare.',
    activityType: 'Observation & discovery',
    application: 'Village Hospital — Senior Secondary Reproductive Health Awareness (Classes 11–12)',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024)',
      textbookCode: 'lebo1',
      url: 'https://ncert.nic.in/textbook.php?lebo1=3-13',
    },
    mappingStatus: 'verified',
  },

  EXT_BOUNDARIES_CONSENT: {
    curriculumId: 'EXT_BOUNDARIES_CONSENT',
    topic: 'Personal Boundaries, Consent & Mutual Respect',
    grade: 7,
    subject: 'Science',
    textbook: 'Curiosity - Science Grade 7 (Life-Skills Health Extension)',
    chapterNumber: 6,
    chapterTitle: 'Adolescence: A Stage of Growth and Change',
    subtopic: 'Bodily autonomy, respectful communication, personal boundaries, and speaking with trusted adults/doctors',
    learningObjective:
      'Recognise personal boundaries, practise mutual consent and respect, and identify trusted adults or healthcare professionals for support.',
    explanation:
      'Every young person has the right to bodily safety, privacy, and respect. Saying "no" to uncomfortable situations is always okay, and trusted parents, teachers, or doctors are there to help.',
    activityType: 'Observation & discovery',
    application: 'Village Hospital — Safe Adolescent Wellbeing & Personal Boundaries Guide',
    source: {
      publisher: 'NCERT',
      edition: '1st Edition (2025, NCF-SE 2023) — Life-Skills Extension of Ch. 6',
      textbookCode: 'gecu1',
      url: 'https://ncert.nic.in/textbook.php?gecu1=6-12',
    },
    mappingStatus: 'interdisciplinary_extension',
    extensionNote:
      'Personal boundaries, consent, and adolescent safety are essential life-skills health extensions aligned with NCERT Adolescence Education Programme (AEP) and Class 7 Science Ch. 6.',
  },

  EXT_HOUSEHOLD_BUDGETING: {
    curriculumId: 'EXT_HOUSEHOLD_BUDGETING',
    topic: 'Household Budgeting & Savings Goal Planning',
    grade: 8,
    subject: 'Mathematics',
    textbook: 'Mathematics - Grade 8 (Financial Literacy Extension)',
    chapterNumber: 7,
    chapterTitle: 'Comparing Quantities',
    subtopic: 'Allocating monthly household income across essentials, emergencies, and savings goals without overspending',
    learningObjective:
      'Plan a balanced monthly rural household budget using addition, subtraction, and percentage allocations while meeting savings goals.',
    explanation:
      'Creating a monthly budget helps families cover essentials like food, school supplies, healthcare, and transport while consistently setting aside emergency savings.',
    activityType: 'Problem-solving challenge',
    application: 'Village Cooperative Bank — ₹12,000 Family Monthly Budget Planner & Savings Missions',
    source: {
      publisher: 'NCERT',
      edition: 'Rationalised Edition (2024) — Financial Literacy Extension of Ch. 7',
      textbookCode: 'hemh1',
      url: 'https://ncert.nic.in/textbook.php?hemh1=7-13',
    },
    mappingStatus: 'interdisciplinary_extension',
    extensionNote:
      'Practical monthly family budgeting is an interdisciplinary financial-literacy extension combining NCERT Class 8 Mathematics Ch. 7 (Comparing Quantities) and Class 10 Economics Ch. 3 (Money and Credit).',
  },
};
