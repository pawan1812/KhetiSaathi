"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, TrendingUp, MessageCircle, AlertTriangle, Camera } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";

export default function BottomNav() {
  const pathname = usePathname();
  const { language } = useAppStore();
  const t = getTranslation(language);

  const items = [
    { href: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { href: "/market",    label: language === "mr" ? "बाजारभाव" : language === "hi" ? "मंडी भाव" : "Market", icon: TrendingUp },
    { href: "/scanner",   label: language === "mr" ? "पान स्कॅनर" : language === "hi" ? "स्कैनर" : "AI Scan", icon: Camera, isCenter: true },
    { href: "/chat",      label: language === "mr" ? "कृषी AI" : language === "hi" ? "AI सहायक" : "AI Sahayak", icon: MessageCircle },
    { href: "/crisis",    label: language === "mr" ? "संकट" : language === "hi" ? "संकट" : "Crisis", icon: AlertTriangle },
  ];

  return (
    <nav className="bottom-nav lg:hidden">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        if (item.isCenter) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center -mt-5 relative group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 border-2 border-white dark:border-emerald-950 group-active:scale-95 transition-transform">
                <Camera className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span
                className="text-[10px] font-black mt-1"
                style={{ color: "var(--green-600)" }}
              >
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all duration-150 relative"
          >
            <item.icon
              className="w-5 h-5"
              style={{ color: active ? "var(--green-600)" : "var(--text-muted)" }}
            />
            <span
              className="text-[10px] font-semibold"
              style={{ color: active ? "var(--green-600)" : "var(--text-muted)" }}
            >
              {item.label}
            </span>
            {item.href === "/crisis" && (
              <span className="absolute top-0.5 right-1 w-1.5 h-1.5 bg-red-500 rounded-full pulse-dot" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

