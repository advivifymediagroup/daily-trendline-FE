import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Container } from "@mui/material";
import { getGlobalPageData, getGlobalPageMetadata } from "./api/news";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getGlobalPageMetadata();

  return {
    title: {
      default: metadata?.title || "DailyTrendline",
      template: "%s | DailyTrendline",
    },
    description:
      metadata?.description || "Latest news in short and concise format.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalData = await getGlobalPageData();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var key = 'dailytrendline-theme';
                  var saved = localStorage.getItem(key);
                  var theme = saved === 'light' || saved === 'dark'
                    ? saved
                    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                  document.documentElement.style.colorScheme = theme;
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100`}
      >
        <Header data={globalData?.header} />
        <Container className="max-w-[1310px]! m-auto min-h-[85vh]">
          {children}
        </Container>
        <Footer data={globalData?.footer} />
      </body>
    </html>
  );
}
