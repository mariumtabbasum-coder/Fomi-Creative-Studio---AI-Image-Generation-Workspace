import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  GenerationSettings,
  ImageResult,
  ToastNotification,
  VisualStyle,
  WorkspaceTab,
} from './types';
import { INITIAL_FEATURED_CREATIONS } from './data/mockAssets';
import {
  downloadImageResult,
  loadSavedCreations,
  saveCreationsToStorage,
  simulateImageGeneration,
} from './data/mockService';
import { useTheme } from './context/ThemeContext';
import { Header } from './components/Header';
import { PromptComposer } from './components/PromptComposer';
import { PromptRecipePanel } from './components/PromptRecipePanel';
import { GenerationSettingsPanel } from './components/GenerationSettings';
import { ResultsGallery } from './components/ResultsGallery';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { SavedCreationsView } from './components/SavedCreationsView';
import { PartAContentGenerator } from './components/PartAContentGenerator';
import { ShortcutsModal } from './components/ShortcutsModal';
import { ToastContainer } from './components/Toast';

const DEFAULT_SETTINGS: GenerationSettings = {
  aspectRatio: '1:1',
  variations: 4,
  style: 'Editorial',
  quality: 'hd',
  negativePrompt: '',
  seed: null,
  guidanceScale: 7.5,
  steps: 30,
};

const INITIAL_PROMPT =
  'Editorial product photography of a handmade ceramic perfume bottle on a sculptural stone surface, soft daylight, elegant composition, muted warm colours.';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('image-workspace');

  // Generation state
  const [prompt, setPrompt] = useState<string>(INITIAL_PROMPT);
  const [activeRecipeName, setActiveRecipeName] = useState<string | undefined>(
    'Editorial product photography'
  );
  const [settings, setSettings] = useState<GenerationSettings>(DEFAULT_SETTINGS);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStage, setGenerationStage] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Gallery results & saved creations
  const [results, setResults] = useState<ImageResult[]>(INITIAL_FEATURED_CREATIONS.slice(0, 4));
  const [savedCreations, setSavedCreations] = useState<ImageResult[]>([]);

  // Modals & Panels
  const [lightboxImage, setLightboxImage] = useState<ImageResult | null>(null);
  const [isRecipeOpen, setIsRecipeOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback(
    (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initialize saved creations from storage
  useEffect(() => {
    const saved = loadSavedCreations();
    setSavedCreations(saved);
  }, []);

  // Update storage when savedCreations changes
  const updateSavedCreations = (updated: ImageResult[]) => {
    setSavedCreations(updated);
    saveCreationsToStorage(updated);
  };

  // Synchronized counts
  const favoritesCount = useMemo(
    () => savedCreations.filter((c) => c.isFavorite).length,
    [savedCreations]
  );
  const totalSavedCount = savedCreations.length;

  // Listen to hash for router-like direct linking
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash === 'saved') {
        setActiveTab('saved');
      } else if (hash === 'content' || hash === 'content-workspace') {
        setActiveTab('content-workspace');
      } else if (hash === 'image-workspace' || hash === 'studio') {
        setActiveTab('image-workspace');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectTab = (tab: WorkspaceTab) => {
    setActiveTab(tab);
    window.location.hash = `/${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Trigger Image Generation
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      addToast('Please enter a prompt before generating.', 'warning');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationProgress(8);
    setGenerationStage('Parsing prompt & tokenizing recipe semantics...');

    try {
      const newOutputs = await simulateImageGeneration(
        prompt.trim(),
        settings,
        activeRecipeName,
        ({ stage, progress }) => {
          setGenerationStage(stage);
          setGenerationProgress(progress);
        }
      );

      setResults(newOutputs);

      // Prepend to saved/history creations with ID deduplication
      const combined = [
        ...newOutputs,
        ...savedCreations.filter((s) => !newOutputs.some((n) => n.id === s.id)),
      ];
      updateSavedCreations(combined);

      addToast(
        `Generated ${newOutputs.length} ${newOutputs.length === 1 ? 'concept' : 'concepts'} in ${settings.style} style!`,
        'success'
      );
    } catch (err) {
      setGenerationError(
        'An error occurred during image synthesis. Please retry with adjusted parameters.'
      );
      addToast('Image synthesis interrupted', 'error');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationStage('');
    }
  };

  // Insert prompt from Prompt Recipe builder
  const handleInsertPromptFromRecipe = (
    promptText: string,
    recipeName: string,
    recipeStyle?: VisualStyle
  ) => {
    setPrompt(promptText);
    setActiveRecipeName(recipeName);
    if (recipeStyle) {
      setSettings((prev) => ({ ...prev, style: recipeStyle }));
    }
    setIsRecipeOpen(false);
    addToast(`Loaded "${recipeName}" recipe into prompt composer`, 'info');
  };

  // Toggle favorite status
  const handleToggleFavorite = (imageId: string) => {
    let wasFavorited = false;

    // Update in results gallery
    setResults((prev) =>
      prev.map((item) => {
        if (item.id === imageId) {
          wasFavorited = !item.isFavorite;
          return { ...item, isFavorite: !item.isFavorite };
        }
        return item;
      })
    );

    // Update in saved creations
    let updatedSaved = savedCreations.map((item) => {
      if (item.id === imageId) {
        wasFavorited = !item.isFavorite;
        return { ...item, isFavorite: !item.isFavorite };
      }
      return item;
    });

    // If item was in results but not yet in savedCreations, add it
    const itemInResults = results.find((r) => r.id === imageId);
    if (itemInResults && !updatedSaved.some((s) => s.id === imageId)) {
      updatedSaved.unshift({ ...itemInResults, isFavorite: true });
      wasFavorited = true;
    }

    updateSavedCreations(updatedSaved);

    // Update lightbox if currently open
    if (lightboxImage && lightboxImage.id === imageId) {
      setLightboxImage((prev) => (prev ? { ...prev, isFavorite: wasFavorited } : null));
    }

    addToast(
      wasFavorited ? 'Saved concept to your Favorites' : 'Removed from Favorites',
      'info'
    );
  };

  // Download image
  const handleDownloadImage = async (image: ImageResult) => {
    addToast('Preparing high-resolution asset...', 'info');
    await downloadImageResult(image);
    addToast('Asset downloaded successfully!', 'success');
  };

  // Regenerate variation with slight seed drift
  const handleRegenerateVariation = (sourceImage: ImageResult) => {
    setPrompt(sourceImage.prompt);
    setActiveRecipeName(sourceImage.recipeName);
    setSettings((prev) => ({
      ...prev,
      style: sourceImage.style,
      aspectRatio: sourceImage.aspectRatio,
      quality: sourceImage.quality,
      seed: Math.floor(Math.random() * 900000 + 100000),
    }));
    addToast('Configured variation seed, regenerating...', 'info');
    setTimeout(() => {
      handleGenerate();
    }, 200);
  };

  // Copy prompt text
  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('Prompt copied to clipboard', 'success');
  };

  // Use prompt in composer from lightbox or history, restoring all settings
  const handleUsePromptInComposer = (
    source: ImageResult | { prompt: string; recipeName?: string }
  ) => {
    setPrompt(source.prompt);
    if ('recipeName' in source && source.recipeName) {
      setActiveRecipeName(source.recipeName);
    }
    if ('style' in source && source.style) {
      setSettings((prev) => ({
        ...prev,
        style: source.style,
        aspectRatio: source.aspectRatio,
        quality: source.quality,
        seed: source.seed,
      }));
    }
    setLightboxImage(null);
    setActiveTab('image-workspace');
    window.location.hash = '/image-workspace';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast('Restored prompt and studio parameters', 'success');
  };

  // Lightbox carousel navigation
  const currentLightboxIndex = useMemo(() => {
    if (!lightboxImage) return -1;
    return results.findIndex((r) => r.id === lightboxImage.id);
  }, [lightboxImage, results]);

  const handleNextLightbox = () => {
    if (currentLightboxIndex >= 0 && currentLightboxIndex < results.length - 1) {
      setLightboxImage(results[currentLightboxIndex + 1]);
    }
  };

  const handlePreviousLightbox = () => {
    if (currentLightboxIndex > 0) {
      setLightboxImage(results[currentLightboxIndex - 1]);
    }
  };

  // Clear demo data
  const handleResetDemoData = () => {
    try {
      localStorage.clear();
    } catch {}
    setSavedCreations(INITIAL_FEATURED_CREATIONS);
    setResults(INITIAL_FEATURED_CREATIONS.slice(0, 4));
    setPrompt(INITIAL_PROMPT);
    setActiveRecipeName('Editorial product photography');
    setSettings(DEFAULT_SETTINGS);
    addToast('Restored initial studio demo dataset', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#0F1115] text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* 1. Header Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        totalSavedCount={totalSavedCount}
        favoritesCount={favoritesCount}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onResetDemoData={handleResetDemoData}
      />

      {/* 2. Main Workspaces */}
      <main className="flex-1 w-full">
        {activeTab === 'image-workspace' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
            {/* Studio Workspace Title & Status */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-neutral-200/80 dark:border-neutral-800 pb-4">
              <div>
                <span className="text-[11px] font-mono tracking-wider uppercase text-[#D95338] font-semibold">
                  Part B · AI Image Workspace
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Fomi Creative Studio
                </h1>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Transform structured creative concepts into production-grade visual assets.
                </p>
              </div>

              {/* Honest Demo Engine Indicator */}
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="px-2 py-0.5 rounded-md bg-neutral-200/60 dark:bg-neutral-800 text-[11px] font-mono text-neutral-700 dark:text-neutral-300">
                  Curated Demo Dataset
                </span>
                <span>·</span>
                <span>Local Prototype Mode</span>
              </div>
            </div>

            {/* Prompt Recipe Studio (Original Feature) */}
            <PromptRecipePanel
              onInsertPrompt={handleInsertPromptFromRecipe}
              isOpen={isRecipeOpen}
              onToggleOpen={() => setIsRecipeOpen(!isRecipeOpen)}
            />

            {/* Studio 2-Column Split: Prompt + Settings on Left, Results on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Prompt Composer + Generation Parameters */}
              <div className="lg:col-span-5 space-y-5">
                <PromptComposer
                  prompt={prompt}
                  onChangePrompt={(val) => {
                    setPrompt(val);
                    if (activeRecipeName) setActiveRecipeName(undefined);
                  }}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  settings={settings}
                  activeRecipeName={activeRecipeName}
                />

                <GenerationSettingsPanel
                  settings={settings}
                  onChangeSettings={setSettings}
                  onResetSettings={() => {
                    setSettings(DEFAULT_SETTINGS);
                    addToast('Reset generation settings to defaults', 'info');
                  }}
                />
              </div>

              {/* Right Column: Results Canvas & Gallery */}
              <div className="lg:col-span-7">
                <ResultsGallery
                  results={results}
                  isGenerating={isGenerating}
                  generationStage={generationStage}
                  generationProgress={generationProgress}
                  generationError={generationError}
                  onRetry={handleGenerate}
                  onPreviewImage={(img) => setLightboxImage(img)}
                  onToggleFavorite={handleToggleFavorite}
                  onDownloadImage={handleDownloadImage}
                  onRegenerateVariation={handleRegenerateVariation}
                  onCopyPrompt={handleCopyPrompt}
                  onStartNew={() => {
                    setPrompt('');
                    setActiveRecipeName(undefined);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. Saved Creations View */}
        {activeTab === 'saved' && (
          <SavedCreationsView
            creations={savedCreations}
            onToggleFavorite={handleToggleFavorite}
            onPreviewImage={(img) => setLightboxImage(img)}
            onDownloadImage={handleDownloadImage}
            onUsePrompt={handleUsePromptInComposer}
            onClearAll={() => {
              updateSavedCreations([]);
              addToast('Cleared saved creations history', 'info');
            }}
            onNavigateToStudio={() => handleSelectTab('image-workspace')}
          />
        )}

        {/* 4. Preserved Part A Workspace */}
        {activeTab === 'content-workspace' && (
          <PartAContentGenerator
            onNavigateToPartB={() => handleSelectTab('image-workspace')}
            onShowToast={addToast}
          />
        )}
      </main>

      {/* 5. Minimalist Accessible Studio Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-[#FAF7F2] dark:bg-[#0F1115] mt-auto py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              Fomi Creative Studio
            </span>
            <span>·</span>
            <span>Assessment Submission</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button
              onClick={() => handleSelectTab('image-workspace')}
              className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
            >
              Image Studio (Part B)
            </button>
            <button
              onClick={() => handleSelectTab('saved')}
              className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
            >
              Saved Works ({totalSavedCount})
            </button>
            <button
              onClick={() => handleSelectTab('content-workspace')}
              className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
            >
              Part A Content Generator
            </button>
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
            >
              Shortcuts (⌘/)
            </button>
          </div>
        </div>
      </footer>

      {/* 6. Lightbox Preview Modal */}
      <ImageLightboxModal
        image={lightboxImage}
        onClose={() => setLightboxImage(null)}
        onToggleFavorite={handleToggleFavorite}
        onDownload={handleDownloadImage}
        onCopyPrompt={handleCopyPrompt}
        onUsePromptInComposer={handleUsePromptInComposer}
        onNext={handleNextLightbox}
        onPrevious={handlePreviousLightbox}
        hasNext={currentLightboxIndex < results.length - 1}
        hasPrevious={currentLightboxIndex > 0}
      />

      {/* 7. Keyboard Shortcuts Dialog */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* 8. Toast Feedback Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
