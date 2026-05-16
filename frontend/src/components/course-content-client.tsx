"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  CirclePlay,
  Lightbulb,
  ListChecks,
  Lock,
  MessageSquareText,
  StickyNote,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/cn";
import { getCourseContent } from "@/lib/course-content-api";
import type { Course, LessonQuestion } from "@/lib/types";

type CourseContentClientProps = {
  course: Course;
};

type StudentState = {
  drafts: Record<string, string>;
  revealedHints: Record<string, boolean>;
  revealedAnswers: Record<string, boolean>;
  completed: Record<string, boolean>;
};

const initialStudentState: StudentState = {
  drafts: {},
  revealedHints: {},
  revealedAnswers: {},
  completed: {},
};

const questionKey = (lessonId: string, questionId: string): string => `${lessonId}:${questionId}`;

export default function CourseContentClient({ course }: CourseContentClientProps) {
  const storageKey = `course-content:${course.id}`;
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [studentState, setStudentState] = useState<StudentState>(() => {
    if (typeof window === "undefined") {
      return initialStudentState;
    }

    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      return initialStudentState;
    }

    try {
      return {
        ...initialStudentState,
        ...(JSON.parse(stored) as StudentState),
      };
    } catch {
      window.localStorage.removeItem(storageKey);
      return initialStudentState;
    }
  });

  const query = useQuery({
    queryKey: ["course-content", course.id],
    queryFn: () => getCourseContent(course.id),
  });

  const lessons = useMemo(() => query.data?.lessons ?? [], [query.data]);
  const currentLessonId = useMemo(() => {
    if (!lessons.length) {
      return null;
    }

    if (activeLessonId && lessons.some((lesson) => lesson.id === activeLessonId)) {
      return activeLessonId;
    }

    return lessons[0].id;
  }, [activeLessonId, lessons]);

  const activeLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === currentLessonId) ?? lessons[0],
    [currentLessonId, lessons],
  );

  const activeQuestion = useMemo(() => {
    if (!activeLesson) {
      return null;
    }

    if (activeQuestionId && activeLesson.questions.some((question) => question.id === activeQuestionId)) {
      return activeLesson.questions.find((question) => question.id === activeQuestionId) ?? activeLesson.questions[0];
    }

    return activeLesson.questions[0];
  }, [activeLesson, activeQuestionId]);

  const totalQuestions = useMemo(
    () => lessons.reduce((sum, lesson) => sum + lesson.questions.length, 0),
    [lessons],
  );
  const completedCount = useMemo(
    () => Object.values(studentState.completed).filter(Boolean).length,
    [studentState.completed],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(studentState));
  }, [storageKey, studentState]);

  const updateDraft = (lessonId: string, questionId: string, value: string) => {
    const key = questionKey(lessonId, questionId);
    setStudentState((prev) => ({
      ...prev,
      drafts: {
        ...prev.drafts,
        [key]: value,
      },
    }));
  };

  const toggleHint = (lessonId: string, questionId: string) => {
    const key = questionKey(lessonId, questionId);
    setStudentState((prev) => ({
      ...prev,
      revealedHints: {
        ...prev.revealedHints,
        [key]: !prev.revealedHints[key],
      },
    }));
  };

  const toggleAnswer = (lessonId: string, questionId: string) => {
    const key = questionKey(lessonId, questionId);
    setStudentState((prev) => ({
      ...prev,
      revealedAnswers: {
        ...prev.revealedAnswers,
        [key]: !prev.revealedAnswers[key],
      },
    }));
  };

  const toggleComplete = (lessonId: string, questionId: string) => {
    const key = questionKey(lessonId, questionId);
    const next = !studentState.completed[key];
    setStudentState((prev) => ({
      ...prev,
      completed: {
        ...prev.completed,
        [key]: next,
      },
    }));

    toast.success(next ? "Question marked complete" : "Question marked incomplete");
  };

  const canRevealAnswer = (lessonId: string, question: LessonQuestion): boolean => {
    const key = questionKey(lessonId, question.id);
    const draft = studentState.drafts[key]?.trim() ?? "";
    return draft.length >= 20 || studentState.revealedHints[key];
  };

  if (query.isLoading) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="h-80 w-full animate-pulse rounded-2xl border border-slate-200 bg-white" />
      </main>
    );
  }

  if (!query.data || !activeLesson || !activeQuestion) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
        <h1 className="text-xl font-semibold text-slate-900">Content unavailable</h1>
        <p className="mt-2 text-sm text-slate-600">This course does not have lesson content yet.</p>
        <Link
          href={`/courses/${course.id}`}
          className="mt-4 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Back to course details
        </Link>
      </main>
    );
  }

  const activeKey = questionKey(activeLesson.id, activeQuestion.id);
  const progressPct = totalQuestions === 0 ? 0 : Math.round((completedCount / totalQuestions) * 100);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-cyan-700">Learning session</p>
          <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
          {completedCount} / {totalQuestions} questions completed
        </div>
      </div>

      <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-700">
          <span className="inline-flex items-center gap-2">
            <ListChecks size={16} />
            Lesson progress
          </span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full bg-cyan-600 transition-all" style={{ width: `${progressPct}%` }} />
        </div>
      </section>

      <div className="sticky top-16 z-20 mb-3 rounded-xl border border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => document.getElementById("lesson-video")?.scrollIntoView({ behavior: "smooth" })}
          className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700"
        >
          <CirclePlay size={16} />
          Jump to video
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">Lessons</h2>
            {lessons.map((lesson, lessonIndex) => (
              <div key={lesson.id} className="space-y-2 rounded-xl border border-slate-200 p-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveLessonId(lesson.id);
                    setActiveQuestionId(lesson.questions[0]?.id ?? null);
                  }}
                  className={cn(
                    "w-full text-left text-sm font-medium",
                    activeLesson.id === lesson.id ? "text-cyan-700" : "text-slate-800",
                  )}
                >
                  Lesson {lessonIndex + 1}: {lesson.title}
                </button>
                <div className="space-y-1">
                  {lesson.questions.map((question, questionIndex) => {
                    const key = questionKey(lesson.id, question.id);
                    const isActive = activeLesson.id === lesson.id && activeQuestion.id === question.id;
                    const isComplete = Boolean(studentState.completed[key]);

                    return (
                      <button
                        key={question.id}
                        type="button"
                        onClick={() => {
                          setActiveLessonId(lesson.id);
                          setActiveQuestionId(question.id);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs",
                          isActive ? "bg-cyan-50 text-cyan-700" : "text-slate-600 hover:bg-slate-50",
                        )}
                      >
                        <span>Q{questionIndex + 1}</span>
                        {isComplete ? <CheckCircle2 size={14} className="text-emerald-600" /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="space-y-4">
          <article id="lesson-video" className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-cyan-700">Now playing</p>
              <h2 className="text-lg font-bold text-slate-900">{activeLesson.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{activeLesson.summary}</p>
            </div>
            <div className="aspect-video w-full bg-slate-950">
              <iframe
                src={activeLesson.videoUrl}
                title={activeLesson.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </article>

          <div className="space-y-3 lg:hidden">
            {activeLesson.questions.map((question, index) => {
              const key = questionKey(activeLesson.id, question.id);

              return (
                <div key={question.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">Question {index + 1}</p>
                  </div>
                  <div className="px-4 py-4">
                    <QuestionWorkspace
                      question={question}
                      lessonId={activeLesson.id}
                      studentState={studentState}
                      onDraftChange={updateDraft}
                      onHintReveal={toggleHint}
                      onAnswerReveal={toggleAnswer}
                      onCompleteToggle={toggleComplete}
                      canRevealAnswer={canRevealAnswer(activeLesson.id, question)}
                    />
                    {studentState.completed[key] ? (
                      <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <CheckCircle2 size={14} />
                        Completed
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block">
            <motion.div
              key={activeKey}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  Active question: Q
                  {activeLesson.questions.findIndex((question) => question.id === activeQuestion.id) + 1}
                </h3>
                <span className="text-xs text-slate-500">{activeLesson.durationMinutes} min lesson</span>
              </div>

              <QuestionWorkspace
                question={activeQuestion}
                lessonId={activeLesson.id}
                studentState={studentState}
                onDraftChange={updateDraft}
                onHintReveal={toggleHint}
                onAnswerReveal={toggleAnswer}
                onCompleteToggle={toggleComplete}
                canRevealAnswer={canRevealAnswer(activeLesson.id, activeQuestion)}
              />
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}

type QuestionWorkspaceProps = {
  lessonId: string;
  question: LessonQuestion;
  studentState: StudentState;
  canRevealAnswer: boolean;
  onDraftChange: (lessonId: string, questionId: string, value: string) => void;
  onHintReveal: (lessonId: string, questionId: string) => void;
  onAnswerReveal: (lessonId: string, questionId: string) => void;
  onCompleteToggle: (lessonId: string, questionId: string) => void;
};

function QuestionWorkspace({
  lessonId,
  question,
  studentState,
  canRevealAnswer,
  onDraftChange,
  onHintReveal,
  onAnswerReveal,
  onCompleteToggle,
}: QuestionWorkspaceProps) {
  const key = questionKey(lessonId, question.id);
  const answer = studentState.drafts[key] ?? "";
  const hintOpen = Boolean(studentState.revealedHints[key]);
  const modelOpen = Boolean(studentState.revealedAnswers[key]);
  const complete = Boolean(studentState.completed[key]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">{question.prompt}</p>
      </div>

      <label className="block space-y-2">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
          <StickyNote size={16} />
          Your answer
        </span>
        <textarea
          value={answer}
          onChange={(event) => onDraftChange(lessonId, question.id, event.target.value)}
          placeholder="Type your clinical reasoning here..."
          className="min-h-32 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none ring-cyan-300 focus:ring-2"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onHintReveal(lessonId, question.id)}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
            hintOpen
              ? "border border-amber-500 bg-amber-50 text-amber-900"
              : "border border-slate-200 text-slate-700 hover:bg-slate-50",
          )}
        >
          <Lightbulb size={15} />
          {hintOpen ? "Hide hint" : "Show hint"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (!modelOpen && !canRevealAnswer) {
              toast.info("Write at least 20 characters or open hint first.");
              return;
            }
            onAnswerReveal(lessonId, question.id);
          }}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
            modelOpen
              ? "border border-cyan-600 bg-cyan-50 text-cyan-800"
              : canRevealAnswer
                ? "border border-cyan-600 text-cyan-700 hover:bg-cyan-50"
                : "cursor-not-allowed border border-slate-200 text-slate-400",
          )}
        >
          {canRevealAnswer || modelOpen ? <MessageSquareText size={15} /> : <Lock size={15} />}
          {modelOpen ? "Hide model answer" : "Show model answer"}
        </button>
        <button
          type="button"
          onClick={() => onCompleteToggle(lessonId, question.id)}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold",
            complete ? "bg-emerald-600 text-white" : "bg-slate-900 text-white",
          )}
        >
          <CheckCircle2 size={15} />
          {complete ? "Completed" : "Mark complete"}
        </button>
      </div>

      {hintOpen ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <p className="font-semibold">Hint</p>
          <p className="mt-1">{question.hint}</p>
        </div>
      ) : null}

      {modelOpen ? (
        <div className="space-y-3 rounded-xl border border-cyan-200 bg-cyan-50 p-3">
          <p className="font-semibold text-cyan-900">Compare your response with model answer</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-white p-3 text-sm text-slate-700">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Your answer</p>
              <p>{answer.trim().length > 0 ? answer : "No answer written yet."}</p>
            </div>
            <div className="rounded-lg bg-white p-3 text-sm text-slate-700">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Model answer</p>
              <p>{question.modelAnswer}</p>
            </div>
          </div>
          <div className="rounded-lg bg-white p-3 text-sm text-slate-700">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Explanation</p>
            <p>{question.explanation}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
