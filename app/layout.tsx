import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import ChatbotWidget from "@/components/ChatbotWidget"; // disembunyikan sementara
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartKos — Temukan Kost Modern Impianmu",
  description: "Nikmati pengalaman hidup premium dengan fasilitas eksklusif, desain interior minimalis, dan keamanan 24 jam di SmartKos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ fontFamily: "'Manrope', sans-serif" }}
      >
        {children}
        {/* ChatbotWidget disembunyikan sementara atas permintaan. Hapus komentar untuk menampilkan lagi. */}
        {/* <ChatbotWidget /> */}
      </body>
    </html>
  );
}
