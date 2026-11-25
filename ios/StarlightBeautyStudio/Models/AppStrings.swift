import Foundation

public enum AppStrings {
    private static func pick(_ l: AppLanguage, _ en: String, _ vi: String) -> String {
        l == .en ? en : vi
    }

    public static func appName(_ l: AppLanguage) -> String { pick(l, "Starlight Beauty Studio", "Tiệm Trang Điểm Ánh Sao") }
    public static func tagline(_ l: AppLanguage) -> String { pick(l, "Sparkle, Paint, Style & Shine!", "Trang điểm, Tạo kiểu & Tỏa sáng!") }
    public static func badgeSafe(_ l: AppLanguage) -> String { pick(l, "100% Free & Kid-Safe", "Mở Khóa 100% • An Toàn Cho Bé") }
    public static func chooseModel(_ l: AppLanguage) -> String { pick(l, "Choose Your Model", "Chọn Người Mẫu Của Bé") }
    public static func startMakeover(_ l: AppLanguage) -> String { pick(l, "Start Makeover", "Bắt Đầu Trang Điểm") }
    public static func lookbook(_ l: AppLanguage) -> String { pick(l, "Lookbook", "Bộ Sưu Tập") }
    public static func models(_ l: AppLanguage) -> String { pick(l, "Models", "Người Mẫu") }
    public static func photo(_ l: AppLanguage) -> String { pick(l, "Photo", "Chụp Ảnh") }
    public static func back(_ l: AppLanguage) -> String { pick(l, "Back", "Quay Lại") }
    public static func surprise(_ l: AppLanguage) -> String { pick(l, "Surprise!", "Ngẫu Nhiên") }
    public static func magicFill(_ l: AppLanguage) -> String { pick(l, "Magic Fill", "Tô Tự Động") }
    public static func takePhoto(_ l: AppLanguage) -> String { pick(l, "Take Photo!", "Chụp Ảnh Ngay!") }
    public static func sharePhoto(_ l: AppLanguage) -> String { pick(l, "Share / Save", "Chia Sẻ / Lưu") }
    public static func savedToast(_ l: AppLanguage) -> String { pick(l, "Saved to Lookbook!", "Đã lưu vào Bộ Sưu Tập!") }
    public static func galleryTitle(_ l: AppLanguage) -> String { pick(l, "My Beauty Lookbook", "Bộ Sưu Tập Của Bé") }
    public static func galleryEmpty(_ l: AppLanguage) -> String {
        pick(l, "No photos yet! Style a model and snap a magical photo.", "Chưa có ảnh nào! Hãy trang điểm và chụp ngay một bức ảnh xinh nhé.")
    }

    public static func categoryLabel(_ cat: SalonCategory, _ l: AppLanguage) -> String {
        switch cat {
        case .spa: return pick(l, "Spa", "Spa")
        case .makeup: return pick(l, "Makeup", "Trang Điểm")
        case .eyes: return pick(l, "Eyes", "Đôi Mắt")
        case .hair: return pick(l, "Hair", "Kiểu Tóc")
        case .dress: return pick(l, "Outfits", "Trang Phục")
        case .accessories: return pick(l, "Extras", "Phụ Kiện")
        case .stickers: return pick(l, "Gems", "Sticker")
        }
    }

    public static func makeupToolLabel(_ tool: MakeupToolId, _ l: AppLanguage) -> String {
        switch tool {
        case .lipstick: return pick(l, "Lipstick", "Son Môi")
        case .eyeshadow: return pick(l, "Shadow", "Phấn Mắt")
        case .blush: return pick(l, "Blush", "Má Hồng")
        case .highlighter: return pick(l, "Glow", "Bắt Sáng")
        case .eyeliner: return pick(l, "Liner", "Kẻ Mắt")
        case .mascara: return pick(l, "Mascara", "Chuốt Mi")
        case .remover: return pick(l, "Wipe", "Tẩy Trang")
        }
    }

    public static func makeupHint(_ tool: MakeupToolId, _ l: AppLanguage) -> String {
        switch tool {
        case .lipstick: return pick(l, "Drag across lips to paint!", "Kéo ngón tay lên môi để tô son!")
        case .eyeshadow: return pick(l, "Brush gently over the eyelids!", "Quét nhẹ lên bầu mắt nhé!")
        case .blush: return pick(l, "Swirl softly on both cheeks!", "Xoa nhẹ lên hai má nhé!")
        case .highlighter: return pick(l, "Add shimmer to cheeks & nose!", "Quét nhũ bắt sáng lên má & mũi!")
        case .eyeliner: return pick(l, "Swipe lashes or pick a wing!", "Kéo viền mắt hoặc chọn dáng kẻ!")
        case .mascara: return pick(l, "Brush lashes for doll curl!", "Chuốt mi cong vút xinh xắn!")
        case .remover: return pick(l, "Rub anywhere to wipe clean!", "Chà nhẹ để tẩy trang sạch mịn!")
        }
    }

    public static func spaToolLabel(_ tool: SpaToolId, _ l: AppLanguage) -> String {
        switch tool {
        case .cleanser: return pick(l, "Bubble Wash", "Sữa Rửa Mặt")
        case .mask: return pick(l, "Pearl Mask", "Mặt Nạ Ngọc")
        case .rinse: return pick(l, "Magic Rinse", "Rửa Sạch")
        case .primer: return pick(l, "Glow Serum", "Tinh Chất Sáng")
        }
    }

    public static func hairStyleName(_ s: HairstyleId, _ l: AppLanguage) -> String {
        switch s {
        case .princessWaves: return pick(l, "Princess Waves", "Sóng Công Chúa")
        case .spaceBuns: return pick(l, "Space Buns", "Búi Đôi Xinh")
        case .twinBraids: return pick(l, "Sweet Braids", "Bím Hai Bên")
        case .sweetBob: return pick(l, "Cute Bob", "Tóc Ngắn Bob")
        case .highPonytail: return pick(l, "Star Ponytail", "Đuôi Ngựa")
        case .curlyPuffs: return pick(l, "Cloud Puffs", "Xoăn Bồng Bềnh")
        case .ribbonHalfup: return pick(l, "Half-Up Bow", "Buộc Nửa Nơ")
        case .fairyCurls: return pick(l, "Fairy Curls", "Xoăn Tiên Nữ")
        }
    }

    public static func outfitName(_ o: OutfitId, _ l: AppLanguage) -> String {
        switch o {
        case .princessGown: return pick(l, "Princess Gown", "Váy Công Chúa")
        case .fairyTulle: return pick(l, "Fairy Tulle", "Đầm Tiên Nữ")
        case .pastelSailor: return pick(l, "Sailor Bow", "Áo Thủy Thủ")
        case .starHoodie: return pick(l, "Star Hoodie", "Áo Hoodie Sao")
        case .butterflyDress: return pick(l, "Butterfly Dress", "Đầm Cánh Bướm")
        case .royalVelvet: return pick(l, "Royal Velvet", "Váy Nhung")
        case .mermaidTop: return pick(l, "Mermaid Top", "Áo Tiên Cá")
        case .blossomKimono: return pick(l, "Sakura Robe", "Áo Hoa Đào")
        }
    }

    public static func headwearName(_ h: HeadwearId, _ l: AppLanguage) -> String {
        switch h {
        case .none: return pick(l, "None", "Không")
        case .crystalTiara: return pick(l, "Crystal Tiara", "Vương Miện")
        case .flowerCrown: return pick(l, "Flower Crown", "Vòng Hoa")
        case .catEars: return pick(l, "Cat Ears", "Tai Mèo")
        case .velvetBow: return pick(l, "Princess Bow", "Nơ Công Chúa")
        case .butterflyClips: return pick(l, "Butterfly Clips", "Kẹp Bướm")
        case .starHalo: return pick(l, "Star Halo", "Vòng Sao")
        case .pearlBand: return pick(l, "Pearl Band", "Bờm Ngọc Trai")
        }
    }

    public static func earringName(_ e: EarringId, _ l: AppLanguage) -> String {
        switch e {
        case .none: return pick(l, "None", "Không")
        case .pearlDrops: return pick(l, "Pearl Drops", "Ngọc Trai")
        case .starStuds: return pick(l, "Star Studs", "Ngôi Sao")
        case .heartHoops: return pick(l, "Pink Hearts", "Trái Tim")
        case .crystalDrops: return pick(l, "Crystals", "Pha Lê")
        case .sakuraDrops: return pick(l, "Sakura", "Hoa Đào")
        case .butterflyStuds: return pick(l, "Butterflies", "Bướm Xinh")
        }
    }

    public static func necklaceName(_ n: NecklaceId, _ l: AppLanguage) -> String {
        switch n {
        case .none: return pick(l, "None", "Không")
        case .pearlChoker: return pick(l, "Pearl Choker", "Vòng Ngọc Trai")
        case .heartPendant: return pick(l, "Heart Locket", "Mặt Trái Tim")
        case .starGem: return pick(l, "Star Gem", "Đá Ngôi Sao")
        case .ribbonChoker: return pick(l, "Velvet Ribbon", "Ruy Băng Nơ")
        case .flowerGarland: return pick(l, "Blossom Chain", "Dây Hoa")
        case .royalCollar: return pick(l, "Royal Jewels", "Vòng Hoàng Gia")
        }
    }

    public static func glassesName(_ g: GlassesId, _ l: AppLanguage) -> String {
        switch g {
        case .none: return pick(l, "None", "Không")
        case .heartShades: return pick(l, "Heart Shades", "Kính Trái Tim")
        case .starGlasses: return pick(l, "Star Pop", "Kính Ngôi Sao")
        case .roundPastel: return pick(l, "Cute Round", "Kính Tròn")
        case .catEyeGlam: return pick(l, "Cat-Eye", "Kính Mắt Mèo")
        }
    }

    public static func wingsName(_ w: WingsId, _ l: AppLanguage) -> String {
        switch w {
        case .none: return pick(l, "None", "Không")
        case .fairyIridescent: return pick(l, "Fairy Glow", "Cánh Tiên")
        case .angelFeather: return pick(l, "Angel Wings", "Cánh Thiên Thần")
        case .butterflyPink: return pick(l, "Pink Butterfly", "Cánh Bướm Hồng")
        case .starlightCrystal: return pick(l, "Crystal Star", "Cánh Pha Lê")
        }
    }

    public static func backgroundName(_ b: BackgroundId, _ l: AppLanguage) -> String {
        switch b {
        case .vanityPink: return pick(l, "Dreamy Vanity", "Gương Xinh")
        case .sakuraGarden: return pick(l, "Sakura Garden", "Vườn Hoa Đào")
        case .starlightPalace: return pick(l, "Star Palace", "Lâu Đài Sao")
        case .rainbowClouds: return pick(l, "Rainbow Sky", "Mây Cầu Vồng")
        case .butterflyMeadow: return pick(l, "Fairy Meadow", "Đồng Cỏ Tiên")
        case .royalCarpet: return pick(l, "Star Stage", "Sân Khấu Sao")
        }
    }

    public static func frameName(_ f: FrameId, _ l: AppLanguage) -> String {
        switch f {
        case .none: return pick(l, "Clean", "Không Khung")
        case .polaroidCute: return pick(l, "Polaroid", "Polaroid")
        case .royalGold: return pick(l, "Royal Gold", "Hoàng Gia")
        case .magazineStar: return pick(l, "Magazine", "Tạp Chí")
        case .sparkleHearts: return pick(l, "Hearts", "Trái Tim")
        }
    }

    public static func expressionName(_ e: ExpressionId, _ l: AppLanguage) -> String {
        switch e {
        case .smile: return pick(l, "😊 Smile", "😊 Cười Dịu")
        case .wink: return pick(l, "😉 Wink", "😉 Nháy Mắt")
        case .happy: return pick(l, "😄 Laugh", "😄 Cười Tươi")
        case .kissy: return pick(l, "😘 Kissy", "😘 Chu Môi")
        case .starry: return pick(l, "🤩 Starry", "🤩 Mắt Sao")
        }
    }
}
