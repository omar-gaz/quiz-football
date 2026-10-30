import { UserProfile } from '../types/football.ts';
import { getStoredUser } from './api.ts';

type EventCallback = (data: any) => void;

class SocketService {
  private ws: WebSocket | null = null;
  private userId: string | null = null;
  private userProfile: UserProfile | null = null;
  private isAuthenticated = false;
  private messageQueue: any[] = [];
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private reconnectTimer: any = null;
  private isExplicitDisconnect = false;

  public connect(userId: string, profile?: UserProfile | null) {
    this.userId = userId;
    this.userProfile = profile || getStoredUser();
    this.isExplicitDisconnect = false;

    // If socket is already open, immediately authenticate
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.sendAuth();
      return;
    }

    // If already in the process of connecting, let onopen trigger sendAuth
    if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const url = `${protocol}//${host}/ws`;

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.sendAuth();
        this.emit('connection_change', { isConnected: true });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'auth_success') {
            this.isAuthenticated = true;
            this.flushQueue();
          } else if (data.type === 'auth_error') {
            this.isAuthenticated = false;
          }

          if (data.type) {
            this.emit(data.type, data);
            this.emit('*', data);
          }
        } catch (err) {
          console.error('Failed to parse WS message:', err);
        }
      };

      this.ws.onclose = () => {
        this.isAuthenticated = false;
        this.emit('connection_change', { isConnected: false });
        if (!this.isExplicitDisconnect) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = setTimeout(() => {
            if (this.userId && !this.isExplicitDisconnect) {
              this.connect(this.userId, this.userProfile);
            }
          }, 1500);
        }
      };

      this.ws.onerror = (err) => {
        console.warn('WebSocket error:', err);
      };
    } catch (err) {
      console.error('WebSocket connection failed:', err);
    }
  }

  private sendAuth() {
    if (!this.userId) return;
    const authPayload = {
      type: 'auth',
      userId: this.userId,
      userProfile: this.userProfile || getStoredUser(),
    };
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(authPayload));
    }
  }

  private flushQueue() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    while (this.messageQueue.length > 0) {
      const payload = this.messageQueue.shift();
      try {
        this.ws.send(JSON.stringify(payload));
      } catch (err) {
        console.error('Failed to send queued message:', err);
      }
    }
  }

  public disconnect() {
    this.isExplicitDisconnect = true;
    this.isAuthenticated = false;
    this.messageQueue = [];
    clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.userId = null;
    this.userProfile = null;
  }

  public on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emit(event: string, data: any) {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in socket listener for ${event}:`, err);
        }
      });
    }
  }

  public send(payload: any) {
    // Automatically attach userId and user profile if missing
    if (this.userId && !payload.userId) {
      payload.userId = this.userId;
    }
    if (this.userProfile && !payload.userProfile) {
      payload.userProfile = this.userProfile;
    }

    if (payload.type === 'auth') {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(payload));
      }
      return;
    }

    // If socket is open and authenticated, send immediately
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.isAuthenticated) {
      this.ws.send(JSON.stringify(payload));
      return;
    }

    // Otherwise queue and ensure connection is alive
    this.messageQueue.push(payload);
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED || this.ws.readyState === WebSocket.CLOSING) {
      if (this.userId) {
        this.connect(this.userId, this.userProfile);
      }
    }
  }

  // Action helpers
  public createRoom(settings: {
    mode: string;
    questionsCount?: number;
    timeLimit?: number;
    difficulty?: string;
    hintsEnabled?: boolean;
    isPrivate?: boolean;
  }) {
    this.send({ type: 'create_room', settings });
  }

  public joinRoom(code: string) {
    this.send({ type: 'join_room', code });
  }

  public quickMatch(mode: string) {
    this.send({ type: 'quick_match', mode });
  }

  public leaveRoom(code?: string) {
    this.send({ type: 'leave_room', code });
  }

  public startGame(code: string) {
    this.send({ type: 'start_game', code });
  }

  public submitAnswer(code: string, answer: string, hintUsed = false) {
    this.send({ type: 'submit_answer', code, answer, hintUsed });
  }

  public inviteFriend(toUserId: string, roomCode: string) {
    this.send({ type: 'invite_friend', toUserId, roomCode });
  }
}

export const socketService = new SocketService();
