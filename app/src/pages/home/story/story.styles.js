export const BLUR_VIDEO_BASE_STYLE = {
  left: '-2vw',
  width: '104vw',
  filter: 'brightness(0.7) saturate(1)',
  willChange: 'opacity',
  pointerEvents: 'none',
  transform: 'translateZ(0)',
  WebkitTransform: 'translateZ(0)',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  perspective: '1000px',
  WebkitPerspective: '1000px',
};

export const VIDEO_OVERLAY_STYLE = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 1,
  pointerEvents: 'none',
};

export const VIDEO_INNER_CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
  position: 'relative',
  display: 'inline-block',
};

export const VIDEO_CONTROLS_HIDDEN_CSS = `
  video {
    pointer-events: none !important;
    outline: none !important;
    user-select: none !important;
    -webkit-user-select: none !important;
    -webkit-touch-callout: none !important;
  }

  video::-webkit-media-controls,
  video::-webkit-media-controls-panel,
  video::-webkit-media-controls-start-playbook-button,
  video::-webkit-media-controls-play-button,
  video::-webkit-media-controls-timeline,
  video::-webkit-media-controls-current-time-display,
  video::-webkit-media-controls-time-remaining-display,
  video::-webkit-media-controls-mute-button,
  video::-webkit-media-controls-volume-slider,
  video::-webkit-media-controls-fullscreen-button,
  video::-webkit-media-controls-overlay-enclosure,
  video::-webkit-media-controls-overlay-play-button {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }

  video::-ms-media-controls {
    display: none !important;
  }
`;

// Headline type, shared so the layout that renders it and the hook that
// vertically centres the collection can't drift apart.
export const HEADLINE_FONT_SIZE = { desktop: 48, landscapeTablet: 32 };
export const HEADLINE_LINE_HEIGHT = 1.2;

// Vertical distance from an Inter line box's top edge down to the cap
// height of the first line, as a fraction of font-size, at line-height
// 1.2. Half-leading ((1.2 - 1) / 2 = 0.1em) plus the gap between the
// em-box top and the cap top (~0.1165em for Inter). Needed because the
// headline's top edge is a text line box with this much empty slack,
// while the collection's bottom edge is a hard card border with none:
// centring the boxes therefore donates all the slack to the top void.
export const HEADLINE_CAP_INSET_RATIO = 0.2165;
