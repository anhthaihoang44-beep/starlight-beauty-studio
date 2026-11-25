import SwiftUI

public enum StageGeometry {
    public static let width: CGFloat = 600
    public static let height: CGFloat = 800
    public static let faceCx: CGFloat = 300
    public static let headCy: CGFloat = 316
    public static let leftEyeX: CGFloat = 244
    public static let rightEyeX: CGFloat = 356
    public static let eyeY: CGFloat = 326
    public static let leftCheekX: CGFloat = 222
    public static let rightCheekX: CGFloat = 378
    public static let cheekY: CGFloat = 376
    public static let noseX: CGFloat = 300
    public static let noseY: CGFloat = 362
    public static let lipsX: CGFloat = 300
    public static let lipsY: CGFloat = 412

    public static func facePath() -> Path {
        var p = Path()
        p.move(to: CGPoint(x: 188, y: 286))
        p.addCurve(to: CGPoint(x: 300, y: 174), control1: CGPoint(x: 186, y: 212), control2: CGPoint(x: 232, y: 174))
        p.addCurve(to: CGPoint(x: 412, y: 286), control1: CGPoint(x: 368, y: 174), control2: CGPoint(x: 414, y: 212))
        p.addCurve(to: CGPoint(x: 356, y: 440), control1: CGPoint(x: 410, y: 356), control2: CGPoint(x: 396, y: 410))
        p.addCurve(to: CGPoint(x: 300, y: 460), control1: CGPoint(x: 336, y: 454), control2: CGPoint(x: 318, y: 460))
        p.addCurve(to: CGPoint(x: 244, y: 440), control1: CGPoint(x: 282, y: 460), control2: CGPoint(x: 264, y: 454))
        p.addCurve(to: CGPoint(x: 188, y: 286), control1: CGPoint(x: 204, y: 410), control2: CGPoint(x: 190, y: 356))
        p.closeSubpath()
        return p
    }

    public static func eyeshadowCombinedPath() -> Path {
        var p = Path()
        p.move(to: CGPoint(x: 196, y: 328))
        p.addCurve(to: CGPoint(x: 278, y: 290), control1: CGPoint(x: 202, y: 282), control2: CGPoint(x: 240, y: 272))
        p.addCurve(to: CGPoint(x: 274, y: 334), control1: CGPoint(x: 286, y: 300), control2: CGPoint(x: 286, y: 324))
        p.addCurve(to: CGPoint(x: 196, y: 328), control1: CGPoint(x: 256, y: 312), control2: CGPoint(x: 220, y: 312))
        p.closeSubpath()

        p.move(to: CGPoint(x: 404, y: 328))
        p.addCurve(to: CGPoint(x: 322, y: 290), control1: CGPoint(x: 398, y: 282), control2: CGPoint(x: 360, y: 272))
        p.addCurve(to: CGPoint(x: 326, y: 334), control1: CGPoint(x: 314, y: 300), control2: CGPoint(x: 314, y: 324))
        p.addCurve(to: CGPoint(x: 404, y: 328), control1: CGPoint(x: 344, y: 312), control2: CGPoint(x: 380, y: 312))
        p.closeSubpath()
        return p
    }

    public static func lipsFullPath() -> Path {
        var p = Path()
        p.move(to: CGPoint(x: 268, y: 408))
        p.addCurve(to: CGPoint(x: 296, y: 401), control1: CGPoint(x: 276, y: 398), control2: CGPoint(x: 289, y: 396))
        p.addCurve(to: CGPoint(x: 304, y: 401), control1: CGPoint(x: 299, y: 403), control2: CGPoint(x: 301, y: 403))
        p.addCurve(to: CGPoint(x: 332, y: 408), control1: CGPoint(x: 311, y: 396), control2: CGPoint(x: 324, y: 398))
        p.addCurve(to: CGPoint(x: 300, y: 427), control1: CGPoint(x: 324, y: 422), control2: CGPoint(x: 312, y: 427))
        p.addCurve(to: CGPoint(x: 268, y: 408), control1: CGPoint(x: 288, y: 427), control2: CGPoint(x: 276, y: 422))
        p.closeSubpath()
        return p
    }

    public static func isNearLips(_ pt: CGPoint) -> Bool {
        let dx = (pt.x - lipsX) / 52
        let dy = (pt.y - lipsY) / 34
        return dx * dx + dy * dy <= 1
    }

    public static func isNearEyes(_ pt: CGPoint) -> Bool {
        let dl = hypot((pt.x - leftEyeX) / 58, (pt.y - (eyeY - 10)) / 44)
        let dr = hypot((pt.x - rightEyeX) / 58, (pt.y - (eyeY - 10)) / 44)
        return dl <= 1 || dr <= 1
    }

    public static func isNearCheeks(_ pt: CGPoint) -> Bool {
        let dl = hypot((pt.x - leftCheekX) / 58, (pt.y - cheekY) / 46)
        let dr = hypot((pt.x - rightCheekX) / 58, (pt.y - cheekY) / 46)
        let dn = hypot((pt.x - noseX) / 28, (pt.y - noseY) / 24)
        return dl <= 1 || dr <= 1 || dn <= 1
    }

    public static func isNearFace(_ pt: CGPoint) -> Bool {
        hypot((pt.x - faceCx) / 124, (pt.y - headCy) / 152) <= 1
    }
}

public struct CharacterPortraitPreview: View {
    public let character: CharacterModel

    public init(character: CharacterModel) {
        self.character = character
    }

    public var body: some View {
        Canvas { ctx, size in
            let scale = min(size.width / 490, size.height / 650)
            let dx = (size.width - 490 * scale) / 2
            let dy = (size.height - 650 * scale) / 2
            ctx.translateBy(x: dx - 55 * scale, y: dy - 95 * scale)
            ctx.scaleBy(x: scale, y: scale)
            CharacterCanvasDrawer.drawStage(
                ctx: &ctx,
                state: BeautyCatalog.initialMakeover(characterId: character.id),
                isBlinking: false,
                showFrame: false,
                includeBackground: false
            )
        }
    }
}

public struct CharacterStageCanvasView: View {
    public let state: MakeoverState
    public let isBlinking: Bool
    public let showFrame: Bool
    public let cursorPoint: CGPoint?
    public let activeCategory: SalonCategory?
    public let activeMakeupTool: MakeupToolId
    public let activeSpaTool: SpaToolId
    public let activeToolColor: UInt32

    public init(
        state: MakeoverState,
        isBlinking: Bool,
        showFrame: Bool,
        cursorPoint: CGPoint? = nil,
        activeCategory: SalonCategory? = nil,
        activeMakeupTool: MakeupToolId = .lipstick,
        activeSpaTool: SpaToolId = .cleanser,
        activeToolColor: UInt32 = 0xFF69B4
    ) {
        self.state = state
        self.isBlinking = isBlinking
        self.showFrame = showFrame
        self.cursorPoint = cursorPoint
        self.activeCategory = activeCategory
        self.activeMakeupTool = activeMakeupTool
        self.activeSpaTool = activeSpaTool
        self.activeToolColor = activeToolColor
    }

    public var body: some View {
        Canvas { ctx, size in
            ctx.scaleBy(x: size.width / StageGeometry.width, y: size.height / StageGeometry.height)
            CharacterCanvasDrawer.drawStage(
                ctx: &ctx,
                state: state,
                isBlinking: isBlinking,
                showFrame: showFrame,
                includeBackground: true
            )
            if let pt = cursorPoint, activeCategory == .makeup || activeCategory == .spa {
                CharacterCanvasDrawer.drawToolCursor(
                    ctx: &ctx,
                    at: pt,
                    isSpa: activeCategory == .spa,
                    makeupTool: activeMakeupTool,
                    spaTool: activeSpaTool,
                    colorHex: activeToolColor
                )
            }
        }
    }
}

public enum CharacterCanvasDrawer {
    public static func drawStage(
        ctx: inout GraphicsContext,
        state: MakeoverState,
        isBlinking: Bool,
        showFrame: Bool,
        includeBackground: Bool
    ) {
        let character = BeautyCatalog.character(byId: state.characterId)
        let hairColor = BeautyCatalog.hairColor(byId: state.hairColorId)
        let eyeLens = BeautyCatalog.eyeLens(byId: state.eyeColorId)
        let outfitTheme = BeautyCatalog.outfitColor(byId: state.outfitColorId)

        if includeBackground {
            drawBackground(ctx: &ctx, bg: state.backgroundId)
        }
        drawWings(ctx: &ctx, wings: state.wingsId)
        drawHairBack(ctx: &ctx, style: state.hairStyle, color: hairColor, highlight: state.hairHighlightEnabled)
        drawFaceBase(ctx: &ctx, c: character)
        drawOutfitBodyAndSkirt(ctx: &ctx, outfit: state.outfitId, theme: outfitTheme)
        drawArmsAndHands(ctx: &ctx, c: character)
        drawOutfitSleevesAndTopDetails(ctx: &ctx, outfit: state.outfitId, theme: outfitTheme)
        drawNecklace(ctx: &ctx, necklace: state.necklaceId)
        drawEarrings(ctx: &ctx, earring: state.earringId)

        // Clipped Interactive Paint Layers (Skin Blush/Glow + Spa + Eyeshadow + Lipstick)
        drawClippedDabs(ctx: &ctx, dabs: state.skinDabs, clipPath: StageGeometry.facePath())
        drawClippedDabs(ctx: &ctx, dabs: state.spaMaskDabs, clipPath: StageGeometry.facePath())
        drawSpaBubbles(ctx: &ctx, dabs: state.spaBubbleDabs, clipPath: StageGeometry.facePath())
        drawClippedDabs(ctx: &ctx, dabs: state.eyeshadowDabs, clipPath: StageGeometry.eyeshadowCombinedPath())

        if state.expression != .happy {
            if state.expression == .kissy {
                ctx.drawLayer { layer in
                    layer.translateBy(x: StageGeometry.lipsX, y: StageGeometry.lipsY)
                    layer.scaleBy(x: 0.68, y: 0.94)
                    layer.translateBy(x: -StageGeometry.lipsX, y: -StageGeometry.lipsY)
                    drawClippedDabs(ctx: &layer, dabs: state.lipDabs, clipPath: StageGeometry.lipsFullPath())
                }
            } else {
                drawClippedDabs(ctx: &ctx, dabs: state.lipDabs, clipPath: StageGeometry.lipsFullPath())
            }
        }

        drawFaceTopFeatures(ctx: &ctx, c: character, lens: eyeLens, state: state, isBlinking: isBlinking)
        drawHairFront(ctx: &ctx, style: state.hairStyle, color: hairColor, highlight: state.hairHighlightEnabled)

        for st in state.stickers {
            drawSticker(ctx: &ctx, type: st.type, at: CGPoint(x: st.x, y: st.y), scale: st.scale, rotationDeg: st.rotation)
        }

        drawGlasses(ctx: &ctx, glasses: state.glassesId)
        drawHeadwear(ctx: &ctx, headwear: state.headwearId)

        if showFrame {
            drawPhotoFrame(ctx: &ctx, frame: state.frameId, characterName: character.name)
        }
    }

    private static func drawClippedDabs(ctx: inout GraphicsContext, dabs: [PaintDab], clipPath: Path) {
        guard !dabs.isEmpty else { return }
        ctx.drawLayer { layer in
            layer.clip(to: clipPath)
            for dab in dabs {
                let rect = CGRect(x: dab.x - dab.radius, y: dab.y - dab.radius, width: dab.radius * 2, height: dab.radius * 2)
                let grad = Gradient(stops: [
                    .init(color: Color(hex: dab.hex, opacity: dab.alpha), location: 0.08),
                    .init(color: Color(hex: dab.hex, opacity: dab.alpha * 0.52), location: 0.56),
                    .init(color: Color(hex: dab.hex, opacity: 0), location: 1.0)
                ])
                layer.fill(
                    Path(ellipseIn: rect),
                    with: .radialGradient(grad, center: CGPoint(x: dab.x, y: dab.y), startRadius: 1, endRadius: dab.radius)
                )
                if dab.glitter {
                    let sRect = CGRect(x: dab.x - 2, y: dab.y - 2, width: 3.4, height: 3.4)
                    layer.fill(Path(ellipseIn: sRect), with: .color(Color(hex: 0xFFFDE0, opacity: 0.85)))
                }
            }
        }
    }

    private static func drawSpaBubbles(ctx: inout GraphicsContext, dabs: [PaintDab], clipPath: Path) {
        guard !dabs.isEmpty else { return }
        ctx.drawLayer { layer in
            layer.clip(to: clipPath)
            for dab in dabs {
                let rect = CGRect(x: dab.x - dab.radius, y: dab.y - dab.radius, width: dab.radius * 2, height: dab.radius * 2)
                let p = Path(ellipseIn: rect)
                layer.fill(p, with: .color(.white.opacity(0.72)))
                layer.stroke(p, with: .color(Color(hex: 0x7DD3FC, opacity: 0.65)), lineWidth: 1.8)
            }
        }
    }

    private static func drawBackground(ctx: inout GraphicsContext, bg: BackgroundId) {
        let colors: [Color]
        switch bg {
        case .vanityPink: colors = [Color(hex: 0xFFE6F3), Color(hex: 0xFFF0FA), Color(hex: 0xF5D5FF)]
        case .sakuraGarden: colors = [Color(hex: 0xBAE6FD), Color(hex: 0xFFE4F2), Color(hex: 0xFBCFE8)]
        case .starlightPalace: colors = [Color(hex: 0x1E1B4B), Color(hex: 0x581C87), Color(hex: 0xC084FC)]
        case .rainbowClouds: colors = [Color(hex: 0xBAE6FD), Color(hex: 0xE9D5FF), Color(hex: 0xFBCFE8), Color(hex: 0xFEF08A)]
        case .butterflyMeadow: colors = [Color(hex: 0xE0F2FE), Color(hex: 0xFEF9C3), Color(hex: 0xA7F3D0)]
        case .royalCarpet: colors = [Color(hex: 0x4A044E), Color(hex: 0x9D174D), Color(hex: 0xF472B6)]
        }
        ctx.fill(
            Path(CGRect(x: 0, y: 0, width: 600, height: 800)),
            with: .linearGradient(Gradient(colors: colors), startPoint: .zero, endPoint: CGPoint(x: 0, y: 800))
        )

        switch bg {
        case .vanityPink:
            for i in 0..<8 {
                ctx.fill(Path(CGRect(x: CGFloat(i * 80), y: 0, width: 40, height: 800)), with: .color(.white.opacity(0.22)))
            }
            ctx.fill(Path(ellipseIn: CGRect(x: 56, y: 116, width: 488, height: 488)), with: .color(.white.opacity(0.45)))
            ctx.stroke(Path(ellipseIn: CGRect(x: 72, y: 132, width: 456, height: 456)), with: .color(Color(hex: 0xFFB8DC, opacity: 0.7)), lineWidth: 10)
            for i in 0..<14 {
                let a = Double(i) * (2.0 * .pi / 14.0)
                let bx = 300 + CGFloat(cos(a)) * 228
                let by = 360 + CGFloat(sin(a)) * 228
                ctx.fill(Path(ellipseIn: CGRect(x: bx - 14, y: by - 14, width: 28, height: 28)), with: .color(Color(hex: 0xFEF08A, opacity: 0.45)))
                ctx.fill(Path(ellipseIn: CGRect(x: bx - 7.5, y: by - 7.5, width: 15, height: 15)), with: .color(Color(hex: 0xFFFDF7)))
            }
        case .starlightPalace:
            ctx.fill(Path(ellipseIn: CGRect(x: 428, y: 68, width: 104, height: 104)), with: .color(Color(hex: 0xFEF9C3, opacity: 0.92)))
            for pt in [CGPoint(x: 80, y: 90), CGPoint(x: 180, y: 66), CGPoint(x: 360, y: 82), CGPoint(x: 96, y: 230), CGPoint(x: 520, y: 250)] {
                ctx.fill(fourPointStar(center: pt, r: 10), with: .color(Color(hex: 0xFFFBEB, opacity: 0.9)))
            }
        case .rainbowClouds:
            let arcs: [(UInt32, CGFloat)] = [(0xFF8AC6, 270), (0xFDE047, 248), (0x6EE7B7, 226), (0x7DD3FC, 204)]
            for (hex, r) in arcs {
                var p = Path()
                p.addArc(center: CGPoint(x: 300, y: 480), radius: r, startAngle: .degrees(180), endAngle: .degrees(360), clockwise: false)
                ctx.stroke(p, with: .color(Color(hex: hex, opacity: 0.55)), lineWidth: 22)
            }
        case .sakuraGarden:
            for pt in [CGPoint(x: 70, y: 96), CGPoint(x: 140, y: 78), CGPoint(x: 470, y: 96), CGPoint(x: 536, y: 118)] {
                drawSticker(ctx: &ctx, type: .sakura, at: pt, scale: 1.25, rotationDeg: 0)
            }
        case .butterflyMeadow:
            ctx.fill(Path(ellipseIn: CGRect(x: 58, y: 58, width: 104, height: 104)), with: .color(Color(hex: 0xFEF08A, opacity: 0.85)))
            ctx.fill(Path(ellipseIn: CGRect(x: -60, y: 590, width: 720, height: 310)), with: .color(Color(hex: 0x6EE7B7, opacity: 0.6)))
            drawSticker(ctx: &ctx, type: .butterfly, at: CGPoint(x: 92, y: 230), scale: 1.3, rotationDeg: -15)
            drawSticker(ctx: &ctx, type: .butterfly, at: CGPoint(x: 506, y: 190), scale: 1.3, rotationDeg: 15)
        case .royalCarpet:
            var beam = Path()
            beam.move(to: CGPoint(x: 80, y: 0)); beam.addLine(to: CGPoint(x: 240, y: 0))
            beam.addLine(to: CGPoint(x: 380, y: 800)); beam.addLine(to: CGPoint(x: 180, y: 800)); beam.closeSubpath()
            ctx.fill(beam, with: .color(Color(hex: 0xFFFBEB, opacity: 0.14)))
        }
    }

    private static func hairMainShading(_ color: HairColorOption) -> GraphicsContext.Shading {
        if color.isRainbow {
            return .linearGradient(
                Gradient(colors: [Color(hex: 0xFF7AC6), Color(hex: 0xFDE047), Color(hex: 0x67E8F9), Color(hex: 0xA78BFA)]),
                startPoint: CGPoint(x: 140, y: 140),
                endPoint: CGPoint(x: 460, y: 660)
            )
        }
        return .linearGradient(
            Gradient(colors: [Color(hex: color.highlight), Color(hex: color.primary), Color(hex: color.shadow)]),
            startPoint: CGPoint(x: 160, y: 140),
            endPoint: CGPoint(x: 440, y: 660)
        )
    }

    private static func drawWings(ctx: inout GraphicsContext, wings: WingsId) {
        guard wings != .none else { return }
        let fill: GraphicsContext.Shading
        switch wings {
        case .fairyIridescent:
            fill = .linearGradient(Gradient(colors: [Color(hex: 0xA5F3FC, opacity: 0.88), Color(hex: 0xF5D0FE, opacity: 0.85), Color(hex: 0xFDE68A, opacity: 0.88)]), startPoint: CGPoint(x: 40, y: 400), endPoint: CGPoint(x: 560, y: 700))
        case .butterflyPink:
            fill = .linearGradient(Gradient(colors: [Color(hex: 0xFF7AC6, opacity: 0.92), Color(hex: 0xC084FC, opacity: 0.9), Color(hex: 0xFDE047, opacity: 0.9)]), startPoint: CGPoint(x: 40, y: 400), endPoint: CGPoint(x: 560, y: 700))
        case .angelFeather:
            fill = .color(.white.opacity(0.95))
        case .starlightCrystal:
            fill = .color(Color(hex: 0xE0F2FE, opacity: 0.84))
        case .none:
            return
        }
        var lu = Path(); lu.move(to: CGPoint(x: 248, y: 540)); lu.addCurve(to: CGPoint(x: 42, y: 462), control1: CGPoint(x: 166, y: 424), control2: CGPoint(x: 52, y: 382)); lu.addCurve(to: CGPoint(x: 210, y: 582), control1: CGPoint(x: 34, y: 524), control2: CGPoint(x: 118, y: 570)); lu.closeSubpath()
        var ll = Path(); ll.move(to: CGPoint(x: 226, y: 588)); ll.addCurve(to: CGPoint(x: 92, y: 686), control1: CGPoint(x: 148, y: 584), control2: CGPoint(x: 68, y: 624)); ll.addCurve(to: CGPoint(x: 232, y: 632), control1: CGPoint(x: 112, y: 732), control2: CGPoint(x: 186, y: 704)); ll.closeSubpath()
        var ru = Path(); ru.move(to: CGPoint(x: 352, y: 540)); ru.addCurve(to: CGPoint(x: 558, y: 462), control1: CGPoint(x: 434, y: 424), control2: CGPoint(x: 548, y: 382)); ru.addCurve(to: CGPoint(x: 390, y: 582), control1: CGPoint(x: 566, y: 524), control2: CGPoint(x: 482, y: 570)); ru.closeSubpath()
        var rl = Path(); rl.move(to: CGPoint(x: 374, y: 588)); rl.addCurve(to: CGPoint(x: 508, y: 686), control1: CGPoint(x: 452, y: 584), control2: CGPoint(x: 532, y: 624)); rl.addCurve(to: CGPoint(x: 368, y: 632), control1: CGPoint(x: 488, y: 732), control2: CGPoint(x: 414, y: 704)); rl.closeSubpath()
        for p in [lu, ll, ru, rl] {
            ctx.fill(p, with: fill)
            ctx.stroke(p, with: .color(.white), lineWidth: 3.5)
        }
    }

    private static func drawHairBack(ctx: inout GraphicsContext, style: HairstyleId, color: HairColorOption, highlight: Bool) {
        let main = hairMainShading(color)
        let deep = GraphicsContext.Shading.linearGradient(Gradient(colors: [Color(hex: color.primary), Color(hex: color.shadow)]), startPoint: CGPoint(x: 300, y: 140), endPoint: CGPoint(x: 300, y: 680))
        let outline = Color(hex: color.shadow)

        var backCap = Path()
        backCap.move(to: CGPoint(x: 174, y: 264))
        backCap.addCurve(to: CGPoint(x: 214, y: 462), control1: CGPoint(x: 170, y: 340), control2: CGPoint(x: 180, y: 424))
        backCap.addLine(to: CGPoint(x: 386, y: 462))
        backCap.addCurve(to: CGPoint(x: 426, y: 264), control1: CGPoint(x: 420, y: 424), control2: CGPoint(x: 430, y: 340))
        backCap.addCurve(to: CGPoint(x: 300, y: 138), control1: CGPoint(x: 414, y: 174), control2: CGPoint(x: 366, y: 138))
        backCap.addCurve(to: CGPoint(x: 174, y: 264), control1: CGPoint(x: 234, y: 138), control2: CGPoint(x: 186, y: 174))
        backCap.closeSubpath()

        switch style {
        case .princessWaves, .fairyCurls, .ribbonHalfup:
            var p = Path()
            p.move(to: CGPoint(x: 162, y: 260))
            p.addCurve(to: CGPoint(x: 146, y: 610), control1: CGPoint(x: 136, y: 350), control2: CGPoint(x: 128, y: 480))
            p.addCurve(to: CGPoint(x: 300, y: 690), control1: CGPoint(x: 170, y: 678), control2: CGPoint(x: 240, y: 688))
            p.addCurve(to: CGPoint(x: 454, y: 610), control1: CGPoint(x: 360, y: 688), control2: CGPoint(x: 430, y: 678))
            p.addCurve(to: CGPoint(x: 438, y: 260), control1: CGPoint(x: 472, y: 480), control2: CGPoint(x: 464, y: 350))
            p.addCurve(to: CGPoint(x: 300, y: 136), control1: CGPoint(x: 420, y: 180), control2: CGPoint(x: 368, y: 136))
            p.addCurve(to: CGPoint(x: 162, y: 260), control1: CGPoint(x: 232, y: 136), control2: CGPoint(x: 180, y: 180))
            p.closeSubpath()
            ctx.fill(p, with: deep)
            ctx.stroke(p, with: .color(outline), lineWidth: 3)
            if style == .ribbonHalfup {
                ctx.fill(Path(ellipseIn: CGRect(x: 222, y: 126, width: 72, height: 60)), with: .color(Color(hex: 0xFF75B5)))
                ctx.fill(Path(ellipseIn: CGRect(x: 306, y: 126, width: 72, height: 60)), with: .color(Color(hex: 0xFF75B5)))
                ctx.fill(Path(ellipseIn: CGRect(x: 286, y: 144, width: 28, height: 28)), with: .color(Color(hex: 0xFF4D9E)))
            }
        case .spaceBuns:
            for cx in [CGFloat(176), CGFloat(424)] {
                let r = Path(ellipseIn: CGRect(x: cx - 58, y: 118, width: 116, height: 116))
                ctx.fill(r, with: main); ctx.stroke(r, with: .color(outline), lineWidth: 3)
            }
            ctx.fill(backCap, with: deep); ctx.stroke(backCap, with: .color(outline), lineWidth: 3)
        case .twinBraids:
            ctx.fill(backCap, with: deep); ctx.stroke(backCap, with: .color(outline), lineWidth: 3)
            for i in 0..<5 {
                let rx = 24 - CGFloat(i) * 1.4
                let y = 418 + CGFloat(i) * 38
                let sh = i % 2 == 0 ? main : deep
                let lr = Path(ellipseIn: CGRect(x: 176 - CGFloat(i) * 4 - rx, y: y - 22, width: rx * 2, height: 44))
                let rr = Path(ellipseIn: CGRect(x: 424 + CGFloat(i) * 4 - rx, y: y - 22, width: rx * 2, height: 44))
                ctx.fill(lr, with: sh); ctx.stroke(lr, with: .color(outline), lineWidth: 2.5)
                ctx.fill(rr, with: sh); ctx.stroke(rr, with: .color(outline), lineWidth: 2.5)
            }
        case .sweetBob:
            var p = Path()
            p.move(to: CGPoint(x: 162, y: 274))
            p.addCurve(to: CGPoint(x: 198, y: 468), control1: CGPoint(x: 150, y: 356), control2: CGPoint(x: 158, y: 432))
            p.addCurve(to: CGPoint(x: 402, y: 468), control1: CGPoint(x: 244, y: 492), control2: CGPoint(x: 356, y: 492))
            p.addCurve(to: CGPoint(x: 438, y: 274), control1: CGPoint(x: 442, y: 432), control2: CGPoint(x: 450, y: 356))
            p.addCurve(to: CGPoint(x: 300, y: 136), control1: CGPoint(x: 424, y: 180), control2: CGPoint(x: 370, y: 136))
            p.addCurve(to: CGPoint(x: 162, y: 274), control1: CGPoint(x: 230, y: 136), control2: CGPoint(x: 176, y: 180))
            p.closeSubpath()
            ctx.fill(p, with: deep); ctx.stroke(p, with: .color(outline), lineWidth: 3)
        case .highPonytail:
            var tail = Path()
            tail.move(to: CGPoint(x: 310, y: 144))
            tail.addCurve(to: CGPoint(x: 488, y: 262), control1: CGPoint(x: 378, y: 106), control2: CGPoint(x: 466, y: 154))
            tail.addCurve(to: CGPoint(x: 444, y: 562), control1: CGPoint(x: 508, y: 360), control2: CGPoint(x: 480, y: 488))
            tail.addCurve(to: CGPoint(x: 304, y: 184), control1: CGPoint(x: 424, y: 446), control2: CGPoint(x: 380, y: 210))
            tail.closeSubpath()
            ctx.fill(tail, with: main); ctx.stroke(tail, with: .color(outline), lineWidth: 3)
            ctx.fill(Path(ellipseIn: CGRect(x: 274, y: 132, width: 68, height: 32)), with: .color(Color(hex: 0xFF6BB5)))
            ctx.fill(backCap, with: deep); ctx.stroke(backCap, with: .color(outline), lineWidth: 3)
        case .curlyPuffs:
            let puffs: [(CGFloat, CGFloat, CGFloat)] = [(148, 240, 54), (128, 296, 46), (164, 196, 46), (144, 348, 40), (452, 240, 54), (472, 296, 46), (436, 196, 46), (456, 348, 40)]
            for (cx, cy, r) in puffs {
                let cp = Path(ellipseIn: CGRect(x: cx - r, y: cy - r, width: r * 2, height: r * 2))
                ctx.fill(cp, with: main); ctx.stroke(cp, with: .color(outline), lineWidth: 2.8)
            }
            ctx.fill(backCap, with: deep); ctx.stroke(backCap, with: .color(outline), lineWidth: 3)
        }
        if highlight {
            var s1 = Path(); s1.move(to: CGPoint(x: 174, y: 390)); s1.addLine(to: CGPoint(x: 192, y: 615))
            var s2 = Path(); s2.move(to: CGPoint(x: 426, y: 390)); s2.addLine(to: CGPoint(x: 408, y: 615))
            ctx.stroke(s1, with: .color(Color(hex: color.streak, opacity: 0.72)), style: StrokeStyle(lineWidth: 14, lineCap: .round))
            ctx.stroke(s2, with: .color(Color(hex: color.streak, opacity: 0.72)), style: StrokeStyle(lineWidth: 14, lineCap: .round))
        }
    }

    private static func drawHairFront(ctx: inout GraphicsContext, style: HairstyleId, color: HairColorOption, highlight: Bool) {
        let main = hairMainShading(color)
        let outline = Color(hex: color.shadow)

        var bangs = Path()
        bangs.move(to: CGPoint(x: 174, y: 294))
        bangs.addCurve(to: CGPoint(x: 300, y: 140), control1: CGPoint(x: 172, y: 192), control2: CGPoint(x: 224, y: 140))
        bangs.addCurve(to: CGPoint(x: 426, y: 294), control1: CGPoint(x: 376, y: 140), control2: CGPoint(x: 428, y: 192))
        bangs.addCurve(to: CGPoint(x: 344, y: 212), control1: CGPoint(x: 414, y: 246), control2: CGPoint(x: 386, y: 218))
        bangs.addCurve(to: CGPoint(x: 300, y: 220), control1: CGPoint(x: 330, y: 232), control2: CGPoint(x: 316, y: 244))
        bangs.addCurve(to: CGPoint(x: 256, y: 212), control1: CGPoint(x: 284, y: 244), control2: CGPoint(x: 270, y: 232))
        bangs.addCurve(to: CGPoint(x: 174, y: 294), control1: CGPoint(x: 214, y: 218), control2: CGPoint(x: 186, y: 246))
        bangs.closeSubpath()
        ctx.fill(bangs, with: main)
        ctx.stroke(bangs, with: .color(outline), lineWidth: 2.8)

        if highlight {
            var hs1 = Path(); hs1.move(to: CGPoint(x: 222, y: 178)); hs1.addQuadCurve(to: CGPoint(x: 188, y: 276), control: CGPoint(x: 200, y: 222))
            var hs2 = Path(); hs2.move(to: CGPoint(x: 378, y: 178)); hs2.addQuadCurve(to: CGPoint(x: 412, y: 276), control: CGPoint(x: 400, y: 222))
            ctx.stroke(hs1, with: .color(Color(hex: color.streak, opacity: 0.72)), style: StrokeStyle(lineWidth: 9, lineCap: .round))
            ctx.stroke(hs2, with: .color(Color(hex: color.streak, opacity: 0.72)), style: StrokeStyle(lineWidth: 9, lineCap: .round))
        }

        // Halo hair shine
        var sh1 = Path(); sh1.move(to: CGPoint(x: 222, y: 194)); sh1.addQuadCurve(to: CGPoint(x: 290, y: 176), control: CGPoint(x: 254, y: 170))
        var sh2 = Path(); sh2.move(to: CGPoint(x: 314, y: 176)); sh2.addQuadCurve(to: CGPoint(x: 378, y: 194), control: CGPoint(x: 346, y: 170))
        ctx.stroke(sh1, with: .color(.white.opacity(0.38)), style: StrokeStyle(lineWidth: 7, lineCap: .round))
        ctx.stroke(sh2, with: .color(.white.opacity(0.38)), style: StrokeStyle(lineWidth: 7, lineCap: .round))
    }

    private static func drawFaceBase(ctx: inout GraphicsContext, c: CharacterModel) {
        let outline = Color(hex: c.skinShadow)
        // Sculpted Neck, Shoulders & Hourglass Torso (waist at y=668)
        var torso = Path()
        torso.move(to: CGPoint(x: 272, y: 438))
        torso.addLine(to: CGPoint(x: 270, y: 506))
        torso.addCurve(to: CGPoint(x: 182, y: 544), control1: CGPoint(x: 246, y: 514), control2: CGPoint(x: 200, y: 520))
        torso.addCurve(to: CGPoint(x: 206, y: 594), control1: CGPoint(x: 190, y: 566), control2: CGPoint(x: 200, y: 580))
        torso.addCurve(to: CGPoint(x: 226, y: 668), control1: CGPoint(x: 212, y: 622), control2: CGPoint(x: 220, y: 646))
        torso.addCurve(to: CGPoint(x: 196, y: 800), control1: CGPoint(x: 214, y: 712), control2: CGPoint(x: 202, y: 756))
        torso.addLine(to: CGPoint(x: 404, y: 800))
        torso.addCurve(to: CGPoint(x: 374, y: 668), control1: CGPoint(x: 398, y: 756), control2: CGPoint(x: 386, y: 712))
        torso.addCurve(to: CGPoint(x: 394, y: 594), control1: CGPoint(x: 380, y: 646), control2: CGPoint(x: 388, y: 622))
        torso.addCurve(to: CGPoint(x: 418, y: 544), control1: CGPoint(x: 400, y: 580), control2: CGPoint(x: 410, y: 566))
        torso.addCurve(to: CGPoint(x: 330, y: 506), control1: CGPoint(x: 400, y: 520), control2: CGPoint(x: 354, y: 514))
        torso.addLine(to: CGPoint(x: 328, y: 438))
        torso.closeSubpath()
        ctx.fill(torso, with: .linearGradient(Gradient(colors: [Color(hex: c.skinNeckShadow), Color(hex: c.skinBase), Color(hex: c.skinLight)]), startPoint: CGPoint(x: 300, y: 438), endPoint: CGPoint(x: 300, y: 720)))
        ctx.stroke(torso, with: .color(outline), lineWidth: 2.5)

        // Ears
        for ex in [CGFloat(166), CGFloat(398)] {
            let e = Path(ellipseIn: CGRect(x: ex, y: 308, width: 36, height: 56))
            ctx.fill(e, with: .color(Color(hex: c.skinBase)))
            ctx.stroke(e, with: .color(outline), lineWidth: 2.4)
        }

        // Face oval
        let fp = StageGeometry.facePath()
        ctx.fill(fp, with: .radialGradient(Gradient(colors: [Color(hex: c.skinLight), Color(hex: c.skinBase), Color(hex: c.skinShadow)]), center: CGPoint(x: 300, y: 296), startRadius: 5, endRadius: 185))
        ctx.stroke(fp, with: .color(outline), lineWidth: 2.6)

        // Natural cheek glow
        for cx in [StageGeometry.leftCheekX, StageGeometry.rightCheekX] {
            let cr = CGRect(x: cx - 34, y: StageGeometry.cheekY - 22, width: 68, height: 44)
            ctx.fill(Path(ellipseIn: cr), with: .radialGradient(Gradient(colors: [Color(hex: c.naturalBlush, opacity: 0.28), Color(hex: c.naturalBlush, opacity: 0)]), center: CGPoint(x: cx, y: StageGeometry.cheekY), startRadius: 1, endRadius: 34))
        }

        // Natural lips base
        ctx.fill(StageGeometry.lipsFullPath(), with: .color(Color(hex: c.naturalLip, opacity: 0.86)))
    }

    private static func drawArmsAndHands(ctx: inout GraphicsContext, c: CharacterModel) {
        let outline = Color(hex: c.skinShadow)
        let leftFill = GraphicsContext.Shading.linearGradient(Gradient(colors: [Color(hex: c.skinLight), Color(hex: c.skinBase), Color(hex: c.skinShadow)]), startPoint: CGPoint(x: 140, y: 540), endPoint: CGPoint(x: 210, y: 790))
        let rightFill = GraphicsContext.Shading.linearGradient(Gradient(colors: [Color(hex: c.skinLight), Color(hex: c.skinBase), Color(hex: c.skinShadow)]), startPoint: CGPoint(x: 460, y: 540), endPoint: CGPoint(x: 390, y: 790))

        var leftArm = Path()
        leftArm.move(to: CGPoint(x: 184, y: 540))
        leftArm.addCurve(to: CGPoint(x: 140, y: 648), control1: CGPoint(x: 160, y: 566), control2: CGPoint(x: 142, y: 610))
        leftArm.addCurve(to: CGPoint(x: 168, y: 744), control1: CGPoint(x: 138, y: 682), control2: CGPoint(x: 152, y: 716))
        leftArm.addCurve(to: CGPoint(x: 186, y: 790), control1: CGPoint(x: 164, y: 764), control2: CGPoint(x: 172, y: 786))
        leftArm.addCurve(to: CGPoint(x: 201, y: 765), control1: CGPoint(x: 198, y: 792), control2: CGPoint(x: 206, y: 780))
        leftArm.addCurve(to: CGPoint(x: 194, y: 738), control1: CGPoint(x: 210, y: 761), control2: CGPoint(x: 208, y: 747))
        leftArm.addCurve(to: CGPoint(x: 174, y: 648), control1: CGPoint(x: 182, y: 710), control2: CGPoint(x: 172, y: 676))
        leftArm.addCurve(to: CGPoint(x: 206, y: 590), control1: CGPoint(x: 176, y: 622), control2: CGPoint(x: 192, y: 602))
        leftArm.addCurve(to: CGPoint(x: 184, y: 540), control1: CGPoint(x: 200, y: 570), control2: CGPoint(x: 192, y: 552))
        leftArm.closeSubpath()
        ctx.fill(leftArm, with: leftFill)
        ctx.stroke(leftArm, with: .color(outline), lineWidth: 2.5)

        var rightArm = Path()
        rightArm.move(to: CGPoint(x: 416, y: 540))
        rightArm.addCurve(to: CGPoint(x: 460, y: 648), control1: CGPoint(x: 440, y: 566), control2: CGPoint(x: 458, y: 610))
        rightArm.addCurve(to: CGPoint(x: 432, y: 744), control1: CGPoint(x: 462, y: 682), control2: CGPoint(x: 448, y: 716))
        rightArm.addCurve(to: CGPoint(x: 414, y: 790), control1: CGPoint(x: 436, y: 764), control2: CGPoint(x: 428, y: 786))
        rightArm.addCurve(to: CGPoint(x: 399, y: 765), control1: CGPoint(x: 402, y: 792), control2: CGPoint(x: 394, y: 780))
        rightArm.addCurve(to: CGPoint(x: 406, y: 738), control1: CGPoint(x: 390, y: 761), control2: CGPoint(x: 392, y: 747))
        rightArm.addCurve(to: CGPoint(x: 426, y: 648), control1: CGPoint(x: 418, y: 710), control2: CGPoint(x: 428, y: 676))
        rightArm.addCurve(to: CGPoint(x: 394, y: 590), control1: CGPoint(x: 424, y: 622), control2: CGPoint(x: 408, y: 602))
        rightArm.addCurve(to: CGPoint(x: 416, y: 540), control1: CGPoint(x: 400, y: 570), control2: CGPoint(x: 408, y: 552))
        rightArm.closeSubpath()
        ctx.fill(rightArm, with: rightFill)
        ctx.stroke(rightArm, with: .color(outline), lineWidth: 2.5)
    }

    private static func drawFaceTopFeatures(
        ctx: inout GraphicsContext,
        c: CharacterModel,
        lens: EyeLensOption,
        state: MakeoverState,
        isBlinking: Bool
    ) {
        // Button nose
        var nose = Path()
        nose.move(to: CGPoint(x: 294, y: 366))
        nose.addQuadCurve(to: CGPoint(x: 306, y: 366), control: CGPoint(x: 300, y: 372))
        ctx.stroke(nose, with: .color(Color(hex: c.skinShadow)), style: StrokeStyle(lineWidth: 2.6, lineCap: .round))

        // Lips expression & gloss
        if state.expression == .happy {
            var m = Path()
            m.move(to: CGPoint(x: 272, y: 406)); m.addQuadCurve(to: CGPoint(x: 328, y: 406), control: CGPoint(x: 300, y: 400))
            m.addCurve(to: CGPoint(x: 300, y: 438), control1: CGPoint(x: 324, y: 432), control2: CGPoint(x: 314, y: 438))
            m.addCurve(to: CGPoint(x: 272, y: 406), control1: CGPoint(x: 286, y: 438), control2: CGPoint(x: 276, y: 432))
            m.closeSubpath()
            ctx.fill(m, with: .color(Color(hex: 0xC94B67)))
            ctx.fill(Path(ellipseIn: CGRect(x: 286, y: 425, width: 28, height: 12)), with: .color(Color(hex: 0xFF8DA1)))
        } else {
            var smile = Path()
            smile.move(to: CGPoint(x: 269, y: 408))
            smile.addQuadCurve(to: CGPoint(x: 300, y: 411), control: CGPoint(x: 285, y: 412))
            smile.addQuadCurve(to: CGPoint(x: 331, y: 408), control: CGPoint(x: 315, y: 412))
            ctx.stroke(smile, with: .color(Color(hex: c.naturalLipShadow, opacity: 0.78)), style: StrokeStyle(lineWidth: 2.2, lineCap: .round))

            if state.lipFinish == .glossy || state.lipFinish == .glitter {
                var gl = Path(); gl.move(to: CGPoint(x: 284, y: 418)); gl.addQuadCurve(to: CGPoint(x: 316, y: 418), control: CGPoint(x: 300, y: 423))
                ctx.stroke(gl, with: .color(.white.opacity(state.lipDabs.isEmpty ? 0.45 : 0.85)), style: StrokeStyle(lineWidth: 4, lineCap: .round))
            }
        }

        // Eyes & Eyebrows
        drawEye(ctx: &ctx, isLeft: true, lens: lens, state: state, closed: isBlinking)
        drawEye(ctx: &ctx, isLeft: false, lens: lens, state: state, closed: isBlinking || state.expression == .wink)
        drawEyebrow(ctx: &ctx, isLeft: true, style: state.eyebrowStyle, colorHex: state.eyebrowColor)
        drawEyebrow(ctx: &ctx, isLeft: false, style: state.eyebrowStyle, colorHex: state.eyebrowColor)

        if state.spaGlow {
            for pt in [CGPoint(x: 218, y: 368), CGPoint(x: 382, y: 368), CGPoint(x: 300, y: 232)] {
                ctx.fill(fourPointStar(center: pt, r: 6.5), with: .color(Color(hex: 0xFFFBEB, opacity: 0.88)))
            }
        }
    }

    private static func drawEye(ctx: inout GraphicsContext, isLeft: Bool, lens: EyeLensOption, state: MakeoverState, closed: Bool) {
        let cx = isLeft ? StageGeometry.leftEyeX : StageGeometry.rightEyeX
        let cy = StageGeometry.eyeY

        if closed {
            var p = Path()
            p.move(to: CGPoint(x: cx - 26, y: cy + 2))
            p.addQuadCurve(to: CGPoint(x: cx + 26, y: cy + 2), control: CGPoint(x: cx, y: isLeft ? cy + 14 : cy - 10))
            ctx.stroke(p, with: .color(Color(hex: 0x2B2129)), style: StrokeStyle(lineWidth: 4.5, lineCap: .round))
            return
        }

        var shape = Path()
        shape.move(to: CGPoint(x: cx - 28, y: cy + 2))
        shape.addCurve(to: CGPoint(x: cx + 28, y: cy + 2), control1: CGPoint(x: cx - 22, y: cy - 22), control2: CGPoint(x: cx + 22, y: cy - 22))
        shape.addCurve(to: CGPoint(x: cx - 28, y: cy + 2), control1: CGPoint(x: cx + 20, y: cy + 20), control2: CGPoint(x: cx - 20, y: cy + 20))
        shape.closeSubpath()
        ctx.fill(shape, with: .color(.white))

        ctx.drawLayer { layer in
            layer.clip(to: shape)
            layer.fill(
                Path(ellipseIn: CGRect(x: cx - 17.5, y: cy - 16.5, width: 35, height: 35)),
                with: .radialGradient(Gradient(colors: [Color(hex: lens.inner), Color(hex: lens.outer), Color(hex: 0x1E1B2E)]), center: CGPoint(x: cx, y: cy - 2), startRadius: 1, endRadius: 20)
            )
            layer.fill(Path(ellipseIn: CGRect(x: cx - 7.5, y: cy - 6.5, width: 15, height: 15)), with: .color(Color(hex: 0x181226)))
            layer.fill(Path(ellipseIn: CGRect(x: cx - 12.2, y: cy - 11.2, width: 10.4, height: 10.4)), with: .color(.white))
            layer.fill(Path(ellipseIn: CGRect(x: cx + 3.4, y: cy + 3.4, width: 5.2, height: 5.2)), with: .color(Color(hex: lens.sparkle)))
            if state.expression == .starry || lens.id == "galaxy-star" {
                layer.fill(fourPointStar(center: CGPoint(x: cx, y: cy), r: 9), with: .color(Color(hex: 0xFFF9C4)))
            }
        }

        let lashColor = Color(hex: state.mascaraCoverage > 0.05 ? state.mascaraColor : 0x2B2129)
        var lid = Path()
        lid.move(to: CGPoint(x: cx - 29, y: cy + 2))
        lid.addCurve(to: CGPoint(x: cx + 29, y: cy + 2), control1: CGPoint(x: cx - 20, y: cy - 21), control2: CGPoint(x: cx + 20, y: cy - 21))
        ctx.stroke(lid, with: .color(lashColor), style: StrokeStyle(lineWidth: 3.6, lineCap: .round))

        if state.eyelinerStyle != .none && state.eyelinerCoverage > 0.05 {
            let dir: CGFloat = isLeft ? -1 : 1
            let wingY: CGFloat = state.eyelinerStyle == .puppy ? cy + 7 : (state.eyelinerStyle == .cat ? cy - 12 : cy - 7)
            var liner = Path()
            liner.move(to: CGPoint(x: cx + dir * 41, y: wingY))
            liner.addQuadCurve(to: CGPoint(x: cx + dir * 18, y: cy - 11), control: CGPoint(x: cx + dir * 28, y: cy + 3))
            liner.addCurve(to: CGPoint(x: cx - dir * 28, y: cy + 1), control1: CGPoint(x: cx + dir * 2, y: cy - 22), control2: CGPoint(x: cx - dir * 18, y: cy - 20))
            ctx.stroke(liner, with: .color(Color(hex: state.eyelinerColor, opacity: max(0.3, state.eyelinerCoverage))), style: StrokeStyle(lineWidth: 5, lineCap: .round))
        }

        let lashScale: CGFloat = 1 + (state.mascaraStyle == .natural ? 0 : CGFloat(state.mascaraCoverage) * 0.5)
        let offsets: [CGFloat] = (state.mascaraStyle == .princess || state.mascaraStyle == .butterfly) ? [-24, -18, -12, -5, 2, 9, 16, 22] : [-18, -8, 4, 15]
        for dx in offsets {
            let xb = cx + (isLeft ? dx : -dx)
            let norm = dx / 28
            let yb = cy - sqrt(max(0, 1 - norm * norm)) * 16 + 1
            let len = (7 + (state.mascaraStyle == .natural ? 0 : 5)) * lashScale
            let fan: CGFloat = (isLeft ? -1 : 1) * (dx < 0 ? 7 : 3)
            var l = Path(); l.move(to: CGPoint(x: xb, y: yb)); l.addQuadCurve(to: CGPoint(x: xb + fan, y: yb - len), control: CGPoint(x: xb + fan * 0.5, y: yb - len * 0.7))
            ctx.stroke(l, with: .color(lashColor), style: StrokeStyle(lineWidth: 3.1, lineCap: .round))
        }
    }

    private static func drawEyebrow(ctx: inout GraphicsContext, isLeft: Bool, style: EyebrowStyleId, colorHex: UInt32) {
        var p = Path()
        if isLeft {
            p.move(to: CGPoint(x: 206, y: 286))
            p.addQuadCurve(to: CGPoint(x: 278, y: 282), control: CGPoint(x: 242, y: style == .sweetStraight ? 277 : 268))
        } else {
            p.move(to: CGPoint(x: 322, y: 282))
            p.addQuadCurve(to: CGPoint(x: 394, y: 286), control: CGPoint(x: 358, y: style == .sweetStraight ? 277 : 268))
        }
        ctx.stroke(p, with: .color(Color(hex: colorHex)), style: StrokeStyle(lineWidth: 6.5, lineCap: .round))
    }

    private static func drawOutfitBodyAndSkirt(ctx: inout GraphicsContext, outfit: OutfitId, theme: OutfitColorTheme) {
        let main = GraphicsContext.Shading.linearGradient(Gradient(colors: [Color(hex: theme.secondary), Color(hex: theme.primary), Color(hex: theme.accent)]), startPoint: CGPoint(x: 300, y: 520), endPoint: CGPoint(x: 300, y: 800))
        let soft = GraphicsContext.Shading.linearGradient(Gradient(colors: [Color(hex: theme.trim), Color(hex: theme.secondary)]), startPoint: CGPoint(x: 180, y: 540), endPoint: CGPoint(x: 420, y: 780))
        let strokeColor = Color(hex: theme.accent)

        func fittedBodice(neckY: CGFloat = 562, dipY: CGFloat = 576) -> Path {
            var p = Path()
            p.move(to: CGPoint(x: 202, y: neckY))
            p.addCurve(to: CGPoint(x: 300, y: dipY), control1: CGPoint(x: 234, y: neckY - 12), control2: CGPoint(x: 272, y: dipY))
            p.addCurve(to: CGPoint(x: 398, y: neckY), control1: CGPoint(x: 328, y: dipY), control2: CGPoint(x: 366, y: neckY - 12))
            p.addLine(to: CGPoint(x: 394, y: 594))
            p.addCurve(to: CGPoint(x: 375, y: 668), control1: CGPoint(x: 388, y: 622), control2: CGPoint(x: 380, y: 646))
            p.addQuadCurve(to: CGPoint(x: 225, y: 668), control: CGPoint(x: 300, y: 680))
            p.addCurve(to: CGPoint(x: 206, y: 594), control1: CGPoint(x: 220, y: 646), control2: CGPoint(x: 212, y: 622))
            p.closeSubpath()
            return p
        }

        func flaredSkirt(hemSpread: CGFloat = 146) -> Path {
            var p = Path()
            p.move(to: CGPoint(x: 225, y: 666))
            p.addQuadCurve(to: CGPoint(x: 375, y: 666), control: CGPoint(x: 300, y: 678))
            p.addCurve(to: CGPoint(x: 600 - hemSpread, y: 800), control1: CGPoint(x: 408, y: 710), control2: CGPoint(x: 600 - hemSpread - 10, y: 756))
            p.addLine(to: CGPoint(x: hemSpread, y: 800))
            p.addCurve(to: CGPoint(x: 225, y: 666), control1: CGPoint(x: hemSpread + 10, y: 756), control2: CGPoint(x: 192, y: 710))
            p.closeSubpath()
            return p
        }

        switch outfit {
        case .princessGown:
            let sk = flaredSkirt(hemSpread: 138)
            ctx.fill(sk, with: main); ctx.stroke(sk, with: .color(strokeColor), lineWidth: 2.8)
            let bod = fittedBodice(neckY: 558, dipY: 574)
            ctx.fill(bod, with: main); ctx.stroke(bod, with: .color(strokeColor), lineWidth: 2.8)
            ctx.fill(Path(ellipseIn: CGRect(x: 289, y: 571, width: 22, height: 22)), with: .color(Color(hex: theme.trim)))
        case .fairyTulle:
            var s1 = Path(); s1.move(to: CGPoint(x: 226, y: 524)); s1.addLine(to: CGPoint(x: 234, y: 566))
            var s2 = Path(); s2.move(to: CGPoint(x: 374, y: 524)); s2.addLine(to: CGPoint(x: 366, y: 566))
            ctx.stroke(s1, with: .color(Color(hex: theme.primary)), style: StrokeStyle(lineWidth: 8, lineCap: .round))
            ctx.stroke(s2, with: .color(Color(hex: theme.primary)), style: StrokeStyle(lineWidth: 8, lineCap: .round))
            let sk = flaredSkirt(hemSpread: 142)
            ctx.fill(sk, with: main); ctx.stroke(sk, with: .color(strokeColor), lineWidth: 2.8)
            let bod = fittedBodice(neckY: 564, dipY: 578)
            ctx.fill(bod, with: main); ctx.stroke(bod, with: .color(strokeColor), lineWidth: 2.8)
        case .pastelSailor:
            let sk = flaredSkirt(hemSpread: 162)
            ctx.fill(sk, with: main); ctx.stroke(sk, with: .color(strokeColor), lineWidth: 2.8)
            var blouse = Path()
            blouse.move(to: CGPoint(x: 266, y: 508)); blouse.addLine(to: CGPoint(x: 300, y: 558)); blouse.addLine(to: CGPoint(x: 334, y: 508))
            blouse.addCurve(to: CGPoint(x: 416, y: 542), control1: CGPoint(x: 364, y: 516), control2: CGPoint(x: 400, y: 524))
            blouse.addLine(to: CGPoint(x: 394, y: 594)); blouse.addLine(to: CGPoint(x: 376, y: 668))
            blouse.addQuadCurve(to: CGPoint(x: 224, y: 668), control: CGPoint(x: 300, y: 678))
            blouse.addLine(to: CGPoint(x: 206, y: 594)); blouse.addLine(to: CGPoint(x: 184, y: 542))
            blouse.addCurve(to: CGPoint(x: 266, y: 508), control1: CGPoint(x: 200, y: 524), control2: CGPoint(x: 236, y: 516))
            blouse.closeSubpath()
            ctx.fill(blouse, with: .color(.white))
            ctx.stroke(blouse, with: .color(Color(hex: theme.secondary)), lineWidth: 2.5)
        case .starHoodie:
            var mini = Path(); mini.move(to: CGPoint(x: 204, y: 722)); mini.addLine(to: CGPoint(x: 396, y: 722)); mini.addLine(to: CGPoint(x: 418, y: 800)); mini.addLine(to: CGPoint(x: 182, y: 800)); mini.closeSubpath()
            ctx.fill(mini, with: soft); ctx.stroke(mini, with: .color(strokeColor), lineWidth: 2.8)
            var torso = Path()
            torso.move(to: CGPoint(x: 264, y: 506)); torso.addQuadCurve(to: CGPoint(x: 336, y: 506), control: CGPoint(x: 300, y: 534))
            torso.addCurve(to: CGPoint(x: 418, y: 542), control1: CGPoint(x: 366, y: 514), control2: CGPoint(x: 402, y: 524))
            torso.addLine(to: CGPoint(x: 396, y: 602)); torso.addLine(to: CGPoint(x: 400, y: 724))
            torso.addQuadCurve(to: CGPoint(x: 200, y: 724), control: CGPoint(x: 300, y: 740))
            torso.addLine(to: CGPoint(x: 204, y: 602)); torso.addLine(to: CGPoint(x: 182, y: 542))
            torso.addCurve(to: CGPoint(x: 264, y: 506), control1: CGPoint(x: 198, y: 524), control2: CGPoint(x: 234, y: 514))
            torso.closeSubpath()
            ctx.fill(torso, with: main); ctx.stroke(torso, with: .color(strokeColor), lineWidth: 2.8)
            ctx.fill(fivePointStar(center: CGPoint(x: 300, y: 636), r: 34), with: .color(Color(hex: 0xFFF9C4)))
        case .butterflyDress, .royalVelvet, .mermaidTop:
            let sk = flaredSkirt(hemSpread: outfit == .mermaidTop ? 172 : 146)
            ctx.fill(sk, with: main); ctx.stroke(sk, with: .color(strokeColor), lineWidth: 2.8)
            let bod = fittedBodice(neckY: outfit == .royalVelvet ? 572 : 562, dipY: 578)
            ctx.fill(bod, with: main); ctx.stroke(bod, with: .color(strokeColor), lineWidth: 2.8)
            ctx.fill(Path(roundedRect: CGRect(x: 222, y: 660, width: 156, height: 16), cornerRadius: 8), with: .color(Color(hex: theme.trim)))
        case .blossomKimono:
            var kb = Path()
            kb.move(to: CGPoint(x: 266, y: 506)); kb.addLine(to: CGPoint(x: 300, y: 578)); kb.addLine(to: CGPoint(x: 334, y: 506))
            kb.addCurve(to: CGPoint(x: 418, y: 542), control1: CGPoint(x: 364, y: 514), control2: CGPoint(x: 400, y: 524))
            kb.addLine(to: CGPoint(x: 394, y: 596)); kb.addLine(to: CGPoint(x: 382, y: 668)); kb.addLine(to: CGPoint(x: 412, y: 800))
            kb.addLine(to: CGPoint(x: 188, y: 800)); kb.addLine(to: CGPoint(x: 218, y: 668)); kb.addLine(to: CGPoint(x: 206, y: 596)); kb.addLine(to: CGPoint(x: 182, y: 542))
            kb.addCurve(to: CGPoint(x: 266, y: 506), control1: CGPoint(x: 200, y: 524), control2: CGPoint(x: 236, y: 514))
            kb.closeSubpath()
            ctx.fill(kb, with: main); ctx.stroke(kb, with: .color(strokeColor), lineWidth: 2.8)
            ctx.fill(Path(roundedRect: CGRect(x: 216, y: 640, width: 168, height: 56), cornerRadius: 10), with: soft)
            drawSticker(ctx: &ctx, type: .sakura, at: CGPoint(x: 246, y: 748), scale: 1, rotationDeg: 0)
            drawSticker(ctx: &ctx, type: .sakura, at: CGPoint(x: 354, y: 742), scale: 1, rotationDeg: 0)
        }
    }

    private static func drawOutfitSleevesAndTopDetails(ctx: inout GraphicsContext, outfit: OutfitId, theme: OutfitColorTheme) {
        let main = GraphicsContext.Shading.linearGradient(Gradient(colors: [Color(hex: theme.secondary), Color(hex: theme.primary), Color(hex: theme.accent)]), startPoint: CGPoint(x: 300, y: 520), endPoint: CGPoint(x: 300, y: 760))
        let soft = GraphicsContext.Shading.linearGradient(Gradient(colors: [Color(hex: theme.trim), Color(hex: theme.secondary)]), startPoint: CGPoint(x: 150, y: 520), endPoint: CGPoint(x: 450, y: 680))
        let strokeColor = Color(hex: theme.accent)

        switch outfit {
        case .princessGown, .butterflyDress:
            var lp = Path(); lp.move(to: CGPoint(x: 204, y: 536)); lp.addCurve(to: CGPoint(x: 144, y: 582), control1: CGPoint(x: 176, y: 514), control2: CGPoint(x: 138, y: 536)); lp.addCurve(to: CGPoint(x: 198, y: 594), control1: CGPoint(x: 148, y: 606), control2: CGPoint(x: 178, y: 612)); lp.closeSubpath()
            var rp = Path(); rp.move(to: CGPoint(x: 396, y: 536)); rp.addCurve(to: CGPoint(x: 456, y: 582), control1: CGPoint(x: 424, y: 514), control2: CGPoint(x: 462, y: 536)); rp.addCurve(to: CGPoint(x: 402, y: 594), control1: CGPoint(x: 452, y: 606), control2: CGPoint(x: 422, y: 612)); rp.closeSubpath()
            ctx.fill(lp, with: soft); ctx.stroke(lp, with: .color(strokeColor), lineWidth: 2.8)
            ctx.fill(rp, with: soft); ctx.stroke(rp, with: .color(strokeColor), lineWidth: 2.8)
        case .pastelSailor:
            var ls = Path(); ls.move(to: CGPoint(x: 192, y: 534)); ls.addCurve(to: CGPoint(x: 144, y: 614), control1: CGPoint(x: 168, y: 548), control2: CGPoint(x: 150, y: 582)); ls.addLine(to: CGPoint(x: 182, y: 622)); ls.addLine(to: CGPoint(x: 206, y: 566)); ls.closeSubpath()
            var rs = Path(); rs.move(to: CGPoint(x: 408, y: 534)); rs.addCurve(to: CGPoint(x: 456, y: 614), control1: CGPoint(x: 432, y: 548), control2: CGPoint(x: 450, y: 582)); rs.addLine(to: CGPoint(x: 418, y: 622)); rs.addLine(to: CGPoint(x: 394, y: 566)); rs.closeSubpath()
            ctx.fill(ls, with: .color(.white)); ctx.stroke(ls, with: .color(strokeColor), lineWidth: 2.5)
            ctx.fill(rs, with: .color(.white)); ctx.stroke(rs, with: .color(strokeColor), lineWidth: 2.5)
            var col = Path()
            col.move(to: CGPoint(x: 264, y: 508)); col.addLine(to: CGPoint(x: 300, y: 598)); col.addLine(to: CGPoint(x: 336, y: 508))
            col.addCurve(to: CGPoint(x: 414, y: 544), control1: CGPoint(x: 366, y: 516), control2: CGPoint(x: 398, y: 526))
            col.addLine(to: CGPoint(x: 372, y: 608)); col.addLine(to: CGPoint(x: 300, y: 598)); col.addLine(to: CGPoint(x: 228, y: 608)); col.addLine(to: CGPoint(x: 186, y: 544))
            col.addCurve(to: CGPoint(x: 264, y: 508), control1: CGPoint(x: 202, y: 526), control2: CGPoint(x: 234, y: 516)); col.closeSubpath()
            ctx.fill(col, with: main); ctx.stroke(col, with: .color(strokeColor), lineWidth: 2.5)
            ctx.fill(Path(ellipseIn: CGRect(x: 288, y: 588, width: 24, height: 24)), with: .color(strokeColor))
        case .starHoodie:
            var ls = Path()
            ls.move(to: CGPoint(x: 188, y: 536)); ls.addCurve(to: CGPoint(x: 136, y: 648), control1: CGPoint(x: 158, y: 562), control2: CGPoint(x: 138, y: 608))
            ls.addCurve(to: CGPoint(x: 164, y: 740), control1: CGPoint(x: 134, y: 682), control2: CGPoint(x: 148, y: 714)); ls.addLine(to: CGPoint(x: 196, y: 734))
            ls.addCurve(to: CGPoint(x: 176, y: 648), control1: CGPoint(x: 184, y: 706), control2: CGPoint(x: 174, y: 674))
            ls.addCurve(to: CGPoint(x: 206, y: 590), control1: CGPoint(x: 178, y: 622), control2: CGPoint(x: 194, y: 602)); ls.closeSubpath()
            var rs = Path()
            rs.move(to: CGPoint(x: 412, y: 536)); rs.addCurve(to: CGPoint(x: 464, y: 648), control1: CGPoint(x: 442, y: 562), control2: CGPoint(x: 462, y: 608))
            rs.addCurve(to: CGPoint(x: 436, y: 740), control1: CGPoint(x: 466, y: 682), control2: CGPoint(x: 452, y: 714)); rs.addLine(to: CGPoint(x: 404, y: 734))
            rs.addCurve(to: CGPoint(x: 424, y: 648), control1: CGPoint(x: 416, y: 706), control2: CGPoint(x: 426, y: 674))
            rs.addCurve(to: CGPoint(x: 394, y: 590), control1: CGPoint(x: 422, y: 622), control2: CGPoint(x: 406, y: 602)); rs.closeSubpath()
            ctx.fill(ls, with: main); ctx.stroke(ls, with: .color(strokeColor), lineWidth: 2.8)
            ctx.fill(rs, with: main); ctx.stroke(rs, with: .color(strokeColor), lineWidth: 2.8)
        case .royalVelvet:
            var fur = Path()
            fur.move(to: CGPoint(x: 164, y: 584))
            fur.addCurve(to: CGPoint(x: 300, y: 576), control1: CGPoint(x: 208, y: 564), control2: CGPoint(x: 256, y: 576))
            fur.addCurve(to: CGPoint(x: 436, y: 584), control1: CGPoint(x: 344, y: 576), control2: CGPoint(x: 392, y: 564))
            ctx.stroke(fur, with: .color(Color(hex: 0xFFFDF7)), style: StrokeStyle(lineWidth: 16, lineCap: .round))
        case .blossomKimono:
            var ls = Path(); ls.move(to: CGPoint(x: 190, y: 536)); ls.addCurve(to: CGPoint(x: 134, y: 654), control1: CGPoint(x: 160, y: 560), control2: CGPoint(x: 138, y: 606)); ls.addLine(to: CGPoint(x: 156, y: 724)); ls.addLine(to: CGPoint(x: 200, y: 700)); ls.addLine(to: CGPoint(x: 206, y: 594)); ls.closeSubpath()
            var rs = Path(); rs.move(to: CGPoint(x: 410, y: 536)); rs.addCurve(to: CGPoint(x: 466, y: 654), control1: CGPoint(x: 440, y: 560), control2: CGPoint(x: 462, y: 606)); rs.addLine(to: CGPoint(x: 444, y: 724)); rs.addLine(to: CGPoint(x: 400, y: 700)); rs.addLine(to: CGPoint(x: 394, y: 594)); rs.closeSubpath()
            ctx.fill(ls, with: main); ctx.stroke(ls, with: .color(strokeColor), lineWidth: 2.8)
            ctx.fill(rs, with: main); ctx.stroke(rs, with: .color(strokeColor), lineWidth: 2.8)
        case .fairyTulle, .mermaidTop:
            break
        }
    }

    private static func drawEarrings(ctx: inout GraphicsContext, earring: EarringId) {
        guard earring != .none else { return }
        for x in [CGFloat(183), CGFloat(417)] {
            let y: CGFloat = 360
            switch earring {
            case .pearlDrops:
                ctx.fill(Path(ellipseIn: CGRect(x: x - 9, y: y + 10, width: 18, height: 18)), with: .color(Color(hex: 0xFFFDF9)))
            case .starStuds:
                ctx.fill(fivePointStar(center: CGPoint(x: x, y: y + 10), r: 12), with: .color(Color(hex: 0xFDE047)))
            case .heartHoops:
                drawSticker(ctx: &ctx, type: .pinkHeart, at: CGPoint(x: x, y: y + 14), scale: 0.9, rotationDeg: 0)
            case .crystalDrops:
                drawSticker(ctx: &ctx, type: .diamond, at: CGPoint(x: x, y: y + 16), scale: 0.9, rotationDeg: 0)
            case .sakuraDrops:
                drawSticker(ctx: &ctx, type: .sakura, at: CGPoint(x: x, y: y + 14), scale: 0.95, rotationDeg: 0)
            case .butterflyStuds:
                drawSticker(ctx: &ctx, type: .butterfly, at: CGPoint(x: x, y: y + 12), scale: 0.85, rotationDeg: 0)
            case .none: break
            }
        }
    }

    private static func drawNecklace(ctx: inout GraphicsContext, necklace: NecklaceId) {
        guard necklace != .none else { return }
        var curve = Path(); curve.move(to: CGPoint(x: 254, y: 500)); curve.addQuadCurve(to: CGPoint(x: 346, y: 500), control: CGPoint(x: 300, y: 544))
        switch necklace {
        case .pearlChoker:
            for dx in stride(from: -42, through: 42, by: 14) {
                let cx = 300 + CGFloat(dx)
                let cy = 502 + CGFloat(cos(Double(dx) * 0.032)) * 14
                ctx.fill(Path(ellipseIn: CGRect(x: cx - 7.5, y: cy - 7.5, width: 15, height: 15)), with: .color(Color(hex: 0xFFFDF9)))
            }
        case .heartPendant:
            ctx.stroke(curve, with: .color(Color(hex: 0xFBBF24)), lineWidth: 3.5)
            drawSticker(ctx: &ctx, type: .pinkHeart, at: CGPoint(x: 300, y: 534), scale: 1.15, rotationDeg: 0)
        case .starGem:
            ctx.stroke(curve, with: .color(Color(hex: 0xE2E8F0)), lineWidth: 3)
            ctx.fill(fivePointStar(center: CGPoint(x: 300, y: 534), r: 16), with: .color(Color(hex: 0x38BDF8)))
        case .ribbonChoker:
            ctx.stroke(curve, with: .color(Color(hex: 0xEC4899)), style: StrokeStyle(lineWidth: 10, lineCap: .round))
            drawSticker(ctx: &ctx, type: .candyBow, at: CGPoint(x: 300, y: 522), scale: 1.15, rotationDeg: 0)
        case .flowerGarland:
            ctx.stroke(curve, with: .color(Color(hex: 0x34D399)), lineWidth: 3.5)
            for dx in stride(from: -32, through: 32, by: 16) {
                drawSticker(ctx: &ctx, type: .sakura, at: CGPoint(x: 300 + CGFloat(dx), y: 512 + CGFloat(cos(Double(dx) * 0.04)) * 14), scale: 0.78, rotationDeg: 0)
            }
        case .royalCollar:
            ctx.stroke(curve, with: .color(Color(hex: 0xF59E0B)), lineWidth: 6)
            drawSticker(ctx: &ctx, type: .diamond, at: CGPoint(x: 300, y: 532), scale: 1, rotationDeg: 0)
        case .none: break
        }
    }

    private static func drawGlasses(ctx: inout GraphicsContext, glasses: GlassesId) {
        guard glasses != .none else { return }
        var bridge = Path(); bridge.move(to: CGPoint(x: 280, y: 322)); bridge.addLine(to: CGPoint(x: 320, y: 322))
        switch glasses {
        case .heartShades:
            ctx.stroke(bridge, with: .color(Color(hex: 0xFF4D9E)), lineWidth: 5)
            for cx in [CGFloat(242), CGFloat(358)] {
                let h = heartPath(center: CGPoint(x: cx, y: 326), s: 28)
                ctx.fill(h, with: .color(Color(hex: 0xFF8AC6, opacity: 0.45)))
                ctx.stroke(h, with: .color(Color(hex: 0xFF4D9E)), lineWidth: 5)
            }
        case .starGlasses:
            ctx.stroke(bridge, with: .color(Color(hex: 0xF59E0B)), lineWidth: 5)
            for cx in [CGFloat(242), CGFloat(358)] {
                let s = fivePointStar(center: CGPoint(x: cx, y: 326), r: 32)
                ctx.fill(s, with: .color(Color(hex: 0xFEF08A, opacity: 0.42)))
                ctx.stroke(s, with: .color(Color(hex: 0xF59E0B)), lineWidth: 4.5)
            }
        case .roundPastel, .catEyeGlam:
            let col = glasses == .roundPastel ? Color(hex: 0xA855F7) : Color(hex: 0xDB2777)
            ctx.stroke(bridge, with: .color(col), lineWidth: 5)
            for cx in [CGFloat(244), CGFloat(356)] {
                let c = Path(ellipseIn: CGRect(x: cx - 36, y: 290, width: 72, height: 72))
                ctx.fill(c, with: .color(col.opacity(0.25)))
                ctx.stroke(c, with: .color(col), lineWidth: 5)
            }
        case .none: break
        }
    }

    private static func drawHeadwear(ctx: inout GraphicsContext, headwear: HeadwearId) {
        guard headwear != .none else { return }
        switch headwear {
        case .crystalTiara:
            var t = Path()
            t.move(to: CGPoint(x: 222, y: 182)); t.addQuadCurve(to: CGPoint(x: 378, y: 182), control: CGPoint(x: 300, y: 168))
            t.addLine(to: CGPoint(x: 364, y: 146)); t.addLine(to: CGPoint(x: 336, y: 166)); t.addLine(to: CGPoint(x: 322, y: 130))
            t.addLine(to: CGPoint(x: 300, y: 156)); t.addLine(to: CGPoint(x: 278, y: 130)); t.addLine(to: CGPoint(x: 264, y: 166))
            t.addLine(to: CGPoint(x: 236, y: 146)); t.closeSubpath()
            ctx.fill(t, with: .color(Color(hex: 0xFDE047)))
            ctx.stroke(t, with: .color(Color(hex: 0xD97706)), lineWidth: 3)
            ctx.fill(Path(ellipseIn: CGRect(x: 291, y: 129, width: 18, height: 18)), with: .color(Color(hex: 0xFF4D9E)))
        case .flowerCrown:
            for pt in [CGPoint(x: 228, y: 186), CGPoint(x: 262, y: 174), CGPoint(x: 300, y: 168), CGPoint(x: 338, y: 174), CGPoint(x: 372, y: 186)] {
                drawSticker(ctx: &ctx, type: .sakura, at: pt, scale: 1.35, rotationDeg: 0)
            }
        case .catEars:
            var l = Path(); l.move(to: CGPoint(x: 200, y: 176)); l.addLine(to: CGPoint(x: 182, y: 106)); l.addLine(to: CGPoint(x: 254, y: 148)); l.closeSubpath()
            var r = Path(); r.move(to: CGPoint(x: 400, y: 176)); r.addLine(to: CGPoint(x: 418, y: 106)); r.addLine(to: CGPoint(x: 346, y: 148)); r.closeSubpath()
            ctx.fill(l, with: .color(Color(hex: 0xFF6BB5))); ctx.stroke(l, with: .color(.white), lineWidth: 3.5)
            ctx.fill(r, with: .color(Color(hex: 0xFF6BB5))); ctx.stroke(r, with: .color(.white), lineWidth: 3.5)
        case .velvetBow:
            ctx.fill(Path(ellipseIn: CGRect(x: 210, y: 124, width: 84, height: 62)), with: .color(Color(hex: 0xFF4D9E)))
            ctx.fill(Path(ellipseIn: CGRect(x: 306, y: 124, width: 84, height: 62)), with: .color(Color(hex: 0xFF4D9E)))
            ctx.fill(Path(roundedRect: CGRect(x: 285, y: 140, width: 30, height: 30), cornerRadius: 10), with: .color(Color(hex: 0xDB2777)))
        case .butterflyClips:
            drawSticker(ctx: &ctx, type: .butterfly, at: CGPoint(x: 210, y: 204), scale: 1.55, rotationDeg: -18)
            drawSticker(ctx: &ctx, type: .butterfly, at: CGPoint(x: 390, y: 204), scale: 1.55, rotationDeg: 18)
        case .starHalo:
            ctx.stroke(Path(ellipseIn: CGRect(x: 226, y: 110, width: 148, height: 36)), with: .color(Color(hex: 0xFDE047)), lineWidth: 7)
            ctx.fill(fourPointStar(center: CGPoint(x: 300, y: 110), r: 12), with: .color(Color(hex: 0xFFF9C4)))
        case .pearlBand:
            for dx in stride(from: -88, through: 88, by: 22) {
                let cy = 194 - CGFloat(cos(Double(dx) * 0.017)) * 34
                let p = Path(ellipseIn: CGRect(x: 300 + CGFloat(dx) - 10.5, y: cy - 10.5, width: 21, height: 21))
                ctx.fill(p, with: .color(Color(hex: 0xFFFDF9)))
                ctx.stroke(p, with: .color(Color(hex: 0xFBCFE8)), lineWidth: 2)
            }
        case .none: break
        }
    }

    public static func drawSticker(ctx: inout GraphicsContext, type: StickerTypeId, at pt: CGPoint, scale: CGFloat, rotationDeg: Double) {
        ctx.drawLayer { layer in
            layer.translateBy(x: pt.x, y: pt.y)
            layer.rotate(by: .degrees(rotationDeg))
            layer.scaleBy(x: scale, y: scale)
            switch type {
            case .starGem:
                let s = fivePointStar(center: .zero, r: 14)
                layer.fill(s, with: .color(Color(hex: 0xFDE047)))
                layer.stroke(s, with: .color(.white), lineWidth: 1.8)
            case .pinkHeart:
                let h = heartPath(center: .zero, s: 13)
                layer.fill(h, with: .color(Color(hex: 0xFF5CA8)))
                layer.stroke(h, with: .color(.white), lineWidth: 1.8)
            case .crystalDrop, .diamond:
                var d = Path()
                d.move(to: CGPoint(x: 0, y: -14)); d.addLine(to: CGPoint(x: 11, y: 0))
                d.addLine(to: CGPoint(x: 0, y: 14)); d.addLine(to: CGPoint(x: -11, y: 0)); d.closeSubpath()
                layer.fill(d, with: .color(Color(hex: 0x7DD3FC)))
                layer.stroke(d, with: .color(.white), lineWidth: 1.8)
            case .butterfly:
                layer.fill(Path(ellipseIn: CGRect(x: -16, y: -10, width: 16, height: 12)), with: .color(Color(hex: 0xC084FC)))
                layer.fill(Path(ellipseIn: CGRect(x: 0, y: -10, width: 16, height: 12)), with: .color(Color(hex: 0xC084FC)))
                layer.fill(Path(ellipseIn: CGRect(x: -12, y: 1, width: 12, height: 10)), with: .color(Color(hex: 0xFF8AC6)))
                layer.fill(Path(ellipseIn: CGRect(x: 0, y: 1, width: 12, height: 10)), with: .color(Color(hex: 0xFF8AC6)))
            case .sakura:
                for i in 0..<5 {
                    layer.drawLayer { pet in
                        pet.rotate(by: .degrees(Double(i) * 72))
                        pet.fill(Path(ellipseIn: CGRect(x: -4.5, y: -14, width: 9, height: 13)), with: .color(Color(hex: 0xFFB3D9)))
                    }
                }
                layer.fill(Path(ellipseIn: CGRect(x: -3.6, y: -3.6, width: 7.2, height: 7.2)), with: .color(Color(hex: 0xFDE047)))
            case .rainbow:
                var a1 = Path(); a1.addArc(center: CGPoint(x: 0, y: 6), radius: 14, startAngle: .degrees(180), endAngle: .degrees(360), clockwise: false)
                var a2 = Path(); a2.addArc(center: CGPoint(x: 0, y: 6), radius: 10, startAngle: .degrees(180), endAngle: .degrees(360), clockwise: false)
                layer.stroke(a1, with: .color(Color(hex: 0xFF6B9E)), style: StrokeStyle(lineWidth: 4, lineCap: .round))
                layer.stroke(a2, with: .color(Color(hex: 0x38BDF8)), style: StrokeStyle(lineWidth: 4, lineCap: .round))
            case .moon:
                layer.fill(Path(ellipseIn: CGRect(x: -11, y: -11, width: 22, height: 22)), with: .color(Color(hex: 0xFDE047)))
            case .freckles:
                for fp in [CGPoint(x: -10, y: -2), CGPoint(x: 0, y: 4), CGPoint(x: 10, y: -3)] {
                    layer.fill(Path(ellipseIn: CGRect(x: fp.x - 3, y: fp.y - 3, width: 6, height: 6)), with: .color(Color(hex: 0xFBBF24)))
                }
            case .pearls:
                for pp in [CGPoint(x: -8, y: 2), CGPoint(x: 0, y: -5), CGPoint(x: 8, y: 2)] {
                    layer.fill(Path(ellipseIn: CGRect(x: pp.x - 5, y: pp.y - 5, width: 10, height: 10)), with: .color(Color(hex: 0xFFFDF9)))
                }
            case .candyBow:
                layer.fill(Path(ellipseIn: CGRect(x: -14, y: -7, width: 14, height: 14)), with: .color(Color(hex: 0xFF6BB5)))
                layer.fill(Path(ellipseIn: CGRect(x: 0, y: -7, width: 14, height: 14)), with: .color(Color(hex: 0xFF6BB5)))
                layer.fill(Path(ellipseIn: CGRect(x: -4, y: -4, width: 8, height: 8)), with: .color(Color(hex: 0xFDE047)))
            case .sparkleDust:
                layer.fill(fourPointStar(center: .zero, r: 13), with: .color(Color(hex: 0xFFF9C4)))
            }
        }
    }

    private static func drawPhotoFrame(ctx: inout GraphicsContext, frame: FrameId, characterName: String) {
        guard frame != .none else { return }
        switch frame {
        case .polaroidCute:
            ctx.fill(Path(CGRect(x: 0, y: 0, width: 600, height: 30)), with: .color(Color(hex: 0xFFFDF9)))
            ctx.fill(Path(CGRect(x: 0, y: 684, width: 600, height: 116)), with: .color(Color(hex: 0xFFFDF9)))
            ctx.fill(Path(CGRect(x: 0, y: 0, width: 30, height: 800)), with: .color(Color(hex: 0xFFFDF9)))
            ctx.fill(Path(CGRect(x: 570, y: 0, width: 30, height: 800)), with: .color(Color(hex: 0xFFFDF9)))
            ctx.draw(Text("✦ \(characterName) • Starlight Studio ✦").font(.system(size: 30, weight: .bold, design: .rounded)).foregroundColor(Color(hex: 0xEC4899)), at: CGPoint(x: 300, y: 744))
        case .royalGold:
            ctx.stroke(Path(roundedRect: CGRect(x: 14, y: 14, width: 572, height: 772), cornerRadius: 28), with: .color(Color(hex: 0xF59E0B)), lineWidth: 14)
            ctx.stroke(Path(roundedRect: CGRect(x: 28, y: 28, width: 544, height: 744), cornerRadius: 20), with: .color(Color(hex: 0xFEF08A)), lineWidth: 4)
        case .magazineStar:
            ctx.fill(Path(CGRect(x: 0, y: 0, width: 600, height: 102)), with: .color(Color(hex: 0xEC4899, opacity: 0.86)))
            ctx.draw(Text("STARLIGHT").font(.system(size: 52, weight: .heavy, design: .rounded)).foregroundColor(.white), at: CGPoint(x: 300, y: 54))
        case .sparkleHearts:
            ctx.stroke(Path(roundedRect: CGRect(x: 16, y: 16, width: 568, height: 768), cornerRadius: 32), with: .color(Color(hex: 0xFF8AC6)), lineWidth: 12)
            for pt in [CGPoint(x: 48, y: 56), CGPoint(x: 552, y: 56), CGPoint(x: 48, y: 744), CGPoint(x: 552, y: 744)] {
                drawSticker(ctx: &ctx, type: .pinkHeart, at: pt, scale: 1.35, rotationDeg: 0)
            }
        case .none: break
        }
    }

    public static func drawToolCursor(
        ctx: inout GraphicsContext,
        at pt: CGPoint,
        isSpa: Bool,
        makeupTool: MakeupToolId,
        spaTool: SpaToolId,
        colorHex: UInt32
    ) {
        ctx.drawLayer { layer in
            layer.translateBy(x: pt.x, y: pt.y)
            layer.fill(Path(ellipseIn: CGRect(x: -14, y: -14, width: 28, height: 28)), with: .color(.white.opacity(0.35)))
            layer.rotate(by: .degrees(36))
            if isSpa || makeupTool == .remover {
                let p = Path(ellipseIn: CGRect(x: -22, y: -22, width: 44, height: 44))
                layer.fill(p, with: .color(spaTool == .mask && isSpa ? Color(hex: 0xA7F3D0, opacity: 0.92) : .white.opacity(0.92)))
                layer.stroke(p, with: .color(Color(hex: 0x7DD3FC)), lineWidth: 3)
            } else if makeupTool == .lipstick {
                layer.fill(Path(roundedRect: CGRect(x: -4, y: -9, width: 32, height: 18), cornerRadius: 6), with: .color(Color(hex: colorHex)))
                layer.fill(Path(CGRect(x: 26, y: -11, width: 16, height: 22)), with: .color(Color(hex: 0xFDE047)))
                layer.fill(Path(roundedRect: CGRect(x: 42, y: -12, width: 42, height: 24), cornerRadius: 6), with: .color(Color(hex: 0xFF6BB5)))
            } else {
                layer.fill(Path(ellipseIn: CGRect(x: -7, y: -13, width: 26, height: 26)), with: .color(Color(hex: colorHex)))
                layer.fill(Path(CGRect(x: 18, y: -6, width: 16, height: 12)), with: .color(Color(hex: 0xFDE047)))
                layer.fill(Path(roundedRect: CGRect(x: 34, y: -5, width: 56, height: 10), cornerRadius: 5), with: .color(Color(hex: 0xC084FC)))
            }
        }
    }

    private static func heartPath(center: CGPoint, s: CGFloat) -> Path {
        var p = Path()
        p.move(to: CGPoint(x: center.x, y: center.y + s))
        p.addCurve(to: CGPoint(x: center.x - s * 0.45, y: center.y - s * 0.85), control1: CGPoint(x: center.x - s * 1.25, y: center.y + s * 0.2), control2: CGPoint(x: center.x - s * 1.3, y: center.y - s * 0.8))
        p.addCurve(to: CGPoint(x: center.x, y: center.y - s * 0.4), control1: CGPoint(x: center.x - s * 0.1, y: center.y - s * 0.85), control2: CGPoint(x: center.x, y: center.y - s * 0.55))
        p.addCurve(to: CGPoint(x: center.x + s * 0.45, y: center.y - s * 0.85), control1: CGPoint(x: center.x, y: center.y - s * 0.55), control2: CGPoint(x: center.x + s * 0.1, y: center.y - s * 0.85))
        p.addCurve(to: CGPoint(x: center.x, y: center.y + s), control1: CGPoint(x: center.x + s * 1.3, y: center.y - s * 0.8), control2: CGPoint(x: center.x + s * 1.25, y: center.y + s * 0.2))
        p.closeSubpath()
        return p
    }

    private static func fourPointStar(center: CGPoint, r: CGFloat) -> Path {
        var p = Path()
        p.move(to: CGPoint(x: center.x, y: center.y - r))
        p.addLine(to: CGPoint(x: center.x + r * 0.28, y: center.y - r * 0.28))
        p.addLine(to: CGPoint(x: center.x + r, y: center.y))
        p.addLine(to: CGPoint(x: center.x + r * 0.28, y: center.y + r * 0.28))
        p.addLine(to: CGPoint(x: center.x, y: center.y + r))
        p.addLine(to: CGPoint(x: center.x - r * 0.28, y: center.y + r * 0.28))
        p.addLine(to: CGPoint(x: center.x - r, y: center.y))
        p.addLine(to: CGPoint(x: center.x - r * 0.28, y: center.y - r * 0.28))
        p.closeSubpath()
        return p
    }

    private static func fivePointStar(center: CGPoint, r: CGFloat) -> Path {
        var p = Path()
        for i in 0..<10 {
            let a = -Double.pi / 2 + Double(i) * Double.pi / 5
            let rad = i % 2 == 0 ? r : r * 0.42
            let pt = CGPoint(x: center.x + CGFloat(cos(a)) * rad, y: center.y + CGFloat(sin(a)) * rad)
            if i == 0 { p.move(to: pt) } else { p.addLine(to: pt) }
        }
        p.closeSubpath()
        return p
    }
}
