"use client";

import Header from "@/components/Header";
// import SideNav from "@/components/SideNav";
import FloatingCta from "@/components/FloatingCta";
import Hero from "@/components/sections/Hero";
import Offers from "@/components/sections/Offers";
import Approach from "@/components/sections/Approach";
import Expertises from "@/components/sections/Expertises";
import PricingTeaser from "@/components/sections/PricingTeaser";
import Systems from "@/components/sections/Systems";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-site-bg min-h-screen">
      <Header />
      {/* <SideNav /> */}
      <FloatingCta />
      
      <div className="grid grid-cols-1 relative">
        {/* Left Column (Empty Spacer) */}
        <div className="hidden lg:block" />

        {/* Center Column (Main Content) */}
        <main className="w-full relative z-10">
          <Hero />
          <Offers />
          <Approach />
          <Expertises />
          <PricingTeaser />
          {/* <Systems /> */}
          <About />
          <Contact />
          <Footer />
        </main>

        {/* Right Column (Spacer for Sticky SideNav) */}
        <div className="hidden lg:block relative">
          {/* SideNav is fixed/absolute so it lives here conceptually */}
        </div>
      </div>
    </div>
  );
}
