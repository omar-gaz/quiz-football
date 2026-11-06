import React, { useState } from 'react';
import { socketService } from '../services/socket.ts';
import { X } from 'lucide-react';
import { playClickSound, playWhistleSound } from '../services/sound.ts';
import { useTranslation } from '../context/LanguageContext.tsx';
import { IconTacticalClipboard, IconFootball } from './Football3DIcons.tsx';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in text-white">
      <div className="w-full max-w-sm bg-[#0F3460] border-4 border-black p-6 shadow-[8px_8px_0px_#000000] relative">
        {/* Top brutalist bar */}
        <div className="h-2 bg-[#00B140] border-b-2 border-black -mx-6 -mt-6 mb-5" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b-3 border-black">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#16213E] border-3 border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center shrink-0">
              <IconTacticalClipboard size={32} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight">
                {isRTL ? 'الانضمام بكود الغرفة' : 'Join Match Room'}
              </h2>
              <p className="text-xs font-bold text-[#B0BEC5]">
                {isRTL ? 'أدخل كود الغرفة المكون من 6 خانات' : 'Enter 6-character room code'}
              </p>
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

        {/* Form */}
        <form onSubmit={handleJoin} className="mt-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black text-white uppercase tracking-wider">
                {isRTL ? 'كود الغرفة' : 'Room Code'}
              </label>
              <button
                type="button"
                onClick={handlePaste}
                className="text-[11px] font-black uppercase bg-[#FFD700] text-black border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer"
              >
                <span>{isRTL ? 'لصق الكود' : 'Paste Code'}</span>
              </button>
            </div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={6}
              placeholder="E.G. 7K8B2P"
              className="w-full bg-[#16213E] border-4 border-black py-3 px-4 text-center font-mono text-2xl font-black tracking-widest text-[#FFD700] uppercase focus:outline-none focus:bg-[#0F3460] transition shadow-[4px_4px_0px_#000]"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#00B140] hover:bg-[#008F32] text-white font-black text-sm uppercase tracking-wider border-4 border-black shadow-[5px_5px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_#000000] transition flex items-center justify-center gap-2 cursor-pointer active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            <IconFootball size={20} />
            <span>{isRTL ? 'دخول الغرفة والتحدي' : 'Enter Match & Play'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
