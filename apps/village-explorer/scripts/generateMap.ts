import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAP_WIDTH = 40;
const MAP_HEIGHT = 30;
const TILE_SIZE = 32;

// Tile indices (1-based for Tiled)
// 1: Grass, 2: Earth Path, 3: Water, 4: Farmland furrow, 5: Stone Wall, 6: Roof, 7: Tree, 8: Wooden Fence
const groundData: number[] = new Array(MAP_WIDTH * MAP_HEIGHT).fill(1);
const obstacleData: number[] = new Array(MAP_WIDTH * MAP_HEIGHT).fill(0);

// Helper to set tile
function setTile(data: number[], x: number, y: number, tileId: number) {
  if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
    data[y * MAP_WIDTH + x] = tileId;
  }
}

// 1. Create Village Boundary fences / outer trees
for (let x = 0; x < MAP_WIDTH; x++) {
  setTile(obstacleData, x, 0, 7); // Trees top
  setTile(obstacleData, x, MAP_HEIGHT - 1, 7); // Trees bottom
}
for (let y = 0; y < MAP_HEIGHT; y++) {
  setTile(obstacleData, 0, y, 7); // Trees left
  setTile(obstacleData, MAP_WIDTH - 1, y, 7); // Trees right
}

// 2. Main Earthen Pathways (Crossroads through the village)
// Horizontal main road (y = 14 to 15)
for (let x = 1; x < MAP_WIDTH - 1; x++) {
  setTile(groundData, x, 14, 2);
  setTile(groundData, x, 15, 2);
}
// Vertical main road (x = 19 to 20)
for (let y = 1; y < MAP_HEIGHT - 1; y++) {
  setTile(groundData, 19, y, 2);
  setTile(groundData, 20, y, 2);
}

// Pathway to North-West House (x: 5-8, y: 5-8)
for (let y = 8; y <= 14; y++) {
  setTile(groundData, 7, y, 2);
}
for (let x = 5; x <= 7; x++) {
  setTile(groundData, x, 8, 2);
}

// Pathway to North-East Farm (x: 26-34, y: 4-10)
for (let x = 20; x <= 26; x++) {
  setTile(groundData, x, 7, 2);
}

// Pathway to Central Well (x: 17-18, y: 9-10)
for (let y = 10; y <= 14; y++) {
  setTile(groundData, 18, y, 2);
}

// Pathway to South-West Water Tank (x: 6-8, y: 20-22)
for (let y = 15; y <= 21; y++) {
  setTile(groundData, 7, y, 2);
}

// Pathway to South Solar Array (x: 17-20, y: 22-24)
for (let y = 15; y <= 22; y++) {
  setTile(groundData, 19, y, 2);
}

// Pathway to South-East Soil Lab (x: 28-32, y: 20-23)
for (let y = 15; y <= 21; y++) {
  setTile(groundData, 29, y, 2);
}

// 3. Water Pond in the East (x: 33-38, y: 12-17)
for (let x = 33; x <= 38; x++) {
  for (let y = 12; y <= 17; y++) {
    setTile(groundData, x, y, 3);
    setTile(obstacleData, x, y, 3); // Water is impassable
  }
}

// 4. Farmland Furrows (North-East: x: 26-34, y: 4-10)
for (let x = 26; x <= 34; x++) {
  for (let y = 4; y <= 10; y++) {
    setTile(groundData, x, y, 4); // Soil
  }
}

// 5. Place Building Obstacles
// House (x: 5-9, y: 4-7)
for (let x = 5; x <= 9; x++) {
  for (let y = 4; y <= 7; y++) {
    setTile(obstacleData, x, y, 5); // House walls
  }
}
// Clear house entrance at (7, 7)
setTile(obstacleData, 7, 7, 0);

// Well (x: 17-18, y: 8-9)
setTile(obstacleData, 17, 8, 5);
setTile(obstacleData, 18, 8, 5);
setTile(obstacleData, 17, 9, 5);
setTile(obstacleData, 18, 9, 5);

// Water Tank Tower (x: 6-8, y: 20-22)
setTile(obstacleData, 6, 20, 5);
setTile(obstacleData, 8, 20, 5);
setTile(obstacleData, 6, 22, 5);
setTile(obstacleData, 8, 22, 5);

// Solar Array (x: 16-21, y: 23-25)
for (let x = 16; x <= 21; x++) {
  for (let y = 23; y <= 25; y++) {
    setTile(obstacleData, x, y, 5);
  }
}

// Soil Lab Hut (x: 28-32, y: 20-23)
for (let x = 28; x <= 32; x++) {
  for (let y = 20; y <= 23; y++) {
    setTile(obstacleData, x, y, 5);
  }
}
setTile(obstacleData, 30, 23, 0); // Door

// 6. Define Zones (Tiled Object Layer)
const zones = [
  {
    id: 1,
    name: "house",
    type: "zone",
    x: 5 * TILE_SIZE,
    y: 4 * TILE_SIZE,
    width: 5 * TILE_SIZE,
    height: 4 * TILE_SIZE,
    properties: [{ name: "zoneId", type: "string", value: "house" }, { name: "title", type: "string", value: "Village House Lab" }]
  },
  {
    id: 2,
    name: "well",
    type: "zone",
    x: 16 * TILE_SIZE,
    y: 7 * TILE_SIZE,
    width: 4 * TILE_SIZE,
    height: 4 * TILE_SIZE,
    properties: [{ name: "zoneId", type: "string", value: "well" }, { name: "title", type: "string", value: "Community Well Lab" }]
  },
  {
    id: 3,
    name: "farm",
    type: "zone",
    x: 25 * TILE_SIZE,
    y: 3 * TILE_SIZE,
    width: 10 * TILE_SIZE,
    height: 8 * TILE_SIZE,
    properties: [{ name: "zoneId", type: "string", value: "farm" }, { name: "title", type: "string", value: "Agricultural Farm Lab" }]
  },
  {
    id: 4,
    name: "tank",
    type: "zone",
    x: 5 * TILE_SIZE,
    y: 19 * TILE_SIZE,
    width: 4 * TILE_SIZE,
    height: 4 * TILE_SIZE,
    properties: [{ name: "zoneId", type: "string", value: "tank" }, { name: "title", type: "string", value: "Overhead Water Tank Lab" }]
  },
  {
    id: 5,
    name: "solar",
    type: "zone",
    x: 15 * TILE_SIZE,
    y: 22 * TILE_SIZE,
    width: 7 * TILE_SIZE,
    height: 4 * TILE_SIZE,
    properties: [{ name: "zoneId", type: "string", value: "solar" }, { name: "title", type: "string", value: "Solar Energy Lab" }]
  },
  {
    id: 6,
    name: "soil",
    type: "zone",
    x: 27 * TILE_SIZE,
    y: 19 * TILE_SIZE,
    width: 6 * TILE_SIZE,
    height: 5 * TILE_SIZE,
    properties: [{ name: "zoneId", type: "string", value: "soil" }, { name: "title", type: "string", value: "Soil Chemistry Lab" }]
  }
];

const mapOutput = {
  compressionlevel: -1,
  height: MAP_HEIGHT,
  width: MAP_WIDTH,
  infinite: false,
  orientation: "orthogonal",
  renderorder: "right-down",
  tileheight: TILE_SIZE,
  tilewidth: TILE_SIZE,
  type: "map",
  version: "1.10",
  tilesets: [
    {
      firstgid: 1,
      name: "village_tiles",
      tileheight: TILE_SIZE,
      tilewidth: TILE_SIZE,
      tilecount: 8,
      columns: 8,
      image: "assets/tiles/tileset.png",
      imagewidth: 256,
      imageheight: 32
    }
  ],
  layers: [
    {
      data: groundData,
      height: MAP_HEIGHT,
      width: MAP_WIDTH,
      id: 1,
      name: "Ground",
      opacity: 1,
      type: "tilelayer",
      visible: true,
      x: 0,
      y: 0
    },
    {
      data: obstacleData,
      height: MAP_HEIGHT,
      width: MAP_WIDTH,
      id: 2,
      name: "Obstacles",
      opacity: 1,
      type: "tilelayer",
      visible: true,
      x: 0,
      y: 0
    },
    {
      draworder: "topdown",
      id: 3,
      name: "zones",
      objects: zones,
      opacity: 1,
      type: "objectgroup",
      visible: true,
      x: 0,
      y: 0
    }
  ]
};

const outputDir = path.resolve(__dirname, '../public/maps');
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'village.json'), JSON.stringify(mapOutput, null, 2));
console.log('Successfully generated village.json at public/maps/village.json');
