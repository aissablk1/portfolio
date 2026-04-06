"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const FigmaSelector = () => {
  const [rect, setRect] = useState({ width: 320, height: 380 });
  const [layerName, setLayerName] = useState("HERO");
  const boxRef = useRef<HTMLDivElement>(null);

  const isResizing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const onResizeStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isResizing.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    const onMove = (ev: PointerEvent) => {
      if (!isResizing.current) return;
      const dx = ev.clientX - lastPos.current.x;
      const dy = ev.clientY - lastPos.current.y;
      lastPos.current = { x: ev.clientX, y: ev.clientY };
      setRect(prev => ({
        width: Math.max(80, prev.width + dx),
        height: Math.max(80, prev.height + dy),
      }));
    };
    const onUp = () => {
      isResizing.current = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const detectLayer = useCallback(() => {
    if (!boxRef.current) return;
    const r = boxRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    boxRef.current.style.pointerEvents = "none";
    const el = document.elementFromPoint(cx, cy);
    boxRef.current.style.pointerEvents = "";
    if (!el) return;
    let node: Element | null = el;
    while (node && node !== document.body) {
      const name = node.getAttribute("data-layer");
      if (name) { setLayerName(name.toUpperCase()); return; }
      const tag = node.tagName.toLowerCase();
      if (tag === "section") {
        const id = node.id || node.getAttribute("aria-label") || "";
        if (id) { setLayerName(id.toUpperCase().replace(/-/g, "_")); return; }
      }
      if (tag === "h1") { setLayerName("HEADING"); return; }
      if (tag === "h2") { setLayerName("TITLE"); return; }
      if (tag === "button" || tag === "a") { setLayerName("CTA"); return; }
      if (tag === "img" || tag === "video" || tag === "canvas") { setLayerName(tag.toUpperCase()); return; }
      if (tag === "footer") { setLayerName("FOOTER"); return; }
      if (tag === "header" || tag === "nav") { setLayerName("HEADER"); return; }
      node = node.parentElement;
    }
    setLayerName("BACKGROUND");
  }, []);

  return (
    <motion.div
      ref={boxRef}
      drag
      dragMomentum={false}
      onDrag={detectLayer}
      onDragEnd={detectLayer}
      style={{ width: rect.width, height: rect.height }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 1.5 }}
      className="hidden md:block absolute top-[280px] right-[60px] z-40 border-2 border-[#18A0FB] bg-[#18A0FB]/5 shadow-[0_0_30px_rgba(24,160,251,0.1)] group active:cursor-grabbing hover:bg-[#18A0FB]/8 transition-colors cursor-grab"
    >
      {/* Corner Handles */}
      {["-top-1.5 -left-1.5", "-top-1.5 -right-1.5", "-bottom-1.5 -left-1.5"].map((pos, i) => (
        <div key={i} className={cn("absolute w-3 h-3 bg-white border-2 border-[#18A0FB] rounded-sm shadow-sm z-20", pos)} />
      ))}

      {/* Edge Handles */}
      {["top-1/2 -left-1.5 -translate-y-1/2", "top-1/2 -right-1.5 -translate-y-1/2", "-top-1.5 left-1/2 -translate-x-1/2", "-bottom-1.5 left-1/2 -translate-x-1/2"].map((pos, i) => (
        <div key={i} className={cn("absolute w-3 h-3 bg-white border-2 border-[#18A0FB] rounded-sm shadow-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity", pos)} />
      ))}

      {/* Resize Handle */}
      <div
        onPointerDown={onResizeStart}
        className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-white border-2 border-[#18A0FB] rounded-sm cursor-nwse-resize z-30 shadow-md hover:scale-150 transition-transform touch-none"
      />

      {/* Layer Label */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute -top-8 left-[-2px] bg-[#18A0FB] text-white text-[11px] px-2.5 py-1 rounded-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl select-none whitespace-nowrap"
      >
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="opacity-70 font-medium">Layer</span>
        <span className="border-l border-white/20 pl-2">{layerName}</span>
      </motion.div>

      {/* Dimensions HUD */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#18A0FB] text-white text-[9px] px-2 py-0.5 rounded-full font-mono shadow-lg opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-y-1 whitespace-nowrap">
        W: {Math.round(rect.width)}  H: {Math.round(rect.height)}
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#18A0FB_1px,transparent_1px),linear-gradient(to_bottom,#18A0FB_1px,transparent_1px)] bg-size-[20px_20px]" />
    </motion.div>
  );
};

export default FigmaSelector;
