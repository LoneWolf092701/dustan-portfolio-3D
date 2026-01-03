// src/components/Hero.jsx
import { motion } from "framer-motion";
import HeroCanvas from "../canvas/HeroCanvas";

const Hero = () => {
  const scrollToNext = () => {
    const aboutSection = document.getElementById('about');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full h-screen mx-auto overflow-hidden bg-black">
      
      {/* Text Overlay */}
      <div className="absolute inset-0 top-[120px] max-w-7xl mx-auto px-6 flex flex-row items-start gap-5 z-10 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center items-center mt-5"
        >
          <div className="w-5 h-5 bg-white shadow-noir relative">
            <div className="absolute inset-0 bg-white animate-ping opacity-50" />
          </div>
          <div className="w-[2px] sm:h-80 h-40 bg-gradient-to-b from-white via-gray-500 to-transparent" />
        </motion.div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <span className="text-white text-sm tracking-[0.3em] uppercase opacity-70">Introduction</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white font-bold text-4xl sm:text-5xl lg:text-7xl tracking-tight shadow-text"
          >
            Hi, I'm <span className="noir-glow flicker">Kaladaran</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 text-gray-300 text-base lg:text-xl max-w-3xl leading-relaxed"
          >
            <p className="mb-3 border-l-2 border-white pl-4">
              I craft <span className="text-white font-semibold">immersive 3D experiences</span>
            </p>
            <p className="mb-3 border-l-2 border-gray-500 pl-4">
              Design <span className="text-white font-semibold">innovative algorithms</span>
            </p>
            <p className="border-l-2 border-white pl-4">
              Build <span className="text-white font-semibold">scalable full-stack systems</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-10 flex gap-6 pointer-events-auto flex-wrap"
          >
            <a 
              href="#contact"
              className="noir-button px-8 py-3 text-sm"
            >
              Get In Touch
            </a>
            <a 
              href="#work"
              className="px-8 py-3 bg-white text-black font-bold uppercase tracking-[0.2em] hover:bg-transparent hover:text-white border-2 border-white transition-all text-sm"
            >
              View Work
            </a>
          </motion.div>
        </div>
      </div>

      {/* The 3D Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <HeroCanvas />
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 w-full flex flex-col items-center z-10 gap-3"
      >
        <span className="text-white text-xs uppercase tracking-[0.3em]">Scroll</span>
        <button 
          onClick={scrollToNext}
          className="w-[2px] h-[50px] bg-gradient-to-b from-white to-transparent relative cursor-pointer group"
          aria-label="Scroll down"
        >
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white shadow-noir"
          />
        </button>
      </motion.div>

      {/* Corner Decorations */}
      <div className="absolute top-20 left-6 w-20 h-20 border-t-2 border-l-2 border-white/30" />
      <div className="absolute bottom-10 right-6 w-20 h-20 border-b-2 border-r-2 border-white/30" />
    </section>
  );
};

export default Hero;