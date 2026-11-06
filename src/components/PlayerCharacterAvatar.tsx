import React from 'react';

export type CharacterAvatarId =
  | 'striker'
  | 'goalkeeper'
  | 'captain'
  | 'winger'
  | 'defender'
  | 'midfielder'
  | 'freekick'
  | 'legend'
  | 'wonderkid'
  | 'fanfavorite'
  | string;

interface PlayerCharacterAvatarProps {
  avatarId?: CharacterAvatarId | null;
  className?: string;
  size?: number | string;
}

export const PlayerCharacterAvatar: React.FC<PlayerCharacterAvatarProps> = ({
  avatarId = 'striker',
  className = 'w-full h-full',
}) => {
  const id = avatarId || 'striker';

  // Fallback for legacy emojis or unrecognized strings
  const isPreset = [
    'striker',
    'goalkeeper',
    'captain',
    'winger',
    'defender',
    'midfielder',
    'freekick',
    'legend',
    'wonderkid',
    'fanfavorite',
  ].includes(id);

  if (!isPreset) {
    // If it's an emoji like '⚽' or text
    return (
      <span className="flex items-center justify-center w-full h-full text-center select-none">
        {id}
      </span>
    );
  }

  return (
    <div className={`relative flex items-center justify-center overflow-hidden select-none ${className}`}>
      {id === 'striker' && (
        // 1. STRIKER: Number 9 jersey, electric green kit, sharp eyes, modern dark textured hair
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="stkBg" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#052e16" />
              <stop offset="100%" stopColor="#022c22" />
            </linearGradient>
            <linearGradient id="stkSkin" x1="0" y1="16" x2="0" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="stkJersey" x1="0" y1="38" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="50%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>
            <linearGradient id="stkHair" x1="0" y1="6" x2="0" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#27272A" />
              <stop offset="100%" stopColor="#09090B" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" fill="url(#stkBg)" />
          {/* Jersey body */}
          <path d="M12 64 C12 46 18 40 32 40 C46 40 52 46 52 64 Z" fill="url(#stkJersey)" stroke="#000" strokeWidth="2.5" />
          <path d="M24 40 L32 49 L40 40 Z" fill="#FCD34D" stroke="#000" strokeWidth="2" />
          {/* Number 9 on chest */}
          <circle cx="32" cy="54" r="5" fill="#000" opacity="0.3" />
          <text x="32" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900" fontFamily="system-ui, sans-serif">9</text>
          {/* Head & Neck */}
          <rect x="27" y="32" width="10" height="10" rx="3" fill="#F59E0B" stroke="#000" strokeWidth="2" />
          <circle cx="32" cy="27" r="13" fill="url(#stkSkin)" stroke="#000" strokeWidth="2.5" />
          {/* Ears */}
          <circle cx="18" cy="28" r="3.5" fill="#F59E0B" stroke="#000" strokeWidth="1.8" />
          <circle cx="46" cy="28" r="3.5" fill="#F59E0B" stroke="#000" strokeWidth="1.8" />
          {/* Striker Hair - Forward modern spike */}
          <path d="M18 24 C18 12 25 8 32 7 C39 8 46 12 46 24 C43 20 38 18 32 18 C26 18 21 20 18 24 Z" fill="url(#stkHair)" stroke="#000" strokeWidth="2" />
          <path d="M28 8 L32 4 L36 8 Z" fill="#27272A" stroke="#000" strokeWidth="1.5" />
          {/* Face details */}
          <ellipse cx="27" cy="26" rx="2" ry="2.5" fill="#000" />
          <circle cx="26.5" cy="25" r="0.8" fill="#FFF" />
          <ellipse cx="37" cy="26" rx="2" ry="2.5" fill="#000" />
          <circle cx="36.5" cy="25" r="0.8" fill="#FFF" />
          {/* Eyebrows determined look */}
          <path d="M24 22 L29 23.5" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          <path d="M40 22 L35 23.5" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          {/* Confident Smile */}
          <path d="M29 32 Q32 35 35 32" stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      )}

      {id === 'goalkeeper' && (
        // 2. GOALKEEPER: Gloves raised, neon pink/yellow kit, concentrated focus
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gkBg" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4a044e" />
              <stop offset="100%" stopColor="#2e1065" />
            </linearGradient>
            <linearGradient id="gkSkin" x1="0" y1="16" x2="0" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="gkJersey" x1="0" y1="38" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#BE185D" />
            </linearGradient>
            <linearGradient id="gkGlove" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" fill="url(#gkBg)" />
          {/* Jersey */}
          <path d="M10 64 C10 46 18 40 32 40 C46 40 54 46 54 64 Z" fill="url(#gkJersey)" stroke="#000" strokeWidth="2.5" />
          <path d="M26 40 L32 48 L38 40 Z" fill="#FDE68A" stroke="#000" strokeWidth="2" />
          {/* Goalkeeper Gloves on sides */}
          <rect x="5" y="44" width="13" height="17" rx="5" fill="url(#gkGlove)" stroke="#000" strokeWidth="2.2" />
          <path d="M8 48 L15 48 M8 53 L15 53" stroke="#000" strokeWidth="1.5" />
          <rect x="46" y="44" width="13" height="17" rx="5" fill="url(#gkGlove)" stroke="#000" strokeWidth="2.2" />
          <path d="M49 48 L56 48 M49 53 L56 53" stroke="#000" strokeWidth="1.5" />
          {/* Head & Neck */}
          <rect x="27" y="32" width="10" height="9" rx="3" fill="#F59E0B" stroke="#000" strokeWidth="2" />
          <circle cx="32" cy="27" r="13" fill="url(#gkSkin)" stroke="#000" strokeWidth="2.5" />
          {/* Ears */}
          <circle cx="18" cy="28" r="3.5" fill="#F59E0B" stroke="#000" strokeWidth="1.8" />
          <circle cx="46" cy="28" r="3.5" fill="#F59E0B" stroke="#000" strokeWidth="1.8" />
          {/* Sleek swept back hair */}
          <path d="M18 23 C18 11 25 8 32 8 C39 8 46 11 46 23 C42 19 36 17 32 17 C28 17 22 19 18 23 Z" fill="#78350F" stroke="#000" strokeWidth="2" />
          {/* Focused goalie eyes */}
          <ellipse cx="27" cy="26" rx="2.5" ry="2.2" fill="#000" />
          <circle cx="26" cy="25" r="0.8" fill="#FFF" />
          <ellipse cx="37" cy="26" rx="2.5" ry="2.2" fill="#000" />
          <circle cx="36" cy="25" r="0.8" fill="#FFF" />
          {/* Determined brow & mouth */}
          <path d="M24 21 L30 22.5" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          <path d="M40 21 L34 22.5" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          <path d="M28 32 H36" stroke="#000" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      )}

      {id === 'captain' && (
        // 3. CAPTAIN: Armband with 'C', navy kit with gold trim, confident leader
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cptBg" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <linearGradient id="cptSkin" x1="0" y1="16" x2="0" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="cptJersey" x1="0" y1="38" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" fill="url(#cptBg)" />
          {/* Jersey */}
          <path d="M12 64 C12 45 18 39 32 39 C46 39 52 45 52 64 Z" fill="url(#cptJersey)" stroke="#000" strokeWidth="2.5" />
          <path d="M25 39 L32 47 L39 39 Z" fill="#FBBF24" stroke="#000" strokeWidth="2" />
          {/* Captain Armband on left sleeve */}
          <rect x="10" y="48" width="10" height="9" rx="2" fill="#FFD700" stroke="#000" strokeWidth="2" />
          <text x="15" y="55" textAnchor="middle" fill="#000" fontSize="8" fontWeight="900">C</text>
          {/* Head & Neck */}
          <rect x="27" y="32" width="10" height="9" rx="3" fill="#D97706" stroke="#000" strokeWidth="2" />
          <circle cx="32" cy="26" r="13" fill="url(#cptSkin)" stroke="#000" strokeWidth="2.5" />
          {/* Ears */}
          <circle cx="18" cy="27" r="3.5" fill="#D97706" stroke="#000" strokeWidth="1.8" />
          <circle cx="46" cy="27" r="3.5" fill="#D97706" stroke="#000" strokeWidth="1.8" />
          {/* Hair & stylish short beard */}
          <path d="M18 21 C18 9 26 7 32 7 C38 7 46 9 46 21 C42 16 38 15 32 15 C26 15 22 16 18 21 Z" fill="#18181B" stroke="#000" strokeWidth="2" />
          <path d="M26 33 Q32 38 38 33 Q32 36 26 33 Z" fill="#18181B" opacity="0.8" />
          {/* Eyes */}
          <ellipse cx="27" cy="25" rx="2.2" ry="2.2" fill="#000" />
          <circle cx="26.5" cy="24" r="0.8" fill="#FFF" />
          <ellipse cx="37" cy="25" rx="2.2" ry="2.2" fill="#000" />
          <circle cx="36.5" cy="24" r="0.8" fill="#FFF" />
          {/* Captain confident smile */}
          <path d="M28 30 Q32 34 36 30" stroke="#000" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </svg>
      )}

      {id === 'winger' && (
        // 4. WINGER: Aerodynamic headband, electric cyan kit, lightning speed look
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="wngBg" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#083344" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="wngSkin" x1="0" y1="16" x2="0" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="wngJersey" x1="0" y1="38" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" fill="url(#wngBg)" />
          {/* Jersey */}
          <path d="M13 64 C13 46 19 40 32 40 C45 40 51 46 51 64 Z" fill="url(#wngJersey)" stroke="#000" strokeWidth="2.5" />
          <path d="M26 40 L32 47 L38 40 Z" fill="#B45309" stroke="#000" strokeWidth="2" />
          {/* Lightning stripe */}
          <path d="M30 48 L35 53 L32 55 L37 61" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Head & Neck */}
          <rect x="28" y="32" width="8" height="9" rx="2" fill="#78350F" stroke="#000" strokeWidth="2" />
          <circle cx="32" cy="26" r="12.5" fill="url(#wngSkin)" stroke="#000" strokeWidth="2.5" />
          {/* Ears */}
          <circle cx="19" cy="27" r="3" fill="#78350F" stroke="#000" strokeWidth="1.8" />
          <circle cx="45" cy="27" r="3" fill="#78350F" stroke="#000" strokeWidth="1.8" />
          {/* Hair & Red Headband */}
          <path d="M19 22 C19 10 26 7 32 7 C38 7 45 10 45 22 Z" fill="#18181B" stroke="#000" strokeWidth="2" />
          <rect x="19" y="16" width="26" height="5" rx="1.5" fill="#EF4444" stroke="#000" strokeWidth="1.8" />
          {/* Fast sharp eyes */}
          <ellipse cx="28" cy="26" rx="2" ry="2" fill="#000" />
          <circle cx="27.5" cy="25" r="0.7" fill="#FFF" />
          <ellipse cx="36" cy="26" rx="2" ry="2" fill="#000" />
          <circle cx="35.5" cy="25" r="0.7" fill="#FFF" />
          <path d="M29 31 Q32 34 35 31" stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      )}

      {id === 'defender' && (
        // 5. DEFENDER: Solid rock build, navy chevron kit, strong focused jaw
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="dfBg" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="dfSkin" x1="0" y1="16" x2="0" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="dfJersey" x1="0" y1="36" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#312E81" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" fill="url(#dfBg)" />
          {/* Wide sturdy shoulders */}
          <path d="M8 64 C8 43 16 38 32 38 C48 38 56 43 56 64 Z" fill="url(#dfJersey)" stroke="#000" strokeWidth="2.5" />
          <path d="M20 44 L32 52 L44 44" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Thick neck & strong jaw */}
          <rect x="25" y="30" width="14" height="11" rx="3" fill="#B45309" stroke="#000" strokeWidth="2" />
          <path d="M20 24 C20 16 25 13 32 13 C39 13 44 16 44 24 C44 32 39 35 32 35 C25 35 20 32 20 24 Z" fill="url(#dfSkin)" stroke="#000" strokeWidth="2.5" />
          {/* Buzz cut hair */}
          <path d="M20 21 C20 14 25 11 32 11 C39 11 44 14 44 21 C41 18 36 17 32 17 C28 17 23 18 20 21 Z" fill="#27272A" stroke="#000" strokeWidth="1.8" />
          {/* Unshakable eyes & brow */}
          <path d="M23 20 L29 21.5" stroke="#000" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M41 20 L35 21.5" stroke="#000" strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="26" cy="24" rx="2" ry="2" fill="#000" />
          <ellipse cx="38" cy="24" rx="2" ry="2" fill="#000" />
          <path d="M28 30 H36" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )}

      {id === 'midfielder' && (
        // 6. MIDFIELDER: Classic red kit with collar, vision maestro, elegant style
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mfBg" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#450a0a" />
              <stop offset="100%" stopColor="#1c1917" />
            </linearGradient>
            <linearGradient id="mfSkin" x1="0" y1="16" x2="0" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FED7AA" />
              <stop offset="100%" stopColor="#FDBA74" />
            </linearGradient>
            <linearGradient id="mfJersey" x1="0" y1="38" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" fill="url(#mfBg)" />
          {/* Jersey with classic collar */}
          <path d="M12 64 C12 46 18 40 32 40 C46 40 52 46 52 64 Z" fill="url(#mfJersey)" stroke="#000" strokeWidth="2.5" />
          {/* White collar flaps */}
          <polygon points="25,40 32,48 29,48 22,40" fill="#FFFFFF" stroke="#000" strokeWidth="1.8" />
          <polygon points="39,40 32,48 35,48 42,40" fill="#FFFFFF" stroke="#000" strokeWidth="1.8" />
          {/* Neck & Head */}
          <rect x="27" y="32" width="10" height="9" rx="3" fill="#FDBA74" stroke="#000" strokeWidth="2" />
          <circle cx="32" cy="26" r="13" fill="url(#mfSkin)" stroke="#000" strokeWidth="2.5" />
          {/* Wavy styled maestro hair */}
          <path d="M18 23 C18 10 25 7 32 7 C39 7 46 10 46 23 C42 18 36 16 32 16 C28 16 22 18 18 23 Z" fill="#451A03" stroke="#000" strokeWidth="2" />
          <path d="M22 10 Q26 6 30 9 Q35 5 40 9" stroke="#451A03" strokeWidth="3" fill="none" />
          {/* Intelligent playmaker eyes */}
          <ellipse cx="27" cy="25" rx="2" ry="2.2" fill="#000" />
          <circle cx="26.5" cy="24" r="0.8" fill="#FFF" />
          <ellipse cx="37" cy="25" rx="2" ry="2.2" fill="#000" />
          <circle cx="36.5" cy="24" r="0.8" fill="#FFF" />
          <path d="M28 31 Q32 34 36 31" stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      )}

      {id === 'freekick' && (
        // 7. FREE KICK SPECIALIST: Emerald kit, curve master, laser-focus
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="fkBg" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="100%" stopColor="#022c22" />
            </linearGradient>
            <linearGradient id="fkSkin" x1="0" y1="16" x2="0" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="fkJersey" x1="0" y1="38" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" fill="url(#fkBg)" />
          {/* Jersey */}
          <path d="M12 64 C12 46 18 40 32 40 C46 40 52 46 52 64 Z" fill="url(#fkJersey)" stroke="#000" strokeWidth="2.5" />
          <path d="M25 40 L32 48 L39 40 Z" fill="#FCD34D" stroke="#000" strokeWidth="2" />
          {/* Mini ball badge on chest */}
          <circle cx="32" cy="55" r="4.5" fill="#FFFFFF" stroke="#000" strokeWidth="1.5" />
          <polygon points="32,53 30.5,54 31,56 33,56 33.5,54" fill="#000" />
          {/* Head & Neck */}
          <rect x="27" y="32" width="10" height="9" rx="3" fill="#D97706" stroke="#000" strokeWidth="2" />
          <circle cx="32" cy="26" r="13" fill="url(#fkSkin)" stroke="#000" strokeWidth="2.5" />
          {/* Modern fade haircut */}
          <path d="M18 22 C18 10 25 7 32 7 C39 7 46 10 46 22 C42 17 37 15 32 15 C27 15 22 17 18 22 Z" fill="#18181B" stroke="#000" strokeWidth="2" />
          {/* Laser-focus squint */}
          <path d="M24 22 L30 23.5" stroke="#000" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M40 22 L34 23.5" stroke="#000" strokeWidth="2.2" strokeLinecap="round" />
          <ellipse cx="27" cy="25.5" rx="2" ry="1.4" fill="#000" />
          <ellipse cx="37" cy="25.5" rx="2" ry="1.4" fill="#000" />
          <path d="M28 32 Q32 35 36 32" stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      )}

      {id === 'legend' && (
        // 8. GOLDEN LEGEND: Gold and black kit, golden crown/halo sheen, timeless prestige
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lgdBg" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>
            <linearGradient id="lgdGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
            <linearGradient id="lgdSkin" x1="0" y1="16" x2="0" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" fill="url(#lgdBg)" />
          {/* Golden halo ring behind head */}
          <circle cx="32" cy="26" r="17" stroke="url(#lgdGold)" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
          {/* Luxury gold & black jersey */}
          <path d="M12 64 C12 45 18 39 32 39 C46 39 52 45 52 64 Z" fill="#18181B" stroke="#000" strokeWidth="2.5" />
          <path d="M22 64 L22 43 M42 64 L42 43" stroke="url(#lgdGold)" strokeWidth="3" />
          <path d="M25 39 L32 47 L39 39 Z" fill="url(#lgdGold)" stroke="#000" strokeWidth="2" />
          {/* Star badge on chest */}
          <path d="M32 50 L33.5 53.5 L37 54 L34.5 56.5 L35 60 L32 58 L29 60 L29.5 56.5 L27 54 L30.5 53.5 Z" fill="url(#lgdGold)" stroke="#000" strokeWidth="1" />
          {/* Head & Neck */}
          <rect x="27" y="32" width="10" height="9" rx="3" fill="#F59E0B" stroke="#000" strokeWidth="2" />
          <circle cx="32" cy="26" r="13" fill="url(#lgdSkin)" stroke="#000" strokeWidth="2.5" />
          {/* Iconic classic parted hair */}
          <path d="M18 21 C18 9 26 6 32 6 C38 6 46 9 46 21 C42 16 38 14 32 14 C26 14 22 16 18 21 Z" fill="#27272A" stroke="#000" strokeWidth="2" />
          {/* Majestic eyes */}
          <ellipse cx="27" cy="25" rx="2.2" ry="2.2" fill="#000" />
          <circle cx="26.5" cy="24" r="0.8" fill="#FFF" />
          <ellipse cx="37" cy="25" rx="2.2" ry="2.2" fill="#000" />
          <circle cx="36.5" cy="24" r="0.8" fill="#FFF" />
          <path d="M28 31 Q32 35 36 31" stroke="#000" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </svg>
      )}

      {id === 'wonderkid' && (
        // 9. WONDERKID: Rising young star, bright energetic orange kit, youthful smile
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="wkBg" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#431407" />
              <stop offset="100%" stopColor="#7c2d12" />
            </linearGradient>
            <linearGradient id="wkSkin" x1="0" y1="16" x2="0" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FED7AA" />
              <stop offset="100%" stopColor="#FB923C" />
            </linearGradient>
            <linearGradient id="wkJersey" x1="0" y1="38" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="50%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" fill="url(#wkBg)" />
          {/* Jersey */}
          <path d="M13 64 C13 46 19 41 32 41 C45 41 51 46 51 64 Z" fill="url(#wkJersey)" stroke="#000" strokeWidth="2.5" />
          <path d="M26 41 L32 47 L38 41 Z" fill="#FED7AA" stroke="#000" strokeWidth="2" />
          {/* Young face shape */}
          <rect x="28" y="33" width="8" height="9" rx="2" fill="#FB923C" stroke="#000" strokeWidth="2" />
          <circle cx="32" cy="27" r="12" fill="url(#wkSkin)" stroke="#000" strokeWidth="2.5" />
          {/* Frosted tip hair */}
          <path d="M19 23 C19 12 25 8 32 8 C39 8 45 12 45 23 C42 19 37 17 32 17 C27 17 22 19 19 23 Z" fill="#78350F" stroke="#000" strokeWidth="2" />
          <path d="M27 9 L32 5 L37 9" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" />
          {/* Big bright youthful eyes */}
          <circle cx="27" cy="26" r="2.5" fill="#000" />
          <circle cx="26" cy="25" r="1" fill="#FFF" />
          <circle cx="37" cy="26" r="2.5" fill="#000" />
          <circle cx="36" cy="25" r="1" fill="#FFF" />
          {/* Joyful grin */}
          <path d="M27 31 Q32 37 37 31 Z" fill="#FFFFFF" stroke="#000" strokeWidth="1.8" />
        </svg>
      )}

      {id === 'fanfavorite' && (
        // 10. FAN FAVORITE: Cool afro hairstyle, purple kit, superstar flair
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ffBg" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2e1065" />
              <stop offset="100%" stopColor="#581c87" />
            </linearGradient>
            <linearGradient id="ffSkin" x1="0" y1="16" x2="0" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>
            <linearGradient id="ffJersey" x1="0" y1="38" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#6D28D9" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" fill="url(#ffBg)" />
          {/* Jersey */}
          <path d="M12 64 C12 46 18 40 32 40 C46 40 52 46 52 64 Z" fill="url(#ffJersey)" stroke="#000" strokeWidth="2.5" />
          <path d="M26 40 L32 47 L38 40 Z" fill="#78350F" stroke="#000" strokeWidth="2" />
          {/* Big iconic Afro hair silhouette */}
          <circle cx="32" cy="23" r="18" fill="#18181B" stroke="#000" strokeWidth="2.2" />
          {/* Head & Neck */}
          <rect x="27" y="32" width="10" height="9" rx="3" fill="#451A03" stroke="#000" strokeWidth="2" />
          <circle cx="32" cy="27" r="12" fill="url(#ffSkin)" stroke="#000" strokeWidth="2.2" />
          {/* Yellow sporty headband */}
          <path d="M20 22 C23 20 27 19 32 19 C37 19 41 20 44 22" stroke="#FACC15" strokeWidth="3.5" strokeLinecap="round" />
          {/* Charismatic eyes & smile */}
          <ellipse cx="27" cy="26" rx="2" ry="2.2" fill="#000" />
          <circle cx="26.5" cy="25" r="0.8" fill="#FFF" />
          <ellipse cx="37" cy="26" rx="2" ry="2.2" fill="#000" />
          <circle cx="36.5" cy="25" r="0.8" fill="#FFF" />
          {/* Big winning smile */}
          <path d="M27 32 Q32 37 37 32 Z" fill="#FFFFFF" stroke="#000" strokeWidth="1.8" />
        </svg>
      )}
    </div>
  );
};
