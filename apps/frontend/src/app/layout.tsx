import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import MaintenanceGate from "@/components/MaintenanceGate";
import {
  personSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/schemas";
import { Analytics } from "@vercel/analytics/next";
import { TrackingBeacon } from "@/components/TrackingBeacon";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

const siteUrl = "https://www.aissabelkoussa.fr";
const siteTitle = "Aïssa Belkoussa — Architecte de systemes & Automation";
const siteDescription =
  "Je transforme vos intuitions systeme en architectures digitales concretes, coherentes et fiables. Automation, IA, dashboards, e-commerce sur-mesure. Base en France, operant partout.";

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
    "architecte systemes digitaux",
    "automation sur-mesure",
    "developpeur freelance France",
    "developpeur React Next.js",
    "e-commerce Shopify sur-mesure",
    "dashboard decisionnel",
    "workflow algorithmique",
    "developpeur Albi Occitanie",
    "architecture IA agents",
    "systeme automation PME",
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
        url: "/assets/images/AISSABELKOUSSA.png",
        width: 1242,
        height: 2208,
        alt: "Aïssa Belkoussa — Architecte de systemes & Automation",
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

const schemas = [personSchema, organizationSchema, websiteSchema];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        {schemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <LanguageProvider>
          <MaintenanceGate>
            <ScrollIndicator />
            {children}
          </MaintenanceGate>
        </LanguageProvider>
        <Analytics />
        <TrackingBeacon />
      </body>
    </html>
  );
}
