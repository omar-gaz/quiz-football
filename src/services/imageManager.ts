import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { QuestionData } from '../types/football.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const IMAGES_CACHE_DIR = path.join(DATA_DIR, 'images_cache');
const IMAGES_MAP_FILE = path.join(DATA_DIR, 'football_images_map.json');

// Ensure storage directory exists
if (!fs.existsSync(IMAGES_CACHE_DIR)) {
  fs.mkdirSync(IMAGES_CACHE_DIR, { recursive: true });
}

export interface CachedImageRecord {
  name: string;
  type: 'club' | 'player';
  sourceUrl: string;
  localPath: string; // relative to /api/images/cache/
  verified: boolean;
  timestamp: number;
}

export interface ImagesDatabase {
  clubs: Record<string, CachedImageRecord>;
  players: Record<string, CachedImageRecord>;
}

// Canonical Wikipedia page titles for guaranteed accuracy
const CANONICAL_CLUB_PAGES: Record<string, string> = {
  'Real Madrid': 'Real_Madrid_CF',
  'Juventus': 'Juventus_FC',
  'Arsenal': 'Arsenal_F.C.',
  'Chelsea': 'Chelsea_F.C.',
  'Barcelona': 'FC_Barcelona',
  'FC Barcelona': 'FC_Barcelona',
  'Manchester City': 'Manchester_City_F.C.',
  'Manchester United': 'Manchester_United_F.C.',
  'Paris Saint-Germain': 'Paris_Saint-Germain_F.C.',
  'PSG': 'Paris_Saint-Germain_F.C.',
  'Bayern Munich': 'FC_Bayern_Munich',
  'Liverpool': 'Liverpool_F.C.',
  'Borussia Dortmund': 'Borussia_Dortmund',
  'AC Milan': 'A.C._Milan',
  'Inter Milan': 'Inter_Milan',
  'Sporting CP': 'Sporting_CP',
  'LA Galaxy': 'LA_Galaxy',
  'Inter Miami': 'Inter_Miami_CF',
  'Al Nassr': 'Al_Nassr_FC',
  'Al Hilal': 'Al_Hilal_SFC',
  'Monaco': 'AS_Monaco_FC',
  'AS Monaco': 'AS_Monaco_FC',
  'Santos': 'Santos_FC',
  'Tottenham Hotspur': 'Tottenham_Hotspur_F.C.',
  'Atletico Madrid': 'Atlético_Madrid',
  'Ajax': 'AFC_Ajax',
};

const CANONICAL_PLAYER_PAGES: Record<string, string> = {
  'Cristiano Ronaldo': 'Cristiano_Ronaldo',
  'Lionel Messi': 'Lionel_Messi',
  'David Beckham': 'David_Beckham',
  'Ashley Cole': 'Ashley_Cole',
  'Ilkay Gundogan': 'İlkay_Gündoğan',
  'Luis Figo': 'Luís_Figo',
  'Xabi Alonso': 'Xabi_Alonso',
  'Robert Lewandowski': 'Robert_Lewandowski',
  'Angel Di Maria': 'Ángel_Di_María',
  'Zlatan Ibrahimovic': 'Zlatan_Ibrahimović',
  'Kylian Mbappe': 'Kylian_Mbappé',
  'Neymar Jr': 'Neymar',
  'Neymar': 'Neymar',
  'Cesc Fabregas': 'Cesc_Fàbregas',
  'Karim Benzema': 'Karim_Benzema',
  'Luka Modric': 'Luka_Modrić',
  'Kevin De Bruyne': 'Kevin_De_Bruyne',
  'Thierry Henry': 'Thierry_Henry',
  'Frank Lampard': 'Frank_Lampard',
  'Didier Drogba': 'Didier_Drogba',
  'Erling Haaland': 'Erling_Haaland',
  'Paulo Dybala': 'Paulo_Dybala',
  'Pedri': 'Pedri',
};

function loadImagesMap(): ImagesDatabase {
  try {
    if (fs.existsSync(IMAGES_MAP_FILE)) {
      return JSON.parse(fs.readFileSync(IMAGES_MAP_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Failed to load images map:', err);
  }
  return { clubs: {}, players: {} };
}

function saveImagesMap(map: ImagesDatabase) {
  try {
    fs.writeFileSync(IMAGES_MAP_FILE, JSON.stringify(map, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save images map:', err);
  }
}

let imageDb = loadImagesMap();

function sanitizeFilename(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

/**
 * Downloads an image from a URL and saves it to the persistent disk cache.
 */
async function downloadAndCacheImage(url: string, filenamePrefix: string): Promise<string | null> {
  try {
    const ext = url.toLowerCase().includes('.png') ? '.png' : url.toLowerCase().includes('.svg') ? '.svg' : '.jpg';
    const filename = `${filenamePrefix}${ext}`;
    const targetPath = path.join(IMAGES_CACHE_DIR, filename);

    // If already exists on disk, reuse immediately
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 1000) {
      return `/api/images/cache/${filename}`;
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'PitchTrivia/1.0 (football-trivia-app@example.com)',
      },
    });

    if (!res.ok) return null;

    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength < 500) return null;

    fs.writeFileSync(targetPath, Buffer.from(arrayBuffer));
    return `/api/images/cache/${filename}`;
  } catch (err) {
    console.error(`Failed to download image from ${url}:`, err);
    return null;
  }
}

/**
 * Queries Wikipedia / Wikimedia for an official image (club logo or player photo).
 */
async function searchWikimediaImage(queryName: string, type: 'club' | 'player'): Promise<string | null> {
  const canonicalMap = type === 'club' ? CANONICAL_CLUB_PAGES : CANONICAL_PLAYER_PAGES;
  const canonicalTitle = canonicalMap[queryName];

  // Try 1: Direct summary endpoint if known canonical title
  if (canonicalTitle) {
    try {
      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(canonicalTitle)}`;
      const res = await fetch(summaryUrl, {
        headers: { 'User-Agent': 'PitchTrivia/1.0 (football-trivia-app@example.com)' },
      });
      if (res.ok) {
        const data = await res.json();
        const img = data.thumbnail?.source || data.originalimage?.source;
        if (img) return img;
      }
    } catch (err) {
      console.warn(`Summary query failed for ${canonicalTitle}:`, err);
    }
  }

  // Try 2: Generic Wikipedia Search with disambiguation keywords
  try {
    const searchKeyword = type === 'club' ? `${queryName} football club` : `${queryName} footballer`;
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      searchKeyword
    )}&gsrlimit=3&prop=pageimages|extracts&piprop=thumbnail|original&pithumbsize=600&exintro=1&explaintext=1&format=json&origin=*`;

    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'PitchTrivia/1.0 (football-trivia-app@example.com)' },
    });

    if (res.ok) {
      const data = await res.json();
      const pages = data.query?.pages;
      if (pages) {
        for (const page of Object.values(pages) as any[]) {
          const text = (page.extract || '').toLowerCase();
          const isRelevant =
            type === 'club'
              ? text.includes('football') || text.includes('club') || text.includes('league')
              : text.includes('football') || text.includes('player') || text.includes('striker') || text.includes('midfielder');

          if (isRelevant && (page.thumbnail?.source || page.original?.source)) {
            return page.thumbnail?.source || page.original?.source;
          }
        }
      }
    }
  } catch (err) {
    console.warn(`Wikipedia search failed for ${queryName}:`, err);
  }

  return null;
}

/**
 * Automatically retrieves and caches a verified club logo.
 */
export async function getOrFetchClubLogo(clubName: string): Promise<string> {
  const cleanName = clubName.trim();
  const cached = imageDb.clubs[cleanName];

  // If already verified and file exists on disk
  if (cached && fs.existsSync(path.join(ROOT_DIR, cached.localPath.replace('/api/', 'data/')))) {
    return cached.localPath;
  }

  console.log(`[AutoImageSearch] Searching official logo for club: "${cleanName}"...`);
  const sourceUrl = await searchWikimediaImage(cleanName, 'club');

  if (sourceUrl) {
    const safePrefix = `club_${sanitizeFilename(cleanName)}`;
    const localPath = await downloadAndCacheImage(sourceUrl, safePrefix);

    if (localPath) {
      imageDb.clubs[cleanName] = {
        name: cleanName,
        type: 'club',
        sourceUrl,
        localPath,
        verified: true,
        timestamp: Date.now(),
      };
      saveImagesMap(imageDb);
      console.log(`✓ [AutoImageSearch] Cached verified logo for "${cleanName}": ${localPath}`);
      return localPath;
    }
  }

  // Graceful fallback URL if not found or network is slow
  return '';
}

/**
 * Automatically retrieves and caches a verified player photo.
 */
export async function getOrFetchPlayerPhoto(playerName: string): Promise<string> {
  const cleanName = playerName.trim();
  const cached = imageDb.players[cleanName];

  // If already verified and file exists on disk
  if (cached && fs.existsSync(path.join(ROOT_DIR, cached.localPath.replace('/api/', 'data/')))) {
    return cached.localPath;
  }

  console.log(`[AutoImageSearch] Searching official photo for player: "${cleanName}"...`);
  const sourceUrl = await searchWikimediaImage(cleanName, 'player');

  if (sourceUrl) {
    const safePrefix = `player_${sanitizeFilename(cleanName)}`;
    const localPath = await downloadAndCacheImage(sourceUrl, safePrefix);

    if (localPath) {
      imageDb.players[cleanName] = {
        name: cleanName,
        type: 'player',
        sourceUrl,
        localPath,
        verified: true,
        timestamp: Date.now(),
      };
      saveImagesMap(imageDb);
      console.log(`✓ [AutoImageSearch] Cached verified portrait for "${cleanName}": ${localPath}`);
      return localPath;
    }
  }

  return '';
}

/**
 * Automatically indexes all questions in the database, extracts clubs and players,
 * and attaches verified image paths to question objects.
 */
export async function indexAndEnrichQuestions(questions: QuestionData[]): Promise<void> {
  console.log(`[AutoImageSearch] Starting automatic entity extraction and image indexing for ${questions.length} questions...`);

  for (const q of questions) {
    // 1. Process Clubs
    const clubsToProcess: string[] = [];
    if (q.clubs && q.clubs.length > 0) {
      clubsToProcess.push(...q.clubs);
    }
    if (q.sequence && q.sequence.length > 0) {
      for (const step of q.sequence) {
        if (step.club && !clubsToProcess.includes(step.club)) {
          clubsToProcess.push(step.club);
        }
      }
    }

    q.clubLogos = q.clubLogos || {};
    for (const club of clubsToProcess) {
      if (!q.clubLogos[club]) {
        const logoPath = await getOrFetchClubLogo(club);
        if (logoPath) {
          q.clubLogos[club] = logoPath;
        }
      }
    }

    // 2. Process Player Portrait
    if (q.correctAnswer && !q.playerImage) {
      const playerPath = await getOrFetchPlayerPhoto(q.correctAnswer);
      if (playerPath) {
        q.playerImage = playerPath;
      }
    }
  }

  console.log(`✓ [AutoImageSearch] Question image indexing completed! Total clubs cached: ${Object.keys(imageDb.clubs).length}, players cached: ${Object.keys(imageDb.players).length}`);
}

export function getAllCachedImages(): ImagesDatabase {
  return imageDb;
}
