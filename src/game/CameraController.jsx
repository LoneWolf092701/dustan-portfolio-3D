// src/game/CameraController.jsx
// ============================================
// CAMERA CONTROLLER
// Smooth camera that follows the player with isometric perspective
// ============================================

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from 'three';

/**
 * CAMERA CONTROLLER COMPONENT
 * Manages camera position and rotation to follow the player
 * 
 * Features:
 * - Smooth interpolation (lerp) for fluid movement
 * - Isometric-style angle for dungeon-crawler feel
 * - Configurable offset and height
 * - Looks at player position
 */
const CameraController = ({ 
  target,                    // Player position to follow
  offset = { x: 10, y: 12, z: 10 }, // Camera offset from player
  smoothness = 0.1,          // How smooth the follow is (0.01-0.5)
  lookAtSmooth = 0.15        // How smooth the camera rotation is
}) => {
  
  const { camera } = useThree();
  
  // Store the target look-at position for smooth rotation
  const lookAtPosition = useRef(new THREE.Vector3(0, 0, 0));
  
  // ============================================
  // INITIALIZATION
  // Set initial camera position on mount
  // ============================================
  useEffect(() => {
    if (target) {
      camera.position.set(
        target.x + offset.x,
        target.y + offset.y,
        target.z + offset.z
      );
      lookAtPosition.current.set(target.x, target.y, target.z);
    }
  }, []); // Run once on mount

  // ============================================
  // CAMERA UPDATE LOOP
  // Runs every frame to smoothly follow player
  // ============================================
  useFrame(() => {
    if (!target) return;

    // ========== CALCULATE TARGET POSITION ==========
    // Where we want the camera to be
    const targetCameraPos = {
      x: target.x + offset.x,
      y: target.y + offset.y,
      z: target.z + offset.z
    };

    // ========== SMOOTH POSITION INTERPOLATION ==========
    // Gradually move camera towards target position
    // This creates a smooth "elastic" follow effect
    camera.position.x += (targetCameraPos.x - camera.position.x) * smoothness;
    camera.position.y += (targetCameraPos.y - camera.position.y) * smoothness;
    camera.position.z += (targetCameraPos.z - camera.position.z) * smoothness;

    // ========== SMOOTH ROTATION (LOOK-AT) ==========
    // Update the look-at target position
    lookAtPosition.current.x += (target.x - lookAtPosition.current.x) * lookAtSmooth;
    lookAtPosition.current.y += (target.y - lookAtPosition.current.y) * lookAtSmooth;
    lookAtPosition.current.z += (target.z - lookAtPosition.current.z) * lookAtSmooth;

    // Make camera look at the smoothed position
    camera.lookAt(lookAtPosition.current);

    // ========== CAMERA BOUNDS ==========
    // Optional: Prevent camera from going below floor
    if (camera.position.y < 5) {
      camera.position.y = 5;
    }
  });

  // This component doesn't render anything visible
  return null;
};

export default CameraController;

/**
 * ALTERNATIVE: Manual Camera Controls
 * Uncomment this version if you want mouse-controlled rotation
 */

/*
import { OrbitControls } from '@react-three/drei';

const CameraController = ({ target }) => {
  return (
    <OrbitControls 
      target={[target.x, target.y, target.z]}
      enablePan={false}
      enableRotate={true}
      enableZoom={true}
      maxPolarAngle={Math.PI / 2.5}
      minPolarAngle={Math.PI / 6}
      maxDistance={20}
      minDistance={5}
    />
  );
};
*/