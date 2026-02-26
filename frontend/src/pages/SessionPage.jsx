import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useEndSession,
  useJoinSession,
  useSessionById,
} from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../config/piston";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import useIsMobile from "../hooks/useIsMobile";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";

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

function SessionPage({ isDark, setIsDark }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const isMobile = useIsMobile();

  const {
    data: sessionData,
    isLoading: loadingSession,
    refetch,
  } = useSessionById(id);

  const { mutate: joinSession } = useJoinSession();
  const { mutate: endSession, isPending: isEndingSession } = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } =
    useStreamClient(session, loadingSession, isHost, isParticipant);

  // find the problem data based on session problem title
  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(
    problemData?.starterCode?.[selectedLanguage] || "",
  );
  const starterCodeForLanguage = problemData?.starterCode?.[selectedLanguage] || "";
  const effectiveCode = code || starterCodeForLanguage;

  // auto-join session if user is not already a participant and not the host
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;

    joinSession(id, { onSuccess: refetch });

    // remove the joinSessionMutation, refetch from dependencies to avoid infinite loop
  }, [session, user, loadingSession, isHost, isParticipant, id, joinSession, refetch]);

  // redirect the "participant" when session ends
  useEffect(() => {
    if (!session || loadingSession) return;

    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    // use problem-specific starter code
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, effectiveCode);
    setOutput(result);
    setIsRunning(false);
  };

  const handleEndSession = () => {
    if (
      confirm(
        "Are you sure you want to end this session? All participants will be notified.",
      )
    ) {
      // this will navigate the HOST to dashboard
      endSession(id, {
        onSuccess: () => navigate("/dashboard"),
      });
    }
  };

  const problemDetailsInner = (
    <>
      <div className={isDark ? "border-b border-white/10 p-4 sm:p-6" : "border-b border-slate-300 p-4 sm:p-6"}>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className={isDark ? "text-2xl font-bold text-white sm:text-3xl" : "text-2xl font-bold text-slate-900 sm:text-3xl"}>
              {session?.problem || "Loading..."}
            </h1>
            {problemData?.category && (
              <p className={isDark ? "mt-1 text-sm text-slate-400 sm:text-base" : "mt-1 text-sm text-slate-600 sm:text-base"}>
                {problemData.category}
              </p>
            )}
            <p className={isDark ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-600"}>
              Host: {session?.host?.name || "Loading..."} • {session?.participant ? 2 : 1}/2 participants
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className={getDifficultyThemeClass(session?.difficulty, isDark)}>
              {session?.difficulty.slice(0, 1).toUpperCase() + session?.difficulty.slice(1) || "Easy"}
            </span>
            {isHost && session?.status === "active" && (
              <button
                onClick={handleEndSession}
                disabled={isEndingSession}
                className={isDark ? "inline-flex items-center gap-2 rounded-xl border border-rose-400/40 bg-rose-500/15 px-3 py-1.5 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-50" : "inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-100 px-3 py-1.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-50"}
              >
                {isEndingSession ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <LogOutIcon className="h-4 w-4" />}
                End Session
              </button>
            )}
            {session?.status === "completed" && (
              <span className={isDark ? "inline-flex rounded-full border border-slate-600 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300" : "inline-flex rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"}>
                Completed
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
        {problemData?.description && (
          <div className={isDark ? "rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5" : "rounded-xl border border-slate-300 bg-white p-4 sm:p-5"}>
            <h2 className={isDark ? "mb-4 text-lg font-bold text-white sm:text-xl" : "mb-4 text-lg font-bold text-slate-900 sm:text-xl"}>Description</h2>
            <div className="space-y-3 text-sm leading-relaxed sm:text-base">
              <p className={isDark ? "text-slate-300" : "text-slate-700"}>{problemData.description.text}</p>
              {problemData.description.notes?.map((note, idx) => (
                <p key={idx} className={isDark ? "text-slate-300" : "text-slate-700"}>{note}</p>
              ))}
            </div>
          </div>
        )}

        {problemData?.examples && problemData.examples.length > 0 && (
          <div className={isDark ? "rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5" : "rounded-xl border border-slate-300 bg-white p-4 sm:p-5"}>
            <h2 className={isDark ? "mb-4 text-lg font-bold text-white sm:text-xl" : "mb-4 text-lg font-bold text-slate-900 sm:text-xl"}>Examples</h2>
            <div className="space-y-4">
              {problemData.examples.map((example, idx) => (
                <div key={idx}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className={isDark ? "inline-flex items-center justify-center rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-300" : "inline-flex items-center justify-center rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700"}>{idx + 1}</span>
                    <p className={isDark ? "font-semibold text-white" : "font-semibold text-slate-900"}>Example {idx + 1}</p>
                  </div>
                  <div className={isDark ? "space-y-1.5 rounded-lg bg-slate-900 p-3 font-mono text-xs sm:p-4 sm:text-sm" : "space-y-1.5 rounded-lg bg-slate-100 p-3 font-mono text-xs sm:p-4 sm:text-sm"}>
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                      <span className={isDark ? "font-bold text-indigo-300 sm:min-w-[70px]" : "font-bold text-indigo-600 sm:min-w-[70px]"}>Input:</span>
                      <span className={isDark ? "text-slate-300" : "text-slate-700"}>{example.input}</span>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                      <span className={isDark ? "font-bold text-emerald-300 sm:min-w-[70px]" : "font-bold text-emerald-600 sm:min-w-[70px]"}>Output:</span>
                      <span className={isDark ? "text-slate-300" : "text-slate-700"}>{example.output}</span>
                    </div>
                    {example.explanation && (
                      <div className={isDark ? "mt-2 border-t border-slate-700 pt-2" : "mt-2 border-t border-slate-300 pt-2"}>
                        <span className={isDark ? "font-sans text-xs text-slate-400" : "font-sans text-xs text-slate-600"}>
                          <span className="font-semibold">Explanation:</span> {example.explanation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {problemData?.constraints && problemData.constraints.length > 0 && (
          <div className={isDark ? "rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5" : "rounded-xl border border-slate-300 bg-white p-4 sm:p-5"}>
            <h2 className={isDark ? "mb-4 text-lg font-bold text-white sm:text-xl" : "mb-4 text-lg font-bold text-slate-900 sm:text-xl"}>Constraints</h2>
            <ul className={isDark ? "space-y-2 text-sm text-slate-300 sm:text-base" : "space-y-2 text-sm text-slate-700 sm:text-base"}>
              {problemData.constraints.map((constraint, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className={isDark ? "text-indigo-300" : "text-indigo-600"}>•</span>
                  <code className="break-words text-xs sm:text-sm">{constraint}</code>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );

  const videoContent = (
    <>
      {isInitializingCall ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <Loader2Icon className={isDark ? "mx-auto mb-4 h-12 w-12 animate-spin text-indigo-300" : "mx-auto mb-4 h-12 w-12 animate-spin text-indigo-600"} />
            <p className={isDark ? "text-lg text-slate-200" : "text-lg text-slate-700"}>Connecting to video call...</p>
          </div>
        </div>
      ) : !streamClient || !call ? (
        <div className="flex h-full items-center justify-center">
          <div className={isDark ? "w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center" : "w-full max-w-md rounded-2xl border border-slate-300 bg-white p-8 text-center"}>
            <div className={isDark ? "mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-rose-500/15" : "mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-rose-100"}>
              <PhoneOffIcon className={isDark ? "h-12 w-12 text-rose-300" : "h-12 w-12 text-rose-600"} />
            </div>
            <h2 className={isDark ? "text-2xl font-bold text-white" : "text-2xl font-bold text-slate-900"}>Connection Failed</h2>
            <p className={isDark ? "mt-1 text-slate-400" : "mt-1 text-slate-600"}>Unable to connect to the video call</p>
          </div>
        </div>
      ) : (
        <div className="h-full">
          <StreamVideo client={streamClient}>
            <StreamCall call={call}>
              <VideoCallUI isDark={isDark} chatClient={chatClient} channel={channel} />
            </StreamCall>
          </StreamVideo>
        </div>
      )}
    </>
  );

  return (
    <div className={isDark ? "relative flex min-h-screen flex-col overflow-x-hidden bg-slate-950 text-slate-100 lg:h-screen lg:overflow-hidden" : "relative flex min-h-screen flex-col overflow-x-hidden bg-slate-100 text-slate-900 lg:h-screen lg:overflow-hidden"}>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className={isDark ? "absolute -top-44 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" : "absolute -top-44 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-300/40 blur-3xl"} />
        <div className={isDark ? "absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" : "absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl"} />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col lg:h-full">
      <Navbar isDark={isDark} setIsDark={setIsDark} />

      <div className="flex-1 overflow-visible px-3 pb-3 pt-3 sm:px-4 lg:overflow-hidden lg:px-8 lg:pb-6">
        {isMobile ? (
          <div className="space-y-3 pb-2">
            <div className={isDark ? "overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-sm" : "overflow-hidden rounded-2xl border border-slate-300 bg-white/90 backdrop-blur-sm"}>
              {problemDetailsInner}
            </div>

            <div className={isDark ? "h-[50vh] min-h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-sm" : "h-[50vh] min-h-[320px] overflow-hidden rounded-2xl border border-slate-300 bg-white/90 backdrop-blur-sm"}>
              <CodeEditorPanel
                isDark={isDark}
                selectedLanguage={selectedLanguage}
                code={effectiveCode}
                isRunning={isRunning}
                onLanguageChange={handleLanguageChange}
                onCodeChange={(value) => setCode(value || "")}
                onRunCode={handleRunCode}
              />
            </div>

            <div className={isDark ? "h-48 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-sm" : "h-48 overflow-hidden rounded-2xl border border-slate-300 bg-white/90 backdrop-blur-sm"}>
              <OutputPanel isDark={isDark} output={output} />
            </div>

            <div className={isDark ? "h-[58vh] min-h-[340px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-3 backdrop-blur-sm" : "h-[58vh] min-h-[340px] overflow-hidden rounded-2xl border border-slate-300 bg-white/90 p-3 backdrop-blur-sm"}>
              {videoContent}
            </div>
          </div>
        ) : (
          <PanelGroup direction="horizontal">
            <Panel defaultSize={50} minSize={30}>
              <PanelGroup direction="vertical">
                <Panel defaultSize={50} minSize={20}>
                  <div className={isDark ? "h-full overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-sm" : "h-full overflow-y-auto rounded-2xl border border-slate-300 bg-white/90 backdrop-blur-sm"}>
                    {problemDetailsInner}
                  </div>
                </Panel>

                <PanelResizeHandle className={isDark ? "h-2 cursor-row-resize bg-slate-700 transition-colors hover:bg-indigo-500/60" : "h-2 cursor-row-resize bg-slate-300 transition-colors hover:bg-indigo-400/80"} />

                <Panel defaultSize={50} minSize={20}>
                  <PanelGroup direction="vertical">
                    <Panel defaultSize={70} minSize={30}>
                      <CodeEditorPanel
                        isDark={isDark}
                        selectedLanguage={selectedLanguage}
                        code={effectiveCode}
                        isRunning={isRunning}
                        onLanguageChange={handleLanguageChange}
                        onCodeChange={(value) => setCode(value || "")}
                        onRunCode={handleRunCode}
                      />
                    </Panel>

                    <PanelResizeHandle className={isDark ? "h-2 cursor-row-resize bg-slate-700 transition-colors hover:bg-indigo-500/60" : "h-2 cursor-row-resize bg-slate-300 transition-colors hover:bg-indigo-400/80"} />

                    <Panel defaultSize={30} minSize={15}>
                      <OutputPanel isDark={isDark} output={output} />
                    </Panel>
                  </PanelGroup>
                </Panel>
              </PanelGroup>
            </Panel>

            <PanelResizeHandle className={isDark ? "w-2 cursor-col-resize bg-slate-700 transition-colors hover:bg-indigo-500/60" : "w-2 cursor-col-resize bg-slate-300 transition-colors hover:bg-indigo-400/80"} />

            <Panel defaultSize={50} minSize={30}>
              <div className={isDark ? "h-full overflow-auto rounded-2xl border border-white/10 bg-slate-900/70 p-4 backdrop-blur-sm" : "h-full overflow-auto rounded-2xl border border-slate-300 bg-white/90 p-4 backdrop-blur-sm"}>
                {videoContent}
              </div>
            </Panel>
          </PanelGroup>
        )}
      </div>
      </div>
    </div>
  );
}

export default SessionPage;
