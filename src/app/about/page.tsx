import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
          Where Fandom Meets Fashion
        </h1>
        <p className="text-xl text-text-secondary">
          The story behind Drop Fit
        </p>
      </div>

      {/* Our Story */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-text-primary mb-6">Our Story</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-text-secondary text-lg leading-relaxed mb-4">
            Drop Fit was born from a simple idea: your favorite characters deserve to be more than just posters on your wall. 
            They deserve to be part of your everyday style. We're not just another clothing brand — we're a movement for 
            those who refuse to blend in.
          </p>
          <p className="text-text-secondary text-lg leading-relaxed mb-4">
            Every design we create is a love letter to the anime and series that shaped us. We pour the same passion 
            you feel when watching your favorite shows into every piece we make. This isn't mass-produced merch. 
            This is wearable art for the culture.
          </p>
          <p className="text-text-secondary text-lg leading-relaxed">
            We believe in quality over quantity. That's why each drop is limited, each design is intentional, 
            and each piece is made to last. When you wear Drop Fit, you're not just wearing a shirt — you're 
            making a statement.
          </p>
        </div>
      </section>

      {/* What We Stand For */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-text-primary mb-8">What We Stand For</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background-surface rounded-card border border-border p-6">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Quality</h3>
            <p className="text-text-secondary">
              Premium fabrics, fade-resistant prints, and attention to every detail. We don't cut corners.
            </p>
          </div>

          <div className="bg-background-surface rounded-card border border-border p-6">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Exclusivity</h3>
            <p className="text-text-secondary">
              Limited drops that never restock. When it's gone, it's gone. Own something truly unique.
            </p>
          </div>

          <div className="bg-background-surface rounded-card border border-border p-6">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Community</h3>
            <p className="text-text-secondary">
              More than customers — you're part of the Drop Fit family. Share your fits, connect, and inspire.
            </p>
          </div>

          <div className="bg-background-surface rounded-card border border-border p-6">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Passion</h3>
            <p className="text-text-secondary">
              Every design is crafted with love for the shows and characters that inspire us. Fans for fans.
            </p>
          </div>
        </div>
      </section>

      {/* How We Make It */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-text-primary mb-6">How We Make It</h2>
        <div className="bg-background-surface rounded-card border border-border p-8">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center font-bold text-white">
                1
              </div>
              <div>
                <h3 className="font-bold text-text-primary mb-2">Design with Purpose</h3>
                <p className="text-text-secondary">
                  Every design starts with a deep dive into the source material. We study the characters, the themes, 
                  and the aesthetics to create something authentic.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center font-bold text-white">
                2
              </div>
              <div>
                <h3 className="font-bold text-text-primary mb-2">Premium Materials</h3>
                <p className="text-text-secondary">
                  We use only high-quality cotton blends and advanced printing techniques that ensure your tee 
                  stays vibrant wash after wash.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center font-bold text-white">
                3
              </div>
              <div>
                <h3 className="font-bold text-text-primary mb-2">Limited Production</h3>
                <p className="text-text-secondary">
                  Each drop is produced in small quantities. This keeps our quality high and ensures you're wearing 
                  something truly exclusive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-text-primary mb-4">
          Join the Community
        </h2>
        <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
          Ready to upgrade your fit? Explore the latest drop and become part of something bigger.
        </p>
        <Link href="/drops">
          <Button size="lg">Explore the Latest Drop</Button>
        </Link>
      </section>
    </div>
  );
}
