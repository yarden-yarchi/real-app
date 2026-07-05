"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAuth, requireAdminUser } from "@/lib/supabase-auth";

export type ActionState = { error?: string; success?: boolean } | null;

/* ---------- Auth ---------- */

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "נא למלא אימייל וסיסמה" };

  const supabase = await supabaseAuth();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "אימייל או סיסמה שגויים" };

  redirect("/real-admin");
}

export async function signOut() {
  const supabase = await supabaseAuth();
  await supabase.auth.signOut();
  redirect("/real-admin/login");
}

/* ---------- Users ---------- */

export async function createUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminUser();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !email.includes("@")) return { error: "כתובת אימייל לא תקינה" };
  if (password.length < 8) return { error: "הסיסמה חייבת להכיל לפחות 8 תווים" };

  const { error } = await supabaseServer.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    return {
      error: error.code === "email_exists" ? "כבר קיים משתמש עם האימייל הזה" : error.message,
    };
  }

  revalidatePath("/real-admin/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const me = await requireAdminUser();
  if (me.id === userId) throw new Error("לא ניתן למחוק את המשתמש שאיתו אתם מחוברים");

  const { error } = await supabaseServer.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);

  revalidatePath("/real-admin/users");
}

/* ---------- Storage ---------- */

async function uploadImage(file: File, prefix: string): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabaseServer.storage.from("media").upload(path, file, {
    contentType: file.type || undefined,
  });
  if (error) throw new Error(`העלאת התמונה נכשלה: ${error.message}`);

  return supabaseServer.storage.from("media").getPublicUrl(path).data.publicUrl;
}

function isUploadedFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0 && value.name !== "";
}

/* ---------- Boxes ---------- */

function revalidateSite() {
  revalidatePath("/", "layout");
}

export async function saveBox(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminUser();

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "חובה למלא כותרת" };

  try {
    const row: Record<string, unknown> = {
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      about: String(formData.get("about") ?? "").trim() || null,
      included_items: String(formData.get("included_items") ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const desktopFile = formData.get("desktop_image");
    if (isUploadedFile(desktopFile)) row.desktop_image = await uploadImage(desktopFile, "desktop");

    const mobileFile = formData.get("mobile_image");
    if (isUploadedFile(mobileFile)) row.mobile_image = await uploadImage(mobileFile, "mobile");

    const galleryFile = formData.get("gallery_image");
    if (isUploadedFile(galleryFile)) {
      const newUrl = await uploadImage(galleryFile, "gallery");
      if (id) {
        // The card image is gallery_images[0]; replace it and keep any extras.
        const { data: existing } = await supabaseServer
          .from("boxes")
          .select("gallery_images")
          .eq("id", id)
          .single();
        row.gallery_images = [newUrl, ...(existing?.gallery_images ?? []).slice(1)];
      } else {
        row.gallery_images = [newUrl];
      }
    } else if (!id) {
      row.gallery_images = [];
    }

    const { error } = id
      ? await supabaseServer.from("boxes").update(row).eq("id", id)
      : await supabaseServer.from("boxes").insert(row);
    if (error) throw new Error(error.message);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "השמירה נכשלה" };
  }

  revalidateSite();
  redirect("/real-admin/boxes");
}

export async function deleteBox(id: string) {
  await requireAdminUser();

  const { error } = await supabaseServer.from("boxes").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidateSite();
  revalidatePath("/real-admin/boxes");
}

/* ---------- FAQs ---------- */

export async function saveFaq(formData: FormData) {
  await requireAdminUser();

  const id = String(formData.get("id") ?? "");
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  if (!question || !answer) throw new Error("חובה למלא שאלה ותשובה");

  if (id) {
    const { error } = await supabaseServer.from("faqs").update({ question, answer }).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data: last } = await supabaseServer
      .from("faqs")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { error } = await supabaseServer
      .from("faqs")
      .insert({ question, answer, sort_order: (last?.sort_order ?? 0) + 1 });
    if (error) throw new Error(error.message);
  }

  revalidateSite();
  revalidatePath("/real-admin/faqs");
}

export async function reorderFaqs(orderedIds: string[]) {
  await requireAdminUser();

  for (const [index, id] of orderedIds.entries()) {
    const { error } = await supabaseServer
      .from("faqs")
      .update({ sort_order: index + 1 })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  revalidateSite();
  revalidatePath("/real-admin/faqs");
}

export async function deleteFaq(id: string) {
  await requireAdminUser();

  const { error } = await supabaseServer.from("faqs").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidateSite();
  revalidatePath("/real-admin/faqs");
}
