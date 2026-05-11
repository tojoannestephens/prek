import { Link } from "react-router-dom";
import { MapPin, BookMarked, MessageCircle, Lock, ChevronRight } from "lucide-react";

const ITEMS = [
  { label: "Locations", desc: "Find rooms and sessions", Icon: MapPin, route: "/locations", color: "#145261" },
  { label: "Resources", desc: "", Icon: BookMarked, route: "/resources", color: "#F6B829" },
  { label: "Feedback", desc: "Share your thoughts", Icon: MessageCircle, route: "/feedback", color: "#541011" },
  { label: "Admin", desc: "PIN-protected editing", Icon: Lock, route: "/admin", color: "#092936" },
];

export default function More() {
  return (
    <div className="p-4 pb-10" data-testid="more-screen">
      <p
        className="font-extrabold tracking-[0.15em] uppercase mb-3"
        style={{ color: "#145261", fontSize: 12 }}
      >
        Explore More
      </p>

      {ITEMS.map((it) => {
        const Icon = it.Icon;
        const dark = it.color === "#F6B829";
        return (
          <Link
            key={it.label}
            to={it.route}
            data-testid={`more-${it.label.toLowerCase()}`}
            className="flex items-center bg-white rounded-[14px] p-3.5 mb-2.5 border"
            style={{ borderColor: "rgba(20,82,97,0.15)" }}
          >
            <div
              className="rounded-[12px] flex items-center justify-center mr-3"
              style={{ width: 44, height: 44, background: it.color }}
            >
              <Icon size={22} color={dark ? "#092936" : "#FFFFFF"} strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <p className="font-bold" style={{ color: "#092936", fontSize: 16 }}>
                {it.label}
              </p>
              {it.desc && (
                <p className="mt-0.5" style={{ color: "#5A6A72", fontSize: 13 }}>
                  {it.desc}
                </p>
              )}
            </div>
            <ChevronRight size={22} color="#5A6A72" />
          </Link>
        );
      })}

      <div className="flex flex-col items-center mt-8">
        <p className="font-extrabold tracking-[0.1em]" style={{ color: "#145261", fontSize: 14 }}>
          Success Starts Here
        </p>
        <p className="mt-1" style={{ color: "#5A6A72", fontSize: 12 }}>
          Nurture. Guide. Empower. · 2026
        </p>
      </div>
    </div>
  );
}
