# OPPO vs Kompetitor - Comparison Website Documentation

## Project Overview
Website perbandingan smartphone OPPO vs kompetitor (Vivo, Samsung, Xiaomi, Realme, Tecno, Infinix) dengan UI modern glassmorphism, animasi Kalimantan, dan Framer Motion.

## Tech Stack
- **Framework**: Next.js 14 (App Router) + React 18
- **Styling**: Tailwind CSS v4 (@tailwindcss/postcss)
- **Animation**: Framer Motion (stagger variants, custom ease [0.34, 1.56, 0.64, 1])
- **Icons**: Lucide React
- **Language**: JavaScript (no TypeScript)
- **PWA**: manifest.json, viewport meta, Indonesian locale

## Project Structure
```
oppo-vs-competitor/
├── src/
│   ├── app/
│   │   ├── globals.css       # Kalimantan theme, glass utilities, animations
│   │   ├── layout.jsx        # Metadata, PWA config, fonts
│   │   └── page.jsx          # Main page with all components
│   ├── components/
│   │   ├── BrandSelector.jsx     # Competitor brand dropdown
│   │   ├── TypeSelector.jsx      # Type/series dropdown per brand
│   │   ├── ModelSelector.jsx     # Model dropdown per type/brand
│   │   ├── PhoneCard.jsx         # Selected phone summary card
│   │   ├── ComparisonTable.jsx   # Side-by-side spec table
│   │   └── SpecRow.jsx           # Individual spec row with winner logic
│   ├── data/
│   │   ├── oppo.js           # 5 OPPO models
│   │   └── competitors.js    # 33 competitor models across 7 brands
│   └── types/
│       └── phone.js          # SPEC_FIELDS comparison configuration
├── public/
│   ├── manifest.json         # PWA manifest
│   └── favicon.svg           # App icon
├── package.json
├── next.config.js
├── postcss.config.js
└── PROJECT_DOCUMENTATION.md  # This file
```

## Data Models

### OPPO Phones (5 models)
| ID | Model | Type | Chipset | Harga |
|---|---|---|---|---|
| oppo-a6c | A6C | A-Series | Unisoc T7250 | Rp 2.799.000 - 3.199.000 |
| oppo-a6 | A6 | A-Series | Snapdragon 685 | Rp 4.299.000 - 4.799.000 |
| oppo-a7-pro | A7 Pro | A-Series | Dimensity 6360 | Rp 7.499.000 |
| oppo-reno16f | Reno 16F | Reno 16 Series | Dimensity 7300 | Rp 7.999.000 |
| oppo-reno16-5g | Reno 16 5G | Reno 16 Series | Snapdragon 7 Gen | Rp 11.999.000 - 12.999.000 |

### Competitor Phones (33 models across 7 brands)
- **VIVO**: 6 models (V80 Lite, Y05, Y05e, Y31D Pro, V80 FE 5G, V80 5G)
- **Samsung**: 8 models (A07, A07s, A08, A17 LTE, A18, A57, A57 5G, S25 FE)
- **Xiaomi/Redmi**: 5 models (Redmi 7 Pro, Note 15 5G, 15 Pro+, Note 17 Pro Max, 17T Pro)
- **Realme**: 4 models (Note 80, C85 Pro, 16 Pro, 16 Pro+)
- **Infinix**: 6 models (Smart 20, Hot 70, Note Edge 5G, GT 50 Pro, GT 50 PRO, Note 60 Ultra)
- **Tecno**: 4 models (Spark 50, Helio G200, Camon 50 Pro, Dimensity 7400)

## UI Flow
1. **OPPO Side**: Dropdown Type → Dropdown Model
2. **Competitor Side**: Dropdown Brand → Dropdown Type → Dropdown Model
3. **Comparison Table**: Auto-renders when both phones selected
4. **Phone Cards**: Show selected phone summary with clear button
4. **Reset Button**: Clears all selections

## Design System

### Colors (CSS Variables in globals.css)
```css
--primary: #0066FF (OPPO blue)
--primary-foreground: #ffffff
--secondary: #E87A3E (Kalimantan orange)
--secondary-foreground: #ffffff
--accent: #10B981 (emerald)
--background: #0A0F1A (dark navy)
--foreground: #F8FAFC
--muted: #1E2A3A
--muted-foreground: #94A3B8
--border: #2A3A4A
--glass-bg: rgba(15, 23, 42, 0.6)
--glass-blur: blur(20px)
--glass-border: rgba(148, 163, 184, 0.15)
--glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3)
```

### Animations
- **Sky Gradient**: 30s infinite
- **Water Flow**: 15s infinite
- **Floating Orbs**: 40s infinite
- **Island Breathe**: 8s ease-in-out infinite
- **Stagger Entrance**: 0.1s delay per item, ease [0.34, 1.56, 0.64, 1]

### Glassmorphism Classes
- `.glass` - Basic glass
- `.glass-strong` - Stronger glass for cards
- `.glass-subtle` - Subtle glass for backgrounds

## Comparison Logic (SpecRow.jsx)

### Auto Winner Detection (`simpleCompare` function)
| Field | Logic |
|---|---|
| `harga` | Lower price wins |
| `baterai` | Higher mAh wins, then higher Watt |
| `ramRom` | Higher RAM wins, then higher ROM |
| `rearCamera` / `selfieCamera` | Higher MP wins |
| `layar` | Higher refresh rate (Hz) wins |
| `chipset` | Tier-based ranking (Unisoc → Helio → Dimensity → Snapdragon → Exynos → MTK/QS) |
| Default | Longer string = more features |

### SPEC_FIELDS Configuration (phone.js)
```javascript
[
  { key: 'harga', label: 'Harga', higherIsBetter: false },
  { key: 'rearCamera', label: 'Kamera Belakang' },
  { key: 'selfieCamera', label: 'Kamera Depan' },
  { key: 'layar', label: 'Layar' },
  { key: 'speaker', label: 'Speaker' },
  { key: 'baterai', label: 'Baterai & Charging' },
  { key: 'ramRom', label: 'RAM / ROM' },
  { key: 'sertifikasi', label: 'Sertifikasi Ketahanan' },
  { key: 'chipset', label: 'Chipset' },
  { key: 'os', label: 'Sistem Operasi' },
  { key: 'aiFitur', label: 'Fitur AI' },
  { key: 'fiturKamera', label: 'Fitur Kamera Khusus' },
]
```

## Commands
```bash
npm run dev      # Development server (port 3001)
npm run build    # Production build
npm run start    # Production server
```

## Deployment
- Target: Vercel
- Static export ready (prerendered)
- PWA manifest configured for installability

## Credits
**Created by**: Muhammad Ravi Maulana
**Date**: 2026-11-18