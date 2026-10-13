const instances = new WeakMap();
export const getCosmos = (element) => instances.get(element);

const vertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`;
const fragment = `
precision mediump float;
uniform vec2 resolution, pointer;
uniform float time, power;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);
}
void main(){
  vec2 uv=gl_FragCoord.xy/resolution;
  vec2 p=(gl_FragCoord.xy-.5*resolution)/resolution.y + pointer*.025;
  float t=time*.025;
  float n=noise(p*2.2+vec2(t,-t*.6));
  n+=.5*noise(p*4.4+vec2(-t*.4,t));
  n+=.25*noise(p*8.8);
  float cloud=smoothstep(.35,1.35,n)*exp(-dot(p,p)*.9);
  vec3 color=vec3(.07059,0.,.11765);
  color+=vec3(.23529,.03529,.42353)*cloud*.9*power;
  color+=vec3(.12,.005,.065)*cloud*cloud*power;
  vec2 cell=floor((p+2.)*110.);
  vec2 local=fract((p+2.)*110.)-.5;
  float seed=hash(cell);
  float star=(1.-smoothstep(.018,.12,length(local)))*step(.975,seed);
  float twinkle=.8+.2*sin(time*.5+seed*80.);
  vec3 pink=mix(vec3(.9137,.1176,.4784),vec3(.9686,.1451,.5216),hash(cell+4.));
  vec3 lilac=mix(vec3(.7333,.5333,.9216),vec3(.8784,.7451,1.),hash(cell+5.));
  color+=mix(pink,lilac,step(.5,hash(cell+3.)))*star*twinkle*power;
  gl_FragColor=vec4(color,1.);
}`;

/** duration is milliseconds. No external dependencies; caller must destroy on removal. */
export function createCosmos(host, { on = true, dpr = 1.5 } = {}) {
  const canvas = host.querySelector('canvas');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let gl, program, buffer, frame = 0, visible = false, lost = false;
  let lit = reduced.matches ? 1 : Number(on), target = lit, start = lit;
  let elapsed = 0, duration = 1600, clock = 0, last = 0;
  const pointer = [0, 0];
  const pointerSurface = host.parentElement || host;
  let uniforms;
  const fallback = () => { host.dataset.renderer = 'css'; };
  function initialize() {
    try {
      gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' })
        || canvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'low-power' });
      if (!gl) return fallback();
      const v2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
      const compile = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source); gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); throw Error('Shader compilation failed'); }
        return shader;
      };
      const vs = v2 ? '#version 300 es\n' + vertex.replace('attribute', 'in') : vertex;
      const fs = v2 ? '#version 300 es\n' + fragment.replace('uniform vec2', 'out vec4 outputColor;\nuniform vec2').replace('gl_FragColor', 'outputColor') : fragment;
      const shaders = [compile(gl.VERTEX_SHADER, vs), compile(gl.FRAGMENT_SHADER, fs)];
      program = gl.createProgram(); shaders.forEach(s => gl.attachShader(program, s));
      gl.linkProgram(program); shaders.forEach(s => gl.deleteShader(s));
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error('Shader link failed');
      gl.useProgram(program);
      buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      uniforms = Object.fromEntries(['resolution','pointer','time','power'].map(k => [k, gl.getUniformLocation(program,k)]));
      host.dataset.renderer = 'webgl';
    } catch { fallback(); }
  }
  function draw() {
    host.style.setProperty('--cosmos-power', String(lit));
    if (host.dataset.renderer !== 'webgl' || lost) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform2f(uniforms.pointer, ...pointer);
    gl.uniform1f(uniforms.time, clock); gl.uniform1f(uniforms.power, lit);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function resize() {
    const ratio = Math.min(devicePixelRatio || 1, Math.max(1, Math.min(2, dpr)));
    canvas.width = Math.max(1, Math.round(host.clientWidth * ratio));
    canvas.height = Math.max(1, Math.round(host.clientHeight * ratio));
    draw();
  }
  function tick(now) {
    frame = 0;
    const dt = last ? Math.min(now - last, 64) : 0; last = now;
    clock += dt / 1000; elapsed += dt;
    const progress = Math.min(1, elapsed / duration);
    lit = start + (target - start) * (progress * progress * (3 - 2 * progress));
    draw(); schedule();
  }
  function schedule() {
    if (!frame && visible && !document.hidden && !reduced.matches && ((host.dataset.renderer === 'webgl' && target > 0) || lit !== target)) frame = requestAnimationFrame(tick);
  }
  function pause() { cancelAnimationFrame(frame); frame = 0; last = 0; }
  function visibility() { pause(); schedule(); }
  function move(event) {
    if (reduced.matches) return;
    const bounds = host.getBoundingClientRect();
    pointer[0] = (event.clientX - bounds.left) / bounds.width - .5;
    pointer[1] = .5 - (event.clientY - bounds.top) / bounds.height;
  }
  function preference() {
    pause(); pointer.fill(0);
    lit = target; start = target; elapsed = duration; draw(); schedule();
  }
  function contextLost(event) { event.preventDefault(); lost = true; pause(); fallback(); draw(); schedule(); }
  initialize();
  const resizer = new ResizeObserver(resize); resizer.observe(host); resize();
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visibility(); }); observer.observe(host);
  document.addEventListener('visibilitychange', visibility);
  pointerSurface.addEventListener('pointermove', move, { passive: true });
  canvas.addEventListener('webglcontextlost', contextLost);
  reduced.addEventListener('change', preference);
  const api = {
    get on() { return Boolean(target); },
    setPower(on, options = {}) {
      target = Number(Boolean(on)); start = lit; elapsed = 0;
      duration = Math.max(1, Number(options.duration) || 1600);
      if (reduced.matches || options.duration === 0) { lit = target; start = target; elapsed = duration; }
      draw(); schedule();
      host.dispatchEvent(new CustomEvent('cosmos:power', { detail: { on: Boolean(target) } }));
    },
    destroy() {
      pause(); observer.disconnect(); resizer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      pointerSurface.removeEventListener('pointermove', move); reduced.removeEventListener('change', preference);
      canvas.removeEventListener('webglcontextlost', contextLost);
      if (gl) { gl.deleteBuffer(buffer); gl.deleteProgram(program); }
      instances.delete(host);
    }
  };
  instances.set(host, api); return api;
}
