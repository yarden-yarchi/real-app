"use server";

export type ContactState = { error?: string; success?: boolean } | null;

const LEAD_EMAIL = "Shovalbitton1995@gmail.com";

export async function submitLead(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const schoolName = String(formData.get("schoolName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!fullName || !phone) return { error: "נא למלא שם מלא ומספר טלפון" };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { error: "שליחת הטופס אינה זמינה כרגע, נסו שוב מאוחר יותר" };

  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
        to: [LEAD_EMAIL],
        subject: `ליד חדש מהאתר: ${fullName}`,
        text: [
          `שם מלא: ${fullName}`,
          `בית ספר: ${schoolName || "-"}`,
          `טלפון: ${phone}`,
        ].join("\n"),
      }),
    });
  } catch (err) {
    console.error("submitLead: failed to reach Resend", err);
    return { error: "אירעה שגיאה בשליחה, נסו שוב" };
  }

  if (!res.ok) {
    console.error("submitLead: Resend responded with", res.status, await res.text());
    return { error: "אירעה שגיאה בשליחה, נסו שוב" };
  }

  return { success: true };
}
