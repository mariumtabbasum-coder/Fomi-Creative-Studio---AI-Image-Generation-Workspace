import React, { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  Sliders,
  HelpCircle,
  Copy,
  Lightbulb,
} from 'lucide-react';
import { GenerationSettings } from '../types';

interface PromptComposerProps {
  prompt: string;
  onChangePrompt: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  settings: GenerationSettings;
  activeRecipeName?: string;
  onToggleSettings?: () => void;
}

const QUICK_INSPIRATION_PROMPTS = [
  'Editorial product photography of a handmade ceramic perfume bottle on a sculptural stone surface, soft daylight, elegant composition, muted warm colours.',
  'Minimalist Scandinavian interior design, oak lounge chair next to a large sunlit arched window, soft cast shadows, dried pampas grass in a matte clay vase.',
  'Cinematic editorial portrait of a creative director in natural window chiaroscuro lighting, subtle warm film grain, relaxed natural pose, deep charcoal turtleneck.',
  'Artistic modern still life composition featuring glass carafes, sliced blood oranges, and architectural olive branches on a warm terracotta pedestal.',
];

export const PromptComposer: React.FC<PromptComposerProps> = ({
  prompt,
  onChangePrompt,
  onGenerate,
  isGenerating,
  settings,
  activeRecipeName,
  onToggleSettings,
}) => {
  const [showTips, setShowTips] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangePrompt(e.target.value);
    if (validationError && e.target.value.trim().length > 0) {
      setValidationError(null);
    }
  };

  const handleClear = () => {
    onChangePrompt('');
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setValidationError('Please enter a descriptive prompt or load a recipe before generating.');
      return;
    }
    setValidationError(null);
    onGenerate();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#15171C] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-all">
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
        {/* Top bar of composer */}
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-[11px]">
              Prompt Studio
            </span>
            {activeRecipeName && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#FAF0ED] dark:bg-[#2B1B18] text-[#D95338] font-medium truncate max-w-[200px]">
                Recipe: {activeRecipeName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowTips(!showTips)}
              className="hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 transition-colors"
              aria-label="Toggle prompt writing tips"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{showTips ? 'Hide Tips' : 'Prompt Tips'}</span>
            </button>

            {prompt && (
              <button
                type="button"
                onClick={handleClear}
                className="hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 transition-colors"
                aria-label="Clear prompt text"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Prompt Tips */}
        {showTips && (
          <div className="p-3 bg-neutral-50 dark:bg-neutral-900/60 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300 space-y-1.5 animate-fadeIn">
            <div className="font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D95338]" />
              Fomi Prompt Crafting Guide:
            </div>
            <ul className="list-disc pl-4 space-y-1 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <li>
                <strong>Subject first:</strong> Anchor with the core item, material, and tactile details (e.g., &quot;matte raw stoneware bottle&quot;).
              </li>
              <li>
                <strong>Lighting & Atmosphere:</strong> Mention natural light direction, shadow softness, and time of day.
              </li>
              <li>
                <strong>Spatial framing:</strong> Specify camera lens, angle, and negative space (e.g., &quot;shallow depth of field, wide crop&quot;).
              </li>
            </ul>
          </div>
        )}

        {/* Multiline textarea */}
        <div className="relative">
          <label htmlFor="prompt-composer-input" className="sr-only">
            Image generation prompt
          </label>
          <textarea
            id="prompt-composer-input"
            rows={3}
            value={prompt}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Describe the image you want to create... (e.g. Editorial product photography of a handmade ceramic perfume bottle on a sculptural stone surface, soft daylight, elegant composition)"
            className="w-full text-sm sm:text-base p-3.5 sm:p-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/40 dark:bg-[#111317] text-neutral-900 dark:text-neutral-100 focus:bg-white dark:focus:bg-[#111317] focus:border-[#D95338] dark:focus:border-[#E26349] focus:ring-1 focus:ring-[#D95338] outline-none transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-500 resize-none font-normal leading-relaxed"
          />

          {validationError && (
            <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {validationError}
            </p>
          )}
        </div>

        {/* Selected Settings Summary Strip & Generation Trigger */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-neutral-100 dark:border-neutral-800/80">
          {/* Active Settings Summary Pills */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded">
              Ratio: {settings.aspectRatio}
            </span>
            <span className="text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded">
              Style: {settings.style}
            </span>
            <span className="text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded">
              Variations: {settings.variations}
            </span>
            <span className="text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded">
              Quality: {settings.quality.toUpperCase()}
            </span>

            {onToggleSettings && (
              <button
                type="button"
                onClick={onToggleSettings}
                className="text-[11px] text-[#D95338] hover:underline flex items-center gap-0.5 ml-1"
              >
                <Sliders className="w-3 h-3" />
                <span>Adjust</span>
              </button>
            )}
          </div>

          {/* Right side: Character count + Generate button */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0">
            <span className="text-xs text-neutral-400 font-mono tabular-nums">
              {prompt.length} chars
            </span>

            <button
              type="submit"
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-[#D95338] hover:bg-[#C2432B] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#D95338] shrink-0 min-h-[44px]"
              aria-label="Generate images"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Inspiration Chips */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">
              Quick Concept Starters
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_INSPIRATION_PROMPTS.map((insp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChangePrompt(insp);
                  setValidationError(null);
                }}
                className="shrink-0 text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 bg-neutral-100/70 dark:bg-neutral-800/60 hover:bg-neutral-200/80 dark:hover:bg-neutral-800 px-2.5 py-1 rounded-md transition-colors truncate max-w-[220px]"
                title={insp}
              >
                {insp.substring(0, 36)}...
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
