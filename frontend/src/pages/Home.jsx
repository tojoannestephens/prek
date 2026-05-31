import { Link } from "react-router-dom";
import { Star, Calendar, Users, Sparkles, MapPin, Info, Megaphone } from "lucide-react";

const ANNOUNCEMENTS = [
  {
    title: "Check-in opens at 7:30 AM",
    body: "Come early and enjoy a morning of line dancing, scrolling, and exercise. The first 100 to arrive beginning at 7:30 am will be entered into a drawing for a cash prize.",
  },
  {
    title: "Bring your charged device",
    body: "All sessions are hands-on with AI tools — an iPad, tablet or laptop is needed if you have one.",
  },
  {
    title: "Earn 12 CEUs for the Nurture. Guide. Empower. Conference",
    body: "To earn 12 CEUs, register via PowerSchool PD (344690) and complete all assignments (Pre Lessons, Sessions, Post Lessons) in Schoology. To enroll in the Schoology course, use the access code PKMQ-QXTR-FTVKJ to enroll.",
  },
  {
    title: "Need assistance during the conference",
    body: "Find a person in an orange vest.",
  },
];

const HERO_BG = "https://images.unsplash.com/photo-1755538497211-c4ebc7cc1a94?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwzfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBlZHVjYXRpb24lMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc3NzIzNTU2MHww&ixlib=rb-4.1.0&q=85";
const TALA_LOGO = "/tala-logo.png";
const BCS_LOGO = "/bcs-logo.png";

export default function Home() {
  const quickActions = [
    { label: "Agenda", icon: Calendar, route: "/agenda", color: "#145261", testid: "quick-agenda" },
    { label: "My Group", icon: Users, route: "/group", color: "#F6B829", testid: "quick-my-group" },
    { label: "Sessions", icon: Sparkles, route: "/sessions", color: "#541011", testid: "quick-sessions" },
    { label: "Locations", icon: MapPin, route: "/locations", color: "#092936", testid: "quick-locations" },
  ];

  return (
    <div data-testid="home-screen" className="pb-2">
      {/* HERO with image background - full-bleed on desktop */}
      <div
        className="relative overflow-hidden"
        style={{ minHeight: 460, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, width: "100vw", marginLeft: "calc(-50vw + 50%)" }}
      >
        <img
          src={HERO_BG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}
        />
        <div
          className="relative px-6 pt-6 pb-7 flex flex-col"
          style={{
            minHeight: 460,
            background: "rgba(9, 41, 54, 0.78)",
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
          data-testid="home-hero"
        >
          <img
            src={BCS_LOGO}
            alt="BCS"
            className="absolute object-contain"
            style={{
              top: 16,
              right: 16,
              width: 80,
              height: 80,
              background: "rgba(255,255,255,0.95)",
              borderRadius: 16,
              padding: 6,
            }}
            data-testid="bcs-logo"
          />

          <div
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full self-start"
            style={{ background: "#F6B829" }}
            data-testid="success-pill"
          >
            <Star size={16} fill="#092936" strokeWidth={0} color="#092936" />
            <span className="text-[13px] font-extrabold tracking-wider" style={{ color: "#092936" }}>
              Success Starts Here
            </span>
          </div>

          {/* Spacer pushes title to lower half */}
          <div style={{ height: 80 }} />

          <h1
            className="text-white font-extrabold"
            style={{ fontSize: 64, lineHeight: "0.95", letterSpacing: "-0.02em" }}
            data-testid="home-headline"
          >
            Nurture.<br />Guide.<br />Empower.
          </h1>

          <p
            className="text-white font-extrabold mt-5"
            style={{ fontSize: 18 }}
            data-testid="home-subheadline"
          >
            AI in Teaching &amp; Learning
          </p>

          {/* Spacer between subtitle and welcome */}
          <div className="h-8" />

          <p
            style={{ color: "rgba(255,255,255,0.92)", fontSize: 15, lineHeight: "22px" }}
            data-testid="home-welcome"
          >
            Welcome, Pre K educators! Today, we explore how AI can support, inspire, and elevate early childhood teaching.
          </p>
        </div>
      </div>

      {/* TALA SPONSOR CARD */}
      <div className="px-5 mt-6">
        <div
          className="bg-white rounded-2xl border flex flex-col items-center justify-center pt-6 pb-4 px-6"
          style={{ borderColor: "rgba(20,82,97,0.15)" }}
          data-testid="tala-sponsor"
        >
          <span
            className="text-[11px] font-extrabold tracking-[0.15em] mb-1"
            style={{ color: "#F6B829" }}
          >
            LUNCH SPONSOR
          </span>
          <p
            className="text-center font-bold leading-snug mb-2"
            style={{ color: "#092936", fontSize: 15 }}
          >
            Lunch is sponsored by<br />
            TALA Professional Services
          </p>
          <div
            className="overflow-hidden flex items-center justify-center"
            style={{ width: 200, height: 32 }}
            data-testid="tala-logo-wrap"
          >
            <img
              src={TALA_LOGO}
              alt="TALA Professional Services"
              className="object-contain"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
              data-testid="tala-logo"
            />
          </div>
        </div>
      </div>

      {/* QUICK ACCESS */}
      <div className="px-5 mt-6">
        <p
          className="text-[12px] font-extrabold tracking-[0.15em] uppercase mb-3"
          style={{ color: "#145261" }}
        >
          Quick Access
        </p>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((a) => {
            const Icon = a.icon;
            const dark = a.color === "#F6B829";
            return (
              <Link
                key={a.label}
                to={a.route}
                data-testid={a.testid}
                className="rounded-[18px] p-4 flex flex-col justify-between transition-transform active:scale-[0.97] card-shadow"
                style={{ background: a.color, color: dark ? "#092936" : "#FFFFFF", minHeight: 100 }}
              >
                <Icon size={28} strokeWidth={2.2} />
                <span className="text-base font-bold mt-2">{a.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* INFO CARD */}
      <div className="px-5 mt-6">
        <div
          className="bg-white rounded-2xl border flex items-start gap-2.5 p-4"
          style={{ borderColor: "rgba(20,82,97,0.15)" }}
          data-testid="info-card"
        >
          <Info size={22} color="#145261" strokeWidth={2.2} className="flex-shrink-0" />
          <div className="flex-1">
            <p className="font-bold" style={{ color: "#092936", fontSize: 14, marginBottom: 4 }}>
              District-Wide Professional Development
            </p>
            <p className="font-bold" style={{ color: "#092936", fontSize: 14, marginBottom: 4 }}>
              June 8, 2026
            </p>
            <p style={{ color: "#5A6A72", fontSize: 13, lineHeight: "19px" }}>
              A full day of learning, collaboration, and discovery — designed for the educators who shape our youngest minds.
            </p>
          </div>
        </div>
      </div>

      {/* ANNOUNCEMENTS */}
      {ANNOUNCEMENTS.length > 0 && (
        <div className="px-5 mt-6" data-testid="announcements-section">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone size={18} color="#145261" strokeWidth={2.2} />
            <p
              className="text-[12px] font-extrabold tracking-[0.15em] uppercase"
              style={{ color: "#145261" }}
            >
              Announcements
            </p>
          </div>
          <div className="space-y-2.5">
            {ANNOUNCEMENTS.map((a, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border px-4 py-3.5"
                style={{ borderColor: "rgba(20,82,97,0.15)", borderLeft: "4px solid #F6B829" }}
                data-testid={`announcement-${i}`}
              >
                <h3
                  className="font-bold leading-snug"
                  style={{ color: "#092936", fontSize: 15 }}
                >
                  {a.title}
                </h3>
                {a.body && (
                  <p
                    className="mt-1 text-[14px] leading-relaxed"
                    style={{ color: "#5A6A72" }}
                  >
                    {a.body}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-6" />
    </div>
  );
}
