import React, { useState, useEffect } from 'react';
import { GameModeType, DifficultyType, UserProfile } from '../types/football.ts';
import { socketService } from '../services/socket.ts';
import { api } from '../services/api.ts';
import { playClickSound, playWhistleSound } from '../services/sound.ts';
import { useTranslation } from '../context/LanguageContext.tsx';
import {
  IconFootball,
  IconFootballPitch,
  IconFootballJersey,
  IconFootballBoots,
  IconFootballPlayers,
  IconRefereeStopwatch,
  IconTacticalClipboard,
  Football3DBadge,
} from './Football3DIcons.tsx';

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
  const { isRTL } = useTranslation();
  const [mode, setMode] = useState<GameModeType>(defaultMode);
  const [questionsCount, setQuestionsCount] = useState<number>(5);
  const [timeLimit, setTimeLimit] = useState<number>(20);
  const [difficulty, setDifficulty] = useState<DifficultyType | 'any'>('any');
  const [hintsEnabled] = useState<boolean>(true);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setLoadingFriends(true);
      api.getFriends()
        .then((data) => {
          setFriends(data.friends || []);
        })
        .catch(() => {})
        .finally(() => setLoadingFriends(false));
    }
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

  const toggleSelectFriend = (id: string) => {
    playClickSound();
    setSelectedFriendIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleStart = (isQuickMatchLaunch = false) => {
    playClickSound();
    playWhistleSound();

    if (isQuickMatchLaunch && !isPrivate && selectedFriendIds.length === 0) {
      socketService.quickMatch(mode);
      onClose();
      return;
    }

    socketService.createRoom({
      mode,
      questionsCount,
      timeLimit,
      difficulty,
      hintsEnabled,
      isPrivate,
    });

    const unsub = socketService.on('room_created', (data: { code: string }) => {
      if (selectedFriendIds.length > 0) {
        for (const fId of selectedFriendIds) {
          socketService.inviteFriend(fId, data.code);
        }
      }
      unsub();
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-fade-in text-white">
      <div className="w-full max-w-xl bg-[#0F3460] border-[4px] border-black shadow-[8px_8px_0px_#000000] p-6 sm:p-7 relative max-h-[92vh] flex flex-col">
        {/* Top stark border strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#00B140] border-b-2 border-black" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-[3.5px] border-black shrink-0 mt-1">
          <div className="flex items-center gap-2.5">
            <Football3DBadge name="boots" baseColor="green" size="sm" />
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight">
                {isRTL ? 'إعداد المباراة وبدء اللعب' : 'MATCH SETUP & PLAY'}
              </h2>
              <p className="text-xs text-[#B0BEC5] font-bold">
                {isRTL ? 'حدد إعدادات المباراة، الصعوبة، ودعوة الأصدقاء' : 'Configure rules, difficulty, timer & invite friends'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 bg-[#CC0000] text-white border-2 border-black font-black text-xs hover:bg-black transition cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div className="mt-4 space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar text-white">
          {/* 1. Game Mode Selection */}
          <div>
            <label className="block text-xs font-black uppercase mb-2">
              {isRTL ? '1. اختر نمط اللعبة' : '1. CHOOSE GAME MODE'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Mode 1 */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setMode('two_clubs');
                }}
                className={`p-3 border-[3px] border-black text-left transition cursor-pointer ${
                  mode === 'two_clubs'
                    ? 'bg-[#00B140] text-white shadow-[3px_3px_0px_#000] translate-x-[1px] translate-y-[1px]'
                    : 'bg-[#16213E] text-white hover:bg-[#1A2647] shadow-[3px_3px_0px_#000]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <IconFootballJersey className="w-5 h-5" />
                  {mode === 'two_clubs' && (
                    <span className="w-4 h-4 bg-black text-[#00B140] flex items-center justify-center text-[10px] font-black">
                      ✓
                    </span>
                  )}
                </div>
                <div className="text-xs font-black uppercase">
                  {isRTL ? 'لاعب بين الناديين' : 'Two Clubs'}
                </div>
                <div className="text-[10px] text-[#B0BEC5] font-bold mt-0.5">
                  {isRTL ? 'خمن اللاعب المشترك' : 'Guess shared player'}
                </div>
              </button>

              {/* Mode 2 */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setMode('shirt_history');
                }}
                className={`p-3 border-[3px] border-black text-left transition cursor-pointer ${
                  mode === 'shirt_history'
                    ? 'bg-[#00B140] text-white shadow-[3px_3px_0px_#000] translate-x-[1px] translate-y-[1px]'
                    : 'bg-[#16213E] text-white hover:bg-[#1A2647] shadow-[3px_3px_0px_#000]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <IconFootballBoots className="w-5 h-5" />
                  {mode === 'shirt_history' && (
                    <span className="w-4 h-4 bg-black text-[#00B140] flex items-center justify-center text-[10px] font-black">
                      ✓
                    </span>
                  )}
                </div>
                <div className="text-xs font-black uppercase">
                  {isRTL ? 'تاريخ القمصان' : 'Shirt History'}
                </div>
                <div className="text-[10px] text-[#B0BEC5] font-bold mt-0.5">
                  {isRTL ? 'أرقام القمصان والنوادي' : 'Career jersey numbers'}
                </div>
              </button>

              {/* Mode 3 */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setMode('nationalities');
                }}
                className={`p-3 border-[3px] border-black text-left transition cursor-pointer ${
                  mode === 'nationalities'
                    ? 'bg-[#00B140] text-white shadow-[3px_3px_0px_#000] translate-x-[1px] translate-y-[1px]'
                    : 'bg-[#16213E] text-white hover:bg-[#1A2647] shadow-[3px_3px_0px_#000]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <IconFootballPitch className="w-5 h-5" />
                  {mode === 'nationalities' && (
                    <span className="w-4 h-4 bg-black text-[#00B140] flex items-center justify-center text-[10px] font-black">
                      ✓
                    </span>
                  )}
                </div>
                <div className="text-xs font-black uppercase">
                  {isRTL ? 'جنسيات اللاعبين' : 'Nationalities'}
                </div>
                <div className="text-[10px] text-[#B0BEC5] font-bold mt-0.5">
                  {isRTL ? 'خمن النادي من التشكيلة' : 'Guess club from flags'}
                </div>
              </button>
            </div>
          </div>

          {/* 2. Questions Count & Time Limit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase mb-1.5 text-[#B0BEC5]">
                {isRTL ? '2. عدد الأسئلة' : '2. QUESTIONS COUNT'}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[3, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setQuestionsCount(num);
                    }}
                    className={`py-2 text-xs font-black uppercase border-[2.5px] border-black transition cursor-pointer ${
                      questionsCount === num
                        ? 'bg-[#00B140] text-white shadow-[2px_2px_0px_#000] translate-x-[1px] translate-y-[1px]'
                        : 'bg-[#16213E] text-white hover:bg-[#1A2647]'
                    }`}
                  >
                    {num} {isRTL ? 'أسئلة' : 'Q'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-1.5 flex items-center justify-between text-[#B0BEC5]">
                <span>{isRTL ? '3. وقت الإجابة (ثواني)' : '3. TIME LIMIT'}</span>
                <span className="bg-[#FFD700] text-black px-1 border border-black font-mono font-black">{timeLimit}s</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[15, 20, 30].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setTimeLimit(sec);
                    }}
                    className={`py-2 text-xs font-black uppercase border-[2.5px] border-black transition cursor-pointer flex items-center justify-center gap-1 ${
                      timeLimit === sec
                        ? 'bg-[#00B140] text-white shadow-[2px_2px_0px_#000] translate-x-[1px] translate-y-[1px]'
                        : 'bg-[#16213E] text-white hover:bg-[#1A2647]'
                    }`}
                  >
                    <IconRefereeStopwatch className="w-3.5 h-3.5" />
                    <span>{sec}s</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Difficulty & Privacy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase mb-1.5 text-[#B0BEC5]">
                {isRTL ? '4. مستوى الصعوبة' : '4. DIFFICULTY'}
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full neo-input py-2 text-xs font-black uppercase bg-[#16213E] text-white border-[2.5px] border-black"
              >
                <option value="any">{isRTL ? 'جميع المستويات (متنوع)' : 'Any Difficulty'}</option>
                <option value="easy">{isRTL ? 'سهل' : 'Easy'}</option>
                <option value="medium">{isRTL ? 'متوسط' : 'Medium'}</option>
                <option value="hard">{isRTL ? 'صعب (محترف)' : 'Hard Only'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-1.5 text-[#B0BEC5]">
                {isRTL ? '5. نوع المباراة' : '5. PRIVACY'}
              </label>
              <button
                type="button"
                onClick={() => setIsPrivate(!isPrivate)}
                className="w-full h-[40px] px-3 bg-[#16213E] border-[2.5px] border-black hover:bg-[#1A2647] text-xs font-black uppercase flex items-center justify-center gap-1.5 transition cursor-pointer shadow-[2px_2px_0px_#000] text-white"
              >
                {isPrivate ? (
                  <>
                    <span>🔒</span>
                    <span>{isRTL ? 'خاصة (كود ودعوات)' : 'Private (Code & Invites)'}</span>
                  </>
                ) : (
                  <>
                    <span>🌐</span>
                    <span>{isRTL ? 'عامة (متاحة للجميع)' : 'Public Match'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 4. Select Friends to Invite */}
          <div className="p-3.5 bg-[#16213E] border-[3px] border-black space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase flex items-center gap-1.5 text-white">
                <IconFootballPlayers className="w-4 h-4" />
                <span>{isRTL ? '6. اختيار الأصدقاء للدعوة:' : '6. INVITE FRIENDS DIRECTLY:'}</span>
              </span>
              <span className="text-[10px] font-black bg-[#FFD700] text-black px-1.5 py-0.2 border border-black">
                {selectedFriendIds.length} {isRTL ? 'محدد' : 'SELECTED'}
              </span>
            </div>

            {loadingFriends ? (
              <div className="text-center py-3 text-xs font-bold text-[#B0BEC5]">
                {isRTL ? 'جاري تحميل الأصدقاء...' : 'Loading friends...'}
              </div>
            ) : friends.length === 0 ? (
              <div className="text-center py-2 text-xs font-bold text-[#B0BEC5]">
                {isRTL ? 'لا يوجد أصدقاء بعد. يمكنك إضافة منافسين من قائمة الأصدقاء!' : 'No friends yet. Add friends to challenge them!'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                {friends.map((f) => {
                  const isSelected = selectedFriendIds.includes(f.id);
                  return (
                    <div
                      key={f.id}
                      onClick={() => toggleSelectFriend(f.id)}
                      className={`p-2 border-[2.5px] border-black flex items-center justify-between cursor-pointer transition ${
                        isSelected
                          ? 'bg-[#00B140] text-white shadow-[2px_2px_0px_#000]'
                          : 'bg-[#0F3460] text-white hover:bg-[#16213E]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 bg-[#16213E] border border-black flex items-center justify-center text-sm font-black">
                          {f.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black truncate">{f.displayName || f.username}</p>
                          <span className="text-[9px] font-mono font-bold text-[#FFD700]">
                            {f.totalPoints} PTS
                          </span>
                        </div>
                      </div>
                      <div className={`w-5 h-5 border-2 border-black flex items-center justify-center text-xs font-black ${
                        isSelected ? 'bg-black text-[#00B140]' : 'bg-[#16213E] text-white'
                      }`}>
                        {isSelected && '✓'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Dual Actions Footer */}
        <div className="pt-4 border-t-[3.5px] border-black flex flex-col sm:flex-row gap-2.5 shrink-0 mt-3">
          <button
            type="button"
            onClick={() => handleStart(true)}
            className="flex-1 py-3.5 neo-btn-green text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <IconFootball className="w-4 h-4" />
            <span>{isRTL ? 'العب الآن بالإعدادات المختارة' : 'START MATCH NOW'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleStart(false)}
            className="sm:w-auto px-5 py-3.5 neo-btn-secondary text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <IconTacticalClipboard className="w-4 h-4" />
            <span>{isRTL ? 'إنشاء غرفة ودعوة' : 'CREATE ROOM & INVITE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
