import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";
import useIsMobile from "../hooks/useIsMobile";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

function VideoCallUI({ isDark, chatClient, channel }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isMobile = useIsMobile();

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2Icon className={isDark ? "mx-auto mb-4 h-12 w-12 animate-spin text-indigo-300" : "mx-auto mb-4 h-12 w-12 animate-spin text-indigo-600"} />
          <p className={isDark ? "text-lg text-slate-200" : "text-lg text-slate-700"}>Joining call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col gap-3 md:flex-row str-video">
      <div className="flex-1 flex flex-col gap-3">
        {/* Participants count badge and Chat Toggle */}
        <div className={isDark ? "flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 p-3" : "flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-300 bg-white p-3"}>
          <div className="flex items-center gap-2">
            <UsersIcon className={isDark ? "h-5 w-5 text-indigo-300" : "h-5 w-5 text-indigo-600"} />
            <span className={isDark ? "font-semibold text-slate-100" : "font-semibold text-slate-800"}>
              {participantCount} {participantCount === 1 ? "participant" : "participants"}
            </span>
          </div>
          {chatClient && channel && (
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={isChatOpen
                ? isDark
                  ? "inline-flex items-center gap-2 rounded-xl border border-indigo-400/60 bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition"
                  : "inline-flex items-center gap-2 rounded-xl border border-indigo-600 bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white shadow-md shadow-indigo-300/50 transition"
                : isDark
                ? "inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                : "inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              }
              title={isChatOpen ? "Hide chat" : "Show chat"}
            >
              <MessageSquareIcon className="size-4" />
              Chat
            </button>
          )}
        </div>

        <div className={isDark ? "relative flex-1 overflow-hidden rounded-xl border border-white/10 bg-slate-900" : "relative flex-1 overflow-hidden rounded-xl border border-slate-300 bg-slate-100"}>
          <SpeakerLayout />
        </div>

        <div className={isDark ? "flex justify-center rounded-xl border border-white/10 bg-white/5 p-3" : "flex justify-center rounded-xl border border-slate-300 bg-white p-3"}>
          <CallControls onLeave={() => navigate("/dashboard")} />
        </div>
      </div>

      {/* CHAT SECTION */}

      {chatClient && channel && (
        <>
          {isMobile && isChatOpen && (
            <button
              type="button"
              aria-label="Close chat overlay"
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 z-30 bg-slate-950/55 backdrop-blur-[1px]"
            />
          )}

          <div
            className={`session-chat-panel flex flex-col overflow-hidden rounded-xl border transition-all duration-300 ease-in-out ${
              isDark ? "border-white/10 bg-slate-900" : "border-slate-300 bg-white"
            } ${
              isMobile
                ? isChatOpen
                  ? "fixed inset-x-3 bottom-3 z-40 h-[70vh] max-h-[560px] translate-y-0 opacity-100 shadow-2xl"
                  : "pointer-events-none fixed inset-x-3 bottom-3 z-40 h-[70vh] max-h-[560px] translate-y-4 opacity-0"
                : isChatOpen
                ? "z-20 w-80 opacity-100"
                : "pointer-events-none z-20 w-0 opacity-0"
            }`}
          >
            {isChatOpen && (
              <>
                <div className={isDark ? "session-chat-header flex items-center justify-between border-b border-white/10 bg-slate-950 p-3" : "session-chat-header flex items-center justify-between border-b border-slate-300 bg-slate-50 p-3"}>
                  <h3 className={isDark ? "font-semibold text-white" : "font-semibold text-slate-900"}>Session Chat</h3>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className={isDark ? "text-slate-400 transition-colors hover:text-white" : "text-slate-500 transition-colors hover:text-slate-800"}
                    title="Close chat"
                  >
                    <XIcon className="size-5" />
                  </button>
                </div>
                <div className={`session-chat-body flex-1 overflow-hidden ${isDark ? "stream-chat-dark" : "stream-chat-light"}`}>
                  <Chat client={chatClient} theme={isDark ? "str-chat__theme-dark" : "str-chat__theme-light"}>
                    <Channel channel={channel}>
                      <Window>
                        <MessageList />
                        <MessageInput />
                      </Window>
                      <Thread />
                    </Channel>
                  </Chat>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
export default VideoCallUI;