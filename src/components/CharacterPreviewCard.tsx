import React, { useId } from 'react';
import { getEyeLensById, getHairColorById, getOutfitColorById } from '../data/catalog';
import { tl } from '../i18n';
import type { CharacterModel, Language } from '../types';
import { ArmsAndHandsSvg, FaceBaseSvg, FaceTopOverlaySvg } from './svg/FaceLayers';
import { HairBack, HairFront } from './svg/HairLayers';
import { OutfitLayer, OutfitSleevesLayer } from './svg/OutfitLayers';

interface CharacterPreviewCardProps {
  character: CharacterModel;
  lang: Language;
  selected: boolean;
  onSelect: () => void;
}

export const CharacterPreviewCard: React.FC<CharacterPreviewCardProps> = ({
  character,
  lang,
  selected,
  onSelect
}) => {
  const uid = useId().replace(/:/g, '');
  const hairColor = getHairColorById(character.defaultHairColorId);
  const eyeLens = getEyeLensById(character.defaultEyeColorId);
  const outfitTheme = getOutfitColorById(character.defaultOutfitColorId);

  return (
    <button
      type="button"
      className={`model-card ${selected ? 'selected' : ''}`}
      onClick={onSelect}
      style={{ '--card-accent': character.accentColor } as React.CSSProperties}
    >
      <div className="model-portrait-wrap">
        <svg viewBox="55 95 490 650" className="model-portrait-svg" aria-hidden="true">
          <HairBack
            styleId={character.defaultHairStyle}
            color={hairColor}
            highlightEnabled={false}
            uid={`${uid}-h`}
          />
          <FaceBaseSvg character={character} uid={`${uid}-f`} />
          <OutfitLayer
            outfitId={character.defaultOutfitId}
            theme={outfitTheme}
            uid={`${uid}-o`}
          />
          <ArmsAndHandsSvg character={character} uid={`${uid}-f`} />
          <OutfitSleevesLayer
            outfitId={character.defaultOutfitId}
            theme={outfitTheme}
            uid={`${uid}-o`}
          />
          <FaceTopOverlaySvg
            character={character}
            eyeLens={eyeLens}
            eyebrowStyle="soft-arch"
            eyebrowColor={character.defaultBrowColor}
            eyelinerStyle="none"
            eyelinerColor="#1E1B2E"
            eyelinerCoverage={0}
            mascaraStyle="natural"
            mascaraColor="#1E1B2E"
            mascaraCoverage={0}
            lipFinish="glossy"
            hasLipPaint={false}
            expression="smile"
            spaGlow={false}
            isBlinking={false}
            uid={`${uid}-ft`}
          />
          <HairFront
            styleId={character.defaultHairStyle}
            color={hairColor}
            highlightEnabled={false}
            uid={`${uid}-h`}
          />
        </svg>
      </div>
      <div className="model-card-info">
        <span className="model-name">{character.name}</span>
        <span className="model-title">{tl(character.title, lang)}</span>
      </div>
    </button>
  );
};
