import React from 'react';
import type { MakeupToolId, SpaToolId } from '../../types';

interface ToolCursorProps {
  x: number; // stage coordinates 0..600
  y: number; // stage coordinates 0..800
  active: boolean;
  mode: 'makeup' | 'spa';
  makeupTool: MakeupToolId;
  spaTool: SpaToolId;
  color: string;
}

export const ToolCursor: React.FC<ToolCursorProps> = ({
  x,
  y,
  active,
  mode,
  makeupTool,
  spaTool,
  color
}) => {
  if (!active) return null;

  return (
    <g transform={`translate(${x}, ${y})`} style={{ pointerEvents: 'none' }}>
      {/* Soft glow halo at active tip */}
      <circle cx="0" cy="0" r="14" fill="#FFFFFF" opacity="0.35" />

      {mode === 'spa' ? (
        spaTool === 'rinse' ? (
          // Magic water sponge / splash wand
          <g transform="rotate(35)">
            <ellipse cx="28" cy="18" rx="28" ry="20" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="3" />
            <circle cx="18" cy="12" r="5" fill="#FFF" opacity="0.8" />
            <circle cx="36" cy="22" r="4" fill="#FFF" opacity="0.7" />
          </g>
        ) : spaTool === 'primer' ? (
          // Glowing starlight serum dropper
          <g transform="rotate(32)">
            <path d="M 0 0 L 16 14 L 58 52 L 46 64 L 6 24 Z" fill="#FEF08A" stroke="#F59E0B" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="6" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="2" />
            <rect x="44" y="42" width="24" height="30" rx="10" transform="rotate(-45 56 57)" fill="#FF8AC6" stroke="#FFF" strokeWidth="2" />
          </g>
        ) : (
          // Soft pastel spa brush / bubble puff
          <g transform="rotate(36)">
            <rect x="14" y="-8" width="68" height="16" rx="8" fill="#FF8AC6" stroke="#FFF" strokeWidth="2" />
            <path d="M -4 -12 C 6 -16, 18 -14, 18 0 C 18 14, 6 16, -4 12 Z" fill={spaTool === 'mask' ? '#A7F3D0' : '#E0F2FE'} stroke="#FFF" strokeWidth="2" />
          </g>
        )
      ) : makeupTool === 'lipstick' ? (
        // Cute sculpted lipstick tube angled so tip is at (0,0)
        <g transform="rotate(38)">
          {/* Slanted pigmented lipstick bullet */}
          <path d="M 0 -8 L 28 -10 L 28 10 L 0 8 C -5 4, -5 -4, 0 -8 Z" fill={color} stroke="#FFF" strokeWidth="1.5" />
          <path d="M 3 -5 L 22 -6" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
          {/* Metallic gold collar */}
          <rect x="26" y="-12" width="16" height="24" rx="3" fill="#FDE047" stroke="#D97706" strokeWidth="1.8" />
          {/* Pink enamel case */}
          <rect x="42" y="-13" width="44" height="26" rx="6" fill="#FF6BB5" stroke="#DB2777" strokeWidth="2" />
          <circle cx="64" cy="0" r="5" fill="#FFF9C4" />
        </g>
      ) : makeupTool === 'eyeshadow' ? (
        // Eyeshadow precision brush
        <g transform="rotate(35)">
          <ellipse cx="6" cy="0" rx="11" ry="8" fill={color} stroke="#FFF" strokeWidth="1.8" />
          <rect x="15" y="-5" width="16" height="10" rx="2" fill="#FDE047" stroke="#D97706" strokeWidth="1.5" />
          <rect x="31" y="-4.5" width="60" height="9" rx="4.5" fill="#C084FC" stroke="#7C3AED" strokeWidth="1.8" />
        </g>
      ) : makeupTool === 'blush' || makeupTool === 'highlighter' ? (
        // Fluffy round powder puff / kabuki brush
        <g transform="rotate(34)">
          <circle cx="10" cy="0" r="20" fill="#FFF0F7" stroke="#F9A8D4" strokeWidth="2.5" />
          <circle cx="6" cy="0" r="14" fill={color} opacity="0.6" />
          <rect x="26" y="-10" width="16" height="20" rx="4" fill="#FDE047" stroke="#D97706" strokeWidth="1.8" />
          <rect x="42" y="-9" width="48" height="18" rx="9" fill="#FF7AC6" stroke="#DB2777" strokeWidth="2" />
        </g>
      ) : makeupTool === 'eyeliner' ? (
        // Precision eyeliner felt pen
        <g transform="rotate(38)">
          <polygon points="0,0 18,-5 18,5" fill={color} />
          <rect x="18" y="-6" width="66" height="12" rx="6" fill="#1E1B4B" stroke="#C084FC" strokeWidth="2" />
          <line x1="30" y1="0" x2="72" y2="0" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </g>
      ) : makeupTool === 'mascara' ? (
        // Mascara wand with cute bristles
        <g transform="rotate(32)">
          <line x1="0" y1="0" x2="48" y2="0" stroke="#334155" strokeWidth="3" />
          {[2, 7, 12, 17, 22].map((bx) => (
            <line key={bx} x1={bx} y1="-7" x2={bx} y2="7" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
          ))}
          <rect x="46" y="-9" width="42" height="18" rx="8" fill="#EC4899" stroke="#FFF" strokeWidth="2" />
        </g>
      ) : (
        // Soft cotton cleansing pad
        <g>
          <circle cx="0" cy="0" r="24" fill="#FFFFFF" fillOpacity="0.92" stroke="#7DD3FC" strokeWidth="3" strokeDasharray="5 4" />
          <circle cx="-6" cy="-6" r="5" fill="#E0F2FE" />
          <circle cx="8" cy="5" r="4" fill="#BAE6FD" />
        </g>
      )}
    </g>
  );
};
