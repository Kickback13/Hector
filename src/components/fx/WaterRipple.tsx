"use client";

/**
 * WaterRipple — 21st.dev @rahil1202/water-ripple-image WebGL shader, rebuilt to
 * fit any container (not full-screen), with a cursor "disturbance" that pushes
 * the water around where you hover. Paused when off screen.
 */
import { useEffect, useRef } from "react";

const VERT = `precision mediump float; varying vec2 vUv; attribute vec2 a_position;
void main(){ vUv = .5*(a_position+1.); gl_Position = vec4(a_position,0.,1.); }`;

const FRAG = `precision mediump float;
varying vec2 vUv;
uniform sampler2D u_tex; uniform float u_time; uniform float u_ratio; uniform float u_img_ratio;
uniform vec2 u_mouse; uniform float u_hover;
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;} vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}
float snoise(vec2 v){const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx); vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod289(i);
vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.); m=m*m; m=m*m;
vec3 x=2.*fract(p*C.www)-1.; vec3 h=abs(x)-.5; vec3 ox=floor(x+.5); vec3 a0=x-ox;
m*=1.79284291400159-.85373472095314*(a0*a0+h*h); vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw; return 130.*dot(m,g);}
mat2 rot(float r){return mat2(cos(r),sin(r),-sin(r),cos(r));}
float surf(vec2 uv,float t,float s){vec2 n=vec2(.1),N=vec2(.1); mat2 m=rot(.5);
for(int j=0;j<8;j++){uv*=m;n*=m;vec2 q=uv*s+float(j)+n+(.5+.5*float(j))*(mod(float(j),2.)-1.)*t;n+=sin(q);N+=cos(q)/s;s*=1.2;} return (N.x+N.y+.1);}
void main(){
  vec2 uv=vUv; uv.y=1.-uv.y; uv.x*=u_ratio; float t=.002*u_time*1000.;
  float on=snoise((.3+.1*sin(t))*uv+vec2(0.,.2*t));
  float s=surf(2.*uv+on*.2,t,7.); s*=pow(uv.y,.3); s=pow(s,2.);
  vec2 iuv=vUv-.5; if(u_ratio>u_img_ratio){iuv.y*=u_img_ratio/u_ratio;}else{iuv.x*=u_ratio/u_img_ratio;}
  iuv+=.5; iuv.y=1.-iuv.y;
  vec2 mp=u_mouse; float d=distance(vUv*vec2(u_ratio,1.),mp*vec2(u_ratio,1.));
  float ring=sin(d*40.-u_time*6.)*exp(-d*6.)*u_hover;
  iuv+= .02*on + .05*s*.6 + ring*.015;
  vec4 img=texture2D(u_tex,clamp(iuv,0.,1.));
  vec3 col=img.rgb*(1.+.12*s)+.12*vec3(.35,1.,1.)*s + vec3(.13,.65,.85)*max(ring,0.)*.25;
  gl_FragColor=vec4(col,1.);
}`;

export default function WaterRipple({ src, className = "", alt }: { src: string; className?: string; alt: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cvs.current!;
    const gl = canvas.getContext("webgl", { antialias: true });
    if (!gl) return;
    const sh = (src: string, type: number) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(VERT, gl.VERTEX_SHADER));
    gl.attachShader(prog, sh(FRAG, gl.FRAGMENT_SHADER));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uTime = U("u_time"),
      uRatio = U("u_ratio"),
      uImg = U("u_img_ratio"),
      uMouse = U("u_mouse"),
      uHover = U("u_hover");

    let imgRatio = 1;
    const img = new Image();
    img.onload = () => {
      imgRatio = img.naturalWidth / img.naturalHeight;
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.uniform1f(uImg, imgRatio);
    };
    img.src = src;

    const resize = () => {
      const r = wrap.current!.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio, 1.5);
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uRatio, r.width / r.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap.current!);

    const m = { x: 0.5, y: 0.5, h: 0, th: 0 };
    const move = (e: PointerEvent) => {
      const r = wrap.current!.getBoundingClientRect();
      m.x = (e.clientX - r.left) / r.width;
      m.y = 1 - (e.clientY - r.top) / r.height;
      m.th = 1;
    };
    const out = () => (m.th = 0);
    const el = wrap.current!;
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", out);

    let vis = true;
    const io = new IntersectionObserver(([e]) => (vis = e.isIntersecting));
    io.observe(el);
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!vis) return;
      m.h += (m.th - m.h) * 0.06;
      gl.uniform1f(uTime, performance.now() / 1000);
      gl.uniform2f(uMouse, m.x, m.y);
      gl.uniform1f(uHover, m.h);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", out);
    };
  }, [src]);

  return (
    <div ref={wrap} className={className} role="img" aria-label={alt}>
      <canvas ref={cvs} className="h-full w-full" />
    </div>
  );
}
