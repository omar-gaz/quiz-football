import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { INITIAL_QUESTIONS } from './src/data/defaultQuestions.ts';
import {
  UserProfile,
  FriendRequest,
  QuestionData,
  MatchHistoryItem,
  GameRoom,
  ClientQuestion,
  GameModeType,
} from './src/types/football.ts';
import {
  getOrFetchClubLogo,
  getOrFetchPlayerPhoto,
  indexAndEnrichQuestions,
  getAllCachedImages,
} from './src/services/imageManager.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'football_trivia_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseSchema {
  users: Record<string, UserProfile & { passwordHash: string }>;
  friendRequests: FriendRequest[];
  friends: Record<string, string[]>; // userId -> array of friend userIds
  questions: QuestionData[];
  matchHistory: MatchHistoryItem[];
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      // Ensure initial questions exist and required 6 questions are present
      if (!data.questions || data.questions.length === 0) {
        data.questions = INITIAL_QUESTIONS;
        saveDatabase(data);
      } else {
        let added = false;
        for (const defaultQ of INITIAL_QUESTIONS) {
          if (!data.questions.some((q: QuestionData) => q.id === defaultQ.id)) {
            data.questions.push(defaultQ);
            added = true;
          }
        }
        if (added) {
          saveDatabase(data);
        }
      }
      return data;
    }
  } catch (err) {
    console.error('Error loading DB, initializing fresh:', err);
  }

  // Initial seed with demo accounts so instant testing is smooth
  const initialDb: DatabaseSchema = {
    users: {
      'user_ronaldo': {
        id: 'user_ronaldo',
        username: 'striker_cr7',
        displayName: 'CR7 Fanatic',
        avatar: '⚡',
        totalGames: 18,
        wins: 14,
        losses: 4,
        totalPoints: 2450,
        winRate: 78,
        isOnline: false,
        createdAt: Date.now() - 86400000 * 5,
        passwordHash: 'pass123',
      },
      'user_messi': {
        id: 'user_messi',
        username: 'leo_legend',
        displayName: 'La Pulga',
        avatar: '👑',
        totalGames: 22,
        wins: 17,
        losses: 5,
        totalPoints: 2980,
        winRate: 77,
        isOnline: false,
        createdAt: Date.now() - 86400000 * 7,
        passwordHash: 'pass123',
      },
      'user_zidane': {
        id: 'user_zidane',
        username: 'midfield_maestro',
        displayName: 'Zizou Magic',
        avatar: '⚽',
        totalGames: 12,
        wins: 8,
        losses: 4,
        totalPoints: 1620,
        winRate: 67,
        isOnline: false,
        createdAt: Date.now() - 86400000 * 3,
        passwordHash: 'pass123',
      },
    },
    friendRequests: [],
    friends: {
      'user_ronaldo': ['user_messi', 'user_zidane'],
      'user_messi': ['user_ronaldo'],
      'user_zidane': ['user_ronaldo'],
    },
    questions: INITIAL_QUESTIONS,
    matchHistory: [],
  };

  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save database file:', err);
  }
}

const db = loadDatabase();

// In-memory active multiplayer rooms and real-time state
const activeRooms: Map<string, GameRoom> = new Map();
const userSockets: Map<string, WebSocket> = new Map();
const socketUsers: Map<WebSocket, string> = new Map();
const roomRoundTimers: Map<string, NodeJS.Timeout> = new Map();

function sanitizeUser(user: UserProfile & { passwordHash?: string }): UserProfile {
  const { passwordHash, ...safe } = user;
  safe.isOnline = userSockets.has(safe.id);
  return safe;
}

function sanitizeQuestionForClient(q: QuestionData): ClientQuestion {
  return {
    id: q.id,
    mode: q.mode,
    difficulty: q.difficulty,
    question: q.question,
    clubs: q.clubs,
    options: q.options,
    sequence: q.sequence,
    formation: q.formation,
    lineup: q.lineup,
    hints: q.hints,
    clubLogos: q.clubLogos,
  };
}

function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^\w\s\u0600-\u06FF]/g, '') // preserve letters, numbers, and Arabic
    .trim();
}

function checkAnswerCorrectness(userAnswer: string, question: QuestionData): boolean {
  if (!userAnswer || !question) return false;
  const cleanUser = normalizeAnswer(userAnswer);

  const cleanCorrect = normalizeAnswer(question.correctAnswer);
  if (cleanUser === cleanCorrect) return true;

  for (const accepted of question.acceptedAnswers || []) {
    const cleanAccepted = normalizeAnswer(accepted);
    if (cleanUser === cleanAccepted) return true;
    // Allow matching key surname or full name part if substantial
    if (cleanAccepted.length >= 4 && cleanUser === cleanAccepted) {
      return true;
    }
  }

  // Also check if user typed exact option if option matches correct answer
  if (question.options) {
    for (const opt of question.options) {
      if (normalizeAnswer(opt) === cleanCorrect && normalizeAnswer(opt) === cleanUser) {
        return true;
      }
    }
  }

  return false;
}

const app = express();
app.use(express.json());

// Serve locally cached verified football images
const IMAGES_CACHE_DIR = path.join(DATA_DIR, 'images_cache');
if (!fs.existsSync(IMAGES_CACHE_DIR)) {
  fs.mkdirSync(IMAGES_CACHE_DIR, { recursive: true });
}
app.use('/api/images/cache', express.static(IMAGES_CACHE_DIR));

// Automatic Image Search & Retrieval API
app.get('/api/images/club', async (req, res) => {
  const name = (req.query.name as string || '').trim();
  if (!name) return res.status(400).json({ error: 'Club name required' });
  const logoUrl = await getOrFetchClubLogo(name);
  return res.json({ club: name, logoUrl });
});

app.get('/api/images/player', async (req, res) => {
  const name = (req.query.name as string || '').trim();
  if (!name) return res.status(400).json({ error: 'Player name required' });
  const photoUrl = await getOrFetchPlayerPhoto(name);
  return res.json({ player: name, photoUrl });
});

app.get('/api/images/all', (req, res) => {
  return res.json(getAllCachedImages());
});

app.post('/api/images/index-all', async (req, res) => {
  await indexAndEnrichQuestions(db.questions);
  saveDatabase(db);
  return res.json({ success: true, count: db.questions.length, cached: getAllCachedImages() });
});

// --- REST API ROUTES ---

// 1. Auth: Register
app.post('/api/auth/register', (req, res) => {
  const { username, displayName, avatar, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const cleanUsername = username.trim().toLowerCase();
  const existing = Object.values(db.users).find(
    (u) => u.username.toLowerCase() === cleanUsername
  );
  if (existing) {
    return res.status(409).json({ error: 'Username already taken' });
  }

  const userId = 'usr_' + Math.random().toString(36).substring(2, 10);
  const newUser: UserProfile & { passwordHash: string } = {
    id: userId,
    username: username.trim(),
    displayName: displayName?.trim() || username.trim(),
    avatar: avatar || '⚽',
    totalGames: 0,
    wins: 0,
    losses: 0,
    totalPoints: 0,
    winRate: 0,
    isOnline: true,
    createdAt: Date.now(),
    passwordHash: password,
  };

  db.users[userId] = newUser;
  db.friends[userId] = [];
  saveDatabase(db);

  return res.json({
    user: sanitizeUser(newUser),
    token: userId,
  });
});

// 2. Auth: Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const cleanUsername = username.trim().toLowerCase();
  const user = Object.values(db.users).find(
    (u) => u.username.toLowerCase() === cleanUsername
  );

  if (!user || (password && user.passwordHash !== password)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  return res.json({
    user: sanitizeUser(user),
    token: user.id,
  });
});

// 3. Auth: Current User Profile
app.get('/api/auth/me', (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '') || (req.query.userId as string);
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  if (!db.users[userId]) {
    // If it's a known format user from previous sessions, restore basic user profile
    if (userId.startsWith('usr_') || userId.startsWith('user_')) {
      const uName = `player_${userId.slice(-4)}`;
      db.users[userId] = {
        id: userId,
        username: uName,
        displayName: uName,
        avatar: '⚽',
        totalGames: 0,
        wins: 0,
        losses: 0,
        totalPoints: 0,
        winRate: 0,
        isOnline: true,
        createdAt: Date.now(),
        passwordHash: 'session_restored',
      };
      db.friends[userId] = db.friends[userId] || [];
      saveDatabase(db);
      return res.json({ user: sanitizeUser(db.users[userId]) });
    }
    return res.status(401).json({ error: 'Not authenticated' });
  }
  return res.json({ user: sanitizeUser(db.users[userId]) });
});

// 4. Update Profile (avatar / display name)
app.put('/api/auth/profile', (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '');
  if (!userId || !db.users[userId]) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { displayName, avatar } = req.body;
  if (displayName) db.users[userId].displayName = displayName.trim();
  if (avatar) db.users[userId].avatar = avatar;
  saveDatabase(db);
  return res.json({ user: sanitizeUser(db.users[userId]) });
});

// 5. Search Users
app.get('/api/users/search', (req, res) => {
  const q = (req.query.q as string || '').toLowerCase().trim();
  const currentUserId = req.headers.authorization?.replace('Bearer ', '') || '';
  if (!q) return res.json({ users: [] });

  const results = Object.values(db.users)
    .filter((u) => u.id !== currentUserId && (
      u.username.toLowerCase().includes(q) ||
      u.displayName.toLowerCase().includes(q)
    ))
    .slice(0, 10)
    .map(sanitizeUser);

  return res.json({ users: results });
});

// 6. Friends: Get list
app.get('/api/friends', (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '');
  if (!userId || !db.users[userId]) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const friendIds = db.friends[userId] || [];
  const friends = friendIds.map((id) => db.users[id]).filter(Boolean).map(sanitizeUser);

  // Incoming and outgoing pending requests
  const incoming = (db.friendRequests || []).filter(
    (r) => r.toUserId === userId && r.status === 'pending'
  );
  const outgoing = (db.friendRequests || []).filter(
    (r) => r.fromUserId === userId && r.status === 'pending'
  );

  return res.json({ friends, incoming, outgoing });
});

// 7. Friends: Send request
app.post('/api/friends/request', (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '');
  const { targetUserId } = req.body;
  if (!userId || !db.users[userId]) return res.status(401).json({ error: 'Unauthorized' });
  if (!targetUserId || !db.users[targetUserId]) return res.status(404).json({ error: 'User not found' });
  if (userId === targetUserId) return res.status(400).json({ error: 'Cannot add yourself' });

  const currentFriends = db.friends[userId] || [];
  if (currentFriends.includes(targetUserId)) {
    return res.status(400).json({ error: 'Already friends' });
  }

  // Check if request already pending
  const existingReq = (db.friendRequests || []).find(
    (r) => (r.fromUserId === userId && r.toUserId === targetUserId && r.status === 'pending') ||
           (r.fromUserId === targetUserId && r.toUserId === userId && r.status === 'pending')
  );

  if (existingReq) {
    if (existingReq.toUserId === userId) {
      // Auto-accept if reciprocal
      existingReq.status = 'accepted';
      db.friends[userId] = [...(db.friends[userId] || []), targetUserId];
      db.friends[targetUserId] = [...(db.friends[targetUserId] || []), userId];
      saveDatabase(db);
      return res.json({ success: true, message: 'Friend request accepted!' });
    }
    return res.status(400).json({ error: 'Request already pending' });
  }

  const newReq: FriendRequest = {
    id: 'freq_' + Math.random().toString(36).substring(2, 9),
    fromUserId: userId,
    toUserId: targetUserId,
    fromUsername: db.users[userId].username,
    fromAvatar: db.users[userId].avatar,
    status: 'pending',
    createdAt: Date.now(),
  };

  db.friendRequests = db.friendRequests || [];
  db.friendRequests.push(newReq);
  saveDatabase(db);

  // Notify recipient via websocket if online
  const targetWs = userSockets.get(targetUserId);
  if (targetWs && targetWs.readyState === WebSocket.OPEN) {
    targetWs.send(JSON.stringify({
      type: 'new_friend_request',
      request: newReq,
    }));
  }

  return res.json({ success: true, request: newReq });
});

// 8. Friends: Respond to request
app.post('/api/friends/respond', (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '');
  const { requestId, action } = req.body; // 'accept' | 'decline'
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const reqItem = (db.friendRequests || []).find((r) => r.id === requestId && r.toUserId === userId);
  if (!reqItem) return res.status(404).json({ error: 'Request not found' });

  if (action === 'accept') {
    reqItem.status = 'accepted';
    db.friends[userId] = [...(db.friends[userId] || []), reqItem.fromUserId];
    db.friends[reqItem.fromUserId] = [...(db.friends[reqItem.fromUserId] || []), userId];

    // Notify requester
    const senderWs = userSockets.get(reqItem.fromUserId);
    if (senderWs && senderWs.readyState === WebSocket.OPEN) {
      senderWs.send(JSON.stringify({
        type: 'friend_request_accepted',
        friend: sanitizeUser(db.users[userId]),
      }));
    }
  } else {
    reqItem.status = 'declined';
  }

  saveDatabase(db);
  return res.json({ success: true });
});

// 9. Friends: Remove friend
app.post('/api/friends/remove', (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '');
  const { friendId } = req.body;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  db.friends[userId] = (db.friends[userId] || []).filter((id) => id !== friendId);
  db.friends[friendId] = (db.friends[friendId] || []).filter((id) => id !== userId);
  saveDatabase(db);

  return res.json({ success: true });
});

// 10. Leaderboard
app.get('/api/leaderboard', (req, res) => {
  const sortBy = (req.query.sortBy as string) || 'points'; // 'points' | 'wins' | 'winRate'
  const allUsers = Object.values(db.users).map(sanitizeUser);

  if (sortBy === 'wins') {
    allUsers.sort((a, b) => b.wins - a.wins || b.totalPoints - a.totalPoints);
  } else if (sortBy === 'winRate') {
    allUsers.sort((a, b) => b.winRate - a.winRate || b.totalGames - a.totalGames);
  } else {
    allUsers.sort((a, b) => b.totalPoints - a.totalPoints || b.wins - a.wins);
  }

  return res.json({
    leaderboard: allUsers.slice(0, 50).map((u, idx) => ({ ...u, rank: idx + 1 })),
  });
});

// 11. Profile & Match History
app.get('/api/users/:userId/stats', (req, res) => {
  const { userId } = req.params;
  const user = db.users[userId];
  if (!user) return res.status(404).json({ error: 'User not found' });

  const history = (db.matchHistory || [])
    .filter((m) => m.players.some((p) => p.userId === userId))
    .slice(-15)
    .reverse();

  return res.json({
    user: sanitizeUser(user),
    history,
  });
});

// 12. Admin Questions: List, Add, Edit, Delete, Seed
app.get('/api/admin/questions', (req, res) => {
  return res.json({ questions: db.questions });
});

app.post('/api/admin/questions', async (req, res) => {
  const newQ: QuestionData = {
    ...req.body,
    id: req.body.id || 'q_' + Math.random().toString(36).substring(2, 9),
    isActive: req.body.isActive !== false,
  };

  if (!newQ.mode || !newQ.correctAnswer || !newQ.question) {
    return res.status(400).json({ error: 'Required question fields missing' });
  }

  // Automatically search, verify, and cache club logos and player photograph
  await indexAndEnrichQuestions([newQ]);

  db.questions.push(newQ);
  saveDatabase(db);
  return res.json({ question: newQ });
});

app.put('/api/admin/questions/:id', async (req, res) => {
  const { id } = req.params;
  const index = db.questions.findIndex((q) => q.id === id);
  if (index === -1) return res.status(404).json({ error: 'Question not found' });

  db.questions[index] = { ...db.questions[index], ...req.body, id };
  // Automatically search, verify, and cache club logos and player photograph
  await indexAndEnrichQuestions([db.questions[index]]);

  saveDatabase(db);
  return res.json({ question: db.questions[index] });
});

app.delete('/api/admin/questions/:id', (req, res) => {
  const { id } = req.params;
  db.questions = db.questions.filter((q) => q.id !== id);
  saveDatabase(db);
  return res.json({ success: true });
});

app.post('/api/admin/seed-default', async (req, res) => {
  db.questions = [...INITIAL_QUESTIONS];
  await indexAndEnrichQuestions(db.questions);
  saveDatabase(db);
  return res.json({ success: true, count: db.questions.length });
});

// --- HTTP SERVER & WEBSOCKET SETUP ---
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function broadcastToRoom(room: GameRoom, data: any) {
  const payload = JSON.stringify(data);
  for (const p of Object.values(room.participants)) {
    const ws = userSockets.get(p.userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  }
}

function broadcastRoomUpdate(room: GameRoom) {
  broadcastToRoom(room, {
    type: 'room_state',
    room: {
      code: room.code,
      hostId: room.hostId,
      name: room.name,
      isPrivate: room.isPrivate,
      mode: room.mode,
      difficulty: room.difficulty,
      questionsCount: room.questionsCount,
      timeLimit: room.timeLimit,
      hintsEnabled: room.hintsEnabled,
      status: room.status,
      participants: room.participants,
      currentQuestionIndex: room.currentQuestionIndex,
      totalQuestions: room.questionIds.length,
      currentRoundStartTime: room.currentRoundStartTime,
      currentRoundEndTime: room.currentRoundEndTime,
      currentQuestion: room.currentQuestion || null,
      roundReveal: room.roundReveal || null,
    },
  });
}

function startRound(room: GameRoom) {
  // Clear any existing timer
  if (roomRoundTimers.has(room.code)) {
    clearTimeout(roomRoundTimers.get(room.code)!);
    roomRoundTimers.delete(room.code);
  }

  const qId = room.questionIds[room.currentQuestionIndex];
  const question = db.questions.find((q) => q.id === qId);

  if (!question) {
    console.error('Question not found for ID:', qId);
    endGame(room);
    return;
  }

  room.status = 'in_round';
  room.currentRoundStartTime = Date.now();
  room.currentRoundEndTime = Date.now() + room.timeLimit * 1000;
  room.currentQuestion = sanitizeQuestionForClient(question);
  room.roundReveal = null;

  // Reset answered flag for participants this round
  for (const p of Object.values(room.participants)) {
    p.hasAnsweredCurrent = false;
  }

  // 1. Immediately broadcast room update so every player receives in_round status and question state
  broadcastRoomUpdate(room);

  // 2. Broadcast question_start event for active animations and sound cues
  broadcastToRoom(room, {
    type: 'question_start',
    questionIndex: room.currentQuestionIndex,
    totalQuestions: room.questionIds.length,
    question: room.currentQuestion,
    timeLimit: room.timeLimit,
    startTime: room.currentRoundStartTime,
    endTime: room.currentRoundEndTime,
    scores: Object.fromEntries(
      Object.values(room.participants).map((p) => [p.userId, p.currentScore])
    ),
  });

  // Schedule timer expiration
  const timer = setTimeout(() => {
    finishRound(room);
  }, room.timeLimit * 1000 + 500);

  roomRoundTimers.set(room.code, timer);
}

function finishRound(room: GameRoom) {
  if (roomRoundTimers.has(room.code)) {
    clearTimeout(roomRoundTimers.get(room.code)!);
    roomRoundTimers.delete(room.code);
  }

  room.status = 'round_reveal';

  const qId = room.questionIds[room.currentQuestionIndex];
  const question = db.questions.find((q) => q.id === qId);

  const roundAnswers = room.answers[room.currentQuestionIndex] || {};

  // For anyone who didn't submit an answer, record timeout
  for (const p of Object.values(room.participants)) {
    if (!roundAnswers[p.userId]) {
      roundAnswers[p.userId] = {
        userId: p.userId,
        answer: '(Timed Out)',
        isCorrect: false,
        scoreAwarded: 0,
        answerTimeSec: room.timeLimit,
        hintUsed: false,
      };
    }
  }

  room.answers[room.currentQuestionIndex] = roundAnswers;

  const revealData = {
    questionIndex: room.currentQuestionIndex,
    correctAnswer: question?.correctAnswer || '',
    explanation: question?.explanation || '',
    playerImage: question?.playerImage || '',
    clubLogos: question?.clubLogos || {},
    roundAnswers,
    scores: Object.fromEntries(
      Object.values(room.participants).map((p) => [p.userId, p.currentScore])
    ),
  };

  room.roundReveal = revealData;

  // Broadcast update to persist room reveal state
  broadcastRoomUpdate(room);

  // Reveal correct answer, explanations, verified player photo and club logos to all players
  broadcastToRoom(room, {
    type: 'round_result',
    ...revealData,
  });

  // Pause for 5 seconds to review, then advance to next question or end game
  const advanceTimer = setTimeout(() => {
    room.currentQuestionIndex++;
    if (room.currentQuestionIndex < room.questionIds.length) {
      startRound(room);
    } else {
      endGame(room);
    }
  }, 5000);

  roomRoundTimers.set(room.code, advanceTimer);
}

function endGame(room: GameRoom) {
  if (roomRoundTimers.has(room.code)) {
    clearTimeout(roomRoundTimers.get(room.code)!);
    roomRoundTimers.delete(room.code);
  }

  room.status = 'finished';
  room.currentQuestion = null;
  broadcastRoomUpdate(room);


  // Sort participants by score descending
  const participantsList = Object.values(room.participants).sort(
    (a, b) => b.currentScore - a.currentScore
  );

  const winner = participantsList[0];
  const matchId = 'm_' + Math.random().toString(36).substring(2, 10);

  const matchRecord: MatchHistoryItem = {
    id: matchId,
    matchId,
    mode: room.mode,
    date: Date.now(),
    players: participantsList.map((p, idx) => ({
      userId: p.userId,
      username: p.username,
      avatar: p.avatar,
      score: p.currentScore,
      rank: idx + 1,
      correctCount: p.totalCorrect,
    })),
    winnerId: winner?.userId || '',
    winnerName: winner?.username || 'Unknown',
    userScore: 0,
    userRank: 1,
    totalQuestions: room.questionIds.length,
  };

  db.matchHistory.push(matchRecord);

  // Update persistent user stats in database
  for (let i = 0; i < participantsList.length; i++) {
    const p = participantsList[i];
    const user = db.users[p.userId];
    if (user) {
      user.totalGames = (user.totalGames || 0) + 1;
      user.totalPoints = (user.totalPoints || 0) + p.currentScore;
      if (i === 0) {
        user.wins = (user.wins || 0) + 1;
      } else {
        user.losses = (user.losses || 0) + 1;
      }
      user.winRate = Math.round((user.wins / user.totalGames) * 100);
    }
  }

  saveDatabase(db);

  // Broadcast final results
  broadcastToRoom(room, {
    type: 'game_ended',
    rankings: participantsList.map((p, idx) => ({
      userId: p.userId,
      username: p.username,
      avatar: p.avatar,
      score: p.currentScore,
      correctCount: p.totalCorrect,
      rank: idx + 1,
    })),
    winnerId: winner?.userId,
    winnerName: winner?.username,
    matchId,
    totalQuestions: room.questionIds.length,
  });
}

// WebSocket connection lifecycle
wss.on('connection', (ws: WebSocket) => {
  let authenticatedUserId: string | null = null;
  let currentRoomCode: string | null = null;

  ws.on('message', (messageRaw: string) => {
    try {
      const msg = JSON.parse(messageRaw.toString());

      // Helper to find, recover, or auto-hydrate a valid user profile
      const resolveUser = (userId?: string, profile?: any): UserProfile | null => {
        if (!userId) return null;
        if (db.users[userId]) {
          // If user exists, sync any updated displayName / avatar from client session
          if (profile) {
            if (profile.displayName && (!db.users[userId].displayName || db.users[userId].displayName.startsWith('player_'))) {
              db.users[userId].displayName = profile.displayName.trim();
            }
            if (profile.username && (!db.users[userId].username || db.users[userId].username.startsWith('player_'))) {
              db.users[userId].username = profile.username.trim();
            }
            if (profile.avatar) {
              db.users[userId].avatar = profile.avatar;
            }
            saveDatabase(db);
          }
          return db.users[userId];
        }
        // Auto-hydrate from client profile if present
        if (profile && (profile.username || profile.displayName)) {
          const uName = (profile.username || profile.displayName || `player_${userId.slice(-4)}`).trim();
          const dName = (profile.displayName || profile.username || uName).trim();
          const newUser: UserProfile & { passwordHash: string } = {
            id: userId,
            username: uName,
            displayName: dName,
            avatar: profile.avatar || '⚽',
            totalGames: profile.totalGames || 0,
            wins: profile.wins || 0,
            losses: profile.losses || 0,
            totalPoints: profile.totalPoints || 0,
            winRate: profile.winRate || 0,
            isOnline: true,
            createdAt: profile.createdAt || Date.now(),
            passwordHash: 'session_restored',
          };
          db.users[userId] = newUser;
          db.friends[userId] = db.friends[userId] || [];
          saveDatabase(db);
          return newUser;
        }
        // If known user ID format, auto-restore
        if (userId.startsWith('usr_') || userId.startsWith('user_')) {
          const uName = `player_${userId.slice(-4)}`;
          const newUser: UserProfile & { passwordHash: string } = {
            id: userId,
            username: uName,
            displayName: uName,
            avatar: '⚽',
            totalGames: 0,
            wins: 0,
            losses: 0,
            totalPoints: 0,
            winRate: 0,
            isOnline: true,
            createdAt: Date.now(),
            passwordHash: 'session_restored',
          };
          db.users[userId] = newUser;
          db.friends[userId] = db.friends[userId] || [];
          saveDatabase(db);
          return newUser;
        }
        return null;
      };

      // 1. Authenticate WebSocket session
      if (msg.type === 'auth') {
        const user = resolveUser(msg.userId, msg.userProfile || msg.user);
        if (user) {
          authenticatedUserId = user.id;
          userSockets.set(user.id, ws);
          socketUsers.set(ws, user.id);

          ws.send(JSON.stringify({
            type: 'auth_success',
            user: sanitizeUser(user),
          }));

          // Notify friends that user is online
          const friendIds = db.friends[user.id] || [];
          for (const fid of friendIds) {
            const fWs = userSockets.get(fid);
            if (fWs && fWs.readyState === WebSocket.OPEN) {
              fWs.send(JSON.stringify({
                type: 'friend_status_change',
                userId: user.id,
                isOnline: true,
              }));
            }
          }
        } else {
          ws.send(JSON.stringify({
            type: 'auth_error',
            message: 'Session invalid or user not found. Please log in again.',
          }));
        }
        return;
      }

      // Self-healing: if not authenticated yet, try to authenticate using msg.userId or msg.token
      if (!authenticatedUserId && (msg.userId || msg.token)) {
        const candidateId = msg.userId || msg.token;
        const user = resolveUser(candidateId, msg.userProfile || msg.user);
        if (user) {
          authenticatedUserId = user.id;
          userSockets.set(user.id, ws);
          socketUsers.set(ws, user.id);
        }
      }

      if (!authenticatedUserId || !db.users[authenticatedUserId]) {
        ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated on socket' }));
        return;
      }

      const currentUser = db.users[authenticatedUserId];

      // 2. Create Room
      if (msg.type === 'create_room') {
        const settings = msg.settings || {};
        const code = generateRoomCode();
        const mode: GameModeType = settings.mode || 'two_clubs';
        const questionsCount = Math.min(Math.max(settings.questionsCount || 5, 2), 15);
        const timeLimit = Math.min(Math.max(settings.timeLimit || 20, 10), 60);

        const newRoom: GameRoom = {
          code,
          hostId: authenticatedUserId,
          name: `${currentUser.displayName}'s Room`,
          isPrivate: settings.isPrivate !== false,
          mode,
          difficulty: settings.difficulty || 'any',
          questionsCount,
          timeLimit,
          hintsEnabled: settings.hintsEnabled ?? true,
          status: 'lobby',
          participants: {
            [authenticatedUserId]: {
              userId: authenticatedUserId,
              username: currentUser.username,
              displayName: currentUser.displayName || currentUser.username,
              avatar: currentUser.avatar,
              isHost: true,
              isReady: true,
              isOnline: true,
              currentScore: 0,
              totalCorrect: 0,
              hasAnsweredCurrent: false,
            },
          },
          currentQuestionIndex: 0,
          questionIds: [],
          currentRoundStartTime: 0,
          currentRoundEndTime: 0,
          answers: {},
          createdAt: Date.now(),
        };

        activeRooms.set(code, newRoom);
        currentRoomCode = code;

        ws.send(JSON.stringify({ type: 'room_created', code }));
        broadcastRoomUpdate(newRoom);
        return;
      }

      // 3. Join Room
      if (msg.type === 'join_room') {
        const code = (msg.code || '').trim().toUpperCase();
        const room = activeRooms.get(code);

        if (!room) {
          ws.send(JSON.stringify({ type: 'error', message: 'Room not found. Check the code and try again.' }));
          return;
        }

        if (room.status !== 'lobby') {
          ws.send(JSON.stringify({ type: 'error', message: 'Match is already in progress in this room.' }));
          return;
        }

        currentRoomCode = code;
        room.participants[authenticatedUserId] = {
          userId: authenticatedUserId,
          username: currentUser.username,
          displayName: currentUser.displayName || currentUser.username,
          avatar: currentUser.avatar,
          isHost: room.hostId === authenticatedUserId,
          isReady: true,
          isOnline: true,
          currentScore: 0,
          totalCorrect: 0,
          hasAnsweredCurrent: false,
        };

        broadcastRoomUpdate(room);
        return;
      }

      // 4. Quick Match / Public Matchmaking
      if (msg.type === 'quick_match') {
        const desiredMode: GameModeType = msg.mode || 'two_clubs';

        // Find an open public lobby in that mode
        let matchedRoom: GameRoom | null = null;
        for (const r of activeRooms.values()) {
          if (!r.isPrivate && r.status === 'lobby' && r.mode === desiredMode && Object.keys(r.participants).length < 4) {
            matchedRoom = r;
            break;
          }
        }

        if (matchedRoom) {
          currentRoomCode = matchedRoom.code;
          matchedRoom.participants[authenticatedUserId] = {
            userId: authenticatedUserId,
            username: currentUser.username,
            displayName: currentUser.displayName || currentUser.username,
            avatar: currentUser.avatar,
            isHost: false,
            isReady: true,
            isOnline: true,
            currentScore: 0,
            totalCorrect: 0,
            hasAnsweredCurrent: false,
          };
          broadcastRoomUpdate(matchedRoom);
        } else {
          // Create public room
          const code = generateRoomCode();
          const newRoom: GameRoom = {
            code,
            hostId: authenticatedUserId,
            name: `Public ${desiredMode === 'two_clubs' ? 'Clubs' : 'Shirts'} Match`,
            isPrivate: false,
            mode: desiredMode,
            difficulty: 'any',
            questionsCount: 5,
            timeLimit: 20,
            hintsEnabled: true,
            status: 'lobby',
            participants: {
              [authenticatedUserId]: {
                userId: authenticatedUserId,
                username: currentUser.username,
                displayName: currentUser.displayName || currentUser.username,
                avatar: currentUser.avatar,
                isHost: true,
                isReady: true,
                isOnline: true,
                currentScore: 0,
                totalCorrect: 0,
                hasAnsweredCurrent: false,
              },
            },
            currentQuestionIndex: 0,
            questionIds: [],
            currentRoundStartTime: 0,
            currentRoundEndTime: 0,
            answers: {},
            createdAt: Date.now(),
          };

          activeRooms.set(code, newRoom);
          currentRoomCode = code;
          ws.send(JSON.stringify({ type: 'room_created', code }));
          broadcastRoomUpdate(newRoom);
        }
        return;
      }

      // 5. Invite Friend
      if (msg.type === 'invite_friend') {
        const { toUserId, roomCode } = msg;
        const targetWs = userSockets.get(toUserId);
        const room = activeRooms.get(roomCode);

        if (targetWs && targetWs.readyState === WebSocket.OPEN && room) {
          targetWs.send(JSON.stringify({
            type: 'friend_invited',
            fromUser: sanitizeUser(currentUser),
            roomCode,
            mode: room.mode,
          }));
          ws.send(JSON.stringify({ type: 'toast', message: `Invitation sent to ${db.users[toUserId]?.displayName || 'friend'}!` }));
        }
        return;
      }

      // 6. Leave Room
      if (msg.type === 'leave_room') {
        const code = msg.code || currentRoomCode;
        if (code && activeRooms.has(code)) {
          const room = activeRooms.get(code)!;
          delete room.participants[authenticatedUserId];

          // If host left, assign new host or delete room if empty
          const remainingIds = Object.keys(room.participants);
          if (remainingIds.length === 0) {
            activeRooms.delete(code);
            if (roomRoundTimers.has(code)) {
              clearTimeout(roomRoundTimers.get(code)!);
              roomRoundTimers.delete(code);
            }
          } else {
            if (room.hostId === authenticatedUserId) {
              room.hostId = remainingIds[0];
              room.participants[remainingIds[0]].isHost = true;
            }
            broadcastRoomUpdate(room);
          }
        }
        currentRoomCode = null;
        return;
      }

      // 7. Start Game
      if (msg.type === 'start_game') {
        const code = msg.code || currentRoomCode;
        if (!code || !activeRooms.has(code)) return;
        const room = activeRooms.get(code)!;

        if (room.hostId !== authenticatedUserId) {
          ws.send(JSON.stringify({ type: 'error', message: 'Only host can start the game.' }));
          return;
        }

        // Filter eligible questions from database
        let candidateQuestions = db.questions.filter((q) => q.isActive !== false && q.mode === room.mode);
        if (room.difficulty !== 'any') {
          const diffFiltered = candidateQuestions.filter((q) => q.difficulty === room.difficulty);
          if (diffFiltered.length >= 2) candidateQuestions = diffFiltered;
        }

        if (candidateQuestions.length === 0) {
          candidateQuestions = db.questions.filter((q) => q.mode === room.mode);
        }

        // Shuffle questions
        const shuffled = [...candidateQuestions].sort(() => Math.random() - 0.5);
        const selectedQuestions = shuffled.slice(0, Math.min(room.questionsCount, shuffled.length));

        room.questionIds = selectedQuestions.map((q) => q.id);
        room.currentQuestionIndex = 0;
        room.answers = {};

        for (const p of Object.values(room.participants)) {
          p.currentScore = 0;
          p.totalCorrect = 0;
          p.hasAnsweredCurrent = false;
        }

        startRound(room);
        return;
      }

      // 8. Submit Answer
      if (msg.type === 'submit_answer') {
        const code = msg.code || currentRoomCode;
        if (!code || !activeRooms.has(code)) return;
        const room = activeRooms.get(code)!;

        if (room.status !== 'in_round') return;

        const p = room.participants[authenticatedUserId];
        if (!p || p.hasAnsweredCurrent) return; // Prevent duplicate submissions

        const qId = room.questionIds[room.currentQuestionIndex];
        const question = db.questions.find((q) => q.id === qId);
        if (!question) return;

        const now = Date.now();
        const timeTakenSec = Math.max(0.5, Math.min(room.timeLimit, (now - room.currentRoundStartTime) / 1000));
        const remainingTimeSec = Math.max(0, room.timeLimit - timeTakenSec);

        const userAnswer = (msg.answer || '').trim();
        const hintUsed = Boolean(msg.hintUsed);

        const isCorrect = checkAnswerCorrectness(userAnswer, question);

        let scoreAwarded = 0;
        if (isCorrect) {
          if (room.mode === 'nationalities') {
            scoreAwarded = 100;
            const speedBonus = Math.round((remainingTimeSec / room.timeLimit) * 50);
            scoreAwarded += speedBonus;
          } else {
            // Base score 100
            scoreAwarded = 100;
            // Speed bonus: up to 50 points based on speed
            const speedBonus = Math.round((remainingTimeSec / room.timeLimit) * 50);
            scoreAwarded += speedBonus;

            // Hint deduction if used
            if (hintUsed) {
              scoreAwarded = Math.max(30, scoreAwarded - 25);
            }
          }

          p.totalCorrect++;
        }

        p.currentScore += scoreAwarded;
        p.hasAnsweredCurrent = true;

        if (!room.answers[room.currentQuestionIndex]) {
          room.answers[room.currentQuestionIndex] = {};
        }

        room.answers[room.currentQuestionIndex][authenticatedUserId] = {
          userId: authenticatedUserId,
          answer: userAnswer,
          isCorrect,
          scoreAwarded,
          answerTimeSec: parseFloat(timeTakenSec.toFixed(1)),
          hintUsed,
        };

        // Notify client who answered that their answer was received
        ws.send(JSON.stringify({
          type: 'answer_confirmed',
          isCorrect,
          scoreAwarded,
          newScore: p.currentScore,
        }));

        // Broadcast to other players that this player has answered (without revealing content yet)
        broadcastToRoom(room, {
          type: 'player_answered',
          userId: authenticatedUserId,
          hasAnsweredCount: Object.values(room.participants).filter((part) => part.hasAnsweredCurrent).length,
          totalParticipants: Object.keys(room.participants).length,
        });

        // Check if all active players in room have answered
        const allAnswered = Object.values(room.participants).every((part) => part.hasAnsweredCurrent);
        if (allAnswered) {
          finishRound(room);
        }
        return;
      }
    } catch (err) {
      console.error('WebSocket message handling error:', err);
    }
  });

  ws.on('close', () => {
    if (authenticatedUserId) {
      userSockets.delete(authenticatedUserId);
      socketUsers.delete(ws);

      // Notify friends of offline status
      const friendIds = db.friends[authenticatedUserId] || [];
      for (const fid of friendIds) {
        const fWs = userSockets.get(fid);
        if (fWs && fWs.readyState === WebSocket.OPEN) {
          fWs.send(JSON.stringify({
            type: 'friend_status_change',
            userId: authenticatedUserId,
            isOnline: false,
          }));
        }
      }

      // If user was in a room lobby, notify others
      if (currentRoomCode && activeRooms.has(currentRoomCode)) {
        const room = activeRooms.get(currentRoomCode)!;
        if (room.participants[authenticatedUserId]) {
          room.participants[authenticatedUserId].isOnline = false;
          if (room.status === 'lobby') {
            delete room.participants[authenticatedUserId];
            if (Object.keys(room.participants).length === 0) {
              activeRooms.delete(currentRoomCode);
            } else {
              if (room.hostId === authenticatedUserId) {
                room.hostId = Object.keys(room.participants)[0];
                room.participants[room.hostId].isHost = true;
              }
              broadcastRoomUpdate(room);
            }
          } else {
            broadcastRoomUpdate(room);
          }
        }
      }
    }
  });
});

// Mount Vite middleware in development
async function startApp() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`⚽ PitchTrivia Server running on http://0.0.0.0:${PORT}`);

    // Pre-cache & verify football club logos and player images automatically
    indexAndEnrichQuestions(db.questions)
      .then(() => {
        saveDatabase(db);
        console.log(`🖼️  Verified football club logos and player images cached successfully.`);
      })
      .catch((err) => console.error('Image indexing error on startup:', err));
  });
}

startApp().catch((err) => {
  console.error('Failed to start server:', err);
});
