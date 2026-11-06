import React, { useState, useEffect } from 'react';
import { UserProfile, GameRoom, GameModeType } from './types/football.ts';
import { api, getStoredUser, clearStoredSession } from './services/api.ts';
import { socketService } from './services/socket.ts';
import { Navbar } from './components/Navbar.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { GameLobby } from './components/GameLobby.tsx';
import { GameArena } from './components/GameArena.tsx';
import { FriendsModal } from './components/FriendsModal.tsx';
import { LeaderboardModal } from './components/LeaderboardModal.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';
import { AdminQuestionsModal } from './components/AdminQuestionsModal.tsx';
import { CreateRoomModal } from './components/CreateRoomModal.tsx';
import { JoinRoomModal } from './components/JoinRoomModal.tsx';
import { PlayerCharacterAvatar } from './components/PlayerCharacterAvatar.tsx';
import { playClickSound, playWhistleSound } from './services/sound.ts';
import { Check, X, Bell } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getStoredUser());
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);

  // Modals state
  const [showFriends, setShowFriends] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [createModeDefault, setCreateModeDefault] = useState<GameModeType>('two_clubs');

  // Interactive Match Invitation Notification
  const [matchInvite, setMatchInvite] = useState<{
    fromUser: UserProfile;
    roomCode: string;
    mode: GameModeType;
  } | null>(null);

  // Global Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Auto-join from URL parameter ?room=CODE or ?join=CODE
  const [pendingJoinCode, setPendingJoinCode] = useState<string | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('room') || params.get('join');
      return code ? code.trim().toUpperCase() : null;
    } catch {
      return null;
    }
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Check persistent session on mount
  useEffect(() => {
    api.getCurrentUser()
      .then((user) => {
        if (user) {
          setCurrentUser(user);
        } else {
          clearStoredSession();
          setCurrentUser(null);
        }
      })
      .catch(() => {
        clearStoredSession();
        setCurrentUser(null);
      });
  }, []);

  // When user is authenticated and there is a pending join code from a shared link, join immediately
  useEffect(() => {
    if (currentUser && pendingJoinCode) {
      showToast(`جاري الانضمام إلى الغرفة #${pendingJoinCode}...`);
      socketService.joinRoom(pendingJoinCode);
      setPendingJoinCode(null);
    }
  }, [currentUser, pendingJoinCode]);

  // Connect to WebSocket when currentUser is present
  useEffect(() => {
    if (!currentUser) return;

    socketService.connect(currentUser.id, currentUser);

    const unsubRoomState = socketService.on('room_state', (data: { room: GameRoom }) => {
      setCurrentRoom(data.room);
    });

    const unsubRoomCreated = socketService.on('room_created', (data: { code: string }) => {
      // Room state will be received immediately via room_state
    });

    const unsubInvite = socketService.on('friend_invited', (data: {
      fromUser: UserProfile;
      roomCode: string;
      mode: GameModeType;
    }) => {
      playWhistleSound();
      setMatchInvite(data);
    });

    const unsubToast = socketService.on('toast', (data: { message: string }) => {
      showToast(data.message);
    });

    const unsubError = socketService.on('error', (data: { message: string }) => {
      showToast('⚠️ ' + data.message);
    });

    const unsubAuthError = socketService.on('auth_error', () => {
      showToast('⚠️ تم تحديث الجلسة، يرجى تسجيل الدخول مجدداً');
      clearStoredSession();
      setCurrentUser(null);
    });

    return () => {
      unsubRoomState();
      unsubRoomCreated();
      unsubInvite();
      unsubToast();
      unsubError();
      unsubAuthError();
    };
  }, [currentUser]);

  const handleLogout = () => {
    playClickSound();
    clearStoredSession();
    socketService.disconnect();
    setCurrentUser(null);
    setCurrentRoom(null);
  };

  const handleQuickMatch = (mode: GameModeType) => {
    playClickSound();
    playWhistleSound();
    showToast('Searching for an opponent or creating live match...');
    socketService.quickMatch(mode);
  };

  const handleAcceptInvite = () => {
    if (!matchInvite) return;
    playClickSound();
    playWhistleSound();
    socketService.joinRoom(matchInvite.roomCode);
    setMatchInvite(null);
  };

  const handleLeaveRoom = () => {
    if (currentRoom) {
      socketService.leaveRoom(currentRoom.code);
    }
    setCurrentRoom(null);
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#00B140] selection:text-[#FFFFFF]">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#00B140] text-white border-[3.5px] border-black text-xs font-black uppercase shadow-[4px_4px_0px_#000000] flex items-center gap-2 animate-bounce">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Real-time Match Invitation Banner */}
      {matchInvite && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#0F3460] border-[4px] border-black p-4 shadow-[6px_6px_0px_#000000] animate-fade-in text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-[#16213E] border-[2.5px] border-black shadow-[2px_2px_0px_#000000] overflow-hidden flex items-center justify-center shrink-0">
                <PlayerCharacterAvatar avatarId={matchInvite.fromUser.avatar} className="w-full h-full" />
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase">
                  {matchInvite.fromUser.displayName} challenged you!
                </p>
                <p className="text-[10px] text-[#B0BEC5] font-bold mt-0.5">
                  Match: <span className="bg-[#00B140] px-1.5 py-0.2 border border-black text-white font-black uppercase">{matchInvite.mode === 'two_clubs' ? 'Two Clubs' : matchInvite.mode === 'nationalities' ? 'Nationalities' : 'Shirt History'}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setMatchInvite(null)}
              className="text-[#B0BEC5] font-black p-1 hover:bg-[#CC0000] hover:text-white border-2 border-transparent hover:border-black transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAcceptInvite}
              className="flex-1 py-2 neo-btn-green text-xs font-black uppercase cursor-pointer"
            >
              Accept Challenge
            </button>
            <button
              onClick={() => setMatchInvite(null)}
              className="px-3 py-2 neo-btn-secondary text-xs font-black uppercase cursor-pointer"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {/* Navbar - hidden on auth/login/signup screen */}
      {currentUser && (
        <Navbar
          user={currentUser}
          onOpenProfile={() => setShowProfile(true)}
          onOpenFriends={() => setShowFriends(true)}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onOpenAdmin={() => setShowAdmin(true)}
          onLogout={handleLogout}
          onNavigateHome={() => handleLeaveRoom()}
          onNavigateRooms={() => handleLeaveRoom()}
          activeView={currentRoom ? 'rooms' : 'home'}
          activeRoomCode={currentRoom?.status === 'lobby' ? currentRoom.code : null}
        />
      )}

      {/* Main Body */}
      <main className="flex-1">
        {!currentUser ? (
          <AuthModal onSuccess={(user) => setCurrentUser(user)} />
        ) : currentRoom ? (
          currentRoom.status === 'lobby' ? (
            <GameLobby
              room={currentRoom}
              currentUserId={currentUser.id}
              onOpenFriends={() => setShowFriends(true)}
              onLeaveRoom={handleLeaveRoom}
            />
          ) : (
            <GameArena
              room={currentRoom}
              currentUserId={currentUser.id}
              onExitGame={handleLeaveRoom}
            />
          )
        ) : (
          <DashboardView
            user={currentUser}
            onOpenCreateRoom={(mode) => {
              if (mode) setCreateModeDefault(mode);
              setShowCreateRoom(true);
            }}
            onOpenJoinRoom={() => setShowJoinRoom(true)}
            onQuickMatch={handleQuickMatch}
            onOpenFriends={() => setShowFriends(true)}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
            onOpenProfile={() => setShowProfile(true)}
            onJoinWithCode={(code) => {
              playClickSound();
              playWhistleSound();
              socketService.joinRoom(code);
            }}
          />
        )}
      </main>

      {/* Modals */}
      {currentUser && (
        <>
          <FriendsModal
            isOpen={showFriends}
            onClose={() => setShowFriends(false)}
            activeRoomCode={currentRoom?.status === 'lobby' ? currentRoom.code : null}
          />
          <LeaderboardModal
            isOpen={showLeaderboard}
            onClose={() => setShowLeaderboard(false)}
            currentUserId={currentUser.id}
          />
          <ProfileModal
            isOpen={showProfile}
            onClose={() => setShowProfile(false)}
            currentUser={currentUser}
            onUserUpdated={(updated) => setCurrentUser(updated)}
          />
          <AdminQuestionsModal
            isOpen={showAdmin}
            onClose={() => setShowAdmin(false)}
          />
          <CreateRoomModal
            isOpen={showCreateRoom}
            onClose={() => setShowCreateRoom(false)}
            defaultMode={createModeDefault}
          />
          <JoinRoomModal
            isOpen={showJoinRoom}
            onClose={() => setShowJoinRoom(false)}
          />
        </>
      )}

      {/* Footer - hidden on auth/login/signup screen */}
      {currentUser && (
        <footer className="border-t-[3.5px] border-black bg-[#16213E] py-4 px-4 text-center text-xs font-black uppercase text-white flex items-center justify-center gap-2 shadow-[0_-3px_0px_#000000]">
          <span>PITCHTRIVIA COMPETITIVE FOOTBALL ARENA</span>
          <span>•</span>
          <button
            onClick={() => {
              playClickSound();
              setShowAdmin(true);
            }}
            className="bg-[#FFD700] text-black px-2 py-0.5 border border-black hover:bg-[#00B140] hover:text-white cursor-pointer font-black"
          >
            VAR EDITOR
          </button>
        </footer>
      )}
    </div>
  );
}
