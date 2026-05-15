import csv
import json
import re
import hashlib

csv_path = r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\public\Matricula_2025_WEB_15_07_2025.csv'
json_path = r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\src\assets\universidades-carreras.json'

# ============ HELPERS ============
def strip_accents(text):
    t = text.lower()
    for a, b in [('á','a'),('é','e'),('í','i'),('ó','o'),('ú','u'),('ñ','n'),('ü','u')]:
        t = t.replace(a, b)
    t = re.sub(r'ï¿½?', '', t)
    t = re.sub(r'[^a-z0-9 ]', '', t)
    return t.strip()

def make_key(nombre, universidad):
    return (strip_accents(nombre), strip_accents(universidad))

def title_case(text):
    """Convert UPPER CASE to Title Case, respecting prepositions"""
    words = text.strip().title().split()
    preps = {'De','Del','La','Las','Los','En','Y','Con','Para','El','Al','A','E','O','Por','Sin','Un','Una'}
    result = []
    for i, w in enumerate(words):
        if i > 0 and w in preps:
            result.append(w.lower())
        else:
            result.append(w)
    return ' '.join(result)

# ============ UNIVERSITY NAME MAP ============
uni_map = {
    'pontificia universidad catolica de chile': 'Pontificia Universidad Católica de Chile',
    'pontificia universidad catolica de valparaiso': 'Pontificia Universidad Católica de Valparaíso',
    'universidad adolfo iba': 'Universidad Adolfo Ibáñez',
    'universidad tecnica federico santa maria': 'Universidad Técnica Federico Santa María',
    'universidad de santiago de chile': 'Universidad de Santiago de Chile',
    'universidad de valparaiso': 'Universidad de Valparaíso',
    'universidad de concepcion': 'Universidad de Concepción',
    'universidad andres bello': 'Universidad Andrés Bello',
    'universidad de via del m': 'Universidad de Viña del Mar',
    'universidad de tarapaca': 'Universidad de Tarapacá',
    'universidad autonoma de chile': 'Universidad Autónoma de Chile',
    'universidad catolica de la santisima concepcion': 'Universidad Católica de la Santísima Concepción',
    'universidad catolica del maule': 'Universidad Católica del Maule',
    'universidad catolica del norte': 'Universidad Católica del Norte',
    'universidad catolica de temuco': 'Universidad Católica de Temuco',
    'universidad san sebastian': 'Universidad San Sebastián',
    'universidad santo tomas': 'Universidad Santo Tomás',
    'universidad metropolitana de ciencias de la educacion': 'Universidad Metropolitana de Ciencias de la Educación',
    'universidad de las americas': 'Universidad de las Américas',
    'universidad del bio-bio': 'Universidad del Bío-Bío',
    'universidad tecnologica metropolitana': 'Universidad Tecnológica Metropolitana',
    'universidad tecnologica de chile inacap': 'Universidad Tecnológica de Chile INACAP',
    'universidad catolica cardenal raul silva henriquez': 'Universidad Católica Cardenal Raúl Silva Henríquez',
    'universidad de playa ancha': 'Universidad de Playa Ancha',
    'universidad la republica': 'Universidad la República',
    'universidad del alba': 'Universidad del Alba',
    'universidad de los andes': 'Universidad de los Andes',
    'universidad diego portales': 'Universidad Diego Portales',
    'universidad alberto hurtado': 'Universidad Alberto Hurtado',
    'universidad de chile': 'Universidad de Chile',
    'universidad mayor': 'Universidad Mayor',
    'universidad austral de chile': 'Universidad Austral de Chile',
    'universidad de la frontera': 'Universidad de la Frontera',
    'universidad de la serena': 'Universidad de la Serena',
    'universidad arturo prat': 'Universidad Arturo Prat',
    'universidad de talca': 'Universidad de Talca',
    'universidad de antofagasta': 'Universidad de Antofagasta',
    'universidad de atacama': 'Universidad de Atacama',
    'universidad de magallanes': 'Universidad de Magallanes',
    'universidad de los lagos': 'Universidad de los Lagos',
    'universidad del desarrollo': 'Universidad del Desarrollo',
    'universidad finis terrae': 'Universidad Finis Terrae',
    'universidad central de chile': 'Universidad Central de Chile',
    'universidad adventista de chile': 'Universidad Adventista de Chile',
    'universidad de aconcagua': 'Universidad de Aconcagua',
    'universidad sek': 'Universidad SEK',
    'universidad bolivariana': 'Universidad Bolivariana',
    'universidad miguel de cervantes': 'Universidad Miguel de Cervantes',
    'universidad academia de humanismo cristiano': 'Universidad Academia de Humanismo Cristiano',
    'universidad bernardo ohiggins': "Universidad Bernardo O'Higgins",
    'universidad gabriela mistral': 'Universidad Gabriela Mistral',
    'universidad de ohiggins': "Universidad de O'Higgins",
    'universidad de aysen': 'Universidad de Aysén',
    'universidad de artes ciencias y comunicacion': 'Universidad UNIACC',
}

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
    'Universidad de Antofagasta': 'UANTOF',
    'Universidad de Atacama': 'UDA',
    'Universidad de Magallanes': 'UMAG',
    'Universidad de los Lagos': 'ULAGOS',
    'Universidad del Desarrollo': 'UDD',
    'Universidad Finis Terrae': 'UFT',
    'Universidad Central de Chile': 'UCEN',
    'Universidad SEK': 'USEK',
    "Universidad Bernardo O'Higgins": 'UBO',
    'Universidad Gabriela Mistral': 'UGM',
    "Universidad de O'Higgins": 'UOH',
    'Universidad de Aysén': 'UAYSEN',
    'Universidad UNIACC': 'UNIACC',
}

# ============ REGION MAP ============
region_rules = [
    ('metropolitana', 'Región Metropolitana'),
    ('santiago', 'Región Metropolitana'),
    ('valparaiso', 'Región de Valparaíso'),
    ('biobio', 'Región del Biobío'),
    ('bio-bio', 'Región del Biobío'),
    ('araucania', 'Región de la Araucanía'),
    ('tarapaca', 'Región de Tarapacá'),
    ('antofagasta', 'Región de Antofagasta'),
    ('atacama', 'Región de Atacama'),
    ('coquimbo', 'Región de Coquimbo'),
    ('ohiggins', "Región del Libertador Gral. Bernardo O'Higgins"),
    ('libertador', "Región del Libertador Gral. Bernardo O'Higgins"),
    ('maule', 'Región del Maule'),
    ('nuble', 'Región de Ñuble'),
    ('uble', 'Región de Ñuble'),
    ('los rios', 'Región de los Ríos'),
    ('rios', 'Región de los Ríos'),
    ('los lagos', 'Región de los Lagos'),
    ('lagos', 'Región de los Lagos'),
    ('aysen', 'Región de Aysén'),
    ('magallanes', 'Región de Magallanes'),
    ('arica', 'Región de Arica y Parinacota'),
]

# ============ INTEREST ASSIGNMENT ============
def assign_interests(nombre, area_conocimiento):
    n = strip_accents(nombre)
    a = strip_accents(area_conocimiento)
    interests = []
    
    # Engineering
    if 'ingenieria' in n:
        interests.extend(['Ingeniería', 'Matemáticas', 'Tecnología'])
    
    # CS / IT
    if any(k in n for k in ['informatica', 'computacion', 'software', 'sistemas', 'datos', 'cibernetica']):
        interests.extend(['Programación', 'Tecnología', 'Innovación'])
    
    # Health
    if any(k in n for k in ['medicina', 'enfermeria', 'obstetricia', 'kinesiologia', 'fonoaudiologia', 'nutricion', 'odontologia', 'terapia ocupacional', 'tecnologia medica', 'salud']):
        interests.extend(['Salud', 'Ciencias', 'Investigación'])
    
    if 'veterinaria' in n:
        interests.extend(['Salud', 'Ciencias', 'Biología'])
    
    # Law
    if 'derecho' in n or 'leyes' in n:
        interests.extend(['Derecho', 'Justicia', 'Lectura'])
    
    # Education
    if any(k in n for k in ['pedagogia', 'educacion', 'parvularia']):
        interests.extend(['Enseñanza', 'Ayuda social', 'Lectura'])
    
    # Business
    if any(k in n for k in ['comercial', 'administracion', 'negocios', 'contador', 'contabilidad', 'finanzas']):
        interests.extend(['Negocios', 'Economía', 'Liderazgo'])
    
    # Architecture
    if any(k in n for k in ['arquitectura', 'urbanismo']):
        interests.extend(['Arquitectura', 'Diseño', 'Innovación'])
    
    # Design
    if any(k in n for k in ['diseno', 'grafico']):
        interests.extend(['Diseño', 'Arte', 'Innovación'])
    
    # Arts
    if any(k in n for k in ['arte', 'teatro', 'actuacion', 'danza', 'cine', 'audiovisual']):
        interests.extend(['Arte', 'Diseño'])
    
    if any(k in n for k in ['musica', 'musical', 'interpretacion musical']):
        interests.extend(['Música', 'Arte'])
    
    # Sciences
    if any(k in n for k in ['fisica', 'astronomia', 'geofisica']):
        interests.extend(['Física', 'Ciencias', 'Matemáticas'])
    
    if any(k in n for k in ['quimica', 'farmacia', 'bioquimica']):
        interests.extend(['Química', 'Ciencias', 'Investigación'])
    
    if any(k in n for k in ['biologia', 'biotecnologia', 'marina', 'ecologia']):
        interests.extend(['Biología', 'Ciencias', 'Investigación'])
    
    if any(k in n for k in ['matematica', 'estadistica']):
        interests.extend(['Matemáticas', 'Ciencias'])
    
    # Social sciences
    if any(k in n for k in ['psicologia', 'sociologia', 'antropologia', 'trabajo social']):
        interests.extend(['Ayuda social', 'Ciencias', 'Investigación'])
    
    if any(k in n for k in ['periodismo', 'comunicacion', 'publicidad']):
        interests.extend(['Lectura', 'Diseño', 'Innovación'])
    
    if any(k in n for k in ['ciencia politica', 'politica', 'publica']):
        interests.extend(['Liderazgo', 'Justicia'])
    
    # History/Geography
    if any(k in n for k in ['historia', 'patrimonio', 'arqueologia', 'filosofia']):
        interests.extend(['Historia', 'Lectura', 'Investigación'])
    
    if any(k in n for k in ['geografia', 'geologia', 'agronomia', 'forestal', 'ambiental', 'medio ambiente']):
        interests.extend(['Geografía', 'Ciencias'])
    
    # Economia
    if any(k in n for k in ['economia', 'economicas']):
        interests.extend(['Economía', 'Matemáticas', 'Negocios'])
    
    # Area-based fallbacks
    if 'tecnologia' in a and 'Tecnología' not in interests:
        interests.append('Tecnología')
    if 'salud' in a and 'Salud' not in interests:
        interests.append('Salud')
    if 'ciencias' in a and 'Ciencias' not in interests:
        interests.append('Ciencias')
    if 'educacion' in a and 'Enseñanza' not in interests:
        interests.append('Enseñanza')
    if 'agropecuaria' in a:
        interests.extend(['Geografía', 'Ciencias'])
    if 'arte' in a and 'Arte' not in interests:
        interests.append('Arte')
    if 'derecho' in a and 'Derecho' not in interests:
        interests.append('Derecho')
    if 'humanidades' in a and 'Historia' not in interests:
        interests.extend(['Historia', 'Lectura'])
    if 'administracion' in a and 'Negocios' not in interests:
        interests.extend(['Negocios', 'Liderazgo'])
    
    # Ensure at least 2 interests
    if len(interests) < 2:
        interests.extend(['Ciencias', 'Investigación'])
    
    # Deduplicate while preserving order
    seen = set()
    unique = []
    for i in interests:
        if i not in seen:
            seen.add(i)
            unique.append(i)
    return unique[:5]  # Max 5 interests per career

def clean_uni_name(raw):
    n = strip_accents(raw)
    for key, val in uni_map.items():
        if key in n:
            return val
    return title_case(raw)

def clean_region(raw):
    n = strip_accents(raw)
    for key, val in region_rules:
        if key in n:
            return val
    return title_case(raw)

def make_id(nombre, uni):
    h = hashlib.md5(f"{nombre}_{uni}".encode()).hexdigest()[:6].upper()
    prefix = ''.join(w[0] for w in nombre.split()[:3] if w).upper()[:4]
    return f"{prefix}-{h}"

# ============ LOAD EXISTING JSON ============
with open(json_path, 'r', encoding='utf-8') as f:
    existing = json.load(f)

existing_keys = set()
for c in existing:
    existing_keys.add(make_key(c['nombre'], c['universidad']))

print(f"Existing careers in JSON: {len(existing)}")

# ============ READ CSV ============
new_entries = []
csv_seen = set()

with open(csv_path, 'r', encoding='latin-1') as f:
    reader = csv.reader(f, delimiter=';')
    headers = next(reader)
    
    for row in reader:
        if len(row) < 27: continue
        
        tipo = row[9] if len(row) > 9 else ''
        if 'Universidades' not in tipo: continue
        
        raw_uni = row[13].strip()
        raw_carrera = row[19].strip()
        raw_region = row[15].strip() if len(row) > 15 else ''
        raw_area = row[20].strip() if len(row) > 20 else ''
        
        if not raw_carrera or not raw_uni: continue
        
        # Skip convenio entries
        if 'CONVENIO' in raw_uni.upper(): continue
        
        uni = clean_uni_name(raw_uni)
        carrera = title_case(raw_carrera)
        region = clean_region(raw_region)
        
        key = make_key(carrera, uni)
        
        # Skip if already in existing JSON or already processed from CSV
        if key in existing_keys: continue
        if key in csv_seen: continue
        csv_seen.add(key)
        
        abbr = abbr_map.get(uni, ''.join(w[0] for w in uni.split() if w[0].isupper())[:5])
        interests = assign_interests(carrera, raw_area)
        area_clean = title_case(raw_area) if raw_area else 'General'
        
        entry = {
            "id": make_id(carrera, uni),
            "universidad": uni,
            "abreviatura": abbr,
            "nombre": carrera,
            "area": area_clean,
            "ubicacion": region,
            "descripcion": f"Estudia {carrera} en la {uni}. Información oficial del proceso de admisión 2025.",
            "intereses": interests,
            "puntajes": {
                "nem": 20,
                "ranking": 20,
                "lectora": 15,
                "matematica1": 25,
                "matematica2": 0,
                "electiva": 20
            },
            "puntajeCorte2025": 0
        }
        new_entries.append(entry)

print(f"New careers to add from CSV: {len(new_entries)}")

# ============ MERGE AND SAVE ============
merged = existing + new_entries
print(f"Total after merge: {len(merged)}")

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(merged, f, indent=2, ensure_ascii=False)

print("Done! Saved to JSON.")

# Stats
unis_final = set(c['universidad'] for c in merged)
locs_final = set(c['ubicacion'] for c in merged)
print(f"\nFinal stats:")
print(f"  Universities: {len(unis_final)}")
print(f"  Regions: {len(locs_final)}")
print(f"  Total careers: {len(merged)}")
