'use client';

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { fadeVariants } from "@/lib/animations";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border-default bg-background-secondary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeVariants}
        >
          {/* Branding - NON-NEGOTIABLE */}
          <div className="mb-6">
            <p className="text-lg font-semibold text-text-primary mb-2">
              Hackathon by Tanzeel Naveed Khan
            </p>
            <p className="text-sm text-text-secondary">
              GIAIC ID: 00456803
            </p>
          </div>

          {/* Divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-border-default to-transparent mx-auto mb-6" />

          {/* Social links (optional) */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-background-elevated transition-all duration-200"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-background-elevated transition-all duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:contact@example.com"
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-background-elevated transition-all duration-200"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-text-muted">
            © {currentYear} Todo App. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
