import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import {
  getCharacterById,
  getEyeLensById,
  getHairColorById,
  getOutfitColorById
} from '../data/catalog';
import {
  FACE_PATH,
  isNearZone,
  LEFT_CHEEK,
  LEFT_EYE,
  LEFT_EYESHADOW_SOFT_PATH,
  LIPS_CENTER,
  LIPS_FULL_PATH,
  NOSE_GLOW,
  RIGHT_CHEEK,
  RIGHT_EYE,
  RIGHT_EYESHADOW_SOFT_PATH,
  SPA_MASK_PATH,
  STAGE_H,
  STAGE_W
} from '../data/faceGeometry';
import type {
  MakeupToolId,
  MakeoverState,
  SalonCategory,
  SpaToolId,
  StickerTypeId
} from '../types';
import { soundEngine } from '../utils/sound';
import {
  EarringsLayer,
  GlassesLayer,
  HeadwearLayer,
  NecklaceLayer,
  StickerGraphic,
  WingsLayer
} from './svg/AccessoryLayers';
import { PhotoFrameOverlay, StageBackground } from './svg/BackgroundAndFrames';
import { ArmsAndHandsSvg, FaceBaseSvg, FaceTopOverlaySvg } from './svg/FaceLayers';
import { HairBack, HairFront } from './svg/HairLayers';
import { OutfitLayer, OutfitSleevesLayer } from './svg/OutfitLayers';
import { ToolCursor } from './svg/ToolCursor';

export interface CharacterStageHandle {
  autoApplyMakeup: (tool: MakeupToolId, color: string) => void;
  clearLayer: (target: 'lipstick' | 'eyeshadow' | 'blush' | 'spa' | 'all') => void;
  applySurprisePaint: (lipHex: string, shadowHex: string, blushHex: string) => void;
  exportPhotoDataUrl: () => Promise<string>;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  shape: 'star' | 'bubble' | 'heart' | 'dot';
}

interface CharacterStageProps {
  state: MakeoverState;
  activeCategory: SalonCategory;
  activeMakeupTool: MakeupToolId;
  activeSpaTool: SpaToolId;
  activeColor: string;
  activeSticker: StickerTypeId;
  interactive: boolean;
  showFrame: boolean;
  onPaintFlag: (layer: 'lip' | 'eyeshadow' | 'blush', painted: boolean) => void;
  onUpdateCoverage: (tool: 'eyeliner' | 'mascara', delta: number) => void;
  onSpaGlowChange: (glow: boolean) => void;
  onPlaceSticker: (x: number, y: number) => void;
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function svgElementToImage(svgEl: SVGSVGElement): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const clone = svgEl.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', String(STAGE_W));
    clone.setAttribute('height', String(STAGE_H));
    const serialized = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

export const CharacterStage = forwardRef<CharacterStageHandle, CharacterStageProps>(
  (
    {
      state,
      activeCategory,
      activeMakeupTool,
      activeSpaTool,
      activeColor,
      activeSticker,
      interactive,
      showFrame,
      onPaintFlag,
      onUpdateCoverage,
      onSpaGlowChange,
      onPlaceSticker
    },
    ref
  ) => {
    const uid = useId().replace(/:/g, '');
    const containerRef = useRef<HTMLDivElement | null>(null);
    const bottomSvgRef = useRef<SVGSVGElement | null>(null);
    const topSvgRef = useRef<SVGSVGElement | null>(null);

    // 4 dedicated interactive canvases aligned 1:1 with 600x800 SVG stage
    const skinCanvasRef = useRef<HTMLCanvasElement | null>(null); // blush + highlighter
    const spaCanvasRef = useRef<HTMLCanvasElement | null>(null); // cleanser foam + pearl mask
    const eyeshadowCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const lipCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const particlesRef = useRef<Particle[]>([]);
    const isDrawingRef = useRef(false);
    const lastPosRef = useRef<{ x: number; y: number } | null>(null);
    const [cursorPos, setCursorPos] = useState<{ x: number; y: number; active: boolean }>({
      x: 300,
      y: 400,
      active: false
    });
    const [isBlinking, setIsBlinking] = useState(false);

    const character = getCharacterById(state.characterId);
    const hairColor = getHairColorById(state.hairColorId);
    const eyeLens = getEyeLensById(state.eyeColorId);
    const outfitTheme = getOutfitColorById(state.outfitColorId);

    // Gentle lifelike blinking loop
    useEffect(() => {
      let blinkTimeout: number | undefined;
      const schedule = () => {
        const delay = 2800 + Math.random() * 2800;
        blinkTimeout = window.setTimeout(() => {
          setIsBlinking(true);
          window.setTimeout(() => {
            setIsBlinking(false);
            schedule();
          }, 150);
        }, delay);
      };
      schedule();
      return () => {
        if (blinkTimeout) clearTimeout(blinkTimeout);
      };
    }, []);

    // Spawn sparkle / bubble / heart particle burst
    const spawnParticles = useCallback(
      (
        x: number,
        y: number,
        count: number,
        shape: Particle['shape'],
        palette: string[]
      ) => {
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.6 + Math.random() * 2.4;
          particlesRef.current.push({
            x: x + (Math.random() - 0.5) * 18,
            y: y + (Math.random() - 0.5) * 18,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.8,
            size: shape === 'bubble' ? 5 + Math.random() * 9 : 4 + Math.random() * 7,
            alpha: 1,
            color: palette[Math.floor(Math.random() * palette.length)],
            shape
          });
        }
      },
      []
    );

    // Particle animation loop
    useEffect(() => {
      let animId = 0;
      const tick = () => {
        const canvas = particleCanvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, STAGE_W, STAGE_H);
            const list = particlesRef.current;
            for (let i = list.length - 1; i >= 0; i--) {
              const p = list[i];
              p.x += p.vx;
              p.y += p.vy;
              p.alpha -= 0.024;
              if (p.alpha <= 0) {
                list.splice(i, 1);
                continue;
              }
              ctx.save();
              ctx.globalAlpha = Math.max(0, p.alpha);
              ctx.translate(p.x, p.y);
              if (p.shape === 'bubble') {
                ctx.strokeStyle = '#FFFFFF';
                ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(-p.size * 0.3, -p.size * 0.3, p.size * 0.25, 0, Math.PI * 2);
                ctx.fill();
              } else if (p.shape === 'star') {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                const s = p.size;
                ctx.moveTo(0, -s);
                ctx.lineTo(s * 0.28, -s * 0.28);
                ctx.lineTo(s, 0);
                ctx.lineTo(s * 0.28, s * 0.28);
                ctx.lineTo(0, s);
                ctx.lineTo(-s * 0.28, s * 0.28);
                ctx.lineTo(-s, 0);
                ctx.lineTo(-s * 0.28, -s * 0.28);
                ctx.closePath();
                ctx.fill();
              } else if (p.shape === 'heart') {
                ctx.fillStyle = p.color;
                const s = p.size * 0.7;
                ctx.beginPath();
                ctx.moveTo(0, s);
                ctx.bezierCurveTo(-s * 1.4, 0, -s * 1.4, -s * 1.2, -s * 0.5, -s * 1.2);
                ctx.bezierCurveTo(-s * 0.1, -s * 1.2, 0, -s * 0.7, 0, -s * 0.5);
                ctx.bezierCurveTo(0, -s * 0.7, s * 0.1, -s * 1.2, s * 0.5, -s * 1.2);
                ctx.bezierCurveTo(s * 1.4, -s * 1.2, s * 1.4, 0, 0, s);
                ctx.fill();
              } else {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(0, 0, p.size * 0.55, 0, Math.PI * 2);
                ctx.fill();
              }
              ctx.restore();
            }
          }
        }
        animId = requestAnimationFrame(tick);
      };
      animId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(animId);
    }, []);

    // Helper: Paint soft radial brush dab inside a clipped Path2D
    const stampSoftBrush = (
      ctx: CanvasRenderingContext2D,
      clipPaths: Path2D[],
      x: number,
      y: number,
      radius: number,
      color: string,
      opacity: number,
      glitter = false,
      erase = false
    ) => {
      ctx.save();
      if (clipPaths.length > 0) {
        const combined = new Path2D();
        clipPaths.forEach((p) => combined.addPath(p));
        ctx.clip(combined);
      }

      if (erase) {
        ctx.globalCompositeOperation = 'destination-out';
        const g = ctx.createRadialGradient(x, y, 2, x, y, radius);
        g.addColorStop(0, 'rgba(0,0,0,0.45)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const g = ctx.createRadialGradient(x, y, radius * 0.08, x, y, radius);
        g.addColorStop(0, hexToRgba(color, opacity));
        g.addColorStop(0.55, hexToRgba(color, opacity * 0.55));
        g.addColorStop(1, hexToRgba(color, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        if (glitter && Math.random() < 0.7) {
          for (let i = 0; i < 3; i++) {
            const gx = x + (Math.random() - 0.5) * radius * 1.1;
            const gy = y + (Math.random() - 0.5) * radius * 1.1;
            ctx.fillStyle = Math.random() > 0.4 ? 'rgba(255,253,224,0.92)' : 'rgba(255,255,255,0.95)';
            ctx.beginPath();
            ctx.arc(gx, gy, 1.3 + Math.random() * 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.restore();
    };

    const paintAtPoint = useCallback(
      (x: number, y: number) => {
        if (activeCategory === 'spa') {
          const spaCtx = spaCanvasRef.current?.getContext('2d');
          if (!spaCtx) return;
          const spaClip = new Path2D(SPA_MASK_PATH);

          if (activeSpaTool === 'cleanser') {
            if (!isNearZone(x, y, 'face')) return;
            spaCtx.save();
            spaCtx.clip(spaClip);
            // Creamy foamy bubble rings!
            for (let i = 0; i < 3; i++) {
              const bx = x + (Math.random() - 0.5) * 34;
              const by = y + (Math.random() - 0.5) * 34;
              const br = 8 + Math.random() * 14;
              spaCtx.fillStyle = 'rgba(255, 255, 255, 0.72)';
              spaCtx.strokeStyle = 'rgba(125, 211, 252, 0.65)';
              spaCtx.lineWidth = 1.6;
              spaCtx.beginPath();
              spaCtx.arc(bx, by, br, 0, Math.PI * 2);
              spaCtx.fill();
              spaCtx.stroke();
            }
            spaCtx.restore();
            soundEngine.playBubblePop();
            spawnParticles(x, y, 2, 'bubble', ['#FFFFFF', '#BAE6FD']);
          } else if (activeSpaTool === 'mask') {
            if (!isNearZone(x, y, 'face')) return;
            stampSoftBrush(spaCtx, [spaClip], x, y, 36, '#A7F3D0', 0.45, false, false);
            soundEngine.playBrushStroke(false);
            spawnParticles(x, y, 1, 'star', ['#A7F3D0', '#FFFFFF']);
          } else if (activeSpaTool === 'rinse') {
            stampSoftBrush(spaCtx, [], x, y, 42, '#000000', 1, false, true);
            soundEngine.playBubblePop();
            spawnParticles(x, y, 3, 'bubble', ['#BAE6FD', '#FFFFFF', '#E0F2FE']);
          } else if (activeSpaTool === 'primer') {
            if (!isNearZone(x, y, 'face')) return;
            onSpaGlowChange(true);
            soundEngine.playBrushStroke(true);
            spawnParticles(x, y, 3, 'star', ['#FEF08A', '#FFFBEB', '#FF8AC6']);
          }
          return;
        }

        if (activeCategory !== 'makeup') return;

        if (activeMakeupTool === 'lipstick') {
          const ctx = lipCanvasRef.current?.getContext('2d');
          if (!ctx) return;
          const lipClip = new Path2D(LIPS_FULL_PATH);
          stampSoftBrush(
            ctx,
            [lipClip],
            x,
            y,
            24,
            activeColor,
            0.52,
            state.lipFinish === 'glitter',
            false
          );
          if (isNearZone(x, y, 'lips')) {
            onPaintFlag('lip', true);
            soundEngine.playBrushStroke(state.lipFinish === 'glitter');
            spawnParticles(x, y, 2, 'heart', [activeColor, '#FFF9C4', '#FFFFFF']);
          }
        } else if (activeMakeupTool === 'eyeshadow') {
          const ctx = eyeshadowCanvasRef.current?.getContext('2d');
          if (!ctx) return;
          const clips = [
            new Path2D(LEFT_EYESHADOW_SOFT_PATH),
            new Path2D(RIGHT_EYESHADOW_SOFT_PATH)
          ];
          stampSoftBrush(
            ctx,
            clips,
            x,
            y,
            26,
            activeColor,
            0.36,
            state.eyeshadowFinish === 'shimmer',
            false
          );
          if (isNearZone(x, y, 'eyes')) {
            onPaintFlag('eyeshadow', true);
            soundEngine.playBrushStroke(state.eyeshadowFinish === 'shimmer');
            spawnParticles(x, y, 2, 'star', [activeColor, '#FFF9C4', '#FFFFFF']);
          }
        } else if (activeMakeupTool === 'blush' || activeMakeupTool === 'highlighter') {
          const ctx = skinCanvasRef.current?.getContext('2d');
          if (!ctx) return;
          const faceClip = new Path2D(FACE_PATH);
          const isHl = activeMakeupTool === 'highlighter';
          stampSoftBrush(
            ctx,
            [faceClip],
            x,
            y,
            isHl ? 24 : 36,
            activeColor,
            isHl ? 0.25 : 0.2,
            isHl,
            false
          );
          if (isNearZone(x, y, 'cheeks')) {
            onPaintFlag('blush', true);
            soundEngine.playBrushStroke(isHl);
            spawnParticles(x, y, 2, isHl ? 'star' : 'dot', [activeColor, '#FFF9C4', '#FFFFFF']);
          }
        } else if (activeMakeupTool === 'eyeliner') {
          if (isNearZone(x, y, 'eyes')) {
            onUpdateCoverage('eyeliner', 0.14);
            soundEngine.playBrushStroke(true);
            spawnParticles(x, y, 2, 'star', [state.eyelinerColor, '#FEF08A', '#FFFFFF']);
          }
        } else if (activeMakeupTool === 'mascara') {
          if (isNearZone(x, y, 'eyes')) {
            onUpdateCoverage('mascara', 0.14);
            soundEngine.playBrushStroke(false);
            spawnParticles(x, y, 2, 'star', [state.mascaraColor, '#FF8AC6', '#FFFFFF']);
          }
        } else if (activeMakeupTool === 'remover') {
          const lipCtx = lipCanvasRef.current?.getContext('2d');
          const eyeCtx = eyeshadowCanvasRef.current?.getContext('2d');
          const skinCtx = skinCanvasRef.current?.getContext('2d');
          const spaCtx = spaCanvasRef.current?.getContext('2d');
          if (lipCtx) stampSoftBrush(lipCtx, [], x, y, 30, '#000', 1, false, true);
          if (eyeCtx) stampSoftBrush(eyeCtx, [], x, y, 32, '#000', 1, false, true);
          if (skinCtx) stampSoftBrush(skinCtx, [], x, y, 36, '#000', 1, false, true);
          if (spaCtx) stampSoftBrush(spaCtx, [], x, y, 36, '#000', 1, false, true);
          soundEngine.playBubblePop();
          spawnParticles(x, y, 2, 'bubble', ['#FFFFFF', '#BAE6FD']);
        }
      },
      [
        activeCategory,
        activeMakeupTool,
        activeSpaTool,
        activeColor,
        state.lipFinish,
        state.eyeshadowFinish,
        state.eyelinerColor,
        state.mascaraColor,
        onPaintFlag,
        onUpdateCoverage,
        onSpaGlowChange,
        spawnParticles
      ]
    );

    // Imperative API for Magic Fill, Clear, Surprise Me, and PNG Export
    useImperativeHandle(
      ref,
      () => ({
        autoApplyMakeup(tool, color) {
          if (tool === 'lipstick') {
            const ctx = lipCanvasRef.current?.getContext('2d');
            if (!ctx) return;
            const lipClip = new Path2D(LIPS_FULL_PATH);
            ctx.save();
            ctx.clearRect(0, 0, STAGE_W, STAGE_H);
            ctx.clip(lipClip);
            const g = ctx.createLinearGradient(268, 396, 268, 428);
            g.addColorStop(0, hexToRgba(color, 0.92));
            g.addColorStop(0.5, hexToRgba(color, 0.85));
            g.addColorStop(1, hexToRgba(color, 0.95));
            ctx.fillStyle = g;
            ctx.fillRect(260, 390, 80, 46);
            ctx.restore();
            onPaintFlag('lip', true);
            spawnParticles(LIPS_CENTER.cx, LIPS_CENTER.cy, 12, 'heart', [color, '#FFF9C4', '#FFFFFF']);
            soundEngine.playSparkle();
          } else if (tool === 'eyeshadow') {
            const ctx = eyeshadowCanvasRef.current?.getContext('2d');
            if (!ctx) return;
            const clips = [
              new Path2D(LEFT_EYESHADOW_SOFT_PATH),
              new Path2D(RIGHT_EYESHADOW_SOFT_PATH)
            ];
            ctx.clearRect(0, 0, STAGE_W, STAGE_H);
            [LEFT_EYE, RIGHT_EYE].forEach((eye) => {
              for (let step = 0; step < 5; step++) {
                stampSoftBrush(
                  ctx,
                  clips,
                  eye.cx + (step - 2) * 14,
                  eye.cy - 22,
                  28,
                  color,
                  0.45,
                  state.eyeshadowFinish === 'shimmer',
                  false
                );
              }
              spawnParticles(eye.cx, eye.cy - 18, 8, 'star', [color, '#FFF9C4', '#FFFFFF']);
            });
            onPaintFlag('eyeshadow', true);
            soundEngine.playSparkle();
          } else if (tool === 'blush' || tool === 'highlighter') {
            const ctx = skinCanvasRef.current?.getContext('2d');
            if (!ctx) return;
            const faceClip = new Path2D(FACE_PATH);
            const isHl = tool === 'highlighter';
            if (isHl) {
              stampSoftBrush(ctx, [faceClip], LEFT_CHEEK.cx - 8, LEFT_CHEEK.cy - 12, 26, color, 0.5, true);
              stampSoftBrush(ctx, [faceClip], RIGHT_CHEEK.cx + 8, RIGHT_CHEEK.cy - 12, 26, color, 0.5, true);
              stampSoftBrush(ctx, [faceClip], NOSE_GLOW.cx, NOSE_GLOW.cy, 16, color, 0.55, true);
            } else {
              stampSoftBrush(ctx, [faceClip], LEFT_CHEEK.cx, LEFT_CHEEK.cy, 44, color, 0.52);
              stampSoftBrush(ctx, [faceClip], RIGHT_CHEEK.cx, RIGHT_CHEEK.cy, 44, color, 0.52);
            }
            onPaintFlag('blush', true);
            spawnParticles(LEFT_CHEEK.cx, LEFT_CHEEK.cy, 7, 'star', [color, '#FFF9C4']);
            spawnParticles(RIGHT_CHEEK.cx, RIGHT_CHEEK.cy, 7, 'star', [color, '#FFF9C4']);
            soundEngine.playSparkle();
          } else if (tool === 'eyeliner') {
            onUpdateCoverage('eyeliner', 1);
            spawnParticles(LEFT_EYE.cx, LEFT_EYE.cy - 12, 6, 'star', ['#FEF08A', '#FFF']);
            spawnParticles(RIGHT_EYE.cx, RIGHT_EYE.cy - 12, 6, 'star', ['#FEF08A', '#FFF']);
            soundEngine.playSparkle();
          } else if (tool === 'mascara') {
            onUpdateCoverage('mascara', 1);
            spawnParticles(LEFT_EYE.cx, LEFT_EYE.cy - 16, 6, 'star', ['#FF8AC6', '#FFF']);
            spawnParticles(RIGHT_EYE.cx, RIGHT_EYE.cy - 16, 6, 'star', ['#FF8AC6', '#FFF']);
            soundEngine.playSparkle();
          }
        },

        clearLayer(target) {
          const clearCanvas = (c: HTMLCanvasElement | null) => {
            c?.getContext('2d')?.clearRect(0, 0, STAGE_W, STAGE_H);
          };
          if (target === 'lipstick' || target === 'all') {
            clearCanvas(lipCanvasRef.current);
            onPaintFlag('lip', false);
          }
          if (target === 'eyeshadow' || target === 'all') {
            clearCanvas(eyeshadowCanvasRef.current);
            onPaintFlag('eyeshadow', false);
          }
          if (target === 'blush' || target === 'all') {
            clearCanvas(skinCanvasRef.current);
            onPaintFlag('blush', false);
          }
          if (target === 'spa' || target === 'all') {
            clearCanvas(spaCanvasRef.current);
            if (target === 'all') onSpaGlowChange(false);
          }
        },

        applySurprisePaint(lipHex, shadowHex, blushHex) {
          // Clear previous & paint balanced glam combo
          const lipCtx = lipCanvasRef.current?.getContext('2d');
          const eyeCtx = eyeshadowCanvasRef.current?.getContext('2d');
          const skinCtx = skinCanvasRef.current?.getContext('2d');
          const spaCtx = spaCanvasRef.current?.getContext('2d');
          spaCtx?.clearRect(0, 0, STAGE_W, STAGE_H);

          if (lipCtx) {
            lipCtx.clearRect(0, 0, STAGE_W, STAGE_H);
            lipCtx.save();
            lipCtx.clip(new Path2D(LIPS_FULL_PATH));
            lipCtx.fillStyle = hexToRgba(lipHex, 0.88);
            lipCtx.fillRect(260, 390, 80, 46);
            lipCtx.restore();
            onPaintFlag('lip', true);
          }
          if (eyeCtx) {
            eyeCtx.clearRect(0, 0, STAGE_W, STAGE_H);
            const clips = [
              new Path2D(LEFT_EYESHADOW_SOFT_PATH),
              new Path2D(RIGHT_EYESHADOW_SOFT_PATH)
            ];
            [LEFT_EYE, RIGHT_EYE].forEach((eye) => {
              for (let s = -2; s <= 2; s++) {
                stampSoftBrush(eyeCtx, clips, eye.cx + s * 13, eye.cy - 22, 28, shadowHex, 0.44, true);
              }
            });
            onPaintFlag('eyeshadow', true);
          }
          if (skinCtx) {
            skinCtx.clearRect(0, 0, STAGE_W, STAGE_H);
            const faceClip = new Path2D(FACE_PATH);
            stampSoftBrush(skinCtx, [faceClip], LEFT_CHEEK.cx, LEFT_CHEEK.cy, 44, blushHex, 0.48);
            stampSoftBrush(skinCtx, [faceClip], RIGHT_CHEEK.cx, RIGHT_CHEEK.cy, 44, blushHex, 0.48);
            onPaintFlag('blush', true);
          }

          spawnParticles(300, 320, 22, 'star', ['#FDE047', '#FF7AC6', '#38BDF8', '#FFFFFF']);
        },

        async exportPhotoDataUrl() {
          const outW = 900;
          const outH = 1200;
          const out = document.createElement('canvas');
          out.width = outW;
          out.height = outH;
          const ctx = out.getContext('2d');
          if (!ctx) return '';

          if (bottomSvgRef.current) {
            const bottomImg = await svgElementToImage(bottomSvgRef.current);
            ctx.drawImage(bottomImg, 0, 0, outW, outH);
          }
          if (skinCanvasRef.current) ctx.drawImage(skinCanvasRef.current, 0, 0, outW, outH);
          if (spaCanvasRef.current) ctx.drawImage(spaCanvasRef.current, 0, 0, outW, outH);
          if (eyeshadowCanvasRef.current) ctx.drawImage(eyeshadowCanvasRef.current, 0, 0, outW, outH);
          if (lipCanvasRef.current && state.expression !== 'happy') {
            if (state.expression === 'kissy') {
              ctx.save();
              ctx.translate((LIPS_CENTER.cx / STAGE_W) * outW, (LIPS_CENTER.cy / STAGE_H) * outH);
              ctx.scale(0.68, 0.94);
              ctx.translate(-(LIPS_CENTER.cx / STAGE_W) * outW, -(LIPS_CENTER.cy / STAGE_H) * outH);
              ctx.drawImage(lipCanvasRef.current, 0, 0, outW, outH);
              ctx.restore();
            } else {
              ctx.drawImage(lipCanvasRef.current, 0, 0, outW, outH);
            }
          }
          if (topSvgRef.current) {
            const topImg = await svgElementToImage(topSvgRef.current);
            ctx.drawImage(topImg, 0, 0, outW, outH);
          }

          return out.toDataURL('image/png');
        }
      }),
      [state.eyeshadowFinish, state.expression, onPaintFlag, onUpdateCoverage, onSpaGlowChange, spawnParticles]
    );

    // Coordinate conversion from screen clientX/Y to 600x800 stage
    const toStagePoint = (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: 300, y: 400 };
      const touchOffset = e.pointerType === 'touch' ? -24 : 0;
      const x = ((e.clientX - rect.left) / rect.width) * STAGE_W;
      const y = ((e.clientY + touchOffset - rect.top) / rect.height) * STAGE_H;
      return {
        x: Math.max(0, Math.min(STAGE_W, x)),
        y: Math.max(0, Math.min(STAGE_H, y))
      };
    };

    const isPaintMode = interactive && (activeCategory === 'makeup' || activeCategory === 'spa');
    const isStickerMode = interactive && activeCategory === 'stickers';

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!interactive) return;
      const pt = toStagePoint(e);

      if (isStickerMode) {
        onPlaceSticker(pt.x, pt.y);
        spawnParticles(pt.x, pt.y, 10, 'star', ['#FDE047', '#FF7AC6', '#FFFFFF']);
        soundEngine.playSparkle();
        return;
      }

      if (!isPaintMode) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      isDrawingRef.current = true;
      lastPosRef.current = pt;
      setCursorPos({ x: pt.x, y: pt.y, active: true });
      paintAtPoint(pt.x, pt.y);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isPaintMode) return;
      const pt = toStagePoint(e);
      if (e.pointerType === 'mouse' || isDrawingRef.current) {
        setCursorPos({ x: pt.x, y: pt.y, active: true });
      }
      if (!isDrawingRef.current) return;

      // Interpolate smooth continuous strokes even on rapid finger swipes
      const prev = lastPosRef.current ?? pt;
      const dist = Math.hypot(pt.x - prev.x, pt.y - prev.y);
      const steps = Math.max(1, Math.ceil(dist / 7));
      for (let i = 1; i <= steps; i++) {
        const ix = prev.x + ((pt.x - prev.x) * i) / steps;
        const iy = prev.y + ((pt.y - prev.y) * i) / steps;
        paintAtPoint(ix, iy);
      }
      lastPosRef.current = pt;
    };

    const handlePointerUp = () => {
      isDrawingRef.current = false;
      lastPosRef.current = null;
      setCursorPos((prev) => ({ ...prev, active: false }));
    };

    // Visual Target Zone Hint (cute pulsing dotted ring for kids!)
    const showZoneGuide = isPaintMode && !cursorPos.active;

    return (
      <div
        ref={containerRef}
        className={`character-stage ${isPaintMode ? 'cursor-none' : isStickerMode ? 'cursor-crosshair' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* LAYER 1: Background + Wings + Back Hair + Base Skin + Outfit + Jewelry */}
        <svg
          ref={bottomSvgRef}
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          className="stage-layer"
          aria-label={character.name}
        >
          <StageBackground backgroundId={state.backgroundId} uid={`${uid}-bg`} />
          <WingsLayer wingsId={state.wingsId} uid={`${uid}-w`} />
          <HairBack
            styleId={state.hairStyle}
            color={hairColor}
            highlightEnabled={state.hairHighlightEnabled}
            uid={`${uid}-h`}
          />
          <FaceBaseSvg character={character} uid={`${uid}-f`} />
          <OutfitLayer outfitId={state.outfitId} theme={outfitTheme} uid={`${uid}-o`} />
          <ArmsAndHandsSvg character={character} uid={`${uid}-f`} />
          <OutfitSleevesLayer outfitId={state.outfitId} theme={outfitTheme} uid={`${uid}-o`} />
          <NecklaceLayer necklaceId={state.necklaceId} />
          <EarringsLayer earringId={state.earringId} />
        </svg>

        {/* LAYER 2: Interactive Skin Makeup Canvas (Blush & Highlighter) */}
        <canvas
          ref={skinCanvasRef}
          width={STAGE_W}
          height={STAGE_H}
          className="stage-layer stage-canvas"
        />

        {/* LAYER 2B: Interactive Spa Foam & Pearl Mask Canvas */}
        <canvas
          ref={spaCanvasRef}
          width={STAGE_W}
          height={STAGE_H}
          className="stage-layer stage-canvas"
        />

        {/* LAYER 3: Interactive Eyeshadow Canvas */}
        <canvas
          ref={eyeshadowCanvasRef}
          width={STAGE_W}
          height={STAGE_H}
          className="stage-layer stage-canvas"
        />

        {/* LAYER 4: Interactive Lipstick Canvas */}
        <canvas
          ref={lipCanvasRef}
          width={STAGE_W}
          height={STAGE_H}
          className="stage-layer stage-canvas"
          style={{
            opacity: state.expression === 'happy' ? 0 : 1,
            transform: state.expression === 'kissy' ? 'scale(0.68, 0.94)' : 'none',
            transformOrigin: '50% 51.5%'
          }}
        />

        {/* LAYER 5: Eyes, Lashes, Eyeliner, Brows, Lip Gloss, Front Hair, Stickers, Glasses, Headwear, Frame */}
        <svg
          ref={topSvgRef}
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          className="stage-layer"
          style={{ pointerEvents: 'none' }}
        >
          <FaceTopOverlaySvg
            character={character}
            eyeLens={eyeLens}
            eyebrowStyle={state.eyebrowStyle}
            eyebrowColor={state.eyebrowColor}
            eyelinerStyle={state.eyelinerStyle}
            eyelinerColor={state.eyelinerColor}
            eyelinerCoverage={state.eyelinerCoverage}
            mascaraStyle={state.mascaraStyle}
            mascaraColor={state.mascaraColor}
            mascaraCoverage={state.mascaraCoverage}
            lipFinish={state.lipFinish}
            hasLipPaint={state.hasLipPaint}
            expression={state.expression}
            spaGlow={state.spaGlow}
            isBlinking={isBlinking}
            uid={`${uid}-ft`}
          />
          <HairFront
            styleId={state.hairStyle}
            color={hairColor}
            highlightEnabled={state.hairHighlightEnabled}
            uid={`${uid}-h`}
          />
          {/* Placed Face Gems & Stickers */}
          {state.stickers.map((s) => (
            <StickerGraphic
              key={s.id}
              type={s.type}
              x={s.x}
              y={s.y}
              scale={s.scale}
              rotation={s.rotation}
            />
          ))}
          <GlassesLayer glassesId={state.glassesId} />
          <HeadwearLayer headwearId={state.headwearId} />
          {showFrame && <PhotoFrameOverlay frameId={state.frameId} characterName={character.name} />}
        </svg>

        {/* LAYER 6A: Live Sparkle & Bubble Particles */}
        <canvas
          ref={particleCanvasRef}
          width={STAGE_W}
          height={STAGE_H}
          className="stage-layer stage-canvas"
          style={{ pointerEvents: 'none' }}
        />

        {/* LAYER 6B: Subtle Target Zone Guide + Animated Cosmetic Tool Cursor */}
        <svg
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          className="stage-layer"
          style={{ pointerEvents: 'none' }}
        >
          {showZoneGuide && activeCategory === 'makeup' && activeMakeupTool === 'lipstick' && (
            <ellipse
              cx={LIPS_CENTER.cx}
              cy={LIPS_CENTER.cy}
              rx="42"
              ry="24"
              fill="none"
              stroke="#FF4D9E"
              strokeWidth="3"
              strokeDasharray="8 6"
              className="zone-pulse"
            />
          )}
          {showZoneGuide &&
            activeCategory === 'makeup' &&
            (activeMakeupTool === 'eyeshadow' ||
              activeMakeupTool === 'eyeliner' ||
              activeMakeupTool === 'mascara') && (
              <g className="zone-pulse">
                <ellipse
                  cx={LEFT_EYE.cx}
                  cy={LEFT_EYE.cy - 14}
                  rx="42"
                  ry="24"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="3"
                  strokeDasharray="8 6"
                />
                <ellipse
                  cx={RIGHT_EYE.cx}
                  cy={RIGHT_EYE.cy - 14}
                  rx="42"
                  ry="24"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="3"
                  strokeDasharray="8 6"
                />
              </g>
            )}
          {showZoneGuide &&
            activeCategory === 'makeup' &&
            (activeMakeupTool === 'blush' || activeMakeupTool === 'highlighter') && (
              <g className="zone-pulse">
                <ellipse
                  cx={LEFT_CHEEK.cx}
                  cy={LEFT_CHEEK.cy}
                  rx="42"
                  ry="28"
                  fill="none"
                  stroke="#FF6BB5"
                  strokeWidth="3"
                  strokeDasharray="8 6"
                />
                <ellipse
                  cx={RIGHT_CHEEK.cx}
                  cy={RIGHT_CHEEK.cy}
                  rx="42"
                  ry="28"
                  fill="none"
                  stroke="#FF6BB5"
                  strokeWidth="3"
                  strokeDasharray="8 6"
                />
              </g>
            )}
          {isPaintMode && (
            <ToolCursor
              x={cursorPos.x}
              y={cursorPos.y}
              active={cursorPos.active}
              mode={activeCategory === 'spa' ? 'spa' : 'makeup'}
              makeupTool={activeMakeupTool}
              spaTool={activeSpaTool}
              color={activeColor}
            />
          )}
        </svg>

        {/* Sticker preview badge hint when placing stickers */}
        {isStickerMode && (
          <div className="sticker-floating-pill">
            <svg viewBox="-20 -20 40 40" width="24" height="24">
              <StickerGraphic type={activeSticker} />
            </svg>
          </div>
        )}
      </div>
    );
  }
);

CharacterStage.displayName = 'CharacterStage';
