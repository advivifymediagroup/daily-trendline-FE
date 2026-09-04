import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import SidebarNav from "@/components/SidebarNav";
import RightRail from "@/components/RightRail";
import MobileTopBar from "@/components/MobileTopBar";
import TopUtilityBar from "@/components/TopUtilityBar";
import { getGlobalPageData, getGlobalPageMetadata } from "./api/news";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable}`}
    >
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
      <body className="antialiased">
        <ScrollProgress />
        <MobileTopBar data={globalData?.header} />

        {/* Three-column shell: nav rail | feed | widget rail */}
        <div className="mx-auto flex w-full max-w-[1400px] gap-8 px-4 xl:px-6">
          <div className="hidden w-[240px] shrink-0 xl:block">
            <SidebarNav data={globalData?.header} />
          </div>

          <main className="min-w-0 flex-1 min-h-[85vh] pb-10">
            <TopUtilityBar />
            {children}
          </main>

          <div className="hidden w-[330px] shrink-0 lg:block">
            <RightRail />
          </div>
        </div>

        <Footer data={globalData?.footer} />
        <Analytics />
      </body>
    </html>
  );
}
