import { Link } from "react-router-dom";
import { MapPin, BookOpen, MessageSquare, Lock, ChevronRight } from "lucide-react";

const ROWS = [
  { to: "/locations", label: "Locations", desc: "Find rooms and sessions", Icon: MapPin, color: "#145261" },
  { to: "/resources", label: "Resources", desc: null, Icon: BookOpen, color: "#541011" },
  { to: "/feedback", label: "Feedback", desc: "Share your thoughts", Icon: MessageSquare, color: "#F6B829" },
  { to: "/admin", label: "Admin", desc: "PIN-protected editing", Icon: Lock, color: "#092936" },
];

export default function More() {
  return (
    <div className="px-5 pt-8" data-testid="more-page">
      <h1 className="font-display text-4xl" style={{ color: "#092936", fontWeight: 700 }}>
        More
      </h1>

      <div className="mt-6 space-y-3" data-testid="more-list">
        {ROWS.map((r) => {
          const Icon = r.Icon;
          const dark = r.color === "#F6B829";
          return (
            <Link
              key={r.to}
              to={r.to}
              data-testid={`more-${r.label.toLowerCase()}`}
              className="bg-white border border-[#E8DFCF] rounded-2xl px-4 py-4 flex items-center gap-4 hover:border-[#145261] transition-colors"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: r.color, color: dark ? "#092936" : "#FFFFFF" }}
              >
                <Icon size={20} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg leading-tight" style={{ color: "#092936", fontWeight: 700 }}>
                  {r.label}
                </h3>
                {r.desc && (
                  <p className="text-[13px]" style={{ color: "#6B7B82" }}>
                    {r.desc}
                  </p>
                )}
              </div>
              <ChevronRight size={20} style={{ color: "#6B7B82" }} />
            </Link>
          );
        })}
      </div>

      <p
        className="mt-10 text-center text-[12px]"
        style={{ color: "#6B7B82" }}
        data-testid="more-footer"
      >
        Success Starts Here · Nurture. Guide. Empower. · 2026
      </p>
      <div className="h-8" />
    </div>
  );
}
