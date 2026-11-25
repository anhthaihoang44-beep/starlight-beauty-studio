package com.starlightstudio.beauty.ui

import android.graphics.BitmapFactory
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.starlightstudio.beauty.audio.SoundSynthesizer
import com.starlightstudio.beauty.i18n.AppStrings
import com.starlightstudio.beauty.model.*
import com.starlightstudio.beauty.renderer.CharacterRenderer
import com.starlightstudio.beauty.renderer.MakeupPaintBuffers
import com.starlightstudio.beauty.renderer.SparkleParticle
import com.starlightstudio.beauty.renderer.StageGeometry
import kotlinx.coroutines.delay
import java.io.File
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.hypot
import kotlin.math.sin
import kotlin.random.Random

private val PinkMain = Color(0xFFEC4899)
private val PinkSoft = Color(0xFFFFF0F8)
private val PurpleMain = Color(0xFFA855F7)
private val InkDark = Color(0xFF3B1C4A)
private val InkMuted = Color(0xFF6B4C7A)

@Composable
fun HomeScreen(
    lang: Language,
    muted: Boolean,
    selectedModelId: String,
    photoCount: Int,
    onToggleLang: () -> Unit,
    onToggleMute: () -> Unit,
    onSelectModel: (String) -> Unit,
    onStartMakeover: () -> Unit,
    onOpenGallery: () -> Unit
) {
    val bgBrush = Brush.linearGradient(listOf(Color(0xFFFFE7F4), Color(0xFFF5E1FF), Color(0xFFE0F4FF)))

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(bgBrush)
            .statusBarsPadding()
            .navigationBarsPadding()
            .padding(horizontal = 14.dp, vertical = 10.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Top header bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                shape = RoundedCornerShape(50),
                color = Color.White.copy(alpha = 0.9f),
                border = BorderStroke(1.5.dp, Color(0xFFFBCFE8))
            ) {
                Text(
                    text = "✨ ${AppStrings.badgeSafe(lang)}",
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = PinkMain
                )
            }
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                SmallPillButton(text = "📸 ($photoCount)", onClick = onOpenGallery)
                SmallPillButton(text = lang.name, onClick = onToggleLang)
                IconButton(
                    onClick = onToggleMute,
                    modifier = Modifier
                        .size(34.dp)
                        .clip(CircleShape)
                        .background(Color.White)
                        .border(1.5.dp, Color(0xFFFBCFE8), CircleShape)
                ) {
                    Icon(
                        if (muted) Icons.Default.VolumeOff else Icons.Default.VolumeUp,
                        contentDescription = null,
                        tint = InkDark,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }

        Spacer(Modifier.height(10.dp))

        Text(
            text = AppStrings.appName(lang),
            fontSize = 27.sp,
            fontWeight = FontWeight.ExtraBold,
            color = PinkMain,
            textAlign = TextAlign.Center
        )
        Text(
            text = AppStrings.tagline(lang),
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = InkMuted
        )

        Spacer(Modifier.height(8.dp))
        Text(
            text = AppStrings.chooseModel(lang),
            fontSize = 17.sp,
            fontWeight = FontWeight.Bold,
            color = InkDark
        )
        Spacer(Modifier.height(8.dp))

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(BeautyCatalog.characters, key = { it.id }) { character ->
                val isSelected = character.id == selectedModelId
                val accent = Color(character.accentColor)
                Surface(
                    shape = RoundedCornerShape(22.dp),
                    color = if (isSelected) Color(0xFFFFF4FA) else Color.White.copy(alpha = 0.94f),
                    border = BorderStroke(if (isSelected) 3.dp else 2.dp, if (isSelected) accent else Color(0xFFFFE0F0)),
                    shadowElevation = if (isSelected) 8.dp else 3.dp,
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable {
                            SoundSynthesizer.playSparkle()
                            onSelectModel(character.id)
                        }
                ) {
                    Column(
                        modifier = Modifier.padding(8.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .aspectRatio(1f)
                                .clip(RoundedCornerShape(16.dp))
                                .background(Brush.radialGradient(listOf(Color(0xFFFFF8FC), Color(0xFFFCE7F3))))
                        ) {
                            Canvas(modifier = Modifier.fillMaxSize()) {
                                drawIntoCanvas { c ->
                                    CharacterRenderer.drawPortraitPreview(c.nativeCanvas, size.width, size.height, character)
                                }
                            }
                        }
                        Spacer(Modifier.height(6.dp))
                        Text(character.name, fontWeight = FontWeight.ExtraBold, fontSize = 16.sp, color = InkDark)
                        Text(
                            character.title.text(lang),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = InkMuted,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }
            }
        }

        Spacer(Modifier.height(10.dp))

        Button(
            onClick = onStartMakeover,
            shape = RoundedCornerShape(50),
            colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
            contentPadding = PaddingValues(),
            modifier = Modifier
                .fillMaxWidth(0.86f)
                .height(54.dp)
                .clip(RoundedCornerShape(50))
                .background(Brush.horizontalGradient(listOf(Color(0xFFFF5CA8), PurpleMain)))
        ) {
            Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = Color.White)
            Spacer(Modifier.width(8.dp))
            Text(AppStrings.startMakeover(lang), fontSize = 18.sp, fontWeight = FontWeight.ExtraBold, color = Color.White)
        }
    }
}

@Composable
fun SalonAndPhotoScreen(
    lang: Language,
    muted: Boolean,
    isPhotoBooth: Boolean,
    state: MakeoverState,
    buffers: MakeupPaintBuffers,
    paintTick: Int,
    lastCapturedFile: String?,
    justSaved: Boolean,
    flashActive: Boolean,
    onBack: () -> Unit,
    onToggleLang: () -> Unit,
    onToggleMute: () -> Unit,
    onGoPhotoBooth: () -> Unit,
    onOpenGallery: () -> Unit,
    onUpdateState: (MakeoverState) -> Unit,
    onBumpPaint: () -> Unit,
    onSurprise: () -> Unit,
    onResetFace: () -> Unit,
    onSnapPhoto: () -> Unit,
    onShareLatest: () -> Unit
) {
    var activeCategory by remember { mutableStateOf(SalonCategory.MAKEUP) }
    var activeMakeupTool by remember { mutableStateOf(MakeupToolId.LIPSTICK) }
    var activeSpaTool by remember { mutableStateOf(SpaToolId.CLEANSER) }
    var activeSticker by remember { mutableStateOf(StickerTypeId.STAR_GEM) }
    val selectedColors = remember {
        mutableStateMapOf(
            MakeupToolId.LIPSTICK to BeautyCatalog.lipstickSwatches.first().argb,
            MakeupToolId.EYESHADOW to BeautyCatalog.eyeshadowSwatches.first().argb,
            MakeupToolId.BLUSH to BeautyCatalog.blushSwatches.first().argb,
            MakeupToolId.HIGHLIGHTER to BeautyCatalog.highlighterSwatches.first().argb,
            MakeupToolId.EYELINER to 0xFF1E1B2E.toInt(),
            MakeupToolId.MASCARA to 0xFF1E1B2E.toInt(),
            MakeupToolId.REMOVER to 0xFFFFFFFF.toInt()
        )
    }

    var cursorStagePos by remember { mutableStateOf<Pair<Float, Float>?>(null) }
    val particles = remember { mutableStateListOf<SparkleParticle>() }
    var particleFrame by remember { mutableIntStateOf(0) }
    var isBlinking by remember { mutableStateOf(false) }

    // Natural blinking coroutine
    LaunchedEffect(Unit) {
        while (true) {
            delay(2800L + Random.nextLong(2400L))
            isBlinking = true
            delay(150L)
            isBlinking = false
        }
    }

    // 60fps sparkle particle ticker
    LaunchedEffect(Unit) {
        while (true) {
            delay(16L)
            if (particles.isNotEmpty()) {
                val iter = particles.listIterator()
                while (iter.hasNext()) {
                    val p = iter.next()
                    p.x += p.vx
                    p.y += p.vy
                    p.alpha -= 0.03f
                    if (p.alpha <= 0f) iter.remove()
                }
                particleFrame++
            }
        }
    }

    fun spawnParticles(x: Float, y: Float, count: Int, color: Int, isBubble: Boolean = false) {
        repeat(count) {
            val a = Random.nextFloat() * 2f * PI.toFloat()
            val spd = 0.8f + Random.nextFloat() * 2.4f
            particles.add(
                SparkleParticle(
                    x = x + (Random.nextFloat() - 0.5f) * 18f,
                    y = y + (Random.nextFloat() - 0.5f) * 18f,
                    vx = cos(a) * spd,
                    vy = sin(a) * spd - 0.9f,
                    size = if (isBubble) 6f + Random.nextFloat() * 7f else 5f + Random.nextFloat() * 6f,
                    alpha = 1f,
                    color = color,
                    isBubble = isBubble
                )
            )
        }
        particleFrame++
    }

    fun applyPaintAt(sx: Float, sy: Float) {
        val color = selectedColors[activeMakeupTool] ?: 0xFFFF69B4.toInt()
        if (activeCategory == SalonCategory.SPA) {
            buffers.paintSpa(activeSpaTool, sx, sy)
            when (activeSpaTool) {
                SpaToolId.CLEANSER, SpaToolId.RINSE -> {
                    SoundSynthesizer.playBubblePop()
                    spawnParticles(sx, sy, 2, 0xFFFFFFFF.toInt(), isBubble = true)
                }
                SpaToolId.MASK -> {
                    SoundSynthesizer.playBrush(false)
                    spawnParticles(sx, sy, 1, 0xFFA7F3D0.toInt())
                }
                SpaToolId.PRIMER -> {
                    if (StageGeometry.isNearFace(sx, sy) && !state.spaGlow) {
                        onUpdateState(state.copy(spaGlow = true))
                    }
                    SoundSynthesizer.playBrush(true)
                    spawnParticles(sx, sy, 2, 0xFFFEF08A.toInt())
                }
            }
            onBumpPaint()
            return
        }

        if (activeCategory != SalonCategory.MAKEUP) return

        when (activeMakeupTool) {
            MakeupToolId.LIPSTICK -> {
                val gl = state.lipFinish == LipFinish.GLITTER
                buffers.paintMakeup(MakeupToolId.LIPSTICK, sx, sy, color, gl)
                if (StageGeometry.isNearLips(sx, sy)) {
                    if (!state.hasLipPaint) onUpdateState(state.copy(hasLipPaint = true))
                    SoundSynthesizer.playBrush(gl)
                    spawnParticles(sx, sy, 2, color)
                }
                onBumpPaint()
            }
            MakeupToolId.EYESHADOW -> {
                val gl = state.eyeshadowFinish == EyeshadowFinish.SHIMMER
                buffers.paintMakeup(MakeupToolId.EYESHADOW, sx, sy, color, gl)
                if (StageGeometry.isNearEyes(sx, sy)) {
                    if (!state.hasEyeshadowPaint) onUpdateState(state.copy(hasEyeshadowPaint = true))
                    SoundSynthesizer.playBrush(gl)
                    spawnParticles(sx, sy, 2, color)
                }
                onBumpPaint()
            }
            MakeupToolId.BLUSH, MakeupToolId.HIGHLIGHTER -> {
                val isHl = activeMakeupTool == MakeupToolId.HIGHLIGHTER
                buffers.paintMakeup(activeMakeupTool, sx, sy, color, isHl)
                if (StageGeometry.isNearCheeks(sx, sy)) {
                    if (!state.hasBlushPaint) onUpdateState(state.copy(hasBlushPaint = true))
                    SoundSynthesizer.playBrush(isHl)
                    spawnParticles(sx, sy, 2, color)
                }
                onBumpPaint()
            }
            MakeupToolId.EYELINER -> {
                if (StageGeometry.isNearEyes(sx, sy)) {
                    val style = if (state.eyelinerStyle == EyelinerStyleId.NONE) EyelinerStyleId.CLASSIC else state.eyelinerStyle
                    onUpdateState(state.copy(eyelinerStyle = style, eyelinerCoverage = (state.eyelinerCoverage + 0.14f).coerceAtMost(1f)))
                    SoundSynthesizer.playBrush(true)
                    spawnParticles(sx, sy, 2, 0xFFFEF08A.toInt())
                }
            }
            MakeupToolId.MASCARA -> {
                if (StageGeometry.isNearEyes(sx, sy)) {
                    val style = if (state.mascaraStyle == MascaraStyleId.NATURAL) MascaraStyleId.CURLED else state.mascaraStyle
                    onUpdateState(state.copy(mascaraStyle = style, mascaraCoverage = (state.mascaraCoverage + 0.14f).coerceAtMost(1f)))
                    SoundSynthesizer.playBrush(false)
                    spawnParticles(sx, sy, 2, 0xFFFF8AC6.toInt())
                }
            }
            MakeupToolId.REMOVER -> {
                buffers.paintMakeup(MakeupToolId.REMOVER, sx, sy, 0, false)
                SoundSynthesizer.playBubblePop()
                spawnParticles(sx, sy, 2, 0xFFFFFFFF.toInt(), isBubble = true)
                onBumpPaint()
            }
        }
    }

    val bgBrush = Brush.linearGradient(listOf(Color(0xFFFFE7F4), Color(0xFFF5E1FF), Color(0xFFE0F4FF)))
    var stageSize by remember { mutableStateOf(IntSize(1, 1)) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(bgBrush)
            .statusBarsPadding()
            .navigationBarsPadding()
    ) {
        // Top Action Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White.copy(alpha = 0.88f))
                .padding(horizontal = 10.dp, vertical = 7.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            SmallPillButton(
                text = "← ${if (isPhotoBooth) AppStrings.backToSalon(lang) else AppStrings.models(lang)}",
                onClick = onBack
            )

            Row(horizontalArrangement = Arrangement.spacedBy(5.dp), verticalAlignment = Alignment.CenterVertically) {
                if (!isPhotoBooth) {
                    SmallPillButton(
                        text = "✨ ${AppStrings.surprise(lang)}",
                        containerColor = Color(0xFFFDE047),
                        textColor = Color(0xFF5C1D0C),
                        onClick = onSurprise
                    )
                    IconButton(
                        onClick = onResetFace,
                        modifier = Modifier
                            .size(34.dp)
                            .clip(CircleShape)
                            .background(Color.White)
                            .border(1.5.dp, Color(0xFFFBCFE8), CircleShape)
                    ) {
                        Icon(Icons.Default.Refresh, contentDescription = null, tint = InkDark, modifier = Modifier.size(18.dp))
                    }
                }
                SmallPillButton(text = lang.name, onClick = onToggleLang)
                IconButton(
                    onClick = onToggleMute,
                    modifier = Modifier
                        .size(34.dp)
                        .clip(CircleShape)
                        .background(Color.White)
                        .border(1.5.dp, Color(0xFFFBCFE8), CircleShape)
                ) {
                    Icon(if (muted) Icons.Default.VolumeOff else Icons.Default.VolumeUp, contentDescription = null, tint = InkDark, modifier = Modifier.size(17.dp))
                }
                if (!isPhotoBooth) {
                    SmallPillButton(
                        text = "📷 ${AppStrings.photo(lang)}",
                        containerColor = PinkMain,
                        textColor = Color.White,
                        onClick = onGoPhotoBooth
                    )
                }
            }
        }

        // Character Stage Area
        Box(
            modifier = Modifier
                .weight(1.25f)
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 8.dp),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .fillMaxHeight()
                    .aspectRatio(3f / 4f)
                    .clip(RoundedCornerShape(24.dp))
                    .border(4.dp, Color.White, RoundedCornerShape(24.dp))
                    .onSizeChanged { stageSize = it }
                    .pointerInput(isPhotoBooth, activeCategory, activeMakeupTool, activeSpaTool, activeSticker, state) {
                        if (isPhotoBooth) return@pointerInput
                        detectTapGestures { offset ->
                            val sx = (offset.x / stageSize.width.coerceAtLeast(1)) * StageGeometry.W
                            val sy = (offset.y / stageSize.height.coerceAtLeast(1)) * StageGeometry.H
                            if (activeCategory == SalonCategory.STICKERS) {
                                val next = state.stickers.takeLast(24) + PlacedSticker(
                                    id = System.nanoTime(),
                                    type = activeSticker,
                                    x = sx,
                                    y = sy,
                                    scale = 0.9f + Random.nextFloat() * 0.25f,
                                    rotation = (Random.nextFloat() - 0.5f) * 24f
                                )
                                onUpdateState(state.copy(stickers = next))
                                spawnParticles(sx, sy, 8, 0xFFFDE047.toInt())
                                SoundSynthesizer.playSparkle()
                            } else if (activeCategory == SalonCategory.MAKEUP || activeCategory == SalonCategory.SPA) {
                                applyPaintAt(sx, sy)
                            }
                        }
                    }
                    .pointerInput(isPhotoBooth, activeCategory, activeMakeupTool, activeSpaTool, state) {
                        if (isPhotoBooth) return@pointerInput
                        var lastPt: Pair<Float, Float>? = null
                        detectDragGestures(
                            onDragStart = { start ->
                                val sx = (start.x / stageSize.width.coerceAtLeast(1)) * StageGeometry.W
                                val sy = ((start.y - 24f) / stageSize.height.coerceAtLeast(1)) * StageGeometry.H
                                cursorStagePos = sx to sy
                                lastPt = sx to sy
                                applyPaintAt(sx, sy)
                            },
                            onDragEnd = {
                                cursorStagePos = null
                                lastPt = null
                            },
                            onDragCancel = {
                                cursorStagePos = null
                                lastPt = null
                            }
                        ) { change, _ ->
                            val sx = (change.position.x / stageSize.width.coerceAtLeast(1)) * StageGeometry.W
                            val sy = ((change.position.y - 24f) / stageSize.height.coerceAtLeast(1)) * StageGeometry.H
                            cursorStagePos = sx to sy
                            val prev = lastPt ?: (sx to sy)
                            val dist = hypot(sx - prev.first, sy - prev.second)
                            val steps = (dist / 8f).toInt().coerceAtLeast(1)
                            for (i in 1..steps) {
                                val ix = prev.first + (sx - prev.first) * (i.toFloat() / steps)
                                val iy = prev.second + (sy - prev.second) * (i.toFloat() / steps)
                                applyPaintAt(ix, iy)
                            }
                            lastPt = sx to sy
                        }
                    }
            ) {
                Canvas(modifier = Modifier.fillMaxSize()) {
                    // Read reactive ticks to trigger smooth redraws
                    @Suppress("UNUSED_VARIABLE")
                    val trigger = paintTick + particleFrame
                    drawIntoCanvas { c ->
                        CharacterRenderer.drawFullScene(
                            canvas = c.nativeCanvas,
                            width = size.width,
                            height = size.height,
                            state = state,
                            buffers = buffers,
                            isBlinking = isBlinking,
                            showFrame = isPhotoBooth,
                            includeBackground = true,
                            cursorX = cursorStagePos?.first,
                            cursorY = cursorStagePos?.second,
                            activeCategory = if (isPhotoBooth) null else activeCategory,
                            activeMakeupTool = activeMakeupTool,
                            activeSpaTool = activeSpaTool,
                            activeToolColor = selectedColors[activeMakeupTool] ?: 0xFFFF69B4.toInt(),
                            particles = particles.toList()
                        )
                    }
                }
                if (flashActive) {
                    Box(modifier = Modifier.fillMaxSize().background(Color.White.copy(alpha = 0.88f)))
                }
            }
        }

        // Bottom Controls Sheet
        Surface(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 4.dp),
            shape = RoundedCornerShape(24.dp),
            color = Color.White.copy(alpha = 0.94f),
            border = BorderStroke(2.dp, Color.White),
            shadowElevation = 8.dp
        ) {
            if (isPhotoBooth) {
                PhotoBoothPanel(
                    lang = lang,
                    state = state,
                    hasLatest = lastCapturedFile != null,
                    justSaved = justSaved,
                    onUpdateState = onUpdateState,
                    onSnapPhoto = onSnapPhoto,
                    onShareLatest = onShareLatest,
                    onOpenGallery = onOpenGallery
                )
            } else {
                SalonControlPanel(
                    lang = lang,
                    state = state,
                    activeCategory = activeCategory,
                    activeMakeupTool = activeMakeupTool,
                    activeSpaTool = activeSpaTool,
                    selectedColors = selectedColors,
                    activeSticker = activeSticker,
                    onSelectCategory = { activeCategory = it },
                    onSelectMakeupTool = { activeMakeupTool = it },
                    onSelectSpaTool = { activeSpaTool = it },
                    onSelectColor = { tool, argb -> selectedColors[tool] = argb },
                    onSelectSticker = { activeSticker = it },
                    onUpdateState = onUpdateState,
                    onMagicFill = {
                        val color = selectedColors[activeMakeupTool] ?: 0xFFFF69B4.toInt()
                        when (activeMakeupTool) {
                            MakeupToolId.LIPSTICK -> {
                                buffers.autoFill(MakeupToolId.LIPSTICK, color, state.lipFinish == LipFinish.GLITTER)
                                onUpdateState(state.copy(hasLipPaint = true))
                                spawnParticles(StageGeometry.LIPS_X, StageGeometry.LIPS_Y, 12, color)
                            }
                            MakeupToolId.EYESHADOW -> {
                                buffers.autoFill(MakeupToolId.EYESHADOW, color, state.eyeshadowFinish == EyeshadowFinish.SHIMMER)
                                onUpdateState(state.copy(hasEyeshadowPaint = true))
                                spawnParticles(StageGeometry.LEFT_EYE_X, StageGeometry.EYE_Y - 18f, 8, color)
                                spawnParticles(StageGeometry.RIGHT_EYE_X, StageGeometry.EYE_Y - 18f, 8, color)
                            }
                            MakeupToolId.BLUSH, MakeupToolId.HIGHLIGHTER -> {
                                buffers.autoFill(activeMakeupTool, color, activeMakeupTool == MakeupToolId.HIGHLIGHTER)
                                onUpdateState(state.copy(hasBlushPaint = true))
                                spawnParticles(StageGeometry.LEFT_CHEEK_X, StageGeometry.CHEEK_Y, 7, color)
                                spawnParticles(StageGeometry.RIGHT_CHEEK_X, StageGeometry.CHEEK_Y, 7, color)
                            }
                            MakeupToolId.EYELINER -> {
                                val st = if (state.eyelinerStyle == EyelinerStyleId.NONE) EyelinerStyleId.CLASSIC else state.eyelinerStyle
                                onUpdateState(state.copy(eyelinerStyle = st, eyelinerCoverage = 1f))
                            }
                            MakeupToolId.MASCARA -> {
                                val st = if (state.mascaraStyle == MascaraStyleId.NATURAL) MascaraStyleId.CURLED else state.mascaraStyle
                                onUpdateState(state.copy(mascaraStyle = st, mascaraCoverage = 1f))
                            }
                            MakeupToolId.REMOVER -> Unit
                        }
                        SoundSynthesizer.playSparkle()
                        onBumpPaint()
                    },
                    onClearCurrent = {
                        SoundSynthesizer.playBubblePop()
                        if (activeCategory == SalonCategory.SPA) {
                            buffers.clearSpa()
                        } else if (activeMakeupTool == MakeupToolId.EYELINER) {
                            onUpdateState(state.copy(eyelinerStyle = EyelinerStyleId.NONE, eyelinerCoverage = 0f))
                        } else if (activeMakeupTool == MakeupToolId.MASCARA) {
                            onUpdateState(state.copy(mascaraStyle = MascaraStyleId.NATURAL, mascaraCoverage = 0f))
                        } else {
                            buffers.clearTool(activeMakeupTool)
                            if (activeMakeupTool == MakeupToolId.LIPSTICK) onUpdateState(state.copy(hasLipPaint = false))
                            if (activeMakeupTool == MakeupToolId.EYESHADOW) onUpdateState(state.copy(hasEyeshadowPaint = false))
                            if (activeMakeupTool == MakeupToolId.BLUSH || activeMakeupTool == MakeupToolId.HIGHLIGHTER) onUpdateState(state.copy(hasBlushPaint = false))
                        }
                        onBumpPaint()
                    }
                )
            }
        }
    }
}

@Composable
private fun SalonControlPanel(
    lang: Language,
    state: MakeoverState,
    activeCategory: SalonCategory,
    activeMakeupTool: MakeupToolId,
    activeSpaTool: SpaToolId,
    selectedColors: Map<MakeupToolId, Int>,
    activeSticker: StickerTypeId,
    onSelectCategory: (SalonCategory) -> Unit,
    onSelectMakeupTool: (MakeupToolId) -> Unit,
    onSelectSpaTool: (SpaToolId) -> Unit,
    onSelectColor: (MakeupToolId, Int) -> Unit,
    onSelectSticker: (StickerTypeId) -> Unit,
    onUpdateState: (MakeoverState) -> Unit,
    onMagicFill: () -> Unit,
    onClearCurrent: () -> Unit
) {
    var eyeSub by remember { mutableIntStateOf(0) }
    var hairSub by remember { mutableIntStateOf(0) }
    var dressSub by remember { mutableIntStateOf(0) }
    var accSub by remember { mutableIntStateOf(0) }

    Column(modifier = Modifier.fillMaxSize()) {
        // Category Tabs Ribbon
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFFFFF5FA))
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 8.dp, vertical = 6.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            val catEmoji = mapOf(
                SalonCategory.SPA to "🫧",
                SalonCategory.MAKEUP to "💄",
                SalonCategory.EYES to "👁️",
                SalonCategory.HAIR to "💇‍♀️",
                SalonCategory.DRESS to "👗",
                SalonCategory.ACCESSORIES to "👑",
                SalonCategory.STICKERS to "💖"
            )
            SalonCategory.entries.forEach { cat ->
                val sel = cat == activeCategory
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = if (sel) PinkMain else Color.White,
                    border = BorderStroke(1.5.dp, if (sel) PinkMain else Color(0xFFFCE7F3)),
                    modifier = Modifier.clickable {
                        SoundSynthesizer.playTap()
                        onSelectCategory(cat)
                    }
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Text(catEmoji[cat] ?: "✨", fontSize = 14.sp)
                        Text(
                            AppStrings.categoryLabel(cat, lang),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (sel) Color.White else InkDark
                        )
                    }
                }
            }
        }

        // Body scrollable content
        Column(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            when (activeCategory) {
                SalonCategory.SPA -> {
                    HintBar(text = "✨ ${AppStrings.spaHint(activeSpaTool, lang)}")
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        SpaToolId.entries.take(2).forEach { tool ->
                            OptionChipButton(
                                label = AppStrings.spaToolLabel(tool, lang),
                                selected = activeSpaTool == tool,
                                modifier = Modifier.weight(1f),
                                onClick = { SoundSynthesizer.playTap(); onSelectSpaTool(tool) }
                            )
                        }
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        SpaToolId.entries.drop(2).forEach { tool ->
                            OptionChipButton(
                                label = AppStrings.spaToolLabel(tool, lang),
                                selected = activeSpaTool == tool,
                                modifier = Modifier.weight(1f),
                                onClick = { SoundSynthesizer.playTap(); onSelectSpaTool(tool) }
                            )
                        }
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        SmallPillButton(text = "💧 ${AppStrings.spaToolLabel(SpaToolId.RINSE, lang)}", onClick = onClearCurrent)
                        SmallPillButton(
                            text = "✨ Glow: ${if (state.spaGlow) "ON" else "OFF"}",
                            containerColor = if (state.spaGlow) PurpleMain else Color.White,
                            textColor = if (state.spaGlow) Color.White else InkDark,
                            onClick = { SoundSynthesizer.playSparkle(); onUpdateState(state.copy(spaGlow = !state.spaGlow)) }
                        )
                    }
                }

                SalonCategory.MAKEUP -> {
                    // Tool strip
                    Row(
                        modifier = Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        val emojis = mapOf(
                            MakeupToolId.LIPSTICK to "💄",
                            MakeupToolId.EYESHADOW to "🎨",
                            MakeupToolId.BLUSH to "🌸",
                            MakeupToolId.HIGHLIGHTER to "✨",
                            MakeupToolId.EYELINER to "✏️",
                            MakeupToolId.MASCARA to "👁️",
                            MakeupToolId.REMOVER to "🫧"
                        )
                        MakeupToolId.entries.forEach { tool ->
                            val sel = tool == activeMakeupTool
                            Surface(
                                shape = RoundedCornerShape(14.dp),
                                color = if (sel) PurpleMain else PinkSoft,
                                border = BorderStroke(1.5.dp, if (sel) PurpleMain else Color(0xFFFBCFE8)),
                                modifier = Modifier.clickable { SoundSynthesizer.playTap(); onSelectMakeupTool(tool) }
                            ) {
                                Text(
                                    "${emojis[tool]} ${AppStrings.makeupToolLabel(tool, lang)}",
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (sel) Color.White else InkDark
                                )
                            }
                        }
                    }

                    // Hint + Magic Fill + Clear
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            AppStrings.makeupHint(activeMakeupTool, lang),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = InkMuted,
                            modifier = Modifier.weight(1f)
                        )
                        if (activeMakeupTool != MakeupToolId.REMOVER) {
                            Row(horizontalArrangement = Arrangement.spacedBy(5.dp)) {
                                SmallPillButton(
                                    text = "🪄 ${AppStrings.magicFill(lang)}",
                                    containerColor = PinkMain,
                                    textColor = Color.White,
                                    onClick = onMagicFill
                                )
                                SmallPillButton(text = "🗑️", onClick = onClearCurrent)
                            }
                        }
                    }

                    // Finish / Style toggles
                    if (activeMakeupTool == MakeupToolId.LIPSTICK) {
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            LipFinish.entries.forEach { fin ->
                                OptionChipButton(
                                    label = AppStrings.lipFinishLabel(fin, lang),
                                    selected = state.lipFinish == fin,
                                    onClick = { SoundSynthesizer.playTap(); onUpdateState(state.copy(lipFinish = fin)) }
                                )
                            }
                        }
                    } else if (activeMakeupTool == MakeupToolId.EYESHADOW) {
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            EyeshadowFinish.entries.forEach { fin ->
                                OptionChipButton(
                                    label = AppStrings.shadowFinishLabel(fin, lang),
                                    selected = state.eyeshadowFinish == fin,
                                    onClick = { SoundSynthesizer.playTap(); onUpdateState(state.copy(eyeshadowFinish = fin)) }
                                )
                            }
                        }
                    } else if (activeMakeupTool == MakeupToolId.EYELINER) {
                        Row(modifier = Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            EyelinerStyleId.entries.forEach { st ->
                                OptionChipButton(
                                    label = AppStrings.eyelinerName(st, lang),
                                    selected = state.eyelinerStyle == st,
                                    onClick = {
                                        SoundSynthesizer.playSparkle()
                                        onUpdateState(state.copy(eyelinerStyle = st, eyelinerCoverage = if (st == EyelinerStyleId.NONE) 0f else 1f))
                                    }
                                )
                            }
                        }
                    } else if (activeMakeupTool == MakeupToolId.MASCARA) {
                        Row(modifier = Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            MascaraStyleId.entries.forEach { st ->
                                OptionChipButton(
                                    label = AppStrings.mascaraName(st, lang),
                                    selected = state.mascaraStyle == st,
                                    onClick = {
                                        SoundSynthesizer.playSparkle()
                                        onUpdateState(state.copy(mascaraStyle = st, mascaraCoverage = if (st == MascaraStyleId.NATURAL) 0f else 1f))
                                    }
                                )
                            }
                        }
                    }

                    // Color swatches
                    if (activeMakeupTool != MakeupToolId.REMOVER) {
                        val swatches = when (activeMakeupTool) {
                            MakeupToolId.LIPSTICK -> BeautyCatalog.lipstickSwatches
                            MakeupToolId.EYESHADOW -> BeautyCatalog.eyeshadowSwatches
                            MakeupToolId.BLUSH -> BeautyCatalog.blushSwatches
                            MakeupToolId.HIGHLIGHTER -> BeautyCatalog.highlighterSwatches
                            MakeupToolId.EYELINER -> BeautyCatalog.eyelinerColors
                            MakeupToolId.MASCARA -> BeautyCatalog.mascaraColors
                            MakeupToolId.REMOVER -> emptyList()
                        }
                        SwatchWrapRow(
                            colors = swatches.map { it.argb },
                            selected = when (activeMakeupTool) {
                                MakeupToolId.EYELINER -> state.eyelinerColor
                                MakeupToolId.MASCARA -> state.mascaraColor
                                else -> selectedColors[activeMakeupTool] ?: 0
                            },
                            onPick = { argb ->
                                SoundSynthesizer.playTap()
                                onSelectColor(activeMakeupTool, argb)
                                if (activeMakeupTool == MakeupToolId.EYELINER) {
                                    onUpdateState(state.copy(eyelinerColor = argb, eyelinerStyle = if (state.eyelinerStyle == EyelinerStyleId.NONE) EyelinerStyleId.CLASSIC else state.eyelinerStyle, eyelinerCoverage = 1f))
                                } else if (activeMakeupTool == MakeupToolId.MASCARA) {
                                    onUpdateState(state.copy(mascaraColor = argb, mascaraStyle = if (state.mascaraStyle == MascaraStyleId.NATURAL) MascaraStyleId.CURLED else state.mascaraStyle, mascaraCoverage = 1f))
                                }
                            }
                        )
                    }
                }

                SalonCategory.EYES -> {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OptionChipButton(label = if (lang == Language.EN) "👁️ Eye Color" else "👁️ Màu Mắt", selected = eyeSub == 0, onClick = { eyeSub = 0 })
                        OptionChipButton(label = if (lang == Language.EN) "✨ Eyebrows" else "✨ Chân Mày", selected = eyeSub == 1, onClick = { eyeSub = 1 })
                    }
                    if (eyeSub == 0) {
                        Row(modifier = Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            BeautyCatalog.eyeLenses.forEach { lens ->
                                val sel = state.eyeColorId == lens.id
                                Column(
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(14.dp))
                                        .background(if (sel) Color(0xFFF3E8FF) else PinkSoft)
                                        .border(2.dp, if (sel) PurpleMain else Color.Transparent, RoundedCornerShape(14.dp))
                                        .clickable { SoundSynthesizer.playSparkle(); onUpdateState(state.copy(eyeColorId = lens.id)) }
                                        .padding(8.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(34.dp)
                                            .clip(CircleShape)
                                            .background(Brush.radialGradient(listOf(Color(lens.sparkle), Color(lens.inner), Color(lens.outer))))
                                            .border(2.dp, Color.White, CircleShape)
                                    )
                                    Spacer(Modifier.height(4.dp))
                                    Text(lens.name.text(lang), fontSize = 11.sp, fontWeight = FontWeight.Bold, color = InkDark)
                                }
                            }
                        }
                    } else {
                        Row(modifier = Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            EyebrowStyleId.entries.forEach { st ->
                                OptionChipButton(label = AppStrings.eyebrowName(st, lang), selected = state.eyebrowStyle == st, onClick = { SoundSynthesizer.playTap(); onUpdateState(state.copy(eyebrowStyle = st)) })
                            }
                        }
                        SwatchWrapRow(
                            colors = BeautyCatalog.eyebrowColors.map { it.argb },
                            selected = state.eyebrowColor,
                            onPick = { argb -> SoundSynthesizer.playTap(); onUpdateState(state.copy(eyebrowColor = argb)) }
                        )
                    }
                }

                SalonCategory.HAIR -> {
                    Row(modifier = Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        OptionChipButton(label = if (lang == Language.EN) "💇‍♀️ Styles" else "💇‍♀️ Kiểu Tóc", selected = hairSub == 0, onClick = { hairSub = 0 })
                        OptionChipButton(label = if (lang == Language.EN) "🌈 Colors" else "🌈 Màu Tóc", selected = hairSub == 1, onClick = { hairSub = 1 })
                        OptionChipButton(
                            label = if (lang == Language.EN) "✨ Streaks" else "✨ Highlight",
                            selected = state.hairHighlightEnabled,
                            onClick = { SoundSynthesizer.playSparkle(); onUpdateState(state.copy(hairHighlightEnabled = !state.hairHighlightEnabled)) }
                        )
                    }
                    if (hairSub == 0) {
                        TwoColOptionGrid(
                            items = HairstyleId.entries.map { it to AppStrings.hairStyleName(it, lang) },
                            selected = state.hairStyle,
                            onPick = { SoundSynthesizer.playMagicChime(); onUpdateState(state.copy(hairStyle = it)) }
                        )
                    } else {
                        SwatchWrapRow(
                            colors = BeautyCatalog.hairColors.map { it.primary },
                            selected = BeautyCatalog.hairColorById(state.hairColorId).primary,
                            onPick = { picked ->
                                val hc = BeautyCatalog.hairColors.firstOrNull { it.primary == picked } ?: return@SwatchWrapRow
                                SoundSynthesizer.playSparkle()
                                onUpdateState(state.copy(hairColorId = hc.id))
                            }
                        )
                    }
                }

                SalonCategory.DRESS -> {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OptionChipButton(label = if (lang == Language.EN) "👗 Outfits" else "👗 Trang Phục", selected = dressSub == 0, onClick = { dressSub = 0 })
                        OptionChipButton(label = if (lang == Language.EN) "🎨 Colors" else "🎨 Màu Váy", selected = dressSub == 1, onClick = { dressSub = 1 })
                    }
                    if (dressSub == 0) {
                        TwoColOptionGrid(
                            items = OutfitId.entries.map { it to AppStrings.outfitName(it, lang) },
                            selected = state.outfitId,
                            onPick = { SoundSynthesizer.playMagicChime(); onUpdateState(state.copy(outfitId = it)) }
                        )
                    } else {
                        SwatchWrapRow(
                            colors = BeautyCatalog.outfitColors.map { it.primary },
                            selected = BeautyCatalog.outfitColorById(state.outfitColorId).primary,
                            onPick = { picked ->
                                val oc = BeautyCatalog.outfitColors.firstOrNull { it.primary == picked } ?: return@SwatchWrapRow
                                SoundSynthesizer.playSparkle()
                                onUpdateState(state.copy(outfitColorId = oc.id))
                            }
                        )
                    }
                }

                SalonCategory.ACCESSORIES -> {
                    Row(modifier = Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        val labels = if (lang == Language.EN) listOf("👑 Headwear", "💎 Earrings", "📿 Necklace", "🕶️ Glasses", "🦋 Wings")
                        else listOf("👑 Vương Miện", "💎 Bông Tai", "📿 Dây Chuyền", "🕶️ Mắt Kính", "🦋 Đôi Cánh")
                        labels.forEachIndexed { idx, lbl ->
                            OptionChipButton(label = lbl, selected = accSub == idx, onClick = { SoundSynthesizer.playTap(); accSub = idx })
                        }
                    }
                    when (accSub) {
                        0 -> TwoColOptionGrid(HeadwearId.entries.map { it to AppStrings.headwearName(it, lang) }, state.headwearId) { SoundSynthesizer.playSparkle(); onUpdateState(state.copy(headwearId = it)) }
                        1 -> TwoColOptionGrid(EarringId.entries.map { it to AppStrings.earringName(it, lang) }, state.earringId) { SoundSynthesizer.playSparkle(); onUpdateState(state.copy(earringId = it)) }
                        2 -> TwoColOptionGrid(NecklaceId.entries.map { it to AppStrings.necklaceName(it, lang) }, state.necklaceId) { SoundSynthesizer.playSparkle(); onUpdateState(state.copy(necklaceId = it)) }
                        3 -> TwoColOptionGrid(GlassesId.entries.map { it to AppStrings.glassesName(it, lang) }, state.glassesId) { SoundSynthesizer.playSparkle(); onUpdateState(state.copy(glassesId = it)) }
                        else -> TwoColOptionGrid(WingsId.entries.map { it to AppStrings.wingsName(it, lang) }, state.wingsId) { SoundSynthesizer.playMagicChime(); onUpdateState(state.copy(wingsId = it)) }
                    }
                }

                SalonCategory.STICKERS -> {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            if (lang == Language.EN) "Tap face to place gems!" else "Chạm lên mặt để dán sticker!",
                            fontSize = 12.sp, fontWeight = FontWeight.Bold, color = InkMuted
                        )
                        Row(horizontalArrangement = Arrangement.spacedBy(5.dp)) {
                            SmallPillButton(text = "↩", onClick = {
                                if (state.stickers.isNotEmpty()) {
                                    SoundSynthesizer.playTap()
                                    onUpdateState(state.copy(stickers = state.stickers.dropLast(1)))
                                }
                            })
                            SmallPillButton(text = "🗑️", onClick = {
                                SoundSynthesizer.playBubblePop()
                                onUpdateState(state.copy(stickers = emptyList()))
                            })
                        }
                    }
                    TwoColOptionGrid(
                        items = StickerTypeId.entries.map { it to "✨ ${AppStrings.stickerName(it, lang)}" },
                        selected = activeSticker,
                        onPick = { SoundSynthesizer.playTap(); onSelectSticker(it) }
                    )
                }
            }
        }
    }
}

@Composable
private fun PhotoBoothPanel(
    lang: Language,
    state: MakeoverState,
    hasLatest: Boolean,
    justSaved: Boolean,
    onUpdateState: (MakeoverState) -> Unit,
    onSnapPhoto: () -> Unit,
    onShareLatest: () -> Unit,
    onOpenGallery: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(12.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text(if (lang == Language.EN) "Pose" else "Biểu Cảm", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = InkMuted)
        Row(modifier = Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            ExpressionId.entries.forEach { exp ->
                OptionChipButton(label = AppStrings.expressionName(exp, lang), selected = state.expression == exp, onClick = { SoundSynthesizer.playTap(); onUpdateState(state.copy(expression = exp)) })
            }
        }

        Text(if (lang == Language.EN) "Scene" else "Phông Nền", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = InkMuted)
        Row(modifier = Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            BackgroundId.entries.forEach { bg ->
                OptionChipButton(label = AppStrings.backgroundName(bg, lang), selected = state.backgroundId == bg, onClick = { SoundSynthesizer.playSparkle(); onUpdateState(state.copy(backgroundId = bg)) })
            }
        }

        Text(if (lang == Language.EN) "Frame" else "Khung Ảnh", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = InkMuted)
        Row(modifier = Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            FrameId.entries.forEach { fr ->
                OptionChipButton(label = AppStrings.frameName(fr, lang), selected = state.frameId == fr, onClick = { SoundSynthesizer.playTap(); onUpdateState(state.copy(frameId = fr)) })
            }
        }

        Button(
            onClick = onSnapPhoto,
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
            contentPadding = PaddingValues(),
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(Brush.horizontalGradient(listOf(Color(0xFFFF4D9E), PurpleMain)))
        ) {
            Icon(Icons.Default.PhotoCamera, contentDescription = null, tint = Color.White)
            Spacer(Modifier.width(8.dp))
            Text(AppStrings.takePhoto(lang), fontSize = 16.sp, fontWeight = FontWeight.ExtraBold, color = Color.White)
        }

        if (hasLatest) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                SmallPillButton(text = "📤 ${AppStrings.sharePhoto(lang)}", containerColor = PurpleMain, textColor = Color.White, onClick = onShareLatest)
                SmallPillButton(text = "🖼️ ${AppStrings.lookbook(lang)}", onClick = onOpenGallery)
            }
        }
        if (justSaved) {
            Text("✨ ${AppStrings.savedToast(lang)}", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color(0xFF15803D))
        }
    }
}

@Composable
fun GalleryScreen(
    lang: Language,
    photos: List<SavedPhotoItem>,
    onBack: () -> Unit,
    onShare: (SavedPhotoItem) -> Unit,
    onDelete: (SavedPhotoItem) -> Unit
) {
    val bgBrush = Brush.linearGradient(listOf(Color(0xFFFFE7F4), Color(0xFFF5E1FF), Color(0xFFE0F4FF)))
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(bgBrush)
            .statusBarsPadding()
            .navigationBarsPadding()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White.copy(alpha = 0.88f))
                .padding(horizontal = 12.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            SmallPillButton(text = "← ${AppStrings.backToSalon(lang)}", onClick = onBack)
            Text("✨ ${AppStrings.galleryTitle(lang)}", fontSize = 17.sp, fontWeight = FontWeight.ExtraBold, color = PinkMain)
            Spacer(Modifier.width(48.dp))
        }

        if (photos.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize().padding(28.dp), contentAlignment = Alignment.Center) {
                Surface(shape = RoundedCornerShape(24.dp), color = Color.White, border = BorderStroke(2.dp, Color(0xFFFBCFE8))) {
                    Column(modifier = Modifier.padding(28.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("📸", fontSize = 44.sp)
                        Spacer(Modifier.height(10.dp))
                        Text(AppStrings.galleryEmpty(lang), textAlign = TextAlign.Center, color = InkMuted, fontWeight = FontWeight.SemiBold)
                    }
                }
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                modifier = Modifier.fillMaxSize().padding(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(photos, key = { it.id }) { item ->
                    val bmp = remember(item.filePath) {
                        val f = File(item.filePath)
                        if (f.exists()) BitmapFactory.decodeFile(f.absolutePath)?.asImageBitmap() else null
                    }
                    Surface(shape = RoundedCornerShape(20.dp), color = Color.White, border = BorderStroke(2.dp, Color(0xFFFBCFE8))) {
                        Column(modifier = Modifier.padding(8.dp)) {
                            if (bmp != null) {
                                Image(
                                    bitmap = bmp,
                                    contentDescription = item.characterName,
                                    contentScale = ContentScale.Crop,
                                    modifier = Modifier.fillMaxWidth().aspectRatio(3f / 4f).clip(RoundedCornerShape(14.dp))
                                )
                            }
                            Spacer(Modifier.height(6.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(item.characterName, fontWeight = FontWeight.Bold, color = InkDark)
                                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                    SmallPillButton(text = "📤", containerColor = PinkMain, textColor = Color.White, onClick = { onShare(item) })
                                    SmallPillButton(text = "🗑️", onClick = { onDelete(item) })
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun SmallPillButton(
    text: String,
    containerColor: Color = Color.White,
    textColor: Color = InkDark,
    onClick: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(50),
        color = containerColor,
        border = BorderStroke(1.5.dp, if (containerColor == Color.White) Color(0xFFFBCFE8) else Color.Transparent),
        modifier = Modifier.clickable(onClick = onClick)
    ) {
        Text(
            text = text,
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = textColor,
            maxLines = 1
        )
    }
}

@Composable
private fun OptionChipButton(
    label: String,
    selected: Boolean,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(12.dp),
        color = if (selected) PinkMain else Color(0xFFFFF5FA),
        border = BorderStroke(1.5.dp, if (selected) PinkMain else Color(0xFFFBCFE8)),
        modifier = modifier.clickable(onClick = onClick)
    ) {
        Text(
            text = label,
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 7.dp),
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = if (selected) Color.White else InkDark,
            textAlign = TextAlign.Center,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}

@Composable
private fun HintBar(text: String) {
    Surface(shape = RoundedCornerShape(12.dp), color = Color(0xFFF0FDFA), border = BorderStroke(1.5.dp, Color(0xFF99F6E4))) {
        Text(text, modifier = Modifier.fillMaxWidth().padding(8.dp), fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFF0F766E))
    }
}

@Composable
private fun <T> TwoColOptionGrid(
    items: List<Pair<T, String>>,
    selected: T,
    onPick: (T) -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        items.chunked(2).forEach { pair ->
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                pair.forEach { (id, label) ->
                    OptionChipButton(
                        label = label,
                        selected = id == selected,
                        modifier = Modifier.weight(1f),
                        onClick = { onPick(id) }
                    )
                }
                if (pair.size == 1) Spacer(Modifier.weight(1f))
            }
        }
    }
}

@Composable
private fun SwatchWrapRow(
    colors: List<Int>,
    selected: Int,
    onPick: (Int) -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        colors.chunked(8).forEach { rowColors ->
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                rowColors.forEach { argb ->
                    val isSel = argb == selected
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(Color(argb))
                            .border(if (isSel) 3.dp else 2.dp, if (isSel) PinkMain else Color.White, CircleShape)
                            .clickable { onPick(argb) }
                    )
                }
            }
        }
    }
}
