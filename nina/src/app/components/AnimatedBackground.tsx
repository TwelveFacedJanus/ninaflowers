"use client";

// Filename: AnimatedBackground.tsx.
// Description:
//     This component creates animted background
//     with curves.
// Dependencies:
//     React, framer-motion.
// Updated on: 2025-05-01
// Author: Daniil (TwelveFacedJanus) Ermolaev.

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Core function that returns tsx component of animated background
export const AnimatedBackground = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (ref.current) {
        setDimensions({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Анимация для линий
  const lineVariants = {
    initial: {
      pathLength: 0,
      opacity: 0,
    },
    animate: (i: number) => ({
      pathLength: [0, 0.3, 0],
      opacity: [0, 0.15, 0],
      transition: {
        duration: 8 + i * 2,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      },
    }),
  };
  // Генерация случайных кривых Безье
  const generateRandomCurve = (width: number, height: number) => {
    const startX = Math.random() * width;
    const startY = Math.random() * height;
    const cp1x = Math.random() * width;
    const cp1y = Math.random() * height;
    const cp2x = Math.random() * width;
    const cp2y = Math.random() * height;
    const endX = Math.random() * width;
    const endY = Math.random() * height;

    return `M ${startX},${startY} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`;
  };

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {dimensions.width > 0 &&
        [...Array(8)].map((_, i) => (
          <motion.svg
            key={i}
            width={dimensions.width}
            height={dimensions.height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
            initial="initial"
            animate="animate"
            custom={i}
          >
            <motion.path
              d={generateRandomCurve(dimensions.width, dimensions.height)}
              stroke="#FDC612"
              strokeWidth={1.5}
              fill="none"
              strokeLinecap="round"
              variants={lineVariants}
            />
          </motion.svg>
        ))}
    </div>
  );
};
