import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://masaki-aoki-profile.vercel.app",
      lastModified: new Date("2026-11-16"),
    },
  ];
}
