"use client";

import { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import { updateDonation } from "@/lib/firestore";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  amountDonated: number;
  createdAt?: number;
}

interface Props {
  campaign: Campaign;
  onDonation?: (amount: number) => void;
  onOpenCreate?: () => void;
}

export default function CampaignCard({
  campaign,
  onDonation,
  onOpenCreate,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [donationAmount, setDonationAmount] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [currentDonation, setCurrentDonation] = useState(
    campaign.amountDonated,
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastDonation, setLastDonation] = useState(0);

  const percentage = Math.min(
    Math.round((currentDonation / campaign.targetAmount) * 100),
    100,
  );
  const isCompleted = currentDonation >= campaign.targetAmount;

  const presetAmounts = [10, 50, 100, 200];

  useEffect(() => {
    if (!window.PaystackPop) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => console.log("Paystack script loaded");
      document.body.appendChild(script);
    }
  }, []);

  // Days left calculation
  useEffect(() => {
    setIsMounted(true);

    const calculateDaysLeft = () => {
      const now = Date.now();
      const endDate = (campaign.createdAt ?? now) + 30 * 24 * 60 * 60 * 1000;
      return Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
    };

    setDaysLeft(calculateDaysLeft());

    const interval = setInterval(
      () => {
        setDaysLeft(calculateDaysLeft());
      },
      60 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [campaign.createdAt]);

  const handleSuccessfulPayment = async () => {
    try {
      await updateDonation(campaign.id, donationAmount);

      setCurrentDonation((prev) => prev + donationAmount);

      if (onDonation) onDonation(donationAmount);

      setLastDonation(donationAmount);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error updating donation:", error);
      alert("Payment succeeded but failed to update campaign total.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Paystack donation
  const handleDonate = () => {
    if (!window.PaystackPop) {
      alert("Payment service not loaded yet. Refresh the page.");
      return;
    }

    if (donationAmount < 10) {
      alert("Minimum donation is GHS 10");
      return;
    }

    setIsProcessing(true);

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email: "donor@email.com",
      amount: donationAmount * 100,
      currency: "GHS",
      metadata: {
        campaign_id: campaign.id,
        campaign_title: campaign.title,
      },
      callback: function () {
        handleSuccessfulPayment();
      },
      onClose: function () {
        setIsProcessing(false);
        console.log("Transaction cancelled");
      },
    });

    handler.openIframe();
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden">
      <div
        className={`h-2 bg-gradient-to-r ${
          isCompleted
            ? "from-green-500 to-emerald-500"
            : "from-pink-500 to-purple-600"
        }`}
      />

      <div className="p-6">
        {/* Title */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2">
            {campaign.title}
          </h3>
          {isCompleted && (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full ml-2">
              Goal Reached! 🎉
            </span>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className={`text-gray-600 ${!isExpanded ? "line-clamp-3" : ""}`}>
            {campaign.description}
          </p>
          {campaign.description.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-pink-600 hover:text-pink-700 font-medium mt-2"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Raised:{" "}
              <span className="text-gray-900">
                GHS {currentDonation.toLocaleString()}
              </span>
            </span>
            <span className="text-sm text-gray-500">
              Target: GHS {campaign.targetAmount.toLocaleString()}
            </span>
          </div>

          <ProgressBar
            donated={currentDonation}
            target={campaign.targetAmount}
          />

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              <span className="font-semibold text-gray-900">{percentage}%</span>{" "}
              funded
            </span>
          </div>
        </div>

        {/* Donation Amount Selection */}
        {!isCompleted && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Donation Amount (GHS)
            </label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setDonationAmount(amount)}
                  className={`py-2 px-1 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                    donationAmount === amount
                      ? "border-pink-600 bg-pink-50 text-pink-700"
                      : "border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50/50"
                  }`}
                >
                  GHS {amount}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Custom:</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  GHS
                </span>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(Number(e.target.value))}
                  className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-600"
                  placeholder="Enter amount"
                />
              </div>
            </div>
          </div>
        )}

        {/* Donate Button */}
        <div className="space-y-3">
          <button
            onClick={handleDonate}
            disabled={isProcessing || isCompleted}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] ${
              isCompleted
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 shadow-lg shadow-pink-600/20"
            }`}
          >
            {isProcessing
              ? "Processing..."
              : isCompleted
                ? "Campaign Completed"
                : `Donate Now 💝`}
          </button>
          <button
            onClick={onOpenCreate}
            className="w-full py-3 px-4 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
          >
            Register a Campaign
          </button>
        </div>
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-fadeIn">
            <div className="text-5xl mb-4">🎉</div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>

            <p className="text-gray-600 mb-6">
              Thank you for donating{" "}
              <span className="font-semibold text-pink-600">
                GHS {lastDonation}
              </span>{" "}
              to <span className="font-semibold">{campaign.title}</span>.
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold hover:from-pink-700 hover:to-purple-700 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
