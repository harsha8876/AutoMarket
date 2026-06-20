"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { TestDriveCard } from "@/components/ui/test-drive-card";
import useFetch from "@/hooks/use-fetch";
import { cancelTestDrive } from "@/actions/test-drive";

export function ReservationsList({ initialData }) {
  const {
    loading: cancelling,
    fn: cancelBookingFn,
    error: cancelError,
  } = useFetch(cancelTestDrive);

  // Handle cancellation
  const handleCancelBooking = async (bookingId) => {
    await cancelBookingFn(bookingId);
  };

  // Group bookings by status
  const upcomingBookings = initialData?.data?.filter((booking) =>
    ["PENDING", "CONFIRMED"].includes(booking.status)
  );

  const pastBookings = initialData?.data?.filter((booking) =>
    ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(booking.status)
  );

  // No reservations
  if (initialData?.data?.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rounded-2xl bg-surface-muted shadow-sm">
        <div className="bg-primary-soft p-4 rounded-full mb-4">
          <Calendar className="h-8 w-8 text-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No Reservations Found
        </h3>
        <p className="text-gray-600 mb-6 max-w-md">
          You don’t have any test drive reservations yet. Browse our cars and
          book a test drive to get started.
        </p>
        <Button
          asChild
          className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-all cursor-pointer"
        >
          <Link href="/cars">Browse Cars</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Upcoming Bookings */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-foreground border-b border-border pb-2">
          Upcoming Test Drives
        </h2>
        {upcomingBookings.length === 0 ? (
          <p className="text-gray-500 italic">No upcoming test drives.</p>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <TestDriveCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelBooking}
                isCancelling={cancelling}
                showActions
                cancelError={cancelError}
                viewMode="list"
              />
            ))}
          </div>
        )}
      </div>

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-foreground border-b border-border pb-2">
            Past Test Drives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastBookings.map((booking) => (
              <TestDriveCard
                key={booking.id}
                booking={booking}
                showActions={false}
                isPast
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
