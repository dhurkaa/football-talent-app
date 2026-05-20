# Kosovo Football Talent App

React + Vite frontend for a Kosovo-focused football scouting and match analytics app.

## What is included

- Public `/kosovo-live` page with the official Kosovo UEFA European Qualifiers 2026 squad.
- Live public enrichment from Wikidata for player images, birth dates, places, clubs, and reference links.
- Search, position filters, U23 toggle, sorting, player detail panel, and responsive desktop/mobile layouts.
- Existing authenticated CRUD screens for teams, players, matches, scouts, scouting reports, and analytics.

## Data Sources

- UEFA Kosovo squad: https://www.uefa.com/european-qualifiers/teams/2608110--kosovo/squad/
- Wikidata Query Service: https://query.wikidata.org/

The app shows the UEFA squad immediately and then enriches it with live Wikidata data when the browser can reach the public query service.

## Run

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173/kosovo-live
```

## Checks

```bash
npm run lint
npm run build
```
