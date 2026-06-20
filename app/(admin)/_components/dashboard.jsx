"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Car,
  Calendar,
  TrendingUp,
  Info,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
} from "lucide-react";

export function Dashboard({ initialData }) {
  const [activeTab, setActiveTab] = useState("overview");

  // Show error if data fetch failed
  if (!initialData || !initialData.success) {
    return (
      <Alert variant="destructive" className="bg-red-50 border-red-300">
        <Info className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">Error</AlertTitle>
        <AlertDescription className="text-red-700">
          {initialData?.error || "Failed to load dashboard data"}
        </AlertDescription>
      </Alert>
    );
  }

  const { cars, testDrives } = initialData.data;

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="bg-surface-muted text-foreground rounded-xl mb-4">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-4 py-2 transition-all cursor-pointer"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="test-drives"
            className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-4 py-2 transition-all cursor-pointer"
          >
            Test Drives
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white shadow-sm border border-border hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Total Cars
                </CardTitle>
                <Car className="h-4 w-4 text-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{cars.total}</div>
                <p className="text-xs text-gray-500">
                  {cars.available} available, {cars.sold} sold
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-border hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Test Drives
                </CardTitle>
                <Calendar className="h-4 w-4 text-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {testDrives.total}
                </div>
                <p className="text-xs text-gray-500">
                  {testDrives.pending} pending, {testDrives.confirmed} confirmed
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-border hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Conversion Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {testDrives.conversionRate}%
                </div>
                <p className="text-xs text-gray-500">From test drives to sales</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-border hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Cars Sold
                </CardTitle>
                <DollarSign className="h-4 w-4 text-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{cars.sold}</div>
                <p className="text-xs text-gray-500">
                  {((cars.sold / cars.total) * 100).toFixed(1)}% of inventory
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Dealership Summary */}
          <Card className="border border-border bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Dealership Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-surface-muted p-4 rounded-xl border border-border">
                  <h3 className="font-medium text-sm text-foreground mb-2">
                    Car Inventory
                  </h3>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{
                          width: `${(cars.available / cars.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-foreground">
                      {((cars.available / cars.total) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Available inventory capacity
                  </p>
                </div>

                <div className="bg-surface-muted p-4 rounded-xl border border-border">
                  <h3 className="font-medium text-sm text-foreground mb-2">
                    Test Drive Success
                  </h3>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{
                          width: `${
                            (testDrives.completed / (testDrives.total || 1)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-foreground">
                      {(
                        (testDrives.completed / (testDrives.total || 1)) *
                        100
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Completed test drives
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Drives Tab */}
        <TabsContent value="test-drives" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Total Bookings", value: testDrives.total, icon: Calendar, color: "var(--primary-color)" },
              { label: "Pending", value: testDrives.pending, icon: Clock, color: "#E5A000" },
              { label: "Confirmed", value: testDrives.confirmed, icon: CheckCircle, color: "var(--primary-color)" },
              { label: "Completed", value: testDrives.completed, icon: CheckCircle, color: "var(--primary-color)" },
              { label: "Cancelled", value: testDrives.cancelled, icon: XCircle, color: "#D93A3A" },
            ].map((card, idx) => (
              <Card key={idx} className="bg-white border border-border shadow-sm hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">
                    {card.label}
                  </CardTitle>
                  <card.icon className="h-4 w-4" style={{ color: card.color }} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {card.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
