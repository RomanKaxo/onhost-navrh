import { Component, type ReactNode } from "react";
import type { COBEOptions } from "cobe";
import { Globe } from "./ui/globe";

// Praha is the only infrastructure location stated by the existing catalog.
// Coordinates match scripts/build-world.mjs; the other map endpoints are illustrative.
const config: COBEOptions = {
  width: 800, height: 800, devicePixelRatio: 2,
  phi: 4.46, theta: 0.55, dark: 1, diffuse: 1.2,
  mapSamples: 16000, mapBrightness: 6, mapBaseBrightness: 0,
  baseColor: [0.55, 0.32, 0.75],
  markerColor: [247 / 255, 37 / 255, 133 / 255],
  glowColor: [60 / 255, 9 / 255, 108 / 255],
  markers: [{ location: [50.08, 14.43], size: 0.07 }],
  onRender: () => {},
};

class GlobeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function NetworkGlobe() {
  return (
    <div className="network-globe" role="img" aria-label="Globus s označenou Prahou, sídlem datacentra ONhost.">
      <div className="network-globe__fallback" aria-hidden="true" />
      <GlobeBoundary><Globe config={config} /></GlobeBoundary>
    </div>
  );
}
