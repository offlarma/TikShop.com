"use client";

import * as React from "react";
import { motion, type HTMLMotionProps, type Variants } from "framer-motion";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

type DivMotionProps = HTMLMotionProps<"div">;

interface FadeUpProps extends DivMotionProps {
  delay?: number;
  duration?: number;
  /** If true, animate on page load instead of when scrolled into view. */
  immediate?: boolean;
  /** Pixel margin for the inView trigger. Negative pulls it in earlier. */
  inViewMargin?: string;
}

export function FadeUp({
  children,
  delay = 0,
  duration = 0.6,
  immediate = false,
  inViewMargin = "-80px",
  ...rest
}: FadeUpProps) {
  return (
    <motion.div
      initial="hidden"
      variants={fadeUpVariants}
      transition={{ duration, delay, ease: EASE }}
      {...(immediate
        ? { animate: "show" }
        : {
            whileInView: "show",
            viewport: { once: true, margin: inViewMargin },
          })}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

interface StaggerGroupProps extends DivMotionProps {
  immediate?: boolean;
}

export function StaggerGroup({
  children,
  immediate = false,
  ...rest
}: StaggerGroupProps) {
  return (
    <motion.div
      initial="hidden"
      variants={staggerContainer}
      {...(immediate
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once: true, margin: "-80px" } })}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...rest }: DivMotionProps) {
  return (
    <motion.div
      variants={fadeUpVariants}
      transition={{ duration: 0.6, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
