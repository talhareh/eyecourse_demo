"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Clock3, Heart, Star, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { formatLearners } from "@/lib/format";
import type { Course } from "@/lib/types";

type CourseCardProps = {
  course: Course;
  wished?: boolean;
  onWishlistToggle?: (courseId: string) => void;
};

export default function CourseCard({ course, wished = false, onWishlistToggle }: CourseCardProps) {
  const handleWish = () => {
    if (!onWishlistToggle) {
      return;
    }

    onWishlistToggle(course.id);
    toast.success(wished ? "Removed from wishlist" : "Added to wishlist", {
      description: course.title,
    });
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="relative h-44 w-full sm:h-48">
        <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-cyan-700">{course.category}</p>
            <h3 className="line-clamp-2 text-base font-semibold text-slate-900">{course.title}</h3>
          </div>
          {onWishlistToggle ? (
            <button
              type="button"
              onClick={handleWish}
              className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-rose-200 hover:text-rose-500"
              aria-label="toggle wishlist"
            >
              <Heart className={wished ? "fill-rose-500 text-rose-500" : ""} size={16} />
            </button>
          ) : null}
        </div>

        <p className="line-clamp-2 text-sm text-slate-600">{course.subtitle}</p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            <Star size={14} className="text-amber-500" />
            {course.rating}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users size={14} />
            {formatLearners(course.learners)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 size={14} />
            {course.durationHours}h
          </span>
          <span>{course.level}</span>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <p className="text-lg font-bold text-slate-900">${course.price}</p>
          <div className="flex items-center gap-2">
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Quick View
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/45" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-5 shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <Dialog.Title className="text-lg font-semibold text-slate-900">{course.title}</Dialog.Title>
                    <Dialog.Close asChild>
                      <button type="button" className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100">
                        <X size={16} />
                      </button>
                    </Dialog.Close>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{course.description}</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-700">
                    {course.outcomes.slice(0, 3).map((outcome) => (
                      <li key={outcome} className="rounded-lg bg-cyan-50 px-3 py-2">
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            <Link
              href={`/courses/${course.id}`}
              className="rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-500"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
