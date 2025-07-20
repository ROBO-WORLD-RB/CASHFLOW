import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { DevDataResetPanel } from "@/components/dev/DataResetPanel";
import "@/utils/devConsoleCommands"; // Initialize dev console commands

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BudgetUp - Financial Management for Ghana",
  description: "Track spending, create budgets, and achieve savings goals in Ghana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
        <Toaster />
      </body>
    </html>
  );
}
