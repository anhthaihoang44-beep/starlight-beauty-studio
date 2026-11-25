// Shared sacred coordinate space for BOTH SVG rendering and HTML5 Canvas paint masks
export const STAGE_W = 600;
export const STAGE_H = 800;

export const FACE_CX = 300;
export const HEAD_CY = 316;

// Main face silhouette path (smooth cute storybook doll proportion)
export const FACE_PATH =
  'M 188 286 C 186 212, 232 174, 300 174 C 368 174, 414 212, 412 286 C 410 356, 396 410, 356 440 C 336 454, 318 460, 300 460 C 282 460, 264 454, 244 440 C 204 410, 190 356, 188 286 Z';

// Eye centers
export const LEFT_EYE = { cx: 244, cy: 326, rx: 28, ry: 23 };
export const RIGHT_EYE = { cx: 356, cy: 326, rx: 28, ry: 23 };

// Eyeshadow clip zones (soft sculpted upper eyelid crescents)
export const LEFT_EYESHADOW_PATH =
  'M 204 322 C 210 288, 240 278, 272 292 C 280 298, 282 316, 274 326 C 258 308, 224 308, 204 322 Z';

export const RIGHT_EYESHADOW_PATH =
  'M 396 322 C 390 288, 360 278, 328 292 C 320 298, 318 316, 326 326 C 342 308, 376 308, 396 322 Z';

// Outer eyeshadow blend zones (slightly wider for dreamy airbrushed blending)
export const LEFT_EYESHADOW_SOFT_PATH =
  'M 196 328 C 202 282, 240 272, 278 290 C 286 300, 286 324, 274 334 C 256 312, 220 312, 196 328 Z';

export const RIGHT_EYESHADOW_SOFT_PATH =
  'M 404 328 C 398 282, 360 272, 322 290 C 314 300, 314 324, 326 334 C 344 312, 380 312, 404 328 Z';

// Cheek blush centers
export const LEFT_CHEEK = { cx: 222, cy: 376, rx: 38, ry: 26 };
export const RIGHT_CHEEK = { cx: 378, cy: 376, rx: 38, ry: 26 };
export const NOSE_GLOW = { cx: 300, cy: 362, rx: 14, ry: 10 };

// Cupid's bow sculpted lip paths (upper + lower combined for lipstick painting)
export const LIPS_FULL_PATH =
  'M 268 408 C 276 398, 289 396, 296 401 C 299 403, 301 403, 304 401 C 311 396, 324 398, 332 408 C 324 422, 312 427, 300 427 C 288 427, 276 422, 268 408 Z';

export const LIPS_UPPER_PATH =
  'M 268 408 C 276 398, 289 396, 296 401 C 299 403, 301 403, 304 401 C 311 396, 324 398, 332 408 C 318 411, 282 411, 268 408 Z';

export const LIPS_LOWER_PATH =
  'M 268 408 C 282 411, 318 411, 332 408 C 324 422, 312 427, 300 427 C 288 427, 276 422, 268 408 Z';

export const LIPS_CENTER = { cx: 300, cy: 412, rx: 34, ry: 17 };

// Ear lobe anchor points for earrings
export const LEFT_EARLOBE = { x: 183, y: 360 };
export const RIGHT_EARLOBE = { x: 417, y: 360 };

// Spa mask face cutout area (inside face, avoiding eyes and lips)
export const SPA_MASK_PATH =
  'M 204 282 C 206 218, 242 192, 300 192 C 358 192, 394 218, 396 282 C 394 348, 382 400, 348 428 C 330 442, 315 446, 300 446 C 285 446, 270 442, 252 428 C 218 400, 206 348, 204 282 Z';

// Helper to test if a point is near a target zone for visual guiding & feedback
export function isNearZone(
  x: number,
  y: number,
  zone: 'lips' | 'eyes' | 'cheeks' | 'face'
): boolean {
  if (zone === 'lips') {
    const dx = (x - LIPS_CENTER.cx) / 48;
    const dy = (y - LIPS_CENTER.cy) / 30;
    return dx * dx + dy * dy <= 1;
  }
  if (zone === 'eyes') {
    const dl = Math.hypot((x - LEFT_EYE.cx) / 56, (y - (LEFT_EYE.cy - 10)) / 42);
    const dr = Math.hypot((x - RIGHT_EYE.cx) / 56, (y - (RIGHT_EYE.cy - 10)) / 42);
    return dl <= 1 || dr <= 1;
  }
  if (zone === 'cheeks') {
    const dl = Math.hypot((x - LEFT_CHEEK.cx) / 56, (y - LEFT_CHEEK.cy) / 44);
    const dr = Math.hypot((x - RIGHT_CHEEK.cx) / 56, (y - RIGHT_CHEEK.cy) / 44);
    const dn = Math.hypot((x - NOSE_GLOW.cx) / 28, (y - NOSE_GLOW.cy) / 24);
    return dl <= 1 || dr <= 1 || dn <= 1;
  }
  const df = Math.hypot((x - FACE_CX) / 122, (y - HEAD_CY) / 150);
  return df <= 1;
}
