// src/game/dungeonGenerator.js
// ============================================
// PROCEDURAL DUNGEON GENERATOR
// Generates random dungeon layouts using BSP and room-corridor algorithm
// ============================================

/**
 * MAIN DUNGEON GENERATION FUNCTION
 * Creates a procedural dungeon with rooms and corridors
 * 
 * @param {number} width - Width of the dungeon grid
 * @param {number} height - Height of the dungeon grid
 * @param {number} complexity - How complex the dungeon is (0.1 - 0.5)
 * @returns {Object} { grid, rooms, decorations }
 */
export function generateDungeon(width, height, complexity = 0.25) {
  // Initialize grid with all walls (1 = wall, 0 = floor)
  const grid = Array(height)
    .fill(null)
    .map(() => Array(width).fill(1));
  
  const rooms = []; // Store room center positions
  const decorations = []; // Store positions for props (torches, etc.)

  /**
   * CREATE A RECTANGULAR ROOM
   * Carves out a room in the grid by setting cells to 0 (floor)
   */
  function createRoom(x, y, w, h) {
    // Add padding to avoid rooms touching edges
    const paddedX = Math.max(1, x);
    const paddedY = Math.max(1, y);
    const paddedW = Math.min(w, width - paddedX - 1);
    const paddedH = Math.min(h, height - paddedY - 1);

    // Carve out the room
    for (let i = paddedY; i < paddedY + paddedH; i++) {
      for (let j = paddedX; j < paddedX + paddedW; j++) {
        if (i >= 0 && i < height && j >= 0 && j < width) {
          grid[i][j] = 0; // Set to floor
        }
      }
    }

    // Calculate room center for later connections
    const centerX = paddedX + Math.floor(paddedW / 2);
    const centerY = paddedY + Math.floor(paddedH / 2);
    
    return { x: centerX, y: centerY, width: paddedW, height: paddedH };
  }

  /**
   * CREATE A CORRIDOR BETWEEN TWO POINTS
   * Uses L-shaped path (horizontal then vertical or vice versa)
   */
  function createCorridor(x1, y1, x2, y2) {
    let x = x1;
    let y = y1;

    // Move horizontally first
    while (x !== x2) {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        grid[y][x] = 0; // Carve corridor
      }
      x += x < x2 ? 1 : -1;
    }

    // Then move vertically
    while (y !== y2) {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        grid[y][x] = 0; // Carve corridor
      }
      y += y < y2 ? 1 : -1;
    }
  }

  /**
   * CHECK IF TWO ROOMS OVERLAP
   * Prevents rooms from being created on top of each other
   */
  function roomsOverlap(room1, room2, padding = 2) {
    return !(
      room1.x + room1.width + padding < room2.x ||
      room2.x + room2.width + padding < room1.x ||
      room1.y + room1.height + padding < room2.y ||
      room2.y + room2.height + padding < room1.y
    );
  }

  // ============================================
  // GENERATE ROOMS
  // ============================================
  const numRooms = Math.floor(width * height * complexity / 50);
  const maxAttempts = numRooms * 3; // Try multiple times to place rooms
  let attempts = 0;

  while (rooms.length < numRooms && attempts < maxAttempts) {
    attempts++;

    // Random room dimensions
    const roomW = 4 + Math.floor(Math.random() * 6); // Width: 4-9
    const roomH = 4 + Math.floor(Math.random() * 6); // Height: 4-9
    const roomX = Math.floor(Math.random() * (width - roomW - 2)) + 1;
    const roomY = Math.floor(Math.random() * (height - roomH - 2)) + 1;

    // Create room object for overlap checking
    const newRoom = {
      x: roomX,
      y: roomY,
      width: roomW,
      height: roomH
    };

    // Check if this room overlaps with existing rooms
    const overlaps = rooms.some(room => roomsOverlap(room, newRoom));

    if (!overlaps) {
      // Room is valid, create it
      const center = createRoom(roomX, roomY, roomW, roomH);
      rooms.push({ ...newRoom, centerX: center.x, centerY: center.y });
    }
  }

  // ============================================
  // CONNECT ROOMS WITH CORRIDORS
  // ============================================
  for (let i = 0; i < rooms.length - 1; i++) {
    createCorridor(
      rooms[i].centerX,
      rooms[i].centerY,
      rooms[i + 1].centerX,
      rooms[i + 1].centerY
    );
  }

  // Also connect some random rooms for loops (more interesting layout)
  const numExtraConnections = Math.floor(rooms.length / 3);
  for (let i = 0; i < numExtraConnections; i++) {
    const room1 = rooms[Math.floor(Math.random() * rooms.length)];
    const room2 = rooms[Math.floor(Math.random() * rooms.length)];
    if (room1 !== room2) {
      createCorridor(room1.centerX, room1.centerY, room2.centerX, room2.centerY);
    }
  }

  // ============================================
  // ADD DECORATIONS (Torches, Props, etc.)
  // ============================================
  rooms.forEach(room => {
    // Add torches in room corners
    const torchPositions = [
      { x: room.x + 1, z: room.y + 1, type: 'torch' },
      { x: room.x + room.width - 2, z: room.y + 1, type: 'torch' },
      { x: room.x + 1, z: room.y + room.height - 2, type: 'torch' },
      { x: room.x + room.width - 2, z: room.y + room.height - 2, type: 'torch' }
    ];

    torchPositions.forEach(pos => {
      // Only add if position is floor
      if (grid[pos.z]?.[pos.x] === 0) {
        decorations.push(pos);
      }
    });

    // Add a pillar or prop in center of larger rooms
    if (room.width >= 6 && room.height >= 6) {
      decorations.push({
        x: room.centerX,
        z: room.centerY,
        type: 'pillar'
      });
    }
  });

  // ============================================
  // RETURN GENERATED DUNGEON DATA
  // ============================================
  return {
    grid,           // 2D array of walls/floors
    rooms,          // Array of room objects
    decorations,    // Array of decoration positions
    width,
    height
  };
}

/**
 * GET WALL HEIGHT VARIATION
 * Makes walls more interesting by varying height based on neighbors
 * 
 * @param {Array} grid - The dungeon grid
 * @param {number} x - X position
 * @param {number} z - Z position
 * @returns {number} Height multiplier
 */
export function getWallHeight(grid, x, z) {
  // Check neighboring cells
  const neighbors = [
    grid[z - 1]?.[x],     // North
    grid[z + 1]?.[x],     // South
    grid[z]?.[x - 1],     // West
    grid[z]?.[x + 1]      // East
  ];

  // Count how many neighbors are floors
  const floorNeighbors = neighbors.filter(n => n === 0).length;

  // Corner walls (more exposed) are taller
  if (floorNeighbors >= 2) {
    return 1.3 + Math.random() * 0.2; // 1.3-1.5x height
  }

  // Regular walls
  return 1.0 + Math.random() * 0.15; // 1.0-1.15x height
}

/**
 * CHECK IF POSITION IS WALKABLE
 * Used for collision detection
 * 
 * @param {Array} grid - The dungeon grid
 * @param {number} x - X position
 * @param {number} z - Z position
 * @returns {boolean} True if walkable
 */
export function isWalkable(grid, x, z) {
  const gridX = Math.floor(x / 2); // Convert world space to grid space
  const gridZ = Math.floor(z / 2);
  
  if (!grid[gridZ] || grid[gridZ][gridX] === undefined) {
    return false; // Out of bounds
  }
  
  return grid[gridZ][gridX] === 0; // 0 = floor = walkable
}