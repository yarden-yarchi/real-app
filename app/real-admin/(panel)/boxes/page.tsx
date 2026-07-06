import { supabaseServer } from "@/lib/supabase-server";
import BoxManager from "../../components/BoxManager";

export default async function AdminBoxesPage() {
  const { data: boxes, error } = await supabaseServer
    .from("boxes")
    .select("id, title, description, gallery_images, updated_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return <p className="font-bold text-brick">טעינת הקופסאות נכשלה: {error.message}</p>;
  }

  return <BoxManager boxes={boxes} />;
}
