import { useMemo, useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";

import { PROBLEMS } from "../data/problems";
import { useGenerateProblem } from "../hooks/useSessions";
import {
  BookOpenIcon,
  ChevronRightIcon,
  Code2Icon,
  LayersIcon,
  SparklesIcon,
  TargetIcon,
} from "lucide-react";

const GENERATED_PROBLEMS_KEY = "generatedProblems";

const getStoredGeneratedProblems = () => {
  try {
    const raw = localStorage.getItem(GENERATED_PROBLEMS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item) => item?.id && item?.title && item?.description?.text);
  } catch {
    return [];
  }
};

const getDifficultyBadgeClass = (difficulty, isDark) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return isDark
        ? "border border-emerald-400/30 bg-emerald-500/15 text-emerald-300"
        : "border border-emerald-300 bg-emerald-100 text-emerald-700";
    case "medium":
      return isDark
        ? "border border-amber-400/30 bg-amber-500/15 text-amber-300"
        : "border border-amber-300 bg-amber-100 text-amber-700";
    case "hard":
      return isDark
        ? "border border-rose-400/30 bg-rose-500/15 text-rose-300"
        : "border border-rose-300 bg-rose-100 text-rose-700";
    default:
      return isDark
        ? "border border-slate-600 bg-slate-800 text-slate-300"
        : "border border-slate-300 bg-slate-100 text-slate-700";
  }
};

function ProblemsPage({ isDark, setIsDark }) {
  const [topic, setTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Medium");
  const [generatedProblems, setGeneratedProblems] = useState(() => getStoredGeneratedProblems());
  const { mutateAsync: generateProblem, isPending: isGenerating } = useGenerateProblem();

  const problems = useMemo(
    () => [...generatedProblems, ...Object.values(PROBLEMS)],
    [generatedProblems]
  );

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  const handleGenerate = async () => {
    if (!topic.trim() || isGenerating) return;

    const response = await generateProblem({
      topic: topic.trim(),
      difficulty: selectedDifficulty,
    });

    const generatedProblem = response?.problem;
    if (!generatedProblem) return;

    const newProblem = {
      ...generatedProblem,
      id: `ai-${Date.now()}`,
    };

    const nextGeneratedProblems = [newProblem, ...generatedProblems].slice(0, 30);
    setGeneratedProblems(nextGeneratedProblems);
    localStorage.setItem(GENERATED_PROBLEMS_KEY, JSON.stringify(nextGeneratedProblems));
    setTopic("");
  };

  return (
    <div className={isDark ? "min-h-screen bg-slate-950 text-slate-100" : "min-h-screen bg-slate-100 text-slate-900"}>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className={isDark ? "absolute -top-44 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" : "absolute -top-44 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-300/40 blur-3xl"} />
        <div className={isDark ? "absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" : "absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl"} />
      </div>

      <Navbar isDark={isDark} setIsDark={setIsDark} />

      <main className="mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <section className={isDark ? "mb-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-6" : "mb-6 rounded-2xl border border-slate-300 bg-white p-5 sm:p-6"}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className={isDark ? "mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-200" : "mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-300 bg-indigo-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-700"}>
                <SparklesIcon className="size-3.5" />
                Curated Coding Set
              </div>
              <h1 className={isDark ? "text-2xl font-black text-white sm:text-3xl lg:text-4xl" : "text-2xl font-black text-slate-900 sm:text-3xl lg:text-4xl"}>
                Practice Problems
              </h1>
              <p className={isDark ? "mt-1 text-sm text-slate-300 sm:text-base" : "mt-1 text-sm text-slate-600 sm:text-base"}>
                Sharpen your coding skills with interview-ready challenges.
              </p>
            </div>

            <div className={isDark ? "inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-300" : "inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700"}>
              <TargetIcon className={isDark ? "size-4 text-indigo-300" : "size-4 text-indigo-600"} />
              Solve consistently, improve faster.
            </div>
          </div>

          <div className={isDark ? "mt-5 rounded-xl border border-white/10 bg-slate-900/60 p-3 sm:p-4" : "mt-5 rounded-xl border border-slate-300 bg-slate-50 p-3 sm:p-4"}>
            <p className={isDark ? "mb-2 text-sm font-semibold text-slate-200" : "mb-2 text-sm font-semibold text-slate-800"}>Generate a new AI problem</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:gap-3">
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Type a topic (e.g. Graph shortest path)"
                className={isDark ? "sm:col-span-7 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none" : "sm:col-span-7 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"}
              />

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className={isDark ? "sm:col-span-2 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-400 focus:outline-none" : "sm:col-span-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
                className={isDark ? "sm:col-span-3 rounded-lg border border-indigo-400/40 bg-indigo-500/20 px-3 py-2 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50" : "sm:col-span-3 rounded-lg border border-indigo-300 bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-200 disabled:cursor-not-allowed disabled:opacity-50"}
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </section>

        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className={isDark ? "rounded-xl border border-white/10 bg-white/5 p-4" : "rounded-xl border border-slate-300 bg-white p-4"}>
            <div className="mb-2 flex items-center gap-2">
              <BookOpenIcon className={isDark ? "size-4 text-indigo-300" : "size-4 text-indigo-600"} />
              <p className={isDark ? "text-xs text-slate-400" : "text-xs text-slate-600"}>Total</p>
            </div>
            <p className={isDark ? "text-2xl font-bold text-indigo-300" : "text-2xl font-bold text-indigo-600"}>{problems.length}</p>
          </div>

          <div className={isDark ? "rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4" : "rounded-xl border border-emerald-300 bg-emerald-50 p-4"}>
            <div className="mb-2 flex items-center gap-2">
              <LayersIcon className={isDark ? "size-4 text-emerald-300" : "size-4 text-emerald-600"} />
              <p className={isDark ? "text-xs text-emerald-200" : "text-xs text-emerald-700"}>Easy</p>
            </div>
            <p className={isDark ? "text-2xl font-bold text-emerald-300" : "text-2xl font-bold text-emerald-600"}>{easyProblemsCount}</p>
          </div>

          <div className={isDark ? "rounded-xl border border-amber-400/30 bg-amber-500/10 p-4" : "rounded-xl border border-amber-300 bg-amber-50 p-4"}>
            <div className="mb-2 flex items-center gap-2">
              <LayersIcon className={isDark ? "size-4 text-amber-300" : "size-4 text-amber-600"} />
              <p className={isDark ? "text-xs text-amber-200" : "text-xs text-amber-700"}>Medium</p>
            </div>
            <p className={isDark ? "text-2xl font-bold text-amber-300" : "text-2xl font-bold text-amber-600"}>{mediumProblemsCount}</p>
          </div>

          <div className={isDark ? "rounded-xl border border-rose-400/30 bg-rose-500/10 p-4" : "rounded-xl border border-rose-300 bg-rose-50 p-4"}>
            <div className="mb-2 flex items-center gap-2">
              <LayersIcon className={isDark ? "size-4 text-rose-300" : "size-4 text-rose-600"} />
              <p className={isDark ? "text-xs text-rose-200" : "text-xs text-rose-700"}>Hard</p>
            </div>
            <p className={isDark ? "text-2xl font-bold text-rose-300" : "text-2xl font-bold text-rose-600"}>{hardProblemsCount}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className={
                isDark
                  ? "group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300/40"
                  : "group flex h-full flex-col rounded-2xl border border-slate-300 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-400"
              }
            >
              <div className="mb-4 flex items-start gap-3">
                <div className={isDark ? "flex size-10 shrink-0 items-center justify-center rounded-lg border border-indigo-400/30 bg-indigo-500/10 text-indigo-300" : "flex size-10 shrink-0 items-center justify-center rounded-lg border border-indigo-300 bg-indigo-100 text-indigo-600"}>
                  <Code2Icon className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h2 className={isDark ? "text-base font-bold text-white sm:text-lg" : "text-base font-bold text-slate-900 sm:text-lg"}>{problem.title}</h2>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getDifficultyBadgeClass(
                        problem.difficulty,
                        isDark
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                  <p className={isDark ? "text-xs text-slate-400 sm:text-sm" : "text-xs text-slate-600 sm:text-sm"}>{problem.category}</p>
                </div>
              </div>

              <p className={isDark ? "mb-5 text-sm leading-6 text-slate-300" : "mb-5 text-sm leading-6 text-slate-700"}>{problem.description.text}</p>

              <div className="mt-auto flex items-center justify-between">
                <span className={isDark ? "text-xs text-slate-400" : "text-xs text-slate-500"}>Open challenge</span>
                <div className={isDark ? "inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-300" : "inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600"}>
                  Solve
                  <ChevronRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className={isDark ? "mt-6 rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-600/10 via-violet-600/10 to-cyan-600/10 p-4 text-center sm:p-5" : "mt-6 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-100 via-violet-100 to-cyan-100 p-4 text-center sm:p-5"}>
          <p className={isDark ? "text-sm text-slate-200 sm:text-base" : "text-sm text-slate-700 sm:text-base"}>
            Pick a problem that matches your level and practice consistently.
          </p>
        </section>
      </main>
    </div>
  );
}
export default ProblemsPage;