"use client";

import { useFormStatus } from "react-dom";

function InnerButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-[4px] border border-brick px-4 py-1.5 text-sm font-bold text-brick transition-colors hover:bg-brick hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "מוחק..." : children}
    </button>
  );
}

export default function DeleteButton({
  action,
  confirmText,
  children = "מחיקה",
}: {
  action: () => Promise<void>;
  confirmText: string;
  children?: React.ReactNode;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <InnerButton>{children}</InnerButton>
    </form>
  );
}
