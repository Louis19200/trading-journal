'use client';

import { cn } from '@/lib/utils';

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  shineColor?: string | string[];
  borderWidth?: number;
}

export function ShineBorder({
  children, className, shineColor = '#fff', borderWidth = 1, style, ...props
}: ShineBorderProps) {
  return (
    <div
      style={{
        '--shine-pulse-duration': '14s',
        '--border-width': `${borderWidth}px`,
        '--shine-color': Array.isArray(shineColor) ? shineColor.join(', ') : shineColor,
        backgroundImage: `radial-gradient(ellipse at 0% 0%, transparent 0%, transparent 50%), conic-gradient(from calc(270deg - (var(--shine-pulse-duration) * 1)), var(--shine-color) 0deg, transparent 10deg, transparent 90deg, var(--shine-color) 100deg)`,
        padding: `var(--border-width)`,
        borderRadius: 'inherit',
        ...style,
      } as React.CSSProperties}
      className={cn('relative overflow-hidden animate-[shine-pulse_var(--shine-pulse-duration)_infinite_linear]', className)}
      {...props}
    >
      {children}
    </div>
  );
}
