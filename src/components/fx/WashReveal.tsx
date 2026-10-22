"use client";

/**
 * WashReveal — sweep the cursor (or drag a finger) across the grimy photo and it
 * washes away for good, revealing the clean shot underneath. Tracks % cleaned.
 * Built from the clip/reveal idea in 21st.dev @ibrandify/before-after-comparison,
 * turned into a persistent "paint-to-clean" canvas.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, Sparkles } from "lucide-react";

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const ir = img.naturalWidth / img.naturalHeight;
  const cr = w / h;
  let sw = img.naturalWidth,
    sh = img.naturalHeight,
    sx = 0,
    sy = 0;
  if (ir > cr) {
    sw = sh * cr;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = sw / cr;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
}

export default function WashReveal({ before, after }: { before: string; after: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const down = useRef(false);
  const [pct, setPct] = useState(0);
  const [hint, setHint] = useState(true);

  const paint = useCallback(() => {
    const c = canvasRef.current;
    const img = imgRef.current;
    if (!c || !img) return;
    const ctx = c.getContext("2d")!;
    ctx.globalCompositeOperation = "source-over";
    drawCover(ctx, img, c.width, c.height);
    setPct(0);
  }, []);

  const setup = useCallback(() => {
    const c = canvasRef.current;
    const w = wrapRef.current;
    if (!c || !w) return;
    const r = w.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = Math.round(r.width * dpr);
    c.height = Math.round(r.height * dpr);
    paint();
  }, [paint]);

  useEffect(() => {
    const img = new Image();
    img.src = before;
    img.onload = () => {
      imgRef.current = img;
      setup();
    };
    const ro = new ResizeObserver(() => imgRef.current && setup());
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [before, setup]);

  const measure = useRef(0);
  const sample = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    // sample a coarse grid of alpha values
    const step = Math.max(8, Math.floor(c.width / 90));
    const data = ctx.getImageData(0, 0, c.width, c.height).data;
    let clear = 0,
      total = 0;
    for (let y = 0; y < c.height; y += step) {
      for (let x = 0; x < c.width; x += step) {
        total++;
        if (data[(y * c.width + x) * 4 + 3] < 40) clear++;
      }
    }
    setPct(Math.round((clear / total) * 100));
  };

  const scrub = (x: number, y: number) => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const dpr = c.width / c.getBoundingClientRect().width;
    const px = x * dpr,
      py = y * dpr;
    const r = Math.max(c.width, c.height) * 0.06;
    ctx.globalCompositeOperation = "destination-out";
    const from = last.current ?? { x: px, y: py };
    const dist = Math.hypot(px - from.x, py - from.y);
    const steps = Math.max(1, Math.ceil(dist / (r * 0.3)));
    for (let i = 0; i <= steps; i++) {
      const ix = from.x + ((px - from.x) * i) / steps;
      const iy = from.y + ((py - from.y) * i) / steps;
      const g = ctx.createRadialGradient(ix, iy, r * 0.15, ix, iy, r);
      g.addColorStop(0, "rgba(0,0,0,0.95)");
      g.addColorStop(0.6, "rgba(0,0,0,0.5)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(ix, iy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    last.current = { x: px, y: py };
    if (++measure.current % 6 === 0) sample();
  };

  const local = (e: React.PointerEvent) => {
    const b = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - b.left, y: e.clientY - b.top };
  };

  const done = pct >= 82;

  return (
    <div className="relative">
      <div
        ref={wrapRef}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-sky/25 bg-deep shadow-[0_40px_120px_-30px_rgba(34,166,217,0.45)] md:aspect-[16/9]"
        style={{ touchAction: "pan-y" }}
      >
        {/* clean photo underneath */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={after} alt="Freshly pressure washed driveway" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-label="Dirty driveway — move your cursor or drag to wash it clean"
          role="img"
          onPointerMove={(e) => {
            if (e.pointerType === "mouse" || down.current) {
              setHint(false);
              const p = local(e);
              scrub(p.x, p.y);
            }
          }}
          onPointerDown={(e) => {
            down.current = true;
            last.current = null;
            const p = local(e);
            scrub(p.x, p.y);
          }}
          onPointerUp={() => {
            down.current = false;
            last.current = null;
            sample();
          }}
          onPointerLeave={() => {
            down.current = false;
            last.current = null;
          }}
        />

        <AnimatePresence>
          {hint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="pointer-events-none absolute inset-0 grid place-items-center"
            >
              <div className="flex items-center gap-3 rounded-full border border-white/20 bg-abyss/60 px-5 py-3 text-sm font-medium backdrop-blur-md">
                <motion.span
                  animate={{ x: [-18, 18, -18] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  className="grid h-7 w-7 place-items-center rounded-full bg-sky text-abyss"
                >
                  ↔
                </motion.span>
                Sweep across the photo to wash it
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HUD */}
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-3 rounded-2xl border border-white/15 bg-abyss/55 px-4 py-2.5 backdrop-blur-md">
          <div className="relative h-2 w-28 overflow-hidden rounded-full bg-white/15">
            <motion.div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sky to-white" animate={{ width: `${pct}%` }} />
          </div>
          <span className="w-16 text-sm font-semibold tabular-nums">{pct}% clean</span>
        </div>

        <button
          type="button"
          data-magnetic
          onClick={() => {
            paint();
            setHint(true);
          }}
          className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-abyss/55 px-4 py-2.5 text-sm font-medium backdrop-blur-md transition hover:bg-abyss/80"
        >
          <RotateCcw className="h-4 w-4" /> Dirty it again
        </button>

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-4 bottom-4 flex flex-col items-start justify-between gap-3 rounded-2xl border border-sky/40 bg-abyss/75 p-4 backdrop-blur-xl sm:flex-row sm:items-center md:inset-x-auto md:right-4 md:max-w-md"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 shrink-0 text-sky" />
                <p className="text-sm">
                  <span className="font-semibold">Spotless.</span> Now imagine your actual driveway.
                </p>
              </div>
              <a
                href="#quote"
                data-magnetic
                className="shrink-0 rounded-full bg-sky px-4 py-2 text-sm font-semibold text-abyss"
              >
                Get my free quote
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
