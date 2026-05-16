"use client";

import { cn } from "@/lib/cn";

type CoursePaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (next: number) => void;
};

const windowedPages = (page: number, totalPages: number): number[] => {
  const pages = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  return [...pages].filter((item) => item >= 1 && item <= totalPages).sort((a, b) => a - b);
};

export default function CoursePagination({ page, totalPages, onPageChange }: CoursePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = windowedPages(page, totalPages);

  return (
    <nav className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>

      {pages.map((item) => (
        <button
          type="button"
          key={item}
          onClick={() => onPageChange(item)}
          className={cn(
            "h-9 min-w-9 rounded-lg border px-3 text-sm font-medium",
            page === item
              ? "border-cyan-600 bg-cyan-600 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
          )}
        >
          {item}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}
