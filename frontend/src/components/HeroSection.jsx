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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Subtle animated background */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute top-0 left-0 w-72 h-72 bg-foreground rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-foreground rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-foreground rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Minimal floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-1 h-1 bg-foreground rounded-full opacity-40 animate-float-gentle"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-foreground rounded-full opacity-30 animate-float-gentle animation-delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-1 h-1 bg-foreground rounded-full opacity-35 animate-float-gentle animation-delay-2000"></div>
        <div className="absolute bottom-20 right-40 w-1 h-1 bg-foreground rounded-full opacity-25 animate-float-gentle animation-delay-3000"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Portrait */}
        <div className="mb-8 transform transition-all duration-300 hover:scale-102">
          <div className="relative inline-block">
            <div className="w-48 h-48 md:w-56 md:h-56 mx-auto rounded-full overflow-hidden border-2 border-border">
              <img 
                src={personalInfo.portrait}
                alt={personalInfo.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -inset-2 rounded-full border border-border opacity-20 animate-pulse"></div>
          </div>
        </div>

        {/* Name */}
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in-gentle">
          {personalInfo.name}
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-gentle animation-delay-300">
          {personalInfo.tagline}
        </p>

        {/* CTA Button */}
        <div className="mb-12 animate-fade-in-gentle animation-delay-600">
          <Button 
            onClick={() => scrollToSection('about')}
            className="bg-foreground text-background hover:bg-foreground/90 px-8 py-4 text-lg rounded-lg transition-all duration-200 hover:scale-102"
          >
            Découvrir mon univers
            <span className="ml-2 animate-bounce-gentle">↓</span>
          </Button>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-4 animate-fade-in-gentle animation-delay-900">
          <a 
            href={personalInfo.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 bg-muted/50 rounded-full border border-border hover:border-foreground transition-all duration-200 hover:scale-105"
          >
            <Instagram className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </a>
          <a 
            href={personalInfo.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 bg-muted/50 rounded-full border border-border hover:border-foreground transition-all duration-200 hover:scale-105"
          >
            <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </a>
          <a 
            href={personalInfo.socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 bg-muted/50 rounded-full border border-border hover:border-foreground transition-all duration-200 hover:scale-105"
          >
            <Send className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </a>
          <a 
            href={personalInfo.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 bg-muted/50 rounded-full border border-border hover:border-foreground transition-all duration-200 hover:scale-105"
          >
            <Github className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;