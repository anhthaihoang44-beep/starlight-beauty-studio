import React from 'react';
import { Camera, Download, Image as ImageIcon } from 'lucide-react';
import { BACKGROUNDS, EXPRESSIONS, PHOTO_FRAMES } from '../data/catalog';
import { t, tl } from '../i18n';
import type { Language, MakeoverState } from '../types';
import { soundEngine } from '../utils/sound';

interface PhotoBoothControlsProps {
  lang: Language;
  state: MakeoverState;
  lastCapturedUrl: string | null;
  justSaved: boolean;
  onUpdateState: (patch: Partial<MakeoverState>) => void;
  onSnapPhoto: () => void;
  onDownloadLatest: () => void;
  onOpenGallery: () => void;
}

export const PhotoBoothControls: React.FC<PhotoBoothControlsProps> = ({
  lang,
  state,
  lastCapturedUrl,
  justSaved,
  onUpdateState,
  onSnapPhoto,
  onDownloadLatest,
  onOpenGallery
}) => {
  return (
    <div className="salon-panel photo-panel">
      <div className="panel-body photo-body">
        {/* Expressions */}
        <div className="photo-group">
          <h4 className="photo-group-title">{t('poseLabel', lang)}</h4>
          <div className="style-chip-strip">
            {EXPRESSIONS.map((exp) => (
              <button
                key={exp.id}
                type="button"
                className={`style-chip ${state.expression === exp.id ? 'active' : ''}`}
                onClick={() => {
                  soundEngine.playTap();
                  onUpdateState({ expression: exp.id });
                }}
              >
                {exp.emoji} {tl(exp.name, lang)}
              </button>
            ))}
          </div>
        </div>

        {/* Scene Backgrounds */}
        <div className="photo-group">
          <h4 className="photo-group-title">{t('bgLabel', lang)}</h4>
          <div className="bg-picker-grid">
            {BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                type="button"
                className={`bg-card-btn ${state.backgroundId === bg.id ? 'selected' : ''}`}
                onClick={() => {
                  soundEngine.playSparkle();
                  onUpdateState({ backgroundId: bg.id });
                }}
              >
                <span className="bg-swatch" style={{ background: bg.preview }} />
                <span className="item-mini-label">{tl(bg.name, lang)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Frames */}
        <div className="photo-group">
          <h4 className="photo-group-title">{t('frameLabel', lang)}</h4>
          <div className="style-chip-strip">
            {PHOTO_FRAMES.map((fr) => (
              <button
                key={fr.id}
                type="button"
                className={`style-chip ${state.frameId === fr.id ? 'active' : ''}`}
                onClick={() => {
                  soundEngine.playTap();
                  onUpdateState({ frameId: fr.id });
                }}
              >
                {tl(fr.name, lang)}
              </button>
            ))}
          </div>
        </div>

        {/* Capture CTA */}
        <div className="photo-cta-bar">
          <button type="button" className="snap-main-btn" onClick={onSnapPhoto}>
            <Camera size={22} /> {t('snapPhoto', lang)}
          </button>

          {lastCapturedUrl && (
            <div className="photo-post-actions">
              <button type="button" className="action-chip primary" onClick={onDownloadLatest}>
                <Download size={16} /> {t('downloadPhoto', lang)}
              </button>
              <button type="button" className="action-chip secondary" onClick={onOpenGallery}>
                <ImageIcon size={16} /> {t('myAlbum', lang)}
              </button>
            </div>
          )}

          {justSaved && <div className="saved-toast">✨ {t('photoSaved', lang)}</div>}
        </div>
      </div>
    </div>
  );
};
