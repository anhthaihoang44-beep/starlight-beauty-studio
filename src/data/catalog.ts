import type {
  BackgroundId,
  CharacterModel,
  ColorSwatch,
  EarringId,
  EyebrowStyleId,
  EyelinerStyleId,
  EyeLensOption,
  ExpressionId,
  FrameId,
  GlassesId,
  HairColorOption,
  HairstyleId,
  HeadwearId,
  LocalizedText,
  MakeoverState,
  MascaraStyleId,
  NecklaceId,
  OutfitColorTheme,
  OutfitId,
  StickerTypeId,
  WingsId
} from '../types';

export const CHARACTERS: CharacterModel[] = [
  {
    id: 'mina',
    name: 'Mina',
    title: { en: 'Rose Princess', vi: 'Công Chúa Hoa Hồng' },
    skinBase: '#FFE2D1',
    skinLight: '#FFF1E8',
    skinShadow: '#F2BEA4',
    skinNeckShadow: '#E5AA8E',
    earInner: '#F6BBA2',
    naturalBlush: '#FF9EB5',
    naturalLip: '#F1889B',
    naturalLipShadow: '#D4667D',
    defaultHairStyle: 'princess-waves',
    defaultHairColorId: 'honey-blonde',
    defaultEyeColorId: 'sapphire',
    defaultBrowColor: '#8B5E3C',
    defaultOutfitId: 'princess-gown',
    defaultOutfitColorId: 'rose-pink',
    accentColor: '#FF6BB5'
  },
  {
    id: 'linh',
    name: 'Linh',
    title: { en: 'Sakura Dreamer', vi: 'Nàng Thơ Hoa Đào' },
    skinBase: '#F9D6BC',
    skinLight: '#FFE9D8',
    skinShadow: '#E4B18E',
    skinNeckShadow: '#D49E7B',
    earInner: '#EBB08D',
    naturalBlush: '#FF96A5',
    naturalLip: '#E97D8F',
    naturalLipShadow: '#C75E72',
    defaultHairStyle: 'twin-braids',
    defaultHairColorId: 'midnight-ink',
    defaultEyeColorId: 'warm-hazel',
    defaultBrowColor: '#3C2A24',
    defaultOutfitId: 'blossom-kimono',
    defaultOutfitColorId: 'lavender-dream',
    accentColor: '#A855F7'
  },
  {
    id: 'chloe',
    name: 'Chloe',
    title: { en: 'Sunny Popstar', vi: 'Ngôi Sao Nắng Mai' },
    skinBase: '#EAC09E',
    skinLight: '#F7D8BD',
    skinShadow: '#CE9B76',
    skinNeckShadow: '#BE8964',
    earInner: '#D69E7B',
    naturalBlush: '#F38B82',
    naturalLip: '#D8727D',
    naturalLipShadow: '#B45360',
    defaultHairStyle: 'high-ponytail',
    defaultHairColorId: 'caramel-chestnut',
    defaultEyeColorId: 'emerald',
    defaultBrowColor: '#5B3A26',
    defaultOutfitId: 'star-hoodie',
    defaultOutfitColorId: 'sky-candy',
    accentColor: '#38BDF8'
  },
  {
    id: 'zara',
    name: 'Zara',
    title: { en: 'Starlight Fairy', vi: 'Tiên Nữ Ánh Sao' },
    skinBase: '#CC9169',
    skinLight: '#E0AC87',
    skinShadow: '#AC6F48',
    skinNeckShadow: '#9B5F3A',
    earInner: '#B47652',
    naturalBlush: '#E06E7B',
    naturalLip: '#B95E6D',
    naturalLipShadow: '#944352',
    defaultHairStyle: 'space-buns',
    defaultHairColorId: 'cotton-pink',
    defaultEyeColorId: 'amethyst',
    defaultBrowColor: '#4A2C22',
    defaultOutfitId: 'fairy-tulle',
    defaultOutfitColorId: 'mint-fairy',
    accentColor: '#2DD4BF'
  },
  {
    id: 'amara',
    name: 'Amara',
    title: { en: 'Royal Velvet', vi: 'Nữ Hoàng Ngọc Trai' },
    skinBase: '#9A6344',
    skinLight: '#B47C5B',
    skinShadow: '#7A492E',
    skinNeckShadow: '#6A3D24',
    earInner: '#824E34',
    naturalBlush: '#C85E70',
    naturalLip: '#9E4B5A',
    naturalLipShadow: '#793240',
    defaultHairStyle: 'curly-puffs',
    defaultHairColorId: 'espresso-noir',
    defaultEyeColorId: 'golden-honey',
    defaultBrowColor: '#2C1B15',
    defaultOutfitId: 'royal-velvet',
    defaultOutfitColorId: 'royal-gold',
    accentColor: '#F59E0B'
  },
  {
    id: 'yuki',
    name: 'Yuki',
    title: { en: 'Crystal Angel', vi: 'Thiên Thần Pha Lê' },
    skinBase: '#FFECE4',
    skinLight: '#FFF7F4',
    skinShadow: '#F0CBBD',
    skinNeckShadow: '#E3B8A8',
    earInner: '#F4C4B7',
    naturalBlush: '#FFA3BE',
    naturalLip: '#F290A8',
    naturalLipShadow: '#D16C86',
    defaultHairStyle: 'sweet-bob',
    defaultHairColorId: 'lavender-frost',
    defaultEyeColorId: 'sky-aqua',
    defaultBrowColor: '#7C6A8C',
    defaultOutfitId: 'pastel-sailor',
    defaultOutfitColorId: 'berry-pop',
    accentColor: '#EC4899'
  }
];

export const LIPSTICK_SWATCHES: ColorSwatch[] = [
  { id: 'bubblegum', hex: '#FF69B4', name: { en: 'Bubblegum Pink', vi: 'Hồng Kẹo Bông' } },
  { id: 'ruby-kiss', hex: '#E11D48', name: { en: 'Ruby Princess', vi: 'Đỏ Hồng Ngọc' } },
  { id: 'rose-petal', hex: '#F472B6', name: { en: 'Rose Petal', vi: 'Cánh Hoa Hồng' } },
  { id: 'peach-sorbet', hex: '#FB7185', name: { en: 'Peach Sorbet', vi: 'Cam Đào Ngọt' } },
  { id: 'coral-sun', hex: '#FF6B57', name: { en: 'Coral Crush', vi: 'San Hô Rực Rỡ' } },
  { id: 'cherry-pop', hex: '#BE123C', name: { en: 'Cherry Pop', vi: 'Đỏ Anh Đào' } },
  { id: 'berry-jam', hex: '#9D174D', name: { en: 'Berry Jam', vi: 'Mứt Dâu Rừng' } },
  { id: 'nude-cream', hex: '#E89B93', name: { en: 'Sweet Nude', vi: 'Hồng Đất Nhẹ' } },
  { id: 'cotton-candy', hex: '#FF9AD5', name: { en: 'Cotton Candy', vi: 'Hồng Phấn Baby' } },
  { id: 'lilac-dream', hex: '#C084FC', name: { en: 'Lilac Fairy', vi: 'Tím Oải Hương' } },
  { id: 'plum-magic', hex: '#7E22CE', name: { en: 'Plum Magic', vi: 'Tím Mận Huyền Bí' } },
  { id: 'hot-magenta', hex: '#DB2777', name: { en: 'Popstar Pink', vi: 'Hồng Ngôi Sao' } },
  { id: 'tangerine', hex: '#F97316', name: { en: 'Tangerine Pop', vi: 'Cam Tươi Mọng' } },
  { id: 'mermaid-aqua', hex: '#06B6D4', name: { en: 'Mermaid Aqua', vi: 'Xanh Nàng Tiên Cá' } },
  { id: 'starlight-blue', hex: '#6366F1', name: { en: 'Galaxy Blue', vi: 'Xanh Ngân Hà' } },
  { id: 'golden-honey', hex: '#F59E0B', name: { en: 'Golden Shimmer', vi: 'Vàng Ánh Kim' } }
];

export const EYESHADOW_SWATCHES: ColorSwatch[] = [
  { id: 'pastel-pink', hex: '#FF8AC6', name: { en: 'Sakura Pink', vi: 'Hồng Anh Đào' } },
  { id: 'lavender', hex: '#C084FC', name: { en: 'Dreamy Lilac', vi: 'Tím Mộng Mơ' } },
  { id: 'sky-blue', hex: '#38BDF8', name: { en: 'Sky Fairy', vi: 'Xanh Thiên Thanh' } },
  { id: 'mint-sparkle', hex: '#34D399', name: { en: 'Mint Dew', vi: 'Xanh Bạc Hà' } },
  { id: 'peach-glow', hex: '#FDA4AF', name: { en: 'Peach Glow', vi: 'Cam Đào Nhẹ' } },
  { id: 'sunshine-gold', hex: '#FBBF24', name: { en: 'Sunshine Gold', vi: 'Vàng Nắng Mai' } },
  { id: 'rose-gold', hex: '#F48FB1', name: { en: 'Rose Gold', vi: 'Vàng Hồng' } },
  { id: 'violet-star', hex: '#8B5CF6', name: { en: 'Starlight Violet', vi: 'Tím Ánh Sao' } },
  { id: 'ocean-teal', hex: '#14B8A6', name: { en: 'Mermaid Teal', vi: 'Xanh Ngọc Bích' } },
  { id: 'berry-velvet', hex: '#EC4899', name: { en: 'Berry Sparkle', vi: 'Hồng Dâu Nhũ' } },
  { id: 'champagne', hex: '#FDE68A', name: { en: 'Champagne Pearl', vi: 'Ngọc Trai Sáng' } },
  { id: 'warm-cocoa', hex: '#B47657', name: { en: 'Soft Cocoa', vi: 'Nâu Cacao Dịu' } },
  { id: 'cobalt-night', hex: '#3B82F6', name: { en: 'Royal Sapphire', vi: 'Xanh Hoàng Gia' } },
  { id: 'sunset-coral', hex: '#FB923C', name: { en: 'Sunset Orange', vi: 'Cam Hoàng Hôn' } },
  { id: 'emerald-gem', hex: '#10B981', name: { en: 'Emerald Gem', vi: 'Xanh Lục Bảo' } },
  { id: 'frost-silver', hex: '#CBD5E1', name: { en: 'Ice Crystal', vi: 'Bạc Pha Lê' } }
];

export const BLUSH_SWATCHES: ColorSwatch[] = [
  { id: 'baby-pink', hex: '#FF85B3', name: { en: 'Baby Rose', vi: 'Hồng Phấn Baby' } },
  { id: 'peach-bloom', hex: '#FF9E80', name: { en: 'Peach Bloom', vi: 'Cam Đào Dịu' } },
  { id: 'strawberry', hex: '#FF5C8D', name: { en: 'Strawberry Kiss', vi: 'Hồng Dâu Tây' } },
  { id: 'coral-bliss', hex: '#FF7A6B', name: { en: 'Coral Bliss', vi: 'San Hô Ngọt' } },
  { id: 'soft-apricot', hex: '#FFB37B', name: { en: 'Apricot Glow', vi: 'Mơ Chín Ấm' } },
  { id: 'berry-flush', hex: '#E15A87', name: { en: 'Berry Flush', vi: 'Hồng Quả Mọng' } },
  { id: 'pastel-lilac', hex: '#D8A3FF', name: { en: 'Fairy Lilac', vi: 'Tím Phấn Tiên' } },
  { id: 'rosewood', hex: '#DC758F', name: { en: 'Warm Rose', vi: 'Hồng Đất Dịu' } }
];

export const HIGHLIGHTER_SWATCHES: ColorSwatch[] = [
  { id: 'pearl-white', hex: '#FFFBEB', name: { en: 'Pearl Glow', vi: 'Ngọc Trai Trắng' } },
  { id: 'pink-opal', hex: '#FFE4F3', name: { en: 'Pink Opal', vi: 'Ánh Hồng Ngọc' } },
  { id: 'gold-dust', hex: '#FEF08A', name: { en: 'Starlight Gold', vi: 'Nhũ Vàng Sao' } },
  { id: 'unicorn-blue', hex: '#BAE6FD', name: { en: 'Unicorn Ice', vi: 'Ánh Xanh Kỳ Lân' } },
  { id: 'lilac-prism', hex: '#F3E8FF', name: { en: 'Lilac Prism', vi: 'Ánh Tím Cầu Vồng' } }
];

export const EYELINER_STYLES: { id: EyelinerStyleId; name: LocalizedText }[] = [
  { id: 'none', name: { en: 'None', vi: 'Không' } },
  { id: 'classic', name: { en: 'Classic Wing', vi: 'Cánh Mỏng' } },
  { id: 'puppy', name: { en: 'Cute Puppy', vi: 'Mắt Cún Dễ Thương' } },
  { id: 'cat', name: { en: 'Cat Glam', vi: 'Mắt Mèo Sắc Sảo' } },
  { id: 'double-star', name: { en: 'Star Wing', vi: 'Cánh Ngôi Sao' } },
  { id: 'glitter-wing', name: { en: 'Glitter Flick', vi: 'Nhũ Lấp Lánh' } }
];

export const EYELINER_COLORS: ColorSwatch[] = [
  { id: 'jet-black', hex: '#1E1B2E', name: { en: 'Jet Black', vi: 'Đen Tuyền' } },
  { id: 'choco', hex: '#5C3A2E', name: { en: 'Warm Cocoa', vi: 'Nâu Sôcôla' } },
  { id: 'royal-purple', hex: '#7C3AED', name: { en: 'Royal Violet', vi: 'Tím Hoàng Gia' } },
  { id: 'hot-pink', hex: '#EC4899', name: { en: 'Candy Pink', vi: 'Hồng Kẹo Ngọt' } },
  { id: 'ocean-blue', hex: '#0284C7', name: { en: 'Ocean Blue', vi: 'Xanh Đại Dương' } },
  { id: 'emerald', hex: '#059669', name: { en: 'Emerald', vi: 'Xanh Ngọc' } },
  { id: 'star-gold', hex: '#F59E0B', name: { en: 'Star Gold', vi: 'Vàng Ánh Kim' } },
  { id: 'snow-white', hex: '#FFFFFF', name: { en: 'Pearl White', vi: 'Trắng Ngọc Trai' } }
];

export const MASCARA_STYLES: { id: MascaraStyleId; name: LocalizedText }[] = [
  { id: 'natural', name: { en: 'Natural', vi: 'Tự Nhiên' } },
  { id: 'curled', name: { en: 'Doll Curl', vi: 'Cong Búp Bê' } },
  { id: 'butterfly', name: { en: 'Butterfly', vi: 'Cánh Bướm' } },
  { id: 'starlight', name: { en: 'Starlight', vi: 'Dài Ánh Sao' } },
  { id: 'princess', name: { en: 'Princess Full', vi: 'Mi Công Chúa' } }
];

export const MASCARA_COLORS: ColorSwatch[] = [
  { id: 'black', hex: '#1E1B2E', name: { en: 'Midnight Black', vi: 'Đen Huyền' } },
  { id: 'brown', hex: '#5A382C', name: { en: 'Soft Espresso', vi: 'Nâu Tự Nhiên' } },
  { id: 'plum', hex: '#7E22CE', name: { en: 'Berry Plum', vi: 'Tím Mộng Mơ' } },
  { id: 'sapphire', hex: '#2563EB', name: { en: 'Sapphire', vi: 'Xanh Biển' } },
  { id: 'pink', hex: '#DB2777', name: { en: 'Fairy Pink', vi: 'Hồng Tiên Nữ' } },
  { id: 'teal', hex: '#0D9488', name: { en: 'Mermaid Teal', vi: 'Xanh Ngọc' } }
];

export const EYE_LENSES: EyeLensOption[] = [
  { id: 'sapphire', outer: '#1D4ED8', inner: '#60A5FA', sparkle: '#DBEAFE', name: { en: 'Ocean Sapphire', vi: 'Xanh Sapphire' } },
  { id: 'warm-hazel', outer: '#6B3E26', inner: '#C48A54', sparkle: '#FEF3C7', name: { en: 'Warm Hazel', vi: 'Nâu Hạt Dẻ' } },
  { id: 'emerald', outer: '#047857', inner: '#34D399', sparkle: '#D1FAE5', name: { en: 'Forest Emerald', vi: 'Xanh Lục Bảo' } },
  { id: 'amethyst', outer: '#6D28D9', inner: '#C084FC', sparkle: '#F3E8FF', name: { en: 'Amethyst Dream', vi: 'Tím Thạch Anh' } },
  { id: 'rose-quartz', outer: '#BE185D', inner: '#F472B6', sparkle: '#FCE7F3', name: { en: 'Rose Quartz', vi: 'Hồng Pha Lê' } },
  { id: 'golden-honey', outer: '#92400E', inner: '#FBBF24', sparkle: '#FEF9C3', name: { en: 'Golden Honey', vi: 'Mật Ong Vàng' } },
  { id: 'sky-aqua', outer: '#0369A1', inner: '#38BDF8', sparkle: '#E0F2FE', name: { en: 'Sky Aqua', vi: 'Xanh Ngọc Bầu Trời' } },
  { id: 'galaxy-star', outer: '#312E81', inner: '#A855F7', sparkle: '#FDE047', name: { en: 'Galaxy Star', vi: 'Ngân Hà Lấp Lánh' } },
  { id: 'midnight-ink', outer: '#1E293B', inner: '#64748B', sparkle: '#F8FAFC', name: { en: 'Velvet Noir', vi: 'Đen Huyền Bí' } },
  { id: 'mint-crystal', outer: '#0F766E', inner: '#5EEAD4', sparkle: '#CCFBF1', name: { en: 'Mint Crystal', vi: 'Bạc Hà Pha Lê' } }
];

export const EYEBROW_STYLES: { id: EyebrowStyleId; name: LocalizedText }[] = [
  { id: 'soft-arch', name: { en: 'Soft Arch', vi: 'Cong Dịu Dàng' } },
  { id: 'sweet-straight', name: { en: 'Sweet Straight', vi: 'Ngang Dễ Thương' } },
  { id: 'glam-wing', name: { en: 'Glam Arch', vi: 'Vòng Cung Quý Phái' } },
  { id: 'cute-round', name: { en: 'Cute Round', vi: 'Tròn Trẻ Trung' } }
];

export const EYEBROW_COLORS: ColorSwatch[] = [
  { id: 'eb-black', hex: '#2B2129', name: { en: 'Soft Black', vi: 'Đen Mềm' } },
  { id: 'eb-darkbrown', hex: '#4E342E', name: { en: 'Dark Brown', vi: 'Nâu Đậm' } },
  { id: 'eb-chestnut', hex: '#795548', name: { en: 'Chestnut', vi: 'Nâu Hạt Dẻ' } },
  { id: 'eb-honey', hex: '#A67C52', name: { en: 'Honey Blonde', vi: 'Vàng Mật' } },
  { id: 'eb-auburn', hex: '#9A4B3C', name: { en: 'Auburn', vi: 'Nâu Đỏ' } },
  { id: 'eb-pink', hex: '#C0568A', name: { en: 'Rose Tint', vi: 'Hồng Phấn' } },
  { id: 'eb-lavender', hex: '#7C62A6', name: { en: 'Lilac Tint', vi: 'Tím Oải Hương' } }
];

export const HAIRSTYLES: { id: HairstyleId; name: LocalizedText }[] = [
  { id: 'princess-waves', name: { en: 'Princess Waves', vi: 'Sóng Công Chúa' } },
  { id: 'space-buns', name: { en: 'Twin Space Buns', vi: 'Búi Đôi Tinh Nghịch' } },
  { id: 'twin-braids', name: { en: 'Sweet Braids', vi: 'Bím Tóc Hai Bên' } },
  { id: 'sweet-bob', name: { en: 'Cute Bob', vi: 'Tóc Ngắn Dễ Thương' } },
  { id: 'high-ponytail', name: { en: 'Star Ponytail', vi: 'Đuôi Ngựa Năng Động' } },
  { id: 'curly-puffs', name: { en: 'Cloud Puffs', vi: 'Tóc Xoăn Bồng Bềnh' } },
  { id: 'ribbon-halfup', name: { en: 'Half-Up Princess', vi: 'Buộc Nửa Dịu Dàng' } },
  { id: 'fairy-curls', name: { en: 'Fairy Curls', vi: 'Xoăn Tiên Nữ' } }
];

export const HAIR_COLORS: HairColorOption[] = [
  { id: 'honey-blonde', primary: '#F3C669', highlight: '#FFE8A3', shadow: '#C68B33', streak: '#FF9AD5', name: { en: 'Honey Blonde', vi: 'Vàng Mật Ong' } },
  { id: 'midnight-ink', primary: '#2B2940', highlight: '#525075', shadow: '#161424', streak: '#A855F7', name: { en: 'Midnight Black', vi: 'Đen Huyền Bí' } },
  { id: 'caramel-chestnut', primary: '#8C5233', highlight: '#BA7A52', shadow: '#5B311B', streak: '#FBBF24', name: { en: 'Caramel Brown', vi: 'Nâu Hạt Dẻ' } },
  { id: 'espresso-noir', primary: '#3A241E', highlight: '#634138', shadow: '#20120F', streak: '#F59E0B', name: { en: 'Espresso', vi: 'Nâu Cà Phê' } },
  { id: 'strawberry-ginger', primary: '#D96B43', highlight: '#F89B73', shadow: '#9E4222', streak: '#FDE68A', name: { en: 'Sunset Ginger', vi: 'Cam Hoàng Hôn' } },
  { id: 'cotton-pink', primary: '#FF8AC6', highlight: '#FFC4E4', shadow: '#D14F93', streak: '#7DD3FC', name: { en: 'Cotton Candy', vi: 'Hồng Kẹo Bông' } },
  { id: 'lavender-frost', primary: '#B794F6', highlight: '#E1D1FF', shadow: '#7F56C9', streak: '#F9A8D4', name: { en: 'Lavender Dream', vi: 'Tím Oải Hương' } },
  { id: 'sky-mermaid', primary: '#38BDF8', highlight: '#93E4FF', shadow: '#0284C7', streak: '#C4B5FD', name: { en: 'Mermaid Sky', vi: 'Xanh Nàng Tiên Cá' } },
  { id: 'mint-fairy', primary: '#34D399', highlight: '#8CF4CB', shadow: '#059669', streak: '#FEF08A', name: { en: 'Mint Fairy', vi: 'Xanh Bạc Hà' } },
  { id: 'ruby-berry', primary: '#E11D64', highlight: '#FF6B9E', shadow: '#9B1144', streak: '#FDE047', name: { en: 'Berry Rose', vi: 'Đỏ Dâu Rực Rỡ' } },
  { id: 'galaxy-violet', primary: '#6D28D9', highlight: '#A78BFA', shadow: '#431691', streak: '#38BDF8', name: { en: 'Galaxy Violet', vi: 'Tím Ngân Hà' } },
  { id: 'snow-silver', primary: '#E2E8F0', highlight: '#FFFFFF', shadow: '#94A3B8', streak: '#F472B6', name: { en: 'Crystal Silver', vi: 'Bạch Kim Pha Lê' } },
  { id: 'peach-blossom', primary: '#FF9E8A', highlight: '#FFD0C4', shadow: '#D46652', streak: '#FDE68A', name: { en: 'Peach Blossom', vi: 'Hồng Đào Pastel' } },
  { id: 'rainbow-magic', primary: '#FF7AC6', highlight: '#FDE047', shadow: '#8B5CF6', streak: '#38BDF8', name: { en: 'Rainbow Sorbet', vi: 'Cầu Vồng Kỳ Diệu' } }
];

export const OUTFITS: { id: OutfitId; name: LocalizedText }[] = [
  { id: 'princess-gown', name: { en: 'Princess Gown', vi: 'Váy Công Chúa' } },
  { id: 'fairy-tulle', name: { en: 'Fairy Tulle', vi: 'Đầm Tiên Nữ' } },
  { id: 'pastel-sailor', name: { en: 'Sailor Bow', vi: 'Áo Thủy Thủ Nơ' } },
  { id: 'star-hoodie', name: { en: 'Starlight Hoodie', vi: 'Áo Hoodie Sao' } },
  { id: 'butterfly-dress', name: { en: 'Butterfly Ribbon', vi: 'Đầm Nơ Cánh Bướm' } },
  { id: 'royal-velvet', name: { en: 'Royal Velvet', vi: 'Váy Nhung Hoàng Gia' } },
  { id: 'mermaid-top', name: { en: 'Mermaid Shimmer', vi: 'Áo Nàng Tiên Cá' } },
  { id: 'blossom-kimono', name: { en: 'Sakura Robe', vi: 'Áo Hoa Anh Đào' } }
];

export const OUTFIT_COLORS: OutfitColorTheme[] = [
  { id: 'rose-pink', primary: '#FF7EB6', secondary: '#FFB8D9', trim: '#FFF5F9', accent: '#E11D74', name: { en: 'Rose Princess', vi: 'Hồng Công Chúa' } },
  { id: 'lavender-dream', primary: '#A78BFA', secondary: '#DDD6FE', trim: '#FAF5FF', accent: '#7C3AED', name: { en: 'Lavender', vi: 'Tím Oải Hương' } },
  { id: 'sky-candy', primary: '#38BDF8', secondary: '#BAE6FD', trim: '#F0F9FF', accent: '#0284C7', name: { en: 'Sky Blue', vi: 'Xanh Thiên Thanh' } },
  { id: 'mint-fairy', primary: '#34D399', secondary: '#A7F3D0', trim: '#ECFDF5', accent: '#059669', name: { en: 'Mint Fairy', vi: 'Xanh Bạc Hà' } },
  { id: 'royal-gold', primary: '#F59E0B', secondary: '#FDE68A', trim: '#FFFBEB', accent: '#B45309', name: { en: 'Royal Gold', vi: 'Vàng Hoàng Gia' } },
  { id: 'berry-pop', primary: '#F43F5E', secondary: '#FDA4AF', trim: '#FFF1F2', accent: '#BE123C', name: { en: 'Ruby Berry', vi: 'Đỏ Hồng Ngọc' } },
  { id: 'peach-cream', primary: '#FB923C', secondary: '#FED7AA', trim: '#FFF7ED', accent: '#EA580C', name: { en: 'Peach Cream', vi: 'Cam Kem Ngọt' } },
  { id: 'midnight-star', primary: '#4F46E5', secondary: '#A5B4FC', trim: '#FEF08A', accent: '#312E81', name: { en: 'Starlight Navy', vi: 'Xanh Đêm Sao' } }
];

export const HEADWEAR_ITEMS: { id: HeadwearId; name: LocalizedText }[] = [
  { id: 'none', name: { en: 'None', vi: 'Không' } },
  { id: 'crystal-tiara', name: { en: 'Crystal Tiara', vi: 'Vương Miện Pha Lê' } },
  { id: 'flower-crown', name: { en: 'Flower Crown', vi: 'Vòng Hoa Tiên' } },
  { id: 'cat-ears', name: { en: 'Sparkle Cat Ears', vi: 'Tai Mèo Lấp Lánh' } },
  { id: 'velvet-bow', name: { en: 'Princess Bow', vi: 'Nơ Công Chúa' } },
  { id: 'butterfly-clips', name: { en: 'Butterfly Clips', vi: 'Kẹp Bướm Xinh' } },
  { id: 'star-halo', name: { en: 'Starlight Halo', vi: 'Vòng Hào Quang Sao' } },
  { id: 'pearl-band', name: { en: 'Pearl Headband', vi: 'Bờm Ngọc Trai' } }
];

export const EARRING_ITEMS: { id: EarringId; name: LocalizedText }[] = [
  { id: 'none', name: { en: 'None', vi: 'Không' } },
  { id: 'pearl-drops', name: { en: 'Pearl Drops', vi: 'Ngọc Trai Giọt' } },
  { id: 'star-studs', name: { en: 'Star Studs', vi: 'Ngôi Sao Vàng' } },
  { id: 'heart-hoops', name: { en: 'Pink Hearts', vi: 'Trái Tim Hồng' } },
  { id: 'crystal-drops', name: { en: 'Crystal Gems', vi: 'Pha Lê Lung Linh' } },
  { id: 'sakura-drops', name: { en: 'Sakura Petals', vi: 'Hoa Anh Đào' } },
  { id: 'butterfly-studs', name: { en: 'Butterflies', vi: 'Bướm Pastel' } }
];

export const NECKLACE_ITEMS: { id: NecklaceId; name: LocalizedText }[] = [
  { id: 'none', name: { en: 'None', vi: 'Không' } },
  { id: 'pearl-choker', name: { en: 'Pearl Choker', vi: 'Vòng Ngọc Trai' } },
  { id: 'heart-pendant', name: { en: 'Heart Locket', vi: 'Mặt Trái Tim' } },
  { id: 'star-gem', name: { en: 'Starlight Gem', vi: 'Đá Ngôi Sao' } },
  { id: 'ribbon-choker', name: { en: 'Velvet Ribbon', vi: 'Ruy Băng Nơ' } },
  { id: 'flower-garland', name: { en: 'Blossom Chain', vi: 'Dây Hoa Nhỏ' } },
  { id: 'royal-collar', name: { en: 'Royal Jewels', vi: 'Vòng Cổ Hoàng Gia' } }
];

export const GLASSES_ITEMS: { id: GlassesId; name: LocalizedText }[] = [
  { id: 'none', name: { en: 'None', vi: 'Không' } },
  { id: 'heart-shades', name: { en: 'Heart Shades', vi: 'Kính Trái Tim' } },
  { id: 'star-glasses', name: { en: 'Star Pop', vi: 'Kính Ngôi Sao' } },
  { id: 'round-pastel', name: { en: 'Cute Round', vi: 'Kính Tròn Xinh' } },
  { id: 'cat-eye-glam', name: { en: 'Cat-Eye Glam', vi: 'Kính Mắt Mèo' } }
];

export const WINGS_ITEMS: { id: WingsId; name: LocalizedText }[] = [
  { id: 'none', name: { en: 'None', vi: 'Không' } },
  { id: 'fairy-iridescent', name: { en: 'Fairy Glow', vi: 'Cánh Tiên Lấp Lánh' } },
  { id: 'angel-feather', name: { en: 'Angel Feathers', vi: 'Cánh Thiên Thần' } },
  { id: 'butterfly-pink', name: { en: 'Pink Butterfly', vi: 'Cánh Bướm Hồng' } },
  { id: 'starlight-crystal', name: { en: 'Crystal Star', vi: 'Cánh Pha Lê Sao' } }
];

export const STICKER_ITEMS: { id: StickerTypeId; name: LocalizedText }[] = [
  { id: 'star-gem', name: { en: 'Star Gem', vi: 'Đá Ngôi Sao' } },
  { id: 'pink-heart', name: { en: 'Cute Heart', vi: 'Trái Tim Hồng' } },
  { id: 'crystal-drop', name: { en: 'Crystal Dew', vi: 'Giọt Pha Lê' } },
  { id: 'butterfly', name: { en: 'Mini Butterfly', vi: 'Bướm Nhỏ' } },
  { id: 'rainbow', name: { en: 'Tiny Rainbow', vi: 'Cầu Vồng Bé' } },
  { id: 'sakura', name: { en: 'Sakura', vi: 'Hoa Anh Đào' } },
  { id: 'moon', name: { en: 'Crescent Moon', vi: 'Trăng Lưỡi Liềm' } },
  { id: 'freckles', name: { en: 'Star Freckles', vi: 'Tàn Nhang Sao' } },
  { id: 'pearls', name: { en: 'Pearl Dots', vi: 'Hạt Ngọc Trai' } },
  { id: 'diamond', name: { en: 'Diamond', vi: 'Kim Cương' } },
  { id: 'candy-bow', name: { en: 'Mini Bow', vi: 'Nơ Xinh' } },
  { id: 'sparkle-dust', name: { en: 'Glitter Trio', vi: 'Bụi Kim Tuyến' } }
];

export const BACKGROUNDS: { id: BackgroundId; name: LocalizedText; preview: string }[] = [
  { id: 'vanity-pink', name: { en: 'Dreamy Vanity', vi: 'Gương Trang Điểm' }, preview: 'linear-gradient(135deg, #FFE4F2, #F5D0FE)' },
  { id: 'sakura-garden', name: { en: 'Sakura Garden', vi: 'Vườn Hoa Anh Đào' }, preview: 'linear-gradient(135deg, #FFD1E8, #BAE6FD)' },
  { id: 'starlight-palace', name: { en: 'Starlight Palace', vi: 'Lâu Đài Ánh Sao' }, preview: 'linear-gradient(135deg, #312E81, #A855F7)' },
  { id: 'rainbow-clouds', name: { en: 'Rainbow Clouds', vi: 'Mây Cầu Vồng' }, preview: 'linear-gradient(135deg, #BAE6FD, #FDE68A, #FBCFE8)' },
  { id: 'butterfly-meadow', name: { en: 'Fairy Meadow', vi: 'Đồng Cỏ Tiên' }, preview: 'linear-gradient(135deg, #A7F3D0, #FEF08A)' },
  { id: 'royal-carpet', name: { en: 'Starlight Stage', vi: 'Sân Khấu Ngôi Sao' }, preview: 'linear-gradient(135deg, #831843, #EC4899)' }
];

export const PHOTO_FRAMES: { id: FrameId; name: LocalizedText }[] = [
  { id: 'none', name: { en: 'Clean', vi: 'Không Khung' } },
  { id: 'polaroid-cute', name: { en: 'Pastel Polaroid', vi: 'Ảnh Polaroid' } },
  { id: 'royal-gold', name: { en: 'Royal Gold', vi: 'Khung Hoàng Gia' } },
  { id: 'magazine-star', name: { en: 'Star Magazine', vi: 'Bìa Tạp Chí' } },
  { id: 'sparkle-hearts', name: { en: 'Sparkle Hearts', vi: 'Khung Trái Tim' } }
];

export const EXPRESSIONS: { id: ExpressionId; name: LocalizedText; emoji: string }[] = [
  { id: 'smile', name: { en: 'Sweet Smile', vi: 'Cười Dịu Dàng' }, emoji: '😊' },
  { id: 'wink', name: { en: 'Playful Wink', vi: 'Nháy Mắt Xinh' }, emoji: '😉' },
  { id: 'happy', name: { en: 'Joyful Laugh', vi: 'Cười Tươi Rạng' }, emoji: '😄' },
  { id: 'kissy', name: { en: 'Kissy Pose', vi: 'Chu Môi Đáng Yêu' }, emoji: '😘' },
  { id: 'starry', name: { en: 'Starry Eyes', vi: 'Mắt Lung Linh Sao' }, emoji: '🤩' }
];

export function getCharacterById(id: string): CharacterModel {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}

export function getHairColorById(id: string): HairColorOption {
  return HAIR_COLORS.find((c) => c.id === id) ?? HAIR_COLORS[0];
}

export function getEyeLensById(id: string): EyeLensOption {
  return EYE_LENSES.find((c) => c.id === id) ?? EYE_LENSES[0];
}

export function getOutfitColorById(id: string): OutfitColorTheme {
  return OUTFIT_COLORS.find((c) => c.id === id) ?? OUTFIT_COLORS[0];
}

export function createInitialMakeover(characterId: string): MakeoverState {
  const char = getCharacterById(characterId);
  return {
    characterId: char.id,
    spaGlow: false,
    spaMaskColor: null,
    eyeColorId: char.defaultEyeColorId,
    eyebrowStyle: 'soft-arch',
    eyebrowColor: char.defaultBrowColor,
    eyelinerStyle: 'none',
    eyelinerColor: '#1E1B2E',
    eyelinerCoverage: 0,
    mascaraStyle: 'natural',
    mascaraColor: '#1E1B2E',
    mascaraCoverage: 0,
    lipFinish: 'glossy',
    eyeshadowFinish: 'shimmer',
    hasLipPaint: false,
    hasEyeshadowPaint: false,
    hasBlushPaint: false,
    hairStyle: char.defaultHairStyle,
    hairColorId: char.defaultHairColorId,
    hairHighlightEnabled: false,
    outfitId: char.defaultOutfitId,
    outfitColorId: char.defaultOutfitColorId,
    headwearId: 'none',
    earringId: 'none',
    necklaceId: 'none',
    glassesId: 'none',
    wingsId: 'none',
    stickers: [],
    expression: 'smile',
    backgroundId: 'vanity-pink',
    frameId: 'none'
  };
}

export function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
