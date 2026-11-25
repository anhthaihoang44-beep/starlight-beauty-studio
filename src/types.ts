export type Language = 'en' | 'vi';

export type ScreenMode = 'home' | 'salon' | 'photobooth' | 'gallery';

export type SalonCategory =
  | 'spa'
  | 'makeup'
  | 'eyes'
  | 'hair'
  | 'dress'
  | 'accessories'
  | 'stickers';

export type MakeupToolId =
  | 'lipstick'
  | 'eyeshadow'
  | 'blush'
  | 'highlighter'
  | 'eyeliner'
  | 'mascara'
  | 'remover';

export type SpaToolId = 'cleanser' | 'mask' | 'primer' | 'rinse';

export type LipFinish = 'matte' | 'glossy' | 'glitter';
export type EyeshadowFinish = 'matte' | 'shimmer';

export type ExpressionId = 'smile' | 'wink' | 'happy' | 'kissy' | 'starry';

export type EyelinerStyleId =
  | 'none'
  | 'classic'
  | 'puppy'
  | 'cat'
  | 'double-star'
  | 'glitter-wing';

export type MascaraStyleId =
  | 'natural'
  | 'curled'
  | 'butterfly'
  | 'starlight'
  | 'princess';

export type EyebrowStyleId = 'soft-arch' | 'sweet-straight' | 'glam-wing' | 'cute-round';

export type HairstyleId =
  | 'princess-waves'
  | 'space-buns'
  | 'twin-braids'
  | 'sweet-bob'
  | 'high-ponytail'
  | 'curly-puffs'
  | 'ribbon-halfup'
  | 'fairy-curls';

export type OutfitId =
  | 'princess-gown'
  | 'fairy-tulle'
  | 'pastel-sailor'
  | 'star-hoodie'
  | 'butterfly-dress'
  | 'royal-velvet'
  | 'mermaid-top'
  | 'blossom-kimono';

export type HeadwearId =
  | 'none'
  | 'crystal-tiara'
  | 'butterfly-clips'
  | 'cat-ears'
  | 'flower-crown'
  | 'velvet-bow'
  | 'star-halo'
  | 'pearl-band';

export type EarringId =
  | 'none'
  | 'pearl-drops'
  | 'star-studs'
  | 'heart-hoops'
  | 'crystal-drops'
  | 'sakura-drops'
  | 'butterfly-studs';

export type NecklaceId =
  | 'none'
  | 'pearl-choker'
  | 'heart-pendant'
  | 'star-gem'
  | 'ribbon-choker'
  | 'flower-garland'
  | 'royal-collar';

export type GlassesId =
  | 'none'
  | 'heart-shades'
  | 'star-glasses'
  | 'round-pastel'
  | 'cat-eye-glam';

export type WingsId =
  | 'none'
  | 'fairy-iridescent'
  | 'angel-feather'
  | 'butterfly-pink'
  | 'starlight-crystal';

export type StickerTypeId =
  | 'star-gem'
  | 'pink-heart'
  | 'crystal-drop'
  | 'butterfly'
  | 'rainbow'
  | 'sakura'
  | 'moon'
  | 'freckles'
  | 'pearls'
  | 'diamond'
  | 'candy-bow'
  | 'sparkle-dust';

export type BackgroundId =
  | 'vanity-pink'
  | 'sakura-garden'
  | 'starlight-palace'
  | 'rainbow-clouds'
  | 'butterfly-meadow'
  | 'royal-carpet';

export type FrameId =
  | 'none'
  | 'polaroid-cute'
  | 'royal-gold'
  | 'magazine-star'
  | 'sparkle-hearts';

export interface LocalizedText {
  en: string;
  vi: string;
}

export interface CharacterModel {
  id: string;
  name: string;
  title: LocalizedText;
  skinBase: string;
  skinLight: string;
  skinShadow: string;
  skinNeckShadow: string;
  earInner: string;
  naturalBlush: string;
  naturalLip: string;
  naturalLipShadow: string;
  defaultHairStyle: HairstyleId;
  defaultHairColorId: string;
  defaultEyeColorId: string;
  defaultBrowColor: string;
  defaultOutfitId: OutfitId;
  defaultOutfitColorId: string;
  accentColor: string;
}

export interface ColorSwatch {
  id: string;
  hex: string;
  secondary?: string;
  name: LocalizedText;
  isGradient?: boolean;
}

export interface HairColorOption {
  id: string;
  primary: string;
  highlight: string;
  shadow: string;
  streak?: string;
  name: LocalizedText;
}

export interface EyeLensOption {
  id: string;
  outer: string;
  inner: string;
  sparkle: string;
  name: LocalizedText;
}

export interface OutfitColorTheme {
  id: string;
  primary: string;
  secondary: string;
  trim: string;
  accent: string;
  name: LocalizedText;
}

export interface PlacedSticker {
  id: string;
  type: StickerTypeId;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface MakeoverState {
  characterId: string;
  // Spa
  spaGlow: boolean;
  spaMaskColor: string | null;
  // Eyes & Brows
  eyeColorId: string;
  eyebrowStyle: EyebrowStyleId;
  eyebrowColor: string;
  eyelinerStyle: EyelinerStyleId;
  eyelinerColor: string;
  eyelinerCoverage: number; // 0..1
  mascaraStyle: MascaraStyleId;
  mascaraColor: string;
  mascaraCoverage: number; // 0..1
  // Paint finish overlays
  lipFinish: LipFinish;
  eyeshadowFinish: EyeshadowFinish;
  hasLipPaint: boolean;
  hasEyeshadowPaint: boolean;
  hasBlushPaint: boolean;
  // Hair
  hairStyle: HairstyleId;
  hairColorId: string;
  hairHighlightEnabled: boolean;
  // Dress & Accessories
  outfitId: OutfitId;
  outfitColorId: string;
  headwearId: HeadwearId;
  earringId: EarringId;
  necklaceId: NecklaceId;
  glassesId: GlassesId;
  wingsId: WingsId;
  // Stickers
  stickers: PlacedSticker[];
  // Photo booth
  expression: ExpressionId;
  backgroundId: BackgroundId;
  frameId: FrameId;
}

export interface SavedPhoto {
  id: string;
  dataUrl: string;
  characterName: string;
  createdAt: number;
}
