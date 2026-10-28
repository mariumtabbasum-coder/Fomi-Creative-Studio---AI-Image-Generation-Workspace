import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Heart,
  Download,
  Maximize2,
  Trash2,
  Clock,
  Layers,
  Check,
} from 'lucide-react';
import { ImageResult } from '../types';

interface SavedCreationsViewProps {
  creations: ImageResult[];
  onToggleFavorite: (id: string) => void;
  onPreviewImage: (image: ImageResult) => void;
  onDownloadImage: (image: ImageResult) => void;
  onUsePrompt: (image: ImageResult) => void;
  onClearAll: () => void;
  onNavigateToStudio: () => void;
}

const STYLE_FILTERS: Array<{ id: string; label: string }> = [
  { id: 'all', label: 'All Styles' },
  { id: 'Editorial', label: 'Editorial' },
  { id: 'Minimal', label: 'Minimal' },
  { id: 'Photorealistic', label: 'Photorealistic' },
  { id: 'Cinematic', label: 'Cinematic' },
  { id: 'Illustration', label: 'Illustration' },
  { id: '3D', label: '3D' },
];

export const SavedCreationsView: React.FC<SavedCreationsViewProps> = ({
  creations,
  onToggleFavorite,
  onPreviewImage,
  onDownloadImage,
  onUsePrompt,
  onClearAll,
  onNavigateToStudio,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'favorites'>('favorites');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [confirmClear, setConfirmClear] = useState(false);

  // Exact synchronized counts
  const favoritesCount = useMemo(
    () => creations.filter((c) => c.isFavorite).length,
    [creations]
  );
  const allHistoryCount = creations.length;

  // Filter & sort logic
  const filteredCreations = useMemo(() => {
    let list = [...creations];

    if (activeSubTab === 'favorites') {
      list = list.filter((item) => item.isFavorite);
    }

    if (selectedStyle !== 'all') {
      list = list.filter((item) => item.style === selectedStyle);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.prompt.toLowerCase().includes(q) ||
          (item.recipeName && item.recipeName.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return list;
  }, [creations, activeSubTab, selectedStyle, searchQuery, sortOrder]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStyle('all');
    setSortOrder('newest');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedStyle !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Saved Works & History
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              {allHistoryCount} total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Access previous visual explorations, favorited concepts ({favoritesCount}), and re-run prompts in studio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToStudio}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#D95338] text-white text-xs font-medium hover:bg-[#C2432B] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Studio Canvas</span>
          </button>
        </div>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="space-y-4">
        {/* Sub-tabs: Favorites vs All History */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-neutral-200/60 dark:bg-neutral-800/80 rounded-xl w-full sm:w-fit">
            <button
              onClick={() => setActiveSubTab('favorites')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeSubTab === 'favorites'
                  ? 'bg-white dark:bg-[#1A1D24] text-neutral-900 dark:text-neutral-100 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>Favorites</span>
              <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-700">
                {favoritesCount}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('all')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeSubTab === 'all'
                  ? 'bg-white dark:bg-[#1A1D24] text-neutral-900 dark:text-neutral-100 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>All History</span>
              <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-700">
                {allHistoryCount}
              </span>
            </button>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 text-xs self-end sm:self-auto">
            <span className="text-neutral-400">Sort:</span>
            <button
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#15171C] text-neutral-700 dark:text-neutral-300 flex items-center gap-1 hover:border-neutral-300 transition-colors"
            >
              <ArrowUpDown className="w-3 h-3 text-neutral-400" />
              <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>

        {/* Search & Style Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts by prompt keyword or recipe..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#15171C] text-neutral-900 dark:text-neutral-100 outline-none focus:border-[#D95338]"
            />
          </div>

          {/* Style Selector */}
          <div className="relative">
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#15171C] text-neutral-900 dark:text-neutral-100 outline-none focus:border-[#D95338] appearance-none"
            >
              {STYLE_FILTERS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Reset active filters notice */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs text-neutral-500 py-1">
            <span>
              Showing {filteredCreations.length} matching results
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[#D95338] hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Search & Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid of Results (Responsive & snug cards) */}
      {filteredCreations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5 pt-2 items-start">
          {filteredCreations.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#15171C] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              {/* Media preview */}
              <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.prompt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Aspect ratio and favorite badges */}
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono backdrop-blur-sm">
                  {item.aspectRatio}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item.id);
                  }}
                  className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-md transition-all ${
                    item.isFavorite
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-black/40 text-white hover:bg-black/60 opacity-90 sm:opacity-0 sm:group-hover:opacity-100'
                  }`}
                  aria-label={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-current' : ''}`} />
                </button>

                {/* Hover overlay preview button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewImage(item);
                    }}
                    className="p-2 rounded-full bg-white text-neutral-900 shadow-md hover:scale-110 transition-transform"
                    aria-label="Preview image"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownloadImage(item);
                    }}
                    className="p-2 rounded-full bg-[#D95338] text-white shadow-md hover:scale-110 transition-transform"
                    aria-label="Download image"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Information */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate mr-1">
                      {item.recipeName || item.style}
                    </span>
                    <span className="font-mono text-[10px] shrink-0">
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-snug font-serif italic">
                    &ldquo;{item.prompt}&rdquo;
                  </p>
                </div>

                <div className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-400">
                    Seed {item.seed}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUsePrompt(item);
                    }}
                    className="text-[11px] font-medium text-[#D95338] hover:underline flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Re-run Prompt</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-[#15171C]/50 space-y-3">
          <div className="w-10 h-10 mx-auto rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {activeSubTab === 'favorites'
              ? 'No Favorited Concepts Yet'
              : 'No Generations Matching Filter'}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            {activeSubTab === 'favorites'
              ? 'Click the heart icon on any generated concept in the studio to save it here for quick reference.'
              : 'Try clearing your search query or switching style filters.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#D95338] hover:underline font-medium"
            >
              Reset active filters
            </button>
          )}
        </div>
      )}

      {/* Footer danger zone: Clear history confirmation */}
      {creations.length > 0 && (
        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <span>Persisted locally in your browser storage ({allHistoryCount} records)</span>
          {!confirmClear ? (
            <button
              onClick={() => setConfirmClear(true)}
              className="text-neutral-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900">
              <span className="text-rose-600 dark:text-rose-400 font-medium">Clear all saved records?</span>
              <button
                onClick={() => {
                  onClearAll();
                  setConfirmClear(false);
                }}
                className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-medium hover:bg-rose-700"
              >
                Yes, Clear
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="px-2.5 py-1 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
