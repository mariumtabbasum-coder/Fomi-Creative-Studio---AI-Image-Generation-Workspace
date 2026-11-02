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
 * Resolves legacy, unbundled, or cached image URLs (e.g. from previous localStorage entries)
 * to valid bundled production asset URLs.
 */
export function normalizeImageUrl(rawUrl?: string): string {
  if (!rawUrl) return ASSET_MAP.perfume;

  // Preserve valid base64 data URLs or Blob URLs
  if (rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) {
    return rawUrl;
  }

  // Handle legacy /src/assets/images or mismatched file names from previous deployments
  if (rawUrl.includes('editorial_perfume') || rawUrl.includes('perfume')) {
    return ASSET_MAP.perfume;
  }
  if (rawUrl.includes('minimal_lifestyle') || rawUrl.includes('chair')) {
    return ASSET_MAP.interiorChair;
  }
  if (rawUrl.includes('cinematic_portrait') || rawUrl.includes('portrait')) {
    return ASSET_MAP.cinematicPortrait;
  }
  if (rawUrl.includes('still_life_botanical') || rawUrl.includes('botanicalStillLife')) {
    return ASSET_MAP.botanicalStillLife;
  }
  if (rawUrl.includes('botanical_poster') || rawUrl.includes('illustration') || rawUrl.includes('poster')) {
    return ASSET_MAP.botanicalPoster;
  }
  if (rawUrl.includes('glass_sculpture') || rawUrl.includes('render_3d') || rawUrl.includes('3D')) {
    return ASSET_MAP.glassSculpture3D;
  }

  return rawUrl;
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
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Normalize any stale or unbundled image paths from prior local storage
      return parsed.map((item) => ({
        ...item,
        imageUrl: normalizeImageUrl(item.imageUrl),
      }));
    }
    return INITIAL_FEATURED_CREATIONS;
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
 * Downloads an image cleanly across environments (production assets, base64 data, cross-origin)
 */
export async function downloadImageResult(image: ImageResult): Promise<boolean> {
  const resolvedUrl = normalizeImageUrl(image.imageUrl);
  const fileName = `fomi-studio-${image.id}-${image.aspectRatio.replace(':', 'x')}.jpg`;

  // 1. Data URLs or Blob URLs can be downloaded directly
  if (resolvedUrl.startsWith('data:') || resolvedUrl.startsWith('blob:')) {
    const link = document.createElement('a');
    link.href = resolvedUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }

  // 2. Fetch with blob conversion (validates mime-type isn't index.html)
  try {
    const response = await fetch(resolvedUrl);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      throw new Error('Received HTML instead of image');
    }
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    return true;
  } catch (e) {
    console.warn('Blob fetch download failed, falling back to canvas/direct export:', e);

    // 3. Fallback: Draw to an offscreen image & canvas to generate a clean JPEG download
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Image failed to load for canvas export'));
        img.src = resolvedUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || image.dimensions.width;
      canvas.height = img.naturalHeight || image.dimensions.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
      }
    } catch (canvasErr) {
      console.warn('Canvas export failed, falling back to direct anchor:', canvasErr);
    }

    // 4. Final fallback direct link trigger
    const link = document.createElement('a');
    link.href = resolvedUrl;
    link.download = fileName;
    link.target = '_blank';
    link.rel = 'noreferrer noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }
}

