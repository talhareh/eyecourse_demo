import Link from "next/link";
import { Stethoscope } from "lucide-react";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-slate-900">
          <span className="rounded-lg bg-cyan-600 p-2 text-white">
            <Stethoscope size={18} />
          </span>
          <span className="text-sm font-bold tracking-wide sm:text-base">ENT Learning Studio</span>
        </Link>

        <nav className="flex items-center gap-2 text-sm text-slate-700 sm:gap-5">
          <Link href="/" className="rounded-md px-2 py-1 hover:bg-slate-100">
            Home
          </Link>
          <Link href="/courses" className="rounded-md px-2 py-1 hover:bg-slate-100">
            Courses
          </Link>
        </nav>
      </div>
    </header>
  );
}
