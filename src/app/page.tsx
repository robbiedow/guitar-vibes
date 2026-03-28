"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  ChevronLeft,
  Trash2,
  Zap,
  Music,
  Save,
  X,
  Guitar,
} from "lucide-react";
import {
  Preset,
  AMP_MODELS,
  EffectCategory,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  getEffectsByCategory,
} from "@/lib/data";
import { getPresets, savePreset, deletePreset, generateId } from "@/lib/store";

type View =
  | { type: "library" }
  | { type: "editor"; presetId: string | null }
  | { type: "amp-picker" }
  | { type: "effect-picker"; category: EffectCategory };

function emptyPreset(): Preset {
  return {
    id: generateId(),
    name: "",
    ampModel: "",
    effects: { stompbox: null, modulation: null, delay: null, reverb: null },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export default function App() {
  const [view, setView] = useState<View>({ type: "library" });
  const [presets, setPresets] = useState<Preset[]>([]);
  const [draft, setDraft] = useState<Preset>(emptyPreset());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPresets(getPresets());
    setLoaded(true);
  }, []);

  const refreshPresets = useCallback(() => setPresets(getPresets()), []);

  const openNewPreset = () => {
    setDraft(emptyPreset());
    setView({ type: "editor", presetId: null });
  };

  const openEditPreset = (p: Preset) => {
    setDraft({ ...p });
    setView({ type: "editor", presetId: p.id });
  };

  const handleSave = () => {
    if (!draft.ampModel) return;
    const name =
      draft.name.trim() ||
      (draft.songName
        ? `${draft.songName} — ${draft.ampModel}`
        : draft.ampModel);
    savePreset({ ...draft, name });
    refreshPresets();
    setView({ type: "library" });
  };

  const handleDelete = () => {
    deletePreset(draft.id);
    refreshPresets();
    setView({ type: "library" });
  };

  if (!loaded) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[var(--color-bg)]">
        <Zap className="w-8 h-8 text-[var(--color-amber)] animate-pulse" />
      </div>
    );
  }

  // === LIBRARY VIEW ===
  if (view.type === "library") {
    return (
      <div className="min-h-dvh pb-24 px-4 pt-safe">
        <header className="pt-12 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full bg-[var(--color-amber)] led-glow" />
            <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide text-[var(--color-text)]">
              TONEBOARD
            </h1>
          </div>
          <p className="text-[var(--color-text-dim)] text-sm ml-5">
            Mustang Micro Plus
          </p>
        </header>

        {presets.length === 0 ? (
          <div className="animate-fade-up mt-20 text-center">
            <Guitar className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-faint)]" strokeWidth={1} />
            <p className="text-[var(--color-text-dim)] mb-1">No presets yet</p>
            <p className="text-[var(--color-text-faint)] text-sm">
              Tap + to build your first tone
            </p>
          </div>
        ) : (
          <div className="stagger space-y-3">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => openEditPreset(p)}
                className="w-full text-left bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 active:scale-[0.98] transition-transform"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-[family-name:var(--font-mono)] text-sm font-bold text-[var(--color-text)] truncate">
                      {p.name || p.ampModel}
                    </h3>
                    {p.songName && (
                      <p className="text-xs text-[var(--color-text-dim)] mt-0.5 truncate flex items-center gap-1">
                        <Music className="w-3 h-3 shrink-0" />
                        {p.songName}
                        {p.artistName ? ` — ${p.artistName}` : ""}
                      </p>
                    )}
                    <p className="text-xs text-[var(--color-text-faint)] mt-1 font-[family-name:var(--font-mono)]">
                      {p.ampModel}
                    </p>
                  </div>
                  <div className="flex gap-1.5 mt-1 shrink-0">
                    {(
                      ["stompbox", "modulation", "delay", "reverb"] as const
                    ).map((cat) => (
                      <div
                        key={cat}
                        className="w-2.5 h-2.5 rounded-full transition-all"
                        style={{
                          backgroundColor: p.effects[cat]
                            ? CATEGORY_COLORS[cat]
                            : "var(--color-border)",
                          boxShadow: p.effects[cat]
                            ? `0 0 6px ${CATEGORY_COLORS[cat]}40`
                            : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* FAB */}
        <button
          onClick={openNewPreset}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[var(--color-amber)] text-black flex items-center justify-center shadow-lg shadow-[var(--color-amber)]/20 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  // === AMP PICKER ===
  if (view.type === "amp-picker") {
    return (
      <div className="min-h-dvh pb-8 animate-fade-in">
        <header className="sticky top-0 z-10 bg-[var(--color-bg)]/95 backdrop-blur-sm border-b border-[var(--color-border)] px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => setView({ type: "editor", presetId: draft.id })}
            className="p-1"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--color-text-dim)]" />
          </button>
          <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide">
            SELECT AMP
          </h2>
        </header>
        <div className="px-4 pt-3 space-y-1.5">
          {AMP_MODELS.map((amp) => (
            <button
              key={amp.name}
              onClick={() => {
                setDraft((d) => ({ ...d, ampModel: amp.name }));
                setView({ type: "editor", presetId: draft.id });
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                draft.ampModel === amp.name
                  ? "bg-[var(--color-amber)]/10 border border-[var(--color-amber)]/30"
                  : "bg-[var(--color-surface)] border border-transparent active:bg-[var(--color-surface-raised)]"
              }`}
            >
              <div>
                <p
                  className={`font-[family-name:var(--font-mono)] text-sm font-bold ${
                    draft.ampModel === amp.name
                      ? "text-[var(--color-amber)]"
                      : "text-[var(--color-text)]"
                  }`}
                >
                  {amp.name}
                </p>
                {amp.description && (
                  <p className="text-xs text-[var(--color-text-faint)] mt-0.5">
                    {amp.description}
                  </p>
                )}
              </div>
              {draft.ampModel === amp.name && (
                <div className="w-2 h-2 rounded-full bg-[var(--color-amber)] led-glow" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // === EFFECT PICKER ===
  if (view.type === "effect-picker") {
    const cat = view.category;
    const effects = getEffectsByCategory(cat);
    const color = CATEGORY_COLORS[cat];
    return (
      <div className="min-h-dvh pb-8 animate-fade-in">
        <header className="sticky top-0 z-10 bg-[var(--color-bg)]/95 backdrop-blur-sm border-b border-[var(--color-border)] px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => setView({ type: "editor", presetId: draft.id })}
            className="p-1"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--color-text-dim)]" />
          </button>
          <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide">
            {CATEGORY_LABELS[cat].toUpperCase()}
          </h2>
        </header>
        <div className="px-4 pt-3 space-y-1.5">
          {/* None option */}
          <button
            onClick={() => {
              setDraft((d) => ({
                ...d,
                effects: { ...d.effects, [cat]: null },
              }));
              setView({ type: "editor", presetId: draft.id });
            }}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              draft.effects[cat] === null
                ? "bg-[var(--color-surface-raised)] border border-[var(--color-border-bright)]"
                : "bg-[var(--color-surface)] border border-transparent active:bg-[var(--color-surface-raised)]"
            }`}
          >
            <p className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-text-faint)]">
              NONE
            </p>
          </button>
          {effects.map((fx) => {
            const isSelected = draft.effects[cat] === fx.name;
            return (
              <button
                key={fx.name}
                onClick={() => {
                  setDraft((d) => ({
                    ...d,
                    effects: { ...d.effects, [cat]: fx.name },
                  }));
                  setView({ type: "editor", presetId: draft.id });
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                  isSelected
                    ? "border"
                    : "bg-[var(--color-surface)] border border-transparent active:bg-[var(--color-surface-raised)]"
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: `${color}10`,
                        borderColor: `${color}40`,
                      }
                    : {}
                }
              >
                <p
                  className="font-[family-name:var(--font-mono)] text-sm font-bold"
                  style={{ color: isSelected ? color : "var(--color-text)" }}
                >
                  {fx.name}
                </p>
                {isSelected && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 6px ${color}`,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // === EDITOR VIEW ===
  const isEditing = presets.some((p) => p.id === draft.id);
  const canSave = draft.ampModel !== "";
  const activeEffectCount = Object.values(draft.effects).filter(Boolean).length;

  return (
    <div className="min-h-dvh pb-12 animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--color-bg)]/95 backdrop-blur-sm border-b border-[var(--color-border)] px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => setView({ type: "library" })}
          className="flex items-center gap-1 text-[var(--color-text-dim)]"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>
        <h2 className="font-[family-name:var(--font-display)] text-xl tracking-wide">
          {isEditing ? "EDIT PRESET" : "NEW PRESET"}
        </h2>
        <div className="w-16" />
      </header>

      <div className="px-4 pt-6 space-y-6">
        {/* Preset Name */}
        <div>
          <label className="block text-xs text-[var(--color-text-faint)] uppercase tracking-widest font-[family-name:var(--font-mono)] mb-2">
            Preset Name
          </label>
          <input
            type="text"
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            placeholder="My Tone..."
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:border-[var(--color-amber)]/50 transition-colors text-sm"
          />
        </div>

        {/* Amp Selector */}
        <div>
          <label className="block text-xs text-[var(--color-text-faint)] uppercase tracking-widest font-[family-name:var(--font-mono)] mb-2">
            Amplifier
          </label>
          <button
            onClick={() => setView({ type: "amp-picker" })}
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 text-left active:bg-[var(--color-surface-raised)] transition-colors"
          >
            {draft.ampModel ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-amber)]/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-[var(--color-amber)]" />
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-mono)] text-sm font-bold text-[var(--color-amber)]">
                      {draft.ampModel}
                    </p>
                    <p className="text-xs text-[var(--color-text-faint)]">
                      {AMP_MODELS.find((a) => a.name === draft.ampModel)
                        ?.description || ""}
                    </p>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-[var(--color-text-faint)] rotate-180" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-[var(--color-text-faint)] text-sm">
                  Select an amplifier...
                </p>
                <ChevronLeft className="w-4 h-4 text-[var(--color-text-faint)] rotate-180" />
              </div>
            )}
          </button>
        </div>

        {/* Effects Chain */}
        <div>
          <label className="block text-xs text-[var(--color-text-faint)] uppercase tracking-widest font-[family-name:var(--font-mono)] mb-2">
            Effects Chain{" "}
            <span className="text-[var(--color-text-faint)]">
              ({activeEffectCount}/4)
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {(["stompbox", "modulation", "delay", "reverb"] as const).map(
              (cat) => {
                const color = CATEGORY_COLORS[cat];
                const active = draft.effects[cat];
                return (
                  <button
                    key={cat}
                    onClick={() =>
                      setView({ type: "effect-picker", category: cat })
                    }
                    className="relative bg-[var(--color-surface)] border rounded-xl p-3.5 text-left active:scale-[0.97] transition-all"
                    style={{
                      borderColor: active ? `${color}30` : "var(--color-border)",
                      backgroundColor: active
                        ? `${color}08`
                        : "var(--color-surface)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-[10px] uppercase tracking-widest font-[family-name:var(--font-mono)]"
                        style={{
                          color: active ? color : "var(--color-text-faint)",
                        }}
                      >
                        {CATEGORY_LABELS[cat]}
                      </span>
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: active
                            ? color
                            : "var(--color-border)",
                          boxShadow: active ? `0 0 4px ${color}` : "none",
                        }}
                      />
                    </div>
                    <p
                      className="font-[family-name:var(--font-mono)] text-xs font-bold truncate"
                      style={{
                        color: active ? "var(--color-text)" : "var(--color-text-faint)",
                      }}
                    >
                      {active || "—"}
                    </p>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Song Info (optional) */}
        <div>
          <label className="block text-xs text-[var(--color-text-faint)] uppercase tracking-widest font-[family-name:var(--font-mono)] mb-2">
            Song <span className="normal-case">(optional)</span>
          </label>
          <div className="space-y-2">
            <input
              type="text"
              value={draft.songName || ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, songName: e.target.value }))
              }
              placeholder="Song name"
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:border-[var(--color-amber)]/50 transition-colors text-sm"
            />
            <input
              type="text"
              value={draft.artistName || ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, artistName: e.target.value }))
              }
              placeholder="Artist"
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:border-[var(--color-amber)]/50 transition-colors text-sm"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs text-[var(--color-text-faint)] uppercase tracking-widest font-[family-name:var(--font-mono)] mb-2">
            Notes <span className="normal-case">(optional)</span>
          </label>
          <textarea
            value={draft.notes || ""}
            onChange={(e) =>
              setDraft((d) => ({ ...d, notes: e.target.value }))
            }
            placeholder="Tone notes, guitar used, etc..."
            rows={3}
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:border-[var(--color-amber)]/50 transition-colors text-sm resize-none"
          />
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`w-full py-3.5 rounded-xl font-[family-name:var(--font-display)] text-lg tracking-wider flex items-center justify-center gap-2 transition-all ${
              canSave
                ? "bg-[var(--color-amber)] text-black active:scale-[0.98]"
                : "bg-[var(--color-surface)] text-[var(--color-text-faint)] cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4" />
            {isEditing ? "UPDATE PRESET" : "SAVE PRESET"}
          </button>

          {isEditing && (
            <button
              onClick={handleDelete}
              className="w-full py-3 rounded-xl border border-red-900/30 text-red-400 font-[family-name:var(--font-mono)] text-xs flex items-center justify-center gap-2 active:bg-red-950/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              DELETE PRESET
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
