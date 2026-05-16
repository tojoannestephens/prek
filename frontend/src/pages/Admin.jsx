import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Lock, Key, Edit2, Save, X } from "lucide-react";

export default function Admin() {
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [pinError, setPinError] = useState("");

  const verify = async () => {
    setVerifying(true);
    setPinError("");
    try {
      const res = await api.post("/admin/verify-pin", { pin });
      if (res.data.valid) setAuthed(true);
      else setPinError("Incorrect PIN. Please try again.");
    } catch {
      setPinError("Could not verify PIN. Check your connection.");
    } finally {
      setVerifying(false);
    }
  };

  if (!authed) {
    return (
      <div
        className="flex flex-col items-center justify-center px-6"
        style={{ minHeight: "calc(100vh - 140px)" }}
        data-testid="admin-lock"
      >
        <div
          className="rounded-full flex items-center justify-center mb-5"
          style={{ width: 88, height: 88, background: "#092936" }}
        >
          <Lock size={36} color="#F6B829" strokeWidth={2.4} />
        </div>
        <h1 className="font-extrabold mb-2" style={{ color: "#092936", fontSize: 24 }}>
          Admin Access
        </h1>
        <p className="text-center mb-6" style={{ color: "#5A6A72", fontSize: 14, lineHeight: "20px" }}>
          Enter the 4-digit admin PIN to edit agenda and sessions.
        </p>
        <input
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, ""));
            if (pinError) setPinError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && pin && verify()}
          placeholder="• • • •"
          maxLength={6}
          className="w-full max-w-[280px] bg-white rounded-[14px] p-[18px] text-center font-extrabold outline-none mb-3.5"
          style={{
            border: "2px solid rgba(20,82,97,0.15)",
            fontSize: 24,
            letterSpacing: "8px",
            color: "#092936",
          }}
          data-testid="admin-pin-input"
        />
        {pinError && (
          <p
            className="font-bold text-center mb-3"
            style={{ color: "#541011", fontSize: 13, marginTop: -4 }}
            data-testid="admin-pin-error"
          >
            {pinError}
          </p>
        )}
        <button
          onClick={verify}
          disabled={!pin || verifying}
          data-testid="admin-unlock-btn"
          className="flex items-center justify-center gap-2 py-3.5 px-8 rounded-[14px] transition-opacity"
          style={{
            background: "#F6B829",
            color: "#092936",
            minWidth: 180,
            opacity: !pin || verifying ? 0.6 : 1,
          }}
        >
          {verifying ? (
            <div className="w-5 h-5 border-2 border-[#092936] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Key size={18} color="#092936" />
              <span className="font-extrabold" style={{ fontSize: 16 }}>Unlock</span>
            </>
          )}
        </button>
        <p className="mt-4" style={{ color: "#5A6A72", fontSize: 12 }}>
          Default PIN: 4321
        </p>
      </div>
    );
  }

  return <AdminPanel />;
}

function AdminPanel() {
  const [tab, setTab] = useState("agenda");

  return (
    <div data-testid="admin-panel">
      {/* Tab bar */}
      <div
        className="flex bg-white border-b"
        style={{ borderBottomColor: "rgba(20,82,97,0.15)" }}
      >
        {[
          { id: "agenda", label: "Agenda" },
          { id: "sessions", label: "Sessions" },
          { id: "resources", label: "AI Online Games" },
        ].map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              data-testid={`admin-tab-${t.id}`}
              className="flex-1 py-3.5 transition-colors"
              style={{
                borderBottom: active ? "3px solid #F6B829" : "3px solid transparent",
                color: active ? "#092936" : "#5A6A72",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 pb-10" data-testid="admin-list">
        {tab === "agenda" && <EditList kind="agenda" fields={["time", "title", "description", "location"]} />}
        {tab === "sessions" && <EditList kind="sessions" fields={["title", "location", "description"]} />}
        {tab === "resources" && <EditList kind="resources" fields={["title", "description", "url"]} />}
      </div>
    </div>
  );
}

function EditList({ kind, fields }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get(`/${kind}`);
      setItems(r.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [kind]);

  const startEdit = (item) => {
    setEditingId(item.id);
    const d = {};
    fields.forEach((f) => { d[f] = item[f] ?? ""; });
    setDraft(d);
  };

  const cancel = () => { setEditingId(null); setDraft({}); };

  const save = async () => {
    try {
      await api.put(`/${kind}/${editingId}`, draft);
      cancel();
      load();
    } catch (e) {
      console.log("save failed", e);
    }
  };

  if (loading) {
    return <div className="flex justify-center pt-10"><div className="w-8 h-8 border-2 border-[#145261] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-[14px] p-3.5 mb-3 border"
          style={{ borderColor: "rgba(20,82,97,0.15)" }}
        >
          {editingId === item.id ? (
            <>
              {fields.map((f) => (
                <div key={f} className="mb-2">
                  <p
                    className="font-extrabold tracking-wider mb-1"
                    style={{ color: "#145261", fontSize: 10 }}
                  >
                    {f.toUpperCase()}
                  </p>
                  {f === "description" ? (
                    <textarea
                      value={draft[f] ?? ""}
                      onChange={(e) => setDraft({ ...draft, [f]: e.target.value })}
                      data-testid={`admin-field-${f}`}
                      className="w-full p-2.5 rounded-[8px] border outline-none"
                      style={{ borderColor: "rgba(20,82,97,0.15)", color: "#092936", fontSize: 14, minHeight: 70 }}
                    />
                  ) : (
                    <input
                      value={draft[f] ?? ""}
                      onChange={(e) => setDraft({ ...draft, [f]: e.target.value })}
                      data-testid={`admin-field-${f}`}
                      className="w-full p-2.5 rounded-[8px] border outline-none"
                      style={{ borderColor: "rgba(20,82,97,0.15)", color: "#092936", fontSize: 14 }}
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-2.5 mt-2">
                <button
                  onClick={cancel}
                  data-testid="admin-cancel"
                  className="flex-1 py-3 rounded-[10px] border flex items-center justify-center gap-1.5"
                  style={{ borderColor: "rgba(20,82,97,0.15)", color: "#5A6A72", fontWeight: 700 }}
                >
                  <X size={16} /> Cancel
                </button>
                <button
                  onClick={save}
                  data-testid="admin-save"
                  className="flex-1 py-3 rounded-[10px] flex items-center justify-center gap-1.5"
                  style={{ background: "#145261", color: "#FFFFFF", fontWeight: 800 }}
                >
                  <Save size={16} color="#FFFFFF" /> Save
                </button>
              </div>
            </>
          ) : (
            <>
              {kind === "agenda" && (
                <span
                  className="inline-block font-extrabold rounded-full px-2.5 py-[3px] mb-1.5"
                  style={{ background: "#FDF4DC", color: "#541011", fontSize: 11 }}
                >
                  {item.time}
                </span>
              )}
              <h3 className="font-extrabold mb-1" style={{ color: "#092936", fontSize: 16 }}>
                {item.title}
              </h3>
              {item.description && (
                <p className="mb-1.5" style={{ color: "#5A6A72", fontSize: 13, lineHeight: "19px" }}>
                  {item.description}
                </p>
              )}
              {item.location && (
                <p className="font-semibold" style={{ color: "#145261", fontSize: 12 }}>
                  📍 {item.location}
                </p>
              )}
              {item.url !== undefined && item.url && (
                <p className="font-semibold truncate" style={{ color: "#145261", fontSize: 12 }}>
                  🔗 {item.url}
                </p>
              )}
              <button
                onClick={() => startEdit(item)}
                data-testid={`admin-edit-${item.id}`}
                className="inline-flex items-center gap-1 mt-2.5 px-3 py-1.5 rounded-[8px]"
                style={{ background: "#E6F0F2", color: "#145261", fontWeight: 700, fontSize: 13 }}
              >
                <Edit2 size={14} color="#145261" /> Edit
              </button>
            </>
          )}
        </div>
      ))}
    </>
  );
}
