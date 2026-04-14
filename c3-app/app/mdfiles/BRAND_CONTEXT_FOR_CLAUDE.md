# C3Ops Brand Context & Claude Prompts
**Last Updated:** February 2026

---

## 📋 BRAND OVERVIEW

**Company:** C3Ops
**Tagline:** FinOps Driven DevOps
**Websites:** finops.c3ops.io, c3ops.io
**Industry:** Multi-Cloud Cost Optimization & FinOps Platform
**Target Audience:** DevOps Teams, Cloud Architects, Finance & Operations Leaders

---

## 🎨 COLOR PALETTE

### Primary Colors
| Color | Hex Code | Usage |
|-------|----------|-------|
| **Emerald Green** | #15803d | CTAs, Savings, Success, Primary Actions |
| **Light Green** | #22c55e | Secondary CTAs, Highlights |
| **Navy Blue** | #1e40af | Security Badges, Trust Signals, Enterprise |
| **Slate** | #1e293b | Main Text, Dark Backgrounds |

### Secondary Colors
| Color | Hex Code | Usage |
|-------|----------|-------|
| **Teal** | #0891b2 | Cloud Features, Platform Accents (Minimal) |
| **Amber** | #d97706 | Budget Alerts, Warnings |
| **Rose** | #e11d48 | Cost Overruns, Critical Issues |

### Neutral Palette
| Shade | Hex Code | Usage |
|-------|----------|-------|
| **Light Gray** | #f8fafc | Backgrounds |
| **Medium Gray** | #cbd5e1 | Borders, Dividers |
| **Dark Gray** | #475569 | Secondary Text |
| **Black** | #0f172a | Primary Text |

---

## 🔤 TYPOGRAPHY

### Font Family
- **Primary Font:** Inter (Google Fonts)
- **Font Stack:** Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Font Weights Used:** 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 900 (Black)

### Type Scale
| Element | Size | Weight | Use Case |
|---------|------|--------|----------|
| **H1 (Hero)** | 48-72px | Black (900) | Main Page Titles, Deck Covers |
| **H2 (Section)** | 36-48px | Black (900) | Section Headings, Deck Slides |
| **H3 (Subsection)** | 24-28px | Bold (700) | Sub-headings |
| **H4 (Card/Block)** | 18-20px | Bold (700) | Card Titles, List Headers |
| **Body** | 16-18px | Regular (400) | Main Content, Paragraphs |
| **Small** | 12-14px | Regular (400) | Footnotes, Captions |

---

## 🎯 LOGO ASSETS

### Logo Information
- **Primary Logo:** C3Ops (Green Arc with 3 Rising Bars + "Ops" Text)
- **Main Color:** #15803d (Emerald Green 700)
- **Alternative Colors:** White (#ffffff), Navy (#1e40af)
- **Format:** SVG (scalable, recommended)
- **Spacing:** Minimum clear space around logo = 20% of logo height
- **Minimum Size:** 40px height for desktop, 32px for mobile
- **Alt Text:** "C3Ops - FinOps Platform"

### Logo Files Location
- `public/logos/` directory contains various logo variations
- Use dark green version on light backgrounds
- Use white version on dark backgrounds
- Use navy version for special enterprise contexts

---

## 📐 DESIGN SYSTEM GUIDELINES

### Button Styles

**Primary CTA Button:**
- Background: Gradient from #16a34a to #15803d (Green)
- Text Color: White
- Hover: Darker gradient, shadow elevation
- Border Radius: 12px (rounded-xl)
- Padding: 16px 32px
- Font Weight: Bold (700)

**Secondary Button (Outline):**
- Background: Transparent
- Border: 2px solid #16a34a
- Text Color: #16a34a
- Hover: Light green background (#f0fdf4)
- Border Radius: 8px

### Card Components
- Background: White (#ffffff)
- Border: 2px solid #e2e8f0 (Light gray)
- Shadow: Box-shadow: 0 10px 25px rgba(0,0,0,0.1)
- Hover: Slight elevation (y: -5px), shadow increase
- Border Radius: 16px (rounded-2xl)
- Padding: 24-32px

### Background Patterns
- Default: Gradient from #f8fafc (light) to #ffffff (white)
- Section Backgrounds: Light gray or white with subtle gradients
- Dark Sections: Navy (#1e3a8a) with white text
- Accent Backgrounds: Light green (#f0fdf4) for highlights

---

## 💼 BRAND VOICE & MESSAGING

### Tone
- **Professional yet Approachable:** Enterprise-grade but not stuffy
- **Confident:** We solve real FinOps problems
- **Results-Oriented:** Focus on ROI, savings, efficiency
- **Clear:** Avoid jargon without explanation

### Key Messages
1. **Cost Savings:** "Save 30-40% on cloud costs without sacrificing performance"
2. **Visibility:** "Complete multi-cloud visibility and cost breakdown"
3. **Automation:** "Automated optimization and intelligent cost allocation"
4. **Trust:** "Enterprise-grade security (SOC2, ISO 27001, GDPR compliant)"
5. **Ease of Use:** "Implement in hours, not weeks"

### Core Value Propositions
- **FinOps Excellence:** Proven FinOps methodology
- **Multi-Cloud:** AWS, Azure, GCP support
- **Real-Time Intelligence:** Live cost analytics and optimization recommendations
- **Compliance Ready:** Enterprise security standards

---

## 📊 COMMON DESIGN PATTERNS

### Icon Usage
- **Icon Style:** Solid, modern icons (Lucide/Heroicons style)
- **Icon Size:** 24px for body text, 32-48px for cards/sections
- **Icon Colors:** Green (#15803d) for savings, Navy (#1e40af) for security

### Spacing Guidelines
- **Micro:** 4px, 8px (tight spacing)
- **Small:** 16px (component padding)
- **Medium:** 24px (section spacing)
- **Large:** 32-48px (major sections)
- **Extra Large:** 64-80px (between major blocks)

### Corner Radius
- **Buttons:** 8-12px
- **Cards:** 16px
- **Large Sections:** 20-24px
- **Icons/Badges:** 8-12px

---

## 🎁 ASSET SPECIFICATIONS

### Presentation Decks
- **Aspect Ratio:** 16:9 (widescreen)
- **Resolution:** 1920x1080px minimum
- **Format:** PDF or PPTX with brand fonts
- **Slides:** Title, Content, Two-Column, Quote/Testimonial, CTA
- **Color Scheme:** White backgrounds with green/navy accents

### Invoices
- **Paper Size:** A4 (210x297mm) or Letter (8.5x11")
- **Format:** PDF
- **Header:** C3Ops logo, company details
- **Color Elements:** Green accents for logos, borders
- **Font:** Inter for consistency

### Letterheads
- **Paper Size:** A4
- **Header:** Logo (40px height), company name
- **Footer:** Contact info, website, social links
- **Color:** Minimal - mainly logo and thin accent line (green)
- **Margins:** 25.4mm (1 inch) on all sides

### Business Cards
- **Size:** 3.5" × 2" (standard)
- **Resolution:** 300 DPI
- **Format:** PDF or Print-ready CMYK
- **Design:** Logo, name, title, email, phone, website

---

## 📝 CLAUDE PROMPTS FOR DIFFERENT ASSETS

### 1️⃣ PRESENTATION DECK PROMPT

```
Create a professional presentation deck for C3Ops FinOps Platform with the following specifications:

BRAND GUIDELINES:
- Company: C3Ops (FinOps Driven DevOps)
- Primary Color: Emerald Green (#15803d)
- Secondary Color: Navy Blue (#1e40af)
- Accent Colors: Teal (#0891b2), Amber (#d97706), Rose (#e11d48)
- Font: Inter (weights: 400, 600, 700, 900)
- Tone: Professional, results-oriented, clear

SLIDE STRUCTURE (9-12 slides):
1. Title Slide: "[TITLE]" with tagline
2. Problem Statement: Current cloud cost challenges
3. Solution Overview: C3Ops capabilities
4. Key Features: 4 main differentiators with icons
5. Use Cases: Real-world scenarios
6. Case Study/Results: Concrete ROI numbers
7. Security & Compliance: Trust badges
8. Pricing/Plans: [Insert relevant info]
9. Call to Action: Next steps

DESIGN REQUIREMENTS:
- Aspect Ratio: 16:9
- Color Scheme: White backgrounds with green/navy accents
- Layout: Clean, spacious, professional
- Icons: Modern, solid style
- Typography: Clear hierarchy with H1/H2/Body text
- Imagery: High-quality, relevant to cloud/finance/optimization
- CTA Buttons: Emerald green with rounded corners

Please provide the deck in a format I can use to create in PowerPoint/Google Slides with specific:
- Slide layouts (grid, single column, two-column)
- Color codes for all elements
- Font sizes and weights
- Content recommendations for each slide
```

---

### 2️⃣ INVOICE TEMPLATE PROMPT

```
Create a professional invoice template for C3Ops with the following specifications:

COMPANY INFO:
- Name: C3Ops
- Tagline: FinOps Driven DevOps
- Websites: finops.c3ops.io, c3ops.io
- Logo: Green monochrome (#15803d)

DESIGN SPECIFICATIONS:
- Paper Size: A4 (210x297mm) or Letter (8.5x11")
- Format: PDF-ready template (HTML/CSS or Word)
- Margins: 25.4mm (1 inch) on all sides
- Font: Inter
- Color Scheme: White background, green accents for logo/borders

INVOICE SECTIONS:
1. Header: C3Ops logo (40px height), company details
2. Invoice Info: Invoice number, date, due date
3. Bill To: Client name and address
4. Line Items: Description, quantity, rate, amount
5. Subtotal/Tax/Total: Clear breakdown
6. Terms: Payment terms, accepted methods
7. Footer: Website, phone, email, social links

VISUAL ELEMENTS:
- Top accent line or bar in Emerald Green (#15803d)
- Logo position: Top-left
- Company info: Top-right
- Professional, clean layout
- Clear typography hierarchy
- Space for payment instructions

OUTPUT FORMAT:
Provide HTML/CSS code or detailed design specifications for creation in:
- Canva
- Microsoft Word/Excel template
- PDF design software
- Word2PDF conversion
```

---

### 3️⃣ LETTERHEAD TEMPLATE PROMPT

```
Create a professional letterhead template for C3Ops with the following specifications:

COMPANY BRANDING:
- Company: C3Ops
- Tagline: FinOps Driven DevOps
- Primary Color: Emerald Green (#15803d)
- Font: Inter
- Logo: Green monochrome version

LETTERHEAD DESIGN:
- Paper Size: A4 (210x297mm)
- Format: PDF-ready or Word template
- Margins: 25.4mm (1 inch) on all sides

HEADER SECTION:
- Logo: 40px height, top-left position
- Company Name: Bold, 18px, below/beside logo
- Tagline: 12px, light gray, below company name
- Accent Line: Thin horizontal line in green below header

FOOTER SECTION:
- Company Website: finops.c3ops.io, c3ops.io
- Contact Email: [Insert primary email]
- Phone Number: [Insert if available]
- Social Media: [Insert relevant links]
- Footer accent line: Thin green line above footer

LAYOUT:
- Top margin: 38mm (for header space)
- Bottom margin: 25mm (for footer)
- Side margins: 25mm
- Content area: Clean white space for letter content
- Font: Body text 11pt Inter, Regular weight

OUTPUT FORMAT:
Provide design specifications and template for:
- Microsoft Word (.docx)
- Google Docs
- Canva
- PDF template
```

---

### 4️⃣ BUSINESS CARD PROMPT

```
Create a professional business card design for C3Ops executives with the following specifications:

STANDARD SPECIFICATIONS:
- Size: 3.5" × 2" (90mm × 50mm)
- Resolution: 300 DPI
- Format: PDF for print or design file

DESIGN ELEMENTS:
- Logo: C3Ops green monochrome on left side
- Company Name: "C3Ops" in bold
- Tagline: "FinOps Driven DevOps" - small, elegant
- Contact Information:
  - Name (Bold, 11pt)
  - Title (Regular, 9pt)
  - Email (9pt)
  - Phone (9pt)
  - Website (9pt)

COLOR SCHEME:
- Background: Clean white or light gray (#f8fafc)
- Logo/Accents: Emerald Green (#15803d)
- Text: Dark gray/black (#1e293b)
- Optional: Thin green accent line on one edge

TYPOGRAPHY:
- Font: Inter
- Company Name: 16pt Bold
- Name: 11pt Bold
- Title: 9pt Regular
- Contact Details: 8pt Regular

LAYOUT OPTIONS:
Option 1: Logo left, contact info right
Option 2: Logo top-center, contact info below
Option 3: Minimal - logo only, contact on back

OUTPUT FORMAT:
Provide design specifications and template for:
- Canva
- Adobe Illustrator (.ai)
- Print-ready PDF
- InDesign template
```

---

### 5️⃣ EMAIL SIGNATURE PROMPT

```
Create a professional email signature template for C3Ops team members with the following specifications:

COMPANY INFO:
- Company: C3Ops
- Tagline: FinOps Driven DevOps
- Websites: finops.c3ops.io, c3ops.io
- Color: Emerald Green (#15803d)

EMAIL SIGNATURE DESIGN:
- Format: HTML-based email signature
- Font: Inter (fallback: Arial, sans-serif)
- Width: 600px maximum for email clients
- Color Scheme: Minimal design, professional

SIGNATURE SECTIONS:
1. Name: Bold, larger font
2. Title: Regular, slightly smaller
3. Company: "C3Ops" with logo
4. Contact Information:
   - Email: [email]
   - Phone: [phone]
   - Office: [office address]
5. Website Link: finops.c3ops.io
6. Social Media: [Links if desired]
7. Accent: Thin green line separating sections

VISUAL ELEMENTS:
- Logo: 30px height, inline or above
- Color accents: Emerald green for company name/logo only
- Simple, clean layout
- Professional spacing
- Mobile-responsive design

OUTPUT FORMAT:
Provide HTML/CSS code that can be:
- Copied into Gmail signature settings
- Used in Outlook/Thunderbird
- Added to email templates
- Integrated into email marketing platforms

Include instructions for customization per user.
```

---

### 6️⃣ ONE-PAGE COMPANY OVERVIEW PROMPT

```
Create a professional one-page company overview document for C3Ops with the following specifications:

DOCUMENT SPECIFICATIONS:
- Format: PDF or Word (.docx)
- Paper Size: A4 (210x297mm)
- Resolution: 300 DPI for PDF
- Margins: 25.4mm on all sides

CONTENT SECTIONS (organized vertically):
1. Header: Logo, company name, tagline
2. Executive Summary: 2-3 sentence overview
3. The Problem: Current cloud cost challenges (bullet points)
4. The Solution: How C3Ops solves the problem (3-4 key points)
5. Core Features: 4 main capabilities with icons
6. Why Choose C3Ops: 3-5 differentiators
7. Key Metrics/Benefits: ROI numbers, case study highlights
8. Contact Information: Email, website, call to action

DESIGN ELEMENTS:
- Color Scheme: White background, green/navy accents
- Icons: Modern, solid style for features/benefits
- Typography: Clear hierarchy (H2 for sections, body text)
- Visual Balance: Text and whitespace
- Logo: Top-left, 40px height
- Graphics: Optional relevant imagery

TYPOGRAPHY:
- Font: Inter
- H2 Sections: 20pt, Bold (#15803d)
- Body: 11pt, Regular (#1e293b)
- Highlights: Green accent color

OUTPUT FORMAT:
Provide design specifications and template for:
- Canva
- Microsoft Word (.docx)
- Google Docs
- PDF design software (Figma, Adobe)
```

---

### 7️⃣ PROPOSAL/QUOTE TEMPLATE PROMPT

```
Create a professional proposal/quote template for C3Ops services with the following specifications:

DOCUMENT INFO:
- Company: C3Ops
- Type: Service Proposal / Quote
- Format: PDF or Word template
- Paper Size: A4
- Margins: 25.4mm (1 inch)

PROPOSAL STRUCTURE:
1. Cover Page:
   - C3Ops logo and company name
   - Proposal title
   - Client name and date
   - Proposal number

2. Executive Summary:
   - Brief overview of proposed solution
   - Expected benefits

3. Situation Analysis:
   - Client's current challenges
   - Cost analysis/benchmarking

4. Proposed Solution:
   - Detailed approach
   - Timeline/implementation phases
   - Deliverables

5. Investment:
   - Pricing breakdown
   - ROI projection
   - Payment terms

6. Why C3Ops:
   - Team credentials
   - Case studies
   - Certifications/trust badges

7. Next Steps/Call to Action:
   - Contact information
   - Timeline for decision

DESIGN SPECIFICATIONS:
- Color Scheme: White background, green/navy accents
- Logo: 40px in header
- Accent Line: Green horizontal divider between sections
- Typography: Clear hierarchy with H2 section headers
- Format: Professional, corporate style
- Page Numbers: Bottom center
- Header/Footer: C3Ops branding

ELEMENTS:
- Icon boxes for benefits
- Tables for pricing
- Green highlight boxes for key metrics
- White space for readability

OUTPUT FORMAT:
Provide template specifications for:
- Microsoft Word (.docx)
- Google Docs
- PDF design tool
- Canva
```

---

## 📋 ASSET CREATION CHECKLIST

When creating any new asset, ensure you include:

- [ ] C3Ops logo (appropriate color variant)
- [ ] Correct primary colors (Emerald Green #15803d, Navy #1e40af)
- [ ] Inter font family (or specified fallback)
- [ ] Professional, clean layout
- [ ] Clear call-to-action buttons (green gradient)
- [ ] Proper spacing and alignment
- [ ] Company tagline "FinOps Driven DevOps" where appropriate
- [ ] Contact information/website (finops.c3ops.io)
- [ ] Mobile-responsive (if applicable)
- [ ] Accessible color contrast ratios
- [ ] Consistent typography hierarchy
- [ ] Professional imagery/icons

---

## 🔗 LOGO ASSETS LOCATION

All logo files are stored in: `/public/logos/`

**Available Variations:**
- Dark Green (primary)
- White version
- Navy version
- Full logo with text
- Icon-only version
- Various formats (PNG, SVG, JPEG)

---

## 📞 BRAND CONTACT & CONSISTENCY

**Brand Manager:** C3Ops Team
**Last Updated:** February 2026
**Version:** 2.0

For questions about brand implementation or to request new assets, refer to the C3OPS_DESIGN_SYSTEM.md documentation.

---

## 💡 QUICK REFERENCE: COLOR HEX CODES

```
Primary Green: #15803d
Bright Green: #22c55e
Light Green (Background): #f0fdf4
Navy: #1e40af
Teal: #0891b2
Amber: #d97706
Rose: #e11d48
Light Gray (BG): #f8fafc
Dark Text: #1e293b
Medium Text: #475569
Borders: #cbd5e1
```

---

## 🎨 FONT IMPORT CODE

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

**CSS Usage:**
```css
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

---

## 📊 SUMMARY TABLE

| Asset | Dimensions | Format | Key Elements |
|-------|-----------|--------|--------------|
| **Presentation Deck** | 1920x1080px (16:9) | PPTX/PDF | Logo, green accents, typography |
| **Invoice** | A4/Letter | PDF | Header with logo, line items, footer |
| **Letterhead** | A4 | PDF/Word | Logo, header, footer, accent lines |
| **Business Card** | 3.5"x2" (300 DPI) | PDF | Logo, contact info, minimal accents |
| **Email Signature** | 600px width | HTML | Name, title, company, contact, logo |
| **Company Overview** | A4 | PDF/Word | Logo, sections, icons, color accents |
| **Proposal Template** | A4 | PDF/Word | Multi-section, pricing, CTA, branding |

---

**Happy creating! Use these prompts with Claude to generate professional brand-aligned assets.**
