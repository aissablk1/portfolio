import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ExternalLink, Github } from 'lucide-react';
import { portfolioProjects } from '../data/mockData';

const PortfolioSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const sectionRef = useRef(null);

  const categories = ['Tous', ...new Set(portfolioProjects.map(project => project.category))];

  const filteredProjects = selectedCategory === 'Tous' 
    ? portfolioProjects 
    : portfolioProjects.filter(project => project.category === selectedCategory);

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
      id="portfolio" 
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-background to-muted/10 relative overflow-hidden"
    >
      {/* Subtle decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className={`text-center mb-16 transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Mes{' '}
            <span className="text-muted-foreground">
              Réalisations
            </span>
          </h2>
          <div className="w-24 h-0.5 bg-foreground rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez quelques projets qui illustrent mon expertise et ma passion pour l'innovation
          </p>
        </div>

        {/* Category Filter */}
        <div className={`flex flex-wrap justify-center gap-4 mb-12 transform transition-all duration-500 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-102 ${
                selectedCategory === category
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border hover:border-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <Card 
              key={project.id}
              className={`group bg-card border-border hover:border-foreground transition-all duration-300 hover:scale-102 overflow-hidden ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                
                {/* Hover overlay with links */}
                <div className="absolute inset-0 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <a 
                    href={project.demoLink}
                    className="p-3 bg-foreground/20 backdrop-blur-sm rounded-full text-foreground hover:bg-foreground/30 transition-colors duration-200"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <a 
                    href={project.githubLink}
                    className="p-3 bg-foreground/20 backdrop-blur-sm rounded-full text-foreground hover:bg-foreground/30 transition-colors duration-200"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-foreground">
                    {project.title}
                  </h3>
                  <Badge 
                    variant="secondary"
                    className="bg-muted text-muted-foreground"
                  >
                    {project.category}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                <div className="flex items-center space-x-2 pt-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Projet terminé</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transform transition-all duration-500 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-card border border-border p-8 rounded-xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Vous voulez voir plus de détails ?
            </h3>
            <p className="text-muted-foreground mb-6">
              Consultez mon dossier Notion complet avec études de cas détaillées et résultats chiffrés.
            </p>
            <button className="bg-foreground text-background hover:bg-foreground/90 px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-102">
              Accéder au dossier complet
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;