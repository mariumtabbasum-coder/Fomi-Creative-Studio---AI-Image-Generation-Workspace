import { AspectRatio, GenerationSettings, ImageResult, VisualStyle } from '../types';
import { ASSET_MAP, INITIAL_FEATURED_CREATIONS } from './mockAssets';

const ASSET_POOL: Array<{ url: string; defaultStyle: VisualStyle; defaultRatio: AspectRatio }> = [
  { url: ASSET_MAP.perfume, defaultStyle: 'Editorial', defaultRatio: '1:1' },
  { url: ASSET_MAP.interiorChair, defaultStyle: 'Minimal', defaultRatio: '4:3' },
  { url: ASSET_MAP.cinematicPortrait, defaultStyle: 'Cinematic', defaultRatio: '3:4' },
  { url: ASSET_MAP.botanicalStillLife, defaultStyle: 'Editorial', defaultRatio: '16:9' },
  { url: ASSET_MAP.botanicalPoster, defaultStyle: 'Illustration', defaultRatio: '3:4' },
  { url: ASSET_MAP.glassSculpture3D, defaultStyle: '3D', defaultRatio: '1:1' },
];

export function getDimensionsForRatio(ratio: AspectRatio): { width: number; height: number } {
  switch (ratio) {
    case '1:1':
      return { width: 1024, height: 1024 };
    case '3:4':
      return { width: 768, height: 1024 };
    case '4:3':
      return { width: 1024, height: 768 };
    case '9:16':
      return { width: 576, height: 1024 };
    case '16:9':
      return { width: 1280, height: 720 };
    default:
      return { width: 1024, height: 1024 };
  }
}

export interface GenerationProgressCallback {
  (step: { stage: string; progress: number }): void;
}

/**
 * Simulates an image generation workflow with realistic progress steps
 */
export async function simulateImageGeneration(
  prompt: string,
  settings: GenerationSettings,
  recipeName?: string,
  onProgress?: GenerationProgressCallback
): Promise<ImageResult[]> {
  const steps = [
    { stage: 'Parsing prompt & tokenizing recipe semantics...', progress: 18 },
    { stage: `Configuring ${settings.style} diffusion latents (${settings.steps} steps)...`, progress: 42 },
    { stage: `Synthesizing ${settings.aspectRatio} spatial grid & lighting...`, progress: 74 },
    { stage: `Applying ${settings.quality.toUpperCase()} detail refinement & color grading...`, progress: 95 },
  ];

  for (const step of steps) {
    if (onProgress) {
      onProgress(step);
    }
    await new Promise((resolve) => setTimeout(resolve, 380));
  }

  const count = settings.variations;
  const results: ImageResult[] = [];
  const baseSeed = settings.seed || Math.floor(Math.random() * 900000 + 100000);
  const dims = getDimensionsForRatio(settings.aspectRatio);

  // Style priority matching
  const matchingAssets = ASSET_POOL.filter((a) => a.defaultStyle === settings.style);
  const pool = matchingAssets.length > 0 ? [...matchingAssets, ...ASSET_POOL] : ASSET_POOL;

  for (let i = 0; i < count; i++) {
    const assetChoice = pool[i % pool.length];
    const itemSeed = baseSeed + i * 47;

    results.push({
      id: `gen-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      prompt,
      recipeName,
      imageUrl: assetChoice.url,
      aspectRatio: settings.aspectRatio,
      style: settings.style,
      quality: settings.quality,
      seed: itemSeed,
      createdAt: new Date().toISOString(),
      isFavorite: false,
      dimensions: dims,
    });
  }

  return results;
}

/**
 * Safe local storage manager with error handling & fallbacks
 */
const STORAGE_KEYS = {
  CREATIONS: 'fomi_saved_creations',
  HISTORY: 'fomi_generation_history',
  SETTINGS: 'fomi_user_settings',
  THEME: 'fomi_theme_mode',
};

export function loadSavedCreations(): ImageResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CREATIONS);
    if (!raw) return INITIAL_FEATURED_CREATIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_FEATURED_CREATIONS;
  } catch (err) {
    console.warn('Could not read saved creations from localStorage:', err);
    return INITIAL_FEATURED_CREATIONS;
  }
}

export function saveCreationsToStorage(items: ImageResult[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CREATIONS, JSON.stringify(items));
  } catch (err) {
    console.warn('Could not persist creations to localStorage:', err);
  }
}

export function loadThemePreference(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // fallback to light
  }
  return 'light';
}

export function saveThemePreference(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch {
    // ignore
  }
}

/**
 * Downloads an image cleanly without third-party popups
 */
export async function downloadImageResult(image: ImageResult): Promise<void> {
  try {
    const response = await fetch(image.imageUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `fomi-studio-${image.id}-${image.aspectRatio.replace(':', 'x')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (e) {
    // Fallback direct link trigger
    const link = document.createElement('a');
    link.href = image.imageUrl;
    link.download = `fomi-studio-${image.id}.jpg`;
    link.target = '_blank';
    link.rel = 'noreferrer noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
