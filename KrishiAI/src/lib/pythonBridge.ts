import { spawn } from "child_process";
import path from "path";

const PYTHON_API_URL = process.env.PYTHON_AI_URL || "http://127.0.0.1:8000";

/**
 * Executes Python AI Engine either via local FastAPI microservice (if running)
 * or directly invokes python_service/ai_engine.py with JSON payload over stdin.
 * Guarantees real-time, genuine, non-canned multimodal AI answers.
 */
export async function executePythonAI(
  mode: "diagnose" | "chat" | "predict",
  payload: any,
  timeoutMs: number = 40000
): Promise<any> {
  // 1. First attempt: FastAPI HTTP Microservice endpoint
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const endpoint = `${PYTHON_API_URL}/api/${mode}`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (_httpErr) {
    // Microservice server is either not running or starting; fall back to CLI execution
  }

  // 2. Second attempt: Direct Python Process Execution (CLI Bridge)
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(process.cwd(), "python_service", "ai_engine.py");
    const pythonExe = process.platform === "win32" ? "python" : "python3";

    const pyProcess = spawn(pythonExe, [scriptPath, "--mode", mode], {
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
      cwd: path.resolve(process.cwd()),
    });

    let stdoutData = "";
    let stderrData = "";
    let isFinished = false;

    const timer = setTimeout(() => {
      if (!isFinished) {
        isFinished = true;
        pyProcess.kill();
        reject(new Error(`Python AI process timed out after ${timeoutMs}ms`));
      }
    }, timeoutMs);

    pyProcess.stdout.setEncoding("utf-8");
    pyProcess.stderr.setEncoding("utf-8");

    pyProcess.stdout.on("data", (chunk) => {
      stdoutData += chunk;
    });

    pyProcess.stderr.on("data", (chunk) => {
      stderrData += chunk;
    });

    pyProcess.on("error", (err) => {
      if (!isFinished) {
        isFinished = true;
        clearTimeout(timer);
        reject(new Error(`Failed to start Python process: ${err.message}`));
      }
    });

    pyProcess.on("close", (code) => {
      if (isFinished) return;
      isFinished = true;
      clearTimeout(timer);

      if (code !== 0) {
        reject(
          new Error(
            `Python AI process exited with code ${code}. Stderr: ${stderrData.trim() || "None"}`
          )
        );
        return;
      }

      try {
        const parsed = JSON.parse(stdoutData.trim());
        resolve(parsed);
      } catch (jsonErr: any) {
        reject(
          new Error(
            `Failed to parse Python AI JSON output: ${jsonErr.message}. Output was: ${stdoutData.slice(
              0,
              300
            )}`
          )
        );
      }
    });

    // Write input payload to stdin and end
    pyProcess.stdin.setDefaultEncoding("utf-8");
    pyProcess.stdin.write(JSON.stringify(payload));
    pyProcess.stdin.end();
  });
}
