import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { ScrollIndicator } from "@/components/ScrollIndicator";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "AÏSSA BELKOUSSA",
  description: "Architecture de systèmes, automation et innovation digitale. Architectures d’automation, d’IA et de workflow quantitatifs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <ScrollIndicator />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
