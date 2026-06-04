import { CarFilters } from "./_components/car-filters";
import { getCarFilters } from "@/actions/car-listing";
import { CarListings } from "./_components/car-listing";

export const metadata = {
  title: "Cars | DriveIQ",
  description: "Browse and search for your dream car",
};

async function CarsPage() {
  const filtersData = await getCarFilters();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-7">
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 capitalize">
          Browse Cars
        </h1>
        <p className="mt-2 text-gray-600">
          Explore our complete collection of cars available in the DriveIQ marketplace.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow p-6">
            <CarFilters filters={filtersData.data} />
          </div>
        </div>

        {/* Car Listings Section */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow p-6">
            <CarListings />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarsPage;
