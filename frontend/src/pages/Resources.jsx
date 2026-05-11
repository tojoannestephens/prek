import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ExternalLink, LinkIcon } from "lucide-react";

export default function Resources() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/resources").then((r) => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <div className="px-5 pt-8" data-testid="resources-page">
      <h1 className="font-display text-4xl" style={{ color: "#092936", fontWeight: 700 }}>
        Resources
      </h1>

      <h2 className="mt-7 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#145261" }}>
        Links
      </h2>

      <div className="mt-3 space-y-2.5" data-testid="resources-list">
        {items.map((r, i) => {
          const hasUrl = r.url && r.url.trim().length > 0;
          const inner = (
            <>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#F4EFE6", color: "#145261" }}
              >
                <LinkIcon size={18} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-[17px] leading-tight" style={{ color: "#092936", fontWeight: 600 }}>
                  {r.title}
                </h3>
                {r.description && (
                  <p className="mt-1 text-[13px] leading-relaxed" style={{ color: "#6B7B82" }}>
                    {r.description}
                  </p>
                )}
              </div>
              {hasUrl && <ExternalLink size={18} style={{ color: "#145261" }} className="flex-shrink-0" />}
            </>
          );
          return hasUrl ? (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`resource-${i}`}
              className="bg-white border border-[#E8DFCF] rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:border-[#145261] transition-colors"
            >
              {inner}
            </a>
          ) : (
            <div
              key={r.id}
              data-testid={`resource-${i}`}
              className="bg-white border border-[#E8DFCF] rounded-2xl px-4 py-3.5 flex items-center gap-3 opacity-75"
            >
              {inner}
            </div>
          );
        })}
      </div>
      <div className="h-8" />
    </div>
  );
}
