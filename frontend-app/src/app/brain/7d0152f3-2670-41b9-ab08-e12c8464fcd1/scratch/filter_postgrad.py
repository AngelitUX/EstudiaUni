import json

d = json.load(open(r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\src\assets\universidades-carreras.json', encoding='utf-8'))

postgrad_keywords = ['diplomado', 'magister', 'magíster', 'master', 'doctorado', 'postdoctorado', 
                     'especialidad en', 'especialización', 'postitulo', 'postítulo', 
                     'programa de especializacion', 'certificado en', 'subespecialidad']

postgrad = []
undergrad = []
for c in d:
    name_low = c['nombre'].lower()
    if any(k in name_low for k in postgrad_keywords):
        postgrad.append(c)
    else:
        undergrad.append(c)

print(f"Total: {len(d)}")
print(f"Undergraduate: {len(undergrad)}")
print(f"Postgraduate/Diplomas: {len(postgrad)}")

# Save only undergrad
with open(r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\src\assets\universidades-carreras.json', 'w', encoding='utf-8') as f:
    json.dump(undergrad, f, indent=2, ensure_ascii=False)

print(f"\nSaved {len(undergrad)} undergraduate careers.")
