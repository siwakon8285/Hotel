import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RoomNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-24 pb-32">
      <div className="max-w-xl mx-auto px-6 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-zinc-900 mb-6">
          Room not found.
        </h1>
        <p className="text-zinc-500 text-lg font-light mb-10 leading-relaxed">
          This room may no longer be available, or the URL might be incorrect.
          Explore our current rooms and suites to find your perfect stay.
        </p>
        <Link 
          href="/rooms"
          className="inline-flex items-center justify-center bg-zinc-900 text-white font-medium tracking-widest uppercase text-sm px-8 py-4 hover:bg-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Rooms
        </Link>
      </div>
    </div>
  );
}
