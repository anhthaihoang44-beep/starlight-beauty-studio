import React from 'react';
import { ArrowLeft, Download, Trash2 } from 'lucide-react';
import { t } from '../i18n';
import type { Language, SavedPhoto } from '../types';
import { soundEngine } from '../utils/sound';

interface GalleryViewProps {
  lang: Language;
  photos: SavedPhoto[];
  onBack: () => void;
  onDelete: (id: string) => void;
  onDownload: (photo: SavedPhoto) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  lang,
  photos,
  onBack,
  onDelete,
  onDownload
}) => {
  return (
    <div className="gallery-screen">
      <header className="top-bar">
        <button
          type="button"
          className="icon-pill-btn"
          onClick={() => {
            soundEngine.playTap();
            onBack();
          }}
        >
          <ArrowLeft size={18} /> {t('backToSalon', lang)}
        </button>
        <h2 className="gallery-heading">✨ {t('galleryTitle', lang)}</h2>
        <div style={{ width: 64 }} />
      </header>

      <div className="gallery-content">
        {photos.length === 0 ? (
          <div className="gallery-empty-card">
            <div className="empty-icon">📸</div>
            <p>{t('galleryEmpty', lang)}</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {photos.map((photo) => (
              <div key={photo.id} className="gallery-photo-card">
                <img src={photo.dataUrl} alt={photo.characterName} className="gallery-img" />
                <div className="gallery-card-footer">
                  <span className="gallery-char-name">{photo.characterName}</span>
                  <div className="gallery-card-btns">
                    <button
                      type="button"
                      className="mini-magic-btn"
                      onClick={() => {
                        soundEngine.playSparkle();
                        onDownload(photo);
                      }}
                      title={t('downloadPhoto', lang)}
                    >
                      <Download size={15} />
                    </button>
                    <button
                      type="button"
                      className="mini-clear-btn"
                      onClick={() => {
                        soundEngine.playTap();
                        onDelete(photo.id);
                      }}
                      title={t('deletePhoto', lang)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
