import { NavLink, useLocation } from "react-router-dom";
import { Home, Calendar, Users, Sparkles, Menu } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", title: "Nurture. Guide. Empower.", icon: Home, testid: "tab-home" },
  { to: "/agenda", label: "Agenda", title: "Today's Agenda", icon: Calendar, testid: "tab-agenda" },
  { to: "/group", label: "My Group", title: "Group Rotation", icon: Users, testid: "tab-group" },
  { to: "/sessions", label: "Sessions", title: "Sessions", icon: Sparkles, testid: "tab-sessions" },
  { to: "/more", label: "More", title: "More", icon: Menu, testid: "tab-more" },
];

const SUBPAGES = {
  "/locations": { title: "Locations", bg: "#145261" },
  "/resources": { title: "Resources", bg: "#145261" },
  "/feedback": { title: "Feedback", bg: "#145261" },
  "/admin": { title: "Admin", bg: "#092936" },
};

export default function Layout({ children }) {
  const location = useLocation();
  const tab = tabs.find((t) => (t.to === "/" ? location.pathname === "/" : location.pathname.startsWith(t.to)));
  const sub = SUBPAGES[location.pathname];
  const headerTitle = sub?.title || tab?.title || "";
  const headerBg = sub?.bg || "#145261";

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]" data-testid="app-layout">
      {/* Top header bar */}
      <header
        className="sticky top-0 z-40 px-4 py-3.5 flex items-center justify-center"
        style={{ background: headerBg, color: "#FFFFFF" }}
        data-testid="page-header"
      >
        <h1 className="text-[17px] font-bold tracking-tight">{headerTitle}</h1>
      </header>

      <main className="flex-1 pb-20 max-w-2xl mx-auto w-full" data-testid="main-content">
        {children}
      </main>

      {/* Bottom tab bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t"
        style={{ borderColor: "rgba(20, 82, 97, 0.15)" }}
        data-testid="bottom-nav"
      >
        <div className="max-w-2xl mx-auto grid grid-cols-5">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = t.to === "/" ? location.pathname === "/" : location.pathname.startsWith(t.to);
            return (
              <NavLink
                key={t.to}
                to={t.to}
                data-testid={t.testid}
                className="flex flex-col items-center justify-center py-2 gap-1"
                style={{ color: active ? "#145261" : "#94A3A8" }}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
                <span className="text-[11px] font-semibold">{t.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
