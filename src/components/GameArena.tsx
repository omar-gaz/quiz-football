import React, { useState, useEffect, useRef } from 'react';
import { GameRoom, ClientQuestion, PlayerAnswerRecord, FormationPlayer } from '../types/football.ts';
import { socketService } from '../services/socket.ts';
import { POPULAR_PLAYERS_SUGGESTIONS, POPULAR_CLUBS_SUGGESTIONS } from '../data/defaultQuestions.ts';
import {
  getClubTheme,
  getClubLogoUrl,
  getPlayerPhotoUrl,
  getCountryFlagUrl,
} from '../utils/footballAssets.ts';
import {
  playClickSound,
  playCorrectSound,
  playWrongSound,
  playTickSound,
  playWhistleSound,
  playWinnerFanfare,
} from '../services/sound.ts';
import confetti from 'canvas-confetti';
import {
  Clock,
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  RotateCcw,
  Home,
  Check,
  Search,
  Users,
  Globe,
  Eye,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext.tsx';

interface GameArenaProps {
  room: GameRoom;
  currentUserId: string;
  onExitGame: () => void;
}

// 3 Stadium atmospheres provided by user
const STADIUM_BACKGROUNDS = [
  'https://i.ibb.co/PvpcdwR3/PSG-ARSENAL-TV-ADS.jpg',
  'https://i.ibb.co/Gf057MJS/download-9.jpg',
  'https://i.ibb.co/twyTQMrb/download-8.jpg',
];

export const ClubCrest: React.FC<{
  clubName: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ clubName, logoUrl, size = 'md', className = '' }) => {
  const [imgSrc, setImgSrc] = useState<string>(() => logoUrl || getClubLogoUrl(clubName));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(logoUrl || getClubLogoUrl(clubName));
    setHasError(false);
  }, [clubName, logoUrl]);

  const containerSizes = {
    sm: 'w-8 h-8 min-w-[32px]',
    md: 'w-14 h-14 min-w-[56px]',
    lg: 'w-20 h-20 min-w-[80px]',
  };

  const imageSizes = {
    sm: 'w-6 h-6',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
  };

  const handleImgError = () => {
    const fallback = getClubLogoUrl(clubName);
    if (fallback && imgSrc !== fallback) {
      setImgSrc(fallback);
    } else {
      setHasError(true);
    }
  };

  if (imgSrc && !hasError) {
    return (
      <div
        className={`rounded-2xl bg-[#080A09] border border-[#29312B] flex items-center justify-center p-1.5 shadow-md relative group overflow-hidden ${containerSizes[size]} ${className}`}
        title={clubName}
      >
        <img
          src={imgSrc}
          alt={`${clubName} official logo`}
          className={`${imageSizes[size]} object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110`}
          onError={handleImgError}
          loading="lazy"
        />
      </div>
    );
  }

  // Graceful visual club badge with club initials
  const initials = clubName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={`rounded-2xl bg-[#171D19] border border-[#B7F34A]/50 flex items-center justify-center font-black text-xs text-[#B7F34A] shadow-md ${containerSizes[size]} ${className}`}
      title={clubName}
    >
      <span>{initials || 'FC'}</span>
    </div>
  );
};

export const PlayerPortrait: React.FC<{
  name: string;
  photoUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ name, photoUrl, size = 'md', className = '' }) => {
  const [imgSrc, setImgSrc] = useState<string>(() => photoUrl || getPlayerPhotoUrl(name));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(photoUrl || getPlayerPhotoUrl(name));
    setHasError(false);
  }, [name, photoUrl]);

  const handleImgError = () => {
    const fallback = getPlayerPhotoUrl(name);
    if (fallback && imgSrc !== fallback) {
      setImgSrc(fallback);
    } else {
      setHasError(true);
    }
  };

  const containerSizes = {
    xs: 'w-7 h-7 min-w-[28px] rounded-lg',
    sm: 'w-10 h-10 min-w-[40px] rounded-xl',
    md: 'w-16 h-16 min-w-[64px] rounded-2xl',
    lg: 'w-24 h-24 sm:w-28 sm:h-28 rounded-2xl',
  };

  if (imgSrc && !hasError) {
    return (
      <div className={`relative inline-block shrink-0 ${className}`}>
        <div
          className={`${containerSizes[size]} overflow-hidden border-2 border-[#B7F34A]/80 shadow-md bg-[#080A09] relative group flex items-center justify-center`}
        >
          <img
            src={imgSrc}
            alt={name}
            className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105"
            onError={handleImgError}
            loading="lazy"
          />
          {size === 'lg' && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/90 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-1 left-0 right-0 text-center">
                <span className="text-[9px] font-black tracking-wider uppercase text-[#B7F34A] bg-[#080A09]/90 px-2 py-0.5 rounded-full border border-[#B7F34A]/40 inline-flex items-center gap-0.5 shadow">
                  <span>✓</span> Real Photo
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Graceful fallback with player initials
  const initials = (name || '')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'P';

  return (
    <div
      className={`${containerSizes[size]} bg-[#171D19] border border-[#B7F34A]/40 flex items-center justify-center font-black text-xs text-[#B7F34A] shadow-md shrink-0 ${className}`}
      title={name}
    >
      <span>{initials}</span>
    </div>
  );
};

// 4-3-3 Formation Tactical Pitch Component for Mode 3 (Nationalities)
// All 11 starting XI flags are always visible so the player deduces the club!
export const FormationPitch: React.FC<{
  lineup: FormationPlayer[];
  revealedCount?: number;
  showNames?: boolean;
}> = ({ lineup, showNames = false }) => {
  // 4-3-3 Position coordinate mapping percentages
  const positionCoordinates: Record<string, { top: string; left: string }> = {
    // Attack
    LW: { top: '16%', left: '18%' },
    ST: { top: '12%', left: '50%' },
    RW: { top: '16%', left: '82%' },
    // Midfield
    CM_L: { top: '42%', left: '26%' },
    CDM: { top: '48%', left: '50%' },
    CAM: { top: '38%', left: '50%' },
    CM_R: { top: '42%', left: '74%' },
    // Defense
    LB: { top: '70%', left: '16%' },
    CB_L: { top: '72%', left: '38%' },
    CB_R: { top: '72%', left: '62%' },
    RB: { top: '70%', left: '84%' },
    // Goalkeeper
    GK: { top: '88%', left: '50%' },
  };

  let cmAssigned = 0;
  let cbAssigned = 0;

  return (
    <div className="relative w-full aspect-[4/3] max-w-lg mx-auto rounded-3xl bg-gradient-to-b from-[#0a2312] via-[#0d2a17] to-[#0a2312] border-2 border-[#1e4a2b] shadow-2xl overflow-hidden p-2 select-none">
      {/* Stadium Pitch Markings */}
      {/* Pitch Boundary */}
      <div className="absolute inset-3 border border-white/20 rounded-2xl pointer-events-none" />
      {/* Halfway Line */}
      <div className="absolute top-1/2 left-3 right-3 h-[1px] bg-white/20 -translate-y-1/2 pointer-events-none" />
      {/* Center Circle */}
      <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full border border-white/20 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-white/30 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      {/* Top Penalty Box */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-48 h-18 border-b border-x border-white/20 rounded-b-xl pointer-events-none" />
      {/* Bottom Penalty Box */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-48 h-18 border-t border-x border-white/20 rounded-t-xl pointer-events-none" />
      {/* Goal Areas */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 border-b border-x border-white/15 pointer-events-none" />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-24 h-7 border-t border-x border-white/15 pointer-events-none" />

      {/* Render All 11 Starting XI Player Nodes in 4-3-3 */}
      {lineup.map((player) => {
        let posKey: string = player.position;
        if (posKey === 'CM') {
          posKey = cmAssigned === 0 ? 'CM_L' : 'CM_R';
          cmAssigned++;
        } else if (posKey === 'CB') {
          posKey = cbAssigned === 0 ? 'CB_L' : 'CB_R';
          cbAssigned++;
        }
        const coords = positionCoordinates[posKey] || { top: '50%', left: '50%' };
        const flagUrl = getCountryFlagUrl(player.countryCode);

        return (
          <div
            key={player.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all duration-300"
            style={{ top: coords.top, left: coords.left }}
          >
            <div className="flex flex-col items-center">
              {/* Flag Badge with Position Tag */}
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#111512] border-2 border-[#B7F34A] overflow-hidden shadow-lg shadow-[#B7F34A]/25 flex items-center justify-center transition-transform hover:scale-110">
                <img
                  src={flagUrl}
                  alt={player.nationality}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 right-0 bg-[#080A09]/95 text-[8px] sm:text-[9px] font-black text-[#B7F34A] px-1 rounded-tl leading-none border-t border-l border-[#B7F34A]/40">
                  {player.position}
                </div>
              </div>
              {/* Label: Player Name on Reveal, or Country Nationality during Round */}
              <span className="mt-0.5 text-[8px] sm:text-[9px] font-bold text-white bg-black/80 px-1.5 py-0.2 rounded-md tracking-tight whitespace-nowrap shadow border border-white/10 backdrop-blur-sm max-w-[85px] truncate">
                {showNames ? player.name : player.nationality}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const GameArena: React.FC<GameArenaProps> = ({
  room,
  currentUserId,
  onExitGame,
}) => {
  const { t, isRTL } = useTranslation();

  // Match entrance broadcast animation state
  const [showKickoffBanner, setShowKickoffBanner] = useState(true);

  // Current round question state
  const [currentQuestion, setCurrentQuestion] = useState<ClientQuestion | null>(
    room.currentQuestion || null
  );
  const [questionIndex, setQuestionIndex] = useState(room.currentQuestionIndex || 0);
  const [totalQuestions, setTotalQuestions] = useState(room.questionsCount || 5);

  // Time remaining calculation
  const calculateInitialTime = () => {
    if (room.currentRoundEndTime && room.currentRoundEndTime > Date.now()) {
      return Math.max(1, Math.ceil((room.currentRoundEndTime - Date.now()) / 1000));
    }
    return room.timeLimit || 20;
  };
  const [timeLeft, setTimeLeft] = useState<number>(calculateInitialTime);

  // Answering state
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [hintUsed, setHintUsed] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [revealedCount, setRevealedCount] = useState<number>(1);
  const [playerSuggestions, setPlayerSuggestions] = useState<string[]>([]);
  const [clubSuggestions, setClubSuggestions] = useState<string[]>([]);
  const [mySubmissionResult, setMySubmissionResult] = useState<{
    isCorrect: boolean;
    scoreAwarded: number;
    newScore: number;
  } | null>(null);

  // Round reveal state
  const [roundReveal, setRoundReveal] = useState<{
    questionIndex: number;
    correctAnswer: string;
    explanation: string;
    playerImage?: string;
    clubLogos?: Record<string, string>;
    roundAnswers: Record<string, PlayerAnswerRecord>;
    scores: Record<string, number>;
  } | null>(room.roundReveal || null);

  // Game over state
  const [finalRankings, setFinalRankings] = useState<{
    rankings: {
      userId: string;
      username: string;
      avatar: string;
      score: number;
      correctCount: number;
      rank: number;
    }[];
    winnerId?: string;
    winnerName?: string;
  } | null>(null);

  // Kickoff banner fade out after 1.2s on first mount
  useEffect(() => {
    playWhistleSound();
    const timer = setTimeout(() => setShowKickoffBanner(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  // Sync state whenever room prop updates from server room_state
  useEffect(() => {
    if (room.currentQuestion) {
      if (!currentQuestion || currentQuestion.id !== room.currentQuestion.id) {
        setCurrentQuestion(room.currentQuestion);
        setQuestionIndex(room.currentQuestionIndex);
        setSelectedAnswer('');
        setTypedAnswer('');
        setHasSubmitted(false);
        setHintUsed(false);
        setShowHint(false);
        setRevealedCount(1);
        setMySubmissionResult(null);
        setRoundReveal(null);
        setPlayerSuggestions([]);
        setClubSuggestions([]);
      }
    }
    if (room.roundReveal && !roundReveal) {
      setRoundReveal(room.roundReveal);
    }
  }, [room.currentQuestion, room.currentQuestionIndex, room.roundReveal]);

  // Dynamic countdown timer tied to room.currentRoundEndTime
  useEffect(() => {
    if (roundReveal || finalRankings || room.status !== 'in_round') return;

    const timerInterval = setInterval(() => {
      if (room.currentRoundEndTime && room.currentRoundEndTime > 0) {
        const remaining = Math.max(0, Math.ceil((room.currentRoundEndTime - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 5 && remaining > 0) {
          playTickSound();
        }
      } else {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }
    }, 500);

    return () => clearInterval(timerInterval);
  }, [room.currentRoundEndTime, roundReveal, finalRankings, room.status]);

  // Listen for socket events
  useEffect(() => {
    const unsubQStart = socketService.on('question_start', (data: any) => {
      setCurrentQuestion(data.question);
      setQuestionIndex(data.questionIndex);
      setTotalQuestions(data.totalQuestions);
      setTimeLeft(data.timeLimit);
      setSelectedAnswer('');
      setTypedAnswer('');
      setHasSubmitted(false);
      setHintUsed(false);
      setShowHint(false);
      setRevealedCount(1);
      setMySubmissionResult(null);
      setRoundReveal(null);
      setPlayerSuggestions([]);
      setClubSuggestions([]);
    });

    const unsubAnswerConfirmed = socketService.on('answer_confirmed', (data: any) => {
      setMySubmissionResult(data);
      if (data.isCorrect) {
        playCorrectSound();
      } else {
        playWrongSound();
      }
    });

    const unsubRoundResult = socketService.on('round_result', (data: any) => {
      setTimeLeft(0);
      setRoundReveal({
        questionIndex: data.questionIndex,
        correctAnswer: data.correctAnswer,
        explanation: data.explanation,
        playerImage: data.playerImage,
        clubLogos: data.clubLogos,
        roundAnswers: data.roundAnswers,
        scores: data.scores,
      });
    });

    const unsubGameEnded = socketService.on('game_ended', (data: any) => {
      setRoundReveal(null);
      setFinalRankings({
        rankings: data.rankings,
        winnerId: data.winnerId,
        winnerName: data.winnerName,
      });

      playWinnerFanfare();
      try {
        confetti({
          particleCount: 140,
          spread: 90,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    });

    return () => {
      unsubQStart();
      unsubAnswerConfirmed();
      unsubRoundResult();
      unsubGameEnded();
    };
  }, []);

  // Filter player suggestions for Mode 2 or club suggestions for Mode 3
  useEffect(() => {
    if (!typedAnswer.trim()) {
      setPlayerSuggestions([]);
      setClubSuggestions([]);
      return;
    }
    const q = typedAnswer.toLowerCase().trim();
    if (currentQuestion?.mode === 'nationalities') {
      const matches = POPULAR_CLUBS_SUGGESTIONS.filter((name) =>
        name.toLowerCase().includes(q)
      ).slice(0, 5);
      setClubSuggestions(matches);
    } else {
      const matches = POPULAR_PLAYERS_SUGGESTIONS.filter((name) =>
        name.toLowerCase().includes(q)
      ).slice(0, 5);
      setPlayerSuggestions(matches);
    }
  }, [typedAnswer, currentQuestion?.mode]);

  const handleSubmitAnswer = (answer: string) => {
    if (hasSubmitted || !currentQuestion || timeLeft <= 0) return;
    playClickSound();
    setHasSubmitted(true);
    setSelectedAnswer(answer);
    socketService.submitAnswer(room.code, answer, hintUsed, revealedCount);
  };

  const handleUseHint = () => {
    if (hasSubmitted || showHint) return;
    playClickSound();
    setShowHint(true);
    setHintUsed(true);
  };

  const handleRevealNextFlag = () => {
    if (hasSubmitted || revealedCount >= 5) return;
    playClickSound();
    setRevealedCount((prev) => Math.min(5, prev + 1));
  };

  const participantsList = Object.values(room.participants);
  const myParticipant = room.participants[currentUserId];
  const currentBg = STADIUM_BACKGROUNDS[questionIndex % STADIUM_BACKGROUNDS.length];

  // ---------------- FINAL RESULTS SCREEN ----------------
  if (finalRankings) {
    const isWinner = finalRankings.winnerId === currentUserId;
    const myRankItem = finalRankings.rankings.find((r) => r.userId === currentUserId);
    const accuracy = myRankItem
      ? Math.round((myRankItem.correctCount / totalQuestions) * 100)
      : 0;

    return (
      <div className="relative min-h-[85vh] flex items-center justify-center p-4">
        {/* Stadium Background Atmosphere */}
        <div
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center transition-all duration-1000 ease-in-out opacity-25"
          style={{ backgroundImage: `url(${currentBg})` }}
        />
        <div className="fixed inset-0 pointer-events-none z-0 bg-[#080A09]/85 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-2xl w-full p-4 sm:p-6 animate-fade-in">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center overflow-hidden border border-[#29312B]">
            {/* Glowing winner spotlight */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#B7F34A]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Trophy Header */}
            <div className="relative inline-block mb-3">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-600 via-[#D6BD83] to-yellow-300 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20 mx-auto">
                🏆
              </div>
              {isWinner && (
                <span className="absolute -top-3 -right-3 text-2xl animate-bounce">
                  👑
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#F5F5F0] uppercase tracking-wide">
              {isWinner
                ? isRTL ? 'بطل المباراة!' : 'Match Champion!'
                : isRTL ? 'انتهت المباراة' : 'Match Finished'}
            </h2>
            <p className="text-xs sm:text-sm text-[#A1AAA2] mt-1">
              {isRTL ? 'الفائز:' : 'Winner:'}{' '}
              <span className="font-bold text-[#B7F34A]">{finalRankings.winnerName}</span>
            </p>

            {/* Personal Match Stats */}
            <div className="grid grid-cols-3 gap-2.5 my-6">
              <div className="p-3.5 rounded-2xl bg-[#080A09] border border-[#29312B]">
                <div className="text-lg font-black text-[#B7F34A]">
                  {myRankItem?.score || 0}
                </div>
                <div className="text-[10px] text-[#A1AAA2] uppercase font-bold">
                  {isRTL ? 'مجموع النقاط' : 'Total Points'}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#080A09] border border-[#29312B]">
                <div className="text-lg font-black text-[#F5F5F0]">
                  {myRankItem?.correctCount || 0} / {totalQuestions}
                </div>
                <div className="text-[10px] text-[#A1AAA2] uppercase font-bold">
                  {isRTL ? 'إجابات صحيحة' : 'Correct Answers'}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#080A09] border border-[#29312B]">
                <div className="text-lg font-black text-[#D6BD83]">
                  {accuracy}%
                </div>
                <div className="text-[10px] text-[#A1AAA2] uppercase font-bold">
                  {isRTL ? 'الدقة' : 'Accuracy'}
                </div>
              </div>
            </div>

            {/* Final Standings Table */}
            <div className="space-y-2 mb-8 text-left">
              <p className="text-xs font-bold text-[#A1AAA2] uppercase tracking-wider text-center mb-2">
                {isRTL ? 'الترتيب النهائي للمباراة' : 'Final Match Standings'}
              </p>
              {finalRankings.rankings.map((p, idx) => (
                <div
                  key={p.userId}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                    p.userId === currentUserId
                      ? 'bg-[#171D19] border-[#B7F34A] shadow-md'
                      : 'bg-[#080A09] border-[#29312B]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-black text-sm">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#171D19] border border-[#29312B] flex items-center justify-center text-xl">
                      {p.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#F5F5F0]">{p.username}</span>
                        {p.userId === currentUserId && (
                          <span className="text-[9px] font-black bg-[#B7F34A] text-[#080A09] px-1.5 py-0.2 rounded">
                            {isRTL ? 'أنت' : 'YOU'}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#A1AAA2]">
                        {p.correctCount} / {totalQuestions} {isRTL ? 'صحيح' : 'correct'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-black text-sm text-[#B7F34A]">
                      {p.score} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  playClickSound();
                  onExitGame();
                }}
                className="flex-1 py-3.5 rounded-2xl bg-[#B7F34A] text-[#080A09] font-black text-xs uppercase tracking-wider hover:bg-[#a6e038] transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#B7F34A]/20"
              >
                <Home className="w-4 h-4" />
                <span>{isRTL ? 'العودة للرئيسية' : 'Back to Dashboard'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- ROUND REVEAL SCREEN ----------------
  if (roundReveal) {
    const myAnswer = roundReveal.roundAnswers[currentUserId];
    const isCorrect = myAnswer?.isCorrect;

    return (
      <div className="relative min-h-[85vh] flex items-center justify-center p-4">
        {/* Stadium Background Atmosphere */}
        <div
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center transition-all duration-1000 ease-in-out opacity-25"
          style={{ backgroundImage: `url(${currentBg})` }}
        />
        <div className="fixed inset-0 pointer-events-none z-0 bg-[#080A09]/85 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-2xl w-full p-4 sm:p-6 animate-fade-in">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center border border-[#29312B] overflow-hidden">
            {/* Round status banner */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#171D19] border border-[#29312B] text-xs font-bold text-[#A1AAA2] uppercase mb-4">
              <span>
                {isRTL
                  ? `نتيجة الجولة ${questionIndex + 1} من ${totalQuestions}`
                  : `Round ${questionIndex + 1} of ${totalQuestions} Result`}
              </span>
            </div>

            {/* Correct / Incorrect Header */}
            <div className="mb-6">
              <div
                className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg ${
                  isCorrect
                    ? 'bg-[#171D19] text-[#B7F34A] border-2 border-[#B7F34A] shadow-[0_0_20px_rgba(183,243,74,0.3)]'
                    : 'bg-red-950/40 text-red-400 border-2 border-red-500'
                }`}
              >
                {isCorrect ? '✓' : '✗'}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#F5F5F0] uppercase tracking-wide">
                {isCorrect
                  ? isRTL ? 'هدف! إجابة صحيحة ومتقنة!' : 'Goal! Correct Answer!'
                  : isRTL ? 'خارج المرمى! إجابة خاطئة' : 'Off Target! Incorrect'}
              </h3>
              <p className="text-xs text-[#A1AAA2] mt-1">
                {isCorrect
                  ? isRTL
                    ? `حصلت على +${myAnswer?.scoreAwarded || 0} نقطة في ${myAnswer?.answerTimeSec}ث`
                    : `You earned +${myAnswer?.scoreAwarded || 0} points in ${myAnswer?.answerTimeSec}s`
                  : isRTL
                  ? 'لم يتم احتساب نقاط في هذه الجولة'
                  : 'No points awarded this round'}
              </p>
            </div>

            {/* If Nationalities mode: Show full pitch with player names and club crest */}
            {currentQuestion?.mode === 'nationalities' && currentQuestion.lineup && (
              <div className="mb-6 text-left">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[11px] font-black text-[#A1AAA2] uppercase tracking-wider">
                    {isRTL ? 'التشكيلة الكاملة وأسماء النجوم' : 'Complete Starting XI & Lineup'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <ClubCrest clubName={roundReveal.correctAnswer} size="sm" />
                    <span className="text-xs font-black text-[#B7F34A]">
                      {roundReveal.correctAnswer}
                    </span>
                  </div>
                </div>
                <FormationPitch lineup={currentQuestion.lineup} revealedCount={11} showNames={true} />
              </div>
            )}

            {/* Correct Answer Showcase with Real Player Photo & Club Logos */}
            <div className="p-5 rounded-2xl bg-[#080A09] border border-[#29312B] text-left mb-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {/* Official Crest or Player Photo */}
                <div className="shrink-0 text-center">
                  {currentQuestion?.mode === 'nationalities' ? (
                    <ClubCrest clubName={roundReveal.correctAnswer} size="lg" />
                  ) : (
                    <PlayerPortrait
                      name={roundReveal.correctAnswer}
                      photoUrl={roundReveal.playerImage}
                      size="lg"
                    />
                  )}
                </div>

                {/* Details & Badges */}
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="text-[10px] font-black text-[#B7F34A] uppercase tracking-wider bg-[#171D19] px-2 py-0.5 rounded-full border border-[#B7F34A]/40">
                      {isRTL ? 'الإجابة الرسمية' : 'Official Answer'}
                    </span>
                    <span className="text-[10px] text-[#A1AAA2] font-semibold">
                      {currentQuestion?.mode === 'nationalities' ? 'Verified Football Club' : 'Verified Footballer'}
                    </span>
                  </div>

                  <div className="text-xl sm:text-2xl font-black text-[#F5F5F0] tracking-wide">
                    {roundReveal.correctAnswer}
                  </div>

                  {roundReveal.explanation && (
                    <p className="text-xs text-[#A1AAA2] mt-2 leading-relaxed border-t border-[#29312B] pt-2">
                      {roundReveal.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Opponents answers summary with player photos and club crests */}
            <div className="space-y-2 mb-6 text-left">
              <p className="text-[11px] font-bold text-[#A1AAA2] uppercase tracking-wider">
                {isRTL ? 'إجابات المشاركين في هذه الجولة' : 'Round Breakdown'}
              </p>
              {Object.values(roundReveal.roundAnswers).map((rec) => {
                const p = room.participants[rec.userId];
                if (!p) return null;
                const isClub = currentQuestion?.mode === 'nationalities';
                return (
                  <div
                    key={rec.userId}
                    className="p-3 rounded-xl bg-[#080A09] border border-[#29312B] flex items-center justify-between text-xs gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg">{p.avatar}</span>
                      <div className="min-w-0">
                        <div className="font-bold text-[#F5F5F0] truncate">{p.displayName || p.username}</div>
                        <div className="text-[10px] text-[#A1AAA2] flex items-center gap-1.5 mt-0.5">
                          <span>{isRTL ? 'أجاب:' : 'answered:'}</span>
                          {rec.answer ? (
                            isClub ? (
                              <ClubCrest clubName={rec.answer} size="sm" className="w-5 h-5 min-w-[20px] p-0.5 inline-flex" />
                            ) : (
                              <PlayerPortrait name={rec.answer} size="xs" className="inline-flex" />
                            )
                          ) : null}
                          <span className="font-bold text-[#F5F5F0] truncate">"{rec.answer || '—'}"</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs font-bold font-mono ${
                          rec.isCorrect ? 'text-[#B7F34A]' : 'text-red-400'
                        }`}
                      >
                        {rec.isCorrect ? `+${rec.scoreAwarded} pts` : '0 pts'}
                      </span>
                      {rec.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-[#B7F34A]" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Synchronized next question countdown pill */}
            <div className="py-2.5 rounded-xl bg-[#171D19] border border-[#29312B] text-xs font-bold text-[#A1AAA2] flex items-center justify-center gap-2">
              <span className="animate-spin text-sm">⚽</span>
              <span>{isRTL ? 'السؤال التالي سيبدأ تلقائياً خلال لحظات...' : 'Next question starting in a few seconds...'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- FALLBACK: WAITING FOR QUESTION 1 SYNC ----------------
  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 animate-fade-in text-center">
        <div className="glass-panel p-10 rounded-3xl border border-[#29312B] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#171D19] border-2 border-[#B7F34A] flex items-center justify-center text-3xl mx-auto shadow-[0_0_20px_rgba(183,243,74,0.3)] animate-spin">
            ⚽
          </div>
          <h3 className="text-lg font-black text-[#F5F5F0]">
            {isRTL ? 'جاري تجهيز السؤال الأول...' : 'Preparing Question 1...'}
          </h3>
          <p className="text-xs text-[#A1AAA2]">
            {isRTL ? 'جلب بيانات الأندية والصور والتحقق من التزامن' : 'Synchronizing match data and verified club badges'}
          </p>
        </div>
      </div>
    );
  }

  // ---------------- ACTIVE QUESTION SCREEN ----------------
  const timerPercentage = Math.max(0, Math.min(100, (timeLeft / (room.timeLimit || 20)) * 100));
  const isTimeCritical = timeLeft <= 5;
  const currentPotentialPoints = currentQuestion.mode === 'nationalities' ? Math.max(1, 6 - revealedCount) : 100;

  return (
    <div className="relative min-h-[85vh] py-4 sm:py-6">
      {/* Stadium Background Atmosphere */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center transition-all duration-1000 ease-in-out opacity-25"
        style={{ backgroundImage: `url(${currentBg})` }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#080A09]/85 backdrop-blur-[2px]" />

      {/* Broadcast Kickoff Entrance Animation Banner */}
      {showKickoffBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in pointer-events-none">
          <div className="text-center space-y-3 animate-bounce">
            <div className="w-20 h-20 rounded-3xl bg-[#171D19] border-2 border-[#B7F34A] flex items-center justify-center text-4xl mx-auto shadow-[0_0_30px_rgba(183,243,74,0.4)]">
              ⚽
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-widest drop-shadow-[0_0_20px_#B7F34A]">
              {isRTL ? 'ضربة البداية!' : 'MATCH KICKOFF!'}
            </h1>
            <p className="text-xs font-bold text-[#B7F34A] uppercase tracking-wider">
              {currentQuestion.mode === 'two_clubs'
                ? isRTL ? 'لاعب بين الناديين' : 'Two Clubs Challenge'
                : currentQuestion.mode === 'nationalities'
                ? isRTL ? 'خمن النادي من جنسيات اللاعبين' : 'Club by Player Nationalities'
                : isRTL ? 'تاريخ أرقام القمصان' : 'Shirt Number Timeline'}
            </p>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-3xl mx-auto px-4 space-y-4">
        {/* Top Bar: Round count, countdown, and mini live-scores */}
        <div className="glass-panel rounded-2xl p-3.5 shadow-md flex items-center justify-between gap-3 border border-[#29312B]">
          {/* Round Pill */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#171D19] text-[#B7F34A] border border-[#B7F34A]/40 uppercase tracking-wider">
              {currentQuestion?.mode === 'two_clubs'
                ? (isRTL ? 'ناديين' : 'Two Clubs')
                : currentQuestion?.mode === 'nationalities'
                ? (isRTL ? 'جنسيات' : 'Nationalities')
                : (isRTL ? 'القميص والمسيرة' : 'Shirt History')}
            </span>
            <span className="text-xs font-bold text-[#F5F5F0]">
              {isRTL ? 'سؤال' : 'Q'} {questionIndex + 1}{' '}
              <span className="text-[#A1AAA2]">/ {totalQuestions}</span>
            </span>
          </div>

          {/* Circular / Pill Timer */}
          <div
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full border font-mono font-black text-xs transition ${
              isTimeCritical
                ? 'bg-red-950/60 text-red-400 border-red-500 animate-pulse'
                : 'bg-[#080A09] text-[#B7F34A] border-[#B7F34A]/40'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>

          {/* Participants status & current scores */}
          <div className="flex items-center gap-2">
            {participantsList.map((p) => (
              <div
                key={p.userId}
                className="flex items-center gap-1 text-[11px] font-bold text-[#F5F5F0] bg-[#080A09] px-2 py-0.5 rounded-lg border border-[#29312B]"
                title={`${p.displayName || p.username}: ${p.currentScore} pts`}
              >
                <span>{p.avatar}</span>
                <span className="text-[#B7F34A]">{p.currentScore}</span>
                {p.hasAnsweredCurrent && (
                  <span className="text-[10px] text-[#B7F34A] font-black" title="Answered!">
                    ✓
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timer Progress Bar */}
        <div className="w-full bg-[#171D19] h-1.5 rounded-full overflow-hidden border border-[#29312B]">
          <div
            className={`h-full transition-all duration-500 ease-linear ${
              isTimeCritical ? 'bg-red-500' : 'bg-[#B7F34A]'
            }`}
            style={{ width: `${timerPercentage}%` }}
          />
        </div>

        {/* Main Challenge Card */}
        <div className="glass-panel rounded-3xl p-5 sm:p-7 shadow-2xl relative border border-[#29312B] overflow-hidden">
          {/* Question Heading */}
          <div className="text-center mb-5">
            <h2 className="text-base sm:text-lg font-black text-[#F5F5F0]">
              {currentQuestion?.question ||
                (isRTL ? 'أي نادٍ أو لاعب يطابق هذه التشكيلة الكروية؟' : 'Which football entity matches this clue?')}
            </h2>
            {currentQuestion?.mode === 'nationalities' && (
              <p className="text-xs text-[#A1AAA2] mt-1">
                {isRTL
                  ? `خمن النادي من جنسيات التشكيلة الأساسية (4-3-3)`
                  : 'Identify the European football club from starting XI player nationalities'}
              </p>
            )}
          </div>

          {/* MODE 1: TWO CLUBS PRESENTATION */}
          {currentQuestion?.mode === 'two_clubs' && currentQuestion.clubs && (
            <div className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center relative">
                {/* Club 1 */}
                {(() => {
                  const cName1 = currentQuestion.clubs[0];
                  const theme1 = getClubTheme(cName1);
                  const logo1 = currentQuestion.clubLogos?.[cName1] || getClubLogoUrl(cName1);
                  return (
                    <div
                      className="p-5 rounded-2xl border border-[#29312B] bg-[#080A09] flex items-center gap-4 text-left shadow-lg relative overflow-hidden group"
                    >
                      <ClubCrest clubName={cName1} logoUrl={logo1} size="md" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-[#A1AAA2] uppercase font-bold tracking-widest block mb-0.5">
                          {isRTL ? 'النادي الأول' : 'Club 1'}
                        </span>
                        <span className={`text-base sm:text-lg font-black truncate block ${theme1.text}`}>
                          {cName1}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Lightning vs badge */}
                <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#171D19] border-2 border-[#B7F34A] items-center justify-center text-xs font-black text-[#B7F34A] z-10 shadow-xl">
                  VS
                </div>

                {/* Club 2 */}
                {(() => {
                  const cName2 = currentQuestion.clubs[1];
                  const theme2 = getClubTheme(cName2);
                  const logo2 = currentQuestion.clubLogos?.[cName2] || getClubLogoUrl(cName2);
                  return (
                    <div
                      className="p-5 rounded-2xl border border-[#29312B] bg-[#080A09] flex items-center gap-4 text-left shadow-lg relative overflow-hidden group"
                    >
                      <ClubCrest clubName={cName2} logoUrl={logo2} size="md" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-[#A1AAA2] uppercase font-bold tracking-widest block mb-0.5">
                          {isRTL ? 'النادي الثاني' : 'Club 2'}
                        </span>
                        <span className={`text-base sm:text-lg font-black truncate block ${theme2.text}`}>
                          {cName2}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* MODE 2: SHIRT NUMBERS & CLUB HISTORY PRESENTATION */}
          {currentQuestion?.mode === 'shirt_history' && currentQuestion.sequence && (
            <div className="mb-8">
              <div className="bg-[#080A09] border border-[#29312B] rounded-2xl p-4 sm:p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[11px] font-black text-[#A1AAA2] uppercase tracking-wider">
                    {isRTL ? 'تسلسل المسيرة وأرقام القمصان عبر الأندية' : 'Chronological Career Timeline'}
                  </span>
                  <span className="text-[10px] font-bold text-[#B7F34A] bg-[#171D19] px-2 py-0.5 rounded-full border border-[#B7F34A]/40">
                    {currentQuestion.sequence.length} {isRTL ? 'أندية' : 'Career Clubs'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {currentQuestion.sequence.map((step, idx) => {
                    const theme = getClubTheme(step.club);
                    const stepLogo = currentQuestion.clubLogos?.[step.club] || getClubLogoUrl(step.club);
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#111512] border border-[#29312B] hover:border-white/10 transition group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Jersey Number Badge */}
                          <div className="w-10 h-10 rounded-xl bg-[#171D19] border border-[#B7F34A] flex items-center justify-center font-black text-white text-base shadow-inner shrink-0">
                            <span className="text-[#B7F34A]">#{step.number}</span>
                          </div>

                          {/* Club Official Crest */}
                          <ClubCrest clubName={step.club} logoUrl={stepLogo} size="sm" />

                          <div className="min-w-0">
                            <div className={`text-xs sm:text-sm font-black truncate ${theme.text}`}>
                              {step.club}
                            </div>
                            <div className="text-[10px] text-[#A1AAA2]">
                              {isRTL ? 'الفترة:' : 'Period:'} {step.period}
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] text-[#A1AAA2] font-mono shrink-0 pl-2">
                          {isRTL ? `محطة ${idx + 1}` : `Step ${idx + 1}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: GUESS THE CLUB BY PLAYER NATIONALITIES (4-3-3 FORMATION) */}
          {currentQuestion?.mode === 'nationalities' && currentQuestion.lineup && (
            <div className="mb-6 space-y-3">
              {/* Tactical 4-3-3 Pitch with all 11 flags active */}
              <FormationPitch lineup={currentQuestion.lineup} showNames={false} />

              {/* All 11 National Flags Active Status Bar */}
              <div className="p-3 rounded-2xl bg-[#080A09] border border-[#29312B] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#B7F34A]" />
                  <span className="text-[#F5F5F0] font-bold">
                    {isRTL ? 'جميع أعلام تشكيلة الـ 11 لاعباً ظاهرة على أرضية الملعب' : 'All 11 Starting XI National Flags Active on Pitch'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#171D19] text-[#B7F34A] font-mono font-black border border-[#B7F34A]/40">
                    11 / 11 {isRTL ? 'علم' : 'Flags'}
                  </span>
                  <span className="text-[11px] text-[#D6BD83] font-bold">
                    (100 pts)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Hint System */}
          {room.hintsEnabled && currentQuestion?.hints && currentQuestion.mode !== 'nationalities' && (
            <div className="mb-6 text-center">
              {showHint ? (
                <div className="p-3.5 rounded-2xl bg-[#171D19] border border-[#D6BD83]/50 text-xs text-[#D6BD83] font-medium inline-block text-left animate-fade-in">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#D6BD83] mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isRTL ? 'تلميح كشفي (-25 نقطة)' : 'Tactical Scout Hint (-25 pts)'}</span>
                  </div>
                  {currentQuestion.hints.nationality && (
                    <p>• {isRTL ? 'الجنسية:' : 'Nationality:'} <strong>{currentQuestion.hints.nationality}</strong></p>
                  )}
                  {currentQuestion.hints.position && (
                    <p>• {isRTL ? 'المركز:' : 'Position:'} <strong>{currentQuestion.hints.position}</strong></p>
                  )}
                  {currentQuestion.hints.careerYears && (
                    <p>• {isRTL ? 'الحقبة:' : 'Era:'} <strong>{currentQuestion.hints.careerYears}</strong></p>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleUseHint}
                  disabled={hasSubmitted || timeLeft <= 0}
                  className="px-3.5 py-1.5 rounded-full bg-[#171D19] hover:bg-[#1f2722] border border-[#29312B] text-xs font-bold text-[#A1AAA2] hover:text-[#D6BD83] transition cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#D6BD83]" />
                  <span>{isRTL ? 'هل تحتاج تلميحاً؟ (-25 نقطة)' : 'Need a Hint? (-25 pts)'}</span>
                </button>
              )}
            </div>
          )}

          {/* MULTIPLE CHOICE CLUBS OR PLAYERS (Mode 3 & Mode 1) */}
          {(currentQuestion?.mode === 'nationalities' || currentQuestion?.mode === 'two_clubs') && currentQuestion.options ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((opt) => {
                  const isSelected = selectedAnswer === opt;
                  const isClub = currentQuestion.mode === 'nationalities';
                  const clubLogo = isClub ? getClubLogoUrl(opt) : undefined;

                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={hasSubmitted || timeLeft <= 0}
                      onClick={() => handleSubmitAnswer(opt)}
                      className={`p-3.5 sm:p-4 rounded-2xl border text-left font-bold text-sm transition cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#171D19] border-[#B7F34A] text-[#B7F34A] shadow-[0_0_15px_rgba(183,243,74,0.3)]'
                          : hasSubmitted
                          ? 'bg-[#080A09] border-[#29312B] text-[#A1AAA2] opacity-60'
                          : 'bg-[#080A09] border-[#29312B] text-[#F5F5F0] hover:border-[#B7F34A]/60 hover:bg-[#111512]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {isClub ? (
                          <ClubCrest clubName={opt} logoUrl={clubLogo} size="sm" />
                        ) : (
                          <PlayerPortrait name={opt} size="sm" />
                        )}
                        <span className="text-sm font-black truncate">{opt}</span>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-[#B7F34A] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Or type custom answer if preferred */}
              <div className="pt-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (typedAnswer.trim()) handleSubmitAnswer(typedAnswer.trim());
                  }}
                  className="flex gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={typedAnswer}
                      onChange={(e) => setTypedAnswer(e.target.value)}
                      disabled={hasSubmitted || timeLeft <= 0}
                      placeholder={
                        currentQuestion.mode === 'nationalities'
                          ? isRTL ? 'أو اكتب اسم النادي...' : 'Or type another club name...'
                          : isRTL ? 'أو اكتب اسم اللاعب...' : 'Or type another footballer name...'
                      }
                      className="w-full bg-[#080A09] border border-[#29312B] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] placeholder-[#A1AAA2]/60 focus:outline-none focus:border-[#B7F34A]"
                    />
                    {/* Autocomplete suggestions dropdown */}
                    {(clubSuggestions.length > 0 || playerSuggestions.length > 0) && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-[#111512] border border-[#29312B] rounded-xl shadow-2xl z-30 overflow-hidden divide-y divide-[#29312B]/40">
                        {(currentQuestion.mode === 'nationalities' ? clubSuggestions : playerSuggestions).map((item) => (
                          <div
                            key={item}
                            onClick={() => {
                              setTypedAnswer(item);
                              setClubSuggestions([]);
                              setPlayerSuggestions([]);
                              handleSubmitAnswer(item);
                            }}
                            className="p-2.5 hover:bg-[#171D19] text-xs font-bold text-[#F5F5F0] cursor-pointer flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {currentQuestion.mode === 'nationalities' ? (
                                <ClubCrest clubName={item} size="sm" className="w-6 h-6 min-w-[24px]" />
                              ) : (
                                <PlayerPortrait name={item} size="xs" />
                              )}
                              <span className="truncate">{item}</span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#B7F34A] shrink-0" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={hasSubmitted || !typedAnswer.trim() || timeLeft <= 0}
                    className="btn-electric px-5 py-2.5 text-xs font-black uppercase cursor-pointer disabled:opacity-40"
                  >
                    {isRTL ? 'تأكيد' : 'Submit'}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Mode 2 Shirt History: Search and text submission */
            <div className="space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (typedAnswer.trim()) handleSubmitAnswer(typedAnswer.trim());
                }}
                className="space-y-3"
              >
                <div className="relative">
                  <Search className="w-4 h-4 text-[#A1AAA2] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={typedAnswer}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    disabled={hasSubmitted || timeLeft <= 0}
                    placeholder={isRTL ? 'ابحث باسم اللاعب أو اكتبه مباشرة...' : 'Type player name (e.g. Cristiano Ronaldo, Messi...)'}
                    className="w-full bg-[#080A09] border border-[#29312B] focus:border-[#B7F34A] rounded-2xl pl-10 pr-4 py-3 text-sm text-[#F5F5F0] placeholder-[#A1AAA2]/60 focus:outline-none"
                  />
                  {playerSuggestions.length > 0 && !hasSubmitted && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#111512] border border-[#29312B] rounded-2xl shadow-2xl z-30 overflow-hidden divide-y divide-[#29312B]/40">
                      {playerSuggestions.map((name) => (
                        <div
                          key={name}
                          onClick={() => {
                            setTypedAnswer(name);
                            setPlayerSuggestions([]);
                            handleSubmitAnswer(name);
                          }}
                          className="p-3 hover:bg-[#171D19] text-xs font-bold text-[#F5F5F0] cursor-pointer flex items-center justify-between gap-2.5"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <PlayerPortrait name={name} size="xs" />
                            <span className="truncate">{name}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#B7F34A] shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={hasSubmitted || !typedAnswer.trim() || timeLeft <= 0}
                  className="w-full btn-electric py-3 text-xs font-black uppercase tracking-wider cursor-pointer disabled:opacity-40"
                >
                  {isRTL ? 'تأكيد الإجابة' : 'Confirm Player Answer'}
                </button>
              </form>
            </div>
          )}

          {/* Submitted waiting banner with player portrait or club badge */}
          {hasSubmitted && (
            <div className="mt-4 p-3.5 rounded-2xl bg-[#171D19] border border-[#B7F34A]/50 flex items-center justify-center gap-3.5 animate-fade-in shadow-xl">
              {currentQuestion.mode === 'nationalities' ? (
                <ClubCrest clubName={selectedAnswer} size="sm" />
              ) : (
                <PlayerPortrait name={selectedAnswer} size="sm" />
              )}
              <div className="text-left">
                <div className="text-[10px] text-[#A1AAA2] uppercase font-bold tracking-wider">
                  {isRTL ? 'إجابتك المسجلة' : 'Your Locked Choice'}
                </div>
                <div className="text-sm font-black text-[#B7F34A] flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#B7F34A]" />
                  <span>{selectedAnswer}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
