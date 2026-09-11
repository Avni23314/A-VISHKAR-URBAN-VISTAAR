# Real live traffic on the map

Swap the dashboard map for Google Maps with Google's own live traffic overlay, while keeping the dark command-center look and every existing layer, marker and panel.

## What changes for you

- The map shows Google's real-time traffic colouring for Delhi (live congestion on actual roads), refreshed periodically.
- A new "Live Traffic" toggle sits alongside Road Health, Traffic, Safety, Waterlogging and Buses in the left layer control.
- The existing Road Health strokes, the simulated-traffic strokes, event markers, bus markers, hover tooltips, click-to-open event details, focus/fly-to and the demo sequence all keep working exactly as now.
- The map keeps a dark styling close to the current one, so the dashboard still reads as a command center.

## Setup needed from you

Google Maps must be connected to the project. I will open the connect card when you approve; you pick or create the connection there, nothing to paste in chat.

Two things worth knowing:
- Live traffic comes from Google, so it is real, not mock. The rest of the demo (buses, events, road health) stays simulated as before.
- The managed Google key works on the Lovable preview and `*.lovable.app` addresses. On a custom domain it needs your own Google key.

## Technical notes

- Connect the `google_maps` connector; use `VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY` with `loading=async`, a global `callback`, and the tracking ID as `channel`.
- Rewrite `src/components/CityMap.tsx` to render a `google.maps.Map` (no `mapId`, `clickableIcons: false`, dark `styles` array, `disableDefaultUI` with the same zoom behaviour) and add `new google.maps.TrafficLayer()` bound/unbound by the new layer toggle.
- Re-implement current features with the Maps JS equivalents: `google.maps.Polyline` for road-health and simulated-traffic strokes (same `conditionColor` / `trafficColor` values, hero weight/opacity), `google.maps.Marker` with `SymbolPath.CIRCLE` for events and buses, `InfoWindow` for the tooltip text, `panTo`/`setZoom` for the focus effect.
- Load the map only on the client (dynamic import behind `ClientOnly`) so SSR is unaffected; remove Leaflet imports and CSS from the map path.
- `src/routes/index.tsx` keeps its props contract; only the `Layers` type gains `liveTraffic` and the left control gains one row.
- No backend, no server calls, no data-model changes; `src/lib/mock-data.ts` is untouched.
- Verify with a Playwright run of the full RUN DEMO flow plus a console-error check.
