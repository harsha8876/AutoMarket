"use client";

import { usePathname } from "next/navigation";

export default function ConditionalHeader({ children }) {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return children;
}
