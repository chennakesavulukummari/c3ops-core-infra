#!/usr/bin/env python3
"""
Generate PNG social media profiles using EXACT SVG from HTML - NO modifications
"""

import subprocess
from pathlib import Path

output_dir = Path("public/logos/social-media-profiles")
output_dir.mkdir(parents=True, exist_ok=True)

# Exact SVG definitions from the HTML file - UNCHANGED
profiles = {
    "instagram-profile-1080x1080": {
        "width": 1080,
        "height": 1080,
        "bg": "#006600",
        "stroke": "#FFFFFF",
        "include_text": True,
    },
    "instagram-profile-gold-1080x1080": {
        "width": 1080,
        "height": 1080,
        "bg": "#EAB308",
        "stroke": "#0F172A",
        "include_text": True,
    },
    "linkedin-profile-400x400": {
        "width": 400,
        "height": 400,
        "bg": "#006600",
        "stroke": "#FFFFFF",
        "include_text": True,
    },
    "linkedin-banner-1200x627": {
        "width": 1200,
        "height": 627,
        "bg": "#006600",
        "stroke": "#FFFFFF",
        "include_text": True,
    },
    "whatsapp-profile-540x540": {
        "width": 540,
        "height": 540,
        "bg": "#006600",
        "stroke": "#FFFFFF",
        "include_text": True,
    },
    "whatsapp-profile-icon-192x192": {
        "width": 192,
        "height": 192,
        "bg": "#006600",
        "stroke": "#FFFFFF",
        "include_text": False,
    },
}

def generate_svg(config):
    """Generate SVG with EXACT logo from HTML file - matching HTML display exactly"""
    width = config["width"]
    height = config["height"]
    bg = config["bg"]
    stroke = config["stroke"]
    include_text = config["include_text"]
    
    # HTML viewBox is "14 0 186 70" - maintain exact proportions
    # Calculate proper scale to fit the canvas while keeping logo visible
    
    if include_text:
        # For logos with text, use same viewBox dimensions with proper padding
        scale_factor = min((width * 0.8) / 186, (height * 0.7) / 70)
        x_center = (width - 186 * scale_factor) / 2
        y_center = (height - 70 * scale_factor) / 2
    else:
        # For icon-only versions, scale larger
        scale_factor = min(width / 186, height / 70) * 0.9
        x_center = (width - 186 * scale_factor) / 2
        y_center = (height - 70 * scale_factor) / 2
    
    svg = f'''<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="{width}" height="{height}" fill="{bg}"/>
    <g transform="translate({x_center}, {y_center}) scale({scale_factor})">
        <path d="M46 12C28 12 14 28 14 44C14 60 28 76 46 76" stroke="{stroke}" stroke-width="5" stroke-linecap="round" fill="none"/>
        <rect x="28" y="48" width="7" height="10" rx="3.5" fill="{stroke}"/>
        <rect x="39" y="36" width="7" height="22" rx="3.5" fill="{stroke}"/>
        <rect x="50" y="26" width="7" height="32" rx="3.5" fill="{stroke}"/>
        {f'<text x="70" y="52" font-family="system-ui, sans-serif" font-size="42" font-weight="700" fill="{stroke}">C3Ops</text>' if include_text else ''}
    </g>
</svg>'''
    return svg

print("Regenerating PNG files with EXACT logo (open C - not complete circle)...")
print()

for name, config in profiles.items():
    svg_path = output_dir / f"{name}.svg"
    png_path = output_dir / f"{name}.png"
    
    # Generate and save SVG
    svg_content = generate_svg(config)
    with open(svg_path, 'w') as f:
        f.write(svg_content)
    
    # Convert to PNG
    cmd = [
        'convert',
        '-density', '200',
        '-background', 'none',
        str(svg_path),
        str(png_path)
    ]
    
    result = subprocess.run(cmd, capture_output=True, timeout=30)
    
    if png_path.exists():
        size = png_path.stat().st_size
        print(f"✓ {name}.png ({config['width']}×{config['height']}) - {size//1024}KB")
    else:
        print(f"✗ Failed: {name}.png")

print()
print("✅ PNG regenerated with EXACT logo (open C curve)!")
