// Football aesthetics: Club visual styling, crest initials, and player avatars

export const AVATAR_PRESETS = [
  { emoji: '⚡', label: 'Speed Winger' },
  { emoji: '👑', label: 'Playmaker' },
  { emoji: '⚽', label: 'Finisher' },
  { emoji: '🧤', label: 'Wall Goalkeeper' },
  { emoji: '🛡️', label: 'Center Back' },
  { emoji: '🎯', label: 'Free-kick Maestro' },
  { emoji: '🦁', label: 'Lion Captain' },
  { emoji: '🔥', label: 'Golden Boot' },
  { emoji: '🏆', label: 'Champion' },
  { emoji: '💎', label: 'Wonderkid' },
];

export const CLUB_THEMES: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  'Real Madrid': { bg: 'bg-white/10', text: 'text-amber-300', border: 'border-amber-400/40', accent: '#FEBE10' },
  'Juventus': { bg: 'bg-neutral-800', text: 'text-white', border: 'border-white/30', accent: '#FFFFFF' },
  'Arsenal': { bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-500/40', accent: '#EF0107' },
  'Chelsea': { bg: 'bg-blue-950/60', text: 'text-blue-400', border: 'border-blue-500/40', accent: '#034694' },
  'Barcelona': { bg: 'bg-blue-950/70', text: 'text-red-400', border: 'border-red-600/40', accent: '#A50044' },
  'Manchester City': { bg: 'bg-sky-950/60', text: 'text-sky-300', border: 'border-sky-400/40', accent: '#6CABDD' },
  'Manchester United': { bg: 'bg-red-950/70', text: 'text-red-400', border: 'border-red-500/40', accent: '#DA291C' },
  'Paris Saint-Germain': { bg: 'bg-indigo-950/60', text: 'text-red-400', border: 'border-blue-400/40', accent: '#004170' },
  'Bayern Munich': { bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-500/40', accent: '#DC052D' },
  'Liverpool': { bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-600/40', accent: '#C8102E' },
  'Borussia Dortmund': { bg: 'bg-yellow-950/60', text: 'text-yellow-400', border: 'border-yellow-400/40', accent: '#FDE100' },
  'AC Milan': { bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-500/40', accent: '#FB090B' },
  'Inter Milan': { bg: 'bg-blue-950/60', text: 'text-blue-400', border: 'border-blue-500/40', accent: '#0066B2' },
  'Sporting CP': { bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-500/40', accent: '#008057' },
  'LA Galaxy': { bg: 'bg-navy-950/60', text: 'text-amber-400', border: 'border-blue-400/40', accent: '#00245D' },
  'Inter Miami': { bg: 'bg-pink-950/60', text: 'text-pink-400', border: 'border-pink-500/40', accent: '#F7B5CD' },
  'Al Nassr': { bg: 'bg-amber-950/60', text: 'text-amber-300', border: 'border-amber-400/40', accent: '#FFD700' },
  'Al Hilal': { bg: 'bg-blue-950/60', text: 'text-blue-300', border: 'border-blue-400/40', accent: '#002B49' },
  'Monaco': { bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-500/40', accent: '#E30613' },
  'Santos': { bg: 'bg-neutral-800', text: 'text-white', border: 'border-white/30', accent: '#000000' },
};

export function getClubTheme(clubName: string) {
  return CLUB_THEMES[clubName] || {
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    accent: '#39E75F',
  };
}
