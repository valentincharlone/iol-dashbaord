"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const PortfolioIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>
  </svg>
);
const QuotesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
  </svg>
);
const MovementsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const ProfileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const DocsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);
const CollapseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>
  </svg>
);

const NAV = [
  { href: "/dashboard",              label: "Portafolio",    icon: <PortfolioIcon /> },
  { href: "/dashboard/cotizaciones", label: "Cotizaciones",  icon: <QuotesIcon /> },
  { href: "/dashboard/movimientos",  label: "Movimientos",   icon: <MovementsIcon /> },
  { href: "/dashboard/perfil",       label: "Mi perfil",     icon: <ProfileIcon /> },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname();
  const w = collapsed ? 64 : 220;

  function isActive(href: string) {
    return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
  }

  return (
    <aside style={{
      width: w, minWidth: w, height: "100vh", position: "sticky", top: 0,
      background: "#fff", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
      transition: "width 0.25s ease, min-width 0.25s ease",
      overflow: "hidden", zIndex: 20, flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: collapsed ? "20px 0" : "20px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderBottom: "1px solid var(--border)", minHeight: 64,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: "linear-gradient(135deg, #4338CA, #818CF8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 700, fontSize: 12, letterSpacing: -0.5,
        }}>IOL</div>
        {!collapsed && (
          <span style={{ fontWeight: 600, fontSize: 15, color: "var(--text-1)", whiteSpace: "nowrap" }}>
            Dashboard
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: collapsed ? "10px 0" : "10px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 8,
                textDecoration: "none",
                background: active ? "#EEF2FF" : "transparent",
                color: active ? "#4338CA" : "var(--text-2)",
                fontWeight: active ? 600 : 400, fontSize: 14, whiteSpace: "nowrap",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "#F5F6FA";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* API Docs */}
      <div style={{ padding: "0 10px 8px" }}>
        <a
          href="/api-docs.html"
          target="_blank"
          rel="noopener noreferrer"
          title="Documentación API IOL"
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: collapsed ? "10px 0" : "10px 12px",
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: 8, textDecoration: "none",
            color: "var(--text-3)", fontSize: 14, whiteSpace: "nowrap",
            transition: "background 0.15s ease, color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#F5F6FA";
            e.currentTarget.style.color = "var(--text-2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-3)";
          }}
        >
          <span style={{ flexShrink: 0 }}><DocsIcon /></span>
          {!collapsed && <span>API Docs</span>}
        </a>
      </div>

      {/* Logout */}
      <div
        onClick={() => signOut({ callbackUrl: "/login" })}
        title="Cerrar sesión"
        style={{
          padding: "12px 0",
          display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
          cursor: "pointer", color: "var(--text-3)", transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#EF4444")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        {!collapsed && <span style={{ fontSize: 13, fontWeight: 500 }}>Cerrar sesión</span>}
      </div>

      {/* Toggle */}
      <div
        onClick={onToggle}
        style={{
          padding: "16px 0", borderTop: "1px solid var(--border)",
          display: "flex", justifyContent: "center",
          cursor: "pointer", color: "var(--text-3)", transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#4338CA")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
      >
        <span style={{
          transform: collapsed ? "scaleX(-1)" : "none",
          transition: "transform 0.25s", display: "flex",
        }}>
          <CollapseIcon />
        </span>
      </div>
    </aside>
  );
}
