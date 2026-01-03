// src/components/SpaceGame.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionWrapper from "../hoc/SectionWrapper";

const SpaceGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const gameStateRef = useRef({
    ship: { x: 100, y: 300 },
    asteroids: [],
    bullets: [],
    particles: [],
    keys: {},
    lastAsteroidTime: 0,
    animationId: null
  });

  useEffect(() => {
    const savedHighScore = localStorage.getItem('noirSpaceHighScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, []);

  useEffect(() => {
    if (!gameActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Keyboard controls
    const handleKeyDown = (e) => {
      state.keys[e.key] = true;
      if (e.key === ' ' && gameActive) {
        e.preventDefault();
        shootBullet();
      }
    };

    const handleKeyUp = (e) => {
      state.keys[e.key] = false;
    };

    // Mouse/Touch shooting
    const handleClick = (e) => {
      if (!gameActive) return;
      const rect = canvas.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      shootBullet(clickY);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('click', handleClick);

    // Shoot bullet
    const shootBullet = (targetY = null) => {
      state.bullets.push({
        x: state.ship.x + 40,
        y: targetY || state.ship.y + 20,
        speed: 8,
        size: 3
      });
    };

    // Spawn asteroid
    const spawnAsteroid = () => {
      const size = 20 + Math.random() * 30;
      state.asteroids.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - size),
        size: size,
        speed: 2 + Math.random() * 3,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.1
      });
    };

    // Create explosion particles
    const createExplosion = (x, y) => {
      for (let i = 0; i < 15; i++) {
        state.particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 1
        });
      }
    };

    // Game loop
    const gameLoop = () => {
      if (!gameActive) return;

      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Move ship
      if (state.keys['ArrowUp'] || state.keys['w']) {
        state.ship.y = Math.max(0, state.ship.y - 5);
      }
      if (state.keys['ArrowDown'] || state.keys['s']) {
        state.ship.y = Math.min(canvas.height - 40, state.ship.y + 5);
      }

      // Draw ship (triangle)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(state.ship.x, state.ship.y + 20);
      ctx.lineTo(state.ship.x + 40, state.ship.y + 10);
      ctx.lineTo(state.ship.x + 40, state.ship.y + 30);
      ctx.closePath();
      ctx.stroke();

      // Draw engine glow
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(state.ship.x, state.ship.y + 20);
      ctx.lineTo(state.ship.x - 10, state.ship.y + 20);
      ctx.stroke();

      // Spawn asteroids
      if (Date.now() - state.lastAsteroidTime > 1500) {
        spawnAsteroid();
        state.lastAsteroidTime = Date.now();
      }

      // Update and draw asteroids
      state.asteroids = state.asteroids.filter(asteroid => {
        asteroid.x -= asteroid.speed;
        asteroid.rotation += asteroid.rotationSpeed;

        // Draw asteroid (wireframe polygon)
        ctx.save();
        ctx.translate(asteroid.x, asteroid.y);
        ctx.rotate(asteroid.rotation);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const sides = 6;
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2;
          const x = Math.cos(angle) * asteroid.size;
          const y = Math.sin(angle) * asteroid.size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

        // Check collision with ship
        const dx = asteroid.x - state.ship.x;
        const dy = asteroid.y - state.ship.y;
        if (Math.sqrt(dx * dx + dy * dy) < asteroid.size + 20) {
          setGameActive(false);
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('noirSpaceHighScore', score.toString());
          }
          return false;
        }

        return asteroid.x > -50;
      });

      // Update and draw bullets
      state.bullets = state.bullets.filter(bullet => {
        bullet.x += bullet.speed;

        // Draw bullet
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bullet.x, bullet.y, 6, 2);

        // Check collision with asteroids
        let hit = false;
        state.asteroids = state.asteroids.filter(asteroid => {
          const dx = bullet.x - asteroid.x;
          const dy = bullet.y - asteroid.y;
          if (Math.sqrt(dx * dx + dy * dy) < asteroid.size) {
            createExplosion(asteroid.x, asteroid.y);
            setScore(s => s + 10);
            hit = true;
            return false;
          }
          return true;
        });

        return bullet.x < canvas.width && !hit;
      });

      // Update and draw particles
      state.particles = state.particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;

        ctx.fillStyle = `rgba(255, 255, 255, ${particle.life})`;
        ctx.fillRect(particle.x, particle.y, 2, 2);

        return particle.life > 0;
      });

      // Draw grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      state.animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('click', handleClick);
      if (state.animationId) {
        cancelAnimationFrame(state.animationId);
      }
    };
  }, [gameActive, score, highScore]);

  const startGame = () => {
    setScore(0);
    setGameActive(true);
    setGameOver(false);
    gameStateRef.current = {
      ship: { x: 100, y: 300 },
      asteroids: [],
      bullets: [],
      particles: [],
      keys: {},
      lastAsteroidTime: Date.now(),
      animationId: null
    };
  };

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-white text-[14px] uppercase tracking-[0.3em] font-bold mb-2 opacity-70">
          Interactive Experience
        </p>
        <h2 className="text-white font-bold text-[40px] sm:text-[60px] mt-2 uppercase tracking-tight shadow-text">
          Space Shooter
        </h2>
        <div className="w-24 h-1 bg-white mt-4 shadow-noir" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10"
      >
        <div className="noir-card p-8 backdrop-blur-sm relative overflow-hidden">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/20" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/20" />

          <div className="relative z-10">
            {/* Game Stats */}
            <div className="flex justify-between items-center mb-6 text-white">
              <div className="noir-card px-6 py-3 backdrop-blur-sm">
                <span className="text-xs uppercase tracking-[0.2em] text-gray-400">Score</span>
                <div className="text-3xl font-bold noir-glow">{score}</div>
              </div>
              <div className="noir-card px-6 py-3 backdrop-blur-sm">
                <span className="text-xs uppercase tracking-[0.2em] text-gray-400">High Score</span>
                <div className="text-3xl font-bold">{highScore}</div>
              </div>
            </div>

            {/* Game Canvas */}
            <div className="relative w-full h-[500px] border-2 border-white bg-black overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full h-full"
              />

              {/* Start/Game Over Overlay */}
              <AnimatePresence>
                {(!gameActive || gameOver) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10"
                  >
                    {gameOver && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center mb-8"
                      >
                        <h3 className="text-white text-4xl font-bold mb-4 noir-glow">
                          MISSION FAILED
                        </h3>
                        <p className="text-gray-400 text-xl">Final Score: {score}</p>
                        {score > highScore && (
                          <p className="text-white text-sm mt-2 uppercase tracking-wider">
                            New High Score!
                          </p>
                        )}
                      </motion.div>
                    )}

                    {!gameOver && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center mb-8"
                      >
                        <h3 className="text-white text-5xl font-bold mb-6 noir-glow flicker">
                          NOIR SPACE
                        </h3>
                        <div className="text-gray-400 text-sm uppercase tracking-wider space-y-2 mb-8">
                          <p>↑ ↓ or W S - Move Ship</p>
                          <p>SPACE or CLICK - Shoot</p>
                          <p>Destroy Asteroids - Survive</p>
                        </div>
                      </motion.div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startGame}
                      className="noir-button px-12 py-4 text-lg"
                    >
                      {gameOver ? 'Play Again' : 'Start Mission'}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Instructions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-xs uppercase tracking-wider">
              <div className="noir-card p-4">
                <span className="text-white font-bold">Controls</span>
                <p className="text-gray-400 mt-2">Arrow Keys / W,S</p>
              </div>
              <div className="noir-card p-4">
                <span className="text-white font-bold">Shoot</span>
                <p className="text-gray-400 mt-2">Space / Click</p>
              </div>
              <div className="noir-card p-4">
                <span className="text-white font-bold">Objective</span>
                <p className="text-gray-400 mt-2">Destroy Asteroids</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(SpaceGame, "game");