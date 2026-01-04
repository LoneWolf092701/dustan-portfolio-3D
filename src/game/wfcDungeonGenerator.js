// src/game/wfcDungeonGenerator.js
// ============================================
// WAVE FUNCTION COLLAPSE DUNGEON GENERATOR
// Creates complex, interconnected dungeons using WFC algorithm
// ============================================

/**
 * TILE TYPES
 * Define all possible tile patterns and their connections
 */
const TILES = {
  EMPTY: 0,      // Open floor
  WALL: 1,       // Solid wall
  CORNER_NE: 2,  // Corner walls
  CORNER_NW: 3,
  CORNER_SE: 4,
  CORNER_SW: 5,
  CORRIDOR_H: 6, // Horizontal corridor
  CORRIDOR_V: 7, // Vertical corridor
  ROOM: 8,       // Room floor
  PILLAR: 9      // Decorative pillar
};

/**
 * TILE RULES
 * Define which tiles can be adjacent to each other
 * Format: { north: [allowed tiles], east: [...], south: [...], west: [...] }
 */
const TILE_RULES = {
  [TILES.EMPTY]: {
    north: [TILES.EMPTY, TILES.ROOM, TILES.CORRIDOR_V, TILES.CORRIDOR_H],
    east: [TILES.EMPTY, TILES.ROOM, TILES.CORRIDOR_H, TILES.CORRIDOR_V],
    south: [TILES.EMPTY, TILES.ROOM, TILES.CORRIDOR_V, TILES.CORRIDOR_H],
    west: [TILES.EMPTY, TILES.ROOM, TILES.CORRIDOR_H, TILES.CORRIDOR_V]
  },
  [TILES.WALL]: {
    north: [TILES.WALL, TILES.CORNER_NE, TILES.CORNER_NW],
    east: [TILES.WALL, TILES.CORNER_NE, TILES.CORNER_SE],
    south: [TILES.WALL, TILES.CORNER_SE, TILES.CORNER_SW],
    west: [TILES.WALL, TILES.CORNER_NW, TILES.CORNER_SW]
  },
  [TILES.ROOM]: {
    north: [TILES.ROOM, TILES.EMPTY, TILES.CORRIDOR_V, TILES.PILLAR],
    east: [TILES.ROOM, TILES.EMPTY, TILES.CORRIDOR_H, TILES.PILLAR],
    south: [TILES.ROOM, TILES.EMPTY, TILES.CORRIDOR_V, TILES.PILLAR],
    west: [TILES.ROOM, TILES.EMPTY, TILES.CORRIDOR_H, TILES.PILLAR]
  },
  [TILES.CORRIDOR_H]: {
    north: [TILES.WALL, TILES.EMPTY],
    east: [TILES.CORRIDOR_H, TILES.ROOM, TILES.EMPTY, TILES.CORNER_SE, TILES.CORNER_NE],
    south: [TILES.WALL, TILES.EMPTY],
    west: [TILES.CORRIDOR_H, TILES.ROOM, TILES.EMPTY, TILES.CORNER_SW, TILES.CORNER_NW]
  },
  [TILES.CORRIDOR_V]: {
    north: [TILES.CORRIDOR_V, TILES.ROOM, TILES.EMPTY, TILES.CORNER_NE, TILES.CORNER_NW],
    east: [TILES.WALL, TILES.EMPTY],
    south: [TILES.CORRIDOR_V, TILES.ROOM, TILES.EMPTY, TILES.CORNER_SE, TILES.CORNER_SW],
    west: [TILES.WALL, TILES.EMPTY]
  },
  [TILES.PILLAR]: {
    north: [TILES.ROOM, TILES.EMPTY],
    east: [TILES.ROOM, TILES.EMPTY],
    south: [TILES.ROOM, TILES.EMPTY],
    west: [TILES.ROOM, TILES.EMPTY]
  }
};

/**
 * SEEDED RANDOM NUMBER GENERATOR
 * Ensures same seed = same dungeon
 */
class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }
  
  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  nextInt(max) {
    return Math.floor(this.next() * max);
  }
  
  choice(array) {
    return array[this.nextInt(array.length)];
  }
}

/**
 * MAIN WFC DUNGEON GENERATOR
 */
export function generateWFCDungeon(width, height, seed = Date.now()) {
  const rng = new SeededRandom(seed);
  
  // Initialize grid with all possibilities
  const grid = Array(height).fill(null).map(() => 
    Array(width).fill(null).map(() => ({
      collapsed: false,
      options: Object.keys(TILES).map(k => TILES[k])
    }))
  );
  
  // Collapse cells until all are determined
  let iterations = 0;
  const maxIterations = width * height * 2;
  
  while (iterations < maxIterations) {
    // Find cell with minimum entropy (fewest options)
    let minEntropy = Infinity;
    let cellsWithMinEntropy = [];
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = grid[y][x];
        if (!cell.collapsed && cell.options.length > 0) {
          if (cell.options.length < minEntropy) {
            minEntropy = cell.options.length;
            cellsWithMinEntropy = [[x, y]];
          } else if (cell.options.length === minEntropy) {
            cellsWithMinEntropy.push([x, y]);
          }
        }
      }
    }
    
    // If no cells left to collapse, we're done
    if (cellsWithMinEntropy.length === 0) break;
    
    // Choose random cell from minimum entropy cells
    const [cx, cy] = rng.choice(cellsWithMinEntropy);
    const cell = grid[cy][cx];
    
    // Collapse cell to random valid option
    cell.collapsed = true;
    cell.value = rng.choice(cell.options);
    cell.options = [cell.value];
    
    // Propagate constraints to neighbors
    propagateConstraints(grid, cx, cy, width, height);
    
    iterations++;
  }
  
  // Convert to simple tile grid
  const tileGrid = grid.map(row => 
    row.map(cell => cell.collapsed ? cell.value : TILES.EMPTY)
  );
  
  // Post-process: Add walls around empty spaces
  const finalGrid = addWalls(tileGrid, width, height);
  
  // Find valid spawn points (open floor tiles)
  const spawnPoints = [];
  for (let y = 5; y < height - 5; y++) {
    for (let x = 5; x < width - 5; x++) {
      if (isWalkable(finalGrid, x, y)) {
        spawnPoints.push({ x, y });
      }
    }
  }
  
  // Generate portal positions (far from each other)
  const portalPositions = generatePortalPositions(finalGrid, spawnPoints, rng, 4);
  
  return {
    grid: finalGrid,
    width,
    height,
    seed,
    spawnPoint: spawnPoints[rng.nextInt(spawnPoints.length)] || { x: width / 2, y: height / 2 },
    portalPositions,
    walkableCount: spawnPoints.length
  };
}

/**
 * PROPAGATE CONSTRAINTS
 * Update neighboring cells based on collapsed cell
 */
function propagateConstraints(grid, x, y, width, height) {
  const stack = [[x, y]];
  
  while (stack.length > 0) {
    const [cx, cy] = stack.pop();
    const currentCell = grid[cy][cx];
    
    if (!currentCell.collapsed) continue;
    
    const currentValue = currentCell.value;
    const rules = TILE_RULES[currentValue] || TILE_RULES[TILES.EMPTY];
    
    // Check all neighbors
    const neighbors = [
      { dx: 0, dy: -1, dir: 'north' },
      { dx: 1, dy: 0, dir: 'east' },
      { dx: 0, dy: 1, dir: 'south' },
      { dx: -1, dy: 0, dir: 'west' }
    ];
    
    for (const { dx, dy, dir } of neighbors) {
      const nx = cx + dx;
      const ny = cy + dy;
      
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      
      const neighbor = grid[ny][nx];
      if (neighbor.collapsed) continue;
      
      // Filter neighbor's options based on current cell's rules
      const allowedTiles = rules[dir] || [];
      const oldLength = neighbor.options.length;
      
      neighbor.options = neighbor.options.filter(opt => allowedTiles.includes(opt));
      
      // If options changed, propagate to this neighbor's neighbors
      if (neighbor.options.length !== oldLength && neighbor.options.length > 0) {
        stack.push([nx, ny]);
      }
      
      // If no options left, reset to some default
      if (neighbor.options.length === 0) {
        neighbor.options = [TILES.EMPTY];
      }
    }
  }
}

/**
 * ADD WALLS AROUND WALKABLE AREAS
 */
function addWalls(grid, width, height) {
  const newGrid = grid.map(row => [...row]);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tile = grid[y][x];
      
      // If tile is walkable, check if it needs walls around it
      if (isWalkableTile(tile)) {
        // Check all 8 neighbors
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            
            const nx = x + dx;
            const ny = y + dy;
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              // If neighbor is undefined/collapsed to nothing, make it a wall
              if (!isWalkableTile(grid[ny][nx]) && grid[ny][nx] === TILES.EMPTY) {
                newGrid[ny][nx] = TILES.WALL;
              }
            }
          }
        }
      }
    }
  }
  
  return newGrid;
}

/**
 * CHECK IF TILE IS WALKABLE
 */
function isWalkableTile(tile) {
  return tile === TILES.EMPTY || 
         tile === TILES.ROOM || 
         tile === TILES.CORRIDOR_H || 
         tile === TILES.CORRIDOR_V;
}

function isWalkable(grid, x, y) {
  if (y < 0 || y >= grid.length || x < 0 || x >= grid[0].length) {
    return false;
  }
  return isWalkableTile(grid[y][x]);
}

/**
 * GENERATE PORTAL POSITIONS
 * Place portals far from each other in walkable areas
 */
function generatePortalPositions(grid, spawnPoints, rng, count) {
  if (spawnPoints.length < count) {
    console.warn('Not enough spawn points for all portals');
    return spawnPoints.slice(0, count);
  }
  
  const portals = [];
  const minDistance = 15; // Minimum distance between portals
  
  // Pick first portal randomly
  portals.push(rng.choice(spawnPoints));
  
  // Pick remaining portals ensuring they're far apart
  while (portals.length < count && spawnPoints.length > 0) {
    let bestPoint = null;
    let bestMinDist = 0;
    
    // Try 20 random points and pick the one farthest from existing portals
    for (let i = 0; i < 20; i++) {
      const candidate = rng.choice(spawnPoints);
      
      // Calculate minimum distance to existing portals
      let minDist = Infinity;
      for (const portal of portals) {
        const dist = Math.sqrt(
          Math.pow(candidate.x - portal.x, 2) + 
          Math.pow(candidate.y - portal.y, 2)
        );
        minDist = Math.min(minDist, dist);
      }
      
      if (minDist > bestMinDist) {
        bestMinDist = minDist;
        bestPoint = candidate;
      }
    }
    
    if (bestPoint && bestMinDist >= minDistance / 2) {
      portals.push(bestPoint);
    } else {
      // If can't find good point, just add any point
      portals.push(rng.choice(spawnPoints));
    }
  }
  
  return portals;
}

/**
 * GET TILE HEIGHT FOR RENDERING
 */
export function getTileHeight(tile) {
  switch (tile) {
    case TILES.WALL:
      return 3;
    case TILES.PILLAR:
      return 3.5;
    case TILES.CORNER_NE:
    case TILES.CORNER_NW:
    case TILES.CORNER_SE:
    case TILES.CORNER_SW:
      return 4;
    default:
      return 0.1;
  }
}

/**
 * GET TILE COLOR
 */
export function getTileColor(tile) {
  switch (tile) {
    case TILES.WALL:
      return '#2a2a2a';
    case TILES.ROOM:
      return '#1a1a1a';
    case TILES.CORRIDOR_H:
    case TILES.CORRIDOR_V:
      return '#151515';
    case TILES.PILLAR:
      return '#3a3a3a';
    case TILES.CORNER_NE:
    case TILES.CORNER_NW:
    case TILES.CORNER_SE:
    case TILES.CORNER_SW:
      return '#333333';
    default:
      return '#0a0a0a';
  }
}

/**
 * EXPORT FOR COLLISION DETECTION
 */
export { TILES, isWalkable };