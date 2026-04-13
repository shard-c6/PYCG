<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Three.js-0.169-black?style=for-the-badge&logo=three.js" alt="Three.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Scikit--Learn-ML-F7931E?style=for-the-badge&logo=scikit-learn" alt="Scikit-Learn" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-000?style=for-the-badge&logo=vercel" alt="Vercel" />
</p>

# 🌍 GlobalLedger — Global GDP Explorer

**A production-grade, interactive 3D globe dashboard for exploring national economic data, powered by machine learning forecasting.**

> 🔗 **Live Demo**: [global-ledger-two.vercel.app](https://global-ledger-two.vercel.app)

---

## Overview

GlobalLedger transforms complex macroeconomic data into an intuitive, visually stunning experience. Users interact with a 3D Earth rendered using WebGL, click on glowing country markers, and dive into rich analytical dashboards featuring historical GDP trends, AI-driven 2030 projections, and comparative reserves analysis.

The platform covers **54 countries** with data spanning **1995–2024**, enriched by a **Scikit-Learn linear regression model** with exponential weighting that predicts GDP trajectories through 2030.

---

## ✨ Key Features

### 🌐 Interactive 3D Globe
- **Textured Earth** with NASA Blue Marble daymap, normal mapping, and specular highlights
- **Fresnel Atmosphere** shader creating a realistic blue rim glow
- **Multi-layer Parallax Starfield** — 4,600+ stars across 3 depth layers with twinkling and camera-reactive parallax
- **54 Glowing Markers** — emissive cyan dots with glassmorphism tooltips on hover
- **GSAP Camera Flyover** — smooth `power3.inOut` animation to selected countries

### 📊 Intelligence Dashboard
- **GDP Trend Line** — interactive Recharts visualization with global average overlay
- **Annual Growth Multiplier** — year-over-year percentage change bar chart
- **Local Time Display** — real-time clock synced to the selected country's IANA timezone
- **Economic Momentum Score** — 5-year vs. historical growth velocity indicator
- **AI 2030 GDP Projection** — machine learning forecast displayed with confidence metrics
- **Sector Dynamics** — industry-level performance breakdown (Financial Services, Tech & AI, Manufacturing, Agriculture)
- **Market Outlook** — contextual narrative generated from live inflation and momentum data
- **Export to CSV** — one-click dataset download via Pandas

### 📈 Reserves Analysis Suite
- **Forex Reserves Over Time** — line chart tracking central bank reserves (2020–2024)
- **Reserve Composition** — interactive donut chart (currencies, gold, SDR, IMF)
- **Import Cover** — horizontal bar chart with a 3-month safety threshold line
- **Economic Health Index** — radar chart scoring 6 macroeconomic health indicators

### 🤖 AI & Analytics Backend
- **Forecasting Model**: Scikit-Learn `LinearRegression` with exponential sample weighting
- **Momentum Score**: Relative 5-year growth vs. historical average (>100 = accelerating)
- **CAGR Calculator**: Compound Annual Growth Rate over configurable windows
- **RESTful API**: FastAPI with automatic OpenAPI documentation

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 (App Router) | Server/client rendering, routing |
| **3D Engine** | Three.js + @react-three/fiber | WebGL globe, markers, starfield |
| **Animation** | GSAP + Framer Motion | Camera flyovers, dashboard transitions |
| **Charts** | Recharts + Chart.js (CDN) | Line, bar, donut, radar visualizations |
| **Styling** | Tailwind CSS 3 | Utility-first responsive design |
| **Backend** | FastAPI (Python) | REST API, data aggregation |
| **ML** | Scikit-Learn + NumPy | GDP forecasting, momentum analysis |
| **Data** | Pandas | CSV export generation |
| **Deployment** | Vercel | Frontend + Serverless Functions |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- npm or yarn

### 1. Clone & Install

```bash
git clone <your-repo>
cd PYCG
npm install
pip install -r requirements.txt
```

### 2. Download Earth Textures

Place three textures in `/public/textures/`:

| File | Source |
|------|--------|
| `earth_daymap.jpg` | [NASA Blue Marble](https://eoimages.gsfc.nasa.gov/images/imagerecords/74000/74117/world.200408.3x5400x2700.jpg) |
| `earth_normal_map.jpg` | [WebGL Earth](https://raw.githubusercontent.com/turban/webgl-earth/master/images/earth-bump.jpg) |
| `earth_specular_map.jpg` | [WebGL Earth](https://raw.githubusercontent.com/turban/webgl-earth/master/images/earth-specular.jpg) |

> **Note:** The globe renders as a gray sphere if textures are missing.

### 3. Run Development Servers

```bash
# Terminal 1 — Backend (FastAPI)
python3 -m uvicorn api.index:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 — Frontend (Next.js)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
PYCG/
├── api/                          # Python backend
│   ├── index.py                  # FastAPI routes & CORS
│   ├── data_manager.py           # GDP dataset (54 countries, 1995–2024)
│   └── analytics.py              # ML forecasting & momentum scoring
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout, fonts, metadata
│   └── page.tsx                  # Server component entry
├── components/                   # React components
│   ├── GlobeExplorer.tsx         # Root state manager (globe ↔ dashboard)
│   ├── GlobeScene.tsx            # Canvas, camera, lighting, OrbitControls
│   ├── Globe.tsx                 # Earth sphere mesh + textures
│   ├── Atmosphere.tsx            # Fresnel GLSL rim glow
│   ├── Stars.tsx                 # Multi-layer parallax starfield (4600+ pts)
│   ├── CountryMarkers.tsx        # 54 emissive markers with glass tooltips
│   ├── Dashboard.tsx             # Intelligence dashboard grid layout
│   ├── GDPChart.tsx              # Recharts GDP trend line
│   ├── GrowthChart.tsx           # YoY growth percentage bar chart
│   ├── MomentumMetrics.tsx       # AI projection & momentum display
│   ├── LocalClock.tsx            # Timezone-aware real-time clock
│   ├── SectorPerformance.tsx     # Industry performance matrix
│   ├── ReservesAnalysis.tsx      # 4-chart reserves analysis (Chart.js)
│   ├── TimelineSlider.tsx        # Year range selector
│   └── ErrorBoundary.tsx         # WebGL error recovery
├── lib/                          # Shared utilities
│   ├── types.ts                  # TypeScript interfaces
│   ├── countries.ts              # 54 countries (lat/lng + timezone)
│   ├── data.ts                   # API fetch layer
│   └── utils.ts                  # latLngToVector3, formatGDP
├── styles/
│   └── globals.css               # Design tokens, scrollbar, animations
├── public/textures/              # Earth texture maps (user-provided)
├── requirements.txt              # Python dependencies
├── vercel.json                   # Deployment config
└── package.json                  # Node dependencies
```

---

## 🔌 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/python` | GET | Health check |
| `/api/data` | GET | Full dataset (54 countries) |
| `/api/country/{CODE}` | GET | Country data + AI analytics |
| `/api/stats/global-average` | GET | Global average GDP timeline |
| `/api/export/{CODE}` | GET | Download GDP history as CSV |

### Example Response — `/api/country/USA`

```json
{
  "country": "USA",
  "name": "United States",
  "gdp": [{"year": 1995, "value": 7664060000000}, ...],
  "growth": 2.8,
  "per_capita": 85373,
  "inflation": 2.9,
  "unemployment": 4.1,
  "currency": "USD",
  "data_year": 2024,
  "delta": 6.6,
  "analytics": {
    "prediction_2030": 30180000000000,
    "momentum_score": 14.0,
    "forecasting_model": "LinearRegression (Scikit-Learn)"
  }
}
```

---

## 🧠 AI Model Details

### GDP Forecasting
- **Algorithm**: Ordinary Least Squares Linear Regression
- **Enhancement**: Exponential sample weighting — recent data points (2020–2024) carry ~7× more influence than 1995 data
- **Target Year**: 2030 (configurable)
- **Validation**: Predictions are clamped to ≥ 0 to prevent negative GDP forecasts

### Economic Momentum
- **Formula**: `(5yr_growth / total_growth) × 100`
- **Interpretation**: Score > 100 = economy accelerating vs. its historical trend

---

## 🎨 Design Philosophy

- **Dark Theme**: `#030407` background with cyan (`#7bd1fa`) accents
- **Glassmorphism**: Semi-transparent panels with backdrop blur
- **Typography**: Inter (UI) + Fira Code (financial data)
- **Animation**: GSAP for 3D camera, Framer Motion for dashboard, CSS for tooltips
- **Performance**: `React.memo` on heavy components, additive blending on starfield, lazy-loaded 3D scene

---

## 🏗️ Build for Production

```bash
npm run build
npm start
```

---

## 📄 License

MIT

---

<p align="center">
  <sub>Built with ☕ using Next.js, Three.js, FastAPI & Scikit-Learn</sub>
</p>
