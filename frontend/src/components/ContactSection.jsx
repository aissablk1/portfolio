import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Mail, Calendar, FileText, Send, MessageCircle, Info } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef(null);
  const { toast } = useToast();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (replace with actual API call later)
    setTimeout(() => {
      toast({
        title: "Message envoyé !",
        description: "Je vous répondrai dans les plus brefs délais.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-background to-muted/10 relative overflow-hidden"
    >
      {/* Subtle decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className={`text-center mb-16 transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Prenons{' '}
            <span className="text-muted-foreground">
              contact
            </span>
          </h2>
          <div className="w-24 h-0.5 bg-foreground rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transformons ensemble votre vision en réalité. Discutons de votre projet.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Quick Contact Options */}
          <div className={`space-y-6 transform transition-all duration-500 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
            <h3 className="text-2xl font-bold text-foreground mb-6">Contact rapide</h3>
            
            {/* Telegram */}
            <Card className="group bg-card border-border hover:border-foreground transition-all duration-200 hover:scale-102">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-muted rounded-full">
                    <Send className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-foreground font-semibold">Telegram</h4>
                    <p className="text-muted-foreground text-sm">Message instantané</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-border hover:bg-foreground hover:text-background"
                    onClick={() => window.open('https://t.me/investwithaissa', '_blank')}
                  >
                    Contacter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Calendly */}
            <Card className="group bg-card border-border hover:border-foreground transition-all duration-200 hover:scale-102">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-muted rounded-full">
                    <Calendar className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-foreground font-semibold">Calendly</h4>
                    <p className="text-muted-foreground text-sm">Planifier un appel</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-border hover:bg-foreground hover:text-background"
                    onClick={() => window.open('#', '_blank')}
                  >
                    Planifier
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notion */}
            <Card className="group bg-card border-border hover:border-foreground transition-all duration-200 hover:scale-102">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-muted rounded-full">
                    <FileText className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-foreground font-semibold">Notion</h4>
                    <p className="text-muted-foreground text-sm">Dossier public</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-border hover:bg-foreground hover:text-background"
                    onClick={() => window.open('#', '_blank')}
                  >
                    Consulter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className={`lg:col-span-2 transform transition-all duration-500 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground flex items-center space-x-3">
                  <Mail className="w-6 h-6 text-foreground" />
                  <span>Envoyez-moi un message</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground">Nom complet</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="bg-muted border-border text-foreground placeholder-muted-foreground focus:border-foreground"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-muted border-border text-foreground placeholder-muted-foreground focus:border-foreground"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-foreground">Objet</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="bg-muted border-border text-foreground placeholder-muted-foreground focus:border-foreground"
                      placeholder="Sujet de votre message"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-foreground">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="bg-muted border-border text-foreground placeholder-muted-foreground focus:border-foreground resize-none"
                      placeholder="Décrivez votre projet, vos objectifs et comment je peux vous aider..."
                    />
                  </div>

                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-foreground text-background hover:bg-foreground/90 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-102"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                        <span>Envoi en cours...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="w-5 h-5" />
                        <span>Envoyer le message</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;