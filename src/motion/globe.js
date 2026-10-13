import { onPage } from './lifecycle.js';

// Both posters and canvas use this orthographic scene. No runtime dependencies.
const TAU = Math.PI * 2;
const round = n => Math.round(n * 10) / 10;
const seedFor = key => [...key].reduce((s, c) => (Math.imul(s, 31) + c.charCodeAt(0)) >>> 0, 7);
const normalize = v => { const d = Math.hypot(...v); return v.map(n => n / d); };
const sphere = (lat, lon) => [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
export function createGlobe(key = 'web', small = false) {
  const seed = seedFor(key), count = small ? 180 : key === 'wordpress' ? 760 : 620;
  const dots = Array.from({ length: count }, (_, i) => {
    const y = 1 - 2 * (i + .5) / count, a = i * 2.3999632297 + seed % 60;
    const r = Math.sqrt(1 - y * y);
    return [r * Math.cos(a), y, r * Math.sin(a)];
  });
  let nodes = Array.from({ length: key === 'web' || key === 'ai' ? 12 : ['support','company','knowledge','legal','backups'].includes(key) ? 3 : 6 }, (_, i) => sphere(.65 * Math.sin(i * 2.1 + seed), -.9 + i * .37));
  if (key === 'datacenter') nodes = Array.from({ length: 13 }, (_, i) => sphere(50.08*Math.PI/180 + .06 * Math.sin(i * 2.4), 14.43*Math.PI/180 + .08 * Math.cos(i * 2.4)));
  if (key === 'reseller') nodes = Array.from({ length: 12 }, (_, i) => sphere((Math.floor(i / 4) - 1) * .48 + .06 * Math.sin(i * 2), -.6 + .15 * (i % 4)));
  if (small) nodes = [sphere(.4, -.4)];
  return { key, small, dots, nodes, tracks: small ? 0 : key === 'mail' ? 2 : ['wordpress','game','colo'].includes(key) ? 1 : 0 };
}

export function drawGlobe(p, model, time = 0, power = 1) {
  const { key, small, dots, nodes } = model, angle = time * TAU / 90;
  const c = Math.cos(angle), s = Math.sin(angle), R = 139;
  const project = ([x, y, z]) => { const a = x*c+z*s, b = z*c-x*s; return [210+a*R,210-y*R,b,a,y]; };
  const line = (a,b,color='#BB88EB',alpha=.18,width=.65) => p.line(a,b,color,alpha,width);
  const path = (points,color,alpha,width=.65,dash=false) => {
    for(let i=1;i<points.length;i++)if(points[i-1][2]>=0&&points[i][2]>=0&&(!dash||i%3)) line(points[i-1],points[i],color,alpha,width);
  };
  const latitude = (lat, color='#BB88EB',alpha=.16,dash=false) => path(Array.from({length:33},(_,i)=>project(sphere(lat,i*TAU/32))),color,alpha,.65,dash);
  const meridian = (lon,alpha=.16,dash=false) => path(Array.from({length:25},(_,i)=>project(sphere(-Math.PI/2+i*Math.PI/24,lon))), '#BB88EB',alpha,.65,dash);
  const orbit = (track, front) => {
    const tilt = track ? -.55 : .35;
    const coord = a => { const x=Math.cos(a)*176,y=Math.sin(a)*48;return [210+x*Math.cos(tilt)-y*Math.sin(tilt),210+x*Math.sin(tilt)+y*Math.cos(tilt),Math.sin(a)]; };
    for(let i=0;i<64;i++)if(i%3!==2 && (Math.sin((i+.5)*TAU/64)>=0)===front)line(coord(i*TAU/64),coord((i+1)*TAU/64),'#BB88EB',front?.28:.12,.7);
    const a=time*(key==='game'?1.7:.24)+track*2.8, q=coord(a);
    if((q[2]>=0)===front)p.square(q[0],q[1],3,'#F72585',front?.9:.25);
  };
  if(key==='backups'&&!small){p.circle(190,191,R,'#BB88EB',.025);p.rim(190,191,R,'#BB88EB',.13);}
  for(let i=0;i<model.tracks;i++)orbit(i,false);
  p.body(210,210,R);
  // A restrained rim on the illuminated limb; no highlight or glow blob.
  p.arc(210,210,R,Math.PI*.94,Math.PI*1.73,'#E0BEFF',.45,.75);
  if(!small) {
    if(['managed','vps','domains','developer','knowledge','legal','company'].includes(key)) {
      for(const lat of [-.6,0,.6])latitude(lat,'#BB88EB',key==='vps'?.26:.13);
      for(let i=0;i<6;i++)meridian(i*Math.PI/3,key==='vps'?.27:.13,key==='developer');
    }
    if(['dedicated','colo','database'].includes(key))for(const lat of [-.4,-.2,0,.2,.4])latitude(lat,'#E0BEFF',key==='database'?.3:.23);
    if(key==='monitoring')latitude(Math.sin(time*.7)*1.15,'#F72585',.4);
    if(key==='database')for(const y of [-20,0,20]){
      const disk=Array.from({length:33},(_,i)=>{const a=i*TAU/32;return [210+154*Math.cos(a),210+y+35*Math.sin(a),Math.sin(a)];});
      path(disk,'#BB88EB',.28,.65);
    }
    if(key==='ssl')for(const r of [149,156])p.rim(210,210,r,'#BB88EB',.22);
  }
  // Bucketed paths avoid hundreds of canvas fill/style changes per frame.
  dots.forEach((v,i)=>{
    const q=project(v);if(q[2]<0)return;
    const light=Math.max(0,-q[3]*.65+q[4]*.55+q[2]*.35);
    const threshold=(1+q[3]-q[4])*.43;
    let alpha = power < threshold ? .025 : [.055,.16,.34,.60,.85][Math.min(4,Math.floor(light*5))];
    if(key==='builder'&&power===1)alpha*= .45+.55*(.5+.5*Math.sin(time*.6+Math.floor(i/24)));
    if(key==='vps'&&q[3]<-.15&&q[4]>.1)alpha=Math.min(1,alpha*1.5);
    if(['dedicated','colo'].includes(key)&&Math.abs(v[1]*10-Math.round(v[1]*10))<.09)alpha*=1.5;
    p.dot(q[0],q[1],small?1.55:1.05,'#E0BEFF',Math.min(1,alpha));
  });
  if(!small&&power>.95){
    const pairs=[];
    for(let i=1;i<nodes.length;i++)pairs.push([i-1,i]);
    if(key==='ai')for(let i=0;i<nodes.length;i++)for(let j=i+2;j<nodes.length;j++)if(Math.hypot(...nodes[i].map((v,k)=>v-nodes[j][k]))<1.1)pairs.push([i,j]);
    if(['web','game','ai','reseller','domains','datacenter','mail'].includes(key))for(const [a,b] of pairs){
      // Normalized spherical interpolation follows the great circle.
      const route=Array.from({length:13},(_,i)=>project(normalize(nodes[a].map((v,k)=>v*(1-i/12)+nodes[b][k]*i/12))));
      path(route,'#BB88EB',.35,.65);
      const t=(time*(key==='game'?.8:.18)+a*.17)%1,q=project(normalize(nodes[a].map((v,k)=>v*(1-t)+nodes[b][k]*t)));
      if(q[2]>0)p.dot(q[0],q[1],1.5,'#F72585',.9);
    }
  }
  nodes.forEach((v,i)=>{const q=project(v);if(q[2]<0||power<.95)return;
    p.dot(q[0],q[1],small?2.8:2.1,'#F72585',key==='managed'?.9:.65+.25*Math.sin(time*1.4+i));
    if(!small)p.rim(q[0],q[1],4.5,'#E91E7A',.26);
  });
  if(!small&&['ddos','email-security'].includes(key)){
    // Faceted shell with deflected packets, confined to a thin protective cage.
    for(let row=-2;row<=2;row++)for(let col=-2;col<=2;col++){
      const x=210+col*54+(row%2)*27,y=210+row*47;
      if(Math.hypot(x-210,y-210)>130)continue;
      for(let i=0;i<6;i++)line([x+31*Math.cos(i*TAU/6),y+31*Math.sin(i*TAU/6)],[x+31*Math.cos((i+1)*TAU/6),y+31*Math.sin((i+1)*TAU/6)],'#BB88EB',.12);
    }
    p.rim(210,210,151,'#BB88EB',.24);
    for(let i=0;i<3;i++){const a=i*2.1+.2,d=153+20*Math.abs(Math.sin(time*.8+i));p.square(210+Math.cos(a)*d,210+Math.sin(a)*d,3,'#F72585',.7);}
  }
  if(!small&&key==='colo')for(let i=0;i<3;i++){const a=i*2.1+.3,x=210+Math.cos(a)*160,y=210+Math.sin(a)*160;line([x,y],[210+Math.cos(a)*140,210+Math.sin(a)*140],'#BB88EB',.3);p.square(x,y,6,'#BB88EB',.55);}
  for(let i=0;i<model.tracks;i++)orbit(i,true);
}

export function globeSnapshot(key, small=false) {
  const groups=new Map(), ends=new Map(), r=round;
  const add=(d,color,alpha,width=0)=>{const k=`${color}|${r(alpha)}|${width}`;groups.set(k,(groups.get(k)||'')+d);};
  let body='';
  const emit=()=>{body += [...groups].map(([k,d])=>{const [color,alpha,width]=k.split('|');return `<path d="${d}" ${+width?`fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"`:`fill="${color}"`} opacity="${alpha}"/>`;}).join('');groups.clear();ends.clear();};
  const p={
    body(x,y,radius){emit();body+=`<circle cx="${x}" cy="${y}" r="${radius}" fill="url(#globe-matte)"/>`;},
    circle(x,y,radius,color,alpha){add(`M${r(x-radius)} ${r(y)}a${radius} ${radius} 0 1 0 ${radius*2} 0a${radius} ${radius} 0 1 0 -${radius*2} 0`,color,alpha);},
    dot(x,y,radius,color,alpha){add(`M${r(x)} ${r(y)}h.1`,color,alpha,radius*2);},
    line(a,b,color,alpha,width){const k=`${color}|${r(alpha)}|${width}`,start=`${r(a[0])} ${r(a[1])}`,end=`${r(b[0])} ${r(b[1])}`;add(`${ends.get(k)===start?'':`M${start}`}L${end}`,color,alpha,width);ends.set(k,end);},
    square(x,y,size,color,alpha){add(`M${r(x-size/2)} ${r(y-size/2)}h${size}v${size}h-${size}z`,color,alpha);},
    rim(x,y,radius,color,alpha){this.arc(x,y,radius,0,TAU-.001,color,alpha,.7);},
    arc(x,y,radius,a,b,color,alpha,width){const q=[x+radius*Math.cos(a),y+radius*Math.sin(a)],z=[x+radius*Math.cos(b),y+radius*Math.sin(b)];add(`M${r(q[0])} ${r(q[1])}A${radius} ${radius} 0 ${b-a>Math.PI?1:0} 1 ${r(z[0])} ${r(z[1])}`,color,alpha,width);}
  };
  // Quantized lighting and joined paths keep the same geometry below 10 KB.
  drawGlobe(p,createGlobe(key,small));
  emit();
  return `<svg viewBox="0 0 420 420" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="globe-matte" x1="0" y1="0" x2="1" y2=".8"><stop stop-color="#2C0A3E"/><stop offset="1" stop-color="#12001E"/></linearGradient></defs>${body}</svg>`;
}

function canvasPainter(ctx,scale) {
  const groups=new Map();
  const add=(color,alpha,width,fn)=>{const k=`${color}|${Math.round(alpha*10)}|${width}`;let g=groups.get(k);if(!g){g={path:new Path2D(),color,alpha:Math.round(alpha*10)/10,width};groups.set(k,g);}fn(g.path);};
  const p={
    body(x,y,r){this.flush();const g=ctx.createLinearGradient(90,70,335,310);g.addColorStop(0,'#2C0A3E');g.addColorStop(1,'#12001E');ctx.globalAlpha=1;ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();},
    circle(x,y,r,c,a){add(c,a,0,q=>{q.moveTo(x+r,y);q.arc(x,y,r,0,TAU);});},
    dot(x,y,r,c,a){this.circle(x,y,r,c,a);},
    line(a,b,c,alpha,w){add(c,alpha,w,q=>{q.moveTo(a[0],a[1]);q.lineTo(b[0],b[1]);});},
    square(x,y,s,c,a){add(c,a,0,q=>q.rect(x-s/2,y-s/2,s,s));},
    rim(x,y,r,c,a){this.arc(x,y,r,0,TAU,c,a,.7);},
    arc(x,y,r,a,b,c,alpha,w){add(c,alpha,w,q=>{q.moveTo(x+r*Math.cos(a),y+r*Math.sin(a));q.arc(x,y,r,a,b);});},
    flush(){for(const g of groups.values()){ctx.globalAlpha=g.alpha;if(g.width){ctx.strokeStyle=g.color;ctx.lineWidth=g.width;ctx.stroke(g.path);}else{ctx.fillStyle=g.color;ctx.fill(g.path);}}groups.clear();}
  };
  ctx.setTransform(scale,0,0,scale,0,0);return p;
}

export function mountGlobes() {
  const reduce=matchMedia('(prefers-reduced-motion: reduce)'), states=[];
  let raf=0,last=0;
  const resize=new ResizeObserver(entries=>{for(const entry of entries){const state=states.find(s=>s.canvas===entry.target);if(!state)continue;const size=Math.max(1,entry.contentRect.width),dpr=Math.min(2,devicePixelRatio||1);state.canvas.width=state.canvas.height=Math.round(size*dpr);state.scale=state.canvas.width/420;if(state.model.small!==(size<120))state.model=createGlobe(state.model.key,size<120);state.dirty=true;}wake();});
  document.querySelectorAll('[data-globe-canvas]').forEach(canvas=>{
    const ctx=canvas.getContext('2d');if(!ctx)return;
    const state={canvas,ctx,model:createGlobe(canvas.dataset.globeCanvas,canvas.clientWidth<120),visible:false,elapsed:0,power:canvas.dataset.power==='true',age:0,dirty:true,scale:1};
    states.push(state);resize.observe(canvas);
  });
  function frame(now){
    raf=0;const dt=last?Math.min((now-last)/1000,.05):0;last=now;
    for(const state of states){if(!state.visible||document.hidden||reduce.matches&&!state.dirty)continue;
      if(!reduce.matches){state.elapsed+=dt;state.age+=dt;}
      const start=performance.now();state.ctx.setTransform(1,0,0,1,0,0);state.ctx.clearRect(0,0,state.canvas.width,state.canvas.height);
      const p=canvasPainter(state.ctx,state.scale);drawGlobe(p,state.model,reduce.matches?0:state.elapsed,state.power&&!reduce.matches?Math.min(1,state.age/1.6):1);p.flush();
      // Measurable last-frame cost includes projection, paths and draw submission.
      state.canvas.dataset.frameMs=(performance.now()-start).toFixed(3);
      state.canvas.parentElement.classList.add('globe-ready');state.dirty=false;
    }
    if(!document.hidden&&!reduce.matches&&states.some(s=>s.visible))raf=requestAnimationFrame(frame);
  }
  function wake(){if(!raf&&!document.hidden){last=0;raf=requestAnimationFrame(frame);}}
  const visibility=new IntersectionObserver(entries=>{for(const entry of entries){const s=states.find(s=>s.canvas===entry.target);s.visible=entry.isIntersecting;if(s.visible)s.dirty=true;}wake();},{threshold:.01});
  states.forEach(s=>visibility.observe(s.canvas));
  const changed=()=>{states.forEach(s=>s.dirty=true);wake();};
  document.addEventListener('visibilitychange',changed);reduce.addEventListener('change',changed);
  return ()=>{cancelAnimationFrame(raf);visibility.disconnect();resize.disconnect();document.removeEventListener('visibilitychange',changed);reduce.removeEventListener('change',changed);};
}
if(typeof document!=='undefined')onPage(mountGlobes);
