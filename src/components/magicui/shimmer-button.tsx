'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  children?: React.ReactNode;
}

export function ShimmerButton({
  shimmerColor = '#ffffff',
  shimmerSize = '0.05em',
  shimmerDuration = '3s',
  borderRadius = '8px',
  background = 'rgba(0, 0, 0, 1)',
  className,
  children,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      style={{
        '--spread': '90deg',
        '--shimmer-color': shimmerColor,
        '--radius': borderRadius,
        '--speed': shimmerDuration,
        '--cut': shimmerSize,
        '--bg': background,
      } as React.CSSProperties}
      className={cn(
        'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border-0 px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)]',
        'before:absolute before:inset-0 before:overflow-hidden before:[border-radius:var(--radius)]',
        'before:bg-[conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]',
        'before:animate-[shimmer_var(--speed)_infinite]',
        'before:[mask:radial-gradient(var(--cut)_at_top,transparent_0,#000_0)]',
        'after:absolute after:inset-[var(--cut)] after:[background:var(--bg)] after:[border-radius:calc(var(--radius)-var(--cut))]',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
