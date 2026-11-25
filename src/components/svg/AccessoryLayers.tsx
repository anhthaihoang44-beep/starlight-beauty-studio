import React from 'react';
import { LEFT_EARLOBE, RIGHT_EARLOBE } from '../../data/faceGeometry';
import type {
  EarringId,
  GlassesId,
  HeadwearId,
  NecklaceId,
  StickerTypeId,
  WingsId
} from '../../types';

export const WingsLayer: React.FC<{ wingsId: WingsId; uid: string }> = ({ wingsId, uid }) => {
  if (wingsId === 'none') return null;

  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-wing-fairy`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A5F3FC" stopOpacity="0.88" />
          <stop offset="50%" stopColor="#F5D0FE" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.88" />
        </linearGradient>
        <linearGradient id={`${uid}-wing-bfly`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF7AC6" stopOpacity="0.92" />
          <stop offset="60%" stopColor="#C084FC" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FDE047" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {wingsId === 'fairy-iridescent' && (
        <g>
          {/* Left upper + lower fairy wing */}
          <path
            d="M 248 540 C 166 424, 52 382, 42 462 C 34 524, 118 570, 210 582 Z"
            fill={`url(#${uid}-wing-fairy)`}
            stroke="#FFFFFF"
            strokeWidth="3.5"
          />
          <path
            d="M 226 588 C 148 584, 68 624, 92 686 C 112 732, 186 704, 232 632 Z"
            fill={`url(#${uid}-wing-fairy)`}
            stroke="#FFFFFF"
            strokeWidth="3.5"
          />
          {/* Right upper + lower fairy wing */}
          <path
            d="M 352 540 C 434 424, 548 382, 558 462 C 566 524, 482 570, 390 582 Z"
            fill={`url(#${uid}-wing-fairy)`}
            stroke="#FFFFFF"
            strokeWidth="3.5"
          />
          <path
            d="M 374 588 C 452 584, 532 624, 508 686 C 488 732, 414 704, 368 632 Z"
            fill={`url(#${uid}-wing-fairy)`}
            stroke="#FFFFFF"
            strokeWidth="3.5"
          />
          {/* Wing sparkle veins */}
          <path d="M 218 544 Q 134 472 78 466" fill="none" stroke="#FFF" strokeWidth="2.5" opacity="0.8" />
          <path d="M 382 544 Q 466 472 522 466" fill="none" stroke="#FFF" strokeWidth="2.5" opacity="0.8" />
        </g>
      )}

      {wingsId === 'angel-feather' && (
        <g>
          <g fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2.5">
            <path d="M 234 548 C 168 456, 70 434, 46 494 C 78 518, 128 534, 178 552 C 110 546, 56 566, 62 608 C 102 618, 152 608, 198 594 C 138 614, 92 648, 112 684 C 156 688, 206 654, 238 614 Z" />
            <path d="M 366 548 C 432 456, 530 434, 554 494 C 522 518, 472 534, 422 552 C 490 546, 544 566, 538 608 C 498 618, 448 608, 402 594 C 462 614, 508 648, 488 684 C 444 688, 394 654, 362 614 Z" />
          </g>
          <path d="M 214 550 C 154 496, 100 486, 76 498" fill="none" stroke="#FEF08A" strokeWidth="3" opacity="0.85" />
          <path d="M 386 550 C 446 496, 500 486, 524 498" fill="none" stroke="#FEF08A" strokeWidth="3" opacity="0.85" />
        </g>
      )}

      {wingsId === 'butterfly-pink' && (
        <g>
          <path
            d="M 244 554 C 174 432, 46 390, 42 486 C 38 564, 134 590, 210 594 C 122 606, 66 664, 108 724 C 144 762, 214 708, 240 626 Z"
            fill={`url(#${uid}-wing-bfly)`}
            stroke="#FFF0F7"
            strokeWidth="4"
          />
          <path
            d="M 356 554 C 426 432, 554 390, 558 486 C 562 564, 466 590, 390 594 C 478 606, 534 664, 492 724 C 456 762, 386 708, 360 626 Z"
            fill={`url(#${uid}-wing-bfly)`}
            stroke="#FFF0F7"
            strokeWidth="4"
          />
          {/* Butterfly decorative spots */}
          {[
            [102, 488, 16],
            [140, 536, 11],
            [138, 682, 13],
            [498, 488, 16],
            [460, 536, 11],
            [462, 682, 13]
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="#FFF9C4" opacity="0.85" />
          ))}
        </g>
      )}

      {wingsId === 'starlight-crystal' && (
        <g>
          <g fill="#E0F2FE" fillOpacity="0.82" stroke="#7DD3FC" strokeWidth="3">
            <polygon points="240,564 60,420 112,544 46,574 152,608 86,692 224,626" />
            <polygon points="360,564 540,420 488,544 554,574 448,608 514,692 376,626" />
          </g>
          <circle cx="110" cy="488" r="8" fill="#FEF08A" />
          <circle cx="490" cy="488" r="8" fill="#FEF08A" />
        </g>
      )}
    </g>
  );
};

export const EarringsLayer: React.FC<{ earringId: EarringId }> = ({ earringId }) => {
  if (earringId === 'none') return null;

  const renderPair = (renderOne: (x: number, y: number, side: -1 | 1) => React.ReactNode) => (
    <g>
      {renderOne(LEFT_EARLOBE.x, LEFT_EARLOBE.y, -1)}
      {renderOne(RIGHT_EARLOBE.x, RIGHT_EARLOBE.y, 1)}
    </g>
  );

  switch (earringId) {
    case 'pearl-drops':
      return renderPair((x, y) => (
        <g key={`p-${x}`}>
          <circle cx={x} cy={y} r="4.5" fill="#FDE047" stroke="#D97706" strokeWidth="1" />
          <line x1={x} y1={y + 4} x2={x} y2={y + 14} stroke="#FDE047" strokeWidth="2" />
          <circle cx={x} cy={y + 20} r="9" fill="#FFFDF9" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx={x - 3} cy={y + 17} r="2.8" fill="#FFFFFF" />
        </g>
      ));
    case 'star-studs':
      return renderPair((x, y) => (
        <g key={`s-${x}`} transform={`translate(${x},${y + 6})`}>
          <path
            d="M 0 -13 L 3.8 -4 L 13 -3 L 6 3.5 L 8 13 L 0 8 L -8 13 L -6 3.5 L -13 -3 L -3.8 -4 Z"
            fill="#FDE047"
            stroke="#F59E0B"
            strokeWidth="1.8"
          />
          <circle cx="0" cy="0" r="3" fill="#FFF" />
        </g>
      ));
    case 'heart-hoops':
      return renderPair((x, y) => (
        <g key={`h-${x}`} transform={`translate(${x},${y + 14})`}>
          <circle cx="0" cy="-14" r="3.5" fill="#FDE047" />
          <path
            d="M 0 11 C -13 2, -14 -10, -5 -11 C -2 -11, 0 -8, 0 -6 C 0 -8, 2 -11, 5 -11 C 14 -10, 13 2, 0 11 Z"
            fill="#FF5CA8"
            stroke="#FFF"
            strokeWidth="1.8"
          />
          <circle cx="-4" cy="-5" r="2.2" fill="#FFF" opacity="0.8" />
        </g>
      ));
    case 'crystal-drops':
      return renderPair((x, y) => (
        <g key={`c-${x}`} transform={`translate(${x},${y + 14})`}>
          <circle cx="0" cy="-14" r="4" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.2" />
          <polygon points="0,-9 9,3 0,18 -9,3" fill="#7DD3FC" stroke="#FFFFFF" strokeWidth="1.8" />
          <polygon points="0,-5 4,3 0,11 -4,3" fill="#E0F2FE" />
        </g>
      ));
    case 'sakura-drops':
      return renderPair((x, y) => (
        <g key={`sk-${x}`} transform={`translate(${x},${y + 12})`}>
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse key={deg} cx="0" cy="-7" rx="4.2" ry="6.5" fill="#FFB3D9" stroke="#F472B6" strokeWidth="1" transform={`rotate(${deg})`} />
          ))}
          <circle cx="0" cy="0" r="3.5" fill="#FDE047" />
        </g>
      ));
    case 'butterfly-studs':
      return renderPair((x, y) => (
        <g key={`b-${x}`} transform={`translate(${x},${y + 10})`}>
          <ellipse cx="-6" cy="-3" rx="6.5" ry="5" fill="#C084FC" stroke="#FFF" strokeWidth="1.2" transform="rotate(-20 -6 -3)" />
          <ellipse cx="6" cy="-3" rx="6.5" ry="5" fill="#C084FC" stroke="#FFF" strokeWidth="1.2" transform="rotate(20 6 -3)" />
          <ellipse cx="-5" cy="5" rx="4.5" ry="3.8" fill="#F472B6" stroke="#FFF" strokeWidth="1.2" />
          <ellipse cx="5" cy="5" rx="4.5" ry="3.8" fill="#F472B6" stroke="#FFF" strokeWidth="1.2" />
          <rect x="-1.6" y="-6" width="3.2" height="13" rx="1.6" fill="#6D28D9" />
        </g>
      ));
    default:
      return null;
  }
};

export const NecklaceLayer: React.FC<{ necklaceId: NecklaceId }> = ({ necklaceId }) => {
  if (necklaceId === 'none') return null;

  return (
    <g>
      {necklaceId === 'pearl-choker' && (
        <g>
          {[-42, -28, -14, 0, 14, 28, 42].map((dx, i) => (
            <g key={i}>
              <circle
                cx={300 + dx}
                cy={502 + Math.cos(dx * 0.032) * 14}
                r="7.5"
                fill="#FFFDF9"
                stroke="#CBD5E1"
                strokeWidth="1.5"
              />
              <circle cx={298 + dx} cy={500 + Math.cos(dx * 0.032) * 14} r="2.2" fill="#FFFFFF" />
            </g>
          ))}
        </g>
      )}

      {necklaceId === 'heart-pendant' && (
        <g>
          <path d="M 254 500 Q 300 546 346 500" fill="none" stroke="#FBBF24" strokeWidth="3.2" />
          <g transform="translate(300, 535)">
            <path
              d="M 0 15 C -17 4, -18 -11, -7 -12 C -2 -12, 0 -8, 0 -6 C 0 -8, 2 -12, 7 -12 C 18 -11, 17 4, 0 15 Z"
              fill="#FF4D9E"
              stroke="#FDE047"
              strokeWidth="2.5"
            />
            <circle cx="-5" cy="-5" r="2.8" fill="#FFF" opacity="0.85" />
          </g>
        </g>
      )}

      {necklaceId === 'star-gem' && (
        <g>
          <path d="M 254 498 Q 300 544 346 498" fill="none" stroke="#E2E8F0" strokeWidth="3" />
          <g transform="translate(300, 534)">
            <path
              d="M 0 -17 L 5 -5 L 17 -4 L 8 4.5 L 11 17 L 0 10 L -11 17 L -8 4.5 L -17 -4 L -5 -5 Z"
              fill="#38BDF8"
              stroke="#FFFFFF"
              strokeWidth="2.2"
            />
            <circle cx="0" cy="0" r="4.5" fill="#FEF08A" />
          </g>
        </g>
      )}

      {necklaceId === 'ribbon-choker' && (
        <g>
          <path d="M 262 496 Q 300 510 338 496" fill="none" stroke="#EC4899" strokeWidth="11" strokeLinecap="round" />
          <path d="M 300 503 L 280 492 L 282 514 Z" fill="#FF7AC6" stroke="#FFF" strokeWidth="1.5" />
          <path d="M 300 503 L 320 492 L 318 514 Z" fill="#FF7AC6" stroke="#FFF" strokeWidth="1.5" />
          <circle cx="300" cy="503" r="6" fill="#FDE047" stroke="#FFF" strokeWidth="1.5" />
        </g>
      )}

      {necklaceId === 'flower-garland' && (
        <g>
          <path d="M 252 504 Q 300 540 348 504" fill="none" stroke="#34D399" strokeWidth="3.5" />
          {[-32, -16, 0, 16, 32].map((dx, i) => {
            const cy = 512 + Math.cos(dx * 0.04) * 14;
            const fill = i % 2 === 0 ? '#FF8AC6' : '#C084FC';
            return (
              <g key={i} transform={`translate(${300 + dx},${cy})`}>
                {[0, 72, 144, 216, 288].map((deg) => (
                  <ellipse key={deg} cx="0" cy="-6" rx="3.8" ry="5.5" fill={fill} transform={`rotate(${deg})`} />
                ))}
                <circle cx="0" cy="0" r="3" fill="#FDE047" />
              </g>
            );
          })}
        </g>
      )}

      {necklaceId === 'royal-collar' && (
        <g>
          <path d="M 248 504 Q 300 546 352 504" fill="none" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
          {[-30, -15, 0, 15, 30].map((dx, i) => {
            const cy = 516 + Math.cos(dx * 0.04) * 16;
            const size = dx === 0 ? 11 : 7;
            return (
              <polygon
                key={i}
                points={`${300 + dx},${cy - size} ${300 + dx + size * 0.7},${cy} ${300 + dx},${cy + size * 1.2} ${300 + dx - size * 0.7},${cy}`}
                fill={dx === 0 ? '#EC4899' : '#38BDF8'}
                stroke="#FDE047"
                strokeWidth="2"
              />
            );
          })}
        </g>
      )}
    </g>
  );
};

export const GlassesLayer: React.FC<{ glassesId: GlassesId }> = ({ glassesId }) => {
  if (glassesId === 'none') return null;

  return (
    <g>
      {glassesId === 'heart-shades' && (
        <g>
          <line x1="282" y1="320" x2="318" y2="320" stroke="#FF4D9E" strokeWidth="5" />
          {[242, 358].map((cx) => (
            <g key={cx} transform={`translate(${cx}, 328)`}>
              <path
                d="M 0 28 C -36 10, -40 -22, -16 -24 C -6 -24, 0 -15, 0 -10 C 0 -15, 6 -24, 16 -24 C 40 -22, 36 10, 0 28 Z"
                fill="#FF8AC6"
                fillOpacity="0.45"
                stroke="#FF4D9E"
                strokeWidth="5"
              />
              <path d="M -20 -10 L -8 -16" stroke="#FFF" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
            </g>
          ))}
        </g>
      )}

      {glassesId === 'star-glasses' && (
        <g>
          <line x1="278" y1="324" x2="322" y2="324" stroke="#F59E0B" strokeWidth="5" />
          {[242, 358].map((cx) => (
            <g key={cx} transform={`translate(${cx}, 326)`}>
              <path
                d="M 0 -32 L 9 -10 L 32 -8 L 14 7 L 20 30 L 0 17 L -20 30 L -14 7 L -32 -8 L -9 -10 Z"
                fill="#FEF08A"
                fillOpacity="0.42"
                stroke="#F59E0B"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
            </g>
          ))}
        </g>
      )}

      {glassesId === 'round-pastel' && (
        <g>
          <path d="M 282 324 Q 300 316 318 324" fill="none" stroke="#A855F7" strokeWidth="4.5" />
          <circle cx="244" cy="326" r="36" fill="#F3E8FF" fillOpacity="0.32" stroke="#A855F7" strokeWidth="5" />
          <circle cx="356" cy="326" r="36" fill="#F3E8FF" fillOpacity="0.32" stroke="#A855F7" strokeWidth="5" />
          <path d="M 222 308 Q 232 298 244 300" fill="none" stroke="#FFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
          <path d="M 334 308 Q 344 298 356 300" fill="none" stroke="#FFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
        </g>
      )}

      {glassesId === 'cat-eye-glam' && (
        <g>
          <line x1="284" y1="322" x2="316" y2="322" stroke="#EC4899" strokeWidth="4.5" />
          <path
            d="M 196 304 C 224 298, 268 302, 284 318 C 282 346, 258 358, 232 354 C 206 348, 200 326, 196 304 Z"
            fill="#F472B6"
            fillOpacity="0.35"
            stroke="#DB2777"
            strokeWidth="5"
          />
          <path
            d="M 404 304 C 376 298, 332 302, 316 318 C 318 346, 342 358, 368 354 C 394 348, 400 326, 404 304 Z"
            fill="#F472B6"
            fillOpacity="0.35"
            stroke="#DB2777"
            strokeWidth="5"
          />
          <circle cx="204" cy="308" r="3.5" fill="#FEF08A" />
          <circle cx="396" cy="308" r="3.5" fill="#FEF08A" />
        </g>
      )}
    </g>
  );
};

export const HeadwearLayer: React.FC<{ headwearId: HeadwearId }> = ({ headwearId }) => {
  if (headwearId === 'none') return null;

  return (
    <g>
      {headwearId === 'crystal-tiara' && (
        <g transform="translate(300, 166)">
          <path
            d="M -78 16 Q 0 2 78 16 L 64 -20 L 36 0 L 22 -36 L 0 -10 L -22 -36 L -36 0 L -64 -20 Z"
            fill="#FDE047"
            stroke="#D97706"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M -68 14 Q 0 2 68 14 L 54 -14 L 32 2 L 18 -26 L 0 -4 L -18 -26 L -32 2 L -54 -14 Z"
            fill="#FEF9C4"
            opacity="0.7"
          />
          {/* Jewels */}
          <polygon points="0,-46 10,-28 0,-12 -10,-28" fill="#FF4D9E" stroke="#FFF" strokeWidth="2" />
          <circle cx="-38" cy="-12" r="6" fill="#38BDF8" stroke="#FFF" strokeWidth="1.8" />
          <circle cx="38" cy="-12" r="6" fill="#38BDF8" stroke="#FFF" strokeWidth="1.8" />
          <circle cx="-64" cy="-22" r="5" fill="#C084FC" stroke="#FFF" strokeWidth="1.5" />
          <circle cx="64" cy="-22" r="5" fill="#C084FC" stroke="#FFF" strokeWidth="1.5" />
        </g>
      )}

      {headwearId === 'flower-crown' && (
        <g transform="translate(300, 174)">
          <path d="M -98 22 Q 0 -14 98 22" fill="none" stroke="#34D399" strokeWidth="9" strokeLinecap="round" />
          {[
            { x: -72, y: 12, color: '#FF8AC6', s: 1 },
            { x: -38, y: 0, color: '#FDE047', s: 1.15 },
            { x: 0, y: -6, color: '#FF5CA8', s: 1.3 },
            { x: 38, y: 0, color: '#C084FC', s: 1.15 },
            { x: 72, y: 12, color: '#38BDF8', s: 1 }
          ].map((f, i) => (
            <g key={i} transform={`translate(${f.x},${f.y}) scale(${f.s})`}>
              {[0, 72, 144, 216, 288].map((deg) => (
                <ellipse key={deg} cx="0" cy="-10" rx="6.5" ry="9" fill={f.color} stroke="#FFF" strokeWidth="1.2" transform={`rotate(${deg})`} />
              ))}
              <circle cx="0" cy="0" r="5.5" fill="#FEF08A" />
            </g>
          ))}
        </g>
      )}

      {headwearId === 'cat-ears' && (
        <g>
          <path d="M 192 186 Q 300 132 408 186" fill="none" stroke="#FF6BB5" strokeWidth="10" strokeLinecap="round" />
          {/* Left cat ear */}
          <path d="M 200 176 L 182 106 L 254 148 Z" fill="#FF6BB5" stroke="#FFF" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M 206 164 L 195 122 L 238 148 Z" fill="#FFD1E8" />
          {/* Right cat ear */}
          <path d="M 400 176 L 418 106 L 346 148 Z" fill="#FF6BB5" stroke="#FFF" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M 394 164 L 405 122 L 362 148 Z" fill="#FFD1E8" />
        </g>
      )}

      {headwearId === 'velvet-bow' && (
        <g transform="translate(300, 152)">
          <path d="M -8 0 C -58 -42, -104 -10, -82 28 C -64 52, -26 28, -8 12 Z" fill="#FF4D9E" stroke="#FFF" strokeWidth="3" />
          <path d="M 8 0 C 58 -42, 104 -10, 82 28 C 64 52, 26 28, 8 12 Z" fill="#FF4D9E" stroke="#FFF" strokeWidth="3" />
          <path d="M -46 6 C -64 -4, -74 6, -64 18" fill="none" stroke="#FF9AD5" strokeWidth="5" strokeLinecap="round" />
          <path d="M 46 6 C 64 -4, 74 6, 64 18" fill="none" stroke="#FF9AD5" strokeWidth="5" strokeLinecap="round" />
          <rect x="-15" y="-12" width="30" height="30" rx="12" fill="#DB2777" stroke="#FFF" strokeWidth="3" />
          <circle cx="0" cy="3" r="5" fill="#FEF08A" />
        </g>
      )}

      {headwearId === 'butterfly-clips' && (
        <g>
          {[
            { x: 210, y: 204, rot: -18, c1: '#FF7AC6', c2: '#FDE047' },
            { x: 390, y: 204, rot: 18, c1: '#38BDF8', c2: '#C084FC' }
          ].map((b, i) => (
            <g key={i} transform={`translate(${b.x},${b.y}) rotate(${b.rot})`}>
              <ellipse cx="-14" cy="-8" rx="16" ry="12" fill={b.c1} stroke="#FFF" strokeWidth="2" transform="rotate(-18 -14 -8)" />
              <ellipse cx="14" cy="-8" rx="16" ry="12" fill={b.c1} stroke="#FFF" strokeWidth="2" transform="rotate(18 14 -8)" />
              <ellipse cx="-10" cy="10" rx="11" ry="9" fill={b.c2} stroke="#FFF" strokeWidth="2" />
              <ellipse cx="10" cy="10" rx="11" ry="9" fill={b.c2} stroke="#FFF" strokeWidth="2" />
              <rect x="-3" y="-13" width="6" height="28" rx="3" fill="#6D28D9" />
            </g>
          ))}
        </g>
      )}

      {headwearId === 'star-halo' && (
        <g transform="translate(300, 128)">
          <ellipse cx="0" cy="0" rx="74" ry="18" fill="none" stroke="#FDE047" strokeWidth="7" opacity="0.95" />
          <ellipse cx="0" cy="0" rx="74" ry="18" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
          {[
            [-74, 0],
            [0, -18],
            [74, 0]
          ].map(([x, y], i) => (
            <path
              key={i}
              d={`M ${x} ${y - 12} L ${x + 3.5} ${y - 3.5} L ${x + 12} ${y} L ${x + 3.5} ${y + 3.5} L ${x} ${y + 12} L ${x - 3.5} ${y + 3.5} L ${x - 12} ${y} L ${x - 3.5} ${y - 3.5} Z`}
              fill="#FFF9C4"
              stroke="#F59E0B"
              strokeWidth="1.4"
            />
          ))}
        </g>
      )}

      {headwearId === 'pearl-band' && (
        <g>
          {[-88, -68, -46, -24, 0, 24, 46, 68, 88].map((dx, i) => {
            const cy = 194 - Math.cos(dx * 0.017) * 34;
            return (
              <g key={i}>
                <circle cx={300 + dx} cy={cy} r="10.5" fill="#FFFDF9" stroke="#FBCFE8" strokeWidth="2.2" />
                <circle cx={297 + dx} cy={cy - 3} r="3" fill="#FFFFFF" />
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
};

export const StickerGraphic: React.FC<{
  type: StickerTypeId;
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
}> = ({ type, x = 0, y = 0, scale = 1, rotation = 0 }) => {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotation}) scale(${scale})`}>
      {type === 'star-gem' && (
        <g>
          <path d="M 0 -15 L 4 -4 L 15 -3 L 7 4 L 9 15 L 0 9 L -9 15 L -7 4 L -15 -3 L -4 -4 Z" fill="#FDE047" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="0" cy="0" r="3.5" fill="#FFF" />
        </g>
      )}
      {type === 'pink-heart' && (
        <path
          d="M 0 12 C -14 2, -16 -10, -6 -12 C -2 -12, 0 -8, 0 -6 C 0 -8, 2 -12, 6 -12 C 16 -10, 14 2, 0 12 Z"
          fill="#FF5CA8"
          stroke="#FFFFFF"
          strokeWidth="2"
        />
      )}
      {type === 'crystal-drop' && (
        <g>
          <path d="M 0 -14 C 9 -2, 10 8, 0 14 C -10 8, -9 -2, 0 -14 Z" fill="#7DD3FC" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="-2.5" cy="2" r="2.5" fill="#FFFFFF" />
        </g>
      )}
      {type === 'butterfly' && (
        <g>
          <ellipse cx="-8" cy="-4" rx="8" ry="6" fill="#C084FC" stroke="#FFF" strokeWidth="1.5" transform="rotate(-18 -8 -4)" />
          <ellipse cx="8" cy="-4" rx="8" ry="6" fill="#C084FC" stroke="#FFF" strokeWidth="1.5" transform="rotate(18 8 -4)" />
          <ellipse cx="-6" cy="6" rx="5.5" ry="4.5" fill="#FF8AC6" stroke="#FFF" strokeWidth="1.5" />
          <ellipse cx="6" cy="6" rx="5.5" ry="4.5" fill="#FF8AC6" stroke="#FFF" strokeWidth="1.5" />
          <rect x="-1.8" y="-7" width="3.6" height="15" rx="1.8" fill="#6D28D9" />
        </g>
      )}
      {type === 'rainbow' && (
        <g>
          <path d="M -14 6 A 14 14 0 0 1 14 6" fill="none" stroke="#FF6B9E" strokeWidth="4" strokeLinecap="round" />
          <path d="M -10 6 A 10 10 0 0 1 10 6" fill="none" stroke="#FDE047" strokeWidth="4" strokeLinecap="round" />
          <path d="M -6 6 A 6 6 0 0 1 6 6" fill="none" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
          <circle cx="-13" cy="7" r="4.5" fill="#FFF" />
          <circle cx="13" cy="7" r="4.5" fill="#FFF" />
        </g>
      )}
      {type === 'sakura' && (
        <g>
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse key={deg} cx="0" cy="-7.5" rx="4.5" ry="7" fill="#FFB3D9" stroke="#FFF" strokeWidth="1.2" transform={`rotate(${deg})`} />
          ))}
          <circle cx="0" cy="0" r="3.5" fill="#FDE047" />
        </g>
      )}
      {type === 'moon' && (
        <path d="M 6 -12 A 12 12 0 1 0 6 12 A 9 9 0 1 1 6 -12 Z" fill="#FDE047" stroke="#F59E0B" strokeWidth="1.8" />
      )}
      {type === 'freckles' && (
        <g fill="#FBBF24" stroke="#FFFFFF" strokeWidth="1">
          <circle cx="-10" cy="-2" r="3" />
          <circle cx="0" cy="4" r="3.5" />
          <circle cx="10" cy="-3" r="2.8" />
          <circle cx="-4" cy="-8" r="2.2" />
          <circle cx="6" cy="7" r="2.4" />
        </g>
      )}
      {type === 'pearls' && (
        <g>
          <circle cx="-8" cy="2" r="4.8" fill="#FFFDF9" stroke="#CBD5E1" strokeWidth="1.2" />
          <circle cx="0" cy="-5" r="5.5" fill="#FFFDF9" stroke="#CBD5E1" strokeWidth="1.2" />
          <circle cx="8" cy="2" r="4.8" fill="#FFFDF9" stroke="#CBD5E1" strokeWidth="1.2" />
        </g>
      )}
      {type === 'diamond' && (
        <g>
          <polygon points="0,-14 11,0 0,14 -11,0" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="2" />
          <polygon points="0,-8 5,0 0,8 -5,0" fill="#FFFFFF" />
        </g>
      )}
      {type === 'candy-bow' && (
        <g>
          <path d="M 0 0 L -13 -9 L -11 9 Z" fill="#FF6BB5" stroke="#FFF" strokeWidth="1.6" />
          <path d="M 0 0 L 13 -9 L 11 9 Z" fill="#FF6BB5" stroke="#FFF" strokeWidth="1.6" />
          <circle cx="0" cy="0" r="4.2" fill="#FDE047" stroke="#FFF" strokeWidth="1.4" />
        </g>
      )}
      {type === 'sparkle-dust' && (
        <g fill="#FFF9C4" stroke="#F59E0B" strokeWidth="0.9">
          <path d="M 0 -13 L 2.5 -2.5 L 13 0 L 2.5 2.5 L 0 13 L -2.5 2.5 L -13 0 L -2.5 -2.5 Z" />
          <circle cx="-11" cy="-9" r="2.5" fill="#FF8AC6" stroke="none" />
          <circle cx="11" cy="9" r="2.5" fill="#38BDF8" stroke="none" />
        </g>
      )}
    </g>
  );
};
