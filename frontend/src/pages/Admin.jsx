import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Lock, ArrowLeft, Pencil, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Admin() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const verify = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await api.post("/admin/verify-pin", { pin });
      if (res.data.valid) {
        setUnlocked(true);
      } else {
        setError("Incorrect PIN. Please try again.");
      }
    } catch {
      setError("Unable to verify PIN. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (!unlocked) {
    return (
      <div className="px-5 pt-20 flex flex-col items-center" data-testid="admin-lock">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: "#092936" }}
        >
          <Lock size={32} color="#F6B829" strokeWidth={2.2} />
        </div>
        <h1 className="mt-6 font-display text-3xl text-center" style={{ color: "#092936", fontWeight: 700 }}>
          Admin Access
        </h1>
        <p className="mt-2 text-[14px] text-center max-w-xs" style={{ color: "#3D5560" }}>
          Enter the 4–6 digit PIN to edit agenda, sessions, and resources.
        </p>

        <div className="mt-8 w-full max-w-xs">
          <Input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && pin.length >= 4 && verify()}
            placeholder="••••"
            className="h-14 text-center text-2xl tracking-[0.6em] bg-white border-[#E8DFCF] rounded-xl"
            data-testid="admin-pin-input"
          />
          {error && (
            <p className="mt-2 text-[13px] text-center" style={{ color: "#C53030" }} data-testid="admin-error">
              {error}
            </p>
          )}
          <Button
            onClick={verify}
            disabled={pin.length < 4 || busy}
            data-testid="admin-unlock-btn"
            className="mt-4 w-full h-12 rounded-xl font-bold"
            style={{ background: "#145261", color: "#FFFFFF" }}
          >
            {busy ? "Verifying…" : "Unlock"}
          </Button>
        </div>
      </div>
    );
  }

  return <AdminPanel />;
}

function AdminPanel() {
  const [tab, setTab] = useState("agenda");

  return (
    <div className="px-5 pt-8" data-testid="admin-panel">
      <h1 className="font-display text-4xl" style={{ color: "#092936", fontWeight: 700 }}>
        Admin Panel
      </h1>
      <p className="mt-1 text-[14px]" style={{ color: "#3D5560" }}>
        Edit conference content. Changes save instantly.
      </p>

      <div className="mt-5 flex gap-2 p-1 rounded-xl" style={{ background: "#F4EFE6" }}>
        {[
          { id: "agenda", label: "Agenda" },
          { id: "sessions", label: "Sessions" },
          { id: "resources", label: "Resources" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            data-testid={`admin-tab-${t.id}`}
            className="flex-1 py-2 rounded-lg text-sm font-bold transition-colors"
            style={{
              background: tab === t.id ? "#FFFFFF" : "transparent",
              color: tab === t.id ? "#145261" : "#6B7B82",
              boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "agenda" && <EditList kind="agenda" fields={["time", "title", "description", "location", "type"]} />}
        {tab === "sessions" && <EditList kind="sessions" fields={["title", "location", "description"]} />}
        {tab === "resources" && <EditList kind="resources" fields={["title", "description", "url"]} />}
      </div>
      <div className="h-8" />
    </div>
  );
}

function EditList({ kind, fields }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const r = await api.get(`/${kind}`);
      setItems(r.data);
    } catch (e) {
      toast.error("Failed to load");
    }
  };

  useEffect(() => { load(); }, [kind]);

  const startEdit = (item) => {
    setEditing(item.id);
    const f = {};
    fields.forEach((k) => { f[k] = item[k] ?? ""; });
    setForm(f);
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/${kind}/${editing}`, form);
      toast.success("Saved");
      setEditing(null);
      await load();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3" data-testid={`admin-${kind}-list`}>
      {items.map((item, i) => (
        <div key={item.id} className="bg-white border border-[#E8DFCF] rounded-2xl px-4 py-4" data-testid={`admin-${kind}-row-${i}`}>
          {editing === item.id ? (
            <div className="space-y-3">
              {fields.map((k) => (
                <div key={k}>
                  <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#145261" }}>
                    {k}
                  </label>
                  {k === "description" ? (
                    <Textarea
                      value={form[k]}
                      onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                      className="mt-1 bg-white border-[#E8DFCF] rounded-lg text-[14px]"
                      rows={3}
                      data-testid={`admin-input-${k}`}
                    />
                  ) : (
                    <Input
                      value={form[k]}
                      onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                      className="mt-1 bg-white border-[#E8DFCF] rounded-lg text-[14px]"
                      data-testid={`admin-input-${k}`}
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <Button
                  onClick={save}
                  disabled={saving}
                  data-testid="admin-save-btn"
                  className="flex-1 h-10 rounded-lg font-bold"
                  style={{ background: "#145261", color: "#FFFFFF" }}
                >
                  <Check size={16} className="mr-1" />
                  {saving ? "Saving…" : "Save"}
                </Button>
                <Button
                  onClick={() => setEditing(null)}
                  data-testid="admin-cancel-btn"
                  variant="outline"
                  className="flex-1 h-10 rounded-lg font-bold border-[#E8DFCF]"
                >
                  <X size={16} className="mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                {kind === "agenda" && (
                  <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#145261" }}>
                    {item.time}
                  </p>
                )}
                <h3 className="font-display text-[16px] leading-snug" style={{ color: "#092936", fontWeight: 600 }}>
                  {item.title}
                </h3>
                {item.location && (
                  <p className="text-[12px]" style={{ color: "#6B7B82" }}>
                    {item.location}
                  </p>
                )}
                {item.url && (
                  <p className="text-[12px] truncate" style={{ color: "#145261" }}>
                    {item.url}
                  </p>
                )}
              </div>
              <Button
                onClick={() => startEdit(item)}
                data-testid={`admin-edit-btn-${i}`}
                size="sm"
                variant="outline"
                className="h-9 rounded-lg border-[#E8DFCF]"
              >
                <Pencil size={14} className="mr-1" /> Edit
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
