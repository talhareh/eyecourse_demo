import { Clock3, GraduationCap, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import CourseCard from "@/components/course-card";
import { formatLearners } from "@/lib/format";
import { getCourseById, getRelatedCourses } from "@/lib/course-api";

type CourseDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course) {
    notFound();
  }

  const related = await getRelatedCourses(course);

  return (
    <main className="flex-1 bg-slate-50 pb-16">
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-56 w-full sm:h-72">
            <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-5 text-white sm:p-7">
              <p className="text-xs font-medium uppercase tracking-wide text-cyan-200">{course.category}</p>
              <h1 className="mt-2 max-w-3xl text-2xl font-bold leading-tight sm:text-4xl">{course.title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-100 sm:text-base">{course.subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-slate-100 px-5 py-4 text-sm text-slate-700 sm:grid-cols-4 sm:px-7">
            <div className="inline-flex items-center gap-2">
              <Star size={16} className="text-amber-500" />
              {course.rating} rating
            </div>
            <div className="inline-flex items-center gap-2">
              <Users size={16} />
              {formatLearners(course.learners)} learners
            </div>
            <div className="inline-flex items-center gap-2">
              <Clock3 size={16} />
              {course.durationHours}h total
            </div>
            <div className="inline-flex items-center gap-2">
              <GraduationCap size={16} />
              {course.level}
            </div>
          </div>

          <div className="grid gap-7 px-5 py-6 sm:px-7 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-7">
              <article>
                <h2 className="text-lg font-bold text-slate-900">About this course</h2>
                <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">{course.description}</p>
              </article>

              <article>
                <h2 className="text-lg font-bold text-slate-900">What you&apos;ll learn</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-700 sm:text-base">
                  {course.outcomes.map((item) => (
                    <li key={item} className="rounded-xl bg-cyan-50 px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>

              <article>
                <h2 className="text-lg font-bold text-slate-900">Curriculum preview</h2>
                <ul className="mt-3 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {course.curriculum.map((lesson) => (
                    <li key={lesson.title} className="flex items-center justify-between px-4 py-3 text-sm text-slate-700">
                      <span>{lesson.title}</span>
                      <span>{lesson.minutes} min</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article>
                <h2 className="text-lg font-bold text-slate-900">Instructor</h2>
                <p className="mt-2 text-sm text-slate-700 sm:text-base">
                  <span className="font-semibold">{course.instructor}</span> - {course.instructorBio}
                </p>
              </article>

              <article>
                <h2 className="text-lg font-bold text-slate-900">Student reviews</h2>
                <div className="mt-3 space-y-3">
                  {course.reviews.map((review) => (
                    <div key={review.name} className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900">{review.name}</p>
                        <p className="text-xs text-amber-600">{review.rating} / 5</p>
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-2xl font-bold text-slate-900">${course.price}</p>
              <p className="mt-1 text-sm text-slate-500">One-time access</p>
              <button
                type="button"
                className="mt-4 w-full rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-500"
              >
                Enroll Now
              </button>
              <Link
                href={`/courses/${course.id}/content`}
                className="mt-3 block w-full rounded-xl bg-cyan-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-cyan-500"
              >
                Start learning
              </Link>
              <Link
                href="/courses"
                className="mt-3 block w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Back to catalog
              </Link>
              <div className="mt-5 space-y-2 text-sm text-slate-600">
                {course.requirements.map((requirement) => (
                  <p key={requirement}>- {requirement}</p>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mb-4 mt-2 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Related courses</h2>
          <Link href="/courses" className="text-sm font-semibold text-cyan-700">
            Browse all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <CourseCard key={item.id} course={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
