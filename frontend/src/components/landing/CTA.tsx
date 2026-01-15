'use client';

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { fadeVariants, slideUpVariants } from "@/lib/animations";

export default function CTA() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background-primary">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gradient-primary-from via-gradient-primary-to to-gradient-accent-to opacity-10" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeVariants}
      >
        {/* Heading */}
        <motion.h2
          variants={slideUpVariants}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6"
        >
          Ready to Get Started?
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={slideUpVariants}
          className="text-lg sm:text-xl text-text-secondary mb-10 max-w-2xl mx-auto"
        >
          Join thousands of users who are already managing their tasks more efficiently.
          Start organizing your life today.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={slideUpVariants}>
          <Link href="/auth/signup">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={20} />}
              className="shadow-2xl shadow-indigo-500/30"
            >
              Create Your Free Account
            </Button>
          </Link>
        </motion.div>

        {/* Trust indicator */}
        <motion.p
          variants={slideUpVariants}
          className="mt-6 text-sm text-text-muted"
        >
          No credit card required • Free forever • Cancel anytime
        </motion.p>
      </motion.div>
    </section>
  );
}
