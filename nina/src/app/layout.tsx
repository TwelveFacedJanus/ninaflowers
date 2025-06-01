import type { Metadata } from "next";
import "./globals.css";
import { Onest } from 'next/font/google';

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'], // Укажите нужные варианты веса
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ninaflowersalavat.ru"),
  title: "Nina Flowers | Магазин цветов в Салавате",
  description: "Магазин цветов в Салавате",
  keywords: [
    "цветы Салават", "купить букет Салават", "доставка цветов Салават", "магазин цветов", "букеты на заказ", "Nina Flowers", "цветочный магазин Салават", "свежие цветы","цветы от нины", "цветы салават", "цветы с доставкой", "букеты Салават"
  ],
  authors: [{ name: "Twelve Faced Janus", url: "https://ninaflowersalavat.ru" }],
  alternates: {
    canonical: "https://ninaflowersalavat.ru"
  },
  icons: {
    icon: "/logo.svg"
  },
  openGraph: {
    title: "Nina Flowers",
    description: "Магазин цветов в Салавате",
    url: "https://ninaflowersalavat.ru",
    siteName: "Nina Flowers | Магазин цветов в Салавате",
    images: [
      {
        url: "/Flower.svg",
        width: 1200,
        height: 630,
        alt: "Nina Flowers"
      }
    ],
    locale: "ru_RU",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Nina Flowers",
    description: "Магазин цветов в Салавате",
    site: "@ninaflowersalavat",
    images: [
      {
        url: "/Flower.svg",
        width: 1200,
        height: 630,
        alt: "Nina Flowers"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${onest.className} antialiased`}
        style={{ background: '#186697' }}
      >
        {children}
      </body>
    </html>
  );
}
