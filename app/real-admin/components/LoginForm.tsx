"use client";

import { useActionState } from "react";
import { signIn, type ActionState } from "../actions";
import SubmitButton from "./SubmitButton";

export default function LoginForm() {
  const [state, action] = useActionState<ActionState, FormData>(signIn, null);

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-right">
        <span className="font-bold text-purple">אימייל</span>
        <input
          type="email"
          name="email"
          required
          dir="ltr"
          autoComplete="username"
          className="rounded-[4px] border border-purple/30 bg-white px-4 py-2.5 text-left outline-none focus:border-purple"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-right">
        <span className="font-bold text-purple">סיסמה</span>
        <input
          type="password"
          name="password"
          required
          dir="ltr"
          autoComplete="current-password"
          className="rounded-[4px] border border-purple/30 bg-white px-4 py-2.5 text-left outline-none focus:border-purple"
        />
      </label>

      {state?.error && <p className="text-sm font-bold text-brick">{state.error}</p>}

      <SubmitButton pendingText="מתחבר...">התחברות</SubmitButton>
    </form>
  );
}
