const RECENT_SEARCH_KEY = 'recent_searches';
const MAX_RECENT = 6;

export const saveRecentSearch = (query) => {
  if (!query.trim()) return;

  const existing = JSON.parse(localStorage.getItem(RECENT_SEARCH_KEY)) || [];
  const filtered = existing.filter((item) => item.toLowerCase() !== query.toLowerCase());
  const updated = [query, ...filtered].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
};

export const getRecentSearches = () => {
  return JSON.parse(localStorage.getItem(RECENT_SEARCH_KEY)) || [];
};

export const clearRecentSearches = () => {
  localStorage.removeItem(RECENT_SEARCH_KEY);
};
