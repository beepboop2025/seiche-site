import{r as c,j as U}from"./index-Bq8GuDi8.js";const C=`
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`,P=`
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_stress;   // 0..1 (composite / 100)
uniform float u_warm;     // 0..1 regime warmth (CALM 0 -> STRESS 1)
uniform vec2 u_mouse;     // pointer in uv space (y up), lerped in JS
uniform float u_hand;     // pointer presence 0..1 (fades out when idle)
uniform vec3 u_click;     // click x, y, seconds since click (999 = none)

float hash(vec2 q) { return fract(sin(dot(q, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 q) {
  vec2 i = floor(q), f = fract(q);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

float fbm(vec2 q) {
  float v = 0.0, a = 0.5;
  for (int k = 0; k < 4; k++) { v += a * noise(q); q *= 2.03; a *= 0.5; }
  return v;
}

// one layer of marine snow: sparse points drifting down-current, twinkling
float snow(vec2 q, float scale, float t, float speed) {
  vec2 g = q * scale + vec2(t * speed, t * speed * 0.55);
  vec2 cell = floor(g);
  vec2 pos = fract(g) - (vec2(hash(cell), hash(cell + 7.7)) * 0.8 + 0.1);
  float d = length(pos);
  float tw = 0.6 + 0.4 * sin(t * (1.5 + hash(cell) * 3.0) + hash(cell) * 40.0);
  return smoothstep(0.06, 0.0, d) * tw * step(0.72, hash(cell + 3.3));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 q = vec2(uv.x * aspect, uv.y);
  vec2 m = vec2(u_mouse.x * aspect, u_mouse.y);

  // stress shortens the wavelength and speeds the water up
  float speed = 0.018 + 0.10 * u_stress;
  float scale = 2.2 + 3.4 * u_stress;
  vec2 drift = vec2(u_time * speed, u_time * speed * 0.35);

  // domain-warped fbm: the warp grows with stress = choppier surface
  vec2 warp = vec2(fbm(q * scale + drift), fbm(q * scale - drift.yx));
  float h = fbm(q * scale + warp * (0.9 + 1.8 * u_stress) + drift);

  // depth: darker toward the floor of the page
  float depth = mix(1.0, 0.45, uv.y * -1.0 + 1.0);

  // abyss water: near-black ground; crests glow indigo, warming with regime
  vec3 deep_water = vec3(0.0, 0.004, 0.012);
  vec3 indigo     = vec3(0.27, 0.24, 0.45);
  vec3 warm       = vec3(0.50, 0.27, 0.24);
  vec3 crest = mix(indigo, warm, u_warm);

  float band = smoothstep(0.42, 0.78, h);
  vec3 col = mix(deep_water, crest, band * (0.10 + 0.20 * u_stress)) * depth;

  // marine snow: two parallax layers, drift rate rises with stress
  float snowspeed = 0.010 + 0.06 * u_stress;
  col += crest * snow(q, 22.0, u_time, snowspeed) * 0.10;
  col += crest * snow(q + 4.7, 44.0, u_time, snowspeed * 1.8) * 0.05;

  // bioluminescence at the hand: a soft bloom that also lifts the local
  // wave detail, as if the water lights where it is disturbed
  float md = length(q - m);
  float glow = exp(-md * 5.5) * u_hand;
  col += crest * glow * (0.16 + 0.35 * band);

  // click ripple: one ring travelling out from the last touch
  float ct = u_click.z;
  if (ct < 3.0) {
    float cd = length(q - vec2(u_click.x * aspect, u_click.y));
    float r = ct * 0.55;
    float ring = smoothstep(0.045, 0.0, abs(cd - r)) * (1.0 - ct / 3.0);
    col += crest * ring * 0.35;
  }

  gl_FragColor = vec4(col, 1.0);
}
`,H={CALM:0,EROSION:.35,STRAIN:.7,STRESS:1};function B({value:y,regime:b}){const h=c.useRef(null),A=c.useRef({stress:.2,warm:0,mx:.5,my:.5,hand:0}),n=c.useRef({stress:.2,warm:0,mx:.5,my:.5,hand:0});return n.current={...n.current,stress:Math.min(1,Math.max(0,(y??20)/100)),warm:H[b??"CALM"]??0},c.useEffect(()=>{const i=h.current;if(!i)return;const e=i.getContext("webgl",{alpha:!1,antialias:!1,powerPreference:"low-power"});if(!e)return;const w=(t,a)=>{const d=e.createShader(t);return e.shaderSource(d,a),e.compileShader(d),d},r=e.createProgram();if(e.attachShader(r,w(e.VERTEX_SHADER,C)),e.attachShader(r,w(e.FRAGMENT_SHADER,P)),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))return;e.useProgram(r);const E=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,E),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);const v=e.getAttribLocation(r,"p");e.enableVertexAttribArray(v),e.vertexAttribPointer(v,2,e.FLOAT,!1,0,0);const R=e.getUniformLocation(r,"u_res"),L=e.getUniformLocation(r,"u_time"),S=e.getUniformLocation(r,"u_stress"),q=e.getUniformLocation(r,"u_warm"),T=e.getUniformLocation(r,"u_mouse"),k=e.getUniformLocation(r,"u_hand"),F=e.getUniformLocation(r,"u_click"),m=()=>{const t=Math.max(1,Math.floor(window.innerWidth*.5)),a=Math.max(1,Math.floor(window.innerHeight*.5));i.width=t,i.height=a,e.viewport(0,0,t,a),e.uniform2f(R,t,a)};m(),window.addEventListener("resize",m);let l;const p=t=>{n.current.mx=t.clientX/window.innerWidth,n.current.my=1-t.clientY/window.innerHeight,n.current.hand=1,clearTimeout(l),l=setTimeout(()=>{n.current.hand=0},2600)},o={x:.5,y:.5,at:-999},g=t=>{o.x=t.clientX/window.innerWidth,o.y=1-t.clientY/window.innerHeight,o.at=performance.now()};window.addEventListener("pointermove",p,{passive:!0}),window.addEventListener("pointerdown",g,{passive:!0});const _=window.matchMedia("(prefers-reduced-motion: reduce)");let s=0,u=!0;const M=performance.now(),f=()=>{const t=A.current;t.stress+=(n.current.stress-t.stress)*.02,t.warm+=(n.current.warm-t.warm)*.02,t.mx+=(n.current.mx-t.mx)*.08,t.my+=(n.current.my-t.my)*.08,t.hand+=(n.current.hand-t.hand)*.04,e.uniform1f(L,(performance.now()-M)/1e3),e.uniform1f(S,t.stress),e.uniform1f(q,t.warm),e.uniform2f(T,t.mx,t.my),e.uniform1f(k,t.hand),e.uniform3f(F,o.x,o.y,(performance.now()-o.at)/1e3),e.drawArrays(e.TRIANGLES,0,3),u&&!_.matches&&(s=requestAnimationFrame(f))},x=()=>{u=document.visibilityState==="visible",u&&!_.matches&&(cancelAnimationFrame(s),s=requestAnimationFrame(f))};return document.addEventListener("visibilitychange",x),s=requestAnimationFrame(f),()=>{var t;cancelAnimationFrame(s),clearTimeout(l),window.removeEventListener("resize",m),window.removeEventListener("pointermove",p),window.removeEventListener("pointerdown",g),document.removeEventListener("visibilitychange",x),(t=e.getExtension("WEBGL_lose_context"))==null||t.loseContext()}},[]),U.jsx("canvas",{ref:h,className:"basin-field","aria-hidden":"true"})}export{B as default};
