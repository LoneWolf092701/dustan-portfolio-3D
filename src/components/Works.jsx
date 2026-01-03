// src/components/Works.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionWrapper from "../hoc/SectionWrapper";
import { projects } from "../constants";

const ProjectCard = ({ index, name, description, tags, source_code_link, live_link }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="noir-card p-6 sm:w-[360px] w-full backdrop-blur-sm overflow-hidden relative">
        
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/20" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/20" />
        
        <div className="relative z-10">
          {/* Project Number */}
          <div className="text-white text-xs font-bold mb-4 border border-white px-3 py-1 inline-block tracking-[0.2em]">
            PROJECT {String(index + 1).padStart(2, '0')}
          </div>

          {/* Project Image Container */}
          <div className="relative w-full h-[200px] mb-5 overflow-hidden border-2 border-noir-700 group-hover:border-white/50 transition-all">
            <div className="w-full h-full bg-gradient-to-br from-noir-900 to-noir-800 flex items-center justify-center relative overflow-hidden">
              <div className="relative z-10 text-6xl font-bold text-white opacity-10">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>

            {/* Overlay on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/90 flex items-center justify-center gap-3"
                >
                  {source_code_link && (
                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ delay: 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open(source_code_link, "_blank")}
                      className="noir-button px-5 py-2 text-xs"
                    >
                      View Code
                    </motion.button>
                  )}
                  {live_link && (
                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open(live_link, "_blank")}
                      className="px-5 py-2 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-transparent hover:text-white border-2 border-white transition-all"
                    >
                      Live Demo
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Project Details */}
          <div>
            <h3 className="text-white font-bold text-[20px] mb-3 group-hover:text-white transition-colors uppercase tracking-wider">
              {name}
            </h3>
            <div className="w-12 h-[2px] bg-white mb-3" />
            <p className="text-gray-400 text-[13px] leading-relaxed">
              {description}
            </p>
          </div>

          {/* Tags */}
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.name}
                className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-black border border-white/50 text-white"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Works = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-white text-[14px] uppercase tracking-[0.3em] font-bold mb-2 opacity-70">
          My Work
        </p>
        <h2 className="text-white font-bold text-[40px] sm:text-[60px] mt-2 uppercase tracking-tight shadow-text">
          Projects
        </h2>
        <div className="w-24 h-1 bg-white mt-4 shadow-noir" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full flex"
      >
        <div className="mt-6 border-l-4 border-white pl-6">
          <p className="text-gray-300 text-[16px] max-w-3xl leading-[32px]">
            The following projects showcase real-world problem-solving abilities, 
            technology implementation, and project management capabilities. Each includes 
            code repositories and live demonstrations where available.
          </p>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <div className="mt-20 flex flex-wrap gap-7 justify-center">
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 text-center"
      >
        <div className="noir-card p-8 inline-block backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-6 uppercase tracking-[0.2em]">
            More Projects Available
          </p>
          <a
            href="https://github.com/LoneWolf092701"
            target="_blank"
            rel="noopener noreferrer"
            className="noir-button px-8 py-3 text-sm inline-block"
          >
            Visit GitHub
          </a>
        </div>
      </motion.div>

      {/* Project Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 p-6 noir-card backdrop-blur-sm"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-white font-bold text-xl mb-1">{projects.length}</div>
            <div className="text-gray-400 text-xs uppercase tracking-[0.2em]">Total Projects</div>
          </div>
          <div>
            <div className="text-white font-bold text-xl mb-1">100%</div>
            <div className="text-gray-400 text-xs uppercase tracking-[0.2em]">Completion</div>
          </div>
          <div>
            <div className="text-white font-bold text-xl mb-1">Full</div>
            <div className="text-gray-400 text-xs uppercase tracking-[0.2em]">Stack</div>
          </div>
          <div>
            <div className="text-white font-bold text-xl mb-1">Open</div>
            <div className="text-gray-400 text-xs uppercase tracking-[0.2em]">Source</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Works, "");