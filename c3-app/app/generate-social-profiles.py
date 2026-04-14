#!/usr/bin/env python3
"""
C3Ops Social Media Profile Image Generator
Generates profile pictures for Instagram, LinkedIn, and WhatsApp
"""

import subprocess
import os
from pathlib import Path

# Output directory
output_dir = Path("public/logos/social-media-profiles")
output_dir.mkdir(parents=True, exist_ok=True)

# SVG templates with dimensions
profiles = {
    "instagram-profile-1080x1080": {
        "width": 1080,
        "height": 1080,
        "svg": '''<svg viewBox="0 0 1080 1080" width="1080" height="1080" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="1080" height="1080" fill="#006600"/>
            <g transform="translate(270, 360) scale(3.5)">
                <path d="M20 8C12.268 8 6 14.268 6 22C6 29.732 12.268 36 20 36" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <rect x="13" y="26" width="4" height="6" rx="2" fill="#FFFFFF"/>
                <rect x="19" y="20" width="4" height="12" rx="2" fill="#FFFFFF"/>
                <rect x="25" y="16" width="4" height="16" rx="2" fill="#FFFFFF"/>
            </g>
            <text x="540" y="750" font-family="system-ui, sans-serif" font-size="120" font-weight="700" fill="#FFFFFF" text-anchor="middle">C3Ops</text>
        </svg>'''
    },
    "instagram-profile-gold-1080x1080": {
        "width": 1080,
        "height": 1080,
        "svg": '''<svg viewBox="0 0 1080 1080" width="1080" height="1080" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#EAB308;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#d99e00;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="1080" height="1080" fill="url(#goldGrad)"/>
            <g transform="translate(270, 360) scale(3.5)">
                <path d="M20 8C12.268 8 6 14.268 6 22C6 29.732 12.268 36 20 36" stroke="#0F172A" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <rect x="13" y="26" width="4" height="6" rx="2" fill="#0F172A"/>
                <rect x="19" y="20" width="4" height="12" rx="2" fill="#0F172A"/>
                <rect x="25" y="16" width="4" height="16" rx="2" fill="#0F172A"/>
            </g>
            <text x="540" y="750" font-family="system-ui, sans-serif" font-size="120" font-weight="700" fill="#0F172A" text-anchor="middle">C3Ops</text>
        </svg>'''
    },
    "linkedin-profile-400x400": {
        "width": 400,
        "height": 400,
        "svg": '''<svg viewBox="0 0 400 400" width="400" height="400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="400" fill="#006600"/>
            <g transform="translate(100, 130) scale(2.8)">
                <path d="M20 8C12.268 8 6 14.268 6 22C6 29.732 12.268 36 20 36" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <rect x="13" y="26" width="4" height="6" rx="2" fill="#FFFFFF"/>
                <rect x="19" y="20" width="4" height="12" rx="2" fill="#FFFFFF"/>
                <rect x="25" y="16" width="4" height="16" rx="2" fill="#FFFFFF"/>
            </g>
            <text x="200" y="290" font-family="system-ui, sans-serif" font-size="80" font-weight="700" fill="#FFFFFF" text-anchor="middle">C3Ops</text>
        </svg>'''
    },
    "linkedin-banner-1200x627": {
        "width": 1200,
        "height": 627,
        "svg": '''<svg viewBox="0 0 1200 627" width="1200" height="627" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#006600;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#004d00;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="1200" height="627" fill="url(#greenGrad)"/>
            <g transform="translate(60, 160) scale(2.2)">
                <path d="M20 8C12.268 8 6 14.268 6 22C6 29.732 12.268 36 20 36" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <rect x="13" y="26" width="4" height="6" rx="2" fill="#FFFFFF"/>
                <rect x="19" y="20" width="4" height="12" rx="2" fill="#FFFFFF"/>
                <rect x="25" y="16" width="4" height="16" rx="2" fill="#FFFFFF"/>
            </g>
            <text x="600" y="290" font-family="system-ui, sans-serif" font-size="52" font-weight="700" fill="#FFFFFF" text-anchor="middle">
                Cloud FinOps Mastery
            </text>
            <text x="600" y="350" font-family="system-ui, sans-serif" font-size="28" font-weight="400" fill="#EAB308" text-anchor="middle">
                Optimize • Control • Scale
            </text>
            <circle cx="1050" cy="150" r="80" fill="#EAB308" opacity="0.3"/>
            <circle cx="1100" cy="480" r="100" fill="#EAB308" opacity="0.2"/>
        </svg>'''
    },
    "whatsapp-profile-540x540": {
        "width": 540,
        "height": 540,
        "svg": '''<svg viewBox="0 0 540 540" width="540" height="540" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="540" height="540" fill="#006600"/>
            <g transform="translate(150, 150) scale(2.8)">
                <path d="M20 8C12.268 8 6 14.268 6 22C6 29.732 12.268 36 20 36" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <rect x="13" y="26" width="4" height="6" rx="2" fill="#FFFFFF"/>
                <rect x="19" y="20" width="4" height="12" rx="2" fill="#FFFFFF"/>
                <rect x="25" y="16" width="4" height="16" rx="2" fill="#FFFFFF"/>
            </g>
            <text x="270" y="380" font-family="system-ui, sans-serif" font-size="90" font-weight="700" fill="#FFFFFF" text-anchor="middle">C3Ops</text>
        </svg>'''
    },
    "whatsapp-profile-icon-192x192": {
        "width": 192,
        "height": 192,
        "svg": '''<svg viewBox="0 0 192 192" width="192" height="192" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="192" height="192" fill="#006600" rx="48"/>
            <g transform="translate(50, 50) scale(2.4)">
                <path d="M20 8C12.268 8 6 14.268 6 22C6 29.732 12.268 36 20 36" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <rect x="13" y="26" width="4" height="6" rx="2" fill="#FFFFFF"/>
                <rect x="19" y="20" width="4" height="12" rx="2" fill="#FFFFFF"/>
                <rect x="25" y="16" width="4" height="16" rx="2" fill="#FFFFFF"/>
            </g>
        </svg>'''
    }
}

print("C3Ops Social Media Profile Generator")
print("=" * 50)
print(f"Output directory: {output_dir}")
print()

# Save SVG files
svg_count = 0
for name, config in profiles.items():
    svg_path = output_dir / f"{name}.svg"
    with open(svg_path, 'w') as f:
        f.write(config['svg'])
    print(f"✓ Created: {name}.svg ({config['width']}x{config['height']})")
    svg_count += 1

print()
print(f"Total SVG files created: {svg_count}")
print()
print("Note: SVG files are ready for web use!")
print("To convert to PNG/JPG, use:")
print("  - Online: https://convertio.co/svg-png/")
print("  - CLI: cairosvg, ImageMagick, or Inkscape")
print("  - Browser: Right-click → Save image as PNG")
print()
print("Files saved to: public/logos/social-media-profiles/")
