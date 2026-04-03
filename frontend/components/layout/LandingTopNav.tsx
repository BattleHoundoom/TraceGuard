"use client";

import Link from "next/link";

export default function LandingTopNav() {
  return (
    <nav className="fixed top-0 z-50 flex justify-between items-center w-full px-6 py-3 bg-[#191c22]">
      <div className="flex items-center gap-8">
        <Link href="/">
          <span className="text-xl font-bold text-[#ffb000] tracking-tighter font-headline uppercase cursor-pointer">
            TraceGuard
          </span>
        </Link>
        <Link href="/">
          <span className="text-sm font-headline font-bold uppercase tracking-wider cursor-pointer text-[#ffd597] border-b-2 border-[#ffb000]">
            Monitor
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <button className="material-symbols-outlined text-[#ffb000] cursor-pointer active:opacity-80">
          notifications
        </button>
        <button className="material-symbols-outlined text-[#ffb000] cursor-pointer active:opacity-80">
          account_circle
        </button>
      </div>
    </nav>
  );
}
