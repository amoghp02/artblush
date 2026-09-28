"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function SpringLift({
  children,
  className = "",
  lift = -6,
}: {
  children: ReactNode;
  className?: string;
  lift?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      whileHover={reduced ? undefined : { y: lift }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
    >
      {children}
    </motion.div>
  );
}