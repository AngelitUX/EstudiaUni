import json

json_path = r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\src\assets\universidades-carreras.json'

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

def clean_text(text):
    if not isinstance(text, str): return text
    # Fix common artifacts from Latin-1 to UTF-8 mess
    text = text.replace('ï¿½', 'í') # Very common for í in Valparaíso
    text = text.replace('Valparaï¿', 'Valparaíso')
    text = text.replace('Biobï¿', 'Biobío')
    text = text.replace('ï¿', '') # Catch all
    
    # Specific common fixes for this dataset
    text = text.replace('Valparaiso', 'Valparaíso')
    text = text.replace('Concepcion', 'Concepción')
    text = text.replace('Biobio', 'Biobío')
    text = text.replace('Araucania', 'Araucanía')
    text = text.replace('Tarapaca', 'Tarapacá')
    text = text.replace('Aysen', 'Aysén')
    text = text.replace('Magallanes', 'Magallanes')
    
    # Capitalize career names if they are all caps
    if text.isupper():
        text = text.title()
    
    return text

for item in data:
    item['nombre'] = clean_text(item['nombre'])
    item['universidad'] = clean_text(item['universidad'])
    item['ubicacion'] = clean_text(item['ubicacion'])
    item['descripcion'] = clean_text(item['descripcion'])

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Text cleaning complete.")
