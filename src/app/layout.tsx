import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/navBar";
import { NextFont } from "next/dist/compiled/@next/font";
import { ToasterContext } from "./context/ToastContext";
import { ReactNode, Suspense } from "react";
import { SkillsProvider } from "./context/SkillsContext";
import { GoogleAnalytics } from "@next/third-parties/google";

// Googleフォント'Inter'を読み込み、ラテン文字のサブセットを指定
const inter: NextFont = Inter({ subsets: ["latin"] });

// サイトの基本情報を設定
const site_name: string = "Portfolio"; // サイト名
const site_description: string = "青木雅季"; // サイトの説明
const twitter_id: string = "@masaki_0218"; // TwitterのID
const url: string = process.env.NEXT_PUBLIC_APP_BASE_URL!; // サイトのURL（環境変数から取得）
const image: string = `${url}/portfolio.png`; // OGP画像のパス
const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!;

// Next.jsのメタデータ設定
export const metadata: Metadata = {
  // デフォルトのタイトルとテンプレート
  title: {
    default: `${site_name}`,
    template: `%s | ${site_name}`,
  },
  description: site_description, // サイトの説明
  verification: {
    google: "niB82wTc8sW-wt6vkn_TacBpAJI1X7SUyaAUqQWW4Uo",
  },
  keywords: ["aoki", "profile", "青木", "雅季"], // SEOキーワード
  // Open Graphプロトコルの設定（Facebookなどで表示される情報）
  openGraph: {
    type: "website",
    locale: "ja_JP",
    title: site_name,
    description: site_description,
    siteName: site_name,
    url: url,
    images: {
      url: image,
      type: "image/png",
      width: 1200,
      height: 630,
      alt: "Profile Image",
    },
  },
  // Twitterカードの設定
  twitter: {
    title: `${site_name}`,
    description: site_description,
    card: "summary_large_image",
    images: {
      url: image,
      type: "image/png",
      width: 1200,
      height: 630,
      alt: "Profile Image",
    },
    creator: twitter_id,
  },
  // メタデータの基準となるURL
  metadataBase: new URL(url ?? "http://masaki-aoki-profile.vercel.com"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Suspense>
        <body className={`${inter.className} text-amber-200`}>
          <SkillsProvider>
            <Navbar />
            <ToasterContext />
            {children}
          </SkillsProvider>
        </body>
        <GoogleAnalytics gaId={gaId} />
      </Suspense>
    </html>
  );
}
