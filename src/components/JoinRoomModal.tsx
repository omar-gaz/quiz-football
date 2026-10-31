import React, { useState } from 'react';
import { socketService } from '../services/socket.ts';
import { X, ArrowRight, KeyRound, ClipboardCheck } from 'lucide-react';
import { playClickSound, playWhistleSound } from '../services/sound.ts';
import { useTranslation } from '../context/LanguageContext.tsx';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ isOpen, onClose }) => {
  const { isRTL } = useTranslation();
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!cleanCode) return;
    playClickSound();
    playWhistleSound();
    socketService.joinRoom(cleanCode);
    onClose();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        // Support either raw code or full URL (?room=CODE)
        let extracted = text.trim();
        if (extracted.includes('room=')) {
          extracted = extracted.split('room=')[1].split('&')[0];
        } else if (extracted.includes('join=')) {
          extracted = extracted.split('join=')[1].split('&')[0];
        }
        setCode(extracted.toUpperCase().slice(0, 6));
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl relative border border-[#29312B] overflow-hidden">
        {/* Stadium accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B7F34A] to-transparent" />

        <div className="flex items-center justify-between pb-4 border-b border-[#29312B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#171D19] border border-[#29312B] text-[#B7F34A] flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#F5F5F0] tracking-wide">
                {isRTL ? 'الانضمام بكود الغرفة' : 'Join Match Room'}
              </h2>
              <p className="text-xs text-[#A1AAA2]">
                {isRTL ? 'أدخل كود الغرفة المكون من 6 خانات' : 'Enter 6-character room code'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 text-[#A1AAA2] hover:text-white rounded-xl bg-[#171D19] border border-[#29312B] hover:border-white/20 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleJoin} className="mt-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#A1AAA2] uppercase">
                {isRTL ? 'كود الغرفة' : 'Room Code'}
              </label>
              <button
                type="button"
                onClick={handlePaste}
                className="text-[11px] text-[#B7F34A] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <ClipboardCheck className="w-3 h-3" />
                <span>{isRTL ? 'لصق الكود' : 'Paste Code'}</span>
              </button>
            </div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={6}
              placeholder="e.g. 7K8B2P"
              className="w-full bg-[#080A09] border-2 border-[#29312B] focus:border-[#B7F34A] rounded-2xl py-3 px-4 text-center font-mono text-2xl font-black tracking-widest text-[#F5F5F0] uppercase focus:outline-none transition shadow-inner"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#B7F34A] text-[#080A09] font-black text-xs uppercase tracking-wider hover:bg-[#a6e038] transition shadow-lg shadow-[#B7F34A]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isRTL ? 'دخول الغرفة' : 'Enter Match'}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </form>
      </div>
    </div>
  );
};
