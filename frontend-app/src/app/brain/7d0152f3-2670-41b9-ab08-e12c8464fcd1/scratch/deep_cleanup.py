import json
import re

json_path = r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\src\assets\universidades-carreras.json'

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Official mapping for universities to avoid duplicates
uni_map = {
    'pontificia universidad catolica de chile': 'Pontificia Universidad Católica de Chile',
    'pontificia universidad catolica de valparaiso': 'Pontificia Universidad Católica de Valparaíso',
    'pontificia universidad catolica de valparaiso': 'Pontificia Universidad Católica de Valparaíso',
    'universidad adolfo ibañez': 'Universidad Adolfo Ibáñez',
    'universidad adolfo ibai': 'Universidad Adolfo Ibáñez',
    'universidad adolfo ibaï¿½nez': 'Universidad Adolfo Ibáñez',
    'universidad de viña del mar': 'Universidad de Viña del Mar',
    'universidad de viia del m': 'Universidad de Viña del Mar',
    'umce': 'Universidad Metropolitana de Ciencias de la Educación (UMCE)',
    'universidad metropolitana de ciencias de la educacion': 'Universidad Metropolitana de Ciencias de la Educación (UMCE)',
    'universidad de santiago de chile': 'Universidad de Santiago de Chile (USACH)',
    'universidad tecnica federico santa maria': 'Universidad Técnica Federico Santa María (USM)',
    'universidad de valparaiso': 'Universidad de Valparaíso',
    'universidad de concepcion': 'Universidad de Concepción',
    'universidad de los andes': 'Universidad de los Andes',
    'universidad andres bello': 'Universidad Andrés Bello',
    'universidad diego portales': 'Universidad Diego Portales',
}

# Official mapping for regions
region_map = {
    'metropolitana': 'Región Metropolitana',
    'santiago': 'Región Metropolitana',
    'valparaiso': 'Región de Valparaíso',
    'valparai': 'Región de Valparaíso',
    'biobio': 'Región del Biobío',
    'araucania': 'Región de la Araucanía',
    'tarapaca': 'Región de Tarapacá',
    'tarapaci': 'Región de Tarapacá',
    'antofagasta': 'Región de Antofagasta',
    'atacama': 'Región de Atacama',
    'coquimbo': 'Región de Coquimbo',
    'ohiggins': "Región del Libertador Gral. Bernardo O'Higgins",
    'maule': 'Región del Maule',
    'nuble': 'Región de Ñuble',
    'los rios': 'Región de los Ríos',
    'los lagos': 'Región de los Lagos',
    'aysen': 'Región de Aysén',
    'magallanes': 'Región de Magallanes',
}

def normalize_text(text):
    if not text: return ""
    # Remove accents for mapping key
    norm = text.lower()
    norm = norm.replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace('ñ', 'n')
    # Clean artifacts
    norm = re.sub(r'ï¿½', 'n', norm)
    norm = re.sub(r'[^a-z0-9 ]', '', norm)
    return norm.strip()

cleaned_data = []
seen_entries = set()

for item in data:
    # 1. Clean University Name
    original_uni = item['universidad']
    norm_uni = normalize_text(original_uni)
    
    # Check mapping
    found_uni = False
    for key, val in uni_map.items():
        if key in norm_uni or norm_uni in key:
            item['universidad'] = val
            found_uni = True
            break
    
    if not found_uni:
        # Just Title Case if not in map
        item['universidad'] = original_uni.title().replace(' De ', ' de ').replace(' La ', ' la ').replace(' En ', ' en ')

    # 2. Clean Location (Ubicacion)
    original_loc = item['ubicacion']
    norm_loc = normalize_text(original_loc)
    
    found_loc = False
    for key, val in region_map.items():
        if key in norm_loc:
            item['ubicacion'] = val
            found_loc = True
            break
    
    if not found_loc:
        item['ubicacion'] = original_loc.title()

    # 3. Clean Career Name
    item['nombre'] = item['nombre'].title().replace(' En ', ' en ').replace(' De ', ' de ')
    
    # 4. Clean Interests (case consistency)
    item['intereses'] = [i.capitalize() for i in item['intereses']]

    # 5. Deduplicate
    entry_key = (item['nombre'].lower(), item['universidad'].lower(), item['ubicacion'].lower())
    if entry_key not in seen_entries:
        cleaned_data.append(item)
        seen_entries.add(entry_key)

# Save cleaned data
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(cleaned_data, f, indent=2, ensure_ascii=False)

print(f"Cleanup complete. Total records: {len(cleaned_data)}")
