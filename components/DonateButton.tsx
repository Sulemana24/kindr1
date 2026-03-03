"use client";

import Script from "next/script";
import { updateDonation } from "@/lib/firestore";

interface Props {
  campaignId: string;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function DonateButton({ campaignId }: Props) {
  const handlePayment = async () => {
    if (!window.PaystackPop) {
      alert("Payment service not loaded yet.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email: "donor@email.com",
      amount: 5000 * 100,
      currency: "GHS",
      callback: async function () {
        await updateDonation(campaignId, 50);
        alert("Donation successful 💜");
        window.location.reload();
      },
      onClose: function () {
        alert("Transaction cancelled");
      },
    });

    handler.openIframe();
  };

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      <button
        onClick={handlePayment}
        className="bg-pink-600 text-white px-4 py-2 rounded-lg mt-4"
      >
        Donate
      </button>
    </>
  );
}
