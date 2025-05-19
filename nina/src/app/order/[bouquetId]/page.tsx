// src/app/order/[bouquetId]/page.tsx
"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Bouquet {
  id: number;
  name: string;
  price: number;
  description: string;
  photo_base64?: string;
}

export default function OrderPage() {
  const { bouquetId } = useParams();
  const router = useRouter();
  const [bouquet, setBouquet] = useState<Bouquet | null>(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchBouquet = async () => {
      try {
        const response = await fetch(`/api/bouquets/${bouquetId}`);
        if (!response.ok) throw new Error("Букет не найден");
        const data = await response.json();
        setBouquet(data);
      } catch (error) {
        console.error(error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchBouquet();
  }, [bouquetId, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь можно добавить логику обработки формы
  };

  const generateWhatsAppLink = () => {
    const message = `Здравствуйте! Хочу заказать букет "${bouquet?.name}" (ID: ${bouquetId}). Мой телефон: ${phone}`;
    return `https://wa.me/79872521696?text=${encodeURIComponent(message)}`;
  };

  const generateTelegramLink = () => {
    const message = `Здравствуйте! Хочу заказать букет "${bouquet?.name}" (ID: ${bouquetId}). Мой телефон: ${phone}`;
    return `https://t.me/79872521696?start=${encodeURIComponent(message)}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" style={{ backgroundColor: '#186697', minHeight: '100vh' }}>
      <Link href="/" className="inline-block mb-6 text-blue-500 hover:underline">
        ← Вернуться назад
      </Link>
      
      <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>
      
      {loading ? (
        <div>Загрузка...</div>
      ) : bouquet ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {bouquet.photo_base64 && (
              <div className="w-full md:w-1/2 h-64 relative">
                <Image
                  src={`data:image/jpeg;base64,${bouquet.photo_base64}`}
                  alt={bouquet.name}
                  fill
                  className="object-cover rounded-lg"
                  unoptimized
                />
              </div>
            )}
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold mb-2 text-black">{bouquet.name}</h2>
              <p className="text-gray-600 mb-4 text-black">{bouquet.description}</p>
              <p className="text-xl font-bold text-green-600 mb-6 text-black">{bouquet.price} ₽</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-black">Ваше имя</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-black">Телефон *</label>
                  <input 
                    type="tel" 
                    className="w-full p-2 border rounded"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-black">Адрес доставки</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div className="flex flex-col gap-3 mt-6">
                  <Link
                    href={generateWhatsAppLink()}
                    target="_blank"
                    className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
                  >
                    <Image
                      src="/whatsapp.svg"
                      width={24}
                      height={24}
                      alt="WhatsApp"
                    />
                    Написать в WhatsApp
                  </Link>
                  
                  <Link
                    href={generateTelegramLink()}
                    target="_blank"
                    className="flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
                  >
                    <Image
                      src="/telegram.svg"
                      width={24}
                      height={24}
                      alt="Telegram"
                    />
                    Написать в Telegram
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div>Букет не найден</div>
      )}
    </div>
  );
}