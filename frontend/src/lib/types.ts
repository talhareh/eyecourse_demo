export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type CourseCategory =
  | "Rhinology"
  | "Otology"
  | "Neurotology"
  | "Laryngology"
  | "Emergency ENT"
  | "Sleep ENT"
  | "Head & Neck"
  | "Exam Prep";

export type CourseReview = {
  name: string;
  rating: number;
  comment: string;
};

export type CurriculumItem = {
  title: string;
  minutes: number;
};

export type Course = {
  id: string;
  title: string;
  subtitle: string;
  category: CourseCategory;
  level: CourseLevel;
  durationHours: number;
  rating: number;
  learners: number;
  price: number;
  instructor: string;
  thumbnail: string;
  updatedAt: string;
  description: string;
  outcomes: string[];
  requirements: string[];
  curriculum: CurriculumItem[];
  instructorBio: string;
  reviews: CourseReview[];
  relatedCourseIds: string[];
};

export type LessonQuestion = {
  id: string;
  prompt: string;
  hint: string;
  modelAnswer: string;
  explanation: string;
};

export type LessonContent = {
  id: string;
  title: string;
  summary: string;
  durationMinutes: number;
  videoUrl: string;
  questions: LessonQuestion[];
};

export type CourseContent = {
  courseId: string;
  lessons: LessonContent[];
};
