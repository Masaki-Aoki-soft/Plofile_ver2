import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/navBar";
import { NextFont } from "next/dist/compiled/@next/font";
import { ToasterContext } from "./context/ToastContext";
import { ReactNode, Suspense } from "react";
import { SkillsProvider } from "./context/SkillsContext";
import { GoogleAnalytics } from "@next/third-parties/google";
import profileData from "./data/profileData.json";
import skillsData from "./data/skillsData.json";

// Googleフォント'Inter'を読み込み、ラテン文字のサブセットを指定
const inter: NextFont = Inter({ subsets: ["latin"] });

// サイトのURL
// - 環境変数が未設定・空文字でも本番URLにフォールバックする（?? は空文字を拾えないので || を使う）
// - 末尾スラッシュを除去して "https://example.com//portfolio.png" のような二重スラッシュを防ぐ
const DEFAULT_SITE_URL = "https://masaki-aoki-profile.vercel.app";
const siteUrl: string = (
  process.env.NEXT_PUBLIC_APP_BASE_URL || DEFAULT_SITE_URL
).replace(/\/+$/, "");

// サイトの基本情報を設定
const site_name: string = "青木雅季 (Masaki Aoki) | Portfolio"; // トップページのタイトル
const site_short_name: string = "青木雅季 Portfolio"; // 下層ページのタイトル末尾・サイト名
const site_description: string =
  "芝浦工業大学大学院 理工学研究科 電気電子情報工学専攻の青木雅季（Masaki Aoki）のポートフォリオ。フロントエンドエンジニアとしての制作物やスキルを紹介しています。";
const twitter_id: string = "@masaki_0218"; // TwitterのID
const image: string = "/portfolio.png"; // OGP画像（metadataBase からの相対パス）
const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!;

// 構造化データ（JSON-LD）: サイト情報と人物情報
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: site_short_name,
      inLanguage: "ja",
      author: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: profileData.nameJa,
      alternateName: profileData.nameEn,
      url: siteUrl,
      image: `${siteUrl}/sub-icon.png`,
      jobTitle: "フロントエンドエンジニア",
      worksFor: { "@type": "Organization", name: "株式会社MarbullX" },
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: "芝浦工業大学大学院",
      },
      alumniOf: { "@type": "CollegeOrUniversity", name: "芝浦工業大学" },
      knowsAbout: skillsData.flatMap((category) =>
        category.models.map((model) => model.name),
      ),
      sameAs: [
        "https://github.com/Masaki-Aoki-soft",
        `https://x.com/${twitter_id.replace("@", "")}`,
      ],
    },
  ],
};

// Next.jsのメタデータ設定
// ※ canonical はここに書かない（全ページに継承され、下層ページが「トップの重複」扱いになるため）
//    各 page.tsx で alternates.canonical を個別に設定する
export const metadata: Metadata = {
  // メタデータの基準となるURL（相対パスはすべてここから解決される）
  metadataBase: new URL(siteUrl),
  // デフォルトのタイトルとテンプレート
  title: {
    default: site_name, // トップ: 青木雅季 (Masaki Aoki) | Portfolio
    template: `%s | ${site_short_name}`, // 下層: About | 青木雅季 Portfolio
  },
  description: site_description, // サイトの説明
  verification: {
    google: "lh7tuH0zYIUI9xM1krVk0m-OrrH0VSKp4PQClGVNGII",
  },
  keywords: [
    "青木雅季",
    "Masaki Aoki",
    "ポートフォリオ",
    "芝浦工業大学",
    "フロントエンドエンジニア",
  ], // SEOキーワード（Googleは評価に使わないが他の検索エンジン向けに残す）
  // Open Graphプロトコルの設定（Facebookなどで表示される情報）
  openGraph: {
    type: "website",
    locale: "ja_JP",
    title: site_name,
    description: site_description,
    siteName: site_short_name,
    url: "/",
    images: [
      {
        url: image,
        type: "image/png",
        width: 1200,
        height: 630,
        alt: "青木雅季 Portfolio",
      },
    ],
  },
  // Twitterカードの設定
  twitter: {
    card: "summary_large_image",
    title: site_name,
    description: site_description,
    images: [
      {
        url: image,
        type: "image/png",
        width: 1200,
        height: 630,
        alt: "青木雅季 Portfolio",
      },
    ],
    creator: twitter_id,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${inter.className} text-amber-200`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Suspense>
          <SkillsProvider>
            <Navbar />
            <ToasterContext />
            {children}
          </SkillsProvider>
        </Suspense>
      </body>
      <GoogleAnalytics gaId={gaId} />
    </html>
  );
}
