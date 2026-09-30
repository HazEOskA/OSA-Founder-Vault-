import type { MetadataRoute } from "next";

const base = "https://osa-founder-vault.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/buy", "/terms", "/privacy", "/refunds"];
  const passRoutes = Array.from({ length: 50 }, (_, index) =>
    `/pass/OSA-GEN-${String(index + 1).padStart(4, "0")}`
  );

  return [...staticRoutes, ...passRoutes].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path.startsWith("/pass/") ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/buy" ? 0.9 : 0.6,
  }));
}
