import React, { useState } from 'react';
import { api } from '../services/api.ts';
import { UserProfile } from '../types/football.ts';
import { AVATAR_PRESETS } from '../utils/footballAssets.ts';
import { Trophy, Zap, Shield, User, Lock, ArrowRight, Sparkles, Check } from 'lucide-react';
import { playClickSound, playWhistleSound } from '../services/sound.ts';
import { useTranslation } from '../context/LanguageContext.tsx';

interface AuthModalProps {
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const { isRTL } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('⚽');
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

  // Quick Demo Accounts for fast testing
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
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-[#29312B]">
        {/* Subtle radial stadium floodlight glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#B7F34A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-[#D6BD83]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Stadium pitch grid accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B7F34A] to-transparent" />

        {/* Header */}
        <div className="text-center mb-6 relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#171D19] border border-[#29312B] text-2xl shadow-xl shadow-[#B7F34A]/10 mb-3 text-[#B7F34A]">
            ⚽
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-[#F5F5F0]">
            PITCH<span className="text-[#B7F34A]">TRIVIA</span>
          </h1>
          <p className="text-xs text-[#A1AAA2] mt-1 font-medium">
            {isRTL
              ? 'ساحة التحديات الكروية متعددة اللاعبين في الوقت الفعلي'
              : 'Real-time multiplayer football knowledge arena'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#111512] rounded-2xl mb-6 border border-[#29312B]">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setMode('login');
              setError(null);
            }}
            className={`py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer ${
              mode === 'login'
                ? 'bg-[#171D19] text-[#B7F34A] shadow-md border border-[#B7F34A]/30'
                : 'text-[#A1AAA2] hover:text-[#F5F5F0]'
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
            className={`py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer ${
              mode === 'register'
                ? 'bg-[#171D19] text-[#B7F34A] shadow-md border border-[#B7F34A]/30'
                : 'text-[#A1AAA2] hover:text-[#F5F5F0]'
            }`}
          >
            {isRTL ? 'حساب جديد' : 'Sign Up'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A1AAA2] mb-1.5">
              {isRTL ? 'اسم المستخدم (لتسجيل الدخول والبحث)' : 'Username (Unique handle)'}
            </label>
            <div className="relative">
              <User className={`w-4 h-4 text-[#A1AAA2] absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3`} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isRTL ? 'مثال: striker99' : 'e.g. striker99'}
                required
                className={`w-full bg-[#080A09] border border-[#29312B] rounded-xl ${
                  isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
                } py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B7F34A] transition`}
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A1AAA2] mb-1.5">
                  {isRTL ? 'الاسم المعروض في اللعبة والرومات (يظهر للاعبين)' : 'In-Game Display Name (Seen in matches)'}
                </label>
                <div className="relative">
                  <Sparkles className={`w-4 h-4 text-[#B7F34A] absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3`} />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={isRTL ? 'مثال: الكابتن أحمد' : 'e.g. Captain Zidane'}
                    className={`w-full bg-[#080A09] border border-[#29312B] rounded-xl ${
                      isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
                    } py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B7F34A] transition`}
                  />
                </div>
                <p className="text-[10px] text-[#A1AAA2] mt-1">
                  {isRTL ? 'هذا هو الاسم الذي سيظهر في الرومات والمباريات دائماً' : 'This exact name will be shown in all rooms and matches.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A1AAA2] mb-1.5">
                  {isRTL ? 'اختر أيقونة اللاعب' : 'Select Player Avatar'}
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.emoji}
                      type="button"
                      title={preset.label}
                      onClick={() => {
                        playClickSound();
                        setAvatar(preset.emoji);
                      }}
                      className={`h-11 rounded-xl text-xl flex items-center justify-center border transition cursor-pointer ${
                        avatar === preset.emoji
                          ? 'bg-[#171D19] border-[#B7F34A] text-[#B7F34A] shadow-[0_0_12px_rgba(183,243,74,0.3)]'
                          : 'bg-[#080A09] border-[#29312B] text-[#A1AAA2] hover:border-white/20'
                      }`}
                    >
                      {preset.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A1AAA2] mb-1.5">
              {isRTL ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <Lock className={`w-4 h-4 text-[#A1AAA2] absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3`} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`w-full bg-[#080A09] border border-[#29312B] rounded-xl ${
                  isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
                } py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B7F34A] transition`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#B7F34A] text-[#080A09] font-black text-xs uppercase tracking-wider hover:bg-[#a6e038] transition shadow-lg shadow-[#B7F34A]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>
              {loading
                ? isRTL ? 'جاري التحميل...' : 'Connecting...'
                : mode === 'login'
                ? isRTL ? 'دخول الملعب' : 'Enter Arena'
                : isRTL ? 'إنشاء حساب والانطلاق' : 'Create Account & Play'}
            </span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="mt-6 pt-5 border-t border-[#29312B] text-center">
          <p className="text-[11px] text-[#A1AAA2] uppercase tracking-wider font-semibold mb-2.5">
            {isRTL ? 'أو تجربة سريعة بحساب تجريبي' : 'Or quick play with demo profile'}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('striker99')}
              className="flex-1 py-2 px-3 rounded-xl bg-[#171D19] border border-[#29312B] hover:border-[#B7F34A]/50 text-xs font-bold text-[#F5F5F0] hover:text-[#B7F34A] transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>⚡</span>
              <span>Striker99</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('midfield_maestro')}
              className="flex-1 py-2 px-3 rounded-xl bg-[#171D19] border border-[#29312B] hover:border-[#B7F34A]/50 text-xs font-bold text-[#F5F5F0] hover:text-[#B7F34A] transition cursor-pointer flex items-center justify-center gap-1.5"
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
