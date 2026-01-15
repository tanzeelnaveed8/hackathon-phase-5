/**
 * Modern landing page with hero, features, and CTA sections.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect to tasks if already logged in
  useEffect(() => {
    if (user) {
      router.push('/tasks');
    }
  }, [user, router]);

  return (
    <main className="min-h-screen bg-background-primary">
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
