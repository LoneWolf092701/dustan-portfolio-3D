// src/App.jsx
import React, { useState } from "react";
import GameEngine from "./game/GameEngine";
import ProjectsDungeon from "./dungeons/ProjectsDungeon";
import SkillsDungeon from "./dungeons/SkillsDungeon";
import AboutDungeon from "./dungeons/AboutDungeon";
import ContactDungeon from "./dungeons/ContactDungeon";

const App = () => {
  const [currentRoom, setCurrentRoom] = useState('main'); // main, projects, skills, about, contact

  const handlePortalEnter = (portalName) => {
    setCurrentRoom(portalName);
  };

  const handleExit = () => {
    setCurrentRoom('main');
  };

  return (
    <div className="relative z-0 bg-black font-mono">
      {/* Scan Line Effect */}
      <div className="scan-line" />
      
      {/* Room System */}
      {currentRoom === 'main' && (
        <GameEngine onPortalEnter={handlePortalEnter} />
      )}
      
      {currentRoom === 'projects' && (
        <ProjectsDungeon onExit={handleExit} />
      )}
      
      {currentRoom === 'skills' && (
        <SkillsDungeon onExit={handleExit} />
      )}
      
      {currentRoom === 'about' && (
        <AboutDungeon onExit={handleExit} />
      )}
      
      {currentRoom === 'contact' && (
        <ContactDungeon onExit={handleExit} />
      )}

      {/* Exit button (always visible) */}
      {currentRoom !== 'main' && (
        <button
          onClick={handleExit}
          style={{
            position: 'fixed',
            top: 20,
            left: 20,
            background: 'rgba(0, 0, 0, 0.8)',
            border: '2px solid white',
            color: 'white',
            padding: '10px 20px',
            fontFamily: 'monospace',
            fontSize: '12px',
            cursor: 'pointer',
            zIndex: 1000,
            letterSpacing: '2px'
          }}
        >
          ← BACK TO MAIN HALL
        </button>
      )}
    </div>
  );
};

export default App;