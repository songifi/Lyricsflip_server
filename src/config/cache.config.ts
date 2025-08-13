export const cacheConfig = {
  // Default TTL for lyrics cache (5 minutes)
  lyricsTTL: 300000,
  
  // Maximum number of items in cache
  maxItems: 100,
  
  // Cache key prefixes
  keys: {
    lyrics: 'lyrics:',
    randomLyrics: 'random_lyrics:',
    lyricsByCategory: 'lyrics_by_',
  },
  
  // Cache invalidation patterns
  patterns: {
    lyrics: '*lyrics*',
    random: '*random_lyrics*',
    category: '*lyrics_by_*',
  },
};
