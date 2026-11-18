import React, { useState, useRef, useEffect } from 'react';
import { eventBus } from '../../game/eventBus';

export const VirtualJoystick: React.FC = () => {
  const [touching, setTouching] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const baseRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  const maxRadius = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setTouching(true);
    updateJoystick(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateJoystick(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setTouching(false);
        setPosition({ x: 0, y: 0 });
        eventBus.emit('input:joystick', { x: 0, y: 0 });
        break;
      }
    }
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) {
      setPosition({ x: 0, y: 0 });
      eventBus.emit('input:joystick', { x: 0, y: 0 });
      return;
    }

    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(distance, maxRadius);
    const posX = clampedDist * Math.cos(angle);
    const posY = clampedDist * Math.sin(angle);

    setPosition({ x: posX, y: posY });
    // Emit normalized unit vector (-1..1)
    eventBus.emit('input:joystick', {
      x: posX / maxRadius,
      y: posY / maxRadius,
    });
  };

  // Clean up if touch is canceled
  useEffect(() => {
    return () => {
      eventBus.emit('input:joystick', { x: 0, y: 0 });
    };
  }, []);

  return (
    <div className="md:hidden fixed bottom-6 left-6 z-30 flex items-center gap-6 select-none pointer-events-auto">
      {/* Joystick Base */}
      <div
        ref={baseRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="relative w-28 h-28 rounded-full bg-slate-900/60 backdrop-blur-md border-2 border-slate-600/70 shadow-xl flex items-center justify-center touch-none"
      >
        {/* Joystick Stick / Thumb */}
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: touching ? 'none' : 'transform 0.15s ease-out',
          }}
          className="w-12 h-12 rounded-full bg-amber-500/90 shadow-md border-2 border-amber-300 flex items-center justify-center text-xs font-bold text-slate-900"
        >
          ▲
        </div>
      </div>

      {/* Quick Action / Interact Button on Touch */}
      <button
        type="button"
        onTouchStart={(e) => {
          e.preventDefault();
          eventBus.emit('input:interact');
        }}
        onClick={() => eventBus.emit('input:interact')}
        className="fixed bottom-8 right-6 w-16 h-16 rounded-full bg-emerald-600 active:bg-emerald-700 text-white font-bold shadow-2xl border-2 border-emerald-400 flex flex-col items-center justify-center text-xs active:scale-95 transition-transform"
      >
        <span className="text-lg">⚡</span>
        <span>Enter</span>
      </button>
    </div>
  );
};
