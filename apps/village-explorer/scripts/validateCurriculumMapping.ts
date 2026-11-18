import {
  NCERT_CURRICULUM_REGISTRY,
} from '../src/learning/curriculum/ncertRegistry';
import {
  ENTITY_CURRICULUM_MAP,
  QUESTION_CONCEPT_CURRICULUM_MAP,
  getAllMappingsForEntity,
  resolveCurriculumForConcept,
} from '../src/learning/curriculum/curriculumMapper';
import {
  VILLAGE_BUILDINGS,
  TREE_INFO,
  VEHICLE_INFO,
  EXPLORATION_FACTS,
} from '../src/game/data/villageEntities';
import { QUESTION_BANK } from '../src/learning/questionBank';

let errors = 0;

function fail(msg: string) {
  console.error(`❌ [CURRICULUM ERROR] ${msg}`);
  errors++;
}

console.log('📚 Auditing GaonLab NCERT Curriculum Mapping Coverage...\n');

// 1. Validate Registry Integrity
const entries = Object.values(NCERT_CURRICULUM_REGISTRY);
const seenIds = new Set<string>();
let verifiedCount = 0;
let extensionCount = 0;

for (const e of entries) {
  if (seenIds.has(e.curriculumId)) {
    fail(`Duplicate curriculumId: ${e.curriculumId}`);
  }
  seenIds.add(e.curriculumId);

  if (e.mappingStatus === 'verified') verifiedCount++;
  else extensionCount++;

  if (!e.source.url.startsWith('https://ncert.nic.in/')) {
    fail(`Non-official NCERT source URL for ${e.curriculumId}: ${e.source.url}`);
  }

  // Enforce integrated Science for Classes 6-10 (never Physics/Chemistry/Biology as separate textbooks for 6-10)
  if (e.grade <= 10 && ['Physics', 'Chemistry', 'Biology'].includes(e.subject)) {
    fail(`Class ${e.grade} entry ${e.curriculumId} must use integrated 'Science', not separate '${e.subject}'`);
  }
}

// 2. Validate All Entity Bindings Point to Real Registry Entries
for (const binding of Object.values(ENTITY_CURRICULUM_MAP)) {
  if (binding.curriculumIds.length === 0) {
    fail(`Entity '${binding.entityKey}' has zero curriculumIds`);
  }
  for (const cid of binding.curriculumIds) {
    if (!NCERT_CURRICULUM_REGISTRY[cid]) {
      fail(`Entity '${binding.entityKey}' references unknown curriculumId '${cid}'`);
    }
  }
}

// 3. Audit All Buildings (6 Core Labs + 7 Learning Houses + 3 Cottages)
for (const b of VILLAGE_BUILDINGS) {
  if (getAllMappingsForEntity(b.id).length === 0) {
    fail(`Building '${b.id}' (${b.name}) is unmapped!`);
  }
}

// 4. Audit All Trees & Vegetation
for (const variety of Object.keys(TREE_INFO)) {
  if (getAllMappingsForEntity(variety).length === 0) {
    fail(`Tree variety '${variety}' is unmapped!`);
  }
}

// 5. Audit All Vehicles
for (const vType of Object.keys(VEHICLE_INFO)) {
  if (getAllMappingsForEntity(vType).length === 0) {
    fail(`Vehicle type '${vType}' is unmapped!`);
  }
}

// 6. Audit All 16 Exploration Facts
for (const fact of EXPLORATION_FACTS) {
  if (getAllMappingsForEntity(fact.id).length === 0) {
    fail(`Exploration fact '${fact.id}' is unmapped!`);
  }
}

// 7. Audit All 42 Question Bank Questions
for (const q of QUESTION_BANK) {
  const mapped = resolveCurriculumForConcept(q.concept);
  if (!mapped) {
    fail(`Question '${q.id}' (concept: '${q.concept}') is unmapped!`);
  }
}

// Check for unused/dangling concept keys pointing to invalid curriculumIds
for (const [concept, cid] of Object.entries(QUESTION_CONCEPT_CURRICULUM_MAP)) {
  if (!NCERT_CURRICULUM_REGISTRY[cid]) {
    fail(`Question concept '${concept}' references unknown curriculumId '${cid}'`);
  }
}

console.log(`📊 Registry Entries: ${entries.length} total (${verifiedCount} verified NCERT, ${extensionCount} interdisciplinary STEM extensions)`);
console.log(`🏠 Mapped Buildings: ${VILLAGE_BUILDINGS.length} (6 Core Labs + 7 Learning Houses + 3 Cottages)`);
console.log(`🌳 Mapped Tree Varieties: ${Object.keys(TREE_INFO).length}`);
console.log(`🚗 Mapped Vehicle Types: ${Object.keys(VEHICLE_INFO).length}`);
console.log(`💡 Mapped Exploration Facts: ${EXPLORATION_FACTS.length}`);
console.log(`📝 Mapped Question Bank Items: ${QUESTION_BANK.length}`);
console.log(`🌍 Mapped Environmental/Terrain Features: ${Object.values(ENTITY_CURRICULUM_MAP).filter((e) => e.entityType === 'environment').length}\n`);

if (errors > 0) {
  console.error(`❌ Audit FAILED with ${errors} error(s).`);
  process.exit(1);
}

console.log('✅ 100% NCERT CURRICULUM COVERAGE VERIFIED! 0 UNMAPPED ITEMS, 0 ERRORS.');
