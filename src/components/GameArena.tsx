import React, { useState, useEffect, useRef } from 'react';
import { GameRoom, ClientQuestion, PlayerAnswerRecord } from '../types/football.ts';
import { socketService } from '../services/socket.ts';
import { POPULAR_PLAYERS_SUGGESTIONS } from '../data/defaultQuestions.ts';
import { getClubTheme } from '../utils/footballAssets.ts';
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
} from 'lucide-react';

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
  const [hasError, setHasError] = useState(false);

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

  if (logoUrl && !hasError) {
    return (
      <div
        className={`rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center p-1.5 shadow-lg relative group overflow-hidden ${containerSizes[size]} ${className}`}
        title={clubName}
      >
        <img
          src={logoUrl}
          alt={`${clubName} official logo`}
          className={`${imageSizes[size]} object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110`}
          onError={() => setHasError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center shadow-lg ${containerSizes[size]} ${className}`}
      title={clubName}
    >
      <span className={size === 'sm' ? 'text-base' : size === 'md' ? 'text-2xl' : 'text-3xl'}>
        🛡️
      </span>
    </div>
  );
};

export const PlayerPortrait: React.FC<{
  name: string;
  photoUrl?: string;
  className?: string;
}> = ({ name, photoUrl, className = '' }) => {
  const [hasError, setHasError] = useState(false);

  if (photoUrl && !hasError) {
    return (
      <div className={`relative inline-block ${className}`}>
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#39E75F]/60 shadow-xl shadow-[#39E75F]/20 bg-[#0B0F14] mx-auto relative group">
          <img
            src={photoUrl}
            alt={name}
            className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105"
            onError={() => setHasError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-1 left-0 right-0 text-center">
            <span className="text-[9px] font-black tracking-wider uppercase text-[#39E75F] bg-black/85 px-1.5 py-0.5 rounded-full border border-[#39E75F]/40 inline-flex items-center gap-0.5 shadow">
              <span>✓</span> Real Photo
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#151B23] to-[#0B0F14] border border-[#39E75F]/40 flex items-center justify-center text-3xl shadow-lg mx-auto ${className}`}
    >
      ⭐
    </div>
  );
};

export const GameArena: React.FC<GameArenaProps> = ({
  room,
  currentUserId,
  onExitGame,
}) => {
  // Current round question state
  const [currentQuestion, setCurrentQuestion] = useState<ClientQuestion | null>(null);
  const [questionIndex, setQuestionIndex] = useState(room.currentQuestionIndex || 0);
  const [totalQuestions, setTotalQuestions] = useState(room.questionsCount || 5);
  const [timeLeft, setTimeLeft] = useState<number>(room.timeLimit || 20);

  // Answering state
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [hintUsed, setHintUsed] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [playerSuggestions, setPlayerSuggestions] = useState<string[]>([]);
  const [mySubmissionResult, setMySubmissionResult] = useState<{
    isCorrect: boolean;
    scoreAwarded: number;
    newScore: number;
  } | null>(null);

  // Round reveal state
  const [roundReveal, setRoundReveal] = useState<{
    correctAnswer: string;
    explanation: string;
    playerImage?: string;
    clubLogos?: Record<string, string>;
    roundAnswers: Record<string, PlayerAnswerRecord>;
    scores: Record<string, number>;
  } | null>(null);

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

  // Timer interval ref
  const timerIntervalRef = useRef<any>(null);

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
      setMySubmissionResult(null);
      setRoundReveal(null);
      setPlayerSuggestions([]);

      // Start client visual countdown
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            return 0;
          }
          if (prev <= 6) {
            playTickSound();
          }
          return prev - 1;
        });
      }, 1000);
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
      clearInterval(timerIntervalRef.current);
      setTimeLeft(0);
      setRoundReveal({
        correctAnswer: data.correctAnswer,
        explanation: data.explanation,
        roundAnswers: data.roundAnswers,
        scores: data.scores,
      });
    });

    const unsubGameEnded = socketService.on('game_ended', (data: any) => {
      clearInterval(timerIntervalRef.current);
      setRoundReveal(null);
      setFinalRankings({
        rankings: data.rankings,
        winnerId: data.winnerId,
        winnerName: data.winnerName,
      });

      playWinnerFanfare();
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    });

    return () => {
      clearInterval(timerIntervalRef.current);
      unsubQStart();
      unsubAnswerConfirmed();
      unsubRoundResult();
      unsubGameEnded();
    };
  }, []);

  // Filter player suggestions for Mode 2 or search in Mode 1
  useEffect(() => {
    if (!typedAnswer.trim()) {
      setPlayerSuggestions([]);
      return;
    }
    const q = typedAnswer.toLowerCase().trim();
    const matches = POPULAR_PLAYERS_SUGGESTIONS.filter((name) =>
      name.toLowerCase().includes(q)
    ).slice(0, 5);
    setPlayerSuggestions(matches);
  }, [typedAnswer]);

  const handleSubmitAnswer = (answer: string) => {
    if (hasSubmitted || !currentQuestion || timeLeft <= 0) return;
    playClickSound();
    setHasSubmitted(true);
    setSelectedAnswer(answer);
    socketService.submitAnswer(room.code, answer, hintUsed);
  };

  const handleUseHint = () => {
    if (hasSubmitted || showHint) return;
    playClickSound();
    setShowHint(true);
    setHintUsed(true);
  };

  const participantsList = Object.values(room.participants);
  const myParticipant = room.participants[currentUserId];

  // ---------------- FINAL RESULTS SCREEN ----------------
  if (finalRankings) {
    const isWinner = finalRankings.winnerId === currentUserId;
    const myRankItem = finalRankings.rankings.find((r) => r.userId === currentUserId);
    const accuracy = myRankItem
      ? Math.round((myRankItem.correctCount / totalQuestions) * 100)
      : 0;

    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 animate-fade-in">
        <div className="bg-[#151B23] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center overflow-hidden">
          {/* Glowing winner spotlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#39E75F]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Trophy Header */}
          <div className="relative inline-block mb-3">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-300 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20 mx-auto">
              🏆
            </div>
            {isWinner && (
              <span className="absolute -top-3 -right-3 text-2xl animate-bounce">
                👑
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide">
            {isWinner ? 'Match Champion!' : 'Match Finished'}
          </h2>
          <p className="text-xs sm:text-sm text-[#9AA4B2] mt-1">
            Winner: <span className="font-bold text-[#39E75F]">{finalRankings.winnerName}</span>
          </p>

          {/* Personal Match Stats */}
          <div className="grid grid-cols-3 gap-2.5 my-6">
            <div className="p-3.5 rounded-2xl bg-[#0B0F14] border border-white/5">
              <div className="text-lg font-black text-[#39E75F]">
                {myRankItem?.score || 0}
              </div>
              <div className="text-[10px] text-[#9AA4B2] uppercase font-bold">Total Points</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0B0F14] border border-white/5">
              <div className="text-lg font-black text-white">
                {myRankItem?.correctCount || 0} / {totalQuestions}
              </div>
              <div className="text-[10px] text-[#9AA4B2] uppercase font-bold">Correct Answers</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0B0F14] border border-white/5">
              <div className="text-lg font-black text-sky-400">
                {accuracy}%
              </div>
              <div className="text-[10px] text-[#9AA4B2] uppercase font-bold">Accuracy</div>
            </div>
          </div>

          {/* Final Standings Table */}
          <div className="space-y-2 mb-8 text-left">
            <p className="text-xs font-bold text-[#9AA4B2] uppercase tracking-wider text-center mb-2">
              Final Match Standings
            </p>
            {finalRankings.rankings.map((p, idx) => (
              <div
                key={p.userId}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                  p.userId === currentUserId
                    ? 'bg-[#39E75F]/15 border-[#39E75F]/50 shadow-md'
                    : 'bg-[#0B0F14] border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-black text-sm">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#151B23] flex items-center justify-center text-xl">
                    {p.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{p.username}</span>
                      {p.userId === currentUserId && (
                        <span className="text-[9px] font-black bg-[#39E75F] text-[#0B0F14] px-1.5 py-0.2 rounded">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#9AA4B2]">
                      {p.correctCount} of {totalQuestions} correct
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-[#39E75F]">
                    {p.score.toLocaleString()} pts
                  </div>
                  <div className="text-[10px] text-[#9AA4B2]">
                    Rank #{p.rank}
                  </div>
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
              className="flex-1 py-3.5 rounded-2xl bg-[#39E75F] text-[#0B0F14] font-black text-xs uppercase tracking-wider hover:bg-[#2ed252] transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#39E75F]/20"
            >
              <Home className="w-4 h-4" />
              <span>Back to Dashboard</span>
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
      <div className="max-w-2xl mx-auto p-4 sm:p-6 animate-fade-in">
        <div className="bg-[#151B23] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center">
          {/* Round status banner */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#9AA4B2] uppercase mb-4">
            <span>Round {questionIndex + 1} of {totalQuestions} Result</span>
          </div>

          {/* Correct / Incorrect Header */}
          <div className="mb-6">
            <div
              className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg ${
                isCorrect
                  ? 'bg-[#39E75F]/20 text-[#39E75F] border-2 border-[#39E75F]'
                  : 'bg-red-950/40 text-red-400 border-2 border-red-500'
              }`}
            >
              {isCorrect ? '✓' : '✗'}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
              {isCorrect ? 'Goal! Correct Answer!' : 'Off Target! Incorrect'}
            </h3>
            <p className="text-xs text-[#9AA4B2] mt-1">
              {isCorrect
                ? `You earned +${myAnswer?.scoreAwarded || 0} points in ${myAnswer?.answerTimeSec}s`
                : 'No points awarded this round'}
            </p>
          </div>

          {/* Correct Answer Showcase with Real Player Photo & Club Logos */}
          <div className="p-5 rounded-2xl bg-[#0B0F14] border border-[#39E75F]/30 text-left mb-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Verified Player Photograph */}
              <div className="shrink-0 text-center">
                <PlayerPortrait
                  name={roundReveal.correctAnswer}
                  photoUrl={roundReveal.playerImage}
                />
              </div>

              {/* Player details & Club badges */}
              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-[10px] font-black text-[#39E75F] uppercase tracking-wider bg-[#39E75F]/15 px-2 py-0.5 rounded-full border border-[#39E75F]/30">
                    Official Answer
                  </span>
                  <span className="text-[10px] text-[#9AA4B2] font-semibold">
                    Verified Footballer
                  </span>
                </div>

                <div className="text-xl sm:text-2xl font-black text-white tracking-wide">
                  {roundReveal.correctAnswer}
                </div>

                {/* Clubs played for in this round */}
                {roundReveal.clubLogos && Object.keys(roundReveal.clubLogos).length > 0 && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 my-2.5 flex-wrap">
                    <span className="text-[10px] text-[#9AA4B2] font-bold uppercase tracking-wider">
                      Clubs:
                    </span>
                    {Object.entries(roundReveal.clubLogos).map(([cName, lUrl]) => (
                      <div
                        key={cName}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-[#151B23] border border-white/10"
                        title={cName}
                      >
                        <ClubCrest clubName={cName} logoUrl={lUrl as string} size="sm" />
                        <span className="text-xs font-bold text-white/90">{cName}</span>
                      </div>
                    ))}
                  </div>
                )}

                {roundReveal.explanation && (
                  <p className="text-xs text-[#9AA4B2] mt-2 leading-relaxed border-t border-white/5 pt-2">
                    {roundReveal.explanation}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Opponents answers summary */}
          <div className="space-y-2 mb-6 text-left">
            <p className="text-[11px] font-bold text-[#9AA4B2] uppercase tracking-wider">
              Round Breakdown
            </p>
            {Object.values(roundReveal.roundAnswers).map((rec) => {
              const p = room.participants[rec.userId];
              if (!p) return null;
              return (
                <div
                  key={rec.userId}
                  className="p-3 rounded-xl bg-[#0B0F14] border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span>{p.avatar}</span>
                    <div>
                      <span className="font-bold text-white">{p.username}</span>
                      <span className="text-[10px] text-[#9AA4B2] ml-2">
                        answered "{rec.answer || '—'}"
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        rec.isCorrect ? 'text-[#39E75F]' : 'text-red-400'
                      }`}
                    >
                      {rec.isCorrect ? `+${rec.scoreAwarded} pts` : '+0 pts'}
                    </span>
                    {rec.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-[#39E75F]" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Synchronized next question countdown pill */}
          <div className="py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-[#9AA4B2] flex items-center justify-center gap-2">
            <span className="animate-spin text-sm">⚽</span>
            <span>Next question starting in a few seconds...</span>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- ACTIVE QUESTION SCREEN ----------------
  const timerPercentage = Math.max(0, Math.min(100, (timeLeft / (room.timeLimit || 20)) * 100));
  const isTimeCritical = timeLeft <= 5;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 animate-fade-in">
      {/* Top Bar: Round count, countdown, and mini live-scores */}
      <div className="bg-[#151B23] border border-white/10 rounded-2xl p-3.5 mb-4 shadow-md flex items-center justify-between gap-3">
        {/* Round Pill */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#39E75F]/20 text-[#39E75F] uppercase tracking-wider">
            {currentQuestion?.mode === 'two_clubs' ? 'Two Clubs' : 'Shirt History'}
          </span>
          <span className="text-xs font-bold text-white">
            Q {questionIndex + 1} <span className="text-[#9AA4B2]">/ {totalQuestions}</span>
          </span>
        </div>

        {/* Circular / Pill Timer */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono font-black text-xs transition ${
            isTimeCritical
              ? 'bg-red-950/60 text-red-400 border-red-500 animate-pulse'
              : 'bg-[#0B0F14] text-[#39E75F] border-[#39E75F]/40'
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
              className="flex items-center gap-1 text-[11px] font-bold text-white bg-[#0B0F14] px-2 py-0.5 rounded-lg border border-white/5"
              title={`${p.username}: ${p.currentScore} pts`}
            >
              <span>{p.avatar}</span>
              <span className="text-[#39E75F]">{p.currentScore}</span>
              {p.hasAnsweredCurrent && (
                <span className="text-[10px] text-[#39E75F] font-black" title="Locked in!">
                  ✓
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Timer Progress Bar */}
      <div className="w-full bg-[#151B23] h-1.5 rounded-full overflow-hidden mb-5">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isTimeCritical ? 'bg-red-500' : 'bg-[#39E75F]'
          }`}
          style={{ width: `${timerPercentage}%` }}
        />
      </div>

      {/* Main Challenge Card */}
      <div className="bg-[#151B23] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        {/* Question Heading */}
        <div className="text-center mb-6">
          <h2 className="text-base sm:text-lg font-black text-white">
            {currentQuestion?.question || 'Which player matches this clue?'}
          </h2>
        </div>

        {/* MODE 1: TWO CLUBS PRESENTATION */}
        {currentQuestion?.mode === 'two_clubs' && currentQuestion.clubs && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center relative">
              {/* Club 1 */}
              {(() => {
                const cName1 = currentQuestion.clubs[0];
                const theme1 = getClubTheme(cName1);
                const logo1 = currentQuestion.clubLogos?.[cName1];
                return (
                  <div
                    className={`p-5 rounded-2xl border ${theme1.border} ${theme1.bg} flex items-center gap-4 text-left shadow-lg relative overflow-hidden group`}
                  >
                    <ClubCrest clubName={cName1} logoUrl={logo1} size="md" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-[#9AA4B2] uppercase font-bold tracking-widest block mb-0.5">
                        Club 1
                      </span>
                      <span className={`text-base sm:text-lg font-black truncate block ${theme1.text}`}>
                        {cName1}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Lightning vs badge */}
              <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0B0F14] border-2 border-[#39E75F]/60 items-center justify-center text-xs font-black text-[#39E75F] z-10 shadow-xl">
                VS
              </div>

              {/* Club 2 */}
              {(() => {
                const cName2 = currentQuestion.clubs[1];
                const theme2 = getClubTheme(cName2);
                const logo2 = currentQuestion.clubLogos?.[cName2];
                return (
                  <div
                    className={`p-5 rounded-2xl border ${theme2.border} ${theme2.bg} flex items-center gap-4 text-left shadow-lg relative overflow-hidden group`}
                  >
                    <ClubCrest clubName={cName2} logoUrl={logo2} size="md" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-[#9AA4B2] uppercase font-bold tracking-widest block mb-0.5">
                        Club 2
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
            <div className="bg-[#0B0F14] border border-white/5 rounded-2xl p-4 sm:p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] font-black text-[#9AA4B2] uppercase tracking-wider">
                  Chronological Career Timeline
                </span>
                <span className="text-[10px] font-bold text-[#39E75F] bg-[#39E75F]/15 px-2 py-0.5 rounded-full border border-[#39E75F]/30">
                  {currentQuestion.sequence.length} Career Clubs
                </span>
              </div>

              <div className="space-y-2.5">
                {currentQuestion.sequence.map((step, idx) => {
                  const theme = getClubTheme(step.club);
                  const stepLogo = currentQuestion.clubLogos?.[step.club];
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#151B23] border border-white/5 hover:border-white/10 transition group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Jersey Number Badge */}
                        <div className="w-10 h-10 rounded-xl bg-[#0B0F14] border-2 border-[#39E75F]/60 flex items-center justify-center font-black text-white text-base shadow-inner shrink-0">
                          <span className="text-[#39E75F]">#{step.number}</span>
                        </div>

                        {/* Club Official Crest */}
                        <ClubCrest clubName={step.club} logoUrl={stepLogo} size="sm" />

                        <div className="min-w-0">
                          <div className={`text-xs sm:text-sm font-black truncate ${theme.text}`}>
                            {step.club}
                          </div>
                          <div className="text-[10px] text-[#9AA4B2]">
                            Period: {step.period}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] text-[#9AA4B2] font-mono shrink-0 pl-2">
                        Step {idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Hint System */}
        {room.hintsEnabled && currentQuestion?.hints && (
          <div className="mb-6 text-center">
            {showHint ? (
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/40 text-xs text-amber-300 font-medium inline-block text-left animate-fade-in">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tactical Scout Hint (-25 pts)</span>
                </div>
                {currentQuestion.hints.nationality && (
                  <p>• Nationality: <strong>{currentQuestion.hints.nationality}</strong></p>
                )}
                {currentQuestion.hints.position && (
                  <p>• Position: <strong>{currentQuestion.hints.position}</strong></p>
                )}
                {currentQuestion.hints.careerYears && (
                  <p>• Era: <strong>{currentQuestion.hints.careerYears}</strong></p>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleUseHint}
                disabled={hasSubmitted || timeLeft <= 0}
                className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-[#9AA4B2] hover:text-amber-400 transition cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Need a Hint? (-25 pts)</span>
              </button>
            )}
          </div>
        )}

        {/* INPUT OPTIONS: Multiple Choice (Mode 1) OR Typed Search (Mode 2 & 1) */}
        {currentQuestion?.mode === 'two_clubs' && currentQuestion.options ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedAnswer === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={hasSubmitted || timeLeft <= 0}
                    onClick={() => handleSubmitAnswer(opt)}
                    className={`p-4 rounded-2xl border text-left font-bold text-sm transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#39E75F]/20 border-[#39E75F] text-[#39E75F] shadow-lg shadow-[#39E75F]/20'
                        : hasSubmitted
                        ? 'bg-[#0B0F14] border-white/5 text-[#9AA4B2] opacity-60'
                        : 'bg-[#0B0F14] border-white/10 text-white hover:border-[#39E75F]/60 hover:bg-white/5'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check className="w-5 h-5 text-[#39E75F]" />}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Text input with Autocomplete Suggestions (for Mode 2 or general typing) */
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#9AA4B2] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && typedAnswer.trim() && !hasSubmitted) {
                    handleSubmitAnswer(typedAnswer.trim());
                  }
                }}
                disabled={hasSubmitted || timeLeft <= 0}
                placeholder="Type footballer name (e.g. Cristiano Ronaldo, Messi, Beckham...)"
                className="w-full bg-[#0B0F14] border-2 border-white/10 focus:border-[#39E75F] rounded-2xl pl-10 pr-24 py-3 text-sm text-white focus:outline-none transition disabled:opacity-50"
              />

              <button
                type="button"
                disabled={hasSubmitted || !typedAnswer.trim() || timeLeft <= 0}
                onClick={() => handleSubmitAnswer(typedAnswer.trim())}
                className="absolute right-2 top-2 px-4 py-1.5 rounded-xl bg-[#39E75F] text-[#0B0F14] font-black text-xs uppercase tracking-wider hover:bg-[#2ed252] transition cursor-pointer disabled:opacity-40"
              >
                Submit
              </button>
            </div>

            {/* Live Autocomplete suggestions */}
            {!hasSubmitted && playerSuggestions.length > 0 && (
              <div className="p-2 bg-[#0B0F14] border border-white/10 rounded-xl space-y-1">
                <span className="text-[10px] text-[#9AA4B2] uppercase font-bold px-2">Suggestions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {playerSuggestions.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        setTypedAnswer(name);
                        handleSubmitAnswer(name);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#39E75F]/20 text-xs font-semibold text-white hover:text-[#39E75F] border border-white/10 transition cursor-pointer"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lock-in feedback */}
        {hasSubmitted && (
          <div className="mt-5 p-3 rounded-2xl bg-[#0B0F14] border border-[#39E75F]/40 flex items-center justify-center gap-2 text-xs font-bold text-[#39E75F] animate-fade-in">
            <Check className="w-4 h-4" />
            <span>Answer locked in! Waiting for other players or timer expiration...</span>
          </div>
        )}
      </div>
    </div>
  );
};
