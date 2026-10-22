"use client";

/**
 * Before/after slider — adapted from 21st.dev @ibrandify/before-after-comparison.
 * Re-skinned dark/brand, with job tabs, auto-sweep when it scrolls into view,
 * keyboard support kept, and a glowing water-line handle.
 */
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

export type Job = { key: string; label: string; before: string; after: string; note: string };

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export default function BeforeAfter({ jobs }: { jobs: Job[] }) {
  const [active, setActive] = useState(0);
  const [value, setValue] = useState(50);
  const [dragging, setDragging] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { once: true, amount: 0.5 });
  const job = jobs[active];

  // sweep demo on first view and on tab change
  useEffect(() => {
    if (!inView) return;
    const seq = animate(0, 1, {
      duration: 2.2,
      ease: "easeInOut",
      onUpdate: (t) => setValue(t < 0.5 ? 50 + 42 * Math.sin(t * Math.PI * 2) : 50 - 38 * Math.sin((t - 0.5) * Math.PI * 2)),
    });
    return () => seq.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, active]);

  const update = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setValue(clamp(((clientX - r.left) / r.width) * 100));
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Job type">
        {jobs.map((j, i) => (
          <button
            key={j.key}
            role="tab"
            aria-selected={i === active}
            data-magnetic
            onClick={() => setActive(i)}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
              i === active ? "text-abyss" : "text-white/70 hover:text-white",
            )}
          >
            {i === active && (
              <motion.span layoutId="ba-tab" className="absolute inset-0 rounded-full bg-sky shadow-[0_0_30px_rgba(34,166,217,0.6)]" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
            )}
            <span className="relative">{j.label}</span>
          </button>
        ))}
      </div>

      <div
        ref={box}
        role="slider"
        tabIndex={0}
        aria-label={`${job.label} before and after`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
          update(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging || e.pointerType === "mouse") update(e.clientX);
        }}
        onPointerUp={() => setDragging(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setValue((v) => clamp(v - 4));
          if (e.key === "ArrowRight") setValue((v) => clamp(v + 4));
        }}
        className="group relative aspect-[4/3] w-full select-none overflow-hidden rounded-[28px] border border-sky/20 bg-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky md:aspect-[16/10]"
        style={{ touchAction: "pan-y" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={job.after} src={job.after} alt={`${job.label} after cleaning`} className="pointer-events-none absolute inset-0 h-full w-full object-cover" draggable={false} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={job.before}
          src={job.before}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
          draggable={false}
        />
        <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/20 bg-abyss/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
          Before
        </span>
        <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-sky px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-abyss">
          After
        </span>

        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${value}%` }}>
          <div className="absolute inset-y-0 -left-px w-[2px] bg-white shadow-[0_0_18px_4px_rgba(34,166,217,0.9)]" />
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="grid h-14 w-14 place-items-center rounded-full border-2 border-white bg-sky/90 text-abyss shadow-[0_0_40px_rgba(34,166,217,0.9)] backdrop-blur transition-transform group-active:scale-90">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 3 12 9 6" />
                <polyline points="15 6 21 12 15 18" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted">{job.note}</p>
    </div>
  );
}
