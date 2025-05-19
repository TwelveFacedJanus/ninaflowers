import type { Metadata } from "next";
import "./globals.css";
import { Onest } from 'next/font/google';

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'], // Укажите нужные варианты веса
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Nina Flowers",
  description: "Магазин цветов в Салавате",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${onest.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
