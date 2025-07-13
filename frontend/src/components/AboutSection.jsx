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
      className="py-20 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                À propos de{' '}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  moi
                </span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-8"></div>
            </div>

            <p className="text-lg text-gray-300 leading-relaxed">
              {personalInfo.description}
            </p>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-white mb-6">Mes valeurs clés</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coreValues.map((value, index) => (
                  <div 
                    key={index}
                    className={`group p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                      <span className="text-white font-medium group-hover:text-purple-300 transition-colors duration-300">
                        {value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative">
              {/* Main card */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-medium">En ligne et disponible</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Projets réalisés</span>
                      <span className="text-white font-bold text-xl">50+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Clients satisfaits</span>
                      <span className="text-white font-bold text-xl">30+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Années d'expérience</span>
                      <span className="text-white font-bold text-xl">5+</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-gray-300 text-sm italic">
                      "Transformer les idées en systèmes puissants et les visions en résultats concrets."
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-500 rounded-full opacity-70 animate-float"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-500 rounded-full opacity-70 animate-float animation-delay-1000"></div>
              <div className="absolute top-1/2 -right-6 w-4 h-4 bg-pink-500 rounded-full opacity-60 animate-float animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;