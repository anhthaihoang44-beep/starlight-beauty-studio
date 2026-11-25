import React, { useState } from 'react';
import {
  Crown,
  Eraser,
  Eye,
  Heart,
  Palette,
  RotateCcw,
  Scissors,
  Shirt,
  Sparkles,
  Trash2,
  Wand2
} from 'lucide-react';
import {
  BLUSH_SWATCHES,
  EARRING_ITEMS,
  EYE_LENSES,
  EYEBROW_COLORS,
  EYEBROW_STYLES,
  EYELINER_COLORS,
  EYELINER_STYLES,
  EYESHADOW_SWATCHES,
  GLASSES_ITEMS,
  HAIR_COLORS,
  HAIRSTYLES,
  HEADWEAR_ITEMS,
  HIGHLIGHTER_SWATCHES,
  LIPSTICK_SWATCHES,
  MASCARA_COLORS,
  MASCARA_STYLES,
  NECKLACE_ITEMS,
  OUTFIT_COLORS,
  OUTFITS,
  STICKER_ITEMS,
  WINGS_ITEMS
} from '../data/catalog';
import { t, tl } from '../i18n';
import type {
  EyeshadowFinish,
  Language,
  LipFinish,
  MakeupToolId,
  MakeoverState,
  SalonCategory,
  SpaToolId,
  StickerTypeId
} from '../types';
import { soundEngine } from '../utils/sound';
import { StickerGraphic } from './svg/AccessoryLayers';

interface SalonControlsProps {
  lang: Language;
  state: MakeoverState;
  activeCategory: SalonCategory;
  activeMakeupTool: MakeupToolId;
  activeSpaTool: SpaToolId;
  selectedColors: Record<MakeupToolId, string>;
  activeSticker: StickerTypeId;
  onSelectCategory: (cat: SalonCategory) => void;
  onSelectMakeupTool: (tool: MakeupToolId) => void;
  onSelectSpaTool: (tool: SpaToolId) => void;
  onSelectToolColor: (tool: MakeupToolId, hex: string) => void;
  onSelectSticker: (sticker: StickerTypeId) => void;
  onUpdateState: (patch: Partial<MakeoverState>) => void;
  onAutoApply: () => void;
  onClearCurrent: () => void;
  onUndoSticker: () => void;
  onClearStickers: () => void;
}

export const SalonControls: React.FC<SalonControlsProps> = ({
  lang,
  state,
  activeCategory,
  activeMakeupTool,
  activeSpaTool,
  selectedColors,
  activeSticker,
  onSelectCategory,
  onSelectMakeupTool,
  onSelectSpaTool,
  onSelectToolColor,
  onSelectSticker,
  onUpdateState,
  onAutoApply,
  onClearCurrent,
  onUndoSticker,
  onClearStickers
}) => {
  const [eyeTab, setEyeTab] = useState<'lenses' | 'brows'>('lenses');
  const [hairTab, setHairTab] = useState<'style' | 'color'>('style');
  const [dressTab, setDressTab] = useState<'outfit' | 'color'>('outfit');
  const [accTab, setAccTab] = useState<'headwear' | 'earrings' | 'necklace' | 'glasses' | 'wings'>('headwear');

  const categories: { id: SalonCategory; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'spa', label: t('catSpa', lang), icon: <Sparkles size={18} />, color: '#14B8A6' },
    { id: 'makeup', label: t('catMakeup', lang), icon: <Palette size={18} />, color: '#EC4899' },
    { id: 'eyes', label: t('catEyes', lang), icon: <Eye size={18} />, color: '#8B5CF6' },
    { id: 'hair', label: t('catHair', lang), icon: <Scissors size={18} />, color: '#F59E0B' },
    { id: 'dress', label: t('catDress', lang), icon: <Shirt size={18} />, color: '#3B82F6' },
    { id: 'accessories', label: t('catAccessories', lang), icon: <Crown size={18} />, color: '#D946EF' },
    { id: 'stickers', label: t('catStickers', lang), icon: <Heart size={18} />, color: '#F43F5E' }
  ];

  const makeupTools: { id: MakeupToolId; label: string; emoji: string }[] = [
    { id: 'lipstick', label: t('toolLipstick', lang), emoji: '💄' },
    { id: 'eyeshadow', label: t('toolEyeshadow', lang), emoji: '🎨' },
    { id: 'blush', label: t('toolBlush', lang), emoji: '🌸' },
    { id: 'highlighter', label: t('toolHighlighter', lang), emoji: '✨' },
    { id: 'eyeliner', label: t('toolEyeliner', lang), emoji: '✏️' },
    { id: 'mascara', label: t('toolMascara', lang), emoji: '👁️' },
    { id: 'remover', label: t('toolRemover', lang), emoji: '🫧' }
  ];

  const spaTools: { id: SpaToolId; label: string; emoji: string; hint: string }[] = [
    { id: 'cleanser', label: t('spaCleanser', lang), emoji: '🫧', hint: t('spaHintCleanser', lang) },
    { id: 'mask', label: t('spaMask', lang), emoji: '💚', hint: t('spaHintMask', lang) },
    { id: 'rinse', label: t('spaRinse', lang), emoji: '💧', hint: t('spaHintRinse', lang) },
    { id: 'primer', label: t('spaPrimer', lang), emoji: '✨', hint: t('spaHintPrimer', lang) }
  ];

  const getMakeupHint = () => {
    switch (activeMakeupTool) {
      case 'lipstick':
        return t('hintLipstick', lang);
      case 'eyeshadow':
        return t('hintEyeshadow', lang);
      case 'blush':
        return t('hintBlush', lang);
      case 'highlighter':
        return t('hintHighlighter', lang);
      case 'eyeliner':
        return t('hintEyeliner', lang);
      case 'mascara':
        return t('hintMascara', lang);
      case 'remover':
        return t('hintRemover', lang);
    }
  };

  const activeColor = selectedColors[activeMakeupTool];

  return (
    <div className="salon-panel">
      {/* Main Category Ribbon */}
      <div className="category-tabs" role="tablist">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat.id}
            className={`cat-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
            style={{ '--tab-color': cat.color } as React.CSSProperties}
            onClick={() => {
              soundEngine.playTap();
              onSelectCategory(cat.id);
            }}
          >
            <span className="cat-tab-icon">{cat.icon}</span>
            <span className="cat-tab-label">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Category Body */}
      <div className="panel-body">
        {/* SPA TAB */}
        {activeCategory === 'spa' && (
          <div className="panel-section">
            <p className="tool-hint-banner">
              ✨ {spaTools.find((s) => s.id === activeSpaTool)?.hint}
            </p>
            <div className="pill-grid spa-grid">
              {spaTools.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  className={`tool-card-btn ${activeSpaTool === tool.id ? 'active' : ''}`}
                  onClick={() => {
                    soundEngine.playTap();
                    onSelectSpaTool(tool.id);
                  }}
                >
                  <span className="tool-emoji">{tool.emoji}</span>
                  <span>{tool.label}</span>
                </button>
              ))}
            </div>
            <div className="quick-actions-row">
              <button
                type="button"
                className="action-chip secondary"
                onClick={() => {
                  soundEngine.playBubblePop();
                  onClearCurrent();
                }}
              >
                <Eraser size={15} /> {t('spaRinse', lang)}
              </button>
              <button
                type="button"
                className="action-chip primary"
                onClick={() => {
                  soundEngine.playSparkle();
                  onUpdateState({ spaGlow: !state.spaGlow });
                }}
              >
                <Sparkles size={15} /> {t('spaPrimer', lang)}: {state.spaGlow ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        )}

        {/* MAKEUP TAB */}
        {activeCategory === 'makeup' && (
          <div className="panel-section">
            {/* Makeup Tool Selector */}
            <div className="tool-strip">
              {makeupTools.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  className={`makeup-tool-btn ${activeMakeupTool === tool.id ? 'active' : ''}`}
                  onClick={() => {
                    soundEngine.playTap();
                    onSelectMakeupTool(tool.id);
                  }}
                >
                  <span className="tool-emoji">{tool.emoji}</span>
                  <span className="makeup-tool-name">{tool.label}</span>
                </button>
              ))}
            </div>

            {/* Interactive Hint + Magic Fill / Clear */}
            <div className="hint-action-bar">
              <span className="hint-text">{getMakeupHint()}</span>
              {activeMakeupTool !== 'remover' && (
                <div className="mini-btn-group">
                  <button type="button" className="mini-magic-btn" onClick={onAutoApply}>
                    <Wand2 size={14} /> {t('autoApply', lang)}
                  </button>
                  <button type="button" className="mini-clear-btn" onClick={onClearCurrent}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Finish toggles for Lipstick & Eyeshadow */}
            {activeMakeupTool === 'lipstick' && (
              <div className="finish-row">
                {(['matte', 'glossy', 'glitter'] as LipFinish[]).map((fin) => (
                  <button
                    key={fin}
                    type="button"
                    className={`finish-pill ${state.lipFinish === fin ? 'active' : ''}`}
                    onClick={() => {
                      soundEngine.playTap();
                      onUpdateState({ lipFinish: fin });
                    }}
                  >
                    {fin === 'matte'
                      ? t('finishMatte', lang)
                      : fin === 'glossy'
                        ? `✨ ${t('finishGlossy', lang)}`
                        : `💎 ${t('finishGlitter', lang)}`}
                  </button>
                ))}
              </div>
            )}

            {activeMakeupTool === 'eyeshadow' && (
              <div className="finish-row">
                {(['matte', 'shimmer'] as EyeshadowFinish[]).map((fin) => (
                  <button
                    key={fin}
                    type="button"
                    className={`finish-pill ${state.eyeshadowFinish === fin ? 'active' : ''}`}
                    onClick={() => {
                      soundEngine.playTap();
                      onUpdateState({ eyeshadowFinish: fin });
                    }}
                  >
                    {fin === 'matte' ? t('finishMatte', lang) : `✨ ${t('finishShimmer', lang)}`}
                  </button>
                ))}
              </div>
            )}

            {/* Style picker for Eyeliner */}
            {activeMakeupTool === 'eyeliner' && (
              <div className="style-chip-strip">
                {EYELINER_STYLES.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    className={`style-chip ${state.eyelinerStyle === st.id ? 'active' : ''}`}
                    onClick={() => {
                      soundEngine.playSparkle();
                      onUpdateState({
                        eyelinerStyle: st.id,
                        eyelinerCoverage: st.id === 'none' ? 0 : Math.max(0.75, state.eyelinerCoverage)
                      });
                    }}
                  >
                    {tl(st.name, lang)}
                  </button>
                ))}
              </div>
            )}

            {/* Style picker for Mascara */}
            {activeMakeupTool === 'mascara' && (
              <div className="style-chip-strip">
                {MASCARA_STYLES.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    className={`style-chip ${state.mascaraStyle === st.id ? 'active' : ''}`}
                    onClick={() => {
                      soundEngine.playSparkle();
                      onUpdateState({
                        mascaraStyle: st.id,
                        mascaraCoverage: st.id === 'natural' ? 0 : Math.max(0.8, state.mascaraCoverage)
                      });
                    }}
                  >
                    {tl(st.name, lang)}
                  </button>
                ))}
              </div>
            )}

            {/* Swatch Palettes */}
            {activeMakeupTool !== 'remover' && (
              <div className="swatch-grid">
                {(activeMakeupTool === 'lipstick'
                  ? LIPSTICK_SWATCHES
                  : activeMakeupTool === 'eyeshadow'
                    ? EYESHADOW_SWATCHES
                    : activeMakeupTool === 'blush'
                      ? BLUSH_SWATCHES
                      : activeMakeupTool === 'highlighter'
                        ? HIGHLIGHTER_SWATCHES
                        : activeMakeupTool === 'eyeliner'
                          ? EYELINER_COLORS
                          : MASCARA_COLORS
                ).map((sw) => {
                  const isSel =
                    activeMakeupTool === 'eyeliner'
                      ? state.eyelinerColor === sw.hex
                      : activeMakeupTool === 'mascara'
                        ? state.mascaraColor === sw.hex
                        : activeColor === sw.hex;
                  return (
                    <button
                      key={sw.id}
                      type="button"
                      title={tl(sw.name, lang)}
                      className={`color-swatch ${isSel ? 'selected' : ''}`}
                      style={{ backgroundColor: sw.hex }}
                      onClick={() => {
                        soundEngine.playTap();
                        onSelectToolColor(activeMakeupTool, sw.hex);
                        if (activeMakeupTool === 'eyeliner') {
                          onUpdateState({
                            eyelinerColor: sw.hex,
                            eyelinerStyle: state.eyelinerStyle === 'none' ? 'classic' : state.eyelinerStyle,
                            eyelinerCoverage: Math.max(0.75, state.eyelinerCoverage)
                          });
                        } else if (activeMakeupTool === 'mascara') {
                          onUpdateState({
                            mascaraColor: sw.hex,
                            mascaraStyle: state.mascaraStyle === 'natural' ? 'curled' : state.mascaraStyle,
                            mascaraCoverage: Math.max(0.8, state.mascaraCoverage)
                          });
                        }
                      }}
                    >
                      <span className="swatch-shine" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* EYES & BROWS TAB */}
        {activeCategory === 'eyes' && (
          <div className="panel-section">
            <div className="subtab-row">
              <button
                type="button"
                className={`subtab-btn ${eyeTab === 'lenses' ? 'active' : ''}`}
                onClick={() => {
                  soundEngine.playTap();
                  setEyeTab('lenses');
                }}
              >
                👁️ {t('subLenses', lang)}
              </button>
              <button
                type="button"
                className={`subtab-btn ${eyeTab === 'brows' ? 'active' : ''}`}
                onClick={() => {
                  soundEngine.playTap();
                  setEyeTab('brows');
                }}
              >
                ✨ {t('subBrows', lang)}
              </button>
            </div>

            {eyeTab === 'lenses' ? (
              <div className="lens-grid">
                {EYE_LENSES.map((lens) => (
                  <button
                    key={lens.id}
                    type="button"
                    className={`lens-btn ${state.eyeColorId === lens.id ? 'selected' : ''}`}
                    onClick={() => {
                      soundEngine.playSparkle();
                      onUpdateState({ eyeColorId: lens.id });
                    }}
                  >
                    <span
                      className="lens-orb"
                      style={{
                        background: `radial-gradient(circle at 42% 38%, ${lens.sparkle} 8%, ${lens.inner} 42%, ${lens.outer} 80%, #1E1B2E 100%)`
                      }}
                    />
                    <span className="item-mini-label">{tl(lens.name, lang)}</span>
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="style-chip-strip">
                  {EYEBROW_STYLES.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      className={`style-chip ${state.eyebrowStyle === b.id ? 'active' : ''}`}
                      onClick={() => {
                        soundEngine.playTap();
                        onUpdateState({ eyebrowStyle: b.id });
                      }}
                    >
                      {tl(b.name, lang)}
                    </button>
                  ))}
                </div>
                <div className="swatch-grid">
                  {EYEBROW_COLORS.map((sw) => (
                    <button
                      key={sw.id}
                      type="button"
                      title={tl(sw.name, lang)}
                      className={`color-swatch ${state.eyebrowColor === sw.hex ? 'selected' : ''}`}
                      style={{ backgroundColor: sw.hex }}
                      onClick={() => {
                        soundEngine.playTap();
                        onUpdateState({ eyebrowColor: sw.hex });
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* HAIR STUDIO TAB */}
        {activeCategory === 'hair' && (
          <div className="panel-section">
            <div className="subtab-row">
              <button
                type="button"
                className={`subtab-btn ${hairTab === 'style' ? 'active' : ''}`}
                onClick={() => {
                  soundEngine.playTap();
                  setHairTab('style');
                }}
              >
                💇‍♀️ {t('subHairStyle', lang)}
              </button>
              <button
                type="button"
                className={`subtab-btn ${hairTab === 'color' ? 'active' : ''}`}
                onClick={() => {
                  soundEngine.playTap();
                  setHairTab('color');
                }}
              >
                🌈 {t('subHairColor', lang)}
              </button>
              <button
                type="button"
                className={`subtab-btn highlight-toggle ${state.hairHighlightEnabled ? 'active' : ''}`}
                onClick={() => {
                  soundEngine.playSparkle();
                  onUpdateState({ hairHighlightEnabled: !state.hairHighlightEnabled });
                }}
              >
                ✨ {t('highlightsOn', lang)}
              </button>
            </div>

            {hairTab === 'style' ? (
              <div className="option-card-grid">
                {HAIRSTYLES.map((hs) => (
                  <button
                    key={hs.id}
                    type="button"
                    className={`option-card ${state.hairStyle === hs.id ? 'selected' : ''}`}
                    onClick={() => {
                      soundEngine.playMagicChime();
                      onUpdateState({ hairStyle: hs.id });
                    }}
                  >
                    {tl(hs.name, lang)}
                  </button>
                ))}
              </div>
            ) : (
              <div className="swatch-grid">
                {HAIR_COLORS.map((hc) => (
                  <button
                    key={hc.id}
                    type="button"
                    title={tl(hc.name, lang)}
                    className={`color-swatch ${state.hairColorId === hc.id ? 'selected' : ''}`}
                    style={{
                      background:
                        hc.id === 'rainbow-magic'
                          ? 'linear-gradient(135deg, #FF7AC6, #FDE047, #67E8F9, #A78BFA)'
                          : `linear-gradient(135deg, ${hc.highlight}, ${hc.primary}, ${hc.shadow})`
                    }}
                    onClick={() => {
                      soundEngine.playSparkle();
                      onUpdateState({ hairColorId: hc.id });
                    }}
                  >
                    <span className="swatch-shine" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DRESS-UP TAB */}
        {activeCategory === 'dress' && (
          <div className="panel-section">
            <div className="subtab-row">
              <button
                type="button"
                className={`subtab-btn ${dressTab === 'outfit' ? 'active' : ''}`}
                onClick={() => {
                  soundEngine.playTap();
                  setDressTab('outfit');
                }}
              >
                👗 {t('subOutfitStyle', lang)}
              </button>
              <button
                type="button"
                className={`subtab-btn ${dressTab === 'color' ? 'active' : ''}`}
                onClick={() => {
                  soundEngine.playTap();
                  setDressTab('color');
                }}
              >
                🎨 {t('subOutfitColor', lang)}
              </button>
            </div>

            {dressTab === 'outfit' ? (
              <div className="option-card-grid">
                {OUTFITS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`option-card ${state.outfitId === item.id ? 'selected' : ''}`}
                    onClick={() => {
                      soundEngine.playMagicChime();
                      onUpdateState({ outfitId: item.id });
                    }}
                  >
                    {tl(item.name, lang)}
                  </button>
                ))}
              </div>
            ) : (
              <div className="swatch-grid">
                {OUTFIT_COLORS.map((oc) => (
                  <button
                    key={oc.id}
                    type="button"
                    title={tl(oc.name, lang)}
                    className={`color-swatch ${state.outfitColorId === oc.id ? 'selected' : ''}`}
                    style={{
                      background: `linear-gradient(135deg, ${oc.secondary}, ${oc.primary}, ${oc.accent})`
                    }}
                    onClick={() => {
                      soundEngine.playSparkle();
                      onUpdateState({ outfitColorId: oc.id });
                    }}
                  >
                    <span className="swatch-shine" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ACCESSORIES TAB */}
        {activeCategory === 'accessories' && (
          <div className="panel-section">
            <div className="subtab-row wrap-scroll">
              {(
                [
                  ['headwear', `👑 ${t('subHeadwear', lang)}`],
                  ['earrings', `💎 ${t('subEarrings', lang)}`],
                  ['necklace', `📿 ${t('subNecklace', lang)}`],
                  ['glasses', `🕶️ ${t('subGlasses', lang)}`],
                  ['wings', `🦋 ${t('subWings', lang)}`]
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={`subtab-btn ${accTab === id ? 'active' : ''}`}
                  onClick={() => {
                    soundEngine.playTap();
                    setAccTab(id);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="option-card-grid">
              {accTab === 'headwear' &&
                HEADWEAR_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`option-card ${state.headwearId === item.id ? 'selected' : ''}`}
                    onClick={() => {
                      soundEngine.playSparkle();
                      onUpdateState({ headwearId: item.id });
                    }}
                  >
                    {tl(item.name, lang)}
                  </button>
                ))}
              {accTab === 'earrings' &&
                EARRING_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`option-card ${state.earringId === item.id ? 'selected' : ''}`}
                    onClick={() => {
                      soundEngine.playSparkle();
                      onUpdateState({ earringId: item.id });
                    }}
                  >
                    {tl(item.name, lang)}
                  </button>
                ))}
              {accTab === 'necklace' &&
                NECKLACE_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`option-card ${state.necklaceId === item.id ? 'selected' : ''}`}
                    onClick={() => {
                      soundEngine.playSparkle();
                      onUpdateState({ necklaceId: item.id });
                    }}
                  >
                    {tl(item.name, lang)}
                  </button>
                ))}
              {accTab === 'glasses' &&
                GLASSES_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`option-card ${state.glassesId === item.id ? 'selected' : ''}`}
                    onClick={() => {
                      soundEngine.playSparkle();
                      onUpdateState({ glassesId: item.id });
                    }}
                  >
                    {tl(item.name, lang)}
                  </button>
                ))}
              {accTab === 'wings' &&
                WINGS_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`option-card ${state.wingsId === item.id ? 'selected' : ''}`}
                    onClick={() => {
                      soundEngine.playMagicChime();
                      onUpdateState({ wingsId: item.id });
                    }}
                  >
                    {tl(item.name, lang)}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* STICKERS & GEMS TAB */}
        {activeCategory === 'stickers' && (
          <div className="panel-section">
            <div className="hint-action-bar">
              <span className="hint-text">✨ {t('hintStickers', lang)}</span>
              <div className="mini-btn-group">
                <button
                  type="button"
                  className="mini-clear-btn"
                  disabled={state.stickers.length === 0}
                  onClick={onUndoSticker}
                  title={t('undoSticker', lang)}
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  type="button"
                  className="mini-clear-btn"
                  disabled={state.stickers.length === 0}
                  onClick={onClearStickers}
                  title={t('clearStickers', lang)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="sticker-grid">
              {STICKER_ITEMS.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  className={`sticker-pick-btn ${activeSticker === st.id ? 'selected' : ''}`}
                  onClick={() => {
                    soundEngine.playTap();
                    onSelectSticker(st.id);
                  }}
                >
                  <svg viewBox="-20 -20 40 40" width="34" height="34">
                    <StickerGraphic type={st.id} />
                  </svg>
                  <span className="item-mini-label">{tl(st.name, lang)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
