import type { Lang } from "./contact-types";

export interface ContactLabels {
  subject: string;
  via: string;
  name: string;
  email: string;
  company: string;
  need: string;
  budget: string;
  message: string;
  notProvided: string;
  submittedAt: string;
  language: string;
  replyNow: string;
  footer: string;
  confirmSubject: string;
  confirmGreeting: string;
  confirmBody: string;
  confirmPromise: string;
  confirmDetail: string;
  confirmClosing: string;
  confirmSignature: string;
  confirmRole: string;
  confirmSite: string;
}

export const labels: Record<Lang, ContactLabels> = {
  fr: {
    // Admin email
    subject: "Nouvelle demande de projet",
    via: "via aissabelkoussa.fr",
    name: "Nom",
    email: "Email",
    company: "Entreprise / Projet",
    need: "Besoin",
    budget: "Budget",
    message: "Message",
    notProvided: "Non renseigné",
    submittedAt: "Soumis le",
    language: "Langue du visiteur",
    replyNow: "Répondre maintenant",
    footer: "Aïssa BELKOUSSA &bull; Architecte de systèmes",
    // Confirmation email
    confirmSubject: "Bien reçu — je reviens vers vous rapidement",
    confirmGreeting: "Bonjour",
    confirmBody:
      "Merci pour votre message. J'ai bien reçu votre demande et je l'analyse attentivement.",
    confirmPromise: "Je reviens vers vous sous 48h maximum.",
    confirmDetail: "Voici un récapitulatif de votre demande :",
    confirmClosing: "À très bientôt,",
    confirmSignature: "Aïssa BELKOUSSA",
    confirmRole: "Architecte de systèmes & Développeur",
    confirmSite: "www.aissabelkoussa.fr",
  },
  en: {
    subject: "New project request",
    via: "via aissabelkoussa.fr",
    name: "Name",
    email: "Email",
    company: "Company / Project",
    need: "Need",
    budget: "Budget",
    message: "Message",
    notProvided: "Not provided",
    submittedAt: "Submitted on",
    language: "Visitor language",
    replyNow: "Reply now",
    footer: "Aïssa BELKOUSSA &bull; Systems Architect",
    confirmSubject: "Received — I'll get back to you shortly",
    confirmGreeting: "Hi",
    confirmBody:
      "Thank you for reaching out. I've received your request and I'm reviewing it carefully.",
    confirmPromise: "I'll get back to you within 48 hours.",
    confirmDetail: "Here's a summary of your request:",
    confirmClosing: "Talk soon,",
    confirmSignature: "Aïssa BELKOUSSA",
    confirmRole: "Systems Architect & Developer",
    confirmSite: "www.aissabelkoussa.fr",
  },
};
