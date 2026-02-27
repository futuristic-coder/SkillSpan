import { Code2, Clock, Users, Trophy, Loader } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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

function RecentSessions({ isDark, sessions, isLoading }) {
  return (
    <div className={isDark ? "mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5" : "mt-5 rounded-2xl border border-slate-300 bg-white p-4 sm:p-5"}>
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 p-1.5 sm:p-2">
            <Clock className="h-4 w-4 text-white" />
          </div>
          <h2 className={isDark ? "text-lg font-black text-white sm:text-xl" : "text-lg font-black text-slate-900 sm:text-xl"}>Your Past Sessions</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <Loader className={isDark ? "h-10 w-10 animate-spin text-indigo-300" : "h-10 w-10 animate-spin text-indigo-600"} />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => {
              const participants = Array.isArray(session.participants) ? session.participants : [];
              const participantCount = participants.length || (session.participant ? 1 : 0);

              return (
              <div
                key={session._id}
                className={`relative rounded-xl border p-3.5 transition sm:p-4 ${
                  session.status === "active"
                    ? isDark
                      ? "border-emerald-400/40 bg-emerald-500/10 hover:border-emerald-300/60"
                      : "border-emerald-300 bg-emerald-50 hover:border-emerald-500"
                    : isDark
                    ? "border-slate-700 bg-slate-900 hover:border-indigo-400/40"
                    : "border-slate-300 bg-slate-50 hover:border-indigo-400"
                }`}
              >
                {session.status === "active" && (
                  <div className="absolute top-3 right-3">
                    <div className={isDark ? "inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-300" : "inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700"}>
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                      ACTIVE
                    </div>
                  </div>
                )}

                <div>
                  <div className="mb-3 flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        session.status === "active"
                          ? "bg-gradient-to-br from-emerald-500 to-emerald-400"
                          : "bg-gradient-to-br from-indigo-500 to-violet-500"
                      }`}
                    >
                      <Code2 className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={isDark ? "mb-1 truncate text-sm font-bold text-white" : "mb-1 truncate text-sm font-bold text-slate-900"}>{session.problem}</h3>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${getDifficultyThemeClass(session.difficulty, isDark)}`}
                      >
                        {session.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className={isDark ? "mb-3.5 space-y-1.5 text-xs text-slate-300" : "mb-3.5 space-y-1.5 text-xs text-slate-600"}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatDistanceToNow(new Date(session.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {participantCount + 1} participant
                        {participantCount + 1 > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className={isDark ? "flex items-center justify-between border-t border-slate-700 pt-3" : "flex items-center justify-between border-t border-slate-300 pt-3"}>
                    <span className={isDark ? "text-xs font-semibold uppercase text-slate-400" : "text-xs font-semibold uppercase text-slate-600"}>Completed</span>
                    <span className={isDark ? "text-xs text-slate-500" : "text-xs text-slate-500"}>
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16">
              <div className={isDark ? "mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20" : "mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-100 to-violet-100"}>
                <Trophy className={isDark ? "h-10 w-10 text-cyan-300/60" : "h-10 w-10 text-cyan-500/60"} />
              </div>
              <p className={isDark ? "mb-1 text-lg font-semibold text-slate-300" : "mb-1 text-lg font-semibold text-slate-700"}>No sessions yet</p>
              <p className={isDark ? "text-sm text-slate-500" : "text-sm text-slate-500"}>Start your coding journey today!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentSessions;