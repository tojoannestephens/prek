import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Link2, FileText, ExternalLink } from "lucide-react";

export default function Resources() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/resources").then((r) => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <div className="p-4 pb-10" data-testid="resources-screen">
      <h2 className="font-extrabold mb-1" style={{ color: "#092936", fontSize: 22 }}>
        AI Online Learning Games
      </h2>

      <div className="mt-5">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div
            className="rounded-[10px] flex items-center justify-center"
            style={{ width: 40, height: 40, background: "#145261" }}
          >
            <Link2 size={20} color="#FFFFFF" strokeWidth={2.2} />
          </div>
          <h3 className="font-extrabold" style={{ color: "#092936", fontSize: 16 }}>
            Links
          </h3>
        </div>

        {items.map((r, idx) => {
          const hasUrl = r.url && r.url.trim().length > 0;
          const content = (
            <>
              <FileText size={18} color="#145261" className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold" style={{ color: "#092936", fontSize: 14 }}>
                  {r.title}
                </p>
                {r.description && (
                  <p className="mt-1" style={{ color: "#5A6A72", fontSize: 12, lineHeight: "17px" }}>
                    {r.description}
                  </p>
                )}
              </div>
              <ExternalLink size={16} color="#5A6A72" className="flex-shrink-0 mt-0.5" />
            </>
          );
          return hasUrl ? (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`resource-${idx}`}
              className="flex items-start gap-2.5 bg-white p-3 rounded-[10px] mb-2 border"
              style={{ borderColor: "rgba(20,82,97,0.15)" }}
            >
              {content}
            </a>
          ) : (
            <div
              key={r.id}
              data-testid={`resource-${idx}`}
              className="flex items-start gap-2.5 bg-white p-3 rounded-[10px] mb-2 border"
              style={{ borderColor: "rgba(20,82,97,0.15)" }}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
