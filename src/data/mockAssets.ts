import { ImageResult } from '../types';

export const ASSET_MAP = {
  perfume: '/src/assets/images/editorial_perfume_ceramic_1793196865766.jpg',
  interiorChair: '/src/assets/images/minimal_lifestyle_chair_1793196866312.jpg',
  cinematicPortrait: '/src/assets/images/cinematic_portrait_light_1793196868031.jpg',
  botanicalStillLife: '/src/assets/images/artistic_still_life_botanical_1793196866570.jpg',
  botanicalPoster: '/src/assets/images/illustration_botanical_poster_1793196883359.jpg',
  glassSculpture3D: '/src/assets/images/render_3d_glass_sculpture_1793196882874.jpg',
};

export const INITIAL_FEATURED_CREATIONS: ImageResult[] = [
  {
    id: 'fomi-init-1',
    prompt:
      'Editorial product photography of a handmade ceramic perfume bottle on a sculptural travertine stone surface, soft warm morning daylight, elegant minimal composition, organic linen fabric folds, muted warm earth tones, shallow depth of field, 8k luxury commercial aesthetic.',
    recipeName: 'Editorial product photography',
    imageUrl: ASSET_MAP.perfume,
    aspectRatio: '1:1',
    style: 'Editorial',
    quality: 'ultra',
    seed: 489201,
    createdAt: '2026-10-28T06:30:00Z',
    isFavorite: true,
    dimensions: { width: 1024, height: 1024 },
  },
  {
    id: 'fomi-init-2',
    prompt:
      'Minimalist Scandinavian interior design, oak lounge chair next to a large sunlit arched window, soft cast shadows, dried pampas grass in a matte clay vase, warm ivory concrete floor, architectural photography.',
    recipeName: 'Minimal lifestyle campaign',
    imageUrl: ASSET_MAP.interiorChair,
    aspectRatio: '4:3',
    style: 'Minimal',
    quality: 'hd',
    seed: 712940,
    createdAt: '2026-10-28T06:45:00Z',
    isFavorite: true,
    dimensions: { width: 1024, height: 768 },
  },
  {
    id: 'fomi-init-3',
    prompt:
      'Cinematic editorial portrait of a creative director in natural window chiaroscuro lighting, subtle warm film grain, relaxed natural pose, deep charcoal turtleneck, minimalist studio aesthetic, Leica 35mm tone.',
    recipeName: 'Cinematic portrait',
    imageUrl: ASSET_MAP.cinematicPortrait,
    aspectRatio: '3:4',
    style: 'Cinematic',
    quality: 'hd',
    seed: 395812,
    createdAt: '2026-10-28T07:05:00Z',
    isFavorite: false,
    dimensions: { width: 768, height: 1024 },
  },
  {
    id: 'fomi-init-4',
    prompt:
      'Artistic modern still life composition featuring glass carafes, sliced blood oranges, and architectural olive branches on a warm terracotta and sandstone pedestal, painterly natural light, high-end design publication aesthetic.',
    recipeName: 'Artistic still life',
    imageUrl: ASSET_MAP.botanicalStillLife,
    aspectRatio: '16:9',
    style: 'Editorial',
    quality: 'ultra',
    seed: 884729,
    createdAt: '2026-10-28T07:10:00Z',
    isFavorite: true,
    dimensions: { width: 1280, height: 720 },
  },
  {
    id: 'fomi-init-5',
    prompt:
      'Clean graphic art botanical illustration of Mediterranean lemon and olive branch, warm minimalist screenprint aesthetic, matte textured paper background, muted terracotta and sage green colors, refined art print.',
    recipeName: 'Mediterranean botanicals',
    imageUrl: ASSET_MAP.botanicalPoster,
    aspectRatio: '3:4',
    style: 'Illustration',
    quality: 'hd',
    seed: 219504,
    createdAt: '2026-10-28T07:12:00Z',
    isFavorite: false,
    dimensions: { width: 768, height: 1024 },
  },
  {
    id: 'fomi-init-6',
    prompt:
      'Abstract geometric glass and terracotta sculpture on floating frosted pedestal, caustic refraction, minimal studio lighting, muted sand background, elegant modern 3d art.',
    recipeName: 'Glass & terracotta form',
    imageUrl: ASSET_MAP.glassSculpture3D,
    aspectRatio: '1:1',
    style: '3D',
    quality: 'ultra',
    seed: 650123,
    createdAt: '2026-10-28T07:13:00Z',
    isFavorite: false,
    dimensions: { width: 1024, height: 1024 },
  },
];
