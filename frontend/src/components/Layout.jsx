import { NavLink, useLocation } from "react-router-dom";
import { Home, CalendarDays, Users, BookOpen, Menu } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", icon: Home, testid: "tab-home" },
  { to: "/agenda", label: "Agenda", icon: CalendarDays, testid: "tab-agenda" },
  { to: "/group", label: "My Group", icon: Users, testid: "tab-group" },
  { to: "/sessions", label: "Sessions", icon: BookOpen, testid: "tab-sessions" },
  { to: "/more", label: "More", icon: Menu, testid: "tab-more" },
];

export default function Layout({ children }) {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]" data-testid="app-layout">
      <main className="flex-1 pb-24 max-w-2xl mx-auto w-full" data-testid="main-content">
        <div key={location.pathname} className="fade-up">{children}</div>
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E8DFCF]"
        data-testid="bottom-nav"
      >
        <div className="max-w-2xl mx-auto grid grid-cols-5">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active =
              t.to === "/" ? location.pathname === "/" : location.pathname.startsWith(t.to);
            return (
              <NavLink
                key={t.to}
                to={t.to}
                data-testid={t.testid}
                className="flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors"
                style={{ color: active ? "#145261" : "#6B7B82" }}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                <span className="text-[11px] font-semibold tracking-wide">
                  {t.label}
                </span>
                {active && (
                  <span
                    className="absolute bottom-0 h-1 w-8 rounded-t-full"
                    style={{ background: "#F6B829", transform: "translateY(0)" }}
                  />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
