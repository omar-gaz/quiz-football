import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { UserProfile, FriendRequest } from '../types/football.ts';
import { socketService } from '../services/socket.ts';
import { X, Check, UserX, Copy, UserPlus } from 'lucide-react';
import { playClickSound, playCorrectSound, playWhistleSound } from '../services/sound.ts';
import { useTranslation } from '../context/LanguageContext.tsx';
import { IconFootballPlayers, IconScoutSearch, IconFootball } from './Football3DIcons.tsx';
import { PlayerCharacterAvatar } from './PlayerCharacterAvatar.tsx';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in text-white">
      <div className="w-full max-w-lg bg-[#0F3460] border-4 border-black p-6 shadow-[8px_8px_0px_#000000] relative max-h-[92vh] flex flex-col">
        {/* Top brutalist bar */}
        <div className="h-2 bg-[#00B140] border-b-2 border-black -mx-6 -mt-6 mb-5" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b-3 border-black">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#16213E] border-3 border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center shrink-0">
              <IconFootballPlayers size={34} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {isRTL ? 'الأصدقاء والمنافسون' : 'Friends & Squad'}
              </h2>
              <p className="text-xs font-bold text-[#B0BEC5]">
                {isRTL ? 'إدارة الأصدقاء والدعوة السريعة للمباريات' : 'Manage your squad and challenge directly'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 bg-[#CC0000] text-white border-2 border-black hover:bg-black transition cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            <X className="w-4 h-4 font-black" />
          </button>
        </div>

        {/* ACTIVE ROOM FAST CODE HUB */}
        {activeRoomCode && (
          <div className="my-3 p-3 bg-[#16213E] border-3 border-black shadow-[4px_4px_0px_#000]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#00B140] animate-ping" />
                <span>{isRTL ? 'غرفتك النشطة:' : 'Active Room:'}</span>
                <span className="font-mono text-sm bg-[#0F3460] text-[#FFD700] px-2 py-0.5 border-2 border-black">#{activeRoomCode}</span>
              </span>
              <span className="text-[10px] font-black uppercase text-[#FFD700]">
                {isRTL ? 'كود سريع' : 'Quick Share'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className="w-full py-2 px-3 bg-[#00B140] hover:bg-[#008F32] border-2 border-black text-xs font-black uppercase text-white flex items-center justify-center gap-2 transition cursor-pointer shadow-[2px_2px_0px_#000]"
            >
              {linkCopied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span className="text-white">{isRTL ? 'تم نسخ الكود!' : 'Code Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'نسخ كود الغرفة' : 'Copy Room Code'}</span>
                  <span className="font-mono text-[#FFD700]">#{activeRoomCode}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-2 my-3">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setTab('list');
            }}
            className={`py-2 px-1 text-xs font-black uppercase border-3 border-black transition cursor-pointer ${
              tab === 'list'
                ? 'bg-[#00B140] shadow-[3px_3px_0px_#000] text-white translate-x-[1px] translate-y-[1px]'
                : 'bg-[#16213E] hover:bg-[#1A2647] text-[#B0BEC5]'
            }`}
          >
            {isRTL ? 'أصدقائي' : 'Friends'} ({friends.length})
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setTab('search');
            }}
            className={`py-2 px-1 text-xs font-black uppercase border-3 border-black transition cursor-pointer ${
              tab === 'search'
                ? 'bg-[#00B140] shadow-[3px_3px_0px_#000] text-white translate-x-[1px] translate-y-[1px]'
                : 'bg-[#16213E] hover:bg-[#1A2647] text-[#B0BEC5]'
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
            className={`py-2 px-1 text-xs font-black uppercase border-3 border-black transition cursor-pointer relative ${
              tab === 'requests'
                ? 'bg-[#00B140] shadow-[3px_3px_0px_#000] text-white translate-x-[1px] translate-y-[1px]'
                : 'bg-[#16213E] hover:bg-[#1A2647] text-[#B0BEC5]'
            }`}
          >
            <span>{isRTL ? 'الطلبات' : 'Requests'}</span>
            {incoming.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-[#CC0000] text-white border border-black text-[10px] font-black">
                {incoming.length}
              </span>
            )}
          </button>
        </div>

        {/* Alert / Notice Message */}
        {message && (
          <div className="mb-3 p-2.5 bg-[#16213E] border-3 border-black shadow-[3px_3px_0px_#000] text-xs font-black text-[#FFD700] flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage(null)} className="text-white font-black hover:opacity-70">
              ✕
            </button>
          </div>
        )}

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
          {tab === 'list' && (
            friends.length === 0 ? (
              <div className="py-10 text-center bg-[#16213E] border-3 border-dashed border-black p-4 text-white">
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <IconFootballPlayers size={40} />
                </div>
                <p className="text-sm font-black uppercase text-white">
                  {isRTL ? 'لا يوجد لديك أصدقاء بعد' : 'No friends in your list yet.'}
                </p>
                <p className="text-xs font-bold text-[#B0BEC5] mt-1">
                  {isRTL ? 'استخدم تبويب "إضافة لاعب" للبحث عن أصدقائك بالاسم!' : 'Search players or share your room code to start playing together!'}
                </p>
              </div>
            ) : (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  className="p-3 bg-[#16213E] border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between transition hover:translate-x-[1px] hover:translate-y-[1px] text-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 bg-[#0F3460] border-2 border-black flex items-center justify-center overflow-hidden shrink-0">
                      <PlayerCharacterAvatar avatarId={friend.avatar} className="w-full h-full" />
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-black z-10 ${
                          friend.isOnline ? 'bg-[#00B140]' : 'bg-neutral-600'
                        }`}
                        title={friend.isOnline ? 'Online' : 'Offline'}
                      />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white uppercase">
                        {friend.displayName || friend.username}
                      </div>
                      <div className="text-[10px] font-bold text-[#B0BEC5] flex items-center gap-1.5 mt-0.5">
                        <span>@{friend.username}</span>
                        <span>•</span>
                        <span className="font-mono text-[#FFD700] font-black">{friend.totalPoints || 0} PTS</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeRoomCode && (
                      <button
                        onClick={() => handleInviteToRoom(friend)}
                        className="py-1.5 px-3 bg-[#00B140] hover:bg-[#008F32] text-white border-2 border-black shadow-[2px_2px_0px_#000] text-[11px] font-black uppercase cursor-pointer flex items-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px]"
                      >
                        <IconFootball size={14} />
                        <span>{isRTL ? 'دعوة' : 'Invite'}</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveFriend(friend.id)}
                      className="p-1.5 bg-[#0F3460] hover:bg-[#CC0000] text-[#B0BEC5] hover:text-white border-2 border-black transition cursor-pointer shadow-[2px_2px_0px_#000]"
                      title={isRTL ? 'حذف من الأصدقاء' : 'Remove friend'}
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )
          )}

          {tab === 'search' && (
            <div className="space-y-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isRTL ? 'ابحث باسم المستخدم...' : 'Search by username...'}
                    className="w-full neo-input py-2.5 px-3 text-xs font-bold shadow-[3px_3px_0px_#000]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2.5 neo-btn-green text-xs font-black uppercase tracking-wider transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <IconScoutSearch size={18} />
                  <span>{loading ? '...' : isRTL ? 'بحث' : 'Search'}</span>
                </button>
              </form>

              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 bg-[#16213E] border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between text-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#0F3460] border-2 border-black flex items-center justify-center overflow-hidden shrink-0">
                        <PlayerCharacterAvatar avatarId={user.avatar} className="w-full h-full" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white uppercase">
                          {user.displayName || user.username}
                        </div>
                        <div className="text-[10px] font-bold text-[#B0BEC5]">@{user.username}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSendRequest(user.id)}
                      className="py-1.5 px-3 bg-[#00B140] hover:bg-[#008F32] border-2 border-black shadow-[2px_2px_0px_#000] text-white text-xs font-black uppercase flex items-center gap-1 transition cursor-pointer"
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
            <div className="space-y-2.5">
              {incoming.length === 0 ? (
                <div className="py-8 text-center bg-[#16213E] border-3 border-dashed border-black p-4 text-xs font-black uppercase text-[#B0BEC5]">
                  {isRTL ? 'لا توجد طلبات صداقة واردة معلقة' : 'No pending friend requests.'}
                </div>
              ) : (
                incoming.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-[#16213E] border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between text-white"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-[#0F3460] border-2 border-black flex items-center justify-center text-lg">
                        {req.fromAvatar}
                      </div>
                      <div>
                        <div className="text-xs font-black text-white uppercase">{req.fromUsername}</div>
                        <div className="text-[10px] font-bold text-[#B0BEC5]">
                          {isRTL ? 'أرسل لك طلب صداقة' : 'Sent you a friend request'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRespond(req.id, 'accept')}
                        className="p-2 bg-[#00B140] hover:bg-[#008F32] border-2 border-black shadow-[2px_2px_0px_#000] text-white cursor-pointer"
                        title={isRTL ? 'قبول' : 'Accept'}
                      >
                        <Check className="w-4 h-4 font-black" />
                      </button>
                      <button
                        onClick={() => handleRespond(req.id, 'decline')}
                        className="p-2 bg-[#CC0000] hover:bg-[#AA0000] border-2 border-black shadow-[2px_2px_0px_#000] text-white cursor-pointer"
                        title={isRTL ? 'رفض' : 'Decline'}
                      >
                        <X className="w-4 h-4 font-black" />
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
