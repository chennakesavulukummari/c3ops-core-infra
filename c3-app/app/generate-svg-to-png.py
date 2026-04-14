#!/usr/bin/env python3
import subprocess
import os
import tempfile
import re
from pathlib import Path

# SVG source files
svgs = {
    'c3ops-icon-light.svg': 'public/c3ops-icon-light.svg',
    'c3ops-logo-full-dark.svg': 'public/c3ops-logo-full-dark.svg',
    'c3ops-logo-full-light.svg': 'public/c3ops-logo-full-light.svg'
}

# Output configurations for each SVG
# Format: output_name -> (width, height, description)
output_configs = {
    'c3ops-icon-light.svg': [
        ('c3ops-icon-light-192x192.png', 192, 192, 'Icon 192x192'),
        ('c3ops-icon-light-256x256.png', 256, 256, 'Icon 256x256'),
        ('c3ops-icon-light-512x512.png', 512, 512, 'Icon 512x512'),
    ],
    'c3ops-logo-full-dark.svg': [
        ('c3ops-logo-full-dark-400x113.png', 400, 113, 'Logo 400x113'),
        ('c3ops-logo-full-dark-600x169.png', 600, 169, 'Logo 600x169'),
        ('c3ops-logo-full-dark-1000x282.png', 1000, 282, 'Logo 1000x282'),
    ],
    'c3ops-logo-full-light.svg': [
        ('c3ops-logo-full-light-400x113.png', 400, 113, 'Logo 400x113'),
        ('c3ops-logo-full-light-600x169.png', 600, 169, 'Logo 600x169'),
        ('c3ops-logo-full-light-1000x282.png', 1000, 282, 'Logo 1000x282'),
    ],
}

def remove_text_from_svg(svg_path):
    """Remove text elements from SVG to avoid font rendering issues"""
    with open(svg_path, 'r') as f:
        content = f.read()
    
    # Remove text elements
    content = re.sub(r'<text[^>]*>.*?</text>', '', content, flags=re.DOTALL)
    
    return content

# Ensure output directory exists
output_dir = Path('public/logos/svg-to-png')
output_dir.mkdir(parents=True, exist_ok=True)

print(f"📁 Output directory: {output_dir}\n")

# Generate PNGs from SVGs
success_count = 0
for svg_filename, svg_path in svgs.items():
    if svg_filename not in output_configs:
        continue
    
    print(f"🔄 Processing: {svg_filename}")
    
    # Read and process SVG
    try:
        with open(svg_path, 'r') as f:
            svg_content = f.read()
    except Exception as e:
        print(f"  ✗ Failed to read {svg_filename}: {str(e)}")
        continue
    
    # Remove text elements if they exist
    svg_content_no_text = remove_text_from_svg(svg_path)
    
    # Create temporary SVG file without text
    with tempfile.NamedTemporaryFile(mode='w', suffix='.svg', delete=False) as tmp:
        tmp.write(svg_content_no_text)
        tmp_path = tmp.name
    
    try:
        for output_name, width, height, description in output_configs[svg_filename]:
            output_path = output_dir / output_name
            
            try:
                # Use ImageMagick convert command with high quality settings
                cmd = [
                    'convert',
                    '-density', '300',
                    '-background', 'none',
                    tmp_path,
                    '-resize', f'{width}x{height}',
                    '-extent', f'{width}x{height}',
                    '-gravity', 'center',
                    str(output_path)
                ]
                
                subprocess.run(cmd, check=True, capture_output=True)
                file_size = output_path.stat().st_size / 1024  # Size in KB
                print(f"  ✓ {output_name} ({width}×{height}) - {file_size:.1f}KB - {description}")
                success_count += 1
                
            except subprocess.CalledProcessError as e:
                print(f"  ✗ Failed to generate {output_name}: {e.stderr.decode()}")
            except Exception as e:
                print(f"  ✗ Error generating {output_name}: {str(e)}")
    finally:
        # Clean up temporary file
        os.unlink(tmp_path)

print(f"\n✅ Generated {success_count}/{len([c for configs in output_configs.values() for c in configs])} PNG files")
print(f"📍 Location: {output_dir}")
