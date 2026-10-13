import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

const brand = { space:'#12001E', purple:'#3C096C', pink:'#E91E7A', hot:'#F72585', lilac:'#BB88EB', pale:'#E0BEFF' };
const ramp = (frame:number, from:number, to:number) => interpolate(frame,[from,to],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
// Deterministic geometry, independent of frame order and wall clock.
const stars = Array.from({length:120},(_,i) => ({x:((i*73+19)%997)/997,y:((i*139+71)%991)/991,r:1+(i%3),phase:i*.73}));
const Canvas:React.FC<{children:React.ReactNode}> = ({children}) => <AbsoluteFill style={{background:brand.space,color:brand.pale,fontFamily:'Inter Variable',overflow:'hidden'}}>{children}</AbsoluteFill>;
const Universe:React.FC<{power?:number}> = ({power=1}) => {
  const frame = useCurrentFrame(); const {width,height,durationInFrames} = useVideoConfig();
  const phase = frame/durationInFrames*Math.PI*2;
  return <AbsoluteFill style={{opacity:power}}>
    <AbsoluteFill style={{background:`radial-gradient(ellipse at ${50+8*Math.sin(phase)}% ${50+6*Math.cos(phase)}%, ${brand.purple} 0%, transparent 68%), radial-gradient(ellipse at 75% 65%, #e91e7a18, transparent 52%)`}} />
    <svg width={width} height={height} style={{position:'absolute',inset:0}}>
      {stars.map((s,i)=><circle key={i} cx={s.x*width+5*Math.sin(phase+s.phase)} cy={s.y*height+4*Math.cos(phase+s.phase)} r={s.r} fill={[brand.pink,brand.hot,brand.lilac,brand.pale][i%4]} opacity={.55+.25*Math.sin(phase+s.phase)} />)}
    </svg>
  </AbsoluteFill>;
};
// Original logo files: no filters, rotations, clipping, skew, stretch or colour changes.
export const PowerOn:React.FC<{loop:boolean}> = ({loop}) => {
  const frame=useCurrentFrame(); const {width,height}=useVideoConfig();
  const portrait=height>width;
  const out=loop ? 1-ramp(frame,204,240) : 1;
  const power=ramp(frame,20,72)*out;
  const press=interpolate(frame,[0,12,15,19,24,210],[1,1,.94,.94,1,1],{extrapolateRight:'clamp'});
  const horizontal=ramp(frame,126,150)*out;
  const symbol=(1-ramp(frame,120,144))*(loop ? 1 : out)+(loop ? ramp(frame,204,240) : 0);
  const radius=portrait?290:250;
  const ring=ramp(frame,40,90)*(1-ramp(frame,108,126))*out;
  return <Canvas><Universe power={power}/>
    <AbsoluteFill style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
      <svg width={radius*2+40} height={radius*2+40} style={{position:'absolute',opacity:ring}} viewBox={`0 0 ${radius*2+40} ${radius*2+40}`}>
        <circle cx={radius+20} cy={radius+20} r={radius} fill="none" stroke={brand.lilac} strokeOpacity={.4} strokeWidth={1.5} strokeDasharray={2*Math.PI*radius} strokeDashoffset={2*Math.PI*radius*(1-ring)} />
        <circle cx={radius+20+radius*Math.cos(frame/240*Math.PI*2)} cy={radius+20+radius*Math.sin(frame/240*Math.PI*2)} r={6} fill={brand.pink} />
      </svg>
      <Img src={staticFile('brand/onhost-symbol.svg')} style={{position:'absolute',width:portrait?190:160,height:'auto',opacity:symbol,transform:`scale(${press})`}} />
      <Img src={staticFile('brand/onhost-horizontal.svg')} style={{position:'absolute',width:portrait?650:780,height:'auto',opacity:horizontal}} />
    </AbsoluteFill>
    <div style={{position:'absolute',left:0,right:0,top:portrait?'72%':'81%',textAlign:'center',fontFamily:'League Spartan',fontSize:portrait?64:54,letterSpacing:-1,opacity:ramp(frame,65,95)*out}}>Zapni svůj vesmír</div>
  </Canvas>;
};

export const Deploy:React.FC = () => {
  const frame=useCurrentFrame(); const phase=frame/240*Math.PI*2;
  const shipOpacity=ramp(frame,10,35)*(1-ramp(frame,200,230));
  const launch=ramp(frame,50,145); const angle=-Math.PI/2+launch*Math.PI*1.8;
  const x=1200+260*Math.cos(angle), y=535+260*Math.sin(angle);
  const line=ramp(frame,24,90)*(1-ramp(frame,194,230));
  return <Canvas><Universe/>
    <div style={{position:'absolute',left:150,top:150,fontFamily:'League Spartan',fontSize:82}}>git push →</div>
    <div style={{position:'absolute',left:155,top:245,fontSize:24,letterSpacing:3}}>DEPLOY</div>
    <svg width={1920} height={1080} style={{position:'absolute',inset:0}}>
      <circle cx={1200} cy={535} r={260} fill="none" stroke={brand.lilac} strokeOpacity={.25} />
      <path d="M 170 720 C 450 720, 600 350, 1200 275" fill="none" stroke={brand.pink} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1-line} opacity={line} />
      <circle cx={1200} cy={535} r={70} fill={brand.purple}/>
      <circle cx={1200+260*Math.cos(phase)} cy={535+260*Math.sin(phase)} r={4} fill={brand.pale}/>
      <g opacity={shipOpacity} transform={`translate(${x} ${y})`}>
        <path d="M -18 14 L 0 -26 L 18 14 L 0 7 Z" fill={brand.pale}/>
        <path d="M -7 19 L 0 45 L 7 19" fill={brand.pink}/>
      </g>
    </svg>
    <div style={{position:'absolute',left:150,bottom:150,fontFamily:'League Spartan',fontSize:48,opacity:line}}>Na oběžnou dráhu.</div>
  </Canvas>;
};

// Abstract network only; deliberately no geographic coordinates or city claims.
const nodes=[[360,600],[610,310],[790,730],[990,430],[1250,280],[1460,640],[1210,800]];
const edges=[[0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[2,6],[5,6],[4,5]];
export const Constellation:React.FC = () => {
  const frame=useCurrentFrame(); const phase=frame/240*Math.PI*2;
  const presence=ramp(frame,0,50)*(1-ramp(frame,190,240));
  return <Canvas><Universe/>
    <div style={{position:'absolute',left:150,top:130,fontFamily:'League Spartan',fontSize:76}}>Souhvězdí spojení</div>
    <svg width={1920} height={1080} style={{position:'absolute',inset:0}}>
      {edges.map(([a,b],i)=><line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={brand.lilac} strokeWidth={1.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1-ramp(frame,28+i*4,72+i*4)} opacity={presence*.5}/>)}
      {nodes.map(([x,y],i)=><g key={i} opacity={presence}>
        <circle cx={x} cy={y} r={20+4*Math.sin(phase+i)} fill={brand.purple} stroke={brand.lilac} strokeOpacity={.35}/>
        <circle cx={x} cy={y} r={5} fill={i%2?brand.pink:brand.pale}/>
      </g>)}
    </svg>
    <div style={{position:'absolute',left:150,bottom:100,fontSize:22,letterSpacing:2,opacity:presence}}>ABSTRAKTNÍ SÍŤ</div>
  </Canvas>;
};
