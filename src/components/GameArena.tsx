import React, { useState, useEffect } from 'react';
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
import { useTranslation } from '../context/LanguageContext.tsx';
import {
  IconFootball,
  IconFootballPitch,
  IconFootballJersey,
  IconFootballTrophy,
  IconRefereeStopwatch,
  IconGoalkeeperSave,
  IconRedCard,
  IconRefereeWhistle,
  IconScoutSearch,
  Football3DBadge,
} from './Football3DIcons.tsx';
import { PlayerCharacterAvatar } from './PlayerCharacterAvatar.tsx';

interface GameArenaProps {
  room: GameRoom;
  currentUserId: string;
  onExitGame: () => void;
}

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
        className={`bg-white border-[2.5px] border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center p-1 relative shrink-0 ${containerSizes[size]} ${className}`}
        title={clubName}
      >
        <img
          src={imgSrc}
          alt={`${clubName} official logo`}
          className={`${imageSizes[size]} object-contain`}
          onError={handleImgError}
          loading="lazy"
        />
      </div>
    );
  }

  const initials = clubName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={`bg-[#16213E] border-[2.5px] border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center font-black text-xs text-[#FFD700] shrink-0 ${containerSizes[size]} ${className}`}
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
    xs: 'w-7 h-7 min-w-[28px]',
    sm: 'w-10 h-10 min-w-[40px]',
    md: 'w-16 h-16 min-w-[64px]',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
  };

  if (imgSrc && !hasError) {
    return (
      <div className={`relative inline-block shrink-0 ${className}`}>
        <div
          className={`${containerSizes[size]} overflow-hidden border-[2.5px] border-black shadow-[3px_3px_0px_#000000] bg-[#16213E] relative flex items-center justify-center`}
        >
          <img
            src={imgSrc}
            alt={name}
            className="w-full h-full object-cover object-top"
            onError={handleImgError}
            loading="lazy"
          />
          {size === 'lg' && (
            <div className="absolute bottom-1 left-0 right-0 text-center">
              <span className="text-[9px] font-black uppercase text-white bg-[#00B140] px-1.5 py-0.2 border border-black inline-flex items-center gap-0.5 shadow-[1px_1px_0px_#000]">
                <span>✓</span> OFFICIAL
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const initials = (name || '')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'P';

  return (
    <div
      className={`${containerSizes[size]} bg-[#AAFF00] border-[2.5px] border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center font-black text-xs text-black shrink-0 ${className}`}
      title={name}
    >
      <span>{initials}</span>
    </div>
  );
};

// 4-3-3 Formation Pitch - Neo-Brutalist Tactical Pitch
export const FormationPitch: React.FC<{
  lineup: FormationPlayer[];
  revealedCount?: number;
  showNames?: boolean;
}> = ({ lineup, showNames = false }) => {
  const positionCoordinates: Record<string, { top: string; left: string }> = {
    LW: { top: '16%', left: '18%' },
    ST: { top: '12%', left: '50%' },
    RW: { top: '16%', left: '82%' },
    CM_L: { top: '42%', left: '26%' },
    CDM: { top: '48%', left: '50%' },
    CAM: { top: '38%', left: '50%' },
    CM_R: { top: '42%', left: '74%' },
    LB: { top: '70%', left: '16%' },
    CB_L: { top: '72%', left: '38%' },
    CB_R: { top: '72%', left: '62%' },
    RB: { top: '70%', left: '84%' },
    GK: { top: '88%', left: '50%' },
  };

  let cmAssigned = 0;
  let cbAssigned = 0;

  return (
    <div className="relative w-full aspect-[4/3] max-w-lg mx-auto bg-[#16A34A] border-[4px] border-black shadow-[8px_8px_0px_#000000] overflow-hidden p-2 select-none">
      {/* Pitch Lines */}
      <div className="absolute inset-2.5 border-[2px] border-white pointer-events-none" />
      <div className="absolute top-1/2 left-2.5 right-2.5 h-[2px] bg-white -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full border-[2px] border-white -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-white -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-48 h-18 border-b-[2px] border-x-[2px] border-white pointer-events-none" />
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-48 h-18 border-t-[2px] border-x-[2px] border-white pointer-events-none" />

      {/* 11 Player Nodes in 4-3-3 */}
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
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
            style={{ top: coords.top, left: coords.left }}
          >
            <div className="flex flex-col items-center">
              {/* Flag Badge with Position Tag */}
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border-[2.5px] border-black overflow-hidden shadow-[2px_2px_0px_#000000] flex items-center justify-center">
                <img
                  src={flagUrl}
                  alt={player.nationality}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 right-0 bg-[#FFE500] text-[8px] sm:text-[9px] font-black text-black px-1 border-t border-l border-black leading-none">
                  {player.position}
                </div>
              </div>
              {/* Label */}
              <span className="mt-0.5 text-[8px] sm:text-[9px] font-black text-black bg-[#FFFFFF] px-1.5 py-0.2 border border-black tracking-tight whitespace-nowrap shadow-[1.5px_1.5px_0px_#000] max-w-[85px] truncate">
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
  const [showKickoffBanner, setShowKickoffBanner] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState<ClientQuestion | null>(
    room.currentQuestion || null
  );
  const [questionIndex, setQuestionIndex] = useState(room.currentQuestionIndex || 0);
  const [totalQuestions, setTotalQuestions] = useState(room.questionsCount || 5);

  const calculateInitialTime = () => {
    if (room.currentRoundEndTime && room.currentRoundEndTime > Date.now()) {
      return Math.max(1, Math.ceil((room.currentRoundEndTime - Date.now()) / 1000));
    }
    return room.timeLimit || 20;
  };
  const [timeLeft, setTimeLeft] = useState<number>(calculateInitialTime);

  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [hintUsed, setHintUsed] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [revealedCount, setRevealedCount] = useState<number>(1);
  const [playerSuggestions, setPlayerSuggestions] = useState<string[]>([]);
  const [clubSuggestions, setClubSuggestions] = useState<string[]>([]);
  const [, setMySubmissionResult] = useState<{
    isCorrect: boolean;
    scoreAwarded: number;
    newScore: number;
  } | null>(null);

  const [roundReveal, setRoundReveal] = useState<{
    questionIndex: number;
    correctAnswer: string;
    explanation: string;
    playerImage?: string;
    clubLogos?: Record<string, string>;
    roundAnswers: Record<string, PlayerAnswerRecord>;
    scores: Record<string, number>;
  } | null>(room.roundReveal || null);

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

  useEffect(() => {
    playWhistleSound();
    const timer = setTimeout(() => setShowKickoffBanner(false), 1200);
    return () => clearTimeout(timer);
  }, []);

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
    if (hasSubmitted || timeLeft <= 0) return;
    playClickSound();
    setSelectedAnswer(answer);
    setHasSubmitted(true);
    socketService.submitAnswer(room.code, answer, hintUsed, revealedCount);
  };

  const handleUseHint = () => {
    if (hintUsed || hasSubmitted) return;
    playClickSound();
    setHintUsed(true);
    setShowHint(true);
  };

  const participantsList = Object.values(room.participants);

  // ---------------- FINAL RESULTS SCREEN ----------------
  if (finalRankings) {
    const isWinner = finalRankings.winnerId === currentUserId;
    const myRankItem = finalRankings.rankings.find((r) => r.userId === currentUserId);
    const accuracy = myRankItem
      ? Math.round((myRankItem.correctCount / totalQuestions) * 100)
      : 0;

    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full p-4 sm:p-6 animate-fade-in">
          <div className="bg-[#0F3460] border-[4px] border-black shadow-[8px_8px_0px_#000000] p-6 sm:p-8 text-center relative overflow-hidden text-white">
            {/* Header banner */}
            <div className="inline-flex items-center gap-2 mb-4">
              <Football3DBadge name="trophy" baseColor="gold" size="lg" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              {isWinner
                ? isRTL ? 'بطل المباراة!' : 'MATCH CHAMPION!'
                : isRTL ? 'انتهت المباراة' : 'MATCH FINISHED'}
            </h2>
            <div className="mt-2 inline-block bg-[#FFD700] border-[2.5px] border-black px-4 py-1 text-sm font-black uppercase text-black shadow-[2px_2px_0px_#000]">
              {isRTL ? 'الفائز:' : 'WINNER:'}{' '}
              <span>{finalRankings.winnerName}</span>
            </div>

            {/* Personal Match Stats */}
            <div className="grid grid-cols-3 gap-3 my-6">
              <div className="p-3.5 bg-[#16213E] border-[3px] border-black shadow-[3px_3px_0px_#000000]">
                <div className="text-2xl font-black text-[#FFD700] font-mono">
                  {myRankItem?.score || 0}
                </div>
                <div className="text-[10px] text-[#B0BEC5] font-black uppercase mt-1">
                  {isRTL ? 'مجموع النقاط' : 'Total Points'}
                </div>
              </div>
              <div className="p-3.5 bg-[#16213E] border-[3px] border-black shadow-[3px_3px_0px_#000000]">
                <div className="text-2xl font-black text-[#00B140] font-mono">
                  {myRankItem?.correctCount || 0} / {totalQuestions}
                </div>
                <div className="text-[10px] text-[#B0BEC5] font-black uppercase mt-1">
                  {isRTL ? 'إجابات صحيحة' : 'Correct'}
                </div>
              </div>
              <div className="p-3.5 bg-[#16213E] border-[3px] border-black shadow-[3px_3px_0px_#000000]">
                <div className="text-2xl font-black text-white font-mono">
                  {accuracy}%
                </div>
                <div className="text-[10px] text-[#B0BEC5] font-black uppercase mt-1">
                  {isRTL ? 'الدقة' : 'Accuracy'}
                </div>
              </div>
            </div>

            {/* Standings Table */}
            <div className="space-y-2 mb-6 text-left">
              <p className="text-xs font-black text-[#B0BEC5] uppercase tracking-wider text-center mb-2">
                {isRTL ? 'الترتيب النهائي للمباراة' : 'Final Match Standings'}
              </p>
              {finalRankings.rankings.map((p, idx) => (
                <div
                  key={p.userId}
                  className={`p-3 border-[3px] border-black flex items-center justify-between shadow-[3px_3px_0px_#000000] ${
                    p.userId === currentUserId
                      ? 'bg-[#00B140] text-white'
                      : idx === 0
                      ? 'bg-[#FFD700] text-black'
                      : 'bg-[#16213E] text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 bg-black text-white font-black text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div className="w-9 h-9 bg-[#0F3460] border-2 border-black flex items-center justify-center overflow-hidden">
                      <PlayerCharacterAvatar avatarId={p.avatar} className="w-full h-full" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black">{p.username}</span>
                        {p.userId === currentUserId && (
                          <span className="text-[9px] font-black bg-black text-[#00B140] px-1 py-0.2">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold opacity-80">
                        {p.correctCount} / {totalQuestions} {isRTL ? 'صحيح' : 'correct'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-black text-base bg-[#0F3460] text-white px-2 py-0.5 border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                      {p.score} PTS
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <button
              onClick={() => {
                playClickSound();
                onExitGame();
              }}
              className="w-full py-4 neo-btn-green text-sm font-black uppercase tracking-wider cursor-pointer"
            >
              <IconFootballPitch className="w-5 h-5 mr-2" />
              <span>{isRTL ? 'العودة للرئيسية' : 'Back to Dashboard'}</span>
            </button>
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
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full p-4 sm:p-6 animate-fade-in">
          <div className="bg-[#0F3460] border-[4px] border-black shadow-[8px_8px_0px_#000000] p-6 sm:p-8 text-center relative overflow-hidden text-white">
            {/* Round status banner */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#16213E] text-[#FFD700] text-xs font-black uppercase mb-4 border border-black shadow-[2px_2px_0px_#000]">
              <span>
                {isRTL
                  ? `نتيجة الجولة ${questionIndex + 1} من ${totalQuestions}`
                  : `Round ${questionIndex + 1} of ${totalQuestions} Result`}
              </span>
            </div>

            {/* Correct / Incorrect Header */}
            <div className="mb-6">
              <div className="mb-3 flex justify-center">
                {isCorrect ? (
                  <Football3DBadge name="save" baseColor="green" size="lg" />
                ) : (
                  <Football3DBadge name="redcard" baseColor="coral" size="lg" />
                )}
              </div>
              <h3
                className={`text-2xl sm:text-3xl font-black uppercase tracking-tight ${
                  isCorrect ? 'text-[#00B140]' : 'text-[#CC0000]'
                }`}
              >
                {isCorrect
                  ? isRTL ? 'هدف! إجابة صحيحة ومتقنة!' : 'GOAL! CORRECT ANSWER!'
                  : isRTL ? 'بطاقة حمراء! إجابة خاطئة' : 'RED CARD! INCORRECT ANSWER!'}
              </h3>
              <p className="text-xs text-[#B0BEC5] font-bold mt-1">
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
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-black text-[#B0BEC5] uppercase tracking-wider">
                    {isRTL ? 'التشكيلة الكاملة وأسماء النجوم' : 'Complete Starting Lineup'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <ClubCrest clubName={roundReveal.correctAnswer} size="sm" />
                    <span className="text-xs font-black text-white bg-[#00B140] px-2 py-0.5 border border-black">
                      {roundReveal.correctAnswer}
                    </span>
                  </div>
                </div>
                <FormationPitch lineup={currentQuestion.lineup} showNames={true} />
              </div>
            )}

            {/* Correct Answer Showcase */}
            <div className="p-5 bg-[#16213E] border-[3.5px] border-black shadow-[4px_4px_0px_#000000] text-left mb-6 relative text-white">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
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

                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="text-[10px] font-black text-white bg-[#00B140] px-2 py-0.5 uppercase tracking-wider border border-black">
                      {isRTL ? 'الإجابة الرسمية' : 'OFFICIAL ANSWER'}
                    </span>
                  </div>

                  <div className="text-2xl font-black text-white tracking-tight">
                    {roundReveal.correctAnswer}
                  </div>

                  {roundReveal.explanation && (
                    <p className="text-xs text-[#B0BEC5] font-bold mt-2 leading-relaxed border-t-2 border-black pt-2">
                      {roundReveal.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Round Breakdown */}
            <div className="space-y-2 mb-6 text-left">
              <p className="text-xs font-black text-[#B0BEC5] uppercase tracking-wider">
                {isRTL ? 'إجابات المشاركين في هذه الجولة' : 'Round Breakdown'}
              </p>
              {Object.values(roundReveal.roundAnswers).map((rec) => {
                const p = room.participants[rec.userId];
                if (!p) return null;
                const isClub = currentQuestion?.mode === 'nationalities';
                return (
                  <div
                    key={rec.userId}
                    className={`p-3 border-[2.5px] border-black flex items-center justify-between text-xs gap-3 shadow-[2px_2px_0px_#000] text-white ${
                      rec.isCorrect ? 'bg-[#00B140]' : 'bg-[#CC0000]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 bg-[#0F3460] border border-black flex items-center justify-center overflow-hidden shrink-0">
                        <PlayerCharacterAvatar avatarId={p.avatar} className="w-full h-full" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-black truncate">{p.displayName || p.username}</div>
                        <div className="text-[10px] font-bold flex items-center gap-1.5 mt-0.5 opacity-90">
                          <span>{isRTL ? 'أجاب:' : 'answered:'}</span>
                          {rec.answer ? (
                            isClub ? (
                              <ClubCrest clubName={rec.answer} size="sm" className="w-5 h-5 min-w-[20px] p-0.5 inline-flex" />
                            ) : (
                              <PlayerPortrait name={rec.answer} size="xs" className="inline-flex" />
                            )
                          ) : null}
                          <span className="font-black truncate">"{rec.answer || '—'}"</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-black font-mono bg-black text-white px-2 py-0.5 border border-black">
                        {rec.isCorrect ? `+${rec.scoreAwarded} PTS` : '0 PTS'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next question indicator */}
            <div className="py-3 bg-[#16213E] border-[2.5px] border-black text-xs font-black text-[#FFD700] flex items-center justify-center gap-2 shadow-[2px_2px_0px_#000]">
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
        <div className="bg-[#0F3460] border-[4px] border-black shadow-[8px_8px_0px_#000000] p-10 space-y-4 text-white">
          <div className="w-16 h-16 bg-[#00B140] border-[3px] border-black shadow-[4px_4px_0px_#000000] flex items-center justify-center text-3xl mx-auto animate-spin">
            ⚽
          </div>
          <h3 className="text-xl font-black text-white uppercase">
            {isRTL ? 'جاري تجهيز السؤال الأول...' : 'Preparing Question 1...'}
          </h3>
          <p className="text-xs text-[#B0BEC5] font-bold">
            {isRTL ? 'جلب بيانات الأندية والصور والتحقق من التزامن' : 'Synchronizing match data and verified club badges'}
          </p>
        </div>
      </div>
    );
  }

  // ---------------- ACTIVE QUESTION SCREEN ----------------
  const timerPercentage = Math.max(0, Math.min(100, (timeLeft / (room.timeLimit || 20)) * 100));
  const isTimeCritical = timeLeft <= 5;

  return (
    <div className="relative min-h-[85vh] py-4 sm:py-6">
      {/* Broadcast Kickoff Banner */}
      {showKickoffBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 pointer-events-none">
          <div className="text-center p-6 bg-[#0F3460] border-[5px] border-black shadow-[10px_10px_0px_#000000] space-y-2 animate-bounce text-white">
            <div className="w-14 h-14 bg-[#16213E] border-[3px] border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-3xl mx-auto">
              ⚽
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-widest">
              {isRTL ? 'ضربة البداية!' : 'MATCH KICKOFF!'}
            </h1>
            <p className="text-xs font-black bg-[#00B140] text-white px-2 py-1 uppercase border border-black inline-block">
              {currentQuestion.mode === 'two_clubs'
                ? isRTL ? 'لاعب بين الناديين' : 'Two Clubs Challenge'
                : currentQuestion.mode === 'nationalities'
                ? isRTL ? 'خمن النادي من جنسيات اللاعبين' : 'Club by Player Nationalities'
                : isRTL ? 'تاريخ أرقام القمصان' : 'Shirt Number Timeline'}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 space-y-4">
        {/* Top Bar: Round count, countdown, and mini live-scores */}
        <div className="bg-[#0F3460] border-[3.5px] border-black shadow-[5px_5px_0px_#000000] p-3 flex items-center justify-between gap-3 text-white">
          {/* Round Pill */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2.5 py-1 bg-[#00B140] text-white border-2 border-black uppercase shadow-[2px_2px_0px_#000]">
              {currentQuestion?.mode === 'two_clubs'
                ? (isRTL ? 'ناديين' : 'Two Clubs')
                : currentQuestion?.mode === 'nationalities'
                ? (isRTL ? 'جنسيات' : 'Nationalities')
                : (isRTL ? 'القميص' : 'Shirt History')}
            </span>
            <span className="text-sm font-black text-white">
              {isRTL ? 'سؤال' : 'Q'} {questionIndex + 1} / {totalQuestions}
            </span>
          </div>

          {/* Stopwatch Timer */}
          <div
            className={`flex items-center gap-2 px-3 py-1 border-[2.5px] border-black font-mono font-black text-sm ${
              isTimeCritical
                ? 'bg-[#CC0000] text-white shadow-[3px_3px_0px_#000] animate-pulse'
                : 'bg-[#16213E] text-[#FFD700] shadow-[3px_3px_0px_#000]'
            }`}
          >
            <IconRefereeStopwatch className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>

          {/* Live Participants status */}
          <div className="flex items-center gap-1.5">
            {participantsList.map((p) => (
              <div
                key={p.userId}
                className="flex items-center gap-1 text-xs font-black text-white bg-[#16213E] px-2 py-0.5 border-2 border-black shadow-[1.5px_1.5px_0px_#000]"
                title={`${p.displayName || p.username}: ${p.currentScore} pts`}
              >
                <div className="w-4 h-4 overflow-hidden inline-flex items-center justify-center shrink-0">
                  <PlayerCharacterAvatar avatarId={p.avatar} className="w-full h-full" />
                </div>
                <span className="font-mono text-[#FFD700]">{p.currentScore}</span>
                {p.hasAnsweredCurrent && (
                  <span className="text-[#00B140] font-black" title="Answered!">
                    ✓
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timer Progress Bar */}
        <div className="w-full bg-[#16213E] h-2.5 border-[2.5px] border-black shadow-[2px_2px_0px_#000] overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-linear ${
              isTimeCritical ? 'bg-[#CC0000]' : 'bg-[#00B140]'
            }`}
            style={{ width: `${timerPercentage}%` }}
          />
        </div>

        {/* Main Challenge Card */}
        <div className="bg-[#0F3460] border-[4px] border-black shadow-[7px_7px_0px_#000000] p-5 sm:p-7 relative overflow-hidden text-white">
          {/* Question Heading */}
          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
              {currentQuestion?.question ||
                (isRTL ? 'أي نادٍ أو لاعب يطابق هذه التشكيلة الكروية؟' : 'Which football entity matches this clue?')}
            </h2>
            {currentQuestion?.mode === 'nationalities' && (
              <p className="text-xs text-[#B0BEC5] font-bold mt-1">
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
                  const logo1 = currentQuestion.clubLogos?.[cName1] || getClubLogoUrl(cName1);
                  return (
                    <div className="p-4 bg-[#16213E] border-[3px] border-black shadow-[4px_4px_0px_#000000] flex items-center gap-4 text-left">
                      <ClubCrest clubName={cName1} logoUrl={logo1} size="md" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-[#B0BEC5] uppercase font-black tracking-widest block">
                          {isRTL ? 'النادي الأول' : 'Club 1'}
                        </span>
                        <span className={`text-base sm:text-lg font-black truncate block text-white`}>
                          {cName1}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* VS Badge */}
                <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#CC0000] text-white border-[2.5px] border-black items-center justify-center text-xs font-black z-10 shadow-[3px_3px_0px_#000]">
                  VS
                </div>

                {/* Club 2 */}
                {(() => {
                  const cName2 = currentQuestion.clubs[1];
                  const logo2 = currentQuestion.clubLogos?.[cName2] || getClubLogoUrl(cName2);
                  return (
                    <div className="p-4 bg-[#16213E] border-[3px] border-black shadow-[4px_4px_0px_#000000] flex items-center gap-4 text-left">
                      <ClubCrest clubName={cName2} logoUrl={logo2} size="md" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-[#B0BEC5] uppercase font-black tracking-widest block">
                          {isRTL ? 'النادي الثاني' : 'Club 2'}
                        </span>
                        <span className={`text-base sm:text-lg font-black truncate block text-white`}>
                          {cName2}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* MODE 2: SHIRT NUMBERS & CLUB HISTORY */}
          {currentQuestion?.mode === 'shirt_history' && currentQuestion.sequence && (
            <div className="mb-8">
              <div className="bg-[#16213E] border-[3px] border-black p-4 sm:p-5 shadow-[4px_4px_0px_#000] text-white">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    {isRTL ? 'تسلسل المسيرة وأرقام القمصان عبر الأندية' : 'Career Timeline & Shirt Numbers'}
                  </span>
                  <span className="text-[10px] font-black text-white bg-[#00B140] px-2 py-0.5 border border-black shadow-[1.5px_1.5px_0px_#000]">
                    {currentQuestion.sequence.length} {isRTL ? 'أندية' : 'Clubs'}
                  </span>
                </div>

                <div className="space-y-2">
                  {currentQuestion.sequence.map((step, idx) => {
                    const stepLogo = currentQuestion.clubLogos?.[step.club] || getClubLogoUrl(step.club);
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-[#0F3460] border-[2.5px] border-black shadow-[2px_2px_0px_#000] text-white"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Jersey number */}
                          <div className="w-9 h-9 bg-[#00B140] border-2 border-black flex items-center justify-center font-black text-white text-sm shrink-0 shadow-[1.5px_1.5px_0px_#000]">
                            #{step.number}
                          </div>

                          <ClubCrest clubName={step.club} logoUrl={stepLogo} size="sm" />

                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-black text-white truncate">
                              {step.club}
                            </div>
                            <div className="text-[10px] text-[#B0BEC5] font-bold">
                              {isRTL ? 'الفترة:' : 'Period:'} {step.period}
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] text-[#FFD700] font-mono font-black shrink-0 pl-2">
                          STEP {idx + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: 4-3-3 TACTICAL FORMATION PITCH */}
          {currentQuestion?.mode === 'nationalities' && currentQuestion.lineup && (
            <div className="mb-6 space-y-3">
              <FormationPitch lineup={currentQuestion.lineup} showNames={false} />

              <div className="p-3 bg-[#16213E] border-[2.5px] border-black shadow-[3px_3px_0px_#000] flex flex-wrap items-center justify-between gap-3 text-xs text-white">
                <div className="flex items-center gap-2">
                  <IconFootballPitch className="w-4 h-4" />
                  <span className="text-white font-black uppercase">
                    {isRTL ? 'جميع أعلام تشكيلة الـ 11 لاعباً ظاهرة على الملعب' : 'All 11 Starting XI Flags Active on Pitch'}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 bg-[#00B140] text-white font-mono font-black border border-black">
                  11 / 11 FLAGS • 100 PTS
                </span>
              </div>
            </div>
          )}

          {/* Hint Button */}
          {room.hintsEnabled && currentQuestion?.hints && currentQuestion.mode !== 'nationalities' && (
            <div className="mb-6 text-center">
              {showHint ? (
                <div className="p-3 bg-[#16213E] border-[2.5px] border-black shadow-[3px_3px_0px_#000] text-xs text-white font-bold inline-block text-left animate-fade-in">
                  <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[#FFD700] mb-1">
                    <IconRefereeWhistle className="w-4 h-4" />
                    <span>{isRTL ? 'تلميح كشفي (-25 نقطة)' : 'Scout Hint (-25 pts)'}</span>
                  </div>
                  {currentQuestion.hints.nationality && (
                    <p className="text-[#B0BEC5]">• {isRTL ? 'الجنسية:' : 'Nationality:'} <strong className="text-white">{currentQuestion.hints.nationality}</strong></p>
                  )}
                  {currentQuestion.hints.position && (
                    <p className="text-[#B0BEC5]">• {isRTL ? 'المركز:' : 'Position:'} <strong className="text-white">{currentQuestion.hints.position}</strong></p>
                  )}
                  {currentQuestion.hints.careerYears && (
                    <p className="text-[#B0BEC5]">• {isRTL ? 'الحقبة:' : 'Era:'} <strong className="text-white">{currentQuestion.hints.careerYears}</strong></p>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleUseHint}
                  disabled={hasSubmitted || timeLeft <= 0}
                  className="neo-btn-secondary px-4 py-2 text-xs font-black uppercase cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <IconRefereeWhistle className="w-4 h-4" />
                  <span>{isRTL ? 'هل تحتاج تلميحاً؟ (-25 نقطة)' : 'Need a Hint? (-25 pts)'}</span>
                </button>
              )}
            </div>
          )}

          {/* MULTIPLE CHOICE OPTIONS (Mode 3 & Mode 1) */}
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
                      className={`p-3.5 sm:p-4 border-[3px] border-black text-left font-black text-sm transition cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#00B140] text-white shadow-[1px_1px_0px_#000] translate-x-[3px] translate-y-[3px]'
                          : hasSubmitted
                          ? 'bg-[#16213E] text-[#B0BEC5] opacity-50 shadow-none'
                          : 'bg-[#16213E] text-white hover:bg-[#00B140] shadow-[4px_4px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000]'
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
                      {isSelected && <span className="font-black text-lg text-white">✓</span>}
                    </button>
                  );
                })}
              </div>

              {/* Or type custom answer */}
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
                      className="w-full neo-input text-xs"
                    />
                    {/* Autocomplete suggestions dropdown */}
                    {(clubSuggestions.length > 0 || playerSuggestions.length > 0) && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-[#0F3460] border-[3px] border-black shadow-[5px_5px_0px_#000000] z-30 overflow-hidden divide-y-2 divide-black text-white">
                        {(currentQuestion.mode === 'nationalities' ? clubSuggestions : playerSuggestions).map((item) => (
                          <div
                            key={item}
                            onClick={() => {
                              setTypedAnswer(item);
                              setClubSuggestions([]);
                              setPlayerSuggestions([]);
                              handleSubmitAnswer(item);
                            }}
                            className="p-2.5 hover:bg-[#00B140] text-xs font-black text-white cursor-pointer flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {currentQuestion.mode === 'nationalities' ? (
                                <ClubCrest clubName={item} size="sm" className="w-6 h-6 min-w-[24px]" />
                              ) : (
                                <PlayerPortrait name={item} size="xs" />
                              )}
                              <span className="truncate">{item}</span>
                            </div>
                            <span className="font-black text-white">→</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={hasSubmitted || !typedAnswer.trim() || timeLeft <= 0}
                    className="neo-btn-green px-6 py-2.5 text-xs font-black uppercase cursor-pointer disabled:opacity-40"
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
                  <div className="absolute left-3.5 top-3.5 pointer-events-none text-[#B0BEC5]">
                    <IconScoutSearch className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={typedAnswer}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    disabled={hasSubmitted || timeLeft <= 0}
                    placeholder={isRTL ? 'ابحث باسم اللاعب أو اكتبه مباشرة...' : 'Type player name (e.g. Cristiano Ronaldo, Messi...)'}
                    className="w-full neo-input pl-10 pr-4 py-3 text-sm"
                  />
                  {playerSuggestions.length > 0 && !hasSubmitted && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#0F3460] border-[3px] border-black shadow-[5px_5px_0px_#000000] z-30 overflow-hidden divide-y-2 divide-black text-white">
                      {playerSuggestions.map((name) => (
                        <div
                          key={name}
                          onClick={() => {
                            setTypedAnswer(name);
                            setPlayerSuggestions([]);
                            handleSubmitAnswer(name);
                          }}
                          className="p-3 hover:bg-[#00B140] text-xs font-black text-white cursor-pointer flex items-center justify-between gap-2.5"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <PlayerPortrait name={name} size="xs" />
                            <span className="truncate">{name}</span>
                          </div>
                          <span className="font-black text-white">→</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={hasSubmitted || !typedAnswer.trim() || timeLeft <= 0}
                  className="w-full neo-btn-green py-3.5 text-xs font-black uppercase tracking-wider cursor-pointer disabled:opacity-40"
                >
                  {isRTL ? 'تأكيد الإجابة' : 'Confirm Player Answer'}
                </button>
              </form>
            </div>
          )}

          {/* Locked Answer Confirmation */}
          {hasSubmitted && (
            <div className="mt-4 p-3.5 bg-[#00B140] text-white border-[3px] border-black shadow-[4px_4px_0px_#000000] flex items-center justify-center gap-3.5 animate-fade-in">
              {currentQuestion.mode === 'nationalities' ? (
                <ClubCrest clubName={selectedAnswer} size="sm" />
              ) : (
                <PlayerPortrait name={selectedAnswer} size="sm" />
              )}
              <div className="text-left">
                <div className="text-[10px] text-white uppercase font-black tracking-wider opacity-90">
                  {isRTL ? 'إجابتك المسجلة' : 'YOUR LOCKED CHOICE'}
                </div>
                <div className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>✓</span>
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
