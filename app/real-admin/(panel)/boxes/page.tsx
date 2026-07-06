import Image from "next/image";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import { deleteBox } from "../../actions";
import DeleteButton from "../../components/DeleteButton";

export default async function AdminBoxesPage() {
  const { data: boxes, error } = await supabaseServer
    .from("boxes")
    .select("id, title, description, gallery_images, updated_at")
    .order("created_at", { ascending: true });

  if (error) {
    return <p className="font-bold text-brick">טעינת הקופסאות נכשלה: {error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-purple">{boxes.length} קופסאות</h2>
        <Link
          href="/real-admin/boxes/new"
          className="rounded-[4px] bg-purple px-5 py-2 font-bold text-white transition-transform duration-150 hover:scale-95 hover:opacity-90"
        >
          + קופסה חדשה
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {boxes.map((box) => (
          <div key={box.id} className="flex flex-col overflow-hidden rounded-lg bg-white">
            <div className="relative aspect-[254/160] w-full bg-pink-light">
              {box.gallery_images?.[0] && (
                <Image
                  src={box.gallery_images[0]}
                  alt={box.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <h3 className="text-lg font-bold text-purple">{box.title}</h3>
              {box.description && (
                <p className="line-clamp-2 text-sm text-foreground/70">{box.description}</p>
              )}
              <div className="mt-auto flex items-center gap-2 pt-3">
                <Link
                  href={`/real-admin/boxes/${box.id}`}
                  className="rounded-[4px] bg-purple px-4 py-1.5 text-sm font-bold text-white transition-transform duration-150 hover:scale-95 hover:opacity-90"
                >
                  עריכה
                </Link>
                <DeleteButton
                  action={deleteBox.bind(null, box.id)}
                  confirmText={`למחוק את הקופסה "${box.title}"? היא תוסר מהאתר מיד ופעולה זו אינה הפיכה.`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {boxes.length === 0 && (
        <p className="text-center text-foreground/60">אין עדיין קופסאות — הוסיפו את הראשונה!</p>
      )}
    </div>
  );
}
