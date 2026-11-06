import React from 'react';

export const PitchBackground: React.FC<{
  className?: string;
  strokeColor?: string;
  opacity?: number;
}> = ({
  className = '',
  strokeColor = '#C8963E',
  opacity = 0.06,
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full object-cover"
        viewBox="0 0 800 1200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity }}
      >
        {/* Outer pitch boundary */}
        <rect
          x="40"
          y="40"
          width="720"
          height="1120"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Halfway line */}
        <line
          x1="40"
          y1="600"
          x2="760"
          y2="600"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Center circle */}
        <circle
          cx="400"
          cy="600"
          r="110"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Center spot */}
        <circle
          cx="400"
          cy="600"
          r="5"
          fill={strokeColor}
        />

        {/* Top penalty box */}
        <rect
          x="200"
          y="40"
          width="400"
          height="220"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Top goal area */}
        <rect
          x="280"
          y="40"
          width="240"
          height="90"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Top penalty spot */}
        <circle
          cx="400"
          cy="180"
          r="4"
          fill={strokeColor}
        />

        {/* Top penalty arc */}
        <path
          d="M 320 260 A 100 100 0 0 0 480 260"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Bottom penalty box */}
        <rect
          x="200"
          y="940"
          width="400"
          height="220"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Bottom goal area */}
        <rect
          x="280"
          y="1070"
          width="240"
          height="90"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Bottom penalty spot */}
        <circle
          cx="400"
          cy="1020"
          r="4"
          fill={strokeColor}
        />

        {/* Bottom penalty arc */}
        <path
          d="M 320 940 A 100 100 0 0 1 480 940"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Corner arcs */}
        <path d="M 40 70 A 30 30 0 0 0 70 40" stroke={strokeColor} strokeWidth="3" />
        <path d="M 730 40 A 30 30 0 0 0 760 70" stroke={strokeColor} strokeWidth="3" />
        <path d="M 40 1130 A 30 30 0 0 1 70 1160" stroke={strokeColor} strokeWidth="3" />
        <path d="M 730 1160 A 30 30 0 0 1 760 1130" stroke={strokeColor} strokeWidth="3" />
      </svg>
    </div>
  );
};
