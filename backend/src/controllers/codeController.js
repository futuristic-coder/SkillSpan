import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const EXECUTION_TIMEOUT_MS = 8000;
const SUPPORTED_LANGUAGES = new Set(['javascript', 'python', 'java']);

const runProcess = ({ command, args, cwd, stdin = '', timeoutMs = EXECUTION_TIMEOUT_MS }) =>
  new Promise((resolve) => {
    const child = spawn(command, args, { cwd, windowsHide: true });

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    try {
      if (typeof stdin === 'string' && stdin.length > 0) {
        child.stdin.write(stdin);
      }
      child.stdin.end();
    } catch {
      // no-op
    }

    child.on('error', (error) => {
      clearTimeout(timer);
      resolve({ ok: false, stdout, stderr: error.message, code: null, timedOut });
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ ok: code === 0 && !timedOut, stdout, stderr, code, timedOut });
    });
  });

const runWithCommandCandidates = async ({ commands, cwd, stdin, timeoutMs }) => {
  let lastResult = null;

  for (const candidate of commands) {
    const result = await runProcess({
      command: candidate.command,
      args: candidate.args,
      cwd,
      stdin,
      timeoutMs,
    });

    if (result.ok) {
      return result;
    }

    const missingCommand = /not recognized|ENOENT|cannot find/i.test(result.stderr || '');
    lastResult = result;

    if (!missingCommand) {
      return result;
    }
  }

  return (
    lastResult || {
      ok: false,
      stdout: '',
      stderr: 'No executable runtime found for this language',
      code: null,
      timedOut: false,
    }
  );
};

const executeJavascript = async ({ code, tempDir, stdin }) => {
  const filePath = path.join(tempDir, 'main.js');
  await writeFile(filePath, code, 'utf8');

  return runWithCommandCandidates({
    commands: [{ command: 'node', args: [filePath] }],
    cwd: tempDir,
    stdin,
  });
};

const executePython = async ({ code, tempDir, stdin }) => {
  const filePath = path.join(tempDir, 'main.py');
  await writeFile(filePath, code, 'utf8');

  return runWithCommandCandidates({
    commands: [
      { command: 'python', args: [filePath] },
      { command: 'py', args: ['-3', filePath] },
    ],
    cwd: tempDir,
    stdin,
  });
};

const executeJava = async ({ code, tempDir, stdin }) => {
  const filePath = path.join(tempDir, 'Solution.java');
  await writeFile(filePath, code, 'utf8');

  const compileResult = await runWithCommandCandidates({
    commands: [{ command: 'javac', args: [filePath] }],
    cwd: tempDir,
    stdin: '',
  });

  if (!compileResult.ok) {
    return compileResult;
  }

  return runWithCommandCandidates({
    commands: [{ command: 'java', args: ['-cp', tempDir, 'Solution'] }],
    cwd: tempDir,
    stdin,
  });
};

const normalizeFailure = (result) => {
  if (result.timedOut) {
    return 'Execution timed out';
  }

  if (result.stderr?.trim()) {
    return result.stderr.trim();
  }

  return 'Execution failed';
};

export const executeCode = async (req, res) => {
  const { language, code, stdin } = req.body || {};

  if (!language || !SUPPORTED_LANGUAGES.has(language)) {
    return res.status(400).json({ success: false, error: 'Unsupported language' });
  }

  if (typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ success: false, error: 'Code is required' });
  }

  if (stdin != null && typeof stdin !== 'string') {
    return res.status(400).json({ success: false, error: 'stdin must be a string' });
  }

  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'skillspan-run-'));

  try {
    let result;

    if (language === 'javascript') {
      result = await executeJavascript({ code, tempDir, stdin: stdin || '' });
    } else if (language === 'python') {
      result = await executePython({ code, tempDir, stdin: stdin || '' });
    } else {
      result = await executeJava({ code, tempDir, stdin: stdin || '' });
    }

    if (!result.ok) {
      return res.status(200).json({
        success: false,
        output: result.stdout || '',
        error: normalizeFailure(result),
      });
    }

    return res.status(200).json({
      success: true,
      output: result.stdout || 'No output',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Execution service failed: ${error.message}`,
    });
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
};
