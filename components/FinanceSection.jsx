import React, { Suspense } from 'react';
import {
  CreditCard,
  Percent,
  FileText,
  Headphones,
  Building,
  Banknote,
  CheckCircle,
  Car,
  Shield,
} from 'lucide-react';
import { LoanCalculator } from './LoanCalculator';

export const FinanceSection = () => {
  const bankingPartners = [
    'HDFC Bank',
    'ICICI Bank',
    'SBI',
    'Axis Bank',
    'Kotak Bank',
    'IndusInd Bank',
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] mb-4">
            Car Financing Made Easy
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get pre-approved loans with competitive rates, flexible terms, and
            instant approval. Drive home your dream car today.
          </p>
        </div>

        {/* Loan Calculator */}
        <div className="mb-16">
          <Suspense fallback={<div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />}>
            <LoanCalculator currency="INR" symbol="₹" />
          </Suspense>
        </div>

        {/* Finance Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
            <CreditCard className="w-12 h-12 text-[#1D1D1F] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">
              Instant Approval
            </h3>
            <p className="text-gray-600">
              Get loan approval in just 30 minutes with minimal documentation
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
            <Percent className="w-12 h-12 text-[#1D1D1F] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">
              Low Interest Rates
            </h3>
            <p className="text-gray-600">
              Starting from 6.99% per annum with flexible repayment options
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
            <FileText className="w-12 h-12 text-[#1D1D1F] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">
              Minimal Documentation
            </h3>
            <p className="text-gray-600">
              Simple paperwork process with digital document submission
            </p>
          </div>
        </div>

        {/* Partner Banks */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-[#1D1D1F] mb-8">
            Our Banking Partners
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {bankingPartners.map((bank) => (
              <div
                key={bank}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
              >
                <Building className="w-8 h-8 text-[#1D1D1F] mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">{bank}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="bg-white rounded-2xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-6">Eligibility Criteria</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#1D1D1F]">Age</h4>
                    <p className="text-gray-600 text-sm">21 to 65 years for salaried, 25 to 70 years for self-employed</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#1D1D1F]">Income</h4>
                    <p className="text-gray-600 text-sm">Minimum ₹25,000 per month for salaried individuals</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#1D1D1F]">Employment</h4>
                    <p className="text-gray-600 text-sm">Minimum 2 years work experience</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#1D1D1F]">Credit Score</h4>
                    <p className="text-gray-600 text-sm">CIBIL score of 650 and above preferred</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-6">Required Documents</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-[#1D1D1F] mr-3" />
                  <span className="text-gray-700">Identity Proof (Aadhaar/PAN/Passport)</span>
                </div>
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-[#1D1D1F] mr-3" />
                  <span className="text-gray-700">Address Proof (Utility Bill/Rent Agreement)</span>
                </div>
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-[#1D1D1F] mr-3" />
                  <span className="text-gray-700">Income Proof (Salary Slips/ITR)</span>
                </div>
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-[#1D1D1F] mr-3" />
                  <span className="text-gray-700">Bank Statements (Last 6 months)</span>
                </div>
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-[#1D1D1F] mr-3" />
                  <span className="text-gray-700">Car Quotation/Invoice</span>
                </div>
              </div>

              <div className="mt-8">
                <button className="w-full bg-[#0071E3] text-white py-3 rounded-lg hover:bg-[#005BB5] transition-all duration-300 font-medium">
                  <Headphones className="w-5 h-5 mr-2 inline" />
                  Talk to Finance Expert
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Finance Process Steps */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-[#1D1D1F] mb-4">Simple Finance Process</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get your car loan approved in just 4 easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0071E3] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-lg font-bold text-[#1D1D1F] mb-2">Apply Online</h4>
              <p className="text-gray-600 text-sm">Fill out our simple online application form</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0071E3] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-lg font-bold text-[#1D1D1F] mb-2">Document Upload</h4>
              <p className="text-gray-600 text-sm">Upload required documents digitally</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0071E3] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-lg font-bold text-[#1D1D1F] mb-2">Instant Approval</h4>
              <p className="text-gray-600 text-sm">Get approval within 30 minutes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0071E3] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="text-lg font-bold text-[#1D1D1F] mb-2">Drive Home</h4>
              <p className="text-gray-600 text-sm">Complete paperwork and take your car</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
