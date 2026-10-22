"use client";

/**
 * Extras adapted from 21st.dev:
 *  - BackgroundPaths ← @kokonutd/background-paths (flowing SVG hose-lines, brand sky)
 *  - Faq             ← @scrollxui/frequently-asked-questions-with-accordion (blur-in title,
 *                      staggered radix accordion)
 *  - GiantFooterName ← @arihantcodes_1f7b8c4d/large-name-footer (huge wordmark, now with a
 *                      cursor-following "clean" spotlight that washes the letters bright)
 */
import { useMemo, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

function Paths({ position }: { position: number }) {
  const paths = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        w: 0.5 + i * 0.03,
        dur: 18 + ((i * 7) % 11),
      })),
    [position],
  );
  return (
    <svg className="absolute inset-0 h-full w-full text-sky" viewBox="0 0 696 316" fill="none" preserveAspectRatio="xMidYMid slice">
      {paths.map((p) => (
        <motion.path
          key={p.id}
          d={p.d}
          stroke="currentColor"
          strokeWidth={p.w}
          strokeOpacity={0.05 + p.id * 0.012}
          initial={{ pathLength: 0.3, opacity: 0.6 }}
          animate={{ pathLength: 1, opacity: [0.3, 0.6, 0.3], pathOffset: [0, 1, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </svg>
  );
}

export function BackgroundPaths({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <Paths position={1} />
      <Paths position={-1} />
    </div>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <Accordion.Root type="single" collapsible className="w-full">
      {items.map((it, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
        >
          <Accordion.Item value={`i${i}`} className="border-b border-sky/15">
            <Accordion.Header className="flex">
              <Accordion.Trigger
                data-magnetic
                className="group flex flex-1 items-center justify-between gap-6 rounded-xl py-5 text-left text-lg font-medium transition-colors hover:text-sky"
              >
                {it.q}
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-sky/30 text-sky transition-transform duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-sky group-data-[state=open]:text-abyss">
                  <Plus className="h-4 w-4" />
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="mb-5 rounded-2xl border border-sky/15 bg-tide/40 p-5 text-[15px] leading-relaxed text-white/80 backdrop-blur">
                {it.a}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </motion.div>
      ))}
    </Accordion.Root>
  );
}

export function GiantFooterName() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(-999), { stiffness: 120, damping: 20 });
  const y = useSpring(useMotionValue(-999), { stiffness: 120, damping: 20 });
  const mask = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, black 0%, transparent 70%)`;
  return (
    <div
      ref={ref}
      className="relative select-none"
      onPointerMove={(e) => {
        const b = ref.current!.getBoundingClientRect();
        x.set(e.clientX - b.left);
        y.set(e.clientY - b.top);
      }}
      onPointerLeave={() => {
        x.set(-999);
        y.set(-999);
      }}
      aria-hidden="true"
    >
      <p className="bg-gradient-to-b from-white/10 to-white/0 bg-clip-text whitespace-nowrap text-center text-[15vw] font-bold leading-[0.9] tracking-tighter text-transparent">
        TOWN MADE
      </p>
      <motion.p
        style={{ WebkitMaskImage: mask, maskImage: mask }}
        className="absolute inset-0 bg-gradient-to-b from-white via-sky to-navy bg-clip-text whitespace-nowrap text-center text-[15vw] font-bold leading-[0.9] tracking-tighter text-transparent"
      >
        TOWN MADE
      </motion.p>
    </div>
  );
}
