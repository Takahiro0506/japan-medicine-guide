import type { MetadataRoute } from "next";

const SITE_URL = "https://japan-medicine-guide-omega.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/review"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
