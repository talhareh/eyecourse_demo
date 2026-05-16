"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";

import { cn } from "@/lib/cn";
import { courseCategories, courseLevels, durationOptions, type SortBy } from "@/lib/course-api";

type CourseFiltersState = {
  search: string;
  category: (typeof courseCategories)[number];
  level: (typeof courseLevels)[number];
  duration: (typeof durationOptions)[number];
  sortBy: SortBy;
};

type CourseFiltersProps = {
  value: CourseFiltersState;
  onChange: (next: Partial<CourseFiltersState>) => void;
};

const sortOptions: { value: SortBy; label: string }[] = [
  { value: "popularity", label: "Popularity" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

function FilterControls({ value, onChange }: CourseFiltersProps) {
  return (
    <div className="space-y-4">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={16} />
        <input
          value={value.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Search courses or instructors"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none ring-cyan-300 focus:ring-2"
        />
      </label>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Category</p>
        <div className="flex flex-wrap gap-2">
          {courseCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onChange({ category })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium",
                value.category === category
                  ? "border-cyan-600 bg-cyan-600 text-white"
                  : "border-slate-200 bg-white text-slate-700",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="space-y-1 text-xs font-medium text-slate-600">
          <span>Level</span>
          <select
            value={value.level}
            onChange={(event) => onChange({ level: event.target.value as CourseFiltersState["level"] })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-cyan-300 focus:ring-2"
          >
            {courseLevels.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-xs font-medium text-slate-600">
          <span>Duration</span>
          <select
            value={value.duration}
            onChange={(event) => onChange({ duration: event.target.value as CourseFiltersState["duration"] })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-cyan-300 focus:ring-2"
          >
            {durationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-xs font-medium text-slate-600">
          <span>Sort By</span>
          <select
            value={value.sortBy}
            onChange={(event) => onChange({ sortBy: event.target.value as SortBy })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-cyan-300 focus:ring-2"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export default function CourseFilters(props: CourseFiltersProps) {
  return (
    <>
      <div className="hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:block">
        <FilterControls {...props} />
      </div>

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="fixed bottom-5 left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-lg md:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-900/40 md:hidden" />
          <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white p-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-xl md:hidden">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <div className="mb-4 flex items-center justify-between">
                <Dialog.Title className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
                  <Filter size={16} />
                  Course Filters
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button type="button" className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
                    <X size={16} />
                  </button>
                </Dialog.Close>
              </div>
              <FilterControls {...props} />
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
