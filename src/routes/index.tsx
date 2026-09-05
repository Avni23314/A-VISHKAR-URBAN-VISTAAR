import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import {
  conditionColor,
  roadSegments,
  severityColor,
  urbanEvents,
  busPositions,
  type UrbanEvent,
} from "@/lib/mock-data";
import type { Layers } from "@/components/CityMap";

const CityMap = lazy(() => import("@/components/CityMap"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Urban Intelligence — AI-Powered Mobile Urban Platform" },
      {
        name: "description",
        content:
          "Live city control room dashboard tracking road health, traffic, safety and waterlogging events detected by mobile bus-mounted sensors across Delhi.",
      },
      { property: "og:title", content: "Urban Intelligence Control Room" },
      {
        property: "og:description",
        content:
          "Real-time road health and urban event intelligence across Delhi, mapped from bus-mounted mobile sensors.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const layerMeta: { key: keyof Layers; label: string; dot: string }[] = [
  { key: "road", label: "Road Health", dot: "#22c55e" },
  { key: "traffic", label: "Traffic", dot: "#eab308" },
  { key: "safety", label: "Safety", dot: "#38bdf8" },
  { key: "waterlogging", label: "Waterlogging", dot: "#60a5fa" },
  { key: "buses", label: "Buses", dot: "#22d3ee" },
];

function Kpi({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-2xl font-semibold" style={{ color: tone }}>
        {value}
      </div>
    </div>
  );
}

function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [layers, setLayers] = useState<Layers>({
    road: true,
    traffic: true,
    safety: true,
    waterlogging: true,
    buses: true,
  });
  const [selected, setSelected] = useState<UrbanEvent | null>(null);

  useEffect(() => setMounted(true), []);

  const critical = urbanEvents.filter((e) => e.severity === "Critical").length;
  const confirmed = urbanEvents.filter((e) => e.confirmed).length;
  const avgHealth = Math.round(
    roadSegments.reduce((a, s) => a + s.health, 0) / roadSegments.length,
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
        <div>
          <h1 className="font-mono text-lg font-bold tracking-[0.3em] text-primary">
            URBAN INTELLIGENCE
          </h1>
          <p className="text-xs text-muted-foreground">
            AI-Powered Mobile Urban Intelligence Platform
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono text-xs tracking-widest text-emerald-400">
            SYSTEM STATUS: ONLINE
          </span>
        </div>
      </header>

      <div className="grid grid-cols-5 gap-3 border-b border-border bg-background px-6 py-3">
        <Kpi label="Active Buses" value={String(busPositions.length)} tone="#22d3ee" />
        <Kpi label="Active Events" value={String(urbanEvents.length)} tone="#e2e8f0" />
        <Kpi label="Critical" value={String(critical)} tone="#ef4444" />
        <Kpi label="Confirmed" value={String(confirmed)} tone="#22c55e" />
        <Kpi label="Road Health" value={`${avgHealth}%`} tone="#eab308" />
      </div>

      <main className="relative flex min-h-0 flex-1">
        <div className="relative min-w-0 flex-1">
          {mounted ? (
            <Suspense fallback={<MapSkeleton />}>
              <CityMap layers={layers} selectedId={selected?.id ?? null} onSelect={setSelected} />
            </Suspense>
          ) : (
            <MapSkeleton />
          )}

          <div className="pointer-events-auto absolute left-4 top-4 z-[1000] w-48 rounded-lg border border-border bg-card/95 p-3 backdrop-blur">
            <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Layers
            </div>
            <div className="space-y-1.5">
              {layerMeta.map((l) => (
                <button
                  key={l.key}
                  onClick={() => setLayers((s) => ({ ...s, [l.key]: !s[l.key] }))}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors ${
                    layers[l.key]
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: layers[l.key] ? l.dot : "#475569" }}
                    />
                    {l.label}
                  </span>
                  <span className="font-mono text-[10px]">{layers[l.key] ? "ON" : "OFF"}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 border-t border-border pt-2">
              <div className="mb-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Road Health
              </div>
              {(["healthy", "attention", "poor", "critical"] as const).map((c) => (
                <div key={c} className="flex items-center gap-2 py-0.5 text-[11px] capitalize">
                  <span
                    className="h-1.5 w-5 rounded-full"
                    style={{ background: conditionColor[c] }}
                  />
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="flex w-96 shrink-0 flex-col border-l border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="font-mono text-sm tracking-[0.2em] text-foreground">EVENT FEED</h2>
            <p className="text-[11px] text-muted-foreground">
              {urbanEvents.length} detections · live stream
            </p>
          </div>

          {selected && (
            <div className="border-b border-border bg-secondary/40 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold">{selected.type}</div>
                  <div className="font-mono text-[11px] text-muted-foreground">{selected.id}</div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary"
                >
                  ✕
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <Field label="Severity" value={selected.severity} color={severityColor[selected.severity]} />
                <Field label="Confidence" value={`${Math.round(selected.confidence * 100)}%`} />
                <Field label="Bus ID" value={selected.busId} />
                <Field label="Route" value={selected.route} />
                <Field label="Timestamp" value={new Date(selected.timestamp).toUTCString()} />
                <Field label="Status" value={selected.confirmed ? "Confirmed" : "Unverified"} />
                <Field label="Latitude" value={selected.lat.toFixed(5)} />
                <Field label="Longitude" value={selected.lng.toFixed(5)} />
              </div>
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {urbanEvents.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelected(e)}
                className={`mb-2 w-full rounded-lg border p-3 text-left transition-colors ${
                  selected?.id === e.id
                    ? "border-primary bg-secondary"
                    : "border-border bg-background hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{e.type}</span>
                  <span
                    className="rounded-full px-2 py-0.5 font-mono text-[10px]"
                    style={{ background: `${severityColor[e.severity]}22`, color: severityColor[e.severity] }}
                  >
                    {e.severity.toUpperCase()}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                  <span>{e.busId}</span>
                  <span>{new Date(e.timestamp).toISOString().slice(11, 19)} UTC</span>
                </div>
              </button>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}

function Field({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-md bg-background/70 px-2 py-1.5">
      <div className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">{label}</div>
      <div className="truncate font-mono text-[11px]" style={{ color }} title={value}>
        {value}
      </div>
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-secondary/30">
      <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
        INITIALIZING MAP…
      </span>
    </div>
  );
}
