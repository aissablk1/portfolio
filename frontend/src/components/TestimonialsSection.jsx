import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '../data/mockData';

const TestimonialsSection = () => {
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
      id="testimonials" 
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-muted/10 to-background relative overflow-hidden"
    >
      {/* Subtle decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className={`text-center mb-16 transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ils m'ont fait{' '}
            <span className="text-muted-foreground">
              confiance
            </span>
          </h2>
          <div className="w-24 h-0.5 bg-foreground rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez ce que mes clients disent de notre collaboration
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className={`group bg-card border-border hover:border-foreground transition-all duration-300 hover:scale-102 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 space-y-4">
                {/* Quote Icon */}
                <div className="flex justify-between items-start">
                  <Quote className="w-6 h-6 text-muted-foreground opacity-50" />
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-4 h-4 text-foreground fill-current" 
                      />
                    ))}
                  </div>
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-muted-foreground leading-relaxed italic">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center space-x-4 pt-4 border-t border-border">
                  <div className="relative">
                    <img 
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-border group-hover:border-foreground transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <h4 className="text-foreground font-semibold">
                      {testimonial.name}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {testimonial.role}
                    </p>
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
              Prêt à rejoindre mes clients satisfaits ?
            </h3>
            <p className="text-muted-foreground mb-6">
              Commençons par une conversation pour comprendre vos besoins et objectifs.
            </p>
            <button className="bg-foreground text-background hover:bg-foreground/90 px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-102">
              Démarrer notre collaboration
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;