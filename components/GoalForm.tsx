/**
 * GoalForm component for Base Creator Connect
 * 
 * This component allows creators to create and edit tipping goals.
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { tipGoalApi } from '@/lib/api';
import { TipGoal, TipGoalInsert } from '@/types/database';

interface GoalFormProps {
  creatorId: string;
  goal?: TipGoal;
  onSave: () => void;
  onCancel?: () => void;
}

export function GoalForm({ creatorId, goal, onSave, onCancel }: GoalFormProps) {
  const [name, setName] = useState(goal?.name || '');
  const [description, setDescription] = useState(goal?.description || '');
  const [targetAmount, setTargetAmount] = useState(goal?.targetAmount.toString() || '1');
  const [imageUrl, setImageUrl] = useState(goal?.imageUrl || '');
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
        throw new Error('Goal name is required');
      }
      
      const targetAmountValue = parseFloat(targetAmount);
      if (isNaN(targetAmountValue) || targetAmountValue <= 0) {
        throw new Error('Target amount must be greater than 0');
      }
      
      if (goal) {
        // Update existing goal
        await tipGoalApi.updateGoal(goal.id, {
          name,
          description,
          targetAmount: targetAmountValue,
          imageUrl,
        });
      } else {
        // Create new goal
        const goalData: TipGoalInsert = {
          creatorId,
          name,
          description,
          targetAmount: targetAmountValue,
          imageUrl,
          isActive: true,
        };
        
        await tipGoalApi.createGoal(goalData);
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
        <CardTitle>{goal ? 'Edit Goal' : 'Create Goal'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Goal Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., New Microphone, 100 Subscribers"
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this goal is for"
              rows={3}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Target Amount (ETH)</label>
            <Input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="1"
              step="0.01"
              min="0.01"
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Image URL (Optional)</label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/goal-image.jpg"
            />
            {imageUrl && (
              <div className="mt-2 flex justify-center">
                <img
                  src={imageUrl}
                  alt="Goal Preview"
                  className="h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="flex space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : goal ? 'Update Goal' : 'Create Goal'}
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

