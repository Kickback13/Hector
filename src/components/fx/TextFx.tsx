"use client";

/**
 * Text effects adapted from 21st.dev:
 *  - TextRotate      ← @danielpetho/text-rotate (spring, per-character stagger)
 *  - BlurReveal      ← @tom_ui/blur-reveal (letters de-blur into place)
 *  - ShimmerText     ← @tom_ui/shimmer-text (light sweep across text)
 *  - ScrollWordReveal← @motiondotdev/motion-scroll-word-reveal (words light up as you scroll)
 *  - SplitHeading    ← @kokonutd/background-paths heading (letters spring up)
 */
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

const splitChars = (t: string) => Array.from(t);

export function TextRotate({
  texts,
  interval = 2200,
  className,
  charClassName,
}: {
  texts: string[];
  interval?: number;
  className?: string;
  charClassName?: string;
}) {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const cur = useRef(0);
  useEffect(() => {
    const id = setInterval(() => {
      const n = cur.current;
      cur.current = (n + 1) % texts.length;
      setPrev(n);
      setI(cur.current);
    }, interval);
    return () => clearInterval(id);
  }, [texts.length, interval]);
  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 600);
    return () => clearTimeout(t);
  }, [prev, i]);

  const word = (idx: number, leaving: boolean) => {
    const chars = splitChars(texts[idx]);
    return (
      <span key={`${idx}-${leaving ? "out" : "in"}`} className={cn("inline-flex", leaving && "absolute inset-y-0 left-3")} aria-hidden="true">
        {chars.map((c, k) => (
          <motion.span
            key={k}
            initial={leaving ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
            animate={leaving ? { y: "-120%", opacity: 0 } : { y: "0%", opacity: 1 }}
            transition={
              leaving
                ? { duration: 0.28, ease: "easeIn", delay: k * 0.012 }
                : { type: "spring", damping: 24, stiffness: 320, delay: 0.12 + (chars.length - 1 - k) * 0.022 }
            }
            className={cn("inline-block", c === " " && "w-[0.3em]", charClassName)}
          >
            {c}
          </motion.span>
        ))}
      </span>
    );
  };

  return (
    <motion.span layout transition={{ type: "spring", damping: 26, stiffness: 300 }} className={cn("relative inline-flex overflow-hidden", className)}>
      <span className="sr-only">{texts[i]}</span>
      {prev !== null && word(prev, true)}
      {word(i, false)}
    </motion.span>
  );
}

export function BlurReveal({
  children,
  className,
  delay = 0,
  as = "p",
}: {
  children: string;
  className?: string;
  delay?: number;
  as?: "p" | "span" | "h2" | "h3";
}) {
  const Tag = motion[as] as typeof motion.p;
  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.012, delayChildren: delay } } }}
      className={className}
    >
      <span className="sr-only">{children}</span>
      {children.split(" ").map((w, wi, arr) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden="true">
          {splitChars(w).map((c, ci) => (
            <motion.span
              key={ci}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, filter: "blur(12px)", y: 10 },
                visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.5 } },
              }}
            >
              {c}
            </motion.span>
          ))}
          {wi < arr.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}

export function ShimmerText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span
      className={cn("inline-block", className)}
      style={{
        WebkitTextFillColor: "transparent",
        background:
          "currentColor linear-gradient(to right, currentColor 0%, rgba(255,255,255,0.95) 40%, rgba(255,255,255,0.95) 60%, currentColor 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        backgroundRepeat: "no-repeat",
        backgroundSize: "50% 200%",
      }}
      initial={{ backgroundPositionX: "250%" }}
      animate={{ backgroundPositionX: ["-100%", "250%"] }}
      transition={{ duration: 1.6, delay: 0.8, repeat: Infinity, repeatDelay: 2, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}

export function SplitHeading({ text, className, gradient = true }: { text: string; className?: string; gradient?: boolean }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden="true" className="mr-[0.25em] inline-block last:mr-0">
          {splitChars(w).map((c, ci) => (
            <motion.span
              key={ci}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + wi * 0.1 + ci * 0.03, type: "spring", stiffness: 150, damping: 22 }}
              className={cn(
                "inline-block",
                gradient && "bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent",
              )}
            >
              {c}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}

function Word({
  children,
  progress,
  range,
  hi,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  hi?: boolean;
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const blur = useTransform(progress, range, ["blur(6px)", "blur(0px)"]);
  const color = useTransform(progress, range, hi ? ["#22a6d9", "#22a6d9"] : ["#8fb3c2", "#ffffff"]);
  return (
    <motion.span aria-hidden="true" style={{ opacity, filter: blur, color }} className={cn("inline-block", hi && "text-glow")}>
      {children}
    </motion.span>
  );
}

export function ScrollWordReveal({ text, highlight = [] as string[], className }: { text: string; highlight?: string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 45%"] });
  const words = useMemo(() => text.split(" "), [text]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div
        style={{ scaleY: bar }}
        className="absolute -left-6 top-0 hidden h-full w-[3px] origin-top rounded-full bg-gradient-to-b from-sky to-sky/0 md:block"
      />
      <p className="sr-only">{text}</p>
      <p className="text-balance text-3xl font-medium leading-[1.25] tracking-tight md:text-5xl">
        {words.map((w, i) => {
          const start = (i / words.length) * 0.85;
          const isHi = highlight.some((h) => w.toLowerCase().includes(h));
          return (
            <Fragment key={i}>
              <Word progress={scrollYProgress} range={[start, Math.min(1, start + 0.15)]} hi={isHi}>
                {w}
              </Word>{" "}
            </Fragment>
          );
        })}
      </p>
    </div>
  );
}
