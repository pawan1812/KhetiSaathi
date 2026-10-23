"use client";
import { ReactNode } from "react";
import Link from "next/link";

/* ════════ CARD ════════ */
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  style?: React.CSSProperties;
}
export function Card({ children, className = "", hover = true, padding = "md", style }: CardProps) {
  const pad = { none: "", sm: "p-4", md: "p-5", lg: "p-6" }[padding];
  return (
    <div
      className={`card ${pad} ${hover ? "" : "hover:transform-none hover:shadow-none"} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

/* ════════ STAT CARD ════════ */
interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  subtitle?: string;
  icon: ReactNode;
  iconBg?: string;
  iconColor?: string;
}
export function StatCard({ title, value, change, subtitle, icon, iconBg = "rgba(34,197,94,0.1)", iconColor = "var(--green-600)" }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
        {change !== undefined && (
          <span
            className="text-xs font-bold px-2 py-1 rounded-lg"
            style={{
              background: change >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              color: change >= 0 ? "var(--green-600)" : "#DC2626",
            }}
          >
            {change >= 0 ? "+" : ""}{change}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold mt-3" style={{ color: "var(--text-primary)" }}>{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wider mt-1" style={{ color: "var(--text-muted)" }}>{title}</p>
      {subtitle && <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{subtitle}</p>}
    </Card>
  );
}

/* ════════ CHART CARD ════════ */
interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}
export function ChartCard({ title, subtitle, action, children, className = "" }: ChartCardProps) {
  return (
    <Card padding="lg" className={className}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{title}</h3>
          {subtitle && <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

/* ════════ SECTION HEADER ════════ */
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}
export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{title}</h1>
        {subtitle && <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ════════ ALERT CARD ════════ */
const alertStyles = {
  danger:  { bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.25)",   icon: "rgba(239,68,68,0.15)",   iconColor: "#DC2626", label: "#DC2626" },
  warning: { bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)",  icon: "rgba(245,158,11,0.15)",  iconColor: "#D97706", label: "#D97706" },
  info:    { bg: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.25)",  icon: "rgba(59,130,246,0.15)",  iconColor: "#2563EB", label: "#2563EB" },
  success: { bg: "rgba(34,197,94,0.08)",   border: "rgba(34,197,94,0.25)",   icon: "rgba(34,197,94,0.15)",   iconColor: "#16A34A", label: "#16A34A" },
} as const;

interface AlertCardProps {
  icon: ReactNode;
  label: string;
  title: string;
  children: ReactNode;
  variant?: keyof typeof alertStyles;
}
export function AlertCard({ icon, label, title, children, variant = "danger" }: AlertCardProps) {
  const s = alertStyles[variant];
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: s.bg, border: `1px solid ${s.border}` }}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: s.icon, color: s.iconColor }}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: s.label }}>{label}</span>
          <h3 className="text-base font-bold mt-0.5" style={{ color: "var(--text-primary)" }}>{title}</h3>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ════════ ACTION CARD ════════ */
interface ActionCardProps {
  href: string;
  icon: ReactNode;
  label: string;
  iconBg?: string;
  iconColor?: string;
}
export function ActionCard({ href, icon, label, iconBg = "rgba(34,197,94,0.1)", iconColor = "var(--green-600)" }: ActionCardProps) {
  return (
    <Link href={href} className="quick-action group">
      <div
        className="quick-action-icon transition-transform duration-150 group-hover:scale-110"
        style={{ background: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>{label}</span>
    </Link>
  );
}

/* ════════ LIST ITEM ════════ */
interface ListItemProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  onClick?: () => void;
}
export function ListItem({ icon, title, subtitle, trailing, onClick }: ListItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-3 rounded-xl transition-all duration-150 interactive"
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{title}</p>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{subtitle}</p>}
      </div>
      {trailing}
    </div>
  );
}

/* ════════ BADGE ════════ */
const badgeMap = {
  success: "badge-success",
  warning: "badge-warning",
  danger:  "badge-danger",
  info:    "badge-info",
  neutral: "",
} as const;

interface BadgeProps {
  children: ReactNode;
  variant?: keyof typeof badgeMap;
}
export function Badge({ children, variant = "neutral" }: BadgeProps) {
  return (
    <span
      className={`badge ${badgeMap[variant]}`}
      style={variant === "neutral" ? { background: "var(--bg-muted)", color: "var(--text-secondary)" } : {}}
    >
      {children}
    </span>
  );
}
