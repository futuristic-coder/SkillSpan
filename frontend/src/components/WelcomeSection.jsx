import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";

function WelcomeSection({ isDark, onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-4 flex items-start gap-3 sm:items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className={isDark ? "bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-3xl font-black leading-tight text-transparent sm:text-4xl lg:text-5xl" : "bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 bg-clip-text text-3xl font-black leading-tight text-transparent sm:text-4xl lg:text-5xl"}>
                Welcome back, {user?.firstName || "there"}!
              </h1>
            </div>
            <p className={isDark ? "ml-0 text-base text-slate-300 sm:ml-16 sm:text-lg lg:text-xl" : "ml-0 text-base text-slate-600 sm:ml-16 sm:text-lg lg:text-xl"}>
              Ready to level up your coding skills?
            </p>
          </div>
          <button
            onClick={onCreateSession}
            className="group inline-flex w-full items-center justify-center rounded-2xl border border-indigo-500 bg-indigo-500 px-6 py-3 transition-all duration-200 hover:bg-indigo-600 sm:w-auto sm:px-8 sm:py-4"
          >
            <div className="flex items-center gap-3 text-base font-bold text-white sm:text-lg">
              <ZapIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>Create Session</span>
              <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;