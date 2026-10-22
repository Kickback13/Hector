"use client";

/**
 * SprayCursor — your mouse is the pressure washer.
 * Fuses two 21st.dev components, re-tuned for Town Made:
 *  - @jahed/magnetic-cursor: lerped blob cursor that stretches with speed and
 *    snaps/morphs around anything marked [data-magnetic] (elastic GSAP pull)
 *  - @pulkitxm/fluid-cursor-trail: particle trail, turned into water droplets
 *    with gravity in brand sky-blue, plus a splash burst on click.
 */
import { useEffect, useRef } from "react";
import gsap from "gsap";

type Drop = { x: number; y: number; vx: number; vy: number; life: number; r: number; hue: number };

export default function SprayCursor() {
  const blobRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;
    document.documentElement.classList.add("has-fx-cursor");

    const blob = blobRef.current!;
    const dot = dotRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

    const resize = () => {
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener("resize", resize);

    gsap.set([blob, dot], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const pos = { x: -100, y: -100 };
    const target = { x: -100, y: -100 };
    const prev = { x: -100, y: -100 };
    let hovered: HTMLElement | null = null;
    let drops: Drop[] = [];
    let last = { x: 0, y: 0, t: performance.now() };

    const spawn = (x: number, y: number, n: number, power: number, spread = Math.PI * 2, angle = 0) => {
      for (let i = 0; i < n; i++) {
        const a = angle + (Math.random() - 0.5) * spread;
        const s = (0.4 + Math.random()) * power;
        drops.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 1,
          r: 0.8 + Math.random() * 2.6,
          hue: 190 + Math.random() * 18,
        });
      }
      if (drops.length > 900) drops = drops.slice(-900);
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      gsap.set(dot, { x: e.clientX, y: e.clientY });
      if (reduced) return;
      const now = performance.now();
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      const speed = Math.min(Math.hypot(dx, dy) / Math.max(now - last.t, 1), 4);
      last = { x: e.clientX, y: e.clientY, t: now };
      // spray trails behind the motion, like a wand sweeping
      const back = Math.atan2(-dy, -dx);
      spawn(e.clientX, e.clientY, 1 + Math.round(speed * 2.2), 1.2 + speed * 1.4, 1.1, back);
    };

    const onDown = (e: PointerEvent) => {
      if (reduced) return;
      spawn(e.clientX, e.clientY, 46, 7);
      gsap.fromTo(
        blob,
        { scale: 0.6 },
        { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.35)", overwrite: "auto" },
      );
    };

    const leave = () => gsap.to([blob, dot], { opacity: 0, duration: 0.25 });
    const enter = () => gsap.to([blob, dot], { opacity: 1, duration: 0.25 });

    addEventListener("pointermove", onMove);
    addEventListener("pointerdown", onDown);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    // Magnetic targets: blob wraps the element, element is pulled toward the cursor
    const cleanups: (() => void)[] = [];
    const bind = (el: HTMLElement) => {
      if (el.dataset.magBound) return;
      el.dataset.magBound = "1";
      const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "elastic.out(1, 0.3)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "elastic.out(1, 0.3)" });
      const pe = () => {
        hovered = el;
        const b = el.getBoundingClientRect();
        gsap.to(blob, {
          width: b.width + 18,
          height: b.height + 18,
          borderRadius: getComputedStyle(el).borderRadius || "14px",
          backgroundColor: "rgba(34,166,217,0.16)",
          borderColor: "rgba(34,166,217,0.9)",
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });
      };
      const pm = (e: PointerEvent) => {
        const b = el.getBoundingClientRect();
        xTo((e.clientX - (b.left + b.width / 2)) * 0.3);
        yTo((e.clientY - (b.top + b.height / 2)) * 0.3);
      };
      const pl = () => {
        hovered = null;
        xTo(0);
        yTo(0);
        gsap.to(blob, {
          width: 38,
          height: 38,
          borderRadius: "50%",
          backgroundColor: "rgba(34,166,217,0.06)",
          borderColor: "rgba(34,166,217,0.75)",
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });
      };
      el.addEventListener("pointerenter", pe);
      el.addEventListener("pointermove", pm);
      el.addEventListener("pointerleave", pl);
      cleanups.push(() => {
        el.removeEventListener("pointerenter", pe);
        el.removeEventListener("pointermove", pm);
        el.removeEventListener("pointerleave", pl);
        delete el.dataset.magBound;
      });
    };
    const scan = () => document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach(bind);
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    let raf = 0;
    const tick = () => {
      // blob follow + speed stretch
      if (hovered) {
        const b = hovered.getBoundingClientRect();
        pos.x += (b.left + b.width / 2 - pos.x) * 0.3;
        pos.y += (b.top + b.height / 2 - pos.y) * 0.3;
        gsap.set(blob, { x: pos.x, y: pos.y, rotate: 0, scaleX: 1, scaleY: 1 });
      } else {
        pos.x += (target.x - pos.x) * 0.16;
        pos.y += (target.y - pos.y) * 0.16;
        const dx = pos.x - prev.x;
        const dy = pos.y - prev.y;
        const sp = Math.min(Math.hypot(dx, dy) * 0.025, 0.55);
        gsap.set(blob, {
          x: pos.x,
          y: pos.y,
          rotate: (Math.atan2(dy, dx) * 180) / Math.PI,
          scaleX: 1 + sp,
          scaleY: 1 - sp * 0.6,
        });
      }
      prev.x = pos.x;
      prev.y = pos.y;

      // water droplets
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      const next: Drop[] = [];
      for (const d of drops) {
        d.vy += 0.22;
        d.vx *= 0.985;
        d.x += d.vx;
        d.y += d.vy;
        d.life -= 0.022;
        if (d.life <= 0 || d.y > innerHeight + 10) continue;
        next.push(d);
        const a = Math.max(d.life, 0);
        ctx.beginPath();
        ctx.fillStyle = `hsla(${d.hue}, 85%, ${60 + a * 25}%, ${a * 0.85})`;
        ctx.ellipse(d.x, d.y, d.r, d.r * (1 + Math.min(Math.abs(d.vy) * 0.08, 1.2)), 0, 0, Math.PI * 2);
        ctx.fill();
        if (d.r > 2.4) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255,255,255,${a * 0.7})`;
          ctx.arc(d.x - d.r * 0.3, d.y - d.r * 0.3, d.r * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      drops = next;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      mo.disconnect();
      cleanups.forEach((c) => c());
      document.documentElement.classList.remove("has-fx-cursor");
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[9997] hidden [@media(pointer:fine)]:block" />
      <div
        ref={blobRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden rounded-full border-[1.5px] border-sky/75 bg-sky/5 backdrop-blur-[1px] [@media(pointer:fine)]:block"
        style={{ width: 38, height: 38, willChange: "transform,width,height" }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_2px_rgba(34,166,217,0.9)] [@media(pointer:fine)]:block"
      />
    </>
  );
}
