"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_TEXT = "AÏSSA BELKOUSSA";
const DURATION = 2800; // total preloader duration in ms

export default function Preloader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState<"letters" | "assemble" | "exit">("letters");

  useEffect(() => {
    // Check if already shown this session
    if (sessionStorage.getItem("preloader_shown")) {
      setIsLoading(false);
      return;
    }

    const t1 = setTimeout(() => setPhase("assemble"), 1200);
    const t2 = setTimeout(() => setPhase("exit"), 2200);
    const t3 = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("preloader_shown", "1");
    }, DURATION);

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
            className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center"
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
                        y: 80 + Math.random() * 40,
                        rotateX: -90,
                        filter: "blur(8px)",
                      }}
                      animate={
                        phase === "letters"
                          ? {
                              opacity: 1,
                              y: 0,
                              rotateX: 0,
                              filter: "blur(0px)",
                            }
                          : phase === "assemble"
                          ? {
                              opacity: 1,
                              y: 0,
                              rotateX: 0,
                              filter: "blur(0px)",
                              letterSpacing: "0.02em",
                            }
                          : {
                              opacity: 0,
                              y: -30,
                              filter: "blur(4px)",
                            }
                      }
                      transition={{
                        duration: phase === "letters" ? 0.6 : 0.4,
                        delay: phase === "letters" ? i * 0.05 : phase === "exit" ? i * 0.02 : 0,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="inline-block text-white font-display font-medium tracking-tighter"
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

            {/* Subtitle line */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={
                phase === "assemble"
                  ? { opacity: 1, width: "120px" }
                  : phase === "exit"
                  ? { opacity: 0, width: 0 }
                  : { opacity: 0, width: 0 }
              }
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
              className="h-px bg-white/20 mt-6"
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={
                phase === "assemble"
                  ? { opacity: 0.4, y: 0 }
                  : { opacity: 0, y: -10 }
              }
              transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
              className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mt-4"
            >
              Architecte de systèmes
            </motion.p>
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
