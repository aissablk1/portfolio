"use client";

import { useEffect, useRef, useCallback } from "react";

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: [number, number, number];
  /** Base autonomous phase offset */
  phase: number;
}

const COLORS: [number, number, number][] = [
  [30, 15, 60],   // deep purple
  [15, 30, 55],   // dark blue
  [10, 45, 40],   // dark teal
  [50, 15, 35],   // dark magenta
  [20, 20, 50],   // indigo
];

export default function MeshGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.5, active: false });
  const blobs = useRef<Blob[]>([]);
  const raf = useRef<number>(0);
  const dpr = useRef(1);
  const noiseCanvas = useRef<HTMLCanvasElement | null>(null);
  const noiseCtx = useRef<CanvasRenderingContext2D | null>(null);

  const initBlobs = useCallback((w: number, h: number) => {
    blobs.current = COLORS.map((color, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.max(w, h) * (0.3 + Math.random() * 0.25),
      color,
      phase: (i / COLORS.length) * Math.PI * 2,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    dpr.current = Math.min(window.devicePixelRatio || 1, 2);

    // Offscreen canvas for pixel-level grain at native resolution
    noiseCanvas.current = document.createElement("canvas");
    noiseCtx.current = noiseCanvas.current.getContext("2d", { willReadFrequently: true });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr.current;
      canvas.height = rect.height * dpr.current;
      // Grain at native viewport res for sharp 1:1 pixel noise
      if (noiseCanvas.current) {
        noiseCanvas.current.width = Math.ceil(rect.width);
        noiseCanvas.current.height = Math.ceil(rect.height);
      }
      if (blobs.current.length === 0) {
        initBlobs(canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current.x = (e.clientX - rect.left) / rect.width;
      pointer.current.y = (e.clientY - rect.top) / rect.height;
      pointer.current.active = true;
    };

    const onPointerLeave = () => {
      pointer.current.active = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const rect = canvas.getBoundingClientRect();
      pointer.current.x = (touch.clientX - rect.left) / rect.width;
      pointer.current.y = (touch.clientY - rect.top) / rect.height;
      pointer.current.active = true;
    };

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onPointerLeave);

    let time = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      time += 0.003;

      // Dark base
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, w, h);

      const px = pointer.current.x * w;
      const py = pointer.current.y * h;

      for (const blob of blobs.current) {
        // Autonomous movement: slow orbiting
        const autonomousX = Math.sin(time + blob.phase) * w * 0.15;
        const autonomousY = Math.cos(time * 0.7 + blob.phase) * h * 0.15;

        // Target = autonomous position (center-ish + orbit)
        let targetX = w * 0.5 + autonomousX;
        let targetY = h * 0.5 + autonomousY;

        // If pointer active, attract blobs towards cursor
        if (pointer.current.active) {
          const dx = px - blob.x;
          const dy = py - blob.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - dist / (Math.max(w, h) * 0.6));
          targetX = targetX + (px - targetX) * influence * 0.6;
          targetY = targetY + (py - targetY) * influence * 0.6;
        }

        // Smooth interpolation
        blob.x += (targetX - blob.x) * 0.008;
        blob.y += (targetY - blob.y) * 0.008;

        // Breathing radius
        const breathe = 1 + Math.sin(time * 1.5 + blob.phase) * 0.08;
        const r = blob.radius * breathe;

        // Draw radial gradient blob
        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, r);
        const [cr, cg, cb] = blob.color;
        gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.4)`);
        gradient.addColorStop(0.4, `rgba(${cr}, ${cg}, ${cb}, 0.15)`);
        gradient.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      // Reset composite
      ctx.globalCompositeOperation = "source-over";

      // Film grain — pixel-level noise rendered on offscreen canvas
      const nc = noiseCanvas.current;
      const nctx = noiseCtx.current;
      if (nc && nctx) {
        const nw = nc.width;
        const nh = nc.height;
        const imageData = nctx.createImageData(nw, nh);
        const data = imageData.data;
        // Fast PRNG-style noise — every pixel gets a random luminance
        for (let i = 0, len = data.length; i < len; i += 4) {
          const v = (Math.random() * 255) | 0;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = 2.5; // 10% opacity
        }
        nctx.putImageData(imageData, 0, 0);
        // Draw grain over the main canvas, stretched to full res
        ctx.drawImage(nc, 0, 0, w, h);
      }

      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onPointerLeave);
    };
  }, [initBlobs]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ touchAction: "pan-y" }}
    />
  );
}
