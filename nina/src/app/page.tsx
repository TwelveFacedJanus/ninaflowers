"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { MagicPetals } from "./components/MagicPetals";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { useWindowWidth } from "./components/utils";
import { ProductCategories } from "./components/ProductCategories";
import { AnimatedHeadline } from "./components/AnimatedHeadline";
import styles from "./MainPage.module.css";
import React from "react";

// Анимационные константы
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const cardHover = {
  scale: 1.03,
  boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 10,
  },
};

const buttonHover = {
  scale: 1.05,
  transition: {
    type: "spring",
    stiffness: 500,
  },
};

const buttonTap = {
  scale: 0.98,
  transition: {
    type: "spring",
    stiffness: 500,
  },
};

interface Bouquet {
  id: number;
  name: string;
  description: string;
  price: number;
  photo_base64?: string;
}

export default function MainPage() {
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});
  const [bouquets, setBouquets] = useState<Bouquet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sparklesArr, setSparklesArr] = useState<
    { top: number; left: number; delay: number; duration: number }[][]
  >([]);
  const [showPopup, setShowPopup] = useState(false);
  // Cookie banner state
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [devHover, setDevHover] = useState(false);
  // Модальное окно для букета
  const [modalBouquet, setModalBouquet] = useState<Bouquet | null>(null);

  const toggleHover = (id: string, isHovering: boolean) => {
    setHoverStates((prev) => ({ ...prev, [id]: isHovering }));
  };

  useEffect(() => {
    console.log('🔄 Starting bouquet loading process...');
    // При инициализации пробуем загрузить из localStorage
    if (typeof window !== "undefined") {
      const savedBouquets = localStorage.getItem("bouquets");
      console.log('📦 Checking localStorage:', savedBouquets ? 'Found saved bouquets' : 'No saved bouquets');
      if (savedBouquets) {
        try {
          const parsedBouquets = JSON.parse(savedBouquets);
          console.log('✅ Successfully loaded bouquets from localStorage:', parsedBouquets.length);
          setBouquets(parsedBouquets.slice(0, 9));
          setLoading(false);
        } catch (err) {
          console.error('❌ Error parsing localStorage data:', err);
        }
      }
    }
    const fetchBouquets = async () => {
      console.log('🌐 Attempting to fetch bouquets from server...');
      try {
        const response = await fetch("/api/bouquets");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log('✅ Successfully fetched bouquets from server:', data.length);
        setBouquets(data.slice(0, 9));
        // Сохраняем только метаданные первых 9 букетов (без photo_base64)
        if (typeof window !== "undefined") {
          const bouquetsMeta = data.slice(0, 9).map((b: Bouquet) => {
            const { id, name, description, price } = b;
            return { id, name, description, price };
          });
          localStorage.setItem("bouquets", JSON.stringify(bouquetsMeta));
          console.log('💾 Saved bouquets meta to localStorage');
        }
      } catch (err) {
        console.error('❌ Error fetching bouquets:', err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
        console.log('🏁 Loading process completed');
      }
    };
    fetchBouquets();
  }, []);

  // Добавим логирование при изменении состояний
  useEffect(() => {
    console.log('📊 State update:', {
      loading,
      error,
      bouquetsCount: bouquets.length,
      hasLocalStorage: typeof window !== "undefined" && !!localStorage.getItem("bouquets")
    });
  }, [loading, error, bouquets.length]);

  useEffect(() => {
    setSparklesArr(
      Array.from({ length: bouquets.length }).map(() =>
        Array.from({ length: 7 }).map(() => ({
          top: Math.random() * 90 + 2,
          left: Math.random() * 90 + 2,
          delay: Math.random(),
          duration: 1.2 + Math.random(),
        })),
      ),
    );
  }, [bouquets.length]);

  // Моковые карточки для dev-режима (если нет данных из БД)
  useEffect(() => {
    if (!loading && bouquets.length === 0) {
      setBouquets([]);
    }
  }, [loading, bouquets.length]);

  const reviews = [
    {
      id: 1,
      name: "Полина П.",
      text: "Цветы очень красивые и по хорошим ценам. Клиентам предоставляется большое разнообразие цветов. Персонал всегда поможет подобрать нужный букет. Мне всё очень понравилось!!",
      rating: 5,
      date: "19.05.2025",
    },
    {
      id: 2,
      name: "Ринат В.",
      text: "Отличный магазин, очень красивый ассортимент, обслуживание на высоте!",
      rating: 5,
      date: "15.05.2025",
    },
    {
      id: 3,
      name: "Наркиз В.",
      text: "Спасибо огромное! Обслуживание на высшем уровне. Добросовестно и качественно. Букет был оформлен очень красиво",
      rating: 5,
      date: "09.05.2025",
    },
  ];

  const colorPalette = {
    background: "#186697",
    primary: "#4fd1c5",
    primaryLight: "#81e6d9",
    primaryDark: "#38b2ac",
    secondary: "#ffffff",
    accent: "#e6fffa",
    text: "#ffffff",
    lightText: "#a0aec0",
    cardBg: "rgba(255, 255, 255, 0.1)",
  };

  const getButtonStyle = (isHovered: boolean) => ({
    padding: "15px 50px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: isHovered
      ? colorPalette.primaryLight
      : colorPalette.primary,
    color: colorPalette.background,
    cursor: "pointer",
    fontSize: "1.1rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
  });

  const width = useWindowWidth();
  const isMobile = width < 600;
  let logoNavGap = 80;
  if (width <= 1200 && width > 900) logoNavGap = 40;
  else if (width <= 900 && width > 600) logoNavGap = 20;
  else if (width <= 600) logoNavGap = 0;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const popupClosed = localStorage.getItem("popupClosed");
      if (!popupClosed) {
        setShowPopup(true);
      }
      // Cookie banner logic
      const cookieChoice = localStorage.getItem("cookieChoice");
      if (!cookieChoice) {
        setShowCookieBanner(true);
      }
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("popupClosed", "true");
    }
  };

  // Cookie banner handlers
  const handleAcceptCookies = () => {
    setShowCookieBanner(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("cookieChoice", "accepted");
    }
  };
  const handleDeclineCookies = () => {
    setShowCookieBanner(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("cookieChoice", "declined");
    }
  };

  const handleOpenModal = (bouquet: Bouquet) => setModalBouquet(bouquet);
  const handleCloseModal = () => setModalBouquet(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        padding: isMobile ? "8px 2vw" : "20px 120px",
        fontWeight: 500,
        backgroundColor: colorPalette.background,
        color: colorPalette.text,
        position: "relative",
        boxSizing: "border-box",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      {/* Popup предупреждение */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background:
              "linear-gradient(120deg, rgba(253,198,18,0.18) 0%, rgba(24,102,151,0.22) 100%)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            style={{
              background: "linear-gradient(120deg, #fffbe6 0%, #ffe066 100%)",
              color: "#222",
              borderRadius: 20,
              padding: "38px 28px 28px 28px",
              maxWidth: 370,
              minWidth: 260,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              textAlign: "center",
              position: "relative",
              border: "1.5px solid #ffe066",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "2.5rem",
                marginBottom: 12,
                filter: "drop-shadow(0 2px 8px #ffe066)",
                userSelect: "none",
              }}
            >
              🌸
            </div>
            <div
              style={{
                fontSize: "1.13rem",
                marginBottom: 28,
                fontWeight: 500,
                color: "#186697",
                lineHeight: 1.5,
              }}
            >
              Букеты на фото могут отличаться от реального товара,
              <br />
              так как каждый букет — <b>индивидуален</b>.
            </div>
            <motion.button
              whileHover={{
                scale: 1.07,
                backgroundColor: "#ffd600",
                color: "#186697",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={handleClosePopup}
              style={{
                padding: "12px 38px",
                borderRadius: 10,
                border: "none",
                background: "#186697",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.08rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(24,102,151,0.08)",
                transition: "background 0.2s, color 0.2s",
                letterSpacing: "0.01em",
              }}
            >
              Понятно
            </motion.button>
          </motion.div>
        </motion.div>
      )}
      <AnimatedBackground />
      <MagicPetals />
      <div className={styles.flowerBackground} />

      {/* Header section */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          marginBottom: isMobile ? "32px" : "80px",
          gap: isMobile ? "10px" : "0",
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{ marginBottom: isMobile ? 8 : 0, marginRight: logoNavGap }}
        >
          <Image
            src="/logo.svg"
            width={isMobile ? 120 : 200}
            height={isMobile ? 120 : 200}
            alt="logo"
          />
        </motion.div>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            gap: isMobile ? "8px" : "21px",
            width: "100%",
            justifyContent: isMobile ? "center" : "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              gap: isMobile ? "8px" : "21px",
              width: "100%",
              justifyContent: isMobile ? "center" : "flex-end",
              flexGrow: 1,
            }}
          >
            <motion.div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                gap: isMobile ? "8px" : "21px",
              }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {["О нас", "Магазины", "Контакты", "Вакансии"].map(
                (item, index) => (
                  <motion.button
                    key={index}
                    variants={itemVariants}
                    whileHover={{ color: colorPalette.primaryLight }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      border: "none",
                      background: "none",
                      color: colorPalette.text,
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "500",
                      textAlign: isMobile ? "center" : "left",
                    }}
                  >
                    {item}
                  </motion.button>
                ),
              )}
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              minWidth: isMobile ? "unset" : 210,
              display: "flex",
              flexDirection: "column",
              alignItems: isMobile ? "center" : "flex-end",
              marginTop: isMobile ? 8 : 0,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                justifyContent: isMobile ? "center" : "flex-end",
              }}
            >
              <Image
                src="/phone.svg"
                width={15}
                height={15}
                alt="phone"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <p
                style={{
                  margin: 0,
                  color: colorPalette.primaryLight,
                  fontSize: isMobile ? "0.95rem" : "1rem",
                  fontWeight: 600,
                }}
              >
                +7 987 252-16-96
              </p>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: isMobile ? "0.7rem" : "0.8rem",
                color: colorPalette.lightText,
                textAlign: isMobile ? "center" : "right",
              }}
            >
              Бесплатный звонок по всей России
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Main content section */}
      <>
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "120px",
          }}
        >
          <motion.h1
            style={{
              margin: "0 0 20px 0",
              fontSize: isMobile ? "1.5rem" : "2.5rem",
              fontWeight: "bold",
              color: colorPalette.text,
              position: "relative",
              display: "inline-block",
              overflow: "hidden",
            }}
          >
            <AnimatedHeadline text="Свежие цветы, созданные с любовью" />
          </motion.h1>
          <motion.p
            style={{
              margin: "0 0 40px 0",
              maxWidth: "600px",
              lineHeight: "1.6",
              fontSize: isMobile ? "0.95rem" : "1.1rem",
              color: colorPalette.text,
            }}
          >
            Каждый букет — это отражение нашей любви к цветам. Мы используем
            только самые свежие и качественные цветы, чтобы создавать красивые
            композиции, которые порадуют ваших близких.
          </motion.p>
          <motion.a
            href="https://wa.me/+79872521696"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...getButtonStyle(hoverStates["mainButton"] as boolean),
              width: isMobile ? "100%" : undefined,
              fontSize: isMobile ? "1rem" : "1.1rem",
              padding: isMobile ? "12px 0" : "15px 50px",
              display: "inline-block",
              textAlign: "center",
              textDecoration: "none",
            }}
            onMouseEnter={() => toggleHover("mainButton", true)}
            onMouseLeave={() => toggleHover("mainButton", false)}
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            Заказать букет
          </motion.a>
        </motion.div>

        {/* Our works section */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "120px",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            style={{
              width: "100%",
              maxWidth: 1200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <motion.h2
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "50px",
                color: colorPalette.text,
              }}
            >
              Наши работы
            </motion.h2>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <ProductCategories
                selected={selectedCategories}
                onSelect={(cat) => {
                  setSelectedCategories((prev) =>
                    prev.includes(cat)
                      ? prev.filter((c) => c !== cat)
                      : [...prev, cat],
                  );
                }}
              />
            </div>

            {loading ? (
              <motion.div
                style={{
                  height: "300px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                Загрузка...
              </motion.div>
            ) : error && bouquets.length === 0 ? (
              <div style={{ color: "red" }}>Ошибка: {error}</div>
            ) : error && !localStorage.getItem("bouquets") ? (
              <div style={{ color: "orange", marginBottom: 16 }}>
                Показаны примеры букетов (нет соединения с сервером)
              </div>
            ) : (
              <motion.div
                className={styles.worksGrid}
                style={{ margin: "0 auto", opacity: 1 }}
              >
                {(selectedCategories.length > 0
                  ? bouquets.filter((bouquet) => {
                      if (!bouquet.description) return false;
                      const descTags = (
                        bouquet.description.match(/#[a-zа-я0-9]+/gi) || []
                      ).map((tag) => tag.toLowerCase());
                      const selected = selectedCategories.map((tag) =>
                        tag.toLowerCase(),
                      );
                      return selected.some((sel) => descTags.includes(sel));
                    })
                  : bouquets
                )
                  .slice(0, 9)
                  .map((bouquet, i) => (
                    <motion.div
                      key={bouquet.id}
                      className={styles.workCard}
                      whileHover={{
                        scale: 1.06,
                        boxShadow: "0 0 32px 0 #FDC612, 0 0 0 2px #fff5b4",
                        filter: "brightness(1.08) drop-shadow(0 0 8px #fff5b4)",
                      }}
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        padding: 0,
                        opacity: 1,
                        filter: "none",
                        backdropFilter: "none",
                        zIndex: 1,
                        position: "relative",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                        border: "1px solid #eee",
                        width: "100%",
                        margin: "0 auto",
                        overflow: "hidden",
                        height: "320px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        cursor: "pointer",
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOpenModal(bouquet)}
                    >
                      {/* Блёстки */}
                      {sparklesArr[i] && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            pointerEvents: "none",
                            zIndex: 4,
                          }}
                        >
                          {sparklesArr[i].map((sp, j) => (
                            <motion.div
                              key={j}
                              style={{
                                position: "absolute",
                                top: `${sp.top}%`,
                                left: `${sp.left}%`,
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background:
                                  "radial-gradient(circle, #fffbe6 0%, #ffe066 80%, transparent 100%)",
                                opacity: 0.7,
                                filter: "blur(0.5px)",
                              }}
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.7, 1, 0.7],
                              }}
                              transition={{
                                duration: sp.duration,
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: sp.delay,
                              }}
                            />
                          ))}
                        </motion.div>
                      )}
                      {/* Изображение на всю карточку */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          width: "100%",
                          height: "100%",
                          zIndex: 1,
                        }}
                      >
                        {bouquet.photo_base64 ? (
                          <Image
                            src={
                              bouquet.photo_base64.startsWith("data:image")
                                ? bouquet.photo_base64
                                : `data:image/jpeg;base64,${bouquet.photo_base64}`
                            }
                            alt={bouquet.name}
                            fill
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "100%",
                            }}
                            unoptimized
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              backgroundColor: "rgba(255,255,255,0.5)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#888",
                              fontSize: "1rem",
                              zIndex: 1,
                            }}
                          >
                            Нет изображения
                          </div>
                        )}
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: "60%",
                            background:
                              "linear-gradient(0deg, #000 20%, transparent 100%)",
                            zIndex: 2,
                          }}
                        />
                      </div>
                      {/* Контент поверх изображения */}
                      <div
                        style={{
                          position: "relative",
                          zIndex: 3,
                          padding: "20px 16px 16px 16px",
                          background: "none",
                          color: "#fff",
                          textAlign: "center",
                        }}
                      >
                        <h3
                          style={{
                            margin: "0 0 10px 0",
                            fontSize: "1.2rem",
                            color: "#fff",
                            textShadow: "0 2px 8px #000",
                          }}
                        >
                          {bouquet.name}
                        </h3>
                        <a
                          href={`https://wa.me/79872521696?text=${encodeURIComponent(`Здравствуйте! Хочу заказать букет "${bouquet.name}" (ID: ${bouquet.id}).`)}"`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-block",
                            marginTop: "10px",
                            padding: "10px 24px",
                            borderRadius: "8px",
                            backgroundColor: "#81e6d9",
                            color: "#186697",
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                            textDecoration: "none",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            transition: "background 0.2s",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#4fd1c5")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "#81e6d9")
                          }
                        >
                          {bouquet.price} ₽
                        </a>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            )}

            <Link href="/all-works" passHref>
              <motion.button
                style={{
                  padding: "15px 50px",
                  borderRadius: "8px",
                  border: `2px solid ${colorPalette.primary}`,
                  backgroundColor: hoverStates["viewAllButton"]
                    ? colorPalette.primary
                    : "transparent",
                  color: hoverStates["viewAllButton"]
                    ? colorPalette.background
                    : colorPalette.primary,
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  marginTop: "60px",
                }}
                onMouseEnter={() => toggleHover("viewAllButton", true)}
                onMouseLeave={() => toggleHover("viewAllButton", false)}
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                Смотреть все работы
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Why us section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{
            width: "100%",
            textAlign: "center",
            marginBottom: "100px",
          }}
        >
          <motion.h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "60px",
              color: colorPalette.text,
            }}
          >
            Почему именно мы?
          </motion.h2>

          <motion.div
            className={styles.featuresGrid}
            style={{ textAlign: "center" }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: "🌿",
                title: "Свежие цветы",
                description:
                  "Мы работаем напрямую с поставщиками, поэтому наши цветы всегда свежие",
              },
              {
                icon: "🎨",
                title: "Уникальные букеты",
                description:
                  "Каждый букет создаётся индивидуально по вашему желанию",
              },
              {
                icon: "🚚",
                title: "Быстрая доставка",
                description: "Доставим ваш заказ в течение 1 часа по городу",
              },
              {
                icon: "💰",
                title: "Доступные цены",
                description: "Предлагаем лучшие цены без потери качества",
              },
              {
                icon: "🏆",
                title: "Опытные флористы",
                description: "Наши специалисты с опытом работы более 5 лет",
              },
              {
                icon: "❤️",
                title: "С заботой о клиентах",
                description:
                  "Если что-то не понравилось, то мы поменяем букет на другой",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={cardHover}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: "30px",
                  borderRadius: "12px",
                  backgroundColor: colorPalette.cardBg,
                  backdropFilter: "blur(10px)",
                  border: `1px solid rgba(255, 255, 255, 0.2)`,
                  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                }}
              >
                <motion.div
                  style={{
                    fontSize: "3rem",
                    marginBottom: "20px",
                    color: colorPalette.primary,
                  }}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  {feature.icon}
                </motion.div>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    marginBottom: "15px",
                    color: colorPalette.text,
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    lineHeight: "1.6",
                    color: colorPalette.lightText,
                  }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Order section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          style={{
            width: "100%",
            textAlign: "center",
            marginBottom: "100px",
            padding: "60px 40px",
            backgroundColor: colorPalette.cardBg,
            borderRadius: "15px",
            backdropFilter: "blur(10px)",
            border: `1px solid rgba(255, 255, 255, 0.2)`,
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
          }}
        >
          <motion.h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "40px",
              color: colorPalette.text,
            }}
          >
            Как заказать?
          </motion.h2>

          <motion.p
            style={{
              maxWidth: "600px",
              margin: "0 auto 50px",
              fontSize: "1.1rem",
              lineHeight: "1.6",
              color: colorPalette.text,
            }}
          >
            Выберите удобный способ связи, и наш менеджер поможет вам оформить
            заказ
          </motion.p>

          <motion.div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "30px",
              flexWrap: "wrap",
            }}
          >
            {/* WhatsApp button */}
            <motion.a
              href="https://wa.me/+79872521696"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "15px 30px",
                borderRadius: "8px",
                backgroundColor: "#25D366",
                color: "white",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "1.1rem",
              }}
              whileHover={{
                y: -5,
                boxShadow: "0 6px 16px rgba(37, 211, 102, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="/whatsapp.svg"
                width={24}
                height={24}
                alt="WhatsApp"
              />
              WhatsApp
            </motion.a>

            {/* Telegram button */}
            <motion.a
              href="https://t.me/+79872521696"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "15px 30px",
                borderRadius: "8px",
                backgroundColor: "#0088cc",
                color: "white",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "1.1rem",
              }}
              whileHover={{
                y: -5,
                boxShadow: "0 6px 16px rgba(0, 136, 204, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="/telegram.svg"
                width={24}
                height={24}
                alt="Telegram"
              />
              Telegram
            </motion.a>
          </motion.div>

          <motion.p
            style={{
              margin: "30px auto 0",
              maxWidth: "500px",
              fontSize: "0.9rem",
              color: colorPalette.lightText,
            }}
          >
            Нажимая на кнопку, вы соглашаетесь с обработкой персональных данных
          </motion.p>
        </motion.div>

        {/* Reviews section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{
            width: "100%",
            textAlign: "center",
            marginBottom: "100px",
          }}
        >
          <motion.h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "60px",
              color: colorPalette.text,
            }}
          >
            Отзывы наших клиентов
          </motion.h2>

          <motion.div
            className={styles.reviewsGrid}
            style={{ marginBottom: "50px" }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                variants={itemVariants}
                whileHover={cardHover}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: "25px",
                  borderRadius: "12px",
                  backgroundColor: colorPalette.cardBg,
                  backdropFilter: "blur(10px)",
                  border: `1px solid rgba(255, 255, 255, 0.2)`,
                  textAlign: "left",
                  position: "relative",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      margin: 0,
                      color: colorPalette.text,
                    }}
                  >
                    {review.name}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.span
                        key={i}
                        style={{
                          color:
                            i < review.rating
                              ? colorPalette.primary
                              : "rgba(255, 255, 255, 0.3)",
                          fontSize: "1.2rem",
                        }}
                        whileHover={{ scale: 1.2 }}
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                </div>

                <p
                  style={{
                    lineHeight: "1.6",
                    color: colorPalette.text,
                    marginBottom: "15px",
                  }}
                >
                  {review.text}
                </p>

                <p
                  style={{
                    fontSize: "0.8rem",
                    color: colorPalette.lightText,
                    margin: 0,
                  }}
                >
                  {review.date}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <motion.a
              href="https://2gis.ru/salavat/firm/70000001051600086/tab/reviews"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "12px 40px",
                borderRadius: "8px",
                border: `2px solid ${colorPalette.primary}`,
                backgroundColor: hoverStates["leaveReviewButton"]
                  ? colorPalette.primary
                  : "transparent",
                color: hoverStates["leaveReviewButton"]
                  ? colorPalette.background
                  : colorPalette.primary,
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
                display: "inline-block",
                textAlign: "center",
                textDecoration: "none",
              }}
              onMouseEnter={() => toggleHover("leaveReviewButton", true)}
              onMouseLeave={() => toggleHover("leaveReviewButton", false)}
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              Оставить отзыв (2ГИС)
            </motion.a>
            <motion.a
              href="https://yandex.ru/maps/org/nina_flowers/13501990234/reviews/?ll=55.958493%2C53.344156&tab=reviews&z=16.73"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "12px 40px",
                borderRadius: "8px",
                border: `2px solid ${colorPalette.primary}`,
                backgroundColor: hoverStates["leaveReviewButtonYandex"]
                  ? colorPalette.primary
                  : "transparent",
                color: hoverStates["leaveReviewButtonYandex"]
                  ? colorPalette.background
                  : colorPalette.primary,
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
                display: "inline-block",
                textAlign: "center",
                textDecoration: "none",
              }}
              onMouseEnter={() => toggleHover("leaveReviewButtonYandex", true)}
              onMouseLeave={() => toggleHover("leaveReviewButtonYandex", false)}
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              Оставить отзыв (Яндекс)
            </motion.a>
          </div>
        </motion.div>

        {/* Map section */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 80,
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: 24,
              color: colorPalette.text,
            }}
          >
            Где мы находимся
          </h2>
          <div
            style={{
              width: "100%",
              maxWidth: 900,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
              border: "2px solid #e0e7ef",
              background: "#fff",
            }}
          >
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=55.958368%2C53.344172&z=17&pt=55.958368,53.344172,pm2rdl"
              width="100%"
              height="400"
              style={{ border: 0, minHeight: 300 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Nina Flowers на карте"
            />
          </div>
        </div>

        {/* Final magic block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            marginBottom: 80,
            marginTop: 80,
            background: "rgba(24, 102, 151, 0.7)",
            minHeight: 220,
          }}
        >
          <div
            style={{
              borderRadius: 24,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              padding: "48px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 240,
              minHeight: 120,
            }}
          >
            <span
              className={styles.magicShimmer}
              style={{
                fontSize: "2.5rem",
                fontWeight: 800,
                letterSpacing: "0.04em",
                textAlign: "center",
                display: "inline-block",
                lineHeight: 1.2,
                filter: "drop-shadow(0 0 16px #ffe066)",
              }}
            >
              Ждем Вас в Nina Flowers!
            </span>
          </div>
        </motion.div>
      </>

      {/* Cookie Banner */}
      {showCookieBanner && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 200,
            damping: 22,
          }}
          style={{
            position: "fixed",
            left: 0,
            bottom: 0,
            width: "100vw",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "auto",
            background: "none",
          }}
        >
          <div
            style={{
              background: "rgba(24, 102, 151, 0.98)",
              color: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              padding: "20px 32px",
              margin: 16,
              maxWidth: 480,
              width: "100%",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              gap: isMobile ? 16 : 24,
              fontSize: isMobile ? "0.98rem" : "1.08rem",
            }}
          >
            <span style={{ flex: 1, marginBottom: isMobile ? 10 : 0 }}>
              Мы используем файлы cookie для улучшения работы сайта.
            </span>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={handleAcceptCookies}
                style={{
                  background: "#25D366",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 22px",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(37,211,102,0.08)",
                  transition: "background 0.2s",
                }}
              >
                Принять
              </button>
              <button
                onClick={handleDeclineCookies}
                style={{
                  background: "#a0aec0",
                  color: "#186697",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 22px",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(160,174,192,0.08)",
                  transition: "background 0.2s",
                }}
              >
                Отклонить
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Модальное окно букета */}
      {modalBouquet && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(24,102,151,0.25)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(2px)",
          }}
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            style={{
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 8px 32px rgba(24,102,151,0.18)",
              padding: isMobile ? "18px 8px" : "32px 32px 28px 32px",
              maxWidth: 400,
              width: "90vw",
              position: "relative",
              zIndex: 10001,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Кнопка закрытия */}
            <button
              onClick={handleCloseModal}
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                background: "none",
                border: "none",
                fontSize: 26,
                color: "#186697",
                cursor: "pointer",
                fontWeight: 700,
                zIndex: 2,
              }}
              aria-label="Закрыть"
            >
              ×
            </button>
            {/* Фото */}
            {modalBouquet.photo_base64 ? (
              <img
                src={
                  modalBouquet.photo_base64.startsWith("data:image")
                    ? modalBouquet.photo_base64
                    : `data:image/jpeg;base64,${modalBouquet.photo_base64}`
                }
                alt={modalBouquet.name}
                style={{
                  width: "100%",
                  maxWidth: 320,
                  borderRadius: 14,
                  marginBottom: 18,
                  objectFit: "cover",
                  aspectRatio: "1/1",
                  background: "#f5f5f5",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 180,
                  background: "#f5f5f5",
                  borderRadius: 14,
                  marginBottom: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                }}
              >
                Нет изображения
              </div>
            )}
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                marginBottom: 10,
                color: "#186697",
              }}
            >
              {modalBouquet.name}
            </h2>
            <div
              style={{
                color: "#186697",
                fontSize: "1.05rem",
                marginBottom: 16,
                minHeight: 40,
              }}
            >
              {modalBouquet.description || "Описание отсутствует."}
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: "1.15rem",
                color: "#FDC612",
                marginBottom: 18,
              }}
            >
              {modalBouquet.price} ₽
            </div>
            <a
              href={`https://wa.me/79872521696?text=${encodeURIComponent(`Здравствуйте! Хочу заказать букет "${modalBouquet.name}" (ID: ${modalBouquet.id}).`)}"`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "12px 32px",
                borderRadius: 10,
                background: "#25D366",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.08rem",
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(37,211,102,0.08)",
                transition: "background 0.2s",
                marginTop: 6,
              }}
            >
              Хочу такой
            </a>
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <footer
        style={{
          width: "100%",
          background: "#186697",
          color: "#fff",
          padding: isMobile ? "28px 8px 18px 8px" : "32px 0 18px 0",
          textAlign: "center",
          fontSize: isMobile ? "0.98rem" : "1.08rem",
          marginTop: 48,
          borderTop: "2px solid #ffe06633",
          boxShadow: "0 -2px 16px rgba(24,102,151,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: isMobile ? 10 : 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            justifyContent: "center",
            marginBottom: 6,
          }}
        >
          <img
            src="/logo.svg"
            alt="Nina Flowers"
            style={{
              width: 36,
              height: 36,
              marginRight: 8,
              filter: "brightness(0) invert(1)",
            }}
          />
          <span
            style={{
              fontWeight: 700,
              fontSize: isMobile ? "1.1rem" : "1.2rem",
              letterSpacing: "0.02em",
            }}
          >
            Nina Flowers
          </span>
        </div>
        <div style={{ marginBottom: 4 }}>
          <a
            href="tel:+79872521696"
            style={{
              color: "#ffe066",
              textDecoration: "none",
              fontWeight: 600,
              marginRight: 12,
            }}
          >
            +7 987 252-16-96
          </a>
          <span style={{ color: "#a0aec0", fontSize: "0.95em" }}>
            | г. Салават
          </span>
        </div>
        <div style={{ marginBottom: 8 }}>
          <a
            href="/privacy"
            style={{
              color: "#fff5b4",
              textDecoration: "underline",
              marginRight: 16,
              fontSize: "0.97em",
            }}
          >
            Политика конфиденциальности
          </a>
        </div>
        <div
          style={{
            color: "#a0aec0",
            fontSize: "0.92em",
            marginTop: 6,
            cursor: "pointer",
            minHeight: 22,
          }}
          onMouseEnter={() => setDevHover(true)}
          onMouseLeave={() => setDevHover(false)}
        >
          {devHover ? (
            <a
              href="https://t.me/TwelveFacedJanus"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#229ED9",
                textDecoration: "underline",
                fontWeight: 600,
              }}
            >
              @TwelveFacedJanus
            </a>
          ) : (
            "Разработка: Daniil (Twelve Faced Janus) Ermolaev"
          )}
        </div>
        <div style={{ color: "#ffe066", fontSize: "0.95em", opacity: 0.85 }}>
          © {new Date().getFullYear()} Nina Flowers. Все права защищены.
        </div>
      </footer>
    </motion.div>
  );
}
