import { supabaseServer } from "@/lib/supabase-server";
import { requireAdminUser } from "@/lib/supabase-auth";
import { deleteUser } from "../../actions";
import AddUserForm from "../../components/AddUserForm";
import DeleteButton from "../../components/DeleteButton";

export default async function AdminUsersPage() {
  const me = await requireAdminUser();
  const { data, error } = await supabaseServer.auth.admin.listUsers();

  if (error) {
    return <p className="font-bold text-brick">טעינת המשתמשים נכשלה: {error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <AddUserForm />

      <div className="overflow-hidden rounded-lg bg-white">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-purple/15 text-sm text-foreground/60">
              <th className="px-6 py-3 font-bold">אימייל</th>
              <th className="px-6 py-3 font-bold">נוצר בתאריך</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {data.users.map((user) => (
              <tr key={user.id} className="border-b border-purple/10 last:border-0">
                <td className="px-6 py-4 font-bold text-purple" dir="ltr">
                  <span className="flex items-center justify-end gap-2">
                    {user.id === me.id && (
                      <span className="rounded-full bg-pink-light px-3 py-0.5 text-xs font-bold text-purple">
                        מחוברים כרגע
                      </span>
                    )}
                    {user.email}
                  </span>
                </td>
                <td className="px-6 py-4 text-foreground/70">
                  {new Date(user.created_at).toLocaleDateString("he-IL")}
                </td>
                <td className="px-6 py-4">
                  {user.id !== me.id && (
                    <DeleteButton
                      action={deleteUser.bind(null, user.id)}
                      confirmText={`למחוק את המשתמש ${user.email}? פעולה זו אינה הפיכה.`}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
