import Link from "next/link";
import { Leaf, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-muted)] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-500 flex items-center justify-center">
          <Leaf className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-6xl font-bold text-emerald-600 mb-2">404</h1>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Page Not Found</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          This field hasn&apos;t been planted yet. Let&apos;s get you back to the dashboard.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2">
            <Home className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
