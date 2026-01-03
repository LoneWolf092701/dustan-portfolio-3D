// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "../constants";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`w-full flex items-center py-5 fixed top-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-black/95 border-b border-white/30 shadow-noir" : "bg-transparent"
    }`}>
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto px-6">
        
        {/* Logo / Name */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 cursor-pointer group" 
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-black border-2 border-white flex items-center justify-center font-bold text-white shadow-noir">
              K
            </div>
          </div>
          <div>
            <p className="text-white text-[20px] font-bold cursor-pointer tracking-widest">
              KALADARAN
            </p>
            <p className="text-gray-400 text-[10px] sm:block hidden tracking-[0.3em] uppercase">
              Full Stack Developer
            </p>
          </div>
        </motion.div>

        {/* Desktop Menu */}
        <motion.ul 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="list-none hidden sm:flex flex-row gap-10"
        >
          {navLinks.map((link, index) => (
            <motion.li
              key={link.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              className={`${
                active === link.title ? "text-white" : "text-gray-400"
              } hover:text-white text-[16px] font-medium cursor-pointer transition-all relative group uppercase tracking-[0.2em]`}
              onClick={() => setActive(link.title)}
            >
              <a href={`#${link.id}`}>
                {link.title}
              </a>
              <span className={`absolute -bottom-2 left-0 h-[2px] bg-white transition-all duration-300 ${
                active === link.title ? "w-full shadow-noir" : "w-0 group-hover:w-full"
              }`} />
            </motion.li>
          ))}
        </motion.ul>

        {/* Mobile Menu */}
        <div className="sm:hidden flex flex-1 justify-end items-center">
          <button
            className="w-10 h-10 flex flex-col justify-center items-center cursor-pointer relative z-50 border border-white/50 hover:border-white transition-all"
            onClick={() => setToggle(!toggle)}
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-[2px] bg-white transition-all duration-300 ${toggle ? 'rotate-45 translate-y-[3px]' : ''}`} />
            <span className={`w-6 h-[2px] bg-white my-1 transition-all duration-300 ${toggle ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-[2px] bg-white transition-all duration-300 ${toggle ? '-rotate-45 -translate-y-[3px]' : ''}`} />
          </button>

          <AnimatePresence>
            {toggle && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 right-0 h-screen w-[75vw] bg-black border-l-2 border-white/30 shadow-noir-strong"
              >
                <ul className="list-none flex flex-col gap-8 p-8 pt-24 relative z-10">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`${
                        active === link.title ? "text-white" : "text-gray-400"
                      } text-[20px] font-medium cursor-pointer hover:text-white transition-colors uppercase tracking-widest border-l-2 border-transparent hover:border-white pl-4`}
                      onClick={() => {
                        setToggle(false);
                        setActive(link.title);
                      }}
                    >
                      <a href={`#${link.id}`}>
                        {link.title}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;