"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ArrowUpRight } from "lucide-react";

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  category: string;
  readingTime: string;
}

export default function ArticlePageClient({
  post,
  related,
  children,
}: {
  post: BlogPost;
  related: Omit<BlogPost, "content">[];
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  const t = {
    backToBlog: language === "fr" ? "Retour au blog" : "Back to blog",
    helpful:
      language === "fr"
        ? "Cet article t'a été utile ?"
        : "Was this article helpful?",
    share:
      language === "fr"
        ? "Partage-le avec un artisan ou un entrepreneur qui en a besoin."
        : "Share it with a tradesperson or entrepreneur who needs it.",
    viewOffers: language === "fr" ? "Voir les offres" : "View offers",
    relatedArticles: language === "fr" ? "Articles liés" : "Related articles",
  };
  const dateLocale = language === "fr" ? "fr-FR" : "en-GB";

  return (
    <div className="bg-site-bg min-h-screen">
      <Header />
      <main className="w-full relative z-10">
        <article className="px-container section-padding">
          <div className="max-w-3xl mx-auto">
            {/* Back link */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
              <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-site-text-light hover:text-site-accent transition-colors">
                <ArrowLeft size={14} />
                {t.backToBlog}
              </Link>
            </motion.div>

            {/* Article header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-[9px] font-bold uppercase tracking-widest text-site-accent bg-site-accent/10 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <h1
                style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", lineHeight: 1.1 }}
                className="font-display font-medium tracking-tighter mb-6"
              >
                {post.title}
              </h1>
              <p className="text-site-text-light text-sm leading-relaxed mb-6 max-w-xl">
                {post.description}
              </p>
              <div className="flex items-center gap-6 text-[11px] text-site-text-light/60 border-t border-site-border pt-4">
                <span className="font-bold text-site-text">{post.author}</span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(post.date).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.readingTime}
                </span>
              </div>
            </motion.header>

            {/* Article content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose prose-sm max-w-none
                prose-headings:font-display prose-headings:tracking-tight prose-headings:font-medium
                prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-site-border prose-h2:pb-2
                prose-h3:text-base prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-site-text-light prose-p:leading-relaxed prose-p:text-[14px]
                prose-a:text-site-accent prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                prose-strong:text-site-text prose-strong:font-semibold
                prose-li:text-site-text-light prose-li:text-[14px]
                prose-table:text-[12px]
                prose-th:text-left prose-th:font-bold prose-th:uppercase prose-th:tracking-wider prose-th:text-[10px] prose-th:border-b-2 prose-th:border-site-text prose-th:pb-2
                prose-td:border-b prose-td:border-site-border prose-td:py-2
                prose-blockquote:border-l-2 prose-blockquote:border-site-accent prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-site-text-light
                prose-code:bg-site-border/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[12px] prose-code:font-mono
              "
            >
              {children}
            </motion.div>

            {/* Share + CTA */}
            <div className="mt-16 pt-8 border-t border-site-border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <p className="text-sm font-bold mb-1">{t.helpful}</p>
                  <p className="text-xs text-site-text-light">{t.share}</p>
                </div>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 bg-site-accent text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform shrink-0"
                >
                  {t.viewOffers}
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="mt-16">
                <h3 className="text-xs font-bold uppercase tracking-widest text-site-text-light mb-6">{t.relatedArticles}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/blog/${r.slug}`}
                      className="group block border border-site-border rounded-xl p-5 hover:border-site-accent/30 transition-colors"
                    >
                      <h4 className="text-sm font-display font-medium tracking-tight mb-2 group-hover:text-site-accent transition-colors line-clamp-2">
                        {r.title}
                      </h4>
                      <p className="text-[11px] text-site-text-light line-clamp-2">{r.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
        <Footer />
      </main>
    </div>
  );
}
