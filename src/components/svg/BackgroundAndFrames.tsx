import React from 'react';
import { STAGE_H, STAGE_W } from '../../data/faceGeometry';
import type { BackgroundId, FrameId } from '../../types';

export const StageBackground: React.FC<{ backgroundId: BackgroundId; uid: string }> = ({
  backgroundId,
  uid
}) => {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-bg-vanity`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE6F3" />
          <stop offset="55%" stopColor="#FFF0FA" />
          <stop offset="100%" stopColor="#F5D5FF" />
        </linearGradient>
        <linearGradient id={`${uid}-bg-sakura`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="55%" stopColor="#FFE4F2" />
          <stop offset="100%" stopColor="#FBCFE8" />
        </linearGradient>
        <linearGradient id={`${uid}-bg-palace`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="50%" stopColor="#581C87" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>
        <linearGradient id={`${uid}-bg-rainbow`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="35%" stopColor="#E9D5FF" />
          <stop offset="68%" stopColor="#FBCFE8" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>
        <linearGradient id={`${uid}-bg-meadow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="58%" stopColor="#FEF9C3" />
          <stop offset="100%" stopColor="#A7F3D0" />
        </linearGradient>
        <linearGradient id={`${uid}-bg-carpet`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A044E" />
          <stop offset="55%" stopColor="#9D174D" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>
      </defs>

      {backgroundId === 'vanity-pink' && (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill={`url(#${uid}-bg-vanity)`} />
          {/* Soft pastel stripes */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect key={i} x={i * 80} y="0" width="40" height={STAGE_H} fill="#FFFFFF" opacity="0.22" />
          ))}
          {/* Illuminated Hollywood Vanity Mirror Halo */}
          <circle cx="300" cy="360" r="248" fill="#FFFFFF" opacity="0.45" />
          <circle cx="300" cy="360" r="230" fill="none" stroke="#FFB8DC" strokeWidth="10" opacity="0.7" />
          {/* Glowing vanity bulbs */}
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const bx = 300 + Math.cos(angle) * 230;
            const by = 360 + Math.sin(angle) * 230;
            return (
              <g key={i}>
                <circle cx={bx} cy={by} r="14" fill="#FEF08A" opacity="0.45" />
                <circle cx={bx} cy={by} r="7.5" fill="#FFFDF7" stroke="#FBCFE8" strokeWidth="2" />
              </g>
            );
          })}
        </g>
      )}

      {backgroundId === 'sakura-garden' && (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill={`url(#${uid}-bg-sakura)`} />
          {/* Soft sunlit glow */}
          <circle cx="300" cy="240" r="190" fill="#FFFBEB" opacity="0.45" />
          {/* Cherry blossom branches top corners */}
          <path d="M 0 110 Q 90 120 176 72" fill="none" stroke="#9D6B53" strokeWidth="10" strokeLinecap="round" />
          <path d="M 600 130 Q 500 135 424 78" fill="none" stroke="#9D6B53" strokeWidth="10" strokeLinecap="round" />
          {/* Floating sakura petals & blossoms */}
          {[
            [70, 96, 1.1],
            [140, 78, 0.9],
            [470, 96, 1.1],
            [536, 118, 0.95],
            [92, 260, 0.7],
            [510, 290, 0.75],
            [76, 480, 0.65],
            [524, 510, 0.7]
          ].map(([cx, cy, s], i) => (
            <g key={i} transform={`translate(${cx},${cy}) scale(${s})`}>
              {[0, 72, 144, 216, 288].map((deg) => (
                <ellipse key={deg} cx="0" cy="-10" rx="6" ry="9" fill="#FFB3D9" stroke="#FFF" strokeWidth="1.2" transform={`rotate(${deg})`} />
              ))}
              <circle cx="0" cy="0" r="4" fill="#FDE047" />
            </g>
          ))}
        </g>
      )}

      {backgroundId === 'starlight-palace' && (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill={`url(#${uid}-bg-palace)`} />
          {/* Glowing moon & palace silhouette */}
          <circle cx="480" cy="120" r="54" fill="#FEF9C3" opacity="0.92" />
          <circle cx="480" cy="120" r="78" fill="#FEF08A" opacity="0.22" />
          {/* Twinkling stars */}
          {[
            [80, 90, 12],
            [180, 66, 9],
            [360, 82, 11],
            [96, 230, 8],
            [520, 250, 10],
            [68, 410, 9],
            [530, 440, 11],
            [130, 620, 8],
            [490, 600, 9]
          ].map(([x, y, sz], i) => (
            <path
              key={i}
              d={`M ${x} ${y - sz} L ${x + sz * 0.28} ${y - sz * 0.28} L ${x + sz} ${y} L ${x + sz * 0.28} ${y + sz * 0.28} L ${x} ${y + sz} L ${x - sz * 0.28} ${y + sz * 0.28} L ${x - sz} ${y} L ${x - sz * 0.28} ${y - sz * 0.28} Z`}
              fill="#FFFBEB"
              opacity="0.9"
            />
          ))}
          <circle cx="300" cy="370" r="210" fill="#E879F9" opacity="0.16" />
        </g>
      )}

      {backgroundId === 'rainbow-clouds' && (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill={`url(#${uid}-bg-rainbow)`} />
          {/* Pastel rainbow arc */}
          <path d="M 30 480 A 270 270 0 0 1 570 480" fill="none" stroke="#FF8AC6" strokeWidth="22" opacity="0.55" />
          <path d="M 52 480 A 248 248 0 0 1 548 480" fill="none" stroke="#FDE047" strokeWidth="22" opacity="0.55" />
          <path d="M 74 480 A 226 226 0 0 1 526 480" fill="none" stroke="#6EE7B7" strokeWidth="22" opacity="0.55" />
          <path d="M 96 480 A 204 204 0 0 1 504 480" fill="none" stroke="#7DD3FC" strokeWidth="22" opacity="0.55" />
          {/* Fluffy pastel clouds */}
          <g fill="#FFFFFF" opacity="0.86">
            <circle cx="90" cy="140" r="42" />
            <circle cx="136" cy="144" r="34" />
            <circle cx="56" cy="152" r="30" />
            <circle cx="508" cy="170" r="44" />
            <circle cx="462" cy="176" r="34" />
            <circle cx="546" cy="182" r="28" />
            <circle cx="96" cy="640" r="56" />
            <circle cx="506" cy="640" r="56" />
          </g>
        </g>
      )}

      {backgroundId === 'butterfly-meadow' && (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill={`url(#${uid}-bg-meadow)`} />
          <circle cx="110" cy="110" r="52" fill="#FEF08A" opacity="0.85" />
          {/* Soft green rolling hills */}
          <path d="M 0 640 Q 160 560 320 620 Q 480 680 600 590 L 600 800 L 0 800 Z" fill="#6EE7B7" opacity="0.6" />
          {/* Floating butterflies */}
          {[
            [92, 230, '#FF8AC6'],
            [506, 190, '#C084FC'],
            [490, 380, '#38BDF8'],
            [86, 440, '#FBBF24']
          ].map(([x, y, c], i) => (
            <g key={i} transform={`translate(${x},${y}) rotate(${i % 2 === 0 ? -15 : 15})`}>
              <ellipse cx="-10" cy="-5" rx="11" ry="8" fill={c as string} opacity="0.85" />
              <ellipse cx="10" cy="-5" rx="11" ry="8" fill={c as string} opacity="0.85" />
              <ellipse cx="-7" cy="7" rx="8" ry="6" fill={c as string} opacity="0.7" />
              <ellipse cx="7" cy="7" rx="8" ry="6" fill={c as string} opacity="0.7" />
            </g>
          ))}
        </g>
      )}

      {backgroundId === 'royal-carpet' && (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill={`url(#${uid}-bg-carpet)`} />
          {/* Glamorous stage spotlight beams */}
          <polygon points="80,0 240,0 380,800 180,800" fill="#FFFBEB" opacity="0.12" />
          <polygon points="360,0 520,0 420,800 220,800" fill="#FFFBEB" opacity="0.12" />
          {/* Bokeh lights */}
          {[
            [72, 130, 26],
            [520, 140, 30],
            [110, 360, 20],
            [495, 390, 24],
            [80, 610, 28],
            [524, 590, 26]
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="#FEF08A" opacity="0.22" />
          ))}
        </g>
      )}
    </g>
  );
};

export const PhotoFrameOverlay: React.FC<{
  frameId: FrameId;
  characterName: string;
}> = ({ frameId, characterName }) => {
  if (frameId === 'none') return null;

  return (
    <g>
      {frameId === 'polaroid-cute' && (
        <g>
          <path
            d={`M 0 0 H ${STAGE_W} V ${STAGE_H} H 0 Z M 30 30 V 684 H 570 V 30 Z`}
            fill="#FFFDF9"
            fillRule="evenodd"
          />
          <rect x="30" y="30" width="540" height="654" fill="none" stroke="#FBCFE8" strokeWidth="5" />
          <text
            x="300"
            y="754"
            textAnchor="middle"
            fontFamily="Fredoka, Nunito, sans-serif"
            fontSize="34"
            fontWeight="700"
            fill="#EC4899"
          >
            ✦ {characterName} • Starlight Studio ✦
          </text>
        </g>
      )}

      {frameId === 'royal-gold' && (
        <g>
          <rect x="14" y="14" width={STAGE_W - 28} height={STAGE_H - 28} rx="28" fill="none" stroke="#F59E0B" strokeWidth="14" />
          <rect x="28" y="28" width={STAGE_W - 56} height={STAGE_H - 56} rx="20" fill="none" stroke="#FEF08A" strokeWidth="4" />
          {/* Corner sparkles */}
          {[
            [42, 42],
            [558, 42],
            [42, 758],
            [558, 758]
          ].map(([x, y], i) => (
            <path
              key={i}
              d={`M ${x} ${y - 18} L ${x + 5} ${y - 5} L ${x + 18} ${y} L ${x + 5} ${y + 5} L ${x} ${y + 18} L ${x - 5} ${y + 5} L ${x - 18} ${y} L ${x - 5} ${y - 5} Z`}
              fill="#FEF08A"
              stroke="#D97706"
              strokeWidth="1.5"
            />
          ))}
        </g>
      )}

      {frameId === 'magazine-star' && (
        <g>
          <rect x="12" y="12" width={STAGE_W - 24} height={STAGE_H - 24} fill="none" stroke="#FFFFFF" strokeWidth="10" />
          <rect x="0" y="0" width={STAGE_W} height="104" fill="#EC4899" opacity="0.86" />
          <text
            x="300"
            y="72"
            textAnchor="middle"
            fontFamily="Fredoka, Nunito, sans-serif"
            fontSize="54"
            fontWeight="700"
            letterSpacing="6"
            fill="#FFFFFF"
          >
            STARLIGHT
          </text>
          <rect x="34" y="698" width="248" height="66" rx="18" fill="#FFFFFF" opacity="0.92" />
          <text x="54" y="728" fontFamily="Fredoka, Nunito, sans-serif" fontSize="22" fontWeight="700" fill="#DB2777">
            COVER STAR: {characterName.toUpperCase()}
          </text>
          <text x="54" y="752" fontFamily="Nunito, sans-serif" fontSize="15" fontWeight="700" fill="#7C3AED">
            ★ BEAUTY & FASHION EDITION ★
          </text>
        </g>
      )}

      {frameId === 'sparkle-hearts' && (
        <g>
          <rect x="16" y="16" width={STAGE_W - 32} height={STAGE_H - 32} rx="32" fill="none" stroke="#FF8AC6" strokeWidth="12" strokeDasharray="24 12" />
          {[
            [48, 56],
            [552, 56],
            [48, 744],
            [552, 744],
            [300, 36],
            [300, 764]
          ].map(([x, y], i) => (
            <path
              key={i}
              transform={`translate(${x},${y})`}
              d="M 0 14 C -16 3, -18 -11, -7 -13 C -2 -13, 0 -8, 0 -6 C 0 -8, 2 -13, 7 -13 C 18 -11, 16 3, 0 14 Z"
              fill={i % 2 === 0 ? '#FF4D9E' : '#C084FC'}
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />
          ))}
        </g>
      )}
    </g>
  );
};
