import React, { useEffect, useRef, useState } from 'react';

interface VisualExplainerProps {
  animationType: 'MICROSCOPIC_INTERLOCKING' | 'BLOCK_PULL' | 'FRICTION_SURFACES' | 'BALL_BEARING';
  caption?: string;
}

export const VisualExplainerCanvas: React.FC<VisualExplainerProps> = ({
  animationType,
  caption,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lubricated, setLubricated] = useState(false);
  const [restartKey, setRestartKey] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let t = 0;
    const width = canvas.width;
    const height = canvas.height;

    // Simulation states
    let blockX = 50;
    let blockSpeed = 4.0;
    let isStopped = false;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.03;

      if (animationType === 'MICROSCOPIC_INTERLOCKING') {
        // Draw magnified background
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, width, height);

        // Grid lines to look like high-magnification microscope
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        // Top surface block (moving right slowly)
        const shift = (Math.sin(t * 1.5) * 20) + 20;

        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(40, 20, width - 80, 50);
        ctx.fillStyle = '#475569';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('TOP SURFACE (Moving Body)', 50, 45);

        // Top jagged microscopic ridges
        ctx.beginPath();
        ctx.moveTo(40, 70);
        for (let x = 40; x <= width - 40; x += 25) {
          const toothX = x + shift;
          ctx.lineTo(toothX - 10, 70);
          ctx.lineTo(toothX, 95);
          ctx.lineTo(toothX + 10, 70);
        }
        ctx.fillStyle = '#94a3b8';
        ctx.fill();

        // Bottom jagged microscopic valleys (stationary)
        ctx.beginPath();
        ctx.moveTo(40, 140);
        for (let x = 40; x <= width - 40; x += 25) {
          ctx.lineTo(x - 10, 140);
          ctx.lineTo(x, 90);
          ctx.lineTo(x + 10, 140);
        }
        ctx.lineTo(width - 40, 180);
        ctx.lineTo(40, 180);
        ctx.closePath();
        ctx.fillStyle = '#64748b';
        ctx.fill();

        ctx.fillStyle = '#334155';
        ctx.fillRect(40, 140, width - 80, 40);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('BOTTOM SURFACE (Stationary Base)', 50, 165);

        // Interlocking contact point arrows
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width / 2 + 30, 95);
        ctx.lineTo(width / 2 - 40, 95);
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.fillText('Opposing Friction <-', width / 2 - 80, 90);
      } else if (animationType === 'BLOCK_PULL') {
        // Ground
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(0, 130, width, height - 130);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 130);
        ctx.lineTo(width, 130);
        ctx.stroke();

        // Decelerating block
        if (!isStopped) {
          blockX += blockSpeed;
          blockSpeed *= 0.985; // frictional deceleration
          if (blockSpeed < 0.05) {
            blockSpeed = 0;
            isStopped = true;
          }
        }

        // Draw block
        const bW = 80;
        const bH = 50;
        const bY = 80;
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(blockX, bY, bW, bH);
        ctx.strokeStyle = '#0369a1';
        ctx.lineWidth = 2;
        ctx.strokeRect(blockX, bY, bW, bH);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('Moving Body', blockX + 6, bY + 28);

        // Vectors
        if (!isStopped) {
          // Velocity vector (Right)
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(blockX + bW, bY + bH / 2);
          ctx.lineTo(blockX + bW + blockSpeed * 12, bY + bH / 2);
          ctx.stroke();
          ctx.fillStyle = '#0284c7';
          ctx.font = '10px sans-serif';
          ctx.fillText(`v = ${blockSpeed.toFixed(1)} m/s`, blockX + bW + 8, bY + bH / 2 - 6);

          // Friction vector (Left)
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(blockX, bY + bH);
          ctx.lineTo(blockX - 35, bY + bH);
          ctx.stroke();
          ctx.fillStyle = '#dc2626';
          ctx.fillText('<- Friction', blockX - 60, bY + bH - 4);
        } else {
          ctx.fillStyle = '#16a34a';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText('✓ Object Stopped (Velocity = 0)', width / 2 - 90, 45);
        }
      } else if (animationType === 'FRICTION_SURFACES') {
        // Comparison: Dry vs Lubricated
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, width, height);

        const currentSpeed = lubricated ? 3.5 : 1.2;
        const boxX = (t * currentSpeed * 25) % (width - 60);

        // Ground
        ctx.fillStyle = lubricated ? '#bae6fd' : '#cbd5e1';
        ctx.fillRect(20, 130, width - 40, 20);

        if (lubricated) {
          // Lubricant oil film
          ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
          ctx.fillRect(20, 125, width - 40, 5);
          ctx.fillStyle = '#0369a1';
          ctx.font = '10px sans-serif';
          ctx.fillText('Fluid Lubricant Film (Prevents Direct Ridge Contact)', 30, 144);
        } else {
          ctx.fillStyle = '#475569';
          ctx.font = '10px sans-serif';
          ctx.fillText('Dry Rough Contact (High Microscopic Interlocking)', 30, 144);
        }

        // Sliding block
        ctx.fillStyle = lubricated ? '#10b981' : '#f59e0b';
        ctx.fillRect(boxX, 85, 70, 40);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(lubricated ? 'Smooth Slide' : 'High Friction', boxX + 4, 110);

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(lubricated ? 'Status: 85% Less Friction (Gliding)' : 'Status: High Resistance', 25, 30);
      } else if (animationType === 'BALL_BEARING') {
        // Rotating ball bearing model
        const cx = width / 2;
        const cy = 100;
        const outerR = 65;
        const innerR = 35;
        const ballR = 12;

        // Outer ring
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
        ctx.stroke();

        // Inner ring
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
        ctx.stroke();

        // Rotating rolling balls
        const numBalls = 6;
        const rot = t * 1.8;
        for (let i = 0; i < numBalls; i++) {
          const angle = rot + (i * (Math.PI * 2 / numBalls));
          const ballMidR = (outerR + innerR) / 2;
          const bx = cx + Math.cos(angle) * ballMidR;
          const by = cy + Math.sin(angle) * ballMidR;

          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(bx, by, ballR, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#b45309';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Centre shaft
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0369a1';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('Rolling Motion Replaces Sliding', cx - 80, 190);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [animationType, lubricated, restartKey]);

  return (
    <div className="flex flex-col items-center bg-slate-900 rounded-xl p-4 text-white shadow-inner">
      <div className="relative w-full max-w-md bg-white rounded-lg overflow-hidden border border-slate-700 shadow-md">
        <canvas ref={canvasRef} width={420} height={200} className="w-full h-auto block" />

        {animationType === 'BLOCK_PULL' && (
          <button
            onClick={() => setRestartKey((k) => k + 1)}
            className="absolute bottom-2 right-2 px-2.5 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded text-xs font-semibold shadow transition"
          >
            Restart Kick
          </button>
        )}

        {animationType === 'FRICTION_SURFACES' && (
          <button
            onClick={() => setLubricated((v) => !v)}
            className={`absolute bottom-2 right-2 px-3 py-1 rounded text-xs font-semibold shadow transition ${
              lubricated ? 'bg-sky-600 hover:bg-sky-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {lubricated ? 'Remove Oil (Dry Surface)' : 'Apply Lubricant (Oil/Grease)'}
          </button>
        )}
      </div>

      {caption && (
        <p className="mt-2 text-xs text-slate-300 text-center font-medium">
          {caption}
        </p>
      )}
    </div>
  );
};
