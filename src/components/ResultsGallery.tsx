import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Download,
  Maximize2,
  Copy,
  RotateCw,
  Image as ImageIcon,
  AlertTriangle,
  RefreshCw,
  LayoutGrid,
  Maximize,
  Check,
} from 'lucide-react';
import { AspectRatio, ImageResult } from '../types';

interface ResultsGalleryProps {
  results: ImageResult[];
  isGenerating: boolean;
  generationStage: string;
  generationProgress: number;
  generationError: string | null;
  onRetry: () => void;
  onPreviewImage: (image: ImageResult) => void;
  onToggleFavorite: (imageId: string) => void;
  onDownloadImage: (image: ImageResult) => void;
  onRegenerateVariation: (image: ImageResult) => void;
  onCopyPrompt: (prompt: string) => void;
  onStartNew: () => void;
}

export const ResultsGallery: React.FC<ResultsGalleryProps> = ({
  results,
  isGenerating,
  generationStage,
  generationProgress,
  generationError,
  onRetry,
  onPreviewImage,
  onToggleFavorite,
  onDownloadImage,
  onRegenerateVariation,
  onCopyPrompt,
  onStartNew,
}) => {
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<'natural' | 'uniform'>('natural');

  const handleImageError = (id: string) => {
    setImageErrorMap((prev) => ({ ...prev, [id]: true }));
  };

  const handleCopy = (id: string, promptText: string) => {
    onCopyPrompt(promptText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper for aspect ratio styling
  const getAspectRatioClass = (ratio: AspectRatio) => {
    if (displayMode === 'uniform') {
      return 'aspect-[4/3]';
    }

    switch (ratio) {
      case '1:1':
        return 'aspect-square';
      case '3:4':
        return 'aspect-[3/4]';
      case '4:3':
        return 'aspect-[4/3]';
      case '9:16':
        return 'aspect-[9/16]';
      case '16:9':
        return 'aspect-[16/9]';
      default:
        return 'aspect-square';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Gallery Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200/80 dark:border-neutral-800 pb-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>Canvas Output</span>
            {results.length > 0 && !isGenerating && (
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                {results.length} {results.length === 1 ? 'concept' : 'concepts'}
              </span>
            )}
          </h2>

          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono hidden md:inline">
            Curated Demo Output
          </span>
        </div>

        {/* View mode toggle and New generation trigger */}
        <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
          {results.length > 0 && !isGenerating && (
            <div className="flex items-center p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-800/70 text-xs">
              <button
                type="button"
                onClick={() => setDisplayMode('natural')}
                className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  displayMode === 'natural'
                    ? 'bg-white dark:bg-[#1A1D24] text-neutral-900 dark:text-neutral-100 shadow-xs font-medium'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
                title="Display cards at native aspect ratios"
              >
                <Maximize className="w-3 h-3" />
                <span className="hidden sm:inline">Native Ratios</span>
              </button>

              <button
                type="button"
                onClick={() => setDisplayMode('uniform')}
                className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  displayMode === 'uniform'
                    ? 'bg-white dark:bg-[#1A1D24] text-neutral-900 dark:text-neutral-100 shadow-xs font-medium'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
                title="Display cards at uniform 4:3 grid height"
              >
                <LayoutGrid className="w-3 h-3" />
                <span className="hidden sm:inline">Uniform Grid</span>
              </button>
            </div>
          )}

          {results.length > 0 && !isGenerating && (
            <button
              onClick={onStartNew}
              className="text-xs font-medium text-[#D95338] hover:text-[#C2432B] flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Prompt</span>
            </button>
          )}
        </div>
      </div>

      {/* State 1: Error State */}
      {generationError && (
        <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Generation Simulation Interrupted
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 max-w-md mx-auto">
              {generationError}
            </p>
          </div>
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-lg bg-[#D95338] text-white text-xs font-medium hover:bg-[#C2432B] inline-flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Generation</span>
          </button>
        </div>
      )}

      {/* State 2: Generating / Skeleton Shimmer State */}
      {isGenerating && (
        <div className="p-8 sm:p-12 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#15171C] text-center space-y-6">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#FAF0ED] dark:bg-[#2B1B18] text-[#D95338] flex items-center justify-center">
              <Sparkles className="w-6 h-6 animate-spin text-[#D95338]" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Synthesizing Visual Concepts...
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              {generationStage || 'Initializing neural latent grid...'}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#D95338] h-full transition-all duration-300 rounded-full"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
            <span className="text-[11px] text-neutral-400 font-mono tabular-nums">
              {generationProgress}% complete
            </span>
          </div>

          {/* Skeleton cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="aspect-square rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800/80 animate-pulse"
              />
            ))}
          </div>
        </div>
      )}

      {/* State 3: Empty State (Before first user generation) */}
      {!isGenerating && !generationError && results.length === 0 && (
        <div className="p-8 sm:p-14 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white/60 dark:bg-[#15171C]/50 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FAF0ED] dark:bg-[#2B1B18] text-[#D95338] flex items-center justify-center shadow-sm">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Your Creative Canvas is Ready
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              Enter a prompt or select a curated <strong>Prompt Recipe</strong> above, then click{' '}
              <strong>Generate</strong> to produce your visual concepts.
            </p>
          </div>
        </div>
      )}

      {/* State 4: Populated Gallery Grid (Items-start prevents vertical stretching) */}
      {!isGenerating && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 items-start">
          {results.map((item) => {
            const hasError = imageErrorMap[item.id];
            const aspectClass = getAspectRatioClass(item.aspectRatio);

            return (
              <div
                key={item.id}
                className="group w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#16181E] shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                {/* Visual Media Container — Snug fit, no extra white space */}
                <div
                  className={`w-full ${aspectClass} bg-neutral-100 dark:bg-neutral-900 relative overflow-hidden`}
                >
                  {!hasError ? (
                    <img
                      src={item.imageUrl}
                      alt={item.prompt}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(item.id)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 text-center">
                      <ImageIcon className="w-8 h-8 text-neutral-400 mb-2" />
                      <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                        Visual Concept Render
                      </span>
                      <span className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        {item.style} · {item.aspectRatio}
                      </span>
                    </div>
                  )}

                  {/* Top-right quick favorite button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    className={`absolute top-2.5 right-2.5 p-2 rounded-lg backdrop-blur-md transition-all z-10 ${
                      item.isFavorite
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'bg-black/40 text-white hover:bg-black/60 opacity-90 sm:opacity-0 sm:group-hover:opacity-100'
                    }`}
                    aria-label={item.isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                  >
                    <Heart
                      className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`}
                    />
                  </button>

                  {/* Aspect Ratio Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-md text-[10px] font-mono tracking-wider">
                    {item.aspectRatio}
                  </div>

                  {/* Hover Overlay with primary actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3.5 text-white">
                    <p className="text-xs line-clamp-2 text-neutral-200 leading-snug mb-2.5 font-serif italic">
                      &ldquo;{item.prompt}&rdquo;
                    </p>

                    <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-white/20">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPreviewImage(item);
                          }}
                          className="p-1.5 rounded-md hover:bg-white/20 text-neutral-100 transition-colors"
                          title="Open high-res lightbox preview"
                          aria-label="Inspect high resolution image"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(item.id, item.prompt);
                          }}
                          className="p-1.5 rounded-md hover:bg-white/20 text-neutral-100 transition-colors"
                          title="Copy prompt"
                          aria-label="Copy prompt to clipboard"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRegenerateVariation(item);
                          }}
                          className="p-1.5 rounded-md hover:bg-white/20 text-neutral-100 transition-colors"
                          title="Regenerate style variations"
                          aria-label="Create variations of this image"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownloadImage(item);
                        }}
                        className="px-2.5 py-1 rounded-md bg-[#D95338] text-white text-[11px] font-medium flex items-center gap-1 hover:bg-[#C2432B] transition-colors shadow-sm"
                        aria-label="Download image"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Footer Details — Cleanly attached to the bottom of the image */}
                <div className="p-3 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5 min-w-0 pr-2">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                        {item.recipeName || item.style}
                      </span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 hidden sm:inline">
                        · {item.style}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] shrink-0 text-neutral-400">
                      Seed {item.seed}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
