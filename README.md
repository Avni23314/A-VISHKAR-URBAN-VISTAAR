# Urban Pulse Dashboard

Build ONLY the initial frontend shell for an SIH prototype called:

AI-Powered Mobile Urban Intelligence Platform

This is a Smart India Hackathon MVP.

I have very limited time, so prioritize SPEED, RELIABILITY and a WORKING UI over completeness.

Do NOT build:

- backend

- authentication

- database

- real APIs

- AI inference

- Google Maps API

- MQTT

- advanced analytics

- multiple pages

Build ONE desktop dashboard page.

Use:

- React

- TypeScript

- Tailwind CSS

- Leaflet / React Leaflet if available

The dashboard should have:

1. Header

   - "URBAN INTELLIGENCE"

   - "AI-Powered Mobile Urban Intelligence Platform"

   - system status: ONLINE

2. KPI row

   - Active Buses

   - Active Events

   - Critical

   - Confirmed

   - Road Health

3. Main content

   - Large map occupying most of the screen

   - Right-side incident/event panel

4. Left-side compact layer control:

   - Road Health

   - Traffic

   - Safety

   - Waterlogging

   - Buses

5. Use mock data only.

6. Add 10–15 mock road segments around Delhi.

   Each segment must have:

   - coordinates

   - health score

   - condition

7. Color the road segments:

   - green = healthy

   - yellow = attention

   - orange = poor

   - red = critical

8. Add 8–10 mock event markers.

9. Clicking an event marker should open an event detail card showing:

   - event type

   - severity

   - confidence

   - bus ID

   - route

   - timestamp

   - latitude

   - longitude

10. Make the UI polished and presentation-ready.

IMPORTANT:

Do not create any advanced features yet.

Do not create additional pages.

Do not over-engineer.

Finish this dashboard completely before doing anything else.

The app must load without errors.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://city-vista-ui.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f74e7881-2ce8-4e0c-a10c-2e0d289a1f3c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
