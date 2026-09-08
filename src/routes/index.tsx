import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import {
  baseEvents,
  busesAt,
  busPositions,
  conditionColor,
  conditionOf,
  heroEvent,
  HERO_BUS_ID,
  HERO_EVENT_ID,
  maintenanceTeams,
  roadSegments,
  safetyEvent,
  severityColor,
  trafficColor,
  workStatusColor,
  type LiveBus,
  type Priority,
  type UrbanEvent,
  type WorkStatus,
} from "@/lib/mock-data";
import type { Layers } from "@/components/CityMap";

const CityMap = lazy(() => import("@/components/CityMap"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Urban Intelligence — City Command Center for Bus-Sensed Roads" },
      {
        name: "description",
        content:
          "Smart city command center turning the existing public bus fleet into a mobile sensing network: AI detection, geo-tagged events, multi-bus validation and road-health intelligence.",
      },
      { property: "og:title", content: "Urban Intelligence Command Center" },
      {
        property: "og:description",
        content:
          "AI perception on buses already moving through the city — geo-tagged events, fleet consensus and live road health.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const layerMeta: { key: keyof Layers; label: string; dot: string }[] = [
  { key: "road", label: "Road Health", dot: "#22c55e" },
  { key: "traffic", label: "Traffic", dot: "#38bdf8" },
  { key: "safety", label: "Safety", dot: "#a78bfa" },
  { key: "waterlogging", label: "Waterlogging", dot: "#60a5fa" },
  { key: "buses", label: "Buses", dot: "#22d3ee" },
];

const priorityColor: Record<Priority, string> = {
  LOW: "#38bdf8",
  MEDIUM: "#eab308",
  HIGH: "#f97316",
  CRITICAL: "#ef4444",
};

const HERO_SEGMENT = "SEG-021";

function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [layers, setLayers] = useState<Layers>({
    road: true,
    traffic: true,
    safety: true,
    waterlogging: true,
    buses: true,
  });
  const [events, setEvents] = useState<UrbanEvent[]>(baseEvents);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focus, setFocus] = useState<[number, number] | null>(null);
  const [healthOverrides, setHealthOverrides] = useState<Record<string, number>>({});
  const [highlightSegment, setHighlightSegment] = useState<string | null>(null);
  const [stage, setStage] = useState<{ label: string; text: string; tone: string } | null>(null);
  const [alert, setAlert] = useState<UrbanEvent | null>(null);
  const [demoRunning, setDemoRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [buses, setBuses] = useState<LiveBus[]>(busPositions);
  const [orders, setOrders] = useState<Record<string, { team: string; status: WorkStatus; eta: string }>>(
    {},
  );

  useEffect(() => setMounted(true), []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Buses move along their real DTC route alignments.
  useEffect(() => {
    let tick = 0;
    const id = setInterval(() => {
      tick += 1;
      setBuses(busesAt(tick));
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const heroBus = buses.find((b) => b.id === HERO_BUS_ID) ?? buses[0]!;
  const selected = events.find((e) => e.id === selectedId) ?? null;
  const criticalCount = events.filter((e) => e.severity === "Critical").length;
  const confirmedCount = events.filter((e) => e.status === "CONFIRMED").length;
  const dispatchable = events.filter((e) => e.status !== "UNVERIFIED");
  const avgHealth = Math.round(
    roadSegments.reduce((a, s) => a + (healthOverrides[s.id] ?? s.health), 0) / roadSegments.length,
  );

  const assign = useCallback((eventId: string, team: string) => {
    setOrders((o) => ({
      ...o,
      [eventId]: {
        team,
        status: o[eventId]?.status && o[eventId]!.status !== "UNASSIGNED" ? o[eventId]!.status : "ASSIGNED",
        eta: o[eventId]?.eta ?? "4h",
      },
    }));
  }, []);

  const setOrderStatus = useCallback((eventId: string, status: WorkStatus) => {
    setOrders((o) => ({
      ...o,
      [eventId]: {
        team: o[eventId]?.team ?? maintenanceTeams[0]!.id,
        status,
        eta: o[eventId]?.eta ?? "4h",
      },
    }));
  }, []);


  const selectEvent = useCallback((e: UrbanEvent) => {
    setSelectedId(e.id);
    setFocus([e.lat, e.lng]);
    setHighlightSegment(e.segmentId);
  }, []);

  /** Advance hero-event fleet consensus by one bus observation. */
  const addObservation = useCallback(() => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== HERO_EVENT_ID) return e;
        const n = Math.min(e.observations + 1, 3);
        const health = n >= 3 ? 32 : n === 2 ? 48 : 72;
        setHealthOverrides((h) => ({ ...h, [HERO_SEGMENT]: health }));
        return {
          ...e,
          observations: n,
          confirmedBy: n,
          status: n >= 2 ? "CONFIRMED" : "UNVERIFIED",
          priority: n >= 3 ? "CRITICAL" : n === 2 ? "HIGH" : "MEDIUM",
          severity: n >= 3 ? "Critical" : "High",
        };
      }),
    );
  }, []);

  const runDemo = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setDemoRunning(true);
    setEvents(baseEvents);
    setHealthOverrides({});
    setHighlightSegment(null);
    setSelectedId(null);
    setAlert(null);
    setOrders({});
    setFocus([28.5245, 77.2066]);

    const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));

    setStage({ label: "MONITORING", text: "Fleet online · 7 DTC buses streaming edge AI", tone: "#22d3ee" });

    at(3000, () => {
      setStage({
        label: "AI DETECTION",
        text: "Pothole cluster detected by DTC-102 · Route 764 (MB Road) · confidence 91%",
        tone: "#f97316",
      });
      selectEvent(heroEvent);
    });

    at(6000, () => {
      setStage({
        label: "ROAD SEGMENT UPDATED",
        text: "SEG-021 geo-tagged · road health trending toward critical",
        tone: "#eab308",
      });
      setHighlightSegment(HERO_SEGMENT);
    });

    at(9000, () => {
      setStage({
        label: "FLEET VALIDATION",
        text: "✓ CONFIRMED BY 2 BUSES · independent observation matched",
        tone: "#22c55e",
      });
      addObservation();
    });

    at(12000, () => {
      setStage({
        label: "ROAD HEALTH UPDATED",
        text: "Third bus confirms · road health 48 → 32 · priority HIGH → CRITICAL",
        tone: "#ef4444",
      });
      addObservation();
    });

    at(15500, () => {
      setStage({
        label: "HIGH PRIORITY ALERT",
        text: "Serious passenger safety incident on DTC-102 · action required",
        tone: "#ef4444",
      });
      setEvents((prev) => [safetyEvent, ...prev]);
      setAlert(safetyEvent);
      setSelectedId(safetyEvent.id);
      setFocus([safetyEvent.lat, safetyEvent.lng]);
    });

    at(18500, () => {
      setStage({
        label: "WORK ORDER DISPATCHED",
        text: "SEG-021 assigned to PWD South · Crew 3 · safety case to DTC Safety Response",
        tone: "#22c55e",
      });
      setOrders({
        [HERO_EVENT_ID]: { team: "PWD-S3", status: "ASSIGNED", eta: "4h" },
        [safetyEvent.id]: { team: "DTC-SAF", status: "IN PROGRESS", eta: "30m" },
      });
    });

    at(21500, () => {
      setStage({
        label: "MONITORING",
        text: "Work orders live · authorities notified · fleet continues sensing",
        tone: "#22d3ee",
      });
      setDemoRunning(false);
    });

    at(24000, () => setStage(null));
  }, [addObservation, selectEvent]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* HEADER */}
      <header className="flex items-center justify-between gap-6 border-b border-border bg-card px-5 py-2.5">
        <div className="flex items-baseline gap-5">
          <div>
            <h1 className="font-mono text-base font-bold tracking-[0.32em] text-primary">
              URBAN INTELLIGENCE
            </h1>
            <p className="text-[11px] text-muted-foreground">
              AI-Powered Mobile Urban Intelligence Platform
            </p>
          </div>
          <div className="hidden border-l border-border pl-5 lg:block">
            <div className="font-mono text-[11px] tracking-[0.22em] text-foreground">
              CITY INTELLIGENCE
            </div>
            <p className="text-[10px] text-muted-foreground">
              Real-time geospatial intelligence from the public transport fleet
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden max-w-md text-right xl:block">
            <p className="font-mono text-[10px] tracking-[0.12em] text-foreground/90">
              WE DON&apos;T BUILD ANOTHER SENSOR NETWORK.
            </p>
            <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
              WE TURN THE BUSES ALREADY MOVING THROUGH THE CITY INTO ONE.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5">
            <Pulse color="#34d399" />
            <span className="font-mono text-[10px] tracking-widest text-emerald-400">ONLINE</span>
          </div>
          <button
            onClick={runDemo}
            className="rounded-md bg-primary px-4 py-2 font-mono text-xs font-bold tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            disabled={demoRunning}
          >
            {demoRunning ? "RUNNING…" : "RUN DEMO"}
          </button>
        </div>
      </header>

      {/* KPI STRIP */}
      <div className="grid grid-cols-5 gap-2 border-b border-border px-5 py-2">
        <Kpi label="Active Buses" value={String(buses.length)} tone="#22d3ee" />
        <Kpi label="Active Events" value={String(events.length)} tone="#e2e8f0" />
        <Kpi label="Critical" value={String(criticalCount)} tone="#ef4444" />
        <Kpi label="Confirmed" value={String(confirmedCount)} tone="#22c55e" />
        <Kpi label="Road Health" value={`${avgHealth}%`} tone={conditionColor[conditionOf(avgHealth)]} />
      </div>

      {/* MAIN */}
      <main className="relative flex min-h-0 flex-1">
        <div className="relative min-w-0 flex-1">
          {mounted ? (
            <Suspense fallback={<MapSkeleton />}>
              <CityMap
                layers={layers}
                events={events}
                buses={buses}
                selectedId={selectedId}
                focus={focus}
                healthOverrides={healthOverrides}
                highlightSegment={highlightSegment}
                onSelect={selectEvent}
              />
            </Suspense>
          ) : (
            <MapSkeleton />
          )}

          {/* LEFT: layers + legend */}
          <div className="absolute left-3 top-3 z-[1000] w-44 rounded-lg border border-border bg-card/90 p-2.5 backdrop-blur">
            <SectionLabel>Layers</SectionLabel>
            <div className="space-y-1">
              {layerMeta.map((l) => (
                <button
                  key={l.key}
                  onClick={() => setLayers((s) => ({ ...s, [l.key]: !s[l.key] }))}
                  className={`flex w-full items-center justify-between rounded px-2 py-1 text-[11px] transition-colors ${
                    layers[l.key]
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: layers[l.key] ? l.dot : "#475569" }}
                    />
                    {l.label}
                  </span>
                  <span className="font-mono text-[9px]">{layers[l.key] ? "ON" : "OFF"}</span>
                </button>
              ))}
            </div>

            <div className="mt-2.5 border-t border-border pt-2">
              <SectionLabel>Road Health · outer</SectionLabel>
              <div className="grid grid-cols-2 gap-x-2">
                {(["healthy", "attention", "poor", "critical"] as const).map((c) => (
                  <LegendRow key={c} color={conditionColor[c]} label={c} thick />
                ))}
              </div>
              <div className="mt-2">
                <SectionLabel>Traffic · inner</SectionLabel>
                <div className="grid grid-cols-2 gap-x-2">
                  {(["low", "moderate", "heavy"] as const).map((t) => (
                    <LegendRow key={t} color={trafficColor[t]} label={t} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* LEFT BOTTOM: intelligence status + bus feed */}
          <div className="absolute bottom-6 left-3 z-[1000] w-56 space-y-2">
            <div className="rounded-lg border border-border bg-card/90 p-2.5 backdrop-blur">
              <SectionLabel>Live Bus Feed</SectionLabel>
              <div className="relative mb-2 h-20 overflow-hidden rounded border border-border bg-[linear-gradient(180deg,#0f172a,#1e293b)]">
                <div className="scanline absolute inset-x-0 h-8 bg-[linear-gradient(180deg,transparent,rgba(34,211,238,0.16),transparent)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 w-24 rounded-sm border border-dashed border-cyan-400/50" />
                </div>
                <span className="absolute left-1.5 top-1.5 font-mono text-[8px] tracking-widest text-cyan-300">
                  FRONT CAM
                </span>
                <span className="absolute bottom-1.5 right-1.5 font-mono text-[8px] text-rose-400">
                  ● REC
                </span>
              </div>
              <MetaLine k="BUS" v={heroBus.id} />
              <MetaLine k="ROUTE" v={`${heroBus.route} · ${heroBus.nextStop}`} />
              <MetaLine k="GPS" v={`${heroBus.lat.toFixed(4)}, ${heroBus.lng.toFixed(4)}`} />
              <MetaLine k="SPEED" v={`${heroBus.speed} KM/H`} />
              <MetaLine k="STATUS" v="● PROCESSING" tone="#22d3ee" />
            </div>

            <div className="rounded-lg border border-border bg-card/90 p-2.5 backdrop-blur">
              <SectionLabel>Intelligence Status</SectionLabel>
              {[
                ["AI PROCESSING", "ACTIVE"],
                ["FLEET VALIDATION", "ONLINE"],
                ["GIS ENGINE", "ONLINE"],
                ["DATA PIPELINE", "ONLINE"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-0.5">
                  <span className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground">
                    {k}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[9px] text-emerald-400">
                    <Pulse color="#34d399" small /> {v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* STAGE BANNER */}
          {stage && (
            <div className="pointer-events-none absolute left-1/2 top-3 z-[1000] w-[520px] max-w-[70%] -translate-x-1/2">
              <div
                className="stage-in rounded-lg border bg-card/95 px-4 py-2.5 backdrop-blur"
                style={{ borderColor: stage.tone }}
              >
                <div
                  className="font-mono text-[11px] font-bold tracking-[0.28em]"
                  style={{ color: stage.tone }}
                >
                  {stage.label}
                </div>
                <div className="text-[11px] text-muted-foreground">{stage.text}</div>
              </div>
            </div>
          )}

          {/* WSP / USP micro-box */}
          <div className="absolute bottom-6 right-3 z-[1000]">
            <details className="w-56 rounded-lg border border-border bg-card/90 p-2.5 backdrop-blur">
              <summary className="cursor-pointer list-none font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                WSP / USP ▾
              </summary>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[9px] leading-relaxed text-muted-foreground">
                <div>
                  <div className="font-mono text-[9px] tracking-[0.16em] text-foreground">WSP</div>
                  Mobile AI
                  <br />
                  Edge Processing
                  <br />
                  Geo-temporal Events
                  <br />
                  Fleet Consensus
                  <br />
                  Privacy-first
                </div>
                <div>
                  <div className="font-mono text-[9px] tracking-[0.16em] text-foreground">USP</div>
                  Existing Fleet
                  <br />
                  Low Incremental Infra
                  <br />
                  Multi-purpose Sensing
                  <br />
                  Scalable
                  <br />
                  Action-oriented
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <aside className="flex w-[360px] shrink-0 flex-col border-l border-border bg-card">
          {alert && (
            <button
              onClick={() => selectEvent(alert)}
              className="alert-flash w-full border-b px-4 py-2 text-left"
              style={{ borderColor: "rgba(244,63,94,0.4)" }}
            >
              <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-rose-400">
                ● HIGH PRIORITY · ACTION REQUIRED
              </div>
              <div className="text-[11px] text-foreground">
                {alert.type} · {alert.busId} · Route {alert.route}
              </div>
              <div className="mt-1 font-mono text-[9px] tracking-[0.14em] text-rose-300/90">
                WOMEN &amp; PASSENGER SAFETY
              </div>
              <div className="text-[10px] text-muted-foreground">
                AI-assisted incident intelligence for faster, geolocated response.
              </div>
            </button>
          )}

          {selected ? (
            <div className="border-b border-border bg-secondary/40 p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold leading-tight">{selected.type}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">
                    {selected.id} · {selected.segmentId ?? "NO SEGMENT"}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-secondary"
                >
                  ✕
                </button>
              </div>

              <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                <Field label="Severity" value={selected.severity.toUpperCase()} color={severityColor[selected.severity]} />
                <Field label="Confidence" value={`${Math.round(selected.confidence * 100)}%`} />
                <Field label="Status" value={selected.status} color={selected.status === "CONFIRMED" ? "#22c55e" : selected.status === "ACTION REQUIRED" ? "#ef4444" : "#eab308"} />
                <Field label="Bus ID" value={selected.busId} />
                <Field label="Route ID" value={selected.route} />
                <Field label="Priority" value={selected.priority} color={priorityColor[selected.priority]} />
                <Field label="Observations" value={String(selected.observations)} />
                <Field label="Confirmed By" value={`${selected.confirmedBy} BUS${selected.confirmedBy > 1 ? "ES" : ""}`} />
                <Field
                  label="Road Health"
                  value={
                    selected.segmentId
                      ? String(
                          healthOverrides[selected.segmentId] ??
                            roadSegments.find((s) => s.id === selected.segmentId)?.health ??
                            "—",
                        )
                      : "—"
                  }
                  color={
                    selected.segmentId
                      ? conditionColor[
                          conditionOf(
                            healthOverrides[selected.segmentId] ??
                              roadSegments.find((s) => s.id === selected.segmentId)?.health ??
                              100,
                          )
                        ]
                      : undefined
                  }
                />
                <Field label="Latitude" value={selected.lat.toFixed(5)} />
                <Field label="Longitude" value={selected.lng.toFixed(5)} />
                <Field label="Timestamp" value={`${selected.timestamp.slice(11, 19)} UTC`} />
              </div>

              {selected.id === HERO_EVENT_ID && selected.observations < 3 && (
                <button
                  onClick={addObservation}
                  className="mt-2.5 w-full rounded border border-primary/50 bg-primary/10 py-1.5 font-mono text-[10px] tracking-[0.16em] text-primary hover:bg-primary/20"
                >
                  SIMULATE NEXT BUS OBSERVATION
                </button>
              )}
            </div>
          ) : (
            <div className="border-b border-border px-4 py-3">
              <h2 className="font-mono text-xs tracking-[0.24em]">EVENT FEED</h2>
              <p className="text-[10px] text-muted-foreground">
                Select an event on the map to open its operational record
              </p>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-border px-4 py-1.5">
            <span className="font-mono text-[10px] tracking-[0.24em] text-muted-foreground">
              EVENT FEED
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {events.length} DETECTIONS
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
            {events.map((e) => (
              <button
                key={e.id}
                onClick={() => selectEvent(e)}
                className={`mb-1.5 w-full rounded-lg border p-2.5 text-left transition-colors ${
                  selectedId === e.id
                    ? "border-primary bg-secondary"
                    : "border-border bg-background hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[13px] font-medium">{e.type}</span>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px]"
                    style={{
                      background: `${severityColor[e.severity]}22`,
                      color: severityColor[e.severity],
                    }}
                  >
                    {e.severity.toUpperCase()}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between font-mono text-[9px] text-muted-foreground">
                  <span>
                    {e.id} · {e.busId}
                  </span>
                  <span>{e.timestamp.slice(11, 19)} UTC</span>
                </div>
                {e.status !== "UNVERIFIED" && (
                  <div
                    className="mt-1 font-mono text-[9px] tracking-[0.14em]"
                    style={{ color: e.status === "CONFIRMED" ? "#22c55e" : "#ef4444" }}
                  >
                    {e.status === "CONFIRMED" ? `✓ CONFIRMED · ${e.confirmedBy} BUSES` : "ACTION REQUIRED"}
                  </div>
                )}
              </button>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}

function Kpi({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-md border border-border bg-card px-3 py-1.5">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="font-mono text-xl font-semibold" style={{ color: tone }}>
        {value}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </div>
  );
}

function LegendRow({ color, label, thick }: { color: string; label: string; thick?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 py-0.5 text-[10px] capitalize">
      <span
        className="w-4 rounded-full"
        style={{ background: color, height: thick ? 4 : 2 }}
      />
      {label}
    </div>
  );
}

function MetaLine({ k, v, tone }: { k: string; v: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground">{k}</span>
      <span className="font-mono text-[9px]" style={{ color: tone }}>
        {v}
      </span>
    </div>
  );
}

function Field({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string | undefined;
}) {
  return (
    <div className="rounded border border-border/60 bg-background/70 px-1.5 py-1">
      <div className="text-[8px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="truncate font-mono text-[10px]" style={{ color }} title={value}>
        {value}
      </div>
    </div>
  );
}

function Pulse({ color, small }: { color: string; small?: boolean }) {
  const s = small ? "h-1.5 w-1.5" : "h-2 w-2";
  return (
    <span className={`relative flex ${s}`}>
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
        style={{ background: color }}
      />
      <span className={`relative inline-flex ${s} rounded-full`} style={{ background: color }} />
    </span>
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
