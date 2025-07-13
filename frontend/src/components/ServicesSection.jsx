import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { services } from '../data/mockData';

const ServicesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="services" 
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Mes{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Des solutions sur mesure pour transformer vos idées en succès concrets
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={service.id}
              className={`group bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-purple-500 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                </div>
                <CardTitle className="text-xl text-white group-hover:text-purple-300 transition-colors duration-300">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-purple-400 font-medium italic">
                  {service.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, featureIndex) => (
                      <Badge 
                        key={featureIndex}
                        variant="secondary"
                        className="bg-gray-700/50 text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 transition-colors duration-300"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Prêt à transformer votre vision en réalité ?
            </h3>
            <p className="text-gray-300 mb-6">
              Discutons de votre projet et découvrons ensemble comment je peux vous aider à atteindre vos objectifs.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
              Discutons de votre projet
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;