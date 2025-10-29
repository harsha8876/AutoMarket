"use client";

import Image from "next/image";
import { toast } from "sonner";

import React, { useState, useEffect } from "react";
import {
  Search,
  Car,
  Shield,
  Clock,
  Star,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Award,
  Users,
  TrendingUp,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import BlurText from "@/components/ui/BlurText";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import DarkVeil from "@/components/ui/DarkVeil";
import Link from "next/link";
import { bodyTypes, carMakes, faqItems } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getFeaturedCars } from "@/actions/home";
import Searchbar from "@/components/Searchbar";
import { CarCard } from "@/components/car-card"; // ✅ Import CarCard

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState([]); // ✅ Declare featuredCars
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // ✅ Fetch featured cars client-side
  useEffect(() => {
    async function fetchCars() {
      try {
        const cars = await getFeaturedCars();
        setFeaturedCars(cars);
      } catch (error) {
        console.error("Error fetching featured cars:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCars();
  }, []);

  const [visibleBrands, setVisibleBrands] = useState(5);
  const [brandsPerClick, setBrandsPerClick] = useState(5);

  useEffect(() => {
    const updateBrandsPerClick = () => {
      if (window.innerWidth < 640) {
        setBrandsPerClick(2);
      } else if (window.innerWidth < 1024) {
        setBrandsPerClick(3);
      } else {
        setBrandsPerClick(5);
      }
    };
    updateBrandsPerClick();
    window.addEventListener("resize", updateBrandsPerClick);
    return () => window.removeEventListener("resize", updateBrandsPerClick);
  }, []);

  // ✅ Services array
  const services = [
    {
      title: "Buying/Selling Cars",
      description: "Get expert advice on buying your next car.",
      features: ["Expert Guidance", "Best Deals", "Wide Selection"],
    },
    {
      title: "Book a Test Drive",
      description: "Experience your dream car before you buy.",
      features: ["Easy Booking", "Flexible Timing", "Wide Range"],
    },
    {
      title: "Car Financing",
      description: "Flexible financing options for your dream car.",
      features: ["Low Interest Rates", "Easy Approval", "Custom Plans"],
    },
  ];
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
  if (email.trim() === "") {
    toast.error("Please enter your email address.");
    return;
  }

  toast.success("We’ll contact you soon!");
  setEmail(""); // clear the input field
};
  return (
    <div className="relative min-h-screen bg-[#F5F5F5]">
      
      {/* <div className="z-35 w-full inset-0">
          <Header/>
      </div> */}
      
      {/* Hero Section with Dark Veil */}
      <section className="relative bg-gradient-to-b from-[#30475E] via-[#2a3f5a] to-[#243652] text-white py-16 sm:py-20 lg:py-24 overflow-hidden">
        {/* Dark Veil Background */}
        <div className="absolute inset-0 z-0">
          <DarkVeil
            hueShift={30}
            noiseIntensity={0.1}
            scanlineIntensity={0.2}
            speed={0.5}
            scanlineFrequency={1.5}
            warpAmount={0.05}
          />
        </div>

        {/* Gradient overlay for seamless blending */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#30475E]/50 to-[#30475E]/80 z-1"></div>

        <div className="flex flex-col items-center justify-center relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full text-center">
          <div className="mb-8 sm:mb-12">
            <BlurText
              text="Find your perfect car"
              className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
              animateBy="words"
              direction="top"
              stepDuration={0.5}
            />
            <p className="text-base sm:text-lg lg:text-xl text-[#F5F5F5] max-w-2xl mx-auto px-4">
              Discover the best deals on cars that suit your needs and budget.
            </p>
          </div>
        </div>

        <div className="flex justify-center relative z-20 w-full">
          <div className="w-full max-w-2xl">
            <Searchbar />
          </div>
        </div> 
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#30475E]/50 to-[#30475E]/80 z-10"></div>

      </section>

       {/* ✅ Featured Cars Section Fixed */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Cars</h2>
            <Button variant="ghost" className="flex items-center" asChild>
               <Link href="/cars">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <p className="text-gray-500 text-center">Loading cars...</p>
          ) : featuredCars.length === 0 ? (
            <p className="text-gray-500 text-center">No featured cars found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Browse by Brand */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Browse by Brand</h2>
          </div>

          {/* Brand Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {carMakes.slice(0, visibleBrands).map((make) => (
              <Link
                key={make.name}
                 href={`/cars?make=${make.name}`}
                className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition cursor-pointer"
              >
                <div className="h-16 w-auto mx-auto mb-2 relative">
                  <Image
                    src={make.imageUrl || `/make/${make.name.toLowerCase()}.webp`}
                    alt={make.name}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <h3 className="font-medium">{make.name}</h3>
              </Link>
            ))}
          </div>

          {/* View More Button */}
          {visibleBrands < carMakes.length && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => setVisibleBrands(visibleBrands + brandsPerClick)}
                className="bg-primary-600 hover:bg-blue-300 cursor-pointer text-black px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 font-medium"
              >
                View More <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>



      {/* Services */}
      <section className="py-16 bg-[#F5F5F5]" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#121212] mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive automotive solutions to meet all your car buying and
              selling needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-[#121212] mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {service.title === "Car Financing" ? (
                <Link href="/finance">
                  <button className="w-full bg-[#30475E] text-white py-3 rounded-lg hover:bg-[#121212] transition-all duration-300 font-medium cursor-pointer">
                    Learn More
                  </button>
                </Link>
              ) : service.title === "Buying/Selling Cars" ? (
                <Link href="/buying-selling">
                  <button className="w-full bg-[#30475E] text-white py-3 rounded-lg hover:bg-[#121212] transition-all duration-300 font-medium cursor-pointer">
                    Learn More
                  </button>
                </Link>
              ) : (
                <Link href="/cars">
                <button className="w-full bg-[#30475E] text-white py-3 rounded-lg hover:bg-[#121212] transition-all duration-300 font-medium cursor-pointer">
                  Learn More
                </button>
                </Link>
              )}
              </div>
            ))}
          </div>
        </div>
      </section>
       {/* Trust Indicators */}
       <section className="py-16 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#121212] mb-4">Trusted by Millions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Industry recognition and customer trust that speaks for our commitment to excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300">
              <Award className="w-12 h-12 text-[#30475E] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#121212] mb-2">Industry Leader</h3>
              <p className="text-gray-600">Recognized as India's #1 used car platform by leading automotive publications</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300">
              <Users className="w-12 h-12 text-[#30475E] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#121212] mb-2">Customer First</h3>
              <p className="text-gray-600">Over 1 million satisfied customers with 99% positive feedback ratings</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300">
              <TrendingUp className="w-12 h-12 text-[#30475E] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#121212] mb-2">Growing Fast</h3>
              <p className="text-gray-600">Expanding to new cities every month with innovative automotive solutions</p>
            </div>
          </div>
        </div>
      </section>



           { /* About Us Section */}
            <section className="py-16 bg-white" id="about">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#121212] mb-4">About AutoMarket</h2>
                  <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                    Founded in 2018, AutoMarket has revolutionized the way Indians buy and sell cars. We're on a mission to make car ownership accessible, transparent, and hassle-free for everyone.
                  </p>
                </div>
              </div>
            
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="pl-4">
              <h3 className="text-2xl md:text-3xl font-bold text-[#121212] mb-6">Our Story</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                What started as a simple idea to help people find reliable used cars has grown into India's largest automotive marketplace. We recognized the challenges faced by car buyers and sellers - lack of transparency, complicated processes, and trust issues.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Today, we've facilitated over 50,000 car transactions, helping families across 25+ cities find their perfect vehicle. Our technology-driven approach ensures every car is thoroughly inspected, fairly priced, and comes with complete transparency.
              </p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#30475E]">6+</div>
                  <div className="text-gray-600 text-sm">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#30475E]">25+</div>
                  <div className="text-gray-600 text-sm">Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#30475E]">1M+</div>
                  <div className="text-gray-600 text-sm">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/car_showroom.jpg"
                alt="AutoMarket car showroom"
                width={800}
                height={400}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-[#F5F5F5] rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-[#30475E] text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#121212] mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To democratize car ownership in India by providing a transparent, reliable, and customer-centric platform that makes buying and selling cars simple, safe, and affordable for everyone.
              </p>
            </div>
            <div className="bg-[#F5F5F5] rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-[#30475E] text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#121212] mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become India's most trusted automotive ecosystem, where every car transaction is transparent, every customer is satisfied, and car ownership dreams become reality for millions of families.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-[#121212] mb-4">Our Core Values</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These values guide everything we do and shape our commitment to customers
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center group">
                <div className="w-16 h-16 bg-[#30475E] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#121212] transition-colors duration-300">
                  <Shield className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-[#121212] mb-2">Trust</h4>
                <p className="text-gray-600 text-sm">Building lasting relationships through transparency and reliability</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-[#30475E] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#121212] transition-colors duration-300">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-[#121212] mb-2">Quality</h4>
                <p className="text-gray-600 text-sm">Maintaining the highest standards in every car and service</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-[#30475E] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#121212] transition-colors duration-300">
                  <Users className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-[#121212] mb-2">Customer First</h4>
                <p className="text-gray-600 text-sm">Putting customer needs at the center of everything we do</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-[#30475E] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#121212] transition-colors duration-300">
                  <Award className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-[#121212] mb-2">Excellence</h4>
                <p className="text-gray-600 text-sm">Continuously improving and innovating for better experiences</p>
              </div>
            </div>
          </div>
        </section>

              {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#121212] mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Get the latest car deals, market insights, and exclusive offers delivered straight to your inbox.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              aria-label="Email address"
              className="flex-1 px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30475E] focus:border-transparent text-[#121212]"
            />
            <button
              onClick={handleSubscribe}
              className="bg-[#30475E] text-white px-8 py-4 rounded-lg hover:bg-[#121212] transition-all duration-300 transform hover:scale-105 font-medium whitespace-nowrap"
              aria-label="Subscribe to newsletter"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      </section>


    </div>
  );
} 