import React from 'react';
import {
  FACE_PATH,
  LEFT_CHEEK,
  LEFT_EYE,
  LIPS_FULL_PATH,
  LIPS_LOWER_PATH,
  LIPS_UPPER_PATH,
  RIGHT_CHEEK,
  RIGHT_EYE
} from '../../data/faceGeometry';
import type {
  CharacterModel,
  EyebrowStyleId,
  EyelinerStyleId,
  EyeLensOption,
  ExpressionId,
  LipFinish,
  MascaraStyleId
} from '../../types';

interface FaceBaseProps {
  character: CharacterModel;
  uid: string;
}

export const FaceBaseSvg: React.FC<FaceBaseProps> = ({ character, uid }) => {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-skin-face`} cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor={character.skinLight} />
          <stop offset="68%" stopColor={character.skinBase} />
          <stop offset="100%" stopColor={character.skinShadow} />
        </radialGradient>
        <linearGradient id={`${uid}-skin-neck`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={character.skinNeckShadow} />
          <stop offset="45%" stopColor={character.skinBase} />
          <stop offset="100%" stopColor={character.skinLight} />
        </linearGradient>
        <radialGradient id={`${uid}-nat-blush`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={character.naturalBlush} stopOpacity="0.28" />
          <stop offset="100%" stopColor={character.naturalBlush} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sculpted Neck, Shoulders & Hourglass Torso (waist at y=668) */}
      <path
        d="M 272 438 L 270 506 C 246 514, 200 520, 182 544 C 190 566, 200 580, 206 594 C 212 622, 220 646, 226 668 C 214 712, 202 756, 196 800 L 404 800 C 398 756, 386 712, 374 668 C 380 646, 388 622, 394 594 C 400 580, 410 566, 418 544 C 400 520, 354 514, 330 506 L 328 438 Z"
        fill={`url(#${uid}-skin-neck)`}
        stroke={character.skinShadow}
        strokeWidth="2.5"
      />
      {/* Delicate collarbone hint */}
      <path d="M 230 536 Q 258 545 284 540" fill="none" stroke={character.skinShadow} strokeWidth="2.2" strokeLinecap="round" opacity="0.65" />
      <path d="M 370 536 Q 342 545 316 540" fill="none" stroke={character.skinShadow} strokeWidth="2.2" strokeLinecap="round" opacity="0.65" />
      {/* Chin shadow cast on neck */}
      <ellipse cx="300" cy="461" rx="30" ry="13" fill={character.skinNeckShadow} opacity="0.55" />

      {/* Ears */}
      <g>
        <ellipse cx="184" cy="336" rx="18" ry="28" fill={character.skinBase} stroke={character.skinShadow} strokeWidth="2.4" />
        <path d="M 184 322 C 177 328, 177 346, 185 352" fill="none" stroke={character.earInner} strokeWidth="3.5" strokeLinecap="round" />

        <ellipse cx="416" cy="336" rx="18" ry="28" fill={character.skinBase} stroke={character.skinShadow} strokeWidth="2.4" />
        <path d="M 416 322 C 423 328, 423 346, 415 352" fill="none" stroke={character.earInner} strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* Main Sculpted Face */}
      <path d={FACE_PATH} fill={`url(#${uid}-skin-face)`} stroke={character.skinShadow} strokeWidth="2.6" />

      {/* Subtle natural rosy undertone on cheeks */}
      <ellipse cx={LEFT_CHEEK.cx} cy={LEFT_CHEEK.cy} rx="34" ry="20" fill={`url(#${uid}-nat-blush)`} />
      <ellipse cx={RIGHT_CHEEK.cx} cy={RIGHT_CHEEK.cy} rx="34" ry="20" fill={`url(#${uid}-nat-blush)`} />

      {/* Soft upper eyelid crease lines */}
      <path d="M 214 304 Q 244 290 274 304" fill="none" stroke={character.skinShadow} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M 326 304 Q 356 290 386 304" fill="none" stroke={character.skinShadow} strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      {/* Natural Base Lips (underneath painted lipstick canvas) */}
      <path d={LIPS_UPPER_PATH} fill={character.naturalLip} opacity="0.88" />
      <path d={LIPS_LOWER_PATH} fill={character.naturalLip} opacity="0.78" />
    </g>
  );
};

export const ArmsAndHandsSvg: React.FC<FaceBaseProps> = ({ character, uid }) => {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-arm-grad`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={character.skinLight} />
          <stop offset="55%" stopColor={character.skinBase} />
          <stop offset="100%" stopColor={character.skinShadow} />
        </linearGradient>
      </defs>
      {/* Left graceful arm + forearm + hand */}
      <path
        d="M 184 540 C 160 566, 142 610, 140 648 C 138 682, 152 716, 168 744 C 164 764, 172 786, 186 790 C 198 792, 206 780, 201 765 C 210 761, 208 747, 194 738 C 182 710, 172 676, 174 648 C 176 622, 192 602, 206 590 C 200 570, 192 552, 184 540 Z"
        fill={`url(#${uid}-arm-grad)`}
        stroke={character.skinShadow}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Right graceful arm + forearm + hand */}
      <path
        d="M 416 540 C 440 566, 458 610, 460 648 C 462 682, 448 716, 432 744 C 436 764, 428 786, 414 790 C 402 792, 394 780, 399 765 C 390 761, 392 747, 406 738 C 418 710, 428 676, 426 648 C 424 622, 408 602, 394 590 C 400 570, 408 552, 416 540 Z"
        fill={`url(#${uid}-arm-grad)`}
        stroke={character.skinShadow}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Finger lines */}
      <g stroke={character.skinShadow} strokeWidth="1.6" strokeLinecap="round">
        <line x1="182" y1="772" x2="187" y2="785" />
        <line x1="191" y1="769" x2="195" y2="782" />
        <line x1="418" y1="772" x2="413" y2="785" />
        <line x1="409" y1="769" x2="405" y2="782" />
      </g>
    </g>
  );
};

interface FaceTopOverlayProps {
  character: CharacterModel;
  eyeLens: EyeLensOption;
  eyebrowStyle: EyebrowStyleId;
  eyebrowColor: string;
  eyelinerStyle: EyelinerStyleId;
  eyelinerColor: string;
  eyelinerCoverage: number;
  mascaraStyle: MascaraStyleId;
  mascaraColor: string;
  mascaraCoverage: number;
  lipFinish: LipFinish;
  hasLipPaint: boolean;
  expression: ExpressionId;
  spaGlow: boolean;
  isBlinking: boolean;
  uid: string;
}

export const FaceTopOverlaySvg: React.FC<FaceTopOverlayProps> = ({
  character,
  eyeLens,
  eyebrowStyle,
  eyebrowColor,
  eyelinerStyle,
  eyelinerColor,
  eyelinerCoverage,
  mascaraStyle,
  mascaraColor,
  mascaraCoverage,
  lipFinish,
  hasLipPaint,
  expression,
  spaGlow,
  isBlinking,
  uid
}) => {
  const renderEyebrow = (side: 'left' | 'right') => {
    const isLeft = side === 'left';
    let d = '';
    if (eyebrowStyle === 'soft-arch') {
      d = isLeft ? 'M 206 286 Q 242 268 278 282' : 'M 322 282 Q 358 268 394 286';
    } else if (eyebrowStyle === 'sweet-straight') {
      d = isLeft ? 'M 208 282 Q 244 277 278 282' : 'M 322 282 Q 356 277 392 282';
    } else if (eyebrowStyle === 'glam-wing') {
      d = isLeft ? 'M 204 288 Q 232 264 278 282' : 'M 322 282 Q 368 264 396 288';
    } else {
      d = isLeft ? 'M 208 284 Q 244 266 276 284' : 'M 324 284 Q 356 266 392 284';
    }
    return (
      <path
        key={`brow-${side}`}
        d={d}
        fill="none"
        stroke={eyebrowColor}
        strokeWidth="6.5"
        strokeLinecap="round"
        opacity="0.9"
      />
    );
  };

  const renderEye = (side: 'left' | 'right') => {
    const isLeft = side === 'left';
    const eye = isLeft ? LEFT_EYE : RIGHT_EYE;
    const closed = isBlinking || (expression === 'wink' && !isLeft);

    if (closed) {
      return (
        <g key={`eye-${side}`}>
          <path
            d={
              isLeft
                ? `M ${eye.cx - 26} ${eye.cy + 2} Q ${eye.cx} ${eye.cy + 14} ${eye.cx + 26} ${eye.cy + 2}`
                : `M ${eye.cx - 26} ${eye.cy + 2} Q ${eye.cx} ${eye.cy - 10} ${eye.cx + 26} ${eye.cy + 2}`
            }
            fill="none"
            stroke="#2B2129"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Cute closed lash flicks */}
          <path
            d={
              isLeft
                ? `M ${eye.cx - 24} ${eye.cy + 2} L ${eye.cx - 33} ${eye.cy - 3}`
                : `M ${eye.cx + 24} ${eye.cy + 2} L ${eye.cx + 33} ${eye.cy - 3}`
            }
            stroke="#2B2129"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </g>
      );
    }

    const linerAlpha = eyelinerStyle !== 'none' ? Math.max(0.25, eyelinerCoverage) : 0;
    const lashScale = 1 + (mascaraStyle === 'natural' ? 0 : mascaraCoverage * 0.48);
    const lashThickness = mascaraStyle === 'princess' ? 3.8 : mascaraStyle === 'butterfly' ? 3.4 : 2.8;
    const lashColor = mascaraCoverage > 0.05 ? mascaraColor : '#2B2129';

    // Eyelash array angles along upper lid
    const lashOffsets =
      mascaraStyle === 'princess' || mascaraStyle === 'butterfly'
        ? [-24, -18, -12, -5, 2, 9, 16, 22]
        : mascaraStyle === 'starlight' || mascaraStyle === 'curled'
          ? [-22, -14, -6, 3, 12, 20]
          : [-18, -8, 4, 15];

    return (
      <g key={`eye-${side}`}>
        {/* Sclera (bright white of the eye) */}
        <path
          d={`M ${eye.cx - 28} ${eye.cy + 2} C ${eye.cx - 22} ${eye.cy - 22}, ${eye.cx + 22} ${eye.cy - 22}, ${eye.cx + 28} ${eye.cy + 2} C ${eye.cx + 20} ${eye.cy + 20}, ${eye.cx - 20} ${eye.cy + 20}, ${eye.cx - 28} ${eye.cy + 2} Z`}
          fill="#FFFFFF"
          stroke="#CBD5E1"
          strokeWidth="1.2"
        />

        {/* Glossy Multi-Layered Iris */}
        <g clipPath={`url(#${uid}-clip-eye-${side})`}>
          <circle cx={eye.cx} cy={eye.cy + 1} r="17.5" fill={`url(#${uid}-iris-${side})`} />
          {/* Inner glowing ring */}
          <circle cx={eye.cx} cy={eye.cy + 5} r="11.5" fill={eyeLens.inner} opacity="0.65" />
          {/* Deep pupil */}
          <circle cx={eye.cx} cy={eye.cy + 1} r="7.5" fill="#181226" />
          {/* Upper eye soft shadow */}
          <ellipse cx={eye.cx} cy={eye.cy - 14} rx="28" ry="12" fill="#1E1B4B" opacity="0.16" />

          {/* Kawaii Catchlight Sparkles */}
          <circle cx={eye.cx - 7} cy={eye.cy - 6} r="5.2" fill="#FFFFFF" />
          <circle cx={eye.cx + 6} cy={eye.cy + 6} r="2.6" fill={eyeLens.sparkle} opacity="0.92" />
          <circle cx={eye.cx + 8} cy={eye.cy - 5} r="2" fill="#FFFFFF" opacity="0.85" />

          {/* Extra starry highlight when expression is 'starry' or galaxy lens */}
          {(expression === 'starry' || eyeLens.id === 'galaxy-star') && (
            <path
              d={`M ${eye.cx} ${eye.cy - 9} L ${eye.cx + 2.5} ${eye.cy - 2.5} L ${eye.cx + 9} ${eye.cy} L ${eye.cx + 2.5} ${eye.cy + 2.5} L ${eye.cx} ${eye.cy + 9} L ${eye.cx - 2.5} ${eye.cy + 2.5} L ${eye.cx - 9} ${eye.cy} L ${eye.cx - 2.5} ${eye.cy - 2.5} Z`}
              fill="#FFF9C4"
              opacity="0.95"
            />
          )}
        </g>

        {/* Soft lower lash line */}
        <path
          d={`M ${eye.cx - 20} ${eye.cy + 13} Q ${eye.cx} ${eye.cy + 19} ${eye.cx + 20} ${eye.cy + 13}`}
          fill="none"
          stroke={character.skinShadow}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Upper lash line base */}
        <path
          d={`M ${eye.cx - 29} ${eye.cy + 2} C ${eye.cx - 20} ${eye.cy - 21}, ${eye.cx + 20} ${eye.cy - 21}, ${eye.cx + 29} ${eye.cy + 2}`}
          fill="none"
          stroke={lashColor}
          strokeWidth="3.6"
          strokeLinecap="round"
        />

        {/* Eyeliner Style Overlay */}
        {eyelinerStyle !== 'none' && linerAlpha > 0 && (
          <g opacity={linerAlpha}>
            {eyelinerStyle === 'classic' && (
              <path
                d={
                  isLeft
                    ? `M ${eye.cx - 38} ${eye.cy - 6} Q ${eye.cx - 28} ${eye.cy + 2} ${eye.cx - 20} ${eye.cy - 10} C ${eye.cx - 6} ${eye.cy - 22}, ${eye.cx + 18} ${eye.cy - 20}, ${eye.cx + 28} ${eye.cy}`
                    : `M ${eye.cx + 38} ${eye.cy - 6} Q ${eye.cx + 28} ${eye.cy + 2} ${eye.cx + 20} ${eye.cy - 10} C ${eye.cx + 6} ${eye.cy - 22}, ${eye.cx - 18} ${eye.cy - 20}, ${eye.cx - 28} ${eye.cy}`
                }
                fill="none"
                stroke={eyelinerColor}
                strokeWidth="4.6"
                strokeLinecap="round"
              />
            )}
            {eyelinerStyle === 'puppy' && (
              <path
                d={
                  isLeft
                    ? `M ${eye.cx - 36} ${eye.cy + 7} Q ${eye.cx - 27} ${eye.cy + 3} ${eye.cx - 22} ${eye.cy - 10} C ${eye.cx - 6} ${eye.cy - 21}, ${eye.cx + 18} ${eye.cy - 20}, ${eye.cx + 28} ${eye.cy + 1}`
                    : `M ${eye.cx + 36} ${eye.cy + 7} Q ${eye.cx + 27} ${eye.cy + 3} ${eye.cx + 22} ${eye.cy - 10} C ${eye.cx + 6} ${eye.cy - 21}, ${eye.cx - 18} ${eye.cy - 20}, ${eye.cx - 28} ${eye.cy + 1}`
                }
                fill="none"
                stroke={eyelinerColor}
                strokeWidth="4.8"
                strokeLinecap="round"
              />
            )}
            {eyelinerStyle === 'cat' && (
              <path
                d={
                  isLeft
                    ? `M ${eye.cx - 43} ${eye.cy - 12} Q ${eye.cx - 28} ${eye.cy + 4} ${eye.cx - 18} ${eye.cy - 12} C ${eye.cx - 2} ${eye.cy - 23}, ${eye.cx + 18} ${eye.cy - 20}, ${eye.cx + 29} ${eye.cy + 2}`
                    : `M ${eye.cx + 43} ${eye.cy - 12} Q ${eye.cx + 28} ${eye.cy + 4} ${eye.cx + 18} ${eye.cy - 12} C ${eye.cx + 2} ${eye.cy - 23}, ${eye.cx - 18} ${eye.cy - 20}, ${eye.cx - 29} ${eye.cy + 2}`
                }
                fill="none"
                stroke={eyelinerColor}
                strokeWidth="5.6"
                strokeLinecap="round"
              />
            )}
            {eyelinerStyle === 'double-star' && (
              <g>
                <path
                  d={
                    isLeft
                      ? `M ${eye.cx - 41} ${eye.cy - 11} Q ${eye.cx - 26} ${eye.cy + 2} ${eye.cx - 18} ${eye.cy - 11} C ${eye.cx - 2} ${eye.cy - 22}, ${eye.cx + 18} ${eye.cy - 20}, ${eye.cx + 28} ${eye.cy}`
                      : `M ${eye.cx + 41} ${eye.cy - 11} Q ${eye.cx + 26} ${eye.cy + 2} ${eye.cx + 18} ${eye.cy - 11} C ${eye.cx + 2} ${eye.cy - 22}, ${eye.cx - 18} ${eye.cy - 20}, ${eye.cx - 28} ${eye.cy}`
                  }
                  fill="none"
                  stroke={eyelinerColor}
                  strokeWidth="4.8"
                  strokeLinecap="round"
                />
                <circle cx={isLeft ? eye.cx - 42 : eye.cx + 42} cy={eye.cy - 15} r="3.5" fill="#FDE047" stroke="#FFF" strokeWidth="1" />
                <circle cx={isLeft ? eye.cx - 35 : eye.cx + 35} cy={eye.cy - 21} r="2.2" fill="#FFF" />
              </g>
            )}
            {eyelinerStyle === 'glitter-wing' && (
              <g>
                <path
                  d={
                    isLeft
                      ? `M ${eye.cx - 40} ${eye.cy - 10} Q ${eye.cx - 26} ${eye.cy + 2} ${eye.cx - 18} ${eye.cy - 11} C ${eye.cx - 2} ${eye.cy - 22}, ${eye.cx + 18} ${eye.cy - 20}, ${eye.cx + 28} ${eye.cy}`
                      : `M ${eye.cx + 40} ${eye.cy - 10} Q ${eye.cx + 26} ${eye.cy + 2} ${eye.cx + 18} ${eye.cy - 11} C ${eye.cx + 2} ${eye.cy - 22}, ${eye.cx - 18} ${eye.cy - 20}, ${eye.cx - 28} ${eye.cy}`
                  }
                  fill="none"
                  stroke={eyelinerColor}
                  strokeWidth="5.4"
                  strokeLinecap="round"
                />
                <path
                  d={
                    isLeft
                      ? `M ${eye.cx - 38} ${eye.cy - 11} Q ${eye.cx - 22} ${eye.cy - 4} ${eye.cx + 18} ${eye.cy - 16}`
                      : `M ${eye.cx + 38} ${eye.cy - 11} Q ${eye.cx + 22} ${eye.cy - 4} ${eye.cx - 18} ${eye.cy - 16}`
                  }
                  fill="none"
                  stroke="#FFF9C4"
                  strokeWidth="2.4"
                  strokeDasharray="2 5"
                  strokeLinecap="round"
                />
              </g>
            )}
          </g>
        )}

        {/* Curled Eyelashes (Mascara layer!) */}
        <g stroke={lashColor} strokeWidth={lashThickness} strokeLinecap="round" fill="none">
          {lashOffsets.map((dx, idx) => {
            const xBase = eye.cx + (isLeft ? dx : -dx);
            const norm = dx / 28;
            const yBase = eye.cy - Math.sqrt(Math.max(0, 1 - norm * norm)) * 16 + 1;
            const outerBoost = dx < -8 ? 1.3 : 1;
            const len = (7 + (mascaraStyle === 'natural' ? 0 : 5)) * lashScale * outerBoost;
            const fanX = (isLeft ? -1 : 1) * (dx < 0 ? 7 : 3) * (mascaraStyle === 'butterfly' ? 1.4 : 1);
            return (
              <path
                key={idx}
                d={`M ${xBase} ${yBase} Q ${xBase + fanX * 0.5} ${yBase - len * 0.7} ${xBase + fanX} ${yBase - len}`}
              />
            );
          })}
        </g>
      </g>
    );
  };

  return (
    <g>
      <defs>
        <clipPath id={`${uid}-clip-eye-left`}>
          <path
            d={`M ${LEFT_EYE.cx - 28} ${LEFT_EYE.cy + 2} C ${LEFT_EYE.cx - 22} ${LEFT_EYE.cy - 22}, ${LEFT_EYE.cx + 22} ${LEFT_EYE.cy - 22}, ${LEFT_EYE.cx + 28} ${LEFT_EYE.cy + 2} C ${LEFT_EYE.cx + 20} ${LEFT_EYE.cy + 20}, ${LEFT_EYE.cx - 20} ${LEFT_EYE.cy + 20}, ${LEFT_EYE.cx - 28} ${LEFT_EYE.cy + 2} Z`}
          />
        </clipPath>
        <clipPath id={`${uid}-clip-eye-right`}>
          <path
            d={`M ${RIGHT_EYE.cx - 28} ${RIGHT_EYE.cy + 2} C ${RIGHT_EYE.cx - 22} ${RIGHT_EYE.cy - 22}, ${RIGHT_EYE.cx + 22} ${RIGHT_EYE.cy - 22}, ${RIGHT_EYE.cx + 28} ${RIGHT_EYE.cy + 2} C ${RIGHT_EYE.cx + 20} ${RIGHT_EYE.cy + 20}, ${RIGHT_EYE.cx - 20} ${RIGHT_EYE.cy + 20}, ${RIGHT_EYE.cx - 28} ${RIGHT_EYE.cy + 2} Z`}
          />
        </clipPath>
        <radialGradient id={`${uid}-iris-left`} cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor={eyeLens.inner} />
          <stop offset="68%" stopColor={eyeLens.outer} />
          <stop offset="100%" stopColor="#1E1B2E" />
        </radialGradient>
        <radialGradient id={`${uid}-iris-right`} cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor={eyeLens.inner} />
          <stop offset="68%" stopColor={eyeLens.outer} />
          <stop offset="100%" stopColor="#1E1B2E" />
        </radialGradient>
      </defs>

      {/* Cute Button Nose */}
      <path d="M 294 366 Q 300 372 306 366" fill="none" stroke={character.skinShadow} strokeWidth="2.6" strokeLinecap="round" />
      <ellipse cx="300" cy="360" rx="5" ry="3" fill="#FFFFFF" opacity={spaGlow ? 0.6 : 0.25} />

      {/* Lips Contour + Glossy / Glitter Finish + Expressions */}
      {expression === 'happy' ? (
        <g>
          {/* Open joyful laugh */}
          <path d="M 272 406 Q 300 400 328 406 C 324 432, 314 438, 300 438 C 286 438, 276 432, 272 406 Z" fill="#C94B67" stroke="#A63450" strokeWidth="2" />
          <path d="M 276 407 Q 300 404 324 407 L 320 416 Q 300 418 280 416 Z" fill="#FFFFFF" />
          <ellipse cx="300" cy="431" rx="14" ry="6" fill="#FF8DA1" />
        </g>
      ) : expression === 'kissy' ? (
        <g>
          <path
            d="M 282 408 C 288 398, 296 400, 300 403 C 304 400, 312 398, 318 408 C 313 422, 306 425, 300 425 C 294 425, 287 422, 282 408 Z"
            fill={hasLipPaint ? 'transparent' : character.naturalLip}
            stroke={character.naturalLipShadow}
            strokeWidth="2"
          />
          <ellipse cx="300" cy="410" rx="6" ry="3.5" fill="#9D2A44" opacity="0.6" />
          <path d="M 292 418 Q 300 421 308 418" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.72" />
        </g>
      ) : (
        <g>
          {/* Soft lip outline & center smile line */}
          <path d={LIPS_FULL_PATH} fill="none" stroke={character.naturalLipShadow} strokeWidth="1.5" opacity="0.55" />
          <path
            d="M 269 408 Q 285 412 300 411 Q 315 412 331 408"
            fill="none"
            stroke={character.naturalLipShadow}
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.78"
          />
          {/* Glossy shine overlay when gloss or glitter finish selected */}
          {(lipFinish === 'glossy' || lipFinish === 'glitter') && (
            <g opacity={hasLipPaint ? 0.85 : 0.45}>
              <path d="M 284 418 Q 300 423 316 418" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
              <ellipse cx="290" cy="402" rx="6" ry="2.2" fill="#FFFFFF" opacity="0.75" />
              <circle cx="320" cy="416" r="2.2" fill="#FFFFFF" />
            </g>
          )}
          {lipFinish === 'glitter' && hasLipPaint && (
            <g fill="#FFF9C4">
              <circle cx="282" cy="413" r="1.8" />
              <circle cx="295" cy="419" r="2.1" />
              <circle cx="307" cy="415" r="1.9" />
              <circle cx="318" cy="412" r="1.7" />
              <circle cx="300" cy="404" r="1.6" />
            </g>
          )}
        </g>
      )}

      {/* Eyes & Eyebrows */}
      {renderEye('left')}
      {renderEye('right')}
      {renderEyebrow('left')}
      {renderEyebrow('right')}

      {/* Radiant Spa Glow Sparkles when Glow Serum applied */}
      {spaGlow && (
        <g opacity="0.88">
          {[
            [218, 368, 7],
            [382, 368, 7],
            [300, 232, 6],
            [298, 358, 5]
          ].map(([x, y, s], i) => (
            <path
              key={i}
              d={`M ${x} ${y - s} L ${x + s * 0.28} ${y - s * 0.28} L ${x + s} ${y} L ${x + s * 0.28} ${y + s * 0.28} L ${x} ${y + s} L ${x - s * 0.28} ${y + s * 0.28} L ${x - s} ${y} L ${x - s * 0.28} ${y - s * 0.28} Z`}
              fill="#FFFBEB"
            />
          ))}
        </g>
      )}
    </g>
  );
};
