import React from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import { playClickSound } from '../services/sound.ts';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();

  const handleSelectDark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (theme !== 'dark') {
      playClickSound();
      setTheme('dark');
    }
  };

  const handleSelectLight = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (theme !== 'light') {
      playClickSound();
      setTheme('light');
    }
  };

  return (
    <div
      dir="ltr"
      role="radiogroup"
      aria-label="Theme toggle"
      className={`relative inline-flex items-center h-9 w-[160px] p-[2px] rounded-none border-[3px] border-black shadow-[3px_3px_0px_#000000] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_#000000] transition-all duration-150 select-none ${className}`}
      style={{
        backgroundColor: theme === 'dark' ? '#0F3460' : '#FFFFFF',
      }}
    >
      {/* Sliding Active Pill */}
      <div
        className={`absolute top-[2px] bottom-[2px] w-[calc(50%-2px)] bg-[#00B140] border-[2px] border-black rounded-none transition-all duration-150 ease-out pointer-events-none z-0 ${
          theme === 'dark' ? 'left-[2px]' : 'left-[calc(50%)]'
        }`}
      />

      {/* 🌙 DARK State */}
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'dark'}
        onClick={handleSelectDark}
        className={`relative z-10 flex-1 h-full rounded-none flex items-center justify-center gap-1 text-[11px] font-black uppercase tracking-wider cursor-pointer transition-colors duration-150 ${
          theme === 'dark'
            ? 'text-white'
            : 'text-[#555555] dark:text-[#B0BEC5] hover:text-black dark:hover:text-white bg-transparent'
        }`}
      >
        <span className="text-xs leading-none">🌙</span>
        <span className="leading-none">DARK</span>
      </button>

      {/* ☀️ LIGHT State */}
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'light'}
        onClick={handleSelectLight}
        className={`relative z-10 flex-1 h-full rounded-none flex items-center justify-center gap-1 text-[11px] font-black uppercase tracking-wider cursor-pointer transition-colors duration-150 ${
          theme === 'light'
            ? 'text-white'
            : 'text-[#555555] dark:text-[#B0BEC5] hover:text-black dark:hover:text-white bg-transparent'
        }`}
      >
        <span className="text-xs leading-none">☀️</span>
        <span className="leading-none">LIGHT</span>
      </button>
    </div>
  );
};
