"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Calendar, Clock } from "lucide-react";

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  readingTime: string;
  featured: boolean;
}

export default function CategoryPageClient({
  postsFr,
  postsEn,
  category,
}: {
  postsFr: BlogPost[];
  postsEn: BlogPost[];
  category: string;
}) {
  const { language, dict } = useLanguage();
  const posts = language === "en" ? postsEn : postsFr;
  const dateLocale = language === "fr" ? "fr-FR" : "en-GB";

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
                  {category}
                </span>
              </div>
              <h1
                style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", lineHeight: 1.05 }}
                className="font-display font-medium tracking-tighter uppercase max-w-3xl"
              >
                {dict.blog.categoryTitle.replace("{category}", category)}
              </h1>
            </motion.div>

            {/* Posts grid */}
            {posts.length === 0 ? (
              <p className="text-site-text-light text-sm">{dict.blog.categoryEmpty}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post, idx) => (
                  <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block border border-site-border rounded-2xl p-8 hover:border-site-accent/30 transition-colors h-full"
                    >
                      {post.featured && (
                        <span className="text-[8px] font-bold uppercase tracking-widest text-site-accent bg-site-accent/10 px-2 py-0.5 rounded-full mb-4 inline-block">
                          {dict.blog.featured}
                        </span>
                      )}
                      <h2 className="text-lg font-display font-medium tracking-tight mb-3 group-hover:text-site-accent transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-site-text-light leading-relaxed mb-4 line-clamp-3">
                        {post.description}
                      </p>
                      <div className="flex items-center gap-4 text-[11px] text-site-text-light/60">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(post.date).toLocaleDateString(dateLocale, {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {language === "fr"
                            ? post.readingTime.replace("min read", "min de lecture")
                            : post.readingTime}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-bold uppercase tracking-widest text-site-text-light/50 bg-site-bg border border-site-border px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Link>
                  </motion.article>
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
