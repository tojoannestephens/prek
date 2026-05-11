import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Music, Mic, RefreshCw, Utensils, MapPin } from "lucide-react";

const TYPE_STYLES = {
  general: { bg: "#E6F0F2", color: "#145261", Icon: Music },
  keynote: { bg: "#FBE9C9", color: "#541011", Icon: Mic },
  rotation: { bg: "#F1E1E1", color: "#541011", Icon: RefreshCw },
  break: { bg: "#FDF4DC", color: "#092936", Icon: Utensils },
};

export default function Agenda() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/agenda").then((r) => { setItems(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center pt-20"><div className="w-8 h-8 border-2 border-[#145261] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="p-4 pb-10" data-testid="agenda-screen">
      <p className="text-center text-[13px] mb-4" style={{ color: "#5A6A72" }}>
        Full-day schedule for June 8, 2026
      </p>
      {items.map((item, idx) => {
        const t = TYPE_STYLES[item.type] || TYPE_STYLES.general;
        const Icon = t.Icon;
        return (
          <div key={item.id} className="flex items-stretch" data-testid={`agenda-item-${idx}`}>
            {/* Time column with dot + line */}
            <div className="flex flex-col items-center pt-[18px]" style={{ width: 28 }}>
              <div
                className="rounded-full"
                style={{
                  width: 14,
                  height: 14,
                  background: t.color,
                  border: "3px solid #FDFBF7",
                }}
              />
              {idx < items.length - 1 && (
                <div className="flex-1 w-[2px] mt-1" style={{ background: "rgba(20,82,97,0.15)" }} />
              )}
            </div>
            {/* Card */}
            <div
              className="flex-1 bg-white rounded-[14px] p-3.5 mb-3.5 card-shadow"
              style={{ borderLeft: `4px solid ${t.color}` }}
            >
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2"
                style={{ background: t.bg }}
              >
                <Icon size={14} color={t.color} strokeWidth={2.2} />
                <span className="font-extrabold tracking-wide" style={{ color: t.color, fontSize: 11 }}>
                  {item.time}
                </span>
              </div>
              <h3 className="font-bold mb-1" style={{ color: "#092936", fontSize: 16 }}>
                {item.title}
              </h3>
              {item.description && (
                <p className="whitespace-pre-line mb-1.5" style={{ color: "#5A6A72", fontSize: 13, lineHeight: "19px" }}>
                  {item.description}
                </p>
              )}
              {item.location && (
                <div className="flex items-center gap-1 mt-1">
                  <MapPin size={14} color="#5A6A72" />
                  <span className="font-semibold" style={{ color: "#5A6A72", fontSize: 12 }}>
                    {item.location}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
