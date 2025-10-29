"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  ArrowLeft,
  Gauge,
  Fuel,
  Star,
  Users,
  Calendar,
  Heart,
  Share2,
  Currency,
  LocateFixed
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmiCalculator } from "./emi-calculator";
import { toggleSavedCar } from "@/actions/car-listing";
import useFetch from "@/hooks/use-fetch";
import { formatCurrency } from "@/lib/helpers";
import { format } from "date-fns";

export default function CarDetailPage({ car, testDriveInfo }) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(car?.wishlisted || false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // ✅ Added for gallery

  // ✅ Use toggleSavedCar with custom useFetch hook
  const {
    loading: savingCar,
    fn: toggleSavedCarFn,
    data: toggleResult,
    error: toggleError,
  } = useFetch(toggleSavedCar);

  // ✅ Handle success toggle
  useEffect(() => {
    if (toggleResult?.success) {
      setIsWishlisted(toggleResult.saved);
      toast.success(toggleResult.message);
    }
  }, [toggleResult]);

  // ✅ Handle errors
  useEffect(() => {
    if (toggleError) {
      toast.error("Failed to update favorites");
    }
  }, [toggleError]);

  // ✅ Save / Unsave car
  const handleSaveCar = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to save cars");
      router.push("/sign-in");
      return;
    }
    if (savingCar) return;
    await toggleSavedCarFn(car.id);
  };

  // ✅ Share
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${car.year} ${car.make} ${car.model}`,
          text: `Check out this ${car.year} ${car.make} ${car.model} on Automarket!`,
          url: window.location.href,
        })
        .catch(() => copyToClipboard());
    } else copyToClipboard();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  // ✅ Book Test Drive
  const handleBookTestDrive = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to book a test drive");
      router.push("/sign-in");
      return;
    }
    router.push(`/test-drive/${car.id}`);
  };

  const handleGetBestOffer = () => {
    router.push(`/finance?carName=${encodeURIComponent(car.name)}&price=${car.price}`);
  };

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#30475E] mb-2">Car Not Found</h2>
          <p className="text-gray-500">The vehicle you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#30475E] hover:text-[#223346] transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back</span>
          </button>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Share
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveCar}
              disabled={savingCar}
              className={`flex items-center gap-2 ${isWishlisted ? "text-red-500" : ""}`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500" : ""}`} />
              {isWishlisted ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* ✅ Image Gallery */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
                {car.images && car.images.length > 0 ? (
                  <Image
                    alt="car name"
                    src={car.images[currentImageIndex]}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Status Badge */}
                <div className="absolute top-6 right-6">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                      car.status === "Available"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {car.status}
                  </span>
                </div>
              </div>

              {/* ✅ Thumbnails Section */}
              {car.images && car.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto p-4 bg-gray-50">
                  {car.images.map((img, index) => (
                    <div
                      key={index}
                      className={`relative cursor-pointer rounded-md h-20 w-28 flex-shrink-0 transition-all duration-300 ${
                        index === currentImageIndex
                          ? "ring-2 ring-[#30475E]"
                          : "opacity-75 hover:opacity-100"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <Image
                        src={img}
                        alt={`${car.name} thumbnail ${index + 1}`}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-[#30475E] mb-6">Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <Fuel className="w-8 h-8 mx-auto mb-3 text-[#30475E]" />
                <p className="text-sm text-gray-500 mb-1">Fuel</p>
                <p className="font-bold text-[#30475E]">{car.fuelType}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <Gauge className="w-8 h-8 mx-auto mb-3 text-[#30475E]" />
                <p className="text-sm text-gray-500 mb-1">Power</p>
                <p className="font-bold text-[#30475E]">{car.bhp ? `${car.bhp} BHP` : "—"}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <Calendar className="w-8 h-8 mx-auto mb-3 text-[#30475E]" />
                <p className="text-sm text-gray-500 mb-1">Year</p>
                <p className="font-bold text-[#30475E]">{car.year}</p>
              </div>
              {/* 🔄 Replaced Rating with Color */}
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <Star className="w-8 h-8 mx-auto mb-3 text-[#30475E] fill-current" />
                <p className="text-sm text-gray-500 mb-1">Color</p>
                <p className="font-bold text-[#30475E]">{car.color || "—"}</p>
              </div>
            </div>
            </div>
          </div>

          {/* Right Column (same as before) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-24">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-[#30475E] mb-2">
                   {car.make} {car.model}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Launched in {car.year || "—"}</span>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center bg-[#30475E] text-white px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    <span className="font-semibold">{car.rating || "—"}</span>
                  </div>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {car.reviews || 0} reviews
                  </span>
                </div>
              </div>

              {/* Price + Buttons */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <p className="text-sm text-gray-500 mb-1">Starting Price</p>
                <p className="text-4xl font-bold text-[#30475E]">
                  {formatCurrency(car.price)}
                </p>
              </div>

              <div className="space-y-3">
                {/* <Button
                  onClick={handleGetBestOffer}
                  className="w-full py-4 rounded-2xl bg-[#30475E] text-white font-semibold hover:bg-[#223346] transition-all hover:shadow-xl"
                >
                  Get Best Offer
                </Button> */}

                <Button
                  onClick={handleBookTestDrive}
                  variant="outline"
                  disabled={!!testDriveInfo?.userTestDrive}
                  className={`w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    testDriveInfo?.userTestDrive
                      ? "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed"
                      : "bg-[#30475E] text-white hover:bg-[#223346] hover:shadow-xl"
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  {testDriveInfo?.userTestDrive
                    ? `Booked for ${format(
                        new Date(testDriveInfo.userTestDrive.bookingDate),
                        "EEEE, MMMM d, yyyy"
                      )}`
                    : "Schedule Test Drive"}
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full py-4 rounded-2xl border-2 text-[#30475E] font-semibold hover:bg-[#30475E] hover:text-white flex items-center justify-center gap-2"
                    >
                      <Currency className="w-5 h-5" />
                      EMI Calculator
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Automarekt Car Loan Calculator</DialogTitle>
                      <EmiCalculator price={car.price} />
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={handleSaveCar}
                  variant="outline"
                  className={`w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    isWishlisted
                      ? "bg-red-50 border-2 border-red-500 text-red-600 hover:bg-red-100"
                      : "bg-gray-50 border-2 border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                  {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">
                  Price excludes taxes and registration fees
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Dealership Location</h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            {/* Dealership Name and Address */}
            <div className="flex items-start gap-3">
              <LocateFixed className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Automarket Motors</h4>
                <p className="text-gray-600">
                  {testDriveInfo.dealership?.address || "Not Available"}
                </p>
                <p className="text-gray-600 mt-1">
                  Phone: {testDriveInfo.dealership?.phone || "Not Available"}
                </p>
                <p className="text-gray-600">
                  Email: {testDriveInfo.dealership?.email || "Not Available"}
                </p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="md:w-1/2 lg:w-1/3">
              <h4 className="font-medium mb-2">Working Hours</h4>
              <div className="space-y-2">
                {testDriveInfo.dealership?.workingHours
                  ? testDriveInfo.dealership.workingHours
                      .sort((a, b) => {
                        const days = [
                          "MONDAY",
                          "TUESDAY",
                          "WEDNESDAY",
                          "THURSDAY",
                          "FRIDAY",
                          "SATURDAY",
                          "SUNDAY",
                        ];
                        return (
                          days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek)
                        );
                      })
                      .map((day) => (
                        <div
                          key={day.dayOfWeek}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">
                            {day.dayOfWeek.charAt(0) +
                              day.dayOfWeek.slice(1).toLowerCase()}
                          </span>
                          <span>
                            {day.isOpen
                              ? `${day.openTime} - ${day.closeTime}`
                              : "Closed"}
                          </span>
                        </div>
                      ))
                  : // Default hours if none provided
                    [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day, index) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="text-gray-600">{day}</span>
                        <span>
                          {index < 5
                            ? "9:00 - 18:00"
                            : index === 5
                            ? "10:00 - 16:00"
                            : "Closed"}
                        </span>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
