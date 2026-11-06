// Football aesthetics: Club visual styling, crests, player portraits, and country flags

export interface AvatarPreset {
  id: string;
  emoji: string;
  label: string;
  position: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  { id: 'striker', emoji: 'striker', label: 'Striker (#9 Jersey)', position: 'ST' },
  { id: 'goalkeeper', emoji: 'goalkeeper', label: 'Wall Goalkeeper', position: 'GK' },
  { id: 'captain', emoji: 'captain', label: 'Captain (Armband)', position: 'CB' },
  { id: 'winger', emoji: 'winger', label: 'Speed Winger', position: 'LW' },
  { id: 'defender', emoji: 'defender', label: 'The Wall Defender', position: 'CB' },
  { id: 'midfielder', emoji: 'midfielder', label: 'Midfield Maestro', position: 'CM' },
  { id: 'freekick', emoji: 'freekick', label: 'Free-Kick Specialist', position: 'CAM' },
  { id: 'legend', emoji: 'legend', label: 'Golden Legend', position: 'CF' },
  { id: 'wonderkid', emoji: 'wonderkid', label: 'Young Talent', position: 'RW' },
  { id: 'fanfavorite', emoji: 'fanfavorite', label: 'Fan Favorite', position: 'AM' },
];

// Verified Transparent Club Logos (Official CDN with high reliability)
export const VERIFIED_CLUB_LOGOS: Record<string, string> = {
  'Real Madrid': 'https://images.fotmob.com/image_resources/logo/teamlogo/8633.png',
  'FC Barcelona': 'https://images.fotmob.com/image_resources/logo/teamlogo/8634.png',
  'Barcelona': 'https://images.fotmob.com/image_resources/logo/teamlogo/8634.png',
  'Manchester City': 'https://images.fotmob.com/image_resources/logo/teamlogo/8456.png',
  'Manchester United': 'https://images.fotmob.com/image_resources/logo/teamlogo/10260.png',
  'Liverpool': 'https://images.fotmob.com/image_resources/logo/teamlogo/8650.png',
  'Arsenal': 'https://images.fotmob.com/image_resources/logo/teamlogo/9825.png',
  'Chelsea': 'https://images.fotmob.com/image_resources/logo/teamlogo/8455.png',
  'Bayern Munich': 'https://images.fotmob.com/image_resources/logo/teamlogo/9823.png',
  'Borussia Dortmund': 'https://images.fotmob.com/image_resources/logo/teamlogo/9789.png',
  'Paris Saint-Germain': 'https://images.fotmob.com/image_resources/logo/teamlogo/9847.png',
  'PSG': 'https://images.fotmob.com/image_resources/logo/teamlogo/9847.png',
  'Juventus': 'https://images.fotmob.com/image_resources/logo/teamlogo/9885.png',
  'Inter Milan': 'https://images.fotmob.com/image_resources/logo/teamlogo/8636.png',
  'AC Milan': 'https://images.fotmob.com/image_resources/logo/teamlogo/8564.png',
  'Atletico Madrid': 'https://images.fotmob.com/image_resources/logo/teamlogo/9906.png',
  'Tottenham Hotspur': 'https://images.fotmob.com/image_resources/logo/teamlogo/8586.png',
  'Tottenham': 'https://images.fotmob.com/image_resources/logo/teamlogo/8586.png',
  'Bayer Leverkusen': 'https://images.fotmob.com/image_resources/logo/teamlogo/8178.png',
  'Aston Villa': 'https://images.fotmob.com/image_resources/logo/teamlogo/10252.png',
  'Newcastle United': 'https://images.fotmob.com/image_resources/logo/teamlogo/10261.png',
  'Newcastle': 'https://images.fotmob.com/image_resources/logo/teamlogo/10261.png',
  'Sporting CP': 'https://images.fotmob.com/image_resources/logo/teamlogo/9768.png',
  'Benfica': 'https://images.fotmob.com/image_resources/logo/teamlogo/9772.png',
  'AS Roma': 'https://images.fotmob.com/image_resources/logo/teamlogo/8686.png',
  'Roma': 'https://images.fotmob.com/image_resources/logo/teamlogo/8686.png',
  'Ajax': 'https://images.fotmob.com/image_resources/logo/teamlogo/8593.png',
  'Santos': 'https://images.fotmob.com/image_resources/logo/teamlogo/10268.png',
  'Al Nassr': 'https://images.fotmob.com/image_resources/logo/teamlogo/100085.png',
  'Al Hilal': 'https://images.fotmob.com/image_resources/logo/teamlogo/100084.png',
  'Monaco': 'https://images.fotmob.com/image_resources/logo/teamlogo/9829.png',
  'AS Monaco': 'https://images.fotmob.com/image_resources/logo/teamlogo/9829.png',
  'LA Galaxy': 'https://images.fotmob.com/image_resources/logo/teamlogo/6413.png',
  'Inter Miami': 'https://images.fotmob.com/image_resources/logo/teamlogo/1146833.png',
};

// Verified Player Portraits (Official CDN portraits)
export const VERIFIED_PLAYER_PHOTOS: Record<string, string> = {
  'Cristiano Ronaldo': 'https://images.fotmob.com/image_resources/playerimages/30893.png',
  'Lionel Messi': 'https://images.fotmob.com/image_resources/playerimages/30981.png',
  'Kylian Mbappe': 'https://images.fotmob.com/image_resources/playerimages/737066.png',
  'Kylian Mbappé': 'https://images.fotmob.com/image_resources/playerimages/737066.png',
  'Erling Haaland': 'https://images.fotmob.com/image_resources/playerimages/829705.png',
  'Vinicius Jr': 'https://images.fotmob.com/image_resources/playerimages/854278.png',
  'Vinícius Júnior': 'https://images.fotmob.com/image_resources/playerimages/854278.png',
  'Jude Bellingham': 'https://images.fotmob.com/image_resources/playerimages/1077894.png',
  'Robert Lewandowski': 'https://images.fotmob.com/image_resources/playerimages/96144.png',
  'Luka Modric': 'https://images.fotmob.com/image_resources/playerimages/32570.png',
  'Luka Modrić': 'https://images.fotmob.com/image_resources/playerimages/32570.png',
  'Karim Benzema': 'https://images.fotmob.com/image_resources/playerimages/33083.png',
  'Kevin De Bruyne': 'https://images.fotmob.com/image_resources/playerimages/169200.png',
  'Neymar Jr': 'https://images.fotmob.com/image_resources/playerimages/210224.png',
  'Neymar': 'https://images.fotmob.com/image_resources/playerimages/210224.png',
  'Harry Kane': 'https://images.fotmob.com/image_resources/playerimages/208443.png',
  'Mohamed Salah': 'https://images.fotmob.com/image_resources/playerimages/292462.png',
  'Virgil van Dijk': 'https://images.fotmob.com/image_resources/playerimages/209405.png',
  'Alisson': 'https://images.fotmob.com/image_resources/playerimages/413407.png',
  'Thibaut Courtois': 'https://images.fotmob.com/image_resources/playerimages/192496.png',
  'Florian Wirtz': 'https://images.fotmob.com/image_resources/playerimages/1140068.png',
  'Jamal Musiala': 'https://images.fotmob.com/image_resources/playerimages/1131742.png',
  'Lamine Yamal': 'https://images.fotmob.com/image_resources/playerimages/1498670.png',
  'Pedri': 'https://images.fotmob.com/image_resources/playerimages/1105345.png',
  'Gavi': 'https://images.fotmob.com/image_resources/playerimages/1253455.png',
  'Ilkay Gundogan': 'https://images.fotmob.com/image_resources/playerimages/113880.png',
  'İlkay Gündoğan': 'https://images.fotmob.com/image_resources/playerimages/113880.png',
  'Ashley Cole': 'https://images.fotmob.com/image_resources/playerimages/24838.png',
  'Luis Figo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Luis_Figo_2012.jpg/440px-Luis_Figo_2012.jpg',
  'Xabi Alonso': 'https://images.fotmob.com/image_resources/playerimages/24647.png',
  'Angel Di Maria': 'https://images.fotmob.com/image_resources/playerimages/68822.png',
  'Ángel Di María': 'https://images.fotmob.com/image_resources/playerimages/68822.png',
  'Zlatan Ibrahimovic': 'https://images.fotmob.com/image_resources/playerimages/24810.png',
  'David Beckham': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/David_Beckham_2019.jpg/440px-David_Beckham_2019.jpg',
  'Cesc Fabregas': 'https://images.fotmob.com/image_resources/playerimages/30743.png',
  'Thierry Henry': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Thierry_Henry_in_2008.jpg/440px-Thierry_Henry_in_2008.jpg',
  'Frank Lampard': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Frank_Lampard_2012.jpg/440px-Frank_Lampard_2012.jpg',
  'Didier Drogba': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Didier_Drogba_2014.jpg/440px-Didier_Drogba_2014.jpg',
  'Paulo Dybala': 'https://images.fotmob.com/image_resources/playerimages/353443.png',
  'Zinedine Zidane': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Zinedine_Zidane_by_Tasnim_03.jpg/440px-Zinedine_Zidane_by_Tasnim_03.jpg',
  'Ronaldinho': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Ronaldinho_in_2019.jpg/440px-Ronaldinho_in_2019.jpg',
  'Rivaldo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Rivaldo_2013.jpg/440px-Rivaldo_2013.jpg',
  'Raul': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Ra%C3%BAl_Gonz%C3%A1lez_2013.jpg/440px-Ra%C3%BAl_Gonz%C3%A1lez_2013.jpg',
  'Raúl': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Ra%C3%BAl_Gonz%C3%A1lez_2013.jpg/440px-Ra%C3%BAl_Gonz%C3%A1lez_2013.jpg',
  'Patrick Vieira': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Patrick_Vieira_2011.jpg/440px-Patrick_Vieira_2011.jpg',
  'Nicolas Anelka': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Nicolas_Anelka_2012.jpg/440px-Nicolas_Anelka_2012.jpg',
  'Clarence Seedorf': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Clarence_Seedorf_2013.jpg/440px-Clarence_Seedorf_2013.jpg',
  'Michael Owen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Michael_Owen_2012.jpg/440px-Michael_Owen_2012.jpg',
  'Alexis Sanchez': 'https://images.fotmob.com/image_resources/playerimages/41856.png',
  'Alexis Sánchez': 'https://images.fotmob.com/image_resources/playerimages/41856.png',
  'Rodri': 'https://images.fotmob.com/image_resources/playerimages/688329.png',
  'Bernardo Silva': 'https://images.fotmob.com/image_resources/playerimages/468002.png',
  'Phil Foden': 'https://images.fotmob.com/image_resources/playerimages/807693.png',
  'Bukayo Saka': 'https://images.fotmob.com/image_resources/playerimages/1007174.png',
  'Declan Rice': 'https://images.fotmob.com/image_resources/playerimages/754774.png',
  'Cole Palmer': 'https://images.fotmob.com/image_resources/playerimages/1131755.png',
  'Antoine Griezmann': 'https://images.fotmob.com/image_resources/playerimages/172166.png',
  'Federico Valverde': 'https://images.fotmob.com/image_resources/playerimages/726207.png',
  'Rodrygo': 'https://images.fotmob.com/image_resources/playerimages/950561.png',
  'Eduardo Camavinga': 'https://images.fotmob.com/image_resources/playerimages/1047648.png',
  'Aurelien Tchouameni': 'https://images.fotmob.com/image_resources/playerimages/922756.png',
  'Antonio Rudiger': 'https://images.fotmob.com/image_resources/playerimages/263592.png',
  'Dani Carvajal': 'https://images.fotmob.com/image_resources/playerimages/215707.png',
  'Trent Alexander-Arnold': 'https://images.fotmob.com/image_resources/playerimages/737083.png',
  'Raphinha': 'https://images.fotmob.com/image_resources/playerimages/688301.png',
  'Dani Olmo': 'https://images.fotmob.com/image_resources/playerimages/651034.png',
};

export const CLUB_THEMES: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  'Real Madrid': { bg: 'bg-white/10', text: 'text-amber-300', border: 'border-amber-400/40', accent: '#FEBE10' },
  'Juventus': { bg: 'bg-neutral-800', text: 'text-white', border: 'border-white/30', accent: '#FFFFFF' },
  'Arsenal': { bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-500/40', accent: '#EF0107' },
  'Chelsea': { bg: 'bg-blue-950/60', text: 'text-blue-400', border: 'border-blue-500/40', accent: '#034694' },
  'Barcelona': { bg: 'bg-blue-950/70', text: 'text-red-400', border: 'border-red-600/40', accent: '#A50044' },
  'FC Barcelona': { bg: 'bg-blue-950/70', text: 'text-red-400', border: 'border-red-600/40', accent: '#A50044' },
  'Manchester City': { bg: 'bg-sky-950/60', text: 'text-sky-300', border: 'border-sky-400/40', accent: '#6CABDD' },
  'Manchester United': { bg: 'bg-red-950/70', text: 'text-red-400', border: 'border-red-500/40', accent: '#DA291C' },
  'Paris Saint-Germain': { bg: 'bg-indigo-950/60', text: 'text-red-400', border: 'border-blue-400/40', accent: '#004170' },
  'PSG': { bg: 'bg-indigo-950/60', text: 'text-red-400', border: 'border-blue-400/40', accent: '#004170' },
  'Bayern Munich': { bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-500/40', accent: '#DC052D' },
  'Liverpool': { bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-600/40', accent: '#C8102E' },
  'Borussia Dortmund': { bg: 'bg-yellow-950/60', text: 'text-yellow-400', border: 'border-yellow-400/40', accent: '#FDE100' },
  'AC Milan': { bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-500/40', accent: '#FB090B' },
  'Inter Milan': { bg: 'bg-blue-950/60', text: 'text-blue-400', border: 'border-blue-500/40', accent: '#0066B2' },
  'Sporting CP': { bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-500/40', accent: '#008057' },
  'Benfica': { bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-500/40', accent: '#E8112d' },
  'Atletico Madrid': { bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-500/40', accent: '#CB3524' },
  'Tottenham Hotspur': { bg: 'bg-blue-950/60', text: 'text-slate-200', border: 'border-blue-500/40', accent: '#132257' },
  'Bayer Leverkusen': { bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-500/40', accent: '#E32219' },
  'Aston Villa': { bg: 'bg-purple-950/60', text: 'text-sky-300', border: 'border-purple-500/40', accent: '#670E36' },
  'Newcastle United': { bg: 'bg-neutral-800', text: 'text-white', border: 'border-white/30', accent: '#241F20' },
  'AS Roma': { bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-500/40', accent: '#8E1F2F' },
  'Ajax': { bg: 'bg-red-950/60', text: 'text-white', border: 'border-red-500/40', accent: '#D2122E' },
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
    accent: '#B7F34A',
  };
}

export function getClubLogoUrl(clubName: string): string {
  const clean = clubName.trim();
  if (VERIFIED_CLUB_LOGOS[clean]) return VERIFIED_CLUB_LOGOS[clean];
  for (const [key, url] of Object.entries(VERIFIED_CLUB_LOGOS)) {
    if (clean.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(clean.toLowerCase())) {
      return url;
    }
  }
  return '';
}

export function getPlayerPhotoUrl(playerName: string): string {
  const clean = playerName.trim();
  if (VERIFIED_PLAYER_PHOTOS[clean]) return VERIFIED_PLAYER_PHOTOS[clean];
  for (const [key, url] of Object.entries(VERIFIED_PLAYER_PHOTOS)) {
    if (clean.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(clean.toLowerCase())) {
      return url;
    }
  }
  return '';
}

export function getCountryFlagUrl(countryCode: string): string {
  const code = countryCode.toLowerCase().trim();
  return `https://flagcdn.com/w80/${code}.png`;
}
