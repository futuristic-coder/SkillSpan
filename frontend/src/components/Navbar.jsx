import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, MoonIcon, SunIcon } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

function Navbar({ isDark, setIsDark, fixedTop = false }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={
        fixedTop
          ? isDark
            ? "fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl"
            : "fixed left-0 right-0 top-0 z-50 border-b border-slate-300/90 bg-white/85 backdrop-blur-xl"
          : isDark
          ? "sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl"
          : "sticky top-0 z-50 border-b border-slate-300/90 bg-white/85 backdrop-blur-xl"
      }
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-2 lg:px-8">
        {/* LOGO */}
        <Link
          to="/"
          className="group flex origin-left items-center gap-3 transform-gpu transition-all duration-300 ease-out hover:animate-[brandPulse_3s_ease-in-out_1]"
        >
          <img
            src="/logo.png"
            alt="Logo"
            className={
              isDark
                ? "h-9 w-9 rounded-xl ring-1 ring-white/10 transform-gpu transition-all duration-300 ease-out group-hover:ring-indigo-300/40 group-hover:shadow-lg group-hover:shadow-indigo-500/30"
                : "h-9 w-9 rounded-xl ring-1 ring-slate-300 transform-gpu transition-all duration-300 ease-out group-hover:ring-indigo-500/40 group-hover:shadow-lg group-hover:shadow-indigo-500/20"
            }
          />

          <div className="flex flex-col">
            <span
              className={
                isDark
                  ? "inline-block text-base font-semibold tracking-tight text-white transition-all duration-300 ease-out group-hover:text-indigo-200"
                  : "inline-block text-base font-semibold tracking-tight text-slate-900 transition-all duration-300 ease-out group-hover:text-indigo-700"
              }
            >
              Skill Span
            </span>
            <span
              className={
                isDark
                  ? "-mt-0.5 hidden text-xs font-medium text-slate-400 transition-all duration-300 ease-out group-hover:text-slate-200 sm:block"
                  : "-mt-0.5 hidden text-xs font-medium text-slate-500 transition-all duration-300 ease-out group-hover:text-slate-700 sm:block"
              }
            >
              Connecting Talent, Empowering Futures
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* PROBLEMS PAGE LINK */}
          <Link
            to={"/problems"}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 
              ${
                isActive("/problems")
                  ? isDark
                    ? "border border-indigo-400/70 bg-indigo-500 text-white shadow-lg shadow-indigo-900/30"
                    : "border border-indigo-600 bg-indigo-500 text-white shadow-md shadow-indigo-300/50"
                  : isDark
                  ? "border border-white/15 text-slate-300 hover:bg-white/10 hover:text-white"
                  : "border border-slate-400 bg-white/90 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2 sm:gap-x-2.5">
              <BookOpenIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Problems</span>
            </div>
          </Link>

          {/* DASHBORD PAGE LINK */}
          <Link
            to={"/dashboard"}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 
              ${
                isActive("/dashboard")
                  ? isDark
                    ? "border border-indigo-400/70 bg-indigo-500 text-white shadow-lg shadow-indigo-900/30"
                    : "border border-indigo-600 bg-indigo-500 text-white shadow-md shadow-indigo-300/50"
                  : isDark
                  ? "border border-white/15 text-slate-300 hover:bg-white/10 hover:text-white"
                  : "border border-slate-400 bg-white/90 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2 sm:gap-x-2.5">
              <LayoutDashboardIcon className="size-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </div>
          </Link>

          <button
            onClick={() => setIsDark((prev) => !prev)}
            className={
              isDark
                ? "inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                : "inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            }
          >
            {isDark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
            <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
          </button>

          <div className={isDark ? "ml-0.5 overflow-hidden rounded-full border border-white/10 bg-white/5 p-1 sm:ml-1" : "ml-0.5 overflow-hidden rounded-full border border-slate-300 bg-white p-1 sm:ml-1"}>
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;