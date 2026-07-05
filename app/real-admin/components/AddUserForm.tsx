"use client";

import { useActionState, useEffect, useRef } from "react";
import { createUser, type ActionState } from "../actions";
import SubmitButton from "./SubmitButton";

export default function AddUserForm() {
  const [state, action] = useActionState<ActionState, FormData>(createUser, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="rounded-lg bg-white p-6">
      <h2 className="text-xl font-bold text-purple">הוספת משתמש חדש</h2>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-sm font-bold text-purple">אימייל</span>
          <input
            type="email"
            name="email"
            required
            dir="ltr"
            className="rounded-[4px] border border-purple/30 bg-white px-4 py-2 text-left outline-none focus:border-purple"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-sm font-bold text-purple">סיסמה (לפחות 8 תווים)</span>
          <input
            type="text"
            name="password"
            required
            minLength={8}
            dir="ltr"
            className="rounded-[4px] border border-purple/30 bg-white px-4 py-2 text-left outline-none focus:border-purple"
          />
        </label>
        <SubmitButton pendingText="מוסיף...">הוספה</SubmitButton>
      </div>
      {state?.error && <p className="mt-3 text-sm font-bold text-brick">{state.error}</p>}
      {state?.success && <p className="mt-3 text-sm font-bold text-green-700">המשתמש נוסף בהצלחה</p>}
    </form>
  );
}
