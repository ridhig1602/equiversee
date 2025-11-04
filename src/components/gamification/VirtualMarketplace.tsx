'use client';
import { useState, useEffect } from 'react';
import { MarketplaceItem, marketplaceItems, purchaseItem } from '@/lib/marketplace';

export default function VirtualMarketplace() {
  const [userXP, setUserXP] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const xp = parseInt(localStorage.getItem('user-xp') || '0');
    const purchases = JSON.parse(localStorage.getItem('marketplace-purchases') || '[]');
    setUserXP(xp);
    setPurchasedItems(purchases);
  };

  const handlePurchase = (item: MarketplaceItem) => {
    if (purchaseItem(item.id, userXP)) {
      loadUserData();
      alert(`🎉 Successfully purchased ${item.name}!`);
    } else {
      alert('❌ Not enough XP for this item!');
    }
  };

  const isPurchased = (itemId: string) => purchasedItems.includes(itemId);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Virtual Marketplace</h3>
        <div className="text-right">
          <p className="text-sm text-gray-500">Your Balance</p>
          <p className="text-2xl font-bold text-green-600">{userXP.toLocaleString()} XP</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {marketplaceItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 border rounded-lg ${
              isPurchased(item.id) 
                ? 'bg-gray-100 border-gray-300' 
                : 'bg-white border-gray-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <h4 className="font-semibold">{item.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-600">{item.cost.toLocaleString()} XP</span>
                  
                  {isPurchased(item.id) ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      ✅ Purchased
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={userXP < item.cost}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        userXP >= item.cost
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {userXP >= item.cost ? 'Purchase' : 'Need More XP'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800 text-center">
          💡 Earn XP by completing challenges, learning modules, and making successful trades!
        </p>
      </div>
    </div>
  );
}
