import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, MapPin, Lightbulb, Wrench, Palette, GitMerge } from "lucide-react";

const GROUPS = [
  { id: "instructional_innovators", name: "Instructional Innovators", bandLabel: "Blue Band", color: "#2563EB", Icon: Lightbulb },
  { id: "learning_architects", name: "Learning Architects", bandLabel: "Green Band", color: "#2F855A", Icon: Wrench },
  { id: "digital_designers", name: "Digital Designers", bandLabel: "Red Band", color: "#C53030", Icon: Palette },
  { id: "integration_engineers", name: "Integration Engineers", bandLabel: "Yellow Band", color: "#F6B829", Icon: GitMerge },
];

const ROTATIONS = {
  instructional_innovators: [
    { time: "7:30–8:30 AM", session: "Line Dancing, Exercising, Music, Entertainment, and Group Selection", location: "Gym" },
    { time: "8:30–9:00 AM", session: "Keynote: Dr. Mark Sullivan", location: "Cafeteria" },
    { time: "9:15–9:55 AM", session: "VR & Interactives", location: "Game Room" },
    { time: "10:10–10:50 AM", session: "MagicSchool AI", location: "Computer Lab" },
    { time: "11:05–11:45 AM", session: "AI Policy & Cybersecurity", location: "Library" },
    { time: "11:45 AM–1:15 PM", session: "Lunch", location: "Cafeteria" },
    { time: "1:30–2:10 PM", session: "Technology Usage in Pre K", location: "Cafeteria" },
  ],
  learning_architects: [
    { time: "7:30–8:30 AM", session: "Line Dancing, Exercising, Music, Entertainment, and Group Selection", location: "Gym" },
    { time: "8:30–9:00 AM", session: "Keynote: Dr. Mark Sullivan", location: "Cafeteria" },
    { time: "9:15–9:55 AM", session: "AI Policy & Cybersecurity", location: "Library" },
    { time: "10:10–10:50 AM", session: "Technology Usage in Pre K", location: "Cafeteria" },
    { time: "11:05–11:45 AM", session: "VR & Interactives", location: "Game Room" },
    { time: "11:45 AM–1:15 PM", session: "Lunch", location: "Cafeteria" },
    { time: "1:30–2:10 PM", session: "MagicSchool AI", location: "Computer Lab" },
  ],
  digital_designers: [
    { time: "7:30–8:30 AM", session: "Line Dancing, Exercising, Music, Entertainment, and Group Selection", location: "Gym" },
    { time: "8:30–9:00 AM", session: "Keynote: Dr. Mark Sullivan", location: "Cafeteria" },
    { time: "9:15–9:55 AM", session: "MagicSchool AI", location: "Computer Lab" },
    { time: "10:10–10:50 AM", session: "AI Policy & Cybersecurity", location: "Library" },
    { time: "11:05–11:45 AM", session: "Technology Usage in Pre K", location: "Cafeteria" },
    { time: "11:45 AM–1:15 PM", session: "Lunch", location: "Cafeteria" },
    { time: "1:30–2:10 PM", session: "VR & Interactives", location: "Game Room" },
  ],
  integration_engineers: [
    { time: "7:30–8:30 AM", session: "Line Dancing, Exercising, Music, Entertainment, and Group Selection", location: "Gym" },
    { time: "8:30–9:00 AM", session: "Keynote: Dr. Mark Sullivan", location: "Cafeteria" },
    { time: "9:15–9:55 AM", session: "Technology Usage in Pre K", location: "Cafeteria" },
    { time: "10:10–10:50 AM", session: "VR & Interactives", location: "Game Room" },
    { time: "11:05–11:45 AM", session: "MagicSchool AI", location: "Computer Lab" },
    { time: "11:45 AM–1:15 PM", session: "Lunch", location: "Cafeteria" },
    { time: "1:30–2:10 PM", session: "AI Policy & Cybersecurity", location: "Library" },
  ],
};

export default function Group() {
  const [selectedId, setSelectedId] = useState(null);
  const selected = GROUPS.find((g) => g.id === selectedId);
  const schedule = selectedId ? ROTATIONS[selectedId] : [];

  if (selected) {
    const Icon = selected.Icon;
    const darkText = selected.color === "#F6B829";
    return (
      <div className="p-4 pb-10" data-testid="group-detail">
        <button
          onClick={() => setSelectedId(null)}
          className="flex items-center mb-3.5"
          style={{ color: "#145261" }}
          data-testid="group-back-btn"
        >
          <ChevronLeft size={20} />
          <span className="font-bold" style={{ fontSize: 15 }}>All Groups</span>
        </button>

        <div
          className="flex items-center rounded-[18px] p-4 mb-6"
          style={{ background: selected.color }}
          data-testid="group-header-card"
        >
          <div className="w-12 h-12 rounded-[14px] bg-white flex items-center justify-center flex-shrink-0">
            <Icon size={28} color={selected.color} strokeWidth={2.2} />
          </div>
          <div className="flex-1 ml-3">
            <p
              className="font-extrabold tracking-[0.15em] opacity-90"
              style={{ color: darkText ? "#092936" : "#FFFFFF", fontSize: 11 }}
            >
              {selected.bandLabel.toUpperCase()} · YOUR GROUP
            </p>
            <p className="font-extrabold mt-0.5" style={{ color: darkText ? "#092936" : "#FFFFFF", fontSize: 20 }}>
              {selected.name}
            </p>
          </div>
        </div>

        <p
          className="font-extrabold tracking-[0.12em] uppercase mb-3"
          style={{ color: "#145261", fontSize: 12 }}
        >
          Today's Rotation
        </p>

        {schedule.map((item, idx) => (
          <div key={idx} className="flex items-stretch" data-testid={`rotation-${idx}`}>
            <div className="flex flex-col items-center pt-4" style={{ width: 22 }}>
              <div className="w-3 h-3 rounded-full" style={{ background: selected.color }} />
              {idx < schedule.length - 1 && (
                <div className="flex-1 w-[2px] mt-1" style={{ background: "rgba(20,82,97,0.15)" }} />
              )}
            </div>
            <div
              className="flex-1 bg-white rounded-[14px] p-3.5 mb-3 ml-2.5 border"
              style={{ borderColor: "rgba(20,82,97,0.15)" }}
            >
              <p className="font-extrabold tracking-wide mb-1" style={{ color: selected.color, fontSize: 12 }}>
                {item.time}
              </p>
              <p className="font-bold mb-1.5" style={{ color: "#092936", fontSize: 16 }}>
                {item.session}
              </p>
              <div className="flex items-center gap-1">
                <MapPin size={14} color={selected.color} />
                <span className="font-semibold" style={{ color: "#5A6A72", fontSize: 13 }}>
                  {item.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 pb-10" data-testid="group-screen">
      <h2 className="font-extrabold mb-1.5" style={{ color: "#092936", fontSize: 22 }}>
        Assigned Group
      </h2>
      <p className="mb-5 whitespace-pre-line" style={{ color: "#5A6A72", fontSize: 14, lineHeight: "20px" }}>
        {`As professionals and role models for our students, we ask that all teachers follow the established expectations and procedures throughout the professional development experience.

At check-in, you will receive a colored band that determines your assigned group for the day. We ask that you keep that color band and not change. We also ask that you remain with that group for the entire day.

Match your band color to your group, then tap your assigned group to view your personalized rotation schedule.`}
      </p>

      <div className="flex flex-col gap-3.5" data-testid="group-list">
        {GROUPS.map((g) => {
          const Icon = g.Icon;
          const darkText = g.color === "#F6B829";
          return (
            <button
              key={g.id}
              onClick={() => setSelectedId(g.id)}
              data-testid={`group-${g.id}`}
              className="text-left rounded-[18px] p-4 card-shadow-md transition-transform active:scale-[0.98]"
              style={{ background: g.color, minHeight: 140 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-[14px] bg-white flex items-center justify-center">
                  <Icon size={26} color={g.color} strokeWidth={2.2} />
                </div>
                <div className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-full">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: g.color }} />
                  <span className="font-extrabold tracking-wide" style={{ color: g.color, fontSize: 11 }}>
                    {g.bandLabel}
                  </span>
                </div>
              </div>
              <p className="font-extrabold mb-3" style={{ color: darkText ? "#092936" : "#FFFFFF", fontSize: 19 }}>
                {g.name}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold" style={{ color: darkText ? "#092936" : "#FFFFFF", fontSize: 13 }}>
                  View schedule
                </span>
                <ArrowRight size={14} color={darkText ? "#092936" : "#FFFFFF"} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
