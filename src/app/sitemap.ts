import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      images: [
        `${SITE_URL}/og_image/og-image.png`,
        `${SITE_URL}/assets/profile.webp`,
      ],
    },
  ];
}

