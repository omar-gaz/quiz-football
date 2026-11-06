import React from 'react';
import { UserProfile } from '../types/football.ts';
import { playClickSound } from '../services/sound.ts';
import { useTranslation } from '../context/LanguageContext.tsx';
import {
  IconFootball,
  IconFootballPitch,
  IconFootballJersey,
  IconFootballTrophy,
  IconFootballPlayers,
  IconVARScreen,
} from './Football3DIcons.tsx';
import { PlayerCharacterAvatar } from './PlayerCharacterAvatar.tsx';
import { ThemeToggle } from './ThemeToggle.tsx';

interface NavbarProps {
  user: UserProfile | null;
  onOpenProfile: () => void;
  onOpenFriends: () => void;
  onOpenLeaderboard: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
  onNavigateHome?: () => void;
  onNavigateRooms?: () => void;
  activeView?: 'home' | 'rooms' | 'leaderboard';
  activeRoomCode?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenProfile,
  onOpenFriends,
  onOpenLeaderboard,
  onOpenAdmin,
  onLogout,
  onNavigateHome,
  onNavigateRooms,
  activeView,
}) => {
  const { language, setLanguage, t } = useTranslation();

  const handleLanguageToggle = () => {
    playClickSound();
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const navBtnBase =
    "h-9 px-3 border-2 border-black shadow-[2px_2px_0px_#000000] text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer select-none hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000000]";

  return (
    <header className="sticky top-0 z-40 bg-[#16213E] border-b-[4px] border-black shadow-[0_4px_0px_#000000] px-3 sm:px-6 py-2 transition-all text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none group"
          onClick={() => {
            playClickSound();
            onNavigateHome?.();
          }}
        >
          <div className="w-9 h-9 bg-[#00B140] border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-transform">
            <IconFootball className="w-5 h-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading font-black tracking-tight text-white text-lg sm:text-xl uppercase flex items-center gap-1">
              <span>PITCH</span>
              <span className="bg-[#FFD700] px-1.5 py-0.5 border-2 border-black text-black">TRIVIA</span>
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-2 text-xs font-black uppercase">
          <button
            onClick={() => {
              playClickSound();
              onNavigateHome?.();
            }}
            className={`${navBtnBase} ${
              activeView === 'home'
                ? 'bg-[#00B140] text-white'
                : 'bg-[#0F3460] text-white hover:bg-[#1A1A2E]'
            }`}
          >
            <IconFootballPitch className="w-4 h-4" />
            <span>{t.navHome}</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onNavigateRooms?.();
            }}
            className={`${navBtnBase} ${
              activeView === 'rooms'
                ? 'bg-[#00B140] text-white'
                : 'bg-[#0F3460] text-white hover:bg-[#1A1A2E]'
            }`}
          >
            <IconFootballJersey className="w-4 h-4" />
            <span>{t.navRooms}</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onOpenLeaderboard();
            }}
            className={`${navBtnBase} ${
              activeView === 'leaderboard'
                ? 'bg-[#00B140] text-white'
                : 'bg-[#0F3460] text-white hover:bg-[#1A1A2E]'
            }`}
          >
            <IconFootballTrophy className="w-4 h-4" />
            <span>{t.navLeaderboard}</span>
          </button>

          {user && (
            <button
              onClick={() => {
                playClickSound();
                onOpenFriends();
              }}
              className={`${navBtnBase} bg-[#0F3460] text-white hover:bg-[#00B140]`}
            >
              <IconFootballPlayers className="w-4 h-4" />
              <span>{t.navFriends}</span>
            </button>
          )}
        </nav>

        {/* Right Zone: Separator line + Actions (Language, Admin & User Profile & EXIT) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Visible Separator Line between nav links and action buttons */}
          <div className="hidden md:block h-6 w-[2px] bg-black shadow-[1px_0px_0px_rgba(255,255,255,0.15)] mx-1" />

          {/* Theme Toggle (Dark / Light) */}
          <ThemeToggle />

          {/* Language Switcher */}
          <button
            onClick={handleLanguageToggle}
            className={`${navBtnBase} bg-[#0F3460] text-white hover:bg-[#00B140]`}
            title="Toggle Language (English / العربية)"
          >
            <span className="text-sm">🌐</span>
            <span>{language === 'en' ? 'عربي' : 'EN'}</span>
          </button>

          {/* Admin Question Manager (VAR) */}
          <button
            onClick={() => {
              playClickSound();
              onOpenAdmin();
            }}
            className={`${navBtnBase} bg-[#0F3460] text-white hover:bg-[#FFD700] hover:text-black`}
            title={t.navAdmin}
          >
            <IconVARScreen className="w-4 h-4" />
            <span className="hidden sm:inline">VAR</span>
          </button>

          {/* User Profile & EXIT */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playClickSound();
                  onOpenProfile();
                }}
                className={`${navBtnBase} bg-[#0F3460] text-white hover:bg-[#16213E]`}
              >
                <div className="w-5 h-5 bg-[#16213E] border border-black flex items-center justify-center overflow-hidden">
                  <PlayerCharacterAvatar avatarId={user.avatar} className="w-full h-full" />
                </div>
                <div className="text-left hidden sm:flex items-center gap-1.5 leading-none">
                  <span className="truncate max-w-[80px]">
                    {user.displayName || user.username}
                  </span>
                  <span className="text-[#FFD700] font-mono text-[11px]">
                    {user.totalPoints.toLocaleString()} {t.pts}
                  </span>
                </div>
              </button>

              {/* Styled EXIT Button matching the nav button style */}
              <button
                onClick={() => {
                  playClickSound();
                  onLogout();
                }}
                className={`${navBtnBase} bg-[#CC0000] hover:bg-[#AA0000] text-white`}
                title={t.navSignOut}
              >
                <span className="font-mono text-sm leading-none">✕</span>
                <span>{language === 'ar' ? 'خروج' : 'EXIT'}</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
