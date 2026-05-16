import { ArrowRight, Clock3, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";

import CourseCard from "@/components/course-card";
import { getFeaturedCourses } from "@/lib/course-api";

export default async function Home() {
  const featured = await getFeaturedCourses();

  return (
    <main className="flex-1 bg-slate-50">
      <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
        <div className="rounded-3xl bg-gradient-to-br from-cyan-600 to-blue-700 p-6 text-white shadow-lg sm:p-10">
          <p className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            ENT Demo LMS
          </p>
          <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
            Learn ENT with structured, mobile-friendly medical courses.
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-cyan-50 sm:text-base">
            A clean and practical learning space designed for medical students with real clinical focus across
            rhinology, otology, emergency ENT, and exam prep.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-cyan-700"
            >
              Browse Courses
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <Users className="text-cyan-700" size={18} />
            <h2 className="mt-2 text-sm font-semibold text-slate-900">Clinical-first learning</h2>
            <p className="mt-1 text-sm text-slate-600">Case-based lessons aligned to what students actually face.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <Clock3 className="text-cyan-700" size={18} />
            <h2 className="mt-2 text-sm font-semibold text-slate-900">Short, focused modules</h2>
            <p className="mt-1 text-sm text-slate-600">Designed for busy rotations and on-call schedules.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <ShieldCheck className="text-cyan-700" size={18} />
            <h2 className="mt-2 text-sm font-semibold text-slate-900">Reliable exam prep</h2>
            <p className="mt-1 text-sm text-slate-600">High-yield pathways for viva and OSCE confidence.</p>
          </article>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Featured ENT Courses</h2>
          <Link href="/courses" className="text-sm font-semibold text-cyan-700 hover:text-cyan-600">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </main>
  );
}
