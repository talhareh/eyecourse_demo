import Link from "next/link";
import { notFound } from "next/navigation";

import CourseContentClient from "@/components/course-content-client";
import { getCourseById } from "@/lib/course-api";

type CourseContentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CourseContentPage({ params }: CourseContentPageProps) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course) {
    notFound();
  }

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 pt-5 sm:px-6">
        <Link href={`/courses/${course.id}`} className="text-sm font-semibold text-cyan-700 hover:text-cyan-600">
          ← Back to course detail
        </Link>
      </div>
      <CourseContentClient course={course} />
    </>
  );
}
