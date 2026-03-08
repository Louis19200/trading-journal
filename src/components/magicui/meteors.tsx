'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface MeteorsProps {
  number?: number;
  className?: string;
}

export function Meteors({ number = 20, className }: MeteorsProps) {
  const [meteors, setMeteors] = useState<{ id: number; left: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    setMeteors(
      Array.from({ length: number }, (_, i) => ({
        id: i,
        left: `${Math.floor(Math.random() * 100)}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${Math.floor(Math.random() * 6) + 4}s`,
      }))
    );
  }, [number]);

  return (
    <>
      {meteors.map(m => (
        <span
          key={m.id}
          style={{ left: m.left, animationDelay: m.delay, animationDuration: m.duration }}
          className={cn(
            'absolute top-0 h-0.5 w-0.5 rotate-[215deg] animate-[meteor_linear_infinite] rounded-full bg-white shadow-[0_0_0_1px_#ffffff10]',
            'before:absolute before:top-1/2 before:-translate-y-1/2 before:h-[1px] before:w-[50px] before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:to-white/70',
            className
          )}
        />
      ))}
    </>
  );
}
