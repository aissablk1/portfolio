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
  breadcrumbs,
} from "@/lib/schemas";
import JsonLd from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/next";
import { TrackingBeacon } from "@/components/TrackingBeacon";
import WhatsAppButton from "@/components/WhatsAppButton";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

const siteUrl = "https://www.aissabelkoussa.fr";
const siteTitle = "Sites web artisans BTP & automatisation PME — Aïssa BELKOUSSA";
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
    template: "%s — Aïssa BELKOUSSA",
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
    "consultant IA Albi",
    "consultant intelligence artificielle Tarn",
    "expert IA PME Occitanie",
    "automatisation IA artisan",
    "consultant digital PME Albi",
    "chatbot IA entreprise",
    "GEO referencement IA",
    "SEO local Albi",
  ],

  authors: [{ name: "Aïssa BELKOUSSA", url: siteUrl }],
  creator: "Aïssa BELKOUSSA",
  publisher: "Aïssa BELKOUSSA",

  alternates: {
    canonical: siteUrl,
    languages: {
      "fr": siteUrl,
      "x-default": siteUrl,
    },
  },

  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Aïssa BELKOUSSA",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Aïssa BELKOUSSA — Sites et automatisations pour artisans et PME, Albi",
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

  verification: {
    other: {
      ...(process.env.BING_VERIFICATION_CODE
        ? { "msvalidate.01": process.env.BING_VERIFICATION_CODE }
        : {}),
    },
  },

  category: "technology",
};

const schemas = [personSchema, organizationSchema, websiteSchema, breadcrumbs.home];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <JsonLd data={schemas} />
        <link rel="dns-prefetch" href="https://assets.calendly.com" />
        <link rel="dns-prefetch" href="https://portfolio-api-72tq.onrender.com" />
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
        {/* Google Analytics (gtag.js) */}
        <Script
          id="ga-script"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-ZJSFF5X6SZ"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-ZJSFF5X6SZ');`}
        </Script>
        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-523FWBK6');`}
        </Script>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-523FWBK6"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      </body>
    </html>
  );
}
