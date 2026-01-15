'use client';

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { fadeVariants, slideUpVariants, staggerContainerVariants, staggerItemVariants } from "@/lib/animations";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 bg-background-primary">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.15),transparent_50%)]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto text-center"
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={staggerItemVariants} className="inline-flex mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background-elevated/80 backdrop-blur-sm border border-border-default">
            <CheckCircle2 size={16} className="text-gradient-primary-from" />
            <span className="text-sm text-text-secondary">Modern Task Management</span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={staggerItemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary mb-6 leading-tight"
        >
          Organize Your Life
          <br />
          <span className="gradient-text">One Task at a Time</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={staggerItemVariants}
          className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          A beautiful, modern todo application designed for productivity.
          Manage your tasks with elegance and efficiency.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={staggerItemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/auth/signup">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight size={20} />}>
              Get Started Free
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="secondary" size="lg">
              Sign In
            </Button>
          </Link>
        </motion.div>

        {/* Features list */}
        <motion.div
          variants={staggerItemVariants}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-text-muted"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-gradient-primary-from" />
            <span>Real-time sync</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-gradient-primary-from" />
            <span>Secure authentication</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-gradient-primary-from" />
            <span>Beautiful interface</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-default to-transparent" />
    </section>
  );
}
