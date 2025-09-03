/**
 * TierForm component for Base Creator Connect
 * 
 * This component allows creators to create and edit tipping tiers.
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { tierApi } from '@/lib/api';
import { Tier, TierInsert } from '@/types/database';

interface TierFormProps {
  creatorId: string;
  tier?: Tier;
  onSave: () => void;
  onCancel?: () => void;
}

export function TierForm({ creatorId, tier, onSave, onCancel }: TierFormProps) {
  const [name, setName] = useState(tier?.name || '');
  const [minAmount, setMinAmount] = useState(tier?.minAmount.toString() || '0.01');
  const [perkDescription, setPerkDescription] = useState(tier?.perkDescription || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (!name) {
        throw new Error('Tier name is required');
      }
      
      const minAmountValue = parseFloat(minAmount);
      if (isNaN(minAmountValue) || minAmountValue <= 0) {
        throw new Error('Minimum amount must be greater than 0');
      }
      
      if (tier) {
        // Update existing tier
        await tierApi.updateTier(tier.id, {
          name,
          minAmount: minAmountValue,
          perkDescription,
        });
      } else {
        // Create new tier
        const tierData: TierInsert = {
          creatorId,
          name,
          minAmount: minAmountValue,
          perkDescription,
          isActive: true,
        };
        
        await tierApi.createTier(tierData);
      }
      
      onSave();
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{tier ? 'Edit Tier' : 'Create Tier'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Tier Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Super Fan, Gold Supporter"
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Minimum Amount (ETH)</label>
            <Input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="0.01"
              step="0.001"
              min="0.001"
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Perks Description</label>
            <Textarea
              value={perkDescription}
              onChange={(e) => setPerkDescription(e.target.value)}
              placeholder="Describe what fans get at this tier"
              rows={3}
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="flex space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : tier ? 'Update Tier' : 'Create Tier'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

