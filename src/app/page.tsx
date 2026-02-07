'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getLatestCommunityPosts } from '@/lib/appwrite/community';
import { getUpcomingDrops } from '@/lib/appwrite/drops';
import { CommunityPost, Drop } from '@/types/drop';
import Button from '@/components/ui/Button';
import DropCard from '@/components/drops/DropCard';
import CommunityCard from '@/components/community/CommunityCard';

export default function HomePage() {
  const [upcomingDrop, setUpcomingDrop] = useState<Drop | null>(null);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [drops, posts] = await Promise.all([
        getUpcomingDrops(),
        getLatestCommunityPosts(3),
      ]);

      if (drops.length > 0) {
        setUpcomingDrop(drops[0]);
      }
      setCommunityPosts(posts);
    } catch (error) {
      console.error('Error fetching homepage data:', error);
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-background-surface to-background-DEFAULT py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-hero lg:text-hero-lg mb-6 text-primary">
              DROP FIT
            </h1>
            <p className="text-2xl lg:text-3xl font-semibold text-text-primary mb-4">
              Wear your fandom. Own your fit.
            </p>
            <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
              Limited-edition anime and series streetwear for those who dare to stand out. 
              Premium quality. Exclusive drops. No restocks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/drops">
                <Button size="lg">Shop the Latest Drop</Button>
              </Link>
              <Link href="/shop">
                <Button variant="secondary" size="lg">
                  Explore Collections
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Next Drop Section */}
      {upcomingDrop && (
        <section className="py-16 bg-background-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-2">
                🔥 Next Drop
              </h2>
              <p className="text-text-secondary">
                Limited stock. Once it's gone, it's gone forever.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <DropCard drop={upcomingDrop} />
            </div>
          </div>
        </section>
      )}

      {/* Featured Collections */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-10 text-center">
            Explore Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/collections/anime"
              className="group bg-background-surface rounded-card border border-border p-8 text-center hover:shadow-card-hover hover:-translate-y-1 transition-all"
            >
              <div className="text-5xl mb-4">⚔️</div>
              <h3 className="text-2xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                Anime Drops
              </h3>
              <p className="text-text-secondary">
                Iconic characters from your favorite anime series
              </p>
            </Link>

            <Link
              href="/collections/series"
              className="group bg-background-surface rounded-card border border-border p-8 text-center hover:shadow-card-hover hover:-translate-y-1 transition-all"
            >
              <div className="text-5xl mb-4">📺</div>
              <h3 className="text-2xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                Series Streetwear
              </h3>
              <p className="text-text-secondary">
                Classic TV shows reimagined as wearable art
              </p>
            </Link>

            <Link
              href="/collections/minimal"
              className="group bg-background-surface rounded-card border border-border p-8 text-center hover:shadow-card-hover hover:-translate-y-1 transition-all"
            >
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                Minimal Fits
              </h3>
              <p className="text-text-secondary">
                Subtle designs for those who prefer understated style
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Drop Fit */}
      <section className="py-16 bg-background-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-10 text-center">
            Why Drop Fit?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-text-primary mb-2">Premium Fabric</h3>
              <p className="text-sm text-text-secondary">
                High-quality cotton blend for maximum comfort
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="font-bold text-text-primary mb-2">Oversized & Regular</h3>
              <p className="text-sm text-text-secondary">
                Multiple fit options to suit your style
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold text-text-primary mb-2">Fade-Resistant</h3>
              <p className="text-sm text-text-secondary">
                Advanced printing for lasting vibrant colors
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-text-primary mb-2">Limited Edition</h3>
              <p className="text-sm text-text-secondary">
                Exclusive drops that never restock
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Teaser */}
      {communityPosts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-2">
                Join the Community
              </h2>
              <p className="text-text-secondary mb-4">
                Tag us with #DropFit and show off your fit
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {communityPosts.map((post) => (
                <CommunityCard key={post.$id} post={post} />
              ))}
            </div>

            <div className="text-center">
              <Link href="/community">
                <Button variant="secondary" size="lg">
                  View Community Gallery
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Upgrade Your Fit?
          </h2>
          <p className="text-white text-opacity-90 mb-8 text-lg">
            Don't miss out on the next exclusive drop
          </p>
          <Link href="/shop">
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100 border-white">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
