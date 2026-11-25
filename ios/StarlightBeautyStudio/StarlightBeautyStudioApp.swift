import SwiftUI
import UIKit

@main
struct StarlightBeautyStudioApp: App {
    var body: some Scene {
        WindowGroup {
            StarlightRootView()
        }
    }
}

struct StarlightRootView: View {
    // Default language is English; toggleable to Vietnamese anytime
    @State private var lang: AppLanguage = .en
    @State private var muted: Bool = false
    @State private var screen: ScreenMode = .home
    @State private var previousScreen: ScreenMode = .home

    @State private var selectedModelId: String = BeautyCatalog.characters[0].id
    @State private var makeover: MakeoverState = BeautyCatalog.initialMakeover(characterId: BeautyCatalog.characters[0].id)

    @State private var photos: [SavedPhotoItem] = []
    @State private var latestPhotoUrl: URL? = nil
    @State private var justSaved: Bool = false
    @State private var flashActive: Bool = false

    private var lookbookDir: URL {
        let base = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        let dir = base.appendingPathComponent("Lookbook", isDirectory: true)
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        return dir
    }

    var body: some View {
        Group {
            switch screen {
            case .home:
                HomeView(
                    lang: $lang,
                    muted: $muted,
                    selectedModelId: $selectedModelId,
                    photoCount: photos.count,
                    onStartMakeover: {
                        makeover = BeautyCatalog.initialMakeover(characterId: selectedModelId)
                        latestPhotoUrl = nil
                        screen = .salon
                    },
                    onOpenGallery: {
                        previousScreen = .home
                        screen = .gallery
                    }
                )

            case .gallery:
                GalleryView(
                    lang: lang,
                    photos: photos,
                    onBack: { screen = previousScreen },
                    onDelete: { item in
                        try? FileManager.default.removeItem(at: item.url)
                        photos.removeAll { $0.id == item.id }
                    }
                )

            case .salon, .photoBooth:
                SalonAndPhotoView(
                    lang: $lang,
                    muted: $muted,
                    state: $makeover,
                    isPhotoBooth: screen == .photoBooth,
                    latestPhotoUrl: latestPhotoUrl,
                    justSaved: justSaved,
                    flashActive: flashActive,
                    onBack: {
                        screen = (screen == .photoBooth) ? .salon : .home
                    },
                    onGoPhotoBooth: { screen = .photoBooth },
                    onOpenGallery: {
                        previousScreen = .photoBooth
                        screen = .gallery
                    },
                    onSurprise: applySurprise,
                    onResetFace: resetFace,
                    onSnapPhoto: snapPhoto
                )
            }
        }
        .onAppear {
            loadSavedPhotos()
        }
    }

    private func applySurprise() {
        let lip = BeautyCatalog.lipstickSwatches.randomElement()!.hex
        let shadow = BeautyCatalog.eyeshadowSwatches.randomElement()!.hex
        let blush = BeautyCatalog.blushSwatches.randomElement()!.hex

        makeover.spaGlow = true
        makeover.eyeColorId = BeautyCatalog.eyeLenses.randomElement()!.id
        makeover.eyelinerStyle = EyelinerStyleId.allCases.filter { $0 != .none }.randomElement()!
        makeover.eyelinerCoverage = 1
        makeover.mascaraStyle = MascaraStyleId.allCases.filter { $0 != .natural }.randomElement()!
        makeover.mascaraCoverage = 1
        makeover.hairStyle = HairstyleId.allCases.randomElement()!
        makeover.hairColorId = BeautyCatalog.hairColors.randomElement()!.id
        makeover.hairHighlightEnabled = Bool.random()
        makeover.outfitId = OutfitId.allCases.randomElement()!
        makeover.outfitColorId = BeautyCatalog.outfitColors.randomElement()!.id
        makeover.headwearId = HeadwearId.allCases.randomElement()!
        makeover.earringId = EarringId.allCases.randomElement()!
        makeover.necklaceId = NecklaceId.allCases.randomElement()!
        makeover.wingsId = Bool.random() ? WingsId.allCases.randomElement()! : .none

        makeover.lipDabs = stride(from: -24, through: 24, by: 10).map {
            PaintDab(x: StageGeometry.lipsX + CGFloat($0), y: StageGeometry.lipsY, radius: 24, hex: lip, alpha: 0.85, glitter: true)
        }
        makeover.eyeshadowDabs = [StageGeometry.leftEyeX, StageGeometry.rightEyeX].flatMap { ex in
            stride(from: -24, through: 24, by: 12).map {
                PaintDab(x: ex + CGFloat($0), y: StageGeometry.eyeY - 22, radius: 28, hex: shadow, alpha: 0.44, glitter: true)
            }
        }
        makeover.skinDabs = [
            PaintDab(x: StageGeometry.leftCheekX, y: StageGeometry.cheekY, radius: 44, hex: blush, alpha: 0.48, glitter: false),
            PaintDab(x: StageGeometry.rightCheekX, y: StageGeometry.cheekY, radius: 44, hex: blush, alpha: 0.48, glitter: false)
        ]
    }

    private func resetFace() {
        makeover.spaGlow = false
        makeover.eyelinerStyle = .none
        makeover.eyelinerCoverage = 0
        makeover.mascaraStyle = .natural
        makeover.mascaraCoverage = 0
        makeover.stickers.removeAll()
        makeover.lipDabs.removeAll()
        makeover.eyeshadowDabs.removeAll()
        makeover.skinDabs.removeAll()
        makeover.spaBubbleDabs.removeAll()
        makeover.spaMaskDabs.removeAll()
    }

    @MainActor
    private func snapPhoto() {
        SoundSynthesizer.shared.playCameraShutter()
        flashActive = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.22) { flashActive = false }

        let exportView = CharacterStageCanvasView(state: makeover, isBlinking: false, showFrame: true)
            .frame(width: 900, height: 1200)
        let renderer = ImageRenderer(content: exportView)
        renderer.scale = 1.0
        guard let uiImage = renderer.uiImage, let data = uiImage.pngData() else { return }

        let charName = BeautyCatalog.character(byId: makeover.characterId).name
        let ts = Int(Date().timeIntervalSince1970 * 1000)
        let url = lookbookDir.appendingPathComponent("\(charName)_\(ts).png")
        try? data.write(to: url)

        let saved = SavedPhotoItem(id: url.lastPathComponent, url: url, characterName: charName, createdAt: Date())
        photos.insert(saved, at: 0)
        latestPhotoUrl = url
        justSaved = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.2) { justSaved = false }
    }

    private func loadSavedPhotos() {
        guard let urls = try? FileManager.default.contentsOfDirectory(at: lookbookDir, includingPropertiesForKeys: [.creationDateKey]) else { return }
        photos = urls
            .filter { $0.pathExtension.lowercased() == "png" }
            .sorted { $0.lastPathComponent > $1.lastPathComponent }
            .map { url in
                let name = url.deletingPathExtension().lastPathComponent.components(separatedBy: "_").first ?? "Star"
                return SavedPhotoItem(id: url.lastPathComponent, url: url, characterName: name, createdAt: Date())
            }
    }
}
