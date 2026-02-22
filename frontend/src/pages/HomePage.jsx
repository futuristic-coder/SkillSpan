import { Link } from "react-router";
import { SignInButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  MoonIcon,
  SunIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
} from "lucide-react";

function HomePage() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("home-theme");
    if (savedTheme === "light") setIsDark(false);
    if (savedTheme === "dark") setIsDark(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("home-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const primaryButtonClass =
    "group inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:-translate-y-0.5 hover:bg-indigo-400";

  const secondaryButtonClass = isDark
    ? "inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
    : "inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50";

  const cardClass = isDark
    ? "rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:border-indigo-300/40"
    : "rounded-2xl border border-slate-300 bg-white p-6 transition hover:-translate-y-1 hover:border-indigo-400";

  const headingClass = isDark
    ? "text-3xl font-bold text-white sm:text-4xl"
    : "text-3xl font-bold text-slate-900 sm:text-4xl";

  const mutedTextClass = isDark
    ? "mt-4 text-base text-slate-300 sm:text-lg"
    : "mt-4 text-base text-slate-600 sm:text-lg";

  const iconBadgeClass = isDark
    ? "mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300"
    : "mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600";

  return (
    <div className={isDark ? "min-h-screen bg-slate-950 text-slate-100" : "min-h-screen bg-slate-100 text-slate-900"}>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className={isDark ? "absolute -top-44 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" : "absolute -top-44 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-300/40 blur-3xl"} />
        <div className={isDark ? "absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" : "absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl"} />
      </div>

      <nav className={isDark ? "sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl" : "sticky top-0 z-50 border-b border-slate-300/90 bg-white/85 backdrop-blur-xl"}>
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <Link to="/" className="group flex origin-left items-center gap-3 transform-gpu transition-all duration-300 ease-out hover:animate-[brandPulse_3s_ease-in-out_1]">
            <img src="/logo.png" alt="Logo" className={isDark ? "h-10 w-10 rounded-xl ring-1 ring-white/10 transform-gpu transition-all duration-300 ease-out group-hover:ring-indigo-300/40 group-hover:shadow-lg group-hover:shadow-indigo-500/30" : "h-10 w-10 rounded-xl ring-1 ring-slate-300 transform-gpu transition-all duration-300 ease-out group-hover:ring-indigo-500/40 group-hover:shadow-lg group-hover:shadow-indigo-500/20"} />
            <div className="flex flex-col">
              <span className={isDark ? "inline-block text-base font-semibold tracking-tight text-white transition-all duration-300 ease-out group-hover:text-indigo-200" : "inline-block text-base font-semibold tracking-tight text-slate-900 transition-all duration-300 ease-out group-hover:text-indigo-700"}>Talent Bridge</span>
              <span className={isDark ? "-mt-0.5 hidden text-xs font-medium text-slate-400 transition-all duration-300 ease-out group-hover:text-slate-200 sm:block" : "-mt-0.5 hidden text-xs font-medium text-slate-500 transition-all duration-300 ease-out group-hover:text-slate-700 sm:block"}>
                Connecting Talent, Empowering Futures
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDark((prev) => !prev)}
              className={isDark ? "inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10" : "inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"}
            >
              {isDark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
              {isDark ? "Light" : "Dark"}
            </button>

            <SignInButton mode="modal">
              <button className="group inline-flex items-center gap-2 overflow-hidden rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60">
                Get Started
                <ArrowRightIcon className="size-4 transform-gpu transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </button>
            </SignInButton>
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 lg:px-8 lg:pt-8">
        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div className="space-y-7">
            <div className={isDark ? "inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-200" : "inline-flex items-center gap-2 rounded-full border border-indigo-300 bg-indigo-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-700"}>
              <ZapIcon className="size-4" />
              Live Interview Workspace
            </div>

            <h1 className={isDark ? "text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-6xl" : "text-4xl font-black leading-[1.05] text-slate-900 sm:text-5xl lg:text-6xl"}>
              Run Better Interviews.
              <br />
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                Collaborate in Real Time.
              </span>
            </h1>

            <p className={isDark ? "max-w-xl text-base leading-7 text-slate-300 sm:text-lg" : "max-w-xl text-base leading-7 text-slate-600 sm:text-lg"}>
              Talent Bridge gives your team a polished environment for coding interviews and pair
              programming with live video, shared editor, and smooth collaboration.
            </p>

            <div className="flex flex-wrap gap-3 text-sm">
              <div className={isDark ? "inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-200" : "inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-700"}>
                <CheckIcon className="size-4 text-emerald-400" />
                HD Calls
              </div>
              <div className={isDark ? "inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-200" : "inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-700"}>
                <CheckIcon className="size-4 text-emerald-400" />
                Shared Editor
              </div>
              <div className={isDark ? "inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-200" : "inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-700"}>
                <CheckIcon className="size-4 text-emerald-400" />
                Fast Setup
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <SignInButton mode="modal">
                <button className={primaryButtonClass}>
                  Start Coding Now
                  <ArrowRightIcon className="size-5 transform-gpu transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </SignInButton>

              <button className={secondaryButtonClass}>
                <VideoIcon className="size-5" />
                Watch Demo
              </button>
            </div>

            
          </div>

          <div className={isDark ? "relative mx-auto w-full max-w-lg rounded-3xl border border-slate-700/70 bg-slate-900/70 p-4 shadow-[0_20px_60px_-25px_rgba(79,70,229,0.45)]" : "relative mx-auto w-full max-w-lg rounded-3xl border border-slate-300 bg-gradient-to-br from-white to-slate-50 p-4 shadow-xl"}>
            <div className={isDark ? "absolute -right-4 -top-4 rounded-xl border border-indigo-300/20 bg-slate-900/90 px-3 py-2 text-xs font-semibold text-indigo-200" : "absolute -right-4 -top-4 rounded-xl border border-indigo-300 bg-indigo-100 px-3 py-2 text-xs font-semibold text-indigo-700"}>
              Live Session
            </div>
            <img
              src="/hero.png"
              alt="Talent Bridge Platform"
              className={isDark ? "mx-auto w-full max-w-sm rounded-2xl ring-1 ring-white/10 brightness-95 contrast-110" : "mx-auto w-full max-w-sm rounded-2xl"}
            />
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className={headingClass}>
              Built for Modern Technical Interviews
            </h2>
            <p className={mutedTextClass}>
              Clean UI, low-friction flow, and all essentials in one place.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className={cardClass}>
              <div className={iconBadgeClass}>
                <VideoIcon className="size-6" />
              </div>
              <h3 className={isDark ? "text-lg font-semibold text-white" : "text-lg font-semibold text-slate-900"}>HD Video + Audio</h3>
              <p className={isDark ? "mt-2 text-sm leading-6 text-slate-300" : "mt-2 text-sm leading-6 text-slate-600"}>
                Keep communication natural with high-quality calls and stable session performance.
              </p>
            </div>

            <div className={cardClass}>
              <div className={iconBadgeClass}>
                <Code2Icon className="size-6" />
              </div>
              <h3 className={isDark ? "text-lg font-semibold text-white" : "text-lg font-semibold text-slate-900"}>Real-Time Code Editor</h3>
              <p className={isDark ? "mt-2 text-sm leading-6 text-slate-300" : "mt-2 text-sm leading-6 text-slate-600"}>
                Collaborate line-by-line with instant updates and a distraction-free coding canvas.
              </p>
            </div>

            <div className={cardClass}>
              <div className={iconBadgeClass}>
                <UsersIcon className="size-6" />
              </div>
              <h3 className={isDark ? "text-lg font-semibold text-white" : "text-lg font-semibold text-slate-900"}>Team Collaboration</h3>
              <p className={isDark ? "mt-2 text-sm leading-6 text-slate-300" : "mt-2 text-sm leading-6 text-slate-600"}>
                Discuss ideas, evaluate solutions, and make interviews more interactive and fair.
              </p>
            </div>
          </div>
        </section>

        <section className={isDark ? "rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600/20 via-violet-600/20 to-cyan-600/20 p-8 text-center sm:p-12" : "rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-100 via-violet-100 to-cyan-100 p-8 text-center sm:p-12"}>
          <h3 className={isDark ? "text-2xl font-bold text-white sm:text-3xl" : "text-2xl font-bold text-slate-900 sm:text-3xl"}>
            Ready to run your next session on Talent Bridge?
          </h3>
          <p className={isDark ? "mx-auto mt-3 max-w-2xl text-sm text-slate-200 sm:text-base" : "mx-auto mt-3 max-w-2xl text-sm text-slate-700 sm:text-base"}>
            Start free and see how a modern interview experience improves candidate performance.
          </p>
          <div className="mt-6">
            <SignInButton mode="modal">
              <button className={primaryButtonClass}>
                Get Started Free
                <ArrowRightIcon className="size-4 transform-gpu transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </SignInButton>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
