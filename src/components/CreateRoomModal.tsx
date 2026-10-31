import React, { useState, useEffect } from 'react';
import { GameModeType, DifficultyType, UserProfile } from '../types/football.ts';
import { socketService } from '../services/socket.ts';
import { api } from '../services/api.ts';
import { X, Play, Settings, Clock, Sparkles, Shield, Lock, Globe, Check, Users, UserPlus, Swords } from 'lucide-react';
import { playClickSound, playWhistleSound } from '../services/sound.ts';
import { useTranslation } from '../context/LanguageContext.tsx';

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
  const { t, isRTL } = useTranslation();
  const [mode, setMode] = useState<GameModeType>(defaultMode);
  const [questionsCount, setQuestionsCount] = useState<number>(5);
  const [timeLimit, setTimeLimit] = useState<number>(20);
  const [difficulty, setDifficulty] = useState<DifficultyType | 'any'>('any');
  const [hintsEnabled, setHintsEnabled] = useState<boolean>(true);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  // Online friends list and selection for direct invite
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
      // Direct quick match
      socketService.quickMatch(mode);
      onClose();
      return;
    }

    // Create room with custom configuration
    socketService.createRoom({
      mode,
      questionsCount,
      timeLimit,
      difficulty,
      hintsEnabled,
      isPrivate,
    });

    // Listen once for room code to dispatch invitations to selected friends
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl relative border border-[#29312B] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Stadium accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B7F34A] to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#29312B] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#171D19] border border-[#29312B] text-[#B7F34A] flex items-center justify-center shadow">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#F5F5F0] tracking-wide">
                {isRTL ? 'إعداد المباراة وبدء اللعب' : 'Match Setup & Play'}
              </h2>
              <p className="text-xs text-[#A1AAA2]">
                {isRTL ? 'حدد إعدادات المباراة، الصعوبة، ودعوة الأصدقاء' : 'Configure rules, difficulty, timer & invite friends'}
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

        {/* Scrollable Form Body */}
        <div className="mt-4 space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
          {/* 1. Game Mode Selection */}
          <div>
            <label className="block text-xs font-bold text-[#A1AAA2] uppercase mb-2">
              {isRTL ? '1. اختر نمط اللعبة' : '1. Choose Game Mode'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Mode 1: Two Clubs */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setMode('two_clubs');
                }}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer relative overflow-hidden ${
                  mode === 'two_clubs'
                    ? 'bg-[#171D19] border-[#B7F34A] text-[#F5F5F0] shadow-[0_0_15px_rgba(183,243,74,0.2)]'
                    : 'bg-[#080A09] border-[#29312B] text-[#A1AAA2] hover:text-[#F5F5F0]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl">⚡</span>
                  {mode === 'two_clubs' && (
                    <span className="w-5 h-5 rounded-full bg-[#B7F34A] text-[#080A09] flex items-center justify-center text-xs font-black">
                      ✓
                    </span>
                  )}
                </div>
                <div className="text-xs font-black uppercase text-[#F5F5F0]">
                  {isRTL ? 'لاعب بين الناديين' : 'Two Clubs'}
                </div>
                <div className="text-[10px] text-[#A1AAA2] mt-0.5">
                  {isRTL ? 'خمن اللاعب المشترك' : 'Guess shared footballer'}
                </div>
              </button>

              {/* Mode 2: Shirt History */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setMode('shirt_history');
                }}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer relative overflow-hidden ${
                  mode === 'shirt_history'
                    ? 'bg-[#171D19] border-[#B7F34A] text-[#F5F5F0] shadow-[0_0_15px_rgba(183,243,74,0.2)]'
                    : 'bg-[#080A09] border-[#29312B] text-[#A1AAA2] hover:text-[#F5F5F0]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl">👕</span>
                  {mode === 'shirt_history' && (
                    <span className="w-5 h-5 rounded-full bg-[#B7F34A] text-[#080A09] flex items-center justify-center text-xs font-black">
                      ✓
                    </span>
                  )}
                </div>
                <div className="text-xs font-black uppercase text-[#F5F5F0]">
                  {isRTL ? 'تاريخ القمصان' : 'Shirt History'}
                </div>
                <div className="text-[10px] text-[#A1AAA2] mt-0.5">
                  {isRTL ? 'أرقام القمصان والنوادي' : 'Jersey numbers timeline'}
                </div>
              </button>

              {/* Mode 3: Guess Club by Nationalities */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setMode('nationalities');
                }}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer relative overflow-hidden ${
                  mode === 'nationalities'
                    ? 'bg-[#171D19] border-[#B7F34A] text-[#F5F5F0] shadow-[0_0_15px_rgba(183,243,74,0.2)]'
                    : 'bg-[#080A09] border-[#29312B] text-[#A1AAA2] hover:text-[#F5F5F0]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl">🌍</span>
                  {mode === 'nationalities' && (
                    <span className="w-5 h-5 rounded-full bg-[#B7F34A] text-[#080A09] flex items-center justify-center text-xs font-black">
                      ✓
                    </span>
                  )}
                </div>
                <div className="text-xs font-black uppercase text-[#F5F5F0]">
                  {isRTL ? 'جنسيات اللاعبين' : 'Nationalities'}
                </div>
                <div className="text-[10px] text-[#A1AAA2] mt-0.5">
                  {isRTL ? 'خمن النادي من التشكيلة' : 'Guess club from flags'}
                </div>
              </button>
            </div>
          </div>

          {/* 2. Questions Count & Time Limit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Number of Questions */}
            <div>
              <label className="block text-xs font-bold text-[#A1AAA2] uppercase mb-1.5">
                {isRTL ? '2. عدد الأسئلة' : '2. Questions Count'}
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
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      questionsCount === num
                        ? 'bg-[#B7F34A] text-[#080A09] border-[#B7F34A] shadow'
                        : 'bg-[#080A09] text-[#A1AAA2] border-[#29312B] hover:text-[#F5F5F0]'
                    }`}
                  >
                    {num} {isRTL ? 'أسئلة' : 'Q'}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Limit */}
            <div>
              <label className="block text-xs font-bold text-[#A1AAA2] uppercase mb-1.5 flex items-center justify-between">
                <span>{isRTL ? '3. وقت الإجابة (ثواني)' : '3. Time Limit'}</span>
                <span className="text-[#B7F34A] font-mono font-bold">{timeLimit}s</span>
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
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1 ${
                      timeLimit === sec
                        ? 'bg-[#B7F34A] text-[#080A09] border-[#B7F34A] shadow'
                        : 'bg-[#080A09] text-[#A1AAA2] border-[#29312B] hover:text-[#F5F5F0]'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{sec}s</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Difficulty & Privacy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#A1AAA2] uppercase mb-1.5">
                {isRTL ? '4. مستوى الصعوبة' : '4. Difficulty'}
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-[#080A09] border border-[#29312B] rounded-xl px-3 py-2 text-xs text-[#F5F5F0] focus:outline-none focus:border-[#B7F34A]"
              >
                <option value="any">{isRTL ? 'جميع المستويات (متنوع)' : 'Any Difficulty'}</option>
                <option value="easy">{isRTL ? 'سهل' : 'Easy'}</option>
                <option value="medium">{isRTL ? 'متوسط' : 'Medium'}</option>
                <option value="hard">{isRTL ? 'صعب (محترف)' : 'Hard Only'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A1AAA2] uppercase mb-1.5">
                {isRTL ? '5. نوع المباراة' : '5. Privacy'}
              </label>
              <button
                type="button"
                onClick={() => setIsPrivate(!isPrivate)}
                className="w-full h-[34px] px-3 bg-[#080A09] border border-[#29312B] hover:border-white/20 rounded-xl text-xs font-bold text-[#F5F5F0] flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                {isPrivate ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-[#D6BD83]" />
                    <span>{isRTL ? 'خاصة (كود ودعوات فقط)' : 'Private (Code & Invites)'}</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5 text-[#B7F34A]" />
                    <span>{isRTL ? 'عامة (متاحة للجميع)' : 'Public Match'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 4. Select Friends to Invite */}
          <div className="p-3.5 rounded-2xl bg-[#080A09] border border-[#29312B] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F5F5F0] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#B7F34A]" />
                <span>{isRTL ? '6. اختيار الأصدقاء للدعوة المباشرة:' : '6. Invite Friends Directly:'}</span>
              </span>
              <span className="text-[10px] text-[#A1AAA2]">
                {selectedFriendIds.length} {isRTL ? 'محدد' : 'selected'}
              </span>
            </div>

            {loadingFriends ? (
              <div className="text-center py-3 text-xs text-[#A1AAA2]">
                {isRTL ? 'جاري تحميل قائمة الأصدقاء...' : 'Loading friends...'}
              </div>
            ) : friends.length === 0 ? (
              <div className="text-center py-2 text-xs text-[#A1AAA2]">
                {isRTL ? 'لا يوجد لديك أصدقاء بعد. يمكنك إضافة أصدقاء من لوحة الأصدقاء!' : 'No friends yet. Add friends to invite them!'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                {friends.map((f) => {
                  const isSelected = selectedFriendIds.includes(f.id);
                  return (
                    <div
                      key={f.id}
                      onClick={() => toggleSelectFriend(f.id)}
                      className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        isSelected
                          ? 'bg-[#171D19] border-[#B7F34A] text-[#F5F5F0]'
                          : 'bg-[#111512] border-[#29312B] text-[#A1AAA2] hover:text-[#F5F5F0]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="relative text-base">
                          <span>{f.avatar}</span>
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-black ${
                              f.isOnline ? 'bg-[#B7F34A]' : 'bg-neutral-600'
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate text-[#F5F5F0]">
                            {f.displayName || f.username}
                          </p>
                          <span className="text-[9px] text-[#A1AAA2] block">
                            {f.isOnline ? (isRTL ? 'متصل الآن' : 'Online') : (isRTL ? 'غير متصل' : 'Offline')}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] font-black ${
                          isSelected
                            ? 'bg-[#B7F34A] text-[#080A09] border-[#B7F34A]'
                            : 'border-[#29312B]'
                        }`}
                      >
                        {isSelected && '✓'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#29312B] shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleStart(true)}
            className="w-full py-3 rounded-xl bg-[#B7F34A] text-[#080A09] font-black text-xs uppercase tracking-wider hover:bg-[#a6e038] transition shadow-lg shadow-[#B7F34A]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isRTL ? 'العب الآن بالإعدادات المختارة' : 'Play Match Now'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleStart(false)}
            className="w-full py-3 rounded-xl bg-[#171D19] border border-[#29312B] hover:border-[#B7F34A]/50 text-[#F5F5F0] font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#B7F34A]" />
            <span>{isRTL ? 'إنشاء غرفة ودعوة الأصدقاء' : 'Create Room & Invite'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
