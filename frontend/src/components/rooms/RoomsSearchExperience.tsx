"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Room, RoomType } from "@/types";
import { roomService } from "@/services/room.service";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { RoomCard } from "@/components/rooms/RoomCard";
import { z } from "zod";

// Zod Schema for validation
const searchSchema = z.object({
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.number().int().min(1, "At least 1 guest required").optional(),
  roomType: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.checkIn && !data.checkOut) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Check-out date is required when Check-in is selected",
      path: ["checkOut"]
    });
  }
  if (!data.checkIn && data.checkOut) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Check-in date is required when Check-out is selected",
      path: ["checkIn"]
    });
  }
  if (data.checkIn && data.checkOut) {
    const inDate = new Date(data.checkIn);
    const outDate = new Date(data.checkOut);
    if (outDate <= inDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Check-out must be after check-in",
        path: ["checkOut"]
      });
    }
  }
});

type SearchFormState = {
  checkIn: string;
  checkOut: string;
  guests: string;
  roomType: string;
};

export function RoomsSearchExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formState, setFormState] = useState<SearchFormState>({
    checkIn: searchParams.get("check_in") || "",
    checkOut: searchParams.get("check_out") || "",
    guests: searchParams.get("guests") || "",
    roomType: searchParams.get("room_type") || "",
  });

  const [rooms, setRooms] = useState<Room[]>([]);
  const [allRoomTypes, setAllRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Fetch all available room types on mount to populate the dropdown
  useEffect(() => {
    let mounted = true;
    roomService.searchRooms().then(allRooms => {
      if (!mounted) return;
      const typesMap = new Map<string, RoomType>();
      allRooms.forEach(r => {
        if (!typesMap.has(r.room_type.id)) {
          typesMap.set(r.room_type.id, r.room_type);
        }
      });
      setAllRoomTypes(Array.from(typesMap.values()));
    }).catch(err => {
      console.error("Failed to load room types:", err);
    });
    return () => { mounted = false; };
  }, []);

  const handleFieldChange = (field: keyof SearchFormState, value: string) => {
    setFormState(prev => {
      const newState = { ...prev, [field]: value };
      
      // Auto-adjust checkout if it's before the new check-in
      if (field === 'checkIn' && newState.checkIn && newState.checkOut) {
        if (new Date(newState.checkOut) <= new Date(newState.checkIn)) {
          newState.checkOut = ''; // clear checkOut safely
        }
      }
      
      return newState;
    });
    
    // Clear the specific validation error when user types
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[field];
        if (field === 'checkIn') delete newErrs['checkOut'];
        if (field === 'checkOut') delete newErrs['checkIn'];
        return newErrs;
      });
    }
    // Also clear API error if they start typing again
    setError(null);
  };

  // Removed derived availableRoomTypes, we now use allRoomTypes state instead

  const performSearch = useCallback(async (params: SearchFormState) => {
    setLoading(true);
    setError(null);
    try {
      const parsedGuests = params.guests ? parseInt(params.guests, 10) : undefined;
      const apiParams = {
        checkIn: params.checkIn || undefined,
        checkOut: params.checkOut || undefined,
        guests: parsedGuests,
        roomType: params.roomType || undefined,
      };

      const result = await roomService.searchRooms(apiParams);
      setRooms(result || []);
    } catch (err: unknown) {
      console.error("Room search failed:", err);
      setError("Failed to load rooms. Please try again later.");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync from URL changes (initial load + browser back/forward)
  useEffect(() => {
    const currentParams = {
      checkIn: searchParams.get("check_in") || "",
      checkOut: searchParams.get("check_out") || "",
      guests: searchParams.get("guests") || "",
      roomType: searchParams.get("room_type") || "",
    };
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormState(currentParams);
    
    // Only perform search if valid
    const parsedGuests = currentParams.guests ? parseInt(currentParams.guests, 10) : undefined;
    const validationResult = searchSchema.safeParse({
      checkIn: currentParams.checkIn || undefined,
      checkOut: currentParams.checkOut || undefined,
      guests: parsedGuests,
      roomType: currentParams.roomType || undefined,
    });
    
    if (validationResult.success) {
      setValidationErrors({});
      performSearch(currentParams);
    } else {
      const errMap: Record<string, string> = {};
      validationResult.error.issues.forEach(iss => {
        errMap[iss.path[0] as string] = iss.message;
      });
      setValidationErrors(errMap);
      setLoading(false);
    }
  }, [searchParams, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before syncing to URL
    const parsedGuests = formState.guests ? parseInt(formState.guests, 10) : undefined;
    const validationResult = searchSchema.safeParse({
      checkIn: formState.checkIn || undefined,
      checkOut: formState.checkOut || undefined,
      guests: parsedGuests,
      roomType: formState.roomType || undefined,
    });

    if (!validationResult.success) {
      const errMap: Record<string, string> = {};
      validationResult.error.issues.forEach(iss => {
        errMap[iss.path[0] as string] = iss.message;
      });
      setValidationErrors(errMap);
      return;
    }

    setValidationErrors({});
    
    // Update URL (triggers the useEffect)
    const newParams = new URLSearchParams();
    if (formState.checkIn) newParams.set("check_in", formState.checkIn);
    if (formState.checkOut) newParams.set("check_out", formState.checkOut);
    if (formState.guests) newParams.set("guests", formState.guests);
    if (formState.roomType) newParams.set("room_type", formState.roomType);
    
    router.push(`/rooms?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      {/* Search Bar */}
      <Reveal animation="fade-up">
        <form 
          onSubmit={handleSearch}
          className="bg-white p-6 md:p-8 border border-zinc-100 shadow-sm mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 items-start">
            <div className="md:col-span-1">
              <label htmlFor="checkIn" className="block text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-2">Check-in</label>
              <input
                id="checkIn"
                type="date"
                value={formState.checkIn}
                onChange={e => handleFieldChange('checkIn', e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-zinc-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
              {validationErrors.checkIn && <p className="text-red-500 text-xs mt-1">{validationErrors.checkIn}</p>}
            </div>
            
            <div className="md:col-span-1">
              <label htmlFor="checkOut" className="block text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-2">Check-out</label>
              <input
                id="checkOut"
                type="date"
                min={formState.checkIn ? new Date(new Date(formState.checkIn).getTime() + 86400000).toISOString().split('T')[0] : undefined}
                value={formState.checkOut}
                onChange={e => handleFieldChange('checkOut', e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-zinc-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
              {validationErrors.checkOut && <p className="text-red-500 text-xs mt-1">{validationErrors.checkOut}</p>}
            </div>
            
            <div className="md:col-span-1">
              <label htmlFor="guests" className="block text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-2">Guests</label>
              <input
                id="guests"
                type="number"
                min="1"
                placeholder="2"
                value={formState.guests}
                onChange={e => handleFieldChange('guests', e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-zinc-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
              {validationErrors.guests && <p className="text-red-500 text-xs mt-1">{validationErrors.guests}</p>}
            </div>
            
            <div className="md:col-span-1">
              <label htmlFor="roomType" className="block text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-2">Room Type</label>
              <select
                id="roomType"
                value={formState.roomType}
                onChange={e => handleFieldChange('roomType', e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-zinc-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors appearance-none"
              >
                <option value="">Any Type</option>
                {allRoomTypes.map(rt => (
                  <option key={rt.id} value={rt.id}>{rt.name}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-1 flex items-end h-full">
              <button 
                type="submit" 
                className="w-full bg-zinc-900 text-white font-medium tracking-widest uppercase text-sm px-6 py-3.5 hover:bg-amber-600 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </Reveal>

      {/* Results Section */}
      {loading ? (
        <div className="py-20 text-center">
          <p className="text-zinc-400 uppercase tracking-widest text-sm animate-pulse">Searching available rooms...</p>
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <button 
            onClick={() => performSearch(formState)} 
            className="mt-4 text-sm uppercase tracking-widest text-amber-600 hover:text-amber-700"
          >
            Try Again
          </button>
        </div>
      ) : rooms.length === 0 ? (
        <div className="py-20 text-center bg-white border border-zinc-100 p-8">
          <h3 className="font-heading text-2xl font-bold mb-4">No rooms match your stay.</h3>
          <p className="text-zinc-500">Try adjusting your dates, guest count, or room type.</p>
        </div>
      ) : (
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" stagger={0.1}>
          {rooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </StaggerGroup>
      )}
    </div>
  );
}
