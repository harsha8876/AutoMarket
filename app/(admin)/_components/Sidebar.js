"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Car, Calendar, Cog, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@clerk/nextjs";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Cars", icon: Car, href: "/admin/cars" },
  { label: "Test Drives", icon: Calendar, href: "/admin/test-drives" },
  { label: "Settings", icon: Cog, href: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-56 bg-primary text-white shadow-lg hidden md:flex flex-col">
      <div className="p-5 border-b border-primary-hover/50">
        <div className="flex items-center space-x-3">
          <LayoutDashboard className="h-7 w-7 text-white" />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3">
        <p className="text-gray-300 px-3 text-xs font-medium mb-3 uppercase tracking-wide">
          Main Menu
        </p>

        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              // ✅ unified button look
              "flex items-center space-x-3 rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer",
              pathname === route.href
                ? "bg-primary-hover text-white shadow-sm"
                : "bg-primary hover:bg-primary-hover/80 hover:shadow-sm"
            )}
          >
            <route.icon className="h-5 w-5 shrink-0" />
            <span>{route.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto p-5 border-t border-primary-hover/50">
        <SignOutButton>
          <button className="flex items-center space-x-3 w-full rounded-md px-4 py-2.5 text-sm font-medium bg-primary hover:bg-primary-hover transition-all duration-200 cursor-pointer">
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Logout</span>
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
