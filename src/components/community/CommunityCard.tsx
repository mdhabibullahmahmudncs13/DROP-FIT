import Image from 'next/image';
import { CommunityPost } from '@/types/drop';

interface CommunityCardProps {
  post: CommunityPost;
}

export default function CommunityCard({ post }: CommunityCardProps) {
  return (
    <div className="bg-background-surface rounded-card border border-border overflow-hidden hover:shadow-card-hover transition-all group">
      {/* Image */}
      <div className="relative aspect-square bg-background-hover">
        <Image
          src={post.image_url}
          alt={post.caption || `Post by ${post.user_name}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="font-semibold text-text-primary mb-1">{post.user_name}</p>
        {post.caption && (
          <p className="text-sm text-text-secondary line-clamp-2">
            {post.caption}
          </p>
        )}
      </div>
    </div>
  );
}
