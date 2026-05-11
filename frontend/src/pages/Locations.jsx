import { Dumbbell, Utensils, Gamepad2, Laptop, ShieldCheck, Lightbulb } from "lucide-react";

const LOCATIONS = [
  { name: "Gym", description: "Line Dancing & Group Selection (7:30–8:30 AM)", Icon: Dumbbell },
  { name: "Cafeteria", description: "Keynote, Lunch, and Technology Usage in Pre K", Icon: Utensils },
  { name: "Game Room", description: "VR & Interactives", Icon: Gamepad2 },
  { name: "Mac Lab", description: "MagicSchool AI", Icon: Laptop },
  { name: "Media Center", description: "AI Policy & Cybersecurity", Icon: ShieldCheck },
];

const ACCENTS = ["#145261", "#F6B829", "#541011", "#092936", "#145261"];

export default function Locations() {
  return (
    <div className="p-4 pb-10" data-testid="locations-screen">
      <h2 className="font-extrabold mb-1" style={{ color: "#092936", fontSize: 22 }}>
        Where to Go
      </h2>
      <p className="mb-5" style={{ color: "#5A6A72", fontSize: 14 }}>
        Every room and the sessions held there.
      </p>

      {LOCATIONS.map((loc, idx) => {
        const accent = ACCENTS[idx % ACCENTS.length];
        const dark = accent === "#F6B829";
        const Icon = loc.Icon;
        return (
          <div
            key={loc.name}
            className="bg-white rounded-[14px] p-3.5 mb-3 border flex items-center"
            style={{ borderColor: "rgba(20,82,97,0.15)" }}
            data-testid={`location-${idx}`}
          >
            <div
              className="rounded-[14px] flex items-center justify-center flex-shrink-0 mr-3.5"
              style={{ width: 50, height: 50, background: accent }}
            >
              <Icon size={24} color={dark ? "#092936" : "#FFFFFF"} strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold mb-0.5" style={{ color: "#092936", fontSize: 17 }}>
                {loc.name}
              </h3>
              <p style={{ color: "#5A6A72", fontSize: 13, lineHeight: "18px" }}>
                {loc.description}
              </p>
            </div>
          </div>
        );
      })}

      <div
        className="flex items-center gap-2.5 p-3.5 rounded-[12px] mt-3"
        style={{ background: "#FDF4DC" }}
        data-testid="locations-tip"
      >
        <Lightbulb size={18} color="#F6B829" className="flex-shrink-0" />
        <p style={{ color: "#092936", fontSize: 13, lineHeight: "19px" }}>
          Tip: Check Group Rotation to see exactly where your group should be at each time slot.
        </p>
      </div>
    </div>
  );
}
