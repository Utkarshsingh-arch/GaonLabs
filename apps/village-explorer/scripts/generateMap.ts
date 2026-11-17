import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const MAP_WIDTH = 56;
export const MAP_HEIGHT = 42;
export const TILE_SIZE = 32;

// Tile IDs (1-based for Tiled JSON):
// 1: Grass Base, 2: Grass Tufts, 3: Grass Wildflowers, 4: Grass Sunlit
// 5: Dirt Road Center, 6: Dirt Road Horiz, 7: Dirt Road Vert, 8: Dirt Road Junction
// 9: Cobblestone Plaza, 10: Deep Water, 11: Water Lily Pads, 12: Water Bank
// 13: Farm Sprouts, 14: Farm Golden Crop, 15: Farm Leafy Veg, 16: Farm Irrigation
// 17: Garden Flowerbed, 18: Stone Courtyard, 19: Fence Horiz, 20: Fence Vert
// 21: Invisible Collision Blocker, 22: Stepping Stones, 23: Wooden Bridge, 24: Sand Bank

const groundData: number[] = new Array(MAP_WIDTH * MAP_HEIGHT).fill(1);
const obstacleData: number[] = new Array(MAP_WIDTH * MAP_HEIGHT).fill(0);

// Deterministic PRNG for organic grass variation
let seed = 4219;
function rand(): number {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
}

function setTile(data: number[], x: number, y: number, tileId: number) {
  if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
    data[y * MAP_WIDTH + x] = tileId;
  }
}

function getTile(data: number[], x: number, y: number): number {
  if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
    return data[y * MAP_WIDTH + x];
  }
  return 0;
}

function fillRect(data: number[], x1: number, y1: number, x2: number, y2: number, tileId: number) {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      setTile(data, x, y, tileId);
    }
  }
}

// 1. Organic Grass Meadow Floor
for (let y = 0; y < MAP_HEIGHT; y++) {
  for (let x = 0; x < MAP_WIDTH; x++) {
    const r = rand();
    if (r < 0.56) setTile(groundData, x, y, 1);
    else if (r < 0.76) setTile(groundData, x, y, 2);
    else if (r < 0.87) setTile(groundData, x, y, 3);
    else setTile(groundData, x, y, 4);
  }
}

// 2. Invisible Perimeter Border Collision (row 0, row H-1, col 0, col W-1)
for (let x = 0; x < MAP_WIDTH; x++) {
  setTile(obstacleData, x, 0, 21);
  setTile(obstacleData, x, MAP_HEIGHT - 1, 21);
}
for (let y = 0; y < MAP_HEIGHT; y++) {
  setTile(obstacleData, 0, y, 21);
  setTile(obstacleData, MAP_WIDTH - 1, y, 21);
}

// 3. Connected Village Road Network
// Helper to paint horizontal road (2 tiles thick)
function paintHorizRoad(x1: number, x2: number, yTop: number) {
  for (let x = x1; x <= x2; x++) {
    setTile(groundData, x, yTop, 6);
    setTile(groundData, x, yTop + 1, 5);
  }
}

// Helper to paint vertical road (2 tiles thick)
function paintVertRoad(y1: number, y2: number, xLeft: number) {
  for (let y = y1; y <= y2; y++) {
    setTile(groundData, xLeft, y, 7);
    setTile(groundData, xLeft + 1, y, 5);
  }
}

// Main East-West Avenue (y = 20..21)
paintHorizRoad(2, 53, 20);
// Main North-South Avenue (x = 27..28)
paintVertRoad(2, 39, 27);
// Northern Learning Loop (y = 9..10, x = 5..43)
paintHorizRoad(5, 43, 9);
// Southern Learning Loop (y = 31..32, x = 5..43)
paintHorizRoad(5, 43, 31);
// Western Connector Road (x = 11..12, y = 9..32)
paintVertRoad(9, 32, 11);
// Eastern Connector Road (x = 41..42, y = 9..32)
paintVertRoad(9, 32, 41);

// Road Intersections (smooth gravel junctions)
const intersections = [
  [11, 9], [27, 9], [41, 9],
  [11, 20], [41, 20],
  [11, 31], [27, 31], [41, 31],
];
for (const [ix, iy] of intersections) {
  fillRect(groundData, ix, iy, ix + 1, iy + 1, 8);
}

// 4. Paved Village Cobblestone Plaza (Central Chowk) & Market Square
fillRect(groundData, 25, 18, 30, 23, 9);
// Market Square Cobblestone (in front of Math Market)
fillRect(groundData, 32, 16, 39, 19, 9);
// Well Stone Courtyard
fillRect(groundData, 21, 12, 25, 16, 18);
// Connecting stepping-stone walkways from buildings to roads
const walkways: Array<[number, number]> = [
  // House to Northern Loop
  [7, 8], [8, 8],
  // Math House to Northern Loop
  [17, 8],
  // Biology House to Northern Loop
  [31, 8],
  // Farm path
  [37, 8], [38, 8],
  // Engineering Workshop to E-W Ave
  [7, 18], [7, 19],
  // Cottage B to E-W Ave
  [16, 17], [16, 18], [16, 19],
  // Well courtyard to N-S Ave
  [26, 14], [26, 15],
  // Tank to Western Connector
  [9, 27], [10, 27],
  // Physics House to E-W Ave & Southern Loop
  [17, 22], [17, 23], [17, 28], [17, 29], [17, 30],
  // Soil Lab to Eastern Connector & Southern Loop
  [36, 28], [36, 29], [36, 30], [39, 26], [40, 26],
  // Cottage A to Southern Loop
  [12, 33], [13, 33],
  // Solar Lab to Southern Loop
  [22, 33], [23, 33],
  // Chemistry Lab to Southern Loop
  [33, 33], [34, 33],
  // Weather Station to Eastern Connector
  [43, 32], [44, 32], [45, 32],
  // Cottage C to Eastern Connector
  [43, 28], [44, 28],
];
for (const [wx, wy] of walkways) {
  setTile(groundData, wx, wy, 22);
}

// 5. Village Water Pond & Flowing Stream with Wooden Bridge
// Sandy banks around northern & southern pond
fillRect(groundData, 45, 12, 53, 19, 24);
fillRect(groundData, 45, 22, 53, 26, 24);
// Northern pond
fillRect(groundData, 46, 13, 52, 18, 10);
for (let x = 46; x <= 52; x++) setTile(groundData, x, 13, 12);
setTile(groundData, 48, 15, 11); // Lily pads
setTile(groundData, 50, 17, 11);
setTile(groundData, 47, 17, 11);

// Southern pond
fillRect(groundData, 46, 22, 52, 25, 10);
for (let x = 46; x <= 52; x++) setTile(groundData, x, 22, 12);
setTile(groundData, 49, 24, 11);
setTile(groundData, 51, 23, 11);

// Connecting stream under road
setTile(groundData, 47, 19, 10);
setTile(groundData, 48, 19, 10);
setTile(groundData, 47, 22, 10);
setTile(groundData, 48, 22, 10);
// Wooden bridge at E-W Avenue (walkable!)
setTile(groundData, 47, 20, 23);
setTile(groundData, 48, 20, 23);
setTile(groundData, 47, 21, 23);
setTile(groundData, 48, 21, 23);

// Mark deep water impassable (excluding wooden bridge!)
for (let y = 13; y <= 25; y++) {
  for (let x = 46; x <= 52; x++) {
    const g = getTile(groundData, x, y);
    if (g === 10 || g === 11 || g === 12) {
      setTile(obstacleData, x, y, 21);
    }
  }
}

// 6. Agricultural Farm Fields (NE Quadrant: varied crops + irrigation trench)
// Furrows & Sprouts
fillRect(groundData, 40, 3, 44, 5, 13);
// Irrigation Channel
fillRect(groundData, 40, 6, 49, 6, 16);
// Golden Ragi/Wheat
fillRect(groundData, 45, 3, 49, 5, 14);
// Leafy Vegetables
fillRect(groundData, 40, 7, 49, 8, 15);
// Farm Courtyard around shed
fillRect(groundData, 35, 3, 39, 7, 18);

// 7. Village Gardens & Flowerbeds
const flowerbeds: Array<[number, number]> = [
  [4, 7], [10, 7], // Village House garden
  [29, 8], [33, 8], [34, 6], [34, 7], // Biology House botanical garden
  [24, 18], [31, 18], [24, 23], [31, 23], // Central Plaza planters
  [14, 27], [20, 27], // Physics House garden
  [30, 36], [36, 36], // Chemistry House garden
  [14, 16], [19, 16], // Cottage B garden
];
for (const [fx, fy] of flowerbeds) {
  setTile(groundData, fx, fy, 17);
}

// Soil Chemistry Outdoor Sample Courtyard
fillRect(groundData, 33, 24, 39, 28, 18);
setTile(groundData, 39, 25, 13);
setTile(groundData, 39, 27, 15);

// 8. Decorative Wooden Fences around Farm & Pasture edges
for (let x = 35; x <= 49; x++) {
  setTile(groundData, x, 2, 19);
  setTile(obstacleData, x, 2, 21);
}
for (let y = 3; y <= 8; y++) {
  setTile(groundData, 50, y, 20);
  setTile(obstacleData, 50, y, 21);
}
// Fence along village south orchard edge
for (let x = 4; x <= 9; x++) {
  setTile(groundData, x, 34, 19);
  setTile(obstacleData, x, 34, 21);
}

// 9. Building Collision Footprints (Lower 2/3 of each building so avatar walks behind roofs!)
// Helper to place solid collision footprint for 2.5D depth feel
function placeBuildingFootprint(x1: number, y1: number, x2: number, y2: number, doorX?: number) {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      if (doorX !== undefined && x === doorX && y === y2) continue; // Walkable doorstep
      setTile(obstacleData, x, y, 21);
    }
  }
}

// 6 Core Labs footprints:
placeBuildingFootprint(5, 5, 9, 7, 7);       // house (Village House Lab)
placeBuildingFootprint(22, 13, 24, 15);      // well (Community Well Lab)
placeBuildingFootprint(36, 4, 39, 5);        // farm shed (Agricultural Farm Lab)
placeBuildingFootprint(5, 26, 8, 28);        // tank (Overhead Water Tank Lab)
placeBuildingFootprint(20, 35, 24, 37);      // solar (Solar Energy Lab)
placeBuildingFootprint(34, 25, 38, 27, 36);  // soil (Soil Chemistry Lab)

// 7 New Interactive Learning Houses footprints:
placeBuildingFootprint(15, 5, 19, 7, 17);    // math_house
placeBuildingFootprint(29, 5, 33, 7, 31);    // biology_house
placeBuildingFootprint(5, 15, 9, 17, 7);     // engineering_workshop
placeBuildingFootprint(33, 14, 38, 16, 35);  // math_market
placeBuildingFootprint(15, 25, 19, 27, 17);  // physics_house
placeBuildingFootprint(31, 35, 35, 37, 33);  // chemistry_house
placeBuildingFootprint(44, 34, 47, 36, 45);  // weather_station

// 3 Village Residential Cottages footprints:
placeBuildingFootprint(11, 35, 14, 37, 12);  // cottage_a
placeBuildingFootprint(15, 14, 18, 16, 16);  // cottage_b
placeBuildingFootprint(45, 27, 48, 29, 46);  // cottage_c

// 10. Core 6 Living Lab Zones (Tiled Object Layer - preserves exact zoneIds!)
const zones = [
  {
    id: 1,
    name: 'house',
    type: 'zone',
    x: 4 * TILE_SIZE,
    y: 4 * TILE_SIZE,
    width: 7 * TILE_SIZE,
    height: 5 * TILE_SIZE,
    properties: [
      { name: 'zoneId', type: 'string', value: 'house' },
      { name: 'title', type: 'string', value: 'Village House Lab' },
    ],
  },
  {
    id: 2,
    name: 'well',
    type: 'zone',
    x: 21 * TILE_SIZE,
    y: 12 * TILE_SIZE,
    width: 5 * TILE_SIZE,
    height: 5 * TILE_SIZE,
    properties: [
      { name: 'zoneId', type: 'string', value: 'well' },
      { name: 'title', type: 'string', value: 'Community Well Lab' },
    ],
  },
  {
    id: 3,
    name: 'farm',
    type: 'zone',
    x: 35 * TILE_SIZE,
    y: 3 * TILE_SIZE,
    width: 15 * TILE_SIZE,
    height: 6 * TILE_SIZE,
    properties: [
      { name: 'zoneId', type: 'string', value: 'farm' },
      { name: 'title', type: 'string', value: 'Agricultural Farm Lab' },
    ],
  },
  {
    id: 4,
    name: 'tank',
    type: 'zone',
    x: 4 * TILE_SIZE,
    y: 24 * TILE_SIZE,
    width: 6 * TILE_SIZE,
    height: 6 * TILE_SIZE,
    properties: [
      { name: 'zoneId', type: 'string', value: 'tank' },
      { name: 'title', type: 'string', value: 'Overhead Water Tank Lab' },
    ],
  },
  {
    id: 5,
    name: 'solar',
    type: 'zone',
    x: 19 * TILE_SIZE,
    y: 33 * TILE_SIZE,
    width: 7 * TILE_SIZE,
    height: 6 * TILE_SIZE,
    properties: [
      { name: 'zoneId', type: 'string', value: 'solar' },
      { name: 'title', type: 'string', value: 'Solar Energy Lab' },
    ],
  },
  {
    id: 6,
    name: 'soil',
    type: 'zone',
    x: 33 * TILE_SIZE,
    y: 24 * TILE_SIZE,
    width: 7 * TILE_SIZE,
    height: 6 * TILE_SIZE,
    properties: [
      { name: 'zoneId', type: 'string', value: 'soil' },
      { name: 'title', type: 'string', value: 'Soil Chemistry Lab' },
    ],
  },
];

const mapOutput = {
  compressionlevel: -1,
  height: MAP_HEIGHT,
  width: MAP_WIDTH,
  infinite: false,
  orientation: 'orthogonal',
  renderorder: 'right-down',
  tileheight: TILE_SIZE,
  tilewidth: TILE_SIZE,
  type: 'map',
  version: '1.10',
  tilesets: [
    {
      firstgid: 1,
      name: 'village_tiles',
      tileheight: TILE_SIZE,
      tilewidth: TILE_SIZE,
      tilecount: 24,
      columns: 24,
      image: 'assets/tiles/tileset.png',
      imagewidth: 24 * TILE_SIZE,
      imageheight: TILE_SIZE,
    },
  ],
  layers: [
    {
      data: groundData,
      height: MAP_HEIGHT,
      width: MAP_WIDTH,
      id: 1,
      name: 'Ground',
      opacity: 1,
      type: 'tilelayer',
      visible: true,
      x: 0,
      y: 0,
    },
    {
      data: obstacleData,
      height: MAP_HEIGHT,
      width: MAP_WIDTH,
      id: 2,
      name: 'Obstacles',
      opacity: 1,
      type: 'tilelayer',
      visible: true,
      x: 0,
      y: 0,
    },
    {
      draworder: 'topdown',
      id: 3,
      name: 'zones',
      objects: zones,
      opacity: 1,
      type: 'objectgroup',
      visible: true,
      x: 0,
      y: 0,
    },
  ],
};

// Write to BOTH src/game/data/village.json (bundled) and public/maps/village.json
const srcDataDir = path.resolve(__dirname, '../src/game/data');
fs.mkdirSync(srcDataDir, { recursive: true });
fs.writeFileSync(path.join(srcDataDir, 'village.json'), JSON.stringify(mapOutput));

const publicDir = path.resolve(__dirname, '../public/maps');
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'village.json'), JSON.stringify(mapOutput));

console.log(`Generated ${MAP_WIDTH}x${MAP_HEIGHT} village.json in src/game/data & public/maps`);
