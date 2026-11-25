import SwiftUI
import UIKit

public struct SalonAndPhotoView: View {
    @Binding public var lang: AppLanguage
    @Binding public var muted: Bool
    @Binding public var state: MakeoverState
    public let isPhotoBooth: Bool
    public let latestPhotoUrl: URL?
    public let justSaved: Bool
    public let flashActive: Bool
    public let onBack: () -> Void
    public let onGoPhotoBooth: () -> Void
    public let onOpenGallery: () -> Void
    public let onSurprise: () -> Void
    public let onResetFace: () -> Void
    public let onSnapPhoto: () -> Void

    @State private var activeCategory: SalonCategory = .makeup
    @State private var activeMakeupTool: MakeupToolId = .lipstick
    @State private var activeSpaTool: SpaToolId = .cleanser
    @State private var activeSticker: StickerTypeId = .starGem
    @State private var selectedColors: [MakeupToolId: UInt32] = [
        .lipstick: BeautyCatalog.lipstickSwatches[0].hex,
        .eyeshadow: BeautyCatalog.eyeshadowSwatches[0].hex,
        .blush: BeautyCatalog.blushSwatches[0].hex,
        .highlighter: BeautyCatalog.highlighterSwatches[0].hex,
        .eyeliner: 0x1E1B2E,
        .mascara: 0x1E1B2E,
        .remover: 0xFFFFFF
    ]
    @State private var cursorPoint: CGPoint? = nil
    @State private var isBlinking: Bool = false

    @State private var eyeSub = 0
    @State private var hairSub = 0
    @State private var dressSub = 0
    @State private var accSub = 0

    public var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(hex: 0xFFE7F4), Color(hex: 0xF5E1FF), Color(hex: 0xE0F4FF)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            VStack(spacing: 8) {
                // Top Bar
                HStack(spacing: 6) {
                    Button("← \(isPhotoBooth ? AppStrings.back(lang) : AppStrings.models(lang))") {
                        SoundSynthesizer.shared.playTap()
                        onBack()
                    }
                    .buttonStyle(PastelPillStyle())

                    Spacer()

                    if !isPhotoBooth {
                        Button("✨ \(AppStrings.surprise(lang))") {
                            SoundSynthesizer.shared.playMagicChime()
                            onSurprise()
                        }
                        .buttonStyle(PastelPillStyle(bg: Color(hex: 0xFDE047), fg: Color(hex: 0x5C1D0C)))

                        Button {
                            SoundSynthesizer.shared.playBubblePop()
                            onResetFace()
                        } label: {
                            Image(systemName: "arrow.counterclockwise")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(Color(hex: 0x3B1C4A))
                                .frame(width: 32, height: 32)
                                .background(Color.white)
                                .clipShape(Circle())
                        }
                    }

                    Button(lang.rawValue) {
                        SoundSynthesizer.shared.playTap()
                        lang = (lang == .en) ? .vi : .en
                    }
                    .buttonStyle(PastelPillStyle())

                    Button {
                        muted.toggle()
                        SoundSynthesizer.shared.isMuted = muted
                        if !muted { SoundSynthesizer.shared.playTap() }
                    } label: {
                        Image(systemName: muted ? "speaker.slash.fill" : "speaker.wave.2.fill")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(Color(hex: 0x3B1C4A))
                            .frame(width: 32, height: 32)
                            .background(Color.white)
                            .clipShape(Circle())
                    }

                    if !isPhotoBooth {
                        Button("📷 \(AppStrings.photo(lang))") {
                            SoundSynthesizer.shared.playMagicChime()
                            onGoPhotoBooth()
                        }
                        .buttonStyle(PastelPillStyle(bg: Color(hex: 0xEC4899), fg: .white))
                    }
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(Color.white.opacity(0.86))

                // Interactive Stage
                GeometryReader { geo in
                    let stageW = min(geo.size.width - 24, (geo.size.height - 8) * 0.75)
                    let stageH = stageW / 0.75

                    ZStack {
                        CharacterStageCanvasView(
                            state: state,
                            isBlinking: isBlinking,
                            showFrame: isPhotoBooth,
                            cursorPoint: cursorPoint,
                            activeCategory: isPhotoBooth ? nil : activeCategory,
                            activeMakeupTool: activeMakeupTool,
                            activeSpaTool: activeSpaTool,
                            activeToolColor: selectedColors[activeMakeupTool] ?? 0xFF69B4
                        )
                        .frame(width: stageW, height: stageH)
                        .clipShape(RoundedRectangle(cornerRadius: 24))
                        .overlay(RoundedRectangle(cornerRadius: 24).stroke(Color.white, lineWidth: 4))
                        .shadow(color: Color(hex: 0xA855F7, opacity: 0.2), radius: 12, y: 6)
                        .gesture(
                            DragGesture(minimumDistance: 0)
                                .onChanged { value in
                                    guard !isPhotoBooth else { return }
                                    let sx = (value.location.x / max(1, stageW)) * StageGeometry.width
                                    let sy = ((value.location.y - 20) / max(1, stageH)) * StageGeometry.height
                                    let pt = CGPoint(x: sx, y: sy)
                                    if activeCategory == .stickers {
                                        if value.translation == .zero {
                                            placeSticker(at: CGPoint(x: sx, y: (value.location.y / max(1, stageH)) * StageGeometry.height))
                                        }
                                    } else {
                                        cursorPoint = pt
                                        applyPaint(at: pt)
                                    }
                                }
                                .onEnded { _ in
                                    cursorPoint = nil
                                }
                        )

                        if flashActive {
                            RoundedRectangle(cornerRadius: 24)
                                .fill(Color.white.opacity(0.9))
                                .frame(width: stageW, height: stageH)
                        }
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                }

                // Controls Panel
                VStack(spacing: 0) {
                    if isPhotoBooth {
                        photoBoothSheet
                    } else {
                        salonControlSheet
                    }
                }
                .frame(height: 285)
                .background(Color.white.opacity(0.94))
                .clipShape(RoundedRectangle(cornerRadius: 24))
                .overlay(RoundedRectangle(cornerRadius: 24).stroke(Color.white, lineWidth: 2))
                .padding(.horizontal, 8)
                .padding(.bottom, 6)
            }
        }
        .task {
            while !Task.isCancelled {
                try? await Task.sleep(nanoseconds: UInt64.random(in: 2_800_000_000...5_200_000_000))
                isBlinking = true
                try? await Task.sleep(nanoseconds: 150_000_000)
                isBlinking = false
            }
        }
    }

    private func placeSticker(at pt: CGPoint) {
        let next = PlacedSticker(type: activeSticker, x: pt.x, y: pt.y, scale: CGFloat.random(in: 0.9...1.15), rotation: Double.random(in: -12...12))
        state.stickers = Array(state.stickers.suffix(24)) + [next]
        SoundSynthesizer.shared.playSparkle()
    }

    private func applyPaint(at pt: CGPoint) {
        let hex = selectedColors[activeMakeupTool] ?? 0xFF69B4
        if activeCategory == .spa {
            switch activeSpaTool {
            case .cleanser:
                if StageGeometry.isNearFace(pt) {
                    state.spaBubbleDabs = Array(state.spaBubbleDabs.suffix(120)) + [PaintDab(x: pt.x, y: pt.y, radius: CGFloat.random(in: 10...18), hex: 0xFFFFFF, alpha: 0.72, glitter: false)]
                    SoundSynthesizer.shared.playBubblePop()
                }
            case .mask:
                if StageGeometry.isNearFace(pt) {
                    state.spaMaskDabs = Array(state.spaMaskDabs.suffix(120)) + [PaintDab(x: pt.x, y: pt.y, radius: 34, hex: 0xA7F3D0, alpha: 0.42, glitter: false)]
                    SoundSynthesizer.shared.playBrush()
                }
            case .rinse:
                state.spaBubbleDabs.removeAll { hypot($0.x - pt.x, $0.y - pt.y) < 42 }
                state.spaMaskDabs.removeAll { hypot($0.x - pt.x, $0.y - pt.y) < 42 }
                SoundSynthesizer.shared.playBubblePop()
            case .primer:
                if StageGeometry.isNearFace(pt) {
                    state.spaGlow = true
                    SoundSynthesizer.shared.playBrush(glitter: true)
                }
            }
            return
        }

        guard activeCategory == .makeup else { return }
        switch activeMakeupTool {
        case .lipstick:
            if StageGeometry.isNearLips(pt) {
                state.lipDabs = Array(state.lipDabs.suffix(160)) + [PaintDab(x: pt.x, y: pt.y, radius: 22, hex: hex, alpha: 0.52, glitter: state.lipFinish == .glitter)]
                SoundSynthesizer.shared.playBrush(glitter: state.lipFinish == .glitter)
            }
        case .eyeshadow:
            if StageGeometry.isNearEyes(pt) {
                state.eyeshadowDabs = Array(state.eyeshadowDabs.suffix(160)) + [PaintDab(x: pt.x, y: pt.y, radius: 26, hex: hex, alpha: 0.36, glitter: state.eyeshadowFinish == .shimmer)]
                SoundSynthesizer.shared.playBrush(glitter: state.eyeshadowFinish == .shimmer)
            }
        case .blush, .highlighter:
            if StageGeometry.isNearCheeks(pt) {
                let isHl = activeMakeupTool == .highlighter
                state.skinDabs = Array(state.skinDabs.suffix(160)) + [PaintDab(x: pt.x, y: pt.y, radius: isHl ? 24 : 36, hex: hex, alpha: isHl ? 0.25 : 0.2, glitter: isHl)]
                SoundSynthesizer.shared.playBrush(glitter: isHl)
            }
        case .eyeliner:
            if StageGeometry.isNearEyes(pt) {
                if state.eyelinerStyle == .none { state.eyelinerStyle = .classic }
                state.eyelinerCoverage = min(1, state.eyelinerCoverage + 0.14)
                SoundSynthesizer.shared.playBrush(glitter: true)
            }
        case .mascara:
            if StageGeometry.isNearEyes(pt) {
                if state.mascaraStyle == .natural { state.mascaraStyle = .curled }
                state.mascaraCoverage = min(1, state.mascaraCoverage + 0.14)
                SoundSynthesizer.shared.playBrush()
            }
        case .remover:
            state.lipDabs.removeAll { hypot($0.x - pt.x, $0.y - pt.y) < 30 }
            state.eyeshadowDabs.removeAll { hypot($0.x - pt.x, $0.y - pt.y) < 32 }
            state.skinDabs.removeAll { hypot($0.x - pt.x, $0.y - pt.y) < 36 }
            state.spaBubbleDabs.removeAll { hypot($0.x - pt.x, $0.y - pt.y) < 36 }
            state.spaMaskDabs.removeAll { hypot($0.x - pt.x, $0.y - pt.y) < 36 }
            SoundSynthesizer.shared.playBubblePop()
        }
    }

    private func magicFillCurrent() {
        let hex = selectedColors[activeMakeupTool] ?? 0xFF69B4
        switch activeMakeupTool {
        case .lipstick:
            state.lipDabs = stride(from: -26, through: 26, by: 10).map {
                PaintDab(x: StageGeometry.lipsX + CGFloat($0), y: StageGeometry.lipsY, radius: 24, hex: hex, alpha: 0.85, glitter: state.lipFinish == .glitter)
            }
        case .eyeshadow:
            var list: [PaintDab] = []
            for ex in [StageGeometry.leftEyeX, StageGeometry.rightEyeX] {
                for dx in stride(from: -26, through: 26, by: 13) {
                    list.append(PaintDab(x: ex + CGFloat(dx), y: StageGeometry.eyeY - 22, radius: 28, hex: hex, alpha: 0.45, glitter: state.eyeshadowFinish == .shimmer))
                }
            }
            state.eyeshadowDabs = list
        case .blush:
            state.skinDabs.append(PaintDab(x: StageGeometry.leftCheekX, y: StageGeometry.cheekY, radius: 44, hex: hex, alpha: 0.5, glitter: false))
            state.skinDabs.append(PaintDab(x: StageGeometry.rightCheekX, y: StageGeometry.cheekY, radius: 44, hex: hex, alpha: 0.5, glitter: false))
        case .highlighter:
            state.skinDabs.append(PaintDab(x: StageGeometry.leftCheekX - 8, y: StageGeometry.cheekY - 12, radius: 26, hex: hex, alpha: 0.5, glitter: true))
            state.skinDabs.append(PaintDab(x: StageGeometry.rightCheekX + 8, y: StageGeometry.cheekY - 12, radius: 26, hex: hex, alpha: 0.5, glitter: true))
            state.skinDabs.append(PaintDab(x: StageGeometry.noseX, y: StageGeometry.noseY, radius: 16, hex: hex, alpha: 0.55, glitter: true))
        case .eyeliner:
            if state.eyelinerStyle == .none { state.eyelinerStyle = .classic }
            state.eyelinerCoverage = 1
        case .mascara:
            if state.mascaraStyle == .natural { state.mascaraStyle = .curled }
            state.mascaraCoverage = 1
        case .remover:
            break
        }
        SoundSynthesizer.shared.playSparkle()
    }

    private var salonControlSheet: some View {
        VStack(spacing: 0) {
            // Category ribbon
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 6) {
                    ForEach(SalonCategory.allCases) { cat in
                        let sel = cat == activeCategory
                        Button(AppStrings.categoryLabel(cat, lang)) {
                            SoundSynthesizer.shared.playTap()
                            activeCategory = cat
                        }
                        .buttonStyle(PastelPillStyle(bg: sel ? Color(hex: 0xEC4899) : Color(hex: 0xFFF5FA), fg: sel ? .white : Color(hex: 0x3B1C4A)))
                    }
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 8)
            }
            .background(Color(hex: 0xFFF5FA))

            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 8) {
                    switch activeCategory {
                    case .spa:
                        HStack(spacing: 8) {
                            ForEach(SpaToolId.allCases) { tool in
                                Button(AppStrings.spaToolLabel(tool, lang)) {
                                    SoundSynthesizer.shared.playTap()
                                    activeSpaTool = tool
                                }
                                .buttonStyle(PastelPillStyle(bg: activeSpaTool == tool ? Color(hex: 0x14B8A6) : .white, fg: activeSpaTool == tool ? .white : Color(hex: 0x3B1C4A)))
                            }
                        }
                        HStack {
                            Button("💧 Clear Spa") {
                                state.spaBubbleDabs.removeAll()
                                state.spaMaskDabs.removeAll()
                            }
                            .buttonStyle(PastelPillStyle())
                            Button("✨ Glow: \(state.spaGlow ? "ON" : "OFF")") {
                                state.spaGlow.toggle()
                                SoundSynthesizer.shared.playSparkle()
                            }
                            .buttonStyle(PastelPillStyle(bg: state.spaGlow ? Color(hex: 0xA855F7) : .white, fg: state.spaGlow ? .white : Color(hex: 0x3B1C4A)))
                        }

                    case .makeup:
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 6) {
                                ForEach(MakeupToolId.allCases) { tool in
                                    Button(AppStrings.makeupToolLabel(tool, lang)) {
                                        SoundSynthesizer.shared.playTap()
                                        activeMakeupTool = tool
                                    }
                                    .buttonStyle(PastelPillStyle(bg: activeMakeupTool == tool ? Color(hex: 0xA855F7) : Color(hex: 0xFFF2F8), fg: activeMakeupTool == tool ? .white : Color(hex: 0x3B1C4A)))
                                }
                            }
                        }

                        HStack {
                            Text(AppStrings.makeupHint(activeMakeupTool, lang))
                                .font(.system(size: 12, weight: .semibold, design: .rounded))
                                .foregroundColor(Color(hex: 0x6B4C7A))
                            Spacer()
                            if activeMakeupTool != .remover {
                                Button("🪄 \(AppStrings.magicFill(lang))") { magicFillCurrent() }
                                    .buttonStyle(PastelPillStyle(bg: Color(hex: 0xEC4899), fg: .white))
                            }
                        }

                        if activeMakeupTool != .remover {
                            let swatches: [ColorSwatch] = {
                                switch activeMakeupTool {
                                case .lipstick: return BeautyCatalog.lipstickSwatches
                                case .eyeshadow: return BeautyCatalog.eyeshadowSwatches
                                case .blush: return BeautyCatalog.blushSwatches
                                case .highlighter: return BeautyCatalog.highlighterSwatches
                                case .eyeliner: return BeautyCatalog.eyelinerColors
                                case .mascara: return BeautyCatalog.mascaraColors
                                case .remover: return []
                                }
                            }()
                            LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: 8), spacing: 8) {
                                ForEach(swatches) { sw in
                                    let isSel = selectedColors[activeMakeupTool] == sw.hex
                                    Circle()
                                        .fill(Color(hex: sw.hex))
                                        .frame(width: 34, height: 34)
                                        .overlay(Circle().stroke(isSel ? Color(hex: 0xEC4899) : .white, lineWidth: isSel ? 3 : 2))
                                        .onTapGesture {
                                            SoundSynthesizer.shared.playTap()
                                            selectedColors[activeMakeupTool] = sw.hex
                                            if activeMakeupTool == .eyeliner {
                                                state.eyelinerColor = sw.hex
                                                if state.eyelinerStyle == .none { state.eyelinerStyle = .classic }
                                                state.eyelinerCoverage = 1
                                            } else if activeMakeupTool == .mascara {
                                                state.mascaraColor = sw.hex
                                                if state.mascaraStyle == .natural { state.mascaraStyle = .curled }
                                                state.mascaraCoverage = 1
                                            }
                                        }
                                }
                            }
                        }

                    case .eyes:
                        HStack {
                            Button("👁️ Lenses") { eyeSub = 0 }.buttonStyle(PastelPillStyle(bg: eyeSub == 0 ? Color(hex: 0xA855F7) : .white, fg: eyeSub == 0 ? .white : Color(hex: 0x3B1C4A)))
                            Button("✨ Brows") { eyeSub = 1 }.buttonStyle(PastelPillStyle(bg: eyeSub == 1 ? Color(hex: 0xA855F7) : .white, fg: eyeSub == 1 ? .white : Color(hex: 0x3B1C4A)))
                        }
                        if eyeSub == 0 {
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 8) {
                                    ForEach(BeautyCatalog.eyeLenses) { lens in
                                        VStack(spacing: 4) {
                                            Circle()
                                                .fill(RadialGradient(colors: [Color(hex: lens.sparkle), Color(hex: lens.inner), Color(hex: lens.outer)], center: .center, startRadius: 1, endRadius: 18))
                                                .frame(width: 34, height: 34)
                                                .overlay(Circle().stroke(state.eyeColorId == lens.id ? Color(hex: 0xA855F7) : .white, lineWidth: 2.5))
                                            Text(lens.name.text(lang)).font(.system(size: 10, weight: .bold))
                                        }
                                        .onTapGesture { SoundSynthesizer.shared.playSparkle(); state.eyeColorId = lens.id }
                                    }
                                }
                            }
                        } else {
                            HStack {
                                ForEach(BeautyCatalog.eyebrowColors) { sw in
                                    Circle().fill(Color(hex: sw.hex)).frame(width: 32, height: 32)
                                        .onTapGesture { state.eyebrowColor = sw.hex }
                                }
                            }
                        }

                    case .hair:
                        HStack {
                            Button("Styles") { hairSub = 0 }.buttonStyle(PastelPillStyle(bg: hairSub == 0 ? Color(hex: 0xA855F7) : .white, fg: hairSub == 0 ? .white : Color(hex: 0x3B1C4A)))
                            Button("Colors") { hairSub = 1 }.buttonStyle(PastelPillStyle(bg: hairSub == 1 ? Color(hex: 0xA855F7) : .white, fg: hairSub == 1 ? .white : Color(hex: 0x3B1C4A)))
                            Button("✨ Streaks") { state.hairHighlightEnabled.toggle(); SoundSynthesizer.shared.playSparkle() }
                                .buttonStyle(PastelPillStyle(bg: state.hairHighlightEnabled ? Color(hex: 0xF59E0B) : .white, fg: state.hairHighlightEnabled ? .white : Color(hex: 0x3B1C4A)))
                        }
                        if hairSub == 0 {
                            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 6) {
                                ForEach(HairstyleId.allCases) { hs in
                                    Button(AppStrings.hairStyleName(hs, lang)) {
                                        SoundSynthesizer.shared.playMagicChime()
                                        state.hairStyle = hs
                                    }
                                    .buttonStyle(PastelPillStyle(bg: state.hairStyle == hs ? Color(hex: 0xEC4899) : Color(hex: 0xFFF5FA), fg: state.hairStyle == hs ? .white : Color(hex: 0x3B1C4A)))
                                }
                            }
                        } else {
                            LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: 7), spacing: 8) {
                                ForEach(BeautyCatalog.hairColors) { hc in
                                    Circle().fill(Color(hex: hc.primary)).frame(width: 34, height: 34)
                                        .overlay(Circle().stroke(state.hairColorId == hc.id ? Color(hex: 0xEC4899) : .white, lineWidth: 2.5))
                                        .onTapGesture { SoundSynthesizer.shared.playSparkle(); state.hairColorId = hc.id }
                                }
                            }
                        }

                    case .dress:
                        HStack {
                            Button("Outfits") { dressSub = 0 }.buttonStyle(PastelPillStyle(bg: dressSub == 0 ? Color(hex: 0xA855F7) : .white, fg: dressSub == 0 ? .white : Color(hex: 0x3B1C4A)))
                            Button("Colors") { dressSub = 1 }.buttonStyle(PastelPillStyle(bg: dressSub == 1 ? Color(hex: 0xA855F7) : .white, fg: dressSub == 1 ? .white : Color(hex: 0x3B1C4A)))
                        }
                        if dressSub == 0 {
                            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 6) {
                                ForEach(OutfitId.allCases) { o in
                                    Button(AppStrings.outfitName(o, lang)) { SoundSynthesizer.shared.playMagicChime(); state.outfitId = o }
                                        .buttonStyle(PastelPillStyle(bg: state.outfitId == o ? Color(hex: 0xEC4899) : Color(hex: 0xFFF5FA), fg: state.outfitId == o ? .white : Color(hex: 0x3B1C4A)))
                                }
                            }
                        } else {
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 8) {
                                    ForEach(BeautyCatalog.outfitColors) { oc in
                                        Circle().fill(Color(hex: oc.primary)).frame(width: 34, height: 34)
                                            .overlay(Circle().stroke(state.outfitColorId == oc.id ? Color(hex: 0xEC4899) : .white, lineWidth: 2.5))
                                            .onTapGesture { SoundSynthesizer.shared.playSparkle(); state.outfitColorId = oc.id }
                                    }
                                }
                                .padding(.vertical, 2)
                            }
                        }

                    case .accessories:
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 6) {
                                ForEach(Array(["👑", "💎", "📿", "🕶️", "🦋"].enumerated()), id: \.offset) { idx, em in
                                    Button(em) { accSub = idx }
                                        .buttonStyle(PastelPillStyle(bg: accSub == idx ? Color(hex: 0xA855F7) : .white, fg: accSub == idx ? .white : Color(hex: 0x3B1C4A)))
                                }
                            }
                        }
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 6) {
                            if accSub == 0 {
                                ForEach(HeadwearId.allCases) { item in
                                    Button(AppStrings.headwearName(item, lang)) { SoundSynthesizer.shared.playSparkle(); state.headwearId = item }
                                        .buttonStyle(PastelPillStyle(bg: state.headwearId == item ? Color(hex: 0xEC4899) : Color(hex: 0xFFF5FA), fg: state.headwearId == item ? .white : Color(hex: 0x3B1C4A)))
                                }
                            } else if accSub == 1 {
                                ForEach(EarringId.allCases) { item in
                                    Button(AppStrings.earringName(item, lang)) { SoundSynthesizer.shared.playSparkle(); state.earringId = item }
                                        .buttonStyle(PastelPillStyle(bg: state.earringId == item ? Color(hex: 0xEC4899) : Color(hex: 0xFFF5FA), fg: state.earringId == item ? .white : Color(hex: 0x3B1C4A)))
                                }
                            } else if accSub == 2 {
                                ForEach(NecklaceId.allCases) { item in
                                    Button(AppStrings.necklaceName(item, lang)) { SoundSynthesizer.shared.playSparkle(); state.necklaceId = item }
                                        .buttonStyle(PastelPillStyle(bg: state.necklaceId == item ? Color(hex: 0xEC4899) : Color(hex: 0xFFF5FA), fg: state.necklaceId == item ? .white : Color(hex: 0x3B1C4A)))
                                }
                            } else if accSub == 3 {
                                ForEach(GlassesId.allCases) { item in
                                    Button(AppStrings.glassesName(item, lang)) { SoundSynthesizer.shared.playSparkle(); state.glassesId = item }
                                        .buttonStyle(PastelPillStyle(bg: state.glassesId == item ? Color(hex: 0xEC4899) : Color(hex: 0xFFF5FA), fg: state.glassesId == item ? .white : Color(hex: 0x3B1C4A)))
                                }
                            } else {
                                ForEach(WingsId.allCases) { item in
                                    Button(AppStrings.wingsName(item, lang)) { SoundSynthesizer.shared.playMagicChime(); state.wingsId = item }
                                        .buttonStyle(PastelPillStyle(bg: state.wingsId == item ? Color(hex: 0xEC4899) : Color(hex: 0xFFF5FA), fg: state.wingsId == item ? .white : Color(hex: 0x3B1C4A)))
                                }
                            }
                        }

                    case .stickers:
                        HStack {
                            Text(lang == .en ? "Tap face to place gems!" : "Chạm lên mặt để dán sticker!")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(Color(hex: 0x6B4C7A))
                            Spacer()
                            Button("↩") { if !state.stickers.isEmpty { state.stickers.removeLast() } }.buttonStyle(PastelPillStyle())
                            Button("🗑️") { state.stickers.removeAll() }.buttonStyle(PastelPillStyle())
                        }
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], spacing: 6) {
                            ForEach(StickerTypeId.allCases) { st in
                                Button("✨ \(st.rawValue)") { activeSticker = st }
                                    .buttonStyle(PastelPillStyle(bg: activeSticker == st ? Color(hex: 0xEC4899) : Color(hex: 0xFFF5FA), fg: activeSticker == st ? .white : Color(hex: 0x3B1C4A)))
                            }
                        }
                    }
                }
                .padding(12)
            }
        }
    }

    private var photoBoothSheet: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 8) {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(ExpressionId.allCases) { exp in
                            Button(AppStrings.expressionName(exp, lang)) { state.expression = exp }
                                .buttonStyle(PastelPillStyle(bg: state.expression == exp ? Color(hex: 0xEC4899) : Color(hex: 0xFFF5FA), fg: state.expression == exp ? .white : Color(hex: 0x3B1C4A)))
                        }
                    }
                }

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(BackgroundId.allCases) { bg in
                            Button(AppStrings.backgroundName(bg, lang)) { SoundSynthesizer.shared.playSparkle(); state.backgroundId = bg }
                                .buttonStyle(PastelPillStyle(bg: state.backgroundId == bg ? Color(hex: 0xA855F7) : Color(hex: 0xFFF5FA), fg: state.backgroundId == bg ? .white : Color(hex: 0x3B1C4A)))
                        }
                    }
                }

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(FrameId.allCases) { fr in
                            Button(AppStrings.frameName(fr, lang)) { state.frameId = fr }
                                .buttonStyle(PastelPillStyle(bg: state.frameId == fr ? Color(hex: 0xEC4899) : Color(hex: 0xFFF5FA), fg: state.frameId == fr ? .white : Color(hex: 0x3B1C4A)))
                        }
                    }
                }

                Button {
                    onSnapPhoto()
                } label: {
                    HStack {
                        Image(systemName: "camera.fill")
                        Text(AppStrings.takePhoto(lang))
                    }
                    .font(.system(size: 17, weight: .heavy, design: .rounded))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(LinearGradient(colors: [Color(hex: 0xFF4D9E), Color(hex: 0xA855F7)], startPoint: .leading, endPoint: .trailing))
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                }

                if let url = latestPhotoUrl {
                    HStack {
                        ShareLink(item: url) {
                            Label(AppStrings.sharePhoto(lang), systemImage: "square.and.arrow.up")
                                .font(.system(size: 13, weight: .bold, design: .rounded))
                                .padding(.horizontal, 12)
                                .padding(.vertical, 7)
                                .background(Color(hex: 0xA855F7))
                                .foregroundColor(.white)
                                .clipShape(Capsule())
                        }
                        Button("🖼️ \(AppStrings.lookbook(lang))") { onOpenGallery() }
                            .buttonStyle(PastelPillStyle())
                    }
                }
                if justSaved {
                    Text("✨ \(AppStrings.savedToast(lang))")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(.green)
                }
            }
            .padding(12)
        }
    }
}

public struct GalleryView: View {
    public let lang: AppLanguage
    public let photos: [SavedPhotoItem]
    public let onBack: () -> Void
    public let onDelete: (SavedPhotoItem) -> Void

    public var body: some View {
        ZStack {
            LinearGradient(colors: [Color(hex: 0xFFE7F4), Color(hex: 0xF5E1FF), Color(hex: 0xE0F4FF)], startPoint: .topLeading, endPoint: .bottomTrailing).ignoresSafeArea()
            VStack(spacing: 10) {
                HStack {
                    Button("← \(AppStrings.back(lang))") { onBack() }.buttonStyle(PastelPillStyle())
                    Spacer()
                    Text("✨ \(AppStrings.galleryTitle(lang))")
                        .font(.system(size: 17, weight: .heavy, design: .rounded))
                        .foregroundColor(Color(hex: 0xDB2777))
                    Spacer()
                }
                .padding(12)
                .background(Color.white.opacity(0.86))

                if photos.isEmpty {
                    Spacer()
                    VStack(spacing: 10) {
                        Text("📸").font(.system(size: 46))
                        Text(AppStrings.galleryEmpty(lang))
                            .font(.system(size: 14, weight: .semibold, design: .rounded))
                            .multilineTextAlignment(.center)
                            .foregroundColor(Color(hex: 0x6B4C7A))
                    }
                    .padding(28)
                    .background(Color.white)
                    .clipShape(RoundedRectangle(cornerRadius: 24))
                    .padding(24)
                    Spacer()
                } else {
                    ScrollView {
                        LazyVGrid(columns: [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)], spacing: 12) {
                            ForEach(photos) { item in
                                VStack(spacing: 6) {
                                    if let uiImg = UIImage(contentsOfFile: item.url.path) {
                                        Image(uiImage: uiImg)
                                            .resizable()
                                            .scaledToFill()
                                            .aspectRatio(0.75, contentMode: .fit)
                                            .clipShape(RoundedRectangle(cornerRadius: 14))
                                    }
                                    HStack {
                                        Text(item.characterName).font(.system(size: 14, weight: .bold))
                                        Spacer()
                                        ShareLink(item: item.url) { Image(systemName: "square.and.arrow.up") }
                                        Button("🗑️") { onDelete(item) }
                                    }
                                }
                                .padding(8)
                                .background(Color.white)
                                .clipShape(RoundedRectangle(cornerRadius: 18))
                            }
                        }
                        .padding(12)
                    }
                }
            }
        }
    }
}
