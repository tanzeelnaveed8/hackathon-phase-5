'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { fadeVariants, slideUpVariants } from '@/lib/animations';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, signUp } = useAuth();
  const router = useRouter();

  // Redirect to tasks if already logged in
  useEffect(() => {
    if (user) {
      router.push('/tasks');
    }
  }, [user, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUp(name, email, password);
      router.push('/tasks');
    } catch (err: any) {
      if (err.message.includes('User already exists')) {
        setError('User already exists. Please use a different email or login instead.');
      } else {
        setError(err.message || 'Failed to sign up. Please try again.');
      }
      console.error('Sign up error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-background-primary relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo/Title */}
        <motion.div variants={slideUpVariants} className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold gradient-text mb-2">Todo App</h1>
          </Link>
          <p className="text-text-secondary">Create your account to get started</p>
        </motion.div>

        {/* Signup Card */}
        <motion.div variants={slideUpVariants}>
          <Card variant="elevated" className="p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Sign up to start managing your tasks efficiently</CardDescription>
            </CardHeader>

            <CardContent className="px-0 pb-0">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <p className="text-sm text-red-500">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSignup} className="space-y-5">
                <Input
                  label="Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  leftIcon={<User size={18} />}
                  required
                  disabled={loading}
                />

                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  leftIcon={<Mail size={18} />}
                  required
                  disabled={loading}
                />

                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  leftIcon={<Lock size={18} />}
                  helperText="Must be at least 8 characters long"
                  required
                  minLength={8}
                  disabled={loading}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  rightIcon={!loading ? <ArrowRight size={18} /> : undefined}
                  className="w-full"
                >
                  Create Account
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-default" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background-elevated text-text-muted">
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Login link */}
              <Link href="/auth/login">
                <Button variant="secondary" size="lg" className="w-full">
                  Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Branding Footer */}
        <motion.div
          variants={slideUpVariants}
          className="mt-8 text-center text-sm text-text-muted"
        >
          <p>Hackathon by Tanzeel Naveed Khan</p>
          <p className="mt-1">GIAIC ID: 00456803</p>
        </motion.div>
      </motion.div>
    </main>
  );
}
