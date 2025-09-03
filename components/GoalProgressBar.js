    'use client';

    import { Progress } from '@/components/ui/progress';

    export function GoalProgressBar({ value }) {
      return <Progress value={value} className="w-full h-2 bg-surface rounded-sm" />;
    }
  