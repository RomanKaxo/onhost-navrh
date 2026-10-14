import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { PowerOn, Deploy, Constellation } from './scenes';
import { Reels, REELS_FRAMES } from './reels/Reels';
import { BgLoop } from './bg/BgLoop';
import './brand.css';
const Root: React.FC = () => <>
  <Composition id="PowerOn" component={PowerOn} width={1920} height={1080} fps={30} durationInFrames={210} defaultProps={{loop:false}} />
  <Composition id="PowerOnPortrait" component={PowerOn} width={1080} height={1920} fps={30} durationInFrames={210} defaultProps={{loop:false}} />
  <Composition id="PowerOnLoop" component={PowerOn} width={1920} height={1080} fps={30} durationInFrames={240} defaultProps={{loop:true}} />
  <Composition id="PowerOnLoopPortrait" component={PowerOn} width={1080} height={1920} fps={30} durationInFrames={240} defaultProps={{loop:true}} />
  <Composition id="Deploy" component={Deploy} width={1920} height={1080} fps={30} durationInFrames={240} />
  <Composition id="Constellation" component={Constellation} width={1920} height={1080} fps={30} durationInFrames={240} />
  <Composition id="Reels" component={Reels} width={1080} height={1920} fps={30} durationInFrames={REELS_FRAMES} />
  <Composition id="ReelsLandscape" component={Reels} width={1920} height={1080} fps={30} durationInFrames={REELS_FRAMES} />
  {/* Živá pozadí webu (public/bg): 1664×936 jako zdroj, 24 fps, smyčka 10 s. */}
  <Composition id="BgNebula" component={BgLoop} width={1664} height={936} fps={24} durationInFrames={240} defaultProps={{name:'nebula' as const}} />
  <Composition id="BgHorizon" component={BgLoop} width={1664} height={936} fps={24} durationInFrames={240} defaultProps={{name:'horizon' as const}} />
  <Composition id="BgDeep" component={BgLoop} width={1664} height={936} fps={24} durationInFrames={240} defaultProps={{name:'deep' as const}} />
</>;
registerRoot(Root);
