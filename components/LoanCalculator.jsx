import React, { useState, useEffect } from 'react';
import { Calculator, IndianRupee, TrendingDown, Clock } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export const LoanCalculator = () => {
  const searchParams = useSearchParams();
  const priceFromUrl = searchParams.get('price');
  const carNameFromUrl = searchParams.get('carName');
  
  const initialPrice = priceFromUrl ? Number(priceFromUrl) : 2500000; // ₹25,00,000 default

  const [loanAmount, setLoanAmount] = useState(initialPrice);
  const [downPayment, setDownPayment] = useState(Math.round(initialPrice * 0.2));
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(5);
  const [emi, setEmi] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    if (priceFromUrl) {
      const price = Number(priceFromUrl);
      setLoanAmount(price);
      setDownPayment(Math.round(price * 0.2));
    }
  }, [priceFromUrl]);

  useEffect(() => {
    const principal = loanAmount - downPayment;
    const monthlyRate = interestRate / 12 / 100;
    const months = loanTenure * 12;

    if (principal > 0 && monthlyRate > 0 && months > 0) {
      const emiAmount =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
      const totalPayment = emiAmount * months;
      const interestPayment = totalPayment - principal;

      setEmi(Math.round(emiAmount));
      setTotalAmount(Math.round(totalPayment + downPayment));
      setTotalInterest(Math.round(interestPayment));
    } else {
      setEmi(0);
      setTotalAmount(0);
      setTotalInterest(0);
    }
  }, [loanAmount, downPayment, interestRate, loanTenure]);

  // Format in Indian Rupees
  const formatCurrency = (amount) => {
    if (isNaN(amount)) return "₹0";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="flex items-center mb-6">
        <Calculator className="w-8 h-8 text-foreground mr-3" />
        <h3 className="text-2xl font-bold text-foreground">Loan Calculator</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Car Price
            </label>
            <input
              type="range"
              min="500000"
              max="10000000"
              step="50000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              aria-label="Car Price Slider"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>₹5L</span>
              <span className="font-semibold text-foreground">{formatCurrency(loanAmount)}</span>
              <span>₹100L</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Down Payment
            </label>
            <input
              type="range"
              min="0"
              max={Math.max(loanAmount * 0.5 || 0, 0)}
              step="10000"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              aria-label="Down Payment Slider"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>₹0</span>
              <span className="font-semibold text-foreground">{formatCurrency(downPayment)}</span>
              <span>{formatCurrency(loanAmount * 0.5)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Interest Rate (% per annum)
            </label>
            <input
              type="range"
              min="6"
              max="12"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              aria-label="Interest Rate Slider"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>6%</span>
              <span className="font-semibold text-foreground">{interestRate}%</span>
              <span>12%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Loan Tenure (Years)
            </label>
            <input
              type="range"
              min="1"
              max="7"
              step="1"
              value={loanTenure}
              onChange={(e) => setLoanTenure(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              aria-label="Loan Tenure Slider"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>1 Year</span>
              <span className="font-semibold text-foreground">{loanTenure} Years</span>
              <span>7 Years</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6">
          <h4 className="text-lg font-bold text-foreground mb-4">Loan Summary</h4>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white rounded-lg">
              <div className="flex items-center">
                <IndianRupee className="w-5 h-5 text-foreground mr-2" />
                <span className="text-gray-700">Monthly EMI</span>
              </div>
              <span className="text-xl font-bold text-foreground"> {formatCurrency(emi)}</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-white rounded-lg">
              <div className="flex items-center">
                <TrendingDown className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-gray-700">Total Interest</span>
              </div>
              <span className="text-lg font-semibold text-gray-800">{formatCurrency(totalInterest)}</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-white rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-gray-700">Total Amount</span>
              </div>
              <span className="text-lg font-semibold text-gray-800">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <button className="w-full mt-6 bg-primary text-white py-3 rounded-lg hover:bg-primary-hover transition-all duration-300 font-medium cursor-pointer">
            Apply for Loan
          </button>
        </div>
      </div>
    </div>
  );
};
