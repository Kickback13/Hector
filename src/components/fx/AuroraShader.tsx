"use client";

/**
 * Hero aurora — adapted from 21st.dev @minhxthanh/animated-shader-background.
 * Re-colored to Town Made navy/sky (reads like light through moving water),
 * made mouse-reactive, alpha-blended, DPR-capped and paused when off screen.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AuroraShader({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    const size = () => {
      const r = el.getBoundingClientRect();
      renderer.setSize(r.width, r.height);
      mat.uniforms.iResolution.value.set(r.width, r.height);
    };
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(1, 1) },
        iMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `void main(){ gl_Position = vec4(position, 1.0); }`,
      fragmentShader: `
        uniform float iTime; uniform vec2 iResolution; uniform vec2 iMouse;
        float rand(vec2 n){ return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
        float noise(vec2 p){ vec2 ip=floor(p); vec2 u=fract(p); u=u*u*(3.0-2.0*u);
          float r=mix(mix(rand(ip),rand(ip+vec2(1,0)),u.x),mix(rand(ip+vec2(0,1)),rand(ip+vec2(1,1)),u.x),u.y); return r*r; }
        float fbm(vec2 x){ float v=0.0; float a=0.3; vec2 sh=vec2(100); mat2 rot=mat2(cos(.5),sin(.5),-sin(.5),cos(.5));
          for(int i=0;i<3;++i){ v+=a*noise(x); x=rot*x*2.0+sh; a*=0.4; } return v; }
        void main(){
          vec2 m = iMouse * 0.35;
          vec2 p = ((gl_FragCoord.xy) - iResolution.xy*0.5) / iResolution.y * mat2(6.0,-4.0,4.0,6.0);
          p += m * 2.0;
          vec2 v; vec4 o = vec4(0.0);
          float f = 2.0 + fbm(p + vec2(iTime*5.0, 0.0)) * 0.5;
          for(float i=0.0;i<32.0;i++){
            v = p + cos(i*i + (iTime + p.x*0.08)*0.025 + i*vec2(13.0,11.0)) * 3.5;
            float tail = fbm(v + vec2(iTime*0.5, i)) * 0.3 * (1.0 - (i/32.0));
            vec4 col = vec4(
              0.04 + 0.10*sin(i*0.2 + iTime*0.4),
              0.42 + 0.28*cos(i*0.3 + iTime*0.5),
              0.70 + 0.30*sin(i*0.4 + iTime*0.3),
              1.0);
            vec4 c = col * exp(sin(i*i + iTime*0.8)) / length(max(v, vec2(v.x*f*0.015, v.y*1.5)));
            o += c * (1.0 + tail*0.8) * smoothstep(0.0,1.0,i/32.0) * 0.6;
          }
          o = tanh(pow(o/100.0, vec4(1.6)));
          vec3 rgb = o.rgb * 1.5;
          float a = clamp(max(rgb.r, max(rgb.g, rgb.b)) * 1.4, 0.0, 1.0);
          gl_FragColor = vec4(rgb, a);
        }`,
    });
    const geo = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geo, mat));
    size();

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / innerWidth - 0.5) * 2;
      mouse.ty = -(e.clientY / innerHeight - 0.5) * 2;
    };
    addEventListener("pointermove", onMove);
    const ro = new ResizeObserver(size);
    ro.observe(el);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      mat.uniforms.iMouse.value.set(mouse.x, mouse.y);
      mat.uniforms.iTime.value += 0.016;
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      ro.disconnect();
      io.disconnect();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={ref} className={className} aria-hidden="true" />;
}
