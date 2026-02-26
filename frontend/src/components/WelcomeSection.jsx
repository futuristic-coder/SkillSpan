import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";

function WelcomeSection({ isDark, onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden">
      <div className="relative py-4 sm:py-5 lg:py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-4 flex items-start gap-3 sm:items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className={isDark ? "bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-2xl font-black leading-tight text-transparent sm:text-3xl lg:text-4xl" : "bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 bg-clip-text text-2xl font-black leading-tight text-transparent sm:text-3xl lg:text-4xl"}>
                Welcome back, {user?.firstName || "there"}!
              </h1>
            </div>
            <p className={isDark ? "text-sm text-slate-300 sm:text-base lg:text-lg" : "text-sm text-slate-600 sm:text-base lg:text-lg"}>
              Ready to level up your coding skills?
            </p>
          </div>
          <button
            onClick={onCreateSession}
            className="group inline-flex w-full items-center justify-center rounded-xl border border-indigo-500 bg-indigo-500 px-5 py-2.5 shadow-lg shadow-indigo-900/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-400 sm:w-auto"
          >
            <div className="flex items-center gap-2.5 text-sm font-semibold text-white sm:text-base">
              <ZapIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Create Session</span>
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;