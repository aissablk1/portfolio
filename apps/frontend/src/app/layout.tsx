import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { ScrollIndicator } from "@/components/ScrollIndicator";
// import MaintenanceGate from "@/components/MaintenanceGate";
import Preloader from "@/components/Preloader";
import {
  personSchema,
  organizationSchema,
  websiteSchema,
  faqSchema,
  breadcrumbs,
} from "@/lib/schemas";
import JsonLd from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/next";
import { TrackingBeacon } from "@/components/TrackingBeacon";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

const siteUrl = "https://www.aissabelkoussa.fr";
const siteTitle = "Creation site internet artisan & automatisation PME — Aissa Belkoussa, Albi";
const siteDescription =
  "Freelance creation site internet a Albi. Sites pour artisans BTP, automatisation devis et relances, dashboards PME. Livre en 10 jours, prix fixe. Devis gratuit.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: siteTitle,
    template: "%s — Aïssa Belkoussa",
  },

  description: siteDescription,

  keywords: [
    "creation site internet artisan",
    "site internet BTP",
    "creation site web Albi",
    "developpeur web freelance Tarn",
    "site web professionnel artisan",
    "automatisation devis artisan",
    "site internet plombier",
    "digitalisation PME",
    "automatisation entreprise Toulouse",
    "developpeur web Albi Occitanie",
    "freelance site internet Tarn",
    "site internet electricien",
  ],

  authors: [{ name: "Aïssa Belkoussa", url: siteUrl }],
  creator: "Aïssa Belkoussa",
  publisher: "Aïssa Belkoussa",

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Aïssa Belkoussa",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Aissa Belkoussa — Sites et automatisations pour artisans et PME, Albi",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/assets/images/AISSABELKOUSSA.png"],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "technology",
};

const schemas = [personSchema, organizationSchema, websiteSchema, faqSchema, breadcrumbs.home];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <JsonLd data={schemas} />
      </head>
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-site-accent focus:text-white focus:px-6 focus:py-3 focus:rounded-full focus:text-sm focus:font-bold"
        >
          Aller au contenu principal
        </a>
        <LanguageProvider>
          <Preloader>
            <ScrollIndicator />
            {children}
            <WhatsAppButton />
          </Preloader>
        </LanguageProvider>
        <Analytics />
        <TrackingBeacon />
      </body>
    </html>
  );
}
