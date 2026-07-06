import type { Metadata } from "next";
import Script from "next/script";
import { Assistant, Secular_One, Inter } from "next/font/google";
import StickyLogout from "./components/StickyLogout";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-LZ4B420GPC";

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

const SITE_DESCRIPTION =
  "ריל (REAL) — ערכות למידה פיזיות, רב שימושיות ומודולריות שפיתחה המורה שובל לב ארי. שמונה קופסאות עץ שמחזירות את היצירתיות, המפגש והלמידה דרך הידיים לכיתה.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ריל — ערכות למידה מבית שובל לב ארי",
    template: "%s | ריל",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "ריל",
    "REAL",
    "שובל לב ארי",
    "ערכות למידה",
    "ערכות לימוד",
    "למידה חווייתית",
    "כלים למורים",
    "למידה חברתית רגשית",
    "SEL",
  ],
  authors: [{ name: "שובל לב ארי", url: SITE_URL }],
  creator: "שובל לב ארי",
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "ריל",
    title: "ריל — ערכות למידה מבית שובל לב ארי",
    description: SITE_DESCRIPTION,
    url: "/",
  },
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {children}
        <StickyLogout />
      </body>
    </html>
  );
}
