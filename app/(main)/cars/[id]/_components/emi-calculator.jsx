"use client";

import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, IndianRupee } from "lucide-react";

export const EmiCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(800000); // ₹8,00,000
  const [interestRate, setInterestRate] = useState(8.5); // 8.5%
  const [loanTenure, setLoanTenure] = useState(5); // 5 years
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  // 🧮 EMI Calculation Formula
  useEffect(() => {
    const principal = loanAmount;
    const rate = interestRate / (12 * 100);
    const n = loanTenure * 12;

    const emiValue =
      (principal * rate * Math.pow(1 + rate, n)) /
      (Math.pow(1 + rate, n) - 1);

    const totalPaymentValue = emiValue * n;
    const totalInterestValue = totalPaymentValue - principal;

    setEmi(emiValue);
    setTotalPayment(totalPaymentValue);
    setTotalInterest(totalInterestValue);
  }, [loanAmount, interestRate, loanTenure]);

  // Format currency
  const formatCurrency = (num) =>
    num.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  return (
    <Card className="shadow-lg border border-gray-100">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Calculator className="w-6 h-6 text-foreground" />
          EMI Calculator
        </CardTitle>
        <p className="text-gray-500 text-sm">
          Estimate your monthly car loan payment easily.
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Inputs Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Loan Amount */}
          <div>
            <Label className="text-gray-700 font-medium mb-2 block">
              Loan Amount
            </Label>
            <div className="flex items-center gap-2 mb-2">
              <IndianRupee className="w-4 h-4 text-gray-500" />
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <Slider
              value={[loanAmount]}
              min={100000}
              max={5000000}
              step={10000}
              onValueChange={(val) => setLoanAmount(val[0])}
            />
          </div>

          {/* Interest Rate */}
          <div>
            <Label className="text-gray-700 font-medium mb-2 block">
              Interest Rate (%)
            </Label>
            <Input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="mb-2"
            />
            <Slider
              value={[interestRate]}
              min={5}
              max={15}
              step={0.1}
              onValueChange={(val) => setInterestRate(val[0])}
            />
          </div>

          {/* Loan Tenure */}
          <div>
            <Label className="text-gray-700 font-medium mb-2 block">
              Loan Tenure (Years)
            </Label>
            <Input
              type="number"
              value={loanTenure}
              onChange={(e) => setLoanTenure(Number(e.target.value))}
              className="mb-2"
            />
            <Slider
              value={[loanTenure]}
              min={1}
              max={10}
              step={1}
              onValueChange={(val) => setLoanTenure(val[0])}
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="text-center bg-gray-50 rounded-xl p-6">
            <p className="text-gray-500 text-sm mb-1">Monthly EMI</p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(emi)}
            </p>
          </div>
          <div className="text-center bg-gray-50 rounded-xl p-6">
            <p className="text-gray-500 text-sm mb-1">Total Interest</p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(totalInterest)}
            </p>
          </div>
          <div className="text-center bg-gray-50 rounded-xl p-6">
            <p className="text-gray-500 text-sm mb-1">Total Payment</p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(totalPayment)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
