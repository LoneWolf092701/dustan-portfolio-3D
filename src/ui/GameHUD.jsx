// src/ui/GameHUD.jsx
// ============================================
// GAME HUD (Heads-Up Display)
// UI overlay showing player stats, minimap, quests, controls
// ============================================

import React, { useState, useEffect } from "react";

/**
 * GAME HUD COMPONENT
 * Displays all UI elements over the 3D game
 * 
 * Elements:
 * - Health/Status bar (top left)
 * - Minimap (top right)
 * - Quest log (bottom left)
 * - Controls help (bottom left)
 * - Title screen (fades out)
 */
const GameHUD = ({ 
  playerPos,      // Player position for minimap
  currentSection, // Current area name
  health,         // Player health percentage
  questLog,       // Array of quest objects
  portals         // Portal positions for minimap
}) => {
  
  // ============================================
  // STATE
  // ============================================
  const [showTitle, setShowTitle] = useState(true);
  const [showControls, setShowControls] = useState(true);

  // ============================================
  // FADE OUT TITLE SCREEN
  // Title disappears after 3 seconds
  // ============================================
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTitle(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // ============================================
  // STYLES
  // ============================================
  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none', // Allow clicks to pass through to game
    zIndex: 100,
    fontFamily: 'monospace',
    color: 'white'
  };

  const panelStyle = {
    background: 'rgba(0, 0, 0, 0.85)',
    border: '2px solid white',
    padding: '15px',
    pointerEvents: 'auto' // Panels catch clicks
  };

  const glowTextStyle = {
    textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00'
  };

  // ============================================
  // RENDER HUD
  // ============================================
  return (
    <div style={containerStyle}>
      
      {/* ========================================
          TOP LEFT - HEALTH & STATUS BAR
      ========================================== */}
      <div style={{
        ...panelStyle,
        position: 'absolute',
        top: 20,
        left: 20,
        minWidth: '250px'
      }}>
        {/* Section header */}
        <div style={{ 
          fontSize: '11px', 
          marginBottom: '10px', 
          letterSpacing: '2px',
          opacity: 0.7
        }}>
          DEVELOPER STATUS
        </div>
        
        {/* Health/Motivation bar */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ 
            fontSize: '10px', 
            marginBottom: '5px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>MOTIVATION</span>
            <span style={glowTextStyle}>{health}%</span>
          </div>
          
          {/* Health bar visual */}
          <div style={{ 
            width: '100%', 
            height: '22px', 
            border: '1px solid white',
            background: 'black',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Filled portion */}
            <div style={{
              width: `${health}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #00ff00, #00aa00)',
              transition: 'width 0.3s ease',
              boxShadow: '0 0 10px #00ff00'
            }} />
            
            {/* Percentage text overlay */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '10px',
              fontWeight: 'bold',
              mixBlendMode: 'difference'
            }}>
              {health}%
            </div>
          </div>
        </div>
        
        {/* Current location */}
        <div style={{ 
          fontSize: '10px',
          paddingTop: '10px',
          borderTop: '1px solid #333'
        }}>
          <span style={{ opacity: 0.7 }}>LOCATION: </span>
          <span style={glowTextStyle}>{currentSection}</span>
        </div>

        {/* Coordinates (for debugging/immersion) */}
        <div style={{ fontSize: '9px', marginTop: '8px', opacity: 0.5 }}>
          X: {Math.round(playerPos.x)} | Y: {Math.round(playerPos.y)} | Z: {Math.round(playerPos.z)}
        </div>
      </div>

      {/* ========================================
          TOP RIGHT - MINIMAP
      ========================================== */}
      <div style={{
        ...panelStyle,
        position: 'absolute',
        top: 20,
        right: 20,
        width: '180px',
        height: '180px',
        padding: '10px'
      }}>
        {/* Minimap header */}
        <div style={{ 
          fontSize: '10px', 
          marginBottom: '8px', 
          letterSpacing: '2px',
          textAlign: 'center',
          opacity: 0.7
        }}>
          DUNGEON MAP
        </div>
        
        {/* Map canvas */}
        <div style={{ 
          width: '100%', 
          height: 'calc(100% - 20px)',
          border: '1px solid white',
          background: 'black',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Grid background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />

          {/* Dungeon boundary */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '80%',
            height: '80%',
            border: '1px solid #444'
          }} />
          
          {/* Player dot */}
          <div style={{
            position: 'absolute',
            left: `${50 + (playerPos.x / 80) * 100}%`,
            top: `${50 + (playerPos.z / 80) * 100}%`,
            width: '8px',
            height: '8px',
            background: '#00ff00',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 10px #00ff00, 0 0 20px #00ff00',
            zIndex: 10
          }} />

          {/* Portal markers */}
          {portals && portals.map((portal, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${50 + (portal.position[0] / 80) * 100}%`,
              top: `${50 + (portal.position[2] / 80) * 100}%`,
              width: '6px',
              height: '6px',
              background: portal.color || '#ffffff',
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 5px ${portal.color}`,
              border: '1px solid white'
            }} />
          ))}

          {/* Compass directions */}
          <div style={{
            position: 'absolute',
            top: '5px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '10px',
            opacity: 0.5
          }}>N</div>
        </div>
      </div>

      {/* ========================================
          BOTTOM LEFT - QUEST LOG
      ========================================== */}
      <div style={{
        ...panelStyle,
        position: 'absolute',
        bottom: 80,
        left: 20,
        minWidth: '320px',
        maxWidth: '420px'
      }}>
        {/* Quest header */}
        <div style={{ 
          fontSize: '11px', 
          marginBottom: '10px', 
          letterSpacing: '2px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>ACTIVE QUESTS</span>
          <div style={{
            fontSize: '9px',
            background: '#00ff00',
            color: 'black',
            padding: '2px 6px',
            fontWeight: 'bold'
          }}>
            {questLog.filter(q => q.completed).length}/{questLog.length}
          </div>
        </div>
        
        {/* Quest list */}
        {questLog.map((quest, i) => (
          <div key={i} style={{ 
            fontSize: '10px', 
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            opacity: quest.completed ? 0.4 : 1,
            transition: 'opacity 0.3s'
          }}>
            {/* Checkbox */}
            <span style={{ 
              fontSize: '14px',
              color: quest.completed ? '#00ff00' : '#666',
              ...glowTextStyle
            }}>
              {quest.completed ? '✓' : '○'}
            </span>
            
            {/* Quest text */}
            <span style={{ 
              flex: 1,
              textDecoration: quest.completed ? 'line-through' : 'none'
            }}>
              {quest.text}
            </span>
          </div>
        ))}
      </div>

      {/* ========================================
          BOTTOM LEFT - CONTROLS
      ========================================== */}
      {showControls && (
        <div style={{
          ...panelStyle,
          position: 'absolute',
          bottom: 20,
          left: 20,
          fontSize: '10px'
        }}>
          <div style={{ marginBottom: '6px', fontWeight: 'bold' }}>CONTROLS</div>
          <div>WASD / Arrows - Move</div>
          <div>E - Interact</div>
          <div>Mouse - Rotate view</div>
          <div style={{ marginTop: '8px', opacity: 0.5, fontSize: '9px' }}>
            Press [H] to toggle
          </div>
        </div>
      )}

      {/* ========================================
          CENTER - TITLE SCREEN (FADES OUT)
      ========================================== */}
      {showTitle && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          animation: 'fadeOut 3s forwards',
          pointerEvents: 'none'
        }}>
          <div style={{ 
            fontSize: '56px', 
            fontWeight: 'bold',
            textShadow: '0 0 20px white, 0 0 40px white',
            marginBottom: '15px',
            letterSpacing: '4px'
          }}>
            PORTFOLIO DUNGEON
          </div>
          
          <div style={{ 
            fontSize: '16px', 
            letterSpacing: '6px',
            opacity: 0.8
          }}>
            PROCEDURAL EDITION
          </div>

          <div style={{
            marginTop: '30px',
            fontSize: '12px',
            opacity: 0.6,
            letterSpacing: '2px'
          }}>
            EXPLORE • DISCOVER • CONNECT
          </div>
        </div>
      )}

      {/* ========================================
          CSS ANIMATIONS
      ========================================== */}
      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }

        /* Scan line effect (optional) */
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

export default GameHUD;