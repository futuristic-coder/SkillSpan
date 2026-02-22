import { getDifficultyBadgeClass } from "../config/utils";

const getDifficultyThemeClass = (difficulty, isDark) => {
  const baseClasses = "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold";
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return isDark
        ? `${baseClasses} border border-emerald-400/30 bg-emerald-500/15 text-emerald-300`
        : `${baseClasses} border border-emerald-300 bg-emerald-100 text-emerald-700`;
    case "medium":
      return isDark
        ? `${baseClasses} border border-amber-400/30 bg-amber-500/15 text-amber-300`
        : `${baseClasses} border border-amber-300 bg-amber-100 text-amber-700`;
    case "hard":
      return isDark
        ? `${baseClasses} border border-rose-400/30 bg-rose-500/15 text-rose-300`
        : `${baseClasses} border border-rose-300 bg-rose-100 text-rose-700`;
    default:
      return isDark
        ? `${baseClasses} border border-slate-600 bg-slate-800 text-slate-300`
        : `${baseClasses} border border-slate-300 bg-slate-100 text-slate-700`;
  }
};

function ProblemDescription({ isDark, problem, currentProblemId, onProblemChange, allProblems }) {
  return (
    <div className={isDark ? "h-full overflow-y-auto bg-slate-900" : "h-full overflow-y-auto bg-slate-50"}>
      {/* HEADER SECTION */}
      <div className={isDark ? "border-b border-slate-700 bg-slate-950 p-6" : "border-b border-slate-300 bg-white p-6"}>
        <div className="mb-3 flex items-start justify-between">
          <h1 className={isDark ? "text-3xl font-bold text-white" : "text-3xl font-bold text-slate-900"}>{problem.title}</h1>
          <span className={getDifficultyThemeClass(problem.difficulty, isDark)}>
            {problem.difficulty}
          </span>
        </div>
        <p className={isDark ? "text-slate-400" : "text-slate-600"}>{problem.category}</p>

        {/* Problem selector */}
        <div className="mt-4">
          <select
            className={isDark ? "w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100" : "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"}
            value={currentProblemId}
            onChange={(e) => onProblemChange(e.target.value)}
          >
            {allProblems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} - {p.difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* PROBLEM DESC */}
        <div className={isDark ? "rounded-xl border border-slate-700 bg-slate-800 p-5 shadow-sm" : "rounded-xl border border-slate-300 bg-white p-5 shadow-sm"}>
          <h2 className={isDark ? "text-xl font-bold text-white" : "text-xl font-bold text-slate-900"}>Description</h2>

          <div className="space-y-3 leading-relaxed">
            <p className={isDark ? "text-slate-300" : "text-slate-700"}>{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx} className={isDark ? "text-slate-300" : "text-slate-700"}>
                {note}
              </p>
            ))}
          </div>
        </div>

        {/* EXAMPLES SECTION */}
        <div className={isDark ? "rounded-xl border border-slate-700 bg-slate-800 p-5 shadow-sm" : "rounded-xl border border-slate-300 bg-white p-5 shadow-sm"}>
          <h2 className={isDark ? "mb-4 text-xl font-bold text-white" : "mb-4 text-xl font-bold text-slate-900"}>Examples</h2>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx}>
                <div className="mb-2 flex items-center gap-2">
                  <span className={isDark ? "inline-flex items-center justify-center rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-300" : "inline-flex items-center justify-center rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700"}>{idx + 1}</span>
                  <p className={isDark ? "font-semibold text-white" : "font-semibold text-slate-900"}>Example {idx + 1}</p>
                </div>
                <div className={isDark ? "space-y-1.5 rounded-lg bg-slate-900 p-4 font-mono text-sm" : "space-y-1.5 rounded-lg bg-slate-100 p-4 font-mono text-sm"}>
                  <div className="flex gap-2">
                    <span className={isDark ? "min-w-[70px] font-bold text-indigo-300" : "min-w-[70px] font-bold text-indigo-600"}>Input:</span>
                    <span className={isDark ? "text-slate-300" : "text-slate-700"}>{example.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className={isDark ? "min-w-[70px] font-bold text-emerald-300" : "min-w-[70px] font-bold text-emerald-600"}>Output:</span>
                    <span className={isDark ? "text-slate-300" : "text-slate-700"}>{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className={isDark ? "border-t border-slate-700 pt-2" : "border-t border-slate-300 pt-2"}>
                      <span className={isDark ? "text-xs font-sans text-slate-400" : "text-xs font-sans text-slate-600"}>
                        <span className="font-semibold">Explanation:</span> {example.explanation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONSTRAINTS */}
        <div className={isDark ? "rounded-xl border border-slate-700 bg-slate-800 p-5 shadow-sm" : "rounded-xl border border-slate-300 bg-white p-5 shadow-sm"}>
          <h2 className={isDark ? "mb-4 text-xl font-bold text-white" : "mb-4 text-xl font-bold text-slate-900"}>Constraints</h2>
          <ul className={isDark ? "space-y-2 text-slate-300" : "space-y-2 text-slate-700"}>
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="flex gap-2">
                <span className={isDark ? "text-indigo-300" : "text-indigo-600"}>•</span>
                <code className="text-sm">{constraint}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;