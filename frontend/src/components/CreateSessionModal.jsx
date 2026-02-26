import { Code2Icon, LoaderIcon, PlusIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";

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
          {/* PROBLEM SELECTION */}
          <div className="space-y-2">
            <label className="flex items-center justify-between">
              <span className={isDark ? "font-semibold text-slate-200" : "font-semibold text-slate-700"}>
                Select Problem
              </span>
              <span className="text-rose-500">*</span>
            </label>

            <select
              className={
                isDark
                  ? "w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100"
                  : "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900"
              }
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedProblem = problems.find((p) => p.title === e.target.value);
                setRoomConfig({
                  difficulty: selectedProblem.difficulty,
                  problem: e.target.value,
                });
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
                  Max Participants: <span className="font-medium">2 (1-on-1 session)</span>
                </p>
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