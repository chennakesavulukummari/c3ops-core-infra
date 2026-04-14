#!/usr/bin/env python3
"""
Generate PNG files from CRM logo SVG code
"""

import subprocess
from pathlib import Path

output_dir = Path("public/logos/crm-social-media-profiles")
output_dir.mkdir(parents=True, exist_ok=True)

# Exact SVG code from user - UNCHANGED
profiles = {
    "crm-green-logo-icon": {
        "width": 1080,
        "height": 1080,
        "bg": "#FFFFFF",
        "stroke": "#006600",
        "description": "Green logo on white"
    },
    "crm-white-logo-icon": {
        "width": 1080,
        "height": 1080,
        "bg": "#006600",
        "stroke": "#FFFFFF",
        "description": "White logo on green"
    },
    "crm-green-logo-instagram": {
        "width": 1080,
        "height": 1080,
        "bg": "#FFFFFF",
        "stroke": "#006600",
        "description": "Instagram profile"
    },
    "crm-white-logo-instagram": {
        "width": 1080,
        "height": 1080,
        "bg": "#006600",
        "stroke": "#FFFFFF",
        "description": "Instagram profile alt"
    },
    "crm-green-logo-linkedin": {
        "width": 400,
        "height": 400,
        "bg": "#FFFFFF",
        "stroke": "#006600",
        "description": "LinkedIn profile"
    },
    "crm-white-logo-linkedin": {
        "width": 400,
        "height": 400,
        "bg": "#006600",
        "stroke": "#FFFFFF",
        "description": "LinkedIn profile alt"
    },
    "crm-green-logo-linkedin-banner": {
        "width": 1200,
        "height": 627,
        "bg": "#FFFFFF",
        "stroke": "#006600",
        "description": "LinkedIn banner"
    },
    "crm-white-logo-linkedin-banner": {
        "width": 1200,
        "height": 627,
        "bg": "#006600",
        "stroke": "#FFFFFF",
        "description": "LinkedIn banner alt"
    },
    "crm-green-logo-whatsapp": {
        "width": 540,
        "height": 540,
        "bg": "#FFFFFF",
        "stroke": "#006600",
        "description": "WhatsApp profile"
    },
    "crm-white-logo-whatsapp": {
        "width": 540,
        "height": 540,
        "bg": "#006600",
        "stroke": "#FFFFFF",
        "description": "WhatsApp profile alt"
    },
    "crm-green-logo-whatsapp-icon": {
        "width": 192,
        "height": 192,
        "bg": "#FFFFFF",
        "stroke": "#006600",
        "description": "WhatsApp icon"
    },
    "crm-white-logo-whatsapp-icon": {
        "width": 192,
        "height": 192,
        "bg": "#006600",
        "stroke": "#FFFFFF",
        "description": "WhatsApp icon alt"
    },
}

def generate_svg(width, height, bg, stroke):
    """Generate SVG from exact code provided"""
    # HTML viewBox is "14 0 186 70"
    scale_factor = min((width * 0.85) / 186, (height * 0.85) / 70)
    x_center = (width - 186 * scale_factor) / 2
    y_center = (height - 70 * scale_factor) / 2
    
    svg = f'''<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="{width}" height="{height}" fill="{bg}"/>
    <g transform="translate({x_center}, {y_center}) scale({scale_factor})">
        <path d="M46 12C28 12 14 28 14 44C14 60 28 76 46 76" stroke="{stroke}" stroke-width="5" stroke-linecap="round" fill="none"/>
        <rect x="28" y="48" width="7" height="10" rx="3.5" fill="{stroke}"/>
        <rect x="39" y="36" width="7" height="22" rx="3.5" fill="{stroke}"/>
        <rect x="50" y="26" width="7" height="32" rx="3.5" fill="{stroke}"/>
    </g>
</svg>'''
    return svg

print("Generating CRM logo PNG files...")
print()

for name, config in profiles.items():
    svg_path = output_dir / f"{name}.svg"
    png_path = output_dir / f"{name}.png"
    
    # Generate SVG
    svg_content = generate_svg(config["width"], config["height"], config["bg"], config["stroke"])
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
print("✅ All CRM PNG files generated!")
print(f"Location: {output_dir}")
