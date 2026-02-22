import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  isDark,
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}) {
  return (
    <div className={isDark ? "flex h-full flex-col bg-slate-900" : "flex h-full flex-col bg-slate-50"}>
      <div className={isDark ? "flex items-center justify-between border-t border-slate-700 bg-slate-950 px-4 py-3" : "flex items-center justify-between border-t border-slate-300 bg-white px-4 py-3"}>
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="size-6"
          />
          <select className={isDark ? "rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-100" : "rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900"} value={selectedLanguage} onChange={onLanguageChange}>
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button className={isDark ? "inline-flex items-center gap-2 rounded-lg border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-50" : "inline-flex items-center gap-2 rounded-lg border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-50"} disabled={isRunning} onClick={onRunCode}>
          {isRunning ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <PlayIcon className="size-4" />
              Run Code
            </>
          )}
        </button>
      </div>

      <div className="flex-1">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme={isDark ? "vs-dark" : "vs"}
          options={{
            fontSize: 16,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;