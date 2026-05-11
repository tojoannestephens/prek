import { Link } from "react-router-dom";
import { Star, CalendarDays, Users, BookOpen, MapPin } from "lucide-react";

const TALA_LOGO = "https://customer-assets.emergentagent.com/job_deploy-base44/artifacts/4fzpi86t_tala.jpg";
const BCS_LOGO = "https://cmsv2-assets.apptegy.net/uploads/21908/watermark/24722/logo_birmingham.png";

export default function Home() {
  return (
    <div data-testid="home-page" className="pb-2">
      {/* HERO */}
      <section
        className="relative overflow-hidden grain"
        style={{
          background:
            "linear-gradient(180deg, #092936 0%, #0E3D49 55%, #145261 100%)",
        }}
        data-testid="home-hero"
      >
        <div className="relative z-10 px-6 pt-8 pb-12">
          <div className="flex items-start justify-between">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full"
              style={{ background: "#F6B829", color: "#092936" }}
              data-testid="success-pill"
            >
              <Star size={14} fill="#092936" strokeWidth={0} />
              <span className="text-xs font-bold tracking-wider uppercase">
                Success Starts Here
              </span>
            </div>
            <div
              className="bg-white rounded-2xl p-1.5 shadow-md"
              data-testid="bcs-logo"
            >
              <img src={BCS_LOGO} alt="Birmingham City Schools" className="h-10 w-10 object-contain" />
            </div>
          </div>

          <h1
            className="font-display text-white mt-7 leading-[0.95] text-5xl sm:text-6xl font-700"
            style={{ fontWeight: 700 }}
            data-testid="home-headline"
          >
            Nurture.<br />Guide.<br />Empower.
          </h1>

          <p
            className="font-display mt-5 text-2xl sm:text-3xl"
            style={{ color: "#F6B829", fontWeight: 600 }}
            data-testid="home-subheadline"
          >
            AI in Teaching &amp; Learning
          </p>

          <p
            className="mt-5 text-[15px] leading-relaxed max-w-md"
            style={{ color: "#E2EBEE" }}
            data-testid="home-welcome"
          >
            Welcome, Pre K educators! Today we explore how AI can support,
            inspire, and elevate early childhood teaching.
          </p>
        </div>
      </section>

      {/* TALA SPONSOR */}
      <section className="px-5 -mt-6 relative z-20">
        <div
          className="rounded-2xl bg-white border border-[#E8DFCF] shadow-sm px-6 py-6 flex flex-col items-center text-center"
          data-testid="tala-sponsor-card"
        >
          <span
            className="text-[11px] font-bold tracking-[0.18em] uppercase"
            style={{ color: "#F6B829" }}
          >
            Lunch Sponsor
          </span>
          <p
            className="mt-2 text-[15px] leading-snug"
            style={{ color: "#092936" }}
          >
            Lunch is sponsored by<br />
            <span className="font-semibold">TALA Professional Services</span>
          </p>
          <div className="mt-4 w-full max-w-[200px] overflow-hidden rounded-lg">
            <img
              src={TALA_LOGO}
              alt="TALA Professional Services"
              className="w-full h-auto object-cover"
              style={{ objectPosition: "center", transform: "scale(1.15)" }}
              data-testid="tala-logo"
            />
          </div>
        </div>
      </section>

      {/* QUICK ACCESS GRID */}
      <section className="px-5 mt-8">
        <h2
          className="font-display text-xl mb-4 px-1"
          style={{ color: "#092936", fontWeight: 600 }}
        >
          Quick Access
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <QuickTile
            to="/agenda"
            label="Agenda"
            Icon={CalendarDays}
            bg="#145261"
            fg="#FFFFFF"
            testid="quick-agenda"
          />
          <QuickTile
            to="/group"
            label="My Group"
            Icon={Users}
            bg="#F6B829"
            fg="#092936"
            testid="quick-group"
          />
          <QuickTile
            to="/sessions"
            label="Sessions"
            Icon={BookOpen}
            bg="#541011"
            fg="#FFFFFF"
            testid="quick-sessions"
          />
          <QuickTile
            to="/locations"
            label="Locations"
            Icon={MapPin}
            bg="#092936"
            fg="#FFFFFF"
            testid="quick-locations"
          />
        </div>
      </section>

      {/* INFO CARD */}
      <section className="px-5 mt-8">
        <div
          className="rounded-2xl px-6 py-7 border border-[#E8DFCF]"
          style={{ background: "#FFFFFF" }}
          data-testid="info-card"
        >
          <h3
            className="font-display text-2xl leading-tight"
            style={{ color: "#092936", fontWeight: 700 }}
          >
            District-Wide Professional Development
          </h3>
          <p
            className="mt-2 font-display text-2xl leading-tight"
            style={{ color: "#145261", fontWeight: 600 }}
          >
            June 8, 2026
          </p>
          <p
            className="mt-4 text-[15px] leading-relaxed"
            style={{ color: "#3D5560" }}
          >
            A full day of learning, collaboration, and discovery — designed for
            the educators who shape our youngest minds.
          </p>
        </div>
      </section>

      <div className="h-6" />
    </div>
  );
}

function QuickTile({ to, label, Icon, bg, fg, testid }) {
  return (
    <Link
      to={to}
      data-testid={testid}
      className="rounded-2xl px-5 py-6 flex flex-col items-start gap-3 transition-transform active:scale-[0.97] hover:-translate-y-0.5"
      style={{ background: bg, color: fg, minHeight: "120px" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.18)" }}
      >
        <Icon size={20} strokeWidth={2.2} />
      </div>
      <span className="font-semibold text-base">{label}</span>
    </Link>
  );
}
