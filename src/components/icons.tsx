/* Iconografía propia de PIZARRA Analytics — SVG inline, trazo 1.6 */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (p: P) => {
  const { size = 18, ...rest } = p;
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...rest,
  };
};

export const IconPitch = (p: P) => (
  <svg {...base(p)}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="1.5" />
    <line x1="12" y1="4.5" x2="12" y2="19.5" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M2.5 9.5h3v5h-3M21.5 9.5h-3v5h3" />
  </svg>
);

export const IconBall = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.2l4.3 3.1-1.6 5H9.3l-1.6-5L12 7.2z" />
    <path d="M12 3.5v3.7M7.7 10.3L4 8.9M16.3 10.3L20 8.9M14.7 15.3l2.3 3.1M9.3 15.3L7 18.4" />
  </svg>
);

export const IconWhistle = (p: P) => (
  <svg {...base(p)}>
    <path d="M13.5 9H21v3.5l-6 1.5a4.5 4.5 0 1 1-1.5-5z" />
    <circle cx="10.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
    <path d="M9 6.5l1 2M13 5.5v2.2M5.5 8l1.6 1.4" />
  </svg>
);

export const IconRadar = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.8" strokeDasharray="2.4 2.6" />
    <path d="M12 12L17.5 6" />
    <circle cx="15" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconChart = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 4v16h16" />
    <path d="M7.5 15.5v-4M11.5 15.5V7.5M15.5 15.5v-6.5M19.5 15.5v-9" />
  </svg>
);

export const IconLock = (p: P) => (
  <svg {...base(p)}>
    <rect x="5.5" y="10.5" width="13" height="9" rx="1.5" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    <circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconShield = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5l7 2.6v5.4c0 4.6-3 7.6-7 9-4-1.4-7-4.4-7-9V6.1l7-2.6z" />
    <path d="M9 12l2.2 2.2L15.5 9.7" />
  </svg>
);

export const IconFlag = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 21V4" />
    <path d="M6 4.5h11.5l-2.4 3.5 2.4 3.5H6" />
  </svg>
);

export const IconCard = (p: P) => (
  <svg {...base(p)}>
    <rect x="7.5" y="3.5" width="10" height="14" rx="1.5" transform="rotate(-10 12 10.5)" />
    <rect x="6" y="6.5" width="10" height="14" rx="1.5" />
  </svg>
);

export const IconClock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5l3.2 1.9" />
  </svg>
);

export const IconUser = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20c1.2-3.4 3.8-5 7-5s5.8 1.6 7 5" />
  </svg>
);

export const IconStar = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.8l2.5 5.2 5.7.7-4.2 4 1.1 5.6-5.1-2.8-5.1 2.8 1.1-5.6-4.2-4 5.7-.7L12 3.8z" />
  </svg>
);

export const IconArrow = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 12h15M14 6.5l5.5 5.5-5.5 5.5" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
);

export const IconClose = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconMenu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const IconBookmark = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 4h10a1 1 0 0 1 1 1v15.5l-6-3.6-6 3.6V5a1 1 0 0 1 1-1z" />
  </svg>
);

export const IconTrend = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 17.5l5.5-5.5 3.5 3.5 7.5-8" />
    <path d="M15 7.5h5v5" />
  </svg>
);

export const IconEye = (p: P) => (
  <svg {...base(p)}>
    <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);

export const IconAlert = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4L2.8 19.5h18.4L12 4z" />
    <path d="M12 10v4" />
    <circle cx="12" cy="16.8" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconSwap = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 4.5L3.5 8 7 11.5M3.5 8h13M17 12.5l3.5 3.5-3.5 3.5M20.5 16h-13" />
  </svg>
);

export const IconDoc = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.5 3.5h7l4 4v13h-11v-17z" />
    <path d="M13.5 3.5v4h4M9.5 12h5M9.5 15.5h5" />
  </svg>
);

export const IconLayers = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5l8.5 4.5L12 12.5 3.5 8 12 3.5z" />
    <path d="M3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5" />
  </svg>
);

export const IconTarget = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);
