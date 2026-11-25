import AVFoundation
import Foundation

// 100% Native Swift AVAudioEngine PCM sound synthesizer — offline, zero external audio assets
public final class SoundSynthesizer {
    public static let shared = SoundSynthesizer()

    public var isMuted: Bool = false
    private let engine = AVAudioEngine()
    private let player = AVAudioPlayerNode()
    private let sampleRate: Double = 22050
    private var lastBrushTime: TimeInterval = 0
    private var isSetup = false

    private init() {
        setupIfNeeded()
    }

    private func setupIfNeeded() {
        guard !isSetup else { return }
        let format = AVAudioFormat(standardFormatWithSampleRate: sampleRate, channels: 1)!
        engine.attach(player)
        engine.connect(player, to: engine.mainMixerNode, format: format)
        do {
            try AVAudioSession.sharedInstance().setCategory(.ambient, options: [.mixWithOthers])
            try AVAudioSession.sharedInstance().setActive(true)
            try engine.start()
            isSetup = true
        } catch {
            isSetup = false
        }
    }

    public func playTap() {
        playTones([(660, 920, 0.055, 0.22)])
    }

    public func playSparkle() {
        playTones([
            (880, 920, 0.065, 0.18),
            (1175, 1220, 0.065, 0.16),
            (1568, 1760, 0.11, 0.16)
        ])
    }

    public func playMagicChime() {
        playTones([
            (523.25, 523.25, 0.07, 0.18),
            (659.25, 659.25, 0.07, 0.18),
            (783.99, 783.99, 0.07, 0.18),
            (1046.5, 1174.6, 0.15, 0.20)
        ])
    }

    public func playBrush(glitter: Bool = false) {
        let now = Date().timeIntervalSince1970
        guard now - lastBrushTime >= 0.11 else { return }
        lastBrushTime = now
        let base: Double = glitter ? 1320 : 420
        playTones([(base, base * 1.18, 0.045, 0.10)])
    }

    public func playBubblePop() {
        let now = Date().timeIntervalSince1970
        guard now - lastBrushTime >= 0.095 else { return }
        lastBrushTime = now
        playTones([(480, 1080, 0.055, 0.16)])
    }

    public func playCameraShutter() {
        playTones([
            (1800, 320, 0.04, 0.24),
            (659.25, 659.25, 0.06, 0.16),
            (1046.5, 1318.5, 0.15, 0.20)
        ])
    }

    private func playTones(_ tones: [(Double, Double, Double, Double)]) {
        guard !isMuted else { return }
        setupIfNeeded()
        guard isSetup else { return }

        let totalFrames = tones.reduce(0) { $0 + Int(sampleRate * $1.2) }
        guard totalFrames > 0,
              let format = AVAudioFormat(standardFormatWithSampleRate: sampleRate, channels: 1),
              let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: AVAudioFrameCount(totalFrames)),
              let samples = buffer.floatChannelData?[0] else { return }

        buffer.frameLength = AVAudioFrameCount(totalFrames)
        var offset = 0
        for (startF, endF, dur, vol) in tones {
            let count = Int(sampleRate * dur)
            var phase: Double = 0
            for i in 0..<count {
                let t = Double(i) / Double(max(1, count))
                let freq = startF + (endF - startF) * t
                let env = sin(Double.pi * t) * exp(-t * 1.4)
                phase += 2.0 * Double.pi * freq / sampleRate
                samples[offset + i] = Float(sin(phase) * env * vol)
            }
            offset += count
        }

        if !engine.isRunning {
            try? engine.start()
        }
        player.scheduleBuffer(buffer, at: nil, options: [], completionHandler: nil)
        if !player.isPlaying {
            player.play()
        }
    }
}
