'use client';

import { cn } from '@/lib/utils';

interface BorderBeamProps {
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}

export function BorderBeam({
  size = 200, duration = 15, borderWidth = 1.5,
  colorFrom = '#ffaa40', colorTo = '#9c40ff',
  className,
}: BorderBeamProps) {
  return (
    <div
      style={{
        '--size': `${size}px`,
        '--duration': `${duration}s`,
        '--border-width': `${borderWidth}px`,
        '--color-from': colorFrom,
        '--color-to': colorTo,
      } as React.CSSProperties}
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit]',
        'after:absolute after:inset-[-var(--border-width)] after:rounded-[inherit]',
        '[mask:linear-gradient(white,white)_padding-box,linear-gradient(white,white)]',
        '[mask-composite:xor]',
        className
      )}
    >
      <div
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, var(--color-from) 60deg, var(--color-to) 120deg, transparent 180deg)`,
          animation: `border-beam-spin var(--duration) linear infinite`,
          width: 'var(--size)',
          height: 'var(--size)',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          transformOrigin: 'bottom right',
          opacity: 0.7,
        }}
      />
    </div>
  );
}
