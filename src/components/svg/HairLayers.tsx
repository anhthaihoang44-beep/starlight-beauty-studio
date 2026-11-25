import React from 'react';
import type { HairColorOption, HairstyleId } from '../../types';

interface HairProps {
  styleId: HairstyleId;
  color: HairColorOption;
  highlightEnabled: boolean;
  uid: string;
}

export const HairBack: React.FC<HairProps> = ({ styleId, color, highlightEnabled, uid }) => {
  const isRainbow = color.id === 'rainbow-magic';
  const mainGrad = `url(#${uid}-hair-main)`;
  const deepGrad = `url(#${uid}-hair-deep)`;

  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-hair-main`} x1="0" y1="0" x2="1" y2="1">
          {isRainbow ? (
            <>
              <stop offset="0%" stopColor="#FF7AC6" />
              <stop offset="35%" stopColor="#FDE047" />
              <stop offset="68%" stopColor="#67E8F9" />
              <stop offset="100%" stopColor="#A78BFA" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor={color.highlight} />
              <stop offset="45%" stopColor={color.primary} />
              <stop offset="100%" stopColor={color.shadow} />
            </>
          )}
        </linearGradient>
        <linearGradient id={`${uid}-hair-deep`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color.primary} />
          <stop offset="100%" stopColor={color.shadow} />
        </linearGradient>
      </defs>

      {styleId === 'princess-waves' && (
        <g>
          {/* Flowing wavy princess hair cascading behind shoulders */}
          <path
            d="M 164 260 C 138 350, 128 480, 146 610 C 160 660, 198 690, 224 676 C 242 666, 260 688, 300 690 C 340 688, 358 666, 376 676 C 402 690, 440 660, 454 610 C 472 480, 462 350, 436 260 C 420 180, 368 136, 300 136 C 232 136, 180 180, 164 260 Z"
            fill={deepGrad}
            stroke={color.shadow}
            strokeWidth="3"
          />
          {/* Soft wave accents */}
          <path
            d="M 176 340 C 154 410, 160 510, 184 590 C 194 620, 212 630, 222 610"
            fill="none"
            stroke={color.highlight}
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.35"
          />
          <path
            d="M 424 340 C 446 410, 440 510, 416 590 C 406 620, 388 630, 378 610"
            fill="none"
            stroke={color.highlight}
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.35"
          />
          {highlightEnabled && color.streak && (
            <>
              <path
                d="M 172 380 C 156 460, 166 550, 192 635"
                fill="none"
                stroke={color.streak}
                strokeWidth="14"
                strokeLinecap="round"
                opacity="0.72"
              />
              <path
                d="M 428 380 C 444 460, 434 550, 408 635"
                fill="none"
                stroke={color.streak}
                strokeWidth="14"
                strokeLinecap="round"
                opacity="0.72"
              />
            </>
          )}
        </g>
      )}

      {styleId === 'space-buns' && (
        <g>
          {/* Cute twin top space buns */}
          <circle cx="176" cy="176" r="58" fill={mainGrad} stroke={color.shadow} strokeWidth="3" />
          <circle cx="424" cy="176" r="58" fill={mainGrad} stroke={color.shadow} strokeWidth="3" />
          {/* Bun swirl shine */}
          <path
            d="M 150 156 C 166 138, 194 142, 202 162"
            fill="none"
            stroke={color.highlight}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            d="M 398 162 C 406 142, 434 138, 450 156"
            fill="none"
            stroke={color.highlight}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.55"
          />
          {/* Cute pink hair ties around buns */}
          <ellipse cx="198" cy="210" rx="30" ry="12" transform="rotate(-38 198 210)" fill="#FF75B5" stroke="#FFF" strokeWidth="2" />
          <ellipse cx="402" cy="210" rx="30" ry="12" transform="rotate(38 402 210)" fill="#FF75B5" stroke="#FFF" strokeWidth="2" />
          {/* Soft back hair cap */}
          <path
            d="M 176 260 C 170 340, 178 430, 210 470 L 390 470 C 422 430, 430 340, 424 260 C 414 176, 366 140, 300 140 C 234 140, 186 176, 176 260 Z"
            fill={deepGrad}
            stroke={color.shadow}
            strokeWidth="3"
          />
          {highlightEnabled && color.streak && (
            <>
              <circle cx="164" cy="166" r="18" fill={color.streak} opacity="0.55" />
              <circle cx="436" cy="166" r="18" fill={color.streak} opacity="0.55" />
            </>
          )}
        </g>
      )}

      {styleId === 'twin-braids' && (
        <g>
          {/* Back dome */}
          <path
            d="M 172 260 C 168 330, 176 410, 210 448 L 390 448 C 424 410, 432 330, 428 260 C 416 174, 366 138, 300 138 C 234 138, 184 174, 172 260 Z"
            fill={deepGrad}
            stroke={color.shadow}
            strokeWidth="3"
          />
          {/* Left Braid segments */}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={`lb-${i}`}>
              <ellipse
                cx={176 - i * 4}
                cy={418 + i * 38}
                rx={24 - i * 1.4}
                ry={22}
                fill={i % 2 === 0 ? mainGrad : deepGrad}
                stroke={color.shadow}
                strokeWidth="2.5"
              />
              {highlightEnabled && color.streak && i % 2 === 1 && (
                <ellipse cx={176 - i * 4} cy={418 + i * 38} rx={11} ry={10} fill={color.streak} opacity="0.6" />
              )}
            </g>
          ))}
          {/* Left braid tip + ribbon */}
          <path d="M 160 584 Q 152 624 166 646 Q 178 622 174 584 Z" fill={mainGrad} stroke={color.shadow} strokeWidth="2.5" />
          <rect x="148" y="578" width="32" height="11" rx="5.5" fill="#FF6BB5" stroke="#FFF" strokeWidth="1.5" />

          {/* Right Braid segments */}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={`rb-${i}`}>
              <ellipse
                cx={424 + i * 4}
                cy={418 + i * 38}
                rx={24 - i * 1.4}
                ry={22}
                fill={i % 2 === 0 ? mainGrad : deepGrad}
                stroke={color.shadow}
                strokeWidth="2.5"
              />
              {highlightEnabled && color.streak && i % 2 === 1 && (
                <ellipse cx={424 + i * 4} cy={418 + i * 38} rx={11} ry={10} fill={color.streak} opacity="0.6" />
              )}
            </g>
          ))}
          {/* Right braid tip + ribbon */}
          <path d="M 440 584 Q 448 624 434 646 Q 422 622 426 584 Z" fill={mainGrad} stroke={color.shadow} strokeWidth="2.5" />
          <rect x="420" y="578" width="32" height="11" rx="5.5" fill="#FF6BB5" stroke="#FFF" strokeWidth="1.5" />
        </g>
      )}

      {styleId === 'sweet-bob' && (
        <g>
          <path
            d="M 162 274 C 150 356, 158 432, 198 468 C 228 492, 260 486, 300 486 C 340 486, 372 492, 402 468 C 442 432, 450 356, 438 274 C 424 180, 370 136, 300 136 C 230 136, 176 180, 162 274 Z"
            fill={deepGrad}
            stroke={color.shadow}
            strokeWidth="3"
          />
          {highlightEnabled && color.streak && (
            <>
              <path d="M 176 340 Q 170 416 204 456" fill="none" stroke={color.streak} strokeWidth="12" strokeLinecap="round" opacity="0.68" />
              <path d="M 424 340 Q 430 416 396 456" fill="none" stroke={color.streak} strokeWidth="12" strokeLinecap="round" opacity="0.68" />
            </>
          )}
        </g>
      )}

      {styleId === 'high-ponytail' && (
        <g>
          {/* Dynamic bouncy high ponytail sweeping gracefully to the right */}
          <path
            d="M 310 144 C 378 106, 466 154, 488 262 C 508 360, 480 488, 444 562 C 424 522, 434 446, 424 374 C 414 294, 380 210, 304 184 Z"
            fill={mainGrad}
            stroke={color.shadow}
            strokeWidth="3"
          />
          <path
            d="M 358 164 C 420 184, 464 268, 468 386"
            fill="none"
            stroke={color.highlight}
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.45"
          />
          {highlightEnabled && color.streak && (
            <path
              d="M 378 190 C 436 226, 468 330, 454 470"
              fill="none"
              stroke={color.streak}
              strokeWidth="16"
              strokeLinecap="round"
              opacity="0.72"
            />
          )}
          {/* Scrunchie on top */}
          <ellipse cx="308" cy="148" rx="34" ry="16" transform="rotate(-12 308 148)" fill="#FF6BB5" stroke="#FFF" strokeWidth="2.5" />
          {/* Sleek back cap */}
          <path
            d="M 178 270 C 174 340, 184 410, 218 446 L 382 446 C 416 410, 426 340, 422 270 C 412 180, 366 142, 300 142 C 234 142, 188 180, 178 270 Z"
            fill={deepGrad}
            stroke={color.shadow}
            strokeWidth="3"
          />
        </g>
      )}

      {styleId === 'curly-puffs' && (
        <g>
          {/* Adorable big fluffy curly puffs on both sides */}
          <g fill={mainGrad} stroke={color.shadow} strokeWidth="2.8">
            <circle cx="148" cy="240" r="54" />
            <circle cx="128" cy="296" r="46" />
            <circle cx="164" cy="196" r="46" />
            <circle cx="144" cy="348" r="40" />

            <circle cx="452" cy="240" r="54" />
            <circle cx="472" cy="296" r="46" />
            <circle cx="436" cy="196" r="46" />
            <circle cx="456" cy="348" r="40" />
          </g>
          {/* Back head cap */}
          <path
            d="M 176 266 C 174 340, 184 420, 218 456 L 382 456 C 416 420, 426 340, 424 266 C 414 176, 366 138, 300 138 C 234 138, 186 176, 176 266 Z"
            fill={deepGrad}
            stroke={color.shadow}
            strokeWidth="3"
          />
          {/* Fluffy curl highlights */}
          <g fill="none" stroke={color.highlight} strokeWidth="6" strokeLinecap="round" opacity="0.45">
            <path d="M 122 226 A 26 26 0 0 1 156 206" />
            <path d="M 110 294 A 22 22 0 0 1 134 270" />
            <path d="M 478 226 A 26 26 0 0 0 444 206" />
            <path d="M 490 294 A 22 22 0 0 0 466 270" />
          </g>
          {highlightEnabled && color.streak && (
            <g fill={color.streak} opacity="0.5">
              <circle cx="136" cy="246" r="18" />
              <circle cx="464" cy="246" r="18" />
            </g>
          )}
        </g>
      )}

      {styleId === 'ribbon-halfup' && (
        <g>
          {/* Long silky straight-to-soft-curl back hair */}
          <path
            d="M 164 264 C 148 370, 144 504, 166 648 C 206 672, 250 680, 300 680 C 350 680, 394 672, 434 648 C 456 504, 452 370, 436 264 C 420 176, 368 136, 300 136 C 232 136, 180 176, 164 264 Z"
            fill={deepGrad}
            stroke={color.shadow}
            strokeWidth="3"
          />
          {/* Big pastel half-up bow behind crown */}
          <path d="M 294 148 C 246 112, 206 138, 224 176 C 242 204, 278 182, 294 164 Z" fill="#FF75B5" stroke="#FFF" strokeWidth="2.5" />
          <path d="M 306 148 C 354 112, 394 138, 376 176 C 358 204, 322 182, 306 164 Z" fill="#FF75B5" stroke="#FFF" strokeWidth="2.5" />
          <circle cx="300" cy="158" r="14" fill="#FF4D9E" stroke="#FFF" strokeWidth="2.5" />
          {highlightEnabled && color.streak && (
            <>
              <path d="M 184 360 L 176 620" stroke={color.streak} strokeWidth="14" strokeLinecap="round" opacity="0.65" />
              <path d="M 416 360 L 424 620" stroke={color.streak} strokeWidth="14" strokeLinecap="round" opacity="0.65" />
            </>
          )}
        </g>
      )}

      {styleId === 'fairy-curls' && (
        <g>
          {/* Bouncy spiral fairy ringlets */}
          <path
            d="M 160 256 C 134 340, 124 456, 150 568 C 166 636, 214 662, 250 644 C 270 670, 330 670, 350 644 C 386 662, 434 636, 450 568 C 476 456, 466 340, 440 256 C 422 174, 368 134, 300 134 C 232 134, 178 174, 160 256 Z"
            fill={deepGrad}
            stroke={color.shadow}
            strokeWidth="3"
          />
          {/* Spiral curl silhouettes */}
          {[
            { cx: 158, cy: 480, r: 34 },
            { cx: 178, cy: 562, r: 36 },
            { cx: 442, cy: 480, r: 34 },
            { cx: 422, cy: 562, r: 36 }
          ].map((c, idx) => (
            <circle key={idx} cx={c.cx} cy={c.cy} r={c.r} fill={mainGrad} stroke={color.shadow} strokeWidth="2.5" />
          ))}
          {highlightEnabled && color.streak && (
            <>
              <path d="M 152 440 Q 134 510 176 588" fill="none" stroke={color.streak} strokeWidth="14" strokeLinecap="round" opacity="0.7" />
              <path d="M 448 440 Q 466 510 424 588" fill="none" stroke={color.streak} strokeWidth="14" strokeLinecap="round" opacity="0.7" />
            </>
          )}
        </g>
      )}
    </g>
  );
};

export const HairFront: React.FC<HairProps> = ({ styleId, color, highlightEnabled, uid }) => {
  const isRainbow = color.id === 'rainbow-magic';
  const mainGrad = `url(#${uid}-hair-front-main)`;

  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-hair-front-main`} x1="0" y1="0" x2="1" y2="1">
          {isRainbow ? (
            <>
              <stop offset="0%" stopColor="#FF7AC6" />
              <stop offset="35%" stopColor="#FDE047" />
              <stop offset="68%" stopColor="#67E8F9" />
              <stop offset="100%" stopColor="#A78BFA" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor={color.highlight} />
              <stop offset="45%" stopColor={color.primary} />
              <stop offset="100%" stopColor={color.shadow} />
            </>
          )}
        </linearGradient>
      </defs>
      {/* Top Crown & Soft Framing Bangs tailored to hairstyle */}
      {styleId === 'sweet-bob' ? (
        <g>
          {/* Full cute airy straight bangs */}
          <path
            d="M 176 286 C 174 190, 224 142, 300 142 C 376 142, 426 190, 424 286 C 414 252, 398 240, 386 254 C 372 224, 344 218, 324 246 C 310 218, 290 218, 276 246 C 256 218, 228 224, 214 254 C 202 240, 186 252, 176 286 Z"
            fill={mainGrad}
            stroke={color.shadow}
            strokeWidth="2.8"
          />
          {/* Cheek framing bob tips */}
          <path d="M 178 272 C 166 346, 174 414, 206 446 C 194 398, 194 334, 196 276 Z" fill={mainGrad} stroke={color.shadow} strokeWidth="2.2" />
          <path d="M 422 272 C 434 346, 426 414, 394 446 C 406 398, 406 334, 404 276 Z" fill={mainGrad} stroke={color.shadow} strokeWidth="2.2" />
        </g>
      ) : styleId === 'high-ponytail' || styleId === 'curly-puffs' ? (
        <g>
          {/* Sleek parted crown with cute wispy baby bangs */}
          <path
            d="M 180 286 C 176 192, 228 144, 300 144 C 372 144, 424 192, 420 286 C 410 236, 380 202, 330 198 C 314 218, 298 232, 276 226 C 242 216, 200 228, 180 286 Z"
            fill={mainGrad}
            stroke={color.shadow}
            strokeWidth="2.8"
          />
          {/* Delicate face framing tendrils */}
          <path d="M 184 268 C 176 320, 180 374, 196 402 C 188 360, 192 316, 198 274 Z" fill={mainGrad} stroke={color.shadow} strokeWidth="2" />
          <path d="M 416 268 C 424 320, 420 374, 404 402 C 412 360, 408 316, 402 274 Z" fill={mainGrad} stroke={color.shadow} strokeWidth="2" />
        </g>
      ) : (
        <g>
          {/* Romantic parted princess bangs */}
          <path
            d="M 174 294 C 172 192, 224 140, 300 140 C 376 140, 428 192, 426 294 C 414 246, 386 218, 344 212 C 330 232, 316 244, 300 220 C 284 244, 270 232, 256 212 C 214 218, 186 246, 174 294 Z"
            fill={mainGrad}
            stroke={color.shadow}
            strokeWidth="2.8"
          />
          {/* Soft framing side locks */}
          <path
            d="M 178 272 C 166 340, 172 418, 196 472 C 188 416, 190 342, 196 284 Z"
            fill={mainGrad}
            stroke={color.shadow}
            strokeWidth="2.2"
          />
          <path
            d="M 422 272 C 434 340, 428 418, 404 472 C 412 416, 410 342, 404 284 Z"
            fill={mainGrad}
            stroke={color.shadow}
            strokeWidth="2.2"
          />
        </g>
      )}

      {/* Optional Front Sparkle Streak */}
      {highlightEnabled && color.streak && (
        <>
          <path
            d="M 222 178 C 204 204, 192 240, 188 276"
            fill="none"
            stroke={color.streak}
            strokeWidth="9"
            strokeLinecap="round"
            opacity="0.72"
          />
          <path
            d="M 378 178 C 396 204, 408 240, 412 276"
            fill="none"
            stroke={color.streak}
            strokeWidth="9"
            strokeLinecap="round"
            opacity="0.72"
          />
        </>
      )}

      {/* Glossy Anime-Storybook Hair Halo Shine */}
      <path
        d="M 222 194 C 246 174, 272 170, 290 176"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.38"
      />
      <path
        d="M 314 176 C 334 170, 358 176, 378 194"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.38"
      />
      <circle cx="298" cy="176" r="4" fill="#FFFFFF" opacity="0.45" />
    </g>
  );
};
