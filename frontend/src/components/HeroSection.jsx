import React from 'react';
import { Button } from './ui/button';
import { Instagram, Linkedin, Send, Github } from 'lucide-react';
import { personalInfo } from '../data/mockData';

const HeroSection = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Parallax elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full opacity-60 animate-float"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full opacity-80 animate-float animation-delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-70 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 right-40 w-1 h-1 bg-pink-400 rounded-full opacity-60 animate-float animation-delay-3000"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Portrait */}
        <div className="mb-8 transform transition-all duration-1000 hover:scale-105">
          <div className="relative inline-block">
            <div className="w-48 h-48 md:w-56 md:h-56 mx-auto rounded-full overflow-hidden border-4 border-gradient-to-r from-purple-500 to-blue-500 p-1 bg-gradient-to-r from-purple-500 to-blue-500">
              <img 
                src={personalInfo.portrait}
                alt={personalInfo.name}
                className="w-full h-full object-cover rounded-full bg-gray-800"
              />
            </div>
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-30 blur-lg animate-pulse"></div>
          </div>
        </div>

        {/* Name */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            {personalInfo.name}
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in animation-delay-500">
          {personalInfo.tagline}
        </p>

        {/* CTA Button */}
        <div className="mb-12 animate-fade-in animation-delay-1000">
          <Button 
            onClick={() => scrollToSection('about')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            Découvrir mon univers
            <span className="ml-2 animate-bounce">↓</span>
          </Button>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 animate-fade-in animation-delay-1500">
          <a 
            href={personalInfo.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700 hover:border-pink-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/25"
          >
            <Instagram className="w-6 h-6 text-gray-400 group-hover:text-pink-400 transition-colors" />
          </a>
          <a 
            href={personalInfo.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <Linkedin className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
          </a>
          <a 
            href={personalInfo.socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            <Send className="w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
          </a>
          <a 
            href={personalInfo.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700 hover:border-gray-400 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gray-400/25"
          >
            <Github className="w-6 h-6 text-gray-400 group-hover:text-gray-300 transition-colors" />
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;