'use client';

import { useParams } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { Collection } from '@/types/product';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductGridSkeleton } from '@/components/ui/Loading';
import Image from 'next/image';

const collectionData: Record<
  Collection,
  { 
    title: string; 
    description: string; 
    emoji: string;
    heroImage?: string;
    heroGradient: string;
  }
> = {
  anime: {
    title: 'Anime Drops',
    description: 'Iconic characters from your favorite anime series. Wear your passion proudly.',
    emoji: '⚔️',
    heroImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&h=400&fit=crop',
    heroGradient: 'from-red-600/20 to-purple-600/20',
  },
  series: {
    title: 'Series Streetwear',
    description: 'Classic TV shows reimagined as wearable art. For those who know.',
    emoji: '📺',
    heroImage: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200&h=400&fit=crop',
    heroGradient: 'from-blue-600/20 to-cyan-600/20',
  },
  minimal: {
    title: 'Minimal Fits',
    description: 'Subtle designs for the understated aesthetic. Less is more.',
    emoji: '✨',
    heroGradient: 'from-gray-600/20 to-slate-600/20',
  },
};

export default function CollectionPage() {
  const params = useParams();
  const slug = params.slug as Collection;

  const { products, loading } = useProducts({ collection: slug });
  const collection = collectionData[slug];

  if (!collection) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl font-bold text-text-primary mb-4">Collection Not Found</h1>
        <p className="text-text-secondary mb-8">The collection you're looking for doesn't exist.</p>
        <a href="/shop" className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors">
          Back to Shop
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Banner */}
      {collection.heroImage ? (
        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden mb-12">
          {/* Background Image */}
          <Image
            src={collection.heroImage}
            alt={collection.title}
            fill
            className="object-cover"
            priority
          />
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${collection.heroGradient} backdrop-blur-[2px]`}></div>
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <div className="text-6xl md:text-7xl mb-4 drop-shadow-lg">{collection.emoji}</div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              {collection.title}
            </h1>
            <p className="text-lg md:text-xl text-white max-w-2xl drop-shadow-lg">
              {collection.description}
            </p>
          </div>
        </div>
      ) : (
        /* Fallback for collections without hero image */
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{collection.emoji}</div>
          <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            {collection.title}
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {collection.description}
          </p>
        </div>
      )}

      {/* Products */}
      {loading ? (
        <ProductGridSkeleton count={9} />
      ) : (
        <ProductGrid
          products={products}
          emptyMessage={`No ${slug} products available right now. Check back soon!`}
        />
      )}
    </div>
  );
}
