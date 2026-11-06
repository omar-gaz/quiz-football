import React, { useState } from 'react';
import { UserProfile, GameModeType } from '../types/football.ts';
import { playClickSound } from '../services/sound.ts';
import { useTranslation } from '../context/LanguageContext.tsx';
import {
  IconFootball,
  IconFootballPitch,
  IconFootballJersey,
  IconFootballTrophy,
  IconFootballPlayers,
  IconTacticalClipboard,
  Football3DBadge,
} from './Football3DIcons.tsx';

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
  onOpenCreateRoom,
  onOpenJoinRoom,
  onOpenFriends,
  onJoinWithCode,
}) => {
  const { t, isRTL } = useTranslation();
  const [quickCode, setQuickCode] = useState('');
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  const handleQuickJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCode.trim()) return;
    playClickSound();
    if (onJoinWithCode) {
      onJoinWithCode(quickCode.trim().toUpperCase());
    } else {
      onOpenJoinRoom();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in relative text-white">
      {/* Locked mode alert banner */}
      {lockedNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-[#FFD700] text-black border-[3.5px] border-black text-xs font-black uppercase shadow-[6px_6px_0px_#000000] flex items-center gap-3 animate-bounce">
          <span className="text-base">🔒</span>
          <span>{lockedNotice}</span>
          <button
            onClick={() => setLockedNotice(null)}
            className="ml-2 px-1.5 py-0.5 bg-black text-white hover:bg-[#CC0000] text-xs font-black cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ---------------- NEO-BRUTALISM HERO BANNER ---------------- */}
      <section className="relative bg-[#0F3460] border-[4px] border-black shadow-[8px_8px_0px_#000000] overflow-hidden text-white">
        {/* Top stark ticker strip */}
        <div className="bg-[#16213E] text-[#FFD700] px-4 py-2 border-b-[3.5px] border-black font-black text-xs tracking-wider flex items-center justify-between uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#00B140] border border-black inline-block" />
            <span>SEASON 1 • MULTIPLAYER FOOTBALL ARENA</span>
          </div>
          <span className="hidden sm:inline bg-[#FFD700] text-black px-2 py-0.5 font-black text-[10px]">
            OFFICIAL LIVE MATCHMAKING
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-10">
          {/* Left Column: Headlines & CTA with dark overlay for readability (Balanced 6 cols) */}
          <div className="lg:col-span-6">
            <div className="bg-black/25 backdrop-blur-[2px] p-6 sm:p-7 border-2 border-black/50 shadow-[4px_4px_0px_#000000] space-y-5">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-[#00B140] text-white border-2 border-black px-3 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_#000000]">
                  <IconFootball className="w-4 h-4" />
                  <span>ULTIMATE SOCCER KNOWLEDGE CLASH</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-[1.05]">
                  {t.heroTitle1}{' '}
                  <span className="inline-block bg-[#00B140] px-2 py-0.5 border-[3px] border-black shadow-[4px_4px_0px_#000000] text-white my-1">
                    {t.heroTitle2}
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-[#B0BEC5] font-bold max-w-xl leading-relaxed pt-1">
                  {t.heroSubtitle}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  onClick={() => {
                    playClickSound();
                    onOpenCreateRoom();
                  }}
                  className="neo-btn-green px-7 py-3 text-sm uppercase tracking-wider flex items-center gap-2"
                >
                  <IconFootballPitch className="w-5 h-5" />
                  <span>{t.heroCtaPlay}</span>
                  <span>{isRTL ? '←' : '→'}</span>
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    onOpenCreateRoom();
                  }}
                  className="neo-btn-secondary px-6 py-3 text-sm uppercase tracking-wider flex items-center gap-2"
                >
                  <IconTacticalClipboard className="w-5 h-5" />
                  <span>{t.heroCtaCreate}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Original Match Poster / Stadium Panel */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="w-full max-w-md bg-[#16213E] border-[4px] border-black shadow-[6px_6px_0px_#000000] p-3.5 relative group">
              <div className="relative aspect-video lg:aspect-[4/3] border-[3px] border-black overflow-hidden bg-[#0F3460]">
                <img
                  src="/assets/psg_arsenal_preview.jpg"
                  alt="PSG vs Arsenal Stadium Match Preview"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://i.ibb.co/PvpcdwR3/PSG-ARSENAL-TV-ADS.jpg';
                  }}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute top-2 left-2 bg-[#00B140] text-white border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase">
                  MATCH ARENA
                </div>

                <div className="absolute bottom-2 right-2 bg-black text-[#FFD700] border-2 border-black px-2 py-0.5 text-[10px] font-black font-mono">
                  #FIFA_DATA_VERIFIED
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-black uppercase">
                <span className="bg-[#00B140] text-white px-2 py-1 border border-black font-black">LIVE MULTIPLAYER</span>
                <span className="text-[#FFD700] font-mono font-black">ROOMS 100% READY</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- GAME MODES & CATEGORIES ---------------- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b-[3.5px] border-black pb-2">
          <div className="flex items-center gap-2.5">
            <Football3DBadge name="jersey" baseColor="green" size="sm" />
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              {t.popularCategories}
            </h2>
          </div>
          <button
            onClick={() => onOpenCreateRoom()}
            className="neo-btn-secondary px-3 py-1.5 text-xs font-black uppercase cursor-pointer"
          >
            <span>{t.viewAll}</span>
            <span>{isRTL ? '←' : '→'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Category 1: Clubs (Two Clubs Mode) */}
          <div
            onClick={() => {
              playClickSound();
              onOpenCreateRoom('two_clubs');
            }}
            className="bg-[#0F3460] border-[3.5px] border-black shadow-[4px_4px_0px_#000000] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#000000] transition-all duration-150 p-5 cursor-pointer flex flex-col justify-between text-left group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Football3DBadge name="jersey" baseColor="green" size="lg" />
                <span className="bg-[#00B140] text-white font-black text-[10px] uppercase px-2 py-0.5 border border-black">
                  MODE 1
                </span>
              </div>
              <h3 className="font-heading font-black text-white text-lg uppercase leading-tight group-hover:text-[#FFD700]">
                {t.catClubs}
              </h3>
              <p className="text-xs text-[#B0BEC5] font-bold mt-2 leading-snug">
                {t.catClubsDesc}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t-[2.5px] border-black flex items-center justify-between text-xs font-black text-[#00B140]">
              <span>PLAY MATCH</span>
              <span>{isRTL ? '←' : '→'}</span>
            </div>
          </div>

          {/* Category 2: Players (Shirt History Mode) */}
          <div
            onClick={() => {
              playClickSound();
              onOpenCreateRoom('shirt_history');
            }}
            className="bg-[#0F3460] border-[3.5px] border-black shadow-[4px_4px_0px_#000000] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#000000] transition-all duration-150 p-5 cursor-pointer flex flex-col justify-between text-left group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Football3DBadge name="boots" baseColor="green" size="lg" />
                <span className="bg-[#00B140] text-white font-black text-[10px] uppercase px-2 py-0.5 border border-black">
                  MODE 2
                </span>
              </div>
              <h3 className="font-heading font-black text-white text-lg uppercase leading-tight group-hover:text-[#FFD700]">
                {t.catPlayers}
              </h3>
              <p className="text-xs text-[#B0BEC5] font-bold mt-2 leading-snug">
                {t.catPlayersDesc}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t-[2.5px] border-black flex items-center justify-between text-xs font-black text-[#00B140]">
              <span>PLAY MATCH</span>
              <span>{isRTL ? '←' : '→'}</span>
            </div>
          </div>

          {/* Category 3: Guess Club by Nationalities (Mode 3 - Playable) */}
          <div
            onClick={() => {
              playClickSound();
              onOpenCreateRoom('nationalities');
            }}
            className="bg-[#0F3460] border-[3.5px] border-black shadow-[4px_4px_0px_#000000] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#000000] transition-all duration-150 p-5 cursor-pointer flex flex-col justify-between text-left group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Football3DBadge name="pitch" baseColor="green" size="lg" />
                <span className="bg-[#00B140] text-white font-black text-[10px] uppercase px-2 py-0.5 border border-black">
                  MODE 3
                </span>
              </div>
              <h3 className="font-heading font-black text-white text-lg uppercase leading-tight group-hover:text-[#FFD700]">
                {isRTL ? 'جنسيات اللاعبين' : 'Nationalities'}
              </h3>
              <p className="text-xs text-[#B0BEC5] font-bold mt-2 leading-snug">
                {isRTL ? 'خمن النادي من خلال تشكيلة جنسيات اللاعبين على أرضية الملعب' : 'Identify the football club from player nationality flags.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t-[2.5px] border-black flex items-center justify-between text-xs font-black text-[#00B140]">
              <span>PLAY MATCH</span>
              <span>{isRTL ? '←' : '→'}</span>
            </div>
          </div>

          {/* Category 4: History & Legends (Locked) */}
          <div
            onClick={() => {
              playClickSound();
              setLockedNotice(isRTL ? '📖 نمط تاريخ وأساطير الكرة قيد التطوير وسيتاح قريباً!' : '📖 Legends & History mode is under development and coming soon!');
            }}
            className="bg-[#16213E] border-[3.5px] border-black shadow-[4px_4px_0px_#000000] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#000000] transition-all duration-150 p-5 cursor-pointer flex flex-col justify-between text-left relative group opacity-85 hover:opacity-100"
          >
            <div className="absolute top-3 right-3 bg-[#FFD700] text-black font-black uppercase text-xs px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000000] tracking-wider">
              {isRTL ? 'قريباً' : 'SOON'}
            </div>
            <div>
              <div className="mb-3">
                <Football3DBadge name="trophy" baseColor="dark" size="lg" />
              </div>
              <h3 className="font-heading font-black text-[#B0BEC5] text-lg uppercase leading-tight">
                {t.catHistory}
              </h3>
              <p className="text-xs text-[#B0BEC5] font-bold mt-2 leading-snug">
                {t.catHistoryDesc}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t-[2.5px] border-black flex items-center justify-between text-xs font-black text-[#B0BEC5]">
              <span>{isRTL ? 'قيد التطوير' : 'IN DEVELOPMENT'}</span>
              <span>🔒</span>
            </div>
          </div>

          {/* Category 5: General Trivia (Locked) */}
          <div
            onClick={() => {
              playClickSound();
              setLockedNotice(isRTL ? '⚽ نمط التحديات الكروية المنوعة قيد التطوير وسيتاح قريباً!' : '⚽ General Trivia mode is under development and coming soon!');
            }}
            className="bg-[#16213E] border-[3.5px] border-black shadow-[4px_4px_0px_#000000] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#000000] transition-all duration-150 p-5 cursor-pointer flex flex-col justify-between text-left col-span-1 relative group opacity-85 hover:opacity-100"
          >
            <div className="absolute top-3 right-3 bg-[#FFD700] text-black font-black uppercase text-xs px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000000] tracking-wider">
              {isRTL ? 'قريباً' : 'SOON'}
            </div>
            <div>
              <div className="mb-3">
                <Football3DBadge name="ball" baseColor="dark" size="lg" />
              </div>
              <h3 className="font-heading font-black text-[#B0BEC5] text-lg uppercase leading-tight">
                {t.catGeneral}
              </h3>
              <p className="text-xs text-[#B0BEC5] font-bold mt-2 leading-snug">
                {t.catGeneralDesc}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t-[2.5px] border-black flex items-center justify-between text-xs font-black text-[#B0BEC5]">
              <span>{isRTL ? 'قيد التطوير' : 'IN DEVELOPMENT'}</span>
              <span>🔒</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- QUICK ROOM ENTRY & CREATION HUB ---------------- */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Quick Join Card (Cols 5) */}
        <div className="md:col-span-5 bg-[#0F3460] border-[4px] border-black shadow-[6px_6px_0px_#000000] p-6 flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Football3DBadge name="clipboard" baseColor="green" size="sm" />
              <h3 className="font-heading font-black text-white text-base uppercase tracking-wider">
                {t.quickJoinTitle}
              </h3>
            </div>
            <p className="text-xs text-[#B0BEC5] font-bold">
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
              className="flex-1 neo-input text-sm font-mono tracking-widest text-center uppercase"
            />
            <button
              type="submit"
              className="neo-btn-green px-6 py-2.5 text-xs font-black uppercase tracking-wider"
            >
              {t.quickJoinBtn}
            </button>
          </form>
        </div>

        {/* Custom Match & Friends Hub (Cols 7) */}
        <div className="md:col-span-7 bg-[#0F3460] border-[4px] border-black shadow-[6px_6px_0px_#000000] p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
          <div
            onClick={() => {
              playClickSound();
              onOpenCreateRoom();
            }}
            className="p-4 bg-[#16213E] border-[3px] border-black shadow-[4px_4px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] transition cursor-pointer group hover:bg-[#1A2647]"
          >
            <div className="flex items-center justify-between mb-2">
              <Football3DBadge name="boots" baseColor="green" size="sm" />
              <span className="font-mono font-black text-xs bg-[#00B140] text-white px-1.5 py-0.5 border border-black">CREATE</span>
            </div>
            <h4 className="font-heading font-black text-white text-sm uppercase tracking-wider">
              {t.heroCtaCreate}
            </h4>
            <p className="text-[11px] text-[#B0BEC5] font-bold mt-1">
              Select questions, difficulty, timer & invite friends.
            </p>
          </div>

          <div
            onClick={() => {
              playClickSound();
              onOpenFriends();
            }}
            className="p-4 bg-[#16213E] border-[3px] border-black shadow-[4px_4px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] transition cursor-pointer group hover:bg-[#1A2647]"
          >
            <div className="flex items-center justify-between mb-2">
              <Football3DBadge name="players" baseColor="gold" size="sm" />
              <span className="font-mono font-black text-xs bg-[#FFD700] text-black px-1.5 py-0.5 border border-black">ONLINE</span>
            </div>
            <h4 className="font-heading font-black text-white text-sm uppercase tracking-wider">
              {t.friendsTitle}
            </h4>
            <p className="text-[11px] text-[#B0BEC5] font-bold mt-1">
              View online rivals and send instant match invites.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
