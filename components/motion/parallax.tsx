"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Subtle scroll-linked parallax. Place inside a relative, overflow-hidden
 * box; the inner layer is overscaled so translation never reveals edges.
 */
export function Parallax({
  children,
  from = -16,
  to = 16,
}: {
  children: ReactNode;
  from?: number;
  to?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div
        aria-hidden
        style={{ y: reduced ? 0 : y }}
        className="absolute inset-x-0 -top-[6%] h-[112%]"
      >
        {children}
      </motion.div>
    </div>
  );
}