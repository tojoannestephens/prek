import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Sparkles, Glasses, Wand2, ShieldCheck, Smile, MapPin } from "lucide-react";

const ICON_MAP = {
  vr: Glasses,
  wand: Wand2,
  shield: ShieldCheck,
  kids: Smile,
  sparkles: Sparkles,
};

const ACCENTS = ["#145261", "#F6B829", "#541011", "#092936"];

export default function Sessions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/sessions").then((r) => { setItems(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center pt-20"><div className="w-8 h-8 border-2 border-[#145261] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="p-4 pb-10" data-testid="sessions-screen">
      <h2 className="font-extrabold mb-1" style={{ color: "#092936", fontSize: 22 }}>
        Today's Sessions
      </h2>
      <p className="mb-5" style={{ color: "#5A6A72", fontSize: 14 }}>
        Four powerful breakouts.
      </p>

      {items.map((s, idx) => {
        const accent = ACCENTS[idx % ACCENTS.length];
        const Icon = ICON_MAP[s.icon] || iconForTitle(s.title);
        const darkOnGold = accent === "#F6B829";
        return (
          <div
            key={s.id}
            className="bg-white rounded-[16px] p-4 mb-3.5 card-shadow"
            style={{ borderLeft: `5px solid ${accent}` }}
            data-testid={`session-${idx}`}
          >
            <div className="flex items-center mb-2.5 gap-3">
              <div
                className="rounded-[12px] flex items-center justify-center flex-shrink-0"
                style={{ width: 46, height: 46, background: accent }}
              >
                <Icon size={22} color={darkOnGold ? "#092936" : "#FFFFFF"} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold" style={{ color: "#092936", fontSize: 17 }}>
                  {s.title}
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={14} color={accent} />
                  <span className="font-bold" style={{ color: accent, fontSize: 13 }}>
                    {s.location}
                  </span>
                </div>
              </div>
            </div>
            <p style={{ color: "#5A6A72", fontSize: 14, lineHeight: "21px" }}>
              {s.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function iconForTitle(title) {
  if (title.includes("VR")) return Glasses;
  if (title.includes("MagicSchool")) return Wand2;
  if (title.includes("Policy")) return ShieldCheck;
  if (title.includes("Technology")) return Smile;
  return Sparkles;
}
