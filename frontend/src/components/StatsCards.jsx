import { TrophyIcon, UsersIcon } from "lucide-react";

function StatsCards({ isDark, activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:col-span-1">
      {/* Active Count */}
      <div className={isDark ? "rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-6" : "rounded-2xl border border-slate-300 bg-white p-4 sm:p-6"}>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className={isDark ? "rounded-2xl bg-indigo-500/15 p-2.5 sm:p-3" : "rounded-2xl bg-indigo-100 p-2.5 sm:p-3"}>
              <UsersIcon className={isDark ? "h-6 w-6 text-indigo-300 sm:h-7 sm:w-7" : "h-6 w-6 text-indigo-600 sm:h-7 sm:w-7"} />
            </div>
            <div className={isDark ? "rounded-full border border-indigo-400/40 bg-indigo-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-200" : "rounded-full border border-indigo-300 bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700"}>
              Live
            </div>
          </div>
          <div className={isDark ? "mb-1 text-3xl font-black text-white sm:text-4xl" : "mb-1 text-3xl font-black text-slate-900 sm:text-4xl"}>{activeSessionsCount}</div>
          <div className={isDark ? "text-sm text-slate-400" : "text-sm text-slate-600"}>Active Sessions</div>
        </div>
      </div>

      {/* Recent Count */}
      <div className={isDark ? "rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-6" : "rounded-2xl border border-slate-300 bg-white p-4 sm:p-6"}>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className={isDark ? "rounded-2xl bg-violet-500/15 p-2.5 sm:p-3" : "rounded-2xl bg-violet-100 p-2.5 sm:p-3"}>
              <TrophyIcon className={isDark ? "h-6 w-6 text-violet-300 sm:h-7 sm:w-7" : "h-6 w-6 text-violet-600 sm:h-7 sm:w-7"} />
            </div>
          </div>
          <div className={isDark ? "mb-1 text-3xl font-black text-white sm:text-4xl" : "mb-1 text-3xl font-black text-slate-900 sm:text-4xl"}>{recentSessionsCount}</div>
          <div className={isDark ? "text-sm text-slate-400" : "text-sm text-slate-600"}>Total Sessions</div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;