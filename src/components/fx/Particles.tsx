"use client";

/**
 * Particle effects adapted from 21st.dev:
 *  - DottedSurface ← @sshahaider/dotted-surface (three.js wave field of points),
 *                    now cursor-reactive: the surface bulges where you point.
 *  - VaporText     ← @jatin-yadav05/vapour-text-effect (text vaporizes into particles
 *                    and re-forms), simplified and re-colored brand sky/white.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";

export function DottedSurface({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const SEP = 120,
      AX = 46,
      AY = 46;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x04141d, 1800, 6000);
    const camera = new THREE.PerspectiveCamera(60, 1, 1, 10000);
    camera.position.set(0, 380, 1250);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    const pos: number[] = [];
    const col: number[] = [];
    const sky = new THREE.Color("#22a6d9");
    const white = new THREE.Color("#cfefff");
    for (let ix = 0; ix < AX; ix++)
      for (let iy = 0; iy < AY; iy++) {
        pos.push(ix * SEP - (AX * SEP) / 2, 0, iy * SEP - (AY * SEP) / 2);
        const c = sky.clone().lerp(white, Math.random() * 0.4);
        col.push(c.r, c.g, c.b);
      }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: 7, vertexColors: true, transparent: true, opacity: 0.85, sizeAttenuation: true });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    const size = () => {
      const r = el.getBoundingClientRect();
      renderer.setSize(r.width, r.height);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(el);

    const m = { x: 9999, z: 9999, tx: 9999, tz: 9999 };
    const ray = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hit = new THREE.Vector3();
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(plane, hit)) {
        m.tx = hit.x;
        m.tz = hit.z;
      }
    };
    el.addEventListener("pointermove", move);

    let vis = true;
    const io = new IntersectionObserver(([e]) => (vis = e.isIntersecting));
    io.observe(el);
    let count = 0,
      raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!vis) return;
      m.x += (m.tx - m.x) * 0.08;
      m.z += (m.tz - m.z) * 0.08;
      const a = geo.attributes.position.array as Float32Array;
      let i = 0;
      for (let ix = 0; ix < AX; ix++)
        for (let iy = 0; iy < AY; iy++) {
          const x = a[i * 3],
            z = a[i * 3 + 2];
          const d = Math.hypot(x - m.x, z - m.z);
          const bump = Math.max(0, 1 - d / 650) ** 2 * 220;
          a[i * 3 + 1] = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50 + bump;
          i++;
        }
      geo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.06;
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", move);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={ref} className={className} aria-hidden="true" />;
}

type P = { x: number; y: number; ox: number; oy: number; vx: number; vy: number; a: number; c: string };

export function VaporText({
  words,
  className = "",
  fontSize = 120,
}: {
  words: string[];
  className?: string;
  fontSize?: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cvs.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let W = 0,
      H = 0,
      fs = fontSize;
    let parts: P[] = [];
    let idx = 0;
    let phase: "in" | "hold" | "out" = "in";
    let t0 = performance.now();
    let sweep = 0;

    const build = (text: string) => {
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d")!;
      o.fillStyle = "#fff";
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.font = `700 ${fs * dpr}px "Jost Variable", Jost, sans-serif`;
      o.fillText(text, W / 2, H / 2);
      const d = o.getImageData(0, 0, W, H).data;
      const step = Math.max(2, Math.round(2 * dpr));
      const out: P[] = [];
      for (let y = 0; y < H; y += step)
        for (let x = 0; x < W; x += step) {
          if (d[(y * W + x) * 4 + 3] > 128) {
            const c = Math.random() < 0.18 ? "#22a6d9" : "#ffffff";
            out.push({ x, y, ox: x, oy: y, vx: 0, vy: 0, a: 0, c });
          }
        }
      return out;
    };

    const resize = () => {
      const r = wrap.current!.getBoundingClientRect();
      fs = Math.min(fontSize, r.width / 5.2);
      W = canvas.width = Math.round(r.width * dpr);
      H = canvas.height = Math.round(Math.max(fs * 1.6, 120) * dpr);
      canvas.style.height = H / dpr + "px";
      parts = build(words[idx]);
      phase = "in";
      t0 = performance.now();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap.current!);

    let vis = true;
    const io = new IntersectionObserver(([e]) => (vis = e.isIntersecting));
    io.observe(wrap.current!);

    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!vis) return;
      const el = now - t0;
      ctx.clearRect(0, 0, W, H);
      if (phase === "in") {
        for (const p of parts) p.a = Math.min(1, el / 700);
        if (el > 700) {
          phase = "hold";
          t0 = now;
        }
      } else if (phase === "hold") {
        if (el > 1400) {
          phase = "out";
          t0 = now;
          sweep = 0;
        }
      } else {
        sweep = (el / 1600) * (W * 1.2);
        for (const p of parts) {
          if (p.ox < sweep) {
            if (p.vx === 0 && p.vy === 0) {
              const ang = (Math.random() - 0.5) * Math.PI * 0.9 - Math.PI / 2;
              const s = 0.6 + Math.random() * 2.4;
              p.vx = Math.cos(ang) * s + 0.8;
              p.vy = Math.sin(ang) * s;
            }
            p.x += p.vx * dpr;
            p.y += p.vy * dpr;
            p.vy -= 0.01;
            p.a -= 0.012;
          }
        }
        if (el > 2400) {
          idx = (idx + 1) % words.length;
          parts = build(words[idx]);
          phase = "in";
          t0 = now;
        }
      }
      for (const p of parts) {
        if (p.a <= 0) continue;
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, 1.6 * dpr, 1.6 * dpr);
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [words, fontSize]);

  return (
    <div ref={wrap} className={className}>
      <span className="sr-only">{words.join(" ")}</span>
      <canvas ref={cvs} className="block w-full" aria-hidden="true" />
    </div>
  );
}
