"use client"
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import styles from './MainPage.module.css';

// Анимационные константы
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const cardHover = {
  scale: 1.03,
  boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 10
  }
};

const buttonHover = {
  scale: 1.05,
  transition: {
    type: "spring",
    stiffness: 500
  }
};

const buttonTap = {
  scale: 0.98,
  transition: {
    type: "spring",
    stiffness: 500
  }
};

// Компонент для анимированных фоновых линий
const AnimatedBackground = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateDimensions = () => {
      if (ref.current) {
        setDimensions({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Анимация для линий
  const lineVariants = {
    initial: { 
      pathLength: 0,
      opacity: 0 
    },
    animate: (i: number) => ({
      pathLength: [0, 0.3, 0],
      opacity: [0, 0.15, 0],
      transition: {
        duration: 8 + i * 2,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: "easeInOut"
      }
    })
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
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      {dimensions.width > 0 && [...Array(8)].map((_, i) => (
        <motion.svg
          key={i}
          width={dimensions.width}
          height={dimensions.height}
          style={{
            position: 'absolute',
            top: 0,
            left: 0
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

interface Bouquet {
  id: number;
  name: string;
  description: string;
  price: number;
  photo_base64?: string;
}

// Хук для ширины экрана
function useWindowWidth() {
  const [width, setWidth] = useState(1200);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth);
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  return width;
}

export default function MainPage() {
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});
  const [bouquets, setBouquets] = useState<Bouquet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleHover = (id: string, isHovering: boolean) => {
    setHoverStates(prev => ({ ...prev, [id]: isHovering }));
  };

  useEffect(() => {
    const fetchBouquets = async () => {
      try {
        const response = await fetch('/api/bouquets');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBouquets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchBouquets();
  }, []);

  const reviews = [
    {
      id: 1,
      name: "Анна К.",
      text: "Заказывала букет на юбилей мамы. Цветы были свежие, доставили вовремя, мама в восторге! Спасибо за прекрасный сервис!",
      rating: 5,
      date: "15.05.2023"
    },
    {
      id: 2,
      name: "Михаил С.",
      text: "Регулярно заказываю цветы для жены в этом магазине. Всегда отличное качество и индивидуальный подход. Рекомендую!",
      rating: 5,
      date: "22.04.2023"
    },
    {
      id: 3,
      name: "Елена В.",
      text: "Букет превзошел все ожидания! Очень красивая композиция, цветы стояли больше недели. Обязательно буду заказывать еще.",
      rating: 4,
      date: "10.04.2023"
    }
  ];

  const colorPalette = {
    background: '#186697',
    primary: '#4fd1c5',
    primaryLight: '#81e6d9',
    primaryDark: '#38b2ac',
    secondary: '#ffffff',
    accent: '#e6fffa',
    text: '#ffffff',
    lightText: '#a0aec0',
    cardBg: 'rgba(255, 255, 255, 0.1)'
  };

  const getButtonStyle = (isHovered: boolean) => ({
    padding: '15px 50px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: isHovered ? colorPalette.primaryLight : colorPalette.primary,
    color: colorPalette.background,
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  });

  const width = useWindowWidth();
  const isMobile = width < 600;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        padding: isMobile ? '8px 2vw' : '20px 120px',
        fontWeight: 500,
        backgroundColor: colorPalette.background,
        color: colorPalette.text,
        position: 'relative',
        boxSizing: 'border-box',
        width: '100vw',
        overflowX: 'hidden',
      }}
    >
      <AnimatedBackground />
      
      {/* Header section */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          marginBottom: isMobile ? '32px' : '80px',
          gap: isMobile ? '10px' : '0',
        }}
      >
        <motion.div whileHover={{ scale: 1.05 }} style={{ marginBottom: isMobile ? 8 : 0 }}>
          <Image
            src='/logo.svg'
            width={isMobile ? 120 : 200}
            height={isMobile ? 120 : 200}
            alt="logo"
          />
        </motion.div>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: isMobile ? '8px' : '21px', width: '100%', justifyContent: isMobile ? 'center' : 'flex-start' }}>
          <motion.div 
            style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: isMobile ? '8px' : '21px', marginRight: isMobile ? 0 : 61, width: '100%', justifyContent: isMobile ? 'center' : 'flex-start' }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {['О нас', 'Магазины', 'Контакты', 'Вакансии'].map((item, index) => (
              <motion.button
                key={index}
                variants={itemVariants}
                whileHover={{ color: colorPalette.primaryLight }}
                whileTap={{ scale: 0.95 }}
                style={{
                  border: 'none',
                  background: 'none',
                  color: colorPalette.text,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  textAlign: isMobile ? 'center' : 'left',
                }}
              >
                {item}
              </motion.button>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start', marginTop: isMobile ? 8 : 0 }}
          >
            <div style={{display: 'flex', gap: '8px', alignItems: 'center', justifyContent: isMobile ? 'center' : 'flex-start'}}>
              <Image
                src='/phone.svg'
                width={15}
                height={15}
                alt='phone'
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <p style={{ margin: 0, color: colorPalette.primaryLight, fontSize: isMobile ? '0.95rem' : '1rem', fontWeight: 600 }}>
                +7 987 252-16-96
              </p>
            </div>
            <p style={{ margin: 0, fontSize: isMobile ? '0.7rem' : '0.8rem', color: colorPalette.lightText, textAlign: isMobile ? 'center' : 'left' }}>
              Бесплатный звонок по всей России
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Main content section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>

        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '120px'
          }}
        >
          <motion.h1 
            style={{ 
              margin: '0 0 20px 0', 
              fontSize: isMobile ? '1.5rem' : '2.5rem', 
              fontWeight: 'bold',
              color: colorPalette.text
            }}
          >
            Свежие цветы, созданные с любовью
          </motion.h1>
          <motion.p 
            style={{ 
              margin: '0 0 40px 0', 
              maxWidth: '600px',
              lineHeight: '1.6',
              fontSize: isMobile ? '0.95rem' : '1.1rem',
              color: colorPalette.text
            }}
          >
            Каждый букет — это отражение нашей любви к цветам. Мы используем только самые свежие и качественные цветы, чтобы создавать красивые композиции, которые порадуют ваших близких.
          </motion.p>
          <motion.button 
            style={{
              ...getButtonStyle(hoverStates['mainButton'] as boolean),
              width: isMobile ? '100%' : undefined,
              fontSize: isMobile ? '1rem' : '1.1rem',
              padding: isMobile ? '12px 0' : '15px 50px',
            }}
            onMouseEnter={() => toggleHover('mainButton', true)}
            onMouseLeave={() => toggleHover('mainButton', false)}
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            Заказать букет
          </motion.button>
        </motion.div>

        {/* Our works section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{
            width: '100%',
            textAlign: 'center',
            marginBottom: '120px'
          }}
        >
          <motion.h2 
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '50px',
              color: colorPalette.text
            }}
          >
            Наши работы
          </motion.h2>
          
          {loading ? (
            <motion.div
              style={{
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              Загрузка...
            </motion.div>
          ) : error ? (
            <div style={{ color: 'red' }}>Ошибка: {error}</div>
          ) : (
            <motion.div 
              className={styles.worksGrid}
              style={{
                background: 'none',
                backdropFilter: 'none',
                zIndex: 1,
                position: 'relative',
                opacity: 1,
                width: '100%',
                margin: 0,
              }}
            >
              {bouquets.slice(0, 6).map((bouquet) => (
                <motion.div 
                  key={bouquet.id}
                  whileHover={cardHover}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    padding: '12px',
                    opacity: 1,
                    filter: 'none',
                    backdropFilter: 'none',
                    zIndex: 1,
                    position: 'relative',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                    border: '1px solid #eee',
                    maxWidth: '260px',
                    minWidth: 0,
                    width: '100%',
                    margin: '0 auto',
                  }}
                >
                  {bouquet.photo_base64 ? (
                    <div style={{ 
                      width: '100%', 
                      height: '250px', 
                      position: 'relative',
                      marginBottom: '15px'
                    }}>
                      <Image
                        src={
                          bouquet.photo_base64.startsWith('data:image') 
                            ? bouquet.photo_base64 
                            : `data:image/jpeg;base64,${bouquet.photo_base64}`
                        }
                        alt={bouquet.name}
                        fill
                        style={{
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '250px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '15px'
                    }}>
                      Нет изображения
                    </div>
                  )}
                  
                  <h3 className="text-black" style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>
                    {bouquet.name}
                  </h3>
                  <p style={{ margin: '0 0 10px 0', color: colorPalette.lightText }}>
                    {bouquet.description}
                  </p>
                  <a
                    href={`https://wa.me/79872521696?text=${encodeURIComponent(`Здравствуйте! Хочу заказать букет "${bouquet.name}" (ID: ${bouquet.id}).`)}"`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      marginTop: '10px',
                      padding: '10px 24px',
                      borderRadius: '8px',
                      backgroundColor: colorPalette.primary,
                      color: colorPalette.background,
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      textDecoration: 'none',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = colorPalette.primaryLight)}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = colorPalette.primary)}
                  >
                    {bouquet.price} ₽ — Заказать в WhatsApp
                  </a>
                </motion.div>
              ))}
            </motion.div>
          )}

          <Link href="/all-works" passHref>
            <motion.button
              style={{ 
                padding: '15px 50px', 
                borderRadius: '8px', 
                border: `2px solid ${colorPalette.primary}`, 
                backgroundColor: hoverStates['viewAllButton'] ? colorPalette.primary : 'transparent', 
                color: hoverStates['viewAllButton'] ? colorPalette.background : colorPalette.primary, 
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}
              onMouseEnter={() => toggleHover('viewAllButton', true)}
              onMouseLeave={() => toggleHover('viewAllButton', false)}
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              Смотреть все работы
            </motion.button>
          </Link>
        </motion.div>

        {/* Why us section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{
            width: '100%',
            textAlign: 'center',
            marginBottom: '100px'
          }}
        >
          <motion.h2
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '60px',
              color: colorPalette.text
            }}
          >
            Почему именно мы?
          </motion.h2>
          
          <motion.div
            className={styles.featuresGrid}
            style={{ textAlign: 'center' }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: '🌿',
                title: 'Свежие цветы',
                description: 'Мы работаем напрямую с поставщиками, поэтому наши цветы всегда свежие'
              },
              {
                icon: '🎨',
                title: 'Уникальные букеты',
                description: 'Каждый букет создаётся индивидуально по вашему желанию'
              },
              {
                icon: '🚚',
                title: 'Быстрая доставка',
                description: 'Доставим ваш заказ в течение 2 часов по городу'
              },
              {
                icon: '💰',
                title: 'Доступные цены',
                description: 'Предлагаем лучшие цены без потери качества'
              },
              {
                icon: '🏆',
                title: 'Опытные флористы',
                description: 'Наши специалисты с опытом работы более 5 лет'
              },
              {
                icon: '❤️',
                title: 'С заботой о клиентах',
                description: 'Гарантия возврата денег, если вам что-то не понравится'
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={cardHover}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '30px',
                  borderRadius: '12px',
                  backgroundColor: colorPalette.cardBg,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid rgba(255, 255, 255, 0.2)`,
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }}
              >
                <motion.div 
                  style={{
                    fontSize: '3rem',
                    marginBottom: '20px',
                    color: colorPalette.primary
                  }}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '15px',
                  color: colorPalette.text
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  lineHeight: '1.6',
                  color: colorPalette.lightText
                }}>
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
            width: '100%',
            textAlign: 'center',
            marginBottom: '100px',
            padding: '60px 40px',
            backgroundColor: colorPalette.cardBg,
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
            border: `1px solid rgba(255, 255, 255, 0.2)`,
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
          }}
        >
          <motion.h2
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '40px',
              color: colorPalette.text
            }}
          >
            Как заказать?
          </motion.h2>
          
          <motion.p
            style={{
              maxWidth: '600px',
              margin: '0 auto 50px',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              color: colorPalette.text
            }}
          >
            Выберите удобный способ связи, и наш менеджер поможет вам оформить заказ
          </motion.p>

          <motion.div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '30px',
              flexWrap: 'wrap'
            }}
          >
            {/* WhatsApp button */}
            <motion.a 
              href="https://wa.me/+79872521696" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '15px 30px',
                borderRadius: '8px',
                backgroundColor: '#25D366',
                color: 'white',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.1rem'
              }}
              whileHover={{ 
                y: -5,
                boxShadow: '0 6px 16px rgba(37, 211, 102, 0.4)'
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
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '15px 30px',
                borderRadius: '8px',
                backgroundColor: '#0088cc',
                color: 'white',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.1rem'
              }}
              whileHover={{ 
                y: -5,
                boxShadow: '0 6px 16px rgba(0, 136, 204, 0.4)'
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
              margin: '30px auto 0',
              maxWidth: '500px',
              fontSize: '0.9rem',
              color: colorPalette.lightText
            }}
          >
            Нажимая на кнопку, вы соглашаетесь с обработкой персональных данных
          </motion.p>
        </motion.div>

        {/* Reviews section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{
            width: '100%',
            textAlign: 'center',
            marginBottom: '100px'
          }}
        >
          <motion.h2
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '60px',
              color: colorPalette.text
            }}
          >
            Отзывы наших клиентов
          </motion.h2>
          
          <motion.div
            className={styles.reviewsGrid}
            style={{ marginBottom: '50px' }}
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
                  padding: '25px',
                  borderRadius: '12px',
                  backgroundColor: colorPalette.cardBg,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid rgba(255, 255, 255, 0.2)`,
                  textAlign: 'left',
                  position: 'relative',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    margin: 0,
                    color: colorPalette.text
                  }}>
                    {review.name}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {[...Array(5)].map((_, i) => (
                      <motion.span 
                        key={i} 
                        style={{
                          color: i < review.rating ? colorPalette.primary : 'rgba(255, 255, 255, 0.3)',
                          fontSize: '1.2rem'
                        }}
                        whileHover={{ scale: 1.2 }}
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                </div>
                
                <p style={{
                  lineHeight: '1.6',
                  color: colorPalette.text,
                  marginBottom: '15px'
                }}>
                  {review.text}
                </p>
                
                <p style={{
                  fontSize: '0.8rem',
                  color: colorPalette.lightText,
                  margin: 0
                }}>
                  {review.date}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            style={{ 
              padding: '12px 40px', 
              borderRadius: '8px', 
              border: `2px solid ${colorPalette.primary}`, 
              backgroundColor: hoverStates['leaveReviewButton'] ? colorPalette.primary : 'transparent', 
              color: hoverStates['leaveReviewButton'] ? colorPalette.background : colorPalette.primary, 
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
            onMouseEnter={() => toggleHover('leaveReviewButton', true)}
            onMouseLeave={() => toggleHover('leaveReviewButton', false)}
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            Оставить отзыв
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}