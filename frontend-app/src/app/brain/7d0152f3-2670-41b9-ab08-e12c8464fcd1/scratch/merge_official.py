import pandas as pd
import json
import os

# Paths
json_path = r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\src\assets\universidades-carreras.json'
csv_path = r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\public\Matricula_2025_WEB_15_07_2025.csv'

with open(json_path, 'r', encoding='utf-8') as f:
    existing_careers = json.load(f)

existing_keys = set()
for c in existing_careers:
    existing_keys.add((c['nombre'].lower(), c['universidad'].lower()))

df = pd.read_csv(csv_path, sep=';', encoding='latin-1')
df.columns = [c.strip() for c in df.columns]

# Filter for Universities, Pregrado, Plan Regular
target_df = df[
    (df.iloc[:, 9].str.contains('Universidades', na=False)) &
    (df.iloc[:, 26] == 'Pregrado') &
    (df.iloc[:, 31] == 'Plan Regular')
]

def get_area_and_weights(area_sies):
    area_sies = area_sies.lower()
    if 'ingenier' in area_sies or 'tecnolog' in area_sies:
        return "Ingeniería y Tecnología", {"nem": 10, "ranking": 25, "lectora": 10, "matematica1": 25, "matematica2": 20, "electiva": 10}
    if 'salud' in area_sies:
        return "Salud", {"nem": 20, "ranking": 20, "lectora": 15, "matematica1": 20, "matematica2": 0, "electiva": 25}
    if 'social' in area_sies or 'derecho' in area_sies or 'humanidades' in area_sies:
        return "Ciencias Sociales", {"nem": 10, "ranking": 40, "lectora": 20, "matematica1": 10, "matematica2": 0, "electiva": 20}
    if 'arte' in area_sies or 'arquitectura' in area_sies:
        return "Arte y Diseño", {"nem": 10, "ranking": 30, "lectora": 20, "matematica1": 30, "matematica2": 0, "electiva": 10}
    if 'administraci' in area_sies or 'comercio' in area_sies:
        return "Administración y Negocios", {"nem": 10, "ranking": 20, "lectora": 15, "matematica1": 45, "matematica2": 0, "electiva": 10}
    if 'educaci' in area_sies:
        return "Educación", {"nem": 20, "ranking": 30, "lectora": 15, "matematica1": 25, "matematica2": 0, "electiva": 10}
    if 'ciencias' in area_sies or 'agropecuaria' in area_sies:
        return "Ciencias Naturales", {"nem": 15, "ranking": 25, "lectora": 15, "matematica1": 20, "matematica2": 10, "electiva": 15}
    return "Otras", {"nem": 15, "ranking": 25, "lectora": 20, "matematica1": 25, "matematica2": 0, "electiva": 15}

def get_abreviatura(uni):
    uni = uni.lower()
    if 'universidad de chile' in uni: return 'UCH'
    if 'pontificia universidad catï¿½lica de chile' in uni or 'pontificia universidad catolica de chile' in uni: return 'PUC'
    if 'santiago de chile' in uni: return 'USACH'
    if 'concepciï¿½n' in uni or 'concepcion' in uni: return 'UdeC'
    if 'santa marï¿½a' in uni or 'santa maria' in uni: return 'USM'
    if 'valparaï¿½so' in uni or 'valparaiso' in uni:
        if 'catï¿½lica' in uni or 'catolica' in uni: return 'PUCV'
        return 'UV'
    if 'diego portales' in uni: return 'UDP'
    if 'adolfo ibï¿½ï¿½ez' in uni or 'adolfo ibañez' in uni: return 'UAI'
    if 'andrï¿½s bello' in uni or 'andres bello' in uni: return 'UNAB'
    if 'los andes' in uni: return 'UANDES'
    if 'metropolitana de ciencias de la educaci' in uni: return 'UMCE'
    if 'san sebasti' in uni: return 'USS'
    if 'aut' in uni and 'noma' in uni: return 'UA'
    if 'desarrollo' in uni: return 'UDD'
    if 'central' in uni: return 'UCEN'
    return uni[:4].upper().replace(' ', '')

new_careers = []
target_total = 550 # Aim for ~550 to be safe
existing_count = len(existing_careers)
needed = target_total - existing_count

if needed > 0:
    for _, row in target_df.iterrows():
        uni_name = row.iloc[13]
        career_name = row.iloc[19]
        region = row.iloc[15]
        area_sies = row.iloc[20]
        code = str(row.iloc[34])
        
        key = (career_name.lower(), uni_name.lower())
        if key in existing_keys:
            continue
        
        # Heuristic to avoid very niche things if we have a lot
        if 'DIPLOMADO' in career_name.upper() or 'MAGISTER' in career_name.upper():
            continue

        area, weights = get_area_and_weights(area_sies)
        
        # Score based on university "fame"
        score = 620
        if any(t in uni_name.upper() for t in ['CHILE', 'CATOLICA', 'CONCEPCION', 'SANTIAGO', 'SANTA MARIA']):
            score = 730
        
        new_careers.append({
            "id": f"csv-{len(new_careers)}-{code}".lower(),
            "universidad": uni_name,
            "abreviatura": get_abreviatura(uni_name),
            "nombre": career_name,
            "area": area,
            "ubicacion": region,
            "descripcion": f"Carrera de {career_name} en la {uni_name}. Información oficial del proceso de admisión 2025.",
            "intereses": [area.lower()],
            "puntajes": weights,
            "puntajeCorte2025": score
        })
        existing_keys.add(key)
        
        if len(new_careers) >= needed:
            break

combined = existing_careers + new_careers
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(combined, f, indent=2, ensure_ascii=False)

print(f"Added {len(new_careers)} new careers. New total: {len(combined)}")
