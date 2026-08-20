import type { Metadata } from "next";
import { Suspense } from "react";
import { RoomsHero } from "../../components/rooms/RoomsHero";
import { RoomsSearchExperience } from "../../components/rooms/RoomsSearchExperience";

export const metadata: Metadata = {
  title: "Rooms & Suites | Aurora Grand Hotel",
  description: "Spaces designed for rest, privacy, and perspective. Browse and reserve your stay at Aurora Grand Hotel.",
};

export default function RoomsPage() {
  return (
    <div className="flex-1 bg-zinc-50">
      <RoomsHero />
      <Suspense fallback={<div className="h-96 w-full flex items-center justify-center"><p className="text-zinc-400 uppercase tracking-widest text-sm animate-pulse">Loading experience...</p></div>}>
        <RoomsSearchExperience />
      </Suspense>
    </div>
  );
}
