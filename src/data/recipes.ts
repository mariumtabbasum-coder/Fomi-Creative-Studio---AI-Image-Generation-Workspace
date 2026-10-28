import { PromptRecipe, RecipeState, VisualStyle } from '../types';
import { ASSET_MAP } from './mockAssets';

export interface FieldSuggestions {
  label: string;
  field: keyof RecipeState;
  suggestions: string[];
}

export const RECIPE_SUGGESTIONS: FieldSuggestions[] = [
  {
    label: 'Subject',
    field: 'subject',
    suggestions: [
      'Handmade ceramic perfume bottle with raw clay texture',
      'Minimalist oak lounge chair with soft linen throw',
      'Creative director with thoughtful expression in black turtleneck',
      'Fluted glass carafes and fresh sliced blood oranges',
      'Artisanal stoneware coffee dripper with delicate steam',
      'Architectural botanical olive and eucalyptus branch in stone vessel',
    ],
  },
  {
    label: 'Environment / Background',
    field: 'environment',
    suggestions: [
      'On a sculptural travertine stone pedestal with linen drapes',
      'Sunlit Parisian loft with arched black-frame windows',
      'Minimalist concrete brutalist gallery interior',
      'Warm terracotta tiled kitchen counter beside raw plaster wall',
      'Neutral warm sand background with soft gradient shadows',
      'Nordic pine workshop bathed in diffused morning light',
    ],
  },
  {
    label: 'Lighting',
    field: 'lighting',
    suggestions: [
      'Soft diffused morning daylight filtering through linen',
      'Dramatic chiaroscuro window lighting with deep natural shadows',
      'Clean high-key studio side-light with subtle rim glow',
      'Golden hour warm backlighting with soft lens haze',
      'Overhead diffused skylight with gentle caustic reflections',
      'Atmospheric muted overcast daylight',
    ],
  },
  {
    label: 'Composition',
    field: 'composition',
    suggestions: [
      'Close-up macro focus with shallow depth of field',
      'Centered symmetrical editorial layout with generous negative space',
      'Dynamic low-angle wide shot capturing architectural depth',
      'Rule of thirds balanced still life arrangement',
      'Straight-on eye-level portrait with intimate crop',
      'Subtle 45-degree elevated perspective on geometric plinth',
    ],
  },
  {
    label: 'Visual Style',
    field: 'style',
    suggestions: [
      'Editorial 35mm photography with natural warm grain',
      'Minimalist luxury campaign aesthetic',
      'Cinematic documentary portrait tone',
      'Clean graphic botanical screenprint illustration',
      'Hyper-detailed photorealistic commercial render',
      'Matte 3D clay and frosted glass tactile render',
    ],
  },
];

export const EXAMPLE_RECIPES: PromptRecipe[] = [
  {
    id: 'recipe-editorial-product',
    name: 'Editorial product photography',
    tagline: 'High-end commercial still life with tactile organic textures and soft sunlight',
    subject: 'Handmade ceramic perfume bottle with textured speckled glaze and brass stopper',
    environment: 'Sculptural travertine stone surface with folded raw linen fabric',
    lighting: 'Soft warm morning daylight with gentle side shadows',
    composition: 'Centered hero crop with shallow depth of field and generous negative space',
    style: 'Editorial',
    suggestedRatio: '1:1',
    sampleImageUrl: ASSET_MAP.perfume,
  },
  {
    id: 'recipe-minimal-lifestyle',
    name: 'Minimal lifestyle campaign',
    tagline: 'Architectural interior spaces with calm Scandinavian simplicity',
    subject: 'Solid oak lounge chair with natural canvas sling and woven wool cushion',
    environment: 'Sunlit loft beside large black arched window overlooking greenery',
    lighting: 'Soft cast window shadows with warm morning sunlight sweeping across floor',
    composition: 'Eye-level architectural three-quarter view showing room context',
    style: 'Minimal',
    suggestedRatio: '4:3',
    sampleImageUrl: ASSET_MAP.interiorChair,
  },
  {
    id: 'recipe-cinematic-portrait',
    name: 'Cinematic portrait',
    tagline: 'Authentic personality study with dramatic chiaroscuro window light',
    subject: 'Creative studio director with calm contemplative gaze in charcoal knitwear',
    environment: 'Urban industrial loft studio with steel mullion windows and soft-focus easel',
    lighting: 'Dramatic natural chiaroscuro light with subtle warm film grain',
    composition: 'Medium portrait crop, rule of thirds, intimate focal distance',
    style: 'Cinematic',
    suggestedRatio: '3:4',
    sampleImageUrl: ASSET_MAP.cinematicPortrait,
  },
  {
    id: 'recipe-artistic-still-life',
    name: 'Artistic still life',
    tagline: 'Painterly Mediterranean arrangement of glass, fruits, and organic foliage',
    subject: 'Fluted glass decanters, sliced blood oranges, and freshly picked olive branches',
    environment: 'Terracotta brick ledge against aged Tuscan limewash wall',
    lighting: 'Warm late-afternoon natural illumination with glowing glass refractions',
    composition: 'Wide panoramic still life arrangement with layered foreground and background',
    style: 'Editorial',
    suggestedRatio: '16:9',
    sampleImageUrl: ASSET_MAP.botanicalStillLife,
  },
];

/**
 * Combines structured recipe fields into a natural, cohesive prompt string
 */
export function buildPromptFromRecipe(recipe: RecipeState): string {
  const parts: string[] = [];

  if (recipe.subject.trim()) {
    parts.push(recipe.subject.trim());
  }
  if (recipe.environment.trim()) {
    parts.push(recipe.environment.trim());
  }
  if (recipe.lighting.trim()) {
    parts.push(recipe.lighting.trim());
  }
  if (recipe.composition.trim()) {
    parts.push(recipe.composition.trim());
  }
  if (recipe.style.trim()) {
    parts.push(recipe.style.trim());
  }

  return parts.join(', ');
}
