import React, { useState } from 'react';
import { GameRoom } from '../types/football.ts';
import { socketService } from '../services/socket.ts';
import { playClickSound, playWhistleSound } from '../services/sound.ts';
import { useTranslation } from '../context/LanguageContext.tsx';
import {
  IconFootball,
  IconFootballJersey,
  IconFootballPlayers,
} from './Football3DIcons.tsx';
import { PlayerCharacterAvatar } from './PlayerCharacterAvatar.tsx';

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
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in space-y-6 text-white">
      {/* ---------------- LOBBY MAIN CARD ---------------- */}
      <div className="bg-[#0F3460] border-[4px] border-black shadow-[8px_8px_0px_#000000] p-6 sm:p-10 relative overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-6 border-b-[3.5px] border-black">
          <button
            onClick={() => {
              playClickSound();
              onLeaveRoom();
            }}
            className="neo-btn-secondary px-3 py-1.5 text-xs font-black uppercase cursor-pointer"
          >
            <span>{isRTL ? '→' : '←'}</span>
            <span>{t.backToHome}</span>
          </button>

          {/* Center Title: Room #CODE */}
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase font-mono">
              {t.lobbyTitle} #{room.code}
            </h1>
            <p className="text-xs text-[#B0BEC5] font-bold mt-0.5">
              {t.waitingPlayers}
            </p>
          </div>

          {/* Right Capacity Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#16213E] border-[2.5px] border-black shadow-[2px_2px_0px_#000] text-xs font-mono font-black text-[#FFD700]">
            <span>{room.isPrivate ? '🔒' : '🌐'}</span>
            <span>
              {participants.length}/{maxSlots}
            </span>
          </div>
        </div>

        {/* Room Code Quick Strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-6 pb-4">
          <div className="flex items-center gap-2 bg-[#16213E] px-4 py-2 border-[2.5px] border-black shadow-[3px_3px_0px_#000]">
            <span className="text-xs text-[#B0BEC5] uppercase font-black">
              {t.quickJoinTitle}:
            </span>
            <span className="text-lg font-black font-mono tracking-widest text-[#FFD700] bg-[#0F3460] px-2 py-0.5 border border-black">
              {room.code}
            </span>
            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 bg-[#00B140] hover:bg-[#008F32] text-white font-black text-xs uppercase border border-black transition cursor-pointer"
              title={t.copyCode}
            >
              {copied ? '✓ COPIED' : 'COPY'}
            </button>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onOpenFriends();
            }}
            className="neo-btn-green px-5 py-2 text-xs font-black uppercase flex items-center gap-1.5"
          >
            <IconFootballPlayers className="w-4 h-4" />
            <span>{t.inviteFriend}</span>
          </button>
        </div>

        {/* Challenge Mode Pill */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="px-3.5 py-1 bg-[#00B140] border-[2.5px] border-black shadow-[2px_2px_0px_#000] text-xs text-white font-black uppercase flex items-center gap-1.5">
            <IconFootballJersey className="w-4 h-4" />
            <span>
              {room.mode === 'two_clubs'
                ? isRTL ? 'لاعب بين الناديين' : 'Two Clubs Challenge'
                : room.mode === 'nationalities'
                ? isRTL ? 'خمن النادي من جنسيات اللاعبين' : 'Club by Player Nationalities'
                : isRTL ? 'تاريخ أرقام القمصان' : 'Shirt Number Timeline'}
            </span>
          </span>
        </div>

        {/* ---------------- SQUAD SLOTS GRID ---------------- */}
        <div className="py-4 my-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {/* Render actual participants */}
            {participants.map((p, idx) => (
              <div
                key={p.userId}
                className="p-3 bg-[#16213E] border-[3px] border-black shadow-[4px_4px_0px_#000000] flex flex-col items-center gap-2 relative text-white"
              >
                {/* Squad badge */}
                <span className="absolute top-1.5 left-1.5 text-[9px] font-black font-mono bg-black text-[#FFD700] px-1">
                  #{idx + 1}
                </span>

                <div className="relative w-14 h-14 bg-[#0F3460] border-[2.5px] border-black shadow-[2px_2px_0px_#000] flex items-center justify-center overflow-hidden mt-1">
                  <PlayerCharacterAvatar avatarId={p.avatar} className="w-full h-full" />
                  {p.isHost && (
                    <span className="absolute -top-1 -right-1 bg-[#FFD700] text-black border border-black p-0.5 text-[9px] font-black z-10" title="Host">
                      👑
                    </span>
                  )}
                </div>

                <div className="text-center w-full">
                  <p className="text-xs font-black text-white truncate">
                    {p.displayName || p.username}
                  </p>
                  <span className={`text-[9px] font-black uppercase px-1 py-0.2 mt-0.5 inline-block border border-black ${
                    p.isHost ? 'bg-[#FFD700] text-black' : 'bg-[#00B140] text-white'
                  }`}>
                    {p.isHost ? t.hostBadge : t.readyBadge}
                  </span>
                </div>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: Math.max(0, maxSlots - participants.length) }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                onClick={() => {
                  playClickSound();
                  onOpenFriends();
                }}
                className="p-3 bg-[#16213E]/50 border-[3px] border-dashed border-black flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#16213E] transition text-[#B0BEC5]"
              >
                <div className="w-12 h-12 border-2 border-dashed border-black flex items-center justify-center text-xl font-black">
                  +
                </div>
                <p className="text-[10px] font-black uppercase">
                  {t.emptySlot}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- SETTINGS & START BUTTON ---------------- */}
        <div className="mt-6 p-4 sm:p-5 bg-[#16213E] border-[3px] border-black shadow-[4px_4px_0px_#000000] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto text-left">
            <div>
              <span className="text-[10px] uppercase font-black text-[#B0BEC5] block">
                {t.mode}
              </span>
              <span className="text-xs font-black text-white truncate block uppercase">
                {room.mode === 'two_clubs' ? t.catClubs : t.catPlayers}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-black text-[#B0BEC5] block">
                CATEGORY
              </span>
              <span className="text-xs font-black text-white block uppercase">
                Football
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-black text-[#B0BEC5] block">
                {t.rounds}
              </span>
              <span className="text-xs font-black text-white block font-mono">
                {room.questionsCount} Qs
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-black text-[#B0BEC5] block">
                {t.timeLimit}
              </span>
              <span className="text-xs font-black text-white block font-mono bg-[#00B140] px-1 border border-black inline-block">
                {room.timeLimit}s
              </span>
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0">
            {isHost ? (
              <button
                onClick={handleStartGame}
                className="neo-btn-green w-full md:w-auto px-8 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <IconFootball className="w-5 h-5" />
                <span>{t.startGame}</span>
              </button>
            ) : (
              <div className="px-5 py-3 bg-[#16213E] border-[2.5px] border-black text-xs font-black text-[#FFD700] flex items-center gap-2 shadow-[2px_2px_0px_#000]">
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
