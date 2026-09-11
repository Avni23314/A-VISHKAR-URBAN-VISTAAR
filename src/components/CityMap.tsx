import { useEffect, useMemo, useRef, useState } from "react";
import {
  busPositions,
  conditionColor,
  conditionOf,
  HERO_BUS_ID,
  roadSegments,
  severityColor,
  trafficColor,
  type LiveBus,
  type UrbanEvent,
} from "@/lib/mock-data";

export type Layers = {
  road: boolean;
  traffic: boolean;
  safety: boolean;
  waterlogging: boolean;
  buses: boolean;
  liveTraffic: boolean;
};

declare global {
  interface Window {
    google?: typeof google;
    __cityMapReady?: () => void;
  }
}

let loaderPromise: Promise<typeof google> | null = null;

function loadGoogleMaps(): Promise<typeof google> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.google?.maps) return Promise.resolve(window.google);
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise<typeof google>((resolve, reject) => {
    const key = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"] as
      | string
      | undefined;
    const channel = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"] as
      | string
      | undefined;
    if (!key) {
      reject(new Error("Google Maps browser key missing"));
      return;
    }
    window.__cityMapReady = () => resolve(window.google!);
    const script = document.createElement("script");
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__cityMapReady` +
      (channel ? `&channel=${channel}` : "");
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });

  return loaderPromise;
}

/** Dark command-center basemap styling. */
const darkStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0b1017" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0b1017" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#0d131c" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1b2432" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#111a26" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#243043" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#060b12" }] },
];

const tip = (html: string) => `<div style="font:11px ui-monospace,monospace;color:#0f172a">${html}</div>`;

export default function CityMap({
  layers,
  events,
  buses = busPositions,
  selectedId,
  focus,
  healthOverrides,
  highlightSegment,
  onSelect,
}: {
  layers: Layers;
  events: UrbanEvent[];
  buses?: LiveBus[];
  selectedId: string | null;
  focus: [number, number] | null;
  healthOverrides: Record<string, number>;
  highlightSegment: string | null;
  onSelect: (e: UrbanEvent) => void;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const trafficRef = useRef<google.maps.TrafficLayer | null>(null);
  const healthLinesRef = useRef<Map<string, google.maps.Polyline>>(new Map());
  const flowLinesRef = useRef<Map<string, google.maps.Polyline>>(new Map());
  const busMarkersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const eventMarkersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visibleEvents = useMemo(
    () =>
      events.filter((e) =>
        e.category === "traffic"
          ? layers.traffic
          : e.category === "safety"
            ? layers.safety
            : e.category === "waterlogging"
              ? layers.waterlogging
              : layers.road,
      ),
    [events, layers],
  );

  // init
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then((g) => {
        if (cancelled || !hostRef.current || mapRef.current) return;
        mapRef.current = new g.maps.Map(hostRef.current, {
          center: { lat: 28.59, lng: 77.22 },
          zoom: 11,
          clickableIcons: false,
          disableDefaultUI: true,
          scrollwheel: true,
          gestureHandling: "greedy",
          backgroundColor: "#0b1017",
          styles: darkStyles,
        });
        infoRef.current = new g.maps.InfoWindow({ disableAutoPan: true });
        setReady(true);
      })
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  // live traffic layer
  useEffect(() => {
    const g = window.google;
    if (!ready || !g || !mapRef.current) return;
    if (layers.liveTraffic) {
      if (!trafficRef.current) trafficRef.current = new g.maps.TrafficLayer();
      trafficRef.current.setMap(mapRef.current);
    } else {
      trafficRef.current?.setMap(null);
    }
  }, [ready, layers.liveTraffic]);

  // road health + simulated traffic strokes
  useEffect(() => {
    const g = window.google;
    const map = mapRef.current;
    if (!ready || !g || !map) return;

    for (const s of roadSegments) {
      const health = healthOverrides[s.id] ?? s.health;
      const cond = conditionOf(health);
      const isHero = highlightSegment === s.id;
      const path = s.coords.map(([lat, lng]) => ({ lat, lng }));

      let health_line = healthLinesRef.current.get(s.id);
      if (!health_line) {
        health_line = new g.maps.Polyline({ path, zIndex: 10 });
        health_line.addListener("click", (ev: google.maps.PolyMouseEvent) => {
          if (!ev.latLng || !infoRef.current) return;
          infoRef.current.setContent(
            tip(
              `<b>${s.id}</b> · ${s.name}<br/>ROAD HEALTH ${health}/100 — ${cond.toUpperCase()}<br/>TRAFFIC ${s.traffic.toUpperCase()}`,
            ),
          );
          infoRef.current.setPosition(ev.latLng);
          infoRef.current.open(map);
        });
        healthLinesRef.current.set(s.id, health_line);
      }
      health_line.setOptions({
        strokeColor: conditionColor[cond],
        strokeWeight: isHero ? 13 : 9,
        strokeOpacity: isHero ? 1 : 0.85,
        zIndex: isHero ? 20 : 10,
      });
      health_line.setMap(layers.road ? map : null);

      let flow = flowLinesRef.current.get(s.id);
      if (!flow) {
        flow = new g.maps.Polyline({ path, clickable: false, zIndex: 30 });
        flowLinesRef.current.set(s.id, flow);
      }
      flow.setOptions({
        strokeColor: trafficColor[s.traffic],
        strokeWeight: 3,
        strokeOpacity: 0.95,
      });
      flow.setMap(layers.traffic ? map : null);
    }
  }, [ready, layers.road, layers.traffic, healthOverrides, highlightSegment]);

  // buses
  useEffect(() => {
    const g = window.google;
    const map = mapRef.current;
    if (!ready || !g || !map) return;
    const seen = new Set<string>();

    for (const b of buses) {
      seen.add(b.id);
      const hero = b.id === HERO_BUS_ID;
      let marker = busMarkersRef.current.get(b.id);
      if (!marker) {
        marker = new g.maps.Marker({ zIndex: 40 });
        busMarkersRef.current.set(b.id, marker);
      }
      marker.setOptions({
        position: { lat: b.lat, lng: b.lng },
        title: `BUS ${b.id} · ROUTE ${b.route} · ${b.routeName} · NEXT ${b.nextStop} · ${b.speed} KM/H`,
        icon: {
          path: g.maps.SymbolPath.CIRCLE,
          scale: hero ? 7 : 5,
          fillColor: "#22d3ee",
          fillOpacity: 0.9,
          strokeColor: "#22d3ee",
          strokeWeight: hero ? 3 : 1,
        },
      });
      marker.setMap(layers.buses ? map : null);
    }

    for (const [id, m] of busMarkersRef.current) {
      if (!seen.has(id)) {
        m.setMap(null);
        busMarkersRef.current.delete(id);
      }
    }
  }, [ready, buses, layers.buses]);

  // events
  useEffect(() => {
    const g = window.google;
    const map = mapRef.current;
    if (!ready || !g || !map) return;
    const seen = new Set<string>();

    for (const e of visibleEvents) {
      seen.add(e.id);
      const active = selectedId === e.id;
      let marker = eventMarkersRef.current.get(e.id);
      if (!marker) {
        marker = new g.maps.Marker({ zIndex: 50 });
        marker.addListener("click", () => onSelectRef.current(e));
        eventMarkersRef.current.set(e.id, marker);
      }
      marker.setOptions({
        position: { lat: e.lat, lng: e.lng },
        title: `${e.id} · ${e.type} · ${e.severity.toUpperCase()}`,
        icon: {
          path: g.maps.SymbolPath.CIRCLE,
          scale: active ? 15 : 9,
          fillColor: severityColor[e.severity],
          fillOpacity: active ? 0.55 : 0.35,
          strokeColor: severityColor[e.severity],
          strokeWeight: active ? 4 : 2,
        },
      });
      marker.setMap(map);
    }

    for (const [id, m] of eventMarkersRef.current) {
      if (!seen.has(id)) {
        m.setMap(null);
        eventMarkersRef.current.delete(id);
      }
    }
  }, [ready, visibleEvents, selectedId]);

  // focus
  useEffect(() => {
    if (!ready || !focus || !mapRef.current) return;
    mapRef.current.panTo({ lat: focus[0], lng: focus[1] });
    mapRef.current.setZoom(14);
  }, [ready, focus]);

  return (
    <div className="relative h-full w-full" style={{ background: "#0b1017" }}>
      <div ref={hostRef} className="h-full w-full" />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center font-mono text-[11px] text-muted-foreground">
          MAP UNAVAILABLE — {error.toUpperCase()}
        </div>
      )}
    </div>
  );
}
