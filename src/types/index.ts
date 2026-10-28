export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export type VisualStyle =
  | 'Photorealistic'
  | 'Editorial'
  | 'Illustration'
  | 'Minimal'
  | 'Cinematic'
  | '3D';

export type QualityPreset = 'standard' | 'hd' | 'ultra';

export type VariationCount = 1 | 2 | 4 | 8;

export interface GenerationSettings {
  aspectRatio: AspectRatio;
  variations: VariationCount;
  style: VisualStyle;
  quality: QualityPreset;
  negativePrompt: string;
  seed: number | null;
  guidanceScale: number;
  steps: number;
}

export interface ImageResult {
  id: string;
  prompt: string;
  enhancedPrompt?: string;
  recipeName?: string;
  imageUrl: string;
  aspectRatio: AspectRatio;
  style: VisualStyle;
  quality: QualityPreset;
  seed: number;
  createdAt: string;
  isFavorite: boolean;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface PromptRecipe {
  id: string;
  name: string;
  tagline: string;
  subject: string;
  environment: string;
  lighting: string;
  composition: string;
  style: VisualStyle;
  suggestedRatio: AspectRatio;
  sampleImageUrl: string;
}

export interface RecipeState {
  subject: string;
  environment: string;
  lighting: string;
  composition: string;
  style: VisualStyle | string;
}

export type WorkspaceTab = 'image-workspace' | 'content-workspace' | 'saved';

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}
