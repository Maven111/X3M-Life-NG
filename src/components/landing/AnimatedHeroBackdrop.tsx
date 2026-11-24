'use client';

import React from 'react';

/**
 * Coordinate-Locked Living Hero Backdrop (v4 — Vibrant Lighting + Left & Right Blink Loops)
 * Renders the 1376x768 X3M Ideas Lagos key art inside a synchronized SVG viewport
 * (preserveAspectRatio="xMidYMid slice") so left & right character blinks and
 * the silver butterfly glint stay pixel-locked across every viewport.
 */
export function AnimatedHeroBackdrop() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      <div className="w-full h-full animate-hero-breathe saturate-[1.15] contrast-[1.06] brightness-[1.05]">
        <svg
          viewBox="0 0 1376 768"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full block"
        >
          <defs>
            {/* Skin/lens-matched eyelid gradients for smooth, natural blinks */}
            <linearGradient id="lid-center" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B4832" />
              <stop offset="80%" stopColor="#6B3424" />
              <stop offset="100%" stopColor="#2F130D" />
            </linearGradient>

            {/* Left woman: warm bronze seen behind yellow-tinted lenses */}
            <linearGradient id="lid-left-woman" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9C7A3C" />
              <stop offset="80%" stopColor="#755625" />
              <stop offset="100%" stopColor="#35220D" />
            </linearGradient>

            {/* Left man: warm brown seen behind cool-tinted rimless lenses */}
            <linearGradient id="lid-left-man" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#644E58" />
              <stop offset="80%" stopColor="#4A353E" />
              <stop offset="100%" stopColor="#23161C" />
            </linearGradient>

            <filter id="lid-soft" x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur stdDeviation="0.6" />
            </filter>
          </defs>

          {/* Base 16:9 Balanced 2v2 Hero Key Art with Modern X3M IDEAS Building Signage */}
          <image
            href="/images/hero-agency-bg.jpg?v=4"
            x="0"
            y="0"
            width="1376"
            height="768"
          />

          {/* Subtle animated diamond sparkle on the native silver butterfly pendant */}
          <g className="animate-pendant-glint" transform="translate(988, 526)">
            <path d="M 0,-5.5 L 1.3,-1.3 L 5.5,0 L 1.3,1.3 L 0,5.5 L -1.3,1.3 L -5.5,0 L -1.3,-1.3 Z" fill="#FFFFFF" />
          </g>

          {/* =================================================================
              CONTROLLED NATURAL BLINKING OVERLAYS (LEFT DUO + RIGHT FRONT)
              ================================================================= */}

          {/* Left Woman (Green/Yellow Jersey, behind translucent yellow shades) */}
          <g className="animate-blink-amber" filter="url(#lid-soft)">
            {/* Left Eye */}
            <path
              d="M 157,275 Q 167,269 177,276 Q 167,283 157,279 Z"
              fill="url(#lid-left-woman)"
            />
            <path
              d="M 157,278 Q 167,282 177,277"
              fill="none"
              stroke="#241507"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Right Eye */}
            <path
              d="M 191,276 Q 201,269 211,275 Q 201,283 191,279 Z"
              fill="url(#lid-left-woman)"
            />
            <path
              d="M 191,278 Q 201,282 211,277"
              fill="none"
              stroke="#241507"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </g>

          {/* Left Man (Light-Blue Pinstriped Shirt, behind cool-tinted rimless glasses) */}
          <g className="animate-blink-suit" filter="url(#lid-soft)">
            {/* Left Eye */}
            <path
              d="M 324,252 Q 334,246 344,253 Q 334,260 324,256 Z"
              fill="url(#lid-left-man)"
            />
            <path
              d="M 324,255 Q 334,259 344,254"
              fill="none"
              stroke="#1C1016"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Right Eye */}
            <path
              d="M 358,253 Q 368,246 378,252 Q 368,260 358,256 Z"
              fill="url(#lid-left-man)"
            />
            <path
              d="M 358,255 Q 368,259 378,254"
              fill="none"
              stroke="#1C1016"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </g>

          {/* Front-Right Lady (Detroit Pistons #11 Jersey) */}
          <g className="animate-blink-center" filter="url(#lid-soft)">
            {/* Left Eye */}
            <path
              d="M 961,361 Q 976,351 991,362 Q 976,373 961,366 Z"
              fill="url(#lid-center)"
            />
            <path
              d="M 961,365 Q 976,372 991,364"
              fill="none"
              stroke="#1E0B07"
              strokeWidth="2.3"
              strokeLinecap="round"
            />
            {/* Right Eye */}
            <path
              d="M 1008,360 Q 1023,349 1039,358 Q 1024,370 1008,364 Z"
              fill="url(#lid-center)"
            />
            <path
              d="M 1008,364 Q 1024,369 1039,360"
              fill="none"
              stroke="#1E0B07"
              strokeWidth="2.3"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
