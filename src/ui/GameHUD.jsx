// src/ui/GameHUD.jsx
import React from "react";

const GameHUD = ({ playerPos, currentSection, health, questLog }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 100,
      fontFamily: 'monospace',
      color: 'white'
    }}>
      {/* Top Bar - Health & Stats */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'rgba(0, 0, 0, 0.8)',
        border: '2px solid white',
        padding: '15px',
        minWidth: '250px'
      }}>
        <div style={{ fontSize: '12px', marginBottom: '8px', letterSpacing: '2px' }}>
          DEVELOPER STATUS
        </div>
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '10px', marginBottom: '4px' }}>MOTIVATION</div>
          <div style={{ 
            width: '100%', 
            height: '20px', 
            border: '1px solid white',
            background: 'black',
            position: 'relative'
          }}>
            <div style={{
              width: `${health}%`,
              height: '100%',
              background: 'white',
              transition: 'width 0.3s'
            }} />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '10px'
            }}>
              {health}%
            </div>
          </div>
        </div>
        <div style={{ fontSize: '10px', marginTop: '8px' }}>
          LOCATION: {currentSection}
        </div>
      </div>

      {/* Minimap */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        width: '150px',
        height: '150px',
        background: 'rgba(0, 0, 0, 0.8)',
        border: '2px solid white',
        padding: '10px'
      }}>
        <div style={{ fontSize: '10px', marginBottom: '8px', letterSpacing: '2px', textAlign: 'center' }}>
          DUNGEON MAP
        </div>
        <div style={{ 
          width: '100%', 
          height: 'calc(100% - 20px)',
          border: '1px solid white',
          background: 'black',
          position: 'relative'
        }}>
          {/* Dungeon boundaries */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '80%',
            height: '80%',
            border: '1px solid #666'
          }} />
          
          {/* Player dot */}
          <div style={{
            position: 'absolute',
            left: `${50 + (playerPos.x / 30) * 100}%`,
            top: `${50 + (playerPos.z / 30) * 100}%`,
            width: '6px',
            height: '6px',
            background: 'white',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 10px white'
          }} />

          {/* Portal markers */}
          <div style={{
            position: 'absolute',
            left: '30%',
            top: '30%',
            width: '4px',
            height: '4px',
            background: '#00ff00',
            transform: 'translate(-50%, -50%)'
          }} />
          <div style={{
            position: 'absolute',
            left: '70%',
            top: '30%',
            width: '4px',
            height: '4px',
            background: '#00ff00',
            transform: 'translate(-50%, -50%)'
          }} />
          <div style={{
            position: 'absolute',
            left: '30%',
            top: '70%',
            width: '4px',
            height: '4px',
            background: '#00ff00',
            transform: 'translate(-50%, -50%)'
          }} />
          <div style={{
            position: 'absolute',
            left: '70%',
            top: '70%',
            width: '4px',
            height: '4px',
            background: '#00ff00',
            transform: 'translate(-50%, -50%)'
          }} />
        </div>
      </div>

      {/* Quest Log */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        left: 20,
        background: 'rgba(0, 0, 0, 0.8)',
        border: '2px solid white',
        padding: '15px',
        minWidth: '300px',
        maxWidth: '400px'
      }}>
        <div style={{ fontSize: '12px', marginBottom: '8px', letterSpacing: '2px' }}>
          ACTIVE QUESTS
        </div>
        {questLog.map((quest, i) => (
          <div key={i} style={{ 
            fontSize: '10px', 
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <span>{quest.completed ? '✓' : '○'}</span>
            <span style={{ opacity: quest.completed ? 0.5 : 1 }}>
              {quest.text}
            </span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        background: 'rgba(0, 0, 0, 0.8)',
        border: '2px solid white',
        padding: '10px',
        fontSize: '10px'
      }}>
        <div>WASD - Move</div>
        <div>E - Interact</div>
        <div>Mouse - Look Around</div>
      </div>

      {/* Title */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        animation: 'fadeOut 3s forwards'
      }}>
        <div style={{ 
          fontSize: '48px', 
          fontWeight: 'bold',
          textShadow: '0 0 20px white',
          marginBottom: '10px'
        }}>
          PORTFOLIO DUNGEON
        </div>
        <div style={{ fontSize: '14px', letterSpacing: '4px' }}>
          EXPLORE TO DISCOVER
        </div>
      </div>

      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }
      `}</style>
    </div>
  );
};

export default GameHUD;