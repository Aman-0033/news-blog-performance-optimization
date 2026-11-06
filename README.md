# News Blog — Performance Optimization Command Center (ENG-84718)

[![Tests](https://img.shields.io/badge/Vitest-10%2F10%20Passing-brightgreen?style=flat-square)](./src/__tests__/PerformanceOptimization.test.jsx)
[![Linter](https://img.shields.io/badge/ESLint-0%20Errors-brightgreen?style=flat-square)](./eslint.config.js)
[![Vite](https://img.shields.io/badge/Vite-v6-blue?style=flat-square)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8?style=flat-square)](https://tailwindcss.com/)

An ultra-modern **Enterprise Command Center** interface (inspired by Linear, Vercel, and Raycast) designed for real-time Core Web Vitals monitoring, news article performance audits, payload compression simulation, and telemetry tracking.

---

## ⚡ Flagship Features

### 1. Dual UI Themes & Visual Depth
- **Architectural Micro-Grid**: Subtle dot-grid pattern on the main canvas (`bg-slate-50` / `bg-[#0A0A0A]`) with high-contrast Bento cards.
- **1-Click Theme Switcher**:
  - **Corporate Monochrome (Default)**: High-contrast `slate-950`, `slate-800`, `slate-100`, and `white`.
  - **Cyber Dark Mode**: Jet Black (`#0A0A0A`), carbon cards (`#121216`), Cerulean Blue (`#007BA7`) meters, and Neon Rose (`#FF2D95`) accents.

### 2. Glassmorphic Command Header & Network Capsule
- **Sticky Glassmorphic Header**: `backdrop-blur-md` with executive brand squircle, ticket metadata, and a pulsing live system beacon.
- **Segmented Connectivity Switch**: One-click toggle between **Fast Wi-Fi** and **Slow 3G** to simulate async network latency and cache warming.

### 3. Interactive Bento KPI Cards
- 4-card Bento grid displaying:
  - **Total Articles Audited** (Catalog volume monitored)
  - **Avg Latency** (Target threshold: <500ms)
  - **Total Byte Footprint** (Compressed asset footprint)
  - **Optimized Ratio** (Core Web Vitals compliance)
- Includes squircle icon badges, tabular numerals (`tabular-nums font-mono text-3xl font-bold`), trend badges, and smooth CSS width-animated progress bars.

### 4. Asymmetric Split Workspace
- **8-Column Interactive Data Explorer**:
  - Command-style search bar with global keyboard shortcut (<kbd>Ctrl + K</kbd> or <kbd>/</kbd>).
  - Segmented topic filters and multi-criteria sort controls.
  - Utilization and latency horizontal visualization bars inside table rows.
  - Tactile action buttons with micro-interactions (`active:scale-95`).
  - Centered showcase empty state card with radar illustration and one-click "Reset Filters".
- **4-Column Sticky Action Studio**:
  - Sticky elevated submission form (`sticky top-24`) with uppercase micro-labels.
  - Strict semantic red validation styling (`border-red-600 bg-red-50/40 text-red-700`) for invalid fields (`aria-invalid="true"`).
  - Inline loading spinner during async network operations.

### 5. Collapsible Developer Telemetry Terminal
- Docked terminal at the bottom (`bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800`) displaying live `[Analytics]` interaction events with timestamps, action tags, and log clearing.

---

## 🛠️ Performance & Engineering Architecture

1. **Memoized Computations (`useMemo`)**:
   - Article dataset filtering and sorting: `useMemo(..., [articles, selectedCategory, searchQuery, sortBy])`
   - Real-time KPI calculations: `useMemo(..., [articles])`
2. **Stable Event Callbacks (`useCallback`)**:
   - Prevents unnecessary handler recreations across all interactive inputs and buttons.
3. **Pure Component Memoization (`React.memo`)**:
   - `KpiCard`, `ArticleTableRow`, `EmptyState`, and `TelemetryActivityLog` are memoized to eliminate redundant DOM reconciliation.
4. **Security & Sanitization (XSS NFR)**:
   - Client-side sanitization in `src/utils/sanitize.js` strips `<script>`, `<style>`, inline handlers (`onerror`, `onload`, `onmouseover`), and malicious injection vectors before saving state.
5. **Accessibility (a11y NFR)**:
   - Full keyboard accessibility with explicit `aria-label`, `<label htmlFor>`, `role="status"`, and `aria-busy="true"` attributes.

---

## 🧪 Testing & Quality Gates

Run the test suite with Vitest:
```bash
npx vitest run
```

Run ESLint:
```bash
npm run lint
```

Build for production:
```bash
npm run build
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.
