import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { PowerOn, Deploy, Constellation } from './scenes';
import './brand.css';
const Root: React.FC = () => <>
  <Composition id="PowerOn" component={PowerOn} width={1920} height={1080} fps={30} durationInFrames={210} defaultProps={{loop:false}} />
  <Composition id="PowerOnPortrait" component={PowerOn} width={1080} height={1920} fps={30} durationInFrames={210} defaultProps={{loop:false}} />
  <Composition id="PowerOnLoop" component={PowerOn} width={1920} height={1080} fps={30} durationInFrames={240} defaultProps={{loop:true}} />
  <Composition id="PowerOnLoopPortrait" component={PowerOn} width={1080} height={1920} fps={30} durationInFrames={240} defaultProps={{loop:true}} />
  <Composition id="Deploy" component={Deploy} width={1920} height={1080} fps={30} durationInFrames={240} />
  <Composition id="Constellation" component={Constellation} width={1920} height={1080} fps={30} durationInFrames={240} />
</>;
registerRoot(Root);
