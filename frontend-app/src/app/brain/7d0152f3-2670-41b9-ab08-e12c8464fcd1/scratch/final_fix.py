import json, re

json_path = r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\src\assets\universidades-carreras.json'

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Direct string replacement for all broken values
for c in data:
    loc = c['ubicacion']
    uni = c['universidad']
    
    # Fix any location that contains garbled text
    if 'ï¿' in loc or 'ý' in loc:
        low = loc.lower()
        if 'biob' in low or 'bio-b' in low or 'bio b' in low:
            c['ubicacion'] = 'Región del Biobío'
        elif 'rio' in low or 'rí' in low:
            c['ubicacion'] = 'Región de los Ríos'
        elif 'valparai' in low or 'valpar' in low:
            c['ubicacion'] = 'Región de Valparaíso'
        elif 'tarapac' in low:
            c['ubicacion'] = 'Región de Tarapacá'
        elif 'araucan' in low:
            c['ubicacion'] = 'Región de la Araucanía'
        elif 'nuble' in low or 'uble' in low:
            c['ubicacion'] = 'Región de Ñuble'
        elif 'ays' in low:
            c['ubicacion'] = 'Región de Aysén'
        else:
            print(f'  UNKNOWN BROKEN LOCATION: [{loc}]')
    
    # Fix university duplicates
    if 'Bio-Bio' in uni and 'Bío' not in uni:
        c['universidad'] = 'Universidad del Bío-Bío'

# Deduplicate
def norm(t):
    t = t.lower()
    for a, b in [('á','a'),('é','e'),('í','i'),('ó','o'),('ú','u'),('ñ','n'),('ü','u')]:
        t = t.replace(a, b)
    t = re.sub(r'[^a-z0-9 ]', '', t)
    return t.strip()

seen = set()
deduped = []
for c in data:
    key = (norm(c['nombre']), norm(c['universidad']))
    if key not in seen:
        seen.add(key)
        deduped.append(c)

locs = sorted(set(c['ubicacion'] for c in deduped))
unis = sorted(set(c['universidad'] for c in deduped))

print(f'Total: {len(deduped)} careers')
print(f'Regions ({len(locs)}):')
for l in locs: print(f'  {l}')
print(f'\nUniversities ({len(unis)}):')
for u in unis: print(f'  {u}')

# Verify no garbled text remains
issues = [c for c in deduped if 'ï¿' in c['ubicacion'] or 'ï¿' in c['universidad']]
if issues:
    print(f'\n⚠️ {len(issues)} entries still have encoding issues!')
else:
    print('\n✅ No encoding issues remain!')

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(deduped, f, indent=2, ensure_ascii=False)
