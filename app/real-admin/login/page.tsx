import type { Metadata } from "next";
import LoginForm from "../components/LoginForm";

export const metadata: Metadata = {
  title: "כניסה לניהול — ריל",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-sm">
        <h1 className="text-center font-display text-4xl text-terracotta">ניהול האתר</h1>
        <p className="mt-2 text-center text-foreground/70">התחברו כדי להמשיך</p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
