"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import CourseCard from "@/components/course-card";
import CourseFilters from "@/components/course-filters";
import CoursePagination from "@/components/course-pagination";
import { getCourses, type CourseFilters as CourseFiltersType } from "@/lib/course-api";

const PAGE_SIZE = 6;

export default function CoursesPage() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [filters, setFilters] = useState<CourseFiltersType>({
    search: "",
    category: "All",
    level: "All",
    duration: "All",
    sortBy: "popularity",
    page: 1,
    pageSize: PAGE_SIZE,
  });

  const queryKey = useMemo(() => ["courses", filters], [filters]);
  const query = useQuery({
    queryKey,
    queryFn: () => getCourses(filters),
  });

  const handleFilterChange = (next: Partial<Omit<CourseFiltersType, "pageSize">>) => {
    setFilters((prev) => ({
      ...prev,
      ...next,
      page: next.page ?? 1,
    }));
  };

  const toggleWishlist = (courseId: string) => {
    setWishlist((prev) => (prev.includes(courseId) ? prev.filter((item) => item !== courseId) : [...prev, courseId]));
  };

  return (
    <main className="flex-1 bg-slate-50 pb-20">
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">ENT Course Catalog</h1>
          <p className="text-sm text-slate-600 sm:text-base">
            Explore 12 focused courses built for medical students and early-career ENT trainees.
          </p>
        </div>

        <div className="space-y-4">
          <CourseFilters value={filters} onChange={handleFilterChange} />

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <span>
              Showing {query.data?.items.length ?? 0} of {query.data?.totalItems ?? 0} courses
            </span>
            <span className="hidden sm:inline">Wishlist: {wishlist.length}</span>
          </div>

          {query.isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <div key={index} className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />
              ))}
            </div>
          ) : null}

          {query.data ? (
            <>
              <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {query.data.items.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    wished={wishlist.includes(course.id)}
                    onWishlistToggle={toggleWishlist}
                  />
                ))}
              </motion.div>

              {query.data.items.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
                  No courses match your filters. Try removing a filter or using a broader search.
                </p>
              ) : null}

              <CoursePagination
                page={query.data.page}
                totalPages={query.data.totalPages}
                onPageChange={(next) => handleFilterChange({ page: next })}
              />
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}
