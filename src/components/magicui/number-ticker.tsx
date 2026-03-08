'use client';

import { cn } from '@/lib/utils';
import { useInView, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useRef } from 'react';

interface NumberTickerProps {
  value: number;
  direction?: 'up' | 'down';
  delay?: number;
  decimalPlaces?: number;
  className?: string;
}

export function NumberTicker({
  value, direction = 'up', delay = 0, className, decimalPlaces = 0,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(direction === 'down' ? value : 0);
  const springVal = useSpring(motionVal, { damping: 60, stiffness: 100 });
  const isInView = useInView(ref, { once: true, margin: '0px' });

  useEffect(() => {
    if (!isInView) return;
    const t = setTimeout(() => {
      motionVal.set(direction === 'down' ? 0 : value);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [motionVal, isInView, delay, value, direction]);

  useEffect(() => {
    return springVal.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(latest.toFixed(decimalPlaces)));
      }
    });
  }, [springVal, decimalPlaces]);

  return <span ref={ref} className={cn('tabular-nums', className)} />;
}
