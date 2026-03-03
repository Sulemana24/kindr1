"use client";

import { useState, useEffect } from "react";
import CampaignCard from "@/components/CampaignCard";
import CreateCampaignModal from "@/components/CreateCampaignModal";
import Footer from "@/components/Footer";
import Logo from "../public/logo.png";
import Image from "next/image";
import { getCampaigns } from "@/lib/firestore";
import { db } from "../lib/firebase";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  amountDonated: number;
  createdAt?: number;
}

export default function Home() {
  // Mock campaign with numeric createdAt
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Image src={Logo} alt="Kindr Logo" width={32} height={32} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Kindr
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              {campaigns.length}{" "}
              {campaigns.length === 1 ? "Campaign" : "Campaigns"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Campaigns Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Active Campaigns
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent ml-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="transform transition-all duration-300 hover:scale-[1.02]"
              >
                <CampaignCard campaign={campaign} onOpenCreate={openModal} />
              </div>
            ))}
          </div>
        </section>

        <div className="text-center mt-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Need Help? Create a fundraising campaign today! 🌟
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create a fundraiser and begin receiving support from your community.
            Whether it&apos;s for a personal cause, a charitable organization,
            or a community project, Kindr makes it easy to share your story and
            raise funds. Join us in making a difference today!
          </p>

          {/* Button to open the modal */}
          <div className="mt-8">
            <button
              onClick={openModal}
              className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl hover:from-pink-600 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Start a Fundraiser
            </button>
          </div>
        </div>

        {/* Create Campaign Modal */}
        <CreateCampaignModal isOpen={isModalOpen} onClose={closeModal} />
      </main>

      <Footer />
    </div>
  );
}
