// src/game/VoxelDungeon.jsx
// ============================================
// VOXEL DUNGEON RENDERER
// Converts the generated dungeon grid into 3D voxel meshes
// ============================================

import React, { useMemo } from 'react';
import { generateDungeon, getWallHeight } from './dungeonGenerator';

/**
 * VOXEL TYPES CONFIGURATION
 * Defines visual properties for each type of voxel
 */
const VOXEL_TYPES = {
  // Standard dungeon walls
  WALL: {
    color: '#2a2a2a',
    baseHeight: 3,
    roughness: 0.9,
    metalness: 0.1
  },
  // Corner pillars and emphasized walls
  PILLAR: {
    color: '#3a3a3a',
    baseHeight: 4,
    roughness: 0.8,
    metalness: 0.2
  },
  // Floor tiles
  FLOOR: {
    color: '#0a0a0a',
    baseHeight: 0.1,
    roughness: 1.0,
    metalness: 0.0
  },
  // Wall torches (light sources)
  TORCH: {
    color: '#ff6600',
    emissive: '#ff6600',
    emissiveIntensity: 1.0,
    height: 0.8
  },
  // Stone pillars in rooms
  PILLAR_PROP: {
    color: '#4a4a4a',
    baseHeight: 3.5,
    roughness: 0.7,
    metalness: 0.3
  }
};

/**
 * MAIN VOXEL DUNGEON COMPONENT
 * Generates and renders the entire dungeon
 */
const VoxelDungeon = ({ 
  width = 40,        // Dungeon width in grid cells
  height = 40,       // Dungeon height in grid cells
  complexity = 0.25, // How complex the layout is (0.1-0.5)
  seed = Date.now()  // Random seed for generation
}) => {
  
  // ============================================
  // GENERATE DUNGEON LAYOUT
  // useMemo ensures this only runs once unless props change
  // ============================================
  const dungeonData = useMemo(() => {
    return generateDungeon(width, height, complexity);
  }, [width, height, complexity, seed]);

  // ============================================
  // BUILD VOXEL ARRAY
  // Convert grid data into 3D positioned voxels
  // ============================================
  const voxels = useMemo(() => {
    const result = [];
    const { grid, decorations } = dungeonData;

    // Iterate through each cell in the grid
    grid.forEach((row, z) => {
      row.forEach((cell, x) => {
        
        // ========== FLOOR TILES ==========
        if (cell === 0) {
          result.push({
            position: [x * 2, 0, z * 2],      // World position
            type: 'FLOOR',
            scale: [2, 0.1, 2],               // Size of voxel
            key: `floor-${x}-${z}`
          });
        }
        
        // ========== WALLS ==========
        if (cell === 1) {
          // Check neighboring cells to determine wall type
          const neighbors = [
            grid[z - 1]?.[x],  // North
            grid[z + 1]?.[x],  // South
            grid[z]?.[x - 1],  // West
            grid[z]?.[x + 1]   // East
          ];
          
          // Count floor neighbors (walls adjacent to floors are visible)
          const floorNeighbors = neighbors.filter(n => n === 0).length;
          
          // Only render walls that are visible (have at least one floor neighbor)
          if (floorNeighbors > 0) {
            const heightMultiplier = getWallHeight(grid, x, z);
            const baseHeight = VOXEL_TYPES.WALL.baseHeight;
            const finalHeight = baseHeight * heightMultiplier;
            
            // Determine if this is a corner (special pillar treatment)
            const isCorner = floorNeighbors >= 2;
            
            result.push({
              position: [x * 2, finalHeight / 2, z * 2],
              type: isCorner ? 'PILLAR' : 'WALL',
              scale: [2, finalHeight, 2],
              key: `wall-${x}-${z}`
            });
          }
        }
      });
    });

    // ========== ADD DECORATIONS ==========
    decorations.forEach((decoration, i) => {
      const { x, z, type } = decoration;
      
      if (type === 'torch') {
        // Wall-mounted torch
        result.push({
          position: [x * 2, 2.5, z * 2],
          type: 'TORCH',
          scale: [0.15, 0.8, 0.15],
          key: `torch-${i}`,
          hasLight: true,           // Flag to add point light
          lightColor: '#ff6600',
          lightIntensity: 2,
          lightDistance: 8
        });
      } else if (type === 'pillar') {
        // Floor pillar
        result.push({
          position: [x * 2, 1.75, z * 2],
          type: 'PILLAR_PROP',
          scale: [0.8, 3.5, 0.8],
          key: `pillar-${i}`
        });
      }
    });

    return result;
  }, [dungeonData]);

  // ============================================
  // RENDER ALL VOXELS
  // ============================================
  return (
    <group name="dungeon">
      {voxels.map((voxel) => {
        const voxelType = VOXEL_TYPES[voxel.type];
        
        return (
          <group key={voxel.key} position={voxel.position}>
            {/* The voxel mesh itself */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={voxel.scale} />
              <meshStandardMaterial
                color={voxelType.color}
                emissive={voxelType.emissive || '#000000'}
                emissiveIntensity={voxelType.emissiveIntensity || 0}
                roughness={voxelType.roughness || 0.8}
                metalness={voxelType.metalness || 0.2}
              />
            </mesh>

            {/* Add point light for torches */}
            {voxel.hasLight && (
              <pointLight
                color={voxel.lightColor}
                intensity={voxel.lightIntensity}
                distance={voxel.lightDistance}
                decay={2}
                castShadow
              />
            )}
          </group>
        );
      })}

      {/* Add ambient grid lines on floor for cyberpunk aesthetic */}
      {Array.from({ length: Math.floor(width / 2) + 1 }, (_, i) => (
        <React.Fragment key={`grid-${i}`}>
          {/* Horizontal grid lines */}
          <mesh position={[width, 0.02, i * 4]} receiveShadow>
            <boxGeometry args={[width * 2, 0.01, 0.02]} />
            <meshStandardMaterial 
              color="#1a1a1a" 
              emissive="#1a1a1a"
              emissiveIntensity={0.1}
            />
          </mesh>
          
          {/* Vertical grid lines */}
          <mesh position={[i * 4, 0.02, height]} receiveShadow>
            <boxGeometry args={[0.02, 0.01, height * 2]} />
            <meshStandardMaterial 
              color="#1a1a1a"
              emissive="#1a1a1a" 
              emissiveIntensity={0.1}
            />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
};

export default VoxelDungeon;