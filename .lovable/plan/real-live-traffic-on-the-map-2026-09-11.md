# Google Maps Live Traffic Integration

## Goal

Replace the current Leaflet map with Google Maps and add Google's live traffic layer for Delhi, while preserving the existing dashboard functionality and dark command-center UI.

## Scope

### Map

* Replace the Leaflet implementation in `src/components/CityMap.tsx` with Google Maps JavaScript API.
* Preserve the current dark map styling and existing zoom behavior.
* Disable unnecessary default map UI.
* Keep map POI icons non-clickable.

### Live Traffic

Add a new **Live Traffic** layer to the existing layer controls.

The layer should use Google's `TrafficLayer` and be independently toggled without affecting the other map layers.

Live traffic will be sourced from Google. All other current dashboard data remains mock/simulated data.

### Existing Map Features

The Google Maps implementation must retain the current functionality:

* Road Health segments
* Simulated traffic segments
* Event markers
* Bus markers
* Hover/tooltip information
* Event detail cards
* Focus/fly-to behavior
* RUN DEMO sequence
* Existing layer controls

Map visualizations should retain the current condition and traffic color mappings.

## Data

No changes to the existing mock-data structure are required.

`src/lib/mock-data.ts` remains unchanged.

Current data sources:

| Data              | Source                   |
| ----------------- | ------------------------ |
| Live Traffic      | Google Maps TrafficLayer |
| Road Health       | Mock data                |
| Simulated Traffic | Mock data                |
| Events            | Mock data                |
| Buses             | Mock data                |

## Technical Approach

### Google Maps

Use the Google Maps JavaScript API with:

* `google.maps.Map`
* `google.maps.TrafficLayer`
* `google.maps.Polyline`
* `google.maps.Marker`
* `google.maps.InfoWindow`

Use `SymbolPath.CIRCLE` for event and bus markers.

Use `panTo()` and `setZoom()` for the existing focus behavior.

### API Configuration

Use the Google Maps connector and:

`VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY`

Load the Maps API asynchronously with:

* `loading=async`
* Global callback
* Tracking ID passed through `channel`

The managed key supports the Lovable preview and `*.lovable.app` environments. Custom-domain deployment requires a Google Maps key configured for that domain.

### Client-Side Loading

Google Maps must only be initialized on the client to avoid SSR issues.

Use `ClientOnly` for the map component and remove the existing Leaflet imports and map-specific CSS from the active implementation.

### Application State

Extend the existing `Layers` type in `src/routes/index.tsx` with:

`liveTraffic`

Add the corresponding layer-control entry and use it to bind/unbind the `TrafficLayer`.

No backend, server-side calls, authentication, database, or data-model changes are required.

## Acceptance Criteria

The feature is complete when:

* Google Maps replaces the current Leaflet map.
* Delhi's Google live traffic layer can be toggled independently.
* Existing road-health and simulated-traffic visualizations remain functional.
* Event and bus markers retain their current behavior.
* Event details and focus/fly-to interactions continue to work.
* RUN DEMO completes without breaking map state.
* Existing layer controls continue to work.
* No console errors are introduced.
* The application loads successfully in the supported preview/deployment environment.
