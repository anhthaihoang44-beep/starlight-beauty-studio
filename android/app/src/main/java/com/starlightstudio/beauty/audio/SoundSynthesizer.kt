package com.starlightstudio.beauty.audio

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import java.util.concurrent.Executors
import kotlin.math.PI
import kotlin.math.exp
import kotlin.math.sin

// 100% Native Kotlin PCM sound synthesizer — offline, zero external audio assets
object SoundSynthesizer {
    private const val SAMPLE_RATE = 22050
    private val executor = Executors.newSingleThreadExecutor()

    @Volatile
    var isMuted: Boolean = false

    @Volatile
    private var lastBrushMs: Long = 0L

    fun playTap() {
        if (isMuted) return
        playTones(listOf(ToneSpec(660.0, 920.0, 55, 0.22)))
    }

    fun playSparkle() {
        if (isMuted) return
        playTones(
            listOf(
                ToneSpec(880.0, 920.0, 65, 0.18),
                ToneSpec(1175.0, 1220.0, 65, 0.16),
                ToneSpec(1568.0, 1760.0, 110, 0.16)
            )
        )
    }

    fun playMagicChime() {
        if (isMuted) return
        playTones(
            listOf(
                ToneSpec(523.25, 523.25, 70, 0.18),
                ToneSpec(659.25, 659.25, 70, 0.18),
                ToneSpec(783.99, 783.99, 70, 0.18),
                ToneSpec(1046.5, 1174.6, 150, 0.20)
            )
        )
    }

    fun playBrush(glitter: Boolean = false) {
        if (isMuted) return
        val now = System.currentTimeMillis()
        if (now - lastBrushMs < 115L) return
        lastBrushMs = now
        val base = if (glitter) 1320.0 else 420.0
        playTones(listOf(ToneSpec(base, base * 1.18, 45, 0.10)))
    }

    fun playBubblePop() {
        if (isMuted) return
        val now = System.currentTimeMillis()
        if (now - lastBrushMs < 95L) return
        lastBrushMs = now
        playTones(listOf(ToneSpec(480.0, 1080.0, 55, 0.16)))
    }

    fun playCameraShutter() {
        if (isMuted) return
        playTones(
            listOf(
                ToneSpec(1800.0, 320.0, 40, 0.24),
                ToneSpec(659.25, 659.25, 60, 0.16),
                ToneSpec(1046.5, 1318.5, 150, 0.20)
            )
        )
    }

    private data class ToneSpec(
        val startFreq: Double,
        val endFreq: Double,
        val durationMs: Int,
        val volume: Double
    )

    private fun playTones(tones: List<ToneSpec>) {
        executor.execute {
            try {
                val totalSamples = tones.sumOf { (SAMPLE_RATE * it.durationMs) / 1000 }
                if (totalSamples <= 0) return@execute
                val buffer = ShortArray(totalSamples)
                var offset = 0
                for (tone in tones) {
                    val count = (SAMPLE_RATE * tone.durationMs) / 1000
                    var phase = 0.0
                    for (i in 0 until count) {
                        val t = i.toDouble() / count.coerceAtLeast(1)
                        val freq = tone.startFreq + (tone.endFreq - tone.startFreq) * t
                        val env = sin(PI * t) * exp(-t * 1.4)
                        phase += 2.0 * PI * freq / SAMPLE_RATE
                        val sample = sin(phase) * env * tone.volume * Short.MAX_VALUE
                        if (offset + i < buffer.size) {
                            buffer[offset + i] = sample.toInt().coerceIn(Short.MIN_VALUE.toInt(), Short.MAX_VALUE.toInt()).toShort()
                        }
                    }
                    offset += count
                }

                val minBuf = AudioTrack.getMinBufferSize(
                    SAMPLE_RATE,
                    AudioFormat.CHANNEL_OUT_MONO,
                    AudioFormat.ENCODING_PCM_16BIT
                ).coerceAtLeast(buffer.size * 2)

                val track = AudioTrack.Builder()
                    .setAudioAttributes(
                        AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_GAME)
                            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                            .build()
                    )
                    .setAudioFormat(
                        AudioFormat.Builder()
                            .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                            .setSampleRate(SAMPLE_RATE)
                            .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                            .build()
                    )
                    .setBufferSizeInBytes(minBuf)
                    .setTransferMode(AudioTrack.MODE_STATIC)
                    .build()

                track.write(buffer, 0, buffer.size)
                track.play()
                val sleepMs = (totalSamples * 1000L / SAMPLE_RATE) + 30L
                Thread.sleep(sleepMs)
                track.stop()
                track.release()
            } catch (_: Throwable) {
                // Ignore audio output errors on emulators or locked audio devices
            }
        }
    }
}
