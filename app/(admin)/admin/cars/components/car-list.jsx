"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Eye,
  Loader2,
  Car as CarIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useFetch from "@/hooks/use-fetch";
import { getCars, deleteCar, updateCarStatus } from "@/actions/cars";
import { formatCurrency } from "@/lib/helpers";
import Image from "next/image";

const Car_list = () => {
  const router = useRouter();

  // 🔹 State
  const [search, setSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  // 🔹 API hooks
  const {
    loading: loadingCars,
    fn: fetchCars,
    data: carsData,
    error: carsError,
  } = useFetch(getCars);

  const {
    loading: deletingCar,
    fn: deleteCarFn,
    data: deleteResult,
    error: deleteError,
  } = useFetch(deleteCar);

  const {
    loading: updatingCar,
    fn: updateCarStatusFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateCarStatus);

  // 🔹 Effects
  useEffect(() => {
    fetchCars(search);
  }, [search]);

  useEffect(() => {
    if (carsError) toast.error("Failed to load cars");
    if (deleteError) toast.error("Failed to delete car");
    if (updateError) toast.error("Failed to update car");
  }, [carsError, deleteError, updateError]);

  useEffect(() => {
    if (deleteResult?.success) {
      toast.success("Car deleted successfully");
      fetchCars(search);
    }
    if (updateResult?.success) {
      toast.success("Car updated successfully");
      fetchCars(search);
    }
  }, [deleteResult, updateResult, search]);

  // 🔹 Handlers
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCars(search);
  };

  const handleDeleteCar = async () => {
    if (!carToDelete) return;
    await deleteCarFn(carToDelete.id);
    setDeleteDialogOpen(false);
    setCarToDelete(null);
  };

  const handleStatusUpdate = async (car, newStatus) => {
    await updateCarStatusFn(car.id, { status: newStatus });
  };

  // 🔹 Status badge UI helper
  const getStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Available
          </Badge>
        );
      case "UNAVAILABLE":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Unavailable
          </Badge>
        );
      case "SOLD":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Sold
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // 🔹 UI
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          Car Inventory Management
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Button
            className="bg-primary hover:bg-primary-hover cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto justify-center"
            onClick={() => router.push("/admin/cars/create")}
          >
            <Plus className="h-4 w-4" />
            Add Car
          </Button>

          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full sm:w-64"
          >
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search cars..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>
      </div>

      {/* Loading Spinner */}
      {loadingCars && !carsData ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : carsData?.success && carsData.data.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Car
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Year
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {carsData.data.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <div className="w-16 h-10 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                        {car.images && car.images.length > 0 ? (
                          <Image
                            src={car.images[0]}
                            alt={`${car.make} ${car.model}`}
                            width={64}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <CarIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {car.make} {car.model}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {getStatusBadge(car.status)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {formatCurrency(car.price)}
                    </td>
                    <td className="px-6 py-4 text-sm">{car.year}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      {/* Dropdown Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => router.push(`/cars/${car.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Status</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(car, "AVAILABLE")
                            }
                            disabled={
                              car.status === "AVAILABLE" || updatingCar
                            }
                          >
                            Set Available
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(car, "UNAVAILABLE")
                            }
                            disabled={
                              car.status === "UNAVAILABLE" || updatingCar
                            }
                          >
                            Set Unavailable
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(car, "SOLD")
                            }
                            disabled={car.status === "SOLD" || updatingCar}
                          >
                            Mark as Sold
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setCarToDelete(car);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          {/* Mobile Cards */}
<div className="grid gap-4 md:hidden">
  {carsData.data.map((car) => (
    <div
      key={car.id}
      className="p-4 border rounded-lg shadow-sm flex flex-col gap-2"
    >
      <div className="flex items-center gap-3">
        <div className="w-20 h-14 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
          {car.images && car.images.length > 0 ? (
            <Image
              src={car.images[0]}
              alt={`${car.make} ${car.model}`}
              width={80}
              height={56}
              className="object-cover w-full h-full"
            />
          ) : (
            <CarIcon className="h-6 w-6 text-gray-400" />
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">
            {car.make} {car.model}
          </h3>
          <p className="text-sm text-gray-500">
            {car.year} • {formatCurrency(car.price)}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        {getStatusBadge(car.status)}

        {/* Mobile Dropdown Menu for actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <MoreHorizontal className="h-4 w-4" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => router.push(`/cars/${car.id}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(car, "AVAILABLE")}
              disabled={car.status === "AVAILABLE" || updatingCar}
            >
              Set Available
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(car, "UNAVAILABLE")}
              disabled={car.status === "UNAVAILABLE" || updatingCar}
            >
              Set Unavailable
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(car, "SOLD")}
              disabled={car.status === "SOLD" || updatingCar}
            >
              Mark as Sold
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                setCarToDelete(car);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  ))}
</div>

        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CarIcon className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No cars found
          </h3>
          <p className="text-gray-500 mb-4">
            {search
              ? "No cars match your search criteria"
              : "Your inventory is empty. Add cars to get started."}
          </p>
          <Button onClick={() => router.push("/admin/cars/create")}>
            Add Your First Car
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {carToDelete?.make}{" "}
              {carToDelete?.model}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deletingCar}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCar}
              disabled={deletingCar}
            >
              {deletingCar ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Car"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Car_list;
