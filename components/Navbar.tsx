"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/students", label: "Students" },
  { href: "/alumni", label: "Alumni" },
  { href: "/give", label: "Give" },
  { href: "/animecraft", label: "🌸 SakuraCraft" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-westmont-navy/10 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-westmont-navy to-westmont-sky font-bold text-white">
            C
          </span>
          <span className="text-lg font-bold tracking-tight text-westmont-navy">
            CATLab <span className="text-westmont-gold">Network</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-westmont-navy text-white"
                    : l.href === "/give"
                    ? "text-westmont-gold font-semibold hover:bg-westmont-gold/10"
                    : "text-westmont-blue hover:bg-westmont-navy/5"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
