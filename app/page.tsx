'use client';

import { useEffect, useState } from 'react';
import { fetchIPOData, fetchSubscriptionData, type IPOResponse, type SubscriptionResponse } from '@/lib/api';
import IPODetailsTable from '@/components/IPODetailsTable';
import SubscriptionTable from '@/components/SubscriptionTable';

export default function Home() {
  const [ipoResponse, setIpoResponse] = useState<IPOResponse | null>(null);
  const [subscriptionResponse, setSubscriptionResponse] = useState<SubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const IPO_SYMBOL = 'BHARATCOAL';

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [ipoData, subscriptionData] = await Promise.all([
          fetchIPOData(IPO_SYMBOL),
          fetchSubscriptionData(IPO_SYMBOL)
        ]);

        setIpoResponse(ipoData);
        setSubscriptionResponse(subscriptionData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-xl font-semibold animate-pulse">Loading IPO data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 text-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            IPO Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            {IPO_SYMBOL} - Real-time subscription tracking
          </p>
        </div>

        {/* IPO Details Section */}
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-gray-800">IPO Details</h2>
            {ipoResponse?.success && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                Active
              </span>
            )}
          </div>
          {ipoResponse?.success && ipoResponse.data ? (
            <IPODetailsTable data={ipoResponse.data} />
          ) : (
            <div className="p-6 bg-white border border-gray-300 rounded-lg text-center text-gray-500">
              No IPO details available
            </div>
          )}
        </div>

        {/* Subscription Details Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              Subscription Details
            </h2>
            {subscriptionResponse?.count && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                {subscriptionResponse.count} Categories
              </span>
            )}
          </div>
          {subscriptionResponse?.success && subscriptionResponse.data ? (
            <SubscriptionTable data={subscriptionResponse.data} />
          ) : (
            <div className="p-6 bg-white border border-gray-300 rounded-lg text-center text-gray-500">
              No subscription data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
