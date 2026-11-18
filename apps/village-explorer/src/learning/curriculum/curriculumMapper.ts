import {
  NCERT_CURRICULUM_REGISTRY,
  NcertCurriculumEntry,
  SupportedGrade,
} from './ncertRegistry';

export interface EntityCurriculumBinding {
  entityKey: string;
  entityType:
    | 'core_lab'
    | 'learning_house'
    | 'civic_center'
    | 'residential'
    | 'tree'
    | 'environment'
    | 'vehicle'
    | 'exploration_fact';
  displayName: string;
  /** Ordered list of verified NCERT curriculumIds across grades */
  curriculumIds: string[];
}

/**
 * Maps every village laboratory, learning house, residential cottage, tree variety,
 * terrain/environment feature, vehicle, and exploration fact to verified NCERT curriculum IDs.
 */
export const ENTITY_CURRICULUM_MAP: Record<string, EntityCurriculumBinding> = {
  // ===========================================================================
  // A. 6 CORE LIVING LABORATORIES
  // ===========================================================================
  house: {
    entityKey: 'house',
    entityType: 'core_lab',
    displayName: 'Village House Lab',
    curriculumIds: [
      'NCERT_SCI6_CH06_MATERIALS',
      'NCERT_SCI6_CH08_WATER_STATES',
      'NCERT_MATH6_CH06_PERIMETER_AREA',
      'NCERT_SCI7_CH07_HEAT',
      'NCERT_MATH8_CH09_MENSURATION',
      'NCERT_GEO10_CH03_WATER',
    ],
  },
  well: {
    entityKey: 'well',
    entityType: 'core_lab',
    displayName: 'Community Well Lab',
    curriculumIds: [
      'NCERT_SCI6_CH09_SEPARATION',
      'NCERT_SCI6_CH11_TREASURES',
      'NCERT_SCI8_CH05_FORCES',
      'EXT_SIMPLE_MACHINES_PULLEY',
      'NCERT_MATH8_CH09_MENSURATION',
      'NCERT_SCI9_CH10_WORK_ENERGY',
      'NCERT_GEO10_CH03_WATER',
    ],
  },
  farm: {
    entityKey: 'farm',
    entityType: 'core_lab',
    displayName: 'Agricultural Farm Lab',
    curriculumIds: [
      'NCERT_MATH6_CH06_PERIMETER_AREA',
      'NCERT_SCI7_CH10_PLANTS',
      'NCERT_MATH7_CH10_QUANTITIES',
      'NCERT_SCI8_CH02_MICROBES',
      'NCERT_GEO8_CH03_AGRICULTURE',
      'NCERT_SCI9_CH12_FOOD_RESOURCES',
      'NCERT_GEO10_CH04_AGRICULTURE',
    ],
  },
  tank: {
    entityKey: 'tank',
    entityType: 'core_lab',
    displayName: 'Overhead Water Tank Lab',
    curriculumIds: [
      'NCERT_SCI6_CH11_TREASURES',
      'NCERT_SCI8_CH06_PRESSURE_WINDS',
      'NCERT_MATH8_CH09_MENSURATION',
      'NCERT_SCI9_CH09_GRAVITATION',
      'NCERT_SCI9_CH10_WORK_ENERGY',
      'NCERT_MATH10_CH12_VOLUMES',
      'NCERT_PHY11_CH09_FLUIDS',
    ],
  },
  solar: {
    entityKey: 'solar',
    entityType: 'core_lab',
    displayName: 'Solar Energy Lab',
    curriculumIds: [
      'NCERT_SCI6_CH11_TREASURES',
      'NCERT_SCI7_CH03_ELECTRICITY',
      'NCERT_SCI8_CH04_ELECTRIC_EFFECTS',
      'NCERT_SCI8_CH13_SUSTAINABLE_EARTH',
      'NCERT_SCI10_CH11_ELECTRICITY',
      'NCERT_SCI10_CH12_MAGNETIC_ACDC',
      'NCERT_MATH10_CH09_TRIG',
      'NCERT_GEO10_CH05_ENERGY',
      'NCERT_PHY12_CH14_SOLAR_CELL',
    ],
  },
  soil: {
    entityKey: 'soil',
    entityType: 'core_lab',
    displayName: 'Soil Chemistry Lab',
    curriculumIds: [
      'NCERT_SCI6_CH10_LIVING',
      'NCERT_SCI6_CH11_TREASURES',
      'NCERT_SCI7_CH02_ACIDS_BASES',
      'NCERT_SCI8_CH08_ELEMENTS_MIXTURES',
      'NCERT_GEO8_CH02_SOIL_WATER_VEG',
      'NCERT_SCI10_CH01_REACTIONS',
      'NCERT_SCI10_CH02_PH_SALTS',
    ],
  },

  // ===========================================================================
  // B. 7 ADDITIONAL EDUCATIONAL HOUSES & WORKSHOPS
  // ===========================================================================
  math_house: {
    entityKey: 'math_house',
    entityType: 'learning_house',
    displayName: 'Mathematics Learning House',
    curriculumIds: [
      'NCERT_MATH6_CH02_ANGLES',
      'NCERT_MATH6_CH06_PERIMETER_AREA',
      'NCERT_MATH7_CH07_TRIANGLES',
      'NCERT_MATH7_CH12_PERIMETER_AREA',
      'NCERT_MATH8_CH09_MENSURATION',
      'NCERT_MATH10_CH09_TRIG',
      'NCERT_MATH10_CH12_VOLUMES',
    ],
  },
  physics_house: {
    entityKey: 'physics_house',
    entityType: 'learning_house',
    displayName: 'Physics Learning House',
    curriculumIds: [
      'NCERT_SCI6_CH05_MOTION',
      'NCERT_SCI7_CH03_ELECTRICITY',
      'NCERT_SCI8_CH04_ELECTRIC_EFFECTS',
      'NCERT_SCI8_CH05_FORCES',
      'NCERT_SCI9_CH08_FORCE_LAWS',
      'NCERT_SCI9_CH10_WORK_ENERGY',
      'NCERT_SCI10_CH11_ELECTRICITY',
      'NCERT_PHY11_CH06_ROTATIONAL',
    ],
  },
  biology_house: {
    entityKey: 'biology_house',
    entityType: 'learning_house',
    displayName: 'Biology Learning House',
    curriculumIds: [
      'NCERT_SCI6_CH02_DIVERSITY',
      'NCERT_SCI6_CH10_LIVING',
      'NCERT_SCI7_CH09_ANIMALS',
      'NCERT_SCI7_CH10_PLANTS',
      'NCERT_SCI8_CH12_ECOSYSTEMS',
      'NCERT_SCI10_CH05_LIFE_PROCESSES',
      'NCERT_SCI10_CH13_ENVIRONMENT',
    ],
  },
  chemistry_house: {
    entityKey: 'chemistry_house',
    entityType: 'learning_house',
    displayName: 'Chemistry Learning House',
    curriculumIds: [
      'NCERT_SCI6_CH09_SEPARATION',
      'NCERT_SCI7_CH02_ACIDS_BASES',
      'NCERT_SCI7_CH05_CHANGES',
      'NCERT_SCI8_CH08_ELEMENTS_MIXTURES',
      'NCERT_SCI10_CH01_REACTIONS',
      'NCERT_SCI10_CH02_PH_SALTS',
    ],
  },
  engineering_workshop: {
    entityKey: 'engineering_workshop',
    entityType: 'learning_house',
    displayName: 'Engineering Workshop',
    curriculumIds: [
      'NCERT_MATH6_CH02_ANGLES',
      'NCERT_MATH7_CH07_TRIANGLES',
      'NCERT_SCI8_CH05_FORCES',
      'EXT_SIMPLE_MACHINES_PULLEY',
      'NCERT_MATH8_CH11_PROPORTIONS',
      'NCERT_SCI9_CH10_WORK_ENERGY',
      'NCERT_PHY11_CH06_ROTATIONAL',
    ],
  },
  weather_station: {
    entityKey: 'weather_station',
    entityType: 'learning_house',
    displayName: 'Weather Station',
    curriculumIds: [
      'NCERT_SCI6_CH07_TEMP',
      'NCERT_SCI6_CH08_WATER_STATES',
      'NCERT_SCI7_CH07_HEAT',
      'NCERT_SCI8_CH06_PRESSURE_WINDS',
      'NCERT_SCI8_CH13_SUSTAINABLE_EARTH',
      'NCERT_GEO9_CH04_CLIMATE',
    ],
  },
  math_market: {
    entityKey: 'math_market',
    entityType: 'learning_house',
    displayName: 'Mathematics Market',
    curriculumIds: [
      'NCERT_MATH6_CH06_PERIMETER_AREA',
      'NCERT_MATH7_CH10_QUANTITIES',
      'NCERT_MATH8_CH11_PROPORTIONS',
    ],
  },

  // --- 3 RESIDENTIAL COTTAGES ---
  cottage_west: {
    entityKey: 'cottage_west',
    entityType: 'residential',
    displayName: 'Pottery & Crafts Cottage',
    curriculumIds: [
      'NCERT_SCI6_CH06_MATERIALS',
      'NCERT_SCI6_CH08_WATER_STATES',
      'NCERT_SCI9_CH01_EVAPORATION',
    ],
  },
  cottage_north: {
    entityKey: 'cottage_north',
    entityType: 'residential',
    displayName: 'Weaver Family Home',
    curriculumIds: [
      'NCERT_SCI6_CH06_MATERIALS',
      'NCERT_SCI6_CH08_WATER_STATES',
      'NCERT_SCI9_CH01_EVAPORATION',
    ],
  },
  cottage_pond: {
    entityKey: 'cottage_pond',
    entityType: 'residential',
    displayName: 'Lakeside Farmer Cottage',
    curriculumIds: [
      'NCERT_SCI7_CH07_HEAT',
      'NCERT_GEO9_CH03_DRAINAGE',
    ],
  },

  // ===========================================================================
  // B2. 4 NEW CIVIC STEM CENTRES (Hospital, Railway, Marketplace, Bank)
  // ===========================================================================
  village_hospital: {
    entityKey: 'village_hospital',
    entityType: 'civic_center',
    displayName: 'Village Hospital & Health Science Centre',
    curriculumIds: [
      'NCERT_SCI6_CH10_LIVING',
      'NCERT_SCI7_CH06_ADOLESCENCE',
      'NCERT_SCI7_CH09_ANIMALS',
      'EXT_BOUNDARIES_CONSENT',
      'NCERT_SCI8_CH03_HEALTH',
      'NCERT_SCI10_CH05_LIFE_PROCESSES',
      'NCERT_SCI10_CH06_NERVOUS',
      'NCERT_SCI10_CH07_REPRODUCTION',
      'NCERT_BIO12_CH02_HUMAN_REPRO',
      'NCERT_BIO12_CH03_REPRO_HEALTH',
    ],
  },
  railway_station: {
    entityKey: 'railway_station',
    entityType: 'civic_center',
    displayName: 'Village Railway Station',
    curriculumIds: [
      'NCERT_SCI6_CH05_MOTION',
      'NCERT_SCI7_CH08_TIME_MOTION',
      'NCERT_MATH7_CH10_QUANTITIES',
      'NCERT_MATH8_CH11_PROPORTIONS',
      'NCERT_SCI9_CH07_MOTION',
      'NCERT_SCI9_CH08_FORCE_LAWS',
    ],
  },
  village_marketplace: {
    entityKey: 'village_marketplace',
    entityType: 'civic_center',
    displayName: 'Village Marketplace & 5 Shops',
    curriculumIds: [
      'NCERT_MATH6_CH06_PERIMETER_AREA',
      'NCERT_MATH7_CH10_QUANTITIES',
      'NCERT_MATH8_CH07_COMPARING',
      'NCERT_MATH8_CH11_PROPORTIONS',
    ],
  },
  cooperative_bank: {
    entityKey: 'cooperative_bank',
    entityType: 'civic_center',
    displayName: 'Village Cooperative Bank',
    curriculumIds: [
      'NCERT_MATH7_CH10_QUANTITIES',
      'NCERT_MATH8_CH07_COMPARING',
      'EXT_HOUSEHOLD_BUDGETING',
      'NCERT_ECON10_CH03_MONEY_CREDIT',
    ],
  },

  // ===========================================================================
  // C. TREES, PLANTS & ENVIRONMENTAL LANDSCAPE OBJECTS
  // ===========================================================================
  neem: {
    entityKey: 'neem',
    entityType: 'tree',
    displayName: 'Neem Tree',
    curriculumIds: [
      'NCERT_SCI6_CH02_DIVERSITY',
      'NCERT_SCI7_CH10_PLANTS',
      'NCERT_SCI8_CH12_ECOSYSTEMS',
      'NCERT_SCI9_CH12_FOOD_RESOURCES',
      'NCERT_GEO9_CH05_VEGETATION',
    ],
  },
  banyan: {
    entityKey: 'banyan',
    entityType: 'tree',
    displayName: 'Banyan Tree',
    curriculumIds: [
      'NCERT_SCI6_CH02_DIVERSITY',
      'NCERT_SCI7_CH10_PLANTS',
      'NCERT_SCI8_CH12_ECOSYSTEMS',
      'NCERT_GEO9_CH05_VEGETATION',
      'NCERT_SCI10_CH05_LIFE_PROCESSES',
    ],
  },
  mango: {
    entityKey: 'mango',
    entityType: 'tree',
    displayName: 'Mango Tree',
    curriculumIds: [
      'NCERT_SCI6_CH02_DIVERSITY',
      'NCERT_SCI7_CH10_PLANTS',
      'NCERT_GEO8_CH02_SOIL_WATER_VEG',
      'NCERT_GEO9_CH05_VEGETATION',
      'NCERT_SCI10_CH13_ENVIRONMENT',
    ],
  },
  coconut: {
    entityKey: 'coconut',
    entityType: 'tree',
    displayName: 'Coconut Palm',
    curriculumIds: [
      'NCERT_SCI6_CH02_DIVERSITY',
      'NCERT_SCI7_CH10_PLANTS',
      'NCERT_GEO9_CH05_VEGETATION',
      'NCERT_SCI10_CH05_LIFE_PROCESSES',
    ],
  },
  guava: {
    entityKey: 'guava',
    entityType: 'tree',
    displayName: 'Guava Fruit Tree',
    curriculumIds: [
      'NCERT_SCI6_CH02_DIVERSITY',
      'NCERT_SCI7_CH10_PLANTS',
      'NCERT_SCI8_CH12_ECOSYSTEMS',
      'NCERT_SCI10_CH13_ENVIRONMENT',
    ],
  },
  bush: {
    entityKey: 'bush',
    entityType: 'tree',
    displayName: 'Flowering Village Shrub',
    curriculumIds: [
      'NCERT_SCI6_CH02_DIVERSITY',
      'NCERT_SCI7_CH10_PLANTS',
      'NCERT_SCI8_CH12_ECOSYSTEMS',
      'NCERT_GEO8_CH02_SOIL_WATER_VEG',
    ],
  },

  // --- ENVIRONMENTAL & TERRAIN FEATURES (Soil, Rivers, Ponds, Hills, Crops, Flowers) ---
  env_soil: {
    entityKey: 'env_soil',
    entityType: 'environment',
    displayName: 'Village Soil & Farmland Earth',
    curriculumIds: [
      'NCERT_SCI6_CH11_TREASURES',
      'NCERT_SCI7_CH02_ACIDS_BASES',
      'NCERT_SCI8_CH08_ELEMENTS_MIXTURES',
      'NCERT_GEO8_CH02_SOIL_WATER_VEG',
      'NCERT_SCI10_CH02_PH_SALTS',
    ],
  },
  env_water_bodies: {
    entityKey: 'env_water_bodies',
    entityType: 'environment',
    displayName: 'Village Pond & Water Bodies',
    curriculumIds: [
      'NCERT_SCI6_CH08_WATER_STATES',
      'NCERT_SCI6_CH11_TREASURES',
      'NCERT_GEO8_CH02_SOIL_WATER_VEG',
      'NCERT_GEO9_CH03_DRAINAGE',
      'NCERT_GEO10_CH03_WATER',
    ],
  },
  env_rivers_streams: {
    entityKey: 'env_rivers_streams',
    entityType: 'environment',
    displayName: 'Village Stream & Rivers',
    curriculumIds: [
      'NCERT_GEO6_CH03_LANDFORMS',
      'NCERT_GEO9_CH03_DRAINAGE',
      'NCERT_GEO10_CH03_WATER',
    ],
  },
  env_hills_valleys: {
    entityKey: 'env_hills_valleys',
    entityType: 'environment',
    displayName: 'Hills, Valleys & Elevation Terrain',
    curriculumIds: [
      'NCERT_GEO6_CH03_LANDFORMS',
      'NCERT_SCI9_CH09_GRAVITATION',
      'NCERT_GEO9_CH03_DRAINAGE',
    ],
  },
  env_flowers_pollinators: {
    entityKey: 'env_flowers_pollinators',
    entityType: 'environment',
    displayName: 'Village Wildflowers & Garden Beds',
    curriculumIds: [
      'NCERT_SCI6_CH02_DIVERSITY',
      'NCERT_SCI7_CH10_PLANTS',
      'NCERT_SCI8_CH12_ECOSYSTEMS',
      'NCERT_SCI10_CH13_ENVIRONMENT',
    ],
  },
  env_agricultural_crops: {
    entityKey: 'env_agricultural_crops',
    entityType: 'environment',
    displayName: 'Agricultural Crops (Ragi, Maize, Vegetables)',
    curriculumIds: [
      'NCERT_SCI6_CH10_LIVING',
      'NCERT_SCI7_CH10_PLANTS',
      'NCERT_GEO8_CH03_AGRICULTURE',
      'NCERT_SCI9_CH12_FOOD_RESOURCES',
      'NCERT_GEO10_CH04_AGRICULTURE',
    ],
  },

  // ===========================================================================
  // D. VILLAGE VEHICLES & TRANSPORTATION
  // ===========================================================================
  car: {
    entityKey: 'car',
    entityType: 'vehicle',
    displayName: 'Village Car',
    curriculumIds: [
      'NCERT_SCI6_CH05_MOTION',
      'NCERT_SCI7_CH08_TIME_MOTION',
      'NCERT_SCI8_CH05_FORCES',
      'NCERT_SCI9_CH08_FORCE_LAWS',
      'NCERT_SCI9_CH10_WORK_ENERGY',
    ],
  },
  motorcycle: {
    entityKey: 'motorcycle',
    entityType: 'vehicle',
    displayName: 'Motorcycle',
    curriculumIds: [
      'NCERT_SCI6_CH05_MOTION',
      'NCERT_SCI7_CH08_TIME_MOTION',
      'NCERT_SCI8_CH04_ELECTRIC_EFFECTS',
      'NCERT_SCI8_CH05_FORCES',
      'NCERT_SCI9_CH08_FORCE_LAWS',
      'NCERT_PHY11_CH06_ROTATIONAL',
    ],
  },
  bicycle: {
    entityKey: 'bicycle',
    entityType: 'vehicle',
    displayName: 'Village Bicycle',
    curriculumIds: [
      'NCERT_SCI6_CH05_MOTION',
      'NCERT_SCI7_CH08_TIME_MOTION',
      'NCERT_SCI8_CH05_FORCES',
      'EXT_SIMPLE_MACHINES_PULLEY',
      'NCERT_MATH8_CH11_PROPORTIONS',
      'NCERT_PHY11_CH06_ROTATIONAL',
    ],
  },
  auto_rickshaw: {
    entityKey: 'auto_rickshaw',
    entityType: 'vehicle',
    displayName: 'Auto-Rickshaw',
    curriculumIds: [
      'NCERT_SCI6_CH05_MOTION',
      'NCERT_SCI7_CH08_TIME_MOTION',
      'NCERT_SCI8_CH05_FORCES',
      'NCERT_SCI9_CH08_FORCE_LAWS',
      'NCERT_SCI9_CH10_WORK_ENERGY',
    ],
  },

  // ===========================================================================
  // E. ALL 16 RANDOM EXPLORATION FACTS
  // ===========================================================================
  fact_roots_water: {
    entityKey: 'fact_roots_water',
    entityType: 'exploration_fact',
    displayName: 'Fact: Root Water Absorption',
    curriculumIds: ['NCERT_SCI7_CH10_PLANTS', 'NCERT_SCI10_CH05_LIFE_PROCESSES'],
  },
  fact_solar_pv: {
    entityKey: 'fact_solar_pv',
    entityType: 'exploration_fact',
    displayName: 'Fact: Solar Panels Convert Sunlight',
    curriculumIds: ['NCERT_SCI6_CH11_TREASURES', 'NCERT_GEO10_CH05_ENERGY', 'NCERT_PHY12_CH14_SOLAR_CELL'],
  },
  fact_gravity_water: {
    entityKey: 'fact_gravity_water',
    entityType: 'exploration_fact',
    displayName: 'Fact: Water Flows Downhill via Gravity',
    curriculumIds: ['NCERT_GEO6_CH03_LANDFORMS', 'NCERT_SCI8_CH06_PRESSURE_WINDS', 'NCERT_SCI9_CH09_GRAVITATION'],
  },
  fact_soil_composition: {
    entityKey: 'fact_soil_composition',
    entityType: 'exploration_fact',
    displayName: 'Fact: Village Soil Composition',
    curriculumIds: ['NCERT_SCI6_CH11_TREASURES', 'NCERT_SCI8_CH08_ELEMENTS_MIXTURES', 'NCERT_GEO8_CH02_SOIL_WATER_VEG'],
  },
  fact_trees_erosion: {
    entityKey: 'fact_trees_erosion',
    entityType: 'exploration_fact',
    displayName: 'Fact: Tree Roots Reduce Soil Erosion',
    curriculumIds: ['NCERT_GEO8_CH02_SOIL_WATER_VEG', 'NCERT_SCI8_CH12_ECOSYSTEMS'],
  },
  fact_bike_gears: {
    entityKey: 'fact_bike_gears',
    entityType: 'exploration_fact',
    displayName: 'Fact: Bicycle Gears & Pedalling',
    curriculumIds: ['EXT_SIMPLE_MACHINES_PULLEY', 'NCERT_MATH8_CH11_PROPORTIONS', 'NCERT_PHY11_CH06_ROTATIONAL'],
  },
  fact_white_roof: {
    entityKey: 'fact_white_roof',
    entityType: 'exploration_fact',
    displayName: 'Fact: Whitewashed Roofs Reflect Sunlight',
    curriculumIds: ['NCERT_SCI7_CH07_HEAT'],
  },
  fact_pulley_ma: {
    entityKey: 'fact_pulley_ma',
    entityType: 'exploration_fact',
    displayName: 'Fact: Well Fixed Pulley Direction of Force',
    curriculumIds: ['NCERT_SCI8_CH05_FORCES', 'EXT_SIMPLE_MACHINES_PULLEY'],
  },
  fact_drip_irrigation: {
    entityKey: 'fact_drip_irrigation',
    entityType: 'exploration_fact',
    displayName: 'Fact: Drip Irrigation Water Savings',
    curriculumIds: ['NCERT_GEO8_CH02_SOIL_WATER_VEG', 'NCERT_SCI9_CH12_FOOD_RESOURCES'],
  },
  fact_turmeric_indicator: {
    entityKey: 'fact_turmeric_indicator',
    entityType: 'exploration_fact',
    displayName: 'Fact: Turmeric Natural Acid-Base Indicator',
    curriculumIds: ['NCERT_SCI7_CH02_ACIDS_BASES', 'NCERT_SCI10_CH02_PH_SALTS'],
  },
  fact_triangle_strength: {
    entityKey: 'fact_triangle_strength',
    entityType: 'exploration_fact',
    displayName: 'Fact: Structural Rigidity of Triangles',
    curriculumIds: ['NCERT_MATH7_CH07_TRIANGLES'],
  },
  fact_rain_mm: {
    entityKey: 'fact_rain_mm',
    entityType: 'exploration_fact',
    displayName: 'Fact: 1 mm Rain = 1 Litre per m²',
    curriculumIds: ['NCERT_MATH8_CH09_MENSURATION', 'NCERT_GEO10_CH03_WATER'],
  },
  fact_unit_rate: {
    entityKey: 'fact_unit_rate',
    entityType: 'exploration_fact',
    displayName: 'Fact: Unit Rates at Village Market',
    curriculumIds: ['NCERT_MATH7_CH10_QUANTITIES'],
  },
  fact_neem_pest: {
    entityKey: 'fact_neem_pest',
    entityType: 'exploration_fact',
    displayName: 'Fact: Neem Natural Bio-Pesticides',
    curriculumIds: ['NCERT_SCI9_CH12_FOOD_RESOURCES', 'NCERT_GEO9_CH05_VEGETATION'],
  },
  fact_evaporative_cooling: {
    entityKey: 'fact_evaporative_cooling',
    entityType: 'exploration_fact',
    displayName: 'Fact: Evaporative Cooling in Clay Pots',
    curriculumIds: ['NCERT_SCI6_CH08_WATER_STATES', 'NCERT_SCI9_CH01_EVAPORATION'],
  },
  fact_pond_breeze: {
    entityKey: 'fact_pond_breeze',
    entityType: 'exploration_fact',
    displayName: 'Fact: Village Ponds & Groundwater Recharge',
    curriculumIds: ['NCERT_SCI7_CH07_HEAT', 'NCERT_GEO9_CH03_DRAINAGE', 'NCERT_GEO10_CH03_WATER'],
  },
};

/**
 * Maps every single one of the 42 question bank concepts to its exact verified NCERT curriculumId.
 */
export const QUESTION_CONCEPT_CURRICULUM_MAP: Record<string, string> = {
  // House Lab (7)
  thermal_reflection: 'NCERT_SCI7_CH07_HEAT',
  rainwater_harvest_volume: 'NCERT_MATH8_CH09_MENSURATION',
  ventilation_convection: 'NCERT_SCI7_CH07_HEAT',
  building_materials_thermal_mass: 'NCERT_SCI6_CH06_MATERIALS',
  perimeter_fencing: 'NCERT_MATH6_CH06_PERIMETER_AREA',
  roof_slope_drainage: 'NCERT_MATH6_CH02_ANGLES',
  passive_thermal_cooling: 'NCERT_SCI7_CH07_HEAT',

  // Well Lab (7)
  pulley_mechanical_advantage: 'EXT_SIMPLE_MACHINES_PULLEY',
  well_cylinder_volume: 'NCERT_MATH8_CH09_MENSURATION',
  water_table: 'NCERT_SCI6_CH11_TREASURES',
  groundwater_contamination_filtration: 'NCERT_SCI6_CH09_SEPARATION',
  water_pressure_depth: 'NCERT_SCI8_CH06_PRESSURE_WINDS',
  rainwater_recharging: 'NCERT_GEO10_CH03_WATER',
  groundwater_sanitation_buffer: 'NCERT_SCI6_CH09_SEPARATION',

  // Farm Lab (7)
  crop_water_needs: 'NCERT_GEO8_CH03_AGRICULTURE',
  farm_area: 'NCERT_MATH6_CH06_PERIMETER_AREA',
  irrigation_efficiency: 'NCERT_GEO8_CH02_SOIL_WATER_VEG',
  photosynthesis: 'NCERT_SCI7_CH10_PLANTS',
  farm_profit_loss: 'NCERT_MATH7_CH10_QUANTITIES',
  crop_rotation_nitrogen: 'NCERT_SCI8_CH02_MICROBES',
  biological_nitrogen_fixation: 'NCERT_SCI8_CH02_MICROBES',

  // Tank Lab (7)
  hydrostatic_head_elevation: 'NCERT_SCI8_CH06_PRESSURE_WINDS',
  tank_capacity_litres: 'NCERT_MATH8_CH09_MENSURATION',
  potential_energy: 'NCERT_SCI9_CH10_WORK_ENERGY',
  communicating_vessels_level: 'NCERT_PHY11_CH09_FLUIDS',
  hydrostatic_pressure_formula: 'NCERT_PHY11_CH09_FLUIDS',
  tank_overflow_waste: 'NCERT_SCI6_CH11_TREASURES',
  hydrostatic_head_work: 'NCERT_SCI9_CH10_WORK_ENERGY',

  // Solar Lab (7)
  south_facing_orientation: 'NCERT_GEO10_CH05_ENERGY',
  electrical_power_formula: 'NCERT_SCI10_CH11_ELECTRICITY',
  photovoltaic_effect: 'NCERT_PHY12_CH14_SOLAR_CELL',
  inverter_dc_to_ac: 'NCERT_SCI10_CH12_MAGNETIC_ACDC',
  solar_energy_daily_yield: 'NCERT_SCI10_CH11_ELECTRICITY',
  dust_deposition_cleaning: 'NCERT_SCI6_CH11_TREASURES',
  solar_zenith_angle: 'NCERT_MATH10_CH09_TRIG',

  // Soil Lab (7)
  ph_scale_neutral: 'NCERT_SCI10_CH02_PH_SALTS',
  acidic_soil_liming: 'NCERT_SCI7_CH02_ACIDS_BASES',
  alkaline_soil_gypsum: 'NCERT_SCI10_CH02_PH_SALTS',
  litmus_indicator_color: 'NCERT_SCI7_CH02_ACIDS_BASES',
  soil_moisture_percentage: 'NCERT_MATH8_CH11_PROPORTIONS',
  earthworm_soil_aeration: 'NCERT_SCI6_CH10_LIVING',
  chemical_liming_reaction: 'NCERT_SCI10_CH01_REACTIONS',
};

/**
 * Returns a verified curriculum entry by its unique curriculumId.
 */
export function getCurriculumById(curriculumId: string): NcertCurriculumEntry | undefined {
  return NCERT_CURRICULUM_REGISTRY[curriculumId];
}

/**
 * Returns all mapped NCERT curriculum entries for a village object, lab, tree, vehicle, or fact.
 */
export function getAllMappingsForEntity(entityKey: string): NcertCurriculumEntry[] {
  const binding = ENTITY_CURRICULUM_MAP[entityKey];
  if (!binding) return [];
  return binding.curriculumIds
    .map((id) => NCERT_CURRICULUM_REGISTRY[id])
    .filter((entry): entry is NcertCurriculumEntry => Boolean(entry));
}

/**
 * Resolves the best grade-appropriate NCERT curriculum entry for an entity given the student's class.
 * Prioritises exact grade match, then closest grade <= studentGrade, then nearest available grade.
 */
export function resolveCurriculumForEntity(
  entityKey: string,
  studentGrade: number
): NcertCurriculumEntry | null {
  const entries = getAllMappingsForEntity(entityKey);
  if (entries.length === 0) return null;

  const exact = entries.find((e) => e.grade === studentGrade);
  if (exact) return exact;

  // Prefer highest grade <= studentGrade (foundation already learned or current level)
  const lowerOrEqual = entries
    .filter((e) => e.grade <= studentGrade)
    .sort((a, b) => b.grade - a.grade);
  if (lowerOrEqual.length > 0) return lowerOrEqual[0];

  // Otherwise return lowest available grade above studentGrade
  const higher = [...entries].sort((a, b) => a.grade - b.grade);
  return higher[0];
}

/**
 * Resolves the verified NCERT curriculum entry for any question bank concept.
 */
export function resolveCurriculumForConcept(concept: string): NcertCurriculumEntry | null {
  const cid = QUESTION_CONCEPT_CURRICULUM_MAP[concept];
  if (!cid) return null;
  return NCERT_CURRICULUM_REGISTRY[cid] ?? null;
}

/**
 * Returns the canonical entityKey for any HoverEntityPayload ID
 * (e.g. 'tree_neem_1' -> 'neem', 'veh_bike_market' -> 'bicycle').
 */
export function resolveEntityKeyFromRuntimeId(
  runtimeId: string,
  category?: string
): string {
  if (ENTITY_CURRICULUM_MAP[runtimeId]) return runtimeId;

  if (category === 'tree' || runtimeId.startsWith('tree_') || runtimeId.startsWith('bush_')) {
    if (runtimeId.includes('banyan')) return 'banyan';
    if (runtimeId.includes('neem')) return 'neem';
    if (runtimeId.includes('mango')) return 'mango';
    if (runtimeId.includes('coconut')) return 'coconut';
    if (runtimeId.includes('guava')) return 'guava';
    if (runtimeId.includes('bush')) return 'bush';
  }

  if (category === 'vehicle' || runtimeId.startsWith('veh_')) {
    if (runtimeId.includes('auto')) return 'auto_rickshaw';
    if (runtimeId.includes('moto')) return 'motorcycle';
    if (runtimeId.includes('bike')) return 'bicycle';
    if (runtimeId.includes('car')) return 'car';
  }

  return runtimeId;
}

/**
 * Formats a compact, consistent one-line NCERT citation string for tooltips and badges.
 */
export function formatCompactNcertCitation(entry: NcertCurriculumEntry): string {
  const extTag = entry.mappingStatus === 'interdisciplinary_extension' ? ' (STEM Extension)' : '';
  return `Class ${entry.grade} ${entry.subject} • Ch. ${entry.chapterNumber}: ${entry.chapterTitle}${extTag}`;
}

export function normalizeSupportedGrade(grade?: number): SupportedGrade {
  const allowed: SupportedGrade[] = [6, 7, 8, 9, 10, 11, 12];
  if (grade && allowed.includes(grade as SupportedGrade)) {
    return grade as SupportedGrade;
  }
  return 7;
}
