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

/**
 * Real Delhi arterial corridors, traced along their actual alignment
 * (Ring Road, Outer Ring Road, NH-48, Mathura Road, MB Road, etc.).
 */
export const roadSegments: RoadSegment[] = [
  seg("SEG-001", "Ring Road · Naraina – Mayapuri", 88, "moderate", [
    [28.6265, 77.1385],
    [28.6318, 77.1452],
    [28.6371, 77.1524],
  ]),
  seg("SEG-002", "Ring Road · Dhaula Kuan – Moti Bagh", 72, "heavy", [
    [28.5915, 77.1618],
    [28.5842, 77.1736],
    [28.5779, 77.1848],
  ]),
  seg("SEG-003", "NH-48 · Rangpuri – Mahipalpur", 54, "heavy", [
    [28.5602, 77.1201],
    [28.5528, 77.1128],
    [28.5442, 77.1042],
  ]),
  seg("SEG-004", "Mathura Road · Ashram – Sarita Vihar", 34, "heavy", [
    [28.5731, 77.2588],
    [28.5588, 77.2716],
    [28.5375, 77.2892],
  ]),
  seg("SEG-005", "Vikas Marg · ITO – Laxmi Nagar", 91, "moderate", [
    [28.6285, 77.2412],
    [28.6312, 77.2551],
    [28.6337, 77.2716],
  ]),
  seg("SEG-006", "Connaught Circus Outer Ring", 83, "moderate", [
    [28.6329, 77.2167],
    [28.6295, 77.2216],
    [28.6262, 77.2248],
  ]),
  seg("SEG-007", "GT Karnal Road · Azadpur – Jahangirpuri", 47, "moderate", [
    [28.7075, 77.1752],
    [28.7186, 77.1801],
    [28.7285, 77.1852],
  ]),
  seg("SEG-008", "Rohtak Road · Peeragarhi – Punjabi Bagh", 61, "low", [
    [28.6792, 77.0902],
    [28.6742, 77.1088],
    [28.6690, 77.1310],
  ]),
  seg("SEG-009", "Barapullah Elevated · Sarai Kale Khan – INA", 78, "low", [
    [28.5895, 77.2570],
    [28.5822, 77.2385],
    [28.5742, 77.2205],
  ]),
  seg("SEG-010", "NH-24 · Akshardham – Anand Vihar", 29, "heavy", [
    [28.6127, 77.2773],
    [28.6272, 77.2955],
    [28.6469, 77.3160],
  ]),
  seg("SEG-011", "Najafgarh Road · Janakpuri – Rajouri Garden", 66, "moderate", [
    [28.6215, 77.0870],
    [28.6362, 77.1042],
    [28.6490, 77.1200],
  ]),
  seg("SEG-012", "Aurobindo Marg · AIIMS – Adhchini", 85, "low", [
    [28.5672, 77.2100],
    [28.5525, 77.2015],
    [28.5382, 77.1972],
  ]),
  seg("SEG-013", "Wazirabad Road · Bhajanpura – Yamuna Vihar", 41, "moderate", [
    [28.6975, 77.2585],
    [28.7048, 77.2702],
    [28.7112, 77.2795],
  ]),
  seg("SEG-014", "Delhi–Gurgaon Expressway · Rajokri – Sirhaul", 57, "heavy", [
    [28.5185, 77.0885],
    [28.5062, 77.0762],
    [28.4972, 77.0685],
  ]),
  seg("SEG-021", "Mehrauli–Badarpur Road · Saket – Khanpur", 72, "heavy", [
    [28.5150, 77.1855],
    [28.5245, 77.2066],
    [28.5192, 77.2225],
    [28.5137, 77.2350],
  ]),
];

/** Real DTC route corridors — buses are simulated moving along these actual alignments. */
export type BusRoute = {
  route: string;
  name: string;
  path: [number, number][];
};

export const busRoutes: BusRoute[] = [
  {
    route: "764",
    name: "Mehrauli Terminal – Badarpur Border (MB Road)",
    path: [
      [28.5150, 77.1855],
      [28.5245, 77.2066],
      [28.5192, 77.2225],
      [28.5137, 77.2350],
      [28.5030, 77.2758],
      [28.4930, 77.3020],
    ],
  },
  {
    route: "534",
    name: "Badarpur Border – Kendriya Terminal",
    path: [
      [28.4930, 77.3020],
      [28.5310, 77.2900],
      [28.5588, 77.2716],
      [28.5731, 77.2588],
      [28.6132, 77.2455],
      [28.6280, 77.2240],
    ],
  },
  {
    route: "405",
    name: "Badarpur Border – Anand Vihar ISBT",
    path: [
      [28.5310, 77.2900],
      [28.5731, 77.2588],
      [28.5905, 77.2530],
      [28.5895, 77.2570],
      [28.6127, 77.2773],
      [28.6469, 77.3160],
    ],
  },
  {
    route: "419",
    name: "Sarojini Nagar – Nehru Place Terminal",
    path: [
      [28.5750, 77.1965],
      [28.5672, 77.2100],
      [28.5665, 77.2426],
      [28.5570, 77.2495],
      [28.5490, 77.2510],
    ],
  },
  {
    route: "892",
    name: "Dhaula Kuan – Peeragarhi",
    path: [
      [28.5915, 77.1618],
      [28.6265, 77.1385],
      [28.6490, 77.1200],
      [28.6690, 77.1310],
      [28.6792, 77.0902],
    ],
  },
  {
    route: "940",
    name: "Kashmere Gate ISBT – Rohini Sector 22",
    path: [
      [28.6675, 77.2280],
      [28.6990, 77.2065],
      [28.7075, 77.1752],
      [28.7186, 77.1801],
      [28.7285, 77.1200],
    ],
  },
  {
    route: "623",
    name: "Uttam Nagar Terminal – Kendriya Terminal",
    path: [
      [28.6210, 77.0580],
      [28.6215, 77.0870],
      [28.6490, 77.1200],
      [28.6510, 77.1900],
      [28.6280, 77.2240],
    ],
  },
];

/** Hero event used through the demo narrative. */
export const HERO_EVENT_ID = "EVT-1027";
export const SAFETY_EVENT_ID = "EVT-1099";
export const HERO_BUS_ID = "DTC-102";

export const heroEvent: UrbanEvent = {
  id: HERO_EVENT_ID,
  type: "Pothole Cluster",
  severity: "High",
  confidence: 0.91,
  busId: HERO_BUS_ID,
  route: "764",
  timestamp: "2026-09-05T15:12:44Z",
  lat: 28.5245,
  lng: 77.2066,
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
  busId: HERO_BUS_ID,
  route: "764",
  timestamp: "2026-09-05T15:26:09Z",
  lat: 28.5137,
  lng: 77.2350,
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
    route: "405",
    timestamp: "2026-09-05T14:48:03Z",
    lat: 28.6127,
    lng: 77.2773,
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
    route: "534",
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
    route: "419",
    timestamp: "2026-09-05T14:33:20Z",
    lat: 28.5672,
    lng: 77.2100,
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
    route: "892",
    timestamp: "2026-09-05T14:25:44Z",
    lat: 28.6742,
    lng: 77.1088,
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
    route: "940",
    timestamp: "2026-09-05T14:19:08Z",
    lat: 28.7048,
    lng: 77.2702,
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
    route: "892",
    timestamp: "2026-09-05T14:11:36Z",
    lat: 28.5842,
    lng: 77.1736,
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
    route: "623",
    timestamp: "2026-09-05T14:02:12Z",
    lat: 28.6362,
    lng: 77.1042,
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
    route: "940",
    timestamp: "2026-09-05T13:55:49Z",
    lat: 28.7186,
    lng: 77.1801,
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
    route: "764",
    timestamp: "2026-09-05T13:47:02Z",
    lat: 28.5062,
    lng: 77.0762,
    segmentId: "SEG-014",
    observations: 1,
    confirmedBy: 1,
    priority: "MEDIUM",
    status: "UNVERIFIED",
    category: "road",
  },
];

export type LiveBus = {
  id: string;
  route: string;
  routeName: string;
  lat: number;
  lng: number;
  speed: number;
  nextStop: string;
};

/** Fleet mapped onto real DTC routes; `progress` is the start offset along the route path. */
export const fleet: { id: string; route: string; progress: number; nextStop: string }[] = [
  { id: HERO_BUS_ID, route: "764", progress: 0.18, nextStop: "Saket Metro" },
  { id: "DTC-2210", route: "405", progress: 0.42, nextStop: "Akshardham" },
  { id: "DTC-9931", route: "534", progress: 0.66, nextStop: "ITO" },
  { id: "DTC-7754", route: "419", progress: 0.3, nextStop: "AIIMS" },
  { id: "DTC-1188", route: "892", progress: 0.55, nextStop: "Punjabi Bagh" },
  { id: "DTC-6620", route: "940", progress: 0.24, nextStop: "Azadpur" },
  { id: "DTC-3345", route: "623", progress: 0.72, nextStop: "Karol Bagh" },
];

/** Interpolate a position along a route path for a 0..1 progress value. */
export function positionOnRoute(path: [number, number][], progress: number): [number, number] {
  const p = ((progress % 1) + 1) % 1;
  const legs = path.length - 1;
  const scaled = p * legs;
  const i = Math.min(Math.floor(scaled), legs - 1);
  const t = scaled - i;
  const a = path[i]!;
  const b = path[i + 1]!;
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

export function busesAt(tick: number): LiveBus[] {
  return fleet.map((b, idx) => {
    const route = busRoutes.find((r) => r.route === b.route)!;
    const speedFactor = 0.0016 + idx * 0.0002;
    const [lat, lng] = positionOnRoute(route.path, b.progress + tick * speedFactor);
    return {
      id: b.id,
      route: b.route,
      routeName: route.name,
      lat,
      lng,
      speed: Math.round(18 + ((idx * 7 + tick) % 22)),
      nextStop: b.nextStop,
    };
  });
}

/** Static snapshot (SSR-safe initial render). */
export const busPositions = busesAt(0);

export const severityColor: Record<UrbanEvent["severity"], string> = {
  Low: "#38bdf8",
  Medium: "#eab308",
  High: "#f97316",
  Critical: "#ef4444",
};

export type WorkStatus = "UNASSIGNED" | "ASSIGNED" | "IN PROGRESS" | "RESOLVED";

export const maintenanceTeams = [
  { id: "PWD-N1", name: "PWD North · Crew 1" },
  { id: "PWD-S3", name: "PWD South · Crew 3" },
  { id: "MCD-R7", name: "MCD Roads · Unit 7" },
  { id: "DJB-W2", name: "DJB Drainage · Unit 2" },
  { id: "DTC-SAF", name: "DTC Safety Response" },
];

export const workStatusColor: Record<WorkStatus, string> = {
  UNASSIGNED: "#94a3b8",
  ASSIGNED: "#38bdf8",
  "IN PROGRESS": "#eab308",
  RESOLVED: "#22c55e",
};
