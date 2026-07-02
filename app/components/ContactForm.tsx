"use client";

import { useState } from "react";

export default function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [phone, setPhone] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3.5 sm:flex-row sm:items-center"
    >
      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="שם מלא"
        className="w-full rounded-[10px] bg-cream px-5 py-3 text-foreground placeholder:text-foreground/60 focus:outline-none sm:flex-1"
      />
      <input
        value={schoolName}
        onChange={(e) => setSchoolName(e.target.value)}
        placeholder="שם בית הספר"
        className="w-full rounded-[10px] bg-cream px-5 py-3 text-foreground placeholder:text-foreground/60 focus:outline-none sm:flex-1"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="מספר טלפון לחזרה"
        className="w-full rounded-[10px] bg-cream px-5 py-3 text-foreground placeholder:text-foreground/60 focus:outline-none sm:flex-1"
      />
      <button
        type="submit"
        className="w-full shrink-0 rounded-[4px] bg-terracotta px-8 py-3 font-bold text-white transition-transform duration-150 hover:scale-95 hover:opacity-90 sm:w-auto"
      >
        שליחה
      </button>
    </form>
  );
}
