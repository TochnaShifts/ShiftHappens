// src/app/layout.tsx
import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/app/components/loveable/toaster";
import { QueryProvider } from "@/app/shared/QueryProvider";

const heebo = Heebo({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shift Happens",
  description: "Shfit Management App",
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="rtl">
      <body className={heebo.className}>        
      <QueryProvider>
        {children}
        <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
