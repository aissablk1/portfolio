import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import PortfolioSection from "./components/PortfolioSection";
import TestimonialsSection from "./components/TestimonialsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import ThemeToggle from "./components/ThemeToggle";
import { Toaster } from "./components/ui/toaster";

const Home = () => {
  // Detect system theme preference on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    
    if (!savedTheme || savedTheme === 'system') {
      document.documentElement.classList.toggle('dark', mediaQuery.matches);
    }

    // Listen for system theme changes
    const handleChange = (e) => {
      const currentTheme = localStorage.getItem('theme');
      if (!currentTheme || currentTheme === 'system') {
        document.documentElement.classList.toggle('dark', e.matches);
      }
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeToggle />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;