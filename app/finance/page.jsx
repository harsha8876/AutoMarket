"use client";

import React from "react";
import { FinanceSection } from "@/components/FinanceSection";


export default function FinancePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-[#1D1D1F]">Finance Options</h1>
          </div>
        </div>
      </header>

      <main className="py-16 space-y-16">
        {/* Finance Section */}
        <FinanceSection />

       
      </main>
    </div>
  );
}