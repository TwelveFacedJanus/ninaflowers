"use client";

// Filename: MagicPetals.tsx.
// Description:
//     This component creates a magical effect of petals
//     floating in the air.
// Dependencies:
//     React, framer-motion.
// Updated on: 2025-05-01
// Author: Daniil (TwelveFacedJanus) Ermolaev.

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Interface for Petal object.
interface Petal {
  duration: number;
  delay: number;
  size: number;
  left: number;
  rotate: number;
}

// Core function that generates petals with motion from
// framer-motion. Btw, i doesn't have normal petals, but
// instead, it creates a magical effect of petals floating in the air
// using ecliptic motion.
export const MagicPetals = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const arr = Array.from({ length: 12 }).map(() => ({
      duration: 8 + Math.random() * 6,
      delay: Math.random() * 6,
      size: 32 + Math.random() * 32,
      left: Math.random() * 100,
      rotate: Math.random() * 360,
    }));
    setPetals(arr);
  }, []);
  if (petals.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {petals.map((p, i) => (
        <motion.svg
          key={i}
          width={p.size}
          height={p.size}
          viewBox="0 0 32 32"
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "-10%",
            zIndex: 1,
          }}
          initial={{ y: 0, opacity: 0, rotate: p.rotate }}
          animate={{ y: "110vh", opacity: [0, 0.7, 0], rotate: p.rotate + 180 }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          <ellipse
            cx="16"
            cy="16"
            rx="12"
            ry="6"
            fill="#FFD6E0"
            fillOpacity={0.5}
          />
          <ellipse
            cx="16"
            cy="16"
            rx="8"
            ry="3"
            fill="#FDC612"
            fillOpacity={0.3}
          />
        </motion.svg>
      ))}
    </div>
  );
};
