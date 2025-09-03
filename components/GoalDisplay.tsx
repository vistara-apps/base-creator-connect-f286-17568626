/**
 * GoalDisplay component for Base Creator Connect
 * 
 * This component displays creator goals with progress bars.
 */

import { TipGoal } from '@/types/database';
import { GoalProgressBar } from '@/components/GoalProgressBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GoalDisplayProps {
  goals: TipGoal[];
  selectedGoalId?: string;
  onSelect?: (goalId: string) => void;
}

export function GoalDisplay({ goals, selectedGoalId, onSelect }: GoalDisplayProps) {
  // Sort goals by progress percentage (descending)
  const sortedGoals = [...goals].sort((a, b) => {
    const progressA = (a.currentAmount / a.targetAmount) * 100;
    const progressB = (b.currentAmount / b.targetAmount) * 100;
    return progressB - progressA;
  });
  
  if (goals.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Creator Goals</h3>
      
      {sortedGoals.map(goal => {
        const progressPercent = (goal.currentAmount / goal.targetAmount) * 100;
        const isSelected = selectedGoalId === goal.id;
        const isClickable = !!onSelect;
        
        return (
          <Card
            key={goal.id}
            className={`overflow-hidden transition-all ${
              isClickable ? 'cursor-pointer hover:shadow-md' : ''
            } ${isSelected ? 'ring-2 ring-primary' : ''}`}
            onClick={() => isClickable && onSelect?.(goal.id)}
          >
            {goal.imageUrl && (
              <div className="w-full h-32 overflow-hidden">
                <img
                  src={goal.imageUrl}
                  alt={goal.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{goal.name}</CardTitle>
            </CardHeader>
            
            <CardContent>
              {goal.description && (
                <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
              )}
              
              <div className="flex justify-between text-sm mb-1">
                <span>{progressPercent.toFixed(0)}% Complete</span>
                <span>
                  {goal.currentAmount} / {goal.targetAmount} ETH
                </span>
              </div>
              
              <GoalProgressBar value={progressPercent} />
              
              {isSelected && (
                <div className="mt-2 text-sm text-primary font-medium">
                  Your tip will contribute to this goal
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

