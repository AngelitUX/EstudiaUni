import json
import re

json_path = r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\src\assets\universidades-carreras.json'

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

def strip_accents(text):
    t = text.lower()
    t = t.replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')
    t = t.replace('ñ', 'n').replace('ï', 'i').replace('ý', 'n')  # ý was ñ in bad encoding
    t = re.sub(r'[^a-z0-9 ]', '', t)
    return t.strip()

# ============ REGION FIXES ============
region_rules = [
    ('metropolitana', 'Región Metropolitana'),
    ('santiago', 'Región Metropolitana'),
    ('valparaiso', 'Región de Valparaíso'),
    ('valparai', 'Región de Valparaíso'),
    ('biobio', 'Región del Biobío'),
    ('concepcion', 'Región del Biobío'),
    ('araucani', 'Región de la Araucanía'),
    ('araucan', 'Región de la Araucanía'),
    ('tarapac', 'Región de Tarapacá'),
    ('antofagasta', 'Región de Antofagasta'),
    ('atacama', 'Región de Atacama'),
    ('coquimbo', 'Región de Coquimbo'),
    ('ohiggins', "Región del Libertador Gral. Bernardo O'Higgins"),
    ('maule', 'Región del Maule'),
    ('nuble', 'Región de Ñuble'),
    ('uble', 'Región de Ñuble'),  # catches Ýuble
    ('los rio', 'Región de los Ríos'),
    ('los lago', 'Región de los Lagos'),
    ('ayse', 'Región de Aysén'),
    ('ays', 'Región de Aysén'),
    ('magallanes', 'Región de Magallanes'),
    ('arica', 'Región de Arica y Parinacota'),
]

# ============ UNIVERSITY FIXES ============
uni_rules = [
    ('pontificia universidad catolica de chile', 'Pontificia Universidad Católica de Chile'),
    ('pontificia universidad catolica de valparaiso', 'Pontificia Universidad Católica de Valparaíso'),
    ('universidad adolfo ibanez', 'Universidad Adolfo Ibáñez'),
    ('universidad tecnica federico santa maria', 'Universidad Técnica Federico Santa María'),
    ('univ tecnica federico santa maria', 'Universidad Técnica Federico Santa María'),
    ('universidad de santiago de chile', 'Universidad de Santiago de Chile'),
    ('universidad de valparaiso', 'Universidad de Valparaíso'),
    ('universidad de concepcion', 'Universidad de Concepción'),
    ('universidad andres bello', 'Universidad Andrés Bello'),
    ('universidad de vina del mar', 'Universidad de Viña del Mar'),
    ('universidad de tarapaca', 'Universidad de Tarapacá'),
    ('universidad autonoma de chile', 'Universidad Autónoma de Chile'),
    ('universidad catolica de la santisima concepcion', 'Universidad Católica de la Santísima Concepción'),
    ('universidad catolica del maule', 'Universidad Católica del Maule'),
    ('universidad catolica del norte', 'Universidad Católica del Norte'),
    ('universidad catolica de temuco', 'Universidad Católica de Temuco'),
    ('universidad san sebastian', 'Universidad San Sebastián'),
    ('universidad santo tomas', 'Universidad Santo Tomás'),
    ('universidad metropolitana de ciencias de la educacion', 'Universidad Metropolitana de Ciencias de la Educación'),
    ('umce', 'Universidad Metropolitana de Ciencias de la Educación'),
    ('universidad de las americas', 'Universidad de las Américas'),
    ('universidad del bio-bio', 'Universidad del Bío-Bío'),
    ('universidad del biobio', 'Universidad del Bío-Bío'),
    ('universidad tecnologica metropolitana', 'Universidad Tecnológica Metropolitana'),
    ('universidad tecnologica de chile inacap', 'Universidad Tecnológica de Chile INACAP'),
    ('universidad catolica cardenal raul silva henriquez', 'Universidad Católica Cardenal Raúl Silva Henríquez'),
    ('universidad de playa ancha', 'Universidad de Playa Ancha'),
    ('universidad la republica', 'Universidad la República'),
    ('universidad del alba', 'Universidad del Alba'),
    ('universidad de los andes', 'Universidad de los Andes'),
    ('universidad diego portales', 'Universidad Diego Portales'),
    ('universidad alberto hurtado', 'Universidad Alberto Hurtado'),
    ('universidad de chile', 'Universidad de Chile'),
    ('universidad mayor', 'Universidad Mayor'),
    ('universidad austral de chile', 'Universidad Austral de Chile'),
    ('universidad de la frontera', 'Universidad de la Frontera'),
    ('universidad de la serena', 'Universidad de la Serena'),
    ('universidad arturo prat', 'Universidad Arturo Prat'),
    ('universidad de talca', 'Universidad de Talca'),
    ('universidad de antofagasta', 'Universidad de Antofagasta'),
    ('universidad de atacama', 'Universidad de Atacama'),
    ('universidad de magallanes', 'Universidad de Magallanes'),
    ('universidad de los lagos', 'Universidad de los Lagos'),
    ('universidad del desarrollo', 'Universidad del Desarrollo'),
    ('universidad finis terrae', 'Universidad Finis Terrae'),
    ('universidad central de chile', 'Universidad Central de Chile'),
    ('universidad adventista de chile', 'Universidad Adventista de Chile'),
    ('universidad de aconcagua', 'Universidad de Aconcagua'),
    ('universidad sek', 'Universidad SEK'),
    ('universidad bolivariana', 'Universidad Bolivariana'),
    ('universidad miguel de cervantes', 'Universidad Miguel de Cervantes'),
    ('universidad academia de humanismo cristiano', 'Universidad Academia de Humanismo Cristiano'),
    ('universidad bernardo ohiggins', "Universidad Bernardo O'Higgins"),
]

# ============ ABBREVIATION MAP ============
abbr_map = {
    'Pontificia Universidad Católica de Chile': 'PUC',
    'Pontificia Universidad Católica de Valparaíso': 'PUCV',
    'Universidad Adolfo Ibáñez': 'UAI',
    'Universidad Técnica Federico Santa María': 'USM',
    'Universidad de Santiago de Chile': 'USACH',
    'Universidad de Valparaíso': 'UV',
    'Universidad de Concepción': 'UdeC',
    'Universidad Andrés Bello': 'UNAB',
    'Universidad de Viña del Mar': 'UVM',
    'Universidad de Tarapacá': 'UTA',
    'Universidad Autónoma de Chile': 'UA',
    'Universidad Católica de la Santísima Concepción': 'UCSC',
    'Universidad Católica del Maule': 'UCM',
    'Universidad Católica del Norte': 'UCN',
    'Universidad Católica de Temuco': 'UCT',
    'Universidad San Sebastián': 'USS',
    'Universidad Santo Tomás': 'UST',
    'Universidad Metropolitana de Ciencias de la Educación': 'UMCE',
    'Universidad de las Américas': 'UDLA',
    'Universidad del Bío-Bío': 'UBB',
    'Universidad Tecnológica Metropolitana': 'UTEM',
    'Universidad Tecnológica de Chile INACAP': 'INACAP',
    'Universidad Católica Cardenal Raúl Silva Henríquez': 'UCSH',
    'Universidad de Playa Ancha': 'UPLA',
    'Universidad la República': 'ULARE',
    'Universidad del Alba': 'UDALBA',
    'Universidad de los Andes': 'UANDES',
    'Universidad Diego Portales': 'UDP',
    'Universidad Alberto Hurtado': 'UAH',
    'Universidad de Chile': 'UCH',
    'Universidad Mayor': 'UMAYOR',
    'Universidad Austral de Chile': 'UACh',
    'Universidad de la Frontera': 'UFRO',
    'Universidad de la Serena': 'ULS',
    'Universidad Arturo Prat': 'UNAP',
    'Universidad de Talca': 'UTALCA',
    'Universidad de Antofagasta': 'UA',
    'Universidad de Atacama': 'UDA',
    'Universidad de Magallanes': 'UMAG',
    'Universidad de los Lagos': 'ULAGOS',
    'Universidad del Desarrollo': 'UDD',
    'Universidad Finis Terrae': 'UFT',
    'Universidad Central de Chile': 'UCEN',
    'Universidad SEK': 'USEK',
    "Universidad Bernardo O'Higgins": 'UBO',
}

# ============ PROCESS ============
for item in data:
    # Fix university
    norm_uni = strip_accents(item['universidad'])
    for key, val in uni_rules:
        if key in norm_uni:
            item['universidad'] = val
            break
    
    # Fix abbreviation
    if item['universidad'] in abbr_map:
        item['abreviatura'] = abbr_map[item['universidad']]
    
    # Fix location
    norm_loc = strip_accents(item['ubicacion'])
    for key, val in region_rules:
        if key in norm_loc:
            item['ubicacion'] = val
            break

    # Fix career name: ensure title case, handle edge cases
    nombre = item['nombre']
    if nombre.isupper():
        nombre = nombre.title()
    # Fix common prepositions back to lowercase
    for prep in [' De ', ' Del ', ' En ', ' La ', ' Las ', ' Los ', ' Y ', ' Con ', ' Para ']:
        nombre = nombre.replace(prep, prep.lower())
    item['nombre'] = nombre

    # Fix description if it has encoding artifacts
    desc = item['descripcion']
    if 'ï¿' in desc or desc.isupper():
        item['descripcion'] = f"Estudia {item['nombre']} en la {item['universidad']}. Información oficial del proceso de admisión 2025."

# ============ DEDUPLICATE ============
seen = set()
deduped = []
for item in data:
    key = (strip_accents(item['nombre']), strip_accents(item['universidad']))
    if key not in seen:
        deduped.append(item)
        seen.add(key)

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(deduped, f, indent=2, ensure_ascii=False)

print(f"Final total: {len(deduped)} careers")

# Verify
locs = set(c['ubicacion'] for c in deduped)
unis = set(c['universidad'] for c in deduped)
print(f"\nRegions ({len(locs)}):")
for l in sorted(locs):
    print(f"  {l}")
print(f"\nUniversities ({len(unis)}):")
for u in sorted(unis):
    print(f"  {u}")
