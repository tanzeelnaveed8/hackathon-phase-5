import { Variants } from "framer-motion";

/**
 * Animation timing constants
 */
export const ANIMATION_DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
} as const;

export const EASING = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  spring: { type: "spring", stiffness: 300, damping: 30 },
} as const;

/**
 * Fade animation variants
 */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeInOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: ANIMATION_DURATION.fast,
      ease: EASING.easeIn,
    },
  },
};

/**
 * Slide up animation variants
 */
export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: ANIMATION_DURATION.fast,
      ease: EASING.easeIn,
    },
  },
};

/**
 * Slide down animation variants
 */
export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: ANIMATION_DURATION.fast,
      ease: EASING.easeIn,
    },
  },
};

/**
 * Slide in from left animation variants
 */
export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: ANIMATION_DURATION.fast,
      ease: EASING.easeIn,
    },
  },
};

/**
 * Slide in from right animation variants
 */
export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: ANIMATION_DURATION.fast,
      ease: EASING.easeIn,
    },
  },
};

/**
 * Scale animation variants
 */
export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: ANIMATION_DURATION.fast,
      ease: EASING.easeIn,
    },
  },
};

/**
 * Stagger container variants for animating lists
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

/**
 * Stagger item variants (use with staggerContainerVariants)
 */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: ANIMATION_DURATION.fast,
      ease: EASING.easeIn,
    },
  },
};

/**
 * Hover scale animation
 */
export const hoverScaleVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: ANIMATION_DURATION.fast,
      ease: EASING.easeOut,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: ANIMATION_DURATION.fast,
      ease: EASING.easeIn,
    },
  },
};

/**
 * Hover lift animation (for cards)
 */
export const hoverLiftVariants = {
  rest: { y: 0, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)" },
  hover: {
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)",
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeOut,
    },
  },
};

/**
 * Page transition variants
 */
export const pageTransitionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeOut,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeIn,
    },
  },
};

/**
 * Modal/Dialog animation variants
 */
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: ANIMATION_DURATION.fast,
      ease: EASING.easeIn,
    },
  },
};

/**
 * Backdrop animation variants
 */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.normal,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: ANIMATION_DURATION.fast,
    },
  },
};

/**
 * Utility function to create custom fade variants with custom duration
 */
export const createFadeVariants = (duration: number = ANIMATION_DURATION.normal): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration, ease: EASING.easeInOut },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration * 0.5, ease: EASING.easeIn },
  },
});

/**
 * Utility function to create custom slide variants
 */
export const createSlideVariants = (
  direction: "up" | "down" | "left" | "right",
  distance: number = 20,
  duration: number = ANIMATION_DURATION.normal
): Variants => {
  const value = direction === "down" || direction === "right" ? distance : -distance;

  // Construct variants without computed properties to satisfy TypeScript
  if (direction === "left" || direction === "right") {
    return {
      hidden: { opacity: 0, x: value },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration, ease: EASING.easeOut },
      },
      exit: {
        opacity: 0,
        x: -value,
        transition: { duration: duration * 0.5, ease: EASING.easeIn },
      },
    };
  } else {
    return {
      hidden: { opacity: 0, y: value },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration, ease: EASING.easeOut },
      },
      exit: {
        opacity: 0,
        y: -value,
        transition: { duration: duration * 0.5, ease: EASING.easeIn },
      },
    };
  }
};

/**
 * Utility function to create stagger animation config
 */
export const createStaggerConfig = (staggerDelay: number = 0.1, delayChildren: number = 0) => ({
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});
