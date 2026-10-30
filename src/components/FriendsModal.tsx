import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { UserProfile, FriendRequest } from '../types/football.ts';
import { socketService } from '../services/socket.ts';
import { X, Search, UserPlus, Check, UserX, Send, Trophy, Users, AlertCircle } from 'lucide-react';
import { playClickSound, playCorrectSound } from '../services/sound.ts';

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRoomCode?: string | null;
}

export const FriendsModal: React.FC<FriendsModalProps> = ({
  isOpen,
  onClose,
  activeRoomCode,
}) => {
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [incoming, setIncoming] = useState<FriendRequest[]>([]);
  const [outgoing, setOutgoing] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadFriendsData = async () => {
    try {
      const data = await api.getFriends();
      setFriends(data.friends || []);
      setIncoming(data.incoming || []);
      setOutgoing(data.outgoing || []);
    } catch (err) {
      console.error('Error fetching friends:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadFriendsData();
    }
  }, [isOpen]);

  // Listen to live friend status changes and incoming friend requests
  useEffect(() => {
    const unsubStatus = socketService.on('friend_status_change', (data: { userId: string; isOnline: boolean }) => {
      setFriends((prev) =>
        prev.map((f) => (f.id === data.userId ? { ...f, isOnline: data.isOnline } : f))
      );
    });

    const unsubReq = socketService.on('new_friend_request', () => {
      loadFriendsData();
    });

    const unsubAccepted = socketService.on('friend_request_accepted', () => {
      loadFriendsData();
    });

    return () => {
      unsubStatus();
      unsubReq();
      unsubAccepted();
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.searchUsers(searchQuery.trim());
      setSearchResults(res.users || []);
      if (res.users.length === 0) {
        setMessage('No players found matching that username.');
      }
    } catch (err: any) {
      setMessage(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (targetUserId: string) => {
    playClickSound();
    try {
      await api.sendFriendRequest(targetUserId);
      setMessage('Friend request sent!');
      loadFriendsData();
      setSearchResults((prev) => prev.filter((u) => u.id !== targetUserId));
    } catch (err: any) {
      setMessage(err.message || 'Could not send request');
    }
  };

  const handleRespond = async (requestId: string, action: 'accept' | 'decline') => {
    playClickSound();
    try {
      await api.respondFriendRequest(requestId, action);
      if (action === 'accept') playCorrectSound();
      loadFriendsData();
    } catch (err: any) {
      console.error('Respond error:', err);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    playClickSound();
    try {
      await api.removeFriend(friendId);
      loadFriendsData();
    } catch (err: any) {
      console.error('Remove friend error:', err);
    }
  };

  const handleInviteToRoom = (friend: UserProfile) => {
    if (!activeRoomCode) return;
    playClickSound();
    socketService.inviteFriend(friend.id, activeRoomCode);
    setMessage(`Invitation sent to ${friend.displayName}!`);
    setTimeout(() => setMessage(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#151B23] border border-white/10 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#39E75F]/20 text-[#39E75F] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wide">
                Friends & Rivals
              </h2>
              <p className="text-xs text-[#9AA4B2]">Connect, challenge, and play together</p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 text-[#9AA4B2] hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Banner */}
        {message && (
          <div className="mt-3 p-2.5 rounded-xl bg-[#39E75F]/15 border border-[#39E75F]/30 text-[#39E75F] text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        <div className="overflow-y-auto flex-1 mt-4 space-y-6 pr-1 custom-scrollbar">
          {/* Search Section */}
          <div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#9AA4B2] absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find players by username..."
                  className="w-full bg-[#0B0F14] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#39E75F] transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#39E75F] text-[#0B0F14] font-bold text-xs uppercase rounded-xl hover:bg-[#2ed252] transition cursor-pointer disabled:opacity-50"
              >
                Search
              </button>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-3 space-y-2 bg-[#0B0F14]/70 p-3 rounded-2xl border border-white/5">
                <p className="text-[11px] font-bold text-[#9AA4B2] uppercase tracking-wider">Search Results</p>
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#151B23] border border-white/10"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{user.avatar}</span>
                      <div>
                        <p className="text-xs font-bold text-white">{user.displayName}</p>
                        <p className="text-[10px] text-[#9AA4B2]">@{user.username} • {user.totalPoints} pts</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSendRequest(user.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#39E75F]/20 text-[#39E75F] hover:bg-[#39E75F] hover:text-[#0B0F14] text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Incoming Requests */}
          {incoming.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Friend Requests ({incoming.length})
                </span>
              </div>
              {incoming.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-950/20 border border-amber-500/30"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{req.fromAvatar}</span>
                    <div>
                      <p className="text-xs font-bold text-white">@{req.fromUsername}</p>
                      <p className="text-[10px] text-[#9AA4B2]">Sent you a friend request</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleRespond(req.id, 'accept')}
                      className="p-1.5 rounded-lg bg-[#39E75F] text-[#0B0F14] hover:bg-[#2ed252] transition cursor-pointer"
                      title="Accept"
                    >
                      <Check className="w-4 h-4 font-bold" />
                    </button>
                    <button
                      onClick={() => handleRespond(req.id, 'decline')}
                      className="p-1.5 rounded-lg bg-red-950/50 text-red-400 hover:bg-red-900/50 transition cursor-pointer"
                      title="Decline"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Friends List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#9AA4B2] uppercase tracking-wider">
                My Friends ({friends.length})
              </span>
            </div>

            {friends.length === 0 ? (
              <div className="text-center py-8 bg-[#0B0F14]/40 rounded-2xl border border-dashed border-white/10">
                <Users className="w-8 h-8 text-[#9AA4B2]/50 mx-auto mb-2" />
                <p className="text-xs text-[#9AA4B2]">No friends added yet.</p>
                <p className="text-[10px] text-[#9AA4B2]/70 mt-1">Search for players above to invite them!</p>
              </div>
            ) : (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#0B0F14] border border-white/5 hover:border-white/15 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-[#151B23] flex items-center justify-center text-xl">
                        {friend.avatar}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0B0F14] ${
                          friend.isOnline ? 'bg-[#39E75F]' : 'bg-neutral-600'
                        }`}
                        title={friend.isOnline ? 'Online' : 'Offline'}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white">{friend.displayName}</p>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                          friend.isOnline ? 'bg-[#39E75F]/20 text-[#39E75F]' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {friend.isOnline ? 'ONLINE' : 'OFFLINE'}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#9AA4B2]">
                        @{friend.username} • {friend.totalPoints.toLocaleString()} pts • {friend.winRate}% win rate
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Invite to active match button */}
                    {activeRoomCode && (
                      <button
                        onClick={() => handleInviteToRoom(friend)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#39E75F]/20 hover:bg-[#39E75F] text-[#39E75F] hover:text-[#0B0F14] text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Invite to your game room"
                      >
                        <Send className="w-3 h-3" />
                        <span className="hidden sm:inline">Invite</span>
                      </button>
                    )}

                    {/* Remove friend */}
                    <button
                      onClick={() => handleRemoveFriend(friend.id)}
                      className="p-1.5 rounded-lg text-[#9AA4B2] hover:text-red-400 hover:bg-white/5 transition cursor-pointer opacity-40 group-hover:opacity-100"
                      title="Remove Friend"
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
