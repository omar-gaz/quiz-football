import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [stage, setStage] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    // Stage 1: 0 - 1.2s
    const stage2Timer = setTimeout(() => {
      setStage(2);
    }, 1200);

    // Stage 2: 1.2 - 2.2s -> Loading completion starts at 2.2s
    const stage3Timer = setTimeout(() => {
      setStage(3);
    }, 2200);

    // After slide up animation finishes (2.2s + 450ms)
    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2650);

    return () => {
      clearTimeout(stage2Timer);
      clearTimeout(stage3Timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0C1B33] select-none transition-all duration-500 ease-[cubic-bezier(0.25,0,0.25,1)] ${
        stage === 3
          ? '-translate-y-full scale-[0.98] opacity-0 pointer-events-none'
          : 'translate-y-0 scale-100 opacity-100'
      }`}
    >
      {/* 3px Gold top and bottom accent bars */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C8963E]" />
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#C8963E]" />

      {/* Football pitch lines in background during Stage 2 & 3 (5% opacity) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          stage >= 2 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 800 1200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.05 }}
        >
          <rect x="40" y="40" width="720" height="1120" stroke="#C8963E" strokeWidth="3" />
          <line x1="40" y1="600" x2="760" y2="600" stroke="#C8963E" strokeWidth="3" />
          <circle cx="400" cy="600" r="110" stroke="#C8963E" strokeWidth="3" />
          <rect x="200" y="40" width="400" height="220" stroke="#C8963E" strokeWidth="3" />
          <rect x="200" y="940" width="400" height="220" stroke="#C8963E" strokeWidth="3" />
        </svg>
      </div>

      {/* Center Shield & Logo Animation */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div
          className={`transition-all duration-700 ease-out transform ${
            stage >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        >
          {/* Official Shield / Crest SVG with stroke animation */}
          <svg
            className="w-24 h-24 sm:w-28 sm:h-28"
            viewBox="0 0 100 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Shield Outline with stroke drawing */}
            <path
              d="M50 8 L88 22 C88 74 50 110 50 110 C50 110 12 74 12 22 Z"
              stroke="#C8963E"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 350,
                strokeDashoffset: stage >= 1 ? 0 : 350,
                transition: 'stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />

            {/* Inner Crest Football icon stroke */}
            <circle
              cx="50"
              cy="52"
              r="22"
              stroke="#C8963E"
              strokeWidth="2.5"
              style={{
                strokeDasharray: 140,
                strokeDashoffset: stage >= 1 ? 0 : 140,
                transition: 'stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
              }}
            />
            {/* Pentagonal center stroke pattern */}
            <polygon
              points="50,42 58,48 55,58 45,58 42,48"
              stroke="#C8963E"
              strokeWidth="2"
              style={{
                strokeDasharray: 60,
                strokeDashoffset: stage >= 1 ? 0 : 60,
                transition: 'stroke-dashoffset 0.8s ease-out 0.3s',
              }}
            />
            <line x1="50" y1="42" x2="50" y2="30" stroke="#C8963E" strokeWidth="2" />
            <line x1="58" y1="48" x2="68" y2="42" stroke="#C8963E" strokeWidth="2" />
            <line x1="55" y1="58" x2="64" y2="68" stroke="#C8963E" strokeWidth="2" />
            <line x1="45" y1="58" x2="36" y2="68" stroke="#C8963E" strokeWidth="2" />
            <line x1="42" y1="48" x2="32" y2="42" stroke="#C8963E" strokeWidth="2" />

            {/* Stars below crest */}
            <path
              d="M50 82 L52 87 L57 87 L53 90 L55 95 L50 92 L45 95 L47 90 L43 87 L48 87 Z"
              stroke="#C8963E"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Stage 2 Text: "FOOTBALL QUIZ" in Oswald font */}
        <div
          className={`mt-6 transition-all duration-700 ease-out transform ${
            stage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          <h1 className="font-oswald text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#F4EDE0] uppercase">
            FOOTBALL QUIZ
          </h1>
          <p className="font-cairo text-xs text-[#C8963E] mt-1 font-semibold tracking-wider">
            تحدي معلومات كرة القدم التنافسي
          </p>
        </div>

        {/* Stage 2: Golden Loading Bar */}
        <div
          className={`w-48 sm:w-56 h-1.5 bg-[#0C1B33] border border-[rgba(200,150,62,0.3)] rounded-full mt-8 overflow-hidden transition-opacity duration-300 ${
            stage >= 2 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="h-full bg-[#C8963E] rounded-full transition-all ease-linear"
            style={{
              width: stage >= 2 ? '100%' : '0%',
              transitionDuration: '1000ms',
            }}
          />
        </div>
      </div>
    </div>
  );
};
