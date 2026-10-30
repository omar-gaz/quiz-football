import React, { useState } from 'react';
import { UserProfile } from '../types/football.ts';
import { Volume2, VolumeX, Shield, LogOut, Trophy, Users, Globe, ChevronDown, Gamepad2 } from 'lucide-react';
import { isAudioMuted, toggleAudioMute, playClickSound } from '../services/sound.ts';
import { useTranslation } from '../context/LanguageContext.tsx';

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
  const [muted, setMuted] = useState(isAudioMuted());
  const { language, setLanguage, t, isRTL } = useTranslation();

  const handleToggleMute = () => {
    const next = toggleAudioMute();
    setMuted(next);
    if (!next) playClickSound();
  };

  const handleLanguageToggle = () => {
    playClickSound();
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080A09]/90 backdrop-blur-xl border-b border-[#29312B] px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo (Matches Concept 1) */}
        <div
          className="flex items-center gap-3 cursor-pointer shrink-0 select-none group"
          onClick={() => {
            playClickSound();
            onNavigateHome?.();
          }}
        >
          <div className="w-8 h-8 rounded-full bg-[#171D19] border border-[#29312B] group-hover:border-[#B7F34A] flex items-center justify-center shadow-[0_0_15px_rgba(183,243,74,0.15)] transition">
            <span className="text-base">⚽</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-wider text-white text-base sm:text-lg uppercase flex items-center gap-1.5">
              <span>PITCH</span>
              <span className="text-[#B7F34A]">TRIVIA</span>
            </span>
          </div>
        </div>

        {/* Center Nav Links (Concept 1: Home, Rooms, Leaderboard) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#A1AAA2]">
          <button
            onClick={() => {
              playClickSound();
              onNavigateHome?.();
            }}
            className={`transition-colors cursor-pointer py-1 relative ${
              activeView === 'home'
                ? 'text-[#F5F5F0] font-bold'
                : 'hover:text-[#F5F5F0]'
            }`}
          >
            {t.navHome}
            {activeView === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B7F34A] rounded-full shadow-[0_0_8px_#B7F34A]" />
            )}
          </button>

          <button
            onClick={() => {
              playClickSound();
              onNavigateRooms?.();
            }}
            className={`transition-colors cursor-pointer py-1 relative ${
              activeView === 'rooms'
                ? 'text-[#F5F5F0] font-bold'
                : 'hover:text-[#F5F5F0]'
            }`}
          >
            {t.navRooms}
            {activeView === 'rooms' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B7F34A] rounded-full shadow-[0_0_8px_#B7F34A]" />
            )}
          </button>

          <button
            onClick={() => {
              playClickSound();
              onOpenLeaderboard();
            }}
            className={`transition-colors cursor-pointer py-1 relative ${
              activeView === 'leaderboard'
                ? 'text-[#F5F5F0] font-bold'
                : 'hover:text-[#F5F5F0]'
            }`}
          >
            {t.navLeaderboard}
            {activeView === 'leaderboard' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B7F34A] rounded-full shadow-[0_0_8px_#B7F34A]" />
            )}
          </button>

          {user && (
            <button
              onClick={() => {
                playClickSound();
                onOpenFriends();
              }}
              className="hover:text-[#F5F5F0] transition-colors cursor-pointer py-1"
            >
              {t.navFriends}
            </button>
          )}
        </nav>

        {/* Right Zone: Language, Sound, Admin & User Profile Capsule */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher (EN / عربي) */}
          <button
            onClick={handleLanguageToggle}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#111512] border border-[#29312B] hover:border-[#B7F34A]/50 text-xs font-bold text-[#A1AAA2] hover:text-[#F5F5F0] transition cursor-pointer"
            title="Toggle Language (English / العربية)"
          >
            <Globe className="w-3.5 h-3.5 text-[#B7F34A]" />
            <span className="tracking-wider">{language === 'en' ? 'عربي' : 'EN'}</span>
          </button>

          {/* Sound Mute/Unmute */}
          <button
            onClick={handleToggleMute}
            className="p-2 rounded-full bg-[#111512] border border-[#29312B] text-[#A1AAA2] hover:text-[#F5F5F0] hover:border-[#B7F34A]/40 transition cursor-pointer"
            title={muted ? t.soundOff : t.soundOn}
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#B7F34A]" />}
          </button>

          {/* Admin Question Manager */}
          <button
            onClick={() => {
              playClickSound();
              onOpenAdmin();
            }}
            className="p-2 rounded-full bg-[#111512] border border-[#29312B] text-[#A1AAA2] hover:text-[#D6BD83] hover:border-[#D6BD83]/40 transition cursor-pointer"
            title={t.navAdmin}
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* User Profile Capsule (Concept 1: Circular glowing avatar + points) */}
          {user ? (
            <div className="flex items-center gap-2">
              <div
                onClick={() => {
                  playClickSound();
                  onOpenProfile();
                }}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-[#111512] border border-[#29312B] hover:border-[#B7F34A]/60 cursor-pointer transition group"
              >
                <div className="relative w-7 h-7 rounded-full bg-[#171D19] border border-[#B7F34A]/40 flex items-center justify-center text-sm shadow-[0_0_8px_rgba(183,243,74,0.25)]">
                  {user.avatar || '⚽'}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#B7F34A]" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-[#F5F5F0] group-hover:text-[#B7F34A] transition truncate max-w-[90px]">
                    {user.displayName || user.username}
                  </p>
                  <p className="text-[10px] text-[#D6BD83] font-mono font-semibold">
                    {user.totalPoints.toLocaleString()} {t.pts}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  playClickSound();
                  onLogout();
                }}
                className="p-2 rounded-full bg-[#111512] border border-[#29312B] text-[#A1AAA2] hover:text-red-400 hover:border-red-500/40 transition cursor-pointer"
                title={t.navSignOut}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
