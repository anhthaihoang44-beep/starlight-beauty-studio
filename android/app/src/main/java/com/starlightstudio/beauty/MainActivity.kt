package com.starlightstudio.beauty

import android.content.Intent
import android.graphics.Bitmap
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.*
import androidx.core.content.FileProvider
import com.starlightstudio.beauty.audio.SoundSynthesizer
import com.starlightstudio.beauty.model.*
import com.starlightstudio.beauty.renderer.CharacterRenderer
import com.starlightstudio.beauty.renderer.MakeupPaintBuffers
import com.starlightstudio.beauty.ui.GalleryScreen
import com.starlightstudio.beauty.ui.HomeScreen
import com.starlightstudio.beauty.ui.SalonAndPhotoScreen
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileOutputStream

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            MaterialTheme {
                StarlightAppRoot(
                    lookbookDir = File(filesDir, "lookbook").apply { mkdirs() },
                    onShareFile = { file -> sharePhotoFile(file) }
                )
            }
        }
    }

    private fun sharePhotoFile(file: File) {
        if (!file.exists()) return
        try {
            val uri = FileProvider.getUriForFile(this, "$packageName.fileprovider", file)
            val intent = Intent(Intent.ACTION_SEND).apply {
                type = "image/png"
                putExtra(Intent.EXTRA_STREAM, uri)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            startActivity(Intent.createChooser(intent, "Starlight Beauty Studio"))
        } catch (_: Throwable) {
            // Safe fallback if no share target installed
        }
    }
}

@Composable
private fun StarlightAppRoot(
    lookbookDir: File,
    onShareFile: (File) -> Unit
) {
    // Default language is English as requested; switchable to Vietnamese anytime
    var lang by remember { mutableStateOf(Language.EN) }
    var muted by remember { mutableStateOf(false) }
    var screen by remember { mutableStateOf(ScreenMode.HOME) }
    var previousScreen by remember { mutableStateOf(ScreenMode.HOME) }

    var selectedModelId by remember { mutableStateOf(BeautyCatalog.characters.first().id) }
    var makeover by remember { mutableStateOf(BeautyCatalog.initialMakeover(selectedModelId)) }
    val buffers = remember { MakeupPaintBuffers() }
    var paintTick by remember { mutableIntStateOf(0) }

    var photos by remember { mutableStateOf(loadSavedPhotos(lookbookDir)) }
    var lastCapturedPath by remember { mutableStateOf<String?>(null) }
    var justSaved by remember { mutableStateOf(false) }
    var flashActive by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    val toggleLang = {
        SoundSynthesizer.playTap()
        lang = if (lang == Language.EN) Language.VI else Language.EN
    }
    val toggleMute = {
        muted = !muted
        SoundSynthesizer.isMuted = muted
        if (!muted) SoundSynthesizer.playTap()
    }

    when (screen) {
        ScreenMode.HOME -> HomeScreen(
            lang = lang,
            muted = muted,
            selectedModelId = selectedModelId,
            photoCount = photos.size,
            onToggleLang = toggleLang,
            onToggleMute = toggleMute,
            onSelectModel = { selectedModelId = it },
            onStartMakeover = {
                SoundSynthesizer.playMagicChime()
                buffers.clearAll()
                makeover = BeautyCatalog.initialMakeover(selectedModelId)
                lastCapturedPath = null
                paintTick++
                screen = ScreenMode.SALON
            },
            onOpenGallery = {
                SoundSynthesizer.playTap()
                previousScreen = ScreenMode.HOME
                screen = ScreenMode.GALLERY
            }
        )

        ScreenMode.GALLERY -> GalleryScreen(
            lang = lang,
            photos = photos,
            onBack = {
                SoundSynthesizer.playTap()
                screen = previousScreen
            },
            onShare = { item -> onShareFile(File(item.filePath)) },
            onDelete = { item ->
                SoundSynthesizer.playTap()
                File(item.filePath).delete()
                photos = photos.filterNot { it.id == item.id }
            }
        )

        ScreenMode.SALON, ScreenMode.PHOTOBOOTH -> SalonAndPhotoScreen(
            lang = lang,
            muted = muted,
            isPhotoBooth = screen == ScreenMode.PHOTOBOOTH,
            state = makeover,
            buffers = buffers,
            paintTick = paintTick,
            lastCapturedFile = lastCapturedPath,
            justSaved = justSaved,
            flashActive = flashActive,
            onBack = {
                SoundSynthesizer.playTap()
                screen = if (screen == ScreenMode.PHOTOBOOTH) ScreenMode.SALON else ScreenMode.HOME
            },
            onToggleLang = toggleLang,
            onToggleMute = toggleMute,
            onGoPhotoBooth = {
                SoundSynthesizer.playMagicChime()
                screen = ScreenMode.PHOTOBOOTH
            },
            onOpenGallery = {
                SoundSynthesizer.playTap()
                previousScreen = ScreenMode.PHOTOBOOTH
                screen = ScreenMode.GALLERY
            },
            onUpdateState = { makeover = it },
            onBumpPaint = { paintTick++ },
            onSurprise = {
                SoundSynthesizer.playMagicChime()
                val lip = BeautyCatalog.lipstickSwatches.random().argb
                val shadow = BeautyCatalog.eyeshadowSwatches.random().argb
                val blush = BeautyCatalog.blushSwatches.random().argb
                buffers.applySurprise(lip, shadow, blush)
                makeover = makeover.copy(
                    spaGlow = true,
                    hasLipPaint = true,
                    hasEyeshadowPaint = true,
                    hasBlushPaint = true,
                    eyeColorId = BeautyCatalog.eyeLenses.random().id,
                    eyelinerStyle = EyelinerStyleId.entries.filter { it != EyelinerStyleId.NONE }.random(),
                    eyelinerCoverage = 1f,
                    mascaraStyle = MascaraStyleId.entries.filter { it != MascaraStyleId.NATURAL }.random(),
                    mascaraCoverage = 1f,
                    lipFinish = LipFinish.entries.random(),
                    eyeshadowFinish = EyeshadowFinish.SHIMMER,
                    hairStyle = HairstyleId.entries.random(),
                    hairColorId = BeautyCatalog.hairColors.random().id,
                    hairHighlightEnabled = listOf(true, false).random(),
                    outfitId = OutfitId.entries.random(),
                    outfitColorId = BeautyCatalog.outfitColors.random().id,
                    headwearId = HeadwearId.entries.random(),
                    earringId = EarringId.entries.random(),
                    necklaceId = NecklaceId.entries.random(),
                    glassesId = if (Math.random() > 0.65) GlassesId.entries.random() else GlassesId.NONE,
                    wingsId = if (Math.random() > 0.45) WingsId.entries.random() else WingsId.NONE
                )
                paintTick++
            },
            onResetFace = {
                SoundSynthesizer.playBubblePop()
                buffers.clearAll()
                makeover = makeover.copy(
                    spaGlow = false,
                    hasLipPaint = false,
                    hasEyeshadowPaint = false,
                    hasBlushPaint = false,
                    eyelinerStyle = EyelinerStyleId.NONE,
                    eyelinerCoverage = 0f,
                    mascaraStyle = MascaraStyleId.NATURAL,
                    mascaraCoverage = 0f,
                    stickers = emptyList()
                )
                paintTick++
            },
            onSnapPhoto = {
                SoundSynthesizer.playCameraShutter()
                val charName = BeautyCatalog.characterById(makeover.characterId).name
                val bmp = CharacterRenderer.renderHighResPhoto(makeover, buffers)
                val ts = System.currentTimeMillis()
                val file = File(lookbookDir, "${charName}_${ts}.png")
                FileOutputStream(file).use { out ->
                    bmp.compress(Bitmap.CompressFormat.PNG, 100, out)
                }
                bmp.recycle()
                val saved = SavedPhotoItem(file.name, file.absolutePath, charName, ts)
                photos = listOf(saved) + photos
                lastCapturedPath = file.absolutePath
                scope.launch {
                    flashActive = true
                    delay(220L)
                    flashActive = false
                    justSaved = true
                    delay(2200L)
                    justSaved = false
                }
            },
            onShareLatest = {
                lastCapturedPath?.let { onShareFile(File(it)) }
            }
        )
    }
}

private fun loadSavedPhotos(dir: File): List<SavedPhotoItem> {
    val files = dir.listFiles { f -> f.extension.equals("png", ignoreCase = true) } ?: return emptyList()
    return files.sortedByDescending { it.lastModified() }.map { f ->
        val name = f.nameWithoutExtension.substringBefore('_').ifBlank { "Star" }
        SavedPhotoItem(f.name, f.absolutePath, name, f.lastModified())
    }
}
