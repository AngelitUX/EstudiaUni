import pdfplumber
import sys
import json

pdf_file = "src/pruebasDemre/M2-2024-SOLUCION.pdf"
try:
    with pdfplumber.open(pdf_file) as pdf:
        all_text = ""
        for page in pdf.pages:
            all_text += page.extract_text() + "\n"
        print(all_text[:2000]) # print first 2000 chars to see structure
except Exception as e:
    print(f"Error: {e}")
