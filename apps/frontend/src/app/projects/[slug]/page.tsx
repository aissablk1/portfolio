"use client";

import React, { use } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ProjectPage = () => {
  const { slug } = useParams();
  const { dict } = useLanguage();

  const project = dict.systems.items.find((item) => item.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="mb-8">System not found.</p>
          <Link href="/" className="text-site-accent font-bold uppercase tracking-widest text-xs">
            Back to Base
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-site-bg min-h-screen selection:bg-black selection:text-white">
      <Header />
      
      <main className="pt-32 pb-20 px-container">
        <div className="max-w-6xl mx-auto">
          {/* Back Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Link 
              href="/#systems" 
              className="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-site-text-light hover:text-site-accent transition-colors"
            >
              <div className="w-8 h-px bg-site-border group-hover:w-12 group-hover:bg-site-accent transition-all" />
              <span>Back to Systems</span>
            </Link>
          </motion.div>

          {/* Hero Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-site-text-light">
                        {project.sub}
                    </span>
                </div>
                <h1 className="text-6xl md:text-8xl font-bold mb-8 uppercase tracking-tighter leading-none">
                    {project.title.split('').map((char, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.4 + (i * 0.05) }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </h1>
                <p className="text-xl text-site-text-light leading-relaxed max-w-lg mb-12">
                    {project.desc}
                </p>
                
                <div className="flex flex-wrap gap-8">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/50 mb-2">Category</p>
                        <p className="text-sm font-medium">System Architecture</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/50 mb-2">Year</p>
                        <p className="text-sm font-medium">2026</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/50 mb-2">Status</p>
                        <p className="text-sm font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Deployed
                        </p>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="aspect-square relative"
            >
                {/* Premium Abstract Visual Placeholder */}
                <div className="absolute inset-0 bg-site-border/30 rounded-3xl border border-site-border overflow-hidden group">
                    <div 
                        className="absolute inset-x-12 -bottom-24 top-24 bg-white rounded-t-2xl shadow-2xl p-12 flex flex-col gap-6"
                        style={{ boxShadow: `0 -20px 60px -15px ${project.color}20` }}
                    >
                        <div className="w-1/3 h-3 bg-site-border rounded" />
                        <div className="w-full h-px bg-site-border" />
                        <div className="grid grid-cols-2 gap-8 h-full">
                            <div className="bg-site-border/10 rounded-xl" />
                            <div className="bg-site-border/10 rounded-xl" />
                        </div>
                    </div>
                    
                    {/* Animated grid overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                         style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>
            </motion.div>
          </section>

          {/* Deep Detail Section */}
          <section className="border-t border-site-border pt-32 mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-4">
                    <h2 className="text-3xl font-bold uppercase tracking-tighter mb-8">System<br/>Intelligence</h2>
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-4">
                                <span className="text-xs font-bold text-site-accent">0{i}</span>
                                <div className="space-y-1">
                                    <div className="h-2 w-32 bg-site-border rounded" />
                                    <div className="h-1.5 w-48 bg-site-border/40 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-8">
                    <p className="text-2xl font-light leading-relaxed mb-12">
                        {project.desc} Designed to be scalable, efficient and modular. The system core utilizes modern architectures to provide seamless integration and high-performance throughput.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         <div className="p-8 rounded-2xl bg-white border border-site-border shadow-sm">
                            <h4 className="font-bold uppercase tracking-widest text-[10px] mb-4">Architecture</h4>
                            <p className="text-sm text-site-text-light">
                                Micro-services approach with automated deployment pipelines and real-time observability.
                            </p>
                         </div>
                         <div className="p-8 rounded-2xl bg-white border border-site-border shadow-sm">
                            <h4 className="font-bold uppercase tracking-widest text-[10px] mb-4">Innovation</h4>
                            <p className="text-sm text-site-text-light">
                                Integrated AI agents for workflow optimization and automated decision-making processes.
                            </p>
                         </div>
                    </div>
                </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-site-accent text-white p-12 md:p-24 rounded-[3rem] text-center mb-32 relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 uppercase tracking-tighter leading-tight">
                    Start a system<br/>like this?
                </h2>
                <Link 
                    href="/contact" 
                    className="inline-block px-12 py-5 bg-white text-site-accent font-bold uppercase tracking-[0.2em] text-sm rounded-full hover:scale-105 transition-transform"
                >
                    Initier un projet
                </Link>
            </div>
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48 blur-3xl" />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectPage;
