import { supabaseServer } from "@/lib/supabase-server";
import FaqManager from "../../components/FaqManager";

export default async function AdminFaqsPage() {
  const { data: faqs, error } = await supabaseServer
    .from("faqs")
    .select("id, question, answer")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return <p className="font-bold text-brick">טעינת השאלות נכשלה: {error.message}</p>;
  }

  return <FaqManager faqs={faqs} />;
}
