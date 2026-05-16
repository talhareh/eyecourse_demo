import courses from "@/data/courses.json";
import type { Course, CourseCategory, CourseLevel } from "@/lib/types";

export type SortBy = "popularity" | "rating" | "newest";

export type CourseFilters = {
  search: string;
  category: CourseCategory | "All";
  level: CourseLevel | "All";
  duration: "All" | "Short" | "Medium" | "Long";
  sortBy: SortBy;
  page: number;
  pageSize: number;
};

export type PaginatedCourses = {
  items: Course[];
  totalItems: number;
  totalPages: number;
  page: number;
};

const ALL_COURSES = courses as Course[];

const bySort = (a: Course, b: Course, sortBy: SortBy): number => {
  if (sortBy === "rating") {
    return b.rating - a.rating;
  }

  if (sortBy === "newest") {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  }

  return b.learners - a.learners;
};

const matchesDuration = (course: Course, duration: CourseFilters["duration"]): boolean => {
  if (duration === "All") {
    return true;
  }

  if (duration === "Short") {
    return course.durationHours <= 4;
  }

  if (duration === "Medium") {
    return course.durationHours >= 5 && course.durationHours <= 6;
  }

  return course.durationHours >= 7;
};

export const getFeaturedCourses = async (): Promise<Course[]> => {
  const featured = [...ALL_COURSES].sort((a, b) => b.rating - a.rating).slice(0, 4);
  return Promise.resolve(featured);
};

export const getCourses = async (filters: CourseFilters): Promise<PaginatedCourses> => {
  const normalizedSearch = filters.search.trim().toLowerCase();
  const filtered = ALL_COURSES.filter((course) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      course.title.toLowerCase().includes(normalizedSearch) ||
      course.subtitle.toLowerCase().includes(normalizedSearch) ||
      course.instructor.toLowerCase().includes(normalizedSearch);

    const matchesCategory = filters.category === "All" || course.category === filters.category;
    const matchesLevel = filters.level === "All" || course.level === filters.level;

    return matchesSearch && matchesCategory && matchesLevel && matchesDuration(course, filters.duration);
  }).sort((a, b) => bySort(a, b, filters.sortBy));

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / filters.pageSize));
  const page = Math.min(Math.max(filters.page, 1), totalPages);
  const start = (page - 1) * filters.pageSize;
  const end = start + filters.pageSize;

  return Promise.resolve({
    items: filtered.slice(start, end),
    totalItems,
    totalPages,
    page,
  });
};

export const getCourseById = async (id: string): Promise<Course | null> => {
  const course = ALL_COURSES.find((item) => item.id === id);
  return Promise.resolve(course ?? null);
};

export const getRelatedCourses = async (course: Course): Promise<Course[]> => {
  const related = course.relatedCourseIds
    .map((id) => ALL_COURSES.find((item) => item.id === id))
    .filter((item): item is Course => Boolean(item));

  return Promise.resolve(related);
};

export const courseCategories = ["All", ...new Set(ALL_COURSES.map((course) => course.category))] as const;

export const courseLevels = ["All", "Beginner", "Intermediate", "Advanced"] as const;

export const durationOptions = ["All", "Short", "Medium", "Long"] as const;
