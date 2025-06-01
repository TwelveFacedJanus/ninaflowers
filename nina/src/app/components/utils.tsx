"use client";

// Filename: hooks.tsx.
// Description:
//     This is not component. It's hooks!
// Dependencies:
//     React, framer-motion.
// Updated on: 2025-05-01
// Author: Daniil (TwelveFacedJanus) Ermolaev.

import { useState, useEffect } from "react";

export function useWindowWidth() {
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  return width;
}

// Function that converts label to hashtag: "До 2000 ₽" -> "#до2000", "Маме" -> "#маме"
export function getCategoryHashtag(label: string): string {
  return (
    "#" +
    label
      .toLowerCase()
      .replace(/[^a-zа-я0-9]+/gi, "")
      .replace(/^до([0-9]+)/, "до$1")
  );
}
