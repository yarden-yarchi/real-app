"use client";

import { useActionState } from "react";
import { saveBox, type ActionState } from "../actions";
import SubmitButton from "./SubmitButton";

export type BoxFormValues = {
  id: string;
  title: string;
  description: string | null;
  about: string | null;
  included_items: string[] | null;
  desktop_image: string | null;
  mobile_image: string | null;
  gallery_images: string[] | null;
};

const inputClass =
  "rounded-[4px] border border-purple/30 bg-white px-4 py-2 outline-none focus:border-purple";

function ImageField({
  name,
  label,
  hint,
  currentUrl,
}: {
  name: string;
  label: string;
  hint: string;
  currentUrl: string | null | undefined;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-bold text-purple">{label}</span>
      {currentUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentUrl}
          alt=""
          className="h-24 w-36 rounded-[4px] border border-purple/15 object-cover"
        />
      )}
      <input type="file" name={name} accept="image/*" className="text-sm" />
      <span className="text-xs text-foreground/50">
        {hint}
        {currentUrl && " · בחירת קובץ חדש תחליף את התמונה הקיימת"}
      </span>
    </div>
  );
}

export default function BoxForm({ box }: { box?: BoxFormValues }) {
  const [state, action] = useActionState<ActionState, FormData>(saveBox, null);

  return (
    <form action={action} className="flex flex-col gap-5 rounded-lg bg-white p-6">
      {box && <input type="hidden" name="id" value={box.id} />}

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-bold text-purple">כותרת *</span>
        <input
          type="text"
          name="title"
          required
          defaultValue={box?.title ?? ""}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-bold text-purple">תיאור קצר</span>
        <input
          type="text"
          name="description"
          defaultValue={box?.description ?? ""}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-bold text-purple">על הערכה</span>
        <textarea
          name="about"
          rows={7}
          defaultValue={box?.about ?? ""}
          className={inputClass}
        />
        <span className="text-xs text-foreground/50">שורה ריקה מפרידה בין פסקאות</span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-bold text-purple">מה כלול בערכה?</span>
        <textarea
          name="included_items"
          rows={6}
          defaultValue={box?.included_items?.join("\n") ?? ""}
          className={inputClass}
        />
        <span className="text-xs text-foreground/50">כל פריט בשורה נפרדת</span>
      </label>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <ImageField
          name="desktop_image"
          label="תמונה ראשית (מחשב)"
          hint="מופיעה באזור ההירו בעמוד הקופסה במחשב"
          currentUrl={box?.desktop_image}
        />
        <ImageField
          name="mobile_image"
          label="תמונה ראשית (נייד)"
          hint="מופיעה באזור ההירו בעמוד הקופסה במובייל"
          currentUrl={box?.mobile_image}
        />
      </div>

      <ImageField
        name="gallery_image"
        label="הוספת תמונת גלריה"
        hint="התמונה שמופיעה על כרטיסיית הקופסה בדף הבית"
        currentUrl={box?.gallery_images?.[0]}
      />

      {state?.error && <p className="text-sm font-bold text-brick">{state.error}</p>}

      <div>
        <SubmitButton>{box ? "שמירת שינויים" : "יצירת הקופסה"}</SubmitButton>
      </div>
    </form>
  );
}
