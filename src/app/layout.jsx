import { Metadata, Viewport } from "next";
import Providers from "../components/Providers";
import "./globals.css";

export const metadata = {
  title: "OPPO vs Kompetitor - Perbandingan Smartphone",
  description: "Bandingkan spesifikasi OPPO dengan kompetitor Vivo, Samsung, Xiaomi, Realme, Tecno, Infinix",
  metadataBase: new URL("https://oppo-vs-competitor.vercel.app"),
  openGraph: {
    title: "OPPO vs Kompetitor - Perbandingan Smartphone",
    description: "Bandingkan spesifikasi OPPO dengan kompetitor",
    type: "website",
    locale: "id_ID",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0066FF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <Providers>
      <html lang="id" className="h-full antialiased">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </Providers>
  );
}
