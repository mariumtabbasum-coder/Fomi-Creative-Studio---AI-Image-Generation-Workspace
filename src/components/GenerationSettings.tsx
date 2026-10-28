import React, { useState } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import {
  AspectRatio,
  GenerationSettings,
  QualityPreset,
  VariationCount,
  VisualStyle,
} from '../types';

interface GenerationSettingsProps {
  settings: GenerationSettings;
  onChangeSettings: (newSettings: GenerationSettings) => void;
  onResetSettings: () => void;
}

const ASPECT_RATIOS: Array<{ ratio: AspectRatio; label: string; iconClass: string }> = [
  { ratio: '1:1', label: 'Square (1:1)', iconClass: 'w-4 h-4' },
  { ratio: '4:3', label: 'Landscape (4:3)', iconClass: 'w-5 h-3.5' },
  { ratio: '3:4', label: 'Portrait (3:4)', iconClass: 'w-3.5 h-5' },
  { ratio: '16:9', label: 'Cinematic (16:9)', iconClass: 'w-6 h-3.5' },
  { ratio: '9:16', label: 'Story (9:16)', iconClass: 'w-3 h-5' },
];

const VARIATION_OPTIONS: VariationCount[] = [1, 2, 4, 8];

const VISUAL_STYLES: Array<{ style: VisualStyle; description: string }> = [
  { style: 'Editorial', description: 'Refined 35mm film tones with organic daylight' },
  { style: 'Photorealistic', description: 'Crisp commercial macro textures & lifelike clarity' },
  { style: 'Minimal', description: 'Clean negative space with Scandinavian architectural serenity' },
  { style: 'Cinematic', description: 'Dramatic chiaroscuro shadow play and atmospheric depth' },
  { style: 'Illustration', description: 'Tactile screenprint & botanical graphic linework' },
  { style: '3D', description: 'Matte tactile geometries & physical caustic glass refraction' },
];

const QUALITY_PRESETS: Array<{ preset: QualityPreset; label: string; note: string }> = [
  { preset: 'standard', label: 'Standard Draft', note: 'Fastest preview' },
  { preset: 'hd', label: 'Enhanced 2K HD', note: 'Balanced clarity' },
  { preset: 'ultra', label: 'Master 4K Detail', note: 'Maximum fidelity' },
];

export const GenerationSettingsPanel: React.FC<GenerationSettingsProps> = ({
  settings,
  onChangeSettings,
  onResetSettings,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateField = <K extends keyof GenerationSettings>(field: K, value: GenerationSettings[K]) => {
    onChangeSettings({
      ...settings,
      [field]: value,
    });
  };

  return (
    <div className="w-full bg-white dark:bg-[#15171C] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-4 sm:p-5 space-y-5 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#D95338]" />
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Generation Parameters
          </h2>
        </div>
        <button
          onClick={onResetSettings}
          className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1 transition-colors"
          title="Reset to default studio parameters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* 1. Aspect Ratio Control */}
      <div>
        <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
          Aspect Ratio
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {ASPECT_RATIOS.map((item, idx) => {
            const isSelected = settings.aspectRatio === item.ratio;
            const isLastOdd = idx === 4;
            return (
              <button
                key={item.ratio}
                type="button"
                onClick={() => updateField('aspectRatio', item.ratio)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                  isLastOdd ? 'col-span-2 sm:col-span-1' : ''
                } ${
                  isSelected
                    ? 'border-[#D95338] bg-[#FAF0ED]/60 dark:bg-[#2B1B18]/50 text-[#D95338] font-medium shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <div className="h-7 flex items-center justify-center mb-1">
                  <div
                    className={`border-2 rounded-xs transition-colors ${
                      isSelected
                        ? 'border-[#D95338] bg-[#D95338]/10'
                        : 'border-neutral-400 dark:border-neutral-600'
                    } ${item.iconClass}`}
                  />
                </div>
                <span className="text-xs font-mono">{item.ratio}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Visual Style Control */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            Aesthetic Style
          </label>
          <span className="text-[11px] text-neutral-400 font-mono">
            Selected: {settings.style}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {VISUAL_STYLES.map((item) => {
            const isSelected = settings.style === item.style;
            return (
              <button
                key={item.style}
                type="button"
                onClick={() => updateField('style', item.style)}
                className={`text-left p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#D95338] bg-[#FAF0ED]/50 dark:bg-[#2B1B18]/40 shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/30'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-semibold ${
                      isSelected ? 'text-[#D95338]' : 'text-neutral-900 dark:text-neutral-100'
                    }`}
                  >
                    {item.style}
                  </span>
                  {isSelected && <Sparkles className="w-3 h-3 text-[#D95338]" />}
                </div>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 leading-snug line-clamp-2">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Variations Count and Quality Preset Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Variations Selector */}
        <div>
          <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
            Variations Count
          </label>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl">
            {VARIATION_OPTIONS.map((num) => {
              const isSelected = settings.variations === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => updateField('variations', num)}
                  className={`py-1.5 text-xs font-mono rounded-lg transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-[#1A1D24] text-neutral-900 dark:text-neutral-100 font-semibold shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  {num} {num === 1 ? 'image' : 'images'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quality Preset */}
        <div>
          <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
            Detail Quality Preset
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl">
            {QUALITY_PRESETS.map((q) => {
              const isSelected = settings.quality === q.preset;
              return (
                <button
                  key={q.preset}
                  type="button"
                  onClick={() => updateField('quality', q.preset)}
                  className={`py-1.5 px-2 text-xs rounded-lg transition-all text-center ${
                    isSelected
                      ? 'bg-white dark:bg-[#1A1D24] text-neutral-900 dark:text-neutral-100 font-semibold shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                  title={q.note}
                >
                  <span className="block truncate">{q.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Collapsible Advanced Settings (Negative prompt, seed, guidance, steps) */}
      <div className="border-t border-neutral-100 dark:border-neutral-800/80 pt-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 py-1"
          aria-expanded={showAdvanced}
        >
          <span>Advanced Tuning & Negative Prompts</span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div className="mt-3 space-y-4 p-3 bg-neutral-50/70 dark:bg-neutral-900/40 rounded-xl border border-neutral-200 dark:border-neutral-800">
            {/* Negative Prompt */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Negative Prompt (Unwanted Artifacts)
              </label>
              <input
                type="text"
                value={settings.negativePrompt}
                onChange={(e) => updateField('negativePrompt', e.target.value)}
                placeholder="e.g. blur, oversaturated neon, distorted hands, watermark, low resolution"
                className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#181A1F] text-neutral-900 dark:text-neutral-100 outline-none focus:border-[#D95338]"
              />
            </div>

            {/* Slider: CFG Guidance Scale */}
            <div>
              <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                <span>Prompt Guidance (CFG Scale):</span>
                <span className="font-mono">{settings.guidanceScale}</span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                step="0.5"
                value={settings.guidanceScale}
                onChange={(e) => updateField('guidanceScale', parseFloat(e.target.value))}
                className="w-full accent-[#D95338]"
              />
            </div>

            {/* Steps & Seed */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Diffusion Steps ({settings.steps})
                </label>
                <input
                  type="number"
                  min="20"
                  max="60"
                  value={settings.steps}
                  onChange={(e) => updateField('steps', parseInt(e.target.value) || 30)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#181A1F] font-mono text-neutral-900 dark:text-neutral-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Seed (Optional)
                </label>
                <input
                  type="number"
                  value={settings.seed ?? ''}
                  onChange={(e) =>
                    updateField('seed', e.target.value ? parseInt(e.target.value) : null)
                  }
                  placeholder="Random"
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#181A1F] font-mono text-neutral-900 dark:text-neutral-100 outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
