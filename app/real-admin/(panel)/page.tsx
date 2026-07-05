import { redirect } from "next/navigation";

export default function AdminIndexPage() {
  redirect("/real-admin/users");
}
