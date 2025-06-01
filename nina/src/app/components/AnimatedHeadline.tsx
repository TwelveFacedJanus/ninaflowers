"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "../MainPage.module.css";

// Анимация появления по буквам с shimmer после появления
export function AnimatedHeadline({ text }: { text: string }) {
  const [showShimmer, setShowShimmer] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(
      () => setShowShimmer(true),
      text.length * 40 + 600,
    );
    return () => clearTimeout(timeout);
  }, [text]);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{
          opacity: showShimmer ? 0 : 1,
          position: showShimmer ? "absolute" : "static",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          display: "inline-block",
        }}
      >
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.04,
              duration: 0.5,
              type: "spring",
              stiffness: 120,
            }}
            style={{ display: "inline-block", position: "relative" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
      {showShimmer && (
        <span
          className={styles.magicShimmer}
          style={{
            position: "static",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}
