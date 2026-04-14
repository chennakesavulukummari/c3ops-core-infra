# C3Ops Social Media Profile Images - Quick Reference

## Files Created

All files are located in: `public/logos/social-media-profiles/`

### Instagram

| File | Dimensions | Format | Usage |
|------|-----------|--------|-------|
| `instagram-profile-1080x1080.svg` | 1080×1080px | SVG | Green profile picture |
| `instagram-profile-gold-1080x1080.svg` | 1080×1080px | SVG | Gold/premium variant |

**Best Practice:** Use the green version for brand consistency. Gold version works well for special campaigns.

---

### LinkedIn

| File | Dimensions | Format | Usage |
|------|-----------|--------|-------|
| `linkedin-profile-400x400.svg` | 400×400px | SVG | Profile picture |
| `linkedin-banner-1200x627.svg` | 1200×627px | SVG | Cover banner with tagline |

**Best Practice:** Use profile pic (400x400) for personal/company profile, and banner (1200x627) for company page header.

---

### WhatsApp

| File | Dimensions | Format | Usage |
|------|-----------|--------|-------|
| `whatsapp-profile-540x540.svg` | 540×540px | SVG | Full profile picture |
| `whatsapp-profile-icon-192x192.svg` | 192×192px | SVG | Minimal icon variant |

**Best Practice:** Use 540×540 for full logo display, 192×192 for minimal/compact appearance.

---

## How to Use

### Option 1: Web Display
- Use SVG files directly in HTML/CSS
- Link to the files: `/logos/social-media-profiles/filename.svg`
- SVG scales perfectly at any size

### Option 2: Download as PNG/JPG
Use one of these methods to convert SVG to image format:

**Browser Method:**
1. Open `public/logos/social-media-profiles.html` in browser
2. Right-click on preview image
3. Select "Save image as..."
4. Save as PNG or JPG

**Online Conversion:**
- Visit https://convertio.co/svg-png/
- Upload SVG file
- Download as PNG/JPG

**CLI Tools:**
```bash
# Using cairosvg (install: pip install cairosvg)
cairosvg instagram-profile-1080x1080.svg -o instagram-profile-1080x1080.png

# Using ImageMagick (install: brew install imagemagick)
convert -density 300 instagram-profile-1080x1080.svg instagram-profile-1080x1080.png

# Using Inkscape
inkscape --export-filename=instagram-profile-1080x1080.png instagram-profile-1080x1080.svg
```

---

## Upload Instructions

### Instagram
1. Go to Settings → Edit Profile
2. Click on profile picture
3. Choose "Change profile picture" → "Upload photo"
4. Select `instagram-profile-1080x1080.svg` (converted to PNG)
5. Crop to circle if needed
6. Save

### LinkedIn (Company Page)
**Profile Picture:**
1. Settings & Privacy → Profile settings
2. Click profile photo
3. Upload `linkedin-profile-400x400.svg` (as PNG)

**Cover Banner:**
1. Visit company page → Edit
2. Click banner area
3. Upload `linkedin-banner-1200x627.svg` (as PNG)

### WhatsApp
1. Open WhatsApp
2. Go to Settings → Profile
3. Tap current profile picture
4. Select camera/gallery icon
5. Choose `whatsapp-profile-540x540.svg` (as PNG)
6. Crop to circle
7. Confirm

---

## Brand Colors Reference

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Green | #006600 | Main background, logo strokes |
| Gold Accent | #EAB308 | Highlights, secondary elements |
| Dark Background | #0F172A | Text on gold backgrounds |
| White | #FFFFFF | Text/graphics on dark backgrounds |

---

## File Specifications

### All Variants Include:
- ✅ C3Ops logo (curved bracket + bar chart)
- ✅ C3Ops text (where applicable)
- ✅ Optimized for each platform
- ✅ Proper aspect ratios
- ✅ Clear, crisp graphics
- ✅ Professional branding

### Technical Details:
- **Format:** Scalable Vector Graphics (SVG)
- **Resolution:** Vector-based (scales infinitely)
- **Transparency:** Full support where needed
- **File Size:** 648B - 1.6KB per file

---

## Quick Checklist

- [ ] Download/generate PNG versions from SVG files
- [ ] Upload Instagram profile picture (1080×1080)
- [ ] Upload LinkedIn profile picture (400×400)
- [ ] Upload LinkedIn cover banner (1200×627)
- [ ] Upload WhatsApp profile picture (540×540)
- [ ] Test across platforms for proper display
- [ ] Keep social media profiles consistent

---

## Support Files

- **Preview HTML:** `public/logos/social-media-profiles.html`
- **Generator Script:** `generate-social-profiles.py`
- **SVG Files Directory:** `public/logos/social-media-profiles/`

---

**Generated:** April 5, 2026
**For:** C3Ops FinOps Platform
**Brand:** Professional Cloud FinOps Solutions
