import { useMemo, useState } from "react";
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

const GENERATED_PROBLEMS_KEY = "generatedProblems";

const getStoredGeneratedProblems = () => {
  try {
    const raw = localStorage.getItem(GENERATED_PROBLEMS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item) => item?.id && item?.title && item?.description?.text);
  } catch {
    return [];
  }
};

const buildStdinFromExample = (exampleInput = "") => {
  if (!exampleInput) return "";

  const normalized = String(exampleInput)
    .replace(/\r/g, "")
    .replace(/\bnums\s*=\s*/gi, "")
    .replace(/\barr\s*=\s*/gi, "")
    .replace(/\barray\s*=\s*/gi, "")
    .replace(/\btarget\s*=\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const bracketMatch = normalized.match(/\[([^\]]*)\]/);
  const lines = [];

  if (bracketMatch) {
    const arr = bracketMatch[1]
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    if (arr.length) {
      lines.push(String(arr.length));
      lines.push(arr.join(" "));
    }
  }

  const afterArray = bracketMatch
    ? normalized.slice(bracketMatch.index + bracketMatch[0].length).trim()
    : normalized;

  const numberTokens = afterArray.match(/-?\d+/g) || [];
  numberTokens.forEach((token) => lines.push(token));

  return lines.join("\n").trim();
};

function ProblemPage({ isDark, setIsDark }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const allProblemsById = useMemo(
    () => ({
      ...PROBLEMS,
      ...Object.fromEntries(getStoredGeneratedProblems().map((problem) => [problem.id, problem])),
    }),
    []
  );

  const currentProblemId = id && allProblemsById[id] ? id : "two-sum";
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [codeByProblemLanguage, setCodeByProblemLanguage] = useState({});
  const [stdinByProblemLanguage, setStdinByProblemLanguage] = useState({});
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const isMobile = useIsMobile();

  const currentProblem = allProblemsById[currentProblemId];

  const codeKey = `${currentProblemId}:${selectedLanguage}`;
  const stdinKey = `${currentProblemId}:${selectedLanguage}`;
  const code =
    codeByProblemLanguage[codeKey] ?? currentProblem.starterCode[selectedLanguage];
  const stdin = stdinByProblemLanguage[stdinKey] ?? "";

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setOutput(null);
  };

  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);

  const handleResetCode = () => {
    const starter = currentProblem.starterCode[selectedLanguage] || "";
    setCodeByProblemLanguage((prev) => ({
      ...prev,
      [codeKey]: starter,
    }));
  };

  const handleAutofillInput = () => {
    const firstExampleInput = currentProblem?.examples?.[0]?.input || "";
    const generated = buildStdinFromExample(firstExampleInput);

    if (!generated) {
      toast.error("No example input available to auto-fill.");
      return;
    }

    setStdinByProblemLanguage((prev) => ({
      ...prev,
      [stdinKey]: generated,
    }));
    toast.success("Input auto-filled from Example 1.");
  };

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
    const readsStdin = /(Scanner|System\.in|nextInt\(|nextLine\(|input\(|readline\()/i.test(code);

    if (readsStdin && !stdin.trim()) {
      toast.error("This code expects input. Fill the Custom Input (stdin) box first.");
      return;
    }

    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code, stdin);
    setOutput(result);
    setIsRunning(false);

    // check if code executed successfully and matches expected output
    const isGeneratedProblem = currentProblemId.startsWith("ai-");

    if (result.success) {
      if (isGeneratedProblem) {
        toast.success("Code executed successfully!");
        return;
      }

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

      <Navbar isDark={isDark} setIsDark={setIsDark} fixedTop />

      <div className="flex-1 overflow-visible px-3 pb-3 pt-20 sm:px-4 lg:overflow-hidden lg:px-8 lg:pb-6">
        {isMobile ? (
          <div className="space-y-3 pb-2">
            <div className={isDark ? "overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-sm" : "overflow-hidden rounded-2xl border border-slate-300 bg-white/90 backdrop-blur-sm"}>
              <ProblemDescription
                isDark={isDark}
                problem={currentProblem}
                currentProblemId={currentProblemId}
                onProblemChange={handleProblemChange}
                allProblems={Object.values(allProblemsById)}
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
                stdin={stdin}
                onStdinChange={(value) =>
                  setStdinByProblemLanguage((prev) => ({
                    ...prev,
                    [stdinKey]: value,
                  }))
                }
                onResetCode={handleResetCode}
                onAutofillInput={handleAutofillInput}
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
                  allProblems={Object.values(allProblemsById)}
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
                      stdin={stdin}
                      onStdinChange={(value) =>
                        setStdinByProblemLanguage((prev) => ({
                          ...prev,
                          [stdinKey]: value,
                        }))
                      }
                      onResetCode={handleResetCode}
                      onAutofillInput={handleAutofillInput}
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