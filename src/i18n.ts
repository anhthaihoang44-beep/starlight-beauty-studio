import type { Language, LocalizedText } from './types';

export const UI_TEXT = {
  appName: {
    en: 'Starlight Beauty Studio',
    vi: 'Tiệm Trang Điểm Ánh Sao'
  },
  appTagline: {
    en: 'Sparkle, Paint, Style & Shine!',
    vi: 'Trang điểm, Tạo kiểu & Tỏa sáng!'
  },
  chooseModel: {
    en: 'Choose Your Model',
    vi: 'Chọn Người Mẫu Của Bé'
  },
  startMakeover: {
    en: 'Start Makeover',
    vi: 'Bắt Đầu Trang Điểm'
  },
  myAlbum: {
    en: 'Lookbook',
    vi: 'Bộ Sưu Tập'
  },
  home: {
    en: 'Models',
    vi: 'Người Mẫu'
  },
  photoBooth: {
    en: 'Photo',
    vi: 'Chụp Ảnh'
  },
  backToSalon: {
    en: 'Back to Salon',
    vi: 'Quay Lại Tiệm'
  },
  // Categories
  catSpa: { en: 'Spa', vi: 'Spa' },
  catMakeup: { en: 'Makeup', vi: 'Trang Điểm' },
  catEyes: { en: 'Eyes', vi: 'Đôi Mắt' },
  catHair: { en: 'Hair', vi: 'Kiểu Tóc' },
  catDress: { en: 'Outfits', vi: 'Trang Phục' },
  catAccessories: { en: 'Extras', vi: 'Phụ Kiện' },
  catStickers: { en: 'Gems', vi: 'Sticker' },
  // Makeup tools
  toolLipstick: { en: 'Lipstick', vi: 'Son Môi' },
  toolEyeshadow: { en: 'Eyeshadow', vi: 'Phấn Mắt' },
  toolBlush: { en: 'Blush', vi: 'Má Hồng' },
  toolHighlighter: { en: 'Glow', vi: 'Bắt Sáng' },
  toolEyeliner: { en: 'Eyeliner', vi: 'Kẻ Mắt' },
  toolMascara: { en: 'Mascara', vi: 'Chuốt Mi' },
  toolRemover: { en: 'Wipe', vi: 'Tẩy Trang' },
  // Spa tools
  spaCleanser: { en: 'Bubble Wash', vi: 'Sữa Rửa Mặt' },
  spaMask: { en: 'Pearl Mask', vi: 'Mặt Nạ Ngọc' },
  spaRinse: { en: 'Magic Rinse', vi: 'Rửa Sạch' },
  spaPrimer: { en: 'Glow Serum', vi: 'Tinh Chất Sáng' },
  spaHintCleanser: {
    en: 'Rub the face to make bubbly foam!',
    vi: 'Xoa lên mặt để tạo bọt sạch mịn nhé!'
  },
  spaHintMask: {
    en: 'Brush the silky spa mask onto the cheeks & forehead!',
    vi: 'Thoa mặt nạ dưỡng da lên má và trán nhé!'
  },
  spaHintRinse: {
    en: 'Swipe gently to rinse bubbles & reveal fresh skin!',
    vi: 'Lướt nhẹ để rửa sạch bọt và mặt nạ nhé!'
  },
  spaHintPrimer: {
    en: 'Tap or brush for a magical sparkle glow!',
    vi: 'Chạm hoặc quét để làn da tỏa sáng lung linh!'
  },
  // Interactive hints
  hintLipstick: {
    en: 'Drag across the lips to paint!',
    vi: 'Kéo thỏi son lên môi để tô màu nhé!'
  },
  hintEyeshadow: {
    en: 'Brush gently over the eyelids!',
    vi: 'Quét cọ nhẹ lên bầu mắt nhé!'
  },
  hintBlush: {
    en: 'Swirl the puff on both cheeks!',
    vi: 'Chấm bông phấn xoa đều hai má nhé!'
  },
  hintHighlighter: {
    en: 'Tap shimmering glow on cheeks & nose!',
    vi: 'Quét phấn bắt sáng lên má và sóng mũi!'
  },
  hintEyeliner: {
    en: 'Swipe along the eyelashes or pick a style!',
    vi: 'Kéo dọc viền mắt hoặc chọn kiểu kẻ mắt!'
  },
  hintMascara: {
    en: 'Brush the eyelashes up for lush lashes!',
    vi: 'Chuốt nhẹ lên lông mi để mi cong vút!'
  },
  hintRemover: {
    en: 'Rub anywhere to gently wipe makeup off!',
    vi: 'Chà nhẹ lên vùng cần tẩy trang nhé!'
  },
  hintStickers: {
    en: 'Tap anywhere on the face to place sparkling gems!',
    vi: 'Chạm vào khuôn mặt để dán sticker lấp lánh!'
  },
  // Buttons & controls
  autoApply: { en: 'Magic Fill', vi: 'Tô Tự Động' },
  clearLayer: { en: 'Clear', vi: 'Xóa' },
  clearAllMakeup: { en: 'Reset Face', vi: 'Làm Mới Mặt' },
  surpriseMe: { en: 'Surprise!', vi: 'Ngẫu Nhiên' },
  undoSticker: { en: 'Undo', vi: 'Hoàn Tác' },
  clearStickers: { en: 'Clear Gems', vi: 'Xóa Hết' },
  finishMatte: { en: 'Matte', vi: 'Lì' },
  finishGlossy: { en: 'Glossy', vi: 'Bóng' },
  finishGlitter: { en: 'Glitter', vi: 'Kim Tuyến' },
  finishShimmer: { en: 'Shimmer', vi: 'Nhũ Sáng' },
  // Sub-tabs
  subLenses: { en: 'Eye Color', vi: 'Màu Mắt' },
  subBrows: { en: 'Eyebrows', vi: 'Chân Mày' },
  subHairStyle: { en: 'Styles', vi: 'Kiểu Tóc' },
  subHairColor: { en: 'Colors', vi: 'Màu Tóc' },
  highlightsOn: { en: 'Sparkle Streaks', vi: 'Nhuộm Highlight' },
  subOutfitStyle: { en: 'Outfits', vi: 'Trang Phục' },
  subOutfitColor: { en: 'Colors', vi: 'Màu Váy' },
  subHeadwear: { en: 'Headwear', vi: 'Vương Miện' },
  subEarrings: { en: 'Earrings', vi: 'Bông Tai' },
  subNecklace: { en: 'Necklace', vi: 'Dây Chuyền' },
  subGlasses: { en: 'Glasses', vi: 'Mắt Kính' },
  subWings: { en: 'Wings', vi: 'Đôi Cánh' },
  // Photo booth
  snapPhoto: { en: 'Take Photo!', vi: 'Chụp Ảnh Ngay!' },
  downloadPhoto: { en: 'Save PNG', vi: 'Tải Ảnh PNG' },
  photoSaved: { en: 'Saved to Lookbook!', vi: 'Đã lưu vào Bộ Sưu Tập!' },
  bgLabel: { en: 'Scene', vi: 'Phông Nền' },
  frameLabel: { en: 'Frame', vi: 'Khung Ảnh' },
  poseLabel: { en: 'Pose', vi: 'Biểu Cảm' },
  // Gallery
  galleryTitle: { en: 'My Beauty Lookbook', vi: 'Bộ Sưu Tập Của Bé' },
  galleryEmpty: {
    en: 'No photos yet! Style a model and snap a magical photo.',
    vi: 'Chưa có ảnh nào! Hãy trang điểm và chụp ngay một bức ảnh xinh đẹp nhé.'
  },
  deletePhoto: { en: 'Delete', vi: 'Xóa' },
  soundOn: { en: 'Sound On', vi: 'Bật Âm' },
  soundOff: { en: 'Muted', vi: 'Tắt Âm' },
  allUnlockedBadge: {
    en: '100% Free & Kid-Safe',
    vi: 'Mở Khóa 100% • An Toàn Cho Bé'
  }
} as const;

export type UITextKey = keyof typeof UI_TEXT;

export function t(key: UITextKey, lang: Language): string {
  return UI_TEXT[key][lang];
}

export function tl(item: LocalizedText, lang: Language): string {
  return item[lang];
}
