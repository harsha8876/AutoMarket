"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function HeaderBackground({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const solid = !isHome || scrolled;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        solid
          ? "bg-surface/95 backdrop-blur-md border-b border-border"
          : "bg-transparent border-transparent"
      }`}
    >
      {children}
    </header>
  );
}
