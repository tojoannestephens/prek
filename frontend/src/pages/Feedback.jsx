import { useState } from "react";
import { Check, Send } from "lucide-react";
import { api } from "@/lib/api";

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
      <div
        className="flex flex-col items-center justify-center px-8"
        style={{ minHeight: "calc(100vh - 140px)" }}
        data-testid="feedback-thanks"
      >
        <div
          className="rounded-full flex items-center justify-center mb-6"
          style={{ width: 96, height: 96, background: "#145261" }}
        >
          <Check size={48} color="#FFFFFF" strokeWidth={3} />
        </div>
        <h1 className="font-extrabold mb-3 text-center" style={{ color: "#092936", fontSize: 28 }}>
          Thank You!
        </h1>
        <p className="text-center mb-6" style={{ color: "#5A6A72", fontSize: 15, lineHeight: "22px" }}>
          Your feedback fuels our growth. We appreciate you taking the time to share your thoughts today.
        </p>
        <p className="font-extrabold tracking-[0.15em]" style={{ color: "#145261", fontSize: 13 }}>
          SUCCESS STARTS HERE
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 pb-10" data-testid="feedback-screen">
      <h2 className="font-extrabold mb-1" style={{ color: "#092936", fontSize: 22 }}>
        Share Your Feedback
      </h2>
      <p className="mb-5" style={{ color: "#5A6A72", fontSize: 14 }}>
        A quick evaluation helps us plan even better events.
      </p>

      <p className="font-bold mb-2.5 mt-2" style={{ color: "#092936", fontSize: 14 }}>
        How was today?
      </p>
      <div className="flex justify-between gap-1.5 mb-4">
        {RATINGS.map((r) => {
          const active = rating === r.value;
          return (
            <button
              key={r.value}
              onClick={() => setRating(r.value)}
              data-testid={`rating-${r.value}`}
              className="flex-1 flex flex-col items-center py-3 rounded-[12px] transition-all"
              style={{
                background: active ? "#FDF4DC" : "#FFFFFF",
                border: `2px solid ${active ? "#F6B829" : "rgba(20,82,97,0.15)"}`,
              }}
            >
              <span style={{ fontSize: 28 }}>{r.emoji}</span>
              <span className="font-semibold mt-1" style={{ color: active ? "#092936" : "#5A6A72", fontSize: 10 }}>
                {r.label}
              </span>
            </button>
          );
        })}
      </div>

      <p className="font-bold mb-2.5 mt-2" style={{ color: "#092936", fontSize: 14 }}>
        What was the highlight?
      </p>
      <textarea
        value={highlight}
        onChange={(e) => setHighlight(e.target.value)}
        placeholder="A favorite session, takeaway, or moment..."
        className="w-full bg-white rounded-[12px] border p-3.5 mb-2 outline-none"
        style={{
          borderColor: "rgba(20,82,97,0.15)",
          minHeight: 90,
          fontSize: 14,
          color: "#092936",
          resize: "vertical",
        }}
        data-testid="feedback-highlight"
      />

      <p className="font-bold mb-2.5 mt-2" style={{ color: "#092936", fontSize: 14 }}>
        What could be even better?
      </p>
      <textarea
        value={improve}
        onChange={(e) => setImprove(e.target.value)}
        placeholder="Suggestions, ideas, or wishes..."
        className="w-full bg-white rounded-[12px] border p-3.5 mb-2 outline-none"
        style={{
          borderColor: "rgba(20,82,97,0.15)",
          minHeight: 90,
          fontSize: 14,
          color: "#092936",
          resize: "vertical",
        }}
        data-testid="feedback-improve"
      />

      <button
        onClick={async () => {
          if (!rating) return;
          try {
            await api.post("/feedback", { rating, highlight, improve });
          } catch (e) {
            // Don't block the thank-you screen if backend hiccups.
            console.log("feedback submit failed", e);
          }
          setSubmitted(true);
        }}
        disabled={!rating}
        data-testid="feedback-submit"
        className="w-full flex items-center justify-center gap-2 py-4 rounded-[14px] mt-5 transition-opacity"
        style={{
          background: "#F6B829",
          color: "#092936",
          opacity: !rating ? 0.6 : 1,
        }}
      >
        <Send size={18} color="#092936" />
        <span className="font-extrabold" style={{ fontSize: 16 }}>
          Submit Feedback
        </span>
      </button>
    </div>
  );
}
