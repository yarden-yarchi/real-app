import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import BoxForm from "../../../components/BoxForm";

export default async function EditBoxPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: box } = await supabaseServer.from("boxes").select("*").eq("id", id).single();

  if (!box) notFound();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-purple">עריכת &quot;{box.title}&quot;</h2>
        <div className="flex items-center gap-4">
          <Link
            href={`/boxes/${box.id}`}
            target="_blank"
            className="text-sm font-bold text-purple hover:opacity-70"
          >
            צפייה בדף באתר
          </Link>
          <Link href="/real-admin/boxes" className="text-sm font-bold text-purple hover:opacity-70">
            → חזרה לרשימה
          </Link>
        </div>
      </div>

      <BoxForm box={box} />
    </div>
  );
}
