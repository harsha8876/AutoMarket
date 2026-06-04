// "use client";

// import { useState, useEffect } from "react";
// import { Heart } from "lucide-react";
// import Link from "next/link";
// import { CarCard } from "@/components/car-card";
// import { Button } from "@/components/ui/button";

// export default function SavedCarsPage({ initialData }) {
//   const [savedCars, setSavedCars] = useState(initialData?.data || []);
//   const [loading, setLoading] = useState(!initialData);

//   // ✅ Fetch saved cars only if no initialData (like in 1st code)
//   useEffect(() => {
//     if (initialData) {
//       setLoading(false);
//       return;
//     }

//     const fetchSavedCars = async () => {
//       try {
//         const res = await fetch("/api/saved-cars");
//         const contentType = res.headers.get("content-type");
//         if (!contentType?.includes("application/json")) {
//           throw new Error("Invalid JSON response");
//         }

//         const data = await res.json();
//         setSavedCars(data.data || []);
//       } catch (error) {
//         console.error("Error fetching saved cars:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSavedCars();
//   }, [initialData]);

//   // ✅ Handle removing from wishlist (newly added logic)
//   const handleRemoveFromWishlist = async (carId) => {
//     try {
//       await fetch(`/api/saved-cars/${carId}`, { method: "DELETE" });
//       setSavedCars((prev) => prev.filter((car) => car.id !== carId));
//     } catch (error) {
//       console.error("Error removing car:", error);
//     }
//   };

//   // ✅ Loading spinner
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0071E3]"></div>
//       </div>
//     );
//   }

//   // ✅ Empty state (same condition as 1st code, but styled like 2nd)
//   if (!savedCars || savedCars.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
//         <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
//           <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">No Saved Cars Yet</h2>
//           <p className="text-gray-600 mb-6">
//             You haven't saved any cars yet. Browse our listings and click the heart icon to save cars for later.
//           </p>
//           <Link href="/cars">
//             <Button className="bg-[#0071E3] text-white px-6 py-3 rounded-xl hover:bg-[#005BB5] transition-all">
//               Browse Cars
//             </Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Display saved cars
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 px-4 pb-12">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center gap-3 mb-2">
//             <Heart className="w-8 h-8 text-[#1D1D1F] fill-current" />
//             <h1 className="text-4xl font-bold text-[#1D1D1F]">Saved Cars</h1>
//           </div>
//           <p className="text-gray-600">
//             {savedCars.length} {savedCars.length === 1 ? "car" : "cars"} in your wishlist
//           </p>
//         </div>

//         {/* Cars Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {savedCars.map((car) => (
//             <CarCard
//               key={car.id}
//               car={{ ...car, wishlisted: true }}
//               onRemove={handleRemoveFromWishlist}
//               showRemoveButton={true}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import { getSavedCars } from "@/actions/car-listing";
import SavedCarsList from "./_components/saved-car-list";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
export const metadata = {
  title: "Saved Cars | DriveIQ",
  description: "View your saved cars and favorites",
};

export default async function SavedCarsPage() {
  // Check authentication on server
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect=/saved-cars");
  }

  // Fetch saved cars on the server
  const savedCarsResult = await getSavedCars();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-8 h-8 text-[#1D1D1F] fill-current" />
        <h1 className="text-4xl font-bold text-[#1D1D1F]">Saved Cars</h1>
    </div>
      <SavedCarsList initialData={savedCarsResult} />
    </div>
  );
}