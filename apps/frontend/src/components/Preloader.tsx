"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_TEXT = "AÏSSA BELKOUSSA";
const DURATION = 2800; // total preloader duration in ms

export default function Preloader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState<"letters" | "assemble" | "exit">("letters");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("assemble"), 1200);
    const t2 = setTimeout(() => setPhase("exit"), 2200);
    const t3 = setTimeout(() => setIsLoading(false), DURATION);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Block scroll during preloader
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isLoading]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="preloader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-0 z-[9999] bg-site-bg flex flex-col items-center justify-center"
            style={{ backgroundImage: "linear-gradient(var(--color-site-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-site-border) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
          >
            {/* Letters animation */}
            <div className="relative flex items-center justify-center overflow-hidden">
              <div className="flex">
                {LOGO_TEXT.split("").map((char, i) => {
                  const isSpace = char === " ";
                  return (
                    <motion.span
                      key={i}
                      initial={{
                        opacity: 0,
                        y: 60 + Math.random() * 30,
                        filter: "blur(8px)",
                      }}
                      animate={
                        phase === "letters"
                          ? {
                              opacity: 1,
                              y: 0,
                              filter: "blur(0px)",
                            }
                          : phase === "assemble"
                          ? {
                              opacity: 1,
                              y: 0,
                              filter: "blur(0px)",
                              letterSpacing: "0.02em",
                            }
                          : {
                              opacity: 0,
                              y: -20,
                              filter: "blur(4px)",
                            }
                      }
                      transition={{
                        duration: phase === "letters" ? 0.6 : 0.4,
                        delay: phase === "letters" ? i * 0.05 : phase === "exit" ? i * 0.02 : 0,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="inline-block text-site-text font-display font-medium tracking-tighter"
                      style={{
                        fontSize: "clamp(1.8rem, 5vw, 4rem)",
                        width: isSpace ? "0.3em" : "auto",
                        perspective: "600px",
                      }}
                    >
                      {isSpace ? "\u00A0" : char}
                    </motion.span>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Site content — always rendered */}
      <div
        style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.3s ease" }}
      >
        {children}
      </div>
    </>
  );
}
