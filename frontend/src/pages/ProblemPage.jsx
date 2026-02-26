import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../config/piston";
import useIsMobile from "../hooks/useIsMobile";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemPage({ isDark, setIsDark }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentProblemId = id && PROBLEMS[id] ? id : "two-sum";
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [codeByProblemLanguage, setCodeByProblemLanguage] = useState({});
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const isMobile = useIsMobile();

  const currentProblem = PROBLEMS[currentProblemId];

  const codeKey = `${currentProblemId}:${selectedLanguage}`;
  const code =
    codeByProblemLanguage[codeKey] ?? currentProblem.starterCode[selectedLanguage];

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setOutput(null);
  };

  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output) => {
    // normalize output for comparison (trim whitespace, handle different spacing)
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          // remove spaces after [ and before ]
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          // normalize spaces around commas to single space after comma
          .replace(/\s*,\s*/g, ",")
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);

    return normalizedActual == normalizedExpected;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);

    // check if code executed successfully and matches expected output

    if (result.success) {
      const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
      const testsPassed = checkIfTestsPassed(result.output, expectedOutput);

      if (testsPassed) {
        triggerConfetti();
        toast.success("All tests passed! Great job!");
      } else {
        toast.error("Tests failed. Check your output!");
      }
    } else {
      toast.error("Code execution failed!");
    }
  };

  return (
    <div className={isDark ? "relative flex min-h-screen flex-col overflow-x-hidden bg-slate-950 text-slate-100 lg:h-screen lg:overflow-hidden" : "relative flex min-h-screen flex-col overflow-x-hidden bg-slate-100 text-slate-900 lg:h-screen lg:overflow-hidden"}>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className={isDark ? "absolute -top-44 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" : "absolute -top-44 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-300/40 blur-3xl"} />
        <div className={isDark ? "absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" : "absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl"} />
      </div>

      <Navbar isDark={isDark} setIsDark={setIsDark} />

      <div className="flex-1 overflow-visible px-3 pb-3 pt-3 sm:px-4 lg:overflow-hidden lg:px-8 lg:pb-6">
        {isMobile ? (
          <div className="space-y-3 pb-2">
            <div className={isDark ? "overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-sm" : "overflow-hidden rounded-2xl border border-slate-300 bg-white/90 backdrop-blur-sm"}>
              <ProblemDescription
                isDark={isDark}
                problem={currentProblem}
                currentProblemId={currentProblemId}
                onProblemChange={handleProblemChange}
                allProblems={Object.values(PROBLEMS)}
              />
            </div>

            <div className={isDark ? "h-[54vh] min-h-[360px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-sm" : "h-[54vh] min-h-[360px] overflow-hidden rounded-2xl border border-slate-300 bg-white/90 backdrop-blur-sm"}>
              <CodeEditorPanel
                isDark={isDark}
                selectedLanguage={selectedLanguage}
                code={code}
                isRunning={isRunning}
                onLanguageChange={handleLanguageChange}
                onCodeChange={(value) =>
                  setCodeByProblemLanguage((prev) => ({
                    ...prev,
                    [codeKey]: value || "",
                  }))
                }
                onRunCode={handleRunCode}
              />
            </div>

            <div className={isDark ? "h-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-sm" : "h-56 overflow-hidden rounded-2xl border border-slate-300 bg-white/90 backdrop-blur-sm"}>
              <OutputPanel isDark={isDark} output={output} />
            </div>
          </div>
        ) : (
          <PanelGroup direction="horizontal">
            {/* left panel- problem desc */}
            <Panel defaultSize={40} minSize={30}>
              <div className={isDark ? "h-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-sm" : "h-full overflow-hidden rounded-2xl border border-slate-300 bg-white/90 backdrop-blur-sm"}>
                <ProblemDescription
                  isDark={isDark}
                  problem={currentProblem}
                  currentProblemId={currentProblemId}
                  onProblemChange={handleProblemChange}
                  allProblems={Object.values(PROBLEMS)}
                />
              </div>
            </Panel>

            <PanelResizeHandle className={isDark ? "w-2 cursor-col-resize bg-slate-700 transition-colors hover:bg-indigo-500" : "w-2 cursor-col-resize bg-slate-300 transition-colors hover:bg-indigo-500"} />

            {/* right panel- code editor & output */}
            <Panel defaultSize={60} minSize={30}>
              <div className={isDark ? "h-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-sm" : "h-full overflow-hidden rounded-2xl border border-slate-300 bg-white/90 backdrop-blur-sm"}>
                <PanelGroup direction="vertical">
                  {/* Top panel - Code editor */}
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditorPanel
                      isDark={isDark}
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={(value) =>
                        setCodeByProblemLanguage((prev) => ({
                          ...prev,
                          [codeKey]: value || "",
                        }))
                      }
                      onRunCode={handleRunCode}
                    />
                  </Panel>

                  <PanelResizeHandle className={isDark ? "h-2 cursor-row-resize bg-slate-700 transition-colors hover:bg-indigo-500" : "h-2 cursor-row-resize bg-slate-300 transition-colors hover:bg-indigo-500"} />

                  {/* Bottom panel - Output Panel*/}

                  <Panel defaultSize={30} minSize={30}>
                    <OutputPanel isDark={isDark} output={output} />
                  </Panel>
                </PanelGroup>
              </div>
            </Panel>
          </PanelGroup>
        )}
      </div>
    </div>
  );
}

export default ProblemPage;