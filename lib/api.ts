const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface IPOResponse {
  success: boolean;
  data?: {
    id: string;
    symbol: string;
    issueSize: string;
    issuePeriod: string;
    issueType: string;
    priceRange: string;
    faceValue: string;
    discount: string;
    cutOffTime: string;
    minInvestment: string | null;
    lastUpdated: string | null;
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown;
  };
  message?: string;
}

export interface SubscriptionRecord {
  id: string;
  symbol: string;
  category: string;
  offered: string;
  applied: string;
  demand: string | null;
  times: string;
  serialNumber: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface SubscriptionResponse {
  success: boolean;
  count?: number;
  data?: SubscriptionRecord[];
  message?: string;
}

export async function fetchIPOData(symbol: string): Promise<IPOResponse> {
  const response = await fetch(`${API_BASE_URL}/ipos/${symbol}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch IPO data: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchSubscriptionData(symbol: string): Promise<SubscriptionResponse> {
  const response = await fetch(`${API_BASE_URL}/ipos/${symbol}/subscriptions`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch subscription data: ${response.statusText}`);
  }
  
  return response.json();
}
