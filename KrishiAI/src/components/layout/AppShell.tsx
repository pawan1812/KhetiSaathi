"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import { getCurrentUser, logoutUser, setAuthenticatedUser } from "@/lib/userAuth";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("khetisaathi-theme") ?? localStorage.getItem("krishiai-theme") ?? "light";
    document.documentElement.setAttribute("data-theme", saved);

    // Strict Guard: check local session first
    const user = getCurrentUser();
    if (!user || !user.uid) {
      router.replace("/auth");
      return;
    }

    // Immediately grant entry & render UI
    setMounted(true);

    // Keep cookies synchronized with local state
    if (typeof document !== "undefined") {
      try {
        const token = btoa(JSON.stringify({ uid: user.uid, phone: user.phone || "", username: user.username || "", time: Date.now() }));
        document.cookie = `khetisaathi_session=${token}; path=/; max-age=2592000; SameSite=Lax`;
        document.cookie = `khetisaathi_uid=${encodeURIComponent(user.uid)}; path=/; max-age=2592000; SameSite=Lax`;
      } catch {}
    }

    // Refresh user profile from database in background (never kick out on slow network / temporary latency)
    fetch(`/api/auth/me?uid=${encodeURIComponent(user.uid)}`)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data?.success && data?.user) {
            setAuthenticatedUser(data.user);
          }
        }
      })
      .catch((err) => {
        console.warn("[AppShell] Background profile sync warning:", err);
      });
  }, [router, pathname]);

  if (!mounted) {
    return (
      <div style={{ background: "var(--bg-base)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--green-500)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(34,197,94,0.3)" }}>
            <span style={{ fontSize: 22 }}>🌿</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 14, fontWeight: 600 }}>Loading KhetiSaathi…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: "var(--bg-base)" }}>
      {/* Floating agricultural background image & luminous green aurora orbs */}
      <div className="app-bg-image-layer" />
      <div className="app-floating-orb app-orb-1" />
      <div className="app-floating-orb app-orb-2" />
      <div className="app-floating-orb app-orb-3" />

      <Sidebar />
      <div className="main-content-area relative z-10">
        <TopBar />
        {/* page-content class gives EQUAL 24px padding on ALL sides + 24px gap between rows */}
        <main className="page-content pb-28 lg:pb-6" style={{ maxWidth: 1400, width: "100%", margin: "0 auto" }}>
          {children}
        </main>
      </div>

      {/* Floating Flowing Farmer Mascot Helper "Kisan Mitra" */}
      <Link
        href="/scanner"
        className="fixed bottom-20 sm:bottom-6 right-5 z-40 hidden sm:flex items-center gap-3 p-2 pr-4 rounded-full bg-emerald-900/90 hover:bg-emerald-800 text-white shadow-xl shadow-emerald-950/40 border border-emerald-400/40 backdrop-blur-md group transition-all duration-200 hover:scale-105"
        title="KhetiSaathi AI — Voice & Leaf Doctor"
      >
        <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-400 shadow-sm flex-shrink-0">
          <img
            src="/kisan_mascot.jpg"
            alt="Kisan Mitra"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=200&q=80";
            }}
          />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-black text-emerald-300 leading-tight">👨‍🌾 शेतीसाथी AI डॉक्टर</p>
          <p className="text-[10px] text-emerald-100 font-semibold">बोलून विचारा / पान स्कॅन करा</p>
        </div>
      </Link>

      <BottomNav />
    </div>
  );
}
