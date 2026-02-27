import { Code2Icon, LoaderIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";
import { PROBLEMS } from "../data/problems";
import { useGenerateProblem } from "../hooks/useSessions";

function CreateSessionModal({
  isDark,
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);
  const [topic, setTopic] = useState("");
  const generateProblemMutation = useGenerateProblem();

  const handleGenerate = () => {
    if (!topic.trim()) return;

    generateProblemMutation.mutate(
      { topic: topic.trim(), difficulty: roomConfig.difficulty || "Medium" },
      {
        onSuccess: (data) => {
          const generatedProblem = data?.problem;
          if (!generatedProblem) return;

          setRoomConfig({
            problem: generatedProblem.title,
            difficulty: generatedProblem.difficulty,
            customProblem: generatedProblem,
          });
        },
      }
    );
  };

  const handleSelectProblem = (problemTitle) => {
    const selectedProblem = problems.find((problem) => problem.title === problemTitle);
    setRoomConfig({
      problem: problemTitle,
      difficulty: selectedProblem?.difficulty || roomConfig.difficulty,
      customProblem: null,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className={
          isDark
            ? "absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            : "absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        }
        onClick={onClose}
      />
      <div
        className={
          isDark
            ? "relative z-10 w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-[0_20px_60px_-25px_rgba(79,70,229,0.45)] backdrop-blur-sm"
            : "relative z-10 w-full max-w-2xl rounded-2xl border border-slate-300 bg-white/95 p-6 shadow-xl backdrop-blur-sm"
        }
      >
        <h3 className={isDark ? "mb-6 text-2xl font-bold text-white" : "mb-6 text-2xl font-bold text-slate-900"}>
          Create New Session
        </h3>

        <div className="space-y-8">
          <div className={isDark ? "rounded-xl border border-indigo-400/30 bg-indigo-500/10 p-4" : "rounded-xl border border-indigo-300 bg-indigo-50 p-4"}>
            <label className={isDark ? "mb-2 block text-sm font-semibold text-indigo-200" : "mb-2 block text-sm font-semibold text-indigo-700"}>
              Generate with AI by typing a topic/name
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Sliding Window Maximum"
                className={isDark ? "w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500" : "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500"}
              />
              <button
                onClick={handleGenerate}
                disabled={generateProblemMutation.isPending || !topic.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-500 bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {generateProblemMutation.isPending ? <LoaderIcon className="size-4 animate-spin" /> : <SparklesIcon className="size-4" />}
                {generateProblemMutation.isPending ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>

          {/* PROBLEM SELECTION */}
          <div className="space-y-2">
            <label className="flex items-center justify-between">
              <span className={isDark ? "font-semibold text-slate-200" : "font-semibold text-slate-700"}>
                Select Existing Problem
              </span>
              <span className={isDark ? "text-xs text-slate-400" : "text-xs text-slate-500"}>Optional</span>
            </label>

            <select
              className={
                isDark
                  ? "w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100"
                  : "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900"
              }
              value={roomConfig.problem}
              onChange={(e) => {
                handleSelectProblem(e.target.value);
              }}
            >
              <option value="" disabled>
                Choose a coding problem...
              </option>

              {problems.map((problem) => (
                <option key={problem.id} value={problem.title}>
                  {problem.title} ({problem.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div
              className={
                isDark
                  ? "rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-200"
                  : "rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-700"
              }
            >
              <Code2Icon className="mb-2 size-5" />
              <div>
                <p className="font-semibold">Room Summary:</p>
                <p>
                  Problem: <span className="font-medium">{roomConfig.problem}</span>
                </p>
                <p>
                  Difficulty: <span className="font-medium">{roomConfig.difficulty || "Medium"}</span>
                </p>
                <p>
                  Max Participants: <span className="font-medium">2 (1-on-1 session)</span>
                </p>
                {roomConfig.customProblem && (
                  <p className="mt-1 text-xs font-medium">AI generated problem selected</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            className={
              isDark
                ? "rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                : "rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            }
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-500 bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:-translate-y-0.5 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-5" />
            )}

            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default CreateSessionModal;