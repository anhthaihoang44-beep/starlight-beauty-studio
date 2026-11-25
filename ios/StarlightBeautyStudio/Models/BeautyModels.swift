import SwiftUI

public enum AppLanguage: String, CaseIterable {
    case en = "EN"
    case vi = "VI"
}

public enum ScreenMode {
    case home, salon, photoBooth, gallery
}

public enum SalonCategory: String, CaseIterable, Identifiable {
    case spa, makeup, eyes, hair, dress, accessories, stickers
    public var id: String { rawValue }
}

public enum MakeupToolId: String, CaseIterable, Identifiable {
    case lipstick, eyeshadow, blush, highlighter, eyeliner, mascara, remover
    public var id: String { rawValue }
}

public enum SpaToolId: String, CaseIterable, Identifiable {
    case cleanser, mask, rinse, primer
    public var id: String { rawValue }
}

public enum LipFinish: String, CaseIterable, Identifiable {
    case matte, glossy, glitter
    public var id: String { rawValue }
}

public enum EyeshadowFinish: String, CaseIterable, Identifiable {
    case matte, shimmer
    public var id: String { rawValue }
}

public enum ExpressionId: String, CaseIterable, Identifiable {
    case smile, wink, happy, kissy, starry
    public var id: String { rawValue }
}

public enum EyelinerStyleId: String, CaseIterable, Identifiable {
    case none, classic, puppy, cat, doubleStar, glitterWing
    public var id: String { rawValue }
}

public enum MascaraStyleId: String, CaseIterable, Identifiable {
    case natural, curled, butterfly, starlight, princess
    public var id: String { rawValue }
}

public enum EyebrowStyleId: String, CaseIterable, Identifiable {
    case softArch, sweetStraight, glamWing, cuteRound
    public var id: String { rawValue }
}

public enum HairstyleId: String, CaseIterable, Identifiable {
    case princessWaves, spaceBuns, twinBraids, sweetBob, highPonytail, curlyPuffs, ribbonHalfup, fairyCurls
    public var id: String { rawValue }
}

public enum OutfitId: String, CaseIterable, Identifiable {
    case princessGown, fairyTulle, pastelSailor, starHoodie, butterflyDress, royalVelvet, mermaidTop, blossomKimono
    public var id: String { rawValue }
}

public enum HeadwearId: String, CaseIterable, Identifiable {
    case none, crystalTiara, flowerCrown, catEars, velvetBow, butterflyClips, starHalo, pearlBand
    public var id: String { rawValue }
}

public enum EarringId: String, CaseIterable, Identifiable {
    case none, pearlDrops, starStuds, heartHoops, crystalDrops, sakuraDrops, butterflyStuds
    public var id: String { rawValue }
}

public enum NecklaceId: String, CaseIterable, Identifiable {
    case none, pearlChoker, heartPendant, starGem, ribbonChoker, flowerGarland, royalCollar
    public var id: String { rawValue }
}

public enum GlassesId: String, CaseIterable, Identifiable {
    case none, heartShades, starGlasses, roundPastel, catEyeGlam
    public var id: String { rawValue }
}

public enum WingsId: String, CaseIterable, Identifiable {
    case none, fairyIridescent, angelFeather, butterflyPink, starlightCrystal
    public var id: String { rawValue }
}

public enum StickerTypeId: String, CaseIterable, Identifiable {
    case starGem, pinkHeart, crystalDrop, butterfly, rainbow, sakura, moon, freckles, pearls, diamond, candyBow, sparkleDust
    public var id: String { rawValue }
}

public enum BackgroundId: String, CaseIterable, Identifiable {
    case vanityPink, sakuraGarden, starlightPalace, rainbowClouds, butterflyMeadow, royalCarpet
    public var id: String { rawValue }
}

public enum FrameId: String, CaseIterable, Identifiable {
    case none, polaroidCute, royalGold, magazineStar, sparkleHearts
    public var id: String { rawValue }
}

public struct LocalizedText {
    public let en: String
    public let vi: String
    public func text(_ lang: AppLanguage) -> String { lang == .en ? en : vi }
}

public extension Color {
    init(hex: UInt32, opacity: Double = 1.0) {
        let r = Double((hex >> 16) & 0xFF) / 255.0
        let g = Double((hex >> 8) & 0xFF) / 255.0
        let b = Double(hex & 0xFF) / 255.0
        self.init(.sRGB, red: r, green: g, blue: b, opacity: opacity)
    }
}

public struct CharacterModel: Identifiable {
    public let id: String
    public let name: String
    public let title: LocalizedText
    public let skinBase: UInt32
    public let skinLight: UInt32
    public let skinShadow: UInt32
    public let skinNeckShadow: UInt32
    public let naturalBlush: UInt32
    public let naturalLip: UInt32
    public let naturalLipShadow: UInt32
    public let defaultHairStyle: HairstyleId
    public let defaultHairColorId: String
    public let defaultEyeColorId: String
    public let defaultBrowColor: UInt32
    public let defaultOutfitId: OutfitId
    public let defaultOutfitColorId: String
    public let accentColor: UInt32
}

public struct ColorSwatch: Identifiable {
    public let id: String
    public let hex: UInt32
    public let name: LocalizedText
}

public struct HairColorOption: Identifiable {
    public let id: String
    public let primary: UInt32
    public let highlight: UInt32
    public let shadow: UInt32
    public let streak: UInt32
    public let name: LocalizedText
    public let isRainbow: Bool
}

public struct EyeLensOption: Identifiable {
    public let id: String
    public let outer: UInt32
    public let inner: UInt32
    public let sparkle: UInt32
    public let name: LocalizedText
}

public struct OutfitColorTheme: Identifiable {
    public let id: String
    public let primary: UInt32
    public let secondary: UInt32
    public let trim: UInt32
    public let accent: UInt32
    public let name: LocalizedText
}

public struct PaintDab: Identifiable {
    public let id = UUID()
    public let x: CGFloat
    public let y: CGFloat
    public let radius: CGFloat
    public let hex: UInt32
    public let alpha: Double
    public let glitter: Bool
}

public struct PlacedSticker: Identifiable {
    public let id = UUID()
    public let type: StickerTypeId
    public let x: CGFloat
    public let y: CGFloat
    public let scale: CGFloat
    public let rotation: Double
}

public struct SavedPhotoItem: Identifiable {
    public let id: String
    public let url: URL
    public let characterName: String
    public let createdAt: Date
}

public struct MakeoverState {
    public var characterId: String = "mina"
    public var spaGlow: Bool = false
    public var eyeColorId: String = "sapphire"
    public var eyebrowStyle: EyebrowStyleId = .softArch
    public var eyebrowColor: UInt32 = 0x8B5E3C
    public var eyelinerStyle: EyelinerStyleId = .none
    public var eyelinerColor: UInt32 = 0x1E1B2E
    public var eyelinerCoverage: Double = 0
    public var mascaraStyle: MascaraStyleId = .natural
    public var mascaraColor: UInt32 = 0x1E1B2E
    public var mascaraCoverage: Double = 0
    public var lipFinish: LipFinish = .glossy
    public var eyeshadowFinish: EyeshadowFinish = .shimmer
    public var hairStyle: HairstyleId = .princessWaves
    public var hairColorId: String = "honey-blonde"
    public var hairHighlightEnabled: Bool = false
    public var outfitId: OutfitId = .princessGown
    public var outfitColorId: String = "rose-pink"
    public var headwearId: HeadwearId = .none
    public var earringId: EarringId = .none
    public var necklaceId: NecklaceId = .none
    public var glassesId: GlassesId = .none
    public var wingsId: WingsId = .none
    public var stickers: [PlacedSticker] = []
    public var expression: ExpressionId = .smile
    public var backgroundId: BackgroundId = .vanityPink
    public var frameId: FrameId = .none

    // Interactive paint dabs stored per clipped zone
    public var lipDabs: [PaintDab] = []
    public var eyeshadowDabs: [PaintDab] = []
    public var skinDabs: [PaintDab] = []
    public var spaBubbleDabs: [PaintDab] = []
    public var spaMaskDabs: [PaintDab] = []
}

public enum BeautyCatalog {
    public static let characters: [CharacterModel] = [
        CharacterModel(id: "mina", name: "Mina", title: LocalizedText(en: "Rose Princess", vi: "Công Chúa Hoa Hồng"), skinBase: 0xFFE2D1, skinLight: 0xFFF1E8, skinShadow: 0xF2BEA4, skinNeckShadow: 0xE5AA8E, naturalBlush: 0xFF9EB5, naturalLip: 0xF1889B, naturalLipShadow: 0xD4667D, defaultHairStyle: .princessWaves, defaultHairColorId: "honey-blonde", defaultEyeColorId: "sapphire", defaultBrowColor: 0x8B5E3C, defaultOutfitId: .princessGown, defaultOutfitColorId: "rose-pink", accentColor: 0xFF6BB5),
        CharacterModel(id: "linh", name: "Linh", title: LocalizedText(en: "Sakura Dreamer", vi: "Nàng Thơ Hoa Đào"), skinBase: 0xF9D6BC, skinLight: 0xFFE9D8, skinShadow: 0xE4B18E, skinNeckShadow: 0xD49E7B, naturalBlush: 0xFF96A5, naturalLip: 0xE97D8F, naturalLipShadow: 0xC75E72, defaultHairStyle: .twinBraids, defaultHairColorId: "midnight-ink", defaultEyeColorId: "warm-hazel", defaultBrowColor: 0x3C2A24, defaultOutfitId: .blossomKimono, defaultOutfitColorId: "lavender-dream", accentColor: 0xA855F7),
        CharacterModel(id: "chloe", name: "Chloe", title: LocalizedText(en: "Sunny Popstar", vi: "Ngôi Sao Nắng Mai"), skinBase: 0xEAC09E, skinLight: 0xF7D8BD, skinShadow: 0xCE9B76, skinNeckShadow: 0xBE8964, naturalBlush: 0xF38B82, naturalLip: 0xD8727D, naturalLipShadow: 0xB45360, defaultHairStyle: .highPonytail, defaultHairColorId: "caramel-chestnut", defaultEyeColorId: "emerald", defaultBrowColor: 0x5B3A26, defaultOutfitId: .starHoodie, defaultOutfitColorId: "sky-candy", accentColor: 0x38BDF8),
        CharacterModel(id: "zara", name: "Zara", title: LocalizedText(en: "Starlight Fairy", vi: "Tiên Nữ Ánh Sao"), skinBase: 0xCC9169, skinLight: 0xE0AC87, skinShadow: 0xAC6F48, skinNeckShadow: 0x9B5F3A, naturalBlush: 0xE06E7B, naturalLip: 0xB95E6D, naturalLipShadow: 0x944352, defaultHairStyle: .spaceBuns, defaultHairColorId: "cotton-pink", defaultEyeColorId: "amethyst", defaultBrowColor: 0x4A2C22, defaultOutfitId: .fairyTulle, defaultOutfitColorId: "mint-fairy", accentColor: 0x2DD4BF),
        CharacterModel(id: "amara", name: "Amara", title: LocalizedText(en: "Royal Velvet", vi: "Nữ Hoàng Ngọc Trai"), skinBase: 0x9A6344, skinLight: 0xB47C5B, skinShadow: 0x7A492E, skinNeckShadow: 0x6A3D24, naturalBlush: 0xC85E70, naturalLip: 0x9E4B5A, naturalLipShadow: 0x793240, defaultHairStyle: .curlyPuffs, defaultHairColorId: "espresso-noir", defaultEyeColorId: "golden-honey", defaultBrowColor: 0x2C1B15, defaultOutfitId: .royalVelvet, defaultOutfitColorId: "royal-gold", accentColor: 0xF59E0B),
        CharacterModel(id: "yuki", name: "Yuki", title: LocalizedText(en: "Crystal Angel", vi: "Thiên Thần Pha Lê"), skinBase: 0xFFECE4, skinLight: 0xFFF7F4, skinShadow: 0xF0CBBD, skinNeckShadow: 0xE3B8A8, naturalBlush: 0xFFA3BE, naturalLip: 0xF290A8, naturalLipShadow: 0xD16C86, defaultHairStyle: .sweetBob, defaultHairColorId: "lavender-frost", defaultEyeColorId: "sky-aqua", defaultBrowColor: 0x7C6A8C, defaultOutfitId: .pastelSailor, defaultOutfitColorId: "berry-pop", accentColor: 0xEC4899)
    ]

    public static let lipstickSwatches: [ColorSwatch] = [
        ColorSwatch(id: "bubblegum", hex: 0xFF69B4, name: LocalizedText(en: "Bubblegum", vi: "Hồng Kẹo")),
        ColorSwatch(id: "ruby", hex: 0xE11D48, name: LocalizedText(en: "Ruby", vi: "Đỏ Hồng Ngọc")),
        ColorSwatch(id: "rose", hex: 0xF472B6, name: LocalizedText(en: "Rose Petal", vi: "Cánh Hồng")),
        ColorSwatch(id: "peach", hex: 0xFB7185, name: LocalizedText(en: "Peach", vi: "Cam Đào")),
        ColorSwatch(id: "coral", hex: 0xFF6B57, name: LocalizedText(en: "Coral", vi: "San Hô")),
        ColorSwatch(id: "cherry", hex: 0xBE123C, name: LocalizedText(en: "Cherry", vi: "Anh Đào")),
        ColorSwatch(id: "berry", hex: 0x9D174D, name: LocalizedText(en: "Berry", vi: "Mứt Dâu")),
        ColorSwatch(id: "nude", hex: 0xE89B93, name: LocalizedText(en: "Sweet Nude", vi: "Hồng Đất")),
        ColorSwatch(id: "cotton", hex: 0xFF9AD5, name: LocalizedText(en: "Cotton Candy", vi: "Hồng Baby")),
        ColorSwatch(id: "lilac", hex: 0xC084FC, name: LocalizedText(en: "Lilac", vi: "Tím Nhẹ")),
        ColorSwatch(id: "plum", hex: 0x7E22CE, name: LocalizedText(en: "Plum", vi: "Tím Mận")),
        ColorSwatch(id: "magenta", hex: 0xDB2777, name: LocalizedText(en: "Popstar", vi: "Hồng Sao")),
        ColorSwatch(id: "tangerine", hex: 0xF97316, name: LocalizedText(en: "Tangerine", vi: "Cam Tươi")),
        ColorSwatch(id: "aqua", hex: 0x06B6D4, name: LocalizedText(en: "Mermaid", vi: "Tiên Cá")),
        ColorSwatch(id: "galaxy", hex: 0x6366F1, name: LocalizedText(en: "Galaxy", vi: "Ngân Hà")),
        ColorSwatch(id: "gold", hex: 0xF59E0B, name: LocalizedText(en: "Gold", vi: "Vàng Kim"))
    ]

    public static let eyeshadowSwatches: [ColorSwatch] = [
        ColorSwatch(id: "sakura", hex: 0xFF8AC6, name: LocalizedText(en: "Sakura", vi: "Hồng Đào")),
        ColorSwatch(id: "lavender", hex: 0xC084FC, name: LocalizedText(en: "Lilac", vi: "Tím Nhẹ")),
        ColorSwatch(id: "sky", hex: 0x38BDF8, name: LocalizedText(en: "Sky Fairy", vi: "Xanh Trời")),
        ColorSwatch(id: "mint", hex: 0x34D399, name: LocalizedText(en: "Mint Dew", vi: "Bạc Hà")),
        ColorSwatch(id: "peach", hex: 0xFDA4AF, name: LocalizedText(en: "Peach", vi: "Cam Đào")),
        ColorSwatch(id: "gold", hex: 0xFBBF24, name: LocalizedText(en: "Sunshine", vi: "Vàng Nắng")),
        ColorSwatch(id: "rosegold", hex: 0xF48FB1, name: LocalizedText(en: "Rose Gold", vi: "Vàng Hồng")),
        ColorSwatch(id: "violet", hex: 0x8B5CF6, name: LocalizedText(en: "Starlight", vi: "Tím Sao")),
        ColorSwatch(id: "teal", hex: 0x14B8A6, name: LocalizedText(en: "Teal", vi: "Xanh Ngọc")),
        ColorSwatch(id: "berry", hex: 0xEC4899, name: LocalizedText(en: "Berry", vi: "Hồng Dâu")),
        ColorSwatch(id: "pearl", hex: 0xFDE68A, name: LocalizedText(en: "Pearl", vi: "Ngọc Trai")),
        ColorSwatch(id: "cocoa", hex: 0xB47657, name: LocalizedText(en: "Cocoa", vi: "Cacao")),
        ColorSwatch(id: "cobalt", hex: 0x3B82F6, name: LocalizedText(en: "Sapphire", vi: "Xanh Biển")),
        ColorSwatch(id: "sunset", hex: 0xFB923C, name: LocalizedText(en: "Sunset", vi: "Hoàng Hôn")),
        ColorSwatch(id: "emerald", hex: 0x10B981, name: LocalizedText(en: "Emerald", vi: "Lục Bảo")),
        ColorSwatch(id: "silver", hex: 0xCBD5E1, name: LocalizedText(en: "Crystal", vi: "Pha Lê"))
    ]

    public static let blushSwatches: [ColorSwatch] = [
        ColorSwatch(id: "baby", hex: 0xFF85B3, name: LocalizedText(en: "Baby Rose", vi: "Hồng Phấn")),
        ColorSwatch(id: "peach", hex: 0xFF9E80, name: LocalizedText(en: "Peach", vi: "Cam Đào")),
        ColorSwatch(id: "strawberry", hex: 0xFF5C8D, name: LocalizedText(en: "Strawberry", vi: "Hồng Dâu")),
        ColorSwatch(id: "coral", hex: 0xFF7A6B, name: LocalizedText(en: "Coral", vi: "San Hô")),
        ColorSwatch(id: "apricot", hex: 0xFFB37B, name: LocalizedText(en: "Apricot", vi: "Mơ Chín")),
        ColorSwatch(id: "berry", hex: 0xE15A87, name: LocalizedText(en: "Berry", vi: "Quả Mọng")),
        ColorSwatch(id: "lilac", hex: 0xD8A3FF, name: LocalizedText(en: "Fairy Lilac", vi: "Tím Tiên")),
        ColorSwatch(id: "rosewood", hex: 0xDC758F, name: LocalizedText(en: "Warm Rose", vi: "Hồng Đất"))
    ]

    public static let highlighterSwatches: [ColorSwatch] = [
        ColorSwatch(id: "pearl", hex: 0xFFFBEB, name: LocalizedText(en: "Pearl", vi: "Ngọc Trai")),
        ColorSwatch(id: "pinkopal", hex: 0xFFE4F3, name: LocalizedText(en: "Pink Opal", vi: "Ánh Hồng")),
        ColorSwatch(id: "golddust", hex: 0xFEF08A, name: LocalizedText(en: "Star Gold", vi: "Vàng Sao")),
        ColorSwatch(id: "unicorn", hex: 0xBAE6FD, name: LocalizedText(en: "Unicorn", vi: "Xanh Kỳ Lân")),
        ColorSwatch(id: "prism", hex: 0xF3E8FF, name: LocalizedText(en: "Lilac Prism", vi: "Tím Pha Lê"))
    ]

    public static let eyelinerColors: [ColorSwatch] = [
        ColorSwatch(id: "black", hex: 0x1E1B2E, name: LocalizedText(en: "Black", vi: "Đen")),
        ColorSwatch(id: "cocoa", hex: 0x5C3A2E, name: LocalizedText(en: "Cocoa", vi: "Nâu")),
        ColorSwatch(id: "violet", hex: 0x7C3AED, name: LocalizedText(en: "Violet", vi: "Tím")),
        ColorSwatch(id: "pink", hex: 0xEC4899, name: LocalizedText(en: "Pink", vi: "Hồng")),
        ColorSwatch(id: "blue", hex: 0x0284C7, name: LocalizedText(en: "Ocean", vi: "Xanh Biển")),
        ColorSwatch(id: "emerald", hex: 0x059669, name: LocalizedText(en: "Emerald", vi: "Ngọc")),
        ColorSwatch(id: "gold", hex: 0xF59E0B, name: LocalizedText(en: "Gold", vi: "Vàng")),
        ColorSwatch(id: "white", hex: 0xFFFFFF, name: LocalizedText(en: "Pearl", vi: "Trắng"))
    ]

    public static let mascaraColors: [ColorSwatch] = [
        ColorSwatch(id: "black", hex: 0x1E1B2E, name: LocalizedText(en: "Black", vi: "Đen")),
        ColorSwatch(id: "brown", hex: 0x5A382C, name: LocalizedText(en: "Brown", vi: "Nâu")),
        ColorSwatch(id: "plum", hex: 0x7E22CE, name: LocalizedText(en: "Plum", vi: "Tím")),
        ColorSwatch(id: "sapphire", hex: 0x2563EB, name: LocalizedText(en: "Sapphire", vi: "Xanh")),
        ColorSwatch(id: "pink", hex: 0xDB2777, name: LocalizedText(en: "Pink", vi: "Hồng")),
        ColorSwatch(id: "teal", hex: 0x0D9488, name: LocalizedText(en: "Teal", vi: "Ngọc"))
    ]

    public static let eyeLenses: [EyeLensOption] = [
        EyeLensOption(id: "sapphire", outer: 0x1D4ED8, inner: 0x60A5FA, sparkle: 0xDBEAFE, name: LocalizedText(en: "Sapphire", vi: "Sapphire")),
        EyeLensOption(id: "warm-hazel", outer: 0x6B3E26, inner: 0xC48A54, sparkle: 0xFEF3C7, name: LocalizedText(en: "Hazel", vi: "Hạt Dẻ")),
        EyeLensOption(id: "emerald", outer: 0x047857, inner: 0x34D399, sparkle: 0xD1FAE5, name: LocalizedText(en: "Emerald", vi: "Lục Bảo")),
        EyeLensOption(id: "amethyst", outer: 0x6D28D9, inner: 0xC084FC, sparkle: 0xF3E8FF, name: LocalizedText(en: "Amethyst", vi: "Thạch Anh")),
        EyeLensOption(id: "rose-quartz", outer: 0xBE185D, inner: 0xF472B6, sparkle: 0xFCE7F3, name: LocalizedText(en: "Rose", vi: "Hồng Pha Lê")),
        EyeLensOption(id: "golden-honey", outer: 0x92400E, inner: 0xFBBF24, sparkle: 0xFEF9C3, name: LocalizedText(en: "Honey", vi: "Mật Ong")),
        EyeLensOption(id: "sky-aqua", outer: 0x0369A1, inner: 0x38BDF8, sparkle: 0xE0F2FE, name: LocalizedText(en: "Sky Aqua", vi: "Xanh Trời")),
        EyeLensOption(id: "galaxy-star", outer: 0x312E81, inner: 0xA855F7, sparkle: 0xFDE047, name: LocalizedText(en: "Galaxy", vi: "Ngân Hà")),
        EyeLensOption(id: "midnight-ink", outer: 0x1E293B, inner: 0x64748B, sparkle: 0xF8FAFC, name: LocalizedText(en: "Noir", vi: "Đen Huyền")),
        EyeLensOption(id: "mint-crystal", outer: 0x0F766E, inner: 0x5EEAD4, sparkle: 0xCCFBF1, name: LocalizedText(en: "Mint", vi: "Bạc Hà"))
    ]

    public static let eyebrowColors: [ColorSwatch] = [
        ColorSwatch(id: "eb1", hex: 0x2B2129, name: LocalizedText(en: "Black", vi: "Đen")),
        ColorSwatch(id: "eb2", hex: 0x4E342E, name: LocalizedText(en: "Dark Brown", vi: "Nâu Đậm")),
        ColorSwatch(id: "eb3", hex: 0x795548, name: LocalizedText(en: "Chestnut", vi: "Hạt Dẻ")),
        ColorSwatch(id: "eb4", hex: 0xA67C52, name: LocalizedText(en: "Honey", vi: "Vàng Mật")),
        ColorSwatch(id: "eb5", hex: 0x9A4B3C, name: LocalizedText(en: "Auburn", vi: "Nâu Đỏ")),
        ColorSwatch(id: "eb6", hex: 0xC0568A, name: LocalizedText(en: "Rose", vi: "Hồng Phấn")),
        ColorSwatch(id: "eb7", hex: 0x7C62A6, name: LocalizedText(en: "Lilac", vi: "Tím Nhẹ"))
    ]

    public static let hairColors: [HairColorOption] = [
        HairColorOption(id: "honey-blonde", primary: 0xF3C669, highlight: 0xFFE8A3, shadow: 0xC68B33, streak: 0xFF9AD5, name: LocalizedText(en: "Honey Blonde", vi: "Vàng Mật Ong"), isRainbow: false),
        HairColorOption(id: "midnight-ink", primary: 0x2B2940, highlight: 0x525075, shadow: 0x161424, streak: 0xA855F7, name: LocalizedText(en: "Midnight", vi: "Đen Huyền"), isRainbow: false),
        HairColorOption(id: "caramel-chestnut", primary: 0x8C5233, highlight: 0xBA7A52, shadow: 0x5B311B, streak: 0xFBBF24, name: LocalizedText(en: "Caramel", vi: "Hạt Dẻ"), isRainbow: false),
        HairColorOption(id: "espresso-noir", primary: 0x3A241E, highlight: 0x634138, shadow: 0x20120F, streak: 0xF59E0B, name: LocalizedText(en: "Espresso", vi: "Cà Phê"), isRainbow: false),
        HairColorOption(id: "strawberry-ginger", primary: 0xD96B43, highlight: 0xF89B73, shadow: 0x9E4222, streak: 0xFDE68A, name: LocalizedText(en: "Ginger", vi: "Cam Nâu"), isRainbow: false),
        HairColorOption(id: "cotton-pink", primary: 0xFF8AC6, highlight: 0xFFC4E4, shadow: 0xD14F93, streak: 0x7DD3FC, name: LocalizedText(en: "Cotton Pink", vi: "Hồng Kẹo"), isRainbow: false),
        HairColorOption(id: "lavender-frost", primary: 0xB794F6, highlight: 0xE1D1FF, shadow: 0x7F56C9, streak: 0xF9A8D4, name: LocalizedText(en: "Lavender", vi: "Tím Oải Hương"), isRainbow: false),
        HairColorOption(id: "sky-mermaid", primary: 0x38BDF8, highlight: 0x93E4FF, shadow: 0x0284C7, streak: 0xC4B5FD, name: LocalizedText(en: "Mermaid Sky", vi: "Xanh Biển"), isRainbow: false),
        HairColorOption(id: "mint-fairy", primary: 0x34D399, highlight: 0x8CF4CB, shadow: 0x059669, streak: 0xFEF08A, name: LocalizedText(en: "Mint Fairy", vi: "Bạc Hà"), isRainbow: false),
        HairColorOption(id: "ruby-berry", primary: 0xE11D64, highlight: 0xFF6B9E, shadow: 0x9B1144, streak: 0xFDE047, name: LocalizedText(en: "Berry Rose", vi: "Đỏ Dâu"), isRainbow: false),
        HairColorOption(id: "galaxy-violet", primary: 0x6D28D9, highlight: 0xA78BFA, shadow: 0x431691, streak: 0x38BDF8, name: LocalizedText(en: "Galaxy", vi: "Ngân Hà"), isRainbow: false),
        HairColorOption(id: "snow-silver", primary: 0xE2E8F0, highlight: 0xFFFFFF, shadow: 0x94A3B8, streak: 0xF472B6, name: LocalizedText(en: "Silver", vi: "Bạch Kim"), isRainbow: false),
        HairColorOption(id: "peach-blossom", primary: 0xFF9E8A, highlight: 0xFFD0C4, shadow: 0xD46652, streak: 0xFDE68A, name: LocalizedText(en: "Peach", vi: "Hồng Đào"), isRainbow: false),
        HairColorOption(id: "rainbow-magic", primary: 0xFF7AC6, highlight: 0xFDE047, shadow: 0x8B5CF6, streak: 0x38BDF8, name: LocalizedText(en: "Rainbow", vi: "Cầu Vồng"), isRainbow: true)
    ]

    public static let outfitColors: [OutfitColorTheme] = [
        OutfitColorTheme(id: "rose-pink", primary: 0xFF7EB6, secondary: 0xFFB8D9, trim: 0xFFF5F9, accent: 0xE11D74, name: LocalizedText(en: "Rose Princess", vi: "Hồng Công Chúa")),
        OutfitColorTheme(id: "lavender-dream", primary: 0xA78BFA, secondary: 0xDDD6FE, trim: 0xFAF5FF, accent: 0x7C3AED, name: LocalizedText(en: "Lavender", vi: "Tím Oải Hương")),
        OutfitColorTheme(id: "sky-candy", primary: 0x38BDF8, secondary: 0xBAE6FD, trim: 0xF0F9FF, accent: 0x0284C7, name: LocalizedText(en: "Sky Blue", vi: "Xanh Thiên Thanh")),
        OutfitColorTheme(id: "mint-fairy", primary: 0x34D399, secondary: 0xA7F3D0, trim: 0xECFDF5, accent: 0x059669, name: LocalizedText(en: "Mint Fairy", vi: "Xanh Bạc Hà")),
        OutfitColorTheme(id: "royal-gold", primary: 0xF59E0B, secondary: 0xFDE68A, trim: 0xFFFBEB, accent: 0xB45309, name: LocalizedText(en: "Royal Gold", vi: "Vàng Hoàng Gia")),
        OutfitColorTheme(id: "berry-pop", primary: 0xF43F5E, secondary: 0xFDA4AF, trim: 0xFFF1F2, accent: 0xBE123C, name: LocalizedText(en: "Ruby Berry", vi: "Đỏ Hồng Ngọc")),
        OutfitColorTheme(id: "peach-cream", primary: 0xFB923C, secondary: 0xFED7AA, trim: 0xFFF7ED, accent: 0xEA580C, name: LocalizedText(en: "Peach Cream", vi: "Cam Kem")),
        OutfitColorTheme(id: "midnight-star", primary: 0x4F46E5, secondary: 0xA5B4FC, trim: 0xFEF08A, accent: 0x312E81, name: LocalizedText(en: "Starlight Navy", vi: "Xanh Đêm Sao"))
    ]

    public static func character(byId id: String) -> CharacterModel {
        characters.first { $0.id == id } ?? characters[0]
    }
    public static func hairColor(byId id: String) -> HairColorOption {
        hairColors.first { $0.id == id } ?? hairColors[0]
    }
    public static func eyeLens(byId id: String) -> EyeLensOption {
        eyeLenses.first { $0.id == id } ?? eyeLenses[0]
    }
    public static func outfitColor(byId id: String) -> OutfitColorTheme {
        outfitColors.first { $0.id == id } ?? outfitColors[0]
    }
    public static func initialMakeover(characterId: String) -> MakeoverState {
        let c = character(byId: characterId)
        return MakeoverState(
            characterId: c.id,
            eyeColorId: c.defaultEyeColorId,
            eyebrowColor: c.defaultBrowColor,
            hairStyle: c.defaultHairStyle,
            hairColorId: c.defaultHairColorId,
            outfitId: c.defaultOutfitId,
            outfitColorId: c.defaultOutfitColorId
        )
    }
}
