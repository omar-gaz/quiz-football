import React, { useState } from 'react';
import { GameModeType, DifficultyType } from '../types/football.ts';
import { socketService } from '../services/socket.ts';
import { X, Play, Settings, Clock, Sparkles, Shield, Lock, Globe } from 'lucide-react';
import { playClickSound, playWhistleSound } from '../services/sound.ts';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: GameModeType;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'two_clubs',
}) => {
  const [mode, setMode] = useState<GameModeType>(defaultMode);
  const [questionsCount, setQuestionsCount] = useState<number>(5);
  const [timeLimit, setTimeLimit] = useState<number>(20);
  const [difficulty, setDifficulty] = useState<DifficultyType | 'any'>('any');
  const [hintsEnabled, setHintsEnabled] = useState<boolean>(true);
  const [isPrivate, setIsPrivate] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    playWhistleSound();
    socketService.createRoom({
      mode,
      questionsCount,
      timeLimit,
      difficulty,
      hintsEnabled,
      isPrivate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#151B23] border border-white/10 rounded-3xl p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#39E75F]/20 text-[#39E75F] flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wide">
                Custom Match Setup
              </h2>
              <p className="text-xs text-[#9AA4B2]">Configure room rules and invites</p>
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

        <form onSubmit={handleCreate} className="mt-4 space-y-4">
          {/* Game Mode */}
          <div>
            <label className="block text-xs font-bold text-[#9AA4B2] uppercase mb-1.5">
              Select Football Challenge
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setMode('two_clubs');
                }}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  mode === 'two_clubs'
                    ? 'bg-[#39E75F]/15 border-[#39E75F] text-white shadow-md'
                    : 'bg-[#0B0F14] border-white/10 text-[#9AA4B2] hover:text-white'
                }`}
              >
                <div className="text-lg mb-1">⚡</div>
                <div className="text-xs font-black uppercase text-white">Two Clubs</div>
                <div className="text-[10px] text-[#9AA4B2] mt-0.5">Guess shared player</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setMode('shirt_history');
                }}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  mode === 'shirt_history'
                    ? 'bg-[#39E75F]/15 border-[#39E75F] text-white shadow-md'
                    : 'bg-[#0B0F14] border-white/10 text-[#9AA4B2] hover:text-white'
                }`}
              >
                <div className="text-lg mb-1">👕</div>
                <div className="text-xs font-black uppercase text-white">Shirt History</div>
                <div className="text-[10px] text-[#9AA4B2] mt-0.5">Chronological jersey numbers</div>
              </button>
            </div>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-xs font-bold text-[#9AA4B2] uppercase mb-1.5">
              Rounds / Questions
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setQuestionsCount(num);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    questionsCount === num
                      ? 'bg-[#39E75F] text-[#0B0F14] border-[#39E75F]'
                      : 'bg-[#0B0F14] text-[#9AA4B2] border-white/10 hover:text-white'
                  }`}
                >
                  {num} Questions
                </button>
              ))}
            </div>
          </div>

          {/* Time Limit */}
          <div>
            <label className="block text-xs font-bold text-[#9AA4B2] uppercase mb-1.5 flex items-center justify-between">
              <span>Time Limit Per Question</span>
              <span className="text-[#39E75F] font-mono">{timeLimit}s</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[15, 20, 30].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setTimeLimit(sec);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1 ${
                    timeLimit === sec
                      ? 'bg-[#39E75F] text-[#0B0F14] border-[#39E75F]'
                      : 'bg-[#0B0F14] text-[#9AA4B2] border-white/10 hover:text-white'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>{sec}s</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Hints */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-[#9AA4B2] uppercase mb-1.5">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#39E75F]"
              >
                <option value="any">Any Difficulty</option>
                <option value="easy">Easy Only</option>
                <option value="medium">Medium Only</option>
                <option value="hard">Hard Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#9AA4B2] uppercase mb-1.5">Hints</label>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setHintsEnabled(!hintsEnabled);
                }}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  hintsEnabled
                    ? 'bg-[#39E75F]/20 text-[#39E75F] border-[#39E75F]/40'
                    : 'bg-[#0B0F14] text-[#9AA4B2] border-white/10'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{hintsEnabled ? 'Enabled (-25pts)' : 'Disabled'}</span>
              </button>
            </div>
          </div>

          {/* Privacy */}
          <div className="pt-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setIsPrivate(true);
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  isPrivate
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-[#0B0F14] text-[#9AA4B2] border-white/10'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Private Room</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setIsPrivate(false);
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  !isPrivate
                    ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                    : 'bg-[#0B0F14] text-[#9AA4B2] border-white/10'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Public Match</span>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-3.5 rounded-xl bg-[#39E75F] text-[#0B0F14] font-black text-sm uppercase tracking-wider hover:bg-[#2ed252] transition shadow-lg shadow-[#39E75F]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Create Match Lobby</span>
          </button>
        </form>
      </div>
    </div>
  );
};
