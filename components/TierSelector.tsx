/**
 * TierSelector component for Base Creator Connect
 * 
 * This component displays available tiers and allows selection.
 */

import { Tier } from '@/types/database';

interface TierSelectorProps {
  tiers: Tier[];
  selectedTierId?: string;
  amount: string;
  onSelect: (tierId: string) => void;
}

export function TierSelector({ tiers, selectedTierId, amount, onSelect }: TierSelectorProps) {
  // Sort tiers by minimum amount
  const sortedTiers = [...tiers].sort((a, b) => a.minAmount - b.minAmount);
  
  // Get qualifying tiers based on amount
  const amountValue = parseFloat(amount);
  const qualifyingTiers = sortedTiers.filter(tier => amountValue >= tier.minAmount);
  
  // Get highest qualifying tier
  const highestQualifyingTier = qualifyingTiers.length > 0 
    ? qualifyingTiers[qualifyingTiers.length - 1] 
    : null;
  
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Tipping Tiers</h3>
      
      {sortedTiers.length === 0 ? (
        <p className="text-sm text-gray-500">No tiers available</p>
      ) : (
        <div className="space-y-2">
          {sortedTiers.map(tier => {
            const isQualifying = amountValue >= tier.minAmount;
            const isSelected = selectedTierId === tier.id;
            const isHighest = highestQualifyingTier?.id === tier.id;
            
            return (
              <div
                key={tier.id}
                className={`border rounded-md p-3 cursor-pointer transition-colors ${
                  isQualifying ? 'border-primary/50 bg-primary/5' : 'border-gray-200'
                } ${isSelected ? 'ring-2 ring-primary' : ''} ${
                  isHighest && !isSelected ? 'ring-1 ring-primary/30' : ''
                }`}
                onClick={() => isQualifying && onSelect(tier.id)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{tier.name}</span>
                  <span className={`text-sm ${isQualifying ? 'text-primary' : 'text-gray-500'}`}>
                    {tier.minAmount} ETH
                  </span>
                </div>
                
                {tier.perkDescription && (
                  <p className="text-sm text-gray-600 mt-1">{tier.perkDescription}</p>
                )}
                
                {!isQualifying && (
                  <p className="text-xs text-gray-500 mt-2">
                    Increase your tip to {tier.minAmount} ETH to qualify
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

