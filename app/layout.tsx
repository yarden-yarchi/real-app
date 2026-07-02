import type { Metadata } from "next";
import { Assistant, Secular_One, Inter } from "next/font/google";
import Header from "./components/Header";
import "./globals.css";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew", "latin"],
});

const secularOne = Secular_One({
  variable: "--font-secular-one",
  weight: "400",
  subsets: ["hebrew", "latin"],
});

const inter = Inter({
  variable: "--font-inter-raw",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ריל — הערכות",
  description: "ערכות לימוד פיזיות, רב שימושיות ומודולריות",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${assistant.variable} ${secularOne.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Header />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
