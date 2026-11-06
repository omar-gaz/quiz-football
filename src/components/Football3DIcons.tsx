import React from 'react';

export type Football3DIconName =
  | 'pitch'
  | 'points'
  | 'stopwatch'
  | 'save'
  | 'redcard'
  | 'trophy'
  | 'jersey'
  | 'boots'
  | 'whistle'
  | 'var'
  | 'fire'
  | 'players'
  | 'armband'
  | 'clipboard'
  | 'ball'
  | 'scout';

interface IconProps {
  className?: string;
  size?: number | string;
}

// 1. Home → Football Pitch Top View (3D grass gradient + markings + center circle)
export const IconFootballPitch: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pitchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ADE80" />
        <stop offset="40%" stopColor="#22C55E" />
        <stop offset="100%" stopColor="#15803D" />
      </linearGradient>
      <linearGradient id="pitchGrassStripe" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#16A34A" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#15803D" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="pitchSheen" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* Pitch Base */}
    <rect x="4" y="8" width="40" height="32" rx="3" fill="url(#pitchGrad)" stroke="#000000" strokeWidth="2.5" />
    {/* Grass stripes */}
    <rect x="12" y="8" width="8" height="32" fill="url(#pitchGrassStripe)" />
    <rect x="28" y="8" width="8" height="32" fill="url(#pitchGrassStripe)" />
    {/* Pitch Markings */}
    <rect x="7" y="11" width="34" height="26" stroke="#FFFFFF" strokeWidth="1.6" strokeOpacity="0.95" />
    {/* Halfway line */}
    <line x1="24" y1="11" x2="24" y2="37" stroke="#FFFFFF" strokeWidth="1.6" strokeOpacity="0.95" />
    {/* Center circle */}
    <circle cx="24" cy="24" r="5" stroke="#FFFFFF" strokeWidth="1.6" strokeOpacity="0.95" />
    <circle cx="24" cy="24" r="1.2" fill="#FFFFFF" />
    {/* Penalty areas */}
    <rect x="7" y="17" width="6" height="14" stroke="#FFFFFF" strokeWidth="1.4" strokeOpacity="0.95" />
    <rect x="35" y="17" width="6" height="14" stroke="#FFFFFF" strokeWidth="1.4" strokeOpacity="0.95" />
    {/* Top-left glossy sheen */}
    <path d="M5 9 L26 9 L18 20 L5 20 Z" fill="url(#pitchSheen)" opacity="0.6" />
  </svg>
);

// 2. Score/Points → 3D Football with Gold Star Badge
export const IconFootballPoints: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ballSphere" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </radialGradient>
      <radialGradient id="badgeGold" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#CA8A04" />
      </radialGradient>
    </defs>
    {/* 3D Soccer Ball */}
    <circle cx="22" cy="24" r="16" fill="url(#ballSphere)" stroke="#000000" strokeWidth="2.5" />
    {/* Ball pentagon center */}
    <polygon points="22,17 26,20 25,25 19,25 18,20" fill="#1E293B" stroke="#000000" strokeWidth="1.2" />
    {/* Surrounding segments */}
    <path d="M22 17 L22 11 M26 20 L32 18 M25 25 L30 29 M19 25 L14 29 M18 20 L12 18" stroke="#1E293B" strokeWidth="1.4" />
    {/* Glossy specular reflection */}
    <ellipse cx="16" cy="15" rx="5" ry="3" transform="rotate(-30 16 15)" fill="#FFFFFF" opacity="0.75" />
    {/* Gold points star coin badge */}
    <circle cx="34" cy="32" r="10" fill="url(#badgeGold)" stroke="#000000" strokeWidth="2" />
    <path d="M34 26 L36 30 L40 31 L37 34 L38 38 L34 36 L30 38 L31 34 L28 31 L32 30 Z" fill="#000000" />
    <circle cx="32" cy="29" r="2" fill="#FFFFFF" opacity="0.6" />
  </svg>
);

// 3. Timer/Clock → Referee Stopwatch (3D metallic silver/gold chronograph)
export const IconRefereeStopwatch: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="metalChrome" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#CBD5E1" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
      <radialGradient id="dialGlass" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="45%" stopColor="#FFFDF0" />
        <stop offset="100%" stopColor="#FEF08A" />
      </radialGradient>
      <linearGradient id="watchPlunger" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#B91C1C" />
      </linearGradient>
    </defs>
    {/* Top ring & button */}
    <rect x="21" y="3" width="6" height="5" rx="1.5" fill="url(#watchPlunger)" stroke="#000000" strokeWidth="2" />
    <path d="M19 5 C19 2 29 2 29 5" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
    {/* Stopwatch Outer Body */}
    <circle cx="24" cy="27" r="17" fill="url(#metalChrome)" stroke="#000000" strokeWidth="2.5" />
    {/* Dial face */}
    <circle cx="24" cy="27" r="13" fill="url(#dialGlass)" stroke="#000000" strokeWidth="1.8" />
    {/* Tick marks */}
    <line x1="24" y1="16" x2="24" y2="18.5" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="24" y1="35.5" x2="24" y2="38" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="13" y1="27" x2="15.5" y2="27" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="32.5" y1="27" x2="35" y2="27" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" />
    {/* Needles */}
    <line x1="24" y1="27" x2="30" y2="20" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="27" r="2.2" fill="#000000" />
    {/* Glass sheen */}
    <path d="M14 20 A 13 13 0 0 1 31 16 A 11 11 0 0 0 14 20 Z" fill="#FFFFFF" opacity="0.65" />
  </svg>
);

// 4. Correct Answer → Goalkeeper Saving a Ball (3D glove deflecting ball)
export const IconGoalkeeperSave: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gloveGreen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86EFAC" />
        <stop offset="40%" stopColor="#22C55E" />
        <stop offset="100%" stopColor="#15803D" />
      </linearGradient>
      <radialGradient id="saveBall" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#CA8A04" />
      </radialGradient>
      <linearGradient id="netGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00F0FF" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    {/* Goal net backdrop */}
    <path d="M4 10 L20 6 L20 38 L4 42 Z" fill="#E2E8F0" stroke="#000000" strokeWidth="2" />
    <path d="M4 18 L20 14 M4 26 L20 22 M4 34 L20 30" stroke="#94A3B8" strokeWidth="1" />
    <path d="M9 8 L9 40 M14 7 L14 39" stroke="#94A3B8" strokeWidth="1" />
    {/* 3D Goalkeeper Glove Palm & Fingers */}
    <path
      d="M22 34 L19 23 C18 19 22 17 24 20 L26 15 C27 12 30 13 31 16 L33 14 C34 11 37 12 37 15 L38 18 C39 16 41 17 41 20 L39 30 C37 36 31 40 25 38 Z"
      fill="url(#gloveGreen)"
      stroke="#000000"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    {/* Palm grip cushion */}
    <ellipse cx="28" cy="29" rx="6" ry="5" fill="#000000" opacity="0.25" />
    {/* Deflected Ball */}
    <circle cx="34" cy="11" r="7" fill="url(#saveBall)" stroke="#000000" strokeWidth="2" />
    <polygon points="34,7 36,9 35,12 33,12 32,9" fill="#1E293B" />
    {/* Impact star burst rays */}
    <path d="M28 8 L24 6 M31 4 L32 1 M40 8 L44 6 M41 15 L45 17" stroke="#FFE500" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

// 5. Wrong Answer → 3D Red Card (Ref's disciplinary card angled with depth)
export const IconRedCard: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="redCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF4D4D" />
        <stop offset="50%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
      <linearGradient id="cardSheen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="shadowThick" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#000000" />
        <stop offset="100%" stopColor="#1E293B" />
      </linearGradient>
    </defs>
    {/* Card 3D Depth Shadow Extrusion */}
    <polygon points="17,8 37,12 33,42 13,38" fill="url(#shadowThick)" />
    {/* Front 3D Red Card Face */}
    <polygon
      points="14,6 34,10 30,40 10,36"
      fill="url(#redCardGrad)"
      stroke="#000000"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Glossy specular reflection stripe across card */}
    <polygon points="15,7 28,9.5 19,30 11,28" fill="url(#cardSheen)" />
    {/* Disciplinary whistle / alert lines */}
    <path d="M38 18 L43 16 M37 25 L44 26 M35 32 L41 35" stroke="#FF3D00" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// 6. Leaderboard → 3D Golden Football Trophy
export const IconFootballTrophy: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="40%" stopColor="#FACC15" />
        <stop offset="80%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#A16207" />
      </linearGradient>
      <radialGradient id="trophyBall" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </radialGradient>
    </defs>
    {/* Trophy Base Pedestal */}
    <rect x="14" y="38" width="20" height="6" rx="1.5" fill="#1E293B" stroke="#000000" strokeWidth="2.2" />
    <path d="M19 38 L21 32 L27 32 L29 38 Z" fill="url(#trophyGold)" stroke="#000000" strokeWidth="2" />
    {/* Trophy Cup Body */}
    <path
      d="M13 14 C13 26 18 32 24 32 C30 32 35 26 35 14 Z"
      fill="url(#trophyGold)"
      stroke="#000000"
      strokeWidth="2.4"
    />
    {/* Handles */}
    <path d="M13 16 C7 16 7 24 14 26" stroke="#000000" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    <path d="M35 16 C41 16 41 24 34 26" stroke="#000000" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    {/* 3D Soccer Ball resting on top */}
    <circle cx="24" cy="12" r="7" fill="url(#trophyBall)" stroke="#000000" strokeWidth="2" />
    <polygon points="24,8 26,10 25,13 23,13 22,10" fill="#1E293B" />
    {/* Glossy highlight */}
    <path d="M16 16 C16 22 18 27 21 28 C18 26 17 21 17 16 Z" fill="#FFFFFF" opacity="0.6" />
  </svg>
);

// 7. Categories / Mode → 3D Football Jersey (with Number 10)
export const IconFootballJersey: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="jerseyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="60%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
      <linearGradient id="collarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
    </defs>
    {/* Kit Body and Sleeves */}
    <path
      d="M17 7 L9 14 L13 20 L16 18 L16 41 L32 41 L32 18 L35 20 L39 14 L31 7 C28 10 20 10 17 7 Z"
      fill="url(#jerseyGrad)"
      stroke="#000000"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Crew Collar V-Neck */}
    <polygon points="20,7 24,12 28,7" fill="url(#collarGrad)" stroke="#000000" strokeWidth="1.5" />
    {/* Bold Number 10 on Chest */}
    <text x="24" y="30" textAnchor="middle" fill="#000000" fontSize="11" fontWeight="900" fontFamily="sans-serif">
      10
    </text>
    {/* Fabric highlight sheen */}
    <path d="M17 19 L17 38 L20 38 L20 19 Z" fill="#FFFFFF" opacity="0.4" />
  </svg>
);

// 8. Difficulty → 3D Football Boots (Studs & Aerodynamic Cleat)
export const IconFootballBoots: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bootGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="50%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
      <linearGradient id="studGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
    </defs>
    {/* Boot Body */}
    <path
      d="M6 25 C6 21 11 17 18 19 L25 15 C29 13 33 16 35 20 L42 27 C44 29 44 32 41 33 L8 33 C6 33 6 28 6 25 Z"
      fill="url(#bootGrad)"
      stroke="#000000"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Laces */}
    <path d="M22 18 L26 22 M25 16 L29 20 M28 14 L32 18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    {/* Speed Swoosh */}
    <path d="M12 28 C20 28 30 24 36 21" stroke="#AAFF00" strokeWidth="2.2" strokeLinecap="round" />
    {/* Sole Plate */}
    <rect x="7" y="32" width="35" height="3" fill="#1E293B" stroke="#000000" strokeWidth="1.5" />
    {/* Cleat Studs */}
    <polygon points="11,35 13,40 9,40" fill="url(#studGrad)" stroke="#000000" strokeWidth="1.5" />
    <polygon points="19,35 21,40 17,40" fill="url(#studGrad)" stroke="#000000" strokeWidth="1.5" />
    <polygon points="31,35 33,40 29,40" fill="url(#studGrad)" stroke="#000000" strokeWidth="1.5" />
    <polygon points="38,35 40,40 36,40" fill="url(#studGrad)" stroke="#000000" strokeWidth="1.5" />
  </svg>
);

// 9. Settings / Rules → 3D Referee Whistle
export const IconRefereeWhistle: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="whistleChrome" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="35%" stopColor="#E2E8F0" />
        <stop offset="70%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
    {/* Lanyard Ring */}
    <circle cx="9" cy="27" r="4.5" stroke="#000000" strokeWidth="2.2" fill="none" />
    {/* Whistle Chamber (Rear Sphere) */}
    <circle cx="19" cy="27" r="10" fill="url(#whistleChrome)" stroke="#000000" strokeWidth="2.5" />
    {/* Whistle Barrel / Mouthpiece */}
    <path
      d="M19 19 L40 19 C41 19 42 20 42 21 L42 28 C42 29 41 30 40 30 L26 30"
      fill="url(#whistleChrome)"
      stroke="#000000"
      strokeWidth="2.5"
    />
    {/* Air Sound Hole */}
    <rect x="23" y="17" width="4" height="6" rx="1" fill="#000000" />
    {/* Sound Blast Wave Rays */}
    <path d="M38 12 L41 8 M43 14 L47 12 M44 20 L48 20" stroke="#FFE500" strokeWidth="2.4" strokeLinecap="round" />
    {/* Glossy specular highlight */}
    <ellipse cx="16" cy="23" rx="4" ry="2.5" fill="#FFFFFF" opacity="0.75" />
  </svg>
);

// 10. Review / Admin → 3D VAR Screen
export const IconVARScreen: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="screenGlass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="50%" stopColor="#0F172A" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
    </defs>
    {/* Monitor Stand */}
    <rect x="21" y="34" width="6" height="6" fill="#64748B" stroke="#000000" strokeWidth="2" />
    <path d="M15 40 L33 40" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
    {/* Monitor Bezel */}
    <rect x="5" y="8" width="38" height="26" rx="2" fill="#334155" stroke="#000000" strokeWidth="2.5" />
    {/* Screen Display */}
    <rect x="8" y="11" width="32" height="20" fill="url(#screenGlass)" stroke="#000000" strokeWidth="1.5" />
    {/* VAR Text & Pitch Grid on Screen */}
    <text x="24" y="24" textAnchor="middle" fill="#00F0FF" fontSize="10" fontWeight="900" fontFamily="sans-serif">
      VAR
    </text>
    <line x1="8" y1="21" x2="14" y2="21" stroke="#AAFF00" strokeWidth="1.5" />
    <line x1="34" y1="21" x2="40" y2="21" stroke="#AAFF00" strokeWidth="1.5" />
    {/* Glass Screen Gloss Reflection */}
    <polygon points="9,12 25,12 15,30 9,30" fill="#FFFFFF" opacity="0.18" />
  </svg>
);

// 11. Streak / Fire → 3D Football on Fire
export const IconFootballOnFire: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="flameOuter" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FF3D00" />
        <stop offset="60%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
      <linearGradient id="flameInner" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="100%" stopColor="#FACC15" />
      </linearGradient>
      <radialGradient id="fireBall" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#FED7AA" />
        <stop offset="100%" stopColor="#FB923C" />
      </radialGradient>
    </defs>
    {/* Outer Roaring Flame */}
    <path
      d="M24 3 C27 9 32 10 35 15 C38 20 37 26 34 30 C39 26 40 20 38 16 C42 22 43 30 39 36 C35 43 25 45 18 43 C12 40 8 33 10 26 C11 20 15 16 16 11 C17 17 21 19 22 14 C23 10 23 5 24 3 Z"
      fill="url(#flameOuter)"
      stroke="#000000"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    {/* Inner Core Flame */}
    <path
      d="M24 14 C26 18 29 19 30 23 C31 27 28 31 24 33 C27 30 28 26 26 23 C25 21 21 21 21 18 C22 21 24 22 24 14 Z"
      fill="url(#flameInner)"
    />
    {/* 3D Ball in the hearth */}
    <circle cx="24" cy="30" r="10" fill="url(#fireBall)" stroke="#000000" strokeWidth="2.2" />
    <polygon points="24,25 27,27 26,30 22,30 21,27" fill="#1E293B" />
  </svg>
);

// 12. Friends / Multiplayer → Two 3D Football Players
export const IconFootballPlayers: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="kitBlue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="kitYellow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
    </defs>
    {/* Player 2 (Back / Right) */}
    <circle cx="32" cy="16" r="6" fill="#FDBA74" stroke="#000000" strokeWidth="2" />
    <path d="M25 40 C25 28 39 28 39 40 Z" fill="url(#kitBlue)" stroke="#000000" strokeWidth="2" />
    {/* Player 1 (Front / Left) */}
    <circle cx="18" cy="16" r="6" fill="#FED7AA" stroke="#000000" strokeWidth="2.2" />
    <path d="M10 42 C10 27 26 27 26 42 Z" fill="url(#kitYellow)" stroke="#000000" strokeWidth="2.2" />
    {/* Miniature ball between players */}
    <circle cx="25" cy="38" r="4.5" fill="#FFFFFF" stroke="#000000" strokeWidth="1.8" />
  </svg>
);

// 13. Profile / Captain → 3D Captain Armband
export const IconCaptainArmband: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="armbandYellow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="100%" stopColor="#FACC15" />
      </linearGradient>
    </defs>
    {/* Armband band */}
    <rect x="6" y="14" width="36" height="20" rx="3" fill="url(#armbandYellow)" stroke="#000000" strokeWidth="2.5" />
    {/* Stripes top and bottom */}
    <rect x="6" y="14" width="36" height="3" fill="#000000" />
    <rect x="6" y="31" width="36" height="3" fill="#000000" />
    {/* Bold Captain "C" */}
    <text x="24" y="29" textAnchor="middle" fill="#000000" fontSize="17" fontWeight="900" fontFamily="sans-serif">
      C
    </text>
    {/* Sheen */}
    <path d="M8 18 L18 18 L14 30 L8 30 Z" fill="#FFFFFF" opacity="0.4" />
  </svg>
);

// 14. Room / Code → Tactical Strategy Clipboard
export const IconTacticalClipboard: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="boardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ADE80" />
        <stop offset="100%" stopColor="#15803D" />
      </linearGradient>
    </defs>
    {/* Board */}
    <rect x="9" y="8" width="30" height="36" rx="2" fill="url(#boardGrad)" stroke="#000000" strokeWidth="2.5" />
    {/* Clip at top */}
    <rect x="18" y="4" width="12" height="7" rx="1.5" fill="#E2E8F0" stroke="#000000" strokeWidth="2" />
    <circle cx="24" cy="7.5" r="1.5" fill="#000000" />
    {/* Tactical plays (X and O with arrows) */}
    <circle cx="16" cy="19" r="2.5" stroke="#FFFFFF" strokeWidth="1.8" />
    <circle cx="32" cy="19" r="2.5" stroke="#FFFFFF" strokeWidth="1.8" />
    <path d="M22 26 L26 30 M26 26 L22 30" stroke="#FFE500" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 22 C22 24 26 24 30 22" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2 2" />
    {/* Ball token */}
    <circle cx="24" cy="36" r="3" fill="#FFFFFF" stroke="#000000" strokeWidth="1.4" />
  </svg>
);

// 15. Universal 3D Soccer Ball
export const IconFootball: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="pureBallSphere" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="65%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </radialGradient>
    </defs>
    <circle cx="24" cy="24" r="18" fill="url(#pureBallSphere)" stroke="#000000" strokeWidth="2.5" />
    {/* Center pentagon */}
    <polygon points="24,16 29,20 27,26 21,26 19,20" fill="#1E293B" stroke="#000000" strokeWidth="1.5" />
    {/* Seam lines & peripheral patches */}
    <line x1="24" y1="16" x2="24" y2="7" stroke="#1E293B" strokeWidth="1.8" />
    <line x1="29" y1="20" x2="38" y2="18" stroke="#1E293B" strokeWidth="1.8" />
    <line x1="27" y1="26" x2="33" y2="35" stroke="#1E293B" strokeWidth="1.8" />
    <line x1="21" y1="26" x2="15" y2="35" stroke="#1E293B" strokeWidth="1.8" />
    <line x1="19" y1="20" x2="10" y2="18" stroke="#1E293B" strokeWidth="1.8" />
    {/* Specular gloss highlight */}
    <ellipse cx="18" cy="14" rx="6" ry="3.5" transform="rotate(-30 18 14)" fill="#FFFFFF" opacity="0.8" />
  </svg>
);

// 16. Scout / Search → Tactical Scout Binoculars with pitch reflection
export const IconScoutSearch: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="scoutLenses" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ADE80" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    {/* Bridge */}
    <rect x="21" y="20" width="6" height="5" rx="1" fill="#1E293B" stroke="#000000" strokeWidth="2" />
    {/* Left Barrel */}
    <rect x="9" y="14" width="13" height="22" rx="3" fill="#334155" stroke="#000000" strokeWidth="2.5" />
    <ellipse cx="15.5" cy="33" rx="5" ry="2.5" fill="url(#scoutLenses)" stroke="#000000" strokeWidth="1.5" />
    {/* Right Barrel */}
    <rect x="26" y="14" width="13" height="22" rx="3" fill="#334155" stroke="#000000" strokeWidth="2.5" />
    <ellipse cx="32.5" cy="33" rx="5" ry="2.5" fill="url(#scoutLenses)" stroke="#000000" strokeWidth="1.5" />
    {/* Eyepieces */}
    <rect x="11" y="10" width="9" height="4" rx="1" fill="#000000" />
    <rect x="28" y="10" width="9" height="4" rx="1" fill="#000000" />
    {/* Lens reflections */}
    <ellipse cx="14" cy="32" rx="2" ry="1" fill="#FFFFFF" opacity="0.75" />
    <ellipse cx="31" cy="32" rx="2" ry="1" fill="#FFFFFF" opacity="0.75" />
  </svg>
);

// High-level wrapper with Neo-Brutalist base
export interface Football3DBadgeProps {
  name: Football3DIconName;
  baseColor?: 'yellow' | 'green' | 'coral' | 'cyan' | 'white' | 'black' | 'gold' | 'navy' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  badgeClassName?: string;
}

export const Football3DBadge: React.FC<Football3DBadgeProps> = ({
  name,
  baseColor = 'green',
  size = 'md',
  className = '',
  badgeClassName = '',
}) => {
  const baseColorMap: Record<string, string> = {
    yellow: 'bg-[#FFD700]',
    gold: 'bg-[#FFD700]',
    green: 'bg-[#00B140]',
    coral: 'bg-[#CC0000]',
    cyan: 'bg-[#00B140]',
    white: 'bg-[#0F3460]',
    black: 'bg-[#000000]',
    navy: 'bg-[#0F3460]',
    dark: 'bg-[#16213E]',
  };

  const sizeMap = {
    xs: { base: 'w-7 h-7', icon: 'w-4 h-4', shadow: 'shadow-[2px_2px_0px_#000000]' },
    sm: { base: 'w-9 h-9', icon: 'w-5 h-5', shadow: 'shadow-[3px_3px_0px_#000000]' },
    md: { base: 'w-12 h-12', icon: 'w-7 h-7', shadow: 'shadow-[4px_4px_0px_#000000]' },
    lg: { base: 'w-16 h-16', icon: 'w-10 h-10', shadow: 'shadow-[5px_5px_0px_#000000]' },
    xl: { base: 'w-20 h-20', icon: 'w-12 h-12', shadow: 'shadow-[6px_6px_0px_#000000]' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const currentBase = baseColorMap[baseColor] || baseColorMap.yellow;

  const renderIcon = () => {
    switch (name) {
      case 'pitch': return <IconFootballPitch className={currentSize.icon} />;
      case 'points': return <IconFootballPoints className={currentSize.icon} />;
      case 'stopwatch': return <IconRefereeStopwatch className={currentSize.icon} />;
      case 'save': return <IconGoalkeeperSave className={currentSize.icon} />;
      case 'redcard': return <IconRedCard className={currentSize.icon} />;
      case 'trophy': return <IconFootballTrophy className={currentSize.icon} />;
      case 'jersey': return <IconFootballJersey className={currentSize.icon} />;
      case 'boots': return <IconFootballBoots className={currentSize.icon} />;
      case 'whistle': return <IconRefereeWhistle className={currentSize.icon} />;
      case 'var': return <IconVARScreen className={currentSize.icon} />;
      case 'fire': return <IconFootballOnFire className={currentSize.icon} />;
      case 'players': return <IconFootballPlayers className={currentSize.icon} />;
      case 'armband': return <IconCaptainArmband className={currentSize.icon} />;
      case 'clipboard': return <IconTacticalClipboard className={currentSize.icon} />;
      case 'ball': return <IconFootball className={currentSize.icon} />;
      case 'scout': return <IconScoutSearch className={currentSize.icon} />;
      default: return <IconFootball className={currentSize.icon} />;
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 border-[2.5px] border-black ${currentBase} ${currentSize.base} ${currentSize.shadow} ${badgeClassName}`}
    >
      <div className={className}>{renderIcon()}</div>
    </div>
  );
};
