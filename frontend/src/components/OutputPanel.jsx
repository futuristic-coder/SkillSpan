function OutputPanel({ isDark, output }) {
  const scannerInputHint =
    output &&
    !output.success &&
    typeof output.error === "string" &&
    output.error.includes("NoSuchElementException")
      ? "Input ended early. Provide all tokens expected by Scanner in Custom Input (stdin)."
      : null;

  return (
    <div className={isDark ? "flex h-full flex-col bg-slate-950" : "flex h-full flex-col bg-white"}>
      <div className={isDark ? "border-b border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold" : "border-b border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold"}>
        Output
      </div>
      <div className="flex-1 overflow-auto p-4">
        {output === null ? (
          <p className={isDark ? "text-sm text-slate-500" : "text-sm text-slate-400"}>Click "Run Code" to see the output here...</p>
        ) : output.success ? (
          <pre className="whitespace-pre-wrap font-mono text-sm text-emerald-400">{output.output}</pre>
        ) : (
          <div>
            {output.output && (
              <pre className={isDark ? "mb-2 whitespace-pre-wrap font-mono text-sm text-slate-300" : "mb-2 whitespace-pre-wrap font-mono text-sm text-slate-900"}>
                {output.output}
              </pre>
            )}
            <pre className="whitespace-pre-wrap font-mono text-sm text-rose-400">{output.error}</pre>
            {scannerInputHint && (
              <p className={isDark ? "mt-2 text-xs text-amber-300" : "mt-2 text-xs text-amber-700"}>{scannerInputHint}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;