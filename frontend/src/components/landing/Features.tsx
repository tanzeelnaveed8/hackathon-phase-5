'use client';

import { motion } from "framer-motion";
import { CheckSquare, Zap, Shield, Sparkles } from "lucide-react";
import Card, { CardContent } from "@/components/ui/Card";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";

const features = [
  {
    icon: CheckSquare,
    title: "Task Management",
    description: "Create, organize, and track your tasks with an intuitive interface designed for productivity.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance ensures your tasks load instantly and updates happen in real-time.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and protected with industry-standard security measures.",
  },
  {
    icon: Sparkles,
    title: "Beautiful Design",
    description: "A modern, elegant interface that makes task management a delightful experience.",
  },
];

export default function Features() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-background-secondary">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-default to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Powerful features wrapped in a beautiful, intuitive interface
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={staggerItemVariants}>
                <Card variant="elevated" hover className="h-full p-6">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                        <Icon size={24} className="text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-text-primary mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-text-secondary leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-default to-transparent" />
    </section>
  );
}
