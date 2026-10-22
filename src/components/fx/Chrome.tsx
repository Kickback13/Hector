"use client";

/**
 * Site chrome adapted from 21st.dev:
 *  - TubelightNav      ← @ayushmxxn/tubelight-navbar (sliding "lamp" glow on the active link, scroll-spy)
 *  - LiquidMetalButton ← @johuniq/liquid-metal-button (live liquid-metal shader rim, ripple on click)
 *  - InteractiveButton ← @dillionverma/interactive-hover-button (dot floods the button on hover)
 *  - MobileDock        ← @isaiahbjork/message-dock (floating spring dock: call / text / quote)
 */
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Phone, MessageSquareText, FileText, Home, Wrench, Sparkles, HelpCircle } from "lucide-react";
import { LogoLockup } from "@/components/brand/Logo";
import { cn, PHONE_DISPLAY, PHONE_TEL } from "@/lib/utils";

const LiquidMetal = dynamic(() => import("@paper-design/shaders-react").then((m) => m.LiquidMetal), { ssr: false });

const items = [
  { name: "Services", url: "#services", icon: Wrench },
  { name: "Results", url: "#results", icon: Sparkles },
  { name: "Process", url: "#process", icon: Home },
  { name: "FAQ", url: "#faq", icon: HelpCircle },
];

export function TubelightNav() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(scrollY > 40);
      let cur = "";
      for (const it of items) {
        const el = document.querySelector(it.url);
        if (el && el.getBoundingClientRect().top < innerHeight * 0.45) cur = it.name;
      }
      setActive(cur);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "border-b border-sky/10 bg-abyss/75 py-3 backdrop-blur-xl" : "py-5",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <a href="#top" aria-label="Town Made Cleaning — home" data-magnetic className="rounded-xl p-1">
          <LogoLockup />
        </a>
        <nav
          aria-label="Main"
          className={cn(
            "hidden items-center gap-1 rounded-full border px-1 py-1 backdrop-blur-xl transition-colors md:flex",
            scrolled ? "border-sky/20 bg-abyss/70" : "border-white/10 bg-white/5",
          )}
        >
          {items.map((it) => {
            const on = active === it.name;
            return (
              <a
                key={it.name}
                href={it.url}
                className={cn(
                  "relative rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                  on ? "text-sky" : "text-white/75 hover:text-white",
                )}
              >
                {it.name}
                {on && (
                  <motion.span layoutId="lamp" className="absolute inset-0 -z-10 rounded-full bg-sky/10" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                    <span className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-sky">
                      <span className="absolute -left-2 -top-2 h-6 w-12 rounded-full bg-sky/25 blur-md" />
                      <span className="absolute -top-1 h-6 w-8 rounded-full bg-sky/25 blur-md" />
                      <span className="absolute left-2 top-0 h-4 w-4 rounded-full bg-sky/25 blur-sm" />
                    </span>
                  </motion.span>
                )}
              </a>
            );
          })}
        </nav>
        <a
          href={`tel:${PHONE_TEL}`}
          data-magnetic
          className="hidden items-center gap-2 rounded-full border border-sky/40 bg-sky/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-sky hover:text-abyss sm:flex"
        >
          <Phone className="h-4 w-4" /> {PHONE_DISPLAY}
        </a>
      </div>
    </header>
  );
}

export function LiquidMetalButton({ label, href, className }: { label: string; href: string; className?: string }) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const [hover, setHover] = useState(false);
  const id = useRef(0);
  return (
    <a
      href={href}
      data-magnetic
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onClick={(e) => {
        const b = e.currentTarget.getBoundingClientRect();
        const r = { x: e.clientX - b.left, y: e.clientY - b.top, id: id.current++ };
        setRipples((p) => [...p, r]);
        setTimeout(() => setRipples((p) => p.filter((q) => q.id !== r.id)), 700);
      }}
      className={cn("group relative inline-flex h-14 items-center overflow-hidden rounded-full p-[3px]", className)}
    >
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <LiquidMetal
          style={{ width: "100%", height: "100%" }}
          colorBack="#0c4a63"
          colorTint="#22a6d9"
          shape="none"
          repetition={4}
          softness={0.5}
          shiftRed={0.3}
          shiftBlue={0.3}
          distortion={0.1}
          contour={0}
          angle={45}
          scale={8}
          speed={hover ? 1.4 : 0.6}
        />
      </span>
      <span className="relative flex h-full items-center gap-2 rounded-full bg-gradient-to-b from-[#0d2b3a] to-abyss px-7 text-base font-semibold text-white">
        {label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute h-5 w-5 rounded-full"
          style={{
            left: r.x,
            top: r.y,
            background: "radial-gradient(circle, rgba(34,166,217,.7) 0%, rgba(34,166,217,0) 70%)",
            animation: "lm-ripple .7s ease-out forwards",
          }}
        />
      ))}
      <style>{`@keyframes lm-ripple{0%{transform:translate(-50%,-50%) scale(0);opacity:.8}100%{transform:translate(-50%,-50%) scale(14);opacity:0}}`}</style>
    </a>
  );
}

export function InteractiveButton({ text, href, className }: { text: string; href: string; className?: string }) {
  return (
    <a
      href={href}
      data-magnetic
      className={cn(
        "group relative inline-flex h-14 min-w-44 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/5 px-6 text-center font-semibold backdrop-blur",
        className,
      )}
    >
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">{text}</span>
      <span className="absolute inset-0 z-10 flex translate-x-12 items-center justify-center gap-2 text-abyss opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
        <span>{text}</span>
        <ArrowRight className="h-4 w-4" />
      </span>
      <span className="absolute left-[18%] top-[42%] h-2 w-2 rounded-lg bg-sky transition-all duration-300 group-hover:left-0 group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:scale-[1.8]" />
    </a>
  );
}

export function MobileDock() {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    const f = () => setShow(scrollY > innerHeight * 0.6);
    f();
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  const btns = [
    { k: "call", label: "Call", icon: Phone, href: `tel:${PHONE_TEL}` },
    { k: "text", label: "Text", icon: MessageSquareText, href: `sms:${PHONE_TEL}` },
    { k: "quote", label: "Free quote", icon: FileText, href: "#quote" },
  ];
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 md:hidden"
        >
          <div className="flex items-center gap-2 rounded-full border border-sky/30 bg-abyss/80 p-2 shadow-[0_10px_40px_rgba(34,166,217,0.35)] backdrop-blur-xl">
            {btns.map((b) => {
              const Icon = b.icon;
              const primary = b.k === "quote";
              return (
                <motion.a
                  key={b.k}
                  href={b.href}
                  onTapStart={() => setOpen(b.k)}
                  whileTap={{ scale: 0.88 }}
                  animate={{ width: open === b.k || primary ? "auto" : 48 }}
                  className={cn(
                    "flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-3.5 text-sm font-semibold",
                    primary ? "bg-sky px-5 text-abyss" : "bg-white/10 text-white",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {(open === b.k || primary) && <span className="whitespace-nowrap">{b.label}</span>}
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
