// prisma/seed-cars-cloudinary.js
//
// Bulk-seed DriveIQ cars with REAL images, matching the app's actual setup:
//   - Prisma client imported as { db } from "@/lib/prisma"
//   - Images stored on Cloudinary under cars/{carId}/  (same as addCar())
//
// Pipeline per car:
//   Unsplash keyword search -> create Car row (to get its id)
//   -> upload photo to Cloudinary cars/{id}/ -> update row with secure_url
//
// Run:  node prisma/seed-cars-cloudinary.js
//
// Required env vars (already in your .env):
//   DATABASE_URL, DIRECT_URL
//   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
// Plus one new one:
//   UNSPLASH_ACCESS_KEY   (free: https://unsplash.com/developers)
//
// NOTE: Unsplash returns a relevant *generic* photo by keyword, not the exact
// trim. That's expected for seed data. Swap fetchImage() for your own asset
// source if you need photos that exactly match each listing.

import { PrismaClient } from "../lib/generated/prisma/index.js";
const db = new PrismaClient();
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

// ---- The car catalogue (India-focused, 30 records) -------------------------
const cars = [
  { make: "Maruti Suzuki", model: "Swift",        year: 2021, color: "Red",    fuelType: "Petrol", transmission: "Manual",    bodyType: "Hatchback", mileage: 22000, bhp: 89,  seats: 5, price: "650000.00",  featured: false },
  { make: "Maruti Suzuki", model: "Baleno",       year: 2022, color: "Blue",   fuelType: "Petrol", transmission: "Manual",    bodyType: "Hatchback", mileage: 15000, bhp: 89,  seats: 5, price: "720000.00",  featured: false },
  { make: "Maruti Suzuki", model: "Brezza",       year: 2023, color: "White",  fuelType: "Petrol", transmission: "Automatic", bodyType: "SUV",       mileage: 9000,  bhp: 102, seats: 5, price: "1050000.00", featured: true  },
  { make: "Hyundai",       model: "Creta",        year: 2022, color: "White",  fuelType: "Diesel", transmission: "Automatic", bodyType: "SUV",       mileage: 18000, bhp: 113, seats: 5, price: "1450000.00", featured: true  },
  { make: "Hyundai",       model: "i20",          year: 2021, color: "Grey",   fuelType: "Petrol", transmission: "Manual",    bodyType: "Hatchback", mileage: 24000, bhp: 83,  seats: 5, price: "780000.00",  featured: false },
  { make: "Hyundai",       model: "Venue",        year: 2022, color: "Silver", fuelType: "Petrol", transmission: "Automatic", bodyType: "SUV",       mileage: 16000, bhp: 118, seats: 5, price: "1020000.00", featured: false },
  { make: "Hyundai",       model: "Verna",        year: 2023, color: "Black",  fuelType: "Petrol", transmission: "Automatic", bodyType: "Sedan",     mileage: 7000,  bhp: 113, seats: 5, price: "1320000.00", featured: false },
  { make: "Tata",          model: "Nexon",        year: 2022, color: "Blue",   fuelType: "Petrol", transmission: "Manual",    bodyType: "SUV",       mileage: 19000, bhp: 118, seats: 5, price: "1010000.00", featured: true  },
  { make: "Tata",          model: "Punch",        year: 2023, color: "Orange", fuelType: "Petrol", transmission: "Manual",    bodyType: "SUV",       mileage: 8000,  bhp: 86,  seats: 5, price: "760000.00",  featured: false },
  { make: "Tata",          model: "Harrier",      year: 2022, color: "White",  fuelType: "Diesel", transmission: "Automatic", bodyType: "SUV",       mileage: 21000, bhp: 168, seats: 5, price: "1850000.00", featured: false },
  { make: "Tata",          model: "Tiago",        year: 2021, color: "Red",    fuelType: "Petrol", transmission: "Manual",    bodyType: "Hatchback", mileage: 26000, bhp: 85,  seats: 5, price: "560000.00",  featured: false },
  { make: "Mahindra",      model: "XUV700",       year: 2023, color: "Black",  fuelType: "Diesel", transmission: "Automatic", bodyType: "SUV",       mileage: 12000, bhp: 182, seats: 7, price: "2150000.00", featured: true  },
  { make: "Mahindra",      model: "Thar",         year: 2022, color: "Red",    fuelType: "Diesel", transmission: "Manual",    bodyType: "SUV",       mileage: 14000, bhp: 130, seats: 4, price: "1480000.00", featured: true  },
  { make: "Mahindra",      model: "Scorpio-N",    year: 2023, color: "Grey",   fuelType: "Diesel", transmission: "Automatic", bodyType: "SUV",       mileage: 10000, bhp: 172, seats: 7, price: "1980000.00", featured: false },
  { make: "Kia",           model: "Seltos",       year: 2022, color: "White",  fuelType: "Petrol", transmission: "Automatic", bodyType: "SUV",       mileage: 17000, bhp: 138, seats: 5, price: "1390000.00", featured: false },
  { make: "Kia",           model: "Sonet",        year: 2021, color: "Blue",   fuelType: "Diesel", transmission: "Manual",    bodyType: "SUV",       mileage: 23000, bhp: 113, seats: 5, price: "980000.00",  featured: false },
  { make: "Kia",           model: "Carens",       year: 2023, color: "Silver", fuelType: "Petrol", transmission: "Automatic", bodyType: "MUV",       mileage: 9000,  bhp: 113, seats: 7, price: "1560000.00", featured: false },
  { make: "Toyota",        model: "Innova Crysta",year: 2021, color: "Grey",   fuelType: "Diesel", transmission: "Manual",    bodyType: "MUV",       mileage: 32000, bhp: 148, seats: 7, price: "1850000.00", featured: false },
  { make: "Toyota",        model: "Fortuner",     year: 2022, color: "White",  fuelType: "Diesel", transmission: "Automatic", bodyType: "SUV",       mileage: 20000, bhp: 201, seats: 7, price: "3850000.00", featured: true  },
  { make: "Toyota",        model: "Glanza",       year: 2022, color: "Red",    fuelType: "Petrol", transmission: "Manual",    bodyType: "Hatchback", mileage: 15000, bhp: 89,  seats: 5, price: "730000.00",  featured: false },
  { make: "Honda",         model: "City",         year: 2022, color: "Silver", fuelType: "Petrol", transmission: "Automatic", bodyType: "Sedan",     mileage: 18000, bhp: 119, seats: 5, price: "1280000.00", featured: false },
  { make: "Honda",         model: "Amaze",        year: 2021, color: "White",  fuelType: "Petrol", transmission: "Manual",    bodyType: "Sedan",     mileage: 25000, bhp: 89,  seats: 5, price: "720000.00",  featured: false },
  { make: "Honda",         model: "Elevate",      year: 2023, color: "Blue",   fuelType: "Petrol", transmission: "Automatic", bodyType: "SUV",       mileage: 6000,  bhp: 119, seats: 5, price: "1420000.00", featured: false },
  { make: "Volkswagen",    model: "Virtus",       year: 2022, color: "Grey",   fuelType: "Petrol", transmission: "Automatic", bodyType: "Sedan",     mileage: 14000, bhp: 113, seats: 5, price: "1350000.00", featured: false },
  { make: "Volkswagen",    model: "Taigun",       year: 2023, color: "Orange", fuelType: "Petrol", transmission: "Manual",    bodyType: "SUV",       mileage: 11000, bhp: 113, seats: 5, price: "1290000.00", featured: false },
  { make: "Skoda",         model: "Slavia",       year: 2022, color: "Red",    fuelType: "Petrol", transmission: "Automatic", bodyType: "Sedan",     mileage: 13000, bhp: 113, seats: 5, price: "1330000.00", featured: false },
  { make: "Skoda",         model: "Kushaq",       year: 2022, color: "White",  fuelType: "Petrol", transmission: "Manual",    bodyType: "SUV",       mileage: 16000, bhp: 113, seats: 5, price: "1310000.00", featured: false },
  { make: "Renault",       model: "Kiger",        year: 2021, color: "Blue",   fuelType: "Petrol", transmission: "Manual",    bodyType: "SUV",       mileage: 22000, bhp: 99,  seats: 5, price: "720000.00",  featured: false },
  { make: "Nissan",        model: "Magnite",      year: 2022, color: "Grey",   fuelType: "Petrol", transmission: "Automatic", bodyType: "SUV",       mileage: 15000, bhp: 99,  seats: 5, price: "780000.00",  featured: false },
  { make: "MG",            model: "Hector",       year: 2022, color: "Black",  fuelType: "Diesel", transmission: "Manual",    bodyType: "SUV",       mileage: 19000, bhp: 168, seats: 5, price: "1620000.00", featured: false },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Search Unsplash for a relevant photo URL.
async function findImageUrl(car) {
  const q = encodeURIComponent(`${car.color} ${car.make} ${car.model} car`);
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${q}&per_page=1&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
  );
  if (!res.ok) throw new Error(`Unsplash ${res.status}`);
  const json = await res.json();
  let url = json.results?.[0]?.urls?.regular;
  if (!url) {
    const fb = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(car.bodyType + " car")}&per_page=1`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    );
    url = (await fb.json()).results?.[0]?.urls?.regular ?? null;
  }
  return url;
}

// Upload a remote image URL to Cloudinary under cars/{carId}/.
async function uploadToCloudinary(imageUrl, carId) {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder: `cars/${carId}`,
  });
  return result.secure_url;
}

async function seedOne(carData) {
  // 1. create the row first so we have an id for the Cloudinary folder
  const { price, bhp, ...rest } = carData;
  const car = await db.car.create({
    data: {
      ...rest,
      price,                 // Prisma coerces the string into Decimal
      bhp,                   // Decimal? — number is fine
      description: `Well-maintained ${carData.year} ${carData.make} ${carData.model} in ${carData.color}.`,
      status: "AVAILABLE",
      images: [],
    },
  });

  // 2. fetch + upload image, 3. update row
  try {
    const found = await findImageUrl(carData);
    if (found) {
      const secureUrl = await uploadToCloudinary(found, car.id);
      await db.car.update({ where: { id: car.id }, data: { images: [secureUrl] } });
      console.log(`✓ ${carData.make} ${carData.model} -> ${secureUrl}`);
    } else {
      console.warn(`! ${carData.make} ${carData.model}: no image found`);
    }
  } catch (e) {
    console.error(`✗ ${carData.make} ${carData.model}: ${e.message}`);
  }
}

async function main() {
  if (!UNSPLASH_KEY) throw new Error("Set UNSPLASH_ACCESS_KEY");
  for (const car of cars) {
    await seedOne(car);
    await sleep(1200); // stay under Unsplash demo limit (50 req/hr)
  }
  const total = await db.car.count();
  console.log(`\nDone. Car table now has ${total} rows.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });