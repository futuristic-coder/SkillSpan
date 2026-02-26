import { TrophyIcon, UsersIcon } from "lucide-react";

function StatsCards({ isDark, activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:col-span-1">
      {/* Active Count */}
      <div className={isDark ? "rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5" : "rounded-2xl border border-slate-300 bg-white p-4 sm:p-5"}>
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <div className={isDark ? "rounded-xl bg-indigo-500/15 p-2.5" : "rounded-xl bg-indigo-100 p-2.5"}>
              <UsersIcon className={isDark ? "h-5 w-5 text-indigo-300" : "h-5 w-5 text-indigo-600"} />
            </div>
            <div className={isDark ? "rounded-full border border-indigo-400/40 bg-indigo-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-200" : "rounded-full border border-indigo-300 bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700"}>
              Live
            </div>
          </div>
          <div className={isDark ? "mb-1 text-2xl font-black text-white sm:text-3xl" : "mb-1 text-2xl font-black text-slate-900 sm:text-3xl"}>{activeSessionsCount}</div>
          <div className={isDark ? "text-sm text-slate-400" : "text-sm text-slate-600"}>Active Sessions</div>
        </div>
      </div>

      {/* Recent Count */}
      <div className={isDark ? "rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5" : "rounded-2xl border border-slate-300 bg-white p-4 sm:p-5"}>
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <div className={isDark ? "rounded-xl bg-violet-500/15 p-2.5" : "rounded-xl bg-violet-100 p-2.5"}>
              <TrophyIcon className={isDark ? "h-5 w-5 text-violet-300" : "h-5 w-5 text-violet-600"} />
            </div>
          </div>
          <div className={isDark ? "mb-1 text-2xl font-black text-white sm:text-3xl" : "mb-1 text-2xl font-black text-slate-900 sm:text-3xl"}>{recentSessionsCount}</div>
          <div className={isDark ? "text-sm text-slate-400" : "text-sm text-slate-600"}>Total Sessions</div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;