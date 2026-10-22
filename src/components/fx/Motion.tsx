"use client";

/**
 * Motion pieces adapted from 21st.dev:
 *  - NumberTicker     ← @danielpetho/basic-number-ticker (now starts when scrolled into view)
 *  - ContainerScroll  ← @manuarora700/container-scroll-animation (3D tilt-to-flat on scroll)
 *  - CircularGallery  ← @ravikatiyar162/circular-gallery (scroll-driven 3D carousel + cursor tilt)
 *  - TestimonialsColumn ← @efferd/testimonials-columns-1 (infinite vertical columns)
 *  - GooeyMarquee     ← @designali-in/gooey-marquee (contrast/blur "liquid" text marquee)
 *  - ShineBorder      ← @dillionverma/shine-border (rotating light border)
 */
import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

export function NumberTicker({ to, suffix = "", className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const v = useMotionValue(0);
  const rounded = useTransform(v, (x) => Math.round(x).toLocaleString() + suffix);
  useEffect(() => {
    if (!inView) return;
    const c = animate(v, to, { duration: 2.4, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [inView, to, v]);
  return (
    <motion.span ref={ref} className={cn("tabular-nums", className)}>
      {rounded}
    </motion.span>
  );
}

export function ContainerScroll({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const f = () => setMobile(innerWidth <= 768);
    f();
    addEventListener("resize", f);
    return () => removeEventListener("resize", f);
  }, []);
  const rotate = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], mobile ? [0.8, 0.95] : [1.08, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, -40]);
  return (
    <div ref={ref} className="relative flex min-h-[52rem] items-center justify-center px-4 py-24 md:min-h-[64rem] md:px-16">
      <div className="w-full" style={{ perspective: "1000px" }}>
        <motion.div style={{ y }} className="mx-auto max-w-5xl text-center">
          {title}
        </motion.div>
        <motion.div
          style={{
            rotateX: rotate,
            scale,
            boxShadow:
              "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 0 120px rgba(34,166,217,.25)",
          }}
          className="mx-auto mt-10 h-[26rem] w-full max-w-5xl rounded-[30px] border-4 border-sky/30 bg-tide p-2 md:h-[38rem] md:p-4"
        >
          <div className="h-full w-full overflow-hidden rounded-2xl bg-abyss">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}

export type GalleryItem = { src: string; title: string; tag: string };

export function CircularGallery({ items, radius = 560 }: { items: GalleryItem[]; radius?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const base = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const auto = useMotionValue(0);
  const tiltX = useSpring(0, { stiffness: 60, damping: 20 });
  const [rot, setRot] = useState(0);
  const [r, setR] = useState(radius);

  useEffect(() => {
    const f = () => setR(innerWidth < 640 ? 300 : innerWidth < 1024 ? 440 : radius);
    f();
    addEventListener("resize", f);
    return () => removeEventListener("resize", f);
  }, [radius]);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      auto.set(auto.get() + 0.04);
      setRot(base.get() + auto.get());
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [auto, base]);

  const per = 360 / items.length;
  return (
    <div
      ref={ref}
      className="relative h-[34rem] w-full md:h-[40rem]"
      style={{ perspective: "2000px" }}
      onPointerMove={(e) => {
        const b = e.currentTarget.getBoundingClientRect();
        tiltX.set(((e.clientY - b.top) / b.height - 0.5) * -14);
      }}
      onPointerLeave={() => tiltX.set(0)}
    >
      <motion.div className="relative h-full w-full" style={{ rotateX: tiltX, transformStyle: "preserve-3d" }}>
        <div className="relative h-full w-full" style={{ transform: `rotateY(${rot}deg)`, transformStyle: "preserve-3d" }}>
          {items.map((it, i) => {
            const ang = i * per;
            const rel = (ang + rot + 360) % 360;
            const norm = Math.abs(rel > 180 ? 360 - rel : rel);
            const op = Math.max(0.25, 1 - norm / 180);
            return (
              <div
                key={it.src + i}
                className="absolute left-1/2 top-1/2 h-[300px] w-[230px] md:h-[380px] md:w-[290px]"
                style={{
                  transform: `translate(-50%,-50%) rotateY(${ang}deg) translateZ(${r}px)`,
                  opacity: op,
                }}
              >
                <div className="group relative h-full w-full overflow-hidden rounded-2xl border border-sky/25 bg-deep shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.src} alt={it.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-abyss via-abyss/70 to-transparent p-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-sky">{it.tag}</span>
                    <h3 className="text-lg font-semibold">{it.title}</h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export type Review = { text: string; name: string; area: string; service: string };

export function TestimonialsColumn({ reviews, duration = 14, className }: { reviews: Review[]; duration?: number; className?: string }) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{ duration, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        className="flex flex-col gap-5 pb-5"
      >
        {[0, 1].map((k) => (
          <React.Fragment key={k}>
            {reviews.map((r, i) => (
              <div
                key={i}
                className="w-full max-w-xs rounded-3xl border border-sky/15 bg-gradient-to-b from-tide/70 to-deep/40 p-7 shadow-lg shadow-sky/5 backdrop-blur"
              >
                <div className="mb-3 flex gap-0.5 text-sky" aria-label="5 stars">
                  {"★★★★★".split("").map((s, j) => (
                    <span key={j}>{s}</span>
                  ))}
                </div>
                <p className="text-[15px] leading-relaxed text-white/85">{r.text}</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-sky to-navy text-sm font-bold">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="font-medium leading-5">{r.name}</div>
                    <div className="text-sm leading-5 text-muted">
                      {r.area} · {r.service}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

export function GooeyMarquee({ text, speed = 22 }: { text: string; speed?: number }) {
  const line = (blur?: boolean) => (
    <p
      className="absolute whitespace-nowrap font-bold tracking-tight"
      style={{ animation: `gooey ${speed}s linear infinite`, filter: blur ? "blur(0.07em)" : undefined }}
    >
      {text} {text}
    </p>
  );
  return (
    <div className="relative flex h-28 w-full items-center overflow-hidden text-6xl md:h-40 md:text-8xl" aria-label={text}>
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center"
        style={{
          backgroundColor: "#04141d",
          backgroundImage: "linear-gradient(to right, #22a6d9, 1rem, transparent 50%), linear-gradient(to left, #22a6d9, 1rem, transparent 50%)",
          filter: "contrast(15)",
          color: "#22a6d9",
        }}
      >
        {line(true)}
      </div>
      <div aria-hidden="true" className="absolute inset-0 flex items-center text-white mix-blend-screen">
        {line()}
      </div>
      <style>{`@keyframes gooey{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

export function ShineBorder({
  children,
  className,
  radius = 28,
  width = 2,
  duration = 10,
  colors = ["#22a6d9", "#ffffff", "#0c4a63"],
}: {
  children: React.ReactNode;
  className?: string;
  radius?: number;
  width?: number;
  duration?: number;
  colors?: string[];
}) {
  return (
    <div className={cn("relative isolate", className)} style={{ borderRadius: radius }}>
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 motion-safe:animate-shine"
        style={
          {
            borderRadius: radius,
            padding: width,
            "--duration": `${duration}s`,
            backgroundImage: `radial-gradient(transparent, transparent, ${colors.join(",")}, transparent, transparent)`,
            backgroundSize: "300% 300%",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          } as React.CSSProperties
        }
      />
    </div>
  );
}
