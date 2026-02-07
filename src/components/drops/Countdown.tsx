'use client';

import { useEffect, useState } from 'react';
import { calculateTimeRemaining } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface CountdownProps {
  targetDate: string;
  onComplete?: () => void;
}

export default function Countdown({ targetDate, onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining(targetDate);
      setTimeLeft(remaining);

      if (remaining.total <= 0) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (timeLeft.total <= 0) {
    return (
      <div className="text-center">
        <span className="text-2xl font-bold text-primary animate-pulse-red">
          LIVE NOW! 🔥
        </span>
      </div>
    );
  }

  const isUrgent = timeLeft.total < 3600000; // Less than 1 hour

  return (
    <div className="flex gap-4 justify-center">
      <TimeUnit value={timeLeft.days} label="Days" isUrgent={isUrgent} />
      <TimeUnit value={timeLeft.hours} label="Hours" isUrgent={isUrgent} />
      <TimeUnit value={timeLeft.minutes} label="Mins" isUrgent={isUrgent} />
      <TimeUnit value={timeLeft.seconds} label="Secs" isUrgent={isUrgent} />
    </div>
  );
}

function TimeUnit({
  value,
  label,
  isUrgent,
}: {
  value: number;
  label: string;
  isUrgent: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-background-surface rounded-lg p-3 min-w-[60px] border',
        isUrgent
          ? 'border-primary animate-pulse-red'
          : 'border-border'
      )}
    >
      <span
        className={cn(
          'text-2xl font-bold',
          isUrgent ? 'text-primary' : 'text-text-primary'
        )}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs text-text-secondary uppercase">{label}</span>
    </div>
  );
}
