import Link from "next/link";
import BoxForm from "../../../components/BoxForm";

export default function NewBoxPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-purple">קופסה חדשה</h2>
        <Link href="/real-admin/boxes" className="text-sm font-bold text-purple hover:opacity-70">
          → חזרה לרשימה
        </Link>
      </div>
      <BoxForm />
    </div>
  );
}
