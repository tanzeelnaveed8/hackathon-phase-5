/**
 * Phase 5: Activity log side panel.
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X, CheckCircle, PlusCircle, Trash2, Edit } from 'lucide-react';
import { ActivityLog } from '@/lib/types';
import { taskApi } from '@/lib/api';

interface ActivityLogPanelProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  task_created: <PlusCircle size={14} className="text-green-400" />,
  task_updated: <Edit size={14} className="text-blue-400" />,
  task_deleted: <Trash2 size={14} className="text-red-400" />,
  task_completed: <CheckCircle size={14} className="text-emerald-400" />,
  task_uncompleted: <Activity size={14} className="text-yellow-400" />,
};

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function ActivityLogPanel({ userId, isOpen, onClose }: ActivityLogPanelProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      taskApi.getActivityLog(userId, 50)
        .then(setLogs)
        .catch(() => setLogs([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen, userId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-80 bg-background-primary border-l border-border-default shadow-2xl z-50 overflow-y-auto"
        >
          <div className="p-4 border-b border-border-default flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Activity size={18} />
              Activity Log
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-background-elevated transition-colors"
            >
              <X size={18} className="text-text-muted" />
            </button>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="text-center text-text-muted py-8">Loading...</div>
            ) : logs.length === 0 ? (
              <div className="text-center text-text-muted py-8">No activity yet</div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex gap-3 p-3 rounded-lg bg-background-elevated border border-border-default"
                  >
                    <div className="mt-0.5">
                      {ACTION_ICONS[log.action] || <Activity size={14} className="text-text-muted" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate">
                        {log.details || log.action.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {formatTime(log.created_at)}
                        {log.task_id && ` - Task #${log.task_id}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
