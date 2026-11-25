import SwiftUI

public struct HomeView: View {
    @Binding public var lang: AppLanguage
    @Binding public var muted: Bool
    @Binding public var selectedModelId: String
    public let photoCount: Int
    public let onStartMakeover: () -> Void
    public let onOpenGallery: () -> Void

    private let columns = [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)]

    public var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(hex: 0xFFE7F4), Color(hex: 0xF5E1FF), Color(hex: 0xE0F4FF)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            VStack(spacing: 10) {
                // Header bar
                HStack {
                    Text("✨ \(AppStrings.badgeSafe(lang))")
                        .font(.system(size: 11, weight: .bold, design: .rounded))
                        .foregroundColor(Color(hex: 0xDB2777))
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(Color.white.opacity(0.9))
                        .clipShape(Capsule())
                        .overlay(Capsule().stroke(Color(hex: 0xFBCFE8), lineWidth: 1.5))

                    Spacer()

                    Button("📸 \(photoCount)") {
                        SoundSynthesizer.shared.playTap()
                        onOpenGallery()
                    }
                    .buttonStyle(PastelPillStyle())

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
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(Color(hex: 0x3B1C4A))
                            .frame(width: 34, height: 34)
                            .background(Color.white)
                            .clipShape(Circle())
                            .overlay(Circle().stroke(Color(hex: 0xFBCFE8), lineWidth: 1.5))
                    }
                }
                .padding(.horizontal, 14)

                VStack(spacing: 3) {
                    Text(AppStrings.appName(lang))
                        .font(.system(size: 28, weight: .heavy, design: .rounded))
                        .foregroundStyle(
                            LinearGradient(colors: [Color(hex: 0xEC4899), Color(hex: 0x9333EA)], startPoint: .leading, endPoint: .trailing)
                        )
                    Text(AppStrings.tagline(lang))
                        .font(.system(size: 14, weight: .semibold, design: .rounded))
                        .foregroundColor(Color(hex: 0x6B4C7A))
                }

                Text(AppStrings.chooseModel(lang))
                    .font(.system(size: 17, weight: .bold, design: .rounded))
                    .foregroundColor(Color(hex: 0x3B1C4A))

                ScrollView(showsIndicators: false) {
                    LazyVGrid(columns: columns, spacing: 12) {
                        ForEach(BeautyCatalog.characters) { character in
                            let selected = character.id == selectedModelId
                            Button {
                                SoundSynthesizer.shared.playSparkle()
                                selectedModelId = character.id
                            } label: {
                                VStack(spacing: 6) {
                                    CharacterPortraitPreview(character: character)
                                        .aspectRatio(1, contentMode: .fit)
                                        .background(
                                            RadialGradient(colors: [Color(hex: 0xFFF8FC), Color(hex: 0xFCE7F3)], center: .center, startRadius: 4, endRadius: 90)
                                        )
                                        .clipShape(RoundedRectangle(cornerRadius: 16))

                                    Text(character.name)
                                        .font(.system(size: 16, weight: .heavy, design: .rounded))
                                        .foregroundColor(Color(hex: 0x3B1C4A))
                                    Text(character.title.text(lang))
                                        .font(.system(size: 11, weight: .semibold, design: .rounded))
                                        .foregroundColor(Color(hex: 0x6B4C7A))
                                        .lineLimit(1)
                                }
                                .padding(8)
                                .background(selected ? Color(hex: 0xFFF2F8) : Color.white.opacity(0.94))
                                .clipShape(RoundedRectangle(cornerRadius: 22))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 22)
                                        .stroke(selected ? Color(hex: character.accentColor) : Color(hex: 0xFFE0F0), lineWidth: selected ? 3 : 2)
                                )
                                .shadow(color: Color(hex: 0xEC4899, opacity: selected ? 0.25 : 0.08), radius: selected ? 10 : 5, y: 4)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(.horizontal, 14)
                    .padding(.vertical, 4)
                }

                Button {
                    SoundSynthesizer.shared.playMagicChime()
                    onStartMakeover()
                } label: {
                    HStack(spacing: 8) {
                        Image(systemName: "sparkles")
                        Text(AppStrings.startMakeover(lang))
                    }
                    .font(.system(size: 19, weight: .heavy, design: .rounded))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 15)
                    .background(LinearGradient(colors: [Color(hex: 0xFF5CA8), Color(hex: 0xA855F7)], startPoint: .leading, endPoint: .trailing))
                    .clipShape(Capsule())
                    .shadow(color: Color(hex: 0xDB2777, opacity: 0.35), radius: 10, y: 5)
                }
                .padding(.horizontal, 28)
                .padding(.bottom, 8)
            }
        }
    }
}

public struct PastelPillStyle: ButtonStyle {
    public var bg: Color = .white
    public var fg: Color = Color(hex: 0x3B1C4A)

    public func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 12, weight: .bold, design: .rounded))
            .foregroundColor(fg)
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(bg)
            .clipShape(Capsule())
            .overlay(Capsule().stroke(bg == .white ? Color(hex: 0xFBCFE8) : .clear, lineWidth: 1.5))
            .scaleEffect(configuration.isPressed ? 0.94 : 1)
    }
}
