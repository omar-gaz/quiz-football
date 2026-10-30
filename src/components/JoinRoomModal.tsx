import React, { useState } from 'react';
import { socketService } from '../services/socket.ts';
import { X, ArrowRight, KeyRound } from 'lucide-react';
import { playClickSound, playWhistleSound } from '../services/sound.ts';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ isOpen, onClose }) => {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    playClickSound();
    playWhistleSound();
    socketService.joinRoom(code.trim().toUpperCase());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-[#151B23] border border-white/10 rounded-3xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#39E75F]/20 text-[#39E75F] flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-wide">
                Join Game Room
              </h2>
              <p className="text-xs text-[#9AA4B2]">Enter friend's 6-character room code</p>
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

        <form onSubmit={handleJoin} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#9AA4B2] uppercase mb-1.5 text-center">
              Room Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={6}
              placeholder="e.g. 7K8B2P"
              className="w-full bg-[#0B0F14] border-2 border-white/15 focus:border-[#39E75F] rounded-2xl py-3 px-4 text-center font-mono text-2xl font-black tracking-widest text-white uppercase focus:outline-none transition"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#39E75F] text-[#0B0F14] font-black text-sm uppercase tracking-wider hover:bg-[#2ed252] transition shadow-lg shadow-[#39E75F]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Enter Match</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
