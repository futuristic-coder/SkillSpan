import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemPage from "./pages/ProblemPage";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import SessionPage from "./pages/SessionPage";

function App() {
  const { isSignedIn, isLoaded } = useUser();
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("home-theme");
    return savedTheme !== "light";
  });

  useEffect(() => {
    localStorage.setItem("home-theme", isDark ? "dark" : "light");
  }, [isDark]);

  if (!isLoaded) return null;
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            !isSignedIn ? <HomePage isDark={isDark} setIsDark={setIsDark} /> : <Navigate to={"/dashboard"} />
          }
        />
        <Route
          path="/dashboard"
          element={
            isSignedIn ? <DashboardPage isDark={isDark} setIsDark={setIsDark} /> : <Navigate to={"/"} />
          }
        />

        <Route
          path="/problems"
          element={
            isSignedIn ? <ProblemsPage isDark={isDark} setIsDark={setIsDark} /> : <Navigate to={"/"} />
          }
        />
        <Route
          path="/problem/:id"
          element={
            isSignedIn ? <ProblemPage isDark={isDark} setIsDark={setIsDark} /> : <Navigate to={"/"} />
          }
        />
        <Route
          path="/session/:id"
          element={
            isSignedIn ? <SessionPage isDark={isDark} setIsDark={setIsDark} /> : <Navigate to={"/"} />
          }
        />
      </Routes>
      <Toaster toastOptions={{ duration: 3000 }} />
    </div>
  );
}

export default App;
