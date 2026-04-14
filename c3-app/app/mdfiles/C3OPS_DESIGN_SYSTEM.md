# C3Ops FinOps Design System
**Version:** 2.0 (February 2026)  
**Platform:** finops.c3ops.io & c3ops.io  
**Framework:** React + Tailwind CSS + Framer Motion

---

## 📐 TABLE OF CONTENTS
1. [Color System](#color-system)
2. [Logo Assets](#logo-assets)
3. [Typography](#typography)
4. [Component Patterns](#component-patterns)
5. [Spacing & Layout](#spacing--layout)
6. [Animation Guidelines](#animation-guidelines)
7. [Mobile Optimization](#mobile-optimization)
8. [SEO & Meta Tags](#seo--meta-tags)
9. [Accessibility](#accessibility)
10. [Code Examples](#code-examples)

---

## 🎨 COLOR SYSTEM

### Strategic Color Hierarchy (FinOps Psychology)

**CRITICAL RULE:** Green = Money/Savings (Primary), Navy = Trust/Security (Secondary)

#### Accent - Emerald Green (PRIMARY for CTAs, Savings, Financial Benefits)
```javascript
accent: {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',  // PRIMARY - Main CTAs
  700: '#15803d',  // DARK - Logo, hover states
  800: '#166534',
  900: '#14532d',
}
```

**Usage:**
- ✅ All CTA buttons
- ✅ Savings metrics (25%, $200K saved)
- ✅ Success states
- ✅ Primary navigation active states
- ✅ Logo color

#### Trust - Navy Blue (Security, Enterprise Credibility, Compliance)
```javascript
trust: {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',  // MAIN - Security badges
  900: '#1e3a8a',
}
```

**Usage:**
- ✅ Security/compliance badges (SOC2, ISO, GDPR)
- ✅ Trust signals
- ✅ Enterprise feature highlights
- ❌ NOT for CTAs (dilutes savings message)

#### Tech - Teal/Cyan (SECONDARY - Cloud/Platform Features)
```javascript
tech: {
  50: '#ecfeff',
  100: '#cffafe',
  200: '#a5f3fc',
  300: '#67e8f9',
  400: '#22d3ee',
  500: '#06b6d4',
  600: '#0891b2',
  700: '#0e7490',
  800: '#155e75',
  900: '#164e63',
}
```

**Usage:**
- ✅ Cloud service icons (sparingly)
- ✅ Platform feature accents (minimal)
- ❌ NEVER for primary CTAs

#### Primary - Slate (Neutral Backgrounds, Text)
```javascript
primary: {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
}
```

**Usage:**
- Backgrounds: 50, 100, 200
- Text: 600, 700, 800, 900
- Borders: 200, 300

#### Warning - Amber (Budget Alerts)
```javascript
warning: {
  500: '#f59e0b',
  600: '#d97706',
}
```

#### Danger - Rose (Overspend, Critical Issues)
```javascript
danger: {
  500: '#f43f5e',
  600: '#e11d48',
}
```

**Usage in Problem/Solution Narratives:**
- Red gradient for "problem" (e.g., "$340K surprise")
- Green gradient for "solution" (e.g., "Predictable savings")

---

## 🎯 LOGO ASSETS

### Primary Logo - Dark Green Monochrome

**File:** `c3ops-logo-mono-green.svg`

```svg
<svg viewBox="0 0 200 70" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- C Arc -->
  <path d="M46 12C28 12 14 28 14 44C14 60 28 76 46 76" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/>
  <!-- Bar 1 - Tallest -->
  <rect x="28" y="26" width="7" height="32" rx="3.5" fill="#15803d"/>
  <!-- Bar 2 - Medium -->
  <rect x="39" y="36" width="7" height="22" rx="3.5" fill="#15803d"/>
  <!-- Bar 3 - Shortest -->
  <rect x="50" y="48" width="7" height="10" rx="3.5" fill="#15803d"/>
  <!-- Ops Text -->
  <text x="70" y="52" font-family="system-ui, -apple-system, sans-serif" font-size="42" font-weight="700" fill="#15803d" letter-spacing="-0.02em">Ops</text>
</svg>
```

**Usage Guidelines:**
- Header: h-10 (40px) desktop, h-8 (32px) mobile
- Footer: h-12 (48px)
- Always use SVG for scalability
- Color: #15803d (accent-700)
- Alt text: "C3Ops - FinOps Platform"

### Logo Variants

**White Version** (for dark backgrounds):
```svg
<!-- Same structure, all fill/stroke="#ffffff" -->
```

**Navy Version** (for special cases):
```svg
<!-- Same structure, all fill/stroke="#1e40af" -->
```

---

## 📝 TYPOGRAPHY

### Font Stack
```css
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

### Type Scale (Mobile-First Responsive)

**Hero Heading (H1):**
```jsx
className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight"
```

**Section Heading (H2):**
```jsx
className="text-3xl sm:text-4xl md:text-5xl font-black"
```

**Subsection Heading (H3):**
```jsx
className="text-xl md:text-2xl font-bold"
```

**Card Title (H4):**
```jsx
className="text-lg font-bold text-gray-900"
```

**Body Text:**
```jsx
className="text-base md:text-lg text-gray-700 leading-relaxed"
```

**Small Text:**
```jsx
className="text-sm text-gray-600"
```

**Accent/Gradient Text:**
```jsx
<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-700">
  Save Money
</span>
```

---

## 🧩 COMPONENT PATTERNS

### 1. Primary CTA Button

```jsx
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.98 }}
  className="bg-gradient-to-r from-accent-600 to-accent-700 
    hover:from-accent-700 hover:to-accent-800 
    text-white font-bold py-4 px-8 rounded-xl 
    shadow-xl hover:shadow-2xl transition-all duration-300
    inline-flex items-center gap-3"
>
  Get Started Today
  <ArrowIcon />
</motion.button>
```

### 2. Secondary Button (Outline)

```jsx
<button className="border-2 border-accent-600 text-accent-600 
  hover:bg-accent-50 font-semibold py-3 px-8 rounded-lg 
  transition-all duration-300">
  Learn More
</button>
```

### 3. Card Component

```jsx
<motion.div
  whileHover={{ y: -5, scale: 1.02 }}
  className="bg-white p-6 md:p-8 rounded-2xl shadow-lg 
    border-2 border-slate-100 hover:shadow-xl 
    transition-all duration-300"
>
  {/* Content */}
</motion.div>
```

### 4. Icon Box (Financial/Savings)

```jsx
<div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 
  rounded-xl flex items-center justify-center">
  <Icon className="text-white text-2xl" />
</div>
```

### 5. Icon Box (Security/Trust)

```jsx
<div className="w-14 h-14 bg-gradient-to-br from-trust-600 to-trust-700 
  rounded-xl flex items-center justify-center">
  <ShieldIcon className="text-white text-2xl" />
</div>
```

### 6. Section Background

```jsx
<section className="py-20 bg-gradient-to-br from-slate-50 to-white 
  relative overflow-hidden">
  {/* Decorative blob */}
  <div className="absolute top-0 right-0 w-96 h-96 
    bg-gradient-to-br from-accent-50/20 to-slate-100/20 
    rounded-full blur-3xl"></div>
  
  {/* Content */}
</section>
```

### 7. Badge/Pill

```jsx
<div className="inline-flex items-center px-4 py-2 
  bg-accent-100 text-accent-700 rounded-full 
  text-sm font-semibold">
  ✓ 25% Savings
</div>
```

### 8. Trust Badge

```jsx
<div className="flex items-center gap-2 bg-white px-6 py-3 
  rounded-full shadow-lg border-2 border-trust-200">
  <ShieldIcon className="text-trust-700 text-xl" />
  <span className="font-black text-gray-800">SOC2 Compliant</span>
</div>
```

---

## 📏 SPACING & LAYOUT

### Container
```jsx
<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
```

### Section Padding
```jsx
className="py-16 md:py-20 lg:py-24"
```

### Grid Layouts

**3-Column (Responsive):**
```jsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
```

**2-Column (Responsive):**
```jsx
<div className="grid md:grid-cols-2 gap-8">
```

---

## 🎬 ANIMATION GUIDELINES

### Framer Motion Patterns

**Hover Effects:**
```jsx
whileHover={{ scale: 1.05, y: -2 }}
whileTap={{ scale: 0.95 }}
```

**Scroll Reveal:**
```jsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, delay: 0.1 }}
>
```

**Stagger Children:**
```jsx
transition={{ delay: index * 0.1 }}
```

**Rules:**
- Keep subtle (max 1.05 scale)
- Fast (300ms duration)
- Professional (no bounce/playful)
- Use `viewport={{ once: true }}` for scroll animations

---

## 📱 MOBILE OPTIMIZATION

### CSS Requirements

```css
@layer base {
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* WCAG AAA Touch Targets */
  @media (max-width: 768px) {
    a, button {
      min-height: 44px;
      min-width: 44px;
    }

    /* Prevent zoom on input focus */
    input, select, textarea {
      font-size: 16px !important;
    }

    /* Smooth mobile scrolling */
    .overflow-y-auto {
      -webkit-overflow-scrolling: touch;
    }
  }
}

@layer components {
  /* Tap feedback */
  button, a {
    -webkit-tap-highlight-color: rgba(34, 197, 94, 0.2);
    tap-highlight-color: rgba(34, 197, 94, 0.2);
    touch-action: manipulation;
  }

  /* Focus states */
  .focus-visible:focus {
    outline: 2px solid #15803d;
    outline-offset: 2px;
  }
}
```

### Tailwind Config (Mobile-First)

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: { /* slate colors */ },
        accent: { /* green colors */ },
        trust: { /* navy colors */ },
        tech: { /* teal colors */ },
        success: { /* same as accent */ },
        warning: { /* amber */ },
        danger: { /* rose */ },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

---

## 🔍 SEO & META TAGS

### HTML Head Template

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
  
  <!-- Theme Colors -->
  <meta name="theme-color" content="#15803d" />
  <meta name="theme-color" media="(prefers-color-scheme: light)" content="#15803d" />
  <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#166534" />
  
  <!-- SEO -->
  <title>C3Ops FinOps Platform - Reduce Cloud Costs 20-30% | AWS Azure GCP</title>
  <meta name="description" content="Save 20-30% on cloud costs with C3Ops FinOps Platform. Expert-led multi-cloud cost optimization for AWS, Azure, GCP. Platform + People approach with certified FinOps engineers." />
  <meta name="keywords" content="FinOps platform, cloud cost optimization, reduce cloud costs, AWS cost reduction, Azure cost savings, GCP cost management" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="https://finops.c3ops.io/" />
  
  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://finops.c3ops.io/" />
  <meta property="og:title" content="C3Ops FinOps Platform - Save 20-30% on Cloud Costs" />
  <meta property="og:description" content="Platform + People = Results. Certified FinOps engineers + enterprise platform." />
  <meta property="og:image" content="https://finops.c3ops.io/og-image.png" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="C3Ops FinOps Platform - Reduce Cloud Costs 20-30%" />
  
  <!-- Mobile Web App -->
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="C3Ops" />
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/logo-icon.svg" />
  
  <!-- Preload -->
  <link rel="preload" as="image" href="/c3ops-logo-mono-green.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
</head>
```

---

## ♿ ACCESSIBILITY

### Checklist

- ✅ Color contrast: WCAG AA minimum (4.5:1 for text)
- ✅ Touch targets: 44x44px minimum
- ✅ Focus indicators: 2px solid accent-700
- ✅ Alt text on all images
- ✅ Semantic HTML (h1→h6 hierarchy)
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support

### Code Examples

```jsx
// Button with ARIA
<button aria-label="Get free assessment" className="...">
  Get Started
</button>

// Image with alt
<img src="/logo.svg" alt="C3Ops - FinOps Platform" />

// Link with external indicator
<a href="https://..." target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in new tab)">
  <LinkedInIcon />
</a>
```

---

## 💻 CODE EXAMPLES

### Complete Page Structure

```jsx
import { motion } from 'framer-motion';
import { FaCheckCircle, FaRocket } from 'react-icons/fa';

export default function FinOpsApp() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full bg-white border-b-2 border-accent-200 shadow-md z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <img 
            src="/c3ops-logo-mono-green.svg" 
            alt="C3Ops - FinOps Platform"
            className="h-10"
          />
          <button className="bg-gradient-to-r from-accent-600 to-accent-700 
            hover:from-accent-700 hover:to-accent-800 
            text-white font-bold py-3 px-6 rounded-lg">
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
          >
            Reduce Cloud Spend by <br></br> 20–30% with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-700">
            AI-Driven FinOps
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-700 mb-8"
          >
            Multi-cloud cost optimization for engineering and finance teams
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-accent-600 to-accent-700 
              hover:from-accent-700 hover:to-accent-800 
              text-white font-bold py-5 px-10 rounded-2xl 
              shadow-xl hover:shadow-2xl transition-all duration-300 
              inline-flex items-center gap-3"
          >
            <FaRocket />
            Get Free Assessment
          </motion.button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
            Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-700">Benefits</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl shadow-lg border-2 border-slate-100"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 
                  rounded-xl flex items-center justify-center mb-4">
                  <FaCheckCircle className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Feature {item}</h3>
                <p className="text-gray-600">Description of the benefit</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

### Social Media Icons

```jsx
// LinkedIn
<a 
  href="https://www.linkedin.com/company/c3ops"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-[#0A66C2] hover:bg-[#004182] p-3 rounded-xl text-white 
    transition-all shadow-lg hover:shadow-xl"
>
  <FaLinkedin className="text-2xl" />
</a>

// Instagram
<a 
  href="https://www.instagram.com/finops.c3ops"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] 
    hover:opacity-90 p-3 rounded-xl text-white 
    transition-all shadow-lg hover:shadow-xl"
>
  <FaInstagram className="text-2xl" />
</a>
```

---

## 🚀 IMPLEMENTATION CHECKLIST

### Phase 1: Core Setup
- [ ] Install Tailwind CSS with custom config
- [ ] Add Inter font from Google Fonts
- [ ] Install Framer Motion for animations
- [ ] Add logo SVG files to project
- [ ] Configure theme colors in tailwind.config.js

### Phase 2: Color Migration
- [ ] Replace all primary CTAs with green gradient
- [ ] Update logo to dark green monochrome
- [ ] Change security badges to navy blue
- [ ] Remove orange/yellow/multi-color gradients
- [ ] Update success/savings metrics to green

### Phase 3: Mobile Optimization
- [ ] Add touch target CSS (44px minimum)
- [ ] Configure tap highlight color (green)
- [ ] Set input font-size to 16px (prevent zoom)
- [ ] Add smooth scrolling CSS
- [ ] Test on iOS/Android devices

### Phase 4: SEO & Performance
- [ ] Update meta tags (title, description, theme-color)
- [ ] Add Open Graph tags
- [ ] Configure sitemap.xml
- [ ] Add structured data (schema.org)
- [ ] Optimize images (WebP, lazy loading)

### Phase 5: Accessibility
- [ ] Add focus indicators (green outline)
- [ ] Test keyboard navigation
- [ ] Add ARIA labels
- [ ] Check color contrast (WCAG AA)
- [ ] Add alt text to all images

---

## 📋 QUICK REFERENCE

### Color Usage Summary

| Element | Color | Class |
|---------|-------|-------|
| Primary CTAs | Green | `from-accent-600 to-accent-700` |
| Logo | Dark Green | `#15803d` |
| Security Badges | Navy | `trust-700` or `trust-800` |
| Savings Metrics | Green | `accent-600` |
| Backgrounds | Slate | `slate-50` to `slate-100` |
| Text | Gray/Slate | `gray-700`, `gray-900` |
| Problem Text | Red | `from-red-600 to-orange-600` |
| Solution Text | Green | `from-accent-600 to-accent-700` |

### Responsive Breakpoints

```
sm: 640px   (Mobile landscape, small tablets)
md: 768px   (Tablets)
lg: 1024px  (Desktop)
xl: 1280px  (Large desktop)
```

### Shadow Scale

```
shadow-lg    - Cards
shadow-xl    - Hover states, CTAs
shadow-2xl   - Active/focused CTAs
```

---

## 🎯 BRAND MESSAGING

**Primary Message:** "Save Money on Cloud Costs"  
**Visual Hierarchy:** Green (action/savings) → Navy (trust) → Slate (content)

**Psychology:**
- Green CTAs = "Click to save money" (immediate financial benefit)
- Navy badges = "We're secure and trustworthy" (enterprise credibility)
- Red problems → Green solutions = Emotional journey (pain → relief)

**NEVER:**
- ❌ Use blue for CTAs (dilutes savings message)
- ❌ Use green for security (wrong association)
- ❌ Mix multiple bright colors (unprofessional)
- ❌ Use playful/consumer colors (orange, yellow, pink)

---

## 📞 SUPPORT

**Questions?** Contact: info@c3ops.io  
**Website:** https://www.c3ops.io  
**Application:** https://finops.c3ops.io

---

**Last Updated:** February 22, 2026  
**Maintained by:** C3Ops Technologies Private Limited
