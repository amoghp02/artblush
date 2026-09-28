"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;
const DEFAULT_VIEWPORT = { once: true, margin: "0px 0px -40px 0px" };

export function useRevealY(y = 24): number {
  return useReducedMotion() ? 0 : y;
}

export function fadeUpVariants(y: number): Variants {
  return {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE },
    },
  };
}

export function FadeIn({
  children,
  className = "",
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: useRevealY(y) }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={DEFAULT_VIEWPORT}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  className = "",
  staggerDelay = 0.09,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={DEFAULT_VIEWPORT}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className = "",
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div className={className} variants={fadeUpVariants(reduced ? 0 : y)}>
      {children}
    </motion.div>
  );
}