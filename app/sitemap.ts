import type { MetadataRoute } from "next";
import { supabaseServer } from "@/lib/supabase-server";
import { SITE_URL } from "@/lib/site";

// Regenerate at least hourly so boxes added in the admin panel show up
// without a redeploy (admin actions also revalidate it immediately).
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: boxes } = await supabaseServer.from("boxes").select("id, updated_at");

  const boxDates = (boxes ?? [])
    .map((box) => (box.updated_at ? new Date(box.updated_at) : null))
    .filter((d): d is Date => d !== null && !isNaN(d.getTime()));
  const latest = boxDates.length
    ? new Date(Math.max(...boxDates.map((d) => d.getTime())))
    : undefined;

  return [
    { url: SITE_URL, lastModified: latest, changeFrequency: "weekly", priority: 1 },
    ...(boxes ?? []).map(
      (box): MetadataRoute.Sitemap[number] => ({
        url: `${SITE_URL}/boxes/${box.id}`,
        lastModified: box.updated_at ? new Date(box.updated_at) : undefined,
        changeFrequency: "monthly",
        priority: 0.8,
      })
    ),
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/accessibility`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
