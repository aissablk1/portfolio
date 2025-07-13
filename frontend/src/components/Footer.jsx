import React from 'react';
import { Instagram, Linkedin, Send, Github, Youtube, Heart } from 'lucide-react';
import { personalInfo } from '../data/mockData';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      icon: Instagram, 
      href: personalInfo.socialLinks.instagram, 
      label: 'Instagram',
      color: 'hover:text-pink-400 hover:border-pink-500'
    },
    { 
      icon: Linkedin, 
      href: personalInfo.socialLinks.linkedin, 
      label: 'LinkedIn',
      color: 'hover:text-blue-400 hover:border-blue-500'
    },
    { 
      icon: Send, 
      href: personalInfo.socialLinks.telegram, 
      label: 'Telegram',
      color: 'hover:text-cyan-400 hover:border-cyan-500'
    },
    { 
      icon: Github, 
      href: personalInfo.socialLinks.github, 
      label: 'GitHub',
      color: 'hover:text-gray-300 hover:border-gray-400'
    },
    { 
      icon: Youtube, 
      href: personalInfo.socialLinks.youtube, 
      label: 'YouTube',
      color: 'hover:text-red-400 hover:border-red-500'
    }
  ];

  return (
    <footer className="bg-gradient-to-t from-black to-gray-900 relative overflow-hidden">
      {/* Top decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {personalInfo.name}
                </span>
              </h3>
              <p className="text-gray-400 text-lg">
                Entrepreneur • Développeur • Créateur
              </p>
            </div>
            
            <p className="text-gray-300 leading-relaxed max-w-md">
              Passionné par l'automatisation, l'IA et la stratégie digitale. 
              Je transforme les idées en systèmes puissants et les visions en résultats concrets.
            </p>

            <div className="flex items-center space-x-2 text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Disponible pour nouveaux projets</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white">Navigation</h4>
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
                  className="block text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white">Contact</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Basé dans le sud de la France</p>
                <p className="text-gray-400 text-sm">Travaille partout dans le monde</p>
              </div>
              
              <div className="space-y-2">
                <a 
                  href="https://t.me/investwithaissa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
                >
                  @investwithaissa
                </a>
                <p className="text-gray-400 text-sm">Réponse sous 24h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map(({ icon: Icon, href, label, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-3 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700 transition-all duration-300 hover:scale-110 hover:shadow-lg ${color}`}
                aria-label={label}
              >
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-current transition-colors duration-300" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm mb-2">
              © {currentYear} {personalInfo.name}. Tous droits réservés.
            </p>
            <p className="text-gray-500 text-xs flex items-center justify-center md:justify-end space-x-1">
              <span>Propulsé par l'IA et l'âme d'Aïssa</span>
              <Heart className="w-3 h-3 text-red-500 animate-pulse" />
            </p>
          </div>
        </div>

        {/* Mentions légales */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-xs">
            Auto-entreprise • SIRET: [À compléter] • 
            <a href="#" className="hover:text-gray-400 transition-colors duration-300 ml-1">
              Mentions légales
            </a>
          </p>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl opacity-20"></div>
    </footer>
  );
};

export default Footer;