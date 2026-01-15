/**
 * Bulk actions toolbar component - appears when tasks are selected with modern UI
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trash2, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface BulkActionsToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onMarkComplete: () => void;
  onMarkIncomplete: () => void;
  onDelete: () => void;
  loading?: boolean;
}

export default function BulkActionsToolbar({
  selectedCount,
  totalCount,
  onSelectAll,
  onMarkComplete,
  onMarkIncomplete,
  onDelete,
  loading = false,
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) return null;

  const allSelected = selectedCount === totalCount;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 lg:left-auto lg:right-8 lg:translate-x-0"
      >
        <div className="bg-background-elevated border border-border-default rounded-xl shadow-2xl shadow-black/20 backdrop-blur-xl px-6 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Selected count */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gradient-primary-from to-gradient-primary-to flex items-center justify-center text-white font-semibold text-sm">
                {selectedCount}
              </div>
              <span className="text-sm text-text-secondary">
                {selectedCount === 1 ? 'task' : 'tasks'} selected
              </span>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-border-default" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Select All / Deselect All */}
              <Button
                variant="secondary"
                size="sm"
                onClick={onSelectAll}
                disabled={loading}
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </Button>

              {/* Mark Complete */}
              <Button
                variant="secondary"
                size="sm"
                onClick={onMarkComplete}
                disabled={loading}
                leftIcon={<CheckCircle size={16} />}
                className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
              >
                Complete
              </Button>

              {/* Mark Incomplete */}
              <Button
                variant="secondary"
                size="sm"
                onClick={onMarkIncomplete}
                disabled={loading}
                leftIcon={<XCircle size={16} />}
                className="text-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/10"
              >
                Incomplete
              </Button>

              {/* Delete */}
              <Button
                variant="secondary"
                size="sm"
                onClick={onDelete}
                disabled={loading}
                leftIcon={<Trash2 size={16} />}
                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
              >
                Delete
              </Button>

              {loading && (
                <div className="ml-2">
                  <Loader2 size={20} className="animate-spin text-text-muted" />
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
