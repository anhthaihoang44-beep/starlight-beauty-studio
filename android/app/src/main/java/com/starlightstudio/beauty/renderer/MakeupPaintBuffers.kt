package com.starlightstudio.beauty.renderer

import android.graphics.*
import com.starlightstudio.beauty.model.MakeupToolId
import com.starlightstudio.beauty.model.SpaToolId
import kotlin.math.hypot
import kotlin.random.Random

object StageGeometry {
    const val W = 600f
    const val H = 800f
    const val FACE_CX = 300f
    const val HEAD_CY = 316f
    const val LEFT_EYE_X = 244f
    const val RIGHT_EYE_X = 356f
    const val EYE_Y = 326f
    const val LEFT_CHEEK_X = 222f
    const val RIGHT_CHEEK_X = 378f
    const val CHEEK_Y = 376f
    const val NOSE_X = 300f
    const val NOSE_Y = 362f
    const val LIPS_X = 300f
    const val LIPS_Y = 412f
    const val LEFT_EAR_X = 183f
    const val RIGHT_EAR_X = 417f
    const val EARLOBE_Y = 360f

    fun facePath(): Path = Path().apply {
        moveTo(188f, 286f)
        cubicTo(186f, 212f, 232f, 174f, 300f, 174f)
        cubicTo(368f, 174f, 414f, 212f, 412f, 286f)
        cubicTo(410f, 356f, 396f, 410f, 356f, 440f)
        cubicTo(336f, 454f, 318f, 460f, 300f, 460f)
        cubicTo(282f, 460f, 264f, 454f, 244f, 440f)
        cubicTo(204f, 410f, 190f, 356f, 188f, 286f)
        close()
    }

    fun spaMaskPath(): Path = Path().apply {
        moveTo(204f, 282f)
        cubicTo(206f, 218f, 242f, 192f, 300f, 192f)
        cubicTo(358f, 192f, 394f, 218f, 396f, 282f)
        cubicTo(394f, 348f, 382f, 400f, 348f, 428f)
        cubicTo(330f, 442f, 315f, 446f, 300f, 446f)
        cubicTo(285f, 446f, 270f, 442f, 252f, 428f)
        cubicTo(218f, 400f, 206f, 348f, 204f, 282f)
        close()
    }

    fun eyeshadowCombinedPath(): Path = Path().apply {
        // Left upper eyelid crescent
        moveTo(196f, 328f)
        cubicTo(202f, 282f, 240f, 272f, 278f, 290f)
        cubicTo(286f, 300f, 286f, 324f, 274f, 334f)
        cubicTo(256f, 312f, 220f, 312f, 196f, 328f)
        close()
        // Right upper eyelid crescent
        moveTo(404f, 328f)
        cubicTo(398f, 282f, 360f, 272f, 322f, 290f)
        cubicTo(314f, 300f, 314f, 324f, 326f, 334f)
        cubicTo(344f, 312f, 380f, 312f, 404f, 328f)
        close()
    }

    fun lipsFullPath(): Path = Path().apply {
        moveTo(268f, 408f)
        cubicTo(276f, 398f, 289f, 396f, 296f, 401f)
        cubicTo(299f, 403f, 301f, 403f, 304f, 401f)
        cubicTo(311f, 396f, 324f, 398f, 332f, 408f)
        cubicTo(324f, 422f, 312f, 427f, 300f, 427f)
        cubicTo(288f, 427f, 276f, 422f, 268f, 408f)
        close()
    }

    fun isNearLips(x: Float, y: Float): Boolean {
        val dx = (x - LIPS_X) / 52f
        val dy = (y - LIPS_Y) / 34f
        return dx * dx + dy * dy <= 1f
    }

    fun isNearEyes(x: Float, y: Float): Boolean {
        val dl = hypot((x - LEFT_EYE_X) / 58f, (y - (EYE_Y - 10f)) / 44f)
        val dr = hypot((x - RIGHT_EYE_X) / 58f, (y - (EYE_Y - 10f)) / 44f)
        return dl <= 1f || dr <= 1f
    }

    fun isNearCheeks(x: Float, y: Float): Boolean {
        val dl = hypot((x - LEFT_CHEEK_X) / 58f, (y - CHEEK_Y) / 46f)
        val dr = hypot((x - RIGHT_CHEEK_X) / 58f, (y - CHEEK_Y) / 46f)
        val dn = hypot((x - NOSE_X) / 28f, (y - NOSE_Y) / 24f)
        return dl <= 1f || dr <= 1f || dn <= 1f
    }

    fun isNearFace(x: Float, y: Float): Boolean {
        return hypot((x - FACE_CX) / 124f, (y - HEAD_CY) / 152f) <= 1f
    }
}

data class SparkleParticle(
    var x: Float,
    var y: Float,
    val vx: Float,
    val vy: Float,
    val size: Float,
    var alpha: Float,
    val color: Int,
    val isBubble: Boolean = false
)

class MakeupPaintBuffers {
    val skinBitmap: Bitmap = Bitmap.createBitmap(600, 800, Bitmap.Config.ARGB_8888)
    val spaBitmap: Bitmap = Bitmap.createBitmap(600, 800, Bitmap.Config.ARGB_8888)
    val eyeshadowBitmap: Bitmap = Bitmap.createBitmap(600, 800, Bitmap.Config.ARGB_8888)
    val lipBitmap: Bitmap = Bitmap.createBitmap(600, 800, Bitmap.Config.ARGB_8888)

    private val skinCanvas = Canvas(skinBitmap)
    private val spaCanvas = Canvas(spaBitmap)
    private val eyeshadowCanvas = Canvas(eyeshadowBitmap)
    private val lipCanvas = Canvas(lipBitmap)

    private val faceClip = StageGeometry.facePath()
    private val spaClip = StageGeometry.spaMaskPath()
    private val shadowClip = StageGeometry.eyeshadowCombinedPath()
    private val lipClip = StageGeometry.lipsFullPath()

    private val erasePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        xfermode = PorterDuffXfermode(PorterDuff.Mode.CLEAR)
    }

    private fun withAlpha(argb: Int, alphaFraction: Float): Int {
        val a = (alphaFraction.coerceIn(0f, 1f) * 255f).toInt()
        return (argb and 0x00FFFFFF) or (a shl 24)
    }

    private fun stampSoft(
        canvas: Canvas,
        clipPath: Path?,
        x: Float,
        y: Float,
        radius: Float,
        color: Int,
        alpha: Float,
        glitter: Boolean = false
    ) {
        canvas.save()
        if (clipPath != null) canvas.clipPath(clipPath)
        val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            shader = RadialGradient(
                x,
                y,
                radius,
                intArrayOf(withAlpha(color, alpha), withAlpha(color, alpha * 0.52f), withAlpha(color, 0f)),
                floatArrayOf(0.08f, 0.56f, 1f),
                Shader.TileMode.CLAMP
            )
        }
        canvas.drawCircle(x, y, radius, paint)

        if (glitter && Random.nextFloat() < 0.72f) {
            val gp = Paint(Paint.ANTI_ALIAS_FLAG)
            repeat(3) {
                gp.color = if (Random.nextBoolean()) 0xEBFFFDE0.toInt() else 0xF2FFFFFF.toInt()
                val gx = x + (Random.nextFloat() - 0.5f) * radius * 1.1f
                val gy = y + (Random.nextFloat() - 0.5f) * radius * 1.1f
                canvas.drawCircle(gx, gy, 1.4f + Random.nextFloat() * 1.6f, gp)
            }
        }
        canvas.restore()
    }

    fun paintMakeup(tool: MakeupToolId, x: Float, y: Float, color: Int, glitter: Boolean) {
        when (tool) {
            MakeupToolId.LIPSTICK -> stampSoft(lipCanvas, lipClip, x, y, 24f, color, 0.54f, glitter)
            MakeupToolId.EYESHADOW -> stampSoft(eyeshadowCanvas, shadowClip, x, y, 27f, color, 0.38f, glitter)
            MakeupToolId.BLUSH -> stampSoft(skinCanvas, faceClip, x, y, 38f, color, 0.22f, false)
            MakeupToolId.HIGHLIGHTER -> stampSoft(skinCanvas, faceClip, x, y, 25f, color, 0.28f, true)
            MakeupToolId.REMOVER -> {
                lipCanvas.drawCircle(x, y, 28f, erasePaint)
                eyeshadowCanvas.drawCircle(x, y, 30f, erasePaint)
                skinCanvas.drawCircle(x, y, 34f, erasePaint)
                spaCanvas.drawCircle(x, y, 34f, erasePaint)
            }
            else -> Unit
        }
    }

    fun paintSpa(tool: SpaToolId, x: Float, y: Float) {
        when (tool) {
            SpaToolId.CLEANSER -> {
                if (!StageGeometry.isNearFace(x, y)) return
                spaCanvas.save()
                spaCanvas.clipPath(spaClip)
                val fillP = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xBAFFFFFF.toInt() }
                val strokeP = Paint(Paint.ANTI_ALIAS_FLAG).apply {
                    style = Paint.Style.STROKE
                    strokeWidth = 1.8f
                    color = 0xAA7DD3FC.toInt()
                }
                repeat(3) {
                    val bx = x + (Random.nextFloat() - 0.5f) * 34f
                    val by = y + (Random.nextFloat() - 0.5f) * 34f
                    val br = 8f + Random.nextFloat() * 13f
                    spaCanvas.drawCircle(bx, by, br, fillP)
                    spaCanvas.drawCircle(bx, by, br, strokeP)
                }
                spaCanvas.restore()
            }
            SpaToolId.MASK -> {
                if (!StageGeometry.isNearFace(x, y)) return
                stampSoft(spaCanvas, spaClip, x, y, 38f, 0xFFA7F3D0.toInt(), 0.45f, false)
            }
            SpaToolId.RINSE -> {
                spaCanvas.drawCircle(x, y, 42f, erasePaint)
            }
            SpaToolId.PRIMER -> Unit
        }
    }

    fun autoFill(tool: MakeupToolId, color: Int, glitter: Boolean) {
        when (tool) {
            MakeupToolId.LIPSTICK -> {
                lipBitmap.eraseColor(Color.TRANSPARENT)
                lipCanvas.save()
                lipCanvas.clipPath(lipClip)
                val p = Paint(Paint.ANTI_ALIAS_FLAG).apply {
                    shader = LinearGradient(
                        268f, 396f, 268f, 428f,
                        intArrayOf(withAlpha(color, 0.92f), withAlpha(color, 0.85f), withAlpha(color, 0.95f)),
                        null,
                        Shader.TileMode.CLAMP
                    )
                }
                lipCanvas.drawRect(260f, 390f, 340f, 436f, p)
                lipCanvas.restore()
            }
            MakeupToolId.EYESHADOW -> {
                eyeshadowBitmap.eraseColor(Color.TRANSPARENT)
                listOf(StageGeometry.LEFT_EYE_X, StageGeometry.RIGHT_EYE_X).forEach { cx ->
                    for (step in -2..2) {
                        stampSoft(eyeshadowCanvas, shadowClip, cx + step * 14f, StageGeometry.EYE_Y - 22f, 28f, color, 0.46f, glitter)
                    }
                }
            }
            MakeupToolId.BLUSH -> {
                stampSoft(skinCanvas, faceClip, StageGeometry.LEFT_CHEEK_X, StageGeometry.CHEEK_Y, 45f, color, 0.52f)
                stampSoft(skinCanvas, faceClip, StageGeometry.RIGHT_CHEEK_X, StageGeometry.CHEEK_Y, 45f, color, 0.52f)
            }
            MakeupToolId.HIGHLIGHTER -> {
                stampSoft(skinCanvas, faceClip, StageGeometry.LEFT_CHEEK_X - 8f, StageGeometry.CHEEK_Y - 12f, 26f, color, 0.52f, true)
                stampSoft(skinCanvas, faceClip, StageGeometry.RIGHT_CHEEK_X + 8f, StageGeometry.CHEEK_Y - 12f, 26f, color, 0.52f, true)
                stampSoft(skinCanvas, faceClip, StageGeometry.NOSE_X, StageGeometry.NOSE_Y, 16f, color, 0.56f, true)
            }
            else -> Unit
        }
    }

    fun applySurprise(lipColor: Int, shadowColor: Int, blushColor: Int) {
        clearAll()
        autoFill(MakeupToolId.LIPSTICK, lipColor, true)
        autoFill(MakeupToolId.EYESHADOW, shadowColor, true)
        autoFill(MakeupToolId.BLUSH, blushColor, false)
    }

    fun clearTool(tool: MakeupToolId) {
        when (tool) {
            MakeupToolId.LIPSTICK -> lipBitmap.eraseColor(Color.TRANSPARENT)
            MakeupToolId.EYESHADOW -> eyeshadowBitmap.eraseColor(Color.TRANSPARENT)
            MakeupToolId.BLUSH, MakeupToolId.HIGHLIGHTER -> skinBitmap.eraseColor(Color.TRANSPARENT)
            else -> Unit
        }
    }

    fun clearSpa() {
        spaBitmap.eraseColor(Color.TRANSPARENT)
    }

    fun clearAll() {
        skinBitmap.eraseColor(Color.TRANSPARENT)
        spaBitmap.eraseColor(Color.TRANSPARENT)
        eyeshadowBitmap.eraseColor(Color.TRANSPARENT)
        lipBitmap.eraseColor(Color.TRANSPARENT)
    }
}
