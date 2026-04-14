#!/usr/bin/env python3
"""Extract text from C3Ops PDF deck"""

from pypdf import PdfReader

def extract_pdf_text(pdf_path):
    """Extract all text from PDF file"""
    reader = PdfReader(pdf_path)
    
    print(f"PDF has {len(reader.pages)} pages\n")
    print("=" * 80)
    
    for i, page in enumerate(reader.pages, 1):
        text = page.extract_text()
        print(f"\n--- PAGE {i} ---\n")
        print(text)
        print("\n" + "=" * 80)

if __name__ == "__main__":
    extract_pdf_text("C3Ops-FinOps-Deck-20251127.pdf")
