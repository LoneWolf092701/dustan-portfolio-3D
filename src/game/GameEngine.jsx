// src/game/GameEngine.jsx
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Player from "./Player";
import DungeonFloor from "./DungeonFloor";
import Portal from "./Portal";
import CameraController from "./CameraController";
import GameHUD from "../ui/GameHUD";

const GameEngine = ({ onPortalEnter }) => {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0.5, z: 0 });
  const [currentSection, setCurrentSection] = useState('Main Hall');
  const [health] = useState(100);
  const [questLog, setQuestLog] = useState([
    { text: 'Explore the dungeon', completed: false },
    { text: 'Find all 4 portals', completed: false },
    { text: 'Learn about my skills', completed: false },
    { text: 'View my projects', completed: false }
  ]);

  const portals = [
    { position: [-10, 0, -10], label: 'ABOUT', section: 'About Chamber' },
    { position: [10, 0, -10], label: 'PROJECTS', section: 'Projects Archive' },
    { position: [-10, 0, 10], label: 'SKILLS', section: 'Skills Arena' },
    { position: [10, 0, 10], label: 'CONTACT', section: 'Contact Crystal' }
  ];

  const checkProximity = (pos1, pos2, distance = 3) => {
    const dx = pos1.x - pos2[0];
    const dz = pos1.z - pos2[2];
    return Math.sqrt(dx * dx + dz * dz) < distance;
  };

  const handleInteract = () => {
    portals.forEach((portal, index) => {
      if (checkProximity(playerPosition, portal.position)) {
        setCurrentSection(portal.section);
        if (onPortalEnter) {
          onPortalEnter(portal.label.toLowerCase());
        }
      }
    });
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <Canvas shadows camera={{ position: [10, 10, 10], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={0.5} castShadow />
        <pointLight position={[10, 5, 10]} intensity={0.3} />
        <pointLight position={[-10, 5, -10]} intensity={0.3} />

        <DungeonFloor />
        
        <Player 
          position={[playerPosition.x, playerPosition.y, playerPosition.z]}
          onMove={setPlayerPosition}
          onInteract={handleInteract}
        />

        {portals.map((portal, i) => (
          <Portal
            key={i}
            position={portal.position}
            label={portal.label}
            onInteract={() => setCurrentSection(portal.section)}
            isNear={checkProximity(playerPosition, portal.position)}
          />
        ))}

        <CameraController target={playerPosition} />
      </Canvas>

      <GameHUD 
        playerPos={playerPosition}
        currentSection={currentSection}
        health={health}
        questLog={questLog}
      />
    </div>
  );
};

export default GameEngine;