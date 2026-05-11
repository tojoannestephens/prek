import { useState } from "react";
import { ArrowLeft, ChevronRight, MapPin, Sparkles, Compass, Palette, Cpu } from "lucide-react";

const GROUPS = [
  {
    id: "blue",
    name: "Instructional Innovators",
    band: "Blue Band",
    color: "#2563EB",
    Icon: Sparkles,
    schedule: [
      ["7:30–8:30 AM", "Line Dancing, Exercising, Music, Entertainment, and Group Selection", "Gym"],
      ["8:30–9:00 AM", "Keynote: Dr. Mark Sullivan", "Cafeteria"],
      ["9:15–9:55 AM", "VR & Interactives", "Game Room"],
      ["10:10–10:50 AM", "MagicSchool AI", "Mac Lab"],
      ["11:05–11:45 AM", "AI Policy & Cybersecurity", "Media Center"],
      ["11:45 AM–1:15 PM", "Lunch", "Cafeteria"],
      ["1:30–2:10 PM", "Technology Usage in Pre K", "Cafeteria"],
    ],
  },
  {
    id: "green",
    name: "Learning Architects",
    band: "Green Band",
    color: "#2F855A",
    Icon: Compass,
    schedule: [
      ["7:30–8:30 AM", "Line Dancing, Exercising, Music, Entertainment, and Group Selection", "Gym"],
      ["8:30–9:00 AM", "Keynote: Dr. Mark Sullivan", "Cafeteria"],
      ["9:15–9:55 AM", "AI Policy & Cybersecurity", "Media Center"],
      ["10:10–10:50 AM", "Technology Usage in Pre K", "Cafeteria"],
      ["11:05–11:45 AM", "VR & Interactives", "Game Room"],
      ["11:45 AM–1:15 PM", "Lunch", "Cafeteria"],
      ["1:30–2:10 PM", "MagicSchool AI", "Mac Lab"],
    ],
  },
  {
    id: "red",
    name: "Digital Designers",
    band: "Red Band",
    color: "#C53030",
    Icon: Palette,
    schedule: [
      ["7:30–8:30 AM", "Line Dancing, Exercising, Music, Entertainment, and Group Selection", "Gym"],
      ["8:30–9:00 AM", "Keynote: Dr. Mark Sullivan", "Cafeteria"],
      ["9:15–9:55 AM", "MagicSchool AI", "Mac Lab"],
      ["10:10–10:50 AM", "AI Policy & Cybersecurity", "Media Center"],
      ["11:05–11:45 AM", "Technology Usage in Pre K", "Cafeteria"],
      ["11:45 AM–1:15 PM", "Lunch", "Cafeteria"],
      ["1:30–2:10 PM", "VR & Interactives", "Game Room"],
    ],
  },
  {
    id: "yellow",
    name: "Integration Engineers",
    band: "Yellow Band",
    color: "#F6B829",
    Icon: Cpu,
    schedule: [
      ["7:30–8:30 AM", "Line Dancing, Exercising, Music, Entertainment, and Group Selection", "Gym"],
      ["8:30–9:00 AM", "Keynote: Dr. Mark Sullivan", "Cafeteria"],
      ["9:15–9:55 AM", "Technology Usage in Pre K", "Cafeteria"],
      ["10:10–10:50 AM", "VR & Interactives", "Game Room"],
      ["11:05–11:45 AM", "MagicSchool AI", "Mac Lab"],
      ["11:45 AM–1:15 PM", "Lunch", "Cafeteria"],
      ["1:30–2:10 PM", "AI Policy & Cybersecurity", "Media Center"],
    ],
  },
];

export default function Group() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const g = GROUPS.find((x) => x.id === selected);
    return (
      <div data-testid="group-detail">
        <div className="px-5 pt-6 pb-8" style={{ background: g.color, color: g.id === "yellow" ? "#092936" : "#FFFFFF" }}>
          <button
            onClick={() => setSelected(null)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold opacity-90 hover:opacity-100"
            data-testid="group-back-btn"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <p className="mt-5 text-[11px] font-bold tracking-[0.2em] uppercase opacity-90">
            {g.band.toUpperCase()} · Your Group
          </p>
          <h1 className="mt-1 font-display text-3xl leading-tight" style={{ fontWeight: 700 }}>
            {g.name}
          </h1>
        </div>

        <div className="px-5 mt-6 relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-px" style={{ background: "#E8DFCF" }} />
          <div className="space-y-3">
            {g.schedule.map(([time, title, location], i) => (
              <div key={i} className="relative pl-12" data-testid={`rotation-row-${i}`}>
                <span
                  className="absolute left-[12px] top-4 w-4 h-4 rounded-full border-[3px] border-white"
                  style={{ background: g.color, boxShadow: "0 0 0 2px #E8DFCF" }}
                />
                <div className="bg-white border border-[#E8DFCF] rounded-2xl px-4 py-3.5">
                  <p className="text-[12px] font-bold uppercase tracking-wider" style={{ color: g.color }}>
                    {time}
                  </p>
                  <h3 className="mt-1 font-display text-[17px] leading-snug" style={{ color: "#092936", fontWeight: 600 }}>
                    {title}
                  </h3>
                  <p className="mt-1 inline-flex items-center gap-1 text-[13px]" style={{ color: "#3D5560" }}>
                    <MapPin size={12} /> {location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-8" />
      </div>
    );
  }

  return (
    <div className="px-5 pt-8" data-testid="group-page">
      <h1 className="font-display text-4xl" style={{ color: "#092936", fontWeight: 700 }}>
        Assigned Group
      </h1>
      <div className="mt-4 space-y-3 text-[14px] leading-relaxed" style={{ color: "#3D5560" }}>
        <p>
          As professionals and role models for our students, we ask that all teachers follow the established expectations and procedures throughout the professional development experience.
        </p>
        <p>
          At check-in, you will receive a colored band that determines your assigned group for the day. We ask that you keep that color band and not change. We also ask that you remain with that group for the entire day.
        </p>
        <p>
          Match your band color to your group, then tap your assigned group to view your personalized rotation schedule.
        </p>
      </div>

      <div className="mt-6 space-y-3" data-testid="group-list">
        {GROUPS.map((g) => {
          const Icon = g.Icon;
          const darkText = g.id === "yellow";
          return (
            <button
              key={g.id}
              onClick={() => setSelected(g.id)}
              data-testid={`group-card-${g.id}`}
              className="w-full text-left rounded-2xl px-5 py-5 flex items-center gap-4 transition-transform active:scale-[0.98] hover:-translate-y-0.5"
              style={{ background: g.color, color: darkText ? "#092936" : "#FFFFFF" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#FFFFFF" }}
              >
                <Icon size={22} strokeWidth={2.2} style={{ color: g.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white"
                  style={{ color: g.color }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: g.color }} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">{g.band}</span>
                </div>
                <h3 className="mt-1.5 font-display text-xl leading-tight" style={{ fontWeight: 700 }}>
                  {g.name}
                </h3>
              </div>
              <ChevronRight size={20} strokeWidth={2.2} className="flex-shrink-0" />
            </button>
          );
        })}
      </div>
      <div className="h-8" />
    </div>
  );
}
