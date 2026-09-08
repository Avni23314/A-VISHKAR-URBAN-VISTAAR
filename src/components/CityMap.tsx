import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from "react-leaflet";
import {
  busPositions,
  conditionColor,
  conditionOf,
  roadSegments,
  severityColor,
  trafficColor,
  type UrbanEvent,
} from "@/lib/mock-data";

export type Layers = {
  road: boolean;
  traffic: boolean;
  safety: boolean;
  waterlogging: boolean;
  buses: boolean;
};

function Focus({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 14, { duration: 1.2 });
  }, [target, map]);
  return null;
}

export default function CityMap({
  layers,
  events,
  selectedId,
  focus,
  healthOverrides,
  highlightSegment,
  onSelect,
}: {
  layers: Layers;
  events: UrbanEvent[];
  selectedId: string | null;
  focus: [number, number] | null;
  healthOverrides: Record<string, number>;
  highlightSegment: string | null;
  onSelect: (e: UrbanEvent) => void;
}) {
  const visibleEvents = events.filter((e) =>
    e.category === "traffic"
      ? layers.traffic
      : e.category === "safety"
        ? layers.safety
        : e.category === "waterlogging"
          ? layers.waterlogging
          : layers.road,
  );

  return (
    <MapContainer
      center={[28.6108, 77.2295]}
      zoom={12}
      scrollWheelZoom
      zoomControl={false}
      className="h-full w-full"
      style={{ background: "#0b1017" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="map-dark-tiles"
      />
      <Focus target={focus} />

      {roadSegments.map((s) => {
        const health = healthOverrides[s.id] ?? s.health;
        const cond = conditionOf(health);
        const isHero = highlightSegment === s.id;
        return (
          <div key={s.id}>
            {layers.road && (
              <Polyline
                positions={s.coords}
                pathOptions={{
                  color: conditionColor[cond],
                  weight: isHero ? 13 : 9,
                  opacity: isHero ? 1 : 0.85,
                  lineCap: "round",
                  className: `road-health-stroke${isHero ? " road-hero" : ""}`,
                }}
              >
                <Tooltip sticky>
                  <span className="font-mono text-[11px]">
                    {s.id} · {s.name}
                    <br />
                    ROAD HEALTH {health}/100 — {cond.toUpperCase()}
                    <br />
                    TRAFFIC {s.traffic.toUpperCase()}
                  </span>
                </Tooltip>
              </Polyline>
            )}
            {layers.traffic && (
              <Polyline
                positions={s.coords}
                interactive={false}
                pathOptions={{
                  color: trafficColor[s.traffic],
                  weight: 3,
                  opacity: 0.95,
                  lineCap: "round",
                  className: "traffic-stroke",
                }}
              />
            )}
          </div>
        );
      })}

      {layers.buses &&
        busPositions.map((b) => (
          <CircleMarker
            key={b.id}
            center={[b.lat, b.lng]}
            radius={b.id === "DTC-102" ? 7 : 5}
            pathOptions={{
              color: "#22d3ee",
              fillColor: "#22d3ee",
              fillOpacity: 0.9,
              weight: b.id === "DTC-102" ? 3 : 1,
            }}
          >
            <Tooltip>
              <span className="font-mono text-[11px]">
                BUS {b.id} · ROUTE {b.route}
              </span>
            </Tooltip>
          </CircleMarker>
        ))}

      {visibleEvents.map((e) => {
        const active = selectedId === e.id;
        return (
          <CircleMarker
            key={e.id}
            center={[e.lat, e.lng]}
            radius={active ? 15 : 9}
            eventHandlers={{ click: () => onSelect(e) }}
            pathOptions={{
              color: severityColor[e.severity],
              fillColor: severityColor[e.severity],
              fillOpacity: active ? 0.55 : 0.35,
              weight: active ? 4 : 2,
              className: active ? "event-pulse" : undefined,
            }}
          >
            <Tooltip>
              <span className="font-mono text-[11px]">
                {e.id} · {e.type} · {e.severity.toUpperCase()}
              </span>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
