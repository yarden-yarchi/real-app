import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mx-[10px] md:mx-5 mb-5 mt-12 rounded-lg bg-white px-5 py-6 md:mt-16">
      <div className="mx-auto flex max-w-[1140px] flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-6 text-lg text-purple">
          <Link href="/accessibility" className="hover:opacity-70">
            הצהרת נגישות
          </Link>
          <Link href="/terms" className="hover:opacity-70">
            תנאי שימוש
          </Link>
        </div>
        <a
          href="https://yarden-yarchi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-purple/70 hover:opacity-70"
        >
          yarden-yarchi.com
        </a>
      </div>
    </footer>
  );
}
