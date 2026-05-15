import json

json_path = r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\src\assets\universidades-carreras.json'

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

def norm(t):
    return t.lower().replace('á','a').replace('é','e').replace('í','i').replace('ó','o').replace('ú','u').replace('ñ','n')

def has_interest(item, interest):
    return any(norm(i) == norm(interest) for i in item['intereses'])

def add_interest(item, interest):
    if not has_interest(item, interest):
        item['intereses'].append(interest)

for item in data:
    n = norm(item['nombre'])
    a = norm(item['area'])
    
    # Geografía -> geography-related careers
    if any(k in n for k in ['geografia', 'geologia', 'geofisica', 'agronomia', 'forestal', 'medio ambiente', 'ambiental']):
        add_interest(item, 'Geografía')
    
    # Química -> chemistry-related careers
    if any(k in n for k in ['quimica', 'farmacia', 'bioquimica']):
        add_interest(item, 'Química')
    
    # Física -> physics-related
    if any(k in n for k in ['fisica', 'astronomia', 'geofisica']):
        add_interest(item, 'Física')
    
    # Biología -> biology-related
    if any(k in n for k in ['biologia', 'bioquimica', 'biotecnologia', 'veterinaria', 'marina', 'agronomia', 'forestal']):
        add_interest(item, 'Biología')
    
    # Arquitectura
    if any(k in n for k in ['arquitectura', 'construccion civil', 'urbanismo']):
        add_interest(item, 'Arquitectura')
    
    # Música
    if any(k in n for k in ['musica', 'musical', 'interpretacion musical', 'composicion']):
        add_interest(item, 'Música')
    
    # Economía
    if any(k in n for k in ['economia', 'comercial', 'finanzas', 'administracion', 'contador', 'contabilidad']):
        add_interest(item, 'Economía')
    
    # Liderazgo -> management/admin careers
    if any(k in n for k in ['administracion', 'comercial', 'gestion', 'publica']):
        add_interest(item, 'Liderazgo')
    
    # Historia
    if any(k in n for k in ['historia', 'patrimonio', 'antropologia', 'arqueologia', 'filosofia']):
        add_interest(item, 'Historia')
    
    # Programación -> CS careers
    if any(k in n for k in ['informatica', 'computacion', 'software', 'sistemas', 'datos']):
        add_interest(item, 'Programación')
    
    # Matemáticas -> math-heavy careers
    if any(k in n for k in ['matematica', 'estadistica', 'actuaria', 'astronomia']):
        add_interest(item, 'Matemáticas')
    
    # Innovación -> tech/design careers
    if any(k in n for k in ['innovacion', 'emprendimiento', 'biotecnologia', 'robotica', 'mecatronica']):
        add_interest(item, 'Innovación')

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# Verify
interests_ui = ['Ingeniería', 'Matemáticas', 'Tecnología', 'Ciencias', 'Salud', 'Justicia', 'Lectura', 'Diseño', 'Negocios', 'Ayuda social', 'Innovación', 'Programación', 'Enseñanza', 'Investigación', 'Liderazgo', 'Historia', 'Geografía', 'Arte', 'Biología', 'Química', 'Física', 'Derecho', 'Arquitectura', 'Música', 'Economía']
print('Interest coverage after enrichment:')
for interest in interests_ui:
    ni = norm(interest)
    count = sum(1 for c in data if any(ni in norm(i) for i in c['intereses']))
    marker = ' ⚠️' if count < 3 else ' ✅'
    print(f'  {interest}: {count}{marker}')
