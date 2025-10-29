"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Camera, ImagePlus, Loader2, X, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { addCar, processCarImageWithAI } from "@/actions/cars";
import useFetch from "@/hooks/use-fetch";
import Image from "next/image";

// Predefined options
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
const transmissions = ["Automatic", "Manual", "Semi-Automatic"];
const bodyTypes = [
  "SUV",
  "Sedan",
  "Hatchback",
  "Convertible",
  "Coupe",
  "Wagon",
  "Pickup",
];
const carStatuses = ["AVAILABLE", "UNAVAILABLE", "SOLD"];

// ✅ Added bhp as optional
const carFormSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().refine((val) => {
    const year = parseInt(val);
    return !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 1;
  }, "Valid year required"),
  price: z.string().min(1, "Price is required"),
  mileage: z.string().min(1, "Mileage is required"),
  bhp: z.string().optional(), // ✅ added
  color: z.string().min(1, "Color is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  bodyType: z.string().min(1, "Body type is required"),
  seats: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["AVAILABLE", "UNAVAILABLE", "SOLD"]),
  featured: z.boolean().default(false),
  // Images handled separately
});

export const AddCarForm = () => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedAiImage, setUploadedAiImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("ai");
  const [imageError, setImageError] = useState("");

  // Form setup
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      bhp: "", // ✅ added
      color: "",
      fuelType: "",
      transmission: "",
      bodyType: "",
      seats: "",
      description: "",
      status: "AVAILABLE",
      featured: false,
    },
  });

  const {
    loading: addCarLoading,
    fn: addCarFn,
    data: addCarResult,
  } = useFetch(addCar);

  const {
    loading: processImageLoading,
    fn: processImageFn,
    data: processImageResult,
    error: processImageError,
  } = useFetch(processCarImageWithAI);

  // ✅ Success
  useEffect(() => {
    if (addCarResult?.success) {
      toast.success("Car added successfully");
      router.push("/admin/cars");
    }
  }, [addCarResult, router]);

  // ✅ AI error
  useEffect(() => {
    if (processImageError) {
      toast.error(processImageError.message || "Failed to process image");
    }
  }, [processImageError]);

  // ✅ AI autofill including bhp
  useEffect(() => {
    if (processImageResult?.success) {
      const carDetails = processImageResult.data;
      setValue("make", carDetails.make);
      setValue("model", carDetails.model);
      setValue("year", carDetails.year.toString());
      setValue("color", carDetails.color);
      setValue("bodyType", carDetails.bodyType);
      setValue("fuelType", carDetails.fuelType);
      setValue("price", carDetails.price);
      setValue("mileage", carDetails.mileage);
      setValue("transmission", carDetails.transmission);
      setValue("description", carDetails.description);
      if (carDetails.bhp) setValue("bhp", carDetails.bhp.toString()); // ✅ added

      const reader = new FileReader();
      reader.onload = (e) => setUploadedImages((prev) => [...prev, e.target.result]);
      reader.readAsDataURL(uploadedAiImage);

      toast.success("Successfully extracted car details", {
        description: `Detected ${carDetails.year} ${carDetails.make} ${carDetails.model}`,
      });

      setActiveTab("manual");
    }
  }, [processImageResult, setValue, uploadedAiImage]);

  // ✅ AI image upload
  const onAiDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    setUploadedAiImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps: getAiRootProps, getInputProps: getAiInputProps } = useDropzone({
    onDrop: onAiDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    multiple: false,
  });

  const processWithAI = async () => {
    if (!uploadedAiImage) return toast.error("Please upload an image first");
    await processImageFn(uploadedAiImage);
  };

  // ✅ Multiple images upload
  const onMultiImagesDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });
    if (validFiles.length === 0) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        const newImages = [];
        validFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            newImages.push(e.target.result);
            if (newImages.length === validFiles.length) {
              setUploadedImages((prev) => [...prev, ...newImages]);
              setUploadProgress(0);
              setImageError("");
              toast.success(`Uploaded ${validFiles.length} images`);
            }
          };
          reader.readAsDataURL(file);
        });
      }
    }, 200);
  }, []);

  const { getRootProps: getMultiImageRootProps, getInputProps: getMultiImageInputProps } = useDropzone({
    onDrop: onMultiImagesDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: true,
  });

  const removeImage = (index) => setUploadedImages((prev) => prev.filter((_, i) => i !== index));

  // ✅ Submit handler includes bhp
  const onSubmit = async (data) => {
    if (uploadedImages.length === 0) {
      setImageError("Please upload at least one image");
      return;
    }

    const carData = {
      ...data,
      year: parseInt(data.year),
      price: parseFloat(data.price),
      mileage: parseInt(data.mileage),
      bhp: data.bhp ? parseInt(data.bhp) : null, // ✅ added safe parse
      seats: data.seats ? parseInt(data.seats) : null,
    };

    await addCarFn({ carData, images: uploadedImages });
  };

  return (
    <div>
      <Tabs defaultValue="ai" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="ai">AI Upload</TabsTrigger>
        </TabsList>

        {/* ✅ Manual Entry */}
        <TabsContent value="manual" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Car Details</CardTitle>
              <CardDescription>Enter or verify the car details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Make */}
                  <div className="space-y-2">
                    <Label htmlFor="make">Make</Label>
                    <Input id="make" {...register("make")} placeholder="e.g. Toyota" />
                  </div>

                  {/* Model */}
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" {...register("model")} placeholder="e.g. Camry" />
                  </div>

                  {/* Year */}
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" {...register("year")} placeholder="e.g. 2022" />
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input id="price" {...register("price")} placeholder="e.g. 1250000" />
                  </div>

                  {/* Mileage */}
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage (km)</Label>
                    <Input id="mileage" {...register("mileage")} placeholder="e.g. 25000" />
                  </div>

                  {/* ✅ BHP */}
                  <div className="space-y-2">
                    <Label htmlFor="bhp">BHP (Optional)</Label>
                    <Input id="bhp" {...register("bhp")} placeholder="e.g. 150" />
                  </div>

                  {/* Color */}
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" {...register("color")} placeholder="e.g. Silver" />
                  </div>

                  {/* Fuel Type */}
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select onValueChange={(v) => setValue("fuelType", v)} defaultValue={getValues("fuelType")}>
                      <SelectTrigger><SelectValue placeholder="Select fuel type" /></SelectTrigger>
                      <SelectContent>
                        {fuelTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Transmission */}
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select onValueChange={(v) => setValue("transmission", v)} defaultValue={getValues("transmission")}>
                      <SelectTrigger><SelectValue placeholder="Select transmission" /></SelectTrigger>
                      <SelectContent>
                        {transmissions.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Body Type */}
                  <div className="space-y-2">
                    <Label htmlFor="bodyType">Body Type</Label>
                    <Select onValueChange={(v) => setValue("bodyType", v)} defaultValue={getValues("bodyType")}>
                      <SelectTrigger><SelectValue placeholder="Select body type" /></SelectTrigger>
                      <SelectContent>
                        {bodyTypes.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Seats */}
                  <div className="space-y-2">
                    <Label htmlFor="seats">Seats (Optional)</Label>
                    <Input id="seats" {...register("seats")} placeholder="e.g. 5" />
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select onValueChange={(v) => setValue("status", v)} defaultValue={getValues("status")}>
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        {carStatuses.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" {...register("description")} placeholder="Enter car details..." />
                </div>

                {/* Featured */}
                <div className="flex items-start space-x-3 border p-4 rounded-md">
                  <Checkbox id="featured" checked={watch("featured")} onCheckedChange={(c) => setValue("featured", c)} />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="featured">Feature this car</Label>
                    <p className="text-sm text-gray-500">Featured cars appear on homepage</p>
                  </div>
                </div>

                {/* Image upload */}
                <div>
                  <Label htmlFor="images" className={imageError ? "text-red-500" : ""}>
                    Images {imageError && <span className="text-red-500">*</span>}
                  </Label>
                  <div className="mt-2">
                    <div {...getMultiImageRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 ${imageError ? "border-red-500" : "border-gray-300"}`}>
                      <input {...getMultiImageInputProps()} />
                      <div className="flex flex-col items-center">
                        <Upload className="h-12 w-12 text-gray-400 mb-3" />
                        <span className="text-sm text-gray-600">Drag & drop or click to upload multiple images</span>
                      </div>
                    </div>
                  </div>

                  {/* Previews */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image src={image} alt={`Car image ${index + 1}`} height={50} width={50} className="h-28 w-full object-cover rounded-md" />
                          <Button size="icon" variant="destructive" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeImage(index)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full md:w-auto" disabled={addCarLoading}>
                  {addCarLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding Car...</>) : "Add Car"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ✅ AI Upload Tab unchanged */}
        <TabsContent value="ai" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Car Details Extraction</CardTitle>
              <CardDescription>Upload an image of a car and let Gemini AI extract its details.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="flex flex-col items-center">
                      <img src={imagePreview} alt="Car preview" className="max-h-56 max-w-full object-contain mb-4" />
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setImagePreview(null); setUploadedAiImage(null); }}>
                          Remove
                        </Button>
                        <Button onClick={processWithAI} disabled={processImageLoading} size="sm">
                          {processImageLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>) : (<><Camera className="mr-2 h-4 w-4" />Extract Details</>)}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div {...getAiRootProps()} className="cursor-pointer hover:bg-gray-50 transition">
                      <input {...getAiInputProps()} />
                      <div className="flex flex-col items-center">
                        <Camera className="h-12 w-12 text-gray-400 mb-3" />
                        <span className="text-sm text-gray-600">Drag & drop or click to upload a car image</span>
                      </div>
                    </div>
                  )}
                </div>

                {processImageLoading && (
                  <div className="bg-blue-50 text-blue-700 p-4 rounded-md flex items-center">
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    <div>
                      <p className="font-medium">Analyzing image...</p>
                      <p className="text-sm">Gemini AI is extracting car details</p>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">How it works</h3>
                  <ol className="space-y-2 text-sm text-gray-600 list-decimal pl-4">
                    <li>Upload a clear image of the car</li>
                    <li>Click "Extract Details" to analyze with Gemini AI</li>
                    <li>Review the extracted information</li>
                    <li>Fill in any missing details manually</li>
                    <li>Add the car to your inventory</li>
                  </ol>
                </div>

                <div className="bg-amber-50 p-4 rounded-md">
                  <h3 className="font-medium text-amber-800 mb-1">Tips for best results</h3>
                  <ul className="space-y-1 text-sm text-amber-700">
                    <li>• Use clear, well-lit images</li>
                    <li>• Capture the full vehicle</li>
                    <li>• For tough models, upload multiple views</li>
                    <li>• Always verify AI-extracted info</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
