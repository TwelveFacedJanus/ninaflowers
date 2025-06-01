"use client";

import React, { useRef } from "react";
import { useWindowWidth, getCategoryHashtag } from "./utils";
import Image from "next/image";
import styles from "../MainPage.module.css";

const categories = [
  { label: "До 2000 ₽", icon: "/photo_2025-05-19 15.18.26.jpeg" },
  { label: "До 3000 ₽", icon: "/photo_2025-05-19 15.18.28.jpeg" },
  { label: "До 5000 ₽", icon: "/photo_2025-05-19 15.18.31.jpeg" },
  { label: "До 10000 ₽", icon: "/photo_2025-05-19 15.18.34.jpeg" },
  { label: "Маме", icon: "/photo_2025-05-19 15.18.36.jpeg" },
  { label: "На день рождения", icon: "/photo_2025-05-19 15.18.37.jpeg" },
  { label: "Любимой девушке", icon: "/photo_2025-05-19 15.18.38.jpeg" },
  { label: "Бабушке", icon: "/photo_2025-05-19 15.18.39.jpeg" },
  { label: "Мужчине", icon: "/photo_2025-05-20 15.39.23.jpg" },
  { label: "Друзьям", icon: "/2025-05-20 15.39.28.jpg" },
  { label: "Композиции", icon: "/2025-05-20 15.42.02.jpg" },
];

export function ProductCategories({
  selected,
  onSelect,
}: {
  selected: string[];
  onSelect: (cat: string) => void;
}) {
  const width = useWindowWidth();
  const isMobile = width < 600;
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`w-full${isMobile ? " overflow-x-auto" : " overflow-x-hidden"} py-3 sm:py-4 mb-4 sm:mb-6`}
      style={{
        overflow: "visible",
        paddingTop: isMobile ? 18 : 24,
        paddingLeft: 24,
        paddingRight: 24,
      }}
    >
      <div
        ref={scrollRef}
        className={`flex gap-2 sm:gap-4 px-1 sm:px-2 justify-center${isMobile ? " min-w-max" : ""} ${styles.categoriesScrollbar}`}
        style={
          !isMobile
            ? {
                overflowX: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                overflow: "visible",
              }
            : { overflow: "visible" }
        }
      >
        {categories.map((cat) => {
          const hashtag = getCategoryHashtag(cat.label);
          const isActive = selected.includes(hashtag);
          return (
            <div
              key={cat.label}
              className={`flex flex-col items-center min-w-[64px] sm:min-w-[80px] cursor-pointer group`}
              onClick={() => onSelect(hashtag)}
            >
              {/* Внешний div для свечения и border (круг) */}
              <div
                style={{
                  position: "relative",
                  width: "3rem",
                  height: "3rem",
                  minWidth: "3rem",
                  minHeight: "3rem",
                  maxWidth: "100%",
                  aspectRatio: "1/1",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isActive
                    ? "linear-gradient(120deg, #FFF5B4 0%, #FFE066 100%)"
                    : "",
                  border: isActive ? "2.5px solid #FDC612" : "none",
                  boxShadow: isActive
                    ? "0 0 32px 8px #ffe06699"
                    : "0 2px 8px rgba(0,0,0,0.08)",
                  filter: isActive
                    ? "brightness(1.08) drop-shadow(0 0 8px #ffe066)"
                    : undefined,
                  transition: "all 0.25s",
                  zIndex: 1,
                  overflow: "visible",
                }}
              >
                <Image
                  src={cat.icon}
                  alt={cat.label}
                  width={64}
                  height={64}
                  style={{
                    objectFit: "cover",
                    objectPosition: "center 65%",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <span
                className={`text-sm sm:text-xs text-[#FFF5B4] font-medium text-center group-hover:text-[#306A8F] transition ${isActive ? "text-[#306A8F]" : ""}`}
                style={{
                  maxWidth: "80px",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontWeight: isActive ? 700 : 500,
                  textShadow: isActive ? "0 2px 8px #ffe066" : undefined,
                }}
              >
                {cat.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
