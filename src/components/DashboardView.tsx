import React, { useState } from 'react';
import { UserProfile, GameModeType } from '../types/football.ts';
import {
  Play,
  Zap,
  Users,
  Trophy,
  KeyRound,
  ArrowRight,
  Shield,
  BookOpen,
  Calendar,
  Sparkles,
  HelpCircle,
  Clock,
  Swords,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { playClickSound, playWhistleSound } from '../services/sound.ts';
import { useTranslation } from '../context/LanguageContext.tsx';

interface DashboardViewProps {
  user: UserProfile;
  onOpenCreateRoom: (mode?: GameModeType) => void;
  onOpenJoinRoom: () => void;
  onQuickMatch: (mode: GameModeType) => void;
  onOpenFriends: () => void;
  onOpenLeaderboard: () => void;
  onOpenProfile: () => void;
  onJoinWithCode?: (code: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onOpenCreateRoom,
  onOpenJoinRoom,
  onQuickMatch,
  onOpenFriends,
  onOpenLeaderboard,
  onOpenProfile,
  onJoinWithCode,
}) => {
  const { t, isRTL } = useTranslation();
  const [quickCode, setQuickCode] = useState('');

  const handleQuickJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCode.trim()) return;
    playClickSound();
    playWhistleSound();
    if (onJoinWithCode) {
      onJoinWithCode(quickCode.trim().toUpperCase());
    } else {
      onOpenJoinRoom();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 animate-fade-in">
      {/* ---------------- CONCEPT 1: HERO SECTION ---------------- */}
      <section className="relative rounded-3xl bg-[#111512]/90 border border-[#29312B] overflow-hidden shadow-2xl">
        {/* Subtle radial stadium lights in the dark background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#B7F34A]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-80 h-80 bg-[#171D19] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
          {/* Left Column: Headlines, CTA, and Metrics (Cols 7 on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F5F5F0] tracking-tight leading-tight">
                {t.heroTitle1}{' '}
                <span className="block text-[#B7F34A] drop-shadow-[0_0_24px_rgba(183,243,74,0.35)]">
                  {t.heroTitle2}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-[#A1AAA2] max-w-xl leading-relaxed pt-2">
                {t.heroSubtitle}
              </p>
            </div>

            {/* CTA Buttons (Concept 1: Primary Electric Green Pill) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  playClickSound();
                  playWhistleSound();
                  onQuickMatch('two_clubs');
                }}
                className="btn-electric px-8 py-3.5 text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <span>{t.heroCtaPlay}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  onOpenCreateRoom();
                }}
                className="btn-secondary px-6 py-3.5 text-sm uppercase tracking-wider cursor-pointer"
              >
                {t.heroCtaCreate}
              </button>
            </div>

            {/* Metrics Strip (Concept 1: Players Online 2.4K, Rooms Active 486, Total Games 12.8K) */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#29312B]/80 max-w-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#171D19] border border-[#29312B] flex items-center justify-center text-[#B7F34A] shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black text-[#F5F5F0] font-mono leading-none">
                    2.4K
                  </div>
                  <div className="text-[11px] text-[#A1AAA2] font-medium pt-1">
                    {t.metricOnline}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#171D19] border border-[#29312B] flex items-center justify-center text-[#B7F34A] shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black text-[#F5F5F0] font-mono leading-none">
                    486
                  </div>
                  <div className="text-[11px] text-[#A1AAA2] font-medium pt-1">
                    {t.metricRooms}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#171D19] border border-[#29312B] flex items-center justify-center text-[#B7F34A] shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black text-[#F5F5F0] font-mono leading-none">
                    12.8K
                  </div>
                  <div className="text-[11px] text-[#A1AAA2] font-medium pt-1">
                    {t.metricGames}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Stadium Ball (Concept 1 right asset) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden border border-[#29312B] shadow-2xl group">
              <img
                src="/src/assets/images/hero_football_stadium_1793383400900.jpg"
                alt="Football Arena"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/90 via-[#080A09]/20 to-transparent" />
              
              {/* Badge overlay on image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111512]/90 border border-[#29312B] backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#B7F34A] shadow-[0_0_8px_#B7F34A]" />
                  <span className="text-[#F5F5F0] font-semibold text-[11px]">Season 1 Live Matchmaking</span>
                </div>
                <span className="text-[#D6BD83] font-mono font-bold text-[11px]">
                  #FIFA_DATA_VERIFIED
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CONCEPT 1: POPULAR CATEGORIES ---------------- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-[#F5F5F0] tracking-wide">
            {t.popularCategories}
          </h2>
          <button
            onClick={() => onOpenCreateRoom()}
            className="text-xs font-semibold text-[#A1AAA2] hover:text-[#B7F34A] flex items-center gap-1 transition cursor-pointer"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Category 1: Clubs (Two Clubs Mode) */}
          <div
            onClick={() => {
              playClickSound();
              onQuickMatch('two_clubs');
            }}
            className="glass-card-interactive p-4 sm:p-5 rounded-2xl cursor-pointer flex flex-col justify-between text-left group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#171D19] border border-[#29312B] group-hover:border-[#B7F34A]/50 flex items-center justify-center text-[#B7F34A] mb-3 transition">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#F5F5F0] text-sm group-hover:text-[#B7F34A] transition">
                {t.catClubs}
              </h3>
              <p className="text-[11px] text-[#A1AAA2] mt-1 leading-snug line-clamp-2">
                {t.catClubsDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#29312B]/60 flex items-center justify-between text-[11px] font-semibold text-[#B7F34A]">
              <span>Mode 1</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Category 2: Players (Shirt History Mode) */}
          <div
            onClick={() => {
              playClickSound();
              onQuickMatch('shirt_history');
            }}
            className="glass-card-interactive p-4 sm:p-5 rounded-2xl cursor-pointer flex flex-col justify-between text-left group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#171D19] border border-[#29312B] group-hover:border-[#B7F34A]/50 flex items-center justify-center text-[#B7F34A] mb-3 transition">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#F5F5F0] text-sm group-hover:text-[#B7F34A] transition">
                {t.catPlayers}
              </h3>
              <p className="text-[11px] text-[#A1AAA2] mt-1 leading-snug line-clamp-2">
                {t.catPlayersDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#29312B]/60 flex items-center justify-between text-[11px] font-semibold text-[#B7F34A]">
              <span>Mode 2</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Category 3: Competitions */}
          <div
            onClick={() => {
              playClickSound();
              onOpenCreateRoom('two_clubs');
            }}
            className="glass-card-interactive p-4 sm:p-5 rounded-2xl cursor-pointer flex flex-col justify-between text-left group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#171D19] border border-[#29312B] group-hover:border-[#D6BD83]/50 flex items-center justify-center text-[#D6BD83] mb-3 transition">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#F5F5F0] text-sm group-hover:text-[#D6BD83] transition">
                {t.catCompetitions}
              </h3>
              <p className="text-[11px] text-[#A1AAA2] mt-1 leading-snug line-clamp-2">
                {t.catCompetitionsDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#29312B]/60 flex items-center justify-between text-[11px] font-semibold text-[#D6BD83]">
              <span>Cups & UCL</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Category 4: History & Legends */}
          <div
            onClick={() => {
              playClickSound();
              onOpenCreateRoom('shirt_history');
            }}
            className="glass-card-interactive p-4 sm:p-5 rounded-2xl cursor-pointer flex flex-col justify-between text-left group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#171D19] border border-[#29312B] group-hover:border-[#B7F34A]/50 flex items-center justify-center text-[#B7F34A] mb-3 transition">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#F5F5F0] text-sm group-hover:text-[#B7F34A] transition">
                {t.catHistory}
              </h3>
              <p className="text-[11px] text-[#A1AAA2] mt-1 leading-snug line-clamp-2">
                {t.catHistoryDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#29312B]/60 flex items-center justify-between text-[11px] font-semibold text-[#B7F34A]">
              <span>Timeline</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Category 5: General Trivia */}
          <div
            onClick={() => {
              playClickSound();
              onQuickMatch('two_clubs');
            }}
            className="glass-card-interactive p-4 sm:p-5 rounded-2xl cursor-pointer flex flex-col justify-between text-left group col-span-2 sm:col-span-1"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#171D19] border border-[#29312B] group-hover:border-[#B7F34A]/50 flex items-center justify-center text-[#B7F34A] mb-3 transition">
                <span className="text-xl">⚽</span>
              </div>
              <h3 className="font-bold text-[#F5F5F0] text-sm group-hover:text-[#B7F34A] transition">
                {t.catGeneral}
              </h3>
              <p className="text-[11px] text-[#A1AAA2] mt-1 leading-snug line-clamp-2">
                {t.catGeneralDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#29312B]/60 flex items-center justify-between text-[11px] font-semibold text-[#B7F34A]">
              <span>Mixed Lore</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- QUICK ROOM ENTRY & CREATION HUB ---------------- */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Quick Join Card (Cols 5) */}
        <div className="md:col-span-5 glass-panel p-5 sm:p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="w-4 h-4 text-[#B7F34A]" />
              <h3 className="font-bold text-[#F5F5F0] text-sm uppercase tracking-wider">
                {t.quickJoinTitle}
              </h3>
            </div>
            <p className="text-xs text-[#A1AAA2]">
              {t.quickJoinDesc}
            </p>
          </div>

          <form onSubmit={handleQuickJoinSubmit} className="mt-5 flex gap-2">
            <input
              type="text"
              value={quickCode}
              onChange={(e) => setQuickCode(e.target.value.toUpperCase())}
              maxLength={6}
              placeholder={t.quickJoinPlaceholder}
              className="flex-1 bg-[#171D19] border border-[#29312B] focus:border-[#B7F34A] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono tracking-widest text-center text-[#F5F5F0] uppercase focus:outline-none transition"
            />
            <button
              type="submit"
              className="btn-electric px-5 py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              {t.quickJoinBtn}
            </button>
          </form>
        </div>

        {/* Custom Match & Friends Hub (Cols 7) */}
        <div className="md:col-span-7 glass-panel p-5 sm:p-6 rounded-3xl grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => {
              playClickSound();
              onOpenCreateRoom();
            }}
            className="p-4 rounded-2xl bg-[#171D19]/60 hover:bg-[#171D19] border border-[#29312B] hover:border-[#B7F34A]/50 transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#111512] border border-[#29312B] flex items-center justify-center text-[#B7F34A] mb-2.5 group-hover:scale-105 transition">
              <Swords className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-[#F5F5F0] text-xs uppercase tracking-wider group-hover:text-[#B7F34A] transition">
              {t.heroCtaCreate}
            </h4>
            <p className="text-[11px] text-[#A1AAA2] mt-1">
              Select questions, difficulty, timer & hints.
            </p>
          </div>

          <div
            onClick={() => {
              playClickSound();
              onOpenFriends();
            }}
            className="p-4 rounded-2xl bg-[#171D19]/60 hover:bg-[#171D19] border border-[#29312B] hover:border-[#B7F34A]/50 transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#111512] border border-[#29312B] flex items-center justify-center text-[#B7F34A] mb-2.5 group-hover:scale-105 transition">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-[#F5F5F0] text-xs uppercase tracking-wider group-hover:text-[#B7F34A] transition">
              {t.friendsTitle}
            </h4>
            <p className="text-[11px] text-[#A1AAA2] mt-1">
              View online rivals and send instant match invites.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
