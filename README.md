# 🌍 Global GDP Explorer

An interactive 3D globe dashboard for exploring country-level GDP data — built with Next.js 14, Three.js, and Recharts.

---

## Tech Stack

| Package | Version |
|---|---|
| next | 14.x (App Router) |
| react / react-dom | 18.x |
| three | 0.169.x |
| @react-three/fiber | 8.x |
| @react-three/drei | 9.x |
| gsap | 3.x |
| recharts | 2.x |
| tailwindcss | 3.x |
| framer-motion | 11.x |

---

## Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo>
cd global-gdp-explorer
npm install
```

### 2. Download Earth Textures

You need three textures placed in `/public/textures/`:

#### earth_daymap.jpg (required — main color texture)
Download the NASA Blue Marble 8K texture:
```
https://eoimages.gsfc.nasa.gov/images/imagerecords/74000/74117/world.200408.3x5400x2700.jpg
```
Save it as: `public/textures/earth_daymap.jpg`

#### earth_normal_map.jpg (required — surface bump detail)
Download from Natural Earth:
```
https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/raster/GRAY_50M_SR_OB.zip
```
Or use this free alternative:
```
https://raw.githubusercontent.com/turban/webgl-earth/master/images/earth-bump.jpg
```
Save it as: `public/textures/earth_normal_map.jpg`

#### earth_specular_map.jpg (required — ocean shine)
Download from:
```
https://raw.githubusercontent.com/turban/webgl-earth/master/images/earth-specular.jpg
```
Save it as: `public/textures/earth_specular_map.jpg`

> **Note:** All three texture files must be present before running the dev server. The globe will show a gray sphere if textures are missing.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

- **Rotate**: Click and drag the globe
- **Zoom**: Scroll wheel (3–12 units)
- **Select Country**: Click any glowing teal marker
- **Dashboard**: Slides in from the right with GDP data and historical chart
- **Close**: Click × in the dashboard or click off a marker

---

## Project Structure

```
global-gdp-explorer/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── page.tsx                # Server component entry
│   └── api/gdp/[countryCode]/
│       └── route.ts            # Mock GDP API with 8+ real datasets
├── components/
│   ├── GlobeScene.tsx          # Canvas + lighting + GSAP camera
│   ├── Globe.tsx               # Earth sphere + textures
│   ├── Atmosphere.tsx          # Fresnel glow shader
│   ├── Stars.tsx               # 3000-point starfield
│   ├── CountryMarkers.tsx      # Clickable lat/lng dots
│   ├── Dashboard.tsx           # Slide-in GDP panel
│   ├── GDPChart.tsx            # Recharts line chart (neon glow)
│   ├── LoadingSpinner.tsx      # Animated spinner
│   ├── GlobeExplorer.tsx       # Client-side state shell
│   └── ErrorBoundary.tsx       # WebGL error catch
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── countries.ts            # 54 countries with lat/lng
│   └── utils.ts                # latLngToVector3, formatGDP
├── public/
│   └── textures/
│       ├── earth_daymap.jpg    # ← MUST DOWNLOAD
│       ├── earth_normal_map.jpg
│       └── earth_specular_map.jpg
└── styles/
    └── globals.css             # Design tokens + scrollbar
```

---

## Features

- **Interactive 3D Earth** — MeshPhongMaterial with day texture, normal map, and specular map
- **Fresnel Atmosphere Glow** — custom GLSL shader for blue rim effect
- **3000-point Starfield** — THREE.Points with depth-filtered positions
- **GSAP Camera Animation** — smooth `power3.inOut` flyovers to selected countries
- **54 Country Markers** — lat/lng projected to 3D sphere surface
- **Glassmorphic Dashboard** — Framer Motion spring slide-in
- **Historical GDP Charts** — Recharts line chart with neon glow SVG filter
- **Mock GDP API** — 8 major economies with real historical data (USA, CHN, IND, GBR, JPN, DEU, BRA, ZAF)
- **Responsive Design** — works on all screen sizes

---

## Build for Production

```bash
npm run build
npm start
```
