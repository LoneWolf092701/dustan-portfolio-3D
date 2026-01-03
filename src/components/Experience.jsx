// src/components/Experience.jsx
import React from "react";
import { motion } from "framer-motion";
import SectionWrapper from "../hoc/SectionWrapper";
import { experiences } from "../constants";

const ExperienceCard = ({ experience, index }) => (
  <motion.div
    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    className="flex flex-col md:flex-row gap-6 mb-12 relative group"
  >
    {/* Timeline */}
    <div className="flex flex-col items-center mr-4 md:mr-8 relative">
      <motion.div 
        whileHover={{ scale: 1.2 }}
        className="w-6 h-6 bg-black border-2 border-white shadow-noir relative z-10 flex items-center justify-center"
      >
        <div className="w-2 h-2 bg-white animate-ping" />
      </motion.div>
      {index !== experiences.length - 1 && (
        <motion.div 
          initial={{ height: 0 }}
          whileInView={{ height: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
          className="w-[2px] bg-gradient-to-b from-white via-gray-500 to-transparent my-2 absolute top-6"
          style={{ minHeight: "80px" }}
        />
      )}
    </div>

    {/* Content Card */}
    <motion.div 
      whileHover={{ x: 5 }}
      transition={{ duration: 0.2 }}
      className="noir-card p-6 w-full backdrop-blur-sm relative overflow-hidden spotlight"
    >
      
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/20" />
      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/20" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
          <div className="flex-1">
            <h3 className="text-white text-[22px] font-bold mb-2 group-hover:text-white transition-colors uppercase tracking-wider">
              {experience.title}
            </h3>
            <p className="text-gray-300 text-[16px] font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-white" />
              {experience.company_name}
            </p>
          </div>
          <div className="mt-3 md:mt-0">
            <div className="inline-block px-4 py-2 bg-black border border-white/50 text-white text-[11px] uppercase tracking-[0.2em]">
              {experience.date}
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-white via-gray-500 to-transparent mb-4" />

        <ul className="space-y-3">
          {experience.points.map((point, idx) => (
            <motion.li
              key={`experience-point-${idx}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.2 + idx * 0.1 }}
              className="text-gray-400 text-[14px] tracking-wide leading-relaxed flex items-start gap-3"
            >
              <span className="text-white mt-1 flex-shrink-0 font-bold">{idx + 1}.</span>
              <span>{point}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  </motion.div>
);

const Experience = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-white text-[14px] uppercase tracking-[0.3em] font-bold mb-2 opacity-70">
          What I Have Done
        </p>
        <h2 className="text-white font-bold text-[40px] sm:text-[60px] mt-2 uppercase tracking-tight shadow-text">
          Experience
        </h2>
        <div className="w-24 h-1 bg-white mt-4 shadow-noir" />
      </motion.div>

      <div className="mt-20 flex flex-col relative">
        {experiences.map((experience, index) => (
          <ExperienceCard key={index} experience={experience} index={index} />
        ))}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-12 p-6 noir-card backdrop-blur-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-white text-2xl font-bold mb-1">1+ Years</div>
            <div className="text-gray-400 text-xs uppercase tracking-[0.2em]">Total Experience</div>
          </div>
          <div>
            <div className="text-white text-2xl font-bold mb-1">Available</div>
            <div className="text-gray-400 text-xs uppercase tracking-[0.2em]">Current Status</div>
          </div>
          <div>
            <div className="text-white text-2xl font-bold mb-1">Open</div>
            <div className="text-gray-400 text-xs uppercase tracking-[0.2em]">For Opportunities</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Experience, "work");