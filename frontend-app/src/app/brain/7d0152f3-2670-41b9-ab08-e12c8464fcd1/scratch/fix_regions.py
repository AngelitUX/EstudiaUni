import json, re

json_path = r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\src\assets\universidades-carreras.json'

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

def norm(t):
    t = t.lower()
    for a, b in [('á','a'),('é','e'),('í','i'),('ó','o'),('ú','u'),('ñ','n'),('ü','u')]:
        t = t.replace(a, b)
    t = re.sub(r'ï¿½?', '', t)
    t = re.sub(r'[^a-z0-9 ]', '', t)
    return t.strip()

region_rules = [
    ('metropolitana', 'Región Metropolitana'),
    ('valparai', 'Región de Valparaíso'),
    ('biobio', 'Región del Biobío'),
    ('bio bio', 'Región del Biobío'),
    ('araucani', 'Región de la Araucanía'),
    ('araucan', 'Región de la Araucanía'),
    ('tarapac', 'Región de Tarapacá'),
    ('antofagasta', 'Región de Antofagasta'),
    ('atacama', 'Región de Atacama'),
    ('coquimbo', 'Región de Coquimbo'),
    ('ohiggins', "Región del Libertador Gral. Bernardo O'Higgins"),
    ('libertador', "Región del Libertador Gral. Bernardo O'Higgins"),
    ('maule', 'Región del Maule'),
    ('nuble', 'Región de Ñuble'),
    ('uble', 'Región de Ñuble'),
    ('los rio', 'Región de los Ríos'),
    ('los lago', 'Región de los Lagos'),
    ('ayse', 'Región de Aysén'),
    ('ays', 'Región de Aysén'),
    ('magallanes', 'Región de Magallanes'),
    ('arica', 'Región de Arica y Parinacota'),
]

fixed = 0
for c in data:
    n = norm(c['ubicacion'])
    if c['ubicacion'].startswith('Región') and 'ï' not in c['ubicacion']:
        continue
    for key, val in region_rules:
        if key in n:
            c['ubicacion'] = val
            fixed += 1
            break

print(f'Fixed {fixed} regions')

# Deduplicate
seen = set()
deduped = []
for c in data:
    key = (norm(c['nombre']), norm(c['universidad']))
    if key not in seen:
        seen.add(key)
        deduped.append(c)

print(f'Before dedup: {len(data)}, After: {len(deduped)}')

locs = set(c['ubicacion'] for c in deduped)
print(f'Regions ({len(locs)}):')
for l in sorted(locs):
    print(f'  {l}')

unis = set(c['universidad'] for c in deduped)
print(f'\nUniversities ({len(unis)}):')
for u in sorted(unis):
    print(f'  {u}')

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(deduped, f, indent=2, ensure_ascii=False)

print(f'\nFinal total: {len(deduped)} careers saved.')
