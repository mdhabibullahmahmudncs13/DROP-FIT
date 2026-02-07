import Image from 'next/image';
import Link from 'next/link';
import { Drop } from '@/types/drop';
import { formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Countdown from './Countdown';

interface DropCardProps {
  drop: Drop;
}

export default function DropCard({ drop }: DropCardProps) {
  const dropDate = new Date(drop.launch_date);
  const now = new Date();
  const isUpcoming = drop.status === 'upcoming';
  const isActive = drop.status === 'active';
  const isPast = drop.status === 'ended';

  return (
    <div className="bg-background-surface rounded-card border border-border overflow-hidden hover:shadow-card-hover transition-all">
      {/* Banner Image */}
      {drop.image_url && (
        <div className="relative h-48 bg-background-hover">
          <Image
            src={drop.image_url}
            alt={drop.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-6">
        {/* Status Badge */}
        <div className="mb-4">
          {isActive && (
            <Badge variant="success" size="md">
              Active Now 🔥
            </Badge>
          )}
          {isUpcoming && (
            <Badge variant="neutral" size="md">
              Upcoming
            </Badge>
          )}
          {isPast && (
            <Badge variant="error" size="md">
              Ended
            </Badge>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl font-bold text-text-primary mb-2">
          {drop.name}
        </h3>
        <p className="text-text-secondary mb-6">{drop.description}</p>

        {/* Countdown or Date */}
        {isUpcoming && (
          <div className="mb-6">
            <p className="text-sm text-text-secondary mb-3 text-center">
              Drops in:
            </p>
            <Countdown targetDate={drop.launch_date} />
          </div>
        )}

        {!isUpcoming && (
          <p className="text-sm text-text-secondary mb-6">
            {isActive ? 'Started: ' : 'Ended: '}
            {formatDate(drop.launch_date)}
          </p>
        )}

        {/* CTA */}
        {isActive && (
          <Link
            href="/drops"
            className="block w-full px-6 py-3 bg-primary text-white text-center rounded-lg font-bold hover:bg-primary-dark transition-colors"
          >
            Shop This Drop
          </Link>
        )}
      </div>
    </div>
  );
}
