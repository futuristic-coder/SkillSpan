import {
  CallControls,
  CallingState,
  ParticipantView,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { ChevronLeftIcon, Loader2Icon, MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";
import useIsMobile from "../hooks/useIsMobile";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

function VideoCallUI({ isDark, chatClient, channel }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount, useLocalParticipant } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const localParticipant = useLocalParticipant();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!chatClient || !channel) return;

    const setInitialUnread = () => {
      const unread =
        typeof channel.countUnread === "function"
          ? channel.countUnread()
          : channel?.state?.unreadCount || 0;
      setUnreadCount(Number(unread) || 0);
    };

    setInitialUnread();

    const handleNewMessage = (event) => {
      const senderId = event?.user?.id;
      const currentUserId = chatClient?.userID || chatClient?.user?.id;
      if (senderId && currentUserId && senderId === currentUserId) return;

      if (!isChatOpen) {
        setUnreadCount((prev) => prev + 1);
        toast(`${event?.user?.name || "Someone"} sent a message`, {
          icon: "💬",
          duration: 2500,
        });
      }
    };

    channel.on("message.new", handleNewMessage);

    return () => {
      channel.off("message.new", handleNewMessage);
    };
  }, [chatClient, channel, isChatOpen]);

  const handleToggleChat = () => {
    setIsChatOpen((prev) => {
      const next = !prev;
      if (next) {
        setUnreadCount(0);
        channel?.markRead?.();
      }
      return next;
    });
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    channel?.markRead?.();
  };

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
    <div className={`session-video-ui ${isDark ? "session-video-ui--dark" : "session-video-ui--light"} relative flex h-full min-h-0 flex-col gap-3 md:flex-row str-video`}>
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        {/* Participants count badge and Chat Toggle */}
        <div className={isDark ? "flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 p-3" : "flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-300 bg-white p-3"}>
          <div className="flex items-center gap-2">
            <UsersIcon className={isDark ? "h-5 w-5 text-indigo-300" : "h-5 w-5 text-indigo-600"} />
            <span className={isDark ? "font-semibold text-slate-100" : "font-semibold text-slate-800"}>
              {participantCount} {participantCount === 1 ? "participant" : "participants"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {chatClient && channel && (
              <button
                onClick={handleToggleChat}
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
                {unreadCount > 0 && !isChatOpen && (
                  <span className={isDark ? "inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white" : "inline-flex min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 text-[10px] font-bold text-white"}>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        <div className={isDark ? "relative h-[42vh] min-h-[220px] overflow-hidden rounded-xl border border-white/10 bg-slate-900 md:h-auto md:min-h-[280px] md:flex-1" : "relative h-[42vh] min-h-[220px] overflow-hidden rounded-xl border border-slate-300 bg-slate-100 md:h-auto md:min-h-[280px] md:flex-1"}>
          <SpeakerLayout participantsBarPosition="bottom" />

          {isMobile && localParticipant && (
            <div className={isDark ? "session-self-preview pointer-events-none absolute bottom-3 right-3 z-20 aspect-[3/4] w-24 overflow-hidden rounded-xl border border-white/25 bg-slate-900 shadow-xl" : "session-self-preview pointer-events-none absolute bottom-3 right-3 z-20 aspect-[3/4] w-24 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-lg"}>
              <ParticipantView participant={localParticipant} />
              <div className={isDark ? "absolute left-1.5 top-1.5 rounded-md bg-slate-950/80 px-1.5 py-0.5 text-[10px] font-semibold text-white" : "absolute left-1.5 top-1.5 rounded-md bg-slate-900/75 px-1.5 py-0.5 text-[10px] font-semibold text-white"}>
                You
              </div>
            </div>
          )}
        </div>

        <div className={isDark ? "session-call-controls session-call-controls--dark sticky bottom-0 z-30 mt-1 flex justify-center rounded-xl border border-white/10 bg-slate-900/90 p-3 backdrop-blur-sm md:static md:bg-white/5 md:backdrop-blur-0" : "session-call-controls session-call-controls--light sticky bottom-0 z-30 mt-1 flex justify-center rounded-xl border border-slate-300 bg-white/95 p-3 backdrop-blur-sm md:static md:bg-white md:backdrop-blur-0"}>
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
              onClick={handleCloseChat}
              className="fixed inset-0 z-30 bg-slate-950/55 backdrop-blur-[1px]"
            />
          )}

          <div
            className={`session-chat-panel flex flex-col overflow-hidden rounded-xl border transition-all duration-300 ease-in-out ${
              isDark ? "border-white/10 bg-slate-900" : "border-slate-300 bg-white"
            } ${
              isMobile
                ? isChatOpen
                  ? "fixed inset-x-2 bottom-2 top-20 z-40 h-auto max-h-none translate-y-0 opacity-100 shadow-2xl"
                  : "pointer-events-none fixed inset-x-2 bottom-2 top-20 z-40 h-auto max-h-none translate-y-6 opacity-0"
                : isChatOpen
                ? "z-20 w-80 shrink-0 self-stretch opacity-100"
                : "pointer-events-none z-20 w-0 shrink-0 self-stretch opacity-0"
            }`}
          >
            {isChatOpen && (
              <>
                <div className={isDark ? "session-chat-header flex items-center justify-between border-b border-white/10 bg-slate-950 p-3" : "session-chat-header flex items-center justify-between border-b border-slate-300 bg-slate-50 p-3"}>
                  {isMobile ? (
                    <button
                      type="button"
                      onClick={handleCloseChat}
                      className={isDark ? "inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-white" : "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700"}
                      title="Back to call"
                    >
                      <ChevronLeftIcon className="size-4" />
                      Back to Call
                    </button>
                  ) : (
                    <h3 className={isDark ? "font-semibold text-white" : "font-semibold text-slate-900"}>Session Chat</h3>
                  )}

                  <button
                    onClick={handleCloseChat}
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