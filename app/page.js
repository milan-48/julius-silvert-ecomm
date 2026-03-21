"use client";

import { useState } from "react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";

export default function Home() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen max-w-full flex-col overflow-x-clip bg-white">
      <AnnouncementBar />
      <Header
        mobileNavOpen={mobileNavOpen}
        onMobileNavToggle={() => setMobileNavOpen((o) => !o)}
        onMobileNavClose={() => setMobileNavOpen(false)}
      />
      <main className="flex-1">
        <Hero />
        <CategoryGrid />
      </main>
    </div>
  );
}
