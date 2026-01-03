// src/components/Skills.jsx
import React from "react";
import { motion } from "framer-motion";
import SectionWrapper from "../hoc/SectionWrapper";

const skillCategories = [
  {
    category: "Frontend",
    skills: [
      { name: "React.js", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "Tailwind CSS", level: 90 },
      { name: "React Native", level: 80 }
    ]
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", level: 85 },
      { name: ".NET Core", level: 80 },
      { name: "Express.js", level: 85 },
      { name: "RESTful APIs", level: 90 }
    ]
  },
  {
    category: "Game Development",
    skills: [
      { name: "Unity Engine", level: 85 },
      { name: "C#", level: 88 },
      { name: "Procedural Gen", level: 90 },
      { name: "3D Graphics", level: 75 }
    ]
  },
  {
    category: "Database & Tools",
    skills: [
      { name: "MSSQL", level: 85 },
      { name: "MySQL", level: 80 },
      { name: "Azure", level: 75 },
      { name: "Git/GitHub", level: 90 }
    ]
  }
];

const technologies = [
  "JavaScript", "TypeScript", "React", "Node.js",
  "C#", "Unity", ".NET", "Python",
  "SQL", "Azure", "Docker", "Git"
];

const SkillBar = ({ skill, index, categoryIndex }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: categoryIndex * 0.1 + index * 0.05 }}
    className="mb-6"
  >
    <div className="flex justify-between mb-2">
      <span className="text-gray-300 text-sm uppercase tracking-wider">{skill.name}</span>
      <span className="text-white font-bold text-sm">{skill.level}%</span>
    </div>
    <div className="w-full h-2 bg-noir-800 border border-noir-600 overflow-hidden relative">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${skill.level}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: categoryIndex * 0.1 + index * 0.05 + 0.3 }}
        className="h-full bg-white shadow-noir relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      </motion.div>
    </div>
  </motion.div>
);

const TechBadge = ({ tech, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    whileHover={{ scale: 1.05, y: -5 }}
    className="noir-card px-5 py-3 backdrop-blur-sm cursor-pointer relative overflow-hidden spotlight"
  >
    <span className="text-white font-medium text-sm uppercase tracking-wider">{tech}</span>
  </motion.div>
);

const Skills = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto relative">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-white text-[14px] uppercase tracking-[0.3em] font-bold mb-2 opacity-70">
          My Capabilities
        </p>
        <h2 className="text-white font-bold text-[40px] sm:text-[60px] mt-2 uppercase tracking-tight shadow-text">
          Skills
        </h2>
        <div className="w-24 h-1 bg-white mt-4 shadow-noir" />
      </motion.div>

      {/* Skill Bars */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            className="noir-card p-8 backdrop-blur-sm relative overflow-hidden"
          >
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20" />
            
            <div className="relative z-10">
              <h3 className="text-white text-xl font-bold mb-6 uppercase tracking-wider flex items-center gap-3">
                <span className="w-2 h-8 bg-white shadow-noir" />
                {category.category}
              </h3>
              <div>
                {category.skills.map((skill, index) => (
                  <SkillBar
                    key={skill.name}
                    skill={skill}
                    index={index}
                    categoryIndex={categoryIndex}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Technology Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-20"
      >
        <h3 className="text-white text-2xl font-bold mb-8 uppercase tracking-wider text-center">
          Technologies
        </h3>
        <div className="flex flex-wrap gap-4 justify-center">
          {technologies.map((tech, index) => (
            <TechBadge key={tech} tech={tech} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 p-6 noir-card backdrop-blur-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-white font-bold text-2xl mb-1">4</div>
            <div className="text-gray-400 text-xs uppercase tracking-[0.2em]">Categories</div>
          </div>
          <div>
            <div className="text-white font-bold text-2xl mb-1">16</div>
            <div className="text-gray-400 text-xs uppercase tracking-[0.2em]">Core Skills</div>
          </div>
          <div>
            <div className="text-white font-bold text-2xl mb-1">12</div>
            <div className="text-gray-400 text-xs uppercase tracking-[0.2em]">Technologies</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Skills, "skills");