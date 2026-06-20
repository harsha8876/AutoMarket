"use client";

import { usePathname } from "next/navigation";

export default function ConditionalMain({ children }) {
  const pathname = usePathname();
  return (
    <main className={`min-h-screen ${pathname !== "/" ? "pt-20" : ""}`}>
      {children}
    </main>
  );
}
