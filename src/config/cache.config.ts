export const cacheConfig = {
  // Default TTL for lyrics cache (5 minutes)
  lyricsTTL: 300000,
  randomLyricsTTL: 15 * 60 * 1000, // 15 minutes in milliseconds
  searchTTL: 30 * 60 * 1000, // 30 minutes in milliseconds

  // Maximum number of items in cache
  maxItems: 100,

  // Cache key prefixes
  keys: {
    lyrics: 'lyrics:',
    randomLyrics: 'random_lyrics:',
    lyricsByCategory: 'lyrics_by_',
    search: 'lyrics_search_',
  },

  // Cache invalidation patterns
  patterns: {
    lyrics: '*lyrics*',
    random: '*random_lyrics*',
    category: '*lyrics_by_*',
  },
};
