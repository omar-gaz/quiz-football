import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

export interface Translations {
  brand: string;
  brandTagline: string;
  navHome: string;
  navRooms: string;
  navLeaderboard: string;
  navFriends: string;
  navSettings: string;
  navAdmin: string;
  navSignOut: string;
  navLogIn: string;
  navSignUp: string;
  heroKicker: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  heroCtaPlay: string;
  heroCtaQuick: string;
  heroCtaCreate: string;
  metricOnline: string;
  metricRooms: string;
  metricGames: string;
  popularCategories: string;
  viewAll: string;
  catClubs: string;
  catClubsDesc: string;
  catPlayers: string;
  catPlayersDesc: string;
  catCompetitions: string;
  catCompetitionsDesc: string;
  catHistory: string;
  catHistoryDesc: string;
  catGeneral: string;
  catGeneralDesc: string;
  quickJoinTitle: string;
  quickJoinDesc: string;
  quickJoinPlaceholder: string;
  quickJoinBtn: string;
  lobbyTitle: string;
  waitingPlayers: string;
  hostBadge: string;
  readyBadge: string;
  notReadyBadge: string;
  emptySlot: string;
  inviteFriend: string;
  copyCode: string;
  codeCopied: string;
  gameSettings: string;
  mode: string;
  rounds: string;
  timeLimit: string;
  startGame: string;
  waitingHost: string;
  backToHome: string;
  leaveRoom: string;
  questionOf: string;
  of: string;
  pts: string;
  lockAnswer: string;
  hintLabel: string;
  hintUsedText: string;
  typePlaceholder: string;
  suggestions: string;
  submitBtn: string;
  roundResult: string;
  correctTitle: string;
  incorrectTitle: string;
  earnedPts: string;
  matchChampion: string;
  matchFinished: string;
  winnerLabel: string;
  accuracy: string;
  finalStandings: string;
  playAgain: string;
  dashboardBtn: string;
  leaderboardTitle: string;
  leaderboardSubtitle: string;
  totalPointsTab: string;
  mostWinsTab: string;
  winRateTab: string;
  friendsTitle: string;
  friendsSubtitle: string;
  searchPlayers: string;
  pendingRequests: string;
  myFriends: string;
  noFriends: string;
  online: string;
  offline: string;
  profileTitle: string;
  profileSubtitle: string;
  editProfile: string;
  saveChanges: string;
  cancel: string;
  careerStats: string;
  matchesPlayed: string;
  recentMatches: string;
  adminTitle: string;
  adminSubtitle: string;
  addQuestion: string;
  resetDefaults: string;
  challengeReceived: string;
  acceptBtn: string;
  declineBtn: string;
  soundOn: string;
  soundOff: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brand: 'PITCHTRIVIA',
    brandTagline: 'Multiplayer Football Quiz',
    navHome: 'Home',
    navRooms: 'Rooms',
    navLeaderboard: 'Leaderboard',
    navFriends: 'Friends',
    navSettings: 'Settings',
    navAdmin: 'Studio',
    navSignOut: 'Sign Out',
    navLogIn: 'Log In',
    navSignUp: 'Sign Up',
    heroKicker: 'Multiplayer Football Knowledge',
    heroTitle1: 'Football Knowledge',
    heroTitle2: 'Brings People Together',
    heroSubtitle: 'Join the ultimate multiplayer football quiz and test your knowledge against players worldwide.',
    heroCtaPlay: 'PLAY NOW',
    heroCtaQuick: 'Quick Match',
    heroCtaCreate: 'Create Room',
    metricOnline: 'Players Online',
    metricRooms: 'Rooms Active',
    metricGames: 'Total Games',
    popularCategories: 'Popular Categories',
    viewAll: 'View all',
    catClubs: 'Clubs',
    catClubsDesc: 'Two Clubs: Guess the shared footballer',
    catPlayers: 'Players',
    catPlayersDesc: 'Shirt Numbers: Chronological career path',
    catCompetitions: 'Competitions',
    catCompetitionsDesc: 'Champions League, World Cup & Derbies',
    catHistory: 'History',
    catHistoryDesc: 'Golden eras, historic transfers & records',
    catGeneral: 'General',
    catGeneralDesc: 'Iconic moments, awards & tactical lore',
    quickJoinTitle: 'Quick Room Entry',
    quickJoinDesc: 'Enter friend code to join room',
    quickJoinPlaceholder: 'ENTER CODE',
    quickJoinBtn: 'JOIN',
    lobbyTitle: 'Room',
    waitingPlayers: 'Waiting for players...',
    hostBadge: 'Host',
    readyBadge: 'Ready',
    notReadyBadge: 'Not Ready',
    emptySlot: 'Empty',
    inviteFriend: 'Invite Friends',
    copyCode: 'Copy',
    codeCopied: 'Copied!',
    gameSettings: 'Game Settings',
    mode: 'Mode',
    rounds: 'Rounds',
    timeLimit: 'Timer',
    startGame: 'START GAME',
    waitingHost: 'Waiting for host to kick off...',
    backToHome: 'Back',
    leaveRoom: 'Leave Lobby',
    questionOf: 'Question',
    of: 'of',
    pts: 'PTS',
    lockAnswer: 'Answer locked in! Waiting for round completion...',
    hintLabel: 'Scout Hint (-25 pts)',
    hintUsedText: 'Hint active',
    typePlaceholder: 'Type player name (e.g. Cristiano Ronaldo, Messi, Beckham)...',
    suggestions: 'Suggestions',
    submitBtn: 'SUBMIT',
    roundResult: 'Round Result',
    correctTitle: 'Goal! Correct Answer!',
    incorrectTitle: 'Off Target! Incorrect',
    earnedPts: 'points earned',
    matchChampion: 'Match Champion!',
    matchFinished: 'Match Complete',
    winnerLabel: 'Match Winner',
    accuracy: 'Accuracy',
    finalStandings: 'Final Match Standings',
    playAgain: 'Play Again',
    dashboardBtn: 'Back to Home',
    leaderboardTitle: 'Global Hall of Fame',
    leaderboardSubtitle: 'Top football trivia masterminds',
    totalPointsTab: 'Total Points',
    mostWinsTab: 'Most Wins',
    winRateTab: 'Win Rate %',
    friendsTitle: 'Friends & Rivals',
    friendsSubtitle: 'Connect and challenge online rivals',
    searchPlayers: 'Search players by username...',
    pendingRequests: 'Friend Requests',
    myFriends: 'Friends List',
    noFriends: 'No friends added yet. Search players to invite them!',
    online: 'ONLINE',
    offline: 'OFFLINE',
    profileTitle: 'Player Profile',
    profileSubtitle: 'Career achievements and match logs',
    editProfile: 'Edit Profile',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    careerStats: 'Career Statistics',
    matchesPlayed: 'Matches Played',
    recentMatches: 'Recent Matches',
    adminTitle: 'Question Studio',
    adminSubtitle: 'Manage verified football challenges',
    addQuestion: 'Add Question',
    resetDefaults: 'Reset Defaults',
    challengeReceived: 'challenged you to a match!',
    acceptBtn: 'Accept',
    declineBtn: 'Decline',
    soundOn: 'Audio Enabled',
    soundOff: 'Audio Muted',
  },
  ar: {
    brand: 'بيتش تريفيا',
    brandTagline: 'مسابقة كرة القدم التنافسية',
    navHome: 'الرئيسية',
    navRooms: 'الغرف',
    navLeaderboard: 'المتصدرين',
    navFriends: 'الأصدقاء',
    navSettings: 'الإعدادات',
    navAdmin: 'إدارة الأسئلة',
    navSignOut: 'تسجيل خروج',
    navLogIn: 'تسجيل دخول',
    navSignUp: 'حساب جديد',
    heroKicker: 'تحديات كروية مباشرة متعددة اللاعبين',
    heroTitle1: 'شغف كرة القدم',
    heroTitle2: 'يجمعنا في الملعب',
    heroSubtitle: 'انضم إلى أقوى مسابقة كرة قدم جماعية وتحدى أصدقاءك وعشاق الساحرة المستديرة حول العالم في مباريات حية.',
    heroCtaPlay: 'العب الآن',
    heroCtaQuick: 'مباراة سريعة',
    heroCtaCreate: 'إنشاء غرفة',
    metricOnline: 'لاعب متصل',
    metricRooms: 'غرفة نشطة',
    metricGames: 'مباراة ملعوبة',
    popularCategories: 'التصنيفات الشائعة',
    viewAll: 'عرض الكل',
    catClubs: 'الأندية',
    catClubsDesc: 'ناديان: خمن اللاعب الذي مثل الفريقين',
    catPlayers: 'اللاعبون',
    catPlayersDesc: 'أرقام القمصان: تسلسل مسيرة الأندية',
    catCompetitions: 'البطولات',
    catCompetitionsDesc: 'دوري الأبطال وكأس العالم والديربيات',
    catHistory: 'التاريخ',
    catHistoryDesc: 'العصور الذهبية والانتقالات التاريخية',
    catGeneral: 'عام',
    catGeneralDesc: 'أرقام قياسية، مدربون، ولحظات خالدة',
    quickJoinTitle: 'دخول سريع بكود الغرفة',
    quickJoinDesc: 'أدخل كود صديقك للانضمام فوراً',
    quickJoinPlaceholder: 'أدخل الكود',
    quickJoinBtn: 'انضمام',
    lobbyTitle: 'غرفة',
    waitingPlayers: 'في انتظار انضمام اللاعبين...',
    hostBadge: 'المضيف',
    readyBadge: 'جاهز',
    notReadyBadge: 'غير جاهز',
    emptySlot: 'فارغ',
    inviteFriend: 'دعوة صديق',
    copyCode: 'نسخ',
    codeCopied: 'تم النسخ!',
    gameSettings: 'إعدادات المواجهة',
    mode: 'النمط',
    rounds: 'الجولات',
    timeLimit: 'الوقت',
    startGame: 'بدء المباراة',
    waitingHost: 'في انتظار انطلاق صافرة المضيف...',
    backToHome: 'رجوع',
    leaveRoom: 'مغادرة الغرفة',
    questionOf: 'السؤال',
    of: 'من',
    pts: 'نقطة',
    lockAnswer: 'تم تثبيت إجابتك! في انتظار انتهاء الجولة...',
    hintLabel: 'تلميح كشاف (-25 نقطة)',
    hintUsedText: 'التلميح مفعل',
    typePlaceholder: 'اكتب اسم اللاعب بالعربية أو الإنجليزية (مثلاً: كريستيانو رونالدو، ميسي)...',
    suggestions: 'اقتراحات',
    submitBtn: 'إرسال',
    roundResult: 'نتيجة الجولة',
    correctTitle: 'هدف! إجابة صحيحة!',
    incorrectTitle: 'خارج المرمى! إجابة غير صحيحة',
    earnedPts: 'نقاط مكتسبة',
    matchChampion: 'بطل المواجهة!',
    matchFinished: 'انتهت المباراة',
    winnerLabel: 'الفائز بالمباراة',
    accuracy: 'دقة الإجابات',
    finalStandings: 'الترتيب النهائي للمباراة',
    playAgain: 'إعادة المباراة',
    dashboardBtn: 'العودة للرئيسية',
    leaderboardTitle: 'لوحة شرف الأساطير',
    leaderboardSubtitle: 'أعظم خبراء وعشاق كرة القدم',
    totalPointsTab: 'إجمالي النقاط',
    mostWinsTab: 'الأكثر انتصاراً',
    winRateTab: 'نسبة الفوز %',
    friendsTitle: 'الأصدقاء والمنافسون',
    friendsSubtitle: 'تواصل وتحدى أصدقاءك في مباريات خاصة',
    searchPlayers: 'ابحث عن اللاعبين باسم المستخدم...',
    pendingRequests: 'طلبات الصداقة',
    myFriends: 'قائمة الأصدقاء',
    noFriends: 'لا يوجد أصدقاء بعد. ابحث عن لاعبين لإضافتهم!',
    online: 'متصل',
    offline: 'غير متصل',
    profileTitle: 'الملف الشخصي',
    profileSubtitle: 'سجل المسيرة وإحصائيات المباريات',
    editProfile: 'تعديل الملف',
    saveChanges: 'حفظ التعديلات',
    cancel: 'إلغاء',
    careerStats: 'إحصائيات المسيرة',
    matchesPlayed: 'المباريات الملعوبة',
    recentMatches: 'المباريات الأخيرة',
    adminTitle: 'استوديو الأسئلة',
    adminSubtitle: 'إدارة الأسئلة والتحديات الموثقة',
    addQuestion: 'إضافة سؤال',
    resetDefaults: 'استعادة الأسئلة الافتراضية',
    challengeReceived: 'وجه لك تحدياً لمباراة!',
    acceptBtn: 'قبول التحدي',
    declineBtn: 'رفض',
    soundOn: 'الصوت مفعّل',
    soundOff: 'الصوت مكتوم',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
  isRTL: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('pitch_trivia_lang');
      return saved === 'ar' ? 'ar' : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('pitch_trivia_lang', lang);
    } catch {
      // ignore
    }
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        isRTL,
      }}
    >
      <div dir={isRTL ? 'rtl' : 'ltr'}>{children}</div>
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
