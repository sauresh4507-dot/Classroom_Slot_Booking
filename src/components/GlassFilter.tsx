"use client";

import { useEffect, useRef } from "react";

export default function GlassFilter() {
  const feImageRef = useRef<SVGFEImageElement>(null);

  useEffect(() => {
    fetch("https://essykings.github.io/JavaScript/map.png")
      .then((response) => response.blob())
      .then((blob) => {
        const objURL = URL.createObjectURL(blob);
        if (feImageRef.current) {
          feImageRef.current.setAttribute("href", objURL);
        }
      })
      .catch((err) => console.error("Failed to load map image for filter", err));
  }, []);

  return (
    <svg style={{ position: "absolute", width: 0, height: 0 }}>
      {/* Existing Crystal Distortion Filter for Panels */}
      <filter id="crystal-distort" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.62 0.62" numOctaves={3} seed="5" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G" result="displaced" />
        <feGaussianBlur in="displaced" stdDeviation="0.5" result="blurred" />
        <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
      </filter>

      {/* Advanced Glass Button Filter */}
      <filter
        id="glass"
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
        primitiveUnits="objectBoundingBox"
      >
        <feImage
          ref={feImageRef}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          result="map"
          href="" /* fallback empty */
        />
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.02" result="blur" />
        <feDisplacementMap
          id="disp"
          in="blur"
          in2="map"
          scale="0.8"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
