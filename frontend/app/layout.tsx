import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import BFCacheHandler from "./components/BFCacheHandler/BFCacheHandler";
import ChatBot from "./components/ChatBot/ChatBot";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HORUS | History Isn't Read. It's Experienced.",
  description: "Explore ancient Egyptian history with HORUS.",
  icons: {
    icon: "/photos/icon.png",
    shortcut: "/photos/icon.png",
    apple: "/photos/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <BFCacheHandler />
        <Navbar />
        {children}
        <Footer />
        <ChatBot />
      </body>
    </html>
  );
}
