// src/app/all-works/page.tsx
"use client"

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MagicPetals } from "../components/MagicPetals";
import { AnimatedBackground } from "../components/AnimatedBackground";
import styles from "../MainPage.module.css";

interface Bouquet {
  id: number;
  name: string;
  description: string;
  price: number;
  photo_base64?: string;
}

const mockBouquets: Bouquet[] = [
  
];

export default function AllWorksPage() {
  const [bouquets, setBouquets] = useState<Bouquet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAllBouquets = async () => {
      try {
        const response = await fetch('/api/bouquets');
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setBouquets(data);
        } else {
          setBouquets(mockBouquets);
        }
      } catch {
        setError(true);
        setBouquets(mockBouquets);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBouquets();
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#186697' }}>
      <AnimatedBackground />
      <MagicPetals />
      <div className={styles.flowerBackground} />
      <div className="container mx-auto px-4 py-8" style={{ position: 'relative', zIndex: 2 }}>
        <Link href="/" className="mb-6 inline-block text-blue-500 hover:underline">
          ← Назад
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Все наши работы</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-orange-100 text-orange-800 rounded">
            Нет соединения с сервером. Показаны примеры букетов.
          </div>
        )}
        
        {loading ? (
          <div>Загрузка...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center" style={{ justifyContent: 'center' }}>
            {bouquets.map((bouquet) => (
              <motion.div 
                key={bouquet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  borderRadius: '12px',
                  padding: 0,
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
                  overflow: 'hidden',
                  height: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                {/* Изображение на всю карточку */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 1,
                }}>
                  {bouquet.photo_base64 ? (
                    <Image
                      src={
                        bouquet.photo_base64.startsWith?.('data:image')
                          ? bouquet.photo_base64
                          : `data:image/jpeg;base64,${bouquet.photo_base64}`
                      }
                      alt={bouquet.name}
                      fill
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                      }}
                      unoptimized
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#888',
                      fontSize: '1rem',
                      zIndex: 1,
                    }}>
                      Нет изображения
                    </div>
                  )}
                  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '60%', background: 'linear-gradient(0deg, #000 20%, transparent 100%)', zIndex: 2 }} />
                </div>
                {/* Контент поверх изображения */}
                <div style={{
                  position: 'relative',
                  zIndex: 3,
                  padding: '20px 16px 16px 16px',
                  background: 'none',
                  color: '#fff',
                  textAlign: 'center',
                }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#fff', textShadow: '0 2px 8px #000' }}>
                    {bouquet.name}
                  </h3>
                  <a
                    href={`https://wa.me/79872521696?text=${encodeURIComponent(`Здравствуйте! Хочу заказать букет \"${bouquet.name}\" (ID: ${bouquet.id}).`)}"`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      marginTop: '10px',
                      padding: '10px 24px',
                      borderRadius: '8px',
                      backgroundColor: '#81e6d9',
                      color: '#186697',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      textDecoration: 'none',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = '#4fd1c5')}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = '#81e6d9')}
                  >
                    {bouquet.price} ₽
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}