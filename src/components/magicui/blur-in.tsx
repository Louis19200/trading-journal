'use client';

import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface BlurInProps {
  word: string;
  className?: string;
  duration?: number;
}

export function BlurIn({ word, className, duration = 1 }: BlurInProps) {
  return (
    <motion.h1
      initial={{ filter: 'blur(20px)', opacity: 0 }}
      animate={{ filter: 'blur(0px)', opacity: 1 }}
      transition={{ duration }}
      className={cn(className)}
    >
      {word}
    </motion.h1>
  );
}
