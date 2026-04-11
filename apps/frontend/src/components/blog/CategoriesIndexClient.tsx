"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FileText } from "lucide-react";

interface CategoryEntry {
  name: string;
  count: number;
}

export default function CategoriesIndexClient({
  categoriesFr,
  categoriesEn,
}: {
  categoriesFr: CategoryEntry[];
  categoriesEn: CategoryEntry[];
}) {
  const { language, dict } = useLanguage();
  const categories = language === "en" ? categoriesEn : categoriesFr;

  const formatCount = (count: number) =>
    count === 1
      ? dict.blog.articleCountOne
      : dict.blog.articleCountOther.replace("{count}", String(count));

  return (
    <div className="bg-site-bg min-h-screen">
      <Header />
      <main className="w-full relative z-10">
        <section className="px-container section-padding">
          <div className="max-w-5xl mx-auto">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-site-text-light hover:text-site-accent transition-colors"
              >
                <ArrowLeft size={14} />
                {dict.blog.backToBlog}
              </Link>
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-2 h-2 rounded-full bg-site-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-site-accent">
                  {dict.blog.allCategories}
                </span>
              </div>
              <h1
                style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", lineHeight: 1.05 }}
                className="font-display font-medium tracking-tighter uppercase max-w-3xl mb-6"
              >
                {dict.blog.allCategoriesTitle}
              </h1>
              <p className="text-site-text-light text-base max-w-2xl leading-relaxed">
                {dict.blog.allCategoriesSubtitle}
              </p>
            </motion.div>

            {/* Categories grid */}
            {categories.length === 0 ? (
              <p className="text-site-text-light text-sm">{dict.blog.empty}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat, idx) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  >
                    <Link
                      href={`/blog/categorie/${encodeURIComponent(cat.name)}`}
                      className="group block border border-site-border rounded-2xl p-8 hover:border-site-accent/30 transition-colors h-full"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-site-accent" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/60">
                            {formatCount(cat.count)}
                          </span>
                        </div>
                        <ArrowUpRight
                          size={16}
                          className="text-site-text-light/40 group-hover:text-site-accent transition-colors"
                        />
                      </div>
                      <h2 className="text-xl font-display font-medium tracking-tight group-hover:text-site-accent transition-colors">
                        {cat.name}
                      </h2>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 text-center"
            >
              <p className="text-sm text-site-text-light mb-4">{dict.blog.cta}</p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-site-accent text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform"
              >
                {dict.blog.viewOffers}
                <ArrowUpRight size={14} />
              </Link>
            </motion.div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
