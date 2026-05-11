import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { MapPin, Shield, Sparkles, BookOpen, Glasses } from "lucide-react";

const iconFor = (title) => {
  if (title.includes("Policy")) return Shield;
  if (title.includes("MagicSchool")) return Sparkles;
  if (title.includes("Technology")) return BookOpen;
  if (title.includes("VR")) return Glasses;
  return BookOpen;
};

export default function Sessions() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/sessions").then((r) => {
      const sorted = [...r.data].sort((a, b) => a.title.localeCompare(b.title));
      setItems(sorted);
    }).catch(() => {});
  }, []);

  return (
    <div className="px-5 pt-8" data-testid="sessions-page">
      <h1 className="font-display text-4xl" style={{ color: "#092936", fontWeight: 700 }}>
        Today's Sessions
      </h1>
      <p className="mt-2 text-[15px]" style={{ color: "#3D5560" }}>
        Four powerful breakouts.
      </p>

      <div className="mt-6 space-y-3" data-testid="sessions-list">
        {items.map((s, i) => {
          const Icon = iconFor(s.title);
          return (
            <div
              key={s.id}
              className="bg-white border border-[#E8DFCF] rounded-2xl px-5 py-5"
              data-testid={`session-card-${i}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#F4EFE6", color: "#145261" }}
                >
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg leading-snug" style={{ color: "#092936", fontWeight: 700 }}>
                    {s.title}
                  </h3>
                  <div className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#145261" }}>
                    <MapPin size={12} /> {s.location}
                  </div>
                  <p className="mt-2.5 text-[14px] leading-relaxed" style={{ color: "#3D5560" }}>
                    {s.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-8" />
    </div>
  );
}
