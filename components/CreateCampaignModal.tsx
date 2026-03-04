"use client";

import { useState } from "react";
/* import { createCampaign } from "@/lib/firestore"; */

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCampaignModal({
  isOpen,
  onClose,
}: CreateCampaignModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [target, setTarget] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdCampaignData, setCreatedCampaignData] = useState({
    title: "",
    target: 0,
  });

  const handleSubmit = async () => {
    if (!title || !description || target <= 0) {
      alert("Please fill in all fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send-campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          email,
          target,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      setCreatedCampaignData({
        title,
        target,
      });

      setTitle("");
      setDescription("");
      setTarget(0);

      onClose();

      setTimeout(() => {
        setShowSuccessModal(true);
      }, 300);
    } catch (error) {
      alert("Failed to register campaign. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /*  const handleSubmit = async () => {
    if (!title || !description || target <= 0) {
      alert("Please fill in all fields correctly");
      return;
    }

    setIsSubmitting(true);
    try {
      await createCampaign({
        id: "",
        title,
        description,
        targetAmount: target,
        amountDonated: 0,
        createdAt: Date.now(),
      });

      
      setCreatedCampaignData({
        title,
        target,
      });

      
      setTitle("");
      setDescription("");
      setTarget(0);

     
      onClose();

     
      setTimeout(() => {
        setShowSuccessModal(true);
      }, 300);
    } catch (error) {
      alert("Failed to create campaign. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }; */

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setCreatedCampaignData({ title: "", target: 0 });
  };

  if (!isOpen && !showSuccessModal) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Main Campaign Creation Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={handleOverlayClick}
        >
          <div className="w-full max-w-[95%] sm:max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 animate-fade-in max-h-[90vh] overflow-y-auto">
            {/* Header with close button */}
            <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="pr-4">
                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Register New Campaign
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  Fill in the details below to start your fundraising journey.
                </p>
                <p className="text-xs text-red-400 mt-2">
                  Please note: 7% fees will be deducted from your campaign
                  total.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 flex-shrink-0"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Form content */}
            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Campaign Title
                  </label>
                  <input
                    placeholder="e.g., Help Build a Community Library"
                    value={title}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    placeholder="e.g., user@example.com"
                    value={email}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Tell your story and explain why this campaign matters..."
                    value={description}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Target Amount (Ghc)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    placeholder="5000"
                    value={target || ""}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                    onChange={(e) => setTarget(Number(e.target.value))}
                  />
                  {target > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Goal: Ghc{target.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer with buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-100">
              <button
                onClick={onClose}
                className="w-full sm:flex-1 order-2 sm:order-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 sm:py-3 px-4 rounded-xl transition-all duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !title || !description || target <= 0}
                className="w-full sm:flex-1 order-1 sm:order-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-600/20 text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-sm sm:text-base">Registring...</span>
                  </span>
                ) : (
                  "Register Campaign"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal - Fully Responsive */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-2 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleSuccessModalClose();
            }
          }}
        >
          <div className="w-full max-w-[95%] sm:max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 animate-fade-in overflow-hidden max-h-[95vh] overflow-y-auto">
            {/* Success Header with Celebration Gradient */}
            <div className="bg-gradient-to-r from-pink-600 to-purple-600  p-6 sm:p-8 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 backdrop-blur-sm">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                Success! 🎉
              </h3>
              <p className="text-white/90 text-base sm:text-lg">
                Your email has been sent. Your campaign will be added after
                confirmation.
              </p>
            </div>

            {/* Campaign Summary */}
            <div className="p-4 sm:p-6 md:p-8">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                <h4 className="font-semibold text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">
                  Campaign Details:
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-pink-600 text-xs sm:text-sm">
                        📋
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Title</p>
                      <p className="font-medium text-gray-800 text-sm sm:text-base break-words">
                        {createdCampaignData.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-600 text-xs sm:text-sm">
                        💰
                      </span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Target Goal
                      </p>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">
                        Ghc {createdCampaignData.target.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex flex-col gap-2 sm:gap-3">
                <button
                  onClick={handleSuccessModalClose}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 sm:py-3 px-4 rounded-xl transition-all duration-200 text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
