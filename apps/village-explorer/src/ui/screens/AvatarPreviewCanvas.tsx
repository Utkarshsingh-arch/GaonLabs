import React, { useEffect, useRef } from 'react';
import {
  AvatarCustomization,
  drawAvatarPixelCharacter,
} from '../../game/graphics/avatarAppearance';

interface AvatarPreviewCanvasProps {
  appearance: AvatarCustomization;
  /** Displayed pixel size (square, e.g. 96 or 144) */
  size?: number;
  /** Whether to play a gentle idle/walk preview animation */
  animate?: boolean;
  /** Direction row (0 = South facing front) */
  direction?: number;
  className?: string;
}

/**
 * Renders the exact same 48x48 pixel-art character sprite used inside the Phaser village,
 * scaled crisply with `image-rendering: pixelated` and optional lightweight idle animation.
 */
export const AvatarPreviewCanvas: React.FC<AvatarPreviewCanvasProps> = ({
  appearance,
  size = 128,
  animate = true,
  direction = 0,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFrame = (frame: number) => {
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, 48, 48);
      drawAvatarPixelCharacter(ctx, 0, 0, direction, frame, appearance);
    };

    drawFrame(0);

    if (!animate) return;

    // Respect prefers-reduced-motion accessibility preference
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const frames = [0, 1, 2, 3];
    let step = 0;
    const timer = window.setInterval(() => {
      step = (step + 1) % frames.length;
      drawFrame(frames[step]);
    }, 320);

    return () => {
      window.clearInterval(timer);
    };
  }, [appearance, animate, direction]);

  return (
    <canvas
      ref={canvasRef}
      width={48}
      height={48}
      style={{ width: size, height: size }}
      className={`pixelated ${className}`}
    />
  );
};
