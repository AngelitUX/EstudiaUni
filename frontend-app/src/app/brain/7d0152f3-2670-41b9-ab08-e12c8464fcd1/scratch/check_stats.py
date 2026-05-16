import json, os

p = r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\src\assets\universidades-carreras.json'
s = os.path.getsize(p)
d = json.load(open(p, 'r', encoding='utf-8'))

print(f"Careers: {len(d)}")
print(f"File size: {s / 1024 / 1024:.2f} MB")
print(f"Universities: {len(set(c['universidad'] for c in d))}")
print(f"Regions: {len(set(c['ubicacion'] for c in d))}")

issues = sum(1 for c in d for f in ['nombre','universidad','ubicacion'] if 'ï¿' in c.get(f,''))
print(f"Encoding issues: {issues}")
