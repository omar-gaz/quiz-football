import { UserProfile, FriendRequest, QuestionData, MatchHistoryItem } from '../types/football.ts';

const TOKEN_KEY = 'pitch_trivia_auth_token';
const USER_KEY = 'pitch_trivia_cached_user';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredSession(token: string, user: UserProfile) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function clearStoredSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // ignore
  }
}

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errMessage = 'Request failed';
    try {
      const errData = await res.json();
      if (errData.error) errMessage = errData.error;
    } catch {
      errMessage = res.statusText || `Error ${res.status}`;
    }
    throw new Error(errMessage);
  }

  return res.json();
}

export const api = {
  // Auth
  async register(params: { username: string; displayName?: string; avatar?: string; password: string }) {
    const data = await request<{ user: UserProfile; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    setStoredSession(data.token, data.user);
    return data;
  },

  async login(params: { username: string; password?: string }) {
    const data = await request<{ user: UserProfile; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    setStoredSession(data.token, data.user);
    return data;
  },

  async getCurrentUser() {
    const data = await request<{ user: UserProfile }>('/api/auth/me');
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    return data.user;
  },

  async updateProfile(params: { displayName?: string; avatar?: string }) {
    const data = await request<{ user: UserProfile }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(params),
    });
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    return data.user;
  },

  // Users & Friends
  async searchUsers(query: string) {
    return request<{ users: UserProfile[] }>(`/api/users/search?q=${encodeURIComponent(query)}`);
  },

  async getFriends() {
    return request<{
      friends: UserProfile[];
      incoming: FriendRequest[];
      outgoing: FriendRequest[];
    }>('/api/friends');
  },

  async sendFriendRequest(targetUserId: string) {
    return request<{ success: boolean; request?: FriendRequest }>('/api/friends/request', {
      method: 'POST',
      body: JSON.stringify({ targetUserId }),
    });
  },

  async respondFriendRequest(requestId: string, action: 'accept' | 'decline') {
    return request<{ success: boolean }>('/api/friends/respond', {
      method: 'POST',
      body: JSON.stringify({ requestId, action }),
    });
  },

  async removeFriend(friendId: string) {
    return request<{ success: boolean }>('/api/friends/remove', {
      method: 'POST',
      body: JSON.stringify({ friendId }),
    });
  },

  // Leaderboard
  async getLeaderboard(sortBy: 'points' | 'wins' | 'winRate' = 'points') {
    return request<{ leaderboard: (UserProfile & { rank: number })[] }>(
      `/api/leaderboard?sortBy=${sortBy}`
    );
  },

  // Stats
  async getUserStats(userId: string) {
    return request<{ user: UserProfile; history: MatchHistoryItem[] }>(`/api/users/${userId}/stats`);
  },

  // Admin Questions
  async getAdminQuestions() {
    return request<{ questions: QuestionData[] }>('/api/admin/questions');
  },

  async createQuestion(question: Partial<QuestionData>) {
    return request<{ question: QuestionData }>('/api/admin/questions', {
      method: 'POST',
      body: JSON.stringify(question),
    });
  },

  async updateQuestion(id: string, updates: Partial<QuestionData>) {
    return request<{ question: QuestionData }>(`/api/admin/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteQuestion(id: string) {
    return request<{ success: boolean }>(`/api/admin/questions/${id}`, {
      method: 'DELETE',
    });
  },

  async seedDefaultQuestions() {
    return request<{ success: boolean; count: number }>('/api/admin/seed-default', {
      method: 'POST',
    });
  },

  // Football Images Automatic System
  async getClubLogo(clubName: string) {
    return request<{ club: string; logoUrl: string | null }>(
      `/api/images/club?name=${encodeURIComponent(clubName)}`
    );
  },

  async getPlayerPhoto(playerName: string) {
    return request<{ player: string; photoUrl: string | null }>(
      `/api/images/player?name=${encodeURIComponent(playerName)}`
    );
  },

  async getAllCachedImages() {
    return request<{ clubs: Record<string, any>; players: Record<string, any> }>('/api/images/all');
  },

  async indexAllImages() {
    return request<{ success: boolean; count: number; cached: any }>('/api/images/index-all', {
      method: 'POST',
    });
  },
};
