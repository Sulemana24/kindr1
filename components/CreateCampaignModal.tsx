"use client";

import { useState } from "react";
import { createCampaign } from "@/lib/firestore";

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
      await createCampaign({
        id: "",
        title,
        description,
        targetAmount: target,
        amountDonated: 0,
        createdAt: Date.now(),
      });

      // Store campaign data for success modal
      setCreatedCampaignData({
        title,
        target,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setTarget(0);

      // First close the main modal, then show success modal
      onClose();

      // Small delay to ensure smooth transition between modals
      setTimeout(() => {
        setShowSuccessModal(true);
      }, 300);
    } catch (error) {
      alert("Failed to create campaign. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setCreatedCampaignData({ title: "", target: 0 });
  };

  // If modal is not open, don't render anything
  if (!isOpen && !showSuccessModal) return null;

  // Handle clicking outside the modal to close
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
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 sm:p-8 text-center">
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
                Your campaign has been created
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

              {/* Next Steps */}
              <div className="mb-6 sm:mb-8">
                <h4 className="font-semibold text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">
                  What&apos;s next?
                </h4>
                <ul className="space-y-1.5 sm:space-y-2 text-gray-600">
                  <li className="flex items-start gap-2 text-xs sm:text-sm">
                    <span className="text-green-500 flex-shrink-0">•</span>
                    <span>Share your campaign with friends and family</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs sm:text-sm">
                    <span className="text-green-500 flex-shrink-0">•</span>
                    <span>Track donations in real-time</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs sm:text-sm">
                    <span className="text-green-500 flex-shrink-0">•</span>
                    <span>Update your supporters with progress</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 sm:gap-3">
                <button
                  onClick={handleSuccessModalClose}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 sm:py-3 px-4 rounded-xl transition-all duration-200 text-sm sm:text-base"
                >
                  Close
                </button>
              </div>

              {/* Social Share Buttons */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                <p className="text-xs sm:text-sm text-gray-500 text-center mb-2 sm:mb-3">
                  Spread the word!
                </p>
                <div className="flex justify-center gap-2 sm:gap-3">
                  <button className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1DA1F2] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.775-4.802 13.95 13.95 0 001.548-5.95c0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 sm:w-10 sm:h-10 bg-[#4267B2] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 sm:w-10 sm:h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.665 3.717a17.106 17.106 0 00-5.364-1.644c-.207.373-.448.88-.613 1.285a15.954 15.954 0 00-4.553 0 11.25 11.25 0 00-.62-1.285c-1.92.23-3.763.816-5.357 1.636C1.62 7.89.69 12.096 1.118 16.232a17.696 17.696 0 005.274 2.675c.423-.584.799-1.204 1.12-1.86a11.12 11.12 0 01-1.762-.852 9.174 9.174 0 00.424-.332 12.548 12.548 0 0010.754 0c.144.112.285.227.424.332-.556.33-1.144.616-1.762.852.322.656.697 1.276 1.12 1.86a17.592 17.592 0 005.266-2.667c.492-4.719-.847-8.891-3.55-12.512zM8.02 13.985c-1.03 0-1.87-.956-1.87-2.13 0-1.175.82-2.13 1.87-2.13 1.05 0 1.89.955 1.87 2.13 0 1.174-.82 2.13-1.87 2.13zm7.96 0c-1.03 0-1.87-.956-1.87-2.13 0-1.175.82-2.13 1.87-2.13 1.05 0 1.89.955 1.87 2.13 0 1.174-.82 2.13-1.87 2.13z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
