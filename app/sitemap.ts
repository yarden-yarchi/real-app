import type { MetadataRoute } from "next";
import { supabaseServer } from "@/lib/supabase-server";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: boxes } = await supabaseServer.from("boxes").select("id");

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...(boxes ?? []).map(
      (box): MetadataRoute.Sitemap[number] => ({
        url: `${SITE_URL}/boxes/${box.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      })
    ),
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/accessibility`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
