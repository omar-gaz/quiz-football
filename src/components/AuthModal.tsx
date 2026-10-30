import React, { useState } from 'react';
import { api } from '../services/api.ts';
import { UserProfile } from '../types/football.ts';
import { AVATAR_PRESETS } from '../utils/footballAssets.ts';
import { Trophy, Zap, Shield, User, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { playClickSound, playWhistleSound } from '../services/sound.ts';

interface AuthModalProps {
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
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
          setError('Username and password are required');
          setLoading(false);
          return;
        }
        const res = await api.register({
          username: username.trim(),
          displayName: displayName.trim() || username.trim(),
          avatar,
          password,
        });
        playWhistleSound();
        onSuccess(res.user);
      } else {
        if (!username.trim()) {
          setError('Please enter your username');
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
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Demo account quick switch
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
      <div className="w-full max-w-md bg-[#151B23] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Stadium light visual glow */}
        <div className="absolute -top-24 -left-24 w-52 h-52 bg-[#39E75F]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-[#39E75F]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-6 relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#166534] via-[#22c55e] to-[#39E75F] text-2xl shadow-xl shadow-[#39E75F]/20 mb-3">
            ⚽
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-white">
            Pitch<span className="text-[#39E75F]">Trivia</span>
          </h1>
          <p className="text-sm text-[#9AA4B2] mt-1">
            Real-time multiplayer football knowledge arena
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 bg-[#0B0F14] rounded-2xl mb-6 border border-white/5">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setMode('login');
              setError(null);
            }}
            className={`py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer ${
              mode === 'login'
                ? 'bg-[#151B23] text-[#39E75F] shadow-md border border-[#39E75F]/20'
                : 'text-[#9AA4B2] hover:text-white'
            }`}
          >
            Log In
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
                ? 'bg-[#151B23] text-[#39E75F] shadow-md border border-[#39E75F]/20'
                : 'text-[#9AA4B2] hover:text-white'
            }`}
          >
            Sign Up
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9AA4B2] mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#9AA4B2] absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. striker99"
                required
                className="w-full bg-[#0B0F14] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#39E75F] transition"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9AA4B2] mb-1.5">
                Display Name (Optional)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Cristiano Fanatic"
                className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#39E75F] transition"
              />
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9AA4B2] mb-1.5">
                Choose Player Avatar
              </label>
              <div className="grid grid-cols-5 gap-2 p-2 bg-[#0B0F14] rounded-xl border border-white/5">
                {AVATAR_PRESETS.map((p) => (
                  <button
                    key={p.emoji}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setAvatar(p.emoji);
                    }}
                    className={`h-10 rounded-lg flex items-center justify-center text-lg transition cursor-pointer ${
                      avatar === p.emoji
                        ? 'bg-[#39E75F]/20 border-2 border-[#39E75F] scale-105'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                    title={p.label}
                  >
                    {p.emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9AA4B2] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9AA4B2] absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#0B0F14] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#39E75F] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#39E75F] text-[#0B0F14] font-black text-sm uppercase tracking-wider hover:bg-[#2ed252] transition shadow-lg shadow-[#39E75F]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="animate-spin text-lg">⚽</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Enter Pitch' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Fast Multi-user testing shortcut */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-[#9AA4B2] mb-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant Test Accounts (for 2-player testing):</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('striker_cr7')}
              className="px-3 py-2 bg-[#0B0F14] hover:bg-white/10 border border-white/10 rounded-xl text-left text-xs transition cursor-pointer flex items-center gap-2"
            >
              <span className="text-base">⚡</span>
              <div className="truncate">
                <div className="font-bold text-white truncate">Player 1: CR7</div>
                <div className="text-[10px] text-[#9AA4B2]">@striker_cr7</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('leo_legend')}
              className="px-3 py-2 bg-[#0B0F14] hover:bg-white/10 border border-white/10 rounded-xl text-left text-xs transition cursor-pointer flex items-center gap-2"
            >
              <span className="text-base">👑</span>
              <div className="truncate">
                <div className="font-bold text-white truncate">Player 2: Messi</div>
                <div className="text-[10px] text-[#9AA4B2]">@leo_legend</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
