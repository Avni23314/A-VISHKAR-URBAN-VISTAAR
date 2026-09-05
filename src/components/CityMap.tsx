import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip } from "react-leaflet";
import {
  busPositions,
  conditionColor,
  roadSegments,
  severityColor,
  urbanEvents,
  type UrbanEvent,
} from "@/lib/mock-data";

export type Layers = {
  road: boolean;
  traffic: boolean;
  safety: boolean;
  waterlogging: boolean;
  buses: boolean;
};

export default function CityMap({
  layers,
  selectedId,
  onSelect,
}: {
  layers: Layers;
  selectedId: string | null;
  onSelect: (e: UrbanEvent) => void;
}) {
  const visibleEvents = urbanEvents.filter((e) =>
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
      center={[28.6285, 77.19]}
      zoom={11}
      scrollWheelZoom
      className="h-full w-full"
      style={{ background: "#0b1017" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="map-dark-tiles"
      />


      {layers.road &&
        roadSegments.map((s) => (
          <Polyline
            key={s.id}
            positions={s.coords}
            pathOptions={{ color: conditionColor[s.condition], weight: 6, opacity: 0.9 }}
          >
            <Tooltip sticky>
              {s.name} — {s.health}/100 ({s.condition})
            </Tooltip>
          </Polyline>
        ))}

      {layers.buses &&
        busPositions.map((b) => (
          <CircleMarker
            key={b.id}
            center={[b.lat, b.lng]}
            radius={5}
            pathOptions={{ color: "#22d3ee", fillColor: "#22d3ee", fillOpacity: 0.9, weight: 1 }}
          >
            <Tooltip>
              {b.id} · {b.route}
            </Tooltip>
          </CircleMarker>
        ))}

      {visibleEvents.map((e) => (
        <CircleMarker
          key={e.id}
          center={[e.lat, e.lng]}
          radius={selectedId === e.id ? 14 : 9}
          eventHandlers={{ click: () => onSelect(e) }}
          pathOptions={{
            color: severityColor[e.severity],
            fillColor: severityColor[e.severity],
            fillOpacity: 0.45,
            weight: selectedId === e.id ? 4 : 2,
          }}
        >
          <Tooltip>
            {e.type} · {e.severity}
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
