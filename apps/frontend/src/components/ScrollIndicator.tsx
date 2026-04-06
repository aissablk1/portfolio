"use client";

import { motion, useSpring, useScroll } from "framer-motion";
import { usePathname } from "next/navigation";

export function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const pathname = usePathname();

  // Use useSpring for smooth progress bar animation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Hide on pages with dark/custom backgrounds
  if (pathname === "/links") return null;

  return (
    <div
      className="fixed left-0 top-0 z-9999 h-px w-full bg-transparent pointer-events-none"
      aria-hidden="true"
    >
      <motion.div
        style={{ scaleX }}
        className="origin-left h-full bg-white/70 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.6)]"
      />
    </div>
  );
}
