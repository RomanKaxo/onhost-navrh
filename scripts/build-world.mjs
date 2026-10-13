// Natural Earth 110m land via world-atlas (ISC). Offline, deterministic build data.
import {readFileSync, writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {feature} from 'topojson-client';
const require = createRequire(import.meta.url);
const land = feature(JSON.parse(readFileSync(require.resolve('world-atlas/land-110m.json'))), 'land');
const polygons = land.features.flatMap(f=>f.geometry.type==='MultiPolygon'?f.geometry.coordinates:[f.geometry.coordinates]);
function insideRing(x,y,ring) {
  let yes=false;
  for(let i=0,j=ring.length-1;i<ring.length;j=i++) {
    const [a,b]=ring[i], [c,d]=ring[j];
    if((b>y)!==(d>y) && x<(c-a)*(y-b)/(d-b)+a) yes=!yes;
  }
  return yes;
}
const onLand=(x,y)=>polygons.some(p=>insideRing(x,y,p[0])&&!p.slice(1).some(r=>insideRing(x,y,r)));
let seed=713; const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
const project=(lon,lat)=>[+(26+(lon+180)*2.63).toFixed(1),+(24+(78-lat)*3.45).toFixed(1)];
const geo=[[14.43,50.08]];
for(let row=0,lat=-54;lat<78;row++,lat+=4.6) for(let lon=-178+(row%2)*2.65;lon<180;lon+=5.3) {
  const x=lon+(random()-.5)*1.7,y=lat+(random()-.5)*1.3;
  if(onLand(x,y)&&Math.hypot(x-14.43,y-50.08)>2.5)geo.push([x,y]);
}
const points=geo.map(([x,y],i)=>({x:project(x,y)[0],y:project(x,y)[1],...(i===0?{id:'origin'}:{})}));
const adjacency=points.map(()=>[]),edges=[],seen=new Set();
points.forEach((p,i)=>{
  const nearest=points.map((q,j)=>({j,d:Math.hypot(p.x-q.x,p.y-q.y)})).filter(q=>q.j!==i&&q.d<28).sort((a,b)=>a.d-b.d);
  let count=0;
  for(const {j} of nearest) {
    const [a,b]=geo[i],[c,d]=geo[j];
    if(![.15,.3,.45,.6,.75,.9].every(t=>onLand(a+(c-a)*t,b+(d-b)*t)))continue;
    const key=[i,j].sort((a,b)=>a-b).join(':');
    if(!seen.has(key)){seen.add(key);edges.push({a:i,b:j});adjacency[i].push(j);adjacency[j].push(i);}
    if(++count===3)break;
  }
});
// Join disconnected land components with sparse backbone links. These are
// illustrative traffic routes, not claims about ONhost infrastructure.
const connected=new Set([0]);
function flood(start){const q=[start];connected.add(start);for(let n=0;n<q.length;n++)for(const j of adjacency[q[n]])if(!connected.has(j)){connected.add(j);q.push(j);}}
flood(0);
while(connected.size<points.length){
  let best=Infinity,a=0,b=0;
  for(const i of connected)for(let j=0;j<points.length;j++)if(!connected.has(j)){
    const d=Math.hypot(points[i].x-points[j].x,points[i].y-points[j].y);
    if(d<best){best=d;a=i;b=j;}
  }
  edges.push({a,b});adjacency[a].push(b);adjacency[b].push(a);flood(b);
}
const hops=points.map(()=>-1),parent=points.map(()=>-1),queue=[0];hops[0]=0;
for(let n=0;n<queue.length;n++)for(const j of adjacency[queue[n]])if(hops[j]<0){hops[j]=hops[queue[n]]+1;parent[j]=queue[n];queue.push(j);}
const reachable=[...queue];
points.forEach((p,i)=>p.hop=hops[i]);edges.forEach(e=>{
  if(hops[e.a]>hops[e.b])[e.a,e.b]=[e.b,e.a];
  e.hop=Math.min(hops[e.a],hops[e.b]);
});
const targets=reachable.filter(i=>hops[i]>8).sort((a,b)=>hops[b]-hops[a]);
const chosen=[];for(const i of targets)if(chosen.every(j=>Math.hypot(points[i].x-points[j].x,points[i].y-points[j].y)>65)){chosen.push(i);if(chosen.length===8)break;}
const routes=chosen.map(i=>{const path=[];for(let j=i;j>=0;j=parent[j])path.unshift(j);return path;});
const result={width:1000,height:520,source:'Natural Earth 110m / world-atlas 2.0.2 (ISC); network illustration, not infrastructure locations',points,edges,routes};
writeFileSync(new URL('../src/data/world-network.json',import.meta.url),JSON.stringify(result));
console.log(`${points.length} land points, ${edges.length} edges, ${routes.length} routes`);
