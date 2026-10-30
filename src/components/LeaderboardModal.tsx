import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { UserProfile } from '../types/football.ts';
import { X, Trophy, Medal, Flame, Target } from 'lucide-react';
import { playClickSound } from '../services/sound.ts';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#151B23] border border-white/10 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wide">
                Global Hall of Fame
              </h2>
              <p className="text-xs text-[#9AA4B2]">Top football trivia masterminds</p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 text-[#9AA4B2] hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sort Filters */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0B0F14] rounded-2xl my-4 border border-white/5 text-xs font-bold">
          <button
            onClick={() => {
              playClickSound();
              setSortBy('points');
            }}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              sortBy === 'points'
                ? 'bg-[#151B23] text-[#39E75F] border border-[#39E75F]/30 shadow'
                : 'text-[#9AA4B2] hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Total Points</span>
          </button>
          <button
            onClick={() => {
              playClickSound();
              setSortBy('wins');
            }}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              sortBy === 'wins'
                ? 'bg-[#151B23] text-[#39E75F] border border-[#39E75F]/30 shadow'
                : 'text-[#9AA4B2] hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Most Wins</span>
          </button>
          <button
            onClick={() => {
              playClickSound();
              setSortBy('winRate');
            }}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              sortBy === 'winRate'
                ? 'bg-[#151B23] text-[#39E75F] border border-[#39E75F]/30 shadow'
                : 'text-[#9AA4B2] hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Win Rate %</span>
          </button>
        </div>

        {/* Players List */}
        <div className="overflow-y-auto flex-1 space-y-2 pr-1 custom-scrollbar">
          {loading ? (
            <div className="py-12 text-center text-sm text-[#9AA4B2] animate-pulse">
              Calculating rankings...
            </div>
          ) : players.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#9AA4B2]">
              No players found.
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
                  className={`flex items-center justify-between p-3 rounded-2xl transition border ${
                    isCurrentUser
                      ? 'bg-[#39E75F]/10 border-[#39E75F]/50 shadow-md'
                      : isTop1
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : isTop2
                      ? 'bg-slate-900/40 border-slate-400/30'
                      : isTop3
                      ? 'bg-amber-950/15 border-amber-700/30'
                      : 'bg-[#0B0F14] border-white/5'
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
                        <span className="text-xs font-bold text-[#9AA4B2]">#{player.rank}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-[#151B23] border border-white/10 flex items-center justify-center text-lg">
                      {player.avatar}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate max-w-[120px] sm:max-w-[160px]">
                          {player.displayName}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[9px] bg-[#39E75F] text-[#0B0F14] font-black px-1.5 py-0.2 rounded">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#9AA4B2]">
                        @{player.username} • {player.totalGames} games • {player.wins}W / {player.losses}L
                      </span>
                    </div>
                  </div>

                  {/* Main Metric */}
                  <div className="text-right">
                    {sortBy === 'points' && (
                      <div>
                        <div className="text-sm font-black text-[#39E75F]">
                          {player.totalPoints.toLocaleString()}
                        </div>
                        <div className="text-[9px] text-[#9AA4B2] uppercase font-bold">Points</div>
                      </div>
                    )}
                    {sortBy === 'wins' && (
                      <div>
                        <div className="text-sm font-black text-amber-400">
                          {player.wins}
                        </div>
                        <div className="text-[9px] text-[#9AA4B2] uppercase font-bold">Victories</div>
                      </div>
                    )}
                    {sortBy === 'winRate' && (
                      <div>
                        <div className="text-sm font-black text-sky-400">
                          {player.winRate}%
                        </div>
                        <div className="text-[9px] text-[#9AA4B2] uppercase font-bold">Win Rate</div>
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
