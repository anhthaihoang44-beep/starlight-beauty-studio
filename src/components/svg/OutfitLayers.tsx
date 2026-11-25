import React from 'react';
import type { OutfitColorTheme, OutfitId } from '../../types';

interface OutfitProps {
  outfitId: OutfitId;
  theme: OutfitColorTheme;
  uid: string;
}

const fittedBodicePath = (neckY = 562, dipY = 576) =>
  `M 202 ${neckY} C 234 ${neckY - 12}, 272 ${dipY}, 300 ${dipY} C 328 ${dipY}, 366 ${neckY - 12}, 398 ${neckY} L 394 594 C 388 622, 380 646, 375 668 Q 300 680 225 668 C 220 646, 212 622, 206 594 Z`;

const flaredSkirtPath = (hemSpread = 146) =>
  `M 225 666 Q 300 678 375 666 C 408 710, ${600 - hemSpread - 10} 756, ${600 - hemSpread} 800 L ${hemSpread} 800 C ${hemSpread + 10} 756, 192 710, 225 666 Z`;

export const OutfitLayer: React.FC<OutfitProps> = ({ outfitId, theme, uid }) => {
  const mainGrad = `url(#${uid}-dress-main)`;
  const softGrad = `url(#${uid}-dress-soft)`;

  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-dress-main`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={theme.secondary} />
          <stop offset="40%" stopColor={theme.primary} />
          <stop offset="100%" stopColor={theme.accent} />
        </linearGradient>
        <linearGradient id={`${uid}-dress-soft`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={theme.trim} />
          <stop offset="100%" stopColor={theme.secondary} />
        </linearGradient>
      </defs>

      {outfitId === 'princess-gown' && (
        <g>
          <path d={flaredSkirtPath(138)} fill={mainGrad} stroke={theme.accent} strokeWidth="2.8" />
          <path d="M 260 670 Q 300 678 340 670 L 376 800 L 224 800 Z" fill={softGrad} opacity="0.9" />
          <path d={fittedBodicePath(558, 574)} fill={mainGrad} stroke={theme.accent} strokeWidth="2.8" />
          <path d="M 272 596 L 328 622 M 328 596 L 272 622 M 268 628 L 332 654 M 332 628 L 268 654" stroke={theme.trim} strokeWidth="3" opacity="0.85" />
          <circle cx="300" cy="582" r="11" fill={theme.trim} stroke={theme.accent} strokeWidth="2" />
          <circle cx="300" cy="582" r="5.5" fill={theme.accent} />
        </g>
      )}

      {outfitId === 'fairy-tulle' && (
        <g>
          <path d="M 226 524 L 234 566 M 374 524 L 366 566" stroke={theme.primary} strokeWidth="8" strokeLinecap="round" />
          <path d={flaredSkirtPath(142)} fill={mainGrad} stroke={theme.accent} strokeWidth="2.8" />
          <path
            d="M 224 666 Q 300 676 376 666 L 398 718 Q 362 748 334 712 Q 300 756 266 712 Q 238 748 202 718 Z"
            fill={softGrad}
            stroke={theme.accent}
            strokeWidth="2"
          />
          <path d={fittedBodicePath(564, 578)} fill={mainGrad} stroke={theme.accent} strokeWidth="2.8" />
          {[
            [254, 612],
            [346, 612],
            [300, 638],
            [240, 764],
            [300, 776],
            [360, 764]
          ].map(([x, y], i) => (
            <path
              key={i}
              d={`M ${x} ${y - 8} L ${x + 2.5} ${y - 2.5} L ${x + 8} ${y} L ${x + 2.5} ${y + 2.5} L ${x} ${y + 8} L ${x - 2.5} ${y + 2.5} L ${x - 8} ${y} L ${x - 2.5} ${y - 2.5} Z`}
              fill="#FFF9C4"
            />
          ))}
        </g>
      )}

      {outfitId === 'pastel-sailor' && (
        <g>
          <path d={flaredSkirtPath(162)} fill={mainGrad} stroke={theme.accent} strokeWidth="2.8" />
          {[-48, -24, 0, 24, 48].map((dx, i) => (
            <line key={i} x1={300 + dx * 0.7} y1="672" x2={300 + dx * 1.35} y2="800" stroke={theme.accent} strokeWidth="2" />
          ))}
          <path
            d="M 266 508 L 300 558 L 334 508 C 364 516, 400 524, 416 542 L 394 594 L 376 668 Q 300 678 224 668 L 206 594 L 184 542 C 200 524, 236 516, 266 508 Z"
            fill="#FFFFFF"
            stroke={theme.secondary}
            strokeWidth="2.5"
          />
        </g>
      )}

      {outfitId === 'star-hoodie' && (
        <g>
          <path d="M 204 722 L 396 722 L 418 800 L 182 800 Z" fill={softGrad} stroke={theme.accent} strokeWidth="2.8" />
          <path
            d="M 264 506 Q 300 534 336 506 C 366 514, 402 524, 418 542 L 396 602 L 400 720 Q 300 736 200 720 L 204 602 L 182 542 C 198 524, 234 514, 264 506 Z"
            fill={mainGrad}
            stroke={theme.accent}
            strokeWidth="2.8"
          />
          <path d="M 202 712 Q 300 726 398 712 L 396 732 Q 300 746 204 732 Z" fill={theme.trim} stroke={theme.accent} strokeWidth="2.4" />
          <path
            d="M 300 600 L 310 624 L 336 626 L 316 644 L 322 670 L 300 656 L 278 670 L 284 644 L 264 626 L 290 624 Z"
            fill="#FFF9C4"
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
        </g>
      )}

      {outfitId === 'butterfly-dress' && (
        <g>
          <path d={flaredSkirtPath(146)} fill={mainGrad} stroke={theme.accent} strokeWidth="2.8" />
          <path d={fittedBodicePath(556, 578)} fill={mainGrad} stroke={theme.accent} strokeWidth="2.8" />
          <path d="M 223 658 Q 300 670 377 658 L 380 676 Q 300 688 220 676 Z" fill={theme.trim} stroke={theme.accent} strokeWidth="2.2" />
        </g>
      )}

      {outfitId === 'royal-velvet' && (
        <g>
          <path d={flaredSkirtPath(144)} fill={mainGrad} stroke={theme.accent} strokeWidth="2.8" />
          <path d={fittedBodicePath(572, 578)} fill={mainGrad} stroke={theme.accent} strokeWidth="2.8" />
          <path d="M 226 666 Q 300 682 374 666" fill="none" stroke="#FDE047" strokeWidth="4" strokeLinecap="round" />
          <polygon points="300,602 312,620 300,638 288,620" fill="#FDE047" stroke="#FFF" strokeWidth="1.8" />
        </g>
      )}

      {outfitId === 'mermaid-top' && (
        <g>
          <path d="M 230 524 L 238 568 M 370 524 L 362 568" stroke="#FFF9C4" strokeWidth="5.5" strokeLinecap="round" />
          <path
            d="M 225 666 Q 300 678 375 666 C 396 706, 404 756, 424 800 L 176 800 C 196 756, 204 706, 225 666 Z"
            fill={mainGrad}
            stroke={theme.accent}
            strokeWidth="2.8"
          />
          <path d={fittedBodicePath(568, 588)} fill={mainGrad} stroke={theme.accent} strokeWidth="2.8" />
          <ellipse cx="255" cy="594" rx="41" ry="26" fill={softGrad} opacity="0.85" />
          <ellipse cx="345" cy="594" rx="41" ry="26" fill={softGrad} opacity="0.85" />
          {[-72, -48, -24, 0, 24, 48, 72].map((dx, i) => (
            <circle key={i} cx={300 + dx} cy={670 + Math.cos(dx * 0.03) * 10} r="6.5" fill="#FFFDF9" stroke={theme.secondary} strokeWidth="1.2" />
          ))}
        </g>
      )}

      {outfitId === 'blossom-kimono' && (
        <g>
          <path
            d="M 266 506 L 300 578 L 334 506 C 364 514, 400 524, 418 542 L 394 596 L 382 668 L 412 800 L 188 800 L 218 668 L 206 596 L 182 542 C 200 524, 236 514, 266 506 Z"
            fill={mainGrad}
            stroke={theme.accent}
            strokeWidth="2.8"
          />
          <path d="M 268 510 L 314 608 M 332 510 L 294 576" stroke="#FFFFFF" strokeWidth="11" strokeLinecap="round" />
          <path d="M 258 514 L 322 644" stroke={theme.trim} strokeWidth="8" strokeLinecap="round" />
          <rect x="216" y="640" width="168" height="56" rx="10" fill={softGrad} stroke={theme.accent} strokeWidth="2.6" />
          <line x1="218" y1="668" x2="382" y2="668" stroke={theme.accent} strokeWidth="5.5" />
          <circle cx="300" cy="668" r="11" fill="#FFF9C4" stroke={theme.accent} strokeWidth="2" />
        </g>
      )}
    </g>
  );
};

export const OutfitSleevesLayer: React.FC<OutfitProps> = ({ outfitId, theme, uid }) => {
  const mainGrad = `url(#${uid}-dress-main)`;
  const softGrad = `url(#${uid}-dress-soft)`;

  return (
    <g>
      {outfitId === 'princess-gown' && (
        <g>
          <path d="M 204 536 C 176 514, 138 536, 144 582 C 148 606, 178 612, 198 594 Z" fill={softGrad} stroke={theme.accent} strokeWidth="2.6" />
          <path d="M 396 536 C 424 514, 462 536, 456 582 C 452 606, 422 612, 402 594 Z" fill={softGrad} stroke={theme.accent} strokeWidth="2.6" />
          <path d="M 148 588 L 194 596 M 452 588 L 406 596" stroke={theme.trim} strokeWidth="5" strokeLinecap="round" />
        </g>
      )}

      {outfitId === 'pastel-sailor' && (
        <g>
          <path d="M 192 534 C 168 548, 150 582, 144 614 L 182 622 C 190 598, 202 582, 206 566 Z" fill="#FFFFFF" stroke={theme.accent} strokeWidth="2.5" />
          <path d="M 408 534 C 432 548, 450 582, 456 614 L 418 622 C 410 598, 398 582, 394 566 Z" fill="#FFFFFF" stroke={theme.accent} strokeWidth="2.5" />
          <path d="M 146 608 L 182 616 M 454 608 L 418 616" stroke={theme.primary} strokeWidth="5" />
          <path
            d="M 264 508 L 300 598 L 336 508 C 366 516, 398 526, 414 544 L 372 608 L 300 598 L 228 608 L 186 544 C 202 526, 234 516, 264 508 Z"
            fill={mainGrad}
            stroke={theme.accent}
            strokeWidth="2.5"
          />
          <path d="M 300 600 L 262 580 L 268 622 Z" fill={theme.accent} stroke="#FFF" strokeWidth="1.5" />
          <path d="M 300 600 L 338 580 L 332 622 Z" fill={theme.accent} stroke="#FFF" strokeWidth="1.5" />
          <circle cx="300" cy="600" r="9.5" fill={theme.trim} stroke={theme.accent} strokeWidth="2" />
        </g>
      )}

      {outfitId === 'star-hoodie' && (
        <g>
          <path
            d="M 188 536 C 158 562, 138 608, 136 648 C 134 682, 148 714, 164 740 L 196 734 C 184 706, 174 674, 176 648 C 178 622, 194 602, 206 590 Z"
            fill={mainGrad}
            stroke={theme.accent}
            strokeWidth="2.8"
          />
          <path
            d="M 412 536 C 442 562, 462 608, 464 648 C 466 682, 452 714, 436 740 L 404 734 C 416 706, 426 674, 424 648 C 422 622, 406 602, 394 590 Z"
            fill={mainGrad}
            stroke={theme.accent}
            strokeWidth="2.8"
          />
          <path d="M 165 738 L 195 733 M 435 738 L 405 733" stroke={theme.trim} strokeWidth="8" strokeLinecap="round" />
          <path d="M 242 514 C 260 554, 340 554, 358 514 Q 300 534 242 514 Z" fill={softGrad} stroke={theme.accent} strokeWidth="2.5" />
          <path d="M 280 544 L 278 602 M 320 544 L 322 602" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          <circle cx="278" cy="604" r="5.5" fill="#FDE047" />
          <circle cx="322" cy="604" r="5.5" fill="#FDE047" />
        </g>
      )}

      {outfitId === 'butterfly-dress' && (
        <g>
          <path d="M 206 546 C 174 526, 144 548, 148 588 C 164 604, 192 598, 206 582 Z" fill={softGrad} stroke={theme.accent} strokeWidth="2.5" />
          <path d="M 394 546 C 426 526, 456 548, 452 588 C 436 604, 408 598, 394 582 Z" fill={softGrad} stroke={theme.accent} strokeWidth="2.5" />
          <ellipse cx="271" cy="602" rx="27" ry="20" fill={softGrad} stroke={theme.accent} strokeWidth="2.2" />
          <ellipse cx="329" cy="602" rx="27" ry="20" fill={softGrad} stroke={theme.accent} strokeWidth="2.2" />
          <circle cx="300" cy="602" r="8.5" fill={theme.trim} stroke={theme.accent} strokeWidth="2" />
        </g>
      )}

      {outfitId === 'royal-velvet' && (
        <path
          d="M 164 584 C 208 564, 256 576, 300 576 C 344 576, 392 564, 436 584"
          fill="none"
          stroke="#FFFDF7"
          strokeWidth="16"
          strokeLinecap="round"
        />
      )}

      {outfitId === 'blossom-kimono' && (
        <g>
          <path d="M 190 536 C 160 560, 138 606, 134 654 L 156 724 C 176 734, 198 726, 200 700 L 206 594 Z" fill={mainGrad} stroke={theme.accent} strokeWidth="2.8" />
          <path d="M 410 536 C 440 560, 462 606, 466 654 L 444 724 C 424 734, 402 726, 400 700 L 394 594 Z" fill={mainGrad} stroke={theme.accent} strokeWidth="2.8" />
        </g>
      )}
    </g>
  );
};
