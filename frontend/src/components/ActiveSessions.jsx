import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";

const getDifficultyThemeClass = (difficulty, isDark) => {
  const value = difficulty?.toLowerCase();
  if (value === "easy") {
    return isDark
      ? "border border-emerald-400/30 bg-emerald-500/15 text-emerald-300"
      : "border border-emerald-300 bg-emerald-100 text-emerald-700";
  }
  if (value === "medium") {
    return isDark
      ? "border border-amber-400/30 bg-amber-500/15 text-amber-300"
      : "border border-amber-300 bg-amber-100 text-amber-700";
  }
  return isDark
    ? "border border-rose-400/30 bg-rose-500/15 text-rose-300"
    : "border border-rose-300 bg-rose-100 text-rose-700";
};

function ActiveSessions({ isDark, sessions, isLoading, isUserInSession }) {
  return (
    <div className={isDark ? "h-full rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-6 lg:col-span-2" : "h-full rounded-2xl border border-slate-300 bg-white p-4 sm:p-6 lg:col-span-2"}>
      <div>
        {/* HEADERS SECTION */}
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          {/* TITLE AND ICON */}
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 p-1.5 sm:p-2">
              <ZapIcon className="size-4 text-white sm:size-5" />
            </div>
            <h2 className={isDark ? "text-xl font-black text-white sm:text-2xl" : "text-xl font-black text-slate-900 sm:text-2xl"}>Live Sessions</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-500" />
            <span className={isDark ? "text-xs font-medium text-emerald-300 sm:text-sm" : "text-xs font-medium text-emerald-700 sm:text-sm"}>{sessions.length} active</span>
          </div>
        </div>

        {/* SESSIONS LIST */}
        <div className="max-h-[400px] space-y-3 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoaderIcon className={isDark ? "size-10 animate-spin text-indigo-300" : "size-10 animate-spin text-indigo-600"} />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className={isDark ? "rounded-xl border border-slate-700 bg-slate-900 p-4 transition hover:border-indigo-400/50 sm:p-5" : "rounded-xl border border-slate-300 bg-slate-50 p-4 transition hover:border-indigo-400 sm:p-5"}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* LEFT SIDE */}
                  <div className="flex flex-1 items-center gap-3 sm:gap-4">
                    <div className="relative flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 sm:size-14">
                      <Code2Icon className="size-6 text-white sm:size-7" />
                      <div className={isDark ? "absolute -right-1 -top-1 size-4 rounded-full border-2 border-slate-900 bg-emerald-500" : "absolute -right-1 -top-1 size-4 rounded-full border-2 border-slate-50 bg-emerald-500"} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className={isDark ? "truncate text-base font-bold text-white sm:text-lg" : "truncate text-base font-bold text-slate-900 sm:text-lg"}>{session.problem}</h3>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${getDifficultyThemeClass(
                            session.difficulty,
                            isDark
                          )}`}
                        >
                          {session.difficulty.slice(0, 1).toUpperCase() +
                            session.difficulty.slice(1)}
                        </span>
                      </div>

                      <div className={isDark ? "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 sm:gap-4 sm:text-sm" : "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 sm:gap-4 sm:text-sm"}>
                        <div className="flex items-center gap-1.5">
                          <CrownIcon className="size-4" />
                          <span className="font-medium">{session.host?.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="size-4" />
                          <span className="text-xs">{session.participant ? "2/2" : "1/2"}</span>
                        </div>
                        {session.participant && !isUserInSession(session) ? (
                          <span className={isDark ? "rounded-full border border-rose-400/30 bg-rose-500/15 px-2 py-0.5 text-xs font-semibold text-rose-300" : "rounded-full border border-rose-300 bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700"}>FULL</span>
                        ) : (
                          <span className={isDark ? "rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-300" : "rounded-full border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700"}>OPEN</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {session.participant && !isUserInSession(session) ? (
                    <button
                      className={
                        isDark
                          ? "w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-400 sm:w-auto"
                          : "w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-500 sm:w-auto"
                      }
                    >
                      Full
                    </button>
                  ) : (
                    <Link
                      to={`/session/${session._id}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-600 sm:w-auto"
                    >
                      {isUserInSession(session) ? "Rejoin" : "Join"}
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className={isDark ? "mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20" : "mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100"}>
                <SparklesIcon className={isDark ? "h-10 w-10 text-indigo-300/60" : "h-10 w-10 text-indigo-500/60"} />
              </div>
              <p className={isDark ? "mb-1 text-lg font-semibold text-slate-300" : "mb-1 text-lg font-semibold text-slate-700"}>No active sessions</p>
              <p className={isDark ? "text-sm text-slate-500" : "text-sm text-slate-500"}>Be the first to create one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ActiveSessions;