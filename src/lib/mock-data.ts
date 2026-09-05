export type Condition = "healthy" | "attention" | "poor" | "critical";

export type RoadSegment = {
  id: string;
  name: string;
  health: number;
  condition: Condition;
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
  confirmed: boolean;
  category: "traffic" | "safety" | "waterlogging" | "road";
};

export const conditionColor: Record<Condition, string> = {
  healthy: "#22c55e",
  attention: "#eab308",
  poor: "#f97316",
  critical: "#ef4444",
};

const seg = (
  id: string,
  name: string,
  health: number,
  coords: [number, number][],
): RoadSegment => ({
  id,
  name,
  health,
  condition:
    health >= 80 ? "healthy" : health >= 60 ? "attention" : health >= 40 ? "poor" : "critical",
  coords,
});

export const roadSegments: RoadSegment[] = [
  seg("RS-01", "Ring Road – Naraina", 88, [
    [28.6265, 77.1385],
    [28.6321, 77.1502],
  ]),
  seg("RS-02", "Outer Ring Road – Dhaula Kuan", 72, [
    [28.5915, 77.1618],
    [28.5998, 77.1755],
  ]),
  seg("RS-03", "NH-48 Corridor", 54, [
    [28.5602, 77.1201],
    [28.5488, 77.1042],
  ]),
  seg("RS-04", "Mathura Road – Ashram", 34, [
    [28.5731, 77.2588],
    [28.5651, 77.2712],
  ]),
  seg("RS-05", "ITO – Vikas Marg", 91, [
    [28.6285, 77.2412],
    [28.6339, 77.2585],
  ]),
  seg("RS-06", "Connaught Circus Outer", 83, [
    [28.6315, 77.2167],
    [28.6288, 77.2245],
  ]),
  seg("RS-07", "GT Karnal Road", 47, [
    [28.7105, 77.1815],
    [28.7222, 77.1868],
  ]),
  seg("RS-08", "Rohtak Road – Peeragarhi", 61, [
    [28.6712, 77.0902],
    [28.6788, 77.1055],
  ]),
  seg("RS-09", "Barapullah Elevated", 78, [
    [28.5802, 77.2385],
    [28.5865, 77.2512],
  ]),
  seg("RS-10", "Noida Link Road", 29, [
    [28.6188, 77.2905],
    [28.6112, 77.3055],
  ]),
  seg("RS-11", "Najafgarh Road", 66, [
    [28.6402, 77.0982],
    [28.6448, 77.1128],
  ]),
  seg("RS-12", "Aurobindo Marg", 85, [
    [28.5528, 77.2045],
    [28.5652, 77.2072],
  ]),
  seg("RS-13", "Wazirabad Road", 41, [
    [28.7005, 77.2402],
    [28.7098, 77.2528],
  ]),
  seg("RS-14", "Delhi–Gurgaon Expressway", 57, [
    [28.5185, 77.0885],
    [28.5052, 77.0752],
  ]),
];

export const urbanEvents: UrbanEvent[] = [
  {
    id: "EV-1042",
    type: "Pothole Cluster",
    severity: "High",
    confidence: 0.94,
    busId: "DL-1PC-4482",
    route: "R-764 Anand Vihar → Dwarka",
    timestamp: "2026-09-05T14:52:11Z",
    lat: 28.5731,
    lng: 77.2588,
    confirmed: true,
    category: "road",
  },
  {
    id: "EV-1043",
    type: "Waterlogging",
    severity: "Critical",
    confidence: 0.89,
    busId: "DL-1PD-2210",
    route: "R-534 Minto Road → Rohini",
    timestamp: "2026-09-05T14:48:03Z",
    lat: 28.6188,
    lng: 77.2905,
    confirmed: true,
    category: "waterlogging",
  },
  {
    id: "EV-1044",
    type: "Traffic Congestion",
    severity: "Medium",
    confidence: 0.77,
    busId: "DL-1PB-9931",
    route: "R-181 Nehru Place → Azadpur",
    timestamp: "2026-09-05T14:41:57Z",
    lat: 28.6285,
    lng: 77.2412,
    confirmed: false,
    category: "traffic",
  },
  {
    id: "EV-1045",
    type: "Unsafe Crossing",
    severity: "Medium",
    confidence: 0.68,
    busId: "DL-1PA-7754",
    route: "R-411 Kashmere Gate → Saket",
    timestamp: "2026-09-05T14:33:20Z",
    lat: 28.5528,
    lng: 77.2045,
    confirmed: false,
    category: "safety",
  },
  {
    id: "EV-1046",
    type: "Surface Cracking",
    severity: "Low",
    confidence: 0.62,
    busId: "DL-1PC-1188",
    route: "R-822 Peeragarhi → ISBT",
    timestamp: "2026-09-05T14:25:44Z",
    lat: 28.6712,
    lng: 77.0902,
    confirmed: true,
    category: "road",
  },
  {
    id: "EV-1047",
    type: "Waterlogging",
    severity: "High",
    confidence: 0.85,
    busId: "DL-1PD-6620",
    route: "R-306 Wazirabad → CP",
    timestamp: "2026-09-05T14:19:08Z",
    lat: 28.7005,
    lng: 77.2402,
    confirmed: false,
    category: "waterlogging",
  },
  {
    id: "EV-1048",
    type: "Traffic Congestion",
    severity: "Critical",
    confidence: 0.92,
    busId: "DL-1PB-3345",
    route: "R-729 Dhaula Kuan → Noida",
    timestamp: "2026-09-05T14:11:36Z",
    lat: 28.5915,
    lng: 77.1618,
    confirmed: true,
    category: "traffic",
  },
  {
    id: "EV-1049",
    type: "Street Light Outage",
    severity: "Low",
    confidence: 0.58,
    busId: "DL-1PA-5501",
    route: "R-260 Najafgarh → Karol Bagh",
    timestamp: "2026-09-05T14:02:12Z",
    lat: 28.6402,
    lng: 77.0982,
    confirmed: false,
    category: "safety",
  },
  {
    id: "EV-1050",
    type: "Pothole Cluster",
    severity: "High",
    confidence: 0.81,
    busId: "DL-1PC-8877",
    route: "R-118 GT Karnal → Lajpat Nagar",
    timestamp: "2026-09-05T13:55:49Z",
    lat: 28.7105,
    lng: 77.1815,
    confirmed: true,
    category: "road",
  },
  {
    id: "EV-1051",
    type: "Debris On Road",
    severity: "Medium",
    confidence: 0.73,
    busId: "DL-1PD-4402",
    route: "R-905 Gurgaon Border → AIIMS",
    timestamp: "2026-09-05T13:47:02Z",
    lat: 28.5185,
    lng: 77.0885,
    confirmed: false,
    category: "road",
  },
];

export const busPositions: { id: string; lat: number; lng: number; route: string }[] = [
  { id: "DL-1PC-4482", lat: 28.6135, lng: 77.2295, route: "R-764" },
  { id: "DL-1PD-2210", lat: 28.6502, lng: 77.1902, route: "R-534" },
  { id: "DL-1PB-9931", lat: 28.5822, lng: 77.2455, route: "R-181" },
  { id: "DL-1PA-7754", lat: 28.5602, lng: 77.1802, route: "R-411" },
  { id: "DL-1PC-1188", lat: 28.6788, lng: 77.1188, route: "R-822" },
  { id: "DL-1PD-6620", lat: 28.6955, lng: 77.2201, route: "R-306" },
  { id: "DL-1PB-3345", lat: 28.5488, lng: 77.1155, route: "R-729" },
];

export const severityColor: Record<UrbanEvent["severity"], string> = {
  Low: "#38bdf8",
  Medium: "#eab308",
  High: "#f97316",
  Critical: "#ef4444",
};
