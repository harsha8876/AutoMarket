# DriveIQ — Complete Application Documentation

## Table of Contents

1. [Overview](#1-overview)
2. [Tech Stack](#2-tech-stack)
3. [Environment Setup](#3-environment-setup)
4. [Project Structure](#4-project-structure)
5. [Database Schema](#5-database-schema)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Route Architecture](#7-route-architecture)
8. [Server Actions (Data Layer)](#8-server-actions-data-layer)
9. [Component Architecture](#9-component-architecture)
10. [External Services](#10-external-services)
11. [AI Integration](#11-ai-integration)
12. [Key Features](#12-key-features)
13. [Data Flow Diagrams](#13-data-flow-diagrams)
14. [Admin System](#14-admin-system)
15. [Development Commands](#15-development-commands)

---

## 1. Overview

**DriveIQ** is a full-stack used-car marketplace focused on the Indian market. It allows buyers to browse car listings, save favorites, book test drives, and access financing information. Dealership staff manage inventory and bookings through a separate admin panel.

**Core capabilities:**
- Browse and filter used car listings
- AI-powered car search by photo upload
- Test drive booking with slot management
- Wishlist / saved cars
- Loan/EMI calculator
- Admin panel: inventory, test drive management, dealership settings, user role management
- AI-assisted car listing creation (extracts details from photos automatically)

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| UI Library | React 19 |
| Language | JavaScript (JSX) |
| Styling | Tailwind CSS 4 |
| Component Library | shadcn/ui (Radix UI primitives) |
| Animation | Motion (Framer Motion), OGL/WebGL (hero canvas) |
| Database | PostgreSQL via NeonDB |
| ORM | Prisma 6 |
| Auth | Clerk |
| Image Storage | Cloudinary v2 |
| AI | Google Gemini 2.5 Flash |
| Rate Limiting | ArcJet |
| Forms | React Hook Form + Zod |
| Toasts | Sonner |
| Icons | Lucide React |
| Date Utilities | date-fns |

**Brand colors:**
- Primary blue: `#30475E`
- Dark background: `#121212`
- Light background: `#F5F5F5`

---

## 3. Environment Setup

All secrets live in a `.env` file at the project root. **Never commit this file.**

```
DATABASE_URL=           # NeonDB pooled connection string (used by Prisma at runtime)
DIRECT_URL=             # NeonDB direct connection string (used by Prisma for migrations only)

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=   # Clerk public key (exposed to browser)
CLERK_SECRET_KEY=                    # Clerk secret key (server-only)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

GEMINI_API_KEY=          # Google Gemini API key
ARCJET_KEY=              # ArcJet rate-limiting key
CLOUDINARY_CLOUD_NAME=   # Cloudinary cloud name
CLOUDINARY_API_KEY=      # Cloudinary API key
CLOUDINARY_API_SECRET=   # Cloudinary API secret
```

---

## 4. Project Structure

```
my-app/
│
├── app/                          # Next.js App Router root
│   ├── layout.js                 # Root HTML shell, Clerk provider, Header, Sonner
│   ├── page.jsx                  # Public homepage
│   ├── globals.css
│   │
│   ├── (main)/                   # Authenticated user routes
│   │   ├── layout.js
│   │   ├── cars/
│   │   │   ├── page.jsx          # Car browse/filter page
│   │   │   ├── _components/      # CarFilters, CarListings, skeleton loaders
│   │   │   └── [id]/
│   │   │       ├── page.jsx      # Car detail page
│   │   │       └── _components/  # CarDetails, EMICalculator
│   │   ├── test-drive/[id]/
│   │   │   ├── page.jsx          # Test drive booking page
│   │   │   └── _components/      # TestDriveForm
│   │   ├── reservations/
│   │   │   ├── page.jsx          # User's bookings
│   │   │   └── _components/      # ReservationList
│   │   └── saved-cars/
│   │       ├── page.jsx          # User's wishlist
│   │       └── _components/      # SavedCarList
│   │
│   ├── (admin)/                  # Admin-only routes
│   │   └── admin/
│   │       ├── layout.js         # Admin shell with Sidebar
│   │       ├── page.jsx          # Dashboard (stats overview)
│   │       ├── _components/      # Dashboard, Sidebar
│   │       ├── cars/
│   │       │   ├── page.jsx      # Car inventory management
│   │       │   ├── components/   # CarList, AddCarForm
│   │       │   └── create/
│   │       │       └── page.jsx  # Add new car
│   │       ├── test-drives/
│   │       │   ├── page.jsx      # All bookings management
│   │       │   └── _components/  # TestDrivesList
│   │       └── settings/
│   │           ├── page.jsx      # Dealership settings
│   │           └── components/   # SettingsForm
│   │
│   ├── (auth)/                   # Clerk auth pages
│   │   ├── sign-in/[[...sign-in]]/page.jsx
│   │   └── sign-up/[[...sign-up]]/page.jsx
│   │
│   ├── finance/
│   │   └── page.jsx              # Financing info + loan calculator
│   └── buying-selling/
│       └── page.jsx              # Buying/selling guide
│
├── components/                   # Shared/reusable components
│   ├── Header.jsx
│   ├── AuthButtons.jsx
│   ├── Searchbar.jsx
│   ├── CarCard.jsx
│   ├── FinanceSection.jsx
│   ├── LoanCalculator.jsx
│   └── ui/                       # shadcn/ui + custom animated components
│
├── actions/                      # Next.js Server Actions (all DB access)
│   ├── home.js
│   ├── cars.js
│   ├── car-listing.js
│   ├── test-drive.js
│   ├── admin.js
│   └── settings.js
│
├── lib/                          # Shared utilities and service clients
│   ├── prisma.js                 # Prisma client singleton
│   ├── helpers.js                # formatCurrency, serializeCarData
│   ├── data.js                   # Static data (makes, body types, FAQs)
│   ├── cloudinary.js             # Cloudinary v2 client
│   ├── arcjet.js                 # ArcJet rate-limiter config
│   ├── checkUser.js              # Clerk → DB user sync
│   └── utils.js                  # cn() class utility
│
├── hooks/
│   └── use-fetch.js              # Generic async data fetching hook
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Migration history
│
├── public/
│   ├── make/                     # 10 car brand logos
│   ├── body/                     # 4 body type images
│   └── (logo, favicon, hero images)
│
├── middleware.js                 # Clerk route protection
├── next.config.mjs
└── package.json
```

---

## 5. Database Schema

The database is hosted on NeonDB (PostgreSQL). Prisma generates its client to `lib/generated/prisma`. Always import the client as:

```js
import { db } from "@/lib/prisma";
```

### Models

#### `User`
Stores application users, synced from Clerk on first login.

| Field | Type | Notes |
|---|---|---|
| `id` | String (CUID) | Primary key |
| `clerkUserId` | String | Unique, maps to Clerk user |
| `email` | String | Unique |
| `name` | String? | Optional |
| `imageUrl` | String? | Avatar from Clerk |
| `phone` | String? | Phone number |
| `role` | Enum | `USER` (default) or `ADMIN` |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

To promote a user to admin, update their `role` field directly in the database.

---

#### `Car`
Core car listing record.

| Field | Type | Notes |
|---|---|---|
| `id` | String (CUID) | Primary key |
| `make` | String | Brand (e.g. "Toyota") |
| `model` | String | Model name |
| `year` | Int | Manufacturing year |
| `price` | Decimal | Price in INR |
| `mileage` | Int | Odometer reading (km) |
| `color` | String | |
| `fuelType` | String | Petrol / Diesel / Electric / Hybrid / CNG |
| `transmission` | String | Automatic / Manual |
| `bodyType` | String | SUV / Sedan / Hatchback / Convertible |
| `seats` | Int? | Seating capacity |
| `bhp` | Decimal? | Engine power |
| `description` | String? | Free-text description |
| `images` | String[] | Array of Cloudinary URLs |
| `status` | Enum | `AVAILABLE`, `UNAVAILABLE`, or `SOLD` |
| `featured` | Boolean | Shown on homepage if true |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

Indexed on: `make`, `model`, `bodyType`, `price`, `year`, `status`, `fuelType`, `featured`.

---

#### `UserSavedCar`
Many-to-many join table for the user wishlist.

| Field | Type | Notes |
|---|---|---|
| `id` | String (CUID) | |
| `userId` | String | FK → User |
| `carId` | String | FK → Car |
| `savedAt` | DateTime | Auto |

Unique constraint on `(userId, carId)`.

---

#### `TestDriveBooking`
Represents a test drive appointment.

| Field | Type | Notes |
|---|---|---|
| `id` | String (CUID) | |
| `carId` | String | FK → Car |
| `userId` | String | FK → User |
| `bookingDate` | DateTime | Date of appointment |
| `startTime` | String | e.g. "10:00 AM" |
| `endTime` | String | e.g. "11:00 AM" |
| `status` | Enum | `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NO_SHOW` |
| `notes` | String? | Optional user notes |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

Indexed on: `carId`, `userId`, `bookingDate`, `status`.

---

#### `DealershipInfo`
Single-row table (one per dealership) for business info.

| Field | Type | Notes |
|---|---|---|
| `id` | String (CUID) | |
| `name` | String | |
| `address` | String | |
| `phone` | String | |
| `email` | String | |
| `description` | String? | |
| `createdAt` | DateTime | |
| `updatedAt` | DateTime | |

---

#### `WorkingHour`
Operating hours per day of week.

| Field | Type | Notes |
|---|---|---|
| `id` | String (CUID) | |
| `dealershipId` | String | FK → DealershipInfo |
| `dayOfWeek` | Enum | `MONDAY` … `SUNDAY` |
| `openTime` | String | e.g. "09:00" |
| `closeTime` | String | e.g. "18:00" |
| `isOpen` | Boolean | Whether dealership is open that day |

Unique constraint on `(dealershipId, dayOfWeek)`.

---

### Entity Relationships

```
User ──────────────────────────────────────────┐
 │                                              │
 ├──(1:many)──▶ UserSavedCar ◀──(many:1)──▶ Car
 │                                              │
 └──(1:many)──▶ TestDriveBooking ◀──(many:1)──┘

DealershipInfo ──(1:many)──▶ WorkingHour
```

---

## 6. Authentication & Authorization

### Clerk (Auth Provider)

Clerk handles all user authentication: sign-up, sign-in, session management, and OAuth. The integration points are:

- **`middleware.js`** — Protects specific routes before they render. Uses Clerk's `clerkMiddleware()`.
- **`app/layout.js`** — Wraps the entire app in `<ClerkProvider>`.
- **`lib/checkUser.js`** — Called on authenticated page loads to sync Clerk's user data with the local `User` table (upsert by `clerkUserId`).

### Protected Routes (Middleware)

The following routes require an active Clerk session. Unauthenticated users are redirected to `/sign-in`:

```
/admin/*
/saved-cars/*
/reservations/*
```

### Role-Based Authorization (Admin)

Middleware only enforces *authentication* (is the user logged in?). **Admin authorization** (is the user an admin?) is checked at the action level, not the route level.

Every admin server action starts with:

```js
const { userId } = await auth();
const user = await db.user.findUnique({ where: { clerkUserId: userId } });
if (!user || user.role !== "ADMIN") throw new Error("Unauthorized");
```

This means a logged-in non-admin user who visits `/admin/*` will reach the page shell but receive errors when any data is fetched.

### User Sync Flow

```
User visits any authenticated page
          │
          ▼
   checkUser() is called
          │
          ├─ Clerk session valid?
          │         No ──▶ return null
          │
          ▼
   Look up User by clerkUserId in DB
          │
          ├─ Not found ──▶ db.user.create({ clerkUserId, email, name, imageUrl })
          │
          ▼
   Return User record (role included)
```

---

## 7. Route Architecture

### Public Routes (no auth required)

| Path | Description |
|---|---|
| `/` | Homepage: hero, featured cars, brand grid, services, about, FAQ |
| `/cars` | Browse all listings with filters |
| `/cars/[id]` | Single car detail page |
| `/finance` | Financing information and EMI calculator |
| `/buying-selling` | Buying and selling guide |
| `/sign-in` | Clerk sign-in |
| `/sign-up` | Clerk sign-up |

### Authenticated User Routes

| Path | Description |
|---|---|
| `/saved-cars` | User's wishlisted cars |
| `/reservations` | User's test drive bookings |
| `/test-drive/[id]` | Book a test drive for car `id` |

### Admin Routes

| Path | Description |
|---|---|
| `/admin` | Dashboard with KPIs |
| `/admin/cars` | Car inventory table with edit/delete |
| `/admin/cars/create` | Add new car listing (with AI image prefill) |
| `/admin/test-drives` | All test drive bookings with status controls |
| `/admin/settings` | Dealership hours and user role management |

---

## 8. Server Actions (Data Layer)

DriveIQ uses **no API routes**. All data access is through Next.js Server Actions (`"use server"` functions) called directly from client and server components.

### `actions/home.js`

**`getFeaturedCars(limit?)`**
- Fetches cars where `featured = true` and `status = "AVAILABLE"`
- Includes wishlist status for the current user
- Default limit: 3

**`processImageSearch(file)`**
- Accepts a base64-encoded image
- Rate-limited via ArcJet (10 req/hour per IP)
- Sends image to Gemini API
- Returns: `{ make, bodyType, color, confidence }`
- Used by the homepage search bar to pre-fill filter values

---

### `actions/cars.js`

**`processCarImageWithAI(file)`**
- Admin-only, no rate limit
- Sends image to Gemini API
- Returns full car details: `{ make, model, year, color, price, mileage, bhp, fuelType, transmission, bodyType, description, confidence }`
- Used in the admin "Add Car" form to prefill fields

**`addCar({ carData, images })`**
- Creates a new `Car` record in the database
- Uploads each image (base64) to Cloudinary under `cars/{carId}/`
- Updates the car record with Cloudinary URLs
- Returns: `{ success, car }`

**`getCars(search?)`**
- Returns all cars, optionally filtered by a search string across `make`, `model`, `description`
- Used by the admin car list page

**`deleteCar(id)`**
- Deletes the car record
- Deletes associated images from Cloudinary using stored public IDs
- Admin-only

**`updateCarStatus(id, { status?, featured? })`**
- Updates `status` and/or `featured` flag on a car
- Admin-only

---

### `actions/car-listing.js`

**`getCarFilters()`**
- Returns distinct values for: `make`, `bodyType`, `fuelType`, `transmission`, and price `min`/`max`
- Cached for 5 minutes (Next.js `unstable_cache`)

**`getCars({ search, make, bodyType, fuelType, transmission, minPrice, maxPrice, sortBy, page, limit })`**
- Full-featured car search with all filters, sorting, and pagination
- Returns `{ cars, totalPages, currentPage }`

**`toggleSavedCar(carId)`**
- Adds the car to the user's wishlist if not saved; removes it if already saved
- Returns `{ saved: boolean }`

**`getCarById(carId)`**
- Returns a single car with:
  - Wishlist status for current user
  - Any existing test drive booking by the current user for this car
  - Dealership info including working hours

**`getSavedCars()`**
- Returns all cars in the current user's wishlist

---

### `actions/test-drive.js`

**`bookTestDrive({ carId, bookingDate, startTime, endTime, notes })`**
- Validates the slot is not already taken
- Creates a `TestDriveBooking` with status `PENDING`
- Returns `{ success, booking }`

**`getUserTestDrives()`**
- Returns the current user's bookings, including car details

**`cancelTestDrive(bookingId)`**
- Sets booking status to `CANCELLED`
- Only the booking owner or an admin may cancel

---

### `actions/admin.js`

**`getAdmin()`**
- Returns the current user if they have `role === "ADMIN"`, throws otherwise
- Called at the top of every other admin action as an auth guard

**`getAdminTestDrives({ search?, status? })`**
- Returns all test drive bookings across all users
- Supports search (customer name, car make/model) and status filter

**`updateTestDriveStatus(bookingId, newStatus)`**
- Updates booking status to any valid enum value
- Admin-only

**`getDashboardData()`**
- Returns aggregated statistics:
  - Car counts by status (`available`, `unavailable`, `sold`, `total`)
  - Test drive counts by status
  - Monthly bookings for last 6 months (chart data)
  - Conversion rate: `completed / totalCompleted+sold * 100`

---

### `actions/settings.js`

**`getDealershipInfo()`**
- Returns the `DealershipInfo` record with its `WorkingHour` entries
- If no record exists, creates a default one (dealership name "DriveIQ", 7 days, 09:00–18:00)

**`saveWorkingHours(workingHours)`**
- Upserts working hours for all 7 days
- Admin-only

**`getUsers()`**
- Returns all users with `id`, `name`, `email`, `role`, `imageUrl`
- Admin-only

**`updateUserRole(userId, role)`**
- Sets a user's `role` to `USER` or `ADMIN`
- Admin-only

---

## 9. Component Architecture

### Global Components (`components/`)

**`Header.jsx`**
- Responsive navigation bar
- Logo, nav links, auth buttons (sign in / sign up or user dropdown)
- Mobile hamburger menu

**`AuthButtons.jsx`**
- Shows `<SignInButton>` and `<SignUpButton>` for unauthenticated visitors
- Shows `<UserButton>` (Clerk) for authenticated users

**`CarCard.jsx`**
- Reusable card used on browse, saved-cars, and featured-cars sections
- Image carousel (multiple photos), car name/year/price/mileage
- Wishlist heart button (calls `toggleSavedCar`)
- Links to `/cars/[id]`

**`FinanceSection.jsx`**
- Financing info display
- Embeds `LoanCalculator`

**`LoanCalculator.jsx`**
- Interactive EMI calculator
- Inputs: car price, down payment, interest rate, tenure
- Outputs: monthly EMI, total interest, total cost

### Page-Scoped Components

#### `/cars` — Browse

| Component | Description |
|---|---|
| `car-filters.jsx` | Left-panel filter UI: make, body type, fuel type, transmission, price range slider |
| `car-listing.jsx` | Right-panel grid with pagination and sort-by dropdown |
| `car-listing-loading.jsx` | Skeleton loader for the listings grid |

#### `/cars/[id]` — Car Detail

| Component | Description |
|---|---|
| `car-details.jsx` | Full car info: image gallery, specs table, description, wishlist, test drive CTA |
| `emi-calculator.jsx` | EMI calculator scoped to that car's price |

#### `/test-drive/[id]` — Booking

| Component | Description |
|---|---|
| `test-drive-form.jsx` | Date picker, time slot selection, notes textarea, submit |

#### `/reservations` — My Bookings

| Component | Description |
|---|---|
| `reservation-list.jsx` | User's bookings with status badge and cancel button |

#### `/saved-cars` — Wishlist

| Component | Description |
|---|---|
| `saved-car-list.jsx` | Grid of `CarCard` for the user's saved cars |

#### Admin Components

| Component | Location | Description |
|---|---|---|
| `Sidebar.js` | `admin/_components/` | Left nav for admin routes |
| `dashboard.jsx` | `admin/_components/` | KPI cards and charts using dashboard data |
| `car-list.jsx` | `admin/cars/components/` | Table with status toggle, featured toggle, delete |
| `add-car-form.jsx` | `admin/cars/components/` | Multi-image upload + AI prefill + Zod-validated form |
| `test-drive-list.jsx` | `admin/test-drives/_components/` | Table with status dropdown per booking |
| `settings-form.jsx` | `admin/settings/components/` | Tabbed: working hours editor + user role manager |

### UI Primitives (`components/ui/`)

shadcn/ui components (built on Radix UI), styled with Tailwind:

- Form controls: `Button`, `Input`, `Textarea`, `Label`, `Select`, `Checkbox`, `Slider`, `Calendar`, `Switch`
- Layout/overlay: `Card`, `Dialog`, `Sheet`, `Popover`, `Tabs`, `Accordion`
- Data display: `Table`, `Badge`, `Alert`, `Pagination`

Custom animated components:

| Component | Description |
|---|---|
| `BlurText.jsx` | Animates text in word-by-word or character-by-character with blur fade |
| `DarkVeil.jsx` | WebGL canvas (OGL) animated mesh used in the hero background |
| `ScrollFloat.jsx` | Applies a floating parallax effect as the user scrolls |
| `TestDriveCard.jsx` | Styled card variant for test drive info |

---

## 10. External Services

### Clerk (Authentication)

- Handles sign-up, sign-in, session management, OAuth
- `checkUser()` in `lib/checkUser.js` syncs Clerk identity to the local `User` table on every authenticated session
- Middleware in `middleware.js` enforces route protection

### NeonDB (Database)

- PostgreSQL database, serverless
- Two connection strings: pooled (`DATABASE_URL`) for app queries, direct (`DIRECT_URL`) for Prisma migrations
- Prisma singleton in `lib/prisma.js` prevents connection exhaustion during Next.js hot reloads

### Cloudinary (Image Storage)

- Configured in `lib/cloudinary.js` using Cloudinary v2 SDK
- All car images are uploaded as base64 data URLs
- Stored under the folder path `cars/{carId}/`
- When a car is deleted, images are removed from Cloudinary using the public ID extracted from the `secure_url`

### Google Gemini 2.5 Flash (AI)

- See [Section 11](#11-ai-integration) for details

### ArcJet (Rate Limiting)

- Configured in `lib/arcjet.js`
- Applied to the homepage AI image search endpoint
- Limit: **10 requests per hour per IP address**
- Requests exceeding the limit receive a rate-limit error response

---

## 11. AI Integration

The application uses Google Gemini 2.5 Flash for two distinct AI features.

### Feature 1: Homepage Image Search

**Function:** `processImageSearch(file)` in `actions/home.js`

**Trigger:** User uploads a car photo on the homepage search bar

**What it does:**
1. Checks ArcJet rate limit (10 req/hour per IP)
2. Converts the uploaded file to base64
3. Sends to Gemini API with a prompt that extracts only the fields needed for filtering
4. Returns: `{ make, bodyType, color, confidence }`

**Output used for:** Pre-filling the car browse page filter (redirects to `/cars?make=...&bodyType=...&color=...`)

---

### Feature 2: Admin Car Listing Prefill

**Function:** `processCarImageWithAI(file)` in `actions/cars.js`

**Trigger:** Admin uploads a photo on the "Add Car" form

**What it does:**
1. Converts image to base64
2. Sends to Gemini API with a detailed extraction prompt
3. Returns a full set of car attributes

**Extracted fields:**
```
make, model, year, color, bodyType, fuelType,
transmission, bhp, price (estimated INR), description, confidence
```

**Output used for:** Pre-filling the entire "Add Car" form — admin reviews and edits before saving

**No rate limiting** applies here since only admins can trigger this.

---

## 12. Key Features

### Car Browse & Search

- Full-text search across `make`, `model`, `description`
- Filter by: make, body type, fuel type, transmission, price range
- Sort by: price (asc/desc), year (newest), mileage (lowest)
- Paginated results
- Filter options are cached for 5 minutes to reduce DB queries

### Wishlist

- Authenticated users can save/unsave cars from any car card or detail page
- Persisted in `UserSavedCar` table
- Accessible at `/saved-cars`

### Test Drive Booking

- User selects a date and time slot from the car detail page
- System validates no double-booking for the same slot
- Booking starts as `PENDING`; admin changes it to `CONFIRMED`, `COMPLETED`, etc.
- Users can cancel their own bookings; admins can cancel any booking
- Dealership working hours are shown alongside the booking form

### EMI / Loan Calculator

- Available on the car detail page and the `/finance` page
- Inputs: vehicle price, down payment, interest rate, loan tenure
- Live calculation of: monthly EMI, total interest payable, total amount payable

### Admin Dashboard

- **Car metrics:** count of available, unavailable, sold, and total cars
- **Test drive metrics:** count by each status
- **Conversion rate:** percentage of test drives that resulted in a sale (completed test drives as fraction of completed + sold)
- **Monthly trend:** bookings per month for last 6 months (chart)

### AI-Assisted Listing Creation

- Admin uploads a photo of a car
- Gemini 2.5 Flash extracts and prefills: make, model, year, color, body type, fuel type, transmission, BHP, estimated price, description
- Admin reviews the AI output, corrects if needed, adds more photos, and submits

---

## 13. Data Flow Diagrams

### Browsing Cars

```
User visits /cars
      │
      ▼
Server fetches getCarFilters() [cached 5 min]
      │
      ▼
CarFilters component renders (server component)
      │
User applies filters / types search query
      │
      ▼
getCars({ filters... }) called
      │
      ▼
Prisma query with WHERE clauses + pagination
      │
      ▼
Results → CarListings → CarCard grid
```

### Booking a Test Drive

```
User clicks "Book Test Drive" on /cars/[id]
      │
      ▼
Redirected to /test-drive/[id]
(middleware checks auth — if not logged in, redirect to sign-in)
      │
      ▼
TestDriveForm: user picks date, time, adds notes
      │
      ▼
bookTestDrive({ carId, bookingDate, startTime, endTime, notes })
      │
      ├── Validate: slot not already taken
      │
      ▼
db.testDriveBooking.create({ status: "PENDING" })
      │
      ▼
Success toast → user redirected to /reservations
```

### Admin Adding a Car

```
Admin visits /admin/cars/create
      │
      ▼
Uploads car image
      │
      ▼
processCarImageWithAI(file) → Gemini API
      │
      ▼
Fields prefilled in AddCarForm
      │
Admin reviews, edits, adds more images, submits
      │
      ▼
addCar({ carData, images })
      │
      ├── db.car.create(carData)
      ├── Upload each image to Cloudinary (cars/{id}/)
      └── db.car.update({ images: cloudinaryUrls })
      │
      ▼
Car appears on /cars with status AVAILABLE
```

---

## 14. Admin System

### Access

Admin access requires:
1. User must be authenticated (Clerk)
2. User's `role` field in the database must be `"ADMIN"`

To grant admin access, update the user's `role` directly in the database (via Prisma Studio or a direct SQL query):

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

Or via Prisma Studio:
```bash
npx prisma studio
```

Alternatively, once one admin exists, they can promote other users via the Settings page in the admin panel.

### Admin Settings Page

The Settings page (`/admin/settings`) has two tabs:

**Working Hours tab:**
- Toggle each day's `isOpen` flag
- Set `openTime` and `closeTime` per day
- Saved via `saveWorkingHours()`

**User Management tab:**
- Lists all users with their current role
- Admin can toggle any user's role between `USER` and `ADMIN`
- Powered by `getUsers()` and `updateUserRole()`

---

## 15. Development Commands

### Application

```bash
npm run dev       # Start dev server with Turbopack on http://localhost:3000
npm run build     # Build for production
npm run start     # Serve production build
npm run lint      # Run ESLint
```

### Database (Prisma)

```bash
npx prisma generate           # Regenerate Prisma client after schema changes
                              # (output goes to lib/generated/prisma)

npx prisma migrate dev        # Create and apply a new migration
                              # (uses DIRECT_URL, not DATABASE_URL)

npx prisma db push            # Push schema changes without creating a migration
                              # Useful for rapid prototyping

npx prisma studio             # Open Prisma Studio GUI at http://localhost:5555
```

### Important Notes

- After **any** change to `prisma/schema.prisma`, run `npx prisma generate` to keep the client in sync.
- The Prisma client is output to a **custom path** (`lib/generated/prisma`), not the default `node_modules`. This is configured via `output` in `schema.prisma`.
- Import the client as `import { db } from "@/lib/prisma"` — never import from the generated path directly.
- When passing Prisma `Car` records to client components, always call `serializeCarData()` from `lib/helpers.js` — Prisma returns `Decimal` types (for `price`, `bhp`) that are not JSON-serializable.

---

*Documentation generated for DriveIQ — Last updated June 2026*
