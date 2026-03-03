export interface Campaign {
  title: string;
  description: string;
  targetAmount: number;
  amountDonated: number;
  createdAt?: number | string;
}
