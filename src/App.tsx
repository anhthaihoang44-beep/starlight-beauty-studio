import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  Globe,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Wand2
} from 'lucide-react';
import { CharacterPreviewCard } from './components/CharacterPreviewCard';
import { CharacterStage, type CharacterStageHandle } from './components/CharacterStage';
import { GalleryView } from './components/GalleryView';
import { PhotoBoothControls } from './components/PhotoBoothControls';
import { SalonControls } from './components/SalonControls';
import {
  BLUSH_SWATCHES,
  CHARACTERS,
  createInitialMakeover,
  EARRING_ITEMS,
  EYE_LENSES,
  EYELINER_STYLES,
  EYESHADOW_SWATCHES,
  getCharacterById,
  GLASSES_ITEMS,
  HAIR_COLORS,
  HAIRSTYLES,
  HEADWEAR_ITEMS,
  HIGHLIGHTER_SWATCHES,
  LIPSTICK_SWATCHES,
  MASCARA_STYLES,
  NECKLACE_ITEMS,
  OUTFIT_COLORS,
  OUTFITS,
  pickRandom,
  WINGS_ITEMS
} from './data/catalog';
import { t } from './i18n';
import type {
  Language,
  MakeupToolId,
  MakeoverState,
  SalonCategory,
  SavedPhoto,
  ScreenMode,
  SpaToolId,
  StickerTypeId
} from './types';
import { soundEngine } from './utils/sound';

const GALLERY_STORAGE_KEY = 'starlight_beauty_lookbook_v1';

export const App: React.FC = () => {
  // Default language is English as requested; toggleable to Vietnamese anytime
  const [lang, setLang] = useState<Language>('en');
  const [muted, setMuted] = useState(false);
  const [screen, setScreen] = useState<ScreenMode>('home');
  const [previousScreen, setPreviousScreen] = useState<ScreenMode>('home');

  const [selectedModelId, setSelectedModelId] = useState<string>(CHARACTERS[0].id);
  const [makeover, setMakeover] = useState<MakeoverState>(() =>
    createInitialMakeover(CHARACTERS[0].id)
  );

  const [activeCategory, setActiveCategory] = useState<SalonCategory>('makeup');
  const [activeMakeupTool, setActiveMakeupTool] = useState<MakeupToolId>('lipstick');
  const [activeSpaTool, setActiveSpaTool] = useState<SpaToolId>('cleanser');
  const [activeSticker, setActiveSticker] = useState<StickerTypeId>('star-gem');

  const [selectedColors, setSelectedColors] = useState<Record<MakeupToolId, string>>({
    lipstick: LIPSTICK_SWATCHES[0].hex,
    eyeshadow: EYESHADOW_SWATCHES[0].hex,
    blush: BLUSH_SWATCHES[0].hex,
    highlighter: HIGHLIGHTER_SWATCHES[0].hex,
    eyeliner: '#1E1B2E',
    mascara: '#1E1B2E',
    remover: '#FFFFFF'
  });

  const [photos, setPhotos] = useState<SavedPhoto[]>(() => {
    try {
      const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
      if (raw) return JSON.parse(raw) as SavedPhoto[];
    } catch {
      // ignore storage errors
    }
    return [];
  });
  const [flashActive, setFlashActive] = useState(false);
  const [lastCapturedUrl, setLastCapturedUrl] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  const stageRef = useRef<CharacterStageHandle | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(photos.slice(0, 18)));
    } catch {
      // ignore quota errors
    }
  }, [photos]);

  const toggleLanguage = () => {
    soundEngine.playTap();
    setLang((prev) => (prev === 'en' ? 'vi' : 'en'));
  };

  const toggleMute = () => {
    const nextMuted = soundEngine.toggleMute();
    setMuted(nextMuted);
  };

  const enterSalon = (charId: string) => {
    soundEngine.playMagicChime();
    setSelectedModelId(charId);
    setMakeover(createInitialMakeover(charId));
    setActiveCategory('makeup');
    setActiveMakeupTool('lipstick');
    setLastCapturedUrl(null);
    setScreen('salon');
  };

  const updateMakeover = useCallback((patch: Partial<MakeoverState>) => {
    setMakeover((prev) => ({ ...prev, ...patch }));
  }, []);

  const handlePaintFlag = useCallback((layer: 'lip' | 'eyeshadow' | 'blush', painted: boolean) => {
    setMakeover((prev) => {
      if (layer === 'lip' && prev.hasLipPaint === painted) return prev;
      if (layer === 'eyeshadow' && prev.hasEyeshadowPaint === painted) return prev;
      if (layer === 'blush' && prev.hasBlushPaint === painted) return prev;
      return {
        ...prev,
        hasLipPaint: layer === 'lip' ? painted : prev.hasLipPaint,
        hasEyeshadowPaint: layer === 'eyeshadow' ? painted : prev.hasEyeshadowPaint,
        hasBlushPaint: layer === 'blush' ? painted : prev.hasBlushPaint
      };
    });
  }, []);

  const handleUpdateCoverage = useCallback((tool: 'eyeliner' | 'mascara', delta: number) => {
    setMakeover((prev) => {
      if (tool === 'eyeliner') {
        const nextStyle = prev.eyelinerStyle === 'none' ? 'classic' : prev.eyelinerStyle;
        return {
          ...prev,
          eyelinerStyle: nextStyle,
          eyelinerCoverage: Math.min(1, prev.eyelinerCoverage + delta)
        };
      }
      const nextStyle = prev.mascaraStyle === 'natural' ? 'curled' : prev.mascaraStyle;
      return {
        ...prev,
        mascaraStyle: nextStyle,
        mascaraCoverage: Math.min(1, prev.mascaraCoverage + delta)
      };
    });
  }, []);

  const handlePlaceSticker = useCallback(
    (x: number, y: number) => {
      setMakeover((prev) => ({
        ...prev,
        stickers: [
          ...prev.stickers.slice(-24),
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            type: activeSticker,
            x,
            y,
            scale: 0.9 + Math.random() * 0.25,
            rotation: (Math.random() - 0.5) * 24
          }
        ]
      }));
    },
    [activeSticker]
  );

  const handleAutoApply = () => {
    const color = selectedColors[activeMakeupTool];
    stageRef.current?.autoApplyMakeup(activeMakeupTool, color);
  };

  const handleClearCurrent = () => {
    soundEngine.playBubblePop();
    if (activeCategory === 'spa') {
      stageRef.current?.clearLayer('spa');
      return;
    }
    if (activeMakeupTool === 'lipstick') {
      stageRef.current?.clearLayer('lipstick');
    } else if (activeMakeupTool === 'eyeshadow') {
      stageRef.current?.clearLayer('eyeshadow');
    } else if (activeMakeupTool === 'blush' || activeMakeupTool === 'highlighter') {
      stageRef.current?.clearLayer('blush');
    } else if (activeMakeupTool === 'eyeliner') {
      updateMakeover({ eyelinerStyle: 'none', eyelinerCoverage: 0 });
    } else if (activeMakeupTool === 'mascara') {
      updateMakeover({ mascaraStyle: 'natural', mascaraCoverage: 0 });
    }
  };

  const handleResetFace = () => {
    soundEngine.playBubblePop();
    stageRef.current?.clearLayer('all');
    setMakeover((prev) => ({
      ...prev,
      spaGlow: false,
      eyelinerStyle: 'none',
      eyelinerCoverage: 0,
      mascaraStyle: 'natural',
      mascaraCoverage: 0,
      stickers: []
    }));
  };

  const handleSurpriseMakeover = () => {
    soundEngine.playMagicChime();
    const lip = pickRandom(LIPSTICK_SWATCHES).hex;
    const shadow = pickRandom(EYESHADOW_SWATCHES).hex;
    const blush = pickRandom(BLUSH_SWATCHES).hex;
    const liner = pickRandom(EYELINER_STYLES.filter((e) => e.id !== 'none')).id;
    const mascara = pickRandom(MASCARA_STYLES.filter((m) => m.id !== 'natural')).id;

    setSelectedColors((prev) => ({
      ...prev,
      lipstick: lip,
      eyeshadow: shadow,
      blush
    }));

    setMakeover((prev) => ({
      ...prev,
      spaGlow: true,
      eyeColorId: pickRandom(EYE_LENSES).id,
      eyelinerStyle: liner,
      eyelinerCoverage: 1,
      mascaraStyle: mascara,
      mascaraCoverage: 1,
      lipFinish: pickRandom(['glossy', 'glitter', 'matte'] as const),
      eyeshadowFinish: 'shimmer',
      hairStyle: pickRandom(HAIRSTYLES).id,
      hairColorId: pickRandom(HAIR_COLORS).id,
      hairHighlightEnabled: Math.random() > 0.35,
      outfitId: pickRandom(OUTFITS).id,
      outfitColorId: pickRandom(OUTFIT_COLORS).id,
      headwearId: pickRandom(HEADWEAR_ITEMS).id,
      earringId: pickRandom(EARRING_ITEMS).id,
      necklaceId: pickRandom(NECKLACE_ITEMS).id,
      glassesId: Math.random() > 0.65 ? pickRandom(GLASSES_ITEMS).id : 'none',
      wingsId: Math.random() > 0.45 ? pickRandom(WINGS_ITEMS).id : 'none'
    }));

    stageRef.current?.applySurprisePaint(lip, shadow, blush);
  };

  const handleSnapPhoto = async () => {
    soundEngine.playCameraShutter();
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 260);

    const dataUrl = await stageRef.current?.exportPhotoDataUrl();
    if (!dataUrl) return;

    const char = getCharacterById(makeover.characterId);
    const newPhoto: SavedPhoto = {
      id: `photo-${Date.now()}`,
      dataUrl,
      characterName: char.name,
      createdAt: Date.now()
    };
    setPhotos((prev) => [newPhoto, ...prev]);
    setLastCapturedUrl(dataUrl);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2400);
  };

  const downloadDataUrl = async (dataUrl: string, name: string) => {
    const filename = `starlight-${name.toLowerCase()}-${Date.now()}.png`;
    try {
      if (typeof navigator !== 'undefined' && 'share' in navigator && 'canShare' in navigator) {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], filename, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'Starlight Beauty Studio' });
          return;
        }
      }
    } catch {
      // Fall back to standard browser download
    }
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // HOME SCREEN — Model Selection
  if (screen === 'home') {
    return (
      <div className="app-shell home-screen">
        <div className="floating-stars-bg" aria-hidden="true">
          <span>✦</span>
          <span>★</span>
          <span>✧</span>
          <span>❀</span>
          <span>✦</span>
        </div>

        <header className="home-header">
          <div className="badge-safe">✨ {t('allUnlockedBadge', lang)}</div>
          <div className="header-right-controls">
            <button
              type="button"
              className="icon-pill-btn"
              onClick={() => {
                soundEngine.playTap();
                setPreviousScreen('home');
                setScreen('gallery');
              }}
            >
              <ImageIcon size={17} /> {t('myAlbum', lang)} ({photos.length})
            </button>
            <button type="button" className="icon-pill-btn" onClick={toggleLanguage}>
              <Globe size={16} /> {lang.toUpperCase()}
            </button>
            <button
              type="button"
              className="icon-circle-btn"
              onClick={toggleMute}
              aria-label={muted ? t('soundOff', lang) : t('soundOn', lang)}
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </header>

        <main className="home-main">
          <div className="brand-hero">
            <h1 className="brand-title">{t('appName', lang)}</h1>
            <p className="brand-subtitle">{t('appTagline', lang)}</p>
          </div>

          <h2 className="section-prompt">{t('chooseModel', lang)}</h2>

          <div className="models-grid">
            {CHARACTERS.map((char) => (
              <CharacterPreviewCard
                key={char.id}
                character={char}
                lang={lang}
                selected={selectedModelId === char.id}
                onSelect={() => {
                  soundEngine.playSparkle();
                  setSelectedModelId(char.id);
                }}
              />
            ))}
          </div>

          <div className="home-cta-wrap">
            <button
              type="button"
              className="start-play-btn"
              onClick={() => enterSalon(selectedModelId)}
            >
              <Sparkles size={22} /> {t('startMakeover', lang)}
            </button>
          </div>
        </main>
      </div>
    );
  }

  // GALLERY SCREEN
  if (screen === 'gallery') {
    return (
      <div className="app-shell">
        <GalleryView
          lang={lang}
          photos={photos}
          onBack={() => setScreen(previousScreen)}
          onDelete={(id) => setPhotos((prev) => prev.filter((p) => p.id !== id))}
          onDownload={(photo) => downloadDataUrl(photo.dataUrl, photo.characterName)}
        />
      </div>
    );
  }

  // SALON & PHOTO BOOTH SCREEN (shares live CharacterStage so painted canvases stay intact!)
  const isPhotoBooth = screen === 'photobooth';
  const currentChar = getCharacterById(makeover.characterId);

  return (
    <div className="app-shell salon-screen">
      {/* Top Compact Game Bar */}
      <header className="top-bar">
        <div className="top-bar-left">
          <button
            type="button"
            className="icon-pill-btn"
            onClick={() => {
              soundEngine.playTap();
              if (isPhotoBooth) {
                setScreen('salon');
              } else {
                setScreen('home');
              }
            }}
          >
            <ArrowLeft size={17} /> {isPhotoBooth ? t('backToSalon', lang) : t('home', lang)}
          </button>
          <span className="model-name-pill">✨ {currentChar.name}</span>
        </div>

        <div className="top-bar-right">
          {!isPhotoBooth && (
            <>
              <button
                type="button"
                className="icon-pill-btn magic-btn"
                onClick={handleSurpriseMakeover}
                title={t('surpriseMe', lang)}
              >
                <Wand2 size={16} /> <span className="hide-xs">{t('surpriseMe', lang)}</span>
              </button>
              <button
                type="button"
                className="icon-circle-btn"
                onClick={handleResetFace}
                title={t('clearAllMakeup', lang)}
              >
                <RotateCcw size={17} />
              </button>
            </>
          )}
          <button type="button" className="icon-pill-btn compact" onClick={toggleLanguage}>
            {lang.toUpperCase()}
          </button>
          <button
            type="button"
            className="icon-circle-btn"
            onClick={toggleMute}
            aria-label={muted ? t('soundOff', lang) : t('soundOn', lang)}
          >
            {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
          {!isPhotoBooth && (
            <button
              type="button"
              className="icon-pill-btn photo-go-btn"
              onClick={() => {
                soundEngine.playMagicChime();
                setScreen('photobooth');
              }}
            >
              <Camera size={17} /> {t('photoBooth', lang)}
            </button>
          )}
        </div>
      </header>

      {/* Main Split Workspace: Stage + Controls */}
      <div className="salon-workspace">
        <div className="stage-column">
          <div className="stage-card">
            <CharacterStage
              ref={stageRef}
              state={makeover}
              activeCategory={activeCategory}
              activeMakeupTool={activeMakeupTool}
              activeSpaTool={activeSpaTool}
              activeColor={selectedColors[activeMakeupTool]}
              activeSticker={activeSticker}
              interactive={!isPhotoBooth}
              showFrame={isPhotoBooth}
              onPaintFlag={handlePaintFlag}
              onUpdateCoverage={handleUpdateCoverage}
              onSpaGlowChange={(glow) => updateMakeover({ spaGlow: glow })}
              onPlaceSticker={handlePlaceSticker}
            />
            {flashActive && <div className="camera-flash-overlay" />}
          </div>
        </div>

        <div className="controls-column">
          {isPhotoBooth ? (
            <PhotoBoothControls
              lang={lang}
              state={makeover}
              lastCapturedUrl={lastCapturedUrl}
              justSaved={justSaved}
              onUpdateState={updateMakeover}
              onSnapPhoto={handleSnapPhoto}
              onDownloadLatest={() => {
                if (lastCapturedUrl) downloadDataUrl(lastCapturedUrl, currentChar.name);
              }}
              onOpenGallery={() => {
                soundEngine.playTap();
                setPreviousScreen('photobooth');
                setScreen('gallery');
              }}
            />
          ) : (
            <SalonControls
              lang={lang}
              state={makeover}
              activeCategory={activeCategory}
              activeMakeupTool={activeMakeupTool}
              activeSpaTool={activeSpaTool}
              selectedColors={selectedColors}
              activeSticker={activeSticker}
              onSelectCategory={setActiveCategory}
              onSelectMakeupTool={setActiveMakeupTool}
              onSelectSpaTool={setActiveSpaTool}
              onSelectToolColor={(tool, hex) =>
                setSelectedColors((prev) => ({ ...prev, [tool]: hex }))
              }
              onSelectSticker={setActiveSticker}
              onUpdateState={updateMakeover}
              onAutoApply={handleAutoApply}
              onClearCurrent={handleClearCurrent}
              onUndoSticker={() => {
                soundEngine.playTap();
                setMakeover((prev) => ({ ...prev, stickers: prev.stickers.slice(0, -1) }));
              }}
              onClearStickers={() => {
                soundEngine.playBubblePop();
                updateMakeover({ stickers: [] });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
