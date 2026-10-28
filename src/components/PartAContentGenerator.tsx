import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  AlertCircle,
  Clock,
  Layers,
  Edit3,
} from 'lucide-react';

interface PartAProps {
  onNavigateToPartB: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const TEMPLATES = [
  {
    id: 'product-desc',
    label: 'Luxury Product Story',
    prompt:
      'Write an editorial product description for a handmade artisanal ceramic perfume bottle crafted with speckled stoneware and brass stopper.',
    tone: 'Editorial & Elegant',
  },
  {
    id: 'social-campaign',
    label: 'Brand Launch Campaign',
    prompt:
      'Create a launch caption for a sustainable Scandinavian design studio introducing an architectural oak lounge chair.',
    tone: 'Punchy & Minimal',
  },
  {
    id: 'newsletter',
    label: 'Design Journal Essay',
    prompt:
      'Draft an engaging essay on the return to tactile natural materials and organic minimalism in modern creative workspaces.',
    tone: 'Warm & Conversational',
  },
];

const TONES = [
  'Editorial & Elegant',
  'Punchy & Minimal',
  'Professional & Clear',
  'Warm & Conversational',
];

export const PartAContentGenerator: React.FC<PartAProps> = ({
  onNavigateToPartB,
  onShowToast,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('product-desc');
  const [promptText, setPromptText] = useState(TEMPLATES[0].prompt);
  const [selectedTone, setSelectedTone] = useState(TONES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>(
    `FLEUR D'AURA — EAU DE PARFUM\n\nSculpted from raw speckled stoneware and sealed with a hand-turned brass stopper, Fleur d’Aura embodies the poetry of natural textures. Formulated in Grasse using sun-cured Mediterranean botanicals, notes of fresh bergamot and crushed olive branch give way to warm cedar and aged ambergris.\n\nA tactile celebration of slow craft designed to rest effortlessly upon travertine and limestone surfaces.`
  );
  const [copied, setCopied] = useState(false);

  // Safe template switching: doesn't overwrite if user edited the brief unless they confirm
  const handleSelectTemplate = (item: (typeof TEMPLATES)[0]) => {
    setSelectedTemplate(item.id);
    setSelectedTone(item.tone);
    setValidationError(null);

    // If current prompt matches any template prompt or is empty, update it freely
    const isUnmodified = TEMPLATES.some((t) => t.prompt === promptText) || !promptText.trim();
    if (isUnmodified) {
      setPromptText(item.prompt);
    } else {
      // User customized their brief; keep their text and notify them
      onShowToast(`Switched template to "${item.label}". Custom brief preserved.`, 'info');
    }
  };

  const handleApplyTemplateBrief = () => {
    const tmpl = TEMPLATES.find((t) => t.id === selectedTemplate);
    if (tmpl) {
      setPromptText(tmpl.prompt);
      onShowToast(`Applied suggested brief for "${tmpl.label}".`, 'info');
    }
  };

  const handleGenerate = () => {
    const trimmed = promptText.trim();
    if (!trimmed) {
      setValidationError('Please provide a brief or instructions before generating content.');
      return;
    }
    setValidationError(null);
    setIsGenerating(true);

    setTimeout(() => {
      let output = '';
      const lower = trimmed.toLowerCase();

      // Content generation variation matrix based on template, tone, and brief
      if (selectedTemplate === 'product-desc' || lower.includes('perfume') || lower.includes('bottle')) {
        if (selectedTone === 'Punchy & Minimal') {
          output = `FLEUR D'AURA — RAW STONEWARE PARFUM\n\nPure material honesty. Hand-turned speckled ceramic meets aged brass. Sun-drenched bergamot, crushed olive leaves, smoky cedarwood.\n\nForm. Texture. Presence.\nAvailable in limited editions of 250 units.`;
        } else if (selectedTone === 'Professional & Clear') {
          output = `FLEUR D'AURA: SPECIFICATIONS & ARTISANAL PROFILE\n\nOverview:\nFleur d’Aura is an artisanal unisex fragrance packaged in handcrafted speckled ceramic vessels manufactured in small studio batches. \n\nOlfactory Notes:\n- Top: Calabrian Bergamot, Crushed Olive Leaves\n- Heart: Wild Jasmine, Sun-Cured Neroli\n- Base: Atlas Cedarwood, Mineral Ambergris\n\nPackaging & Sustainability:\nEach 50ml flacon features non-porous glazed ceramic with a precision-machined solid brass seal, designed for perpetual reuse.`;
        } else if (selectedTone === 'Warm & Conversational') {
          output = `MEET FLEUR D'AURA: BORN FROM RAW CLAY AND MEDITERRANEAN MORNINGS\n\nWe wanted to build a fragrance that feels like picking up a warm stone from the garden. Fleur d’Aura comes in a tactile speckled stoneware bottle that feels grounding in your hand, topped with a real brass stopper.\n\nInside, you'll discover bright Mediterranean citrus layered over wild olive branches and grounding cedarwood. It’s quiet, intimate, and effortlessly memorable.`;
        } else {
          // Editorial & Elegant
          output = `FLEUR D'AURA — EAU DE PARFUM\n\nSculpted from raw speckled stoneware and sealed with a hand-turned brass stopper, Fleur d’Aura embodies the poetry of natural textures. Formulated in Grasse using sun-cured Mediterranean botanicals, notes of fresh bergamot and crushed olive branch give way to warm cedar and aged ambergris.\n\nA tactile celebration of slow craft designed to rest effortlessly upon travertine and limestone surfaces.`;
        }
      } else if (selectedTemplate === 'social-campaign' || lower.includes('chair') || lower.includes('furniture')) {
        if (selectedTone === 'Punchy & Minimal') {
          output = `THE ARCHE LOUNGE CHAIR.\n\nSolid Scandinavian oak. Unbleached heavyweight canvas. Zero excess.\n\nCrafted for calm spaces.\nExplore the collection at fomi.studio/arche.`;
        } else if (selectedTone === 'Warm & Conversational') {
          output = `TAKE A SEAT: INTRODUCING THE ARCHE CHAIR\n\nWhen we sat down to sketch the Arche Chair, we asked ourselves one simple question: What does true domestic quiet feel like?\n\nHand-finished in solid white oak with a durable canvas sling that softens with age, it's the chair you retreat to when morning sunlight floods the living room. Welcome home.`;
        } else {
          // Editorial or Professional
          output = `THE ARCHE LOUNGE CHAIR\n\nCrafted from solid Scandinavian white oak and natural unbleached canvas, the Arche Lounge Chair marries architectural precision with deep domestic comfort. Its sweeping curved silhouette invites contemplative stillness, pairing seamlessly with concrete floors, warm linen throws, and soft morning daylight.\n\nDesigned for spaces where silence is the greatest luxury.`;
        }
      } else if (selectedTemplate === 'newsletter' || lower.includes('essay') || lower.includes('journal')) {
        if (selectedTone === 'Punchy & Minimal') {
          output = `TACTILE ESSENTIALS / ISSUE 04\n\nScreen fatigue is real. Our answer: stone, linen, raw timber, and unpolished clay.\n\nTangible objects demand attention. Attention fosters deep work.\n\nEdit your surroundings. Deepen your output.`;
        } else {
          output = `ON TACTILE QUIETUDE: REDEFINING THE WORKSPACE\n\nIn an era dominated by smooth glass screens and synthetic perfection, our creative instincts crave the friction of honest materials. Raw travertine, hand-glazed pottery, and textured paper remind us that creativity is grounded in tangible sensations.\n\nWhen we curate tools that honor materials, our thinking deepens.`;
        }
      } else {
        // Custom prompt handling
        output = `EDITORIAL DRAFT — ${selectedTone.toUpperCase()}\n\n${trimmed}\n\nKey Concepts:\n• Narrative Tone: ${selectedTone}\n• Context: Crafted for high-impact brand communications and editorial placement.\n• Quality Manifest: Structured with balanced pacing, intentional paragraph cadence, and scannable thematic clarity.`;
      }

      setGeneratedContent(output);
      setIsGenerating(false);
      onShowToast('Content synthesized successfully!');
    }, 600);
  };

  const handleCopy = () => {
    if (!generatedContent.trim()) return;
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    onShowToast('Copied content to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearEditor = () => {
    setGeneratedContent('');
    onShowToast('Cleared output editor');
  };

  const wordCount = generatedContent.trim() ? generatedContent.trim().split(/\s+/).length : 0;
  const readingTimeMinutes = Math.ceil(wordCount / 180);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Banner introducing Part A and linking to Part B */}
      <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#15171C] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              Assessment Part A
            </span>
            <h1 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Fomi AI Content Generation Workspace
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Copywriting and editorial studio for marketing stories, launch campaigns, and brand essays.
          </p>
        </div>

        <button
          onClick={onNavigateToPartB}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#D95338] text-white text-xs font-medium hover:bg-[#C2432B] flex items-center justify-center gap-2 transition-colors shadow-sm shrink-0"
        >
          <span>Switch to Part B (Image Studio)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Templates, Brand Tone & Prompt Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#15171C] space-y-4 shadow-xs">
            {/* Template Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Content Templates
                </label>
                <button
                  type="button"
                  onClick={handleApplyTemplateBrief}
                  className="text-[11px] text-[#D95338] hover:underline"
                >
                  Reset to Suggested Brief
                </button>
              </div>

              <div className="space-y-1.5">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      selectedTemplate === tmpl.id
                        ? 'border-[#D95338] bg-[#FAF0ED]/60 dark:bg-[#2B1B18]/50 text-[#D95338] font-medium shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300 bg-neutral-50/40 dark:bg-neutral-900/30'
                    }`}
                  >
                    <div className="font-medium text-neutral-900 dark:text-neutral-100">
                      {tmpl.label}
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                      {tmpl.prompt}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Tone Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Brand Tone
                </label>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {selectedTone}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {TONES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTone(t)}
                    className={`py-2 px-2.5 text-xs rounded-lg border transition-all text-center truncate ${
                      selectedTone === t
                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 font-medium shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white/70 dark:bg-neutral-900/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div>
              <label
                htmlFor="part-a-prompt-input"
                className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5"
              >
                Brief & Instructions
              </label>
              <textarea
                id="part-a-prompt-input"
                rows={4}
                value={promptText}
                onChange={(e) => {
                  setPromptText(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="Enter prompt instructions for your copy..."
                className="w-full text-xs p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-[#111317] text-neutral-900 dark:text-neutral-100 focus:border-[#D95338] outline-none resize-none leading-relaxed"
              />
              {validationError && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{validationError}</span>
                </p>
              )}
            </div>

            {/* Generate Trigger */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-[#D95338] text-white text-xs font-medium hover:bg-[#C2432B] disabled:opacity-50 flex items-center justify-center gap-2 transition-colors shadow-sm min-h-[44px]"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Copy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Content</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Content Output Canvas & Live Editor */}
        <div className="lg:col-span-7">
          <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#15171C] space-y-4 shadow-xs min-h-[460px] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#D95338]" />
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    Output Editor & Draft Canvas
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {generatedContent ? (
                    <span className="text-neutral-400 font-mono text-[11px]">
                      {wordCount} words · ~{readingTimeMinutes} min read
                    </span>
                  ) : null}
                  <button
                    onClick={handleCopy}
                    disabled={!generatedContent.trim()}
                    className="p-1.5 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors disabled:opacity-40 min-h-[34px]"
                    title="Copy generated text"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {generatedContent ? (
                <textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  placeholder="Generated copy will appear here..."
                  aria-label="Generated copy editor"
                  className="w-full h-80 max-h-[500px] text-sm p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-[#111317] text-neutral-900 dark:text-neutral-100 focus:border-[#D95338] outline-none font-serif leading-relaxed resize-none overflow-y-auto"
                />
              ) : (
                /* Polished Empty State for Editor */
                <div className="h-80 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-neutral-50/30 dark:bg-neutral-900/20">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF0ED] dark:bg-[#2B1B18] text-[#D95338] flex items-center justify-center">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      Editor Canvas is Empty
                    </h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs">
                      Adjust your brief and tone on the left, then click Generate Content to draft your copy.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="px-3 py-1.5 rounded-lg border border-[#D95338] text-[#D95338] hover:bg-[#FAF0ED] dark:hover:bg-[#2B1B18] text-xs font-medium transition-colors"
                  >
                    Generate from Current Brief
                  </button>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500">
              <span>Ready for campaign landing pages and marketing channels</span>
              {generatedContent && (
                <button
                  type="button"
                  onClick={handleClearEditor}
                  className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                >
                  Clear Editor
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
