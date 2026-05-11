import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { MapPin, Clock } from "lucide-react";

const typeStyles = {
  general: { bg: "#F4EFE6", color: "#145261", label: "General" },
  keynote: { bg: "#FFF4D9", color: "#7A5300", label: "Keynote" },
  rotation: { bg: "#E1ECEF", color: "#145261", label: "Rotation" },
  break: { bg: "#F5DDD9", color: "#541011", label: "Break" },
};

export default function Agenda() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/agenda").then((r) => { setItems(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="px-5 pt-8" data-testid="agenda-page">
      <h1 className="font-display text-4xl" style={{ color: "#092936", fontWeight: 700 }}>
        Today's Agenda
      </h1>
      <p className="mt-2 text-[15px]" style={{ color: "#3D5560" }}>
        June 8, 2026 · A day designed for educators.
      </p>

      <div className="mt-8 relative">
        <div className="absolute left-[15px] top-2 bottom-2 w-px" style={{ background: "#E8DFCF" }} />
        <div className="space-y-4">
          {loading && <p className="text-sm" style={{ color: "#3D5560" }}>Loading…</p>}
          {items.map((item, i) => {
            const t = typeStyles[item.type] || typeStyles.general;
            return (
              <div key={item.id} className="relative pl-10" data-testid={`agenda-item-${i}`}>
                <span
                  className="absolute left-[8px] top-3 w-4 h-4 rounded-full border-[3px] border-white"
                  style={{ background: t.color, boxShadow: "0 0 0 2px #E8DFCF" }}
                />
                <div className="bg-white border border-[#E8DFCF] rounded-2xl px-5 py-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                      style={{ background: t.bg, color: t.color }}
                    >
                      {t.label}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#145261" }}>
                      <Clock size={12} /> {item.time}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-lg leading-snug" style={{ color: "#092936", fontWeight: 600 }}>
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed whitespace-pre-line" style={{ color: "#3D5560" }}>
                    {item.description}
                  </p>
                  <div className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-medium" style={{ color: "#145261" }}>
                    <MapPin size={12} /> {item.location}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
