// src/App.jsx
// ============================================
// MAIN APPLICATION COMPONENT
// Manages navigation between main dungeon and individual rooms
// ============================================

import React, { useState } from "react";
import GameEngine from "./game/GameEngine";
import ProjectsDungeon from "./dungeons/ProjectsDungeon";
import SkillsDungeon from "./dungeons/SkillsDungeon";
import AboutDungeon from "./dungeons/AboutDungeon";
import ContactDungeon from "./dungeons/ContactDungeon";

/**
 * MAIN APP COMPONENT
 * 
 * Room System:
 * - 'main' = The central procedural dungeon hub
 * - 'projects' = Projects showcase room
 * - 'skills' = Skills visualization room
 * - 'about' = About/bio information room
 * - 'contact' = Contact information room
 */
const App = () => {
  
  // ============================================
  // STATE - CURRENT ROOM
  // Tracks which room/dungeon the player is in
  // ============================================
  const [currentRoom, setCurrentRoom] = useState('main');

  /**
   * HANDLE PORTAL ENTRY
   * Called when player enters a portal in the main dungeon
   * @param {string} portalName - Name of the portal ('projects', 'skills', etc.)
   */
  const handlePortalEnter = (portalName) => {
    console.log(`Entering room: ${portalName}`);
    setCurrentRoom(portalName);
    
    // Optional: Add transition effect
    document.body.style.transition = 'opacity 0.3s';
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 100);
  };

  /**
   * HANDLE EXIT BACK TO MAIN
   * Returns player to the central hub
   */
  const handleExit = () => {
    console.log('Returning to main dungeon');
    setCurrentRoom('main');
  };

  // ============================================
  // RENDER CURRENT ROOM
  // ============================================
  return (
    <div className="relative z-0 bg-black font-mono">
      
      {/* ========== VISUAL EFFECTS ========== */}
      {/* Scan line effect for retro CRT look */}
      <div 
        className="scan-line" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.15) 3px)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0.3
        }}
      />
      
      {/* ========== MAIN HUB - PROCEDURAL DUNGEON ========== */}
      {currentRoom === 'main' && (
        <GameEngine onPortalEnter={handlePortalEnter} />
      )}
      
      {/* ========== PROJECTS ROOM ========== */}
      {currentRoom === 'projects' && (
        <ProjectsDungeon onExit={handleExit} />
      )}
      
      {/* ========== SKILLS ROOM ========== */}
      {currentRoom === 'skills' && (
        <SkillsDungeon onExit={handleExit} />
      )}
      
      {/* ========== ABOUT ROOM ========== */}
      {currentRoom === 'about' && (
        <AboutDungeon onExit={handleExit} />
      )}
      
      {/* ========== CONTACT ROOM ========== */}
      {currentRoom === 'contact' && (
        <ContactDungeon onExit={handleExit} />
      )}

      {/* ========== UNIVERSAL EXIT BUTTON ========== */}
      {/* Shows in all rooms except main */}
      {currentRoom !== 'main' && (
        <button
          onClick={handleExit}
          style={{
            position: 'fixed',
            top: 20,
            left: 20,
            background: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid white',
            color: 'white',
            padding: '12px 24px',
            fontFamily: 'monospace',
            fontSize: '12px',
            cursor: 'pointer',
            zIndex: 1000,
            letterSpacing: '2px',
            fontWeight: 'bold',
            transition: 'all 0.2s',
            textShadow: '0 0 10px white'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'white';
            e.target.style.color = 'black';
            e.target.style.boxShadow = '0 0 20px white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.9)';
            e.target.style.color = 'white';
            e.target.style.boxShadow = 'none';
          }}
        >
          ← BACK TO MAIN HALL
        </button>
      )}

      {/* ========== LOADING INDICATOR ========== */}
      {/* Shows briefly during room transitions */}
      <div 
        id="loading-indicator"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '14px',
          fontFamily: 'monospace',
          letterSpacing: '3px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 10000,
          transition: 'opacity 0.3s'
        }}
      >
        LOADING...
      </div>

      {/* ========== GLOBAL STYLES ========== */}
      <style>{`
        /* Noir theme variables */
        :root {
          --noir-bg: #000000;
          --noir-text: #ffffff;
          --noir-accent: #00ff00;
          --noir-border: #333333;
        }

        /* Body styling */
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: var(--noir-bg);
          color: var(--noir-text);
        }

        /* Prevent text selection in game */
        .no-select {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        /* Custom scrollbar for UI elements */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: var(--noir-bg);
          border: 1px solid var(--noir-border);
        }

        ::-webkit-scrollbar-thumb {
          background: var(--noir-accent);
          border: 1px solid var(--noir-text);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--noir-text);
        }

        /* Utility classes */
        .noir-glow {
          text-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
        }

        .noir-border {
          border: 2px solid var(--noir-text);
          box-shadow: 0 0 10px rgba(255,255,255,0.3);
        }

        /* Animation for glitch effect */
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        .glitch:hover {
          animation: glitch 0.3s infinite;
        }
      `}</style>
    </div>
  );
};

export default App;