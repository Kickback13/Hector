"use client";

/**
 * OrbitalProcess — 21st.dev @jatin-yadav05/radial-orbital-timeline, retuned for
 * the job process: nodes orbit a glowing nozzle core; click a step to lock it in
 * front and open its card. Related steps pulse. Brand colors, responsive radius.
 */
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

export type Step = { id: number; title: string; when: string; body: string; icon: React.ElementType; related: number[] };

export default function OrbitalProcess({ steps }: { steps: Step[] }) {
  const [angle, setAngle] = useState(0);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [radius, setRadius] = useState(220);
  const auto = useRef(true);

  useEffect(() => {
    const f = () => setRadius(innerWidth < 640 ? 125 : innerWidth < 1024 ? 180 : 230);
    f();
    addEventListener("resize", f);
    return () => removeEventListener("resize", f);
  }, []);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (auto.current) setAngle((a) => (a + 0.18) % 360);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggle = (id: number) => {
    if (activeId === id) {
      setActiveId(null);
      auto.current = true;
      return;
    }
    setActiveId(id);
    auto.current = false;
    const idx = steps.findIndex((s) => s.id === id);
    setAngle(270 - (idx / steps.length) * 360);
  };

  const active = steps.find((s) => s.id === activeId);
  const related = active?.related ?? [];

  return (
    <div
      className="relative mx-auto flex h-[32rem] w-full max-w-4xl items-center justify-center md:h-[40rem]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setActiveId(null);
          auto.current = true;
        }
      }}
    >
      {/* rings */}
      <div className="pointer-events-none absolute rounded-full border border-sky/15" style={{ width: radius * 2, height: radius * 2 }} />
      <div className="pointer-events-none absolute rounded-full border border-dashed border-sky/10" style={{ width: radius * 2.5, height: radius * 2.5 }} />

      {/* core */}
      <div className="pointer-events-none absolute z-10 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-sky via-navy to-abyss shadow-[0_0_60px_rgba(34,166,217,0.6)]">
        <span className="absolute h-24 w-24 animate-ping rounded-full border border-sky/30" />
        <span className="absolute h-28 w-28 animate-ping rounded-full border border-sky/15 [animation-delay:.5s]" />
        <LogoMark className="h-10 w-auto" navy="#fff" />
      </div>

      {steps.map((s, i) => {
        const a = (((i / steps.length) * 360 + angle) % 360) * (Math.PI / 180);
        const x = radius * Math.cos(a);
        const y = radius * Math.sin(a);
        const z = Math.round(100 + 50 * Math.cos(a));
        const op = Math.max(0.45, Math.min(1, 0.45 + 0.55 * ((1 + Math.sin(a)) / 2)));
        const on = s.id === activeId;
        const rel = related.includes(s.id);
        const Icon = s.icon;
        return (
          <div
            key={s.id}
            className="absolute transition-[opacity] duration-500"
            style={{ transform: `translate(${x}px, ${y}px)`, zIndex: on ? 200 : z, opacity: on ? 1 : op }}
          >
            <button
              type="button"
              data-magnetic
              onClick={(e) => {
                e.stopPropagation();
                toggle(s.id);
              }}
              aria-expanded={on}
              className={cn(
                "relative grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 transition-all duration-300",
                on
                  ? "scale-125 border-white bg-sky text-abyss shadow-[0_0_30px_rgba(34,166,217,0.9)]"
                  : rel
                    ? "animate-pulse border-sky bg-sky/30 text-white"
                    : "border-sky/40 bg-abyss text-sky hover:border-sky",
              )}
            >
              <Icon className="h-5 w-5" />
            </button>
            <div
              className={cn(
                "pointer-events-none absolute left-0 top-7 -translate-x-1/2 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.18em] transition-all",
                on ? "text-white" : "text-white/60",
              )}
            >
              {s.title}
            </div>
          </div>
        );
      })}

      <AnimatePresence>
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-0 z-[300] w-[min(92vw,22rem)] rounded-2xl border border-sky/30 bg-abyss/90 p-5 shadow-[0_20px_60px_rgba(34,166,217,0.25)] backdrop-blur-xl md:bottom-4"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-sky/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-sky">
                Step {steps.findIndex((s) => s.id === active.id) + 1}
              </span>
              <span className="font-mono text-xs text-muted">{active.when}</span>
            </div>
            <h3 className="mt-3 text-lg font-semibold">{active.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-white/75">{active.body}</p>
            {active.related.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-3">
                {active.related.map((rid) => {
                  const r = steps.find((s) => s.id === rid)!;
                  return (
                    <button
                      key={rid}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(rid);
                      }}
                      className="flex items-center gap-1 rounded-full border border-white/15 px-2.5 py-1 text-xs text-white/80 hover:bg-white/10"
                    >
                      {r.title} <ArrowRight className="h-3 w-3" />
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
