/**
 * Phase 5: Task filter, search, and sort bar.
 */

'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Tag } from 'lucide-react';
import { TaskFilters, TaskPriority } from '@/lib/types';

interface TaskFilterBarProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}

export default function TaskFilterBar({ filters, onFiltersChange }: TaskFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search: search || undefined });
  };

  const handlePriorityChange = (priority: TaskPriority | undefined) => {
    onFiltersChange({ ...filters, priority });
  };

  const handleCompletionChange = (value: string) => {
    let is_completed: boolean | undefined;
    if (value === 'completed') is_completed = true;
    else if (value === 'incomplete') is_completed = false;
    onFiltersChange({ ...filters, is_completed });
  };

  const handleSortChange = (sort_by: TaskFilters['sort_by']) => {
    onFiltersChange({ ...filters, sort_by });
  };

  const handleSortOrderToggle = () => {
    onFiltersChange({
      ...filters,
      sort_order: filters.sort_order === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleTagFilter = () => {
    const trimmed = tagInput.trim();
    if (trimmed) {
      onFiltersChange({ ...filters, tag: trimmed });
      setTagInput('');
    }
  };

  const clearTagFilter = () => {
    onFiltersChange({ ...filters, tag: undefined });
  };

  const clearFilters = () => {
    setTagInput('');
    onFiltersChange({});
  };

  const hasActiveFilters = filters.search || filters.priority || filters.is_completed !== undefined || filters.tag;

  return (
    <div className="mb-6 space-y-3">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2.5 bg-background-elevated border border-border-default rounded-lg text-text-primary text-sm placeholder:text-text-muted transition-all focus:outline-none focus:ring-2 focus:ring-border-focus"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-3 py-2.5 rounded-lg border transition-all flex items-center gap-2 text-sm ${
            showFilters || hasActiveFilters
              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
              : 'bg-background-elevated border-border-default text-text-secondary hover:border-border-focus'
          }`}
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-center gap-1 hover:bg-red-500/20 transition-all"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Filter options */}
      {showFilters && (
        <div className="p-4 bg-background-elevated border border-border-default rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Priority filter */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Priority</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handlePriorityChange(undefined)}
                className={`px-2.5 py-1 rounded text-xs transition-all ${
                  !filters.priority ? 'bg-indigo-500 text-white' : 'bg-background-primary text-text-secondary border border-border-default'
                }`}
              >
                All
              </button>
              {(['low', 'medium', 'high', 'urgent'] as TaskPriority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePriorityChange(p)}
                  className={`px-2.5 py-1 rounded text-xs capitalize transition-all ${
                    filters.priority === p ? 'bg-indigo-500 text-white' : 'bg-background-primary text-text-secondary border border-border-default'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Status</label>
            <div className="flex gap-1.5">
              {[
                { value: 'all', label: 'All' },
                { value: 'incomplete', label: 'Active' },
                { value: 'completed', label: 'Done' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleCompletionChange(opt.value)}
                  className={`px-2.5 py-1 rounded text-xs transition-all ${
                    (opt.value === 'all' && filters.is_completed === undefined) ||
                    (opt.value === 'completed' && filters.is_completed === true) ||
                    (opt.value === 'incomplete' && filters.is_completed === false)
                      ? 'bg-indigo-500 text-white'
                      : 'bg-background-primary text-text-secondary border border-border-default'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Sort By</label>
            <div className="flex gap-1.5">
              <select
                value={filters.sort_by || 'created_at'}
                onChange={(e) => handleSortChange(e.target.value as TaskFilters['sort_by'])}
                className="flex-1 px-2.5 py-1 rounded text-xs bg-background-primary text-text-secondary border border-border-default focus:outline-none focus:ring-1 focus:ring-border-focus"
              >
                <option value="created_at">Date Created</option>
                <option value="due_date">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
              <button
                onClick={handleSortOrderToggle}
                className="px-2.5 py-1 rounded text-xs bg-background-primary text-text-secondary border border-border-default hover:border-border-focus transition-all"
                title={filters.sort_order === 'asc' ? 'Ascending' : 'Descending'}
              >
                <ArrowUpDown size={14} />
              </button>
            </div>
          </div>

          {/* Tag filter */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Filter by Tag</label>
            {filters.tag ? (
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-medium">
                  <Tag size={12} />
                  #{filters.tag}
                  <button onClick={clearTagFilter} className="hover:text-red-400 transition-colors ml-0.5">
                    <X size={12} />
                  </button>
                </span>
              </div>
            ) : (
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTagFilter()}
                  placeholder="Tag name..."
                  className="flex-1 px-2.5 py-1 rounded text-xs bg-background-primary text-text-secondary border border-border-default placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-border-focus"
                />
                <button
                  onClick={handleTagFilter}
                  disabled={!tagInput.trim()}
                  className="px-2.5 py-1 rounded text-xs bg-background-primary text-text-secondary border border-border-default hover:border-border-focus transition-all disabled:opacity-40"
                >
                  <Tag size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
