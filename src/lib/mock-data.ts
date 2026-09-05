export type Condition = "healthy" | "attention" | "poor" | "critical";
export type TrafficLevel = "low" | "moderate" | "heavy";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type RoadSegment = {
  id: string;
  name: string;
  health: number;
  traffic: TrafficLevel;
  coords: [number, number][];
};

export type UrbanEvent = {
  id: string;
  type: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  confidence: number;
  busId: string;
  route: string;
  timestamp: string;
  lat: number;
  lng: number;
  segmentId: string | null;
  observations: number;
  confirmedBy: number;
  priority: Priority;
  status: "UNVERIFIED" | "CONFIRMED" | "ACTION REQUIRED";
  category: "traffic" | "safety" | "waterlogging" | "road";
};

export const conditionColor: Record<Condition, string> = {
  healthy: "#22c55e",
  attention: "#eab308",
  poor: "#f97316",
  critical: "#ef4444",
};

export const trafficColor: Record<TrafficLevel, string> = {
  low: "#38bdf8",
  moderate: "#facc15",
  heavy: "#ef4444",
};

export function conditionOf(health: number): Condition {
  return health >= 80 ? "healthy" : health >= 60 ? "attention" : health >= 40 ? "poor" : "critical";
}

const seg = (
  id: string,
  name: string,
  health: number,
  traffic: TrafficLevel,
  coords: [number, number][],
): RoadSegment => ({ id, name, health, traffic, coords });

export const roadSegments: RoadSegment[] = [
  seg("SEG-001", "Ring Road – Naraina", 88, "moderate", [
    [28.6265, 77.1385],
    [28.6321, 77.1502],
  ]),
  seg("SEG-002", "Outer Ring Road – Dhaula Kuan", 72, "heavy", [
    [28.5915, 77.1618],
    [28.5998, 77.1755],
  ]),
  seg("SEG-003", "NH-48 Corridor", 54, "heavy", [
    [28.5602, 77.1201],
    [28.5488, 77.1042],
  ]),
  seg("SEG-004", "Mathura Road – Ashram", 34, "heavy", [
    [28.5731, 77.2588],
    [28.5651, 77.2712],
  ]),
  seg("SEG-005", "ITO – Vikas Marg", 91, "moderate", [
    [28.6285, 77.2412],
    [28.6339, 77.2585],
  ]),
  seg("SEG-006", "Connaught Circus Outer", 83, "moderate", [
    [28.6315, 77.2167],
    [28.6288, 77.2245],
  ]),
  seg("SEG-007", "GT Karnal Road", 47, "moderate", [
    [28.7105, 77.1815],
    [28.7222, 77.1868],
  ]),
  seg("SEG-008", "Rohtak Road – Peeragarhi", 61, "low", [
    [28.6712, 77.0902],
    [28.6788, 77.1055],
  ]),
  seg("SEG-009", "Barapullah Elevated", 78, "low", [
    [28.5802, 77.2385],
    [28.5865, 77.2512],
  ]),
  seg("SEG-010", "Noida Link Road", 29, "heavy", [
    [28.6188, 77.2905],
    [28.6112, 77.3055],
  ]),
  seg("SEG-011", "Najafgarh Road", 66, "moderate", [
    [28.6402, 77.0982],
    [28.6448, 77.1128],
  ]),
  seg("SEG-012", "Aurobindo Marg", 85, "low", [
    [28.5528, 77.2045],
    [28.5652, 77.2072],
  ]),
  seg("SEG-013", "Wazirabad Road", 41, "moderate", [
    [28.7005, 77.2402],
    [28.7098, 77.2528],
  ]),
  seg("SEG-014", "Delhi–Gurgaon Expressway", 57, "heavy", [
    [28.5185, 77.0885],
    [28.5052, 77.0752],
  ]),
  seg("SEG-021", "Mehrauli–Badarpur Road (Hero Segment)", 72, "heavy", [
    [28.6108, 77.2295],
    [28.6042, 77.2418],
    [28.5985, 77.2502],
  ]),
];

/** Hero event used through the demo narrative. */
export const HERO_EVENT_ID = "EVT-1027";
export const SAFETY_EVENT_ID = "EVT-1099";

export const heroEvent: UrbanEvent = {
  id: HERO_EVENT_ID,
  type: "Pothole Cluster",
  severity: "High",
  confidence: 0.91,
  busId: "DTC-102",
  route: "874",
  timestamp: "2026-09-05T15:12:44Z",
  lat: 28.6042,
  lng: 77.2418,
  segmentId: "SEG-021",
  observations: 1,
  confirmedBy: 1,
  priority: "MEDIUM",
  status: "UNVERIFIED",
  category: "road",
};

export const safetyEvent: UrbanEvent = {
  id: SAFETY_EVENT_ID,
  type: "Serious Passenger Safety Incident",
  severity: "Critical",
  confidence: 0.89,
  busId: "DTC-102",
  route: "874",
  timestamp: "2026-09-05T15:26:09Z",
  lat: 28.5985,
  lng: 77.2502,
  segmentId: "SEG-021",
  observations: 1,
  confirmedBy: 1,
  priority: "CRITICAL",
  status: "ACTION REQUIRED",
  category: "safety",
};

export const baseEvents: UrbanEvent[] = [
  heroEvent,
  {
    id: "EVT-1043",
    type: "Waterlogging",
    severity: "Critical",
    confidence: 0.89,
    busId: "DTC-2210",
    route: "534",
    timestamp: "2026-09-05T14:48:03Z",
    lat: 28.6188,
    lng: 77.2905,
    segmentId: "SEG-010",
    observations: 3,
    confirmedBy: 3,
    priority: "CRITICAL",
    status: "CONFIRMED",
    category: "waterlogging",
  },
  {
    id: "EVT-1044",
    type: "Traffic Congestion",
    severity: "Medium",
    confidence: 0.77,
    busId: "DTC-9931",
    route: "181",
    timestamp: "2026-09-05T14:41:57Z",
    lat: 28.6285,
    lng: 77.2412,
    segmentId: "SEG-005",
    observations: 1,
    confirmedBy: 1,
    priority: "MEDIUM",
    status: "UNVERIFIED",
    category: "traffic",
  },
  {
    id: "EVT-1045",
    type: "Unsafe Crossing",
    severity: "Medium",
    confidence: 0.68,
    busId: "DTC-7754",
    route: "411",
    timestamp: "2026-09-05T14:33:20Z",
    lat: 28.5528,
    lng: 77.2045,
    segmentId: "SEG-012",
    observations: 2,
    confirmedBy: 2,
    priority: "MEDIUM",
    status: "CONFIRMED",
    category: "safety",
  },
  {
    id: "EVT-1046",
    type: "Surface Cracking",
    severity: "Low",
    confidence: 0.62,
    busId: "DTC-1188",
    route: "822",
    timestamp: "2026-09-05T14:25:44Z",
    lat: 28.6712,
    lng: 77.0902,
    segmentId: "SEG-008",
    observations: 2,
    confirmedBy: 2,
    priority: "LOW",
    status: "CONFIRMED",
    category: "road",
  },
  {
    id: "EVT-1047",
    type: "Waterlogging",
    severity: "High",
    confidence: 0.85,
    busId: "DTC-6620",
    route: "306",
    timestamp: "2026-09-05T14:19:08Z",
    lat: 28.7005,
    lng: 77.2402,
    segmentId: "SEG-013",
    observations: 1,
    confirmedBy: 1,
    priority: "HIGH",
    status: "UNVERIFIED",
    category: "waterlogging",
  },
  {
    id: "EVT-1048",
    type: "Traffic Congestion",
    severity: "Critical",
    confidence: 0.92,
    busId: "DTC-3345",
    route: "729",
    timestamp: "2026-09-05T14:11:36Z",
    lat: 28.5915,
    lng: 77.1618,
    segmentId: "SEG-002",
    observations: 4,
    confirmedBy: 4,
    priority: "HIGH",
    status: "CONFIRMED",
    category: "traffic",
  },
  {
    id: "EVT-1049",
    type: "Street Light Outage",
    severity: "Low",
    confidence: 0.58,
    busId: "DTC-5501",
    route: "260",
    timestamp: "2026-09-05T14:02:12Z",
    lat: 28.6402,
    lng: 77.0982,
    segmentId: "SEG-011",
    observations: 1,
    confirmedBy: 1,
    priority: "LOW",
    status: "UNVERIFIED",
    category: "safety",
  },
  {
    id: "EVT-1050",
    type: "Pothole Cluster",
    severity: "High",
    confidence: 0.81,
    busId: "DTC-8877",
    route: "118",
    timestamp: "2026-09-05T13:55:49Z",
    lat: 28.7105,
    lng: 77.1815,
    segmentId: "SEG-007",
    observations: 2,
    confirmedBy: 2,
    priority: "HIGH",
    status: "CONFIRMED",
    category: "road",
  },
  {
    id: "EVT-1051",
    type: "Debris On Road",
    severity: "Medium",
    confidence: 0.73,
    busId: "DTC-4402",
    route: "905",
    timestamp: "2026-09-05T13:47:02Z",
    lat: 28.5185,
    lng: 77.0885,
    segmentId: "SEG-014",
    observations: 1,
    confirmedBy: 1,
    priority: "MEDIUM",
    status: "UNVERIFIED",
    category: "road",
  },
];

export const busPositions: { id: string; lat: number; lng: number; route: string }[] = [
  { id: "DTC-102", lat: 28.6108, lng: 77.2295, route: "874" },
  { id: "DTC-2210", lat: 28.6502, lng: 77.1902, route: "534" },
  { id: "DTC-9931", lat: 28.5822, lng: 77.2455, route: "181" },
  { id: "DTC-7754", lat: 28.5602, lng: 77.1802, route: "411" },
  { id: "DTC-1188", lat: 28.6788, lng: 77.1188, route: "822" },
  { id: "DTC-6620", lat: 28.6955, lng: 77.2201, route: "306" },
  { id: "DTC-3345", lat: 28.5488, lng: 77.1155, route: "729" },
];

export const severityColor: Record<UrbanEvent["severity"], string> = {
  Low: "#38bdf8",
  Medium: "#eab308",
  High: "#f97316",
  Critical: "#ef4444",
};
