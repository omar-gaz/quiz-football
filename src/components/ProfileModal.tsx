import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { UserProfile, MatchHistoryItem } from '../types/football.ts';
import { AVATAR_PRESETS } from '../utils/footballAssets.ts';
import { PlayerCharacterAvatar } from './PlayerCharacterAvatar.tsx';
import { X, Check, Edit2 } from 'lucide-react';
import { playClickSound, playCorrectSound } from '../services/sound.ts';
import {
  IconCaptainArmband,
  IconFootballTrophy,
  IconFootball,
  IconFootballBoots,
  IconFootballPoints,
} from './Football3DIcons.tsx';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in">
      <div className="w-full max-w-lg bg-[#0F3460] border-4 border-black p-6 shadow-[8px_8px_0px_#000000] relative max-h-[92vh] flex flex-col text-white">
        {/* Top brutalist bar */}
        <div className="h-2 bg-[#00B140] border-b-2 border-black -mx-6 -mt-6 mb-5" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b-3 border-black">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FFD700] border-3 border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center shrink-0">
              <IconCaptainArmband size={34} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                Player Profile
              </h2>
              <p className="text-xs font-bold text-[#B0BEC5]">Career achievements and match logs</p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 bg-[#16213E] text-white border-2 border-black hover:bg-[#CC0000] hover:text-white transition cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            <X className="w-4 h-4 font-black" />
          </button>
        </div>

        {savedMsg && (
          <div className="mt-3 p-2.5 bg-[#00B140] border-3 border-black shadow-[3px_3px_0px_#000] text-white text-xs font-black uppercase flex items-center gap-2">
            <Check className="w-4 h-4 font-black" />
            <span>Profile successfully updated!</span>
          </div>
        )}

        <div className="overflow-y-auto flex-1 mt-4 space-y-5 pr-1 custom-scrollbar">
          {/* User Hero Capsule */}
          <div className="bg-[#16213E] border-3 border-black p-4 shadow-[4px_4px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 bg-[#0F3460] border-3 border-black flex items-center justify-center overflow-hidden shadow-[3px_3px_0px_#000] shrink-0">
                <PlayerCharacterAvatar avatarId={currentUser.avatar} className="w-full h-full" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase">{currentUser.displayName}</h3>
                <p className="text-xs font-bold text-[#B0BEC5]">@{currentUser.username}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-black text-[#FFD700] border border-black">
                    PRO CAPTAIN
                  </span>
                  <span className="text-[10px] font-bold text-[#B0BEC5]">
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
              className="px-3.5 py-2 bg-[#FFD700] hover:bg-[#e6c200] border-2 border-black text-xs font-black uppercase text-black flex items-center gap-1.5 transition cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px]"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Edit Form */}
          {editing && (
            <form onSubmit={handleSave} className="bg-[#16213E] border-3 border-black p-4 shadow-[4px_4px_0px_#000] space-y-3">
              <div>
                <label className="block text-xs font-black text-[#B0BEC5] uppercase mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#0F3460] border-3 border-black px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00B140] shadow-[2px_2px_0px_#000]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#B0BEC5] uppercase mb-1">
                  Change Football Character Avatar
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {AVATAR_PRESETS.map((p) => {
                    const isSelected = avatar === p.id || avatar === p.emoji;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        title={p.label}
                        onClick={() => setAvatar(p.id)}
                        className={`h-14 p-1 border-2 border-black flex flex-col items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#00B140] shadow-[2px_2px_0px_#000] text-white ring-2 ring-[#FFD700]'
                            : 'bg-[#0F3460] hover:bg-[#1A1A2E] text-white'
                        }`}
                      >
                        <div className="w-8 h-8 overflow-hidden pointer-events-none">
                          <PlayerCharacterAvatar avatarId={p.id} className="w-full h-full" />
                        </div>
                        <span className={`text-[8px] font-black uppercase ${isSelected ? 'text-white' : 'text-[#B0BEC5]'}`}>
                          {p.position}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-[#00B140] hover:bg-[#008F32] text-white font-black text-xs uppercase border-3 border-black shadow-[3px_3px_0px_#000] transition cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          )}

          {/* Career Stats Grid */}
          <div>
            <h4 className="text-xs font-black text-[#B0BEC5] uppercase tracking-wider mb-2.5">
              Career Statistics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#16213E] border-3 border-black p-3 text-center shadow-[3px_3px_0px_#000]">
                <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center">
                  <IconFootballTrophy size={24} />
                </div>
                <div className="text-lg font-black text-[#FFD700] font-mono">{currentUser.totalPoints.toLocaleString()}</div>
                <div className="text-[10px] font-black uppercase text-[#B0BEC5]">Total Points</div>
              </div>
              <div className="bg-[#16213E] border-3 border-black p-3 text-center shadow-[3px_3px_0px_#000]">
                <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center">
                  <IconFootball size={24} />
                </div>
                <div className="text-lg font-black text-white font-mono">{currentUser.totalGames}</div>
                <div className="text-[10px] font-black uppercase text-[#B0BEC5]">Games Played</div>
              </div>
              <div className="bg-[#16213E] border-3 border-black p-3 text-center shadow-[3px_3px_0px_#000]">
                <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center">
                  <IconFootballBoots size={24} />
                </div>
                <div className="text-lg font-black text-[#00B140] font-mono">{currentUser.winRate}%</div>
                <div className="text-[10px] font-black uppercase text-[#B0BEC5]">Win Rate</div>
              </div>
              <div className="bg-[#16213E] border-3 border-black p-3 text-center shadow-[3px_3px_0px_#000]">
                <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center">
                  <IconFootballPoints size={24} />
                </div>
                <div className="text-lg font-black text-white font-mono">
                  <span className="text-[#00B140]">{currentUser.wins}</span>
                  <span className="text-[#B0BEC5] text-xs font-normal"> / </span>
                  <span className="text-[#CC0000]">{currentUser.losses}</span>
                </div>
                <div className="text-[10px] font-black uppercase text-[#B0BEC5]">W / L Record</div>
              </div>
            </div>
          </div>

          {/* Match History */}
          <div>
            <h4 className="text-xs font-black text-[#B0BEC5] uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Recent Matches</span>
              <span className="text-[10px] font-black bg-black text-[#FFD700] px-2 py-0.5">{history.length} LOGGED</span>
            </h4>

            {history.length === 0 ? (
              <div className="text-center py-8 bg-[#16213E] border-3 border-dashed border-black p-4">
                <p className="text-xs font-black uppercase text-white">No match history recorded yet.</p>
                <p className="text-[11px] font-bold text-[#B0BEC5] mt-0.5">Jump into a match room to build your career record!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((m) => {
                  const isWinner = m.winnerId === currentUser.id;
                  const myParticipant = m.players.find((p) => p.userId === currentUser.id);

                  return (
                    <div
                      key={m.id}
                      className="p-3 bg-[#16213E] border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 border-2 border-black flex items-center justify-center font-black text-sm shrink-0 shadow-[2px_2px_0px_#000] ${
                            isWinner
                              ? 'bg-[#00B140] text-white'
                              : 'bg-[#CC0000] text-white'
                          }`}
                        >
                          {isWinner ? 'W' : 'L'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-white uppercase">
                              {m.mode === 'two_clubs' ? 'Two Clubs' : m.mode === 'nationalities' ? 'Nationalities' : 'Shirt History'}
                            </span>
                            <span className="text-[10px] font-bold text-[#B0BEC5]">
                              • vs {m.players.filter((p) => p.userId !== currentUser.id).map((p) => p.username).join(', ') || 'Solo'}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-[#B0BEC5]">
                            {new Date(m.date).toLocaleDateString()} at {new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-[#FFD700] font-mono">
                          {myParticipant?.score || 0} PTS
                        </div>
                        <div className="text-[10px] font-black uppercase text-[#B0BEC5]">
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
