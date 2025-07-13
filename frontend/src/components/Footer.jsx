import React from 'react';
import { Instagram, Linkedin, Send, Github, Youtube, Heart } from 'lucide-react';
import { personalInfo } from '../data/mockData';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      icon: Instagram, 
      href: personalInfo.socialLinks.instagram, 
      label: 'Instagram'
    },
    { 
      icon: Linkedin, 
      href: personalInfo.socialLinks.linkedin, 
      label: 'LinkedIn'
    },
    { 
      icon: Send, 
      href: personalInfo.socialLinks.telegram, 
      label: 'Telegram'
    },
    { 
      icon: Github, 
      href: personalInfo.socialLinks.github, 
      label: 'GitHub'
    },
    { 
      icon: Youtube, 
      href: personalInfo.socialLinks.youtube, 
      label: 'YouTube'
    }
  ];

  return (
    <footer className="bg-gradient-to-t from-muted/20 to-background relative overflow-hidden">
      {/* Top decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-2">
                {personalInfo.name}
              </h3>
              <p className="text-muted-foreground text-lg">
                Entrepreneur • Développeur • Créateur
              </p>
            </div>
            
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Passionné par l'automatisation, l'IA et la stratégie digitale. 
              Je transforme les idées en systèmes puissants et les visions en résultats concrets.
            </p>

            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Disponible pour nouveaux projets</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-foreground">Navigation</h4>
            <nav className="space-y-3">
              {[
                { label: 'À propos', href: '#about' },
                { label: 'Services', href: '#services' },
                { label: 'Portfolio', href: '#portfolio' },
                { label: 'Témoignages', href: '#testimonials' },
                { label: 'Contact', href: '#contact' }
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 transform"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-foreground">Contact</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Basé dans le sud de la France</p>
                <p className="text-muted-foreground text-sm">Travaille partout dans le monde</p>
              </div>
              
              <div className="space-y-2">
                <a 
                  href="https://t.me/investwithaissa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-foreground hover:text-muted-foreground transition-colors duration-200"
                >
                  @investwithaissa
                </a>
                <p className="text-muted-foreground text-sm">Réponse sous 24h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-muted rounded-full border border-border hover:border-foreground transition-all duration-200 hover:scale-105"
                aria-label={label}
              >
                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-muted-foreground text-sm mb-2">
              © {currentYear} {personalInfo.name}. Tous droits réservés.
            </p>
            <p className="text-muted-foreground text-xs flex items-center justify-center md:justify-end space-x-1">
              <span>Propulsé par l'IA et l'âme d'Aïssa</span>
              <Heart className="w-3 h-3 text-red-500 animate-pulse" />
            </p>
          </div>
        </div>

        {/* Mentions légales */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-muted-foreground text-xs">
            Auto-entreprise • SIRET: [À compléter] • 
            <a href="#" className="hover:text-foreground transition-colors duration-200 ml-1">
              Mentions légales
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;