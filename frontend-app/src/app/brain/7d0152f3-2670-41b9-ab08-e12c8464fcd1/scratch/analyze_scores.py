import json

d = json.load(open(r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\src\assets\universidades-carreras.json', encoding='utf-8'))
zeros = [c for c in d if c['puntajeCorte2025'] == 0]
nonzero = [c for c in d if c['puntajeCorte2025'] > 0]

print(f"Total: {len(d)}")
print(f"Con puntaje: {len(nonzero)}")
print(f"Sin puntaje (0): {len(zeros)}")
print()

scores = sorted([c['puntajeCorte2025'] for c in nonzero])
print(f"Rango actual: {min(scores)} - {max(scores)}")
print(f"Promedio: {sum(scores)/len(scores):.1f}")
print()

# Check suspicious
suspicious_low = [c for c in nonzero if c['puntajeCorte2025'] < 400]
suspicious_high = [c for c in nonzero if c['puntajeCorte2025'] > 950]

print(f"Sospechosamente bajos (<400): {len(suspicious_low)}")
for c in suspicious_low[:10]:
    print(f"  {c['puntajeCorte2025']} - {c['nombre']} @ {c['universidad']}")

print(f"\nMuy altos (>950): {len(suspicious_high)}")
for c in suspicious_high[:10]:
    print(f"  {c['puntajeCorte2025']} - {c['nombre']} @ {c['universidad']}")

# Show distribution by university for zeros
print(f"\nCarreras sin puntaje por universidad:")
uni_zeros = {}
for c in zeros:
    u = c['universidad']
    uni_zeros[u] = uni_zeros.get(u, 0) + 1
for u, count in sorted(uni_zeros.items(), key=lambda x: -x[1])[:20]:
    print(f"  {u}: {count}")
