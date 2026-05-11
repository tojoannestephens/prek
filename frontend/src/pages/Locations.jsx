import { MapPin, Lightbulb } from "lucide-react";

const LOCATIONS = [
  { name: "Gym", desc: "Line Dancing & Group Selection (7:30–8:30 AM)", color: "#145261" },
  { name: "Cafeteria", desc: "Keynote, Lunch, and Technology Usage in Pre K", color: "#541011" },
  { name: "Game Room", desc: "VR & Interactives", color: "#092936" },
  { name: "Mac Lab", desc: "MagicSchool AI", color: "#2F855A" },
  { name: "Media Center", desc: "AI Policy & Cybersecurity", color: "#F6B829" },
];

export default function Locations() {
  return (
    <div className="px-5 pt-8" data-testid="locations-page">
      <h1 className="font-display text-4xl" style={{ color: "#092936", fontWeight: 700 }}>
        Where to Go
      </h1>
      <p className="mt-2 text-[15px]" style={{ color: "#3D5560" }}>
        Every room and the sessions held there.
      </p>

      <div className="mt-6 space-y-3" data-testid="locations-list">
        {LOCATIONS.map((l, i) => {
          const dark = l.color === "#F6B829";
          return (
            <div
              key={l.name}
              className="bg-white border border-[#E8DFCF] rounded-2xl px-5 py-4 flex items-start gap-4"
              data-testid={`location-card-${i}`}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: l.color, color: dark ? "#092936" : "#FFFFFF" }}
              >
                <MapPin size={20} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg leading-tight" style={{ color: "#092936", fontWeight: 700 }}>
                  {l.name}
                </h3>
                <p className="mt-1 text-[14px] leading-relaxed" style={{ color: "#3D5560" }}>
                  {l.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="mt-6 rounded-2xl px-5 py-4 flex items-start gap-3"
        style={{ background: "#FFF4D9", border: "1px solid #F6B829" }}
        data-testid="locations-tip"
      >
        <Lightbulb size={20} style={{ color: "#7A5300" }} className="flex-shrink-0 mt-0.5" />
        <p className="text-[14px] leading-relaxed" style={{ color: "#5C3D00" }}>
          <span className="font-bold">Tip:</span> Check Group Rotation to see exactly where your group should be at each time slot.
        </p>
      </div>
      <div className="h-8" />
    </div>
  );
}
