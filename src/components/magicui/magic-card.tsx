'use client';

import { cn } from '@/lib/utils';
import React, { useCallback, useRef } from 'react';

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
}

export function MagicCard({
  children, className, gradientSize = 200, gradientColor = '#262626', gradientOpacity = 0.8,
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - top}px`);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      style={{
        '--gradient-size': `${gradientSize}px`,
        '--gradient-color': gradientColor,
        '--gradient-opacity': gradientOpacity,
        '--mouse-x': '50%',
        '--mouse-y': '50%',
      } as React.CSSProperties}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-gray-800',
        'before:absolute before:inset-0 before:z-0 before:opacity-0 group-hover:before:opacity-[var(--gradient-opacity)] before:transition-opacity before:duration-300',
        'before:bg-[radial-gradient(var(--gradient-size)_circle_at_var(--mouse-x)_var(--mouse-y),var(--gradient-color),transparent_100%)]',
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
