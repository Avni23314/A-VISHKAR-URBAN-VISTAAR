import { useEffect } from "react";
import {
  conditionColor,
  conditionOf,
  maintenanceTeams,
  roadSegments,
  severityColor,
  workStatusColor,
  type Priority,
  type UrbanEvent,
  type WorkStatus,
} from "@/lib/mock-data";

const priorityColor: Record<Priority, string> = {
  LOW: "#38bdf8",
  MEDIUM: "#eab308",
  HIGH: "#f97316",
  CRITICAL: "#ef4444",
};

export type OrderMap = Record<string, { team: string; status: WorkStatus; eta: string }>;

/* ------------------------------------------------------------------ */
/* Window shell                                                        */
/* ------------------------------------------------------------------ */

function OverlayWindow({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm sm:p-8">
      <div className="stage-in flex h-full max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
        {/* Title bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-secondary/40 px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
            </span>
            <div>
              <h2 className="font-mono text-sm font-bold tracking-[0.28em] text-primary">{title}</h2>
              <p className="text-[11px] text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-border bg-background px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.18em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            ✕ CLOSE&nbsp;<span className="hidden sm:inline">ESC</span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}

function StatChip({ label, value, tone }: { label: string; value: number | string; tone: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/60 px-3 py-2">
      <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="font-mono text-2xl font-semibold" style={{ color: tone }}>
        {value}
      </div>
    </div>
  );
}

function BigField({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-md border border-border/60 bg-background/70 px-2.5 py-2">
      <div className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div className="truncate font-mono text-sm" style={{ color }} title={value}>
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: WorkStatus }) {
  return (
    <span
      className="shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[10px]"
      style={{ background: `${workStatusColor[status]}22`, color: workStatusColor[status] }}
    >
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Event Feed dashboard                                                */
/* ------------------------------------------------------------------ */

export function EventFeedDashboard({
  events,
  selectedId,
  orders,
  onSelect,
  onFocusMap,
  onClose,
}: {
  events: UrbanEvent[];
  selectedId: string | null;
  orders: OrderMap;
  onSelect: (id: string) => void;
  onFocusMap: (e: UrbanEvent) => void;
  onClose: () => void;
}) {
  const selected = events.find((e) => e.id === selectedId) ?? null;
  const critical = events.filter((e) => e.severity === "Critical").length;
  const confirmed = events.filter((e) => e.status === "CONFIRMED").length;
  const unverified = events.filter((e) => e.status === "UNVERIFIED").length;

  return (
    <OverlayWindow
      title="EVENT FEED"
      subtitle="AI detections from the DTC bus fleet · live operational record"
      onClose={onClose}
    >
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatChip label="Total Detections" value={events.length} tone="#e2e8f0" />
        <StatChip label="Critical" value={critical} tone="#ef4444" />
        <StatChip label="Confirmed" value={confirmed} tone="#22c55e" />
        <StatChip label="Unverified" value={unverified} tone="#eab308" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.15fr]">
        {/* List */}
        <div className="space-y-2">
          <div className="font-mono text-[10px] tracking-[0.24em] text-muted-foreground">
            ALL DETECTIONS · NEWEST FIRST
          </div>
          <div className="max-h-[58vh] space-y-2 overflow-y-auto pr-1">
            {events.map((e) => {
              const order = orders[e.id];
              return (
                <button
                  key={e.id}
                  onClick={() => onSelect(e.id)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    selectedId === e.id
                      ? "border-primary bg-secondary"
                      : "border-border bg-background hover:bg-secondary/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium">{e.type}</span>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[10px]"
                      style={{ background: `${severityColor[e.severity]}22`, color: severityColor[e.severity] }}
                    >
                      {e.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-1.5 grid grid-cols-3 gap-2 font-mono text-[10px] text-muted-foreground">
                    <span>{e.id}</span>
                    <span>
                      {e.busId} · RT {e.route}
                    </span>
                    <span className="text-right">{e.timestamp.slice(11, 19)} UTC</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span
                      className="rounded-full px-2 py-0.5 font-mono text-[9px]"
                      style={{ background: `${priorityColor[e.priority]}22`, color: priorityColor[e.priority] }}
                    >
                      {e.priority}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 font-mono text-[9px]"
                      style={{
                        background:
                          e.status === "CONFIRMED"
                            ? "#22c55e22"
                            : e.status === "ACTION REQUIRED"
                              ? "#ef444422"
                              : "#eab30822",
                        color:
                          e.status === "CONFIRMED"
                            ? "#22c55e"
                            : e.status === "ACTION REQUIRED"
                              ? "#ef4444"
                              : "#eab308",
                      }}
                    >
                      {e.status}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {e.confirmedBy} BUS{e.confirmedBy > 1 ? "ES" : ""} · {e.observations} OBS
                    </span>
                    {order && <StatusBadge status={order.status} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail */}
        <div className="rounded-lg border border-border bg-background/40 p-4">
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold">{selected.type}</div>
                  <div className="font-mono text-[11px] text-muted-foreground">
                    {selected.id} · {selected.segmentId ?? "NO SEGMENT"} · {selected.category.toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={() => onFocusMap(selected)}
                  className="shrink-0 rounded-md border border-primary/50 bg-primary/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-primary transition-colors hover:bg-primary/20"
                >
                  VIEW ON MAP →
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <BigField label="Severity" value={selected.severity.toUpperCase()} color={severityColor[selected.severity]} />
                <BigField label="Confidence" value={`${Math.round(selected.confidence * 100)}%`} />
                <BigField
                  label="Status"
                  value={selected.status}
                  color={
                    selected.status === "CONFIRMED"
                      ? "#22c55e"
                      : selected.status === "ACTION REQUIRED"
                        ? "#ef4444"
                        : "#eab308"
                  }
                />
                <BigField label="Bus ID" value={selected.busId} />
                <BigField label="Route ID" value={selected.route} />
                <BigField label="Priority" value={selected.priority} color={priorityColor[selected.priority]} />
                <BigField label="Observations" value={String(selected.observations)} />
                <BigField
                  label="Confirmed By"
                  value={`${selected.confirmedBy} BUS${selected.confirmedBy > 1 ? "ES" : ""}`}
                />
                <BigField
                  label="Road Health"
                  value={
                    selected.segmentId
                      ? String(
                          roadSegments.find((s) => s.id === selected.segmentId)?.health ?? "—",
                        )
                      : "—"
                  }
                />
                <BigField label="Latitude" value={selected.lat.toFixed(5)} />
                <BigField label="Longitude" value={selected.lng.toFixed(5)} />
                <BigField label="Timestamp" value={`${selected.timestamp.slice(11, 19)} UTC`} />
              </div>

              <div className="mt-4">
                <div className="mb-2 font-mono text-[10px] tracking-[0.24em] text-muted-foreground">
                  WORK ORDER
                </div>
                {orders[selected.id] ? (
                  <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
                    <StatusBadge status={orders[selected.id]!.status} />
                    <span className="font-mono text-xs text-foreground">
                      {maintenanceTeams.find((t) => t.id === orders[selected.id]!.team)?.name ??
                        orders[selected.id]!.team}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">ETA {orders[selected.id]!.eta}</span>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No work order yet — assigned from the Maintenance Dispatch dashboard once confirmed.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-64 items-center justify-center">
              <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                SELECT AN EVENT TO OPEN ITS RECORD
              </p>
            </div>
          )}
        </div>
      </div>
    </OverlayWindow>
  );
}

/* ------------------------------------------------------------------ */
/* Maintenance Dispatch dashboard                                      */
/* ------------------------------------------------------------------ */

export function MaintenanceDashboard({
  events,
  orders,
  onAssign,
  onStatus,
  onEta,
  onFocusMap,
  onClose,
}: {
  events: UrbanEvent[];
  orders: OrderMap;
  onAssign: (eventId: string, team: string) => void;
  onStatus: (eventId: string, status: WorkStatus) => void;
  onEta: (eventId: string, eta: string) => void;
  onFocusMap: (e: UrbanEvent) => void;
  onClose: () => void;
}) {
  const dispatchable = events.filter((e) => e.status !== "UNVERIFIED");
  const open = Object.values(orders).filter((o) => o.status !== "RESOLVED").length;
  const inProgress = Object.values(orders).filter((o) => o.status === "IN PROGRESS").length;
  const resolved = Object.values(orders).filter((o) => o.status === "RESOLVED").length;
  const unassigned = dispatchable.filter((e) => !orders[e.id]).length;

  return (
    <OverlayWindow
      title="MAINTENANCE DISPATCH"
      subtitle="Confirmed events → work orders → field teams · live assignment board"
      onClose={onClose}
    >
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatChip label="Open Orders" value={open} tone="#eab308" />
        <StatChip label="In Progress" value={inProgress} tone="#f97316" />
        <StatChip label="Resolved" value={resolved} tone="#22c55e" />
        <StatChip label="Unassigned" value={unassigned} tone="#94a3b8" />
      </div>

      {dispatchable.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Confirmed events become work orders here.
        </p>
      ) : (
        <div className="max-h-[60vh] space-y-2.5 overflow-y-auto pr-1">
          {dispatchable.map((e) => {
            const order = orders[e.id];
            const status: WorkStatus = order?.status ?? "UNASSIGNED";
            const segHealth = e.segmentId
              ? roadSegments.find((s) => s.id === e.segmentId)?.health
              : undefined;
            return (
              <div key={e.id} className="rounded-lg border border-border bg-background/50 p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <button onClick={() => onFocusMap(e)} className="text-left text-sm font-medium hover:underline">
                    {e.type}
                  </button>
                  <StatusBadge status={status} />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-muted-foreground">
                  <span>{e.id}</span>
                  <span>{e.segmentId ?? "NO SEGMENT"}</span>
                  <span style={{ color: priorityColor[e.priority] }}>{e.priority}</span>
                  {segHealth !== undefined && (
                    <span style={{ color: conditionColor[conditionOf(segHealth)] }}>
                      ROAD HEALTH {segHealth}%
                    </span>
                  )}
                  <span>✓ {e.confirmedBy} BUSES</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <select
                    value={order?.team ?? ""}
                    onChange={(ev) => onAssign(e.id, ev.target.value)}
                    className="min-w-44 flex-1 rounded-md border border-border bg-background px-2 py-1.5 font-mono text-xs text-foreground"
                  >
                    <option value="" disabled>
                      ASSIGN TEAM…
                    </option>
                    {maintenanceTeams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={order?.eta ?? "4h"}
                    onChange={(ev) => onEta(e.id, ev.target.value)}
                    className="rounded-md border border-border bg-background px-2 py-1.5 font-mono text-xs text-foreground"
                  >
                    {["30m", "2h", "4h", "24h", "72h"].map((t) => (
                      <option key={t} value={t}>
                        ETA {t}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => onFocusMap(e)}
                    className="rounded-md border border-border bg-card px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    VIEW ON MAP →
                  </button>
                </div>

                <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                  {(["ASSIGNED", "IN PROGRESS", "RESOLVED"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => onStatus(e.id, s)}
                      className={`rounded-md border py-1.5 font-mono text-[10px] tracking-[0.12em] transition-colors ${
                        status === s
                          ? "border-transparent"
                          : "border-border text-muted-foreground hover:bg-secondary/60"
                      }`}
                      style={
                        status === s
                          ? { background: `${workStatusColor[s]}26`, color: workStatusColor[s] }
                          : undefined
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </OverlayWindow>
  );
}
