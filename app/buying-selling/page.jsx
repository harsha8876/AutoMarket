"use client";

import { CheckCircle, Car, Handshake, Phone, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BuyingSellingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white py-16 px-6 md:px-12 lg:px-24">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Buying & Selling Cars Made Easy
        </h1>
        <p className="text-gray-600 text-lg">
          Whether you're purchasing your dream car or selling your old one,
          DriveIQ ensures a smooth, transparent, and rewarding experience.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
          <CheckCircle className="text-green-500 w-10 h-10 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Expert Guidance
          </h3>
          <p className="text-gray-600 text-sm">
            Get assistance from our experienced automobile consultants who help
            you make the right choice.
          </p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
          <CheckCircle className="text-green-500 w-10 h-10 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Best Deals
          </h3>
          <p className="text-gray-600 text-sm">
            Access exclusive offers and trade-in options that give you the best
            market value for your car.
          </p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
          <CheckCircle className="text-green-500 w-10 h-10 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Wide Selection
          </h3>
          <p className="text-gray-600 text-sm">
            Browse a wide variety of certified cars with transparent pricing and
            verified listings.
          </p>
        </div>
      </div>

      {/* Process Section */}
      <div className="max-w-5xl mx-auto text-center mb-20">
        <h2 className="text-3xl font-bold text-foreground mb-8">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
            <Car className="w-10 h-10 text-foreground mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Browse Cars</h4>
            <p className="text-sm text-gray-600">
              Explore new and pre-owned vehicles available at best prices.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
            <ClipboardList className="w-10 h-10 text-foreground mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Evaluate</h4>
            <p className="text-sm text-gray-600">
              Compare models, prices, and features with our detailed listings.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
            <Handshake className="w-10 h-10 text-foreground mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Buy or Sell</h4>
            <p className="text-sm text-gray-600">
              Securely complete your transaction through trusted dealerships.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
            <Phone className="w-10 h-10 text-foreground mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Get Support</h4>
            <p className="text-sm text-gray-600">
              Our support team assists with paperwork, financing, and delivery.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-3xl mx-auto text-center bg-primary text-white rounded-3xl p-10 shadow-lg">
        <h3 className="text-2xl font-semibold mb-3">
          Ready to buy ?
        </h3>
        <p className="text-gray-200 mb-6">
          Join thousands of happy customers who trusted DriveIQ for their car journey.
        </p>
        <Button
          onClick={() => (window.location.href = "/cars")}
          className="bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 cursor-pointer"
        >
          Explore Cars
        </Button>
      </div>
    </div>
  );
}
