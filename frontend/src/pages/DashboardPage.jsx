import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";

function DashboardPage({ isDark, setIsDark }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });

  const createSessionMutation = useCreateSession();

  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;

    createSessionMutation.mutate(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const isUserInSession = (session) => {
    if (!user.id) return false;

    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  return (
    <>
      <div className={isDark ? "min-h-screen bg-slate-950 text-slate-100" : "min-h-screen bg-slate-100 text-slate-900"}>
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className={isDark ? "absolute -top-44 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" : "absolute -top-44 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-300/40 blur-3xl"} />
          <div className={isDark ? "absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" : "absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl"} />
        </div>
        <Navbar isDark={isDark} setIsDark={setIsDark} />
        <main className="mx-auto w-full max-w-7xl px-4 pb-10 pt-4 sm:px-6 lg:px-8">
          <WelcomeSection isDark={isDark} onCreateSession={() => setShowCreateModal(true)} />

          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
            <StatsCards
              isDark={isDark}
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />
            <ActiveSessions
              isDark={isDark}
              sessions={activeSessions}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInSession}
            />
          </div>

          <RecentSessions isDark={isDark} sessions={recentSessions} isLoading={loadingRecentSessions} />
        </main>
      </div>

      <CreateSessionModal
        isDark={isDark}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </>
  );
}

export default DashboardPage;