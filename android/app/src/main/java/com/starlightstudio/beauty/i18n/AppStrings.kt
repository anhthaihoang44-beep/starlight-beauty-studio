package com.starlightstudio.beauty.i18n

import com.starlightstudio.beauty.model.*

object AppStrings {
    fun appName(l: Language) = pick(l, "Starlight Beauty Studio", "Tiệm Trang Điểm Ánh Sao")
    fun tagline(l: Language) = pick(l, "Sparkle, Paint, Style & Shine!", "Trang điểm, Tạo kiểu & Tỏa sáng!")
    fun badgeSafe(l: Language) = pick(l, "100% Free & Kid-Safe", "Mở Khóa 100% • An Toàn Cho Bé")
    fun chooseModel(l: Language) = pick(l, "Choose Your Model", "Chọn Người Mẫu Của Bé")
    fun startMakeover(l: Language) = pick(l, "Start Makeover", "Bắt Đầu Trang Điểm")
    fun lookbook(l: Language) = pick(l, "Lookbook", "Bộ Sưu Tập")
    fun models(l: Language) = pick(l, "Models", "Người Mẫu")
    fun photo(l: Language) = pick(l, "Photo", "Chụp Ảnh")
    fun backToSalon(l: Language) = pick(l, "Back", "Quay Lại")
    fun surprise(l: Language) = pick(l, "Surprise!", "Ngẫu Nhiên")
    fun magicFill(l: Language) = pick(l, "Magic Fill", "Tô Tự Động")
    fun takePhoto(l: Language) = pick(l, "Take Photo!", "Chụp Ảnh Ngay!")
    fun sharePhoto(l: Language) = pick(l, "Share / Save", "Chia Sẻ / Lưu")
    fun savedToast(l: Language) = pick(l, "Saved to Lookbook!", "Đã lưu vào Bộ Sưu Tập!")
    fun galleryTitle(l: Language) = pick(l, "My Beauty Lookbook", "Bộ Sưu Tập Của Bé")
    fun galleryEmpty(l: Language) = pick(
        l,
        "No photos yet! Style a model and snap a magical photo.",
        "Chưa có ảnh nào! Hãy trang điểm và chụp ngay một bức ảnh xinh nhé."
    )

    fun categoryLabel(cat: SalonCategory, l: Language) = when (cat) {
        SalonCategory.SPA -> pick(l, "Spa", "Spa")
        SalonCategory.MAKEUP -> pick(l, "Makeup", "Trang Điểm")
        SalonCategory.EYES -> pick(l, "Eyes", "Đôi Mắt")
        SalonCategory.HAIR -> pick(l, "Hair", "Kiểu Tóc")
        SalonCategory.DRESS -> pick(l, "Outfits", "Trang Phục")
        SalonCategory.ACCESSORIES -> pick(l, "Extras", "Phụ Kiện")
        SalonCategory.STICKERS -> pick(l, "Gems", "Sticker")
    }

    fun makeupToolLabel(tool: MakeupToolId, l: Language) = when (tool) {
        MakeupToolId.LIPSTICK -> pick(l, "Lipstick", "Son Môi")
        MakeupToolId.EYESHADOW -> pick(l, "Shadow", "Phấn Mắt")
        MakeupToolId.BLUSH -> pick(l, "Blush", "Má Hồng")
        MakeupToolId.HIGHLIGHTER -> pick(l, "Glow", "Bắt Sáng")
        MakeupToolId.EYELINER -> pick(l, "Liner", "Kẻ Mắt")
        MakeupToolId.MASCARA -> pick(l, "Mascara", "Chuốt Mi")
        MakeupToolId.REMOVER -> pick(l, "Wipe", "Tẩy Trang")
    }

    fun makeupHint(tool: MakeupToolId, l: Language) = when (tool) {
        MakeupToolId.LIPSTICK -> pick(l, "Drag across lips to paint!", "Kéo ngón tay lên môi để tô son!")
        MakeupToolId.EYESHADOW -> pick(l, "Brush gently over the eyelids!", "Quét nhẹ lên bầu mắt nhé!")
        MakeupToolId.BLUSH -> pick(l, "Swirl softly on both cheeks!", "Xoa nhẹ lên hai má nhé!")
        MakeupToolId.HIGHLIGHTER -> pick(l, "Add shimmer to cheeks & nose!", "Quét nhũ bắt sáng lên má & mũi!")
        MakeupToolId.EYELINER -> pick(l, "Swipe lashes or pick a wing!", "Kéo viền mắt hoặc chọn dáng kẻ!")
        MakeupToolId.MASCARA -> pick(l, "Brush lashes for doll curl!", "Chuốt mi cong vút xinh xắn!")
        MakeupToolId.REMOVER -> pick(l, "Rub anywhere to wipe clean!", "Chà nhẹ để tẩy trang sạch mịn!")
    }

    fun spaToolLabel(tool: SpaToolId, l: Language) = when (tool) {
        SpaToolId.CLEANSER -> pick(l, "Bubble Wash", "Sữa Rửa Mặt")
        SpaToolId.MASK -> pick(l, "Pearl Mask", "Mặt Nạ Ngọc")
        SpaToolId.RINSE -> pick(l, "Magic Rinse", "Rửa Sạch")
        SpaToolId.PRIMER -> pick(l, "Glow Serum", "Tinh Chất Sáng")
    }

    fun spaHint(tool: SpaToolId, l: Language) = when (tool) {
        SpaToolId.CLEANSER -> pick(l, "Rub face to make bubbly foam!", "Xoa lên mặt để tạo bọt sạch mịn!")
        SpaToolId.MASK -> pick(l, "Brush silky spa mask onto face!", "Thoa mặt nạ dưỡng da lên mặt!")
        SpaToolId.RINSE -> pick(l, "Swipe to rinse foam & mask!", "Lướt nhẹ để rửa sạch bọt & mặt nạ!")
        SpaToolId.PRIMER -> pick(l, "Brush for magical sparkle glow!", "Quét để làn da tỏa sáng lung linh!")
    }

    fun lipFinishLabel(f: LipFinish, l: Language) = when (f) {
        LipFinish.MATTE -> pick(l, "Matte", "Lì")
        LipFinish.GLOSSY -> pick(l, "Glossy", "Bóng")
        LipFinish.GLITTER -> pick(l, "Glitter", "Kim Tuyến")
    }

    fun shadowFinishLabel(f: EyeshadowFinish, l: Language) = when (f) {
        EyeshadowFinish.MATTE -> pick(l, "Matte", "Lì")
        EyeshadowFinish.SHIMMER -> pick(l, "Shimmer", "Nhũ Sáng")
    }

    fun eyelinerName(s: EyelinerStyleId, l: Language) = when (s) {
        EyelinerStyleId.NONE -> pick(l, "None", "Không")
        EyelinerStyleId.CLASSIC -> pick(l, "Classic", "Cánh Mỏng")
        EyelinerStyleId.PUPPY -> pick(l, "Puppy", "Mắt Cún")
        EyelinerStyleId.CAT -> pick(l, "Cat Glam", "Mắt Mèo")
        EyelinerStyleId.DOUBLE_STAR -> pick(l, "Star Wing", "Cánh Sao")
        EyelinerStyleId.GLITTER_WING -> pick(l, "Glitter", "Nhũ Sáng")
    }

    fun mascaraName(s: MascaraStyleId, l: Language) = when (s) {
        MascaraStyleId.NATURAL -> pick(l, "Natural", "Tự Nhiên")
        MascaraStyleId.CURLED -> pick(l, "Doll Curl", "Cong Búp Bê")
        MascaraStyleId.BUTTERFLY -> pick(l, "Butterfly", "Cánh Bướm")
        MascaraStyleId.STARLIGHT -> pick(l, "Starlight", "Ánh Sao")
        MascaraStyleId.PRINCESS -> pick(l, "Princess", "Công Chúa")
    }

    fun eyebrowName(s: EyebrowStyleId, l: Language) = when (s) {
        EyebrowStyleId.SOFT_ARCH -> pick(l, "Soft Arch", "Cong Dịu")
        EyebrowStyleId.SWEET_STRAIGHT -> pick(l, "Straight", "Ngang Xinh")
        EyebrowStyleId.GLAM_WING -> pick(l, "Glam Arch", "Quý Phái")
        EyebrowStyleId.CUTE_ROUND -> pick(l, "Cute Round", "Tròn Xinh")
    }

    fun hairStyleName(s: HairstyleId, l: Language) = when (s) {
        HairstyleId.PRINCESS_WAVES -> pick(l, "Princess Waves", "Sóng Công Chúa")
        HairstyleId.SPACE_BUNS -> pick(l, "Space Buns", "Búi Đôi Xinh")
        HairstyleId.TWIN_BRAIDS -> pick(l, "Sweet Braids", "Bím Hai Bên")
        HairstyleId.SWEET_BOB -> pick(l, "Cute Bob", "Tóc Ngắn Bob")
        HairstyleId.HIGH_PONYTAIL -> pick(l, "Star Ponytail", "Đuôi Ngựa")
        HairstyleId.CURLY_PUFFS -> pick(l, "Cloud Puffs", "Xoăn Bồng Bềnh")
        HairstyleId.RIBBON_HALFUP -> pick(l, "Half-Up Bow", "Buộc Nửa Nơ")
        HairstyleId.FAIRY_CURLS -> pick(l, "Fairy Curls", "Xoăn Tiên Nữ")
    }

    fun outfitName(o: OutfitId, l: Language) = when (o) {
        OutfitId.PRINCESS_GOWN -> pick(l, "Princess Gown", "Váy Công Chúa")
        OutfitId.FAIRY_TULLE -> pick(l, "Fairy Tulle", "Đầm Tiên Nữ")
        OutfitId.PASTEL_SAILOR -> pick(l, "Sailor Bow", "Áo Thủy Thủ")
        OutfitId.STAR_HOODIE -> pick(l, "Star Hoodie", "Áo Hoodie Sao")
        OutfitId.BUTTERFLY_DRESS -> pick(l, "Butterfly Dress", "Đầm Cánh Bướm")
        OutfitId.ROYAL_VELVET -> pick(l, "Royal Velvet", "Váy Nhung")
        OutfitId.MERMAID_TOP -> pick(l, "Mermaid Top", "Áo Tiên Cá")
        OutfitId.BLOSSOM_KIMONO -> pick(l, "Sakura Robe", "Áo Hoa Đào")
    }

    fun headwearName(h: HeadwearId, l: Language) = when (h) {
        HeadwearId.NONE -> pick(l, "None", "Không")
        HeadwearId.CRYSTAL_TIARA -> pick(l, "Crystal Tiara", "Vương Miện")
        HeadwearId.FLOWER_CROWN -> pick(l, "Flower Crown", "Vòng Hoa")
        HeadwearId.CAT_EARS -> pick(l, "Cat Ears", "Tai Mèo")
        HeadwearId.VELVET_BOW -> pick(l, "Princess Bow", "Nơ Công Chúa")
        HeadwearId.BUTTERFLY_CLIPS -> pick(l, "Butterfly Clips", "Kẹp Bướm")
        HeadwearId.STAR_HALO -> pick(l, "Star Halo", "Vòng Sao")
        HeadwearId.PEARL_BAND -> pick(l, "Pearl Band", "Bờm Ngọc Trai")
    }

    fun earringName(e: EarringId, l: Language) = when (e) {
        EarringId.NONE -> pick(l, "None", "Không")
        EarringId.PEARL_DROPS -> pick(l, "Pearl Drops", "Ngọc Trai")
        EarringId.STAR_STUDS -> pick(l, "Star Studs", "Ngôi Sao")
        EarringId.HEART_HOOPS -> pick(l, "Pink Hearts", "Trái Tim")
        EarringId.CRYSTAL_DROPS -> pick(l, "Crystals", "Pha Lê")
        EarringId.SAKURA_DROPS -> pick(l, "Sakura", "Hoa Đào")
        EarringId.BUTTERFLY_STUDS -> pick(l, "Butterflies", "Bướm Xinh")
    }

    fun necklaceName(n: NecklaceId, l: Language) = when (n) {
        NecklaceId.NONE -> pick(l, "None", "Không")
        NecklaceId.PEARL_CHOKER -> pick(l, "Pearl Choker", "Vòng Ngọc Trai")
        NecklaceId.HEART_PENDANT -> pick(l, "Heart Locket", "Mặt Trái Tim")
        NecklaceId.STAR_GEM -> pick(l, "Star Gem", "Đá Ngôi Sao")
        NecklaceId.RIBBON_CHOKER -> pick(l, "Velvet Ribbon", "Ruy Băng Nơ")
        NecklaceId.FLOWER_GARLAND -> pick(l, "Blossom Chain", "Dây Hoa")
        NecklaceId.ROYAL_COLLAR -> pick(l, "Royal Jewels", "Vòng Hoàng Gia")
    }

    fun glassesName(g: GlassesId, l: Language) = when (g) {
        GlassesId.NONE -> pick(l, "None", "Không")
        GlassesId.HEART_SHADES -> pick(l, "Heart Shades", "Kính Trái Tim")
        GlassesId.STAR_GLASSES -> pick(l, "Star Pop", "Kính Ngôi Sao")
        GlassesId.ROUND_PASTEL -> pick(l, "Cute Round", "Kính Tròn")
        GlassesId.CAT_EYE_GLAM -> pick(l, "Cat-Eye", "Kính Mắt Mèo")
    }

    fun wingsName(w: WingsId, l: Language) = when (w) {
        WingsId.NONE -> pick(l, "None", "Không")
        WingsId.FAIRY_IRIDESCENT -> pick(l, "Fairy Glow", "Cánh Tiên")
        WingsId.ANGEL_FEATHER -> pick(l, "Angel Wings", "Cánh Thiên Thần")
        WingsId.BUTTERFLY_PINK -> pick(l, "Pink Butterfly", "Cánh Bướm Hồng")
        WingsId.STARLIGHT_CRYSTAL -> pick(l, "Crystal Star", "Cánh Pha Lê")
    }

    fun stickerName(s: StickerTypeId, l: Language) = when (s) {
        StickerTypeId.STAR_GEM -> pick(l, "Star Gem", "Đá Sao")
        StickerTypeId.PINK_HEART -> pick(l, "Heart", "Trái Tim")
        StickerTypeId.CRYSTAL_DROP -> pick(l, "Crystal", "Pha Lê")
        StickerTypeId.BUTTERFLY -> pick(l, "Butterfly", "Bướm")
        StickerTypeId.RAINBOW -> pick(l, "Rainbow", "Cầu Vồng")
        StickerTypeId.SAKURA -> pick(l, "Sakura", "Hoa Đào")
        StickerTypeId.MOON -> pick(l, "Moon", "Mặt Trăng")
        StickerTypeId.FRECKLES -> pick(l, "Freckles", "Tàn Nhang")
        StickerTypeId.PEARLS -> pick(l, "Pearls", "Ngọc Trai")
        StickerTypeId.DIAMOND -> pick(l, "Diamond", "Kim Cương")
        StickerTypeId.CANDY_BOW -> pick(l, "Mini Bow", "Nơ Xinh")
        StickerTypeId.SPARKLE_DUST -> pick(l, "Sparkles", "Kim Tuyến")
    }

    fun backgroundName(b: BackgroundId, l: Language) = when (b) {
        BackgroundId.VANITY_PINK -> pick(l, "Dreamy Vanity", "Gương Xinh")
        BackgroundId.SAKURA_GARDEN -> pick(l, "Sakura Garden", "Vườn Hoa Đào")
        BackgroundId.STARLIGHT_PALACE -> pick(l, "Star Palace", "Lâu Đài Sao")
        BackgroundId.RAINBOW_CLOUDS -> pick(l, "Rainbow Sky", "Mây Cầu Vồng")
        BackgroundId.BUTTERFLY_MEADOW -> pick(l, "Fairy Meadow", "Đồng Cỏ Tiên")
        BackgroundId.ROYAL_CARPET -> pick(l, "Star Stage", "Sân Khấu Sao")
    }

    fun frameName(f: FrameId, l: Language) = when (f) {
        FrameId.NONE -> pick(l, "Clean", "Không Khung")
        FrameId.POLAROID_CUTE -> pick(l, "Polaroid", "Polaroid")
        FrameId.ROYAL_GOLD -> pick(l, "Royal Gold", "Hoàng Gia")
        FrameId.MAGAZINE_STAR -> pick(l, "Magazine", "Tạp Chí")
        FrameId.SPARKLE_HEARTS -> pick(l, "Hearts", "Trái Tim")
    }

    fun expressionName(e: ExpressionId, l: Language) = when (e) {
        ExpressionId.SMILE -> pick(l, "😊 Smile", "😊 Cười Dịu")
        ExpressionId.WINK -> pick(l, "😉 Wink", "😉 Nháy Mắt")
        ExpressionId.HAPPY -> pick(l, "😄 Laugh", "😄 Cười Tươi")
        ExpressionId.KISSY -> pick(l, "😘 Kissy", "😘 Chu Môi")
        ExpressionId.STARRY -> pick(l, "🤩 Starry", "🤩 Mắt Sao")
    }

    private fun pick(l: Language, en: String, vi: String) = if (l == Language.EN) en else vi
}
