import json

json_path = r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\src\assets\universidades-carreras.json'

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    nombre = item['nombre'].lower()
    area = item['area'].lower()
    intereses = [i.lower() for i in item['intereses']]
    
    # If it's an engineering career, add 'ingeniería' to interests if not present
    if 'ingeniería' in nombre or 'ingenieria' in nombre or 'ingeniería' in area:
        if 'ingeniería' not in intereses:
            item['intereses'].append('ingeniería')
            
    # Also fix some common redundancies/missing tags
    if 'salud' in area and 'salud' not in intereses:
        item['intereses'].append('salud')
    if 'derecho' in nombre and 'derecho' not in intereses:
        item['intereses'].append('derecho')
    if 'diseño' in nombre and 'diseño' not in intereses:
        item['intereses'].append('diseño')

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Data interests updated.")
