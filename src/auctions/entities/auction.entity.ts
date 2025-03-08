export interface Auction {
    id: number;
    title: string;
    startingPrice: number;
    description?: string;
    active: boolean;
    highestBid?: number;
    highestBidder?: string;
  }
  