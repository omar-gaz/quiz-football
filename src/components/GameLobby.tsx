import React, { useState } from 'react';
import { GameRoom } from '../types/football.ts';
import { socketService } from '../services/socket.ts';
import { Play, Copy, Check, Users, Crown, ArrowLeft, UserPlus, Clock, Lock, Globe, Plus } from 'lucide-react';
import { playClickSound, playWhistleSound } from '../services/sound.ts';
import { useTranslation } from '../context/LanguageContext.tsx';

interface GameLobbyProps {
  room: GameRoom;
  currentUserId: string;
  onOpenFriends: () => void;
  onLeaveRoom: () => void;
}

export const GameLobby: React.FC<GameLobbyProps> = ({
  room,
  currentUserId,
  onOpenFriends,
  onLeaveRoom,
}) => {
  const { t, isRTL } = useTranslation();
  const [copied, setCopied] = useState(false);
  const participants = Object.values(room.participants);
  const isHost = room.hostId === currentUserId;
  const maxSlots = 6;

  const handleCopyCode = () => {
    playClickSound();
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = () => {
    if (!isHost) return;
    playClickSound();
    playWhistleSound();
    socketService.startGame(room.code);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in space-y-6">
      {/* ---------------- CONCEPT 1: LOBBY MAIN CARD ---------------- */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle radial stadium floodlight glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#B7F34A]/8 rounded-full blur-3xl pointer-events-none" />

        {/* Top Bar: Back Button, Room Code & Capacity Badge */}
        <div className="flex items-center justify-between pb-8 border-b border-[#29312B]/80">
          <button
            onClick={() => {
              playClickSound();
              onLeaveRoom();
            }}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#A1AAA2] hover:text-[#F5F5F0] transition cursor-pointer"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{t.backToHome}</span>
          </button>

          {/* Center Title: Room #CODE */}
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-black text-[#F5F5F0] tracking-wider font-mono">
              {t.lobbyTitle} #{room.code}
            </h1>
            <p className="text-xs text-[#A1AAA2] mt-1 font-medium">
              {t.waitingPlayers}
            </p>
          </div>

          {/* Right Capacity Badge (Concept 1: e.g. 4/6 with lock) */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#171D19] border border-[#29312B] text-xs font-mono font-bold text-[#F5F5F0]">
            {room.isPrivate ? (
              <Lock className="w-3.5 h-3.5 text-[#D6BD83]" />
            ) : (
              <Globe className="w-3.5 h-3.5 text-[#B7F34A]" />
            )}
            <span>
              {participants.length}/{maxSlots}
            </span>
          </div>
        </div>

        {/* Code & Direct Link Share Quick Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-6 pb-4">
          <div className="flex items-center gap-1.5 bg-[#171D19] px-3 py-1.5 rounded-xl border border-[#29312B]">
            <span className="text-xs text-[#A1AAA2] uppercase tracking-wider font-semibold">
              {t.quickJoinTitle}:
            </span>
            <span className="text-base sm:text-lg font-black font-mono tracking-widest text-[#B7F34A]">
              {room.code}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-1.5 rounded-lg bg-[#080A09] border border-[#29312B] hover:border-[#B7F34A]/50 text-[#A1AAA2] hover:text-[#B7F34A] transition cursor-pointer"
              title={t.copyCode}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#B7F34A]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onOpenFriends();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B7F34A] text-[#080A09] text-xs font-black uppercase hover:bg-[#a6e038] transition cursor-pointer shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.inviteFriend}</span>
          </button>
        </div>

        {/* Challenge Mode Pill */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full bg-[#111512] border border-[#29312B] text-xs text-[#D6BD83] font-bold flex items-center gap-1.5">
            <span>{room.mode === 'two_clubs' ? '⚡' : room.mode === 'nationalities' ? '🌍' : '👕'}</span>
            <span>
              {room.mode === 'two_clubs'
                ? isRTL ? 'لاعب بين الناديين' : 'Two Clubs Challenge'
                : room.mode === 'nationalities'
                ? isRTL ? 'خمن النادي من جنسيات اللاعبين' : 'Club by Player Nationalities'
                : isRTL ? 'تاريخ أرقام القمصان' : 'Shirt Number Timeline'}
            </span>
          </span>
        </div>

        {/* ---------------- CIRCULAR SEAT ROW (Concept 1) ---------------- */}
        <div className="py-6 my-2">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {/* Render actual participants */}
            {participants.map((p) => {
              const isMe = p.userId === currentUserId;
              return (
                <div key={p.userId} className="flex flex-col items-center gap-2.5">
                  {/* Glowing neon green ring avatar container */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#171D19] border-2 border-[#B7F34A] flex items-center justify-center text-3xl sm:text-4xl shadow-[0_0_20px_rgba(183,243,74,0.3)]">
                    {p.avatar}
                    {p.isHost && (
                      <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#D6BD83] text-[#080A09] flex items-center justify-center shadow">
                        <Crown className="w-3.5 h-3.5 fill-current" />
                      </span>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm font-bold text-[#F5F5F0] truncate max-w-[110px]">
                      {p.displayName || p.username}
                    </p>
                    <span className="text-[10px] font-black uppercase text-[#B7F34A] block">
                      {p.isHost ? t.hostBadge : t.readyBadge}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Render remaining empty slots (up to maxSlots) */}
            {Array.from({ length: Math.max(0, maxSlots - participants.length) }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                onClick={() => {
                  playClickSound();
                  onOpenFriends();
                }}
                className="flex flex-col items-center gap-2.5 cursor-pointer group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#111512]/60 border-2 border-dashed border-[#29312B] group-hover:border-[#B7F34A]/50 flex items-center justify-center text-[#A1AAA2] group-hover:text-[#B7F34A] transition">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#A1AAA2] font-medium group-hover:text-[#F5F5F0]">
                    {t.emptySlot}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- GAME SETTINGS BAR & START BUTTON (Concept 1) ---------------- */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#080A09]/70 border border-[#29312B] flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Settings metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto text-left">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#A1AAA2] block">
                {t.mode}
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#F5F5F0] truncate block">
                {room.mode === 'two_clubs' ? t.catClubs : t.catPlayers}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#A1AAA2] block">
                {t.catGeneral}
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#F5F5F0] block">
                Football
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#A1AAA2] block">
                {t.rounds}
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#F5F5F0] block font-mono">
                {room.questionsCount}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#A1AAA2] block">
                {t.timeLimit}
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#B7F34A] block font-mono">
                {room.timeLimit}s
              </span>
            </div>
          </div>

          {/* Big Electric Green Start Game Button (Concept 1) */}
          <div className="w-full md:w-auto shrink-0">
            {isHost ? (
              <button
                onClick={handleStartGame}
                className="btn-electric w-full md:w-auto px-10 py-3.5 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#B7F34A]/25"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t.startGame}</span>
              </button>
            ) : (
              <div className="px-6 py-3 rounded-full bg-[#171D19] border border-[#29312B] text-xs font-bold text-[#A1AAA2] flex items-center gap-2">
                <span className="animate-spin text-sm">⚽</span>
                <span>{t.waitingHost}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
