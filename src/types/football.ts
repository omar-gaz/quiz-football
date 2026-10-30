export type GameModeType = 'two_clubs' | 'shirt_history';
export type DifficultyType = 'easy' | 'medium' | 'hard';

export interface ShirtSequenceItem {
  club: string;
  number: number;
  period: string;
}

export interface QuestionData {
  id: string;
  mode: GameModeType;
  difficulty: DifficultyType;
  // Two Clubs mode:
  clubs?: [string, string];
  options?: string[]; // multiple-choice options for Two Clubs
  // Shirt History mode:
  sequence?: ShirtSequenceItem[];
  question: string;
  correctAnswer: string;
  acceptedAnswers: string[];
  explanation: string;
  hints?: {
    nationality?: string;
    position?: string;
    careerYears?: string;
  };
  clubLogos?: Record<string, string>;
  playerImage?: string;
  isActive?: boolean;
}

// Client-sanitized question (does NOT contain correctAnswer, acceptedAnswers, or explanation before round completes)
export interface ClientQuestion {
  id: string;
  mode: GameModeType;
  difficulty: DifficultyType;
  question: string;
  clubs?: [string, string];
  options?: string[];
  sequence?: ShirtSequenceItem[];
  hints?: {
    nationality?: string;
    position?: string;
    careerYears?: string;
  };
  clubLogos?: Record<string, string>;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  totalGames: number;
  wins: number;
  losses: number;
  totalPoints: number;
  winRate: number; // percentage 0-100
  isOnline: boolean;
  createdAt: number;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUsername: string;
  fromAvatar: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: number;
}

export interface MatchHistoryItem {
  id: string;
  matchId: string;
  mode: GameModeType;
  date: number;
  players: {
    userId: string;
    username: string;
    avatar: string;
    score: number;
    rank: number;
    correctCount: number;
  }[];
  winnerId: string;
  winnerName: string;
  userScore: number;
  userRank: number;
  totalQuestions: number;
}

export interface PlayerAnswerRecord {
  userId: string;
  answer: string;
  isCorrect: boolean;
  scoreAwarded: number;
  answerTimeSec: number;
  hintUsed: boolean;
}

export interface RoomParticipant {
  userId: string;
  username: string;
  avatar: string;
  isHost: boolean;
  isReady: boolean;
  isOnline: boolean;
  currentScore: number;
  totalCorrect: number;
  hasAnsweredCurrent: boolean;
}

export interface GameRoom {
  code: string;
  hostId: string;
  name: string;
  isPrivate: boolean;
  mode: GameModeType;
  difficulty: 'any' | DifficultyType;
  questionsCount: number;
  timeLimit: number; // seconds per question
  hintsEnabled: boolean;
  status: 'lobby' | 'in_round' | 'round_reveal' | 'finished';
  participants: Record<string, RoomParticipant>;
  currentQuestionIndex: number;
  questionIds: string[];
  currentRoundStartTime: number;
  currentRoundEndTime: number;
  answers: Record<number, Record<string, PlayerAnswerRecord>>; // [questionIndex][userId] -> record
  createdAt: number;
}
