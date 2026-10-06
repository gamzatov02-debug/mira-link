import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./mira-theme.css";
import "./guest-design-system.css";
import "./guest-theme-semantic.css";

export const viewport: Viewport = {width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#041E15'};

export const metadata: Metadata = {
  title: "MIRA LINK — цифровое гостеприимство",
  description: "Гость, команда и ресторан в одном цифровом посещении. Интерактивная демонстрация MIRA LINK.",
  other: {
    "codex-preview": "development",
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}
