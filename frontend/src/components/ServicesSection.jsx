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
      className="py-20 bg-gradient-to-b from-muted/10 to-background relative overflow-hidden"
    >
      {/* Subtle decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className={`text-center mb-16 transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Mes{' '}
            <span className="text-muted-foreground">
              Services
            </span>
          </h2>
          <div className="w-24 h-0.5 bg-foreground rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Des solutions sur mesure pour transformer vos idées en succès concrets
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={service.id}
              className={`group bg-card border-border hover:border-foreground transition-all duration-300 hover:scale-102 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-3xl group-hover:scale-105 transition-transform duration-200">
                    {service.icon}
                  </div>
                  <div className="w-1.5 h-1.5 bg-foreground rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                </div>
                <CardTitle className="text-xl text-foreground">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground font-medium italic">
                  {service.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, featureIndex) => (
                      <Badge 
                        key={featureIndex}
                        variant="secondary"
                        className="bg-muted text-muted-foreground hover:bg-foreground hover:text-background transition-colors duration-200"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transform transition-all duration-500 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-card border border-border p-8 rounded-xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Prêt à transformer votre vision en réalité ?
            </h3>
            <p className="text-muted-foreground mb-6">
              Discutons de votre projet et découvrons ensemble comment je peux vous aider à atteindre vos objectifs.
            </p>
            <button className="bg-foreground text-background hover:bg-foreground/90 px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-102">
              Discutons de votre projet
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;