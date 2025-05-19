// src/app/all-works/page.tsx
"use client"

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Bouquet {
  id: number;
  name: string;
  description: string;
  price: number;
  photo_base64?: string;
}

export default function AllWorksPage() {
  const [bouquets, setBouquets] = useState<Bouquet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllBouquets = async () => {
      try {
        const response = await fetch('/api/bouquets');
        const data = await response.json();
        setBouquets(data);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBouquets();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="mb-6 inline-block text-blue-500 hover:underline">
        ← Назад
      </Link>
      
      <h1 className="text-3xl font-bold mb-8">Все наши работы</h1>
      
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bouquets.map((bouquet) => (
            <motion.div 
              key={bouquet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {bouquet.photo_base64 && (
                <div className="relative h-64">
                  <Image
                    src={`data:image/jpeg;base64,${bouquet.photo_base64}`}
                    alt={bouquet.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{bouquet.name}</h3>
                <p className="text-gray-600 mb-3">{bouquet.description}</p>
                <p className="text-lg font-bold text-green-600">{bouquet.price} ₽</p>
              </div>

            <Link 
            href={`/order/${bouquet.id}`} 
            className="block w-full mt-4 bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600 transition"
            >
            Хочу такой
            </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}