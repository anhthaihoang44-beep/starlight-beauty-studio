package com.starlightstudio.beauty.model

enum class Language { EN, VI }

enum class ScreenMode { HOME, SALON, PHOTOBOOTH, GALLERY }

enum class SalonCategory { SPA, MAKEUP, EYES, HAIR, DRESS, ACCESSORIES, STICKERS }

enum class MakeupToolId { LIPSTICK, EYESHADOW, BLUSH, HIGHLIGHTER, EYELINER, MASCARA, REMOVER }

enum class SpaToolId { CLEANSER, MASK, RINSE, PRIMER }

enum class LipFinish { MATTE, GLOSSY, GLITTER }

enum class EyeshadowFinish { MATTE, SHIMMER }

enum class ExpressionId { SMILE, WINK, HAPPY, KISSY, STARRY }

enum class EyelinerStyleId { NONE, CLASSIC, PUPPY, CAT, DOUBLE_STAR, GLITTER_WING }

enum class MascaraStyleId { NATURAL, CURLED, BUTTERFLY, STARLIGHT, PRINCESS }

enum class EyebrowStyleId { SOFT_ARCH, SWEET_STRAIGHT, GLAM_WING, CUTE_ROUND }

enum class HairstyleId {
    PRINCESS_WAVES,
    SPACE_BUNS,
    TWIN_BRAIDS,
    SWEET_BOB,
    HIGH_PONYTAIL,
    CURLY_PUFFS,
    RIBBON_HALFUP,
    FAIRY_CURLS
}

enum class OutfitId {
    PRINCESS_GOWN,
    FAIRY_TULLE,
    PASTEL_SAILOR,
    STAR_HOODIE,
    BUTTERFLY_DRESS,
    ROYAL_VELVET,
    MERMAID_TOP,
    BLOSSOM_KIMONO
}

enum class HeadwearId {
    NONE,
    CRYSTAL_TIARA,
    FLOWER_CROWN,
    CAT_EARS,
    VELVET_BOW,
    BUTTERFLY_CLIPS,
    STAR_HALO,
    PEARL_BAND
}

enum class EarringId {
    NONE,
    PEARL_DROPS,
    STAR_STUDS,
    HEART_HOOPS,
    CRYSTAL_DROPS,
    SAKURA_DROPS,
    BUTTERFLY_STUDS
}

enum class NecklaceId {
    NONE,
    PEARL_CHOKER,
    HEART_PENDANT,
    STAR_GEM,
    RIBBON_CHOKER,
    FLOWER_GARLAND,
    ROYAL_COLLAR
}

enum class GlassesId { NONE, HEART_SHADES, STAR_GLASSES, ROUND_PASTEL, CAT_EYE_GLAM }

enum class WingsId { NONE, FAIRY_IRIDESCENT, ANGEL_FEATHER, BUTTERFLY_PINK, STARLIGHT_CRYSTAL }

enum class StickerTypeId {
    STAR_GEM,
    PINK_HEART,
    CRYSTAL_DROP,
    BUTTERFLY,
    RAINBOW,
    SAKURA,
    MOON,
    FRECKLES,
    PEARLS,
    DIAMOND,
    CANDY_BOW,
    SPARKLE_DUST
}

enum class BackgroundId {
    VANITY_PINK,
    SAKURA_GARDEN,
    STARLIGHT_PALACE,
    RAINBOW_CLOUDS,
    BUTTERFLY_MEADOW,
    ROYAL_CARPET
}

enum class FrameId { NONE, POLAROID_CUTE, ROYAL_GOLD, MAGAZINE_STAR, SPARKLE_HEARTS }

data class LocalizedText(val en: String, val vi: String) {
    fun text(lang: Language): String = if (lang == Language.EN) en else vi
}

data class CharacterModel(
    val id: String,
    val name: String,
    val title: LocalizedText,
    val skinBase: Int,
    val skinLight: Int,
    val skinShadow: Int,
    val skinNeckShadow: Int,
    val earInner: Int,
    val naturalBlush: Int,
    val naturalLip: Int,
    val naturalLipShadow: Int,
    val defaultHairStyle: HairstyleId,
    val defaultHairColorId: String,
    val defaultEyeColorId: String,
    val defaultBrowColor: Int,
    val defaultOutfitId: OutfitId,
    val defaultOutfitColorId: String,
    val accentColor: Int
)

data class ColorSwatch(val id: String, val argb: Int, val name: LocalizedText)

data class HairColorOption(
    val id: String,
    val primary: Int,
    val highlight: Int,
    val shadow: Int,
    val streak: Int,
    val name: LocalizedText,
    val isRainbow: Boolean = false
)

data class EyeLensOption(
    val id: String,
    val outer: Int,
    val inner: Int,
    val sparkle: Int,
    val name: LocalizedText
)

data class OutfitColorTheme(
    val id: String,
    val primary: Int,
    val secondary: Int,
    val trim: Int,
    val accent: Int,
    val name: LocalizedText
)

data class PlacedSticker(
    val id: Long,
    val type: StickerTypeId,
    val x: Float,
    val y: Float,
    val scale: Float = 1f,
    val rotation: Float = 0f
)

data class MakeoverState(
    val characterId: String = "mina",
    val spaGlow: Boolean = false,
    val eyeColorId: String = "sapphire",
    val eyebrowStyle: EyebrowStyleId = EyebrowStyleId.SOFT_ARCH,
    val eyebrowColor: Int = 0xFF8B5E3C.toInt(),
    val eyelinerStyle: EyelinerStyleId = EyelinerStyleId.NONE,
    val eyelinerColor: Int = 0xFF1E1B2E.toInt(),
    val eyelinerCoverage: Float = 0f,
    val mascaraStyle: MascaraStyleId = MascaraStyleId.NATURAL,
    val mascaraColor: Int = 0xFF1E1B2E.toInt(),
    val mascaraCoverage: Float = 0f,
    val lipFinish: LipFinish = LipFinish.GLOSSY,
    val eyeshadowFinish: EyeshadowFinish = EyeshadowFinish.SHIMMER,
    val hasLipPaint: Boolean = false,
    val hasEyeshadowPaint: Boolean = false,
    val hasBlushPaint: Boolean = false,
    val hairStyle: HairstyleId = HairstyleId.PRINCESS_WAVES,
    val hairColorId: String = "honey-blonde",
    val hairHighlightEnabled: Boolean = false,
    val outfitId: OutfitId = OutfitId.PRINCESS_GOWN,
    val outfitColorId: String = "rose-pink",
    val headwearId: HeadwearId = HeadwearId.NONE,
    val earringId: EarringId = EarringId.NONE,
    val necklaceId: NecklaceId = NecklaceId.NONE,
    val glassesId: GlassesId = GlassesId.NONE,
    val wingsId: WingsId = WingsId.NONE,
    val stickers: List<PlacedSticker> = emptyList(),
    val expression: ExpressionId = ExpressionId.SMILE,
    val backgroundId: BackgroundId = BackgroundId.VANITY_PINK,
    val frameId: FrameId = FrameId.NONE
)

data class SavedPhotoItem(
    val id: String,
    val filePath: String,
    val characterName: String,
    val createdAt: Long
)

object BeautyCatalog {
    val characters = listOf(
        CharacterModel(
            id = "mina",
            name = "Mina",
            title = LocalizedText("Rose Princess", "Công Chúa Hoa Hồng"),
            skinBase = 0xFFFFE2D1.toInt(),
            skinLight = 0xFFFFF1E8.toInt(),
            skinShadow = 0xFFF2BEA4.toInt(),
            skinNeckShadow = 0xFFE5AA8E.toInt(),
            earInner = 0xFFF6BBA2.toInt(),
            naturalBlush = 0xFFFF9EB5.toInt(),
            naturalLip = 0xFFF1889B.toInt(),
            naturalLipShadow = 0xFFD4667D.toInt(),
            defaultHairStyle = HairstyleId.PRINCESS_WAVES,
            defaultHairColorId = "honey-blonde",
            defaultEyeColorId = "sapphire",
            defaultBrowColor = 0xFF8B5E3C.toInt(),
            defaultOutfitId = OutfitId.PRINCESS_GOWN,
            defaultOutfitColorId = "rose-pink",
            accentColor = 0xFFFF6BB5.toInt()
        ),
        CharacterModel(
            id = "linh",
            name = "Linh",
            title = LocalizedText("Sakura Dreamer", "Nàng Thơ Hoa Đào"),
            skinBase = 0xFFF9D6BC.toInt(),
            skinLight = 0xFFFFE9D8.toInt(),
            skinShadow = 0xFFE4B18E.toInt(),
            skinNeckShadow = 0xFFD49E7B.toInt(),
            earInner = 0xFFEBB08D.toInt(),
            naturalBlush = 0xFFFF96A5.toInt(),
            naturalLip = 0xFFE97D8F.toInt(),
            naturalLipShadow = 0xFFC75E72.toInt(),
            defaultHairStyle = HairstyleId.TWIN_BRAIDS,
            defaultHairColorId = "midnight-ink",
            defaultEyeColorId = "warm-hazel",
            defaultBrowColor = 0xFF3C2A24.toInt(),
            defaultOutfitId = OutfitId.BLOSSOM_KIMONO,
            defaultOutfitColorId = "lavender-dream",
            accentColor = 0xFFA855F7.toInt()
        ),
        CharacterModel(
            id = "chloe",
            name = "Chloe",
            title = LocalizedText("Sunny Popstar", "Ngôi Sao Nắng Mai"),
            skinBase = 0xFFEAC09E.toInt(),
            skinLight = 0xFFF7D8BD.toInt(),
            skinShadow = 0xFFCE9B76.toInt(),
            skinNeckShadow = 0xFFBE8964.toInt(),
            earInner = 0xFFD69E7B.toInt(),
            naturalBlush = 0xFFF38B82.toInt(),
            naturalLip = 0xFFD8727D.toInt(),
            naturalLipShadow = 0xFFB45360.toInt(),
            defaultHairStyle = HairstyleId.HIGH_PONYTAIL,
            defaultHairColorId = "caramel-chestnut",
            defaultEyeColorId = "emerald",
            defaultBrowColor = 0xFF5B3A26.toInt(),
            defaultOutfitId = OutfitId.STAR_HOODIE,
            defaultOutfitColorId = "sky-candy",
            accentColor = 0xFF38BDF8.toInt()
        ),
        CharacterModel(
            id = "zara",
            name = "Zara",
            title = LocalizedText("Starlight Fairy", "Tiên Nữ Ánh Sao"),
            skinBase = 0xFFCC9169.toInt(),
            skinLight = 0xFFE0AC87.toInt(),
            skinShadow = 0xFFAC6F48.toInt(),
            skinNeckShadow = 0xFF9B5F3A.toInt(),
            earInner = 0xFFB47652.toInt(),
            naturalBlush = 0xFFE06E7B.toInt(),
            naturalLip = 0xFFB95E6D.toInt(),
            naturalLipShadow = 0xFF944352.toInt(),
            defaultHairStyle = HairstyleId.SPACE_BUNS,
            defaultHairColorId = "cotton-pink",
            defaultEyeColorId = "amethyst",
            defaultBrowColor = 0xFF4A2C22.toInt(),
            defaultOutfitId = OutfitId.FAIRY_TULLE,
            defaultOutfitColorId = "mint-fairy",
            accentColor = 0xFF2DD4BF.toInt()
        ),
        CharacterModel(
            id = "amara",
            name = "Amara",
            title = LocalizedText("Royal Velvet", "Nữ Hoàng Ngọc Trai"),
            skinBase = 0xFF9A6344.toInt(),
            skinLight = 0xFFB47C5B.toInt(),
            skinShadow = 0xFF7A492E.toInt(),
            skinNeckShadow = 0xFF6A3D24.toInt(),
            earInner = 0xFF824E34.toInt(),
            naturalBlush = 0xFFC85E70.toInt(),
            naturalLip = 0xFF9E4B5A.toInt(),
            naturalLipShadow = 0xFF793240.toInt(),
            defaultHairStyle = HairstyleId.CURLY_PUFFS,
            defaultHairColorId = "espresso-noir",
            defaultEyeColorId = "golden-honey",
            defaultBrowColor = 0xFF2C1B15.toInt(),
            defaultOutfitId = OutfitId.ROYAL_VELVET,
            defaultOutfitColorId = "royal-gold",
            accentColor = 0xFFF59E0B.toInt()
        ),
        CharacterModel(
            id = "yuki",
            name = "Yuki",
            title = LocalizedText("Crystal Angel", "Thiên Thần Pha Lê"),
            skinBase = 0xFFFFECE4.toInt(),
            skinLight = 0xFFFFF7F4.toInt(),
            skinShadow = 0xFFF0CBBD.toInt(),
            skinNeckShadow = 0xFFE3B8A8.toInt(),
            earInner = 0xFFF4C4B7.toInt(),
            naturalBlush = 0xFFFFA3BE.toInt(),
            naturalLip = 0xFFF290A8.toInt(),
            naturalLipShadow = 0xFFD16C86.toInt(),
            defaultHairStyle = HairstyleId.SWEET_BOB,
            defaultHairColorId = "lavender-frost",
            defaultEyeColorId = "sky-aqua",
            defaultBrowColor = 0xFF7C6A8C.toInt(),
            defaultOutfitId = OutfitId.PASTEL_SAILOR,
            defaultOutfitColorId = "berry-pop",
            accentColor = 0xFFEC4899.toInt()
        )
    )

    val lipstickSwatches = listOf(
        ColorSwatch("bubblegum", 0xFFFF69B4.toInt(), LocalizedText("Bubblegum", "Hồng Kẹo")),
        ColorSwatch("ruby", 0xFFE11D48.toInt(), LocalizedText("Ruby", "Đỏ Hồng Ngọc")),
        ColorSwatch("rose", 0xFFF472B6.toInt(), LocalizedText("Rose Petal", "Cánh Hồng")),
        ColorSwatch("peach", 0xFFFB7185.toInt(), LocalizedText("Peach", "Cam Đào")),
        ColorSwatch("coral", 0xFFFF6B57.toInt(), LocalizedText("Coral", "San Hô")),
        ColorSwatch("cherry", 0xFFBE123C.toInt(), LocalizedText("Cherry", "Anh Đào")),
        ColorSwatch("berry", 0xFF9D174D.toInt(), LocalizedText("Berry Jam", "Mứt Dâu")),
        ColorSwatch("nude", 0xFFE89B93.toInt(), LocalizedText("Sweet Nude", "Hồng Đất")),
        ColorSwatch("cotton", 0xFFFF9AD5.toInt(), LocalizedText("Cotton Candy", "Hồng Baby")),
        ColorSwatch("lilac", 0xFFC084FC.toInt(), LocalizedText("Lilac", "Tím Oải Hương")),
        ColorSwatch("plum", 0xFF7E22CE.toInt(), LocalizedText("Plum", "Tím Mận")),
        ColorSwatch("magenta", 0xFFDB2777.toInt(), LocalizedText("Popstar", "Hồng Sao")),
        ColorSwatch("tangerine", 0xFFF97316.toInt(), LocalizedText("Tangerine", "Cam Tươi")),
        ColorSwatch("aqua", 0xFF06B6D4.toInt(), LocalizedText("Mermaid", "Xanh Tiên Cá")),
        ColorSwatch("galaxy", 0xFF6366F1.toInt(), LocalizedText("Galaxy", "Ngân Hà")),
        ColorSwatch("gold", 0xFFF59E0B.toInt(), LocalizedText("Gold", "Vàng Ánh Kim"))
    )

    val eyeshadowSwatches = listOf(
        ColorSwatch("sakura", 0xFFFF8AC6.toInt(), LocalizedText("Sakura", "Hồng Đào")),
        ColorSwatch("lavender", 0xFFC084FC.toInt(), LocalizedText("Lilac", "Tím Nhẹ")),
        ColorSwatch("sky", 0xFF38BDF8.toInt(), LocalizedText("Sky Fairy", "Xanh Trời")),
        ColorSwatch("mint", 0xFF34D399.toInt(), LocalizedText("Mint Dew", "Bạc Hà")),
        ColorSwatch("peach", 0xFFFDA4AF.toInt(), LocalizedText("Peach", "Cam Đào")),
        ColorSwatch("gold", 0xFFFBBF24.toInt(), LocalizedText("Sunshine", "Vàng Nắng")),
        ColorSwatch("rosegold", 0xFFF48FB1.toInt(), LocalizedText("Rose Gold", "Vàng Hồng")),
        ColorSwatch("violet", 0xFF8B5CF6.toInt(), LocalizedText("Starlight", "Tím Sao")),
        ColorSwatch("teal", 0xFF14B8A6.toInt(), LocalizedText("Mermaid", "Xanh Ngọc")),
        ColorSwatch("berry", 0xFFEC4899.toInt(), LocalizedText("Berry", "Hồng Dâu")),
        ColorSwatch("champagne", 0xFFFDE68A.toInt(), LocalizedText("Pearl", "Ngọc Trai")),
        ColorSwatch("cocoa", 0xFFB47657.toInt(), LocalizedText("Cocoa", "Nâu Cacao")),
        ColorSwatch("cobalt", 0xFF3B82F6.toInt(), LocalizedText("Sapphire", "Xanh Biển")),
        ColorSwatch("sunset", 0xFFFB923C.toInt(), LocalizedText("Sunset", "Cam Hoàng Hôn")),
        ColorSwatch("emerald", 0xFF10B981.toInt(), LocalizedText("Emerald", "Lục Bảo")),
        ColorSwatch("silver", 0xFFCBD5E1.toInt(), LocalizedText("Crystal", "Bạc Pha Lê"))
    )

    val blushSwatches = listOf(
        ColorSwatch("baby", 0xFFFF85B3.toInt(), LocalizedText("Baby Rose", "Hồng Phấn")),
        ColorSwatch("peach", 0xFFFF9E80.toInt(), LocalizedText("Peach", "Cam Đào")),
        ColorSwatch("strawberry", 0xFFFF5C8D.toInt(), LocalizedText("Strawberry", "Hồng Dâu")),
        ColorSwatch("coral", 0xFFFF7A6B.toInt(), LocalizedText("Coral", "San Hô")),
        ColorSwatch("apricot", 0xFFFFB37B.toInt(), LocalizedText("Apricot", "Mơ Chín")),
        ColorSwatch("berry", 0xFFE15A87.toInt(), LocalizedText("Berry", "Quả Mọng")),
        ColorSwatch("lilac", 0xFFD8A3FF.toInt(), LocalizedText("Fairy Lilac", "Tím Tiên")),
        ColorSwatch("rosewood", 0xFFDC758F.toInt(), LocalizedText("Warm Rose", "Hồng Đất"))
    )

    val highlighterSwatches = listOf(
        ColorSwatch("pearl", 0xFFFFFBEB.toInt(), LocalizedText("Pearl", "Ngọc Trai")),
        ColorSwatch("pinkopal", 0xFFFFE4F3.toInt(), LocalizedText("Pink Opal", "Ánh Hồng")),
        ColorSwatch("golddust", 0xFFFEF08A.toInt(), LocalizedText("Star Gold", "Vàng Sao")),
        ColorSwatch("unicorn", 0xFFBAE6FD.toInt(), LocalizedText("Unicorn", "Xanh Kỳ Lân")),
        ColorSwatch("prism", 0xFFF3E8FF.toInt(), LocalizedText("Lilac Prism", "Tím Pha Lê"))
    )

    val eyelinerColors = listOf(
        ColorSwatch("black", 0xFF1E1B2E.toInt(), LocalizedText("Jet Black", "Đen Tuyền")),
        ColorSwatch("cocoa", 0xFF5C3A2E.toInt(), LocalizedText("Cocoa", "Nâu")),
        ColorSwatch("violet", 0xFF7C3AED.toInt(), LocalizedText("Violet", "Tím")),
        ColorSwatch("pink", 0xFFEC4899.toInt(), LocalizedText("Candy Pink", "Hồng")),
        ColorSwatch("blue", 0xFF0284C7.toInt(), LocalizedText("Ocean", "Xanh Biển")),
        ColorSwatch("emerald", 0xFF059669.toInt(), LocalizedText("Emerald", "Xanh Ngọc")),
        ColorSwatch("gold", 0xFFF59E0B.toInt(), LocalizedText("Gold", "Vàng Kim")),
        ColorSwatch("white", 0xFFFFFFFF.toInt(), LocalizedText("Pearl", "Trắng"))
    )

    val mascaraColors = listOf(
        ColorSwatch("black", 0xFF1E1B2E.toInt(), LocalizedText("Black", "Đen")),
        ColorSwatch("brown", 0xFF5A382C.toInt(), LocalizedText("Brown", "Nâu")),
        ColorSwatch("plum", 0xFF7E22CE.toInt(), LocalizedText("Plum", "Tím")),
        ColorSwatch("sapphire", 0xFF2563EB.toInt(), LocalizedText("Sapphire", "Xanh")),
        ColorSwatch("pink", 0xFFDB2777.toInt(), LocalizedText("Pink", "Hồng")),
        ColorSwatch("teal", 0xFF0D9488.toInt(), LocalizedText("Teal", "Ngọc"))
    )

    val eyeLenses = listOf(
        EyeLensOption("sapphire", 0xFF1D4ED8.toInt(), 0xFF60A5FA.toInt(), 0xFFDBEAFE.toInt(), LocalizedText("Sapphire", "Sapphire")),
        EyeLensOption("warm-hazel", 0xFF6B3E26.toInt(), 0xFFC48A54.toInt(), 0xFFFEF3C7.toInt(), LocalizedText("Hazel", "Hạt Dẻ")),
        EyeLensOption("emerald", 0xFF047857.toInt(), 0xFF34D399.toInt(), 0xFFD1FAE5.toInt(), LocalizedText("Emerald", "Lục Bảo")),
        EyeLensOption("amethyst", 0xFF6D28D9.toInt(), 0xFFC084FC.toInt(), 0xFFF3E8FF.toInt(), LocalizedText("Amethyst", "Thạch Anh")),
        EyeLensOption("rose-quartz", 0xFFBE185D.toInt(), 0xFFF472B6.toInt(), 0xFFFCE7F3.toInt(), LocalizedText("Rose", "Hồng Pha Lê")),
        EyeLensOption("golden-honey", 0xFF92400E.toInt(), 0xFFFBBF24.toInt(), 0xFFFEF9C3.toInt(), LocalizedText("Honey", "Mật Ong")),
        EyeLensOption("sky-aqua", 0xFF0369A1.toInt(), 0xFF38BDF8.toInt(), 0xFFE0F2FE.toInt(), LocalizedText("Sky Aqua", "Xanh Trời")),
        EyeLensOption("galaxy-star", 0xFF312E81.toInt(), 0xFFA855F7.toInt(), 0xFFFDE047.toInt(), LocalizedText("Galaxy", "Ngân Hà")),
        EyeLensOption("midnight-ink", 0xFF1E293B.toInt(), 0xFF64748B.toInt(), 0xFFF8FAFC.toInt(), LocalizedText("Noir", "Đen Huyền")),
        EyeLensOption("mint-crystal", 0xFF0F766E.toInt(), 0xFF5EEAD4.toInt(), 0xFFCCFBF1.toInt(), LocalizedText("Mint", "Bạc Hà"))
    )

    val eyebrowColors = listOf(
        ColorSwatch("eb1", 0xFF2B2129.toInt(), LocalizedText("Black", "Đen")),
        ColorSwatch("eb2", 0xFF4E342E.toInt(), LocalizedText("Dark Brown", "Nâu Đậm")),
        ColorSwatch("eb3", 0xFF795548.toInt(), LocalizedText("Chestnut", "Hạt Dẻ")),
        ColorSwatch("eb4", 0xFFA67C52.toInt(), LocalizedText("Honey", "Vàng Mật")),
        ColorSwatch("eb5", 0xFF9A4B3C.toInt(), LocalizedText("Auburn", "Nâu Đỏ")),
        ColorSwatch("eb6", 0xFFC0568A.toInt(), LocalizedText("Rose", "Hồng Phấn")),
        ColorSwatch("eb7", 0xFF7C62A6.toInt(), LocalizedText("Lilac", "Tím Nhẹ"))
    )

    val hairColors = listOf(
        HairColorOption("honey-blonde", 0xFFF3C669.toInt(), 0xFFFFE8A3.toInt(), 0xFFC68B33.toInt(), 0xFFFF9AD5.toInt(), LocalizedText("Honey Blonde", "Vàng Mật Ong")),
        HairColorOption("midnight-ink", 0xFF2B2940.toInt(), 0xFF525075.toInt(), 0xFF161424.toInt(), 0xFFA855F7.toInt(), LocalizedText("Midnight Black", "Đen Huyền")),
        HairColorOption("caramel-chestnut", 0xFF8C5233.toInt(), 0xFFBA7A52.toInt(), 0xFF5B311B.toInt(), 0xFFFBBF24.toInt(), LocalizedText("Caramel", "Nâu Hạt Dẻ")),
        HairColorOption("espresso-noir", 0xFF3A241E.toInt(), 0xFF634138.toInt(), 0xFF20120F.toInt(), 0xFFF59E0B.toInt(), LocalizedText("Espresso", "Nâu Cà Phê")),
        HairColorOption("strawberry-ginger", 0xFFD96B43.toInt(), 0xFFF89B73.toInt(), 0xFF9E4222.toInt(), 0xFFFDE68A.toInt(), LocalizedText("Ginger", "Cam Hoàng Hôn")),
        HairColorOption("cotton-pink", 0xFFFF8AC6.toInt(), 0xFFFFC4E4.toInt(), 0xFFD14F93.toInt(), 0xFF7DD3FC.toInt(), LocalizedText("Cotton Candy", "Hồng Kẹo")),
        HairColorOption("lavender-frost", 0xFFB794F6.toInt(), 0xFFE1D1FF.toInt(), 0xFF7F56C9.toInt(), 0xFFF9A8D4.toInt(), LocalizedText("Lavender", "Tím Oải Hương")),
        HairColorOption("sky-mermaid", 0xFF38BDF8.toInt(), 0xFF93E4FF.toInt(), 0xFF0284C7.toInt(), 0xFFC4B5FD.toInt(), LocalizedText("Mermaid Sky", "Xanh Biển")),
        HairColorOption("mint-fairy", 0xFF34D399.toInt(), 0xFF8CF4CB.toInt(), 0xFF059669.toInt(), 0xFFFEF08A.toInt(), LocalizedText("Mint Fairy", "Xanh Bạc Hà")),
        HairColorOption("ruby-berry", 0xFFE11D64.toInt(), 0xFFFF6B9E.toInt(), 0xFF9B1144.toInt(), 0xFFFDE047.toInt(), LocalizedText("Berry Rose", "Đỏ Dâu")),
        HairColorOption("galaxy-violet", 0xFF6D28D9.toInt(), 0xFFA78BFA.toInt(), 0xFF431691.toInt(), 0xFF38BDF8.toInt(), LocalizedText("Galaxy", "Tím Ngân Hà")),
        HairColorOption("snow-silver", 0xFFE2E8F0.toInt(), 0xFFFFFFFF.toInt(), 0xFF94A3B8.toInt(), 0xFFF472B6.toInt(), LocalizedText("Silver", "Bạch Kim")),
        HairColorOption("peach-blossom", 0xFFFF9E8A.toInt(), 0xFFFFD0C4.toInt(), 0xFFD46652.toInt(), 0xFFFDE68A.toInt(), LocalizedText("Peach", "Hồng Đào")),
        HairColorOption("rainbow-magic", 0xFFFF7AC6.toInt(), 0xFFFDE047.toInt(), 0xFF8B5CF6.toInt(), 0xFF38BDF8.toInt(), LocalizedText("Rainbow", "Cầu Vồng"), isRainbow = true)
    )

    val outfitColors = listOf(
        OutfitColorTheme("rose-pink", 0xFFFF7EB6.toInt(), 0xFFFFB8D9.toInt(), 0xFFFFF5F9.toInt(), 0xFFE11D74.toInt(), LocalizedText("Rose Princess", "Hồng Công Chúa")),
        OutfitColorTheme("lavender-dream", 0xFFA78BFA.toInt(), 0xFFDDD6FE.toInt(), 0xFFFAF5FF.toInt(), 0xFF7C3AED.toInt(), LocalizedText("Lavender", "Tím Oải Hương")),
        OutfitColorTheme("sky-candy", 0xFF38BDF8.toInt(), 0xFFBAE6FD.toInt(), 0xFFF0F9FF.toInt(), 0xFF0284C7.toInt(), LocalizedText("Sky Blue", "Xanh Thiên Thanh")),
        OutfitColorTheme("mint-fairy", 0xFF34D399.toInt(), 0xFFA7F3D0.toInt(), 0xFFECFDF5.toInt(), 0xFF059669.toInt(), LocalizedText("Mint Fairy", "Xanh Bạc Hà")),
        OutfitColorTheme("royal-gold", 0xFFF59E0B.toInt(), 0xFFFDE68A.toInt(), 0xFFFFFBEB.toInt(), 0xFFB45309.toInt(), LocalizedText("Royal Gold", "Vàng Hoàng Gia")),
        OutfitColorTheme("berry-pop", 0xFFF43F5E.toInt(), 0xFFFDA4AF.toInt(), 0xFFFFF1F2.toInt(), 0xFFBE123C.toInt(), LocalizedText("Ruby Berry", "Đỏ Hồng Ngọc")),
        OutfitColorTheme("peach-cream", 0xFFFB923C.toInt(), 0xFFFED7AA.toInt(), 0xFFFFF7ED.toInt(), 0xFFEA580C.toInt(), LocalizedText("Peach Cream", "Cam Kem Ngọt")),
        OutfitColorTheme("midnight-star", 0xFF4F46E5.toInt(), 0xFFA5B4FC.toInt(), 0xFFFEF08A.toInt(), 0xFF312E81.toInt(), LocalizedText("Starlight Navy", "Xanh Đêm Sao"))
    )

    fun characterById(id: String): CharacterModel =
        characters.firstOrNull { it.id == id } ?: characters.first()

    fun hairColorById(id: String): HairColorOption =
        hairColors.firstOrNull { it.id == id } ?: hairColors.first()

    fun eyeLensById(id: String): EyeLensOption =
        eyeLenses.firstOrNull { it.id == id } ?: eyeLenses.first()

    fun outfitColorById(id: String): OutfitColorTheme =
        outfitColors.firstOrNull { it.id == id } ?: outfitColors.first()

    fun initialMakeover(characterId: String): MakeoverState {
        val c = characterById(characterId)
        return MakeoverState(
            characterId = c.id,
            eyeColorId = c.defaultEyeColorId,
            eyebrowColor = c.defaultBrowColor,
            hairStyle = c.defaultHairStyle,
            hairColorId = c.defaultHairColorId,
            outfitId = c.defaultOutfitId,
            outfitColorId = c.defaultOutfitColorId
        )
    }
}
