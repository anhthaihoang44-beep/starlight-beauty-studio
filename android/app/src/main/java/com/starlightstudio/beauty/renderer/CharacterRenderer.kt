package com.starlightstudio.beauty.renderer

import android.graphics.*
import com.starlightstudio.beauty.model.*
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt

// 100% Native Android Canvas character & makeover renderer (600 x 800 logical stage)
// Used for live 60fps Compose rendering AND crisp 900 x 1200 PNG Photo Booth export!
object CharacterRenderer {

    fun renderHighResPhoto(
        state: MakeoverState,
        buffers: MakeupPaintBuffers,
        outWidth: Int = 900,
        outHeight: Int = 1200
    ): Bitmap {
        val bmp = Bitmap.createBitmap(outWidth, outHeight, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bmp)
        drawFullScene(
            canvas = canvas,
            width = outWidth.toFloat(),
            height = outHeight.toFloat(),
            state = state,
            buffers = buffers,
            isBlinking = false,
            showFrame = true,
            includeBackground = true
        )
        return bmp
    }

    fun drawPortraitPreview(
        canvas: Canvas,
        width: Float,
        height: Float,
        character: CharacterModel
    ) {
        val state = BeautyCatalog.initialMakeover(character.id)
        canvas.save()
        // Frame head, shoulders, waist & arms cleanly (55..545, 95..745)
        val scale = minOf(width / 490f, height / 650f)
        val dx = (width - 490f * scale) / 2f
        val dy = (height - 650f * scale) / 2f
        canvas.translate(dx - 55f * scale, dy - 95f * scale)
        canvas.scale(scale, scale)
        drawStageCoordinateSpace(
            canvas = canvas,
            state = state,
            buffers = null,
            isBlinking = false,
            showFrame = false,
            includeBackground = false
        )
        canvas.restore()
    }

    fun drawFullScene(
        canvas: Canvas,
        width: Float,
        height: Float,
        state: MakeoverState,
        buffers: MakeupPaintBuffers?,
        isBlinking: Boolean,
        showFrame: Boolean,
        includeBackground: Boolean = true,
        cursorX: Float? = null,
        cursorY: Float? = null,
        activeCategory: SalonCategory? = null,
        activeMakeupTool: MakeupToolId = MakeupToolId.LIPSTICK,
        activeSpaTool: SpaToolId = SpaToolId.CLEANSER,
        activeToolColor: Int = 0xFFFF69B4.toInt(),
        particles: List<SparkleParticle> = emptyList()
    ) {
        canvas.save()
        canvas.scale(width / StageGeometry.W, height / StageGeometry.H)
        drawStageCoordinateSpace(
            canvas = canvas,
            state = state,
            buffers = buffers,
            isBlinking = isBlinking,
            showFrame = showFrame,
            includeBackground = includeBackground
        )

        // Particles
        val pPaint = Paint(Paint.ANTI_ALIAS_FLAG)
        for (p in particles) {
            pPaint.alpha = (p.alpha.coerceIn(0f, 1f) * 255f).toInt()
            if (p.isBubble) {
                pPaint.style = Paint.Style.FILL
                pPaint.color = 0x77BAE6FD
                canvas.drawCircle(p.x, p.y, p.size, pPaint)
                pPaint.style = Paint.Style.STROKE
                pPaint.strokeWidth = 1.8f
                pPaint.color = Color.WHITE
                canvas.drawCircle(p.x, p.y, p.size, pPaint)
            } else {
                pPaint.style = Paint.Style.FILL
                pPaint.color = p.color
                drawFourPointStar(canvas, p.x, p.y, p.size, pPaint)
            }
        }

        // Active held cosmetic tool cursor
        if (cursorX != null && cursorY != null && (activeCategory == SalonCategory.MAKEUP || activeCategory == SalonCategory.SPA)) {
            drawToolCursor(canvas, cursorX, cursorY, activeCategory == SalonCategory.SPA, activeMakeupTool, activeSpaTool, activeToolColor)
        }
        canvas.restore()
    }

    private fun drawStageCoordinateSpace(
        canvas: Canvas,
        state: MakeoverState,
        buffers: MakeupPaintBuffers?,
        isBlinking: Boolean,
        showFrame: Boolean,
        includeBackground: Boolean
    ) {
        val character = BeautyCatalog.characterById(state.characterId)
        val hairColor = BeautyCatalog.hairColorById(state.hairColorId)
        val eyeLens = BeautyCatalog.eyeLensById(state.eyeColorId)
        val outfitTheme = BeautyCatalog.outfitColorById(state.outfitColorId)

        if (includeBackground) {
            drawBackground(canvas, state.backgroundId)
        }

        drawWings(canvas, state.wingsId)
        drawHairBack(canvas, state.hairStyle, hairColor, state.hairHighlightEnabled)
        drawFaceBase(canvas, character)
        drawOutfitBodyAndSkirt(canvas, state.outfitId, outfitTheme)
        drawArmsAndHands(canvas, character)
        drawOutfitSleevesAndTopDetails(canvas, state.outfitId, outfitTheme)
        drawNecklace(canvas, state.necklaceId)
        drawEarrings(canvas, state.earringId)

        // Interactive Canvas Paint Layers sandwiched between skin and eyes/lashes/hair bangs!
        if (buffers != null) {
            canvas.drawBitmap(buffers.skinBitmap, 0f, 0f, null)
            canvas.drawBitmap(buffers.spaBitmap, 0f, 0f, null)
            canvas.drawBitmap(buffers.eyeshadowBitmap, 0f, 0f, null)
            if (state.expression != ExpressionId.HAPPY) {
                if (state.expression == ExpressionId.KISSY) {
                    canvas.save()
                    canvas.scale(0.68f, 0.94f, StageGeometry.LIPS_X, StageGeometry.LIPS_Y)
                    canvas.drawBitmap(buffers.lipBitmap, 0f, 0f, null)
                    canvas.restore()
                } else {
                    canvas.drawBitmap(buffers.lipBitmap, 0f, 0f, null)
                }
            }
        }

        drawFaceTopFeatures(canvas, character, eyeLens, state, isBlinking)
        drawHairFront(canvas, state.hairStyle, hairColor, state.hairHighlightEnabled)

        for (st in state.stickers) {
            drawSticker(canvas, st.type, st.x, st.y, st.scale, st.rotation)
        }

        drawGlasses(canvas, state.glassesId)
        drawHeadwear(canvas, state.headwearId)

        if (showFrame) {
            drawPhotoFrame(canvas, state.frameId, character.name)
        }
    }

    private fun drawBackground(canvas: Canvas, bg: BackgroundId) {
        val p = Paint(Paint.ANTI_ALIAS_FLAG)
        val colors = when (bg) {
            BackgroundId.VANITY_PINK -> intArrayOf(0xFFFFE6F3.toInt(), 0xFFFFF0FA.toInt(), 0xFFF5D5FF.toInt())
            BackgroundId.SAKURA_GARDEN -> intArrayOf(0xFFBAE6FD.toInt(), 0xFFFFE4F2.toInt(), 0xFFFBCFE8.toInt())
            BackgroundId.STARLIGHT_PALACE -> intArrayOf(0xFF1E1B4B.toInt(), 0xFF581C87.toInt(), 0xFFC084FC.toInt())
            BackgroundId.RAINBOW_CLOUDS -> intArrayOf(0xFFBAE6FD.toInt(), 0xFFE9D5FF.toInt(), 0xFFFBCFE8.toInt(), 0xFFFEF08A.toInt())
            BackgroundId.BUTTERFLY_MEADOW -> intArrayOf(0xFFE0F2FE.toInt(), 0xFFFEF9C3.toInt(), 0xFFA7F3D0.toInt())
            BackgroundId.ROYAL_CARPET -> intArrayOf(0xFF4A044E.toInt(), 0xFF9D174D.toInt(), 0xFFF472B6.toInt())
        }
        p.shader = LinearGradient(0f, 0f, 0f, 800f, colors, null, Shader.TileMode.CLAMP)
        canvas.drawRect(0f, 0f, 600f, 800f, p)
        p.shader = null

        when (bg) {
            BackgroundId.VANITY_PINK -> {
                p.color = 0x38FFFFFF
                for (i in 0..7) canvas.drawRect(i * 80f, 0f, i * 80f + 40f, 800f, p)
                p.color = 0x73FFFFFF
                canvas.drawCircle(300f, 360f, 244f, p)
                p.style = Paint.Style.STROKE
                p.strokeWidth = 10f
                p.color = 0xB5FFB8DC.toInt()
                canvas.drawCircle(300f, 360f, 228f, p)
                p.style = Paint.Style.FILL
                for (i in 0 until 14) {
                    val a = i * (2.0 * PI / 14.0)
                    val bx = (300.0 + cos(a) * 228.0).toFloat()
                    val by = (360.0 + sin(a) * 228.0).toFloat()
                    p.color = 0x70FEF08A
                    canvas.drawCircle(bx, by, 14f, p)
                    p.color = 0xFFFFFDF7.toInt()
                    canvas.drawCircle(bx, by, 7.5f, p)
                }
            }
            BackgroundId.STARLIGHT_PALACE -> {
                p.color = 0xEBFEF9C3.toInt()
                canvas.drawCircle(480f, 120f, 52f, p)
                p.color = 0x38FEF08A
                canvas.drawCircle(480f, 120f, 76f, p)
                p.color = 0xEBFFFBEB.toInt()
                listOf(80f to 90f, 180f to 66f, 360f to 82f, 96f to 230f, 520f to 250f, 68f to 410f, 530f to 440f).forEach { (x, y) ->
                    drawFourPointStar(canvas, x, y, 10f, p)
                }
            }
            BackgroundId.RAINBOW_CLOUDS -> {
                p.style = Paint.Style.STROKE
                p.strokeWidth = 22f
                listOf(0x8CFF8AC6.toInt() to 270f, 0x8CFDE047.toInt() to 248f, 0x8C6EE7B7.toInt() to 226f, 0x8C7DD3FC.toInt() to 204f).forEach { (c, r) ->
                    p.color = c
                    canvas.drawArc(300f - r, 480f - r, 300f + r, 480f + r, 180f, 180f, false, p)
                }
                p.style = Paint.Style.FILL
                p.color = 0xDDFFFFFF.toInt()
                listOf(90f to 140f, 136f to 146f, 508f to 170f, 464f to 176f, 96f to 640f, 506f to 640f).forEach { (x, y) ->
                    canvas.drawCircle(x, y, 42f, p)
                }
            }
            BackgroundId.SAKURA_GARDEN -> {
                listOf(70f to 96f, 140f to 78f, 470f to 96f, 536f to 118f, 92f to 260f, 510f to 290f).forEach { (x, y) ->
                    drawSticker(canvas, StickerTypeId.SAKURA, x, y, 1.25f, 0f)
                }
            }
            BackgroundId.BUTTERFLY_MEADOW -> {
                p.color = 0xDDFEF08A.toInt()
                canvas.drawCircle(110f, 110f, 52f, p)
                p.color = 0x996EE7B7.toInt()
                canvas.drawOval(-60f, 590f, 660f, 900f, p)
                drawSticker(canvas, StickerTypeId.BUTTERFLY, 92f, 230f, 1.3f, -15f)
                drawSticker(canvas, StickerTypeId.BUTTERFLY, 506f, 190f, 1.3f, 15f)
            }
            BackgroundId.ROYAL_CARPET -> {
                p.color = 0x22FFFBEB
                val beam1 = Path().apply { moveTo(80f, 0f); lineTo(240f, 0f); lineTo(380f, 800f); lineTo(180f, 800f); close() }
                val beam2 = Path().apply { moveTo(360f, 0f); lineTo(520f, 0f); lineTo(420f, 800f); lineTo(220f, 800f); close() }
                canvas.drawPath(beam1, p)
                canvas.drawPath(beam2, p)
                p.color = 0x38FEF08A
                listOf(72f to 130f, 520f to 140f, 110f to 360f, 495f to 390f).forEach { (x, y) ->
                    canvas.drawCircle(x, y, 26f, p)
                }
            }
        }
    }

    private fun drawWings(canvas: Canvas, wingsId: WingsId) {
        if (wingsId == WingsId.NONE) return
        val fill = Paint(Paint.ANTI_ALIAS_FLAG)
        val stroke = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE
            strokeWidth = 3.5f
            color = Color.WHITE
        }
        when (wingsId) {
            WingsId.FAIRY_IRIDESCENT, WingsId.BUTTERFLY_PINK -> {
                fill.shader = if (wingsId == WingsId.FAIRY_IRIDESCENT) {
                    LinearGradient(40f, 400f, 560f, 700f, intArrayOf(0xDDA5F3FC.toInt(), 0xDDF5D0FE.toInt(), 0xDDFDE68A.toInt()), null, Shader.TileMode.CLAMP)
                } else {
                    LinearGradient(40f, 400f, 560f, 700f, intArrayOf(0xEAFF7AC6.toInt(), 0xEAC084FC.toInt(), 0xEAFDE047.toInt()), null, Shader.TileMode.CLAMP)
                }
                val leftUpper = Path().apply { moveTo(248f, 540f); cubicTo(166f, 424f, 52f, 382f, 42f, 462f); cubicTo(34f, 524f, 118f, 570f, 210f, 582f); close() }
                val leftLower = Path().apply { moveTo(226f, 588f); cubicTo(148f, 584f, 68f, 624f, 92f, 686f); cubicTo(112f, 732f, 186f, 704f, 232f, 632f); close() }
                val rightUpper = Path().apply { moveTo(352f, 540f); cubicTo(434f, 424f, 548f, 382f, 558f, 462f); cubicTo(566f, 524f, 482f, 570f, 390f, 582f); close() }
                val rightLower = Path().apply { moveTo(374f, 588f); cubicTo(452f, 584f, 532f, 624f, 508f, 686f); cubicTo(488f, 732f, 414f, 704f, 368f, 632f); close() }
                listOf(leftUpper, leftLower, rightUpper, rightLower).forEach {
                    canvas.drawPath(it, fill)
                    canvas.drawPath(it, stroke)
                }
            }
            WingsId.ANGEL_FEATHER -> {
                fill.color = Color.WHITE
                stroke.color = 0xFFE2E8F0.toInt()
                val l = Path().apply {
                    moveTo(234f, 548f); cubicTo(168f, 456f, 70f, 434f, 46f, 494f)
                    cubicTo(82f, 522f, 128f, 536f, 178f, 552f); cubicTo(110f, 546f, 56f, 566f, 62f, 608f)
                    cubicTo(102f, 618f, 152f, 608f, 198f, 594f); cubicTo(138f, 614f, 92f, 648f, 112f, 684f)
                    cubicTo(156f, 688f, 206f, 654f, 238f, 614f); close()
                }
                val r = Path().apply {
                    moveTo(366f, 548f); cubicTo(432f, 456f, 530f, 434f, 554f, 494f)
                    cubicTo(518f, 522f, 472f, 536f, 422f, 552f); cubicTo(490f, 546f, 544f, 566f, 538f, 608f)
                    cubicTo(498f, 618f, 448f, 608f, 402f, 594f); cubicTo(462f, 614f, 508f, 648f, 488f, 684f)
                    cubicTo(444f, 688f, 394f, 654f, 362f, 614f); close()
                }
                canvas.drawPath(l, fill); canvas.drawPath(l, stroke)
                canvas.drawPath(r, fill); canvas.drawPath(r, stroke)
            }
            WingsId.STARLIGHT_CRYSTAL -> {
                fill.color = 0xD2E0F2FE.toInt()
                stroke.color = 0xFF7DD3FC.toInt()
                val l = Path().apply { moveTo(240f, 564f); lineTo(60f, 420f); lineTo(112f, 544f); lineTo(46f, 574f); lineTo(152f, 608f); lineTo(86f, 692f); lineTo(224f, 626f); close() }
                val r = Path().apply { moveTo(360f, 564f); lineTo(540f, 420f); lineTo(488f, 544f); lineTo(554f, 574f); lineTo(448f, 608f); lineTo(514f, 692f); lineTo(376f, 626f); close() }
                canvas.drawPath(l, fill); canvas.drawPath(l, stroke)
                canvas.drawPath(r, fill); canvas.drawPath(r, stroke)
            }
            WingsId.NONE -> Unit
        }
    }

    private fun hairMainPaint(color: HairColorOption): Paint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        shader = if (color.isRainbow) {
            LinearGradient(140f, 140f, 460f, 660f, intArrayOf(0xFFFF7AC6.toInt(), 0xFFFDE047.toInt(), 0xFF67E8F9.toInt(), 0xFFA78BFA.toInt()), null, Shader.TileMode.CLAMP)
        } else {
            LinearGradient(160f, 140f, 440f, 660f, intArrayOf(color.highlight, color.primary, color.shadow), null, Shader.TileMode.CLAMP)
        }
    }

    private fun hairDeepPaint(color: HairColorOption): Paint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        shader = LinearGradient(300f, 140f, 300f, 680f, intArrayOf(color.primary, color.shadow), null, Shader.TileMode.CLAMP)
    }

    private fun drawHairBack(canvas: Canvas, hairStyle: HairstyleId, color: HairColorOption, highlight: Boolean) {
        val main = hairMainPaint(color)
        val deep = hairDeepPaint(color)
        val outline = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE
            strokeWidth = 3f
            this.color = color.shadow
        }
        val streakP = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE
            strokeWidth = 14f
            strokeCap = Paint.Cap.ROUND
            this.color = (color.streak and 0x00FFFFFF) or (0xB8 shl 24)
        }

        val backCap = Path().apply {
            moveTo(174f, 264f)
            cubicTo(170f, 340f, 180f, 424f, 214f, 462f)
            lineTo(386f, 462f)
            cubicTo(420f, 424f, 430f, 340f, 426f, 264f)
            cubicTo(414f, 174f, 366f, 138f, 300f, 138f)
            cubicTo(234f, 138f, 186f, 174f, 174f, 264f)
            close()
        }

        when (hairStyle) {
            HairstyleId.PRINCESS_WAVES, HairstyleId.FAIRY_CURLS -> {
                val p = Path().apply {
                    moveTo(162f, 260f)
                    cubicTo(136f, 350f, 128f, 480f, 146f, 610f)
                    cubicTo(160f, 660f, 198f, 690f, 224f, 676f)
                    cubicTo(244f, 666f, 260f, 688f, 300f, 690f)
                    cubicTo(340f, 688f, 356f, 666f, 376f, 676f)
                    cubicTo(402f, 690f, 440f, 660f, 454f, 610f)
                    cubicTo(472f, 480f, 464f, 350f, 438f, 260f)
                    cubicTo(420f, 180f, 368f, 136f, 300f, 136f)
                    cubicTo(232f, 136f, 180f, 180f, 162f, 260f)
                    close()
                }
                canvas.drawPath(p, deep); canvas.drawPath(p, outline)
                if (hairStyle == HairstyleId.FAIRY_CURLS) {
                    listOf(158f to 480f, 178f to 562f, 442f to 480f, 422f to 562f).forEach { (cx, cy) ->
                        canvas.drawCircle(cx, cy, 35f, main); canvas.drawCircle(cx, cy, 35f, outline)
                    }
                }
                if (highlight) {
                    canvas.drawLine(174f, 390f, 192f, 628f, streakP)
                    canvas.drawLine(426f, 390f, 408f, 628f, streakP)
                }
            }
            HairstyleId.SPACE_BUNS -> {
                canvas.drawCircle(176f, 176f, 58f, main); canvas.drawCircle(176f, 176f, 58f, outline)
                canvas.drawCircle(424f, 176f, 58f, main); canvas.drawCircle(424f, 176f, 58f, outline)
                val tie = Paint(Paint.ANTI_ALIAS_FLAG).apply { this.color = 0xFFFF75B5.toInt() }
                canvas.drawCircle(198f, 206f, 14f, tie)
                canvas.drawCircle(402f, 206f, 14f, tie)
                canvas.drawPath(backCap, deep); canvas.drawPath(backCap, outline)
            }
            HairstyleId.TWIN_BRAIDS -> {
                canvas.drawPath(backCap, deep); canvas.drawPath(backCap, outline)
                for (i in 0..4) {
                    val rx = 24f - i * 1.4f
                    val y = 418f + i * 38f
                    val paint = if (i % 2 == 0) main else deep
                    canvas.drawOval(176f - i * 4f - rx, y - 22f, 176f - i * 4f + rx, y + 22f, paint)
                    canvas.drawOval(176f - i * 4f - rx, y - 22f, 176f - i * 4f + rx, y + 22f, outline)
                    canvas.drawOval(424f + i * 4f - rx, y - 22f, 424f + i * 4f + rx, y + 22f, paint)
                    canvas.drawOval(424f + i * 4f - rx, y - 22f, 424f + i * 4f + rx, y + 22f, outline)
                }
                val ribbon = Paint(Paint.ANTI_ALIAS_FLAG).apply { this.color = 0xFFFF6BB5.toInt() }
                canvas.drawRoundRect(148f, 578f, 180f, 590f, 6f, 6f, ribbon)
                canvas.drawRoundRect(420f, 578f, 452f, 590f, 6f, 6f, ribbon)
            }
            HairstyleId.SWEET_BOB -> {
                val bob = Path().apply {
                    moveTo(162f, 274f); cubicTo(150f, 356f, 158f, 432f, 198f, 468f)
                    cubicTo(228f, 492f, 260f, 486f, 300f, 486f); cubicTo(340f, 486f, 372f, 492f, 402f, 468f)
                    cubicTo(442f, 432f, 450f, 356f, 438f, 274f); cubicTo(424f, 180f, 370f, 136f, 300f, 136f)
                    cubicTo(230f, 136f, 176f, 180f, 162f, 274f); close()
                }
                canvas.drawPath(bob, deep); canvas.drawPath(bob, outline)
            }
            HairstyleId.HIGH_PONYTAIL -> {
                val tail = Path().apply {
                    moveTo(310f, 144f); cubicTo(378f, 106f, 466f, 154f, 488f, 262f)
                    cubicTo(508f, 360f, 480f, 488f, 444f, 562f); cubicTo(424f, 522f, 434f, 446f, 424f, 374f)
                    cubicTo(414f, 294f, 380f, 210f, 304f, 184f); close()
                }
                canvas.drawPath(tail, main); canvas.drawPath(tail, outline)
                val scrunch = Paint(Paint.ANTI_ALIAS_FLAG).apply { this.color = 0xFFFF6BB5.toInt() }
                canvas.drawOval(274f, 132f, 342f, 164f, scrunch)
                canvas.drawPath(backCap, deep); canvas.drawPath(backCap, outline)
                if (highlight) canvas.drawLine(390f, 200f, 456f, 470f, streakP)
            }
            HairstyleId.CURLY_PUFFS -> {
                val puffs = listOf(148f to 240f, 128f to 296f, 164f to 196f, 144f to 348f, 452f to 240f, 472f to 296f, 436f to 196f, 456f to 348f)
                puffs.forEachIndexed { idx, (cx, cy) ->
                    val r = if (idx % 4 == 0) 54f else 44f
                    canvas.drawCircle(cx, cy, r, main); canvas.drawCircle(cx, cy, r, outline)
                }
                canvas.drawPath(backCap, deep); canvas.drawPath(backCap, outline)
            }
            HairstyleId.RIBBON_HALFUP -> {
                val long = Path().apply {
                    moveTo(164f, 264f); cubicTo(148f, 370f, 144f, 504f, 166f, 648f)
                    cubicTo(206f, 672f, 250f, 680f, 300f, 680f); cubicTo(350f, 680f, 394f, 672f, 434f, 648f)
                    cubicTo(456f, 504f, 452f, 370f, 436f, 264f); cubicTo(420f, 176f, 368f, 136f, 300f, 136f)
                    cubicTo(232f, 136f, 180f, 176f, 164f, 264f); close()
                }
                canvas.drawPath(long, deep); canvas.drawPath(long, outline)
                val bow = Paint(Paint.ANTI_ALIAS_FLAG).apply { this.color = 0xFFFF75B5.toInt() }
                canvas.drawOval(222f, 126f, 294f, 186f, bow)
                canvas.drawOval(306f, 126f, 378f, 186f, bow)
                canvas.drawCircle(300f, 158f, 14f, Paint(Paint.ANTI_ALIAS_FLAG).apply { this.color = 0xFFFF4D9E.toInt() })
                if (highlight) {
                    canvas.drawLine(184f, 360f, 176f, 620f, streakP)
                    canvas.drawLine(416f, 360f, 424f, 620f, streakP)
                }
            }
        }
    }

    private fun drawHairFront(canvas: Canvas, hairStyle: HairstyleId, color: HairColorOption, highlight: Boolean) {
        val main = hairMainPaint(color)
        val outline = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE
            strokeWidth = 2.8f
            this.color = color.shadow
        }

        val bangs = if (hairStyle == HairstyleId.SWEET_BOB) {
            Path().apply {
                moveTo(176f, 286f); cubicTo(174f, 190f, 224f, 142f, 300f, 142f)
                cubicTo(376f, 142f, 426f, 190f, 424f, 286f)
                cubicTo(414f, 252f, 398f, 240f, 386f, 254f)
                cubicTo(372f, 224f, 344f, 218f, 324f, 246f)
                cubicTo(310f, 218f, 290f, 218f, 276f, 246f)
                cubicTo(256f, 218f, 228f, 224f, 214f, 254f)
                cubicTo(202f, 240f, 186f, 252f, 176f, 286f); close()
            }
        } else {
            Path().apply {
                moveTo(174f, 294f); cubicTo(172f, 192f, 224f, 140f, 300f, 140f)
                cubicTo(376f, 140f, 428f, 192f, 426f, 294f)
                cubicTo(414f, 246f, 386f, 218f, 344f, 212f)
                cubicTo(330f, 232f, 316f, 244f, 300f, 220f)
                cubicTo(284f, 244f, 270f, 232f, 256f, 212f)
                cubicTo(214f, 218f, 186f, 246f, 174f, 294f); close()
            }
        }
        canvas.drawPath(bangs, main); canvas.drawPath(bangs, outline)

        // Side framing strands
        val leftSide = Path().apply {
            moveTo(178f, 272f); cubicTo(166f, 340f, 172f, 412f, 196f, 456f)
            cubicTo(188f, 408f, 190f, 340f, 196f, 284f); close()
        }
        val rightSide = Path().apply {
            moveTo(422f, 272f); cubicTo(434f, 340f, 428f, 412f, 404f, 456f)
            cubicTo(412f, 408f, 410f, 340f, 404f, 284f); close()
        }
        canvas.drawPath(leftSide, main); canvas.drawPath(leftSide, outline)
        canvas.drawPath(rightSide, main); canvas.drawPath(rightSide, outline)

        if (highlight) {
            val sp = Paint(Paint.ANTI_ALIAS_FLAG).apply {
                style = Paint.Style.STROKE; strokeWidth = 9f; strokeCap = Paint.Cap.ROUND
                this.color = (color.streak and 0x00FFFFFF) or (0xBA shl 24)
            }
            val lS = Path().apply { moveTo(222f, 178f); cubicTo(204f, 204f, 192f, 240f, 188f, 276f) }
            val rS = Path().apply { moveTo(378f, 178f); cubicTo(396f, 204f, 408f, 240f, 412f, 276f) }
            canvas.drawPath(lS, sp); canvas.drawPath(rS, sp)
        }

        // Glossy halo shine
        val shine = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE; strokeWidth = 7f; strokeCap = Paint.Cap.ROUND; this.color = 0x60FFFFFF
        }
        canvas.drawPath(Path().apply { moveTo(222f, 194f); cubicTo(246f, 174f, 272f, 170f, 290f, 176f) }, shine)
        canvas.drawPath(Path().apply { moveTo(314f, 176f); cubicTo(334f, 170f, 358f, 176f, 378f, 194f) }, shine)
    }

    private fun drawFaceBase(canvas: Canvas, c: CharacterModel) {
        val outline = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE; strokeWidth = 2.5f; color = c.skinShadow
        }
        // Sculpted Neck, Shoulders & Hourglass Torso (with natural waist at y=668)
        val torsoPath = Path().apply {
            moveTo(272f, 438f)
            lineTo(270f, 506f)
            cubicTo(246f, 514f, 200f, 520f, 182f, 544f)
            cubicTo(190f, 566f, 200f, 580f, 206f, 594f)
            cubicTo(212f, 622f, 220f, 646f, 226f, 668f)
            cubicTo(214f, 712f, 202f, 756f, 196f, 800f)
            lineTo(404f, 800f)
            cubicTo(398f, 756f, 386f, 712f, 374f, 668f)
            cubicTo(380f, 646f, 388f, 622f, 394f, 594f)
            cubicTo(400f, 580f, 410f, 566f, 418f, 544f)
            cubicTo(400f, 520f, 354f, 514f, 330f, 506f)
            lineTo(328f, 438f)
            close()
        }
        val torsoPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            shader = LinearGradient(300f, 438f, 300f, 720f, intArrayOf(c.skinNeckShadow, c.skinBase, c.skinLight), null, Shader.TileMode.CLAMP)
        }
        canvas.drawPath(torsoPath, torsoPaint)
        canvas.drawPath(torsoPath, outline)

        // Delicate collarbones
        val collarP = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE; strokeWidth = 2.2f; strokeCap = Paint.Cap.ROUND
            color = (c.skinShadow and 0x00FFFFFF) or (0xA8 shl 24)
        }
        canvas.drawPath(Path().apply { moveTo(230f, 536f); quadTo(258f, 545f, 284f, 540f) }, collarP)
        canvas.drawPath(Path().apply { moveTo(370f, 536f); quadTo(342f, 545f, 316f, 540f) }, collarP)

        // Chin shadow on neck
        canvas.drawOval(270f, 448f, 330f, 474f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = (c.skinNeckShadow and 0x00FFFFFF) or (0x88 shl 24) })

        // Ears
        val earPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = c.skinBase }
        canvas.drawOval(166f, 308f, 202f, 364f, earPaint); canvas.drawOval(166f, 308f, 202f, 364f, outline)
        canvas.drawOval(398f, 308f, 434f, 364f, earPaint); canvas.drawOval(398f, 308f, 434f, 364f, outline)

        // Face oval
        val facePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            shader = RadialGradient(300f, 296f, 185f, intArrayOf(c.skinLight, c.skinBase, c.skinShadow), floatArrayOf(0f, 0.68f, 1f), Shader.TileMode.CLAMP)
        }
        val fp = StageGeometry.facePath()
        canvas.drawPath(fp, facePaint); canvas.drawPath(fp, outline)

        // Subtle natural cheek blush
        listOf(StageGeometry.LEFT_CHEEK_X, StageGeometry.RIGHT_CHEEK_X).forEach { cx ->
            val bp = Paint(Paint.ANTI_ALIAS_FLAG).apply {
                shader = RadialGradient(cx, StageGeometry.CHEEK_Y, 34f, intArrayOf((c.naturalBlush and 0x00FFFFFF) or (0x45 shl 24), c.naturalBlush and 0x00FFFFFF), null, Shader.TileMode.CLAMP)
            }
            canvas.drawCircle(cx, StageGeometry.CHEEK_Y, 34f, bp)
        }

        // Upper lid crease
        val crease = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 2f; strokeCap = Paint.Cap.ROUND; color = (c.skinShadow and 0x00FFFFFF) or (0xB0 shl 24) }
        canvas.drawPath(Path().apply { moveTo(214f, 304f); quadTo(244f, 290f, 274f, 304f) }, crease)
        canvas.drawPath(Path().apply { moveTo(326f, 304f); quadTo(356f, 290f, 386f, 304f) }, crease)

        // Natural lips
        val lipP = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = (c.naturalLip and 0x00FFFFFF) or (0xDD shl 24) }
        canvas.drawPath(StageGeometry.lipsFullPath(), lipP)
    }

    private fun drawArmsAndHands(canvas: Canvas, c: CharacterModel) {
        val armPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            shader = LinearGradient(140f, 540f, 210f, 790f, intArrayOf(c.skinLight, c.skinBase, c.skinShadow), null, Shader.TileMode.CLAMP)
        }
        val rightArmPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            shader = LinearGradient(460f, 540f, 390f, 790f, intArrayOf(c.skinLight, c.skinBase, c.skinShadow), null, Shader.TileMode.CLAMP)
        }
        val outline = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE; strokeWidth = 2.5f; strokeJoin = Paint.Join.ROUND; strokeCap = Paint.Cap.ROUND; color = c.skinShadow
        }

        // Left graceful arm + forearm + cute hand resting lightly near hip/skirt
        val leftArm = Path().apply {
            moveTo(184f, 540f)
            cubicTo(160f, 566f, 142f, 610f, 140f, 648f) // outer upper arm to elbow
            cubicTo(138f, 682f, 152f, 716f, 168f, 744f) // outer forearm to wrist
            cubicTo(164f, 764f, 172f, 786f, 186f, 790f) // outer hand & fingers
            cubicTo(198f, 792f, 206f, 780f, 201f, 765f) // fingertips curve
            cubicTo(210f, 761f, 208f, 747f, 194f, 738f) // cute thumb & inner wrist
            cubicTo(182f, 710f, 172f, 676f, 174f, 648f) // inner forearm to inner elbow
            cubicTo(176f, 622f, 192f, 602f, 206f, 590f) // inner upper arm to armpit
            cubicTo(200f, 570f, 192f, 552f, 184f, 540f)
            close()
        }
        canvas.drawPath(leftArm, armPaint)
        canvas.drawPath(leftArm, outline)

        // Right graceful arm + forearm + cute hand (mirror across x=300)
        val rightArm = Path().apply {
            moveTo(416f, 540f)
            cubicTo(440f, 566f, 458f, 610f, 460f, 648f)
            cubicTo(462f, 682f, 448f, 716f, 432f, 744f)
            cubicTo(436f, 764f, 428f, 786f, 414f, 790f)
            cubicTo(402f, 792f, 394f, 780f, 399f, 765f)
            cubicTo(390f, 761f, 392f, 747f, 406f, 738f)
            cubicTo(418f, 710f, 428f, 676f, 426f, 648f)
            cubicTo(424f, 622f, 408f, 602f, 394f, 590f)
            cubicTo(400f, 570f, 408f, 552f, 416f, 540f)
            close()
        }
        canvas.drawPath(rightArm, rightArmPaint)
        canvas.drawPath(rightArm, outline)

        // Subtle finger crease details on both hands
        val fingerLine = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE; strokeWidth = 1.6f; strokeCap = Paint.Cap.ROUND; color = c.skinShadow
        }
        canvas.drawLine(182f, 772f, 187f, 785f, fingerLine)
        canvas.drawLine(191f, 769f, 195f, 782f, fingerLine)
        canvas.drawLine(418f, 772f, 413f, 785f, fingerLine)
        canvas.drawLine(409f, 769f, 405f, 782f, fingerLine)
    }

    private fun drawFaceTopFeatures(
        canvas: Canvas,
        c: CharacterModel,
        eyeLens: EyeLensOption,
        state: MakeoverState,
        isBlinking: Boolean
    ) {
        // Button nose
        val noseP = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 2.6f; strokeCap = Paint.Cap.ROUND; color = c.skinShadow }
        canvas.drawPath(Path().apply { moveTo(294f, 366f); quadTo(300f, 372f, 306f, 366f) }, noseP)

        // Lips contour, expression & gloss
        when (state.expression) {
            ExpressionId.HAPPY -> {
                val mouth = Path().apply {
                    moveTo(272f, 406f); quadTo(300f, 400f, 328f, 406f)
                    cubicTo(324f, 432f, 314f, 438f, 300f, 438f); cubicTo(286f, 438f, 276f, 432f, 272f, 406f); close()
                }
                canvas.drawPath(mouth, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFC94B67.toInt() })
                canvas.drawPath(Path().apply { moveTo(276f, 407f); quadTo(300f, 404f, 324f, 407f); lineTo(320f, 416f); quadTo(300f, 418f, 280f, 416f); close() }, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.WHITE })
                canvas.drawOval(286f, 425f, 314f, 437f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFF8DA1.toInt() })
            }
            ExpressionId.KISSY -> {
                val kp = Path().apply {
                    moveTo(282f, 408f); cubicTo(288f, 398f, 296f, 400f, 300f, 403f)
                    cubicTo(304f, 400f, 312f, 398f, 318f, 408f); cubicTo(313f, 422f, 306f, 425f, 300f, 425f)
                    cubicTo(294f, 425f, 287f, 422f, 282f, 408f); close()
                }
                if (!state.hasLipPaint) canvas.drawPath(kp, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = c.naturalLip })
                canvas.drawPath(kp, Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 2f; color = c.naturalLipShadow })
            }
            else -> {
                val lineP = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 2.2f; strokeCap = Paint.Cap.ROUND; color = (c.naturalLipShadow and 0x00FFFFFF) or (0xC0 shl 24) }
                canvas.drawPath(Path().apply { moveTo(269f, 408f); quadTo(285f, 412f, 300f, 411f); quadTo(315f, 412f, 331f, 408f) }, lineP)
                if (state.lipFinish == LipFinish.GLOSSY || state.lipFinish == LipFinish.GLITTER) {
                    val glossP = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 4f; strokeCap = Paint.Cap.ROUND; color = if (state.hasLipPaint) 0xDAFFFFFF.toInt() else 0x77FFFFFF }
                    canvas.drawPath(Path().apply { moveTo(284f, 418f); quadTo(300f, 423f, 316f, 418f) }, glossP)
                }
                if (state.lipFinish == LipFinish.GLITTER && state.hasLipPaint) {
                    val gp = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFFF9C4.toInt() }
                    listOf(282f to 413f, 295f to 419f, 307f to 415f, 318f to 412f, 300f to 404f).forEach { (gx, gy) -> canvas.drawCircle(gx, gy, 1.9f, gp) }
                }
            }
        }

        // Left & Right Eyes
        drawEye(canvas, true, c, eyeLens, state, isBlinking)
        drawEye(canvas, false, c, eyeLens, state, isBlinking || state.expression == ExpressionId.WINK)

        // Eyebrows
        drawEyebrow(canvas, true, state.eyebrowStyle, state.eyebrowColor)
        drawEyebrow(canvas, false, state.eyebrowStyle, state.eyebrowColor)

        // Spa shimmer glow stars
        if (state.spaGlow) {
            val sp = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xE2FFFBEB.toInt() }
            listOf(218f to 368f, 382f to 368f, 300f to 232f, 298f to 358f).forEach { (x, y) ->
                drawFourPointStar(canvas, x, y, 6.5f, sp)
            }
        }
    }

    private fun drawEye(
        canvas: Canvas,
        isLeft: Boolean,
        c: CharacterModel,
        lens: EyeLensOption,
        state: MakeoverState,
        closed: Boolean
    ) {
        val cx = if (isLeft) StageGeometry.LEFT_EYE_X else StageGeometry.RIGHT_EYE_X
        val cy = StageGeometry.EYE_Y
        if (closed) {
            val p = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 4.5f; strokeCap = Paint.Cap.ROUND; color = 0xFF2B2129.toInt() }
            val path = Path().apply {
                moveTo(cx - 26f, cy + 2f)
                quadTo(cx, if (isLeft) cy + 14f else cy - 10f, cx + 26f, cy + 2f)
            }
            canvas.drawPath(path, p)
            return
        }

        val eyeShape = Path().apply {
            moveTo(cx - 28f, cy + 2f)
            cubicTo(cx - 22f, cy - 22f, cx + 22f, cy - 22f, cx + 28f, cy + 2f)
            cubicTo(cx + 20f, cy + 20f, cx - 20f, cy + 20f, cx - 28f, cy + 2f)
            close()
        }
        canvas.drawPath(eyeShape, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.WHITE })

        // Clipped multi-layer glossy iris
        canvas.save()
        canvas.clipPath(eyeShape)
        val irisPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            shader = RadialGradient(cx, cy - 2f, 20f, intArrayOf(lens.inner, lens.outer, 0xFF1E1B2E.toInt()), floatArrayOf(0f, 0.7f, 1f), Shader.TileMode.CLAMP)
        }
        canvas.drawCircle(cx, cy + 1f, 17.5f, irisPaint)
        canvas.drawCircle(cx, cy + 5f, 11f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = (lens.inner and 0x00FFFFFF) or (0xA0 shl 24) })
        canvas.drawCircle(cx, cy + 1f, 7.5f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFF181226.toInt() })
        canvas.drawCircle(cx - 7f, cy - 6f, 5.2f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.WHITE })
        canvas.drawCircle(cx + 6f, cy + 6f, 2.6f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = lens.sparkle })
        canvas.drawCircle(cx + 8f, cy - 5f, 2f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.WHITE })
        if (state.expression == ExpressionId.STARRY || lens.id == "galaxy-star") {
            drawFourPointStar(canvas, cx, cy, 9f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xF5FFF9C4.toInt() })
        }
        canvas.restore()

        // Upper lash line
        val lashColor = if (state.mascaraCoverage > 0.05f) state.mascaraColor else 0xFF2B2129.toInt()
        val upperLid = Path().apply {
            moveTo(cx - 29f, cy + 2f)
            cubicTo(cx - 20f, cy - 21f, cx + 20f, cy - 21f, cx + 29f, cy + 2f)
        }
        canvas.drawPath(upperLid, Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 3.6f; strokeCap = Paint.Cap.ROUND; color = lashColor })

        // Eyeliner wing overlay
        if (state.eyelinerStyle != EyelinerStyleId.NONE && state.eyelinerCoverage > 0.05f) {
            val lp = Paint(Paint.ANTI_ALIAS_FLAG).apply {
                style = Paint.Style.STROKE
                strokeCap = Paint.Cap.ROUND
                strokeWidth = if (state.eyelinerStyle == EyelinerStyleId.CAT) 5.8f else 4.8f
                color = state.eyelinerColor
                alpha = (state.eyelinerCoverage.coerceIn(0.3f, 1f) * 255f).toInt()
            }
            val wingY = when (state.eyelinerStyle) {
                EyelinerStyleId.PUPPY -> cy + 7f
                EyelinerStyleId.CAT, EyelinerStyleId.DOUBLE_STAR -> cy - 12f
                else -> cy - 6f
            }
            val dir = if (isLeft) -1f else 1f
            val liner = Path().apply {
                moveTo(cx + dir * 41f, wingY)
                quadTo(cx + dir * 28f, cy + 3f, cx + dir * 18f, cy - 11f)
                cubicTo(cx + dir * 2f, cy - 22f, cx - dir * 18f, cy - 20f, cx - dir * 28f, cy + 1f)
            }
            canvas.drawPath(liner, lp)
            if (state.eyelinerStyle == EyelinerStyleId.DOUBLE_STAR || state.eyelinerStyle == EyelinerStyleId.GLITTER_WING) {
                canvas.drawCircle(cx + dir * 42f, wingY - 4f, 3.5f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFDE047.toInt() })
            }
        }

        // Mascara lashes
        val lashScale = 1f + if (state.mascaraStyle == MascaraStyleId.NATURAL) 0f else state.mascaraCoverage * 0.5f
        val lashP = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE
            strokeCap = Paint.Cap.ROUND
            strokeWidth = if (state.mascaraStyle == MascaraStyleId.PRINCESS) 3.8f else 2.9f
            color = lashColor
        }
        val offsets = when (state.mascaraStyle) {
            MascaraStyleId.PRINCESS, MascaraStyleId.BUTTERFLY -> listOf(-24f, -18f, -12f, -5f, 2f, 9f, 16f, 22f)
            MascaraStyleId.STARLIGHT, MascaraStyleId.CURLED -> listOf(-22f, -14f, -6f, 3f, 12f, 20f)
            MascaraStyleId.NATURAL -> listOf(-18f, -8f, 4f, 15f)
        }
        for (dx in offsets) {
            val xb = cx + if (isLeft) dx else -dx
            val norm = dx / 28f
            val yb = cy - sqrt((1f - norm * norm).coerceAtLeast(0f)) * 16f + 1f
            val len = (7f + if (state.mascaraStyle == MascaraStyleId.NATURAL) 0f else 5f) * lashScale * if (dx < -8f) 1.3f else 1f
            val fan = (if (isLeft) -1f else 1f) * (if (dx < 0f) 7f else 3f)
            canvas.drawPath(Path().apply { moveTo(xb, yb); quadTo(xb + fan * 0.5f, yb - len * 0.7f, xb + fan, yb - len) }, lashP)
        }
    }

    private fun drawEyebrow(canvas: Canvas, isLeft: Boolean, style: EyebrowStyleId, color: Int) {
        val p = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            this.style = Paint.Style.STROKE; strokeWidth = 6.5f; strokeCap = Paint.Cap.ROUND; this.color = color
        }
        val path = Path().apply {
            when (style) {
                EyebrowStyleId.SOFT_ARCH -> if (isLeft) { moveTo(206f, 286f); quadTo(242f, 268f, 278f, 282f) } else { moveTo(322f, 282f); quadTo(358f, 268f, 394f, 286f) }
                EyebrowStyleId.SWEET_STRAIGHT -> if (isLeft) { moveTo(208f, 282f); quadTo(244f, 277f, 278f, 282f) } else { moveTo(322f, 282f); quadTo(356f, 277f, 392f, 282f) }
                EyebrowStyleId.GLAM_WING -> if (isLeft) { moveTo(204f, 288f); quadTo(232f, 264f, 278f, 282f) } else { moveTo(322f, 282f); quadTo(368f, 264f, 396f, 288f) }
                EyebrowStyleId.CUTE_ROUND -> if (isLeft) { moveTo(208f, 284f); quadTo(244f, 266f, 276f, 284f) } else { moveTo(324f, 284f); quadTo(356f, 266f, 392f, 284f) }
            }
        }
        canvas.drawPath(path, p)
    }

    private fun drawOutfitBodyAndSkirt(canvas: Canvas, outfitId: OutfitId, theme: OutfitColorTheme) {
        val main = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            shader = LinearGradient(300f, 520f, 300f, 800f, intArrayOf(theme.secondary, theme.primary, theme.accent), null, Shader.TileMode.CLAMP)
        }
        val soft = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            shader = LinearGradient(180f, 540f, 420f, 780f, intArrayOf(theme.trim, theme.secondary), null, Shader.TileMode.CLAMP)
        }
        val stroke = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 2.8f; strokeJoin = Paint.Join.ROUND; color = theme.accent }
        val trimFill = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = theme.trim }
        val whiteFill = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.WHITE }

        // Fitted princess bodice helper (hugs bust -> tapers to natural waist 224..376 at y=668)
        fun fittedBodice(neckLeftY: Float = 562f, dipY: Float = 576f): Path = Path().apply {
            moveTo(202f, neckLeftY)
            cubicTo(234f, neckLeftY - 12f, 272f, dipY, 300f, dipY)
            cubicTo(328f, dipY, 366f, neckLeftY - 12f, 398f, neckLeftY)
            lineTo(394f, 594f)
            cubicTo(388f, 622f, 380f, 646f, 375f, 668f)
            quadTo(300f, 680f, 225f, 668f)
            cubicTo(220f, 646f, 212f, 622f, 206f, 594f)
            close()
        }

        // Flared skirt helper from waist (225..375, y=666) to hem y=800
        fun flaredSkirt(hemSpread: Float = 148f): Path = Path().apply {
            moveTo(225f, 666f)
            quadTo(300f, 678f, 375f, 666f)
            cubicTo(408f, 710f, 600f - hemSpread - 10f, 756f, 600f - hemSpread, 800f)
            lineTo(hemSpread, 800f)
            cubicTo(hemSpread + 10f, 756f, 192f, 710f, 225f, 666f)
            close()
        }

        when (outfitId) {
            OutfitId.PRINCESS_GOWN -> {
                val skirt = flaredSkirt(138f)
                canvas.drawPath(skirt, main); canvas.drawPath(skirt, stroke)
                // Center satin petticoat panel
                val centerPanel = Path().apply {
                    moveTo(260f, 670f); quadTo(300f, 678f, 340f, 670f)
                    lineTo(376f, 800f); lineTo(224f, 800f); close()
                }
                canvas.drawPath(centerPanel, soft)
                // Bodice
                val bod = fittedBodice(558f, 574f)
                canvas.drawPath(bod, main); canvas.drawPath(bod, stroke)
                // Corset ribbon & waist belt
                val lace = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 3f; color = theme.trim }
                canvas.drawLine(272f, 596f, 328f, 622f, lace); canvas.drawLine(328f, 596f, 272f, 622f, lace)
                canvas.drawLine(268f, 628f, 332f, 654f, lace); canvas.drawLine(332f, 628f, 268f, 654f, lace)
                canvas.drawCircle(300f, 582f, 11f, trimFill)
                canvas.drawCircle(300f, 582f, 5.5f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = theme.accent })
            }

            OutfitId.FAIRY_TULLE -> {
                // Shoulder straps
                val strap = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 8f; strokeCap = Paint.Cap.ROUND; color = theme.primary }
                canvas.drawLine(226f, 524f, 234f, 566f, strap)
                canvas.drawLine(374f, 524f, 366f, 566f, strap)
                // Full fairy tulle skirt
                val skirt = flaredSkirt(142f)
                canvas.drawPath(skirt, main); canvas.drawPath(skirt, stroke)
                // Layered petal peplum over waist
                val petals = Path().apply {
                    moveTo(224f, 666f); quadTo(300f, 676f, 376f, 666f)
                    lineTo(398f, 718f)
                    quadTo(362f, 748f, 334f, 712f)
                    quadTo(300f, 756f, 266f, 712f)
                    quadTo(238f, 748f, 202f, 718f)
                    close()
                }
                canvas.drawPath(petals, soft); canvas.drawPath(petals, stroke)
                val bod = fittedBodice(564f, 578f)
                canvas.drawPath(bod, main); canvas.drawPath(bod, stroke)
                val starP = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xEBFFF9C4.toInt() }
                listOf(254f to 612f, 346f to 612f, 300f to 638f, 240f to 764f, 300f to 776f, 360f to 764f).forEach { (x, y) ->
                    drawFourPointStar(canvas, x, y, 8.5f, starP)
                }
            }

            OutfitId.PASTEL_SAILOR -> {
                // Pleated sailor skirt from waist y=668
                val skirt = flaredSkirt(162f)
                canvas.drawPath(skirt, main); canvas.drawPath(skirt, stroke)
                // Crisp skirt pleat lines
                val pleatP = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 2f; color = theme.accent }
                listOf(-48f, -24f, 0f, 24f, 48f).forEach { dx ->
                    canvas.drawLine(300f + dx * 0.7f, 672f, 300f + dx * 1.35f, 800f, pleatP)
                }
                // Fitted white sailor blouse tucked neatly into waist
                val blouse = Path().apply {
                    moveTo(266f, 508f); lineTo(300f, 558f); lineTo(334f, 508f)
                    cubicTo(364f, 516f, 400f, 524f, 416f, 542f)
                    lineTo(394f, 594f); lineTo(376f, 668f)
                    quadTo(300f, 678f, 224f, 668f)
                    lineTo(206f, 594f); lineTo(184f, 542f)
                    cubicTo(200f, 524f, 236f, 516f, 266f, 508f); close()
                }
                canvas.drawPath(blouse, whiteFill)
                canvas.drawPath(blouse, Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 2.5f; color = theme.secondary })
            }

            OutfitId.STAR_HOODIE -> {
                // Cute pleated mini-skirt peeking below hoodie ribbed hem
                val miniSkirt = Path().apply {
                    moveTo(204f, 722f); lineTo(396f, 722f); lineTo(418f, 800f); lineTo(182f, 800f); close()
                }
                canvas.drawPath(miniSkirt, soft); canvas.drawPath(miniSkirt, stroke)
                // Cozy relaxed-fit hoodie torso with ribbed waistband at y=732
                val hoodieTorso = Path().apply {
                    moveTo(264f, 506f); quadTo(300f, 534f, 336f, 506f)
                    cubicTo(366f, 514f, 402f, 524f, 418f, 542f)
                    lineTo(396f, 602f); lineTo(400f, 720f)
                    quadTo(300f, 736f, 200f, 720f)
                    lineTo(204f, 602f); lineTo(182f, 542f)
                    cubicTo(198f, 524f, 234f, 514f, 264f, 506f); close()
                }
                canvas.drawPath(hoodieTorso, main); canvas.drawPath(hoodieTorso, stroke)
                // Ribbed bottom hem band
                val hemBand = Path().apply {
                    moveTo(202f, 712f); quadTo(300f, 726f, 398f, 712f)
                    lineTo(396f, 732f); quadTo(300f, 746f, 204f, 732f); close()
                }
                canvas.drawPath(hemBand, trimFill); canvas.drawPath(hemBand, stroke)
                // Star graphic on chest
                drawFivePointStar(canvas, 300f, 636f, 34f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFFF9C4.toInt() })
            }

            OutfitId.BUTTERFLY_DRESS -> {
                val skirt = flaredSkirt(146f)
                canvas.drawPath(skirt, main); canvas.drawPath(skirt, stroke)
                val bod = fittedBodice(556f, 578f)
                canvas.drawPath(bod, main); canvas.drawPath(bod, stroke)
                // Satin waist ribbon right at natural waist y=666
                val belt = Path().apply {
                    moveTo(223f, 658f); quadTo(300f, 670f, 377f, 658f)
                    lineTo(380f, 676f); quadTo(300f, 688f, 220f, 676f); close()
                }
                canvas.drawPath(belt, trimFill); canvas.drawPath(belt, stroke)
            }

            OutfitId.ROYAL_VELVET -> {
                val skirt = flaredSkirt(144f)
                canvas.drawPath(skirt, main); canvas.drawPath(skirt, stroke)
                val bod = fittedBodice(572f, 578f)
                canvas.drawPath(bod, main); canvas.drawPath(bod, stroke)
                // Golden waist embroidery
                val goldLine = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 4f; strokeCap = Paint.Cap.ROUND; color = 0xFFFDE047.toInt() }
                canvas.drawPath(Path().apply { moveTo(226f, 666f); quadTo(300f, 682f, 374f, 666f) }, goldLine)
                val gem = Path().apply { moveTo(300f, 602f); lineTo(312f, 620f); lineTo(300f, 638f); lineTo(288f, 620f); close() }
                canvas.drawPath(gem, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFDE047.toInt() })
            }

            OutfitId.MERMAID_TOP -> {
                // Pearl shoulder straps
                val strap = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 5f; color = 0xFFFFF9C4.toInt() }
                canvas.drawLine(230f, 524f, 238f, 568f, strap)
                canvas.drawLine(370f, 524f, 362f, 568f, strap)
                // Sleek mermaid shimmer skirt hugging hips slightly before flaring
                val mermaidSkirt = Path().apply {
                    moveTo(225f, 666f); quadTo(300f, 678f, 375f, 666f)
                    cubicTo(396f, 706f, 404f, 756f, 424f, 800f)
                    lineTo(176f, 800f)
                    cubicTo(196f, 756f, 204f, 706f, 225f, 666f); close()
                }
                canvas.drawPath(mermaidSkirt, main); canvas.drawPath(mermaidSkirt, stroke)
                val bod = fittedBodice(568f, 588f)
                canvas.drawPath(bod, main); canvas.drawPath(bod, stroke)
                // Shell bust cups
                canvas.drawOval(214f, 566f, 296f, 622f, soft)
                canvas.drawOval(304f, 566f, 386f, 622f, soft)
                // Pearl waist chain at natural waist
                val pearl = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFFFDF9.toInt() }
                for (dx in -72..72 step 24) {
                    canvas.drawCircle(300f + dx, 670f + cos(dx * 0.03f) * 10f, 6.5f, pearl)
                }
            }

            OutfitId.BLOSSOM_KIMONO -> {
                // Graceful wrapped kimono skirt & torso
                val kimonoBody = Path().apply {
                    moveTo(266f, 506f); lineTo(300f, 578f); lineTo(334f, 506f)
                    cubicTo(364f, 514f, 400f, 524f, 418f, 542f)
                    lineTo(394f, 596f); lineTo(382f, 668f); lineTo(412f, 800f)
                    lineTo(188f, 800f); lineTo(218f, 668f); lineTo(206f, 596f); lineTo(182f, 542f)
                    cubicTo(200f, 524f, 236f, 514f, 266f, 506f); close()
                }
                canvas.drawPath(kimonoBody, main); canvas.drawPath(kimonoBody, stroke)
                // White juban inner collar + colored kimono overlap collar (left over right!)
                val innerCollar = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 11f; strokeCap = Paint.Cap.ROUND; color = Color.WHITE }
                canvas.drawLine(268f, 510f, 314f, 608f, innerCollar)
                canvas.drawLine(332f, 510f, 294f, 576f, innerCollar)
                val outerCollar = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 8f; strokeCap = Paint.Cap.ROUND; color = theme.trim }
                canvas.drawLine(258f, 514f, 322f, 644f, outerCollar)
                // Wide Obi sash snugly tied around the waist (y=640..696)
                canvas.drawRoundRect(216f, 640f, 384f, 696f, 10f, 10f, soft)
                canvas.drawRoundRect(216f, 640f, 384f, 696f, 10f, 10f, stroke)
                canvas.drawLine(218f, 668f, 382f, 668f, Paint(Paint.ANTI_ALIAS_FLAG).apply { strokeWidth = 5.5f; color = theme.accent })
                canvas.drawCircle(300f, 668f, 11f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFFF9C4.toInt() })
                drawSticker(canvas, StickerTypeId.SAKURA, 246f, 748f, 1f, 0f)
                drawSticker(canvas, StickerTypeId.SAKURA, 354f, 742f, 1f, 0f)
            }
        }
    }

    private fun drawOutfitSleevesAndTopDetails(canvas: Canvas, outfitId: OutfitId, theme: OutfitColorTheme) {
        val main = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            shader = LinearGradient(300f, 520f, 300f, 760f, intArrayOf(theme.secondary, theme.primary, theme.accent), null, Shader.TileMode.CLAMP)
        }
        val soft = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            shader = LinearGradient(150f, 520f, 450f, 680f, intArrayOf(theme.trim, theme.secondary), null, Shader.TileMode.CLAMP)
        }
        val stroke = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 2.8f; strokeJoin = Paint.Join.ROUND; color = theme.accent }
        val trimFill = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = theme.trim }
        val whiteFill = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.WHITE }

        when (outfitId) {
            OutfitId.PRINCESS_GOWN -> {
                // Puffy princess sleeves wrapping naturally over both shoulders & upper arms!
                val leftPuff = Path().apply {
                    moveTo(204f, 536f)
                    cubicTo(176f, 514f, 138f, 536f, 144f, 582f)
                    cubicTo(148f, 606f, 178f, 612f, 198f, 594f)
                    close()
                }
                val rightPuff = Path().apply {
                    moveTo(396f, 536f)
                    cubicTo(424f, 514f, 462f, 536f, 456f, 582f)
                    cubicTo(452f, 606f, 422f, 612f, 402f, 594f)
                    close()
                }
                canvas.drawPath(leftPuff, soft); canvas.drawPath(leftPuff, stroke)
                canvas.drawPath(rightPuff, soft); canvas.drawPath(rightPuff, stroke)
                // Cute lace cuff band on puff sleeves
                val cuffP = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 5f; strokeCap = Paint.Cap.ROUND; color = theme.trim }
                canvas.drawLine(148f, 588f, 194f, 596f, cuffP)
                canvas.drawLine(452f, 588f, 406f, 596f, cuffP)
            }

            OutfitId.PASTEL_SAILOR -> {
                // Tailored short sailor sleeves wrapping shoulders & upper arms
                val leftSleeve = Path().apply {
                    moveTo(192f, 534f)
                    cubicTo(168f, 548f, 150f, 582f, 144f, 614f)
                    lineTo(182f, 622f)
                    cubicTo(190f, 598f, 202f, 582f, 206f, 566f)
                    close()
                }
                val rightSleeve = Path().apply {
                    moveTo(408f, 534f)
                    cubicTo(432f, 548f, 450f, 582f, 456f, 614f)
                    lineTo(418f, 622f)
                    cubicTo(410f, 598f, 398f, 582f, 394f, 566f)
                    close()
                }
                canvas.drawPath(leftSleeve, whiteFill); canvas.drawPath(leftSleeve, stroke)
                canvas.drawPath(rightSleeve, whiteFill); canvas.drawPath(rightSleeve, stroke)
                // Sailor cuff stripes
                val stripe = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 5f; color = theme.primary }
                canvas.drawLine(146f, 608f, 182f, 616f, stripe)
                canvas.drawLine(454f, 608f, 418f, 616f, stripe)
                // Classic sailor collar draped over shoulders + front ribbon bow
                val collar = Path().apply {
                    moveTo(264f, 508f); lineTo(300f, 598f); lineTo(336f, 508f)
                    cubicTo(366f, 516f, 398f, 526f, 414f, 544f)
                    lineTo(372f, 608f); lineTo(300f, 598f); lineTo(228f, 608f); lineTo(186f, 544f)
                    cubicTo(202f, 526f, 234f, 516f, 264f, 508f); close()
                }
                canvas.drawPath(collar, main); canvas.drawPath(collar, stroke)
                // Front sailor bow
                val bow = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = theme.accent }
                canvas.drawPath(Path().apply { moveTo(300f, 600f); lineTo(262f, 580f); lineTo(268f, 622f); close() }, bow)
                canvas.drawPath(Path().apply { moveTo(300f, 600f); lineTo(338f, 580f); lineTo(332f, 622f); close() }, bow)
                canvas.drawCircle(300f, 600f, 9.5f, trimFill)
            }

            OutfitId.STAR_HOODIE -> {
                // Full-length cozy hoodie sleeves following both arms right down to the wrists (leaving cute hands visible!)
                val leftLongSleeve = Path().apply {
                    moveTo(188f, 536f)
                    cubicTo(158f, 562f, 138f, 608f, 136f, 648f)
                    cubicTo(134f, 682f, 148f, 714f, 164f, 740f)
                    lineTo(196f, 734f)
                    cubicTo(184f, 706f, 174f, 674f, 176f, 648f)
                    cubicTo(178f, 622f, 194f, 602f, 206f, 590f)
                    close()
                }
                val rightLongSleeve = Path().apply {
                    moveTo(412f, 536f)
                    cubicTo(442f, 562f, 462f, 608f, 464f, 648f)
                    cubicTo(466f, 682f, 452f, 714f, 436f, 740f)
                    lineTo(404f, 734f)
                    cubicTo(416f, 706f, 426f, 674f, 424f, 648f)
                    cubicTo(422f, 622f, 406f, 602f, 394f, 590f)
                    close()
                }
                canvas.drawPath(leftLongSleeve, main); canvas.drawPath(leftLongSleeve, stroke)
                canvas.drawPath(rightLongSleeve, main); canvas.drawPath(rightLongSleeve, stroke)
                // White ribbed wrist cuffs
                val cuffP = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 8f; strokeCap = Paint.Cap.ROUND; color = theme.trim }
                canvas.drawLine(165f, 738f, 195f, 733f, cuffP)
                canvas.drawLine(435f, 738f, 405f, 733f, cuffP)
                // Cozy hood collar & star drawstrings
                val hood = Path().apply {
                    moveTo(242f, 514f); cubicTo(260f, 554f, 340f, 554f, 358f, 514f)
                    quadTo(300f, 534f, 242f, 514f); close()
                }
                canvas.drawPath(hood, soft); canvas.drawPath(hood, stroke)
                val cord = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 4f; strokeCap = Paint.Cap.ROUND; color = Color.WHITE }
                canvas.drawLine(280f, 544f, 278f, 602f, cord); canvas.drawLine(320f, 544f, 322f, 602f, cord)
                canvas.drawCircle(278f, 604f, 5.5f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFDE047.toInt() })
                canvas.drawCircle(322f, 604f, 5.5f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFDE047.toInt() })
            }

            OutfitId.BUTTERFLY_DRESS -> {
                // Soft flutter sleeves draped over the shoulders
                val leftFlutter = Path().apply {
                    moveTo(206f, 546f)
                    cubicTo(174f, 526f, 144f, 548f, 148f, 588f)
                    cubicTo(164f, 604f, 192f, 598f, 206f, 582f)
                    close()
                }
                val rightFlutter = Path().apply {
                    moveTo(394f, 546f)
                    cubicTo(426f, 526f, 456f, 548f, 452f, 588f)
                    cubicTo(436f, 604f, 408f, 598f, 394f, 582f)
                    close()
                }
                canvas.drawPath(leftFlutter, soft); canvas.drawPath(leftFlutter, stroke)
                canvas.drawPath(rightFlutter, soft); canvas.drawPath(rightFlutter, stroke)
                // Center butterfly ribbon on bust
                canvas.drawOval(244f, 580f, 298f, 624f, soft); canvas.drawOval(244f, 580f, 298f, 624f, stroke)
                canvas.drawOval(302f, 580f, 356f, 624f, soft); canvas.drawOval(302f, 580f, 356f, 624f, stroke)
                canvas.drawCircle(300f, 602f, 8.5f, trimFill)
            }

            OutfitId.ROYAL_VELVET -> {
                // Plush white off-shoulder fur/velvet band wrapping smoothly across bust AND both upper arms!
                val furBand = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 16f; strokeCap = Paint.Cap.ROUND; color = 0xFFFFFDF7.toInt() }
                val wrap = Path().apply {
                    moveTo(164f, 584f)
                    cubicTo(208f, 564f, 256f, 576f, 300f, 576f)
                    cubicTo(344f, 576f, 392f, 564f, 436f, 584f)
                }
                canvas.drawPath(wrap, furBand)
            }

            OutfitId.BLOSSOM_KIMONO -> {
                // Authentic flowing wide Kimono sleeves draping gracefully from shoulders to wrists (hands peek out cleanly!)
                val leftKimonoSleeve = Path().apply {
                    moveTo(190f, 536f)
                    cubicTo(160f, 560f, 138f, 606f, 134f, 654f)
                    lineTo(156f, 724f)
                    cubicTo(176f, 734f, 198f, 726f, 200f, 700f)
                    lineTo(206f, 594f)
                    close()
                }
                val rightKimonoSleeve = Path().apply {
                    moveTo(410f, 536f)
                    cubicTo(440f, 560f, 462f, 606f, 466f, 654f)
                    lineTo(444f, 724f)
                    cubicTo(424f, 734f, 402f, 726f, 400f, 700f)
                    lineTo(394f, 594f)
                    close()
                }
                canvas.drawPath(leftKimonoSleeve, main); canvas.drawPath(leftKimonoSleeve, stroke)
                canvas.drawPath(rightKimonoSleeve, main); canvas.drawPath(rightKimonoSleeve, stroke)
                drawSticker(canvas, StickerTypeId.SAKURA, 168f, 658f, 0.9f, -12f)
                drawSticker(canvas, StickerTypeId.SAKURA, 432f, 658f, 0.9f, 12f)
            }

            OutfitId.FAIRY_TULLE, OutfitId.MERMAID_TOP -> Unit
        }
    }

    private fun drawEarrings(canvas: Canvas, id: EarringId) {
        if (id == EarringId.NONE) return
        listOf(StageGeometry.LEFT_EAR_X, StageGeometry.RIGHT_EAR_X).forEach { x ->
            val y = StageGeometry.EARLOBE_Y
            when (id) {
                EarringId.PEARL_DROPS -> {
                    canvas.drawCircle(x, y, 4.5f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFDE047.toInt() })
                    canvas.drawCircle(x, y + 18f, 9f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFFFDF9.toInt() })
                }
                EarringId.STAR_STUDS -> drawFivePointStar(canvas, x, y + 8f, 12f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFDE047.toInt() })
                EarringId.HEART_HOOPS -> drawSticker(canvas, StickerTypeId.PINK_HEART, x, y + 14f, 0.9f, 0f)
                EarringId.CRYSTAL_DROPS -> drawSticker(canvas, StickerTypeId.DIAMOND, x, y + 16f, 0.9f, 0f)
                EarringId.SAKURA_DROPS -> drawSticker(canvas, StickerTypeId.SAKURA, x, y + 14f, 0.95f, 0f)
                EarringId.BUTTERFLY_STUDS -> drawSticker(canvas, StickerTypeId.BUTTERFLY, x, y + 12f, 0.85f, 0f)
                EarringId.NONE -> Unit
            }
        }
    }

    private fun drawNecklace(canvas: Canvas, id: NecklaceId) {
        if (id == NecklaceId.NONE) return
        val chainP = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 3.5f; color = 0xFFFBBF24.toInt() }
        val curve = Path().apply { moveTo(254f, 500f); quadTo(300f, 544f, 346f, 500f) }
        when (id) {
            NecklaceId.PEARL_CHOKER -> {
                val p = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFFFDF9.toInt() }
                for (dx in -42..42 step 14) canvas.drawCircle(300f + dx, 502f + cos(dx * 0.032f) * 14f, 7.5f, p)
            }
            NecklaceId.HEART_PENDANT -> {
                canvas.drawPath(curve, chainP)
                drawSticker(canvas, StickerTypeId.PINK_HEART, 300f, 534f, 1.15f, 0f)
            }
            NecklaceId.STAR_GEM -> {
                chainP.color = 0xFFE2E8F0.toInt()
                canvas.drawPath(curve, chainP)
                drawFivePointStar(canvas, 300f, 534f, 16f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFF38BDF8.toInt() })
            }
            NecklaceId.RIBBON_CHOKER -> {
                canvas.drawPath(Path().apply { moveTo(262f, 496f); quadTo(300f, 510f, 338f, 496f) }, Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 11f; strokeCap = Paint.Cap.ROUND; color = 0xFFEC4899.toInt() })
                drawSticker(canvas, StickerTypeId.CANDY_BOW, 300f, 503f, 1.15f, 0f)
            }
            NecklaceId.FLOWER_GARLAND -> {
                chainP.color = 0xFF34D399.toInt()
                canvas.drawPath(curve, chainP)
                for (dx in -32..32 step 16) drawSticker(canvas, StickerTypeId.SAKURA, 300f + dx, 512f + cos(dx * 0.04f) * 14f, 0.78f, 0f)
            }
            NecklaceId.ROYAL_COLLAR -> {
                chainP.strokeWidth = 6f; chainP.color = 0xFFF59E0B.toInt()
                canvas.drawPath(curve, chainP)
                for (dx in -30..30 step 15) drawSticker(canvas, StickerTypeId.DIAMOND, 300f + dx, 516f + cos(dx * 0.04f) * 16f, if (dx == 0) 0.9f else 0.62f, 0f)
            }
            NecklaceId.NONE -> Unit
        }
    }

    private fun drawGlasses(canvas: Canvas, id: GlassesId) {
        if (id == GlassesId.NONE) return
        val stroke = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 5f }
        val tint = Paint(Paint.ANTI_ALIAS_FLAG)
        when (id) {
            GlassesId.HEART_SHADES -> {
                stroke.color = 0xFFFF4D9E.toInt(); tint.color = 0x72FF8AC6
                canvas.drawLine(280f, 322f, 320f, 322f, stroke)
                listOf(242f, 358f).forEach { cx ->
                    val h = heartPath(cx, 326f, 28f)
                    canvas.drawPath(h, tint); canvas.drawPath(h, stroke)
                }
            }
            GlassesId.STAR_GLASSES -> {
                stroke.color = 0xFFF59E0B.toInt(); tint.color = 0x6AFEF08A
                canvas.drawLine(278f, 324f, 322f, 324f, stroke)
                listOf(242f, 358f).forEach { cx ->
                    drawFivePointStar(canvas, cx, 326f, 32f, tint)
                    drawFivePointStar(canvas, cx, 326f, 32f, stroke)
                }
            }
            GlassesId.ROUND_PASTEL -> {
                stroke.color = 0xFFA855F7.toInt(); tint.color = 0x52F3E8FF
                canvas.drawLine(280f, 324f, 320f, 324f, stroke)
                listOf(244f, 356f).forEach { cx ->
                    canvas.drawCircle(cx, 326f, 36f, tint); canvas.drawCircle(cx, 326f, 36f, stroke)
                }
            }
            GlassesId.CAT_EYE_GLAM -> {
                stroke.color = 0xFFDB2777.toInt(); tint.color = 0x58F472B6
                canvas.drawLine(284f, 322f, 316f, 322f, stroke)
                val l = Path().apply { moveTo(196f, 304f); cubicTo(224f, 298f, 268f, 302f, 284f, 318f); cubicTo(282f, 346f, 258f, 358f, 232f, 354f); cubicTo(206f, 348f, 200f, 326f, 196f, 304f); close() }
                val r = Path().apply { moveTo(404f, 304f); cubicTo(376f, 298f, 332f, 302f, 316f, 318f); cubicTo(318f, 346f, 342f, 358f, 368f, 354f); cubicTo(394f, 348f, 400f, 326f, 404f, 304f); close() }
                canvas.drawPath(l, tint); canvas.drawPath(l, stroke)
                canvas.drawPath(r, tint); canvas.drawPath(r, stroke)
            }
            GlassesId.NONE -> Unit
        }
    }

    private fun drawHeadwear(canvas: Canvas, id: HeadwearId) {
        if (id == HeadwearId.NONE) return
        when (id) {
            HeadwearId.CRYSTAL_TIARA -> {
                val p = Path().apply {
                    moveTo(222f, 182f); quadTo(300f, 168f, 378f, 182f); lineTo(364f, 146f); lineTo(336f, 166f)
                    lineTo(322f, 130f); lineTo(300f, 156f); lineTo(278f, 130f); lineTo(264f, 166f); lineTo(236f, 146f); close()
                }
                canvas.drawPath(p, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFDE047.toInt() })
                canvas.drawPath(p, Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 3f; color = 0xFFD97706.toInt() })
                canvas.drawCircle(300f, 138f, 9f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFF4D9E.toInt() })
                canvas.drawCircle(262f, 154f, 6f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFF38BDF8.toInt() })
                canvas.drawCircle(338f, 154f, 6f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFF38BDF8.toInt() })
            }
            HeadwearId.FLOWER_CROWN -> {
                canvas.drawPath(Path().apply { moveTo(202f, 196f); quadTo(300f, 160f, 398f, 196f) }, Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 9f; color = 0xFF34D399.toInt() })
                listOf(228f to 186f, 262f to 174f, 300f to 168f, 338f to 174f, 372f to 186f).forEach { (x, y) ->
                    drawSticker(canvas, StickerTypeId.SAKURA, x, y, 1.35f, 0f)
                }
            }
            HeadwearId.CAT_EARS -> {
                val pink = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFF6BB5.toInt() }
                val inner = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFFD1E8.toInt() }
                val border = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 3.5f; color = Color.WHITE }
                val l = Path().apply { moveTo(200f, 176f); lineTo(182f, 106f); lineTo(254f, 148f); close() }
                val r = Path().apply { moveTo(400f, 176f); lineTo(418f, 106f); lineTo(346f, 148f); close() }
                canvas.drawPath(l, pink); canvas.drawPath(l, border)
                canvas.drawPath(r, pink); canvas.drawPath(r, border)
                canvas.drawPath(Path().apply { moveTo(206f, 164f); lineTo(195f, 122f); lineTo(238f, 148f); close() }, inner)
                canvas.drawPath(Path().apply { moveTo(394f, 164f); lineTo(405f, 122f); lineTo(362f, 148f); close() }, inner)
            }
            HeadwearId.VELVET_BOW -> {
                val bow = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFF4D9E.toInt() }
                val border = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 3f; color = Color.WHITE }
                canvas.drawOval(210f, 124f, 294f, 186f, bow); canvas.drawOval(210f, 124f, 294f, 186f, border)
                canvas.drawOval(306f, 124f, 390f, 186f, bow); canvas.drawOval(306f, 124f, 390f, 186f, border)
                canvas.drawRoundRect(285f, 140f, 315f, 170f, 10f, 10f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFDB2777.toInt() })
            }
            HeadwearId.BUTTERFLY_CLIPS -> {
                drawSticker(canvas, StickerTypeId.BUTTERFLY, 210f, 204f, 1.55f, -18f)
                drawSticker(canvas, StickerTypeId.BUTTERFLY, 390f, 204f, 1.55f, 18f)
            }
            HeadwearId.STAR_HALO -> {
                val hp = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 7f; color = 0xFFFDE047.toInt() }
                canvas.drawOval(226f, 110f, 374f, 146f, hp)
                drawFourPointStar(canvas, 300f, 110f, 12f, Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFFF9C4.toInt() })
            }
            HeadwearId.PEARL_BAND -> {
                val p = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xFFFFFDF9.toInt() }
                val b = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 2f; color = 0xFFFBCFE8.toInt() }
                for (dx in -88..88 step 22) {
                    val cy = 194f - cos(dx * 0.017f) * 34f
                    canvas.drawCircle(300f + dx, cy, 10.5f, p); canvas.drawCircle(300f + dx, cy, 10.5f, b)
                }
            }
            HeadwearId.NONE -> Unit
        }
    }

    fun drawSticker(canvas: Canvas, type: StickerTypeId, x: Float, y: Float, scale: Float, rot: Float) {
        canvas.save()
        canvas.translate(x, y)
        canvas.rotate(rot)
        canvas.scale(scale, scale)
        val p = Paint(Paint.ANTI_ALIAS_FLAG)
        val w = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 1.8f; color = Color.WHITE }

        when (type) {
            StickerTypeId.STAR_GEM -> {
                p.color = 0xFFFDE047.toInt(); drawFivePointStar(canvas, 0f, 0f, 14f, p); drawFivePointStar(canvas, 0f, 0f, 14f, w)
            }
            StickerTypeId.PINK_HEART -> {
                val h = heartPath(0f, 0f, 13f); p.color = 0xFFFF5CA8.toInt(); canvas.drawPath(h, p); canvas.drawPath(h, w)
            }
            StickerTypeId.CRYSTAL_DROP -> {
                val d = Path().apply { moveTo(0f, -14f); cubicTo(9f, -2f, 10f, 8f, 0f, 14f); cubicTo(-10f, 8f, -9f, -2f, 0f, -14f); close() }
                p.color = 0xFF7DD3FC.toInt(); canvas.drawPath(d, p); canvas.drawPath(d, w)
            }
            StickerTypeId.BUTTERFLY -> {
                p.color = 0xFFC084FC.toInt()
                canvas.drawOval(-16f, -10f, 0f, 2f, p); canvas.drawOval(0f, -10f, 16f, 2f, p)
                p.color = 0xFFFF8AC6.toInt()
                canvas.drawOval(-12f, 1f, 0f, 11f, p); canvas.drawOval(0f, 1f, 12f, 11f, p)
                p.color = 0xFF6D28D9.toInt(); canvas.drawRoundRect(-2f, -7f, 2f, 9f, 2f, 2f, p)
            }
            StickerTypeId.RAINBOW -> {
                val rp = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 4f; strokeCap = Paint.Cap.ROUND }
                rp.color = 0xFFFF6B9E.toInt(); canvas.drawArc(-14f, -8f, 14f, 20f, 180f, 180f, false, rp)
                rp.color = 0xFFFDE047.toInt(); canvas.drawArc(-10f, -4f, 10f, 16f, 180f, 180f, false, rp)
                rp.color = 0xFF38BDF8.toInt(); canvas.drawArc(-6f, 0f, 6f, 12f, 180f, 180f, false, rp)
            }
            StickerTypeId.SAKURA -> {
                p.color = 0xFFFFB3D9.toInt()
                for (i in 0 until 5) {
                    canvas.save(); canvas.rotate(i * 72f); canvas.drawOval(-4.5f, -14f, 4.5f, -1f, p); canvas.restore()
                }
                p.color = 0xFFFDE047.toInt(); canvas.drawCircle(0f, 0f, 3.6f, p)
            }
            StickerTypeId.MOON -> {
                p.color = 0xFFFDE047.toInt(); canvas.drawCircle(0f, 0f, 11f, p)
                p.color = 0xFFFFE6F3.toInt(); canvas.drawCircle(5f, -2f, 9f, p)
            }
            StickerTypeId.FRECKLES -> {
                p.color = 0xFFFBBF24.toInt()
                listOf(-10f to -2f, 0f to 4f, 10f to -3f, -4f to -8f, 6f to 7f).forEach { (fx, fy) -> canvas.drawCircle(fx, fy, 3f, p) }
            }
            StickerTypeId.PEARLS -> {
                p.color = 0xFFFFFDF9.toInt()
                canvas.drawCircle(-8f, 2f, 4.8f, p); canvas.drawCircle(0f, -5f, 5.5f, p); canvas.drawCircle(8f, 2f, 4.8f, p)
            }
            StickerTypeId.DIAMOND -> {
                val d = Path().apply { moveTo(0f, -14f); lineTo(11f, 0f); lineTo(0f, 14f); lineTo(-11f, 0f); close() }
                p.color = 0xFFE0F2FE.toInt(); canvas.drawPath(d, p)
                w.color = 0xFF38BDF8.toInt(); canvas.drawPath(d, w)
            }
            StickerTypeId.CANDY_BOW -> {
                p.color = 0xFFFF6BB5.toInt()
                canvas.drawPath(Path().apply { moveTo(0f, 0f); lineTo(-13f, -9f); lineTo(-11f, 9f); close() }, p)
                canvas.drawPath(Path().apply { moveTo(0f, 0f); lineTo(13f, -9f); lineTo(11f, 9f); close() }, p)
                p.color = 0xFFFDE047.toInt(); canvas.drawCircle(0f, 0f, 4.2f, p)
            }
            StickerTypeId.SPARKLE_DUST -> {
                p.color = 0xFFFFF9C4.toInt(); drawFourPointStar(canvas, 0f, 0f, 13f, p)
                p.color = 0xFFFF8AC6.toInt(); canvas.drawCircle(-11f, -9f, 2.5f, p)
                p.color = 0xFF38BDF8.toInt(); canvas.drawCircle(11f, 9f, 2.5f, p)
            }
        }
        canvas.restore()
    }

    private fun drawPhotoFrame(canvas: Canvas, frameId: FrameId, characterName: String) {
        if (frameId == FrameId.NONE) return
        val p = Paint(Paint.ANTI_ALIAS_FLAG)
        val txt = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            textAlign = Paint.Align.CENTER
            typeface = Typeface.create(Typeface.SANS_SERIF, Typeface.BOLD)
        }
        when (frameId) {
            FrameId.POLAROID_CUTE -> {
                p.color = 0xFFFFFDF9.toInt()
                canvas.drawRect(0f, 0f, 600f, 30f, p)
                canvas.drawRect(0f, 684f, 600f, 800f, p)
                canvas.drawRect(0f, 0f, 30f, 800f, p)
                canvas.drawRect(570f, 0f, 600f, 800f, p)
                txt.color = 0xFFEC4899.toInt(); txt.textSize = 32f
                canvas.drawText("✦ $characterName • Starlight Studio ✦", 300f, 754f, txt)
            }
            FrameId.ROYAL_GOLD -> {
                p.style = Paint.Style.STROKE; p.strokeWidth = 14f; p.color = 0xFFF59E0B.toInt()
                canvas.drawRoundRect(14f, 14f, 586f, 786f, 28f, 28f, p)
                p.strokeWidth = 4f; p.color = 0xFFFEF08A.toInt()
                canvas.drawRoundRect(28f, 28f, 572f, 772f, 20f, 20f, p)
            }
            FrameId.MAGAZINE_STAR -> {
                p.color = 0xDBEC4899.toInt(); canvas.drawRect(0f, 0f, 600f, 102f, p)
                txt.color = Color.WHITE; txt.textSize = 52f
                canvas.drawText("STARLIGHT", 300f, 72f, txt)
                p.color = 0xEBFFFFFF.toInt(); canvas.drawRoundRect(34f, 700f, 310f, 764f, 18f, 18f, p)
                txt.color = 0xFFDB2777.toInt(); txt.textSize = 22f; txt.textAlign = Paint.Align.LEFT
                canvas.drawText("COVER STAR: ${characterName.uppercase()}", 52f, 738f, txt)
            }
            FrameId.SPARKLE_HEARTS -> {
                p.style = Paint.Style.STROKE; p.strokeWidth = 12f; p.color = 0xFFFF8AC6.toInt()
                canvas.drawRoundRect(16f, 16f, 584f, 784f, 32f, 32f, p)
                listOf(48f to 56f, 552f to 56f, 48f to 744f, 552f to 744f).forEach { (x, y) ->
                    drawSticker(canvas, StickerTypeId.PINK_HEART, x, y, 1.35f, 0f)
                }
            }
            FrameId.NONE -> Unit
        }
    }

    private fun drawToolCursor(
        canvas: Canvas,
        x: Float,
        y: Float,
        isSpa: Boolean,
        makeupTool: MakeupToolId,
        spaTool: SpaToolId,
        color: Int
    ) {
        canvas.save()
        canvas.translate(x, y)
        canvas.drawCircle(0f, 0f, 15f, Paint(Paint.ANTI_ALIAS_FLAG).apply { this.color = 0x55FFFFFF })
        canvas.rotate(36f)
        val p = Paint(Paint.ANTI_ALIAS_FLAG)
        if (isSpa || makeupTool == MakeupToolId.REMOVER) {
            p.color = if (spaTool == SpaToolId.MASK && isSpa) 0xEEA7F3D0.toInt() else 0xEEFFFFFF.toInt()
            canvas.drawCircle(0f, 0f, 22f, p)
            p.style = Paint.Style.STROKE; p.strokeWidth = 3f; p.color = 0xFF7DD3FC.toInt()
            canvas.drawCircle(0f, 0f, 22f, p)
        } else if (makeupTool == MakeupToolId.LIPSTICK) {
            p.color = color; canvas.drawRoundRect(-4f, -9f, 28f, 9f, 6f, 6f, p)
            p.color = 0xFFFDE047.toInt(); canvas.drawRect(26f, -11f, 42f, 11f, p)
            p.color = 0xFFFF6BB5.toInt(); canvas.drawRoundRect(42f, -12f, 84f, 12f, 6f, 6f, p)
        } else {
            p.color = color; canvas.drawCircle(6f, 0f, 13f, p)
            p.color = 0xFFFDE047.toInt(); canvas.drawRect(18f, -6f, 34f, 6f, p)
            p.color = 0xFFC084FC.toInt(); canvas.drawRoundRect(34f, -5f, 90f, 5f, 5f, 5f, p)
        }
        canvas.restore()
    }

    private fun heartPath(cx: Float, cy: Float, s: Float): Path = Path().apply {
        moveTo(cx, cy + s)
        cubicTo(cx - s * 1.25f, cy + s * 0.2f, cx - s * 1.3f, cy - s * 0.8f, cx - s * 0.45f, cy - s * 0.85f)
        cubicTo(cx - s * 0.1f, cy - s * 0.85f, cx, cy - s * 0.55f, cx, cy - s * 0.4f)
        cubicTo(cx, cy - s * 0.55f, cx + s * 0.1f, cy - s * 0.85f, cx + s * 0.45f, cy - s * 0.85f)
        cubicTo(cx + s * 1.3f, cy - s * 0.8f, cx + s * 1.25f, cy + s * 0.2f, cx, cy + s)
        close()
    }

    private fun drawFourPointStar(canvas: Canvas, cx: Float, cy: Float, r: Float, paint: Paint) {
        val p = Path().apply {
            moveTo(cx, cy - r); lineTo(cx + r * 0.28f, cy - r * 0.28f); lineTo(cx + r, cy)
            lineTo(cx + r * 0.28f, cy + r * 0.28f); lineTo(cx, cy + r); lineTo(cx - r * 0.28f, cy + r * 0.28f)
            lineTo(cx - r, cy); lineTo(cx - r * 0.28f, cy - r * 0.28f); close()
        }
        canvas.drawPath(p, paint)
    }

    private fun drawFivePointStar(canvas: Canvas, cx: Float, cy: Float, r: Float, paint: Paint) {
        val p = Path()
        for (i in 0 until 10) {
            val angle = -PI / 2.0 + i * PI / 5.0
            val rad = if (i % 2 == 0) r else r * 0.42f
            val x = cx + (cos(angle) * rad).toFloat()
            val y = cy + (sin(angle) * rad).toFloat()
            if (i == 0) p.moveTo(x, y) else p.lineTo(x, y)
        }
        p.close()
        canvas.drawPath(p, paint)
    }
}
