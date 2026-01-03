// src/components/Footer.jsx
import React from "react";
import { motion } from "framer-motion";
import { navLinks } from "../constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t-2 border-white/30 mt-20 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-black border-2 border-white flex items-center justify-center font-bold text-white shadow-noir text-xl">
                  K
                </div>
              </div>
              <div>
                <h3 className="text-white text-lg font-bold uppercase tracking-wider">
                  Kaladaran
                </h3>
                <p className="text-gray-400 text-xs tracking-[0.2em] uppercase">Developer</p>
              </div>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm border-l-2 border-white/30 pl-4">
              Full Stack Developer & Game Development Researcher crafting innovative solutions 
              and immersive experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-sm tracking-wider flex items-center gap-2">
              <span className="w-2 h-4 bg-white" />
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="text-gray-400 hover:text-white transition-colors text-xs uppercase tracking-wider flex items-center gap-2 group"
                  >
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-sm tracking-wider flex items-center gap-2">
              <span className="w-2 h-4 bg-white" />
              Connect
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:kaladaranchanthirakumar@gmail.com"
                className="text-gray-400 hover:text-white transition-colors text-xs flex items-center gap-2 group"
              >
                <span className="text-white">EMAIL:</span>
                <span className="truncate">kaladaranchanthirakumar@gmail.com</span>
              </a>
              <a
                href="https://github.com/LoneWolf092701"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors text-xs flex items-center gap-2 group"
              >
                <span className="text-white">GITHUB:</span>
                LoneWolf092701
              </a>
              <a
                href="https://linkedin.com/in/kaladaran-chanthirakumar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors text-xs flex items-center gap-2 group"
              >
                <span className="text-white">LINKEDIN:</span>
                kaladaran-chanthirakumar
              </a>
            </div>

            {/* Status */}
            <div className="mt-6 p-3 bg-noir-900 border border-white/30 text-xs">
              <p className="text-white flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
                AVAILABLE FOR HIRE
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {currentYear} KALADARAN CHANTHIRAKUMAR. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <span>BUILT WITH</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white"
            >
              ♥
            </motion.span>
            <span>REACT + TAILWIND + THREE.JS</span>
          </div>
        </div>

        {/* Version */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-xs">
            VERSION 2.0.0 | NOIR EDITION | STATUS: STABLE
          </p>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-white/20" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-white/20" />
    </footer>
  );
};

export default Footer;