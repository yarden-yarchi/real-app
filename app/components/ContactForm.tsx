"use client";

import { useActionState } from "react";
import { submitLead, type ContactState } from "@/app/(site)/actions";

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitLead, null);

  if (state?.success) {
    return (
      <p className="rounded-[10px] bg-cream px-5 py-4 text-center font-bold text-foreground">
        הטופס נשלח בהצלחה, נחזור אליך!
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center">
        <input
          name="fullName"
          required
          placeholder="שם מלא"
          className="w-full rounded-[10px] bg-cream px-5 py-3 text-foreground placeholder:text-foreground/60 focus:outline-none sm:flex-1"
        />
        <input
          name="schoolName"
          placeholder="שם בית הספר"
          className="w-full rounded-[10px] bg-cream px-5 py-3 text-foreground placeholder:text-foreground/60 focus:outline-none sm:flex-1"
        />
        <input
          name="phone"
          type="tel"
          dir="rtl"
          required
          placeholder="מספר טלפון לחזרה"
          className="w-full rounded-[10px] bg-cream px-5 py-3 text-right text-foreground placeholder:text-foreground/60 focus:outline-none sm:flex-1"
        />
        <button
          type="submit"
          disabled={pending}
          className="w-full shrink-0 rounded-[4px] bg-terracotta px-8 py-3 font-bold text-white transition-transform duration-150 hover:scale-95 hover:opacity-90 disabled:opacity-60 sm:w-auto"
        >
          {pending ? "שולח..." : "שליחה"}
        </button>
      </div>
      {state?.error && <p className="text-sm font-bold text-brick">{state.error}</p>}
    </form>
  );
}
