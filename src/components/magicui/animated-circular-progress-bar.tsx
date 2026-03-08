'use client';

import { cn } from '@/lib/utils';

interface Props {
  value: number;
  max?: number;
  min?: number;
  gaugePrimaryColor?: string;
  gaugeSecondaryColor?: string;
  className?: string;
}

export function AnimatedCircularProgressBar({
  value, max = 100, min = 0,
  gaugePrimaryColor = '#6366f1',
  gaugeSecondaryColor = '#1f2937',
  className,
}: Props) {
  const circumference = 2 * Math.PI * 45;
  const percentValue = ((value - min) / (max - min)) * 100;
  const strokeDashoffset = circumference - (percentValue / 100) * circumference;

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke={gaugeSecondaryColor}
          strokeWidth="8"
        />
        <circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke={gaugePrimaryColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <span className="absolute text-sm font-bold text-white">
        {percentValue.toFixed(0)}%
      </span>
    </div>
  );
}
