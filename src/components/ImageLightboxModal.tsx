import React, { useEffect, useState } from 'react';
import {
  X,
  Heart,
  Download,
  Copy,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Calendar,
  Layers,
  Settings2,
  RefreshCw,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { ImageResult } from '../types';

interface LightboxProps {
  image: ImageResult | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDownload: (image: ImageResult) => void;
  onCopyPrompt: (prompt: string) => void;
  onUsePromptInComposer: (image: ImageResult) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export const ImageLightboxModal: React.FC<LightboxProps> = ({
  image,
  onClose,
  onToggleFavorite,
  onDownload,
  onCopyPrompt,
  onUsePromptInComposer,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset loading & error state when image changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [image?.id, image?.imageUrl]);
  // Keyboard listeners: Esc to close, Arrow keys to navigate
  useEffect(() => {
    if (!image) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && onNext && hasNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && onPrevious && hasPrevious) {
        onPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [image, onClose, onNext, onPrevious, hasNext, hasPrevious]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
    >
      {/* Background click overlay */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Lightbox Container */}
      <div className="relative z-10 w-full max-w-5xl max-h-[92vh] bg-white dark:bg-[#15171C] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Close Button Top-Right */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 backdrop-blur-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Image Viewport */}
        <div className="relative flex-1 bg-neutral-950 flex items-center justify-center min-h-[300px] md:min-h-[500px] overflow-hidden p-4">
          {/* Loading spinner overlay */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-950/80 z-10">
              <Loader2 className="w-8 h-8 text-[#D95338] animate-spin" />
              <span className="text-xs text-neutral-400 font-mono">Loading full-resolution asset...</span>
            </div>
          )}

          {/* Error fallback state */}
          {hasError ? (
            <div className="flex flex-col items-center justify-center p-6 text-center max-w-sm space-y-3 z-10">
              <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-800/80 text-rose-400 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-200">Unable to Render Preview</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  The visual asset could not be displayed. You can attempt to reload it or download the source asset directly.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setHasError(false);
                    setIsLoading(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 flex items-center gap-1.5 transition-colors border border-neutral-700"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Load</span>
                </button>
                <button
                  onClick={() => onDownload(image)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#D95338] hover:bg-[#C2432B] text-xs text-white flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ) : (
            <img
              key={`${image.id}-${image.imageUrl}`}
              src={image.imageUrl}
              alt={image.prompt}
              referrerPolicy="no-referrer"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              className={`max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-lg transition-opacity duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
            />
          )}

          {/* Navigation Arrows */}
          {hasPrevious && onPrevious && (
            <button
              onClick={onPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md transition-colors z-20"
              aria-label="Previous image"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {hasNext && onNext && (
            <button
              onClick={onNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md transition-colors z-20"
              aria-label="Next image"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Right Side: Metadata & Controls Panel */}
        <div className="w-full md:w-80 lg:w-96 p-5 sm:p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800 overflow-y-auto max-h-[45vh] md:max-h-[90vh]">
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  Concept Metadata
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  {image.aspectRatio} · {image.dimensions.width}×{image.dimensions.height}
                </span>
              </div>
              <h2
                id="lightbox-title"
                className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mt-1"
              >
                {image.recipeName || `${image.style} Render`}
              </h2>
            </div>

            {/* Prompt Content */}
            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">Prompt</span>
                <button
                  onClick={() => onCopyPrompt(image.prompt)}
                  className="hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 text-[11px]"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-serif italic">
                &ldquo;{image.prompt}&rdquo;
              </p>
            </div>

            {/* Parameter Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-neutral-100/60 dark:bg-neutral-800/50">
                <span className="text-[10px] text-neutral-400 block">Style</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {image.style}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-100/60 dark:bg-neutral-800/50">
                <span className="text-[10px] text-neutral-400 block">Quality Preset</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200 uppercase font-mono">
                  {image.quality}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-100/60 dark:bg-neutral-800/50">
                <span className="text-[10px] text-neutral-400 block">Seed</span>
                <span className="font-mono text-neutral-800 dark:text-neutral-200">
                  {image.seed}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-100/60 dark:bg-neutral-800/50">
                <span className="text-[10px] text-neutral-400 block">Created</span>
                <span className="text-neutral-800 dark:text-neutral-200 font-mono text-[11px]">
                  {new Date(image.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-5 mt-5 border-t border-neutral-100 dark:border-neutral-800/80 space-y-2">
            <button
              onClick={() => onUsePromptInComposer(image)}
              className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium hover:bg-neutral-800 dark:hover:bg-white flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#D95338]" />
              <span>Load Prompt into Composer</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onToggleFavorite(image.id)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  image.isFavorite
                    ? 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                    : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${image.isFavorite ? 'fill-current' : ''}`} />
                <span>{image.isFavorite ? 'Favorited' : 'Favorite'}</span>
              </button>

              <button
                onClick={() => onDownload(image)}
                className="py-2 px-3 rounded-xl bg-[#D95338] text-white text-xs font-medium hover:bg-[#C2432B] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download HD</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
