// src/components/Contact.jsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import SectionWrapper from "../hoc/SectionWrapper";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!form.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
      
      setTimeout(() => setSubmitted(false), 5000);
    }, 2000);
  };

  return (
    <div className="xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex-[0.75] noir-card p-8 backdrop-blur-sm relative overflow-hidden"
      >
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-white/20" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-white/20" />
        
        <div className="relative z-10">
          <p className="text-white text-[14px] uppercase tracking-[0.3em] font-bold mb-2 opacity-70">
            Get In Touch
          </p>
          <h3 className="text-white font-bold text-[40px] sm:text-[50px] mb-6 uppercase tracking-tight shadow-text">
            Contact
          </h3>
          <div className="w-24 h-1 bg-white mb-8 shadow-noir" />

          <form ref={formRef} onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
            <label className="flex flex-col">
              <span className="text-white font-medium mb-3 uppercase text-sm tracking-wider">
                Your Name
              </span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={`bg-black py-4 px-6 placeholder:text-gray-600 text-white outline-none border-2 ${
                  errors.name ? "border-red-500" : "border-white/50 focus:border-white"
                } transition-colors`}
              />
              {errors.name && (
                <span className="text-red-500 text-xs mt-2">{errors.name}</span>
              )}
            </label>

            <label className="flex flex-col">
              <span className="text-white font-medium mb-3 uppercase text-sm tracking-wider">
                Your Email
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`bg-black py-4 px-6 placeholder:text-gray-600 text-white outline-none border-2 ${
                  errors.email ? "border-red-500" : "border-white/50 focus:border-white"
                } transition-colors`}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-2">{errors.email}</span>
              )}
            </label>

            <label className="flex flex-col">
              <span className="text-white font-medium mb-3 uppercase text-sm tracking-wider">
                Your Message
              </span>
              <textarea
                rows={7}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Enter your message"
                className={`bg-black py-4 px-6 placeholder:text-gray-600 text-white outline-none border-2 ${
                  errors.message ? "border-red-500" : "border-white/50 focus:border-white"
                } resize-none transition-colors`}
              />
              {errors.message && (
                <span className="text-red-500 text-xs mt-2">{errors.message}</span>
              )}
            </label>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`noir-button py-3 px-8 outline-none w-full sm:w-fit transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white/10 border-2 border-white"
              >
                <p className="text-white font-medium text-sm">
                  Thank you! Your message has been sent successfully.
                </p>
              </motion.div>
            )}
          </form>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        <div className="noir-card w-full h-full flex flex-col justify-center p-8 backdrop-blur-sm relative overflow-hidden">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/20" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/20" />
          
          <div className="text-center space-y-6 relative z-10">
            <div className="text-6xl mb-6 text-white noir-glow flicker">✉</div>
            <h4 className="text-white text-2xl font-bold uppercase tracking-wider shadow-text">
              Let's Connect
            </h4>
            <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
              I'm always open to discussing new projects, creative ideas, or opportunities 
              to be part of your vision. Response time: 24-48 hours.
            </p>
            
            <div className="space-y-4 mt-8">
              <motion.a
                whileHover={{ x: 5 }}
                href="mailto:kaladaranchanthirakumar@gmail.com"
                className="flex items-center justify-center gap-3 text-gray-300 hover:text-white transition-colors text-sm border-l-2 border-transparent hover:border-white pl-4"
              >
                <span className="text-white font-bold">EMAIL</span>
                <span>kaladaranchanthirakumar@gmail.com</span>
              </motion.a>
              
              <motion.a
                whileHover={{ x: 5 }}
                href="tel:+94761962266"
                className="flex items-center justify-center gap-3 text-gray-300 hover:text-white transition-colors text-sm border-l-2 border-transparent hover:border-white pl-4"
              >
                <span className="text-white font-bold">PHONE</span>
                <span>+94 76 196 2266</span>
              </motion.a>
              
              <div className="flex items-center justify-center gap-3 text-gray-300 text-sm pl-4">
                <span className="text-white font-bold">LOCATION</span>
                <span>Colombo, Sri Lanka</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center mt-8 pt-8 border-t border-white/20">
              <motion.a
                whileHover={{ scale: 1.1, y: -5 }}
                href="https://github.com/LoneWolf092701"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-black border-2 border-white/50 hover:border-white flex items-center justify-center transition-all"
              >
                <span className="text-white font-bold text-xs">GH</span>
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.1, y: -5 }}
                href="https://linkedin.com/in/kaladaran-chanthirakumar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-black border-2 border-white/50 hover:border-white flex items-center justify-center transition-all"
              >
                <span className="text-white font-bold text-xs">LI</span>
              </motion.a>
            </div>

            {/* Status */}
            <div className="mt-8 p-4 bg-black border border-white/30 text-xs">
              <p className="text-white">
                <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                STATUS: AVAILABLE
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");