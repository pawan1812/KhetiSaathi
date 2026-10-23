"use client";
import { Leaf, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-[var(--bg-muted)] flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-500 flex items-center justify-center">
              <Leaf className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Something went wrong</h1>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Don&apos;t worry, your data is safe. Please try again.
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
