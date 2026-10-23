import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KhetiSaathi (शेतीसाथी) — Smart Agriculture & Financial Assistant",
  description:
    "AI-powered crop profit prediction, real Agmarknet APMC mandi prices, live weather detection, loan eligibility, government schemes, and crisis monitoring for Indian farmers.",
  keywords:
    "KhetiSaathi, शेतीसाथी, खेतीसाथी, agriculture, farming, India, APMC mandi prices, Agmarknet, Open-Meteo weather, crop prediction, PM-Kisan, KCC loans, Maharashtra farming",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KhetiSaathi",
  },
};

export const viewport: Viewport = {
  themeColor: "#2ECC71",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
