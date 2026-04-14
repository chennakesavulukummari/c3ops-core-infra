#!/usr/bin/env python3
"""
C3Ops Social Media Profile PNG Generator
Generates PNG files directly from the correct logo design
"""

import os
import subprocess
from pathlib import Path

# Output directory
output_dir = Path("public/logos/social-media-profiles")
output_dir.mkdir(parents=True, exist_ok=True)

# SVG templates using the correct logo path from the HTML file
profiles = {
    "instagram-profile-1080x1080": {
        "width": 1080,
        "height": 1080,
        "svg": '''<svg viewBox="0 0 1080 1080" width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
            <rect width="1080" height="1080" fill="#006600"/>
            <g transform="translate(150, 280) scale(4.5)">
                <path d="M46 12C28 12 14 28 14 44C14 60 28 76 46 76" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none"/>
                <rect x="28" y="48" width="7" height="10" rx="3.5" fill="#FFFFFF"/>
                <rect x="39" y="36" width="7" height="22" rx="3.5" fill="#FFFFFF"/>
                <rect x="50" y="26" width="7" height="32" rx="3.5" fill="#FFFFFF"/>
                <text x="70" y="52" font-family="system-ui, sans-serif" font-size="42" font-weight="700" fill="#FFFFFF">C3Ops</text>
            </g>
        </svg>'''
    },
    "instagram-profile-gold-1080x1080": {
        "width": 1080,
        "height": 1080,
        "svg": '''<svg viewBox="0 0 1080 1080" width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#EAB308;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#d99e00;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="1080" height="1080" fill="url(#goldGrad)"/>
            <g transform="translate(150, 280) scale(4.5)">
                <path d="M46 12C28 12 14 28 14 44C14 60 28 76 46 76" stroke="#0F172A" stroke-width="5" stroke-linecap="round" fill="none"/>
                <rect x="28" y="48" width="7" height="10" rx="3.5" fill="#0F172A"/>
                <rect x="39" y="36" width="7" height="22" rx="3.5" fill="#0F172A"/>
                <rect x="50" y="26" width="7" height="32" rx="3.5" fill="#0F172A"/>
                <text x="70" y="52" font-family="system-ui, sans-serif" font-size="42" font-weight="700" fill="#0F172A">C3Ops</text>
            </g>
        </svg>'''
    },
    "linkedin-profile-400x400": {
        "width": 400,
        "height": 400,
        "svg": '''<svg viewBox="0 0 400 400" width="400" height="400" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="400" fill="#006600"/>
            <g transform="translate(60, 120) scale(3)">
                <path d="M46 12C28 12 14 28 14 44C14 60 28 76 46 76" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none"/>
                <rect x="28" y="48" width="7" height="10" rx="3.5" fill="#FFFFFF"/>
                <rect x="39" y="36" width="7" height="22" rx="3.5" fill="#FFFFFF"/>
                <rect x="50" y="26" width="7" height="32" rx="3.5" fill="#FFFFFF"/>
                <text x="70" y="52" font-family="system-ui, sans-serif" font-size="42" font-weight="700" fill="#FFFFFF">C3Ops</text>
            </g>
        </svg>'''
    },
    "linkedin-banner-1200x627": {
        "width": 1200,
        "height": 627,
        "svg": '''<svg viewBox="0 0 1200 627" width="1200" height="627" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#006600;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#004d00;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="1200" height="627" fill="url(#greenGrad)"/>
            <g transform="translate(40, 140) scale(2.8)">
                <path d="M46 12C28 12 14 28 14 44C14 60 28 76 46 76" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none"/>
                <rect x="28" y="48" width="7" height="10" rx="3.5" fill="#FFFFFF"/>
                <rect x="39" y="36" width="7" height="22" rx="3.5" fill="#FFFFFF"/>
                <rect x="50" y="26" width="7" height="32" rx="3.5" fill="#FFFFFF"/>
                <text x="70" y="52" font-family="system-ui, sans-serif" font-size="42" font-weight="700" fill="#FFFFFF">C3Ops</text>
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
        "svg": '''<svg viewBox="0 0 540 540" width="540" height="540" xmlns="http://www.w3.org/2000/svg">
            <rect width="540" height="540" fill="#006600"/>
            <g transform="translate(110, 220) scale(3.5)">
                <path d="M46 12C28 12 14 28 14 44C14 60 28 76 46 76" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none"/>
                <rect x="28" y="48" width="7" height="10" rx="3.5" fill="#FFFFFF"/>
                <rect x="39" y="36" width="7" height="22" rx="3.5" fill="#FFFFFF"/>
                <rect x="50" y="26" width="7" height="32" rx="3.5" fill="#FFFFFF"/>
                <text x="70" y="52" font-family="system-ui, sans-serif" font-size="42" font-weight="700" fill="#FFFFFF">C3Ops</text>
            </g>
        </svg>'''
    },
    "whatsapp-profile-icon-192x192": {
        "width": 192,
        "height": 192,
        "svg": '''<svg viewBox="0 0 192 192" width="192" height="192" xmlns="http://www.w3.org/2000/svg">
            <rect width="192" height="192" fill="#006600" rx="48"/>
            <g transform="translate(35, 75) scale(2.2)">
                <path d="M46 12C28 12 14 28 14 44C14 60 28 76 46 76" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none"/>
                <rect x="28" y="48" width="7" height="10" rx="3.5" fill="#FFFFFF"/>
                <rect x="39" y="36" width="7" height="22" rx="3.5" fill="#FFFFFF"/>
                <rect x="50" y="26" width="7" height="32" rx="3.5" fill="#FFFFFF"/>
            </g>
        </svg>'''
    }
}

print("C3Ops Social Media Profile PNG Generator")
print("=" * 50)
print(f"Output directory: {output_dir}")
print()

# First, save SVG files
svg_files = {}
for name, config in profiles.items():
    svg_path = output_dir / f"{name}.svg"
    with open(svg_path, 'w') as f:
        f.write(config['svg'])
    svg_files[name] = svg_path
    print(f"✓ Created SVG: {name}.svg ({config['width']}x{config['height']})")

print()
print("Converting SVG to PNG...")
print()

# Try to convert SVGs to PNG using available tools
png_count = 0
for name, svg_path in svg_files.items():
    png_path = output_dir / f"{name}.png"
    
    # Try cairosvg first
    try:
        import cairosvg
        config = profiles[name]
        cairosvg.svg2png(
            url=str(svg_path),
            write_to=str(png_path),
            output_width=config['width'],
            output_height=config['height']
        )
        print(f"✓ Created PNG (cairosvg): {name}.png")
        png_count += 1
    except ImportError:
        # Try ImageMagick convert
        try:
            result = subprocess.run(
                ['convert', '-density', '300', str(svg_path), str(png_path)],
                capture_output=True,
                text=True,
                timeout=10
            )
            if result.returncode == 0:
                print(f"✓ Created PNG (ImageMagick): {name}.png")
                png_count += 1
            else:
                print(f"⚠ ImageMagick conversion failed: {name}.png")
        except (FileNotFoundError, subprocess.TimeoutExpired):
            # Try Inkscape
            try:
                config = profiles[name]
                result = subprocess.run(
                    ['inkscape', '--export-filename', str(png_path), 
                     f'--export-width={config["width"]}',
                     f'--export-height={config["height"]}',
                     str(svg_path)],
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                if result.returncode == 0:
                    print(f"✓ Created PNG (Inkscape): {name}.png")
                    png_count += 1
                else:
                    print(f"⚠ Inkscape conversion failed: {name}.png")
            except (FileNotFoundError, subprocess.TimeoutExpired):
                print(f"⚠ Could not convert {name}.svg - no conversion tool available")

print()
if png_count > 0:
    print(f"✅ Successfully created {png_count} PNG files!")
else:
    print("⚠ PNG conversion tool not found. SVG files are ready.")
    print()
    print("Install conversion tool to generate PNGs:")
    print("  • pip install cairosvg")
    print("  • brew install imagemagick")
    print("  • brew install inkscape")

print()
print(f"Files saved to: {output_dir}")
