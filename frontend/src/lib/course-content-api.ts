import courseContent from "@/data/course-content.json";
import { getCourseById } from "@/lib/course-api";
import type { CourseContent, LessonContent } from "@/lib/types";

const CONTENT = courseContent as CourseContent[];

const defaultLesson = (courseId: string, title: string, summary: string): LessonContent => ({
  id: "core-lesson",
  title: `${title} Core Clinical Lesson`,
  summary,
  durationMinutes: 15,
  videoUrl: "https://www.youtube.com/embed/VHUNJZvNTmw",
  questions: [
    {
      id: "q1",
      prompt: "List two major clinical priorities from this lesson.",
      hint: "Focus on diagnosis and safety.",
      modelAnswer:
        "Key priorities include a structured diagnostic approach and an explicit safety/escalation checklist for high-risk clinical situations.",
      explanation: "Clear priorities support safer decisions and reduce omissions under pressure.",
    },
    {
      id: "q2",
      prompt: "How would you apply this lesson in your next ENT clinic or ward shift?",
      hint: "Think workflow and communication.",
      modelAnswer:
        "I would apply a stepwise checklist, document red flags consistently, and communicate escalation criteria early with the supervising team.",
      explanation: "Translation into workflow is essential for meaningful learning transfer.",
    },
    {
      id: "q3",
      prompt: "What is one common mistake learners make in this topic and how can it be prevented?",
      hint: "Consider overconfidence and poor reassessment.",
      modelAnswer:
        "A common mistake is premature closure without reassessment. Prevention includes structured re-checks against red-flag criteria before finalizing decisions.",
      explanation: "Deliberate reassessment improves diagnostic reliability in ENT cases.",
    },
  ],
});

export const getCourseContent = async (courseId: string): Promise<CourseContent | null> => {
  const existing = CONTENT.find((item) => item.courseId === courseId);
  if (existing) {
    return Promise.resolve(existing);
  }

  const course = await getCourseById(courseId);
  if (!course) {
    return Promise.resolve(null);
  }

  return Promise.resolve({
    courseId,
    lessons: [defaultLesson(courseId, course.title, course.subtitle)],
  });
};
