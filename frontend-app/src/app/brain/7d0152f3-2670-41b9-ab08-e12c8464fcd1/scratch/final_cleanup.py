import json
import re

json_path = r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\src\assets\universidades-carreras.json'

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

def full_normalize(text):
    if not text: return ""
    t = text.lower()
    t = t.replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace('ñ', 'n')
    t = re.sub(r'[^a-z0-9]', '', t)
    return t

# Official names map
official_unis = {
    'pontificiauniversidadcatolicadechile': 'Pontificia Universidad Católica de Chile',
    'pontificiauniversidadcatolicadevalparaiso': 'Pontificia Universidad Católica de Valparaíso',
    'universidadadolfoibanez': 'Universidad Adolfo Ibáñez',
    'universidaddeviñadelmar': 'Universidad de Viña del Mar',
    'universidaddeviadelmar': 'Universidad de Viña del Mar',
    'universidadmetropolitanadecienciasdelaeducacion': 'Universidad Metropolitana de Ciencias de la Educación (UMCE)',
    'umce': 'Universidad Metropolitana de Ciencias de la Educación (UMCE)',
    'universidaddesantiagodechile': 'Universidad de Santiago de Chile (USACH)',
    'usach': 'Universidad de Santiago de Chile (USACH)',
    'universidadtecnicafedericosantamaria': 'Universidad Técnica Federico Santa María (USM)',
    'utfsm': 'Universidad Técnica Federico Santa María (USM)',
    'usm': 'Universidad Técnica Federico Santa María (USM)',
    'universidaddevalparaiso': 'Universidad de Valparaíso',
    'universidaddeconcepcion': 'Universidad de Concepción',
    'universidaddeaysem': 'Universidad de Aysén',
    'universidaddeaysen': 'Universidad de Aysén',
    'universidaddetarapaca': 'Universidad de Tarapacá',
    'universidadautonomadechile': 'Universidad Autónoma de Chile',
    'universidadcatolicadelasantisimaconcepcion': 'Universidad Católica de la Santísima Concepción',
    'universidadcatolicadelmaule': 'Universidad Católica del Maule',
    'universidadcatolicadelnorte': 'Universidad Católica del Norte',
    'universidadcatolicadetemuco': 'Universidad Católica de Temuco',
    'universidaddeloslagos': 'Universidad de los Lagos',
    'universidaddelamericas': 'Universidad de las Américas',
    'universidaddelasamericas': 'Universidad de las Américas',
    'universidadsansebastian': 'Universidad San Sebastián',
    'universidadsantotomas': 'Universidad Santo Tomás',
    'universidaddeldesarrollo': 'Universidad del Desarrollo',
    'universidadandresbello': 'Universidad Andrés Bello',
}

cleaned = []
seen = set()

for item in data:
    # Normalize Uni
    norm_uni = full_normalize(item['universidad'])
    if norm_uni in official_unis:
        item['universidad'] = official_unis[norm_uni]
    else:
        # Default cleaning for others
        item['universidad'] = item['universidad'].title().replace(' De ', ' de ').replace(' La ', ' la ').replace(' Del ', ' del ').replace(' Y ', ' y ')
        # Special case for "Ibañez"
        item['universidad'] = item['universidad'].replace('Ibanez', 'Ibáñez').replace('Ibai', 'Ibáñez')

    # Normalize Location to Region
    norm_loc = full_normalize(item['ubicacion'])
    if 'metropolitana' in norm_loc or 'santiago' in norm_loc:
        item['ubicacion'] = 'Región Metropolitana'
    elif 'valparaiso' in norm_loc or 'valparai' in norm_loc:
        item['ubicacion'] = 'Región de Valparaíso'
    elif 'biobio' in norm_loc:
        item['ubicacion'] = 'Región del Biobío'
    elif 'araucania' in norm_loc:
        item['ubicacion'] = 'Región de la Araucanía'
    elif 'tarapaca' in norm_loc or 'tarapaci' in norm_loc:
        item['ubicacion'] = 'Región de Tarapacá'
    elif 'antofagasta' in norm_loc:
        item['ubicacion'] = 'Región de Antofagasta'
    elif 'atacama' in norm_loc:
        item['ubicacion'] = 'Región de Atacama'
    elif 'coquimbo' in norm_loc:
        item['ubicacion'] = 'Región de Coquimbo'
    elif 'ohiggins' in norm_loc:
        item['ubicacion'] = "Región del Libertador Gral. Bernardo O'Higgins"
    elif 'maule' in norm_loc:
        item['ubicacion'] = 'Región del Maule'
    elif 'nuble' in norm_loc:
        item['ubicacion'] = 'Región de Ñuble'
    elif 'rios' in norm_loc:
        item['ubicacion'] = 'Región de los Ríos'
    elif 'lagos' in norm_loc:
        item['ubicacion'] = 'Región de los Lagos'
    elif 'aysen' in norm_loc:
        item['ubicacion'] = 'Región de Aysén'
    elif 'magallanes' in norm_loc:
        item['ubicacion'] = 'Región de Magallanes'

    # Deduplicate
    key = (full_normalize(item['nombre']), full_normalize(item['universidad']), full_normalize(item['ubicacion']))
    if key not in seen:
        cleaned.append(item)
        seen.add(key)

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(cleaned, f, indent=2, ensure_ascii=False)

print(f"Final cleanup complete. Total: {len(cleaned)}")
