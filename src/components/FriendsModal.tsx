import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { UserProfile, FriendRequest } from '../types/football.ts';
import { socketService } from '../services/socket.ts';
import {
  X,
  Search,
  UserPlus,
  Check,
  UserX,
  Send,
  Trophy,
  Users,
  AlertCircle,
  Copy,
  Share2,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { playClickSound, playCorrectSound, playWhistleSound } from '../services/sound.ts';
import { useTranslation } from '../context/LanguageContext.tsx';

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
  const { isRTL } = useTranslation();
  const [tab, setTab] = useState<'list' | 'search' | 'requests'>('list');
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [incoming, setIncoming] = useState<FriendRequest[]>([]);
  const [outgoing, setOutgoing] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

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

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.searchUsers(searchQuery.trim());
      setSearchResults(res.users || []);
      if (res.users.length === 0) {
        setMessage(isRTL ? 'لم يتم العثور على لاعبين بهذا الاسم' : 'No players found matching that username.');
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
      setMessage(isRTL ? 'تم إرسال طلب الصداقة بنجاح!' : 'Friend request sent!');
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
    playWhistleSound();
    socketService.inviteFriend(friend.id, activeRoomCode);
    setMessage(
      isRTL
        ? `تم إرسال دعوة التحدي إلى ${friend.displayName || friend.username}!`
        : `Invitation sent to ${friend.displayName || friend.username}!`
    );
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCopyCode = () => {
    if (!activeRoomCode) return;
    playClickSound();
    navigator.clipboard.writeText(activeRoomCode);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col border border-[#29312B] overflow-hidden">
        {/* Stadium accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B7F34A] to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#29312B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#171D19] border border-[#29312B] text-[#B7F34A] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#F5F5F0] tracking-wide">
                {isRTL ? 'الأصدقاء والمنافسون' : 'Friends & Rivals'}
              </h2>
              <p className="text-xs text-[#A1AAA2]">
                {isRTL ? 'إدارة الأصدقاء والدعوة السريعة للمباريات' : 'Manage connections and invite to live rooms'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 text-[#A1AAA2] hover:text-white rounded-xl bg-[#171D19] border border-[#29312B] hover:border-white/20 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ACTIVE ROOM FAST CODE HUB */}
        {activeRoomCode && (
          <div className="my-3 p-3.5 rounded-2xl bg-[#171D19] border border-[#B7F34A]/40 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#F5F5F0] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#B7F34A] animate-ping" />
                <span>{isRTL ? 'الغرفة النشطة حالياً:' : 'Active Match Room:'}</span>
                <span className="font-mono font-black text-[#B7F34A]">#{activeRoomCode}</span>
              </span>
              <span className="text-[10px] text-[#A1AAA2]">
                {isRTL ? 'كود الدخول المباشر' : 'Direct Room Code'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className="w-full py-2.5 px-4 rounded-xl bg-[#080A09] border border-[#29312B] hover:border-[#B7F34A] text-xs font-bold text-[#F5F5F0] flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {linkCopied ? (
                <>
                  <Check className="w-4 h-4 text-[#B7F34A]" />
                  <span className="text-[#B7F34A] font-black">{isRTL ? 'تم نسخ كود الغرفة!' : 'Room Code Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#B7F34A]" />
                  <span>{isRTL ? 'نسخ كود الغرفة' : 'Copy Room Code'}</span>
                  <span className="font-mono font-black text-[#B7F34A] ml-1">#{activeRoomCode}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 p-1 bg-[#111512] rounded-2xl my-3 border border-[#29312B]">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setTab('list');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              tab === 'list'
                ? 'bg-[#171D19] text-[#B7F34A] shadow-md border border-[#B7F34A]/30'
                : 'text-[#A1AAA2] hover:text-[#F5F5F0]'
            }`}
          >
            {isRTL ? 'أصدقائي' : 'My Friends'} ({friends.length})
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setTab('search');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              tab === 'search'
                ? 'bg-[#171D19] text-[#B7F34A] shadow-md border border-[#B7F34A]/30'
                : 'text-[#A1AAA2] hover:text-[#F5F5F0]'
            }`}
          >
            {isRTL ? 'إضافة لاعب' : 'Add Player'}
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setTab('requests');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer relative ${
              tab === 'requests'
                ? 'bg-[#171D19] text-[#B7F34A] shadow-md border border-[#B7F34A]/30'
                : 'text-[#A1AAA2] hover:text-[#F5F5F0]'
            }`}
          >
            <span>{isRTL ? 'الطلبات' : 'Requests'}</span>
            {incoming.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-[#B7F34A] text-[#080A09] rounded-full text-[10px] font-black">
                {incoming.length}
              </span>
            )}
          </button>
        </div>

        {/* Alert / Notice Message */}
        {message && (
          <div className="mb-3 p-2.5 bg-[#171D19] border border-[#B7F34A]/40 rounded-xl text-xs text-[#B7F34A] flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage(null)} className="text-[#A1AAA2] hover:text-white text-xs">
              ✕
            </button>
          </div>
        )}

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {tab === 'list' && (
            friends.length === 0 ? (
              <div className="py-12 text-center text-[#A1AAA2]">
                <Users className="w-10 h-10 mx-auto opacity-30 mb-2" />
                <p className="text-xs font-semibold">
                  {isRTL ? 'لا يوجد لديك أصدقاء بعد' : 'No friends in your list yet.'}
                </p>
                <p className="text-[11px] text-[#A1AAA2]/70 mt-1">
                  {isRTL ? 'انتقل إلى تبويب "إضافة لاعب" للبحث عن أصدقائك بالاسم!' : 'Use "Add Player" tab or share your room link to invite friends!'}
                </p>
              </div>
            ) : (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  className="p-3 rounded-2xl bg-[#080A09] border border-[#29312B] hover:border-white/10 flex items-center justify-between transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl bg-[#171D19] border border-[#29312B] flex items-center justify-center text-xl">
                      {friend.avatar}
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#080A09] ${
                          friend.isOnline ? 'bg-[#B7F34A]' : 'bg-neutral-600'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#F5F5F0]">
                        {friend.displayName || friend.username}
                      </div>
                      <div className="text-[10px] text-[#A1AAA2] flex items-center gap-2">
                        <span>@{friend.username}</span>
                        <span>•</span>
                        <span className="text-[#D6BD83]">{friend.totalPoints || 0} pts</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeRoomCode && (
                      <button
                        onClick={() => handleInviteToRoom(friend)}
                        className="py-1.5 px-3 rounded-xl bg-[#B7F34A] text-[#080A09] text-[11px] font-black uppercase hover:bg-[#a6e038] transition cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <Send className="w-3 h-3" />
                        <span>{isRTL ? 'دعوة' : 'Invite'}</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveFriend(friend.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-950/30 transition cursor-pointer"
                      title={isRTL ? 'حذف من الأصدقاء' : 'Remove friend'}
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )
          )}

          {tab === 'search' && (
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className={`w-4 h-4 text-[#A1AAA2] absolute ${isRTL ? 'right-3' : 'left-3'} top-3`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isRTL ? 'ابحث باسم المستخدم...' : 'Search by username...'}
                    className={`w-full bg-[#080A09] border border-[#29312B] rounded-xl ${
                      isRTL ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
                    } py-2 text-xs text-[#F5F5F0] focus:outline-none focus:border-[#B7F34A]`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#B7F34A] text-[#080A09] rounded-xl text-xs font-bold hover:bg-[#a6e038] transition cursor-pointer disabled:opacity-50"
                >
                  {loading ? '...' : isRTL ? 'بحث' : 'Search'}
                </button>
              </form>

              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 rounded-2xl bg-[#080A09] border border-[#29312B] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#171D19] border border-[#29312B] flex items-center justify-center text-lg">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#F5F5F0]">
                          {user.displayName || user.username}
                        </div>
                        <div className="text-[10px] text-[#A1AAA2]">@{user.username}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSendRequest(user.id)}
                      className="py-1.5 px-3 rounded-xl bg-[#171D19] border border-[#29312B] hover:border-[#B7F34A] text-[#B7F34A] text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{isRTL ? 'إضافة' : 'Add'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'requests' && (
            <div className="space-y-3">
              {incoming.length === 0 ? (
                <div className="py-8 text-center text-[#A1AAA2] text-xs">
                  {isRTL ? 'لا توجد طلبات صداقة واردة معلقة' : 'No pending friend requests.'}
                </div>
              ) : (
                incoming.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-2xl bg-[#080A09] border border-[#29312B] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{req.fromAvatar}</span>
                      <div>
                        <div className="text-xs font-bold text-[#F5F5F0]">{req.fromUsername}</div>
                        <div className="text-[10px] text-[#A1AAA2]">
                          {isRTL ? 'أرسل لك طلب صداقة' : 'Sent you a friend request'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleRespond(req.id, 'accept')}
                        className="p-1.5 bg-[#B7F34A] text-[#080A09] rounded-xl text-xs font-bold hover:bg-[#a6e038] transition cursor-pointer"
                        title={isRTL ? 'قبول' : 'Accept'}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRespond(req.id, 'decline')}
                        className="p-1.5 bg-neutral-800 text-[#A1AAA2] hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
                        title={isRTL ? 'رفض' : 'Decline'}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
