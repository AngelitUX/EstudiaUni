import json, re

p = r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\src\assets\universidades-carreras.json'
d = json.load(open(p, 'r', encoding='utf-8'))

# Replacement map for common garbled chars from latin-1 -> utf-8 misread
replacements = {
    'ï¿½': '',  # generic replacement char
    'ï¿': '',   # partial
    'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú',
    'Ã±': 'ñ', 'Ã¼': 'ü', 'Ã': 'Á',
}

def clean_text(text):
    for bad, good in replacements.items():
        text = text.replace(bad, good)
    # Remove any remaining non-printable/garbled chars
    text = re.sub(r'[\x80-\x9f]', '', text)
    return text

fixed = 0
for c in d:
    for field in ['nombre', 'universidad', 'ubicacion', 'descripcion', 'area']:
        old = c.get(field, '')
        if 'ï¿' in old or 'Ã' in old:
            c[field] = clean_text(old)
            fixed += 1

print(f"Fixed {fixed} fields")

# Verify
issues = sum(1 for c in d for f in ['nombre','universidad','ubicacion'] if 'ï¿' in c.get(f,''))
print(f"Remaining issues: {issues}")

# Check a sample of cleaned names
samples = [c['nombre'] for c in d if 'ï' in c.get('nombre_original', c['nombre'])][:5]

json.dump(d, open(p, 'w', encoding='utf-8'), indent=2, ensure_ascii=False)
print("Saved!")
