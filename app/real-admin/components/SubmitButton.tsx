"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
  pendingText = "שומר...",
  className = "",
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-[4px] bg-purple px-6 py-2 font-bold text-white transition-transform duration-150 hover:scale-95 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {pending ? pendingText : children}
    </button>
  );
}
