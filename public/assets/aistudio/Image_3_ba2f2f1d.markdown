---
name: Andean Logistics Intelligence
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001a42'
  on-tertiary-container: '#3980f4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a high-performance business intelligence environment tailored for supply chain and consumer goods distribution in Peru. The persona is authoritative, analytical, and remarkably precise. The target audience consists of operations directors, financial analysts, and regional managers who require immediate clarity over complex logistics, inventory turnover, and sales velocity metrics. 

The aesthetic style is **Corporate / Modern**, prioritizing dense, scannable data layouts, high-contrast typography, and purposeful use of color to signal operational KPIs without visual clutter.

## Colors

The color palette is anchored by deep corporate navy blue (`#0F172A`) for structural navigation and primary headers, establishing institutional trust and focus. Emerald green (`#10B981`) serves as the functional accent to highlight positive sales variances, fulfillment targets, and achievement metrics. A crisp slate background (`#F8FAFC`) reduces eye strain during extended analytical sessions, while high-contrast charcoal text ensures maximum legibility for dense tabular data and financial summaries.

## Typography

The typographic hierarchy utilizes Inter for its exceptional legibility at small sizes, crucial for data tables, metrics tickers, and compact dashboard widgets. Font weights are strictly managed between regular (400) for body data, medium (500) for table headers and interactive labels, and semi-bold/bold (600/700) for section titles and KPIs. Large display values scale down intelligently on mobile viewports to prevent truncation of financial figures.

## Layout & Spacing

The layout is built upon a **12-column fluid grid system** optimized for high-density desktop monitoring workstations while gracefully collapsing for tablet and mobile supervisory reviews. 

- **Desktop (1024px+):** Utilizes a 24px outer canvas margin with 24px gutters. Dashboard modules snap to precise column spans (e.g., metric cards span 3 columns; main trend charts span 8 or 12 columns).
- **Tablet (768px - 1023px):** Margins reduce to 16px; multi-column KPI rows reflow into a 2x2 grid.
- **Mobile (< 768px):** Single-column stack with 12px outer margins and vertical spacing locked to `space-md` to preserve touch targets.

## Elevation & Depth

Visual hierarchy relies on **tonal layers** combined with low-contrast outlines rather than heavy drop shadows. 

- **Surfaces:** The canvas sits at base level (`#F8FAFC`). Content containers, cards, and data tables use solid white surfaces (`#FFFFFF`) with subtle 1px borders (`#E2E8F0`) to delineate functional boundaries.
- **Floating Elements:** Dropdown menus, tooltips, and modal dialogs employ ultra-subtle, diffused shadows (`0 4px 6px -1px rgba(15, 23, 42, 0.08)`) to lift them cleanly above the workspace without adding visual noise.

## Shapes

A **Soft** shape language (`roundedness` level 1) is applied across all interface components. 

- Interactive elements, input fields, and metric cards feature a controlled 0.25rem border radius, maintaining a sharp, enterprise-grade precision while avoiding harsh 90-degree corners.
- Larger structural containers and modal windows utilize `rounded-lg` (0.5rem) to establish clear enclosure boundaries for grouped datasets.

## Components

### Buttons
Primary actions utilize the corporate navy background (`#0F172A`) with high-contrast white text and subtle hover elevation. Secondary actions feature ghost borders with dark slate text. Sales achievement or export triggers may use the emerald accent (`#10B981`) sparingly.

### Chips & Badges
Used extensively for status tracking (e.g., "Dispatched", "Pending Custom Clearance"). Badges feature soft tinted backgrounds matching their semantic state with solid text values.

### Input Fields & Filters
Designed for high-density query panels. Text inputs feature crisp 1px slate borders, clear baseline labels, and embedded icons for date ranges, regional selectors, and SKU search.

### Data Tables & Lists
The core of the BI interface. Rows feature alternating subtle background tints on hover, sticky headers in dark navy, and right-aligned numeric data for effortless financial scanning.

### Cards & Metrics
KPI cards display primary metrics in `display-lg` typography, accompanied by a percentage change indicator styled in emerald green (positive) or coral (negative) alongside a micro sparkline.