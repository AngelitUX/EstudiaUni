import json

d = json.load(open(r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\src\assets\universidades-carreras.json', encoding='utf-8'))

# Additional postgrad keywords to filter
more_postgrad = [
    'programa de especialidad', 'especializacion en', 'especialización en',
    'programa de formacion', 'programa de perfeccionamiento',
    'curso de especializacion', 'programa de continuidad',
    'habilitacion profesional', 'prosecucion de estudios',
    'programa de segunda titulacion', 'doble grado',
    'mencion en', '(online)', '(a distancia)', '(semipresencial)',
    'programa de titulo profesional', 'subespecialidad',
    'programa especial de titulacion', 'programa vespertino de continuidad',
    'programa prosecucion', 'programa advance',
]

undergrad = []
removed = 0
for c in d:
    name_low = c['nombre'].lower()
    if any(k in name_low for k in more_postgrad):
        removed += 1
    else:
        undergrad.append(c)

print(f"Before: {len(d)}")
print(f"Removed: {removed}")
print(f"After: {len(undergrad)}")

with open(r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\src\assets\universidades-carreras.json', 'w', encoding='utf-8') as f:
    json.dump(undergrad, f, indent=2, ensure_ascii=False)

# Also re-verify scores
scores = [c['puntajeCorte2025'] for c in undergrad]
zeros = sum(1 for s in scores if s == 0)
print(f"\nScores range: {min(scores):.1f} - {max(scores):.1f}")
print(f"Average: {sum(scores)/len(scores):.1f}")
print(f"Zeros: {zeros}")
print(f"Unis: {len(set(c['universidad'] for c in undergrad))}")
print(f"Regions: {len(set(c['ubicacion'] for c in undergrad))}")
