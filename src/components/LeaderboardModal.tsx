import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { UserProfile } from '../types/football.ts';
import { X } from 'lucide-react';
import { playClickSound } from '../services/sound.ts';
import {
  IconFootballTrophy,
  IconFootballPoints,
  IconFootballOnFire,
  IconFootballBoots,
} from './Football3DIcons.tsx';
import { PlayerCharacterAvatar } from './PlayerCharacterAvatar.tsx';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
}) => {
  const [sortBy, setSortBy] = useState<'points' | 'wins' | 'winRate'>('points');
  const [players, setPlayers] = useState<(UserProfile & { rank: number })[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    api.getLeaderboard(sortBy)
      .then((res) => {
        setPlayers(res.leaderboard || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [isOpen, sortBy]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in text-white">
      <div className="w-full max-w-lg bg-[#0F3460] border-4 border-black p-6 shadow-[8px_8px_0px_#000000] relative max-h-[92vh] flex flex-col">
        {/* Top brutalist bar */}
        <div className="h-2 bg-[#FFD700] border-b-2 border-black -mx-6 -mt-6 mb-5" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b-3 border-black">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#16213E] border-3 border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center shrink-0">
              <IconFootballTrophy size={34} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                Global Hall of Fame
              </h2>
              <p className="text-xs font-bold text-[#B0BEC5]">Top football masterminds & record holders</p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 bg-[#CC0000] text-white border-2 border-black hover:bg-black transition cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            <X className="w-4 h-4 font-black" />
          </button>
        </div>

        {/* Sort Filters */}
        <div className="grid grid-cols-3 gap-2 my-4">
          <button
            onClick={() => {
              playClickSound();
              setSortBy('points');
            }}
            className={`py-2 px-1 text-xs font-black uppercase border-3 border-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
              sortBy === 'points'
                ? 'bg-[#00B140] shadow-[3px_3px_0px_#000] text-white translate-x-[1px] translate-y-[1px]'
                : 'bg-[#16213E] hover:bg-[#1A2647] text-[#B0BEC5]'
            }`}
          >
            <IconFootballPoints size={16} />
            <span>Points</span>
          </button>
          <button
            onClick={() => {
              playClickSound();
              setSortBy('wins');
            }}
            className={`py-2 px-1 text-xs font-black uppercase border-3 border-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
              sortBy === 'wins'
                ? 'bg-[#00B140] shadow-[3px_3px_0px_#000] text-white translate-x-[1px] translate-y-[1px]'
                : 'bg-[#16213E] hover:bg-[#1A2647] text-[#B0BEC5]'
            }`}
          >
            <IconFootballOnFire size={16} />
            <span>Wins</span>
          </button>
          <button
            onClick={() => {
              playClickSound();
              setSortBy('winRate');
            }}
            className={`py-2 px-1 text-xs font-black uppercase border-3 border-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
              sortBy === 'winRate'
                ? 'bg-[#00B140] shadow-[3px_3px_0px_#000] text-white translate-x-[1px] translate-y-[1px]'
                : 'bg-[#16213E] hover:bg-[#1A2647] text-[#B0BEC5]'
            }`}
          >
            <IconFootballBoots size={16} />
            <span>Win Rate</span>
          </button>
        </div>

        {/* Players List */}
        <div className="overflow-y-auto flex-1 space-y-2.5 pr-1 custom-scrollbar">
          {loading ? (
            <div className="py-12 text-center text-sm font-black uppercase text-[#B0BEC5] animate-pulse">
              Calculating Rankings...
            </div>
          ) : players.length === 0 ? (
            <div className="py-12 text-center text-sm font-black uppercase text-[#B0BEC5]">
              No players found in this league.
            </div>
          ) : (
            players.map((player) => {
              const isCurrentUser = player.id === currentUserId;
              const isTop1 = player.rank === 1;
              const isTop2 = player.rank === 2;
              const isTop3 = player.rank === 3;

              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 border-3 border-black transition hover:translate-x-[1px] hover:translate-y-[1px] ${
                    isTop1
                      ? 'bg-[#FFD700] text-black shadow-[4px_4px_0px_#000]'
                      : isCurrentUser
                      ? 'bg-[#00B140] text-white shadow-[3px_3px_0px_#000]'
                      : 'bg-[#16213E] text-white shadow-[2px_2px_0px_#000]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div className="w-8 flex items-center justify-center font-black">
                      {isTop1 ? (
                        <span className="text-xl">🥇</span>
                      ) : isTop2 ? (
                        <span className="text-xl">🥈</span>
                      ) : isTop3 ? (
                        <span className="text-xl">🥉</span>
                      ) : (
                        <span className="text-xs font-black">#{player.rank}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 bg-[#0F3460] border-2 border-black flex items-center justify-center overflow-hidden shrink-0">
                      <PlayerCharacterAvatar avatarId={player.avatar} className="w-full h-full" />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black uppercase truncate max-w-[120px] sm:max-w-[160px]">
                          {player.displayName}
                        </span>
                        {isCurrentUser && (
                          <span className={`text-[9px] font-black px-1.5 py-0.5 border border-black uppercase ${
                            isTop1 ? 'bg-black text-[#FFD700]' : 'bg-black text-[#00B140]'
                          }`}>
                            YOU
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold ${isTop1 ? 'text-neutral-800' : 'text-[#B0BEC5]'}`}>
                        @{player.username} • {player.totalGames} G • {player.wins}W / {player.losses}L
                      </span>
                    </div>
                  </div>

                  {/* Main Metric */}
                  <div className="text-right">
                    {sortBy === 'points' && (
                      <div>
                        <div className={`text-sm font-black font-mono ${isTop1 ? 'text-black' : 'text-[#FFD700]'}`}>
                          {player.totalPoints.toLocaleString()}
                        </div>
                        <div className={`text-[9px] font-black uppercase tracking-wider ${isTop1 ? 'text-neutral-800' : 'text-[#B0BEC5]'}`}>Points</div>
                      </div>
                    )}
                    {sortBy === 'wins' && (
                      <div>
                        <div className={`text-sm font-black font-mono ${isTop1 ? 'text-black' : 'text-[#FFD700]'}`}>
                          {player.wins}
                        </div>
                        <div className={`text-[9px] font-black uppercase tracking-wider ${isTop1 ? 'text-neutral-800' : 'text-[#B0BEC5]'}`}>Wins</div>
                      </div>
                    )}
                    {sortBy === 'winRate' && (
                      <div>
                        <div className={`text-sm font-black font-mono ${isTop1 ? 'text-black' : 'text-[#FFD700]'}`}>
                          {player.winRate}%
                        </div>
                        <div className={`text-[9px] font-black uppercase tracking-wider ${isTop1 ? 'text-neutral-800' : 'text-[#B0BEC5]'}`}>Win Rate</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
