import React, { useState } from 'react';
import { api } from '../services/api.ts';
import { UserProfile } from '../types/football.ts';
import { AVATAR_PRESETS } from '../utils/footballAssets.ts';
import { PlayerCharacterAvatar } from './PlayerCharacterAvatar.tsx';
import { ArrowRight } from 'lucide-react';
import { playClickSound, playWhistleSound } from '../services/sound.ts';
import { useTranslation } from '../context/LanguageContext.tsx';
import { IconFootball, IconFootballPoints, IconCaptainArmband } from './Football3DIcons.tsx';
import { ThemeToggle } from './ThemeToggle.tsx';

interface AuthModalProps {
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const { isRTL } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('striker');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    playClickSound();

    try {
      if (mode === 'register') {
        if (!username.trim() || !password) {
          setError(isRTL ? 'يرجى إدخال اسم المستخدم وكلمة المرور' : 'Username and password are required');
          setLoading(false);
          return;
        }
        const chosenDisplayName = displayName.trim() || username.trim();
        const res = await api.register({
          username: username.trim(),
          displayName: chosenDisplayName,
          avatar,
          password,
        });
        playWhistleSound();
        onSuccess(res.user);
      } else {
        if (!username.trim()) {
          setError(isRTL ? 'يرجى إدخال اسم المستخدم' : 'Please enter your username');
          setLoading(false);
          return;
        }
        const res = await api.login({
          username: username.trim(),
          password,
        });
        playWhistleSound();
        onSuccess(res.user);
      }
    } catch (err: any) {
      setError(err.message || (isRTL ? 'فشل تسجيل الدخول' : 'Authentication failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoUsername: string) => {
    setError(null);
    setLoading(true);
    playClickSound();
    try {
      const res = await api.login({ username: demoUsername, password: 'pass123' });
      playWhistleSound();
      onSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0F3460] border-4 border-black p-6 sm:p-8 shadow-[10px_10px_0px_#000000] relative text-white">
        {/* Top brutalist bar with ThemeToggle */}
        <div className="flex items-center justify-between h-9 bg-[#00B140] border-b-3 border-black -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6 px-3">
          <span className="text-[10px] font-black text-white uppercase tracking-wider">OFFICIAL PITCH AUTH</span>
          <div className="scale-90 origin-right">
            <ThemeToggle />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00B140] border-4 border-black shadow-[4px_4px_0px_#000000] mb-3">
            <IconFootball size={42} />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">
              PITCH<span className="bg-[#FFD700] text-black px-1 border-2 border-black ml-1">TRIVIA</span>
            </h1>
          </div>
          <p className="text-xs font-bold text-[#B0BEC5] mt-2">
            {isRTL
              ? 'ساحة التحديات الكروية متعددة اللاعبين في الوقت الفعلي'
              : 'Real-time multiplayer football knowledge arena'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setMode('login');
              setError(null);
            }}
            className={`py-2.5 font-black text-xs uppercase tracking-wider border-3 border-black transition cursor-pointer ${
              mode === 'login'
                ? 'bg-[#00B140] shadow-[3px_3px_0px_#000] text-white translate-x-[1px] translate-y-[1px]'
                : 'bg-[#16213E] hover:bg-[#1A1A2E] text-white'
            }`}
          >
            {isRTL ? 'تسجيل الدخول' : 'Log In'}
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setMode('register');
              setError(null);
            }}
            className={`py-2.5 font-black text-xs uppercase tracking-wider border-3 border-black transition cursor-pointer ${
              mode === 'register'
                ? 'bg-[#00B140] shadow-[3px_3px_0px_#000] text-white translate-x-[1px] translate-y-[1px]'
                : 'bg-[#16213E] hover:bg-[#1A1A2E] text-white'
            }`}
          >
            {isRTL ? 'حساب جديد' : 'Sign Up'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#CC0000] text-white border-3 border-black shadow-[3px_3px_0px_#000] text-xs font-black uppercase flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#B0BEC5] mb-1.5">
              {isRTL ? 'اسم المستخدم (لتسجيل الدخول والبحث)' : 'Username (Unique handle)'}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={isRTL ? 'مثال: striker99' : 'e.g. striker99'}
              required
              className={`w-full bg-[#16213E] border-3 border-black py-2.5 px-3 text-sm font-bold text-white focus:outline-none focus:bg-[#0F3460] focus:border-[#00B140] shadow-[3px_3px_0px_#000] ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            />
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#B0BEC5] mb-1.5">
                  {isRTL ? 'الاسم المعروض في اللعبة والرومات' : 'In-Game Display Name'}
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={isRTL ? 'مثال: الكابتن أحمد' : 'e.g. Captain Zidane'}
                  className={`w-full bg-[#16213E] border-3 border-black py-2.5 px-3 text-sm font-bold text-white focus:outline-none focus:bg-[#0F3460] focus:border-[#00B140] shadow-[3px_3px_0px_#000] ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                />
                <p className="text-[10px] font-bold text-[#B0BEC5] mt-1">
                  {isRTL ? 'هذا هو الاسم الذي سيظهر في الرومات والمباريات دائماً' : 'This exact name will be shown in all rooms and matches.'}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-[#B0BEC5]">
                    {isRTL ? 'اختر شخصية اللاعب' : 'Select Football Player Avatar'}
                  </label>
                  <span className="text-[10px] font-black uppercase text-[#FFD700] font-mono">
                    {AVATAR_PRESETS.find((p) => p.id === avatar)?.label || 'Striker'}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = avatar === preset.id || avatar === preset.emoji;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        title={preset.label}
                        onClick={() => {
                          playClickSound();
                          setAvatar(preset.id);
                        }}
                        className={`h-16 p-1 border-2 border-black flex flex-col items-center justify-between transition cursor-pointer relative group ${
                          isSelected
                            ? 'bg-[#00B140] shadow-[3px_3px_0px_#000] translate-x-[1px] translate-y-[1px] ring-2 ring-[#FFD700]'
                            : 'bg-[#16213E] hover:bg-[#1A1A2E] shadow-[2px_2px_0px_#000]'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-none overflow-hidden flex items-center justify-center pointer-events-none">
                          <PlayerCharacterAvatar avatarId={preset.id} className="w-full h-full" />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-tight truncate max-w-full ${isSelected ? 'text-white' : 'text-[#B0BEC5]'}`}>
                          {preset.position}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#B0BEC5] mb-1.5">
              {isRTL ? 'كلمة المرور' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={`w-full bg-[#16213E] border-3 border-black py-2.5 px-3 text-sm font-bold text-white focus:outline-none focus:bg-[#0F3460] focus:border-[#00B140] shadow-[3px_3px_0px_#000] ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#00B140] hover:bg-[#008F32] text-white font-black text-xs uppercase tracking-wider border-4 border-black shadow-[5px_5px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_#000] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>
              {loading
                ? isRTL ? 'جاري التحميل...' : 'Connecting...'
                : mode === 'login'
                ? isRTL ? 'دخول الملعب واللعب' : 'Enter Arena & Play'
                : isRTL ? 'إنشاء حساب والانطلاق' : 'Create Squad & Play'}
            </span>
            <ArrowRight className={`w-4 h-4 font-black ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="mt-6 pt-5 border-t-3 border-black text-center">
          <p className="text-[11px] font-black uppercase tracking-wider text-[#B0BEC5] mb-2.5">
            {isRTL ? 'أو تجربة سريعة بحساب تجريبي' : 'Or quick play with demo profile'}
          </p>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('striker99')}
              className="flex-1 py-2 px-3 bg-[#16213E] hover:bg-[#0F3460] border-3 border-black shadow-[3px_3px_0px_#000] text-xs font-black uppercase text-white hover:text-[#FFD700] transition cursor-pointer flex items-center justify-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px]"
            >
              <span>⚡</span>
              <span>Striker99</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('midfield_maestro')}
              className="flex-1 py-2 px-3 bg-[#16213E] hover:bg-[#0F3460] border-3 border-black shadow-[3px_3px_0px_#000] text-xs font-black uppercase text-white hover:text-[#00B140] transition cursor-pointer flex items-center justify-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px]"
            >
              <span>🎯</span>
              <span>Maestro</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
