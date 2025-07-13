import React, { useEffect, useRef, useState } from 'react';
import { personalInfo, coreValues } from '../data/mockData';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-background to-muted/10 relative overflow-hidden"
    >
      {/* Subtle top decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className={`space-y-8 transform transition-all duration-500 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                À propos de{' '}
                <span className="text-muted-foreground">
                  moi
                </span>
              </h2>
              <div className="w-20 h-0.5 bg-foreground rounded-full mb-8"></div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {personalInfo.description}
            </p>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground mb-6">Mes valeurs clés</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coreValues.map((value, index) => (
                  <div 
                    key={index}
                    className={`group p-4 bg-muted/30 rounded-lg border border-border hover:border-foreground transition-all duration-300 hover:scale-102 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                      <span className="text-foreground font-medium">
                        {value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className={`relative transform transition-all duration-500 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
            <div className="relative">
              {/* Main card */}
              <div className="bg-card border border-border p-8 rounded-xl">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 dark:text-green-400 font-medium">En ligne et disponible</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Projets réalisés</span>
                      <span className="text-foreground font-bold text-xl">50+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Clients satisfaits</span>
                      <span className="text-foreground font-bold text-xl">30+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Années d'expérience</span>
                      <span className="text-foreground font-bold text-xl">5+</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-muted-foreground text-sm italic">
                      "Transformer les idées en systèmes puissants et les visions en résultats concrets."
                    </p>
                  </div>
                </div>
              </div>

              {/* Subtle floating elements */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-muted-foreground rounded-full opacity-20 animate-float-gentle"></div>
              <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-muted-foreground rounded-full opacity-15 animate-float-gentle animation-delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;