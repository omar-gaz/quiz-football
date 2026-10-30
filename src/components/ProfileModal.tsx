import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { UserProfile, MatchHistoryItem } from '../types/football.ts';
import { AVATAR_PRESETS } from '../utils/footballAssets.ts';
import { X, Trophy, Swords, Target, Calendar, Check, Edit2, ShieldAlert } from 'lucide-react';
import { playClickSound, playCorrectSound } from '../services/sound.ts';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserUpdated: (user: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
}) => {
  const [history, setHistory] = useState<MatchHistoryItem[]>([]);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser.displayName || currentUser.username);
  const [avatar, setAvatar] = useState(currentUser.avatar || '⚽');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setDisplayName(currentUser.displayName || currentUser.username);
    setAvatar(currentUser.avatar || '⚽');

    api.getUserStats(currentUser.id)
      .then((res) => {
        setHistory(res.history || []);
      })
      .catch((err) => console.error(err));
  }, [isOpen, currentUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    playClickSound();
    try {
      const updated = await api.updateProfile({ displayName, avatar });
      onUserUpdated(updated);
      setEditing(false);
      setSavedMsg(true);
      playCorrectSound();
      setTimeout(() => setSavedMsg(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#151B23] border border-white/10 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#39E75F]/20 text-[#39E75F] flex items-center justify-center font-bold">
              ⚽
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wide">
                Player Profile
              </h2>
              <p className="text-xs text-[#9AA4B2]">Career achievements and match logs</p>
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

        {savedMsg && (
          <div className="mt-3 p-2 bg-[#39E75F]/15 border border-[#39E75F]/30 rounded-xl text-[#39E75F] text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Profile successfully updated!</span>
          </div>
        )}

        <div className="overflow-y-auto flex-1 mt-4 space-y-6 pr-1 custom-scrollbar">
          {/* User Hero Capsule */}
          <div className="bg-[#0B0F14] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#151B23] border border-[#39E75F]/30 flex items-center justify-center text-3xl shadow-lg">
                {currentUser.avatar}
              </div>
              <div>
                <h3 className="text-base font-black text-white">{currentUser.displayName}</h3>
                <p className="text-xs text-[#9AA4B2]">@{currentUser.username}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#39E75F]/20 text-[#39E75F]">
                    PRO STRIKER
                  </span>
                  <span className="text-[10px] text-[#9AA4B2]">
                    Joined {new Date(currentUser.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playClickSound();
                setEditing(!editing);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-[#39E75F]" />
              <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Edit Form */}
          {editing && (
            <form onSubmit={handleSave} className="bg-[#0B0F14] border border-[#39E75F]/30 rounded-2xl p-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#9AA4B2] uppercase mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#151B23] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#39E75F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#9AA4B2] uppercase mb-1">
                  Change Avatar
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {AVATAR_PRESETS.map((p) => (
                    <button
                      key={p.emoji}
                      type="button"
                      onClick={() => setAvatar(p.emoji)}
                      className={`h-9 rounded-lg flex items-center justify-center text-lg transition cursor-pointer ${
                        avatar === p.emoji
                          ? 'bg-[#39E75F]/20 border-2 border-[#39E75F]'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {p.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2 bg-[#39E75F] text-[#0B0F14] font-black text-xs uppercase rounded-xl hover:bg-[#2ed252] transition cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {/* Career Stats Grid */}
          <div>
            <h4 className="text-xs font-bold text-[#9AA4B2] uppercase tracking-wider mb-2">
              Career Statistics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#0B0F14] border border-white/5 p-3 rounded-2xl text-center">
                <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <div className="text-lg font-black text-white">{currentUser.totalPoints.toLocaleString()}</div>
                <div className="text-[10px] text-[#9AA4B2] uppercase font-bold">Total Points</div>
              </div>
              <div className="bg-[#0B0F14] border border-white/5 p-3 rounded-2xl text-center">
                <Swords className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                <div className="text-lg font-black text-white">{currentUser.totalGames}</div>
                <div className="text-[10px] text-[#9AA4B2] uppercase font-bold">Games Played</div>
              </div>
              <div className="bg-[#0B0F14] border border-white/5 p-3 rounded-2xl text-center">
                <Target className="w-4 h-4 text-[#39E75F] mx-auto mb-1" />
                <div className="text-lg font-black text-[#39E75F]">{currentUser.winRate}%</div>
                <div className="text-[10px] text-[#9AA4B2] uppercase font-bold">Win Rate</div>
              </div>
              <div className="bg-[#0B0F14] border border-white/5 p-3 rounded-2xl text-center">
                <span className="text-xs font-black text-emerald-400 block mb-1">W / L</span>
                <div className="text-lg font-black text-white">
                  <span className="text-[#39E75F]">{currentUser.wins}</span>
                  <span className="text-[#9AA4B2] text-xs font-normal"> / </span>
                  <span className="text-red-400">{currentUser.losses}</span>
                </div>
                <div className="text-[10px] text-[#9AA4B2] uppercase font-bold">Record</div>
              </div>
            </div>
          </div>

          {/* Match History */}
          <div>
            <h4 className="text-xs font-bold text-[#9AA4B2] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Recent Matches</span>
              <span className="text-[10px] text-[#9AA4B2]">{history.length} logged</span>
            </h4>

            {history.length === 0 ? (
              <div className="text-center py-8 bg-[#0B0F14]/40 rounded-2xl border border-dashed border-white/10">
                <Calendar className="w-8 h-8 text-[#9AA4B2]/40 mx-auto mb-2" />
                <p className="text-xs text-[#9AA4B2]">No match history yet.</p>
                <p className="text-[10px] text-[#9AA4B2]/60 mt-0.5">Jump into a match to build your legacy!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((m) => {
                  const isWinner = m.winnerId === currentUser.id;
                  const myParticipant = m.players.find((p) => p.userId === currentUser.id);

                  return (
                    <div
                      key={m.id}
                      className="p-3 rounded-2xl bg-[#0B0F14] border border-white/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                            isWinner
                              ? 'bg-[#39E75F]/20 text-[#39E75F] border border-[#39E75F]/40'
                              : 'bg-red-950/40 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {isWinner ? 'W' : 'L'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white capitalize">
                              {m.mode === 'two_clubs' ? 'Two Clubs' : 'Shirt History'}
                            </span>
                            <span className="text-[10px] text-[#9AA4B2]">
                              • vs {m.players.filter((p) => p.userId !== currentUser.id).map((p) => p.username).join(', ') || 'Solo'}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#9AA4B2]">
                            {new Date(m.date).toLocaleDateString()} at {new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-[#39E75F]">
                          {myParticipant?.score || 0} pts
                        </div>
                        <div className="text-[10px] text-[#9AA4B2]">
                          Rank #{myParticipant?.rank || 1}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
