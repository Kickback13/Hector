"use client";

/**
 * GlowCard — 21st.dev @easemize/spotlight-card (cursor-tracking glow border)
 * layered over a live 21st.dev @moazamtrade/feature-shader-cards Warp shader,
 * both locked to the Town Made sky-blue hue range.
 */
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const Warp = dynamic(() => import("@paper-design/shaders-react").then((m) => m.Warp), { ssr: false });

let listening = false;
function ensurePointerSync() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  document.addEventListener("pointermove", (e) => {
    const r = document.documentElement.style;
    r.setProperty("--x", e.clientX.toFixed(1));
    r.setProperty("--y", e.clientY.toFixed(1));
    r.setProperty("--xp", (e.clientX / innerWidth).toFixed(3));
  });
}

export function GlowCard({
  children,
  className,
  shader = true,
  palette = ["#04141d", "#0c4a63", "#22a6d9", "#062433"],
  seed = 0,
}: {
  children: React.ReactNode;
  className?: string;
  shader?: boolean;
  palette?: string[];
  seed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ensurePointerSync(), []);
  return (
    <div
      ref={ref}
      data-glow
      style={
        {
          "--radius": "26",
          "--border-size": "2px",
          "--spotlight-size": "260px",
          "--hue": "calc(190 + (var(--xp, 0.5) * 20))",
          backgroundImage:
            "radial-gradient(260px 260px at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px), hsl(197 100% 60% / 0.12), transparent)",
          backgroundAttachment: "fixed",
          border: "var(--border-size) solid rgba(34,166,217,0.14)",
        } as React.CSSProperties
      }
      className={cn("relative isolate overflow-visible rounded-[26px] bg-deep/60", className)}
    >
      <div data-glow />
      {shader && (
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-[24px] opacity-70">
          <Warp
            style={{ width: "100%", height: "100%" }}
            colors={palette}
            proportion={0.38 + (seed % 3) * 0.04}
            softness={1}
            distortion={0.18}
            swirl={0.75 + (seed % 2) * 0.1}
            swirlIterations={10 + seed}
            shape={seed % 2 ? "stripes" : "checks"}
            shapeScale={0.1}
            speed={0.6}
            maxPixelCount={400 * 400}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/80 to-abyss/30" />
        </div>
      )}
      {children}
    </div>
  );
}
