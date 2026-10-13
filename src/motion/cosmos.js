const instances = new WeakMap();
export const getCosmos = (element) => instances.get(element);

const vertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`;
const fragment = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 resolution, pointer;
uniform float time, power, cities, ignition;
uniform vec3 planet;
const vec3 deep=vec3(.07059,0.,.11765);
const vec3 purple=vec3(.23529,.03529,.42353);
const vec3 lilac=vec3(.73333,.53333,.92157);
const vec3 pink=vec3(.91373,.11765,.47843);
float hash(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z);}
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);
}
float fbm(vec2 p){
  return noise(p)*.57+noise(p*2.03+7.)*.28+noise(p*4.11+13.)*.15;
}
float segment(vec2 p,vec2 a,vec2 b){
  vec2 v=b-a; return length(p-a-v*clamp(dot(p-a,v)/dot(v,v),0.,1.));
}
vec2 node(vec2 cell){return vec2(hash(cell),hash(cell+17.))*.64+.18;}
void main(){
  vec3 color=deep;
  vec2 sphereQ=(gl_FragCoord.xy-vec2(planet.x*resolution.x,(1.-planet.y)*resolution.y))/resolution.y+pointer*.006;
  float sphereDistance=length(sphereQ);
  // Opaque planet pixels skip the star and nebula work.
  if(planet.z<=0. || sphereDistance>planet.z-1./resolution.y){
  vec2 p=(gl_FragCoord.xy-.5*resolution)/resolution.y + pointer*.025;
  float t=time*.025;
  float n=noise(p*2.2+vec2(t,-t*.6));
  n+=.5*noise(p*4.4+vec2(-t*.4,t));
  n+=.25*noise(p*8.8);
  float cloud=smoothstep(.35,1.35,n)*exp(-dot(p,p)*.9);

  color+=vec3(.23529,.03529,.42353)*cloud*.55*power;
  color+=vec3(.12,.005,.065)*cloud*cloud*power;
  vec2 cell=floor((p+2.)*110.);
  vec2 local=fract((p+2.)*110.)-.5;
  float seed=hash(cell);
  float star=(1.-smoothstep(.018,.12,length(local)))*step(.975,seed);
  float twinkle=.8+.2*sin(time*.5+seed*80.);
  vec3 pink=mix(vec3(.9137,.1176,.4784),vec3(.9686,.1451,.5216),hash(cell+4.));
  vec3 lilac=mix(vec3(.7333,.5333,.9216),vec3(.8784,.7451,1.),hash(cell+5.));
  color+=mix(pink,lilac,step(.5,hash(cell+3.)))*star*twinkle*power;
  }
  if(planet.z>0.){
    // Orthographic rays intersect a sphere. Coordinates are measured in canvas heights.
    vec2 q=sphereQ;
    float r=planet.z, d=sphereDistance, pixel=1./resolution.y;
    float edge=1.-smoothstep(r-pixel,r+pixel,d);
    float halo=exp(-max(0.,d-r)/.008)*(1.-edge);
    color+=mix(lilac,pink,.32)*halo*(.045+.32*power);
    if(d<r+pixel){
      vec3 normal=vec3(q/r,sqrt(max(0.,1.-dot(q/r,q/r))));
      float angle=time*.009;
      vec3 surface=vec3(normal.x*cos(angle)+normal.z*sin(angle),normal.y,-normal.x*sin(angle)+normal.z*cos(angle));
      vec2 map=vec2(atan(surface.x,surface.z),asin(clamp(surface.y,-1.,1.)));
      float terrain=fbm(surface.xz*5.+surface.y*2.+vec2(2.,9.));
      float land=smoothstep(.44,.62,terrain+noise(surface.xy*2.)*.12);
      float bands=noise(surface.xz*12.+terrain);
      float sun=dot(normal,normalize(vec3(-.80,.25,-.65)));
      float daylight=smoothstep(-.15,.25,sun);
      vec3 ground=mix(vec3(.17255,.03922,.24314),purple,land);
      ground=mix(ground,lilac,land*bands*.22);
      vec3 globe=deep*.24+ground*(.025+power*(.10+.65*daylight));
      float rim=exp(-max(0.,r-d)/.016);
      globe+=mix(lilac,pink,smoothstep(-.7,.8,normal.x)) * rim * (.025+.40*power) * (.45+.55*daylight);
      // Jittered surface nodes with sparse connections; no repeating texture atlas.
      vec2 grid=map*vec2(25.,22.);
      vec2 cell=floor(grid), local=fract(grid), a=node(cell);
      float seed=hash(cell+41.);
      float point=exp(-dot(local-a,local-a)*450.);
      float links=0.;
      if(seed>.48){
        links=exp(-segment(local,a,vec2(1.,0.)+node(cell+vec2(1.,0.)))*120.)*.10;
        links+=exp(-segment(local,a,vec2(0.,1.)+node(cell+vec2(0.,1.)))*120.)*.07;
      }
      float distanceFromOrigin=length(surface-normalize(vec3(-.45,.65,.61)))*.5;
      float wave=smoothstep(min(.84,distanceFromOrigin*2.),min(.84,distanceFromOrigin*2.)+.16,ignition);
      float night=1.-smoothstep(-.18,.28,sun);
      vec3 cityColor=mix(vec3(.96863,.14510,.52157),vec3(.87843,.74510,1.),step(.82,seed));
      globe+=cityColor*(point*.95+links)*smoothstep(.38,.68,terrain)*night*cities*wave*smoothstep(.12,.30,normal.z);
      color=mix(color,globe,edge);
    }
  }
  // Sub-byte dither prevents visible gradient bands without sparkling.
  color+=(fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(.06711056,.00583715))))-.5)/255.;
  gl_FragColor=vec4(color,1.);
}`;

/** duration is milliseconds. No external dependencies; caller must destroy on removal. */
export function createCosmos(host, { on = true, dpr = 1.5, planet = false } = {}) {
  const config = planet ? { x: .5, y: 1.68, radius: 1, ...(typeof planet === 'object' ? planet : {}) } : null;
  const finite = (value, fallback) => Number.isFinite(value) ? value : fallback;
  const geometry = [0, 0, 0];
  if (config) host.dataset.planet = JSON.stringify(config);
  const canvas = host.querySelector('canvas');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let gl, program, buffer, frame = 0, visible = false, lost = false;
  let lit = reduced.matches ? 1 : Number(on), target = lit, start = lit;
  let cityLit = lit, cityStart = lit, ignition = lit;
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
      uniforms = Object.fromEntries(['resolution','pointer','time','power','planet','cities','ignition'].map(k => [k, gl.getUniformLocation(program,k)]));
      host.dataset.renderer = 'webgl';
    } catch { fallback(); }
  }
  function draw() {
    host.style.setProperty('--cosmos-power', String(lit));
    host.style.setProperty('--cosmos-cities', String(cityLit));
    if (host.dataset.renderer !== 'webgl' || lost) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform2f(uniforms.pointer, ...pointer);
    gl.uniform1f(uniforms.time, clock); gl.uniform1f(uniforms.power, lit);
    gl.uniform3f(uniforms.planet, ...geometry);
    gl.uniform1f(uniforms.cities, cityLit); gl.uniform1f(uniforms.ignition, ignition);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function resize() {
    const ratio = Math.min(devicePixelRatio || 1, Math.max(1, Math.min(2, finite(dpr, 1.5))));
    canvas.width = Math.max(1, Math.round(host.clientWidth * ratio));
    canvas.height = Math.max(1, Math.round(host.clientHeight * ratio));
    if (config) {
      const baseRadius = Math.max(.5, finite(config.radius, 1));
      const radius = Math.max(baseRadius, (canvas.width / canvas.height) ** 2 / 1.04 + .065);
      const top = finite(config.y, 1.68) - baseRadius;
      geometry.splice(0, 3, finite(config.x, .5), top + radius, radius);
      host.style.setProperty('--planet-x', `${geometry[0] * 100}%`);
      host.style.setProperty('--planet-y', `${geometry[1] * host.clientHeight}px`);
      host.style.setProperty('--planet-radius', `${radius * host.clientHeight}px`);
    }
    draw();
  }
  function tick(now) {
    frame = 0;
    const dt = last ? Math.min(now - last, 64) : 0; last = now;
    clock += dt / 1000; elapsed += dt;
    const progress = Math.min(1, elapsed / duration);
    lit = start + (target - start) * (progress * progress * (3 - 2 * progress));
    const cityProgress = Math.min(1, elapsed / (target ? 350 : duration * 1.35));
    cityLit = cityStart + (target - cityStart) * cityProgress * cityProgress * (3 - 2 * cityProgress);
    if (target) ignition = Math.min(1, ignition + dt / 1500);
    draw(); schedule();
  }
  function schedule() {
    if (!frame && visible && !document.hidden && !reduced.matches && ((host.dataset.renderer === 'webgl' && target > 0) || lit !== target || cityLit !== target)) frame = requestAnimationFrame(tick);
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
    if (reduced.matches) target = 1;
    lit = target; cityLit = target; cityStart = target; ignition = target; start = target; elapsed = duration * 1.35; draw(); schedule();
    host.dispatchEvent(new CustomEvent('cosmos:power', { detail: { on: Boolean(target) } }));
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
      target = Number(Boolean(on)); start = lit; cityStart = cityLit; elapsed = 0;
      if (target && cityLit < .01) ignition = 0;
      duration = Math.max(1, Number(options.duration) || 1600);
      if (reduced.matches || options.duration === 0) { lit = target; cityLit = target; ignition = target; start = target; elapsed = duration * 1.35; }
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
