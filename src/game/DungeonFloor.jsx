// src/game/DungeonFloor.jsx
import React from "react";
import { Plane, Box } from "@react-three/drei";

const DungeonFloor = () => {
  return (
    <group>
      {/* Main Floor */}
      <Plane args={[30, 30]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Plane>

      {/* Grid Lines */}
      {Array.from({ length: 31 }, (_, i) => (
        <React.Fragment key={`grid-${i}`}>
          <Box args={[30, 0.02, 0.02]} position={[0, 0.01, -15 + i]}>
            <meshStandardMaterial color="#404040" />
          </Box>
          <Box args={[0.02, 0.02, 30]} position={[-15 + i, 0.01, 0]}>
            <meshStandardMaterial color="#404040" />
          </Box>
        </React.Fragment>
      ))}

      {/* Walls */}
      <Box args={[30, 3, 0.5]} position={[0, 1.5, -15]}>
        <meshStandardMaterial color="#0a0a0a" wireframe />
      </Box>
      <Box args={[30, 3, 0.5]} position={[0, 1.5, 15]}>
        <meshStandardMaterial color="#0a0a0a" wireframe />
      </Box>
      <Box args={[0.5, 3, 30]} position={[-15, 1.5, 0]}>
        <meshStandardMaterial color="#0a0a0a" wireframe />
      </Box>
      <Box args={[0.5, 3, 30]} position={[15, 1.5, 0]}>
        <meshStandardMaterial color="#0a0a0a" wireframe />
      </Box>
    </group>
  );
};

export default DungeonFloor;