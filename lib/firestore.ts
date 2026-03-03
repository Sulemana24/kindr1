import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";

// Campaign type
export interface Campaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  amountDonated: number;
  createdAt: number;
}

// CREATE CAMPAIGN
/* export const createCampaign = async (campaign: Campaign) => {
  const docRef = await addDoc(collection(db, "campaigns"), campaign);
  return docRef.id;
}; */

// GET CAMPAIGNS
export const getCampaigns = async (): Promise<Campaign[]> => {
  const querySnapshot = await getDocs(collection(db, "campaigns"));

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Campaign, "id">),
  }));
};

// UPDATE DONATION
export const updateDonation = async (id: string, amount: number) => {
  const campaignRef = doc(db, "campaigns", id);

  await updateDoc(campaignRef, {
    amountDonated: increment(amount),
  });
};
