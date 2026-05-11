import { useState } from "react";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const RATINGS = [
  { value: 1, emoji: "😞", label: "Poor" },
  { value: 2, emoji: "😐", label: "Okay" },
  { value: 3, emoji: "🙂", label: "Good" },
  { value: 4, emoji: "😄", label: "Great" },
  { value: 5, emoji: "🤩", label: "Amazing" },
];

export default function Feedback() {
  const [rating, setRating] = useState(null);
  const [highlight, setHighlight] = useState("");
  const [improve, setImprove] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="px-5 pt-16 flex flex-col items-center text-center" data-testid="feedback-thanks">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "#2F855A" }}
        >
          <Check size={42} color="#FFFFFF" strokeWidth={3} />
        </div>
        <h1 className="mt-6 font-display text-4xl" style={{ color: "#092936", fontWeight: 700 }}>
          Thank You!
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed max-w-sm" style={{ color: "#3D5560" }}>
          Your feedback helps us shape an even better Pre K professional development experience. We appreciate every word.
        </p>
        <div className="mt-12 flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "#F6B829", color: "#092936" }}>
          <Star size={14} fill="#092936" strokeWidth={0} />
          <span className="text-xs font-bold tracking-wider uppercase">Success Starts Here</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-8" data-testid="feedback-page">
      <h1 className="font-display text-4xl" style={{ color: "#092936", fontWeight: 700 }}>
        Share Your Feedback
      </h1>
      <p className="mt-2 text-[15px]" style={{ color: "#3D5560" }}>
        A quick evaluation helps us plan even better events.
      </p>

      <div className="mt-7">
        <p className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "#145261" }}>
          Overall Experience
        </p>
        <div className="mt-3 grid grid-cols-5 gap-2" data-testid="rating-row">
          {RATINGS.map((r) => {
            const active = rating === r.value;
            return (
              <button
                key={r.value}
                onClick={() => setRating(r.value)}
                data-testid={`rating-${r.value}`}
                className="flex flex-col items-center py-3 rounded-xl border-2 transition-all"
                style={{
                  background: active ? "#FFF4D9" : "#FFFFFF",
                  borderColor: active ? "#F6B829" : "#E8DFCF",
                }}
              >
                <span className="text-2xl">{r.emoji}</span>
                <span className="mt-1 text-[10px] font-bold uppercase tracking-wide" style={{ color: "#3D5560" }}>
                  {r.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <label className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "#145261" }}>
          What was the highlight?
        </label>
        <Textarea
          value={highlight}
          onChange={(e) => setHighlight(e.target.value)}
          placeholder="Tell us what stood out…"
          className="mt-2 bg-white border-[#E8DFCF] rounded-xl text-[14px]"
          rows={3}
          data-testid="feedback-highlight"
        />
      </div>

      <div className="mt-5">
        <label className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "#145261" }}>
          What could be even better?
        </label>
        <Textarea
          value={improve}
          onChange={(e) => setImprove(e.target.value)}
          placeholder="Your suggestions help us improve…"
          className="mt-2 bg-white border-[#E8DFCF] rounded-xl text-[14px]"
          rows={3}
          data-testid="feedback-improve"
        />
      </div>

      <Button
        onClick={() => setSubmitted(true)}
        data-testid="feedback-submit"
        className="mt-7 w-full h-12 rounded-xl font-bold text-base"
        style={{ background: "#F6B829", color: "#092936" }}
      >
        Submit Feedback
      </Button>
      <div className="h-8" />
    </div>
  );
}
